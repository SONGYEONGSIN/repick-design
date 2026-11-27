// Deterministic demo data for the Ridgehaul ops console. Nothing here calls Math.random,
// Date.now, or `new Date()` with no arguments — every timestamp is a fixed ISO literal so the
// page renders identically on every request and every hydration pass.

export type TeamName = "Network Ops" | "App Platform" | "Billing" | "Security" | "Field Ops";

export const TEAMS: TeamName[] = ["Network Ops", "App Platform", "Billing", "Security", "Field Ops"];

export type Period = "7d" | "30d";

// Per-ticket resolution time in hours, grouped by team. This is the single underlying record
// set: the box plot's five-number summary AND the "Team focus" drill-down card both read from
// these exact arrays through the same `fiveNumberSummary()` function below, so a pinned team's
// card can never show a number that disagrees with what the chart drew for it.
export const RESOLVED_HOURS: Record<Period, Record<TeamName, number[]>> = {
  "7d": {
    "Network Ops": [1.2, 2.4, 2.9, 3.6, 4.1, 5.3, 6.8, 9.4],
    "App Platform": [2.1, 3.0, 3.8, 4.4, 4.9, 5.6, 7.2, 10.1],
    Billing: [0.8, 1.5, 2.0, 2.6, 3.1, 3.9, 5.0, 7.6],
    Security: [3.5, 5.2, 6.1, 7.4, 8.0, 9.6, 11.3, 14.8],
    "Field Ops": [1.9, 2.7, 3.4, 4.2, 5.0, 6.3, 8.1, 11.5],
  },
  "30d": {
    "Network Ops": [1.0, 1.4, 2.1, 2.8, 3.3, 3.9, 4.5, 5.2, 6.0, 7.1, 8.4, 10.2],
    "App Platform": [1.8, 2.5, 3.2, 3.9, 4.4, 4.9, 5.5, 6.3, 7.0, 8.2, 9.6, 12.0],
    Billing: [0.6, 1.0, 1.4, 1.9, 2.3, 2.8, 3.4, 4.0, 4.8, 5.9, 7.2, 9.0],
    Security: [2.9, 4.0, 5.1, 6.0, 6.8, 7.6, 8.4, 9.3, 10.4, 11.8, 13.5, 16.2],
    "Field Ops": [1.5, 2.2, 2.9, 3.6, 4.3, 5.0, 5.8, 6.7, 7.8, 9.1, 10.6, 13.0],
  },
};

const SLA_TARGET_HOURS = 8;

/** Linear-interpolation quantile (the common "type 7" method). `sorted` must already be sorted. */
function quantile(sorted: number[], q: number): number {
  if (sorted.length === 1) return sorted[0];
  const pos = (sorted.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;
  const next = sorted[base + 1];
  if (next === undefined) return sorted[base];
  return sorted[base] + rest * (next - sorted[base]);
}

export interface FiveNumberSummary {
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
  count: number;
}

export function fiveNumberSummary(values: number[]): FiveNumberSummary {
  const sorted = [...values].sort((a, b) => a - b);
  return {
    min: sorted[0],
    q1: quantile(sorted, 0.25),
    median: quantile(sorted, 0.5),
    q3: quantile(sorted, 0.75),
    max: sorted[sorted.length - 1],
    count: sorted.length,
  };
}

export function slaCompliance(values: number[]): number {
  if (values.length === 0) return 0;
  const within = values.filter((h) => h <= SLA_TARGET_HOURS).length;
  return within / values.length;
}

export function allHoursForPeriod(period: Period): number[] {
  return TEAMS.flatMap((team) => RESOLVED_HOURS[period][team]);
}

const HOURS_FORMATTER = new Intl.NumberFormat("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
export function formatHours(value: number): string {
  return `${HOURS_FORMATTER.format(value)}h`;
}

const PERCENT_FORMATTER = new Intl.NumberFormat("en-US", { style: "percent", maximumFractionDigits: 1 });
export function formatPercent(fraction: number): string {
  return PERCENT_FORMATTER.format(fraction);
}

const COUNT_FORMATTER = new Intl.NumberFormat("en-US");
export function formatCount(value: number): string {
  return COUNT_FORMATTER.format(value);
}

// `timeZone: "UTC"` is pinned explicitly — without it, this would format using the runtime's
// local time zone, which can differ between the server-rendered pass and the browser and would
// produce a hydration mismatch.
export const FEED_TIME_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
  timeZone: "UTC",
});

// --- Open ticket queue (a distinct dataset from the resolved-hours records above: these are
// tickets that have not resolved yet, so they carry an "age" rather than a resolution time). ---

export type Priority = "Critical" | "High" | "Medium" | "Low";
export type OpenStatus = "Open" | "In progress" | "Escalated";

export interface Assignee {
  name: string;
  role: string;
  photo: string;
}

export const ASSIGNEES: Record<string, Assignee> = {
  "Maya Chen": {
    name: "Maya Chen",
    role: "Senior Support Engineer",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
  },
  "Theo Novak": {
    name: "Theo Novak",
    role: "Support Engineer",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
  },
  "Priya Patel": {
    name: "Priya Patel",
    role: "Support Engineer",
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
  },
  "Sana Idris": {
    name: "Sana Idris",
    role: "Support Engineer",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
  },
};

