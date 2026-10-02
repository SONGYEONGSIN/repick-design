import { Boxes, Compass, Globe2, Layers3, LucideIcon, Radar, Server, Tag } from "lucide-react";
import type { LevelName } from "./tokens";

export const BRAND = { name: "Fathom", Icon: Radar };

export const CURRENT_USER = {
  name: "Dana Reyes",
  role: "FinOps lead",
  email: "dana.reyes@fathomcloud.io",
  avatarId: "1607746882042-944635dfe10e",
};

export const WORKSPACES = [
  { id: "prod", name: "Production estate", plan: "4 regions" },
  { id: "staging", name: "Staging estate", plan: "2 regions" },
  { id: "sandbox", name: "Sandbox estate", plan: "1 region" },
];

export type NavItem = { id: string; label: string; Icon: LucideIcon; active?: boolean; disabled?: boolean };
export const NAV_SECTIONS: { id: string; title: string; items: NavItem[] }[] = [
  {
    id: "investigate",
    title: "Investigate",
    items: [
      { id: "rca", label: "Cost root cause", Icon: Compass, active: true },
      { id: "latency", label: "Latency root cause", Icon: Radar },
      { id: "alerts", label: "Budget alerts", Icon: Server },
    ],
  },
  {
    id: "manage",
    title: "Manage",
    items: [
      { id: "budgets", label: "Budgets", Icon: Layers3 },
      { id: "exports", label: "Scheduled exports", Icon: Boxes, disabled: true },
    ],
  },
];

// ---------------------------------------------------------------------------
// Decomposition tree data.
//
// Only LEAF nodes carry an authored `value`. Every ancestor's `value` is the
// SUM of its children, computed once by `decorate()` below — never hand-typed
// — so the tree cannot drift out of reconciliation the way two independently
// hand-typed numbers could. `deltaPct` (vs. prior period) and `budget` are
// flavor/reference data with no reconciliation requirement of their own, so
// they ARE hand-authored per node.
// ---------------------------------------------------------------------------

interface RawNode {
  id: string;
  label: string;
  level: LevelName;
  deltaPriorPct: number;
  budget?: number; // only ever set on region + service level nodes
  value?: number; // leaf-only
  children?: RawNode[];
}

