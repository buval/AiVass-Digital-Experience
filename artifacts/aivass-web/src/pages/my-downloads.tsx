import { useState } from "react";
import { Triad } from "@/components/brand/Triad";
import { useSeoMeta } from "@/lib/seo";

interface Purchase {
  guideSlug: string;
  guideName: string;
  token: string;
  attemptsRemaining: number;
  expiresAt: string;
  expired: boolean;
  exhausted: boolean;
  canDownload: boolean;
}

type LookupState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "done"; email: string; purchases: Purchase[] }
  | { status: "error"; message: string };

type RefreshState = Record<string, "loading" | "done" | "error">;

async function triggerDownload(token: string, filename: string) {
  const res = await fetch(`/api/download/${token}`);
  if (!res.ok) throw new Error(`Download failed: ${res.status}`);
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function MyDownloads() {
  useSeoMeta({ title: "My Downloads", noIndex: true });

  const [email, setEmail] = useState("");
  const [lookup, setLookup] = useState<LookupState>({ status: "idle" });
  const [refreshState, setRefreshState] = useState<RefreshState>({});
  // Track locally-refreshed tokens so UI updates immediately
  const [refreshedPurchases, setRefreshedPurchases] = useState<Record<string, Purchase>>({});

  function handleLookup(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) return;

    setLookup({ status: "loading" });
    setRefreshState({});
    setRefreshedPurchases({});

    fetch(`/api/my-downloads?email=${encodeURIComponent(trimmed)}`)
      .then(async (res) => {
        const body = await res.json();
        if (!res.ok) throw new Error(body.error ?? `Error ${res.status}`);
        return body as { purchases: Purchase[] };
      })
      .then(({ purchases }) => {
        setLookup({ status: "done", email: trimmed, purchases });
      })
      .catch((err: Error) => {
        setLookup({ status: "error", message: err.message });
      });
  }

  function handleRefresh(purchase: Purchase, lookedUpEmail: string) {
    setRefreshState((s) => ({ ...s, [purchase.guideSlug]: "loading" }));

    fetch("/api/my-downloads/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: lookedUpEmail, guideSlug: purchase.guideSlug }),
    })
      .then(async (res) => {
        const body = await res.json();
        if (!res.ok) throw new Error(body.error ?? `Error ${res.status}`);
        return body as { token: string; guideName: string; attemptsRemaining: number; expiresAt: string };
      })
      .then((refreshed) => {
        setRefreshState((s) => ({ ...s, [purchase.guideSlug]: "done" }));
        setRefreshedPurchases((prev) => ({
          ...prev,
          [purchase.guideSlug]: {
            ...purchase,
            token: refreshed.token,
            attemptsRemaining: refreshed.attemptsRemaining,
            expiresAt: refreshed.expiresAt,
            expired: false,
            exhausted: false,
            canDownload: true,
          },
        }));
      })
      .catch((err: Error) => {
        setRefreshState((s) => ({ ...s, [purchase.guideSlug]: "error" }));
        alert(err.message);
      });
  }

  const displayedPurchases =
    lookup.status === "done"
      ? lookup.purchases.map((p) => refreshedPurchases[p.guideSlug] ?? p)
      : [];

  return (
    <div className="bg-navy text-cream min-h-screen pt-[120px] pb-[100px] flex flex-col items-center px-6">
      <div className="flex flex-col items-center max-w-[560px] w-full">
        <Triad className="w-[60px] text-ox-light mb-8" />

        <h1 className="text-[40px] md:text-[56px] font-serif leading-none tracking-[-0.05em] mb-4 text-center">
          My Downloads
        </h1>
        <p className="text-[15px] text-ox-light leading-[1.65] mb-10 text-center max-w-[420px]">
          Enter the email address you used at checkout to access your guides.
        </p>

        {/* Lookup form */}
        <form onSubmit={handleLookup} className="w-full flex flex-col gap-3 mb-10">
          <input
            type="email"
            required
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-transparent border border-cream/20 text-cream placeholder:text-cream/30 px-4 py-3 text-[14px] focus:outline-none focus:border-cream/50 transition-colors"
          />
          <button
            type="submit"
            disabled={lookup.status === "loading"}
            className="btn-primary w-full disabled:opacity-50"
          >
            {lookup.status === "loading" ? "Looking up…" : "Find my downloads"}
          </button>
        </form>

        {/* Results */}
        {lookup.status === "error" && (
          <p className="text-[14px] text-red-400 text-center">{lookup.message}</p>
        )}

        {lookup.status === "done" && displayedPurchases.length === 0 && (
          <div className="w-full text-center">
            <p className="text-[14px] text-ox-light mb-4">
              No purchases found for <span className="text-cream">{lookup.email}</span>.
            </p>
            <p className="text-[12px] text-cream/40 leading-[1.6]">
              If you completed a purchase with a different address, try that email.
              Otherwise, contact{" "}
              <a href="mailto:connect@aivass.com" className="underline hover:text-cream">
                connect@aivass.com
              </a>
              .
            </p>
          </div>
        )}

        {lookup.status === "done" && displayedPurchases.length > 0 && (
          <div className="w-full">
            <p className="text-[12px] text-cream/40 mb-5 text-center tracking-[0.06em] uppercase">
              {displayedPurchases.length} guide{displayedPurchases.length !== 1 ? "s" : ""} purchased
            </p>

            <div className="border border-cream/10 divide-y divide-cream/10">
              {displayedPurchases.map((p) => {
                const rState = refreshState[p.guideSlug];
                const expiresDate = new Date(p.expiresAt);
                const expiresLabel = p.expired
                  ? "Expired"
                  : `Expires ${expiresDate.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}`;

                return (
                  <div key={p.guideSlug} className="flex items-center justify-between gap-4 px-5 py-4">
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <p className="text-[14px] text-cream leading-snug truncate">{p.guideName}</p>
                      <p className="text-[11px] text-cream/40">
                        {p.canDownload
                          ? `${p.attemptsRemaining} download${p.attemptsRemaining !== 1 ? "s" : ""} left · ${expiresLabel}`
                          : p.expired
                            ? "Expired"
                            : "Download limit reached"}
                      </p>
                    </div>

                    <div className="shrink-0">
                      {p.canDownload && (
                        <button
                          onClick={() =>
                            triggerDownload(p.token, `${p.guideName}.pdf`).catch(() =>
                              alert("Download failed. Please try again."),
                            )
                          }
                          className="text-[11px] tracking-[0.08em] uppercase text-cream/60 hover:text-cream transition-colors whitespace-nowrap"
                        >
                          Download →
                        </button>
                      )}

                      {!p.canDownload && (
                        <button
                          onClick={() => handleRefresh(p, lookup.email)}
                          disabled={rState === "loading"}
                          className="text-[11px] tracking-[0.08em] uppercase text-ox-light hover:text-cream transition-colors whitespace-nowrap disabled:opacity-40"
                        >
                          {rState === "loading" ? "Refreshing…" : "Refresh link →"}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="text-[12px] text-cream/30 leading-[1.6] mt-6 text-center">
              Each download link works for 3 downloads and 72 hours. Refreshed links reset both.
              If you need help, contact{" "}
              <a href="mailto:connect@aivass.com" className="underline hover:text-cream/60">
                connect@aivass.com
              </a>
              .
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
