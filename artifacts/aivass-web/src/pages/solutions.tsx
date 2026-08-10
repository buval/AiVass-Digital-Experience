import { Link } from "wouter";
import { Triad } from "@/components/brand/Triad";
import { useSeoMeta } from "@/lib/seo";

export default function Solutions() {
  useSeoMeta({
    title: "Solutions — Individuals, Businesses & Organizations",
    description: "One house, three transformation paths. AiVass works with individuals building extraordinary ability profiles, businesses scaling intelligently, and organizations deploying AI capability.",
    canonical: "https://aivass.com/solutions",
  });
  return (
    <div className="min-h-screen">
      {/* HEADER */}
      <section className="bg-cream pt-[100px] pb-[80px]">
        <div className="wrap text-center">
          <div className="eyebrow mb-6">Solutions</div>
          <h1 className="text-[50px] md:text-[80px] font-serif leading-none tracking-[-0.05em] mb-8">
            One house. <span className="text-oxblood italic">Three paths.</span>
          </h1>
          <p className="text-[16px] text-navy-mid max-w-[600px] mx-auto leading-[1.65]">
            A connected architecture for people, businesses and organizations moving toward what comes next.
          </p>
          <div className="flex justify-center mt-12">
            <Triad className="w-[80px] text-oxblood/80" />
          </div>
        </div>
      </section>

      {/* INDIVIDUALS */}
      <section className="bg-cream border-t border-navy/10 py-[100px]">
        <div className="wrap grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-[8vw] items-center">
          <div>
            <div className="eyebrow mb-4">01 · For Individuals</div>
            <h2 className="text-[40px] md:text-[50px] font-serif leading-[1.1] tracking-[-0.04em] mb-6">
              Build the profile.<br />
              <span className="text-oxblood italic">Understand the evidence.</span><br />
              Choose the right pathway.
            </h2>
          </div>
          <div>
            <p className="text-[16px] text-navy-mid leading-[1.65] mb-8 max-w-[450px]">
              Intelligent evidence architecture for extraordinary ability petitions. We provide the frameworks to articulate, evidence and position what you have built so you can be seen, recognised and move forward.
            </p>
            <Link href="/solutions/individuals" className="btn-fill">Explore Individuals →</Link>
          </div>
        </div>
      </section>

      {/* BUSINESSES */}
      <section className="bg-navy text-cream py-[100px]">
        <div className="wrap grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-[8vw] items-center">
          <div>
            <div className="eyebrow text-ox-light mb-4">02 · For Businesses</div>
            <h2 className="text-[40px] md:text-[50px] font-serif leading-[1.1] tracking-[-0.04em] mb-6">
              From activity to <span className="text-ox-light italic">architecture.</span>
            </h2>
          </div>
          <div>
            <p className="text-[16px] text-ox-light leading-[1.65] mb-8 max-w-[450px]">
              AiVass helps businesses turn ambition into intelligent, scalable systems. Intelligent systems, automation, GTM, operating architecture, and technology-enabled transformation that multiply output without sacrificing quality.
            </p>
            <Link href="/solutions/businesses" className="btn-outline-light">Explore Businesses →</Link>
          </div>
        </div>
      </section>

      {/* ORGANIZATIONS */}
      <section className="bg-paper py-[100px]">
        <div className="wrap grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-[8vw] items-center">
          <div>
            <div className="eyebrow mb-4">03 · For Organizations</div>
            <h2 className="text-[40px] md:text-[50px] font-serif leading-[1.1] tracking-[-0.04em] mb-6">
              Capability is the infrastructure <span className="text-oxblood italic">behind transformation.</span>
            </h2>
          </div>
          <div>
            <p className="text-[16px] text-navy-mid leading-[1.65] mb-8 max-w-[450px]">
              Enterprise-ready warmth. AI capability, workforce enablement, education, intelligent operating systems, program architecture, and enterprise transformation.
            </p>
            <Link href="/solutions/organizations" className="btn-outline">Explore Organizations →</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
