// Deterministic data module for the repick landing page (round r32, candidate b).
// Nothing here calls Math.random / Date.now / new Date — every number is a fixed literal so
// server and client render the exact same markup.

import {
  Footprints,
  Watch,
  ShoppingBag,
  Shirt,
  Cpu,
  History,
  type LucideIcon,
} from "lucide-react";

export type CategoryId =
  | "sneakers"
  | "watches"
  | "bags"
  | "outerwear"
  | "electronics"
  | "vintage";

export interface CategoryInfo {
  id: CategoryId;
  label: string;
  icon: LucideIcon;
}

// Order here fixes both the matrix index order below AND the clock position on the circle
// (index 0 sits at the top, then clockwise in 60° steps).
export const CATEGORIES: CategoryInfo[] = [
  { id: "sneakers", label: "Sneakers", icon: Footprints },
  { id: "watches", label: "Watches", icon: Watch },
  { id: "bags", label: "Bags", icon: ShoppingBag },
  { id: "outerwear", label: "Outerwear", icon: Shirt },
  { id: "electronics", label: "Electronics", icon: Cpu },
  { id: "vintage", label: "Vintage", icon: History },
];

const ORDER: CategoryId[] = CATEGORIES.map((c) => c.id);

export function categoryIndex(id: CategoryId): number {
  return ORDER.indexOf(id);
}

export function categoryInfo(id: CategoryId): CategoryInfo {
  return CATEGORIES[categoryIndex(id)];
}

/**
 * COMPANION_MATRIX[i][j] = out of every 10 buyers of category i, how many also bought
 * category j within a 30-day window. Symmetric by construction (one fixed co-purchase
 * strength per pair), diagonal is 0 (a category is never its own companion).
 * This single table drives both the arc diagram's stroke weight/opacity AND the
 * "N of 10 buyers" sentence — nothing below is a separately hand-written per-category string.
 */
export const COMPANION_MATRIX: number[][] = [
  // sneakers watches bags outerwear electronics vintage
  [0, 4, 5, 7, 2, 3],
  [4, 0, 6, 3, 2, 5],
  [5, 6, 0, 4, 2, 3],
  [7, 3, 4, 0, 2, 6],
  [2, 2, 2, 2, 0, 3],
  [3, 5, 3, 6, 3, 0],
];

export interface CompanionStat {
  companion: CategoryInfo;
  n: number;
}

/** Scans the matrix row for a category and returns its strongest companion + count. */
export function getTopCompanion(id: CategoryId): CompanionStat {
  const i = categoryIndex(id);
  const row = COMPANION_MATRIX[i];
  let bestJ = 0;
  let bestN = -1;
  row.forEach((n, j) => {
    if (j !== i && n > bestN) {
      bestN = n;
      bestJ = j;
    }
  });
  return { companion: CATEGORIES[bestJ], n: bestN };
}

/** Companion weight between two categories, read straight off the matrix. */
export function companionWeight(a: CategoryId, b: CategoryId): number {
  return COMPANION_MATRIX[categoryIndex(a)][categoryIndex(b)];
}

// Secondary, static-but-selection-driven figures used in the Value section. These describe
// repick's own closed-sale history per category (fixed numbers, not a live feed).
export const DAYS_TO_SELL: Record<CategoryId, number> = {
  sneakers: 4,
  watches: 6,
  bags: 5,
  outerwear: 7,
  electronics: 3,
  vintage: 9,
};

export const PAYOUT_PCT: Record<CategoryId, number> = {
  sneakers: 78,
  watches: 81,
  bags: 74,
  outerwear: 69,
  electronics: 62,
  vintage: 71,
};

// ---- Circle geometry for the chord/arc diagram -----------------------------------------
// viewBox is 0 0 440 440, center (220, 220), node ring radius 150. Positions below are the
// literal rounded (2dp) result of cx + r*cos(θ), cy + r*sin(θ) for θ = -90 + i*60°, computed
// once and hardcoded so no trig runs at render time (belt-and-suspenders against any
// server/client floating point drift).
export const DIAGRAM_SIZE = 440;
export const DIAGRAM_CENTER = 220;

export const NODE_POSITIONS: Record<CategoryId, { x: number; y: number }> = {
  sneakers: { x: 220, y: 70 },
  watches: { x: 349.9, y: 145 },
  bags: { x: 349.9, y: 295 },
  outerwear: { x: 220, y: 370 },
  electronics: { x: 90.1, y: 295 },
  vintage: { x: 90.1, y: 145 },
};

export interface Arc {
  a: CategoryId;
  b: CategoryId;
  weight: number;
  d: string;
}

