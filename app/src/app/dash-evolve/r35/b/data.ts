import {
  Activity,
  AlertTriangle,
  BellRing,
  Gauge,
  Globe2,
  Plug,
  Radio,
  Server,
  Settings,
  ShieldAlert,
  type LucideIcon,
} from "lucide-react";
import type { Severity } from "./tokens";

export const BRAND = { name: "Fluxgate", Icon: Radio };

export const CURRENT_USER = {
  name: "Dana Okafor",
  role: "Platform reliability lead",
  email: "dana.okafor@fluxgate.io",
  avatarId: "1519244703995-f4e0f30006d5",
};

export type NavItem = { id: string; label: string; Icon: LucideIcon; active?: boolean; disabled?: boolean };
export const NAV_SECTIONS: { id: string; title: string; items: NavItem[] }[] = [
  {
    id: "monitor",
    title: "Monitor",
    items: [
      { id: "traffic", label: "Live traffic", Icon: Activity, active: true },
      { id: "incidents", label: "Incidents", Icon: AlertTriangle },
      { id: "nodes", label: "Edge nodes", Icon: Server },
    ],
  },
  {
    id: "manage",
    title: "Manage",
    items: [
      { id: "rate-limits", label: "Rate limits", Icon: Gauge },
      { id: "alerts", label: "Alert rules", Icon: BellRing },
      { id: "integrations", label: "Integrations", Icon: Plug },
    ],
  },
  {
    id: "org",
    title: "Organization",
    items: [{ id: "settings", label: "Settings", Icon: Settings, disabled: true }],
  },
];

export type SearchEntry = { id: string; title: string; meta: string; Icon: LucideIcon };
export const SEARCH_ENTRIES: SearchEntry[] = [
  { id: "traffic", title: "Live traffic", meta: "Monitor", Icon: Activity },
  { id: "incidents", title: "Incidents", meta: "Monitor", Icon: AlertTriangle },
  { id: "nodes", title: "Edge nodes", meta: "Monitor", Icon: Server },
  { id: "rate-limits", title: "Rate limits", meta: "Manage", Icon: Gauge },
  { id: "alerts", title: "Alert rules", meta: "Manage", Icon: BellRing },
  { id: "integrations", title: "Integrations", meta: "Manage", Icon: Plug },
  { id: "region-global", title: "Global aggregate", meta: "Region", Icon: Globe2 },
  { id: "region-us-east", title: "us-east-1", meta: "Region", Icon: Server },
  { id: "region-eu-west", title: "eu-west-1", meta: "Region", Icon: Server },
  { id: "region-apac", title: "ap-southeast-1", meta: "Region", Icon: Server },
  { id: "incident-1842", title: "Rate-limit spike — checkout-api", meta: "Incident #1842", Icon: ShieldAlert },
];

// ---------------------------------------------------------------------------
// Streaming series. Fully deterministic: every value below is a fixed sum of
// sine waves plus a modulo-triggered step, computed once at module load from
// the loop index `i` — never Math.random or Date.now. The "live" feel
// comes entirely from the client advancing a counter that indexes into this
// fixed, looping buffer (see streaming-chart.tsx), so any given tick number
// always renders the exact same pixels.
// ---------------------------------------------------------------------------

export type RegionId = "global" | "us-east" | "eu-west" | "apac";

export const REGIONS: { id: RegionId; label: string }[] = [
  { id: "global", label: "Global" },
  { id: "us-east", label: "US-East" },
  { id: "eu-west", label: "EU-West" },
  { id: "apac", label: "APAC" },
];

export const WINDOW_OPTIONS: { id: number; label: string }[] = [
  { id: 60, label: "60s" },
  { id: 90, label: "90s" },
  { id: 180, label: "180s" },
];

export const DEFAULT_REGION: RegionId = "global";
export const DEFAULT_WINDOW = 90;

/** Length of the fixed, looping data buffer (seconds of history held in memory). */
export const SERIES_LENGTH = 240;

type Seed = { base: number; amp: number; phase: number };

const REGION_SEED: Record<RegionId, Seed> = {
  global: { base: 3400, amp: 640, phase: 0 },
  "us-east": { base: 1450, amp: 320, phase: 7 },
  "eu-west": { base: 980, amp: 240, phase: 14 },
  apac: { base: 760, amp: 210, phase: 21 },
};

