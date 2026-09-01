// Deterministic dummy data for the Harborline support case console.
// No Math.random / Date.now / bare `new Date()` anywhere in this module.

export type CaseStatus = "open" | "pending" | "resolved";
export type CasePriority = "urgent" | "high" | "normal" | "low";
export type Channel = "email" | "chat" | "phone";
export type SlaState = "on-track" | "at-risk" | "breached" | "met" | "missed";
export type Health = "good" | "watch" | "at-risk";
export type Plan = "Starter" | "Growth" | "Scale";
export type Period = "7d" | "30d" | "90d";

export interface Agent {
  id: string;
  name: string;
  initials: string;
  photoId: string; // unsplash photo id, fixed
}

export interface Customer {
  company: string;
  plan: Plan;
  mrr: number;
  seats: number;
  sinceYear: number;
  health: Health;
  phone: string;
}

export interface TimelineEvent {
  id: string;
  role: "customer" | "agent" | "system";
  actor: string;
  time: string;
  body: string;
}

export interface NoteEntry {
  id: string;
  author: string;
  time: string;
  body: string;
}

export interface ActivityEntry {
  id: string;
  time: string;
  body: string;
}

export interface SlaPoint {
  label: string;
  value: number;
}

export interface SupportCase {
  id: string;
  subject: string;
  requester: { name: string; email: string; company: string };
  status: CaseStatus;
  priority: CasePriority;
  channel: Channel;
  assignee: Agent;
  ageHours: number;
  firstResponseMinutes: number;
  avgResponseMinutes: number;
  targetResponseMinutes: number;
  slaState: SlaState;
  slaDueMinutes: number | null; // minutes remaining (negative if overdue); null once resolved
  customer: Customer;
  timeline: TimelineEvent[];
  notes: NoteEntry[];
  activity: ActivityEntry[];
  sla: Record<Period, SlaPoint[]>;
}

export const round2 = (n: number) => Math.round(n * 100) / 100;

export function formatAge(hours: number): string {
  if (hours < 24) return `${hours}h`;
  const d = Math.floor(hours / 24);
  const h = hours % 24;
  return h === 0 ? `${d}d` : `${d}d ${h}h`;
}

export function formatMinutes(min: number): string {
  const sign = min < 0 ? "-" : "";
  const abs = Math.abs(min);
  if (abs < 60) return `${sign}${abs}m`;
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  return m === 0 ? `${sign}${h}h` : `${sign}${h}h ${m}m`;
}

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
export const formatMrr = (n: number) => currency.format(n);

// -- agents -----------------------------------------------------------------

const AGENTS: Record<string, Agent> = {
  priya: { id: "priya", name: "Priya Nandan", initials: "PN", photoId: "1544005313-94ddf0286df2" },
  marcus: { id: "marcus", name: "Marcus Doyle", initials: "MD", photoId: "1472099645785-5658abf4ff4e" },
  sana: { id: "sana", name: "Sana Iqbal", initials: "SI", photoId: "1494790108377-be9c29b29330" },
};

// -- deterministic SLA series generator --------------------------------------
// value(i) = round(base + amplitude*sin((i+seed)*step) - drift*i), clamped to [floor, cap]
function makeSeries(seed: number, base: number, amplitude: number, step: number, drift: number, count: number, labels: string[]): SlaPoint[] {
  const out: SlaPoint[] = [];
  for (let i = 0; i < count; i++) {
    const raw = base + amplitude * Math.sin((i + seed) * step) - drift * i;
    const value = Math.max(14, Math.round(raw));
    out.push({ label: labels[i], value });
  }
  return out;
}

function buildSla(seed: number, base: number): Record<Period, SlaPoint[]> {
  return {
    "7d": makeSeries(seed, base, base * 0.22, 0.9, -0.4, 7, ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]),
    "30d": makeSeries(seed + 3, base * 1.05, base * 0.28, 0.7, 0.6, 6, ["W1", "W2", "W3", "W4", "W5", "W6"]),
    "90d": makeSeries(seed + 6, base * 1.1, base * 0.32, 0.55, 1.1, 6, ["Apr", "May", "Jun", "Jul", "Aug", "Sep"]),
  };
}

