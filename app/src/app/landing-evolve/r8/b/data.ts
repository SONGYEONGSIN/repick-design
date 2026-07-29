import type { LucideIcon } from "lucide-react";
import { SlidersHorizontal, RefreshCw, ShieldCheck } from "lucide-react";

// --- utils -------------------------------------------------------------------
export const cx = (...parts: Array<string | false | null | undefined>) =>
  parts.filter(Boolean).join(" ");

// deterministic thousands separator (SSR-safe, no locale/toLocaleString drift)
export const comma = (n: number) =>
  n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

// --- motion ------------------------------------------------------------------
export const EASE = [0.16, 1, 0.3, 1] as const;
export const VIEWPORT = { once: true, margin: "-80px" } as const;

// --- shared class tokens (design DNA: dark near-monochrome + single accent) --
export const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0F] focus-visible:ring-[#6E56CF]";
// tracking 3-scale: eyebrow 0.28em / caption 0.16em / stat 0.12em
export const EYEBROW =
  "text-[0.7rem] font-semibold uppercase tracking-[0.28em]";
export const CAPTION =
  "text-[0.72rem] font-semibold uppercase tracking-[0.16em]";
export const NUM = "tabular-nums tracking-[0.12em]";

// --- balance-scale weighting model -------------------------------------------
// Each criterion carries three discrete, hand-authored priority levels. There
// is no drag-to-random continuum and no wall-clock/Math.random anywhere below
// — every match% and beam angle is a pure function of which three levels are
// currently selected, so the same three choices always reproduce the same
// numbers.
export type CriterionLevel = { id: string; label: string; delta: number };
export type CriterionId = "style" | "budget" | "condition";
export type Criterion = {
  id: CriterionId;
  label: string;
  hint: string;
  levels: [CriterionLevel, CriterionLevel, CriterionLevel];
};

export const CRITERIA: Criterion[] = [
  {
    id: "style",
    label: "Style fit",
    hint: "Weight against your saved silhouettes and palette.",
    levels: [
      { id: "low", label: "Low priority", delta: -3 },
      { id: "balanced", label: "Balanced", delta: 4 },
      { id: "high", label: "Top priority", delta: 11 },
    ],
  },
  {
    id: "budget",
    label: "Budget",
    hint: "Weight given to the size of the discount.",
    levels: [
      { id: "low", label: "Low priority", delta: 6 },
      { id: "balanced", label: "Balanced", delta: 1 },
      { id: "high", label: "Top priority", delta: -7 },
    ],
  },
  {
    id: "condition",
    label: "Condition",
    hint: "Weight given to verified wear and authenticity checks.",
    levels: [
      { id: "low", label: "Low priority", delta: -2 },
      { id: "balanced", label: "Balanced", delta: 3 },
      { id: "high", label: "Top priority", delta: 9 },
    ],
  },
];

export type LevelState = Record<CriterionId, number>;
export const DEFAULT_LEVELS: LevelState = { style: 1, budget: 1, condition: 1 };

const MATCH_BASE = 82;
const MATCH_MIN = 55;
const MATCH_MAX = 99;

/** Deterministic weighted match% — a pure sum of the three selected deltas. */
export function computeMatch(levels: LevelState): number {
  const total = CRITERIA.reduce(
    (sum, c) => sum + c.levels[levels[c.id]].delta,
    0,
  );
  return Math.max(MATCH_MIN, Math.min(MATCH_MAX, MATCH_BASE + total));
}

/** Deterministic beam angle (degrees, right pan down) derived from match%. */
export function computeAngle(matchPercent: number): number {
  const raw = (matchPercent - 50) * 0.24;
  return Math.max(2, Math.min(12, Math.round(raw * 10) / 10));
}

// --- hero scale pans -----------------------------------------------------------
export const GENERIC_LISTING = {
  label: "Generic listing",
  title: "Wool coat, size M",
  price: 149,
  meta: "No condition report · No seller history · No fit signal",
} as const;

export const REPICK_PICK = {
  label: "repick AI match",
  title: "Wool Overcoat — Rowan & Fife",
  grade: "S",
  gradeLabel: "Museum condition",
  seller: "Verified seller · Priya",
  price: 124,
  original: 260,
  discount: 52,
} as const;

// --- product preview (3-4 parallel rich cards, always-visible core proof) ----
export type Grade = "S" | "A";

export type ProductCard = {
  id: string;
  title: string;
  brand: string;
  category: string;
  price: number;
  original: number;
  discount: number;
  match: number;
  grade: Grade;
  gradeLabel: string;
  seller: string;
  sellerMeta: string;
  image: string;
  alt: string;
};

export const PRODUCTS: ProductCard[] = [
  {
    id: "overcoat",
    title: "Wool Double-Breasted Overcoat",
    brand: "Rowan & Fife",
    category: "Outerwear",
    price: 124,
    original: 260,
    discount: 52,
    match: 96,
    grade: "S",
    gradeLabel: "Museum condition",
    seller: "Verified seller · Priya",
    sellerMeta: "241 trades · 4.9 rating",
    image:
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=900&q=80",
    alt: "Wool double-breasted overcoat hung alone against a plain backdrop",
  },
  {
    id: "boots",
    title: "Suede Ankle Boots",
    brand: "Fieldstone Co.",
    category: "Footwear",
    price: 96,
    original: 210,
    discount: 54,
    match: 91,
    grade: "A",
    gradeLabel: "Light wear only",
    seller: "Verified seller · Mika",
    sellerMeta: "76 trades · 4.7 rating",
    image:
      "https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=900&q=80",
    alt: "Pair of suede ankle boots on a plain floor",
  },
  {
    id: "dress",
    title: "Silk Slip Dress",
    brand: "Larkspur House",
    category: "Dresses",
    price: 108,
    original: 220,
    discount: 51,
    match: 94,
    grade: "S",
    gradeLabel: "Museum condition",
    seller: "Verified seller · Elin",
    sellerMeta: "163 trades · 33% repeat buyers",
    image:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=80",
    alt: "Silk slip dress on a plain hanger against a neutral wall",
  },
  {
    id: "tote",
    title: "Leather Tote Bag",
    brand: "Atelier Bran",
    category: "Bags",
    price: 118,
    original: 245,
    discount: 52,
    match: 89,
    grade: "A",
    gradeLabel: "Minor edge wear noted",
    seller: "Verified seller · Noah",
    sellerMeta: "118 trades · 4.8 rating",
    image:
      "https://images.unsplash.com/photo-1560243563-062bfc001d68?auto=format&fit=crop&w=900&q=80",
    alt: "Leather tote bag resting on a plain floor",
  },
];

// --- 3-way value split ---------------------------------------------------------
export type Value = {
  index: string;
  title: string;
  desc: string;
  icon: LucideIcon;
};

export const VALUES: Value[] = [
  {
    index: "01",
    title: "Set your scale",
    desc: "Pick how much style, budget, and condition should count — three plain toggles, nothing hidden in a black box.",
    icon: SlidersHorizontal,
  },
  {
    index: "02",
    title: "Watch it recompute",
    desc: "Every match score and the tip of the beam update live from your priorities — real arithmetic, not a decorative wiggle.",
    icon: RefreshCw,
  },
  {
    index: "03",
    title: "Trust the heavier side",
    desc: "Grade, seller verification, and the real discount hold steady no matter how you weigh it — proof, not persuasion.",
    icon: ShieldCheck,
  },
];

// --- hero + social proof stats ---------------------------------------------------
export type Stat = { value: string; label: string };

export const STATS: Stat[] = [
  { value: "2.4M+", label: "Listings weighed daily" },
  { value: "94%", label: "Avg. match confidence" },
  { value: "3", label: "Priorities you control" },
];

export const PROOF: Stat[] = [
  { value: "38%", label: "Fewer bad-fit returns" },
  { value: "2.3x", label: "Faster to a confident checkout" },
  { value: "31%", label: "Repeat buyers within 90 days" },
];

export const TESTIMONIAL = {
  quote:
    "I moved condition to top priority and watched the whole recommendation shift right in front of me — the first app that showed me why, not just what.",
  name: "Dara Whitfield",
  role: "Costume archivist",
} as const;
