"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, Search, AlertTriangle } from "lucide-react";
import {
  JOBS, STATUS_LABEL, getTechnicianById, formatClock, formatRange, formatHours, statusFilterMatches,
  type Job, type StatusFilter,
} from "./data";
import { Badge, Card, InitialsAvatar, NUM, SectionLabel, SegmentedControl, DISPLAY_FACE } from "./ui";

type SortColumn = "time" | "duration";
type SortDir = "asc" | "desc";

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "scheduled", label: "Scheduled" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
];

function statusTone(status: Job["status"]): "success" | "strong" | "muted" | "neutral" {
  if (status === "completed") return "success";
  if (status === "in_progress") return "strong";
  if (status === "cancelled") return "muted";
  return "neutral";
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
        className="inline-flex min-h-6 max-w-full min-w-0 items-center gap-1 rounded focus-visible:outline-2 outline-offset-2 outline-green-700"
      >
        <span className="truncate">{label}</span>
        <Icon className={`h-3 w-3 shrink-0 ${active ? "text-green-700" : "text-zinc-500"}`} aria-hidden="true" />
      </button>
    </th>
  );
}

/** This table's status filter and free-text search are local to the table only — a second,
 *  independent instance of "real filtering," unrelated to the schedule section's own status
 *  filter above. Each reads/writes its own state and recomputes only its own rows. */
