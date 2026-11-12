// Warden — audit & controls compliance workspace.
// All data below is static, deterministic dummy data. No Math.random, Date.now or new Date()
// anywhere in this module or anything that consumes it — every "due" / "time" string is a literal.

export type Status = "compliant" | "at-risk" | "non-compliant" | "na";

export interface StatusCounts {
  compliant: number;
  atRisk: number;
  nonCompliant: number;
  na: number;
}

export interface Category {
  id: "ac" | "dp" | "cm" | "vr" | "ir" | "bc";
  name: string;
  total: number;
}

export const CATEGORIES: Category[] = [
  { id: "ac", name: "Access Control", total: 24 },
  { id: "dp", name: "Data Protection", total: 20 },
  { id: "cm", name: "Change Management", total: 18 },
  { id: "vr", name: "Vendor Risk", total: 16 },
  { id: "ir", name: "Incident Response", total: 14 },
  { id: "bc", name: "Business Continuity", total: 8 },
];

export type CategoryId = Category["id"];

export interface PeriodData {
  id: "q3" | "q2" | "fy";
  label: string;
  shortLabel: string;
  compareLabel: string;
  compareRate: number;
  byCategory: Record<CategoryId, StatusCounts>;
}

// Each category's per-period status split sums to that category's `total` above, and each period's
// column totals (summed across categories) are the figures quoted in the headline copy in page.tsx —
// both were hand-checked when this file was written, see the comment block at the end.
export const PERIODS: PeriodData[] = [
  {
    id: "q3",
    label: "This Quarter — Q3 FY26",
    shortLabel: "Q3 FY26",
    compareLabel: "Q2 FY26",
    compareRate: 66,
    byCategory: {
      ac: { compliant: 18, atRisk: 4, nonCompliant: 2, na: 0 },
      dp: { compliant: 15, atRisk: 3, nonCompliant: 2, na: 0 },
      cm: { compliant: 13, atRisk: 3, nonCompliant: 1, na: 1 },
      vr: { compliant: 10, atRisk: 3, nonCompliant: 2, na: 1 },
      ir: { compliant: 9, atRisk: 2, nonCompliant: 2, na: 1 },
      bc: { compliant: 6, atRisk: 0, nonCompliant: 0, na: 2 },
    },
  },
  {
    id: "q2",
    label: "Last Quarter — Q2 FY26",
    shortLabel: "Q2 FY26",
    compareLabel: "Q1 FY26",
    compareRate: 61,
    byCategory: {
      ac: { compliant: 16, atRisk: 5, nonCompliant: 3, na: 0 },
      dp: { compliant: 13, atRisk: 4, nonCompliant: 3, na: 0 },
      cm: { compliant: 11, atRisk: 4, nonCompliant: 2, na: 1 },
      vr: { compliant: 9, atRisk: 3, nonCompliant: 3, na: 1 },
      ir: { compliant: 8, atRisk: 2, nonCompliant: 3, na: 1 },
      bc: { compliant: 5, atRisk: 0, nonCompliant: 0, na: 3 },
    },
  },
  {
    id: "fy",
    label: "Full Year — FY26 to date",
    shortLabel: "FY26 YTD",
    compareLabel: "FY25 full year",
    compareRate: 79,
    byCategory: {
      ac: { compliant: 20, atRisk: 2, nonCompliant: 1, na: 1 },
      dp: { compliant: 17, atRisk: 2, nonCompliant: 1, na: 0 },
      cm: { compliant: 15, atRisk: 2, nonCompliant: 0, na: 1 },
      vr: { compliant: 12, atRisk: 2, nonCompliant: 1, na: 1 },
      ir: { compliant: 11, atRisk: 1, nonCompliant: 1, na: 1 },
      bc: { compliant: 7, atRisk: 0, nonCompliant: 0, na: 1 },
    },
  },
];

export function categoryTotals(period: PeriodData): StatusCounts {
  return CATEGORIES.reduce<StatusCounts>(
    (acc, cat) => {
      const c = period.byCategory[cat.id];
      return {
        compliant: acc.compliant + c.compliant,
        atRisk: acc.atRisk + c.atRisk,
        nonCompliant: acc.nonCompliant + c.nonCompliant,
        na: acc.na + c.na,
      };
    },
    { compliant: 0, atRisk: 0, nonCompliant: 0, na: 0 },
  );
}

