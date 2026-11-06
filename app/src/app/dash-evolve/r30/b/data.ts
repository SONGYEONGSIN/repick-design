/**
 * Corvid — incident command board for platform / SRE teams.
 *
 * All data below is hand-authored and fixed (no Math.random, no Date.now(), no argument-less
 * `new Date()`). ANCHOR is a fixed point in time that every "age" and "SLA remaining" figure is
 * computed from at render time — never the wall clock. Sparkline points are produced by a pure
 * deterministic formula (fixed seed/base/amplitude/trend per incident), rounded to 2 decimals.
 * Aggregate figures (org-wide strip, column headers, inspector strip) are always *derived* from
 * the INCIDENTS array below with reduce/filter, never hand-typed separately, so totals always
 * reconcile with the underlying rows.
 */

export const ANCHOR = new Date(2026, 8, 26, 9, 15); // Sep 26, 2026, 09:15 — fixed reference "now"

// ---------------------------------------------------------------------------------------
// Enums / meta
// ---------------------------------------------------------------------------------------

export type Severity = "sev1" | "sev2" | "sev3" | "sev4";
export type ColumnId = "reported" | "triaging" | "mitigating" | "monitoring" | "resolved";
export type SlaState = "on-track" | "at-risk" | "breached" | "met" | "missed";

export const SEVERITY_ORDER: Severity[] = ["sev1", "sev2", "sev3", "sev4"];

export const SEVERITY_META: Record<Severity, { label: string; rank: number }> = {
  sev1: { label: "SEV1", rank: 0 },
  sev2: { label: "SEV2", rank: 1 },
  sev3: { label: "SEV3", rank: 2 },
  sev4: { label: "SEV4", rank: 3 },
};

export const SLA_TARGET_MIN: Record<Severity, number> = {
  sev1: 180, // 3h
  sev2: 480, // 8h
  sev3: 1440, // 24h
  sev4: 2880, // 48h
};

export const COLUMN_ORDER: ColumnId[] = ["reported", "triaging", "mitigating", "monitoring", "resolved"];

export const COLUMN_META: Record<ColumnId, { label: string; blurb: string }> = {
  reported: { label: "Reported", blurb: "Just flagged, awaiting an owner" },
  triaging: { label: "Triaging", blurb: "Severity confirmed, scoping impact" },
  mitigating: { label: "Mitigating", blurb: "Actively working the fix" },
  monitoring: { label: "Monitoring", blurb: "Fix shipped, watching for recurrence" },
  resolved: { label: "Resolved", blurb: "Closed out" },
};

// ---------------------------------------------------------------------------------------
// Deterministic sparkline generator — pure function of fixed inputs, no Math.random/Date.now.
// ---------------------------------------------------------------------------------------

function sparkline(seed: number, base: number, amp: number, trend: number): number[] {
  const pts: number[] = [];
  for (let i = 0; i < 7; i++) {
    const wave = Math.sin(seed + i * 0.85) * amp;
    const v = Math.max(0, base + wave + trend * i);
    pts.push(Math.round(v * 100) / 100);
  }
  return pts;
}

// ---------------------------------------------------------------------------------------
// Incidents
// ---------------------------------------------------------------------------------------

export interface Assignee {
  name: string;
  initials: string;
}

export interface Incident {
  id: string;
  title: string;
  service: string;
  squad: string;
  severity: Severity;
  column: ColumnId;
  assignee: Assignee | null;
  /** Minutes before ANCHOR the incident was opened. */
  openedMin: number;
  /** Minutes before ANCHOR the incident was resolved (resolved column only). */
  resolvedMin?: number;
  /** Error-rate trend, 7 points, oldest to newest, errors/min. */
  errorRate: number[];
  /** Requests or sessions impacted. */
  impacted: number;
  lastUpdate: string;
  nextAction: string;
}

