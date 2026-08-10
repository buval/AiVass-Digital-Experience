import { useEffect, useState } from "react";
import { useRoute, Link } from "wouter";
import { useSeoMeta } from "@/lib/seo";

type State =
  | { status: "loading" }
  | { status: "downloading" }
  | { status: "done"; guideName: string; attemptsRemaining: number }
  | { status: "error"; code: "expired" | "exhausted" | "invalid" | "unknown"; attemptsRemaining?: number };

export default function DownloadPage() {
  const [, params] = useRoute("/download/:token");
  const token = params?.token ?? "";
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    if (!token) {
      setState({ status: "error", code: "invalid" });
      return;
    }

    setState({ status: "downloading" });

    // Trigger the download by hitting the API endpoint
    fetch(`/api/download/${token}`)
      .then(async (res) => {
        if (res.ok) {
          const guideName = res.headers.get("X-Guide-Name") ?? "Your Guide";
          const remaining = Number(res.headers.get("X-Attempts-Remaining") ?? "0");

          // Stream blob and trigger browser download
          const blob = await res.blob();
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = res.headers.get("X-Filename") ?? "guide.pdf";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);

          setState({ status: "done", guideName, attemptsRemaining: remaining });
        } else {
          const body = await res.json().catch(() => ({}));
          const code: "expired" | "exhausted" | "invalid" | "unknown" =
            res.status === 410 ? "exhausted"
            : res.status === 404 ? "invalid"
            : body.code === "expired" ? "expired"
            : "unknown";
          setState({ status: "error", code, attemptsRemaining: body.attemptsRemaining });
        }
      })
      .catch(() => setState({ status: "error", code: "unknown" }));
  }, [token]);

  useSeoMeta({ title: "Download Your Guide", noIndex: true });

  return (
    <>
      <div className="min-h-screen bg-paper flex items-center justify-center px-6">
        <div className="max-w-[480px] w-full text-center">

          {/* AiVass mark */}
          <p className="font-serif text-navy text-[18px] tracking-[0.04em] mb-16">
            AiVass<span className="text-oxblood">✦</span>
          </p>

          {state.status === "loading" && (
            <div className="space-y-4">
              <div className="w-8 h-8 border-2 border-navy/20 border-t-navy rounded-full animate-spin mx-auto" />
              <p className="text-navy-mid text-[14px]">Preparing your download…</p>
            </div>
          )}

          {state.status === "downloading" && (
            <div className="space-y-4">
              <div className="w-8 h-8 border-2 border-oxblood/20 border-t-oxblood rounded-full animate-spin mx-auto" />
              <p className="text-navy text-[14px]">Downloading your guide…</p>
            </div>
          )}

          {state.status === "done" && (
            <div className="space-y-6">
              <div className="text-oxblood text-[40px]">✦</div>
              <div className="space-y-2">
                <h1 className="font-serif text-navy text-[28px] leading-tight">
                  Download started.
                </h1>
                <p className="text-navy-mid text-[14px] leading-[1.7]">
                  <strong className="text-navy">{state.guideName}</strong> is downloading now.
                  {state.attemptsRemaining > 0 && (
                    <> You have <strong>{state.attemptsRemaining}</strong> download{state.attemptsRemaining !== 1 ? "s" : ""} remaining on this link.</>
                  )}
                </p>
              </div>
              <div className="border-t border-navy/10 pt-6">
                <p className="text-[12px] text-grey leading-[1.7]">
                  Check your downloads folder. If the file did not arrive,{" "}
                  <button
                    onClick={() => window.location.reload()}
                    className="text-oxblood hover:underline"
                  >
                    try again
                  </button>
                  {" "}or contact{" "}
                  <a href="mailto:connect@aivass.com" className="text-oxblood hover:underline">
                    connect@aivass.com
                  </a>.
                </p>
              </div>
            </div>
          )}

          {state.status === "error" && state.code === "exhausted" && (
            <div className="space-y-6">
              <h1 className="font-serif text-navy text-[28px] leading-tight">
                Download limit reached.
              </h1>
              <p className="text-navy-mid text-[14px] leading-[1.7]">
                This link has been used the maximum number of times.
                Please contact us and we will arrange a new link for you.
              </p>
              <a href="mailto:connect@aivass.com?subject=Download link exhausted" className="btn-fill inline-block">
                Contact Support
              </a>
            </div>
          )}

          {state.status === "error" && state.code === "expired" && (
            <div className="space-y-6">
              <h1 className="font-serif text-navy text-[28px] leading-tight">
                Link expired.
              </h1>
              <p className="text-navy-mid text-[14px] leading-[1.7]">
                Download links are valid for 72 hours after purchase.
                Contact us and we will send you a new one.
              </p>
              <a href="mailto:connect@aivass.com?subject=Download link expired" className="btn-fill inline-block">
                Request New Link
              </a>
            </div>
          )}

          {(state.status === "error" && (state.code === "invalid" || state.code === "unknown")) && (
            <div className="space-y-6">
              <h1 className="font-serif text-navy text-[28px] leading-tight">
                Link not found.
              </h1>
              <p className="text-navy-mid text-[14px] leading-[1.7]">
                This download link is invalid or may have already been used.
                If you believe this is an error, please contact us.
              </p>
              <div className="flex gap-3 justify-center">
                <Link href="/guides" className="btn-outline">Browse Guides</Link>
                <a href="mailto:connect@aivass.com?subject=Download link issue" className="btn-fill">
                  Contact Us
                </a>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
