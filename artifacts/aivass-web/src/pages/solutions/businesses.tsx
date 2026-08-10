import { Link } from "wouter";
import { useSeoMeta } from "@/lib/seo";
import { trackDiscussPartnership } from "@/lib/analytics";

export default function Businesses() {
  useSeoMeta({
    title: "For Businesses — From Activity to Architecture",
    description: "AiVass helps businesses turn ambition into intelligent systems, coherent workflows and technology-enabled transformation. AI capability, GTM, and operating architecture.",
    canonical: "https://aivass.com/solutions/businesses",
  });
  return (
    <div className="min-h-screen">
      {/* SECTION A: HERO (Navy) */}
      <section className="bg-navy text-cream pt-12 pb-[100px]">
        <div className="wrap">
          <nav className="text-[10px] tracking-[0.15em] uppercase text-ox-light mb-[60px]">
            <Link href="/solutions" className="hover:text-cream transition-colors">Solutions</Link>
            <span className="mx-2 opacity-40">›</span>
            <span>Businesses</span>
          </nav>
          
          <div className="eyebrow text-ox-light mb-6">For Businesses</div>
          <h1 className="text-[50px] md:text-[80px] font-serif leading-none tracking-[-0.05em] mb-8">
            From Activity to<br />
            <span className="text-ox-light italic">Architecture.</span>
          </h1>
          <p className="text-[16px] text-ox-light max-w-[600px] leading-[1.65]">
            AiVass helps businesses turn ambition into intelligent systems, coherent workflows and technology-enabled transformation.
          </p>
        </div>
      </section>

      {/* CONTENT AREAS */}
      <section className="bg-cream py-[100px]">
        <div className="wrap grid grid-cols-1 md:grid-cols-2 gap-[60px] md:gap-[10vw]">
          <div className="grid grid-cols-1 gap-[2px] bg-navy/10 border-t border-b border-navy/10">
            {[
              "Intelligent business systems",
              "AI-powered automation",
              "GTM and positioning strategy",
              "Operating architecture",
              "Technology-enabled transformation",
              "Future professional-practice collaboration"
            ].map((item, i) => (
              <div key={i} className="bg-paper p-6 flex items-center gap-4">
                <span className="text-[10px] tracking-[0.2em] text-oxblood">0{i + 1}</span>
                <span className="font-serif text-[18px] text-navy">{item}</span>
              </div>
            ))}
          </div>
          
          <div className="flex flex-col justify-center">
            <h2 className="font-serif text-[32px] md:text-[40px] leading-[1.1] mb-6">
              Design workflows that multiply output without sacrificing quality.
            </h2>
            <p className="text-[14px] text-navy-mid leading-[1.65] mb-10 max-w-[450px]">
              We work with visionary operators to transition out of manual scaling and into strategic architecture.
            </p>
            <a href="mailto:contact@aivass.com" className="btn-fill w-max" onClick={() => trackDiscussPartnership("businesses-page")}>
              Discuss a Partnership
            </a>
            {/* // TODO: Connect to booking/contact flow */}
          </div>
        </div>
      </section>

      {/* DISCLAIMER */}
      <section className="bg-paper py-10 border-t border-navy/10 text-center">
        <div className="wrap">
          <p className="text-[11px] text-grey max-w-[400px] mx-auto leading-[1.5]">
            AiVass provides strategic, educational and coaching support. Not legal advice or representation.
          </p>
        </div>
      </section>
    </div>
  );
}
