import type { LucideIcon } from "lucide-react";
import {
  CheckCircle2,
  ClipboardList,
  CreditCard,
  Eye,
  Filter,
  Globe,
  LayoutGrid,
  LineChart,
  Link2,
  Mail,
  Plug,
  Search,
  Settings,
  Share2,
  ShoppingCart,
  Target,
  TrendingDown,
  Truck,
  Users,
} from "lucide-react";

/* ---------------------------------------------------------------------- */
/* Deterministic math utilities — no Math.random / Date.now / new Date    */
/* ---------------------------------------------------------------------- */

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

/** Integer weight distribution (largest-remainder method) — the sum matches total exactly even after rounding (parts always sum to the whole). */
export function distributeInts(total: number, weightsPct: number[]): number[] {
  const raw = weightsPct.map((w) => (total * w) / 100);
  const floors = raw.map((v) => Math.floor(v));
  let remainder = total - floors.reduce((a, b) => a + b, 0);
  const order = raw
    .map((v, i) => ({ i, frac: v - Math.floor(v) }))
    .sort((a, b) => b.frac - a.frac);
  const out = [...floors];
  for (let k = 0; k < order.length && remainder > 0; k++, remainder--) {
    out[order[k].i] += 1;
  }
  return out;
}

/** Index-based deterministic wave generator — a reproducible 12-point series using modulo arithmetic, no trigonometry. */
function genSeries(seed: number, base: number, amp: number, n = 12): number[] {
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    const wobble = ((seed + i * 17) % 13) - 6; // -6..6
    const drift = (i - (n - 1) / 2) * (amp / n);
    out.push(round2(clamp(base + wobble * (amp / 12) + drift, 0, base * 2.2)));
  }
  return out;
}

/* ---------------------------------------------------------------------- */
/* Brand / workspace / user                                               */
/* ---------------------------------------------------------------------- */

export const BRAND = { name: "Chute", tagline: "Checkout Funnel Intelligence" };
export { Filter as BrandIcon };

export type Workspace = { id: string; name: string; plan: string };
export const WORKSPACES: Workspace[] = [
  { id: "fernwell", name: "Fernwell Outfitters", plan: "Growth · Web store" },
  { id: "cobalt-goods", name: "Cobalt Goods Co.", plan: "Starter · Web store" },
  { id: "sandbox", name: "QA Sandbox", plan: "Internal test" },
];

/** Fictional persona (not the session context) — a Growth lead using Chute. */
export const CURRENT_USER = {
  name: "Priya Nakamura",
  role: "Head of Growth",
  email: "priya.nakamura@chutehq.io",
  avatarId: "1580489944761-15a19d654956",
};

