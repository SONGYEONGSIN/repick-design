/**
 * Vela — deterministic dummy data for the growth-experimentation console.
 * No Math.random / Date.now / new Date() anywhere: the single "now" anchor is a fixed UTC
 * millisecond constant, and every per-day wiggle in the lift/forecast series comes from a fixed
 * two-term sine formula (coordinates rounded to 2 decimals, per the SVG-determinism convention).
 * Re-running this module always produces the exact same series and totals — derived aggregates
 * (participant totals, significance counts, sample splits) are always computed with
 * `.filter().length` / `.reduce()` from EXPERIMENTS, never hand-typed, so they cannot drift.
 */

import type { LucideIcon } from "lucide-react";
import { BarChart3, Boxes, FlaskConical, Settings2, ToggleLeft, TrendingUp, Users } from "lucide-react";
import type { ExperimentStatus, SignificanceState } from "./tokens";

export function round1(n: number): number {
  return Math.round(n * 10) / 10;
}
export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/* ------------------------------------------------------------------ Brand */

export const BRAND = { name: "Vela", tagline: "Experimentation Console" };

export function unsplashAvatar(id: string, size = 96): string {
  return `https://images.unsplash.com/photo-${id}?w=${size}&h=${size}&fit=crop&crop=faces`;
}

export type Workspace = { id: string; name: string; plan: string };
export const WORKSPACES: Workspace[] = [
  { id: "ws-northlane", name: "Northlane Growth", plan: "Team plan" },
  { id: "ws-sandbox", name: "Northlane Sandbox", plan: "Free plan" },
];

/** Fictional persona — never real session/operator data. */
export const CURRENT_USER = {
  name: "Marisol Fenn",
  role: "Growth Lead",
  email: "marisol.fenn@northlane.io",
  avatarId: "1502685104226-ee32379fefbe",
};

/* -------------------------------------------------------------- Global nav */

export type NavItem = { id: string; label: string; Icon: LucideIcon; active?: boolean; disabled?: boolean };
export type NavSection = { id: string; title: string; items: NavItem[] };

export const NAV_SECTIONS: NavSection[] = [
  {
    id: "experimentation",
    title: "Experimentation",
    items: [
      { id: "experiments", label: "Experiments", Icon: FlaskConical, active: true },
      { id: "audiences", label: "Audiences", Icon: Users, disabled: true },
      { id: "flags", label: "Feature flags", Icon: ToggleLeft, disabled: true },
    ],
  },
  {
    id: "insights",
    title: "Insights",
    items: [
      { id: "reports", label: "Reports", Icon: BarChart3, disabled: true },
      { id: "forecasts", label: "Forecast models", Icon: TrendingUp, disabled: true },
    ],
  },
  {
    id: "workspace",
    title: "Workspace",
    items: [
      { id: "integrations", label: "Integrations", Icon: Boxes, disabled: true },
      { id: "settings", label: "Settings", Icon: Settings2, disabled: true },
    ],
  },
];

/* ------------------------------------------------------------- Fixed "now" */

/** Fixed UTC anchor — never Date.now(). Every date in this module measures back/forward from this
 *  single constant, so the dataset is identical on every render and every machine. */
export const NOW_MS = Date.UTC(2026, 7, 16, 9, 0, 0);
const DAY_MS = 86_400_000;

const dateFmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
const dateFmtYear = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });

export function formatDate(ms: number): string {
  return dateFmt.format(new Date(ms));
}
export function formatDateYear(ms: number): string {
  return dateFmtYear.format(new Date(ms));
}

/* --------------------------------------------------------- Metric formatting */

export type MetricUnit = "percent" | "currency";

export function formatMetricValue(value: number, unit: MetricUnit): string {
  return unit === "currency" ? `$${value.toFixed(2)}` : `${value.toFixed(2)}%`;
}

export function formatLift(pct: number): string {
  const sign = pct > 0 ? "+" : "";
  return `${sign}${pct.toFixed(1)}%`;
}

export const numberFmt = new Intl.NumberFormat("en-US");

/* ---------------------------------------------------- Lift + confidence-band series */

export type SeriesPoint = { dateMs: number; lift: number; ciLow: number; ciHigh: number; kind: "actual" | "forecast" };

/** Deterministic two-term sine wiggle — bounded, reproducible, rounded to 2 decimals. */
function wiggle(i: number, phase: number): number {
  return round2(Math.sin((i + phase) * 0.63) * 0.5 + Math.sin((i + phase) * 1.31 + 1.1) * 0.25);
}

type SeriesSpec = {
  historyDays: number;
  phase: number;
  liftStart: number;
  liftEnd: number;
  bandStart: number;
  bandEnd: number;
  forecastLiftEnd: number;
  forecastBandEnd: number;
};

