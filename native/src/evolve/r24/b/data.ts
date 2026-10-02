// native/src/evolve/r24/b/data.ts — auto-native-r24 candidate b, deterministic dummy data.
//
// Three fixed datasets (7d / 30d / 90d), each a literal array of daily/weekly/bucketed revenue
// points, a fixed category-share breakdown and a fixed best-sellers list. Aggregates (total
// revenue, average order value, percent change vs. the previous period) are derived from those
// fixed arrays by pure functions at module load — never Math.random, never Date.now()/new Date().
import type { PricePoint } from "../../../charts/LineChart";
import type { BarDatum } from "../../../charts/BarBreakdown";

export type Period = "7d" | "30d" | "90d";

export type BestSeller = {
  id: string;
  name: string;
  category: string;
  unitsSold: number;
  revenueWon: number;
  // Short recent-activity trend fed straight into <Sparkline data={...} />.
  trend: number[];
};

export type PeriodDataset = {
  key: Period;
  label: string; // e.g. "Last 7 days" — used in headings and announcements
  revenuePoints: PricePoint[];
  totalRevenueWon: number; // = sum(revenuePoints.price), computed below
  previousTotalRevenueWon: number; // fixed reference figure for the equivalent prior period
  changePct: number; // = pctChange(totalRevenueWon, previousTotalRevenueWon), computed below
  totalOrders: number;
  avgOrderValueWon: number; // = round(totalRevenueWon / totalOrders), computed below
  categoryBreakdown: BarDatum[]; // revenue share by category, out of 100
  bestSellers: BestSeller[];
};

export const PERIODS: { key: Period; shortLabel: string; fullLabel: string }[] = [
  { key: "7d", shortLabel: "7D", fullLabel: "Last 7 days" },
  { key: "30d", shortLabel: "30D", fullLabel: "Last 30 days" },
  { key: "90d", shortLabel: "90D", fullLabel: "Last 90 days" },
];

// ---- pure, deterministic helpers -----------------------------------------------------------

function sum(nums: number[]): number {
  return nums.reduce((a, b) => a + b, 0);
}

// Rounded to one decimal place.
export function pctChange(current: number, previous: number): number {
  return Math.round(((current - previous) / previous) * 1000) / 10;
}

function avgOrderValue(totalRevenueWon: number, totalOrders: number): number {
  return Math.round(totalRevenueWon / totalOrders);
}

