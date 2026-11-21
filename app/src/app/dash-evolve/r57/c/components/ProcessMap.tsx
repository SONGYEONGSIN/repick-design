"use client";

import { AlertTriangle, CheckCircle2 } from "lucide-react";
import type { PeriodData } from "../lib/data";
import { formatCount } from "../lib/data";

/**
 * The process-map / flow-graph chart. Two fixed, hand-verifiable layouts share one dataset and
 * one set of interaction handlers — a wide horizontal row of columns for `lg:` and up, where the
 * chart can occupy the dominant width of the page, and a tall vertical column below that, because
 * squeezing the 1230-wide horizontal layout down to a 390px card would scale every label down
 * with it until it is unreadable. Only one is ever visible at a time (plain `hidden`/`lg:hidden`),
 * so there is never a double hit-test surface. Neither uses a trig function anywhere, so there is
 * nothing that needs rounding for hydration safety, and nothing here is force-directed.
 *
 * This whole graphic is `aria-hidden`: it is pointer-only decoration layered on top of the path-
 * summary table, which is the real, keyboard-complete data source (per this project's chart
 * catalog, graph-type charts are A11y grade D unless they ship that table fallback — ours does).
 * Hovering a node/edge here is a separate, ephemeral interaction from pinning a stage; pinning
 * only ever happens through the table's buttons.
 */

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

function laneStyle(ratio: number, maxWidth: number) {
  const width = 2 + Math.max(0, Math.min(1, ratio)) * maxWidth;
  const opacity = 0.3 + Math.max(0, Math.min(1, ratio)) * 0.55;
  return { width, opacity };
}

interface MapProps {
  data: PeriodData;
  pinnedStageId: string | null;
  onPinStage: (id: string) => void;
  hoveredId: string | null;
  onHover: (id: string | null) => void;
}

