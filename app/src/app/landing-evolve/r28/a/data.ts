// repick — "The Route" (r28 candidate a)
//
// Dummy dataset for one traced search: a buyer looking for a full-frame
// mirrorless body. Every count below is a fixed, hand-picked editorial value
// for demonstration, not live marketplace data — and every derived number is
// pure arithmetic (no Math.random, no Date.now), so the page renders
// identically on every load and on the server.

export type Grade = "Fair" | "Good" | "Excellent" | "Like New";

export type Tier = {
  id: string;
  grade: Grade;
  /** Index along the quality axis, 0 = lowest. Used both to order the grade
   *  column and to decide which side of the minimum-grade filter a tier
   *  lands on. */
  order: number;
  /** Listings that cleared condition grading AND seller/authenticity
   *  verification at this grade — the number the "Condition & authenticity
   *  check" column actually shows for this tier. */
  count: number;
  avgMatch: number;
  avgDiscount: number;
};

// Ordered low → high quality. Counts sum to GRADE_VERIFIED_TOTAL below.
export const TIERS: Tier[] = [
  { id: "fair", grade: "Fair", order: 0, count: 28, avgMatch: 81, avgDiscount: 51 },
  { id: "good", grade: "Good", order: 1, count: 65, avgMatch: 89, avgDiscount: 42 },
  { id: "excellent", grade: "Excellent", order: 2, count: 66, avgMatch: 95, avgDiscount: 33 },
  { id: "likenew", grade: "Like New", order: 3, count: 28, avgMatch: 98, avgDiscount: 21 },
];

export const SEARCH_QUERY = "Full-frame mirrorless body, under $2,200";

export const POOL_COUNT = 1842; // listings scanned for this search
export const MATCHED_COUNT = 214; // passed the AI intent-match threshold (≥78% confidence)
export const GRADE_VERIFIED_TOTAL = TIERS.reduce((sum, t) => sum + t.count, 0); // 187
export const FAILED_VERIFICATION_COUNT = MATCHED_COUNT - GRADE_VERIFIED_TOTAL; // 27

// Minimum-grade filter: dragging it right routes lower tiers from
// "Recommended to you" into "Held back for now" without changing the total
// pool, the match pipeline, or the 27 that never clear verification.
export const GRADE_STEPS: { grade: Grade; helper: string }[] = [
  { grade: "Fair", helper: "Show everything that's graded and verified" },
  { grade: "Good", helper: "Drop rough-condition items" },
  { grade: "Excellent", helper: "Near-mint or better only" },
  { grade: "Like New", helper: "Only the best-condition listings" },
];

// Default sits at "Excellent" (index 2) — deliberately not the lowest step,
// so the recommended/held-back split is non-zero on both sides before any
// interaction (28 + 65 held back vs. 66 + 28 recommended), not a flat "same
// number twice" baseline.
export const DEFAULT_MIN_GRADE_INDEX = 2;

export type OutcomeBucket = {
  count: number;
  avgMatch: number;
  avgDiscount: number;
};

export type Outcomes = {
  recommended: OutcomeBucket;
  heldBack: OutcomeBucket;
  notVerified: { count: number };
  minGrade: Grade;
};

function weighted(tiers: Tier[]): OutcomeBucket {
  const count = tiers.reduce((s, t) => s + t.count, 0);
  if (count === 0) return { count: 0, avgMatch: 0, avgDiscount: 0 };
  const matchSum = tiers.reduce((s, t) => s + t.count * t.avgMatch, 0);
  const discountSum = tiers.reduce((s, t) => s + t.count * t.avgDiscount, 0);
  return {
    count,
    avgMatch: Math.round((matchSum / count) * 10) / 10,
    avgDiscount: Math.round((discountSum / count) * 10) / 10,
  };
}

/** Pure recompute driven entirely by the slider's minimum-grade index. */
export function computeOutcomes(minGradeIndex: number): Outcomes {
  const recommendedTiers = TIERS.filter((t) => t.order >= minGradeIndex);
  const heldBackTiers = TIERS.filter((t) => t.order < minGradeIndex);
  return {
    recommended: weighted(recommendedTiers),
    heldBack: weighted(heldBackTiers),
    notVerified: { count: FAILED_VERIFICATION_COUNT },
    minGrade: GRADE_STEPS[minGradeIndex].grade,
  };
}

