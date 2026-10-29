"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import { DELTA_CLAMP_PCT, formatDelta, money, type GradeId, type SlopeRow } from "./data";
import { ACCENT_FILL_HEX, ACCENT_MUTED_LINE, EASE, NUM } from "./tokens";

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

// Fixed chart geometry -- narrow and tall rather than wide, so it stays legible at 390px without
// shrinking any label text. The outer wrapper is pinned to this exact aspect ratio, so the SVG
// layer and the HTML label layer beneath it always scale together.
const ROW_H = 88;
const W = 320;
const LEFT_X = 92;
const RIGHT_X = 228;
const LEFT_LABEL_PCT = round2((LEFT_X / W) * 100);
const RIGHT_LABEL_START_PCT = round2((RIGHT_X / W) * 100);
const MAX_OFFSET = ROW_H / 2 - 16;

function rowCenterY(row: number): number {
  return round2(row * ROW_H + ROW_H / 2);
}
function slopeOffset(delta: number): number {
  const clamped = clamp(delta, -DELTA_CLAMP_PCT, DELTA_CLAMP_PCT);
  return round2(-(clamped / DELTA_CLAMP_PCT) * MAX_OFFSET);
}

interface SlopeChartProps {
  rows: SlopeRow[];
  selectedGradeId: GradeId;
  hoveredGradeId: GradeId | null;
  onHoverGrade: (id: GradeId | null) => void;
}

/**
 * Two vertical axes -- "Listed by seller" and "repick AI price" -- joined by one line per grade
 * tier within the current category. The line's slope is a direct plot of that row's own signed
 * `delta`, already computed from real item data. The row matching the slider's current grade is
 * drawn bold in the accent color with a pinned label; the other three stay visible, muted.
 *
 * The SVG layer is purely decorative geometry (`aria-hidden`) -- every value it encodes also
 * exists as real, always-visible HTML text in the label layer below it, so start/end values never
 * depend on a hover state. Hover/focus on a row additionally reports its grade id upward so a
 * sibling detail panel can show more (the reason tags) without hiding those baseline labels.
 */
export default function SlopeChart({ rows, selectedGradeId, hoveredGradeId, onHoverGrade }: SlopeChartProps) {
  const reduceMotion = useReducedMotion();
  const height = rows.length * ROW_H;
  const transition = reduceMotion ? { duration: 0 } : { duration: 0.4, ease: EASE };

  return (
    <div>
      <div className="flex items-start justify-between gap-4 px-1">
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">Listed by seller</span>
        <span className="text-right text-[11px] font-semibold uppercase tracking-[0.14em] text-teal-700">
          repick AI price
        </span>
      </div>

      <div className="relative mt-3 w-full" style={{ aspectRatio: `${W} / ${height}` }}>
        <svg viewBox={`0 0 ${W} ${height}`} aria-hidden="true" className="absolute inset-0 h-full w-full">
          <line x1={LEFT_X} y1={0} x2={LEFT_X} y2={height} stroke="#E4E4E7" strokeWidth={1} />
          <line x1={RIGHT_X} y1={0} x2={RIGHT_X} y2={height} stroke="#E4E4E7" strokeWidth={1} />

          {rows.map((r) => {
            const yLeft = rowCenterY(r.rowIndex);
            const yRight = round2(yLeft + slopeOffset(r.delta));
            const isSelected = r.grade.id === selectedGradeId;
            const color = isSelected ? ACCENT_FILL_HEX : ACCENT_MUTED_LINE;
            return (
              <g key={r.item.id}>
                <motion.line
                  x1={LEFT_X}
                  x2={RIGHT_X}
                  y1={yLeft}
                  y2={yRight}
                  animate={{ y1: yLeft, y2: yRight }}
                  transition={transition}
                  stroke={color}
                  strokeWidth={isSelected ? 3 : 1.75}
                  strokeLinecap="round"
                  opacity={isSelected ? 1 : 0.55}
                />
                <circle cx={LEFT_X} cy={yLeft} r={isSelected ? 4.5 : 3.5} fill={color} opacity={isSelected ? 1 : 0.6} />
                <motion.circle
                  cx={RIGHT_X}
                  cy={yRight}
                  r={isSelected ? 4.5 : 3.5}
                  animate={{ cy: yRight }}
                  transition={transition}
                  fill={color}
                  opacity={isSelected ? 1 : 0.6}
                />
              </g>
            );
          })}
        </svg>

        <div className="absolute inset-0 grid" style={{ gridTemplateRows: `repeat(${rows.length}, 1fr)` }}>
          {rows.map((r) => {
            const isSelected = r.grade.id === selectedGradeId;
            const isHovered = hoveredGradeId === r.grade.id;
            const Icon = r.direction === "up" ? TrendingUp : r.direction === "down" ? TrendingDown : Minus;
            const directionWord = r.direction === "up" ? "up" : r.direction === "down" ? "down" : "flat, within half a percent of";
            const sentence = `${r.grade.label} grade, ${r.item.short}. Listed ${money(r.listedPrice)}. repick AI price ${money(
              r.aiPrice
            )}, ${directionWord} ${Math.abs(r.delta).toFixed(1)} percent from asking.${isSelected ? " This is your current selection." : ""}`;

            return (
              <button
                key={r.item.id}
                type="button"
                onMouseEnter={() => onHoverGrade(r.grade.id)}
                onMouseLeave={() => onHoverGrade(null)}
                onFocus={() => onHoverGrade(r.grade.id)}
                onBlur={() => onHoverGrade(null)}
                className={`relative flex w-full items-center rounded-md text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F766E] ${
                  isHovered ? "bg-teal-50/70" : ""
                }`}
              >
                <span
                  className="absolute left-0 top-1/2 -translate-y-1/2 pr-2 text-right"
                  style={{ width: `${LEFT_LABEL_PCT}%` }}
                >
                  <span className={`block truncate text-sm font-semibold ${isSelected ? "text-zinc-950" : "text-zinc-500"}`}>
                    {r.grade.label}
                  </span>
                  <span className={`block text-xs font-normal ${NUM} text-zinc-500`}>{money(r.listedPrice)}</span>
                </span>

                <span
                  className="absolute right-0 top-1/2 -translate-y-1/2 pl-2 text-left"
                  style={{ width: `${100 - RIGHT_LABEL_START_PCT}%` }}
                >
                  <span className={`block truncate text-sm font-extrabold ${NUM} ${isSelected ? "text-zinc-950" : "text-zinc-600"}`}>
                    {money(r.aiPrice)}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-semibold ${NUM} ${
                      isSelected ? "text-teal-700" : "text-zinc-500"
                    }`}
                  >
                    <Icon className="h-3 w-3 flex-none" aria-hidden="true" strokeWidth={2.5} />
                    {formatDelta(r.delta)}
                  </span>
                </span>

                <span className="sr-only">{sentence}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
