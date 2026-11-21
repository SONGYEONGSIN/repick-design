"use client";

import { useMemo, useState } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { INCIDENTS, engineerById, type Incident, type Severity } from "./data";
import { Badge, SegmentedControl } from "./ui";

type SortKey = "time" | "severity";
type SortDir = "asc" | "desc";
type StatusFilter = "all" | "open" | "resolved";

const SEVERITY_RANK: Record<Severity, number> = { sev1: 0, sev2: 1, sev3: 2 };
const SEVERITY_TONE: Record<Severity, "rose" | "amber" | "neutral"> = {
  sev1: "rose",
  sev2: "amber",
  sev3: "neutral",
};
// Abbreviated for the table's narrow Status column only — the full word still appears in the
// calendar readout panel and the segmented filter above.
const STATUS_LABEL: Record<Incident["status"], string> = { open: "Open", ack: "Ack", resolved: "Done" };

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active) return <ArrowUpDown className="h-3 w-3 text-zinc-400" aria-hidden="true" />;
  return dir === "asc" ? (
    <ArrowUp className="h-3 w-3 text-sky-700" aria-hidden="true" />
  ) : (
    <ArrowDown className="h-3 w-3 text-sky-700" aria-hidden="true" />
  );
}

export function IncidentTable({ pinnedDate }: { pinnedDate: string | null }) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortKey, setSortKey] = useState<SortKey>("time");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const rows = useMemo(() => {
    let base = pinnedDate ? INCIDENTS.filter((i) => i.dateIso === pinnedDate) : INCIDENTS;
    if (statusFilter === "open") base = base.filter((i) => i.status !== "resolved");
    if (statusFilter === "resolved") base = base.filter((i) => i.status === "resolved");
    const sorted = [...base].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "time") {
        cmp = `${a.dateIso}T${a.timeLabel}`.localeCompare(`${b.dateIso}T${b.timeLabel}`);
      } else {
        cmp = SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity];
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
    return sorted;
  }, [pinnedDate, statusFilter, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-zinc-900">
          Incident log
          {pinnedDate ? <span className="ml-2 font-normal text-zinc-500">· {pinnedDate}</span> : null}
        </h2>
        <SegmentedControl
          label="Filter by status"
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { value: "all", label: "All" },
            { value: "open", label: "Open" },
            { value: "resolved", label: "Resolved" },
          ]}
        />
      </div>

      <div className="max-h-96 overflow-y-auto overflow-x-hidden rounded-lg border border-zinc-200">
        <table className="w-full table-fixed border-collapse text-sm">
          <caption className="sr-only">
            Incident log{pinnedDate ? ` for ${pinnedDate}` : ""}, filtered to {statusFilter} status,
            sorted by {sortKey} {sortDir === "asc" ? "ascending" : "descending"}
          </caption>
          <colgroup>
            <col style={{ width: "27%" }} />
            <col style={{ width: "14%" }} />
            <col style={{ width: "13%" }} />
            <col style={{ width: "13%" }} />
            <col style={{ width: "19%" }} />
            <col style={{ width: "14%" }} />
          </colgroup>
          <thead className="sticky top-0 bg-zinc-50 text-[11px] font-medium uppercase tracking-wide text-zinc-600">
            <tr>
              <th scope="col" className="truncate px-3 py-2 text-left font-medium">
                Title
              </th>
              <th scope="col" className="truncate px-3 py-2 text-left font-medium">
                Service
              </th>
              <th scope="col" aria-sort={sortKey === "severity" ? (sortDir === "asc" ? "ascending" : "descending") : "none"} className="overflow-hidden px-3 py-2 text-left font-medium">
                <button
                  type="button"
                  onClick={() => toggleSort("severity")}
                  className="flex h-6 items-center gap-1 overflow-hidden rounded whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
                >
                  Severity
                  <SortIcon active={sortKey === "severity"} dir={sortDir} />
                </button>
              </th>
              <th scope="col" className="truncate px-3 py-2 text-left font-medium">
                Status
              </th>
              <th scope="col" className="truncate px-3 py-2 text-left font-medium">
                Engineer
              </th>
              <th scope="col" aria-sort={sortKey === "time" ? (sortDir === "asc" ? "ascending" : "descending") : "none"} className="overflow-hidden px-3 py-2 text-right font-medium">
                <button
                  type="button"
                  onClick={() => toggleSort("time")}
                  className="ml-auto flex h-6 items-center gap-1 overflow-hidden rounded whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
                >
                  Time
                  <SortIcon active={sortKey === "time"} dir={sortDir} />
                </button>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-3 py-8 text-center text-sm text-zinc-500">
                  No incidents match this filter.
                </td>
              </tr>
            ) : (
              rows.map((inc: Incident) => {
                const eng = engineerById(inc.engineerId);
                return (
                  <tr key={inc.id} className="hover:bg-zinc-50">
                    <td className="truncate px-3 py-2.5 font-medium text-zinc-900">{inc.title}</td>
                    <td className="truncate px-3 py-2.5 text-zinc-600">{inc.service}</td>
                    <td className="overflow-hidden px-2 py-2.5">
                      <Badge tone={SEVERITY_TONE[inc.severity]}>{inc.severity}</Badge>
                    </td>
                    <td className="overflow-hidden px-2 py-2.5">
                      <Badge tone={inc.status === "resolved" ? "emerald" : inc.status === "ack" ? "sky" : "amber"}>
                        {STATUS_LABEL[inc.status]}
                      </Badge>
                    </td>
                    <td className="truncate px-3 py-2.5 text-zinc-600">{eng.name}</td>
                    <td className="overflow-hidden whitespace-nowrap px-3 py-2.5 text-right tabular-nums text-zinc-600">
                      {inc.timeLabel}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
