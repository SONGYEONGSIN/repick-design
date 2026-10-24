"use client";

import { useState } from "react";
import { RotateCcw, Workflow } from "lucide-react";
import {
  SPRINT_LABELS,
  TEAMS,
  TEAM_ORDER,
  weightDomain,
  type HandoffEdge,
  type Period,
  type TeamId,
} from "./data";
import { FOCUS_RING } from "./ui";

/**
 * Selection model for THIS component only (read before touching the state below):
 *
 * `active` is a single piece of `useState`, local to this file. It is never lifted to `page.tsx`
 * and never passed to, or read by, any other component on the route — it is a purely ephemeral
 * hover/focus preview: hovering or Tab-focusing an arc or a team dot sets it, mouse-leave/blur
 * clears it back to `null`. It drives three things inside THIS component only: which arcs dim,
 * which team dot is highlighted, and the inline caption line under the chart. This is the FIRST
 * of this route's two independently-scoped selection mechanisms (see `team-spotlight.tsx` for the
 * second, fully separate one — a click-to-pin state that lives in, and is read only by, that one
 * other file). Nothing in this file reads or writes the spotlight's selection, and nothing outside
 * this file reads or writes `active`.
 */

type ArcActive = { kind: "edge"; edge: HandoffEdge } | { kind: "node"; id: TeamId } | null;

const VIEW_W = 820;
const CHART_MARGIN_X = 66;
const NODE_R = 5;
const LABEL_FONT_SIZE = 11;

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function teamX(index: number): number {
  const step = (VIEW_W - CHART_MARGIN_X * 2) / (TEAM_ORDER.length - 1);
  return round2(CHART_MARGIN_X + index * step);
}

const POSITIONS: Record<TeamId, number> = TEAM_ORDER.reduce((acc, id, i) => {
  acc[id] = teamX(i);
  return acc;
}, {} as Record<TeamId, number>);

/** The chart's vertical geometry is derived from the data's own structural spans, not hand-typed:
 *  the widest span among ALL fifteen edges sets how tall the arc region needs to be, so the
 *  viewBox stays correct even if the handoff list above ever changes. Kept fixed across the
 *  "all handoffs" / "rework only" filter toggle too, so switching filters never resizes the chart. */
function computeGeometry(edges: HandoffEdge[]) {
  const maxSpan = Math.max(...edges.map((e) => Math.abs(POSITIONS[e.to] - POSITIONS[e.from])));
  const maxRadius = maxSpan / 2;
  const lineY = Math.ceil(maxRadius) + 24;
  const viewH = lineY + 46;
  return { lineY, viewH };
}

const { min: WEIGHT_MIN, max: WEIGHT_MAX } = weightDomain();

function strokeWidthFor(weight: number): number {
  if (WEIGHT_MAX === WEIGHT_MIN) return 3;
  return round2(1.5 + ((weight - WEIGHT_MIN) / (WEIGHT_MAX - WEIGHT_MIN)) * (6 - 1.5));
}

function arcPath(fromX: number, toX: number, lineY: number): { d: string; radius: number } {
  const leftX = Math.min(fromX, toX);
  const rightX = Math.max(fromX, toX);
  const radius = round2((rightX - leftX) / 2);
  return { d: `M ${round2(leftX)} ${lineY} A ${radius} ${radius} 0 0 1 ${round2(rightX)} ${lineY}`, radius };
}

