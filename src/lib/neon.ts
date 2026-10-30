/**
 * Neon Serverless Postgres Client
 * Supports both @neondatabase/serverless driver and native HTTP SQL fetch
 */

import { Candidate, VoteRecord, AuditLog } from "./dataStore";

const DATABASE_URL = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL || "";

// In-memory cache for revoked tokens to keep auth checks ultra-fast (<1ms)
const revokedTokensCache = new Set<string>();

// Flag to ensure tables are initialized once
let isInitialized = false;

/**
 * Check if a Neon connection string is configured
 */
export function isNeonConfigured(): boolean {
  if (!DATABASE_URL) return false;
  return (
    DATABASE_URL.includes("neon.tech") ||
    DATABASE_URL.startsWith("postgres://") ||
    DATABASE_URL.startsWith("postgresql://")
  );
}

/**
 * Parse host and password from postgres connection string
 */
function parseNeonUrl(connStr: string): { host: string; pass: string; dbName: string } {
  try {
    const url = new URL(connStr);
    return {
      host: url.host,
      pass: decodeURIComponent(url.password || ""),
      dbName: url.pathname.replace(/^\//, "") || "neondb",
    };
  } catch {
    return { host: "", pass: "", dbName: "" };
  }
}

/**
 * Execute raw SQL query against Neon Postgres
 */
export async function queryNeon<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  if (!isNeonConfigured()) {
    throw new Error("Neon DATABASE_URL is not configured.");
  }

  // 1. Try official @neondatabase/serverless package if installed
  try {
    // Dynamic import to avoid crash if package not installed yet
    const { neon } = require("@neondatabase/serverless");
    const sqlExecutor = neon(DATABASE_URL);
    
    // Convert parameterized query $1, $2 to array parameters
    const rows = await sqlExecutor(sql, params);
    return rows as T[];
  } catch (err: any) {
    // If package not found, fallback to Neon's native HTTP SQL API
    if (err.code !== "MODULE_NOT_FOUND" && !err.message?.includes("Cannot find module")) {
      console.warn("Neon driver error, trying direct HTTP fallback:", err.message);
    }
  }

  // 2. Direct HTTP SQL fetch endpoint provided by Neon Serverless
  const { host, pass } = parseNeonUrl(DATABASE_URL);
  if (!host) {
    throw new Error("Invalid Neon connection string.");
  }

  const endpoint = `https://${host}/sql`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${pass}`,
      "Neon-Connection-String": DATABASE_URL,
    },
    body: JSON.stringify({
      query: sql,
      params,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Neon HTTP query error (${response.status}): ${text}`);
  }

  const data = await response.json();
  return (data.rows || []) as T[];
}

/**
 * Auto-initialize Neon tables on first connection
 */