export const INCIDENTS: Incident[] = [
  {
    id: "inc-101",
    title: "Auth Gateway returning intermittent 500s on token refresh",
    service: "Auth Gateway",
    squad: "Platform Core",
    severity: "sev2",
    column: "reported",
    assignee: null,
    openedMin: 8,
    errorRate: sparkline(1.1, 8, 3, 0.6),
    impacted: 540,
    lastUpdate: "Auto-detected by the latency monitor; no owner yet.",
    nextAction: "Page Platform Core on-call to confirm scope.",
  },
  {
    id: "inc-102",
    title: "Search Index queries timing out for large result sets",
    service: "Search Index",
    squad: "Search & Discovery",
    severity: "sev3",
    column: "reported",
    assignee: null,
    openedMin: 14,
    errorRate: sparkline(2.3, 4, 1.5, 0.3),
    impacted: 95,
    lastUpdate: "Reported by three customers via the support desk.",
    nextAction: "Pull the slow-query log for the affected shard.",
  },
  {
    id: "inc-103",
    title: "Push notification delivery delayed across EU region",
    service: "Notification Fanout",
    squad: "Messaging",
    severity: "sev2",
    column: "reported",
    assignee: null,
    openedMin: 22,
    errorRate: sparkline(0.7, 10, 4, 0.8),
    impacted: 610,
    lastUpdate: "EU push latency crossed the 90s p95 alert threshold.",
    nextAction: "Check Notification Fanout queue depth in eu-west-1.",
  },
  {
    id: "inc-104",
    title: "Edge CDN cache purge stuck for static assets",
    service: "Edge CDN",
    squad: "Edge & Delivery",
    severity: "sev3",
    column: "triaging",
    assignee: { name: "Osric Vance", initials: "OV" },
    openedMin: 46,
    errorRate: sparkline(3.1, 6, 2, 0.1),
    impacted: 140,
    lastUpdate: "Osric confirmed the purge job is wedged on one edge node.",
    nextAction: "Force-restart the purge worker and re-queue the batch.",
  },
  {
    id: "inc-105",
    title: "Realtime Sync dropping presence events under load",
    service: "Realtime Sync",
    squad: "Platform Core",
    severity: "sev2",
    column: "triaging",
    assignee: { name: "Talia Bergström", initials: "TB" },
    openedMin: 61,
    errorRate: sparkline(1.9, 14, 3, 0.2),
    impacted: 720,
    lastUpdate: "Talia is comparing presence drop rate across regions.",
    nextAction: "Roll back last night's presence-service config change.",
  },
  {
    id: "inc-106",
    title: "Mobile API Gateway rate-limiting legitimate traffic",
    service: "Mobile API Gateway",
    squad: "Mobile",
    severity: "sev2",
    column: "triaging",
    assignee: { name: "Deshawn Okafor", initials: "DO" },
    openedMin: 39,
    errorRate: sparkline(2.7, 9, 2.5, 0.1),
    impacted: 980,
    lastUpdate: "Deshawn traced it to a misconfigured rate-limit tier.",
    nextAction: "Raise the limit for verified partner traffic.",
  },
  {
    id: "inc-107",
    title: "Data Pipeline backlog growing on nightly ingest job",
    service: "Data Pipeline",
    squad: "Data Infra",
    severity: "sev3",
    column: "triaging",
    assignee: { name: "Ingrid Halvorsen", initials: "IH" },
    openedMin: 1500,
    errorRate: sparkline(0.4, 5, 1.5, 0.05),
    impacted: 310,
    lastUpdate: "Ingrid flagged this is now past its triage SLA.",
    nextAction: "Escalate to the Data Infra lead for a backlog drain plan.",
  },
  {
    id: "inc-108",
    title: "Auth Gateway session store connection pool exhausted",
    service: "Auth Gateway",
    squad: "Platform Core",
    severity: "sev1",
    column: "mitigating",
    assignee: { name: "Talia Bergström", initials: "TB" },
    openedMin: 165,
    errorRate: sparkline(4.2, 34, 6, -2.5),
    impacted: 4100,
    lastUpdate: "Pool size bumped to 400; watching for saturation.",
    nextAction: "Escalate to database on-call if the pool saturates again.",
  },
  {
    id: "inc-109",
    title: "Search Index replica lag causing stale results",
    service: "Search Index",
    squad: "Search & Discovery",
    severity: "sev2",
    column: "mitigating",
    assignee: { name: "Nnamdi Achebe", initials: "NA" },
    openedMin: 130,
    errorRate: sparkline(1.1, 16, 3, -1.2),
    impacted: 890,
    lastUpdate: "Replica promoted; lag is dropping steadily.",
    nextAction: "Confirm read traffic has shifted off the stale replica.",
  },
  {
    id: "inc-110",
    title: "Notification Fanout duplicate sends to mobile push",
    service: "Notification Fanout",
    squad: "Messaging",
    severity: "sev2",
    column: "mitigating",
    assignee: { name: "Freya Lindqvist", initials: "FL" },
    openedMin: 180,
    errorRate: sparkline(2.2, 12, 2.5, -0.8),
    impacted: 1150,
    lastUpdate: "Dedup filter deployed to staging for validation.",
    nextAction: "Ship the dedup fix to production once staging is clean.",
  },
  {
    id: "inc-111",
    title: "Edge CDN origin shield overloaded during traffic spike",
    service: "Edge CDN",
    squad: "Edge & Delivery",
    severity: "sev1",
    column: "mitigating",
    assignee: { name: "Osric Vance", initials: "OV" },
    openedMin: 195,
    errorRate: sparkline(3.6, 40, 7, -2.8),
    impacted: 5200,
    lastUpdate: "Traffic partially shifted to the secondary shield.",
    nextAction: "Add capacity to the primary shield and rebalance.",
  },
  {
    id: "inc-112",
    title: "Realtime Sync websocket reconnect storm",
    service: "Realtime Sync",
    squad: "Platform Core",
    severity: "sev2",
    column: "mitigating",
    assignee: { name: "Rowan Delacroix", initials: "RD" },
    openedMin: 210,
    errorRate: sparkline(0.9, 15, 3, -1.0),
    impacted: 760,
    lastUpdate: "Reconnect backoff patched; the storm is easing.",
    nextAction: "Watch connection counts through the next peak window.",
  },
  {
    id: "inc-113",
    title: "Media Pipeline transcode queue stalled for uploads",
    service: "Media Pipeline",
    squad: "Mobile",
    severity: "sev3",
    column: "mitigating",
    assignee: { name: "Deshawn Okafor", initials: "DO" },
    openedMin: 260,
    errorRate: sparkline(2.0, 9, 2, -0.5),
    impacted: 260,
    lastUpdate: "Queue drained to half; a new worker pool is spinning up.",
    nextAction: "Confirm the upload backlog clears before the next content push.",
  },
  {
    id: "inc-114",
    title: "Auth Gateway token refresh latency spike",
    service: "Auth Gateway",
    squad: "Platform Core",
    severity: "sev2",
    column: "monitoring",
    assignee: { name: "Talia Bergström", initials: "TB" },
    openedMin: 410,
    errorRate: sparkline(1.5, 6, 1.2, -0.3),
    impacted: 430,
    lastUpdate: "Latency is back under 200ms after the config rollback.",
    nextAction: "Hold for one more traffic cycle before closing out.",
  },
  {
    id: "inc-115",
    title: "Data Pipeline job retries after schema drift",
    service: "Data Pipeline",
    squad: "Data Infra",
    severity: "sev3",
    column: "monitoring",
    assignee: { name: "Ingrid Halvorsen", initials: "IH" },
    openedMin: 400,
    errorRate: sparkline(2.9, 4, 1, -0.2),
    impacted: 90,
    lastUpdate: "Retries are succeeding; the schema patch is applied.",
    nextAction: "Confirm tonight's nightly job completes clean.",
  },
  {
    id: "inc-116",
    title: "Mobile API Gateway TLS handshake failures on old clients",
    service: "Mobile API Gateway",
    squad: "Mobile",
    severity: "sev3",
    column: "monitoring",
    assignee: { name: "Yuki Tanaka", initials: "YT" },
    openedMin: 500,
    errorRate: sparkline(0.3, 5, 1.3, -0.15),
    impacted: 180,
    lastUpdate: "Legacy TLS clients rerouted to the compatibility endpoint.",
    nextAction: "Track the handshake failure rate for 24 hours.",
  },
  {
    id: "inc-117",
    title: "Search Index indexing delay after mapping change",
    service: "Search Index",
    squad: "Search & Discovery",
    severity: "sev4",
    column: "monitoring",
    assignee: { name: "Nnamdi Achebe", initials: "NA" },
    openedMin: 620,
    errorRate: sparkline(3.3, 2, 0.6, -0.1),
    impacted: 24,
    lastUpdate: "Reindex finished; search results are back to normal.",
    nextAction: "Close out after the next scheduled index health check.",
  },
  {
    id: "inc-118",
    title: "Edge CDN stale cache serving outdated assets",
    service: "Edge CDN",
    squad: "Edge & Delivery",
    severity: "sev4",
    column: "monitoring",
    assignee: { name: "Yuki Tanaka", initials: "YT" },
    openedMin: 700,
    errorRate: sparkline(1.2, 1.5, 0.5, -0.05),
    impacted: 15,
    lastUpdate: "Cache invalidation pushed to all edge nodes.",
    nextAction: "Spot-check asset freshness across three regions.",
  },
  {
    id: "inc-119",
    title: "Notification Fanout SMTP relay outage",
    service: "Notification Fanout",
    squad: "Messaging",
    severity: "sev1",
    column: "resolved",
    assignee: { name: "Freya Lindqvist", initials: "FL" },
    openedMin: 1400,
    resolvedMin: 1200,
    errorRate: sparkline(2.6, 3, 1, -0.4),
    impacted: 6100,
    lastUpdate: "Relay provider failover completed successfully.",
    nextAction: "Postmortem scheduled — root cause: expired relay credential.",
  },
  {
    id: "inc-120",
    title: "Realtime Sync region failover misroute",
    service: "Realtime Sync",
    squad: "Platform Core",
    severity: "sev2",
    column: "resolved",
    assignee: { name: "Rowan Delacroix", initials: "RD" },
    openedMin: 2000,
    resolvedMin: 1850,
    errorRate: sparkline(0.6, 4, 1.2, -0.5),
    impacted: 940,
    lastUpdate: "Failover path corrected and validated in staging.",
    nextAction: "Add an automated check for misrouted failover targets.",
  },
  {
    id: "inc-121",
    title: "Data Pipeline duplicate event ingestion",
    service: "Data Pipeline",
    squad: "Data Infra",
    severity: "sev3",
    column: "resolved",
    assignee: { name: "Ingrid Halvorsen", initials: "IH" },
    openedMin: 2600,
    resolvedMin: 2100,
    errorRate: sparkline(3.8, 3.5, 1, -0.45),
    impacted: 210,
    lastUpdate: "Dedup backfill completed for the affected event window.",
    nextAction: "Add an idempotency key to the ingest contract.",
  },
  {
    id: "inc-122",
    title: "Mobile API Gateway crash loop after deploy",
    service: "Mobile API Gateway",
    squad: "Mobile",
    severity: "sev1",
    column: "resolved",
    assignee: { name: "Deshawn Okafor", initials: "DO" },
    openedMin: 3000,
    resolvedMin: 2900,
    errorRate: sparkline(1.4, 6, 1.5, -0.8),
    impacted: 3300,
    lastUpdate: "Rolled back the deploy; the crash loop stopped.",
    nextAction: "Add a crash-loop guard to the deploy pipeline.",
  },
  {
    id: "inc-123",
    title: "Edge CDN certificate near-expiry alert",
    service: "Edge CDN",
    squad: "Edge & Delivery",
    severity: "sev4",
    column: "resolved",
    assignee: { name: "Osric Vance", initials: "OV" },
    openedMin: 3600,
    resolvedMin: 3500,
    errorRate: sparkline(2.1, 1, 0.3, -0.1),
    impacted: 12,
    lastUpdate: "Certificate renewed and rotated across all edges.",
    nextAction: "Add a 30-day expiry alert to the renewal runbook.",
  },
  {
    id: "inc-124",
    title: "Auth Gateway brute-force lockout false positives",
    service: "Auth Gateway",
    squad: "Platform Core",
    severity: "sev3",
    column: "resolved",
    assignee: { name: "Talia Bergström", initials: "TB" },
    openedMin: 4200,
    resolvedMin: 3900,
    errorRate: sparkline(0.2, 3, 0.9, -0.35),
    impacted: 165,
    lastUpdate: "Lockout threshold tuned to reduce false positives.",
    nextAction: "Monitor the false-positive rate for one more week.",
  },
];

