/**
 * Fixed, deterministic listing set for the budget-range eligibility checklist. No Math.random,
 * no Date.now/new Date anywhere in this module or in model.ts — every listing below is a literal
 * record, and every derived number on the page comes from running these same records through the
 * pure functions in model.ts, never from a second hand-typed "similar" value.
 */

export type Condition = "Fair" | "Good" | "Excellent" | "Like New";

export interface Listing {
  id: string;
  title: string;
  seller: string;
  price: number;
  originalPrice: number;
  condition: Condition;
  conditionRank: number; // Fair=1, Good=2, Excellent=3, Like New=4
  verifiedSeller: boolean;
  shipDays: number;
  matchPct: number; // fixed AI match signal — a separate proof badge, not wired to the price slider
  reasonTags: string[];
  photoId: string;
  alt: string;
}

export const LISTINGS: Listing[] = [
  {
    id: "l1",
    title: "Mono Trail Sneaker",
    seller: "northbend_resale",
    price: 68,
    originalPrice: 110,
    condition: "Excellent",
    conditionRank: 3,
    verifiedSeller: true,
    shipDays: 2,
    matchPct: 94,
    reasonTags: ["Matches your streetwear lean", "5 similar buyers viewed this"],
    photoId: "1549298916-b41d501d3772",
    alt: "A white and orange low-top running sneaker photographed against a plain studio background",
  },
  {
    id: "l2",
    title: "Shearling Trucker Jacket",
    seller: "secondact_vintage",
    price: 95,
    originalPrice: 160,
    condition: "Excellent",
    conditionRank: 3,
    verifiedSeller: true,
    shipDays: 4,
    matchPct: 88,
    reasonTags: ["Matches your outerwear lean", "Trending in mid-tier"],
    photoId: "1544022613-e87ca75a784a",
    alt: "A denim trucker jacket with a shearling collar laid flat against a neutral surface",
  },
  {
    id: "l3",
    title: "Waxed Canvas Field Jacket",
    seller: "fieldstock_co",
    price: 58,
    originalPrice: 90,
    condition: "Fair",
    conditionRank: 1,
    verifiedSeller: false,
    shipDays: 6,
    matchPct: 61,
    reasonTags: ["Budget-friendly pick", "Classic silhouette"],
    photoId: "1551698618-1dfe5d97d256",
    alt: "A tan waxed-canvas field jacket hanging against a plain wall",
  },
  {
    id: "l4",
    title: "Structured Tote",
    seller: "resole_supply",
    price: 72,
    originalPrice: 120,
    condition: "Excellent",
    conditionRank: 3,
    verifiedSeller: true,
    shipDays: 2,
    matchPct: 91,
    reasonTags: ["Matches your minimal lean", "Low mileage, barely carried"],
    photoId: "1548036328-c9fa89d128fa",
    alt: "A structured black leather tote bag with minimal hardware on a plain surface",
  },
  {
    id: "l5",
    title: "Analog Field Watch",
    seller: "fieldstock_co",
    price: 64,
    originalPrice: 95,
    condition: "Like New",
    conditionRank: 4,
    verifiedSeller: true,
    shipDays: 1,
    matchPct: 96,
    reasonTags: ["Highest condition grade in this set", "Ships from a top-rated seller"],
    photoId: "1524592094714-0f0654e20314",
    alt: "A steel analog field watch with a canvas strap laid on a plain surface",
  },
  {
    id: "l6",
    title: "Matte Frame Sunglasses",
    seller: "thrift_and_thread",
    price: 38,
    originalPrice: 60,
    condition: "Like New",
    conditionRank: 4,
    verifiedSeller: true,
    shipDays: 2,
    matchPct: 83,
    reasonTags: ["Cheapest pick in this set", "Popular with first-time buyers"],
    photoId: "1511499767150-a48a237f0083",
    alt: "A pair of matte black sunglasses with angular frames on a plain surface",
  },
];

export const CONDITION_PASS_RANK = 2; // "Good" or better

export const PRICE_MIN_BOUND = 20;
export const PRICE_MAX_BOUND = 180;
export const PRICE_STEP = 2;
export const HANDLE_GAP = 6; // minimum distance kept between the two handles

export const DEFAULT_MIN = 50;
export const DEFAULT_MAX = 130;