const RAW_REGIONS: RawNode[] = [
  {
    id: "us-east-1",
    label: "us-east-1",
    level: "Region",
    deltaPriorPct: 21.8,
    budget: 175_000,
    children: [
      {
        id: "us-east-1.compute",
        label: "Compute",
        level: "Service",
        deltaPriorPct: 34.5,
        budget: 100_000,
        children: [
          {
            id: "us-east-1.compute.on-demand",
            label: "On-Demand Instances",
            level: "Resource type",
            deltaPriorPct: 58.1,
            children: [
              { id: "us-east-1.compute.on-demand.m5-2xlarge", label: "m5.2xlarge", level: "SKU", deltaPriorPct: 4.1, value: 18_000 },
              { id: "us-east-1.compute.on-demand.c5-4xlarge", label: "c5.4xlarge", level: "SKU", deltaPriorPct: 2.8, value: 15_500 },
              { id: "us-east-1.compute.on-demand.r5-xlarge", label: "r5.xlarge", level: "SKU", deltaPriorPct: -3.5, value: 9_500 },
              { id: "us-east-1.compute.on-demand.g4dn-xlarge", label: "g4dn.xlarge", level: "SKU", deltaPriorPct: 186.4, value: 34_000 },
              { id: "us-east-1.compute.on-demand.t3-large", label: "t3.large", level: "SKU", deltaPriorPct: 1.0, value: 9_000 },
            ],
          },
          { id: "us-east-1.compute.reserved", label: "Reserved Instances", level: "Resource type", deltaPriorPct: 0.5, value: 28_000 },
          { id: "us-east-1.compute.serverless", label: "Serverless Functions", level: "Resource type", deltaPriorPct: 6.2, value: 11_000 },
          { id: "us-east-1.compute.kubernetes", label: "Kubernetes Nodes", level: "Resource type", deltaPriorPct: 3.0, value: 7_000 },
        ],
      },
      {
        id: "us-east-1.storage",
        label: "Storage",
        level: "Service",
        deltaPriorPct: 9.0,
        budget: 40_000,
        children: [
          {
            id: "us-east-1.storage.object-storage",
            label: "Object Storage",
            level: "Resource type",
            deltaPriorPct: 14.2,
            children: [
              { id: "us-east-1.storage.object-storage.standard-tier", label: "Standard tier", level: "SKU", deltaPriorPct: 11.0, value: 16_000 },
              { id: "us-east-1.storage.object-storage.standard-ia", label: "Standard-IA tier", level: "SKU", deltaPriorPct: 9.5, value: 6_000 },
              { id: "us-east-1.storage.object-storage.requests-retrieval", label: "Requests & retrieval", level: "SKU", deltaPriorPct: 28.0, value: 5_000 },
            ],
          },
          { id: "us-east-1.storage.block-storage", label: "Block Storage", level: "Resource type", deltaPriorPct: 2.0, value: 10_000 },
          { id: "us-east-1.storage.archive", label: "Archive Storage", level: "Resource type", deltaPriorPct: 1.0, value: 5_000 },
        ],
      },
      {
        id: "us-east-1.database",
        label: "Database",
        level: "Service",
        deltaPriorPct: 3.0,
        budget: 27_000,
        children: [
          { id: "us-east-1.database.managed-relational", label: "Managed Relational", level: "Resource type", deltaPriorPct: 2.0, value: 17_000 },
          { id: "us-east-1.database.managed-nosql", label: "Managed NoSQL", level: "Resource type", deltaPriorPct: 5.0, value: 8_000 },
          { id: "us-east-1.database.cache", label: "In-Memory Cache", level: "Resource type", deltaPriorPct: 1.5, value: 3_000 },
        ],
      },
      {
        id: "us-east-1.networking",
        label: "Networking",
        level: "Service",
        deltaPriorPct: 2.0,
        budget: 8_000,
        children: [
          { id: "us-east-1.networking.data-transfer-out", label: "Data Transfer Out", level: "Resource type", deltaPriorPct: 3.0, value: 5_000 },
          { id: "us-east-1.networking.load-balancers", label: "Load Balancers", level: "Resource type", deltaPriorPct: 0.5, value: 2_000 },
          { id: "us-east-1.networking.nat-gateway", label: "NAT Gateway", level: "Resource type", deltaPriorPct: 1.0, value: 1_000 },
        ],
      },
    ],
  },
  {
    id: "us-west-2",
    label: "us-west-2",
    level: "Region",
    deltaPriorPct: 3.1,
    budget: 108_000,
    children: [
      {
        id: "us-west-2.compute",
        label: "Compute",
        level: "Service",
        deltaPriorPct: 4.0,
        budget: 56_000,
        children: [
          { id: "us-west-2.compute.on-demand", label: "On-Demand Instances", level: "Resource type", deltaPriorPct: 5.0, value: 31_000 },
          { id: "us-west-2.compute.reserved", label: "Reserved Instances", level: "Resource type", deltaPriorPct: 1.0, value: 16_000 },
          { id: "us-west-2.compute.serverless", label: "Serverless Functions", level: "Resource type", deltaPriorPct: 3.0, value: 7_000 },
          { id: "us-west-2.compute.kubernetes", label: "Kubernetes Nodes", level: "Resource type", deltaPriorPct: 2.0, value: 4_000 },
        ],
      },
      {
        id: "us-west-2.storage",
        label: "Storage",
        level: "Service",
        deltaPriorPct: 1.5,
        budget: 24_000,
        children: [
          { id: "us-west-2.storage.object-storage", label: "Object Storage", level: "Resource type", deltaPriorPct: 2.0, value: 14_000 },
          { id: "us-west-2.storage.block-storage", label: "Block Storage", level: "Resource type", deltaPriorPct: 1.0, value: 7_000 },
          { id: "us-west-2.storage.archive", label: "Archive Storage", level: "Resource type", deltaPriorPct: 0.5, value: 3_000 },
        ],
      },
      {
        id: "us-west-2.database",
        label: "Database",
        level: "Service",
        deltaPriorPct: 2.0,
        budget: 18_000,
        children: [
          { id: "us-west-2.database.managed-relational", label: "Managed Relational", level: "Resource type", deltaPriorPct: 1.5, value: 11_000 },
          { id: "us-west-2.database.managed-nosql", label: "Managed NoSQL", level: "Resource type", deltaPriorPct: 3.0, value: 6_000 },
          { id: "us-west-2.database.cache", label: "In-Memory Cache", level: "Resource type", deltaPriorPct: 1.0, value: 2_000 },
        ],
      },
      {
        id: "us-west-2.networking",
        label: "Networking",
        level: "Service",
        deltaPriorPct: 1.0,
        budget: 10_000,
        children: [
          { id: "us-west-2.networking.data-transfer-out", label: "Data Transfer Out", level: "Resource type", deltaPriorPct: 1.5, value: 6_000 },
          { id: "us-west-2.networking.load-balancers", label: "Load Balancers", level: "Resource type", deltaPriorPct: 0.5, value: 2_000 },
          { id: "us-west-2.networking.nat-gateway", label: "NAT Gateway", level: "Resource type", deltaPriorPct: 0.5, value: 1_000 },
        ],
      },
    ],
  },
  {
    id: "eu-west-1",
    label: "eu-west-1",
    level: "Region",
    deltaPriorPct: 8.7,
    budget: 90_000,
    children: [
      {
        id: "eu-west-1.compute",
        label: "Compute",
        level: "Service",
        deltaPriorPct: 5.0,
        budget: 44_000,
        children: [
          { id: "eu-west-1.compute.on-demand", label: "On-Demand Instances", level: "Resource type", deltaPriorPct: 8.0, value: 24_000 },
          { id: "eu-west-1.compute.reserved", label: "Reserved Instances", level: "Resource type", deltaPriorPct: 1.0, value: 14_000 },
          { id: "eu-west-1.compute.serverless", label: "Serverless Functions", level: "Resource type", deltaPriorPct: 4.0, value: 5_000 },
          { id: "eu-west-1.compute.kubernetes", label: "Kubernetes Nodes", level: "Resource type", deltaPriorPct: 2.0, value: 3_000 },
        ],
      },
      {
        id: "eu-west-1.storage",
        label: "Storage",
        level: "Service",
        deltaPriorPct: 6.0,
        budget: 20_000,
        children: [
          { id: "eu-west-1.storage.object-storage", label: "Object Storage", level: "Resource type", deltaPriorPct: 7.0, value: 13_000 },
          { id: "eu-west-1.storage.block-storage", label: "Block Storage", level: "Resource type", deltaPriorPct: 2.0, value: 6_000 },
          { id: "eu-west-1.storage.archive", label: "Archive Storage", level: "Resource type", deltaPriorPct: 1.0, value: 3_000 },
        ],
      },
      {
        id: "eu-west-1.database",
        label: "Database",
        level: "Service",
        deltaPriorPct: 3.0,
        budget: 17_000,
        children: [
          { id: "eu-west-1.database.managed-relational", label: "Managed Relational", level: "Resource type", deltaPriorPct: 2.0, value: 10_000 },
          { id: "eu-west-1.database.managed-nosql", label: "Managed NoSQL", level: "Resource type", deltaPriorPct: 4.0, value: 6_000 },
          { id: "eu-west-1.database.cache", label: "In-Memory Cache", level: "Resource type", deltaPriorPct: 1.0, value: 2_000 },
        ],
      },
      {
        id: "eu-west-1.networking",
        label: "Networking",
        level: "Service",
        deltaPriorPct: 12.0,
        budget: 9_000,
        children: [
          {
            id: "eu-west-1.networking.data-transfer-out",
            label: "Data Transfer Out",
            level: "Resource type",
            deltaPriorPct: 22.0,
            children: [
              { id: "eu-west-1.networking.data-transfer-out.inter-region-transfer", label: "Inter-region transfer", level: "SKU", deltaPriorPct: 64.0, value: 3_600 },
              { id: "eu-west-1.networking.data-transfer-out.internet-egress", label: "Internet egress", level: "SKU", deltaPriorPct: 5.0, value: 1_800 },
              { id: "eu-west-1.networking.data-transfer-out.cdn-origin-fetch", label: "CDN origin fetch", level: "SKU", deltaPriorPct: 2.0, value: 600 },
            ],
          },
          { id: "eu-west-1.networking.load-balancers", label: "Load Balancers", level: "Resource type", deltaPriorPct: 0.5, value: 2_000 },
          { id: "eu-west-1.networking.nat-gateway", label: "NAT Gateway", level: "Resource type", deltaPriorPct: 1.0, value: 1_000 },
        ],
      },
    ],
  },
  {
    id: "ap-southeast-1",
    label: "ap-southeast-1",
    level: "Region",
    deltaPriorPct: -2.4,
    budget: 65_000,
    children: [
      {
        id: "ap-southeast-1.compute",
        label: "Compute",
        level: "Service",
        deltaPriorPct: -3.0,
        budget: 33_000,
        children: [
          { id: "ap-southeast-1.compute.on-demand", label: "On-Demand Instances", level: "Resource type", deltaPriorPct: -4.0, value: 16_000 },
          { id: "ap-southeast-1.compute.reserved", label: "Reserved Instances", level: "Resource type", deltaPriorPct: -1.0, value: 9_000 },
          { id: "ap-southeast-1.compute.serverless", label: "Serverless Functions", level: "Resource type", deltaPriorPct: -2.0, value: 3_000 },
          { id: "ap-southeast-1.compute.kubernetes", label: "Kubernetes Nodes", level: "Resource type", deltaPriorPct: 0.5, value: 2_000 },
        ],
      },
      {
        id: "ap-southeast-1.storage",
        label: "Storage",
        level: "Service",
        deltaPriorPct: -1.0,
        budget: 15_000,
        children: [
          { id: "ap-southeast-1.storage.object-storage", label: "Object Storage", level: "Resource type", deltaPriorPct: -2.0, value: 8_000 },
          { id: "ap-southeast-1.storage.block-storage", label: "Block Storage", level: "Resource type", deltaPriorPct: 0.0, value: 4_000 },
          { id: "ap-southeast-1.storage.archive", label: "Archive Storage", level: "Resource type", deltaPriorPct: 1.0, value: 2_000 },
        ],
      },
      {
        id: "ap-southeast-1.database",
        label: "Database",
        level: "Service",
        deltaPriorPct: -2.0,
        budget: 12_000,
        children: [
          { id: "ap-southeast-1.database.managed-relational", label: "Managed Relational", level: "Resource type", deltaPriorPct: -3.0, value: 6_000 },
          { id: "ap-southeast-1.database.managed-nosql", label: "Managed NoSQL", level: "Resource type", deltaPriorPct: -1.0, value: 4_000 },
          { id: "ap-southeast-1.database.cache", label: "In-Memory Cache", level: "Resource type", deltaPriorPct: 0.0, value: 1_000 },
        ],
      },
      {
        id: "ap-southeast-1.networking",
        label: "Networking",
        level: "Service",
        deltaPriorPct: -1.0,
        budget: 5_000,
        children: [
          { id: "ap-southeast-1.networking.data-transfer-out", label: "Data Transfer Out", level: "Resource type", deltaPriorPct: -2.0, value: 3_000 },
          { id: "ap-southeast-1.networking.load-balancers", label: "Load Balancers", level: "Resource type", deltaPriorPct: 0.5, value: 1_500 },
          { id: "ap-southeast-1.networking.nat-gateway", label: "NAT Gateway", level: "Resource type", deltaPriorPct: -1.0, value: 500 },
        ],
      },
    ],
  },
];

