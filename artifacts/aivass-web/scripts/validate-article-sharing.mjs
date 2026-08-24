import {
  existsSync,
  readFileSync,
  readdirSync,
} from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const articlesDir = join(appDir, "dist/public/insights/articles");
const artifactConfigPath = join(appDir, ".replit-artifact/artifact.toml");
const insightsSourcePath = join(appDir, "src/pages/insights.tsx");
const shareSourcePath = join(appDir, "src/components/article-share-bar.tsx");
const failures = [];

function check(condition, label, detail = "") {
  if (condition) {
    console.log(`PASS ${label}`);
    return;
  }

  failures.push(`${label}${detail ? ` — ${detail}` : ""}`);
  console.error(`FAIL ${label}${detail ? ` — ${detail}` : ""}`);
}

function getMeta(html, attribute, name) {
  const tag = html.match(
    new RegExp(`<meta\\b[^>]*\\b${attribute}=(?:\"|')${name}(?:\"|')[^>]*>`, "i"),
  )?.[0];
  return tag?.match(/\bcontent=(?:"([^"]*)"|'([^']*)')/i)?.slice(1).find(Boolean);
}

function getCanonical(html) {
  const tag = html.match(/<link\b[^>]*\brel=(?:"|')canonical(?:"|')[^>]*>/i)?.[0];
  return tag?.match(/\bhref=(?:"([^"]*)"|'([^']*)')/i)?.slice(1).find(Boolean);
}

check(existsSync(articlesDir), "generated article directory exists");

const articleFiles = existsSync(articlesDir)
  ? readdirSync(articlesDir).filter((name) => name.endsWith(".html"))
  : [];
check(articleFiles.length > 0, "generated article pages exist");

for (const filename of articleFiles) {
  const slug = basename(filename, ".html");
  const html = readFileSync(join(articlesDir, filename), "utf8");
  const expectedUrl = `https://aivass.com/insights/articles/${slug}`;
  const canonical = getCanonical(html);
  const ogUrl = getMeta(html, "property", "og:url");
  const title = getMeta(html, "property", "og:title");
  const nestedRoute = join(articlesDir, slug, "index.html");

  check(canonical === expectedUrl, `${slug} canonical targets its article`, `got ${canonical}`);
  check(ogUrl === expectedUrl, `${slug} Open Graph URL targets its article`, `got ${ogUrl}`);
  check(Boolean(title) && !title.startsWith("AiVass —"), `${slug} has article-specific social title`);
  check(existsSync(nestedRoute), `${slug} trailing-slash article output exists`);
}

const artifactConfig = readFileSync(artifactConfigPath, "utf8");
const catchAllRewrite = 'from = "/*"\nto = "/index.html"';
const catchAllIndex = artifactConfig.indexOf(catchAllRewrite);

check(
  !artifactConfig.includes('from = "/insights/articles/*'),
  "article routing does not use unsupported wildcard substitution",
);

for (const filename of articleFiles) {
  const slug = basename(filename, ".html");
  const target = `/insights/articles/${slug}.html`;
  const cleanRewrite = `from = "/insights/articles/${slug}"\nto = "${target}"`;
  const trailingRewrite = `from = "/insights/articles/${slug}/"\nto = "${target}"`;
  const cleanIndex = artifactConfig.indexOf(cleanRewrite);
  const trailingIndex = artifactConfig.indexOf(trailingRewrite);

  check(cleanIndex >= 0, `${slug} clean path has an exact production rewrite`);
  check(trailingIndex >= 0, `${slug} trailing-slash path has an exact production rewrite`);
  check(
    cleanIndex >= 0 &&
      trailingIndex >= 0 &&
      cleanIndex < catchAllIndex &&
      trailingIndex < catchAllIndex,
    `${slug} article rewrites run before the SPA fallback`,
  );
  check(
    existsSync(join(appDir, "dist/public", target.slice(1))),
    `${slug} production rewrite target exists`,
  );
}

const insightsSource = readFileSync(insightsSourcePath, "utf8");
check(
  insightsSource.includes("article.pageHeroImage ?? article.heroImage") &&
    insightsSource.includes("article.pageHeroAlt ?? article.heroAlt"),
  "Insights cards prefer editorial article images",
);

const shareSource = readFileSync(shareSourcePath, "utf8");
check(
  shareSource.includes('xShareUrl.searchParams.set("url", canonicalUrl)') &&
    shareSource.includes('linkedInShareUrl.searchParams.set("url", canonicalUrl)') &&
    shareSource.includes("copyText(canonicalUrl)") &&
    shareSource.includes("url: canonicalUrl"),
  "every share action uses the canonical article URL",
);

if (failures.length > 0) {
  console.error(`\n${failures.length} article sharing validation check(s) failed:`);
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`\nArticle sharing validation passed for ${articleFiles.length} articles.`);