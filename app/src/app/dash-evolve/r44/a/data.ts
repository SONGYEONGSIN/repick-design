import type { LucideIcon } from "lucide-react";
import { BrainCircuit, Boxes, CreditCard, Database, HardDrive, Megaphone, Network, Server } from "lucide-react";

/**
 * All figures below are hand-entered leaf facts (per-resource monthly cost, in whole US dollars,
 * and utilization). Every category subtotal, team subtotal and company-wide total is DERIVED from
 * these leaves by plain reduction in the helper functions further down — never hand-duplicated —
 * so the treemap, the tree-table fallback, the KPI row and the resources table always reconcile to
 * the same cent. There is no `Math.random()`, `Date.now()` or `new Date()` anywhere in this module;
 * "this month" / "last month" are fixed display labels, not computed from the system clock.
 */

export type Period = "this-month" | "last-month";

export const PERIODS: { value: Period; label: string }[] = [
  { value: "this-month", label: "October 2026" },
  { value: "last-month", label: "September 2026" },
];

export type CategoryId = "compute" | "storage" | "database" | "networking";

export const CATEGORY_ORDER: CategoryId[] = ["compute", "storage", "database", "networking"];

export const CATEGORY_META: Record<CategoryId, { label: string; icon: LucideIcon }> = {
  compute: { label: "Compute", icon: Server },
  storage: { label: "Storage", icon: HardDrive },
  database: { label: "Database", icon: Database },
  networking: { label: "Networking", icon: Network },
};

export type TeamId = "platform" | "payments" | "growth" | "dataml";

export const TEAM_ORDER: TeamId[] = ["platform", "payments", "growth", "dataml"];

export const TEAM_META: Record<TeamId, { name: string; icon: LucideIcon; monthlyBudget: number }> = {
  platform: { name: "Platform Engineering", icon: Boxes, monthlyBudget: 40000 },
  payments: { name: "Payments", icon: CreditCard, monthlyBudget: 42000 },
  growth: { name: "Growth Marketing", icon: Megaphone, monthlyBudget: 24000 },
  dataml: { name: "Data & ML", icon: BrainCircuit, monthlyBudget: 40000 },
};

export type ResourceStatus = "optimized" | "idle" | "anomalous";

export type Resource = {
  id: string;
  name: string;
  teamId: TeamId;
  categoryId: CategoryId;
  costThisMonth: number;
  costLastMonth: number;
  utilizationPct: number;
  status: ResourceStatus;
};