export interface WaffleCell {
  cellId: string;
  category: CategoryId;
  status: Status;
}

const STATUS_ORDER: Status[] = ["compliant", "at-risk", "non-compliant", "na"];

export function buildWaffleCells(period: PeriodData): WaffleCell[] {
  const cells: WaffleCell[] = [];
  for (const cat of CATEGORIES) {
    const counts = period.byCategory[cat.id];
    const byStatus: Record<Status, number> = {
      compliant: counts.compliant,
      "at-risk": counts.atRisk,
      "non-compliant": counts.nonCompliant,
      na: counts.na,
    };
    let n = 1;
    for (const status of STATUS_ORDER) {
      for (let i = 0; i < byStatus[status]; i++) {
        cells.push({
          cellId: `${cat.id.toUpperCase()}-${String(n).padStart(2, "0")}`,
          category: cat.id,
          status,
        });
        n++;
      }
    }
  }
  return cells;
}

export type Severity = "critical" | "high" | "medium" | "low";
export type BoardColumnId = "backlog" | "in-progress" | "evidence-review" | "attested";

export interface Owner {
  name: string;
  photoId: string;
}

export const OWNERS: Record<string, Owner> = {
  mayaChen: { name: "Maya Chen", photoId: "1494790108377-be9c29b29330" },
  danielOkafor: { name: "Daniel Okafor", photoId: "1472099645785-5658abf4ff4e" },
  priyaRaman: { name: "Priya Raman", photoId: "1438761681033-6461ffad8d80" },
  lucasBianchi: { name: "Lucas Bianchi", photoId: "1507003211169-0a1dd7228f2d" },
};

export interface Finding {
  id: string;
  title: string;
  category: CategoryId;
  severity: Severity;
  owner: Owner;
  due: string;
  column: BoardColumnId;
  note: string;
}

export const BOARD_COLUMNS: { id: BoardColumnId; name: string; description: string }[] = [
  { id: "backlog", name: "Backlog", description: "Identified, not yet started" },
  { id: "in-progress", name: "In Progress", description: "Remediation underway" },
  { id: "evidence-review", name: "Evidence Review", description: "Awaiting auditor sign-off" },
  { id: "attested", name: "Attested", description: "Closed with evidence on file" },
];

