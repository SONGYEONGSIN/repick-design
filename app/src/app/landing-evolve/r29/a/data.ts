// Caliper — live weighted-ranking dataset (r29 candidate a).
//
// Everything below is a hand-authored constant. No Math.random, no
// Date.now, no `new Date()` — the page renders identically on the server
// and on every client, and the only thing that ever changes the order is
// the three weight sliders the visitor drags.

export type Grade = "Fair" | "Good" | "Excellent" | "Like New";
export type SellerTier = "New seller" | "Verified" | "Elite";
export type Category = "Camera" | "Watch" | "Bag" | "Footwear";

export type Listing = {
  id: string;
  name: string;
  category: Category;
  image: string;
  grade: Grade;
  sellerTier: SellerTier;
  /** Estimated days to delivery for this specific listing/seller pair. */
  shippingDays: number;
  priceOriginal: number;
  priceNow: number;
  /**
   * Fixed AI semantic-match score (0-100): how well this listing fits the
   * buyer's saved taste profile (brand, size, category history). It does
   * NOT move when a slider moves — it is the floor the three dials weight
   * on top of (see BASE_WEIGHT below), so no combination of dials can
   * promote something that never matched the profile in the first place.
   */
  baseMatch: number;
};

export const LISTINGS: Listing[] = [
  {
    id: "mirrorless-body",
    name: "Full-Frame Mirrorless Body",
    category: "Camera",
    image: "https://images.unsplash.com/photo-1495121605193-b116b5b09a56",
    grade: "Excellent",
    sellerTier: "Verified",
    shippingDays: 3,
    priceOriginal: 2398,
    priceNow: 1649,
    baseMatch: 93,
  },
  {
    id: "fuji-xt4",
    name: "Fujifilm X-T4 Body",
    category: "Camera",
    image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd",
    grade: "Good",
    sellerTier: "Elite",
    shippingDays: 5,
    priceOriginal: 1699,
    priceNow: 1041,
    baseMatch: 88,
  },
  {
    id: "leica-m6",
    name: "Leica M6 Rangefinder",
    category: "Camera",
    image: "https://images.unsplash.com/photo-1543076447-215ad9ba6923",
    grade: "Like New",
    sellerTier: "Elite",
    shippingDays: 2,
    priceOriginal: 4750,
    priceNow: 3800,
    baseMatch: 90,
  },
  {
    id: "omega-speedmaster",
    name: "Omega Speedmaster Professional",
    category: "Watch",
    image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d",
    grade: "Excellent",
    sellerTier: "Verified",
    shippingDays: 4,
    priceOriginal: 6400,
    priceNow: 4480,
    baseMatch: 95,
  },
  {
    id: "rolex-oyster",
    name: "Rolex Oyster Perpetual 36",
    category: "Watch",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
    grade: "Good",
    sellerTier: "Elite",
    shippingDays: 6,
    priceOriginal: 7200,
    priceNow: 5760,
    baseMatch: 91,
  },
  {
    id: "peak-design-backpack",
    name: "Peak Design Everyday Backpack",
    category: "Bag",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62",
    grade: "Good",
    sellerTier: "Verified",
    shippingDays: 1,
    priceOriginal: 280,
    priceNow: 171,
    baseMatch: 84,
  },
  {
    id: "leather-tote",
    name: "Full-Grain Leather Tote",
    category: "Bag",
    image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7",
    grade: "Excellent",
    sellerTier: "New seller",
    shippingDays: 2,
    priceOriginal: 420,
    priceNow: 252,
    baseMatch: 86,
  },
  {
    id: "af1-hightop",
    name: "Nike Air Force 1 High-Top",
    category: "Footwear",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8",
    grade: "Like New",
    sellerTier: "New seller",
    shippingDays: 3,
    priceOriginal: 160,
    priceNow: 88,
    baseMatch: 82,
  },
];

// ---------------------------------------------------------------------------
// Weighting mechanic

export type AxisId = "price" | "speed" | "trust";

export type Axis = {
  id: AxisId;
  label: string;
  description: string;
};

export const AXES: Axis[] = [
  {
    id: "price",
    label: "Price sensitivity",
    description: "Reward the listings with the deepest discount off original retail.",
  },
  {
    id: "speed",
    label: "Shipping speed",
    description: "Reward the listings that can reach your door the soonest.",
  },
  {
    id: "trust",
    label: "Seller trust",
    description: "Reward listings from Caliper's higher-verification sellers.",
  },
];

