# Stripe webhook signing-secret rotation

The guide-fulfillment endpoint accepts events only when Stripe signs them with
the current endpoint secret stored as `STRIPE_WEBHOOK_SECRET` in Replit
Secrets. It never accepts an unsigned event or trusts an event ID retrieved
from Stripe as a substitute for a delivery signature.

## Rotate the secret

1. In Stripe, open the webhook endpoint for
   `https://aivass.com/api/webhooks/stripe` and reveal or rotate its signing
   secret. Copy the replacement value only into Replit's secure secret form.
2. Update `STRIPE_WEBHOOK_SECRET` through Replit Secrets. Do not put the
   value in a source file, shell command, log, or message.
3. Restart the **API Server** workflow so its process reads the replacement
   secret.
4. In Stripe, send a test event to the endpoint and confirm it receives a
   successful response. Then inspect the API Server logs for a normal 200
   response without secret material.
5. Once the new secret has been verified, expire the old Stripe signing
   secret. The endpoint intentionally accepts only one active secret.

## Local verification

Run the focused verification suite from the repository root:

```sh
pnpm --filter @workspace/api-server run test:webhook
```

The suite uses test-only signing secrets. It proves a valid signature is
accepted, an invalid signature is rejected, and the old signature stops
working after a simulated rotation.