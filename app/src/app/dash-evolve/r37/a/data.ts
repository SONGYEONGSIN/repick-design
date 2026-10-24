/**
 * Northbound — Incident Response Console
 *
 * All data below is literal and deterministic: no Math.random, no Date.now,
 * no `new Date()`. Three metrics (error rate / latency p99 / request
 * volume) each carry three independent, hand-authored time windows (24h /
 * 7d / 30d) of 15-40 points. Anomalies are never hand-listed separately —
 * `classify()` below is the single source of truth, so the chart markers,
 * the "Flagged anomalies" table, and the current-status badge can never
 * drift out of sync with each other.
 */

export type MetricId = "error-rate" | "latency" | "volume";
export type RangeId = "24h" | "7d" | "30d";
export type Severity = "minor" | "moderate" | "severe";

export interface SeriesPoint {
  label: string;
  value: number;
}

export interface Anomaly {
  index: number;
  label: string;
  value: number;
  severity: Severity;
  service: string;
  incidentId: string;
  deltaPct: number;
}

export const METRIC_META: Record<MetricId, { label: string; unit: string }> = {
  "error-rate": { label: "Error rate", unit: "%" },
  latency: { label: "Latency p99", unit: "ms" },
  volume: { label: "Request volume", unit: "req/s" },
};

export const RANGE_META: Record<RangeId, { label: string; description: string }> = {
  "24h": { label: "24h", description: "Last 24 hours" },
  "7d": { label: "7d", description: "Last 7 days" },
  "30d": { label: "30d", description: "Last 30 days" },
};

/** Reference baseline used only to compute each anomaly's deviation text. */
const BASELINE: Record<MetricId, number> = {
  "error-rate": 0.15,
  latency: 200,
  volume: 1050,
};

const SERVICES = [
  "checkout-api",
  "payments-gateway",
  "auth-service",
  "search-index",
  "notification-worker",
  "billing-sync",
] as const;

const METRIC_PREFIX: Record<MetricId, string> = {
  "error-rate": "err",
  latency: "lat",
  volume: "vol",
};

const ACTION_BY_SEVERITY: Record<Severity, string> = {
  minor: "Monitor for recurrence — no immediate action required.",
  moderate: "Check recent deploys and error logs for this service.",
  severe: "Page the on-call engineer now and check upstream dependencies.",
};

export function actionFor(severity: Severity): string {
  return ACTION_BY_SEVERITY[severity];
}

/**
 * Severity thresholds, one set per metric. For error-rate and latency,
 * higher is worse. For volume, lower is worse (a collapse in traffic is
 * the anomaly, not a surge) — `classify` encodes that direction once here
 * so no caller has to remember it.
 */
export function classify(metric: MetricId, value: number): Severity | null {
  if (metric === "volume") {
    if (value >= 900) return null;
    if (value >= 700) return "minor";
    if (value >= 400) return "moderate";
    return "severe";
  }
  const t = metric === "error-rate" ? { t1: 0.8, t2: 1.5, t3: 3.5 } : { t1: 260, t2: 350, t3: 650 };
  if (value < t.t1) return null;
  if (value < t.t2) return "minor";
  if (value < t.t3) return "moderate";
  return "severe";
}

function serviceFor(index: number): string {
  return SERVICES[index % SERVICES.length];
}

function incidentId(metric: MetricId, index: number): string {
  return `inc-${METRIC_PREFIX[metric]}-${index.toString(16).padStart(3, "0")}`;
}

function deltaPct(metric: MetricId, value: number): number {
  const base = BASELINE[metric];
  return Math.round(((value - base) / base) * 100);
}

/** Derives the flagged anomalies for one metric+range from its points — never hand-maintained. */
export function getAnomalies(metric: MetricId, range: RangeId): Anomaly[] {
  const points = SERIES[metric][range];
  const out: Anomaly[] = [];
  points.forEach((p, index) => {
    const severity = classify(metric, p.value);
    if (!severity) return;
    out.push({
      index,
      label: p.label,
      value: p.value,
      severity,
      service: serviceFor(index),
      incidentId: incidentId(metric, index),
      deltaPct: deltaPct(metric, p.value),
    });
  });
  return out;
}

export function getPoints(metric: MetricId, range: RangeId): SeriesPoint[] {
  return SERIES[metric][range];
}

export function statusFor(metric: MetricId, range: RangeId): { severity: Severity | null; label: string } {
  const points = SERIES[metric][range];
  const current = points[points.length - 1].value;
  const severity = classify(metric, current);
  const label = severity === "severe" ? "Critical" : severity === "moderate" ? "Degraded" : severity === "minor" ? "Elevated" : "Healthy";
  return { severity, label };
}

const LABELS_24H = [
  "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00",
  "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00",
] as const;

const LABELS_7D = [
  "D1 00:00", "D1 06:00", "D1 12:00", "D1 18:00",
  "D2 00:00", "D2 06:00", "D2 12:00", "D2 18:00",
  "D3 00:00", "D3 06:00", "D3 12:00", "D3 18:00",
  "D4 00:00", "D4 06:00", "D4 12:00", "D4 18:00",
  "D5 00:00", "D5 06:00", "D5 12:00", "D5 18:00",
  "D6 00:00", "D6 06:00", "D6 12:00", "D6 18:00",
  "D7 00:00", "D7 06:00", "D7 12:00", "D7 18:00",
] as const;

