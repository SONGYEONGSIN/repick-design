/**
 * The Bracket — deterministic catalogue, scoring and single-elimination
 * compute for 8 fixed turntable listings. No randomness, no dates: every
 * number here is a static fixture, and every score is derived from it with
 * plain arithmetic so the three priority modes produce three genuinely
 * different, fully-resolved brackets.
 */

export type PriorityMode = "price" | "condition" | "balanced";

export type ConditionLabel = "Excellent" | "Good" | "Fair";

export type Listing = {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice: number;
  /** 0–100 condition grade, already normalized. */
  condition: number;
  conditionLabel: ConditionLabel;
  verified: boolean;
  sellerSales: number;
  /** Base color for the generated SVG thumbnail — distinct per listing. */
  swatch: string;
};

// Fixed bracket seeding order. Round-1 pairs are (0,1) (2,3) (4,5) (6,7) —
// this pairing never changes; only which listing occupies each card does.
export const LISTINGS: Listing[] = [
  {
    id: "sl1200",
    name: "SL-1200MK2",
    brand: "Technics",
    price: 650,
    originalPrice: 900,
    condition: 92,
    conditionLabel: "Excellent",
    verified: true,
    sellerSales: 340,
    swatch: "#1E2A3F",
  },
  {
    id: "lp120x",
    name: "AT-LP120XUSB",
    brand: "Audio-Technica",
    price: 220,
    originalPrice: 300,
    condition: 78,
    conditionLabel: "Good",
    verified: true,
    sellerSales: 210,
    swatch: "#28405E",
  },
  {
    id: "plx500",
    name: "PLX-500",
    brand: "Pioneer DJ",
    price: 340,
    originalPrice: 450,
    condition: 85,
    conditionLabel: "Excellent",
    verified: false,
    sellerSales: 40,
    swatch: "#1B3350",
  },
  {
    id: "dp300f",
    name: "DP-300F",
    brand: "Denon",
    price: 140,
    originalPrice: 220,
    condition: 70,
    conditionLabel: "Good",
    verified: true,
    sellerSales: 95,
    swatch: "#345A82",
  },
  {
    id: "planar3",
    name: "Planar 3",
    brand: "Rega",
    price: 480,
    originalPrice: 620,
    condition: 90,
    conditionLabel: "Excellent",
    verified: true,
    sellerSales: 150,
    swatch: "#17263A",
  },
  {
    id: "orbitsp",
    name: "Orbit Special",
    brand: "U-Turn Audio",
    price: 300,
    originalPrice: 400,
    condition: 82,
    conditionLabel: "Good",
    verified: false,
    sellerSales: 22,
    swatch: "#3C5E88",
  },
  {
    id: "c100",
    name: "C100",
    brand: "Crosley",
    price: 90,
    originalPrice: 150,
    condition: 55,
    conditionLabel: "Fair",
    verified: false,
    sellerSales: 12,
    swatch: "#22344C",
  },
  {
    id: "pt01s",
    name: "PT01 Scratch",
    brand: "Numark",
    price: 120,
    originalPrice: 160,
    condition: 60,
    conditionLabel: "Fair",
    verified: true,
    sellerSales: 58,
    swatch: "#2E4F74",
  },
];

const PRICES = LISTINGS.map((l) => l.price);
const MIN_PRICE = Math.min(...PRICES);
const MAX_PRICE = Math.max(...PRICES);

/** Lower price → higher score, scaled 0–100 across the fixed catalogue. */
export function priceScore(listing: Listing): number {
  return ((MAX_PRICE - listing.price) / (MAX_PRICE - MIN_PRICE)) * 100;
}

export const MODE_WEIGHTS: Record<PriorityMode, { price: number; condition: number }> = {
  price: { price: 0.8, condition: 0.2 },
  condition: { price: 0.2, condition: 0.8 },
  balanced: { price: 0.5, condition: 0.5 },
};

