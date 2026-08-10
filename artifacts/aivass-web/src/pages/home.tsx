import { useEffect } from "react";
import { Link } from "wouter";
import { Triad } from "@/components/brand/Triad";
import { MagicConstellation } from "@/components/brand/MagicConstellation";
import { TransformationEvolution } from "@/components/brand/TransformationEvolution";
import { GUIDES } from "@/data/guides";
import { ARTICLES } from "@/data/articles";
import { STRATEGIC_ASSESSMENT_URL } from "@/config/booking";
import { useSeoMeta } from "@/lib/seo";
import { trackAssessmentClick, trackGuidePurchaseClick } from "@/lib/analytics";

function useScrollReveal() {
  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -32px 0px" }
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);
}

export default function Home() {
  useSeoMeta({
    title: "AiVass — Building Extraordinary Futures",
    description: "A boutique transformation studio where intelligent systems, human connection and strategic architecture come together. Automation with Soul.",
    canonical: "https://aivass.com/",
  });
  useScrollReveal();

  return (
    <div className="bg-cream">

      {/* ═══════════════════════════════════════════════════════
          HERO — panoramic, one unified scene
      ═══════════════════════════════════════════════════════ */}
      <section className="relative min-h-[100svh] flex flex-col justify-center overflow-hidden bg-paper">

        {/* Portrait — right side, full bleed, gradient-faded into background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-y-0 right-0 w-[62%] md:w-[58%]">
            <img
              src={`${import.meta.env.BASE_URL}images/hero-arch-a.jpg`}
              alt=""
              className="w-full h-full object-cover"
              style={{ objectPosition: "center 15%" }}
              loading="eager"
            />
            {/* Seamless left fade — arch stone wall is already cream, so this is very gentle */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to right, #FDFBF6 0%, rgba(253,251,246,0.88) 8%, rgba(253,251,246,0.4) 24%, rgba(253,251,246,0.08) 45%, transparent 62%)",
              }}
            />
            {/* Top edge */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(253,251,246,0.65) 0%, transparent 18%)",
              }}
            />
            {/* Bottom edge */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(253,251,246,0.55) 0%, transparent 20%)",
              }}
            />
          </div>

          {/* Subtle warm bloom in the merge zone */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 48% 55%, rgba(200,160,100,0.04) 0%, transparent 55%)",
            }}
          />
        </div>

        {/* Content */}
        <div
          className="relative z-10 wrap w-full"
          style={{ paddingTop: "clamp(80px, 12vh, 120px)", paddingBottom: "clamp(60px, 8vh, 100px)" }}
        >
          {/* Eyebrow */}
          <div
            className="eyebrow mb-6 md:mb-8"
            data-reveal
            style={{ transitionDelay: "0ms" }}
          >
            Boutique transformation studio
          </div>

          {/* Headline */}
          <h1
            className="font-serif leading-[0.88] tracking-[-0.065em] mb-8 md:mb-10 max-w-[70vw] md:max-w-[55vw]"
            style={{ fontSize: "clamp(76px, 10.5vw, 144px)" }}
            data-reveal
            // @ts-ignore data attribute
            data-delay="80"
          >
            Building<br />
            <em className="text-oxblood italic">extraordinary</em><br />
            futures.
          </h1>

          {/* Description + CTA + tagline */}
          <div
            className="flex flex-col md:flex-row md:items-end gap-8 md:gap-[5vw]"
            data-reveal
            style={{ transitionDelay: "220ms" }}
          >
            <div>
              <p className="text-[15px] md:text-[16px] text-navy-mid max-w-[380px] leading-[1.68] mb-7">
                Where intelligent systems, human connection and strategic
                architecture come together to build what comes next.
              </p>
              <div className="flex flex-wrap gap-5 items-center">
                <Link href="/solutions" className="btn-fill">Explore AiVass</Link>
                <a href="#three-paths" className="link-under">Find Your Path ↗</a>
              </div>
            </div>

            {/* Tagline — desktop pull quote */}
            <div className="hidden md:block pb-[2px]">
              <p
                className="font-serif italic leading-[1.05] text-navy/25"
                style={{ fontSize: "clamp(22px, 2.4vw, 34px)" }}
              >
                Automation{" "}
                <span className="not-italic font-normal text-navy/18">with</span>{" "}
                <span className="text-oxblood/40">Soul.</span>
              </p>
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <div
            className="w-px bg-navy/40"
            style={{
              height: "36px",
              animation: "ambient-float 2.4s ease-in-out infinite",
            }}
          />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          THREE TRANSFORMATION PATHS
      ═══════════════════════════════════════════════════════ */}
      <section
        id="three-paths"
        className="bg-navy text-cream pt-[55px] pb-[55px] md:py-[80px] scroll-mt-20 relative overflow-hidden"
      >
        <div
          className="absolute top-0 left-0 right-0 h-[1px] pointer-events-none"
          style={{
            background:
              "linear-gradient(to right, transparent, rgba(217,163,155,0.22) 40%, rgba(217,163,155,0.22) 60%, transparent)",
          }}
        />

        <div className="wrap">
          <div className="eyebrow text-ox-light mb-7" data-reveal>
            Three transformation paths
          </div>
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.1fr] gap-10 md:gap-[8vw] items-center">
            <div>
              <h2
                className="text-[38px] md:text-[clamp(38px,5vw,66px)] leading-[0.96] tracking-[-0.06em] mb-4"
                data-reveal
                style={{ transitionDelay: "80ms" }}
              >
                One house.<br />
                <span className="text-ox-light italic">Three paths.</span>
              </h2>
              <p
                className="text-ox-light text-[14px] md:text-[15px] leading-[1.65] max-w-[380px]"
                data-reveal
                style={{ transitionDelay: "160ms" }}
              >
                A connected architecture for people, businesses and organizations
                moving toward what comes next.
              </p>
            </div>

            <div
              className="flex flex-col items-center"
              data-reveal
              style={{ transitionDelay: "120ms" }}
            >
              <svg
                viewBox="0 0 480 360"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full max-w-[400px]"
              >
                <line x1="240" y1="60" x2="60" y2="290" stroke="#D9A39B" strokeWidth="0.8" opacity="0.5" />
                <line x1="240" y1="60" x2="420" y2="290" stroke="#D9A39B" strokeWidth="0.8" opacity="0.5" />
                <line x1="60" y1="290" x2="420" y2="290" stroke="#D9A39B" strokeWidth="0.8" opacity="0.5" />
                <path d="M240 46 L243.5 56.5 L254 60 L243.5 63.5 L240 74 L236.5 63.5 L226 60 L236.5 56.5Z" fill="#D9A39B" />
                <text x="240" y="42" textAnchor="middle" fontFamily="DM Sans, sans-serif" fontSize="9" letterSpacing="2" fill="#D9A39B" opacity="0.9" fontWeight="400">INDIVIDUALS</text>
                <path d="M60 276 L63.5 286.5 L74 290 L63.5 293.5 L60 304 L56.5 293.5 L46 290 L56.5 286.5Z" fill="#D9A39B" />
                <text x="60" y="320" textAnchor="middle" fontFamily="DM Sans, sans-serif" fontSize="9" letterSpacing="2" fill="#D9A39B" opacity="0.9" fontWeight="400">BUSINESSES</text>
                <path d="M420 276 L423.5 286.5 L434 290 L423.5 293.5 L420 304 L416.5 293.5 L406 290 L416.5 286.5Z" fill="#D9A39B" />
                <text x="420" y="320" textAnchor="middle" fontFamily="DM Sans, sans-serif" fontSize="9" letterSpacing="2" fill="#D9A39B" opacity="0.9" fontWeight="400">ORGANIZATIONS</text>
              </svg>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-[10px] w-full mt-6 md:mt-3">
                {[
                  ["INDIVIDUALS", "Build, articulate and demonstrate extraordinary ability.", "/solutions/individuals"],
                  ["BUSINESSES", "Turn ambition into intelligent, scalable systems.", "/solutions/businesses"],
                  ["ORGANIZATIONS", "Transform capability, operations and how people work with AI.", "/solutions/organizations"],
                ].map(([title, desc, path], i) => (
                  <Link
                    href={path}
                    key={title}
                    className={`group block border-t border-cream/20 pt-[10px] hover:bg-white/5 transition-colors ${
                      i > 0 ? "md:border-l md:border-t-0 md:pl-[14px] border-t pt-[10px] md:pt-0" : ""
                    }`}
                  >
                    <h3 className="font-serif text-[15px] md:text-[17px] mb-1 group-hover:text-ox-light transition-colors">{title}</h3>
                    <p className="text-ox-light text-[11px] leading-[1.5] opacity-75 group-hover:opacity-100 transition-opacity">{desc}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          PURPOSE · PROOF · PERMANENCE
      ═══════════════════════════════════════════════════════ */}
      <section className="bg-paper py-[70px] md:py-[100px] relative overflow-hidden">
        <div
          className="absolute top-0 left-0 right-0 h-[2px] pointer-events-none"
          style={{
            background:
              "linear-gradient(to right, transparent, rgba(217,163,155,0.3) 30%, rgba(217,163,155,0.3) 70%, transparent)",
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 20% 60%, rgba(217,163,155,0.05) 0%, transparent 55%)",
          }}
        />

        <div className="wrap">
          <div className="eyebrow mb-5" data-reveal>Strategic framework</div>
          <h2
            className="text-[38px] md:text-[clamp(38px,5vw,68px)] leading-[0.96] tracking-[-0.06em] mb-[52px] md:mb-[72px]"
            data-reveal
            style={{ transitionDelay: "80ms" }}
          >
            Purpose{" "}
            <span className="text-ox-light inline-flex items-baseline">
              <svg viewBox="0 0 10 10" className="w-[7px] h-[7px] inline-block relative top-[-2px]" fill="#D9A39B"><path d="M5 0 L6 4 L10 5 L6 6 L5 10 L4 6 L0 5 L4 4Z"/></svg>
            </span>{" "}
            Proof{" "}
            <span className="text-ox-light inline-flex items-baseline">
              <svg viewBox="0 0 10 10" className="w-[7px] h-[7px] inline-block relative top-[-2px]" fill="#D9A39B"><path d="M5 0 L6 4 L10 5 L6 6 L5 10 L4 6 L0 5 L4 4Z"/></svg>
            </span>
            <br />
            <span className="text-oxblood italic">Permanence</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
            {[
              { label: "PURPOSE", body: "Why are we transforming? What future are we building?" },
              { label: "PROOF", body: "How do we know the transformation is real? What evidence demonstrates progress and value?" },
              { label: "PERMANENCE", body: "Designing transformation so capability, knowledge and value remain after the intervention ends." },
            ].map(({ label, body }, i) => (
              <div
                key={label}
                className={`relative pt-[24px] pb-[40px] md:pb-0 md:pr-[44px] ${
                  i > 0 ? "md:pl-[44px] md:border-l border-navy/10 border-t md:border-t-0" : ""
                }`}
                data-reveal
                style={{ transitionDelay: `${i * 120}ms` }}
              >
                <svg viewBox="0 0 28 28" className="w-[22px] h-[22px] mb-4 text-oxblood" fill="currentColor">
                  <path d="M14 1 L16.8 11.2 L27 14 L16.8 16.8 L14 27 L11.2 16.8 L1 14 L11.2 11.2Z" />
                </svg>
                <b className="font-serif font-normal text-[24px] md:text-[30px] block mb-3 tracking-[-0.04em]">{label}</b>
                <p className="text-[13px] md:text-[13.5px] text-grey leading-[1.7]">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          FOR INDIVIDUALS
      ═══════════════════════════════════════════════════════ */}
      <section className="py-[55px] md:py-[80px] relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 80% 20%, rgba(217,163,155,0.05) 0%, transparent 50%)",
          }}
        />
        <div className="wrap relative z-10">
          <div className="eyebrow mb-4" data-reveal>For individuals</div>
          <h2
            className="text-[36px] md:text-[clamp(36px,5vw,64px)] leading-[0.96] tracking-[-0.06em] mb-[32px] md:mb-[44px]"
            data-reveal
            style={{ transitionDelay: "80ms" }}
          >
            Explore. Assess.<br />
            <span className="text-oxblood italic">Receive your pathway.</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
            {[
              {
                step: "01", label: "EXPLORE",
                body: "Begin with paid self-directed Guides. Available now · 6 guides in Extraordinary Ability.",
                cta: <Link href="/guides" className="link-under text-oxblood inline-block text-[11px] tracking-[0.06em]">Explore Guides</Link>,
              },
              {
                step: "02", label: "ASSESS",
                body: "A private assessment of your current profile, evidence, readiness, gaps and potential pathway.",
                cta: <a href={STRATEGIC_ASSESSMENT_URL} target="_blank" rel="noopener noreferrer" className="link-under text-oxblood inline-block text-[11px] tracking-[0.06em]" onClick={() => trackAssessmentClick("home-assess-step")}>Assess Your Profile</a>,
              },
              {
                step: "03", label: "RECEIVE YOUR PATHWAY",
                body: "AiVass recommends the right pathway after assessment. You do not self-select.",
                cta: null,
              },
            ].map(({ step, label, body, cta }, i) => (
              <div
                key={step}
                className={`pt-[16px] pb-[28px] md:pb-0 md:pr-[32px] ${i > 0 ? "border-t md:border-t-0 md:border-l border-navy/12 md:pl-[32px]" : ""}`}
                data-reveal
                style={{ transitionDelay: `${i * 90}ms` }}
              >
                <div className="flex items-center gap-[10px] mb-[12px]">
                  <svg viewBox="0 0 16 16" className="w-[12px] h-[12px] flex-shrink-0 text-oxblood" fill="currentColor">
                    <path d="M8 0 L9.6 6.4 L16 8 L9.6 9.6 L8 16 L6.4 9.6 L0 8 L6.4 6.4Z" />
                  </svg>
                  <span className="text-[9px] tracking-[0.16em] uppercase text-navy/50 font-medium">{step} · {label}</span>
                </div>
                <p className="text-[13px] text-navy-mid leading-[1.6] mb-[12px]">{body}</p>
                {cta}
              </div>
            ))}
          </div>

          <div className="mt-[36px] md:mt-[48px]">
            <div className="flex items-center gap-4 mb-[24px]" data-reveal>
              <div className="flex-1 h-px bg-navy/8" />
              <span className="eyebrow text-navy/30 text-[9px]">Your pathway</span>
              <div className="flex-1 h-px bg-navy/8" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
              {[
                ["AIVASS RISE", "An accelerated, intensive pathway for already-strong profiles ready to move quickly."],
                ["AIVASS SHINE", "A structured premium pathway for extraordinary-ability candidates needing deeper evidence architecture, sequencing, coaching and accountability."],
                ["AIVASS SIGNATURE", "A bespoke, long-horizon engagement for complex, highly individualized profiles requiring custom architecture."],
              ].map(([title, desc], i) => (
                <div
                  key={title}
                  className={`pt-[16px] pb-[24px] md:pb-0 md:pr-[32px] ${i > 0 ? "border-t md:border-t-0 md:border-l border-navy/12 md:pl-[32px]" : ""}`}
                  data-reveal
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <svg viewBox="0 0 12 12" className="w-[9px] h-[9px] mb-[10px] text-oxblood/40" fill="currentColor">
                    <path d="M6 0 L7.2 4.8 L12 6 L7.2 7.2 L6 12 L4.8 7.2 L0 6 L4.8 4.8Z" />
                  </svg>
                  <b className="font-serif font-normal text-[18px] md:text-[22px] block mb-[8px] tracking-[-0.03em]">{title}</b>
                  <p className="text-[12px] md:text-[12.5px] text-grey leading-[1.6] mb-[10px]">{desc}</p>
                  <a
                    href={STRATEGIC_ASSESSMENT_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-under text-oxblood inline-block text-[10.5px] tracking-[0.08em]"
                    onClick={() => trackAssessmentClick(`home-pathway-${title?.toLowerCase().replace(/\s+/g, '-')}`)}
                  >
                    Start with an Assessment
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          FOR BUSINESSES
      ═══════════════════════════════════════════════════════ */}
      <section className="relative bg-navy text-cream py-[65px] md:py-[95px] overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 85% 50%, rgba(44,64,93,0.8) 0%, rgba(18,35,63,0) 55%)",
          }}
        />
        <div
          className="absolute pointer-events-none"
          style={{
            top: "40%", left: 0, right: 0, height: "1px",
            background:
              "linear-gradient(to right, transparent 5%, rgba(217,163,155,0.1) 30%, rgba(217,163,155,0.1) 70%, transparent 95%)",
          }}
        />
        <div className="wrap relative z-10">
          <div className="eyebrow text-ox-light mb-4" data-reveal>For businesses</div>
          <h2
            className="text-[38px] md:text-[clamp(38px,5vw,66px)] leading-[0.98] tracking-[-0.06em] mb-4"
            data-reveal
            style={{ transitionDelay: "80ms" }}
          >
            From activity<br />
            <span className="text-ox-light italic">to architecture.</span>
          </h2>
          <p
            className="text-ox-light text-[14px] md:text-[15px] leading-[1.65] max-w-[480px]"
            data-reveal
            style={{ transitionDelay: "160ms" }}
          >
            AiVass helps businesses turn ambition into intelligent systems, coherent
            workflows and technology-enabled transformation.
          </p>
          <div data-reveal style={{ transitionDelay: "240ms" }}>
            <a href="mailto:connect@aivass.com" className="btn-outline-light mt-8">Discuss a Partnership</a>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          FOR ORGANIZATIONS
      ═══════════════════════════════════════════════════════ */}
      <section className="relative bg-paper py-[65px] md:py-[95px] overflow-hidden">
        <div
          className="absolute top-[10%] bottom-[10%] pointer-events-none"
          style={{
            right: "8%", width: "1px",
            background:
              "linear-gradient(to bottom, transparent, rgba(18,35,63,0.06) 30%, rgba(18,35,63,0.06) 70%, transparent)",
          }}
        />
        <div className="wrap relative z-10">
          <div className="eyebrow mb-4" data-reveal>For organizations</div>
          <h2
            className="text-[38px] md:text-[clamp(38px,5vw,66px)] leading-[0.98] tracking-[-0.06em] mb-4"
            data-reveal
            style={{ transitionDelay: "80ms" }}
          >
            Capability is the infrastructure<br />
            <span className="text-oxblood italic">behind transformation.</span>
          </h2>
          <p
            className="text-[14px] md:text-[15px] text-navy-mid leading-[1.65] max-w-[580px]"
            data-reveal
            style={{ transitionDelay: "160ms" }}
          >
            Enterprise-ready warmth. AI capability, workforce enablement, education,
            intelligent operating systems, program architecture, GTM/revenue enablement.
          </p>
          <div data-reveal style={{ transitionDelay: "240ms" }}>
            <a href="mailto:connect@aivass.com" className="btn mt-8">Discuss a Partnership</a>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          EDITORIAL STRIP — cinematic full-bleed
      ═══════════════════════════════════════════════════════ */}
      <div className="relative w-full h-[50vh] md:h-[62vh] overflow-hidden" data-reveal="fade">
        <img
          src={`${import.meta.env.BASE_URL}images/editorial-strip-founder.jpg`}
          alt="A woman in a stone-arched hallway, pausing with quiet clarity"
          className="w-full h-full object-cover object-[center_20%]"
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, transparent 30%, rgba(18,35,63,0.72) 100%)",
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 wrap pb-9 md:pb-12">
          <p className="font-serif italic text-cream text-[20px] md:text-[32px] tracking-[-0.03em] max-w-[580px] leading-[1.2]">
            "Extraordinary ability<br />
            <span className="text-ox-light">is built, not declared."</span>
          </p>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          GUIDES
      ═══════════════════════════════════════════════════════ */}
      <section className="py-[65px] md:py-[100px]">
        <div className="wrap">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-7 md:mb-[40px]">
            <div>
              <div className="eyebrow mb-4" data-reveal>Guides</div>
              <h2
                className="text-[38px] md:text-[clamp(38px,5vw,66px)] leading-[0.98] tracking-[-0.06em] mb-4"
                data-reveal
                style={{ transitionDelay: "80ms" }}
              >
                Guides for<br />
                <span className="text-oxblood italic">Extraordinary Futures</span>
              </h2>
              <p
                className="text-[14px] md:text-[15px] text-navy-mid leading-[1.65] max-w-[480px]"
                data-reveal
                style={{ transitionDelay: "160ms" }}
              >
                Practical frameworks, templates and resources designed to turn complex
                journeys into clear next steps.
              </p>
            </div>
            <Link href="/guides" className="btn mt-5 md:mt-0">Explore Guides →</Link>
          </div>

          <div className="eyebrow mb-[16px]" data-reveal>
            EXTRAORDINARY ABILITY · Available now · 6 guides
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-[1px] bg-navy/10">
            {GUIDES.map((guide, i) => (
              <article
                key={guide.id}
                className="bg-cream"
                data-reveal
                style={{ transitionDelay: `${i * 55}ms` }}
              >
                <Link href={`/guides/${guide.slug}`} className="group block">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={`${import.meta.env.BASE_URL}images/${guide.heroImage}`}
                      alt={guide.heroAlt}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                    />
                  </div>
                  <div className="p-4 md:p-5 border-t border-navy/10">
                    <h3 className="font-serif text-[14px] md:text-[17px] leading-tight mb-1 group-hover:text-oxblood transition-colors">{guide.name}</h3>
                    <p className="font-serif italic text-[11px] text-oxblood mb-2">{guide.subtitle}</p>
                    <span className="text-[9px] md:text-[10px] tracking-[0.12em] uppercase text-navy group-hover:text-oxblood transition-colors">
                      View Guide →
                    </span>
                  </div>
                </Link>
              </article>
            ))}
          </div>

          <div className="h-[1px] bg-navy/20 mt-9 md:mt-[60px] mb-[20px]" />
          <p className="font-serif text-[21px] flex items-center gap-3">
            CAREER & EVIDENCE
            <small className="font-sans text-[10px] tracking-[0.15em] text-oxblood uppercase">COMING NEXT</small>
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          INSIGHTS
      ═══════════════════════════════════════════════════════ */}
      <section className="bg-paper py-[65px] md:py-[100px] relative overflow-hidden">
        <div
          className="absolute top-0 left-0 right-0 h-[2px] pointer-events-none"
          style={{
            background:
              "linear-gradient(to right, transparent, rgba(217,163,155,0.35) 40%, rgba(217,163,155,0.35) 60%, transparent)",
          }}
        />

        <div className="wrap relative z-10">
          <div className="eyebrow mb-5" data-reveal>Free insights</div>
          <h2
            className="text-[38px] md:text-[clamp(38px,5vw,68px)] leading-[0.96] tracking-[-0.06em] mb-[44px] md:mb-[56px]"
            data-reveal
            style={{ transitionDelay: "80ms" }}
          >
            Ideas for building<br />
            <span className="text-oxblood italic">what comes next.</span>
          </h2>

          <div className="flex flex-col md:flex-row gap-5 md:gap-[18px]">
            {/* THE STRATEGIST */}
            <article
              className="flex-1 bg-navy text-ox-light p-7 md:p-8 flex flex-col justify-between min-h-[320px] border border-navy shadow-sm group card-lift relative overflow-hidden"
              data-reveal
              style={{ transitionDelay: "0ms" }}
            >
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse at 80% 20%, rgba(217,163,155,0.06) 0%, transparent 55%)",
                }}
              />
              <div className="relative z-10">
                <small className="text-[9px] tracking-[0.12em] uppercase text-oxblood block mb-5">The Strategist · Visual Thought-Leadership</small>
                <div className="mb-5 -mx-2">
                  <TransformationEvolution className="w-full h-[130px]" />
                </div>
                <h3 className="font-serif text-[20px] mb-2 text-cream leading-[1.1]">Transformation<br />with Soul</h3>
                <p className="text-[12px] leading-[1.6] text-ox-light/70 max-w-[220px]">
                  Strategic frameworks and editorial perspectives on building extraordinary futures.
                </p>
              </div>
              <Link href="/insights" className="link-under text-ox-light inline-block w-max border-ox-light hover:text-cream hover:border-cream mt-5 relative z-10 text-[11px] tracking-[0.06em]">
                Explore →
              </Link>
            </article>

            {/* ARTICLES */}
            <article
              className="flex-1 bg-paper p-7 md:p-8 flex flex-col justify-between min-h-[320px] border border-navy/10 group card-lift relative overflow-hidden"
              data-reveal
              style={{ transitionDelay: "100ms" }}
            >
              <div className="absolute top-5 right-5 pointer-events-none opacity-25 group-hover:opacity-40 transition-opacity">
                <svg viewBox="0 0 48 42" className="w-[36px]" fill="none">
                  <path d="M24 2 L10 38 L38 38 Z" stroke="#7E3033" strokeWidth="0.8" opacity="0.5" strokeLinejoin="round"/>
                  <path d="M24 0 L25.5 4 L29 5.5 L25.5 7 L24 11 L22.5 7 L19 5.5 L22.5 4Z" fill="#7E3033" />
                  <path d="M10 33 L11.5 37 L15 38.5 L11.5 40 L10 44 L8.5 40 L5 38.5 L8.5 37Z" fill="#7E3033" />
                  <path d="M38 33 L39.5 37 L43 38.5 L39.5 40 L38 44 L36.5 40 L33 38.5 L36.5 37Z" fill="#7E3033" />
                </svg>
              </div>
              <div>
                <small className="text-[9px] tracking-[0.12em] uppercase text-oxblood block mb-5">Articles · Analysis & Strategy</small>
                <ul className="flex flex-col gap-5">
                  {ARTICLES.slice(0, 2).map((a) => (
                    <li key={a.id}>
                      <Link href={`/insights/articles/${a.slug}`} className="text-navy">
                        <h4 className="font-serif text-[17px] leading-[1.2] mb-1 hover:text-oxblood transition-colors">{a.title}</h4>
                        <span className="text-[11px] text-grey">
                          {a.author} · {new Date(a.publishedAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <Link href="/insights/articles" className="link-under text-oxblood inline-block w-max mt-5 text-[11px] tracking-[0.06em]">Read All Articles →</Link>
            </article>

            {/* FIELD NOTES */}
            <article
              className="flex-1 bg-cream p-7 md:p-8 flex flex-col justify-between min-h-[320px] border border-navy/10 relative overflow-hidden group card-lift"
              data-reveal
              style={{ transitionDelay: "200ms" }}
            >
              {[
                [15,12],[72,8],[88,28],[8,55],[92,62],[30,78],[60,85],[45,40],
              ].map(([x, y], i) => (
                <div key={i} className="absolute pointer-events-none rounded-full"
                  style={{ left: `${x}%`, top: `${y}%`, width: "2px", height: "2px",
                    background: "rgba(126,48,51,0.22)", opacity: 0.3 + (i % 3) * 0.14 }} />
              ))}
              <div
                className="absolute inset-0 pointer-events-none opacity-[0.022]"
                style={{ backgroundImage: "linear-gradient(transparent 95%, #12233f 95%)", backgroundSize: "100% 22px" }}
              />
              <div className="relative z-10">
                <small className="text-[9px] tracking-[0.12em] uppercase text-oxblood block mb-5">Field Notes · Short Observations</small>
                <svg viewBox="0 0 16 16" className="w-[12px] h-[12px] mb-4 text-oxblood/35" fill="currentColor">
                  <path d="M8 0 L9.6 6.4 L16 8 L9.6 9.6 L8 16 L6.4 9.6 L0 8 L6.4 6.4Z" />
                </svg>
                <div className="mb-4">
                  <h3 className="font-serif text-[20px] mb-3 leading-[1.15]">{ARTICLES[0].title}</h3>
                  <p className="text-[12.5px] text-navy-mid leading-[1.6] italic">"{ARTICLES[0].excerpt}"</p>
                </div>
              </div>
              <Link href="/insights" className="link-under text-oxblood inline-block w-max relative z-10 mt-5 text-[11px] tracking-[0.06em]">Explore Notes →</Link>
            </article>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          FINAL CTA — deep navy, constellation
      ═══════════════════════════════════════════════════════ */}
      <section
        className="relative text-cream text-center overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse at 50% 60%, #1a2e4a 0%, #0d1b2e 45%, #080f1c 100%)",
          padding: "clamp(80px, 12vw, 140px) clamp(20px, 6vw, 80px)",
        }}
      >
        {[
          [8,12],[19,72],[34,5],[47,88],[61,22],[72,55],[83,8],[91,78],[14,45],
          [26,33],[55,67],[78,18],[88,50],[5,60],[40,95],[65,38],[96,30],[30,80],
        ].map(([x, y], i) => (
          <div
            key={i}
            className="absolute pointer-events-none rounded-full"
            style={{
              left: `${x}%`, top: `${y}%`,
              width: i % 3 === 0 ? "2px" : "1px",
              height: i % 3 === 0 ? "2px" : "1px",
              background: "rgba(217,163,155,0.4)",
              opacity: 0.25 + (i % 5) * 0.12,
            }}
          />
        ))}

        <div
          className="absolute pointer-events-none"
          style={{
            top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            width: "min(650px, 90vw)", height: "min(650px, 90vw)",
            background:
              "radial-gradient(ellipse at 50% 48%, rgba(217,163,155,0.07) 0%, rgba(126,48,51,0.04) 38%, transparent 68%)",
            borderRadius: "50%",
          }}
        />

        <div className="relative z-10 flex flex-col items-center">
          <div className="eyebrow text-ox-light mb-5 tracking-[0.18em]" data-reveal>
            Begin here
          </div>

          <h2
            className="font-serif leading-[0.95] tracking-[-0.06em] text-cream mb-4"
            style={{ fontSize: "clamp(46px, 9vw, 104px)" }}
            data-reveal
          >
            What future<br />
            <em className="text-ox-light not-italic">are you building?</em>
          </h2>

          <p
            className="text-[13px] tracking-[0.07em] text-cream/45 mb-[44px] max-w-[340px]"
            data-reveal
            style={{ transitionDelay: "120ms" }}
          >
            Every extraordinary outcome begins with a single, deliberate choice.
          </p>

          <div data-reveal="fade" style={{ transitionDelay: "200ms" }} className="mb-[44px]">
            <MagicConstellation className="w-[min(240px,70vw)] h-auto" />
          </div>

          <div
            className="flex flex-col md:flex-row justify-center gap-5 md:gap-[38px] text-[10px] tracking-[0.18em] uppercase mb-[44px]"
            data-reveal
            style={{ transitionDelay: "300ms" }}
          >
            <Link href="/solutions/individuals" className="text-ox-light hover:text-cream transition-colors">For myself</Link>
            <span className="hidden md:block text-cream/18 self-center">·</span>
            <Link href="/solutions/businesses" className="text-ox-light hover:text-cream transition-colors">For my business</Link>
            <span className="hidden md:block text-cream/18 self-center">·</span>
            <Link href="/solutions/organizations" className="text-ox-light hover:text-cream transition-colors">For my organization</Link>
          </div>

          <Link
            href="/contact"
            data-reveal
            style={{ transitionDelay: "380ms" }}
            className="inline-block px-8 py-4 border border-ox-light/55 text-ox-light text-[10.5px] tracking-[0.16em] uppercase hover:bg-ox-light/10 hover:border-ox-light transition-all duration-300"
          >
            Start a Conversation
          </Link>
        </div>
      </section>
    </div>
  );
}
