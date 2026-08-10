import { Link } from "wouter";
import { ARTICLES } from "@/data/articles";
import { useSeoMeta } from "@/lib/seo";
import { trackInsightView } from "@/lib/analytics";

export default function Insights() {
  useSeoMeta({
    title: "Insights — Ideas for Building What Comes Next",
    description:
      "Free thought leadership from AiVass. Strategic frameworks, long-form articles, and field notes on transformation, capability architecture, and the intelligent future.",
    canonical: "https://aivass.com/insights",
  });

  return (
    <div className="bg-paper min-h-screen pt-[60px] pb-[100px]">
      <div className="wrap">
        <div className="eyebrow mb-6">Editorial</div>
        <h1 className="text-[50px] md:text-[80px] font-serif leading-none tracking-[-0.05em] mb-6">
          Ideas for building<br />
          <em className="text-oxblood italic">what comes next.</em>
        </h1>
        <p className="text-[16px] text-navy-mid max-w-[500px] leading-[1.65] mb-16">
          Free thought leadership for people making meaningful change.
        </p>

        {/* Triptych banner — Past · Present · Future */}
        <div className="mb-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-navy/10" />
          <span className="text-[9px] tracking-[0.22em] uppercase text-navy/35">
            Past · Present · Future
          </span>
          <div className="h-px flex-1 bg-navy/10" />
        </div>

        {/* Three triptych images — continuous panoramic strip */}
        <div className="grid grid-cols-3 gap-0 mb-3 overflow-hidden">
          {[
            { file: "insight-triptych-past.jpg",    pos: "object-[center_30%]", label: "Past"    },
            { file: "insight-triptych-present.jpg", pos: "object-center",       label: "Present" },
            { file: "insight-triptych-future.jpg",  pos: "object-[center_25%]", label: "Future"  },
          ].map(({ file, pos, label }, i) => (
            <div key={label} className={`relative aspect-[3/4] overflow-hidden ${i === 1 ? "border-x border-paper/40" : ""}`}>
              <img
                src={`${import.meta.env.BASE_URL}images/${file}`}
                alt={`${label} — AiVass editorial triptych`}
                className={`w-full h-full object-cover ${pos} transition-transform duration-700 hover:scale-[1.03]`}
              />
              {/* Gradient overlay — darkens edges for continuity */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    i === 0
                      ? "linear-gradient(to right, rgba(13,27,46,0.18) 0%, transparent 45%)"
                      : i === 2
                      ? "linear-gradient(to left, rgba(13,27,46,0.18) 0%, transparent 45%)"
                      : "none",
                }}
              />
              {/* Era label — bottom left */}
              <div className="absolute bottom-0 left-0 right-0 p-3"
                style={{ background: "linear-gradient(to top, rgba(13,27,46,0.55) 0%, transparent 100%)" }}>
                <span className="text-[9px] tracking-[0.20em] uppercase text-cream/70">{label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Ox-light rule below images */}
        <div className="mb-[60px] h-px w-full"
          style={{ background: "linear-gradient(to right, transparent, rgba(217,163,155,0.30) 30%, rgba(217,163,155,0.30) 70%, transparent)" }} />

        {/* Three content streams */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 mb-[80px]">

          {/* THE STRATEGIST */}
          <article className="md:pr-[35px] pb-10 md:pb-0 border-b md:border-b-0 md:border-r border-navy/15">
            <div className="flex items-center gap-2 mb-4">
              <svg viewBox="0 0 12 12" className="w-[9px] h-[9px] text-oxblood/60" fill="currentColor">
                <path d="M6 0 L7.2 4.8 L12 6 L7.2 7.2 L6 12 L4.8 7.2 L0 6 L4.8 4.8Z" />
              </svg>
              <div className="eyebrow">The Strategist</div>
            </div>
            <p className="text-[13px] text-grey leading-[1.6] mb-5">
              Visual thought-leadership decks — strategic frameworks, architectural breakdowns and
              editorial perspectives for individuals and organizations navigating complex transformations.
            </p>
            <span
              className="link-under text-oxblood inline-block cursor-pointer"
              onClick={() => trackInsightView("the-strategist")}
            >
              Read Latest Issue
            </span>
          </article>

          {/* ARTICLES */}
          <article className="md:px-[35px] py-10 md:py-0 border-b md:border-b-0 md:border-r border-navy/15">
            <div className="flex items-center gap-2 mb-4">
              <svg viewBox="0 0 12 12" className="w-[9px] h-[9px] text-oxblood/60" fill="currentColor">
                <path d="M6 0 L7.2 4.8 L12 6 L7.2 7.2 L6 12 L4.8 7.2 L0 6 L4.8 4.8Z" />
              </svg>
              <div className="eyebrow">Articles</div>
            </div>
            <p className="text-[13px] text-grey leading-[1.6] mb-5">
              Long-form, crawlable HTML editorial content — strategic analysis, capability frameworks and
              perspectives for organizations and individuals building extraordinary futures.
            </p>
            <Link
              href="/insights/articles"
              className="link-under text-oxblood inline-block"
              onClick={() => trackInsightView("articles")}
            >
              Browse Articles
            </Link>
          </article>

          {/* FIELD NOTES */}
          <article className="md:pl-[35px] pt-10 md:pt-0">
            <div className="flex items-center gap-2 mb-4">
              <svg viewBox="0 0 12 12" className="w-[9px] h-[9px] text-oxblood/60" fill="currentColor">
                <path d="M6 0 L7.2 4.8 L12 6 L7.2 7.2 L6 12 L4.8 7.2 L0 6 L4.8 4.8Z" />
              </svg>
              <div className="eyebrow">Field Notes</div>
            </div>
            <p className="text-[13px] text-grey leading-[1.6] mb-5">
              Shorter observations, tactical lessons and emerging patterns from the edge of
              transformation — ideas worth capturing before they become conventional wisdom.
            </p>
            <span
              className="link-under text-oxblood inline-block cursor-pointer"
              onClick={() => trackInsightView("field-notes")}
            >
              Explore Notes
            </span>
          </article>
        </div>

        {/* Articles preview */}
        <div className="border-t border-navy/20 pt-[50px]">
          <div className="flex items-end justify-between mb-8">
            <h2 className="font-serif text-[36px] md:text-[48px] tracking-[-0.04em] leading-none">
              Articles
            </h2>
            <Link
              href="/insights/articles"
              className="link-under text-oxblood inline-block text-[10px] tracking-[0.13em]"
            >
              View All
            </Link>
          </div>
          <p className="text-[14px] text-grey max-w-[500px] leading-[1.65] mb-10">
            Editorial analysis and strategic frameworks — written for discoverability. All articles are
            free and indexed for search and AI discovery.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-navy/10">
            {ARTICLES.slice(0, 2).map((article) => (
              <div
                key={article.slug}
                className="bg-paper hover:bg-cream/50 transition-colors group"
              >
                {/* Article hero thumbnail */}
                {article.heroImage && (
                  <div className="aspect-[16/9] overflow-hidden">
                    <img
                      src={`${import.meta.env.BASE_URL}images/${article.heroImage}`}
                      alt={article.heroAlt}
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                    />
                  </div>
                )}
                <div className="p-8 md:p-10">
                  <div className="eyebrow mb-4">{article.categoryLabel}</div>
                  <Link href={`/insights/articles/${article.slug}`}>
                    <h3 className="font-serif text-[22px] md:text-[26px] leading-[1.2] tracking-[-0.03em] mb-3 hover:text-oxblood transition-colors cursor-pointer">
                      {article.title}
                    </h3>
                  </Link>
                  <p className="text-[13px] text-grey leading-[1.6] mb-6">{article.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] tracking-[0.12em] uppercase text-oxblood">
                      {new Date(article.publishedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    <Link
                      href={`/insights/articles/${article.slug}`}
                      className="text-[10px] tracking-[0.12em] uppercase text-navy hover:text-oxblood transition-colors"
                    >
                      Read →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
