// Deterministic demo data for Switchboard, a ticket-routing ops console for a
// mid-size SaaS support org. No Math.random / Date.now / new Date anywhere in
// this file or any consumer — every "time ago" value below is a fixed, literal
// minute offset inside this fictional dataset, never real wall-clock time.
//
// All derived numbers shown on the page (grand totals, busiest pair, shares,
// row/column crossfoots) are computed from the FLOWS arrays at render time via
// the helpers below — nothing downstream re-states a sum by hand, so totals
// cannot drift out of reconciliation with their source rows.

export type Period = "week" | "month";

export const BRAND_NAME = "Switchboard";
export const BRAND_TAGLINE = "Routing Console";

export const WORKSPACES = ["Core Workspace", "EU Workspace"];

export const CURRENT_USER = {
  name: "Priya Nathan",
  email: "priya.nathan@switchboard.io",
  initials: "PN",
};

export const PERIODS: { value: Period; label: string }[] = [
  { value: "week", label: "This week" },
  { value: "month", label: "This month" },
];

export const DEFAULT_PERIOD: Period = "week";

export type NavIconName = "Gauge" | "Route" | "Inbox" | "Users" | "FileBarChart2";

export const NAV_SECTIONS: { label: string; icon: NavIconName; active: boolean }[] = [
  { label: "Overview", icon: "Gauge", active: true },
  { label: "Routing map", icon: "Route", active: false },
  { label: "Tickets", icon: "Inbox", active: false },
  { label: "Teams", icon: "Users", active: false },
  { label: "Reports", icon: "FileBarChart2", active: false },
];

// ---------------------------------------------------------------------------
// Departments — the chord diagram's categories. Fixed order everywhere; the
// hex values are the data-viz skill's validated categorical slots 1-6 (blue,
// orange, aqua, yellow, magenta, green), used only as small identity rings
// next to an always-present text label — never as the sole carrier of meaning.
// ---------------------------------------------------------------------------

export type Department = {
  id: string;
  name: string;
  short: string;
  color: string;
};

export const DEPARTMENTS: Department[] = [
  { id: "t1-support", name: "Tier-1 Support", short: "Support", color: "#2a78d6" },
  { id: "billing", name: "Billing", short: "Billing", color: "#eb6834" },
  { id: "platform-eng", name: "Platform Eng", short: "Platform", color: "#1baf7a" },
  { id: "trust-safety", name: "Trust & Safety", short: "T&S", color: "#c98500" },
  { id: "customer-success", name: "Customer Success", short: "Success", color: "#d55181" },
  { id: "sales", name: "Sales", short: "Sales", color: "#008300" },
];

export const DEPARTMENT_BY_ID: Record<string, Department> = Object.fromEntries(DEPARTMENTS.map((d) => [d.id, d]));

// ---------------------------------------------------------------------------
// Flows — directed handoff counts, from → to, one fixed dataset per period.
// ---------------------------------------------------------------------------

export type Flow = { from: string; to: string; value: number };

const FLOWS_WEEK: Flow[] = [
  { from: "t1-support", to: "billing", value: 428 },
  { from: "t1-support", to: "platform-eng", value: 96 },
  { from: "t1-support", to: "trust-safety", value: 54 },
  { from: "t1-support", to: "customer-success", value: 112 },
  { from: "t1-support", to: "sales", value: 18 },

  { from: "billing", to: "t1-support", value: 64 },
  { from: "billing", to: "platform-eng", value: 22 },
  { from: "billing", to: "trust-safety", value: 8 },
  { from: "billing", to: "customer-success", value: 40 },
  { from: "billing", to: "sales", value: 6 },

  { from: "platform-eng", to: "t1-support", value: 30 },
  { from: "platform-eng", to: "billing", value: 12 },
  { from: "platform-eng", to: "trust-safety", value: 16 },
  { from: "platform-eng", to: "customer-success", value: 10 },
  { from: "platform-eng", to: "sales", value: 4 },

  { from: "trust-safety", to: "t1-support", value: 20 },
  { from: "trust-safety", to: "billing", value: 6 },
  { from: "trust-safety", to: "platform-eng", value: 4 },
  { from: "trust-safety", to: "customer-success", value: 8 },
  { from: "trust-safety", to: "sales", value: 2 },

  { from: "customer-success", to: "t1-support", value: 70 },
  { from: "customer-success", to: "billing", value: 34 },
  { from: "customer-success", to: "platform-eng", value: 6 },
  { from: "customer-success", to: "trust-safety", value: 10 },
  { from: "customer-success", to: "sales", value: 26 },

  { from: "sales", to: "t1-support", value: 14 },
  { from: "sales", to: "billing", value: 44 },
  { from: "sales", to: "platform-eng", value: 2 },
  { from: "sales", to: "trust-safety", value: 2 },
  { from: "sales", to: "customer-success", value: 30 },
];

