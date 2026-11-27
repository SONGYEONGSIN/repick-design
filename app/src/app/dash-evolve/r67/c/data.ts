/**
 * Deterministic dummy data for Ledgerflow — a subscription billing / revenue (MRR, churn,
 * expansion) console.
 *
 * No `Math.random`, `Date.now`, or `new Date()` anywhere. `MRR_WEEKLY` (26 points, ~6 months) is
 * never a hand-placed list of "plausible" numbers — it is the running cumulative sum of four
 * weekly movement arrays (`NEW_MRR_WEEKLY`, `EXPANSION_MRR_WEEKLY`, `CONTRACTION_MRR_WEEKLY`,
 * `CHURN_MRR_WEEKLY`), each produced by a pure `wave()` function of the week index. Every number
 * the hero section shows (current MRR, the period delta, and all four inline stat totals) is a
 * `slice()`/`reduce()` over those same four arrays for a chosen look-back window — never a second,
 * separately authored figure. The per-plan revenue bridge (`planBridge`) is the same four
 * company-wide movement totals split by `PLAN_SHARE`, so a plan's "ending MRR" is always its own
 * start plus its own movements, not a number typed in to look right.
 */

export type PlanId = "starter" | "growth" | "scale" | "enterprise";
export type AccountStatus = "active" | "at_risk" | "churned";
export type PeriodKey = "30d" | "90d" | "6m";

export const PLAN_ORDER: PlanId[] = ["starter", "growth", "scale", "enterprise"];

export const PLAN_LABEL: Record<PlanId, string> = {
  starter: "Starter",
  growth: "Growth",
  scale: "Scale",
  enterprise: "Enterprise",
};

/** Share of company-wide MRR each plan tier represents — sums to 1. Drives `planBridge` below. */
const PLAN_SHARE: Record<PlanId, number> = {
  starter: 0.07,
  growth: 0.22,
  scale: 0.33,
  enterprise: 0.38,
};

const WEEK_COUNT = 26;
const STARTING_MRR = 86_000;

/** Pure, deterministic wave: same inputs always produce the same number, every render, both on the
 *  server and in the browser — nothing here can hydrate-mismatch. */
function wave(i: number, base: number, growth: number, amp: number, freq: number, phase: number): number {
  return Math.round(base + growth * i + amp * Math.sin(i * freq + phase));
}

const WEEK_INDEX = Array.from({ length: WEEK_COUNT }, (_, i) => i);

/** Four weekly movement categories, always positive by construction (base always exceeds the max
 *  possible negative swing of its own sine term). */
export const NEW_MRR_WEEKLY: number[] = WEEK_INDEX.map((i) => wave(i, 1900, 30, 420, 0.85, 0.3));
export const EXPANSION_MRR_WEEKLY: number[] = WEEK_INDEX.map((i) => wave(i, 900, 15, 210, 0.7, 1.1));
export const CONTRACTION_MRR_WEEKLY: number[] = WEEK_INDEX.map((i) => wave(i, 380, 3, 140, 1.15, 2.0));
export const CHURN_MRR_WEEKLY: number[] = WEEK_INDEX.map((i) => wave(i, 430, -2, 150, 1.3, 0.6));

/** Running cumulative MRR. Index 0 is the one hand-set literal (`STARTING_MRR`, ~6 months ago);
 *  every later point is strictly `previous + new + expansion - contraction - churn` for that week. */
export const MRR_WEEKLY: number[] = (() => {
  const series = [STARTING_MRR];
  for (let i = 1; i < WEEK_COUNT; i++) {
    const prev = series[i - 1];
    series.push(prev + NEW_MRR_WEEKLY[i] + EXPANSION_MRR_WEEKLY[i] - CONTRACTION_MRR_WEEKLY[i] - CHURN_MRR_WEEKLY[i]);
  }
  return series;
})();

export const CURRENT_MRR = MRR_WEEKLY[MRR_WEEKLY.length - 1];

export const PERIOD_OPTIONS: { value: PeriodKey; label: string; weeks: number }[] = [
  { value: "30d", label: "30D", weeks: 4 },
  { value: "90d", label: "90D", weeks: 13 },
  { value: "6m", label: "6M", weeks: WEEK_COUNT - 1 },
];