function buildThroughput(seed: Seed): number[] {
  const points: number[] = [];
  for (let i = 0; i < SERIES_LENGTH; i++) {
    const t = i + seed.phase;
    const slow = Math.sin(t / 37) * seed.amp * 0.5;
    const mid = Math.sin(t / 11) * seed.amp * 0.3;
    const fast = Math.sin(t * 1.7) * seed.amp * 0.1;
    const isSpike = t % 53 === 17;
    const isDip = t % 97 === 42;
    const event = isSpike ? seed.amp * 0.85 : isDip ? -seed.amp * 0.55 : 0;
    points.push(Math.round(Math.max(40, seed.base + slow + mid + fast + event)));
  }
  return points;
}

function buildLatency(seed: Seed, throughput: number[]): number[] {
  const baseLatency = 58 + seed.phase * 1.4;
  return throughput.map((v, i) => {
    const drift = Math.sin((i + seed.phase) / 29) * 9;
    const loadPenalty = ((v - seed.base) / seed.amp) * 14;
    return Math.round(Math.max(18, baseLatency + drift + loadPenalty) * 10) / 10;
  });
}

function buildErrorRate(seed: Seed, throughput: number[]): number[] {
  return throughput.map((v, i) => {
    const drift = Math.sin((i + seed.phase) / 19) * 0.18;
    const loadPenalty = Math.max(0, (v - seed.base) / seed.amp) * 0.9;
    return Math.round(Math.max(0, 0.22 + drift + loadPenalty) * 100) / 100;
  });
}

function buildSeriesSet(regionId: RegionId) {
  const seed = REGION_SEED[regionId];
  const throughput = buildThroughput(seed);
  return {
    throughput,
    latency: buildLatency(seed, throughput),
    errorRate: buildErrorRate(seed, throughput),
  };
}

const SERIES_SET: Record<RegionId, ReturnType<typeof buildSeriesSet>> = {
  global: buildSeriesSet("global"),
  "us-east": buildSeriesSet("us-east"),
  "eu-west": buildSeriesSet("eu-west"),
  apac: buildSeriesSet("apac"),
};

export const THROUGHPUT_SERIES: Record<RegionId, number[]> = Object.fromEntries(
  (Object.keys(SERIES_SET) as RegionId[]).map((id) => [id, SERIES_SET[id].throughput]),
) as Record<RegionId, number[]>;

export const LATENCY_SERIES: Record<RegionId, number[]> = Object.fromEntries(
  (Object.keys(SERIES_SET) as RegionId[]).map((id) => [id, SERIES_SET[id].latency]),
) as Record<RegionId, number[]>;

export const ERROR_SERIES: Record<RegionId, number[]> = Object.fromEntries(
  (Object.keys(SERIES_SET) as RegionId[]).map((id) => [id, SERIES_SET[id].errorRate]),
) as Record<RegionId, number[]>;

/** Stable y-axis bounds per region, padded 12%, so the chart scale doesn't jump every tick. */
export const REGION_RANGE: Record<RegionId, { min: number; max: number }> = Object.fromEntries(
  (Object.keys(THROUGHPUT_SERIES) as RegionId[]).map((id) => {
    const series = THROUGHPUT_SERIES[id];
    const min = Math.min(...series);
    const max = Math.max(...series);
    const pad = (max - min) * 0.12;
    return [id, { min: Math.max(0, min - pad), max: max + pad }];
  }),
) as Record<RegionId, { min: number; max: number }>;

// Part-to-whole reconciles exactly: global = sum of the three named regions.
export const REGION_NODES: Record<RegionId, { healthy: number; total: number }> = {
  "us-east": { healthy: 12, total: 13 },
  "eu-west": { healthy: 11, total: 12 },
  apac: { healthy: 9, total: 10 },
  global: { healthy: 12 + 11 + 9, total: 13 + 12 + 10 },
};

export function regionLabel(id: RegionId): string {
  return REGIONS.find((r) => r.id === id)?.label ?? id;
}

const intFormatter = new Intl.NumberFormat("en-US");
const msFormatter = new Intl.NumberFormat("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const pctFormatter = new Intl.NumberFormat("en-US", { style: "percent", minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function formatReq(n: number): string {
  return intFormatter.format(Math.round(n));
}
export function formatMs(n: number): string {
  return msFormatter.format(n);
}
export function formatErrorPct(n: number): string {
  return pctFormatter.format(n / 100);
}

