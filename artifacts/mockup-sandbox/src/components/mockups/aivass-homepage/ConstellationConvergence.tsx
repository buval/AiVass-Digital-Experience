import { useState } from "react";
import "./constellation-convergence.css";

type StarProps = { className?: string; label: string };

function Star({ className = "", label }: StarProps) {
  return (
    <g className={className} aria-label={label}>
      <path d="M0-12 L2.7-2.7 L12 0 L2.7 2.7 L0 12 L-2.7 2.7 L-12 0 L-2.7-2.7 Z" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="0" cy="0" r="2" fill="currentColor" />
    </g>
  );
}

export function ConstellationConvergence() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notice, setNotice] = useState("");

  const engage = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3200);
  };

  return (
    <main className="aivass-constellation relative min-h-[100dvh] overflow-hidden bg-[#F7F3E9] text-[#12233F]">
      <div className="paper-grain absolute inset-0 opacity-40" />
      <nav className="relative z-20 mx-auto flex max-w-[1440px] items-center justify-between px-6 py-6 sm:px-10 lg:px-[5.5vw] lg:py-8" aria-label="Main navigation">
        <button onClick={() => engage("AiVass — Automation with Soul.")} className="group flex items-center gap-3 text-left" aria-label="AiVass home">
          <svg viewBox="0 0 28 28" className="h-7 w-7 text-[#7E3033]" aria-hidden="true"><path d="M14 1.5 16.6 11.4 26.5 14l-9.9 2.6L14 26.5l-2.6-9.9L1.5 14l9.9-2.6Z" fill="none" stroke="currentColor" strokeWidth="1.25"/><circle cx="14" cy="14" r="2" fill="currentColor"/></svg>
          <span className="font-['DM_Sans'] text-[15px] font-medium tracking-[.22em]">AiVass</span>
        </button>
        <div className="hidden items-center gap-8 md:flex">
          {["Solutions", "Insights", "About", "Contact"].map((item) => <button key={item} onClick={() => engage(`${item} — coming into focus.`)} className="font-['DM_Sans'] text-[11px] uppercase tracking-[.16em] text-[#5F6673] transition-colors hover:text-[#7E3033]">{item}</button>)}
          <button onClick={() => engage("We look forward to hearing what comes next.")} className="border border-[#12233F] px-5 py-3 font-['DM_Sans'] text-[10px] uppercase tracking-[.15em] transition-colors hover:bg-[#12233F] hover:text-[#F7F3E9]">Start a Conversation</button>
        </div>
        <button className="flex items-center gap-2 md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label="Toggle navigation">
          <span className="font-['DM_Sans'] text-[10px] uppercase tracking-[.16em]">Menu</span><span className="text-xl leading-none">{menuOpen ? "×" : "—"}</span>
        </button>
        {menuOpen && <div className="absolute left-6 right-6 top-[76px] border border-[#12233F]/15 bg-[#FDFBF6] p-6 shadow-[0_18px_45px_rgba(18,35,63,.08)] md:hidden">{["Solutions", "Insights", "About", "Contact", "Start a Conversation"].map(item => <button key={item} onClick={() => { setMenuOpen(false); engage(item); }} className="block w-full border-b border-[#12233F]/10 py-3 text-left font-['DM_Sans'] text-[11px] uppercase tracking-[.16em] last:border-0">{item}</button>)}</div>}
      </nav>

      <section className="relative z-10 mx-auto grid min-h-[700px] max-w-[1440px] grid-cols-1 items-center px-6 pb-14 pt-4 sm:px-10 lg:grid-cols-[.9fr_1.1fr] lg:px-[5.5vw] lg:pb-24 lg:pt-2">
        <div className="order-2 max-w-[480px] lg:order-1 lg:pb-8">
          <p className="mb-8 flex items-center gap-3 font-['DM_Sans'] text-[10px] uppercase tracking-[.22em] text-[#7E3033]"><span className="h-px w-10 bg-[#7E3033]" />Transformation architecture</p>
          <h1 className="font-['Playfair_Display'] text-[clamp(3.6rem,7.8vw,7.3rem)] font-normal leading-[.88] tracking-[-.065em]">Building<br /><em className="ml-[.22em] text-[#7E3033]">extraordinary</em><br />futures.</h1>
          <div className="mt-10 max-w-[395px] border-t border-[#12233F]/20 pt-5">
            <p className="font-['DM_Sans'] text-[14px] leading-[1.7] text-[#5F6673]">A boutique transformation studio where intelligent systems, human connection and strategic architecture come together to build what comes next.</p>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-5">
            <button onClick={() => engage("Explore AiVass — your next chapter starts here.")} className="bg-[#12233F] px-6 py-4 font-['DM_Sans'] text-[10px] uppercase tracking-[.17em] text-[#F7F3E9] transition-transform hover:-translate-y-0.5">Explore AiVass <span className="ml-5 text-[#D9A39B]">↗</span></button>
            <button onClick={() => engage("Find Your Path — Individuals, Businesses, Organizations.")} className="font-['DM_Sans'] text-[10px] uppercase tracking-[.17em] text-[#12233F] underline decoration-[#D9A39B] underline-offset-8">Find Your Path</button>
          </div>
        </div>

        <div className="order-1 flex min-h-[330px] items-center justify-center lg:order-2 lg:min-h-[590px]">
          <div className="relative w-full max-w-[650px]">
            <div className="absolute left-1/2 top-1/2 h-[min(56vw,460px)] w-[min(56vw,460px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#12233F]/10" />
            <div className="absolute left-1/2 top-1/2 h-[min(40vw,320px)] w-[min(40vw,320px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#12233F]/10" />
            <svg viewBox="0 0 600 500" className="relative h-auto w-full overflow-visible text-[#12233F]" role="img" aria-label="Three connected stars forming the AiVass triad">
              <path className="triad-lines" d="M300 106 L174 354 L426 354 Z" fill="none" stroke="currentColor" strokeWidth="1" />
              <path d="M300 106 L300 440 M174 354 L125 395 M426 354 L475 395" fill="none" stroke="currentColor" strokeWidth=".65" strokeDasharray="2 8" opacity=".35" />
              <g transform="translate(300 106)"><g className="node-top"><Star label="Strategic possibility" /></g></g>
              <g transform="translate(174 354)"><g className="node-left"><Star label="Individuals" /></g></g>
              <g transform="translate(426 354)"><g className="node-right"><Star label="Businesses" /></g></g>
              <circle cx="300" cy="271" r="3" fill="#7E3033" opacity=".8" />
              <circle cx="300" cy="271" r="30" fill="none" stroke="#7E3033" strokeWidth=".7" opacity=".3" />
            </svg>
            <div className="wordmark-reveal absolute left-1/2 top-[43%] -translate-x-1/2 text-center">
              <div className="font-['Playfair_Display'] text-[30px] tracking-[-.04em]">AiVass</div>
              <div className="mt-1 whitespace-nowrap font-['DM_Sans'] text-[8px] uppercase tracking-[.28em] text-[#5F6673]">Automation with Soul.</div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 border-t border-[#12233F]/15 bg-[#12233F] px-6 py-8 text-[#F7F3E9] sm:px-10 lg:px-[5.5vw] lg:py-10">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-7 md:flex-row md:items-center md:justify-between">
          <div><p className="font-['DM_Sans'] text-[9px] uppercase tracking-[.25em] text-[#D9A39B]">Where possibility takes shape</p><p className="mt-2 font-['Playfair_Display'] text-2xl italic">Three paths. One extraordinary future.</p></div>
          <div className="flex gap-0 border-l border-[#D9A39B]/40 pl-5 sm:gap-8"><span className="font-['DM_Sans'] text-[10px] uppercase tracking-[.16em] text-[#F7F3E9]/70">Individuals</span><span className="hidden text-[#D9A39B] sm:inline">/</span><span className="font-['DM_Sans'] text-[10px] uppercase tracking-[.16em] text-[#F7F3E9]/70">Businesses</span><span className="hidden text-[#D9A39B] sm:inline">/</span><span className="font-['DM_Sans'] text-[10px] uppercase tracking-[.16em] text-[#F7F3E9]/70">Organizations</span></div>
          <button onClick={() => engage("Choose the path that meets you where you are.")} className="self-start font-['DM_Sans'] text-[10px] uppercase tracking-[.17em] text-[#D9A39B] md:self-auto">Discover your path <span className="ml-2">↓</span></button>
        </div>
      </section>
      {notice && <div role="status" className="fixed bottom-5 left-1/2 z-30 -translate-x-1/2 bg-[#7E3033] px-5 py-3 font-['DM_Sans'] text-[11px] tracking-[.04em] text-[#F7F3E9] shadow-lg">{notice}</div>}
    </main>
  );
}

export default ConstellationConvergence;