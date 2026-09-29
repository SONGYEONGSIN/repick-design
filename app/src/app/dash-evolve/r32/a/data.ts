// Deterministic dummy data for the Tripwire fraud & dispute signal wall.
// No Math.random / Date.now / argument-less `new Date()` anywhere in this module — every
// number and date label is produced by a fixed arithmetic formula keyed on stable indices, so
// server and client renders always agree (hydration-safe) and re-renders never drift.

export type Category = "Payments" | "Trust & Safety" | "Logistics" | "Account Security";
export type Window = 7 | 30 | 90;
export type CaseStatus = "open" | "investigating" | "escalated";
export type BreakdownAxis = "region" | "cohort" | "category";

export interface SeriesPoint {
  day: number; // 0..89, 89 = most recent
  value: number;
}

export interface Signal {
  id: string;
  name: string;
  category: Category;
  unit: string;
  description: string;
  threshold: number;
  decimals: number;
  breakdownAxis: BreakdownAxis;
  series: SeriesPoint[];
}

export interface BreakdownRow {
  label: string;
  share: number; // 0..100, sums to 100 across the 4 rows for a signal
}

export interface CaseRow {
  id: string;
  title: string;
  status: CaseStatus;
  openedDaysAgo: number;
}

const round2 = (n: number) => Math.round(n * 100) / 100;

// ---------------------------------------------------------------------------
// Calendar labels without a Date object — pure arithmetic walk from a fixed epoch.
// ---------------------------------------------------------------------------

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTH_LENGTHS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const START_MONTH_INDEX = 5; // fixed epoch: "Jun 1" — day index 0 of every series
const START_DAY = 1;

export function dateLabel(dayIndex: number): string {
  let monthIdx = START_MONTH_INDEX;
  let day = START_DAY + dayIndex;
  while (day > MONTH_LENGTHS[monthIdx]) {
    day -= MONTH_LENGTHS[monthIdx];
    monthIdx = (monthIdx + 1) % 12;
  }
  return `${MONTH_NAMES[monthIdx]} ${day}`;
}

// ---------------------------------------------------------------------------
// Signal series generator — two slow sine waves (a base drift and a faster wobble) plus zero or
// more bell-shaped "spike windows" that push a signal over its threshold for a stretch of days.
// ---------------------------------------------------------------------------

interface SpikeWindow {
  start: number;
  end: number;
  amount: number;
}

interface SignalSeed {
  id: string;
  name: string;
  category: Category;
  unit: string;
  description: string;
  threshold: number;
  decimals: number;
  breakdownAxis: BreakdownAxis;
  base: number;
  ampA: number;
  freqA: number;
  phaseA: number;
  ampB: number;
  freqB: number;
  phaseB: number;
  spikes: SpikeWindow[];
}

function buildSeries(seed: SignalSeed): SeriesPoint[] {
  const points: SeriesPoint[] = [];
  for (let day = 0; day < 90; day++) {
    const wave1 = seed.ampA * Math.sin((day + seed.phaseA) * seed.freqA);
    const wave2 = seed.ampB * Math.sin((day + seed.phaseB) * seed.freqB);
    let spike = 0;
    for (const s of seed.spikes) {
      if (day >= s.start && day <= s.end) {
        spike += s.amount * Math.sin((Math.PI * (day - s.start)) / (s.end - s.start));
      }
    }
    const value = Math.max(0, seed.base + wave1 + wave2 + spike);
    points.push({ day, value: round2(value) });
  }
  return points;
}

