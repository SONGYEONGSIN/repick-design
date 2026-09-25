import {
  ShieldCheck,
  Eye,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react";

/**
 * Reloop — seller quality console for a resale / liquidation marketplace.
 *
 * All "random-looking" figures are derived from a fixed-seed LCG (mulberry32) rather than
 * `Math.random()`, so every render — server or client — produces byte-identical output. No
 * `Date.now()` / argument-less `new Date()` anywhere: review/tenure copy is pre-formatted text,
 * not computed from a live clock.
 */

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function rand(): number {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rng = mulberry32(88172645);
const round2 = (n: number) => Math.round(n * 100) / 100;
const round1 = (n: number) => Math.round(n * 10) / 10;

export type QualityTier = "healthy" | "watch" | "critical";

export interface TierMeta {
  label: string;
  icon: LucideIcon;
  text: string;
  bg: string;
  border: string;
  dot: string;
  ring: string;
}

export const TIER_META: Record<QualityTier, TierMeta> = {
  healthy: {
    label: "Healthy",
    icon: ShieldCheck,
    text: "text-emerald-400",
    bg: "bg-emerald-500/15",
    border: "border-emerald-400/30",
    dot: "bg-emerald-400",
    ring: "ring-emerald-500/25",
  },
  watch: {
    label: "Watch",
    icon: Eye,
    text: "text-amber-400",
    bg: "bg-amber-500/15",
    border: "border-amber-400/30",
    dot: "bg-amber-400",
    ring: "ring-amber-500/25",
  },
  critical: {
    label: "Critical",
    icon: TriangleAlert,
    text: "text-rose-400",
    bg: "bg-rose-500/15",
    border: "border-rose-400/30",
    dot: "bg-rose-400",
    ring: "ring-rose-500/25",
  },
};

function tierFor(returnRatePct: number): QualityTier {
  if (returnRatePct >= 16) return "critical";
  if (returnRatePct >= 9) return "watch";
  return "healthy";
}

const RETURN_REASONS = [
  "Item not as described",
  "Wrong size or fit",
  "Damaged in transit",
  "Changed mind",
  "Defective on arrival",
  "Late delivery",
  "Missing parts",
  "Below quality expectations",
] as const;

const TENURE_LABELS = [
  "Selling since Q1 2022",
  "Selling since Q3 2022",
  "Selling since Q1 2023",
  "Selling since Q2 2023",
  "Selling since Q4 2023",
  "Selling since Q2 2024",
  "Selling since Q4 2024",
  "Selling since Q1 2025",
] as const;

const REVIEWED_LABELS = [
  "Reviewed yesterday",
  "Reviewed 2 days ago",
  "Reviewed 3 days ago",
  "Reviewed 5 days ago",
  "Reviewed 6 days ago",
  "Reviewed 9 days ago",
  "Reviewed 12 days ago",
  "Reviewed 18 days ago",
] as const;

const SELLER_SEED: { name: string; category: string }[] = [
  { name: "Northfall Outfitters", category: "Outdoor & Sporting" },
  { name: "Bramblewick Home", category: "Home & Garden" },
  { name: "Coastal Crate Co.", category: "Electronics" },
  { name: "Loomtide Apparel", category: "Apparel" },
  { name: "Granite Hollow Tools", category: "Home Improvement" },
  { name: "Petal & Pine", category: "Home & Garden" },
  { name: "Ridgeback Supply", category: "Outdoor & Sporting" },
  { name: "Velvet Anchor Goods", category: "Apparel" },
  { name: "Saltmark Electronics", category: "Electronics" },
  { name: "Cedarloft Living", category: "Home & Garden" },
  { name: "Kettlebrook Kitchenware", category: "Kitchen & Dining" },
  { name: "Fernway Books", category: "Books & Media" },
  { name: "Ironvale Fitness", category: "Sporting Goods" },
  { name: "Mossgate Toys", category: "Toys & Games" },
  { name: "Harborlight Beauty", category: "Beauty & Personal Care" },
  { name: "Driftwood Audio", category: "Electronics" },
  { name: "Brackenfield Apparel", category: "Apparel" },
  { name: "Stonebridge Pet Co.", category: "Pet Supplies" },
  { name: "Wrenfield Office", category: "Office & Stationery" },
  { name: "Amberly Kids", category: "Toys & Games" },
  { name: "Thistledown Wellness", category: "Beauty & Personal Care" },
  { name: "Copperline Cycles", category: "Sporting Goods" },
  { name: "Hallowmere Games", category: "Toys & Games" },
  { name: "Pinegrove Outdoor", category: "Outdoor & Sporting" },
];

export interface Seller {
  id: string;
  name: string;
  category: string;
  initials: string;
  returnRatePct: number;
  revenue: number;
  orderVolume: number;
  avgOrderValue: number;
  trend30dPts: number;
  tier: QualityTier;
  topReturnReason: string;
  tenureLabel: string;
  reviewedLabel: string;
  sparkline: number[];
}

function initialsFor(name: string): string {
  const parts = name.split(/[\s&]+/).filter(Boolean);
  return (parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? parts[0]?.[1] ?? "");
}

export const SELLERS: Seller[] = SELLER_SEED.map((seed, i) => {
  const returnRatePct = round1(3.5 + rng() ** 1.15 * 27);
  const revenueBase = 9000 + rng() ** 1.7 * 470000;
  const revenue = Math.round(revenueBase * (1 - (returnRatePct / 100) * 0.55));
  const avgOrderValue = Math.round(32 + rng() * 168);
  const orderVolume = Math.max(18, Math.round(revenue / avgOrderValue));
  const trend30dPts = round1((rng() - 0.5) * 8);

  const sparkline: number[] = [];
  let walkVal = Math.max(1, returnRatePct - trend30dPts - (rng() - 0.5) * 3);
  for (let s = 0; s < 5; s++) {
    walkVal = Math.max(0.5, walkVal + (rng() - 0.5) * 4);
    sparkline.push(round2(walkVal));
  }
  sparkline.push(round2(returnRatePct));

  return {
    id: `sl-${i + 1}`,
    name: seed.name,
    category: seed.category,
    initials: initialsFor(seed.name).toUpperCase(),
    returnRatePct,
    revenue,
    orderVolume,
    avgOrderValue,
    trend30dPts,
    tier: tierFor(returnRatePct),
    topReturnReason: RETURN_REASONS[i % RETURN_REASONS.length],
    tenureLabel: TENURE_LABELS[i % TENURE_LABELS.length],
    reviewedLabel: REVIEWED_LABELS[i % REVIEWED_LABELS.length],
    sparkline,
  };
});

export const OUTLIER_TOP_REVENUE = [...SELLERS]
  .sort((a, b) => b.revenue - a.revenue)
  .slice(0, 3)
  .map((s) => s.id);

export const OUTLIER_WORST_RETURN = [...SELLERS]
  .sort((a, b) => b.returnRatePct - a.returnRatePct)
  .slice(0, 3)
  .map((s) => s.id);

export const TOTALS = {
  sellerCount: SELLERS.length,
  totalRevenue: SELLERS.reduce((sum, s) => sum + s.revenue, 0),
  totalOrders: SELLERS.reduce((sum, s) => sum + s.orderVolume, 0),
  avgReturnRatePct:
    round1(SELLERS.reduce((sum, s) => sum + s.returnRatePct, 0) / SELLERS.length),
  flaggedCount: SELLERS.filter((s) => s.tier !== "healthy").length,
};

// ---- Formatters -----------------------------------------------------------

const currencyFmt = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});
export function formatCurrency(n: number): string {
  return currencyFmt.format(n);
}

const currencyCompactFmt = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1,
});
export function formatCurrencyCompact(n: number): string {
  return currencyCompactFmt.format(n);
}

const percentFmt = new Intl.NumberFormat("en-US", {
  style: "percent",
  maximumFractionDigits: 1,
});
export function formatPercent(pct: number): string {
  return percentFmt.format(pct / 100);
}

const countFmt = new Intl.NumberFormat("en-US");
export function formatCount(n: number): string {
  return countFmt.format(n);
}

// ---- CSV export -------------------------------------------------------------

function csvEscape(value: string | number): string {
  const s = String(value);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

type CsvRow = (string | number)[];

export function sellersToCsv(sellers: Seller[]): string {
  const header: CsvRow = ["Seller", "Category", "Tier", "Return rate %", "Revenue", "Orders", "30-day trend pts"];
  const rows: CsvRow[] = sellers.map((s) => [
    s.name,
    s.category,
    TIER_META[s.tier].label,
    s.returnRatePct,
    s.revenue,
    s.orderVolume,
    s.trend30dPts,
  ]);
  return [header, ...rows].map((row) => row.map(csvEscape).join(",")).join("\n");
}

// ---- Shared style tokens ------------------------------------------------------

export const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400";
