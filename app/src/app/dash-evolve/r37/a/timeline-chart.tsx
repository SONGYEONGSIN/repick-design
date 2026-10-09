"use client";

import { Fragment, useId, useMemo } from "react";
import type { MetricId, RangeId } from "./data";
import { getPoints, getAnomalies, actionFor, METRIC_META } from "./data";
import { formatCompactValue, formatValue, formatDelta } from "./format";
import { round2, SEVERITY_STYLE } from "./ui";

/**
 * The single, full-width anomaly timeline. No small multiples, no side
 * rail, no persistent detail pane beside it — per this round's assigned
 * macro skeleton. Only geometry (grid lines, area fill, line path) lives
 * inside the <svg>; every piece of TEXT (axis labels, the always-visible
 * magnitude chips, the ephemeral tooltip) is an absolutely-positioned HTML
 * overlay instead. That's deliberate: an SVG scaled by `width:100%` scales
 * any <text> inside it along with the viewBox, so an 11px label would
 * render at a few physical pixels on a narrow phone. Percent-positioned
 * HTML siblings keep real, constant font sizes at every viewport width.
 */

const VB_W = 1000;
const VB_H = 380;
const PAD_L = 56;
const PAD_R = 16;
const PAD_T = 24;
const PAD_B = 56;
const PLOT_W = VB_W - PAD_L - PAD_R;
const PLOT_H = VB_H - PAD_T - PAD_B;

