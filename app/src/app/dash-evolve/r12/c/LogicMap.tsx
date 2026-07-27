"use client";

import type { Question } from "./data";
import { round2 } from "./data";
import { TEXT_CAPTION, TEXT_PRIMARY, cx } from "./tokens";

/**
 * Generative logic-map diagram: default question order as a straight chain, with each
 * conditional branch drawn as a labelled arc above or below the chain. Fully deterministic —
 * layout is derived only from `questions.length` and each question's `logic` entries, no
 * Math.random/Date.now. Every branch condition and node label is rendered as real <text>,
 * never a hover-only tooltip.
 */
export default function LogicMap({ questions, selectedId }: { questions: Question[]; selectedId: string | null }) {
  const NODE_W = 116;
  const NODE_H = 52;
  const GAP = 28;
  const MARGIN = 28;
  const CHAIN_Y = 160;
  const TOP_EDGE = CHAIN_Y - NODE_H / 2;
  const BOTTOM_EDGE = CHAIN_Y + NODE_H / 2;
  const VIEW_H = 300;

  const n = questions.length;
  const width = MARGIN * 2 + n * NODE_W + Math.max(0, n - 1) * GAP;

  const centerX = (i: number) => round2(MARGIN + i * (NODE_W + GAP) + NODE_W / 2);
  const leftX = (i: number) => round2(MARGIN + i * (NODE_W + GAP));
  const rightX = (i: number) => round2(leftX(i) + NODE_W);

  const idToIndex = new Map(questions.map((q, i) => [q.id, i]));

  // Default sequential edges, one per adjacent pair.
  const defaultEdges = questions.slice(0, -1).map((q, i) => ({
    key: `default-${q.id}`,
    x1: rightX(i),
    x2: leftX(i + 1),
    y: CHAIN_Y,
  }));

  // Branch arcs, grouped by (sourceIndex, direction) so overlapping arcs from the same node stack cleanly.
  type Branch = { sourceIndex: number; targetIndex: number; label: string; arc: "above" | "below" };
  const branches: Branch[] = [];
  questions.forEach((q, i) => {
    (q.logic ?? []).forEach((b) => {
      const targetIndex = idToIndex.get(b.targetId);
      if (targetIndex === undefined) return;
      branches.push({ sourceIndex: i, targetIndex, label: b.conditionLabel, arc: b.arc ?? "above" });
    });
  });

  const groupKey = (b: Branch) => `${b.sourceIndex}:${b.arc}`;
  const grouped = new Map<string, Branch[]>();
  branches.forEach((b) => {
    const key = groupKey(b);
    const list = grouped.get(key) ?? [];
    list.push(b);
    grouped.set(key, list);
  });
  grouped.forEach((list) => list.sort((a, b) => Math.abs(a.targetIndex - a.sourceIndex) - Math.abs(b.targetIndex - b.sourceIndex)));

  const branchArcs = branches.map((b) => {
    const group = grouped.get(groupKey(b))!;
    const rank = group.indexOf(b);
    const height = 42 + rank * 32;
    const sx = centerX(b.sourceIndex);
    const tx = centerX(b.targetIndex);
    const sy = b.arc === "above" ? TOP_EDGE : BOTTOM_EDGE;
    const ty = sy;
    const curveY = round2(b.arc === "above" ? sy - height : sy + height);
    const cx1 = round2(sx + (tx - sx) * 0.28);
    const cx2 = round2(sx + (tx - sx) * 0.72);
    const midX = round2((sx + tx) / 2);
    const labelY = round2(b.arc === "above" ? curveY - 10 : curveY + 20);
    const path = `M ${sx},${sy} C ${cx1},${curveY} ${cx2},${curveY} ${tx},${ty}`;
    return { key: `${b.sourceIndex}-${b.targetIndex}-${b.label}`, path, midX, labelY, label: b.label };
  });

  return (
    <div className="flex flex-col gap-3">
      <p className={cx("text-xs", TEXT_CAPTION)}>
        {branches.length === 0
          ? "No conditional branches — every respondent moves through questions in order."
          : `${branches.length} conditional branch${branches.length === 1 ? "" : "es"} route respondents past the default order.`}
      </p>
      <div className="w-full">
        <svg
          viewBox={`0 0 ${width} ${VIEW_H}`}
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label="Logic map showing question order and conditional branches"
          className="h-auto w-full"
        >
          <defs>
            <marker id="lm-arrow-default" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 Z" className="fill-zinc-300 dark:fill-white/25" />
            </marker>
            <marker id="lm-arrow-branch" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 Z" className="fill-orange-500 dark:fill-orange-400" />
            </marker>
          </defs>

          {defaultEdges.map((e) => (
            <line key={e.key} x1={e.x1} y1={e.y} x2={e.x2 - 6} y2={e.y} className="stroke-zinc-300 dark:stroke-white/20" strokeWidth={1.5} markerEnd="url(#lm-arrow-default)" />
          ))}

          {branchArcs.map((a) => (
            <g key={a.key}>
              <path d={a.path} fill="none" className="stroke-orange-400 dark:stroke-orange-400/70" strokeWidth={1.5} strokeDasharray="4 3" markerEnd="url(#lm-arrow-branch)" />
              <text x={a.midX} y={a.labelY} textAnchor="middle" className="fill-current text-orange-700 dark:text-orange-300" style={{ fontSize: 10, fontWeight: 600 }}>
                {a.label}
              </text>
            </g>
          ))}

          {questions.map((q, i) => {
            const x = leftX(i);
            const selected = q.id === selectedId;
            const shortLabel = q.label.length > 16 ? `${q.label.slice(0, 15)}…` : q.label;
            return (
              <g key={q.id}>
                <rect
                  x={x}
                  y={TOP_EDGE}
                  width={NODE_W}
                  height={NODE_H}
                  rx={10}
                  className={cx(selected ? "fill-blue-50 dark:fill-blue-500/15" : "fill-white dark:fill-zinc-900", selected ? "stroke-blue-500 dark:stroke-blue-400" : "stroke-zinc-300 dark:stroke-white/15")}
                  strokeWidth={selected ? 2 : 1.25}
                />
                <text x={round2(x + NODE_W / 2)} y={round2(TOP_EDGE + 20)} textAnchor="middle" className={cx("fill-current", selected ? "text-blue-700 dark:text-blue-300" : TEXT_PRIMARY)} style={{ fontSize: 11, fontWeight: 700 }}>
                  {`Q${i + 1}`}
                </text>
                <text x={round2(x + NODE_W / 2)} y={round2(TOP_EDGE + 36)} textAnchor="middle" className={cx("fill-current", TEXT_CAPTION)} style={{ fontSize: 9.5 }}>
                  {shortLabel}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
