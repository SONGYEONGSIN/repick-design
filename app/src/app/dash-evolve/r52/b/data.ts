// Deterministic dummy data — no Math.random / Date.now / new Date(). Every figure a component
// reads for "this quarter" totals is derived from these arrays at render time.

export type RiskTier = "low" | "medium" | "high";
export type VendorStatus = "active" | "under-review" | "offboarding";
export type ApprovalStatus = "pending" | "approved" | "flagged";

export type MetricId = "cloud" | "software" | "contractors" | "travel" | "facilities" | "marketing";

export type Metric = {
  id: MetricId;
  label: string;
  unit: "usd" | "count";
  valueThisQuarter: number;
  valueLastQuarter: number;
  valueTwoQuartersAgo: number;
  target: number; // budget ceiling for usd metrics, headcount cap for count
  sparkline: number[]; // 8 fixed weekly points, oldest first
  sparklinePrior: number[]; // the prior quarter's 8-week trend, same shape
};

export const METRICS: Metric[] = [
  { id: "cloud", label: "Cloud infra spend", unit: "usd", valueThisQuarter: 412000, valueLastQuarter: 378000, valueTwoQuartersAgo: 351000, target: 450000, sparkline: [48, 51, 49, 53, 55, 52, 58, 61], sparklinePrior: [44, 46, 45, 47, 48, 47, 50, 51] },
  { id: "software", label: "Software licensing", unit: "usd", valueThisQuarter: 186000, valueLastQuarter: 171000, valueTwoQuartersAgo: 164000, target: 200000, sparkline: [21, 22, 23, 22, 24, 25, 24, 26], sparklinePrior: [19, 20, 20, 21, 21, 22, 21, 23] },
  { id: "contractors", label: "Contractor spend", unit: "usd", valueThisQuarter: 264000, valueLastQuarter: 302000, valueTwoQuartersAgo: 289000, target: 280000, sparkline: [41, 39, 36, 34, 33, 31, 30, 29], sparklinePrior: [45, 44, 43, 41, 40, 39, 38, 37] },
  { id: "travel", label: "Travel & events", unit: "usd", valueThisQuarter: 58000, valueLastQuarter: 41000, valueTwoQuartersAgo: 36000, target: 70000, sparkline: [5, 6, 7, 6, 8, 9, 10, 11], sparklinePrior: [4, 4, 5, 5, 5, 6, 6, 5] },
  { id: "facilities", label: "Facilities", unit: "usd", valueThisQuarter: 97000, valueLastQuarter: 95000, valueTwoQuartersAgo: 93000, target: 100000, sparkline: [11, 12, 12, 11, 12, 13, 12, 12], sparklinePrior: [11, 11, 12, 11, 12, 12, 12, 12] },
  { id: "marketing", label: "Marketing & research", unit: "usd", valueThisQuarter: 97000, valueLastQuarter: 88000, valueTwoQuartersAgo: 81000, target: 110000, sparkline: [10, 11, 11, 12, 12, 13, 12, 13], sparklinePrior: [9, 10, 10, 11, 11, 11, 11, 11] },
];

export type Vendor = {
  id: string;
  name: string;
  metricId: MetricId;
  spendThisQuarter: number;
  riskTier: RiskTier;
  status: VendorStatus;
  contractEndIso: string;
};