export const FINDINGS: Finding[] = [
  {
    id: "FND-1031",
    title: "Privileged access review overdue for finance system",
    category: "ac",
    severity: "critical",
    owner: OWNERS.danielOkafor,
    due: "Oct 24",
    column: "backlog",
    note: "Quarterly privileged-access recertification was not completed for the finance ERP; 6 accounts retain elevated rights past the review window.",
  },
  {
    id: "FND-1032",
    title: "Vendor SOC 2 report expired",
    category: "vr",
    severity: "high",
    owner: OWNERS.priyaRaman,
    due: "Oct 28",
    column: "backlog",
    note: "Primary payment processor's SOC 2 Type II report lapsed; renewal requested, awaiting delivery from vendor.",
  },
  {
    id: "FND-1033",
    title: "Backup restore test not evidenced",
    category: "bc",
    severity: "medium",
    owner: OWNERS.lucasBianchi,
    due: "Nov 3",
    column: "backlog",
    note: "Q3 backup restore drill was performed but evidence (screenshots/logs) was not attached to the control record.",
  },
  {
    id: "FND-1034",
    title: "Encryption key rotation policy draft pending",
    category: "dp",
    severity: "low",
    owner: OWNERS.mayaChen,
    due: "Nov 12",
    column: "backlog",
    note: "Updated key-rotation policy is in internal draft; needs legal sign-off before publication.",
  },
  {
    id: "FND-1035",
    title: "MFA enforcement gap on legacy VPN",
    category: "ac",
    severity: "critical",
    owner: OWNERS.danielOkafor,
    due: "Oct 26",
    column: "in-progress",
    note: "12 legacy VPN accounts remain on password-only auth; hardware token rollout is 70% complete.",
  },
  {
    id: "FND-1036",
    title: "Change approval missing for hotfix deploys",
    category: "cm",
    severity: "high",
    owner: OWNERS.lucasBianchi,
    due: "Oct 30",
    column: "in-progress",
    note: "Two production hotfixes shipped without a recorded change-ticket approval; process exception filed.",
  },
  {
    id: "FND-1037",
    title: "Incident runbook untested for region failover",
    category: "ir",
    severity: "high",
    owner: OWNERS.priyaRaman,
    due: "Nov 5",
    column: "in-progress",
    note: "Tabletop exercise for the EU-region failover runbook has not been scheduled this cycle.",
  },
  {
    id: "FND-1038",
    title: "Data retention schedule mismatch",
    category: "dp",
    severity: "medium",
    owner: OWNERS.mayaChen,
    due: "Nov 1",
    column: "evidence-review",
    note: "Retention period in the data-processing addendum differs from the engineering TTL config by 30 days; reconciliation in review.",
  },
  {
    id: "FND-1039",
    title: "Vendor access de-provisioning delay",
    category: "vr",
    severity: "medium",
    owner: OWNERS.danielOkafor,
    due: "Oct 29",
    column: "evidence-review",
    note: "Offboarded contractor's vendor-portal access was revoked 4 days after contract end; evidence of revocation submitted for sign-off.",
  },
  {
    id: "FND-1040",
    title: "Change log sampling complete",
    category: "cm",
    severity: "low",
    owner: OWNERS.lucasBianchi,
    due: "Oct 22",
    column: "evidence-review",
    note: "Auditor sample of 25 change records reviewed; no exceptions found, pending final sign-off.",
  },
  {
    id: "FND-1041",
    title: "Access recertification closed out",
    category: "ac",
    severity: "low",
    owner: OWNERS.priyaRaman,
    due: "Oct 18",
    column: "attested",
    note: "Q3 access recertification for the core banking platform completed with zero outstanding exceptions.",
  },
  {
    id: "FND-1042",
    title: "Incident response tabletop attested",
    category: "ir",
    severity: "low",
    owner: OWNERS.mayaChen,
    due: "Oct 15",
    column: "attested",
    note: "Annual incident-response tabletop exercise completed and evidence archived; auditor sign-off received.",
  },
];

// Default fallback for the finding-detail panel: most severe, earliest-due open item.
export const DEFAULT_FINDING_ID = "FND-1031";

export interface Notification {
  id: string;
  title: string;
  time: string;
}

export const NOTIFICATIONS: Notification[] = [
  { id: "n1", title: "Evidence requested for FND-1031", time: "2h ago" },
  { id: "n2", title: "FND-1032 vendor report flagged non-compliant", time: "5h ago" },
  { id: "n3", title: "Quarterly attestation window opens in 5 days", time: "1d ago" },
];

export const WORKSPACES = ["Northwind Retail Inc.", "Northwind EU Holdings"];

export const CURRENT_USER = {
  name: "Ava Brennan",
  role: "Compliance Lead",
  photoId: "1544005313-94ddf0286df2",
};

/*
 Reconciliation notes (hand-checked):
 Category totals: 24 + 20 + 18 + 16 + 14 + 8 = 100.
 Q3 FY26  — compliant 71, at-risk 15, non-compliant 9, na 5   → 100; rate excl. N/A = 71/95 = 74.7% → 75%
 Q2 FY26  — compliant 62, at-risk 18, non-compliant 14, na 6  → 100; rate excl. N/A = 62/94 = 65.9% → 66%
 FY26 YTD — compliant 82, at-risk 9,  non-compliant 4,  na 5  → 100; rate excl. N/A = 82/95 = 86.3% → 86%
 These three integer rates (75 / 66 / 86) are also hardcoded as PERIODS[].compareRate cross-links
 (q3.compareRate = q2's rate = 66, q2.compareRate = 61 is a prior, undisplayed Q1 baseline, fy.compareRate
 = 79 is a prior, undisplayed FY25 baseline) so the "+N pts" trend chip is always a plain subtraction
 done in the component, never a hand-typed delta.
*/
