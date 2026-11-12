// Bubble Match — static, hand-authored catalog + pure derivation helpers.
// No randomness anywhere (no Math.random / Date.now / new Date()): every input below is a fixed
// literal, and every derived number (score, radius, position) is a plain arithmetic function of the
// current slider weights. Same weights always produce the same six bubbles, in the same places.

export type ListingId = "ridecycle" | "marcus" | "bayarea" | "quickflip" | "elena" | "trailhead";

export interface Listing {
  id: ListingId;
  seller: string;
  bubbleLabel: string; // short label that fits inside even the smallest bubble
  price: number;
  originalPrice: number;
  grade: string;
  verified: boolean;
  shipDays: number;
  swatch: [string, string]; // deterministic CSS gradient stops (no photo dependency)
  reasonTags: [string, string];
  // Fixed per-attribute scores, 0-100. These never change — only the weights applied to them do.
  priceValue: number;
  condition: number;
  trust: number;
  speed: number;
}

export const ITEM_NAME = "Trek Domane SL5, 54cm";

export const LISTINGS: Listing[] = [
  {
    id: "ridecycle",
    seller: "RideCycleCo",
    bubbleLabel: "RideCycle",
    price: 1240,
    originalPrice: 1850,
    grade: "A-",
    verified: true,
    shipDays: 1,
    swatch: ["#0E7490", "#083344"],
    reasonTags: ["Frame size matches your saved 54cm", "Ships same-day from a top-rated shop"],
    priceValue: 74,
    condition: 92,
    trust: 90,
    speed: 96,
  },
  {
    id: "marcus",
    seller: "Marcus H.",
    bubbleLabel: "Marcus H.",
    price: 980,
    originalPrice: 1850,
    grade: "B",
    verified: false,
    shipDays: 4,
    swatch: ["#64748B", "#334155"],
    reasonTags: ["Lowest price for this model this week", "Private seller, no storefront history"],
    priceValue: 97,
    condition: 58,
    trust: 34,
    speed: 46,
  },
  {
    id: "bayarea",
    seller: "Bay Area Bike Exchange",
    bubbleLabel: "Bay Area",
    price: 1420,
    originalPrice: 1850,
    grade: "A",
    verified: true,
    shipDays: 2,
    swatch: ["#0891B2", "#0E7490"],
    reasonTags: ["Professionally inspected, 98/100 condition", "Verified shop, 4.9-star rating"],
    priceValue: 50,
    condition: 98,
    trust: 94,
    speed: 74,
  },
  {
    id: "quickflip",
    seller: "QuickFlip Cycles",
    bubbleLabel: "QuickFlip",
    price: 1100,
    originalPrice: 1850,
    grade: "B+",
    verified: true,
    shipDays: 1,
    swatch: ["#155E75", "#0C4A5E"],
    reasonTags: ["Same groupset as your saved search", "Ships same day from a local hub"],
    priceValue: 88,
    condition: 74,
    trust: 68,
    speed: 94,
  },
  {
    id: "elena",
    seller: "Elena R.",
    bubbleLabel: "Elena R.",
    price: 890,
    originalPrice: 1850,
    grade: "B-",
    verified: false,
    shipDays: 6,
    swatch: ["#94A3B8", "#475569"],
    reasonTags: ["Deepest discount on this model right now", "First-time seller, unverified"],
    priceValue: 99,
    condition: 44,
    trust: 27,
    speed: 23,
  },
  {
    id: "trailhead",
    seller: "Trailhead Sports",
    bubbleLabel: "Trailhead",
    price: 1350,
    originalPrice: 1850,
    grade: "A-",
    verified: true,
    shipDays: 1,
    swatch: ["#0C4A5E", "#082F3B"],
    reasonTags: ["Matches your saved componentry", "Local pickup, 2.1 miles away"],
    priceValue: 60,
    condition: 86,
    trust: 92,
    speed: 92,
  },
];

// Fixed render order for the static product-preview grid below the hero — this list is never
// re-sorted by score, only the live match-score badge on each card changes. Keeping the grid order
// constant (unlike the hero bubbles) deliberately avoids reproducing the catalog's existing
// "N-row re-sorting list" output form on the same page as the new bubble-pack form.
export const GRID_ORDER: ListingId[] = ["ridecycle", "bayarea", "quickflip", "trailhead", "marcus", "elena"];

export interface Weights {
  price: number;
  condition: number;
  trust: number;
  speed: number;
}

export const WEIGHT_MIN = 5;
export const WEIGHT_MAX = 100;

// A "value-conscious, trust-aware buyer" persona — not all-equal, not a single-axis extreme. Chosen
// so the six bubbles are already visibly differentiated in size on first paint (see c.md for the
// area-ratio check that justified this over an equal-weights default).
export const DEFAULT_WEIGHTS: Weights = { price: 62, condition: 30, trust: 48, speed: 22 };

export interface Preset {
  id: string;
  label: string;
  weights: Weights;
}

export const PRESETS: Preset[] = [
  { id: "balanced", label: "Balanced", weights: DEFAULT_WEIGHTS },
  { id: "price", label: "Best price", weights: { price: 100, condition: 8, trust: 8, speed: 8 } },
  { id: "condition", label: "Best condition", weights: { price: 8, condition: 100, trust: 8, speed: 8 } },
  { id: "trust", label: "Most trusted", weights: { price: 8, condition: 8, trust: 100, speed: 8 } },
  { id: "speed", label: "Fastest ship", weights: { price: 8, condition: 8, trust: 8, speed: 100 } },
];

export function matchPreset(w: Weights): string | null {
  const found = PRESETS.find(
    (p) => p.weights.price === w.price && p.weights.condition === w.condition && p.weights.trust === w.trust && p.weights.speed === w.speed,
  );
  return found ? found.id : null;
}

