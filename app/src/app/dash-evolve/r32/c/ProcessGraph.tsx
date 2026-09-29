"use client";

import { useMemo, useRef, useState } from "react";
import { AlertTriangle } from "lucide-react";
import {
  EDGES,
  STAGES,
  NODE_W,
  NODE_H,
  VIEW_BOX,
  MAJOR_EDGE_IDS,
  bottleneckStageId,
  statsFor,
  formatCount,
  formatPct,
  formatDays,
  highlightForSelection,
  type PeriodId,
  type Selection,
  type StageId,
  type EdgeId,
} from "./data";
import { cx, FOCUS_RING } from "./ui";

interface HoverInfo {
  kind: "stage" | "edge";
  id: string;
  x: number;
  y: number;
  title: string;
  lines: string[];
}

interface ProcessGraphProps {
  period: PeriodId;
  selection: Selection;
  onPinStage: (id: StageId) => void;
}

const MAX_STROKE = 10;
const MIN_STROKE = 2;

export default function ProcessGraph({ period, selection, onPinStage }: ProcessGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  // Hover is a fully local, ephemeral preview: it never writes to `selection`
  // and the styling below explicitly checks `hoveredId !== pinnedId` before
  // drawing the hover-only ring, so a hover on the already-pinned node never
  // fights with (or duplicates) the persistent pin treatment.
  const [hover, setHover] = useState<HoverInfo | null>(null);

  const bottleneckId = useMemo(() => bottleneckStageId(period), [period]);
  const highlight = useMemo(() => highlightForSelection(selection), [selection]);
  const hasSelection = selection !== null;
  const maxVolume = useMemo(() => Math.max(...EDGES.map((e) => e.volume[period])), [period]);

  function strokeFor(volume: number) {
    const ratio = maxVolume > 0 ? volume / maxVolume : 0;
    return Math.round((MIN_STROKE + ratio * (MAX_STROKE - MIN_STROKE)) * 10) / 10;
  }

  function showStageTooltip(id: StageId, target: Element) {
    const container = containerRef.current;
    if (!container) return;
    const cRect = container.getBoundingClientRect();
    const tRect = target.getBoundingClientRect();
    const stats = statsFor(id, period);
    const isBottleneck = id === bottleneckId;
    setHover({
      kind: "stage",
      id,
      x: tRect.left + tRect.width / 2 - cRect.left,
      y: tRect.top - cRect.top,
      title: stats.stage.label,
      lines: [
        `${formatCount(stats.inbound)} cases in · ${formatCount(stats.outbound)} out`,
        stats.dwellDays !== null ? `Avg dwell ${formatDays(stats.dwellDays)}${isBottleneck ? " — bottleneck" : ""}` : "Terminal stage",
        stats.pooled > 0 && !stats.stage.terminal ? `${formatCount(stats.pooled)} cases currently pooled here` : `${formatPct(stats.shareOfTotalPct)} of all cases`,
      ],
    });
  }

  function showEdgeTooltip(id: EdgeId, target: Element) {
    const container = containerRef.current;
    if (!container) return;
    const cRect = container.getBoundingClientRect();
    const tRect = target.getBoundingClientRect();
    const edge = EDGES.find((e) => e.id === id);
    if (!edge) return;
    const total = Math.max(1, EDGES.filter((e) => e.from === edge.from).reduce((s, e) => s + e.volume[period], 0));
    const pctOfSource = (edge.volume[period] / total) * 100;
    setHover({
      kind: "edge",
      id,
      x: tRect.left + tRect.width / 2 - cRect.left,
      y: tRect.top - cRect.top,
      title: edge.label,
      lines: [`${formatCount(edge.volume[period])} cases`, `${formatPct(pctOfSource)} of outflow from this stage`, edge.loop ? "Loops back to an earlier stage" : ""].filter(Boolean),
    });
  }

  function clearHover(id: string) {
    setHover((h) => (h && h.id === id ? null : h));
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="mb-2 flex items-center justify-between gap-2 lg:hidden">
        <p className="flex items-center gap-1.5 text-[11px] text-zinc-500">
          <span aria-hidden>↔</span>
          Scroll horizontally to see the full flow
        </p>
      </div>
      {/* Only this inner strip scrolls, and it never contains the tooltip
          (kept as a sibling below) so the tooltip can never be clipped by
          this container's overflow. It is also the only wide horizontally-
          scrolling element on this page — the filmstrip below wraps
          instead of scrolling, on purpose. */}
      <div className="overflow-x-auto rounded-lg border border-zinc-100 bg-zinc-50/50 lg:overflow-visible lg:border-0 lg:bg-transparent">
        <svg
          viewBox={`0 0 ${VIEW_BOX.width} ${VIEW_BOX.height}`}
          role="group"
          aria-label="Return process map. Use Tab to move through stages and transitions; a table with the same data follows below the graph."
          className="block h-auto w-full min-w-[1360px] lg:min-w-0"
        >
          <defs>
            <marker id="rg-arrow-muted" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 Z" className="fill-zinc-400" />
            </marker>
            <marker id="rg-arrow-accent" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 Z" className="fill-amber-600" />
            </marker>
          </defs>

          {/* Edges */}
          {EDGES.map((edge) => {
            const isHighlighted = highlight.edgeIds.has(edge.id);
            const dimmed = hasSelection && !isHighlighted;
            const isHoverOnly = hover?.kind === "edge" && hover.id === edge.id && !isHighlighted;
            const width = strokeFor(edge.volume[period]) + (isHighlighted ? 1.5 : 0);
            const showLabel = MAJOR_EDGE_IDS.has(edge.id) || isHighlighted || isHoverOnly;
            return (
              <g
                key={edge.id}
                tabIndex={0}
                role="img"
                aria-label={`${edge.label}: ${formatCount(edge.volume[period])} cases in the ${period === "30d" ? "last 30 days" : "last 90 days"}${edge.loop ? ". This transition loops back to an earlier stage." : ""}`}
                className={cx("group cursor-default outline-offset-4", FOCUS_RING)}
                onMouseEnter={(e) => showEdgeTooltip(edge.id, e.currentTarget)}
                onMouseLeave={() => clearHover(edge.id)}
                onFocus={(e) => showEdgeTooltip(edge.id, e.currentTarget)}
                onBlur={() => clearHover(edge.id)}
              >
                <path d={edge.d} className="fill-none" stroke="transparent" strokeWidth={22} />
                <path
                  d={edge.d}
                  fill="none"
                  strokeWidth={width}
                  strokeDasharray={edge.loop ? "9 6" : undefined}
                  markerEnd={isHighlighted ? "url(#rg-arrow-accent)" : "url(#rg-arrow-muted)"}
                  className={cx(
                    "pointer-events-none transition-[stroke,opacity] duration-150 motion-reduce:transition-none",
                    "group-focus-visible:stroke-amber-700",
                    isHighlighted ? "stroke-amber-600" : isHoverOnly ? "stroke-zinc-500" : "stroke-zinc-400",
                    dimmed ? "opacity-30" : "opacity-100",
                  )}
                />
                {showLabel && (
                  <foreignObject x={edge.labelX - 26} y={edge.labelY - 11} width={52} height={22} className="pointer-events-none overflow-visible">
                    <div
                      className={cx(
                        "flex h-[22px] items-center justify-center rounded-full border px-1.5 text-[11px] font-medium tabular-nums shadow-sm",
                        isHighlighted ? "border-amber-300 bg-amber-100 text-zinc-900" : "border-zinc-200 bg-white text-zinc-600",
                      )}
                    >
                      {formatCount(edge.volume[period])}
                    </div>
                  </foreignObject>
                )}
              </g>
            );
          })}

          {/* Nodes */}
          {STAGES.map((stage) => {
            const stats = statsFor(stage.id, period);
            const isBottleneck = stage.id === bottleneckId;
            const isPinned = selection?.kind === "stage" && selection.id === stage.id;
            const isPathMember = selection?.kind === "path" && highlight.nodeIds.has(stage.id);
            const emphasized = isPinned || isPathMember;
            const isHoverOnly = hover?.kind === "stage" && hover.id === stage.id && !emphasized;
            const dimmed = hasSelection && !emphasized;
            const Icon = stage.icon;
            return (
              <foreignObject
                key={stage.id}
                x={stage.cx - NODE_W / 2}
                y={stage.cy - NODE_H / 2}
                width={NODE_W}
                height={NODE_H}
                className="overflow-visible"
              >
                <div className="relative h-full w-full">
                  <button
                    type="button"
                    onClick={() => onPinStage(stage.id)}
                    onMouseEnter={(e) => showStageTooltip(stage.id, e.currentTarget)}
                    onMouseLeave={() => clearHover(stage.id)}
                    onFocus={(e) => showStageTooltip(stage.id, e.currentTarget)}
                    onBlur={() => clearHover(stage.id)}
                    aria-pressed={selection?.kind === "stage" && selection.id === stage.id}
                    aria-label={`${stage.label}. ${formatCount(stats.inbound)} cases in, ${formatCount(stats.outbound)} out.${isBottleneck ? " Flagged as the process bottleneck." : ""} Press to pin its detail.`}
                    className={cx(
                      "flex h-full w-full flex-col justify-center gap-0.5 rounded-lg border-2 bg-white px-2.5 text-left shadow-sm transition-[opacity,border-color,box-shadow] duration-150 motion-reduce:transition-none",
                      FOCUS_RING,
                      dimmed && "opacity-40",
                      emphasized
                        ? "border-amber-500 bg-amber-50 shadow-md shadow-amber-900/5"
                        : isBottleneck
                          ? "border-amber-300 bg-amber-50/60"
                          : "border-zinc-200",
                      isHoverOnly && !isBottleneck && "border-zinc-400",
                    )}
                  >
                    <span className="flex items-center gap-1.5">
                      <Icon aria-hidden className={cx("h-3.5 w-3.5 shrink-0", emphasized || isBottleneck ? "text-amber-700" : "text-zinc-500")} />
                      <span className="min-w-0 flex-1 truncate text-[12.5px] font-semibold text-zinc-900">{stage.short}</span>
                    </span>
                    <span className="flex items-baseline gap-1 text-[11px] text-zinc-500">
                      <span className="font-medium tabular-nums text-zinc-700">{formatCount(stats.inbound)}</span>
                      cases · {stage.terminal ? "closed" : formatDays(stats.dwellDays ?? 0)}
                    </span>
                  </button>
                  {isBottleneck && (
                    <span className="pointer-events-none absolute -top-2.5 right-1 inline-flex items-center gap-1 rounded-full border border-amber-300 bg-amber-100 px-1.5 py-0.5 text-[9.5px] font-medium text-zinc-900 shadow-sm">
                      <AlertTriangle aria-hidden className="h-2.5 w-2.5" />
                      Bottleneck
                    </span>
                  )}
                </div>
              </foreignObject>
            );
          })}
        </svg>
      </div>

      {hover && (
        <div
          role="status"
          aria-live="polite"
          className="pointer-events-none absolute z-10 w-56 -translate-x-1/2 -translate-y-[calc(100%+10px)] rounded-lg border border-zinc-200 bg-zinc-900 px-3 py-2 text-white shadow-lg"
          style={{ left: hover.x, top: hover.y }}
        >
          <p className="text-[11.5px] font-semibold text-white">{hover.title}</p>
          {hover.lines.map((line, i) => (
            <p key={i} className="mt-0.5 text-[11px] text-zinc-300">
              {line}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
