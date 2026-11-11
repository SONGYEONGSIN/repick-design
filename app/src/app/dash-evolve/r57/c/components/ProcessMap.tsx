"use client";

import { AlertTriangle, CheckCircle2 } from "lucide-react";
import type { PeriodData } from "../lib/data";
import { formatCount } from "../lib/data";

/**
 * The process-map / flow-graph chart. Layout is a fixed column-per-stage row (never force-
 * directed) so positions are hand-verifiable: 9 evenly spaced columns — the 8 pipeline stages
 * plus a terminal "Released" node — with every failing edge converging on one "Failed Builds"
 * node beneath the row. Every coordinate below is a plain literal or linear interpolation, never
 * a trig function, so there is nothing that needs rounding for hydration safety.
 *
 * This whole graphic is `aria-hidden`: it is pointer-only decoration layered on top of the path-
 * summary table, which is the real, keyboard-complete data source (per this project's chart
 * catalog, graph-type charts are A11y grade D unless they ship that table fallback — ours does).
 * Hovering a node/edge here is a separate, ephemeral interaction from pinning a stage; pinning
 * only ever happens through the table's buttons.
 */

const VB_W = 1230;
const VB_H = 350;
const NODE_W = 112;
const NODE_H = 66;
const ROW_Y = 118;
const COL_X = [70, 206, 342, 478, 614, 750, 886, 1022, 1158] as const;
const FAIL_NODE = { x: 615, y: 300, w: 240, h: 70 };

// Literal hex values (not Tailwind classes) so the SVG never depends on an undeclared CSS custom
// property — these are the exact hex values behind violet-400 / amber-400 / zinc-900/800/50.
const COLOR = {
  edgePass: "#a78bfa",
  edgeFail: "#fbbf24",
  nodeFill: "#18181b",
  nodeFillStrong: "#27272a",
  nodeStroke: "rgba(255,255,255,0.16)",
  textStrong: "#fafafa",
  violet400: "#a78bfa",
  amber400: "#fbbf24",
};

function laneStyle(ratio: number) {
  // ratio in [0,1] -> stroke width 2..14, opacity 0.3..0.85
  const width = 2 + Math.max(0, Math.min(1, ratio)) * 12;
  const opacity = 0.3 + Math.max(0, Math.min(1, ratio)) * 0.55;
  return { width, opacity };
}

