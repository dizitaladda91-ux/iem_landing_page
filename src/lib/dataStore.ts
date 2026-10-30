import fs from "fs";
import path from "path";
import {
  isNeonConfigured,
  getNeonCandidates,
  addNeonCandidate,
  updateNeonCandidate,
  deleteNeonCandidate,
  getNeonVotes,
  recordNeonVote,
  checkNeonDuplicateVote,
  getNeonAuditLogs,
  addNeonAuditLog,
  clearNeonAuditLogs,
  addNeonRevokedToken,
  isNeonTokenRevoked,
} from "./neon";

export interface Candidate {
  id: string;
  name: string;
  age: string;
  category: string;
  city: string;
  imageUrl: string;
  badge: string;
  bio?: string;
  votes: number;
  likes: number;
  shares: number;
  isActive: boolean;
  createdAt: string;
}

export interface VoteRecord {
  id: string;
  contestantId: string;
  contestantName: string;
  voterName: string;
  voterPhone: string;
  voterEmail: string;
  voterCity?: string;
  ip?: string;
  timestamp: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  category: string;
  user: string;
  description: string;
  details?: string;
  ip?: string;
}

export interface RevokedTokenEntry {
  jti: string;
  exp: number;
  revokedAt: string;
}

// Data storage paths for local fallback
const DATA_DIR = path.join(process.cwd(), "data");
const CANDIDATES_FILE = path.join(DATA_DIR, "candidates.json");
const VOTES_FILE = path.join(DATA_DIR, "votes.json");
const REVOKED_TOKENS_FILE = path.join(DATA_DIR, "revoked_tokens.json");
const LOGS_FILE = path.join(DATA_DIR, "logs.json");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// Initial contestants (Empty - Only real contestants added from portal or nominations are stored and shown)
const initialSeedCandidates: Candidate[] = [];

const initialSeedLogs: AuditLog[] = [
  {
    id: "LOG-INIT-001",
    timestamp: new Date("2026-10-30T10:00:00Z").toISOString(),
    action: "SECURITY_ALERT",
    category: "SECURITY",
    user: "System",
    description: "JWT Security Engine initialized with HS256 algorithm and Single-Tab mutual exclusion.",
    details: "Single-Tab Allowance & Cross-Tab Heartbeat Lock activated.",
  },
];

