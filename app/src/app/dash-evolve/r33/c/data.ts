/**
 * Arcway Growth — deterministic dummy data for the conversion-funnel dashboard.
 *
 * Hard rules honoured here (see vault/00-principles/page-brief-core.md):
 * - No Math.random / Date.now / bare new Date anywhere in this file.
 * - Funnel counts are monotonically non-increasing stage-to-stage (enforced by
 *   construction below — each stage's count is <= the previous stage's count).
 * - Drop-off percentages, cumulative percentages and cohort "share" values are
 *   never typed by hand — every percentage is a pure function of the counts
 *   that live beside it, computed in `funnel-math` helpers in this file.
 * - Cohort reason/driver counts per stage sum EXACTLY to that stage's real
 *   drop (or, for the terminal stage, to the retained total) — chosen by hand
 *   so the arithmetic is exact, not rounded after the fact.
 */

export type StageId = "visitor" | "signup" | "activated" | "paid" | "retained";
export type PeriodId = "current" | "previous";
export type Channel =
  | "Organic search"
  | "Paid social"
  | "Referral"
  | "Direct"
  | "Content & docs";

export interface FunnelStage {
  id: StageId;
  label: string;
  count: number;
}

export interface CohortRow {
  reason: string;
  channel: Channel;
  count: number;
}

/** Whether a pinned stage scopes the cohort table to "why people dropped"
 *  (every stage except the last) or "why people stuck around" (the last). */
export type CohortKind = "dropoff" | "composition";

export const STAGE_ORDER: StageId[] = ["visitor", "signup", "activated", "paid", "retained"];

export const STAGE_META: Record<StageId, { label: string; shortLabel: string }> = {
  visitor: { label: "Visitors", shortLabel: "Visitors" },
  signup: { label: "Signups", shortLabel: "Signups" },
  activated: { label: "Activated", shortLabel: "Activated" },
  paid: { label: "Paid", shortLabel: "Paid" },
  retained: { label: "Retained (90-day)", shortLabel: "Retained" },
};

export const PERIOD_META: Record<PeriodId, { label: string; range: string }> = {
  current: { label: "This period", range: "Sep 2 – Oct 1, 2026" },
  previous: { label: "Last period", range: "Aug 3 – Sep 1, 2026" },
};

export const FUNNEL_DATA: Record<PeriodId, FunnelStage[]> = {
  current: [
    { id: "visitor", label: STAGE_META.visitor.label, count: 148_200 },
    { id: "signup", label: STAGE_META.signup.label, count: 21_350 },
    { id: "activated", label: STAGE_META.activated.label, count: 9_870 },
    { id: "paid", label: STAGE_META.paid.label, count: 3_215 },
    { id: "retained", label: STAGE_META.retained.label, count: 2_540 },
  ],
  previous: [
    { id: "visitor", label: STAGE_META.visitor.label, count: 139_640 },
    { id: "signup", label: STAGE_META.signup.label, count: 19_920 },
    { id: "activated", label: STAGE_META.activated.label, count: 8_930 },
    { id: "paid", label: STAGE_META.paid.label, count: 2_890 },
    { id: "retained", label: STAGE_META.retained.label, count: 2_210 },
  ],
};

/** Supporting data points that aren't derived from the funnel counts (e.g. a
 *  cycle-time metric) but are still realistic, deterministic figures. */
export const MEDIAN_DAYS_TO_ACTIVATE: Record<PeriodId, number> = {
  current: 3.4,
  previous: 3.9,
};

export const QUARTERLY_RETAINED_GOAL = 3_000;

/** 8-week trailing trend, one series per metric, one per period — used by the
 *  tabbed sparkline beside the hero number. Hand-authored, deterministic. */
export const TREND_DATA: Record<PeriodId, Record<"conversion" | "visitors" | "retained", number[]>> = {
  current: {
    conversion: [1.52, 1.55, 1.58, 1.61, 1.63, 1.66, 1.69, 1.71],
    visitors: [131_200, 134_800, 136_900, 138_200, 140_100, 142_700, 145_300, 148_200],
    retained: [2_180, 2_230, 2_280, 2_340, 2_390, 2_440, 2_490, 2_540],
  },
  previous: {
    conversion: [1.41, 1.44, 1.46, 1.49, 1.51, 1.53, 1.56, 1.58],
    visitors: [124_100, 127_300, 129_800, 132_000, 134_400, 136_500, 138_000, 139_640],
    retained: [1_890, 1_940, 1_985, 2_030, 2_080, 2_120, 2_165, 2_210],
  },
};

