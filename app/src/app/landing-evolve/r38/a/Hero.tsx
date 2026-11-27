'use client';

import { ArrowUpRight } from 'lucide-react';
import Ladder from './Ladder';
import ComparisonStrip from './ComparisonStrip';
import ProofCard from './ProofCard';
import { COLORS, PREVIEW_ITEMS } from './data';
import { type TierComparison } from './ladder-math';

interface HeroProps {
  selectedIndex: number;
  onSelect: (index: number) => void;
  comparison: TierComparison;
}

/**
 * Hero carries the headline, the single primary CTA, the ladder device,
 * AND the full live comparison panel AND the product-preview proof cards —
 * all inside this one component's own return, per the brief's hard
 * requirement that the device and the proof cards share one grid rather
 * than being split across sections. Nothing here reads a static example:
 * `comparison` is recomputed in LandingPage from whichever rung is
 * currently selected.
 */
export default function Hero({ selectedIndex, onSelect, comparison }: HeroProps) {
  const { current } = comparison;

  return (
    <section className="mx-auto max-w-[1280px] px-4 pb-16 pt-10 sm:px-6 sm:pt-14 lg:px-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
        <div className="flex flex-col gap-5 lg:col-span-7">
          <span
            className="text-[13px] font-semibold uppercase tracking-[0.28em]"
            style={{ color: COLORS.accent }}
          >
            Seller verification ladder
          </span>

          <h1
            className="text-[clamp(2.1rem,8.5vw,2.9rem)] font-extrabold leading-[1.08] tracking-[-0.02em] lg:text-[clamp(2.75rem,4.6vw,4.25rem)]"
            style={{ fontFamily: 'var(--font-display-mono)', color: COLORS.fg }}
          >
            Every rung you climb sells your item faster.
          </h1>

          <p className="max-w-[490px] text-[16px] font-normal leading-[1.6]" style={{ color: COLORS.mutedOnBg }}>
            Choose how deep Repick checks an item before it lists. Climb the
            ladder below and three numbers move together: speed, reach, and
            what Repick keeps for the work.
          </p>

          <div>
            <a
              href="#closing-cta"
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-[15px] font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{ backgroundColor: COLORS.accent, outlineColor: COLORS.accent }}
            >
              List at {current.name}
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="flex flex-col items-start justify-end gap-2 lg:col-span-5">
          <p
            aria-hidden="true"
            className="text-[clamp(3.5rem,11vw,5.5rem)] font-extrabold leading-none"
            style={{ fontFamily: 'var(--font-display-mono)', color: COLORS.mutedOnBg }}
          >
            05
          </p>
          <p className="text-[13px] font-semibold uppercase tracking-[0.16em]" style={{ color: COLORS.mutedOnBg }}>
            Fig. 01 — five tiers, one click each
          </p>
        </div>
      </div>

      <div
        className="mt-10 rounded-3xl p-5 sm:p-6"
        style={{ backgroundColor: COLORS.surface, border: `1px solid ${COLORS.surfaceLine}` }}
      >
        <p className="sr-only" role="status" aria-live="polite">
          {current.name} selected: about {current.daysToSell} days to sell, {current.reach}% buyer
          reach, {current.fee}% service fee.
        </p>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 id="ladder-heading" className="mb-3 text-[15px] font-semibold" style={{ color: COLORS.fg }}>
              Pick your verification tier
            </h2>
            <Ladder selectedIndex={selectedIndex} onSelect={onSelect} labelId="ladder-heading" />
          </div>

          <div className="flex flex-col gap-5 lg:col-span-7">
            <div
              className="rounded-2xl p-4"
              style={{ backgroundColor: '#FFFFFF', border: `2px solid ${COLORS.accent}` }}
            >
              <p className="text-[12px] font-semibold uppercase tracking-[0.14em]" style={{ color: COLORS.accentDeep }}>
                Estimated days to sell
              </p>
              <p
                className="tabular-nums text-[clamp(2.25rem,5vw,3rem)] font-extrabold leading-none tracking-[-0.02em]"
                style={{ fontFamily: 'var(--font-display-mono)', color: COLORS.fg }}
              >
                {current.daysToSell}
              </p>
              <p className="mt-1 text-[13px] font-normal leading-[1.4]" style={{ color: COLORS.mutedOnBg }}>
                {current.description}
              </p>
            </div>

            <ComparisonStrip comparison={comparison} />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {PREVIEW_ITEMS.map((item) => (
            <ProofCard key={item.id} item={item} variant="compact" />
          ))}
        </div>
      </div>
    </section>
  );
}
