import { Link } from "wouter";
import { Triad } from "@/components/brand/Triad";
import { TriadHero } from "@/components/brand/TriadHero";

export default function Home() {
  return (
    <div className="bg-cream">
      {/* 01 HERO */}
      <section className="min-h-[720px] wrap grid grid-cols-1 md:grid-cols-2 items-center gap-[4vw] pt-[58px] pb-[65px] md:py-0">
        <div>
          <div className="eyebrow mb-5">01 · Transformation studio</div>
          <h1 className="text-[60px] md:text-[clamp(60px,7vw,100px)] leading-[0.9] tracking-[-0.07em] font-serif mb-[22px]">
            Building<br />
            <em className="text-oxblood italic">extraordinary</em><br />
            futures.
          </h1>
          <div className="w-[80px] h-[1px] bg-navy/25 mb-[22px]" />
          <p className="text-[14px] md:text-[16px] text-navy-mid max-w-[485px] leading-[1.65]">
            A boutique transformation studio where intelligent systems, human connection and strategic architecture come together to build what comes next.
          </p>
          <div className="flex flex-row flex-wrap gap-6 mt-[30px]">
            <Link href="/solutions" className="btn-fill">Explore AiVass</Link>
            <Link href="/solutions" className="link-under">Find Your Path ↗</Link>
          </div>
          <div className="font-serif italic text-[20px] text-grey mt-[36px] md:mt-[60px]">
            Automation <b className="text-oxblood font-normal">with</b> Soul.
          </div>
        </div>
        <div className="mt-7 md:mt-0">
          <TriadHero />
        </div>
      </section>

      {/* 02 THREE TRANSFORMATION PATHS */}
      <section className="bg-navy text-cream pt-[65px] pb-[60px] md:py-[95px]">
        <div className="wrap">
          <div className="eyebrow text-ox-light mb-8">02 · Three transformation paths</div>
          <div className="grid grid-cols-1 md:grid-cols-[0.8fr_1.5fr] gap-10 md:gap-[8vw] items-center">
            <div>
              <h2 className="text-[40px] md:text-[clamp(40px,5vw,70px)] leading-[0.98] tracking-[-0.06em] mb-4">
                One house.<br />
                <span className="text-ox-light italic">Three paths.</span>
              </h2>
              <p className="text-ox-light text-[14px] md:text-[16px] leading-[1.65] max-w-[400px]">
                A connected architecture for people, businesses and organizations moving toward what comes next.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 md:border-l border-cream/20 mt-10 md:mt-0">
              {[
                ["INDIVIDUALS", "Build, articulate and demonstrate extraordinary ability."],
                ["BUSINESSES", "Turn ambition into intelligent, scalable systems."],
                ["ORGANIZATIONS", "Transform capability, operations and how people work with AI."]
              ].map(([title, desc], i) => (
                <div key={title} className={`px-[10px] md:px-[25px] pb-8 md:pb-0 md:border-r border-cream/20 md:min-h-[240px] ${i > 0 ? "pt-8 md:pt-0 border-t border-cream/20 md:border-t-0" : ""}`}>
                  <svg viewBox="0 0 150 130" className="w-full h-[80px] md:h-[130px] mb-4">
                    <path d="M75 18L25 95M75 18L125 95M25 95L125 95" stroke="currentColor" className="text-ox-light" strokeWidth="0.8" fill="none" opacity="0.6"/>
                    <g transform="translate(75 18)" className="text-ox-light">
                      <path d="M0-10L3-3 10 0 3 3 0 10-3 3-10 0-3-3Z" fill="currentColor"/><circle r="2" fill="currentColor"/>
                    </g>
                    <circle cx="25" cy="95" r="5" fill="currentColor" className="text-ox-light"/>
                    <circle cx="125" cy="95" r="5" fill="currentColor" className="text-ox-light"/>
                  </svg>
                  <h3 className="font-serif text-[19px] md:text-[27px] mb-2">{title}</h3>
                  <p className="text-ox-light text-[11px] md:text-[13px] leading-[1.5]">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 03 AUTOMATION WITH SOUL */}
      <section className="py-[75px] md:py-[115px] min-h-[390px] md:min-h-[520px] flex items-center text-center">
        <div className="wrap w-full">
          <div className="eyebrow mb-4">03 · Operating philosophy</div>
          <h2 className="text-[58px] md:text-[clamp(54px,8vw,108px)] font-serif leading-none tracking-[-0.05em] mb-[18px]">
            Automation <span className="text-oxblood italic">with Soul.</span>
          </h2>
          <p className="font-serif italic text-[18px] md:text-[22px] max-w-[590px] mx-auto leading-[1.4] text-navy-mid">
            The future should become more intelligent without becoming less human.
          </p>
        </div>
      </section>

      {/* 04 PURPOSE · PROOF · PERMANENCE */}
      <section className="bg-paper py-[75px] md:py-[115px]">
        <div className="wrap grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-[6vw] items-center">
          <div>
            <div className="eyebrow mb-4">04 · Strategic framework</div>
            <h2 className="text-[40px] md:text-[clamp(40px,5vw,70px)] leading-[0.98] tracking-[-0.06em] mb-4">
              Purpose · Proof ·<br />
              <span className="text-oxblood italic">Permanence</span>
            </h2>
            <Triad className="w-[88%] max-w-[500px] text-navy-mid mt-8" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-[15px] mt-10 md:mt-0">
            {[
              ["PURPOSE", "Why are we transforming? What future are we building?"],
              ["PROOF", "How do we know the transformation is real? What evidence demonstrates progress and value?"],
              ["PERMANENCE", "Designing transformation so capability, knowledge and value remain after the intervention ends."]
            ].map(([title, desc]) => (
              <div key={title} className="border-t border-navy pt-[15px]">
                <b className="font-serif font-normal text-[21px] md:text-[27px] block mb-2">{title}</b>
                <p className="text-[11px] md:text-[13px] text-grey leading-[1.5]">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 05 FOR INDIVIDUALS */}
      <section className="py-[75px] md:py-[115px]">
        <div className="wrap">
          <div className="eyebrow mb-4">05 · For individuals</div>
          <h2 className="text-[40px] md:text-[clamp(40px,5vw,70px)] leading-[0.98] tracking-[-0.06em] mb-4">
            Explore. Assess.<br />
            <span className="text-oxblood italic">Receive your pathway.</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-[15px] mt-10 md:mt-[50px]">
            <div className="border-t border-navy pt-[15px]">
              <b className="font-serif font-normal text-[21px] md:text-[27px] block mb-2">01 · EXPLORE</b>
              <p className="text-[11px] md:text-[13px] text-navy-mid leading-[1.5] mb-4">Begin with paid self-directed Guides. Available now · 5 guides in Extraordinary Ability.</p>
              <Link href="/guides" className="link-under text-oxblood inline-block">Explore Guides</Link>
            </div>
            <div className="border-t border-navy pt-[15px]">
              <b className="font-serif font-normal text-[21px] md:text-[27px] block mb-2">02 · ASSESS</b>
              <p className="text-[11px] md:text-[13px] text-navy-mid leading-[1.5] mb-4">A private assessment of your current profile, evidence, readiness, gaps and potential pathway.</p>
              <a href="#assessment" className="link-under text-oxblood inline-block">Assess Your Profile</a>
              {/* // TODO: Connect to booking/contact flow */}
            </div>
            <div className="border-t border-navy pt-[15px]">
              <b className="font-serif font-normal text-[21px] md:text-[27px] block mb-2">03 · RECEIVE YOUR PATHWAY</b>
              <p className="text-[11px] md:text-[13px] text-navy-mid leading-[1.5]">AiVass recommends the right pathway after assessment. You do not self-select.</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row flex-wrap gap-8 md:gap-4 mt-12 md:mt-[55px]">
            {[
              ["AIVASS RISE", "An accelerated, intensive pathway for already-strong profiles ready to move quickly."],
              ["AIVASS SHINE", "A structured premium pathway for extraordinary-ability candidates needing deeper evidence architecture, sequencing, coaching and accountability."],
              ["AIVASS SIGNATURE", "A bespoke, long-horizon engagement for complex, highly individualized profiles requiring custom transformation architecture."]
            ].map(([title, desc]) => (
              <div key={title} className="flex-1 md:basis-[29%] border-t border-navy pt-[15px]">
                <b className="font-serif font-normal text-[21px] md:text-[27px] block mb-2">{title}</b>
                <p className="text-[11px] md:text-[13px] text-grey leading-[1.5] mb-4 h-auto md:min-h-[60px]">{desc}</p>
                <a href="#assessment" className="link-under text-oxblood inline-block">Start with an Assessment</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 06 FOR BUSINESSES */}
      <section className="bg-navy text-cream py-[75px] md:py-[115px]">
        <div className="wrap">
          <div className="eyebrow text-ox-light mb-4">06 · For businesses</div>
          <h2 className="text-[40px] md:text-[clamp(40px,5vw,70px)] leading-[0.98] tracking-[-0.06em] mb-4">
            From activity<br />
            <span className="text-oxblood italic">to architecture.</span>
          </h2>
          <p className="text-ox-light text-[14px] md:text-[16px] leading-[1.65] max-w-[500px]">
            AiVass helps businesses turn ambition into intelligent systems, coherent workflows and technology-enabled transformation.
          </p>
          <a href="#partnership" className="btn-outline-light mt-8">Discuss a Partnership</a>
        </div>
      </section>

      {/* 07 FOR ORGANIZATIONS */}
      <section className="bg-paper py-[75px] md:py-[115px]">
        <div className="wrap">
          <div className="eyebrow mb-4">07 · For organizations</div>
          <h2 className="text-[40px] md:text-[clamp(40px,5vw,70px)] leading-[0.98] tracking-[-0.06em] mb-4">
            Capability is the infrastructure<br />
            <span className="text-oxblood italic">behind transformation.</span>
          </h2>
          <p className="text-[14px] md:text-[16px] text-navy-mid leading-[1.65] max-w-[600px]">
            Enterprise-ready warmth. AI capability, workforce enablement, education, intelligent operating systems, program architecture, GTM/revenue enablement.
          </p>
          <a href="#partnership" className="btn mt-8">Discuss a Partnership</a>
        </div>
      </section>

      {/* 08 GUIDES FOR EXTRAORDINARY FUTURES */}
      <section className="py-[75px] md:py-[115px]">
        <div className="wrap">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-[45px]">
            <div>
              <div className="eyebrow mb-4">08 · Guides</div>
              <h2 className="text-[40px] md:text-[clamp(40px,5vw,70px)] leading-[0.98] tracking-[-0.06em] mb-4">
                Guides for<br />
                <span className="text-oxblood italic">Extraordinary Futures</span>
              </h2>
              <p className="text-[14px] md:text-[16px] text-navy-mid leading-[1.65] max-w-[500px]">
                Practical frameworks, templates and resources designed to turn complex journeys into clear next steps.
              </p>
            </div>
            <Link href="/guides" className="btn mt-5 md:mt-0">Explore Guides →</Link>
          </div>
          
          <div className="eyebrow mb-[18px]">EXTRAORDINARY ABILITY · Available now · 5 guides</div>
          
          <div className="flex md:grid md:grid-cols-5 gap-5 md:gap-4 overflow-x-auto pb-6 md:pb-0 snap-x">
            {[
              "aivass-guide-ability.png",
              "aivass-guide-ability_2.png",
              "aivass-guide-systems.png",
              "aivass-guide-systems_2.png",
              "aivass-guide-evidence.png"
            ].map((img, i) => (
              <article key={i} className="min-w-[245px] md:min-w-0 border-t border-navy pt-[18px] snap-center">
                <div className="h-[270px] md:h-[310px] bg-paper flex justify-center items-center overflow-hidden mb-4 border border-navy/5">
                  <img
                    src={`${import.meta.env.BASE_URL}images/${img}`}
                    alt="Extraordinary Ability guide cover"
                    className="w-[70%] h-full object-cover"
                    data-testid={`img-guide-cover-${i}`}
                  />
                </div>
                <div className="flex justify-between items-center text-[10px] tracking-[0.1em] uppercase">
                  <span>Extraordinary Ability</span>
                  <a href="#" className="btn !py-2 !px-3">View Guide</a>
                  {/* // TODO: REPLACE WITH STRIPE/BOOKING URL */}
                </div>
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

      {/* 09 INSIGHTS */}
      <section className="bg-paper py-[75px] md:py-[115px]">
        <div className="wrap">
          <div className="eyebrow mb-4">09 · Free insights</div>
          <h2 className="text-[40px] md:text-[clamp(40px,5vw,70px)] leading-[0.98] tracking-[-0.06em] mb-12">
            Ideas for building<br />
            <span className="text-oxblood italic">what comes next.</span>
          </h2>
          
          <div className="flex flex-col md:flex-row gap-8 md:gap-[25px]">
            <article className="flex-1 border-t border-navy pt-[15px] group">
              <div className="float-left w-[140px] h-[190px] mr-5 bg-cream border border-navy/10 overflow-hidden">
                <img
                  src={`${import.meta.env.BASE_URL}images/aivass-insight-cover.png`}
                  alt="The Strategist cover"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <small className="text-[10px] tracking-[0.1em] uppercase text-oxblood block mb-2">THE STRATEGIST · FREE</small>
              <h3 className="font-serif text-[24px] mb-2">The Strategist</h3>
              <p className="text-[12px] text-grey leading-[1.4] max-w-[200px]">Thought leadership for people making meaningful change.</p>
            </article>
            
            <article className="flex-1 border-t border-navy pt-[15px] group">
              <div className="float-left w-[140px] h-[190px] mr-5 bg-cream border border-navy/10 overflow-hidden">
                <img
                  src={`${import.meta.env.BASE_URL}images/aivass-insight-cover_2.png`}
                  alt="Field Notes cover"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <small className="text-[10px] tracking-[0.1em] uppercase text-oxblood block mb-2">FIELD NOTES · FREE</small>
              <h3 className="font-serif text-[24px] mb-2">Field Notes</h3>
              <p className="text-[12px] text-grey leading-[1.4] max-w-[200px]">Observations from the edge of transformation.</p>
            </article>
          </div>
          
          <Link href="/insights" className="btn mt-10 md:mt-[35px]">Explore Insights</Link>
        </div>
      </section>

      {/* 10 FOUNDER */}
      <section className="py-[75px] md:py-[115px]">
        <div className="wrap grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-[6vw] items-center">
          <div>
            <div className="eyebrow mb-4">10 · Founder</div>
            <blockquote className="font-serif italic text-[29px] md:text-[34px] leading-[1.15]">
              “Build the capability to meet the future with clarity.”
            </blockquote>
          </div>
          <div>
            <p className="leading-[1.7] text-navy-mid md:text-grey max-w-[550px] text-[16px] mb-6">
              AiVass is a boutique technology-enabled transformation studio working at the intersection of intelligent systems, strategy and human potential.
            </p>
            <p className="text-[11px] text-grey leading-[1.5] max-w-[400px]">
              AiVass provides strategic, educational, organizational, coaching and project-management support. Not legal advice or representation.
            </p>
          </div>
        </div>
      </section>

      {/* 11 FINAL CTA */}
      <section className="bg-navy text-cream py-[85px] md:py-[125px] text-center px-[23px] md:px-[6vw]">
        <div className="eyebrow text-ox-light mb-4">11 · Begin here</div>
        <h2 className="font-serif text-[50px] md:text-[clamp(50px,7vw,88px)] leading-[0.98] tracking-[-0.06em] mt-[15px] mb-[45px]">
          What future<br />
          are you building?
        </h2>
        <div className="flex justify-center mb-[45px]">
          <Triad className="w-[88%] max-w-[260px] text-ox-light" />
        </div>
        <div className="flex flex-col md:flex-row justify-center gap-6 md:gap-[35px] text-ox-light text-[11px] tracking-[0.13em] uppercase">
          <Link href="/solutions" className="hover:text-cream transition-colors">For myself</Link>
          <Link href="/solutions" className="hover:text-cream transition-colors">For my business</Link>
          <Link href="/solutions" className="hover:text-cream transition-colors">For my organization</Link>
        </div>
      </section>
    </div>
  );
}
