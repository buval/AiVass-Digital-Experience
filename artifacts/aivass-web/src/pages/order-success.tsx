import { Link } from "wouter";
import { Triad } from "@/components/brand/Triad";

export default function OrderSuccess() {
  return (
    <div className="bg-navy text-cream min-h-screen pt-[120px] pb-[100px] flex flex-col items-center text-center">
      <div className="wrap flex flex-col items-center">
        <Triad className="w-[60px] text-ox-light mb-8" />
        <h1 className="text-[40px] md:text-[60px] font-serif leading-none tracking-[-0.05em] mb-6">
          Your purchase is confirmed.
        </h1>
        <p className="text-[16px] text-ox-light max-w-[500px] leading-[1.65] mb-12">
          Your guides are being prepared. You will receive an email with your secure download link shortly.
        </p>
        <Link href="/guides" className="btn-outline-light mb-16">
          Explore More Guides →
        </Link>
        <p className="text-[12px] text-ox-light/70 tracking-[0.05em]">
          Didn't receive an email? Contact <a href="mailto:connect@aivass.com" className="underline hover:text-cream">connect@aivass.com</a>
        </p>
      </div>
    </div>
  );
}
