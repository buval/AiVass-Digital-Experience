import { Link } from "wouter";

export default function OrderCancel() {
  return (
    <div className="bg-cream min-h-screen pt-[120px] pb-[100px] flex flex-col items-center text-center">
      <div className="wrap flex flex-col items-center">
        <div className="eyebrow mb-6">Order Cancelled</div>
        <h2 className="text-[40px] md:text-[60px] font-serif leading-none tracking-[-0.05em] mb-6 text-navy">
          Your payment was cancelled.
        </h2>
        <p className="text-[16px] text-navy-mid max-w-[500px] leading-[1.65] mb-12">
          No charge has been made to your card. If you've already purchased guides,{" "}
          <Link href="/my-downloads" className="underline hover:opacity-70">
            visit My Downloads
          </Link>{" "}
          to access them.
        </p>
        <div className="flex items-center gap-6">
          <Link href="/guides" className="link-under text-navy">
            ← Return to Guides
          </Link>
          <Link href="/guides" className="btn-fill">
            Try Again →
          </Link>
        </div>
      </div>
    </div>
  );
}
