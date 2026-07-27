/**
 * Covenant — deterministic dummy data for the contract review & redlining console.
 * No Math.random / Date.now anywhere. All dates and "days to expiry" are fixed integers baked
 * into the seed data below; the expiry sparkline is derived directly from this same array so the
 * two always reconcile.
 */

import type { LucideIcon } from "lucide-react";
import { BookOpen, FileSignature, FolderKanban, Handshake, Landmark, Scale, Settings } from "lucide-react";

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/* --------------------------------------------------------------- Brand */

export const BRAND = { name: "Covenant", tagline: "Contract Review & Redlining Console" };

export function unsplashAvatar(id: string, size = 96): string {
  return `https://images.unsplash.com/photo-${id}?w=${size}&h=${size}&fit=crop&crop=faces`;
}

export type Workspace = { id: string; name: string; plan: string };

export const WORKSPACES: Workspace[] = [
  { id: "ws-andersvale", name: "Anders & Vale Legal", plan: "Enterprise plan" },
  { id: "ws-sandbox", name: "Sandbox", plan: "Free plan" },
];

/** Fictional persona — never real session data. */
export const CURRENT_USER = {
  name: "Priya Deshmukh",
  role: "Senior Contracts Counsel",
  email: "priya.deshmukh@andersvale.com",
  avatarId: "1580489944761-15a19d654956",
};

export const CLIENT_ENTITY = "Anders & Vale Industries";

/* -------------------------------------------------------- Global nav */

export type NavItem = { id: string; label: string; Icon: LucideIcon; active?: boolean; disabled?: boolean };
export type NavSection = { id: string; title: string; items: NavItem[] };

export const NAV_SECTIONS: NavSection[] = [
  {
    id: "workspace",
    title: "Workspace",
    items: [{ id: "overview", label: "Overview", Icon: Settings, disabled: true }],
  },
  {
    id: "legal",
    title: "Legal",
    items: [
      { id: "contracts", label: "Contracts", Icon: FileSignature, active: true },
      { id: "counterparties", label: "Counterparties", Icon: Handshake, disabled: true },
      { id: "clause-library", label: "Clause library", Icon: BookOpen, disabled: true },
      { id: "obligations", label: "Obligations", Icon: Scale, disabled: true },
    ],
  },
  {
    id: "admin",
    title: "Admin",
    items: [
      { id: "templates", label: "Templates", Icon: FolderKanban, disabled: true },
      { id: "reporting", label: "Reporting", Icon: Landmark, disabled: true },
    ],
  },
];

/* -------------------------------------------------------------- Risk */

export type RiskLevel = "low" | "medium" | "high";

export function riskLevel(score: number): RiskLevel {
  if (score >= 67) return "high";
  if (score >= 34) return "medium";
  return "low";
}

export const RISK_LABEL: Record<RiskLevel, string> = { low: "Low risk", medium: "Medium risk", high: "High risk" };
export const RISK_TONE: Record<RiskLevel, "good" | "warn" | "bad"> = { low: "good", medium: "warn", high: "bad" };

/* --------------------------------------------------------- Contract status */

export type ContractStatus = "in_review" | "redlining" | "countersigning" | "executed" | "expiring_soon";

export const STATUS_META: Record<ContractStatus, { label: string; tone: "good" | "warn" | "bad" | "info" | "neutral" }> = {
  in_review: { label: "In review", tone: "neutral" },
  redlining: { label: "Redlining", tone: "info" },
  countersigning: { label: "Countersigning", tone: "warn" },
  executed: { label: "Executed", tone: "good" },
  expiring_soon: { label: "Expiring soon", tone: "bad" },
};

export const STATUS_ORDER: ContractStatus[] = ["in_review", "redlining", "countersigning", "executed", "expiring_soon"];

/* --------------------------------------------------------------- Sorting */

export type SortKey = "name" | "risk" | "expiry";
export type SortDir = "asc" | "desc";

/** Default sort direction applied the first time a column is selected (not when re-toggling it). */
export const DEFAULT_SORT_DIR: Record<SortKey, SortDir> = { name: "asc", risk: "desc", expiry: "asc" };

