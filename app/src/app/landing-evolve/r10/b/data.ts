import type { LucideIcon } from "lucide-react";
import {
  SlidersHorizontal,
  Sparkles,
  ListChecks,
  ShoppingBag,
} from "lucide-react";

// --- utils -------------------------------------------------------------------
export const cx = (...parts: Array<string | false | null | undefined>) =>
  parts.filter(Boolean).join(" ");

/**
 * Manual thousands separator, no `toLocaleString`. A prior round's candidate
 * (auto-landing-r9/b) flagged `toLocaleString` as a hydration risk — its output
 * depends on the server's ICU data, which can disagree with the browser's and
 * flip a digit grouping between SSR and hydration. This is pure string math,
 * so server and client always agree.
 */
export function formatUSD(n: number): string {
  const rounded = Math.round(n);
  const sign = rounded < 0 ? "-" : "";
  const digits = String(Math.abs(rounded));
  let grouped = "";
  for (let i = 0; i < digits.length; i++) {
    if (i > 0 && (digits.length - i) % 3 === 0) grouped += ",";
    grouped += digits[i];
  }
  return `${sign}$${grouped}`;
}

// --- motion ------------------------------------------------------------------
export const EASE = [0.16, 1, 0.3, 1] as const;
export const VIEWPORT = { once: true, margin: "-80px" } as const;

// --- shared class tokens -------------------------------------------------------
// Palette (light theme, derived from the DNA's dark-canonical accent table —
// see the candidate writeup for the contrast math behind each derived value):
//   bg        #FFFFFF   canvas
//   panel     #F5F4FA   muted lavender-gray surface (stepper track, case study)
//   chip-tint #F1EDFC   pale accent tint (unused chip rest state avoided — see writeup)
//   ink       #0B0B0F   fg / dark ink (matches the catalog's existing convention)
//   muted     zinc-600  secondary text — safe on both white and the panel tone
//   accent      #6E56CF  large text / fills / borders (5.39:1 on white)
//   accent-ink  #5A3FC0  small text / icons / links (7.22:1 on white, darker
//               tint than the dark-theme table because light backgrounds need
//               the opposite derivation direction — see writeup)
export const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:ring-[#5A3FC0]";
export const FOCUS_ON_DARK =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0F] focus-visible:ring-white";
// tracking 3-scale: eyebrow 0.28em / caption 0.16em / stat 0.12em
export const EYEBROW =
  "text-[0.7rem] font-semibold uppercase tracking-[0.28em]";
export const CAPTION =
  "text-[0.72rem] font-semibold uppercase tracking-[0.16em]";
export const NUM = "tabular-nums";
export const DISPLAY_FACE = { fontFamily: "var(--font-display-wide)" };

// ============================================================================
// Filters
// ============================================================================
export type BudgetId = "all" | "under-100" | "100-200" | "200-plus";
export type CategoryId = "all" | "outerwear" | "bags" | "footwear" | "home";
export type ConditionId = "all" | "like-new" | "gently-used";

export const BUDGET_OPTIONS: { id: BudgetId; label: string }[] = [
  { id: "all", label: "Any" },
  { id: "under-100", label: "<$100" },
  { id: "100-200", label: "$100–200" },
  { id: "200-plus", label: "$200+" },
];

export const CATEGORY_OPTIONS: { id: CategoryId; label: string }[] = [
  { id: "all", label: "All" },
  { id: "outerwear", label: "Coats" },
  { id: "bags", label: "Bags" },
  { id: "footwear", label: "Shoes" },
  { id: "home", label: "Home" },
];

export const CONDITION_OPTIONS: { id: ConditionId; label: string }[] = [
  { id: "all", label: "Any" },
  { id: "like-new", label: "Like new" },
  { id: "gently-used", label: "Gently used" },
];

export function budgetBand(price: number): Exclude<BudgetId, "all"> {
  if (price < 100) return "under-100";
  if (price <= 200) return "100-200";
  return "200-plus";
}

// ============================================================================
// Products — the filter-rail catalog
// ============================================================================
export type Grade = "S" | "A" | "B+";
export type Category = Exclude<CategoryId, "all">;
export type Condition = Exclude<ConditionId, "all">;

export type Product = {
  id: string;
  title: string;
  brand: string;
  category: Category;
  categoryLabel: string;
  price: number;
  original: number;
  discount: number;
  condition: Condition;
  conditionLabel: string;
  grade: Grade;
  match: number;
  reasonTag: string;
  seller: string;
  sellerMeta: string;
  /** Accessible description of the generated product art — plays the same
   *  role a photo's `alt` would, for the same reason (see writeup: SVG art
   *  chosen over remote photos to remove broken-image risk entirely). */
  visualLabel: string;
  /** 0-2, picks a fixed near-monochrome bg tint + minor shape variant within
   *  the category art so three cards of the same category don't look
   *  identical. Not randomness — fixed per product at build time. */
  variant: 0 | 1 | 2;
};

