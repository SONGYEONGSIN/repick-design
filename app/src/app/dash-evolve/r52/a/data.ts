// Deterministic dummy data — no Math.random / Date.now / new Date(). Every date is a fixed ISO
// string. Sums are reconciled by construction (see buildMonth below), not typed in by hand.

export type Severity = "sev1" | "sev2" | "sev3";
export type IncidentStatus = "open" | "ack" | "resolved";

export type Engineer = {
  id: string;
  name: string;
  initials: string;
  team: string;
};

export const ENGINEERS: Engineer[] = [
  { id: "eng-1", name: "Priya Anand", initials: "PA", team: "Platform" },
  { id: "eng-2", name: "Dean Okafor", initials: "DO", team: "Platform" },
  { id: "eng-3", name: "Hana Kobori", initials: "HK", team: "Edge" },
  { id: "eng-4", name: "Lukas Berger", initials: "LB", team: "Edge" },
  { id: "eng-5", name: "Sam Whitfield", initials: "SW", team: "Data" },
  { id: "eng-6", name: "Nora Vance", initials: "NV", team: "Data" },
];

export type Incident = {
  id: string;
  title: string;
  severity: Severity;
  status: IncidentStatus;
  engineerId: string;
  dateIso: string; // fixed, e.g. "2026-10-03"
  timeLabel: string; // fixed display string, e.g. "03:14"
  minutesToAck: number;
  service: string;
};

