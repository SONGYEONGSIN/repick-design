// native/src/evolve/r53/a/data.ts
// Deterministic dummy data for the Pop-Up Booth Registration gate screen.
// No Math.random / Date.now / bare `new Date()` — every value below is a fixed literal.

export interface ManifestItem {
  id: string;
  name: string;
  priceCents: number;
  tagged: boolean;
}

export const EVENT = {
  name: "Riverside Pop-Up Market",
  dateLabel: "Saturday, Nov 14",
  boothSize: "Standard 6 ft table",
  feeCents: 4500,
} as const;

export const MIN_MANIFEST_ITEMS = 6;

// Fixed row height used both for layout and for deterministic scroll-offset
// math (index * ROW_HEIGHT) — see BoothRegistrationGateScreen.tsx.
export const ROW_HEIGHT = 64;

// 8 fixed items, 3 already tagged ready — leaves the manifest condition
// blocked on first render (3 < MIN_MANIFEST_ITEMS) alongside the identity
// and payment conditions, so all three gate conditions are exercised.
export const INITIAL_MANIFEST: ManifestItem[] = [
  { id: "m1", name: "Vintage Denim Jacket", priceCents: 3800, tagged: true },
  { id: "m2", name: "Ceramic Mug Set", priceCents: 1600, tagged: true },
  { id: "m3", name: "Leather Crossbody Bag", priceCents: 5200, tagged: true },
  { id: "m4", name: "Wool Scarf - Charcoal", priceCents: 1400, tagged: false },
  { id: "m5", name: "Enamel Pin Collection", priceCents: 900, tagged: false },
  { id: "m6", name: "Canvas Tote Bag", priceCents: 1200, tagged: false },
  { id: "m7", name: "Record Player - Working", priceCents: 6500, tagged: false },
  { id: "m8", name: "Brass Candle Holder", priceCents: 1100, tagged: false },
];

export function formatUsd(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}
