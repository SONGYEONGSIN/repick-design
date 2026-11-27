// Deterministic demo data for Quorum, a reliability/observability console for a
// platform-engineering team. No Math.random / Date.now / new Date anywhere in this
// file or any consumer — every "time ago" value is a fixed, literal minute offset
// inside this fictional dataset, never real wall-clock time.

export type Severity = "critical" | "warning" | "info";
export type IncidentStatus = "open" | "investigating" | "resolved";
export type Period = "1h" | "24h" | "7d";
export type ServiceStatus = "operational" | "degraded" | "down";

export const BRAND_NAME = "Quorum";
export const BRAND_TAGLINE = "Reliability Console";

export const WORKSPACES = ["Platform Engineering", "Payments Guild"];

export const CURRENT_USER = {
  name: "Jules Ferrant",
  email: "jules.ferrant@quorum.io",
  initials: "JF",
};

export const PERIODS: { value: Period; label: string; windowMinutes: number }[] = [
  { value: "1h", label: "1 hour", windowMinutes: 60 },
  { value: "24h", label: "24 hours", windowMinutes: 1440 },
  { value: "7d", label: "7 days", windowMinutes: 10080 },
];

export const DEFAULT_PERIOD: Period = "24h";

// ---------------------------------------------------------------------------
// Services (box-plot bench groups + feed/table subject)
// ---------------------------------------------------------------------------

export type Service = {
  id: string;
  name: string;
  short: string;
  description: string;
  uptime30d: number;
};

export const SERVICES: Service[] = [
  { id: "checkout-api", name: "Checkout API", short: "Checkout", description: "Cart pricing and order creation", uptime30d: 98.42 },
  { id: "payments-api", name: "Payments API", short: "Payments", description: "Card authorization and capture", uptime30d: 99.21 },
  { id: "search-api", name: "Search API", short: "Search", description: "Catalog query and ranking", uptime30d: 99.88 },
  { id: "auth-api", name: "Auth API", short: "Auth", description: "Session issuance and token refresh", uptime30d: 99.95 },
  { id: "notifications-svc", name: "Notifications", short: "Notif.", description: "Email, SMS and push dispatch", uptime30d: 99.97 },
  { id: "media-cdn", name: "Media CDN", short: "Media", description: "Product image and asset edge cache", uptime30d: 99.99 },
];

export const SERVICE_BY_ID: Record<string, Service> = Object.fromEntries(SERVICES.map((s) => [s.id, s]));

// Latency distribution parameters, one pair per service (same order as SERVICES).
// base = typical response time in ms, amplitude = how widely it swings.
const SERVICE_BASE = [210, 165, 120, 45, 35, 22];
const SERVICE_AMPLITUDE = [90, 70, 55, 18, 12, 9];

const PERIOD_AMP_FACTOR: Record<Period, number> = { "1h": 0.75, "24h": 1, "7d": 1.3 };
const PERIOD_BASE_FACTOR: Record<Period, number> = { "1h": 0.95, "24h": 1, "7d": 1.08 };
const PERIOD_SAMPLE_COUNT: Record<Period, number> = { "1h": 24, "24h": 48, "7d": 96 };
const PERIOD_INDEX: Record<Period, number> = { "1h": 0, "24h": 1, "7d": 2 };

/**
 * Deterministic chronological latency series for one service in one period. Pure
 * function of (serviceIndex, period, sampleCount) — same inputs always yield the
 * same output, so there is nothing per-render to disagree between SSR and client.
 * Built from stacked sine/cosine waves (never Math.random), rounded to whole ms.
 */
function generateLatencySeries(serviceIndex: number, period: Period): number[] {
  const count = PERIOD_SAMPLE_COUNT[period];
  const periodIndex = PERIOD_INDEX[period];
  const base = SERVICE_BASE[serviceIndex] * PERIOD_BASE_FACTOR[period];
  const amp = SERVICE_AMPLITUDE[serviceIndex] * PERIOD_AMP_FACTOR[period];
  const series: number[] = [];
  for (let i = 0; i < count; i++) {
    const t = i / count;
    const wave = Math.sin(t * Math.PI * 2 * (serviceIndex + 2) + periodIndex * 0.7 + serviceIndex * 1.3);
    const wave2 = Math.cos(t * Math.PI * 4 + serviceIndex * 0.5 + periodIndex * 1.1);
    const ripple = Math.sin((i + 1) * (serviceIndex * 3 + 5) * 0.37);
    const value = base + amp * (0.55 * wave + 0.3 * wave2 + 0.15 * ripple);
    series.push(Math.max(6, Math.round(value)));
  }
  return series;
}

/**
 * Linear-interpolation percentile over a value array — sorts a copy, never mutates
 * the input. This is the ONLY place percentiles are computed anywhere on the page,
 * so min <= Q1 <= median <= Q3 <= max holds for every group by construction: each
 * is just this same monotonic function evaluated at a higher p.
 */
