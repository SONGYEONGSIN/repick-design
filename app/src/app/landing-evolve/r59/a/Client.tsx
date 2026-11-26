"use client";

import { useState } from "react";
import { ClosingCta } from "./ClosingCta";
import { DeviceSection } from "./DeviceSection";
import type { GradeId } from "./grades";
import { deriveLadder } from "./grades";
import { Hero } from "./Hero";
import { ProductPreview } from "./ProductPreview";
import { Reveal } from "./Reveal";
import { SocialProof } from "./SocialProof";
import { BG } from "./tokens";

/**
 * Single source of truth for the ladder device's two input axes (`gradeId`, `includeAccessories`)
 * — lifted to the page root so the Hero's compact copy, the full device below, and the closing
 * CTA all read the SAME derived result instead of maintaining three independent calculations
 * that could drift apart.
 */
export default function Client() {
  const [gradeId, setGradeId] = useState<GradeId>("a");
  const [includeAccessories, setIncludeAccessories] = useState(false);

  const result = deriveLadder(gradeId, includeAccessories);

  return (
    <main style={{ backgroundColor: BG }}>
      <Hero
        gradeId={gradeId}
        includeAccessories={includeAccessories}
        onSelectGrade={setGradeId}
        onToggleAccessories={() => setIncludeAccessories((v) => !v)}
      />
      <DeviceSection
        gradeId={gradeId}
        includeAccessories={includeAccessories}
        onSelectGrade={setGradeId}
        onToggleAccessories={() => setIncludeAccessories((v) => !v)}
      />
      <Reveal>
        <ProductPreview />
      </Reveal>
      <Reveal>
        <SocialProof />
      </Reveal>
      <ClosingCta result={result} includeAccessories={includeAccessories} />
    </main>
  );
}
