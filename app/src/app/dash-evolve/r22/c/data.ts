// Aperture — deterministic query-answer data layer.
//
// Nothing here reads Math.random/Date.now/new Date(). Every figure is a pure
// function of (metric, dimension, period, category, bucket index) so the same
// question always renders the same answer, and sums reconcile exactly:
//   - additive metrics: category rows sum to the period total
//   - rate/average metrics: category rows weighted-average back to the period value
// The weighting trick lives in `categoryValue` below.

export type MetricId =
  | "revenue"
  | "orders"
  | "newCustomers"
  | "activeUsers"
  | "churnRate"
  | "aov";

export type DimensionId = "channel" | "region" | "plan" | "device" | "cohort";

export type PeriodId = "7d" | "30d" | "90d" | "12mo";

export type Unit = "currency" | "count" | "percent" | "avgCurrency";

export interface MetricDef {
  id: MetricId;
  label: string;
  short: string;
  description: string;
  unit: Unit;
  /** true = period value is a sum of daily values; false = period value is an average */
  additive: boolean;
  /** true = a smaller number is the good direction (e.g. churn) */
  invertGood: boolean;
  base: number;
  amp1: number;
  freq1: number;
  phase1: number;
  amp2: number;
  freq2: number;
  phase2: number;
  trendPerDay: number;
}

export interface Category {
  id: string;
  label: string;
  weight: number;
}

export interface DimensionDef {
  id: DimensionId;
  label: string;
  groupLabel: string;
  categories: Category[];
}

export interface PeriodDef {
  id: PeriodId;
  label: string;
  short: string;
  days: number;
  bucketKind: "day" | "week" | "month";
}

export const METRICS: MetricDef[] = [
  {
    id: "revenue",
    label: "Revenue",
    short: "Revenue",
    description: "Gross revenue recognized per day, before refunds.",
    unit: "currency",
    additive: true,
    invertGood: false,
    base: 19400,
    amp1: 0.1,
    freq1: 0.052,
    phase1: 0.6,
    amp2: 0.045,
    freq2: 0.9,
    phase2: 1.4,
    trendPerDay: 0.00034,
  },
  {
    id: "orders",
    label: "Orders",
    short: "Orders",
    description: "Completed checkout events per day, across all channels.",
    unit: "count",
    additive: true,
    invertGood: false,
    base: 642,
    amp1: 0.12,
    freq1: 0.061,
    phase1: 2.1,
    amp2: 0.05,
    freq2: 0.87,
    phase2: 0.3,
    trendPerDay: 0.00029,
  },
  {
    id: "newCustomers",
    label: "New Customers",
    short: "New Customers",
    description: "First-time account activations per day.",
    unit: "count",
    additive: true,
    invertGood: false,
    base: 93,
    amp1: 0.16,
    freq1: 0.044,
    phase1: 0.9,
    amp2: 0.06,
    freq2: 1.05,
    phase2: 2.6,
    trendPerDay: 0.00041,
  },
  {
    id: "activeUsers",
    label: "Active Users",
    short: "Active Users",
    description: "Average daily active accounts over the selected period.",
    unit: "count",
    additive: false,
    invertGood: false,
    base: 14150,
    amp1: 0.07,
    freq1: 0.048,
    phase1: 1.7,
    amp2: 0.03,
    freq2: 0.8,
    phase2: 0.5,
    trendPerDay: 0.00031,
  },
  {
    id: "churnRate",
    label: "Churn Rate",
    short: "Churn",
    description: "Average daily logo churn rate over the selected period.",
    unit: "percent",
    additive: false,
    invertGood: true,
    base: 0.0324,
    amp1: 0.14,
    freq1: 0.039,
    phase1: 2.4,
    amp2: 0.05,
    freq2: 0.95,
    phase2: 1.1,
    trendPerDay: -0.00026,
  },
  {
    id: "aov",
    label: "Avg Order Value",
    short: "AOV",
    description: "Average order value over the selected period.",
    unit: "avgCurrency",
    additive: false,
    invertGood: false,
    base: 74.2,
    amp1: 0.06,
    freq1: 0.057,
    phase1: 0.2,
    amp2: 0.025,
    freq2: 0.92,
    phase2: 2.2,
    trendPerDay: 0.00016,
  },
];

