// All data below is a fixed, hand-authored fixture set. No Math.random, no Date.now, no `new Date()`.
// Trend series use Math.sin/Math.cos against fixed indices only — deterministic, same output every render.
// Every derived number (consumed budget %, totals, deltas, p95/p99) is computed here from the
// underlying record below, never hand-typed separately, so summary tiles and detail views can
// never drift from each other.

export type ServiceStatus = "healthy" | "degraded" | "down";

export interface Service {
  id: string;
  name: string;
  team: string;
  region: string;
  status: ServiceStatus;
  uptimeTargetPct: number;
  uptimeActualPct: number;
}

export const SERVICES: Service[] = [
  { id: "edge-gateway", name: "Edge Gateway", team: "Platform", region: "us-east-1", status: "healthy", uptimeTargetPct: 99.9, uptimeActualPct: 99.96 },
  { id: "checkout-api", name: "Checkout API", team: "Commerce", region: "us-east-1", status: "degraded", uptimeTargetPct: 99.9, uptimeActualPct: 99.74 },
  { id: "auth-service", name: "Auth Service", team: "Identity", region: "eu-west-1", status: "healthy", uptimeTargetPct: 99.95, uptimeActualPct: 99.97 },
  { id: "billing-worker", name: "Billing Worker", team: "Billing", region: "us-east-1", status: "healthy", uptimeTargetPct: 99.5, uptimeActualPct: 99.88 },
  { id: "search-index", name: "Search Index", team: "Search", region: "us-west-2", status: "degraded", uptimeTargetPct: 99.5, uptimeActualPct: 99.21 },
  { id: "notification-hub", name: "Notification Hub", team: "Platform", region: "eu-west-1", status: "healthy", uptimeTargetPct: 99.5, uptimeActualPct: 99.81 },
  { id: "payments-ledger", name: "Payments Ledger", team: "Billing", region: "us-east-1", status: "down", uptimeTargetPct: 99.95, uptimeActualPct: 98.62 },
  { id: "media-cdn", name: "Media CDN", team: "Platform", region: "global", status: "healthy", uptimeTargetPct: 99.9, uptimeActualPct: 99.95 },
];

export const SERVICE_BY_ID: Record<string, Service> = Object.fromEntries(SERVICES.map((s) => [s.id, s]));

/** Error-budget consumed % — the single formula every "budget" number on the page reads from.
 * >100 means the service has burned past its allotted error budget for the window. */
export function consumedBudgetPct(s: Service): number {
  const allowed = 100 - s.uptimeTargetPct;
  const burned = 100 - s.uptimeActualPct;
  return Math.round((burned / allowed) * 1000) / 10;
}

// ---------------------------------------------------------------------------
// Latency trend series. One deterministic waveform profile per service; the hero chart's "current"
// stat row reads the LAST point of the 24h series rather than a separately-typed number, and p95/p99
// are fixed multipliers of that same p50 point — one source of truth per service.
interface WaveProfile {
  base: number; // ms, p50 floor
  amp: number;
  freq: number;
  phase: number;
  trend: number; // ms added per step, models slow drift
}

const WAVE_PROFILES: Record<string, WaveProfile> = {
  "edge-gateway": { base: 42, amp: 6, freq: 0.52, phase: 0.3, trend: 0.02 },
  "checkout-api": { base: 118, amp: 22, freq: 0.41, phase: 1.1, trend: 0.35 },
  "auth-service": { base: 61, amp: 8, freq: 0.63, phase: 0.6, trend: 0.0 },
  "billing-worker": { base: 88, amp: 10, freq: 0.47, phase: 2.0, trend: 0.05 },
  "search-index": { base: 154, amp: 28, freq: 0.38, phase: 0.2, trend: 0.5 },
  "notification-hub": { base: 54, amp: 7, freq: 0.58, phase: 1.6, trend: -0.02 },
  "payments-ledger": { base: 212, amp: 46, freq: 0.33, phase: 2.6, trend: 0.9 },
  "media-cdn": { base: 31, amp: 4, freq: 0.7, phase: 0.9, trend: -0.01 },
};

export type Period = "24h" | "7d" | "30d";