export interface TreeNode {
  id: string;
  label: string;
  level: LevelName;
  depth: number; // 0 = region
  parentId: string | null;
  value: number;
  pctOfParent: number;
  pctOfTotal: number;
  deltaPriorPct: number;
  budget?: number;
  budgetDeltaPct?: number;
  children?: TreeNode[];
}

function r1(n: number): number {
  return Math.round(n * 10) / 10;
}

function computeValue(n: RawNode): number {
  if (n.children && n.children.length > 0) return n.children.reduce((sum, c) => sum + computeValue(c), 0);
  return n.value ?? 0;
}

export const REGISTRY = new Map<string, TreeNode>();
export const ANCESTOR_IDS = new Map<string, string[]>(); // region -> ... -> immediate parent, excluding self

function decorate(n: RawNode, depth: number, parentId: string | null, parentValue: number, totalValue: number, ancestorPath: string[]): TreeNode {
  const value = computeValue(n);
  const pctOfParent = parentValue > 0 ? r1((value / parentValue) * 100) : 100;
  const pctOfTotal = totalValue > 0 ? r1((value / totalValue) * 100) : 100;
  const budgetDeltaPct = n.budget && n.budget > 0 ? r1(((value - n.budget) / n.budget) * 100) : undefined;
  const node: TreeNode = {
    id: n.id,
    label: n.label,
    level: n.level,
    depth,
    parentId,
    value,
    pctOfParent,
    pctOfTotal,
    deltaPriorPct: n.deltaPriorPct,
    budget: n.budget,
    budgetDeltaPct,
    children: n.children?.map((c) => decorate(c, depth + 1, n.id, value, totalValue, [...ancestorPath, n.id])),
  };
  REGISTRY.set(n.id, node);
  ANCESTOR_IDS.set(n.id, ancestorPath);
  return node;
}

