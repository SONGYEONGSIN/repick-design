import type { LucideIcon } from "lucide-react";
import { Bike, Camera, Footprints, Package, Shirt, Watch } from "lucide-react";

/**
 * Everything on this page derives from these tables plus the viewer's active-category
 * selection. No randomness, no clock reads — the same toggle state always produces the
 * same steps, the same score, the same copy. See buildSteps / computeScore below.
 */

export type CategoryId = "authenticity" | "condition" | "price" | "seller";
export type CheckResult = "pass" | "hold";
export type StepStatus = CheckResult | "skipped";

export interface Category {
  id: CategoryId;
  label: string;
  short: string;
  weight: number;
  blurb: string;
}

export const CATEGORIES: Category[] = [
  {
    id: "authenticity",
    label: "Authenticity",
    short: "Auth",
    weight: 4,
    blurb: "Serial, hologram, and stitch pattern cross-referenced against maker records.",
  },
  {
    id: "condition",
    label: "Condition",
    short: "Cond",
    weight: 3,
    blurb: "Wear points photographed and graded against a fixed rubric, not the seller's word.",
  },
  {
    id: "price",
    label: "Price fairness",
    short: "Price",
    weight: 2,
    blurb: "Listing price benchmarked against the 90-day resale median for the same grade.",
  },
  {
    id: "seller",
    label: "Seller history",
    short: "Seller",
    weight: 2,
    blurb: "Return rate, dispute count, and delivery accuracy across the seller's past sales.",
  },
];

export type Active = Record<CategoryId, boolean>;

export const DEFAULT_ACTIVE: Active = {
  authenticity: true,
  condition: true,
  price: true,
  seller: true,
};

export interface Listing {
  id: string;
  name: string;
  categoryLabel: string;
  icon: LucideIcon;
  price: number;
  marketPrice: number;
  conditionGrade: string;
  results: Record<CategoryId, CheckResult>;
  notes: Record<CategoryId, string>;
}

export const LISTINGS: Listing[] = [
  {
    id: "trail-runner",
    name: "Trail Runner 900",
    categoryLabel: "Running shoes",
    icon: Footprints,
    price: 128,
    marketPrice: 165,
    conditionGrade: "9.4 / 10 — like new",
    results: { authenticity: "pass", condition: "pass", price: "pass", seller: "pass" },
    notes: {
      authenticity: "Lace-eyelet stitch count matches the factory spec sheet.",
      condition: "Outsole wear under 5%, no midsole compression.",
      price: "12% under the 90-day median for this grade.",
      seller: "41 sales, 0 disputes, 99% on-time delivery.",
    },
  },
  {
    id: "chrono-diver",
    name: "Chrono Diver 42",
    categoryLabel: "Watches",
    icon: Watch,
    price: 2140,
    marketPrice: 2400,
    conditionGrade: "7.8 / 10 — light wear",
    results: { authenticity: "pass", condition: "hold", price: "pass", seller: "pass" },
    notes: {
      authenticity: "Movement serial matches the case-back registry.",
      condition: "Bezel insert shows a hairline chip — held for buyer review.",
      price: "11% under median for a light-wear unit.",
      seller: "23 sales, 1 late delivery, 0 disputes.",
    },
  },
  {
    id: "rangefinder-iv",
    name: "Rangefinder IV",
    categoryLabel: "Cameras",
    icon: Camera,
    price: 640,
    marketPrice: 690,
    conditionGrade: "8.6 / 10 — clean",
    results: { authenticity: "hold", condition: "pass", price: "pass", seller: "pass" },
    notes: {
      authenticity: "Serial plate photo is low-resolution — a second angle was requested.",
      condition: "Viewfinder clear, shutter tested at three speeds.",
      price: "7% under the 90-day median.",
      seller: "12 sales, 0 disputes.",
    },
  },
  {
    id: "weekender-tote",
    name: "Weekender Tote",
    categoryLabel: "Bags",
    icon: Package,
    price: 410,
    marketPrice: 345,
    conditionGrade: "9.0 / 10 — excellent",
    results: { authenticity: "pass", condition: "pass", price: "hold", seller: "pass" },
    notes: {
      authenticity: "Hardware stamp and lining pattern both match.",
      condition: "Corners and handles show no separation.",
      price: "19% over the 90-day median — priced above its grade.",
      seller: "8 sales, 0 disputes.",
    },
  },
  {
    id: "alloy-roadster",
    name: "Alloy Roadster",
    categoryLabel: "Bikes",
    icon: Bike,
    price: 890,
    marketPrice: 940,
    conditionGrade: "8.2 / 10 — clean",
    results: { authenticity: "pass", condition: "pass", price: "pass", seller: "hold" },
    notes: {
      authenticity: "Frame number matches the registered build sheet.",
      condition: "Drivetrain shows normal wear for the mileage claimed.",
      price: "5% under the 90-day median.",
      seller: "Second sale on the platform — track record still thin.",
    },
  },
  {
    id: "wool-overcoat",
    name: "Wool Overcoat",
    categoryLabel: "Outerwear",
    icon: Shirt,
    price: 265,
    marketPrice: 240,
    conditionGrade: "6.9 / 10 — visible wear",
    results: { authenticity: "pass", condition: "hold", price: "hold", seller: "pass" },
    notes: {
      authenticity: "Label weave and button stamp both check out.",
      condition: "Elbow thinning visible in photo 4 — graded down from the seller's claim.",
      price: "10% over median for this condition grade.",
      seller: "34 sales, 0 disputes.",
    },
  },
];

