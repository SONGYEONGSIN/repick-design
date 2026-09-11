"use client";

import { useState } from "react";
import ClosingCTA from "./ClosingCTA";
import Hero from "./Hero";
import ProductPreview from "./ProductPreview";
import { DEFAULT_WEIGHTS, type Weights } from "./scoring";
import SiteHeader from "./SiteHeader";
import SocialProof from "./SocialProof";
import { MUTED } from "./tokens";
import ValueSection from "./ValueSection";

/**
 * Root state lives here, one level above every section, so the weighting the visitor sets in the
 * hero's sliders is the single source of truth `ClosingCTA` reads too — never a value frozen at
 * mount. This page deliberately commits to a light look for the whole route (the round mandates
 * light), so colour is painted explicitly rather than branching on `prefers-color-scheme`.
 */
export default function ReverseAuctionLedgerLanding() {
  const [weights, setWeights] = useState<Weights>(DEFAULT_WEIGHTS);

  return (
    <div className="min-h-screen bg-[#FAFAF8] font-sans text-zinc-900">
      <SiteHeader />
      <main>
        <Hero weights={weights} onWeightsChange={setWeights} />
        <ProductPreview />
        <ValueSection />
        <SocialProof />
        <ClosingCTA weights={weights} />
      </main>
      <footer className="border-t border-zinc-200">
        <div className={`mx-auto max-w-[1400px] px-4 py-8 text-xs sm:px-6 lg:px-8 ${MUTED}`}>
          repick · resale, ranked. Order book is illustrative of live matching behaviour.
        </div>
      </footer>
    </div>
  );
}
