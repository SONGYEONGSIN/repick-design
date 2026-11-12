// Deterministic dummy data for the Portway buyer-activation funnel console.
// No Math.random(), no Date.now(), no bare `new Date()` anywhere in this module — every number
// below is either a hand-picked literal or derived from one through plain, order-independent
// arithmetic, so server and client always compute the identical value.

export type Period = "30d" | "90d" | "all";

export const PERIOD_OPTIONS: { id: Period; label: string }[] = [
  { id: "30d", label: "30 Days" },
  { id: "90d", label: "90 Days" },
  { id: "all", label: "All Time" },
];

export const PERIOD_CAPTION: Record<Period, string> = {
  "30d": "Trailing 30 days",
  "90d": "Trailing 90 days",
  all: "Since account launch",
};

// ---------------------------------------------------------------------------
// Stage totals per period. Hand-set so the shape of the funnel (conversion
// rate from one stage to the next) stays realistic and roughly consistent
// across periods: ~22-24% activate, ~46-48% send a quote request, ~54-55%
// convert that into an order, ~47-49% come back to buy again.
// ---------------------------------------------------------------------------

export interface StageTotals {
  visitors: number;
  signedUp: number;
  rfq: number;
  order: number;
  repeat: number;
}

export const STAGE_TOTALS: Record<Period, StageTotals> = {
  "30d": { visitors: 18420, signedUp: 4142, rfq: 1893, order: 1042, repeat: 486 },
  "90d": { visitors: 52360, signedUp: 12480, rfq: 5920, order: 3215, repeat: 1548 },
  all: { visitors: 184200, signedUp: 41200, rfq: 19230, order: 10480, repeat: 5120 },
};

// Fraction of repeat buyers that go on to place a third order inside the same
// window. There's no sixth funnel stage to reconcile against, so this is a
// plain fixed ratio rather than a totals lookup.
const THIRD_ORDER_RATIO = 0.34;

export type StageId = "visitors" | "signedUp" | "rfq" | "order" | "repeat";

export interface StageDef {
  id: StageId;
  index: number;
  name: string;
  shortName: string;
  description: string;
  nextLabel: string;
  icon: "users" | "userPlus" | "fileText" | "shoppingCart" | "repeat";
}

export const STAGES: StageDef[] = [
  {
    id: "visitors",
    index: 0,
    name: "Visitors",
    shortName: "Visitors",
    description: "Sessions landing on the marketplace from any sourced channel.",
    nextLabel: "Signed Up",
    icon: "users",
  },
  {
    id: "signedUp",
    index: 1,
    name: "Signed Up",
    shortName: "Signed Up",
    description: "Created a verified buyer account.",
    nextLabel: "Sent First RFQ",
    icon: "userPlus",
  },
  {
    id: "rfq",
    index: 2,
    name: "First RFQ Sent",
    shortName: "First RFQ",
    description: "Submitted a request for quote to at least one supplier.",
    nextLabel: "Placed First Order",
    icon: "fileText",
  },
  {
    id: "order",
    index: 3,
    name: "First Order Placed",
    shortName: "First Order",
    description: "Converted a quote into a paid purchase order.",
    nextLabel: "Became Repeat Buyer",
    icon: "shoppingCart",
  },
  {
    id: "repeat",
    index: 4,
    name: "Repeat Buyer (90d)",
    shortName: "Repeat Buyer",
    description: "Placed a second order within 90 days of the first.",
    nextLabel: "Placed 3rd Order (90d)",
    icon: "repeat",
  },
];

function stageCount(totals: StageTotals, id: StageId): number {
  switch (id) {
    case "visitors":
      return totals.visitors;
    case "signedUp":
      return totals.signedUp;
    case "rfq":
      return totals.rfq;
    case "order":
      return totals.order;
    case "repeat":
      return totals.repeat;
  }
}

function nextCount(totals: StageTotals, id: StageId): number {
  switch (id) {
    case "visitors":
      return totals.signedUp;
    case "signedUp":
      return totals.rfq;
    case "rfq":
      return totals.order;
    case "order":
      return totals.repeat;
    case "repeat":
      return Math.round(totals.repeat * THIRD_ORDER_RATIO);
  }
}

