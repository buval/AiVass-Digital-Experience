import { Link, useParams } from "wouter";
import { useEffect } from "react";
import { ARTICLES } from "@/data/articles";
import { useSeoMeta } from "@/lib/seo";

export default function ArticleDetail() {
  const params = useParams();
  const slug = params.slug;
  const article = ARTICLES.find((a) => a.slug === slug);

  // Per-article SEO meta
  useSeoMeta(
    article
      ? {
          title: `${article.title} — AiVass`,
          description: article.metaDescription,
          canonical: `https://aivass.com/articles/${article.slug}`,
          ogType: "article",
        }
      : {
          title: "Article not found — AiVass",
          description: "The article you requested could not be found.",
          canonical: "https://aivass.com/articles",
        }
  );

  // Article + BreadcrumbList structured data
  useEffect(() => {
    if (!article) return;

    const articleLd = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": article.title,
      "description": article.metaDescription,
      "author": {
        "@type": "Person",
        "name": article.author,
      },
      "datePublished": article.publishedAt,
      "dateModified": article.updatedAt,
      "publisher": {
        "@type": "Organization",
        "name": "AiVass",
        "logo": {
          "@type": "ImageObject",
          "url": "https://aivass.com/favicon.svg",
        },
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `https://aivass.com/articles/${article.slug}`,
      },
    };

    const breadcrumbLd = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://aivass.com/" },
        { "@type": "ListItem", "position": 2, "name": "Articles", "item": "https://aivass.com/articles" },
        { "@type": "ListItem", "position": 3, "name": article.title, "item": `https://aivass.com/articles/${article.slug}` },
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

    return () => {
      scripts.forEach((s) => document.head.removeChild(s));
    };
  }, [article]);

  if (!article) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center text-center px-4">
        <div className="eyebrow mb-4">404</div>
        <h1 className="text-[40px] font-serif mb-6">Article not found.</h1>
        <Link href="/articles" className="btn-outline">Return to Articles</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <article className="pt-[60px] pb-[100px]">
        <div className="wrap max-w-[800px] mx-auto">
          <nav className="text-[10px] tracking-[0.15em] uppercase text-grey mb-[60px]">
            <Link href="/insights" className="hover:text-oxblood transition-colors">Insights</Link>
            <span className="mx-2 opacity-40">›</span>
            <Link href="/articles" className="hover:text-oxblood transition-colors">Articles</Link>
            <span className="mx-2 opacity-40">›</span>
            <span className="truncate">{article.title}</span>
          </nav>

          <div className="eyebrow mb-6">
            {article.categoryLabel} · {article.readingTime} min read
          </div>
          
          <h1 className="text-[40px] md:text-[60px] font-serif leading-[1.05] tracking-[-0.03em] mb-8">
            {article.title}
          </h1>

          <div className="flex items-center gap-4 text-[11px] tracking-[0.1em] uppercase text-grey mb-12 pb-12 border-b border-navy/10">
            <span>By {article.author}</span>
            <span className="w-[1px] h-3 bg-navy/20" />
            <time dateTime={article.publishedAt}>
              {new Date(article.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
          </div>

          <p className="font-serif italic text-[22px] md:text-[28px] leading-[1.5] text-navy mb-16">
            {article.excerpt}
          </p>

          <div className="bg-paper border border-navy p-8 md:p-12 flex flex-col items-center text-center">
            <svg viewBox="0 0 24 24" className="w-[24px] h-[24px] mb-6 text-oxblood" fill="currentColor">
              <path d="M12 2 L13.5 10.5 L22 12 L13.5 13.5 L12 22 L10.5 13.5 L2 12 L10.5 10.5Z"/>
            </svg>
            <h2 className="font-serif text-[24px] mb-4">Read the Full Article</h2>
            <p className="text-[14px] text-navy-mid leading-[1.6] mb-8 max-w-[400px]">
              The full article content is available on the AiVass platform.
            </p>
            <a 
              href={`https://aivass.com/blog/${article.slug}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-fill"
            >
              Read on aivass.com ↗
            </a>
          </div>

          <div className="mt-[100px] border-t border-navy/10 pt-[60px]">
            <h3 className="eyebrow mb-8">Related Resources</h3>
            <div className="bg-paper p-8">
              <h4 className="font-serif text-[22px] mb-2">Guides & Frameworks</h4>
              <p className="text-[13px] text-navy-mid mb-6 max-w-[400px]">
                Explore our full library of strategic guides designed to turn complex journeys into clear next steps.
              </p>
              <Link href="/guides" className="btn-outline">Explore Guides →</Link>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
