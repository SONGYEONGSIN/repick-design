"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import type { CategoryEntry } from "./data";
import { categoryPercent } from "./data";
import { formatCurrency, formatPercent1 } from "./format";
import { Card, CardHeading, FOCUS_RING } from "./ui";

type SortKey = "name" | "amount" | "percent";
type SortDirection = "ascending" | "descending";

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: "name", label: "Category" },
  { key: "amount", label: "Monthly cost" },
  { key: "percent", label: "% of total" },
];

export default function AllocationTable({
  categories,
  total,
  periodLabel,
}: {
  categories: CategoryEntry[];
  total: number;
  periodLabel: string;
}) {
  const [sortKey, setSortKey] = useState<SortKey>("amount");
  const [sortDirection, setSortDirection] = useState<SortDirection>("descending");

  const rows = [...categories].sort((a, b) => {
    const dir = sortDirection === "ascending" ? 1 : -1;
    if (sortKey === "name") return a.name.localeCompare(b.name) * dir;
    if (sortKey === "percent") {
      return (categoryPercent(a, total) - categoryPercent(b, total)) * dir;
    }
    return (a.amount - b.amount) * dir;
  });

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDirection((d) => (d === "ascending" ? "descending" : "ascending"));
    } else {
      setSortKey(key);
      setSortDirection("descending");
    }
  }

  const percentSum = categories.reduce((sum, c) => sum + categoryPercent(c, total), 0);

  return (
    <Card>
      <CardHeading
        title="Allocation table"
        subtitle="Every category, sortable, with its share of spend for the period."
      />
      <table className="mt-4 w-full table-fixed border-collapse">
        <caption className="mb-2 text-left font-normal text-xs text-zinc-400">
          Cost allocation by category, {periodLabel.toLowerCase()}. Percentages sum to {percentSum.toFixed(1)}%.
        </caption>
        <colgroup>
          <col style={{ width: "46%" }} />
          <col style={{ width: "27%" }} />
          <col style={{ width: "27%" }} />
        </colgroup>
        <thead>
          <tr className="border-b border-white/10">
            {COLUMNS.map((col) => {
              const active = col.key === sortKey;
              const Icon = active ? (sortDirection === "ascending" ? ArrowUp : ArrowDown) : ArrowUpDown;
              return (
                <th
                  key={col.key}
                  scope="col"
                  aria-sort={active ? sortDirection : "none"}
                  className={`px-2 py-2 font-medium text-[11px] uppercase tracking-wide text-zinc-400 ${
                    col.key === "name" ? "text-left" : "text-right"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => handleSort(col.key)}
                    className={`inline-flex items-center gap-1 rounded ${FOCUS_RING}`}
                  >
                    {col.label}
                    <Icon className="h-3 w-3 shrink-0" aria-hidden="true" />
                  </button>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((category) => (
            <tr key={category.id} className="border-b border-white/5 last:border-0 hover:bg-white/5">
              <th scope="row" className="px-2 py-2.5 text-left font-medium text-sm text-zinc-50">
                <span className="flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="h-2.5 w-2.5 shrink-0 rounded-sm"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="truncate">{category.name}</span>
                </span>
              </th>
              <td className="px-2 py-2.5 text-right font-normal text-sm text-zinc-50 tabular-nums">
                {formatCurrency(category.amount)}
              </td>
              <td className="px-2 py-2.5 text-right font-normal text-sm text-zinc-50 tabular-nums">
                {formatPercent1(categoryPercent(category, total))}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th scope="row" className="px-2 pt-2.5 text-left font-semibold text-sm text-zinc-50">
              Total
            </th>
            <td className="px-2 pt-2.5 text-right font-semibold text-sm text-zinc-50 tabular-nums">
              {formatCurrency(total)}
            </td>
            <td className="px-2 pt-2.5 text-right font-semibold text-sm text-zinc-50 tabular-nums">
              {percentSum.toFixed(1)}%
            </td>
          </tr>
        </tfoot>
      </table>
    </Card>
  );
}