export async function initNeonDatabase(): Promise<boolean> {
  if (!isNeonConfigured() || isInitialized) return true;

  try {
    // Create candidates table
    await queryNeon(`
      CREATE TABLE IF NOT EXISTS candidates (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        age VARCHAR(100) NOT NULL,
        category VARCHAR(255) NOT NULL,
        city VARCHAR(255) DEFAULT 'Lucknow',
        image_url TEXT NOT NULL,
        badge VARCHAR(100) DEFAULT 'WILD CARD CONTENDER',
        bio TEXT DEFAULT '',
        votes INTEGER DEFAULT 0,
        likes INTEGER DEFAULT 0,
        shares INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_candidates_active_votes ON candidates(is_active, votes DESC);
    `);

    // Create vote_records table
    await queryNeon(`
      CREATE TABLE IF NOT EXISTS vote_records (
        id VARCHAR(100) PRIMARY KEY,
        contestant_id VARCHAR(50) REFERENCES candidates(id) ON DELETE CASCADE,
        contestant_name VARCHAR(255),
        voter_name VARCHAR(255),
        voter_phone VARCHAR(50),
        voter_email VARCHAR(255),
        voter_city VARCHAR(100),
        ip VARCHAR(100),
        timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_vote_contestant ON vote_records(contestant_id);
      CREATE INDEX IF NOT EXISTS idx_vote_voter_phone ON vote_records(voter_phone);
      CREATE INDEX IF NOT EXISTS idx_vote_voter_email ON vote_records(voter_email);
    `);

    // Create audit_logs table
    await queryNeon(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id VARCHAR(100) PRIMARY KEY,
        timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        action VARCHAR(100) NOT NULL,
        category VARCHAR(100) NOT NULL,
        username VARCHAR(100) NOT NULL,
        description TEXT NOT NULL,
        details TEXT,
        ip VARCHAR(100)
      );
      CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp DESC);
    `);

    // Create revoked_tokens table (for immediate session end on logout)
    await queryNeon(`
      CREATE TABLE IF NOT EXISTS revoked_tokens (
        jti VARCHAR(100) PRIMARY KEY,
        exp BIGINT NOT NULL,
        revoked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_revoked_exp ON revoked_tokens(exp);
    `);

    // Populate in-memory revoked tokens cache from Neon
    const revoked = await queryNeon(`SELECT jti FROM revoked_tokens WHERE exp > $1;`, [
      Math.floor(Date.now() / 1000),
    ]);
    revoked.forEach((r) => revokedTokensCache.add(r.jti));

    isInitialized = true;
    return true;
  } catch (error) {
    console.error("Neon database initialization error:", error);
    return false;
  }
}

// -------------------------------------------------------------
// Candidate Operations (Neon)
// -------------------------------------------------------------
export async function getNeonCandidates(): Promise<Candidate[]> {
  await initNeonDatabase();
  const rows = await queryNeon(`
    SELECT id, name, age, category, city, image_url as "imageUrl", 
           badge, bio, votes, likes, shares, is_active as "isActive", 
           created_at as "createdAt"
    FROM candidates
    ORDER BY votes DESC, created_at DESC;
  `);
  return rows.map((r) => ({
    ...r,
    createdAt: new Date(r.createdAt).toISOString(),
  }));
}

export async function addNeonCandidate(candidate: Candidate): Promise<Candidate> {
  await initNeonDatabase();
  await queryNeon(
    `INSERT INTO candidates (id, name, age, category, city, image_url, badge, bio, votes, likes, shares, is_active)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12);`,
    [
      candidate.id,
      candidate.name,
      candidate.age,
      candidate.category,
      candidate.city,
      candidate.imageUrl,
      candidate.badge,
      candidate.bio || "",
      candidate.votes,
      candidate.likes,
      candidate.shares,
      candidate.isActive,
    ]
  );
  return candidate;
}

export async function updateNeonCandidate(
  id: string,
  updates: Partial<Candidate>
): Promise<Candidate | null> {
  await initNeonDatabase();
  const fields: string[] = [];
  const values: any[] = [];
  let idx = 1;

  if (updates.name !== undefined) {
    fields.push(`name = $${idx++}`);
    values.push(updates.name);
  }
  if (updates.age !== undefined) {
    fields.push(`age = $${idx++}`);
    values.push(updates.age);
  }
  if (updates.category !== undefined) {
    fields.push(`category = $${idx++}`);
    values.push(updates.category);
  }
  if (updates.city !== undefined) {
    fields.push(`city = $${idx++}`);
    values.push(updates.city);
  }
  if (updates.imageUrl !== undefined) {
    fields.push(`image_url = $${idx++}`);
    values.push(updates.imageUrl);
  }
  if (updates.badge !== undefined) {
    fields.push(`badge = $${idx++}`);
    values.push(updates.badge);
  }
  if (updates.bio !== undefined) {
    fields.push(`bio = $${idx++}`);
    values.push(updates.bio);
  }
  if (updates.isActive !== undefined) {
    fields.push(`is_active = $${idx++}`);
    values.push(updates.isActive);
  }
  if (updates.votes !== undefined) {
    fields.push(`votes = $${idx++}`);
    values.push(updates.votes);
  }

  if (fields.length === 0) return null;

  values.push(id);
  const sql = `UPDATE candidates SET ${fields.join(", ")} WHERE id = $${idx} RETURNING *;`;
  const result = await queryNeon(sql, values);

  if (result.length === 0) return null;
  const row = result[0];
  return {
    id: row.id,
    name: row.name,
    age: row.age,
    category: row.category,
    city: row.city,
    imageUrl: row.image_url,
    badge: row.badge,
    bio: row.bio,
    votes: row.votes,
    likes: row.likes,
    shares: row.shares,
    isActive: row.is_active,
    createdAt: new Date(row.created_at).toISOString(),
  };
}

export async function deleteNeonCandidate(id: string): Promise<boolean> {
  await initNeonDatabase();
  await queryNeon(`DELETE FROM candidates WHERE id = $1;`, [id]);
  return true;
}

// -------------------------------------------------------------
// Voting & Leads Operations (Neon)
// -------------------------------------------------------------
export async function getNeonVotes(): Promise<VoteRecord[]> {
  await initNeonDatabase();
  const rows = await queryNeon(`
    SELECT id, contestant_id as "contestantId", contestant_name as "contestantName",
           voter_name as "voterName", voter_phone as "voterPhone", voter_email as "voterEmail",
           voter_city as "voterCity", ip, timestamp
    FROM vote_records
    ORDER BY timestamp DESC;
  `);
  return rows.map((r) => ({
    ...r,
    timestamp: new Date(r.timestamp).toISOString(),
  }));
}

export async function recordNeonVote(vote: VoteRecord): Promise<void> {
  await initNeonDatabase();
  await queryNeon(
    `INSERT INTO vote_records (id, contestant_id, contestant_name, voter_name, voter_phone, voter_email, voter_city, ip, timestamp)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW());`,
    [
      vote.id,
      vote.contestantId,
      vote.contestantName,
      vote.voterName,
      vote.voterPhone,
      vote.voterEmail,
      vote.voterCity,
      vote.ip,
    ]
  );

  // Increment vote on candidate
  await queryNeon(`UPDATE candidates SET votes = votes + 1, likes = likes + 1 WHERE id = $1;`, [
    vote.contestantId,
  ]);
}

export async function checkNeonDuplicateVote(
  contestantId: string,
  phone: string,
  email: string
): Promise<boolean> {
  await initNeonDatabase();
  const rows = await queryNeon(
    `SELECT id FROM vote_records 
     WHERE contestant_id = $1 
       AND (
         ($2 <> '' AND voter_phone = $2) OR 
         ($3 <> '' AND LOWER(voter_email) = LOWER($3))
       )
     LIMIT 1;`,
    [contestantId, phone || "", email || ""]
  );
  return rows.length > 0;
}

// -------------------------------------------------------------
// Audit Logs (Neon)
// -------------------------------------------------------------
export async function getNeonAuditLogs(filter?: {
  category?: string;
  search?: string;
  limit?: number;
}): Promise<AuditLog[]> {
  await initNeonDatabase();
  let sql = `SELECT id, timestamp, action, category, username as user, description, details, ip FROM audit_logs`;
  const params: any[] = [];
  const conditions: string[] = [];
  let idx = 1;

  if (filter?.category && filter.category !== "ALL") {
    conditions.push(`category = $${idx++}`);
    params.push(filter.category);
  }

  if (filter?.search) {
    conditions.push(
      `(description ILIKE $${idx} OR action ILIKE $${idx} OR username ILIKE $${idx} OR details ILIKE $${idx})`
    );
    params.push(`%${filter.search}%`);
    idx++;
  }

  if (conditions.length > 0) {
    sql += ` WHERE ` + conditions.join(" AND ");
  }

  sql += ` ORDER BY timestamp DESC LIMIT ${filter?.limit || 250};`;

  const rows = await queryNeon(sql, params);
  return rows.map((r) => ({
    ...r,
    timestamp: new Date(r.timestamp).toISOString(),
  }));
}

export async function addNeonAuditLog(log: AuditLog): Promise<void> {
  await initNeonDatabase();
  await queryNeon(
    `INSERT INTO audit_logs (id, action, category, username, description, details, ip, timestamp)
     VALUES ($1, $2, $3, $4, $5, $6, $7, NOW());`,
    [log.id, log.action, log.category, log.user, log.description, log.details || "", log.ip || ""]
  );
}

export async function clearNeonAuditLogs(): Promise<void> {
  await initNeonDatabase();
  await queryNeon(`DELETE FROM audit_logs;`);
}

// -------------------------------------------------------------
// Revoked Tokens (Neon)
// -------------------------------------------------------------
export async function addNeonRevokedToken(jti: string, exp: number): Promise<void> {
  revokedTokensCache.add(jti);
  if (isNeonConfigured()) {
    try {
      await initNeonDatabase();
      await queryNeon(
        `INSERT INTO revoked_tokens (jti, exp, revoked_at) VALUES ($1, $2, NOW()) ON CONFLICT (jti) DO NOTHING;`,
        [jti, exp]
      );
    } catch (err) {
      console.warn("Error saving revoked token to Neon:", err);
    }
  }
}

export function isNeonTokenRevoked(jti: string): boolean {
  return revokedTokensCache.has(jti);
}
