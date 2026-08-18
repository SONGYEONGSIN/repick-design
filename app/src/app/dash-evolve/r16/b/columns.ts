export type Density = "comfortable" | "compact";
export type GroupBy = "none" | "category" | "warehouse";
export type OptionalColumn = "warehouse" | "reorderPoint" | "unitValue";
export type SortKey = "code" | "name" | "status" | "onHand" | "delta" | "totalValue";
export type SortDir = "ascending" | "descending";

export const OPTIONAL_COLUMN_LABEL: Record<OptionalColumn, string> = {
  warehouse: "Warehouse",
  reorderPoint: "Reorder point",
  unitValue: "Unit value",
};

/**
 * Relative column weights (not rem/px) for every column, in DOM order. Every `<col>` gets a
 * *percentage* of the table's own width — `weight / (sum of weights of the columns actually
 * rendered) * 100` — recomputed whenever a column is toggled. Because it's a share of 100% of
 * whatever width the table has, the columns can never sum to more than the container: there is no
 * viewport at which this table needs `min-w` or a desktop horizontal scrollbar, and no separate
 * breakpoint logic is needed to keep the column-visibility toggle honest at in-between widths
 * (a column toggled on always visibly grows the other columns' room, at every width at once).
 */
export const COL_WEIGHT = {
  code: 8,
  name: 20,
  warehouse: 11,
  status: 13,
  onHand: 8,
  reorderPoint: 8,
  trend: 15,
  unitValue: 8,
  totalValue: 9,
} as const;

export type ColumnKey = keyof typeof COL_WEIGHT;

/** Percentage width string for `key`, given the set of columns actually present in the table. */
export function colWidthPct(key: ColumnKey, visibleKeys: ColumnKey[]): string {
  const sum = visibleKeys.reduce((total, k) => total + COL_WEIGHT[k], 0);
  return `${((COL_WEIGHT[key] / sum) * 100).toFixed(2)}%`;
}

export const STATUS_ORDER = ["Healthy", "Low Stock", "Backorder", "Discontinued"] as const;
