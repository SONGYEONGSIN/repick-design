"use client";

import { useState } from "react";
import Header from "./Header";
import Hero from "./Hero";
import ValueSection from "./ValueSection";
import SoldComps from "./SoldComps";
import SocialProof from "./SocialProof";
import ClosingCTA from "./ClosingCTA";
import { DEFAULT_SELECTED, type CategoryId } from "./categories";

/**
 * Holds the one piece of state this whole route cares about: which
 * categories are selected. Every other number on the page — the hero
 * headline's fastest category, the live readout, the bubble cluster, the
 * value-section average, the sold-comps card list and the closing CTA's
 * sentence and button label — is a pure function of this array,
 * recomputed fresh wherever it's needed. There is no second source of
 * truth to drift out of sync.
 */
export default function LandingPage() {
  const [selected, setSelected] = useState<CategoryId[]>(DEFAULT_SELECTED);

  function handleToggle(id: CategoryId) {
    setSelected((prev) => {
      const isOn = prev.includes(id);
      if (isOn) {
        // Always keep at least one category selected — a silent no-op
        // when this would empty the mix entirely.
        if (prev.length === 1) return prev;
        return prev.filter((x) => x !== id);
      }
      return [...prev, id];
    });
  }

  return (
    <div className="min-h-screen bg-white text-zinc-700">
      <Header />
      <main id="main">
        <Hero selected={selected} onToggle={handleToggle} />
        <ValueSection selected={selected} />
        <SoldComps selected={selected} />
        <SocialProof />
        <ClosingCTA selected={selected} />
      </main>
    </div>
  );
}