const GRAND_TOTAL = RAW_REGIONS.reduce((sum, r) => sum + computeValue(r), 0);
const GRAND_BUDGET = RAW_REGIONS.reduce((sum, r) => sum + (r.budget ?? 0), 0);

export const COST_TREE: TreeNode[] = RAW_REGIONS.map((r) => decorate(r, 0, null, GRAND_TOTAL, GRAND_TOTAL, []));

export const TOTAL_SPEND = GRAND_TOTAL;
export const TOTAL_BUDGET = GRAND_BUDGET;
export const TOTAL_BUDGET_DELTA_PCT = r1(((TOTAL_SPEND - TOTAL_BUDGET) / TOTAL_BUDGET) * 100);
// Weighted average of region-level prior-period deltas — derived, not hand-picked, so it can never
// silently drift from the per-region numbers it summarizes.
export const TOTAL_PRIOR_DELTA_PCT = r1(COST_TREE.reduce((sum, r) => sum + r.value * r.deltaPriorPct, 0) / TOTAL_SPEND);

function flatten(nodes: TreeNode[]): TreeNode[] {
  const out: TreeNode[] = [];
  for (const n of nodes) {
    out.push(n);
    if (n.children) out.push(...flatten(n.children));
  }
  return out;
}
export const ALL_NODES = flatten(COST_TREE);