export const VENDORS: Vendor[] = [
  { id: "v-01", name: "Northbeam Cloud", metricId: "cloud", spendThisQuarter: 184000, riskTier: "low", status: "active", contractEndIso: "2027-03-01" },
  { id: "v-02", name: "Latticework Compute", metricId: "cloud", spendThisQuarter: 96000, riskTier: "medium", status: "active", contractEndIso: "2026-12-15" },
  { id: "v-03", name: "Ferrotype CDN", metricId: "cloud", spendThisQuarter: 71000, riskTier: "low", status: "active", contractEndIso: "2027-06-30" },
  { id: "v-04", name: "Quay Object Storage", metricId: "cloud", spendThisQuarter: 61000, riskTier: "medium", status: "under-review", contractEndIso: "2026-11-20" },
  { id: "v-05", name: "Hollowdeck Analytics", metricId: "software", spendThisQuarter: 58000, riskTier: "low", status: "active", contractEndIso: "2027-01-10" },
  { id: "v-06", name: "Strandline CRM", metricId: "software", spendThisQuarter: 47000, riskTier: "medium", status: "active", contractEndIso: "2026-10-31" },
  { id: "v-07", name: "Pinecrest Design Suite", metricId: "software", spendThisQuarter: 39000, riskTier: "low", status: "active", contractEndIso: "2027-02-14" },
  { id: "v-08", name: "Wrenfield Ticketing", metricId: "software", spendThisQuarter: 42000, riskTier: "high", status: "under-review", contractEndIso: "2026-11-05" },
  { id: "v-09", name: "Meridian Staffing", metricId: "contractors", spendThisQuarter: 112000, riskTier: "medium", status: "active", contractEndIso: "2026-12-01" },
  { id: "v-10", name: "Oakfield Consulting", metricId: "contractors", spendThisQuarter: 88000, riskTier: "low", status: "active", contractEndIso: "2027-04-01" },
  { id: "v-11", name: "Coppervale QA Partners", metricId: "contractors", spendThisQuarter: 64000, riskTier: "high", status: "offboarding", contractEndIso: "2026-11-30" },
  { id: "v-12", name: "Dunmore Legal Review", metricId: "contractors", spendThisQuarter: 0, riskTier: "low", status: "active", contractEndIso: "2027-05-01" },
  { id: "v-13", name: "Farrow Travel Partners", metricId: "travel", spendThisQuarter: 31000, riskTier: "low", status: "active", contractEndIso: "2027-01-20" },
  { id: "v-14", name: "Summit Conference Group", metricId: "travel", spendThisQuarter: 27000, riskTier: "medium", status: "active", contractEndIso: "2026-12-10" },
  { id: "v-15", name: "Brightwell Facilities Co.", metricId: "facilities", spendThisQuarter: 54000, riskTier: "low", status: "active", contractEndIso: "2027-03-15" },
  { id: "v-16", name: "Cresthaven Office Supply", metricId: "facilities", spendThisQuarter: 23000, riskTier: "low", status: "active", contractEndIso: "2026-10-28" },
  { id: "v-17", name: "Ironhold Security Systems", metricId: "facilities", spendThisQuarter: 20000, riskTier: "medium", status: "active", contractEndIso: "2027-02-01" },
  { id: "v-18", name: "Nordway Brand Studio", metricId: "marketing", spendThisQuarter: 46000, riskTier: "medium", status: "active", contractEndIso: "2026-11-15" },
  { id: "v-19", name: "Castlemere Research Panel", metricId: "marketing", spendThisQuarter: 33000, riskTier: "high", status: "under-review", contractEndIso: "2026-10-30" },
  { id: "v-20", name: "Linden & Vale PR", metricId: "marketing", spendThisQuarter: 18000, riskTier: "low", status: "active", contractEndIso: "2027-06-01" },
];

export type Approval = {
  id: string;
  vendorName: string;
  amount: number;
  submittedBy: string;
  requestedIso: string;
  note: string;
  status: ApprovalStatus;
};

export const INITIAL_APPROVALS: Approval[] = [
  { id: "ap-01", vendorName: "Latticework Compute", amount: 18500, submittedBy: "D. Okafor", requestedIso: "2026-10-24", note: "Burst capacity for Q4 launch window", status: "pending" },
  { id: "ap-02", vendorName: "Wrenfield Ticketing", amount: 9200, submittedBy: "H. Kobori", requestedIso: "2026-10-23", note: "Renewal pending security questionnaire", status: "pending" },
  { id: "ap-03", vendorName: "Meridian Staffing", amount: 24000, submittedBy: "S. Whitfield", requestedIso: "2026-10-22", note: "Extend 2 contractors through December", status: "pending" },
  { id: "ap-04", vendorName: "Castlemere Research Panel", amount: 11000, submittedBy: "N. Vance", requestedIso: "2026-10-21", note: "Scope expanded mid-engagement, no PO update", status: "pending" },
  { id: "ap-05", vendorName: "Summit Conference Group", amount: 6400, submittedBy: "P. Anand", requestedIso: "2026-10-20", note: "Q1 planning offsite deposit", status: "pending" },
  { id: "ap-06", vendorName: "Coppervale QA Partners", amount: 15000, submittedBy: "L. Berger", requestedIso: "2026-10-19", note: "Final invoice ahead of offboarding", status: "pending" },
  { id: "ap-07", vendorName: "Nordway Brand Studio", amount: 8800, submittedBy: "D. Okafor", requestedIso: "2026-10-18", note: "Campaign asset refresh", status: "approved" },
  { id: "ap-08", vendorName: "Northbeam Cloud", amount: 32000, submittedBy: "H. Kobori", requestedIso: "2026-10-17", note: "Reserved instance true-up", status: "approved" },
  { id: "ap-09", vendorName: "Quay Object Storage", amount: 7600, submittedBy: "S. Whitfield", requestedIso: "2026-10-16", note: "Overage fee, no budget line", status: "flagged" },
];

export function metricById(id: MetricId): Metric {
  return METRICS.find((m) => m.id === id) ?? METRICS[0];
}

export function formatUsd(n: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}
