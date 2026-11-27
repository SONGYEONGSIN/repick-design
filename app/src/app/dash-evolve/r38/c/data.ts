import { r2, statusForIncidents, type Status } from "./tokens";

export type TimeRange = "24h" | "7d" | "30d";
export const TIME_RANGES: { id: TimeRange; label: string }[] = [
  { id: "24h", label: "24h" },
  { id: "7d", label: "7d" },
  { id: "30d", label: "30d" },
];

export type RegionMetric = {
  incidents: number;
  uptimePct: number;
  p50Ms: number;
  reqPerSec: number;
};

export type Region = {
  id: string;
  code: string;
  name: string;
  /** Axial hex grid coordinates — a generative stand-in for a world map, not a real projection. */
  col: number;
  row: number;
  metrics: Record<TimeRange, RegionMetric>;
};

/**
 * Flat-top hex grid, axial (col, row) → pixel. size = circumradius of each hex.
 * x = size * 1.5 * col
 * y = size * sqrt(3) * (row + col / 2)
 * Rounded to 2dp at the point of computation (page-brief-core SVG coordinate rule).
 */
export const HEX_SIZE = 42;
const SQRT3 = Math.sqrt(3);

export function hexCenter(col: number, row: number): { x: number; y: number } {
  const x = HEX_SIZE * 1.5 * col;
  const y = HEX_SIZE * SQRT3 * (row + col / 2);
  return { x: r2(x), y: r2(y) };
}

/** Flat-top hexagon vertices (pointy left/right, flat top/bottom) at the given radius. */
export function hexPoints(cx: number, cy: number, radius: number): string {
  const pts: string[] = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 180) * (60 * i);
    const vx = r2(cx + radius * Math.cos(angle));
    const vy = r2(cy + radius * Math.sin(angle));
    pts.push(`${vx},${vy}`);
  }
  return pts.join(" ");
}

