"use client";

import { useState } from "react";
import { Hero } from "./Hero";
import { ProductPreview } from "./ProductPreview";
import { ValueSplit } from "./ValueSplit";
import { SocialProof } from "./SocialProof";
import { ClosingCta } from "./ClosingCta";
import { BG, DEFAULT_STAGE_INDEX, INK, STAGES } from "./data";

export default function GradingTimelineLanding() {
  // Single source of truth for "which pipeline stage is on screen right now" — shared by the hero
  // scrubber, the value-split mini-control and the closing CTA, so the state that starts in the
  // hero is still alive by the last section rather than dying once the hero scrolls out of view.
  const [stage, setStage] = useState(DEFAULT_STAGE_INDEX);

  function handleStageChange(next: number) {
    const clamped = Math.min(STAGES.length - 1, Math.max(0, next));
    setStage(clamped);
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: BG, color: INK }}>
      <Hero stage={stage} onStageChange={handleStageChange} />
      <ProductPreview />
      <ValueSplit stage={stage} onStageChange={handleStageChange} />
      <SocialProof />
      <ClosingCta stage={stage} />
    </div>
  );
}
