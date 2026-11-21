/**
 * Isobar — edge network operations console. All data below is a fixed, hand-authored snapshot
 * (no Math.random, no Date.now, no bare new Date): every derived total is computed from this same
 * array at module load, so subtotals and totals can never drift apart.
 */

export type RegionStatus = "healthy" | "degraded" | "critical" | "maintenance";
export type Cluster = "Europe" | "North America" | "South America & Africa" | "Asia Pacific";

export interface Region {
  id: string;
  code: string;
  name: string;
  cluster: Cluster;
  status: RegionStatus;
  uptimePct: number;
  incidentCount: number;
  latencyMs: number;
  /** Six-period uptime trend, oldest first, percentage points below 100. */
  uptimeTrend: number[];
}

export const REGIONS: Region[] = [
  { id: "lhr", code: "LHR", name: "London", cluster: "Europe", status: "healthy", uptimePct: 99.98, incidentCount: 0, latencyMs: 14, uptimeTrend: [99.97, 99.98, 99.99, 99.98, 99.97, 99.98] },
  { id: "fra", code: "FRA", name: "Frankfurt", cluster: "Europe", status: "degraded", uptimePct: 99.62, incidentCount: 1, latencyMs: 71, uptimeTrend: [99.97, 99.96, 99.95, 99.9, 99.78, 99.62] },
  { id: "ams", code: "AMS", name: "Amsterdam", cluster: "Europe", status: "healthy", uptimePct: 99.97, incidentCount: 0, latencyMs: 18, uptimeTrend: [99.96, 99.97, 99.96, 99.98, 99.97, 99.97] },
  { id: "cdg", code: "CDG", name: "Paris", cluster: "Europe", status: "healthy", uptimePct: 99.96, incidentCount: 0, latencyMs: 21, uptimeTrend: [99.95, 99.96, 99.95, 99.96, 99.97, 99.96] },

  { id: "iad", code: "IAD", name: "N. Virginia", cluster: "North America", status: "healthy", uptimePct: 99.99, incidentCount: 0, latencyMs: 9, uptimeTrend: [99.98, 99.99, 99.99, 99.98, 99.99, 99.99] },
  { id: "sfo", code: "SFO", name: "San Francisco", cluster: "North America", status: "healthy", uptimePct: 99.98, incidentCount: 0, latencyMs: 11, uptimeTrend: [99.97, 99.98, 99.98, 99.99, 99.98, 99.98] },
  { id: "yyz", code: "YYZ", name: "Toronto", cluster: "North America", status: "healthy", uptimePct: 99.97, incidentCount: 0, latencyMs: 16, uptimeTrend: [99.96, 99.97, 99.97, 99.96, 99.97, 99.97] },
  { id: "dxb", code: "DXB", name: "Dubai", cluster: "North America", status: "maintenance", uptimePct: 99.81, incidentCount: 0, latencyMs: 38, uptimeTrend: [99.95, 99.95, 99.94, 99.93, 99.88, 99.81] },

  { id: "gru", code: "GRU", name: "São Paulo", cluster: "South America & Africa", status: "healthy", uptimePct: 99.95, incidentCount: 0, latencyMs: 34, uptimeTrend: [99.94, 99.95, 99.94, 99.96, 99.95, 99.95] },
  { id: "scl", code: "SCL", name: "Santiago", cluster: "South America & Africa", status: "healthy", uptimePct: 99.94, incidentCount: 0, latencyMs: 41, uptimeTrend: [99.9, 99.92, 99.93, 99.91, 99.95, 99.94] },
  { id: "jnb", code: "JNB", name: "Johannesburg", cluster: "South America & Africa", status: "healthy", uptimePct: 99.93, incidentCount: 0, latencyMs: 52, uptimeTrend: [99.88, 99.9, 99.86, 99.92, 99.94, 99.93] },
  { id: "bom", code: "BOM", name: "Mumbai", cluster: "South America & Africa", status: "degraded", uptimePct: 99.58, incidentCount: 1, latencyMs: 88, uptimeTrend: [99.93, 99.92, 99.9, 99.84, 99.7, 99.58] },

  { id: "sin", code: "SIN", name: "Singapore", cluster: "Asia Pacific", status: "critical", uptimePct: 98.42, incidentCount: 2, latencyMs: 214, uptimeTrend: [99.96, 99.94, 99.88, 99.61, 99.02, 98.42] },
  { id: "hkg", code: "HKG", name: "Hong Kong", cluster: "Asia Pacific", status: "healthy", uptimePct: 99.96, incidentCount: 0, latencyMs: 19, uptimeTrend: [99.95, 99.96, 99.95, 99.97, 99.96, 99.96] },
  { id: "nrt", code: "NRT", name: "Tokyo", cluster: "Asia Pacific", status: "healthy", uptimePct: 99.97, incidentCount: 0, latencyMs: 17, uptimeTrend: [99.96, 99.97, 99.98, 99.97, 99.96, 99.97] },
  { id: "syd", code: "SYD", name: "Sydney", cluster: "Asia Pacific", status: "healthy", uptimePct: 99.95, incidentCount: 0, latencyMs: 29, uptimeTrend: [99.94, 99.95, 99.93, 99.96, 99.95, 99.95] },
];

