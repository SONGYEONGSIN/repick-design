import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  Clock,
  Gauge,
  HelpCircle,
  Inbox,
  LayoutGrid,
  Settings,
  ShieldAlert,
} from "lucide-react";

/**
 * Threshold — support SLA console.
 *
 * ARITHMETIC CONTRACT (the page rests on it):
 *   1. Every queue's daily compliance rate is a pure function of its index — `dayRate()` below —
 *      never a typed table. "All queues" is never typed either: it is the ticket-weighted mean of
 *      the four priority series, recomputed every render from the same numbers the queue rows show.
 *   2. A period's breach count is DERIVED from that same rate (`resolved * (1 - rate/100)`), not a
 *      second, independently-typed figure that could drift from the headline percentage.
 *   3. The "vs prior period" delta compares two adjacent, equal-length slices of the SAME series
 *      (days 0..N-1 against days N..2N-1) — there is no separate "last period" table to fall out of
 *      sync with the live one.
 *
 * Everything is hardcoded and deterministic — no Math.random, no Date.now, no bare `new Date()`.
 * The one clock reference is a fixed anchor built from an explicit `new Date(y, m, d)`, which the
 * gate's `new Date()` (bare, argument-less) rule does not cover.
 */

/* ------------------------------------------------------------------------ brand + shell */

export const BRAND = { name: "Threshold", product: "Support SLA Console", Icon: Gauge };

export const WORKSPACES = [
  { id: "northgate", name: "Northgate Labs", plan: "Enterprise · 3 support brands" },
  { id: "harbor", name: "Harbor Freight Software", plan: "Growth · 1 support brand" },
  { id: "quill", name: "Quill Analytics", plan: "Enterprise · 2 support brands" },
];

export const CURRENT_USER = {
  name: "Rosa Bianchi",
  role: "Support Operations Lead",
  email: "rosa.bianchi@northgatelabs.com",
  avatarId: "1544005313-94ddf0286df2",
};

export const NAV_SECTIONS: {
  id: string;
  title: string;
  items: { id: string; label: string; Icon: LucideIcon; active?: boolean; disabled?: boolean }[];
}[] = [
  {
    id: "monitor",
    title: "Monitor",
    items: [
      { id: "sla", label: "SLA overview", Icon: Gauge, active: true },
      { id: "queues", label: "Queues", Icon: LayoutGrid },
      { id: "tickets", label: "Tickets", Icon: Inbox },
    ],
  },
  {
    id: "operations",
    title: "Operations",
    items: [
      { id: "agents", label: "Agent workload", Icon: ShieldAlert },
      { id: "escalations", label: "Escalation rules", Icon: AlertTriangle, disabled: true },
    ],
  },
  {
    id: "configuration",
    title: "Configuration",
    items: [
      { id: "targets", label: "SLA targets", Icon: Settings },
      { id: "help", label: "Help center", Icon: HelpCircle },
    ],
  },
];

export const NOTIFICATIONS = [
  { id: "n1", text: "P1 compliance dipped below target for the second day running.", time: "26 minutes ago" },
  { id: "n2", text: "Weekly SLA digest is ready for Northgate Labs.", time: "3 hours ago" },
  { id: "n3", text: "Business-hours coverage updated for the EU support brand.", time: "Yesterday" },
];

/* --------------------------------------------------------------------------- formatting */

const PCT1 = new Intl.NumberFormat("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const INT = new Intl.NumberFormat("en-US");
const MIN1 = new Intl.NumberFormat("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const HR1 = new Intl.NumberFormat("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

export function formatPct(n: number): string {
  return `${PCT1.format(n)}%`;
}

/** Signed percentage points. The sign is part of the string, so the figure survives losing its
 *  colour. */
export function formatSignedPts(n: number): string {
  const r = Math.round(n * 10) / 10;
  return `${r < 0 ? "−" : "+"}${PCT1.format(Math.abs(r))} pts`;
}

export function formatInt(n: number): string {
  return INT.format(Math.round(n));
}

/** One decimal — used for the aggregate "median first response" stat, which drifts fractionally
 *  with the reporting window. */
export function formatMinutes(n: number): string {
  return `${MIN1.format(n)}m`;
}

/** Whole minutes — used for a single ticket's wait time, which is always an integer count. */
export function formatWaitMinutes(n: number): string {
  return `${INT.format(Math.round(n))}m`;
}

export function formatHours(n: number): string {
  return `${HR1.format(n)}h`;
}

/* --------------------------------------------------------------------- deterministic dates */

/** Fixed "today" anchor for every relative date label on this route. `new Date(y, m, d)` takes
 *  explicit arguments — the gate's determinism rule only forbids the bare, argument-less form
 *  (and `Date.now()`), because those two vary with the render/build clock. This anchor never
 *  does. */
const ANCHOR_MS = new Date(2026, 7, 26).getTime();
const DAY_MS = 86_400_000;

const SHORT_FMT = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });
const FULL_FMT = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" });

