"use client";

import { useMemo, useState } from "react";
import { ArrowRight, ArrowUpDown, ArrowUp, ArrowDown, Pin, Trophy } from "lucide-react";
import type { PeriodData, TransitionEdge } from "../lib/data";
import { formatCount, formatDuration, formatMultiple, formatPercent } from "../lib/data";
import { FOCUS_RING_CLASS } from "./ui";

type SortKey = "order" | "count" | "duration" | "failed";
type SortDir = "asc" | "desc";

const COLUMNS: { key: SortKey; label: string; width: string }[] = [
  { key: "order", label: "Transition", width: "36%" },
  { key: "count", label: "Builds Advanced", width: "20%" },
  { key: "duration", label: "Avg Duration", width: "22%" },
  { key: "failed", label: "Failed at Source", width: "22%" },
];

function sortValue(edge: TransitionEdge, key: SortKey, index: number): number {
  switch (key) {
    case "count":
      return edge.count;
    case "duration":
      return edge.avgDurationMin;
    case "failed":
      return edge.failedAtSource;
    default:
      return index;
  }
}

/**
 * The required accessible fallback for the process map: a path-summary table (stage -> stage,
 * with count/avg-duration columns), a "top 3 bottlenecks" annotation, sortable columns, and the
 * ONLY route by which a stage can be pinned from the keyboard. Hovering or focusing a row's pin
 * button also feeds the separate, ephemeral edge inspector above — that is a read-only preview
 * and never itself pins anything.
 */
