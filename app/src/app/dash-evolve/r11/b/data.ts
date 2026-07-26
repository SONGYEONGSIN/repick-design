import type { LucideIcon } from "lucide-react";
import { ClipboardList, History, Landmark, LayoutGrid, PieChart, Settings, ShieldCheck, TrendingUp, Users } from "lucide-react";

/* ---------------------------------------------------------------------- */
/* Deterministic math utils — no Math.random / Date.now / new Date use     */
/* ---------------------------------------------------------------------- */

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/**
 * Splits `total` across `weights` (fractions, should sum to ~1) with exact reconciliation: every
 * part but the last is rounded to the nearest `roundTo`, and the last part absorbs whatever
 * remainder is left so the parts always sum to exactly `total` — never off-by-rounding.
 */
export function splitExact(total: number, weights: number[], roundTo = 1): number[] {
  const parts: number[] = [];
  let allocated = 0;
  for (let i = 0; i < weights.length - 1; i++) {
    const raw = total * weights[i];
    const rounded = Math.round(raw / roundTo) * roundTo;
    parts.push(rounded);
    allocated += rounded;
  }
  parts.push(round2(total - allocated));
  return parts;
}

/* ---------------------------------------------------------------------- */
/* Formatting — Intl only                                                  */
/* ---------------------------------------------------------------------- */

const usdFull = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const usdCompact = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});
const intNum = new Intl.NumberFormat("en-US");

export function fmtUSD(n: number): string {
  return usdFull.format(n);
}
export function fmtUSDCompact(n: number): string {
  return usdCompact.format(n);
}
export function fmtNum(n: number): string {
  return intNum.format(Math.round(n));
}
export function fmtSigned(n: number, formatter: (n: number) => string): string {
  return `${n >= 0 ? "+" : "−"}${formatter(Math.abs(n))}`;
}
export function fmtPct(n: number, digits = 1): string {
  return `${(n * 100).toFixed(digits)}%`;
}

/* ---------------------------------------------------------------------- */
/* Brand / workspace / user                                                */
/* ---------------------------------------------------------------------- */

export const BRAND = { name: "Amberline", tagline: "Revenue & P&L Bridge Cockpit" };
export { Landmark as BrandIcon };

export type Workspace = { id: string; name: string; plan: string };
export const WORKSPACES: Workspace[] = [
  { id: "amberline-core", name: "Amberline Core", plan: "Growth · Finance workspace" },
  { id: "amberline-eu", name: "Amberline EU", plan: "Scale · Finance workspace" },
  { id: "sandbox", name: "QA Sandbox", plan: "Internal test" },
];

