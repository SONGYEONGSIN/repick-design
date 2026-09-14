// native/src/evolve/r21/b/data.ts
//
// Deterministic dummy data for the Item Comparison screen. No Math.random /
// Date.now / bare `new Date()` anywhere — every value below is a fixed literal
// or derived from fixed literals.

export type ConditionGrade = "Like New" | "Excellent" | "Good" | "Fair";
export type AuthStatus = "Verified" | "Pending" | "Not submitted";

export type ComparisonItem = {
  id: string;
  title: string;
  sellerName: string;
  priceWon: number;
  /** 30-day price change, percent. Negative = price has been dropping. */
  priceTrendPct: number;
  conditionGrade: ConditionGrade;
  /** 0–5, one decimal. */
  sellerRating: number;
  /** Estimated days until the item ships once bought. */
  shipDays: number;
  authStatus: AuthStatus;
};

// Lower rank = better, used for the non-numeric spec rows so they can be
// compared on the same "asc = best" axis as price/ship-time.
export const CONDITION_RANK: Record<ConditionGrade, number> = {
  "Like New": 1,
  Excellent: 2,
  Good: 3,
  Fair: 4,
};

export const AUTH_RANK: Record<AuthStatus, number> = {
  Verified: 1,
  Pending: 2,
  "Not submitted": 3,
};

// Four watchlisted items — the pool the comparison set is drawn from.
export const ALL_ITEMS: ComparisonItem[] = [
  {
    id: "watch-01",
    title: "Nike Air Force 1 '07 — White",
    sellerName: "closetreset",
    priceWon: 89000,
    priceTrendPct: -8,
    conditionGrade: "Excellent",
    sellerRating: 4.8,
    shipDays: 2,
    authStatus: "Verified",
  },
  {
    id: "watch-02",
    title: "Uniqlo U Fleece Full-Zip — Navy",
    sellerName: "seoul.thrift",
    priceWon: 42000,
    priceTrendPct: 3,
    conditionGrade: "Like New",
    sellerRating: 4.6,
    shipDays: 3,
    authStatus: "Not submitted",
  },
  {
    id: "watch-03",
    title: "Levi's 501 Original — 32x32",
    sellerName: "vintage_yjs",
    priceWon: 55000,
    priceTrendPct: 0,
    conditionGrade: "Good",
    sellerRating: 4.9,
    shipDays: 1,
    authStatus: "Verified",
  },
  {
    id: "watch-04",
    title: "Patagonia Better Sweater — Forest",
    sellerName: "gearclosetkr",
    priceWon: 76000,
    priceTrendPct: -4,
    conditionGrade: "Excellent",
    sellerRating: 4.3,
    shipDays: 5,
    authStatus: "Pending",
  },
];

// Comparison set starts with the first three watchlisted items; the fourth is
// offered via the "Add to comparison" strip.
export const INITIAL_COMPARISON_IDS: string[] = ["watch-01", "watch-02", "watch-03"];

export const MAX_COMPARE = 3;

export type SortDirection = "asc" | "desc"; // asc = lowest value wins, desc = highest value wins

export type RowConfig = {
  id: string;
  label: string;
  direction: SortDirection;
  getValue: (item: ComparisonItem) => number;
  formatValue: (item: ComparisonItem) => string;
};

export const ROW_CONFIGS: RowConfig[] = [
  {
    id: "price",
    label: "Price",
    direction: "asc",
    getValue: (item) => item.priceWon,
    formatValue: (item) => formatWon(item.priceWon),
  },
  {
    id: "condition",
    label: "Condition grade",
    direction: "asc",
    getValue: (item) => CONDITION_RANK[item.conditionGrade],
    formatValue: (item) => item.conditionGrade,
  },
  {
    id: "rating",
    label: "Seller rating",
    direction: "desc",
    getValue: (item) => item.sellerRating,
    formatValue: (item) => `${item.sellerRating.toFixed(1)} / 5`,
  },
  {
    id: "ship",
    label: "Est. ship time",
    direction: "asc",
    getValue: (item) => item.shipDays,
    formatValue: (item) =>
      `${item.shipDays} day${item.shipDays === 1 ? "" : "s"}`,
  },
  {
    id: "auth",
    label: "Authentication",
    direction: "asc",
    getValue: (item) => AUTH_RANK[item.authStatus],
    formatValue: (item) => item.authStatus,
  },
  {
    id: "trend",
    label: "Price trend (30d)",
    direction: "asc",
    getValue: (item) => item.priceTrendPct,
    formatValue: (item) =>
      `${item.priceTrendPct > 0 ? "+" : ""}${item.priceTrendPct}%`,
  },
];

// ₩ (U+20A9) can visually run into an adjacent digit at body-text size in the
// -apple-system stack — a letterform quirk, not a bug. Fixed with a small gap
// after the glyph (GENERATION.md §1, option a).
export function formatWon(amountWon: number): string {
  return `₩ ${amountWon.toLocaleString("en-US")}`;
}
