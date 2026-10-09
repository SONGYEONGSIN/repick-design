// Vantage — supplier scorecard dummy data.
// All figures are static, hand-authored constants. No Math.random, no Date.now, no bare `new
// Date()` anywhere in this module or its consumers — required for deterministic SSR/CSR output.

export type AxisId =
  | "cost"
  | "quality"
  | "speed"
  | "reliability"
  | "support"
  | "compliance";

export interface Axis {
  id: AxisId;
  label: string;
  /** Short label used where horizontal space is tight (table header, chip caption). */
  short: string;
}

// Order here fixes the radar's clockwise vertex order, starting at 12 o'clock.
export const AXES: Axis[] = [
  { id: "cost", label: "Cost Efficiency", short: "Cost" },
  { id: "quality", label: "Quality", short: "Quality" },
  { id: "speed", label: "Delivery Speed", short: "Speed" },
  { id: "reliability", label: "Reliability", short: "Reliability" },
  { id: "support", label: "Support", short: "Support" },
  { id: "compliance", label: "Compliance", short: "Compliance" },
];

export type PeriodId = "q3-2026" | "q2-2026";

export interface Period {
  id: PeriodId;
  label: string;
}

export const PERIODS: Period[] = [
  { id: "q3-2026", label: "Q3 2026" },
  { id: "q2-2026", label: "Q2 2026" },
];

export type VendorStatus = "preferred" | "standard" | "at-risk";

export interface Vendor {
  id: string;
  name: string;
  initials: string;
  category: string;
  status: VendorStatus;
  scores: Record<PeriodId, Record<AxisId, number>>;
}

export const VENDORS: Vendor[] = [
  {
    id: "nordhaven",
    name: "Nordhaven Supply Co.",
    initials: "NS",
    category: "Raw Materials",
    status: "preferred",
    scores: {
      "q3-2026": { cost: 72, quality: 88, speed: 81, reliability: 90, support: 76, compliance: 94 },
      "q2-2026": { cost: 70, quality: 85, speed: 79, reliability: 87, support: 73, compliance: 91 },
    },
  },
  {
    id: "atlas",
    name: "Atlas Components",
    initials: "AC",
    category: "Electronics",
    status: "standard",
    scores: {
      "q3-2026": { cost: 85, quality: 70, speed: 74, reliability: 68, support: 62, compliance: 77 },
      "q2-2026": { cost: 82, quality: 68, speed: 72, reliability: 65, support: 60, compliance: 75 },
    },
  },
  {
    id: "meridian",
    name: "Meridian Fabrication",
    initials: "MF",
    category: "Machined Parts",
    status: "preferred",
    scores: {
      "q3-2026": { cost: 64, quality: 92, speed: 70, reliability: 88, support: 84, compliance: 90 },
      "q2-2026": { cost: 61, quality: 89, speed: 68, reliability: 85, support: 80, compliance: 87 },
    },
  },
  {
    id: "quantum",
    name: "Quantum Freight Partners",
    initials: "QF",
    category: "Logistics",
    status: "at-risk",
    scores: {
      "q3-2026": { cost: 90, quality: 58, speed: 95, reliability: 54, support: 48, compliance: 61 },
      "q2-2026": { cost: 88, quality: 55, speed: 93, reliability: 50, support: 45, compliance: 57 },
    },
  },
  {
    id: "silvercrest",
    name: "Silvercrest Materials",
    initials: "SM",
    category: "Raw Materials",
    status: "standard",
    scores: {
      "q3-2026": { cost: 78, quality: 75, speed: 66, reliability: 73, support: 70, compliance: 80 },
      "q2-2026": { cost: 75, quality: 72, speed: 64, reliability: 70, support: 67, compliance: 77 },
    },
  },
  {
    id: "ironclad",
    name: "Ironclad Logistics",
    initials: "IL",
    category: "Logistics",
    status: "standard",
    scores: {
      "q3-2026": { cost: 69, quality: 73, speed: 89, reliability: 77, support: 66, compliance: 72 },
      "q2-2026": { cost: 66, quality: 70, speed: 86, reliability: 74, support: 63, compliance: 69 },
    },
  },
  {
    id: "brightline",
    name: "Brightline Parts",
    initials: "BP",
    category: "Electronics",
    status: "at-risk",
    scores: {
      "q3-2026": { cost: 95, quality: 52, speed: 60, reliability: 50, support: 44, compliance: 58 },
      "q2-2026": { cost: 93, quality: 49, speed: 57, reliability: 46, support: 40, compliance: 54 },
    },
  },
];

export const DEFAULT_SELECTED_IDS = ["nordhaven", "atlas", "meridian"];
export const MAX_SELECTED = 4;

// Static program-level figures not modeled per-axis (kept as plain constants, not derived —
// still deterministic dummy data, just not a sum of the axis table above).
export const CONTRACTS_EXPIRING_60D = 3;

export function overallScore(scores: Record<AxisId, number>): number {
  const sum = AXES.reduce((total, axis) => total + scores[axis.id], 0);
  return Math.round(sum / AXES.length);
}

/** Four synthetic prior quarters feeding each KPI sparkline, derived (not hardcoded) from the
 *  live Q3/Q2 overlay average so the trend line never contradicts the numbers on screen. */
export function trendFromCurrent(q2Avg: number, q3Avg: number): number[] {
  const step = (q3Avg - q2Avg) / 2;
  return [
    Math.round(q2Avg - step * 2),
    Math.round(q2Avg - step),
    Math.round(q2Avg),
    Math.round(q3Avg),
  ];
}

export interface SeriesStyle {
  id: string;
  color: string;
  dash: string | undefined;
  marker: "circle" | "square" | "triangle" | "diamond";
  patternLabel: string;
}

// Four fixed, order-assigned styles (first vendor toggled on gets style 0, and so on). Color is
// never the only differentiator: each also carries a distinct stroke pattern and vertex-marker
// shape, per the catalog's multi-series rule.
export const SERIES_STYLES: SeriesStyle[] = [
  { id: "s0", color: "#2563EB", dash: undefined, marker: "circle", patternLabel: "Solid line, circle marker" },
  { id: "s1", color: "#B45309", dash: "4 2.4", marker: "square", patternLabel: "Dashed line, square marker" },
  { id: "s2", color: "#BE185D", dash: "1 2.2", marker: "triangle", patternLabel: "Dotted line, triangle marker" },
  { id: "s3", color: "#0D9488", dash: "5 1.6 1.2 1.6", marker: "diamond", patternLabel: "Dash-dot line, diamond marker" },
];

export function vendorById(id: string): Vendor | undefined {
  return VENDORS.find((v) => v.id === id);
}
