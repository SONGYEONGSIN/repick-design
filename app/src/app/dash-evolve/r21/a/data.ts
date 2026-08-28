import { Inbox, ListChecks, LucideIcon, Radar, ShieldCheck, Timer, Workflow } from "lucide-react";
import type { Priority } from "./tokens";

export const BRAND = { name: "Meridian", Icon: Radar };

export const CURRENT_USER = {
  name: "Priya Anand",
  role: "Support ops lead",
  email: "priya.anand@meridianhq.io",
  avatarId: "1494790108377-be9c29b29330",
};

export const WORKSPACES = [
  { id: "core", name: "Core support", plan: "42 agents" },
  { id: "enterprise", name: "Enterprise desk", plan: "11 agents" },
  { id: "billing", name: "Billing queue", plan: "6 agents" },
];

export type NavItem = { id: string; label: string; Icon: LucideIcon; active?: boolean; disabled?: boolean };
export const NAV_SECTIONS: { id: string; title: string; items: NavItem[] }[] = [
  {
    id: "work",
    title: "Work",
    items: [
      { id: "board", label: "Triage board", Icon: Inbox, active: true },
      { id: "queues", label: "Queues", Icon: Workflow },
      { id: "sla", label: "SLA policies", Icon: Timer },
    ],
  },
  {
    id: "insight",
    title: "Insight",
    items: [
      { id: "reports", label: "Reports", Icon: ListChecks },
      { id: "quality", label: "Quality reviews", Icon: ShieldCheck, disabled: true },
    ],
  },
];

export type ColumnId = "new" | "triage" | "progress" | "waiting" | "resolved";
export const COLUMNS: { id: ColumnId; label: string }[] = [
  { id: "new", label: "New" },
  { id: "triage", label: "Triaging" },
  { id: "progress", label: "In progress" },
  { id: "waiting", label: "Waiting on customer" },
  { id: "resolved", label: "Resolved" },
];

export interface Ticket {
  id: string;
  key: string;
  title: string;
  priority: Priority;
  column: ColumnId;
  ageHours: number;
  slaHours: number;
  assignee: { name: string; avatarId: string };
  customer: string;
  resolvedHoursAgo?: number;
  durationHours?: number;
  csat?: number;
}

const A = [
  "1123897727-8f129e1688ce",
  "1438761681033-6461ffad8d80",
  "1472099645785-5658abf4ff4e",
  "1487412720507-e7ab37603c6f",
  "1502685104226-ee32379fefbe",
  "1519085360753-af0119f7cbe7",
];