export interface OpenTicket {
  id: string;
  subject: string;
  team: TeamName;
  priority: Priority;
  status: OpenStatus;
  assignee: string;
  ageHours: number;
}

export const OPEN_TICKETS: OpenTicket[] = [
  { id: "RH-4821", subject: "Billing sync job failing for enterprise tier", team: "Billing", priority: "Critical", status: "Escalated", assignee: "Maya Chen", ageHours: 14.2 },
  { id: "RH-4819", subject: "VPN handshake timeout on EU gateway", team: "Network Ops", priority: "High", status: "In progress", assignee: "Theo Novak", ageHours: 9.6 },
  { id: "RH-4815", subject: "SSO login loop after password reset", team: "Security", priority: "High", status: "In progress", assignee: "Priya Patel", ageHours: 6.1 },
  { id: "RH-4810", subject: "Mobile app crashes on invoice export", team: "App Platform", priority: "Medium", status: "Open", assignee: "Theo Novak", ageHours: 4.8 },
  { id: "RH-4806", subject: "Warehouse scanner offline at Dock 3", team: "Field Ops", priority: "Medium", status: "Open", assignee: "Maya Chen", ageHours: 3.3 },
  { id: "RH-4802", subject: "Duplicate charge on annual renewal invoice", team: "Billing", priority: "Critical", status: "In progress", assignee: "Priya Patel", ageHours: 11.0 },
  { id: "RH-4798", subject: "API rate limit false positive for partner key", team: "App Platform", priority: "Low", status: "Open", assignee: "Sana Idris", ageHours: 2.4 },
  { id: "RH-4793", subject: "Firewall rule blocking release pipeline", team: "Network Ops", priority: "High", status: "Escalated", assignee: "Sana Idris", ageHours: 16.7 },
  { id: "RH-4788", subject: "Field tablet sync drops after OS update", team: "Field Ops", priority: "Low", status: "Open", assignee: "Theo Novak", ageHours: 1.6 },
  { id: "RH-4781", subject: "MFA recovery codes not emailing", team: "Security", priority: "Medium", status: "In progress", assignee: "Maya Chen", ageHours: 5.9 },
];

// --- Live ticket activity feed ---

export type FeedEventType = "created" | "assigned" | "escalated" | "resolved" | "reopened";

export interface FeedEvent {
  id: string;
  type: FeedEventType;
  ticket: string;
  team: TeamName;
  actor: string;
  detail: string;
  // Fixed ISO literal — never `new Date()` / `Date.now()`.
  at: string;
}

export const FEED_EVENTS: FeedEvent[] = [
  { id: "f1", type: "escalated", ticket: "RH-4821", team: "Billing", actor: "Maya Chen", detail: "escalated RH-4821 to Tier 2", at: "2026-11-11T09:42:00Z" },
  { id: "f2", type: "assigned", ticket: "RH-4819", team: "Network Ops", actor: "Theo Novak", detail: "picked up RH-4819", at: "2026-11-11T09:21:00Z" },
  { id: "f3", type: "resolved", ticket: "RH-4779", team: "Billing", actor: "Priya Patel", detail: "resolved RH-4779", at: "2026-11-11T08:57:00Z" },
  { id: "f4", type: "created", ticket: "RH-4822", team: "Field Ops", actor: "System", detail: "opened RH-4822 from the field app", at: "2026-11-11T08:40:00Z" },
  { id: "f5", type: "escalated", ticket: "RH-4793", team: "Network Ops", actor: "Sana Idris", detail: "escalated RH-4793 to Tier 3", at: "2026-11-11T08:12:00Z" },
  { id: "f6", type: "resolved", ticket: "RH-4771", team: "App Platform", actor: "Theo Novak", detail: "resolved RH-4771", at: "2026-11-11T07:55:00Z" },
  { id: "f7", type: "reopened", ticket: "RH-4765", team: "Security", actor: "Priya Patel", detail: "reopened RH-4765 after customer reply", at: "2026-11-11T07:30:00Z" },
  { id: "f8", type: "created", ticket: "RH-4820", team: "App Platform", actor: "System", detail: "opened RH-4820 from the status page", at: "2026-11-11T07:08:00Z" },
  { id: "f9", type: "assigned", ticket: "RH-4810", team: "App Platform", actor: "Theo Novak", detail: "picked up RH-4810", at: "2026-11-11T06:44:00Z" },
  { id: "f10", type: "resolved", ticket: "RH-4758", team: "Field Ops", actor: "Maya Chen", detail: "resolved RH-4758", at: "2026-11-11T06:19:00Z" },
  { id: "f11", type: "created", ticket: "RH-4818", team: "Security", actor: "System", detail: "opened RH-4818 from the admin portal", at: "2026-11-11T05:52:00Z" },
  { id: "f12", type: "resolved", ticket: "RH-4742", team: "Network Ops", actor: "Sana Idris", detail: "resolved RH-4742", at: "2026-11-11T05:30:00Z" },
  { id: "f13", type: "assigned", ticket: "RH-4802", team: "Billing", actor: "Priya Patel", detail: "picked up RH-4802", at: "2026-11-11T05:02:00Z" },
  { id: "f14", type: "escalated", ticket: "RH-4788", team: "Field Ops", actor: "Maya Chen", detail: "escalated RH-4788 to the field hardware vendor", at: "2026-11-11T04:38:00Z" },
];
