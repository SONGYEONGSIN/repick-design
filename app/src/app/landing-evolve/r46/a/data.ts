// Deterministic data + pure calculation helpers for the Credit Stack candidate.
// Nothing here uses Math.random() or any other unseeded source.

export type ConditionTier = {
  id: "like-new" | "good" | "fair" | "worn";
  label: string;
  short: string;
  multiplier: number; // share of original price repick credits back, at this condition
  detail: string;
};

export const CONDITIONS: ConditionTier[] = [
  {
    id: "like-new",
    label: "Like New",
    short: "LN",
    multiplier: 0.68,
    detail: "No visible wear, original tags or packaging present.",
  },
  {
    id: "good",
    label: "Good",
    short: "GD",
    multiplier: 0.52,
    detail: "Light, normal wear from use. Fully functional, no flaws that affect use.",
  },
  {
    id: "fair",
    label: "Fair",
    short: "FR",
    multiplier: 0.36,
    detail: "Noticeable wear — marks, fading, or minor repairs — but still fully usable.",
  },
  {
    id: "worn",
    label: "Worn",
    short: "WN",
    multiplier: 0.22,
    detail: "Heavy wear or cosmetic damage. Functions as intended.",
  },
];

export const DEFAULT_CONDITION_INDEX = 1; // "Good" — a real, non-trivial starting point
export const DEFAULT_PRICE = 180;
export const PRICE_MIN = 40;
export const PRICE_MAX = 360;
export const PRICE_STEP = 2;

export function calcCredit(price: number, conditionIndex: number): number {
  const tier = CONDITIONS[conditionIndex] ?? CONDITIONS[DEFAULT_CONDITION_INDEX];
  return Math.round(price * tier.multiplier);
}

export function formatUsd(n: number): string {
  return `$${Math.round(n).toLocaleString("en-US")}`;
}

export function formatPct(fraction: number): string {
  return `${Math.round(fraction * 100)}%`;
}

export type Product = {
  id: string;
  title: string;
  brand: string;
  category: "jacket" | "bag" | "footwear" | "watch" | "camera";
  price: number;
  originalPrice: number;
  match: number; // 0-100, relevance signal
  grade: ConditionTier["id"];
  sellerLabel: string;
};

// Prices chosen to spread across the full credit range the calculator can ever produce
// ($9 at the floor settings, $245 at the ceiling), so the "unlocked at this credit" story
// always has a meaningful mix of hits, near-misses and reaches.
export const PRODUCTS: Product[] = [
  {
    id: "tote",
    title: "Canvas Weekend Tote",
    brand: "Fieldstead",
    category: "bag",
    price: 58,
    originalPrice: 125,
    match: 95,
    grade: "like-new",
    sellerLabel: "Verified seller · 340 sales",
  },
  {
    id: "jacket",
    title: "Field Canvas Jacket",
    brand: "Norrland",
    category: "jacket",
    price: 74,
    originalPrice: 160,
    match: 89,
    grade: "good",
    sellerLabel: "Verified seller · 128 sales",
  },
  {
    id: "boots",
    title: "Trail Runner Boots",
    brand: "Caldera",
    category: "footwear",
    price: 96,
    originalPrice: 210,
    match: 91,
    grade: "good",
    sellerLabel: "Verified seller · 212 sales",
  },
  {
    id: "satchel",
    title: "Leather Crossbody Bag",
    brand: "Marrow & Co.",
    category: "bag",
    price: 128,
    originalPrice: 260,
    match: 84,
    grade: "fair",
    sellerLabel: "Verified seller · 61 sales",
  },
  {
    id: "watch",
    title: "Vintage Chrono Watch",
    brand: "Halbrook",
    category: "watch",
    price: 189,
    originalPrice: 420,
    match: 78,
    grade: "good",
    sellerLabel: "Verified seller · 19 sales",
  },
  {
    id: "camera",
    title: "Compact Film Camera",
    brand: "Oriel",
    category: "camera",
    price: 245,
    originalPrice: 480,
    match: 87,
    grade: "like-new",
    sellerLabel: "Verified seller · 94 sales",
  },
];

export function discountPct(p: Product): number {
  return Math.round((1 - p.price / p.originalPrice) * 100);
}
