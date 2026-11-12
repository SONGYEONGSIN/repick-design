'use client';

import { useCallback, useMemo, useState } from 'react';
import Hero from './Hero';
import ProductPreview from './ProductPreview';
import ValueSection from './ValueSection';
import SocialProof from './SocialProof';
import ClosingCTA from './ClosingCTA';
import { COLORS, DEFAULT_ITEM_ID, ITEMS, type Item } from './data';
import { computeEstimate, getComparables } from './estimate-math';

const DEFAULT_ITEM = ITEMS.find((item) => item.id === DEFAULT_ITEM_ID) ?? ITEMS[0];

export default function LandingPage() {
  const [selected, setSelected] = useState<Item>(DEFAULT_ITEM);

  const estimate = useMemo(() => computeEstimate(selected), [selected]);
  const comparables = useMemo(() => getComparables(selected), [selected]);

  const handleSelect = useCallback((item: Item) => setSelected(item), []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.bg, color: COLORS.fg }}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:px-4 focus:py-2 focus:text-[14px] focus:font-semibold"
        style={{ backgroundColor: COLORS.accentFill, color: COLORS.fg }}
      >
        Skip to main content
      </a>

      <header className="sticky top-0 z-40 border-b backdrop-blur" style={{ backgroundColor: 'rgba(11,11,15,0.86)', borderColor: COLORS.surfaceLine }}>
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <span className="text-[18px] font-extrabold tracking-[-0.02em]" style={{ fontFamily: 'var(--font-display-grotesk)', color: COLORS.fg }}>
            repick
          </span>

          <nav className="hidden items-center gap-6 sm:flex" aria-label="Primary">
            <a href="#comps" className="text-[14px] font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2" style={{ color: COLORS.muted, outlineColor: COLORS.accentTint }}>
              Comparable sales
            </a>
            <a href="#value" className="text-[14px] font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2" style={{ color: COLORS.muted, outlineColor: COLORS.accentTint }}>
              How pricing works
            </a>
            <a href="#proof" className="text-[14px] font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2" style={{ color: COLORS.muted, outlineColor: COLORS.accentTint }}>
              Proof
            </a>
          </nav>

          <a
            href="#instant-estimate-search"
            className="inline-flex items-center rounded-full px-4 py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ backgroundColor: COLORS.accentFill, outlineColor: COLORS.accentTint }}
          >
            Get an estimate
          </a>
        </div>
      </header>

      <main id="main-content">
        <Hero selected={selected} estimate={estimate} comparables={comparables} onSelect={handleSelect} />
        <ProductPreview selected={selected} comparables={comparables} />
        <ValueSection selected={selected} estimate={estimate} comparables={comparables} />
        <SocialProof />
        <ClosingCTA selected={selected} estimate={estimate} />
      </main>

      <footer className="mx-auto max-w-[1280px] px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-[13px] font-normal leading-[1.6]" style={{ color: COLORS.muted }}>
          repick &mdash; the item you search is the estimate you see, everywhere on this page.
        </p>
      </footer>
    </div>
  );
}