export const DIMENSIONS: DimensionDef[] = [
  {
    id: "channel",
    label: "Channel",
    groupLabel: "Group by channel",
    categories: [
      { id: "organic", label: "Organic Search", weight: 0.34 },
      { id: "paidSearch", label: "Paid Search", weight: 0.27 },
      { id: "paidSocial", label: "Paid Social", weight: 0.19 },
      { id: "email", label: "Email", weight: 0.12 },
      { id: "referral", label: "Referral", weight: 0.08 },
    ],
  },
  {
    id: "region",
    label: "Region",
    groupLabel: "Group by region",
    categories: [
      { id: "na", label: "North America", weight: 0.46 },
      { id: "eu", label: "Europe", weight: 0.29 },
      { id: "apac", label: "APAC", weight: 0.17 },
      { id: "latam", label: "LATAM", weight: 0.08 },
    ],
  },
  {
    id: "plan",
    label: "Plan Tier",
    groupLabel: "Group by plan tier",
    categories: [
      { id: "starter", label: "Starter", weight: 0.22 },
      { id: "growth", label: "Growth", weight: 0.38 },
      { id: "scale", label: "Scale", weight: 0.27 },
      { id: "enterprise", label: "Enterprise", weight: 0.13 },
    ],
  },
  {
    id: "device",
    label: "Device",
    groupLabel: "Group by device",
    categories: [
      { id: "desktop", label: "Desktop", weight: 0.58 },
      { id: "mobile", label: "Mobile", weight: 0.37 },
      { id: "tablet", label: "Tablet", weight: 0.05 },
    ],
  },
  {
    id: "cohort",
    label: "Signup Cohort",
    groupLabel: "Group by signup cohort",
    categories: [
      { id: "q1", label: "2026 Q1", weight: 0.31 },
      { id: "q4", label: "2025 Q4", weight: 0.24 },
      { id: "q3", label: "2025 Q3", weight: 0.18 },
      { id: "legacy", label: "Legacy", weight: 0.27 },
    ],
  },
];

export const PERIODS: PeriodDef[] = [
  { id: "7d", label: "Last 7 days", short: "7D", days: 7, bucketKind: "day" },
  { id: "30d", label: "Last 30 days", short: "30D", days: 30, bucketKind: "day" },
  { id: "90d", label: "Last 90 days", short: "90D", days: 90, bucketKind: "week" },
  { id: "12mo", label: "Last 12 months", short: "12M", days: 364, bucketKind: "month" },
];

/** Trailing 364-day window ending today (2026-08-30). Index 363 = today. */
export const DAY_COUNT = 364;

const WEEKDAY_FACTORS = [1.09, 1.05, 1.02, 0.98, 1.11, 0.83, 0.79];

const MONTH_LABELS = [
  "Sep '25", "Oct '25", "Nov '25", "Dec '25", "Jan '26", "Feb '26",
  "Mar '26", "Apr '26", "May '26", "Jun '26", "Jul '26", "Aug '26",
];
const MONTH_DAY_COUNTS = [30, 31, 30, 31, 31, 28, 31, 30, 31, 30, 31, 30];

function metricIndex(metric: MetricDef): number {
  return METRICS.findIndex((m) => m.id === metric.id);
}

function dimensionIndex(dimension: DimensionDef): number {
  return DIMENSIONS.findIndex((d) => d.id === dimension.id);
}

/** Deterministic raw daily value for a metric at an arbitrary (possibly negative) day index. */
export function dailyRaw(metric: MetricDef, day: number): number {
  const wave =
    metric.amp1 * Math.sin(metric.freq1 * day + metric.phase1) +
    metric.amp2 * Math.sin(metric.freq2 * day + metric.phase2);
  const weekday = WEEKDAY_FACTORS[((day % 7) + 7) % 7];
  const trend = 1 + metric.trendPerDay * day;
  return metric.base * trend * (1 + wave) * weekday;
}

