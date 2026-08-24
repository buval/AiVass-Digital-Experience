/**
 * Pre-publish regression check for the Support System Field Note.
 *
 * Run with:
 *   pnpm --filter @workspace/aivass-web run validate:field-note-discovery
 *
 * The command creates a production build first. It then checks the generated,
 * crawler-visible HTML rather than the React source, so regressions in the
 * prerendering step are caught before publishing.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const siteDir = join(here, "..");
const fieldNoteSlug = "support-system-every-immigrant-needs";
const canonicalUrl = `https://aivass.com/insights/articles/${fieldNoteSlug}`;
const routePath = join(siteDir, "dist/public/insights/articles", fieldNoteSlug, "index.html");
const extensionlessRoutePath = join(siteDir, "dist/public/insights/articles", `${fieldNoteSlug}.html`);
const robotsPath = join(siteDir, "public/robots.txt");
const { ARTICLES } = await import(join(siteDir, "src/data/articles.ts"));
const article = ARTICLES.find(({ slug }) => slug === fieldNoteSlug);

if (!article) {
  throw new Error(`Field Note discovery validation: "${fieldNoteSlug}" is missing from ARTICLES.`);
}

const failures = [];
const pass = (label) => console.log(`  ✓ ${label}`);
const check = (condition, label, detail) => {
  if (condition) {
    pass(label);
  } else {
    failures.push(`${label}: ${detail}`);
  }
};

function readRequired(path, label) {
  try {
    return readFileSync(path, "utf8");
  } catch (error) {
    failures.push(`${label}: could not read ${path} (${error.message})`);
    return "";
  }
}

function getAttribute(tag, attribute) {
  const match = tag.match(new RegExp(`\\b${attribute.replaceAll(":", "\\:")}=("[^"]*"|'[^']*')`, "i"));
  return match ? match[1].slice(1, -1) : undefined;
}

function findMeta(html, attribute, value) {
  return [...html.matchAll(/<meta\b[^>]*>/gi)].find((match) => getAttribute(match[0], attribute) === value)?.[0];
}

function checkMeta(html, attribute, name, expected) {
  const tag = findMeta(html, attribute, name);
  check(
    getAttribute(tag ?? "", "content") === expected,
    `${name} metadata`,
    tag
      ? `expected content "${expected}", received "${getAttribute(tag, "content") ?? "missing"}"`
      : "tag is missing",
  );
}

function checkJsonLd(html) {
  const scripts = [...html.matchAll(/<script\b[^>]*data-seo-ld[^>]*>([\s\S]*?)<\/script>/gi)];
  const objects = [];

  for (const [index, match] of scripts.entries()) {
    try {
      objects.push(JSON.parse(match[1]));
    } catch (error) {
      failures.push(`structured data script ${index + 1}: invalid JSON-LD (${error.message})`);
    }
  }

  const byType = (type) => objects.find((value) => value?.["@type"] === type);
  const articleLd = byType("Article");
  check(
    articleLd?.headline === article.title &&
      articleLd?.url === canonicalUrl &&
      articleLd?.mainEntityOfPage?.["@id"] === canonicalUrl &&
      articleLd?.datePublished === article.publishedAt &&
      articleLd?.dateModified === article.updatedAt,
    "Article structured data",
    "Article JSON-LD is missing or does not describe this Field Note's canonical page",
  );

  const breadcrumbLd = byType("BreadcrumbList");
  const breadcrumbItems = breadcrumbLd?.itemListElement;
  check(
    Array.isArray(breadcrumbItems) &&
      breadcrumbItems.length === 4 &&
      breadcrumbItems.at(-1)?.name === article.title &&
      breadcrumbItems.at(-1)?.item === canonicalUrl,
    "Breadcrumb structured data",
    "BreadcrumbList is missing or does not end at the Field Note canonical URL",
  );

  const faqLd = byType("FAQPage");
  const faqEntries = faqLd?.mainEntity;
  check(
    Array.isArray(faqEntries) &&
      faqEntries.length === article.faq?.length &&
      article.faq?.every((faq, index) =>
        faqEntries[index]?.["@type"] === "Question" &&
        faqEntries[index]?.name === faq.q &&
        faqEntries[index]?.acceptedAnswer?.text === faq.a,
      ),
    "FAQ structured data",
    "FAQPage is missing or differs from the Field Note's visible FAQ source",
  );
}

function getRobotsDirectives(robots, userAgent) {
  const lines = robots.split(/\r?\n/);
  const agentLine = lines.findIndex((line) => line.trim().toLowerCase() === `user-agent: ${userAgent.toLowerCase()}`);
  if (agentLine === -1) return [];

  const directives = [];
  for (const line of lines.slice(agentLine + 1)) {
    const trimmed = line.trim();
    if (/^user-agent:/i.test(trimmed)) break;
    const directive = trimmed.match(/^(allow|disallow):\s*(.*)$/i);
    if (directive) directives.push({ name: directive[1].toLowerCase(), value: directive[2] });
  }
  return directives;
}

function checkCrawlerPolicy(robots, userAgent, expectedDirective) {
  const directives = getRobotsDirectives(robots, userAgent);
  check(
    directives.some(({ name, value }) => name === expectedDirective && value === "/"),
    `${userAgent} crawler policy`,
    `expected "${expectedDirective}: /" in public/robots.txt`,
  );
}

console.log("\nField Note discovery validation");
console.log(`Checking generated route: ${routePath}`);

const html = readRequired(routePath, "generated article route");
const extensionlessRoute = readRequired(extensionlessRoutePath, "generated extensionless article route");
const robots = readRequired(robotsPath, "crawler policy");

if (html) {
  const title = `${article.title} — AiVass`;
  const image = `https://aivass.com/images/${article.heroImage}`;

  const canonical = html.match(/<link\b[^>]*\brel=("|')canonical\1[^>]*>/i)?.[0];
  check(
    getAttribute(canonical ?? "", "href") === canonicalUrl,
    "canonical URL",
    canonical ? `expected href "${canonicalUrl}"` : "canonical link tag is missing",
  );

  checkMeta(html, "name", "description", article.metaDescription);
  checkMeta(html, "property", "og:url", canonicalUrl);
  checkMeta(html, "property", "og:title", title);
  checkMeta(html, "property", "og:description", article.metaDescription);
  checkMeta(html, "property", "og:type", "article");
  checkMeta(html, "property", "og:image", image);
  checkMeta(html, "property", "og:image:alt", article.heroAlt);
  checkMeta(html, "name", "twitter:card", "summary_large_image");
  checkMeta(html, "name", "twitter:title", title);
  checkMeta(html, "name", "twitter:description", article.metaDescription);
  checkMeta(html, "name", "twitter:image", image);
  checkMeta(html, "name", "twitter:image:alt", article.heroAlt);

  checkJsonLd(html);

  const root = html.match(/<div id="root">([\s\S]*?)<\/div>/i)?.[1] ?? "";
  const staticText = root.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  const wordCount = staticText ? staticText.split(" ").length : 0;
  check(
    /<article>/i.test(root) &&
      root.includes(`<h1>${article.title}</h1>`) &&
      wordCount >= 800 &&
      article.keyTakeaways?.every((takeaway) => root.includes(takeaway)),
    "substantial crawler-visible article content",
    `expected a semantic article with its title, key takeaways, and at least 800 words; found ${wordCount} words`,
  );
  check(
    root.includes('href="https://aivass.com/insights/mandala-of-support"') &&
      /Open the free interactive Mandala of Support/.test(root),
    "Mandala of Support link",
    "the crawler-visible article must link readers to the free Mandala of Support",
  );
}

check(
  Boolean(extensionlessRoute) && extensionlessRoute === html,
  "extensionless article route",
  `expected ${extensionlessRoutePath} to exist and match the trailing-slash route`,
);

if (robots) {
  checkCrawlerPolicy(robots, "*", "allow");
  for (const crawler of ["OAI-SearchBot", "PerplexityBot", "Claude-SearchBot"]) {
    checkCrawlerPolicy(robots, crawler, "allow");
  }
  for (const crawler of ["GPTBot", "CCBot", "anthropic-ai", "Claude-Web", "Google-Extended"]) {
    checkCrawlerPolicy(robots, crawler, "disallow");
  }
}

if (failures.length) {
  console.error(`\nField Note discovery validation failed (${failures.length} issue${failures.length === 1 ? "" : "s"}):`);
  for (const failure of failures) console.error(`  ✗ ${failure}`);
  console.error("\nFix the generated route, article data, or robots.txt and rerun validate:field-note-discovery before publishing.");
  process.exitCode = 1;
} else {
  console.log("\nField Note discovery validation passed. The crawler-visible page is ready to publish.");
}