export function ProcessMap({
  data,
  pinnedStageId,
  onPinStage,
  hoveredId,
  onHover,
}: {
  data: PeriodData;
  pinnedStageId: string | null;
  onPinStage: (id: string) => void;
  hoveredId: string | null;
  onHover: (id: string | null) => void;
}) {
  const stages = data.stages;
  const maxForward = Math.max(...stages.map((s) => s.passed));
  const maxFail = Math.max(...stages.map((s) => s.failed));
  const topBottleneckId = data.bottlenecks[0]?.id;

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        className="w-full"
        role="presentation"
        aria-hidden="true"
        style={{ maxHeight: 420 }}
      >
        {/* forward edges: stage i -> stage i+1, last one -> Released node */}
        {stages.map((stage, i) => {
          const from = COL_X[i];
          const to = COL_X[i + 1];
          const ratio = stage.passed / maxForward;
          const { width, opacity } = laneStyle(ratio);
          const toNextId =
            i === stages.length - 1 ? `${stage.id}-released` : `${stage.id}-${stages[i + 1].id}`;
          const isHovered = hoveredId === toNextId;
          return (
            <line
              key={`fwd-${stage.id}`}
              x1={from + NODE_W / 2}
              y1={ROW_Y}
              x2={to - NODE_W / 2}
              y2={ROW_Y}
              stroke={COLOR.edgePass}
              strokeWidth={isHovered ? width + 3 : width}
              strokeOpacity={isHovered ? Math.min(1, opacity + 0.25) : opacity}
              strokeLinecap="round"
              onMouseEnter={() => onHover(toNextId)}
              onMouseLeave={() => onHover(null)}
              style={{ cursor: "default" }}
            />
          );
        })}

        {/* fail edges: every real stage -> the single Failed Builds node */}
        {stages.map((stage, i) => {
          const ratio = stage.failed / maxFail;
          const { width, opacity } = laneStyle(ratio * 0.9);
          const failId = `${stage.id}-failed`;
          const isHovered = hoveredId === failId;
          const startX = COL_X[i];
          const startY = ROW_Y + NODE_H / 2;
          const endX = FAIL_NODE.x;
          const endY = FAIL_NODE.y - FAIL_NODE.h / 2;
          const c1x = startX;
          const c1y = startY + 70;
          const c2x = startX + (endX - startX) * 0.5;
          const c2y = endY - 40;
          return (
            <path
              key={`fail-${stage.id}`}
              d={`M ${startX} ${startY} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${endX} ${endY}`}
              fill="none"
              stroke={COLOR.edgeFail}
              strokeWidth={isHovered ? width + 2.5 : width}
              strokeOpacity={isHovered ? Math.min(1, opacity + 0.3) : opacity}
              strokeLinecap="round"
              onMouseEnter={() => onHover(failId)}
              onMouseLeave={() => onHover(null)}
              style={{ cursor: "default" }}
            />
          );
        })}

        {/* stage nodes */}
        {stages.map((stage, i) => {
          const x = COL_X[i];
          const isTop = stage.id === topBottleneckId;
          const isPinned = stage.id === pinnedStageId;
          return (
            <g
              key={stage.id}
              onClick={() => onPinStage(stage.id)}
              style={{ cursor: "pointer" }}
            >
              <rect
                x={x - NODE_W / 2}
                y={ROW_Y - NODE_H / 2}
                width={NODE_W}
                height={NODE_H}
                rx={12}
                fill={COLOR.nodeFill}
                stroke={isPinned ? COLOR.violet400 : isTop ? COLOR.amber400 : COLOR.nodeStroke}
                strokeWidth={isPinned || isTop ? 1.75 : 1}
              />
              <text
                x={x}
                y={ROW_Y - 16}
                textAnchor="middle"
                fontSize="10.5"
                fontWeight={600}
                fill={COLOR.textStrong}
                style={{ fontFamily: "var(--font-sans)" }}
              >
                {stage.name}
              </text>
              <text
                x={x}
                y={ROW_Y + 4}
                textAnchor="middle"
                fontSize="15"
                fontWeight={600}
                fill={COLOR.textStrong}
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {formatCount(stage.passed)}
              </text>
              <text
                x={x}
                y={ROW_Y + 21}
                textAnchor="middle"
                fontSize="10.5"
                fontWeight={500}
                fill={COLOR.amber400}
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {formatCount(stage.failed)} failed
              </text>
            </g>
          );
        })}

        {/* Released terminal node */}
        <g>
          <rect
            x={COL_X[8] - NODE_W / 2}
            y={ROW_Y - NODE_H / 2}
            width={NODE_W}
            height={NODE_H}
            rx={12}
            fill={COLOR.nodeFill}
            stroke={COLOR.violet400}
            strokeWidth={1.5}
            strokeDasharray="0"
          />
          <text
            x={COL_X[8]}
            y={ROW_Y - 16}
            textAnchor="middle"
            fontSize="12"
            fontWeight={600}
            fill={COLOR.textStrong}
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Released
          </text>
          <text
            x={COL_X[8]}
            y={ROW_Y + 6}
            textAnchor="middle"
            fontSize="16"
            fontWeight={600}
            fill={COLOR.violet400}
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {formatCount(data.releasedRuns)}
          </text>
        </g>

        {/* Failed Builds aggregate node */}
        <g>
          <rect
            x={FAIL_NODE.x - FAIL_NODE.w / 2}
            y={FAIL_NODE.y - FAIL_NODE.h / 2}
            width={FAIL_NODE.w}
            height={FAIL_NODE.h}
            rx={14}
            fill={COLOR.nodeFillStrong}
            stroke={COLOR.amber400}
            strokeWidth={1.25}
          />
          <text
            x={FAIL_NODE.x}
            y={FAIL_NODE.y - 10}
            textAnchor="middle"
            fontSize="12.5"
            fontWeight={600}
            fill={COLOR.textStrong}
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Failed Builds (all stages)
          </text>
          <text
            x={FAIL_NODE.x}
            y={FAIL_NODE.y + 14}
            textAnchor="middle"
            fontSize="17"
            fontWeight={600}
            fill={COLOR.amber400}
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {formatCount(data.totalRuns - data.releasedRuns)}
          </text>
        </g>
      </svg>

      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/10 pt-4">
        <LegendSwatch colorClass="bg-violet-400/70" label="Builds advancing — line weight = volume" />
        <LegendSwatch colorClass="bg-amber-400/70" label="Builds dropping out — line weight = volume" />
        <span className="flex items-center gap-1.5 text-xs font-normal text-zinc-400">
          <AlertTriangle className="h-3.5 w-3.5 text-amber-400" aria-hidden="true" />
          Amber outline marks the top bottleneck stage
        </span>
        <span className="flex items-center gap-1.5 text-xs font-normal text-zinc-400">
          <CheckCircle2 className="h-3.5 w-3.5 text-violet-400" aria-hidden="true" />
          Violet outline marks a pinned stage
        </span>
      </div>
    </div>
  );
}

function LegendSwatch({ colorClass, label }: { colorClass: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5 text-xs font-normal text-zinc-400">
      <span className={`h-1.5 w-5 shrink-0 rounded-full ${colorClass}`} aria-hidden="true" />
      {label}
    </span>
  );
}
