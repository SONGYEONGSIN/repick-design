"use client";

import { Fragment, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronDown,
  ChevronRight,
  PackageCheck,
  TriangleAlert,
  PackageX,
  Archive,
} from "lucide-react";
import { CATEGORIES, WAREHOUSES, USD, USD2, INT, type Sku, type Status } from "./data";
import { Sparkline } from "./Sparkline";
import { FOCUS_RING } from "./ui";
import {
  colWidthPct,
  STATUS_ORDER,
  type ColumnKey,
  type Density,
  type GroupBy,
  type OptionalColumn,
  type SortDir,
  type SortKey,
} from "./columns";

const STATUS_META: Record<Status, { icon: typeof PackageCheck; badge: string; tone: "up" | "down" | "flat" }> = {
  Healthy: { icon: PackageCheck, badge: "bg-emerald-50 text-emerald-700", tone: "up" },
  "Low Stock": { icon: TriangleAlert, badge: "bg-amber-50 text-amber-700", tone: "down" },
  Backorder: { icon: PackageX, badge: "bg-rose-50 text-rose-700", tone: "down" },
  Discontinued: { icon: Archive, badge: "bg-zinc-100 text-zinc-600", tone: "flat" },
};

function compareBy(key: SortKey, a: Sku, b: Sku): number {
  switch (key) {
    case "code":
      return a.code.localeCompare(b.code);
    case "name":
      return a.name.localeCompare(b.name);
    case "status":
      return STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status);
    case "onHand":
      return a.onHand - b.onHand;
    case "delta":
      return a.deltaPct - b.deltaPct;
    case "totalValue":
      return a.totalValue - b.totalValue;
  }
}

function sortRows(rows: Sku[], key: SortKey, dir: SortDir): Sku[] {
  const sign = dir === "ascending" ? 1 : -1;
  return [...rows].sort((a, b) => sign * compareBy(key, a, b));
}

type Group = { key: string; label: string; rows: Sku[] };

function groupRows(rows: Sku[], groupBy: GroupBy): Group[] {
  if (groupBy === "none") return [{ key: "all", label: "", rows }];
  const buckets = groupBy === "category" ? CATEGORIES : WAREHOUSES;
  return buckets
    .map((b) => ({ key: b, label: b, rows: rows.filter((r) => (groupBy === "category" ? r.category : r.warehouse) === b) }))
    .filter((g) => g.rows.length > 0);
}

function SortHeader({
  children,
  colKey,
  sortKey,
  sortDir,
  onSort,
  align = "left",
}: {
  children: React.ReactNode;
  colKey: SortKey;
  sortKey: SortKey;
  sortDir: SortDir;
  onSort: (key: SortKey) => void;
  align?: "left" | "right";
}) {
  const active = sortKey === colKey;
  const ariaSort = active ? sortDir : "none";
  const Icon = active ? (sortDir === "ascending" ? ArrowUp : ArrowDown) : ArrowUpDown;
  return (
    <th scope="col" aria-sort={ariaSort} className="px-3 py-2.5">
      <button
        type="button"
        onClick={() => onSort(colKey)}
        className={`flex w-full items-center gap-1 whitespace-nowrap text-[11px] font-semibold uppercase tracking-wide text-zinc-500 hover:text-zinc-900 ${FOCUS_RING} rounded-sm ${
          align === "right" ? "justify-end" : "justify-start"
        }`}
      >
        {align === "right" ? <Icon className={`h-3 w-3 ${active ? "text-blue-600" : "text-zinc-300"}`} aria-hidden="true" /> : null}
        {children}
        {align === "left" ? <Icon className={`h-3 w-3 ${active ? "text-blue-600" : "text-zinc-300"}`} aria-hidden="true" /> : null}
      </button>
    </th>
  );
}

