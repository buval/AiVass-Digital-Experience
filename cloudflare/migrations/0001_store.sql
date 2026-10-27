CREATE TABLE download_tokens (
  token TEXT PRIMARY KEY,
  guide_slug TEXT NOT NULL,
  buyer_email TEXT NOT NULL,
  attempts_remaining INTEGER NOT NULL DEFAULT 3 CHECK (attempts_remaining >= 0),
  expires_at INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  stripe_session_id TEXT,
  email_claim TEXT,
  email_claimed_at INTEGER,
  email_sent_at INTEGER,
  UNIQUE (stripe_session_id, guide_slug)
);
CREATE INDEX tokens_buyer_guide ON download_tokens(buyer_email, guide_slug, created_at DESC);

CREATE TABLE download_access_codes (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  code_hash TEXT NOT NULL,
  attempts_remaining INTEGER NOT NULL DEFAULT 5 CHECK (attempts_remaining >= 0),
  expires_at INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  consumed_at INTEGER,
  session_token TEXT UNIQUE,
  session_expires_at INTEGER
);
CREATE INDEX codes_email_created ON download_access_codes(email, created_at DESC);

-- Bound access-code storage; issued purchase/download records are retained.
-- Expired codes are pruned by the scheduled Worker.
