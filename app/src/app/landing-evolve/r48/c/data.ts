// Deterministic market-trend model for "Sell-Through Window" -- no Math.random / Date.now /
// argument-less new Date() anywhere. Every number on the page derives from one shared pair of
// state values: the start/end day-index of the selected window (0-89). Drag either handle (or
// press a preset) and this page re-slices the same fixed 90-day dataset -- the headline stat,
// the chart's accent segment, the product tags and the closing line all re-derive from the
// result.

export const DAY_COUNT = 90;
export const WINDOW_MIN_DAYS = 7; // smallest window a handle pair may enclose, inclusive
export const STEP_DAYS = 1; // arrow-key step
export const STEP_DAYS_LARGE = 7; // Shift+Arrow / Page Up / Page Down step

// Fixed anchor date -- explicitly NOT "today": every date label on this page is computed by
// walking backward from this one constant (never Date.now() / an argument-less new Date()), so
// the page renders identically on the server and the client no matter when either runs.
const REFERENCE_DATE = new Date(2026, 10, 1); // Nov 1, 2026 -- the dataset's fixed "most recent day"
const MS_PER_DAY = 86_400_000;

/** Calendar date for a fixed day-index (0 = 89 days before the anchor, 89 = the anchor itself). */
export function dateForDayIndex(i: number): Date {
  return new Date(REFERENCE_DATE.getTime() - (DAY_COUNT - 1 - i) * MS_PER_DAY);
}