// ---------------------------------------------------------------------------
// Listings — product preview grid + two hero proof cards. Grade/match/discount
// line up with the TIERS table above so the whole page quotes one consistent
// set of numbers.

export type Listing = {
  id: string;
  name: string;
  category: "Camera" | "Lens" | "Watch" | "Bag";
  image: string;
  grade: Grade;
  match: number;
  verified: boolean;
  priceOriginal: number;
  priceNow: number;
  reason: string;
};

export const LISTINGS: Listing[] = [
  {
    id: "sony-a7iv",
    name: "Sony a7 IV",
    category: "Camera",
    image: "https://images.unsplash.com/photo-1495121605193-b116b5b09a56",
    grade: "Excellent",
    match: 95,
    verified: true,
    priceOriginal: 2498,
    priceNow: 1674,
    reason: "Full-frame body, under $2,200, shutter count verified low",
  },
  {
    id: "leica-m6",
    name: "Leica M6",
    category: "Camera",
    image: "https://images.unsplash.com/photo-1543076447-215ad9ba6923",
    grade: "Like New",
    match: 98,
    verified: true,
    priceOriginal: 4750,
    priceNow: 3753,
    reason: "Rangefinder aligned, meter tested accurate, box included",
  },
  {
    id: "fuji-x100v",
    name: "Fujifilm X100V",
    category: "Camera",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8",
    grade: "Excellent",
    match: 92,
    verified: true,
    priceOriginal: 1399,
    priceNow: 937,
    reason: "Leaf shutter tested, no sensor dust, ships next day",
  },
  {
    id: "canon-rf-2470",
    name: "Canon RF 24–70mm f/2.8L",
    category: "Lens",
    image: "https://images.unsplash.com/photo-1560243563-062bfc001d68",
    grade: "Good",
    match: 89,
    verified: true,
    priceOriginal: 2299,
    priceNow: 1333,
    reason: "Matches your Sony mount, optics clear, AF calibrated",
  },
  {
    id: "omega-speedmaster",
    name: "Omega Speedmaster Pro",
    category: "Watch",
    image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d",
    grade: "Excellent",
    match: 90,
    verified: true,
    priceOriginal: 6400,
    priceNow: 4288,
    reason: "Movement serviced within 12 months, papers on file",
  },
  {
    id: "peak-design-bag",
    name: "Peak Design Everyday Backpack",
    category: "Bag",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62",
    grade: "Good",
    match: 86,
    verified: true,
    priceOriginal: 280,
    priceNow: 162,
    reason: "Zippers and straps intact, light shelf wear only",
  },
];

export const CATEGORIES = ["All", "Camera", "Lens", "Watch", "Bag"] as const;

// ---------------------------------------------------------------------------
// Social proof

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  initials: string;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "I raised the minimum grade to Like New and watched the count drop from 187 to 28 in real time. That's the first resale app that showed me the trade-off instead of just the result.",
    name: "Marisol Ortega",
    role: "Wedding photographer, Austin TX",
    initials: "MO",
  },
  {
    quote:
      "Every listing carried a one-line reason it matched my search. No more guessing why an algorithm thought a $4,000 lens fit my $1,200 budget.",
    name: "Daniel Ferreira",
    role: "Landscape photographer",
    initials: "DF",
  },
  {
    quote:
      "27 of my search results never even made it past verification, and the page told me so instead of hiding it. That honesty is why I kept using it.",
    name: "Priya Nandakumar",
    role: "Film and digital shooter",
    initials: "PN",
  },
];

export type Stat = { value: string; label: string };

export const STATS: Stat[] = [
  { value: "38,200+", label: "listings routed through the pipeline to date" },
  { value: "$21.4M", label: "paid out to verified sellers" },
  { value: "4.9 / 5", label: "average buyer rating" },
  { value: "72 hrs", label: "average time to seller payout" },
];