// Thousands-separated digits, no toLocaleString (deterministic across environments/locales).
function formatDigits(n: number): string {
  return Math.abs(Math.round(n)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Won display: a literal space between the ₩ glyph and the digits (native/GENERATION.md §1,
// option 1) so the sign's stroke never runs into the first digit at body-text size.
export function formatWon(n: number): string {
  return `₩ ${formatDigits(n)}`;
}

// Compact axis labels for the revenue chart's Y ticks (180000 -> "180K", 2500000 -> "2.5M").
export function formatCompact(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
  return String(Math.round(n));
}

// ---- raw fixed data (literals only) --------------------------------------------------------

type RawDataset = Omit<
  PeriodDataset,
  "totalRevenueWon" | "changePct" | "avgOrderValueWon"
>;

const RAW: Record<Period, RawDataset> = {
  "7d": {
    key: "7d",
    label: "Last 7 days",
    revenuePoints: [
      { day: "Mon", price: 182000 },
      { day: "Tue", price: 145000 },
      { day: "Wed", price: 210000 },
      { day: "Thu", price: 168000 },
      { day: "Fri", price: 233000 },
      { day: "Sat", price: 298000 },
      { day: "Sun", price: 254000 },
    ],
    previousTotalRevenueWon: 1_290_000,
    totalOrders: 27,
    categoryBreakdown: [
      { label: "Outer", value: 34 },
      { label: "Denim", value: 26 },
      { label: "Shoes", value: 18 },
      { label: "Knit", value: 14 },
      { label: "Acc.", value: 8 },
    ],
    bestSellers: [
      { id: "bs-7-1", name: "Wool Overcoat", category: "Outerwear", unitsSold: 6, revenueWon: 420000, trend: [1, 0, 1, 2, 1, 3, 2] },
      { id: "bs-7-2", name: "Raw Denim Jeans", category: "Denim", unitsSold: 5, revenueWon: 275000, trend: [0, 1, 1, 1, 2, 2, 1] },
      { id: "bs-7-3", name: "Leather Chelsea Boots", category: "Footwear", unitsSold: 3, revenueWon: 261000, trend: [0, 0, 1, 1, 0, 1, 1] },
      { id: "bs-7-4", name: "Cable Knit Sweater", category: "Knitwear", unitsSold: 4, revenueWon: 156000, trend: [1, 1, 0, 1, 1, 0, 1] },
    ],
  },
  "30d": {
    key: "30d",
    label: "Last 30 days",
    revenuePoints: [
      { day: "Wk1", price: 980000 },
      { day: "Wk2", price: 1120000 },
      { day: "Wk3", price: 875000 },
      { day: "Wk4", price: 1340000 },
      { day: "Wk5", price: 1205000 },
    ],
    previousTotalRevenueWon: 4_980_000,
    totalOrders: 96,
    categoryBreakdown: [
      { label: "Outer", value: 30 },
      { label: "Denim", value: 24 },
      { label: "Shoes", value: 20 },
      { label: "Knit", value: 16 },
      { label: "Acc.", value: 10 },
    ],
    bestSellers: [
      { id: "bs-30-1", name: "Wool Overcoat", category: "Outerwear", unitsSold: 22, revenueWon: 1540000, trend: [2, 1, 3, 2, 4, 3, 5] },
      { id: "bs-30-2", name: "Selvedge Denim Jacket", category: "Denim", unitsSold: 18, revenueWon: 1080000, trend: [1, 2, 1, 3, 2, 2, 3] },
      { id: "bs-30-3", name: "Suede Chelsea Boots", category: "Footwear", unitsSold: 14, revenueWon: 966000, trend: [1, 1, 2, 1, 2, 3, 2] },
      { id: "bs-30-4", name: "Merino Turtleneck", category: "Knitwear", unitsSold: 16, revenueWon: 624000, trend: [2, 1, 1, 2, 1, 2, 3] },
    ],
  },
  "90d": {
    key: "90d",
    label: "Last 90 days",
    revenuePoints: [
      { day: "P1", price: 2450000 },
      { day: "P2", price: 2180000 },
      { day: "P3", price: 2760000 },
      { day: "P4", price: 3015000 },
      { day: "P5", price: 2890000 },
      { day: "P6", price: 3320000 },
    ],
    previousTotalRevenueWon: 14_920_000,
    totalOrders: 268,
    categoryBreakdown: [
      { label: "Outer", value: 28 },
      { label: "Denim", value: 25 },
      { label: "Shoes", value: 19 },
      { label: "Knit", value: 17 },
      { label: "Acc.", value: 11 },
    ],
    bestSellers: [
      { id: "bs-90-1", name: "Wool Overcoat", category: "Outerwear", unitsSold: 61, revenueWon: 4270000, trend: [4, 5, 3, 6, 5, 7, 6] },
      { id: "bs-90-2", name: "Selvedge Denim Jacket", category: "Denim", unitsSold: 52, revenueWon: 3120000, trend: [3, 4, 3, 5, 4, 4, 5] },
      { id: "bs-90-3", name: "Suede Chelsea Boots", category: "Footwear", unitsSold: 40, revenueWon: 2760000, trend: [2, 3, 4, 3, 4, 3, 5] },
      { id: "bs-90-4", name: "Merino Turtleneck", category: "Knitwear", unitsSold: 45, revenueWon: 1755000, trend: [3, 2, 3, 4, 3, 4, 3] },
    ],
  },
};

// ---- final datasets: aggregates derived from the fixed arrays above, at module load ---------

export const PERIOD_DATA: Record<Period, PeriodDataset> = (Object.keys(RAW) as Period[]).reduce(
  (acc, key) => {
    const raw = RAW[key];
    const totalRevenueWon = sum(raw.revenuePoints.map((p) => p.price));
    acc[key] = {
      ...raw,
      totalRevenueWon,
      changePct: pctChange(totalRevenueWon, raw.previousTotalRevenueWon),
      avgOrderValueWon: avgOrderValue(totalRevenueWon, raw.totalOrders),
    };
    return acc;
  },
  {} as Record<Period, PeriodDataset>,
);
