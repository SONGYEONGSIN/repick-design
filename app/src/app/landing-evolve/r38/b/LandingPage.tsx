"use client";

import { useState } from "react";
import Hero from "./Hero";
import ProductPreview from "./ProductPreview";
import ValueSection from "./ValueSection";
import SocialProof from "./SocialProof";
import ClosingCTA from "./ClosingCTA";
import { LISTINGS } from "./data";
import { BG, INK } from "./theme";

/**
 * Single source of truth for the two input axes — `selectedId` (the
 * listing tab-set) and `reveal` (the drag-divider position, 0–100). Every
 * downstream section reads these two values straight off this component
 * and recomputes its own numbers via score-math.ts; nothing is passed down
 * as an already-derived value, so there is exactly one place either axis
 * could possibly drift from the others.
 *
 * `reveal` starts at 50, not 0: the very first paint (including the no-JS
 * SSR HTML) already shows a real, partially-graded state — one listing
 * tab selected, one checked box already visible, a real confidence number
 * — rather than an empty "nothing happened yet" default.
 */
export default function LandingPage() {
  const [selectedId, setSelectedId] = useState<string>(LISTINGS[0].id);
  const [reveal, setReveal] = useState<number>(50);

  return (
    <main style={{ backgroundColor: BG, color: INK }}>
      <Hero selectedId={selectedId} onSelect={setSelectedId} reveal={reveal} onRevealChange={setReveal} />
      <ProductPreview />
      <ValueSection selectedId={selectedId} reveal={reveal} />
      <SocialProof />
      <ClosingCTA selectedId={selectedId} reveal={reveal} />
    </main>
  );
}
