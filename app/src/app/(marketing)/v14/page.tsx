import type { Metadata } from "next";
import HeroSection from "./HeroSection";
import ProcessTimeline from "./ProcessTimeline";
import PayoutCalculator from "./PayoutCalculator";
import SocialProof from "./SocialProof";
import ClosingCta from "./ClosingCta";
import { cx, FOCUS } from "./data";

export const metadata: Metadata = {
  title: "repick — Trace",
  description:
    "Follow one repick listing from upload to payout: the AI's condition grade, the offer it produced, and the fee breakdown behind the payout, all traced against one real coat.",
};

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
          "sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-[#0e7490] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white",
          FOCUS,
        )}
      >
        Skip to main content
      </a>

      <div className="min-h-screen bg-[#0B0C10] text-white antialiased">
        <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0B0C10]/85 backdrop-blur-md">
          <nav
            aria-label="Primary"
            className="mx-auto flex w-full max-w-[1120px] items-center justify-between px-5 py-4 sm:px-8"
          >
            <a
              href="#hero"
              className={cx("rounded text-base font-extrabold tracking-[-0.02em] text-white", FOCUS)}
            >
              repick
            </a>
            <div className="hidden items-center gap-7 sm:flex">
              <a href="#how-it-works" className={NAV_LINK}>
                How it works
              </a>
              <a href="#estimate" className={NAV_LINK}>
                Estimate
              </a>
            </div>
            <a
              href="#estimate"
              className={cx(
                "inline-flex items-center justify-center rounded-full bg-[#e11d48] px-4 py-2 text-sm font-semibold text-white transition-colors duration-150 hover:bg-[#c81440]",
                FOCUS,
              )}
            >
              Start a listing
            </a>
          </nav>
        </header>

        <main id="main">
          <HeroSection />
          <ProcessTimeline />
          <PayoutCalculator />
          <SocialProof />
          <ClosingCta />
        </main>

        <footer className="border-t border-white/10 py-10">
          <div className="mx-auto flex w-full max-w-[1120px] flex-col items-center gap-3 px-5 text-center sm:flex-row sm:justify-between sm:text-left">
            <p className="text-sm font-normal text-[#A1A1AA]">© 2026 repick</p>
            <p className="text-sm font-normal text-[#A1A1AA]">
              Every figure on this page is traced from one real listing.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
