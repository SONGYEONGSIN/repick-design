"use client";

import { useMemo, useState } from "react";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import type { Status, Ticket } from "./data";
import { STATUS_LABEL } from "./data";
import { InitialsAvatar, PriorityBadge, StatusBadge, SegmentedControl } from "./ui";

type SortKey = "id" | "priority" | "status" | "age";
type SortDir = "asc" | "desc";
type StatusFilter = "all" | Status;

const PRIORITY_RANK: Record<Ticket["priority"], number> = { urgent: 0, high: 1, normal: 2, low: 3 };
const STATUS_RANK: Record<Status, number> = { open: 0, waiting: 1, pending: 2 };

const FILTER_OPTIONS: readonly StatusFilter[] = ["all", "open", "pending", "waiting"];
const FILTER_LABEL: Record<StatusFilter, string> = { all: "All", ...STATUS_LABEL };

function ageLabel(daysOpen: number): string {
  return daysOpen === 0 ? "Today" : `${daysOpen}d`;
}

/**
 * Module-scope (not defined inside TicketTable) so it doesn't get recreated,
 * and its state reset, on every render — it takes the active sort state as
 * explicit props instead of closing over it.
 */
function SortIcon({ column, sortKey, sortDir }: { column: SortKey; sortKey: SortKey; sortDir: SortDir }) {
  if (sortKey !== column) return <ChevronsUpDown className="h-3 w-3 text-zinc-400" aria-hidden="true" />;
  return sortDir === "asc" ? (
    <ChevronUp className="h-3 w-3 text-amber-700" aria-hidden="true" />
  ) : (
    <ChevronDown className="h-3 w-3 text-amber-700" aria-hidden="true" />
  );
}

/**
 * The real sortable table, scoped to one category's tickets. Owns both halves
 * of the brief's third interaction: the status filter chips and the
 * sortable column headers (clicking a header toggles direction; aria-sort
 * reflects the active column). `tickets` arrives already scoped to the
 * selected category and the current Today / 7d / 30d period.
 */
export function TicketTable({ tickets, categoryLabel }: { tickets: Ticket[]; categoryLabel: string }) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortKey, setSortKey] = useState<SortKey>("age");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const filtered = useMemo(
    () => (statusFilter === "all" ? tickets : tickets.filter((t) => t.status === statusFilter)),
    [tickets, statusFilter],
  );

  const sorted = useMemo(() => {
    const dir = sortDir === "asc" ? 1 : -1;
    return [...filtered].sort((a, b) => {
      switch (sortKey) {
        case "id":
          return (a.id - b.id) * dir;
        case "priority":
          return (PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority]) * dir;
        case "status":
          return (STATUS_RANK[a.status] - STATUS_RANK[b.status]) * dir;
        case "age":
        default:
          return (a.daysOpen - b.daysOpen) * dir;
      }
    });
  }, [filtered, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "age" ? "desc" : "asc");
    }
  }

  function headerProps(key: SortKey) {
    const active = sortKey === key;
    return {
      "aria-sort": (active ? (sortDir === "asc" ? "ascending" : "descending") : "none") as
        | "ascending"
        | "descending"
        | "none",
    };
  }

  return (
    <div className="flex min-w-0 flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <SegmentedControl
          options={FILTER_OPTIONS}
          value={statusFilter}
          onChange={setStatusFilter}
          getLabel={(o) => FILTER_LABEL[o]}
          ariaLabel="Filter tickets by status"
        />
        <p className="shrink-0 tabular-nums text-xs text-zinc-500">
          {sorted.length} of {tickets.length}
        </p>
      </div>

      <table className="w-full table-fixed border-collapse text-sm">
        <caption className="sr-only relative">
          {categoryLabel} tickets, sorted by {sortKey}, {sortDir === "asc" ? "ascending" : "descending"}
        </caption>
        <colgroup>
          <col style={{ width: "12%" }} />
          <col style={{ width: "34%" }} />
          <col style={{ width: "18%" }} />
          <col style={{ width: "18%" }} />
          <col style={{ width: "18%" }} />
        </colgroup>
        <thead>
          <tr className="border-b border-zinc-200">
            <th scope="col" {...headerProps("id")} className="py-2 pl-0 pr-1 text-left">
              <button
                type="button"
                onClick={() => toggleSort("id")}
                className="inline-flex items-center gap-1 rounded text-[11px] font-medium uppercase tracking-[0.06em] text-zinc-500 outline-offset-2 focus-visible:outline-2 focus-visible:outline-amber-700"
              >
                ID <SortIcon column="id" sortKey={sortKey} sortDir={sortDir} />
              </button>
            </th>
            <th scope="col" className="px-1 py-2 text-left text-[11px] font-medium uppercase tracking-[0.06em] text-zinc-500">
              Subject
            </th>
            <th scope="col" {...headerProps("priority")} className="px-1 py-2 text-left">
              <button
                type="button"
                onClick={() => toggleSort("priority")}
                className="inline-flex items-center gap-1 rounded text-[11px] font-medium uppercase tracking-[0.06em] text-zinc-500 outline-offset-2 focus-visible:outline-2 focus-visible:outline-amber-700"
              >
                Priority <SortIcon column="priority" sortKey={sortKey} sortDir={sortDir} />
              </button>
            </th>
            <th scope="col" {...headerProps("status")} className="px-1 py-2 text-left">
              <button
                type="button"
                onClick={() => toggleSort("status")}
                className="inline-flex items-center gap-1 rounded text-[11px] font-medium uppercase tracking-[0.06em] text-zinc-500 outline-offset-2 focus-visible:outline-2 focus-visible:outline-amber-700"
              >
                Status <SortIcon column="status" sortKey={sortKey} sortDir={sortDir} />
              </button>
            </th>
            <th scope="col" {...headerProps("age")} className="py-2 pl-1 pr-0 text-right">
              <button
                type="button"
                onClick={() => toggleSort("age")}
                className="inline-flex items-center gap-1 rounded text-[11px] font-medium uppercase tracking-[0.06em] text-zinc-500 outline-offset-2 focus-visible:outline-2 focus-visible:outline-amber-700"
              >
                <SortIcon column="age" sortKey={sortKey} sortDir={sortDir} /> Age
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((ticket) => (
            <tr key={ticket.id} className="border-b border-zinc-100 align-top last:border-0 hover:bg-zinc-50">
              <td className="truncate py-2.5 pl-0 pr-1 align-top tabular-nums text-xs text-zinc-500">#{ticket.id}</td>
              <td className="min-w-0 px-1 py-2.5 align-top">
                <p className="truncate text-sm font-medium text-zinc-900">{ticket.subject}</p>
                <p className="mt-1 flex min-w-0 items-center gap-1.5">
                  <InitialsAvatar name={ticket.requester} className="h-4 w-4" />
                  <span className="min-w-0 flex-1 truncate text-xs text-zinc-500">{ticket.requester}</span>
                </p>
              </td>
              <td className="px-1 py-2.5 align-top">
                <PriorityBadge priority={ticket.priority} />
              </td>
              <td className="px-1 py-2.5 align-top">
                <StatusBadge status={ticket.status} />
              </td>
              <td className="truncate py-2.5 pl-1 pr-0 text-right align-top tabular-nums text-xs text-zinc-500">
                {ageLabel(ticket.daysOpen)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {sorted.length === 0 && (
        <p className="py-6 text-center text-sm text-zinc-500">No tickets match this filter.</p>
      )}
    </div>
  );
}
