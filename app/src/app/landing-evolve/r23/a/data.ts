// Grading Timeline — data & pure derivations for a single real listing moving through
// repick's five-step grading pipeline. Every number the page shows (confidence, grade,
// price, defect count, checklist state) is derived from `STAGES[stageIndex]` plus a
// handful of module-level constants below — there is no independent hardcoded copy of
// any of these values anywhere else in the tree. Deterministic on purpose: no
// Math.random / Date.now / new Date() anywhere in this file.

export type StageId = "intake" | "photos" | "inspection" | "grading" | "price";

export interface Stage {
  id: StageId;
  index: number;
  label: string; // short tab label
  fullLabel: string; // used in prose / aria-valuetext
  timestamp: string;
  narrative: string;
  evidenceCaption: string;
  confidence: number; // 0-100, cumulative as of this stage
  photosVerified: number; // 0-6, cumulative
  defectsLogged: number; // 0-3, cumulative
  priceLow: number;
  priceHigh: number;
  priceFinal: number | null;
}

// ---------------------------------------------------------------------------------
// Item + pricing constants. LOCKED_PRICE is the single source of truth for the final
// number every later section quotes — it is derived from the ledger line items below,
// not typed twice.
// ---------------------------------------------------------------------------------

export const ITEM = {
  title: "Double-Breasted Wool Overcoat",
  meta: "EU 48 / US 38 · Charcoal",
  seller: "atelier.vintage",
  matchScore: 94, // buyer-fit score: size + style board + price alert. Set at intake from
  // the buyer's saved preferences, not from inspection progress — it does not move as
  // the pipeline advances, which is why it is a plain constant rather than a per-stage
  // field on `Stage`.
};

export const RETAIL_COMP = 420;
export const GRADE_ADJUSTMENT = -207; // condition deduction the grade (see RUBRIC) earns this item
export const DEMAND_ADJUSTMENT = -32; // category + seasonal demand deduction
export const LOCKED_PRICE = RETAIL_COMP + GRADE_ADJUSTMENT + DEMAND_ADJUSTMENT; // 181

export const LEDGER_LINES: { label: string; value: number }[] = [
  { label: "Retail comparable", value: RETAIL_COMP },
  { label: "Condition adjustment (rubric)", value: GRADE_ADJUSTMENT },
  { label: "Category & demand adjustment", value: DEMAND_ADJUSTMENT },
];

export const STAGES: Stage[] = [
  {
    id: "intake",
    index: 0,
    label: "Intake",
    fullLabel: "Intake & Metadata",
    timestamp: "Day 0 · 09:02",
    narrative:
      "The seller submits category, size, and a self-reported condition. Nothing is verified yet, so the price band stays wide on purpose.",
    evidenceCaption: "Fig. 01 — Intake manifest",
    confidence: 34,
    photosVerified: 0,
    defectsLogged: 0,
    priceLow: 110,
    priceHigh: 260,
    priceFinal: null,
  },
  {
    id: "photos",
    index: 1,
    label: "Photo Verification",
    fullLabel: "Photo Verification",
    timestamp: "Day 0 · 14:47",
    narrative:
      "All six required angles are in and machine-checked for focus and lighting. No physical flaws are recorded at this step — that is next.",
    evidenceCaption: "Fig. 02 — Photo verification contact sheet",
    confidence: 52,
    photosVerified: 6,
    defectsLogged: 0,
    priceLow: 130,
    priceHigh: 230,
    priceFinal: null,
  },
  {
    id: "inspection",
    index: 2,
    label: "Physical Inspection",
    fullLabel: "Physical Inspection",
    timestamp: "Day 1 · 10:15",
    narrative:
      "A human inspector logs three flags directly onto the garment map. All three are minor or cosmetic — none are structural.",
    evidenceCaption: "Fig. 03 — Physical inspection map",
    confidence: 71,
    photosVerified: 6,
    defectsLogged: 3,
    priceLow: 150,
    priceHigh: 205,
    priceFinal: null,
  },
  {
    id: "grading",
    index: 3,
    label: "Grade Assignment",
    fullLabel: "Grade Assignment",
    timestamp: "Day 1 · 16:30",
    narrative:
      "Five weighted criteria combine into one letter grade. The price band tightens sharply now that condition is a number, not an estimate.",
    evidenceCaption: "Fig. 04 — Grading rubric",
    confidence: 88,
    photosVerified: 6,
    defectsLogged: 3,
    priceLow: 172,
    priceHigh: 188,
    priceFinal: null,
  },
  {
    id: "price",
    index: 4,
    label: "Price Lock",
    fullLabel: "Price Lock",
    timestamp: "Day 2 · 09:00",
    narrative:
      "The grade is certified and the band collapses to one number. The seller's payout is scheduled the same day.",
    evidenceCaption: "Fig. 05 — Price ledger",
    confidence: 97,
    photosVerified: 6,
    defectsLogged: 3,
    priceLow: LOCKED_PRICE,
    priceHigh: LOCKED_PRICE,
    priceFinal: LOCKED_PRICE,
  },
];