export interface FunnelStageView {
  stage: StageDef;
  count: number;
  convFromPrev: number | null; // % of previous stage that reached this one; null for the first stage
  dropFromPrev: number | null;
  widthPct: number; // trapezoid taper width, 0-100
}

const MIN_WIDTH_PCT = 14;
const MAX_WIDTH_PCT = 96;

export function getFunnelView(period: Period): FunnelStageView[] {
  const totals = STAGE_TOTALS[period];
  const counts = STAGES.map((s) => stageCount(totals, s.id));
  const top = counts[0];
  return STAGES.map((stage, i) => {
    const count = counts[i];
    const ratio = top > 0 ? count / top : 0;
    const widthPct = Math.round((MIN_WIDTH_PCT + Math.sqrt(ratio) * (MAX_WIDTH_PCT - MIN_WIDTH_PCT)) * 100) / 100;
    if (i === 0) {
      return { stage, count, convFromPrev: null, dropFromPrev: null, widthPct };
    }
    const prev = counts[i - 1];
    const conv = prev > 0 ? (count / prev) * 100 : 0;
    return {
      stage,
      count,
      convFromPrev: Math.round(conv * 10) / 10,
      dropFromPrev: Math.round((100 - conv) * 10) / 10,
      widthPct,
    };
  });
}

// ---------------------------------------------------------------------------
// Cohort breakdown rows — shared engine for both "by signup week" and
// "by channel" views, for every stage, for every period. `splitTotal` always
// returns parts that sum exactly to `total`, so every table reconciles with
// the funnel number above it by construction rather than by hand-checking.
// ---------------------------------------------------------------------------

function splitTotal(total: number, weights: number[]): number[] {
  const parts = weights.slice(0, -1).map((w) => Math.round(total * w));
  const used = parts.reduce((a, b) => a + b, 0);
  return [...parts, total - used];
}

const WEEK_LABELS = ["6 Weeks Ago", "5 Weeks Ago", "4 Weeks Ago", "3 Weeks Ago", "2 Weeks Ago", "Last Week"];
const CHANNEL_LABELS = [
  "Organic Search",
  "Paid Search",
  "Referral Partner",
  "Direct",
  "Email Campaign",
  "Marketplace Listing",
];

// Ascending growth shape: most recent cohorts are the largest. Sums to 1.
const ENTER_WEIGHTS_WEEK = [0.13, 0.15, 0.16, 0.17, 0.18, 0.21];
// Older cohorts have had more time to convert, so conversions skew only
// mildly toward them even though they're smaller — kept gentle (vs. the
// enter-weight slope) so no row's advanced/entered ratio can cross 100% once
// multiplied through the highest real stage-to-stage conversion rate on the
// page (~55%, First RFQ Sent → First Order Placed). Sums to 1.
const CONV_WEIGHTS_WEEK = [0.17, 0.17, 0.17, 0.17, 0.16, 0.16];

// Organic carries the most traffic; marketplace listings the least. Sums to 1.
const ENTER_WEIGHTS_CHANNEL = [0.337, 0.234, 0.168, 0.134, 0.073, 0.054];
// Organic + referral convert best; marketplace listing worst. Sums to 1.
const CONV_WEIGHTS_CHANNEL = [0.45, 0.27, 0.17, 0.08, 0.02, 0.01];

interface LeadAccount {
  name: string;
  company: string;
  avatarId: string;
}

const LEAD_POOL: LeadAccount[] = [
  { name: "Mara Lindqvist", company: "Harborstone Supply", avatarId: "1494790108377-be9c29b29330" },
  { name: "Devon Okafor", company: "Northbridge Fabrication", avatarId: "1507003211169-0a1dd7228f2d" },
  { name: "Priya Chandran", company: "Vireo Industrial", avatarId: "1438761681033-6461ffad8d80" },
  { name: "Tomas Reyes", company: "Caldwell & Finch", avatarId: "1472099645785-5658abf4ff4e" },
  { name: "Elin Vasko", company: "Brightlane Distribution", avatarId: "1544005313-94ddf0286df2" },
  { name: "Marcus Webb", company: "Stonegate Mercantile", avatarId: "1544723795-3fb6469f5b39" },
];

export type SignalKind = "baseline" | "up" | "down" | "share";

export interface CohortRow {
  id: string;
  label: string;
  lead: LeadAccount;
  entered: number;
  advanced: number;
  convRate: number;
  signal: { kind: SignalKind; value: number };
}

