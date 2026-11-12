/**
 * Outlay — cloud cost allocation console.
 *
 * Every number below is a fixed, hand-authored snapshot: no Math.random, no
 * Date.now, no bare new Date. Totals, budget-remaining, percent-of-total and
 * period-over-period deltas are all *derived* from the per-category amount
 * arrays at module load (see the exported functions at the bottom), so the
 * donut, the legend, the fallback table and the detail panel can never drift
 * out of agreement with each other.
 */

export type PeriodId = "this-month" | "last-month" | "quarter";

export type CategoryId =
  | "compute"
  | "storage"
  | "data-transfer"
  | "databases"
  | "observability"
  | "networking";

export interface CategoryEntry {
  id: CategoryId;
  name: string;
  /** Validated categorical palette, dark surface (see vault dataviz skill). */
  color: string;
  /** Current-period spend, in whole dollars. */
  amount: number;
  /** Same category's spend in the comparison snapshot used for the delta. */
  previousAmount: number;
  /** Budget allocated to this category for the period (sums to period budget). */
  allocated: number;
  note: string;
}

export interface PeriodData {
  label: string;
  /** What the previous-snapshot column is being compared against, in words. */
  comparisonLabel: string;
  categories: CategoryEntry[];
}

export const PERIOD_LABEL: Record<PeriodId, string> = {
  "this-month": "This Month",
  "last-month": "Last Month",
  quarter: "Quarter",
};

const CATEGORY_NOTES: Record<CategoryId, string> = {
  compute: "Autoscaling production workloads across three regions, plus CI build runners.",
  storage: "Object storage and attached volumes, weighted toward the warm media tier.",
  "data-transfer": "Cross-region replication and egress to customer-facing CDNs.",
  databases: "Managed relational and document clusters, including read replicas.",
  observability: "Log retention, trace storage and the on-call paging integration.",
  networking: "Load balancers, VPN gateways and the managed WAF.",
};

export const PERIOD_DATA: Record<PeriodId, PeriodData> = {
  "this-month": {
    label: "This Month",
    comparisonLabel: "vs last month",
    categories: [
      { id: "compute", name: "Compute", color: "#3987e5", amount: 33684, previousAmount: 30324, allocated: 45000, note: CATEGORY_NOTES.compute },
      { id: "storage", name: "Storage", color: "#d95926", amount: 16842, previousAmount: 16758, allocated: 20000, note: CATEGORY_NOTES.storage },
      { id: "data-transfer", name: "Data Transfer", color: "#199e70", amount: 10105, previousAmount: 10374, allocated: 12000, note: CATEGORY_NOTES["data-transfer"] },
      { id: "databases", name: "Databases", color: "#c98500", amount: 12631, previousAmount: 12768, allocated: 15000, note: CATEGORY_NOTES.databases },
      { id: "observability", name: "Observability", color: "#d55181", amount: 6737, previousAmount: 5586, allocated: 5000, note: CATEGORY_NOTES.observability },
      { id: "networking", name: "Networking", color: "#008300", amount: 4211, previousAmount: 3990, allocated: 3000, note: CATEGORY_NOTES.networking },
    ],
  },
  "last-month": {
    label: "Last Month",
    comparisonLabel: "vs the month before",
    categories: [
      { id: "compute", name: "Compute", color: "#3987e5", amount: 30324, previousAmount: 29500, allocated: 45000, note: CATEGORY_NOTES.compute },
      { id: "storage", name: "Storage", color: "#d95926", amount: 16758, previousAmount: 16500, allocated: 20000, note: CATEGORY_NOTES.storage },
      { id: "data-transfer", name: "Data Transfer", color: "#199e70", amount: 10374, previousAmount: 10600, allocated: 12000, note: CATEGORY_NOTES["data-transfer"] },
      { id: "databases", name: "Databases", color: "#c98500", amount: 12768, previousAmount: 12900, allocated: 15000, note: CATEGORY_NOTES.databases },
      { id: "observability", name: "Observability", color: "#d55181", amount: 5586, previousAmount: 5200, allocated: 5000, note: CATEGORY_NOTES.observability },
      { id: "networking", name: "Networking", color: "#008300", amount: 3990, previousAmount: 4100, allocated: 3000, note: CATEGORY_NOTES.networking },
    ],
  },
  quarter: {
    label: "Quarter",
    comparisonLabel: "vs prior quarter",
    categories: [
      { id: "compute", name: "Compute", color: "#3987e5", amount: 97500, previousAmount: 93000, allocated: 135000, note: CATEGORY_NOTES.compute },
      { id: "storage", name: "Storage", color: "#d95926", amount: 50000, previousAmount: 49000, allocated: 60000, note: CATEGORY_NOTES.storage },
      { id: "data-transfer", name: "Data Transfer", color: "#199e70", amount: 30000, previousAmount: 29500, allocated: 36000, note: CATEGORY_NOTES["data-transfer"] },
      { id: "databases", name: "Databases", color: "#c98500", amount: 40000, previousAmount: 39000, allocated: 45000, note: CATEGORY_NOTES.databases },
      { id: "observability", name: "Observability", color: "#d55181", amount: 20000, previousAmount: 19000, allocated: 15000, note: CATEGORY_NOTES.observability },
      { id: "networking", name: "Networking", color: "#008300", amount: 12500, previousAmount: 12200, allocated: 9000, note: CATEGORY_NOTES.networking },
    ],
  },
};

/** Trailing six-month total-spend history, its own fixed time frame (ends at this month's total). */
export const SPEND_HISTORY = [68950, 71980, 75410, 77260, 79800, 84210];

export const CURRENT_USER = { name: "Priya Natarajan", email: "priya@outlay.io", initials: "PN" };

export const WORKSPACES = ["Acme Platform Eng", "Acme Data Infra", "Acme Growth"];

export function periodTotal(period: PeriodId): number {
  return PERIOD_DATA[period].categories.reduce((sum, c) => sum + c.amount, 0);
}

export function periodPreviousTotal(period: PeriodId): number {
  return PERIOD_DATA[period].categories.reduce((sum, c) => sum + c.previousAmount, 0);
}

export function periodBudget(period: PeriodId): number {
  return PERIOD_DATA[period].categories.reduce((sum, c) => sum + c.allocated, 0);
}

export function categoryPercent(category: CategoryEntry, total: number): number {
  return (category.amount / total) * 100;
}

export function categoryDeltaPct(category: CategoryEntry): number {
  return ((category.amount - category.previousAmount) / category.previousAmount) * 100;
}

/** The category whose |amount - previousAmount| moved the most this period. */
export function topMover(period: PeriodId): CategoryEntry {
  const categories = PERIOD_DATA[period].categories;
  return categories.reduce((top, c) =>
    Math.abs(c.amount - c.previousAmount) > Math.abs(top.amount - top.previousAmount) ? c : top,
  categories[0]);
}

/** Largest category by spend — used as the default selection so the detail panel is never blank. */
export function largestCategory(period: PeriodId): CategoryEntry {
  const categories = PERIOD_DATA[period].categories;
  return categories.reduce((max, c) => (c.amount > max.amount ? c : max), categories[0]);
}
