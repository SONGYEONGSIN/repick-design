"use client";

import { useMemo, useState } from "react";
import { ArrowUp, ArrowDown, ArrowUpDown, Filter, ListFilter } from "lucide-react";
import { PICKUP_ROWS, inspectorById, currency, type PickupRow, type PickupStatus } from "./data";
import { Card, CardHeader, Badge, statusTone, riskTone, Popover, PopoverItem, FOCUS, Avatar } from "./ui";

type SortKey = "when" | "item" | "seller" | "value" | "status";
type SortDir = "asc" | "desc";

const STATUS_OPTIONS: (PickupStatus | "All")[] = ["All", "Scheduled", "In Transit", "Inspecting", "Graded", "Flagged"];

const COLS: { key: SortKey | null; label: string; width: string; align?: "right" }[] = [
  { key: "when", label: "Time", width: "8%" },
  { key: "item", label: "Item", width: "35%" },
  { key: "seller", label: "Seller", width: "12%" },
  { key: null, label: "Inspector", width: "15%" },
  { key: "value", label: "Est. Value", width: "12%", align: "right" },
  { key: null, label: "Risk", width: "8%" },
  { key: "status", label: "Status", width: "10%" },
];

function sortVal(row: PickupRow, key: SortKey): string | number {
  switch (key) {
    case "when":
      return `${row.iso}T${row.time}`;
    case "item":
      return row.item;
    case "seller":
      return row.seller;
    case "value":
      return row.estValue;
    case "status":
      return row.status;
  }
}

