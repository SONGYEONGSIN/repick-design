// native/src/evolve/r20/c/data.ts
// Deterministic dummy data + lookup tables for the Saved Filter Builder screen.
// No Math.random / Date.now / bare `new Date()` anywhere in this file — the live
// match-count preview is derived purely from fixed tables keyed by facet id.

export interface FacetOption {
  id: string;
  label: string;
}

export const CATEGORIES: FacetOption[] = [
  { id: "bags", label: "Bags & Luggage" },
  { id: "watches", label: "Watches" },
  { id: "sneakers", label: "Sneakers" },
  { id: "outerwear", label: "Outerwear" },
  { id: "accessories", label: "Accessories" },
  { id: "electronics", label: "Electronics" },
];

export const PRICE_BANDS: FacetOption[] = [
  { id: "any", label: "Any price" },
  { id: "under50", label: "Under ₩50,000" },
  { id: "b50to150", label: "₩50,000–₩150,000" },
  { id: "b150to300", label: "₩150,000–₩300,000" },
  { id: "over300", label: "₩300,000+" },
];

export const RADIUS_OPTIONS: FacetOption[] = [
  { id: "any", label: "Any distance" },
  { id: "km5", label: "Within 5 km" },
  { id: "km10", label: "Within 10 km" },
  { id: "km25", label: "Within 25 km" },
  { id: "km50", label: "Within 50 km" },
];

export const CONDITIONS: FacetOption[] = [
  { id: "new", label: "New" },
  { id: "likeNew", label: "Like New" },
  { id: "good", label: "Good" },
  { id: "fair", label: "Fair" },
];

export const SORT_OPTIONS: FacetOption[] = [
  { id: "newest", label: "Newest first" },
  { id: "priceAsc", label: "Price: Low to High" },
  { id: "priceDesc", label: "Price: High to Low" },
  { id: "nearest", label: "Nearest first" },
];

// "any" (no category chosen) uses the sum of every category's base count below,
// so the preview always shows a real number even before the user narrows anything.
const CATEGORY_BASE_COUNT: Record<string, number> = {
  any: 7730,
  bags: 1120,
  watches: 860,
  sneakers: 2380,
  outerwear: 640,
  accessories: 1740,
  electronics: 990,
};

// Percent-of-base retained at each price band.
const PRICE_BAND_RETAIN_PCT: Record<string, number> = {
  any: 100,
  under50: 22,
  b50to150: 38,
  b150to300: 21,
  over300: 11,
};

// Percent-of-base retained at each radius.
const RADIUS_RETAIN_PCT: Record<string, number> = {
  any: 100,
  km5: 14,
  km10: 29,
  km25: 58,
  km50: 82,
};

// Percent-of-base retained by how many condition chips are selected.
// 0 selected = no condition filter applied = 100%. Selecting all four is
// equivalent to filtering by nothing, which is realistic (no exclusion left).
const CONDITION_COUNT_RETAIN_PCT: Record<number, number> = {
  0: 100,
  1: 42,
  2: 68,
  3: 87,
  4: 100,
};

// Precomputed once at module load: every (category, priceBand, radius) triple
// mapped to a fixed match count. This is the literal "lookup table keyed by
// facet combination" the preview reads from — nothing here is recalculated
// per render, and nothing here is random.
function buildMatchCountTable(): Record<string, number> {
  const table: Record<string, number> = {};
  const categoryIds = Object.keys(CATEGORY_BASE_COUNT);
  for (const categoryId of categoryIds) {
    const base = CATEGORY_BASE_COUNT[categoryId];
    for (const priceBand of PRICE_BANDS) {
      const pricePct = PRICE_BAND_RETAIN_PCT[priceBand.id];
      for (const radius of RADIUS_OPTIONS) {
        const radiusPct = RADIUS_RETAIN_PCT[radius.id];
        const key = `${categoryId}|${priceBand.id}|${radius.id}`;
        table[key] = Math.round((base * pricePct * radiusPct) / 10000);
      }
    }
  }
  return table;
}

export const MATCH_COUNT_TABLE: Record<string, number> = buildMatchCountTable();

// Tiny fixed "freshness" hint — a count, never a list of items — keyed by
// category only, so it stays a small fixed table rather than a formula.
export const CATEGORY_NEW_SAMPLE: Record<string, number> = {
  any: 9,
  bags: 4,
  watches: 2,
  sneakers: 7,
  outerwear: 1,
  accessories: 5,
  electronics: 3,
};

export interface MatchPreview {
  count: number;
  newSample: number;
}

export function getMatchPreview(
  categoryId: string | null,
  priceBandId: string,
  radiusId: string,
  conditionCount: number,
): MatchPreview {
  const categoryKey = categoryId ?? "any";
  const key = `${categoryKey}|${priceBandId}|${radiusId}`;
  const baseCount = MATCH_COUNT_TABLE[key] ?? 0;
  const conditionPct = CONDITION_COUNT_RETAIN_PCT[conditionCount] ?? 100;
  const count = Math.max(0, Math.round((baseCount * conditionPct) / 100));
  const newSample = CATEGORY_NEW_SAMPLE[categoryKey] ?? 0;
  return { count, newSample };
}
