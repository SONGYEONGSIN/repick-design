"use client";

import { useState } from "react";
import { ClosingCta } from "./ClosingCta";
import { DeviceSection } from "./DeviceSection";
import { deriveReplay } from "./frames";
import { Hero } from "./Hero";
import { ProductPreview } from "./ProductPreview";
import { Reveal } from "./Reveal";
import { SocialProof } from "./SocialProof";
import { BG } from "./tokens";

/**
 * Single source of truth for the scrubber's two input axes (`frameIndex`, `humanReview`) —
 * lifted to the page root so the Hero's compact copy, the full device below, and the closing CTA
 * all read the SAME derived result instead of maintaining three independent calculations that
 * could drift apart.
 */
export default function Client() {
  const [frameIndex, setFrameIndex] = useState(2);
  const [humanReview, setHumanReview] = useState(false);

  const result = deriveReplay(frameIndex, humanReview);

  return (
    <main style={{ backgroundColor: BG }}>
      <Hero
        frameIndex={frameIndex}
        humanReview={humanReview}
        onScrub={setFrameIndex}
        onToggleHumanReview={() => setHumanReview((v) => !v)}
      />
      <DeviceSection
        frameIndex={frameIndex}
        humanReview={humanReview}
        onScrub={setFrameIndex}
        onToggleHumanReview={() => setHumanReview((v) => !v)}
      />
      <Reveal>
        <ProductPreview />
      </Reveal>
      <Reveal>
        <SocialProof />
      </Reveal>
      <ClosingCta result={result} />
    </main>
  );
}
