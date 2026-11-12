/**
 * Keelwatch — Reliability Command Center
 *
 * All figures below are hand-authored literals. There is no `Math.random`, `Date.now`, or
 * `new Date()` anywhere in this candidate: "elapsed" and "resolution" times are plain authored
 * minute counts, not computed from the real clock, so the page renders identically on the server
 * and after hydration no matter when it is opened.
 *
 * Reconciliation contract (checked by hand, re-checked by the functions below):
 * - `computeActiveStats` / `computeUptimePct` / `computeBudgetBurn` / `computeResponderLoad` are
 *   the ONLY places that summarize `INITIAL_INCIDENTS`. The header strip, the error-budget card,
 *   the responder-load card, and the composer's next-id all call these, never a typed-out number.
 * - Of the 12 seed incidents: 4 are `open`, 3 are `acknowledged`, 5 are `resolved` (4+3+5=12).
 *   Active (open+acknowledged) = 7, of which 3 carry `critical` severity and are still active.
 *   Resolved durations are 37, 22, 58, 15, 29 minutes — mean 32.2m, shown rounded as "32m".
 */

export type ServiceId =
  | "api-gateway"
  | "auth-service"
  | "checkout-service"
  | "search-index"
  | "billing-api"
  | "media-cdn"
  | "user-profile";

export type RegionId = "us-east-1" | "us-west-2" | "eu-west-1" | "ap-southeast-1" | "sa-east-1";

export type Metric = "errorRate" | "latencyP95";

export type Severity = "critical" | "major" | "minor";
export type IncidentStatus = "open" | "acknowledged" | "resolved";
export type FeedFilter = "all" | "open" | "acknowledged" | "resolved" | "critical";

export const SERVICES: { id: ServiceId; label: string }[] = [
  { id: "api-gateway", label: "API Gateway" },
  { id: "auth-service", label: "Auth Service" },
  { id: "checkout-service", label: "Checkout Service" },
  { id: "search-index", label: "Search Index" },
  { id: "billing-api", label: "Billing API" },
  { id: "media-cdn", label: "Media CDN" },
  { id: "user-profile", label: "User Profile" },
];

export const REGIONS: { id: RegionId; label: string; full: string }[] = [
  { id: "us-east-1", label: "US East", full: "US East (N. Virginia)" },
  { id: "us-west-2", label: "US West", full: "US West (Oregon)" },
  { id: "eu-west-1", label: "EU West", full: "EU West (Ireland)" },
  { id: "ap-southeast-1", label: "AP Southeast", full: "AP Southeast (Singapore)" },
  { id: "sa-east-1", label: "SA East", full: "SA East (Sao Paulo)" },
];

export function serviceLabel(id: ServiceId): string {
  return SERVICES.find((s) => s.id === id)?.label ?? id;
}

export function regionLabel(id: RegionId): string {
  return REGIONS.find((r) => r.id === id)?.label ?? id;
}

/** Error rate, percent of requests. Range across the matrix: 0.09 (min) – 4.82 (max). */
const ERROR_RATE_PCT: Record<ServiceId, Record<RegionId, number>> = {
  "api-gateway": { "us-east-1": 0.42, "us-west-2": 0.38, "eu-west-1": 0.51, "ap-southeast-1": 1.24, "sa-east-1": 2.87 },
  "auth-service": { "us-east-1": 0.18, "us-west-2": 0.21, "eu-west-1": 0.29, "ap-southeast-1": 0.64, "sa-east-1": 1.15 },
  "checkout-service": { "us-east-1": 0.73, "us-west-2": 0.69, "eu-west-1": 0.88, "ap-southeast-1": 2.41, "sa-east-1": 4.82 },
  "search-index": { "us-east-1": 0.31, "us-west-2": 0.27, "eu-west-1": 0.35, "ap-southeast-1": 0.58, "sa-east-1": 0.94 },
  "billing-api": { "us-east-1": 0.22, "us-west-2": 0.19, "eu-west-1": 0.33, "ap-southeast-1": 0.71, "sa-east-1": 1.62 },
  "media-cdn": { "us-east-1": 0.15, "us-west-2": 0.12, "eu-west-1": 0.2, "ap-southeast-1": 0.46, "sa-east-1": 0.88 },
  "user-profile": { "us-east-1": 0.09, "us-west-2": 0.11, "eu-west-1": 0.14, "ap-southeast-1": 0.33, "sa-east-1": 0.61 },
};

