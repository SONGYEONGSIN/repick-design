"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { EXPERIMENTS, classifyLift, type Experiment, type ExperimentStatus } from "./data";
import { formatCount } from "./format";
import { Avatar, FOCUS_RING, LiftBadge, SegmentedControl, Sparkline, StatusBadge } from "./ui";

type SortKey = "name" | "status" | "lift" | "confidence" | "samples";
type SortDir = "asc" | "desc";
type ViewFilter = "all" | ExperimentStatus;

const VIEW_OPTIONS: { value: ViewFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "running", label: "Running" },
  { value: "completed", label: "Shipped" },
  { value: "paused", label: "Paused" },
];

const STATUS_RANK: Record<ExperimentStatus, number> = { running: 2, paused: 1, completed: 0 };

function totalSample(e: Experiment): number {
  return e.controlSample + e.variantSample;
}

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
  align = "right",
}: {
  label: string;
  columnKey: SortKey;
  sortKey: SortKey;
  sortDir: SortDir;
  onSort: (key: SortKey) => void;
  align?: "left" | "right";
}) {
  const active = sortKey === columnKey;
  const ariaSort: "ascending" | "descending" | "none" = !active ? "none" : sortDir === "asc" ? "ascending" : "descending";
  return (
    <th scope="col" aria-sort={ariaSort} className={`px-2 py-2 ${align === "right" ? "text-right" : "text-left"}`}>
      <button
        type="button"
        onClick={() => onSort(columnKey)}
        className={`inline-flex min-h-7 w-full items-center gap-1 whitespace-nowrap rounded px-1 font-semibold text-[11px] uppercase tracking-[0.04em] motion-safe:transition-colors ${FOCUS_RING} ${
          align === "right" ? "justify-end" : "justify-start"
        } ${active ? "text-zinc-50" : "text-zinc-400 hover:text-zinc-50"}`}
      >
        {label}
        <SortIcon active={active} dir={sortDir} />
      </button>
    </th>
  );
}

export default function ExperimentsTable({ pinnedIds }: { pinnedIds: string[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("confidence");
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

  const filtered = EXPERIMENTS.filter((e) => view === "all" || e.status === view);

  const sorted = [...filtered].sort((a, b) => {
    let cmp = 0;
    if (sortKey === "name") cmp = a.name.localeCompare(b.name);
    else if (sortKey === "status") cmp = STATUS_RANK[a.status] - STATUS_RANK[b.status];
    else if (sortKey === "lift") cmp = a.liftPct - b.liftPct;
    else if (sortKey === "confidence") cmp = a.confidencePct - b.confidencePct;
    else cmp = totalSample(a) - totalSample(b);
    return sortDir === "asc" ? cmp : -cmp;
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-semibold text-sm text-zinc-50">All experiments</h3>
        <SegmentedControl label="Filter experiments by status" options={VIEW_OPTIONS} value={view} onChange={setView} />
      </div>

      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[720px] table-fixed border-collapse">
          <caption className="sr-only">
            Every experiment with its current lift, statistical confidence, 14-day trend, and sample size, sortable by any
            column.
          </caption>
          <colgroup>
            <col style={{ width: "28%" }} />
            <col style={{ width: "14%" }} />
            <col style={{ width: "12%" }} />
            <col style={{ width: "12%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "14%" }} />
            <col style={{ width: "10%" }} />
          </colgroup>
          <thead>
            <tr className="border-b border-white/10">
              <SortableHead label="Experiment" columnKey="name" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} align="left" />
              <th scope="col" className="whitespace-nowrap px-2 py-2 text-left font-semibold text-[11px] uppercase tracking-[0.04em] text-zinc-400">
                Owner
              </th>
              <SortableHead label="Status" columnKey="status" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} align="left" />
              <SortableHead label="Lift" columnKey="lift" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
              <SortableHead label="Confid." columnKey="confidence" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
              <th scope="col" className="whitespace-nowrap px-2 py-2 text-right font-semibold text-[11px] uppercase tracking-[0.04em] text-zinc-400">
                Trend
              </th>
              <SortableHead label="Samples" columnKey="samples" sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-2 py-6 text-center font-normal text-sm text-zinc-400">
                  No experiments match this filter.
                </td>
              </tr>
            ) : (
              sorted.map((e) => {
                const pinned = pinnedIds.includes(e.id);
                const liftClass = classifyLift(e.ciFull);
                return (
                  <tr key={e.id} className={`border-b border-white/5 ${pinned ? "bg-lime-400/5" : ""}`}>
                    <td className="px-2 py-2.5">
                      <p className="truncate font-medium text-sm text-zinc-50">{e.name}</p>
                      <p className="truncate font-normal text-xs text-zinc-400">{e.metricLabel}</p>
                    </td>
                    <td className="px-2 py-2.5">
                      <span className="flex min-w-0 items-center gap-2">
                        <Avatar initials={e.owner.initials} className="h-6 w-6 text-[10px]" />
                        <span className="truncate font-normal text-xs text-zinc-400">{e.owner.name}</span>
                      </span>
                    </td>
                    <td className="px-2 py-2.5">
                      <StatusBadge status={e.status} />
                    </td>
                    <td className="px-2 py-2.5 text-right">
                      <LiftBadge liftPct={e.liftPct} liftClass={liftClass} size="sm" className="justify-end" />
                    </td>
                    <td className="whitespace-nowrap px-2 py-2.5 text-right font-medium text-sm tabular-nums text-zinc-50">
                      {e.confidencePct}%
                    </td>
                    <td className="px-2 py-2.5 text-right">
                      <Sparkline
                        values={e.trend14}
                        className="ml-auto"
                        stroke={liftClass === "positive" ? "stroke-lime-400" : liftClass === "negative" ? "stroke-rose-400" : "stroke-zinc-400"}
                      />
                    </td>
                    <td className="whitespace-nowrap px-2 py-2.5 text-right font-medium text-xs tabular-nums text-zinc-50">
                      {formatCount(totalSample(e))}
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
