/**
 * Build-time prerender for guide/product detail routes.
 *
 * The production site is a static SPA — social crawlers (LinkedIn, Facebook,
 * X/Twitter, Slack) do NOT execute JavaScript, so they'd otherwise see the
 * homepage's static meta for every guide URL. This script copies dist/index.html
 * to dist/guides/<slug>/index.html for each guide, replacing the <title>,
 * description, canonical, og:*, twitter:* tags and injecting Product and
 * BreadcrumbList JSON-LD.
 *
 * Runs as part of `postbuild` (Node 24 imports the .ts data file via native
 * type stripping). The static file server serves the per-route index.html
 * before falling back to the SPA shell, so browsers get the same app either way.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const { GUIDES, BUNDLE } = await import(join(here, "../src/data/guides.ts"));

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
    throw new Error(`prerender-guides: failed to replace ${label} for ${slug} — template markup changed?`);
  }
  return html.replace(pattern, () => make(m));
}

const allGuides = [...GUIDES, BUNDLE];
let count = 0;

for (const guide of allGuides) {
  const url = `https://aivass.com/guides/${guide.slug}`;
  // Match the runtime title used in guide-detail.tsx's useSeoMeta call
  const title = `${guide.name} — ${guide.subtitle}`;
  const desc = guide.shortDescription;
  const image = guide.heroImage
    ? `https://aivass.com/images/${guide.heroImage}`
    : "https://aivass.com/opengraph.jpg";
  const priceFormatted = `$${(guide.priceCents / 100).toFixed(0)}`;

  let html = template;
  html = setTag(html, /<title>[\s\S]*?<\/title>/, () => `<title>${esc(title)}</title>`, "<title>", guide.slug);
  html = setTag(html, /(<meta name="description" content=")[^"]*(")/, (m) => `${m[1]}${esc(desc)}${m[2]}`, "description", guide.slug);
  html = setTag(html, /(<link rel="canonical" href=")[^"]*(")/, (m) => `${m[1]}${url}${m[2]}`, "canonical", guide.slug);
  html = setTag(html, /(<meta property="og:url" content=")[^"]*(")/, (m) => `${m[1]}${url}${m[2]}`, "og:url", guide.slug);
  html = setTag(html, /(<meta property="og:title" content=")[^"]*(")/, (m) => `${m[1]}${esc(title)}${m[2]}`, "og:title", guide.slug);
  html = setTag(html, /(<meta property="og:description" content=")[^"]*(")/, (m) => `${m[1]}${esc(desc)}${m[2]}`, "og:description", guide.slug);
  html = setTag(html, /(<meta property="og:type" content=")[^"]*(")/, (m) => `${m[1]}product${m[2]}`, "og:type", guide.slug);
  html = setTag(html, /(<meta property="og:image" content=")[^"]*(")/, (m) => `${m[1]}${image}${m[2]}`, "og:image", guide.slug);
  html = setTag(html, /(<meta name="twitter:title" content=")[^"]*(")/, (m) => `${m[1]}${esc(title)}${m[2]}`, "twitter:title", guide.slug);
  html = setTag(html, /(<meta name="twitter:description" content=")[^"]*(")/, (m) => `${m[1]}${esc(desc)}${m[2]}`, "twitter:description", guide.slug);
  html = setTag(html, /(<meta name="twitter:image" content=")[^"]*(")/, (m) => `${m[1]}${image}${m[2]}`, "twitter:image", guide.slug);

  // Structured data — Product + BreadcrumbList
  const lds = [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: guide.name,
      description: guide.description,
      image,
      url,
      brand: {
        "@type": "Brand",
        name: "AiVass",
      },
      offers: {
        "@type": "Offer",
        priceCurrency: "USD",
        price: (guide.priceCents / 100).toFixed(2),
        availability: "https://schema.org/InStock",
        url,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://aivass.com/" },
        { "@type": "ListItem", position: 2, name: "Guides", item: "https://aivass.com/guides" },
        { "@type": "ListItem", position: 3, name: guide.name, item: url },
      ],
    },
  ];
  const ldScripts = lds
    .map((ld) => `<script type="application/ld+json" data-seo-ld>${JSON.stringify(ld).replaceAll("</", "<\\/")}</script>`)
    .join("\n    ");
  html = setTag(html, /<\/head>/, () => `    ${ldScripts}\n  </head>`, "</head>", guide.slug);

  // Static semantic content for non-JS crawlers (LinkedIn, Perplexity, GPTBot).
  // Placed inside #root so React automatically replaces it on hydration —
  // browsers see the full app; crawlers that skip JS still read the content.
  const staticBody = [
    `<article itemscope itemtype="https://schema.org/Product">`,
    `<nav aria-label="Breadcrumb"><a href="https://aivass.com/">Home</a> › <a href="https://aivass.com/guides">Guides</a> › ${esc(guide.name)}</nav>`,
    `<h1 itemprop="name">${esc(guide.name)}</h1>`,
    `<p><strong>${esc(guide.subtitle)}</strong></p>`,
    `<p itemprop="description">${esc(guide.description)}</p>`,
    `<p>Price: <span itemprop="price">${esc(priceFormatted)}</span> · ${esc(guide.pageCount.toString())} pages</p>`,
    ...(guide.audience ? [`<p><strong>Who this is for:</strong> ${esc(guide.audience)}</p>`] : []),
    ...(guide.learningPoints?.length
      ? [
          `<h2>What you'll learn</h2>`,
          `<ul>${guide.learningPoints.map((pt) => `<li>${esc(pt)}</li>`).join("")}</ul>`,
        ]
      : []),
    `<p><a href="${url}">View the full guide on AiVass</a></p>`,
    `</article>`,
  ].join("\n      ");
  html = setTag(
    html,
    /(<div id="root">)(<\/div>)/,
    (m) => `${m[1]}\n      ${staticBody}\n    ${m[2]}`,
    "#root static content",
    guide.slug,
  );

  // Write both forms so the static server matches the URL with or without a
  // trailing slash: /guides/<slug> → <slug>.html, /guides/<slug>/ → <slug>/index.html
  const outDir = join(distDir, "guides", guide.slug);
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "index.html"), html);
  writeFileSync(join(distDir, "guides", `${guide.slug}.html`), html);
  count++;
}

console.log(`prerender-guides: wrote ${count} guide pages`);
