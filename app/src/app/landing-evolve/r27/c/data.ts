// Fair-Price Slope — static, hand-authored catalog + pure derivation helpers.
// No randomness anywhere (no Math.random / Date.now / new Date()): every base number below is a
// fixed literal, and the one number that changes with the scenario toggle — each item's repick
// "verified fair price" — is a plain arithmetic function of that item's own fixed attributes and
// the current scenario's two weights. Same scenario always produces the same fair prices, ranks
// and slope lines; nothing is a swapped-in static dataset per toggle state.

export type CategoryId = "sneakers" | "handbags" | "watches" | "cameras" | "instruments" | "outerwear" | "electronics";

export interface Item {
  id: string;
  name: string;
  short: string; // compact label for chart rows / hero chips
  category: CategoryId;
  seller: string;
  retailPrice: number; // original retail price when new — reference for the "before/after" discount %
  sellerAsking: number; // current listed resale price — fixed, does not change with the toggle
  compBaseline: number; // repick's comparable-sales baseline for this exact item, before scenario weighting
  conditionScore: number; // 0-100, AI condition grade input
  authenticityScore: number; // 0-100, AI authenticity-signal input
  demandScore: number; // 0-100, category demand input
  matchPct: number; // AI buyer-match score shown on the listing card
  photoId: string; // fixed images.unsplash.com/photo-<id>
  reasonTags: [string, string];
}

export const CATEGORY_LABEL: Record<CategoryId, string> = {
  sneakers: "Sneakers",
  handbags: "Handbags",
  watches: "Watches",
  cameras: "Cameras",
  instruments: "Instruments",
  outerwear: "Outerwear",
  electronics: "Electronics",
};

export const ITEMS: Item[] = [
  {
    id: "sneakers-1",
    name: "Air Jordan 1 Retro High OG, Limited Colorway",
    short: "Air Jordan 1 OG",
    category: "sneakers",
    seller: "StreetVault",
    retailPrice: 650,
    sellerAsking: 420,
    compBaseline: 340,
    conditionScore: 88,
    authenticityScore: 62,
    demandScore: 78,
    matchPct: 83,
    photoId: "1595950653159-6c9ebd614d3a",
    reasonTags: ["Sole wear consistent with claimed use", "Box label font under authenticity review"],
  },
  {
    id: "handbag-1",
    name: "Chanel Classic Flap, Medium, Caviar Leather",
    short: "Chanel Flap Bag",
    category: "handbags",
    seller: "Lena M.",
    retailPrice: 6800,
    sellerAsking: 3800,
    compBaseline: 4100,
    conditionScore: 91,
    authenticityScore: 96,
    demandScore: 82,
    matchPct: 95,
    photoId: "1584917865437-de89df76afd3",
    reasonTags: ["Hardware stamp matches verified serial pattern", "Corner wear consistent with authentic caviar"],
  },
  {
    id: "watch-1",
    name: "Omega Speedmaster Professional Moonwatch",
    short: "Omega Speedmaster",
    category: "watches",
    seller: "ChronoVault",
    retailPrice: 6800,
    sellerAsking: 3200,
    compBaseline: 3050,
    conditionScore: 84,
    authenticityScore: 89,
    demandScore: 60,
    matchPct: 90,
    photoId: "1524805444843-089113d48a6d",
    reasonTags: ["Movement serial cross-checked against archive", "Bracelet stretch consistent with 8+ years wear"],
  },
  {
    id: "camera-1",
    name: "Sony A7 IV Mirrorless Body",
    short: "Sony A7 IV",
    category: "cameras",
    seller: "OpticalMint",
    retailPrice: 2500,
    sellerAsking: 1750,
    compBaseline: 1600,
    conditionScore: 90,
    authenticityScore: 97,
    demandScore: 70,
    matchPct: 93,
    photoId: "1516035069371-29a1b244cc32",
    reasonTags: ["Shutter count under 12,000 actuations", "Sensor and viewfinder test clean, no dust"],
  },
  {
    id: "guitar-1",
    name: "Fender American Professional II Stratocaster",
    short: "Fender Strat",
    category: "instruments",
    seller: "SixString Co.",
    retailPrice: 1700,
    sellerAsking: 1050,
    compBaseline: 1180,
    conditionScore: 86,
    authenticityScore: 94,
    demandScore: 55,
    matchPct: 87,
    photoId: "1550985613830-c2b6b5f4e1a2",
    reasonTags: ["Neck relief and frets test true, no buzz", "Finish matches factory nitrocellulose spec"],
  },
  {
    id: "jacket-1",
    name: "Patagonia Retro-X Fleece, Vintage 90s Reissue",
    short: "Patagonia Fleece",
    category: "outerwear",
    seller: "Priya K.",
    retailPrice: 250,
    sellerAsking: 145,
    compBaseline: 110,
    conditionScore: 72,
    authenticityScore: 99,
    demandScore: 88,
    matchPct: 79,
    photoId: "1551028719990-00167b16eac5",
    reasonTags: ["Zipper and elastic cuffs test like-new", "Colorway matches verified 1994 catalog run"],
  },
  {
    id: "console-1",
    name: "PlayStation 5 Console, Disc Edition",
    short: "PS5 Console",
    category: "electronics",
    seller: "Dana R.",
    retailPrice: 500,
    sellerAsking: 420,
    compBaseline: 460,
    conditionScore: 95,
    authenticityScore: 99,
    demandScore: 92,
    matchPct: 96,
    photoId: "1607853202213-797f1c22a38e",
    reasonTags: ["Disc drive and HDMI port test clean", "Original packaging and cables included"],
  },
];