export function getIncident(id: string): Incident | undefined {
  return INCIDENTS.find((i) => i.id === id);
}

// ---------------------------------------------------------------------------------------
// Shared sort — one comparator so the board's per-column order and the compact list's table
// order can never disagree.
// ---------------------------------------------------------------------------------------

export type SortKey = "sla" | "age" | "severity";
export type SortDir = "asc" | "desc";

export function compareIncidents(a: Incident, b: Incident, sortKey: SortKey, sortDir: SortDir): number {
  let diff = 0;
  if (sortKey === "severity") {
    diff = SEVERITY_META[a.severity].rank - SEVERITY_META[b.severity].rank;
  } else if (sortKey === "age") {
    diff = ageMinFor(b) - ageMinFor(a); // oldest first by default
  } else {
    // "sla": soonest-to-breach (or already breached) first.
    diff = slaFor(a).minutes - slaFor(b).minutes;
  }
  return sortDir === "asc" ? diff : -diff;
}

// ---------------------------------------------------------------------------------------
// SLA computation
// ---------------------------------------------------------------------------------------

export interface SlaInfo {
  state: SlaState;
  /** Minutes remaining (open incidents) or minutes the resolution took (resolved incidents). */
  minutes: number;
}

export function slaFor(incident: Incident): SlaInfo {
  const target = SLA_TARGET_MIN[incident.severity];
  if (incident.column === "resolved" && incident.resolvedMin !== undefined) {
    const duration = incident.openedMin - incident.resolvedMin;
    return { state: duration <= target ? "met" : "missed", minutes: duration };
  }
  const remaining = target - incident.openedMin;
  if (remaining <= 0) return { state: "breached", minutes: remaining };
  if (remaining <= target * 0.2) return { state: "at-risk", minutes: remaining };
  return { state: "on-track", minutes: remaining };
}

