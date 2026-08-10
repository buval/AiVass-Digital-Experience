import { Link } from "wouter";
import { Triad } from "@/components/brand/Triad";
import { STRATEGIC_ASSESSMENT_URL } from "@/config/booking";
import { useSeoMeta } from "@/lib/seo";
import { trackAssessmentClick } from "@/lib/analytics";

export default function Individuals() {
  useSeoMeta({
    title: "For Individuals — Build Your Extraordinary Ability Profile",
    description: "AiVass works with individuals building EB-1A extraordinary ability profiles. Explore, assess, and receive your recommended pathway with strategic evidence architecture.",
    canonical: "https://aivass.com/solutions/individuals",
  });
  return (
    <div className="min-h-screen bg-cream">
      {/* BREADCRUMB */}
      <div className="wrap pt-12">
        <nav className="text-[10px] tracking-[0.15em] uppercase text-grey">
          <Link href="/solutions" className="hover:text-oxblood transition-colors">Solutions</Link>
          <span className="mx-2 opacity-40">›</span>
          <span>Individuals</span>
        </nav>
      </div>

      {/* SECTION A: HERO */}
      <section className="pt-[60px] pb-[80px]">
        <div className="wrap">
          <div className="eyebrow mb-6">For Individuals</div>
          <h1 className="text-[50px] md:text-[80px] font-serif leading-none tracking-[-0.05em] mb-4">
            Build the Profile.<br />
            <span className="text-oxblood italic">Understand the Evidence.</span>
          </h1>
          <p className="font-serif italic text-[24px] md:text-[32px] text-navy-mid mb-8">
            Choose the right pathway.
          </p>
          <p className="text-[16px] text-navy-mid max-w-[600px] leading-[1.65]">
            AiVass works with individuals building extraordinary-ability profiles — articulating, evidencing and positioning what they have built so they can be seen, recognised and move forward.
          </p>
        </div>
      </section>

      {/* SECTION B: THREE-STEP JOURNEY */}
      <section className="bg-paper py-[80px] border-t border-navy/10">
        <div className="wrap">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-[40px]">
            <div>
              <b className="font-serif font-normal text-[24px] block mb-3 text-oxblood">01 · EXPLORE</b>
              <p className="text-[14px] text-navy-mid leading-[1.6] mb-6 min-h-[60px]">
                Begin with paid, self-directed Guides. Practical frameworks and evidence blueprints for each field.
              </p>
              <Link href="/guides" className="btn-outline">Explore Guides</Link>
            </div>
            <div className="md:border-l border-navy/15 md:pl-[40px]">
              <b className="font-serif font-normal text-[24px] block mb-3 text-oxblood">02 · ASSESS</b>
              <p className="text-[14px] text-navy-mid leading-[1.6] mb-6 min-h-[60px]">
                A private, paid Strategic Profile Assessment. AiVass evaluates your current profile, evidence quality, readiness and gaps.
              </p>
              <a href={STRATEGIC_ASSESSMENT_URL} target="_blank" rel="noopener noreferrer" className="btn-fill" onClick={() => trackAssessmentClick("individuals-assess-step")}>Book Assessment</a>
            </div>
            <div className="md:border-l border-navy/15 md:pl-[40px]">
              <b className="font-serif font-normal text-[24px] block mb-3 text-oxblood">03 · RECEIVE YOUR PATHWAY</b>
              <p className="text-[14px] text-navy-mid leading-[1.6]">
                AiVass recommends the appropriate next path. You do not self-select.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION C: THREE PROGRAMMES */}
      <section className="py-[100px]">
        <div className="wrap">
          <div className="eyebrow mb-12 text-center">Pathways</div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[1px] bg-navy/10 border border-navy/10">
            {/* RISE */}
            <div className="bg-cream p-8 md:p-10 flex flex-col h-full">
              <Triad className="w-[30px] text-oxblood mb-6" />
              <h3 className="font-serif text-[28px] mb-4">AiVass Rise</h3>
              <p className="text-[14px] text-navy-mid leading-[1.6] flex-grow mb-8">
                Accelerated, intensive pathway for already-strong profiles ready to move quickly.
              </p>
              <a href={STRATEGIC_ASSESSMENT_URL} target="_blank" rel="noopener noreferrer" className="link-under w-max" onClick={() => trackAssessmentClick("individuals-rise")}>Start with an Assessment</a>
            </div>
            
            {/* SHINE */}
            <div className="bg-cream p-8 md:p-10 flex flex-col h-full">
              <Triad className="w-[30px] text-oxblood mb-6" />
              <h3 className="font-serif text-[28px] mb-4">AiVass Shine</h3>
              <p className="text-[14px] text-navy-mid leading-[1.6] flex-grow mb-8">
                Structured premium pathway for extraordinary-ability candidates needing deeper evidence architecture, sequencing, coaching and accountability.
              </p>
              <a href={STRATEGIC_ASSESSMENT_URL} target="_blank" rel="noopener noreferrer" className="link-under w-max" onClick={() => trackAssessmentClick("individuals-shine")}>Start with an Assessment</a>
            </div>

            {/* SIGNATURE */}
            <div className="bg-cream p-8 md:p-10 flex flex-col h-full">
              <Triad className="w-[30px] text-oxblood mb-6" />
              <h3 className="font-serif text-[28px] mb-4">AiVass Signature</h3>
              <p className="text-[14px] text-navy-mid leading-[1.6] flex-grow mb-8">
                Bespoke, long-horizon engagement for complex, highly individualised profiles requiring custom transformation architecture.
              </p>
              <a href={STRATEGIC_ASSESSMENT_URL} target="_blank" rel="noopener noreferrer" className="link-under w-max" onClick={() => trackAssessmentClick("individuals-signature")}>Start with an Assessment</a>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION D: INTERNAL LINKS */}
      <section className="bg-paper py-[60px] border-t border-navy/10 text-center">
        <div className="wrap">
          <div className="flex flex-col md:flex-row justify-center gap-8 md:gap-12 text-[12px] tracking-[0.1em] uppercase">
            <Link href="/guides" className="link-under">Start with our Guides →</Link>
            <Link href="/articles" className="link-under">Read our Articles →</Link>
          </div>
          <p className="text-[11px] text-grey mt-12 max-w-[400px] mx-auto leading-[1.5]">
            AiVass provides strategic, educational and coaching support. Not legal advice or representation.
          </p>
        </div>
      </section>
    </div>
  );
}
