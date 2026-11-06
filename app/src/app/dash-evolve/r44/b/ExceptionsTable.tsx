"use client";

import { useMemo, useState } from "react";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import { EXCEPTIONS, formatDateShort, formatInt, type ExceptionRecord, type WarehouseId } from "./data";
import { Avatar, Card, Pill, SegmentedControl, cn, FOCUS_RING } from "./ui";

type SortKey = "date" | "unitsAffected" | "status";
type SortDir = "asc" | "desc";
type StatusFilter = "all" | "open" | "resolved";

const FILTER_OPTIONS: { id: StatusFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "open", label: "Open" },
  { id: "resolved", label: "Resolved" },
];

const COLUMNS: { key: SortKey | "carrier" | "issue" | "owner"; label: string; sortable: boolean; align?: "right" }[] = [
  { key: "date", label: "Date", sortable: true },
  { key: "carrier", label: "Carrier", sortable: false },
  { key: "issue", label: "Issue", sortable: false },
  { key: "unitsAffected", label: "Units", sortable: true, align: "right" },
  { key: "status", label: "Status", sortable: true },
  { key: "owner", label: "Owner", sortable: false },
];

function sortValue(e: ExceptionRecord, key: SortKey): number | string {
  if (key === "date") return e.dayIndex;
  if (key === "unitsAffected") return e.unitsAffected;
  return e.status;
}

export function ExceptionsTable({ warehouseId, warehouseName }: { warehouseId: WarehouseId; warehouseName: string }) {
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [filter, setFilter] = useState<StatusFilter>("all");

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  const rows = useMemo(() => {
    const scoped = EXCEPTIONS.filter((e) => e.warehouseId === warehouseId && (filter === "all" || e.status === filter));
    const sorted = [...scoped].sort((a, b) => {
      const av = sortValue(a, sortKey);
      const bv = sortValue(b, sortKey);
      const cmp = typeof av === "number" && typeof bv === "number" ? av - bv : String(av).localeCompare(String(bv));
      return sortDir === "asc" ? cmp : -cmp;
    });
    return sorted;
  }, [warehouseId, filter, sortKey, sortDir]);

  return (
    <section id="exceptions-ledger" aria-labelledby="exceptions-heading" tabIndex={-1} className="min-w-0 rounded-xl focus:outline focus:outline-2 focus:outline-offset-4 focus:outline-emerald-700">
      <Card>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 id="exceptions-heading" className="text-base font-semibold text-zinc-900">Exceptions ledger</h2>
            <p className="text-sm font-normal text-zinc-500">{warehouseName} · {rows.length} logged</p>
          </div>
          <SegmentedControl label="Filter exceptions by status" options={FILTER_OPTIONS} value={filter} onChange={setFilter} size="sm" />
        </div>

        <div className="overflow-x-auto">
          <table aria-label={`Shipping exceptions for ${warehouseName}`} className="w-full min-w-[640px] table-fixed border-collapse">
            <colgroup>
              <col style={{ width: "12%" }} />
              <col style={{ width: "16%" }} />
              <col style={{ width: "28%" }} />
              <col style={{ width: "12%" }} />
              <col style={{ width: "14%" }} />
              <col style={{ width: "18%" }} />
            </colgroup>
            <thead>
              <tr className="border-b border-zinc-200">
                {COLUMNS.map((col) => {
                  if (!col.sortable) {
                    return (
                      <th key={col.key} scope="col" className={cn("px-2 py-2.5 text-[11px] font-medium uppercase tracking-wide text-zinc-500", col.align === "right" ? "text-right" : "text-left")}>
                        {col.label}
                      </th>
                    );
                  }
                  const key = col.key as SortKey;
                  const active = sortKey === key;
                  const ariaSort: "ascending" | "descending" | "none" = active ? (sortDir === "asc" ? "ascending" : "descending") : "none";
                  const Icon = active ? (sortDir === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown;
                  return (
                    <th key={col.key} scope="col" aria-sort={ariaSort} className={cn("px-2 py-2.5 text-[11px] font-medium uppercase tracking-wide text-zinc-500", col.align === "right" ? "text-right" : "text-left")}>
                      <button
                        type="button"
                        onClick={() => toggleSort(key)}
                        className={cn("inline-flex items-center gap-1 rounded", FOCUS_RING, col.align === "right" && "flex-row-reverse")}
                      >
                        {col.label}
                        <Icon className={cn("h-3 w-3 shrink-0", active ? "text-zinc-700" : "text-zinc-500")} aria-hidden="true" />
                      </button>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-2 py-8 text-center text-sm font-normal text-zinc-500">No exceptions match this filter.</td>
                </tr>
              ) : (
                rows.map((e) => (
                  <tr key={e.id} className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50">
                    <td className="truncate px-2 py-2.5 text-sm font-normal tabular-nums text-zinc-700">{formatDateShort(e)}</td>
                    <td className="truncate px-2 py-2.5 text-sm font-normal text-zinc-700">{e.carrier}</td>
                    <td className="truncate px-2 py-2.5 text-sm font-normal text-zinc-700">{e.issue}</td>
                    <td className="px-2 py-2.5 text-right text-sm font-medium tabular-nums text-zinc-900">{formatInt(e.unitsAffected)}</td>
                    <td className="px-2 py-2.5">
                      <Pill tone={e.status === "open" ? "watch" : "good"}>{e.status === "open" ? "Open" : "Resolved"}</Pill>
                    </td>
                    <td className="truncate px-2 py-2.5 text-sm font-normal text-zinc-700">
                      <span className="flex items-center gap-2">
                        <Avatar name={e.owner} className="h-5 w-5 text-[9.5px]" />
                        <span className="truncate">{e.owner}</span>
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </section>
  );
}