export const CHECKLIST: { id: string; label: string; doneAtStage: number }[] = [
  { id: "received", label: "Listing received — category & size confirmed", doneAtStage: 0 },
  { id: "photos", label: "Photo set complete — 6 of 6 required angles", doneAtStage: 1 },
  { id: "inspected", label: "Physical inspection logged — 3 flags reviewed on-site", doneAtStage: 2 },
  { id: "graded", label: "Grade computed — 5-point weighted rubric", doneAtStage: 3 },
  { id: "priced", label: "Price locked — seller payout scheduled", doneAtStage: 4 },
];

export interface Defect {
  id: string;
  label: string;
  severity: "Minor" | "Cosmetic";
  x: number;
  y: number;
}

export const DEFECTS: Defect[] = [
  { id: "cuff", label: "Left cuff — light fraying", severity: "Minor", x: 24, y: 76 },
  { id: "stain", label: "Interior chest label — faint stain", severity: "Minor", x: 51, y: 42 },
  { id: "button", label: "Collar top button — slightly loose", severity: "Cosmetic", x: 50, y: 16 },
];

export const PHOTO_SLOTS: { id: string; label: string }[] = [
  { id: "front", label: "Front" },
  { id: "back", label: "Back" },
  { id: "label", label: "Label & care tag" },
  { id: "hardware", label: "Hardware close-up" },
  { id: "lining", label: "Lining interior" },
  { id: "flaw", label: "Flaw detail" },
];

export interface RubricCriterion {
  id: string;
  label: string;
  score: number;
  max: number;
}

export const RUBRIC: RubricCriterion[] = [
  { id: "fabric", label: "Fabric integrity", score: 8, max: 10 },
  { id: "hardware", label: "Hardware & closures", score: 7, max: 10 },
  { id: "stitching", label: "Stitching & seams", score: 9, max: 10 },
  { id: "interior", label: "Interior & odor", score: 10, max: 10 },
  { id: "structure", label: "Structural shape", score: 8, max: 10 },
];

export const RUBRIC_AVERAGE = RUBRIC.reduce((sum, c) => sum + c.score, 0) / RUBRIC.length;

const GRADE_THRESHOLDS: { min: number; grade: string }[] = [
  { min: 9.5, grade: "A+" },
  { min: 9.0, grade: "A" },
  { min: 8.5, grade: "A-" },
  { min: 8.0, grade: "B+" },
  { min: 7.5, grade: "B" },
  { min: 7.0, grade: "B-" },
  { min: 6.0, grade: "C+" },
];

export function gradeFromScore(avg: number): string {
  for (const t of GRADE_THRESHOLDS) {
    if (avg >= t.min) return t.grade;
  }
  return "C";
}

export function provisionalGrade(defects: number): string {
  if (defects === 0) return "A- (provisional)";
  if (defects <= 2) return "B+ (provisional)";
  if (defects <= 4) return "B (provisional)";
  return "C+ (provisional)";
}

