"use client";

import { motion, useReducedMotion } from "framer-motion";
import { COLOR } from "./data";
import { BASE_PRICE, type WaterfallSegment } from "./savings-math";

interface WaterfallChartProps {
  segments: WaterfallSegment[];
}

// ---- Deterministic SVG geometry ------------------------------------------------------------
// Fixed viewBox, fixed margins, fixed gap — every coordinate below is computed from the segment
// list and these constants, never from Math.random or anything time-based. The number of bars
// changes as toggles flip (2 when none are on, up to 7 when all five are), so bar width and every
// x position are recomputed from the current segment count on every render.
const VIEW_W = 640;
const VIEW_H = 280;
const MARGIN_X = 18;
const MARGIN_TOP = 38;
const MARGIN_BOTTOM = 68;
const PLOT_H = VIEW_H - MARGIN_TOP - MARGIN_BOTTOM;
const GAP = 10;

function scaleY(price: number): number {
  const t = Math.max(0, Math.min(1, price / BASE_PRICE));
  return MARGIN_TOP + PLOT_H - t * PLOT_H;
}

interface Bar {
  seg: WaterfallSegment;
  x: number;
  width: number;
  yTop: number;
  yBottom: number;
  connectorY: number;
}

function layout(segments: WaterfallSegment[]): Bar[] {
  const n = segments.length;
  const barAreaWidth = VIEW_W - MARGIN_X * 2;
  const width = (barAreaWidth - GAP * (n - 1)) / n;

  return segments.map((seg, i) => {
    const x = MARGIN_X + i * (width + GAP);
    const isFloating = seg.kind === "discount";
    const yTop = scaleY(seg.priceStart);
    const yBottom = isFloating ? scaleY(seg.priceEnd) : scaleY(0);
    const connectorY = scaleY(seg.priceEnd);
    return { seg, x, width, yTop, yBottom, connectorY };
  });
}

const BASELINE_Y = scaleY(0);

export default function WaterfallChart({ segments }: WaterfallChartProps) {
  const reducedMotion = useReducedMotion();
  const bars = layout(segments);
  const transition = reducedMotion
    ? { duration: 0 }
    : { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const };

  const summary = segments
    .map((s) => `${s.label} ${s.valueLabel}`)
    .join(", then ");

  return (
    <div className="min-w-0">
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className="w-full"
        role="img"
        aria-label={`Waterfall chart. ${summary}.`}
      >
        {/* Baseline ($0 axis) */}
        <line
          x1={MARGIN_X}
          y1={BASELINE_Y}
          x2={VIEW_W - MARGIN_X}
          y2={BASELINE_Y}
          stroke={COLOR.border}
          strokeWidth={1.5}
        />

        {/* Connectors between consecutive bars — the "step" that makes this a waterfall rather
            than a plain bar chart: each one sits at the exact price level the next bar starts
            from, so the eye reads one running total falling, not several unrelated bars. */}
        {bars.slice(0, -1).map((bar, i) => {
          const next = bars[i + 1];
          return (
            <line
              key={`connector-${bar.seg.id}`}
              x1={bar.x + bar.width}
              y1={bar.connectorY}
              x2={next.x}
              y2={bar.connectorY}
              stroke={COLOR.muted}
              strokeWidth={1}
              strokeDasharray="3 4"
              opacity={0.55}
            />
          );
        })}

        {bars.map((bar) => {
          const { seg } = bar;
          const fill =
            seg.kind === "base"
              ? "#D4D4D8"
              : seg.kind === "final"
                ? COLOR.ink
                : COLOR.accent;
          const valueTextColor =
            seg.kind === "discount" ? COLOR.accentDark : COLOR.ink;
          const height = Math.max(2, bar.yBottom - bar.yTop);

          return (
            <g key={seg.id}>
              <motion.rect
                x={bar.x}
                width={bar.width}
                rx={4}
                fill={fill}
                stroke={COLOR.muted}
                strokeWidth={1.25}
                initial={false}
                animate={{ y: bar.yTop, height }}
                transition={transition}
              />

              {/* Value label, above the bar — a real text node, not color alone, so the amount
                  each condition subtracts is legible without relying on bar color. */}
              <motion.text
                x={bar.x + bar.width / 2}
                textAnchor="middle"
                fontSize={12}
                fontWeight={600}
                fill={valueTextColor}
                initial={false}
                animate={{ y: bar.yTop - 9 }}
                transition={transition}
                className="tabular-nums"
              >
                {seg.valueLabel}
              </motion.text>

              {/* Category label, below the $0 axis */}
              <text
                x={bar.x + bar.width / 2}
                y={BASELINE_Y + 20}
                textAnchor="middle"
                fontSize={11}
                fontWeight={600}
                fill={COLOR.muted}
              >
                {seg.label}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Visually-hidden text alternative: the same data as a real ordered list, for screen
          reader users who want to read the waterfall step by step rather than via the single
          aria-label summary above. */}
      <ol className="sr-only">
        {segments.map((s) => (
          <li key={s.id}>
            {s.label}: {s.valueLabel}
          </li>
        ))}
      </ol>
    </div>
  );
}
