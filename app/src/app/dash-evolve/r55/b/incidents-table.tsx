"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import type { Incident } from "./data";
import { FOCUS_RING, SegmentedControl, SeverityBadge } from "./ui";

type SortKey = "opened" | "severity" | "response" | "status";
type SortDir = "asc" | "desc";
type StatusFilter = "all" | "Open" | "Resolved";

const SEVERITY_RANK: Record<Incident["severity"], number> = { Critical: 1, Major: 2, Minor: 3 };

function sortIncidents(list: Incident[], key: SortKey, dir: SortDir): Incident[] {
  const sorted = [...list].sort((a, b) => {
    let cmp = 0;
    if (key === "opened") cmp = a.openedSortKey - b.openedSortKey;
    else if (key === "severity") cmp = SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity];
    else if (key === "response") cmp = a.responseMinutes - b.responseMinutes;
    else cmp = a.status.localeCompare(b.status);
    return dir === "asc" ? cmp : -cmp;
  });
  return sorted;
}

function SortHeader({
  label,
  sortKey,
  active,
  dir,
  onSort,
  align = "left",
}: {
  label: string;
  sortKey: SortKey;
  active: boolean;
  dir: SortDir;
  onSort: (key: SortKey) => void;
  align?: "left" | "right";
}) {
  return (
    <th
      scope="col"
      aria-sort={active ? (dir === "asc" ? "ascending" : "descending") : "none"}
      className={`overflow-hidden px-3 py-2 ${align === "right" ? "text-right" : "text-left"}`}
    >
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className={`inline-flex min-w-0 max-w-full items-center gap-1 text-[11px] font-medium uppercase tracking-wide text-zinc-500 hover:text-zinc-900 ${FOCUS_RING}`}
      >
        <span className="min-w-0 truncate">{label}</span>
        {active ? (
          dir === "asc" ? (
            <ArrowUp className="h-3 w-3 shrink-0" aria-hidden="true" />
          ) : (
            <ArrowDown className="h-3 w-3 shrink-0" aria-hidden="true" />
          )
        ) : (
          <ArrowUpDown className="h-3 w-3 shrink-0 text-zinc-300" aria-hidden="true" />
        )}
      </button>
    </th>
  );
}

export function IncidentsTable({ vendorName, incidents }: { vendorName: string; incidents: Incident[] }) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortKey, setSortKey] = useState<SortKey>("opened");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const filtered = useMemo(
    () => (statusFilter === "all" ? incidents : incidents.filter((i) => i.status === statusFilter)),
    [incidents, statusFilter],
  );
  const rows = useMemo(() => sortIncidents(filtered, sortKey, sortDir), [filtered, sortKey, sortDir]);

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  return (
    <div className="min-w-0">
      <div className="mb-3 flex min-w-0 flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-zinc-900">Response-time incidents</h3>
          <p className="truncate text-xs text-zinc-500">
            {rows.length} of {incidents.length} shown for {vendorName}
          </p>
        </div>
        <SegmentedControl
          label="Filter by status"
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { value: "all", label: "All" },
            { value: "Open", label: "Open" },
            { value: "Resolved", label: "Resolved" },
          ]}
        />
      </div>

      {incidents.length === 0 ? (
        <p className="rounded-lg border border-dashed border-zinc-200 px-3 py-6 text-center text-sm text-zinc-500">
          No logged incidents for this vendor in the current window.
        </p>
      ) : (
        <>
          {/* Desktop: a real sortable table. table-fixed + colgroup percentages sum to 100%, no
             min-w floor, no overflow-x-auto wrapper — the row body scrolls vertically only. */}
          <div className="hidden min-w-0 lg:block">
            <div className="min-w-0 rounded-lg border border-zinc-200">
              <div className="max-h-[360px] min-w-0 overflow-y-auto">
                <table className="w-full min-w-0 table-fixed border-collapse text-sm">
                  <caption className="sr-only">Response-time incidents for {vendorName}, sortable by column</caption>
                  <colgroup>
                    <col style={{ width: "40%" }} />
                    <col style={{ width: "14%" }} />
                    <col style={{ width: "14%" }} />
                    <col style={{ width: "16%" }} />
                    <col style={{ width: "16%" }} />
                  </colgroup>
                  <thead className="sticky top-0 z-10 bg-zinc-50">
                    <tr className="border-b border-zinc-200">
                      <th scope="col" className="overflow-hidden px-3 py-2 text-left text-[11px] font-medium uppercase tracking-wide text-zinc-500">
                        <span className="truncate">Subject</span>
                      </th>
                      <SortHeader label="Opened" sortKey="opened" active={sortKey === "opened"} dir={sortDir} onSort={handleSort} />
                      <SortHeader label="Severity" sortKey="severity" active={sortKey === "severity"} dir={sortDir} onSort={handleSort} />
                      <SortHeader label="Response" sortKey="response" active={sortKey === "response"} dir={sortDir} onSort={handleSort} align="right" />
                      <SortHeader label="Status" sortKey="status" active={sortKey === "status"} dir={sortDir} onSort={handleSort} />
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((incident) => (
                      <tr key={incident.id} className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50">
                        <td className="overflow-hidden px-3 py-2.5 font-normal">
                          <span className="block truncate text-zinc-900">{incident.subject}</span>
                          <span className="block truncate text-xs text-zinc-500">{incident.id}</span>
                        </td>
                        <td className="overflow-hidden whitespace-nowrap px-3 py-2.5 font-normal text-zinc-600">{incident.openedLabel}</td>
                        <td className="overflow-hidden px-3 py-2.5 font-normal">
                          <SeverityBadge severity={incident.severity} />
                        </td>
                        <td className="overflow-hidden whitespace-nowrap px-3 py-2.5 text-right font-normal tabular-nums text-zinc-900">
                          {incident.responseMinutes}m
                        </td>
                        <td className="overflow-hidden whitespace-nowrap px-3 py-2.5 font-normal text-zinc-600">{incident.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Mobile: the same rows as a stacked card list — no horizontal scroll anywhere. */}
          <ul className="flex min-w-0 flex-col gap-2 lg:hidden">
            {rows.map((incident) => (
              <li key={incident.id} className="min-w-0 rounded-lg border border-zinc-200 px-3 py-2.5">
                <div className="flex min-w-0 items-center justify-between gap-2">
                  <span className="min-w-0 truncate text-xs text-zinc-500">{incident.id}</span>
                  <SeverityBadge severity={incident.severity} />
                </div>
                <p className="mt-1 line-clamp-2 min-w-0 break-words text-sm font-medium text-zinc-900">{incident.subject}</p>
                <div className="mt-1.5 flex min-w-0 items-center justify-between gap-2 whitespace-nowrap text-xs text-zinc-600">
                  <span className="truncate">{incident.openedLabel}</span>
                  <span className="tabular-nums">{incident.responseMinutes}m</span>
                  <span className="shrink-0">{incident.status}</span>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
