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

  const articleMeta = [
    `<meta property="og:site_name" content="AiVass" />`,
    `<meta property="og:locale" content="en_US" />`,
    `<meta property="og:image:alt" content="${esc(article.heroAlt)}" />`,
    ...(article.heroImageWidth
      ? [`<meta property="og:image:width" content="${article.heroImageWidth}" />`]
      : []),
    ...(article.heroImageHeight
      ? [`<meta property="og:image:height" content="${article.heroImageHeight}" />`]
      : []),
    `<meta property="article:published_time" content="${esc(article.publishedAt)}" />`,
    `<meta property="article:modified_time" content="${esc(article.updatedAt)}" />`,
    `<meta property="article:author" content="${esc(article.author)}" />`,
    `<meta property="article:section" content="${esc(article.categoryLabel)}" />`,
    ...article.tags.map((tag) => `<meta property="article:tag" content="${esc(tag)}" />`),
    `<meta name="twitter:site" content="@AiVass_com" />`,
    `<meta name="twitter:image:alt" content="${esc(article.heroAlt)}" />`,
  ].join("\n    ");

  // Structured data
  const lds = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: article.title,
      description: desc,
      url,
      articleSection: article.categoryLabel,
      keywords: article.keywords,
      inLanguage: "en-US",
      author: { "@type": "Person", name: article.author },
      datePublished: article.publishedAt,
      dateModified: article.updatedAt,
      publisher: {
        "@type": "Organization",
        name: "AiVass",
        logo: { "@type": "ImageObject", url: "https://aivass.com/favicon.svg" },
      },
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      ...(article.heroImage
        ? {
            image: {
              "@type": "ImageObject",
              url: image,
              ...(article.heroImageWidth ? { width: article.heroImageWidth } : {}),
              ...(article.heroImageHeight ? { height: article.heroImageHeight } : {}),
              caption: article.heroAlt,
            },
          }
        : {}),
      isPartOf: {
        "@type": "Blog",
        name: "AiVass Field Notes",
        url: "https://aivass.com/insights/articles",
      },
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
  html = setTag(
    html,
    /<\/head>/,
    () => `    ${articleMeta}\n    ${ldScripts}\n  </head>`,
    "</head>",
    article.slug,
  );

  const articleSupplement = article.slug === "support-system-every-immigrant-needs"
    ? [
        `<h2>The support system underneath the visible systems</h2>`,
        `<p>Immigration, employment, housing and healthcare are visible systems we learn to navigate. This Field Note maps the invisible system underneath: intimate belonging, friendship, purpose, practical infrastructure and a relationship with yourself.</p>`,
        `<p>A move often weakens both unconditional love nearby and a felt sense of place, leaving work and portable friendships to carry more than they should. That is not a personal failure; it is a structure that can be rebuilt.</p>`,
        `<h2>What distance takes</h2>`,
        `<p>Distance often removes two layers first: the people who love you unconditionally and the familiar ground of language, place and ordinary routine. Work and portable friendships survive the move, so they can quietly absorb more emotional weight than they should.</p>`,
        `<h2>The five layers of an immigrant support system</h2>`,
        `<ol><li><strong>Your relationship with yourself:</strong> sleep, food, movement, health, financial breathing room, emotional honesty, curiosity and a place where your nervous system can settle.</li><li><strong>Love and intimate belonging:</strong> family, partnership, chosen family and beloved animals — the circle that holds tenderness, home and the freedom to be unimpressive.</li><li><strong>Friendship and community:</strong> reciprocal relationships and repeated belonging with people who know the real you.</li><li><strong>Purpose and professional belonging:</strong> meaningful work, mentors, colleagues, creative practice and contribution.</li><li><strong>Practical infrastructure:</strong> housing, healthcare, money, legal stability, transport and knowing where to turn for professional help.</li></ol>`,
        `<h2>Loneliness is not boredom</h2>`,
        `<p>A full calendar can coexist with feeling unknown. The <a href="https://www.cdc.gov/social-connectedness/improving/index.html">CDC distinguishes social isolation from loneliness</a>: one concerns limited relationships or support, while the other is the felt experience of being alone or disconnected. The goal is not simply more contacts, but reciprocal relationships and repeated belonging.</p>`,
        `<h2>Use the Mandala of Support</h2>`,
        `<p>The Mandala is a reflection tool, not a verdict. Give each dimension a score from one to ten, notice the shape honestly, and choose one relationship, ritual, resource or decision to strengthen next.</p>`,
        `<ol><li>Inner Self</li><li>Family and Intimate Life</li><li>Friendship and Community</li><li>Health and the Body</li><li>Work, Career and Purpose</li><li>Money and Stability</li><li>Learning and Expansion</li><li>Joy, Rest and Play</li></ol>`,
        `<p><a href="https://aivass.com/insights/mandala-of-support">Open the free interactive Mandala of Support</a>. Your scores remain private to your browser.</p>`,
        `<p><a href="https://aivass.com/downloads/aivass-field-note-01-the-support-system.pdf">Download the free printable Field Note (PDF, 10 pages)</a> to draw your wheel, reflect on the five rings of support, and return to the practice whenever you need it.</p>`,
        `<h2>Where to begin when family is far away</h2>`,
        `<ol><li>Name whether the support you need is emotional, physical, practical, professional, spiritual or financial.</li><li>Turn long-distance love into dependable rituals such as a fixed weekly call and a shared emergency plan.</li><li>Build a small local inner circle through consistent, reciprocal contact.</li><li>Choose repeated belonging — a weekly class, volunteer team, congregation, sports club or neighbourhood group — over endless networking.</li><li>Notice whether work and geography support the life you are trying to build.</li><li>Let hobbies and animals be real strands of support without asking them to carry everything.</li><li>Ask for professional support before the breaking point.</li></ol>`,
        `<h2>Helpful starting points</h2>`,
        `<ul><li><a href="https://theopenatlas.org/">Open Atlas</a> — a community for high-skilled immigrants building their futures in the United States.</li><li><a href="https://www.cdc.gov/social-connectedness/improving/index.html">CDC: Improving Social Connectedness</a> — practical ways to build and strengthen connection.</li><li><a href="https://www.hhs.gov/surgeongeneral/reports-and-publications/recipes/index.html">U.S. Surgeon General: Recipes for Connection</a> — a free booklet on gathering people around food.</li><li><a href="https://www.findhelp.org/">Findhelp</a> — search free and reduced-cost local services.</li><li><a href="https://www.nami.org/support-groups/">NAMI Support Groups</a> — peer and family support, including virtual groups.</li><li><a href="https://988lifeline.org/">988 Lifeline</a> — confidential, 24/7 support in the United States for emotional distress.</li></ul>`,
        `<p>This Field Note is general information and personal reflection, not medical, psychological, legal or immigration advice.</p>`,
      ]
    : [];

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
    ...articleSupplement,
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