/** Sum (additive metrics) or mean (rate/average metrics) over an inclusive day range. */
export function aggregate(metric: MetricDef, startDay: number, endDay: number): number {
  let total = 0;
  let n = 0;
  for (let d = startDay; d <= endDay; d++) {
    total += dailyRaw(metric, d);
    n++;
  }
  return metric.additive ? total : total / Math.max(1, n);
}

export interface Bucket {
  label: string;
  fullLabel: string;
  startDay: number;
  endDay: number;
}

/** The day range a period covers, ending at DAY_COUNT - 1 (today). */
export function periodRange(period: PeriodDef): { startDay: number; endDay: number } {
  const endDay = DAY_COUNT - 1;
  const startDay = period.id === "12mo" ? 0 : endDay - period.days + 1;
  return { startDay, endDay };
}

const AUG_DAYS_30 = Array.from({ length: 30 }, (_, i) => `Aug ${i + 1}`);

/** Splits a period into the chart's time buckets. */
export function bucketsFor(period: PeriodDef): Bucket[] {
  const { startDay, endDay } = periodRange(period);

  if (period.id === "7d") {
    const labels = AUG_DAYS_30.slice(23, 30);
    return labels.map((label, i) => ({
      label,
      fullLabel: label,
      startDay: startDay + i,
      endDay: startDay + i,
    }));
  }

  if (period.id === "30d") {
    return AUG_DAYS_30.map((label, i) => ({
      label: i % 5 === 0 || i === 29 ? label : "",
      fullLabel: label,
      startDay: startDay + i,
      endDay: startDay + i,
    }));
  }

  if (period.id === "90d") {
    const buckets: Bucket[] = [];
    let cursor = startDay;
    for (let i = 0; i < 13; i++) {
      const span = i === 12 ? 6 : 7;
      const bStart = cursor;
      const bEnd = cursor + span - 1;
      buckets.push({
        label: `W${i + 1}`,
        fullLabel: i === 12 ? "This week" : `Week ${i + 1}`,
        startDay: bStart,
        endDay: bEnd,
      });
      cursor = bEnd + 1;
    }
    return buckets;
  }

  // 12mo
  const buckets: Bucket[] = [];
  let cursor = startDay;
  for (let i = 0; i < 12; i++) {
    const span = MONTH_DAY_COUNTS[i];
    const bStart = cursor;
    const bEnd = cursor + span - 1;
    buckets.push({
      label: MONTH_LABELS[i],
      fullLabel: MONTH_LABELS[i],
      startDay: bStart,
      endDay: bEnd,
    });
    cursor = bEnd + 1;
  }
  return buckets;
}

/** Small deterministic per-category deviation, reproducible from indices alone. */
function relOffset(dimIdx: number, catIdx: number, metIdx: number): number {
  const amplitude = 0.1 + 0.04 * (metIdx % 3);
  const phase = dimIdx * 1.7 + catIdx * 2.3 + metIdx * 0.9;
  return amplitude * Math.sin(phase + catIdx * 1.31);
}

/**
 * A category's value for a given day range. For additive metrics this is a
 * portion of the range total (portions sum exactly to the total). For
 * rate/average metrics this is the category's own rate (the weighted average
 * of these values, using each category's weight, reconstructs the overall
 * period value exactly).
 */
export function categoryValue(
  metric: MetricDef,
  dimension: DimensionDef,
  category: Category,
  startDay: number,
  endDay: number,
): number {
  const total = aggregate(metric, startDay, endDay);
  const dimIdx = dimensionIndex(dimension);
  const metIdx = metricIndex(metric);
  const catIdx = dimension.categories.findIndex((c) => c.id === category.id);

  let weightedMean = 0;
  for (let i = 0; i < dimension.categories.length; i++) {
    weightedMean += dimension.categories[i].weight * relOffset(dimIdx, i, metIdx);
  }
  const off = relOffset(dimIdx, catIdx, metIdx) - weightedMean;

  return metric.additive ? total * category.weight * (1 + off) : total * (1 + off);
}

