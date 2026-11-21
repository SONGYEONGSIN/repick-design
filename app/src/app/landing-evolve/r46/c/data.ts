// Static content + deterministic numbers for the "Payout Speed Race" candidate.
// No randomness anywhere — every figure below is a fixed literal.

export type Tier = "instant" | "standard";

// Platform fee, expressed as a fraction of the sale price, charged per payout tier.
// Instant costs a little more than Standard — an honest, named trade-off rather than
// implying instant payout is simply "free," which would overclaim.
export const FEE_RATE: Record<Tier, number> = {
  instant: 0.07,
  standard: 0.04,
};

// Race-track animation durations (ms). Genuinely different speeds, run concurrently.
export const DURATION_MS: Record<Tier, number> = {
  instant: 2200,
  standard: 9500,
};

// The real-world wait each tier represents, used only to compute the on-screen ETA
// countdown text as the bar fills — not a claim about this specific demo's clock time.
export const SIMULATED_SECONDS_INSTANT = 45;
export const SIMULATED_DAYS_STANDARD = 3;

// Default (pre-trigger) progress, so the race panel never shows an empty, unstarted
// track at first paint: Instant already reads as settled; Standard reads as partway
// through its 3-day window, which is the real, honest "at rest" state of a standard
// payout that hasn't landed yet.
export const DEFAULT_PROGRESS: Record<Tier, number> = {
  instant: 1,
  standard: 0.42,
};

export const SALE_AMOUNTS = [38, 96, 212] as const;
export const DEFAULT_SALE_AMOUNT = 96;

export function payoutFor(amount: number, tier: Tier): number {
  return Math.round(amount * (1 - FEE_RATE[tier]));
}

// Static editorial baseline for "this week so far" — not a live feed. The only part
// of this figure that is actually live is the amount this visitor's own simulated
// sale adds to it, which both the value-split tally and the closing CTA read from the
// same shared state, so neither makes a claim the page doesn't actually back up.
export const BASE_WEEKLY_INSTANT_TOTAL = 128_440;

export type Product = {
  id: string;
  title: string;
  category: string;
  price: number;
  originalPrice: number;
  grade: "Like New" | "Excellent" | "Good";
  demandMatch: number; // 0-100, relevance/demand signal
  verifiedSeller: boolean;
  photoId: string; // images.unsplash.com photo id
  alt: string;
};

export const PRODUCTS: Product[] = [
  {
    id: "p1",
    title: "Cropped denim jacket",
    category: "Outerwear",
    price: 42,
    originalPrice: 110,
    grade: "Excellent",
    demandMatch: 94,
    verifiedSeller: true,
    photoId: "1551028719-00167b16eac5",
    alt: "Cropped blue denim jacket laid flat on a light surface",
  },
  {
    id: "p2",
    title: "Leather tote bag",
    category: "Bags",
    price: 96,
    originalPrice: 240,
    grade: "Like New",
    demandMatch: 88,
    verifiedSeller: true,
    photoId: "1548036328-c9fa89d128fa",
    alt: "Brown leather tote bag photographed against a plain background",
  },
  {
    id: "p3",
    title: "Running sneakers, size 9",
    category: "Footwear",
    price: 58,
    originalPrice: 150,
    grade: "Good",
    demandMatch: 76,
    verifiedSeller: false,
    photoId: "1542291026-7eec264c27ff",
    alt: "Pair of white and grey running sneakers on a light background",
  },
];

export const VALUE_PROPS = [
  {
    title: "Paid in under a minute",
    body:
      "Choose Instant Payout and the money is in your account before you've finished writing the listing description for your next item.",
  },
  {
    title: "No bank transfer windows",
    body:
      "Standard Payout still works — it just means waiting out the same multi-day hold your bank already makes you sit through.",
  },
  {
    title: "Verified sellers, verified condition",
    body:
      "Every listing carries a condition grade and a seller verification check, so buyers commit faster and your item actually sells.",
  },
] as const;

export const TESTIMONIALS = [
  {
    quote:
      "I sold a jacket on a Tuesday afternoon and had the payout before I'd left the post office.",
    name: "Reyna O.",
    role: "Sold 41 items",
  },
  {
    quote:
      "Standard payout is fine if you're not in a rush. Instant is the one I actually use every time now.",
    name: "Marcus T.",
    role: "Sold 112 items",
  },
] as const;
