/**
 * Vendly — vendor renewal intelligence console.
 *
 * Every figure below is a fixed literal. No `Math.random`, no `Date.now`, no bare `new Date()`:
 * the "current cycle" vs "prior cycle" pair is two authored snapshots of the same six vendor
 * contracts, and every derived figure (YoY price change for the *current* cycle, portfolio
 * totals, averages, at-risk counts) is computed from these literals at render time so it can
 * never drift out of sync with what the table and chart print. Where no third data point exists
 * to derive from (the *prior* cycle's own YoY change, since that would need a cycle before it),
 * the figure is authored directly and never cross-checked against another on-screen number.
 */

export type Period = "current" | "prior";

export type VendorId = "northbeam" | "ferry" | "loomwork" | "haven" | "quillix" | "tideline";

export interface VendorMetrics {
  /** Annual contract cost, USD. */
  cost: number;
  /** Licensed seats. */
  seats: number;
  /** Active-seat utilization, 0-100. */
  utilizationPct: number;
  /** Renewal risk score, 0-100 — higher is worse. */
  riskScore: number;
  /** Support SLA rating, 0-5. */
  slaRating: number;
  /** Year-over-year contract price change, percent. Can be negative. */
  priceChangePct: number;
}

export interface Vendor {
  id: VendorId;
  name: string;
  /** Short 2-letter code used as the chart's end-of-line label (color is never the only cue). */
  code: string;
  category: string;
  /** Six-point annual cost history ending at [prior, current] — those last two values are the
   *  exact same numbers shown elsewhere for the prior/current cycle, so the sparkline and the
   *  printed figures can never disagree. */
  costHistory: number[];
  metrics: Record<Period, VendorMetrics>;
}

export const PERIODS: { value: Period; label: string }[] = [
  { value: "current", label: "Current renewal cycle" },
  { value: "prior", label: "Prior renewal cycle" },
];

export const VENDOR_ORDER: VendorId[] = ["northbeam", "ferry", "loomwork", "haven", "quillix", "tideline"];

export const VENDORS: Record<VendorId, Vendor> = {
  northbeam: {
    id: "northbeam",
    name: "Northbeam Analytics",
    code: "NB",
    category: "Analytics & BI",
    costHistory: [68000, 72000, 75000, 77000, 79000, 84000],
    metrics: {
      current: { cost: 84000, seats: 120, utilizationPct: 78, riskScore: 42, slaRating: 4.2, priceChangePct: 6.3 },
      prior: { cost: 79000, seats: 110, utilizationPct: 71, riskScore: 46, slaRating: 4.0, priceChangePct: 5.0 },
    },
  },
  ferry: {
    id: "ferry",
    name: "Ferry CRM",
    code: "FC",
    category: "Sales CRM",
    costHistory: [138000, 142000, 146000, 148000, 151000, 156000],
    metrics: {
      current: { cost: 156000, seats: 240, utilizationPct: 91, riskScore: 28, slaRating: 4.6, priceChangePct: 3.3 },
      prior: { cost: 151000, seats: 230, utilizationPct: 88, riskScore: 31, slaRating: 4.5, priceChangePct: 4.0 },
    },
  },
  loomwork: {
    id: "loomwork",
    name: "Loomwork Docs",
    code: "LD",
    category: "Docs & Collaboration",
    costHistory: [30000, 33000, 35000, 37000, 38000, 42000],
    metrics: {
      current: { cost: 42000, seats: 300, utilizationPct: 54, riskScore: 61, slaRating: 3.4, priceChangePct: 10.5 },
      prior: { cost: 38000, seats: 280, utilizationPct: 49, riskScore: 58, slaRating: 3.3, priceChangePct: 9.0 },
    },
  },
  haven: {
    id: "haven",
    name: "Haven Support",
    code: "HS",
    category: "Customer Support",
    costHistory: [88000, 90000, 92000, 94000, 95000, 97000],
    metrics: {
      current: { cost: 97000, seats: 85, utilizationPct: 88, riskScore: 35, slaRating: 4.8, priceChangePct: 2.1 },
      prior: { cost: 95000, seats: 80, utilizationPct: 85, riskScore: 39, slaRating: 4.7, priceChangePct: 1.5 },
    },
  },
  quillix: {
    id: "quillix",
    name: "Quillix Billing",
    code: "QB",
    category: "Billing & Finance",
    costHistory: [105000, 110000, 115000, 119000, 122000, 132000],
    metrics: {
      current: { cost: 132000, seats: 150, utilizationPct: 69, riskScore: 57, slaRating: 3.9, priceChangePct: 8.2 },
      prior: { cost: 122000, seats: 140, utilizationPct: 64, riskScore: 60, slaRating: 3.8, priceChangePct: 7.0 },
    },
  },
  tideline: {
    id: "tideline",
    name: "Tideline Design",
    code: "TD",
    category: "Design & Prototyping",
    costHistory: [74000, 72500, 71500, 70500, 69500, 68000],
    metrics: {
      current: { cost: 68000, seats: 60, utilizationPct: 94, riskScore: 18, slaRating: 4.9, priceChangePct: -2.2 },
      prior: { cost: 69500, seats: 55, utilizationPct: 92, riskScore: 22, slaRating: 4.8, priceChangePct: -1.0 },
    },
  },
};

