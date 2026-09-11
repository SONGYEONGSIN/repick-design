// native/src/evolve/r19/b/pricing.ts
//
// Pure, deterministic bundle-pricing math for the Bundle Listing Builder. Kept separate from the
// screen component and from data.ts because it is logic, not data and not UI — it has no
// dependency on React or on the specific dummy listings, so it is trivial to unit-test on its own.
//
// The discount is a FORMULA, not a hardcoded per-count lookup table: each item beyond the first
// adds a fixed number of percentage points, capped once the bundle is large enough. That is what
// makes it a real tiered discount that generalizes to any selection size (2 items, 9 items, ...)
// rather than a switch/map keyed on specific counts.

export interface BundleTotals {
  itemCount: number;
  /** Sum of the selected items' individual prices, before any bundle discount. */
  subtotal: number;
  /** 0 for a single item (one item is not yet a bundle); grows with itemCount, capped. */
  discountPercent: number;
  /** subtotal * discountPercent, rounded down to the nearest 100 KRW. */
  discountAmount: number;
  /** subtotal - discountAmount. */
  total: number;
}

const PERCENT_PER_EXTRA_ITEM = 6;
const MAX_DISCOUNT_PERCENT = 24;

/**
 * Tiered bundle discount as a function of item count:
 *   1 item  -> 0%   (nothing to bundle yet)
 *   2 items -> 6%
 *   3 items -> 12%
 *   4 items -> 18%
 *   5+ items -> 24% (capped)
 */
export function tierDiscountPercent(itemCount: number): number {
  if (itemCount < 2) return 0;
  return Math.min(MAX_DISCOUNT_PERCENT, (itemCount - 1) * PERCENT_PER_EXTRA_ITEM);
}

export function computeBundleTotals(prices: number[]): BundleTotals {
  const itemCount = prices.length;
  const subtotal = prices.reduce((sum, p) => sum + p, 0);
  const discountPercent = tierDiscountPercent(itemCount);
  const rawDiscount = (subtotal * discountPercent) / 100;
  // Round down to the nearest 100 KRW so the bundle total lands on a realistic price increment
  // instead of an arbitrary won value.
  const discountAmount = Math.floor(rawDiscount / 100) * 100;
  const total = subtotal - discountAmount;
  return { itemCount, subtotal, discountPercent, discountAmount, total };
}

/** Reference ladder shown to the seller, computed from the same formula above — not retyped. */
export function discountLadder(maxItems: number): { count: number; percent: number }[] {
  const rows: { count: number; percent: number }[] = [];
  for (let count = 2; count <= maxItems; count += 1) {
    rows.push({ count, percent: tierDiscountPercent(count) });
  }
  return rows;
}