/**
 * Cohort breakdown per stage per period. For stages visitor/signup/activated/paid
 * this is "why the dropped cohort left between this stage and the next" and the
 * row counts sum exactly to (thisStage.count - nextStage.count). For the
 * terminal "retained" stage there is no next stage, so this is instead "what
 * the retained cohort is doing right", and the row counts sum exactly to
 * retained.count.
 */
export const COHORT_KIND: Record<StageId, CohortKind> = {
  visitor: "dropoff",
  signup: "dropoff",
  activated: "dropoff",
  paid: "dropoff",
  retained: "composition",
};

export const COHORT_SCOPE_LABEL: Record<StageId, string> = {
  visitor: "Visitors → Signups",
  signup: "Signups → Activated",
  activated: "Activated → Paid",
  paid: "Paid → Retained",
  retained: "Retained cohort composition",
};

export const COHORT_TOTAL_LABEL: Record<StageId, string> = {
  visitor: "dropped before signing up",
  signup: "dropped before activating",
  activated: "dropped before converting to paid",
  paid: "churned before 90-day retention",
  retained: "retained customers, 90 days+",
};

export const COHORT_DATA: Record<PeriodId, Record<StageId, CohortRow[]>> = {
  current: {
    visitor: [
      { reason: "Bounced before pricing page", channel: "Organic search", count: 54_400 },
      { reason: "Left signup form midway", channel: "Paid social", count: 33_200 },
      { reason: "Blocked by SSO requirement", channel: "Direct", count: 22_650 },
      { reason: "Abandoned at email verification", channel: "Content & docs", count: 16_600 },
    ],
    signup: [
      { reason: "Never completed onboarding checklist", channel: "Organic search", count: 4_820 },
      { reason: "No workspace data imported", channel: "Direct", count: 3_190 },
      { reason: "Did not invite teammates", channel: "Referral", count: 2_260 },
      { reason: "Stalled at integration step", channel: "Paid social", count: 1_210 },
    ],
    activated: [
      { reason: "Trial expired unconverted", channel: "Direct", count: 2_890 },
      { reason: "Price objection raised", channel: "Organic search", count: 1_940 },
      { reason: "Missing feature at current plan", channel: "Content & docs", count: 1_200 },
      { reason: "Budget approval pending", channel: "Referral", count: 625 },
    ],
    paid: [
      { reason: "Churned — budget cuts", channel: "Direct", count: 265 },
      { reason: "Churned — low product usage", channel: "Organic search", count: 210 },
      { reason: "Churned — switched to a competitor", channel: "Referral", count: 130 },
      { reason: "Downgraded to free tier", channel: "Paid social", count: 70 },
    ],
    retained: [
      { reason: "Adopted 2+ core workflows", channel: "Organic search", count: 1_120 },
      { reason: "Invited 3+ teammates", channel: "Referral", count: 760 },
      { reason: "Connected a billing integration", channel: "Direct", count: 430 },
      { reason: "Enrolled in an annual plan", channel: "Content & docs", count: 230 },
    ],
  },
  previous: {
    visitor: [
      { reason: "Bounced before pricing page", channel: "Organic search", count: 51_200 },
      { reason: "Left signup form midway", channel: "Paid social", count: 31_100 },
      { reason: "Blocked by SSO requirement", channel: "Direct", count: 21_300 },
      { reason: "Abandoned at email verification", channel: "Content & docs", count: 16_120 },
    ],
    signup: [
      { reason: "Never completed onboarding checklist", channel: "Organic search", count: 4_570 },
      { reason: "No workspace data imported", channel: "Direct", count: 3_050 },
      { reason: "Did not invite teammates", channel: "Referral", count: 2_180 },
      { reason: "Stalled at integration step", channel: "Paid social", count: 1_190 },
    ],
    activated: [
      { reason: "Trial expired unconverted", channel: "Direct", count: 2_610 },
      { reason: "Price objection raised", channel: "Organic search", count: 1_780 },
      { reason: "Missing feature at current plan", channel: "Content & docs", count: 1_080 },
      { reason: "Budget approval pending", channel: "Referral", count: 570 },
    ],
    paid: [
      { reason: "Churned — budget cuts", channel: "Direct", count: 270 },
      { reason: "Churned — low product usage", channel: "Organic search", count: 205 },
      { reason: "Churned — switched to a competitor", channel: "Referral", count: 140 },
      { reason: "Downgraded to free tier", channel: "Paid social", count: 65 },
    ],
    retained: [
      { reason: "Adopted 2+ core workflows", channel: "Organic search", count: 970 },
      { reason: "Invited 3+ teammates", channel: "Referral", count: 660 },
      { reason: "Connected a billing integration", channel: "Direct", count: 370 },
      { reason: "Enrolled in an annual plan", channel: "Content & docs", count: 210 },
    ],
  },
};

