// Static, deterministic dummy data for the Northbound renewal-ranking dashboard.
// No Math.random, no Date.now, no `new Date()` anywhere — every date is a plain ISO string and
// every sort/compare works off that string or off numbers already in this file.

export type HealthStatus = "Healthy" | "At Risk" | "Critical";
export type Segment = "Enterprise" | "Mid-Market" | "SMB";
export type MetricKey = "arrAtRisk" | "healthScore" | "nrr";
export type TaskStatus = "Open" | "Blocked" | "Done";
export type TaskPriority = "High" | "Medium" | "Low";

export interface MetricPair {
  current: number;
  previous: number;
}

export interface Stakeholder {
  name: string;
  role: string;
}

export interface Account {
  id: string;
  name: string;
  segment: Segment;
  health: HealthStatus;
  csm: string;
  csmInitials: string;
  renewalDate: string; // ISO yyyy-mm-dd
  contractTermMonths: number;
  metrics: Record<MetricKey, MetricPair>;
  stakeholders: Stakeholder[];
  checklist: boolean[]; // aligned with CHECKLIST_LABELS, length 5
  usageTrend: number[]; // 8 points, 0-100 index, aligned with TREND_MONTHS
  nextStep: string;
}

export const CHECKLIST_LABELS = [
  "Executive business review completed",
  "Usage & ROI report shared with stakeholders",
  "Multi-year pricing proposal sent",
  "Legal redlines resolved",
  "Renewal order form signed",
] as const;

export const TREND_MONTHS = ["Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"] as const;

export const METRICS: Record<MetricKey, { label: string; shortLabel: string; format: "currency" | "score" | "percent" }> = {
  arrAtRisk: { label: "ARR at Risk", shortLabel: "ARR at Risk", format: "currency" },
  healthScore: { label: "Health Score", shortLabel: "Health Score", format: "score" },
  nrr: { label: "Net Revenue Retention", shortLabel: "NRR", format: "percent" },
};