export function percentile(values: number[], p: number): number {
  const sorted = [...values].sort((a, b) => a - b);
  if (sorted.length === 1) return sorted[0];
  const idx = (sorted.length - 1) * p;
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  const frac = idx - lo;
  return sorted[lo] + (sorted[hi] - sorted[lo]) * frac;
}

export type FiveNumberSummary = { min: number; q1: number; median: number; q3: number; max: number };

export function fiveNumberSummary(values: number[]): FiveNumberSummary {
  const sorted = [...values].sort((a, b) => a - b);
  return {
    min: Math.round(sorted[0]),
    q1: Math.round(percentile(sorted, 0.25)),
    median: Math.round(percentile(sorted, 0.5)),
    q3: Math.round(percentile(sorted, 0.75)),
    max: Math.round(sorted[sorted.length - 1]),
  };
}

// Precomputed once at module load: series, five-number summaries and p95 per
// service per period. Nothing here is hand-typed — all derived from the two
// functions above applied to the generated series.
export const LATENCY_SERIES: Record<string, Record<Period, number[]>> = {};
export const LATENCY_SUMMARY: Record<string, Record<Period, FiveNumberSummary>> = {};
export const LATENCY_P95: Record<string, Record<Period, number>> = {};

SERVICES.forEach((service, index) => {
  LATENCY_SERIES[service.id] = {} as Record<Period, number[]>;
  LATENCY_SUMMARY[service.id] = {} as Record<Period, FiveNumberSummary>;
  LATENCY_P95[service.id] = {} as Record<Period, number>;
  (["1h", "24h", "7d"] as Period[]).forEach((period) => {
    const series = generateLatencySeries(index, period);
    LATENCY_SERIES[service.id][period] = series;
    LATENCY_SUMMARY[service.id][period] = fiveNumberSummary(series);
    LATENCY_P95[service.id][period] = Math.round(percentile(series, 0.95));
  });
});

/** Fleet-wide five-number summary for a period: every service's series merged,
 *  run through the same `fiveNumberSummary`. Used by the KPI strip so the fleet
 *  figure is never a separate hand-typed number. */
export function fleetSummary(period: Period): FiveNumberSummary {
  const merged = SERVICES.flatMap((s) => LATENCY_SERIES[s.id][period]);
  return fiveNumberSummary(merged);
}

export function fleetP95(period: Period): number {
  const merged = SERVICES.flatMap((s) => LATENCY_SERIES[s.id][period]);
  return Math.round(percentile(merged, 0.95));
}

// ---------------------------------------------------------------------------
// On-call assignees
// ---------------------------------------------------------------------------

export type Assignee = { name: string; initials: string; avatarClass: string };

export const ASSIGNEES: Record<string, Assignee> = {
  MO: { name: "Mara Oyelaran", initials: "MO", avatarClass: "bg-teal-100 text-teal-700" },
  DK: { name: "Devin Kato", initials: "DK", avatarClass: "bg-indigo-100 text-indigo-700" },
  PN: { name: "Priya Nandan", initials: "PN", avatarClass: "bg-fuchsia-100 text-fuchsia-700" },
};

export const ON_CALL: Record<string, string> = {
  "checkout-api": "MO",
  "payments-api": "DK",
  "search-api": "PN",
  "auth-api": "DK",
  "notifications-svc": "MO",
  "media-cdn": "PN",
};

// ---------------------------------------------------------------------------
// Incident feed (central activity stream)
// ---------------------------------------------------------------------------

export type Incident = {
  id: string;
  serviceId: string;
  severity: Severity;
  status: IncidentStatus;
  message: string;
  ageMinutes: number;
  durationMinutes: number | null;
  assignee: string;
};

