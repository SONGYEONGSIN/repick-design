'use client';

import Reveal from './Reveal';
import { COLORS } from './data';
import { formatFee, type TierComparison } from './ladder-math';

interface ValueSectionProps {
  comparison: TierComparison;
}

/**
 * Three outcomes of the current rung, all recomputed live from
 * `comparison` — none is a static lookup. Climb a rung above and all
 * three figures below will already have moved by the time you scroll
 * back down to them.
 */
export default function ValueSection({ comparison }: ValueSectionProps) {
  const { current, baseline, isBaseline, vsBaseline } = comparison;

  return (
    <section id="value" className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 lg:px-8">
      <Reveal>
        <div className="mb-10 flex flex-col gap-3 sm:max-w-[500px]">
          <h2
            className="text-[26px] font-extrabold leading-[1.15] tracking-[-0.02em] sm:text-[30px]"
            style={{ fontFamily: 'var(--font-display-mono)', color: COLORS.fg }}
          >
            Climbing one rung moves three numbers, not one.
          </h2>
          <p className="max-w-[490px] text-[16px] font-normal leading-[1.6]" style={{ color: COLORS.mutedOnBg }}>
            These figures track the tier you picked above. Step up or down
            the ladder and all three move together, never on their own.
          </p>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <Reveal delay={0}>
          <div className="flex h-full flex-col gap-3 rounded-2xl p-6" style={{ backgroundColor: COLORS.surface, border: `1px solid ${COLORS.surfaceLine}` }}>
            <p className="text-[13px] font-semibold uppercase tracking-[0.16em]" style={{ color: COLORS.accentDeep }}>
              Estimated days to sell
            </p>
            <p className="tabular-nums text-[40px] font-extrabold leading-none tracking-[-0.02em]" style={{ fontFamily: 'var(--font-display-mono)', color: COLORS.fg }}>
              {current.daysToSell}
            </p>
            <p className="text-[14px] font-normal leading-[1.6]" style={{ color: COLORS.mutedOnSurface }}>
              {isBaseline
                ? `The slowest tier Repick offers.`
                : `${vsBaseline.daysSaved} days faster than ${baseline.name}.`}
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="flex h-full flex-col gap-3 rounded-2xl p-6" style={{ backgroundColor: COLORS.surface, border: `1px solid ${COLORS.surfaceLine}` }}>
            <p className="text-[13px] font-semibold uppercase tracking-[0.16em]" style={{ color: COLORS.accentDeep }}>
              Buyer reach
            </p>
            <p className="tabular-nums text-[40px] font-extrabold leading-none tracking-[-0.02em]" style={{ fontFamily: 'var(--font-display-mono)', color: COLORS.fg }}>
              {current.reach}%
            </p>
            <p className="text-[14px] font-normal leading-[1.6]" style={{ color: COLORS.mutedOnSurface }}>
              {isBaseline
                ? `The narrowest buyer pool this ladder reaches.`
                : `${vsBaseline.reachGain} points more of the active buyer pool than ${baseline.name}.`}
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.16}>
          <div className="flex h-full flex-col gap-3 rounded-2xl p-6" style={{ backgroundColor: COLORS.surface, border: `1px solid ${COLORS.surfaceLine}` }}>
            <p className="text-[13px] font-semibold uppercase tracking-[0.16em]" style={{ color: COLORS.accentDeep }}>
              Repick service fee
            </p>
            <p className="tabular-nums text-[40px] font-extrabold leading-none tracking-[-0.02em]" style={{ fontFamily: 'var(--font-display-mono)', color: COLORS.fg }}>
              {formatFee(current.fee)}
            </p>
            <p className="text-[14px] font-normal leading-[1.6]" style={{ color: COLORS.mutedOnSurface }}>
              Covers the extra verification work behind this tier — shown
              before you list, not after.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