// -------------------------------------------------------------
// Local JSON Helper Fallbacks
// -------------------------------------------------------------
function getLocalCandidates(): Candidate[] {
  ensureDataDir();
  if (!fs.existsSync(CANDIDATES_FILE)) {
    fs.writeFileSync(CANDIDATES_FILE, JSON.stringify(initialSeedCandidates, null, 2), "utf-8");
    return initialSeedCandidates;
  }
  try {
    const raw = fs.readFileSync(CANDIDATES_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return initialSeedCandidates;
  }
}

function saveLocalCandidates(candidates: Candidate[]): void {
  ensureDataDir();
  fs.writeFileSync(CANDIDATES_FILE, JSON.stringify(candidates, null, 2), "utf-8");
}

function getLocalVotes(): VoteRecord[] {
  ensureDataDir();
  if (!fs.existsSync(VOTES_FILE)) {
    fs.writeFileSync(VOTES_FILE, JSON.stringify([], null, 2), "utf-8");
    return [];
  }
  try {
    const raw = fs.readFileSync(VOTES_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveLocalVotes(votes: VoteRecord[]): void {
  ensureDataDir();
  fs.writeFileSync(VOTES_FILE, JSON.stringify(votes, null, 2), "utf-8");
}

function getLocalAuditLogs(filter?: { category?: string; search?: string; limit?: number }): AuditLog[] {
  ensureDataDir();
  let logs: AuditLog[] = [];
  if (!fs.existsSync(LOGS_FILE)) {
    fs.writeFileSync(LOGS_FILE, JSON.stringify(initialSeedLogs, null, 2), "utf-8");
    logs = initialSeedLogs;
  } else {
    try {
      logs = JSON.parse(fs.readFileSync(LOGS_FILE, "utf-8"));
    } catch {
      logs = initialSeedLogs;
    }
  }

  if (filter?.category && filter.category !== "ALL") {
    logs = logs.filter((l) => l.category === filter.category);
  }
  if (filter?.search) {
    const q = filter.search.toLowerCase().trim();
    logs = logs.filter(
      (l) =>
        l.description.toLowerCase().includes(q) ||
        l.action.toLowerCase().includes(q) ||
        l.user.toLowerCase().includes(q) ||
        (l.details && l.details.toLowerCase().includes(q))
    );
  }
  if (filter?.limit && filter.limit > 0) {
    logs = logs.slice(0, filter.limit);
  }
  return logs;
}

function addLocalAuditLog(entry: Omit<AuditLog, "id" | "timestamp">): AuditLog {
  ensureDataDir();
  const logs = getLocalAuditLogs();
  const newLog: AuditLog = {
    id: `LOG-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
    timestamp: new Date().toISOString(),
    ...entry,
  };
  logs.unshift(newLog);
  if (logs.length > 1000) logs.slice(0, 1000);
  fs.writeFileSync(LOGS_FILE, JSON.stringify(logs, null, 2), "utf-8");
  return newLog;
}

// -------------------------------------------------------------
// Unified High-Level Operations (Neon + Fallback)
// -------------------------------------------------------------

/**
 * Get all contestants
 */
export async function getCandidates(): Promise<Candidate[]> {
  if (isNeonConfigured()) {
    try {
      return await getNeonCandidates();
    } catch (err) {
      console.error("Neon getCandidates error, using local fallback:", err);
    }
  }
  return getLocalCandidates();
}

/**
 * Add a new candidate
 */
export async function addCandidate(
  data: Omit<Candidate, "id" | "votes" | "likes" | "shares" | "createdAt"> & {
    initialVotes?: number;
    user?: string;
  }
): Promise<Candidate> {
  const currentCandidates = await getCandidates();
  const existingNumbers = currentCandidates
    .map((c) => {
      const match = c.id.match(/\d+/);
      return match ? parseInt(match[0], 10) : 100;
    })
    .filter((n) => !isNaN(n));
  const nextNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 101;
  const newId = `KFW-${nextNumber}`;

  const initialVotes = data.initialVotes || 0;
  const newCandidate: Candidate = {
    id: newId,
    name: data.name.trim(),
    age: data.age.trim(),
    category: data.category.trim(),
    city: data.city.trim() || "Lucknow",
    imageUrl: data.imageUrl.trim() || "/images/category-1.jpg",
    badge: data.badge.trim() || "WILD CARD CONTENDER",
    bio: data.bio?.trim() || "",
    votes: initialVotes,
    likes: Math.floor(initialVotes * 0.65),
    shares: Math.floor(initialVotes * 0.35),
    isActive: data.isActive !== undefined ? data.isActive : true,
    createdAt: new Date().toISOString(),
  };

  if (isNeonConfigured()) {
    try {
      await addNeonCandidate(newCandidate);
      await addAuditLog({
        action: "CANDIDATE_ADD",
        category: "CANDIDATE",
        user: data.user || "Admin",
        description: `Added contestant ${newCandidate.name} (${newCandidate.id}) in category "${newCandidate.category}" to Neon Postgres`,
        details: `City: ${newCandidate.city}, Initial Votes: ${newCandidate.votes}`,
      });
      return newCandidate;
    } catch (err) {
      console.error("Neon addCandidate error, falling back to local:", err);
    }
  }

  // Fallback to local
  const localCandidates = getLocalCandidates();
  localCandidates.unshift(newCandidate);
  saveLocalCandidates(localCandidates);

  addAuditLog({
    action: "CANDIDATE_ADD",
    category: "CANDIDATE",
    user: data.user || "Admin",
    description: `Added contestant ${newCandidate.name} (${newCandidate.id}) in category "${newCandidate.category}"`,
    details: `City: ${newCandidate.city}, Initial Votes: ${newCandidate.votes}`,
  });

  return newCandidate;
}

/**
 * Update candidate
 */
export async function updateCandidate(
  id: string,
  updates: Partial<Candidate>,
  user: string = "Admin"
): Promise<Candidate | null> {
  if (isNeonConfigured()) {
    try {
      const updated = await updateNeonCandidate(id, updates);
      if (updated) {
        await addAuditLog({
          action: updates.isActive !== undefined ? "STATUS_TOGGLE" : "CANDIDATE_UPDATE",
          category: "CANDIDATE",
          user,
          description: `Updated contestant ${updated.name} (${id}) in Neon Postgres`,
          details: Object.keys(updates).join(", "),
        });
        return updated;
      }
    } catch (err) {
      console.error("Neon updateCandidate error, falling back to local:", err);
    }
  }

  const localCandidates = getLocalCandidates();
  const index = localCandidates.findIndex((c) => c.id === id);
  if (index === -1) return null;

  localCandidates[index] = { ...localCandidates[index], ...updates };
  saveLocalCandidates(localCandidates);

  addAuditLog({
    action: updates.isActive !== undefined ? "STATUS_TOGGLE" : "CANDIDATE_UPDATE",
    category: "CANDIDATE",
    user,
    description: `Updated details for contestant ${localCandidates[index].name} (${id})`,
    details: Object.keys(updates).join(", "),
  });

  return localCandidates[index];
}

/**
 * Delete candidate
 */
export async function deleteCandidate(id: string, user: string = "Admin"): Promise<boolean> {
  const current = (await getCandidates()).find((c) => c.id === id);
  const name = current ? current.name : id;

  if (isNeonConfigured()) {
    try {
      await deleteNeonCandidate(id);
      await addAuditLog({
        action: "CANDIDATE_DELETE",
        category: "CANDIDATE",
        user,
        description: `Deleted contestant ${name} (${id}) from Neon Postgres.`,
      });
      return true;
    } catch (err) {
      console.error("Neon deleteCandidate error, falling back to local:", err);
    }
  }

  const localCandidates = getLocalCandidates();
  const filtered = localCandidates.filter((c) => c.id !== id);
  saveLocalCandidates(filtered);

  addAuditLog({
    action: "CANDIDATE_DELETE",
    category: "CANDIDATE",
    user,
    description: `Deleted contestant ${name} (${id}) from voting roster.`,
  });

  return true;
}

/**
 * Get all voter leads
 */
export async function getVotes(): Promise<VoteRecord[]> {
  if (isNeonConfigured()) {
    try {
      return await getNeonVotes();
    } catch (err) {
      console.error("Neon getVotes error, falling back to local:", err);
    }
  }
  return getLocalVotes();
}

/**
 * Record a verified vote
 */
export async function recordVote(params: {
  contestantId: string;
  voterName: string;
  voterPhone: string;
  voterEmail: string;
  voterCity?: string;
  ip?: string;
}): Promise<{ success: boolean; error?: string; candidate?: Candidate; vote?: VoteRecord }> {
  const { contestantId, voterName, voterPhone, voterEmail, voterCity, ip } = params;

  const phone = voterPhone ? voterPhone.trim().replace(/\s+/g, "") : "";
  const email = voterEmail ? voterEmail.trim().toLowerCase() : "";
  const name = voterName ? voterName.trim() : "Supporter";

  if (!phone && !email) {
    return { success: false, error: "Please enter your Mobile Number or Email to cast your verified vote." };
  }

  // Check duplicate vote
  if (isNeonConfigured()) {
    try {
      const alreadyVoted = await checkNeonDuplicateVote(contestantId, phone, email);
      if (alreadyVoted) {
        return {
          success: false,
          error: `You have already cast your vote for this contestant using ${phone || email}. As per fair play rules, only 1 vote per verified contact is permitted per contestant.`,
        };
      }

      const allCandidates = await getCandidates();
      const candidate = allCandidates.find((c) => c.id === contestantId);
      if (!candidate) {
        return { success: false, error: "Contestant not found." };
      }

      const newVote: VoteRecord = {
        id: `VOTE-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        contestantId,
        contestantName: candidate.name,
        voterName: name,
        voterPhone: phone,
        voterEmail: email,
        voterCity: voterCity || "Lucknow",
        ip: ip || "",
        timestamp: new Date().toISOString(),
      };

      await recordNeonVote(newVote);
      candidate.votes += 1;
      candidate.likes += 1;

      await addAuditLog({
        action: "VOTE_CAST",
        category: "VOTING",
        user: name,
        description: `Verified vote cast for ${candidate.name} (${contestantId}) by ${name} (${phone || email}) [Neon DB]`,
        details: `Voter City: ${voterCity || "Lucknow"}`,
        ip,
      });

      return { success: true, candidate, vote: newVote };
    } catch (err) {
      console.error("Neon recordVote error, using local fallback:", err);
    }
  }

  // Local fallback
  const allVotes = getLocalVotes();
  const alreadyVoted = allVotes.some((v) => {
    const sameChild = v.contestantId === contestantId;
    const samePhone = phone && v.voterPhone && v.voterPhone.replace(/\s+/g, "") === phone;
    const sameEmail = email && v.voterEmail && v.voterEmail.toLowerCase() === email;
    return sameChild && (samePhone || sameEmail);
  });

  if (alreadyVoted) {
    return {
      success: false,
      error: `You have already cast your vote for this contestant using ${phone || email}. As per fair play rules, only 1 vote per verified contact is permitted per contestant.`,
    };
  }

  const localCandidates = getLocalCandidates();
  const idx = localCandidates.findIndex((c) => c.id === contestantId);
  if (idx === -1) {
    return { success: false, error: "Contestant not found." };
  }

  localCandidates[idx].votes += 1;
  localCandidates[idx].likes += 1;
  saveLocalCandidates(localCandidates);

  const newVote: VoteRecord = {
    id: `VOTE-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    contestantId,
    contestantName: localCandidates[idx].name,
    voterName: name,
    voterPhone: phone,
    voterEmail: email,
    voterCity: voterCity || "Lucknow",
    ip: ip || "",
    timestamp: new Date().toISOString(),
  };

  allVotes.unshift(newVote);
  saveLocalVotes(allVotes);

  addAuditLog({
    action: "VOTE_CAST",
    category: "VOTING",
    user: name,
    description: `Verified vote cast for ${localCandidates[idx].name} (${contestantId}) by ${name} (${phone || email})`,
    details: `Voter City: ${voterCity || "Lucknow"}`,
    ip,
  });

  return { success: true, candidate: localCandidates[idx], vote: newVote };
}

/**
 * Fast child nomination by voter / parent
 */
export async function nominateCandidateByVoter(data: {
  childName: string;
  age: string;
  category: string;
  city?: string;
  imageUrl?: string;
  parentName: string;
  parentPhone: string;
  parentEmail?: string;
  ip?: string;
}): Promise<{ success: boolean; candidate?: Candidate; error?: string }> {
  const { childName, age, category, city, imageUrl, parentName, parentPhone, parentEmail, ip } = data;

  if (!childName || !age || !category || !parentPhone) {
    return { success: false, error: "Child Name, Age, Category, and Parent Mobile are required." };
  }

  const newCandidate = await addCandidate({
    name: childName.trim(),
    age: age.trim(),
    category: category.trim(),
    city: (city || "Lucknow").trim(),
    imageUrl: (imageUrl || "/images/category-1.jpg").trim(),
    badge: "NEW NOMINEE",
    bio: `Nominated by parent ${parentName || "Parent"}. Ready to rock the runway!`,
    initialVotes: 1,
    isActive: true,
    user: `Parent (${parentName || parentPhone})`,
  });

  // Record parent's initial verified vote
  const parentVote: VoteRecord = {
    id: `VOTE-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    contestantId: newCandidate.id,
    contestantName: newCandidate.name,
    voterName: parentName ? `${parentName} (Parent)` : "Parent Supporter",
    voterPhone: parentPhone.trim(),
    voterEmail: (parentEmail || "").trim().toLowerCase(),
    voterCity: city || "Lucknow",
    ip: ip || "",
    timestamp: new Date().toISOString(),
  };

  if (isNeonConfigured()) {
    try {
      await recordNeonVote(parentVote);
    } catch {
      // ignore
    }
  } else {
    const localVotes = getLocalVotes();
    localVotes.unshift(parentVote);
    saveLocalVotes(localVotes);
  }

  await addAuditLog({
    action: "PUBLIC_NOMINATION",
    category: "VOTING",
    user: parentName || parentPhone,
    description: `Voter/Parent ${parentName || parentPhone} nominated child ${newCandidate.name} (${newCandidate.id}) for "${newCandidate.category}"`,
    details: `Mobile: ${parentPhone}, Email: ${parentEmail || "N/A"}, City: ${city || "Lucknow"}`,
    ip,
  });

  return { success: true, candidate: newCandidate };
}

/**
 * Get audit logs
 */
export async function getAuditLogs(filter?: {
  category?: string;
  search?: string;
  limit?: number;
}): Promise<AuditLog[]> {
  if (isNeonConfigured()) {
    try {
      return await getNeonAuditLogs(filter);
    } catch (err) {
      console.error("Neon getAuditLogs error, falling back to local:", err);
    }
  }
  return getLocalAuditLogs(filter);
}

/**
 * Add an audit log entry
 */
export async function addAuditLog(entry: Omit<AuditLog, "id" | "timestamp">): Promise<AuditLog> {
  const newLog: AuditLog = {
    id: `LOG-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
    timestamp: new Date().toISOString(),
    ...entry,
  };

  if (isNeonConfigured()) {
    try {
      await addNeonAuditLog(newLog);
      return newLog;
    } catch (err) {
      console.error("Neon addAuditLog error, falling back to local:", err);
    }
  }

  return addLocalAuditLog(entry);
}

/**
 * Clear audit logs
 */
export async function clearAuditLogs(): Promise<void> {
  if (isNeonConfigured()) {
    try {
      await clearNeonAuditLogs();
      return;
    } catch (err) {
      console.error("Neon clearAuditLogs error, falling back to local:", err);
    }
  }

  ensureDataDir();
  const resetLogs: AuditLog[] = [
    {
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: "SECURITY_ALERT",
      category: "SECURITY",
      user: "Admin",
      description: "Audit Logs history was cleared by Administrator.",
    },
  ];
  fs.writeFileSync(LOGS_FILE, JSON.stringify(resetLogs, null, 2), "utf-8");
}

/**
 * Revoke token for logout
 */
export async function revokeToken(jti: string, exp?: number): Promise<void> {
  if (!jti) return;
  const now = Math.floor(Date.now() / 1000);
  const expiry = exp || now + 86400;

  // Add to Neon revoked tokens
  await addNeonRevokedToken(jti, expiry);

  // Add to local json file
  ensureDataDir();
  let entries: RevokedTokenEntry[] = [];
  try {
    if (fs.existsSync(REVOKED_TOKENS_FILE)) {
      entries = JSON.parse(fs.readFileSync(REVOKED_TOKENS_FILE, "utf-8"));
    }
  } catch {
    entries = [];
  }
  entries = entries.filter((e) => e.exp > now);
  entries.push({ jti, exp: expiry, revokedAt: new Date().toISOString() });
  fs.writeFileSync(REVOKED_TOKENS_FILE, JSON.stringify(entries, null, 2), "utf-8");
}

/**
 * Check if a token's jti has been revoked
 */
export function isTokenRevoked(jti: string): boolean {
  if (!jti) return true;
  if (isNeonTokenRevoked(jti)) return true;

  try {
    if (fs.existsSync(REVOKED_TOKENS_FILE)) {
      const entries: RevokedTokenEntry[] = JSON.parse(fs.readFileSync(REVOKED_TOKENS_FILE, "utf-8"));
      return entries.some((e) => e.jti === jti);
    }
  } catch {
    // ignore
  }
  return false;
}

/**
 * Compute stats for admin portal
 */
export async function getStats() {
  const candidates = await getCandidates();
  const votes = await getVotes();
  const logs = await getAuditLogs();

  const totalVotes = candidates.reduce((sum, c) => sum + c.votes, 0);
  const totalVerifiedLeads = votes.length;

  const uniqueVoterIdentifiers = new Set<string>();
  votes.forEach((v) => {
    if (v.voterPhone) uniqueVoterIdentifiers.add(v.voterPhone);
    if (v.voterEmail) uniqueVoterIdentifiers.add(v.voterEmail);
  });

  const leadingCandidate = [...candidates].sort((a, b) => b.votes - a.votes)[0] || null;

  return {
    totalCandidates: candidates.length,
    activeCandidates: candidates.filter((c) => c.isActive).length,
    totalVotes,
    totalVerifiedLeads,
    uniqueVotersCount: uniqueVoterIdentifiers.size,
    totalLogsCount: logs.length,
    leadingCandidate,
    dbMode: isNeonConfigured()
      ? "Neon Serverless Postgres Connected ⚡"
      : "Local High-Speed Persistent DB",
  };
}
