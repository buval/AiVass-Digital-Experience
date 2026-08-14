/**
 * Build-time prerender for article routes.
 *
 * The production site is a static SPA — social crawlers (LinkedIn, Facebook,
 * X/Twitter, Slack) do NOT execute JavaScript, so they'd otherwise see the
 * homepage's static meta for every route. This script copies dist/index.html
 * to dist/insights/articles/<slug>/index.html for each article, replacing the
 * <title>, description, canonical, og:*, twitter:* tags and injecting Article,
 * BreadcrumbList, and FAQPage JSON-LD.
 *
 * Runs as `postbuild` (Node 24 imports the .ts data file via native type
 * stripping). The static file server serves the per-route index.html before
 * falling back to the SPA shell, so browsers get the same app either way.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const { ARTICLES } = await import(join(here, "../src/data/articles.ts"));

const distDir = join(here, "../dist/public");
const template = readFileSync(join(distDir, "index.html"), "utf8");

const esc = (s) =>
  s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");

/**
 * Replace exactly one match. `make(match)` receives the regex match array and
 * returns the replacement string — using a callback avoids String.replace's
 * `$`-pattern interpretation corrupting titles/JSON that contain `$`.
 */
function setTag(html, pattern, make, label, slug) {
  const m = html.match(pattern);
  if (!m) {
    throw new Error(`prerender-articles: failed to replace ${label} for ${slug} — template markup changed?`);
  }
  return html.replace(pattern, () => make(m));
}

let count = 0;
for (const article of ARTICLES) {
  const url = `https://aivass.com/insights/articles/${article.slug}`;
  const title = `${article.title} — AiVass`;
  const desc = article.metaDescription;
  const image = article.heroImage
    ? `https://aivass.com/images/${article.heroImage}`
    : "https://aivass.com/opengraph.jpg";

  let html = template;
  html = setTag(html, /<title>[\s\S]*?<\/title>/, () => `<title>${esc(title)}</title>`, "<title>", article.slug);
  html = setTag(html, /(<meta name="description" content=")[^"]*(")/, (m) => `${m[1]}${esc(desc)}${m[2]}`, "description", article.slug);
  html = setTag(html, /(<link rel="canonical" href=")[^"]*(")/, (m) => `${m[1]}${url}${m[2]}`, "canonical", article.slug);
  html = setTag(html, /(<meta property="og:url" content=")[^"]*(")/, (m) => `${m[1]}${url}${m[2]}`, "og:url", article.slug);
  html = setTag(html, /(<meta property="og:title" content=")[^"]*(")/, (m) => `${m[1]}${esc(title)}${m[2]}`, "og:title", article.slug);
  html = setTag(html, /(<meta property="og:description" content=")[^"]*(")/, (m) => `${m[1]}${esc(desc)}${m[2]}`, "og:description", article.slug);
  html = setTag(html, /(<meta property="og:type" content=")[^"]*(")/, (m) => `${m[1]}article${m[2]}`, "og:type", article.slug);
  html = setTag(html, /(<meta property="og:image" content=")[^"]*(")/, (m) => `${m[1]}${image}${m[2]}`, "og:image", article.slug);
  html = setTag(html, /(<meta name="twitter:title" content=")[^"]*(")/, (m) => `${m[1]}${esc(title)}${m[2]}`, "twitter:title", article.slug);
  html = setTag(html, /(<meta name="twitter:description" content=")[^"]*(")/, (m) => `${m[1]}${esc(desc)}${m[2]}`, "twitter:description", article.slug);
  html = setTag(html, /(<meta name="twitter:image" content=")[^"]*(")/, (m) => `${m[1]}${image}${m[2]}`, "twitter:image", article.slug);

  // Structured data
  const lds = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: article.title,
      description: desc,
      author: { "@type": "Person", name: article.author },
      datePublished: article.publishedAt,
      dateModified: article.updatedAt,
      publisher: {
        "@type": "Organization",
        name: "AiVass",
        logo: { "@type": "ImageObject", url: "https://aivass.com/favicon.svg" },
      },
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      ...(article.heroImage ? { image } : {}),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://aivass.com/" },
        { "@type": "ListItem", position: 2, name: "Insights", item: "https://aivass.com/insights" },
        { "@type": "ListItem", position: 3, name: "Articles", item: "https://aivass.com/insights/articles" },
        { "@type": "ListItem", position: 4, name: article.title, item: url },
      ],
    },
    ...(article.faq?.length
      ? [{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: article.faq.map(({ q, a }) => ({
            "@type": "Question",
            name: q,
            acceptedAnswer: { "@type": "Answer", text: a },
          })),
        }]
      : []),
  ];
  const ldScripts = lds
    .map((ld) => `<script type="application/ld+json" data-seo-ld>${JSON.stringify(ld).replaceAll("</", "<\\/")}</script>`)
    .join("\n    ");
  html = setTag(html, /<\/head>/, () => `    ${ldScripts}\n  </head>`, "</head>", article.slug);

  // Static semantic content for non-JS crawlers (LinkedIn, Perplexity, GPTBot).
  // Placed inside #root so React automatically replaces it on hydration —
  // browsers see the full app; crawlers that skip JS still read the answer.
  const staticBody = [
    `<article>`,
    `<nav aria-label="Breadcrumb"><a href="https://aivass.com/">Home</a> › <a href="https://aivass.com/insights">Insights</a> › ${esc(article.title)}</nav>`,
    `<h1>${esc(article.title)}</h1>`,
    `<p>By ${esc(article.author)} · Published ${esc(article.publishedAt)} · Updated ${esc(article.updatedAt)}</p>`,
    `<p><em>${esc(article.excerpt)}</em></p>`,
    ...(article.keyTakeaways?.length
      ? [
          `<h2>Key Takeaways</h2>`,
          `<ul>${article.keyTakeaways.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>`,
        ]
      : []),
    ...(article.faq?.length
      ? [
          `<h2>Frequently Asked Questions</h2>`,
          ...article.faq.map(({ q, a }) => `<h3>${esc(q)}</h3><p>${esc(a)}</p>`),
        ]
      : []),
    `<p><a href="${url}">Read the full interactive article on AiVass</a></p>`,
    `</article>`,
  ].join("\n      ");
  html = setTag(
    html,
    /(<div id="root">)(<\/div>)/,
    (m) => `${m[1]}\n      ${staticBody}\n    ${m[2]}`,
    "#root static content",
    article.slug,
  );

  // Write both forms so the static server matches the URL with or without a
  // trailing slash: /articles/<slug> → <slug>.html, /articles/<slug>/ → <slug>/index.html
  const outDir = join(distDir, "insights/articles", article.slug);
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "index.html"), html);
  writeFileSync(join(distDir, "insights/articles", `${article.slug}.html`), html);
  count++;
}

console.log(`prerender-articles: wrote ${count} article pages`);