const FLOWS_MONTH: Flow[] = [
  { from: "t1-support", to: "billing", value: 1680 },
  { from: "t1-support", to: "platform-eng", value: 360 },
  { from: "t1-support", to: "trust-safety", value: 240 },
  { from: "t1-support", to: "customer-success", value: 520 },
  { from: "t1-support", to: "sales", value: 80 },

  { from: "billing", to: "t1-support", value: 300 },
  { from: "billing", to: "platform-eng", value: 100 },
  { from: "billing", to: "trust-safety", value: 40 },
  { from: "billing", to: "customer-success", value: 180 },
  { from: "billing", to: "sales", value: 30 },

  { from: "platform-eng", to: "t1-support", value: 140 },
  { from: "platform-eng", to: "billing", value: 60 },
  { from: "platform-eng", to: "trust-safety", value: 70 },
  { from: "platform-eng", to: "customer-success", value: 50 },
  { from: "platform-eng", to: "sales", value: 20 },

  { from: "trust-safety", to: "t1-support", value: 90 },
  { from: "trust-safety", to: "billing", value: 30 },
  { from: "trust-safety", to: "platform-eng", value: 20 },
  { from: "trust-safety", to: "customer-success", value: 40 },
  { from: "trust-safety", to: "sales", value: 10 },

  { from: "customer-success", to: "t1-support", value: 320 },
  { from: "customer-success", to: "billing", value: 150 },
  { from: "customer-success", to: "platform-eng", value: 30 },
  { from: "customer-success", to: "trust-safety", value: 50 },
  { from: "customer-success", to: "sales", value: 120 },

  { from: "sales", to: "t1-support", value: 70 },
  { from: "sales", to: "billing", value: 190 },
  { from: "sales", to: "platform-eng", value: 10 },
  { from: "sales", to: "trust-safety", value: 10 },
  { from: "sales", to: "customer-success", value: 130 },
];

export const FLOWS_BY_PERIOD: Record<Period, Flow[]> = { week: FLOWS_WEEK, month: FLOWS_MONTH };

// Fixed prior-period history for the "Total handoffs" trend sparkline. The
// current period's own grand total is appended at render time (computed, not
// re-typed) so the sparkline's final point can never drift from the KPI tile
// shown right beside it.
export const TREND_PRIOR: Record<Period, number[]> = {
  week: [980, 1020, 1065, 1110, 1150],
  month: [4200, 4450, 4700, 4900, 5020],
};

// ---------------------------------------------------------------------------
// Derived chord-model helpers — every on-screen total/percentage is computed
// through one of these, never re-typed as a literal.
// ---------------------------------------------------------------------------

export function grandTotal(flows: Flow[]): number {
  return flows.reduce((sum, f) => sum + f.value, 0);
}

export function nodeTotal(flows: Flow[], id: string): number {
  return flows.reduce((sum, f) => sum + (f.from === id || f.to === id ? f.value : 0), 0);
}

export function flowValue(flows: Flow[], from: string, to: string): number {
  return flows.find((f) => f.from === from && f.to === to)?.value ?? 0;
}

export type PairInfo = { a: string; b: string; aToB: number; bToA: number; combined: number };

export function allPairs(flows: Flow[]): PairInfo[] {
  const pairs: PairInfo[] = [];
  for (let i = 0; i < DEPARTMENTS.length; i++) {
    for (let j = i + 1; j < DEPARTMENTS.length; j++) {
      const a = DEPARTMENTS[i].id;
      const b = DEPARTMENTS[j].id;
      const aToB = flowValue(flows, a, b);
      const bToA = flowValue(flows, b, a);
      pairs.push({ a, b, aToB, bToA, combined: aToB + bToA });
    }
  }
  return pairs;
}

export function busiestPair(flows: Flow[]): PairInfo {
  const pairs = allPairs(flows);
  return pairs.reduce((max, p) => (p.combined > max.combined ? p : max), pairs[0]);
}

export function pairKey(a: string, b: string): string {
  return a < b ? `${a}|${b}` : `${b}|${a}`;
}

