"use client";

import { MoveHorizontal } from "lucide-react";
import {
  EDGES,
  SERVICES,
  getDirectDependencies,
  getDirectDependents,
  getBlastRadius,
  type ServiceNode,
} from "./data";
import { NODE_ICONS, STATUS_META } from "./icons";
import { FOCUS_RING } from "./ui";

// Fixed, hand-laid-out design grid. No force-directed physics — every (cx, cy) below is chosen by
// hand (see data.ts) and this file only turns those units into a scalable diagram. The SVG edge
// layer shares this exact coordinate space via `viewBox`, so it scales with the HTML node layer
// without a second, independent source of truth for position.
const CANVAS_W = 1180;
const CANVAS_H = 960;
const MIN_CANVAS_PX = 600;
const NODE_RADIUS = 28;
const EDGE_GAP = 6;

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function pct(value: number, total: number): number {
  return round2((value / total) * 100);
}

const NODES_BY_ID: Record<string, ServiceNode> = Object.fromEntries(
  SERVICES.map((node) => [node.id, node]),
);

interface EdgeLine {
  key: string;
  from: string;
  to: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

const EDGE_LINES: EdgeLine[] = EDGES.map((edge) => {
  const a = NODES_BY_ID[edge.from];
  const b = NODES_BY_ID[edge.to];
  const dx = b.cx - a.cx;
  const dy = b.cy - a.cy;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const trim = NODE_RADIUS + EDGE_GAP;
  return {
    key: `${edge.from}->${edge.to}`,
    from: edge.from,
    to: edge.to,
    x1: round2(a.cx + ux * trim),
    y1: round2(a.cy + uy * trim),
    x2: round2(b.cx - ux * trim),
    y2: round2(b.cy - uy * trim),
  };
});

type RelationState = "selected" | "direct" | "blast" | "dimmed" | "default";

const NODE_STYLES: Record<RelationState, string> = {
  selected: "border-indigo-600 bg-indigo-50 ring-2 ring-indigo-200",
  direct: "border-indigo-400 bg-indigo-50/70",
  blast: "border-dashed border-indigo-300 bg-white",
  dimmed: "border-zinc-200 bg-white opacity-40",
  default: "border-zinc-300 bg-white",
};

const EDGE_STYLES: Record<RelationState, { stroke: string; width: number; dash?: string; opacity: number; marker: string }> = {
  selected: { stroke: "#6366f1", width: 2.5, opacity: 1, marker: "arrow-direct" },
  direct: { stroke: "#6366f1", width: 2.5, opacity: 1, marker: "arrow-direct" },
  blast: { stroke: "#a5b4fc", width: 2, dash: "5 4", opacity: 1, marker: "arrow-blast" },
  dimmed: { stroke: "#e4e4e7", width: 1.5, opacity: 0.5, marker: "arrow-dim" },
  default: { stroke: "#d4d4d8", width: 1.5, opacity: 0.9, marker: "arrow-default" },
};

export function GraphCanvas({
  selectedId,
  onSelect,
  registerRef,
}: {
  selectedId: string | null;
  onSelect: (id: string) => void;
  registerRef: (id: string, el: HTMLButtonElement | null) => void;
}) {
  const directDeps = new Set(selectedId ? getDirectDependencies(selectedId) : []);
  const directDependents = new Set(selectedId ? getDirectDependents(selectedId) : []);
  const blast = new Set(selectedId ? getBlastRadius(selectedId) : []);
  const highlightSet = new Set<string>(
    selectedId ? [selectedId, ...directDeps, ...directDependents, ...blast] : [],
  );

  function nodeState(id: string): RelationState {
    if (!selectedId) return "default";
    if (id === selectedId) return "selected";
    if (directDeps.has(id) || directDependents.has(id)) return "direct";
    if (blast.has(id)) return "blast";
    return "dimmed";
  }

  function edgeState(from: string, to: string): RelationState {
    if (!selectedId) return "default";
    if (from === selectedId || to === selectedId) return "direct";
    if (highlightSet.has(from) && highlightSet.has(to)) return "blast";
    return "dimmed";
  }

  return (
    <div>
      <p className="mb-2 flex items-center gap-1.5 text-xs text-zinc-500 sm:hidden">
        <MoveHorizontal size={13} aria-hidden="true" />
        Scroll horizontally to explore the full map.
      </p>

      <div className="relative w-full overflow-x-auto rounded-lg border border-zinc-100 bg-zinc-50/50">
        <div
          className="relative"
          style={{ width: "100%", minWidth: MIN_CANVAS_PX, aspectRatio: `${CANVAS_W} / ${CANVAS_H}` }}
        >
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              {(["arrow-default", "arrow-direct", "arrow-blast", "arrow-dim"] as const).map((id) => {
                const fill =
                  id === "arrow-direct" ? "#6366f1" : id === "arrow-blast" ? "#a5b4fc" : id === "arrow-dim" ? "#e4e4e7" : "#d4d4d8";
                return (
                  <marker key={id} id={id} markerWidth="7" markerHeight="7" refX="5.5" refY="3.5" orient="auto">
                    <path d="M0,0 L7,3.5 L0,7 Z" fill={fill} />
                  </marker>
                );
              })}
            </defs>
            {EDGE_LINES.map((line) => {
              const state = edgeState(line.from, line.to);
              const style = EDGE_STYLES[state];
              return (
                <line
                  key={line.key}
                  x1={line.x1}
                  y1={line.y1}
                  x2={line.x2}
                  y2={line.y2}
                  stroke={style.stroke}
                  strokeWidth={style.width}
                  strokeDasharray={style.dash}
                  opacity={style.opacity}
                  markerEnd={`url(#${style.marker})`}
                />
              );
            })}
          </svg>

          {SERVICES.map((node) => {
            const Icon = NODE_ICONS[node.icon];
            const meta = STATUS_META[node.status];
            const StatusIcon = meta.icon;
            const state = nodeState(node.id);
            const left = pct(node.cx, CANVAS_W);
            const top = pct(node.cy, CANVAS_H);
            const deps = getDirectDependencies(node.id).length;
            const dependents = getDirectDependents(node.id).length;

            return (
              <div key={node.id}>
                <button
                  type="button"
                  ref={(el) => registerRef(node.id, el)}
                  onClick={() => onSelect(node.id)}
                  aria-pressed={node.id === selectedId}
                  aria-label={`${node.name}, ${meta.label}. ${deps} direct dependencies, ${dependents} direct dependents.`}
                  className={`absolute z-10 flex h-16 w-16 items-center justify-center rounded-full ${FOCUS_RING}`}
                  style={{ left: `${left}%`, top: `${top}%`, transform: "translate(-50%, -50%)" }}
                >
                  <span
                    className={`relative flex h-14 w-14 items-center justify-center rounded-full border-2 text-zinc-600 transition-colors ${NODE_STYLES[state]}`}
                  >
                    <Icon size={18} aria-hidden="true" />
                    <span
                      className={`absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white ${meta.badgeBg} ${meta.text}`}
                      aria-hidden="true"
                    >
                      <StatusIcon size={11} />
                    </span>
                  </span>
                </button>
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute z-10 w-24 text-center"
                  style={{ left: `${left}%`, top: `calc(${top}% + 34px)`, transform: "translateX(-50%)" }}
                >
                  <p className="truncate text-[11px] font-semibold text-zinc-900">{node.name}</p>
                  <p className={`mt-0.5 truncate text-[10px] font-medium ${meta.text}`}>{meta.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-zinc-500">
        <span className="font-medium text-zinc-600">Legend:</span>
        {(["healthy", "degraded", "down"] as const).map((key) => {
          const meta = STATUS_META[key];
          const Icon = meta.icon;
          return (
            <span key={key} className={`inline-flex items-center gap-1 ${meta.text}`}>
              <Icon size={12} aria-hidden="true" />
              {meta.label}
            </span>
          );
        })}
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-0.5 w-5 bg-indigo-500" aria-hidden="true" /> direct dependency / dependent
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-0.5 w-5 border-t-2 border-dashed border-indigo-300" aria-hidden="true" /> blast radius
        </span>
      </div>
    </div>
  );
}