export function gradeFromCondition(score: number): string {
  if (score >= 95) return "A+";
  if (score >= 90) return "A";
  if (score >= 85) return "A-";
  if (score >= 80) return "B+";
  if (score >= 75) return "B";
  if (score >= 70) return "B-";
  return "C+";
}

export function discountPct(asking: number, retail: number): number {
  return Math.round(((retail - asking) / retail) * 100);
}

// --------------------------------------------------------------------------------------------------
// Scenario toggle — a small, discrete, named switch (3 states). Each scenario is just two weights;
// every downstream number (fair price, rank, delta, summary, closing-CTA sentence) is recomputed
// from these weights and each item's own fixed attributes. No per-scenario dataset is swapped in.

export interface Scenario {
  id: string;
  label: string;
  short: string;
  blurb: string;
  authenticityWeight: number;
  demandWeight: number;
}

export const SCENARIOS: Scenario[] = [
  {
    id: "balanced",
    label: "Balanced verification",
    short: "Balanced",
    blurb: "Equal weight on authenticity signals and category demand — repick's default read.",
    authenticityWeight: 1.0,
    demandWeight: 0.5,
  },
  {
    id: "authenticity-first",
    label: "Authenticity-first",
    short: "Authenticity-first",
    blurb: "Leans hard on authenticity signals — the read a cautious buyer wants before a big spend.",
    authenticityWeight: 1.8,
    demandWeight: 0.2,
  },
  {
    id: "fast-sale",
    label: "Fast-sale pricing",
    short: "Fast-sale",
    blurb: "Leans into category demand to price for a quick sale — for a seller who needs cash this week.",
    authenticityWeight: 0.6,
    demandWeight: 1.4,
  },
];

export const DEFAULT_SCENARIO_ID = "balanced";

/**
 * Pure derivation: repick's "verified fair price" for one item under one scenario.
 *
 *  - conditionFactor: 0.75-1.00, scales the comp baseline down for lower AI condition grades.
 *  - authFactor: no penalty once authenticityScore clears 90; below that, the gap is penalized,
 *    scaled by the scenario's authenticityWeight — so "Authenticity-first" punishes a shaky
 *    authenticity signal far harder than "Fast-sale pricing" does, from the SAME underlying gap.
 *  - demandFactor: a symmetric premium/discount around a demandScore of 50, scaled by the
 *    scenario's demandWeight — so "Fast-sale pricing" leans into high demand far harder.
 *  Rounded to the nearest $5, matching how a real price tool would round a recommendation.
 */
export function computeFairPrice(item: Item, scenario: Scenario): number {
  const conditionFactor = 0.75 + 0.25 * (item.conditionScore / 100);
  const authGap = Math.max(0, 90 - item.authenticityScore);
  const authFactor = Math.max(0.35, 1 - (authGap / 100) * scenario.authenticityWeight);
  const demandFactor = 1 + ((item.demandScore - 50) / 100) * scenario.demandWeight;
  const raw = item.compBaseline * conditionFactor * authFactor * demandFactor;
  return Math.round(raw / 5) * 5;
}

export function priceDeltaPct(asking: number, fair: number): number {
  return ((fair - asking) / asking) * 100;
}

// Shared clamp for mapping a signed delta % to the chart's per-row vertical band. Headroom above
// the largest delta this dataset actually produces (fast-sale pricing tops out at +71.4%) so no
// line is ever visually clipped.
export const DELTA_CLAMP_PCT = 80;

export type Direction = "up" | "down" | "flat";