export function TimelineChart({
  metric,
  range,
  hoveredIndex,
  onHoverChange,
}: {
  metric: MetricId;
  range: RangeId;
  hoveredIndex: number | null;
  onHoverChange: (index: number | null) => void;
}) {
  const baseId = useId();
  const points = useMemo(() => getPoints(metric, range), [metric, range]);
  const anomalies = useMemo(() => getAnomalies(metric, range), [metric, range]);

  const geometry = useMemo(() => {
    const n = points.length;
    const max = Math.max(...points.map((p) => p.value)) * 1.15 || 1;
    const x = (i: number) => round2(PAD_L + (n === 1 ? 0 : (i / (n - 1)) * PLOT_W));
    const y = (v: number) => round2(PAD_T + (1 - v / max) * PLOT_H);
    const coords = points.map((p, i) => ({ x: x(i), y: y(p.value) }));
    const linePoints = coords.map((c) => `${c.x},${c.y}`).join(" ");
    const bottomY = round2(PAD_T + PLOT_H);
    const areaPath =
      `M ${coords[0].x},${bottomY} ` +
      coords.map((c) => `L ${c.x},${c.y}`).join(" ") +
      ` L ${coords[coords.length - 1].x},${bottomY} Z`;
    const gridY = [0, 0.5, 1].map((f) => round2(PAD_T + f * PLOT_H));
    return { coords, linePoints, areaPath, gridY, max, bottomY };
  }, [points]);

  const n = points.length;
  const labelIndices = useMemo(() => {
    const set = new Set<number>([0, n - 1, ...anomalies.map((a) => a.index)]);
    return set;
  }, [anomalies, n]);

  return (
    <div className="relative" style={{ aspectRatio: `${VB_W} / ${VB_H}` }}>
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
        role="img"
        aria-label={`${METRIC_META[metric].label} timeline, ${points.length} points, ${anomalies.length} flagged anomalies`}
      >
        {geometry.gridY.map((gy, i) => (
          <line key={i} x1={PAD_L} x2={VB_W - PAD_R} y1={gy} y2={gy} stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
        ))}
        <path d={geometry.areaPath} fill="rgba(34,211,238,0.08)" stroke="none" />
        <polyline
          points={geometry.linePoints}
          fill="none"
          stroke="#22d3ee"
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>

      {/* Y-axis scale labels — HTML, not SVG text, so they stay real pixel sizes. */}
      <span
        className="absolute left-0 -translate-y-1/2 whitespace-nowrap text-[11px] font-normal tabular-nums text-zinc-400"
        style={{ top: `${(geometry.gridY[2] / VB_H) * 100}%` }}
      >
        0
      </span>
      <span
        className="absolute left-0 -translate-y-1/2 whitespace-nowrap text-[11px] font-normal tabular-nums text-zinc-400"
        style={{ top: `${(geometry.gridY[1] / VB_H) * 100}%` }}
      >
        {formatCompactValue(metric, geometry.max / 2)}
      </span>
      <span
        className="absolute left-0 -translate-y-1/2 whitespace-nowrap text-[11px] font-normal tabular-nums text-zinc-400"
        style={{ top: `${(geometry.gridY[0] / VB_H) * 100}%` }}
      >
        {formatCompactValue(metric, geometry.max)}
      </span>

      {/* X-axis timestamps: always shown for the first point, last point, and every anomaly —
          this is what makes each flagged anomaly's timestamp always-visible, not hover-only. */}
      {points.map((p, i) => {
        if (!labelIndices.has(i)) return null;
        const xPct = (geometry.coords[i].x / VB_W) * 100;
        return (
          <span
            key={i}
            className="absolute -translate-x-1/2 whitespace-nowrap text-[11px] font-normal tabular-nums text-zinc-400"
            style={{ left: `${xPct}%`, top: `${((geometry.bottomY + 14) / VB_H) * 100}%` }}
          >
            {p.label}
          </span>
        );
      })}

      {/* Anomaly markers: real 24x24px focusable targets, icon-only (no visible text, so there's
          no accessible-name/visible-text mismatch risk), shape AND color both carry severity.
          The closest two anomaly markers in any view/range are at least 3 points apart, which on
          the narrowest supported width (390px, ~318px of chart left after page+card padding) is
          roughly 50-55px of separation — comfortably more than the 24px each target needs, so
          these are safe as real focusable buttons rather than an aria-hidden-only pointer layer. */}
      {anomalies.map((a, order) => {
        const c = geometry.coords[a.index];
        const xPct = (c.x / VB_W) * 100;
        const yPct = (c.y / VB_H) * 100;
        const style = SEVERITY_STYLE[a.severity];
        const Icon = style.icon;
        const above = order % 2 === 0;
        const tipId = `${baseId}-tip-${a.index}`;
        const isOpen = hoveredIndex === a.index;
        return (
          // A Fragment, not a wrapping div: the tooltip below needs its percentage `left` to
          // resolve against the full chart container's width. A marker-local wrapper div has no
          // intrinsic width of its own (its children are all `position:absolute`, so none of them
          // contribute to its size), so nesting the tooltip inside that wrapper would resolve its
          // `calc(100% - 96px)` against a ~0px box instead of the real chart width. Keeping it a
          // sibling, positioned independently from the same xPct/yPct, avoids that trap.
          <Fragment key={a.index}>
          <div className="absolute" style={{ left: `${xPct}%`, top: `${yPct}%` }}>
            <button
              type="button"
              aria-label={`Anomaly at ${a.label}: ${formatValue(metric, a.value)}, ${style.word.toLowerCase()}, ${a.service}`}
              aria-describedby={isOpen ? tipId : undefined}
              onMouseEnter={() => onHoverChange(a.index)}
              onMouseLeave={() => onHoverChange(null)}
              onFocus={() => onHoverChange(a.index)}
              onBlur={() => onHoverChange(null)}
              className={`absolute left-0 top-0 flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-zinc-950 outline-offset-2 ring-2 transition-transform focus-visible:outline-2 focus-visible:outline-cyan-400 hover:scale-110 motion-reduce:transition-none ${style.ring}`}
            >
              <Icon className={`h-3.5 w-3.5 ${style.text}`} aria-hidden="true" strokeWidth={2.5} />
            </button>

            {/* Always-visible magnitude annotation — not hover-only. Alternates above/below by
                chronological order (not by value) so two time-adjacent anomalies never collide
                even when the gap between their markers is tight. */}
            <span
              className={`absolute left-0 top-0 whitespace-nowrap rounded bg-zinc-950/90 px-1 text-xs font-semibold tabular-nums ${style.text}`}
              style={{ transform: `translate(-50%, ${above ? "-30px" : "6px"})` }}
            >
              {formatCompactValue(metric, a.value)}
            </span>

          </div>

          {isOpen && (
            <div
              id={tipId}
              role="status"
              className="absolute w-48 rounded-lg border border-white/10 bg-zinc-900 p-3 text-left shadow-2xl"
              style={{
                left: `clamp(96px, ${xPct}%, calc(100% - 96px))`,
                top: `${yPct}%`,
                transform: `translate(-50%, ${above ? "calc(-100% - 18px)" : "22px"})`,
              }}
            >
              <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-zinc-400">{a.label}</p>
              <p className={`mt-1 text-sm font-semibold ${style.text}`}>
                {formatValue(metric, a.value)} · {style.word}
              </p>
              <p className="mt-1.5 font-mono text-[11px] font-normal text-zinc-400">
                {a.service} · {a.incidentId}
              </p>
              <p className="mt-1 text-xs font-normal text-zinc-400">{formatDelta(a.deltaPct)} vs baseline</p>
              <p className="mt-1.5 text-xs font-normal text-zinc-50">{actionFor(a.severity)}</p>
            </div>
          )}
          </Fragment>
        );
      })}
    </div>
  );
}