const SIGNAL_SEEDS: SignalSeed[] = [
  {
    id: "chargeback-rate",
    name: "Chargeback rate",
    category: "Payments",
    unit: "%",
    description: "Share of completed orders disputed as a card chargeback.",
    threshold: 1.1,
    decimals: 2,
    breakdownAxis: "cohort",
    base: 0.62, ampA: 0.08, freqA: 0.22, phaseA: 2, ampB: 0.04, freqB: 0.09, phaseB: 5,
    spikes: [{ start: 70, end: 84, amount: 0.62 }],
  },
  {
    id: "payment-decline-rate",
    name: "Payment-decline rate",
    category: "Payments",
    unit: "%",
    description: "Share of checkout attempts declined by the card processor.",
    threshold: 5.8,
    decimals: 2,
    breakdownAxis: "region",
    base: 4.1, ampA: 0.3, freqA: 0.18, phaseA: 1, ampB: 0.15, freqB: 0.07, phaseB: 3,
    spikes: [],
  },
  {
    id: "counterfeit-report-rate",
    name: "Counterfeit-report rate",
    category: "Trust & Safety",
    unit: "per 1k listings",
    description: "Buyer reports of suspected counterfeit goods, per 1,000 live listings.",
    threshold: 3.4,
    decimals: 2,
    breakdownAxis: "category",
    base: 2.3, ampA: 0.25, freqA: 0.2, phaseA: 4, ampB: 0.12, freqB: 0.11, phaseB: 2,
    spikes: [{ start: 36, end: 50, amount: 1.7 }],
  },
  {
    id: "prohibited-item-flag-rate",
    name: "Prohibited-item flag rate",
    category: "Trust & Safety",
    unit: "per 1k listings",
    description: "Listings auto-flagged for prohibited or restricted goods, per 1,000 live listings.",
    threshold: 2.6,
    decimals: 2,
    breakdownAxis: "category",
    base: 1.5, ampA: 0.2, freqA: 0.25, phaseA: 0, ampB: 0.1, freqB: 0.08, phaseB: 6,
    spikes: [],
  },
  {
    id: "buyer-seller-dispute-rate",
    name: "Buyer-seller dispute rate",
    category: "Trust & Safety",
    unit: "per 1k orders",
    description: "Orders escalated to a buyer-seller dispute, per 1,000 completed orders.",
    threshold: 9.5,
    decimals: 2,
    breakdownAxis: "cohort",
    base: 6.8, ampA: 0.5, freqA: 0.19, phaseA: 3, ampB: 0.25, freqB: 0.1, phaseB: 1,
    spikes: [
      { start: 12, end: 24, amount: 2.6 },
      { start: 64, end: 76, amount: 2.2 },
    ],
  },
  {
    id: "late-shipment-rate",
    name: "Late-shipment rate",
    category: "Logistics",
    unit: "%",
    description: "Share of orders shipped after the promised ship-by date.",
    threshold: 7.8,
    decimals: 2,
    breakdownAxis: "region",
    base: 5.4, ampA: 0.4, freqA: 0.21, phaseA: 5, ampB: 0.2, freqB: 0.09, phaseB: 2,
    spikes: [],
  },
  {
    id: "lost-in-transit-rate",
    name: "Lost-in-transit rate",
    category: "Logistics",
    unit: "%",
    description: "Share of shipments never confirmed delivered by the carrier.",
    threshold: 1.35,
    decimals: 2,
    breakdownAxis: "region",
    base: 0.85, ampA: 0.09, freqA: 0.23, phaseA: 1, ampB: 0.05, freqB: 0.12, phaseB: 4,
    spikes: [{ start: 52, end: 66, amount: 0.68 }],
  },
  {
    id: "fake-tracking-rate",
    name: "Fake-tracking-number rate",
    category: "Logistics",
    unit: "per 1k shipments",
    description: "Tracking numbers flagged invalid or non-carrier, per 1,000 shipments.",
    threshold: 2.0,
    decimals: 2,
    breakdownAxis: "cohort",
    base: 1.1, ampA: 0.15, freqA: 0.24, phaseA: 2, ampB: 0.08, freqB: 0.1, phaseB: 0,
    spikes: [],
  },
  {
    id: "account-takeover-rate",
    name: "Account-takeover attempt rate",
    category: "Account Security",
    unit: "per 10k logins",
    description: "Login attempts flagged as a likely account-takeover attempt, per 10,000 logins.",
    threshold: 5.5,
    decimals: 2,
    breakdownAxis: "region",
    base: 3.6, ampA: 0.4, freqA: 0.2, phaseA: 6, ampB: 0.2, freqB: 0.1, phaseB: 3,
    spikes: [{ start: 74, end: 88, amount: 2.9 }],
  },
  {
    id: "multi-account-signup-rate",
    name: "Multi-account signup rate",
    category: "Account Security",
    unit: "per 1k signups",
    description: "New signups linked to an existing suspended account, per 1,000 signups.",
    threshold: 7.0,
    decimals: 2,
    breakdownAxis: "region",
    base: 4.9, ampA: 0.35, freqA: 0.17, phaseA: 4, ampB: 0.18, freqB: 0.08, phaseB: 5,
    spikes: [{ start: 28, end: 42, amount: 2.7 }],
  },
];

export const SIGNALS: Signal[] = SIGNAL_SEEDS.map((seed) => ({
  id: seed.id,
  name: seed.name,
  category: seed.category,
  unit: seed.unit,
  description: seed.description,
  threshold: seed.threshold,
  decimals: seed.decimals,
  breakdownAxis: seed.breakdownAxis,
  series: buildSeries(seed),
}));

