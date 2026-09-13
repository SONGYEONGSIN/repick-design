import { AlertOctagon, AlertTriangle, Building2, CheckCircle2, ClipboardCheck, FileWarning, Gauge, History, type LucideIcon } from "lucide-react";

// ---------------------------------------------------------------------------
// Rounding + small numeric helpers. No Math.random / Date.now / new Date()
// anywhere in this file — every "random-looking" number below is produced by
// a fixed lookup table (NOISE) combined with a plain arithmetic formula, so
// the exact same output is produced on every render and every environment.
// ---------------------------------------------------------------------------
export function r1(n: number): number {
  return Math.round(n * 10) / 10;
}
export function r2(n: number): number {
  return Math.round(n * 100) / 100;
}
function clamp(n: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, n));
}

// ---------------------------------------------------------------------------
// Deterministic calendar arithmetic. ANCHOR is "yesterday" relative to the
// console's in-universe today (2026-09-13) so no row is dated same-day as a
// live clock would report. subtractDays walks backward through a fixed
// month-length table — it never touches `Date`/`Date.now`.
// ---------------------------------------------------------------------------
const ANCHOR = { y: 2026, m: 9, d: 12 };
const MONTH_DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const MONTH_ABBR = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function subtractDays(days: number): { y: number; m: number; d: number } {
  let { y, m, d } = ANCHOR;
  d -= days;
  while (d < 1) {
    m -= 1;
    if (m < 1) {
      m = 12;
      y -= 1;
    }
    d += MONTH_DAYS[m - 1];
  }
  return { y, m, d };
}

export function shortDate(daysAgo: number): string {
  if (daysAgo === 0) return "Today";
  if (daysAgo === 1) return "Yesterday";
  const { m, d } = subtractDays(daysAgo);
  return `${MONTH_ABBR[m - 1]} ${d}`;
}

