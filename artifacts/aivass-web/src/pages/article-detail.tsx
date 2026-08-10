import { Link, useParams } from "wouter";
import { useEffect } from "react";
import { ARTICLES } from "@/data/articles";
import { GUIDES, guideCheckoutUrl, guideSampleUrl } from "@/data/guides";
import { ARTICLE_BODIES } from "@/data/article-bodies/index";
import { useSeoMeta } from "@/lib/seo";

/** Table of contents sections for long articles — keyed by article slug. */
const TOC_SECTIONS: Record<string, { id: string; label: string }[]> = {
  "eb1a-critical-role-criterion": [
    { id: "what-is", label: "What Is Criterion 8?" },
    { id: "leading-vs-critical", label: "Leading vs. Critical Role" },
    { id: "distinguished-reputation", label: "Proving Distinguished Reputation" },
    { id: "evidence-breakdown", label: "Evidence Breakdown" },
    { id: "examples", label: "Real-World Examples" },
    { id: "expert-letters", label: "Expert Letter Strategy" },
    { id: "common-mistakes", label: "5 Common Mistakes" },
    { id: "final-merits", label: "Final Merits Determination" },
    { id: "checklist", label: "Readiness Checklist" },
  ],
};

export default function ArticleDetail() {
  const params = useParams();
  const slug = params.slug;
  const article = ARTICLES.find((a) => a.slug === slug);
  const ArticleBody = article ? ARTICLE_BODIES[article.slug] : null;

  // Per-article SEO meta — canonical at /insights/articles/{slug}
  useSeoMeta(
    article
      ? {
          title: `${article.title} — AiVass`,
          description: article.metaDescription,
          canonical: `https://aivass.com/insights/articles/${article.slug}`,
          ogType: "article",
        }
      : {
          title: "Article not found — AiVass",
          description: "The article you requested could not be found.",
          canonical: "https://aivass.com/insights/articles",
        }
  );

  // Article + BreadcrumbList structured data
  useEffect(() => {
    if (!article) return;

    const articleLd = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: article.title,
      description: article.metaDescription,
      author: { "@type": "Person", name: article.author },
      datePublished: article.publishedAt,
      dateModified: article.updatedAt,
      publisher: {
        "@type": "Organization",
        name: "AiVass",
        logo: { "@type": "ImageObject", url: "https://aivass.com/favicon.svg" },
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `https://aivass.com/insights/articles/${article.slug}`,
      },
      ...(article.heroImage
        ? { image: `https://aivass.com/images/${article.heroImage}` }
        : {}),
    };

    const breadcrumbLd = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://aivass.com/" },
        { "@type": "ListItem", position: 2, name: "Insights", item: "https://aivass.com/insights" },
        { "@type": "ListItem", position: 3, name: "Articles", item: "https://aivass.com/insights/articles" },
        { "@type": "ListItem", position: 4, name: article.title, item: `https://aivass.com/insights/articles/${article.slug}` },
      ],
    };

    const scripts: HTMLScriptElement[] = [];
    [articleLd, breadcrumbLd].forEach((ld) => {
      const s = document.createElement("script");
      s.type = "application/ld+json";
      s.text = JSON.stringify(ld);
      document.head.appendChild(s);
      scripts.push(s);
    });
    return () => { scripts.forEach((s) => document.head.removeChild(s)); };
  }, [article]);

  if (!article) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center text-center px-4">
        <div className="eyebrow mb-4">404</div>
        <h1 className="text-[40px] font-serif mb-6">Article not found.</h1>
        <Link href="/insights/articles" className="btn-outline">Return to Articles</Link>
      </div>
    );
  }

  const relatedGuideObjects = article.relatedGuides
    .map((s) => GUIDES.find((g) => g.slug === s))
    .filter(Boolean) as typeof GUIDES;

  const relatedArticleObjects = article.relatedArticles
    .map((s) => ARTICLES.find((a) => a.slug === s))
    .filter(Boolean) as typeof ARTICLES;

  const tocSections = TOC_SECTIONS[article.slug] ?? [];

  return (
    <div className="min-h-screen bg-cream">
      {/* HERO IMAGE */}
      {article.heroImage && (
        <div className="w-full h-[45vh] md:h-[58vh] overflow-hidden">
          <img
            src={`${import.meta.env.BASE_URL}images/${article.heroImage}`}
            alt={article.heroAlt}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <article className={`${article.heroImage ? "pt-[50px]" : "pt-[60px]"} pb-[100px]`}>
        <div className="wrap max-w-[860px] mx-auto">

          {/* Breadcrumb */}
          <nav className="text-[10px] tracking-[0.15em] uppercase text-grey mb-10">
            <Link href="/insights" className="hover:text-oxblood transition-colors">Insights</Link>
            <span className="mx-2 opacity-40">›</span>
            <Link href="/insights/articles" className="hover:text-oxblood transition-colors">Articles</Link>
            <span className="mx-2 opacity-40">›</span>
            <span className="truncate max-w-[200px] inline-block align-bottom">{article.title}</span>
          </nav>

          {/* Meta */}
          <div className="eyebrow mb-6">
            {article.categoryLabel} · {article.readingTime} min read
          </div>

          {/* Title */}
          <h1 className="text-[38px] md:text-[58px] font-serif leading-[1.05] tracking-[-0.03em] mb-8 max-w-[760px]">
            {article.title}
          </h1>

          {/* Author + date */}
          <div className="flex flex-wrap items-center gap-4 text-[11px] tracking-[0.1em] uppercase text-grey mb-10 pb-10 border-b border-navy/10">
            <span>By {article.author}</span>
            <span className="w-[1px] h-3 bg-navy/20" />
            <time dateTime={article.publishedAt}>
              {new Date(article.publishedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          </div>

          {/* Standfirst */}
          <p className="font-serif italic text-[20px] md:text-[26px] leading-[1.5] text-navy mb-12 max-w-[680px]">
            {article.excerpt}
          </p>

          {/* Table of Contents (long articles only) */}
          {article.hasToc && tocSections.length > 0 && (
            <div className="bg-paper border border-navy/10 p-6 md:p-8 mb-12">
              <div className="text-[10px] tracking-[0.18em] uppercase text-grey mb-5">Contents</div>
              <ol className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                {tocSections.map(({ id, label }, i) => (
                  <li key={id}>
                    <a
                      href={`#${id}`}
                      className="text-[13px] text-navy-mid hover:text-oxblood transition-colors flex items-start gap-3"
                    >
                      <span className="text-grey text-[11px] mt-0.5 flex-shrink-0">{i + 1}.</span>
                      {label}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Article body */}
          {ArticleBody ? (
            <ArticleBody />
          ) : (
            // Fallback if body component not yet registered
            <div className="bg-paper border border-navy p-8 md:p-12 flex flex-col items-center text-center max-w-[680px]">
              <svg viewBox="0 0 24 24" className="w-[24px] h-[24px] mb-6 text-oxblood" fill="currentColor">
                <path d="M12 2 L13.5 10.5 L22 12 L13.5 13.5 L12 22 L10.5 13.5 L2 12 L10.5 10.5Z" />
              </svg>
              <h2 className="font-serif text-[24px] mb-4">Full article coming soon</h2>
              <p className="text-[14px] text-navy-mid leading-[1.6] max-w-[400px]">
                This article is being migrated into the new AiVass experience.
              </p>
            </div>
          )}

          {/* ── Related Resources ── */}
          {(relatedGuideObjects.length > 0 || relatedArticleObjects.length > 0) && (
            <div className="mt-[100px] border-t border-navy/15 pt-[60px]">
              <div className="eyebrow mb-10">Related Resources</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-navy/10">
                {/* Related Guides */}
                {relatedGuideObjects.map((guide) => (
                  <div key={guide.slug} className="bg-cream p-8">
                    <div className="text-[10px] tracking-[0.15em] uppercase text-grey mb-3">Guide</div>
                    <h3 className="font-serif text-[20px] md:text-[24px] leading-tight mb-2">{guide.name}</h3>
                    <p className="font-serif italic text-[13px] text-oxblood mb-4">{guide.subtitle}</p>
                    <p className="text-[13px] text-navy-mid leading-[1.6] mb-6 line-clamp-2">{guide.description}</p>
                    <div className="flex gap-3 flex-wrap">
                      <Link href={`/guides/${guide.slug}`} className="btn-outline text-[10px]">
                        View Guide
                      </Link>
                      <a
                        href={guideCheckoutUrl(guide.slug)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn text-[10px]"
                      >
                        Purchase →
                      </a>
                    </div>
                  </div>
                ))}

                {/* Related Articles */}
                {relatedArticleObjects.map((a) => (
                  <div key={a.slug} className="bg-paper p-8">
                    <div className="text-[10px] tracking-[0.15em] uppercase text-grey mb-3">{a.categoryLabel}</div>
                    <h3 className="font-serif text-[20px] md:text-[24px] leading-tight mb-2">{a.title}</h3>
                    <p className="text-[13px] text-navy-mid leading-[1.6] mb-6">{a.excerpt}</p>
                    <Link href={`/insights/articles/${a.slug}`} className="btn-outline text-[10px]">
                      Read Article
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Assessment CTA */}
          <div className="mt-[80px] border-t border-navy/15 pt-[60px] flex flex-col md:flex-row items-start gap-10">
            <div className="flex-1">
              <div className="eyebrow mb-4">Start Building</div>
              <h3 className="font-serif text-[28px] md:text-[36px] leading-[1.1] tracking-[-0.04em] mb-4">
                Ready to assess your profile?
              </h3>
              <p className="text-[14px] text-navy-mid leading-[1.7] max-w-[420px]">
                AiVass works with individuals building extraordinary ability profiles. The journey begins
                with a Strategic Profile Assessment.
              </p>
            </div>
            <div className="flex flex-col gap-3 shrink-0">
              <Link href="/solutions/individuals" className="btn-fill">
                Explore Pathways
              </Link>
              <Link href="/guides" className="btn-outline">
                Browse Guides
              </Link>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