export const ACCOUNTS: Account[] = [
  {
    id: "brightline",
    name: "Brightline Logistics",
    segment: "Enterprise",
    health: "At Risk",
    csm: "Dana Okafor",
    csmInitials: "DO",
    renewalDate: "2026-11-18",
    contractTermMonths: 24,
    metrics: {
      arrAtRisk: { current: 210000, previous: 150000 },
      healthScore: { current: 54, previous: 61 },
      nrr: { current: 0.88, previous: 0.95 },
    },
    stakeholders: [
      { name: "Alicia Ferreira", role: "VP Operations" },
      { name: "Owen Castillo", role: "Director of Procurement" },
    ],
    checklist: [true, true, false, false, false],
    usageTrend: [71, 69, 66, 64, 60, 58, 56, 54],
    nextStep: "Escalated to exec sponsor after usage dip in October; EBR requested for early November.",
  },
  {
    id: "vertex",
    name: "Vertex Robotics",
    segment: "Enterprise",
    health: "Critical",
    csm: "Marcus Chen",
    csmInitials: "MC",
    renewalDate: "2026-11-02",
    contractTermMonths: 12,
    metrics: {
      arrAtRisk: { current: 198000, previous: 205000 },
      healthScore: { current: 31, previous: 42 },
      nrr: { current: 0.74, previous: 0.81 },
    },
    stakeholders: [
      { name: "Marta Lindqvist", role: "Chief of Staff" },
      { name: "Derek Haas", role: "Head of Platform Engineering" },
    ],
    checklist: [true, false, false, false, false],
    usageTrend: [52, 48, 44, 40, 37, 34, 32, 31],
    nextStep: "Champion departed last month; rebuilding relationship with the new VP of Engineering.",
  },
  {
    id: "harpoon",
    name: "Harpoon Analytics",
    segment: "Mid-Market",
    health: "Critical",
    csm: "Jordan Blake",
    csmInitials: "JB",
    renewalDate: "2026-11-09",
    contractTermMonths: 12,
    metrics: {
      arrAtRisk: { current: 174000, previous: 140000 },
      healthScore: { current: 38, previous: 50 },
      nrr: { current: 0.79, previous: 0.86 },
    },
    stakeholders: [
      { name: "Noor Haddad", role: "Head of Data" },
      { name: "Felix Moreau", role: "Director of Procurement" },
    ],
    checklist: [false, false, false, false, false],
    usageTrend: [58, 53, 48, 44, 41, 39, 38, 38],
    nextStep: "Critical support ticket backlog driving dissatisfaction; CS escalation in progress.",
  },
  {
    id: "fjord",
    name: "Fjord Capital Partners",
    segment: "Mid-Market",
    health: "At Risk",
    csm: "Elena Vukovic",
    csmInitials: "EV",
    renewalDate: "2026-12-05",
    contractTermMonths: 12,
    metrics: {
      arrAtRisk: { current: 156000, previous: 120000 },
      healthScore: { current: 58, previous: 55 },
      nrr: { current: 0.91, previous: 0.9 },
    },
    stakeholders: [
      { name: "Ingrid Solberg", role: "COO" },
      { name: "Caleb Mwangi", role: "Head of Vendor Management" },
    ],
    checklist: [true, true, false, false, false],
    usageTrend: [60, 59, 58, 57, 58, 59, 58, 58],
    nextStep: "Budget freeze flagged by finance; proposing a phased renewal to ease approval.",
  },
  {
    id: "quillandoak",
    name: "Quill & Oak Media",
    segment: "Mid-Market",
    health: "Critical",
    csm: "Jordan Blake",
    csmInitials: "JB",
    renewalDate: "2026-11-14",
    contractTermMonths: 24,
    metrics: {
      arrAtRisk: { current: 147000, previous: 98000 },
      healthScore: { current: 29, previous: 44 },
      nrr: { current: 0.71, previous: 0.83 },
    },
    stakeholders: [
      { name: "Ethan Marsh", role: "VP Content" },
      { name: "Priyanka Nair", role: "Director of IT" },
    ],
    checklist: [false, false, false, false, false],
    usageTrend: [46, 42, 38, 35, 33, 31, 30, 29],
    nextStep: "Adoption stalled after reorg; new admin onboarding scheduled this week.",
  },
  {
    id: "meridian",
    name: "Meridian Freight Co.",
    segment: "Mid-Market",
    health: "At Risk",
    csm: "Dana Okafor",
    csmInitials: "DO",
    renewalDate: "2026-12-20",
    contractTermMonths: 24,
    metrics: {
      arrAtRisk: { current: 132000, previous: 132000 },
      healthScore: { current: 62, previous: 62 },
      nrr: { current: 0.95, previous: 0.95 },
    },
    stakeholders: [
      { name: "Paula Ibarra", role: "VP Operations" },
      { name: "Tobias Lindgren", role: "Head of IT" },
    ],
    checklist: [true, false, false, false, false],
    usageTrend: [63, 63, 62, 62, 63, 62, 62, 62],
    nextStep: "Stakeholder unresponsive for three weeks; attempting outreach via a secondary contact.",
  },
  {
    id: "anchorpoint",
    name: "Anchorpoint Legal",
    segment: "SMB",
    health: "At Risk",
    csm: "Marcus Chen",
    csmInitials: "MC",
    renewalDate: "2026-11-27",
    contractTermMonths: 12,
    metrics: {
      arrAtRisk: { current: 64000, previous: 50000 },
      healthScore: { current: 57, previous: 60 },
      nrr: { current: 0.89, previous: 0.92 },
    },
    stakeholders: [
      { name: "Julia Keenan", role: "Managing Partner" },
      { name: "Theo Nakamura", role: "Director of IT" },
    ],
    checklist: [true, true, false, false, false],
    usageTrend: [63, 62, 60, 59, 58, 57, 57, 57],
    nextStep: "Pricing objection raised; discount proposal is under internal review.",
  },
  {
    id: "cobalt",
    name: "Cobalt Health Systems",
    segment: "Enterprise",
    health: "Healthy",
    csm: "Priya Raman",
    csmInitials: "PR",
    renewalDate: "2027-02-14",
    contractTermMonths: 36,
    metrics: {
      arrAtRisk: { current: 42000, previous: 58000 },
      healthScore: { current: 92, previous: 89 },
      nrr: { current: 1.18, previous: 1.12 },
    },
    stakeholders: [
      { name: "Renee Okonkwo", role: "VP Finance" },
      { name: "Simon Patel", role: "Director of IT" },
    ],
    checklist: [true, true, true, true, false],
    usageTrend: [84, 85, 87, 88, 89, 90, 91, 92],
    nextStep: "Expansion conversation underway for two additional seats next term.",
  },
  {
    id: "nimbus",
    name: "Nimbus Cloud Systems",
    segment: "Enterprise",
    health: "Healthy",
    csm: "Sam Whitfield",
    csmInitials: "SW",
    renewalDate: "2027-01-22",
    contractTermMonths: 24,
    metrics: {
      arrAtRisk: { current: 35000, previous: 30000 },
      healthScore: { current: 88, previous: 90 },
      nrr: { current: 1.24, previous: 1.2 },
    },
    stakeholders: [
      { name: "Hana Suzuki", role: "VP Product" },
      { name: "Wyatt Brennan", role: "Director of IT" },
    ],
    checklist: [true, true, true, true, true],
    usageTrend: [82, 83, 84, 85, 86, 87, 88, 88],
    nextStep: "On track; multi-year proposal already countersigned pending final signature.",
  },
  {
    id: "lumen",
    name: "Lumen Biosciences",
    segment: "Enterprise",
    health: "Healthy",
    csm: "Priya Raman",
    csmInitials: "PR",
    renewalDate: "2027-03-11",
    contractTermMonths: 36,
    metrics: {
      arrAtRisk: { current: 28000, previous: 41000 },
      healthScore: { current: 95, previous: 93 },
      nrr: { current: 1.28, previous: 1.22 },
    },
    stakeholders: [
      { name: "Grace Adeyemi", role: "Chief of Staff" },
      { name: "Marcus Webb", role: "VP Research Operations" },
    ],
    checklist: [true, true, true, true, true],
    usageTrend: [88, 89, 90, 92, 93, 94, 95, 95],
    nextStep: "Strong advocate account; requested as a reference for an upcoming case study.",
  },
  {
    id: "tidepool",
    name: "Tidepool Learning",
    segment: "SMB",
    health: "Healthy",
    csm: "Elena Vukovic",
    csmInitials: "EV",
    renewalDate: "2027-02-28",
    contractTermMonths: 12,
    metrics: {
      arrAtRisk: { current: 23000, previous: 19000 },
      healthScore: { current: 90, previous: 86 },
      nrr: { current: 1.15, previous: 1.09 },
    },
    stakeholders: [
      { name: "Sofia Delgado", role: "Head of Programs" },
      { name: "Noah Fischer", role: "Director of Finance" },
    ],
    checklist: [true, true, true, true, false],
    usageTrend: [83, 84, 85, 86, 87, 88, 89, 90],
    nextStep: "Positive NPS response; upsell opportunity for the analytics add-on identified.",
  },
  {
    id: "slateandpine",
    name: "Slate & Pine Retail",
    segment: "SMB",
    health: "Healthy",
    csm: "Sam Whitfield",
    csmInitials: "SW",
    renewalDate: "2027-01-05",
    contractTermMonths: 12,
    metrics: {
      arrAtRisk: { current: 19000, previous: 22000 },
      healthScore: { current: 84, previous: 80 },
      nrr: { current: 1.07, previous: 1.03 },
    },
    stakeholders: [
      { name: "Bianca Rossi", role: "Head of Operations" },
      { name: "Liam O'Connor", role: "Finance Lead" },
    ],
    checklist: [true, true, true, false, false],
    usageTrend: [78, 79, 80, 81, 82, 83, 84, 84],
    nextStep: "Seasonal usage dip expected; historically rebounds ahead of renewal.",
  },
];

