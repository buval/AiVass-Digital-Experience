---
name: Guide fulfillment system
description: Durable checkout and Stripe credential rules for paid guide fulfillment
---

## Rule

Create a new Stripe Checkout Session on the server for every Purchase click. The browser may submit only an allowlisted guide slug; product, price, amount, and currency selection stay server-owned and are revalidated before checkout and fulfillment.

**Why:** Copied Checkout Session URLs are single-use and eventually open Stripe's completed/expired page. Server-created sessions avoid stale links and prevent the browser from choosing arbitrary Stripe prices.

**How to apply:** Redirect to Stripe in the same tab. Keep the permanent guide page as the public/structured-data URL, not a Checkout Session URL. Preserve the success URL session placeholder so paid sessions can be verified before issuing downloads.

## Managed Stripe credential

The injected `mk_` Stripe environment value is not a Stripe SDK secret key. Resolve the authenticated production connection server-side through Replit's connection API and use its `settings.secret`; never expose or log it.

**Why:** Passing the managed marker directly to Stripe fails authentication even though the Replit Stripe connection is valid.

**How to apply:** Obtain a fresh server-side client for checkout, order verification, and post-signature fulfillment lookups.

## Strict webhook authentication

Require the current Stripe endpoint signing secret for every webhook delivery.
Reject missing or invalid signatures without retrieving a claimed event ID as
an authentication fallback.

**Why:** An authenticated API lookup proves an event ID exists in the connected
account, but it does not prove that the incoming delivery came from Stripe.
Someone who learns an event ID must not be able to replay fulfillment.

**How to apply:** Store and rotate the endpoint secret only through Replit
Secrets, restart the API after rotation, and accept only events that Stripe's
local signature verifier validates against the raw request body.