function sumLast(arr: number[], n: number): number {
  return arr.slice(-n).reduce((sum, v) => sum + v, 0);
}

export interface PeriodMetrics {
  current: number;
  deltaPct: number;
  mrrSeries: number[];
  newMrr: number;
  newSeries: number[];
  expansionMrr: number;
  expansionSeries: number[];
  contractionMrr: number;
  contractionSeries: number[];
  churnMrr: number;
  churnSeries: number[];
}

/** Everything the hero card and its four inline stat tiles render, for one look-back window of
 *  `weeks` weeks ending today. Swapping the period toggle only ever calls this again — there is no
 *  separate "30-day data" object sitting next to a "90-day data" object. */
export function periodMetrics(weeks: number): PeriodMetrics {
  const current = CURRENT_MRR;
  const windowStart = MRR_WEEKLY[MRR_WEEKLY.length - 1 - weeks];
  const deltaPct = windowStart !== 0 ? ((current - windowStart) / windowStart) * 100 : 0;
  return {
    current,
    deltaPct,
    mrrSeries: MRR_WEEKLY.slice(-(weeks + 1)),
    newMrr: sumLast(NEW_MRR_WEEKLY, weeks),
    newSeries: NEW_MRR_WEEKLY.slice(-weeks),
    expansionMrr: sumLast(EXPANSION_MRR_WEEKLY, weeks),
    expansionSeries: EXPANSION_MRR_WEEKLY.slice(-weeks),
    contractionMrr: sumLast(CONTRACTION_MRR_WEEKLY, weeks),
    contractionSeries: CONTRACTION_MRR_WEEKLY.slice(-weeks),
    churnMrr: sumLast(CHURN_MRR_WEEKLY, weeks),
    churnSeries: CHURN_MRR_WEEKLY.slice(-weeks),
  };
}

const BRIDGE_WEEKS = 4;

export interface PlanBridge {
  planId: PlanId;
  start: number;
  newMrr: number;
  expansion: number;
  contraction: number;
  churn: number;
  end: number;
}

/** This plan's slice of the same four company-wide movement totals used by the hero's "30D" inline
 *  stats (always the trailing 4 weeks, independent of whatever period the hero toggle is set to —
 *  the bridge grid is a separate widget with its own fixed reporting window). `end` is always
 *  derived (`start + new + expansion - contraction - churn`), never a second hand-set number. */
export function planBridge(planId: PlanId): PlanBridge {
  const share = PLAN_SHARE[planId];
  const bridgeStart = MRR_WEEKLY[MRR_WEEKLY.length - 1 - BRIDGE_WEEKS];
  const start = Math.round(bridgeStart * share);
  const newMrr = Math.round(sumLast(NEW_MRR_WEEKLY, BRIDGE_WEEKS) * share);
  const expansion = Math.round(sumLast(EXPANSION_MRR_WEEKLY, BRIDGE_WEEKS) * share);
  const contraction = Math.round(sumLast(CONTRACTION_MRR_WEEKLY, BRIDGE_WEEKS) * share);
  const churn = Math.round(sumLast(CHURN_MRR_WEEKLY, BRIDGE_WEEKS) * share);
  const end = start + newMrr + expansion - contraction - churn;
  return { planId, start, newMrr, expansion, contraction, churn, end };
}

export interface Account {
  id: string;
  company: string;
  contact: string;
  planId: PlanId;
  status: AccountStatus;
  mrr: number;
  csm: string;
  photoId: string;
  /** 8 weekly MRR readings for this account; the last entry always equals `mrr`. */
  trend: number[];
}

const PHOTOS = [
  "1494790108377-be9c29b29330",
  "1500648767791-00dcc994a43e",
  "1522075469751-3a6694fb2f61",
  "1472099645785-5658abf4ff4e",
  "1520813792240-56fc4a3765a7",
  "1506794778202-cad84cf45f1d",
  "1534308143481-c55f00be8bd7",
  "1580489944761-15a19d654956",
  "1573497620053-ea5300f94f21",
  "1544005313-94ddf0286df2",
];