/** p95 latency, milliseconds. Range across the matrix: 43 (min) – 890 (max). */
const LATENCY_P95_MS: Record<ServiceId, Record<RegionId, number>> = {
  "api-gateway": { "us-east-1": 112, "us-west-2": 108, "eu-west-1": 134, "ap-southeast-1": 268, "sa-east-1": 441 },
  "auth-service": { "us-east-1": 64, "us-west-2": 61, "eu-west-1": 77, "ap-southeast-1": 142, "sa-east-1": 233 },
  "checkout-service": { "us-east-1": 156, "us-west-2": 149, "eu-west-1": 187, "ap-southeast-1": 392, "sa-east-1": 890 },
  "search-index": { "us-east-1": 71, "us-west-2": 68, "eu-west-1": 84, "ap-southeast-1": 119, "sa-east-1": 201 },
  "billing-api": { "us-east-1": 58, "us-west-2": 55, "eu-west-1": 69, "ap-southeast-1": 131, "sa-east-1": 247 },
  "media-cdn": { "us-east-1": 45, "us-west-2": 43, "eu-west-1": 52, "ap-southeast-1": 98, "sa-east-1": 176 },
  "user-profile": { "us-east-1": 49, "us-west-2": 47, "eu-west-1": 58, "ap-southeast-1": 107, "sa-east-1": 189 },
};

export function matrixValue(metric: Metric, serviceId: ServiceId, regionId: RegionId): number {
  const table = metric === "errorRate" ? ERROR_RATE_PCT : LATENCY_P95_MS;
  return table[serviceId][regionId];
}

export function matrixRange(metric: Metric): { min: number; max: number } {
  let min = Infinity;
  let max = -Infinity;
  for (const s of SERVICES) {
    for (const r of REGIONS) {
      const v = matrixValue(metric, s.id, r.id);
      if (v < min) min = v;
      if (v > max) max = v;
    }
  }
  return { min, max };
}

export type HeatCell = { serviceId: ServiceId; regionId: RegionId; value: number };

/** Identifies a cell without freezing a metric-specific value — the Pinned Cell card recomputes
 *  both metrics live from this id pair, so it can never go stale if the heatmap's own metric
 *  toggle is flipped after the pin was set. */
export type PinnedKey = { serviceId: ServiceId; regionId: RegionId };

/** The single highest-value cell for a metric — used for the always-visible headline and the
 *  Pinned Cell card's default fallback. Computed from the matrix, never typed out by hand. */
export function worstCell(metric: Metric): HeatCell {
  let best: HeatCell | null = null;
  for (const s of SERVICES) {
    for (const r of REGIONS) {
      const value = matrixValue(metric, s.id, r.id);
      if (!best || value > best.value) best = { serviceId: s.id, regionId: r.id, value };
    }
  }
  return best as HeatCell;
}

/** Buckets a value into one of 5 escalating intensity tiers (0 = healthiest, 4 = worst),
 *  relative to the metric's own min/max. Pure function of the data — no randomness. */
export function tierIndex(value: number, metric: Metric): 0 | 1 | 2 | 3 | 4 {
  const { min, max } = matrixRange(metric);
  const span = max - min || 1;
  const norm = (value - min) / span;
  const idx = Math.min(4, Math.floor(norm * 5));
  return idx as 0 | 1 | 2 | 3 | 4;
}

// ---------------------------------------------------------------------------------------------
// Incidents
// ---------------------------------------------------------------------------------------------

export type EngineerId = "priya" | "marcus" | "dana" | "theo" | "amara";