export function isoDate(daysAgo: number): string {
  const { y, m, d } = subtractDays(daysAgo);
  return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

export function formatInt(n: number): string {
  return new Intl.NumberFormat("en-US").format(n);
}

// ---------------------------------------------------------------------------
// Brand / shell
// ---------------------------------------------------------------------------
export const BRAND = { name: "Auditlane", Icon: ClipboardCheck };

export const CURRENT_USER = {
  name: "Priya Bhatt",
  role: "Senior quality analyst",
  email: "priya.bhatt@auditlane.io",
  avatarId: "1502685104226-ee32379fefbe",
};

export const WORKSPACES = [
  { id: "electronics", name: "Consumer electronics BU", plan: "6 suppliers" },
  { id: "industrial", name: "Industrial components BU", plan: "11 suppliers" },
  { id: "apac", name: "APAC sourcing office", plan: "18 suppliers" },
];

export interface NavItem {
  id: string;
  label: string;
  Icon: LucideIcon;
  active?: boolean;
  disabled?: boolean;
}
export const NAV_SECTIONS: { id: string; title: string; items: NavItem[] }[] = [
  {
    id: "work",
    title: "Work",
    items: [
      { id: "inspections", label: "Inspections", Icon: ClipboardCheck, active: true },
      { id: "suppliers", label: "Supplier directory", Icon: Building2 },
      { id: "findings", label: "Open findings", Icon: FileWarning },
    ],
  },
  {
    id: "insight",
    title: "Insight",
    items: [
      { id: "rubric", label: "Scoring rubric", Icon: Gauge },
      { id: "audit", label: "Audit trail", Icon: History, disabled: true },
    ],
  },
];

// ---------------------------------------------------------------------------
// Inspectors — a fixed pool, picked by index (never by a random draw).
// ---------------------------------------------------------------------------
export interface Inspector {
  name: string;
  avatarId: string;
}
export const INSPECTORS: Inspector[] = [
  { name: "Priya Nandakumar", avatarId: "1519085360753-af0119f7cbe7" },
  { name: "Marcus Oyelaran", avatarId: "1472099645785-5658abf4ff4e" },
  { name: "Elin Vasko", avatarId: "1487412720507-e7ab37603c6f" },
  { name: "Tomas Reyes", avatarId: "1438761681033-6461ffad8d80" },
  { name: "Andrea Kessling", avatarId: "1553062407-98eeb64c6a62" },
];

// ---------------------------------------------------------------------------
// Fixed deterministic "noise" lookup — stands in for sampling variance
// without ever calling Math.random. Same array in, same numbers out, always.
// ---------------------------------------------------------------------------
const NOISE: number[] = [3.2, -4.6, 1.8, 6.1, -2.4, 5.0, -6.8, 0.6, 4.4, -3.9, 2.7, -1.1, 5.6, -5.2, 1.3, -0.4, 3.8, -4.1, 2.2, -2.9];

// ---------------------------------------------------------------------------
// Time windows
// ---------------------------------------------------------------------------
export type Period = "7D" | "30D" | "90D";
export const PERIODS: Period[] = ["7D", "30D", "90D"];
export const PERIOD_WINDOW: Record<Period, number> = { "7D": 7, "30D": 30, "90D": 90 };
export const PERIOD_LABEL: Record<Period, string> = { "7D": "Last 7 days", "30D": "Last 30 days", "90D": "Last 90 days" };

// ---------------------------------------------------------------------------
// Supplier cohorts — the left-rail rows. Each carries three independent
// period profiles (center + spread for the generator below); Northfield's
// center drifts up as the window narrows (a real recent-worsening supplier),
// Kessler carries one isolated override rather than a shifted center (a
// single bad incident, not a systemic drift) — the two read differently once
// charted, which is the point of keeping this as data rather than a knob.
// ---------------------------------------------------------------------------
export interface PeriodConfig {
  n: number;
  median: number;
  spread: number;
  durationBase: number;
  durationSpread: number;
  overrides?: { i: number; severity: number }[];
}
export interface SupplierProfile {
  id: string;
  name: string;
  region: string;
  category: string;
  seed: number;
  periods: Record<Period, PeriodConfig>;
}

export const SUPPLIERS: SupplierProfile[] = [
  {
    id: "solmark",
    name: "Solmark Fabrication",
    region: "APAC",
    category: "Metal stamping",
    seed: 2,
    periods: {
      "7D": { n: 5, median: 14, spread: 10, durationBase: 26, durationSpread: 10 },
      "30D": { n: 13, median: 16, spread: 12, durationBase: 27, durationSpread: 11 },
      "90D": { n: 24, median: 18, spread: 13, durationBase: 28, durationSpread: 12 },
    },
  },
  {
    id: "vireo",
    name: "Vireo Components",
    region: "EMEA",
    category: "Electronics assembly",
    seed: 5,
    periods: {
      "7D": { n: 6, median: 23, spread: 14, durationBase: 33, durationSpread: 12 },
      "30D": { n: 15, median: 24, spread: 16, durationBase: 34, durationSpread: 13 },
      "90D": { n: 26, median: 22, spread: 15, durationBase: 33, durationSpread: 13 },
    },
  },
  {
    id: "northfield",
    name: "Northfield Alloys",
    region: "Americas",
    category: "Precision casting",
    seed: 9,
    periods: {
      "7D": { n: 5, median: 58, spread: 22, durationBase: 41, durationSpread: 16, overrides: [{ i: 1, severity: 94.6 }] },
      "30D": { n: 14, median: 49, spread: 21, durationBase: 39, durationSpread: 15, overrides: [{ i: 2, severity: 94.6 }, { i: 9, severity: 88.3 }] },
      "90D": { n: 25, median: 41, spread: 19, durationBase: 37, durationSpread: 14, overrides: [{ i: 2, severity: 94.6 }, { i: 13, severity: 88.3 }] },
    },
  },
  {
    id: "corrigan",
    name: "Corrigan Textiles",
    region: "Americas",
    category: "Technical fabrics",
    seed: 12,
    periods: {
      "7D": { n: 4, median: 19, spread: 9, durationBase: 24, durationSpread: 8 },
      "30D": { n: 12, median: 20, spread: 11, durationBase: 25, durationSpread: 9 },
      "90D": { n: 22, median: 21, spread: 12, durationBase: 26, durationSpread: 10 },
    },
  },
  {
    id: "kessler",
    name: "Kessler Optics",
    region: "EMEA",
    category: "Precision optics",
    seed: 16,
    periods: {
      "7D": { n: 6, median: 34, spread: 20, durationBase: 45, durationSpread: 14, overrides: [{ i: 0, severity: 81.9 }] },
      "30D": { n: 16, median: 30, spread: 18, durationBase: 44, durationSpread: 13, overrides: [{ i: 4, severity: 81.9 }] },
      "90D": { n: 27, median: 28, spread: 17, durationBase: 43, durationSpread: 13, overrides: [{ i: 6, severity: 81.9 }] },
    },
  },
  {
    id: "tallow",
    name: "Tallow Ridge Materials",
    region: "APAC",
    category: "Polymer molding",
    seed: 20,
    periods: {
      "7D": { n: 5, median: 27, spread: 13, durationBase: 31, durationSpread: 11 },
      "30D": { n: 13, median: 26, spread: 15, durationBase: 32, durationSpread: 12 },
      "90D": { n: 23, median: 25, spread: 16, durationBase: 32, durationSpread: 12 },
    },
  },
];

// ---------------------------------------------------------------------------
// Individual inspection records, generated from the profiles above.
// ---------------------------------------------------------------------------
export type InspectionStatus = "pass" | "watch" | "flagged";
export interface InspectionRecord {
  id: string;
  daysAgo: number;
  severity: number;
  duration: number;
  inspectorIdx: number;
  status: InspectionStatus;
}

function statusOf(severity: number): InspectionStatus {
  if (severity >= 55) return "flagged";
  if (severity >= 25) return "watch";
  return "pass";
}

function generateRecords(profile: SupplierProfile, period: Period): InspectionRecord[] {
  const cfg = profile.periods[period];
  const window = PERIOD_WINDOW[period];
  const records: InspectionRecord[] = [];
  for (let i = 0; i < cfg.n; i++) {
    const spreadFrac = cfg.n === 1 ? 0 : i / (cfg.n - 1);
    const jitter = NOISE[(profile.seed + i * 3) % NOISE.length];
    const daysAgo = clamp(Math.round(spreadFrac * (window - 1) + jitter / 4), 0, window - 1);

    const noiseS = NOISE[(profile.seed + i) % NOISE.length];
    let severity = r1(clamp(cfg.median + (noiseS * cfg.spread) / 6, 1, 99));
    const override = cfg.overrides?.find((o) => o.i === i);
    if (override) severity = override.severity;

    const noiseD = NOISE[(profile.seed + i + 7) % NOISE.length];
    const duration = Math.round(clamp(cfg.durationBase + (noiseD * cfg.durationSpread) / 6, 8, 180));

    records.push({
      id: `${profile.id}-${period}-${i}`,
      daysAgo,
      severity,
      duration,
      inspectorIdx: (profile.seed + i) % INSPECTORS.length,
      status: statusOf(severity),
    });
  }
  records.sort((a, b) => a.daysAgo - b.daysAgo);
  return records;
}

// ---------------------------------------------------------------------------
// Box-plot statistics (Tukey method: linear-interpolated quartiles, 1.5×IQR
// fences). Pure function over an already-deterministic array.
// ---------------------------------------------------------------------------
export interface BoxStats {
  n: number;
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
  iqr: number;
  whiskerLow: number;
  whiskerHigh: number;
  outliers: number[];
}

export function quantile(sorted: number[], p: number): number {
  if (sorted.length === 1) return sorted[0];
  const idx = (sorted.length - 1) * p;
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  if (lo === hi) return sorted[lo];
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (idx - lo);
}

export function computeBoxStats(values: number[]): BoxStats {
  const sorted = [...values].sort((a, b) => a - b);
  const q1 = r1(quantile(sorted, 0.25));
  const median = r1(quantile(sorted, 0.5));
  const q3 = r1(quantile(sorted, 0.75));
  const iqr = r1(q3 - q1);
  const lowFence = q1 - 1.5 * iqr;
  const highFence = q3 + 1.5 * iqr;
  const inliers = sorted.filter((v) => v >= lowFence && v <= highFence);
  const outliers = sorted.filter((v) => v < lowFence || v > highFence).map(r1);
  return {
    n: sorted.length,
    min: r1(sorted[0]),
    q1,
    median,
    q3,
    max: r1(sorted[sorted.length - 1]),
    iqr,
    whiskerLow: r1(inliers.length ? inliers[0] : sorted[0]),
    whiskerHigh: r1(inliers.length ? inliers[inliers.length - 1] : sorted[sorted.length - 1]),
    outliers,
  };
}

// ---------------------------------------------------------------------------
// Precomputed tables — built once at module load from the pure functions
// above, so every component reads the same numbers with no recomputation.
// ---------------------------------------------------------------------------
function buildRecords(): Record<string, Record<Period, InspectionRecord[]>> {
  const table = {} as Record<string, Record<Period, InspectionRecord[]>>;
  for (const profile of SUPPLIERS) {
    table[profile.id] = {} as Record<Period, InspectionRecord[]>;
    for (const period of PERIODS) {
      table[profile.id][period] = generateRecords(profile, period);
    }
  }
  return table;
}
export const RECORDS = buildRecords();

function buildBoxStats(): Record<string, Record<Period, BoxStats>> {
  const table = {} as Record<string, Record<Period, BoxStats>>;
  for (const profile of SUPPLIERS) {
    table[profile.id] = {} as Record<Period, BoxStats>;
    for (const period of PERIODS) {
      table[profile.id][period] = computeBoxStats(RECORDS[profile.id][period].map((r) => r.severity));
    }
  }
  return table;
}
export const BOX_STATS = buildBoxStats();

export interface OrgTotals {
  inspections: number;
  medianSeverity: number;
  atRiskSuppliers: number;
  flaggedRecords: number;
}
function buildOrgTotals(): Record<Period, OrgTotals> {
  const table = {} as Record<Period, OrgTotals>;
  for (const period of PERIODS) {
    let inspections = 0;
    let flaggedRecords = 0;
    let atRiskSuppliers = 0;
    const pooled: number[] = [];
    for (const profile of SUPPLIERS) {
      const recs = RECORDS[profile.id][period];
      inspections += recs.length;
      flaggedRecords += recs.filter((r) => r.status === "flagged").length;
      pooled.push(...recs.map((r) => r.severity));
      if (BOX_STATS[profile.id][period].median >= 45) atRiskSuppliers += 1;
    }
    pooled.sort((a, b) => a - b);
    table[period] = { inspections, medianSeverity: r1(quantile(pooled, 0.5)), atRiskSuppliers, flaggedRecords };
  }
  return table;
}
export const ORG_TOTALS = buildOrgTotals();

// ---------------------------------------------------------------------------
// Supplier-level risk tier, derived from the same computed median — not a
// separate hand-set field, so a period change can move a supplier's tier.
// ---------------------------------------------------------------------------
export type RiskTier = "steady" | "elevated" | "at-risk";
export function riskTierOf(median: number): RiskTier {
  if (median >= 45) return "at-risk";
  if (median >= 25) return "elevated";
  return "steady";
}
export const TIER_LABEL: Record<RiskTier, string> = { steady: "Steady", elevated: "Elevated", "at-risk": "At risk" };
export const TIER_BADGE: Record<RiskTier, string> = {
  steady: "border-emerald-200 bg-emerald-50 text-emerald-700",
  elevated: "border-amber-200 bg-amber-50 text-amber-800",
  "at-risk": "border-rose-200 bg-rose-50 text-rose-700",
};
export const TIER_ICON: Record<RiskTier, LucideIcon> = { steady: CheckCircle2, elevated: AlertTriangle, "at-risk": AlertOctagon };

export const STATUS_LABEL: Record<InspectionStatus, string> = { pass: "Pass", watch: "Watch", flagged: "Flagged" };
export const STATUS_BADGE: Record<InspectionStatus, string> = {
  pass: "border-emerald-200 bg-emerald-50 text-emerald-700",
  watch: "border-amber-200 bg-amber-50 text-amber-800",
  flagged: "border-rose-200 bg-rose-50 text-rose-700",
};
export const STATUS_ICON: Record<InspectionStatus, LucideIcon> = { pass: CheckCircle2, watch: AlertTriangle, flagged: AlertOctagon };

export const SEARCH_ENTRIES = SUPPLIERS.map((s) => ({ id: s.id, title: s.name, meta: `${s.region} · ${s.category}`, Icon: Building2 }));
