// Lotwise — internal pricing & liquidation desk for a resale marketplace ops team.
// All data below is deterministic dummy data: seeded PRNGs and fixed calendar anchors only.
// No Math.random(), no Date.now(), no argument-less `new Date()`.

import {
  Gavel,
  Timer,
  CheckCircle2,
  CircleDashed,
  Laptop,
  Shirt,
  Sofa,
  Dumbbell,
  Blocks,
  Refrigerator,
  type LucideIcon,
} from "lucide-react";

/* ---------------------------------------------------------------------- */
/* Deterministic RNG                                                       */
/* ---------------------------------------------------------------------- */

function hashSeed(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** mulberry32 — small, fast, fully deterministic PRNG. */
function mulberry32(seed: number) {
  let a = seed;
  return function rng() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ---------------------------------------------------------------------- */
/* Calendar — fixed anchor, no runtime clock                               */
/* ---------------------------------------------------------------------- */

/** Fixed "today" matching the session's real-world today (2026-09-25, a Friday). */
export const TODAY = new Date(2026, 8, 25);
export const TODAY_WITH_TIME = new Date(2026, 8, 25, 16, 10);

function isWeekend(d: Date): boolean {
  const day = d.getDay();
  return day === 0 || day === 6;
}

function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

function addHours(d: Date, n: number): Date {
  const r = new Date(d);
  r.setHours(r.getHours() + n);
  return r;
}

function businessDaysEnding(end: Date, count: number): Date[] {
  const days: Date[] = [];
  let cur = new Date(end);
  while (days.length < count) {
    if (!isWeekend(cur)) days.unshift(new Date(cur));
    cur = addDays(cur, -1);
  }
  return days;
}

/** 30 business days ending today — exactly six 5-day trading weeks, since today is a Friday. */
export const DAILY_DATES = businessDaysEnding(TODAY, 30);

export const shortDateFmt = new Intl.DateTimeFormat("en-US", { month: "numeric", day: "numeric" });
export const longDateFmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });
const narrowRelativeFmt = new Intl.RelativeTimeFormat("en-US", { numeric: "always", style: "narrow" });

export const currencyFmt = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});
export const countFmt = new Intl.NumberFormat("en-US");
export const percentFmt = new Intl.NumberFormat("en-US", {
  style: "percent",
  maximumFractionDigits: 1,
  signDisplay: "exceptZero",
});

/* ---------------------------------------------------------------------- */
/* Domain types                                                            */
/* ---------------------------------------------------------------------- */

export type Category = "Electronics" | "Apparel" | "Home & Furniture" | "Sporting Goods" | "Toys & Games" | "Appliances";

export const CATEGORY_ICON: Record<Category, LucideIcon> = {
  Electronics: Laptop,
  Apparel: Shirt,
  "Home & Furniture": Sofa,
  "Sporting Goods": Dumbbell,
  "Toys & Games": Blocks,
  Appliances: Refrigerator,
};

export type LotStatus = "active" | "review" | "reserved" | "closed";
export type Period = "daily" | "weekly";

export const STATUS_META: Record<
  LotStatus,
  { label: string; icon: LucideIcon; text: string; bg: string; ring: string }
> = {
  active: { label: "Active bidding", icon: Gavel, text: "text-emerald-400", bg: "bg-emerald-500/15", ring: "ring-emerald-500/30" },
  review: { label: "Floor review", icon: Timer, text: "text-amber-400", bg: "bg-amber-500/15", ring: "ring-amber-500/30" },
  reserved: { label: "Reserve met", icon: CheckCircle2, text: "text-teal-400", bg: "bg-teal-500/15", ring: "ring-teal-500/30" },
  closed: { label: "Closed", icon: CircleDashed, text: "text-zinc-400", bg: "bg-zinc-500/15", ring: "ring-zinc-500/30" },
};