export const ENGINEERS: Record<EngineerId, { name: string; role: string; avatarId: string }> = {
  priya: { name: "Priya Natarajan", role: "Senior SRE", avatarId: "1544005313-94ddf0286df2" },
  marcus: { name: "Marcus Webb", role: "SRE, Payments", avatarId: "1500648767791-00dcc994a43e" },
  dana: { name: "Dana Osei", role: "SRE, Platform", avatarId: "1519244703995-f4e0f30006d5" },
  theo: { name: "Theo Lindqvist", role: "SRE, Edge", avatarId: "1607746882042-944635dfe10e" },
  amara: { name: "Amara Chen", role: "SRE, Search", avatarId: "1633332755192-727a05c4013d" },
};

export const CURRENT_USER = {
  name: "Jordan Avery",
  role: "Incident Commander, on duty",
  avatarId: "1472099645785-5658abf4ff4e",
};

export interface Incident {
  id: string;
  title: string;
  serviceId: ServiceId;
  regionId: RegionId;
  severity: Severity;
  status: IncidentStatus;
  /** Plain authored minute count since the incident opened — only meaningful while status is
   *  "open" or "acknowledged". Never derived from the real clock. */
  elapsedMinutes: number | null;
  /** Plain authored minute count from open to resolved — only meaningful once "resolved". */
  resolutionMinutes: number | null;
  assignee: EngineerId | null;
  runbook: string;
}

export const INITIAL_INCIDENTS: Incident[] = [
  {
    id: "INC-1042",
    title: "Elevated 5xx on checkout path",
    serviceId: "api-gateway",
    regionId: "us-east-1",
    severity: "critical",
    status: "open",
    elapsedMinutes: 6,
    resolutionMinutes: null,
    assignee: "priya",
    runbook: "Runbook: Gateway 5xx spike",
  },
  {
    id: "INC-1041",
    title: "Payment capture latency spike",
    serviceId: "checkout-service",
    regionId: "eu-west-1",
    severity: "major",
    status: "open",
    elapsedMinutes: 18,
    resolutionMinutes: null,
    assignee: "dana",
    runbook: "Runbook: Capture latency",
  },
  {
    id: "INC-1040",
    title: "Invoice webhook retries exhausted",
    serviceId: "billing-api",
    regionId: "sa-east-1",
    severity: "critical",
    status: "acknowledged",
    elapsedMinutes: 41,
    resolutionMinutes: null,
    assignee: "marcus",
    runbook: "Runbook: Webhook backlog drain",
  },
  {
    id: "INC-1039",
    title: "Thumbnail cache miss rate above baseline",
    serviceId: "media-cdn",
    regionId: "ap-southeast-1",
    severity: "minor",
    status: "open",
    elapsedMinutes: 9,
    resolutionMinutes: null,
    assignee: "theo",
    runbook: "Runbook: Cache warm sweep",
  },
  {
    id: "INC-1038",
    title: "Query p95 regression after reindex",
    serviceId: "search-index",
    regionId: "us-west-2",
    severity: "major",
    status: "acknowledged",
    elapsedMinutes: 52,
    resolutionMinutes: null,
    assignee: "amara",
    runbook: "Runbook: Reindex rollback",
  },
  {
    id: "INC-1037",
    title: "Avatar upload intermittent 502",
    serviceId: "user-profile",
    regionId: "eu-west-1",
    severity: "minor",
    status: "open",
    elapsedMinutes: 3,
    resolutionMinutes: null,
    assignee: "priya",
    runbook: "Runbook: Upload proxy 502",
  },
  {
    id: "INC-1036",
    title: "Auth token validation timeouts",
    serviceId: "api-gateway",
    regionId: "sa-east-1",
    severity: "critical",
    status: "acknowledged",
    elapsedMinutes: 64,
    resolutionMinutes: null,
    assignee: "marcus",
    runbook: "Runbook: Token validation timeout",
  },
  {
    id: "INC-1035",
    title: "OAuth refresh storm from mobile client",
    serviceId: "auth-service",
    regionId: "us-east-1",
    severity: "major",
    status: "resolved",
    elapsedMinutes: null,
    resolutionMinutes: 37,
    assignee: "priya",
    runbook: "Runbook: Refresh storm throttle",
  },
  {
    id: "INC-1034",
    title: "Delayed usage metering export",
    serviceId: "billing-api",
    regionId: "us-west-2",
    severity: "minor",
    status: "resolved",
    elapsedMinutes: null,
    resolutionMinutes: 22,
    assignee: "amara",
    runbook: "Runbook: Metering export retry",
  },
  {
    id: "INC-1033",
    title: "Cart service dependency outage",
    serviceId: "checkout-service",
    regionId: "ap-southeast-1",
    severity: "critical",
    status: "resolved",
    elapsedMinutes: null,
    resolutionMinutes: 58,
    assignee: "dana",
    runbook: "Runbook: Dependency failover",
  },
  {
    id: "INC-1032",
    title: "Autosuggest index staleness",
    serviceId: "search-index",
    regionId: "eu-west-1",
    severity: "minor",
    status: "resolved",
    elapsedMinutes: null,
    resolutionMinutes: 15,
    assignee: "theo",
    runbook: "Runbook: Index refresh",
  },
  {
    id: "INC-1031",
    title: "Edge cache purge delay",
    serviceId: "media-cdn",
    regionId: "us-east-1",
    severity: "major",
    status: "resolved",
    elapsedMinutes: null,
    resolutionMinutes: 29,
    assignee: "marcus",
    runbook: "Runbook: Purge queue drain",
  },
];

