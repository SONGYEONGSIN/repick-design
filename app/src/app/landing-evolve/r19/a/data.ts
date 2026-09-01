// Deterministic dossier model. No Math.random anywhere — every number on the page is a pure
// function of (rigorId, windowId), computed once per render via useMemo in client.tsx and passed
// down as props, so the hero card, the sensitivity table, the value section and the closing CTA
// are all reading the same derived object.

export type RigorId = "standard" | "enhanced" | "forensic";
export type WindowId = "30" | "90" | "180";

export interface RigorLevel {
  id: RigorId;
  label: string;
  short: string;
  checks: number;
  weight: number;
  days: number;
}

export interface CompWindow {
  id: WindowId;
  label: string;
  short: string;
  days: number;
  comps: number;
  volatility: number;
}

export const RIGOR_LEVELS: RigorLevel[] = [
  { id: "standard", label: "Standard inspection", short: "Standard", checks: 8, weight: 0.82, days: 1 },
  { id: "enhanced", label: "Enhanced inspection", short: "Enhanced", checks: 14, weight: 0.91, days: 3 },
  { id: "forensic", label: "Forensic inspection", short: "Forensic", checks: 22, weight: 0.97, days: 7 },
];

export const WINDOWS: CompWindow[] = [
  { id: "30", label: "30-day comparables", short: "30 days", days: 30, comps: 6, volatility: 0.14 },
  { id: "90", label: "90-day comparables", short: "90 days", days: 90, comps: 19, volatility: 0.08 },
  { id: "180", label: "180-day comparables", short: "180 days", days: 180, comps: 34, volatility: 0.05 },
];

export const DEFAULT_RIGOR: RigorId = "enhanced";
export const DEFAULT_WINDOW: WindowId = "90";

// The single real listing the whole dossier is about.
export const SUBJECT = {
  caseFile: "REPICK-CF-2291",
  title: "Eames Lounge Chair & Ottoman",
  detail: "1972 Herman Miller, rosewood veneer, black leather",
  grade: "A−",
  gradeNote: "Excellent — light patina consistent with age",
  seller: "Seller S-4417",
  sellerNote: "Verified since 2019 · 340 completed trades",
  opened: "14 Aug 2026",
  retailValue: 9200,
  basePrice: 6850,
  minCompsForCleanPass: 8,
};

export interface Verdict {
  confidence: number;
  recommendedPrice: number;
  discountPercent: number;
  checksTotal: number;
  checksPassed: number;
  compsCount: number;
  turnaroundDays: number;
  clean: boolean;
}

export function deriveVerdict(rigorId: RigorId, windowId: WindowId): Verdict {
  const rigor = RIGOR_LEVELS.find((r) => r.id === rigorId) ?? RIGOR_LEVELS[1];
  const win = WINDOWS.find((w) => w.id === windowId) ?? WINDOWS[1];

  const confidence = Math.round(rigor.weight * 100 - win.volatility * 40);
  const priceFactor = 1 - win.volatility * (1 - rigor.weight);
  const recommendedPrice = Math.round(SUBJECT.basePrice * priceFactor);
  const discountPercent = Math.round(
    ((SUBJECT.retailValue - recommendedPrice) / SUBJECT.retailValue) * 100
  );
  const clean = win.comps >= SUBJECT.minCompsForCleanPass;
  const checksPassed = clean ? rigor.checks : rigor.checks - 1;

  return {
    confidence,
    recommendedPrice,
    discountPercent,
    checksTotal: rigor.checks,
    checksPassed,
    compsCount: win.comps,
    turnaroundDays: rigor.days,
    clean,
  };
}

// Sensitivity table: same helper, run for all three rigor tiers against whichever window is
// currently selected, so the appendix table re-derives in lockstep with the hero controls.
export function sensitivityRows(windowId: WindowId) {
  return RIGOR_LEVELS.map((rigor) => ({
    rigor,
    verdict: deriveVerdict(rigor.id, windowId),
  }));
}

export type Category = "Furniture" | "Watches" | "Cycling" | "Home";

export interface Listing {
  id: string;
  category: Category;
  title: string;
  detail: string;
  grade: string;
  gradeNote: string;
  verified: boolean;
  tags: string[];
  price: number;
  retail: number;
  matchPercent: number;
  live?: boolean;
}

export function discountPercent(retail: number, price: number): number {
  return Math.round(((retail - price) / retail) * 100);
}

// Card 1 is the subject of the whole dossier and is marked `live: true` so ProductPreview can
// overwrite its match/discount numbers with the same derived verdict shown in the hero, instead of
// a second, disconnected hardcoded figure.
export const LISTINGS: Listing[] = [
  {
    id: "cf-2291",
    category: "Furniture",
    title: "Eames Lounge Chair & Ottoman",
    detail: "1972 Herman Miller, rosewood / black leather",
    grade: "A−",
    gradeNote: "Excellent",
    verified: true,
    tags: ["Frame verified", "Serial matched", "Case file open"],
    price: 6850,
    retail: 9200,
    matchPercent: 0,
    live: true,
  },
  {
    id: "wt-0117",
    category: "Watches",
    title: "Datejust 36, Steel / White",
    detail: "1998 reference 16200, box only",
    grade: "A",
    gradeNote: "Excellent",
    verified: true,
    tags: ["Movement serviced", "Dial matched", "Priced within comp band"],
    price: 5920,
    retail: 8100,
    matchPercent: 91,
  },
  {
    id: "cy-0044",
    category: "Cycling",
    title: "Steel Road Frame, 56cm",
    detail: "1987 Bianchi, Columbus SL tubing",
    grade: "B+",
    gradeNote: "Very good",
    verified: true,
    tags: ["Frame true", "Groupset original", "Comp-priced"],
    price: 1180,
    retail: 1850,
    matchPercent: 86,
  },
  {
    id: "hm-0302",
    category: "Home",
    title: "Handwoven Kilim, 6×9",
    detail: "Wool, natural dye, Anatolian",
    grade: "A−",
    gradeNote: "Excellent",
    verified: true,
    tags: ["Weave inspected", "Colorfast tested", "Provenance noted"],
    price: 940,
    retail: 1420,
    matchPercent: 89,
  },
];

export const CATEGORIES: Category[] = ["Furniture", "Watches", "Cycling", "Home"];

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "I didn't just get a grade, I got the chain of custody. That's the difference between a listing and evidence.",
    name: "Priya N.",
    role: "Verified buyer, Case File 2104",
  },
  {
    quote:
      "Forensic rigor took a week on my end. It sold in six hours. The paperwork sells the item now, not the photos.",
    name: "Marcus D.",
    role: "Verified seller, 12 case files closed",
  },
  {
    quote:
      "We don't grade condition and stop there. We build a case for it, and every reviewer shows their work.",
    name: "Dana Ridley",
    role: "Verification lead, repick",
  },
];

export const AGGREGATE_STATS = [
  { label: "Case files closed", value: "12,400+" },
  { label: "Avg. buyer confidence rating", value: "4.8 / 5" },
  { label: "Avg. below replacement value", value: "31%" },
];
