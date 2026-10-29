"use client";

import { useMemo, useState } from "react";
import { flowForPeriod, totalIntake, type FlowLink, type FlowPeriod } from "./data";

const NODE_ORDER = ["Intake", "Triage", "Engineering", "Escalated", "Resolved"] as const;
const NODE_X: Record<string, number> = { Intake: 30, Triage: 190, Engineering: 350, Escalated: 480, Resolved: 610 };
const NODE_WIDTH = 16;
const CANVAS_WIDTH = 640;
const CANVAS_HEIGHT = 240;
const CENTER_Y = 120;
const MAX_TRACK_HEIGHT = 160;

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

type NodeGeom = { id: string; x: number; yTop: number; yBottom: number; value: number };
type LinkGeom = { link: FlowLink; sy0: number; sy1: number; ty0: number; ty1: number; key: string };

function buildGeometry(links: FlowLink[]) {
  const total = totalIntake(links);
  const scale = total > 0 ? MAX_TRACK_HEIGHT / total : 0;

  const nodeValue: Record<string, number> = {};
  for (const node of NODE_ORDER) {
    const inflow = links.filter((l) => l.to === node).reduce((s, l) => s + l.value, 0);
    const outflow = links.filter((l) => l.from === node).reduce((s, l) => s + l.value, 0);
    nodeValue[node] = Math.max(inflow, outflow);
  }

  const nodes: NodeGeom[] = NODE_ORDER.map((id) => {
    const h = round2(nodeValue[id] * scale);
    const yTop = round2(CENTER_Y - h / 2);
    return { id, x: NODE_X[id], yTop, yBottom: round2(yTop + h), value: nodeValue[id] };
  });
  const nodeById = (id: string) => nodes.find((n) => n.id === id)!;

  // Stack outgoing/incoming bands within each node's vertical span, in the links array's own
  // order — deterministic, no sorting by anything that could tie-break differently at runtime.
  const outCursor: Record<string, number> = {};
  const inCursor: Record<string, number> = {};
  const linkGeoms: LinkGeom[] = links.map((l, idx) => {
    const sNode = nodeById(l.from);
    const tNode = nodeById(l.to);
    const sOff = outCursor[l.from] ?? 0;
    const tOff = inCursor[l.to] ?? 0;
    const band = round2(l.value * scale);
    outCursor[l.from] = sOff + band;
    inCursor[l.to] = tOff + band;
    return {
      link: l,
      sy0: round2(sNode.yTop + sOff),
      sy1: round2(sNode.yTop + sOff + band),
      ty0: round2(tNode.yTop + tOff),
      ty1: round2(tNode.yTop + tOff + band),
      key: `${l.from}-${l.to}-${idx}`,
    };
  });

  return { nodes, linkGeoms };
}

export function SankeyFlow({ period }: { period: FlowPeriod }) {
  const links = useMemo(() => flowForPeriod(period), [period]);
  const { nodes, linkGeoms } = useMemo(() => buildGeometry(links), [links]);
  const [highlightKey, setHighlightKey] = useState<string | null>(null);
  const [highlightNode, setHighlightNode] = useState<string | null>(null);

  const highlighted = linkGeoms.find((g) => g.key === highlightKey) ?? null;

  function describeLink(g: LinkGeom) {
    return `${g.link.from} to ${g.link.to}, ${g.link.value} ticket${g.link.value === 1 ? "" : "s"}`;
  }

  return (
    <div>
      <div className="mb-3 flex min-h-10 items-center rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-700">
        {highlighted ? (
          <span>
            <span className="font-medium text-zinc-900">
              {highlighted.link.from} → {highlighted.link.to}
            </span>{" "}
            · <span className="tabular-nums">{highlighted.link.value}</span> tickets
          </span>
        ) : highlightNode ? (
          <span>
            <span className="font-medium text-zinc-900">{highlightNode}</span>{" "}
            · <span className="tabular-nums">{nodes.find((n) => n.id === highlightNode)?.value ?? 0}</span> tickets through this stage
          </span>
        ) : (
          <span className="text-zinc-500">Hover or focus a stage or a flow to see its ticket count.</span>
        )}
      </div>

      <svg
        viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`}
        className="w-full"
        role="img"
        aria-label={`Ticket flow across stages, ${period === "30d" ? "last 30 days" : "last 7 days"}`}
      >
        {linkGeoms.map((g) => {
          const midX = round2((g.link.from === g.link.to ? NODE_X[g.link.from] : (NODE_X[g.link.from] + NODE_X[g.link.to]) / 2));
          const sx = NODE_X[g.link.from] + NODE_WIDTH;
          const tx = NODE_X[g.link.to];
          const active = g.key === highlightKey;
          const d = `M ${sx},${g.sy0} C ${midX},${g.sy0} ${midX},${g.ty0} ${tx},${g.ty0} L ${tx},${g.ty1} C ${midX},${g.ty1} ${midX},${g.sy1} ${sx},${g.sy1} Z`;
          return (
            <path
              key={g.key}
              d={d}
              className={`cursor-pointer transition-opacity motion-reduce:transition-none ${active ? "fill-indigo-400" : "fill-indigo-200"}`}
              fillOpacity={active ? 0.85 : 0.55}
              tabIndex={0}
              role="button"
              aria-label={describeLink(g)}
              onMouseEnter={() => setHighlightKey(g.key)}
              onMouseLeave={() => setHighlightKey(null)}
              onFocus={() => setHighlightKey(g.key)}
              onBlur={() => setHighlightKey(null)}
            />
          );
        })}
        {nodes.map((n) => (
          <g key={n.id}>
            <rect
              x={n.x}
              y={n.yTop}
              width={NODE_WIDTH}
              height={Math.max(n.yBottom - n.yTop, 1)}
              rx={3}
              className={`cursor-pointer transition-colors motion-reduce:transition-none ${highlightNode === n.id ? "fill-indigo-700" : "fill-indigo-600"}`}
              tabIndex={0}
              role="button"
              aria-label={`${n.id} stage, ${n.value} tickets`}
              onMouseEnter={() => setHighlightNode(n.id)}
              onMouseLeave={() => setHighlightNode(null)}
              onFocus={() => setHighlightNode(n.id)}
              onBlur={() => setHighlightNode(null)}
            />
            <text
              x={n.x + NODE_WIDTH / 2}
              y={Math.max(n.yTop - 10, 14)}
              textAnchor="middle"
              className="fill-zinc-700 text-[11px] font-medium"
            >
              {n.id}
            </text>
            <text
              x={n.x + NODE_WIDTH / 2}
              y={n.yBottom + 16}
              textAnchor="middle"
              className="fill-zinc-500 text-[11px] font-medium tabular-nums"
            >
              {n.value}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
