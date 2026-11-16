// native/src/evolve/r58/a/data.ts
// Deterministic dummy data for the Search Preset Priority screen.
// No Math.random / Date.now / bare `new Date()` — every value below is a fixed literal.

export type PresetId =
  | "under-50-like-new"
  | "nearby-pickup"
  | "designer-outerwear"
  | "vintage-denim"
  | "free-shipping-only"
  | "weekend-drops";

export interface SearchPreset {
  id: PresetId;
  name: string;
  summary: string;
  /** How many currently-active listings this preset's criteria match, fixed count. */
  matchCount: number;
}

// The preset records themselves are unordered data — priority order is tracked
// separately as an array of ids (see screen state: savedOrder / workingOrder).
export const PRESETS: Record<PresetId, SearchPreset> = {
  "under-50-like-new": {
    id: "under-50-like-new",
    name: "Under $50, Like New",
    summary: "Price under KRW 50,000 · Condition: Like New or better",
    matchCount: 12,
  },
  "nearby-pickup": {
    id: "nearby-pickup",
    name: "Nearby Pickup Only",
    summary: "Within 3 miles · Pickup available, no shipping",
    matchCount: 4,
  },
  "designer-outerwear": {
    id: "designer-outerwear",
    name: "Designer Outerwear",
    summary: "Category: Outerwear · Brand tier: Designer",
    matchCount: 7,
  },
  "vintage-denim": {
    id: "vintage-denim",
    name: "Vintage Denim",
    summary: "Category: Denim · Era: Pre-2000 · Condition: Fair or better",
    matchCount: 9,
  },
  "free-shipping-only": {
    id: "free-shipping-only",
    name: "Free Shipping Only",
    summary: "Shipping cost: KRW 0 · Any category",
    matchCount: 21,
  },
  "weekend-drops": {
    id: "weekend-drops",
    name: "Weekend Drops",
    summary: "Listed Saturday or Sunday · New arrivals only",
    matchCount: 15,
  },
};

// Baseline priority order as if loaded from the server — highest priority first.
export const INITIAL_SAVED_ORDER: PresetId[] = [
  "under-50-like-new",
  "nearby-pickup",
  "designer-outerwear",
  "vintage-denim",
  "free-shipping-only",
  "weekend-drops",
];