export interface Candle {
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface Lot {
  id: string;
  code: string;
  title: string;
  category: Category;
  status: LotStatus;
  basePrice: number;
  floorPrice: number;
  reservePrice: number;
  candles: Candle[];
  sparkline: number[]; // last 12 closes, raw dollar values
  bidCount: number;
  currentPrice: number;
  dayChangePct: number;
}

/* ---------------------------------------------------------------------- */
/* Candle generation                                                       */
/* ---------------------------------------------------------------------- */

function genCandles(seedKey: string, basePrice: number, dates: Date[]): Candle[] {
  const rng = mulberry32(hashSeed(seedKey));
  let prevClose = basePrice;
  const candles: Candle[] = [];
  for (const date of dates) {
    const open = prevClose;
    const drift = (rng() - 0.5) * 0.07; // ~±3.5% typical daily move
    let close = open * (1 + drift);
    close = Math.max(close, basePrice * 0.35);
    let high = Math.max(open, close) * (1 + rng() * 0.018);
    let low = Math.min(open, close) * (1 - rng() * 0.018);

    const openR = Math.round(open);
    const closeR = Math.round(close);
    let highR = Math.round(high);
    let lowR = Math.round(low);
    highR = Math.max(highR, openR, closeR);
    lowR = Math.min(lowR, openR, closeR);
    lowR = Math.max(lowR, 1);

    candles.push({ date, open: openR, high: highR, low: lowR, close: closeR });
    prevClose = close;
  }
  return candles;
}

/** Aggregates daily candles into weekly OHLC candles, 5 trading days per bucket. */
export function aggregateWeekly(daily: Candle[]): Candle[] {
  const weeks: Candle[] = [];
  for (let i = 0; i < daily.length; i += 5) {
    const chunk = daily.slice(i, i + 5);
    if (chunk.length === 0) continue;
    weeks.push({
      date: chunk[0].date,
      open: chunk[0].open,
      close: chunk[chunk.length - 1].close,
      high: Math.max(...chunk.map((c) => c.high)),
      low: Math.min(...chunk.map((c) => c.low)),
    });
  }
  return weeks;
}

/* ---------------------------------------------------------------------- */
/* Lots                                                                     */
/* ---------------------------------------------------------------------- */

interface LotSeed {
  id: string;
  code: string;
  title: string;
  category: Category;
  status: LotStatus;
  basePrice: number;
}

const LOT_SEEDS: LotSeed[] = [
  { id: "lot-01", code: "LOT-2291", title: "Returns pallet — small appliances", category: "Appliances", status: "active", basePrice: 1840 },
  { id: "lot-02", code: "LOT-2288", title: "Open-box laptops, grade B", category: "Electronics", status: "active", basePrice: 6420 },
  { id: "lot-03", code: "LOT-2305", title: "Outdoor sectional, floor models", category: "Home & Furniture", status: "review", basePrice: 2950 },
  { id: "lot-04", code: "LOT-2312", title: "Mixed apparel bundle, Q3 overstock", category: "Apparel", status: "active", basePrice: 980 },
  { id: "lot-05", code: "LOT-2277", title: "Home gym equipment, refurbished", category: "Sporting Goods", status: "reserved", basePrice: 3175 },
  { id: "lot-06", code: "LOT-2321", title: "Building-block sets, retail overstock", category: "Toys & Games", status: "active", basePrice: 640 },
  { id: "lot-07", code: "LOT-2266", title: "Countertop appliance pallet", category: "Appliances", status: "closed", basePrice: 1120 },
  { id: "lot-08", code: "LOT-2298", title: "Tablet & accessory returns", category: "Electronics", status: "review", basePrice: 4380 },
  { id: "lot-09", code: "LOT-2330", title: "Patio furniture clearance, grade A", category: "Home & Furniture", status: "active", basePrice: 5260 },
  { id: "lot-10", code: "LOT-2245", title: "Winter outerwear, end-of-season", category: "Apparel", status: "closed", basePrice: 1450 },
];

function lastN<T>(arr: T[], n: number): T[] {
  return arr.slice(Math.max(0, arr.length - n));
}

export const LOTS: Lot[] = LOT_SEEDS.map((seed) => {
  const candles = genCandles(seed.id, seed.basePrice, DAILY_DATES);
  const last = candles[candles.length - 1];
  const prev = candles[candles.length - 2] ?? last;
  const dayChangePct = prev.close === 0 ? 0 : ((last.close - prev.close) / prev.close) * 100;
  const rng = mulberry32(hashSeed(`${seed.id}-meta`));
  const bidCount = Math.round(3 + rng() * 34);

  return {
    id: seed.id,
    code: seed.code,
    title: seed.title,
    category: seed.category,
    status: seed.status,
    basePrice: seed.basePrice,
    floorPrice: Math.round(seed.basePrice * (0.62 + rng() * 0.08)),
    reservePrice: Math.round(seed.basePrice * (1.12 + rng() * 0.1)),
    candles,
    sparkline: lastN(candles, 12).map((c) => c.close),
    bidCount,
    currentPrice: last.close,
    dayChangePct: Math.round(dayChangePct * 10) / 10,
  };
});

export const TOTAL_LOTS = LOTS.length;
export const STATUS_COUNTS: Record<LotStatus, number> = {
  active: LOTS.filter((l) => l.status === "active").length,
  review: LOTS.filter((l) => l.status === "review").length,
  reserved: LOTS.filter((l) => l.status === "reserved").length,
  closed: LOTS.filter((l) => l.status === "closed").length,
};

export function findLot(id: string | null): Lot | null {
  if (!id) return null;
  return LOTS.find((l) => l.id === id) ?? null;
}

/** The chart's default instrument — the lot with the most active bidding, independent of any pin. */
export const DEFAULT_CHART_LOT_ID = LOTS.reduce((best, l) => (l.bidCount > best.bidCount ? l : best), LOTS[0]).id;

/* ---------------------------------------------------------------------- */
/* Bid ladders (per lot, deterministic)                                    */
/* ---------------------------------------------------------------------- */

export interface Bid {
  id: string;
  bidder: string;
  initials: string;
  amount: number;
  placedAt: Date;
  leading: boolean;
}

const BIDDER_POOL = [
  "Northfield Wholesale",
  "CoastalBin Traders",
  "Union Surplus Co.",
  "Anchor Liquidators",
  "Driftwood Resale Group",
  "Palisade Bulk Buyers",
  "Kestrel Overstock",
  "Marrow Creek Traders",
  "Silvergate Wholesale",
  "Basin & Rail Supply",
];

function initialsFor(name: string): string {
  return name
    .split(" ")
    .filter((w) => w[0] === w[0]?.toUpperCase())
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function bidsForLot(lot: Lot): Bid[] {
  const rng = mulberry32(hashSeed(`${lot.id}-bids`));
  const count = 4 + Math.round(rng() * 2); // 4–6 bids
  const bids: Bid[] = [];
  let amount = lot.currentPrice;
  for (let i = 0; i < count; i++) {
    const bidderIndex = Math.floor(rng() * BIDDER_POOL.length);
    const hoursAgo = Math.round(2 + i * (3 + rng() * 6));
    amount = Math.round(amount * (1 - (0.01 + rng() * 0.03)));
    bids.push({
      id: `${lot.id}-bid-${i}`,
      bidder: BIDDER_POOL[bidderIndex],
      initials: initialsFor(BIDDER_POOL[bidderIndex]),
      amount: Math.max(amount, lot.floorPrice),
      placedAt: addHours(TODAY_WITH_TIME, -hoursAgo),
      leading: i === 0,
    });
  }
  return bids;
}

/* ---------------------------------------------------------------------- */
/* Desk-wide activity feed — global, independent of any pin selection      */
/* ---------------------------------------------------------------------- */

export type ActivityType = "bid" | "floor" | "closed" | "reserve";

export interface ActivityEvent {
  id: string;
  type: ActivityType;
  lotCode: string;
  lotTitle: string;
  description: string;
  at: Date;
}

export const ACTIVITY_ICON: Record<ActivityType, LucideIcon> = {
  bid: Gavel,
  floor: Timer,
  closed: CircleDashed,
  reserve: CheckCircle2,
};

export const ACTIVITY_TONE: Record<ActivityType, string> = {
  bid: "text-emerald-400",
  floor: "text-indigo-300",
  closed: "text-zinc-400",
  reserve: "text-teal-400",
};

export const ACTIVITY_FEED: ActivityEvent[] = [
  { id: "ev-1", type: "bid", lotCode: "LOT-2288", lotTitle: "Open-box laptops, grade B", description: "New bid placed by Anchor Liquidators", at: addHours(TODAY_WITH_TIME, -1) },
  { id: "ev-2", type: "floor", lotCode: "LOT-2312", lotTitle: "Mixed apparel bundle, Q3 overstock", description: "Floor price lowered by a desk trader", at: addHours(TODAY_WITH_TIME, -3) },
  { id: "ev-3", type: "reserve", lotCode: "LOT-2277", lotTitle: "Home gym equipment, refurbished", description: "Reserve price met, lot marked reserved", at: addHours(TODAY_WITH_TIME, -5) },
  { id: "ev-4", type: "bid", lotCode: "LOT-2330", lotTitle: "Patio furniture clearance, grade A", description: "New bid placed by Kestrel Overstock", at: addHours(TODAY_WITH_TIME, -7) },
  { id: "ev-5", type: "closed", lotCode: "LOT-2266", lotTitle: "Countertop appliance pallet", description: "Auction closed, winning bid settled", at: addHours(TODAY_WITH_TIME, -12) },
  { id: "ev-6", type: "bid", lotCode: "LOT-2291", lotTitle: "Returns pallet — small appliances", description: "New bid placed by Union Surplus Co.", at: addHours(TODAY_WITH_TIME, -18) },
  { id: "ev-7", type: "floor", lotCode: "LOT-2298", lotTitle: "Tablet & accessory returns", description: "Floor price under desk review", at: addHours(TODAY_WITH_TIME, -26) },
  { id: "ev-8", type: "closed", lotCode: "LOT-2245", lotTitle: "Winter outerwear, end-of-season", description: "Auction closed, winning bid settled", at: addHours(TODAY_WITH_TIME, -34) },
  { id: "ev-9", type: "bid", lotCode: "LOT-2321", lotTitle: "Building-block sets, retail overstock", description: "New bid placed by Basin & Rail Supply", at: addHours(TODAY_WITH_TIME, -41) },
];

export const relativeTimeFmt = new Intl.RelativeTimeFormat("en-US", { numeric: "auto" });

/** Formats a fixed timestamp against the fixed TODAY_WITH_TIME anchor — never against a live clock. */
export function formatRelative(at: Date): string {
  const diffMs = at.getTime() - TODAY_WITH_TIME.getTime();
  const diffHours = Math.round(diffMs / (1000 * 60 * 60));
  if (Math.abs(diffHours) < 24) return relativeTimeFmt.format(diffHours, "hour");
  const diffDays = Math.round(diffHours / 24);
  return relativeTimeFmt.format(diffDays, "day");
}
