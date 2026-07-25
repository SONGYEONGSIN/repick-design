import type { LucideIcon } from "lucide-react";
import {
  ArrowLeftRight,
  Bitcoin,
  CandlestickChart,
  FileText,
  Gauge,
  Landmark,
  LayoutGrid,
  PieChart,
  Scale,
  Settings,
  TrendingUp,
  Wallet,
} from "lucide-react";

/* ======================================================================
 * Tessera — Portfolio Allocation Cockpit (Treemap Cockpit)
 * Pure data/math module. No Math.random / Date usage → identical server/client render (hydration-safe).
 * Light = pure white zinc-50/white canvas, dark = zinc-950/900 surface. One accent color = violet.
 * P&L tone = emerald (gain) / rose (loss). Kept separate from category identity colors.
 * ==================================================================== */

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/* ---- Design tokens (route-local class constants) ---------------------------- */
export const APP_BG = "bg-zinc-50 dark:bg-zinc-950";
export const CARD_BG = "bg-white dark:bg-zinc-900";
export const BORDER = "border-zinc-200 dark:border-zinc-800";
export const DIVIDE = "divide-zinc-200 dark:divide-zinc-800";
export const CARD = cx("rounded-2xl border", BORDER, CARD_BG, "shadow-sm");

export const TEXT_PRIMARY = "text-zinc-900 dark:text-zinc-50";
export const TEXT_SECONDARY = "text-zinc-600 dark:text-zinc-300";
/** On light surfaces, secondary text must be zinc-500 or darker (no zinc-400 on white). Dark surfaces: zinc-400 or lighter. */
export const TEXT_CAPTION = "text-zinc-500 dark:text-zinc-400";

/** Alignment for numbers, weights, and amounts — same width as the global font-sans (Pretendard). */
export const NUM = "tabular-nums [font-feature-settings:'tnum']";

export const ACCENT_TEXT = "text-violet-600 dark:text-violet-400";
export const ACCENT_SOLID = "bg-violet-600 text-white hover:bg-violet-500 active:bg-violet-700";

export const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-violet-400 dark:focus-visible:ring-offset-zinc-950";
export const FOCUS_RING_INSET =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-violet-600 dark:focus-visible:ring-violet-400";

export const HOVER_ACTIVE_BG =
  "hover:bg-zinc-100 active:bg-zinc-200 dark:hover:bg-zinc-800 dark:active:bg-zinc-700";
export const HOVER_ROW = "hover:bg-zinc-50 dark:hover:bg-white/[0.03]";
export const TRANSITION = "transition-colors motion-reduce:transition-none";

/* ---- Deterministic math -------------------------------------------------- */
export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

/* ---- Intl formatting ---------------------------------------------------- */
const krwFull = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "KRW",
  maximumFractionDigits: 0,
});
const krwCompact = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "KRW",
  notation: "compact",
  maximumFractionDigits: 2,
});

export function fmtKRW(v: number): string {
  return krwFull.format(Math.round(v));
}
export function fmtKRWc(v: number): string {
  return krwCompact.format(Math.round(v));
}
export function fmtSignedKRWc(v: number): string {
  const sign = v > 0 ? "+" : v < 0 ? "-" : "";
  return `${sign}${krwCompact.format(Math.abs(Math.round(v)))}`;
}
export function fmtPct(v: number, d = 1): string {
  return `${v.toFixed(d)}%`;
}
export function fmtSignedPct(v: number, d = 2): string {
  const sign = v > 0 ? "+" : v < 0 ? "-" : "";
  return `${sign}${Math.abs(v).toFixed(d)}%`;
}

/* ---- Brand / user / nav ---------------------------------------- */
export const BRAND = { name: "Tessera", tagline: "Wealth Allocation", Icon: LayoutGrid };

/** Fictional persona (unrelated to session context). */
export const CURRENT_USER = {
  name: "Elena Whitfield",
  role: "Portfolio Manager",
  avatarId: "1531123897727-8f129e1688ce",
};

