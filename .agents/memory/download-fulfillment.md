---
name: Guide download fulfillment system
description: How Stripe purchases map to guide PDFs via download tokens
---

## Rule
No email. Instant download on `/order-success?session_id=...` page.

**Why:** User chose instant browser download over email delivery.

**How to apply:**
- Stripe payment links must have success URL: `https://aivass.com/order-success?session_id={CHECKOUT_SESSION_ID}`
- Frontend calls `GET /api/order-complete?session_id=...`
- API verifies payment via Stripe, maps product ID → slug, creates token in `download_tokens` table
- Frontend then fetches `GET /api/download/:token` → streams PDF from Object Storage

## Product ID → Slug mapping (live Stripe)
```
prod_UuuNVJM174nKvQ → eb1a-master
prod_UuubGa79bq84fn → eb1a-business
prod_UuucU0qjBiiFYp → eb1a-arts
prod_UuudKN57E7YBxm → eb1a-athletics
prod_Uuuecov9ZMnSbo → eb1a-education
prod_Uuuf4bMQ91y7V0 → eb1a-science
prod_UuufVso7YgP9cq → eb1a-complete (NO PDF yet — task #26)
```

## Object storage paths
Guide PDFs stored at `guides/{slug}.pdf` in bucket `replit-objstore-46edb847-551b-4dde-91e9-145c1a7d338f`.

## DB schema
Table: `download_tokens` — token (UUID PK), guide_slug, buyer_email, attempts_remaining (default 3), expires_at (72h), created_at, stripe_session_id