// 31 fixed incidents across a 35-day (5-week) window. Counts below are derived from this array —
// never typed in separately — so per-day totals and the month total always reconcile.
export const INCIDENTS: Incident[] = [
  { id: "inc-1001", title: "Edge POP latency spike (fra1)", severity: "sev2", status: "resolved", engineerId: "eng-3", dateIso: "2026-10-01", timeLabel: "02:41", minutesToAck: 6, service: "edge-router" },
  { id: "inc-1002", title: "Queue consumer backlog > 50k", severity: "sev1", status: "resolved", engineerId: "eng-1", dateIso: "2026-10-01", timeLabel: "22:03", minutesToAck: 3, service: "ingest-queue" },
  { id: "inc-1003", title: "Cert renewal failure, api.*.internal", severity: "sev3", status: "resolved", engineerId: "eng-4", dateIso: "2026-10-02", timeLabel: "09:12", minutesToAck: 18, service: "cert-manager" },
  { id: "inc-1004", title: "Read replica lag > 90s", severity: "sev2", status: "resolved", engineerId: "eng-5", dateIso: "2026-10-03", timeLabel: "14:55", minutesToAck: 9, service: "postgres-ro" },
  { id: "inc-1005", title: "Checkout 5xx burst", severity: "sev1", status: "resolved", engineerId: "eng-2", dateIso: "2026-10-03", timeLabel: "19:30", minutesToAck: 2, service: "checkout-api" },
  { id: "inc-1006", title: "Autoscaler stuck at min capacity", severity: "sev2", status: "resolved", engineerId: "eng-2", dateIso: "2026-10-04", timeLabel: "03:08", minutesToAck: 11, service: "autoscaler" },
  { id: "inc-1007", title: "DNS resolver timeout cluster-wide", severity: "sev1", status: "resolved", engineerId: "eng-3", dateIso: "2026-10-05", timeLabel: "01:19", minutesToAck: 4, service: "coredns" },
  { id: "inc-1008", title: "Webhook delivery retries exhausted", severity: "sev3", status: "resolved", engineerId: "eng-6", dateIso: "2026-10-06", timeLabel: "11:47", minutesToAck: 22, service: "webhook-relay" },
  { id: "inc-1009", title: "S3 egress throttling, batch export", severity: "sev3", status: "resolved", engineerId: "eng-5", dateIso: "2026-10-07", timeLabel: "16:02", minutesToAck: 25, service: "export-worker" },
  { id: "inc-1010", title: "Primary→replica failover flapping", severity: "sev1", status: "resolved", engineerId: "eng-1", dateIso: "2026-10-08", timeLabel: "04:52", minutesToAck: 5, service: "postgres-primary" },
  { id: "inc-1011", title: "Build cache corruption, CI queue stall", severity: "sev3", status: "resolved", engineerId: "eng-4", dateIso: "2026-10-09", timeLabel: "10:15", minutesToAck: 19, service: "ci-runner" },
  { id: "inc-1012", title: "Session store memory pressure", severity: "sev2", status: "resolved", engineerId: "eng-2", dateIso: "2026-10-10", timeLabel: "21:44", minutesToAck: 8, service: "redis-session" },
  { id: "inc-1013", title: "Edge POP latency spike (nrt1)", severity: "sev2", status: "resolved", engineerId: "eng-3", dateIso: "2026-10-11", timeLabel: "05:30", minutesToAck: 7, service: "edge-router" },
  { id: "inc-1014", title: "Rate limiter false-positive storm", severity: "sev2", status: "resolved", engineerId: "eng-6", dateIso: "2026-10-12", timeLabel: "13:21", minutesToAck: 12, service: "rate-limiter" },
  { id: "inc-1015", title: "Payment webhook signature mismatch", severity: "sev1", status: "resolved", engineerId: "eng-1", dateIso: "2026-10-12", timeLabel: "23:10", minutesToAck: 3, service: "payments-webhook" },
  { id: "inc-1016", title: "Search index lag > 5m", severity: "sev3", status: "resolved", engineerId: "eng-5", dateIso: "2026-10-13", timeLabel: "08:02", minutesToAck: 30, service: "search-indexer" },
  { id: "inc-1017", title: "Load balancer health-check flap", severity: "sev2", status: "resolved", engineerId: "eng-4", dateIso: "2026-10-14", timeLabel: "02:17", minutesToAck: 10, service: "lb-public" },
  { id: "inc-1018", title: "Token refresh storm, mobile clients", severity: "sev2", status: "resolved", engineerId: "eng-2", dateIso: "2026-10-15", timeLabel: "18:49", minutesToAck: 14, service: "auth-service" },
  { id: "inc-1019", title: "Queue consumer backlog > 50k", severity: "sev1", status: "resolved", engineerId: "eng-1", dateIso: "2026-10-16", timeLabel: "00:05", minutesToAck: 2, service: "ingest-queue" },
  { id: "inc-1020", title: "Cold cache stampede after deploy", severity: "sev3", status: "resolved", engineerId: "eng-6", dateIso: "2026-10-17", timeLabel: "09:40", minutesToAck: 17, service: "edge-cache" },
  { id: "inc-1021", title: "Replica disk nearing capacity", severity: "sev3", status: "resolved", engineerId: "eng-5", dateIso: "2026-10-18", timeLabel: "15:12", minutesToAck: 28, service: "postgres-ro" },
  { id: "inc-1022", title: "Edge POP latency spike (fra1)", severity: "sev2", status: "ack", engineerId: "eng-3", dateIso: "2026-10-19", timeLabel: "04:02", minutesToAck: 6, service: "edge-router" },
  { id: "inc-1023", title: "Checkout 5xx burst", severity: "sev1", status: "resolved", engineerId: "eng-2", dateIso: "2026-10-20", timeLabel: "20:33", minutesToAck: 4, service: "checkout-api" },
  { id: "inc-1024", title: "Autoscaler stuck at min capacity", severity: "sev2", status: "resolved", engineerId: "eng-4", dateIso: "2026-10-21", timeLabel: "06:21", minutesToAck: 9, service: "autoscaler" },
  { id: "inc-1025", title: "Webhook delivery retries exhausted", severity: "sev3", status: "ack", engineerId: "eng-6", dateIso: "2026-10-22", timeLabel: "12:58", minutesToAck: 21, service: "webhook-relay" },
  { id: "inc-1026", title: "DNS resolver timeout, single AZ", severity: "sev2", status: "resolved", engineerId: "eng-3", dateIso: "2026-10-23", timeLabel: "03:44", minutesToAck: 8, service: "coredns" },
  { id: "inc-1027", title: "Session store memory pressure", severity: "sev2", status: "open", engineerId: "eng-1", dateIso: "2026-10-24", timeLabel: "22:15", minutesToAck: 0, service: "redis-session" },
  { id: "inc-1028", title: "Build cache corruption, CI queue stall", severity: "sev3", status: "resolved", engineerId: "eng-4", dateIso: "2026-10-25", timeLabel: "11:09", minutesToAck: 20, service: "ci-runner" },
  { id: "inc-1029", title: "Primary→replica failover flapping", severity: "sev1", status: "open", engineerId: "eng-5", dateIso: "2026-10-26", timeLabel: "05:51", minutesToAck: 0, service: "postgres-primary" },
  { id: "inc-1030", title: "Rate limiter false-positive storm", severity: "sev2", status: "ack", engineerId: "eng-6", dateIso: "2026-10-27", timeLabel: "17:26", minutesToAck: 13, service: "rate-limiter" },
  { id: "inc-1031", title: "Read replica lag > 90s", severity: "sev2", status: "open", engineerId: "eng-2", dateIso: "2026-10-28", timeLabel: "01:33", minutesToAck: 0, service: "postgres-ro" },
];

