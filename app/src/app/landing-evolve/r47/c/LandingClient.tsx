"use client";

import { useState } from "react";
import Hero from "./Hero";
import ProductPreview from "./ProductPreview";
import ValueSplit from "./ValueSplit";
import SocialProof from "./SocialProof";
import ClosingCTA from "./ClosingCTA";
import { DEFAULT_STRICTNESS, type StrictnessId } from "./data";

/**
 * Single state owner for the whole page. `strictnessId` is lifted here (not into a
 * separate context) because only three components ever need it, and they all sit
 * directly under this one client component — the same strictness id flows into the
 * Hero's Allocation Flow device, ValueSplit's live-reflowed cards, and ClosingCTA's
 * headline, all computing from it through the same pure functions in flow-math.ts,
 * so none of them can ever cite a number the others don't also show. Defaults to
 * STANDARD, matching DEFAULT_STRICTNESS — the one real, non-zero state every reader
 * of this value renders by default.
 */
export default function LandingClient() {
  const [strictnessId, setStrictnessId] = useState<StrictnessId>(DEFAULT_STRICTNESS);

  return (
    <main>
      <Hero strictnessId={strictnessId} onChangeStrictness={setStrictnessId} />
      <ProductPreview />
      <ValueSplit strictnessId={strictnessId} />
      <SocialProof />
      <ClosingCTA strictnessId={strictnessId} />
    </main>
  );
}
