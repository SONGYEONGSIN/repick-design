"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, Search, Users } from "lucide-react";
import {
  BOOKINGS, STATUS_LABEL, getRoomById, formatRange, usdFmt, type Booking, type BookingStatus,
} from "./data";
import { Badge, Card, InitialsAvatar, NUM, SectionLabel, SegmentedControl } from "./ui";

type SortColumn = "date" | "guests" | "revenue";
type SortDir = "asc" | "desc";
type StatusFilter = "all" | BookingStatus;

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "confirmed", label: "Confirmed" },
  { value: "pending", label: "Pending" },
  { value: "cancelled", label: "Cancelled" },
];

function statusTone(status: BookingStatus): "success" | "accent" | "muted" {
  if (status === "confirmed") return "success";
  if (status === "pending") return "accent";
  return "muted";
}

function naturalCompare(a: Booking, b: Booking): number {
  if (a.day !== b.day) return a.day - b.day;
  return a.start - b.start;
}

function SortHeader({
  column, label, active, dir, onSort, className = "",
}: {
  column: SortColumn;
  label: string;
  active: boolean;
  dir: SortDir;
  onSort: (c: SortColumn) => void;
  className?: string;
}) {
  const Icon = active ? (dir === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown;
  return (
    <th
      scope="col"
      aria-sort={active ? (dir === "asc" ? "ascending" : "descending") : "none"}
      className={`px-3 py-2.5 text-left text-[11px] font-medium uppercase tracking-wide text-zinc-500 ${className}`}
    >
      <button
        type="button"
        onClick={() => onSort(column)}
        className="inline-flex min-h-6 max-w-full min-w-0 items-center gap-1 rounded focus-visible:outline-2 outline-offset-2 outline-orange-600"
      >
        <span className="truncate">{label}</span>
        <Icon className={`h-3 w-3 shrink-0 ${active ? "text-orange-700" : "text-zinc-400"}`} aria-hidden="true" />
      </button>
    </th>
  );
}

export function BookingsTable({ selectedDay }: { selectedDay: number }) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [query, setQuery] = useState("");
  const [sortColumn, setSortColumn] = useState<SortColumn | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  function handleSort(column: SortColumn) {
    if (sortColumn !== column) {
      setSortColumn(column);
      setSortDir("asc");
    } else if (sortDir === "asc") {
      setSortDir("desc");
    } else {
      setSortColumn(null);
    }
  }

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = BOOKINGS.filter((bk) => statusFilter === "all" || bk.status === statusFilter);
    if (q) {
      list = list.filter((bk) => bk.eventName.toLowerCase().includes(q) || bk.clientName.toLowerCase().includes(q));
    }
    const sorted = [...list].sort(naturalCompare);
    if (sortColumn) {
      const sign = sortDir === "asc" ? 1 : -1;
      sorted.sort((a, b) => {
        if (sortColumn === "date") return sign * (naturalCompare(a, b) || 0);
        if (sortColumn === "guests") return sign * (a.guests - b.guests);
        return sign * (a.revenue - b.revenue);
      });
    }
    return sorted;
  }, [statusFilter, query, sortColumn, sortDir]);

  return (
    <Card padded={false}>
      <div className="flex flex-col gap-3 border-b border-zinc-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="min-w-0">
          <SectionLabel>All bookings</SectionLabel>
          <h3 className="truncate text-base font-semibold text-zinc-900">
            {rows.length} {rows.length === 1 ? "result" : "results"}
          </h3>
        </div>
        <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center">
          <label className="relative flex h-11 min-w-0 shrink-0 items-center sm:w-56">
            <span className="sr-only">Search bookings by event or client</span>
            <Search className="pointer-events-none absolute left-3 h-4 w-4 text-zinc-400" aria-hidden="true" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search event or client…"
              className="h-11 w-full min-w-0 rounded-lg border border-zinc-200 bg-white pl-9 pr-3 text-sm text-zinc-900 placeholder:text-zinc-500 focus-visible:outline-2 outline-offset-2 outline-orange-600"
            />
          </label>
          <SegmentedControl label="Filter by status" options={STATUS_OPTIONS} value={statusFilter} onChange={setStatusFilter} />
        </div>
      </div>

      {/* Desktop: a real `<table>` with `table-fixed` + `<colgroup>` percentage widths — never an
          `overflow-x-auto` wrapper, so this card can never contribute local horizontal scroll. */}
      <div className="hidden sm:block">
        <table className="w-full table-fixed border-collapse">
          <colgroup>
            <col style={{ width: "12%" }} />
            <col style={{ width: "34%" }} />
            <col style={{ width: "12%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "18%" }} />
            <col style={{ width: "14%" }} />
          </colgroup>
          <thead className="bg-zinc-50">
            <tr>
              <SortHeader column="date" label="Date" active={sortColumn === "date"} dir={sortDir} onSort={handleSort} />
              <th scope="col" className="px-3 py-2.5 text-left text-[11px] font-medium uppercase tracking-wide text-zinc-500">
                Event &amp; client
              </th>
              <th scope="col" className="px-3 py-2.5 text-left text-[11px] font-medium uppercase tracking-wide text-zinc-500">
                Room
              </th>
              <SortHeader column="guests" label="Guests" active={sortColumn === "guests"} dir={sortDir} onSort={handleSort} className="text-right" />
              <th scope="col" className="px-3 py-2.5 text-left text-[11px] font-medium uppercase tracking-wide text-zinc-500">
                Status
              </th>
              <SortHeader column="revenue" label="Revenue" active={sortColumn === "revenue"} dir={sortDir} onSort={handleSort} className="text-right" />
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-3 py-10 text-center text-sm text-zinc-500">
                  No bookings match this filter.
                </td>
              </tr>
            ) : (
              rows.map((bk) => {
                const room = getRoomById(bk.room);
                const highlighted = bk.day === selectedDay;
                return (
                  <tr key={bk.id} className={`${highlighted ? "bg-orange-50/60" : ""} hover:bg-zinc-50`}>
                    <td className={`whitespace-nowrap px-3 py-3 text-sm text-zinc-700 ${NUM}`}>Nov {bk.day}</td>
                    <td className="px-3 py-3">
                      <div className="flex min-w-0 items-center gap-2">
                        <InitialsAvatar name={bk.clientName} size={26} />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-zinc-900">{bk.eventName}</p>
                          <p className="truncate text-xs text-zinc-500">{bk.clientName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-sm text-zinc-700">
                      <span className="block truncate">{room.code}</span>
                    </td>
                    <td className={`whitespace-nowrap px-3 py-3 text-right text-sm text-zinc-700 ${NUM}`}>{bk.guests}</td>
                    <td className="px-3 py-3">
                      <Badge tone={statusTone(bk.status)}>{STATUS_LABEL[bk.status]}</Badge>
                    </td>
                    <td className={`whitespace-nowrap px-3 py-3 text-right text-sm font-medium text-zinc-900 ${NUM}`}>{usdFmt.format(bk.revenue)}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile (<640px): the same rows restructured as stacked cards instead of a literal table,
          so the route never needs local horizontal scroll on narrow viewports either. */}
      <ul className="flex flex-col divide-y divide-zinc-100 sm:hidden">
        {rows.length === 0 ? (
          <li className="px-4 py-10 text-center text-sm text-zinc-500">No bookings match this filter.</li>
        ) : (
          rows.map((bk) => {
            const room = getRoomById(bk.room);
            const highlighted = bk.day === selectedDay;
            return (
              <li key={bk.id} className={`min-w-0 p-4 ${highlighted ? "bg-orange-50/60" : ""}`}>
                <div className="flex min-w-0 items-start justify-between gap-2">
                  <div className="flex min-w-0 items-start gap-2">
                    <InitialsAvatar name={bk.clientName} size={28} />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-zinc-900">{bk.eventName}</p>
                      <p className="truncate text-xs text-zinc-500">{bk.clientName}</p>
                    </div>
                  </div>
                  <Badge tone={statusTone(bk.status)}>{STATUS_LABEL[bk.status]}</Badge>
                </div>
                <div className="mt-2 flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-500">
                  <span className={`whitespace-nowrap ${NUM}`}>Nov {bk.day}</span>
                  <span className="whitespace-nowrap">{formatRange(bk.start, bk.end)}</span>
                  <span className="whitespace-nowrap">{room.name}</span>
                  <span className="flex items-center gap-1 whitespace-nowrap">
                    <Users className="h-3 w-3 shrink-0" aria-hidden="true" />
                    {bk.guests}
                  </span>
                  <span className={`ml-auto shrink-0 whitespace-nowrap font-medium text-zinc-900 ${NUM}`}>{usdFmt.format(bk.revenue)}</span>
                </div>
              </li>
            );
          })
        )}
      </ul>
    </Card>
  );
}
