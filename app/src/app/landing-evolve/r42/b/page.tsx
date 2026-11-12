"use client";

import { useMemo, useState } from "react";
import Hero from "./Hero";
import ProductPreview from "./ProductPreview";
import ValueSplit from "./ValueSplit";
import SocialProof from "./SocialProof";
import ClosingCTA from "./ClosingCTA";
import {
  DEFAULT_WEIGHTS,
  LISTINGS,
  dominantWeightLabel,
  leaderOf,
  weakestWeightLabel,
  weightedScore,
  tiltDegrees,
  FOCUS_RING,
  type Weights,
} from "./data";

export default function Page() {
  const [weights, setWeights] = useState<Weights>(DEFAULT_WEIGHTS);

  function handleWeightChange(key: keyof Weights, value: number) {
    setWeights((w) => ({ ...w, [key]: value }));
  }
  function handleReset() {
    setWeights(DEFAULT_WEIGHTS);
  }

  const scoreLeft = useMemo(() => weightedScore(LISTINGS.left, weights), [weights]);
  const scoreRight = useMemo(() => weightedScore(LISTINGS.right, weights), [weights]);
  const tilt = useMemo(() => tiltDegrees(scoreLeft, scoreRight), [scoreLeft, scoreRight]);
  const leaderId = useMemo(() => leaderOf(scoreLeft, scoreRight), [scoreLeft, scoreRight]);
  const leaderName = leaderId === "tie" ? null : LISTINGS[leaderId].seller;
  const dominant = useMemo(() => dominantWeightLabel(weights), [weights]);
  const weakest = useMemo(() => weakestWeightLabel(weights), [weights]);

  return (
    <div className="min-h-screen bg-white text-zinc-950">
      <a
        href="#main-content"
        className={`sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-50 focus-visible:rounded-md focus-visible:bg-[#15803d] focus-visible:px-4 focus-visible:py-2 focus-visible:text-sm focus-visible:font-semibold focus-visible:text-white ${FOCUS_RING}`}
      >
        Skip to content
      </a>

      <header className="border-b border-zinc-100 px-4 py-5 sm:px-6 lg:px-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <span className="text-sm font-semibold tracking-[-0.02em] text-zinc-950">repick</span>
          <nav className="hidden items-center gap-6 sm:flex" aria-label="Primary">
            <a href="#breakdown" className={`text-sm font-semibold text-zinc-600 transition-colors duration-200 hover:text-zinc-950 ${FOCUS_RING} rounded-sm`}>
              The breakdown
            </a>
            <a href="#proof" className={`text-sm font-semibold text-zinc-600 transition-colors duration-200 hover:text-zinc-950 ${FOCUS_RING} rounded-sm`}>
              Reviews
            </a>
          </nav>
          <a
            href="#compare"
            className={`inline-flex items-center rounded-full bg-[#15803d] px-4 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#166534] ${FOCUS_RING}`}
          >
            Tip the scale
          </a>
        </div>
      </header>

      <main id="main-content">
        <Hero
          weights={weights}
          onWeightChange={handleWeightChange}
          onReset={handleReset}
          scoreLeft={scoreLeft}
          scoreRight={scoreRight}
          tilt={tilt}
          leaderId={leaderId}
        />
        <ProductPreview scoreLeft={scoreLeft} scoreRight={scoreRight} leaderId={leaderId} />
        <ValueSplit />
        <SocialProof />
        <ClosingCTA
          leaderId={leaderId}
          leaderName={leaderName}
          scoreLeft={scoreLeft}
          scoreRight={scoreRight}
          dominant={dominant}
          weakest={weakest}
        />
      </main>

      <footer className="border-t border-zinc-100 px-4 py-10 sm:px-6 lg:px-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 text-xs font-normal text-zinc-600 sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 repick. Resale, weighed fairly.</span>
          <span>The two listings shown are sample data for illustration.</span>
        </div>
      </footer>
    </div>
  );
}
