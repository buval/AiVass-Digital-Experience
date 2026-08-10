import { Link } from "wouter";
import { ARTICLES } from "@/data/articles";
import { useSeoMeta } from "@/lib/seo";

export default function Articles() {
  useSeoMeta({
    title: "Articles — Analysis & Strategy",
    description:
      "Long-form strategic thinking on transformation, capability architecture, and the intelligent future. All AiVass articles are free and indexed for search and AI discovery.",
    canonical: "https://aivass.com/insights/articles",
  });

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-navy text-cream pt-12 pb-[80px] md:pt-[60px] md:pb-[100px]">
        <div className="wrap">
          <nav className="text-[10px] tracking-[0.15em] uppercase text-ox-light/60 mb-[50px]">
            <Link href="/insights" className="hover:text-ox-light transition-colors">Insights</Link>
            <span className="mx-2 opacity-40">›</span>
            <span>Articles</span>
          </nav>
          <div className="eyebrow text-ox-light mb-6">Editorial</div>
          <h1 className="text-[50px] md:text-[80px] font-serif leading-none tracking-[-0.05em] mb-6">
            Editorial analysis.<br />
            <em className="text-ox-light italic">Long-form thinking.</em>
          </h1>
          <p className="text-[16px] text-ox-light/70 max-w-[500px] leading-[1.65]">
            Strategic frameworks and field intelligence — written for search, readable by humans.
            All articles are free and indexed for discoverability.
          </p>
        </div>
      </div>

      {/* Article list */}
      <div className="wrap py-[60px] md:py-[90px]">
        <div className="space-y-0 border-t border-navy/10">
          {ARTICLES.map((article) => (
            <div key={article.slug} className="border-b border-navy/10 py-10 md:py-12 group">
              <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-8 md:gap-16 items-start">
                <div>
                  <div className="eyebrow mb-4">{article.categoryLabel}</div>
                  <Link href={`/insights/articles/${article.slug}`}>
                    <h2 className="font-serif text-[28px] md:text-[38px] leading-[1.1] tracking-[-0.04em] mb-4 group-hover:text-oxblood transition-colors cursor-pointer">
                      {article.title}
                    </h2>
                  </Link>
                  <p className="text-[14px] text-navy-mid leading-[1.7] mb-6 max-w-[560px]">
                    {article.excerpt}
                  </p>
                  <div className="flex flex-wrap items-center gap-5 text-[11px] tracking-[0.1em] uppercase text-grey">
                    <span>By {article.author}</span>
                    <span className="w-[1px] h-3 bg-navy/20" />
                    <time dateTime={article.publishedAt}>
                      {new Date(article.publishedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                    <span className="w-[1px] h-3 bg-navy/20" />
                    <span>{article.readingTime} min read</span>
                  </div>
                </div>

                {/* Thumbnail + CTA */}
                <div className="flex flex-col gap-5">
                  {article.heroImage && (
                    <Link href={`/insights/articles/${article.slug}`}>
                      <div className="aspect-[16/10] overflow-hidden">
                        <img
                          src={`${import.meta.env.BASE_URL}images/${article.heroImage}`}
                          alt={article.heroAlt}
                          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                        />
                      </div>
                    </Link>
                  )}
                  <Link
                    href={`/insights/articles/${article.slug}`}
                    className="btn-outline w-full text-center"
                  >
                    Read Article →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Back to Insights */}
        <div className="mt-[60px] text-center">
          <Link href="/insights" className="link-under text-[11px] tracking-[0.12em] uppercase">
            ← Back to Insights
          </Link>
        </div>
      </div>
    </div>
  );
}
