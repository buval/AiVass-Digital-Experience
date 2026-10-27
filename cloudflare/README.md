# AiVass on Cloudflare, built from GitHub

This deployment serves the existing React site and prerendered articles/guides,
plus a native Worker API for Stripe checkout, paid PDF delivery and My Downloads.
The running deployment has no Replit services or PostgreSQL dependency. The old
Replit API source is retained as a reference and for its existing tests; it is not
imported by the Worker. There are no existing purchases to migrate.

## Account setup (once)

Use Node 24 and pnpm 10.30.3. Run these commands in a full local clone or the
existing Replit Shell before deleting that project:

```sh
corepack enable
pnpm install --frozen-lockfile
pnpm wrangler login
pnpm wrangler d1 create aivass-store
pnpm wrangler r2 bucket create aivass-guides
```

Alternatively create the database and bucket in Cloudflare's dashboard.
Replace the zero `database_id` in `wrangler.jsonc` with the real D1 ID and commit
that ID (it is not a secret). Keep the R2 bucket private: do not enable a public
domain or r2.dev access. R2 requires activation of its subscription even when
usage stays in its included free allowance.

```sh
pnpm db:cloudflare
```

This applies the D1 migration remotely. It creates empty purchase/access tables;
it does not import development/test purchases from Replit.

## Paid guide files

The newest Replit sync removed full paid PDFs from the Git tree. They must not
be copied into `artifacts/aivass-web/public`, build assets or a public R2 bucket.
Upload six reviewed full PDFs to these private keys:

```
guides/eb1a-master.pdf
guides/eb1a-business.pdf
guides/eb1a-arts.pdf
guides/eb1a-athletics.pdf
guides/eb1a-education.pdf
guides/eb1a-science.pdf
```

Export the current versions from Replit Object Storage or use your original PDFs.
Name each local file `{slug}.pdf` and run:

```sh
pnpm upload:guides --source-dir=/absolute/path/to/private-guides --remote
```

For convenience the existing pre-migration PDFs can be recovered from local Git
history, without putting them back in the public repository:

```sh
node cloudflare/export-guides.mjs
# Review these historical files before using them, in case Replit has newer PDFs.
pnpm upload:guides --source-dir=.local/cloudflare-guides --remote
```

The Complete Collection delivers the six individual guides, as before. Checkout
refuses payment until all relevant files are present. Public samples and the free
Field Note remain static files; the existing native PDF links are preserved.
Existing public Git history still contains earlier paid PDFs; moving storage to
R2 cannot revoke those historical copies.

## Credentials and Stripe configuration

Add these as encrypted Worker secrets in the Cloudflare dashboard, or use:

```sh
pnpm wrangler secret put STRIPE_SECRET_KEY
pnpm wrangler secret put STRIPE_WEBHOOK_SECRET
pnpm wrangler secret put RESEND_API_KEY
pnpm wrangler secret put ACCESS_CODE_SECRET
```

- `STRIPE_SECRET_KEY`: a **direct** Stripe `sk_...` or appropriately scoped
  `rk_...` credential for the account that owns the configured products/prices.
  A Replit-managed `mk_...` marker cannot be used.
- `STRIPE_WEBHOOK_SECRET`: the signing secret for the new Worker endpoint
  `https://YOUR-HOST/api/webhooks/stripe`. Subscribe to
  `checkout.session.completed` and `checkout.session.async_payment_succeeded`.
- `RESEND_API_KEY`: the existing Resend account with `aivass.com` verified. Keep
  the domain's existing mail/DKIM/SPF records. Mail is sent from
  `AiVass Guides <guides@aivass.com>`.
- `ACCESS_CODE_SECRET`: at least 32 randomly generated characters, e.g. the output
  of `openssl rand -hex 32`. HMAC protects stored six-digit recovery codes.

No secrets belong in GitHub, build output or `VITE_*` variables. Missing email
configuration fails closed instead of claiming successful mail delivery.

The server catalog retains the existing product/price IDs and USD amounts. To
exercise **Stripe test mode** or use another Stripe account, set the optional
Worker secret `STRIPE_CATALOG_JSON` with matching IDs from that account:

```json
{
  "eb1a-master": {
    "productId": "prod_TEST_PRODUCT",
    "priceId": "price_TEST_PRICE"
  }
}
```

Use real IDs, not the labels above. The example IDs override only one guide;
configure every guide you plan to test, including the collection. Amounts remain
9900 cents for Master, 7900 for each specialist guide, 24900 for the collection,
all one-time USD prices. Remove sandbox overrides before production, or replace
them with the correct live IDs, and switch the API and webhook secrets together.

## GitHub → Cloudflare deployment

Use **Workers & Pages → Create application → Import a repository** and select
`buval/AiVass-Digital-Experience`. Create a **Worker**, not a static-only Pages
project. Authorize Cloudflare's GitHub app for this repository.

