export default function Insights() {
  return (
    <div className="bg-paper min-h-screen pt-[60px] pb-[100px]">
      <div className="wrap">
        <div className="eyebrow mb-6">Editorial</div>
        <h1 className="text-[50px] md:text-[80px] font-serif leading-none tracking-[-0.05em] mb-6">
          Ideas for building<br />
          <em className="text-oxblood italic">what comes next.</em>
        </h1>
        <p className="text-[16px] text-navy-mid max-w-[500px] leading-[1.65] mb-16">
          Free thought leadership for people making meaningful change.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-[6vw]">
          <article className="border-t border-navy pt-[20px] group cursor-pointer">
            <div className="aspect-[4/3] w-full bg-cream mb-6 border border-navy/10 flex items-center justify-center overflow-hidden">
              <div className="font-serif italic text-navy/20 text-xl group-hover:scale-105 transition-transform duration-700">
                The Strategist
              </div>
            </div>
            <small className="text-[11px] tracking-[0.1em] uppercase text-oxblood block mb-3">THE STRATEGIST · FREE</small>
            <h3 className="font-serif text-[32px] mb-4">The Strategist</h3>
            <p className="text-[14px] text-grey leading-[1.6] max-w-[400px] mb-6">
              Long-form essays, architectural breakdowns, and strategic frameworks for individuals and organizations navigating complex transformations.
            </p>
            <span className="link-under text-oxblood inline-block">Read Latest Issue</span>
          </article>

          <article className="border-t border-navy pt-[20px] group cursor-pointer">
            <div className="aspect-[4/3] w-full bg-cream mb-6 border border-navy/10 flex items-center justify-center overflow-hidden">
              <div className="font-serif italic text-navy/20 text-xl group-hover:scale-105 transition-transform duration-700">
                Field Notes
              </div>
            </div>
            <small className="text-[11px] tracking-[0.1em] uppercase text-oxblood block mb-3">FIELD NOTES · FREE</small>
            <h3 className="font-serif text-[32px] mb-4">Field Notes</h3>
            <p className="text-[14px] text-grey leading-[1.6] max-w-[400px] mb-6">
              Shorter observations, tactical lessons, and emerging patterns from our work architecting technology-enabled futures.
            </p>
            <span className="link-under text-oxblood inline-block">Explore Notes</span>
          </article>
        </div>
      </div>
    </div>
  );
}
