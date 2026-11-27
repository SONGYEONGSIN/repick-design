"use client";

import { useCallback, useMemo, useState } from "react";
import { ClosingCta } from "./ClosingCta";
import type { AddOnId, CoverageState } from "./coverage";
import { DEFAULT_COVERAGE, deriveCoverage } from "./coverage";
import { Hero } from "./Hero";
import { ProductPreview } from "./ProductPreview";
import { Reveal } from "./Reveal";
import { SocialProof } from "./SocialProof";
import { ValueSplit } from "./ValueSplit";
import { BG, BORDER, FG } from "./tokens";

/**
 * Single source of truth for the page's device state: three independent booleans. Lifted here
 * and handed to Hero, ValueSplit (full mirror + lookup table), and ClosingCta so every citation
 * on the page reads the SAME `deriveCoverage(state)` result — none of them keeps its own copy.
 * `resetToDefault` and the persona presets both route through `setState`, so "reset" always lands
 * on the same non-trivial default (Shield + Resale Lock) every time, on first load and on every
 * later reset alike.
 */
export default function Client() {
  const [state, setState] = useState<CoverageState>(DEFAULT_COVERAGE);

  const result = useMemo(() => deriveCoverage(state), [state]);

  const toggle = useCallback((id: AddOnId) => {
    setState((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const resetToDefault = useCallback(() => {
    setState(DEFAULT_COVERAGE);
  }, []);

  const applyPreset = useCallback((preset: CoverageState) => {
    setState(preset);
  }, []);

  return (
    <main className="min-h-dvh" style={{ backgroundColor: BG, color: FG }}>
      <Hero state={state} result={result} onToggle={toggle} onReset={resetToDefault} />

      <div style={{ borderTop: `1px solid ${BORDER}` }}>
        <Reveal>
          <ProductPreview />
        </Reveal>
      </div>

      <div style={{ borderTop: `1px solid ${BORDER}` }}>
        <Reveal>
          <ValueSplit state={state} result={result} onToggle={toggle} onReset={resetToDefault} onApplyPreset={applyPreset} />
        </Reveal>
      </div>

      <div style={{ borderTop: `1px solid ${BORDER}` }}>
        <Reveal>
          <SocialProof />
        </Reveal>
      </div>

      <div style={{ borderTop: `1px solid ${BORDER}` }}>
        <Reveal>
          <ClosingCta result={result} />
        </Reveal>
      </div>
    </main>
  );
}
