"use client";

import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import type { SeriesPoint } from "./data";
import { dayLabel, dayLabelLong, fmtCompact, fmtFull } from "./format";
import { FOCUS_RING } from "./ui/focus";

// Layout constants for the fixed 1000x340 viewBox coordinate system. The right-hand margin is
// reserved for the persistent end-of-line value labels so they never overlap plotted data.
const VB_W = 1000;
const VB_H = 340;
const PLOT_W = 806;
const PLOT_TOP = 14;
const PLOT_BOTTOM = 284;
const PLOT_H = PLOT_BOTTOM - PLOT_TOP;
const LABEL_X = 824;

function r2(n: number): number {
  return Math.round(n * 100) / 100;
}

/**
 * The flagship visualization. Hovering or using the arrow keys moves a crosshair — this is
 * *ephemeral* component-local state (`hovered`) that is never lifted to the page. It changes no
 * persistent app state: selecting a different watchlist item or period is a deliberate click, but
 * reading a specific day's numbers on the chart is not, and the two must not share a state slot or
 * every mouse-move would "select" as forcefully as a click.
 */
export function PriceChart({ series, periodId }: { series: SeriesPoint[]; periodId: string }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const n = series.length;
  const values = series.flatMap((p) => [p.repick, p.market, p.floor]);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const pad = range * 0.08;
  const yMin = min - pad;
  const yMax = max + pad;

  const xAt = (i: number) => r2((i / Math.max(1, n - 1)) * PLOT_W);
  const yAt = (v: number) => r2(PLOT_BOTTOM - ((v - yMin) / (yMax - yMin)) * PLOT_H);

  const pathFor = (key: "repick" | "market" | "floor") =>
    series.map((p, i) => `${i === 0 ? "M" : "L"}${xAt(i)},${yAt(p[key])}`).join(" ");

  const bandPath = (() => {
    const top = series.map((p, i) => `${i === 0 ? "M" : "L"}${xAt(i)},${yAt(p.market)}`).join(" ");
    const bottomPts = [...series].reverse();
    const bottom = bottomPts.map((p, i) => `L${xAt(n - 1 - i)},${yAt(p.floor)}`).join(" ");
    return `${top} ${bottom} Z`;
  })();

  const last = series[n - 1];
  const gridLines = [0.25, 0.5, 0.75].map((f) => r2(PLOT_TOP + f * PLOT_H));

  function indexFromClientX(clientX: number): number {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return n - 1;
    const ratio = (clientX - rect.left) / rect.width;
    const dataX = ratio * VB_W;
    const idx = Math.round((dataX / PLOT_W) * (n - 1));
    return Math.min(n - 1, Math.max(0, idx));
  }

  function onPointerMove(e: PointerEvent<SVGSVGElement>) {
    setHovered(indexFromClientX(e.clientX));
  }

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      setHovered((h) => Math.min(n - 1, (h ?? n - 1) + 1));
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      setHovered((h) => Math.max(0, (h ?? n - 1) - 1));
    } else if (e.key === "Home") {
      e.preventDefault();
      setHovered(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setHovered(n - 1);
    } else if (e.key === "Escape") {
      setHovered(null);
    }
  }

  const active = hovered !== null ? series[hovered] : null;
  const tooltipLeftPct = hovered !== null ? (xAt(hovered) / VB_W) * 100 : 0;
  const tooltipFlip = tooltipLeftPct > 62;

  return (
    <div className="relative min-w-0" style={{ position: "relative" }}>
      <div
        role="group"
        aria-label={`Price trend chart, ${periodId.toUpperCase()} view. Use arrow keys to inspect individual days.`}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onBlur={() => setHovered(null)}
        className={`relative min-w-0 rounded-lg ${FOCUS_RING}`}
      >
        <svg
          ref={svgRef}
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          // Width is fluid but height tracks it via `aspect-[]` at the viewBox's own ratio, so the
          // rendered box is always geometrically similar to the viewBox — x and y scale by the same
          // factor. That is what keeps circles circular and text glyphs undistorted; the alternative
          // (a fixed pixel height + `preserveAspectRatio="none"`) stretches both non-uniformly the
          // moment the flex-1 center column's width departs from 1000/340.
          className="aspect-[1000/340] w-full"
          onPointerMove={onPointerMove}
          onPointerLeave={() => setHovered(null)}
          role="img"
          aria-hidden="true"
        >
          {gridLines.map((y) => (
            <line key={y} x1={0} x2={PLOT_W} y1={y} y2={y} stroke="white" strokeOpacity={0.06} strokeWidth={1} />
          ))}

          <path d={bandPath} fill="#fbbf24" fillOpacity={0.05} stroke="none" />

          <path d={pathFor("floor")} fill="none" stroke="#52525b" strokeWidth={1.5} strokeDasharray="4 4" />
          <path d={pathFor("market")} fill="none" stroke="#a1a1aa" strokeWidth={1.75} />
          <path d={pathFor("repick")} fill="none" stroke="#fbbf24" strokeWidth={2.5} strokeLinejoin="round" />

          {/* persistent end-of-line labels — the key values, always visible, never only on hover */}
          <g fontSize={12} fontFamily="var(--font-sans)">
            <circle cx={xAt(n - 1)} cy={yAt(last.repick)} r={3} fill="#fbbf24" />
            <text x={LABEL_X} y={yAt(last.repick) + 4} fill="#fcd34d" fontWeight={600} className="tabular-nums">
              {fmtCompact(last.repick)}
            </text>

            <circle cx={xAt(n - 1)} cy={yAt(last.market)} r={2.5} fill="#a1a1aa" />
            <text x={LABEL_X} y={yAt(last.market) + 4} fill="#d4d4d8" className="tabular-nums">
              {fmtCompact(last.market)}
            </text>

            <circle cx={xAt(n - 1)} cy={yAt(last.floor)} r={2.5} fill="#71717a" />
            <text x={LABEL_X} y={yAt(last.floor) + 4} fill="#a1a1aa" className="tabular-nums">
              {fmtCompact(last.floor)}
            </text>
          </g>

          {active && (
            <g aria-hidden="true">
              <line x1={xAt(hovered!)} x2={xAt(hovered!)} y1={PLOT_TOP} y2={PLOT_BOTTOM} stroke="#e4e4e7" strokeOpacity={0.35} strokeWidth={1} />
              <circle cx={xAt(hovered!)} cy={yAt(active.repick)} r={3.5} fill="#fbbf24" stroke="#09090b" strokeWidth={1.5} />
              <circle cx={xAt(hovered!)} cy={yAt(active.market)} r={3} fill="#d4d4d8" stroke="#09090b" strokeWidth={1.5} />
              <circle cx={xAt(hovered!)} cy={yAt(active.floor)} r={3} fill="#71717a" stroke="#09090b" strokeWidth={1.5} />
            </g>
          )}

          <text x={0} y={VB_H - 4} fill="#71717a" fontSize={11}>{dayLabel(series[0].t)}</text>
          <text x={PLOT_W / 2} y={VB_H - 4} fill="#71717a" fontSize={11} textAnchor="middle">{dayLabel(series[Math.floor((n - 1) / 2)].t)}</text>
          <text x={PLOT_W} y={VB_H - 4} fill="#71717a" fontSize={11} textAnchor="end">{dayLabel(series[n - 1].t)}</text>
        </svg>

        {active && (
          <div
            className={`pointer-events-none absolute top-2 z-10 w-44 rounded-lg border border-white/10 bg-zinc-950/95 p-2.5 text-[11px] shadow-[0_12px_28px_-12px_rgba(0,0,0,0.7)] ${
              tooltipFlip ? "-translate-x-full" : ""
            }`}
            style={{ left: `${tooltipLeftPct}%`, position: "absolute" }}
          >
            <p className="mb-1.5 font-medium text-zinc-200">{dayLabelLong(active.t)}</p>
            <dl className="space-y-1">
              <div className="flex items-center justify-between gap-3">
                <dt className="flex items-center gap-1.5 text-zinc-400"><span className="h-1.5 w-1.5 rounded-full bg-amber-400" />Repick avg</dt>
                <dd className="tabular-nums text-zinc-100">{fmtFull(active.repick)}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="flex items-center gap-1.5 text-zinc-400"><span className="h-1.5 w-1.5 rounded-full bg-zinc-300" />Market avg</dt>
                <dd className="tabular-nums text-zinc-100">{fmtFull(active.market)}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="flex items-center gap-1.5 text-zinc-400"><span className="h-1.5 w-1.5 rounded-full bg-zinc-500" />Floor</dt>
                <dd className="tabular-nums text-zinc-100">{fmtFull(active.floor)}</dd>
              </div>
            </dl>
          </div>
        )}

        <div className="sr-only" aria-live="polite">
          {active ? `${dayLabelLong(active.t)}: repick average ${fmtFull(active.repick)}, market average ${fmtFull(active.market)}, floor ${fmtFull(active.floor)}.` : ""}
        </div>
      </div>
    </div>
  );
}