export const TOTAL_REGIONS = REGIONS.length;

export const AVG_UPTIME_PCT =
  Math.round((REGIONS.reduce((sum, r) => sum + r.uptimePct, 0) / REGIONS.length) * 100) / 100;

export const AVG_LATENCY_MS = Math.round(
  REGIONS.reduce((sum, r) => sum + r.latencyMs, 0) / REGIONS.length
);

export const REGIONS_AT_RISK = REGIONS.filter(
  (r) => r.status === "degraded" || r.status === "critical"
).length;

export const LATENCY_TREND_MS = [41, 40, 42, 44, 46, AVG_LATENCY_MS];

export type Severity = "critical" | "major" | "minor" | "maintenance" | "resolved";
export type FeedStatus = "ongoing" | "monitoring" | "resolved";

export interface FeedItem {
  id: string;
  regionId: string;
  severity: Severity;
  title: string;
  detail: string;
  elapsed: string;
  status: FeedStatus;
  acknowledgedBy?: { name: string; initials: string };
}

export const FEED: FeedItem[] = [
  {
    id: "evt-1",
    regionId: "sin",
    severity: "critical",
    title: "Elevated 5xx errors at edge nodes",
    detail: "Error rate climbed to 6.8% on cache-miss requests; origin fallback is absorbing the overflow.",
    elapsed: "6 min ago",
    status: "ongoing",
  },
  {
    id: "evt-2",
    regionId: "sin",
    severity: "critical",
    title: "BGP route flap detected",
    detail: "Upstream transit provider is re-announcing routes every 90 seconds, causing intermittent packet loss.",
    elapsed: "22 min ago",
    status: "ongoing",
  },
  {
    id: "evt-3",
    regionId: "bom",
    severity: "minor",
    title: "Cache hit ratio below threshold",
    detail: "Hit ratio dropped to 81%, below the 90% alert threshold, after a config push to the edge cache layer.",
    elapsed: "41 min ago",
    status: "ongoing",
  },
  {
    id: "evt-4",
    regionId: "fra",
    severity: "major",
    title: "Origin shield latency spike",
    detail: "p95 origin shield response time rose from 40ms to 310ms; investigating the regional transit link.",
    elapsed: "1 h 8 min ago",
    status: "ongoing",
  },
  {
    id: "evt-5",
    regionId: "dxb",
    severity: "maintenance",
    title: "Scheduled firmware rollout window",
    detail: "Rolling edge-node firmware update, one PoP at a time, with automatic traffic draining per node.",
    elapsed: "2 h ago",
    status: "monitoring",
  },
  {
    id: "evt-6",
    regionId: "jnb",
    severity: "resolved",
    title: "Packet loss on peering link",
    detail: "A degraded peering session with a regional carrier was failed over to a backup transit path.",
    elapsed: "5 h ago",
    status: "resolved",
    acknowledgedBy: { name: "Priya Nandakumar", initials: "PN" },
  },
  {
    id: "evt-7",
    regionId: "scl",
    severity: "resolved",
    title: "TLS handshake failures",
    detail: "A misconfigured certificate bundle on one edge node was replaced after automated health checks flagged it.",
    elapsed: "9 h ago",
    status: "resolved",
    acknowledgedBy: { name: "Marcus Thienpont", initials: "MT" },
  },
  {
    id: "evt-8",
    regionId: "hkg",
    severity: "resolved",
    title: "Config sync delay",
    detail: "Config propagation lagged behind the control plane by four minutes during a deploy; sync has caught up.",
    elapsed: "1 d ago",
    status: "resolved",
    acknowledgedBy: { name: "Priya Nandakumar", initials: "PN" },
  },
];

export const ACTIVE_INCIDENTS = FEED.filter((f) => f.status === "ongoing").length;

export function regionById(id: string): Region | undefined {
  return REGIONS.find((r) => r.id === id);
}

export const MOST_SEVERE_REGION_ID: string = (() => {
  const rank: Record<RegionStatus, number> = { critical: 3, degraded: 2, maintenance: 1, healthy: 0 };
  let best = REGIONS[0]!;
  for (const r of REGIONS) {
    if (rank[r.status] > rank[best.status] || (rank[r.status] === rank[best.status] && r.incidentCount > best.incidentCount)) {
      best = r;
    }
  }
  return best.id;
})();

export const CURRENT_USER = { name: "Dana Oyelaran", email: "dana@isobar-edge.com", initials: "DO" };

export const STATUS_LABEL: Record<RegionStatus, string> = {
  healthy: "Healthy",
  degraded: "Degraded",
  critical: "Critical",
  maintenance: "Maint.",
};

export const STATUS_WORD: Record<RegionStatus, string> = {
  healthy: "Healthy",
  degraded: "Degraded",
  critical: "Critical",
  maintenance: "Maintenance",
};