function buildRows(
  labels: string[],
  total: number,
  nextTotal: number,
  enterWeights: number[],
  convWeights: number[],
  signalKind: "trend" | "share",
  idPrefix: string,
): CohortRow[] {
  const entered = splitTotal(total, enterWeights);
  const advanced = splitTotal(nextTotal, convWeights);
  const rates = entered.map((e, i) => (e > 0 ? (advanced[i] / e) * 100 : 0));
  return labels.map((label, i) => {
    const lead = LEAD_POOL[i % LEAD_POOL.length];
    const convRate = Math.round(rates[i] * 10) / 10;
    const signal: CohortRow["signal"] =
      signalKind === "share"
        ? { kind: "share", value: Math.round((entered[i] / total) * 1000) / 10 }
        : i === 0
          ? { kind: "baseline", value: 0 }
          : {
              kind: rates[i] >= rates[i - 1] ? "up" : "down",
              value: Math.round((rates[i] - rates[i - 1]) * 10) / 10,
            };
    return {
      id: `${idPrefix}-${i}`,
      label,
      lead,
      entered: entered[i],
      advanced: advanced[i],
      convRate,
      signal,
    };
  });
}

export interface StageCohorts {
  byWeek: CohortRow[];
  byChannel: CohortRow[];
}

export function getCohorts(period: Period, stageId: StageId): StageCohorts {
  const totals = STAGE_TOTALS[period];
  const total = stageCount(totals, stageId);
  const next = nextCount(totals, stageId);
  return {
    byWeek: buildRows(WEEK_LABELS, total, next, ENTER_WEIGHTS_WEEK, CONV_WEIGHTS_WEEK, "trend", `${stageId}-wk`),
    byChannel: buildRows(
      CHANNEL_LABELS,
      total,
      next,
      ENTER_WEIGHTS_CHANNEL,
      CONV_WEIGHTS_CHANNEL,
      "share",
      `${stageId}-ch`,
    ),
  };
}

// ---------------------------------------------------------------------------
// KPI strip — thin, quiet, non-interactive context above the funnel. Every
// figure reuses a number already defined above rather than inventing a new
// total, so nothing here can drift out of sync with the funnel beneath it.
// ---------------------------------------------------------------------------

export interface KpiTile {
  label: string;
  value: string;
  caption: string;
  series: number[];
}

export function getKpis(period: Period): KpiTile[] {
  const t = STAGE_TOTALS[period];
  const signUpRate = (t.signedUp / t.visitors) * 100;
  const repeatRate = (t.repeat / t.order) * 100;
  return [
    {
      label: "Total Visitors",
      value: formatInt(t.visitors),
      caption: PERIOD_CAPTION[period],
      series: splitTotal(t.visitors, ENTER_WEIGHTS_WEEK),
    },
    {
      label: "Sign-Up Rate",
      value: `${formatPct(signUpRate)}`,
      caption: `${formatInt(t.signedUp)} accounts created`,
      series: splitTotal(t.signedUp, ENTER_WEIGHTS_WEEK),
    },
    {
      label: "Active Buyers",
      value: formatInt(t.order),
      caption: "Placed a first order",
      series: splitTotal(t.order, ENTER_WEIGHTS_WEEK),
    },
    {
      label: "Repeat Rate",
      value: `${formatPct(repeatRate)}`,
      caption: `${formatInt(t.repeat)} bought again`,
      series: splitTotal(t.repeat, ENTER_WEIGHTS_WEEK),
    },
  ];
}

// ---------------------------------------------------------------------------
// Formatters. Intl.NumberFormat is only used WITHOUT compact notation, per
// the hydration-safety rule — compact notation's trailing-zero behaviour can
// differ between server and browser ICU builds for the same number.
// ---------------------------------------------------------------------------

const intFormatter = new Intl.NumberFormat("en-US");

export function formatInt(n: number): string {
  return intFormatter.format(Math.round(n));
}

export function formatPct(n: number): string {
  return `${(Math.round(n * 10) / 10).toFixed(1)}%`;
}

export function avatarUrl(avatarId: string): string {
  return `https://images.unsplash.com/photo-${avatarId}?q=80&w=128&h=128&fit=crop&auto=format`;
}
