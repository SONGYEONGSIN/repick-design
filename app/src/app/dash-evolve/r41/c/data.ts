// Deterministic 24-hour synthetic telemetry for the Pulsegrid anomaly console.
// Every number below is a fixed literal — no Math.random, no Date.now, no bare `new Date()` — so the
// dataset (and every anomaly flagged against it) is identical on every render, server or client.

export type MetricKey = "latency" | "errorRate" | "cpu";
export type Severity = "warning" | "critical";
export type AnomalyDirection = "above" | "below";

export interface MetricPoint {
  hour: string; // "00:00" .. "23:00"
  actual: number;
  expectedLow: number;
  expectedHigh: number;
}

export interface MetricDef {
  key: MetricKey;
  label: string;
  shortLabel: string;
  description: string;
  unit: string;
  decimals: number;
  points: MetricPoint[];
}

export interface AnomalyEvent {
  metricKey: MetricKey;
  hour: string;
  index: number;
  actual: number;
  expectedLow: number;
  expectedHigh: number;
  direction: AnomalyDirection;
  deviation: number;
  severity: Severity;
}

function pts(rows: Array<[string, number, number, number]>): MetricPoint[] {
  return rows.map(([hour, actual, expectedLow, expectedHigh]) => ({ hour, actual, expectedLow, expectedHigh }));
}

const LATENCY_POINTS = pts([
  ["00:00", 110, 90, 130],
  ["01:00", 105, 86, 124],
  ["02:00", 100, 82, 118],
  ["03:00", 58, 80, 116],
  ["04:00", 100, 82, 118],
  ["05:00", 105, 86, 124],
  ["06:00", 112, 92, 132],
  ["07:00", 122, 100, 144],
  ["08:00", 132, 108, 156],
  ["09:00", 231, 115, 165],
  ["10:00", 146, 120, 172],
  ["11:00", 150, 123, 177],
  ["12:00", 154, 126, 182],
  ["13:00", 158, 130, 186],
  ["14:00", 289, 133, 191],
  ["15:00", 158, 130, 186],
  ["16:00", 152, 125, 179],
  ["17:00", 146, 120, 172],
  ["18:00", 138, 113, 163],
  ["19:00", 130, 107, 153],
  ["20:00", 124, 102, 146],
  ["21:00", 120, 98, 142],
  ["22:00", 116, 95, 137],
  ["23:00", 112, 92, 132],
]);

const ERROR_RATE_POINTS = pts([
  ["00:00", 0.3, 0.0, 0.6],
  ["01:00", 0.3, 0.0, 0.6],
  ["02:00", 0.2, 0.0, 0.5],
  ["03:00", 0.2, 0.0, 0.5],
  ["04:00", 0.2, 0.0, 0.5],
  ["05:00", 0.3, 0.0, 0.6],
  ["06:00", 0.4, 0.1, 0.7],
  ["07:00", 0.5, 0.2, 0.8],
  ["08:00", 0.6, 0.3, 0.9],
  ["09:00", 0.6, 0.3, 0.9],
  ["10:00", 0.7, 0.4, 1.0],
  ["11:00", 3.4, 0.4, 1.0],
  ["12:00", 0.8, 0.5, 1.1],
  ["13:00", 0.8, 0.5, 1.1],
  ["14:00", 0.7, 0.4, 1.0],
  ["15:00", 0.7, 0.4, 1.0],
  ["16:00", 0.6, 0.3, 0.9],
  ["17:00", 0.6, 0.3, 0.9],
  ["18:00", 0.5, 0.2, 0.8],
  ["19:00", 1.3, 0.2, 0.8],
  ["20:00", 0.4, 0.1, 0.7],
  ["21:00", 0.4, 0.1, 0.7],
  ["22:00", 0.3, 0.0, 0.6],
  ["23:00", 0.3, 0.0, 0.6],
]);

