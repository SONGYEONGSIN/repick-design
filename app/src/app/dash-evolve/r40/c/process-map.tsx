"use client";

import { useMemo, useState } from "react";
import { AlertTriangle } from "lucide-react";
import {
  EDGE_GEOMETRY,
  EDGE_STATS,
  GRAPH_VIEWBOX,
  NODE_CURRENT,
  NODE_LAYOUT,
  PERIODS,
  bottleneckFor,
  edgeLabel,
  edgeMidpoint,
  edgePath,
  networkAverageWait,
  type PeriodId,
  type SelectedTarget,
} from "./data";

const focusRing =
  "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400";

const numberFormat = new Intl.NumberFormat("en-US");

function sameTarget(a: SelectedTarget | null, b: SelectedTarget | null): boolean {
  if (!a || !b) return a === b;
  return a.kind === b.kind && a.id === b.id;
}

export default function ProcessMap({
  period,
  onPeriodChange,
  selected,
  onSelect,
}: {
  period: PeriodId;
  onPeriodChange: (p: PeriodId) => void;
  selected: SelectedTarget | null;
  onSelect: (t: SelectedTarget | null) => void;
}) {
  const [hovered, setHovered] = useState<SelectedTarget | null>(null);

  const stats = EDGE_STATS[period];
  const statsById = useMemo(() => new Map(stats.map((s) => [s.id, s])), [stats]);
  const bottleneck = bottleneckFor(period);
  const avgWait = networkAverageWait(period);
  const ratio = bottleneck.avgWaitHours / avgWait;
  const bottleneckName = edgeLabel(bottleneck.id);

  const volumes = stats.map((s) => s.volume);
  const minVol = Math.min(...volumes);
  const maxVol = Math.max(...volumes);
  function strokeFor(volume: number): number {
    if (maxVol === minVol) return 3;
    return 2 + ((volume - minVol) / (maxVol - minVol)) * 5;
  }

  function isActive(target: SelectedTarget): boolean {
    return sameTarget(target, selected) || sameTarget(target, hovered);
  }

  function toggleSelect(target: SelectedTarget) {
    onSelect(sameTarget(target, selected) ? null : target);
  }

  function showTooltipFor(target: SelectedTarget) {
    if (sameTarget(target, selected)) return;
    setHovered(target);
  }

  const tooltip = hovered && !sameTarget(hovered, selected) ? hovered : null;
  let tooltipPos = { x: 0, y: 0 };
  let tooltipText = "";
  if (tooltip) {
    if (tooltip.kind === "node") {
      const node = NODE_LAYOUT.find((n) => n.id === tooltip.id)!;
      tooltipPos = { x: node.x + node.w / 2, y: node.y - 10 };
      tooltipText = `${node.label}: ${NODE_CURRENT[tooltip.id]} open now`;
    } else {
      const geo = EDGE_GEOMETRY.find((e) => e.id === tooltip.id)!;
      const mid = edgeMidpoint(geo);
      const s = statsById.get(tooltip.id);
      tooltipPos = { x: mid.x, y: mid.y - 16 };
      tooltipText = s
        ? `${edgeLabel(tooltip.id)}: ${numberFormat.format(s.volume)} transitions, ${s.avgWaitHours}h avg wait`
        : edgeLabel(tooltip.id);
    }
  }

  return (
    <div className="rounded-xl border border-white/10 bg-zinc-900 p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-semibold text-lg text-zinc-50">Incident resolution flow</h2>
          <p className="mt-0.5 font-normal text-sm text-zinc-400">
            Process map of every ticket state transition, {PERIODS.find((p) => p.id === period)?.label.toLowerCase()}.
          </p>
        </div>
        <div role="group" aria-label="Time range" className="flex h-9 shrink-0 rounded-lg border border-white/10 p-0.5">
          {PERIODS.map((p) => (
            <button
              key={p.id}
              type="button"
              aria-pressed={period === p.id}
              onClick={() => onPeriodChange(p.id)}
              className={`h-8 rounded-md px-3 font-medium text-xs motion-safe:transition-colors ${focusRing} ${
                period === p.id ? "bg-cyan-400/15 text-cyan-300" : "text-zinc-400 hover:text-zinc-50"
              }`}
            >
              {p.id}
            </button>
          ))}
        </div>
      </div>

      <div
        role="group"
        aria-label="Bottleneck"
        className="mt-4 flex items-start gap-2.5 rounded-lg border border-red-400/30 bg-red-400/10 px-3 py-2.5"
      >
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" aria-hidden="true" />
        <p className="font-normal text-sm text-red-300">
          <span className="font-semibold text-red-300">Bottleneck: {bottleneckName}.</span>{" "}
          Tickets wait {bottleneck.avgWaitHours.toFixed(1)}h on average before moving on — {ratio.toFixed(1)}&times; the
          network average of {avgWait.toFixed(1)}h.
        </p>
      </div>

      <div className="relative mt-4 overflow-x-auto rounded-lg border border-white/5 bg-zinc-950/40">
        <svg
          role="group"
          aria-label="Incident flow diagram. Nodes show current open count; edges show transition volume for the selected period."
          width={GRAPH_VIEWBOX.width}
          height={GRAPH_VIEWBOX.height}
          viewBox={`0 0 ${GRAPH_VIEWBOX.width} ${GRAPH_VIEWBOX.height}`}
          className="block"
        >
          {EDGE_GEOMETRY.map((edge) => {
            const s = statsById.get(edge.id);
            if (!s) return null;
            const target: SelectedTarget = { kind: "edge", id: edge.id };
            const active = isActive(target);
            const isBottleneck = edge.id === bottleneck.id;
            const stroke = isBottleneck ? "#f87171" : active ? "#22d3ee" : "#52525b";
            const mid = edgeMidpoint(edge);
            const labelX = mid.x + edge.labelDx;
            const labelY = mid.y + edge.labelDy;
            const labelText = numberFormat.format(s.volume);
            const isMiddle = edge.labelAnchor === "middle";
            const labelWidth = isBottleneck ? 58 : 12 + labelText.length * 7;
            const rectX = isMiddle ? labelX - labelWidth / 2 : labelX - 6;
            const textX = isMiddle ? labelX : isBottleneck ? rectX + 19 : rectX + 6;
            return (
              <g key={edge.id}>
                <path
                  d={edgePath(edge)}
                  fill="none"
                  stroke={stroke}
                  strokeWidth={strokeFor(s.volume)}
                  strokeLinecap="round"
                  opacity={active || isBottleneck ? 1 : 0.7}
                />
                <path
                  d={edgePath(edge)}
                  fill="none"
                  stroke="transparent"
                  strokeWidth={16}
                  tabIndex={0}
                  role="button"
                  aria-pressed={sameTarget(target, selected)}
                  aria-label={`Transition ${edgeLabel(edge.id)}. ${numberFormat.format(s.volume)} tickets, average wait ${s.avgWaitHours} hours.${isBottleneck ? " This is the bottleneck." : ""}`}
                  className={`cursor-pointer ${focusRing}`}
                  onMouseEnter={() => showTooltipFor(target)}
                  onMouseLeave={() => setHovered(null)}
                  onFocus={() => showTooltipFor(target)}
                  onBlur={() => setHovered(null)}
                  onClick={() => toggleSelect(target)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      toggleSelect(target);
                    }
                  }}
                />
                <rect
                  x={round(rectX)}
                  y={round(labelY - 9)}
                  width={labelWidth}
                  height={18}
                  rx={9}
                  fill="#09090b"
                  stroke={isBottleneck ? "#f87171" : "rgba(255,255,255,0.1)"}
                  className="pointer-events-none"
                />
                {isBottleneck ? (
                  <AlertTriangle
                    x={round(rectX + 5)}
                    y={round(labelY - 5.5)}
                    width={11}
                    height={11}
                    className="pointer-events-none text-red-400"
                    aria-hidden="true"
                  />
                ) : null}
                <text
                  x={round(textX)}
                  y={round(labelY + 4)}
                  textAnchor={isMiddle ? "middle" : "start"}
                  className={`pointer-events-none select-none font-semibold text-[11px] tabular-nums ${isBottleneck ? "fill-red-300" : "fill-zinc-50"}`}
                >
                  {labelText}
                </text>
              </g>
            );
          })}

          {NODE_LAYOUT.map((node) => {
            const target: SelectedTarget = { kind: "node", id: node.id };
            const active = isActive(target);
            const count = NODE_CURRENT[node.id];
            return (
              <g key={node.id}>
                <rect
                  x={node.x}
                  y={node.y}
                  width={node.w}
                  height={node.h}
                  rx={10}
                  fill={active ? "#0e3a44" : "#18181b"}
                  stroke={active ? "#22d3ee" : "rgba(255,255,255,0.1)"}
                  strokeWidth={active ? 1.5 : 1}
                  tabIndex={0}
                  role="button"
                  aria-pressed={sameTarget(target, selected)}
                  aria-label={`${node.label}: ${count} open now.`}
                  className={`cursor-pointer motion-safe:transition-colors ${focusRing}`}
                  onMouseEnter={() => showTooltipFor(target)}
                  onMouseLeave={() => setHovered(null)}
                  onFocus={() => showTooltipFor(target)}
                  onBlur={() => setHovered(null)}
                  onClick={() => toggleSelect(target)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      toggleSelect(target);
                    }
                  }}
                />
                <text
                  x={round(node.x + 12)}
                  y={round(node.y + 20)}
                  className="pointer-events-none select-none fill-zinc-400 font-medium text-[11px] uppercase tracking-wide"
                >
                  {node.label}
                </text>
                <text
                  x={round(node.x + 12)}
                  y={round(node.y + 46)}
                  className="pointer-events-none select-none fill-zinc-50 font-semibold text-[20px] tabular-nums"
                >
                  {count}
                </text>
                <text
                  x={round(node.x + node.w - 12)}
                  y={round(node.y + 46)}
                  textAnchor="end"
                  className="pointer-events-none select-none fill-zinc-400 font-normal text-[10px]"
                >
                  open
                </text>
              </g>
            );
          })}
        </svg>

        {tooltip ? (
          <div
            className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-md border border-white/10 bg-zinc-900 px-2.5 py-1.5 font-normal text-xs text-zinc-50 shadow-xl motion-safe:transition-opacity"
            style={{ left: tooltipPos.x, top: tooltipPos.y }}
          >
            {tooltipText}
          </div>
        ) : null}
      </div>

      <p className="mt-3 font-normal text-xs text-zinc-400">
        Select any step or transition above — or tab through them — to see its detail in the card below.
      </p>
    </div>
  );
}

function round(v: number): number {
  return Math.round(v * 100) / 100;
}