export const PRODUCTS: Product[] = [
  {
    id: "overcoat",
    title: "Wool Overcoat",
    brand: "Rowan & Fife",
    category: "outerwear",
    categoryLabel: "Outerwear",
    price: 198,
    original: 390,
    discount: 49,
    condition: "like-new",
    conditionLabel: "Like new",
    grade: "S",
    match: 95,
    reasonTag: "Cold-weather saves, size-true",
    seller: "Priya",
    sellerMeta: "241 trades · 4.9 rating",
    visualLabel: "Charcoal wool overcoat silhouette",
    variant: 0,
  },
  {
    id: "trucker",
    title: "Denim Trucker Jacket",
    brand: "Fieldstone Co.",
    category: "outerwear",
    categoryLabel: "Outerwear",
    price: 74,
    original: 140,
    discount: 47,
    condition: "gently-used",
    conditionLabel: "Gently used",
    grade: "A",
    match: 88,
    reasonTag: "Trending in your recent saves",
    seller: "Mika",
    sellerMeta: "76 trades · 4.7 rating",
    visualLabel: "Denim trucker jacket silhouette",
    variant: 1,
  },
  {
    id: "aviator",
    title: "Shearling Aviator Jacket",
    brand: "Northfell Supply",
    category: "outerwear",
    categoryLabel: "Outerwear",
    price: 245,
    original: 460,
    discount: 47,
    condition: "like-new",
    conditionLabel: "Like new",
    grade: "S",
    match: 92,
    reasonTag: "Splurge-tier, museum condition",
    seller: "Tobias",
    sellerMeta: "58 trades · 4.9 rating",
    visualLabel: "Shearling aviator jacket silhouette",
    variant: 2,
  },
  {
    id: "tote",
    title: "Leather Tote",
    brand: "Atelier Bran",
    category: "bags",
    categoryLabel: "Bags",
    price: 112,
    original: 230,
    discount: 51,
    condition: "gently-used",
    conditionLabel: "Gently used",
    grade: "A",
    match: 91,
    reasonTag: "Everyday-carry, light wear only",
    seller: "Noah",
    sellerMeta: "118 trades · 4.8 rating",
    visualLabel: "Leather tote bag silhouette",
    variant: 0,
  },
  {
    id: "weekender",
    title: "Canvas Weekender",
    brand: "Cove & Anchor",
    category: "bags",
    categoryLabel: "Bags",
    price: 86,
    original: 165,
    discount: 48,
    condition: "like-new",
    conditionLabel: "Like new",
    grade: "S",
    match: 87,
    reasonTag: "Packs for your travel dates",
    seller: "Sana",
    sellerMeta: "64 trades · 4.8 rating",
    visualLabel: "Canvas weekender bag silhouette",
    variant: 1,
  },
  {
    id: "satchel",
    title: "Structured Satchel",
    brand: "Maren Atelier",
    category: "bags",
    categoryLabel: "Bags",
    price: 220,
    original: 410,
    discount: 46,
    condition: "gently-used",
    conditionLabel: "Gently used",
    grade: "A",
    match: 84,
    reasonTag: "Structured bags you’ve saved 6x",
    seller: "Delphine",
    sellerMeta: "39 trades · 4.6 rating",
    visualLabel: "Structured satchel bag silhouette",
    variant: 2,
  },
  {
    id: "boots",
    title: "Suede Chelsea Boots",
    brand: "Larkspur House",
    category: "footwear",
    categoryLabel: "Footwear",
    price: 96,
    original: 175,
    discount: 45,
    condition: "gently-used",
    conditionLabel: "Gently used",
    grade: "B+",
    match: 84,
    reasonTag: "Fits your true EU 41",
    seller: "Elin",
    sellerMeta: "163 trades · 4.7 rating",
    visualLabel: "Suede Chelsea boots silhouette",
    variant: 0,
  },
  {
    id: "derby",
    title: "Leather Derby Shoes",
    brand: "Holt & Vane",
    category: "footwear",
    categoryLabel: "Footwear",
    price: 134,
    original: 240,
    discount: 44,
    condition: "like-new",
    conditionLabel: "Like new",
    grade: "S",
    match: 90,
    reasonTag: "Formal rotation gap, filled",
    seller: "Callum",
    sellerMeta: "47 trades · 4.9 rating",
    visualLabel: "Leather derby shoes silhouette",
    variant: 1,
  },
  {
    id: "shearling-boots",
    title: "Shearling-Lined Boots",
    brand: "Fenwick Trail",
    category: "footwear",
    categoryLabel: "Footwear",
    price: 210,
    original: 375,
    discount: 44,
    condition: "like-new",
    conditionLabel: "Like new",
    grade: "A",
    match: 86,
    reasonTag: "Matches your winter saves",
    seller: "Renata",
    sellerMeta: "29 trades · 4.8 rating",
    visualLabel: "Shearling-lined boots silhouette",
    variant: 2,
  },
  {
    id: "lamp",
    title: "Ceramic Table Lamp",
    brand: "Ambra Home",
    category: "home",
    categoryLabel: "Home",
    price: 58,
    original: 120,
    discount: 52,
    condition: "like-new",
    conditionLabel: "Like new",
    grade: "S",
    match: 89,
    reasonTag: "Warm-light picks you’ve favorited",
    seller: "Owen",
    sellerMeta: "92 trades · 4.9 rating",
    visualLabel: "Ceramic table lamp silhouette",
    variant: 0,
  },
  {
    id: "table",
    title: "Oak Side Table",
    brand: "Birchwood Co.",
    category: "home",
    categoryLabel: "Home",
    price: 145,
    original: 300,
    discount: 52,
    condition: "gently-used",
    conditionLabel: "Gently used",
    grade: "A",
    match: 85,
    reasonTag: "Fits your studio’s footprint",
    seller: "Ingrid",
    sellerMeta: "71 trades · 4.7 rating",
    visualLabel: "Oak side table silhouette",
    variant: 1,
  },
  {
    id: "bookshelf",
    title: "Walnut Bookshelf",
    brand: "Birchwood Co.",
    category: "home",
    categoryLabel: "Home",
    price: 265,
    original: 480,
    discount: 45,
    condition: "like-new",
    conditionLabel: "Like new",
    grade: "S",
    match: 93,
    reasonTag: "Matches your oak furniture saves",
    seller: "Marcus",
    sellerMeta: "22 trades · 5.0 rating",
    visualLabel: "Walnut bookshelf silhouette",
    variant: 2,
  },
];

