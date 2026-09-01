"use client";

import { useMemo, useState } from "react";
import { Hero } from "./Hero";
import { ProductPreview } from "./ProductPreview";
import { ValueSplit } from "./ValueSplit";
import { SocialProof } from "./SocialProof";
import { ClosingCTA } from "./ClosingCTA";
import { STAGES, cumulativeTrustScore } from "./data";

/** Default stage is the LAST one (Buyer match) — this listing's current, fully-processed state, not
 * the beginning of its history. That satisfies the brief's "default state must show real non-empty
 * proof" rule while still letting a visitor scrub backward to see how the record was built. */
const DEFAULT_STAGE_INDEX = STAGES.length - 1;

export default function HandoffTimelineLanding() {
  const [activeIndex, setActiveIndex] = useState(DEFAULT_STAGE_INDEX);

  // Every downstream section derives from this one piece of state via a pure function — never a
  // hardcoded string — so the trust score the visitor sees in the hero is the exact same number
  // the closing CTA quotes back at them.
  const trustScore = useMemo(() => cumulativeTrustScore(activeIndex), [activeIndex]);

  return (
    <main className="min-h-screen bg-white">
      <Hero activeIndex={activeIndex} onSelect={setActiveIndex} trustScore={trustScore} />
      <ProductPreview />
      <ValueSplit activeIndex={activeIndex} />
      <SocialProof />
      <ClosingCTA activeIndex={activeIndex} trustScore={trustScore} />
    </main>
  );
}