export const RESOURCES: Resource[] = [
  // Platform Engineering
  { id: "platform-api-gateway", name: "platform-api-gateway", teamId: "platform", categoryId: "compute", costThisMonth: 8400, costLastMonth: 7900, utilizationPct: 78, status: "optimized" },
  { id: "platform-auth-service", name: "platform-auth-service", teamId: "platform", categoryId: "compute", costThisMonth: 5200, costLastMonth: 5400, utilizationPct: 64, status: "optimized" },
  { id: "platform-ci-runners", name: "platform-ci-runners", teamId: "platform", categoryId: "compute", costThisMonth: 3100, costLastMonth: 2600, utilizationPct: 41, status: "idle" },
  { id: "platform-assets-bucket", name: "platform-assets-bucket", teamId: "platform", categoryId: "storage", costThisMonth: 1200, costLastMonth: 1150, utilizationPct: 55, status: "optimized" },
  { id: "platform-backups-bucket", name: "platform-backups-bucket", teamId: "platform", categoryId: "storage", costThisMonth: 2600, costLastMonth: 2500, utilizationPct: 30, status: "idle" },
  { id: "platform-logs-bucket", name: "platform-logs-bucket", teamId: "platform", categoryId: "storage", costThisMonth: 1800, costLastMonth: 1400, utilizationPct: 88, status: "anomalous" },
  { id: "platform-primary-db", name: "platform-primary-db", teamId: "platform", categoryId: "database", costThisMonth: 6200, costLastMonth: 6100, utilizationPct: 82, status: "optimized" },
  { id: "platform-replica-db", name: "platform-replica-db", teamId: "platform", categoryId: "database", costThisMonth: 3400, costLastMonth: 3350, utilizationPct: 70, status: "optimized" },
  { id: "platform-cache-cluster", name: "platform-cache-cluster", teamId: "platform", categoryId: "database", costThisMonth: 2200, costLastMonth: 2150, utilizationPct: 60, status: "optimized" },
  { id: "platform-cdn-egress", name: "platform-cdn-egress", teamId: "platform", categoryId: "networking", costThisMonth: 2100, costLastMonth: 1950, utilizationPct: 50, status: "optimized" },
  { id: "platform-load-balancer", name: "platform-load-balancer", teamId: "platform", categoryId: "networking", costThisMonth: 1400, costLastMonth: 1380, utilizationPct: 66, status: "optimized" },
  { id: "platform-vpc-peering", name: "platform-vpc-peering", teamId: "platform", categoryId: "networking", costThisMonth: 900, costLastMonth: 890, utilizationPct: 35, status: "idle" },

  // Payments
  { id: "payments-ledger-api", name: "payments-ledger-api", teamId: "payments", categoryId: "compute", costThisMonth: 9800, costLastMonth: 9200, utilizationPct: 85, status: "optimized" },
  { id: "payments-fraud-worker", name: "payments-fraud-worker", teamId: "payments", categoryId: "compute", costThisMonth: 6100, costLastMonth: 5800, utilizationPct: 73, status: "optimized" },
  { id: "payments-settlement-batch", name: "payments-settlement-batch", teamId: "payments", categoryId: "compute", costThisMonth: 4300, costLastMonth: 4500, utilizationPct: 58, status: "optimized" },
  { id: "payments-assets-bucket", name: "payments-assets-bucket", teamId: "payments", categoryId: "storage", costThisMonth: 900, costLastMonth: 880, utilizationPct: 40, status: "idle" },
  { id: "payments-backups-bucket", name: "payments-backups-bucket", teamId: "payments", categoryId: "storage", costThisMonth: 2100, costLastMonth: 2050, utilizationPct: 33, status: "idle" },
  { id: "payments-logs-bucket", name: "payments-logs-bucket", teamId: "payments", categoryId: "storage", costThisMonth: 1500, costLastMonth: 1480, utilizationPct: 62, status: "optimized" },
  { id: "payments-primary-db", name: "payments-primary-db", teamId: "payments", categoryId: "database", costThisMonth: 8900, costLastMonth: 8700, utilizationPct: 91, status: "optimized" },
  { id: "payments-replica-db", name: "payments-replica-db", teamId: "payments", categoryId: "database", costThisMonth: 4200, costLastMonth: 4150, utilizationPct: 77, status: "optimized" },
  { id: "payments-cache-cluster", name: "payments-cache-cluster", teamId: "payments", categoryId: "database", costThisMonth: 1900, costLastMonth: 1850, utilizationPct: 68, status: "optimized" },
  { id: "payments-cdn-egress", name: "payments-cdn-egress", teamId: "payments", categoryId: "networking", costThisMonth: 1700, costLastMonth: 1650, utilizationPct: 44, status: "optimized" },
  { id: "payments-load-balancer", name: "payments-load-balancer", teamId: "payments", categoryId: "networking", costThisMonth: 1300, costLastMonth: 1280, utilizationPct: 59, status: "optimized" },
  { id: "payments-vpc-peering", name: "payments-vpc-peering", teamId: "payments", categoryId: "networking", costThisMonth: 2800, costLastMonth: 1200, utilizationPct: 22, status: "anomalous" },

  // Growth Marketing
  { id: "growth-campaign-api", name: "growth-campaign-api", teamId: "growth", categoryId: "compute", costThisMonth: 4100, costLastMonth: 3900, utilizationPct: 52, status: "optimized" },
  { id: "growth-attribution-worker", name: "growth-attribution-worker", teamId: "growth", categoryId: "compute", costThisMonth: 3300, costLastMonth: 3100, utilizationPct: 48, status: "optimized" },
  { id: "growth-ab-test-runner", name: "growth-ab-test-runner", teamId: "growth", categoryId: "compute", costThisMonth: 2200, costLastMonth: 2600, utilizationPct: 36, status: "idle" },
  { id: "growth-assets-bucket", name: "growth-assets-bucket", teamId: "growth", categoryId: "storage", costThisMonth: 2600, costLastMonth: 2400, utilizationPct: 70, status: "optimized" },
  { id: "growth-backups-bucket", name: "growth-backups-bucket", teamId: "growth", categoryId: "storage", costThisMonth: 900, costLastMonth: 890, utilizationPct: 28, status: "idle" },
  { id: "growth-logs-bucket", name: "growth-logs-bucket", teamId: "growth", categoryId: "storage", costThisMonth: 1100, costLastMonth: 1050, utilizationPct: 54, status: "optimized" },
  { id: "growth-primary-db", name: "growth-primary-db", teamId: "growth", categoryId: "database", costThisMonth: 3800, costLastMonth: 3700, utilizationPct: 65, status: "optimized" },
  { id: "growth-replica-db", name: "growth-replica-db", teamId: "growth", categoryId: "database", costThisMonth: 1900, costLastMonth: 1850, utilizationPct: 50, status: "optimized" },
  { id: "growth-cache-cluster", name: "growth-cache-cluster", teamId: "growth", categoryId: "database", costThisMonth: 1200, costLastMonth: 1180, utilizationPct: 44, status: "optimized" },
  { id: "growth-cdn-egress", name: "growth-cdn-egress", teamId: "growth", categoryId: "networking", costThisMonth: 3400, costLastMonth: 2100, utilizationPct: 80, status: "anomalous" },
  { id: "growth-load-balancer", name: "growth-load-balancer", teamId: "growth", categoryId: "networking", costThisMonth: 800, costLastMonth: 790, utilizationPct: 38, status: "idle" },
  { id: "growth-vpc-peering", name: "growth-vpc-peering", teamId: "growth", categoryId: "networking", costThisMonth: 600, costLastMonth: 590, utilizationPct: 20, status: "idle" },

  // Data & ML
  { id: "ml-feature-pipeline", name: "ml-feature-pipeline", teamId: "dataml", categoryId: "compute", costThisMonth: 7200, costLastMonth: 6800, utilizationPct: 74, status: "optimized" },
  { id: "ml-training-cluster", name: "ml-training-cluster", teamId: "dataml", categoryId: "compute", costThisMonth: 11400, costLastMonth: 9200, utilizationPct: 92, status: "optimized" },
  { id: "ml-inference-api", name: "ml-inference-api", teamId: "dataml", categoryId: "compute", costThisMonth: 5300, costLastMonth: 5100, utilizationPct: 69, status: "optimized" },
  { id: "ml-assets-bucket", name: "ml-assets-bucket", teamId: "dataml", categoryId: "storage", costThisMonth: 3100, costLastMonth: 2900, utilizationPct: 61, status: "optimized" },
  { id: "ml-backups-bucket", name: "ml-backups-bucket", teamId: "dataml", categoryId: "storage", costThisMonth: 1400, costLastMonth: 1380, utilizationPct: 29, status: "idle" },
  { id: "ml-logs-bucket", name: "ml-logs-bucket", teamId: "dataml", categoryId: "storage", costThisMonth: 2000, costLastMonth: 1850, utilizationPct: 57, status: "optimized" },
  { id: "ml-primary-db", name: "ml-primary-db", teamId: "dataml", categoryId: "database", costThisMonth: 4600, costLastMonth: 4500, utilizationPct: 71, status: "optimized" },
  { id: "ml-replica-db", name: "ml-replica-db", teamId: "dataml", categoryId: "database", costThisMonth: 2300, costLastMonth: 2250, utilizationPct: 55, status: "optimized" },
  { id: "ml-cache-cluster", name: "ml-cache-cluster", teamId: "dataml", categoryId: "database", costThisMonth: 1700, costLastMonth: 1650, utilizationPct: 63, status: "optimized" },
  { id: "ml-cdn-egress", name: "ml-cdn-egress", teamId: "dataml", categoryId: "networking", costThisMonth: 1900, costLastMonth: 1840, utilizationPct: 42, status: "optimized" },
  { id: "ml-load-balancer", name: "ml-load-balancer", teamId: "dataml", categoryId: "networking", costThisMonth: 1100, costLastMonth: 1080, utilizationPct: 39, status: "idle" },
  { id: "ml-vpc-peering", name: "ml-vpc-peering", teamId: "dataml", categoryId: "networking", costThisMonth: 2600, costLastMonth: 2550, utilizationPct: 48, status: "optimized" },
];

