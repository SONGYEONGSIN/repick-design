"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import { DELTA_CLAMP_PCT, type SlopeRow } from "./data";
import { ACCENT_FILL, ACCENT_TINT, EASE, MUTED, NUM, money } from "./tokens";

// Pure geometry, no randomness. All coordinates rounded to 2 decimals.
function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

// Design units for the chart's own coordinate space — deliberately narrow and
// tall (rather than wide) so the paired-axis geometry stays legible down to a
// 390px viewport without shrinking any label text: the outer container is
// pinned to this exact aspect ratio via CSS `aspect-ratio`, so the SVG layer
// and the HTML label layer beneath it always scale together, in lockstep,
// regardless of the viewport's actual rendered width.
const ROW_H = 92;
const W = 340;
const LEFT_X = 104;
const RIGHT_X = 236;
const LEFT_LABEL_PCT = round2((LEFT_X / W) * 100);
const RIGHT_LABEL_START_PCT = round2((RIGHT_X / W) * 100);
// Half the row band, minus a fixed 18-unit pad from the row's own edges, so a
// line can never swing far enough to cross into a neighboring row's band —
// collision-free at any delta this dataset produces.
const MAX_OFFSET = ROW_H / 2 - 18;

function rowCenterY(row: number): number {
  return round2(row * ROW_H + ROW_H / 2);
}
function slopeOffset(deltaPct: number): number {
  const clamped = clamp(deltaPct, -DELTA_CLAMP_PCT, DELTA_CLAMP_PCT);
  // Positive delta (fair price above asking) reads as "up" — and up is a
  // smaller SVG y, since y grows downward — so the sign flips here.
  return round2(-(clamped / DELTA_CLAMP_PCT) * MAX_OFFSET);
}

/**
 * Two vertical axes — "Seller's asking price" and "repick's verified fair
 * price" — connected by one straight line per item. The line's slope is the
 * proof: it is not decorative, it is a direct plot of that item's own signed
 * `delta` (already computed by `computeSlopeRows` from real per-item data and
 * the current scenario's weights).
 *
 * The SVG layer draws only geometry and is `aria-hidden` — every value it
 * encodes also exists as real, visible HTML text in the label layer, and
 * each row is additionally wrapped in a `role="group"` with a full-sentence
 * `aria-label` so screen readers get one clean read per row instead of
 * fragments. Direction is never color-only: every row's delta carries a
 * signed percentage and a Trending icon, both in real text.
 */
export default function SlopeChart({ rows }: { rows: SlopeRow[] }) {
  const reduceMotion = useReducedMotion();
  const height = rows.length * ROW_H;
  const transition = reduceMotion ? { duration: 0 } : { duration: 0.45, ease: EASE };

  return (
    <div>
      <div className="flex items-start justify-between gap-4 px-1">
        <span
          className="text-[11px] font-semibold uppercase tracking-[0.16em]"
          style={{ color: MUTED }}
        >
          Seller&rsquo;s asking price
        </span>
        <span
          className="text-right text-[11px] font-semibold uppercase tracking-[0.16em]"
          style={{ color: ACCENT_TINT }}
        >
          repick&rsquo;s verified fair price
        </span>
      </div>

      <div className="relative mt-4 w-full" style={{ aspectRatio: `${W} / ${height}` }}>
        <svg
          viewBox={`0 0 ${W} ${height}`}
          aria-hidden="true"
          className="absolute inset-0 h-full w-full"
        >
          <line x1={LEFT_X} y1={0} x2={LEFT_X} y2={height} stroke="#FFFFFF" strokeOpacity={0.12} strokeWidth={1} />
          <line x1={RIGHT_X} y1={0} x2={RIGHT_X} y2={height} stroke="#FFFFFF" strokeOpacity={0.12} strokeWidth={1} />

          {rows.map((r) => {
            const yLeft = rowCenterY(r.row);
            const yRight = round2(yLeft + slopeOffset(r.delta));
            const color = r.direction === "up" ? ACCENT_FILL : MUTED;
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
                  strokeWidth={2.5}
                  strokeLinecap="round"
                />
                <circle cx={LEFT_X} cy={yLeft} r={4.5} fill={MUTED} stroke="#0B0B0F" strokeWidth={1.5} />
                <motion.circle
                  cx={RIGHT_X}
                  cy={yRight}
                  r={4.5}
                  animate={{ cy: yRight }}
                  transition={transition}
                  fill={color}
                  stroke="#0B0B0F"
                  strokeWidth={1.5}
                />
              </g>
            );
          })}
        </svg>

        <div
          className="absolute inset-0 grid"
          style={{ gridTemplateRows: `repeat(${rows.length}, 1fr)` }}
        >
          {rows.map((r) => {
            const Icon = r.direction === "up" ? TrendingUp : r.direction === "down" ? TrendingDown : Minus;
            const color = r.direction === "up" ? ACCENT_FILL : MUTED;
            const sign = r.delta > 0.5 ? "+" : r.delta < -0.5 ? "−" : "";
            const deltaLabel = `${sign}${Math.abs(r.delta).toFixed(1)}%`;
            const directionWord = r.direction === "up" ? "up" : r.direction === "down" ? "down" : "flat, within";
            const sentence = `${r.item.short}. Seller asking ${money(r.asking)}. repick verified fair price ${money(
              r.fair
            )}, ${directionWord} ${Math.abs(r.delta).toFixed(1)} percent from asking.`;

            return (
              <div key={r.item.id} role="group" aria-label={sentence} className="relative flex items-center">
                <div
                  aria-hidden="true"
                  className="absolute left-0 top-1/2 -translate-y-1/2 pr-2 text-right"
                  style={{ width: `${LEFT_LABEL_PCT}%` }}
                >
                  <p className="truncate text-sm font-semibold text-white">{r.item.short}</p>
                  <p className={`text-xs ${NUM}`} style={{ color: MUTED }}>
                    {money(r.asking)}
                  </p>
                </div>

                <div
                  aria-hidden="true"
                  className="absolute right-0 top-1/2 -translate-y-1/2 pl-2 text-left"
                  style={{ width: `${100 - RIGHT_LABEL_START_PCT}%` }}
                >
                  <p className={`truncate text-sm font-semibold text-white ${NUM}`}>{money(r.fair)}</p>
                  <p className={`inline-flex items-center gap-1 text-xs font-semibold ${NUM}`} style={{ color }}>
                    <Icon className="h-3 w-3 flex-none" aria-hidden="true" strokeWidth={2.5} />
                    {deltaLabel}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