const FORECAST_DAYS: number = 14;

function buildSeries(spec: SeriesSpec): { history: SeriesPoint[]; forecast: SeriesPoint[] } {
  const { historyDays, phase, liftStart, liftEnd, bandStart, bandEnd, forecastLiftEnd, forecastBandEnd } = spec;

  const history: SeriesPoint[] = [];
  for (let i = 0; i < historyDays; i++) {
    const t = historyDays === 1 ? 1 : i / (historyDays - 1);
    const damp = 1 - t; // wiggle fades to exactly 0 at the most recent day, so liftEnd/bandEnd are exact
    const lift = round1(liftStart + (liftEnd - liftStart) * t + wiggle(i, phase) * damp);
    const band = round1(Math.max(0.3, bandStart + (bandEnd - bandStart) * t));
    const dateMs = NOW_MS - (historyDays - 1 - i) * DAY_MS;
    history.push({ dateMs, lift, ciLow: round1(lift - band), ciHigh: round1(lift + band), kind: "actual" });
  }

  const lastLift = history[history.length - 1].lift;
  const lastBand = round1(bandEnd);

  const forecast: SeriesPoint[] = [];
  for (let j = 0; j < FORECAST_DAYS; j++) {
    const tf = FORECAST_DAYS === 1 ? 1 : j / (FORECAST_DAYS - 1);
    const damp = 1 - tf;
    const lift = round1(lastLift + (forecastLiftEnd - lastLift) * tf + wiggle(historyDays + j, phase) * 0.6 * damp);
    const band = round1(lastBand + (forecastBandEnd - lastBand) * tf);
    const dateMs = NOW_MS + (j + 1) * DAY_MS;
    forecast.push({ dateMs, lift, ciLow: round1(lift - band), ciHigh: round1(lift + band), kind: "forecast" });
  }

  return { history, forecast };
}

export function significanceState(ciLow: number, ciHigh: number): SignificanceState {
  if (ciLow > 0) return "significant-positive";
  if (ciHigh < 0) return "significant-negative";
  return "not-yet";
}

/* ------------------------------------------------------------------ Experiments */

export type ExperimentId = "checkout-cta" | "onboarding-tooltip" | "pricing-hero" | "referral-incentive" | "digest-frequency" | "search-ranking";

export type Experiment = {
  id: ExperimentId;
  name: string;
  hypothesis: string;
  owner: string;
  metricLabel: string;
  metricUnit: MetricUnit;
  controlValue: number;
  status: ExperimentStatus;
  controlSample: number;
  variantSample: number;
  series: { history: SeriesPoint[]; forecast: SeriesPoint[] };
};

type ExperimentSeed = {
  id: ExperimentId;
  name: string;
  hypothesis: string;
  owner: string;
  metricLabel: string;
  metricUnit: MetricUnit;
  controlValue: number;
  status: ExperimentStatus;
  controlSample: number;
  variantSample: number;
  spec: SeriesSpec;
};

