'use client';

import { ArrowUpRight } from 'lucide-react';
import Reveal from './Reveal';
import { COLORS } from './data';
import { type TierComparison } from './ladder-math';

interface ClosingCTAProps {
  comparison: TierComparison;
}

/**
 * The rung picked at the top of the page survives all the way to the
 * closing move: the headline AND the button label both name the currently
 * selected tier and its live days-to-sell figure, computed by the exact
 * same `computeComparison` function the hero used — never a hardcoded
 * example that stays put after the ladder selection changes.
 */
export default function ClosingCTA({ comparison }: ClosingCTAProps) {
  const { current } = comparison;

  return (
    <section id="closing-cta" className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 lg:px-8">
      <Reveal>
        <div className="flex flex-col items-start gap-6 rounded-3xl p-8 sm:p-12" style={{ backgroundColor: COLORS.fg }}>
          <p className="text-[13px] font-semibold uppercase tracking-[0.16em]" style={{ color: COLORS.accentTintOnDark }}>
            Your tier, your numbers
          </p>
          <h2
            className="max-w-[640px] text-[28px] font-extrabold leading-[1.15] tracking-[-0.02em] sm:text-[36px]"
            style={{ fontFamily: 'var(--font-display-mono)', color: '#FFFFFF' }}
          >
            {current.name} listings sell in about{' '}
            <span className="tabular-nums">{current.daysToSell} days</span>.
          </h2>
          <p className="max-w-[490px] text-[16px] font-normal leading-[1.6]" style={{ color: COLORS.mutedOnDark }}>
            That estimate, the {current.reach}% buyer reach, and the{' '}
            {current.fee}% fee above all come from the one tier you picked —
            nothing here reverts once you scroll past it.
          </p>
          <a
            href="#ladder-heading"
            className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-[15px] font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ backgroundColor: COLORS.accent, outlineColor: COLORS.accent }}
          >
            <span className="tabular-nums">
              List at {current.name} — ~{current.daysToSell}d to sell
            </span>
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </Reveal>
    </section>
  );
}
