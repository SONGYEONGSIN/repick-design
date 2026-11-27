// native/src/evolve/r59/a/data.ts
// Deterministic dummy data for the Bulk Discount Campaign screen.
// Fixed listing fixtures and pure percent math only — no Math.random(),
// no Date.now(), no no-arg new Date().

export interface CampaignListing {
  id: string;
  title: string;
  category: string;
  priceCents: number;
}

// Eight active listings across varied categories, fixed prices. One entry
// is priced at exactly $42 so the live recompute line reads naturally at a
// range of discount percentages (no significance beyond that).
export const CAMPAIGN_LISTINGS: CampaignListing[] = [
  { id: "cdc-1", title: "Herringbone Wool Coat", category: "Outerwear", priceCents: 12500 },
  { id: "cdc-2", title: "Suede Chelsea Boots", category: "Footwear", priceCents: 7600 },
  { id: "cdc-3", title: "Canvas Weekender Bag", category: "Bags", priceCents: 5400 },
  { id: "cdc-4", title: "Merino Wool Scarf", category: "Accessories", priceCents: 4200 },
  { id: "cdc-5", title: "Ribbed Knit Sweater", category: "Knitwear", priceCents: 3900 },
  { id: "cdc-6", title: "Straight-Leg Denim", category: "Bottoms", priceCents: 5800 },
  { id: "cdc-7", title: "Striped Poplin Shirt", category: "Tops", priceCents: 3100 },
  { id: "cdc-8", title: "Printed Midi Dress", category: "Dresses", priceCents: 4800 },
];

// Discrete stepper bounds/step for the shared campaign discount percentage.
// Switch-control / keyboard operable by design — no drag gesture involved.
export const DISCOUNT_STEP_PERCENT = 5;
export const DISCOUNT_MIN_PERCENT = 0;
export const DISCOUNT_MAX_PERCENT = 50;
export const DEFAULT_DISCOUNT_PERCENT = 15;

export function discountedPriceCents(originalCents: number, percentOff: number): number {
  return Math.round((originalCents * (100 - percentOff)) / 100);
}

export function formatWholeDollars(cents: number): string {
  return `$${Math.round(cents / 100)}`;
}