/** Series of a category's value across every bucket of a period (for chart + sparkline). */
export function categorySeries(
  metric: MetricDef,
  dimension: DimensionDef,
  category: Category,
  buckets: Bucket[],
): number[] {
  return buckets.map((b) => categoryValue(metric, dimension, category, b.startDay, b.endDay));
}

export interface HeadlineResult {
  value: number;
  priorValue: number;
  deltaPct: number;
  isGood: boolean;
}

/** Overall metric value for the period, plus the equal-length prior period for comparison. */
export function headlineFor(metric: MetricDef, period: PeriodDef): HeadlineResult {
  const { startDay, endDay } = periodRange(period);
  const value = aggregate(metric, startDay, endDay);
  const priorValue = aggregate(metric, startDay - period.days, startDay - 1);
  const deltaPct = priorValue === 0 ? 0 : ((value - priorValue) / Math.abs(priorValue)) * 100;
  const isGood = metric.invertGood ? deltaPct <= 0 : deltaPct >= 0;
  return { value, priorValue, deltaPct, isGood };
}

export interface TableRow {
  category: Category;
  value: number;
  priorValue: number;
  deltaPct: number;
  sharePct: number;
  isGood: boolean;
  spark: number[];
}

/** The breakdown table for the current metric x dimension x period question. */
export function tableRowsFor(metric: MetricDef, dimension: DimensionDef, period: PeriodDef): TableRow[] {
  const { startDay, endDay } = periodRange(period);
  const buckets = bucketsFor(period);
  const total = aggregate(metric, startDay, endDay);

  return dimension.categories.map((category) => {
    const value = categoryValue(metric, dimension, category, startDay, endDay);
    const priorValue = categoryValue(metric, dimension, category, startDay - period.days, startDay - 1);
    const deltaPct = priorValue === 0 ? 0 : ((value - priorValue) / Math.abs(priorValue)) * 100;
    const sharePct = metric.additive ? (total === 0 ? 0 : (value / total) * 100) : (value / total) * 100;
    const isGood = metric.invertGood ? deltaPct <= 0 : deltaPct >= 0;
    return {
      category,
      value,
      priorValue,
      deltaPct,
      sharePct,
      isGood,
      spark: categorySeries(metric, dimension, category, buckets),
    };
  });
}

// ---- formatting ----------------------------------------------------------

export function formatByUnit(value: number, unit: Unit): string {
  switch (unit) {
    case "currency":
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(value);
    case "avgCurrency":
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2,
      }).format(value);
    case "percent":
      return `${(value * 100).toFixed(2)}%`;
    case "count":
    default:
      return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(Math.round(value));
  }
}

export function formatDeltaPct(value: number): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

export function metricById(id: MetricId): MetricDef {
  const m = METRICS.find((x) => x.id === id);
  if (!m) throw new Error(`Unknown metric ${id}`);
  return m;
}

export function dimensionById(id: DimensionId): DimensionDef {
  const d = DIMENSIONS.find((x) => x.id === id);
  if (!d) throw new Error(`Unknown dimension ${id}`);
  return d;
}

export function periodById(id: PeriodId): PeriodDef {
  const p = PERIODS.find((x) => x.id === id);
  if (!p) throw new Error(`Unknown period ${id}`);
  return p;
}

export interface SavedQuestion {
  id: string;
  label: string;
  metric: MetricId;
  dimension: DimensionId;
  period: PeriodId;
}

export const DEFAULT_SAVED_QUESTIONS: SavedQuestion[] = [
  { id: "q1", label: "Revenue by channel, 30d", metric: "revenue", dimension: "channel", period: "30d" },
  { id: "q2", label: "Churn by plan tier, 90d", metric: "churnRate", dimension: "plan", period: "90d" },
  { id: "q3", label: "New customers by region, 12mo", metric: "newCustomers", dimension: "region", period: "12mo" },
];
