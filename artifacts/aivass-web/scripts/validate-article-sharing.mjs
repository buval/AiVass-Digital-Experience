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
const { ARTICLES } = await import(join(appDir, "src/data/articles.ts"));
const liveBaseUrl = process.argv.find((arg) => arg.startsWith("--base-url="))?.slice("--base-url=".length);
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
check(
  ARTICLES.length === articleFiles.length &&
    ARTICLES.every((article) => articleFiles.includes(`${article.slug}.html`)),
  "every published article has generated HTML",
);

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

// Opt in after publishing: test the real static host rather than treating
// matching configuration strings as evidence that deployed routing works.
if (liveBaseUrl) {
  const base = new URL(liveBaseUrl);
  check(["http:", "https:"].includes(base.protocol), "live target is an HTTP URL");
  for (const article of ARTICLES) {
    const canonical = `https://aivass.com/insights/articles/${article.slug}`;
    for (const suffix of ["", "/"]) {
      const path = `/insights/articles/${article.slug}${suffix}`;
      try {
        const response = await fetch(new URL(path, base), {
          signal: AbortSignal.timeout(20000),
        });
        const html = await response.text();
        check(response.status === 200, `live ${path} returns 200`, `got ${response.status}`);
        check(
          new URL(response.url).origin === base.origin &&
            [`/insights/articles/${article.slug}`, `/insights/articles/${article.slug}/`]
              .includes(new URL(response.url).pathname),
          `live ${path} keeps a clean article URL`,
        );
        check(getCanonical(html) === canonical, `live ${path} canonical`);
        for (const [name, value] of [
          ["og:url", canonical],
          ["og:title", `${article.title} — AiVass`],
          ["og:description", article.metaDescription],
          ["og:image", article.heroImage
            ? `https://aivass.com/images/${article.heroImage}`
            : "https://aivass.com/opengraph.jpg"],
        ]) {
          const escaped = value.replaceAll("&", "&amp;").replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;").replaceAll('"', "&quot;");
          check(getMeta(html, "property", name) === escaped, `live ${path} ${name}`);
        }
        check(html.includes("<article>") && html.includes("<h1>"),
          `live ${path} includes crawler-readable article content`);
      } catch (error) {
        check(false, `live ${path} responds`, error.message);
      }
    }
  }
}

if (failures.length > 0) {
  console.error(`\n${failures.length} article sharing validation check(s) failed:`);
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`\nArticle sharing validation passed for ${articleFiles.length} articles.`);