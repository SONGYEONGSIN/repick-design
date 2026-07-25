/**
 * Pulse — customer support SLA operations console dummy data.
 * All deterministic static literals (Math.random/Date.now/new Date() are prohibited).
 * Channel and subtotal figures are hand-verified and hardcoded to reconcile with the
 * top-level totals, while channel-specific derived figures (avg response time,
 * sparklines, etc.) are computed at runtime as pure functions that multiply by
 * CHANNEL_META.factor, so they always stay consistent (see card/util code).
 * "Current queue, escalation, and agent status" are real-time snapshots, so they
 * stay fixed regardless of the period (24h/7d/30d) toggle and are only narrowed
 * by the channel filter.
 */

import type {
  Agent,
  Channel,
  CoverageShift,
  EscalationTicket,
  Period,
  PeriodStat,
  Priority,
  QueueTicket,
} from "./types";

export const PRODUCT_NAME = "Pulse";
export const WORKSPACE_NAME = "Northwind Retail";

export const CHANNELS: Channel[] = ["email", "chat", "phone", "social"];

export const CHANNEL_META: Record<
  Channel,
  { label: string; short: string; factor: number; dotClass: string; textClass: string }
> = {
  email: { label: "Email", short: "Mail", factor: 1.35, dotClass: "bg-indigo-400", textClass: "text-indigo-300" },
  chat: { label: "Chat", short: "Chat", factor: 0.45, dotClass: "bg-emerald-400", textClass: "text-emerald-300" },
  phone: { label: "Phone", short: "Phone", factor: 1.05, dotClass: "bg-amber-400", textClass: "text-amber-300" },
  social: { label: "Social", short: "Social", factor: 1.6, dotClass: "bg-violet-400", textClass: "text-violet-300" },
};

export const PRIORITY_META: Record<
  Priority,
  { label: string; badgeClass: string; dotClass: string; rank: number }
> = {
  urgent: { label: "Urgent", badgeClass: "border-rose-400/30 bg-rose-500/10 text-rose-300", dotClass: "bg-rose-400", rank: 3 },
  high: { label: "High", badgeClass: "border-amber-400/30 bg-amber-500/10 text-amber-300", dotClass: "bg-amber-400", rank: 2 },
  normal: { label: "Normal", badgeClass: "border-sky-400/30 bg-sky-500/10 text-sky-300", dotClass: "bg-sky-400", rank: 1 },
  low: { label: "Low", badgeClass: "border-zinc-400/30 bg-zinc-500/10 text-zinc-400", dotClass: "bg-zinc-500", rank: 0 },
};

export const STATUS_META: Record<
  Agent["status"],
  { label: string; dotClass: string; textClass: string }
> = {
  available: { label: "Available", dotClass: "bg-emerald-400", textClass: "text-emerald-300" },
  busy: { label: "Busy", dotClass: "bg-amber-400", textClass: "text-amber-300" },
  away: { label: "Away", dotClass: "bg-zinc-400", textClass: "text-zinc-400" },
  offline: { label: "Offline", dotClass: "bg-zinc-600", textClass: "text-zinc-400" },
};

export const PERIODS: Period[] = ["24h", "7d", "30d"];

/* ── Period aggregates (hero + trend) ─────────────────────────────── */

