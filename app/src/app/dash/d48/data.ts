/**
 * Parhelion — deterministic dummy data for the twin-region infrastructure console.
 * No Math.random / Date.now / new Date() anywhere. The single "now" anchor is a fixed UTC
 * millisecond constant; every hourly wiggle in the 24h latency series comes from a fixed
 * two-term sine formula (coordinates rounded to 2 decimals downstream, in the chart component).
 * Re-running this module always produces the exact same series and totals.
 *
 * Aggregates are never hand-typed: a region's active-incident count and overall status are both
 * *derived* from its `services` list (`deriveIncidents` / `deriveOverallStatus`), so the KPI tile,
 * the identity-header status badge, and the below-fold comparison table can never drift apart —
 * the services list is the single source of truth for "how many things are wrong here."
 */

import type { LucideIcon } from "lucide-react";
import {
  Boxes,
  Building2,
  Cloud,
  Database,
  FlaskConical,
  Globe2,
  KeyRound,
  LayoutGrid,
  Mail,
  Radio,
  Server,
  Settings2,
} from "lucide-react";
import type { ServiceStatus } from "./tokens";

export function round1(n: number): number {
  return Math.round(n * 10) / 10;
}
export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/* ------------------------------------------------------------------ Brand */

export const BRAND = { name: "Parhelion", tagline: "Twin-region infrastructure console" };

/** Fictional persona — never real session/operator data. */
export const CURRENT_USER = {
  name: "Rosa Kettering",
  role: "Infrastructure Lead",
  email: "rosa.kettering@parhelion.io",
  avatarId: "1580489944761-15a19d654956",
};

export type Workspace = { id: string; name: string; plan: string };
export const WORKSPACES: Workspace[] = [
  { id: "ws-fleet", name: "Global Fleet", plan: "Enterprise plan" },
  { id: "ws-sandbox", name: "Fleet Sandbox", plan: "Free plan" },
];

/* -------------------------------------------------------------- Global nav */

export type NavItem = { id: string; label: string; Icon: LucideIcon; active?: boolean; disabled?: boolean };
export type NavSection = { id: string; title: string; items: NavItem[] };

export const NAV_SECTIONS: NavSection[] = [
  {
    id: "monitoring",
    title: "Monitoring",
    items: [
      { id: "compare", label: "Compare regions", Icon: Globe2, active: true },
      { id: "services", label: "Service map", Icon: LayoutGrid, disabled: true },
      { id: "alerts", label: "Alert rules", Icon: Radio, disabled: true },
    ],
  },
  {
    id: "capacity",
    title: "Capacity",
    items: [
      { id: "cost", label: "Cost explorer", Icon: Boxes, disabled: true },
      { id: "forecast", label: "Traffic forecast", Icon: FlaskConical, disabled: true },
    ],
  },
  {
    id: "workspace",
    title: "Workspace",
    items: [
      { id: "org", label: "Providers", Icon: Building2, disabled: true },
      { id: "settings", label: "Settings", Icon: Settings2, disabled: true },
    ],
  },
];

/* ------------------------------------------------------------- Fixed "now" */

/** Fixed UTC anchor — never Date.now(). Every timestamp in this module measures back/forward from
 *  this single constant, so the dataset is identical on every render and every machine. */
export const NOW_MS = Date.UTC(2026, 7, 18, 14, 0, 0);
const HOUR_MS = 3_600_000;

const hourFmt = new Intl.DateTimeFormat("en-US", { hour: "numeric", hour12: true, timeZone: "UTC" });
export function formatHour(ms: number): string {
  return hourFmt.format(new Date(ms));
}

export const numberFmt = new Intl.NumberFormat("en-US");
export const currencyFmt = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

/* ---------------------------------------------------------------- Services */

export type ServiceId = "api-gateway" | "auth-service" | "primary-db" | "message-queue" | "cdn-edge" | "object-storage";

