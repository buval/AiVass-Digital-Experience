---
name: Production article routing verification
description: Why local prerender checks alone cannot establish that shared article URLs work.
---
Require real HTTP checks of clean article URLs, both with and without a trailing slash, after publishing routing changes.

**Why:** A wildcard-to-wildcard article rewrite passed schema validation and local string assertions but produced live 404s. Exact source-to-target mappings restored the live routes. Generic static-deployment documentation did not establish wildcard capture substitution for this artifact's host.

**How to apply:** Do not infer live routing behavior from the existence of prerendered files or valid configuration. Verify response status, final clean URL, canonical and social metadata, and crawler-readable content on the published host. Keep route validation aligned with the article catalog so new articles cannot ship without mappings.

Use the existing API service for real legacy-link HTTP redirects while leaving
canonical article delivery on the static service.

**Why:** Static hosting documents internal rewrites, not HTTP redirects. The
artifact validator accepted an unrecognized redirect table even with a
non-numeric status, so successful configuration validation alone cannot prove
redirect support. A validated API path registration produced real 301 responses
through the preview proxy without changing canonical static mappings.

**How to apply:** Keep redirect destinations restricted to published article
slugs and verify raw HTTP status and Location headers, not just browser
navigation. Verify production again after merge/publish; preview checks cannot
establish the behavior of an unpublished production configuration.

Treat build completion, API startup, and public promotion as separate events.

**Why:** In October 2026, the publishing documentation offered no dedicated
post-deployment webhook. An API can start and pass internal health checks while
the public domain still serves the previous release. Running live assertions
at build time or immediately on startup can therefore pass against old content.

**How to apply:** Preserve public-release gates for both API and static website
when changing this automation; API promotion alone says nothing about which
static release is public.
Do not replace it with a fixed sleep or a healthy response from an older build.
If a first-class publish event becomes available, it can replace the startup
bridge, but checks must still target the verified public domain.