export const PERIOD_STATS: Record<Period, PeriodStat> = {
  "24h": {
    label: "Last 24 hours",
    shortLabel: "24h",
    totalHandled: 428,
    channelHandled: { email: 152, chat: 186, phone: 61, social: 29 },
    avgResponseSeconds: 252,
    resolutionRatePct: 91,
    sparkline: [312, 298, 276, 245, 238, 260, 271, 252],
    sparklineLabels: ["00:00", "03:00", "06:00", "09:00", "12:00", "15:00", "18:00", "21:00"],
    slaByPriority: [
      { priority: "urgent", within: 38, atRisk: 4, breached: 2 },
      { priority: "high", within: 130, atRisk: 10, breached: 4 },
      { priority: "normal", within: 172, atRisk: 14, breached: 6 },
      { priority: "low", within: 44, atRisk: 3, breached: 1 },
    ],
    automationDeflectionPct: 34,
    automationSparkline: [29, 31, 30, 33, 32, 35, 33, 34],
    csatScore: 4.6,
    csatSparkline: [4.5, 4.5, 4.6, 4.4, 4.6, 4.7, 4.6, 4.6],
  },
  "7d": {
    label: "Last 7 days",
    shortLabel: "7d",
    totalHandled: 2878,
    channelHandled: { email: 1024, chat: 1247, phone: 402, social: 205 },
    avgResponseSeconds: 267,
    resolutionRatePct: 89,
    sparkline: [289, 276, 270, 281, 258, 247, 267],
    sparklineLabels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    slaByPriority: [
      { priority: "urgent", within: 255, atRisk: 22, breached: 11 },
      { priority: "high", within: 880, atRisk: 64, breached: 24 },
      { priority: "normal", within: 1150, atRisk: 92, breached: 38 },
      { priority: "low", within: 320, atRisk: 18, breached: 4 },
    ],
    automationDeflectionPct: 31,
    automationSparkline: [27, 28, 30, 29, 31, 32, 31],
    csatScore: 4.5,
    csatSparkline: [4.4, 4.5, 4.5, 4.3, 4.5, 4.6, 4.5],
  },
  "30d": {
    label: "Last 30 days",
    shortLabel: "30d",
    totalHandled: 11830,
    channelHandled: { email: 4180, chat: 5120, phone: 1640, social: 890 },
    avgResponseSeconds: 274,
    resolutionRatePct: 87,
    sparkline: [301, 295, 288, 279, 270, 265, 258, 268, 271, 274],
    sparklineLabels: ["Week 1", "", "Week 2", "", "Week 3", "", "Week 4", "", "", "Now"],
    slaByPriority: [
      { priority: "urgent", within: 1050, atRisk: 88, breached: 42 },
      { priority: "high", within: 3620, atRisk: 260, breached: 100 },
      { priority: "normal", within: 4720, atRisk: 380, breached: 150 },
      { priority: "low", within: 1340, atRisk: 70, breached: 10 },
    ],
    automationDeflectionPct: 29,
    automationSparkline: [24, 25, 26, 27, 28, 27, 28, 29, 28, 29],
    csatScore: 4.4,
    csatSparkline: [4.3, 4.3, 4.4, 4.3, 4.4, 4.5, 4.4, 4.4, 4.5, 4.4],
  },
};

/** Channel-specific derived values — pure functions that multiply by factor (computed at runtime, never hardcoded). */
export function channelAvgResponseSeconds(period: Period, channel: Channel): number {
  return Math.round(PERIOD_STATS[period].avgResponseSeconds * CHANNEL_META[channel].factor);
}

export function channelSparkline(period: Period, channel: Channel): number[] {
  const factor = CHANNEL_META[channel].factor;
  return PERIOD_STATS[period].sparkline.map((v) => Math.round(v * factor));
}

/* ── Real-time snapshot: queue ────────────────────────────────────── */

export const QUEUE_TICKETS: QueueTicket[] = [
  { id: "TCK-4821", subject: "Payment failed — card issuer declined", channel: "email", waitMinutes: 142, priority: "high", requester: "Hayoon Lee" },
  { id: "TCK-4822", subject: "Live chat connection keeps dropping", channel: "chat", waitMinutes: 6, priority: "urgent", requester: "Woosung Jung" },
  { id: "TCK-4823", subject: "API key reissue request", channel: "email", waitMinutes: 58, priority: "normal", requester: "Nayoon Kim" },
  { id: "TCK-4824", subject: "Login loop after SSO integration", channel: "chat", waitMinutes: 14, priority: "urgent", requester: "Seojun Park" },
  { id: "TCK-4825", subject: "Invoice PDF download error", channel: "email", waitMinutes: 203, priority: "low", requester: "Yuna Choi" },
  { id: "TCK-4826", subject: "Refund processing delay inquiry", channel: "phone", waitMinutes: 22, priority: "high", requester: "Jiwon Han" },
  { id: "TCK-4827", subject: "Webhook redelivery keeps failing", channel: "chat", waitMinutes: 9, priority: "normal", requester: "Sehoon Oh" },
  { id: "TCK-4828", subject: "Bulk CSV import interrupted", channel: "email", waitMinutes: 167, priority: "normal", requester: "Miran Jang" },
  { id: "TCK-4829", subject: "Social account verification error", channel: "social", waitMinutes: 41, priority: "low", requester: "Dohyun Yoon" },
  { id: "TCK-4830", subject: "Custom domain SSL expiring soon", channel: "phone", waitMinutes: 33, priority: "high", requester: "Jihye Seo" },
];

