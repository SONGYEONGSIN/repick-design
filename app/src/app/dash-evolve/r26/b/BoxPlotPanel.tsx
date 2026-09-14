"use client";

import { useState } from "react";
import type { BoxStats } from "./data";
import { BORDER, NUM, TEXT_AUX, TEXT_MUTED, TEXT_PRIMARY, cx, r2 } from "./tokens";

// Fixed drawing surface. Interaction targets are real HTML buttons laid over
// the chart by percentage (see the `h-7 w-7` overlay buttons below) rather
// than SVG foreignObjects, specifically so their hit area stays a fixed
// 28×28 CSS px no matter how narrow the card gets — an SVG-scaled
// foreignObject would shrink under the 24×24 "target-size" floor on a
// phone-width card, since this chart (unlike a fixed-size radar) is fluid.
const W = 640;
const H = 170;
const PLOT_L = 14;
const PLOT_R = W - 14;
const PLOT_W = PLOT_R - PLOT_L;
const Y_MID = 92;
const BOX_HALF = 20;
const AXIS_Y = 140;
const TICKS = [0, 20, 40, 60, 80, 100];

function xScale(v: number): number {
  const clamped = Math.min(100, Math.max(0, v));
  return r2(PLOT_L + (clamped / 100) * PLOT_W);
}
function pct(px: number, span: number): number {
  return r2((px / span) * 100);
}

// target-size fix (hard-gate a11y): the five whisker/box markers share one y (`Y_MID`), so on a
// tight distribution (small IQR, few inspections) their *true* x positions land closer together
// than the 28px hit targets are wide — the buttons overlap and the unobscured area for each drops
// under the WCAG 2.5.8 24×24 floor (audited at 21.2px on a "Q3" target). Visual marks (the box,
// whiskers, median line) stay exactly on the real data value; only the invisible hit targets get
// nudged apart in SVG-space so their *centers* are never closer than MIN_HIT_GAP.
//
// MIN_HIT_GAP is sized for the narrowest width this panel is ever measured at: Lighthouse's
// default mobile emulation (360 CSS px) puts this card's content at ~296px (390px viewport minus
// `px-4` main padding minus `p-4` card padding is even tighter, 360 is the binding case) — a
// ~0.4625 real-px-per-SVG-px scale. 64 SVG px * 0.4625 ≈ 29.6 real px of clear space, a margin
// above the 24px floor rather than a value that just barely clears it.
const MIN_HIT_GAP = 64;

function spreadMinGap(xs: number[], minGap: number, lo: number, hi: number): number[] {
  const out = [...xs];
  for (let i = 1; i < out.length; i++) out[i] = Math.max(out[i], out[i - 1] + minGap);
  const overflow = out[out.length - 1] - hi;
  if (overflow > 0) for (let i = 0; i < out.length; i++) out[i] -= overflow;
  for (let i = out.length - 2; i >= 0; i--) out[i] = Math.min(out[i], out[i + 1] - minGap);
  for (let i = 0; i < out.length; i++) out[i] = Math.min(hi, Math.max(lo, out[i]));
  return out;
}

interface Marker {
  key: string;
  label: string;
  value: number;
  x: number;
  hitX: number;
  y: number;
}

