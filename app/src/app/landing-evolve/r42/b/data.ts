// Deterministic data + scoring math for "Tipping the Scale". No Math.random,
// no Date.now, no bare `new Date` anywhere — every number here is a fixed
// literal or a pure function of fixed literals, so the page renders
// identically on the server and on every client.

export type Weights = {
  price: number;
  condition: number;
  ship: number;
  trust: number;
};

export type ListingId = "left" | "right";
export type LeaderId = ListingId | "tie";

export type Listing = {
  id: ListingId;
  name: string;
  seller: string;
  salesCount: number;
  price: number;
  originalPrice: number;
  conditionGrade: "Good" | "Very Good" | "Like New";
  /** Fixed 0–100 grade score, assigned from repick's standard grading rubric:
   *  Fair 55 · Good 72 · Very Good 85 · Like New 96 · New 100. */
  conditionScore: number;
  shipDays: number;
  /** Fixed 0–100 seller-trust score: a blend of verified rating accuracy and
   *  sales volume, given here as a direct input (not re-derived on this page). */
  trustScore: number;
};

export const LISTINGS: Record<ListingId, Listing> = {
  left: {
    id: "left",
    name: "Sony α7 III — Body Only",
    seller: "FocalPoint Studio",
    salesCount: 140,
    price: 1050,
    originalPrice: 1500,
    conditionGrade: "Good",
    conditionScore: 72,
    shipDays: 1,
    trustScore: 81,
  },
  right: {
    id: "right",
    name: "Sony α7 III — Body Only",
    seller: "Aperture Collective",
    salesCount: 410,
    price: 1340,
    originalPrice: 1500,
    conditionGrade: "Like New",
    conditionScore: 96,
    shipDays: 4,
    trustScore: 97,
  },
};

const MIN_PRICE = Math.min(LISTINGS.left.price, LISTINGS.right.price);

export function clampNum(v: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, v));
}

export function formatPrice(n: number): string {
  return `$${n.toLocaleString("en-US")}`;
}

export function discountPct(listing: Listing): number {
  return Math.round(((listing.originalPrice - listing.price) / listing.originalPrice) * 100);
}

/**
 * Price score: inversely proportional to price, normalized so the cheaper of
 * the two listings always lands at exactly 100.
 *   priceScore = round(100 × minPrice ÷ price)
 */
export function priceScore(listing: Listing): number {
  return Math.round((100 * MIN_PRICE) / listing.price);
}

/**
 * Ship-speed score: 1 day is the fastest dispatch observed across the pair.
 * Every additional day costs 15 points, floored at 0.
 *   shipScore = clamp(100 − (days − 1) × 15, 0, 100)
 */
export function shipScore(listing: Listing): number {
  return clampNum(100 - (listing.shipDays - 1) * 15, 0, 100);
}

export const WEIGHT_FIELDS: Array<{ key: keyof Weights; label: string; hint: string }> = [
  { key: "price", label: "Price priority", hint: "Rewards whichever listing costs less." },
  { key: "condition", label: "Condition priority", hint: "Rewards the higher condition grade." },
  { key: "ship", label: "Ship-speed priority", hint: "Rewards the faster dispatch time." },
  { key: "trust", label: "Seller-trust priority", hint: "Rewards the stronger seller track record." },
];

/** Picked so the beam leans Left by a clear 17.0-point margin on first paint
 *  and after every reset — never a level, undecided default. */
export const DEFAULT_WEIGHTS: Weights = { price: 70, condition: 30, ship: 55, trust: 20 };

/**
 * The one formula every live number on this page traces back to: a weighted
 * average of four fixed, per-listing attribute scores.
 *   score = (wPrice·priceScore + wCondition·conditionScore + wShip·shipScore + wTrust·trustScore)
 *           ÷ (wPrice + wCondition + wShip + wTrust)
 */
export function weightedScore(listing: Listing, weights: Weights): number {
  const total = weights.price + weights.condition + weights.ship + weights.trust;
  if (total <= 0) return 0;
  const sum =
    weights.price * priceScore(listing) +
    weights.condition * listing.conditionScore +
    weights.ship * shipScore(listing) +
    weights.trust * listing.trustScore;
  return sum / total;
}

const TILT_K = 0.5;
export const TILT_MAX = 16;

/**
 * Beam tip angle, in degrees, from the two live scores — not a hardcoded
 * value. Positive rotates the right pan down (right leads); negative rotates
 * the left pan down (left leads). Clamped to ±16° so one extreme weight
 * combination can't spin the beam past a readable tilt.
 *   tiltDeg = clamp((scoreRight − scoreLeft) × 0.5, −16, 16)
 */
export function tiltDegrees(scoreLeft: number, scoreRight: number): number {
  const raw = (scoreRight - scoreLeft) * TILT_K;
  return Math.round(clampNum(raw, -TILT_MAX, TILT_MAX) * 100) / 100;
}

export function leaderOf(scoreLeft: number, scoreRight: number): LeaderId {
  if (Math.abs(scoreLeft - scoreRight) < 0.05) return "tie";
  return scoreLeft > scoreRight ? "left" : "right";
}

function pickBy(weights: Weights, cmp: (a: number, b: number) => boolean) {
  return WEIGHT_FIELDS.reduce((best, f) => (cmp(weights[f.key], weights[best.key]) ? f : best), WEIGHT_FIELDS[0]);
}

export function dominantWeightLabel(weights: Weights): string {
  return pickBy(weights, (a, b) => a > b).label;
}

export function weakestWeightLabel(weights: Weights): string {
  return pickBy(weights, (a, b) => a < b).label;
}

// ───────── shared visual tokens ─────────

/** green-700 — see candidates/b.md for the two computed contrast figures. */
export const ACCENT = "#15803d";
export const WINNER_FILL = ACCENT;
export const NEUTRAL_FILL = "#D4D4D8"; // zinc-300

export const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#15803d]";

export const DISPLAY = { fontFamily: "var(--font-display-mono)" } as const;
