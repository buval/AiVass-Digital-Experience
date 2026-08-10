import { Link } from "wouter";

// Article data type — structured for SEO and AI discoverability
export interface Article {
  slug: string;
  title: string;
  author: string;
  publishedDate: string;
  updatedDate?: string;
  excerpt: string;
  category: string;
  body?: string; // HTML content
  relatedGuides?: string[];
  relatedArticles?: string[];
  socialImage?: string;
  canonicalUrl?: string;
}

// Placeholder articles — replace with real content as articles are published
// TODO: Move to a CMS, API, or static data file as the library grows
const ARTICLES: Article[] = [
  {
    slug: "building-extraordinary-ability-evidence",
    title: "Building Extraordinary Ability: What the Evidence Actually Requires",
    author: "AiVass",
    publishedDate: "2026",
    category: "Extraordinary Ability",
    excerpt:
      "A strategic breakdown of what strong evidence actually looks like — and why most professionals underestimate how much architecture it requires.",
  },
  {
    slug: "automation-with-soul",
    title: "Automation with Soul: Why AI Transformation Must Remain Human",
    author: "AiVass",
    publishedDate: "2026",
    category: "Transformation",
    excerpt:
      "The future should become more intelligent without becoming less human. What that principle means in practice for organizations deploying AI capability.",
  },
];

export default function Articles() {
  return (
    <div className="bg-cream min-h-screen pt-[60px] pb-[100px]">
      <div className="wrap">

        <nav className="text-[10px] tracking-[0.15em] uppercase text-grey mb-8">
          <Link href="/insights" className="hover:text-oxblood transition-colors">Insights</Link>
          <span className="mx-2 opacity-40">›</span>
          <span>Articles</span>
        </nav>

        <div className="eyebrow mb-6">Articles</div>
        <h1 className="text-[50px] md:text-[80px] font-serif leading-none tracking-[-0.05em] mb-6">
          Editorial analysis.<br />
          <em className="text-oxblood italic">Written for search.</em>
        </h1>
        <p className="text-[16px] text-navy-mid max-w-[550px] leading-[1.65] mb-[60px]">
          Long-form strategic thinking on transformation, capability architecture, and the intelligent future. All articles are free and indexed for search and AI discoverability.
        </p>

        {/* Article grid */}
        <div className="grid grid-cols-1 gap-[1px] bg-navy/10 mb-16">
          {ARTICLES.map((article) => (
            <article
              key={article.slug}
              className="bg-cream hover:bg-paper transition-colors p-[30px] md:p-[45px] grid grid-cols-1 md:grid-cols-[1fr_2.2fr] gap-6 md:gap-[60px]"
            >
              <div>
                <div className="eyebrow mb-3">{article.category}</div>
                <time className="text-[11px] text-grey tracking-[0.05em]">{article.publishedDate}</time>
              </div>
              <div>
                <h2 className="font-serif text-[26px] md:text-[34px] leading-[1.15] tracking-[-0.04em] mb-4">
                  {article.title}
                </h2>
                <p className="text-[14px] text-navy-mid leading-[1.65] mb-6">{article.excerpt}</p>
                <span className="link-under text-oxblood inline-block cursor-not-allowed opacity-50">
                  Coming soon
                </span>
                {/* // TODO: Link to article page when published: href={`/articles/${article.slug}`} */}
              </div>
            </article>
          ))}
        </div>

        {/* Content strategy note */}
        <div className="border-t border-navy/20 pt-[40px] grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <div className="eyebrow mb-4">Strategist Companion Pages</div>
            <p className="text-[13px] text-grey leading-[1.7]">
              Each AiVass Strategist Deck will have a crawlable HTML companion page containing the deck introduction, summary, key ideas and related analysis. Optimised for search and AI-search discovery.
            </p>
          </div>
          <div>
            <div className="eyebrow mb-4">Subscribe</div>
            <p className="text-[13px] text-grey leading-[1.7] mb-4">
              New articles and Strategist Decks are published regularly. Follow AiVass on LinkedIn or subscribe to be notified.
            </p>
            <a
              href="https://www.linkedin.com/company/aivass"
              target="_blank"
              rel="noopener noreferrer"
              className="link-under text-oxblood inline-block"
            >
              Follow on LinkedIn ↗
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
