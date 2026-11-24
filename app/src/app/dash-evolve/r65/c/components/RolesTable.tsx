"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { ALL_ROLES, DEPARTMENTS, MONTH_LABELS, elapsedDays, type DeptId, type RoleStatus } from "../lib/data";
import { Card, CardHeader, Dropdown, FOCUS_RING, StatusPill } from "./ui";

type DeptFilter = "all" | DeptId;
export type StatusFilter = "open" | "all" | RoleStatus;
type SortKey = "title" | "elapsed";
type SortDir = "asc" | "desc";

export const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "open", label: "Open pipeline" },
  { value: "all", label: "All statuses" },
  { value: "Sourcing", label: "Sourcing" },
  { value: "Interviewing", label: "Interviewing" },
  { value: "Offer Extended", label: "Offer Extended" },
  { value: "Filled", label: "Filled" },
  { value: "Withdrawn", label: "Withdrawn" },
];

const OPEN_STATUSES: RoleStatus[] = ["Sourcing", "Interviewing", "Offer Extended"];

export function RolesTable({ statusFilter, onStatusFilterChange }: { statusFilter: StatusFilter; onStatusFilterChange: (s: StatusFilter) => void }) {
  const [deptFilter, setDeptFilter] = useState<DeptFilter>("all");
  const [sortKey, setSortKey] = useState<SortKey>("elapsed");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [deptOpen, setDeptOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);

  const rows = useMemo(() => {
    const filtered = ALL_ROLES.filter((r) => {
      if (deptFilter !== "all" && r.dept !== deptFilter) return false;
      if (statusFilter === "open" && !OPEN_STATUSES.includes(r.status)) return false;
      if (statusFilter !== "open" && statusFilter !== "all" && r.status !== statusFilter) return false;
      return true;
    }).map((r) => ({ ...r, elapsed: elapsedDays(r.openedIdx, r.closedIdx) }));

    const sorted = [...filtered].sort((a, b) => {
      const mul = sortDir === "asc" ? 1 : -1;
      if (sortKey === "title") return a.title.localeCompare(b.title) * mul;
      return (a.elapsed - b.elapsed) * mul;
    });
    return sorted;
  }, [deptFilter, statusFilter, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "elapsed" ? "desc" : "asc");
    }
  }

  function sortIcon(key: SortKey) {
    if (key !== sortKey) return <ArrowUpDown className="h-3 w-3 shrink-0 text-zinc-400" aria-hidden="true" />;
    return sortDir === "asc" ? <ArrowUp className="h-3 w-3 shrink-0 text-lime-300" aria-hidden="true" /> : <ArrowDown className="h-3 w-3 shrink-0 text-lime-300" aria-hidden="true" />;
  }

  function ariaSortFor(key: SortKey): "ascending" | "descending" | "none" {
    if (key !== sortKey) return "none";
    return sortDir === "asc" ? "ascending" : "descending";
  }

  return (
    <Card>
      <CardHeader
        title="Open roles pipeline"
        subtitle={`${rows.length} role${rows.length === 1 ? "" : "s"} · as of today, independent of the period toggle above`}
      />

      <div className="flex min-w-0 flex-wrap items-center gap-2 border-b border-white/10 p-4 sm:p-5">
        <Dropdown
          label="Department"
          ariaLabel="Filter by department"
          value={deptFilter}
          open={deptOpen}
          onOpenChange={(o) => {
            setDeptOpen(o);
            if (o) setStatusOpen(false);
          }}
          onChange={setDeptFilter}
          options={[{ value: "all" as DeptFilter, label: "All departments" }, ...DEPARTMENTS.map((d) => ({ value: d.id as DeptFilter, label: d.name }))]}
        />
        <Dropdown
          label="Status"
          ariaLabel="Filter by status"
          value={statusFilter}
          open={statusOpen}
          onOpenChange={(o) => {
            setStatusOpen(o);
            if (o) setDeptOpen(false);
          }}
          onChange={onStatusFilterChange}
          options={STATUS_OPTIONS}
        />
      </div>

      <div className="min-w-0 overflow-x-auto">
        <table className="w-full min-w-[720px] table-fixed border-collapse text-left text-sm">
          <caption className="sr-only" style={{ position: "relative" }}>
            Open roles pipeline, filterable by department and status, sortable by role title and days elapsed.
          </caption>
          <colgroup>
            <col style={{ width: "28%" }} />
            <col style={{ width: "18%" }} />
            <col style={{ width: "12%" }} />
            <col style={{ width: "16%" }} />
            <col style={{ width: "12%" }} />
            <col style={{ width: "14%" }} />
          </colgroup>
          <thead>
            <tr className="border-b border-white/10">
              <th scope="col" className="px-4 py-2.5 sm:px-5" aria-sort={ariaSortFor("title")}>
                <button type="button" onClick={() => toggleSort("title")} className={`flex min-h-7 items-center gap-1.5 py-1 text-xs font-medium text-zinc-400 hover:text-zinc-100 ${FOCUS_RING}`}>
                  Role
                  {sortIcon("title")}
                </button>
              </th>
              <th scope="col" className="px-2 py-2.5 text-xs font-medium text-zinc-400">
                Department
              </th>
              <th scope="col" className="px-2 py-2.5 text-xs font-medium text-zinc-400">
                Level
              </th>
              <th scope="col" className="px-2 py-2.5 text-xs font-medium text-zinc-400">
                Status
              </th>
              <th scope="col" className="px-2 py-2.5 text-xs font-medium text-zinc-400">
                Opened
              </th>
              <th scope="col" className="px-2 py-2.5 pr-4 sm:pr-5" aria-sort={ariaSortFor("elapsed")}>
                <button type="button" onClick={() => toggleSort("elapsed")} className={`flex min-h-7 items-center gap-1.5 py-1 text-xs font-medium text-zinc-400 hover:text-zinc-100 ${FOCUS_RING}`}>
                  Elapsed
                  {sortIcon("elapsed")}
                </button>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-sm text-zinc-400 sm:px-5">
                  No roles match this filter.
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id}>
                  <td className="truncate px-4 py-2.5 text-zinc-100 sm:px-5">{r.title}</td>
                  <td className="truncate px-2 py-2.5 text-zinc-400">{DEPARTMENTS.find((d) => d.id === r.dept)?.name}</td>
                  <td className="truncate px-2 py-2.5 text-zinc-400">{r.level}</td>
                  <td className="px-2 py-2.5">
                    <StatusPill status={r.status} />
                  </td>
                  <td className="truncate px-2 py-2.5 tabular-nums text-zinc-400">{MONTH_LABELS[r.openedIdx]}</td>
                  <td className="truncate px-2 py-2.5 pr-4 tabular-nums text-zinc-100 sm:pr-5">{r.elapsed}d</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
