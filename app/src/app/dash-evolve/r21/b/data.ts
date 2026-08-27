import { FileSearch, Gauge, ListChecks, ShieldAlert, Users, type LucideIcon } from "lucide-react";
import type { CaseStatus, Severity } from "./tokens";

export const BRAND = { name: "Vantage", Icon: ShieldAlert };

export const CURRENT_USER = {
  name: "Nadia Osei",
  role: "Vendor risk analyst",
  email: "nadia.osei@vantagerisk.io",
  avatarId: "1519244703995-f4e0f30006d5",
};

export const WORKSPACES = [
  { id: "procurement", name: "Procurement risk", plan: "128 vendors" },
  { id: "infosec", name: "InfoSec review", plan: "54 vendors" },
  { id: "finance", name: "Finance diligence", plan: "31 vendors" },
];

export type NavItem = { id: string; label: string; Icon: LucideIcon; active?: boolean; disabled?: boolean };
export const NAV_SECTIONS: { id: string; title: string; items: NavItem[] }[] = [
  {
    id: "work",
    title: "Work",
    items: [
      { id: "cases", label: "Case register", Icon: FileSearch, active: true },
      { id: "vendors", label: "Vendor directory", Icon: Users },
      { id: "scoring", label: "Scoring models", Icon: Gauge },
    ],
  },
  {
    id: "insight",
    title: "Insight",
    items: [
      { id: "reports", label: "Board reports", Icon: ListChecks },
      { id: "audits", label: "Audit trail", Icon: ShieldAlert, disabled: true },
    ],
  },
];

export const RISK_AXES = ["Financial health", "Security posture", "Compliance history", "Operational resilience", "Concentration risk"] as const;
export type RiskAxis = (typeof RISK_AXES)[number];

export interface Finding {
  id: string;
  title: string;
  severity: Severity;
  status: "open" | "resolved";
  dueInDays: number;
}

export interface Milestone {
  label: string;
  date: string; // fixed ISO date, display-formatted only
  done: boolean;
}

export interface RiskCase {
  id: string;
  key: string;
  vendor: string;
  category: string;
  status: CaseStatus;
  severity: Severity;
  score: number; // 0-100, lower is riskier
  ageDays: number;
  owner: { name: string; avatarId: string };
  axes: Record<RiskAxis, number>; // 0-10 each
  findings: Finding[];
  milestones: Milestone[];
}

const O = [
  "1531123897727-8f129e1688ce",
  "1534528741775-53994a69daeb",
  "1543076447-215ad9ba6923",
  "1544005313-94ddf0286df2",
  "1547425260-76bcadfb4f2c",
  "1552664730-d307ca884978",
];

