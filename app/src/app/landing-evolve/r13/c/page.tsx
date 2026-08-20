import type { Metadata } from "next";
import MatchBoard from "./MatchBoard";
import BelowFold from "./BelowFold";
import { FOCUS, cx } from "./data";

export const metadata: Metadata = {
  title: "repick — Reorder",
  description:
    "Rank what matters — price, condition, verified seller, ship speed, rarity — and repick's live board re-ranks every listing in real time, each card citing your top priority against real proof.",
};

const NAV_LINK = cx(
  "rounded text-sm font-normal text-zinc-400 transition-colors hover:text-white",
  FOCUS,
);

export default function Page() {
  return (
    <>
      <a
        href="#main"
        className={cx(
          "sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-[#0B0B0F]",
          FOCUS,
        )}
      >
        Skip to main content
      </a>

      <div className="min-h-screen bg-[#0B0B0F] text-white antialiased">
        <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0B0B0F]/85 backdrop-blur-md">
          <nav
            aria-label="Primary"
            className="mx-auto flex w-full max-w-[1180px] items-center justify-between px-5 py-4 sm:px-8"
          >
            <a
              href="#board"
              className={cx("rounded text-base font-extrabold tracking-[-0.02em] text-white", FOCUS)}
            >
              repick
            </a>
            <div className="hidden items-center gap-7 sm:flex">
              <a href="#how-it-works" className={NAV_LINK}>
                How it works
              </a>
              <a href="#proof" className={NAV_LINK}>
                Trust
              </a>
            </div>
            <a
              href="#start"
              className={cx(
                "inline-flex items-center justify-center rounded-full bg-[#0369a1] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#075985]",
                FOCUS,
              )}
            >
              Start ranking
            </a>
          </nav>
        </header>

        <main id="main">
          <MatchBoard />
          <BelowFold />
        </main>

        <footer className="px-5 py-10 sm:px-8 lg:px-10">
          <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-3 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
            <p className="text-sm font-semibold tracking-[-0.02em] text-white">repick</p>
            <p className="text-sm font-normal text-zinc-400">
              All listings, prices and match scores here are illustrative sample data.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
