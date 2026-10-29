"use client";

import { useMemo, useState, type KeyboardEvent } from "react";
import {
  DEPARTMENTS,
  DEPARTMENT_BY_ID,
  FLOWS_BY_PERIOD,
  PERIODS,
  allPairs,
  busiestPair,
  flowValue,
  nodeTotal,
  pairKey,
  type Flow,
  type Period,
} from "./data";
import { formatCount, round2 } from "./format";
import { FOCUS_RING } from "./ui";

const CX = 200;
const CY = 200;
const R_RIBBON = 148;
const R_NODE_ARC = 160;
const NODE_ARC_WIDTH = 9;
const R_LABEL = 182;
const GAP_DEG = 3;

function toPoint(deg: number, r: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: round2(CX + r * Math.cos(rad)), y: round2(CY + r * Math.sin(rad)) };
}

type NodeLayout = {
  id: string;
  name: string;
  color: string;
  start: number;
  end: number;
  arcPath: string;
  labelX: number;
  labelY: number;
  anchor: "start" | "end";
};

type RibbonLayout = {
  key: string;
  aId: string;
  bId: string;
  aToB: number;
  bToA: number;
  combined: number;
  path: string;
};

/** Pure, deterministic layout: every coordinate is a fixed function of the
 *  flows array, rounded to 2 decimals. No randomness, no measurement, so the
 *  server- and client-rendered markup always match. */
function buildChordLayout(flows: Flow[]) {
  const totals = DEPARTMENTS.map((d) => nodeTotal(flows, d.id));
  const sumTotals = totals.reduce((s, v) => s + v, 0) || 1;
  const gapTotal = GAP_DEG * DEPARTMENTS.length;
  const available = 360 - gapTotal;

  let cursor = 0;
  const ranges: { start: number; end: number }[] = [];
  for (let i = 0; i < DEPARTMENTS.length; i++) {
    const span = round2((totals[i] / sumTotals) * available);
    const start = round2(cursor);
    const end = round2(start + span);
    ranges.push({ start, end });
    cursor = round2(end + GAP_DEG);
  }

  // Sub-arcs: within node i's range, one slice per neighbor j, width
  // proportional to the combined (i,j) traffic — these exactly tile node i's
  // range since totals[i] is itself the sum of all its pairwise combineds.
  const subArcs: Record<string, Record<string, { start: number; end: number }>> = {};
  for (let i = 0; i < DEPARTMENTS.length; i++) {
    const idI = DEPARTMENTS[i].id;
    subArcs[idI] = {};
    let sc = ranges[i].start;
    const nodeSpan = ranges[i].end - ranges[i].start;
    for (let j = 0; j < DEPARTMENTS.length; j++) {
      if (i === j) continue;
      const idJ = DEPARTMENTS[j].id;
      const combined = flowValue(flows, idI, idJ) + flowValue(flows, idJ, idI);
      const subSpan = totals[i] === 0 ? 0 : round2((combined / totals[i]) * nodeSpan);
      const start = round2(sc);
      const end = round2(start + subSpan);
      subArcs[idI][idJ] = { start, end };
      sc = end;
    }
  }

  const nodes: NodeLayout[] = DEPARTMENTS.map((dept, i) => {
    const { start, end } = ranges[i];
    const largeArc = end - start > 180 ? 1 : 0;
    const p1 = toPoint(start, R_NODE_ARC);
    const p2 = toPoint(end, R_NODE_ARC);
    const mid = round2((start + end) / 2);
    const label = toPoint(mid, R_LABEL);
    return {
      id: dept.id,
      name: dept.name,
      color: dept.color,
      start,
      end,
      arcPath: `M ${p1.x} ${p1.y} A ${R_NODE_ARC} ${R_NODE_ARC} 0 ${largeArc} 1 ${p2.x} ${p2.y}`,
      labelX: label.x,
      labelY: label.y,
      anchor: label.x >= CX ? "start" : "end",
    };
  });

  const ribbons: RibbonLayout[] = [];
  for (let i = 0; i < DEPARTMENTS.length; i++) {
    for (let j = i + 1; j < DEPARTMENTS.length; j++) {
      const aId = DEPARTMENTS[i].id;
      const bId = DEPARTMENTS[j].id;
      const aArc = subArcs[aId][bId];
      const bArc = subArcs[bId][aId];
      const aToB = flowValue(flows, aId, bId);
      const bToA = flowValue(flows, bId, aId);
      const p1 = toPoint(aArc.start, R_RIBBON);
      const p2 = toPoint(aArc.end, R_RIBBON);
      const p3 = toPoint(bArc.start, R_RIBBON);
      const p4 = toPoint(bArc.end, R_RIBBON);
      const largeArcA = aArc.end - aArc.start > 180 ? 1 : 0;
      const largeArcB = bArc.end - bArc.start > 180 ? 1 : 0;
      ribbons.push({
        key: pairKey(aId, bId),
        aId,
        bId,
        aToB,
        bToA,
        combined: aToB + bToA,
        path: `M ${p1.x} ${p1.y} A ${R_RIBBON} ${R_RIBBON} 0 ${largeArcA} 1 ${p2.x} ${p2.y} Q ${CX} ${CY} ${p3.x} ${p3.y} A ${R_RIBBON} ${R_RIBBON} 0 ${largeArcB} 1 ${p4.x} ${p4.y} Q ${CX} ${CY} ${p1.x} ${p1.y} Z`,
      });
    }
  }

  return { nodes, ribbons };
}