export function PickupTable() {
  const [sortKey, setSortKey] = useState<SortKey>("when");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [statusFilter, setStatusFilter] = useState<PickupStatus | "All">("All");

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const rows = useMemo(() => {
    const filtered = statusFilter === "All" ? PICKUP_ROWS : PICKUP_ROWS.filter((r) => r.status === statusFilter);
    const sorted = [...filtered].sort((a, b) => {
      const av = sortVal(a, sortKey);
      const bv = sortVal(b, sortKey);
      const cmp = typeof av === "number" && typeof bv === "number" ? av - bv : String(av).localeCompare(String(bv));
      return sortDir === "asc" ? cmp : -cmp;
    });
    return sorted;
  }, [sortKey, sortDir, statusFilter]);

  const totalValue = rows.reduce((s, r) => s + r.estValue, 0);

  return (
    <Card padded={false}>
      <div className="flex items-center justify-between gap-3 border-b border-zinc-100 p-5">
        <CardHeader
          title="Pickup Queue"
          subtitle="Current operating week · Aug 31 – Sep 6 · independent of the pinned day above"
        />
        <Popover
          align="right"
          width="w-48"
          trigger={({ toggle, open: isOpen }) => (
            <button
              type="button"
              onClick={toggle}
              aria-haspopup="listbox"
              aria-expanded={isOpen}
              className={`flex h-9 items-center gap-1.5 rounded-lg border border-zinc-200 px-3 text-[12.5px] font-medium text-zinc-600 hover:bg-zinc-50 ${FOCUS}`}
            >
              <ListFilter className="h-3.5 w-3.5" aria-hidden />
              {statusFilter === "All" ? "All statuses" : statusFilter}
            </button>
          )}
        >
          {(close) => (
            <div>
              {STATUS_OPTIONS.map((opt) => (
                <PopoverItem
                  key={opt}
                  icon={<Filter className="h-3.5 w-3.5" aria-hidden />}
                  onClick={() => {
                    setStatusFilter(opt);
                    close();
                  }}
                >
                  {opt === "All" ? "All statuses" : opt}
                </PopoverItem>
              ))}
            </div>
          )}
        </Popover>
      </div>

      {/* Below `md` a 7-column fixed table has no honest way to fit real content
          (seller names, item names, currency) without clipping or wrapping —
          so narrow widths get a stacked row-card list of the same, already
          sorted/filtered `rows` array instead of a second scrolling container. */}
      <ul className="space-y-2 p-5 md:hidden">
        {rows.map((r) => {
          const insp = inspectorById(r.inspectorId);
          return (
            <li key={r.id} className="rounded-lg border border-zinc-100 p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-medium text-zinc-900">{r.item}</p>
                  <p className="truncate text-[11.5px] text-zinc-500">
                    {shortDay(r.iso)} {r.time} · {r.seller}
                  </p>
                </div>
                <p className="shrink-0 text-[12.5px] font-medium tabular-nums text-zinc-900">{currency(r.estValue)}</p>
              </div>
              <div className="mt-2 flex items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-1.5">
                  <Avatar name={insp.name} size={18} />
                  <span className="truncate text-[11.5px] text-zinc-500">{insp.name}</span>
                </div>
                <div className="flex shrink-0 gap-1.5">
                  <Badge tone={riskTone(r.risk)}>{r.risk}</Badge>
                  <Badge tone={statusTone(r.status)}>{r.status}</Badge>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="hidden overflow-hidden px-5 pb-5 pt-3 md:block">
        <table className="w-full table-fixed border-collapse">
          <colgroup>
            {COLS.map((c) => (
              <col key={c.label} style={{ width: c.width }} />
            ))}
          </colgroup>
          <thead>
            <tr className="border-b border-zinc-200">
              {COLS.map((c) => {
                if (!c.key) {
                  return (
                    <th
                      key={c.label}
                      scope="col"
                      className={`py-2 text-[11px] font-medium uppercase tracking-[0.08em] text-zinc-500 ${
                        c.align === "right" ? "text-right" : "text-left"
                      }`}
                    >
                      {c.label}
                    </th>
                  );
                }
                const active = sortKey === c.key;
                const ariaSort = active ? (sortDir === "asc" ? "ascending" : "descending") : "none";
                return (
                  <th key={c.label} scope="col" aria-sort={ariaSort} className="py-2">
                    <button
                      type="button"
                      onClick={() => toggleSort(c.key as SortKey)}
                      className={`flex items-center gap-1 text-[11px] font-medium uppercase tracking-[0.08em] text-zinc-500 hover:text-zinc-800 ${FOCUS} ${
                        c.align === "right" ? "ml-auto" : ""
                      }`}
                    >
                      {c.label}
                      {active ? (
                        sortDir === "asc" ? (
                          <ArrowUp className="h-3 w-3" aria-hidden />
                        ) : (
                          <ArrowDown className="h-3 w-3" aria-hidden />
                        )
                      ) : (
                        <ArrowUpDown className="h-3 w-3 text-zinc-300" aria-hidden />
                      )}
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const insp = inspectorById(r.inspectorId);
              return (
                <tr key={r.id} className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50">
                  <td className="whitespace-nowrap py-2.5 pr-2 text-[12px] tabular-nums text-zinc-500">
                    {shortDay(r.iso)} {r.time}
                  </td>
                  <td className="py-2.5 pr-2">
                    <p className="truncate text-[13px] font-medium text-zinc-900">{r.item}</p>
                    <p className="truncate text-[11px] text-zinc-500">{r.category}</p>
                  </td>
                  <td className="truncate py-2.5 pr-2 text-[12.5px] text-zinc-700">{r.seller}</td>
                  <td className="py-2.5 pr-2">
                    <div className="flex min-w-0 items-center gap-2">
                      <Avatar name={insp.name} size={22} />
                      <span className="truncate text-[12.5px] text-zinc-700">{insp.name}</span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap py-2.5 pr-2 text-right text-[12.5px] font-medium tabular-nums text-zinc-900">
                    {currency(r.estValue)}
                  </td>
                  <td className="py-2.5 pr-2">
                    <Badge tone={riskTone(r.risk)}>{r.risk}</Badge>
                  </td>
                  <td className="py-2.5">
                    <Badge tone={statusTone(r.status)}>{r.status}</Badge>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={4} className="pt-3 text-[11.5px] text-zinc-500">
                {rows.length} of {PICKUP_ROWS.length} pickups shown
              </td>
              <td className="pt-3 text-right text-[12.5px] font-semibold tabular-nums text-zinc-900">
                {currency(totalValue)}
              </td>
              <td colSpan={2} className="pt-3" />
            </tr>
          </tfoot>
        </table>
      </div>
    </Card>
  );
}

function shortDay(iso: string): string {
  const days: Record<string, string> = {
    "2026-08-31": "Mon",
    "2026-09-01": "Tue",
    "2026-09-02": "Wed",
    "2026-09-03": "Thu",
    "2026-09-04": "Fri",
    "2026-09-05": "Sat",
    "2026-09-06": "Sun",
  };
  return days[iso] ?? iso.slice(5);
}
