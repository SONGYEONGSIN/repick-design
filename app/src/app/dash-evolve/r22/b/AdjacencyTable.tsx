"use client";

import { useMemo, useState } from "react";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import { EDGES, getNode, canonicalStatus, worseStatus, intFormat, type ServiceStatus } from "./data";
import { Tabs, Badge } from "./ui";
import { STATUS_META } from "./tokens";

type SortKey = "source" | "target" | "value" | "status";
type SortDir = "asc" | "desc";
type Filter = "all" | "degraded" | "critical";

const STATUS_RANK: Record<ServiceStatus, number> = { healthy: 0, degraded: 1, critical: 2 };

const rows = EDGES.map((edge) => {
  const src = getNode(edge.source)!;
  const tgt = getNode(edge.target)!;
  const status = worseStatus(canonicalStatus(src), canonicalStatus(tgt));
  return { source: src.label, target: tgt.label, value: edge.callsPerMin, status };
});

/** This table owns its own sort/filter state and reads only the static EDGES data — it is never
 *  re-derived from graph selection, so pinning or hovering a node in ServiceGraph cannot change a
 *  single row here. That isolation is deliberate (see NodelineClient for the full boundary note). */
export function AdjacencyTable({ onSelectNode }: { onSelectNode: (id: string) => void }) {
  const [sortKey, setSortKey] = useState<SortKey>("value");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [filter, setFilter] = useState<Filter>("all");

  const counts = useMemo(
    () => ({
      all: rows.length,
      degraded: rows.filter((r) => r.status === "degraded").length,
      critical: rows.filter((r) => r.status === "critical").length,
    }),
    [],
  );

  const visible = useMemo(() => {
    const filtered = filter === "all" ? rows : rows.filter((r) => r.status === filter);
    const sorted = [...filtered].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "source") cmp = a.source.localeCompare(b.source);
      else if (sortKey === "target") cmp = a.target.localeCompare(b.target);
      else if (sortKey === "value") cmp = a.value - b.value;
      else cmp = STATUS_RANK[a.status] - STATUS_RANK[b.status];
      return sortDir === "asc" ? cmp : -cmp;
    });
    return sorted;
  }, [filter, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  function SortHeader({ label, sortField, className = "" }: { label: string; sortField: SortKey; className?: string }) {
    const active = sortKey === sortField;
    const Icon = active ? (sortDir === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown;
    return (
      <th
        scope="col"
        aria-sort={active ? (sortDir === "asc" ? "ascending" : "descending") : "none"}
        className={`px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-zinc-500 ${className}`}
      >
        <button
          type="button"
          onClick={() => toggleSort(sortField)}
          className="flex items-center gap-1 outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2 rounded"
        >
          {label}
          <Icon size={12} className={active ? "text-teal-700" : "text-zinc-500"} aria-hidden="true" />
        </button>
      </th>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 px-4 pt-3 sm:px-5">
        <Tabs
          ariaLabel="Filter edges by status"
          value={filter}
          onChange={setFilter}
          tabs={[
            { value: "all", label: "All edges", count: counts.all },
            { value: "degraded", label: "Degraded", count: counts.degraded },
            { value: "critical", label: "Critical", count: counts.critical },
          ]}
        />
      </div>

      <div className="px-1 pb-1 sm:px-2">
        <table className="w-full table-fixed border-collapse text-sm">
          <caption className="sr-only">
            Full adjacency list for the service dependency graph — every call edge as Source, Target, calls per
            minute and worst-case status. This table is the accessible fallback for the graph above.
          </caption>
          <thead>
            <tr className="border-b border-zinc-200">
              <SortHeader label="Source" sortField="source" className="w-[38%] text-left sm:w-[34%]" />
              <SortHeader label="Target" sortField="target" className="w-[38%] text-left sm:w-[34%]" />
              <SortHeader label="Calls/min" sortField="value" className="hidden text-right sm:table-cell sm:w-[16%]" />
              <SortHeader label="Status" sortField="status" className="w-[24%] text-left sm:w-[16%]" />
            </tr>
          </thead>
          <tbody>
            {visible.map((row) => {
              const meta = STATUS_META[row.status];
              const Icon = meta.icon;
              return (
                <tr key={`${row.source}-${row.target}`} className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50">
                  <td className="px-3 py-2.5">
                    <button
                      type="button"
                      onClick={() => onSelectNode(row.source)}
                      className="block w-full truncate rounded text-left font-mono text-[12.5px] text-zinc-700 outline-none hover:text-teal-700 hover:underline focus-visible:ring-2 focus-visible:ring-teal-700"
                      title={row.source}
                    >
                      {row.source}
                    </button>
                  </td>
                  <td className="px-3 py-2.5">
                    <button
                      type="button"
                      onClick={() => onSelectNode(row.target)}
                      className="block w-full truncate rounded text-left font-mono text-[12.5px] text-zinc-700 outline-none hover:text-teal-700 hover:underline focus-visible:ring-2 focus-visible:ring-teal-700"
                      title={row.target}
                    >
                      {row.target}
                    </button>
                  </td>
                  <td className="hidden whitespace-nowrap px-3 py-2.5 text-right text-[12.5px] text-zinc-600 sm:table-cell" style={{ fontVariantNumeric: "tabular-nums" }}>
                    {intFormat.format(row.value)}
                  </td>
                  <td className="px-3 py-2.5">
                    <Badge className={meta.badge}>
                      <Icon size={11} aria-hidden="true" />
                      {meta.label}
                    </Badge>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {visible.length === 0 && <p className="px-4 py-8 text-center text-sm text-zinc-500">No edges in this filter.</p>}
      </div>
    </div>
  );
}
