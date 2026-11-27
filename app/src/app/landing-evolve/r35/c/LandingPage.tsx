"use client";

import { useState } from "react";
import Header from "./Header";
import Hero from "./Hero";
import ProductPreview from "./ProductPreview";
import ValueSection from "./ValueSection";
import SocialProof from "./SocialProof";
import ClosingCTA from "./ClosingCTA";
import { DEFAULT_COUNTS, clampCount, type CategoryCounts, type CategoryId } from "./payout-math";

/**
 * Holds the one piece of state this whole route cares about: the three
 * category counts. Every other number on the page (hero live estimate,
 * breakdown table, stacked bar, value-split live stat, closing CTA
 * figure and the CTA button's own label) is a pure function of this
 * state, recomputed fresh wherever it's needed — there is no second
 * source of truth to drift out of sync.
 */
export default function LandingPage() {
  const [counts, setCounts] = useState<CategoryCounts>(DEFAULT_COUNTS);

  function handleChange(id: CategoryId, next: number) {
    setCounts((prev) => ({ ...prev, [id]: clampCount(next) }));
  }

  function handleReset() {
    setCounts(DEFAULT_COUNTS);
  }

  return (
    <div className="min-h-screen bg-white text-zinc-700">
      <Header />
      <main id="main">
        <Hero counts={counts} />
        <ProductPreview counts={counts} onChange={handleChange} onReset={handleReset} />
        <ValueSection counts={counts} />
        <SocialProof />
        <ClosingCTA counts={counts} />
      </main>
    </div>
  );
}
