/**
 * Strata — headcount & budget allocation console (r54 / candidate c).
 *
 * Every number below is a hand-entered leaf fact (quarterly actual spend in whole US dollars, by
 * department x cost-type x quarter). Every subtotal — department totals, cost-type totals, the
 * company total, variance-vs-target — is DERIVED from these leaves by plain reduction in the
 * helper functions further down, never hand-duplicated, so the treemap (whichever grouping is
 * active), the KPI strip and the records table always reconcile to the same dollar. There is no
 * `Math.random()`, `Date.now()` or `new Date()` anywhere in this module; "Q4 2026" / "Q3 2026" are
 * fixed display labels, not computed from the system clock.
 */

import type { LucideIcon } from "lucide-react";
import { Banknote, Building2, Globe2, HandCoins, Headset, Megaphone, MonitorSmartphone, Plane, Scale, ServerCog, Users } from "lucide-react";

export type Quarter = "q4-2026" | "q3-2026";

export const QUARTERS: { value: Quarter; label: string }[] = [
  { value: "q4-2026", label: "Q4 2026" },
  { value: "q3-2026", label: "Q3 2026" },
];

export type Grouping = "department" | "costType";

export const GROUPINGS: { value: Grouping; label: string }[] = [
  { value: "department", label: "By department" },
  { value: "costType", label: "By cost type" },
];

export type DepartmentId = "engineering" | "sales" | "marketing" | "customer-success" | "people-ops" | "finance-legal";

export const DEPARTMENT_ORDER: DepartmentId[] = ["engineering", "sales", "marketing", "customer-success", "people-ops", "finance-legal"];

export const DEPARTMENT_META: Record<DepartmentId, { name: string; icon: LucideIcon; quarterlyTarget: number; headcount: number }> = {
  engineering: { name: "Engineering", icon: ServerCog, quarterlyTarget: 2_750_000, headcount: 128 },
  sales: { name: "Sales", icon: HandCoins, quarterlyTarget: 1_250_000, headcount: 64 },
  marketing: { name: "Marketing", icon: Megaphone, quarterlyTarget: 800_000, headcount: 38 },
  "customer-success": { name: "Customer Success", icon: Headset, quarterlyTarget: 900_000, headcount: 52 },
  "people-ops": { name: "People Ops", icon: Users, quarterlyTarget: 320_000, headcount: 18 },
  "finance-legal": { name: "Finance & Legal", icon: Scale, quarterlyTarget: 420_000, headcount: 22 },
};

export type CostTypeId = "salary-benefits" | "contractors" | "software-tools" | "travel-events" | "facilities";

export const COST_TYPE_ORDER: CostTypeId[] = ["salary-benefits", "contractors", "software-tools", "travel-events", "facilities"];

export const COST_TYPE_META: Record<CostTypeId, { name: string; icon: LucideIcon; quarterlyTarget: number }> = {
  "salary-benefits": { name: "Salary & Benefits", icon: Banknote, quarterlyTarget: 4_900_000 },
  contractors: { name: "Contractors", icon: Building2, quarterlyTarget: 480_000 },
  "software-tools": { name: "Software & Tools", icon: MonitorSmartphone, quarterlyTarget: 600_000 },
  "travel-events": { name: "Travel & Events", icon: Plane, quarterlyTarget: 300_000 },
  facilities: { name: "Facilities", icon: Globe2, quarterlyTarget: 260_000 },
};

/** actual[quarter][department][costType] — the single source of truth every total is reduced from. */
const ACTUAL: Record<Quarter, Record<DepartmentId, Record<CostTypeId, number>>> = {
  "q4-2026": {
    engineering: { "salary-benefits": 2_180_000, contractors: 240_000, "software-tools": 310_000, "travel-events": 42_000, facilities: 96_000 },
    sales: { "salary-benefits": 980_000, contractors: 60_000, "software-tools": 85_000, "travel-events": 140_000, facilities: 54_000 },
    marketing: { "salary-benefits": 540_000, contractors: 180_000, "software-tools": 95_000, "travel-events": 88_000, facilities: 30_000 },
    "customer-success": { "salary-benefits": 720_000, contractors: 40_000, "software-tools": 62_000, "travel-events": 24_000, facilities: 40_000 },
    "people-ops": { "salary-benefits": 260_000, contractors: 18_000, "software-tools": 34_000, "travel-events": 12_000, facilities: 16_000 },
    "finance-legal": { "salary-benefits": 310_000, contractors: 54_000, "software-tools": 28_000, "travel-events": 8_000, facilities: 18_000 },
  },
  "q3-2026": {
    engineering: { "salary-benefits": 2_090_000, contractors: 205_000, "software-tools": 298_000, "travel-events": 36_000, facilities: 94_000 },
    sales: { "salary-benefits": 940_000, contractors: 52_000, "software-tools": 80_000, "travel-events": 110_000, facilities: 52_000 },
    marketing: { "salary-benefits": 520_000, contractors: 150_000, "software-tools": 90_000, "travel-events": 70_000, facilities: 29_000 },
    "customer-success": { "salary-benefits": 690_000, contractors: 36_000, "software-tools": 58_000, "travel-events": 20_000, facilities: 38_000 },
    "people-ops": { "salary-benefits": 248_000, contractors: 16_000, "software-tools": 31_000, "travel-events": 10_000, facilities: 15_000 },
    "finance-legal": { "salary-benefits": 300_000, contractors: 48_000, "software-tools": 26_000, "travel-events": 7_000, facilities: 17_000 },
  },
};

