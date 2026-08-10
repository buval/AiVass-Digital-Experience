import { Link } from "wouter";
import { CriteriaConstellation } from "@/components/CriteriaConstellation";
import { GUIDES, guideCheckoutUrl, guideSampleUrl, BUNDLE, formatPrice } from "@/data/guides";
import { useSeoMeta } from "@/lib/seo";
import { trackGuidePurchaseClick, trackGuideSampleClick } from "@/lib/analytics";

export default function Guides() {
  useSeoMeta({
    title: "EB-1A Guides for Extraordinary Ability",
    description:
      "Strategic guides for EB-1A extraordinary ability petitions. 6 field-specific guides plus a complete collection — written for self-petitioners, delivered instantly as PDF downloads.",
    canonical: "https://aivass.com/guides",
  });

  const individualGuides = GUIDES.filter((g) => !g.isBundle);

  return (
    <div className="bg-cream min-h-screen pt-[60px] pb-[100px]">
      <div className="wrap">
        {/* Header */}
        <div className="grid md:grid-cols-[1fr_auto] items-end mb-12 gap-8">
          <div>
            <div className="eyebrow mb-6">Storefront</div>
            <h1 className="text-[50px] md:text-[80px] font-serif leading-none tracking-[-0.05em] mb-6">
              Guides for<br />
              <em className="text-oxblood italic">Extraordinary Futures.</em>
            </h1>
            <p className="text-[16px] text-navy-mid max-w-[600px] leading-[1.65]">
              Every guide you need to document, position and defend extraordinary ability. Written for
              self-petitioners, delivered instantly as PDF downloads.
            </p>
          </div>
        </div>

        <div className="text-[11px] tracking-[0.1em] text-navy mb-[60px] flex items-center gap-4 uppercase font-medium">
          <span>Instant download</span>
          <span className="w-1 h-1 bg-oxblood rounded-full" />
          <span>Secure checkout</span>
          <span className="w-1 h-1 bg-oxblood rounded-full" />
          <span>275+ pages total</span>
        </div>

      </div>

      {/* Interactive EB-1A criteria constellation — the framework behind every guide */}
      <CriteriaConstellation />

      <div className="wrap pt-[90px]">
        <div className="eyebrow mb-[18px]">EXTRAORDINARY ABILITY · Available now · 6 guides</div>

        {/* Guide grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-[60px] mb-[100px]">
          {individualGuides.map((guide, i) => {
            // Slight focal-point variation per card for editorial feel
            const positions = [
              "object-center",
              "object-top",
              "object-center",
              "object-bottom",
              "object-top",
              "object-center",
            ];
            const pos = positions[i] ?? "object-center";

            return (
              <article key={guide.id} className="border-t border-navy pt-[18px]">
                {/* Hero image — full bleed editorial */}
                <Link href={`/guides/${guide.slug}`}>
                  <div className="aspect-[4/3] overflow-hidden mb-5 group cursor-pointer">
                    <img
                      src={`${import.meta.env.BASE_URL}images/${guide.heroImage}`}
                      alt={guide.heroAlt}
                      className={`w-full h-full object-cover ${pos} group-hover:scale-[1.03] transition-transform duration-700`}
                    />
                  </div>
                </Link>

                <div className="mb-6">
                  <Link href={`/guides/${guide.slug}`} className="group">
                    <h2 className="font-serif text-[24px] text-navy leading-tight mb-1 group-hover:text-oxblood transition-colors">
                      {guide.name}
                    </h2>
                  </Link>
                  <p className="font-serif italic text-[14px] text-oxblood mb-3">{guide.subtitle}</p>
                  <div className="text-[11px] tracking-[0.1em] uppercase text-grey mb-3">
                    {guide.pageCount} pages
                  </div>
                  <p className="text-[13px] text-navy-mid leading-[1.6] line-clamp-2">
                    {guide.description}
                  </p>
                </div>

                <div className="flex gap-3">
                  {guide.sampleSlug && (
                    <a
                      href={guideSampleUrl(guide.sampleSlug)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-outline flex-1 !px-2 text-center"
                      onClick={() => trackGuideSampleClick(guide.slug)}
                    >
                      Free Sample
                    </a>
                  )}
                  <a
                    href={guideCheckoutUrl(guide.slug)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-fill flex-1 !px-2 text-center"
                    onClick={() => trackGuidePurchaseClick(guide.slug)}
                  >
                    Purchase →
                  </a>
                </div>

                <div className="mt-3 text-center">
                  <Link href={`/guides/${guide.slug}`} className="text-[10px] tracking-[0.12em] uppercase text-grey hover:text-oxblood transition-colors">
                    View full details →
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        {/* BUNDLE CARD */}
        <div className="bg-navy text-cream p-[40px] md:p-[60px] flex flex-col md:flex-row items-center gap-10 md:gap-16">
          <div className="flex-1">
            <div className="eyebrow text-ox-light mb-4">The Bundle</div>
            <h2 className="font-serif text-[36px] md:text-[48px] leading-tight mb-4">{BUNDLE.name}</h2>
            <p className="text-[16px] text-ox-light mb-6">All 6 guides · 275 pages</p>
            <p className="text-[14px] text-cream/70 leading-[1.6] max-w-[500px]">{BUNDLE.description}</p>
          </div>
          <div className="w-full md:w-auto bg-white/5 p-8 border border-white/10 flex flex-col items-center text-center shrink-0">
            <span className="text-[48px] font-serif leading-none mb-2">{formatPrice(BUNDLE.priceCents)}</span>
            <span className="text-[11px] tracking-[0.1em] text-ox-light uppercase mb-8">
              Save vs. buying individually
            </span>
            <a
              href={guideCheckoutUrl(BUNDLE.slug)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-fill !bg-cream !text-navy hover:!bg-paper w-full"
              onClick={() => trackGuidePurchaseClick(BUNDLE.slug)}
            >
              Get the Complete Collection →
            </a>
          </div>
        </div>

        <div className="mt-20 border-t border-navy/20 pt-16 text-center">
          <p className="font-serif italic text-[28px] flex flex-col items-center gap-3">
            <span className="text-navy">CAREER &amp; EVIDENCE — COMING NEXT</span>
          </p>
        </div>
      </div>
    </div>
  );
}