export function gradeForStage(stage: Stage): string {
  if (stage.index < 2) return "Pending";
  if (stage.index === 2) return provisionalGrade(stage.defectsLogged);
  return gradeFromScore(RUBRIC_AVERAGE);
}

export function midpoint(low: number, high: number): number {
  return Math.round((low + high) / 2);
}

export function currentPrice(stage: Stage): number {
  return stage.priceFinal ?? midpoint(stage.priceLow, stage.priceHigh);
}

export function priceLabel(stage: Stage): string {
  return stage.priceFinal != null
    ? money(stage.priceFinal)
    : `${money(stage.priceLow)}–${money(stage.priceHigh)}`;
}

export function discountPct(stage: Stage): number {
  return Math.round((1 - currentPrice(stage) / RETAIL_COMP) * 100);
}

export function money(n: number): string {
  return `$${n.toLocaleString("en-US")}`;
}

export interface MatchTag {
  id: string;
  label: string;
  detail: string;
}

export const MATCH_TAGS: MatchTag[] = [
  {
    id: "size",
    label: "Fits your saved size profile",
    detail: "You've saved 4 other EU 48 outerwear pieces in the last 90 days.",
  },
  {
    id: "board",
    label: 'Matches your "structured outerwear" board',
    detail: "87% of items on that board share this silhouette and wool-blend fabric.",
  },
  {
    id: "price",
    label: "Inside your $150–230 price alert",
    detail:
      "You set this range on Aug 14. The live estimate has stayed inside it since Photo Verification.",
  },
  {
    id: "velocity",
    label: "A similar grade sold in 4 days",
    detail: "The last three B+ overcoats listed in EU 46–50 averaged 4.2 days to sale.",
  },
];

export const SELLER_BADGES: string[] = [
  "ID verified",
  "Bank account verified",
  "4.9 seller rating (128 sales)",
  "Responds within 2 hrs",
];

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    quote: "I could see exactly which two flags were minor before I paid, not after.",
    name: "M. Alvarez",
    role: "Buyer, Chicago",
  },
  {
    quote: "My payout landed two days after the grade posted, not two weeks.",
    name: "R. Byun",
    role: "Seller, Seoul",
  },
  {
    quote: "It's the first grading system I've used that shows its math instead of a badge.",
    name: "T. Okafor",
    role: "Buyer, Lagos",
  },
];

export const SITE_STATS: { value: string; label: string }[] = [
  { value: "12,400", label: "items graded to date" },
  { value: "4.9 / 5", label: "average seller rating" },
  { value: "4.2 days", label: "average time-to-sale once graded" },
];

// ---------------------------------------------------------------------------------
// Value split: compares the intake baseline (no inspection yet) against whatever
// stage is currently live in the hero scrubber. Both sides are read from `STAGES`,
// never re-typed.
// ---------------------------------------------------------------------------------

export function rangeWidth(stage: Stage): number {
  return stage.priceFinal != null ? 0 : stage.priceHigh - stage.priceLow;
}

// ---------------------------------------------------------------------------------
// Shared visual tokens. Accent is an antique-brass gold, deliberately outside the
// amber/orange and rose families used in nearby rounds — see candidates/a.md for the
// contrast math on ACCENT_FILL and ACCENT_BRIGHT.
// ---------------------------------------------------------------------------------

export const ACCENT_FILL = "#7A5F28";
export const ACCENT_FILL_HOVER = "#63491E";
export const ACCENT_BRIGHT = "#D9BE84";

export const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D9BE84]";
export const SKIP_LINK =
  "sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-50 focus-visible:rounded-full focus-visible:bg-white focus-visible:px-4 focus-visible:py-2 focus-visible:text-[13px] focus-visible:font-semibold focus-visible:text-[#0B0B0F] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7A5F28]";
export const EYEBROW = "text-[11px] font-semibold tracking-[0.28em] text-[#D9BE84]";
export const CAPTION = "text-[11px] font-normal tracking-[0.14em] text-zinc-400";
