// native/src/evolve/r48/c/data.ts
// Deterministic dummy data for the Bulk Price Drop screen.
// Fixed listing items with fixed prices — no Math.random(), no Date.now().

export type SwatchKey = "swatch1" | "swatch2" | "swatch3";

export interface ActiveListing {
  id: string;
  title: string;
  originalPriceCents: number;
  swatch: SwatchKey;
}

// Cycle the three neutral placeholder swatches deterministically by index,
// so the thumbnail grid reads as varied without any randomness.
const SWATCH_CYCLE: SwatchKey[] = ["swatch1", "swatch2", "swatch3"];

function swatchForIndex(index: number): SwatchKey {
  return SWATCH_CYCLE[index % SWATCH_CYCLE.length];
}

const RAW_LISTINGS: Array<{ title: string; originalPriceCents: number }> = [
  { title: "Denim Jacket, Mid-Wash", originalPriceCents: 4800 },
  { title: "Wool Blend Overcoat", originalPriceCents: 12500 },
  { title: "Canvas Tote Bag", originalPriceCents: 2200 },
  { title: "Leather Ankle Boots", originalPriceCents: 7600 },
  { title: "Striped Cotton Shirt", originalPriceCents: 3100 },
  { title: "Corduroy Trousers", originalPriceCents: 5400 },
  { title: "Knit Crewneck Sweater", originalPriceCents: 3900 },
  { title: "Silk Scarf, Printed", originalPriceCents: 1800 },
  { title: "Suede Crossbody Bag", originalPriceCents: 6200 },
  { title: "Linen Summer Dress", originalPriceCents: 4400 },
];

export const ACTIVE_LISTINGS: ActiveListing[] = RAW_LISTINGS.map(
  (entry, index) => ({
    id: `listing-${index + 1}`,
    title: entry.title,
    originalPriceCents: entry.originalPriceCents,
    swatch: swatchForIndex(index),
  })
);

// Fixed, deterministic preset discount percentages offered on the contextual bar.
export const DISCOUNT_PRESETS: number[] = [10, 20, 30];

export function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export function applyDiscountToCents(
  originalCents: number,
  percentOff: number
): number {
  const discounted = originalCents * (1 - percentOff / 100);
  return Math.round(discounted);
}