export function JobsTable({ pinnedTechId }: { pinnedTechId: string | null }) {
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
    let list = JOBS.filter((job) => statusFilterMatches(job, statusFilter));
    if (q) {
      list = list.filter((job) => job.title.toLowerCase().includes(q) || job.customer.toLowerCase().includes(q));
    }
    const sorted = [...list].sort((a, b) => a.start - b.start);
    if (sortColumn) {
      const sign = sortDir === "asc" ? 1 : -1;
      sorted.sort((a, b) => (sortColumn === "time" ? sign * (a.start - b.start) : sign * (a.duration - b.duration)));
    }
    return sorted;
  }, [statusFilter, query, sortColumn, sortDir]);

  return (
    <Card padded={false}>
      <div className="flex flex-col gap-3 border-b border-zinc-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="min-w-0">
          <SectionLabel>All jobs</SectionLabel>
          <h2 className="truncate text-base font-semibold text-zinc-900" style={DISPLAY_FACE}>
            {"Today's full schedule"}
          </h2>
          <p className={`truncate text-xs text-zinc-500 ${NUM}`}>{rows.length} {rows.length === 1 ? "result" : "results"}</p>
        </div>
        <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center">
          <label className="relative flex h-11 min-w-0 shrink-0 items-center sm:w-56">
            <span className="sr-only">Search jobs by title or customer</span>
            <Search className="pointer-events-none absolute left-3 h-4 w-4 text-zinc-500" aria-hidden="true" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search job or customer…"
              className="h-11 w-full min-w-0 rounded-lg border border-zinc-200 bg-white pl-9 pr-3 text-sm text-zinc-900 placeholder:text-zinc-500 focus-visible:outline-2 outline-offset-2 outline-green-700"
            />
          </label>
          <SegmentedControl label="Filter table by status" options={STATUS_OPTIONS} value={statusFilter} onChange={setStatusFilter} />
        </div>
      </div>

      {/* Desktop: a real `<table>` with `table-fixed` + `<colgroup>` percentage widths — never an
          `overflow-x-auto` wrapper, so this card can never contribute local horizontal scroll. */}
      <div className="hidden sm:block">
        <table className="w-full table-fixed border-collapse">
          <caption className="sr-only">{"Today's dispatched jobs, sortable by time or duration"}</caption>
          <colgroup>
            <col style={{ width: "10%" }} />
            <col style={{ width: "30%" }} />
            <col style={{ width: "18%" }} />
            <col style={{ width: "12%" }} />
            <col style={{ width: "16%" }} />
            <col style={{ width: "14%" }} />
          </colgroup>
          <thead className="bg-zinc-50">
            <tr>
              <SortHeader column="time" label="Time" active={sortColumn === "time"} dir={sortDir} onSort={handleSort} />
              <th scope="col" className="px-3 py-2.5 text-left text-[11px] font-medium uppercase tracking-wide text-zinc-500">
                Job &amp; customer
              </th>
              <th scope="col" className="px-3 py-2.5 text-left text-[11px] font-medium uppercase tracking-wide text-zinc-500">
                Technician
              </th>
              <th scope="col" className="px-3 py-2.5 text-left text-[11px] font-medium uppercase tracking-wide text-zinc-500">
                Priority
              </th>
              <th scope="col" className="px-3 py-2.5 text-left text-[11px] font-medium uppercase tracking-wide text-zinc-500">
                Status
              </th>
              <SortHeader column="duration" label="Duration" active={sortColumn === "duration"} dir={sortDir} onSort={handleSort} className="text-right" />
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-3 py-10 text-center text-sm text-zinc-500">
                  No jobs match this filter.
                </td>
              </tr>
            ) : (
              rows.map((job) => {
                const tech = getTechnicianById(job.tech);
                const highlighted = job.tech === pinnedTechId;
                return (
                  <tr key={job.id} className={`${highlighted ? "bg-green-50/60" : ""} hover:bg-zinc-50`}>
                    <td className={`whitespace-nowrap px-3 py-3 text-sm text-zinc-700 ${NUM}`}>{formatClock(job.start)}</td>
                    <td className="px-3 py-3">
                      <div className="flex min-w-0 items-center gap-2">
                        <InitialsAvatar name={job.customer} size={26} />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-zinc-900">{job.title}</p>
                          <p className="truncate text-xs text-zinc-500">{job.customer}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <span className="block truncate text-sm text-zinc-700">{tech.name}</span>
                    </td>
                    <td className="px-3 py-3">
                      {job.priority === "urgent" ? (
                        <span className="flex min-w-0 items-center gap-1 text-sm text-zinc-900">
                          <AlertTriangle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                          <span className="truncate">Urgent</span>
                        </span>
                      ) : (
                        <span className="block truncate text-sm text-zinc-500">Standard</span>
                      )}
                    </td>
                    <td className="px-3 py-3">
                      <Badge tone={statusTone(job.status)}>{STATUS_LABEL[job.status]}</Badge>
                    </td>
                    <td className={`whitespace-nowrap px-3 py-3 text-right text-sm font-medium text-zinc-900 ${NUM}`}>{formatHours(job.duration)}</td>
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
          <li className="px-4 py-10 text-center text-sm text-zinc-500">No jobs match this filter.</li>
        ) : (
          rows.map((job) => {
            const tech = getTechnicianById(job.tech);
            const highlighted = job.tech === pinnedTechId;
            return (
              <li key={job.id} className={`min-w-0 p-4 ${highlighted ? "bg-green-50/60" : ""}`}>
                <div className="flex min-w-0 items-start justify-between gap-2">
                  <div className="flex min-w-0 items-start gap-2">
                    <InitialsAvatar name={job.customer} size={28} />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-zinc-900">{job.title}</p>
                      <p className="truncate text-xs text-zinc-500">{job.customer}</p>
                    </div>
                  </div>
                  <Badge tone={statusTone(job.status)}>{STATUS_LABEL[job.status]}</Badge>
                </div>
                <div className="mt-2 flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-500">
                  <span className={`whitespace-nowrap ${NUM}`}>{formatRange(job.start, job.duration)}</span>
                  <span className="whitespace-nowrap">{tech.name}</span>
                  {job.priority === "urgent" ? (
                    <span className="flex items-center gap-1 whitespace-nowrap text-zinc-900">
                      <AlertTriangle className="h-3 w-3 shrink-0" aria-hidden="true" />
                      Urgent
                    </span>
                  ) : null}
                  <span className={`ml-auto shrink-0 whitespace-nowrap font-medium text-zinc-900 ${NUM}`}>{formatHours(job.duration)}</span>
                </div>
              </li>
            );
          })
        )}
      </ul>
    </Card>
  );
}
