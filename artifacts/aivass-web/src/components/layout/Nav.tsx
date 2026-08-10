import { useState } from "react";
import { Link } from "wouter";

export function Nav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-navy/10 bg-cream">
      <div className="wrap h-[106px] md:h-[82px] py-3.5 md:py-0 grid md:flex grid-cols-1 items-start md:items-center justify-between gap-3 md:gap-0">
        <Link href="/" className="font-serif font-medium text-2xl md:text-[26px] tracking-[-0.06em] flex items-center shrink-0 w-max" data-testid="link-home">
          AiVass
          <span className="inline-block w-[7px] h-[7px] bg-oxblood rotate-45 ml-1" />
        </Link>
        
        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden absolute top-4 right-[6vw] text-[11px] tracking-[0.16em] uppercase text-navy"
          onClick={() => setIsOpen(!isOpen)}
          data-testid="button-menu"
        >
          {isOpen ? "Close" : "Menu"}
        </button>

        {/* Links + CTA */}
        <nav 
          className={`${
            isOpen ? "flex" : "hidden"
          } md:flex flex-row flex-wrap md:flex-nowrap items-start md:items-center gap-x-[13px] gap-y-[9px] md:gap-7 text-[9px] md:text-[11px] tracking-[0.08em] md:tracking-[0.1em] uppercase bg-transparent md:bg-transparent`}
        >
          <Link href="/solutions" className="whitespace-nowrap hover:text-oxblood transition-colors" onClick={() => setIsOpen(false)}>Solutions</Link>
          <Link href="/guides" className="whitespace-nowrap hover:text-oxblood transition-colors" onClick={() => setIsOpen(false)}>Guides</Link>
          <Link href="/insights" className="whitespace-nowrap hover:text-oxblood transition-colors" onClick={() => setIsOpen(false)}>Insights</Link>
          <Link href="/about" className="whitespace-nowrap hover:text-oxblood transition-colors" onClick={() => setIsOpen(false)}>About</Link>
          <Link href="/contact" className="whitespace-nowrap hover:text-oxblood transition-colors" onClick={() => setIsOpen(false)}>Contact</Link>
          
          <Link href="/contact" className="btn-outline basis-full md:basis-auto mt-2 md:mt-0 text-[8px] md:text-[10px] px-2.5 md:px-5 py-2 md:py-3.5 w-max md:w-auto" onClick={() => setIsOpen(false)}>
            Start a Conversation
          </Link>
        </nav>
      </div>
    </header>
  );
}
