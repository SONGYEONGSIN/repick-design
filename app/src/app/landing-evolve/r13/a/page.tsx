import type { Metadata } from "next";
import MatchStudio from "./MatchStudio";
import ValueSection from "./ValueSection";
import SocialProof from "./SocialProof";
import ClosingCta from "./ClosingCta";
import { cx, FOCUS } from "./data";

export const metadata: Metadata = {
  title: "repick — Radar Match Profiles",
  description:
    "Set which axes matter and repick ranks every pre-owned listing by the exact overlap of two five-axis polygons — match%, condition grade, verification and discount shown on every card.",
};

const GROTESK = { fontFamily: "var(--font-display-grotesk)" } as const;

const NAV_LINK = cx(
  "rounded text-sm font-normal text-[#A1A1AA] transition-colors duration-150 hover:text-white",
  FOCUS,
);

export default function Page() {
  return (
    <>
      <a
        href="#main"
        className={cx(
          "sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-[#b45309] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white",
          FOCUS,
        )}
      >
        Skip to main content
      </a>

      <div className="min-h-screen bg-[#0B0B0F] text-white antialiased">
        <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0B0B0F]/85 backdrop-blur-md">
          <nav
            aria-label="Primary"
            className="mx-auto flex w-full max-w-[1200px] items-center justify-between px-5 py-4 sm:px-8"
          >
            <a
              href="#hero"
              style={GROTESK}
              className={cx("rounded text-base font-extrabold tracking-[-0.02em] text-white", FOCUS)}
            >
              repick
            </a>
            <div className="hidden items-center gap-7 sm:flex">
              <a href="#value" className={NAV_LINK}>
                How it works
              </a>
              <a href="#proof-title" className={NAV_LINK}>
                Buyers
              </a>
            </div>
            <a
              href="#hero"
              className={cx(
                "inline-flex items-center justify-center rounded-full bg-[#b45309] px-4 py-2 text-sm font-semibold text-white transition-colors duration-150 hover:bg-[#96450a]",
                FOCUS,
              )}
            >
              Browse matches
            </a>
          </nav>
        </header>

        <main id="main">
          <MatchStudio />
          <ValueSection />
          <SocialProof />
          <ClosingCta />
        </main>

        <footer className="border-t border-white/10 py-10">
          <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center gap-3 px-5 text-center sm:flex-row sm:justify-between sm:text-left sm:px-8">
            <p className="text-sm font-normal text-[#A1A1AA]">© 2026 repick</p>
            <p className="text-sm font-normal text-[#A1A1AA]">
              Every match on this page is real polygon-overlap arithmetic.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
