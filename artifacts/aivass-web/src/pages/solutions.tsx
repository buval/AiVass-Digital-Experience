import { Link } from "wouter";
import { Triad } from "@/components/brand/Triad";

export default function Solutions() {
  return (
    <div className="bg-cream min-h-screen pt-[60px] pb-[100px]">
      <div className="wrap">
        <div className="eyebrow mb-6">Solutions</div>
        <h1 className="text-[50px] md:text-[80px] font-serif leading-none tracking-[-0.05em] mb-6">
          One house.<br />
          <em className="text-oxblood italic">Three paths.</em>
        </h1>
        <p className="text-[16px] text-navy-mid max-w-[600px] leading-[1.65] mb-16">
          A connected architecture for people, businesses and organizations moving toward what comes next.
        </p>

        <div className="space-y-[80px] md:space-y-[120px]">
          {/* Path 1: Individuals */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-10 md:gap-20 items-start border-t border-navy/20 pt-12">
            <div>
              <div className="flex items-center gap-4 mb-6 text-oxblood">
                <span className="font-serif text-2xl">01</span>
                <span className="w-12 h-[1px] bg-current opacity-50" />
              </div>
              <h2 className="text-[32px] md:text-[42px] font-serif leading-tight mb-4">
                For Individuals
              </h2>
              <Triad className="w-[120px] text-oxblood/80 mt-8 mb-8 md:mb-0" />
            </div>
            <div>
              <p className="text-[18px] md:text-[22px] font-serif italic text-navy mb-6">
                Build, articulate and demonstrate extraordinary ability.
              </p>
              <p className="text-[14px] text-grey leading-[1.7] mb-8 max-w-[500px]">
                Whether you need a self-directed guide, a structured program, or a fully bespoke transformation architecture, we provide the frameworks to elevate your profile.
              </p>
              <div className="flex gap-4">
                <Link href="/" className="btn">View Pathways</Link>
                <Link href="/guides" className="btn-outline">Explore Guides</Link>
              </div>
            </div>
          </div>

          {/* Path 2: Businesses */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-10 md:gap-20 items-start border-t border-navy/20 pt-12">
            <div>
              <div className="flex items-center gap-4 mb-6 text-oxblood">
                <span className="font-serif text-2xl">02</span>
                <span className="w-12 h-[1px] bg-current opacity-50" />
              </div>
              <h2 className="text-[32px] md:text-[42px] font-serif leading-tight mb-4">
                For Businesses
              </h2>
              <Triad className="w-[120px] text-oxblood/80 mt-8 mb-8 md:mb-0" />
            </div>
            <div>
              <p className="text-[18px] md:text-[22px] font-serif italic text-navy mb-6">
                Turn ambition into intelligent, scalable systems.
              </p>
              <p className="text-[14px] text-grey leading-[1.7] mb-8 max-w-[500px]">
                AiVass helps businesses move from scattered activity to coherent architecture. We design technology-enabled workflows that multiply output without sacrificing quality.
              </p>
              <a href="#partnership" className="btn">Discuss a Partnership</a>
            </div>
          </div>

          {/* Path 3: Organizations */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-10 md:gap-20 items-start border-t border-navy/20 pt-12">
            <div>
              <div className="flex items-center gap-4 mb-6 text-oxblood">
                <span className="font-serif text-2xl">03</span>
                <span className="w-12 h-[1px] bg-current opacity-50" />
              </div>
              <h2 className="text-[32px] md:text-[42px] font-serif leading-tight mb-4">
                For Organizations
              </h2>
              <Triad className="w-[120px] text-oxblood/80 mt-8 mb-8 md:mb-0" />
            </div>
            <div>
              <p className="text-[18px] md:text-[22px] font-serif italic text-navy mb-6">
                Transform capability, operations and how people work with AI.
              </p>
              <p className="text-[14px] text-grey leading-[1.7] mb-8 max-w-[500px]">
                Enterprise-ready support across AI capability, workforce enablement, education, intelligent operating systems, and program architecture. Building the infrastructure behind the transformation.
              </p>
              <a href="#partnership" className="btn">Discuss a Partnership</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