export const MODE_LABEL: Record<PriorityMode, string> = {
  price: "Price-weighted",
  condition: "Condition-weighted",
  balanced: "Balanced",
};

export const MODE_ORDER: PriorityMode[] = ["price", "condition", "balanced"];

export function weightPct(mode: PriorityMode): { price: number; condition: number } {
  const w = MODE_WEIGHTS[mode];
  return { price: Math.round(w.price * 100), condition: Math.round(w.condition * 100) };
}

/** The live scoring formula: a weighted blend of price score and condition. */
export function fitScore(listing: Listing, mode: PriorityMode): number {
  const w = MODE_WEIGHTS[mode];
  return w.price * priceScore(listing) + w.condition * listing.condition;
}

function decideWinner(a: Listing, b: Listing, mode: PriorityMode): Listing {
  const sa = fitScore(a, mode);
  const sb = fitScore(b, mode);
  if (sa !== sb) return sa > sb ? a : b;
  // Deterministic tie-break: cheaper listing advances, then lower id.
  if (a.price !== b.price) return a.price < b.price ? a : b;
  return a.id < b.id ? a : b;
}

export type MatchResult = {
  label: string;
  a: Listing;
  b: Listing;
  scoreA: number;
  scoreB: number;
  winner: Listing;
};

function makeMatch(label: string, a: Listing, b: Listing, mode: PriorityMode): MatchResult {
  return {
    label,
    a,
    b,
    scoreA: fitScore(a, mode),
    scoreB: fitScore(b, mode),
    winner: decideWinner(a, b, mode),
  };
}

export type Bracket = {
  round1: MatchResult[];
  semis: MatchResult[];
  final: MatchResult;
  champion: Listing;
};

/** Recomputes the full 8-listing single-elimination bracket for a mode. */
export function computeBracket(mode: PriorityMode): Bracket {
  const [l1, l2, l3, l4, l5, l6, l7, l8] = LISTINGS;
  const m1 = makeMatch("Round of 8 · Match 1", l1, l2, mode);
  const m2 = makeMatch("Round of 8 · Match 2", l3, l4, mode);
  const m3 = makeMatch("Round of 8 · Match 3", l5, l6, mode);
  const m4 = makeMatch("Round of 8 · Match 4", l7, l8, mode);
  const s1 = makeMatch("Semifinal 1", m1.winner, m2.winner, mode);
  const s2 = makeMatch("Semifinal 2", m3.winner, m4.winner, mode);
  const final = makeMatch("Final", s1.winner, s2.winner, mode);
  return { round1: [m1, m2, m3, m4], semis: [s1, s2], final, champion: final.winner };
}

export function discountPct(listing: Listing): number {
  return Math.round(((listing.originalPrice - listing.price) / listing.originalPrice) * 100);
}

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function formatMoney(n: number): string {
  return money.format(n);
}

/**
 * A small deterministic turntable glyph, color-coded per listing, encoded
 * as a data: URI SVG. Next.js treats data: image sources as unoptimized
 * automatically (no `unoptimized` prop needed), so this stays fully local —
 * no network fetch, no remote image host, nothing to go stale.
 */
export function thumbDataUri(swatch: string): string {
  const svg = [
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">',
    `<rect width="100" height="100" fill="${swatch}"/>`,
    '<circle cx="42" cy="54" r="30" fill="none" stroke="#FFFFFF" stroke-opacity="0.35" stroke-width="2"/>',
    '<circle cx="42" cy="54" r="21" fill="none" stroke="#FFFFFF" stroke-opacity="0.22" stroke-width="2"/>',
    '<circle cx="42" cy="54" r="3" fill="#FFFFFF" fill-opacity="0.85"/>',
    '<line x1="78" y1="20" x2="52" y2="46" stroke="#FFFFFF" stroke-opacity="0.6" stroke-width="3" stroke-linecap="round"/>',
    '<circle cx="78" cy="20" r="4" fill="#FFFFFF" fill-opacity="0.6"/>',
    "</svg>",
  ].join("");
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