export function PathTable({
  data,
  pinnedStageId,
  onPinStage,
  onHoverEdge,
}: {
  data: PeriodData;
  pinnedStageId: string | null;
  onPinStage: (id: string) => void;
  onHoverEdge: (id: string | null) => void;
}) {
  const [sortKey, setSortKey] = useState<SortKey>("order");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const rows = useMemo(() => {
    const indexed = data.edges.map((edge, index) => ({ edge, index }));
    const dir = sortDir === "asc" ? 1 : -1;
    indexed.sort((a, b) => (sortValue(a.edge, sortKey, a.index) - sortValue(b.edge, sortKey, b.index)) * dir);
    return indexed.map((r) => r.edge);
  }, [data.edges, sortKey, sortDir]);

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir(key === "order" ? "asc" : "desc");
    }
  }

  return (
    <div>
      <div className="mb-4 rounded-xl border border-violet-400/20 bg-violet-400/5 p-4">
        <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-zinc-50">
          <Trophy className="h-4 w-4 text-amber-400" aria-hidden="true" />
          Top 3 bottlenecks — {data.label}
        </div>
        <ol className="grid gap-2 sm:grid-cols-3">
          {data.bottlenecks.map((stage, i) => (
            <li
              key={stage.id}
              className="flex min-w-0 flex-col gap-0.5 rounded-lg border border-white/10 bg-zinc-950/50 px-3 py-2"
            >
              <span className="text-xs font-normal text-zinc-400">
                #{i + 1} by builds lost &times; time held
              </span>
              <span className="truncate text-sm font-semibold text-zinc-50">{stage.name}</span>
              <span className="whitespace-nowrap text-xs font-normal text-zinc-400">
                <span className="font-mono tabular-nums text-amber-400">{formatCount(stage.failed)}</span> failed
                {" · "}
                <span className="font-mono tabular-nums">{formatDuration(stage.avgDurationMin)}</span> avg
                {stage.overSla && (
                  <>
                    {" · "}
                    <span className="font-mono tabular-nums text-amber-400">{formatMultiple(stage.slaMultiple)}</span>{" "}
                    over SLA
                  </>
                )}
              </span>
            </li>
          ))}
        </ol>
      </div>

      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table
          className="w-full table-fixed border-collapse max-lg:min-w-[560px]"
          aria-label={`Pipeline stage transitions, ${data.label}`}
        >
          <colgroup>
            {COLUMNS.map((c) => (
              <col key={c.key} style={{ width: c.width }} />
            ))}
          </colgroup>
          <thead>
            <tr className="border-b border-white/10 bg-zinc-950/40">
              {COLUMNS.map((col) => {
                const active = sortKey === col.key;
                const ariaSort: "ascending" | "descending" | "none" = active
                  ? sortDir === "asc"
                    ? "ascending"
                    : "descending"
                  : "none";
                return (
                  <th
                    key={col.key}
                    scope="col"
                    aria-sort={ariaSort}
                    className={col.key === "order" ? "px-3 py-2.5 text-left" : "px-3 py-2.5 text-right"}
                  >
                    <button
                      type="button"
                      onClick={() => handleSort(col.key)}
                      className={`${FOCUS_RING_CLASS} inline-flex min-h-[24px] items-center gap-1 rounded px-0.5 py-1 text-[11px] font-medium uppercase tracking-[0.08em] text-zinc-400 hover:text-zinc-50 ${
                        col.key === "order" ? "" : "flex-row-reverse"
                      }`}
                    >
                      {col.label}
                      {active ? (
                        sortDir === "asc" ? (
                          <ArrowUp className="h-3 w-3" aria-hidden="true" />
                        ) : (
                          <ArrowDown className="h-3 w-3" aria-hidden="true" />
                        )
                      ) : (
                        <ArrowUpDown className="h-3 w-3 opacity-50" aria-hidden="true" />
                      )}
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {rows.map((edge) => {
              const fromPinned = edge.fromId === pinnedStageId;
              const toPinned = edge.toId !== null && edge.toId === pinnedStageId;
              return (
                <tr key={edge.id} className="border-b border-white/5 last:border-0">
                  <td className="px-3 py-2.5 align-top">
                    <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
                      <PinButton
                        label={edge.fromName}
                        pinned={fromPinned}
                        onClick={() => onPinStage(edge.fromId)}
                        onHover={() => onHoverEdge(edge.id)}
                        onLeave={() => onHoverEdge(null)}
                      />
                      <ArrowRight className="h-3.5 w-3.5 shrink-0 text-zinc-400" aria-hidden="true" />
                      {edge.isTerminal ? (
                        <span className="rounded-md border border-violet-400/20 bg-violet-400/10 px-2 py-1 text-sm font-medium text-violet-400">
                          {edge.toName}
                        </span>
                      ) : (
                        <PinButton
                          label={edge.toName}
                          pinned={toPinned}
                          onClick={() => onPinStage(edge.toId as string)}
                          onHover={() => onHoverEdge(edge.id)}
                          onLeave={() => onHoverEdge(null)}
                        />
                      )}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-2.5 text-right align-top font-mono text-sm font-normal tabular-nums text-zinc-50">
                    {formatCount(edge.count)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2.5 text-right align-top font-mono text-sm font-normal tabular-nums text-zinc-50">
                    {formatDuration(edge.avgDurationMin)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2.5 text-right align-top font-mono text-sm font-normal tabular-nums text-amber-400">
                    {formatCount(edge.failedAtSource)}{" "}
                    <span className="text-zinc-400">({formatPercent(edge.failRateAtSource, 1)})</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PinButton({
  label,
  pinned,
  onClick,
  onHover,
  onLeave,
}: {
  label: string;
  pinned: boolean;
  onClick: () => void;
  onHover: () => void;
  onLeave: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={pinned}
      onClick={onClick}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onFocus={onHover}
      onBlur={onLeave}
      className={`${FOCUS_RING_CLASS} inline-flex items-center gap-1 rounded-md border px-2 py-1 text-sm font-medium transition-colors ${
        pinned
          ? "border-violet-400/40 bg-violet-400/15 text-violet-400"
          : "border-white/10 bg-white/5 text-zinc-50 hover:border-violet-400/30 hover:text-violet-400"
      }`}
    >
      {pinned && <Pin className="h-3 w-3 shrink-0" aria-hidden="true" />}
      {label}
    </button>
  );
}