/** Cloud spend that sits outside every team's allocation (shared platform overhead, un-tagged
 *  resources). Fixed per period — it is a company-level figure, not a sum of the resources above,
 *  by definition (that is what "unallocated" means), so it deliberately does not reconcile into
 *  any team or category total. */
export const UNALLOCATED_SPEND: Record<Period, number> = {
  "this-month": 6200,
  "last-month": 5800,
};

function costField(period: Period): "costThisMonth" | "costLastMonth" {
  return period === "this-month" ? "costThisMonth" : "costLastMonth";
}

export function resourceCost(resource: Resource, period: Period): number {
  return resource[costField(period)];
}

export function resourcesForTeam(teamId: TeamId): Resource[] {
  return RESOURCES.filter((r) => r.teamId === teamId);
}

export function resourcesForTeamAndCategory(teamId: TeamId, categoryId: CategoryId): Resource[] {
  return RESOURCES.filter((r) => r.teamId === teamId && r.categoryId === categoryId);
}

export function categoryTotal(teamId: TeamId, categoryId: CategoryId, period: Period): number {
  return resourcesForTeamAndCategory(teamId, categoryId).reduce((sum, r) => sum + resourceCost(r, period), 0);
}

export function teamTotal(teamId: TeamId, period: Period): number {
  return resourcesForTeam(teamId).reduce((sum, r) => sum + resourceCost(r, period), 0);
}

export function companyTeamsTotal(period: Period): number {
  return TEAM_ORDER.reduce((sum, id) => sum + teamTotal(id, period), 0);
}

export function companyTotal(period: Period): number {
  return companyTeamsTotal(period) + UNALLOCATED_SPEND[period];
}

export function companyBudget(): number {
  return TEAM_ORDER.reduce((sum, id) => sum + TEAM_META[id].monthlyBudget, 0);
}

export function budgetVariancePct(actual: number, budget: number): number {
  return ((actual - budget) / budget) * 100;
}

export function anomalousResources(): Resource[] {
  return RESOURCES.filter((r) => r.status === "anomalous");
}

export function resourceById(id: string): Resource | undefined {
  return RESOURCES.find((r) => r.id === id);
}

/** Average utilization of a resource's sibling category within its team — used by the pinned
 *  resource comparison card to answer "vs. category average" without any extra data entry. */
export function categoryAverageUtilization(teamId: TeamId, categoryId: CategoryId): number {
  const peers = resourcesForTeamAndCategory(teamId, categoryId);
  if (peers.length === 0) return 0;
  return peers.reduce((sum, r) => sum + r.utilizationPct, 0) / peers.length;
}
