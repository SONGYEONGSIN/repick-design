// native/src/evolve/r62/a/data.ts — auto-native-r62 candidate a.
// Deterministic dummy data + pure pricing functions for CoverageEnrollmentScreen.
// No Math.random / Date.now / bare `new Date()` anywhere below.

export const MIN_INSURABLE_VALUE = 10;
export const MAX_INSURABLE_VALUE = 2000;
export const VALUE_FINE_STEP = 10;

// Quick-select declared-value presets. The last one (2200) deliberately sits
// above MAX_INSURABLE_VALUE so the over-cap guidance is reachable in one tap
// instead of requiring dozens of stepper presses.
export const VALUE_PRESETS: readonly number[] = [35, 80, 150, 320, 600, 1200, 2200];

export const SHIPMENT = {
  itemTitle: "Vintage Leica M6 Camera Body",
  routeLabel: "Columbus, OH → Portland, OR",
  carrierLabel: "GroundLink Freight · Ground, 4–6 days",
  shipByLabel: "Ship by Nov 26",
} as const;

export type CoverageTierId = "standard" | "extended" | "priority";

export type CoverageTier = {
  id: CoverageTierId;
  name: string;
  /** A tier only qualifies once the declared value reaches this floor. */
  minValue: number;
  /** Premium rate applied to the declared value. */
  rate: number;
  /** Premium never prices below this, even for a low declared value. */
  minPremium: number;
  deductibleLabel: string;
  payoutWindowLabel: string;
  perk: string;
};

export const COVERAGE_TIERS: readonly CoverageTier[] = [
  {
    id: "standard",
    name: "Standard Cover",
    minValue: MIN_INSURABLE_VALUE,
    rate: 0.025,
    minPremium: 3,
    deductibleLabel: "$15 deductible",
    payoutWindowLabel: "Claims paid within 30 days",
    perk: "Covers loss and transit damage",
  },
  {
    id: "extended",
    name: "Extended Cover",
    minValue: 200,
    rate: 0.035,
    minPremium: 8,
    deductibleLabel: "$10 deductible",
    payoutWindowLabel: "Claims paid within 14 days",
    perk: "Adds accidental-damage protection",
  },
  {
    id: "priority",
    name: "Priority Cover",
    minValue: 500,
    rate: 0.05,
    minPremium: 18,
    deductibleLabel: "No deductible",
    payoutWindowLabel: "Claims paid within 48 hours",
    perk: "Adds expedited claims handling",
  },
];

/** Pure function: premium is always a deterministic function of declared value. */
export function premiumForTier(tier: CoverageTier, declaredValue: number): number {
  const raw = declaredValue * tier.rate;
  const rounded = Math.round(raw * 100) / 100;
  return Math.max(tier.minPremium, rounded);
}

/** Pure function: eligibility is always a deterministic function of declared value. */
export function tierQualifies(tier: CoverageTier, declaredValue: number): boolean {
  return declaredValue >= tier.minValue && declaredValue <= MAX_INSURABLE_VALUE;
}

export function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`;
}
