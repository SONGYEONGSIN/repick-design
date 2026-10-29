'use client';

import { ArrowUpRight } from 'lucide-react';
import Reveal from './Reveal';
import { COLORS, type Item } from './data';
import { itemLabel, type Estimate } from './estimate-math';

interface ClosingCTAProps {
  selected: Item;
  estimate: Estimate;
}

/**
 * The visitor's own search selection survives all the way to the closing
 * move: the headline and the button label both name the currently selected
 * item and its live estimated range, computed by the exact same
 * `computeEstimate` function the hero used &mdash; never a hardcoded example
 * that stays put after the search changes.
 */
export default function ClosingCTA({ selected, estimate }: ClosingCTAProps) {
  return (
    <section id="final-cta" className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 lg:px-8">
      <Reveal>
        <div className="flex flex-col items-start gap-6 rounded-3xl p-8 sm:p-12" style={{ backgroundColor: COLORS.surface, border: `1px solid ${COLORS.surfaceLine}` }}>
          <p className="text-[13px] font-semibold uppercase tracking-[0.16em]" style={{ color: COLORS.accentTint }}>
            Your estimate, from your search
          </p>
          <h2
            className="max-w-[640px] text-[30px] font-extrabold leading-[1.1] tracking-[-0.02em] sm:text-[38px]"
            style={{ fontFamily: 'var(--font-display-grotesk)', color: COLORS.fg }}
          >
            A {selected.grade} {itemLabel(selected)} estimates at{' '}
            <span className="tabular-nums">
              ${estimate.low}&ndash;${estimate.high}
            </span>
            .
          </h2>
          <p className="max-w-[500px] text-[16px] font-normal leading-[1.6]" style={{ color: COLORS.muted }}>
            That range comes from a real comparable sale and your item&apos;s own grade, the same
            way every listing on Repick is priced before it ever goes live.
          </p>
          <a
            href="#instant-estimate-search"
            className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-[15px] font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ backgroundColor: COLORS.accentFill, outlineColor: COLORS.accentTint }}
          >
            <span className="tabular-nums">Start listing this item</span>
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </Reveal>
    </section>
  );
}
