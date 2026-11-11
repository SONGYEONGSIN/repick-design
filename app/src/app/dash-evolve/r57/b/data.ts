import {
  Bell,
  CircleDollarSign,
  Cloud,
  Database,
  FileBarChart2,
  Globe,
  HardDrive,
  Layers,
  MessageSquareDashed,
  Orbit,
  Server,
  Sparkles,
  TrendingUp,
  TriangleAlert,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import type { Direction } from "./tokens";

export const BRAND = { name: "Outlay", Icon: Orbit };

export const CURRENT_USER = {
  name: "Priya Natarajan",
  role: "Platform finance lead",
  email: "priya.natarajan@nimbuscloud.dev",
  avatarId: "1494790108377-be9c29b29330",
};

export const WORKSPACES = [
  { id: "org", name: "Nimbus Cloud Platform", plan: "6 cost centers" },
  { id: "platform-pod", name: "Nimbus Cloud Platform · Platform pod", plan: "1 cost center" },
  { id: "ml-pod", name: "Nimbus Cloud Platform · ML pod", plan: "1 cost center" },
];

export type NavItem = { id: string; label: string; Icon: LucideIcon; active?: boolean; disabled?: boolean };
export const NAV_SECTIONS: { id: string; title: string; items: NavItem[] }[] = [
  {
    id: "work",
    title: "Work",
    items: [
      { id: "spend", label: "Spend", Icon: CircleDollarSign, active: true },
      { id: "cost-centers", label: "Cost centers", Icon: Layers },
      { id: "budgets", label: "Budgets", Icon: Wallet },
      { id: "anomalies", label: "Anomalies", Icon: TriangleAlert },
    ],
  },
  {
    id: "insight",
    title: "Insight",
    items: [
      { id: "forecasts", label: "Forecasts", Icon: TrendingUp, disabled: true },
      { id: "reports", label: "Reports", Icon: FileBarChart2, disabled: true },
    ],
  },
];

export const NOTIFICATIONS = [
  { id: "n1", text: "ML Platform is now 1.26x over its monthly budget after this week's training run", time: "41m ago" },
  { id: "n2", text: "Growth & Marketing Eng crossed 100% of its monthly budget", time: "3h ago" },
  { id: "n3", text: "Customer Support Tooling closed the month 15% under budget", time: "1d ago" },
];

// ---------------------------------------------------------------------------
// Cost centers — the single source of truth. Every derived number shown
// anywhere on this page (KPI row, sunburst angles + headline, cost-center
// rail, hierarchy tree, pinned detail card) is folded from this one list by
// the functions below. Nothing is ever hand-duplicated into a second,
// independently-maintained number.
// ---------------------------------------------------------------------------

export interface CloudService {
  id: string;
  name: string;
  /** Short on-chart label for the sunburst's outer ring — never the full name, chosen by hand
   * so it never needs a mid-word ellipsis. Longest stop is "Observability" at 13 characters;
   * SunburstChart.tsx sizes its label radius against exactly that string. */
  shortLabel: string;
  Icon: LucideIcon;
  /** This month's spend, previous month's spend, the month before that — three fixed points,
   * enough to derive a delta for either period the toggle can show. */
  spend: number;
  prevSpend: number;
  prevPrevSpend: number;
}

export interface CostCenter {
  id: string;
  name: string;
  Icon: LucideIcon;
  /** Flat monthly budget target — independent of which period is on screen. */
  budget: number;
  services: CloudService[];
}

export const COST_CENTERS: CostCenter[] = [
  {
    id: "platform-eng",
    name: "Platform Engineering",
    Icon: Server,
    budget: 340000,
    services: [
      { id: "platform-eng-compute", name: "Compute (EC2 / GKE)", shortLabel: "Compute", Icon: Server, spend: 184500, prevSpend: 178200, prevPrevSpend: 174000 },
      { id: "platform-eng-storage", name: "Object storage", shortLabel: "Storage", Icon: HardDrive, spend: 52300, prevSpend: 50100, prevPrevSpend: 48800 },
      { id: "platform-eng-egress", name: "Data transfer & egress", shortLabel: "Egress", Icon: Globe, spend: 38900, prevSpend: 36700, prevPrevSpend: 35900 },
      { id: "platform-eng-observability", name: "Observability", shortLabel: "Observability", Icon: Sparkles, spend: 41200, prevSpend: 39800, prevPrevSpend: 38700 },
    ],
  },
  {
    id: "data-analytics",
    name: "Data & Analytics",
    Icon: Database,
    budget: 360000,
    services: [
      { id: "data-analytics-compute", name: "Compute (warehouse)", shortLabel: "Compute", Icon: Server, spend: 96200, prevSpend: 93100, prevPrevSpend: 90700 },
      { id: "data-analytics-storage", name: "Object storage", shortLabel: "Storage", Icon: HardDrive, spend: 143800, prevSpend: 138900, prevPrevSpend: 134200 },
      { id: "data-analytics-database", name: "Managed database", shortLabel: "Database", Icon: Database, spend: 88100, prevSpend: 85000, prevPrevSpend: 82100 },
      { id: "data-analytics-observability", name: "Observability", shortLabel: "Observability", Icon: Sparkles, spend: 21300, prevSpend: 20100, prevPrevSpend: 19500 },
    ],
  },
  {
    id: "ml-platform",
    name: "ML Platform",
    Icon: Cloud,
    budget: 450000,
    services: [
      { id: "ml-platform-gpu", name: "GPU training", shortLabel: "GPU Training", Icon: Sparkles, spend: 412600, prevSpend: 322400, prevPrevSpend: 265000 },
      { id: "ml-platform-storage", name: "Object storage", shortLabel: "Storage", Icon: HardDrive, spend: 76400, prevSpend: 70100, prevPrevSpend: 66200 },
      { id: "ml-platform-compute", name: "Compute (serving)", shortLabel: "Compute", Icon: Server, spend: 58300, prevSpend: 55900, prevPrevSpend: 53600 },
      { id: "ml-platform-observability", name: "Observability", shortLabel: "Observability", Icon: Sparkles, spend: 19800, prevSpend: 18700, prevPrevSpend: 17900 },
    ],
  },
  {
    id: "payments",
    name: "Payments",
    Icon: Wallet,
    budget: 300000,
    services: [
      { id: "payments-database", name: "Managed database", shortLabel: "Database", Icon: Database, spend: 142300, prevSpend: 139800, prevPrevSpend: 136900 },
      { id: "payments-compute", name: "Compute (EC2 / GKE)", shortLabel: "Compute", Icon: Server, spend: 64800, prevSpend: 63100, prevPrevSpend: 61200 },
      { id: "payments-egress", name: "Data transfer & egress", shortLabel: "Egress", Icon: Globe, spend: 28900, prevSpend: 27600, prevPrevSpend: 26500 },
      { id: "payments-queue", name: "Message queue", shortLabel: "Queue", Icon: MessageSquareDashed, spend: 33100, prevSpend: 32400, prevPrevSpend: 31500 },
    ],
  },
  {
    id: "growth-marketing",
    name: "Growth & Marketing Eng",
    Icon: Users,
    budget: 260000,
    services: [
      { id: "growth-marketing-cdn", name: "CDN & edge", shortLabel: "CDN", Icon: Globe, spend: 87400, prevSpend: 81200, prevPrevSpend: 76900 },
      { id: "growth-marketing-compute", name: "Compute (EC2 / GKE)", shortLabel: "Compute", Icon: Server, spend: 112600, prevSpend: 109800, prevPrevSpend: 107100 },
      { id: "growth-marketing-database", name: "Managed database", shortLabel: "Database", Icon: Database, spend: 39200, prevSpend: 37900, prevPrevSpend: 36600 },
      { id: "growth-marketing-storage", name: "Object storage", shortLabel: "Storage", Icon: HardDrive, spend: 24800, prevSpend: 23700, prevPrevSpend: 22900 },
    ],
  },
  {
    id: "support-tooling",
    name: "Customer Support Tooling",
    Icon: Bell,
    budget: 200000,
    services: [
      { id: "support-tooling-compute", name: "Compute (EC2 / GKE)", shortLabel: "Compute", Icon: Server, spend: 71200, prevSpend: 70100, prevPrevSpend: 68900 },
      { id: "support-tooling-database", name: "Managed database", shortLabel: "Database", Icon: Database, spend: 58600, prevSpend: 56300, prevPrevSpend: 54700 },
      { id: "support-tooling-queue", name: "Message queue", shortLabel: "Queue", Icon: MessageSquareDashed, spend: 21900, prevSpend: 20800, prevPrevSpend: 20100 },
      { id: "support-tooling-observability", name: "Observability", shortLabel: "Observability", Icon: Sparkles, spend: 18300, prevSpend: 17600, prevPrevSpend: 17000 },
    ],
  },
];

export type PeriodMode = "this" | "last";
export const PERIOD_OPTIONS: { id: PeriodMode; label: string; fullLabel: string }[] = [
  { id: "this", label: "This month", fullLabel: "This month vs. last month" },
  { id: "last", label: "Last month", fullLabel: "Last month vs. two months ago" },
];

/** The one place that reads a service's raw spend for a given period toggle state. */
export function serviceSpendAt(s: CloudService, period: PeriodMode): number {
  return period === "this" ? s.spend : s.prevSpend;
}

/** The one place that reads a service's comparison baseline for a given period toggle state. */
export function serviceBaselineAt(s: CloudService, period: PeriodMode): number {
  return period === "this" ? s.prevSpend : s.prevPrevSpend;
}

export function costCenterSpendAt(c: CostCenter, period: PeriodMode): number {
  return c.services.reduce((sum, s) => sum + serviceSpendAt(s, period), 0);
}

export function costCenterBaselineAt(c: CostCenter, period: PeriodMode): number {
  return c.services.reduce((sum, s) => sum + serviceBaselineAt(s, period), 0);
}

export function orgSpendAt(period: PeriodMode): number {
  return COST_CENTERS.reduce((sum, c) => sum + costCenterSpendAt(c, period), 0);
}

export function orgBaselineAt(period: PeriodMode): number {
  return COST_CENTERS.reduce((sum, c) => sum + costCenterBaselineAt(c, period), 0);
}

export interface PeriodDelta {
  current: number;
  baseline: number;
  delta: number;
  pct: number;
  direction: Direction;
}

function toDelta(current: number, baseline: number): PeriodDelta {
  const delta = current - baseline;
  const pct = baseline === 0 ? 0 : (delta / baseline) * 100;
  const direction: Direction = delta > 0 ? "up" : delta < 0 ? "down" : "flat";
  return { current, baseline, delta, pct, direction };
}

export function costCenterDeltaAt(c: CostCenter, period: PeriodMode): PeriodDelta {
  return toDelta(costCenterSpendAt(c, period), costCenterBaselineAt(c, period));
}

export function orgDeltaAt(period: PeriodMode): PeriodDelta {
  return toDelta(orgSpendAt(period), orgBaselineAt(period));
}

/** Share of the org total, for a cost center OR a single service — the exact fraction the
 * sunburst's arcs are drawn from, so the printed percentage and the wedge angle can never
 * disagree. */
export function orgSharePct(spend: number, period: PeriodMode): number {
  const total = orgSpendAt(period);
  return total === 0 ? 0 : (spend / total) * 100;
}

/** The cost center with the single largest absolute dollar move this period — read once, used
 * by the KPI row and the sunburst's own "top mover" caption alike. */
export function topMoverAt(period: PeriodMode): { center: CostCenter; delta: PeriodDelta } {
  let best = COST_CENTERS[0];
  let bestDelta = costCenterDeltaAt(best, period);
  for (const c of COST_CENTERS.slice(1)) {
    const d = costCenterDeltaAt(c, period);
    if (Math.abs(d.delta) > Math.abs(bestDelta.delta)) {
      best = c;
      bestDelta = d;
    }
  }
  return { center: best, delta: bestDelta };
}

export interface BudgetStatus {
  spend: number;
  budget: number;
  utilizationPct: number;
  multiplier: number;
  overBudget: boolean;
}

export function budgetStatusAt(c: CostCenter, period: PeriodMode): BudgetStatus {
  const spend = costCenterSpendAt(c, period);
  const utilizationPct = (spend / c.budget) * 100;
  return { spend, budget: c.budget, utilizationPct, multiplier: spend / c.budget, overBudget: spend > c.budget };
}

export function costCentersOverBudgetAt(period: PeriodMode): CostCenter[] {
  return COST_CENTERS.filter((c) => budgetStatusAt(c, period).overBudget);
}

export function costCenterById(id: string): CostCenter | undefined {
  return COST_CENTERS.find((c) => c.id === id);
}

export function serviceById(id: string): { center: CostCenter; service: CloudService } | undefined {
  for (const center of COST_CENTERS) {
    const service = center.services.find((s) => s.id === id);
    if (service) return { center, service };
  }
  return undefined;
}

export const SEARCH_ENTRIES = [
  ...COST_CENTERS.map((c) => ({ id: c.id, kind: "center" as const, title: c.name, meta: `Cost center · ${c.services.length} services`, Icon: c.Icon })),
  ...COST_CENTERS.flatMap((c) => c.services.map((s) => ({ id: s.id, kind: "service" as const, title: s.name, meta: `${c.name} · service`, Icon: s.Icon }))),
];

export const CURRENCY = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
export const COMPACT_CURRENCY = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", notation: "compact", maximumFractionDigits: 1 });
const PERCENT_ONE = new Intl.NumberFormat("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const MULTIPLIER = new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function formatCurrency(n: number): string {
  return CURRENCY.format(n);
}

export function formatCompactCurrency(n: number): string {
  return COMPACT_CURRENCY.format(n);
}

export function formatPercent(n: number): string {
  return `${PERCENT_ONE.format(n)}%`;
}

export function formatSignedCurrency(n: number): string {
  const sign = n > 0 ? "+" : n < 0 ? "−" : "";
  return `${sign}${CURRENCY.format(Math.abs(n))}`;
}

export function formatSignedPercent(n: number): string {
  const sign = n > 0 ? "+" : n < 0 ? "−" : "";
  return `${sign}${PERCENT_ONE.format(Math.abs(n))}%`;
}

export function formatMultiplier(n: number): string {
  return `${MULTIPLIER.format(n)}x`;
}
