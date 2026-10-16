/**
 * Deterministic seller-payout model for the stepper-counter device.
 *
 * Every number this route shows is derived from the two fixed tables below
 * (`avgPrice`, `feeRate`) by plain integer-safe arithmetic — nothing here
 * reads the clock or a random source. `avgPrice` is intentionally a whole
 * dollar amount for every category, so `count * avgPrice` is always an
 * exact integer and only the fee needs rounding. The fee is rounded first
 * and the payout is then taken as `subtotal - fee` on the *already-rounded*
 * fee, so a displayed row's three numbers always add up on screen.
 */

export type CategoryId = "electronics" | "fashion" | "home";

export interface CategoryDef {
  id: CategoryId;
  /** Section label, as shown in the stepper and breakdown row. */
  label: string;
  /** Singular item noun, used in aria-labels: "Decrease {noun} count". */
  noun: string;
  /** Fixed average resale price for one item in this category, in whole dollars. */
  avgPrice: number;
  /** Fixed repick seller fee, as a fraction of the category subtotal. */
  feeRate: number;
}

export const CATEGORY_ORDER: CategoryId[] = ["electronics", "fashion", "home"];

export const CATEGORIES: Record<CategoryId, CategoryDef> = {
  electronics: {
    id: "electronics",
    label: "Electronics",
    noun: "Electronics item",
    avgPrice: 165,
    feeRate: 0.14,
  },
  fashion: {
    id: "fashion",
    label: "Fashion",
    noun: "Fashion item",
    avgPrice: 36,
    feeRate: 0.2,
  },
  home: {
    id: "home",
    label: "Home",
    noun: "Home item",
    avgPrice: 58,
    feeRate: 0.17,
  },
};

export const MIN_COUNT = 0;
export const MAX_COUNT = 9;

export type CategoryCounts = Record<CategoryId, number>;

/** Non-zero on first paint so the breakdown and bar never start blank. */
export const DEFAULT_COUNTS: CategoryCounts = {
  electronics: 3,
  fashion: 5,
  home: 2,
};

export interface BreakdownRow {
  id: CategoryId;
  label: string;
  count: number;
  /** count * avgPrice — always a whole-dollar integer. */
  subtotal: number;
  /** Rounded once, here — every other figure for this row is derived from this value. */
  fee: number;
  /** subtotal - fee, computed from the already-rounded fee above. Never independently re-rounded. */
  payout: number;
  feePct: number;
  /** Share of total payout this row represents, 0-100. */
  sharePct: number;
}

export interface Breakdown {
  rows: BreakdownRow[];
  totalItems: number;
  totalPayout: number;
}

export function clampCount(value: number): number {
  return Math.min(MAX_COUNT, Math.max(MIN_COUNT, Math.round(value)));
}

/**
 * Folds the three stepper counts into a full breakdown. `rows` includes
 * every category regardless of count (callers that want "rows appear as
 * counts change" filter on `row.count > 0` themselves — kept here so the
 * stacked-bar chart and the table can filter independently without two
 * different sources of truth).
 */
export function computeBreakdown(counts: CategoryCounts): Breakdown {
  const base = CATEGORY_ORDER.map((id) => {
    const def = CATEGORIES[id];
    const count = counts[id];
    const subtotal = count * def.avgPrice;
    const fee = Math.round(subtotal * def.feeRate);
    const payout = subtotal - fee;
    return { id, label: def.label, count, subtotal, fee, payout, feePct: Math.round(def.feeRate * 100) };
  });

  const totalPayout = base.reduce((sum, row) => sum + row.payout, 0);
  const totalItems = base.reduce((sum, row) => sum + row.count, 0);

  const rows: BreakdownRow[] = base.map((row) => ({
    ...row,
    sharePct: totalPayout > 0 ? Math.round((row.payout / totalPayout) * 100) : 0,
  }));

  return { rows, totalItems, totalPayout };
}

export function formatUsd(value: number): string {
  return `$${value.toLocaleString("en-US")}`;
}
