// Deterministic SOC incident-stream data. No Math.random / Date.now / new Date().

export type Severity = "critical" | "high" | "medium" | "low";
export type IncidentStatus = "open" | "investigating" | "resolved";

export type Incident = {
  id: string;
  time: string; // fixed HH:MM, most-recent-first order already applied in the array
  severity: Severity;
  service: string;
  title: string;
  detail: string;
  status: IncidentStatus;
  ackMinutes: number | null; // minutes to acknowledge; null if still unacknowledged
};

export const INCIDENTS: Incident[] = [
  {
    id: "inc-041",
    time: "14:52",
    severity: "critical",
    service: "payments-api",
    title: "Elevated 5xx rate on checkout",
    detail: "5xx rate on /v2/checkout rose from 0.2% to 6.8% over 4 minutes. Auto-scaling added 3 nodes; rate has not yet recovered.",
    status: "open",
    ackMinutes: null,
  },
  {
    id: "inc-040",
    time: "14:38",
    severity: "high",
    service: "auth-svc",
    title: "Token refresh latency p99 > 2s",
    detail: "p99 latency on /oauth/refresh climbed from 180ms to 2.1s after the 14:20 deploy. Rollback candidate identified.",
    status: "investigating",
    ackMinutes: 6,
  },
  {
    id: "inc-039",
    time: "14:10",
    severity: "medium",
    service: "search-index",
    title: "Index lag exceeds 90s SLA",
    detail: "Replication lag on the secondary search cluster has held above 90s for three consecutive samples.",
    status: "investigating",
    ackMinutes: 11,
  },
  {
    id: "inc-038",
    time: "13:47",
    severity: "low",
    service: "notifications",
    title: "Email digest job ran 9 minutes late",
    detail: "Scheduled 13:30 digest completed at 13:39. Queue backlog cleared by 13:45. No customer-visible impact confirmed.",
    status: "resolved",
    ackMinutes: 4,
  },
  {
    id: "inc-037",
    time: "13:22",
    severity: "high",
    service: "payments-api",
    title: "Webhook delivery retries spiking",
    detail: "Outbound webhook retry rate up 4x. Receiving endpoints for 2 of 14 partners are timing out.",
    status: "resolved",
    ackMinutes: 3,
  },
  {
    id: "inc-036",
    time: "12:58",
    severity: "critical",
    service: "database-primary",
    title: "Primary replica lag breach",
    detail: "Read-replica lag exceeded 30s for 6 minutes during a bulk migration job. Migration paused, lag recovering.",
    status: "resolved",
    ackMinutes: 2,
  },
  {
    id: "inc-035",
    time: "12:31",
    severity: "medium",
    service: "cdn-edge",
    title: "Cache hit ratio dropped to 71%",
    detail: "Edge cache hit ratio fell from a 94% baseline after a purge triggered by a bad deploy tag. Recovering as TTLs refill.",
    status: "resolved",
    ackMinutes: 7,
  },
  {
    id: "inc-034",
    time: "11:55",
    severity: "low",
    service: "auth-svc",
    title: "Elevated login captcha rate",
    detail: "Captcha challenge rate briefly rose to 4% of logins during a known bot-traffic burst. Mitigated by existing rate limits.",
    status: "resolved",
    ackMinutes: 5,
  },
  {
    id: "inc-033",
    time: "11:20",
    severity: "high",
    service: "search-index",
    title: "Query timeout rate above threshold",
    detail: "Timeout rate on the product-search endpoint crossed 2% during a reindex window. Reindex throttled; recovering.",
    status: "resolved",
    ackMinutes: 9,
  },
  {
    id: "inc-032",
    time: "10:44",
    severity: "medium",
    service: "cdn-edge",
    title: "Origin shield error rate up",
    detail: "A single PoP (fra-2) reported a 3% error rate for 8 minutes, isolated to one upstream path.",
    status: "resolved",
    ackMinutes: 6,
  },
];

export const SERVICES = Array.from(new Set(INCIDENTS.map((i) => i.service))).sort();

// Hourly incident counts for the activity sparkline, oldest first (10:00–14:00).
export const HOURLY_COUNTS: { label: string; count: number }[] = [
  { label: "10:00", count: 1 },
  { label: "11:00", count: 2 },
  { label: "12:00", count: 2 },
  { label: "13:00", count: 2 },
  { label: "14:00", count: 3 },
];

export const SEVERITIES: Severity[] = ["critical", "high", "medium", "low"];

export const SEVERITY_LABEL: Record<Severity, string> = {
  critical: "Critical",
  high: "High",
  medium: "Medium",
  low: "Low",
};

// Reconciliation check (hand-verified): open=1, investigating=2, resolved=7 — sums to 10,
// matching INCIDENTS.length.
export const OPEN_COUNT = INCIDENTS.filter((i) => i.status === "open").length;
export const INVESTIGATING_COUNT = INCIDENTS.filter((i) => i.status === "investigating").length;
export const CRITICAL_COUNT = INCIDENTS.filter((i) => i.severity === "critical").length;

const ackValues = INCIDENTS.map((i) => i.ackMinutes).filter((v): v is number => v !== null);
export const MTTA_MINUTES = Math.round((ackValues.reduce((a, b) => a + b, 0) / ackValues.length) * 10) / 10;
export const MTTA_MINUTES_LAST = 7.4; // prior window, hand-set reference point
export const OPEN_COUNT_LAST = 2;
