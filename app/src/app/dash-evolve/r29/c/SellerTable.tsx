"use client";

import { useMemo, useState } from "react";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import {
  SELLERS,
  formatCurrency,
  formatCount,
  formatPercent,
  FOCUS_RING,
  type Seller,
} from "./data";
import { TierInline, TrendPill, Avatar } from "./ui";

type SortColumn = "name" | "revenue" | "returnRatePct" | "orderVolume" | "trend30dPts";
type SortDir = "asc" | "desc";

interface Column {
  key: SortColumn;
  label: string;
  numeric?: boolean;
  width: string;
}

const COLUMNS: Column[] = [
  { key: "name", label: "Seller", width: "24%" },
  { key: "returnRatePct", label: "Return rate", numeric: true, width: "12%" },
  { key: "revenue", label: "Revenue (90d)", numeric: true, width: "16%" },
  { key: "orderVolume", label: "Orders", numeric: true, width: "11%" },
  { key: "trend30dPts", label: "30-day trend", numeric: true, width: "20%" },
];
const TIER_COL_WIDTH = "17%";

export default function SellerTable({ pinnedId, onPin }: { pinnedId: string | null; onPin: (id: string) => void }) {
  const [sortColumn, setSortColumn] = useState<SortColumn>("revenue");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const sorted = useMemo(() => {
    const dir = sortDir === "asc" ? 1 : -1;
    return [...SELLERS].sort((a, b) => {
      if (sortColumn === "name") return a.name.localeCompare(b.name) * dir;
      return (a[sortColumn] - b[sortColumn]) * dir;
    });
  }, [sortColumn, sortDir]);

  function handleSort(col: SortColumn) {
    if (col === sortColumn) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(col);
      setSortDir(col === "name" ? "asc" : "desc");
    }
  }

  return (
    <div className="rounded-xl border border-white/10 bg-zinc-900 p-4 sm:p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-sm font-semibold text-zinc-50">All sellers</h2>
        {/* Deliberately not reactive to the pinned seller — sorting reflects your last column
            choice, not whichever row happens to be pinned above. */}
        <p className="text-xs font-normal text-zinc-400">
          Sort order is independent of the pinned seller — pinning highlights a row without reordering the table.
        </p>
      </div>

      <div className="mt-3 min-w-0 overflow-x-auto lg:overflow-visible">
        <table className="w-full min-w-[860px] table-fixed border-collapse text-sm lg:min-w-0">
          <caption className="sr-only font-normal">
            All {SELLERS.length} sellers with quality tier, return rate, 90-day revenue, order volume, and
            30-day return-rate trend, sortable by column.
          </caption>
          <colgroup>
            <col style={{ width: COLUMNS[0].width }} />
            <col style={{ width: TIER_COL_WIDTH }} />
            {COLUMNS.slice(1).map((c) => (
              <col key={c.key} style={{ width: c.width }} />
            ))}
          </colgroup>
          <thead>
            <tr className="border-b border-white/10 text-left text-xs text-zinc-400">
              <SortableHeader col={COLUMNS[0]} sortColumn={sortColumn} sortDir={sortDir} onSort={handleSort} />
              <th scope="col" className="px-2 py-2 text-left font-medium">
                Tier
              </th>
              {COLUMNS.slice(1).map((col) => (
                <SortableHeader key={col.key} col={col} sortColumn={sortColumn} sortDir={sortDir} onSort={handleSort} />
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {sorted.map((seller: Seller) => {
              const isPinned = seller.id === pinnedId;
              return (
                <tr key={seller.id} className={isPinned ? "bg-sky-500/[0.06]" : ""}>
                  <th scope="row" className="py-2.5 pr-2 text-left font-medium">
                    <button
                      type="button"
                      onClick={() => onPin(seller.id)}
                      aria-pressed={isPinned}
                      className={`flex w-full items-center gap-2.5 rounded text-left ${FOCUS_RING}`}
                    >
                      <Avatar initials={seller.initials} size={26} />
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium text-zinc-50">{seller.name}</span>
                        <span className="block truncate text-[11px] font-normal text-zinc-400">{seller.category}</span>
                      </span>
                    </button>
                  </th>
                  <td className="px-2 py-2.5 text-left">
                    <TierInline tier={seller.tier} />
                  </td>
                  <td className="whitespace-nowrap px-2 py-2.5 text-right font-normal tabular-nums text-zinc-200">
                    {formatPercent(seller.returnRatePct)}
                  </td>
                  <td className="whitespace-nowrap px-2 py-2.5 text-right font-normal tabular-nums text-zinc-200">
                    {formatCurrency(seller.revenue)}
                  </td>
                  <td className="whitespace-nowrap px-2 py-2.5 text-right font-normal tabular-nums text-zinc-200">
                    {formatCount(seller.orderVolume)}
                  </td>
                  <td className="py-2.5 pl-2 text-right">
                    <TrendPill pts={seller.trend30dPts} compact />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SortableHeader({
  col,
  sortColumn,
  sortDir,
  onSort,
}: {
  col: Column;
  sortColumn: SortColumn;
  sortDir: SortDir;
  onSort: (col: SortColumn) => void;
}) {
  const active = sortColumn === col.key;
  const ariaSort = active ? (sortDir === "asc" ? "ascending" : "descending") : "none";
  const Icon = active ? (sortDir === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown;
  return (
    <th
      scope="col"
      aria-sort={ariaSort}
      className={`py-2 font-medium ${col.numeric ? "text-right" : "text-left"} ${col.key === "name" ? "pr-2" : "px-2"}`}
    >
      <button
        type="button"
        onClick={() => onSort(col.key)}
        className={`flex min-h-6 items-center gap-1 rounded py-1 ${FOCUS_RING} ${col.numeric ? "ml-auto flex-row-reverse" : ""}`}
      >
        {col.label}
        <Icon className={`h-3 w-3 ${active ? "text-sky-400" : "text-zinc-400"}`} aria-hidden="true" />
      </button>
    </th>
  );
}
