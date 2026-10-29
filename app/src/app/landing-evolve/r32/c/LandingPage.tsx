'use client';

import { useMemo, useState } from 'react';
import Hero from './Hero';
import ProductPreview from './ProductPreview';
import ValueSection from './ValueSection';
import SocialProof from './SocialProof';
import ClosingCTA from './ClosingCTA';
import { DEFAULT_THRESHOLDS, computeDerivedStats, type Thresholds } from './data';

export default function LandingPage() {
  const [thresholds, setThresholds] = useState<Thresholds>(DEFAULT_THRESHOLDS);

  // Single source of truth: every count/percentage/average on the page
  // (the Hero's live readout, the Value section's three stats, and the
  // closing CTA's headline + button label) is derived from this one object,
  // computed once per render — never recomputed separately downstream.
  const derived = useMemo(() => computeDerivedStats(thresholds), [thresholds]);

  function handleThresholdChange(next: Partial<Thresholds>) {
    setThresholds((prev) => ({ ...prev, ...next }));
  }

  return (
    <div className="bg-white">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-zinc-900 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a3e635]"
      >
        Skip to content
      </a>

      <header className="mx-auto flex max-w-[1200px] items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
        <span className="text-sm font-extrabold tracking-[-0.02em] text-zinc-900">repick</span>
        <a
          href="#preview"
          className="rounded-full px-3 py-1.5 text-sm font-semibold text-zinc-600 transition-colors hover:text-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4d7c0f]"
        >
          See listings
        </a>
      </header>

      <main id="main">
        <Hero thresholds={thresholds} derived={derived} onChange={handleThresholdChange} />
        <ProductPreview />
        <ValueSection derived={derived} />
        <SocialProof />
        <ClosingCTA derived={derived} />
      </main>

      <footer className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 lg:px-8">
        <p className="max-w-[500px] text-sm leading-[1.6] text-zinc-500">
          Every listing on repick clears a price, a condition grade, and a
          trust score before it reaches you. repick, 2026.
        </p>
      </footer>
    </div>
  );
}
