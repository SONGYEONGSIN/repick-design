'use client';

import Reveal from './Reveal';
import { COLORS, type Item } from './data';
import { itemLabel, type Estimate } from './estimate-math';

interface ValueSectionProps {
  selected: Item;
  estimate: Estimate;
  comparables: Item[];
}

/**
 * Three outcomes of the current search selection, all recomputed live from
 * `selected`/`estimate`/`comparables` &mdash; none of the three is a static
 * lookup. Pick a different item above and all three numbers below will
 * already have changed by the time you scroll back down.
 */
export default function ValueSection({ selected, estimate, comparables }: ValueSectionProps) {
  const nearest = comparables[0];
  const nearestGap = nearest ? Math.abs(nearest.sold - selected.sold) : 0;

  return (
    <section id="value" className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 lg:px-8">
      <Reveal>
        <div className="mb-10 flex flex-col gap-3 sm:max-w-[500px]">
          <h2
            className="text-[28px] font-extrabold leading-[1.1] tracking-[-0.02em] sm:text-[32px]"
            style={{ fontFamily: 'var(--font-display-grotesk)', color: COLORS.fg }}
          >
            Picking a different item changes more than the headline number.
          </h2>
          <p className="max-w-[500px] text-[16px] font-normal leading-[1.6]" style={{ color: COLORS.muted }}>
            These three figures answer to the same search as the hero. Select a new item up
            there, and they will already have moved down here.
          </p>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <Reveal delay={0}>
          <div className="flex h-full flex-col gap-3 rounded-2xl p-6" style={{ backgroundColor: COLORS.surface, border: `1px solid ${COLORS.surfaceLine}` }}>
            <p className="text-[13px] font-semibold uppercase tracking-[0.16em]" style={{ color: COLORS.accentTint }}>
              Estimated payout, right now
            </p>
            <p className="tabular-nums text-[40px] font-extrabold leading-none tracking-[-0.02em]" style={{ fontFamily: 'var(--font-display-grotesk)', color: COLORS.fg }}>
              ${estimate.low}&ndash;${estimate.high}
            </p>
            <p className="text-[14px] font-normal leading-[1.6]" style={{ color: COLORS.muted }}>
              For {itemLabel(selected)}, graded {selected.grade}.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="flex h-full flex-col gap-3 rounded-2xl p-6" style={{ backgroundColor: COLORS.surface, border: `1px solid ${COLORS.surfaceLine}` }}>
            <p className="text-[13px] font-semibold uppercase tracking-[0.16em]" style={{ color: COLORS.accentTint }}>
              Platform fee on this item
            </p>
            <p className="tabular-nums text-[40px] font-extrabold leading-none tracking-[-0.02em]" style={{ fontFamily: 'var(--font-display-grotesk)', color: COLORS.fg }}>
              ${estimate.fee}
            </p>
            <p className="text-[14px] font-normal leading-[1.6]" style={{ color: COLORS.muted }}>
              12% of the comp-adjusted value, the rest is the payout above.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.16}>
          <div className="flex h-full flex-col gap-3 rounded-2xl p-6" style={{ backgroundColor: COLORS.surface, border: `1px solid ${COLORS.surfaceLine}` }}>
            <p className="text-[13px] font-semibold uppercase tracking-[0.16em]" style={{ color: COLORS.accentTint }}>
              Nearest comp gap
            </p>
            <p className="tabular-nums text-[40px] font-extrabold leading-none tracking-[-0.02em]" style={{ fontFamily: 'var(--font-display-grotesk)', color: COLORS.fg }}>
              ${nearestGap}
            </p>
            <p className="text-[14px] font-normal leading-[1.6]" style={{ color: COLORS.muted }}>
              {nearest ? `Separates ${itemLabel(selected)} from ${itemLabel(nearest)}.` : 'No comps found for this category.'}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