export function filterProducts(
  budget: BudgetId,
  category: CategoryId,
  condition: ConditionId,
): Product[] {
  return PRODUCTS.filter(
    (p) =>
      (budget === "all" || budgetBand(p.price) === budget) &&
      (category === "all" || p.category === category) &&
      (condition === "all" || p.condition === condition),
  );
}

export function computeAggregate(products: Product[]) {
  const count = products.length;
  const totalSaved = products.reduce((s, p) => s + (p.original - p.price), 0);
  const avgMatch =
    count === 0
      ? 0
      : Math.round(products.reduce((s, p) => s + p.match, 0) / count);
  return { count, totalSaved, avgMatch };
}

// ============================================================================
// How it works — horizontal stepper
// ============================================================================
export type Step = {
  id: string;
  index: string;
  label: string;
  title: string;
  detail: string;
  icon: LucideIcon;
};

export const STEPS: Step[] = [
  {
    id: "filter",
    index: "01",
    label: "Filter",
    title: "Set what matters",
    detail:
      "Pick a budget band, a category, and a condition floor in the hero above. No account and no quiz — three filters, set in seconds.",
    icon: SlidersHorizontal,
  },
  {
    id: "rescan",
    index: "02",
    label: "Rescan",
    title: "AI rescans live listings",
    detail:
      "Every live listing is re-scored against your three settings in place. The match percentage on each card is recomputed on the spot, not read from a cached tag.",
    icon: Sparkles,
  },
  {
    id: "compare",
    index: "03",
    label: "Compare",
    title: "Compare tagged picks",
    detail:
      "Match reasoning, condition grade, seller verification, and the discount against retail sit on every card at rest. Scroll the rail — nothing is hidden behind a hover.",
    icon: ListChecks,
  },
  {
    id: "buy",
    label: "Buy",
    index: "04",
    title: "Buy with the proof attached",
    detail:
      "The grade and verification you compared travels into checkout, so the listing you buy is the listing you were shown — no re-inspection surprise.",
    icon: ShoppingBag,
  },
];

// ============================================================================
// Case study — before / after minutes-to-browse bar
// ============================================================================
export const CASE_STUDY = {
  beforeMinutes: 42,
  afterMinutes: 4,
  purchases: 3,
  totalSaved: 567,
  avgDiscount: 46,
  avgMatch: 91,
  returns: 0,
};