export const VENDOR_LIST: Vendor[] = VENDOR_ORDER.map((id) => VENDORS[id]);

/** The default pinned entity on first paint — the highest-risk vendor in the default ("current")
 *  cycle. Computed from the literals above, not guessed, so it stays correct if the data changes. */
export const DEFAULT_PINNED_ID: VendorId = VENDOR_LIST.reduce((leader, v) =>
  v.metrics.current.riskScore > leader.metrics.current.riskScore ? v : leader
).id;

export const RISK_FLAG_THRESHOLD = 50;

export type AxisId = "cost" | "seats" | "utilization" | "risk" | "sla" | "priceChange";

export interface AxisConfig {
  id: AxisId;
  label: string;
  shortLabel: string;
  accessor: (m: VendorMetrics) => number;
  format: (v: number) => string;
}

export const AXES: AxisConfig[] = [
  { id: "cost", label: "Annual Cost", shortLabel: "Cost", accessor: (m) => m.cost, format: (v) => formatCompactCurrency(v) },
  { id: "seats", label: "Seats Licensed", shortLabel: "Seats", accessor: (m) => m.seats, format: (v) => `${Math.round(v)}` },
  { id: "utilization", label: "Seat Utilization", shortLabel: "Util", accessor: (m) => m.utilizationPct, format: (v) => `${Math.round(v)}%` },
  { id: "risk", label: "Renewal Risk", shortLabel: "Risk", accessor: (m) => m.riskScore, format: (v) => `${Math.round(v)}` },
  { id: "sla", label: "Support SLA", shortLabel: "SLA", accessor: (m) => m.slaRating, format: (v) => v.toFixed(1) },
  { id: "priceChange", label: "YoY Price Change", shortLabel: "Price Δ", accessor: (m) => m.priceChangePct, format: (v) => `${v >= 0 ? "+" : ""}${v.toFixed(1)}%` },
];

function formatCompactCurrency(v: number): string {
  return `$${Math.round(v / 1000)}k`;
}

export function metricsFor(id: VendorId, period: Period): VendorMetrics {
  return VENDORS[id].metrics[period];
}

export function totalCost(period: Period): number {
  return VENDOR_LIST.reduce((sum, v) => sum + v.metrics[period].cost, 0);
}

export function averageUtilization(period: Period): number {
  const sum = VENDOR_LIST.reduce((acc, v) => acc + v.metrics[period].utilizationPct, 0);
  return sum / VENDOR_LIST.length;
}

export function atRiskVendors(period: Period): Vendor[] {
  return VENDOR_LIST.filter((v) => v.metrics[period].riskScore >= RISK_FLAG_THRESHOLD);
}

export function highestRiskVendor(period: Period): { vendor: Vendor; value: number } {
  const vendor = VENDOR_LIST.reduce((leader, v) => (v.metrics[period].riskScore > leader.metrics[period].riskScore ? v : leader));
  return { vendor, value: vendor.metrics[period].riskScore };
}

export function highestPriceChangeVendor(period: Period): { vendor: Vendor; value: number } {
  const vendor = VENDOR_LIST.reduce((leader, v) => (v.metrics[period].priceChangePct > leader.metrics[period].priceChangePct ? v : leader));
  return { vendor, value: vendor.metrics[period].priceChangePct };
}

export function axisDomain(axis: AxisConfig, period: Period): { min: number; max: number } {
  const values = VENDOR_LIST.map((v) => axis.accessor(v.metrics[period]));
  const min = Math.min(...values);
  const max = Math.max(...values);
  return min === max ? { min: min - 1, max: max + 1 } : { min, max };
}
