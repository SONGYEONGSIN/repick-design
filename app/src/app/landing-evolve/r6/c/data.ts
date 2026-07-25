import type { LucideIcon } from "lucide-react";
import {
  Shirt,
  ShoppingBag,
  Footprints,
  Smartphone,
  Sparkles,
  ScanSearch,
  FileCheck2,
} from "lucide-react";

// --- utils -----------------------------------------------------------------
export const cx = (...parts: Array<string | false | null | undefined>) =>
  parts.filter(Boolean).join(" ");

// deterministic thousands separator (SSR-safe, no locale/toLocaleString drift)
export const comma = (n: number) =>
  Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

export const clampNum = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));

// --- motion ------------------------------------------------------------
export const EASE = [0.16, 1, 0.3, 1] as const;
export const VIEWPORT = { once: true, margin: "-80px" } as const;

// --- shared class tokens (design DNA: dark near-monochrome + single accent) --
export const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0F] focus-visible:ring-[#6E56CF]";
export const EYEBROW =
  "text-[0.7rem] font-semibold uppercase tracking-[0.28em]";
export const CAPTION =
  "text-[0.72rem] font-semibold uppercase tracking-[0.16em]";
export const NUM = "tabular-nums tracking-[0.12em]";

// --- domain: estimate generator --------------------------------------------

export type Category = {
  id: string;
  code: string;
  label: string;
  base: number;
  demand: number;
  icon: LucideIcon;
};

export const CATEGORIES: Category[] = [
  { id: "outerwear", code: "OU", label: "Outerwear", base: 96000, demand: 1.06, icon: Shirt },
  { id: "bags", code: "BA", label: "Bags", base: 74000, demand: 1.02, icon: ShoppingBag },
  { id: "shoes", code: "SH", label: "Shoes", base: 58000, demand: 0.97, icon: Footprints },
  { id: "electronics", code: "EL", label: "Electronics", base: 168000, demand: 1.12, icon: Smartphone },
];

export type Condition = {
  id: string;
  label: string;
  grade: "S" | "A" | "B" | "C";
  gradeDesc: string;
  mult: number;
};

export const CONDITIONS: Condition[] = [
  { id: "like-new", label: "Like New", grade: "S", gradeDesc: "No visible wear", mult: 1.0 },
  { id: "good", label: "Good", grade: "A", gradeDesc: "Minor wear, fully functional", mult: 0.84 },
  { id: "fair", label: "Fair", grade: "B", gradeDesc: "Visible wear, functional", mult: 0.66 },
  { id: "worn", label: "Worn", grade: "C", gradeDesc: "Heavy wear, cosmetic flaws", mult: 0.48 },
];

export const BUDGET_MIN = 20000;
export const BUDGET_MAX = 300000;
export const BUDGET_STEP = 2000;

export const defaultBudgetFor = (category: Category, condition: Condition) =>
  Math.round((category.base * condition.mult * category.demand) / 1000) * 1000;

export type Estimate = {
  base: number;
  conditionAdjustPct: number;
  conditionAdjustAmount: number;
  demandAdjustPct: number;
  demandAdjustAmount: number;
  fairPrice: number;
  payout: number;
  matchScore: number;
  matchLabel: string;
  serial: string;
};

// deterministic pure function of the three chosen inputs — no randomness, no Date
export function computeEstimate(
  category: Category,
  condition: Condition,
  budget: number,
): Estimate {
  const base = category.base;
  const afterCondition = base * condition.mult;
  const conditionAdjustAmount = afterCondition - base;
  const conditionAdjustPct = Math.round((condition.mult - 1) * 100);

  const afterDemand = afterCondition * category.demand;
  const demandAdjustAmount = afterDemand - afterCondition;
  const demandAdjustPct = Math.round((category.demand - 1) * 100);

  const fairPrice = Math.round(afterDemand / 100) * 100;
  const payout = Math.round((fairPrice * 0.88) / 100) * 100;

  const diffRatio = Math.abs(budget - fairPrice) / fairPrice;
  const rawScore = 100 - diffRatio * 120;
  const matchScore = Math.round(clampNum(rawScore, 52, 99));

  const matchLabel =
    matchScore >= 90
      ? "Excellent match"
      : matchScore >= 75
        ? "Strong match"
        : matchScore >= 60
          ? "Fair match"
          : "Wide gap";

  const budgetBand = String(Math.round(budget / 1000) % 1000).padStart(3, "0");
  const serial = `RP-${category.code}${condition.grade}-${budgetBand}`;

  return {
    base,
    conditionAdjustPct,
    conditionAdjustAmount,
    demandAdjustPct,
    demandAdjustAmount,
    fairPrice,
    payout,
    matchScore,
    matchLabel,
    serial,
  };
}

// --- verified matches (rich product preview) --------------------------------

export type Product = {
  id: string;
  title: string;
  brand: string;
  category: string;
  price: number;
  original: number;
  discount: number;
  match: number;
  grade: "S" | "A" | "B";
  gradeLabel: string;
  seller: string;
  sellerMeta: string;
  image: string;
  alt: string;
};

export const PRODUCTS: Product[] = [
  {
    id: "coat",
    title: "Wool Double-Breasted Coat",
    brand: "Maison Blanche",
    category: "Outerwear",
    price: 78000,
    original: 148000,
    discount: 47,
    match: 96,
    grade: "S",
    gradeLabel: "Like new",
    seller: "Verified · Doyun",
    sellerMeta: "214 trades · 38% repeat buyers",
    image:
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=900&h=700&q=80",
    alt: "Wool double-breasted coat hanging alone against a plain backdrop",
  },
  {
    id: "bag",
    title: "Leather Square Crossbody",
    brand: "Atelier Noir",
    category: "Bags",
    price: 62000,
    original: 120000,
    discount: 48,
    match: 91,
    grade: "A",
    gradeLabel: "Light use",
    seller: "Verified · Seoyeon",
    sellerMeta: "132 trades · 4.9 rating",
    image:
      "https://images.unsplash.com/photo-1560243563-062bfc001d68?auto=format&fit=crop&w=900&h=700&q=80",
    alt: "Leather square crossbody bag placed on a neutral floor",
  },
  {
    id: "sneakers",
    title: "Classic Low-Top Sneakers",
    brand: "Runway Archive",
    category: "Shoes",
    price: 54000,
    original: 98000,
    discount: 45,
    match: 88,
    grade: "A",
    gradeLabel: "Minor wear",
    seller: "Verified · Minjae",
    sellerMeta: "87 trades · 4.8 rating",
    image:
      "https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=900&h=700&q=80",
    alt: "Pair of classic white low-top sneakers",
  },
];

export type Value = { index: string; title: string; desc: string; icon: LucideIcon };

export const VALUES: Value[] = [
  {
    index: "01",
    title: "You choose the signals",
    desc: "Category, condition, and target price — three real inputs shape every estimate, not a hidden formula.",
    icon: Sparkles,
  },
  {
    index: "02",
    title: "AI appraises instantly",
    desc: "Live market data and condition grading combine into a fair-price model the moment you change an input.",
    icon: ScanSearch,
  },
  {
    index: "03",
    title: "You get a document, not a guess",
    desc: "A verified estimate card with itemized math and a serial ID — built to screenshot and trust.",
    icon: FileCheck2,
  },
];

export type Stat = { value: string; label: string };

export const PROOF: Stat[] = [
  { value: "128,000+", label: "Estimates generated" },
  { value: "94%", label: "Avg. appraisal accuracy" },
  { value: "-63%", label: "Time to a fair listing price" },
];