export const CATEGORIES: Category[] = ["Payments", "Trust & Safety", "Logistics", "Account Security"];

export function visibleSlice(series: SeriesPoint[], windowDays: Window): SeriesPoint[] {
  return series.slice(series.length - windowDays);
}

export function latestValue(signal: Signal): number {
  return signal.series[signal.series.length - 1].value;
}

export function isAnomalous(signal: Signal, point: SeriesPoint): boolean {
  return point.value >= signal.threshold;
}

// A signal counts as "elevated" when it has crossed its threshold at any point in the trailing
// 30 days — a fixed operational lookback, independent of whatever window the wall's period
// toggle is currently showing, so the status badge never flickers as the person changes that
// control.
const ELEVATED_LOOKBACK_DAYS = 30;

export function isCurrentlyElevated(signal: Signal): boolean {
  return signal.series.slice(signal.series.length - ELEVATED_LOOKBACK_DAYS).some((p) => p.value >= signal.threshold);
}

export function anomalyCount(signal: Signal): number {
  return signal.series.filter((p) => isAnomalous(signal, p)).length;
}

// ---------------------------------------------------------------------------
// Root-cause breakdown — deterministic pseudo-split across a fixed label set, keyed on a simple
// character-code seed derived from the signal id (still no Math.random).
// ---------------------------------------------------------------------------

const BREAKDOWN_LABELS: Record<BreakdownAxis, string[]> = {
  region: ["US-West", "US-East", "EU", "APAC"],
  cohort: ["New sellers (<30d)", "Power sellers", "Unverified sellers", "Repeat offenders"],
  category: ["Sneakers", "Streetwear", "Electronics", "Designer bags"],
};

function idSeed(id: string): number {
  let sum = 0;
  for (let i = 0; i < id.length; i++) sum += id.charCodeAt(i) * (i + 1);
  return sum;
}

export function breakdownFor(signal: Signal): BreakdownRow[] {
  const labels = BREAKDOWN_LABELS[signal.breakdownAxis];
  const seed = idSeed(signal.id);
  const raw = labels.map((_, i) => 1 + Math.abs(Math.sin(seed * 0.037 + i * 1.9)) * 3.2);
  const total = raw.reduce((a, b) => a + b, 0);
  const shares = raw.map((r) => Math.round((r / total) * 100));
  const diff = 100 - shares.reduce((a, b) => a + b, 0);
  shares[0] += diff; // fold rounding remainder into the largest-seeded row
  return labels
    .map((label, i) => ({ label, share: shares[i] }))
    .sort((a, b) => b.share - a.share);
}

// ---------------------------------------------------------------------------
// Related open cases — count and content derived from each signal's anomaly count, so a clean
// signal legitimately shows zero cases instead of a padded fake list.
// ---------------------------------------------------------------------------

// Deliberately not rank-monotonic with the age cycle below, so sorting a signal's case list by
// status visibly reorders it instead of just mirroring the "opened" column's order.
const CASE_STATUS_CYCLE: CaseStatus[] = ["investigating", "escalated", "open", "escalated"];
const CASE_AGE_CYCLE = [2, 5, 9, 14];

export function casesFor(signal: Signal): CaseRow[] {
  const days = anomalyCount(signal);
  const count = days === 0 ? 0 : Math.min(4, Math.max(1, Math.ceil(days / 3)));
  if (count === 0) return [];
  const top = breakdownFor(signal)[0];
  const seed = idSeed(signal.id);
  const caseNumberBase = 4000 + (seed % 900);
  return Array.from({ length: count }, (_, i) => ({
    id: `CASE-${caseNumberBase + i * 3}`,
    title: `${signal.name} spike — ${top.label}`,
    status: CASE_STATUS_CYCLE[(i + seed) % CASE_STATUS_CYCLE.length],
    openedDaysAgo: CASE_AGE_CYCLE[i % CASE_AGE_CYCLE.length] + (seed % 3),
  }));
}

export function formatValue(signal: Signal, value: number): string {
  return value.toFixed(signal.decimals);
}

// "%" reads correctly with no space ("1.10%"); every other unit here is a word phrase and needs
// one ("6.80 per 1k orders").
export function formatWithUnit(signal: Signal, value: number): string {
  const formatted = formatValue(signal, value);
  return signal.unit === "%" ? `${formatted}%` : `${formatted} ${signal.unit}`;
}