export const TICKETS: Ticket[] = [
  { id: "t1", key: "SUP-2210", title: "Webhook retries failing for EU region", priority: "P1", column: "new", ageHours: 0.4, slaHours: 4, assignee: { name: "Owen Fen", avatarId: A[0] }, customer: "Northline" },
  { id: "t2", key: "SUP-2209", title: "SSO login loop after IdP rotation", priority: "P1", column: "triage", ageHours: 1.8, slaHours: 4, assignee: { name: "Mira Solis", avatarId: A[1] }, customer: "Vantage Labs" },
  { id: "t3", key: "SUP-2205", title: "Bulk export stuck at 92%", priority: "P2", column: "triage", ageHours: 3.1, slaHours: 8, assignee: { name: "Owen Fen", avatarId: A[0] }, customer: "Corvus" },
  { id: "t4", key: "SUP-2201", title: "Rate limit headers missing on v3 API", priority: "P2", column: "progress", ageHours: 5.6, slaHours: 8, assignee: { name: "Deja Cole", avatarId: A[2] }, customer: "Halite" },
  { id: "t5", key: "SUP-2198", title: "Invoice PDF renders wrong VAT line", priority: "P3", column: "progress", ageHours: 9.4, slaHours: 24, assignee: { name: "Mira Solis", avatarId: A[1] }, customer: "Bellcastle" },
  { id: "t6", key: "SUP-2196", title: "Slack notifications duplicated", priority: "P2", column: "progress", ageHours: 6.9, slaHours: 8, assignee: { name: "Rio Tan", avatarId: A[3] }, customer: "Ledgerline" },
  { id: "t7", key: "SUP-2190", title: "Custom domain SSL renewal delay", priority: "P1", column: "waiting", ageHours: 2.5, slaHours: 4, assignee: { name: "Deja Cole", avatarId: A[2] }, customer: "Northline" },
  { id: "t8", key: "SUP-2187", title: "Seat count mismatch on downgrade", priority: "P3", column: "waiting", ageHours: 14.2, slaHours: 24, assignee: { name: "Owen Fen", avatarId: A[0] }, customer: "Corvus" },
  { id: "t9", key: "SUP-2183", title: "Dashboard chart tooltip cut off", priority: "P4", column: "waiting", ageHours: 30.5, slaHours: 72, assignee: { name: "Rio Tan", avatarId: A[3] }, customer: "Halite" },
  { id: "t10", key: "SUP-2179", title: "API key rotation email not sent", priority: "P2", column: "new", ageHours: 0.9, slaHours: 8, assignee: { name: "Mira Solis", avatarId: A[1] }, customer: "Vantage Labs" },
  { id: "t11", key: "SUP-2176", title: "Report scheduler misses DST shift", priority: "P3", column: "triage", ageHours: 4.8, slaHours: 24, assignee: { name: "Deja Cole", avatarId: A[2] }, customer: "Bellcastle" },
  { id: "t12", key: "SUP-2172", title: "Mobile app crashes on CSV import", priority: "P1", column: "progress", ageHours: 3.9, slaHours: 4, assignee: { name: "Rio Tan", avatarId: A[3] }, customer: "Ledgerline" },
  { id: "t13", key: "SUP-2168", title: "Currency formatting wrong for JPY", priority: "P4", column: "new", ageHours: 0.2, slaHours: 72, assignee: { name: "Owen Fen", avatarId: A[0] }, customer: "Corvus" },
  { id: "t14", key: "SUP-2165", title: "Team member invite link expired early", priority: "P3", column: "waiting", ageHours: 20.1, slaHours: 24, assignee: { name: "Mira Solis", avatarId: A[1] }, customer: "Northline" },
  { id: "t15", key: "SUP-2160", title: "Onboarding checklist stuck at step 3", priority: "P4", column: "triage", ageHours: 1.1, slaHours: 72, assignee: { name: "Deja Cole", avatarId: A[2] }, customer: "Vantage Labs" },
  {
    id: "t16", key: "SUP-2140", title: "Export permissions ignored for viewer role", priority: "P2", column: "resolved", ageHours: 0, slaHours: 8,
    assignee: { name: "Owen Fen", avatarId: A[0] }, customer: "Halite", resolvedHoursAgo: 6, durationHours: 5.4, csat: 96,
  },
  {
    id: "t17", key: "SUP-2137", title: "Billing portal 500 on annual plan switch", priority: "P1", column: "resolved", ageHours: 0, slaHours: 4,
    assignee: { name: "Rio Tan", avatarId: A[3] }, customer: "Bellcastle", resolvedHoursAgo: 11, durationHours: 3.2, csat: 100,
  },
  {
    id: "t18", key: "SUP-2130", title: "Chart legend overlaps on narrow viewports", priority: "P4", column: "resolved", ageHours: 0, slaHours: 72,
    assignee: { name: "Mira Solis", avatarId: A[1] }, customer: "Ledgerline", resolvedHoursAgo: 26, durationHours: 41.0, csat: 88,
  },
  {
    id: "t19", key: "SUP-2124", title: "Two-factor recovery codes not regenerating", priority: "P2", column: "resolved", ageHours: 0, slaHours: 8,
    assignee: { name: "Deja Cole", avatarId: A[2] }, customer: "Corvus", resolvedHoursAgo: 33, durationHours: 6.7, csat: 92,
  },
  {
    id: "t20", key: "SUP-2118", title: "Custom report totals off by rounding", priority: "P3", column: "resolved", ageHours: 0, slaHours: 24,
    assignee: { name: "Owen Fen", avatarId: A[0] }, customer: "Vantage Labs", resolvedHoursAgo: 48, durationHours: 14.9, csat: 80,
  },
  {
    id: "t21", key: "SUP-2109", title: "Escalated: data residency flag reverted", priority: "P1", column: "resolved", ageHours: 0, slaHours: 4,
    assignee: { name: "Rio Tan", avatarId: A[3] }, customer: "Northline", resolvedHoursAgo: 60, durationHours: 9.1, csat: 70,
  },
];

export const OPEN_TICKETS = TICKETS.filter((t) => t.column !== "resolved");
export const RESOLVED_TICKETS = TICKETS.filter((t) => t.column === "resolved");
export const ESCALATED_TICKETS = RESOLVED_TICKETS.filter((t) => t.priority === "P1" || (t.csat ?? 100) < 85);

export const OPEN_COUNT = OPEN_TICKETS.length;
export const BREACHING_COUNT = OPEN_TICKETS.filter((t) => t.ageHours / t.slaHours >= 0.9).length;
export const AVG_RESOLUTION_HOURS = r1(RESOLVED_TICKETS.reduce((s, t) => s + (t.durationHours ?? 0), 0) / RESOLVED_TICKETS.length);
export const AVG_CSAT = Math.round(RESOLVED_TICKETS.reduce((s, t) => s + (t.csat ?? 0), 0) / RESOLVED_TICKETS.length);

// Deterministic 7-day open-ticket trend (fixed series, no Math.random).
export const OPEN_TREND = [24, 27, 22, 29, 26, 31, OPEN_COUNT];

function r1(n: number): number {
  return Math.round(n * 10) / 10;
}

export function formatInt(n: number): string {
  return new Intl.NumberFormat("en-US").format(n);
}
export function formatHours(n: number): string {
  return n < 1 ? `${Math.round(n * 60)}m` : `${r1(n)}h`;
}
export function formatPct(n: number): string {
  return `${Math.round(n)}%`;
}

export const SEARCH_ENTRIES = TICKETS.map((t) => ({ id: t.id, title: `${t.key} — ${t.title}`, meta: t.customer, Icon: Inbox }));