export function unsplashAvatar(id: string, size = 96): string {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&crop=faces&w=${size}&h=${size}&q=80`;
}

export type Account = { id: string; name: string; meta: string };
export const ACCOUNTS: Account[] = [
  { id: "brokerage", name: "Personal Brokerage Account", meta: "Full-service wealth management · Real-time" },
  { id: "irp", name: "Retirement IRP", meta: "Tax-advantaged · Long-term" },
  { id: "corp", name: "Corporate Trading Account", meta: "Corporate · Approval required" },
];

export type NavItem = { id: string; label: string; Icon: LucideIcon; active?: boolean; disabled?: boolean; badge?: string };
export type NavSection = { id: string; title: string; items: NavItem[] };

export const NAV_SECTIONS: NavSection[] = [
  {
    id: "portfolio",
    title: "Portfolio",
    items: [
      { id: "cockpit", label: "Allocation Cockpit", Icon: LayoutGrid, active: true },
      { id: "allocation", label: "Asset Allocation", Icon: PieChart },
      { id: "transactions", label: "Transactions", Icon: ArrowLeftRight },
    ],
  },
  {
    id: "analysis",
    title: "Analysis",
    items: [
      { id: "performance", label: "Performance", Icon: TrendingUp },
      { id: "risk", label: "Risk", Icon: Gauge },
      { id: "rebalance", label: "Rebalancing", Icon: Scale, badge: "3" },
    ],
  },
  {
    id: "admin",
    title: "Admin",
    items: [
      { id: "tax", label: "Tax Report", Icon: FileText, disabled: true },
      { id: "settings", label: "Settings", Icon: Settings },
    ],
  },
];

/* ---- Categories (asset classes) --------------------------------------------- */
export type CategoryId = "equity" | "bond" | "crypto" | "cash";
export const CATEGORY_ORDER: CategoryId[] = ["equity", "bond", "crypto", "cash"];

export interface CategoryMeta {
  id: CategoryId;
  label: string;
  short: string;
  Icon: LucideIcon;
  dot: string;
  badge: string;
  arc: string;
}
export const CATEGORY: Record<CategoryId, CategoryMeta> = {
  equity: {
    id: "equity",
    label: "Equities",
    short: "Equity",
    Icon: CandlestickChart,
    dot: "bg-indigo-500",
    badge: "bg-indigo-50 text-indigo-700 ring-indigo-600/20 dark:bg-indigo-500/10 dark:text-indigo-300 dark:ring-indigo-400/20",
    arc: "text-indigo-500 dark:text-indigo-400",
  },
  bond: {
    id: "bond",
    label: "Bonds",
    short: "Bonds",
    Icon: Landmark,
    dot: "bg-sky-500",
    badge: "bg-sky-50 text-sky-700 ring-sky-600/20 dark:bg-sky-500/10 dark:text-sky-300 dark:ring-sky-400/20",
    arc: "text-sky-500 dark:text-sky-400",
  },
  crypto: {
    id: "crypto",
    label: "Crypto",
    short: "Crypto",
    Icon: Bitcoin,
    dot: "bg-amber-500",
    badge: "bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-400/20",
    arc: "text-amber-500 dark:text-amber-400",
  },
  cash: {
    id: "cash",
    label: "Cash Equivalents",
    short: "Cash",
    Icon: Wallet,
    dot: "bg-teal-500",
    badge: "bg-teal-50 text-teal-700 ring-teal-600/20 dark:bg-teal-500/10 dark:text-teal-300 dark:ring-teal-400/20",
    arc: "text-teal-500 dark:text-teal-400",
  },
};

/** Coverage analyst per category — detail panel avatar (next/image, fictional persona). */
export const ANALYST: Record<CategoryId, { name: string; role: string; avatarId: string }> = {
  equity: { name: "Marcus Chen", role: "Equity Research", avatarId: "1500648767791-00dcc994a43e" },
  bond: { name: "Sofia Ramos", role: "Fixed Income Strategist", avatarId: "1494790108377-be9c29b29330" },
  crypto: { name: "Daniel Okafor", role: "Digital Assets Research", avatarId: "1544005313-94ddf0286df2" },
  cash: { name: "Yuki Tanaka", role: "Treasury & FX Desk", avatarId: "1438761681033-6461ffad8d80" },
};

/* ---- Period segments ------------------------------------------------ */
export type PeriodId = "1D" | "1W" | "1M" | "YTD";
export const PERIODS: { id: PeriodId; label: string }[] = [
  { id: "1D", label: "1 Day" },
  { id: "1W", label: "1 Week" },
  { id: "1M", label: "1 Month" },
  { id: "YTD", label: "Year to Date" },
];

/* ---- Holdings ---------------------------------------------------- */
export interface Holding {
  id: string;
  symbol: string;
  name: string;
  category: CategoryId;
  /** Cost basis (KRW). Market value = cost * (1 + period return). */
  cost: number;
  /** Model target weight (% of portfolio) — the basis for rebalancing band checks. */
  target: number;
  /** Cumulative return per period (decimal). Drives tone, weight, and tile size. */
  returns: Record<PeriodId, number>;
}

const B = 100_000_000; // hundred million (KRW)
export const HOLDINGS: Holding[] = [
  // Equities
  { id: "nvda", symbol: "NVDA", name: "Nvidia", category: "equity", cost: 3.05 * B, target: 12, returns: { "1D": 0.021, "1W": 0.048, "1M": 0.112, YTD: 0.386 } },
  { id: "aapl", symbol: "AAPL", name: "Apple", category: "equity", cost: 2.8 * B, target: 11, returns: { "1D": 0.006, "1W": -0.011, "1M": 0.032, YTD: 0.144 } },
  { id: "msft", symbol: "MSFT", name: "Microsoft", category: "equity", cost: 2.45 * B, target: 10, returns: { "1D": 0.012, "1W": 0.019, "1M": 0.041, YTD: 0.203 } },
  { id: "asml", symbol: "ASML", name: "ASML Holding", category: "equity", cost: 1.55 * B, target: 7, returns: { "1D": -0.014, "1W": 0.026, "1M": 0.058, YTD: 0.171 } },
  { id: "tsm", symbol: "TSM", name: "TSMC", category: "equity", cost: 1.3 * B, target: 6, returns: { "1D": 0.031, "1W": 0.052, "1M": 0.089, YTD: 0.312 } },
  { id: "tsla", symbol: "TSLA", name: "Tesla", category: "equity", cost: 1.05 * B, target: 4, returns: { "1D": -0.028, "1W": -0.041, "1M": 0.067, YTD: -0.092 } },
  // Bonds
  { id: "ief", symbol: "IEF", name: "US Treasury 7-10Y", category: "bond", cost: 1.8 * B, target: 9, returns: { "1D": 0.003, "1W": -0.006, "1M": 0.011, YTD: 0.028 } },
  { id: "ktb", symbol: "KTB", name: "Korea Treasury Bond 10Y", category: "bond", cost: 1.3 * B, target: 6, returns: { "1D": 0.002, "1W": 0.004, "1M": 0.009, YTD: 0.021 } },
  { id: "corp", symbol: "CORP", name: "AA Corporate Bond", category: "bond", cost: 0.9 * B, target: 4, returns: { "1D": 0.001, "1W": 0.003, "1M": 0.014, YTD: 0.037 } },
  { id: "tips", symbol: "TIPS", name: "Inflation-Linked Bond", category: "bond", cost: 0.5 * B, target: 3, returns: { "1D": -0.002, "1W": 0.005, "1M": 0.008, YTD: 0.019 } },
  // Crypto
  { id: "btc", symbol: "BTC", name: "Bitcoin", category: "crypto", cost: 1.9 * B, target: 6, returns: { "1D": 0.038, "1W": 0.094, "1M": 0.152, YTD: 0.541 } },
  { id: "eth", symbol: "ETH", name: "Ethereum", category: "crypto", cost: 1.1 * B, target: 4, returns: { "1D": 0.052, "1W": 0.071, "1M": -0.043, YTD: 0.287 } },
  { id: "sol", symbol: "SOL", name: "Solana", category: "crypto", cost: 0.55 * B, target: 2, returns: { "1D": -0.061, "1W": 0.118, "1M": 0.224, YTD: 0.412 } },
  // Cash equivalents
  { id: "krw", symbol: "KRW", name: "KRW Money Market Fund", category: "cash", cost: 2.0 * B, target: 11, returns: { "1D": 0.0004, "1W": 0.001, "1M": 0.004, YTD: 0.017 } },
  { id: "usd", symbol: "USD", name: "USD Cash Deposit", category: "cash", cost: 1.0 * B, target: 5, returns: { "1D": 0.007, "1W": -0.009, "1M": 0.012, YTD: 0.043 } },
];

export const AS_OF = "As of market close, 2026-06-30";
export const REBALANCE_BAND = 2.0; // Recommend rebalancing when drift from target exceeds ±2pp

export function holdingValue(h: Holding, p: PeriodId): number {
  return h.cost * (1 + h.returns[p]);
}
export function pnlAmount(h: Holding, p: PeriodId): number {
  return holdingValue(h, p) - h.cost;
}

/** 20-trading-day mini sparkline (base = 100). Deterministic, seeded by index. Coordinates rounded to 2 decimals. */
export function sparkSeries(index: number, ret1M: number): number[] {
  const out: number[] = [];
  for (let i = 0; i < 20; i++) {
    const t = i / 19;
    const drift = ret1M * t;
    const wave = Math.sin((i + index * 1.7) * 0.9) * 0.018 + Math.cos((i * 1.3 + index) * 0.6) * 0.011;
    out.push(round2((1 + drift + wave) * 100));
  }
  return out;
}

/* ---- P&L tone tiers (color + text combined, keeps AA contrast) ------------------- */
export type Tone = "up3" | "up2" | "up1" | "flat" | "down1" | "down2" | "down3";
export function toneFor(pnlPct: number): Tone {
  const m = Math.abs(pnlPct);
  if (m < 0.75) return "flat";
  if (pnlPct > 0) return m >= 8 ? "up3" : m >= 3 ? "up2" : "up1";
  return m >= 8 ? "down3" : m >= 3 ? "down2" : "down1";
}
export interface ToneClass {
  fill: string;
  num: string;
  ring: string;
}
export const TILE_TONE: Record<Tone, ToneClass> = {
  up3: { fill: "bg-emerald-200 dark:bg-emerald-500/25", num: "text-emerald-800 dark:text-emerald-300", ring: "ring-1 ring-inset ring-emerald-500/50" },
  up2: { fill: "bg-emerald-100 dark:bg-emerald-500/[0.16]", num: "text-emerald-800 dark:text-emerald-300", ring: "" },
  up1: { fill: "bg-emerald-50 dark:bg-emerald-500/[0.1]", num: "text-emerald-700 dark:text-emerald-300", ring: "" },
  flat: { fill: "bg-zinc-100 dark:bg-zinc-800/70", num: "text-zinc-600 dark:text-zinc-300", ring: "" },
  down1: { fill: "bg-rose-50 dark:bg-rose-500/[0.1]", num: "text-rose-700 dark:text-rose-300", ring: "" },
  down2: { fill: "bg-rose-100 dark:bg-rose-500/[0.16]", num: "text-rose-800 dark:text-rose-300", ring: "" },
  down3: { fill: "bg-rose-200 dark:bg-rose-500/[0.24]", num: "text-rose-800 dark:text-rose-300", ring: "ring-1 ring-inset ring-rose-500/50" },
};

/* ---- Squarified Treemap (deterministic) ---------------------------------- */
export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}
export const CANVAS = { w: 1000, h: 600 };

function worstRatio(areas: number[], side: number): number {
  let s = 0;
  let max = -Infinity;
  let min = Infinity;
  for (const a of areas) {
    s += a;
    if (a > max) max = a;
    if (a < min) min = a;
  }
  const side2 = side * side;
  const s2 = s * s;
  return Math.max((side2 * max) / s2, s2 / (side2 * min));
}

/** Lays out a value array (descending order recommended) inside rect as near-square blocks. Returned rects match input order. */
export function squarify(values: number[], rect: Rect): Rect[] {
  const n = values.length;
  const result: Rect[] = new Array(n);
  const total = values.reduce((a, b) => a + b, 0) || 1;
  const area = Math.max(0, rect.w) * Math.max(0, rect.h);
  const scaled = values.map((v) => (v / total) * area);
  let free: Rect = { ...rect };
  let i = 0;
  while (i < n) {
    const side = Math.max(1, Math.min(free.w, free.h));
    const row: number[] = [];
    const startIdx = i;
    while (i < n) {
      const withNext = row.concat(scaled[i]);
      if (row.length === 0 || worstRatio(withNext, side) <= worstRatio(row, side)) {
        row.push(scaled[i]);
        i++;
      } else break;
    }
    const rowSum = row.reduce((a, b) => a + b, 0);
    const thickness = rowSum / side;
    if (free.w >= free.h) {
      let y = free.y;
      for (let k = 0; k < row.length; k++) {
        const h = thickness > 0 ? row[k] / thickness : 0;
        result[startIdx + k] = { x: free.x, y, w: thickness, h };
        y += h;
      }
      free = { x: free.x + thickness, y: free.y, w: free.w - thickness, h: free.h };
    } else {
      let x = free.x;
      for (let k = 0; k < row.length; k++) {
        const w = thickness > 0 ? row[k] / thickness : 0;
        result[startIdx + k] = { x, y: free.y, w, h: thickness };
        x += w;
      }
      free = { x: free.x, y: free.y + thickness, w: free.w, h: free.h - thickness };
    }
  }
  return result;
}

function insetRect(r: Rect, pad: number): Rect {
  return {
    x: r.x + pad,
    y: r.y + pad,
    w: Math.max(1, r.w - pad * 2),
    h: Math.max(1, r.h - pad * 2),
  };
}
function toPct(r: Rect): Rect {
  return {
    x: round2((r.x / CANVAS.w) * 100),
    y: round2((r.y / CANVAS.h) * 100),
    w: round2((r.w / CANVAS.w) * 100),
    h: round2((r.h / CANVAS.h) * 100),
  };
}

export type LabelDetail = "full" | "mid" | "min" | "none";
export interface Tile {
  holding: Holding;
  value: number;
  pnlPct: number;
  weightPct: number; // relative to the whole portfolio
  geom: Rect; // percentage relative to the parent block's content area
  detail: LabelDetail;
}
export interface Block {
  cat: CategoryId;
  total: number;
  weightPct: number;
  geom: Rect; // percentage relative to the canvas
  tiles: Tile[];
}
export interface TreemapModel {
  blocks: Block[];
  tileCount: number;
  activeTotal: number;
  fullTotal: number;
}

function labelDetail(cw: number, ch: number): LabelDetail {
  if (cw >= 95 && ch >= 64) return "full";
  if (cw >= 58 && ch >= 42) return "mid";
  if (cw >= 34 && ch >= 30) return "min";
  return "none";
}

export function buildTreemap(all: Holding[], period: PeriodId, active: ReadonlySet<CategoryId>): TreemapModel {
  const fullTotal = all.reduce((s, h) => s + holdingValue(h, period), 0);
  const items = all.filter((h) => active.has(h.category));
  const activeTotal = items.reduce((s, h) => s + holdingValue(h, period), 0);

  const byCat = new Map<CategoryId, Holding[]>();
  for (const h of items) {
    const list = byCat.get(h.category);
    if (list) list.push(h);
    else byCat.set(h.category, [h]);
  }
  const cats = [...byCat.entries()]
    .map(([c, list]) => ({ c, list, total: list.reduce((s, h) => s + holdingValue(h, period), 0) }))
    .sort((a, b) => b.total - a.total);

  const catRects = squarify(cats.map((c) => c.total), { x: 0, y: 0, w: CANVAS.w, h: CANVAS.h });
  const blocks: Block[] = [];
  let tileCount = 0;

  const HEADER = 30; // header height in canvas units (used only to compute the content area)

  cats.forEach((c, ci) => {
    const r = insetRect(catRects[ci], 4);
    const inner: Rect = { x: r.x, y: r.y + HEADER, w: r.w, h: Math.max(1, r.h - HEADER) };
    const hs = c.list.slice().sort((a, b) => holdingValue(b, period) - holdingValue(a, period));
    const rects = squarify(hs.map((h) => holdingValue(h, period)), inner);
    const tiles: Tile[] = hs.map((h, hi) => {
      const tr = insetRect(rects[hi], 2);
      const v = holdingValue(h, period);
      return {
        holding: h,
        value: v,
        pnlPct: h.returns[period] * 100,
        weightPct: fullTotal ? (v / fullTotal) * 100 : 0,
        detail: labelDetail(rects[hi].w, rects[hi].h),
        geom: {
          x: round2(clamp(((tr.x - inner.x) / inner.w) * 100, 0, 100)),
          y: round2(clamp(((tr.y - inner.y) / inner.h) * 100, 0, 100)),
          w: round2(clamp((tr.w / inner.w) * 100, 0, 100)),
          h: round2(clamp((tr.h / inner.h) * 100, 0, 100)),
        },
      };
    });
    tileCount += tiles.length;
    blocks.push({ cat: c.c, total: c.total, weightPct: fullTotal ? (c.total / fullTotal) * 100 : 0, geom: toPct(r), tiles });
  });

  return { blocks, tileCount, activeTotal, fullTotal };
}

/* ---- Rebalancing / aggregation helpers ------------------------------------------- */
export function portfolioWeight(h: Holding, period: PeriodId, fullTotal: number): number {
  return fullTotal ? (holdingValue(h, period) / fullTotal) * 100 : 0;
}
export function driftPct(h: Holding, period: PeriodId, fullTotal: number): number {
  return portfolioWeight(h, period, fullTotal) - h.target;
}
export function needsRebalance(h: Holding, period: PeriodId, fullTotal: number): boolean {
  return Math.abs(driftPct(h, period, fullTotal)) >= REBALANCE_BAND;
}

export interface HeroStats {
  total: number;
  cost: number;
  pnl: number;
  pnlPct: number;
  dayPnl: number;
  dayPnlPct: number;
  rebalanceCount: number;
  holdingCount: number;
}
export function heroStats(all: Holding[], period: PeriodId, active: ReadonlySet<CategoryId>): HeroStats {
  const fullTotal = all.reduce((s, h) => s + holdingValue(h, period), 0);
  const items = all.filter((h) => active.has(h.category));
  const total = items.reduce((s, h) => s + holdingValue(h, period), 0);
  const cost = items.reduce((s, h) => s + h.cost, 0);
  const pnl = total - cost;
  const dayValue = items.reduce((s, h) => s + holdingValue(h, "1D"), 0);
  const dayCost = cost;
  const dayPnl = dayValue - dayCost;
  const rebalanceCount = items.filter((h) => needsRebalance(h, period, fullTotal)).length;
  return {
    total,
    cost,
    pnl,
    pnlPct: cost ? (pnl / cost) * 100 : 0,
    dayPnl,
    dayPnlPct: dayCost ? (dayPnl / dayCost) * 100 : 0,
    rebalanceCount,
    holdingCount: items.length,
  };
}