export const ESCALATION_TICKETS: EscalationTicket[] = [
  { id: "ESC-118", subject: "Payment gateway outage spreading", channel: "phone", reason: "3 cascading incidents, churn risk", assigneeId: "a1", ageMinutes: 74, priority: "urgent" },
  { id: "ESC-119", subject: "Enterprise customer SLA breach imminent", channel: "email", reason: "Response wait exceeded 3 hours", assigneeId: "a5", ageMinutes: 188, priority: "urgent" },
  { id: "ESC-120", subject: "Responding to viral negative review on social", channel: "social", reason: "Public complaint from a fast-growing account", assigneeId: "a6", ageMinutes: 52, priority: "high" },
  { id: "ESC-121", subject: "Refund policy exception approval needed", channel: "chat", reason: "Awaiting manager approval", assigneeId: "a3", ageMinutes: 31, priority: "high" },
  { id: "ESC-122", subject: "Suspected customer data loss report", channel: "email", reason: "Backup recovery verification needed", assigneeId: "a1", ageMinutes: 96, priority: "urgent" },
  { id: "ESC-123", subject: "Contract termination threat — VIP customer", channel: "phone", reason: "Escalated to renewal manager", assigneeId: "a4", ageMinutes: 15, priority: "high" },
];

export const AGENTS: Agent[] = [
  { id: "a1", name: "Doyoon Kim", team: "CS Team 1", primaryChannel: "email", activeTickets: 7, capacity: 10, status: "busy", csat: 4.6 },
  { id: "a2", name: "Seojun Lee", team: "CS Team 1", primaryChannel: "chat", activeTickets: 12, capacity: 12, status: "busy", csat: 4.4 },
  { id: "a3", name: "Haeun Park", team: "CS Team 2", primaryChannel: "chat", activeTickets: 5, capacity: 12, status: "available", csat: 4.8 },
  { id: "a4", name: "Minjun Choi", team: "CS Team 2", primaryChannel: "phone", activeTickets: 4, capacity: 8, status: "available", csat: 4.5 },
  { id: "a5", name: "Jiho Jung", team: "CS Team 1", primaryChannel: "email", activeTickets: 9, capacity: 10, status: "busy", csat: 4.3 },
  { id: "a6", name: "Sooah Kang", team: "Social Response Team", primaryChannel: "social", activeTickets: 3, capacity: 8, status: "available", csat: 4.7 },
  { id: "a7", name: "Taeyang Yoon", team: "CS Team 2", primaryChannel: "phone", activeTickets: 8, capacity: 8, status: "busy", csat: 4.2 },
  { id: "a8", name: "Seyoung Oh", team: "CS Team 1", primaryChannel: "chat", activeTickets: 2, capacity: 12, status: "away", csat: 4.6 },
  { id: "a9", name: "Jimin Han", team: "Social Response Team", primaryChannel: "social", activeTickets: 6, capacity: 8, status: "available", csat: 4.5 },
  { id: "a10", name: "Yujin Bae", team: "CS Team 2", primaryChannel: "email", activeTickets: 0, capacity: 10, status: "offline", csat: 4.4 },
];

const agentMap = new Map(AGENTS.map((a) => [a.id, a]));
export function getAgent(id: string): Agent {
  const agent = agentMap.get(id);
  if (!agent) throw new Error(`unknown agent: ${id}`);
  return agent;
}

export const COVERAGE: CoverageShift[] = [
  { shift: "Morning", hours: "09:00–15:00", agents: 6, utilizationPct: 72 },
  { shift: "Afternoon", hours: "15:00–21:00", agents: 7, utilizationPct: 88 },
  { shift: "Night", hours: "21:00–09:00", agents: 3, utilizationPct: 54 },
];

export const CHANNEL_FILTERS: { value: "all" | Channel; label: string }[] = [
  { value: "all", label: "All" },
  { value: "email", label: "Email" },
  { value: "chat", label: "Chat" },
  { value: "phone", label: "Phone" },
  { value: "social", label: "Social" },
];