export interface StepResult {
  id: string;
  label: string;
  status: StepStatus;
  detail: string;
}

const INTAKE_DETAIL = "12 reference photos logged, serials extracted.";

/** Sequential pipeline for one listing under one active-category selection. Pure function. */
export function buildSteps(listing: Listing, active: Active): StepResult[] {
  const steps: StepResult[] = [{ id: "intake", label: "Intake scan", status: "pass", detail: INTAKE_DETAIL }];
  let anyActive = false;
  let anyHold = false;
  for (const cat of CATEGORIES) {
    if (active[cat.id]) {
      anyActive = true;
      const result = listing.results[cat.id];
      if (result === "hold") anyHold = true;
      steps.push({ id: cat.id, label: cat.label, status: result, detail: listing.notes[cat.id] });
    } else {
      steps.push({ id: cat.id, label: cat.label, status: "skipped", detail: "Not included in this run." });
    }
  }
  steps.push({
    id: "compile",
    label: "Compile verdict",
    status: !anyActive ? "hold" : anyHold ? "hold" : "pass",
    detail: !anyActive
      ? "No checks selected — nothing to compile."
      : anyHold
        ? "At least one active check needs manual review before this listing clears."
        : "Every active check passed. Listing clears for the feed.",
  });
  return steps;
}

/** Weighted trust score, 0-100, scaled only to the categories currently switched on. */
export function computeScore(listing: Listing, active: Active): number {
  let weightSum = 0;
  let earned = 0;
  for (const cat of CATEGORIES) {
    if (!active[cat.id]) continue;
    weightSum += cat.weight;
    earned += listing.results[cat.id] === "pass" ? cat.weight : cat.weight * 0.35;
  }
  if (weightSum === 0) return 0;
  return Math.round((earned / weightSum) * 100);
}

export const PASS_THRESHOLD = 75;

export function scoreLabel(score: number, activeN: number): "Clear" | "Review" {
  if (activeN === 0) return "Review";
  return score >= PASS_THRESHOLD ? "Clear" : "Review";
}

export function activeCount(active: Active): number {
  return CATEGORIES.filter((c) => active[c.id]).length;
}

export function median(nums: number[]): number {
  const sorted = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) return Math.round((sorted[mid - 1] + sorted[mid]) / 2);
  return sorted[mid];
}

export function discountPct(listing: Listing): number {
  return Math.round(((listing.marketPrice - listing.price) / listing.marketPrice) * 100);
}
