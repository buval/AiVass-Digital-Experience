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

**How to apply:** Obtain a fresh server-side client for checkout, order verification, and authenticated webhook-event retrieval. Keep webhook signature verification primary; authenticated event retrieval is the fallback when the endpoint's current signing secret is not yet available to the runtime.
