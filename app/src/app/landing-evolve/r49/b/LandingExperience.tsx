"use client";

import { useCallback, useState } from "react";
import { Hero } from "./Hero";
import { ProductPreview } from "./ProductPreview";
import { ValueSplit } from "./ValueSplit";
import { SocialProof } from "./SocialProof";
import { ClosingCTA } from "./ClosingCTA";
import { DEFAULT_WEEK_INDEX, WEEK_COUNT } from "./data";
import { ACCENT_FILL, ACCENT_FILL_HOVER, ACCENT_TINT_TEXT, BG_CLASS, FOCUS_RING, INK_CLASS, MUTED_TEXT, ON_ACCENT_TEXT } from "./tokens";

export function LandingExperience() {
  // Single source of truth for the whole page: every section below reads this SAME index, never
  // a value it re-derives or re-states on its own. Defaults to the most recent week ("now"), so
  // the hero's proof cards and stats are meaningful before any dragging happens.
  const [weekIndex, setWeekIndex] = useState<number>(DEFAULT_WEEK_INDEX);

  const handleScrub = useCallback((index: number) => {
    setWeekIndex(Math.min(WEEK_COUNT - 1, Math.max(0, index)));
  }, []);

  return (
    <div className={`min-h-screen ${BG_CLASS} ${INK_CLASS}`}>
      <a
        href="#main-content"
        className={`sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-50 focus-visible:rounded-md ${ACCENT_FILL} focus-visible:px-4 focus-visible:py-2 focus-visible:text-sm focus-visible:font-semibold ${ON_ACCENT_TEXT} ${FOCUS_RING}`}
      >
        Skip to content
      </a>

      <header className="border-b border-white/10 px-4 py-4 sm:px-6 lg:px-10">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between">
          <span className={`text-lg font-extrabold tracking-[-0.02em] ${INK_CLASS}`}>repick</span>
          <nav className="hidden items-center gap-6 sm:flex" aria-label="Primary">
            <a
              href="#catalog"
              className={`inline-flex min-h-7 items-center text-sm font-semibold ${MUTED_TEXT} transition-colors duration-200 hover:text-white ${FOCUS_RING} rounded-sm`}
            >
              Catalog
            </a>
            <a
              href="#proof-heading"
              className={`inline-flex min-h-7 items-center text-sm font-semibold ${MUTED_TEXT} transition-colors duration-200 hover:text-white ${FOCUS_RING} rounded-sm`}
            >
              Reviews
            </a>
          </nav>
          <a
            href="#hero-heading"
            className={`rounded-full ${ACCENT_FILL} px-4 py-2 text-sm font-semibold ${ON_ACCENT_TEXT} transition-colors duration-200 ${ACCENT_FILL_HOVER} ${FOCUS_RING}`}
          >
            List an item
          </a>
        </div>
      </header>

      <main id="main-content">
        <Hero weekIndex={weekIndex} onScrub={handleScrub} />
        <ProductPreview />
        <ValueSplit weekIndex={weekIndex} />
        <SocialProof />
        <ClosingCTA weekIndex={weekIndex} />
      </main>

      <footer className="border-t border-white/10 px-4 py-10 sm:px-6 lg:px-10">
        <div className={`mx-auto flex max-w-[1440px] flex-col gap-2 text-xs font-normal ${MUTED_TEXT} sm:flex-row sm:items-center sm:justify-between`}>
          <span>© 2026 repick. Weekly figures are illustrative for this demo window.</span>
          <span className={ACCENT_TINT_TEXT}>Marketplace scrubber — one playhead, twelve real weeks.</span>
        </div>
      </footer>
    </div>
  );
}
