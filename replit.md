# [Project name]

_Replace the heading above with the project's name, and this line with one sentence describing what this app does for users._

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

### Article checks after publishing

The production API starts the article-sharing check automatically, without
blocking startup or changing the deployment's health response. It waits until
`https://aivass.com` serves both the uncacheable new API probe and a matching
build-specific JSON marker from the static website output,
then runs the bundled live-only mode of
`artifacts/aivass-web/scripts/validate-article-sharing.mjs`. This avoids testing
the previous release during build/startup, even if the API becomes public before
the static website. Both artifact builds share an atomically generated release
identity, regardless of build order. Its staging directory is excluded from Git
and source uploads so unchanged-code publishes also receive a fresh identity.
The production domain was verified
with the publishing service; if it changes, reverify it and update
`ARTICLE_PRODUCTION_URL` in `artifacts/api-server/src/lib/article-publish-check.ts`.

In publishing logs, search `article-sharing-post-publish`:
- `ARTICLE CHECK PASSED`: every catalog article was fetched with and without a
  trailing slash; HTTP status, final clean URL, canonical, Open Graph fields,
  and crawler-readable heading/body passed.
- `ARTICLE CHECK FAILED`: the report lists failing paths and expected/actual
  values. Fix rewrites or prerender output and republish. The worker retries
  twice at 30-second intervals to allow static-route propagation.
- `ARTICLE CHECK NOT RUN`: matching API and static website releases were not
  visible on the verified domain within the bounded promotion wait (roughly
  10–24 minutes). Check
  publishing/domain status, then run the command below.

Manual rerun (no local build required):
`pnpm --filter @workspace/aivass-web validate:article-sharing:live --base-url=https://aivass.com`

The worker is enabled only when both `REPLIT_DEPLOYMENT=1` and
`NODE_ENV=production`; development/tests do not contact production. Autoscale
instance starts also recheck the current release, so duplicate reports are
possible. Checks report problems but do not stop the API or roll back a release.
This is separate from guide social-preview validation.

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

_Populate as you build — short repo map plus pointers to the source-of-truth file for DB schema, API contracts, theme files, etc._

## Architecture decisions

_Populate as you build — non-obvious choices a reader couldn't infer from the code (3-5 bullets)._

## Product

_Describe the high-level user-facing capabilities of this app once they exist._

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- **AI-generated images and the "cr" badge** — browsers show a Content Credentials pin on images that carry embedded XMP/EXIF metadata. `artifacts/aivass-web/scripts/strip-image-metadata.sh` strips all metadata automatically as a `predev`/`prebuild` step. If you add a new image to `artifacts/aivass-web/public/images/` and want to strip it immediately without restarting the dev server, run `pnpm --filter @workspace/aivass-web run strip-images`.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
