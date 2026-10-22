'use client';

import { useCallback, useMemo, useState } from 'react';
import Hero from './Hero';
import ProductPreview from './ProductPreview';
import ValueSection from './ValueSection';
import SocialProof from './SocialProof';
import ClosingCTA from './ClosingCTA';
import { COLORS } from './data';
import { computeComparison, DEFAULT_TIER_INDEX } from './ladder-math';

export default function LandingPage() {
  const [selectedIndex, setSelectedIndex] = useState<number>(DEFAULT_TIER_INDEX);

  const comparison = useMemo(() => computeComparison(selectedIndex), [selectedIndex]);

  const handleSelect = useCallback((index: number) => setSelectedIndex(index), []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.bg, color: COLORS.fg }}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:px-4 focus:py-2 focus:text-[14px] focus:font-semibold focus:text-white"
        style={{ backgroundColor: COLORS.accent }}
      >
        Skip to main content
      </a>

      <header className="sticky top-0 z-40 border-b backdrop-blur" style={{ backgroundColor: 'rgba(255,255,255,0.88)', borderColor: COLORS.surfaceLine }}>
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <span className="text-[18px] font-extrabold tracking-[-0.02em]" style={{ fontFamily: 'var(--font-display-mono)', color: COLORS.fg }}>
            repick
          </span>

          <nav className="hidden items-center gap-6 sm:flex" aria-label="Primary">
            <a href="#ladder-heading" className="text-[14px] font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2" style={{ color: COLORS.mutedOnBg, outlineColor: COLORS.accent }}>
              Verification ladder
            </a>
            <a href="#value" className="text-[14px] font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2" style={{ color: COLORS.mutedOnBg, outlineColor: COLORS.accent }}>
              How tiers pay off
            </a>
            <a href="#proof" className="text-[14px] font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2" style={{ color: COLORS.mutedOnBg, outlineColor: COLORS.accent }}>
              Proof
            </a>
          </nav>

          <a
            href="#ladder-heading"
            className="inline-flex items-center rounded-full px-4 py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ backgroundColor: COLORS.accent, outlineColor: COLORS.accent }}
          >
            Start listing
          </a>
        </div>
      </header>

      <main id="main-content">
        <Hero selectedIndex={selectedIndex} onSelect={handleSelect} comparison={comparison} />
        <ProductPreview />
        <ValueSection comparison={comparison} />
        <SocialProof />
        <ClosingCTA comparison={comparison} />
      </main>

      <footer className="mx-auto max-w-[1280px] px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-[13px] font-normal leading-[1.6]" style={{ color: COLORS.mutedOnBg }}>
          repick &mdash; the tier you pick is the listing you get, everywhere on this page.
        </p>
      </footer>
    </div>
  );
}
