import { Link } from "wouter";

export default function Guides() {
  const guides = [
    { title: "Ability", category: "Extraordinary Ability", image: "/images/aivass-guide-ability.png" },
    { title: "Ability 2", category: "Extraordinary Ability", image: "/images/aivass-guide-ability_2.png" },
    { title: "Systems", category: "Extraordinary Ability", image: "/images/aivass-guide-systems.png" },
    { title: "Systems 2", category: "Extraordinary Ability", image: "/images/aivass-guide-systems_2.png" },
    { title: "Evidence", category: "Extraordinary Ability", image: "/images/aivass-guide-evidence.png" }
  ];

  return (
    <div className="bg-cream min-h-screen pt-[60px] pb-[100px]">
      <div className="wrap">
        <div className="grid md:grid-cols-[1fr_auto] items-end mb-16 gap-8">
          <div>
            <div className="eyebrow mb-6">Storefront</div>
            <h1 className="text-[50px] md:text-[80px] font-serif leading-none tracking-[-0.05em] mb-6">
              Guides for<br />
              <em className="text-oxblood italic">Extraordinary Futures</em>
            </h1>
            <p className="text-[16px] text-navy-mid max-w-[500px] leading-[1.65]">
              Practical frameworks, templates and resources designed to turn complex journeys into clear next steps.
            </p>
          </div>
        </div>

        <div className="eyebrow mb-[18px]">EXTRAORDINARY ABILITY · Available now · 5 guides</div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-12">
          {guides.map((guide, i) => (
            <article key={i} className="border-t border-navy pt-[18px]">
              <div className="h-[350px] md:h-[400px] bg-paper flex justify-center items-center overflow-hidden mb-5 border border-navy/5">
                <div className="w-[70%] h-[90%] bg-cream border border-navy/10 relative shadow-sm flex items-center justify-center font-serif text-navy/20 italic text-center p-4">
                  Guide Document
                </div>
              </div>
              <div className="flex justify-between items-center text-[10px] tracking-[0.1em] uppercase">
                <span>{guide.category}</span>
                <a href="#" className="btn !py-2 !px-3 hover:bg-navy hover:text-cream">View Guide</a>
                {/* // TODO: REPLACE WITH STRIPE/BOOKING URL */}
              </div>
            </article>
          ))}
        </div>

        <div className="mt-20 border-t border-navy/20 pt-16 text-center">
          <p className="font-serif text-[28px] flex flex-col items-center gap-3">
            <span className="text-navy">CAREER & EVIDENCE</span>
            <small className="font-sans text-[11px] tracking-[0.15em] text-oxblood uppercase block">COMING NEXT</small>
          </p>
          <p className="text-[13px] text-grey mt-4 max-w-[300px] mx-auto mb-8">
            New guides added regularly. Subscribe to be notified when the next collection drops.
          </p>
          <div className="flex justify-center">
            <a href="#subscribe" className="btn-outline">Subscribe</a>
          </div>
        </div>
      </div>
    </div>
  );
}
