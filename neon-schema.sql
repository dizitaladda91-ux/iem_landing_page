-- ==============================================================================
-- JASHN REALTY PRESENTS RUNWAY KIDS FASHION WEEK 2026
-- PRODUCTION DATABASE SCHEMA FOR NEON SERVERLESS POSTGRES
-- ==============================================================================
-- Neon Console: https://console.neon.tech
-- Execute this entire file in your Neon SQL Editor to set up all tables & indexes.
-- ==============================================================================

-- 1. CANDIDATES TABLE (Contestants Voting Cards)
CREATE TABLE IF NOT EXISTS candidates (
    id VARCHAR(50) PRIMARY KEY,                         -- Unique ID like 'KFW-101', 'KFW-102'
    name VARCHAR(255) NOT NULL,                         -- Child's Full Name
    age VARCHAR(100) NOT NULL,                          -- Age / Class
    category VARCHAR(255) NOT NULL,                     -- Ramp walk category
    city VARCHAR(255) DEFAULT 'Lucknow',                -- City / Locality
    image_url TEXT NOT NULL,                            -- Cloudinary URL or Hosted image path
    badge VARCHAR(100) DEFAULT 'WILD CARD CONTENDER',   -- Badge label
    bio TEXT DEFAULT '',                                -- Child's bio
    votes INTEGER DEFAULT 0,                            -- Total verified votes count
    likes INTEGER DEFAULT 0,                            -- Social engagement likes
    shares INTEGER DEFAULT 0,                           -- Social shares
    is_active BOOLEAN DEFAULT TRUE,                     -- TRUE = Live on public voting, FALSE = Hidden
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()   -- Registration timestamp
);

CREATE INDEX IF NOT EXISTS idx_candidates_active_votes ON candidates(is_active, votes DESC);
CREATE INDEX IF NOT EXISTS idx_candidates_category ON candidates(category);


-- 2. VOTE_RECORDS TABLE (Verified Voter Leads & Ballots)
CREATE TABLE IF NOT EXISTS vote_records (
    id VARCHAR(100) PRIMARY KEY,                        -- Unique Vote ID like 'VOTE-17932829-abc'
    contestant_id VARCHAR(50) NOT NULL                  -- References candidates(id)
        REFERENCES candidates(id) ON DELETE CASCADE,
    contestant_name VARCHAR(255),                       -- Cached contestant name for instant export
    voter_name VARCHAR(255) DEFAULT 'Supporter',        -- Voter's name
    voter_phone VARCHAR(50),                            -- Verified Mobile / WhatsApp number
    voter_email VARCHAR(255),                           -- Voter's email address
    voter_city VARCHAR(100) DEFAULT 'Lucknow',          -- Voter's city
    ip VARCHAR(100),                                    -- Client IP address for fraud prevention
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()    -- Exact timestamp when vote was cast
);

CREATE INDEX IF NOT EXISTS idx_vote_contestant ON vote_records(contestant_id);
CREATE INDEX IF NOT EXISTS idx_vote_voter_phone ON vote_records(voter_phone);
CREATE INDEX IF NOT EXISTS idx_vote_voter_email ON vote_records(voter_email);
CREATE INDEX IF NOT EXISTS idx_vote_timestamp ON vote_records(timestamp DESC);


-- 3. AUDIT_LOGS TABLE (Security, Activity & Administration History)
CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(100) PRIMARY KEY,                        -- Unique Log ID like 'LOG-17932829-xyz'
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),   -- Log timestamp
    action VARCHAR(100) NOT NULL,                       -- Action code: 'LOGIN', 'CANDIDATE_ADD', etc.
    category VARCHAR(100) NOT NULL,                     -- 'AUTH', 'CANDIDATE', 'VOTING', 'SECURITY'
    username VARCHAR(100) NOT NULL,                     -- Admin username or 'System' / 'Parent'
    description TEXT NOT NULL,                          -- Human-readable action description
    details TEXT,                                       -- Extra technical details
    ip VARCHAR(100)                                     -- Client IP
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_category ON audit_logs(category);


-- 4. REVOKED_TOKENS TABLE (JWT Immediate Session Termination)
CREATE TABLE IF NOT EXISTS revoked_tokens (
    jti VARCHAR(100) PRIMARY KEY,                       -- Unique JWT ID
    exp BIGINT NOT NULL,                                -- Expiry UNIX timestamp
    revoked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()   -- When token was revoked
);

CREATE INDEX IF NOT EXISTS idx_revoked_exp ON revoked_tokens(exp);
