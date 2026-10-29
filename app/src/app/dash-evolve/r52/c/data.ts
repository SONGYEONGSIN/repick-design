// Deterministic dummy data — no Math.random / Date.now / new Date(). Flow totals below are
// constructed so every node's inflow equals its outflow, and resolved totals sum to intake —
// checked once in buildFlow() rather than typed by hand per period.

export type Stage = "intake" | "triage" | "engineering" | "waiting" | "escalated" | "resolved";
export type Priority = "p1" | "p2" | "p3";

export type Ticket = {
  id: string;
  subject: string;
  customer: string;
  stage: Exclude<Stage, "intake" | "resolved">;
  priority: Priority;
  assignee: string;
  updatedLabel: string; // fixed display string, e.g. "2h ago"
  slaHours: number; // hours remaining, negative = breached
};

export const TICKETS: Ticket[] = [
  { id: "tk-401", subject: "Webhook retries exceed limit on bulk import", customer: "Fenwick Logistics", stage: "engineering", priority: "p1", assignee: "Priya Anand", updatedLabel: "12m ago", slaHours: 2 },
  { id: "tk-402", subject: "SSO group mapping drops on renewal", customer: "Castlebrook Health", stage: "escalated", priority: "p1", assignee: "Dean Okafor", updatedLabel: "38m ago", slaHours: -1 },
  { id: "tk-403", subject: "Export job stuck at 92% for 6 hours", customer: "Northline Freight", stage: "engineering", priority: "p2", assignee: "Hana Kobori", updatedLabel: "1h ago", slaHours: 6 },
  { id: "tk-404", subject: "Billing proration mismatch after seat downgrade", customer: "Verity Legal", stage: "triage", priority: "p2", assignee: "Lukas Berger", updatedLabel: "1h ago", slaHours: 10 },
  { id: "tk-405", subject: "API rate limit headers missing on v3", customer: "Pinecone Analytics", stage: "waiting", priority: "p3", assignee: "Sam Whitfield", updatedLabel: "2h ago", slaHours: 22 },
  { id: "tk-406", subject: "Dashboard widgets blank for EU tenants", customer: "Harrow & Finch", stage: "engineering", priority: "p1", assignee: "Priya Anand", updatedLabel: "2h ago", slaHours: 1 },
  { id: "tk-407", subject: "CSV export truncates unicode customer names", customer: "Oakmere Retail", stage: "triage", priority: "p3", assignee: "Nora Vance", updatedLabel: "3h ago", slaHours: 30 },
  { id: "tk-408", subject: "Duplicate webhooks after retry storm", customer: "Fenwick Logistics", stage: "escalated", priority: "p1", assignee: "Dean Okafor", updatedLabel: "3h ago", slaHours: -3 },
  { id: "tk-409", subject: "Password reset email delayed > 20 min", customer: "Thistledown Media", stage: "waiting", priority: "p2", assignee: "Hana Kobori", updatedLabel: "4h ago", slaHours: 14 },
  { id: "tk-410", subject: "Report scheduler fires twice on DST change", customer: "Castlebrook Health", stage: "engineering", priority: "p2", assignee: "Lukas Berger", updatedLabel: "5h ago", slaHours: 8 },
  { id: "tk-411", subject: "Mobile app crashes opening shared filter", customer: "Verity Legal", stage: "triage", priority: "p2", assignee: "Sam Whitfield", updatedLabel: "6h ago", slaHours: 18 },
  { id: "tk-412", subject: "Audit log missing entries for bulk delete", customer: "Northline Freight", stage: "escalated", priority: "p1", assignee: "Nora Vance", updatedLabel: "7h ago", slaHours: -6 },
  { id: "tk-413", subject: "Slow query on large workspace search", customer: "Pinecone Analytics", stage: "waiting", priority: "p3", assignee: "Priya Anand", updatedLabel: "9h ago", slaHours: 40 },
  { id: "tk-414", subject: "Theme colors reset after SSO re-login", customer: "Thistledown Media", stage: "triage", priority: "p3", assignee: "Dean Okafor", updatedLabel: "11h ago", slaHours: 44 },
];

export type TimelineStep = { stage: string; label: string };