export function formatDayLabel(i: number): string {
  return dateForDayIndex(i).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function clampIndex(i: number): number {
  return Math.min(DAY_COUNT - 1, Math.max(0, Math.round(i)));
}

export type DailyPoint = { index: number; demandIndex: number; daysToSell: number };

// Deterministic generator: a slow seasonal wave + a gentle 90-day upward drift + a small
// weekly micro-pattern. All pure functions of the fixed index `i` -- no randomness.
function demandForIndex(i: number): number {
  const t = i / (DAY_COUNT - 1);
  const seasonal = Math.sin(t * Math.PI * 2.4) * 9;
  const weekly = Math.cos(((i % 7) / 7) * Math.PI * 2) * 3;
  const drift = t * 13;
  return Math.round(56 + seasonal + weekly + drift);
}

// Sell-through speed falls as demand rises -- an inverse, bounded, deterministic function of
// the same index (never a second independent random source).
function daysToSellForIndex(i: number): number {
  const demand = demandForIndex(i);
  const raw = 23 - (demand - 56) * 0.24;
  const bounded = Math.max(6, Math.min(27, raw));
  return Math.round(bounded * 10) / 10;
}

export const DAILY: DailyPoint[] = Array.from({ length: DAY_COUNT }, (_, i) => ({
  index: i,
  demandIndex: demandForIndex(i),
  daysToSell: daysToSellForIndex(i),
}));

export const DEMAND_MIN = Math.min(...DAILY.map((d) => d.demandIndex));
export const DEMAND_MAX = Math.max(...DAILY.map((d) => d.demandIndex));
export const DAYS_TO_SELL_MIN = Math.min(...DAILY.map((d) => d.daysToSell));
export const DAYS_TO_SELL_MAX = Math.max(...DAILY.map((d) => d.daysToSell));

function average(points: DailyPoint[], key: "demandIndex" | "daysToSell"): number {
  if (points.length === 0) return 0;
  const sum = points.reduce((acc, p) => acc + p[key], 0);
  return sum / points.length;
}

export type WindowStats = {
  start: number;
  end: number;
  lengthDays: number;
  avgDays: number; // rounded to 1 decimal
  avgDemand: number; // rounded whole index
  deltaPct: number | null; // vs. the immediately-prior window of equal length, null if no history
};

/** Every derived number for a given [start, end] window -- the single source every component below reads from. */
export function windowStats(start: number, end: number): WindowStats {
  const lo = Math.min(start, end);
  const hi = Math.max(start, end);
  const slice = DAILY.slice(lo, hi + 1);
  const lengthDays = hi - lo + 1;
  const avgDays = Math.round(average(slice, "daysToSell") * 10) / 10;
  const avgDemand = Math.round(average(slice, "demandIndex"));

  const priorEnd = lo - 1;
  const priorStart = Math.max(0, lo - lengthDays);
  let deltaPct: number | null = null;
  if (priorEnd >= priorStart) {
    const priorSlice = DAILY.slice(priorStart, priorEnd + 1);
    const priorDemand = average(priorSlice, "demandIndex");
    if (priorDemand > 0) {
      deltaPct = Math.round(((avgDemand - priorDemand) / priorDemand) * 100);
    }
  }

  return { start: lo, end: hi, lengthDays, avgDays, avgDemand, deltaPct };
}

export function windowLabel(start: number, end: number): string {
  const lo = Math.min(start, end);
  const hi = Math.max(start, end);
  const lengthDays = hi - lo + 1;
  if (hi === DAY_COUNT - 1) {
    const preset = PRESETS.find((p) => p.days === lengthDays);
    if (preset) return `Last ${preset.days} days`;
  }
  return `${formatDayLabel(lo)} – ${formatDayLabel(hi)}`;
}

export const PRESETS = [
  { label: "7D", days: 7 },
  { label: "14D", days: 14 },
  { label: "30D", days: 30 },
  { label: "90D", days: 90 },
];

export const DEFAULT_WINDOW_DAYS = 30;
export const DEFAULT_START = DAY_COUNT - DEFAULT_WINDOW_DAYS; // 60
export const DEFAULT_END = DAY_COUNT - 1; // 89

// ---- Chart geometry (fixed viewBox, coordinates rounded to 2dp -- hydration-safe) ----

export const CHART_WIDTH = 600;
export const CHART_HEIGHT = 180;
const CHART_PAD_Y = 14;

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function xForIndex(i: number): number {
  return round2((i / (DAY_COUNT - 1)) * CHART_WIDTH);
}

export function yForDemand(demand: number): number {
  const t = (demand - DEMAND_MIN) / (DEMAND_MAX - DEMAND_MIN);
  return round2(CHART_HEIGHT - CHART_PAD_Y - t * (CHART_HEIGHT - CHART_PAD_Y * 2));
}

export const CHART_POINTS = DAILY.map((d) => ({ x: xForIndex(d.index), y: yForDemand(d.demandIndex) }));

export const LINE_PATH_D = CHART_POINTS.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");

export const BASELINE_Y = CHART_HEIGHT - CHART_PAD_Y / 2;

export const AREA_PATH_D =
  LINE_PATH_D +
  ` L${CHART_POINTS[CHART_POINTS.length - 1].x},${BASELINE_Y} L${CHART_POINTS[0].x},${BASELINE_Y} Z`;

// ---- Category + catalog content ----

export const CATEGORY_LABEL = "Running sneakers";

export type ProductItem = {
  id: string;
  title: string;
  brand: string;
  image: string;
  alt: string;
  matchPercent: number;
  matchReason: string;
  conditionGrade: string;
  verified: boolean;
  priceBefore: number;
  priceAfter: number;
};

export const PRODUCT_ITEMS: ProductItem[] = [
  {
    id: "atlas-trail",
    title: "Atlas Trail Runner",
    brand: "Fenwick",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop",
    alt: "A single white and grey running sneaker on a plain background",
    matchPercent: 93,
    matchReason: "Matches your saved size + neutral gait profile",
    conditionGrade: "A-",
    verified: true,
    priceBefore: 150,
    priceAfter: 96,
  },
  {
    id: "court-pulse",
    title: "Court Pulse Low",
    brand: "Harlan",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&auto=format&fit=crop",
    alt: "A pair of low-top running sneakers viewed from the side",
    matchPercent: 88,
    matchReason: "Same silhouette as your last 3 saved searches",
    conditionGrade: "B+",
    verified: true,
    priceBefore: 130,
    priceAfter: 79,
  },
  {
    id: "aero-gtx",
    title: "Aero Trail GTX",
    brand: "Fenwick",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800&auto=format&fit=crop",
    alt: "A running sneaker with a textured midsole resting on a light surface",
    matchPercent: 90,
    matchReason: "Priced under this window's average sell-through",
    conditionGrade: "A",
    verified: true,
    priceBefore: 175,
    priceAfter: 112,
  },
];

export function formatUsd(n: number): string {
  return `$${n.toLocaleString("en-US")}`;
}

export function discountPercent(before: number, after: number): number {
  return Math.round((1 - after / before) * 100);
}

// A single already-closed sale for social proof -- its own fixed numbers, explicitly NOT driven
// by the window above. Copy must never imply this card moves with it.
export const CLOSED_SALE = {
  id: "ridgeline",
  title: "Ridgeline Trail Runner",
  brand: "Maren & Co.",
  image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800&auto=format&fit=crop",
  alt: "A trail running shoe with an orange midsole on a neutral surface",
  priceBefore: 160,
  soldPrice: 86,
  daysToSell: 11,
  conditionGrade: "A-",
  verified: true,
};

export type Testimonial = { id: string; name: string; role: string; quote: string };

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    name: "Marcus O.",
    role: "Buyer, running sneakers",
    quote:
      "I widened the window until I could see past one lucky week. Thirty days told me the real sell-through speed, not the fastest sale that month.",
  },
  {
    id: "t2",
    name: "Alina R.",
    role: "Seller, four closed listings",
    quote:
      "Narrowing to the last 7 days showed demand climbing before I even listed mine. I priced at the top of the window instead of guessing.",
  },
];

export const STATS = [
  { value: "12,900", label: "verified resales completed" },
  { value: "90d", label: "of trend history on file" },
  { value: `${DAYS_TO_SELL_MIN}–${DAYS_TO_SELL_MAX}d`, label: "observed range, days to sell" },
];
