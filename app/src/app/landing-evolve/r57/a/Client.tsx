"use client";

import { useState } from "react";
import { ClosingCta } from "./ClosingCta";
import { DEFAULT_MAX, DEFAULT_MIN, PRICE_MAX_BOUND, PRICE_MIN_BOUND, PRICE_STEP } from "./data";
import { Hero } from "./Hero";
import { ProductPreview } from "./ProductPreview";
import { Rail } from "./Rail";
import { Reveal } from "./Reveal";
import { SocialProof } from "./SocialProof";
import { ValueSplit } from "./ValueSplit";
import { BG, BORDER, FG } from "./tokens";

/**
 * Single source of truth for the page's one control: the two price-range handles. Lifted here
 * and handed to Hero, ValueSplit, and ClosingCta so the hero's compact slider, its full mirror in
 * the checklist section, and every number derived from either, always agree — none of them keeps
 * its own copy of the state.
 */
export default function Client() {
  const [min, setMin] = useState(DEFAULT_MIN);
  const [max, setMax] = useState(DEFAULT_MAX);

  function changeMin(next: number) {
    setMin(Math.max(PRICE_MIN_BOUND, Math.round(next / PRICE_STEP) * PRICE_STEP));
  }
  function changeMax(next: number) {
    setMax(Math.min(PRICE_MAX_BOUND, Math.round(next / PRICE_STEP) * PRICE_STEP));
  }

  return (
    <main className="min-h-dvh lg:flex" style={{ backgroundColor: BG, color: FG }}>
      <Rail />
      <div className="min-w-0 flex-1 lg:border-l-0" style={{ borderColor: BORDER }}>
        <Hero min={min} max={max} onChangeMin={changeMin} onChangeMax={changeMax} />

        <div style={{ borderTop: `1px solid ${BORDER}` }}>
          <Reveal>
            <ProductPreview min={min} max={max} />
          </Reveal>
        </div>

        <div style={{ borderTop: `1px solid ${BORDER}` }}>
          <Reveal>
            <ValueSplit min={min} max={max} onChangeMin={changeMin} onChangeMax={changeMax} />
          </Reveal>
        </div>

        <div style={{ borderTop: `1px solid ${BORDER}` }}>
          <Reveal>
            <SocialProof />
          </Reveal>
        </div>

        <div style={{ borderTop: `1px solid ${BORDER}` }}>
          <Reveal>
            <ClosingCta min={min} max={max} />
          </Reveal>
        </div>
      </div>
    </main>
  );
}
