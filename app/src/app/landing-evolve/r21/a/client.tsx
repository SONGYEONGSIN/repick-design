"use client";

import { useState } from "react";
import ClosingCTA from "./ClosingCTA";
import Hero from "./Hero";
import { LAST_STAGE } from "./data";
import SiteHeader from "./SiteHeader";
import SocialProof from "./SocialProof";
import { MUTED, SKIP_LINK } from "./tokens";
import ValueSection from "./ValueSection";

/**
 * Root scrub state lives here, one level above every section, so whichever stage the visitor drags
 * to in the hero is the single source of truth the closing section reads too — never a value frozen
 * at mount. Default is the LAST stage (Priced): the richest, fully-processed badge state, so the
 * first fold shows the strongest proof rather than an empty "just listed" card, while still letting
 * a visitor scrub backward through the earlier, real stages.
 *
 * This route commits to a light look for its whole page (the round mandates light), so colour is
 * painted explicitly rather than branching on `prefers-color-scheme`.
 */
export default function ProvenanceScrubberLanding() {
  const [activeIndex, setActiveIndex] = useState(LAST_STAGE);

  return (
    <div className="min-h-screen bg-[#FAFAF9] font-sans text-zinc-900">
      <a href="#main-content" className={SKIP_LINK}>
        Skip to content
      </a>
      <SiteHeader />
      <main id="main-content">
        <Hero activeIndex={activeIndex} onChange={setActiveIndex} />
        <ValueSection />
        <SocialProof />
        <ClosingCTA activeIndex={activeIndex} />
      </main>
      <footer className="border-t border-zinc-200">
        <div className={`mx-auto max-w-[1400px] px-4 py-8 text-xs sm:px-6 lg:px-8 ${MUTED}`}>
          repick · resale, verified. The coat above is a reference listing; its record is illustrative.
        </div>
      </footer>
    </div>
  );
}
