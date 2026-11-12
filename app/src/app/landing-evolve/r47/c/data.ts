// Static content + deterministic numbers for the "Allocation Flow" candidate.
// No randomness anywhere (no Math.random, no Date.now in any computation) — every
// figure below is a fixed literal, and every derived figure is computed from these
// literals by pure functions in flow-math.ts.

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
  bands: [BandSpec, BandSpec, BandSpec]; // pass, refurbish, fail — in that fixed order
}

// Reference value an inbound item is measured against. Fixed, not random. Each
// strictness profile's three band counts below sum to a fixed batch of 120 items.
export const AVG_MARKET_VALUE = 150; // average resale market value per inbound item, in dollars

// Expected payout rate per band, expressed as a fraction of AVG_MARKET_VALUE. Pass
// pays out close to full market value; Refurbish pays less (refurbishment cost is
// deducted before the seller is paid); Fail pays nothing — the item is returned to
// the seller unsold.
export const PAYOUT_RATE: Record<BandKey, number> = {
  pass: 0.9,
  refurbish: 0.58,
  fail: 0,
};

export const STRICTNESS_PROFILES: Record<StrictnessId, StrictnessProfile> = {
  standard: {
    id: "standard",
    label: "Standard",
    description: "Our default inspection depth — catches damage that affects function or resale value.",
    bands: [
      { key: "pass", label: "Pass-as-is", count: 70 },
      { key: "refurbish", label: "Refurbish-then-sell", count: 37 },
      { key: "fail", label: "Fail-rejected", count: 13 },
    ],
  },
  strict: {
    id: "strict",
    label: "Strict",
    description: "A tighter pass bar — cosmetic wear that Standard would let through gets flagged too.",
    bands: [
      { key: "pass", label: "Pass-as-is", count: 41 },
      { key: "refurbish", label: "Refurbish-then-sell", count: 50 },
      { key: "fail", label: "Fail-rejected", count: 29 },
    ],
  },
};

export const DEFAULT_STRICTNESS: StrictnessId = "standard";

export const BAND_DETAIL: Record<BandKey, string> = {
  pass: "Needs no work — listed and paid out close to full market value.",
  refurbish: "We repair or clean it, then resell it at a fair price.",
  fail: "Can't be sold safely at any grade — returned to you, no fee.",
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
  photoId: string; // images.unsplash.com photo id
  alt: string;
}

export const PRODUCTS: Product[] = [
  {
    id: "p1",
    title: "Full-frame mirrorless camera",
    category: "Electronics · Cameras",
    price: 612,
    originalPrice: 1049,
    grade: "Excellent",
    verifiedSeller: true,
    aiReasoning: "AI match: priced below 9 listings with the same shutter count",
    photoId: "1495121605193-b116b5b09a56",
    alt: "Mirrorless camera body with lens attached, photographed on a plain background",
  },
  {
    id: "p2",
    title: "Trail running shoes, size 10",
    category: "Footwear · Sneakers",
    price: 48,
    originalPrice: 135,
    grade: "Good",
    verifiedSeller: true,
    aiReasoning: "AI match: fits 340 saved searches for this size and colorway",
    photoId: "1542291026-7eec264c27ff",
    alt: "Pair of white and grey running sneakers on a light background",
  },
  {
    id: "p3",
    title: "Mid-century accent armchair",
    category: "Furniture · Seating",
    price: 210,
    originalPrice: 520,
    grade: "Like New",
    verifiedSeller: false,
    aiReasoning: "AI match: closest substitute for 6 recently sold-out listings",
    photoId: "1489987707025-afc232f7ea0f",
    alt: "Upholstered mid-century accent armchair photographed on a plain background",
  },
];

export const VALUE_PROPS = [
  {
    bandKey: "pass" as BandKey,
    title: "Pass-as-is pays fastest",
    body:
      "Items that clear inspection untouched go straight to listing, and their payout reflects close to full market value — no refurbishment cost to deduct.",
  },
  {
    bandKey: "refurbish" as BandKey,
    title: "Refurbish still turns a profit",
    body:
      "A flagged item isn't a dead end. We refurbish it, resell it at a fair price, and pay out what's left after that work — more than rejecting it outright.",
  },
  {
    bandKey: "fail" as BandKey,
    title: "Fail-rejected, no surprise fees",
    body:
      "If an item can't be sold safely at any grade, it's returned to you with no inspection charge — the strictness you pick never costs you for saying no.",
  },
] as const;

export const TESTIMONIALS = [
  {
    quote:
      "I switched my whole closet to Strict mode once I saw the payout barely dropped and buyers trusted the grade more.",
    name: "Priya N.",
    role: "Sold 58 items",
  },
  {
    quote:
      "Watching the flow diagram move when I picked Strict is what convinced me — I could see exactly what I was trading away.",
    name: "Dorian K.",
    role: "Sold 23 items",
  },
] as const;
