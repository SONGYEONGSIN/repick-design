import type { LucideIcon } from "lucide-react";
import { LineChart, ShieldCheck, Target } from "lucide-react";

// --- utils -------------------------------------------------------------------
export const cx = (...parts: Array<string | false | null | undefined>) =>
  parts.filter(Boolean).join(" ");

// Deterministic thousands separator — no `toLocaleString` (ICU output can drift
// between server and client locale, which is a hydration mismatch).
export const comma = (n: number) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

export const clamp = (n: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, n));

// Round SVG coordinates to 2 decimals (determinism rule).
const r2 = (n: number) => Math.round(n * 100) / 100;

// --- motion ------------------------------------------------------------------
export const EASE = [0.16, 1, 0.3, 1] as const;
export const VIEWPORT = { once: true, margin: "-80px" } as const;

// --- display face (MONO only) ------------------------------------------------
export const MONO = { fontFamily: "var(--font-display-mono)" } as const;

// --- shared class tokens -----------------------------------------------------
// Focus ring per shared-constraints §6 — outline + shadow, emerald-700 accent.
export const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#047857] focus-visible:shadow-[0_0_0_3px_rgba(4,120,87,0.3)]";
export const EYEBROW = "text-[0.7rem] font-semibold uppercase tracking-[0.26em]";
export const CAPTION = "text-[0.68rem] font-semibold uppercase tracking-[0.14em]";
export const NUM = "tabular-nums";

// --- line-length caps --------------------------------------------------------
// chars/line = container-px / (0.44 * font-px). `ch` is banned (over-counts ~35%).
//   BODY_MAX 480px @ 16px  -> 480 / (0.44*16) = 480/7.04  ≈ 68.2 chars
//   LEDE_MAX 540px @ 18px  -> 540 / (0.44*18) = 540/7.92  ≈ 68.2 chars
export const BODY_MAX = "max-w-[480px]";
export const LEDE_MAX = "max-w-[540px]";

// --- budget slider domain ----------------------------------------------------
export const BUDGET_MIN = 40;
export const BUDGET_MAX = 320;
export const BUDGET_STEP = 2;
export const BUDGET_DEFAULT = 180;

// --- spec-sheet listing model ------------------------------------------------
export type Grade = "S" | "A";

export type SpecItem = {
  id: string;
  title: string;
  brand: string;
  category: string;
  original: number; // pre-owned market list price
  price: number; // repick-verified price
  discount: number;
  grade: Grade;
  cond: number; // condition score 0–100
  style: number; // taste-affinity score 0–100
  seller: string;
  certNo: string;
  trajectory: number[]; // descending price history: original … price
  image: string;
  alt: string;
};

// Fixed, human-picked Unsplash photo ids (never a random image host); one per
// listing. The photo is reinforcement — every proof value lives as text below.
export const ITEMS: SpecItem[] = [
  {
    id: "overcoat",
    title: "Wool Double-Breasted Overcoat",
    brand: "Aldern & Foss",
    category: "Outerwear",
    original: 410,
    price: 214,
    discount: 48,
    grade: "S",
    cond: 96,
    style: 94,
    seller: "Priya N.",
    certNo: "RP-70142",
    trajectory: [410, 402, 380, 338, 276, 214],
    image:
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=900&q=80",
    alt: "Wool double-breasted overcoat hung against a plain backdrop",
  },
  {
    id: "crossbody",
    title: "Leather Crossbody Bag",
    brand: "Atelier Bran",
    category: "Bags",
    original: 185,
    price: 92,
    discount: 50,
    grade: "A",
    cond: 91,
    style: 88,
    seller: "Noah K.",
    certNo: "RP-70143",
    trajectory: [185, 181, 168, 142, 116, 92],
    image:
      "https://images.unsplash.com/photo-1560243563-062bfc001d68?auto=format&fit=crop&w=900&q=80",
    alt: "Leather crossbody bag resting on a plain floor",
  },
  {
    id: "boots",
    title: "Suede Chelsea Boots",
    brand: "Fieldstone Co.",
    category: "Footwear",
    original: 150,
    price: 74,
    discount: 51,
    grade: "A",
    cond: 89,
    style: 82,
    seller: "Mika S.",
    certNo: "RP-70144",
    trajectory: [150, 147, 136, 116, 94, 74],
    image:
      "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=900&q=80",
    alt: "Pair of suede Chelsea boots side by side",
  },
  {
    id: "backpack",
    title: "Canvas Commuter Backpack",
    brand: "Fieldstone Co.",
    category: "Bags",
    original: 130,
    price: 64,
    discount: 51,
    grade: "S",
    cond: 93,
    style: 79,
    seller: "Jordan L.",
    certNo: "RP-70145",
    trajectory: [130, 127, 118, 101, 82, 64],
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80",
    alt: "Dark navy canvas commuter backpack standing on the floor",
  },
  {
    id: "jacket",
    title: "Denim Trucker Jacket",
    brand: "Larkspur House",
    category: "Outerwear",
    original: 120,
    price: 58,
    discount: 52,
    grade: "A",
    cond: 86,
    style: 90,
    seller: "Elin M.",
    certNo: "RP-70146",
    trajectory: [120, 117, 108, 92, 74, 58],
    image:
      "https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=900&q=80",
    alt: "Denim trucker jacket laid flat against a plain backdrop",
  },
  {
    id: "sneakers",
    title: "Classic Low-Top Sneakers",
    brand: "Fieldstone Co.",
    category: "Footwear",
    original: 140,
    price: 71,
    discount: 49,
    grade: "A",
    cond: 88,
    style: 84,
    seller: "Casey R.",
    certNo: "RP-70147",
    trajectory: [140, 137, 127, 108, 88, 71],
    image:
      "https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=900&q=80",
    alt: "Pair of classic white low-top sneakers",
  },
];

