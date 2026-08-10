---
name: Guide fulfillment system
description: How the Stripe webhook → download token → email → PDF download pipeline works, and what the owner must do before it is live.
---

# Guide Fulfillment System

## Architecture
1. Stripe fires `checkout.session.completed` to `POST /api/webhooks/stripe`
2. Webhook creates a `download_tokens` row (72h / 3 attempts) and emails the buyer via Resend
3. Buyer clicks `https://aivass.com/download/{token}` → frontend at `/download/:token`
4. Frontend calls `GET /api/download/{token}/info` (no attempt consumed) to show status
5. On button click, frontend calls `GET /api/download/{token}` which decrements attempts and streams the PDF from Object Storage

## Critical owner setup steps (not automated)
- **Stripe Payment Links metadata**: Each static payment link (in `STRIPE_CHECKOUT_URLS`) must have `guide_slug` set in its metadata in the Stripe dashboard (Payment Links → Edit → Metadata). Without this, the webhook receives the event but cannot identify which guide was purchased.
- **PDF uploads**: Full guide PDFs must be uploaded to Object Storage under the key `guides/{slug}.pdf` (e.g. `guides/eb1a-master.pdf`). Use the Replit Object Storage pane.
- **Sample PDFs**: Free sample PDFs go in `artifacts/aivass-web/public/samples/{slug}-sample.pdf`.
- **Resend domain**: The `aivass.com` domain must be verified in Resend, and emails sent from `guides@aivass.com`.
- **Stripe webhook endpoint**: Registered in Stripe dashboard pointing to `https://aivass.com/api/webhooks/stripe`, listening for `checkout.session.completed`.

## Key files
- `artifacts/api-server/src/routes/webhook.ts` — Stripe webhook handler
- `artifacts/api-server/src/routes/download.ts` — download + info endpoints
- `artifacts/api-server/src/lib/guideStorage.ts` — streams PDF from GCS
- `artifacts/api-server/src/lib/email.ts` — Resend email sender
- `lib/db/src/schema/download-tokens.ts` — DB table
- `artifacts/aivass-web/src/pages/download.tsx` — download page

**Why:** Static Stripe payment links don't pass dynamic metadata automatically — it must be configured per-link in the Stripe dashboard.