// ---------------------------------------------------------------------------
// Pure derivations — every percentage below is computed from the counts
// above, never hand-typed, so the two can never drift out of sync.
// ---------------------------------------------------------------------------

export interface StageDerived extends FunnelStage {
  /** Percentage drop versus the previous stage. Null for the first stage. */
  dropPct: number | null;
  /** Absolute count lost versus the previous stage. Null for the first stage. */
  dropCount: number | null;
  /** Percentage of the very first stage's count that survived to here. */
  cumulativePct: number;
}

export function deriveFunnel(stages: FunnelStage[]): StageDerived[] {
  const first = stages[0]?.count ?? 0;
  return stages.map((stage, i) => {
    const prev = i > 0 ? stages[i - 1].count : null;
    const dropCount = prev !== null ? prev - stage.count : null;
    const dropPct = prev !== null && prev > 0 ? (dropCount! / prev) * 100 : null;
    const cumulativePct = first > 0 ? (stage.count / first) * 100 : 0;
    return { ...stage, dropPct, dropCount, cumulativePct };
  });
}

export function cohortTotal(rows: CohortRow[]): number {
  return rows.reduce((sum, row) => sum + row.count, 0);
}

export function shareOfTotal(count: number, total: number): number {
  return total > 0 ? (count / total) * 100 : 0;
}

export function endToEndConversionPct(stages: FunnelStage[]): number {
  const first = stages[0]?.count ?? 0;
  const last = stages[stages.length - 1]?.count ?? 0;
  return first > 0 ? (last / first) * 100 : 0;
}

export function paidToRetainedPct(stages: FunnelStage[]): number {
  const paid = stages.find((s) => s.id === "paid")?.count ?? 0;
  const retained = stages.find((s) => s.id === "retained")?.count ?? 0;
  return paid > 0 ? (retained / paid) * 100 : 0;
}

export function retainedCount(stages: FunnelStage[]): number {
  return stages.find((s) => s.id === "retained")?.count ?? 0;
}

export const nf = new Intl.NumberFormat("en-US");
export const nfSigned = new Intl.NumberFormat("en-US", { signDisplay: "always" });

export function formatCount(n: number): string {
  return nf.format(Math.round(n));
}

export function formatPct(n: number, digits = 1): string {
  return `${n.toFixed(digits)}%`;
}

export function formatSignedPct(n: number, digits = 1): string {
  const sign = n > 0 ? "+" : n < 0 ? "−" : "±";
  return `${sign}${Math.abs(n).toFixed(digits)}%`;
}

export function formatSignedCount(n: number): string {
  const sign = n > 0 ? "+" : n < 0 ? "−" : "±";
  return `${sign}${nf.format(Math.abs(Math.round(n)))}`;
}

export function formatSignedDays(n: number): string {
  const sign = n > 0 ? "+" : n < 0 ? "−" : "±";
  return `${sign}${Math.abs(n).toFixed(1)}d`;
}

export function otherPeriod(period: PeriodId): PeriodId {
  return period === "current" ? "previous" : "current";
}
