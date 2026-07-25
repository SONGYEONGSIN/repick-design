import type { LucideIcon } from "lucide-react";
import {
  AudioWaveform,
  Bell,
  ClipboardList,
  CreditCard,
  Database,
  History,
  KeyRound,
  LayoutGrid,
  Radio,
  Server,
  Settings,
  ShieldCheck,
  Siren,
} from "lucide-react";
import type { EngineerToneId, Tone } from "./tokens";

/* ---------------------------------------------------------------------- */
/* Deterministic math utils — no Math.random / Date.now / new Date use     */
/* ---------------------------------------------------------------------- */

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

/* ---------------------------------------------------------------------- */
/* Brand / workspace / user                                                */
/* ---------------------------------------------------------------------- */

export const BRAND = { name: "Wavelength", tagline: "Incident & On-Call Response Console" };
export { AudioWaveform as BrandIcon };

export type Workspace = { id: string; name: string; plan: string };
export const WORKSPACES: Workspace[] = [
  { id: "core-platform", name: "Core Platform", plan: "Enterprise · 6 responders" },
  { id: "payments-guild", name: "Payments Guild", plan: "Team · 4 responders" },
  { id: "mobile-guild", name: "Mobile Guild", plan: "Internal test" },
];

/** Fictional persona (not the session context) — the incident commander using Wavelength. */
export const CURRENT_USER = {
  name: "Nora Kessler",
  role: "Incident Commander",
  email: "nora.kessler@wavelength-hq.io",
  avatarId: "1580489944761-15a19d654956",
};

