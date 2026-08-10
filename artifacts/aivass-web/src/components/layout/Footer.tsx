import { Link } from "wouter";
import { Linkedin, Instagram, Facebook, Youtube, Twitter } from "lucide-react";
import { trackSocialClick } from "@/lib/analytics";

export function Footer() {
  return (
    <footer className="bg-navy text-cream pt-9 pb-9 md:pt-[35px] md:pb-[35px] border-t border-cream/30 text-[11px]">
      <div className="wrap flex flex-col md:flex-row justify-between gap-8 md:gap-0">
        <div>
          <Link href="/" className="font-serif text-2xl md:text-[26px] tracking-[-0.06em] flex items-center mb-1" aria-label="AiVass home">
            AiVass
            <span className="inline-block w-[7px] h-[7px] bg-oxblood rotate-45 ml-1" />
          </Link>
          <div className="text-[10px] tracking-[0.15em] text-ox-light uppercase mt-2">
            BUILDING EXTRAORDINARY FUTURES
          </div>
        </div>

        <nav aria-label="Footer navigation" className="flex flex-col md:flex-row flex-wrap gap-4 md:gap-[22px] tracking-[0.1em] uppercase">
          <Link href="/solutions" className="hover:text-ox-light transition-colors">Solutions</Link>
          <Link href="/guides" className="hover:text-ox-light transition-colors">Guides</Link>
          <Link href="/insights" className="hover:text-ox-light transition-colors">Insights</Link>
          <Link href="/about" className="hover:text-ox-light transition-colors">About</Link>
          <Link href="/contact" className="hover:text-ox-light transition-colors">Contact</Link>
          <Link href="/contact" className="hover:text-ox-light transition-colors">Discuss a Partnership</Link>
          <Link href="/legal" className="hover:text-ox-light transition-colors" onClick={() => window.scrollTo(0, 0)}>Legal</Link>
          <Link href="/privacy" className="hover:text-ox-light transition-colors" onClick={() => window.scrollTo(0, 0)}>Privacy</Link>
        </nav>
      </div>

      <div className="wrap flex flex-col md:flex-row justify-between items-start md:items-center mt-8 md:mt-[35px] pt-8 border-t border-cream/10 text-ox-light">
        <p className="max-w-[300px] md:max-w-none mb-6 md:mb-0">
          AiVass provides strategic, educational and coaching support. Not legal advice or representation.
        </p>

        <div className="flex items-center gap-4 text-sm" aria-label="Social media links">
          <a
            href="https://www.linkedin.com/company/aivass"
            target="_blank" rel="noopener noreferrer"
            aria-label="AiVass on LinkedIn"
            className="hover:text-cream transition-colors"
            onClick={() => trackSocialClick("linkedin")}
          ><Linkedin size={16} /></a>
          <a
            href="https://www.instagram.com/aiva.ss/"
            target="_blank" rel="noopener noreferrer"
            aria-label="AiVass on Instagram"
            className="hover:text-cream transition-colors"
            onClick={() => trackSocialClick("instagram")}
          ><Instagram size={16} /></a>
          <a
            href="https://www.facebook.com/AiVass"
            target="_blank" rel="noopener noreferrer"
            aria-label="AiVass on Facebook"
            className="hover:text-cream transition-colors"
            onClick={() => trackSocialClick("facebook")}
          ><Facebook size={16} /></a>
          <a
            href="https://x.com/AiVass_com"
            target="_blank" rel="noopener noreferrer"
            aria-label="AiVass on X (Twitter)"
            className="hover:text-cream transition-colors"
            onClick={() => trackSocialClick("x")}
          ><Twitter size={16} /></a>
          <a
            href="https://www.youtube.com/@AiVa_ss"
            target="_blank" rel="noopener noreferrer"
            aria-label="AiVass on YouTube"
            className="hover:text-cream transition-colors"
            onClick={() => trackSocialClick("youtube")}
          ><Youtube size={16} /></a>
        </div>
      </div>
    </footer>
  );
}