// --- pure match + ranking model ----------------------------------------------
export type Priority = "value" | "condition" | "match";

export const PRIORITIES: { key: Priority; label: string }[] = [
  { key: "match", label: "Closest match" },
  { key: "condition", label: "Best condition" },
  { key: "value", label: "Best value" },
];

const WEIGHTS: Record<Priority, { price: number; cond: number; style: number }> = {
  value: { price: 0.6, cond: 0.2, style: 0.2 },
  condition: { price: 0.2, cond: 0.6, style: 0.2 },
  match: { price: 0.2, cond: 0.2, style: 0.6 },
};

export const fitsBudget = (item: SpecItem, budget: number) => item.price <= budget;

// Price-fit score: rewards discount + budget headroom; penalised when over budget.
export function priceScore(item: SpecItem, budget: number): number {
  const headroom = (budget - item.price) / budget; // < 0 when over budget
  if (headroom < 0) return clamp(Math.round(32 + headroom * 32), 0, 100);
  return clamp(Math.round(55 + item.discount * 0.5 + headroom * 30), 0, 100);
}

// Match% — pure function of (item, budget, priority). Budget moves it via
// priceScore; priority moves it via the weight vector.
export function matchScore(item: SpecItem, budget: number, priority: Priority): number {
  const w = WEIGHTS[priority];
  const ps = priceScore(item, budget);
  return clamp(Math.round(w.price * ps + w.cond * item.cond + w.style * item.style), 0, 100);
}

export type SortKey = "match" | "discount" | "price";

export const SORTS: { key: SortKey; label: string }[] = [
  { key: "match", label: "Match %" },
  { key: "discount", label: "Biggest drop" },
  { key: "price", label: "Lowest price" },
];

export type RankedItem = { item: SpecItem; match: number; fits: boolean };

// In-budget listings always surface first; the sort key orders within each band.
export function rankItems(
  items: SpecItem[],
  budget: number,
  priority: Priority,
  sort: SortKey,
): RankedItem[] {
  return items
    .map((item) => ({ item, match: matchScore(item, budget, priority), fits: fitsBudget(item, budget) }))
    .sort((a, b) => {
      if (a.fits !== b.fits) return a.fits ? -1 : 1;
      if (sort === "discount") return b.item.discount - a.item.discount || b.match - a.match;
      if (sort === "price") return a.item.price - b.item.price || b.match - a.match;
      return b.match - a.match || a.item.price - b.item.price;
    });
}

// --- sparkline geometry (pure, 2-decimal coords) -----------------------------
export const SPARK_W = 148;
export const SPARK_H = 46;
const SPARK_PAD = 5;

export type SparkGeometry = {
  points: string;
  budgetY: number;
  markerX: number;
  markerY: number;
  inRange: boolean;
};

export function sparkGeometry(item: SpecItem, budget: number): SparkGeometry {
  const series = item.trajectory;
  const n = series.length;
  const max = series[0];
  const min = series[n - 1];
  const range = max - min || 1;
  const innerH = SPARK_H - SPARK_PAD * 2;
  const x = (i: number) => r2((i / (n - 1)) * SPARK_W);
  const y = (v: number) => r2(SPARK_PAD + (1 - (v - min) / range) * innerH);
  const points = series.map((v, i) => `${x(i)},${y(v)}`).join(" ");

  const bClamped = clamp(budget, min, max);
  const budgetY = y(bClamped);
  const inRange = budget >= min && budget <= max;

  let markerX = x(n - 1);
  let markerY = y(min);
  if (budget >= max) {
    markerX = x(0);
    markerY = y(max);
  } else if (budget <= min) {
    markerX = x(n - 1);
    markerY = y(min);
  } else {
    for (let i = 1; i < n; i++) {
      if (series[i] <= budget) {
        const t = (series[i - 1] - budget) / (series[i - 1] - series[i]);
        markerX = r2(x(i - 1) + t * (x(i) - x(i - 1)));
        markerY = y(budget);
        break;
      }
    }
  }
  return { points, budgetY, markerX, markerY, inRange };
}

// --- match ring geometry -----------------------------------------------------
export const RING_R = 16;
export const RING_C = r2(2 * Math.PI * RING_R);
export const ringOffset = (match: number) => r2(RING_C * (1 - match / 100));

// --- value-in-3 (tied to the trajectory / verification mechanic) -------------
export type ValueBlock = { index: string; title: string; desc: string; icon: LucideIcon };

export const VALUE_BLOCKS: ValueBlock[] = [
  {
    index: "01",
    title: "The drop is drawn, not claimed",
    desc: "Each sparkline plots the real pre-owned price history down to the repick-verified figure — the discount as a line you can read.",
    icon: LineChart,
  },
  {
    index: "02",
    title: "Condition graded on the same card",
    desc: "Every listing carries a letter grade and a 0–100 condition score, cross-checked against our reference archive before it lists.",
    icon: ShieldCheck,
  },
  {
    index: "03",
    title: "Match recomputes as you steer",
    desc: "Move the budget or change what matters most and each card's match score, rank, and budget marker refresh together — live.",
    icon: Target,
  },
];

// --- social proof ------------------------------------------------------------
export type Stat = { value: string; label: string };

export const PROOF_STATS: Stat[] = [
  { value: "3.1M+", label: "Listings price-verified" },
  { value: "98.6%", label: "Grading precision" },
  { value: "44%", label: "Fewer return requests" },
];

export const TESTIMONIAL = {
  quote:
    "The little price line is the whole thing. I can see exactly where a listing sat and where repick landed it — before I ever message a seller.",
  name: "Dana Whitfield",
  role: "Frequent buyer",
} as const;
