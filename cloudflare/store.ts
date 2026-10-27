import type { DownloadToken } from "./types";

export const TOKEN_TTL = 72 * 60 * 60 * 1000;
export const CODE_TTL = 15 * 60 * 1000;
export const SESSION_TTL = 30 * 60 * 1000;
const EMAIL_LEASE = 5 * 60 * 1000;

export class Store {
  constructor(private db: D1Database) {}

  async checkoutToken(
    session: string,
    slug: string,
    email: string,
    now: number,
  ) {
    const token = crypto.randomUUID();
    await this.db
      .prepare(
        `INSERT INTO download_tokens
      (token,guide_slug,buyer_email,expires_at,created_at,stripe_session_id)
      VALUES (?,?,?,?,?,?) ON CONFLICT(stripe_session_id,guide_slug) DO NOTHING`,
      )
      .bind(token, slug, email, now + TOKEN_TTL, now, session)
      .run();
    const row = await this.db
      .prepare(
        `SELECT * FROM download_tokens WHERE stripe_session_id=? AND guide_slug=?`,
      )
      .bind(session, slug)
      .first<DownloadToken>();
    if (!row) throw new Error("Could not resolve purchase token");
    return row;
  }

  token(token: string) {
    return this.db
      .prepare("SELECT * FROM download_tokens WHERE token=?")
      .bind(token)
      .first<DownloadToken>();
  }

  claimDownload(token: string, now: number) {
    return this.db
      .prepare(
        `UPDATE download_tokens SET attempts_remaining=attempts_remaining-1
      WHERE token=? AND expires_at>? AND attempts_remaining>0 RETURNING *`,
      )
      .bind(token, now)
      .first<DownloadToken>();
  }

  async refundDownload(token: string) {
    await this.db
      .prepare(
        "UPDATE download_tokens SET attempts_remaining=attempts_remaining+1 WHERE token=?",
      )
      .bind(token)
      .run();
  }

  async emailClaim(
    token: string,
    now: number,
  ): Promise<
    | { status: "claimed"; claim: string }
    | { status: "sent" }
    | { status: "busy" }
  > {
    const claim = crypto.randomUUID();
    const result = await this.db
      .prepare(
        `UPDATE download_tokens SET email_claim=?,email_claimed_at=?
      WHERE token=? AND email_sent_at IS NULL AND (email_claimed_at IS NULL OR email_claimed_at<?)
      RETURNING token`,
      )
      .bind(claim, now, token, now - EMAIL_LEASE)
      .first();
    if (result) return { status: "claimed" as const, claim };
    const row = await this.token(token);
    return {
      status:
        row?.email_sent_at != null ? ("sent" as const) : ("busy" as const),
    };
  }

  async markEmail(token: string, claim: string, now: number) {
    await this.db
      .prepare(
        `UPDATE download_tokens SET email_sent_at=?,email_claim=NULL,email_claimed_at=NULL
      WHERE token=? AND email_claim=?`,
      )
      .bind(now, token, claim)
      .run();
  }

  async releaseEmail(token: string, claim: string) {
    await this.db
      .prepare(
        `UPDATE download_tokens SET email_claim=NULL,email_claimed_at=NULL
      WHERE token=? AND email_claim=?`,
      )
      .bind(token, claim)
      .run();
  }

  async requestCode(email: string, hash: string, now: number) {
    // One conditional write, so parallel requests cannot exceed the email quota.
    const id = crypto.randomUUID();
    return this.db
      .prepare(
        `INSERT INTO download_access_codes (id,email,code_hash,expires_at,created_at)
      SELECT ?,?,?,?,? WHERE (SELECT COUNT(*) FROM download_access_codes WHERE email=? AND created_at>?)<3
      RETURNING id`,
      )
      .bind(id, email, hash, now + CODE_TTL, now, email, now - CODE_TTL)
      .first<{ id: string }>();
  }

  claimCodeAttempt(email: string, now: number) {
    // Never fall back to an older code after the most recent one is exhausted/used.
    return this.db
      .prepare(
        `UPDATE download_access_codes SET attempts_remaining=attempts_remaining-1
      WHERE id=(SELECT id FROM download_access_codes WHERE email=? ORDER BY created_at DESC,rowid DESC LIMIT 1)
      AND expires_at>? AND consumed_at IS NULL AND attempts_remaining>0
      RETURNING id,code_hash,attempts_remaining`,
      )
      .bind(email, now)
      .first<{ id: string; code_hash: string; attempts_remaining: number }>();
  }

  async consumeCode(id: string, now: number) {
    const token = crypto.randomUUID();
    const expires = now + SESSION_TTL;
    const row = await this.db
      .prepare(
        `UPDATE download_access_codes SET consumed_at=?,session_token=?,session_expires_at=?
      WHERE id=? AND consumed_at IS NULL AND expires_at>? RETURNING id`,
      )
      .bind(now, token, expires, id, now)
      .first();
    return row
      ? { accessToken: token, expiresAt: new Date(expires).toISOString() }
      : null;
  }

  async session(token: string, now: number) {
    const row = await this.db
      .prepare(
        `SELECT email FROM download_access_codes WHERE session_token=? AND session_expires_at>?`,
      )
      .bind(token, now)
      .first<{ email: string }>();
    return row?.email;
  }

  async purchases(email: string) {
    const r = await this.db
      .prepare(
        "SELECT * FROM download_tokens WHERE buyer_email=? ORDER BY created_at DESC,rowid DESC",
      )
      .bind(email)
      .all<DownloadToken>();
    return r.results;
  }

  refresh(email: string, slug: string, now: number) {
    // D1 serializes this single write: validates ownership, cap and absence of
    // an active token together. No PostgreSQL advisory locks are needed.
    return this.db
      .prepare(
        `INSERT INTO download_tokens (token,guide_slug,buyer_email,expires_at,created_at)
      SELECT ?,?,?,?,? WHERE
      (SELECT COUNT(*) FROM download_tokens WHERE buyer_email=? AND guide_slug=?) BETWEEN 1 AND 9
      AND NOT EXISTS(SELECT 1 FROM download_tokens WHERE buyer_email=? AND guide_slug=? AND expires_at>? AND attempts_remaining>0)
      RETURNING *`,
      )
      .bind(
        crypto.randomUUID(),
        slug,
        email,
        now + TOKEN_TTL,
        now,
        email,
        slug,
        email,
        slug,
        now,
      )
      .first<DownloadToken>();
  }

  async prune(now: number) {
    await this.db
      .prepare(
        `DELETE FROM download_access_codes WHERE expires_at<? AND
      (session_expires_at IS NULL OR session_expires_at<?)`,
      )
      .bind(now - CODE_TTL, now)
      .run();
  }
}
