/**
 * Build-time static metadata and semantic fallback for the Mandala of Support.
 * Social crawlers do not execute the SPA, so this mirrors the app route's SEO.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const distDir = join(here, "../dist/public");
const template = readFileSync(join(distDir, "index.html"), "utf8");
const url = "https://aivass.com/insights/mandala-of-support";
const title = "The Mandala of Support — AiVass";
const description =
  "A free, private AiVass worksheet to map eight dimensions of your support system and identify where care is needed.";
const image = "https://aivass.com/images/field-notes-01-support-system-1200x627.png";

const setTag = (html, pattern, replacement, label) => {
  if (!pattern.test(html)) {
    throw new Error(`prerender-mandala: failed to replace ${label}`);
  }
  return html.replace(pattern, replacement);
};

let html = template;
html = setTag(html, /<title>[\s\S]*?<\/title>/, `<title>${title}</title>`, "title");
html = setTag(html, /(<meta name="description" content=")[^"]*(")/, `$1${description}$2`, "description");
html = setTag(html, /(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`, "canonical");
html = setTag(html, /(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`, "og:url");
html = setTag(html, /(<meta property="og:title" content=")[^"]*(")/, `$1${title}$2`, "og:title");
html = setTag(html, /(<meta property="og:description" content=")[^"]*(")/, `$1${description}$2`, "og:description");
html = setTag(html, /(<meta property="og:type" content=")[^"]*(")/, "$1website$2", "og:type");
html = setTag(html, /(<meta property="og:image" content=")[^"]*(")/, `$1${image}$2`, "og:image");
html = setTag(html, /(<meta name="twitter:title" content=")[^"]*(")/, `$1${title}$2`, "twitter:title");
html = setTag(html, /(<meta name="twitter:description" content=")[^"]*(")/, `$1${description}$2`, "twitter:description");
html = setTag(html, /(<meta name="twitter:image" content=")[^"]*(")/, `$1${image}$2`, "twitter:image");

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "The Mandala of Support",
  description,
  url,
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Any",
  image,
  isAccessibleForFree: true,
};
html = setTag(
  html,
  /<\/head>/,
  `    <script type="application/ld+json" data-seo-ld>${JSON.stringify(structuredData)}</script>\n  </head>`,
  "structured data",
);

const staticBody = `<main>
  <nav aria-label="Breadcrumb"><a href="https://aivass.com/">Home</a> › <a href="https://aivass.com/insights">Insights</a> › The Mandala of Support</nav>
  <h1>The Mandala of Support</h1>
  <p>A free, private worksheet for mapping the eight dimensions of your support system.</p>
  <p>Score your inner self, family, community, health, purpose, money, learning, and rest. The tool helps you see the shape honestly and choose one place to strengthen next.</p>
  <p><a href="https://aivass.com/insights/articles/support-system-every-immigrant-needs">Read The Support System No One Helps You Build</a></p>
</main>`;
html = setTag(
  html,
  /(<div id="root">)(<\/div>)/,
  `$1\n      ${staticBody}\n    $2`,
  "semantic fallback",
);

const outDir = join(distDir, "insights/mandala-of-support");
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "index.html"), html);
writeFileSync(join(distDir, "insights", "mandala-of-support.html"), html);
console.log("prerender-mandala: wrote Mandala of Support page");