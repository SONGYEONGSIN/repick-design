"use client";

import { useState } from "react";
import Header from "./Header";
import Hero from "./Hero";
import ProductGrid from "./ProductGrid";
import ValueSection from "./ValueSection";
import SocialProof from "./SocialProof";
import ClosingCTA from "./ClosingCTA";
import { CONCERNS, type ConcernId } from "./data";

const ALL_IDS: ConcernId[] = CONCERNS.map((c) => c.id);

/**
 * Holds the one piece of state this whole route cares about: which
 * concerns are currently selected (0 to all 5). Every derived number on
 * the page — the hero's ring cluster and center readout, the product
 * grid's covered badges and sort order, the value-section recap, and the
 * closing CTA's sentence and its own button label — is a pure function of
 * this single `Set`, computed fresh wherever it's needed. There is no
 * second source of truth to drift out of sync.
 */
export default function LandingPage() {
  const [selected, setSelected] = useState<Set<ConcernId>>(() => new Set(ALL_IDS));

  function toggle(id: ConcernId) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="min-h-screen bg-white text-zinc-700">
      <Header />
      <main id="main">
        <Hero selected={selected} onToggle={toggle} />
        <ProductGrid selected={selected} />
        <ValueSection selected={selected} />
        <SocialProof />
        <ClosingCTA selected={selected} />
      </main>
    </div>
  );
}