// Sorted newest first (ascending ageMinutes). ageMinutes is a fixed literal offset
// inside this fictional dataset's "now" — never computed from the real clock.
export const INCIDENTS: Incident[] = [
  { id: "INC-241", serviceId: "checkout-api", severity: "critical", status: "open", message: "p95 latency exceeded 450ms threshold for 5 consecutive checks", ageMinutes: 6, durationMinutes: null, assignee: "MO" },
  { id: "INC-240", serviceId: "payments-api", severity: "warning", status: "investigating", message: "Elevated error rate on /charge endpoint (2.1%)", ageMinutes: 22, durationMinutes: null, assignee: "DK" },
  { id: "INC-239", serviceId: "search-api", severity: "info", status: "resolved", message: "Index rebuild completed, latency normalized", ageMinutes: 48, durationMinutes: 35, assignee: "PN" },
  { id: "INC-238", serviceId: "checkout-api", severity: "warning", status: "open", message: "Downstream inventory-service timeout spike", ageMinutes: 55, durationMinutes: null, assignee: "MO" },
  { id: "INC-237", serviceId: "auth-api", severity: "info", status: "resolved", message: "Scheduled token-cache warmup", ageMinutes: 95, durationMinutes: 12, assignee: "DK" },
  { id: "INC-236", serviceId: "media-cdn", severity: "warning", status: "resolved", message: "Edge node us-east-2b degraded, traffic rerouted", ageMinutes: 140, durationMinutes: 40, assignee: "PN" },
  { id: "INC-235", serviceId: "notifications-svc", severity: "info", status: "resolved", message: "Delivery queue backlog cleared", ageMinutes: 210, durationMinutes: 18, assignee: "MO" },
  { id: "INC-234", serviceId: "payments-api", severity: "critical", status: "resolved", message: "Webhook retry storm from provider-side outage", ageMinutes: 340, durationMinutes: 65, assignee: "DK" },
  { id: "INC-233", serviceId: "search-api", severity: "warning", status: "resolved", message: "Query-planner regression after deploy", ageMinutes: 520, durationMinutes: 90, assignee: "PN" },
  { id: "INC-232", serviceId: "checkout-api", severity: "critical", status: "resolved", message: "Cart service OOM crash loop", ageMinutes: 980, durationMinutes: 120, assignee: "MO" },
  { id: "INC-231", serviceId: "auth-api", severity: "warning", status: "resolved", message: "OAuth provider intermittent 503 responses", ageMinutes: 1500, durationMinutes: 50, assignee: "DK" },
  { id: "INC-230", serviceId: "media-cdn", severity: "info", status: "resolved", message: "TLS certificate rotation", ageMinutes: 2600, durationMinutes: 5, assignee: "PN" },
  { id: "INC-229", serviceId: "payments-api", severity: "warning", status: "resolved", message: "Rate limiter false-positive blocked valid traffic", ageMinutes: 4200, durationMinutes: 75, assignee: "DK" },
  { id: "INC-228", serviceId: "notifications-svc", severity: "critical", status: "resolved", message: "Push provider outage, delivery delayed fleet-wide", ageMinutes: 7800, durationMinutes: 150, assignee: "MO" },
];

export function incidentsWithinPeriod(period: Period): Incident[] {
  const windowMinutes = PERIODS.find((p) => p.value === period)?.windowMinutes ?? 1440;
  return INCIDENTS.filter((incident) => incident.ageMinutes <= windowMinutes);
}

/** Current (live, period-independent) service status: a service is "down" if it has
 *  any non-resolved critical incident right now, "degraded" if it has any other
 *  non-resolved incident, otherwise "operational". Computed from INCIDENTS, never
 *  hand-set per service, so it can't drift from what the feed actually shows. */
export function deriveServiceStatus(serviceId: string): ServiceStatus {
  const open = INCIDENTS.filter((i) => i.serviceId === serviceId && i.status !== "resolved");
  if (open.some((i) => i.severity === "critical")) return "down";
  if (open.length > 0) return "degraded";
  return "operational";
}

export function openIncidentCountForService(serviceId: string): number {
  return INCIDENTS.filter((i) => i.serviceId === serviceId && i.status !== "resolved").length;
}

/** "Right now" totals, independent of the period toggle — an incident is either
 *  open or it isn't, regardless of how wide a window the charts are showing. */
export function totalOpenIncidentsNow(): number {
  return INCIDENTS.filter((i) => i.status !== "resolved").length;
}

export function criticalOpenIncidentsNow(): number {
  return INCIDENTS.filter((i) => i.status !== "resolved" && i.severity === "critical").length;
}

export function fleetUptimeAvg(): number {
  const total = SERVICES.reduce((sum, s) => sum + s.uptime30d, 0);
  return total / SERVICES.length;
}

/** Sensible default pin for first paint: the service with the most currently-open
 *  (non-resolved) incidents inside the default period window, tie-broken by worst
 *  p95. Computed, never hardcoded, so it can't go stale if the data above changes. */
export function getDefaultPinnedServiceId(): string {
  const period = DEFAULT_PERIOD;
  const openCounts = SERVICES.map((s) => ({
    id: s.id,
    open: incidentsWithinPeriod(period).filter((i) => i.serviceId === s.id && i.status !== "resolved").length,
    p95: LATENCY_P95[s.id][period],
  }));
  openCounts.sort((a, b) => b.open - a.open || b.p95 - a.p95);
  return openCounts[0].id;
}

export const DEFAULT_PINNED_SERVICE_ID = getDefaultPinnedServiceId();

export const NAV_SECTIONS = [
  { label: "Overview", icon: "Gauge" as const, active: true },
  { label: "Monitors", icon: "Server" as const, active: false },
  { label: "Incidents", icon: "AlertTriangle" as const, active: false },
  { label: "On-call", icon: "Users" as const, active: false },
  { label: "Reports", icon: "FileBarChart2" as const, active: false },
];