const LABELS_30D = Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`);

function toPoints(labels: readonly string[], values: readonly number[]): SeriesPoint[] {
  return labels.map((label, i) => ({ label, value: values[i] }));
}

const ERROR_RATE_24H = [
  0.12, 0.15, 0.11, 0.14, 0.18, 0.13, 0.16, 0.19, 0.14, 1.84, 0.17, 0.15, 0.13, 0.16, 3.92, 0.18, 0.14, 0.95,
];
const ERROR_RATE_7D = [
  0.14, 0.17, 0.12, 0.19, 0.15, 2.1, 0.16, 0.13, 0.18, 0.14, 0.2, 0.16, 4.55, 0.15, 0.12, 0.19, 0.17, 0.14, 0.21,
  1.35, 0.16, 0.13, 0.18, 0.15, 0.19, 0.88, 0.14, 0.17,
];
const ERROR_RATE_30D = [
  0.13, 0.16, 0.11, 0.18, 1.2, 0.15, 0.17, 0.12, 0.19, 0.14, 0.16, 3.8, 0.15, 0.18, 0.13, 0.2, 0.95, 0.14, 0.17,
  0.12, 0.19, 0.15, 0.16, 2.4, 0.13, 0.18, 0.14, 5.6, 0.16, 0.15,
];

const LATENCY_24H = [
  195, 205, 188, 210, 192, 200, 215, 198, 205, 410, 210, 195, 188, 202, 680, 210, 198, 295,
];
const LATENCY_7D = [
  195, 205, 190, 215, 200, 345, 198, 205, 190, 210, 195, 202, 660, 198, 205, 190, 215, 200, 208,
  480, 195, 205, 190, 212, 198, 330, 205, 195,
];
const LATENCY_30D = [
  198, 205, 192, 215, 300, 200, 208, 195, 210, 198, 205, 700, 195, 210, 200, 208, 310, 198, 205,
  195, 212, 200, 208, 520, 198, 205, 195, 980, 210, 200,
];

const VOLUME_24H = [
  1020, 1080, 990, 1050, 1010, 1090, 1030, 1070, 1000, 590, 1040, 1080, 1020, 1060, 185, 1030, 1070, 860,
];
const VOLUME_7D = [
  1030, 1070, 1000, 1090, 1020, 640, 1050, 1010, 1080, 1000, 1060, 1020, 175, 1040, 1080, 1000, 1070, 1030,
  1090, 510, 1020, 1060, 1000, 1080, 1040, 720, 1060, 1030,
];
const VOLUME_30D = [
  1040, 1000, 1080, 1020, 760, 1060, 1000, 1090, 1030, 1070, 1010, 150, 1050, 1000, 1080, 1020, 790, 1060,
  1000, 1090, 1030, 1070, 1010, 430, 1050, 1000, 1080, 95, 1040, 1010,
];

const SERIES: Record<MetricId, Record<RangeId, SeriesPoint[]>> = {
  "error-rate": {
    "24h": toPoints(LABELS_24H, ERROR_RATE_24H),
    "7d": toPoints(LABELS_7D, ERROR_RATE_7D),
    "30d": toPoints(LABELS_30D, ERROR_RATE_30D),
  },
  latency: {
    "24h": toPoints(LABELS_24H, LATENCY_24H),
    "7d": toPoints(LABELS_7D, LATENCY_7D),
    "30d": toPoints(LABELS_30D, LATENCY_30D),
  },
  volume: {
    "24h": toPoints(LABELS_24H, VOLUME_24H),
    "7d": toPoints(LABELS_7D, VOLUME_7D),
    "30d": toPoints(LABELS_30D, VOLUME_30D),
  },
};

export const RUNBOOK_STEPS = [
  { id: "ack", label: "Acknowledge the page within 5 minutes", defaultChecked: true },
  { id: "commander", label: "Confirm severity and assign an incident commander", defaultChecked: true },
  { id: "channel", label: "Open a dedicated incident channel and post initial status", defaultChecked: false },
  { id: "deploys", label: "Check recent deploys and feature flags for the affected service", defaultChecked: false },
  { id: "mitigate", label: "Mitigate — roll back, scale up, or fail over as appropriate", defaultChecked: false },
  { id: "notify", label: "Notify stakeholders with an updated ETA", defaultChecked: false },
  { id: "postmortem", label: "Write the postmortem within 48 hours of resolution", defaultChecked: false },
] as const;

export const COMMAND_ITEMS = [
  { id: "overview", group: "Pages", label: "Overview dashboard" },
  { id: "incidents", group: "Pages", label: "Incident timeline" },
  { id: "runbooks", group: "Pages", label: "Runbooks" },
  { id: "checkout-api", group: "Services", label: "checkout-api" },
  { id: "payments-gateway", group: "Services", label: "payments-gateway" },
  { id: "auth-service", group: "Services", label: "auth-service" },
  { id: "search-index", group: "Services", label: "search-index" },
  { id: "notification-worker", group: "Services", label: "notification-worker" },
  { id: "billing-sync", group: "Services", label: "billing-sync" },
] as const;