/** Age used for aggregate stats: time open for active incidents, total lifetime for resolved. */
export function ageMinFor(incident: Incident): number {
  if (incident.column === "resolved" && incident.resolvedMin !== undefined) {
    return incident.openedMin - incident.resolvedMin;
  }
  return incident.openedMin;
}

// ---------------------------------------------------------------------------------------
// Formatters
// ---------------------------------------------------------------------------------------

/** "2h 14m" / "1d 6h" / "42m" — no Intl compact notation anywhere (hydration-safe by hand). */
export function formatMinutes(min: number): string {
  const abs = Math.round(Math.abs(min));
  if (abs < 60) return `${abs}m`;
  const hrs = Math.floor(abs / 60);
  const mins = abs % 60;
  if (hrs < 24) return mins === 0 ? `${hrs}h` : `${hrs}h ${mins}m`;
  const days = Math.floor(hrs / 24);
  const remHrs = hrs % 24;
  return remHrs === 0 ? `${days}d` : `${days}d ${remHrs}h`;
}

/**
 * Manual compact-count formatter. `Intl.NumberFormat({ notation: "compact" })` renders
 * differently across ICU versions between Node (SSR) and the browser, which can hydration-
 * mismatch; dividing and rounding by hand removes that variable entirely.
 */
export function formatCompact(n: number): string {
  const sign = n < 0 ? "-" : "";
  const abs = Math.abs(n);
  if (abs < 1000) return `${sign}${Math.round(abs)}`;
  const unit = abs < 1_000_000 ? 1000 : 1_000_000;
  const suffix = abs < 1_000_000 ? "K" : "M";
  const rounded = Math.round((abs / unit) * 10) / 10;
  const digits = Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
  return `${sign}${digits}${suffix}`;
}

const countFmt = new Intl.NumberFormat("en-US");
export function formatCount(n: number): string {
  return countFmt.format(n);
}

// ---------------------------------------------------------------------------------------
// Org-wide totals — always derived from INCIDENTS, never hand-typed, so figures reconcile.
// ---------------------------------------------------------------------------------------

export const TOTALS = (() => {
  const open = INCIDENTS.filter((i) => i.column !== "resolved");
  const resolved = INCIDENTS.filter((i) => i.column === "resolved");
  const breaching = open.filter((i) => {
    const s = slaFor(i).state;
    return s === "at-risk" || s === "breached";
  });
  const sev1Open = open.filter((i) => i.severity === "sev1");
  const resolvedToday = resolved.filter((i) => (i.resolvedMin ?? Infinity) < 1440);
  const totalResolveMin = resolved.reduce((sum, i) => sum + ageMinFor(i), 0);
  const avgResolveMin = resolved.length > 0 ? Math.round(totalResolveMin / resolved.length) : 0;
  return {
    openCount: open.length,
    sev1OpenCount: sev1Open.length,
    breachingCount: breaching.length,
    resolvedTodayCount: resolvedToday.length,
    avgResolveMin,
  };
})();