const EXPERIMENT_SEEDS: ExperimentSeed[] = [
  {
    id: "checkout-cta",
    name: "Checkout CTA copy",
    hypothesis: "A benefit-led button label reduces last-step drop-off.",
    owner: "Priya Nathan",
    metricLabel: "Checkout conversion rate",
    metricUnit: "percent",
    controlValue: 3.62,
    status: "running",
    controlSample: 18420,
    variantSample: 18512,
    spec: { historyDays: 42, phase: 0, liftStart: 0.3, liftEnd: 8.4, bandStart: 9.0, bandEnd: 2.1, forecastLiftEnd: 9.1, forecastBandEnd: 3.4 },
  },
  {
    id: "onboarding-tooltip",
    name: "Onboarding tooltip sequence",
    hypothesis: "Progressive tooltips on the first three screens lift Day-1 activation.",
    owner: "Devon Ariza",
    metricLabel: "Activation rate (Day-1)",
    metricUnit: "percent",
    controlValue: 41.8,
    status: "running",
    controlSample: 4210,
    variantSample: 4185,
    spec: { historyDays: 16, phase: 3, liftStart: -0.4, liftEnd: 2.1, bandStart: 9.5, bandEnd: 4.6, forecastLiftEnd: 2.6, forecastBandEnd: 6.0 },
  },
  {
    id: "pricing-hero",
    name: "Pricing page hero rewrite",
    hypothesis: "Leading with the annual price anchors visitors to a higher plan.",
    owner: "Sana Kwerel",
    metricLabel: "Revenue per visitor",
    metricUnit: "currency",
    controlValue: 2.14,
    status: "running",
    controlSample: 9120,
    variantSample: 9052,
    spec: { historyDays: 28, phase: 6, liftStart: 0.2, liftEnd: -3.6, bandStart: 8.8, bandEnd: 1.9, forecastLiftEnd: -3.9, forecastBandEnd: 3.0 },
  },
  {
    id: "referral-incentive",
    name: "Referral incentive amount",
    hypothesis: "Doubling the referral credit increases completed invites.",
    owner: "Priya Nathan",
    metricLabel: "Referral signup rate",
    metricUnit: "percent",
    controlValue: 6.05,
    status: "concluded",
    controlSample: 26400,
    variantSample: 26355,
    spec: { historyDays: 60, phase: 9, liftStart: 0.5, liftEnd: 5.6, bandStart: 8.5, bandEnd: 1.3, forecastLiftEnd: 5.7, forecastBandEnd: 2.2 },
  },
  {
    id: "digest-frequency",
    name: "Email digest frequency",
    hypothesis: "A twice-weekly digest keeps lapsed users engaged without fatigue.",
    owner: "Owen Petts",
    metricLabel: "Day-7 retention",
    metricUnit: "percent",
    controlValue: 28.4,
    status: "running",
    controlSample: 6030,
    variantSample: 5978,
    spec: { historyDays: 24, phase: 12, liftStart: -0.2, liftEnd: 1.0, bandStart: 9.2, bandEnd: 5.3, forecastLiftEnd: 1.4, forecastBandEnd: 6.8 },
  },
  {
    id: "search-ranking",
    name: "Search ranking algorithm v2",
    hypothesis: "Boosting recency in the ranking function improves result relevance.",
    owner: "Devon Ariza",
    metricLabel: "Search result CTR",
    metricUnit: "percent",
    controlValue: 12.9,
    status: "running",
    controlSample: 14200,
    variantSample: 14260,
    spec: { historyDays: 35, phase: 15, liftStart: 0.6, liftEnd: 4.3, bandStart: 8.7, bandEnd: 1.8, forecastLiftEnd: 4.6, forecastBandEnd: 3.1 },
  },
];

export const EXPERIMENTS: Experiment[] = EXPERIMENT_SEEDS.map((seed) => ({
  id: seed.id,
  name: seed.name,
  hypothesis: seed.hypothesis,
  owner: seed.owner,
  metricLabel: seed.metricLabel,
  metricUnit: seed.metricUnit,
  controlValue: seed.controlValue,
  status: seed.status,
  controlSample: seed.controlSample,
  variantSample: seed.variantSample,
  series: buildSeries(seed.spec),
}));

export const EXPERIMENT_BY_ID: Record<ExperimentId, Experiment> = Object.fromEntries(EXPERIMENTS.map((e) => [e.id, e])) as Record<ExperimentId, Experiment>;

export function totalSample(e: Experiment): number {
  return e.controlSample + e.variantSample;
}

export function currentLift(e: Experiment): number {
  return e.series.history[e.series.history.length - 1].lift;
}

export function currentCi(e: Experiment): { ciLow: number; ciHigh: number } {
  const last = e.series.history[e.series.history.length - 1];
  return { ciLow: last.ciLow, ciHigh: last.ciHigh };
}

export function variantValue(e: Experiment): number {
  return round2(e.controlValue * (1 + currentLift(e) / 100));
}

export function startedMs(e: Experiment): number {
  return e.series.history[0].dateMs;
}

/* -------------------------------------------------------------- Portfolio aggregates */

export const TOTAL_PARTICIPANTS = EXPERIMENTS.reduce((sum, e) => sum + totalSample(e), 0);
export const SIGNIFICANT_COUNT = EXPERIMENTS.filter((e) => {
  const { ciLow, ciHigh } = currentCi(e);
  return significanceState(ciLow, ciHigh) !== "not-yet";
}).length;
export const RUNNING_COUNT = EXPERIMENTS.filter((e) => e.status === "running").length;

/* -------------------------------------------------------------------- Live traffic ticker */

/** Fixed 12-tick deterministic sequence — the live mini-chart cycles through these, it never
 *  invents a value. Sessions/minute for the currently selected experiment's variant surface. */
export const TRAFFIC_TICKS: number[] = [412, 438, 405, 461, 477, 450, 483, 470, 495, 459, 486, 501];

/* -------------------------------------------------------------------- Command palette */

export type QuickView = { id: string; label: string; Icon: LucideIcon; targetId: string };
export const QUICK_VIEWS: QuickView[] = [
  { id: "chart", label: "Jump to lift forecast", Icon: TrendingUp, targetId: "forecast-chart-card" },
  { id: "compare", label: "Jump to variant comparison", Icon: FlaskConical, targetId: "compare-card" },
  { id: "table", label: "Jump to all experiments", Icon: BarChart3, targetId: "experiments-table-card" },
];