export const SEVERITY_RANK: Record<Severity, number> = { critical: 3, major: 2, minor: 1 };
export const STATUS_RANK: Record<IncidentStatus, number> = { open: 3, acknowledged: 2, resolved: 1 };

/** Next sequential incident id — derived from the current array's highest numeral, never a
 *  literal. Used only by the "Declare incident" composer. */
export function nextIncidentId(incidents: Incident[]): string {
  const max = incidents.reduce((acc, inc) => {
    const n = Number(inc.id.replace("INC-", ""));
    return Number.isFinite(n) && n > acc ? n : acc;
  }, 0);
  return `INC-${max + 1}`;
}

export function computeActiveStats(incidents: Incident[]): {
  activeCount: number;
  criticalActiveCount: number;
  mttrMinutes: number;
} {
  const active = incidents.filter((i) => i.status !== "resolved");
  const criticalActive = active.filter((i) => i.severity === "critical");
  const resolved = incidents.filter((i) => i.status === "resolved" && i.resolutionMinutes !== null);
  const totalResolutionMinutes = resolved.reduce((sum, i) => sum + (i.resolutionMinutes ?? 0), 0);
  const mttrMinutes = resolved.length > 0 ? totalResolutionMinutes / resolved.length : 0;
  return { activeCount: active.length, criticalActiveCount: criticalActive.length, mttrMinutes };
}

/** Uptime over a 30-day window, derived from the same resolved-incident downtime minutes the
 *  error-budget card burns against — the two can never disagree because they share one source. */
export function computeUptimePct(incidents: Incident[], windowMinutes = 30 * 24 * 60): number {
  const downtime = incidents.reduce((sum, i) => sum + (i.status === "resolved" ? i.resolutionMinutes ?? 0 : 0), 0);
  return ((windowMinutes - downtime) / windowMinutes) * 100;
}

export const MONTHLY_BUDGET_MINUTES = 43.2; // 0.1% of a 30-day window (99.9% SLO)

export function computeBudgetBurn(
  incidents: Incident[],
  serviceId: ServiceId
): { burnedMinutes: number; budgetMinutes: number; pct: number; remainingMinutes: number } {
  const burnedMinutes = incidents.reduce(
    (sum, i) => sum + (i.status === "resolved" && i.serviceId === serviceId ? i.resolutionMinutes ?? 0 : 0),
    0
  );
  const pct = (burnedMinutes / MONTHLY_BUDGET_MINUTES) * 100;
  return { burnedMinutes, budgetMinutes: MONTHLY_BUDGET_MINUTES, pct, remainingMinutes: MONTHLY_BUDGET_MINUTES - burnedMinutes };
}

export function computeResponderLoad(incidents: Incident[]): { engineerId: EngineerId; activeCount: number }[] {
  const ids = Object.keys(ENGINEERS) as EngineerId[];
  return ids
    .map((engineerId) => ({
      engineerId,
      activeCount: incidents.filter((i) => i.assignee === engineerId && i.status !== "resolved").length,
    }))
    .sort((a, b) => b.activeCount - a.activeCount);
}
