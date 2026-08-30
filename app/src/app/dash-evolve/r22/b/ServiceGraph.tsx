"use client";

import {
  NODES,
  EDGES,
  TIER_X,
  TIER_LABEL,
  GRAPH_VIEWBOX,
  NODE_RADIUS,
  getNode,
  canonicalStatus,
  statusForEncoding,
  worseStatus,
  round2,
  type ServiceStatus,
} from "./data";
import { STATUS_META, ACCENT } from "./tokens";

const ARROW_FILL: Record<ServiceStatus, string> = {
  healthy: "fill-zinc-500",
  degraded: "fill-amber-700",
  critical: "fill-rose-700",
};

interface ServiceGraphProps {
  encoding: "latency" | "error";
  pinnedId: string | null;
  activeId: string | null; // pinnedId if set, else the hovered/focused node
  onHover: (id: string | null) => void;
  onPin: (id: string) => void;
}

export function ServiceGraph({ encoding, pinnedId, activeId, onHover, onPin }: ServiceGraphProps) {
  const { width, height } = GRAPH_VIEWBOX;

  return (
    <div>
      {/* Screen-reader orientation: the SVG below is a supplementary, exploratory view. The
          adjacency table rendered lower on this page (AdjacencyTable) is the required accessible
          fallback per the Network Graph A11y-D entry in the chart catalog and carries every edge
          this graph does. */}
      <p className="sr-only">
        Interactive service dependency graph, {NODES.length} services and {EDGES.length} call edges. Tab through
        nodes and press Enter to inspect one; a full Source, Target and Value table equivalent to this graph
        follows below it on the page.
      </p>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-auto w-full"
        role="group"
        aria-label="Service dependency graph (see adjacency table below for the full listing)"
      >
        <defs>
          {(["healthy", "degraded", "critical"] as ServiceStatus[]).map((s) => (
            <marker key={s} id={`arrow-${s}`} viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" className={ARROW_FILL[s]} />
            </marker>
          ))}
        </defs>

        {TIER_X.map((x, i) => (
          <text key={x} x={x} y={18} textAnchor="middle" className="fill-zinc-500 text-[10px] font-semibold uppercase" style={{ letterSpacing: "0.08em" }}>
            {TIER_LABEL[i]}
          </text>
        ))}

        {/* Edges — drawn once from static EDGES data with a fixed layout, not re-simulated. */}
        <g>
          {EDGES.map((edge) => {
            const src = getNode(edge.source)!;
            const tgt = getNode(edge.target)!;
            const status = worseStatus(canonicalStatus(src), canonicalStatus(tgt));
            const isConnected = activeId != null && (edge.source === activeId || edge.target === activeId);
            const dimmed = activeId != null && !isConnected;
            const meta = STATUS_META[status];
            // Shorten the line at both ends so the arrowhead lands just outside the node circle.
            const dx = tgt.x - src.x;
            const dy = tgt.y - src.y;
            const len = Math.hypot(dx, dy) || 1;
            const pad = NODE_RADIUS + 3;
            const x1 = round2(src.x + (dx / len) * pad);
            const y1 = round2(src.y + (dy / len) * pad);
            const x2 = round2(tgt.x - (dx / len) * (pad + 4));
            const y2 = round2(tgt.y - (dy / len) * (pad + 4));
            return (
              <line
                key={`${edge.source}-${edge.target}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                className={isConnected ? ACCENT.stroke : meta.strokeClass}
                strokeWidth={isConnected ? 2.5 : 1.5}
                strokeDasharray={meta.dash === "0" ? undefined : meta.dash}
                strokeLinecap="round"
                opacity={dimmed ? 0.22 : 1}
                markerEnd={`url(#arrow-${status})`}
              />
            );
          })}
        </g>

        {/* Nodes — every one is a real keyboard target (tabIndex 0, Enter/Space to pin). */}
        <g>
          {NODES.map((node) => {
            const status = statusForEncoding(node, encoding);
            const meta = STATUS_META[status];
            const StatusIcon = meta.icon;
            const isPinned = pinnedId === node.id;
            const isActive = activeId === node.id;
            const dimmed = activeId != null && !isActive;
            const metricLabel = encoding === "latency" ? `${node.latencyMs}ms` : `${node.errorRatePct.toFixed(2)}%`;
            const metricColor = status === "healthy" ? "fill-zinc-500" : status === "degraded" ? "fill-amber-700" : "fill-rose-700";

            return (
              <g
                key={node.id}
                tabIndex={0}
                role="button"
                aria-pressed={isPinned}
                aria-label={`${node.label}: ${meta.label}. ${node.latencyMs}ms p99 latency, ${node.errorRatePct.toFixed(2)}% error rate. Press Enter to inspect.`}
                onMouseEnter={() => onHover(node.id)}
                onMouseLeave={() => onHover(null)}
                onFocus={() => onHover(node.id)}
                onBlur={() => onHover(null)}
                onClick={() => onPin(node.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onPin(node.id);
                  }
                }}
                className="cursor-pointer outline-none"
                opacity={dimmed ? 0.35 : 1}
              >
                {isActive && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={NODE_RADIUS + 5}
                    fill="none"
                    className={ACCENT.stroke}
                    strokeWidth={2.5}
                    strokeDasharray={isPinned ? undefined : "3 3"}
                  />
                )}
                <circle cx={node.x} cy={node.y} r={NODE_RADIUS} className={`${meta.fillClass} ${meta.strokeClass}`} strokeWidth={status === "healthy" ? 1.5 : 2} />

                {status !== "healthy" && (
                  <foreignObject x={round2(node.x + 9)} y={round2(node.y - 24)} width={16} height={16} className="overflow-visible">
                    <div className="flex h-4 w-4 items-center justify-center rounded-full bg-white">
                      <StatusIcon size={12} className={status === "degraded" ? "text-amber-700" : "text-rose-700"} aria-hidden="true" />
                    </div>
                  </foreignObject>
                )}

                <text x={node.x} y={round2(node.y + NODE_RADIUS + 15)} textAnchor="middle" className="fill-zinc-700 font-mono text-[9.5px]">
                  {node.label}
                </text>
                <text x={node.x} y={round2(node.y + NODE_RADIUS + 27)} textAnchor="middle" className={`${metricColor} text-[9.5px] font-semibold`} style={{ fontVariantNumeric: "tabular-nums" }}>
                  {metricLabel}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