const deltaFormatter = new Intl.NumberFormat("en-US", { signDisplay: "exceptZero", minimumFractionDigits: 1, maximumFractionDigits: 1 });
export function formatDeltaPct(n: number): string {
  return `${deltaFormatter.format(n)}%`;
}
export function formatOffset(secondsAgo: number): string {
  return secondsAgo === 0 ? "now" : `T−${secondsAgo}s`;
}

/** Reads one value out of a fixed, looping series — `tickIndex` is the deterministic
 * advancing counter, `secondsAgo` 0 means "the current tick". Pure modulo indexing,
 * no randomness and no wall-clock involved. */
export function seriesValueAt(series: number[], tickIndex: number, secondsAgo: number): number {
  const len = series.length;
  const idx = (((tickIndex - secondsAgo) % len) + len) % len;
  return series[idx];
}

/** Oldest-to-newest slice of `windowSeconds` values ending at `tickIndex`, wrapping
 * around the fixed buffer as needed. */
export function windowSlice(series: number[], tickIndex: number, windowSeconds: number): number[] {
  const out: number[] = [];
  for (let k = windowSeconds - 1; k >= 0; k--) out.push(seriesValueAt(series, tickIndex, k));
  return out;
}

// ---------------------------------------------------------------------------
// Secondary content: incident/event log. Fixed rows, not synced to the chart
// selection above — a deliberately separate, independently-filtered pane.
// ---------------------------------------------------------------------------

export type EventStatus = "Open" | "Monitoring" | "Resolved";
export type EventRow = {
  id: string;
  time: string; // fixed display clock, not wall-clock — whitespace-nowrap in the table
  minutesAgo: number; // drives the "Time" column sort
  severity: Severity;
  region: RegionId;
  message: string;
  status: EventStatus;
};

export const EVENTS: EventRow[] = [
  { id: "evt-1842", time: "14:12:03 UTC", minutesAgo: 2, severity: "critical", region: "us-east", message: "Rate-limit spike on checkout-api — 429s up 6x", status: "Open" },
  { id: "evt-1841", time: "14:05:41 UTC", minutesAgo: 9, severity: "warning", region: "eu-west", message: "p95 latency crossed 180ms threshold on auth-gateway", status: "Monitoring" },
  { id: "evt-1840", time: "13:58:17 UTC", minutesAgo: 16, severity: "info", region: "global", message: "Edge config v214 rolled out to all regions", status: "Resolved" },
  { id: "evt-1839", time: "13:44:52 UTC", minutesAgo: 29, severity: "critical", region: "apac", message: "Node ap-se-04 failed health check, drained from pool", status: "Monitoring" },
  { id: "evt-1838", time: "13:30:08 UTC", minutesAgo: 44, severity: "warning", region: "us-east", message: "5xx rate crossed 1.5% on payments-webhook", status: "Resolved" },
  { id: "evt-1837", time: "13:12:36 UTC", minutesAgo: 61, severity: "info", region: "eu-west", message: "Scheduled certificate rotation completed", status: "Resolved" },
  { id: "evt-1836", time: "12:58:49 UTC", minutesAgo: 75, severity: "warning", region: "global", message: "DNS TTL anomaly detected on origin pool B", status: "Resolved" },
  { id: "evt-1835", time: "12:40:22 UTC", minutesAgo: 93, severity: "critical", region: "eu-west", message: "Origin timeout spike on search-api — failover engaged", status: "Resolved" },
  { id: "evt-1834", time: "12:21:15 UTC", minutesAgo: 112, severity: "info", region: "apac", message: "New edge node ap-se-11 joined the pool", status: "Resolved" },
  { id: "evt-1833", time: "11:59:03 UTC", minutesAgo: 135, severity: "warning", region: "us-east", message: "Connection pool saturation on media-cdn", status: "Resolved" },
  { id: "evt-1832", time: "11:30:47 UTC", minutesAgo: 163, severity: "info", region: "global", message: "WAF rule set v88 published", status: "Resolved" },
  { id: "evt-1831", time: "11:02:19 UTC", minutesAgo: 192, severity: "critical", region: "us-east", message: "Checkout-api error budget burned 40% in 10 minutes", status: "Resolved" },
  { id: "evt-1830", time: "10:41:05 UTC", minutesAgo: 213, severity: "warning", region: "apac", message: "Cache hit ratio dropped below 85% on image-cdn", status: "Resolved" },
  { id: "evt-1829", time: "10:15:58 UTC", minutesAgo: 238, severity: "info", region: "eu-west", message: "Autoscale added 2 edge nodes ahead of forecast peak", status: "Resolved" },
];