| Setting           | Value                                    |
| ----------------- | ---------------------------------------- |
| Worker name       | `aivass` (matches `wrangler.jsonc`)      |
| Production branch | `main`, after the migration PR is merged |
| Root directory    | Repository root                          |
| Build command     | `pnpm run build:cloudflare`              |
| Deploy command    | `pnpm run deploy:cloudflare`             |
| Build variable    | `NODE_VERSION=24`                        |
| Package manager   | `pnpm@10.30.3`, pinned in `package.json` |

Workers Builds should install dependencies from the committed lockfile. If its
image does not select the pinned pnpm automatically, use
`corepack enable && corepack prepare pnpm@10.30.3 --activate && pnpm install --frozen-lockfile && pnpm run build:cloudflare`
as the build command. The frontend build command runs all existing prerender and
sample/release-marker hooks. No build step calls Stripe or sends email.

Bind `DB` to `aivass-store`, `GUIDES` to `aivass-guides`, and preserve the encrypted
secrets after deployment. Keep `APP_ORIGIN` set to the exact public HTTPS origin.
For pre-cutover testing set it to the Worker's own `https://...workers.dev` URL;
otherwise checkout redirects would return to the old Replit host. Use a separate
test Worker/database/bucket for ongoing preview deployments; do not allow branch
previews to share the production purchase database or live Stripe credentials.

## Verification before domain cutover

```sh
pnpm check:cloudflare
pnpm test:cloudflare
pnpm run build:cloudflare
pnpm wrangler deploy --dry-run
node cloudflare/smoke.mjs
```

The smoke check uses isolated local D1/R2 state and a synthetic private PDF. It
checks real HTTP article delivery and sample byte ranges in workerd.

Tests cover signature verification, exact-price validation, canonical purchase
tokens, retryable email leases, bundle fulfillment, concurrent download limits,
OTP/recovery isolation and concurrent refresh limits. These are local tests with
mock Stripe/Resend services; passing them does not prove real credentials work.

On the deployed test Worker:

1. `/api/healthz` must return `{"status":"ok"}` (D1 migration present).
2. Test homepage, navigation, free sample PDFs, downloads and mobile layout.
3. Run the existing live article validator against the **new host**:
   `pnpm --filter @workspace/aivass-web run validate:article-sharing:live --base-url=https://YOUR-WORKER.workers.dev`.
   It checks real HTTP delivery, clean/trailing-slash URLs, redirects, canonical
   and social metadata. Keep `aivass.com` as the article canonical domain.
4. Use Stripe test credentials/catalog IDs to complete a test checkout. Verify
   instant PDFs, emails, My Downloads recovery and download expiry/limits.
5. Retry the signed webhook; verify one canonical token and one email per guide.
   Confirm an invalid signature fails, rather than fulfilling an order.
6. Add `aivass.com` and `www.aivass.com` under the Worker's **Settings → Domains &
   Routes → Add → Custom Domain**. Review existing records pointing to Replit;
   replace only the web records for those hostnames. Preserve email records.
7. Set `APP_ORIGIN=https://aivass.com`, configure the production Stripe endpoint
   and live credentials/catalog, verify the custom domain and rerun the live
   article validator. Only then remove the Replit deployment/project.

## Local development

```sh
pnpm run build:cloudflare
pnpm wrangler d1 migrations apply aivass-store --local
pnpm upload:guides --source-dir=/absolute/path/to/private-guides
cp .dev.vars.example .dev.vars
# Fill LOCAL Stripe test/Resend credentials in the ignored .dev.vars file.
pnpm wrangler dev
```

All API responses and private PDF downloads use no-store caching. Download
tokens are valid for 72 hours/three attempts; verified buyers can refresh up to
the existing lifetime cap. OTPs expire after 15 minutes and sessions after 30.
The scheduled Worker prunes expired codes daily. Purchases are retained.

The new runtime streams R2 files through the Worker and uses D1 conditional
writes for concurrency instead of PostgreSQL advisory locks. The Worker does
not run Replit's API-startup publication checker; use the post-deploy HTTP check
above against the promoted Cloudflare release. Cloudflare logs contain generic
API failure messages, without download tokens, buyer data or webhook bodies.

Start within Cloudflare's included allowances, monitor CPU/request/D1/R2 usage,
and upgrade if needed. Stripe fees, Resend usage and domain registration remain
separate. A free-tier quota exhaustion may interrupt API requests; it is not an
unlimited backend hosting guarantee.

References: [Workers Git builds](https://developers.cloudflare.com/workers/ci-cd/builds/),
[static assets](https://developers.cloudflare.com/workers/static-assets/),
[D1 migrations](https://developers.cloudflare.com/d1/reference/migrations/),
[R2 bindings](https://developers.cloudflare.com/r2/api/workers/workers-api-usage/).
