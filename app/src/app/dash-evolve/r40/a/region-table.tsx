"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import type { Region, RegionStatus } from "./data";
import { formatPercent } from "./format";
import { FOCUS_RING, SegmentedControl, StatusBadge } from "./ui";

type SortKey = "region" | "status" | "uptime" | "incidents";
type SortDir = "asc" | "desc";
type ViewFilter = "all" | "degraded" | "critical";

const SEVERITY_RANK: Record<RegionStatus, number> = { critical: 3, degraded: 2, maintenance: 1, healthy: 0 };

const VIEW_OPTIONS: { value: ViewFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "degraded", label: "Degraded" },
  { value: "critical", label: "Critical" },
];

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active) return <ArrowUpDown className="h-3 w-3 opacity-50" aria-hidden="true" />;
  return dir === "asc" ? <ArrowUp className="h-3 w-3" aria-hidden="true" /> : <ArrowDown className="h-3 w-3" aria-hidden="true" />;
}

function SortableHead({
  label,
  columnKey,
  sortKey,
  sortDir,
  onSort,
}: {
  label: string;
  columnKey: SortKey;
  sortKey: SortKey;
  sortDir: SortDir;
  onSort: (key: SortKey) => void;
}) {
  const active = sortKey === columnKey;
  const ariaSort: "ascending" | "descending" | "none" = !active ? "none" : sortDir === "asc" ? "ascending" : "descending";
  return (
    <th scope="col" aria-sort={ariaSort} className="px-2 py-2 text-right">
      <button
        type="button"
        onClick={() => onSort(columnKey)}
        className={`inline-flex min-h-7 w-full items-center justify-end gap-1 rounded px-1 font-semibold text-[11px] uppercase tracking-[0.04em] motion-safe:transition-colors ${FOCUS_RING} ${
          active ? "text-zinc-50" : "text-zinc-400 hover:text-zinc-50"
        }`}
      >
        {label}
        <SortIcon active={active} dir={sortDir} />
      </button>
    </th>
  );
}

/**
 * The required Geographic/Choropleth a11y fallback: every region as a plain sortable row, not just
 * tiles on the map. Columns are kept to four and headers abbreviated ("Up", "Inc.") deliberately —
 * verified against the mobile width budget below rather than assumed. At 390px the card interior is
 * roughly 320px; 36/28/18/18% gives Region ~115px, Status ~90px, Up ~58px, Inc. ~58px, each above its
 * label+value's intrinsic minimum (the longest status word rendered here is "Degraded" at ~75px with
 * its icon). `table-fixed` + this `<colgroup>` is the only sizing mechanism — no min-w anywhere, so
 * there is nothing that could force an unwanted desktop scrollbar.
 */
export default function RegionTable({ regions, pinnedId }: { regions: Region[]; pinnedId: string }) {
  const [sortKey, setSortKey] = useState<SortKey>("status");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [view, setView] = useState<ViewFilter>("all");

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  const filtered = regions.filter((r) => {
    if (view === "all") return true;
    if (view === "degraded") return r.status === "degraded" || r.status === "critical";
    return r.status === "critical";
  });

  const sorted = [...filtered].sort((a, b) => {
    let cmp = 0;
    if (sortKey === "region") cmp = a.code.localeCompare(b.code);
    else if (sortKey === "status") cmp = SEVERITY_RANK[a.status] - SEVERITY_RANK[b.status];
    else if (sortKey === "uptime") cmp = a.uptimePct - b.uptimePct;
    else cmp = a.incidentCount - b.incidentCount;
    return sortDir === "asc" ? cmp : -cmp;
  });

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-semibold text-sm text-zinc-50">All regions</h3>
        <SegmentedControl label="Filter regions by status" options={VIEW_OPTIONS} value={view} onChange={setView} />
      </div>

      <table className="mt-3 w-full table-fixed border-collapse">
        <caption className="sr-only">
          Uptime and incident counts for every edge region, sortable by region, status, uptime, or incident count.
        </caption>
        <colgroup>
          <col style={{ width: "36%" }} />
          <col style={{ width: "28%" }} />
          <col style={{ width: "18%" }} />
          <col style={{ width: "18%" }} />
        </colgroup>
        <thead>
          <tr className="border-b border-white/10">
            <th scope="col" aria-sort={sortKey === "region" ? (sortDir === "asc" ? "ascending" : "descending") : "none"} className="px-2 py-2 text-left">
              <button
                type="button"
                onClick={() => handleSort("region")}
                className={`inline-flex min-h-7 items-center gap-1 rounded px-1 font-semibold text-[11px] uppercase tracking-[0.04em] motion-safe:transition-colors ${FOCUS_RING} ${
                  sortKey === "region" ? "text-zinc-50" : "text-zinc-400 hover:text-zinc-50"
                }`}
              >
                Region
                <SortIcon active={sortKey === "region"} dir={sortDir} />
              </button>
            </th>
            <th scope="col" aria-sort={sortKey === "status" ? (sortDir === "asc" ? "ascending" : "descending") : "none"} className="px-2 py-2 text-left">
              <button
                type="button"
                onClick={() => handleSort("status")}
                className={`inline-flex min-h-7 items-center gap-1 rounded px-1 font-semibold text-[11px] uppercase tracking-[0.04em] motion-safe:transition-colors ${FOCUS_RING} ${
                  sortKey === "status" ? "text-zinc-50" : "text-zinc-400 hover:text-zinc-50"
                }`}
              >
                Status
                <SortIcon active={sortKey === "status"} dir={sortDir} />
              </button>
            </th>
            <SortableHead label="Up" columnKey="uptime" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
            <SortableHead label="Inc." columnKey="incidents" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
          </tr>
        </thead>
        <tbody>
          {sorted.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-2 py-6 text-center text-sm text-zinc-400">
                No regions match this filter.
              </td>
            </tr>
          ) : (
            sorted.map((region) => {
              const isPinned = region.id === pinnedId;
              return (
                <tr
                  key={region.id}
                  className={`border-b border-white/5 ${isPinned ? "bg-green-400/5" : ""}`}
                >
                  <td className="min-w-0 px-2 py-2">
                    <p className="truncate font-semibold text-sm text-zinc-50">{region.code}</p>
                    <p className="truncate text-xs text-zinc-400">{region.name}</p>
                  </td>
                  <td className="min-w-0 px-2 py-2">
                    <StatusBadge status={region.status} abbreviated />
                  </td>
                  <td className="px-2 py-2 text-right font-medium text-sm tabular-nums text-zinc-50">
                    {formatPercent(region.uptimePct)}
                  </td>
                  <td className="px-2 py-2 text-right font-medium text-sm tabular-nums text-zinc-50">
                    {region.incidentCount}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
