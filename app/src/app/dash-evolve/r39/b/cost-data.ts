// Fixed, hand-authored cloud spend hierarchy for the Contour sunburst console.
// All values are deterministic constants. Every parent's value equals the exact
// sum of its children's values (verified by hand) so the proportional sunburst
// arcs and the fallback hierarchy list always agree with each other.

export interface CostNode {
  id: string;
  name: string;
  value: number;
  children?: CostNode[];
}

export const COST_TREE: CostNode = {
  id: "root",
  name: "All Cloud Spend",
  value: 320000,
  children: [
    {
      id: "us-east",
      name: "US-East",
      value: 134400,
      children: [
        {
          id: "us-east-compute",
          name: "Compute",
          value: 80640,
          children: [
            { id: "us-east-compute-ondemand", name: "On-Demand", value: 36288 },
            { id: "us-east-compute-reserved", name: "Reserved", value: 28224 },
            { id: "us-east-compute-spot", name: "Spot", value: 16128 },
          ],
        },
        {
          id: "us-east-database",
          name: "Database",
          value: 33600,
          children: [
            { id: "us-east-database-primary", name: "Managed Primary", value: 16800 },
            { id: "us-east-database-replicas", name: "Read Replicas", value: 10080 },
            { id: "us-east-database-backups", name: "Backups", value: 6720 },
          ],
        },
        {
          id: "us-east-storage",
          name: "Storage",
          value: 20160,
          children: [
            { id: "us-east-storage-object", name: "Object Storage", value: 11088 },
            { id: "us-east-storage-block", name: "Block Storage", value: 6048 },
            { id: "us-east-storage-archive", name: "Archive", value: 3024 },
          ],
        },
      ],
    },
    {
      id: "us-west",
      name: "US-West",
      value: 73600,
      children: [
        {
          id: "us-west-compute",
          name: "Compute",
          value: 40480,
          children: [
            { id: "us-west-compute-ondemand", name: "On-Demand", value: 18216 },
            { id: "us-west-compute-reserved", name: "Reserved", value: 14168 },
            { id: "us-west-compute-spot", name: "Spot", value: 8096 },
          ],
        },
        {
          id: "us-west-storage",
          name: "Storage",
          value: 22080,
          children: [
            { id: "us-west-storage-object", name: "Object Storage", value: 12144 },
            { id: "us-west-storage-block", name: "Block Storage", value: 6624 },
            { id: "us-west-storage-archive", name: "Archive", value: 3312 },
          ],
        },
        {
          id: "us-west-database",
          name: "Database",
          value: 11040,
          children: [
            { id: "us-west-database-primary", name: "Managed Primary", value: 5520 },
            { id: "us-west-database-replicas", name: "Read Replicas", value: 3312 },
            { id: "us-west-database-backups", name: "Backups", value: 2208 },
          ],
        },
      ],
    },
    {
      id: "eu-west",
      name: "EU-West",
      value: 64000,
      children: [
        {
          id: "eu-west-compute",
          name: "Compute",
          value: 37120,
          children: [
            { id: "eu-west-compute-ondemand", name: "On-Demand", value: 16704 },
            { id: "eu-west-compute-reserved", name: "Reserved", value: 12992 },
            { id: "eu-west-compute-spot", name: "Spot", value: 7424 },
          ],
        },
        {
          id: "eu-west-database",
          name: "Database",
          value: 15360,
          children: [
            { id: "eu-west-database-primary", name: "Managed Primary", value: 7680 },
            { id: "eu-west-database-replicas", name: "Read Replicas", value: 4608 },
            { id: "eu-west-database-backups", name: "Backups", value: 3072 },
          ],
        },
        {
          id: "eu-west-storage",
          name: "Storage",
          value: 11520,
          children: [
            { id: "eu-west-storage-object", name: "Object Storage", value: 6336 },
            { id: "eu-west-storage-block", name: "Block Storage", value: 3456 },
            { id: "eu-west-storage-archive", name: "Archive", value: 1728 },
          ],
        },
      ],
    },
    {
      id: "ap-southeast",
      name: "AP-Southeast",
      value: 48000,
      children: [
        {
          id: "ap-southeast-compute",
          name: "Compute",
          value: 24000,
          children: [
            { id: "ap-southeast-compute-ondemand", name: "On-Demand", value: 10800 },
            { id: "ap-southeast-compute-reserved", name: "Reserved", value: 8400 },
            { id: "ap-southeast-compute-spot", name: "Spot", value: 4800 },
          ],
        },
        {
          id: "ap-southeast-storage",
          name: "Storage",
          value: 15360,
          children: [
            { id: "ap-southeast-storage-object", name: "Object Storage", value: 8448 },
            { id: "ap-southeast-storage-block", name: "Block Storage", value: 4608 },
            { id: "ap-southeast-storage-archive", name: "Archive", value: 2304 },
          ],
        },
        {
          id: "ap-southeast-database",
          name: "Database",
          value: 8640,
          children: [
            { id: "ap-southeast-database-primary", name: "Managed Primary", value: 4320 },
            { id: "ap-southeast-database-replicas", name: "Read Replicas", value: 2592 },
            { id: "ap-southeast-database-backups", name: "Backups", value: 1728 },
          ],
        },
      ],
    },
  ],
};

// Per-region hue ramps. Every node inside a region's branch is shaded from that
// region's own ramp (index cycles by sibling order), so color encodes "which
// region this belongs to" consistently from the outer ring down to the leaves.
// Orange is deliberately excluded here — it is reserved as the single UI accent
// (selection outline, focus ring, active affordances) and never doubles as a
// category fill, so it keeps meaning "this is interactive / selected" everywhere.
export const REGION_HUES: Record<string, string[]> = {
  "us-east": ["#3b82f6", "#2563eb", "#60a5fa", "#1d4ed8"],
  "us-west": ["#8b5cf6", "#7c3aed", "#a78bfa", "#6d28d9"],
  "eu-west": ["#10b981", "#059669", "#34d399", "#047857"],
  "ap-southeast": ["#f43f5e", "#e11d48", "#fb7185", "#be123c"],
};

export const REGION_ORDER = ["us-east", "us-west", "eu-west", "ap-southeast"];

export function formatCurrency(value: number): string {
  return `$${value.toLocaleString("en-US")}`;
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function findPathTo(target: CostNode, root: CostNode = COST_TREE): CostNode[] | null {
  if (root.id === target.id) return [root];
  for (const child of root.children ?? []) {
    const rest = findPathTo(target, child);
    if (rest) return [root, ...rest];
  }
  return null;
}

export function countMatches(node: CostNode, query: string): number {
  const q = query.trim().toLowerCase();
  if (!q) return 0;
  let count = node.name.toLowerCase().includes(q) ? 1 : 0;
  for (const child of node.children ?? []) {
    count += countMatches(child, q);
  }
  return count;
}

export function collectAncestorIdsForMatches(node: CostNode, query: string, trail: string[] = []): string[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const ids: string[] = [];
  const nextTrail = [...trail, node.id];
  const selfMatches = node.name.toLowerCase().includes(q);
  let childMatches = false;
  for (const child of node.children ?? []) {
    const childIds = collectAncestorIdsForMatches(child, query, nextTrail);
    if (childIds.length > 0) {
      childMatches = true;
      ids.push(...childIds);
    }
  }
  if (selfMatches || childMatches) {
    ids.push(...nextTrail);
  }
  return ids;
}