/** Detail-pane view mode — toggled by the Redline / Clause risk segmented control. */
export type DetailView = "clause" | "redline";

/** Short column labels for narrow table widths — full name always available via title attribute. */
export const CONTRACT_TYPE_SHORT: Record<string, string> = {
  "Master Services Agreement": "MSA",
  "License Agreement": "License",
  "Data Processing Agreement": "DPA",
  "Vendor Agreement": "Vendor",
  "Non-Disclosure Agreement": "NDA",
  "Statement of Work": "SOW",
};

/* ------------------------------------------------------------- Clauses */

export type ClauseRisk = { name: string; score: number; note: string };

export type RedlineSegment = { type: "same" | "ins" | "del"; text: string };
export type RedlineClause = { clauseName: string; segments: RedlineSegment[] };

export type Contract = {
  id: string;
  counterparty: string;
  counterpartyInitials: string;
  contractType: string;
  status: ContractStatus;
  riskScore: number;
  daysToExpiry: number | null;
  value: number;
  effectiveDate: string | null;
  renewalTerm: string;
  parties: string[];
  clauses: ClauseRisk[];
  redline: RedlineClause[] | null;
  redlineEmptyNote: string | null;
};

/* ---------------------------------------------------------------- Seed */

export const CONTRACTS: Contract[] = [
  // In review (3) — no effective date yet, no redline activity yet.
  {
    id: "c-halden-msa",
    counterparty: "Halden & Voss LLP",
    counterpartyInitials: "HV",
    contractType: "Master Services Agreement",
    status: "in_review",
    riskScore: 55,
    daysToExpiry: null,
    value: 340000,
    effectiveDate: null,
    renewalTerm: "Auto-renews annually · 60-day notice to terminate",
    parties: [`${CLIENT_ENTITY} (Client)`, "Halden & Voss LLP (Counterparty)"],
    clauses: [
      { name: "Limitation of Liability", score: 61, note: "Cap set at 12 months' fees; excludes gross negligence only." },
      { name: "Governing Law & Venue", score: 24, note: "Delaware law, exclusive venue in Wilmington — standard position." },
      { name: "Confidentiality", score: 30, note: "Mutual 5-year survival period, standard carve-outs." },
      { name: "Assignment", score: 66, note: "Counterparty may assign to any affiliate without consent." },
    ],
    redline: null,
    redlineEmptyNote: "Redlining has not started for this contract yet — it is still with internal legal for first-pass review.",
  },
  {
    id: "c-quillfeather-license",
    counterparty: "Quillfeather Media Group",
    counterpartyInitials: "QM",
    contractType: "License Agreement",
    status: "in_review",
    riskScore: 38,
    daysToExpiry: null,
    value: 92000,
    effectiveDate: null,
    renewalTerm: "Fixed 2-year term · no auto-renewal",
    parties: [`${CLIENT_ENTITY} (Licensee)`, "Quillfeather Media Group (Licensor)"],
    clauses: [
      { name: "Scope of License", score: 32, note: "Non-exclusive, worldwide, limited to internal marketing use." },
      { name: "Termination for Convenience", score: 41, note: "90-day notice, no early-termination fee." },
      { name: "Indemnification", score: 45, note: "One-way indemnity favoring licensor for IP infringement claims." },
    ],
    redline: null,
    redlineEmptyNote: "Redlining has not started for this contract yet — it is still with internal legal for first-pass review.",
  },
  {
    id: "c-obsidian-dpa",
    counterparty: "Obsidian Robotics, Inc.",
    counterpartyInitials: "OR",
    contractType: "Data Processing Agreement",
    status: "in_review",
    riskScore: 63,
    daysToExpiry: null,
    value: 58000,
    effectiveDate: null,
    renewalTerm: "Coterminous with parent MSA",
    parties: [`${CLIENT_ENTITY} (Controller)`, "Obsidian Robotics, Inc. (Processor)"],
    clauses: [
      { name: "Data Protection & Security", score: 70, note: "Sub-processor list not attached; breach notice window is 10 days." },
      { name: "International Transfers", score: 58, note: "Relies on Standard Contractual Clauses, module 2." },
      { name: "Audit Rights", score: 47, note: "One audit per year, 30-day advance notice required." },
    ],
    redline: null,
    redlineEmptyNote: "Redlining has not started for this contract yet — it is still with internal legal for first-pass review.",
  },

  // Redlining (4) — active back-and-forth; two carry a fully authored redline.
  {
    id: "c-corvid-msa",
    counterparty: "Corvid Analytics Corp.",
    counterpartyInitials: "CA",
    contractType: "Master Services Agreement",
    status: "redlining",
    riskScore: 74,
    daysToExpiry: null,
    value: 610000,
    effectiveDate: null,
    renewalTerm: "Auto-renews annually · 60-day notice to terminate",
    parties: [`${CLIENT_ENTITY} (Client)`, "Corvid Analytics Corp. (Vendor)"],
    clauses: [
      { name: "Limitation of Liability", score: 82, note: "Counterparty proposes uncapped liability carve-out for data breach." },
      { name: "Indemnification", score: 69, note: "Counterparty's markup narrows indemnity to third-party IP claims only." },
      { name: "Termination for Convenience", score: 35, note: "Either party, 30-day notice — unchanged from template." },
      { name: "Confidentiality", score: 28, note: "Mutual 5-year survival period, standard carve-outs." },
    ],
    redline: [
      {
        clauseName: "Limitation of Liability",
        segments: [
          { type: "same", text: "Except for breaches of Section 9 (Confidentiality), in no event shall either party's aggregate liability arising out of this Agreement exceed " },
          { type: "del", text: "twelve (12) months' " },
          { type: "ins", text: "the greater of twenty-four (24) months' fees or $250,000, " },
          { type: "same", text: "fees paid in the preceding twelve (12) months, except that this limitation shall " },
          { type: "del", text: "not " },
          { type: "same", text: "apply to " },
          { type: "ins", text: "either party's " },
          { type: "same", text: "breach of its data security obligations under Section 11, which shall remain " },
          { type: "ins", text: "subject to the cap above and shall no longer be treated as " },
          { type: "del", text: "uncapped." },
          { type: "ins", text: "an uncapped exception." },
        ],
      },
      {
        clauseName: "Indemnification",
        segments: [
          { type: "same", text: "Vendor shall indemnify, defend, and hold harmless Client from and against any third-party claims arising from " },
          { type: "del", text: "Vendor's infringement of a third party's intellectual property rights" },
          { type: "ins", text: "(a) Vendor's infringement of a third party's intellectual property rights, (b) Vendor's breach of its confidentiality or data security obligations, or (c) Vendor's gross negligence or willful misconduct" },
          { type: "same", text: ", provided Client gives prompt written notice of any such claim." },
        ],
      },
    ],
    redlineEmptyNote: null,
  },
  {
    id: "c-thornfield-vendor",
    counterparty: "Thornfield Capital Partners",
    counterpartyInitials: "TC",
    contractType: "Vendor Agreement",
    status: "redlining",
    riskScore: 46,
    daysToExpiry: null,
    value: 175000,
    effectiveDate: null,
    renewalTerm: "Auto-renews annually · 60-day notice to terminate",
    parties: [`${CLIENT_ENTITY} (Client)`, "Thornfield Capital Partners (Vendor)"],
    clauses: [
      { name: "Payment Terms", score: 33, note: "Net 45, standard late-payment interest of 1.5% per month." },
      { name: "Indemnification", score: 52, note: "Vendor's counsel proposed narrowing the scope; second-round redline pending." },
      { name: "Termination for Convenience", score: 41, note: "Either party, 45-day notice, pro-rated refund of prepaid fees." },
    ],
    redline: null,
    redlineEmptyNote: "Redline in progress — the counterparty's latest markup on Indemnification has not been received yet.",
  },
  {
    id: "c-meridian-nda",
    counterparty: "Meridian Outfitters LLC",
    counterpartyInitials: "MO",
    contractType: "Non-Disclosure Agreement",
    status: "redlining",
    riskScore: 29,
    daysToExpiry: null,
    value: 0,
    effectiveDate: null,
    renewalTerm: "3-year term from effective date · no auto-renewal",
    parties: [`${CLIENT_ENTITY}`, "Meridian Outfitters LLC"],
    clauses: [
      { name: "Definition of Confidential Information", score: 22, note: "Mutual, standard exclusions for public and independently developed information." },
      { name: "Survival", score: 27, note: "Obligations survive 3 years past termination — standard for this deal size." },
    ],
    redline: null,
    redlineEmptyNote: "Redline in progress — a single markup on the survival term is out for counterparty review.",
  },
  {
    id: "c-ashgrove-sow",
    counterparty: "Ashgrove Biotech Ltd.",
    counterpartyInitials: "AB",
    contractType: "Statement of Work",
    status: "redlining",
    riskScore: 81,
    daysToExpiry: null,
    value: 420000,
    effectiveDate: null,
    renewalTerm: "One-time engagement · no renewal",
    parties: [`${CLIENT_ENTITY} (Client)`, "Ashgrove Biotech Ltd. (Contractor)"],
    clauses: [
      { name: "Termination for Convenience", score: 88, note: "Counterparty markup removes Client's right to terminate for convenience entirely." },
      { name: "Limitation of Liability", score: 64, note: "Cap proposed at 6 months' fees — below our standard 12-month floor." },
      { name: "Intellectual Property Assignment", score: 55, note: "Work product assignment is mutual, pending IP counsel sign-off." },
    ],
    redline: [
      {
        clauseName: "Termination for Convenience",
        segments: [
          { type: "same", text: "Client may terminate this Statement of Work " },
          { type: "del", text: "for any reason or no reason, " },
          { type: "ins", text: "for convenience only upon a material change in Client's business needs, " },
          { type: "same", text: "upon " },
          { type: "del", text: "fourteen (14) " },
          { type: "ins", text: "sixty (60) " },
          { type: "same", text: "days' written notice to Contractor, and shall pay Contractor for " },
          { type: "ins", text: "all fees incurred through the notice period plus " },
          { type: "same", text: "work performed through the effective date of termination." },
        ],
      },
    ],
    redlineEmptyNote: null,
  },

  // Countersigning (2) — text finalized, awaiting signature.
  {
    id: "c-falkirk-msa",
    counterparty: "Falkirk Energy Systems Ltd.",
    counterpartyInitials: "FE",
    contractType: "Master Services Agreement",
    status: "countersigning",
    riskScore: 22,
    daysToExpiry: null,
    value: 265000,
    effectiveDate: null,
    renewalTerm: "Auto-renews annually · 60-day notice to terminate",
    parties: [`${CLIENT_ENTITY} (Client)`, "Falkirk Energy Systems Ltd. (Vendor)"],
    clauses: [
      { name: "Limitation of Liability", score: 26, note: "Cap at 12 months' fees — final, agreed by both parties." },
      { name: "Indemnification", score: 19, note: "Mutual, standard scope — final." },
      { name: "Governing Law & Venue", score: 15, note: "New York law, arbitration via AAA — final." },
    ],
    redline: null,
    redlineEmptyNote: "Redline finalized and agreed by both parties — awaiting countersignature, no further changes expected.",
  },
  {
    id: "c-pemberton-dpa",
    counterparty: "Pemberton & Wray Advisory",
    counterpartyInitials: "PW",
    contractType: "Data Processing Agreement",
    status: "countersigning",
    riskScore: 44,
    daysToExpiry: null,
    value: 38000,
    effectiveDate: null,
    renewalTerm: "Coterminous with parent MSA",
    parties: [`${CLIENT_ENTITY} (Controller)`, "Pemberton & Wray Advisory (Processor)"],
    clauses: [
      { name: "Data Protection & Security", score: 48, note: "Sub-processor list attached as Exhibit B — final." },
      { name: "Breach Notification", score: 39, note: "72-hour notice window — final, matches internal policy." },
    ],
    redline: null,
    redlineEmptyNote: "Redline finalized and agreed by both parties — awaiting countersignature, no further changes expected.",
  },

  // Executed (5) — in force, non-null days to expiry.
  {
    id: "c-nimbus-msa",
    counterparty: "Nimbus Cloud Systems, Inc.",
    counterpartyInitials: "NC",
    contractType: "Master Services Agreement",
    status: "executed",
    riskScore: 24,
    daysToExpiry: 214,
    value: 480000,
    effectiveDate: "2025-01-05",
    renewalTerm: "Auto-renews annually · 60-day notice to terminate",
    parties: [`${CLIENT_ENTITY} (Client)`, "Nimbus Cloud Systems, Inc. (Vendor)"],
    clauses: [
      { name: "Limitation of Liability", score: 21, note: "Cap at 12 months' fees, carve-out for confidentiality breach — as executed." },
      { name: "Data Protection & Security", score: 30, note: "SOC 2 Type II attached as Exhibit C — as executed." },
      { name: "Governing Law & Venue", score: 18, note: "Delaware law, Wilmington venue — as executed." },
    ],
    redline: null,
    redlineEmptyNote: "No redline available — the executed version reflects the final agreed text with no further changes.",
  },
  {
    id: "c-vertex-vendor",
    counterparty: "Vertex Logistics LLC",
    counterpartyInitials: "VL",
    contractType: "Vendor Agreement",
    status: "executed",
    riskScore: 41,
    daysToExpiry: 331,
    value: 152000,
    effectiveDate: "2025-06-01",
    renewalTerm: "Auto-renews annually · 45-day notice to terminate",
    parties: [`${CLIENT_ENTITY} (Client)`, "Vertex Logistics LLC (Vendor)"],
    clauses: [
      { name: "Payment Terms", score: 36, note: "Net 30, 1% late fee per month — as executed." },
      { name: "Indemnification", score: 47, note: "Mutual, standard scope — as executed." },
      { name: "Insurance Requirements", score: 40, note: "$2M general liability minimum — as executed." },
    ],
    redline: null,
    redlineEmptyNote: "No redline available — the executed version reflects the final agreed text with no further changes.",
  },
  {
    id: "c-solara-dpa",
    counterparty: "Solara Health Partners",
    counterpartyInitials: "SH",
    contractType: "Data Processing Agreement",
    status: "executed",
    riskScore: 58,
    daysToExpiry: 128,
    value: 66000,
    effectiveDate: "2024-11-15",
    renewalTerm: "Coterminous with parent MSA",
    parties: [`${CLIENT_ENTITY} (Controller)`, "Solara Health Partners (Processor)"],
    clauses: [
      { name: "Data Protection & Security", score: 62, note: "HIPAA business associate terms attached — as executed." },
      { name: "International Transfers", score: 55, note: "No cross-border transfer — data remains in-region." },
      { name: "Breach Notification", score: 57, note: "48-hour notice window — as executed." },
    ],
    redline: null,
    redlineEmptyNote: "No redline available — the executed version reflects the final agreed text with no further changes.",
  },
  {
    id: "c-arkwood-license",
    counterparty: "Arkwood Manufacturing Co.",
    counterpartyInitials: "AM",
    contractType: "License Agreement",
    status: "executed",
    riskScore: 19,
    daysToExpiry: 275,
    value: 214000,
    effectiveDate: "2025-04-20",
    renewalTerm: "Fixed 3-year term · one 2-year renewal option",
    parties: [`${CLIENT_ENTITY} (Licensee)`, "Arkwood Manufacturing Co. (Licensor)"],
    clauses: [
      { name: "Scope of License", score: 20, note: "Non-exclusive, North America only — as executed." },
      { name: "Termination for Convenience", score: 17, note: "180-day notice, no fee — as executed." },
    ],
    redline: null,
    redlineEmptyNote: "No redline available — the executed version reflects the final agreed text with no further changes.",
  },
  {
    id: "c-bellhaven-msa",
    counterparty: "Bellhaven Insurance Group",
    counterpartyInitials: "BI",
    contractType: "Master Services Agreement",
    status: "executed",
    riskScore: 33,
    daysToExpiry: 62,
    value: 298000,
    effectiveDate: "2023-09-08",
    renewalTerm: "Auto-renews annually · 60-day notice to terminate",
    parties: [`${CLIENT_ENTITY} (Client)`, "Bellhaven Insurance Group (Vendor)"],
    clauses: [
      { name: "Limitation of Liability", score: 29, note: "Cap at 12 months' fees — as executed." },
      { name: "Confidentiality", score: 25, note: "Mutual 5-year survival period — as executed." },
      { name: "Auto-Renewal Notice", score: 44, note: "Renewal notice window is 60 days — expiring soon, review recommended." },
    ],
    redline: null,
    redlineEmptyNote: "No redline available — the executed version reflects the final agreed text with no further changes.",
  },

  // Expiring soon (2) — non-null days to expiry, small values.
  {
    id: "c-fenwick-nda",
    counterparty: "Fenwick & Cole Partners",
    counterpartyInitials: "FC",
    contractType: "Non-Disclosure Agreement",
    status: "expiring_soon",
    riskScore: 47,
    daysToExpiry: 12,
    value: 0,
    effectiveDate: "2023-08-14",
    renewalTerm: "3-year term from effective date · no auto-renewal",
    parties: [`${CLIENT_ENTITY}`, "Fenwick & Cole Partners"],
    clauses: [
      { name: "Definition of Confidential Information", score: 30, note: "Mutual, standard exclusions — as executed." },
      { name: "Survival", score: 51, note: "Obligations expire with the term — no survival clause negotiated." },
      { name: "Renewal Trigger", score: 60, note: "No auto-renewal — a new NDA must be signed before expiry." },
    ],
    redline: null,
    redlineEmptyNote: "No redline available — the executed version reflects the final agreed text with no further changes.",
  },
  {
    id: "c-crestline-sow",
    counterparty: "Crestline Freight Corp.",
    counterpartyInitials: "CF",
    contractType: "Statement of Work",
    status: "expiring_soon",
    riskScore: 71,
    daysToExpiry: 27,
    value: 184000,
    effectiveDate: "2025-08-01",
    renewalTerm: "One-time engagement · no renewal",
    parties: [`${CLIENT_ENTITY} (Client)`, "Crestline Freight Corp. (Contractor)"],
    clauses: [
      { name: "Termination for Convenience", score: 68, note: "60-day notice — as executed." },
      { name: "Limitation of Liability", score: 74, note: "Cap at 6 months' fees — below standard floor, flagged for renewal talks." },
      { name: "Intellectual Property Assignment", score: 70, note: "Work product assignment is one-way in Contractor's favor." },
    ],
    redline: null,
    redlineEmptyNote: "No redline available — the executed version reflects the final agreed text with no further changes.",
  },
];

