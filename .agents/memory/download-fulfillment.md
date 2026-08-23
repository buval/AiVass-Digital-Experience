---
name: Guide download fulfillment system
description: Concurrency and delivery guarantees for guide download tokens and email
---

## Rule
Paid checkout supports both immediate download on the order-success page and emailed download links. Both paths must converge on one canonical token per Stripe session and guide.

**Why:** Stripe webhook delivery and the buyer's success-page request can arrive concurrently. Select-then-insert logic can mint duplicate valid tokens and duplicate webhook retries can resend email.

**How to apply:**
- Enforce database uniqueness for the canonical session-and-guide token and use conflict-safe insert/read behavior.
- Recovery/refresh tokens are separate from the canonical checkout token and must not reuse its session identity.
- Treat email sending as leased work: reclaim stale claims, mark success only after the provider accepts the message, and use a stable provider idempotency key so retries do not duplicate delivery.
- Return a retryable webhook error while another delivery claim is active; do not acknowledge work that could otherwise become permanently stranded.
- Verify exact catalog product, price, amount, currency, and paid status before issuing any token.
