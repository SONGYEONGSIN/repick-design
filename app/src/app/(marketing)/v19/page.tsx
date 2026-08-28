"use client";

import { useCallback, useMemo, useState } from "react";
import Hero from "./Hero";
import ValueSection from "./ValueSection";
import SocialProof from "./SocialProof";
import ClosingCTA from "./ClosingCTA";
import {
  CATEGORY_ORDER,
  CORRECTIONS,
  computeTrustScore,
  visibleCorrections,
  type Category,
} from "./data";

/**
 * repick — auto-landing-r16, candidate c: "AI redline". State (which claim categories are being
 * reviewed) lives here so the closing section can echo the same live numbers the hero's filter
 * control produces, instead of a second, disconnected hardcoded figure.
 */
export default function Page() {
  const [active, setActive] = useState<ReadonlySet<Category>>(
    () => new Set(CATEGORY_ORDER),
  );

  const toggleCategory = useCallback((category: Category) => {
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  }, []);

  const trust = useMemo(() => computeTrustScore(active), [active]);
  const correctionsVisible = useMemo(() => visibleCorrections(active).length, [active]);

  return (
    <main id="top" className="min-h-full bg-white">
      <Hero
        active={active}
        onToggle={toggleCategory}
        trust={trust}
        correctionsVisible={correctionsVisible}
        correctionsTotal={CORRECTIONS.length}
      />
      <ValueSection />
      <SocialProof />
      <ClosingCTA
        trust={trust}
        correctionsVisible={correctionsVisible}
        correctionsTotal={CORRECTIONS.length}
        activeCount={active.size}
        categoryTotal={CATEGORY_ORDER.length}
      />
    </main>
  );
}