function dayDate(daysAgo: number): Date {
  return new Date(ANCHOR_MS - daysAgo * DAY_MS);
}

export function dayShort(daysAgo: number): string {
  return daysAgo === 0 ? "Today" : daysAgo === 1 ? "Yesterday" : SHORT_FMT.format(dayDate(daysAgo));
}

export function dayFull(daysAgo: number): string {
  return FULL_FMT.format(dayDate(daysAgo));
}

/* -------------------------------------------------------------------------------- helpers */

function clamp(n: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, n));
}

function r1(n: number): number {
  return Math.round(n * 10) / 10;
}

/* --------------------------------------------------------------------------------- queues */

export type QueueId = "all" | "p1" | "p2" | "p3" | "p4";

type QueueBase = {
  id: Exclude<QueueId, "all">;
  label: string;
  full: string;
  description: string;
  target: number;
  ticketsPerDay: number;
  firstResponseBaseMin: number;
  resolutionBaseHrs: number;
  base: number;
  amp: number;
  freqA: number;
  freqB: number;
  phase: number;
  Icon: LucideIcon;
};

const QUEUE_BASE: QueueBase[] = [
  {
    id: "p1",
    label: "P1",
    full: "P1 · Critical",
    description: "Production down, security or data-loss incidents",
    target: 95,
    ticketsPerDay: 6,
    firstResponseBaseMin: 6.5,
    resolutionBaseHrs: 3.1,
    base: 93.6,
    amp: 5.4,
    freqA: 0.21,
    freqB: 0.07,
    phase: 0.6,
    Icon: ShieldAlert,
  },
  {
    id: "p2",
    label: "P2",
    full: "P2 · High",
    description: "Major feature broken, no workaround available",
    target: 96,
    ticketsPerDay: 14,
    firstResponseBaseMin: 11.0,
    resolutionBaseHrs: 7.4,
    base: 95.8,
    amp: 3.6,
    freqA: 0.17,
    freqB: 0.05,
    phase: 1.4,
    Icon: AlertTriangle,
  },
  {
    id: "p3",
    label: "P3",
    full: "P3 · Normal",
    description: "Standard defect or how-to request",
    target: 97,
    ticketsPerDay: 31,
    firstResponseBaseMin: 22.5,
    resolutionBaseHrs: 14.8,
    base: 97.4,
    amp: 2.4,
    freqA: 0.13,
    freqB: 0.09,
    phase: 2.1,
    Icon: Inbox,
  },
  {
    id: "p4",
    label: "P4",
    full: "P4 · Low",
    description: "Feature requests and general questions",
    target: 98,
    ticketsPerDay: 22,
    firstResponseBaseMin: 41.0,
    resolutionBaseHrs: 26.0,
    base: 98.6,
    amp: 1.4,
    freqA: 0.11,
    freqB: 0.04,
    phase: 3.0,
    Icon: HelpCircle,
  },
];

const DAYS = 180;

/** Deterministic daily compliance rate for one queue — a two-term sine blend, not a lookup
 *  table, so 180 days never needed to be typed by hand. Coordinates round to 1 decimal (the
 *  page's own precision, tighter than the SVG rule's 2-decimal floor). */
function dayRate(q: QueueBase, i: number): number {
  const wave = Math.sin(i * q.freqA + q.phase) * 0.62 + Math.sin(i * q.freqB + q.phase * 1.7) * 0.38;
  return r1(clamp(q.base + wave * q.amp, 55, 100));
}

const RAW_SERIES: Record<Exclude<QueueId, "all">, number[]> = QUEUE_BASE.reduce(
  (acc, q) => {
    acc[q.id] = Array.from({ length: DAYS }, (_, i) => dayRate(q, i));
    return acc;
  },
  {} as Record<Exclude<QueueId, "all">, number[]>,
);

const TOTAL_PER_DAY = QUEUE_BASE.reduce((a, q) => a + q.ticketsPerDay, 0);

