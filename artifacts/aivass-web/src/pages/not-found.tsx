import { Link } from "wouter";

/**
 * On-brand 404 page — matches AiVass visual language (cream, navy, oxblood, Playfair/DM Sans).
 */
export default function NotFound() {
  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center text-center px-[6vw]">
      {/* Decorative star node */}
      <svg viewBox="0 0 24 24" className="w-[32px] h-[32px] text-oxblood mb-8" fill="currentColor" aria-hidden="true">
        <path d="M12 2 L13.5 10.5 L22 12 L13.5 13.5 L12 22 L10.5 13.5 L2 12 L10.5 10.5Z" />
      </svg>

      <div className="eyebrow mb-5">404</div>

      <h1 className="font-serif text-[52px] md:text-[80px] leading-none tracking-[-0.05em] mb-4">
        Page not<br />
        <em className="text-oxblood italic">found.</em>
      </h1>

      <div className="w-[60px] h-[1px] bg-navy/20 my-6" />

      <p className="text-[15px] text-navy-mid max-w-[420px] leading-[1.65] mb-10">
        The page you're looking for doesn't exist, or may have moved.
        Try the navigation above or return to the homepage.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/" className="btn-fill">Return Home</Link>
        <Link href="/solutions" className="btn">Explore Solutions</Link>
      </div>
    </div>
  );
}
