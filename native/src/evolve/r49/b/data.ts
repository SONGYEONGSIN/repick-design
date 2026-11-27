// native/src/evolve/r49/b/data.ts
// Deterministic dummy data for the Item Comparison screen — lets a buyer line
// up 2–3 saved/watched items side-by-side across a fixed set of spec rows.
// No Math.random / Date.now / new Date anywhere — every value below is fixed.

export type ConditionGrade = "Like New" | "Very Good" | "Good" | "Fair";

/** Higher rank = better condition. Used by findBestComparisonId, never shown directly. */
export const CONDITION_RANK: Record<ConditionGrade, number> = {
  "Like New": 4,
  "Very Good": 3,
  Good: 2,
  Fair: 1,
};

export interface WatchedItemSpec {
  id: string;
  title: string;
  /** Flat color placeholder standing in for a product photo. */
  swatchKey: "swatch1" | "swatch2" | "swatch3";
  priceCents: number;
  conditionGrade: ConditionGrade;
  matchPercent: number;
  /** Tenths of a star, e.g. 48 = 4.8 / 5, so the source stays an integer. */
  sellerRatingTenths: number;
  shippingDays: number;
}

/** Fixed catalog of every watched item eligible to appear in the comparison. */
export const WATCHED_ITEM_CATALOG: ReadonlyArray<WatchedItemSpec> = [
  {
    id: "wi-1",
    title: "iPhone 13 Pro 128GB — Graphite",
    swatchKey: "swatch1",
    priceCents: 64900,
    conditionGrade: "Very Good",
    matchPercent: 92,
    sellerRatingTenths: 48,
    shippingDays: 3,
  },
  {
    id: "wi-2",
    title: "iPhone 13 Pro Max 256GB — Silver",
    swatchKey: "swatch2",
    priceCents: 71500,
    conditionGrade: "Like New",
    matchPercent: 88,
    sellerRatingTenths: 46,
    shippingDays: 5,
  },
  {
    id: "wi-3",
    title: "iPhone 13 128GB — Midnight",
    swatchKey: "swatch3",
    priceCents: 52900,
    conditionGrade: "Good",
    matchPercent: 81,
    sellerRatingTenths: 44,
    shippingDays: 2,
  },
  {
    id: "wi-4",
    title: "iPhone 14 Pro 128GB — Deep Purple",
    swatchKey: "swatch1",
    priceCents: 81900,
    conditionGrade: "Very Good",
    matchPercent: 95,
    sellerRatingTenths: 49,
    shippingDays: 4,
  },
  {
    id: "wi-5",
    title: "iPhone 13 Pro 256GB — Gold",
    swatchKey: "swatch2",
    priceCents: 68900,
    conditionGrade: "Fair",
    matchPercent: 77,
    sellerRatingTenths: 41,
    shippingDays: 6,
  },
];

/** The comparison opens with these two already seated. */
export const INITIAL_COMPARISON_IDS: ReadonlyArray<string> = ["wi-1", "wi-2"];

export const MAX_COMPARISON_ITEMS = 3;

export type ComparisonDirection = "lowerIsBetter" | "higherIsBetter";

export interface ComparisonAttributeRow {
  key: "price" | "condition" | "match" | "sellerRating" | "shipping";
  label: string;
  direction: ComparisonDirection;
  formatValue: (item: WatchedItemSpec) => string;
  rankValue: (item: WatchedItemSpec) => number;
}

/** Thousands-grouped dollar string, built without toLocaleString so it stays
 *  identical across every JS engine the gate might run on. */
export function formatPrice(cents: number): string {
  const whole = Math.round(cents / 100);
  const grouped = whole.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `$${grouped}`;
}

function formatShippingDays(days: number): string {
  return days === 1 ? "1 day" : `${days} days`;
}

function formatSellerRating(tenths: number): string {
  return `${(tenths / 10).toFixed(1)} / 5`;
}

/** Row order as rendered top-to-bottom in the comparison table. */
export const COMPARISON_ATTRIBUTE_ROWS: ReadonlyArray<ComparisonAttributeRow> = [
  {
    key: "price",
    label: "Price",
    direction: "lowerIsBetter",
    formatValue: (item) => formatPrice(item.priceCents),
    rankValue: (item) => item.priceCents,
  },
  {
    key: "condition",
    label: "Condition grade",
    direction: "higherIsBetter",
    formatValue: (item) => item.conditionGrade,
    rankValue: (item) => CONDITION_RANK[item.conditionGrade],
  },
  {
    key: "match",
    label: "Match",
    direction: "higherIsBetter",
    formatValue: (item) => `${item.matchPercent}%`,
    rankValue: (item) => item.matchPercent,
  },
  {
    key: "sellerRating",
    label: "Seller rating",
    direction: "higherIsBetter",
    formatValue: (item) => formatSellerRating(item.sellerRatingTenths),
    rankValue: (item) => item.sellerRatingTenths,
  },
  {
    key: "shipping",
    label: "Shipping time",
    direction: "lowerIsBetter",
    formatValue: (item) => formatShippingDays(item.shippingDays),
    rankValue: (item) => item.shippingDays,
  },
];

/**
 * Returns the id of the single best item for a row, or null when there are
 * fewer than two items to compare or the top value is tied across items —
 * a tie must never be rendered as if one side "won".
 */
export function findBestComparisonId(
  row: ComparisonAttributeRow,
  items: ReadonlyArray<WatchedItemSpec>
): string | null {
  if (items.length < 2) return null;
  const ranked = items.map((item) => ({ id: item.id, value: row.rankValue(item) }));
  const values = ranked.map((entry) => entry.value);
  const bestValue = row.direction === "lowerIsBetter" ? Math.min(...values) : Math.max(...values);
  const winners = ranked.filter((entry) => entry.value === bestValue);
  return winners.length === 1 ? winners[0].id : null;
}