/** Every unordered category pair with its quadratic-bezier path (control point = circle center). */
export const ARCS: Arc[] = (() => {
  const arcs: Arc[] = [];
  for (let i = 0; i < ORDER.length; i += 1) {
    for (let j = i + 1; j < ORDER.length; j += 1) {
      const a = ORDER[i];
      const b = ORDER[j];
      const pa = NODE_POSITIONS[a];
      const pb = NODE_POSITIONS[b];
      arcs.push({
        a,
        b,
        weight: COMPANION_MATRIX[i][j],
        d: `M ${pa.x} ${pa.y} Q ${DIAGRAM_CENTER} ${DIAGRAM_CENTER} ${pb.x} ${pb.y}`,
      });
    }
  }
  return arcs;
})();

// ---- Product preview cards --------------------------------------------------------------
export interface Product {
  id: string;
  name: string;
  category: CategoryId;
  matchPct: number;
  conditionGrade: string;
  verified: boolean;
  priceBefore: number;
  priceAfter: number;
  discountPct: number;
  aiReasonTag: string;
  conditionReport: string;
}

export const PRODUCTS: Product[] = [
  {
    id: "p-sneakers",
    name: "Air Current 97 — Triple White",
    category: "sneakers",
    matchPct: 96,
    conditionGrade: "A−",
    verified: true,
    priceBefore: 210,
    priceAfter: 148,
    discountPct: 30,
    aiReasonTag: "Matched on silhouette and regional size demand",
    conditionReport:
      "Light creasing at the toe box; original box included; no discoloration on the midsole.",
  },
  {
    id: "p-watches",
    name: "Meridian Diver 200m",
    category: "watches",
    matchPct: 91,
    conditionGrade: "B+",
    verified: true,
    priceBefore: 640,
    priceAfter: 452,
    discountPct: 29,
    aiReasonTag: "Matched on movement type and bracelet fit",
    conditionReport:
      "Light clasp wear consistent with age; service history on file; crystal unscratched.",
  },
  {
    id: "p-bags",
    name: "Canvas Field Tote",
    category: "bags",
    matchPct: 88,
    conditionGrade: "A",
    verified: true,
    priceBefore: 175,
    priceAfter: 121,
    discountPct: 31,
    aiReasonTag: "Matched on hardware finish and strap length",
    conditionReport:
      "Corners show light handling wear; interior lining clean; zipper pull original.",
  },
  {
    id: "p-outerwear",
    name: "Shearling Field Jacket",
    category: "outerwear",
    matchPct: 94,
    conditionGrade: "A−",
    verified: true,
    priceBefore: 390,
    priceAfter: 246,
    discountPct: 37,
    aiReasonTag: "Matched on size run and seasonal demand",
    conditionReport:
      "Collar brushed back to original loft; one interior pocket re-stitched; no odor.",
  },
  {
    id: "p-electronics",
    name: "Studio Reference Headphones",
    category: "electronics",
    matchPct: 85,
    conditionGrade: "B",
    verified: true,
    priceBefore: 349,
    priceAfter: 227,
    discountPct: 35,
    aiReasonTag: "Matched on driver condition and accessory completeness",
    conditionReport:
      "Ear cushions show light compression; original cable and case included; battery health 93%.",
  },
  {
    id: "p-vintage",
    name: "Raw Selvedge Trucker Jacket",
    category: "vintage",
    matchPct: 90,
    conditionGrade: "A",
    verified: true,
    priceBefore: 265,
    priceAfter: 184,
    discountPct: 31,
    aiReasonTag: "Matched on fade pattern and era-correct hardware",
    conditionReport:
      "Fade concentrated at seams and pocket edges; original buttons intact; one cuff repaired.",
  },
];

// ---- Social proof -------------------------------------------------------------------------
export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  location: string;
  category: CategoryId;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "t-1",
    quote:
      "The condition grade matched what arrived, down to the scuff on the strap.",
    name: "Mia R.",
    location: "Austin, TX",
    category: "watches",
  },
  {
    id: "t-2",
    quote:
      "Seller verification meant I didn't have to interrogate anyone before paying.",
    name: "Theo K.",
    location: "Chicago, IL",
    category: "outerwear",
  },
  {
    id: "t-3",
    quote:
      "I listed a pair expecting a week of back-and-forth. It sold before I finished the photos.",
    name: "Priya N.",
    location: "Seattle, WA",
    category: "sneakers",
  },
  {
    id: "t-4",
    quote:
      "The before and after price made the discount feel earned, not arbitrary.",
    name: "Daniel O.",
    location: "Brooklyn, NY",
    category: "bags",
  },
];

export const TRUST_STATS: { label: string; value: string }[] = [
  { label: "Condition-grade accuracy", value: "98%" },
  { label: "Verified sellers", value: "6,200+" },
  { label: "Average buyer rating", value: "4.9 / 5" },
];
