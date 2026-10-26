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
