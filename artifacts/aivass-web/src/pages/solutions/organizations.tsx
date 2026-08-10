import { Link } from "wouter";
import { useSeoMeta } from "@/lib/seo";
import { trackDiscussPartnership } from "@/lib/analytics";

export default function Organizations() {
  useSeoMeta({
    title: "For Organizations — Capability Infrastructure for AI Transformation",
    description: "AiVass builds AI capability programs, workforce enablement, intelligent operating systems, and enterprise transformation architecture for organizations.",
    canonical: "https://aivass.com/solutions/organizations",
  });
  return (
    <div className="min-h-screen">
      {/* SECTION A: HERO (Paper) */}
      <section className="bg-paper text-navy pt-12 pb-[100px] border-b border-navy/10">
        <div className="wrap">
          <nav className="text-[10px] tracking-[0.15em] uppercase text-grey mb-[60px]">
            <Link href="/solutions" className="hover:text-oxblood transition-colors">Solutions</Link>
            <span className="mx-2 opacity-40">›</span>
            <span>Organizations</span>
          </nav>
          
          <div className="eyebrow mb-6">For Organizations</div>
          <h1 className="text-[50px] md:text-[80px] font-serif leading-none tracking-[-0.05em] mb-8">
            Capability is the Infrastructure<br />
            <span className="text-oxblood italic">Behind Transformation.</span>
          </h1>
          <p className="text-[16px] text-navy-mid max-w-[600px] leading-[1.65]">
            Enterprise-ready warmth. We build the architecture and capability programs required to deploy AI intelligently across teams.
          </p>
        </div>
      </section>

      {/* EDITORIAL IMAGE */}
      <div className="relative w-full h-[45vh] md:h-[58vh] overflow-hidden">
        <img
          src={`${import.meta.env.BASE_URL}images/editorial-organizations.jpg`}
          alt="Accomplished professionals in a moment of collective purpose and excellence"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-navy/15 pointer-events-none" />
      </div>

      {/* CONTENT AREAS */}
      <section className="bg-cream py-[100px]">
        <div className="wrap grid grid-cols-1 md:grid-cols-2 gap-[60px] md:gap-[10vw]">
          <div className="flex flex-col justify-center order-2 md:order-1">
            <h2 className="font-serif text-[32px] md:text-[40px] leading-[1.1] mb-6">
              Transform capability, operations and how people work with AI.
            </h2>
            <p className="text-[14px] text-navy-mid leading-[1.65] mb-10 max-w-[450px]">
              Technology alone is not transformation. We provide the educational architecture, operating systems and strategic alignment necessary for teams to adopt new capabilities at scale.
            </p>
            <a href="mailto:connect@aivass.com" className="btn-fill w-max" onClick={() => trackDiscussPartnership("organizations-page")}>
              Discuss a Partnership
            </a>
            {/* // TODO: Connect to booking/contact flow */}
          </div>

          <div className="grid grid-cols-1 gap-[2px] bg-navy/10 border-t border-b border-navy/10 order-1 md:order-2">
            {[
              "AI capability programs",
              "Workforce enablement and education",
              "Intelligent operating systems",
              "Program architecture",
              "Enterprise transformation",
              "Future methodology licensing and institutional partnerships"
            ].map((item, i) => (
              <div key={i} className="bg-paper p-6 flex items-center gap-4">
                <span className="text-[10px] tracking-[0.2em] text-oxblood">0{i + 1}</span>
                <span className="font-serif text-[18px] text-navy">{item}</span>
              </div>
            ))}
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
