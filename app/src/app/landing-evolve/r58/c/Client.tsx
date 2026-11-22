"use client";

import { useState } from "react";
import { MotionConfig } from "framer-motion";
import TopBar from "./components/TopBar";
import Hero from "./components/Hero";
import ProductPreview from "./components/ProductPreview";
import ValueSplit from "./components/ValueSplit";
import SocialProof from "./components/SocialProof";
import ClosingCTA from "./components/ClosingCTA";
import {
  DEFAULT_SPEED,
  DEFAULT_INSURANCE,
  deriveCombo,
  type Speed,
  type Insurance,
} from "./lib/delivery";

/**
 * Owns the one piece of live state for the whole page: the current Delivery Grid Pick
 * selection. `deriveCombo` is called once here and the resulting object is threaded down to
 * every section that cites it, so the hero readout, the comparison strip inside it, the live
 * line on the first product card, and the closing CTA always show the identical numbers.
 *
 * Reset behavior: there is no separate "reset" control, but the default on first load
 * (Express + Full Coverage) is the same non-trivial combination the grid returns to if a
 * future reset action were added, since it is a named constant rather than an accident of
 * initial render order.
 */
export default function Client() {
  const [speed, setSpeed] = useState<Speed>(DEFAULT_SPEED);
  const [insurance, setInsurance] = useState<Insurance>(DEFAULT_INSURANCE);

  const combo = deriveCombo(speed, insurance);

  function handleSelect(nextSpeed: Speed, nextInsurance: Insurance) {
    setSpeed(nextSpeed);
    setInsurance(nextInsurance);
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-[#0B0B0F] text-white">
        <TopBar />
        <Hero speed={speed} insurance={insurance} onSelect={handleSelect} />
        <ProductPreview combo={combo} />
        <ValueSplit />
        <SocialProof />
        <ClosingCTA combo={combo} />
        <footer className="border-t border-zinc-800/80 py-8">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-10">
            <p className="text-xs text-zinc-400">
              Reloop is a demonstration concept. Prices, delivery windows and seller statistics
              on this page are illustrative only.
            </p>
          </div>
        </footer>
      </div>
    </MotionConfig>
  );
}