// -- cases --------------------------------------------------------------------

export const CASES: SupportCase[] = [
  {
    id: "CS-4127",
    subject: "Checkout API returning 500 on payment retries",
    requester: { name: "Elena Marsh", email: "elena.marsh@northwindretail.com", company: "Northwind Retail" },
    status: "open",
    priority: "urgent",
    channel: "chat",
    assignee: AGENTS.priya,
    ageHours: 2,
    firstResponseMinutes: 8,
    avgResponseMinutes: 11,
    targetResponseMinutes: 30,
    slaState: "at-risk",
    slaDueMinutes: 18,
    customer: { company: "Northwind Retail", plan: "Scale", mrr: 4200, seats: 48, sinceYear: 2022, health: "at-risk", phone: "+1 415-555-0148" },
    timeline: [
      { id: "t1", role: "system", actor: "Harborline", time: "2h ago", body: "Case opened from live chat, routed to Payments queue." },
      { id: "t2", role: "customer", actor: "Elena Marsh", time: "2h ago", body: "Every third checkout retry throws a 500 after the card is declined once. Blocking our flash-sale traffic right now." },
      { id: "t3", role: "agent", actor: "Priya Nandan", time: "1h ago", body: "Confirmed in staging — the idempotency key isn't rotating on retry. Filed ENG-2291, pushing a hotfix to the gateway." },
      { id: "t4", role: "agent", actor: "Priya Nandan", time: "22m ago", body: "Hotfix is in canary on 8% of traffic. Watching error rate before full rollout." },
    ],
    notes: [
      { id: "n1", author: "Priya Nandan", time: "1h ago", body: "Customer is mid flash-sale — treat as P1 until canary confirms fixed." },
    ],
    activity: [
      { id: "a1", time: "2h ago", body: "Priority set to Urgent by Priya Nandan" },
      { id: "a2", time: "1h ago", body: "Linked to ENG-2291" },
    ],
    sla: buildSla(1, 34),
  },
  {
    id: "CS-4118",
    subject: "Unable to export invoices to CSV",
    requester: { name: "Tomas Riel", email: "tomas.riel@fjordlogistics.com", company: "Fjord Logistics" },
    status: "pending",
    priority: "high",
    channel: "email",
    assignee: AGENTS.marcus,
    ageHours: 6,
    firstResponseMinutes: 22,
    avgResponseMinutes: 34,
    targetResponseMinutes: 60,
    slaState: "on-track",
    slaDueMinutes: 96,
    customer: { company: "Fjord Logistics", plan: "Growth", mrr: 1800, seats: 22, sinceYear: 2023, health: "good", phone: "+45 32-55-0117" },
    timeline: [
      { id: "t1", role: "system", actor: "Harborline", time: "6h ago", body: "Case opened by email, auto-tagged Billing / Export." },
      { id: "t2", role: "customer", actor: "Tomas Riel", time: "6h ago", body: "The CSV export on the invoices page just spins forever, no download and no error." },
      { id: "t3", role: "agent", actor: "Marcus Doyle", time: "4h ago", body: "Reproduced — exports over 500 rows are timing out. Asked the platform team to raise the job limit." },
      { id: "t4", role: "system", actor: "Harborline", time: "3h ago", body: "Waiting on customer: asked Tomas to confirm approximate row count on his side." },
    ],
    notes: [
      { id: "n1", author: "Marcus Doyle", time: "4h ago", body: "Likely affects any account over ~500 invoice rows — worth a proactive sweep once fixed." },
    ],
    activity: [
      { id: "a1", time: "6h ago", body: "Auto-tagged Billing / Export" },
      { id: "a2", time: "3h ago", body: "Status changed: Open → Pending customer" },
    ],
    sla: buildSla(2, 41),
  },
  {
    id: "CS-4103",
    subject: "SAML SSO login loop after IdP certificate rotation",
    requester: { name: "Grace Han", email: "grace.han@bellwetherhealth.com", company: "Bellwether Health" },
    status: "open",
    priority: "urgent",
    channel: "email",
    assignee: AGENTS.priya,
    ageHours: 11,
    firstResponseMinutes: 14,
    avgResponseMinutes: 19,
    targetResponseMinutes: 30,
    slaState: "breached",
    slaDueMinutes: -26,
    customer: { company: "Bellwether Health", plan: "Scale", mrr: 5600, seats: 65, sinceYear: 2021, health: "at-risk", phone: "+1 617-555-0102" },
    timeline: [
      { id: "t1", role: "system", actor: "Harborline", time: "11h ago", body: "Case opened by email, escalated automatically (Scale plan, SSO tag)." },
      { id: "t2", role: "customer", actor: "Grace Han", time: "11h ago", body: "Nobody can log in since we rotated our IdP cert this morning — it just loops back to the login screen." },
      { id: "t3", role: "agent", actor: "Priya Nandan", time: "9h ago", body: "Your side is posting the new cert fingerprint but our SP metadata still has the old one cached." },
      { id: "t4", role: "agent", actor: "Priya Nandan", time: "40m ago", body: "Metadata cache force-refreshed. Can your admin re-test a login now?" },
    ],
    notes: [
      { id: "n1", author: "Priya Nandan", time: "9h ago", body: "SLA breached at 30m target — Scale plan, needs a CS follow-up call regardless of fix time." },
    ],
    activity: [
      { id: "a1", time: "11h ago", body: "Escalated automatically: Scale plan + SSO tag" },
      { id: "a2", time: "9h ago", body: "SLA breached (target 30m)" },
    ],
    sla: buildSla(3, 27),
  },
  {
    id: "CS-4098",
    subject: "Question about seat-based billing proration",
    requester: { name: "Owen Blake", email: "owen.blake@cartwrightco.com", company: "Cartwright & Co" },
    status: "pending",
    priority: "normal",
    channel: "chat",
    assignee: AGENTS.sana,
    ageHours: 25,
    firstResponseMinutes: 58,
    avgResponseMinutes: 63,
    targetResponseMinutes: 120,
    slaState: "on-track",
    slaDueMinutes: 210,
    customer: { company: "Cartwright & Co", plan: "Starter", mrr: 490, seats: 6, sinceYear: 2024, health: "good", phone: "+1 312-555-0166" },
    timeline: [
      { id: "t1", role: "system", actor: "Harborline", time: "1d ago", body: "Case opened from live chat, routed to Billing queue." },
      { id: "t2", role: "customer", actor: "Owen Blake", time: "1d ago", body: "If we add 3 seats mid-cycle, are we billed the full month or a prorated amount?" },
      { id: "t3", role: "agent", actor: "Sana Iqbal", time: "22h ago", body: "Prorated to the day — added seats bill for the remaining days in the current cycle only." },
    ],
    notes: [],
    activity: [
      { id: "a1", time: "1d ago", body: "Assigned to Sana Iqbal" },
    ],
    sla: buildSla(4, 74),
  },
  {
    id: "CS-4085",
    subject: "Webhook delivery delayed beyond alerting SLA",
    requester: { name: "Lina Cho", email: "lina.cho@cobaltfreight.com", company: "Cobalt Freight" },
    status: "open",
    priority: "high",
    channel: "email",
    assignee: AGENTS.marcus,
    ageHours: 28,
    firstResponseMinutes: 31,
    avgResponseMinutes: 40,
    targetResponseMinutes: 60,
    slaState: "at-risk",
    slaDueMinutes: 9,
    customer: { company: "Cobalt Freight", plan: "Growth", mrr: 2100, seats: 28, sinceYear: 2023, health: "watch", phone: "+1 206-555-0139" },
    timeline: [
      { id: "t1", role: "system", actor: "Harborline", time: "1d 4h ago", body: "Case opened by email, tagged Webhooks / Delivery." },
      { id: "t2", role: "customer", actor: "Lina Cho", time: "1d 4h ago", body: "shipment.updated events are arriving 20+ minutes late — our dispatch board depends on these being near-real-time." },
      { id: "t3", role: "agent", actor: "Marcus Doyle", time: "1d ago", body: "Queue backlog confirmed on our delivery worker for your webhook endpoint specifically. Scaling workers now." },
      { id: "t4", role: "agent", actor: "Marcus Doyle", time: "3h ago", body: "Backlog cleared, delivery lag back under 30s. Keeping an eye on it for the next few hours." },
    ],
    notes: [
      { id: "n1", author: "Marcus Doyle", time: "1d ago", body: "Consider raising this endpoint's worker concurrency limit as a permanent fix, not just a scale-up." },
    ],
    activity: [
      { id: "a1", time: "1d 4h ago", body: "Tagged Webhooks / Delivery" },
      { id: "a2", time: "3h ago", body: "SLA state: Breached → At risk" },
    ],
    sla: buildSla(5, 52),
  },
  {
    id: "CS-4071",
    subject: "Feature request: bulk tag editing across cases",
    requester: { name: "Devon Ashworth", email: "devon.ashworth@stonegatemedia.com", company: "Stonegate Media" },
    status: "resolved",
    priority: "low",
    channel: "chat",
    assignee: AGENTS.sana,
    ageHours: 50,
    firstResponseMinutes: 90,
    avgResponseMinutes: 95,
    targetResponseMinutes: 240,
    slaState: "met",
    slaDueMinutes: null,
    customer: { company: "Stonegate Media", plan: "Starter", mrr: 640, seats: 8, sinceYear: 2024, health: "good", phone: "+1 512-555-0184" },
    timeline: [
      { id: "t1", role: "system", actor: "Harborline", time: "2d 2h ago", body: "Case opened from live chat, tagged Feature request." },
      { id: "t2", role: "customer", actor: "Devon Ashworth", time: "2d 2h ago", body: "Could we get a way to tag 10+ cases at once instead of one at a time?" },
      { id: "t3", role: "agent", actor: "Sana Iqbal", time: "2d ago", body: "Logged as PROD-618 for the roadmap team — closing this case and will follow up if it ships." },
      { id: "t4", role: "system", actor: "Harborline", time: "2d ago", body: "Status changed: Open → Resolved." },
    ],
    notes: [],
    activity: [
      { id: "a1", time: "2d ago", body: "Logged as PROD-618" },
      { id: "a2", time: "2d ago", body: "Status changed: Open → Resolved" },
    ],
    sla: buildSla(6, 88),
  },
  {
    id: "CS-4066",
    subject: "Duplicate charge on annual invoice",
    requester: { name: "Marta Vidal", email: "marta.vidal@bellwetherhealth.com", company: "Bellwether Health" },
    status: "resolved",
    priority: "high",
    channel: "email",
    assignee: AGENTS.priya,
    ageHours: 76,
    firstResponseMinutes: 26,
    avgResponseMinutes: 30,
    targetResponseMinutes: 60,
    slaState: "met",
    slaDueMinutes: null,
    customer: { company: "Bellwether Health", plan: "Scale", mrr: 5600, seats: 65, sinceYear: 2021, health: "at-risk", phone: "+1 617-555-0102" },
    timeline: [
      { id: "t1", role: "system", actor: "Harborline", time: "3d 4h ago", body: "Case opened by email, tagged Billing / Invoice." },
      { id: "t2", role: "customer", actor: "Marta Vidal", time: "3d 4h ago", body: "Our annual renewal was charged twice on the same card, two days apart." },
      { id: "t3", role: "agent", actor: "Priya Nandan", time: "3d 2h ago", body: "Confirmed a duplicate charge from a retried webhook. Refund issued for the second charge, should post in 3-5 days." },
      { id: "t4", role: "system", actor: "Harborline", time: "3d ago", body: "Status changed: Open → Resolved." },
    ],
    notes: [
      { id: "n1", author: "Priya Nandan", time: "3d 2h ago", body: "Same double-charge pattern as CS-3980 — worth checking the retry webhook fix landed everywhere." },
    ],
    activity: [
      { id: "a1", time: "3d 2h ago", body: "Refund issued: $1,950.00" },
      { id: "a2", time: "3d ago", body: "Status changed: Open → Resolved" },
    ],
    sla: buildSla(7, 44),
  },
  {
    id: "CS-4050",
    subject: "API rate limit lowered without notice",
    requester: { name: "Felix Ngata", email: "felix.ngata@anchorfieldco.com", company: "Anchorfield & Co" },
    status: "pending",
    priority: "normal",
    channel: "chat",
    assignee: AGENTS.marcus,
    ageHours: 100,
    firstResponseMinutes: 47,
    avgResponseMinutes: 52,
    targetResponseMinutes: 120,
    slaState: "on-track",
    slaDueMinutes: 340,
    customer: { company: "Anchorfield & Co", plan: "Starter", mrr: 520, seats: 7, sinceYear: 2025, health: "watch", phone: "+1 720-555-0177" },
    timeline: [
      { id: "t1", role: "system", actor: "Harborline", time: "4d 4h ago", body: "Case opened from live chat, tagged API / Rate limits." },
      { id: "t2", role: "customer", actor: "Felix Ngata", time: "4d 4h ago", body: "We're getting 429s at a much lower request volume than last month — did our plan limit change?" },
      { id: "t3", role: "agent", actor: "Marcus Doyle", time: "4d 2h ago", body: "Checking with billing whether the Starter tier limit was adjusted recently — will confirm shortly." },
    ],
    notes: [
      { id: "n1", author: "Marcus Doyle", time: "4d 2h ago", body: "If limit did change, this is a good upsell moment toward Growth tier." },
    ],
    activity: [
      { id: "a1", time: "4d 4h ago", body: "Tagged API / Rate limits" },
    ],
    sla: buildSla(8, 66),
  },
  {
    id: "CS-4032",
    subject: "Onboarding checklist stuck at step 3 of 5",
    requester: { name: "Ingrid Solheim", email: "ingrid.solheim@polarmetrics.com", company: "Polar Metrics" },
    status: "open",
    priority: "normal",
    channel: "email",
    assignee: AGENTS.sana,
    ageHours: 124,
    firstResponseMinutes: 64,
    avgResponseMinutes: 70,
    targetResponseMinutes: 120,
    slaState: "on-track",
    slaDueMinutes: 512,
    customer: { company: "Polar Metrics", plan: "Growth", mrr: 2300, seats: 31, sinceYear: 2023, health: "good", phone: "+47 21-05-0193" },
    timeline: [
      { id: "t1", role: "system", actor: "Harborline", time: "5d 4h ago", body: "Case opened by email, tagged Onboarding." },
      { id: "t2", role: "customer", actor: "Ingrid Solheim", time: "5d 4h ago", body: "The 'connect data source' step won't mark complete even though the connection tests fine." },
      { id: "t3", role: "agent", actor: "Sana Iqbal", time: "5d 2h ago", body: "Looks like a stale checklist cache on our end for accounts created before the June update. Working on a fix." },
    ],
    notes: [],
    activity: [
      { id: "a1", time: "5d 4h ago", body: "Tagged Onboarding" },
    ],
    sla: buildSla(9, 78),
  },
];

// -- derived, always-reconciling KPI figures ---------------------------------

export const KPI = {
  total: CASES.length,
  open: CASES.filter((c) => c.status === "open").length,
  pending: CASES.filter((c) => c.status === "pending").length,
  resolved: CASES.filter((c) => c.status === "resolved").length,
  breached: CASES.filter((c) => c.slaState === "breached" || c.slaState === "missed").length,
  avgFirstResponse: Math.round(
    CASES.reduce((sum, c) => sum + c.firstResponseMinutes, 0) / CASES.length
  ),
};

export function priorityRank(p: CasePriority): number {
  return { urgent: 0, high: 1, normal: 2, low: 3 }[p];
}

export function statusLabel(s: CaseStatus): string {
  return { open: "Open", pending: "Pending", resolved: "Resolved" }[s];
}

export function priorityLabel(p: CasePriority): string {
  return { urgent: "Urgent", high: "High", normal: "Normal", low: "Low" }[p];
}
