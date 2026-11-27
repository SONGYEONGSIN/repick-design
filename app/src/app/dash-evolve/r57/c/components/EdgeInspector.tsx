"use client";

import { ArrowRight, MousePointer2 } from "lucide-react";
import type { PeriodData } from "../lib/data";
import { formatCount, formatDuration, formatPercent } from "../lib/data";

/**
 * Ephemeral, non-persistent transition inspector. It reads `hoveredId`, which is set by mouse
 * hover on the chart OR by keyboard focus landing on a transition row in the path-summary table
 * below — never by clicking. It deliberately never touches `pinnedStageId`: pinning a stage and
 * inspecting a transition are two independently-scoped selections, by design (see FlowSection).
 */
export function EdgeInspector({ data, hoveredId }: { data: PeriodData; hoveredId: string | null }) {
  const info = resolveHoveredId(data, hoveredId);

  return (
    <div
      aria-live="polite"
      className="flex min-h-[64px] items-center gap-3 rounded-xl border border-white/10 bg-zinc-950/60 px-4 py-3"
    >
      {info ? (
        <>
          <div className="flex min-w-0 flex-1 items-center gap-2 text-sm font-medium text-zinc-50">
            <span className="truncate">{info.fromName}</span>
            <ArrowRight className="h-3.5 w-3.5 shrink-0 text-zinc-400" aria-hidden="true" />
            <span className="truncate">{info.toName}</span>
          </div>
          <div className="flex shrink-0 items-center gap-4 text-xs font-normal text-zinc-400">
            <span className="whitespace-nowrap tabular-nums">
              <span className="font-mono font-semibold text-zinc-50">{formatCount(info.count)}</span> builds
            </span>
            <span className="whitespace-nowrap tabular-nums">
              <span className="font-mono font-semibold text-zinc-50">{formatDuration(info.avgDurationMin)}</span> avg
            </span>
            <span className="whitespace-nowrap tabular-nums">
              <span className="font-mono font-semibold text-amber-400">{formatPercent(info.failRate)}</span> fail rate
            </span>
          </div>
        </>
      ) : (
        <div className="flex items-center gap-2 text-sm font-normal text-zinc-400">
          <MousePointer2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          Hover a connector above, or focus a transition row in the table below, to inspect its volume and duration.
        </div>
      )}
    </div>
  );
}

function resolveHoveredId(
  data: PeriodData,
  hoveredId: string | null,
): { fromName: string; toName: string; count: number; avgDurationMin: number; failRate: number } | null {
  if (!hoveredId) return null;
  if (hoveredId.endsWith("-failed")) {
    const stageId = hoveredId.slice(0, -"-failed".length);
    const stage = data.stages.find((s) => s.id === stageId);
    if (!stage) return null;
    return {
      fromName: stage.name,
      toName: "Failed Builds",
      count: stage.failed,
      avgDurationMin: stage.avgDurationMin,
      failRate: stage.failRate,
    };
  }
  const edge = data.edges.find((e) => e.id === hoveredId);
  if (!edge) return null;
  return {
    fromName: edge.fromName,
    toName: edge.toName,
    count: edge.count,
    avgDurationMin: edge.avgDurationMin,
    failRate: edge.failRateAtSource,
  };
}