/* ------------------------------------------------------ Expiry sparkline */

export type ExpiryMonth = { label: string; count: number };

/** Derived from CONTRACTS so the sparkline total always reconciles with the contracts shown. */
export const EXPIRY_BY_MONTH: ExpiryMonth[] = (() => {
  const months = ["Aug '26", "Sep '26", "Oct '26", "Nov '26", "Dec '26", "Jan '27", "Feb '27", "Mar '27", "Apr '27", "May '27", "Jun '27", "Jul '27"];
  const buckets = months.map((label) => ({ label, count: 0 }));
  for (const c of CONTRACTS) {
    if (c.daysToExpiry === null) continue;
    const monthIndex = Math.min(11, Math.max(0, Math.floor(c.daysToExpiry / 30.4)));
    buckets[monthIndex].count += 1;
  }
  return buckets;
})();

export const TOTAL_EXPIRING = EXPIRY_BY_MONTH.reduce((sum, m) => sum + m.count, 0);
export const NEXT_EXPIRY_DAYS = Math.min(...CONTRACTS.filter((c) => c.daysToExpiry !== null).map((c) => c.daysToExpiry as number));

/* ------------------------------------------------------------- Formatters */

export const currencyFormatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
export const dateFormatter = new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "numeric" });

export function formatEffectiveDate(iso: string | null): string {
  if (!iso) return "Not yet effective";
  const [y, m, d] = iso.split("-").map(Number);
  return dateFormatter.format(new Date(Date.UTC(y, m - 1, d)));
}

export function formatExpiry(days: number | null): string {
  if (days === null) return "—";
  if (days <= 30) return `${days} days`;
  const months = Math.round(days / 30.4);
  return `${months} mo`;
}
