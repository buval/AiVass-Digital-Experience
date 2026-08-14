---
name: Article SEO prerender
description: How article pages get crawler-visible meta/JSON-LD on the static SPA
---
Production is a static Vite SPA (`vite preview`, outDir `dist/public`); social/AI crawlers don't run JS.
`scripts/prerender-articles.mjs` runs as `postbuild` and writes per-article HTML (`<slug>.html` AND `<slug>/index.html` — sirv needs the `.html` form for extensionless URLs) with rewritten meta + Article/Breadcrumb/FAQPage JSON-LD and static semantic content inside `#root` (React replaces it on hydration).

**Rules to keep:**
- Article FAQ + key takeaways live as plain text in `src/data/articles.ts` (`faq`, `keyTakeaways`) — single source for the visible accordion/takeaways block, client JSON-LD, and prerender. Never let schema and visible content diverge.
- All SEO LD scripts carry `data-seo-ld`; article-detail removes all of them before injecting fresh ones (prevents stale entities on client navigation).
- Prerender regexes fail loudly if index.html markup changes — if build breaks after editing index.html head tags, update the script.
- Changes only reach crawlers after the user republishes (prerender is build-time).
