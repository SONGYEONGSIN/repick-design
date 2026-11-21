import type { VarianceNode } from "./data";

/** Formats a signed $K variance as e.g. "−$300K" or "+$60K". Pure, deterministic. */
export function formatMoneyK(value: number): string {
  if (value === 0) return "$0K";
  const sign = value < 0 ? "−" : "+";
  return `${sign}$${Math.abs(value)}K`;
}

export interface FlatRow {
  id: string;
  label: string;
  value: number;
  pctOfParent: number | null;
  depth: number;
}

/** Flattens the full tree (regardless of expand state) for the accessible table fallback. */
export function flattenTree(node: VarianceNode, depth = 0): FlatRow[] {
  const row: FlatRow = {
    id: node.id,
    label: node.label,
    value: node.value,
    pctOfParent: node.pctOfParent,
    depth,
  };
  const childRows = (node.children ?? []).flatMap((child) => flattenTree(child, depth + 1));
  return [row, ...childRows];
}

/** Default expand set: only the first level of drivers is open on initial view. */
export function defaultExpandedIds(root: VarianceNode): Set<string> {
  return new Set((root.children ?? []).map((child) => child.id));
}

/** Every node id in the tree that has children — used by "Expand all". */
export function allExpandableIds(root: VarianceNode): Set<string> {
  const ids = new Set<string>();
  function walk(node: VarianceNode) {
    if (node.children && node.children.length > 0) {
      ids.add(node.id);
      node.children.forEach(walk);
    }
  }
  (root.children ?? []).forEach(walk);
  return ids;
}

export function findNode(root: VarianceNode, id: string): VarianceNode | null {
  if (root.id === id) return root;
  for (const child of root.children ?? []) {
    const found = findNode(child, id);
    if (found) return found;
  }
  return null;
}

/** The chain of nodes from the root down to `id`, inclusive, for breadcrumb display. */
export function breadcrumbFor(root: VarianceNode, id: string): VarianceNode[] {
  const path: VarianceNode[] = [];
  function walk(node: VarianceNode): boolean {
    path.push(node);
    if (node.id === id) return true;
    for (const child of node.children ?? []) {
      if (walk(child)) return true;
    }
    path.pop();
    return false;
  }
  walk(root);
  return path;
}
