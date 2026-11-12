"use client";

import { ArrowDown, ArrowUp, ArrowUpDown, ListFilter, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { EVENTS, regionLabel, type EventRow } from "./data";
import { BORDER, FOCUS, HOVER_ROW, SEVERITY_BADGE, TEXT_AUX, TEXT_MUTED, TEXT_PRIMARY, TRANSITION, type Severity, cx } from "./tokens";
import { CardHead, Segmented } from "./ui";

type SortKey = "time" | "severity" | "region";
type SortDir = "asc" | "desc";

const SEVERITY_RANK: Record<Severity, number> = { critical: 0, warning: 1, info: 2, resolved: 3 };
const SEVERITY_FILTERS: { id: Severity | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "critical", label: "Critical" },
  { id: "warning", label: "Warning" },
  { id: "info", label: "Info" },
];

const STATUS_DOT: Record<EventRow["status"], string> = {
  Open: "bg-rose-500",
  Monitoring: "bg-amber-500",
  Resolved: "bg-emerald-500",
};

function SortHeader({ label, active, dir, onClick, className }: { label: string; active: boolean; dir: SortDir; onClick: () => void; className?: string }) {
  return (
    <th scope="col" aria-sort={active ? (dir === "asc" ? "ascending" : "descending") : "none"} className={cx("px-3 py-2 text-left font-medium", className)}>
      <button
        type="button"
        onClick={onClick}
        className={cx("-my-1 flex min-h-7 items-center gap-1 py-1 text-[11px] font-medium uppercase tracking-[0.06em]", TEXT_AUX, TRANSITION, FOCUS, "hover:text-zinc-900")}
      >
        {label}
        {active ? dir === "asc" ? <ArrowUp size={12} aria-hidden="true" /> : <ArrowDown size={12} aria-hidden="true" /> : <ArrowUpDown size={12} aria-hidden="true" className="opacity-40" />}
      </button>
    </th>
  );
}

export default function EventLog() {
  const [severityFilter, setSeverityFilter] = useState<Severity | "all">("all");
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("time");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const q = query.trim().toLowerCase();
  const rows = useMemo(() => {
    const filtered = EVENTS.filter((e) => {
      if (severityFilter !== "all" && e.severity !== severityFilter) return false;
      if (q === "") return true;
      return e.message.toLowerCase().includes(q) || e.id.toLowerCase().includes(q) || regionLabel(e.region).toLowerCase().includes(q);
    });
    const sorted = [...filtered].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "time") cmp = a.minutesAgo - b.minutesAgo;
      else if (sortKey === "severity") cmp = SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity];
      else cmp = regionLabel(a.region).localeCompare(regionLabel(b.region));
      return sortDir === "asc" ? cmp : -cmp;
    });
    return sorted;
  }, [severityFilter, q, sortKey, sortDir]);

  return (
    <div>
      <CardHead
        title="Incident log"
        Icon={ListFilter}
        hint="Independent from the chart above — filtering or sorting here never changes what the chart displays, and scrubbing the chart never filters this list."
      />

      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Segmented ariaLabel="Filter by severity" options={SEVERITY_FILTERS} value={severityFilter} onChange={setSeverityFilter} />

        <label className={cx("flex h-9 min-w-0 items-center gap-2 rounded-lg border px-2.5 sm:w-64", BORDER, "bg-zinc-50")}>
          <Search size={14} aria-hidden="true" className={cx("shrink-0", TEXT_AUX)} />
          <span className="sr-only">Search incidents</span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search message, region, ID…"
            className={cx("h-full min-w-0 flex-1 bg-transparent text-sm font-normal", TEXT_PRIMARY, "placeholder:text-zinc-400")}
          />
        </label>
      </div>

      <div className="relative mt-3 overflow-x-auto rounded-xl border border-zinc-100 [scrollbar-width:thin]">
        <table className="w-full min-w-[640px] table-fixed border-collapse text-sm">
          <caption className="sr-only">{`Incident log, ${rows.length} of ${EVENTS.length} events shown, sorted by ${sortKey} ${sortDir === "asc" ? "ascending" : "descending"}.`}</caption>
          <colgroup>
            <col className="w-[14%]" />
            <col className="w-[13%]" />
            <col className="w-[14%]" />
            <col className="w-[41%]" />
            <col className="w-[18%]" />
          </colgroup>
          <thead>
            <tr className="border-b border-zinc-200">
              <SortHeader label="Time" active={sortKey === "time"} dir={sortDir} onClick={() => toggleSort("time")} />
              <th scope="col" className={cx("px-3 py-2 text-left text-[11px] font-medium uppercase tracking-[0.06em]", TEXT_AUX)}>
                Severity
              </th>
              <SortHeader label="Region" active={sortKey === "region"} dir={sortDir} onClick={() => toggleSort("region")} />
              <th scope="col" className={cx("px-3 py-2 text-left text-[11px] font-medium uppercase tracking-[0.06em]", TEXT_AUX)}>
                Event
              </th>
              <th scope="col" className={cx("px-3 py-2 text-left text-[11px] font-medium uppercase tracking-[0.06em]", TEXT_AUX)}>
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {rows.map((e) => (
              <tr key={e.id} className={cx(HOVER_ROW, TRANSITION)}>
                <td className={cx("whitespace-nowrap px-3 py-2.5 align-top text-xs font-normal", "tabular-nums", TEXT_MUTED)}>{e.time}</td>
                <td className="px-3 py-2.5 align-top">
                  <span className={cx("inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium capitalize leading-none", SEVERITY_BADGE[e.severity])}>{e.severity}</span>
                </td>
                <td className={cx("px-3 py-2.5 align-top text-xs font-normal", TEXT_MUTED)}>{regionLabel(e.region)}</td>
                <td className={cx("px-3 py-2.5 align-top text-sm font-normal leading-snug", TEXT_PRIMARY)}>
                  <span className="line-clamp-2">{e.message}</span>
                  <span className={cx("mt-0.5 block text-[11px] font-normal", TEXT_AUX)}>{e.id}</span>
                </td>
                <td className="px-3 py-2.5 align-top">
                  <span className={cx("inline-flex items-center gap-1.5 text-xs font-medium", TEXT_MUTED)}>
                    <span className={cx("h-1.5 w-1.5 shrink-0 rounded-full", STATUS_DOT[e.status])} aria-hidden="true" />
                    {e.status}
                  </span>
                </td>
              </tr>
            ))}
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} className={cx("px-3 py-8 text-center text-sm font-normal", TEXT_AUX)}>
                  No incidents match this filter.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
