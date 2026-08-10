import { useState } from "react";
import { Link } from "wouter";
import { trackStartConversation } from "@/lib/analytics";

const NAV_LINKS = [
  { label: "Solutions", href: "/solutions" },
  { label: "Guides",    href: "/guides" },
  { label: "Insights",  href: "/insights" },
  { label: "About",     href: "/about" },
  { label: "Connect",   href: "/contact" },
];

export function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const close = () => setIsOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-cream border-b border-navy/10">
      {/* ── Main bar ── */}
      <div className="wrap h-[64px] md:h-[82px] flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="font-serif font-medium text-[22px] md:text-[26px] tracking-[-0.06em] flex items-center shrink-0"
          onClick={close}
          data-testid="link-home"
        >
          AiVass
          <span className="inline-block w-[7px] h-[7px] bg-oxblood rotate-45 ml-1" />
        </Link>

        {/* Desktop nav */}
        <nav
          className="hidden md:flex items-center gap-7 text-[11px] tracking-[0.1em] uppercase"
          aria-label="Main navigation"
        >
          {NAV_LINKS.map(({ label, href }) => (
            <Link key={label} href={href} className="whitespace-nowrap hover:text-oxblood transition-colors">
              {label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="btn-outline text-[10px] px-5 py-3.5 whitespace-nowrap"
            onClick={trackStartConversation}
            aria-label="Start a conversation with AiVass"
          >
            Start a Conversation
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-[11px] tracking-[0.16em] uppercase text-navy py-2 pl-4"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          data-testid="button-menu"
        >
          {isOpen ? "Close" : "Menu"}
        </button>
      </div>

      {/* ── Mobile dropdown ── */}
      {isOpen && (
        <div className="md:hidden border-t border-navy/10 bg-cream">
          <nav
            className="wrap py-5 flex flex-col gap-4 text-[11px] tracking-[0.12em] uppercase"
            aria-label="Mobile navigation"
          >
            {NAV_LINKS.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="whitespace-nowrap hover:text-oxblood transition-colors py-1"
                onClick={close}
              >
                {label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="btn-outline self-start mt-1 text-[10px] px-5 py-3"
              onClick={() => { close(); trackStartConversation(); }}
              aria-label="Start a conversation with AiVass"
            >
              Start a Conversation
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