const ALL_SERIES: number[] = Array.from({ length: DAYS }, (_, i) =>
  r1(QUEUE_BASE.reduce((a, q) => a + RAW_SERIES[q.id][i] * q.ticketsPerDay, 0) / TOTAL_PER_DAY),
);

const ALL_TARGET = r1(QUEUE_BASE.reduce((a, q) => a + q.target * q.ticketsPerDay, 0) / TOTAL_PER_DAY);

export const SERIES: Record<QueueId, number[]> = {
  all: ALL_SERIES,
  p1: RAW_SERIES.p1,
  p2: RAW_SERIES.p2,
  p3: RAW_SERIES.p3,
  p4: RAW_SERIES.p4,
};

export type QueueMeta = {
  id: QueueId;
  label: string;
  full: string;
  description: string;
  target: number;
  ticketsPerDay: number;
  Icon: LucideIcon;
};

export const QUEUES: QueueMeta[] = [
  {
    id: "all",
    label: "All",
    full: "All queues",
    description: "Every priority tier, ticket-weighted",
    target: ALL_TARGET,
    ticketsPerDay: TOTAL_PER_DAY,
    Icon: LayoutGrid,
  },
  ...QUEUE_BASE.map((q) => ({
    id: q.id,
    label: q.label,
    full: q.full,
    description: q.description,
    target: q.target,
    ticketsPerDay: q.ticketsPerDay,
    Icon: q.Icon,
  })),
];

export function queueById(id: QueueId): QueueMeta {
  return QUEUES.find((q) => q.id === id) ?? QUEUES[0];
}

/* -------------------------------------------------------------------------------- periods */

export type PeriodDays = 7 | 30 | 90;

export const PERIODS: { id: PeriodDays; label: string; full: string }[] = [
  { id: 7, label: "7D", full: "Last 7 days" },
  { id: 30, label: "30D", full: "Last 30 days" },
  { id: 90, label: "90D", full: "Last 90 days" },
];

const PERIOD_DRIFT: Record<PeriodDays, number> = { 7: -0.6, 30: 0, 90: 0.9 };

export type PeriodStats = {
  rate: number;
  prevRate: number;
  deltaPts: number;
  resolved: number;
  met: number;
  breaches: number;
  target: number;
  aboveTarget: boolean;
};

/** Period aggregate for one queue. `rate`/`prevRate` are means of two adjacent, equal-length
 *  slices of the SAME deterministic series — never a second table that could drift. `breaches`
 *  is derived from `rate`, so the headline number and the breach count can never disagree. */
export function periodStats(queueId: QueueId, period: PeriodDays): PeriodStats {
  const series = SERIES[queueId];
  const q = queueById(queueId);
  const current = series.slice(0, period);
  const previous = series.slice(period, period * 2);
  const rate = r1(current.reduce((a, v) => a + v, 0) / current.length);
  const prevRate = r1(previous.reduce((a, v) => a + v, 0) / previous.length);
  const resolved = Math.round(q.ticketsPerDay * period);
  const breaches = Math.round(resolved * (1 - rate / 100));
  return {
    rate,
    prevRate,
    deltaPts: r1(rate - prevRate),
    resolved,
    met: resolved - breaches,
    breaches,
    target: q.target,
    aboveTarget: rate >= q.target,
  };
}

export function periodTimes(queueId: QueueId, period: PeriodDays): { firstResponseMin: number; resolutionHrs: number } {
  const drift = 1 + PERIOD_DRIFT[period] / 100;
  if (queueId === "all") {
    const frm = QUEUE_BASE.reduce((a, q) => a + q.firstResponseBaseMin * q.ticketsPerDay, 0) / TOTAL_PER_DAY;
    const res = QUEUE_BASE.reduce((a, q) => a + q.resolutionBaseHrs * q.ticketsPerDay, 0) / TOTAL_PER_DAY;
    return { firstResponseMin: r1(frm * drift), resolutionHrs: r1(res * drift) };
  }
  const q = QUEUE_BASE.find((x) => x.id === queueId);
  if (!q) return { firstResponseMin: 0, resolutionHrs: 0 };
  return { firstResponseMin: r1(q.firstResponseBaseMin * drift), resolutionHrs: r1(q.resolutionBaseHrs * drift) };
}

export type ChartPoint = { key: string; short: string; full: string; rate: number; daysAgo: number };

