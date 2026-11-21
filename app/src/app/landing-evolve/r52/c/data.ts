// Fixed, deterministic listing pool for the repick "type your budget" matcher.
// No Math.random / Date.now / new Date() anywhere in this file or its consumers —
// every number below is a literal so the page renders identically on server and client.

export type Grade = "A" | "A-" | "B+" | "B";

export interface Listing {
  id: string;
  title: string;
  category: string;
  icon: "shirt" | "footprints" | "bag" | "watch" | "backpack" | "glasses";
  price: number;
  originalPrice: number;
  matchPercent: number;
  grade: Grade;
  verified: boolean;
  tags: [string, string];
  swatch: string; // deterministic flat color standing in for the product photo
  lightSwatch: boolean; // true -> swatch is pale enough to need dark-ink icon/badge text
}

export const LISTINGS: Listing[] = [
  {
    id: "overcoat",
    title: "Wool Overcoat",
    category: "Outerwear",
    icon: "shirt",
    price: 178,
    originalPrice: 410,
    matchPercent: 97,
    grade: "A",
    verified: true,
    tags: ["Brand match: COS", "Shoulder fit verified"],
    swatch: "#6B5B4D",
    lightSwatch: false,
  },
  {
    id: "slipdress",
    title: "Minimalist Slip Dress",
    category: "Apparel",
    icon: "shirt",
    price: 54,
    originalPrice: 128,
    matchPercent: 96,
    grade: "A",
    verified: true,
    tags: ["Silhouette match", "Fabric verified: silk blend"],
    swatch: "#8A6E63",
    lightSwatch: false,
  },
  {
    id: "fieldjacket",
    title: "Weathered Field Jacket",
    category: "Outerwear",
    icon: "shirt",
    price: 86,
    originalPrice: 210,
    matchPercent: 94,
    grade: "A-",
    verified: true,
    tags: ["Brand match: Carhartt", "Within saved size"],
    swatch: "#556052",
    lightSwatch: false,
  },
  {
    id: "tote",
    title: "Structured Leather Tote",
    category: "Bags",
    icon: "bag",
    price: 134,
    originalPrice: 320,
    matchPercent: 91,
    grade: "A",
    verified: true,
    tags: ["Color match: cognac", "Hardware checked"],
    swatch: "#8B4A2B",
    lightSwatch: false,
  },
  {
    id: "climbpack",
    title: "Technical Climb Backpack",
    category: "Bags",
    icon: "backpack",
    price: 72,
    originalPrice: 165,
    matchPercent: 90,
    grade: "A-",
    verified: true,
    tags: ["Capacity match: 28L", "Zips tested"],
    swatch: "#2F4858",
    lightSwatch: false,
  },
  {
    id: "sneakers",
    title: "Canvas Low-Top Sneakers",
    category: "Footwear",
    icon: "footprints",
    price: 48,
    originalPrice: 95,
    matchPercent: 88,
    grade: "B+",
    verified: true,
    tags: ["Style match: minimalist", "Sole wear: light"],
    swatch: "#C9BBA8",
    lightSwatch: true,
  },
  {
    id: "divewatch",
    title: "Automatic Dive Watch",
    category: "Accessories",
    icon: "watch",
    price: 210,
    originalPrice: 540,
    matchPercent: 85,
    grade: "A-",
    verified: false,
    tags: ["Movement tested", "Case match: steel"],
    swatch: "#1F2A33",
    lightSwatch: false,
  },
  {
    id: "boots",
    title: "Combat Lug-Sole Boots",
    category: "Footwear",
    icon: "footprints",
    price: 97,
    originalPrice: 230,
    matchPercent: 82,
    grade: "B+",
    verified: true,
    tags: ["Tread wear: light", "Size profile match"],
    swatch: "#3B312A",
    lightSwatch: false,
  },
  {
    id: "denim",
    title: "Raw Denim Trucker",
    category: "Outerwear",
    icon: "shirt",
    price: 62,
    originalPrice: 140,
    matchPercent: 79,
    grade: "B",
    verified: true,
    tags: ["Wash match: indigo", "Fit: regular"],
    swatch: "#39526B",
    lightSwatch: false,
  },
  {
    id: "aviators",
    title: "Aviator Sunglasses",
    category: "Accessories",
    icon: "glasses",
    price: 39,
    originalPrice: 85,
    matchPercent: 73,
    grade: "B",
    verified: false,
    tags: ["Frame shape match", "Lens scratch-checked"],
    swatch: "#A68A52",
    lightSwatch: true,
  },
];

export const MIN_BUDGET = 1;
export const MAX_BUDGET = 999;
export const DEFAULT_BUDGET = 180;

// Derived, not hand-copied: the lowest price actually in LISTINGS above.
// If the dataset changes, this stays correct instead of going stale.
export const MIN_LISTING_PRICE = LISTINGS.reduce(
  (lowest, item) => (item.price < lowest ? item.price : lowest),
  LISTINGS[0].price
);

export interface BudgetResult {
  budget: number;
  matches: Listing[];
  count: number;
  topMatch: Listing | null;
  avgDiscountPercent: number;
  featured: Listing[]; // top 3 by match%, for the hero + value section
}

/** Pure, deterministic recompute — same budget always yields the same result. */
export function computeForBudget(budget: number): BudgetResult {
  const matches = LISTINGS.filter((item) => item.price <= budget).sort(
    (a, b) => b.matchPercent - a.matchPercent
  );

  const count = matches.length;

  // Reduce seeded with the first real element (never 0) so a tie at the top
  // can't silently fall back to a phantom zero-value accumulator.
  const topMatch =
    count > 0
      ? matches.reduce((best, item) => (item.matchPercent > best.matchPercent ? item : best), matches[0])
      : null;

  const avgDiscountPercent =
    count > 0
      ? Math.round(
          matches.reduce((sum, item) => sum + (1 - item.price / item.originalPrice) * 100, 0) / count
        )
      : 0;

  const featured = matches.slice(0, 3);

  return { budget, matches, count, topMatch, avgDiscountPercent, featured };
}

/** Clamp + validate raw typed input. Returns null when the string has no usable number. */
export function parseBudgetInput(raw: string): number | null {
  if (raw.trim() === "") return null;
  const digits = raw.replace(/[^0-9]/g, "");
  if (digits === "") return null;
  const parsed = parseInt(digits, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return null;
  return Math.min(Math.max(parsed, MIN_BUDGET), MAX_BUDGET);
}