export function ProcessMap(props: MapProps) {
  return (
    <div className="w-full">
      <div className="hidden lg:block">
        <HorizontalMap {...props} />
      </div>
      <div className="lg:hidden">
        <VerticalMap {...props} />
      </div>

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

// ---------------------------------------------------------------------------
// Horizontal layout — lg and up. 9 evenly spaced columns (8 stages + Released),
// with every failing edge curving down into one "Failed Builds" node beneath the row.
// ---------------------------------------------------------------------------

const H_VB_W = 1230;
const H_VB_H = 350;
const H_NODE_W = 112;
const H_NODE_H = 66;
const H_ROW_Y = 118;
const H_COL_X = [70, 206, 342, 478, 614, 750, 886, 1022, 1158] as const;
const H_FAIL_NODE = { x: 615, y: 300, w: 240, h: 70 };

function HorizontalMap({ data, pinnedStageId, onPinStage, hoveredId, onHover }: MapProps) {
  const stages = data.stages;
  const maxForward = Math.max(...stages.map((s) => s.passed));
  const maxFail = Math.max(...stages.map((s) => s.failed));
  const topBottleneckId = data.bottlenecks[0]?.id;

  return (
    <svg
      viewBox={`0 0 ${H_VB_W} ${H_VB_H}`}
      className="w-full"
      role="presentation"
      aria-hidden="true"
      style={{ maxHeight: 420 }}
    >
      {stages.map((stage, i) => {
        const from = H_COL_X[i];
        const to = H_COL_X[i + 1];
        const ratio = stage.passed / maxForward;
        const { width, opacity } = laneStyle(ratio, 12);
        const toNextId = i === stages.length - 1 ? `${stage.id}-released` : `${stage.id}-${stages[i + 1].id}`;
        const isHovered = hoveredId === toNextId;
        return (
          <line
            key={`fwd-${stage.id}`}
            x1={from + H_NODE_W / 2}
            y1={H_ROW_Y}
            x2={to - H_NODE_W / 2}
            y2={H_ROW_Y}
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

      {stages.map((stage, i) => {
        const ratio = stage.failed / maxFail;
        const { width, opacity } = laneStyle(ratio * 0.9, 12);
        const failId = `${stage.id}-failed`;
        const isHovered = hoveredId === failId;
        const startX = H_COL_X[i];
        const startY = H_ROW_Y + H_NODE_H / 2;
        const endX = H_FAIL_NODE.x;
        const endY = H_FAIL_NODE.y - H_FAIL_NODE.h / 2;
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

      {stages.map((stage, i) => {
        const x = H_COL_X[i];
        const isTop = stage.id === topBottleneckId;
        const isPinned = stage.id === pinnedStageId;
        return (
          <g key={stage.id} onClick={() => onPinStage(stage.id)} style={{ cursor: "pointer" }}>
            <rect
              x={x - H_NODE_W / 2}
              y={H_ROW_Y - H_NODE_H / 2}
              width={H_NODE_W}
              height={H_NODE_H}
              rx={12}
              fill={COLOR.nodeFill}
              stroke={isPinned ? COLOR.violet400 : isTop ? COLOR.amber400 : COLOR.nodeStroke}
              strokeWidth={isPinned || isTop ? 1.75 : 1}
            />
            <text
              x={x}
              y={H_ROW_Y - 16}
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
              y={H_ROW_Y + 4}
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
              y={H_ROW_Y + 21}
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

      <g>
        <rect
          x={H_COL_X[8] - H_NODE_W / 2}
          y={H_ROW_Y - H_NODE_H / 2}
          width={H_NODE_W}
          height={H_NODE_H}
          rx={12}
          fill={COLOR.nodeFill}
          stroke={COLOR.violet400}
          strokeWidth={1.5}
        />
        <text
          x={H_COL_X[8]}
          y={H_ROW_Y - 16}
          textAnchor="middle"
          fontSize="12"
          fontWeight={600}
          fill={COLOR.textStrong}
          style={{ fontFamily: "var(--font-sans)" }}
        >
          Released
        </text>
        <text
          x={H_COL_X[8]}
          y={H_ROW_Y + 6}
          textAnchor="middle"
          fontSize="16"
          fontWeight={600}
          fill={COLOR.violet400}
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {formatCount(data.releasedRuns)}
        </text>
      </g>

      <g>
        <rect
          x={H_FAIL_NODE.x - H_FAIL_NODE.w / 2}
          y={H_FAIL_NODE.y - H_FAIL_NODE.h / 2}
          width={H_FAIL_NODE.w}
          height={H_FAIL_NODE.h}
          rx={14}
          fill={COLOR.nodeFillStrong}
          stroke={COLOR.amber400}
          strokeWidth={1.25}
        />
        <text
          x={H_FAIL_NODE.x}
          y={H_FAIL_NODE.y - 10}
          textAnchor="middle"
          fontSize="12.5"
          fontWeight={600}
          fill={COLOR.textStrong}
          style={{ fontFamily: "var(--font-sans)" }}
        >
          Failed Builds (all stages)
        </text>
        <text
          x={H_FAIL_NODE.x}
          y={H_FAIL_NODE.y + 14}
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
  );
}

// ---------------------------------------------------------------------------
// Vertical layout — below lg. One row per stage, top to bottom, with the fail edges fanning
// right into a single "Failed Builds" node. Kept at a fixed viewBox width (680) that is close to
// an actual mobile card's content width, so scaling it to fit never shrinks the labels past
// legibility the way the 1230-wide horizontal layout would.
// ---------------------------------------------------------------------------

const V_VB_W = 680;
const V_VB_H = 700;
const V_NODE_W = 440;
const V_NODE_H = 52;
const V_COL_X = 240;
const V_ROW_Y = [46, 122, 198, 274, 350, 426, 502, 578, 654] as const;
const V_FAIL_NODE = { x: 560, y: 312, w: 170, h: 64 };

function VerticalMap({ data, pinnedStageId, onPinStage, hoveredId, onHover }: MapProps) {
  const stages = data.stages;
  const maxForward = Math.max(...stages.map((s) => s.passed));
  const maxFail = Math.max(...stages.map((s) => s.failed));
  const topBottleneckId = data.bottlenecks[0]?.id;

  return (
    <svg
      viewBox={`0 0 ${V_VB_W} ${V_VB_H}`}
      className="mx-auto block w-full max-w-[460px]"
      role="presentation"
      aria-hidden="true"
      style={{ maxHeight: 620 }}
    >
      {stages.map((stage, i) => {
        const fromY = V_ROW_Y[i];
        const toY = V_ROW_Y[i + 1];
        const ratio = stage.passed / maxForward;
        const { width, opacity } = laneStyle(ratio, 10);
        const toNextId = i === stages.length - 1 ? `${stage.id}-released` : `${stage.id}-${stages[i + 1].id}`;
        const isHovered = hoveredId === toNextId;
        return (
          <line
            key={`fwd-${stage.id}`}
            x1={V_COL_X}
            y1={fromY + V_NODE_H / 2}
            x2={V_COL_X}
            y2={toY - V_NODE_H / 2}
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

      {stages.map((stage, i) => {
        const ratio = stage.failed / maxFail;
        const { width, opacity } = laneStyle(ratio * 0.9, 10);
        const failId = `${stage.id}-failed`;
        const isHovered = hoveredId === failId;
        const startX = V_COL_X + V_NODE_W / 2;
        const startY = V_ROW_Y[i];
        const endX = V_FAIL_NODE.x - V_FAIL_NODE.w / 2;
        const endY = V_FAIL_NODE.y;
        const c1x = startX + 70;
        const c1y = startY;
        const c2x = endX - 40;
        const c2y = endY;
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

      {stages.map((stage, i) => {
        const y = V_ROW_Y[i];
        const isTop = stage.id === topBottleneckId;
        const isPinned = stage.id === pinnedStageId;
        return (
          <g key={stage.id} onClick={() => onPinStage(stage.id)} style={{ cursor: "pointer" }}>
            <rect
              x={V_COL_X - V_NODE_W / 2}
              y={y - V_NODE_H / 2}
              width={V_NODE_W}
              height={V_NODE_H}
              rx={12}
              fill={COLOR.nodeFill}
              stroke={isPinned ? COLOR.violet400 : isTop ? COLOR.amber400 : COLOR.nodeStroke}
              strokeWidth={isPinned || isTop ? 1.75 : 1}
            />
            <text
              x={V_COL_X - V_NODE_W / 2 + 20}
              y={y + 5}
              textAnchor="start"
              fontSize="13.5"
              fontWeight={600}
              fill={COLOR.textStrong}
              style={{ fontFamily: "var(--font-sans)" }}
            >
              {stage.name}
            </text>
            <text
              x={V_COL_X + V_NODE_W / 2 - 20}
              y={y - 5}
              textAnchor="end"
              fontSize="14"
              fontWeight={600}
              fill={COLOR.textStrong}
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {formatCount(stage.passed)}
            </text>
            <text
              x={V_COL_X + V_NODE_W / 2 - 20}
              y={y + 14}
              textAnchor="end"
              fontSize="11"
              fontWeight={500}
              fill={COLOR.amber400}
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {formatCount(stage.failed)} failed
            </text>
          </g>
        );
      })}

      <g>
        <rect
          x={V_COL_X - V_NODE_W / 2}
          y={V_ROW_Y[8] - V_NODE_H / 2}
          width={V_NODE_W}
          height={V_NODE_H}
          rx={12}
          fill={COLOR.nodeFill}
          stroke={COLOR.violet400}
          strokeWidth={1.5}
        />
        <text
          x={V_COL_X - V_NODE_W / 2 + 20}
          y={V_ROW_Y[8] + 5}
          textAnchor="start"
          fontSize="13.5"
          fontWeight={600}
          fill={COLOR.textStrong}
          style={{ fontFamily: "var(--font-sans)" }}
        >
          Released
        </text>
        <text
          x={V_COL_X + V_NODE_W / 2 - 20}
          y={V_ROW_Y[8] + 5}
          textAnchor="end"
          fontSize="16"
          fontWeight={600}
          fill={COLOR.violet400}
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {formatCount(data.releasedRuns)}
        </text>
      </g>

      <g>
        <rect
          x={V_FAIL_NODE.x - V_FAIL_NODE.w / 2}
          y={V_FAIL_NODE.y - V_FAIL_NODE.h / 2}
          width={V_FAIL_NODE.w}
          height={V_FAIL_NODE.h}
          rx={14}
          fill={COLOR.nodeFillStrong}
          stroke={COLOR.amber400}
          strokeWidth={1.25}
        />
        <text
          x={V_FAIL_NODE.x}
          y={V_FAIL_NODE.y - 11}
          textAnchor="middle"
          fontSize="10.5"
          fontWeight={600}
          fill={COLOR.textStrong}
          style={{ fontFamily: "var(--font-sans)" }}
        >
          Failed Builds
        </text>
        <text
          x={V_FAIL_NODE.x}
          y={V_FAIL_NODE.y + 15}
          textAnchor="middle"
          fontSize="18"
          fontWeight={600}
          fill={COLOR.amber400}
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {formatCount(data.totalRuns - data.releasedRuns)}
        </text>
      </g>
    </svg>
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

