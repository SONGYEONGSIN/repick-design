/**
 * Harborline — deterministic dummy data for the support-ticket master/detail console.
 * No Math.random / Date.now / new Date() anywhere: every generated value comes from a seeded
 * Lehmer/Park-Miller PRNG, and the single "now" anchor is a fixed UTC millisecond constant.
 * Re-running this module always produces the exact same tickets, weekly series, and totals —
 * derived aggregate counts (filter tab counts, priority tallies) are always computed with
 * `.filter().length` / `.reduce()` from this array, never hand-typed, so subtotals cannot drift
 * from the total.
 */

import type { LucideIcon } from "lucide-react";
import { Boxes, LifeBuoy, ListChecks, Settings, ShieldCheck, Sparkles, Users } from "lucide-react";
import type { Priority, Status } from "./tokens";

export function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

/* ------------------------------------------------------------ Seeded PRNG */

/** Park-Miller / Lehmer generator — deterministic, no Math.random. */
function makePrng(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return function next(): number {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/** Small deterministic string hash (FNV-1a) — turns an id into a PRNG seed without Math.random. */
function seedFromId(id: string, salt: number): number {
  let h = 2166136261 ^ salt;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) || 1;
}

/* --------------------------------------------------------------- Brand */

export const BRAND = { name: "Harborline", tagline: "Support Console" };

export function unsplashAvatar(id: string, size = 96): string {
  return `https://images.unsplash.com/photo-${id}?w=${size}&h=${size}&fit=crop&crop=faces`;
}

export type Workspace = { id: string; name: string; plan: string };
export const WORKSPACES: Workspace[] = [
  { id: "ws-fernbridge", name: "Fernbridge Data", plan: "Growth plan" },
  { id: "ws-sandbox", name: "Fernbridge Sandbox", plan: "Free plan" },
];

/** Fictional persona — never real session/operator data. */
export const CURRENT_USER = {
  name: "Reyna Okoye",
  role: "Support Lead",
  email: "reyna.okoye@fernbridge.io",
  avatarId: "1519244703995-f4e0f30006d5",
};

/* -------------------------------------------------------- Global nav */

export type NavItem = { id: string; label: string; Icon: LucideIcon; active?: boolean; disabled?: boolean };
export type NavSection = { id: string; title: string; items: NavItem[] };

export const NAV_SECTIONS: NavSection[] = [
  {
    id: "support",
    title: "Support",
    items: [
      { id: "queue", label: "Queue", Icon: LifeBuoy, active: true },
      { id: "customers", label: "Customers", Icon: Users, disabled: true },
      { id: "macros", label: "Macros", Icon: ListChecks, disabled: true },
    ],
  },
  {
    id: "insights",
    title: "Insights",
    items: [
      { id: "reports", label: "Reports", Icon: Sparkles, disabled: true },
      { id: "sla", label: "SLA policies", Icon: ShieldCheck, disabled: true },
    ],
  },
  {
    id: "workspace",
    title: "Workspace",
    items: [
      { id: "integrations", label: "Integrations", Icon: Boxes, disabled: true },
      { id: "settings", label: "Settings", Icon: Settings, disabled: true },
    ],
  },
];

/* ------------------------------------------------------------ Agents */

export type AgentId = "reyna" | "callum" | "sana" | "iris" | "teo";
export type Agent = { id: AgentId; name: string; initials: string };

export const AGENTS: Agent[] = [
  { id: "reyna", name: "Reyna Okoye", initials: "RO" },
  { id: "callum", name: "Callum Bright", initials: "CB" },
  { id: "sana", name: "Sana Vogel", initials: "SV" },
  { id: "iris", name: "Iris Halvorsen", initials: "IH" },
  { id: "teo", name: "Teo Marchetti", initials: "TM" },
];
export const AGENT_BY_ID: Record<AgentId, Agent> = Object.fromEntries(AGENTS.map((a) => [a.id, a])) as Record<AgentId, Agent>;

/* ------------------------------------------------------------ Accounts */

export type Plan = "Starter" | "Growth" | "Scale";
export type AccountId =
  | "vantree"
  | "harborlight"
  | "fenwick"
  | "static-motion"
  | "quillfield"
  | "boreal"
  | "amaranth"
  | "solace";

export type Account = {
  id: AccountId;
  name: string;
  plan: Plan;
  mrr: number;
  healthScore: number;
  seats: number;
  accountAgeMonths: number;
  contactName: string;
  contactRole: string;
  contactAvatarId?: string;
};

export const ACCOUNTS: Account[] = [
  { id: "vantree", name: "Vantree Logistics", plan: "Scale", mrr: 18400, healthScore: 82, seats: 340, accountAgeMonths: 27, contactName: "Delia Marsh", contactRole: "IT Director", contactAvatarId: "1607746882042-944635dfe10e" },
  { id: "harborlight", name: "Harborlight Health", plan: "Growth", mrr: 6200, healthScore: 58, seats: 85, accountAgeMonths: 11, contactName: "Owen Facey", contactRole: "Platform Lead" },
  { id: "fenwick", name: "Fenwick & Cole", plan: "Scale", mrr: 24100, healthScore: 91, seats: 460, accountAgeMonths: 39, contactName: "Priyanka Rao", contactRole: "VP Engineering" },
  { id: "static-motion", name: "Static Motion Studio", plan: "Starter", mrr: 890, healthScore: 47, seats: 12, accountAgeMonths: 4, contactName: "Ines Callahan", contactRole: "Founder" },
  { id: "quillfield", name: "Quillfield Insurance", plan: "Scale", mrr: 31200, healthScore: 74, seats: 610, accountAgeMonths: 33, contactName: "Marcus Delaney", contactRole: "Integrations Manager" },
  { id: "boreal", name: "Boreal Systems", plan: "Growth", mrr: 8100, healthScore: 65, seats: 120, accountAgeMonths: 18, contactName: "Tobias Lindgren", contactRole: "DevOps Lead" },
  { id: "amaranth", name: "Amaranth Retail Group", plan: "Growth", mrr: 5400, healthScore: 39, seats: 96, accountAgeMonths: 8, contactName: "Rosa Villanueva", contactRole: "Operations Manager" },
  { id: "solace", name: "Solace Robotics", plan: "Starter", mrr: 1450, healthScore: 88, seats: 22, accountAgeMonths: 6, contactName: "Jun-ho Baek", contactRole: "CTO" },
];
export const ACCOUNT_BY_ID: Record<AccountId, Account> = Object.fromEntries(ACCOUNTS.map((a) => [a.id, a])) as Record<AccountId, Account>;

/* -------------------------------------------------------------- Tickets */

export type Channel = "email" | "chat" | "phone";

export type Ticket = {
  id: string;
  subject: string;
  accountId: AccountId;
  priority: Priority;
  status: Status;
  channel: Channel;
  assigneeId: AgentId | null;
  /** Minutes elapsed since the ticket was opened, measured back from the fixed NOW_MS anchor. */
  createdOffsetMin: number;
  /** Only set for resolved tickets — minutes from open to resolution. */
  resolutionMin?: number;
};

export const SLA_TARGET_MIN: Record<Priority, number> = { urgent: 30, high: 120, normal: 480, low: 1440 };

export const TICKETS: Ticket[] = [
  { id: "HB-1024", subject: "SSO login redirect loop on Okta", accountId: "vantree", priority: "urgent", status: "escalated", channel: "chat", assigneeId: "callum", createdOffsetMin: 18 },
  { id: "HB-1025", subject: "Webhook retries failing after v2 migration", accountId: "vantree", priority: "high", status: "open", channel: "email", assigneeId: "sana", createdOffsetMin: 95 },
  { id: "HB-1026", subject: "Bulk export CSV missing new custom fields", accountId: "vantree", priority: "normal", status: "pending", channel: "email", assigneeId: "reyna", createdOffsetMin: 620 },
  { id: "HB-1027", subject: "Seat count mismatch on renewal invoice", accountId: "vantree", priority: "low", status: "resolved", channel: "email", assigneeId: "iris", createdOffsetMin: 4200, resolutionMin: 340 },

  { id: "HB-1028", subject: "GraphQL query timeout on large exports", accountId: "fenwick", priority: "urgent", status: "open", channel: "phone", assigneeId: "callum", createdOffsetMin: 42 },
  { id: "HB-1029", subject: "Audit log export stuck at 92%", accountId: "fenwick", priority: "high", status: "pending", channel: "chat", assigneeId: "teo", createdOffsetMin: 260 },
  { id: "HB-1030", subject: "Permission sync delayed for new hires", accountId: "fenwick", priority: "normal", status: "open", channel: "email", assigneeId: null, createdOffsetMin: 130 },
  { id: "HB-1031", subject: "Dashboard charts blank for EU tenant", accountId: "fenwick", priority: "normal", status: "resolved", channel: "email", assigneeId: "sana", createdOffsetMin: 5600, resolutionMin: 210 },

  { id: "HB-1032", subject: "Rate limit errors during nightly sync", accountId: "quillfield", priority: "high", status: "escalated", channel: "email", assigneeId: "reyna", createdOffsetMin: 300 },
  { id: "HB-1033", subject: "Two-factor recovery codes not sent", accountId: "quillfield", priority: "urgent", status: "open", channel: "chat", assigneeId: "iris", createdOffsetMin: 25 },
  { id: "HB-1034", subject: "Report scheduler skipped last week", accountId: "quillfield", priority: "low", status: "resolved", channel: "email", assigneeId: "teo", createdOffsetMin: 8200, resolutionMin: 480 },

  { id: "HB-1035", subject: "SAML metadata certificate expiring", accountId: "boreal", priority: "high", status: "open", channel: "email", assigneeId: "callum", createdOffsetMin: 410 },
  { id: "HB-1036", subject: "Custom domain SSL renewal failed", accountId: "boreal", priority: "high", status: "pending", channel: "chat", assigneeId: "sana", createdOffsetMin: 190 },
  { id: "HB-1037", subject: "Mobile push notifications missing on iOS", accountId: "boreal", priority: "normal", status: "open", channel: "email", assigneeId: null, createdOffsetMin: 560 },

  { id: "HB-1038", subject: "Data export stuck at 92% for PHI records", accountId: "harborlight", priority: "high", status: "escalated", channel: "phone", assigneeId: "reyna", createdOffsetMin: 75 },
  { id: "HB-1039", subject: "Workspace merge duplicated patient contacts", accountId: "harborlight", priority: "normal", status: "pending", channel: "email", assigneeId: "iris", createdOffsetMin: 340 },
  { id: "HB-1040", subject: "Search results missing recent records", accountId: "harborlight", priority: "normal", status: "open", channel: "chat", assigneeId: "teo", createdOffsetMin: 150 },

  { id: "HB-1041", subject: "Bulk delete undo request", accountId: "amaranth", priority: "normal", status: "open", channel: "chat", assigneeId: "sana", createdOffsetMin: 60 },
  { id: "HB-1042", subject: "Read receipts not syncing to CRM", accountId: "amaranth", priority: "low", status: "pending", channel: "email", assigneeId: "callum", createdOffsetMin: 500 },
  { id: "HB-1043", subject: "Table filters reset on page refresh", accountId: "amaranth", priority: "low", status: "resolved", channel: "email", assigneeId: "reyna", createdOffsetMin: 6100, resolutionMin: 95 },

  { id: "HB-1044", subject: "Onboarding checklist not saving progress", accountId: "static-motion", priority: "normal", status: "open", channel: "chat", assigneeId: "iris", createdOffsetMin: 220 },
  { id: "HB-1045", subject: "CSV import rejecting valid rows", accountId: "static-motion", priority: "normal", status: "resolved", channel: "email", assigneeId: "teo", createdOffsetMin: 7300, resolutionMin: 260 },

  { id: "HB-1046", subject: "API key rotation broke integration", accountId: "solace", priority: "high", status: "open", channel: "email", assigneeId: "sana", createdOffsetMin: 330 },
  { id: "HB-1047", subject: "Slack notifications duplicated", accountId: "solace", priority: "low", status: "resolved", channel: "chat", assigneeId: "callum", createdOffsetMin: 9200, resolutionMin: 150 },
];

export const TICKET_BY_ID: Record<string, Ticket> = Object.fromEntries(TICKETS.map((t) => [t.id, t]));

export function ticketsForAccount(accountId: AccountId): Ticket[] {
  return TICKETS.filter((t) => t.accountId === accountId);
}

/** Positive = minutes remaining before breach. Negative = minutes overdue. `null` for resolved tickets. */
export function slaRemainingMin(t: Ticket): number | null {
  if (t.status === "resolved") return null;
  return SLA_TARGET_MIN[t.priority] - t.createdOffsetMin;
}

export type SlaState = "breached" | "at-risk" | "on-track" | "met" | "missed";

export function slaState(t: Ticket): SlaState {
  if (t.status === "resolved") {
    return (t.resolutionMin ?? 0) <= SLA_TARGET_MIN[t.priority] ? "met" : "missed";
  }
  const remaining = slaRemainingMin(t) ?? 0;
  const target = SLA_TARGET_MIN[t.priority];
  if (remaining < 0) return "breached";
  if (remaining <= target * 0.2) return "at-risk";
  return "on-track";
}

/* ---------------------------------------------------------- Fixed "now" anchor */

/** Fixed UTC anchor — never Date.now(). Every relative/offset calculation in this module measures
 *  back from this single constant, so the dataset is identical on every render and every machine. */
export const NOW_MS = Date.UTC(2026, 7, 15, 14, 0, 0);
const MIN_MS = 60_000;
const DAY_MS = 86_400_000;
const WEEK_MS = 7 * DAY_MS;

const dateFmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
const dateTimeFmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit", timeZone: "UTC" });

export function ticketOpenedMs(t: Ticket): number {
  return NOW_MS - t.createdOffsetMin * MIN_MS;
}
export function formatDate(ms: number): string {
  return dateFmt.format(new Date(ms));
}
export function formatDateTime(ms: number): string {
  return dateTimeFmt.format(new Date(ms));
}

export function formatMinutes(min: number): string {
  const abs = Math.abs(Math.round(min));
  if (abs < 60) return `${abs}m`;
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

/* ---------------------------------------------------- Conversation threads */

export type Message = { speaker: "customer" | "agent"; text: string };

const CONVERSATION_TEMPLATES: Message[][] = [
  [
    { speaker: "customer", text: "This started right after this morning's deploy — can you confirm whether anything changed on your end?" },
    { speaker: "agent", text: "Looking now — I can see the pattern in the logs on our side. Pulling the exact timestamps to narrow down the cause." },
    { speaker: "customer", text: "Appreciate the quick turnaround. It's blocking a few people on our team, so flagging as time-sensitive." },
  ],
  [
    { speaker: "customer", text: "We noticed this affects about a third of our records — happy to send a sample export if useful." },
    { speaker: "agent", text: "That would help a lot, thank you. I've reproduced a version of it internally and I'm checking whether it's config or a platform bug." },
  ],
  [
    { speaker: "customer", text: "Is there a workaround while this gets fixed? We have a deadline at the end of the week." },
    { speaker: "agent", text: "There's a manual step that unblocks you in the meantime — walking you through it now, and I'll keep this open until the underlying fix ships." },
    { speaker: "customer", text: "That gets us moving again, thank you. Please keep me posted on the permanent fix." },
  ],
  [
    { speaker: "customer", text: "Wanted to check in — any update since yesterday?" },
    { speaker: "agent", text: "Apologies for the delay — this needed input from the platform team. I have an ETA now and will follow up as soon as it's confirmed." },
  ],
  [
    { speaker: "customer", text: "Thanks for the fast fix. Confirmed it's working on our end now." },
    { speaker: "agent", text: "Glad to hear it — closing this out. Reach back out if it resurfaces and we'll reopen straight away." },
  ],
  [
    { speaker: "customer", text: "Adding a bit more detail: it only reproduces for a specific role, not admins." },
    { speaker: "agent", text: "That's a useful narrowing, thank you — checking role-based permission handling now, will update shortly." },
    { speaker: "customer", text: "Sounds good, standing by." },
  ],
];

export function conversationFor(t: Ticket): Message[] {
  const idx = TICKETS.findIndex((x) => x.id === t.id);
  return CONVERSATION_TEMPLATES[idx % CONVERSATION_TEMPLATES.length];
}

/* --------------------------------------------------- Weekly SLA/response series (per account) */

export const CHART_WEEKS_TOTAL = 20;

export type WeeklyPoint = { weekStartMs: number; compliancePct: number; responseMin: number };

const seriesCache = new Map<AccountId, WeeklyPoint[]>();

/** Deterministic 20-week compliance% + median-first-response series, biased by account health. */
export function weeklySeriesFor(accountId: AccountId): WeeklyPoint[] {
  const cached = seriesCache.get(accountId);
  if (cached) return cached;

  const account = ACCOUNT_BY_ID[accountId];
  const rng = makePrng(seedFromId(accountId, 7919));
  const baseCompliance = Math.min(98, Math.max(42, 48 + account.healthScore * 0.5));
  const baseResponse = Math.min(220, Math.max(14, 176 - account.healthScore * 1.35));

  const weekStartAnchor = NOW_MS - (NOW_MS % WEEK_MS);
  const series: WeeklyPoint[] = [];
  let complianceDrift = 0;
  let responseDrift = 0;
  for (let i = CHART_WEEKS_TOTAL - 1; i >= 0; i--) {
    const weekStartMs = weekStartAnchor - i * WEEK_MS;
    complianceDrift += (rng() - 0.5) * 9;
    complianceDrift *= 0.7;
    responseDrift += (rng() - 0.5) * 22;
    responseDrift *= 0.7;
    const compliancePct = Math.round(Math.min(100, Math.max(30, baseCompliance + complianceDrift)));
    const responseMin = Math.round(Math.min(260, Math.max(6, baseResponse + responseDrift)));
    series.push({ weekStartMs, compliancePct, responseMin });
  }
  seriesCache.set(accountId, series);
  return series;
}

export type PeriodId = "8w" | "20w";
export const PERIODS: { id: PeriodId; label: string; weeks: number }[] = [
  { id: "8w", label: "Last 8 weeks", weeks: 8 },
  { id: "20w", label: "Last 20 weeks", weeks: CHART_WEEKS_TOTAL },
];

export function seriesForPeriod(accountId: AccountId, periodId: PeriodId): WeeklyPoint[] {
  const full = weeklySeriesFor(accountId);
  const weeks = PERIODS.find((p) => p.id === periodId)?.weeks ?? full.length;
  return full.slice(-weeks);
}

export type TrendDirection = "up" | "down" | "flat";

export function seriesStats(points: WeeklyPoint[], fullSeries: WeeklyPoint[]) {
  const avgCompliance = round1(points.reduce((s, p) => s + p.compliancePct, 0) / points.length);
  const avgResponse = Math.round(points.reduce((s, p) => s + p.responseMin, 0) / points.length);

  const startIdx = fullSeries.length - points.length;
  const hasExternalPrior = startIdx - points.length >= 0;
  const priorWindow = hasExternalPrior
    ? fullSeries.slice(startIdx - points.length, startIdx)
    : points.slice(0, Math.max(1, Math.floor(points.length / 2)));
  const comparisonSuffix = hasExternalPrior ? "vs. prior period" : "vs. first half shown";

  const priorCompliance = round1(priorWindow.reduce((s, p) => s + p.compliancePct, 0) / priorWindow.length);
  const priorResponse = Math.round(priorWindow.reduce((s, p) => s + p.responseMin, 0) / priorWindow.length);

  function delta(cur: number, prev: number, goodIsUp: boolean): { direction: TrendDirection; label: string; good: boolean } {
    const diff = round1(cur - prev);
    if (diff === 0) return { direction: "flat", label: `flat ${comparisonSuffix}`, good: true };
    const direction: TrendDirection = diff > 0 ? "up" : "down";
    const good = goodIsUp ? diff > 0 : diff < 0;
    return { direction, label: `${direction === "up" ? "+" : ""}${diff} ${comparisonSuffix}`, good };
  }

  return {
    avgCompliance,
    avgResponse,
    complianceDelta: delta(avgCompliance, priorCompliance, true),
    responseDelta: delta(avgResponse, priorResponse, false),
  };
}
