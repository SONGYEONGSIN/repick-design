"use client";

import { useState } from "react";
import { ClosingCta } from "./ClosingCta";
import { DAY_DEFAULT, DAY_MAX, DAY_MIN, DAY_STEP } from "./data";
import { Hero } from "./Hero";
import { ProductPreviewSection } from "./ProductPreviewSection";
import { SocialProof } from "./SocialProof";
import { ValueTriptych } from "./ValueTriptych";

/**
 * Single source of truth for the page's one continuous control. `scrubDay` and `setScrubDay` are
 * lifted here and handed to every section that reads or writes it, so the Hero's scrubber, its
 * mirror in the Value section, and every number derived from either, always agree.
 */
export default function LandingClient() {
  const [scrubDay, setScrubDay] = useState(DAY_DEFAULT);

  return (
    <main className="min-h-dvh bg-[#0B0B0F] text-white">
      <Hero
        scrubDay={scrubDay}
        onScrubDayChange={setScrubDay}
        min={DAY_MIN}
        max={DAY_MAX}
        step={DAY_STEP}
      />
      <ProductPreviewSection scrubDay={scrubDay} />
      <ValueTriptych scrubDay={scrubDay} onScrubDayChange={setScrubDay} />
      <SocialProof />
      <ClosingCta scrubDay={scrubDay} />
    </main>
  );
}
