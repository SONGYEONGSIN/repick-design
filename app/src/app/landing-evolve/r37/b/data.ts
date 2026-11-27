// app/src/app/landing-evolve/r37/b/data.ts
//
// Fixed, deterministic content for this route. Nothing here is random or
// date-derived — every number a viewer sees is either one of these literals
// or a pure function of them (see score-math.ts).

export const STEPS = [
  {
    id: "scan",
    order: 1,
    label: "AI Photo Scan",
    shortLabel: "Scan",
    chainCaption: "6/6 angles captured",
  },
  {
    id: "grading",
    order: 2,
    label: "Condition Grading",
    shortLabel: "Grading",
    chainCaption: "96/100 overall",
  },
  {
    id: "authenticity",
    order: 3,
    label: "Authenticity Check",
    shortLabel: "Authenticity",
    chainCaption: "4/4 markers matched",
  },
  {
    id: "listed",
    order: 4,
    label: "Listed",
    shortLabel: "Listed",
    chainCaption: "99% final confidence",
  },
] as const;

export type StepId = (typeof STEPS)[number]["id"];

/**
 * Each step's own numeric contribution to the Trust Score. "scan" is the
 * angle-coverage completeness (6 of 6 angles → 100). "grading" is the
 * rounded average of the four condition sub-scores in `CONDITION_SUBSCORES`.
 * "authenticity" is the fraction of matched markers in `AUTHENTICITY_MARKERS`
 * (4 of 4 → 100). "listed" is deliberately NOT an independent raw reading —
 * it is the rounded average of the first three, because the listing step is
 * the pipeline's own output, not a fifth fresh measurement.
 */
export const STEP_SCORE: Record<StepId, number> = {
  scan: 100,
  grading: 96,
  authenticity: 100,
  listed: 99, // round((100 + 96 + 100) / 3) = round(98.666...) = 99
};

export const ANGLE_LABELS = [
  "Front",
  "Back",
  "Left side",
  "Right side",
  "Collar detail",
  "Fabric close-up",
] as const;

export const CONDITION_SUBSCORES = [
  { label: "Fabric wear", score: 92 },
  { label: "Hardware condition", score: 97 },
  { label: "Odor control", score: 100 },
  { label: "Structural integrity", score: 95 },
] as const;

export const AUTHENTICITY_MARKERS = [
  "Serial number verified",
  "Stitching pattern matched",
  "Hardware stamp confirmed",
  "Logo placement confirmed",
] as const;

/** The example listing the verification walk is actually inspecting — reused as the first product card below. */
export const FEATURED_ITEM = {
  title: "Cropped denim jacket",
  price: 72,
  originalPrice: 98,
} as const;

export type ProductArtKind = "jacket" | "tote" | "lamp" | "boots";

export interface Product {
  id: string;
  title: string;
  artKind: ProductArtKind;
  price: number;
  originalPrice: number;
  grade: number;
  verified: boolean;
  matchReason: string;
}

export const GRADE_LABEL = (score: number): string => {
  if (score >= 95) return "Excellent";
  if (score >= 85) return "Very good";
  if (score >= 75) return "Good";
  return "Fair";
};

/**
 * The four cards shown inside the hero. "jacket" is the exact item the
 * verification walk above inspects — its grade (96) and verified status
 * match `STEP_SCORE.grading` and `STEP_SCORE.authenticity` on purpose, so
 * the card reads as the direct output of the pipeline a viewer just opened,
 * not a coincidentally similar number.
 */
export const PRODUCTS: Product[] = [
  {
    id: "jacket",
    title: "Cropped denim jacket",
    artKind: "jacket",
    price: 72,
    originalPrice: 98,
    grade: 96,
    verified: true,
    matchReason: "Matches: cropped silhouette, light wash",
  },
  {
    id: "tote",
    title: "Structured leather tote",
    artKind: "tote",
    price: 145,
    originalPrice: 210,
    grade: 91,
    verified: true,
    matchReason: "Matches your style board: structured leather",
  },
  {
    id: "lamp",
    title: "Ceramic arc table lamp",
    artKind: "lamp",
    price: 58,
    originalPrice: 89,
    grade: 88,
    verified: false,
    matchReason: "Matches: warm-toned home accents",
  },
  {
    id: "boots",
    title: "Suede chelsea boots, size 9",
    artKind: "boots",
    price: 84,
    originalPrice: 130,
    grade: 95,
    verified: true,
    matchReason: "Matches your size and brand filters",
  },
];

export const SOCIAL_STATS = [
  { value: "41,000+", label: "listings that have completed the full four-step walk" },
  { value: "1 in 6", label: "listings rejected after failing a check, never shown in the catalog" },
] as const;

export const BUYER_QUOTES = [
  {
    name: "Dana R.",
    role: "bought the suede chelsea boots",
    quote:
      "I opened the authenticity step before I opened the photos. Four markers, all named, all checked — that's the order I actually trust things in.",
  },
  {
    name: "Theo M.",
    role: "first-time thrifted-formalwear buyer",
    quote:
      "The grading breakdown is what sold me. Knowing the odor score was separate from the fabric-wear score made the overall number feel earned, not asserted.",
  },
  {
    name: "Isla V.",
    role: "returned a non-match once",
    quote:
      "I only ever checked the scan step before. This time I opened all four, and the trust score actually moved while I did it — not just the badge color.",
  },
] as const;