export function departmentTotal(quarter: Quarter, departmentId: DepartmentId): number {
  const row = ACTUAL[quarter][departmentId];
  return COST_TYPE_ORDER.reduce((sum, c) => sum + row[c], 0);
}

export function costTypeTotal(quarter: Quarter, costTypeId: CostTypeId): number {
  return DEPARTMENT_ORDER.reduce((sum, d) => sum + ACTUAL[quarter][d][costTypeId], 0);
}

export function companyTotal(quarter: Quarter): number {
  return DEPARTMENT_ORDER.reduce((sum, d) => sum + departmentTotal(quarter, d), 0);
}

export function companyTarget(grouping: Grouping): number {
  return grouping === "department"
    ? DEPARTMENT_ORDER.reduce((sum, d) => sum + DEPARTMENT_META[d].quarterlyTarget, 0)
    : COST_TYPE_ORDER.reduce((sum, c) => sum + COST_TYPE_META[c].quarterlyTarget, 0);
}

export function breakdownByCostType(quarter: Quarter, departmentId: DepartmentId): { id: CostTypeId; value: number }[] {
  const row = ACTUAL[quarter][departmentId];
  return COST_TYPE_ORDER.map((c) => ({ id: c, value: row[c] }));
}

export function breakdownByDepartment(quarter: Quarter, costTypeId: CostTypeId): { id: DepartmentId; value: number }[] {
  return DEPARTMENT_ORDER.map((d) => ({ id: d, value: ACTUAL[quarter][d][costTypeId] }));
}

export type Severity = "within" | "mild" | "moderate" | "severe";

/** variancePct > 0 means over target. Thresholds: <=0 within, <=5% mild, <=15% moderate, else severe. */
export function classifySeverity(variancePct: number): Severity {
  if (variancePct <= 0) return "within";
  if (variancePct <= 5) return "mild";
  if (variancePct <= 15) return "moderate";
  return "severe";
}

export function variancePct(actual: number, target: number): number {
  return ((actual - target) / target) * 100;
}

/**
 * Six-quarter trend history ending exactly at the Q4 2026 actual, so the sparkline's last point
 * always ties back to the number shown on the tile. Fixed, hand-authored — not derived from the
 * random walk a generator would produce, but not required to sum to anything else either (a
 * trend line is a separate planning artifact from the quarter-over-quarter actual matrix above).
 */
export const DEPARTMENT_TREND: Record<DepartmentId, number[]> = {
  engineering: [2_340_000, 2_410_000, 2_560_000, 2_610_000, 2_723_000, 2_868_000],
  sales: [1_080_000, 1_110_000, 1_150_000, 1_190_000, 1_234_000, 1_319_000],
  marketing: [620_000, 660_000, 700_000, 780_000, 859_000, 933_000],
  "customer-success": [760_000, 790_000, 810_000, 830_000, 842_000, 886_000],
  "people-ops": [260_000, 275_000, 290_000, 305_000, 320_000, 340_000],
  "finance-legal": [360_000, 370_000, 378_000, 385_000, 398_000, 418_000],
};

export const COST_TYPE_TREND: Record<CostTypeId, number[]> = {
  "salary-benefits": [4_280_000, 4_360_000, 4_480_000, 4_610_000, 4_788_000, 4_990_000],
  contractors: [360_000, 380_000, 410_000, 460_000, 507_000, 592_000],
  "software-tools": [480_000, 500_000, 520_000, 550_000, 583_000, 614_000],
  "travel-events": [190_000, 205_000, 220_000, 235_000, 253_000, 314_000],
  facilities: [210_000, 218_000, 226_000, 236_000, 245_000, 254_000],
};

export const TREND_QUARTER_LABELS = ["Q3 '25", "Q4 '25", "Q1 '26", "Q2 '26", "Q3 '26", "Q4 '26"];

export type RecordStatus = "approved" | "pending" | "flagged";