export function DataGrid({
  rows,
  groupBy,
  sortKey,
  sortDir,
  onSort,
  optionalCols,
  density,
  onRowClick,
}: {
  rows: Sku[];
  groupBy: GroupBy;
  sortKey: SortKey;
  sortDir: SortDir;
  onSort: (key: SortKey) => void;
  optionalCols: Record<OptionalColumn, boolean>;
  density: Density;
  onRowClick: (sku: Sku) => void;
}) {
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const groups = groupRows(rows, groupBy).map((g) => ({ ...g, rows: sortRows(g.rows, sortKey, sortDir) }));
  const cellPad = density === "compact" ? "py-1.5" : "py-3";

  const visibleKeys: ColumnKey[] = [
    "code",
    "name",
    ...(optionalCols.warehouse ? (["warehouse"] as const) : []),
    "status",
    "onHand",
    ...(optionalCols.reorderPoint ? (["reorderPoint"] as const) : []),
    "trend",
    ...(optionalCols.unitValue ? (["unitValue"] as const) : []),
    "totalValue",
  ];
  const widthOf = (key: ColumnKey) => colWidthPct(key, visibleKeys);
  const visibleColCount = visibleKeys.length;

  function toggleGroup(key: string) {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  return (
    <div className="relative overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-sm">
      {/* `relative` above is load-bearing, not decorative: the sr-only <caption> below sits inside
          this overflow-x-auto clipping container, and without a positioned ancestor right here its
          containing block would skip past the scroll boundary to an unpositioned ancestor further
          up the tree — painting at unscrolled coordinates and inflating document.scrollWidth at
          the 390px mobile check. See dash-brief-v3 §그리드 크래프트 룰. */}
      <table className="w-full table-fixed border-collapse text-sm">
        <caption className="sr-only">
          Inventory grid, {rows.length} SKUs, sorted by {sortKey} {sortDir}
          {groupBy !== "none" ? `, grouped by ${groupBy}` : ""}.
        </caption>
        <colgroup>
          <col style={{ width: widthOf("code") }} />
          <col style={{ width: widthOf("name") }} />
          {optionalCols.warehouse ? <col style={{ width: widthOf("warehouse") }} /> : null}
          <col style={{ width: widthOf("status") }} />
          <col style={{ width: widthOf("onHand") }} />
          {optionalCols.reorderPoint ? <col style={{ width: widthOf("reorderPoint") }} /> : null}
          <col style={{ width: widthOf("trend") }} />
          {optionalCols.unitValue ? <col style={{ width: widthOf("unitValue") }} /> : null}
          <col style={{ width: widthOf("totalValue") }} />
        </colgroup>
        <thead className="border-b border-zinc-200 bg-zinc-50">
          <tr>
            <SortHeader colKey="code" sortKey={sortKey} sortDir={sortDir} onSort={onSort}>
              SKU
            </SortHeader>
            <SortHeader colKey="name" sortKey={sortKey} sortDir={sortDir} onSort={onSort}>
              Product
            </SortHeader>
            {optionalCols.warehouse ? (
              <th scope="col" className="whitespace-nowrap px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
                Warehouse
              </th>
            ) : null}
            <SortHeader colKey="status" sortKey={sortKey} sortDir={sortDir} onSort={onSort}>
              Status
            </SortHeader>
            <SortHeader colKey="onHand" sortKey={sortKey} sortDir={sortDir} onSort={onSort} align="right">
              On hand
            </SortHeader>
            {optionalCols.reorderPoint ? (
              <th scope="col" className="whitespace-nowrap px-3 py-2.5 text-right text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
                Reorder pt
              </th>
            ) : null}
            <SortHeader colKey="delta" sortKey={sortKey} sortDir={sortDir} onSort={onSort}>
              14-day trend
            </SortHeader>
            {optionalCols.unitValue ? (
              <th scope="col" className="whitespace-nowrap px-3 py-2.5 text-right text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
                Unit value
              </th>
            ) : null}
            <SortHeader colKey="totalValue" sortKey={sortKey} sortDir={sortDir} onSort={onSort} align="right">
              Total value
            </SortHeader>
          </tr>
        </thead>
        <tbody>
          {groups.map((group) => {
            const isCollapsed = collapsed.has(group.key);
            const subtotal = group.rows.reduce((sum, r) => sum + r.totalValue, 0);
            return (
              <Fragment key={group.key}>
                {groupBy !== "none" ? (
                  <tr key={`${group.key}-header`} className="border-b border-zinc-200 bg-zinc-50/70">
                    <td colSpan={visibleColCount} className="px-3 py-2">
                      <button
                        type="button"
                        aria-expanded={!isCollapsed}
                        onClick={() => toggleGroup(group.key)}
                        className={`flex w-full items-center gap-2 text-left text-xs font-semibold text-zinc-700 ${FOCUS_RING} rounded-sm`}
                      >
                        {isCollapsed ? (
                          <ChevronRight className="h-3.5 w-3.5 text-zinc-400" aria-hidden="true" />
                        ) : (
                          <ChevronDown className="h-3.5 w-3.5 text-zinc-400" aria-hidden="true" />
                        )}
                        <span className="uppercase tracking-wide">{group.label}</span>
                        <span className="font-normal normal-case text-zinc-500">
                          · {group.rows.length} SKU{group.rows.length === 1 ? "" : "s"} · {USD.format(subtotal)}
                        </span>
                      </button>
                    </td>
                  </tr>
                ) : null}
                {!isCollapsed &&
                  group.rows.map((sku) => {
                    const meta = STATUS_META[sku.status];
                    const Icon = meta.icon;
                    return (
                      <tr
                        key={sku.id}
                        onClick={() => onRowClick(sku)}
                        className="cursor-pointer border-b border-zinc-100 last:border-b-0 hover:bg-zinc-50"
                      >
                        <td className={`whitespace-nowrap px-3 ${cellPad} font-mono text-xs tabular-nums text-zinc-500`}>{sku.code}</td>
                        <td className={`px-3 ${cellPad}`}>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onRowClick(sku);
                            }}
                            className={`line-clamp-2 text-left font-semibold text-zinc-900 hover:text-blue-700 hover:underline ${FOCUS_RING} rounded-sm`}
                          >
                            {sku.name}
                          </button>
                          <p className="text-xs text-zinc-500">{sku.category}</p>
                        </td>
                        {optionalCols.warehouse ? (
                          <td className={`whitespace-nowrap px-3 ${cellPad} text-zinc-600`}>{sku.warehouse}</td>
                        ) : null}
                        <td className={`px-3 ${cellPad}`}>
                          <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2 py-1 text-xs font-semibold ${meta.badge}`}>
                            <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                            {sku.status}
                          </span>
                        </td>
                        <td className={`px-3 ${cellPad} text-right tabular-nums text-zinc-700`}>{INT.format(sku.onHand)}</td>
                        {optionalCols.reorderPoint ? (
                          <td className={`px-3 ${cellPad} text-right tabular-nums text-zinc-600`}>
                            {INT.format(sku.reorderPoint)}
                          </td>
                        ) : null}
                        <td className={`px-3 ${cellPad}`} onClick={(e) => e.stopPropagation()}>
                          <Sparkline values={sku.trend} label={sku.name} deltaPct={sku.deltaPct} tone={meta.tone} />
                        </td>
                        {optionalCols.unitValue ? (
                          <td className={`px-3 ${cellPad} text-right tabular-nums text-zinc-600`}>
                            {USD2.format(sku.unitValue)}
                          </td>
                        ) : null}
                        <td className={`px-3 ${cellPad} text-right font-semibold tabular-nums text-zinc-900`}>
                          {USD.format(sku.totalValue)}
                        </td>
                      </tr>
                    );
                  })}
              </Fragment>
            );
          })}
        </tbody>
      </table>
      {rows.length === 0 ? (
        <div className="px-6 py-16 text-center">
          <p className="text-sm font-semibold text-zinc-700">No SKUs match these filters</p>
          <p className="mt-1 text-sm text-zinc-500">Try clearing the search or switching the status filter.</p>
        </div>
      ) : null}
    </div>
  );
}
