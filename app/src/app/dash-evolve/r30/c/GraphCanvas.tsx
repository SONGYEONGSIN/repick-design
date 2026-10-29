"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  NODES,
  EDGES,
  NODE_BY_ID,
  NODE_W,
  NODE_H,
  STATUS_META,
  TIER_ICON,
  DOMAIN_ONCALL,
  computeLayout,
  statusFor,
  formatPercent,
  formatRps,
  formatMs,
  round2,
  type GroupBy,
  type DependencyEdge,
} from "./data";

function clampPct(pct: number): number {
  return Math.min(90, Math.max(10, pct));
}

interface GraphCanvasProps {
  groupBy: GroupBy;
  pinnedNodeId: string | null;
  pinnedEdgeId: string | null;
  onPinNode: (id: string) => void;
  onPinEdge: (id: string) => void;
}

export default function GraphCanvas({ groupBy, pinnedNodeId, pinnedEdgeId, onPinNode, onPinEdge }: GraphCanvasProps) {
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [hoveredEdgeId, setHoveredEdgeId] = useState<string | null>(null);
  const nodeRefs = useRef(new Map<string, SVGGElement>());

  const layout = useMemo(() => computeLayout(groupBy), [groupBy]);
  const { positions, vbW, vbH, groups } = layout;

  const centers = useMemo(() => {
    const map = new Map<string, { cx: number; cy: number }>();
    for (const n of NODES) {
      const p = positions[n.id];
      map.set(n.id, { cx: round2(p.x + NODE_W / 2), cy: round2(p.y + NODE_H / 2) });
    }
    return map;
  }, [positions]);

  const edgeGeo = useMemo(() => {
    return EDGES.map((edge, i) => {
      const a = centers.get(edge.from)!;
      const b = centers.get(edge.to)!;
      const dx = b.cx - a.cx;
      const dy = b.cy - a.cy;
      const len = Math.sqrt(dx * dx + dy * dy) || 1;
      const px = -dy / len;
      const py = dx / len;
      const sign = i % 2 === 0 ? 1 : -1;
      const mag = 16 + (i % 3) * 7;
      const mx = round2((a.cx + b.cx) / 2 + px * mag * sign);
      const my = round2((a.cy + b.cy) / 2 + py * mag * sign);
      const d = `M${a.cx},${a.cy} Q${mx},${my} ${b.cx},${b.cy}`;
      return { edge, d, mx, my };
    });
  }, [centers]);

  const connectedNodeIds = useMemo(() => {
    if (!pinnedNodeId) return new Set<string>();
    const set = new Set<string>();
    for (const e of EDGES) {
      if (e.from === pinnedNodeId) set.add(e.to);
      if (e.to === pinnedNodeId) set.add(e.from);
    }
    return set;
  }, [pinnedNodeId]);

  useEffect(() => {
    if (!pinnedNodeId) return;
    const reduceMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = nodeRefs.current.get(pinnedNodeId);
    el?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "nearest", inline: "center" });
  }, [pinnedNodeId]);

  const hoveredNode = hoveredNodeId ? NODE_BY_ID.get(hoveredNodeId) ?? null : null;
  const hoveredEdge = hoveredEdgeId ? edgeGeo.find((g) => g.edge.id === hoveredEdgeId) ?? null : null;

  const setNodeRef = (id: string) => (el: SVGGElement | null) => {
    if (el) nodeRefs.current.set(id, el);
    else nodeRefs.current.delete(id);
  };

  return (
    <div className="relative">
      <div className="w-full" style={{ aspectRatio: `${vbW} / ${vbH}` }}>
        <svg
          viewBox={`0 0 ${vbW} ${vbH}`}
          width="100%"
          height="100%"
          role="group"
          aria-label="Service dependency graph. Use Tab to move between services and connections; press Enter or Space to pin one."
        >
          <defs>
            {(["healthy", "degraded", "critical"] as const).map((s) => (
              <marker
                key={s}
                id={`arrow-${s}`}
                viewBox="0 0 10 10"
                refX="8.5"
                refY="5"
                markerWidth="7"
                markerHeight="7"
                orient="auto-start-reverse"
              >
                <path d="M0,0 L10,5 L0,10 z" className={STATUS_META[s].edgeStroke.replace("stroke-", "fill-")} />
              </marker>
            ))}
            <marker id="arrow-rose" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" className="fill-rose-500" />
            </marker>
          </defs>

          {/* Column / group headers */}
          {groups.map((g) => (
            <text
              key={g.key}
              x={round2(g.x + NODE_W / 2)}
              y={22}
              textAnchor="middle"
              fill="currentColor"
              className="select-none text-[11px] font-medium uppercase tracking-wider text-zinc-600"
            >
              {g.label}
            </text>
          ))}

          {/* Edges */}
          <g>
            {edgeGeo.map(({ edge, d }) => {
              const isPinned = pinnedEdgeId === edge.id;
              const isHovered = hoveredEdgeId === edge.id && !isPinned;
              const isConnected = !!pinnedNodeId && (edge.from === pinnedNodeId || edge.to === pinnedNodeId);
              const meta = STATUS_META[edge.status];

              let strokeClass = meta.edgeStroke;
              let width = edge.strokeWidth;
              let dash: string | undefined = meta.edgeDash;
              let opacity = 0.8;
              let marker = `url(#arrow-${edge.status})`;

              if (isPinned) {
                strokeClass = "stroke-rose-600";
                width = edge.strokeWidth + 2;
                dash = undefined;
                opacity = 1;
                marker = "url(#arrow-rose)";
              } else if (isHovered) {
                strokeClass = "stroke-rose-500";
                width = edge.strokeWidth + 1.5;
                opacity = 1;
                marker = "url(#arrow-rose)";
              } else if (isConnected) {
                width = edge.strokeWidth + 0.75;
                opacity = 1;
              } else if (pinnedNodeId) {
                opacity = 0.22;
              }

              const label = `${edge.from} calls ${edge.to}, ${meta.label.toLowerCase()}, about ${edge.weightRps} requests per second. Press enter to trace this connection.`;

              return (
                <g
                  key={edge.id}
                  tabIndex={0}
                  role="button"
                  aria-pressed={isPinned}
                  aria-label={label}
                  className="cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500"
                  onClick={() => onPinEdge(edge.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onPinEdge(edge.id);
                    }
                  }}
                  onMouseEnter={() => setHoveredEdgeId(edge.id)}
                  onMouseLeave={() => setHoveredEdgeId((h) => (h === edge.id ? null : h))}
                  onFocus={() => setHoveredEdgeId(edge.id)}
                  onBlur={() => setHoveredEdgeId((h) => (h === edge.id ? null : h))}
                >
                  <path d={d} fill="none" stroke="transparent" strokeWidth={16} />
                  <path
                    d={d}
                    fill="none"
                    className={`${strokeClass} transition-[stroke-width,opacity] motion-reduce:transition-none`}
                    strokeWidth={width}
                    strokeDasharray={dash}
                    strokeLinecap="round"
                    opacity={opacity}
                    markerEnd={marker}
                  />
                </g>
              );
            })}
          </g>

          {/* Nodes */}
          <g>
            {NODES.map((node) => {
              const pos = positions[node.id];
              const status = statusFor(node.errorRatePct);
              const meta = STATUS_META[status];
              const Icon = TIER_ICON[node.tier];
              const isPinned = pinnedNodeId === node.id;
              const isHovered = hoveredNodeId === node.id && !isPinned;
              const isConnected = connectedNodeIds.has(node.id) && !isPinned;

              let fillClass = "fill-white";
              let strokeClass = meta.stroke;
              let strokeWidth = 1.5;
              if (isPinned) {
                fillClass = "fill-rose-50";
                strokeClass = "stroke-rose-600";
                strokeWidth = 3;
              } else if (isHovered) {
                strokeClass = "stroke-rose-400";
                strokeWidth = 2.5;
              } else if (isConnected) {
                strokeClass = "stroke-rose-300";
                strokeWidth = 2;
              }

              // The accessible name must literally contain every text node rendered inside the
              // button (label-content-name-mismatch) — built from the same formatter calls used
              // by the visible <text> elements below, in the same order, so the two can never
              // drift apart.
              const visibleParts = [node.label, ...(isPinned ? ["Pinned"] : []), formatPercent(node.errorRatePct), "error", formatRps(node.rps)];
              const label = `${visibleParts.join(" ")}. ${meta.label} service, on call: ${DOMAIN_ONCALL[node.domain]}. Press Enter to pin.`;

              return (
                <g
                  key={node.id}
                  ref={setNodeRef(node.id)}
                  tabIndex={0}
                  role="button"
                  aria-pressed={isPinned}
                  aria-label={label}
                  className="cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500"
                  onClick={() => onPinNode(node.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onPinNode(node.id);
                    }
                  }}
                  onMouseEnter={() => setHoveredNodeId(node.id)}
                  onMouseLeave={() => setHoveredNodeId((h) => (h === node.id ? null : h))}
                  onFocus={() => setHoveredNodeId(node.id)}
                  onBlur={() => setHoveredNodeId((h) => (h === node.id ? null : h))}
                >
                  <rect
                    x={pos.x}
                    y={pos.y}
                    width={NODE_W}
                    height={NODE_H}
                    rx={10}
                    className={`${fillClass} ${strokeClass} transition-colors motion-reduce:transition-none`}
                    strokeWidth={strokeWidth}
                  />

                  <g transform={`translate(${round2(pos.x + 12)},${round2(pos.y + 12)})`} className="text-zinc-500">
                    <Icon width={14} height={14} aria-hidden="true" />
                  </g>
                  <text
                    x={round2(pos.x + 33)}
                    y={round2(pos.y + 23)}
                    fill="currentColor"
                    className="select-none text-[12.5px] font-medium text-zinc-900"
                  >
                    {node.label}
                  </text>
                  {/* A bare " " text node between each <text> keeps the group's real textContent
                      word-spaced (SVG never renders character data outside a <text>/<tspan>, so
                      this is invisible) — it has to match the aria-label above exactly, token for
                      token, to satisfy label-content-name-mismatch. */}
                  {isPinned && (
                    <>
                      {" "}
                      <text
                        x={round2(pos.x + NODE_W - 10)}
                        y={round2(pos.y + 14)}
                        textAnchor="end"
                        fill="currentColor"
                        className="select-none text-[8.5px] font-semibold uppercase tracking-wider text-rose-700"
                      >
                        Pinned
                      </text>
                    </>
                  )}
                  {" "}
                  <text
                    x={round2(pos.x + 14)}
                    y={round2(pos.y + 45)}
                    fill="currentColor"
                    className={`select-none text-[19px] font-semibold tabular-nums ${meta.text}`}
                  >
                    {formatPercent(node.errorRatePct)}
                  </text>
                  {" "}
                  <text
                    x={round2(pos.x + NODE_W - 10)}
                    y={round2(pos.y + 45)}
                    textAnchor="end"
                    fill="currentColor"
                    className="select-none text-[9px] font-normal uppercase tracking-wider text-zinc-600"
                  >
                    error
                  </text>
                  {" "}
                  <text
                    x={round2(pos.x + 14)}
                    y={round2(pos.y + 58)}
                    fill="currentColor"
                    className="select-none text-[10px] font-normal tabular-nums text-zinc-600"
                  >
                    {formatRps(node.rps)}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      {/* Ephemeral hover/focus tooltip — reverts the instant the pointer leaves or focus moves.
          Positioned by percentage of the fixed viewBox, so it needs no DOM measurement and stays
          correct across breakpoints without a client-only layout effect. */}
      {hoveredNode && (
        <NodeTooltip
          node={hoveredNode}
          leftPct={clampPct((centers.get(hoveredNode.id)!.cx / vbW) * 100)}
          topPct={Math.max(10, (positions[hoveredNode.id].y / vbH) * 100)}
        />
      )}
      {hoveredEdge && (
        <EdgeTooltip
          geo={hoveredEdge}
          leftPct={clampPct((hoveredEdge.mx / vbW) * 100)}
          topPct={Math.max(10, (hoveredEdge.my / vbH) * 100)}
        />
      )}
    </div>
  );
}

function NodeTooltip({
  node,
  leftPct,
  topPct,
}: {
  node: (typeof NODES)[number];
  leftPct: number;
  topPct: number;
}) {
  const status = statusFor(node.errorRatePct);
  const meta = STATUS_META[status];
  return (
    <div
      role="tooltip"
      className="pointer-events-none absolute z-20 w-60 rounded-lg border border-zinc-200 bg-white p-3 text-left shadow-lg shadow-zinc-900/10"
      style={{ left: `${leftPct}%`, top: `calc(${topPct}% - 8px)`, transform: "translate(-50%, -100%)" }}
    >
      <p className="text-xs font-semibold text-zinc-900">{node.fullName}</p>
      <p className={`mt-0.5 text-[11px] font-medium ${meta.text}`}>{meta.label}</p>
      <dl className="mt-2 space-y-1 text-[11px] font-normal text-zinc-600">
        <div className="flex justify-between gap-3">
          <dt>p99 latency</dt>
          <dd className="tabular-nums text-zinc-900">{formatMs(node.p99Ms)}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt>Saturation</dt>
          <dd className="tabular-nums text-zinc-900">{node.saturationPct}%</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt>On-call</dt>
          <dd className="text-zinc-900">{DOMAIN_ONCALL[node.domain]}</dd>
        </div>
      </dl>
      <p className="mt-2 border-t border-zinc-100 pt-2 text-[11px] font-normal text-zinc-600">{node.note}</p>
    </div>
  );
}

function EdgeTooltip({
  geo,
  leftPct,
  topPct,
}: {
  geo: { edge: DependencyEdge; d: string; mx: number; my: number };
  leftPct: number;
  topPct: number;
}) {
  const meta = STATUS_META[geo.edge.status];
  const from = NODE_BY_ID.get(geo.edge.from)!;
  const to = NODE_BY_ID.get(geo.edge.to)!;
  return (
    <div
      role="tooltip"
      className="pointer-events-none absolute z-20 w-56 rounded-lg border border-zinc-200 bg-white p-3 text-left shadow-lg shadow-zinc-900/10"
      style={{ left: `${leftPct}%`, top: `${topPct}%`, transform: "translate(-50%, -100%)" }}
    >
      <p className="text-xs font-semibold tabular-nums text-zinc-900">
        {from.fullName} <span className="font-normal text-zinc-500">&rarr;</span> {to.fullName}
      </p>
      <p className={`mt-0.5 text-[11px] font-medium ${meta.text}`}>{meta.label} connection</p>
      <p className="mt-2 text-[11px] font-normal tabular-nums text-zinc-600">
        ~{geo.edge.weightRps.toLocaleString("en-US")} req/s propagated
      </p>
    </div>
  );
}
