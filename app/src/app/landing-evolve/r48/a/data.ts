// Static content + fixed literals for the "Sorting Yield" candidate — a reassignment
// rebuild of auto-landing-r47/c's "Allocation Flow" concept (see
// vault/00-principles/reassign-queue.md #21). No Math.random, no Date.now anywhere:
// every number below is a fixed literal, and every number derived from these is a
// pure function in flow-math.ts, never a duplicated literal.

export type BandKey = "pass" | "refurbish" | "fail";
export type StrictnessId = "standard" | "strict";

export interface BandSpec {
  key: BandKey;
  label: string;
  count: number;
}

export interface StrictnessProfile {
  id: StrictnessId;
  label: string;
  description: string;
  bands: [BandSpec, BandSpec, BandSpec]; // fixed order: pass, refurbish, fail
}

// Reference resale value an inbound item is measured against. Each strictness
// profile's three band counts sum to a fixed batch of 120 items, so switching the
// toggle never changes the denominator — only how the same 120 items get sorted.
export const BATCH_VALUE = 140; // average resale market value per inbound item, in dollars

// Payout rate per band, as a fraction of BATCH_VALUE. Pass pays close to full value;
// Refurbish pays less once repair cost is netted out; Fail pays nothing (the item
// goes back to the seller unsold, at no charge).
export const PAYOUT_RATE: Record<BandKey, number> = {
  pass: 0.88,
  refurbish: 0.55,
  fail: 0,
};

export const STRICTNESS_PROFILES: Record<StrictnessId, StrictnessProfile> = {
  standard: {
    id: "standard",
    label: "Standard",
    description: "Our default inspection depth — flags damage that affects function or resale value.",
    bands: [
      { key: "pass", label: "Pass as-is", count: 66 },
      { key: "refurbish", label: "Refurbish, then sell", count: 41 },
      { key: "fail", label: "Declined", count: 13 },
    ],
  },
  strict: {
    id: "strict",
    label: "Strict",
    description: "A tighter pass bar — cosmetic wear Standard lets through gets flagged here too.",
    bands: [
      { key: "pass", label: "Pass as-is", count: 38 },
      { key: "refurbish", label: "Refurbish, then sell", count: 52 },
      { key: "fail", label: "Declined", count: 30 },
    ],
  },
};

export const DEFAULT_STRICTNESS: StrictnessId = "standard";

export const BAND_DETAIL: Record<BandKey, string> = {
  pass: "No work needed — listed and paid out close to full market value.",
  refurbish: "We repair or clean it ourselves, then resell it at a fair price.",
  fail: "Can't be sold safely at any grade — shipped back to you, no fee.",
};

export type ConditionGrade = "Like New" | "Excellent" | "Good";

export interface Product {
  id: string;
  title: string;
  category: string;
  price: number;
  originalPrice: number;
  grade: ConditionGrade;
  verifiedSeller: boolean;
  aiReasoning: string;
  photoId: string; // images.unsplash.com photo id, fixed content, not a random feed
  alt: string;
}

export const PRODUCTS: Product[] = [
  {
    id: "p1",
    title: "Full-frame mirrorless camera",
    category: "Electronics · Cameras",
    price: 598,
    originalPrice: 1049,
    grade: "Excellent",
    verifiedSeller: true,
    aiReasoning: "AI match: priced under 11 listings with the same shutter count",
    photoId: "1495121605193-b116b5b09a56",
    alt: "Mirrorless camera body with lens attached, photographed on a plain background",
  },
  {
    id: "p2",
    title: "Trail running shoes, size 10",
    category: "Footwear · Sneakers",
    price: 44,
    originalPrice: 135,
    grade: "Good",
    verifiedSeller: true,
    aiReasoning: "AI match: fits 290 saved searches for this size and colorway",
    photoId: "1542291026-7eec264c27ff",
    alt: "Pair of white and grey trail running sneakers on a light background",
  },
  {
    id: "p3",
    title: "Mid-century accent armchair",
    category: "Furniture · Seating",
    price: 225,
    originalPrice: 520,
    grade: "Like New",
    verifiedSeller: false,
    aiReasoning: "AI match: closest substitute for 4 recently sold-out listings",
    photoId: "1489987707025-afc232f7ea0f",
    alt: "Upholstered mid-century accent armchair photographed on a plain background",
  },
];

export const VALUE_PROPS = [
  {
    bandKey: "pass" as BandKey,
    title: "Pass as-is pays out fastest",
    body:
      "Items that clear inspection untouched go straight to listing. Their payout sits close to full market value, because there's no refurbishment cost to deduct first.",
  },
  {
    bandKey: "refurbish" as BandKey,
    title: "Refurbish still turns a profit",
    body:
      "A flagged item isn't a dead end. We repair or clean it, resell it at a fair price, and pay out what's left after that work — more than a straight rejection.",
  },
  {
    bandKey: "fail" as BandKey,
    title: "Declined items cost you nothing",
    body:
      "If an item can't be sold safely at any grade, it ships back to you with no inspection fee — the strictness you pick never costs extra for saying no.",
  },
] as const;

export const TESTIMONIALS = [
  {
    quote:
      "I moved my whole closet to Strict once I saw the payout barely moved and buyers trusted the grade more.",
    name: "Priya N.",
    role: "Sold 61 items",
  },
  {
    quote:
      "Watching the diagram redraw itself when I picked Strict is what sold me — I could see exactly what I was trading away.",
    name: "Dorian K.",
    role: "Sold 24 items",
  },
] as const;
