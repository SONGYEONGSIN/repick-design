/**
 * Pure data + pure functions behind "The Proof Ladder" device. Every number
 * on the page traces back to `TIERS` through one of the functions below —
 * nothing is computed inline in a component, so the hero, the value
 * section, and the closing CTA can never drift out of sync with each other
 * or with whichever rung is currently selected.
 *
 * Numbers are fixed, hand-authored illustrative figures (never
 * `Math.random`/`Date.now`), monotonic across the five tiers: each rung up
 * the ladder sells faster and reaches more of the active buyer pool, at the
 * cost of a larger service fee for the extra verification work behind it.
 */
export interface Tier {
  id: string;
  /** Full name — this is also the radio's accessible name (visible text). */
  name: string;
  description: string;
  /** Share of the active buyer pool whose minimum-verification filter this tier clears. */
  reach: number;
  /** Median days from listing to sale at this tier. */
  daysToSell: number;
  /** Repick's service fee for the verification work behind this tier, in percent. */
  fee: number;
}

export const TIERS: readonly Tier[] = [
  {
    id: 'self-reported',
    name: 'Seller Photos Only',
    description: 'You describe the condition yourself. No scan, no grade.',
    reach: 34,
    daysToSell: 21,
    fee: 0,
  },
  {
    id: 'ai-visual',
    name: 'AI Visual Grade',
    description: "Repick's AI grades condition from your own photos.",
    reach: 58,
    daysToSell: 12,
    fee: 0,
  },
  {
    id: 'ai-spec',
    name: 'AI Grade + Spec Check',
    description: 'Adds a serial and model cross-check against our authenticity index.',
    reach: 76,
    daysToSell: 8,
    fee: 1.5,
  },
  {
    id: 'ai-human',
    name: 'AI Grade + Human Review',
    description: 'A second, human grader confirms the AI result before it goes live.',
    reach: 89,
    daysToSell: 5,
    fee: 2.5,
  },
  {
    id: 'full-auth',
    name: 'Full Authentication',
    description: 'A partner authentication lab physically inspects the item.',
    reach: 97,
    daysToSell: 3,
    fee: 4,
  },
] as const;

export const DEFAULT_TIER_INDEX = 1;

export interface TierComparison {
  index: number;
  current: Tier;
  baseline: Tier;
  below: Tier | null;
  isBaseline: boolean;
  /** current minus baseline — positive values are an improvement over the floor. */
  vsBaseline: {
    reachGain: number;
    daysSaved: number;
    feeAdded: number;
  };
  /** current minus the rung directly below — null when current IS the baseline. */
  vsBelow: {
    reachGain: number;
    daysSaved: number;
    feeAdded: number;
  } | null;
}

export function computeComparison(index: number): TierComparison {
  const current = TIERS[index];
  const baseline = TIERS[0];
  const below = index > 0 ? TIERS[index - 1] : null;

  return {
    index,
    current,
    baseline,
    below,
    isBaseline: index === 0,
    vsBaseline: {
      reachGain: current.reach - baseline.reach,
      daysSaved: baseline.daysToSell - current.daysToSell,
      feeAdded: current.fee - baseline.fee,
    },
    vsBelow: below
      ? {
          reachGain: current.reach - below.reach,
          daysSaved: below.daysToSell - current.daysToSell,
          feeAdded: current.fee - below.fee,
        }
      : null,
  };
}

export function formatFee(fee: number): string {
  return fee % 1 === 0 ? `${fee}%` : `${fee.toFixed(1)}%`;
}
