'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { COLORS } from './data';
import { TIERS, type TierComparison } from './ladder-math';
import { useMounted } from './useMounted';

interface ComparisonStripProps {
  comparison: TierComparison;
}

/**
 * Makes the recompute legible, not just a number flipping: a horizontal
 * buyer-reach bar with a tick for every tier (so the selected tier's
 * position is visible relative to all five, not just relative to one
 * number), plus two worded deltas — against the rung directly below and
 * against the fixed Tier-1 baseline. Meaning never rides on color alone:
 * every delta is stated in words and digits, the bar is a visual echo of
 * numbers already printed beside it.
 */
export default function ComparisonStrip({ comparison }: ComparisonStripProps) {
  const mounted = useMounted();
  const reduceMotion = useReducedMotion();
  const shouldAnimate = mounted && !reduceMotion;
  const { current, baseline, below, isBaseline, vsBaseline, vsBelow } = comparison;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-[12px] font-semibold uppercase tracking-[0.16em]" style={{ color: COLORS.mutedOnSurface }}>
          Buyer reach at this tier
        </p>
        <motion.p
          key={current.id}
          initial={shouldAnimate ? { opacity: 0, y: 4 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="tabular-nums text-[22px] font-extrabold leading-none"
          style={{ fontFamily: 'var(--font-display-mono)', color: COLORS.fg }}
        >
          {current.reach}%
        </motion.p>
      </div>

      <div className="relative h-2.5 overflow-hidden rounded-full" style={{ backgroundColor: COLORS.surfaceLine }}>
        {/* Width itself never animates (compositor-unfriendly) — a full-width
            bar scales from the left via `transform: scaleX`, opacity/transform
            only. */}
        <motion.div
          className="h-full w-full rounded-full"
          style={{ backgroundColor: COLORS.accent, transformOrigin: 'left', willChange: 'transform' }}
          initial={false}
          animate={{ scaleX: current.reach / 100 }}
          transition={{ duration: shouldAnimate ? 0.4 : 0, ease: 'easeOut' }}
        />
        {TIERS.map((tier) => (
          <span
            key={tier.id}
            aria-hidden="true"
            className="absolute top-1/2 h-2 w-[2px] -translate-y-1/2 rounded-full"
            style={{ left: `${tier.reach}%`, backgroundColor: tier.id === current.id ? COLORS.fg : '#FFFFFF' }}
          />
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <span
          className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[12px] font-semibold"
          style={{ backgroundColor: COLORS.accentSoft, color: COLORS.accentDeep }}
        >
          {isBaseline
            ? `This is the starting tier — every rung above adds reach.`
            : `+${vsBaseline.reachGain} pts reach vs. ${baseline.name}`}
        </span>
        {!isBaseline && vsBelow && below && (
          <span
            className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[12px] font-semibold"
            style={{ border: `1px solid ${COLORS.surfaceLine}`, color: COLORS.mutedOnSurface }}
          >
            +{vsBelow.reachGain} pts vs. {below.name}
          </span>
        )}
      </div>
    </div>
  );
}