export type Weights = Record<AxisId, number>;

// 65 / 30 / 55 — not a flat 3-way tie and not a neutral midpoint either, so
// the leaderboard already shows a non-trivial, non-tied order before a
// visitor has touched a single dial (see the brief's "diff starting at
// zero" pitfall — the same principle applies to a ranking that starts
// perfectly flat).
export const DEFAULT_WEIGHTS: Weights = { price: 65, speed: 30, trust: 55 };

export const AXIS_LABEL: Record<AxisId, string> = {
  price: "Price fit",
  speed: "Ship speed",
  trust: "Seller trust",
};

/** Fixed floor every score carries from the AI match engine, independent of
 *  the three dials. The remaining 65% is split across price/ship/trust
 *  fit, in proportion to wherever the three dials are currently set. */
export const BASE_WEIGHT = 0.35;

const TRUST_FIT: Record<SellerTier, number> = {
  "New seller": 52,
  Verified: 78,
  Elite: 96,
};

export type Factors = { price: number; speed: number; trust: number };

/** Price fit is literally the discount percentage — the deeper the cut off
 *  original retail, the more a price-sensitive dial rewards it. */
function priceFit(listing: Listing): number {
  return Math.round((1 - listing.priceNow / listing.priceOriginal) * 100);
}

/** Shipping fit decays 15 points per extra day versus a 1-day best case,
 *  floored at 0. */
function shippingFit(listing: Listing): number {
  return Math.max(0, Math.min(100, 100 - (listing.shippingDays - 1) * 15));
}

function trustFit(listing: Listing): number {
  return TRUST_FIT[listing.sellerTier];
}

export function computeFactors(listing: Listing): Factors {
  return {
    price: priceFit(listing),
    speed: shippingFit(listing),
    trust: trustFit(listing),
  };
}

export type ScoredListing = Listing & {
  factors: Factors;
  contributions: Factors;
  score: number;
  primaryFactor: AxisId;
};

/** Pure, deterministic score for one listing at one set of dial positions. */
export function scoreListing(listing: Listing, weights: Weights): ScoredListing {
  const factors = computeFactors(listing);
  const weightSum = weights.price + weights.speed + weights.trust || 1;
  const norm: Weights = {
    price: weights.price / weightSum,
    speed: weights.speed / weightSum,
    trust: weights.trust / weightSum,
  };
  const contributions: Factors = {
    price: norm.price * factors.price,
    speed: norm.speed * factors.speed,
    trust: norm.trust * factors.trust,
  };
  const weightedFactorScore = contributions.price + contributions.speed + contributions.trust;
  const score =
    Math.round((BASE_WEIGHT * listing.baseMatch + (1 - BASE_WEIGHT) * weightedFactorScore) * 10) / 10;

  let primaryFactor: AxisId = "price";
  if (contributions.speed > contributions[primaryFactor]) primaryFactor = "speed";
  if (contributions.trust > contributions[primaryFactor]) primaryFactor = "trust";

  return { ...listing, factors, contributions, score, primaryFactor };
}

/** Score every listing and sort highest-first. Ties broken by id so the
 *  order is always fully deterministic for a given weight set. */
export function rankListings(listings: Listing[], weights: Weights): ScoredListing[] {
  return [...listings]
    .map((listing) => scoreListing(listing, weights))
    .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));
}

// ---------------------------------------------------------------------------
// Static copy

export type Stat = { value: string; label: string };

export const STATS: Stat[] = [
  { value: "61,400+", label: "listings scored by Caliper's match engine to date" },
  { value: "3", label: "weighted dials, recalculated on every drag" },
  { value: "4.8 / 5", label: "average buyer rating after a weighted match" },
  { value: "96%", label: "top-3 matches that pass seller verification" },
];

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  initials: string;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "I pushed shipping speed all the way up before a trip and watched two watches swap places instantly. Nobody else shows you the trade-off while you're making it.",
    name: "Renata Alvez",
    role: "Collector, Sao Paulo",
    initials: "RA",
  },
  {
    quote:
      "Every row told me which of my three dials actually put it there. That's the first time a marketplace explained its own ranking to me instead of just asserting it.",
    name: "Theo Okafor",
    role: "Camera reseller, Lagos",
    initials: "TO",
  },
  {
    quote:
      "Seller trust mattered more to me than price. One drag and the whole shortlist re-sorted around that instead of making me dig through filters.",
    name: "Hana Kobayashi",
    role: "First-time buyer, Osaka",
    initials: "HK",
  },
];