// 14 regions standing in for the world's major traffic regions, laid out on the hex grid in
// roughly correct relative compass positions (west→east columns, north→south rows) — a
// generative stand-in, not a literal map projection. Metrics are hand-authored per time range so
// every rollup (KPI strip, legend counts) is computed from this table at render time, never
// duplicated as a separate hardcoded total.
export const REGIONS: Region[] = [
  {
    id: "na-west", code: "NA-W", name: "North America — West", col: 0, row: 0,
    metrics: {
      "24h": { incidents: 0, uptimePct: 99.995, p50Ms: 42, reqPerSec: 8200 },
      "7d": { incidents: 1, uptimePct: 99.988, p50Ms: 43, reqPerSec: 8100 },
      "30d": { incidents: 3, uptimePct: 99.971, p50Ms: 44, reqPerSec: 8300 },
    },
  },
  {
    id: "na-east", code: "NA-E", name: "North America — East", col: 1, row: 0,
    metrics: {
      "24h": { incidents: 1, uptimePct: 99.991, p50Ms: 38, reqPerSec: 12400 },
      "7d": { incidents: 3, uptimePct: 99.974, p50Ms: 39, reqPerSec: 12600 },
      "30d": { incidents: 6, uptimePct: 99.948, p50Ms: 40, reqPerSec: 12500 },
    },
  },
  {
    id: "sa-north", code: "SA-N", name: "South America — North", col: 1, row: 2,
    metrics: {
      "24h": { incidents: 2, uptimePct: 99.96, p50Ms: 95, reqPerSec: 3100 },
      "7d": { incidents: 4, uptimePct: 99.93, p50Ms: 97, reqPerSec: 3050 },
      "30d": { incidents: 9, uptimePct: 99.88, p50Ms: 98, reqPerSec: 3200 },
    },
  },
  {
    id: "sa-south", code: "SA-S", name: "South America — South", col: 1, row: 3,
    metrics: {
      "24h": { incidents: 0, uptimePct: 99.99, p50Ms: 102, reqPerSec: 1800 },
      "7d": { incidents: 1, uptimePct: 99.97, p50Ms: 104, reqPerSec: 1750 },
      "30d": { incidents: 2, uptimePct: 99.95, p50Ms: 105, reqPerSec: 1820 },
    },
  },
  {
    id: "eu-north", code: "EU-N", name: "Europe — North", col: 3, row: -1,
    metrics: {
      "24h": { incidents: 0, uptimePct: 99.998, p50Ms: 51, reqPerSec: 2600 },
      "7d": { incidents: 0, uptimePct: 99.993, p50Ms: 52, reqPerSec: 2550 },
      "30d": { incidents: 1, uptimePct: 99.981, p50Ms: 53, reqPerSec: 2650 },
    },
  },
  {
    id: "eu-west", code: "EU-W", name: "Europe — West", col: 3, row: 0,
    metrics: {
      "24h": { incidents: 2, uptimePct: 99.97, p50Ms: 33, reqPerSec: 15800 },
      "7d": { incidents: 5, uptimePct: 99.94, p50Ms: 34, reqPerSec: 16000 },
      "30d": { incidents: 11, uptimePct: 99.89, p50Ms: 35, reqPerSec: 15900 },
    },
  },
  {
    id: "eu-central", code: "EU-C", name: "Europe — Central", col: 4, row: 0,
    metrics: {
      "24h": { incidents: 1, uptimePct: 99.985, p50Ms: 37, reqPerSec: 9100 },
      "7d": { incidents: 2, uptimePct: 99.965, p50Ms: 38, reqPerSec: 9050 },
      "30d": { incidents: 5, uptimePct: 99.93, p50Ms: 39, reqPerSec: 9200 },
    },
  },
  {
    id: "af-north", code: "AF-N", name: "Africa — North", col: 3, row: 1,
    metrics: {
      "24h": { incidents: 3, uptimePct: 99.94, p50Ms: 88, reqPerSec: 2100 },
      "7d": { incidents: 6, uptimePct: 99.90, p50Ms: 90, reqPerSec: 2050 },
      "30d": { incidents: 12, uptimePct: 99.83, p50Ms: 91, reqPerSec: 2150 },
    },
  },
  {
    id: "af-south", code: "AF-S", name: "Africa — South", col: 3, row: 2,
    metrics: {
      "24h": { incidents: 0, uptimePct: 99.99, p50Ms: 112, reqPerSec: 1200 },
      "7d": { incidents: 1, uptimePct: 99.98, p50Ms: 114, reqPerSec: 1180 },
      "30d": { incidents: 3, uptimePct: 99.96, p50Ms: 115, reqPerSec: 1220 },
    },
  },
  {
    id: "mena", code: "MENA", name: "Middle East & North Africa", col: 4, row: 1,
    metrics: {
      "24h": { incidents: 4, uptimePct: 99.92, p50Ms: 76, reqPerSec: 4200 },
      "7d": { incidents: 8, uptimePct: 99.87, p50Ms: 78, reqPerSec: 4150 },
      "30d": { incidents: 15, uptimePct: 99.79, p50Ms: 79, reqPerSec: 4300 },
    },
  },
  {
    id: "as-south", code: "AS-S", name: "Asia — South", col: 5, row: 1,
    metrics: {
      "24h": { incidents: 6, uptimePct: 99.88, p50Ms: 118, reqPerSec: 5300 },
      "7d": { incidents: 9, uptimePct: 99.85, p50Ms: 120, reqPerSec: 5250 },
      "30d": { incidents: 18, uptimePct: 99.74, p50Ms: 121, reqPerSec: 5400 },
    },
  },
  {
    id: "as-east", code: "AS-E", name: "Asia — East", col: 6, row: 0,
    metrics: {
      "24h": { incidents: 2, uptimePct: 99.97, p50Ms: 46, reqPerSec: 18200 },
      "7d": { incidents: 4, uptimePct: 99.95, p50Ms: 47, reqPerSec: 18400 },
      "30d": { incidents: 8, uptimePct: 99.91, p50Ms: 48, reqPerSec: 18300 },
    },
  },
  {
    id: "as-sea", code: "SEA", name: "Asia — Southeast", col: 6, row: 1,
    metrics: {
      "24h": { incidents: 3, uptimePct: 99.95, p50Ms: 68, reqPerSec: 7600 },
      "7d": { incidents: 6, uptimePct: 99.91, p50Ms: 70, reqPerSec: 7550 },
      "30d": { incidents: 13, uptimePct: 99.84, p50Ms: 71, reqPerSec: 7700 },
    },
  },
  {
    id: "oceania", code: "OCE", name: "Oceania", col: 6, row: 2,
    metrics: {
      "24h": { incidents: 1, uptimePct: 99.98, p50Ms: 125, reqPerSec: 1500 },
      "7d": { incidents: 2, uptimePct: 99.96, p50Ms: 127, reqPerSec: 1480 },
      "30d": { incidents: 4, uptimePct: 99.93, p50Ms: 128, reqPerSec: 1520 },
    },
  },
];

export function regionStatus(region: Region, range: TimeRange): Status {
  return statusForIncidents(region.metrics[range].incidents);
}

export function regionById(id: string | null): Region | undefined {
  if (!id) return undefined;
  return REGIONS.find((r) => r.id === id);
}

