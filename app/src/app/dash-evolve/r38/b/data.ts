// Deterministic dummy data for the Ledgerline "Variance Explorer" dashboard.
//
// Every number below is a fixed literal — no Math.random, no Date.now, no `new Date()`.
// Decomposition-tree values are never hand-typed as dollar amounts at every node: each
// branch only carries a relative `weight` among its siblings, and `buildChildren` below
// distributes a parent's exact value across its children with the largest-remainder
// method. That guarantees children sum to their parent to the dollar/hour, at every
// level, for every KPI and every period, without needing to hand-check arithmetic.

export type Period = "monthly" | "quarterly";
export type Unit = "usd" | "hours";

export interface SplitSpec {
  id: string;
  label: string;
  weight: number;
  children?: SplitSpec[];
}

export interface TreeNode {
  id: string;
  label: string;
  value: number;
  /** Rounded to 1 decimal place. 100 for the root (it is 100% of itself). */
  percentOfParent: number;
  depth: number;
  children?: TreeNode[];
}

export interface KpiFrame {
  rootValue: number;
  rootLabel: string;
  context?: {
    targetLabel: string;
    targetValue: number;
    actualLabel: string;
    actualValue: number;
  };
  tree: TreeNode;
}

export interface Kpi {
  id: string;
  name: string;
  shortLabel: string;
  unit: Unit;
  badge: string;
  dimensionLabels: readonly [string, string, string];
  frames: { monthly: KpiFrame; quarterly: KpiFrame };
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

/** Largest-remainder distribution: result always sums to exactly `total`. */
function distributeInt(total: number, weights: number[]): number[] {
  const weightSum = weights.reduce((a, b) => a + b, 0);
  const raw = weights.map((w) => (w / weightSum) * total);
  const floors = raw.map(Math.floor);
  const allocated = floors.reduce((a, b) => a + b, 0);
  const remainder = total - allocated;
  const order = raw
    .map((r, i) => ({ i, frac: r - Math.floor(r) }))
    .sort((a, b) => b.frac - a.frac || a.i - b.i);
  const result = [...floors];
  for (let k = 0; k < remainder; k++) {
    result[order[k % order.length].i] += 1;
  }
  return result;
}

function buildChildren(parentValue: number, specs: SplitSpec[], depth: number): TreeNode[] {
  const values = distributeInt(parentValue, specs.map((s) => s.weight));
  return specs.map((spec, i) => {
    const value = values[i];
    const percentOfParent = parentValue === 0 ? 0 : round1((value / parentValue) * 100);
    const children = spec.children?.length ? buildChildren(value, spec.children, depth + 1) : undefined;
    return { id: spec.id, label: spec.label, value, percentOfParent, depth, children };
  });
}

function buildTree(rootId: string, rootLabel: string, rootValue: number, specs: SplitSpec[]): TreeNode {
  return {
    id: rootId,
    label: rootLabel,
    value: rootValue,
    percentOfParent: 100,
    depth: 0,
    children: buildChildren(rootValue, specs, 1),
  };
}

// ---------------------------------------------------------------------------
// KPI 1 — New ARR shortfall (Region -> Segment -> Reason code)
// ---------------------------------------------------------------------------
const newArrSpecs: SplitSpec[] = [
  {
    id: "na",
    label: "North America",
    weight: 46,
    children: [
      {
        id: "na-ent",
        label: "Enterprise",
        weight: 55,
        children: [
          { id: "na-ent-budget", label: "Budget freeze", weight: 65 },
          { id: "na-ent-competitor", label: "Competitor loss", weight: 35 },
        ],
      },
      {
        id: "na-smb",
        label: "SMB",
        weight: 45,
        children: [
          { id: "na-smb-pricing", label: "Pricing pushback", weight: 58 },
          { id: "na-smb-impl", label: "Implementation delay", weight: 42 },
        ],
      },
    ],
  },
  {
    id: "emea",
    label: "EMEA",
    weight: 33,
    children: [
      {
        id: "emea-ent",
        label: "Enterprise",
        weight: 50,
        children: [
          { id: "emea-ent-budget", label: "Budget freeze", weight: 52 },
          { id: "emea-ent-champion", label: "Champion churn", weight: 48 },
        ],
      },
      {
        id: "emea-smb",
        label: "SMB",
        weight: 50,
        children: [
          { id: "emea-smb-pricing", label: "Pricing pushback", weight: 60 },
          { id: "emea-smb-competitor", label: "Competitor loss", weight: 40 },
        ],
      },
    ],
  },
  {
    id: "apac",
    label: "APAC",
    weight: 21,
    children: [
      {
        id: "apac-ent",
        label: "Enterprise",
        weight: 40,
        children: [
          { id: "apac-ent-competitor", label: "Competitor loss", weight: 55 },
          { id: "apac-ent-budget", label: "Budget freeze", weight: 45 },
        ],
      },
      {
        id: "apac-smb",
        label: "SMB",
        weight: 60,
        children: [
          { id: "apac-smb-impl", label: "Implementation delay", weight: 50 },
          { id: "apac-smb-pricing", label: "Pricing pushback", weight: 50 },
        ],
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// KPI 2 — Expansion ARR shortfall (Region -> Plan tier -> Reason code)
// ---------------------------------------------------------------------------
const expansionArrSpecs: SplitSpec[] = [
  {
    id: "na",
    label: "North America",
    weight: 50,
    children: [
      {
        id: "na-growth",
        label: "Growth plan",
        weight: 60,
        children: [
          { id: "na-growth-cap", label: "Usage cap not hit", weight: 60 },
          { id: "na-growth-renewal", label: "Renewal timing slip", weight: 40 },
        ],
      },
      {
        id: "na-scale",
        label: "Scale plan",
        weight: 40,
        children: [
          { id: "na-scale-seat", label: "Seat reduction", weight: 55 },
          { id: "na-scale-downgrade", label: "Downgrade request", weight: 45 },
        ],
      },
    ],
  },
  {
    id: "emea",
    label: "EMEA",
    weight: 30,
    children: [
      {
        id: "emea-growth",
        label: "Growth plan",
        weight: 55,
        children: [
          { id: "emea-growth-cap", label: "Usage cap not hit", weight: 50 },
          { id: "emea-growth-fx", label: "FX rate impact", weight: 50 },
        ],
      },
      {
        id: "emea-scale",
        label: "Scale plan",
        weight: 45,
        children: [
          { id: "emea-scale-seat", label: "Seat reduction", weight: 60 },
          { id: "emea-scale-renewal", label: "Renewal timing slip", weight: 40 },
        ],
      },
    ],
  },
  {
    id: "apac",
    label: "APAC",
    weight: 20,
    children: [
      {
        id: "apac-growth",
        label: "Growth plan",
        weight: 70,
        children: [
          { id: "apac-growth-renewal", label: "Renewal timing slip", weight: 65 },
          { id: "apac-growth-cap", label: "Usage cap not hit", weight: 35 },
        ],
      },
      {
        id: "apac-scale",
        label: "Scale plan",
        weight: 30,
        children: [
          { id: "apac-scale-downgrade", label: "Downgrade request", weight: 70 },
          { id: "apac-scale-seat", label: "Seat reduction", weight: 30 },
        ],
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// KPI 3 — Churned ARR (Region -> Industry -> Churn reason)
// ---------------------------------------------------------------------------
const churnedArrSpecs: SplitSpec[] = [
  {
    id: "na",
    label: "North America",
    weight: 40,
    children: [
      {
        id: "na-fintech",
        label: "Fintech",
        weight: 55,
        children: [
          { id: "na-fintech-competitor", label: "Lost to competitor", weight: 60 },
          { id: "na-fintech-budget", label: "Non-renewal — budget", weight: 40 },
        ],
      },
      {
        id: "na-retail",
        label: "Retail",
        weight: 45,
        children: [
          { id: "na-retail-fit", label: "Product fit", weight: 55 },
          { id: "na-retail-budget", label: "Non-renewal — budget", weight: 45 },
        ],
      },
    ],
  },
  {
    id: "emea",
    label: "EMEA",
    weight: 35,
    children: [
      {
        id: "emea-fintech",
        label: "Fintech",
        weight: 48,
        children: [
          { id: "emea-fintech-competitor", label: "Lost to competitor", weight: 50 },
          { id: "emea-fintech-compliance", label: "Compliance requirement", weight: 50 },
        ],
      },
      {
        id: "emea-retail",
        label: "Retail",
        weight: 52,
        children: [
          { id: "emea-retail-fit", label: "Product fit", weight: 58 },
          { id: "emea-retail-budget", label: "Non-renewal — budget", weight: 42 },
        ],
      },
    ],
  },
  {
    id: "apac",
    label: "APAC",
    weight: 25,
    children: [
      {
        id: "apac-fintech",
        label: "Fintech",
        weight: 60,
        children: [
          { id: "apac-fintech-budget", label: "Non-renewal — budget", weight: 62 },
          { id: "apac-fintech-competitor", label: "Lost to competitor", weight: 38 },
        ],
      },
      {
        id: "apac-retail",
        label: "Retail",
        weight: 40,
        children: [
          { id: "apac-retail-fit", label: "Product fit", weight: 54 },
          { id: "apac-retail-competitor", label: "Lost to competitor", weight: 46 },
        ],
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// KPI 4 — Support SLA breach hours (Team -> Channel -> Root cause)
// ---------------------------------------------------------------------------
const slaBreachSpecs: SplitSpec[] = [
  {
    id: "tier1",
    label: "Tier 1 support",
    weight: 45,
    children: [
      {
        id: "tier1-chat",
        label: "Chat",
        weight: 60,
        children: [
          { id: "tier1-chat-staffing", label: "Staffing gap", weight: 55 },
          { id: "tier1-chat-outage", label: "Macro / tooling outage", weight: 45 },
        ],
      },
      {
        id: "tier1-email",
        label: "Email",
        weight: 40,
        children: [
          { id: "tier1-email-backlog", label: "Backlog overflow", weight: 60 },
          { id: "tier1-email-staffing", label: "Staffing gap", weight: 40 },
        ],
      },
    ],
  },
  {
    id: "tier2",
    label: "Tier 2 support",
    weight: 35,
    children: [
      {
        id: "tier2-chat",
        label: "Chat",
        weight: 52,
        children: [
          { id: "tier2-chat-routing", label: "Complex ticket routing", weight: 52 },
          { id: "tier2-chat-staffing", label: "Staffing gap", weight: 48 },
        ],
      },
      {
        id: "tier2-phone",
        label: "Phone",
        weight: 48,
        children: [
          { id: "tier2-phone-backlog", label: "Backlog overflow", weight: 58 },
          { id: "tier2-phone-routing", label: "Complex ticket routing", weight: 42 },
        ],
      },
    ],
  },
  {
    id: "infra",
    label: "Infra on-call",
    weight: 20,
    children: [
      {
        id: "infra-pager",
        label: "Pager",
        weight: 70,
        children: [
          { id: "infra-pager-storm", label: "Alert storm", weight: 65 },
          { id: "infra-pager-escalation", label: "Escalation delay", weight: 35 },
        ],
      },
      {
        id: "infra-email",
        label: "Email",
        weight: 30,
        children: [
          { id: "infra-email-escalation", label: "Escalation delay", weight: 55 },
          { id: "infra-email-storm", label: "Alert storm", weight: 45 },
        ],
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// KPI 5 — Gross margin erosion (Cost center -> Vendor category -> Driver)
// ---------------------------------------------------------------------------
const marginErosionSpecs: SplitSpec[] = [
  {
    id: "cloud",
    label: "Cloud infra",
    weight: 50,
    children: [
      {
        id: "cloud-compute",
        label: "Compute",
        weight: 65,
        children: [
          { id: "cloud-compute-usage", label: "Usage spike", weight: 60 },
          { id: "cloud-compute-rate", label: "Rate increase", weight: 40 },
        ],
      },
      {
        id: "cloud-storage",
        label: "Storage",
        weight: 35,
        children: [
          { id: "cloud-storage-retention", label: "Retention policy change", weight: 55 },
          { id: "cloud-storage-rate", label: "Rate increase", weight: 45 },
        ],
      },
    ],
  },
  {
    id: "cs",
    label: "Customer success",
    weight: 30,
    children: [
      {
        id: "cs-tooling",
        label: "Tooling",
        weight: 55,
        children: [
          { id: "cs-tooling-seat", label: "Seat price increase", weight: 58 },
          { id: "cs-tooling-adoption", label: "New tool adoption", weight: 42 },
        ],
      },
      {
        id: "cs-contractors",
        label: "Contractors",
        weight: 45,
        children: [
          { id: "cs-contractors-overtime", label: "Overtime surge", weight: 62 },
          { id: "cs-contractors-rate", label: "Rate increase", weight: 38 },
        ],
      },
    ],
  },
  {
    id: "thirdparty",
    label: "Third-party data",
    weight: 20,
    children: [
      {
        id: "thirdparty-enrichment",
        label: "Enrichment",
        weight: 60,
        children: [
          { id: "thirdparty-enrichment-volume", label: "Volume increase", weight: 57 },
          { id: "thirdparty-enrichment-rate", label: "Rate increase", weight: 43 },
        ],
      },
      {
        id: "thirdparty-compliance",
        label: "Compliance",
        weight: 40,
        children: [
          { id: "thirdparty-compliance-requirement", label: "New requirement", weight: 60 },
          { id: "thirdparty-compliance-rate", label: "Rate increase", weight: 40 },
        ],
      },
    ],
  },
];

function frame(
  rootId: string,
  rootLabel: string,
  rootValue: number,
  specs: SplitSpec[],
  context?: KpiFrame["context"],
): KpiFrame {
  return { rootValue, rootLabel, context, tree: buildTree(rootId, rootLabel, rootValue, specs) };
}

export const KPIS: Kpi[] = [
  {
    id: "new-arr",
    name: "New ARR shortfall",
    shortLabel: "New ARR",
    unit: "usd",
    badge: "Missed target",
    dimensionLabels: ["Region", "Segment", "Reason code"],
    frames: {
      monthly: frame("new-arr-monthly", "New ARR shortfall", 86400, newArrSpecs, {
        targetLabel: "Target",
        targetValue: 420000,
        actualLabel: "Actual",
        actualValue: 333600,
      }),
      quarterly: frame("new-arr-quarterly", "New ARR shortfall", 225800, newArrSpecs, {
        targetLabel: "Target",
        targetValue: 1260000,
        actualLabel: "Actual",
        actualValue: 1034200,
      }),
    },
  },
  {
    id: "expansion-arr",
    name: "Expansion ARR shortfall",
    shortLabel: "Expansion ARR",
    unit: "usd",
    badge: "Missed target",
    dimensionLabels: ["Region", "Plan tier", "Reason code"],
    frames: {
      monthly: frame("expansion-arr-monthly", "Expansion ARR shortfall", 27900, expansionArrSpecs, {
        targetLabel: "Target",
        targetValue: 180000,
        actualLabel: "Actual",
        actualValue: 152100,
      }),
      quarterly: frame("expansion-arr-quarterly", "Expansion ARR shortfall", 58050, expansionArrSpecs, {
        targetLabel: "Target",
        targetValue: 540000,
        actualLabel: "Actual",
        actualValue: 481950,
      }),
    },
  },
  {
    id: "churned-arr",
    name: "Churned ARR",
    shortLabel: "Churned ARR",
    unit: "usd",
    badge: "Attributed loss",
    dimensionLabels: ["Region", "Industry", "Churn reason"],
    frames: {
      monthly: frame("churned-arr-monthly", "Total churned ARR", 64800, churnedArrSpecs),
      quarterly: frame("churned-arr-quarterly", "Total churned ARR", 198450, churnedArrSpecs),
    },
  },
  {
    id: "sla-breach",
    name: "Support SLA breach hours",
    shortLabel: "SLA breach hours",
    unit: "hours",
    badge: "SLA breach",
    dimensionLabels: ["Team", "Channel", "Root cause"],
    frames: {
      monthly: frame("sla-breach-monthly", "Total breach hours", 212, slaBreachSpecs),
      quarterly: frame("sla-breach-quarterly", "Total breach hours", 587, slaBreachSpecs),
    },
  },
  {
    id: "margin-erosion",
    name: "Gross margin erosion",
    shortLabel: "Margin erosion",
    unit: "usd",
    badge: "Cost increase",
    dimensionLabels: ["Cost center", "Vendor category", "Driver"],
    frames: {
      monthly: frame("margin-erosion-monthly", "Total margin erosion", 41200, marginErosionSpecs),
      quarterly: frame("margin-erosion-quarterly", "Total margin erosion", 116850, marginErosionSpecs),
    },
  },
];

export function getKpi(id: string): Kpi {
  const found = KPIS.find((k) => k.id === id);
  return found ?? KPIS[0];
}

export function formatValue(value: number, unit: Unit): string {
  if (unit === "hours") {
    return `${new Intl.NumberFormat("en-US").format(value)} hrs`;
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export interface LeafRow {
  id: string;
  path: string;
  topLabel: string;
  reason: string;
  value: number;
  percentOfTotal: number;
  severity: "High" | "Medium" | "Low";
}

function severityOf(percentOfTotal: number): LeafRow["severity"] {
  if (percentOfTotal >= 15) return "High";
  if (percentOfTotal >= 5) return "Medium";
  return "Low";
}

/** Flattens every leaf (deepest) node of a tree into table rows, ranked by their
 *  share of the grand total (not just their immediate parent). */
export function flattenLeaves(root: TreeNode): LeafRow[] {
  const rows: LeafRow[] = [];
  const walk = (node: TreeNode, ancestorTrail: string[]) => {
    if (!node.children?.length) {
      if (node.depth === 0) return; // a root with no children — nothing to list
      const percentOfTotal = root.value === 0 ? 0 : round1((node.value / root.value) * 100);
      rows.push({
        id: node.id,
        path: ancestorTrail.join(" › "),
        topLabel: ancestorTrail[0] ?? node.label,
        reason: node.label,
        value: node.value,
        percentOfTotal,
        severity: severityOf(percentOfTotal),
      });
      return;
    }
    const trailForChildren = node.depth === 0 ? [] : [...ancestorTrail, node.label];
    for (const child of node.children) {
      walk(child, trailForChildren);
    }
  };
  walk(root, []);
  return rows;
}
