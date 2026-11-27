// Fixed, deterministic data for the AI-match-reasoning device.
//
// Nothing below is randomized and nothing is computed from the clock — every
// number is a literal constant, and every percentage shown anywhere on this
// route (the hero proof strip, the icicle chart, the value-split deltas, the
// closing CTA sentence) is derived from these constants with plain
// arithmetic in the functions at the bottom of this file. Moving a slider
// changes a `weight`; it never changes a `raw` score.

export type SignalId = "condition" | "brand" | "price";

export interface Leaf {
  id: string;
  label: string;
  /** Fixed sub-signal score out of 100. Independent of slider weight. */
  raw: number;
  detail: string;
}

export interface Signal {
  id: SignalId;
  label: string;
  short: string;
  /** Fixed base score out of 100 for this signal, before any weighting. */
  raw: number;
  /** One hue (cyan), modulated by lightness per signal — the chart's fill. */
  fill: string;
  description: string;
  leaves: readonly [Leaf, Leaf];
}

export const EXAMPLE_ITEM = {
  name: "Patagonia Retro-X Fleece Jacket",
  meta: "Men's L · Deep Lake Blue",
  price: 86,
  originalPrice: 169,
  grade: "B+",
  gradeLabel: "Gently worn",
  seller: "Verified Seller",
  sellerRating: 4.9,
} as const;

export const SIGNALS: readonly [Signal, Signal, Signal] = [
  {
    id: "condition",
    label: "Condition match",
    short: "Condition",
    raw: 97,
    fill: "#67E8F9",
    description:
      "How closely the item's scanned wear, pilling and hardware line up with the condition grade you said you'd accept.",
    leaves: [
      {
        id: "scan",
        label: "Grading-scan accuracy",
        raw: 91,
        detail: "Photo-scan read checked against a human grader's spot check.",
      },
      {
        id: "wear",
        label: "Wear-pattern consistency",
        raw: 95,
        detail: "Pilling and hardware wear match the stated grade, not just the photos.",
      },
    ],
  },
  {
    id: "brand",
    label: "Brand & style match",
    short: "Brand & style",
    raw: 89,
    fill: "#06B6D4",
    description:
      "Whether the brand, era and silhouette line up with the styles you've saved, searched and bought before.",
    leaves: [
      {
        id: "rarity",
        label: "Brand-rarity signal",
        raw: 76,
        detail: "How often this exact run turns up in things you've saved.",
      },
      {
        id: "silhouette",
        label: "Silhouette fit",
        raw: 85,
        detail: "Cut and era match the style profile built from your past buys.",
      },
    ],
  },
  {
    id: "price",
    label: "Price fit",
    short: "Price",
    raw: 81,
    fill: "#0E7490",
    description:
      "How this listing's price sits against comparable recent sales, once resale fees are worked in.",
    leaves: [
      {
        id: "comp",
        label: "Comp-price alignment",
        raw: 72,
        detail: "Falls inside this item's last 90 days of comparable sales.",
      },
      {
        id: "margin",
        label: "Fee-adjusted margin",
        raw: 64,
        detail: "What you'd still save against retail after the resale fee.",
      },
    ],
  },
] as const;

export const WEIGHT_MIN = 0.5;
export const WEIGHT_MAX = 2;
export const WEIGHT_STEP = 0.1;
export const WEIGHT_DEFAULT = 1;

export type Weights = Record<SignalId, number>;

export const DEFAULT_WEIGHTS: Weights = {
  condition: WEIGHT_DEFAULT,
  brand: WEIGHT_DEFAULT,
  price: WEIGHT_DEFAULT,
};

/** Weighted average of the three fixed raw scores — the live "overall match %." */
export function computeOverall(weights: Weights): number {
  const weightedSum = SIGNALS.reduce((sum, s) => sum + s.raw * weights[s.id], 0);
  const weightSum = SIGNALS.reduce((sum, s) => sum + weights[s.id], 0);
  return Math.round(weightedSum / weightSum);
}

/** Each signal branch's share of the partition row's width — always sums to 100. */
export function computeShares(weights: Weights): Record<SignalId, number> {
  const weighted = SIGNALS.map((s) => s.raw * weights[s.id]);
  const total = weighted.reduce((a, b) => a + b, 0);
  const shares = {} as Record<SignalId, number>;
  SIGNALS.forEach((s, i) => {
    shares[s.id] = Math.round((weighted[i] / total) * 1000) / 10;
  });
  return shares;
}

/** Each leaf's fixed share within its own parent branch — independent of weight. */
export function computeLeafRatios(): Record<string, number> {
  const ratios: Record<string, number> = {};
  SIGNALS.forEach((s) => {
    const sum = s.leaves[0].raw + s.leaves[1].raw;
    ratios[s.leaves[0].id] = s.leaves[0].raw / sum;
    ratios[s.leaves[1].id] = s.leaves[1].raw / sum;
  });
  return ratios;
}

export function dominantSignal(weights: Weights): Signal {
  let best: Signal = SIGNALS[0];
  let bestVal = -Infinity;
  for (const s of SIGNALS) {
    const v = s.raw * weights[s.id];
    if (v > bestVal) {
      bestVal = v;
      best = s;
    }
  }
  return best;
}

export interface StaticProduct {
  id: string;
  name: string;
  meta: string;
  categoryGhost: string;
  price: number;
  originalPrice: number;
  grade: string;
  gradeLabel: string;
  sellerRating: number;
  reasons: readonly string[];
  signals: readonly [
    { label: string; raw: number },
    { label: string; raw: number },
    { label: string; raw: number },
  ];
}

export const STATIC_PRODUCTS: readonly StaticProduct[] = [
  {
    id: "leica-dlux7",
    name: "Leica D-Lux 7 Compact Camera",
    meta: "Mint condition kit",
    categoryGhost: "CAMERA",
    price: 740,
    originalPrice: 1095,
    grade: "A",
    gradeLabel: "Like new",
    sellerRating: 4.8,
    reasons: ["Shutter-count confirmed", "Rare colour-variant match"],
    signals: [
      { label: "Condition", raw: 99 },
      { label: "Brand & style", raw: 93 },
      { label: "Price fit", raw: 62 },
    ],
  },
  {
    id: "acne-overcoat",
    name: "Acne Studios Wool Overcoat",
    meta: "EU 48 · Charcoal",
    categoryGhost: "OVERCOAT",
    price: 210,
    originalPrice: 690,
    grade: "B",
    gradeLabel: "Visible wear, no damage",
    sellerRating: 4.7,
    reasons: ["69% under comparable retail", "Tailoring era match"],
    signals: [
      { label: "Condition", raw: 78 },
      { label: "Brand & style", raw: 71 },
      { label: "Price fit", raw: 95 },
    ],
  },
] as const;