export function ArcDiagram({
  edges,
  allEdges,
  period,
}: {
  /** The currently FILTERED edge set this chart draws arcs for (all handoffs, or rework only). */
  edges: HandoffEdge[];
  /** The full, unfiltered edge set — used only to keep the viewBox geometry stable. */
  allEdges: HandoffEdge[];
  period: Period;
}) {
  const [active, setActive] = useState<ArcActive>(null);

  const { lineY, viewH } = computeGeometry(allEdges);
  const sprintLabel = SPRINT_LABELS[period].toLowerCase();

  const headlineEdge = edges.length > 0 ? edges.reduce((leader, e) => (e.weight[period] > leader.weight[period] ? e : leader)) : null;

  const activeEdge: HandoffEdge | null = active !== null && active.kind === "edge" ? active.edge : null;
  const activeNodeId: TeamId | null = active !== null && active.kind === "node" ? active.id : null;

  function isEdgeActive(edge: HandoffEdge): boolean {
    return activeEdge !== null && activeEdge.id === edge.id;
  }
  function isEdgeDimmed(edge: HandoffEdge): boolean {
    if (active === null) return false;
    if (activeEdge !== null) return activeEdge.id !== edge.id;
    return edge.from !== activeNodeId && edge.to !== activeNodeId;
  }
  function isNodeHighlighted(id: TeamId): boolean {
    if (active === null) return false;
    if (activeNodeId !== null) return activeNodeId === id;
    return activeEdge !== null && (activeEdge.from === id || activeEdge.to === id);
  }
  function isNodeDimmed(id: TeamId): boolean {
    if (active === null) return false;
    return !isNodeHighlighted(id);
  }

  let captionText: string;
  if (activeEdge !== null) {
    const e = activeEdge;
    captionText = `${TEAMS[e.from].name} → ${TEAMS[e.to].name}: ${e.weight[period]} items this ${sprintLabel} (${e.type === "forward" ? "forward" : "rework"}).`;
  } else if (activeNodeId !== null) {
    const nodeId = activeNodeId;
    const outgoing = edges.filter((e) => e.from === nodeId).reduce((s, e) => s + e.weight[period], 0);
    const incoming = edges.filter((e) => e.to === nodeId).reduce((s, e) => s + e.weight[period], 0);
    captionText = `${TEAMS[nodeId].name}: ${outgoing} items out, ${incoming} items in this ${sprintLabel}.`;
  } else if (headlineEdge) {
    captionText = `Hover or focus any team or handoff above to inspect it — showing the busiest one by default.`;
  } else {
    captionText = "No handoffs match the current filter.";
  }

  return (
    <div className="min-w-0">
      {headlineEdge ? (
        <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="font-semibold text-sm text-zinc-500">Busiest handoff {sprintLabel}:</span>
          <span className="font-semibold text-xl text-zinc-900 sm:text-2xl">
            {TEAMS[headlineEdge.from].name} <span aria-hidden="true">→</span> {TEAMS[headlineEdge.to].name}
          </span>
          {/* This is the chart's actual primary data text — kept strictly larger, at every
              breakpoint, than every KPI tile's value (text-xl / 20px) above. */}
          <span className="font-semibold text-4xl tabular-nums text-emerald-700 sm:text-5xl">
            {headlineEdge.weight[period]}
          </span>
          <span className="font-normal text-sm text-zinc-500">items</span>
        </p>
      ) : (
        <p className="font-semibold text-sm text-zinc-500">No handoffs match the current filter.</p>
      )}

      <div className="mt-2 flex items-center gap-4">
        <span className="inline-flex items-center gap-1.5 font-medium text-xs text-emerald-700">
          <Workflow className="h-3.5 w-3.5" aria-hidden="true" /> Forward
        </span>
        <span className="inline-flex items-center gap-1.5 font-medium text-xs text-amber-700">
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" /> Rework
        </span>
      </div>

      <svg viewBox={`0 0 ${VIEW_W} ${viewH}`} aria-labelledby="arc-chart-title arc-chart-desc" className="mt-3 h-auto w-full">
        <title id="arc-chart-title">Handoff flow arc diagram across eight engineering teams</title>
        <desc id="arc-chart-desc">
          Teams are plotted left to right in pipeline order. Each arc above the line is one handoff pair; thickness encodes how many
          work items moved this sprint. Exact values for every pair are listed in the sortable table below this chart.
        </desc>

        <line
          x1={CHART_MARGIN_X}
          y1={lineY}
          x2={VIEW_W - CHART_MARGIN_X}
          y2={lineY}
          stroke="currentColor"
          className="text-zinc-200"
          strokeWidth={1}
        />

        {/* Visible arcs — decorative; the hit-targets right below carry the real semantics. */}
        {edges.map((edge) => {
          const { d } = arcPath(POSITIONS[edge.from], POSITIONS[edge.to], lineY);
          const dimmed = isEdgeDimmed(edge);
          const emphasized = isEdgeActive(edge);
          const baseWidth = strokeWidthFor(edge.weight[period]);
          return (
            <path
              key={edge.id}
              d={d}
              fill="none"
              stroke="currentColor"
              aria-hidden="true"
              className={`motion-safe:transition-opacity motion-safe:duration-150 ${edge.type === "forward" ? "text-emerald-600" : "text-amber-600"}`}
              strokeWidth={emphasized ? round2(baseWidth + 1.5) : baseWidth}
              strokeDasharray={edge.type === "rework" ? "6 4" : undefined}
              strokeLinecap="round"
              style={{ opacity: dimmed ? 0.2 : 1 }}
            />
          );
        })}

        {/* Invisible wide hit-targets — this is where keyboard focus and hover actually land. */}
        {edges.map((edge) => {
          const { d } = arcPath(POSITIONS[edge.from], POSITIONS[edge.to], lineY);
          return (
            <path
              key={`hit-${edge.id}`}
              d={d}
              fill="none"
              stroke="transparent"
              strokeWidth={16}
              tabIndex={0}
              role="button"
              aria-label={`Handoff from ${TEAMS[edge.from].name} to ${TEAMS[edge.to].name}, ${edge.weight[period]} items this ${sprintLabel}, ${
                edge.type === "forward" ? "forward" : "rework"
              }`}
              className={FOCUS_RING}
              style={{ pointerEvents: "stroke", cursor: "pointer" }}
              onMouseEnter={() => setActive({ kind: "edge", edge })}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive({ kind: "edge", edge })}
              onBlur={() => setActive(null)}
            />
          );
        })}

        {/* Team dots, label ticks and labels. */}
        {TEAM_ORDER.map((id) => {
          const x = POSITIONS[id];
          const highlighted = isNodeHighlighted(id);
          const dimmed = isNodeDimmed(id);
          return (
            <g key={id}>
              <line x1={x} y1={lineY + NODE_R + 2} x2={x} y2={lineY + 16} stroke="currentColor" className="text-zinc-300" strokeWidth={1} />
              <text
                x={x}
                y={lineY + 30}
                textAnchor="middle"
                className="fill-zinc-600 font-medium"
                style={{ fontSize: LABEL_FONT_SIZE }}
              >
                {TEAMS[id].name}
              </text>
              <circle
                cx={x}
                cy={lineY}
                r={highlighted ? 6.5 : NODE_R}
                fill="currentColor"
                className={`motion-safe:transition-opacity motion-safe:duration-150 cursor-pointer ${FOCUS_RING} ${
                  highlighted ? "text-emerald-700" : "text-zinc-500"
                }`}
                stroke="white"
                strokeWidth={1.25}
                style={{ opacity: dimmed ? 0.4 : 1 }}
                tabIndex={0}
                role="button"
                aria-label={`Team: ${TEAMS[id].name}, ${TEAMS[id].category}`}
                onMouseEnter={() => setActive({ kind: "node", id })}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive({ kind: "node", id })}
                onBlur={() => setActive(null)}
              />
            </g>
          );
        })}
      </svg>

      <p aria-live="polite" className="mt-2 min-h-[20px] rounded-lg bg-zinc-50 px-3 py-2 font-normal text-xs text-zinc-700">
        {captionText}
      </p>
    </div>
  );
}
