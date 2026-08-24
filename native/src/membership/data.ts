export type TierId = "basic" | "plus" | "elite";

export type Tier = {
  id: TierId;
  name: string;
  blurb: string;
  /** share of gross sales taken as selling fee */
  feeRate: number;
  feeLabel: string;
  payoutLabel: string;
  guaranteeCap: number;
  monthlyFee: number;
};

export const TIERS: Tier[] = [
  {
    id: "basic",
    name: "Basic",
    blurb: "No membership. Money lands a week after the buyer confirms.",
    feeRate: 0.058,
    feeLabel: "5.8%",
    payoutLabel: "7 days",
    guaranteeCap: 300000,
    monthlyFee: 0,
  },
  {
    id: "plus",
    name: "Plus",
    blurb: "For sellers clearing a few items every weekend.",
    feeRate: 0.042,
    feeLabel: "4.2%",
    payoutLabel: "3 days",
    guaranteeCap: 1500000,
    monthlyFee: 9900,
  },
  {
    id: "elite",
    name: "Elite",
    blurb: "For shops moving stock weekly and reselling the cash.",
    feeRate: 0.029,
    feeLabel: "2.9%",
    payoutLabel: "Next day",
    guaranteeCap: 5000000,
    monthlyFee: 29900,
  },
];

const TIER_INDEX: Record<TierId, Tier> = {
  basic: TIERS[0],
  plus: TIERS[1],
  elite: TIERS[2],
};

export function tierById(id: TierId): Tier {
  return TIER_INDEX[id];
}

/** The plan the seller is on when the screen opens. */
export const INITIAL_PLAN_ID: TierId = "basic";

/** Fixed volume ladder — 16 rungs of 400,000 won. No derived randomness. */
export const VOLUME_STEPS: number[] = [
  0, 400000, 800000, 1200000, 1600000, 2000000, 2400000, 2800000, 3200000,
  3600000, 4000000, 4400000, 4800000, 5200000, 5600000, 6000000,
];

export const DEFAULT_STEP_INDEX = 8;

/** Centre of each rung as a percentage of the rail, precomputed to stay literal-typed. */
export const MARKER_LEFT = [
  "3.125%",
  "9.375%",
  "15.625%",
  "21.875%",
  "28.125%",
  "34.375%",
  "40.625%",
  "46.875%",
  "53.125%",
  "59.375%",
  "65.625%",
  "71.875%",
  "78.125%",
  "84.375%",
  "90.625%",
  "96.875%",
] as const;

export function monthlyCost(tier: Tier, volume: number): number {
  return Math.round(volume * tier.feeRate) + tier.monthlyFee;
}

export type Ranked = { tier: Tier; cost: number };

export function rankAtVolume(volume: number): Ranked[] {
  return TIERS.map((tier, order) => ({ tier, cost: monthlyCost(tier, volume), order }))
    .sort((a, b) => (a.cost === b.cost ? a.order - b.order : a.cost - b.cost))
    .map(({ tier, cost }) => ({ tier, cost }));
}

export function recommendedAt(volume: number): Tier {
  return rankAtVolume(volume)[0].tier;
}

function breakEven(lower: Tier, upper: Tier): number {
  return Math.round((upper.monthlyFee - lower.monthlyFee) / (lower.feeRate - upper.feeRate));
}

export type FlipPoint = {
  at: number;
  fromName: string;
  toName: string;
};

/** Volumes where the cheapest plan changes hands. */
export const FLIP_POINTS: FlipPoint[] = [
  { at: breakEven(TIERS[0], TIERS[1]), fromName: TIERS[0].name, toName: TIERS[1].name },
  { at: breakEven(TIERS[1], TIERS[2]), fromName: TIERS[1].name, toName: TIERS[2].name },
];

export type Band = {
  id: TierId;
  name: string;
  startIndex: number;
  endIndex: number;
  steps: number;
};

function buildBands(): Band[] {
  const bands: Band[] = [];
  for (let i = 0; i < VOLUME_STEPS.length; i += 1) {
    const winner = recommendedAt(VOLUME_STEPS[i]);
    const open = bands.length > 0 ? bands[bands.length - 1] : null;
    if (open !== null && open.id === winner.id) {
      open.endIndex = i;
      open.steps = open.endIndex - open.startIndex + 1;
    } else {
      bands.push({
        id: winner.id,
        name: winner.name,
        startIndex: i,
        endIndex: i,
        steps: 1,
      });
    }
  }
  return bands;
}

/** Stretch of the ladder each plan owns, derived from the break-even points. */
export const BANDS: Band[] = buildBands();

export function formatWon(value: number): string {
  const sign = value < 0 ? "-" : "";
  const digits = Math.abs(Math.round(value)).toString();
  return sign + "₩" + digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