export type BudgetLineItem = {
  id: string;
  description: string;
  departmentId: DepartmentId;
  costTypeId: CostTypeId;
  quarter: Quarter;
  amount: number;
  status: RecordStatus;
};

export const LINE_ITEMS: BudgetLineItem[] = [
  { id: "li-01", description: "Cloud infrastructure true-up", departmentId: "engineering", costTypeId: "software-tools", quarter: "q4-2026", amount: 84_000, status: "approved" },
  { id: "li-02", description: "Platform reliability contractor sprint", departmentId: "engineering", costTypeId: "contractors", quarter: "q4-2026", amount: 112_000, status: "flagged" },
  { id: "li-03", description: "Annual engineering offsite", departmentId: "engineering", costTypeId: "travel-events", quarter: "q4-2026", amount: 26_000, status: "approved" },
  { id: "li-04", description: "Q3 security audit contractors", departmentId: "engineering", costTypeId: "contractors", quarter: "q3-2026", amount: 68_000, status: "approved" },
  { id: "li-05", description: "Enterprise CRM renewal", departmentId: "sales", costTypeId: "software-tools", quarter: "q4-2026", amount: 38_000, status: "approved" },
  { id: "li-06", description: "Regional sales kickoff travel", departmentId: "sales", costTypeId: "travel-events", quarter: "q4-2026", amount: 64_000, status: "flagged" },
  { id: "li-07", description: "Field office lease, Austin", departmentId: "sales", costTypeId: "facilities", quarter: "q4-2026", amount: 22_000, status: "approved" },
  { id: "li-08", description: "Partner conference sponsorship", departmentId: "sales", costTypeId: "travel-events", quarter: "q3-2026", amount: 41_000, status: "approved" },
  { id: "li-09", description: "Paid social campaign surge", departmentId: "marketing", costTypeId: "contractors", quarter: "q4-2026", amount: 95_000, status: "flagged" },
  { id: "li-10", description: "Brand agency retainer", departmentId: "marketing", costTypeId: "contractors", quarter: "q4-2026", amount: 85_000, status: "pending" },
  { id: "li-11", description: "Field marketing event series", departmentId: "marketing", costTypeId: "travel-events", quarter: "q4-2026", amount: 48_000, status: "pending" },
  { id: "li-12", description: "Lifecycle email platform renewal", departmentId: "marketing", costTypeId: "software-tools", quarter: "q3-2026", amount: 29_000, status: "approved" },
  { id: "li-13", description: "Support tooling consolidation", departmentId: "customer-success", costTypeId: "software-tools", quarter: "q4-2026", amount: 31_000, status: "approved" },
  { id: "li-14", description: "Onsite customer training", departmentId: "customer-success", costTypeId: "travel-events", quarter: "q4-2026", amount: 14_000, status: "approved" },
  { id: "li-15", description: "Overflow support contractors", departmentId: "customer-success", costTypeId: "contractors", quarter: "q3-2026", amount: 22_000, status: "approved" },
  { id: "li-16", description: "HR information system upgrade", departmentId: "people-ops", costTypeId: "software-tools", quarter: "q4-2026", amount: 18_000, status: "pending" },
  { id: "li-17", description: "Benefits broker fee", departmentId: "people-ops", costTypeId: "contractors", quarter: "q4-2026", amount: 11_000, status: "approved" },
  { id: "li-18", description: "Annual compliance training travel", departmentId: "people-ops", costTypeId: "travel-events", quarter: "q3-2026", amount: 6_000, status: "approved" },
  { id: "li-19", description: "Outside counsel — vendor contracts", departmentId: "finance-legal", costTypeId: "contractors", quarter: "q4-2026", amount: 34_000, status: "approved" },
  { id: "li-20", description: "Audit firm engagement", departmentId: "finance-legal", costTypeId: "contractors", quarter: "q3-2026", amount: 29_000, status: "approved" },
  { id: "li-21", description: "Treasury system subscription", departmentId: "finance-legal", costTypeId: "software-tools", quarter: "q4-2026", amount: 9_000, status: "pending" },
];

export function lineItemsForDepartment(departmentId: DepartmentId): BudgetLineItem[] {
  return LINE_ITEMS.filter((li) => li.departmentId === departmentId);
}

export function lineItemsForCostType(costTypeId: CostTypeId): BudgetLineItem[] {
  return LINE_ITEMS.filter((li) => li.costTypeId === costTypeId);
}

export function companyHeadcount(): number {
  return DEPARTMENT_ORDER.reduce((sum, d) => sum + DEPARTMENT_META[d].headcount, 0);
}

export function flaggedLineItemCount(): number {
  return LINE_ITEMS.filter((li) => li.status === "flagged").length;
}
