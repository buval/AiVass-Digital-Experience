import { pool } from "@workspace/db";
import { logger } from "./logger.js";

/**
 * Idempotent startup schema guard. Couples the schema this release depends
 * on to the application deployment, so a fresh production rollout cannot
 * run against a database missing the download_access_codes table.
 * (Full schema management still lives in lib/db via drizzle-kit push.)
 */
export async function ensureSchema(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS download_access_codes (
      id text PRIMARY KEY,
      email text NOT NULL,
      code_hash text NOT NULL,
      attempts_remaining integer NOT NULL DEFAULT 5,
      expires_at timestamp with time zone NOT NULL,
      created_at timestamp with time zone NOT NULL DEFAULT now(),
      consumed_at timestamp with time zone,
      session_token text,
      session_expires_at timestamp with time zone
    );
  `);
  await pool.query(
    `CREATE INDEX IF NOT EXISTS download_access_codes_email_idx
       ON download_access_codes (email, expires_at)`,
  );
  await pool.query(
    `CREATE INDEX IF NOT EXISTS download_access_codes_session_idx
       ON download_access_codes (session_token)`,
  );
  logger.info("Schema ensured: download_access_codes");
}