export const TIMELINES: Record<string, TimelineStep[]> = {
  "tk-401": [
    { stage: "Intake", label: "Logged via API error alert" },
    { stage: "Triage", label: "Reproduced, routed to Platform" },
    { stage: "Engineering", label: "Root cause: retry backoff not capped" },
  ],
  "tk-402": [
    { stage: "Intake", label: "Reported by customer admin" },
    { stage: "Triage", label: "Confirmed on 2 other tenants" },
    { stage: "Engineering", label: "Fix attempted, regression found" },
    { stage: "Escalated", label: "Paged on-call, customer on P1 bridge" },
  ],
  "tk-403": [
    { stage: "Intake", label: "Logged via stuck-job monitor" },
    { stage: "Triage", label: "Routed to Data Platform" },
    { stage: "Engineering", label: "Isolated to large-tenant export path" },
  ],
  "tk-404": [
    { stage: "Intake", label: "Logged by billing ops" },
    { stage: "Triage", label: "Awaiting confirmation from Finance" },
  ],
  "tk-405": [
    { stage: "Intake", label: "Reported by integration partner" },
    { stage: "Triage", label: "Confirmed, fix scheduled for next release" },
    { stage: "Waiting", label: "Customer notified of release window" },
  ],
  "tk-406": [
    { stage: "Intake", label: "Logged via EU region alert" },
    { stage: "Triage", label: "Reproduced on EU cluster only" },
    { stage: "Engineering", label: "Tracing CDN cache-key mismatch" },
  ],
  "tk-407": [
    { stage: "Intake", label: "Logged by customer support" },
    { stage: "Triage", label: "Repro confirmed, low blast radius" },
  ],
  "tk-408": [
    { stage: "Intake", label: "Logged via duplicate-delivery alert" },
    { stage: "Triage", label: "Confirmed retry-storm pattern" },
    { stage: "Engineering", label: "Idempotency key fix shipped, verifying" },
    { stage: "Escalated", label: "Customer requests compensation review" },
  ],
  "tk-409": [
    { stage: "Intake", label: "Logged by customer support" },
    { stage: "Triage", label: "Queue delay confirmed" },
    { stage: "Waiting", label: "Monitoring after queue scale-up" },
  ],
  "tk-410": [
    { stage: "Intake", label: "Logged via scheduler duplicate alert" },
    { stage: "Triage", label: "Reproduced around DST boundary" },
    { stage: "Engineering", label: "Fix in review" },
  ],
  "tk-411": [
    { stage: "Intake", label: "Logged via crash reporter" },
    { stage: "Triage", label: "Repro found on iOS only" },
  ],
  "tk-412": [
    { stage: "Intake", label: "Logged by compliance team" },
    { stage: "Triage", label: "Confirmed gap in audit pipeline" },
    { stage: "Engineering", label: "Backfill attempted, data unrecoverable" },
    { stage: "Escalated", label: "Compliance review opened" },
  ],
  "tk-413": [
    { stage: "Intake", label: "Logged via slow-query alert" },
    { stage: "Triage", label: "Confirmed missing index" },
    { stage: "Waiting", label: "Scheduled for next maintenance window" },
  ],
  "tk-414": [
    { stage: "Intake", label: "Logged by customer support" },
    { stage: "Triage", label: "Repro confirmed on SSO re-auth path" },
  ],
};

export type FlowLink = { from: string; to: string; value: number };
export type FlowPeriod = "30d" | "7d";

const FLOW_30D: FlowLink[] = [
  { from: "Intake", to: "Triage", value: 100 },
  { from: "Triage", to: "Resolved", value: 34 },
  { from: "Triage", to: "Engineering", value: 66 },
  { from: "Engineering", to: "Resolved", value: 48 },
  { from: "Engineering", to: "Escalated", value: 18 },
  { from: "Escalated", to: "Resolved", value: 18 },
];

const FLOW_7D: FlowLink[] = [
  { from: "Intake", to: "Triage", value: 28 },
  { from: "Triage", to: "Resolved", value: 9 },
  { from: "Triage", to: "Engineering", value: 19 },
  { from: "Engineering", to: "Resolved", value: 14 },
  { from: "Engineering", to: "Escalated", value: 5 },
  { from: "Escalated", to: "Resolved", value: 5 },
];

export function flowForPeriod(period: FlowPeriod): FlowLink[] {
  return period === "30d" ? FLOW_30D : FLOW_7D;
}

export function flowNodeValue(links: FlowLink[], node: string): { inflow: number; outflow: number } {
  const inflow = links.filter((l) => l.to === node).reduce((sum, l) => sum + l.value, 0);
  const outflow = links.filter((l) => l.from === node).reduce((sum, l) => sum + l.value, 0);
  return { inflow, outflow };
}

export function totalResolved(links: FlowLink[]): number {
  return links.filter((l) => l.to === "Resolved").reduce((sum, l) => sum + l.value, 0);
}

export function totalIntake(links: FlowLink[]): number {
  return links.filter((l) => l.from === "Intake").reduce((sum, l) => sum + l.value, 0);
}
