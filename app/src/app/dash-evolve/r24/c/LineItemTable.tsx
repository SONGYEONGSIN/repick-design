"use client";

import { useState } from "react";
import { ArrowUpDown, ChevronDown, ChevronUp, Minus, X } from "lucide-react";
import {
  currency,
  deriveVisibleRows,
  formatSigned,
  type BridgeRow,
  type CategoryFilter,
  type SortDir,
  type SortKey,
} from "./data";

const CATEGORY_STYLES: Record<BridgeRow["category"], string> = {
  Balance: "bg-zinc-100 text-zinc-700",
  Growth: "bg-orange-50 text-orange-700",
  Reduction: "bg-zinc-100 text-zinc-600",
};

const CATEGORIES: CategoryFilter[] = ["All", "Balance", "Growth", "Reduction"];

const COLUMNS: { key: SortKey; label: string; scope: "col" }[] = [
  { key: "label", label: "Line item", scope: "col" },
  { key: "delta", label: "Amount", scope: "col" },
  { key: "after", label: "Running total", scope: "col" },
];

interface LineItemTableProps {
  rows: BridgeRow[];
  pinnedKey: string | null;
  hoveredKey: string | null;
  onPin: (key: string | null) => void;
  onHover: (key: string | null) => void;
  periodLabel: string;
}

export default function LineItemTable({ rows, pinnedKey, hoveredKey, onPin, onHover, periodLabel }: LineItemTableProps) {
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("All");
  const [sortKey, setSortKey] = useState<SortKey>("after");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const visible = deriveVisibleRows(rows, { categoryFilter, pinnedKey, sortKey, sortDir });
  const pinnedRow = pinnedKey ? rows.find((r) => r.key === pinnedKey) ?? null : null;

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <label htmlFor="category-filter" className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">
            Category
          </label>
          <select
            id="category-filter"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as CategoryFilter)}
            disabled={!!pinnedKey}
            className="h-9 rounded-lg border border-zinc-200 bg-white px-2.5 text-sm text-zinc-700 outline-none focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {pinnedRow ? (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-200 bg-orange-50 py-1 pl-3 pr-1.5 text-xs font-medium text-orange-700">
            Filtered by: {pinnedRow.label}
            <button
              type="button"
              onClick={() => onPin(null)}
              aria-label={`Clear filter: ${pinnedRow.label}`}
              className="rounded-full p-0.5 outline-none hover:bg-orange-100 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </span>
        ) : (
          <p className="text-xs text-zinc-500">{periodLabel} · click a bar above to filter this table</p>
        )}
      </div>

      <table className="w-full table-fixed border-collapse text-sm">
        <caption className="sr-only">
          Revenue recognition line items for {periodLabel}, with signed amount and running total, sortable and filterable.
        </caption>
        <colgroup>
          <col style={{ width: "46%" }} />
          <col style={{ width: "27%" }} />
          <col style={{ width: "27%" }} />
        </colgroup>
        <thead>
          <tr className="border-b border-zinc-200">
            {COLUMNS.map((col, i) => {
              const active = sortKey === col.key;
              return (
                <th
                  key={col.key}
                  scope={col.scope}
                  aria-sort={active ? (sortDir === "asc" ? "ascending" : "descending") : "none"}
                  className={`py-2.5 text-[11px] font-medium uppercase tracking-wide text-zinc-500 ${i === 0 ? "text-left" : "text-right"}`}
                >
                  <button
                    type="button"
                    onClick={() => toggleSort(col.key)}
                    className={`inline-flex items-center gap-1 rounded outline-none focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700 ${i === 0 ? "" : "flex-row-reverse"}`}
                  >
                    {col.label}
                    {active ? (
                      sortDir === "asc" ? (
                        <ChevronUp className="h-3 w-3" aria-hidden="true" />
                      ) : (
                        <ChevronDown className="h-3 w-3" aria-hidden="true" />
                      )
                    ) : (
                      <ArrowUpDown className="h-3 w-3 text-zinc-500" aria-hidden="true" />
                    )}
                  </button>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {visible.map((row) => {
            const isPinned = pinnedKey === row.key;
            const isHovered = hoveredKey === row.key && !isPinned;
            const Icon = row.type === "increase" ? ChevronUp : row.type === "decrease" ? ChevronDown : Minus;
            const amountColor = row.type === "increase" ? "text-orange-700" : row.type === "decrease" ? "text-zinc-700" : "text-zinc-900";
            return (
              <tr
                key={row.key}
                onMouseEnter={() => onHover(row.key)}
                onMouseLeave={() => onHover(null)}
                onClick={() => onPin(isPinned ? null : row.key)}
                className={`cursor-pointer border-b border-zinc-100 transition-colors duration-150 last:border-b-0 motion-reduce:transition-none ${
                  isPinned ? "bg-orange-50" : isHovered ? "bg-zinc-50" : "bg-white hover:bg-zinc-50"
                }`}
              >
                <td className="py-2.5 pr-2 align-top">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-zinc-900">{row.label}</p>
                    <span className={`mt-1 inline-block rounded-full px-1.5 py-0.5 text-[10px] font-medium ${CATEGORY_STYLES[row.category]}`}>
                      {row.category}
                    </span>
                  </div>
                </td>
                <td className="py-2.5 text-right align-top">
                  <span className={`inline-flex items-center justify-end gap-0.5 whitespace-nowrap tabular-nums font-medium ${amountColor}`}>
                    <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    {row.type === "total" ? currency.format(row.after) : formatSigned(row.delta)}
                  </span>
                </td>
                <td className="py-2.5 text-right align-top">
                  <p className="whitespace-nowrap tabular-nums font-semibold text-zinc-900">{currency.format(row.after)}</p>
                  <p className="whitespace-nowrap text-[11px] tabular-nums text-zinc-500">{row.shareOfOpening}% of opening</p>
                </td>
              </tr>
            );
          })}
          {visible.length === 0 && (
            <tr>
              <td colSpan={3} className="py-8 text-center text-sm text-zinc-500">
                No line items match this filter.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