export const CASES: RiskCase[] = [
  {
    id: "c1", key: "VR-0142", vendor: "Northline Cloud", category: "Infrastructure", status: "escalated", severity: "critical", score: 38, ageDays: 6,
    owner: { name: "Owen Fen", avatarId: O[0] },
    axes: { "Financial health": 6.2, "Security posture": 2.8, "Compliance history": 4.1, "Operational resilience": 5.0, "Concentration risk": 3.4 },
    findings: [
      { id: "f1", title: "SOC 2 Type II report expired 41 days ago", severity: "critical", status: "open", dueInDays: 2 },
      { id: "f2", title: "No documented incident response plan on file", severity: "high", status: "open", dueInDays: 5 },
      { id: "f3", title: "Subprocessor list last updated 14 months ago", severity: "medium", status: "open", dueInDays: 12 },
    ],
    milestones: [
      { label: "Case opened", date: "2026-08-06", done: true },
      { label: "Initial questionnaire returned", date: "2026-08-14", done: true },
      { label: "Escalated to InfoSec", date: "2026-08-21", done: true },
      { label: "Remediation plan due", date: "2026-09-02", done: false },
    ],
  },
  {
    id: "c2", key: "VR-0139", vendor: "Halite Payments", category: "Payments", status: "review", severity: "high", score: 54, ageDays: 11,
    owner: { name: "Mira Solis", avatarId: O[1] },
    axes: { "Financial health": 7.1, "Security posture": 6.0, "Compliance history": 5.4, "Operational resilience": 4.8, "Concentration risk": 5.9 },
    findings: [
      { id: "f4", title: "PCI DSS attestation pending renewal", severity: "high", status: "open", dueInDays: 9 },
      { id: "f5", title: "Data residency clause missing EU addendum", severity: "medium", status: "open", dueInDays: 18 },
    ],
    milestones: [
      { label: "Case opened", date: "2026-08-01", done: true },
      { label: "Initial questionnaire returned", date: "2026-08-09", done: true },
      { label: "Review meeting scheduled", date: "2026-08-28", done: false },
    ],
  },
  {
    id: "c3", key: "VR-0135", vendor: "Corvus Analytics", category: "Data processing", status: "open", severity: "medium", score: 66, ageDays: 3,
    owner: { name: "Deja Cole", avatarId: O[2] },
    axes: { "Financial health": 7.8, "Security posture": 6.9, "Compliance history": 7.0, "Operational resilience": 6.2, "Concentration risk": 6.8 },
    findings: [{ id: "f6", title: "DPA amendment for sub-processor addition", severity: "low", status: "open", dueInDays: 21 }],
    milestones: [
      { label: "Case opened", date: "2026-08-24", done: true },
      { label: "Initial questionnaire due", date: "2026-08-31", done: false },
    ],
  },
  {
    id: "c4", key: "VR-0131", vendor: "Bellcastle Logistics", category: "Fulfillment", status: "review", severity: "high", score: 48, ageDays: 15,
    owner: { name: "Rio Tan", avatarId: O[3] },
    axes: { "Financial health": 4.9, "Security posture": 5.5, "Compliance history": 4.4, "Operational resilience": 3.8, "Concentration risk": 6.1 },
    findings: [
      { id: "f7", title: "Business continuity test overdue", severity: "high", status: "open", dueInDays: 4 },
      { id: "f8", title: "Insurance certificate lapses in 30 days", severity: "medium", status: "open", dueInDays: 30 },
    ],
    milestones: [
      { label: "Case opened", date: "2026-07-28", done: true },
      { label: "Site assessment completed", date: "2026-08-15", done: true },
      { label: "Findings review", date: "2026-08-29", done: false },
    ],
  },
  {
    id: "c5", key: "VR-0128", vendor: "Ledgerline Billing", category: "Finance systems", status: "open", severity: "low", score: 79, ageDays: 2,
    owner: { name: "Owen Fen", avatarId: O[0] },
    axes: { "Financial health": 8.4, "Security posture": 7.9, "Compliance history": 8.1, "Operational resilience": 7.6, "Concentration risk": 7.2 },
    findings: [],
    milestones: [{ label: "Case opened", date: "2026-08-25", done: true }],
  },
  {
    id: "c6", key: "VR-0119", vendor: "Vantage Labs CRM", category: "Sales tooling", status: "closed", severity: "low", score: 88, ageDays: 34,
    owner: { name: "Mira Solis", avatarId: O[1] },
    axes: { "Financial health": 8.9, "Security posture": 8.6, "Compliance history": 9.0, "Operational resilience": 8.2, "Concentration risk": 7.9 },
    findings: [{ id: "f9", title: "MFA enforcement confirmed org-wide", severity: "low", status: "resolved", dueInDays: 0 }],
    milestones: [
      { label: "Case opened", date: "2026-07-24", done: true },
      { label: "Remediation verified", date: "2026-08-12", done: true },
      { label: "Case closed", date: "2026-08-20", done: true },
    ],
  },
  {
    id: "c7", key: "VR-0111", vendor: "Corvus Analytics — EU node", category: "Data processing", status: "escalated", severity: "critical", score: 29, ageDays: 9,
    owner: { name: "Deja Cole", avatarId: O[2] },
    axes: { "Financial health": 5.5, "Security posture": 2.1, "Compliance history": 2.8, "Operational resilience": 4.4, "Concentration risk": 3.0 },
    findings: [
      { id: "f10", title: "Unencrypted backup snapshot found in audit", severity: "critical", status: "open", dueInDays: 1 },
      { id: "f11", title: "No breach notification clause in current MSA", severity: "high", status: "open", dueInDays: 7 },
      { id: "f12", title: "Access review overdue by two quarters", severity: "high", status: "open", dueInDays: 6 },
    ],
    milestones: [
      { label: "Case opened", date: "2026-08-18", done: true },
      { label: "Escalated to legal", date: "2026-08-25", done: true },
      { label: "Remediation plan due", date: "2026-08-30", done: false },
    ],
  },
  {
    id: "c8", key: "VR-0104", vendor: "Halite Payments — APAC", category: "Payments", status: "open", severity: "medium", score: 61, ageDays: 5,
    owner: { name: "Rio Tan", avatarId: O[3] },
    axes: { "Financial health": 7.0, "Security posture": 6.4, "Compliance history": 6.1, "Operational resilience": 5.7, "Concentration risk": 6.0 },
    findings: [{ id: "f13", title: "Regional data transfer agreement pending", severity: "medium", status: "open", dueInDays: 16 }],
    milestones: [{ label: "Case opened", date: "2026-08-22", done: true }],
  },
];

export const OPEN_CASES = CASES.filter((c) => c.status !== "closed");
export const OPEN_COUNT = OPEN_CASES.length;
export const ESCALATED_COUNT = CASES.filter((c) => c.status === "escalated").length;
export const AVG_SCORE = Math.round(CASES.reduce((s, c) => s + c.score, 0) / CASES.length);
export const OPEN_FINDINGS_COUNT = CASES.reduce((s, c) => s + c.findings.filter((f) => f.status === "open").length, 0);

export function formatInt(n: number): string {
  return new Intl.NumberFormat("en-US").format(n);
}
export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(iso));
}

export const SEARCH_ENTRIES = CASES.map((c) => ({ id: c.id, title: `${c.key} — ${c.vendor}`, meta: c.category, Icon: FileSearch }));