// ---------------------------------------------------------------------------
// Agents (feed assignees) — one neutral avatar tone for every agent, by
// design: the single accent hue is reserved for interactive/brand chrome, not
// spent on a rainbow of people-avatars.
// ---------------------------------------------------------------------------

export type Agent = { id: string; name: string; initials: string };

export const ASSIGNEES: Agent[] = [
  { id: "a1", name: "Marcus Webb", initials: "MW" },
  { id: "a2", name: "Elena Ruiz", initials: "ER" },
  { id: "a3", name: "Noah Kim", initials: "NK" },
  { id: "a4", name: "Sofia Andersson", initials: "SA" },
  { id: "a5", name: "Deepak Varma", initials: "DV" },
  { id: "a6", name: "Harper Lin", initials: "HL" },
];

export const ASSIGNEE_BY_ID: Record<string, Agent> = Object.fromEntries(ASSIGNEES.map((a) => [a.id, a]));

// ---------------------------------------------------------------------------
// Routing feed — the page's primary content: a fixed, deterministic list of
// individual handoff events (independent of the week/month period toggle,
// which governs the aggregate chord + matrix only).
// ---------------------------------------------------------------------------

export type Priority = "urgent" | "high" | "normal";

export type FeedEvent = {
  id: string;
  ticketId: string;
  fromId: string;
  toId: string;
  agentId: string;
  priority: Priority;
  ageMinutes: number;
  note: string;
};

export const FEED_EVENTS: FeedEvent[] = [
  { id: "f1", ticketId: "TKT-48213", fromId: "t1-support", toId: "billing", agentId: "a2", priority: "urgent", ageMinutes: 4, note: "Duplicate charge dispute, customer threatening a chargeback" },
  { id: "f2", ticketId: "TKT-48209", fromId: "customer-success", toId: "t1-support", agentId: "a5", priority: "high", ageMinutes: 11, note: "Renewal blocked by an unresolved login issue" },
  { id: "f3", ticketId: "TKT-48202", fromId: "t1-support", toId: "customer-success", agentId: "a1", priority: "normal", ageMinutes: 19, note: "Upsell interest flagged, routed to the account team" },
  { id: "f4", ticketId: "TKT-48195", fromId: "sales", toId: "billing", agentId: "a3", priority: "high", ageMinutes: 26, note: "Contract discount missing from the first invoice" },
  { id: "f5", ticketId: "TKT-48188", fromId: "billing", toId: "t1-support", agentId: "a2", priority: "normal", ageMinutes: 34, note: "Refund issued, customer needs the confirmation steps" },
  { id: "f6", ticketId: "TKT-48180", fromId: "t1-support", toId: "platform-eng", agentId: "a4", priority: "urgent", ageMinutes: 42, note: "Webhook delivery failing for an Enterprise-tier account" },
  { id: "f7", ticketId: "TKT-48176", fromId: "platform-eng", toId: "t1-support", agentId: "a6", priority: "normal", ageMinutes: 55, note: "Fix shipped, ready to close out with the customer" },
  { id: "f8", ticketId: "TKT-48169", fromId: "trust-safety", toId: "t1-support", agentId: "a1", priority: "high", ageMinutes: 63, note: "Account cleared review, the hold can be lifted" },
  { id: "f9", ticketId: "TKT-48161", fromId: "t1-support", toId: "trust-safety", agentId: "a3", priority: "urgent", ageMinutes: 78, note: "Suspicious login pattern flagged by the agent" },
  { id: "f10", ticketId: "TKT-48154", fromId: "customer-success", toId: "sales", agentId: "a5", priority: "normal", ageMinutes: 94, note: "Expansion opportunity identified during the QBR" },
  { id: "f11", ticketId: "TKT-48148", fromId: "sales", toId: "t1-support", agentId: "a4", priority: "high", ageMinutes: 112, note: "New enterprise account needs an onboarding handoff" },
  { id: "f12", ticketId: "TKT-48139", fromId: "billing", toId: "customer-success", agentId: "a6", priority: "normal", ageMinutes: 131, note: "Dunning sequence paused, success team to follow up" },
];

// ---------------------------------------------------------------------------
// Notifications (top bar bell) — fixed, deterministic.
// ---------------------------------------------------------------------------

export const SLA_ALERTS: { id: string; message: string }[] = [
  { id: "n1", message: "TKT-48213 has sat with Billing for 4 minutes past its urgent SLA warning" },
  { id: "n2", message: "TKT-48180 webhook escalation is unassigned in Platform Eng" },
];
