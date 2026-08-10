import { Link, useParams } from "wouter";
import { GUIDES, BUNDLE, guideCheckoutUrl, guideSampleUrl, formatPrice } from "@/data/guides";
import { useSeoMeta } from "@/lib/seo";
import { trackGuidePurchaseClick, trackGuideSampleClick } from "@/lib/analytics";
import { useEffect } from "react";

export default function GuideDetail() {
  const params = useParams();
  const slug = params.slug;

  // Find the guide (including bundle)
  const guide = [...GUIDES, BUNDLE].find((g) => g.slug === slug);

  useSeoMeta(
    guide
      ? {
          title: `${guide.name} — ${guide.subtitle}`,
          description: guide.description,
          canonical: `https://aivass.com/guides/${guide.slug}`,
          ogType: "website",
          ogImage: guide.heroImage
            ? `https://aivass.com/images/${guide.heroImage}`
            : undefined,
        }
      : {
          title: "Guide not found — AiVass",
          description: "The guide you requested could not be found.",
          canonical: "https://aivass.com/guides",
        }
  );

  // Product structured data
  useEffect(() => {
    if (!guide) return;
    const ld = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: guide.name,
      description: guide.description,
      brand: { "@type": "Brand", name: "AiVass" },
      offers: {
        "@type": "Offer",
        price: (guide.priceCents / 100).toFixed(2),
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
        url: guideCheckoutUrl(guide.slug),
      },
      ...(guide.heroImage
        ? { image: `https://aivass.com/images/${guide.heroImage}` }
        : {}),
    };
    const breadcrumbLd = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://aivass.com/" },
        { "@type": "ListItem", position: 2, name: "Guides", item: "https://aivass.com/guides" },
        { "@type": "ListItem", position: 3, name: guide.name, item: `https://aivass.com/guides/${guide.slug}` },
      ],
    };
    const scripts: HTMLScriptElement[] = [];
    [ld, breadcrumbLd].forEach((obj) => {
      const s = document.createElement("script");
      s.type = "application/ld+json";
      s.text = JSON.stringify(obj);
      document.head.appendChild(s);
      scripts.push(s);
    });
    return () => { scripts.forEach((s) => document.head.removeChild(s)); };
  }, [guide]);

  if (!guide) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center text-center px-4">
        <div className="eyebrow mb-4">404</div>
        <h1 className="text-[40px] font-serif mb-6">Guide not found.</h1>
        <Link href="/guides" className="btn-outline">Browse All Guides</Link>
      </div>
    );
  }

  const relatedGuides = guide.relatedGuides
    .map((s) => GUIDES.find((g) => g.slug === s))
    .filter(Boolean) as typeof GUIDES;

  return (
    <div className="min-h-screen bg-cream">

      {/* HERO */}
      <div className="relative w-full h-[55vh] md:h-[68vh] overflow-hidden">
        <img
          src={`${import.meta.env.BASE_URL}images/${guide.heroImage}`}
          alt={guide.heroAlt}
          className="w-full h-full object-cover"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy/75 via-navy/20 to-transparent" />
        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 pb-10 md:pb-14">
          <div className="wrap">
            <div className="eyebrow text-ox-light mb-4">{guide.category}</div>
            <h1 className="font-serif text-[36px] md:text-[60px] text-cream leading-none tracking-[-0.05em]">
              {guide.name}
            </h1>
          </div>
        </div>
      </div>

      {/* BREADCRUMB */}
      <div className="bg-paper border-b border-navy/10">
        <div className="wrap py-4 text-[10px] tracking-[0.15em] uppercase text-grey">
          <Link href="/guides" className="hover:text-oxblood transition-colors">Guides</Link>
          <span className="mx-2 opacity-40">›</span>
          <span>{guide.name}</span>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="wrap py-[60px] md:py-[90px]">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_340px] gap-[60px] md:gap-[80px] items-start">

          {/* Left: content */}
          <div>
            {/* Subtitle */}
            <p className="font-serif italic text-[20px] md:text-[26px] text-oxblood mb-8">
              {guide.subtitle}
            </p>

            {/* Description */}
            <p className="text-[15px] md:text-[16px] text-navy-mid leading-[1.85] mb-10">
              {guide.description}
            </p>

            {/* Audience */}
            <div className="mb-10">
              <h2 className="text-[10px] tracking-[0.18em] uppercase text-grey mb-4">Who This Is For</h2>
              <p className="text-[15px] text-navy-mid leading-[1.7]">{guide.audience}</p>
            </div>

            {/* What you'll learn */}
            <div className="mb-10">
              <h2 className="text-[10px] tracking-[0.18em] uppercase text-grey mb-5">What You'll Learn</h2>
              <ul className="space-y-3">
                {guide.learningPoints.map((point, i) => (
                  <li key={i} className="flex items-start gap-4 text-[14px] md:text-[15px] text-navy-mid leading-[1.65]">
                    <svg viewBox="0 0 24 24" className="w-[10px] h-[10px] text-oxblood shrink-0 mt-[6px]" fill="currentColor">
                      <path d="M12 2 L13.5 10.5 L22 12 L13.5 13.5 L12 22 L10.5 13.5 L2 12 L10.5 10.5Z" />
                    </svg>
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            {/* Page count */}
            <div className="text-[11px] tracking-[0.15em] uppercase text-grey border-t border-navy/10 pt-6">
              {guide.pageCount} pages &nbsp;·&nbsp; PDF download &nbsp;·&nbsp; Instant delivery
            </div>
          </div>

          {/* Right: sticky purchase card */}
          <div className="md:sticky md:top-24">
            <div className="bg-navy text-cream p-8">
              <div className="text-[11px] tracking-[0.15em] uppercase text-ox-light mb-2">{guide.name}</div>
              <div className="font-serif text-[48px] leading-none mb-1">{formatPrice(guide.priceCents)}</div>
              <div className="text-[11px] tracking-[0.1em] text-ox-light uppercase mb-8">PDF download · Instant access</div>

              <div className="space-y-3">
                <a
                  href={guideCheckoutUrl(guide.slug)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-fill !bg-cream !text-navy hover:!bg-paper w-full text-center block"
                  onClick={() => trackGuidePurchaseClick(guide.slug)}
                >
                  Purchase →
                </a>
                {/* Free sample button restored once PDFs are in /public/samples/ and download system is live */}
              </div>

              <p className="text-[10px] text-cream/40 leading-[1.5] mt-6">
                AiVass provides strategic and educational support. These guides are educational materials,
                not legal advice or representation.
              </p>
            </div>

            {/* Trust badges */}
            <div className="border border-navy/10 p-5 mt-[1px] bg-paper grid grid-cols-3 gap-0 text-center">
              {[["Secure", "Checkout"], ["Instant", "Delivery"], ["PDF", "Format"]].map(([l1, l2], i) => (
                <div key={i} className="text-[10px] tracking-[0.1em] uppercase text-grey leading-[1.4] border-r last:border-r-0 border-navy/10 px-2">
                  {l1}<br />{l2}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related Guides */}
        {relatedGuides.length > 0 && (
          <div className="mt-[100px] border-t border-navy/10 pt-[60px]">
            <div className="eyebrow mb-10">Related Guides</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-[1px] bg-navy/10">
              {relatedGuides.slice(0, 3).map((related) => (
                <div key={related.slug} className="bg-cream p-6 group">
                  {/* Thumbnail */}
                  <div className="aspect-[4/3] overflow-hidden mb-5">
                    <img
                      src={`${import.meta.env.BASE_URL}images/${related.heroImage}`}
                      alt={related.heroAlt}
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                    />
                  </div>
                  <h3 className="font-serif text-[18px] text-navy mb-1">{related.name}</h3>
                  <p className="font-serif italic text-[12px] text-oxblood mb-4">{related.subtitle}</p>
                  <Link href={`/guides/${related.slug}`} className="link-under text-[11px]">
                    View Guide →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <p className="text-[11px] text-grey mt-16 max-w-[500px] leading-[1.5]">
          AiVass provides strategic, educational and coaching support. Not legal advice or representation.
          Purchase constitutes acceptance of AiVass{" "}
          <Link href="/legal" className="link-under">Terms of Use</Link>.
        </p>
      </div>
    </div>
  );
}
