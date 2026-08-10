import { useEffect } from "react";
import { Link } from "wouter";
import { Triad } from "@/components/brand/Triad";
import { GUIDES } from "@/data/guides";
import { ARTICLES } from "@/data/articles";
import { STRATEGIC_ASSESSMENT_URL } from "@/config/booking";
import { useSeoMeta } from "@/lib/seo";
import { trackAssessmentClick, trackGuidePurchaseClick } from "@/lib/analytics";

/** Wire up scroll-reveal: any [data-reveal] element animates in when it enters the viewport. */
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
      { threshold: 0.12, rootMargin: "0px 0px -44px 0px" }
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
          01  HERO — architectural threshold, dawn light
      ═══════════════════════════════════════════════════════ */}
      <section
        className="relative min-h-[100svh] flex items-center overflow-hidden"
        style={{ paddingTop: 64 }}
      >
        {/* Atmospheric warm bloom — right-biased, behind the art column */}
        <div
          className="absolute pointer-events-none"
          style={{
            right: 0,
            top: "10%",
            width: "55%",
            height: "85%",
            background:
              "radial-gradient(ellipse at 60% 40%, rgba(217,163,155,0.14) 0%, rgba(247,243,233,0) 68%)",
          }}
        />
        {/* Very faint architectural grid — depth, not noise */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, rgba(18,35,63,0.025) 0px, transparent 1px, transparent 120px, rgba(18,35,63,0.025) 121px)",
            backgroundSize: "120px 100%",
          }}
        />

        <div className="wrap w-full grid grid-cols-1 md:grid-cols-2 items-center gap-[4vw] py-[80px] md:py-0">
          {/* Text column */}
          <div>
            <div
              className="eyebrow mb-5"
              data-reveal
              style={{ transitionDelay: "0ms" }}
            >
              01 · Transformation studio
            </div>
            <h1
              className="text-[60px] md:text-[clamp(60px,7vw,100px)] leading-[0.9] tracking-[-0.07em] font-serif mb-[22px]"
              data-reveal
              style={{ transitionDelay: "80ms" }}
            >
              Building<br />
              <em className="text-oxblood italic">extraordinary</em><br />
              futures.
            </h1>
            <div
              className="w-[80px] h-[1px] bg-navy/25 mb-[22px]"
              data-reveal="fade"
              style={{ transitionDelay: "200ms" }}
            />
            <p
              className="text-[14px] md:text-[16px] text-navy-mid max-w-[485px] leading-[1.65]"
              data-reveal
              style={{ transitionDelay: "260ms" }}
            >
              A boutique transformation studio where intelligent systems, human
              connection and strategic architecture come together to build what
              comes next.
            </p>
            <div
              className="flex flex-row flex-wrap gap-6 mt-[30px]"
              data-reveal
              style={{ transitionDelay: "340ms" }}
            >
              <Link href="/solutions" className="btn-fill">Explore AiVass</Link>
              <a href="#three-paths" className="link-under">Find Your Path ↗</a>
            </div>
            <div
              className="font-serif italic text-[20px] text-grey mt-[36px] md:mt-[60px]"
              data-reveal="fade"
              style={{ transitionDelay: "480ms" }}
            >
              Automation <b className="text-oxblood font-normal">with</b> Soul.
            </div>
          </div>

          {/* Art column — editorial human portrait */}
          <div
            className="mt-7 md:mt-0 relative"
            data-reveal="fade"
            style={{ transitionDelay: "100ms" }}
          >
            <div className="relative h-[55vh] md:h-[88vh] overflow-hidden">
              <img
                src={`${import.meta.env.BASE_URL}images/editorial-hero-human.jpg`}
                alt="A professional in a moment of quiet authority and focused clarity"
                className="w-full h-full object-cover object-[center_20%]"
              />
              {/* Fade left edge into text column, fade bottom to next section */}
              <div className="absolute inset-0 pointer-events-none" style={{
                background: "linear-gradient(to right, rgba(247,243,233,0.45) 0%, transparent 28%), linear-gradient(to bottom, transparent 72%, rgba(247,243,233,0.35) 100%)"
              }} />
            </div>
          </div>
        </div>

        {/* Soft fade-to-next transition */}
        <div
          className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
          style={{
            background: "linear-gradient(to bottom, transparent, rgba(247,243,233,0.7))",
          }}
        />
      </section>

      {/* ═══════════════════════════════════════════════════════
          02  THREE TRANSFORMATION PATHS — navy, one Triad moment
      ═══════════════════════════════════════════════════════ */}
      <section
        id="three-paths"
        className="bg-navy text-cream pt-[65px] pb-[60px] md:py-[95px] scroll-mt-20 relative overflow-hidden"
      >
        {/* Subtle warm horizon accent — top edge */}
        <div
          className="absolute top-0 left-0 right-0 h-[1px] pointer-events-none"
          style={{ background: "linear-gradient(to right, transparent, rgba(217,163,155,0.25) 40%, rgba(217,163,155,0.25) 60%, transparent)" }}
        />

        <div className="wrap">
          <div className="eyebrow text-ox-light mb-8" data-reveal>
            02 · Three transformation paths
          </div>
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.1fr] gap-10 md:gap-[8vw] items-center">
            <div>
              <h2
                className="text-[40px] md:text-[clamp(40px,5vw,70px)] leading-[0.98] tracking-[-0.06em] mb-4"
                data-reveal
                style={{ transitionDelay: "80ms" }}
              >
                One house.<br />
                <span className="text-ox-light italic">Three paths.</span>
              </h2>
              <p
                className="text-ox-light text-[14px] md:text-[16px] leading-[1.65] max-w-[400px]"
                data-reveal
                style={{ transitionDelay: "160ms" }}
              >
                A connected architecture for people, businesses and organizations
                moving toward what comes next.
              </p>
            </div>

            {/* Single shared architecture — one Triad, three labeled nodes */}
            <div className="flex flex-col items-center" data-reveal style={{ transitionDelay: "120ms" }}>
              <svg
                viewBox="0 0 480 360"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full max-w-[480px]"
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-[10px] w-full mt-8 md:mt-4">
                {[
                  ["INDIVIDUALS", "Build, articulate and demonstrate extraordinary ability.", "/solutions/individuals"],
                  ["BUSINESSES", "Turn ambition into intelligent, scalable systems.", "/solutions/businesses"],
                  ["ORGANIZATIONS", "Transform capability, operations and how people work with AI.", "/solutions/organizations"],
                ].map(([title, desc, path], i) => (
                  <Link
                    href={path}
                    key={title}
                    className={`group block border-t border-cream/20 pt-[12px] hover:bg-white/5 transition-colors ${
                      i > 0 ? "md:border-l md:border-t-0 md:pl-[14px] border-t pt-[12px] md:pt-0" : ""
                    }`}
                  >
                    <h3 className="font-serif text-[16px] md:text-[18px] mb-1 group-hover:text-ox-light transition-colors">{title}</h3>
                    <p className="text-ox-light text-[11px] md:text-[12px] leading-[1.5] opacity-80 group-hover:opacity-100 transition-opacity">{desc}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          03  AUTOMATION WITH SOUL — manifesto, arch echo
      ═══════════════════════════════════════════════════════ */}
      <section className="relative py-[85px] md:py-[130px] min-h-[400px] md:min-h-[540px] flex items-center text-center overflow-hidden">
        {/* Warm atmospheric background — slightly warmer than base cream */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 60%, rgba(217,163,155,0.10) 0%, transparent 65%)",
          }}
        />
        {/* Arch echo — a ghost portal behind the manifesto text */}
        <div
          className="absolute pointer-events-none"
          style={{
            left: "50%",
            top: "8%",
            width: "420px",
            height: "88%",
            transform: "translateX(-50%)",
            border: "1px solid rgba(18,35,63,0.07)",
            borderBottom: "none",
            borderRadius: "210px 210px 0 0",
          }}
        />

        <div className="wrap w-full relative z-10">
          <div className="eyebrow mb-5" data-reveal>03 · Operating philosophy</div>

          {/* Ruled lines — editorial accent above heading */}
          <div
            className="flex flex-col items-center gap-[5px] mb-8"
            data-reveal="fade"
            style={{ transitionDelay: "60ms" }}
          >
            <div className="w-[60px] h-[1px] bg-navy/20" />
            <div className="w-[40px] h-[1px] bg-oxblood/30" />
          </div>

          <h2
            className="text-[52px] md:text-[clamp(54px,8vw,108px)] font-serif leading-none tracking-[-0.05em] mb-[22px]"
            data-reveal
            style={{ transitionDelay: "120ms" }}
          >
            Automation <span className="text-oxblood italic">with Soul.</span>
          </h2>
          <p
            className="font-serif italic text-[18px] md:text-[22px] max-w-[590px] mx-auto leading-[1.4] text-navy-mid"
            data-reveal
            style={{ transitionDelay: "220ms" }}
          >
            The future should become more intelligent without becoming less human.
          </p>

          {/* Ruled lines — below */}
          <div
            className="flex flex-col items-center gap-[5px] mt-8"
            data-reveal="fade"
            style={{ transitionDelay: "320ms" }}
          >
            <div className="w-[40px] h-[1px] bg-oxblood/30" />
            <div className="w-[60px] h-[1px] bg-navy/20" />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          04  PURPOSE · PROOF · PERMANENCE — staggered reveal
      ═══════════════════════════════════════════════════════ */}
      <section className="bg-paper py-[75px] md:py-[115px] relative overflow-hidden">
        {/* Faint horizon accent at top */}
        <div
          className="absolute top-0 left-0 right-0 h-[1px] pointer-events-none"
          style={{
            background: "linear-gradient(to right, transparent, rgba(18,35,63,0.10) 30%, rgba(18,35,63,0.10) 70%, transparent)",
          }}
        />
        <div className="wrap">
          <div className="eyebrow mb-4" data-reveal>04 · Strategic framework</div>
          <h2
            className="text-[40px] md:text-[clamp(40px,5vw,70px)] leading-[0.98] tracking-[-0.06em] mb-[50px] md:mb-[70px]"
            data-reveal
            style={{ transitionDelay: "80ms" }}
          >
            Purpose · Proof ·<br />
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
                className={`pt-[20px] pb-[40px] md:pb-0 md:pr-[40px] ${
                  i > 0 ? "md:pl-[40px] md:border-l border-navy/15 border-t md:border-t-0 pt-[28px] md:pt-[20px]" : ""
                }`}
                data-reveal
                style={{ transitionDelay: `${i * 120}ms` }}
              >
                <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] mb-4 text-oxblood" fill="currentColor">
                  <path d="M12 2 L13.5 10.5 L22 12 L13.5 13.5 L12 22 L10.5 13.5 L2 12 L10.5 10.5Z" />
                </svg>
                <b className="font-serif font-normal text-[24px] md:text-[30px] block mb-3 tracking-[-0.03em]">{label}</b>
                <p className="text-[13px] md:text-[14px] text-grey leading-[1.6]">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          05  FOR INDIVIDUALS — explore / assess / pathway
      ═══════════════════════════════════════════════════════ */}
      <section className="py-[75px] md:py-[115px]">
        <div className="wrap">
          <div className="eyebrow mb-4" data-reveal>05 · For individuals</div>
          <h2
            className="text-[40px] md:text-[clamp(40px,5vw,70px)] leading-[0.98] tracking-[-0.06em] mb-4"
            data-reveal
            style={{ transitionDelay: "80ms" }}
          >
            Explore. Assess.<br />
            <span className="text-oxblood italic">Receive your pathway.</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-[15px] mt-10 md:mt-[50px]">
            {[
              {
                step: "01 · EXPLORE",
                body: "Begin with paid self-directed Guides. Available now · 5 guides in Extraordinary Ability.",
                cta: <Link href="/guides" className="link-under text-oxblood inline-block">Explore Guides</Link>,
              },
              {
                step: "02 · ASSESS",
                body: "A private assessment of your current profile, evidence, readiness, gaps and potential pathway.",
                cta: <a href={STRATEGIC_ASSESSMENT_URL} target="_blank" rel="noopener noreferrer" className="link-under text-oxblood inline-block" onClick={() => trackAssessmentClick("home-assess-step")}>Assess Your Profile</a>,
              },
              {
                step: "03 · RECEIVE YOUR PATHWAY",
                body: "AiVass recommends the right pathway after assessment. You do not self-select.",
                cta: null,
              },
            ].map(({ step, body, cta }, i) => (
              <div
                key={step}
                className="border-t border-navy pt-[15px]"
                data-reveal
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <b className="font-serif font-normal text-[21px] md:text-[27px] block mb-2">{step}</b>
                <p className="text-[11px] md:text-[13px] text-navy-mid leading-[1.5] mb-4">{body}</p>
                {cta}
              </div>
            ))}
          </div>

          <div className="flex flex-col md:flex-row flex-wrap gap-8 md:gap-4 mt-12 md:mt-[55px]">
            {[
              ["AIVASS RISE", "An accelerated, intensive pathway for already-strong profiles ready to move quickly."],
              ["AIVASS SHINE", "A structured premium pathway for extraordinary-ability candidates needing deeper evidence architecture, sequencing, coaching and accountability."],
              ["AIVASS SIGNATURE", "A bespoke, long-horizon engagement for complex, highly individualized profiles requiring custom architecture."],
            ].map(([title, desc], i) => (
              <div
                key={title}
                className="flex-1 md:basis-[29%] border-t border-navy pt-[15px]"
                data-reveal
                style={{ transitionDelay: `${i * 110}ms` }}
              >
                <b className="font-serif font-normal text-[21px] md:text-[27px] block mb-2">{title}</b>
                <p className="text-[11px] md:text-[13px] text-grey leading-[1.5] mb-4 h-auto md:min-h-[60px]">{desc}</p>
                <a href={STRATEGIC_ASSESSMENT_URL} target="_blank" rel="noopener noreferrer" className="link-under text-oxblood inline-block" onClick={() => trackAssessmentClick(`home-pathway-${title?.toLowerCase().replace(/\s+/g, '-')}`)}>
                  Start with an Assessment
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          06  FOR BUSINESSES — navy, richer atmospheric depth
      ═══════════════════════════════════════════════════════ */}
      <section className="relative bg-navy text-cream py-[75px] md:py-[115px] overflow-hidden">
        {/* Directional warm bloom — light entering from the right horizon */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 85% 50%, rgba(44,64,93,0.8) 0%, rgba(18,35,63,0) 55%)",
          }}
        />
        {/* Architectural horizon lines — two ruled horizons */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: "38%",
            left: 0,
            right: 0,
            height: "1px",
            background: "linear-gradient(to right, transparent 5%, rgba(217,163,155,0.12) 30%, rgba(217,163,155,0.12) 70%, transparent 95%)",
          }}
        />
        <div
          className="absolute pointer-events-none"
          style={{
            top: "42%",
            left: 0,
            right: 0,
            height: "1px",
            background: "linear-gradient(to right, transparent 10%, rgba(217,163,155,0.07) 35%, rgba(217,163,155,0.07) 65%, transparent 90%)",
          }}
        />

        <div className="wrap relative z-10">
          <div className="eyebrow text-ox-light mb-4" data-reveal>06 · For businesses</div>
          <h2
            className="text-[40px] md:text-[clamp(40px,5vw,70px)] leading-[0.98] tracking-[-0.06em] mb-4"
            data-reveal
            style={{ transitionDelay: "80ms" }}
          >
            From activity<br />
            <span className="text-ox-light italic">to architecture.</span>
          </h2>
          <p
            className="text-ox-light text-[14px] md:text-[16px] leading-[1.65] max-w-[500px]"
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
          07  FOR ORGANIZATIONS — paper, atmospheric
      ═══════════════════════════════════════════════════════ */}
      <section className="relative bg-paper py-[75px] md:py-[115px] overflow-hidden">
        {/* Faint vertical rule accent — right side */}
        <div
          className="absolute top-[10%] bottom-[10%] pointer-events-none"
          style={{
            right: "8%",
            width: "1px",
            background: "linear-gradient(to bottom, transparent, rgba(18,35,63,0.08) 30%, rgba(18,35,63,0.08) 70%, transparent)",
          }}
        />
        <div className="wrap relative z-10">
          <div className="eyebrow mb-4" data-reveal>07 · For organizations</div>
          <h2
            className="text-[40px] md:text-[clamp(40px,5vw,70px)] leading-[0.98] tracking-[-0.06em] mb-4"
            data-reveal
            style={{ transitionDelay: "80ms" }}
          >
            Capability is the infrastructure<br />
            <span className="text-oxblood italic">behind transformation.</span>
          </h2>
          <p
            className="text-[14px] md:text-[16px] text-navy-mid leading-[1.65] max-w-[600px]"
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
          07B  EDITORIAL HUMAN STRIP — full-bleed cinematic break
      ═══════════════════════════════════════════════════════ */}
      <div className="relative w-full h-[52vh] md:h-[68vh] overflow-hidden" data-reveal="fade">
        <img
          src={`${import.meta.env.BASE_URL}images/editorial-strip-home.jpg`}
          alt="A professional at the threshold of an extraordinary future"
          className="w-full h-full object-cover object-center"
        />
        {/* Deep navy gradient anchors the quote at bottom */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "linear-gradient(to bottom, transparent 35%, rgba(18,35,63,0.75) 100%)"
        }} />
        <div className="absolute bottom-0 left-0 right-0 wrap pb-10 md:pb-14">
          <p className="font-serif italic text-cream text-[22px] md:text-[34px] tracking-[-0.03em] max-w-[640px] leading-[1.2]">
            "Extraordinary ability<br />
            <span className="text-ox-light">is built, not declared."</span>
          </p>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          08  GUIDES FOR EXTRAORDINARY FUTURES — editorial cards
      ═══════════════════════════════════════════════════════ */}
      <section className="py-[75px] md:py-[115px]">
        <div className="wrap">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-[45px]">
            <div>
              <div className="eyebrow mb-4" data-reveal>08 · Guides</div>
              <h2
                className="text-[40px] md:text-[clamp(40px,5vw,70px)] leading-[0.98] tracking-[-0.06em] mb-4"
                data-reveal
                style={{ transitionDelay: "80ms" }}
              >
                Guides for<br />
                <span className="text-oxblood italic">Extraordinary Futures</span>
              </h2>
              <p
                className="text-[14px] md:text-[16px] text-navy-mid leading-[1.65] max-w-[500px]"
                data-reveal
                style={{ transitionDelay: "160ms" }}
              >
                Practical frameworks, templates and resources designed to turn complex
                journeys into clear next steps.
              </p>
            </div>
            <Link href="/guides" className="btn mt-5 md:mt-0">Explore Guides →</Link>
          </div>

          <div className="eyebrow mb-[18px]" data-reveal>
            EXTRAORDINARY ABILITY · Available now · 6 guides
          </div>

          {/* Guide grid — editorial photography, shared source with /guides page */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-[1px] bg-navy/10">
            {GUIDES.map((guide, i) => (
              <article
                key={guide.id}
                className="bg-cream"
                data-reveal
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <Link href={`/guides/${guide.slug}`} className="group block">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={`${import.meta.env.BASE_URL}images/${guide.heroImage}`}
                      alt={guide.heroAlt}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                    />
                  </div>
                  <div className="p-5 md:p-6 border-t border-navy/10">
                    <h3 className="font-serif text-[15px] md:text-[18px] leading-tight mb-1 group-hover:text-oxblood transition-colors">{guide.name}</h3>
                    <p className="font-serif italic text-[11px] md:text-[12px] text-oxblood mb-3">{guide.subtitle}</p>
                    <span className="text-[9px] md:text-[10px] tracking-[0.12em] uppercase text-navy group-hover:text-oxblood transition-colors">
                      View Guide →
                    </span>
                  </div>
                </Link>
              </article>
            ))}
          </div>

          <div className="h-[1px] bg-navy/25 mt-10 md:mt-[70px] mb-[22px]" />
          <p className="font-serif text-[23px] flex items-center gap-3">
            CAREER & EVIDENCE
            <small className="font-sans text-[10px] tracking-[0.15em] text-oxblood uppercase block mt-1">COMING NEXT</small>
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          09  INSIGHTS — editorial three-stream
      ═══════════════════════════════════════════════════════ */}
      <section className="bg-paper py-[75px] md:py-[115px] relative overflow-hidden">
        {/* Warm top accent */}
        <div
          className="absolute top-0 left-0 right-0 h-[1px] pointer-events-none"
          style={{
            background: "linear-gradient(to right, transparent, rgba(126,48,51,0.15) 40%, rgba(126,48,51,0.15) 60%, transparent)",
          }}
        />
        <div className="wrap relative z-10">
          <div className="eyebrow mb-4" data-reveal>09 · Free insights</div>
          <h2
            className="text-[40px] md:text-[clamp(40px,5vw,70px)] leading-[0.98] tracking-[-0.06em] mb-12"
            data-reveal
            style={{ transitionDelay: "80ms" }}
          >
            Ideas for building<br />
            <span className="text-oxblood italic">what comes next.</span>
          </h2>

          <div className="flex flex-col md:flex-row gap-8 md:gap-[25px]">
            {/* THE STRATEGIST */}
            <article
              className="flex-1 bg-navy text-ox-light p-6 md:p-8 flex flex-col justify-between min-h-[300px] border border-navy shadow-sm group card-lift"
              data-reveal
              style={{ transitionDelay: "0ms" }}
            >
              <div>
                <div className="flex flex-col gap-1 mb-6 opacity-30 group-hover:opacity-50 transition-opacity">
                  <div className="w-full h-[1px] bg-ox-light" />
                  <div className="w-full h-[1px] bg-ox-light" />
                  <div className="w-full h-[1px] bg-ox-light" />
                </div>
                <small className="text-[10px] tracking-[0.1em] uppercase text-oxblood block mb-2">THE STRATEGIST · VISUAL THOUGHT-LEADERSHIP</small>
                <h3 className="font-serif text-[24px] mb-4 text-cream">The Strategist</h3>
                <p className="text-[13px] leading-[1.5] max-w-[250px]">
                  Strategic frameworks, architectural breakdowns and editorial perspectives.
                </p>
              </div>
              <Link href="/insights" className="link-under text-ox-light inline-block w-max border-ox-light hover:text-cream hover:border-cream mt-6">
                Explore →
              </Link>
            </article>

            {/* ARTICLES */}
            <article
              className="flex-1 bg-paper p-6 md:p-8 flex flex-col justify-between min-h-[300px] border border-navy/10 group card-lift"
              data-reveal
              style={{ transitionDelay: "100ms" }}
            >
              <div>
                <small className="text-[10px] tracking-[0.1em] uppercase text-oxblood block mb-6">ARTICLES · ANALYSIS & STRATEGY</small>
                <ul className="flex flex-col gap-6">
                  {ARTICLES.slice(0, 2).map((a) => (
                    <li key={a.id}>
                      <Link href={`/insights/articles/${a.slug}`} className="group-hover/item text-navy">
                        <h4 className="font-serif text-[18px] leading-[1.2] mb-1 group-hover:text-oxblood transition-colors">{a.title}</h4>
                        <span className="text-[11px] text-grey">
                          {a.author} · {new Date(a.publishedAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <Link href="/insights/articles" className="link-under text-oxblood inline-block w-max mt-6">Read All Articles →</Link>
            </article>

            {/* FIELD NOTES */}
            <article
              className="flex-1 bg-cream p-6 md:p-8 flex flex-col justify-between min-h-[300px] border border-navy/10 relative overflow-hidden group card-lift"
              data-reveal
              style={{ transitionDelay: "200ms" }}
            >
              <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(transparent_95%,_#12233f_95%)] bg-[length:100%_20px]" />
              <div className="relative z-10">
                <small className="text-[10px] tracking-[0.1em] uppercase text-oxblood block mb-6">FIELD NOTES · SHORT OBSERVATIONS</small>
                <div className="mb-4">
                  <h3 className="font-serif text-[24px] mb-2">{ARTICLES[0].title}</h3>
                  <p className="text-[13px] text-navy-mid leading-[1.5] italic">"{ARTICLES[0].excerpt}"</p>
                </div>
              </div>
              <Link href="/insights" className="link-under text-oxblood inline-block w-max relative z-10 mt-6">Explore Notes →</Link>
            </article>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          10  FOUNDER — elevated quote treatment
      ═══════════════════════════════════════════════════════ */}
      <section className="relative py-[75px] md:py-[115px] overflow-hidden">
        {/* Faint warm bloom centered left */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 15% 50%, rgba(217,163,155,0.08) 0%, transparent 55%)",
          }}
        />
        <div className="wrap grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-[6vw] items-center relative z-10">
          <div data-reveal>
            <div className="eyebrow mb-4">10 · Founder</div>
            {/* Decorative rule above quote */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-6 h-[1px] bg-oxblood/40" />
              <svg viewBox="0 0 12 12" className="w-[10px] h-[10px] text-oxblood" fill="currentColor">
                <path d="M6 0 L7 5 L12 6 L7 7 L6 12 L5 7 L0 6 L5 5Z" />
              </svg>
              <div className="w-6 h-[1px] bg-oxblood/40" />
            </div>
            <blockquote className="font-serif italic text-[29px] md:text-[34px] leading-[1.15]">
              "Build the capability to meet the future with clarity."
            </blockquote>
          </div>
          <div data-reveal style={{ transitionDelay: "100ms" }}>
            <p className="leading-[1.7] text-navy-mid md:text-grey max-w-[550px] text-[16px] mb-6">
              AiVass is a boutique technology-enabled transformation studio working at
              the intersection of intelligent systems, strategy and human potential.
            </p>
            <p className="text-[11px] text-grey leading-[1.5] max-w-[400px]">
              AiVass provides strategic, educational, organizational, coaching and
              project-management support. Not legal advice or representation.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          11  FINAL CTA — navy, atmospheric glow, floating Triad
      ═══════════════════════════════════════════════════════ */}
      <section className="relative bg-navy text-cream py-[85px] md:py-[125px] text-center px-[23px] md:px-[6vw] overflow-hidden">
        {/* Atmospheric warm radial behind Triad — ox-light bloom */}
        <div
          className="absolute pointer-events-none animate-bloom-pulse"
          style={{
            top: "30%",
            left: "50%",
            width: "520px",
            height: "340px",
            transform: "translateX(-50%)",
            background:
              "radial-gradient(ellipse at 50% 50%, rgba(217,163,155,0.10) 0%, transparent 65%)",
          }}
        />
        {/* Architectural horizon lines — future-facing perspective */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: "28%",
            left: 0,
            right: 0,
            height: "1px",
            background:
              "linear-gradient(to right, transparent 10%, rgba(217,163,155,0.14) 35%, rgba(217,163,155,0.14) 65%, transparent 90%)",
          }}
        />
        <div
          className="absolute pointer-events-none"
          style={{
            bottom: "28%",
            left: 0,
            right: 0,
            height: "1px",
            background:
              "linear-gradient(to right, transparent 10%, rgba(217,163,155,0.09) 35%, rgba(217,163,155,0.09) 65%, transparent 90%)",
          }}
        />

        <div className="relative z-10">
          <div className="eyebrow text-ox-light mb-4" data-reveal>11 · Begin here</div>
          <h2
            className="font-serif text-[50px] md:text-[clamp(50px,7vw,88px)] leading-[0.98] tracking-[-0.06em] mt-[15px] mb-[45px]"
            data-reveal
            style={{ transitionDelay: "80ms" }}
          >
            What future<br />
            are you building?
          </h2>

          {/* Floating Triad — gentle ambient drift, no heavy repetition */}
          <div
            className="flex justify-center mb-[45px]"
            data-reveal="fade"
            style={{ transitionDelay: "200ms" }}
          >
            <Triad
              className="w-[88%] max-w-[220px] text-ox-light animate-float"
            />
          </div>

          <div
            className="flex flex-col md:flex-row justify-center gap-6 md:gap-[35px] text-ox-light text-[11px] tracking-[0.13em] uppercase"
            data-reveal
            style={{ transitionDelay: "300ms" }}
          >
            <Link href="/solutions/individuals" className="hover:text-cream transition-colors">For myself</Link>
            <Link href="/solutions/businesses" className="hover:text-cream transition-colors">For my business</Link>
            <Link href="/solutions/organizations" className="hover:text-cream transition-colors">For my organization</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