export function unsplashAvatar(id: string, size = 96): string {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&crop=faces&w=${size}&h=${size}&q=80`;
}

/* ---------------------------------------------------------------------- */
/* Navigation                                                              */
/* ---------------------------------------------------------------------- */

export type NavItem = { id: string; label: string; Icon: LucideIcon; active?: boolean; disabled?: boolean; badge?: string };
export type NavSection = { id: string; title: string; items: NavItem[] };

export const NAV_SECTIONS: NavSection[] = [
  {
    id: "workspace",
    title: "Workspace",
    items: [
      { id: "overview", label: "Overview", Icon: LayoutGrid },
      { id: "funnel", label: "Checkout Funnel", Icon: Filter, active: true },
      { id: "segments", label: "Segments", Icon: Users },
    ],
  },
  {
    id: "analysis",
    title: "Analysis",
    items: [
      { id: "dropoff", label: "Drop-off Reasons", Icon: TrendingDown, badge: "6" },
      { id: "trends", label: "Cohort Trends", Icon: LineChart },
    ],
  },
  {
    id: "admin",
    title: "Admin",
    items: [
      { id: "integrations", label: "Integrations", Icon: Plug, disabled: true },
      { id: "settings", label: "Settings", Icon: Settings },
    ],
  },
];

/* ---------------------------------------------------------------------- */
/* Funnel stages — 7 stages, deterministic counts per period (hand-authored, monotonically decreasing) */
/* ---------------------------------------------------------------------- */

export type StageId = "visit" | "product" | "cart" | "checkout" | "shipping" | "payment" | "purchase";

export type StageMeta = { id: StageId; label: string; Icon: LucideIcon };

export const STAGES: StageMeta[] = [
  { id: "visit", label: "Site Visit", Icon: Globe },
  { id: "product", label: "Product View", Icon: Eye },
  { id: "cart", label: "Add to Cart", Icon: ShoppingCart },
  { id: "checkout", label: "Checkout Started", Icon: ClipboardList },
  { id: "shipping", label: "Shipping Info", Icon: Truck },
  { id: "payment", label: "Payment Info", Icon: CreditCard },
  { id: "purchase", label: "Order Placed", Icon: CheckCircle2 },
];

export type PeriodId = "7d" | "30d" | "90d";
export const PERIODS: { id: PeriodId; label: string }[] = [
  { id: "7d", label: "7D" },
  { id: "30d", label: "30D" },
  { id: "90d", label: "90D" },
];

/** Count per stage (index = STAGES order). Not a partial-sum concept — each stage is the number of sessions that reached that stage. */
export const STAGE_COUNTS: Record<PeriodId, number[]> = {
  "7d": [21400, 12700, 4650, 2720, 2300, 2010, 1690],
  "30d": [96800, 56700, 20500, 12150, 10320, 9040, 7610],
  "90d": [288000, 167200, 60100, 35400, 29850, 26100, 21950],
};

export function stagePct(period: PeriodId, idx: number): number {
  const counts = STAGE_COUNTS[period];
  return round2((counts[idx] / counts[0]) * 100);
}

export function stageRetentionPct(period: PeriodId, idx: number): number {
  if (idx === 0) return 100;
  const counts = STAGE_COUNTS[period];
  return round2((counts[idx] / counts[idx - 1]) * 100);
}

/* ---------------------------------------------------------------------- */
/* Drop-off reasons — 6 transition segments; reason shares are period-independent (structural pattern), only counts are derived per period */
/* ---------------------------------------------------------------------- */

export type DropReason = { label: string; pct: number };

/** Each array: [reason1, reason2, reason3] pct sum + Other = 100. */
export const DROP_REASONS: DropReason[][] = [
  [
    { label: "Bounced from landing page", pct: 46 },
    { label: "Left after homepage browse", pct: 24 },
    { label: "No matching search results", pct: 12 },
  ],
  [
    { label: "Price too high", pct: 34 },
    { label: "Out of stock or size unavailable", pct: 21 },
    { label: "Comparison shopping elsewhere", pct: 17 },
  ],
  [
    { label: "Unexpected shipping cost shown", pct: 31 },
    { label: "Distracted, left tab open", pct: 26 },
    { label: "Coupon code didn't apply", pct: 14 },
  ],
  [
    { label: "Required account creation", pct: 28 },
    { label: "Form error on address field", pct: 19 },
    { label: "Session timed out", pct: 13 },
  ],
  [
    { label: "Shipping cost surprise at this step", pct: 24 },
    { label: "No preferred payment method", pct: 21 },
    { label: "Trust or security concern", pct: 16 },
  ],
  [
    { label: "Card declined", pct: 33 },
    { label: "Changed mind on total price", pct: 19 },
    { label: "Payment page error", pct: 15 },
  ],
];

export type Transition = {
  fromIdx: number;
  toIdx: number;
  dropCount: number;
  dropPct: number;
  reasons: { label: string; pct: number; count: number }[];
};

export function transitionsForPeriod(period: PeriodId): Transition[] {
  const counts = STAGE_COUNTS[period];
  return DROP_REASONS.map((reasons, i) => {
    const fromIdx = i;
    const toIdx = i + 1;
    const dropCount = counts[fromIdx] - counts[toIdx];
    const explicitSum = reasons.reduce((a, r) => a + r.pct, 0);
    const otherPct = 100 - explicitSum;
    const pcts = [...reasons.map((r) => r.pct), otherPct];
    const labels = [...reasons.map((r) => r.label), "Other reasons"];
    const amounts = distributeInts(dropCount, pcts);
    return {
      fromIdx,
      toIdx,
      dropCount,
      dropPct: round2((dropCount / counts[fromIdx]) * 100),
      reasons: labels.map((label, k) => ({ label, pct: pcts[k], count: amounts[k] })),
    };
  });
}

/* ---------------------------------------------------------------------- */
/* Traffic segments — 5 segments, weights sum to 100 (parts sum to whole), device-level split and conversion-rate modulation */
/* ---------------------------------------------------------------------- */

export type DeviceId = "all" | "desktop" | "mobile";
export const DEVICES: { id: DeviceId; label: string }[] = [
  { id: "all", label: "All devices" },
  { id: "desktop", label: "Desktop" },
  { id: "mobile", label: "Mobile" },
];

export type Segment = {
  id: string;
  label: string;
  Icon: LucideIcon;
  weightPct: number;
  desktopShare: number; // 0..1
  addToCartRate: number;
  checkoutStartRate: number;
  purchaseRate: number;
  purchaseDeltaPp: number; // change vs. prior period (percentage point)
};

export const SEGMENTS: Segment[] = [
  { id: "organic", label: "Organic Search", Icon: Search, weightPct: 34, desktopShare: 0.55, addToCartRate: 19.5, checkoutStartRate: 11.0, purchaseRate: 6.8, purchaseDeltaPp: 0.3 },
  { id: "paid", label: "Paid Search", Icon: Target, weightPct: 26, desktopShare: 0.48, addToCartRate: 24.0, checkoutStartRate: 14.5, purchaseRate: 9.4, purchaseDeltaPp: -0.4 },
  { id: "direct", label: "Direct", Icon: Link2, weightPct: 18, desktopShare: 0.62, addToCartRate: 26.5, checkoutStartRate: 16.2, purchaseRate: 11.1, purchaseDeltaPp: 0.6 },
  { id: "email", label: "Email", Icon: Mail, weightPct: 13, desktopShare: 0.71, addToCartRate: 22.0, checkoutStartRate: 13.8, purchaseRate: 9.9, purchaseDeltaPp: 0.2 },
  { id: "social", label: "Social", Icon: Share2, weightPct: 9, desktopShare: 0.35, addToCartRate: 14.0, checkoutStartRate: 7.5, purchaseRate: 4.2, purchaseDeltaPp: -0.5 },
];

const SEGMENT_WEIGHTS = SEGMENTS.map((s) => s.weightPct);

export type SegmentRow = Segment & { sessions: number; addToCartRateAdj: number; checkoutStartRateAdj: number; purchaseRateAdj: number };

const DEVICE_MULT = {
  all: { cart: 1, checkout: 1, purchase: 1 },
  desktop: { cart: 1.03, checkout: 1.04, purchase: 1.06 },
  mobile: { cart: 0.95, checkout: 0.93, purchase: 0.88 },
} as const;

export function segmentRows(period: PeriodId, device: DeviceId): SegmentRow[] {
  const total = STAGE_COUNTS[period][0];
  const sessionsAll = distributeInts(total, SEGMENT_WEIGHTS);
  const mult = DEVICE_MULT[device];
  return SEGMENTS.map((s, i) => {
    const sessions =
      device === "all" ? sessionsAll[i] : Math.round(sessionsAll[i] * (device === "desktop" ? s.desktopShare : 1 - s.desktopShare));
    return {
      ...s,
      sessions,
      addToCartRateAdj: round2(s.addToCartRate * mult.cart),
      checkoutStartRateAdj: round2(s.checkoutStartRate * mult.checkout),
      purchaseRateAdj: round2(s.purchaseRate * mult.purchase),
    };
  });
}

/* ---------------------------------------------------------------------- */
/* 12-week trend series — stage 0 is weekly sessions (in thousands), stages 1-6 are conversion rate vs. the prior stage */
/* ---------------------------------------------------------------------- */

const TREND_SEED: number[] = [11, 23, 37, 41, 53, 61, 73];
const TREND_AMP: number[] = [4.5, 5, 5.5, 4, 3.5, 3, 3.5];

export function trendSeries(stageIdx: number, period: PeriodId): { label: string; value: number }[] {
  const base = stageIdx === 0 ? STAGE_COUNTS[period][0] / 1000 / 4.3 : stageRetentionPct(period, stageIdx);
  const vals = genSeries(TREND_SEED[stageIdx], base, TREND_AMP[stageIdx]);
  return vals.map((v, i) => ({ label: `W${i + 1}`, value: v }));
}

/** Deterministic average time-to-purchase (hand-authored, per period) — display-only string. */
export const AVG_TIME_TO_PURCHASE: Record<PeriodId, string> = {
  "7d": "16m 40s",
  "30d": "18m 10s",
  "90d": "19m 05s",
};

/* ---------------------------------------------------------------------- */
/* Intl formatters                                                         */
/* ---------------------------------------------------------------------- */

const NUM0 = new Intl.NumberFormat("en-US");
const PCT1 = new Intl.NumberFormat("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

export function formatCount(v: number): string {
  return NUM0.format(v);
}
export function formatPct(v: number): string {
  return `${PCT1.format(v)}%`;
}
export function formatPp(v: number): string {
  const sign = v > 0 ? "+" : "";
  return `${sign}${PCT1.format(v)}pp`;
}

/* Dev-time self-check: segment weights sum to 100 (parts sum to whole). */
export const _WEIGHTS_OK = SEGMENT_WEIGHTS.reduce((a, b) => a + b, 0) === 100;