export interface TrendPoint {
  label: string;
  values: Record<string, number>; // ms, per service id
  platform: number; // ms, mean across all services at this point
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

function buildSeries(count: number, labelFor: (i: number) => string): TrendPoint[] {
  const points: TrendPoint[] = [];
  for (let i = 0; i < count; i++) {
    const values: Record<string, number> = {};
    for (const s of SERVICES) {
      const p = WAVE_PROFILES[s.id];
      const v = p.base + p.amp * Math.sin(i * p.freq + p.phase) + p.trend * i;
      values[s.id] = round1(Math.max(8, v));
    }
    const sum = Object.values(values).reduce((a, b) => a + b, 0);
    points.push({ label: labelFor(i), values, platform: round1(sum / SERVICES.length) });
  }
  return points;
}

const HOUR_LABELS_24 = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, "0")}:00`);
const DAY_LABELS_7 = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DAY_LABELS_30 = Array.from({ length: 30 }, (_, i) => `Oct ${i + 1}`);

export const LATENCY_SERIES: Record<Period, TrendPoint[]> = {
  "24h": buildSeries(24, (i) => HOUR_LABELS_24[i]),
  "7d": buildSeries(7, (i) => DAY_LABELS_7[i]),
  "30d": buildSeries(30, (i) => DAY_LABELS_30[i]),
};

export const PERIOD_LABEL: Record<Period, string> = { "24h": "Last 24 hours", "7d": "Last 7 days", "30d": "Last 30 days" };

/** p50 = last point of the 24h series (same series the chart renders). p95/p99 are fixed
 * multipliers of that one number, never independently authored. */
export function currentLatency(serviceId: string): { p50: number; p95: number; p99: number } {
  const last = LATENCY_SERIES["24h"][LATENCY_SERIES["24h"].length - 1];
  const p50 = serviceId === "platform" ? last.platform : last.values[serviceId];
  return { p50, p95: round1(p50 * 1.55), p99: round1(p50 * 2.05) };
}

// ---------------------------------------------------------------------------
// Incidents — the record-level data the Incident Queue table and selection drill into.
export type Severity = "SEV-1" | "SEV-2" | "SEV-3";
export type IncidentStatus = "Open" | "Investigating" | "Monitoring" | "Resolved";

export interface Incident {
  id: string;
  serviceId: string;
  severity: Severity;
  title: string;
  status: IncidentStatus;
  assigneeName: string;
  assigneeAvatarId: string;
  startedLabel: string;
  durationMin: number;
}

export const INCIDENTS: Incident[] = [
  { id: "INC-2041", serviceId: "payments-ledger", severity: "SEV-1", title: "Ledger write queue backing up past 10k depth", status: "Investigating", assigneeName: "Priya Nair", assigneeAvatarId: "1489987707025-afc232f7ea0f", startedLabel: "Oct 31 · 09:12", durationMin: 184 },
  { id: "INC-2040", serviceId: "checkout-api", severity: "SEV-2", title: "Elevated p99 on cart pricing endpoint", status: "Monitoring", assigneeName: "Tomas Reyes", assigneeAvatarId: "1502920917128-1aa500764cbd", startedLabel: "Oct 31 · 07:48", durationMin: 268 },
  { id: "INC-2039", serviceId: "search-index", severity: "SEV-2", title: "Index shard rebalance causing stale results", status: "Open", assigneeName: "Mei Lin", assigneeAvatarId: "1519219788971-8d9797e0928e", startedLabel: "Oct 31 · 06:05", durationMin: 351 },
  { id: "INC-2038", serviceId: "payments-ledger", severity: "SEV-2", title: "Retry storm from downstream settlement partner", status: "Open", assigneeName: "Priya Nair", assigneeAvatarId: "1489987707025-afc232f7ea0f", startedLabel: "Oct 30 · 22:30", durationMin: 755 },
  { id: "INC-2037", serviceId: "billing-worker", severity: "SEV-3", title: "Invoice PDF render job latency above 30s", status: "Monitoring", assigneeName: "Jonas Weber", assigneeAvatarId: "1524504388940-b1c1722653e1", startedLabel: "Oct 30 · 19:14", durationMin: 862 },
  { id: "INC-2036", serviceId: "notification-hub", severity: "SEV-3", title: "Push delivery delayed for EU region subset", status: "Resolved", assigneeName: "Aiko Tanaka", assigneeAvatarId: "1531123897727-8f129e1688ce", startedLabel: "Oct 30 · 14:02", durationMin: 95 },
  { id: "INC-2035", serviceId: "edge-gateway", severity: "SEV-3", title: "Intermittent 502 from stale upstream pool entry", status: "Resolved", assigneeName: "Tomas Reyes", assigneeAvatarId: "1502920917128-1aa500764cbd", startedLabel: "Oct 29 · 11:40", durationMin: 41 },
  { id: "INC-2034", serviceId: "checkout-api", severity: "SEV-1", title: "Promo-code validation 500s during flash sale", status: "Resolved", assigneeName: "Mei Lin", assigneeAvatarId: "1519219788971-8d9797e0928e", startedLabel: "Oct 28 · 20:16", durationMin: 63 },
  { id: "INC-2033", serviceId: "media-cdn", severity: "SEV-3", title: "Cache hit ratio dipped below 92% for 20 minutes", status: "Resolved", assigneeName: "Jonas Weber", assigneeAvatarId: "1524504388940-b1c1722653e1", startedLabel: "Oct 28 · 08:55", durationMin: 22 },
  { id: "INC-2032", serviceId: "search-index", severity: "SEV-3", title: "Autocomplete suggestions empty for new SKUs", status: "Resolved", assigneeName: "Aiko Tanaka", assigneeAvatarId: "1531123897727-8f129e1688ce", startedLabel: "Oct 27 · 16:21", durationMin: 118 },
];

// ---------------------------------------------------------------------------
// Deploys — last 7 days, split success/failed. Day total = success + failed, always.
export interface DeployDay {
  day: string;
  success: number;
  failed: number;
}

export const DEPLOYS: DeployDay[] = [
  { day: "Mon", success: 11, failed: 1 },
  { day: "Tue", success: 9, failed: 0 },
  { day: "Wed", success: 14, failed: 2 },
  { day: "Thu", success: 8, failed: 1 },
  { day: "Fri", success: 6, failed: 0 },
  { day: "Sat", success: 2, failed: 0 },
  { day: "Sun", success: 3, failed: 1 },
];

export const DEPLOY_TOTALS = {
  success: DEPLOYS.reduce((a, d) => a + d.success, 0),
  failed: DEPLOYS.reduce((a, d) => a + d.failed, 0),
  total: DEPLOYS.reduce((a, d) => a + d.success + d.failed, 0),
};

// ---------------------------------------------------------------------------
// Spend — line items (current month) + an 8-week trend sparkline (separate metric, same formula style).
export interface SpendLine {
  category: string;
  amountUsd: number;
}

export const SPEND_LINES: SpendLine[] = [
  { category: "Compute", amountUsd: 18420 },
  { category: "Data egress", amountUsd: 5260 },
  { category: "Observability", amountUsd: 3180 },
  { category: "Managed DB", amountUsd: 7640 },
  { category: "Queueing", amountUsd: 1910 },
];

export const SPEND_TOTAL = SPEND_LINES.reduce((a, l) => a + l.amountUsd, 0);

export const SPEND_TREND: number[] = Array.from({ length: 8 }, (_, i) => {
  const v = 31800 + 2600 * Math.sin(i * 0.7 + 0.4) + 420 * i;
  return Math.round(v);
});

// ---------------------------------------------------------------------------
// On-call roster — fixed.
export interface OnCallEntry {
  name: string;
  role: string;
  avatarId: string;
  shift: "Primary" | "Secondary";
  window: string;
}

export const ON_CALL: OnCallEntry[] = [
  { name: "Priya Nair", role: "Billing & Payments", avatarId: "1489987707025-afc232f7ea0f", shift: "Primary", window: "Oct 31 – Nov 3" },
  { name: "Mei Lin", role: "Search & Discovery", avatarId: "1519219788971-8d9797e0928e", shift: "Primary", window: "Oct 31 – Nov 3" },
  { name: "Tomas Reyes", role: "Platform & Edge", avatarId: "1502920917128-1aa500764cbd", shift: "Secondary", window: "Oct 31 – Nov 3" },
  { name: "Aiko Tanaka", role: "Notifications", avatarId: "1531123897727-8f129e1688ce", shift: "Secondary", window: "Oct 31 – Nov 3" },
];

// ---------------------------------------------------------------------------
// Anomaly alerts — delta always computed from baseline+current, never hand-typed.
export interface AlertItem {
  id: string;
  serviceId: string;
  metric: string;
  baseline: number;
  current: number;
  unit: string;
}

const RAW_ALERTS: Omit<AlertItem, "id">[] = [
  { serviceId: "payments-ledger", metric: "Queue depth", baseline: 420, current: 11800, unit: "msgs" },
  { serviceId: "search-index", metric: "Reindex lag", baseline: 12, current: 94, unit: "s" },
  { serviceId: "checkout-api", metric: "p99 latency", baseline: 180, current: 412, unit: "ms" },
  { serviceId: "billing-worker", metric: "Job retry rate", baseline: 1.2, current: 6.8, unit: "%" },
];

export const ALERTS: AlertItem[] = RAW_ALERTS.map((a, i) => ({ id: `ALT-${i + 1}`, ...a }));

export function alertDeltaPct(a: AlertItem): number {
  return Math.round(((a.current - a.baseline) / a.baseline) * 1000) / 10;
}

export const CURRENT_USER = { name: "Jordan Ames", role: "SRE Lead", avatarId: "1441986300917-64674bd600d8" };
