import { ITEMS, type CategoryId, type GradeId, type Item } from './data';

/**
 * Pure, deterministic math for the "Instant Estimate" device.
 *
 * There is exactly one piece of interaction state for the whole page: the
 * id of the currently selected item. Every other number — the estimated
 * payout range, the platform fee, the three comparable cards, and the
 * closing CTA's headline — is a pure function of that one id plus the
 * fixed ITEMS table. Nothing here reads Math.random, Date.now or an
 * argument-less new Date.
 */

/** Fraction of an item's comp-adjusted value that its condition grade supports. */
export const GRADE_FACTOR: Record<GradeId, number> = {
  'A+': 1.0,
  A: 0.96,
  'A-': 0.9,
  'B+': 0.84,
  B: 0.76,
  'B-': 0.68,
};

/** Relative resale demand multiplier per category. */
export const CATEGORY_FACTOR: Record<CategoryId, number> = {
  sneakers: 1.08,
  denim: 0.97,
  bags: 1.02,
  watches: 0.93,
  streetwear: 1.05,
};

/** Share of comp-adjusted value the seller keeps after Repick's platform fee. */
export const TAKE_RATE = 0.88;

/** Fixed band around the midpoint, wide enough to read as a range, not a false-precision point. */
const BAND_LOW = 0.91;
const BAND_HIGH = 1.09;

export interface Estimate {
  /** Comp-adjusted value before the platform fee is taken out. */
  adjusted: number;
  /** Seller payout at the midpoint of the range. */
  mid: number;
  /** Platform fee in dollars at the midpoint. */
  fee: number;
  low: number;
  high: number;
}

/**
 * Estimated payout range for one item: its most recent comp sale price,
 * adjusted for its own condition grade and its category's resale demand,
 * then split into seller payout vs. platform fee at the fixed take rate.
 */
export function computeEstimate(item: Item): Estimate {
  const adjusted = item.sold * GRADE_FACTOR[item.grade] * CATEGORY_FACTOR[item.category];
  const mid = Math.round(adjusted * TAKE_RATE);
  const fee = Math.round(adjusted - mid);
  const low = Math.round(mid * BAND_LOW);
  const high = Math.round(mid * BAND_HIGH);
  return { adjusted, mid, fee, low, high };
}

export function discountPercent(item: Item): number {
  return Math.round(((item.retail - item.sold) / item.retail) * 100);
}

/**
 * The three comparable sold listings for a given selection: same category,
 * excluding the selected item itself, ranked by closeness in sold price
 * (the most price-relevant comps first). Deterministic tie-break on id.
 */
export function getComparables(selected: Item, count = 3): Item[] {
  return ITEMS.filter((item) => item.category === selected.category && item.id !== selected.id)
    .sort((a, b) => {
      const diff = Math.abs(a.sold - selected.sold) - Math.abs(b.sold - selected.sold);
      return diff !== 0 ? diff : a.id.localeCompare(b.id);
    })
    .slice(0, count);
}

/** Simple, deterministic substring match against "brand title" and the category label. */
export function filterItems(query: string, categoryLabel: (c: CategoryId) => string, limit = 7): Item[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return ITEMS.filter((item) => {
    const haystack = `${item.brand} ${item.title} ${categoryLabel(item.category)}`.toLowerCase();
    return haystack.includes(q);
  }).slice(0, limit);
}

export function itemLabel(item: Item): string {
  return `${item.brand} ${item.title}`;
}