export default function ChordDiagram({ period }: { period: Period }) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const flows = FLOWS_BY_PERIOD[period];
  const periodLabel = (PERIODS.find((p) => p.value === period)?.label ?? period).toLowerCase();
  const layout = useMemo(() => buildChordLayout(flows), [flows]);
  const pairs = useMemo(() => allPairs(flows), [flows]);
  const busiest = useMemo(() => busiestPair(flows), [flows]);
  const maxCombined = useMemo(() => Math.max(...pairs.map((p) => p.combined)), [pairs]);

  function activate(id: string) {
    setActiveId(id);
  }
  function release(id: string) {
    setActiveId((cur) => (cur === id ? null : cur));
  }
  function toggle(id: string) {
    setActiveId((cur) => (cur === id ? null : id));
  }
  function onKeyActivate(id: string) {
    return (e: KeyboardEvent<SVGPathElement>) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        toggle(id);
      } else if (e.key === "Escape" && activeId !== null) {
        setActiveId(null);
      }
    };
  }

  function nodeState(deptId: string): "active" | "dim" | "neutral" {
    if (activeId === null) return "neutral";
    if (activeId === deptId) return "active";
    if (activeId.includes("|")) {
      const [a, b] = activeId.split("|");
      return a === deptId || b === deptId ? "active" : "dim";
    }
    return "dim";
  }

  function ribbonState(ribbon: RibbonLayout): "active" | "dim" | "neutral" {
    if (activeId === null) return "neutral";
    if (activeId === ribbon.key || activeId === ribbon.aId || activeId === ribbon.bId) return "active";
    return "dim";
  }

  // The chart IS its own detail view: `headline` is the one block that both
  // renders the always-visible default readout AND updates in place when a
  // node or ribbon is hovered/focused/clicked — no second component ever
  // consumes `activeId`.
  const headline = useMemo(() => {
    if (activeId && DEPARTMENT_BY_ID[activeId]) {
      const dept = DEPARTMENT_BY_ID[activeId];
      const total = nodeTotal(flows, activeId);
      const rows = DEPARTMENTS.filter((d) => d.id !== activeId)
        .map((n) => {
          const aToB = flowValue(flows, activeId, n.id);
          const bToA = flowValue(flows, n.id, activeId);
          return { neighbor: n, combined: aToB + bToA, aToB, bToA };
        })
        .sort((x, y) => y.combined - x.combined);
      return { kind: "node" as const, big: total, title: dept.name, caption: `total handoffs ${periodLabel}`, rows };
    }
    const pair = activeId ? pairs.find((p) => pairKey(p.a, p.b) === activeId) ?? busiest : busiest;
    const deptA = DEPARTMENT_BY_ID[pair.a];
    const deptB = DEPARTMENT_BY_ID[pair.b];
    return {
      kind: "pair" as const,
      big: pair.combined,
      title: `${deptA.name} ↔ ${deptB.name}`,
      caption: activeId ? `combined handoffs ${periodLabel}` : `combined handoffs ${periodLabel} — the busiest pair`,
      detail: `${formatCount(pair.aToB)} ${deptA.short} → ${deptB.short} · ${formatCount(pair.bToA)} ${deptB.short} → ${deptA.short}`,
    };
  }, [activeId, flows, pairs, busiest, periodLabel]);

  return (
    <div>
      {/* Always-visible headline — the dominant visualization's single most
          important readout, never gated behind interaction. */}
      <div className="min-h-[76px]">
        <p className="tabular-nums text-4xl text-zinc-900 sm:text-[40px]" style={{ fontFamily: "var(--font-display-grotesk)" }}>
          {formatCount(headline.big)}
        </p>
        <p className="mt-0.5 font-medium text-sm text-zinc-700">
          {headline.title} <span className="font-normal text-zinc-500">&middot; {headline.caption}</span>
        </p>
        {headline.kind === "pair" ? (
          <p className="mt-1 font-normal tabular-nums text-xs text-zinc-500">{headline.detail}</p>
        ) : (
          <ul className="mt-1.5 flex flex-col gap-0.5">
            {headline.rows.slice(0, 5).map((r) => (
              <li key={r.neighbor.id} className="flex items-center justify-between gap-2 font-normal text-xs text-zinc-500">
                <span className="truncate">&harr; {r.neighbor.name}</span>
                <span className="shrink-0 tabular-nums text-zinc-700">
                  {formatCount(r.combined)} <span className="text-zinc-500">({formatCount(r.aToB)}&rarr; / {formatCount(r.bToA)}&larr;)</span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="sr-only">
        Interactive chord diagram. Press Tab to move between each department and each connecting pair; every stop announces its own handoff
        totals. The full underlying data also appears as an accessible table further down this page, independent of this chart.
      </p>

      <div className="mx-auto mt-3 w-full max-w-[360px]">
        <svg viewBox="0 0 400 400" className="h-auto w-full" aria-hidden="false">
          <g>
            {layout.ribbons.map((ribbon) => {
              const state = ribbonState(ribbon);
              const magnitude = ribbon.combined / maxCombined;
              const opacity = state === "active" ? 0.88 : state === "dim" ? 0.05 : 0.12 + 0.45 * magnitude;
              const deptA = DEPARTMENT_BY_ID[ribbon.aId];
              const deptB = DEPARTMENT_BY_ID[ribbon.bId];
              return (
                <path
                  key={ribbon.key}
                  d={ribbon.path}
                  className={`cursor-pointer motion-safe:transition-opacity ${state === "active" ? "fill-rose-500" : "fill-zinc-400"} ${FOCUS_RING}`}
                  style={{ opacity }}
                  tabIndex={0}
                  role="button"
                  aria-label={`${deptA.name} and ${deptB.name}: ${formatCount(ribbon.combined)} combined handoffs ${periodLabel}, ${formatCount(ribbon.aToB)} from ${deptA.name} to ${deptB.name} and ${formatCount(ribbon.bToA)} from ${deptB.name} to ${deptA.name}`}
                  onMouseEnter={() => activate(ribbon.key)}
                  onMouseLeave={() => release(ribbon.key)}
                  onFocus={() => activate(ribbon.key)}
                  onBlur={() => release(ribbon.key)}
                  onClick={() => toggle(ribbon.key)}
                  onKeyDown={onKeyActivate(ribbon.key)}
                />
              );
            })}
          </g>
          <g>
            {layout.nodes.map((node) => {
              const state = nodeState(node.id);
              return (
                <path
                  key={node.id}
                  id={`chord-node-${node.id}`}
                  d={node.arcPath}
                  fill="none"
                  stroke={node.color}
                  strokeWidth={NODE_ARC_WIDTH}
                  strokeLinecap="round"
                  style={{ opacity: state === "dim" ? 0.35 : 1 }}
                  className={`cursor-pointer motion-safe:transition-opacity ${FOCUS_RING}`}
                  tabIndex={0}
                  role="button"
                  aria-label={`${node.name}: ${formatCount(nodeTotal(flows, node.id))} total handoffs ${periodLabel}`}
                  onMouseEnter={() => activate(node.id)}
                  onMouseLeave={() => release(node.id)}
                  onFocus={() => activate(node.id)}
                  onBlur={() => release(node.id)}
                  onClick={() => toggle(node.id)}
                  onKeyDown={onKeyActivate(node.id)}
                />
              );
            })}
          </g>
          <g aria-hidden="true">
            {layout.nodes.map((node) => {
              const state = nodeState(node.id);
              const total = nodeTotal(flows, node.id);
              const fillClass = state === "active" ? "fill-rose-700" : state === "dim" ? "fill-zinc-500" : "fill-zinc-700";
              const weightClass = state === "active" ? "font-semibold" : state === "dim" ? "font-normal" : "font-medium";
              return (
                <text
                  key={node.id}
                  x={node.labelX}
                  y={node.labelY}
                  textAnchor={node.anchor}
                  dominantBaseline="central"
                  className={`${fillClass} ${weightClass} select-none text-[11px]`}
                >
                  {node.name}
                  <tspan className="tabular-nums fill-zinc-500"> &middot; {formatCount(total)}</tspan>
                </text>
              );
            })}
          </g>
        </svg>
      </div>

      {/* Legend row — a plain, always-focusable alternative to the SVG arcs
          themselves, driving the exact same in-place highlight. */}
      <ul className="mt-3 grid grid-cols-2 gap-1.5 sm:grid-cols-3">
        {DEPARTMENTS.map((dept) => {
          const state = nodeState(dept.id);
          return (
            <li key={dept.id}>
              <button
                type="button"
                className={`flex w-full items-center gap-1.5 rounded-md px-1.5 py-1 text-left motion-safe:transition-colors ${FOCUS_RING} ${
                  state === "active" ? "bg-rose-50" : "hover:bg-zinc-50"
                }`}
                onMouseEnter={() => activate(dept.id)}
                onMouseLeave={() => release(dept.id)}
                onFocus={() => activate(dept.id)}
                onBlur={() => release(dept.id)}
                onClick={() => toggle(dept.id)}
              >
                <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: dept.color }} />
                <span className={`truncate font-normal text-xs ${state === "active" ? "text-rose-700" : "text-zinc-600"}`}>{dept.short}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
