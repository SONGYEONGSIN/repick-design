// native/src/evolve/r18/b/data.ts — deterministic dummy data for Saved Searches & Alerts.
//
// Each saved search is modeled as structured filters (brand/model, size, price ceiling,
// condition) rather than a freeform query string. That keeps every field editable with the
// same chip/stepper controls already proven in this codebase (see account/Preferences.tsx),
// so "edit" never needs a keyboard — every change still applies immediately, per field.

export type Condition = "any" | "new";

export interface SavedSearch {
  id: string;
  brand: string;
  sizeOptions: string[];
  sizeIndex: number;
  priceMax: number;
  condition: Condition;
  notify: boolean;
  newMatches: number;
  savedLabel: string;
}

export const PRICE_MIN = 50_000;
export const PRICE_MAX = 300_000;
export const PRICE_STEP = 10_000;

export const SHOE_SIZES = ["250", "255", "260", "265", "270", "275", "280"];
export const APPAREL_SIZES = ["XS", "S", "M", "L", "XL"];

export const INITIAL_SAVED_SEARCHES: SavedSearch[] = [
  {
    id: "ss-1",
    brand: "Nike Dunk Low",
    sizeOptions: SHOE_SIZES,
    sizeIndex: 4, // 270
    priceMax: 150_000,
    condition: "any",
    notify: true,
    newMatches: 3,
    savedLabel: "Saved Jul 12",
  },
  {
    id: "ss-2",
    brand: "New Balance 550",
    sizeOptions: SHOE_SIZES,
    sizeIndex: 2, // 260
    priceMax: 120_000,
    condition: "new",
    notify: true,
    newMatches: 0,
    savedLabel: "Saved Jun 28",
  },
  {
    id: "ss-3",
    brand: "Stussy Hoodie",
    sizeOptions: APPAREL_SIZES,
    sizeIndex: 2, // M
    priceMax: 80_000,
    condition: "any",
    notify: false,
    newMatches: 1,
    savedLabel: "Saved Aug 2",
  },
  {
    id: "ss-4",
    brand: "Adidas Samba OG",
    sizeOptions: SHOE_SIZES,
    sizeIndex: 3, // 265
    priceMax: 140_000,
    condition: "any",
    notify: true,
    newMatches: 5,
    savedLabel: "Saved Aug 20",
  },
  {
    id: "ss-5",
    brand: "Carhartt WIP Detroit Jacket",
    sizeOptions: APPAREL_SIZES,
    sizeIndex: 3, // L
    priceMax: 200_000,
    condition: "new",
    notify: false,
    newMatches: 0,
    savedLabel: "Saved May 30",
  },
];

export function newSavedSearchTemplate(n: number): SavedSearch {
  return {
    id: `ss-new-${n}`,
    brand: "New saved search",
    sizeOptions: APPAREL_SIZES,
    sizeIndex: 2,
    priceMax: 100_000,
    condition: "any",
    notify: true,
    newMatches: 0,
    savedLabel: "Just added",
  };
}

export function clampPrice(value: number): number {
  return Math.min(PRICE_MAX, Math.max(PRICE_MIN, value));
}

// A small space between the ₩ glyph and the digits keeps its crossbar from visually running
// into the numerals at body size on the -apple-system stack (see GENERATION.md §1).
export function formatKrw(n: number): string {
  return `₩ ${n.toLocaleString("en-US")}`;
}

export function matchesLabel(n: number): string {
  if (n === 0) return "No new matches yet";
  return `${n} new match${n > 1 ? "es" : ""}`;
}

export function filterSummary(item: SavedSearch): string {
  const size = item.sizeOptions[item.sizeIndex];
  const conditionText = item.condition === "new" ? "New only" : "Any condition";
  return `Size ${size} · under ${formatKrw(item.priceMax)} · ${conditionText}`;
}
