import { Link } from "wouter";
import { ARTICLES } from "@/data/articles";
import { useSeoMeta } from "@/lib/seo";
import { trackInsightView } from "@/lib/analytics";

export default function Insights() {
  useSeoMeta({
    title: "Insights — Ideas for Building What Comes Next",
    description: "Free thought leadership from AiVass. Strategic frameworks, long-form articles, and field notes on transformation, capability architecture, and the intelligent future.",
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

        {/* Three content streams */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 mb-[80px]">

          {/* THE STRATEGIST */}
          <article className="md:pr-[35px] pb-10 md:pb-0 border-b md:border-b-0 md:border-r border-navy/15">
            <div className="eyebrow mb-4">The Strategist</div>
            <div className="aspect-[4/3] w-full bg-cream mb-6 border border-navy/10 overflow-hidden">
              <img
                src={`${import.meta.env.BASE_URL}images/aivass-insight-cover.png`}
                alt="The Strategist"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-[13px] text-grey leading-[1.6] mb-5">
              Visual thought-leadership decks — strategic frameworks, architectural breakdowns and editorial perspectives for individuals and organizations navigating complex transformations.
            </p>
            <span className="link-under text-oxblood inline-block cursor-pointer" onClick={() => trackInsightView("the-strategist")}>Read Latest Issue</span>
            {/* // TODO: Connect to Strategist deck destination */}
          </article>

          {/* ARTICLES */}
          <article className="md:px-[35px] py-10 md:py-0 border-b md:border-b-0 md:border-r border-navy/15">
            <div className="eyebrow mb-4">Articles</div>
            <div className="aspect-[4/3] w-full bg-navy/5 mb-6 border border-navy/10 flex items-center justify-center">
              <svg viewBox="0 0 120 90" fill="none" className="w-[60px] text-navy/20">
                <rect x="10" y="10" width="100" height="70" rx="2" stroke="currentColor" strokeWidth="1"/>
                <line x1="20" y1="28" x2="100" y2="28" stroke="currentColor" strokeWidth="0.8"/>
                <line x1="20" y1="40" x2="100" y2="40" stroke="currentColor" strokeWidth="0.8"/>
                <line x1="20" y1="52" x2="80" y2="52" stroke="currentColor" strokeWidth="0.8"/>
                <line x1="20" y1="64" x2="90" y2="64" stroke="currentColor" strokeWidth="0.8"/>
              </svg>
            </div>
            <p className="text-[13px] text-grey leading-[1.6] mb-5">
              Long-form, crawlable HTML editorial content — strategic analysis, capability frameworks and perspectives for organizations and individuals building extraordinary futures. Indexed for search and AI discovery.
            </p>
            <Link href="/articles" className="link-under text-oxblood inline-block" onClick={() => trackInsightView("articles")}>Browse Articles</Link>
          </article>

          {/* FIELD NOTES */}
          <article className="md:pl-[35px] pt-10 md:pt-0">
            <div className="eyebrow mb-4">Field Notes</div>
            <div className="aspect-[4/3] w-full bg-cream mb-6 border border-navy/10 overflow-hidden">
              <img
                src={`${import.meta.env.BASE_URL}images/aivass-insight-cover_2.png`}
                alt="Field Notes"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-[13px] text-grey leading-[1.6] mb-5">
              Shorter observations, tactical lessons and emerging patterns from the edge of transformation — ideas worth capturing before they become conventional wisdom.
            </p>
            <span className="link-under text-oxblood inline-block cursor-pointer" onClick={() => trackInsightView("field-notes")}>Explore Notes</span>
            {/* // TODO: Connect to Field Notes destination */}
          </article>
        </div>

        {/* Articles preview section */}
        <div className="border-t border-navy/20 pt-[50px]">
          <div className="flex items-end justify-between mb-8">
            <h2 className="font-serif text-[36px] md:text-[48px] tracking-[-0.04em] leading-none">Articles</h2>
            <Link href="/articles" className="link-under text-oxblood inline-block text-[10px] tracking-[0.13em]">View All</Link>
          </div>
          <p className="text-[14px] text-grey max-w-[500px] leading-[1.65] mb-10">
            Editorial analysis and strategic frameworks — written for search, readable by humans. All articles are free and indexed for discoverability.
          </p>
          {/* Article placeholders — will be populated from article data */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-navy/10">
            {ARTICLES.slice(0, 2).map((article) => (
              <div key={article.title} className="bg-paper p-8 md:p-10 hover:bg-cream/50 transition-colors">
                <div className="eyebrow mb-4">{article.categoryLabel}</div>
                <Link href={`/articles/${article.slug}`}>
                  <h3 className="font-serif text-[22px] md:text-[26px] leading-[1.2] tracking-[-0.03em] mb-3 hover:text-oxblood transition-colors cursor-pointer">
                    {article.title}
                  </h3>
                </Link>
                <p className="text-[13px] text-grey leading-[1.6] mb-6">{article.excerpt}</p>
                <span className="text-[10px] tracking-[0.12em] uppercase text-oxblood">
                  {new Date(article.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