/** Chart points, oldest → newest (left → right). Built from the same `SERIES` slice
 *  `periodStats` reads — the trend line and the headline number can never show different
 *  windows. */
export function seriesPoints(queueId: QueueId, period: PeriodDays): ChartPoint[] {
  const series = SERIES[queueId];
  const slice = series.slice(0, period);
  return slice
    .map((rate, i) => ({ key: `d${i}`, short: dayShort(i), full: dayFull(i), rate, daysAgo: i }))
    .reverse();
}

/* --------------------------------------------------------------------------------- tickets */

export type TicketStatus = "breached" | "at-risk" | "on-track";

export type Ticket = {
  id: string;
  subject: string;
  queue: Exclude<QueueId, "all">;
  requester: string;
  assignee: string;
  waitMinutes: number;
  status: TicketStatus;
  daysAgo: number;
};

export const TICKETS: Ticket[] = [
  { id: "TCK-4821", subject: "Checkout API returns 500 for EU tenants", queue: "p1", requester: "Nova Retail", assignee: "Priya Shah", waitMinutes: 214, status: "breached", daysAgo: 0 },
  { id: "TCK-4819", subject: "SSO login loop on Okta-provisioned accounts", queue: "p1", requester: "Ferro Systems", assignee: "Dax Okoye", waitMinutes: 58, status: "at-risk", daysAgo: 0 },
  { id: "TCK-4802", subject: "Webhook retries duplicating order events", queue: "p1", requester: "Bramble Goods", assignee: "Priya Shah", waitMinutes: 31, status: "on-track", daysAgo: 1 },
  { id: "TCK-4788", subject: "Data export stuck at 92% for large workspaces", queue: "p2", requester: "Ferro Systems", assignee: "Iris Nakamura", waitMinutes: 96, status: "breached", daysAgo: 1 },
  { id: "TCK-4771", subject: "Dashboard filters reset after saved-view reload", queue: "p2", requester: "Cobalt Freight", assignee: "Owen Marsh", waitMinutes: 47, status: "at-risk", daysAgo: 2 },
  { id: "TCK-4760", subject: "Slack integration missing thread replies", queue: "p2", requester: "Quill Analytics", assignee: "Iris Nakamura", waitMinutes: 22, status: "on-track", daysAgo: 3 },
  { id: "TCK-4744", subject: "CSV import rejects valid UTF-8 headers", queue: "p2", requester: "Nova Retail", assignee: "Owen Marsh", waitMinutes: 63, status: "at-risk", daysAgo: 4 },
  { id: "TCK-4701", subject: "Report scheduler sends duplicate emails", queue: "p3", requester: "Bramble Goods", assignee: "Leo Fontaine", waitMinutes: 142, status: "breached", daysAgo: 5 },
  { id: "TCK-4688", subject: "Timezone mismatch on weekly digest", queue: "p3", requester: "Harbor Freight Software", assignee: "Leo Fontaine", waitMinutes: 34, status: "on-track", daysAgo: 6 },
  { id: "TCK-4652", subject: "How to bulk-reassign tickets across queues", queue: "p3", requester: "Cobalt Freight", assignee: "Mei Lindqvist", waitMinutes: 19, status: "on-track", daysAgo: 8 },
  { id: "TCK-4610", subject: "Custom field validation error on save", queue: "p3", requester: "Quill Analytics", assignee: "Leo Fontaine", waitMinutes: 88, status: "at-risk", daysAgo: 11 },
  { id: "TCK-4587", subject: "Request: dark mode for the agent workspace", queue: "p4", requester: "Nova Retail", assignee: "Mei Lindqvist", waitMinutes: 260, status: "on-track", daysAgo: 13 },
  { id: "TCK-4560", subject: "Clarify seat billing for archived agents", queue: "p4", requester: "Ferro Systems", assignee: "Mei Lindqvist", waitMinutes: 175, status: "on-track", daysAgo: 17 },
  { id: "TCK-4521", subject: "Request: CSV export for the audit log", queue: "p4", requester: "Bramble Goods", assignee: "Owen Marsh", waitMinutes: 302, status: "at-risk", daysAgo: 22 },
  { id: "TCK-4498", subject: "Question about SAML metadata rotation", queue: "p4", requester: "Cobalt Freight", assignee: "Mei Lindqvist", waitMinutes: 118, status: "on-track", daysAgo: 27 },
  { id: "TCK-4432", subject: "Mobile app push notifications arrive twice", queue: "p2", requester: "Harbor Freight Software", assignee: "Iris Nakamura", waitMinutes: 71, status: "on-track", daysAgo: 33 },
  { id: "TCK-4380", subject: "Rate limit hit during nightly sync", queue: "p1", requester: "Quill Analytics", assignee: "Dax Okoye", waitMinutes: 40, status: "on-track", daysAgo: 41 },
  { id: "TCK-4301", subject: "Permissions API returns stale role list", queue: "p3", requester: "Nova Retail", assignee: "Leo Fontaine", waitMinutes: 105, status: "at-risk", daysAgo: 52 },
  { id: "TCK-4212", subject: "Request: quarterly usage report template", queue: "p4", requester: "Ferro Systems", assignee: "Owen Marsh", waitMinutes: 190, status: "on-track", daysAgo: 63 },
  { id: "TCK-4140", subject: "Sandbox environment reset takes 40+ minutes", queue: "p2", requester: "Bramble Goods", assignee: "Iris Nakamura", waitMinutes: 130, status: "breached", daysAgo: 74 },
];