export const AXES: { key: keyof Weights; label: string }[] = [
  { key: "price", label: "Price weight" },
  { key: "condition", label: "Condition weight" },
  { key: "trust", label: "Trust weight" },
  { key: "speed", label: "Speed weight" },
];

/**
 * The weighted-average match score. Weights are independent 0-100 sliders (not forced to sum to a
 * fixed total) — the formula normalizes by their sum, so only the *ratio* between weights matters,
 * exactly as if they had been forced to sum to 100. A floor of WEIGHT_MIN=5 on every slider keeps
 * the denominator always positive (no divide-by-zero edge case).
 */
export function scoreListing(w: Weights, l: Listing): number {
  const total = w.price + w.condition + w.trust + w.speed;
  const raw = l.priceValue * w.price + l.condition * w.condition + l.trust * w.trust + l.speed * w.speed;
  return raw / total;
}

export interface RankedListing extends Listing {
  score: number;
  rank: number;
}

export function rankListings(w: Weights): RankedListing[] {
  return LISTINGS.map((l) => ({ ...l, score: scoreListing(w, l), rank: 0 }))
    .sort((a, b) => b.score - a.score)
    .map((l, i) => ({ ...l, rank: i }));
}

// --- Deterministic circle packing -----------------------------------------------------------
// A fixed 520x520 coordinate space. The top-match bubble (rank 0) sits at dead center; the other
// five ring around it at 72-degree steps starting straight up, each orbit radius set to exactly
// (topRadius + GAP + ownRadius) so no two circles can ever overlap, whatever the scores are. Every
// listing's radius is R_MAX * sqrt(score / 100) — area, not radius, is what scales linearly with
// score (area = pi * R_MAX^2 * score / 100). No physics, no iteration, same input -> same layout.

export const STAGE = 520;
export const CENTER = 260;
export const R_MAX = 74;
export const GAP = 10;

export interface PackedBubble extends RankedListing {
  r: number;
  x: number;
  y: number;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function radiusFor(score: number): number {
  return R_MAX * Math.sqrt(Math.max(score, 0) / 100);
}

export function packBubbles(ranked: RankedListing[]): PackedBubble[] {
  const top = ranked[0];
  const r0 = radiusFor(top.score);
  const out: PackedBubble[] = [{ ...top, r: round2(r0), x: CENTER, y: CENTER }];

  for (let i = 1; i < ranked.length; i++) {
    const l = ranked[i];
    const r = radiusFor(l.score);
    const orbit = r0 + GAP + r;
    const angleDeg = -90 + (i - 1) * 72;
    const angle = (angleDeg * Math.PI) / 180;
    const x = CENTER + orbit * Math.cos(angle);
    const y = CENTER + orbit * Math.sin(angle);
    out.push({ ...l, r: round2(r), x: round2(x), y: round2(y) });
  }
  return out;
}

export function discountPct(l: Listing): number {
  return Math.round((1 - l.price / l.originalPrice) * 100);
}

export function shipLabel(days: number): string {
  return days === 1 ? "Ships in 1 day" : `Ships in ${days} days`;
}

export interface Testimonial {
  name: string;
  context: string;
  quote: string;
  rating: number;
  verified: boolean;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Priya N.",
    context: "Weighted trust highest",
    quote:
      "I dragged trust all the way up and watched the shop listings swell past the cheap private one. That's the moment I understood the price I was not seeing.",
    rating: 5,
    verified: true,
  },
  {
    name: "Daniel K.",
    context: "Bought at the default weights",
    quote:
      "I did not touch a single slider. The balanced default already put the shop with same-day shipping front and center, and that is exactly the one I bought.",
    rating: 5,
    verified: true,
  },
  {
    name: "Sofia M.",
    context: "Compared six sellers in one screen",
    quote:
      "Six listings, one board, and the sizes told me who actually mattered before I read a single price tag.",
    rating: 4,
    verified: true,
  },
];

export const TRUST_STATS: { value: string; label: string }[] = [
  { value: "6", label: "Competing sellers compared per search" },
  { value: "4", label: "Weighted attributes behind every score" },
  { value: "100%", label: "Of the score math shown, none of it hidden" },
];

export const TRUST_SIGNALS: string[] = [
  "Condition graded on a 12-point rubric",
  "Seller identity checked before listing",
  "Match weights are yours to set, not fixed",
  "Every bubble's score is a real weighted formula",
  "Buyer protection on every verified trade",
];

export const FAQ_ITEMS: { q: string; a: string }[] = [
  {
    q: "How is the match score actually calculated?",
    a: "Each listing has four fixed 0-100 attribute values: price value, condition, seller trust, and shipping speed. Your four sliders weight those attributes into one weighted average. Move a slider and every listing's score is recomputed from scratch, live.",
  },
  {
    q: "Does the biggest bubble always mean the cheapest listing?",
    a: "No — it means the current highest weighted score under your sliders. A bubble's area (not just its width) is set proportional to that score, so a listing that wins on condition and trust can out-size a cheaper one the moment you weight those higher than price.",
  },
  {
    q: "What if I never touch the sliders?",
    a: "The board opens on a balanced, value-conscious default that already differentiates the six sellers by size. It is a reasonable starting point, not a hidden ranking — every weight is visible and editable immediately.",
  },
  {
    q: "Can I see why one specific listing scored the way it did?",
    a: "Tap any bubble. Its full breakdown — price value, condition, trust, and speed, each on its own bar — replaces the spotlight panel above the board, so you can see exactly which attribute is carrying or dragging its score.",
  },
];
