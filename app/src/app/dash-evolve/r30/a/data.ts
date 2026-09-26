import {
  UserPlus,
  TrendingUp,
  TrendingDown,
  UserMinus,
  RotateCcw,
  type LucideIcon,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type BridgeKind = "total" | "increase" | "decrease";

export type BridgeId =
  | "starting"
  | "new-business"
  | "expansion"
  | "contraction"
  | "churn"
  | "reactivation"
  | "ending";

/** A single input row for a revenue bridge. `value` is a signed dollar
 * amount for increase/decrease rows; for the `starting` total row it is
 * the absolute opening balance. The `ending` total row's `value` is kept
 * only as a hand-verified reference figure — `buildBridgeSteps` never
 * reads it, the running total is always computed from the deltas so the
 * chart can never show a number that doesn't actually reconcile. */
export interface BridgeInput {
  id: BridgeId;
  label: string;
  kind: BridgeKind;
  value: number;
}

export interface BridgeStep extends BridgeInput {
  runningTotal: number;
  previousTotal: number;
}

export type CategoryId = Exclude<BridgeId, "starting" | "ending">;

export interface CategoryMeta {
  label: string;
  direction: "up" | "down";
  icon: LucideIcon;
}

export const CATEGORY_META: Record<CategoryId, CategoryMeta> = {
  "new-business": { label: "New business", direction: "up", icon: UserPlus },
  expansion: { label: "Expansion", direction: "up", icon: TrendingUp },
  contraction: { label: "Contraction", direction: "down", icon: TrendingDown },
  churn: { label: "Churn", direction: "down", icon: UserMinus },
  reactivation: { label: "Reactivation", direction: "up", icon: RotateCcw },
};

export type PeriodId = "this-quarter" | "last-quarter" | "trailing-12mo";

export interface PeriodStats {
  growthPct: number;
  growthLabel: string;
  nrrPct: number;
  grossMarginPct: number;
  activeAccounts: number;
}

export interface PeriodDefinition {
  id: PeriodId;
  label: string;
  shortLabel: string;
  rangeLabel: string;
  steps: BridgeInput[];
  stats: PeriodStats;
}

export interface Account {
  id: string;
  name: string;
  segment: "Starter" | "Growth" | "Enterprise";
  category: CategoryId;
  arrImpact: number;
  owner: string;
  lastActivity: string;
}

/* ------------------------------------------------------------------ */
/* Revenue bridge periods                                              */
/* ------------------------------------------------------------------ */
/* All figures in whole US dollars. Each period's bridge is hand
 * reconciled: starting balance + every contribution below sums exactly
 * to the ending balance. Quarters chain into each other too — Q2's
 * ending ARR (4,220,000) is Q3's starting ARR, and the trailing-12mo
 * bridge starts at the balance from four quarters back and lands on
 * the same ending figure as the current quarter. */

export const PERIODS: PeriodDefinition[] = [
  {
    id: "this-quarter",
    label: "This quarter",
    shortLabel: "Q3 2026",
    rangeLabel: "Jul 1 – Sep 30, 2026",
    steps: [
      { id: "starting", label: "Starting ARR", kind: "total", value: 4_220_000 },
      { id: "new-business", label: "New business", kind: "increase", value: 410_000 },
      { id: "expansion", label: "Expansion", kind: "increase", value: 265_000 },
      { id: "contraction", label: "Contraction", kind: "decrease", value: -95_000 },
      { id: "churn", label: "Churn", kind: "decrease", value: -180_000 },
      { id: "reactivation", label: "Reactivation", kind: "increase", value: 60_000 },
      { id: "ending", label: "Ending ARR", kind: "total", value: 4_680_000 },
    ],
    stats: {
      growthPct: 10.9,
      growthLabel: "QoQ",
      nrrPct: 101.2,
      grossMarginPct: 81.6,
      activeAccounts: 346,
    },
  },
  {
    id: "last-quarter",
    label: "Last quarter",
    shortLabel: "Q2 2026",
    rangeLabel: "Apr 1 – Jun 30, 2026",
    steps: [
      { id: "starting", label: "Starting ARR", kind: "total", value: 3_865_000 },
      { id: "new-business", label: "New business", kind: "increase", value: 345_000 },
      { id: "expansion", label: "Expansion", kind: "increase", value: 210_000 },
      { id: "contraction", label: "Contraction", kind: "decrease", value: -110_000 },
      { id: "churn", label: "Churn", kind: "decrease", value: -150_000 },
      { id: "reactivation", label: "Reactivation", kind: "increase", value: 60_000 },
      { id: "ending", label: "Ending ARR", kind: "total", value: 4_220_000 },
    ],
    stats: {
      growthPct: 9.2,
      growthLabel: "QoQ",
      nrrPct: 100.3,
      grossMarginPct: 80.9,
      activeAccounts: 318,
    },
  },
  {
    id: "trailing-12mo",
    label: "Trailing 12 months",
    shortLabel: "TTM",
    rangeLabel: "Oct 1, 2025 – Sep 30, 2026",
    steps: [
      { id: "starting", label: "Starting ARR", kind: "total", value: 3_140_000 },
      { id: "new-business", label: "New business", kind: "increase", value: 1_350_000 },
      { id: "expansion", label: "Expansion", kind: "increase", value: 620_000 },
      { id: "contraction", label: "Contraction", kind: "decrease", value: -300_000 },
      { id: "churn", label: "Churn", kind: "decrease", value: -520_000 },
      { id: "reactivation", label: "Reactivation", kind: "increase", value: 390_000 },
      { id: "ending", label: "Ending ARR", kind: "total", value: 4_680_000 },
    ],
    stats: {
      growthPct: 49.0,
      growthLabel: "YoY",
      nrrPct: 106.1,
      grossMarginPct: 81.1,
      activeAccounts: 346,
    },
  },
];

/** Turns a period's raw bridge inputs into steps carrying a running
 * total. The `starting` row seeds the running total; every other row
 * (except `ending`, whose figure is derived, never trusted) adds its
 * signed delta on top. This is the one place the bridge arithmetic
 * happens, so every rendered number — bars, labels, tooltip — traces
 * back to the same computed total. */
export function buildBridgeSteps(inputs: BridgeInput[]): BridgeStep[] {
  let running = 0;
  return inputs.map((step, index) => {
    const previousTotal = running;
    if (step.kind === "total") {
      running = index === 0 ? step.value : running;
    } else {
      running += step.value;
    }
    return { ...step, previousTotal, runningTotal: running };
  });
}

/* ------------------------------------------------------------------ */
/* Trailing ARR trend (shown beside the hero number)                   */
/* ------------------------------------------------------------------ */
/* 12 monthly closes. Index 7 lands on last quarter's opening balance,
 * index 10 on last quarter's close / this quarter's open, index 11 on
 * this quarter's close — the same figures the bridges above compute. */
export const TRAILING_ARR: number[] = [
  3_140_000, 3_210_000, 3_290_000, 3_380_000, 3_520_000, 3_650_000, 3_790_000,
  3_865_000, 3_980_000, 4_090_000, 4_220_000, 4_680_000,
];

/* ------------------------------------------------------------------ */
/* Accounts — this quarter's account-level ARR movements                */
/* ------------------------------------------------------------------ */
/* Every category's rows sum exactly to that category's bridge delta
 * above (e.g. the four new-business rows sum to 410,000), so drilling
 * into the ledger reconciles with the chart it was pinned from. */

export const ACCOUNTS: Account[] = [
  { id: "anchorpoint-logistics", name: "Anchorpoint Logistics", segment: "Enterprise", category: "new-business", arrImpact: 140_000, owner: "Priya Nandakumar", lastActivity: "2026-09-18" },
  { id: "fernbridge-retail", name: "Fernbridge Retail", segment: "Growth", category: "new-business", arrImpact: 120_000, owner: "Marcus Tuiasosopo", lastActivity: "2026-09-15" },
  { id: "solvane-health", name: "Solvane Health", segment: "Growth", category: "new-business", arrImpact: 90_000, owner: "Dana Whitfield", lastActivity: "2026-09-11" },
  { id: "kepler-foods", name: "Kepler Foods", segment: "Starter", category: "new-business", arrImpact: 60_000, owner: "Elliot Reyes", lastActivity: "2026-09-08" },

  { id: "marrow-studio", name: "Marrow Studio", segment: "Growth", category: "expansion", arrImpact: 95_000, owner: "Sana Karimi", lastActivity: "2026-09-17" },
  { id: "twine-analytics", name: "Twine Analytics", segment: "Enterprise", category: "expansion", arrImpact: 70_000, owner: "Priya Nandakumar", lastActivity: "2026-09-14" },
  { id: "glassrun-media", name: "Glassrun Media", segment: "Growth", category: "expansion", arrImpact: 60_000, owner: "Marcus Tuiasosopo", lastActivity: "2026-09-10" },
  { id: "oakfield-partners", name: "Oakfield Partners", segment: "Starter", category: "expansion", arrImpact: 40_000, owner: "Dana Whitfield", lastActivity: "2026-09-05" },

  { id: "baymark-consulting", name: "Baymark Consulting", segment: "Growth", category: "contraction", arrImpact: -40_000, owner: "Elliot Reyes", lastActivity: "2026-09-16" },
  { id: "ferro-systems", name: "Ferro Systems", segment: "Enterprise", category: "contraction", arrImpact: -35_000, owner: "Sana Karimi", lastActivity: "2026-09-09" },
  { id: "nettle-co", name: "Nettle & Co", segment: "Starter", category: "contraction", arrImpact: -20_000, owner: "Priya Nandakumar", lastActivity: "2026-09-03" },

  { id: "voss-industrial", name: "Voss Industrial", segment: "Enterprise", category: "churn", arrImpact: -75_000, owner: "Marcus Tuiasosopo", lastActivity: "2026-09-13" },
  { id: "crestline-media", name: "Crestline Media", segment: "Growth", category: "churn", arrImpact: -65_000, owner: "Dana Whitfield", lastActivity: "2026-09-07" },
  { id: "ashford-data", name: "Ashford Data", segment: "Starter", category: "churn", arrImpact: -40_000, owner: "Elliot Reyes", lastActivity: "2026-09-02" },

  { id: "halden-group", name: "Halden Group", segment: "Growth", category: "reactivation", arrImpact: 35_000, owner: "Sana Karimi", lastActivity: "2026-09-12" },
  { id: "quire-works", name: "Quire Works", segment: "Starter", category: "reactivation", arrImpact: 25_000, owner: "Priya Nandakumar", lastActivity: "2026-09-06" },
];

/* ------------------------------------------------------------------ */
/* Formatting helpers — all deterministic, no locale-sensitive compact  */
/* notation (ICU-version compact strings can differ between Node's SSR  */
/* and the browser and break hydration, so millions/thousands here are  */
/* built by hand: divide, round to a fixed number of decimals, format   */
/* the integer part with manual thousands separators).                  */
/* ------------------------------------------------------------------ */

function withThousandsSeparators(digits: string): string {
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function formatMillions(value: number): string {
  const millions = Math.round((value / 1_000_000) * 100) / 100;
  const fixed = millions.toFixed(2);
  const [intPart, fracPart] = fixed.split(".");
  return `$${withThousandsSeparators(intPart)}.${fracPart}M`;
}

export function formatThousands(value: number): string {
  const thousands = Math.round(Math.abs(value) / 1000);
  return `$${withThousandsSeparators(String(thousands))}K`;
}

export function formatSignedThousands(value: number): string {
  const sign = value > 0 ? "+" : value < 0 ? "−" : "";
  return `${sign}${formatThousands(value)}`;
}

export function formatPercent(value: number, digits = 1): string {
  return `${value.toFixed(digits)}%`;
}

export function formatCount(value: number): string {
  return withThousandsSeparators(String(value));
}

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export function formatDate(iso: string): string {
  // Parsed from the fixed "YYYY-MM-DD" string directly (no Date object,
  // no timezone dependency, no ambient clock) so it renders identically
  // on the server and in every viewer's browser.
  const [year, month, day] = iso.split("-").map(Number);
  return `${MONTHS[month - 1]} ${day}, ${year}`;
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
