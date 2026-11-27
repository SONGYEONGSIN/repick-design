"use client";

import { useState } from "react";
import { CATEGORIES, deriveBreakdown, type StrictnessMode } from "./categories";
import { ClosingCta } from "./ClosingCta";
import { DeviceSection } from "./DeviceSection";
import { Hero } from "./Hero";
import { ProductPreview } from "./ProductPreview";
import { Reveal } from "./Reveal";
import { SocialProof } from "./SocialProof";
import { BG } from "./tokens";

const ALL_CATEGORY_IDS = new Set(CATEGORIES.map((c) => c.id));

/**
 * Single source of truth for the Trust Breakdown's two input axes (`activeIds`, `mode`) — lifted
 * to the page root so the Hero's compact copy, the full device below, and the closing CTA all
 * read the SAME derived result instead of maintaining three independent calculations that could
 * drift apart.
 */
export default function Client() {
  const [activeIds, setActiveIds] = useState<Set<string>>(() => new Set(ALL_CATEGORY_IDS));
  const [mode, setMode] = useState<StrictnessMode>("standard");

  const onToggleCategory = (id: string) => {
    setActiveIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const result = deriveBreakdown(activeIds, mode);

  return (
    <main style={{ backgroundColor: BG }}>
      <Hero activeIds={activeIds} mode={mode} onToggleCategory={onToggleCategory} onSetMode={setMode} />
      <DeviceSection activeIds={activeIds} mode={mode} onToggleCategory={onToggleCategory} onSetMode={setMode} />
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