// p50 latency sparkline for the KPI card — illustrative recent trend, independent of the
// per-region table above, seven fixed points per range (no Date.now / Math.random).
export const P50_SPARKLINE: Record<TimeRange, number[]> = {
  "24h": [88, 85, 90, 87, 84, 89, 86],
  "7d": [95, 92, 90, 93, 91, 89, 91],
  "30d": [90, 93, 95, 97, 94, 96, 94],
};

export type FeedType = "incident" | "deployment" | "spike";
export type FeedTone = "critical" | "warning" | "info" | "success";

export type FeedItem = {
  id: string;
  type: FeedType;
  regionId: string;
  title: string;
  detail: string;
  time: string;
  tone: FeedTone;
};

// Static, deterministic activity stream — independent of the time-range toggle, which only
// re-scopes the KPI/map/table rollups above. Feed order is newest-first by fixed display string.
export const FEED_ITEMS: FeedItem[] = [
  { id: "f1", type: "incident", regionId: "as-south", title: "Elevated 5xx rate on edge POPs", detail: "Error rate climbed to 4.1% across three POPs; origin shield engaged.", time: "6m ago", tone: "critical" },
  { id: "f2", type: "spike", regionId: "as-east", title: "Traffic spike, +38% over baseline", detail: "Likely tied to a regional product launch; autoscale added 12 nodes.", time: "14m ago", tone: "info" },
  { id: "f3", type: "deployment", regionId: "eu-west", title: "Edge config v214 rolled out", detail: "Cache-control rule update deployed to all POPs, no errors reported.", time: "22m ago", tone: "success" },
  { id: "f4", type: "incident", regionId: "mena", title: "DNS resolution latency above SLO", detail: "Resolver p95 crossed 180ms; secondary resolver pool activated.", time: "41m ago", tone: "warning" },
  { id: "f5", type: "incident", regionId: "af-north", title: "Partial packet loss on transit link", detail: "Upstream carrier reported a fiber fault; traffic rerouted automatically.", time: "1h ago", tone: "warning" },
  { id: "f6", type: "spike", regionId: "eu-west", title: "Request volume, +22% over baseline", detail: "Sustained for 40 minutes; no latency regression observed.", time: "1h ago", tone: "info" },
  { id: "f7", type: "deployment", regionId: "as-east", title: "TLS certificate rotation completed", detail: "Rotated across 9 POPs with zero downtime, verified via synthetic checks.", time: "2h ago", tone: "success" },
  { id: "f8", type: "incident", regionId: "as-south", title: "Origin timeout rate rising", detail: "Origin pool latency doubled; circuit breaker tripped for one upstream.", time: "2h ago", tone: "critical" },
  { id: "f9", type: "incident", regionId: "sa-north", title: "Cache hit ratio dropped to 71%", detail: "A misconfigured purge rule evicted hot objects; rule reverted.", time: "3h ago", tone: "warning" },
  { id: "f10", type: "deployment", regionId: "na-east", title: "Autoscale policy v9 shipped", detail: "New scale-out thresholds for peak-hour traffic, staged rollout complete.", time: "3h ago", tone: "success" },
  { id: "f11", type: "spike", regionId: "as-sea", title: "Traffic spike, +45% over baseline", detail: "Correlated with a regional holiday; capacity held with headroom.", time: "4h ago", tone: "info" },
  { id: "f12", type: "incident", regionId: "eu-central", title: "Brief control-plane blip", detail: "Config API returned 503s for 90 seconds; self-resolved, no data loss.", time: "5h ago", tone: "warning" },
  { id: "f13", type: "incident", regionId: "as-south", title: "Regional outage, two POPs offline", detail: "Power event at a colo facility; traffic failed over to adjacent POPs.", time: "6h ago", tone: "critical" },
  { id: "f14", type: "deployment", regionId: "oceania", title: "WAF ruleset v31 deployed", detail: "New bot-mitigation rules enabled, monitoring false-positive rate.", time: "8h ago", tone: "success" },
  { id: "f15", type: "incident", regionId: "af-north", title: "Elevated retransmit rate", detail: "Fiber fault from earlier reoccurred briefly; carrier dispatched a crew.", time: "11h ago", tone: "warning" },
  { id: "f16", type: "spike", regionId: "na-east", title: "Request volume, +19% over baseline", detail: "Tied to a scheduled marketing send; absorbed without incident.", time: "yesterday", tone: "info" },
  { id: "f17", type: "incident", regionId: "mena", title: "Resolved: DNS latency SLO breach", detail: "Secondary resolver pool stabilized p95 back under 60ms.", time: "yesterday", tone: "success" },
  { id: "f18", type: "deployment", regionId: "eu-west", title: "Edge runtime v4.2 rolled out", detail: "Gradual rollout across all Europe West POPs, now at 100%.", time: "2 days ago", tone: "success" },
];
