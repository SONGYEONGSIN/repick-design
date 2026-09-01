import type { FactorKey, WeightState } from "./gauge-math";

// ---------------------------------------------------------------------------
// Reference listing — the single real item the hero gauge is computed from.
// Fixed data only. No Math.random / Date anywhere in this route.
// ---------------------------------------------------------------------------

export const REFERENCE_LISTING = {
  title: "Leica M6 TTL, 35mm Summicron",
  seller: "FocalTradePost",
  price: 2140,
  originalPrice: 2650,
  conditionGrade: "A-",
  image: "https://images.unsplash.com/photo-1495121605193-b116b5b09a56?q=80&w=640&auto=format&fit=crop",
  imageAlt: "Leica M6 rangefinder film camera with 35mm lens, resting on a wood surface",
};

export function discountPct(original: number, price: number): number {
  return Math.round(((original - price) / original) * 100);
}

// Fixed raw scores (0-100) for the reference listing, one per weighted factor. These never change —
// only the slider *weights* change, which is what re-shapes the composite and the sub-bar shares.
export const RAW_SCORES: WeightState = {
  sellerHistory: 88,
  authenticityCheck: 96,
  conditionMatch: 91,
  priceFairness: 79,
};

export const DEFAULT_WEIGHTS: WeightState = {
  sellerHistory: 65,
  authenticityCheck: 85,
  conditionMatch: 70,
  priceFairness: 50,
};

export const FACTOR_META: Record<FactorKey, { label: string; hint: string }> = {
  sellerHistory: { label: "Seller history", hint: "Return rate, response time, prior grading accuracy" },
  authenticityCheck: { label: "Authenticity check", hint: "Serial match, hardware inspection, material test" },
  conditionMatch: { label: "Condition match", hint: "Listing grade vs. inspection photos" },
  priceFairness: { label: "Price fairness", hint: "Position against 90-day comparable sales" },
};

export const FACTOR_ORDER: FactorKey[] = ["sellerHistory", "authenticityCheck", "conditionMatch", "priceFairness"];

export interface Preset {
  id: string;
  label: string;
  weights: WeightState;
}

export const PRESETS: Preset[] = [
  { id: "balanced", label: "Balanced", weights: { sellerHistory: 70, authenticityCheck: 70, conditionMatch: 70, priceFairness: 70 } },
  { id: "authenticity-first", label: "Authenticity-first", weights: { sellerHistory: 45, authenticityCheck: 95, conditionMatch: 45, priceFairness: 35 } },
  { id: "condition-first", label: "Condition-first", weights: { sellerHistory: 40, authenticityCheck: 40, conditionMatch: 95, priceFairness: 35 } },
  { id: "price-first", label: "Price-first", weights: { sellerHistory: 40, authenticityCheck: 40, conditionMatch: 40, priceFairness: 95 } },
];

// ---------------------------------------------------------------------------
// Product preview cards
// ---------------------------------------------------------------------------

export interface ProductCard {
  id: string;
  title: string;
  price: number;
  originalPrice: number;
  conditionGrade: string;
  sellerVerified: boolean;
  image: string;
  imageAlt: string;
  rationale: string[];
}

export const PRODUCT_CARDS: ProductCard[] = [
  {
    id: "leica-m6",
    title: "Leica M6 TTL, 35mm Summicron",
    price: 2140,
    originalPrice: 2650,
    conditionGrade: "A-",
    sellerVerified: true,
    image: "https://images.unsplash.com/photo-1495121605193-b116b5b09a56?q=80&w=640&auto=format&fit=crop",
    imageAlt: "Leica M6 rangefinder film camera with 35mm lens, resting on a wood surface",
    rationale: ["Serial number verified against registry", "Shutter speeds tested at 6 stages", "Priced within fair range for grade A-"],
  },
  {
    id: "patagonia-retro-x",
    title: "Patagonia Retro-X Fleece, Men's L",
    price: 89,
    originalPrice: 135,
    conditionGrade: "B+",
    sellerVerified: true,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=640&auto=format&fit=crop",
    imageAlt: "Fleece jacket folded flat on a light surface",
    rationale: ["Fabric pilling within stated grade", "Zipper and snap function confirmed", "34% below comparable listings"],
  },
  {
    id: "rolex-oyster-36",
    title: "Oyster Perpetual 36, Pre-Owned",
    price: 5980,
    originalPrice: 6900,
    conditionGrade: "A",
    sellerVerified: true,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=640&auto=format&fit=crop",
    imageAlt: "Stainless steel wristwatch on a wrist",
    rationale: ["Movement inspected, timing within spec", "Papers and box match serial", "Seller: 4 years, 0 disputes"],
  },
];

// ---------------------------------------------------------------------------
// Social proof
// ---------------------------------------------------------------------------

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    quote: "I re-weighted toward authenticity before I'd even scrolled past the fold. That's the first grading tool that let me see my own priorities move the number.",
    name: "Mireille Kanu",
    role: "Buyer, 41 purchases",
  },
  {
    quote: "Our return rate on A-grade listings dropped once buyers could see which factor was dragging a score down instead of just the final digit.",
    name: "Toby Arensen",
    role: "Seller, camera & optics",
  },
  {
    quote: "The composite score matched my own inspection within two points on the last six items I bought. That's the part that kept me buying.",
    name: "Priya Ostlund",
    role: "Buyer, 12 purchases",
  },
];

export const TRUST_STATS: { value: string; label: string }[] = [
  { value: "2.1M", label: "listings scored to date" },
  { value: "96.4%", label: "score-to-inspection agreement" },
  { value: "41s", label: "median time to recompute a re-weighted score" },
];
