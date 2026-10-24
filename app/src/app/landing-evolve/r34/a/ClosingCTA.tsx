'use client';

import { ArrowUpRight } from 'lucide-react';
import Reveal from './Reveal';
import { COLORS, type Product } from './data';
import { CHIP_MAP, type ChipId, type Ranked } from './reorder-math';

interface ClosingCTAProps {
  ranked: Ranked<Product>[];
  leadChipId: ChipId;
}

/**
 * The visitor's own chip order survives all the way to the closing move:
 * the headline and the button label both name the current top-ranked
 * match and its live match percent, not a fixed example baked in at
 * build time.
 */
export default function ClosingCTA({ ranked, leadChipId }: ClosingCTAProps) {
  const leadChip = CHIP_MAP[leadChipId];
  const top = ranked[0];

  return (
    <section id="get-started" className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 lg:px-8">
      <Reveal>
        <div
          className="flex flex-col items-start gap-6 rounded-3xl p-8 sm:p-12"
          style={{ backgroundColor: COLORS.surface, border: `1px solid ${COLORS.surfaceLine}` }}
        >
          <p className="text-[13px] font-semibold uppercase tracking-[0.16em]" style={{ color: COLORS.accentTint }}>
            Your ranking, right now
          </p>
          <h2
            className="max-w-[640px] text-[30px] font-extrabold leading-[1.1] tracking-[-0.02em] sm:text-[38px]"
            style={{ fontFamily: 'var(--font-display-mono)', color: COLORS.fg }}
          >
            With {leadChip.label.toLowerCase()} first, {top.product.title} leads at{' '}
            <span className="tabular-nums">{top.match}%</span>.
          </h2>
          <p className="max-w-[500px] text-[16px] font-normal leading-[1.6]" style={{ color: COLORS.muted }}>
            That ranking is the order you chose, not a default. The full catalog is
            scored against it the same way these three listings were.
          </p>
          <a
            href="#catalog"
            className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-[15px] font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ backgroundColor: COLORS.accentFill, outlineColor: COLORS.accentTint }}
          >
            <span className="tabular-nums">See your {top.match}% match</span>
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </Reveal>
    </section>
  );
}
