// ---------------------------------------------------------------------------
// Price Lab — fixed, deterministic data and pure derivation functions only.
// No Math.random / Date.now / new Date() anywhere in this route: every number
// a visitor sees is either hand-set below, or computed from the price they
// typed by a plain arithmetic function of that number. Typing a new price
// never fetches or generates anything — it re-evaluates the same functions.
// ---------------------------------------------------------------------------

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function unsplashUrl(photoId: string, width: number): string {
  return `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&w=${width}&q=70`;
}

export function discountPct(originalPrice: number, price: number): number {
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

// ---------------------------------------------------------------------------
// Hero listing — the buyer-side match, with its proof, lives inside the hero.
// ---------------------------------------------------------------------------

export const HERO_LISTING = {
  title: "Barbour Bedale Wax Jacket, Olive, UK 40",
  retailPrice: 450,
  listedPrice: 196,
  matchPct: 94,
  grade: "Excellent (A-)",
  verified: true,
  photoId: "1551028719-00167b16eac5",
  alt: "Olive green waxed cotton field jacket laid flat on a plain surface",
};

// ---------------------------------------------------------------------------
// Price Lab — the seller-side pricing tool. One fixed item; the visitor
// controls the only free variable, the asking price they type in.
// ---------------------------------------------------------------------------

export const LAB_ITEM = {
  title: "Dr. Martens 1460 Boots, Smooth Leather, UK 8",
  shortLabel: "these Dr. Martens 1460 boots",
  retailPrice: 190,
  photoId: "1608256246200-53e635b5b65f",
  alt: "Pair of black leather lace-up boots side by side on a plain surface",
};

export const PRICE_MIN = 55;
export const PRICE_MAX = 150;
export const DEFAULT_PRICE = 89; // the price repick's model recommends as a starting point

/**
 * Sell probability: falls in a straight line from 97% at the price floor to
 * 15% at the price ceiling. Priced low, a buyer is likely to be found;
 * priced at retail-adjacent levels, interest thins out. Values outside
 * [PRICE_MIN, PRICE_MAX] are clamped to the nearest end before the line is
 * evaluated, so a wildly out-of-range typed number still reads as a sane,
 * bounded percentage rather than extrapolating below 0 or above 100.
 */
export function sellProbability(price: number): number {
  const t = (clamp(price, PRICE_MIN, PRICE_MAX) - PRICE_MIN) / (PRICE_MAX - PRICE_MIN);
  return Math.round(97 - t * 82);
}

/** Estimated days-to-sell: the mirror of sellProbability — 3 days at the
 * floor, 45 days at the ceiling, same linear interpolation. */
export function daysToSell(price: number): number {
  const t = (clamp(price, PRICE_MIN, PRICE_MAX) - PRICE_MIN) / (PRICE_MAX - PRICE_MIN);
  return Math.round(3 + t * 42);
}

export type VerdictTone = "fast" | "balanced" | "slow";

export interface Verdict {
  tone: VerdictTone;
  label: string;
  body: string;
}

/** Verdict copy is a direct function of the probability the price already
 * implies — not a second, independently-tuned threshold set — so the
 * headline sentence and the number backing it can never disagree. */
export function verdictFor(probability: number): Verdict {
  if (probability >= 75) {
    return { tone: "fast", label: "Priced to move", body: "Expect strong interest within days." };
  }
  if (probability >= 45) {
    return { tone: "balanced", label: "Balanced", body: "In line with the typical pace for this item." };
  }
  return { tone: "slow", label: "Ambitious", body: "Expect a slower sale unless condition is exceptional." };
}

export interface Comp {
  id: string;
  price: number;
  days: number;
  grade: string;
}

// Five real recent sales of the same model. Fixed — typing a price never
// changes what sold for what; it only changes which of these five sits
// closest to the number you typed, and in what order the rest are listed.
export const COMPS: Comp[] = [
  { id: "c1", price: 58, days: 4, grade: "B+" },
  { id: "c2", price: 74, days: 9, grade: "A-" },
  { id: "c3", price: 92, days: 16, grade: "A" },
  { id: "c4", price: 115, days: 27, grade: "A" },
  { id: "c5", price: 138, days: 41, grade: "A+" },
];

export function sortByProximity(price: number, comps: Comp[]): Comp[] {
  return [...comps].sort((a, b) => Math.abs(a.price - price) - Math.abs(b.price - price));
}

export interface Bucket {
  label: string;
  count: number;
}

// A fixed histogram of the last 46 confirmed sales of this model, in five
// $19-wide bands spanning [PRICE_MIN, PRICE_MAX]. Widths line up exactly
// with bucketIndex()'s arithmetic so every label matches the band it names.
export const BUCKETS: Bucket[] = [
  { label: "$55–$73", count: 11 },
  { label: "$74–$92", count: 19 },
  { label: "$93–$111", count: 8 },
  { label: "$112–$130", count: 5 },
  { label: "$131–$150", count: 3 },
];

export const BUCKET_SOLD_TOTAL = BUCKETS.reduce((sum, b) => sum + b.count, 0);

export function bucketIndex(price: number): number {
  return clamp(Math.floor((clamp(price, PRICE_MIN, PRICE_MAX) - PRICE_MIN) / 19), 0, BUCKETS.length - 1);
}

// ---------------------------------------------------------------------------
// Product preview — three richly-proven listings, each with a short-list of
// match evidence shown by default and a longer list behind a disclosure.
// ---------------------------------------------------------------------------

export interface PreviewListing {
  id: string;
  title: string;
  retailPrice: number;
  listedPrice: number;
  matchPct: number;
  grade: string;
  verified: boolean;
  photoId: string;
  alt: string;
  primaryTags: string[];
  moreTags: string[];
}

export const PREVIEW_LISTINGS: PreviewListing[] = [
  {
    id: "boots",
    title: LAB_ITEM.title,
    retailPrice: LAB_ITEM.retailPrice,
    listedPrice: DEFAULT_PRICE,
    matchPct: 90,
    grade: "Excellent (A-)",
    verified: true,
    photoId: LAB_ITEM.photoId,
    alt: LAB_ITEM.alt,
    primaryTags: ["90% match to your saved size and fit profile", "Leather condition scan passed with no cracking"],
    moreTags: [
      "Original box and spare laces included",
      "Seller ships within 24 hours",
      "No price change on this listing in 30 days",
    ],
  },
  {
    id: "backpack",
    title: "Fjällräven Kånken Backpack, Classic 16L",
    retailPrice: 110,
    listedPrice: 52,
    matchPct: 87,
    grade: "Very Good (B+)",
    verified: true,
    photoId: "1553062407-98eeb64c6a62",
    alt: "Classic square backpack with top handle resting on a plain surface",
    primaryTags: ["87% match to items you saved this month", "Zippers and buckles function-tested"],
    moreTags: [
      "Interior lining checked, free of stains",
      "Ships from a top-rated seller",
      "Colorway discontinued — limited remaining supply",
    ],
  },
  {
    id: "jeans",
    title: "Levi's 501 Original Straight Jeans, W32 L32",
    retailPrice: 98,
    listedPrice: 41,
    matchPct: 92,
    grade: "Good (B)",
    verified: true,
    photoId: "1542272604-787c3835535d",
    alt: "Folded pair of blue denim jeans on a plain surface",
    primaryTags: ["92% match to your saved size and fit profile", "Fabric wear graded within Good tier"],
    moreTags: [
      "No repairs or alterations detected",
      "Seller responds in under two hours on average",
      "Original rivets and tag intact",
    ],
  },
];

// ---------------------------------------------------------------------------
// Social proof
// ---------------------------------------------------------------------------

export const TRUST_STATS: { value: string; label: string }[] = [
  { value: "12,400+", label: "asking prices tested in Price Lab this quarter" },
  { value: "97%", label: "top-tier sell probability achievable at the price floor" },
  { value: "3 days", label: "fastest verified sale on record" },
];

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "I typed in the number I wanted, not a number a slider let me reach. Seeing the probability drop in real time talked me down eleven dollars — and the boots sold in six days.",
    name: "Priya Nakamura",
    role: "Seller, footwear and outerwear",
  },
  {
    quote:
      "Watching the comps re-sort as I typed made the market feel concrete instead of guessed at. I ended up listing closer to the floor than I planned to.",
    name: "Devon Achebe",
    role: "Seller, denim and casualwear",
  },
  {
    quote:
      "The distribution strip is what sold me. I could see exactly how crowded my price band already was before I committed to a number.",
    name: "Marguerite Coll",
    role: "Seller, bags and accessories",
  },
];