export interface SlopeRow {
  item: Item;
  row: number; // 0-based fixed row index, by asking price desc — same in every scenario
  asking: number;
  fair: number;
  delta: number; // signed %, fair vs asking
  direction: Direction;
}

// Every item keeps ONE fixed row (sorted by asking price, descending — never reshuffled by the
// toggle), so the chart's vertical layout is guaranteed collision-free at any viewport regardless
// of how close two items' dollar amounts are. What DOES move with the scenario is `delta` — each
// row's line tilts up or down inside its own band by an amount the chart scales directly from this
// real, recomputed percentage, so the line's angle stays an honest read of the correction size
// (a small angle for a ~2% correction, a steep one for a ~60% correction) instead of collapsing to
// a same-looking rank swap every time.
export function computeSlopeRows(scenario: Scenario): SlopeRow[] {
  const ordered = [...ITEMS].sort((a, b) => b.sellerAsking - a.sellerAsking);
  return ordered.map((it, row) => {
    const asking = it.sellerAsking;
    const fair = computeFairPrice(it, scenario);
    const delta = priceDeltaPct(asking, fair);
    const direction: Direction = delta > 0.5 ? "up" : delta < -0.5 ? "down" : "flat";
    return { item: it, row, asking, fair, delta, direction };
  });
}

export interface SlopeSummary {
  total: number;
  upCount: number;
  downCount: number;
  flatCount: number;
  avgAbsDeltaPct: number;
  avgSignedDeltaPct: number;
  biggestMover: SlopeRow;
}

export function computeSummary(rows: SlopeRow[]): SlopeSummary {
  const total = rows.length;
  const upCount = rows.filter((r) => r.direction === "up").length;
  const downCount = rows.filter((r) => r.direction === "down").length;
  const flatCount = total - upCount - downCount;
  const avgAbsDeltaPct = rows.reduce((s, r) => s + Math.abs(r.delta), 0) / total;
  const avgSignedDeltaPct = rows.reduce((s, r) => s + r.delta, 0) / total;
  const biggestMover = rows.reduce((max, r) => (Math.abs(r.delta) > Math.abs(max.delta) ? r : max), rows[0]);
  return { total, upCount, downCount, flatCount, avgAbsDeltaPct, avgSignedDeltaPct, biggestMover };
}

export function scenarioById(id: string): Scenario {
  return SCENARIOS.find((s) => s.id === id) ?? SCENARIOS[0];
}

// --------------------------------------------------------------------------------------------------
// Hero + product-preview selection.

export const HERO_ITEM_IDS = ["sneakers-1", "handbag-1", "camera-1", "console-1"];

export const PREVIEW_FILTERS: { id: "all" | CategoryId; label: string }[] = [
  { id: "all", label: "All categories" },
  { id: "sneakers", label: CATEGORY_LABEL.sneakers },
  { id: "handbags", label: CATEGORY_LABEL.handbags },
  { id: "watches", label: CATEGORY_LABEL.watches },
  { id: "cameras", label: CATEGORY_LABEL.cameras },
  { id: "instruments", label: CATEGORY_LABEL.instruments },
  { id: "outerwear", label: CATEGORY_LABEL.outerwear },
  { id: "electronics", label: CATEGORY_LABEL.electronics },
];

// --------------------------------------------------------------------------------------------------
// Social proof.

export const TESTIMONIALS = [
  {
    name: "Marisol Ortega",
    context: "Sold a watch and a bag this year",
    quote:
      "My Speedmaster's asking price barely moved after verification, but it told me it was priced right instead of me guessing.",
    rating: 5,
    verified: true,
  },
  {
    name: "Theo Bramwell",
    context: "Buys sneakers weekly",
    quote:
      "The authenticity-first read flagged a pair everyone else had listed as clean. Saved me from a $420 mistake.",
    rating: 5,
    verified: true,
  },
  {
    name: "Ada Whitfield",
    context: "First-time console seller",
    quote: "Switched to fast-sale pricing and had three offers within a day. The math behind it was right there.",
    rating: 4,
    verified: true,
  },
] as const;

export const TRUST_STATS = [
  { label: "Listings AI-verified to date", value: "212,000+" },
  { label: "Median time to sell, Grade A-", value: "5 days" },
  { label: "Buyers who check the fair price first", value: "88%" },
] as const;

export const TRUST_SIGNALS = [
  "Condition graded by AI plus human spot-check",
  "Authenticity signals checked on every eligible listing",
  "Fair price shown before you list or buy",
  "Buyer protection on every sale",
] as const;