export function unsplashAvatar(id: string, size = 96): string {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&crop=faces&w=${size}&h=${size}&q=80`;
}

/* ---------------------------------------------------------------------- */
/* Navigation                                                               */
/* ---------------------------------------------------------------------- */

export type NavItem = { id: string; label: string; Icon: LucideIcon; active?: boolean; disabled?: boolean; badge?: string };
export type NavSection = { id: string; title: string; items: NavItem[] };

export const NAV_SECTIONS: NavSection[] = [
  {
    id: "workspace",
    title: "Workspace",
    items: [
      { id: "overview", label: "Overview", Icon: LayoutGrid },
      { id: "console", label: "On-Call Console", Icon: Radio, active: true },
      { id: "incidents", label: "Incidents", Icon: Siren, badge: "1" },
    ],
  },
  {
    id: "analysis",
    title: "Analysis",
    items: [
      { id: "postmortems", label: "Postmortems", Icon: History },
      { id: "policies", label: "Escalation Policies", Icon: ShieldCheck },
    ],
  },
  {
    id: "admin",
    title: "Admin",
    items: [
      { id: "runbooks", label: "Runbook Library", Icon: ClipboardList, disabled: true },
      { id: "settings", label: "Settings", Icon: Settings },
    ],
  },
];

/* ---------------------------------------------------------------------- */
/* Services                                                                 */
/* ---------------------------------------------------------------------- */

export type ServiceId = "api-gateway" | "billing-worker" | "auth-service" | "notifications-svc" | "data-pipeline";

export type ServiceMeta = { id: ServiceId; label: string; Icon: LucideIcon };

export const SERVICES: ServiceMeta[] = [
  { id: "api-gateway", label: "api-gateway", Icon: Server },
  { id: "billing-worker", label: "billing-worker", Icon: CreditCard },
  { id: "auth-service", label: "auth-service", Icon: KeyRound },
  { id: "notifications-svc", label: "notifications-svc", Icon: Bell },
  { id: "data-pipeline", label: "data-pipeline", Icon: Database },
];

export function serviceLabel(id: ServiceId): string {
  return SERVICES.find((s) => s.id === id)?.label ?? id;
}
export function serviceIcon(id: ServiceId): LucideIcon {
  return SERVICES.find((s) => s.id === id)?.Icon ?? Server;
}

/* ---------------------------------------------------------------------- */
/* Engineers & on-call rotation                                             */
/* ---------------------------------------------------------------------- */

export type EngineerId = "priya" | "sam" | "elena" | "marcus" | "riko" | "jordan";

export type Engineer = {
  id: EngineerId;
  name: string;
  initials: string;
  role: string;
  tone: EngineerToneId;
  avatarId: string;
};

/** Rotation order = array order (both today's 4-hour blocks and the weekly weekday assignment follow this order). */
export const ENGINEERS: Engineer[] = [
  { id: "priya", name: "Priya Nair", initials: "PN", role: "Platform SRE", tone: "indigo", avatarId: "1544005313-94ddf0286df2" },
  { id: "sam", name: "Sam Okafor", initials: "SO", role: "Infra SRE", tone: "amber", avatarId: "1519345182560-3f2917c472ef" },
  { id: "elena", name: "Elena Voss", initials: "EV", role: "Backend SRE", tone: "teal", avatarId: "1502685104226-ee32379fefbe" },
  { id: "marcus", name: "Marcus Lindqvist", initials: "ML", role: "Platform SRE", tone: "violet", avatarId: "1633332755192-727a05c4013d" },
  { id: "riko", name: "Riko Tanaka", initials: "RT", role: "Backend SRE", tone: "rose", avatarId: "1580489944761-15a19d654956" },
  { id: "jordan", name: "Jordan Blake", initials: "JB", role: "Infra SRE", tone: "emerald", avatarId: "1531123897727-8f129e1688ce" },
];

export function engineerById(id: EngineerId): Engineer {
  return ENGINEERS.find((e) => e.id === id)!;
}

/** The engineer next in rotation order (used as the escalation secondary). */
export function secondaryFor(id: EngineerId): Engineer {
  const idx = ENGINEERS.findIndex((e) => e.id === id);
  return ENGINEERS[(idx + 1) % ENGINEERS.length];
}

export const ESCALATION_POLICY = {
  name: "Standard Pager Policy",
  tiers: [
    { tier: 1, label: "Primary on-call", waitMinutes: 0 },
    { tier: 2, label: "Secondary on-call", waitMinutes: 5 },
    { tier: 3, label: "Engineering manager", waitMinutes: 15 },
  ],
};

/** Today's (24h) 4-hour block rotation — exactly 6 blocks x 4h = 24h, matching ENGINEERS order. */
export type ShiftBlock = { startHour: number; endHour: number; engineer: EngineerId };
export const TODAY_SHIFTS: ShiftBlock[] = [
  { startHour: 0, endHour: 4, engineer: "priya" },
  { startHour: 4, endHour: 8, engineer: "sam" },
  { startHour: 8, endHour: 12, engineer: "elena" },
  { startHour: 12, endHour: 16, engineer: "marcus" },
  { startHour: 16, endHour: 20, engineer: "riko" },
  { startHour: 20, endHour: 24, engineer: "jordan" },
];

/** The "now" reference time — a fixed demo anchor point (Wed 14:30) for render determinism, not a live clock. */
export const NOW_HOUR = 14.5;
export const NOW_DAY_INDEX = 2; // 0=Mon .. 6=Sun (Wed)
export const NOW_LABEL = "Wed 14:30";
export const TODAY_DATE_LABEL = "Jul 22";

export function shiftForHour(hour: number): ShiftBlock {
  const h = ((hour % 24) + 24) % 24;
  return TODAY_SHIFTS.find((s) => h >= s.startHour && h < s.endHour) ?? TODAY_SHIFTS[TODAY_SHIFTS.length - 1];
}

/** This week's "day owner" rotation (escalation rollup layer, distinct from the hourly pager rotation). */
export const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
export const WEEK_OWNERS: EngineerId[] = ["priya", "sam", "elena", "marcus", "riko", "jordan", "priya"];

export function ownerForDay(dayIndex: number): EngineerId {
  return WEEK_OWNERS[((dayIndex % 7) + 7) % 7];
}

/* ---------------------------------------------------------------------- */
/* Trend (sparkline) — hand-seeded deterministic values, swapped by period toggle */
/* ---------------------------------------------------------------------- */

/** Triggered incident count for today's 24 ticks (hourly). */
export const TODAY_TREND: number[] = [1, 0, 0, 1, 0, 1, 0, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 0, 1, 0, 1, 0, 0];
/** Triggered incident count for this week's 7 ticks (daily) — Mon..Sun. */
export const WEEK_TREND: number[] = [3, 2, 4, 3, 2, 3, 1];

/* ---------------------------------------------------------------------- */
/* Incidents                                                                */
/* ---------------------------------------------------------------------- */

export type Severity = 1 | 2 | 3 | 4;
export type IncidentStatus = "triggered" | "acknowledged" | "resolved";

export type TimelineStep = {
  key: "triggered" | "acknowledged" | "resolved";
  label: string;
  timeLabel: string | null;
  actor: string | null;
  done: boolean;
};

export type RunbookItem = { id: string; label: string; done: boolean };

export type Incident = {
  id: string;
  orderRank: number; // higher = more recent
  severity: Severity;
  title: string;
  service: ServiceId;
  affectedServices: ServiceId[];
  dateLabel: string; // for whitespace-nowrap display, ex. "Jul 22"
  triggeredHour: number; // 0..24, maps to today's ring highlight
  dayIndex: number; // 0..6 Mon..Sun, maps to the weekly ring highlight
  triggeredClock: string; // ex. "13:15"
  sinceLabel: string; // elapsed label relative to the fixed snapshot (NOW_LABEL) — not a live clock, a deterministic string
  durationLabel: string;
  status: IncidentStatus;
  responder: EngineerId;
  summary: string;
  timeline: TimelineStep[];
  runbook: RunbookItem[];
};

function shiftEngineerName(hour: number): string {
  return engineerById(shiftForHour(hour).engineer).name;
}

export const INCIDENTS: Incident[] = [
  {
    id: "INC-1042",
    orderRank: 10,
    severity: 1,
    title: "api-gateway 5xx surge after canary rollout",
    service: "api-gateway",
    affectedServices: ["api-gateway", "billing-worker"],
    dateLabel: "Jul 22",
    triggeredHour: 13.25,
    dayIndex: 2,
    triggeredClock: "13:15",
    sinceLabel: "1h 15m ago",
    durationLabel: "Ongoing",
    status: "triggered",
    responder: "marcus",
    summary: "5xx rate jumped to 6.1% within two minutes of the v214 canary reaching 25% traffic. Burn-rate alert paged the primary on-call.",
    timeline: [
      { key: "triggered", label: "Triggered", timeLabel: "13:15", actor: "Burn-rate monitor", done: true },
      { key: "acknowledged", label: "Acknowledged", timeLabel: null, actor: null, done: false },
      { key: "resolved", label: "Resolved", timeLabel: null, actor: null, done: false },
    ],
    runbook: [
      { id: "ack", label: "Acknowledge the page within SLA", done: false },
      { id: "dash", label: "Check service health dashboard for correlated alerts", done: false },
      { id: "status", label: "Post to status page if customer-facing", done: false },
      { id: "escalate", label: "Escalate to secondary if unresolved after 15 min", done: false },
      { id: "postmortem", label: "File postmortem draft after resolution", done: false },
    ],
  },
  {
    id: "INC-1041",
    orderRank: 9,
    severity: 2,
    title: "billing-worker retry storm draining queue",
    service: "billing-worker",
    affectedServices: ["billing-worker"],
    dateLabel: "Jul 22",
    triggeredHour: 9.75,
    dayIndex: 2,
    triggeredClock: "09:45",
    sinceLabel: "4h 45m ago",
    durationLabel: "48m so far",
    status: "acknowledged",
    responder: "elena",
    summary: "A poison message in the invoicing queue triggered exponential retries, pushing consumer lag past 12,000 messages.",
    timeline: [
      { key: "triggered", label: "Triggered", timeLabel: "09:45", actor: "Queue lag monitor", done: true },
      { key: "acknowledged", label: "Acknowledged", timeLabel: "09:51", actor: "Elena Voss", done: true },
      { key: "resolved", label: "Resolved", timeLabel: null, actor: null, done: false },
    ],
    runbook: [
      { id: "ack", label: "Acknowledge the page within SLA", done: true },
      { id: "dash", label: "Check service health dashboard for correlated alerts", done: true },
      { id: "status", label: "Post to status page if customer-facing", done: false },
      { id: "escalate", label: "Escalate to secondary if unresolved after 15 min", done: false },
      { id: "postmortem", label: "File postmortem draft after resolution", done: false },
    ],
  },
  {
    id: "INC-1040",
    orderRank: 8,
    severity: 1,
    title: "auth-service token validation latency spike",
    service: "auth-service",
    affectedServices: ["auth-service", "api-gateway"],
    dateLabel: "Jul 21",
    triggeredHour: 21.5,
    dayIndex: 1,
    triggeredClock: "21:30",
    sinceLabel: "17h ago",
    durationLabel: "36m",
    status: "resolved",
    responder: "jordan",
    summary: "p99 token validation latency crossed 900ms after a JWKS cache-warm job overlapped with peak login traffic.",
    timeline: [
      { key: "triggered", label: "Triggered", timeLabel: "21:30", actor: "Latency monitor", done: true },
      { key: "acknowledged", label: "Acknowledged", timeLabel: "21:33", actor: "Jordan Blake", done: true },
      { key: "resolved", label: "Resolved", timeLabel: "22:06", actor: "Jordan Blake", done: true },
    ],
    runbook: [
      { id: "ack", label: "Acknowledge the page within SLA", done: true },
      { id: "dash", label: "Check service health dashboard for correlated alerts", done: true },
      { id: "status", label: "Post to status page if customer-facing", done: true },
      { id: "escalate", label: "Escalate to secondary if unresolved after 15 min", done: true },
      { id: "postmortem", label: "File postmortem draft after resolution", done: false },
    ],
  },
  {
    id: "INC-1039",
    orderRank: 7,
    severity: 3,
    title: "notifications-svc delayed push delivery",
    service: "notifications-svc",
    affectedServices: ["notifications-svc"],
    dateLabel: "Jul 20",
    triggeredHour: 5.25,
    dayIndex: 0,
    triggeredClock: "05:15",
    sinceLabel: "2d 9h ago",
    durationLabel: "22m",
    status: "resolved",
    responder: "sam",
    summary: "Push delivery p95 rose above the 5-minute warn threshold during a provider-side rate-limit window.",
    timeline: [
      { key: "triggered", label: "Triggered", timeLabel: "05:15", actor: "Delivery SLA monitor", done: true },
      { key: "acknowledged", label: "Acknowledged", timeLabel: "05:19", actor: "Sam Okafor", done: true },
      { key: "resolved", label: "Resolved", timeLabel: "05:37", actor: "Sam Okafor", done: true },
    ],
    runbook: [
      { id: "ack", label: "Acknowledge the page within SLA", done: true },
      { id: "dash", label: "Check service health dashboard for correlated alerts", done: true },
      { id: "status", label: "Post to status page if customer-facing", done: true },
      { id: "escalate", label: "Escalate to secondary if unresolved after 15 min", done: true },
      { id: "postmortem", label: "File postmortem draft after resolution", done: true },
    ],
  },
  {
    id: "INC-1038",
    orderRank: 6,
    severity: 2,
    title: "data-pipeline batch job stuck in retry loop",
    service: "data-pipeline",
    affectedServices: ["data-pipeline"],
    dateLabel: "Jul 19",
    triggeredHour: 2.5,
    dayIndex: 6,
    triggeredClock: "02:30",
    sinceLabel: "3d 12h ago",
    durationLabel: "1h 04m",
    status: "resolved",
    responder: "priya",
    summary: "Nightly aggregation job entered a retry loop against a locked partition, delaying the 03:00 reporting export.",
    timeline: [
      { key: "triggered", label: "Triggered", timeLabel: "02:30", actor: "Job scheduler monitor", done: true },
      { key: "acknowledged", label: "Acknowledged", timeLabel: "02:36", actor: "Priya Nair", done: true },
      { key: "resolved", label: "Resolved", timeLabel: "03:34", actor: "Priya Nair", done: true },
    ],
    runbook: [
      { id: "ack", label: "Acknowledge the page within SLA", done: true },
      { id: "dash", label: "Check service health dashboard for correlated alerts", done: true },
      { id: "status", label: "Post to status page if customer-facing", done: true },
      { id: "escalate", label: "Escalate to secondary if unresolved after 15 min", done: true },
      { id: "postmortem", label: "File postmortem draft after resolution", done: true },
    ],
  },
  {
    id: "INC-1037",
    orderRank: 5,
    severity: 4,
    title: "api-gateway elevated 429 rate on partner key",
    service: "api-gateway",
    affectedServices: ["api-gateway"],
    dateLabel: "Jul 18",
    triggeredHour: 17.75,
    dayIndex: 5,
    triggeredClock: "17:45",
    sinceLabel: "4d 21h ago",
    durationLabel: "14m",
    status: "resolved",
    responder: "riko",
    summary: "A single high-volume partner API key exceeded its rate-limit tier during a batch import, throwing 429s for that tenant only.",
    timeline: [
      { key: "triggered", label: "Triggered", timeLabel: "17:45", actor: "Rate-limit monitor", done: true },
      { key: "acknowledged", label: "Acknowledged", timeLabel: "17:49", actor: "Riko Tanaka", done: true },
      { key: "resolved", label: "Resolved", timeLabel: "17:59", actor: "Riko Tanaka", done: true },
    ],
    runbook: [
      { id: "ack", label: "Acknowledge the page within SLA", done: true },
      { id: "dash", label: "Check service health dashboard for correlated alerts", done: true },
      { id: "status", label: "Post to status page if customer-facing", done: true },
      { id: "escalate", label: "Escalate to secondary if unresolved after 15 min", done: true },
      { id: "postmortem", label: "File postmortem draft after resolution", done: true },
    ],
  },
  {
    id: "INC-1036",
    orderRank: 4,
    severity: 3,
    title: "billing-worker checkout webhook lag",
    service: "billing-worker",
    affectedServices: ["billing-worker", "api-gateway"],
    dateLabel: "Jul 17",
    triggeredHour: 11.0,
    dayIndex: 4,
    triggeredClock: "11:00",
    sinceLabel: "6d 4h ago",
    durationLabel: "3h 12m so far",
    status: "acknowledged",
    responder: "elena",
    summary: "Outbound webhook delivery to a payment-processor callback endpoint has been intermittently timing out since late morning.",
    timeline: [
      { key: "triggered", label: "Triggered", timeLabel: "11:00", actor: "Webhook delivery monitor", done: true },
      { key: "acknowledged", label: "Acknowledged", timeLabel: "11:07", actor: "Elena Voss", done: true },
      { key: "resolved", label: "Resolved", timeLabel: null, actor: null, done: false },
    ],
    runbook: [
      { id: "ack", label: "Acknowledge the page within SLA", done: true },
      { id: "dash", label: "Check service health dashboard for correlated alerts", done: true },
      { id: "status", label: "Post to status page if customer-facing", done: true },
      { id: "escalate", label: "Escalate to secondary if unresolved after 15 min", done: false },
      { id: "postmortem", label: "File postmortem draft after resolution", done: false },
    ],
  },
  {
    id: "INC-1035",
    orderRank: 3,
    severity: 2,
    title: "auth-service elevated login failure rate",
    service: "auth-service",
    affectedServices: ["auth-service"],
    dateLabel: "Jul 16",
    triggeredHour: 15.1,
    dayIndex: 3,
    triggeredClock: "15:06",
    sinceLabel: "6d 23h ago",
    durationLabel: "19m",
    status: "resolved",
    responder: "marcus",
    summary: "Login failure rate rose to 3.4% after a downstream identity-provider certificate rotation briefly rejected valid tokens.",
    timeline: [
      { key: "triggered", label: "Triggered", timeLabel: "15:06", actor: "Auth failure monitor", done: true },
      { key: "acknowledged", label: "Acknowledged", timeLabel: "15:10", actor: "Marcus Lindqvist", done: true },
      { key: "resolved", label: "Resolved", timeLabel: "15:25", actor: "Marcus Lindqvist", done: true },
    ],
    runbook: [
      { id: "ack", label: "Acknowledge the page within SLA", done: true },
      { id: "dash", label: "Check service health dashboard for correlated alerts", done: true },
      { id: "status", label: "Post to status page if customer-facing", done: true },
      { id: "escalate", label: "Escalate to secondary if unresolved after 15 min", done: true },
      { id: "postmortem", label: "File postmortem draft after resolution", done: true },
    ],
  },
  {
    id: "INC-1034",
    orderRank: 2,
    severity: 4,
    title: "data-pipeline dashboard export timeout",
    service: "data-pipeline",
    affectedServices: ["data-pipeline"],
    dateLabel: "Jul 15",
    triggeredHour: 23.4,
    dayIndex: 2,
    triggeredClock: "23:24",
    sinceLabel: "7d 15h ago",
    durationLabel: "9m",
    status: "resolved",
    responder: "jordan",
    summary: "A scheduled export to the analytics warehouse timed out once against an oversized weekly cohort table.",
    timeline: [
      { key: "triggered", label: "Triggered", timeLabel: "23:24", actor: "Export job monitor", done: true },
      { key: "acknowledged", label: "Acknowledged", timeLabel: "23:27", actor: "Jordan Blake", done: true },
      { key: "resolved", label: "Resolved", timeLabel: "23:33", actor: "Jordan Blake", done: true },
    ],
    runbook: [
      { id: "ack", label: "Acknowledge the page within SLA", done: true },
      { id: "dash", label: "Check service health dashboard for correlated alerts", done: true },
      { id: "status", label: "Post to status page if customer-facing", done: true },
      { id: "escalate", label: "Escalate to secondary if unresolved after 15 min", done: true },
      { id: "postmortem", label: "File postmortem draft after resolution", done: true },
    ],
  },
  {
    id: "INC-1033",
    orderRank: 1,
    severity: 1,
    title: "billing-worker duplicate charge alert",
    service: "billing-worker",
    affectedServices: ["billing-worker"],
    dateLabel: "Jul 14",
    triggeredHour: 3.6,
    dayIndex: 1,
    triggeredClock: "03:36",
    sinceLabel: "9d 11h ago",
    durationLabel: "27m",
    status: "resolved",
    responder: "priya",
    summary: "Idempotency-key check failed open during a database failover, risking duplicate charges for a small batch of invoices.",
    timeline: [
      { key: "triggered", label: "Triggered", timeLabel: "03:36", actor: "Ledger reconciliation monitor", done: true },
      { key: "acknowledged", label: "Acknowledged", timeLabel: "03:39", actor: "Priya Nair", done: true },
      { key: "resolved", label: "Resolved", timeLabel: "04:03", actor: "Priya Nair", done: true },
    ],
    runbook: [
      { id: "ack", label: "Acknowledge the page within SLA", done: true },
      { id: "dash", label: "Check service health dashboard for correlated alerts", done: true },
      { id: "status", label: "Post to status page if customer-facing", done: true },
      { id: "escalate", label: "Escalate to secondary if unresolved after 15 min", done: true },
      { id: "postmortem", label: "File postmortem draft after resolution", done: true },
    ],
  },
];

export const SEVERITY_META: Record<Severity, { label: string; tone: Tone }> = {
  1: { label: "SEV1", tone: "bad" },
  2: { label: "SEV2", tone: "warn" },
  3: { label: "SEV3", tone: "info" },
  4: { label: "SEV4", tone: "neutral" },
};

export const STATUS_META: Record<IncidentStatus, { label: string; tone: Tone }> = {
  triggered: { label: "Triggered", tone: "bad" },
  acknowledged: { label: "Acknowledged", tone: "warn" },
  resolved: { label: "Resolved", tone: "good" },
};

export const openIncidentCount = INCIDENTS.filter((i) => i.status !== "resolved").length;

/** Verifies that the shift-table-derived responder matches the data (a static-assert-style comment). */
export function verifyResponderConsistency(): boolean {
  return INCIDENTS.every((i) => shiftEngineerName(i.triggeredHour) === engineerById(i.responder).name);
}

/* ---------------------------------------------------------------------- */
/* Intl formatters                                                          */
/* ---------------------------------------------------------------------- */

const NUM0 = new Intl.NumberFormat("en-US");

export function formatCount(v: number): string {
  return NUM0.format(v);
}
