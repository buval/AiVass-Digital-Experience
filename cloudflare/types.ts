export interface Env {
  DB: D1Database;
  GUIDES: R2Bucket;
  ASSETS: Fetcher;
  APP_ORIGIN: string;
  STRIPE_SECRET_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;
  RESEND_API_KEY: string;
  ACCESS_CODE_SECRET: string;
  STRIPE_CATALOG_JSON?: string;
}

export interface DownloadToken {
  token: string;
  guide_slug: string;
  buyer_email: string;
  attempts_remaining: number;
  expires_at: number;
  created_at: number;
  stripe_session_id: string | null;
  email_claim: string | null;
  email_claimed_at: number | null;
  email_sent_at: number | null;
}
