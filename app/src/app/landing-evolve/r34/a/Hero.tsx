'use client';

import { ArrowUpRight } from 'lucide-react';
import ReorderDevice from './ReorderDevice';
import ProductCard from './ProductCard';
import { COLORS } from './data';
import { CHIP_MAP, type ChipId, type Ranked } from './reorder-math';
import type { Product } from './data';

interface HeroProps {
  order: ChipId[];
  onReorder: (next: ChipId[]) => void;
  ranked: Ranked<Product>[];
  leadChipId: ChipId;
}

/**
 * Hero carries the headline, the single CTA, the Priority Order device, AND
 * the full three-card match grid — all inside this one component's own
 * return. The grid is not a static preview: `ranked` is recomputed from the
 * visitor's current chip order on every render, and each card's rank/match
 * badge reflects that live order, not a fixed lookup.
 */
export default function Hero({ order, onReorder, ranked, leadChipId }: HeroProps) {
  const leadChip = CHIP_MAP[leadChipId];
  const top = ranked[0];

  return (
    <section className="mx-auto max-w-[1280px] px-4 pb-16 pt-10 sm:px-6 sm:pt-14 lg:px-8">
      <div className="flex flex-col gap-5">
        <span
          className="text-[13px] font-semibold uppercase tracking-[0.28em]"
          style={{ color: COLORS.accentTint }}
        >
          AI secondhand matching
        </span>

        <h1
          className="max-w-[720px] text-[clamp(2.25rem,9vw,3rem)] font-extrabold leading-[1.04] tracking-[-0.02em] lg:text-[clamp(3.25rem,5.5vw,5.5rem)]"
          style={{ fontFamily: 'var(--font-display-mono)', color: COLORS.fg }}
        >
          Rank what matters.
          <br />
          Watch the matches follow.
        </h1>

        <p
          className="max-w-[500px] text-[16px] font-normal leading-[1.6]"
          style={{ color: COLORS.muted }}
        >
          Reorder the four priorities below and every match percent on this page
          recomputes instantly. Right now {leadChip.label.toLowerCase()} leads, and{' '}
          <span className="font-semibold" style={{ color: COLORS.fg }}>
            {top.product.title}
          </span>{' '}
          is the top match at{' '}
          <span className="tabular-nums font-semibold" style={{ color: COLORS.fg }}>
            {top.match}%
          </span>
          .
        </p>

        <div>
          <a
            href="#catalog"
            className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-[15px] font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ backgroundColor: COLORS.accentFill, outlineColor: COLORS.accentTint }}
          >
            See today&apos;s top match
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.1fr] lg:items-start lg:gap-8">
        {/* Left: the reorder device itself */}
        <div
          className="rounded-3xl p-5 sm:p-6"
          style={{ backgroundColor: COLORS.surface, border: `1px solid ${COLORS.surfaceLine}` }}
        >
          <ReorderDevice order={order} onReorder={onReorder} />
        </div>

        {/* Right: the live, re-sorting card grid — the mandatory proof, inside Hero.
            A concise status announces the result of a reorder instead of letting
            an aria-live region re-read all three full cards on every move. */}
        <div className="flex flex-col gap-3">
          <p className="sr-only" role="status" aria-live="polite">
            Top match: {top.product.title} at {top.match}%.
          </p>
          {ranked.map(({ product, match, rank }) => (
            <ProductCard
              key={product.id}
              product={product}
              match={match}
              rank={rank}
              leadChipId={leadChipId}
              variant="compact"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