export const ANOMALY_THRESHOLD_PCT = 40;
export const ANOMALIES = ALL_NODES.filter((n) => n.deltaPriorPct >= ANOMALY_THRESHOLD_PCT);

export function pathLabels(id: string): string[] {
  return [...(ANCESTOR_IDS.get(id) ?? []), id].map((pid) => REGISTRY.get(pid)?.label ?? pid);
}

export const LEVEL_ICON: Record<LevelName, LucideIcon> = {
  Region: Globe2,
  Service: Layers3,
  "Resource type": Boxes,
  SKU: Tag,
};

// ---------------------------------------------------------------------------
// Top Movers — an independently curated leaderboard, NOT derived from tree
// selection state. It reads node values straight out of the same COST_TREE
// registry (so its numbers can never disagree with the tree), but its own
// sort order, row-expansion state, and "why did this change" notes live only
// inside TopMovers.tsx. Selecting a tree node never touches this table, and
// sorting/expanding a row here never touches the tree or its detail panel.
// ---------------------------------------------------------------------------
export const MOVER_IDS = [
  "us-east-1.compute.on-demand.g4dn-xlarge",
  "eu-west-1.networking.data-transfer-out.inter-region-transfer",
  "us-east-1.compute.on-demand",
  "us-east-1.storage.object-storage.requests-retrieval",
  "us-east-1.storage.object-storage.standard-tier",
  "eu-west-1.storage.object-storage",
  "us-east-1.compute.on-demand.m5-2xlarge",
  "us-west-2.compute.on-demand",
  "us-east-1.compute.reserved",
  "ap-southeast-1.database.managed-relational",
];

export const MOVER_NOTES: Record<string, string> = {
  "us-east-1.compute.on-demand.g4dn-xlarge": "Five g4dn.xlarge GPU instances launched for a batch inference job on Sep 14 were never terminated after the job finished.",
  "eu-west-1.networking.data-transfer-out.inter-region-transfer": "A misconfigured replication task began mirroring eu-west-1 read replicas to us-east-1 every 15 minutes starting Sep 9.",
  "us-east-1.compute.on-demand": "Driven almost entirely by the g4dn.xlarge line below — the other four on-demand SKUs in this region moved within normal range.",
  "us-east-1.storage.object-storage.requests-retrieval": "A new nightly export job added roughly 40M extra GET requests against the primary bucket this month.",
  "us-east-1.storage.object-storage.standard-tier": "Tracks a 12% increase in uploaded build artifacts — expected growth, not flagged as an anomaly.",
  "eu-west-1.storage.object-storage": "Steady month-over-month growth across all three storage tiers; no single tier stands out.",
  "us-east-1.compute.on-demand.m5-2xlarge": "Within normal month-over-month variance for this SKU.",
  "us-west-2.compute.on-demand": "Stable baseline; usage tracked closely with last month's autoscaling floor.",
  "us-east-1.compute.reserved": "Fully covered by existing reservations — flat by design.",
  "ap-southeast-1.database.managed-relational": "A read-through cache rolled out Sep 3 cut read-replica hours for this cluster.",
};

export const SEARCH_ENTRIES = ALL_NODES.map((n) => ({
  id: n.id,
  title: n.label,
  meta: `${n.level} · ${pathLabels(n.id).slice(0, -1).join(" › ") || "Top level"}`,
  Icon: LEVEL_ICON[n.level],
}));

export function formatUsd(n: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}
export function formatUsdCompact(n: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", notation: "compact", maximumFractionDigits: 1 }).format(n);
}
export function formatPct1(n: number): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(1)}%`;
}
export function formatInt(n: number): string {
  return new Intl.NumberFormat("en-US").format(n);
}
