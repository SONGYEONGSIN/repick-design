"use client";

import { useMemo, useState } from "react";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import { fmtDateLong, fmtDuration, fmtTime, fmtCurrency, type Appointment, type Status } from "./data";
import { Card, SectionHeading, StatusBadge, FOCUS_RING } from "./ui";

type ColumnKey = "time" | "customer" | "service" | "provider" | "location" | "duration" | "status" | "revenue";

const COLUMNS: { key: ColumnKey; label: string; width: string; align?: "right" }[] = [
  { key: "time", label: "Time", width: "9%" },
  { key: "customer", label: "Customer", width: "16%" },
  { key: "service", label: "Service", width: "14%" },
  { key: "provider", label: "Provider", width: "17%" },
  { key: "location", label: "Location", width: "10%" },
  { key: "duration", label: "Duration", width: "9%" },
  { key: "status", label: "Status", width: "14%" },
  { key: "revenue", label: "Revenue", width: "11%", align: "right" },
];

const STATUS_FILTERS: { key: Status | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "confirmed", label: "Confirmed" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
  { key: "no-show", label: "No-show" },
];

function columnValue(a: Appointment, key: ColumnKey): string | number {
  switch (key) {
    case "time": return a.startMin;
    case "customer": return a.customer;
    case "service": return a.service;
    case "provider": return a.provider;
    case "location": return a.location;
    case "duration": return a.durationMin;
    case "status": return a.status;
    case "revenue": return a.revenue;
  }
}

export function AppointmentsTable({ date, appointments }: { date: string; appointments: Appointment[] }) {
  const [sortKey, setSortKey] = useState<ColumnKey>("time");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all");

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: appointments.length };
    for (const a of appointments) c[a.status] = (c[a.status] ?? 0) + 1;
    return c;
  }, [appointments]);

  const filtered = useMemo(
    () => (statusFilter === "all" ? appointments : appointments.filter((a) => a.status === statusFilter)),
    [appointments, statusFilter]
  );

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      const av = columnValue(a, sortKey);
      const bv = columnValue(b, sortKey);
      const cmp = typeof av === "number" && typeof bv === "number" ? av - bv : String(av).localeCompare(String(bv));
      return sortDir === "asc" ? cmp : -cmp;
    });
    return arr;
  }, [filtered, sortKey, sortDir]);

  function onSort(key: ColumnKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const activeCol = COLUMNS.find((c) => c.key === sortKey);

  return (
    <Card id="appointments-table" padded className="scroll-mt-24">
      <SectionHeading
        title="Appointments"
        action={
          <span className="text-xs font-normal text-zinc-500">{filtered.length} of {appointments.length} shown</span>
        }
      />

      <div role="group" aria-label="Filter appointments by status" className="mb-4 flex flex-wrap gap-1.5">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            aria-pressed={statusFilter === f.key}
            onClick={() => setStatusFilter(f.key)}
            className={`rounded-full border px-3 py-2 text-xs font-medium ${FOCUS_RING} ${
              statusFilter === f.key ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-200 text-zinc-600 hover:bg-zinc-50"
            }`}
          >
            {f.label} <span className={statusFilter === f.key ? "text-zinc-300" : "text-zinc-500"}>({counts[f.key] ?? 0})</span>
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] table-fixed border-collapse text-sm">
          <caption className="sr-only">
            Appointments for {fmtDateLong(date)}, sorted by {activeCol?.label.toLowerCase()} {sortDir === "asc" ? "ascending" : "descending"}
          </caption>
          <colgroup>
            {COLUMNS.map((c) => (
              <col key={c.key} style={{ width: c.width }} />
            ))}
          </colgroup>
          <thead>
            <tr className="border-b border-zinc-200">
              {COLUMNS.map((c) => {
                const active = c.key === sortKey;
                const ariaSort = active ? (sortDir === "asc" ? "ascending" : "descending") : "none";
                const Icon = active ? (sortDir === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown;
                return (
                  <th
                    key={c.key}
                    scope="col"
                    aria-sort={ariaSort}
                    className={`py-2.5 text-xs font-medium text-zinc-500 ${c.align === "right" ? "text-right" : "text-left"}`}
                  >
                    <button
                      type="button"
                      onClick={() => onSort(c.key)}
                      className={`inline-flex items-center gap-1 rounded py-2 ${FOCUS_RING} ${c.align === "right" ? "flex-row-reverse" : ""}`}
                    >
                      {c.label}
                      <Icon aria-hidden="true" className={`h-3 w-3 shrink-0 ${active ? "text-zinc-700" : "text-zinc-300"}`} />
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 && (
              <tr>
                <td colSpan={COLUMNS.length} className="py-8 text-center text-sm font-normal text-zinc-500">
                  No appointments match this filter.
                </td>
              </tr>
            )}
            {sorted.map((a) => (
              <tr key={a.id} className="border-b border-zinc-100 last:border-b-0 hover:bg-zinc-50">
                <td className="whitespace-nowrap py-2.5 pr-2 text-sm font-normal text-zinc-700">{fmtTime(a.startMin)}</td>
                <td className="truncate py-2.5 pr-2 text-sm font-medium text-zinc-900" title={a.customer}>{a.customer}</td>
                <td className="truncate py-2.5 pr-2 text-sm font-normal text-zinc-700" title={a.service}>{a.service}</td>
                <td className="truncate py-2.5 pr-2 text-sm font-normal text-zinc-700" title={a.provider}>{a.provider}</td>
                <td className="truncate py-2.5 pr-2 text-sm font-normal text-zinc-700" title={a.location}>{a.location}</td>
                <td className="whitespace-nowrap py-2.5 pr-2 text-sm font-normal text-zinc-700">{fmtDuration(a.durationMin)}</td>
                <td className="py-2.5 pr-2"><StatusBadge status={a.status} /></td>
                <td className="whitespace-nowrap py-2.5 text-right text-sm font-medium text-zinc-900">{fmtCurrency(a.revenue)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
