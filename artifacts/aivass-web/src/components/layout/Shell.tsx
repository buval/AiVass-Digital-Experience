import { ReactNode } from "react";
import { Nav } from "./Nav";
import { Footer } from "./Footer";

export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-cream text-navy selection:bg-oxblood selection:text-cream">
      <Nav />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