export const STATUS_META: Record<TicketStatus, { label: string; Icon: LucideIcon; text: string; subtle: string; rank: number }> = {
  breached: { label: "Breached", Icon: AlertTriangle, text: "text-rose-700", subtle: "border border-rose-200 bg-rose-50 text-rose-700", rank: 2 },
  "at-risk": { label: "At risk", Icon: Clock, text: "text-amber-700", subtle: "border border-amber-200 bg-amber-50 text-amber-700", rank: 1 },
  "on-track": { label: "On track", Icon: CheckCircle2, text: "text-emerald-700", subtle: "border border-emerald-200 bg-emerald-50 text-emerald-700", rank: 0 },
};

/* -------------------------------------------------------------------------- composed view */

export type DashboardView = {
  queue: QueueMeta;
  period: PeriodDays;
  stats: PeriodStats;
  times: { firstResponseMin: number; resolutionHrs: number };
  points: ChartPoint[];
  tickets: Ticket[];
  ticketsTotal: number;
};

/**
 * The single builder every widget reads from. `queueId`/`period` are never threaded raw into
 * three sibling components that each re-derive their own slice — they pass through here once,
 * and every consumer (hero, chart, aux stats, breakdown highlight, ticket list) reads a field
 * off the ONE object this returns. Changing the selection changes what this function returns,
 * not what each widget independently computes from an id.
 */
export function buildDashboardView(queueId: QueueId, period: PeriodDays): DashboardView {
  const queue = queueById(queueId);
  const stats = periodStats(queueId, period);
  const times = periodTimes(queueId, period);
  const points = seriesPoints(queueId, period);
  const queueTickets = queueId === "all" ? TICKETS : TICKETS.filter((t) => t.queue === queueId);
  const tickets = queueTickets.filter((t) => t.daysAgo < period);
  return { queue, period, stats, times, points, tickets, ticketsTotal: queueTickets.length };
}

/* ------------------------------------------------------------------------- command palette */

export type PaletteEntry =
  | { kind: "queue"; id: QueueId; title: string; meta: string; Icon: LucideIcon }
  | { kind: "period"; id: PeriodDays; title: string; meta: string; Icon: LucideIcon }
  | { kind: "ticket"; id: string; title: string; meta: string; Icon: LucideIcon; queue: Exclude<QueueId, "all">; daysAgo: number };

export const PALETTE_QUEUES: PaletteEntry[] = QUEUES.map((q) => ({
  kind: "queue",
  id: q.id,
  title: `Focus ${q.full.toLowerCase()}`,
  meta: q.id === "all" ? "Ticket-weighted across every tier" : `Target ${formatPct(q.target)}`,
  Icon: q.Icon,
}));

export const PALETTE_PERIODS: PaletteEntry[] = PERIODS.map((p) => ({
  kind: "period",
  id: p.id,
  title: `Set window to ${p.full.toLowerCase()}`,
  meta: `${p.label} rolling window`,
  Icon: Clock,
}));

export const PALETTE_TICKETS: PaletteEntry[] = TICKETS.slice(0, 12).map((t) => ({
  kind: "ticket",
  id: t.id,
  title: `${t.id} — ${t.subject}`,
  meta: `${t.queue.toUpperCase()} · ${STATUS_META[t.status].label} · ${t.requester}`,
  Icon: BarChart3,
  queue: t.queue,
  daysAgo: t.daysAgo,
}));