const CPU_POINTS = pts([
  ["00:00", 28, 22, 34],
  ["01:00", 26, 21, 31],
  ["02:00", 24, 19, 29],
  ["03:00", 22, 18, 26],
  ["04:00", 23, 18, 28],
  ["05:00", 26, 21, 31],
  ["06:00", 89, 24, 36],
  ["07:00", 36, 29, 43],
  ["08:00", 42, 34, 50],
  ["09:00", 48, 38, 58],
  ["10:00", 52, 42, 62],
  ["11:00", 55, 44, 66],
  ["12:00", 58, 46, 70],
  ["13:00", 60, 48, 72],
  ["14:00", 57, 46, 68],
  ["15:00", 54, 43, 65],
  ["16:00", 25, 40, 60],
  ["17:00", 46, 37, 55],
  ["18:00", 40, 32, 48],
  ["19:00", 36, 29, 43],
  ["20:00", 32, 26, 38],
  ["21:00", 30, 24, 36],
  ["22:00", 28, 22, 34],
  ["23:00", 26, 21, 31],
]);

export const METRICS: MetricDef[] = [
  {
    key: "latency",
    label: "Request latency (p95)",
    shortLabel: "Latency",
    description: "95th-percentile response time across the edge fleet.",
    unit: "ms",
    decimals: 0,
    points: LATENCY_POINTS,
  },
  {
    key: "errorRate",
    label: "Error rate",
    shortLabel: "Errors",
    description: "Share of requests returning a 5xx response.",
    unit: "%",
    decimals: 1,
    points: ERROR_RATE_POINTS,
  },
  {
    key: "cpu",
    label: "CPU utilization",
    shortLabel: "CPU",
    description: "Average core utilization across the checkout service pool.",
    unit: "%",
    decimals: 0,
    points: CPU_POINTS,
  },
];

export function metricByKey(key: MetricKey): MetricDef {
  return METRICS.find((m) => m.key === key) ?? METRICS[0]!;
}

export function pointDirection(p: MetricPoint): AnomalyDirection | null {
  if (p.actual > p.expectedHigh) return "above";
  if (p.actual < p.expectedLow) return "below";
  return null;
}

export function pointDeviation(p: MetricPoint): number {
  const direction = pointDirection(p);
  if (direction === "above") return round2(p.actual - p.expectedHigh);
  if (direction === "below") return round2(p.expectedLow - p.actual);
  return 0;
}

export function pointSeverity(p: MetricPoint): Severity {
  const deviation = pointDeviation(p);
  const bandWidth = Math.max(1, p.expectedHigh - p.expectedLow);
  return deviation / bandWidth >= 1 ? "critical" : "warning";
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/** All flagged points for one metric, in chronological order. */
export function anomaliesForMetric(metric: MetricDef): AnomalyEvent[] {
  const events: AnomalyEvent[] = [];
  metric.points.forEach((p, index) => {
    const direction = pointDirection(p);
    if (!direction) return;
    events.push({
      metricKey: metric.key,
      hour: p.hour,
      index,
      actual: p.actual,
      expectedLow: p.expectedLow,
      expectedHigh: p.expectedHigh,
      direction,
      deviation: pointDeviation(p),
      severity: pointSeverity(p),
    });
  });
  return events;
}

/** The anomaly with the largest deviation for a metric — used as the default focus so no panel on
 *  this page is ever empty by default. */
export function mostSevereAnomaly(metric: MetricDef): AnomalyEvent | null {
  const events = anomaliesForMetric(metric);
  if (events.length === 0) return null;
  return events.reduce((worst, e) => (e.deviation > worst.deviation ? e : worst), events[0]!);
}

export function withinRangePct(metric: MetricDef): number {
  const anomalyCount = anomaliesForMetric(metric).length;
  const total = metric.points.length;
  return round2(((total - anomalyCount) / total) * 100);
}

export const CURRENT_USER = {
  name: "Priya Natarajan",
  initials: "PN",
  email: "priya@pulsegrid.io",
};

export const WORKSPACES = ["Pulsegrid — Production", "Pulsegrid — Staging"];