export function getAccountName(id: string): string {
  return ACCOUNTS.find((a) => a.id === id)?.name ?? "Unknown account";
}

export interface RenewalTask {
  id: string;
  title: string;
  accountId: string;
  owner: string;
  ownerInitials: string;
  dueDate: string; // ISO yyyy-mm-dd, sortable as a plain string
  status: TaskStatus;
  priority: TaskPriority;
}

export const TASKS: RenewalTask[] = [
  {
    id: "t1",
    title: "Send multi-year pricing proposal",
    accountId: "brightline",
    owner: "Dana Okafor",
    ownerInitials: "DO",
    dueDate: "2026-10-28",
    status: "Open",
    priority: "High",
  },
  {
    id: "t2",
    title: "Schedule executive business review",
    accountId: "vertex",
    owner: "Marcus Chen",
    ownerInitials: "MC",
    dueDate: "2026-10-24",
    status: "Blocked",
    priority: "High",
  },
  {
    id: "t3",
    title: "Share Q3 usage & ROI report",
    accountId: "fjord",
    owner: "Elena Vukovic",
    ownerInitials: "EV",
    dueDate: "2026-10-30",
    status: "Open",
    priority: "Medium",
  },
  {
    id: "t4",
    title: "Resolve legal redlines on DPA",
    accountId: "harpoon",
    owner: "Jordan Blake",
    ownerInitials: "JB",
    dueDate: "2026-11-02",
    status: "Blocked",
    priority: "High",
  },
  {
    id: "t5",
    title: "Confirm renewal order form signer",
    accountId: "cobalt",
    owner: "Priya Raman",
    ownerInitials: "PR",
    dueDate: "2026-11-10",
    status: "Open",
    priority: "Low",
  },
  {
    id: "t6",
    title: "Prepare expansion seat quote",
    accountId: "nimbus",
    owner: "Sam Whitfield",
    ownerInitials: "SW",
    dueDate: "2026-11-05",
    status: "Done",
    priority: "Medium",
  },
  {
    id: "t7",
    title: "Escalate support backlog to engineering",
    accountId: "quillandoak",
    owner: "Jordan Blake",
    ownerInitials: "JB",
    dueDate: "2026-10-25",
    status: "Open",
    priority: "High",
  },
  {
    id: "t8",
    title: "Follow up with unresponsive stakeholder",
    accountId: "meridian",
    owner: "Dana Okafor",
    ownerInitials: "DO",
    dueDate: "2026-10-27",
    status: "Open",
    priority: "Medium",
  },
  {
    id: "t9",
    title: "Draft discount proposal for finance",
    accountId: "anchorpoint",
    owner: "Marcus Chen",
    ownerInitials: "MC",
    dueDate: "2026-11-01",
    status: "Open",
    priority: "Medium",
  },
  {
    id: "t10",
    title: "Collect signed order form",
    accountId: "lumen",
    owner: "Priya Raman",
    ownerInitials: "PR",
    dueDate: "2026-10-22",
    status: "Done",
    priority: "Low",
  },
];

/** Rank (1 = highest value) of every account for a given metric + period, computed from the data
 * itself so a rank-change delta can never drift from the values it is derived from. */
export function rankAccounts(metric: MetricKey, period: "current" | "previous"): Map<string, number> {
  const sorted = [...ACCOUNTS].sort((a, b) => b.metrics[metric][period] - a.metrics[metric][period]);
  const ranks = new Map<string, number>();
  sorted.forEach((account, index) => ranks.set(account.id, index + 1));
  return ranks;
}