export const ACCOUNTS: Account[] = [
  { id: "horizon-robotics", company: "Horizon Robotics", contact: "Maya Castellanos", planId: "enterprise", status: "active", mrr: 18200, csm: "Devon Price", photoId: PHOTOS[0], trend: [15200, 15600, 16100, 16800, 17200, 17650, 17900, 18200] },
  { id: "brightfield-logistics", company: "Brightfield Logistics", contact: "Owen Marsh", planId: "scale", status: "active", mrr: 9400, csm: "Priya Shah", photoId: PHOTOS[1], trend: [8200, 8400, 8650, 8900, 9050, 9150, 9300, 9400] },
  { id: "quillwork-studio", company: "Quillwork Studio", contact: "Nora Fenwick", planId: "growth", status: "at_risk", mrr: 2300, csm: "Devon Price", photoId: PHOTOS[2], trend: [3400, 3250, 3100, 2950, 2700, 2550, 2400, 2300] },
  { id: "palisade-analytics", company: "Palisade Analytics", contact: "Liam O'Dowd", planId: "enterprise", status: "active", mrr: 21300, csm: "Priya Shah", photoId: PHOTOS[3], trend: [18900, 19300, 19800, 20100, 20500, 20800, 21050, 21300] },
  { id: "fernbank-health", company: "Fernbank Health", contact: "Ingrid Solberg", planId: "scale", status: "at_risk", mrr: 7600, csm: "Devon Price", photoId: PHOTOS[4], trend: [9100, 8800, 8500, 8200, 7950, 7800, 7700, 7600] },
  { id: "driftwood-media", company: "Driftwood Media", contact: "Casey Nolan", planId: "starter", status: "active", mrr: 640, csm: "Ravi Kapoor", photoId: PHOTOS[5], trend: [520, 540, 560, 580, 600, 610, 625, 640] },
  { id: "carrick-vale", company: "Carrick & Vale", contact: "Beatrix Lowell", planId: "growth", status: "active", mrr: 3100, csm: "Ravi Kapoor", photoId: PHOTOS[6], trend: [2600, 2700, 2800, 2900, 2950, 3000, 3050, 3100] },
  { id: "northgate-freight", company: "Northgate Freight", contact: "Marcus Ide", planId: "scale", status: "churned", mrr: 0, csm: "Priya Shah", photoId: PHOTOS[7], trend: [6800, 6200, 5400, 4300, 3100, 1800, 600, 0] },
  { id: "lanternfish-labs", company: "Lanternfish Labs", contact: "Soo-ah Baek", planId: "growth", status: "active", mrr: 2800, csm: "Ravi Kapoor", photoId: PHOTOS[8], trend: [2200, 2350, 2450, 2550, 2650, 2700, 2750, 2800] },
  { id: "cobalt-finch", company: "Cobalt & Finch", contact: "Tobias Rourke", planId: "starter", status: "active", mrr: 480, csm: "Devon Price", photoId: PHOTOS[9], trend: [380, 400, 415, 430, 445, 455, 468, 480] },
  { id: "meridian-outfitters", company: "Meridian Outfitters", contact: "Elena Vasquez", planId: "enterprise", status: "at_risk", mrr: 16800, csm: "Priya Shah", photoId: PHOTOS[0], trend: [19600, 19100, 18500, 18000, 17600, 17200, 17000, 16800] },
  { id: "hawthorne-civic-data", company: "Hawthorne Civic Data", contact: "Priya Chandra", planId: "scale", status: "active", mrr: 8300, csm: "Devon Price", photoId: PHOTOS[1], trend: [7100, 7300, 7500, 7700, 7850, 8000, 8150, 8300] },
  { id: "petalwave-beauty", company: "Petalwave Beauty", contact: "Jamie Osei", planId: "starter", status: "churned", mrr: 0, csm: "Ravi Kapoor", photoId: PHOTOS[2], trend: [310, 280, 240, 190, 140, 80, 30, 0] },
];

export const TREND_WEEK_LABELS = ["7 wks ago", "6 wks ago", "5 wks ago", "4 wks ago", "3 wks ago", "2 wks ago", "Last week", "This week"];

export function fmtUsd(n: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

export function fmtUsdCompact(n: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", notation: "compact", maximumFractionDigits: 1 }).format(n);
}

export function fmtSignedPct(n: number): string {
  const sign = n >= 0 ? "+" : "−";
  return `${sign}${Math.abs(n).toFixed(1)}%`;
}
