import { Link } from "wouter";
import { useSeoMeta } from "@/lib/seo";
import { SolarSystem } from "@/components/brand/SolarSystem";

const PRINCIPLES = [
  {
    num: "01",
    title: "Architecture over intervention.",
    body: "Transformation built as capability outlasts any programme. We design permanent systems, not temporary fixes.",
  },
  {
    num: "02",
    title: "Evidence over assertion.",
    body: "Extraordinary outcomes require extraordinary documentation. We work backward from proof, not forward from aspiration.",
  },
  {
    num: "03",
    title: "Human clarity over machine complexity.",
    body: "The most powerful AI systems are the ones that make humans more themselves, not less. Automation should amplify soul, not erase it.",
  },
  {
    num: "04",
    title: "Coherence over volume.",
    body: "One integrated strategy, executed with precision, outperforms ten disconnected initiatives at scale.",
  },
];

export default function About() {
  useSeoMeta({
    title: "About AiVass — Transformation Studio",
    description:
      "AiVass is a boutique transformation studio at the intersection of intelligent systems, strategy and human potential. Automation with Soul.",
    canonical: "https://aivass.com/about",
  });

  return (
    <div className="min-h-screen bg-cream">
      <h1 className="sr-only">About AiVass — Transformation Studio</h1>

      {/* ── HERO ── */}
      <div className="relative w-full h-[70vh] md:h-[85vh] overflow-hidden">
        <img
          src={`${import.meta.env.BASE_URL}images/about-hero.jpg`}
          alt="Sunlit architectural terrace opening to an infinite horizon — the visual language of AiVass"
          className="w-full h-full object-cover object-center"
        />
        {/* Bottom-to-top gradient — lets the title sit on dark */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/20 to-transparent" />
        {/* Subtle top vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-navy/15 via-transparent to-transparent" />

        {/* Hero copy — bottom left */}
        <div className="absolute bottom-0 left-0 right-0 pb-12 md:pb-16">
          <div className="wrap">
            <div className="eyebrow text-ox-light mb-5">Transformation Studio</div>
            <h2 className="font-serif text-[42px] md:text-[70px] text-cream leading-none tracking-[-0.05em] max-w-[700px]">
              Build the capability<br />
              to meet the future<br />
              <em className="text-ox-light italic">with clarity.</em>
            </h2>
          </div>
        </div>
      </div>

      {/* ── OPENING STATEMENT ── */}
      <div className="bg-cream py-[80px] md:py-[110px]">
        <div className="wrap">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-[60px] md:gap-[100px] items-start">
            <div className="md:pt-2">
              <div className="eyebrow mb-4">What We Are</div>
              <div className="w-[32px] h-[1px] bg-oxblood mt-4" />
            </div>
            <div>
              <p className="font-serif text-[26px] md:text-[36px] leading-[1.35] text-navy tracking-[-0.03em] mb-8">
                AiVass is a boutique technology-enabled transformation studio working at the intersection of intelligent systems, strategy, and human potential.
              </p>
              <p className="text-[15px] md:text-[17px] text-navy-mid leading-[1.85] max-w-[600px]">
                We work with individuals and organizations navigating complex transformations — whether building an extraordinary ability profile, deploying AI infrastructure for an enterprise, or rearchitecting how a team thinks about its future. The work is always the same at its core: design a system that produces evidence of capability, and sustain it long enough to become permanent.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── FOUNDER STORY ── */}
      <div className="bg-paper py-[80px] md:py-[120px] border-t border-navy/8">
        <div className="wrap">
          <div className="grid grid-cols-1 md:grid-cols-[5fr_7fr] gap-[60px] md:gap-[100px] items-start">

            {/* Portrait column */}
            <div className="relative">
              <div className="relative overflow-hidden" style={{ aspectRatio: "4/5" }}>
                <img
                  src={`${import.meta.env.BASE_URL}images/editorial-hero-human.jpg`}
                  alt="Maria Boukhval, Founder of AiVass"
                  className="w-full h-full object-cover object-[center_18%]"
                />
                {/* Subtle warm vignette to blend into paper */}
                <div className="absolute inset-0 pointer-events-none"
                  style={{ background: "linear-gradient(to bottom, transparent 65%, rgba(253,251,246,0.55) 100%)" }}
                />
              </div>
              {/* Name card below portrait */}
              <div className="mt-6">
                <p className="font-serif text-[18px] text-navy tracking-[-0.02em]">Maria Boukhval</p>
                <p className="text-[11px] tracking-[0.18em] uppercase text-oxblood mt-1">Founder, AiVass</p>
                <p className="font-serif italic text-navy/45 text-[13px] mt-3 leading-[1.5]">
                  Energetic light that sparks<br />and guides the way.
                </p>
              </div>
            </div>

            {/* Story column */}
            <div className="md:pt-4">
              <div className="eyebrow mb-5">Founder</div>
              <h2 className="font-serif text-[32px] md:text-[46px] leading-[1.1] tracking-[-0.04em] text-navy mb-8">
                Built from transformation,<br />
                <em className="italic text-oxblood">not theory.</em>
              </h2>

              <div className="space-y-5 text-[15px] md:text-[16px] text-navy-mid leading-[1.85] max-w-[560px]">
                <p>
                  AiVass grew from my own experience of transformation.
                </p>
                <p>
                  For more than 17 years, I worked across marketing, strategy, program management and technology, helping global organizations turn complex ambitions into systems that could actually work. At Adobe, Intuit and across different industries, I learned how to bring structure to ambiguity, connect people around a shared direction, and move ideas from possibility into execution.
                </p>
                <p>
                  But the most important transformation was personal.
                </p>
                <p>
                  I rebuilt my career across countries, navigated my own extraordinary-ability journey, moved through uncertainty, reinvention and identity shifts, and learned that meaningful change rarely begins with doing more. It begins with seeing differently — understanding who you are becoming, what matters, what proves your value, and what architecture can carry that future forward.
                </p>
                <p>
                  Through all of it, one belief never left me: that no one is ordinary. Extraordinary capacity exists in every person — and human potential has no ceiling worth accepting. We should never give up on people.
                </p>
                <p>
                  That realization became AiVass.
                </p>
                <p>
                  Today, I am building the kind of company I wanted to find myself: one where <strong className="text-navy font-medium">intelligence and humanity belong together</strong>, where technology expands human potential rather than replacing it, and where transformation creates capability that remains after the intervention ends.
                </p>
                <p className="font-serif text-[17px] text-navy italic">
                  Building Extraordinary Futures is therefore more than a tagline.
                  <br />It is the work.
                </p>
              </div>

              {/* Signature */}
              <div className="mt-10 pt-8 border-t border-navy/12">
                <p className="font-serif italic text-navy/60 text-[15px]">— Maria Boukhval, Founder of AiVass</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── AUTOMATION WITH SOUL ── */}
      <div className="bg-navy text-cream py-[80px] md:py-[110px]">
        <div className="wrap">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[60px] md:gap-[80px] items-center">
            {/* Text side */}
            <div>
              <div className="eyebrow text-ox-light mb-6">Our Operating Philosophy</div>
              <h2 className="font-serif text-[48px] md:text-[72px] leading-none tracking-[-0.05em] mb-8">
                Automation<br />
                <em className="italic text-ox-light">with Soul.</em>
              </h2>
              <p className="text-[15px] md:text-[17px] text-cream/80 leading-[1.85] max-w-[460px] mb-8">
                We believe the future should become more intelligent without becoming less human. AI without human architecture produces noise. Human aspiration without intelligent systems produces exhaustion. The intersection is where extraordinary becomes possible.
              </p>
              <p className="text-[15px] text-cream/60 leading-[1.7] max-w-[440px]">
                This is not a slogan. It is the design constraint behind every engagement — a commitment to building systems that amplify the human qualities that make people remarkable, rather than replacing them.
              </p>
            </div>

            {/* Visual side — animated solar system */}
            <div className="flex items-center justify-center">
              <SolarSystem />
            </div>
          </div>
        </div>
      </div>

      {/* ── PURPOSE · PROOF · PERMANENCE ── */}
      <div className="bg-paper py-[80px] md:py-[110px]">
        <div className="wrap">
          <div className="text-center mb-[60px] md:mb-[80px]">
            <div className="eyebrow mb-5">The Strategic Framework</div>
            <h2 className="font-serif text-[38px] md:text-[58px] leading-none tracking-[-0.05em] text-navy">
              Purpose · Proof · Permanence
            </h2>
            <p className="text-[14px] md:text-[16px] text-grey mt-5 max-w-[440px] mx-auto leading-[1.65]">
              The architecture behind every AiVass engagement — for individuals and organizations alike.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-[1px] bg-navy/10">
            {[
              {
                pillar: "Purpose",
                headline: "Why you are building this.",
                body: "Most transformation programmes collapse not for lack of effort, but lack of a clear purpose architecture. We begin every engagement by anchoring the work to a singular, durable reason — one that survives the inevitable friction of change.",
                icon: "◇",
              },
              {
                pillar: "Proof",
                headline: "The evidence that makes it real.",
                body: "Ambition without evidence is invisible. We design systematic evidence generation — the documentation, positioning, and credentialing infrastructure that makes extraordinary capability legible to the audiences that matter.",
                icon: "◈",
              },
              {
                pillar: "Permanence",
                headline: "The capability that outlasts the work.",
                body: "An engagement that ends when we leave has not succeeded. Permanence means the systems, habits, and structures we build continue producing results — and compound — long after the active engagement concludes.",
                icon: "◆",
              },
            ].map(({ pillar, headline, body, icon }) => (
              <div key={pillar} className="bg-cream p-10 md:p-12 flex flex-col">
                <div className="text-[22px] text-navy/20 mb-5">{icon}</div>
                <div className="eyebrow mb-4">{pillar}</div>
                <h3 className="font-serif text-[22px] md:text-[26px] text-navy leading-[1.2] mb-5">{headline}</h3>
                <p className="text-[13px] md:text-[14px] text-navy-mid leading-[1.75]">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── TRANSFORMATION PRINCIPLES ── */}
      <div className="bg-cream py-[80px] md:py-[110px]">
        <div className="wrap">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-[60px] md:gap-[100px]">
            <div>
              <div className="eyebrow mb-4">How We Work</div>
              <h2 className="font-serif text-[32px] md:text-[44px] leading-[1.1] tracking-[-0.04em] text-navy">
                Architecture<br />principles.
              </h2>
            </div>

            <div className="border-t border-navy/10">
              {PRINCIPLES.map(({ num, title, body }) => (
                <div key={num} className="flex gap-6 md:gap-10 border-b border-navy/10 py-8">
                  <span className="text-[11px] tracking-[0.15em] uppercase text-oxblood shrink-0 mt-1">{num}</span>
                  <div>
                    <p className="font-serif text-[18px] md:text-[22px] text-navy mb-3">{title}</p>
                    <p className="text-[13px] md:text-[14px] text-navy-mid leading-[1.7]">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── EDITORIAL VISUAL BREAK — full-width image strip ── */}
      <div className="relative w-full h-[38vh] md:h-[48vh] overflow-hidden">
        <img
          src={`${import.meta.env.BASE_URL}images/article-hero-surviving-to-thriving.jpg`}
          alt="Light entering a doorway — the visual language of transformation and becoming"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-navy/40" />
        <div className="absolute inset-0 flex items-center justify-center text-center px-4">
          <blockquote className="font-serif italic text-[24px] md:text-[44px] text-cream leading-[1.3] max-w-[700px]">
            "The future belongs to those who build the capability to meet it."
          </blockquote>
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="bg-navy text-cream py-[80px] md:py-[110px]">
        <div className="wrap text-center max-w-[640px] mx-auto">
          <div className="eyebrow text-ox-light mb-6">Where to Begin</div>
          <h2 className="font-serif text-[38px] md:text-[56px] leading-none tracking-[-0.05em] mb-6">
            Ready to build<br />
            <em className="italic text-ox-light">something extraordinary?</em>
          </h2>
          <p className="text-[15px] text-cream/70 leading-[1.7] mb-10 max-w-[480px] mx-auto">
            Every engagement starts in the same place — a clear-eyed assessment of where you are, what you're building toward, and what it will take to get there.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/solutions" className="btn-fill !bg-cream !text-navy hover:!bg-paper">
              Explore Pathways
            </Link>
            <Link href="/guides" className="btn-outline !border-cream/40 !text-cream hover:!border-cream">
              Browse Guides
            </Link>
          </div>
        </div>
      </div>

      {/* Disclosure */}
      <div className="bg-paper py-8 border-t border-navy/10">
        <div className="wrap">
          <p className="text-[11px] text-grey leading-[1.6] max-w-[640px]">
            <strong>Disclosure:</strong> AiVass provides strategic, educational, organizational, coaching,
            and project-management support. We are an architecture and transformation studio, not a law
            firm. Our services do not constitute legal advice or representation.
          </p>
        </div>
      </div>
    </div>
  );
}