export default function BoxPlotPanel({ stats, orgMedian, supplierName }: { stats: BoxStats; orgMedian: number; supplierName: string }) {
  const [active, setActive] = useState<Marker | null>(null);

  const minLabel = stats.min === stats.whiskerLow ? "Min" : "Lower whisker (non-outlier min)";
  const maxLabel = stats.max === stats.whiskerHigh ? "Max" : "Upper whisker (non-outlier max)";

  // Main markers are always in ascending x order (min ≤ q1 ≤ median ≤ q3 ≤ max by construction),
  // so `spreadMinGap` can walk them left-to-right without re-sorting. Outliers keep their raw
  // x — they already carry their own vertical offset (below) to stay clear of the main row.
  const mainX = [xScale(stats.whiskerLow), xScale(stats.q1), xScale(stats.median), xScale(stats.q3), xScale(stats.whiskerHigh)];
  const mainHitX = spreadMinGap(mainX, MIN_HIT_GAP, PLOT_L, PLOT_R);

  const markers: Marker[] = [
    { key: "min", label: minLabel, value: stats.whiskerLow, x: mainX[0], hitX: mainHitX[0], y: Y_MID },
    { key: "q1", label: "Q1", value: stats.q1, x: mainX[1], hitX: mainHitX[1], y: Y_MID },
    { key: "median", label: "Median", value: stats.median, x: mainX[2], hitX: mainHitX[2], y: Y_MID },
    { key: "q3", label: "Q3", value: stats.q3, x: mainX[3], hitX: mainHitX[3], y: Y_MID },
    { key: "max", label: maxLabel, value: stats.whiskerHigh, x: mainX[4], hitX: mainHitX[4], y: Y_MID },
    ...stats.outliers.map((v, i) => ({ key: `outlier-${i}`, label: "Outlier", value: v, x: xScale(v), hitX: xScale(v), y: Y_MID + (i % 2 === 0 ? -14 : 14) })),
  ];

  const orgX = xScale(orgMedian);
  const orgAnchor: "start" | "middle" | "end" = orgX < 90 ? "start" : orgX > W - 90 ? "end" : "middle";

  return (
    <div>
      <div className="relative w-full" style={{ aspectRatio: `${W} / ${H}` }}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
          role="img"
          aria-label={`Defect severity box plot for ${supplierName}: minimum ${stats.min}, first quartile ${stats.q1}, median ${stats.median}, third quartile ${stats.q3}, maximum ${stats.max}, ${stats.outliers.length} outlier${stats.outliers.length === 1 ? "" : "s"}, on a 0 to 100 severity scale.`}
        >
          <line x1={orgX} y1={20} x2={orgX} y2={AXIS_Y} stroke="#a1a1aa" strokeWidth={1} strokeDasharray="3 3" />
          <text x={orgX} y={13} textAnchor={orgAnchor} className={cx("fill-zinc-500 text-[10px]", NUM)}>
            {`Org median ${orgMedian.toFixed(1)}`}
          </text>

          <line x1={xScale(stats.whiskerLow)} y1={Y_MID} x2={xScale(stats.q1)} y2={Y_MID} stroke="#a78bfa" strokeWidth={1.5} />
          <line x1={xScale(stats.q3)} y1={Y_MID} x2={xScale(stats.whiskerHigh)} y2={Y_MID} stroke="#a78bfa" strokeWidth={1.5} />
          <line x1={xScale(stats.whiskerLow)} y1={Y_MID - 8} x2={xScale(stats.whiskerLow)} y2={Y_MID + 8} stroke="#7c3aed" strokeWidth={1.5} />
          <line x1={xScale(stats.whiskerHigh)} y1={Y_MID - 8} x2={xScale(stats.whiskerHigh)} y2={Y_MID + 8} stroke="#7c3aed" strokeWidth={1.5} />

          <rect
            x={xScale(stats.q1)}
            y={Y_MID - BOX_HALF}
            width={Math.max(2, xScale(stats.q3) - xScale(stats.q1))}
            height={BOX_HALF * 2}
            fill="#6d28d9"
            fillOpacity={0.14}
            stroke="#6d28d9"
            strokeWidth={1.75}
            rx={3}
          />
          <line x1={xScale(stats.median)} y1={Y_MID - BOX_HALF} x2={xScale(stats.median)} y2={Y_MID + BOX_HALF} stroke="#6d28d9" strokeWidth={2.5} />

          {stats.outliers.map((v, i) => (
            <circle key={i} cx={xScale(v)} cy={Y_MID + (i % 2 === 0 ? -14 : 14)} r={4} fill="#ffffff" stroke="#e11d48" strokeWidth={1.75} />
          ))}

          <line x1={PLOT_L} y1={AXIS_Y} x2={PLOT_R} y2={AXIS_Y} stroke="#e4e4e7" strokeWidth={1} />
          {TICKS.map((t) => (
            <g key={t}>
              <line x1={xScale(t)} y1={AXIS_Y} x2={xScale(t)} y2={AXIS_Y + 5} stroke="#d4d4d8" strokeWidth={1} />
              <text x={xScale(t)} y={AXIS_Y + 17} textAnchor="middle" className={cx("fill-zinc-500 text-[10px]", NUM)}>
                {t}
              </text>
            </g>
          ))}

          {active ? <line x1={active.x} y1={16} x2={active.x} y2={AXIS_Y} stroke="#6d28d9" strokeWidth={1} strokeDasharray="2 3" /> : null}
        </svg>

        <div className="pointer-events-none absolute inset-0">
          {markers.map((m) => (
            <button
              key={m.key}
              type="button"
              onMouseEnter={() => setActive(m)}
              onFocus={() => setActive(m)}
              onMouseLeave={() => setActive(null)}
              onBlur={() => setActive(null)}
              aria-label={`${m.label}: ${m.value.toFixed(1)}`}
              style={{ left: `${pct(m.hitX, W)}%`, top: `${pct(m.y, H)}%` }}
              className="pointer-events-auto absolute h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-700"
            >
              <span aria-hidden="true" className="block h-2 w-2 rounded-full bg-transparent" />
            </button>
          ))}
        </div>
      </div>

      <div aria-live="polite" className={cx("mt-1 min-h-[1.5rem] rounded-lg border px-2.5 py-1.5 text-[11px] font-normal", BORDER, TEXT_MUTED, "bg-zinc-50")}>
        {active ? `${active.label}: ${active.value.toFixed(1)} / 100` : "Hover or focus a marker on the plot for its exact reading."}
      </div>

      {/* AA-required fallback: five-number summary stays printed at all times, hover is a bonus not a prerequisite. */}
      <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 sm:grid-cols-5">
        {(
          [
            { label: "Min", value: stats.min },
            { label: "Q1", value: stats.q1 },
            { label: "Median", value: stats.median },
            { label: "Q3", value: stats.q3 },
            { label: "Max", value: stats.max },
          ] as const
        ).map((row) => (
          <div key={row.label} className={cx("rounded-lg border px-2.5 py-2", BORDER, "bg-zinc-50")}>
            <dt className={cx("text-[10px] font-medium uppercase tracking-[0.08em]", TEXT_AUX)}>{row.label}</dt>
            <dd className={cx("mt-0.5 text-sm font-semibold", NUM, TEXT_PRIMARY)}>{row.value.toFixed(1)}</dd>
          </div>
        ))}
      </dl>
      <p className={cx("mt-2 text-xs font-normal", TEXT_MUTED)}>
        {`IQR ${stats.iqr.toFixed(1)} · n = ${stats.n} inspections · `}
        {stats.outliers.length > 0 ? (
          <span className={cx("font-medium text-rose-700", NUM)}>{`${stats.outliers.length} outlier${stats.outliers.length === 1 ? "" : "s"} (${stats.outliers.map((v) => v.toFixed(1)).join(", ")})`}</span>
        ) : (
          "no outliers in this window"
        )}
      </p>
    </div>
  );
}