export const SERVICE_META: { id: ServiceId; label: string; Icon: LucideIcon; latencyFactor: number }[] = [
  { id: "api-gateway", label: "API Gateway", Icon: Server, latencyFactor: 1.0 },
  { id: "auth-service", label: "Auth Service", Icon: KeyRound, latencyFactor: 0.7 },
  { id: "primary-db", label: "Primary Database", Icon: Database, latencyFactor: 1.3 },
  { id: "message-queue", label: "Message Queue", Icon: Mail, latencyFactor: 0.5 },
  { id: "cdn-edge", label: "CDN Edge", Icon: Cloud, latencyFactor: 0.3 },
  { id: "object-storage", label: "Object Storage", Icon: Boxes, latencyFactor: 0.9 },
];

export type ServiceState = { id: ServiceId; status: ServiceStatus; latencyMs: number };

/* ------------------------------------------------------------------ Region */

export type RegionId = "ashfield" | "cinder-bay" | "brackwater" | "dunmoor" | "fenwick" | "elmsgate";

export type LatencyPoint = { hourMs: number; latencyMs: number };

export type Region = {
  id: RegionId;
  name: string;
  city: string;
  countryCode: string;
  provider: string;
  tier: "Primary" | "Secondary" | "Edge";
  uptimePct30d: number;
  errorRatePct: number;
  requestsPerMinK: number;
  costPerHour: number;
  services: ServiceState[];
  latencySeries: LatencyPoint[];
};

/** Deterministic two-term sine wiggle — bounded, reproducible. Rounded to 2 decimals at the call
 *  site where it feeds an SVG coordinate; kept unrounded here so the damped sum stays exact. */
function wiggle(i: number, phase: number): number {
  return Math.sin((i + phase) * 0.52) * 0.5 + Math.sin((i + phase) * 1.21 + 0.7) * 0.5;
}

/** Builds a 24-hour latency series that lands on exactly `endMs` at the most recent hour, so the
 *  chart's last point always matches the region's headline p95 KPI — the two can never disagree. */
function buildLatencySeries(startMs: number, endMs: number, phase: number, wobble: number): LatencyPoint[] {
  const points: LatencyPoint[] = [];
  const hours = 24;
  for (let i = 0; i < hours; i++) {
    const t = i / (hours - 1);
    const damp = 1 - t; // wiggle fades to 0 at the most recent hour, so the last point is exact
    const base = startMs + (endMs - startMs) * t;
    const latencyMs = Math.round(base + wiggle(i, phase) * wobble * damp);
    const hourMs = NOW_MS - (hours - 1 - i) * HOUR_MS;
    points.push({ hourMs, latencyMs: Math.max(4, latencyMs) });
  }
  return points;
}

function buildServices(p95: number, degraded: ServiceId[], outage: ServiceId[]): ServiceState[] {
  return SERVICE_META.map((meta) => {
    const status: ServiceStatus = outage.includes(meta.id) ? "outage" : degraded.includes(meta.id) ? "degraded" : "operational";
    const penalty = status === "outage" ? 2.4 : status === "degraded" ? 1.5 : 1;
    const latencyMs = Math.max(3, Math.round(p95 * meta.latencyFactor * penalty));
    return { id: meta.id, status, latencyMs };
  });
}

type RegionSeed = {
  id: RegionId;
  name: string;
  city: string;
  countryCode: string;
  provider: string;
  tier: Region["tier"];
  uptimePct30d: number;
  p95Now: number;
  p95Start: number;
  wobble: number;
  phase: number;
  errorRatePct: number;
  requestsPerMinK: number;
  costPerHour: number;
  degraded: ServiceId[];
  outage: ServiceId[];
};