export function unsplashAvatar(id: string, size = 96): string {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&crop=faces&w=${size}&h=${size}&q=80`;
}

/** Fictional persona (not the session context) — the finance-ops lead using Amberline. */
export const CURRENT_USER = {
  name: "Lena Marchetti",
  role: "Finance Operations Lead",
  email: "lena.marchetti@amberline-hq.io",
  avatarId: "1502920917128-1aa500764cbd",
};

/* ---------------------------------------------------------------------- */
/* Navigation                                                               */
/* ---------------------------------------------------------------------- */

export type NavItem = { id: string; label: string; Icon: LucideIcon; active?: boolean; disabled?: boolean; badge?: string };
export type NavSection = { id: string; title: string; items: NavItem[] };

export const NAV_SECTIONS: NavSection[] = [
  {
    id: "workspace",
    title: "Workspace",
    items: [
      { id: "overview", label: "Overview", Icon: LayoutGrid },
      { id: "bridge", label: "Revenue Bridge", Icon: TrendingUp, active: true },
      { id: "retention", label: "Cohort Retention", Icon: Users },
    ],
  },
  {
    id: "analysis",
    title: "Analysis",
    items: [
      { id: "segments", label: "Segment Reports", Icon: PieChart },
      { id: "forecast", label: "Forecast Scenarios", Icon: History },
      { id: "controls", label: "Close Checklist", Icon: ShieldCheck },
    ],
  },
  {
    id: "admin",
    title: "Admin",
    items: [
      { id: "billing", label: "Billing & Plan", Icon: ClipboardList, disabled: true },
      { id: "settings", label: "Settings", Icon: Settings },
    ],
  },
];

/* ---------------------------------------------------------------------- */
/* Segments & owners                                                       */
/* ---------------------------------------------------------------------- */

export type SegmentId = "enterprise" | "midmarket" | "smb" | "selfserve";

export const SEGMENTS: { id: SegmentId; label: string }[] = [
  { id: "enterprise", label: "Enterprise" },
  { id: "midmarket", label: "Mid-Market" },
  { id: "smb", label: "SMB" },
  { id: "selfserve", label: "Self-serve" },
];

export const SEGMENT_OWNERS: Record<SegmentId, { name: string; role: string; avatarId: string }> = {
  enterprise: { name: "Priya Shah", role: "Enterprise Segment Lead", avatarId: "1500648767791-00dcc994a43e" },
  midmarket: { name: "Marcus Ondera", role: "Mid-Market Segment Lead", avatarId: "1505740420928-5e560c06d30e" },
  smb: { name: "Talia Novak", role: "SMB Segment Lead", avatarId: "1515372039744-b8f02a3ae446" },
  selfserve: { name: "Devon Ashby", role: "Self-serve Segment Lead", avatarId: "1531123897727-8f129e1688ce" },
};

/* ---------------------------------------------------------------------- */
/* Bridge — periods, metrics, deterministic dataset                        */
/* ---------------------------------------------------------------------- */

export type PeriodId = "monthly" | "quarterly";
export type MetricId = "arr" | "seats";
export type DeltaStepKey = "new" | "expansion" | "reactivation" | "contraction" | "churn";
export type StepKey = "start" | DeltaStepKey | "end";

export const PERIOD_OPTIONS: { id: PeriodId; label: string }[] = [
  { id: "monthly", label: "Monthly" },
  { id: "quarterly", label: "Quarterly" },
];
export const METRIC_OPTIONS: { id: MetricId; label: string }[] = [
  { id: "arr", label: "ARR ($)" },
  { id: "seats", label: "Seats (#)" },
];

type BridgeInput = {
  periodLabel: string;
  startLabel: string;
  endLabel: string;
  start: number;
  new: number;
  expansion: number;
  reactivation: number;
  contraction: number; // stored as a positive magnitude — sign applied when building bars
  churn: number; // stored as a positive magnitude
  end: number;
};

/**
 * Fully reconciled, hand-computed dataset chained across one real fiscal timeline (no random /
 * Date.now): Jan 1 2026 (4.22M ARR / 17,000 seats) → Q1+Q2 quarterly bridge → Jun 30 2026
 * (4.82M ARR / 19,200 seats) → July monthly bridge → Jul 31 2026 (5.025M ARR / 20,000 seats).
 * Each bridge's start + deltas sum exactly to its end (verified by comment, not just trust).
 */
export const BRIDGE_INPUT: Record<PeriodId, Record<MetricId, BridgeInput>> = {
  monthly: {
    arr: {
      periodLabel: "Jun 30 → Jul 31, 2026",
      startLabel: "Jun 30, 2026",
      endLabel: "Jul 31, 2026",
      start: 4_820_000,
      new: 186_000,
      expansion: 142_000,
      reactivation: 38_000,
      contraction: 64_000,
      churn: 97_000,
      end: 5_025_000, // 4,820,000 + 186,000 + 142,000 + 38,000 - 64,000 - 97,000
    },
    seats: {
      periodLabel: "Jun 30 → Jul 31, 2026",
      startLabel: "Jun 30, 2026",
      endLabel: "Jul 31, 2026",
      start: 19_200,
      new: 860,
      expansion: 540,
      reactivation: 120,
      contraction: 310,
      churn: 410,
      end: 20_000, // 19,200 + 860 + 540 + 120 - 310 - 410
    },
  },
  quarterly: {
    arr: {
      periodLabel: "Q1 → Q2 2026",
      startLabel: "Mar 31, 2026",
      endLabel: "Jun 30, 2026",
      start: 4_220_000,
      new: 560_000,
      expansion: 410_000,
      reactivation: 96_000,
      contraction: 198_000,
      churn: 268_000,
      end: 4_820_000, // 4,220,000 + 560,000 + 410,000 + 96,000 - 198,000 - 268,000
    },
    seats: {
      periodLabel: "Q1 → Q2 2026",
      startLabel: "Mar 31, 2026",
      endLabel: "Jun 30, 2026",
      start: 17_000,
      new: 2_400,
      expansion: 1_500,
      reactivation: 360,
      contraction: 880,
      churn: 1_180,
      end: 19_200, // 17,000 + 2,400 + 1,500 + 360 - 880 - 1,180
    },
  },
};

export const STEP_ORDER: StepKey[] = ["start", "new", "expansion", "reactivation", "contraction", "churn", "end"];
export const DELTA_STEPS: DeltaStepKey[] = ["new", "expansion", "reactivation", "contraction", "churn"];

export const STEP_BASE_LABEL: Record<StepKey, string> = {
  start: "Starting",
  new: "New Business",
  expansion: "Expansion",
  reactivation: "Reactivation",
  contraction: "Contraction",
  churn: "Churn",
  end: "Ending",
};

export function metricNoun(metric: MetricId): string {
  return metric === "arr" ? "ARR" : "Seats";
}
export function stepLabel(step: StepKey, metric: MetricId): string {
  if (step === "start" || step === "end") return `${STEP_BASE_LABEL[step]} ${metricNoun(metric)}`;
  return STEP_BASE_LABEL[step];
}
export function formatMetric(metric: MetricId, n: number, compact = false): string {
  if (metric === "arr") return compact ? fmtUSDCompact(n) : fmtUSD(n);
  return compact ? fmtNum(n) : `${fmtNum(n)} seats`;
}
export function formatMetricSigned(metric: MetricId, n: number, compact = false): string {
  return fmtSigned(n, (v) => formatMetric(metric, v, compact));
}

export type BridgeKind = "anchor" | "positive" | "negative";

export type BridgeBar = {
  key: StepKey;
  label: string;
  kind: BridgeKind;
  signedValue: number; // + for anchors/positive deltas, - for negative deltas
  cumulativeBefore: number | null;
  cumulativeAfter: number;
};

export function buildBridge(period: PeriodId, metric: MetricId): BridgeBar[] {
  const d = BRIDGE_INPUT[period][metric];
  const bars: BridgeBar[] = [];
  let running = d.start;
  bars.push({ key: "start", label: stepLabel("start", metric), kind: "anchor", signedValue: d.start, cumulativeBefore: null, cumulativeAfter: d.start });

  const positives: DeltaStepKey[] = ["new", "expansion", "reactivation"];
  const negatives: DeltaStepKey[] = ["contraction", "churn"];

  for (const key of positives) {
    const before = running;
    running += d[key];
    bars.push({ key, label: stepLabel(key, metric), kind: "positive", signedValue: d[key], cumulativeBefore: before, cumulativeAfter: running });
  }
  for (const key of negatives) {
    const before = running;
    running -= d[key];
    bars.push({ key, label: stepLabel(key, metric), kind: "negative", signedValue: -d[key], cumulativeBefore: before, cumulativeAfter: running });
  }

  bars.push({ key: "end", label: stepLabel("end", metric), kind: "anchor", signedValue: d.end, cumulativeBefore: null, cumulativeAfter: d.end });
  return bars;
}

/* ---------------------------------------------------------------------- */
/* Driver breakdown — per-segment split of each delta step, exact subtotal */
/* ---------------------------------------------------------------------- */

/** Segment weights per delta step (fractions summing to 1). Growth steps skew Enterprise/Mid-Market; attrition steps skew SMB/Self-serve — a realistic SaaS pattern. Order matches SEGMENTS. */
const STEP_WEIGHTS: Record<DeltaStepKey, number[]> = {
  new: [0.4, 0.31, 0.18, 0.11],
  expansion: [0.46, 0.31, 0.15, 0.08],
  reactivation: [0.16, 0.32, 0.34, 0.18],
  contraction: [0.28, 0.28, 0.25, 0.19],
  churn: [0.18, 0.24, 0.31, 0.27],
};

/** Accounts affected per step, independent of the ARR/Seats metric toggle (same underlying customers either way). */
const ACCOUNTS_TOTAL: Record<PeriodId, Record<DeltaStepKey, number>> = {
  monthly: { new: 22, expansion: 15, reactivation: 9, contraction: 13, churn: 17 },
  quarterly: { new: 58, expansion: 41, reactivation: 24, contraction: 34, churn: 46 },
};

export type DriverStatus = "Strong" | "Steady" | "Elevated" | "Contained";

export type DriverRow = {
  id: string;
  step: DeltaStepKey;
  stepLabel: string;
  segmentId: SegmentId;
  segmentLabel: string;
  amount: number; // signed
  accounts: number;
  owner: { name: string; role: string; avatarId: string };
  status: DriverStatus;
  statusTone: "good" | "warn" | "neutral";
};

export function buildDriverRows(period: PeriodId, metric: MetricId): DriverRow[] {
  const d = BRIDGE_INPUT[period][metric];
  const accountsTotals = ACCOUNTS_TOTAL[period];
  const rows: DriverRow[] = [];

  for (const step of DELTA_STEPS) {
    const magnitude = d[step];
    const sign = step === "contraction" || step === "churn" ? -1 : 1;
    const roundTo = metric === "arr" ? 100 : 1;
    const amounts = splitExact(magnitude, STEP_WEIGHTS[step], roundTo).map((v) => v * sign);
    const accounts = splitExact(accountsTotals[step], STEP_WEIGHTS[step], 1);
    const avg = magnitude / SEGMENTS.length;

    SEGMENTS.forEach((seg, i) => {
      const amt = amounts[i];
      const isAttrition = sign < 0;
      const strong = Math.abs(amt) >= avg * 1.15;
      const status: DriverStatus = isAttrition ? (strong ? "Elevated" : "Contained") : strong ? "Strong" : "Steady";
      const statusTone: "good" | "warn" | "neutral" = isAttrition ? (strong ? "warn" : "neutral") : strong ? "good" : "neutral";
      rows.push({
        id: `${step}-${seg.id}`,
        step,
        stepLabel: STEP_BASE_LABEL[step],
        segmentId: seg.id,
        segmentLabel: seg.label,
        amount: amt,
        accounts: accounts[i],
        owner: SEGMENT_OWNERS[seg.id],
        status,
        statusTone,
      });
    });
  }
  return rows;
}

/* ---------------------------------------------------------------------- */
/* Top contributing accounts per step (for the detail rail)                */
/* ---------------------------------------------------------------------- */

const ACCOUNT_POOL: Record<DeltaStepKey, { name: string; weight: number }[]> = {
  new: [
    { name: "Norrix Systems", weight: 0.34 },
    { name: "Bluecrane Analytics", weight: 0.28 },
    { name: "Kestrel Freight", weight: 0.22 },
    { name: "Kingsley & Ito", weight: 0.16 },
  ],
  expansion: [
    { name: "Fenwick & Voss", weight: 0.38 },
    { name: "Optiq Health", weight: 0.26 },
    { name: "Marrow Logistics", weight: 0.2 },
    { name: "Selvedge Retail", weight: 0.16 },
  ],
  reactivation: [
    { name: "Anveil Media", weight: 0.33 },
    { name: "Brightloom Foods", weight: 0.27 },
    { name: "Haldor Robotics", weight: 0.23 },
    { name: "Correlate Labs", weight: 0.17 },
  ],
  contraction: [
    { name: "Driftwood Studios", weight: 0.31 },
    { name: "Palermo Textiles", weight: 0.27 },
    { name: "Vantage Clinics", weight: 0.24 },
    { name: "Nimbus Freight", weight: 0.18 },
  ],
  churn: [
    { name: "Cobblestone Realty", weight: 0.3 },
    { name: "Furlong Media", weight: 0.28 },
    { name: "Trellis Dental Group", weight: 0.24 },
    { name: "Ashgrove Interiors", weight: 0.18 },
  ],
};

export type AccountContribution = { name: string; amount: number };

export function buildAccountContributions(step: DeltaStepKey, period: PeriodId, metric: MetricId): AccountContribution[] {
  const d = BRIDGE_INPUT[period][metric];
  const sign = step === "contraction" || step === "churn" ? -1 : 1;
  const magnitude = d[step];
  const pool = ACCOUNT_POOL[step];
  const roundTo = metric === "arr" ? 100 : 1;
  const amounts = splitExact(
    magnitude,
    pool.map((p) => p.weight),
    roundTo,
  );
  return pool.map((p, i) => ({ name: p.name, amount: amounts[i] * sign }));
}

/** Largest-contributing segment for a delta step — used to pick which segment lead to show in the detail rail. */
export function leadSegmentFor(step: DeltaStepKey, period: PeriodId, metric: MetricId): SegmentId {
  const rows = buildDriverRows(period, metric).filter((r) => r.step === step);
  let best = rows[0];
  for (const r of rows) if (Math.abs(r.amount) > Math.abs(best.amount)) best = r;
  return best.segmentId;
}

/* ---------------------------------------------------------------------- */
/* Hero — trailing trend + supporting stats                                */
/* ---------------------------------------------------------------------- */

/** Trailing 6-period series, ending at the current period's ending value (chained to BRIDGE_INPUT). */
export const TREND: Record<PeriodId, Record<MetricId, number[]>> = {
  monthly: {
    arr: [4_455_000, 4_562_000, 4_650_000, 4_738_000, 4_820_000, 5_025_000],
    seats: [17_800, 18_150, 18_540, 18_900, 19_200, 20_000],
  },
  quarterly: {
    arr: [2_980_000, 3_320_000, 3_650_000, 3_940_000, 4_220_000, 4_820_000],
    seats: [13_400, 14_600, 15_550, 16_300, 17_000, 19_200],
  },
};
export const TREND_PERIOD_LABELS: Record<PeriodId, string[]> = {
  monthly: ["Feb", "Mar", "Apr", "May", "Jun", "Jul"],
  quarterly: ["Q1 '25", "Q2 '25", "Q3 '25", "Q4 '25", "Q1 '26", "Q2 '26"],
};

export type HeroStats = {
  endValue: number;
  netRetention: number; // (start + expansion + reactivation - contraction - churn) / start
  grossAttrition: number; // churn / start
  newContribution: number; // new / start
};

export function buildHeroStats(period: PeriodId, metric: MetricId): HeroStats {
  const d = BRIDGE_INPUT[period][metric];
  const netRetention = (d.start + d.expansion + d.reactivation - d.contraction - d.churn) / d.start;
  return {
    endValue: d.end,
    netRetention,
    grossAttrition: d.churn / d.start,
    newContribution: d.new / d.start,
  };
}
