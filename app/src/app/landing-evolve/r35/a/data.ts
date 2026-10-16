// Pure, deterministic data + scoring logic for the Repick appraisal certificate device.
// No Math.random / Date.now / new Date anywhere — every value below is a fixed literal or a
// pure function of fixed inputs, so the same inputs always render the same certificate.

export type Grade = "Good" | "Excellent" | "Mint";
export type Tier = "Core" | "Premium" | "Designer";
export interface Checks {
  serial: boolean;
  packaging: boolean;
}

export const GRADES: Grade[] = ["Good", "Excellent", "Mint"];
export const TIERS: Tier[] = ["Core", "Premium", "Designer"];

const GRADE_WEIGHT: Record<Grade, number> = { Good: 22, Excellent: 32, Mint: 40 };
const TIER_WEIGHT: Record<Tier, number> = { Core: 18, Premium: 27, Designer: 35 };
const CHECK_WEIGHT = 12;

// Fixed reference point: the average trust score across Repick's verified-listing cohort.
// A static benchmark printed on every report — not a figure this page claims to "re-pull" or
// recompute on a schedule from any backend.
export const BASELINE_SCORE = 68;

// The single listing this certificate is appraising. Its asking price never moves — only the
// visitor's assumptions about its condition, tier and checklist status move, which is what the
// device is actually demonstrating.
export const SERIAL = "RPK-24-00482-A";
export const ISSUE_DATE = "Oct 12, 2026";
export const LISTED_PRICE = 340;
export const LOT_LABEL = "Structured Top-Handle Bag, Lot 00482";

// Fixed fair-price bands per brand tier, in dollars [low, high].
const FAIR_BANDS: Record<Tier, [number, number]> = {
  Core: [120, 180],
  Premium: [300, 420],
  Designer: [480, 650],
};

export function computeScore(grade: Grade, tier: Tier, checks: Checks): number {
  const checkBonus = (checks.serial ? CHECK_WEIGHT : 0) + (checks.packaging ? CHECK_WEIGHT : 0);
  const raw = GRADE_WEIGHT[grade] + TIER_WEIGHT[tier] + checkBonus;
  return Math.max(0, Math.min(100, raw));
}

export interface Verdict {
  label: string;
  tone: "high" | "mid" | "low";
}

export function computeVerdict(score: number): Verdict {
  if (score >= 85) return { label: "Exceptional", tone: "high" };
  if (score >= 70) return { label: "Trusted", tone: "high" };
  if (score >= 55) return { label: "Fair", tone: "mid" };
  return { label: "Caution", tone: "low" };
}

export interface Fairness {
  label: string;
  tone: "good" | "watch";
  band: [number, number];
}

export function computeFairness(tier: Tier): Fairness {
  const band = FAIR_BANDS[tier];
  if (LISTED_PRICE < band[0]) return { label: "Below Market — Good Deal", tone: "good", band };
  if (LISTED_PRICE > band[1]) return { label: "Above Market — Review", tone: "watch", band };
  return { label: "Within Fair Range", tone: "good", band };
}

// Deterministic "signature" squiggle and "barcode" bars — fixed literal coordinates, not
// generated at runtime, so there is nothing to mismatch between server and client renders.
export const SIGNATURE_PATH =
  "M2,18 C8,4 14,28 20,14 C26,2 32,26 40,16 C46,8 52,24 60,12 C66,4 72,22 80,15 C86,10 92,20 98,13";

export const BARCODE_WIDTHS = [2, 1, 3, 1, 2, 4, 1, 1, 3, 2, 1, 4, 2, 3, 1, 2, 1, 3, 2, 1, 4, 1, 2, 3];

export interface Product {
  id: string;
  name: string;
  matchReason: string;
  condition: Grade;
  verified: boolean;
  before: number;
  after: number;
  thumb: "geo-a" | "geo-b" | "geo-c" | "geo-d";
  detail: string;
}

export const PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Structured Leather Tote",
    matchReason: "Matched on silhouette + hardware era",
    condition: "Excellent",
    verified: true,
    before: 420,
    after: 286,
    thumb: "geo-a",
    detail:
      "The AI weighted the rolled top-handle shape and the brushed-brass hardware finish against 212 archived reference listings before surfacing this piece.",
  },
  {
    id: "p2",
    name: "Wool Herringbone Overcoat",
    matchReason: "Matched on fabric weight + tailoring line",
    condition: "Mint",
    verified: true,
    before: 560,
    after: 412,
    thumb: "geo-b",
    detail:
      "Shoulder construction and herringbone density were cross-checked against the seller's submitted close-up photos, not the listing title.",
  },
  {
    id: "p3",
    name: "Suede Ankle Boots, EU 38",
    matchReason: "Matched on last shape + sole wear pattern",
    condition: "Good",
    verified: true,
    before: 210,
    after: 158,
    thumb: "geo-c",
    detail:
      "Sole wear was graded visually and the size run was confirmed against the brand's archived last library for this model year.",
  },
  {
    id: "p4",
    name: "Cashmere Wrap Scarf",
    matchReason: "Matched on fiber blend + colorway",
    condition: "Excellent",
    verified: false,
    before: 180,
    after: 132,
    thumb: "geo-d",
    detail:
      "Fiber blend was estimated from fabric photos pending a seller-submitted care label scan — verification is still in progress on this one.",
  },
];

export function discountPct(before: number, after: number): number {
  return Math.round(((before - after) / before) * 100);
}
