import { Link } from "wouter";
import { Triad } from "@/components/brand/Triad";
import { TriadHero } from "@/components/brand/TriadHero";
import { GUIDES, guideCheckoutUrl } from "@/data/guides";
import { ARTICLES } from "@/data/articles";
import { STRATEGIC_ASSESSMENT_URL } from "@/config/booking";

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
            <a href="#three-paths" className="link-under">Find Your Path ↗</a>
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
      <section id="three-paths" className="bg-navy text-cream pt-[65px] pb-[60px] md:py-[95px] scroll-mt-20">
        <div className="wrap">
          <div className="eyebrow text-ox-light mb-8">02 · Three transformation paths</div>
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.1fr] gap-10 md:gap-[8vw] items-center">
            <div>
              <h2 className="text-[40px] md:text-[clamp(40px,5vw,70px)] leading-[0.98] tracking-[-0.06em] mb-4">
                One house.<br />
                <span className="text-ox-light italic">Three paths.</span>
              </h2>
              <p className="text-ox-light text-[14px] md:text-[16px] leading-[1.65] max-w-[400px]">
                A connected architecture for people, businesses and organizations moving toward what comes next.
              </p>
            </div>

            {/* Single shared architecture — one Triad, three labeled nodes */}
            <div className="flex flex-col items-center">
              <svg viewBox="0 0 480 360" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[480px]">
                {/* connecting lines */}
                <line x1="240" y1="60" x2="60" y2="290" stroke="#D9A39B" strokeWidth="0.8" opacity="0.5"/>
                <line x1="240" y1="60" x2="420" y2="290" stroke="#D9A39B" strokeWidth="0.8" opacity="0.5"/>
                <line x1="60" y1="290" x2="420" y2="290" stroke="#D9A39B" strokeWidth="0.8" opacity="0.5"/>

                {/* top node — INDIVIDUALS */}
                <path d="M240 46 L243.5 56.5 L254 60 L243.5 63.5 L240 74 L236.5 63.5 L226 60 L236.5 56.5Z" fill="#D9A39B"/>
                <text x="240" y="42" textAnchor="middle" fontFamily="DM Sans, sans-serif" fontSize="9" letterSpacing="2" fill="#D9A39B" opacity="0.9" fontWeight="400">INDIVIDUALS</text>

                {/* bottom-left node — BUSINESSES */}
                <path d="M60 276 L63.5 286.5 L74 290 L63.5 293.5 L60 304 L56.5 293.5 L46 290 L56.5 286.5Z" fill="#D9A39B"/>
                <text x="60" y="320" textAnchor="middle" fontFamily="DM Sans, sans-serif" fontSize="9" letterSpacing="2" fill="#D9A39B" opacity="0.9" fontWeight="400">BUSINESSES</text>

                {/* bottom-right node — ORGANIZATIONS */}
                <path d="M420 276 L423.5 286.5 L434 290 L423.5 293.5 L420 304 L416.5 293.5 L406 290 L416.5 286.5Z" fill="#D9A39B"/>
                <text x="420" y="320" textAnchor="middle" fontFamily="DM Sans, sans-serif" fontSize="9" letterSpacing="2" fill="#D9A39B" opacity="0.9" fontWeight="400">ORGANIZATIONS</text>
              </svg>

              {/* three path descriptions below the shared diagram */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-[10px] w-full mt-8 md:mt-4">
                {[
                  ["INDIVIDUALS", "Build, articulate and demonstrate extraordinary ability.", "/solutions/individuals"],
                  ["BUSINESSES", "Turn ambition into intelligent, scalable systems.", "/solutions/businesses"],
                  ["ORGANIZATIONS", "Transform capability, operations and how people work with AI.", "/solutions/organizations"]
                ].map(([title, desc, path], i) => (
                  <Link href={path} key={title} className={`group block border-t border-cream/20 pt-[12px] hover:bg-white/5 transition-colors ${i > 0 ? "md:border-l md:border-t-0 md:pl-[14px] border-t pt-[12px] md:pt-0" : ""}`}>
                    <h3 className="font-serif text-[16px] md:text-[18px] mb-1 group-hover:text-ox-light transition-colors">{title}</h3>
                    <p className="text-ox-light text-[11px] md:text-[12px] leading-[1.5] opacity-80 group-hover:opacity-100 transition-opacity">{desc}</p>
                  </Link>
                ))}
              </div>
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
        <div className="wrap">
          <div className="eyebrow mb-4">04 · Strategic framework</div>
          <h2 className="text-[40px] md:text-[clamp(40px,5vw,70px)] leading-[0.98] tracking-[-0.06em] mb-[50px] md:mb-[70px]">
            Purpose · Proof ·<br />
            <span className="text-oxblood italic">Permanence</span>
          </h2>
          {/* Editorial three-part architecture — star nodes + fine rules */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
            {[
              {
                label: "PURPOSE",
                body: "Why are we transforming? What future are we building?",
              },
              {
                label: "PROOF",
                body: "How do we know the transformation is real? What evidence demonstrates progress and value?",
              },
              {
                label: "PERMANENCE",
                body: "Designing transformation so capability, knowledge and value remain after the intervention ends.",
              },
            ].map(({ label, body }, i) => (
              <div key={label} className={`pt-[20px] pb-[40px] md:pb-0 md:pr-[40px] ${i > 0 ? "md:pl-[40px] md:border-l border-navy/15 border-t md:border-t-0 pt-[28px] md:pt-[20px]" : ""}`}>
                {/* Star node */}
                <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] mb-4 text-oxblood" fill="currentColor">
                  <path d="M12 2 L13.5 10.5 L22 12 L13.5 13.5 L12 22 L10.5 13.5 L2 12 L10.5 10.5Z"/>
                </svg>
                <b className="font-serif font-normal text-[24px] md:text-[30px] block mb-3 tracking-[-0.03em]">{label}</b>
                <p className="text-[13px] md:text-[14px] text-grey leading-[1.6]">{body}</p>
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
              <a href={STRATEGIC_ASSESSMENT_URL} target="_blank" rel="noopener noreferrer" className="link-under text-oxblood inline-block">Assess Your Profile</a>
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
              ["AIVASS SIGNATURE", "A bespoke, long-horizon engagement for complex, highly individualized profiles requiring custom architecture."]
            ].map(([title, desc]) => (
              <div key={title} className="flex-1 md:basis-[29%] border-t border-navy pt-[15px]">
                <b className="font-serif font-normal text-[21px] md:text-[27px] block mb-2">{title}</b>
                <p className="text-[11px] md:text-[13px] text-grey leading-[1.5] mb-4 h-auto md:min-h-[60px]">{desc}</p>
                <a href={STRATEGIC_ASSESSMENT_URL} target="_blank" rel="noopener noreferrer" className="link-under text-oxblood inline-block">Start with an Assessment</a>
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
            <span className="text-ox-light italic">to architecture.</span>
          </h2>
          <p className="text-ox-light text-[14px] md:text-[16px] leading-[1.65] max-w-[500px]">
            AiVass helps businesses turn ambition into intelligent systems, coherent workflows and technology-enabled transformation.
          </p>
          <a href="mailto:contact@aivass.com" className="btn-outline-light mt-8">Discuss a Partnership</a>
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
          <a href="mailto:contact@aivass.com" className="btn mt-8">Discuss a Partnership</a>
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
          
          <div className="eyebrow mb-[18px]">EXTRAORDINARY ABILITY · Available now · 6 guides</div>
          
          <div className="flex md:grid md:grid-cols-5 gap-5 md:gap-4 overflow-x-auto pb-6 md:pb-0 snap-x">
            {GUIDES.slice(0, 5).map((guide, i) => {
              // Map slug to cover image based on prompt mapping
              const coverMap: Record<string, string> = {
                "eb1a-master": "aivass-guide-ability.png",
                "eb1a-business": "aivass-guide-ability_2.png",
                "eb1a-arts": "aivass-guide-systems.png",
                "eb1a-athletics": "aivass-guide-systems_2.png",
                "eb1a-education": "aivass-guide-evidence.png",
                "eb1a-science": "aivass-guide-evidence_2.png"
              };
              
              // Fallback to evidence_2 or evidence if missing
              const coverImg = coverMap[guide.slug] || "aivass-guide-evidence.png";

              return (
                <article key={guide.id} className="min-w-[245px] md:min-w-0 border-t border-navy pt-[18px] snap-center">
                  <div className="h-[270px] md:h-[310px] bg-paper flex justify-center items-center overflow-hidden mb-4 border border-navy/5">
                    <img
                      src={`${import.meta.env.BASE_URL}images/${coverImg}`}
                      onError={(e) => { (e.target as HTMLImageElement).src = `${import.meta.env.BASE_URL}images/aivass-guide-evidence.png`; }}
                      alt={`${guide.name} cover`}
                      className="w-[70%] h-[90%] object-cover shadow-sm border border-navy/10"
                      data-testid={`img-guide-cover-${i}`}
                    />
                  </div>
                  <div className="flex flex-col gap-3">
                    <span className="font-serif text-[16px] leading-[1.2]">{guide.name}</span>
                    <div className="flex justify-between items-center text-[10px] tracking-[0.1em] uppercase">
                      <span className="text-grey">{guide.category}</span>
                      <a href={guideCheckoutUrl(guide.slug)} target="_blank" rel="noopener noreferrer" className="btn !py-2 !px-3">Purchase →</a>
                      {/* // TODO: Migrate checkout to new build */}
                    </div>
                  </div>
                </article>
              );
            })}
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
            {/* THE STRATEGIST */}
            <article className="flex-1 bg-navy text-ox-light p-6 md:p-8 flex flex-col justify-between min-h-[300px] border border-navy shadow-sm group">
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
              <Link href="/insights" className="link-under text-ox-light inline-block w-max border-ox-light hover:text-cream hover:border-cream mt-6">Explore →</Link>
            </article>

            {/* ARTICLES */}
            <article className="flex-1 bg-paper p-6 md:p-8 flex flex-col justify-between min-h-[300px] border border-navy/10 group">
              <div>
                <small className="text-[10px] tracking-[0.1em] uppercase text-oxblood block mb-6">ARTICLES · ANALYSIS & STRATEGY</small>
                <ul className="flex flex-col gap-6">
                  {ARTICLES.slice(0, 2).map((a) => (
                    <li key={a.id}>
                      <Link href={`/articles/${a.slug}`} className="group-hover/item text-navy">
                        <h4 className="font-serif text-[18px] leading-[1.2] mb-1 group-hover/item:text-oxblood transition-colors">{a.title}</h4>
                        <span className="text-[11px] text-grey">{a.author} · {new Date(a.publishedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric'})}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <Link href="/articles" className="link-under text-oxblood inline-block w-max mt-6">Read All Articles →</Link>
            </article>
            
            {/* FIELD NOTES */}
            <article className="flex-1 bg-cream p-6 md:p-8 flex flex-col justify-between min-h-[300px] border border-navy/10 relative overflow-hidden group">
              <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(transparent_95%,_#12233f_95%)] bg-[length:100%_20px]" />
              <div className="relative z-10">
                <small className="text-[10px] tracking-[0.1em] uppercase text-oxblood block mb-6">FIELD NOTES · SHORT OBSERVATIONS</small>
                <div className="mb-4">
                  <h3 className="font-serif text-[24px] mb-2">{ARTICLES[0].title}</h3>
                  <p className="text-[13px] text-navy-mid leading-[1.5] italic">
                    "{ARTICLES[0].excerpt}"
                  </p>
                </div>
              </div>
              <Link href="/insights" className="link-under text-oxblood inline-block w-max relative z-10 mt-6">Explore Notes →</Link>
            </article>
          </div>
          
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
          <Link href="/solutions/individuals" className="hover:text-cream transition-colors">For myself</Link>
          <Link href="/solutions/businesses" className="hover:text-cream transition-colors">For my business</Link>
          <Link href="/solutions/organizations" className="hover:text-cream transition-colors">For my organization</Link>
        </div>
      </section>
    </div>
  );
}