const REGION_SEEDS: RegionSeed[] = [
  {
    id: "ashfield",
    name: "Ashfield",
    city: "Ashburn",
    countryCode: "US",
    provider: "Northwind Cloud",
    tier: "Primary",
    uptimePct30d: 99.98,
    p95Now: 118,
    p95Start: 104,
    wobble: 14,
    phase: 0,
    errorRatePct: 0.04,
    requestsPerMinK: 21.6,
    costPerHour: 44.2,
    degraded: [],
    outage: [],
  },
  {
    id: "cinder-bay",
    name: "Cinder Bay",
    city: "The Dalles",
    countryCode: "US",
    provider: "Vantage Cloud",
    tier: "Secondary",
    uptimePct30d: 99.95,
    p95Now: 96,
    p95Start: 88,
    wobble: 10,
    phase: 4,
    errorRatePct: 0.09,
    requestsPerMinK: 17.8,
    costPerHour: 39.6,
    degraded: ["message-queue"],
    outage: [],
  },
  {
    id: "brackwater",
    name: "Brackwater",
    city: "Dublin",
    countryCode: "IE",
    provider: "Northwind Cloud",
    tier: "Primary",
    uptimePct30d: 99.99,
    p95Now: 142,
    p95Start: 149,
    wobble: 9,
    phase: 8,
    errorRatePct: 0.03,
    requestsPerMinK: 15.2,
    costPerHour: 47.9,
    degraded: [],
    outage: [],
  },
  {
    id: "dunmoor",
    name: "Dunmoor",
    city: "Frankfurt",
    countryCode: "DE",
    provider: "Vantage Cloud",
    tier: "Secondary",
    uptimePct30d: 99.92,
    p95Now: 131,
    p95Start: 112,
    wobble: 16,
    phase: 11,
    errorRatePct: 0.14,
    requestsPerMinK: 12.4,
    costPerHour: 41.1,
    degraded: ["auth-service"],
    outage: [],
  },
  {
    id: "fenwick",
    name: "Fenwick",
    city: "Singapore",
    countryCode: "SG",
    provider: "Ridgeline Compute",
    tier: "Edge",
    uptimePct30d: 99.9,
    p95Now: 187,
    p95Start: 156,
    wobble: 22,
    phase: 15,
    errorRatePct: 0.21,
    requestsPerMinK: 9.6,
    costPerHour: 36.75,
    degraded: ["primary-db"],
    outage: ["cdn-edge"],
  },
  {
    id: "elmsgate",
    name: "Elmsgate",
    city: "Tokyo",
    countryCode: "JP",
    provider: "Northwind Cloud",
    tier: "Edge",
    uptimePct30d: 99.97,
    p95Now: 104,
    p95Start: 111,
    wobble: 8,
    phase: 19,
    errorRatePct: 0.05,
    requestsPerMinK: 14.9,
    costPerHour: 43.3,
    degraded: [],
    outage: [],
  },
];

export const REGIONS: Region[] = REGION_SEEDS.map((seed) => {
  const latencySeries = buildLatencySeries(seed.p95Start, seed.p95Now, seed.phase, seed.wobble);
  const services = buildServices(seed.p95Now, seed.degraded, seed.outage);
  return {
    id: seed.id,
    name: seed.name,
    city: seed.city,
    countryCode: seed.countryCode,
    provider: seed.provider,
    tier: seed.tier,
    uptimePct30d: seed.uptimePct30d,
    errorRatePct: seed.errorRatePct,
    requestsPerMinK: seed.requestsPerMinK,
    costPerHour: seed.costPerHour,
    services,
    latencySeries,
  };
});

export const REGION_BY_ID: Record<RegionId, Region> = Object.fromEntries(REGIONS.map((r) => [r.id, r])) as Record<RegionId, Region>;

/** Derived from `services` — never hand-typed, so it cannot disagree with the status list or table. */
export function currentLatency(r: Region): number {
  return r.latencySeries[r.latencySeries.length - 1].latencyMs;
}
export function deriveIncidents(r: Region): number {
  return r.services.filter((s) => s.status !== "operational").length;
}
export function deriveOverallStatus(r: Region): ServiceStatus {
  if (r.services.some((s) => s.status === "outage")) return "outage";
  if (r.services.some((s) => s.status === "degraded")) return "degraded";
  return "operational";
}

/* ---------------------------------------------------------- Focusable metrics */

export type MetricId = "uptime" | "latency" | "errorRate" | "cost";

export type MetricDef = {
  id: MetricId;
  label: string;
  shortLabel: string;
  higherIsBetter: boolean;
  unit: "pp" | "ms" | "pct" | "usd";
  value: (r: Region) => number;
  format: (r: Region) => string;
};