export type DayCell = {
  dateIso: string;
  dayOfMonth: number;
  weekdayLabel: string;
  onCallEngineerId: string;
  incidentCount: number;
  sev1Count: number;
  coverageLevel: 0 | 1 | 2 | 3; // 0 quiet .. 3 heavy — derived below, never hand-typed
};

const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// 35 fixed days, Sep 28 2026 (Mon) through Nov 1 2026 (Sun) — a real 5-week calendar month grid
// for October 2026. Rotation of on-call engineer is a fixed round-robin, not random.
function buildMonth(): DayCell[] {
  const days: DayCell[] = [];
  const daysInSep = 30;
  for (let i = 0; i < 35; i++) {
    const offset = i - 3; // Sep 28 is 3 days before Oct 1
    let month = 10;
    let dayOfMonth = offset + 1;
    if (dayOfMonth < 1) {
      month = 9;
      dayOfMonth = daysInSep + dayOfMonth;
    } else if (dayOfMonth > 31) {
      month = 11;
      dayOfMonth = dayOfMonth - 31;
    }
    const dateIso = `2026-${String(month).padStart(2, "0")}-${String(dayOfMonth).padStart(2, "0")}`;
    const dayIncidents = INCIDENTS.filter((inc) => inc.dateIso === dateIso);
    const sev1 = dayIncidents.filter((inc) => inc.severity === "sev1").length;
    const count = dayIncidents.length;
    const coverageLevel: 0 | 1 | 2 | 3 = count === 0 ? 0 : count === 1 ? 1 : count === 2 ? 2 : 3;
    days.push({
      dateIso,
      dayOfMonth,
      weekdayLabel: WEEKDAY_LABELS[i % 7],
      onCallEngineerId: ENGINEERS[i % ENGINEERS.length].id,
      incidentCount: count,
      sev1Count: sev1,
      coverageLevel,
    });
  }
  return days;
}

export const MONTH_DAYS = buildMonth();

// Reconciled totals — every number the UI shows for "this month" is summed from MONTH_DAYS /
// INCIDENTS at render time, never a separately hand-typed constant.
export const OCTOBER_DAYS = MONTH_DAYS.filter((d) => d.dateIso.startsWith("2026-10"));
export const OCTOBER_INCIDENTS = INCIDENTS.filter((inc) => inc.dateIso.startsWith("2026-10"));

export function engineerById(id: string): Engineer {
  return ENGINEERS.find((e) => e.id === id) ?? ENGINEERS[0];
}

export const SEPTEMBER_SUMMARY = {
  totalIncidents: 24,
  sev1: 5,
  medianAckMinutes: 9,
};
