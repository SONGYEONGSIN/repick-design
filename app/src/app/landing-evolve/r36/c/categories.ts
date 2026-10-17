/**
 * Fixed, deterministic seller-side category data. Nothing here reads the
 * clock or a random source — every number a visitor sees (hero headline,
 * live readout, bubble cluster, value recap, sold-comp cards, closing CTA)
 * is read straight from this table or derived from it with plain
 * arithmetic, so two renders of the same selection always agree and there
 * is nothing to drift out of sync.
 *
 * `sellThroughRate` (the % of listings in that category that sell within
 * 30 days) drives each bubble's radius in `BubbleCluster.tsx`.
 * `daysToSell` (median listing-to-sale time) is the always-visible number
 * printed on the bubble itself, and is also the field every "fastest"
 * calculation below sorts on. In this fixed data set the two happen to be
 * perfectly rank-consistent (lower median days always pairs with a higher
 * sell-through rate) — see the candidate report for why that is treated
 * as a feature, not a coincidence to hide.
 */

export type CategoryId =
  | "sneakers"
  | "watches"
  | "handbags"
  | "outerwear"
  | "electronics"
  | "denim";

export interface CategoryStat {
  id: CategoryId;
  label: string;
  /** 3–5 letter tag used inside the smallest bubbles, where the full label will not fit. */
  shortLabel: string;
  /** Median days from a listing going live to a confirmed sale. */
  daysToSell: number;
  /** Percent of this category's listings that sell within 30 days. */
  sellThroughRate: number;
  /** Average amount a seller keeps after the repick fee, in dollars. */
  avgPayout: number;
  /** Sample size behind the two medians above, last quarter. */
  itemsAnalyzed: number;
  /** Unsplash photo id (the part after `photo-`) for the sold-comps card. */
  photoId: string;
  /** A single real-feeling sold example, for the sold-comps section. */
  example: {
    item: string;
    daysToSell: number;
    payout: number;
  };
}

export const CATEGORY_ORDER: CategoryId[] = [
  "sneakers",
  "watches",
  "handbags",
  "outerwear",
  "electronics",
  "denim",
];

export const CATEGORIES: Record<CategoryId, CategoryStat> = {
  sneakers: {
    id: "sneakers",
    label: "Sneakers",
    shortLabel: "SNKR",
    daysToSell: 6,
    sellThroughRate: 81,
    avgPayout: 142,
    itemsAnalyzed: 12400,
    photoId: "1495121605193-b116b5b09a56",
    example: { item: "Nike Air Max 90, size 10", daysToSell: 4, payout: 150 },
  },
  watches: {
    id: "watches",
    label: "Watches",
    shortLabel: "WATCH",
    daysToSell: 11,
    sellThroughRate: 68,
    avgPayout: 310,
    itemsAnalyzed: 4100,
    photoId: "1502920917128-1aa500764cbd",
    example: { item: "Seiko 5 automatic", daysToSell: 13, payout: 295 },
  },
  handbags: {
    id: "handbags",
    label: "Handbags",
    shortLabel: "BAGS",
    daysToSell: 9,
    sellThroughRate: 74,
    avgPayout: 265,
    itemsAnalyzed: 6800,
    photoId: "1543076447-215ad9ba6923",
    example: { item: "Coach shoulder bag", daysToSell: 7, payout: 278 },
  },
  outerwear: {
    id: "outerwear",
    label: "Outerwear",
    shortLabel: "COAT",
    daysToSell: 14,
    sellThroughRate: 61,
    avgPayout: 98,
    itemsAnalyzed: 9200,
    photoId: "1524805444758-089113d48a6d",
    example: { item: "Patagonia fleece, size M", daysToSell: 16, payout: 90 },
  },
  electronics: {
    id: "electronics",
    label: "Electronics",
    shortLabel: "TECH",
    daysToSell: 5,
    sellThroughRate: 85,
    avgPayout: 187,
    itemsAnalyzed: 15600,
    photoId: "1441986300917-64674bd600d8",
    example: { item: "Sony WH-1000XM4 headphones", daysToSell: 4, payout: 175 },
  },
  denim: {
    id: "denim",
    label: "Denim",
    shortLabel: "DENIM",
    daysToSell: 13,
    sellThroughRate: 64,
    avgPayout: 76,
    itemsAnalyzed: 7300,
    photoId: "1523275335684-37898b6baf30",
    example: { item: "Levi's 501, size 32", daysToSell: 11, payout: 82 },
  },
};

export const DEFAULT_SELECTED: CategoryId[] = ["sneakers", "watches", "handbags"];

/** Bubble radius (abstract units) from a sell-through rate. Linear, fixed constants. */
export function radiusFor(rate: number): number {
  return 20 + (rate - 60) * 2.4;
}

/** Sum of `itemsAnalyzed` over a set of ids — always derived, never a second hardcoded total. */
export function totalItemsAnalyzed(ids: CategoryId[]): number {
  return ids.reduce((sum, id) => sum + CATEGORIES[id].itemsAnalyzed, 0);
}

/**
 * The fastest-selling category within a selection, by median days-to-sell.
 * Ties break on fixed `CATEGORY_ORDER` position, so the result never
 * depends on selection/array order — only on the data and which ids are in it.
 */
export function fastestOf(ids: CategoryId[]): CategoryStat | null {
  if (ids.length === 0) return null;
  return ids
    .map((id) => CATEGORIES[id])
    .sort((a, b) => a.daysToSell - b.daysToSell || CATEGORY_ORDER.indexOf(a.id) - CATEGORY_ORDER.indexOf(b.id))[0];
}

export function averageDays(ids: CategoryId[]): number {
  if (ids.length === 0) return 0;
  const sum = ids.reduce((s, id) => s + CATEGORIES[id].daysToSell, 0);
  return Math.round(sum / ids.length);
}

export function formatUsd(n: number): string {
  return `$${n.toLocaleString("en-US")}`;
}
