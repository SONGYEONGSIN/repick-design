"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, AlertTriangle } from "lucide-react";
import { STAGES, statsFor, bottleneckStageId, formatCount, formatDays, type PeriodId, type Selection, type StageId } from "./data";
import { cx, FOCUS_RING, BottleneckBadge, Badge } from "./ui";

type SortKey = "sequence" | "inbound" | "dwell" | "pooled";
type ColumnKey = SortKey | "status";

const COLUMNS: { key: ColumnKey; label: string; hideBelowSm?: boolean; sortable: boolean }[] = [
  { key: "sequence", label: "Stage", sortable: true },
  { key: "dwell", label: "Avg dwell", sortable: true },
  { key: "status", label: "Status", sortable: false },
  { key: "inbound", label: "Inbound", sortable: true, hideBelowSm: true },
  { key: "pooled", label: "Pooled now", sortable: true, hideBelowSm: true },
];

export default function StageTable({
  id,
  period,
  selection,
  onPinStage,
}: {
  id: string;
  period: PeriodId;
  selection: Selection;
  onPinStage: (id: StageId) => void;
}) {
  const [sortKey, setSortKey] = useState<SortKey>("sequence");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const bottleneckId = bottleneckStageId(period);

  const rows = useMemo(() => {
    const withStats = STAGES.map((stage, index) => ({ stage, index, stats: statsFor(stage.id, period) }));
    const dir = sortDir === "asc" ? 1 : -1;
    const sorted = [...withStats].sort((a, b) => {
      if (sortKey === "sequence") return (a.index - b.index) * dir;
      if (sortKey === "inbound") return (a.stats.inbound - b.stats.inbound) * dir;
      if (sortKey === "pooled") return (a.stats.pooled - b.stats.pooled) * dir;
      return ((a.stats.dwellDays ?? -1) - (b.stats.dwellDays ?? -1)) * dir;
    });
    return sorted;
  }, [period, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "sequence" ? "asc" : "desc");
    }
  }

  return (
    <div id={id} className="mt-1">
      <table className="w-full min-w-[280px] table-fixed border-collapse text-left sm:min-w-[560px]">
        <caption className="mb-2 text-left text-[11.5px] text-zinc-500">
          Every stage in the return flow with its inbound and outbound volume, current backlog, and average dwell time for {period === "30d" ? "the last 30 days" : "the last 90 days"}. The
          bottleneck stage is marked in the Status column. This table mirrors the process map above and is sortable by column.
        </caption>
        <colgroup>
          <col className="w-[34%] sm:w-[30%]" />
          <col className="w-[22%] sm:w-[16%]" />
          <col className="w-[44%] sm:w-[20%]" />
          <col className="hidden sm:table-column sm:w-[17%]" />
          <col className="hidden sm:table-column sm:w-[17%]" />
        </colgroup>
        <thead>
          <tr className="border-b border-zinc-200">
            {COLUMNS.map((col) => {
              const active = col.sortable && col.key === sortKey;
              const ariaSort = active ? (sortDir === "asc" ? "ascending" : "descending") : "none";
              return (
                <th
                  key={col.key}
                  scope="col"
                  aria-sort={col.sortable ? (ariaSort as "ascending" | "descending" | "none") : undefined}
                  className={cx("py-2 text-[10.5px] font-medium uppercase tracking-wide text-zinc-500", col.hideBelowSm && "hidden sm:table-cell")}
                >
                  {col.sortable ? (
                    <button type="button" onClick={() => toggleSort(col.key as SortKey)} className={cx("inline-flex items-center gap-1", FOCUS_RING)}>
                      {col.label}
                      {active ? sortDir === "asc" ? <ArrowUp aria-hidden className="h-3 w-3" /> : <ArrowDown aria-hidden className="h-3 w-3" /> : <ArrowUpDown aria-hidden className="h-3 w-3 text-zinc-300" />}
                    </button>
                  ) : (
                    col.label
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map(({ stage, stats }) => {
            const isBottleneck = stage.id === bottleneckId;
            const isPinned = selection?.kind === "stage" && selection.id === stage.id;
            const Icon = stage.icon;
            return (
              <tr key={stage.id} className={cx("border-b border-zinc-100 last:border-0", isPinned && "bg-amber-50")}>
                <td className="py-2 pr-2">
                  <button
                    type="button"
                    onClick={() => onPinStage(stage.id)}
                    aria-pressed={isPinned}
                    className={cx("flex w-full items-center gap-2 rounded-md py-0.5 text-left", FOCUS_RING)}
                  >
                    <Icon aria-hidden className={cx("h-3.5 w-3.5 shrink-0", isBottleneck ? "text-amber-700" : "text-zinc-400")} />
                    <span className="min-w-0 flex-1 truncate text-[12.5px] font-medium text-zinc-900">{stage.label}</span>
                  </button>
                </td>
                <td className="py-2 pr-2 text-[12.5px] tabular-nums text-zinc-700">{stats.dwellDays !== null ? formatDays(stats.dwellDays) : "—"}</td>
                <td className="py-2 pr-2">{isBottleneck ? <BottleneckBadge /> : stage.terminal ? <Badge tone="neutral">Terminal</Badge> : <Badge tone="neutral">On pace</Badge>}</td>
                <td className="hidden py-2 pr-2 text-[12.5px] tabular-nums text-zinc-700 sm:table-cell">{formatCount(stats.inbound)}</td>
                <td className="hidden py-2 text-[12.5px] tabular-nums text-zinc-700 sm:table-cell">{stage.terminal ? "—" : formatCount(stats.pooled)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