export const METRICS: MetricDef[] = [
  {
    id: "uptime",
    label: "Uptime (30d)",
    shortLabel: "Uptime",
    higherIsBetter: true,
    unit: "pp",
    value: (r) => r.uptimePct30d,
    format: (r) => `${r.uptimePct30d.toFixed(2)}%`,
  },
  {
    id: "latency",
    label: "P95 latency",
    shortLabel: "Latency",
    higherIsBetter: false,
    unit: "ms",
    value: (r) => currentLatency(r),
    format: (r) => `${numberFmt.format(currentLatency(r))} ms`,
  },
  {
    id: "errorRate",
    label: "Error rate",
    shortLabel: "Errors",
    higherIsBetter: false,
    unit: "pct",
    value: (r) => r.errorRatePct,
    format: (r) => `${r.errorRatePct.toFixed(2)}%`,
  },
  {
    id: "cost",
    label: "Cost per hour",
    shortLabel: "Cost",
    higherIsBetter: false,
    unit: "usd",
    value: (r) => r.costPerHour,
    format: (r) => currencyFmt.format(r.costPerHour),
  },
];

export const METRIC_BY_ID: Record<MetricId, MetricDef> = Object.fromEntries(METRICS.map((m) => [m.id, m])) as Record<MetricId, MetricDef>;

export type DeltaResult = {
  leader: Region | null; // null = tie
  diffAbs: number;
  diffText: string;
  sentence: string;
};

/** Computes the diff/delta summary for whichever metric is focused. Both panels' raw values feed
 *  this — it is never a separately-authored string, so it can't drift from the KPI tiles above it. */
export function computeDelta(metric: MetricDef, a: Region, b: Region): DeltaResult {
  const va = metric.value(a);
  const vb = metric.value(b);
  const diff = round2(Math.abs(va - vb));
  let leader: Region | null = null;
  if (va !== vb) {
    const aWins = metric.higherIsBetter ? va > vb : va < vb;
    leader = aWins ? a : b;
  }
  let diffText: string;
  if (metric.unit === "pp") diffText = `${diff.toFixed(2)} pp`;
  else if (metric.unit === "ms") diffText = `${numberFmt.format(Math.round(diff))} ms`;
  else if (metric.unit === "pct") diffText = `${diff.toFixed(2)} pct pts`;
  else diffText = currencyFmt.format(diff);

  const sentence = leader
    ? `${leader.name} leads on ${metric.shortLabel.toLowerCase()} by ${diffText} — ${metric.format(a)} vs ${metric.format(b)}.`
    : `${a.name} and ${b.name} are tied on ${metric.shortLabel.toLowerCase()} — both ${metric.format(a)}.`;

  return { leader, diffAbs: diff, diffText, sentence };
}

/* -------------------------------------------------------------------- Command palette */

export type ComparePair = { id: string; label: string; a: RegionId; b: RegionId };
export const QUICK_COMPARISONS: ComparePair[] = [
  { id: "us-pair", label: "Ashfield vs Cinder Bay — US regions", a: "ashfield", b: "cinder-bay" },
  { id: "eu-pair", label: "Brackwater vs Dunmoor — EU regions", a: "brackwater", b: "dunmoor" },
  { id: "apac-pair", label: "Fenwick vs Elmsgate — APAC regions", a: "fenwick", b: "elmsgate" },
];

export type QuickJump = { id: string; label: string; Icon: LucideIcon; targetId: string };
export const QUICK_JUMPS: QuickJump[] = [
  { id: "table", label: "Jump to service comparison table", Icon: LayoutGrid, targetId: "comparison-table-card" },
  { id: "panel-a", label: "Jump to Region A panel", Icon: Globe2, targetId: "panel-a" },
  { id: "panel-b", label: "Jump to Region B panel", Icon: Globe2, targetId: "panel-b" },
];

/* -------------------------------------------------------------------- Notifications */

export const NOTIFICATIONS = [
  { id: "n1", text: "Fenwick: CDN Edge outage crossed 15 minutes — auto-failover has not engaged.", time: "12m ago" },
  { id: "n2", text: "Dunmoor: Auth Service latency degraded after the 14:00 UTC deploy.", time: "1h ago" },
  { id: "n3", text: "Cinder Bay: Message Queue backlog cleared — status returning to operational.", time: "3h ago" },
];
