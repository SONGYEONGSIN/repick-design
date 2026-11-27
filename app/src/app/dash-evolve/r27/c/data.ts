import { Building2, FileText, Gauge, Radar as RadarIcon, ShieldCheck, Users, type LucideIcon } from "lucide-react";
import type { RiskBand, VendorSeriesId } from "./tokens";

export const BRAND = { name: "Vantage", Icon: RadarIcon };

export const CURRENT_USER = {
  name: "Dana Reyes",
  role: "Procurement risk lead",
  email: "dana.reyes@vantagescore.example",
  avatarId: "1547425260-76bcadfb4f2c",
};

export const WORKSPACES = [
  { id: "packaging", name: "Contract packaging", plan: "12 active vendors" },
  { id: "components", name: "Electronic components", plan: "27 active vendors" },
  { id: "logistics", name: "Freight & logistics", plan: "9 active vendors" },
];

export type NavItem = { id: string; label: string; Icon: LucideIcon; active?: boolean; disabled?: boolean };
export const NAV_SECTIONS: { id: string; title: string; items: NavItem[] }[] = [
  {
    id: "work",
    title: "Work",
    items: [
      { id: "scorecards", label: "Scorecards", Icon: Gauge, active: true },
      { id: "vendors", label: "Vendor directory", Icon: Building2 },
      { id: "contacts", label: "Relationship owners", Icon: Users },
    ],
  },
  {
    id: "insight",
    title: "Insight",
    items: [
      { id: "reports", label: "Board reports", Icon: FileText },
      { id: "audits", label: "Audit trail", Icon: ShieldCheck, disabled: true },
    ],
  },
];

/** Seven fixed risk axes, each scored 0–10. This is the concrete substantiating
 * property behind "Multi-Variable comparison" — scores below vary meaningfully
 * per vendor and per axis, not a decorative near-identical polygon. */
export const RISK_AXES = [
  "Financial stability",
  "Delivery reliability",
  "Compliance",
  "Quality",
  "Security posture",
  "Responsiveness",
  "Sustainability",
] as const;
export type RiskAxis = (typeof RISK_AXES)[number];

/** Short codes for the fixed-width comparison table header (full names live in the caption/legend). */
export const AXIS_SHORT: Record<RiskAxis, string> = {
  "Financial stability": "Fin.",
  "Delivery reliability": "Del.",
  Compliance: "Comp.",
  Quality: "Qual.",
  "Security posture": "Sec.",
  Responsiveness: "Resp.",
  Sustainability: "Sust.",
};

export interface Vendor {
  id: VendorSeriesId;
  code: string;
  name: string;
  category: string;
  hqRegion: string;
  annualSpendUsd: number;
  leadTimeDays: number;
  openIncidents: number;
  contractRenewal: string; // fixed ISO date, display-formatted only
  owner: { name: string; avatarId: string };
  axes: Record<RiskAxis, number>;
  /** Fixed 8-point trend of the overall score over the last four quarters (two reads per quarter). */
  trend: number[];
  notes: string;
}

export const VENDORS: Vendor[] = [
  {
    id: "s1",
    code: "VND-0142",
    name: "Solenne Materials",
    category: "Contract packaging — Tier 1",
    hqRegion: "Lyon, FR",
    annualSpendUsd: 2840000,
    leadTimeDays: 12,
    openIncidents: 1,
    contractRenewal: "2027-02-01",
    owner: { name: "Priya Kade", avatarId: "1531123897727-8f129e1688ce" },
    axes: {
      "Financial stability": 8.2,
      "Delivery reliability": 7.6,
      Compliance: 8.8,
      Quality: 7.9,
      "Security posture": 6.4,
      Responsiveness: 6.9,
      Sustainability: 6.1,
    },
    trend: [6.8, 6.9, 7.0, 7.1, 7.2, 7.3, 7.3, 7.4],
    notes:
      "Long-standing primary supplier for retail-ready cartons. Strong compliance file; security posture is the one axis worth a follow-up questionnaire before the February renewal.",
  },
  {
    id: "s2",
    code: "VND-0158",
    name: "Kestrel Pack Co.",
    category: "Contract packaging — Tier 1",
    hqRegion: "Leeds, UK",
    annualSpendUsd: 1610000,
    leadTimeDays: 18,
    openIncidents: 3,
    contractRenewal: "2026-11-15",
    owner: { name: "Owen Marsh", avatarId: "1534528741775-53994a69daeb" },
    axes: {
      "Financial stability": 5.8,
      "Delivery reliability": 6.2,
      Compliance: 4.5,
      Quality: 6.8,
      "Security posture": 4.0,
      Responsiveness: 7.4,
      Sustainability: 3.1,
    },
    trend: [6.1, 5.9, 5.7, 5.6, 5.4, 5.3, 5.2, 5.1],
    notes:
      "Fastest responsiveness of the cohort but compliance and sustainability documentation is stale. Trending down two quarters running — flagged for a renewal-cycle review.",
  },
  {
    id: "s3",
    code: "VND-0171",
    name: "Anchorline Supply",
    category: "Contract packaging — Tier 1",
    hqRegion: "Cebu, PH",
    annualSpendUsd: 940000,
    leadTimeDays: 27,
    openIncidents: 5,
    contractRenewal: "2026-10-04",
    owner: { name: "Renata Solis", avatarId: "1543076447-215ad9ba6923" },
    axes: {
      "Financial stability": 3.0,
      "Delivery reliability": 2.8,
      Compliance: 5.2,
      Quality: 4.6,
      "Security posture": 3.4,
      Responsiveness: 4.9,
      Sustainability: 2.8,
    },
    trend: [4.6, 4.4, 4.3, 4.1, 4.0, 3.9, 3.9, 3.8],
    notes:
      "Lowest-cost source in the category but delivery reliability and financial stability are both below the cohort floor. Five open incidents in the trailing twelve months.",
  },
];

export function overallScore(v: Vendor): number {
  const sum = RISK_AXES.reduce((s, axis) => s + v.axes[axis], 0);
  return Math.round((sum / RISK_AXES.length) * 10) / 10;
}

export function riskBand(score: number): RiskBand {
  if (score >= 7) return "strong";
  if (score >= 5) return "watch";
  return "weak";
}

export function cohortAverage(axis: RiskAxis, vendors: Vendor[] = VENDORS): number {
  const sum = vendors.reduce((s, v) => s + v.axes[axis], 0);
  return Math.round((sum / vendors.length) * 10) / 10;
}

export const OPEN_INCIDENTS_TOTAL = VENDORS.reduce((s, v) => s + v.openIncidents, 0);
export const TOTAL_ANNUAL_SPEND = VENDORS.reduce((s, v) => s + v.annualSpendUsd, 0);
export const AVG_OVERALL = Math.round((VENDORS.reduce((s, v) => s + overallScore(v), 0) / VENDORS.length) * 10) / 10;
export const WEAK_COUNT = VENDORS.filter((v) => riskBand(overallScore(v)) === "weak").length;

export function formatUsd(n: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}
export function formatInt(n: number): string {
  return new Intl.NumberFormat("en-US").format(n);
}
export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(iso));
}
export function formatScore(n: number): string {
  return new Intl.NumberFormat("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(n);
}

export const SEARCH_ENTRIES = VENDORS.map((v) => ({ id: v.id, title: `${v.code} — ${v.name}`, meta: v.category, Icon: Building2 }));
