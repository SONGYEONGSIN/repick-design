'use client';

import { useCallback, useMemo, useState } from 'react';
import Hero from './Hero';
import ProductPreview from './ProductPreview';
import ValueSection from './ValueSection';
import SocialProof from './SocialProof';
import ClosingCTA from './ClosingCTA';
import { COLORS, PRODUCTS } from './data';
import { DEFAULT_ORDER, rankProducts, type ChipId } from './reorder-math';

export default function LandingPage() {
  const [order, setOrder] = useState<ChipId[]>(DEFAULT_ORDER);

  const ranked = useMemo(() => rankProducts(PRODUCTS, order), [order]);
  const leadChipId = order[0];

  const handleReorder = useCallback((next: ChipId[]) => setOrder(next), []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.bg, color: COLORS.fg }}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:px-4 focus:py-2 focus:text-[14px] focus:font-semibold"
        style={{ backgroundColor: COLORS.accentFill, color: COLORS.fg }}
      >
        Skip to main content
      </a>

      <header
        className="sticky top-0 z-40 border-b backdrop-blur"
        style={{ backgroundColor: 'rgba(11,11,15,0.86)', borderColor: COLORS.surfaceLine }}
      >
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <span
            className="text-[18px] font-extrabold tracking-[-0.02em]"
            style={{ fontFamily: 'var(--font-display-mono)', color: COLORS.fg }}
          >
            repick
          </span>

          <nav className="hidden items-center gap-6 sm:flex" aria-label="Primary">
            <a
              href="#value"
              className="text-[14px] font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{ color: COLORS.muted, outlineColor: COLORS.accentTint }}
            >
              Why it matters
            </a>
            <a
              href="#catalog"
              className="text-[14px] font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{ color: COLORS.muted, outlineColor: COLORS.accentTint }}
            >
              Catalog
            </a>
            <a
              href="#proof"
              className="text-[14px] font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{ color: COLORS.muted, outlineColor: COLORS.accentTint }}
            >
              Proof
            </a>
          </nav>

          <a
            href="#catalog"
            className="inline-flex items-center rounded-full px-4 py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ backgroundColor: COLORS.accentFill, outlineColor: COLORS.accentTint }}
          >
            View catalog
          </a>
        </div>
      </header>

      <main id="main-content">
        <Hero order={order} onReorder={handleReorder} ranked={ranked} leadChipId={leadChipId} />
        <ProductPreview ranked={ranked} leadChipId={leadChipId} />
        <ValueSection order={order} ranked={ranked} leadChipId={leadChipId} />
        <SocialProof />
        <ClosingCTA ranked={ranked} leadChipId={leadChipId} />
      </main>

      <footer className="mx-auto max-w-[1280px] px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-[13px] font-normal leading-[1.6]" style={{ color: COLORS.muted }}>
          repick — the match you rank is the match you see, everywhere on this page.
        </p>
      </footer>
    </div>
  );
}
