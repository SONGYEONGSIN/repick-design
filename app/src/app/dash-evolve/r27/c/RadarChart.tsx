"use client";

import { useId, useState } from "react";
import { AXIS_SHORT, RISK_AXES, type RiskAxis, type Vendor, cohortAverage } from "./data";
import { SERIES_DASH, SERIES_HEX, TEXT_AUX, TEXT_PRIMARY, cx, r2 } from "./tokens";

/**
 * Radar geometry lives in a 0–100 coordinate space (not real pixels) so the SVG scales uniformly
 * with its container — the shape never turns into an oval at any width because width and height
 * always scale together (aspect-square wrapper). Axis labels and the vertex hit-targets are
 * separate absolutely-positioned HTML elements over the SVG, computed from the same trig, so their
 * font size and hit-target size stay fixed physical px at every breakpoint instead of shrinking
 * along with the drawing at 390px or ballooning at 1920px.
 */
const CENTER = 50;
const MAX_R = 34;
// Kept close in (rather than the more conventional ~1.15×MAX_R) specifically so that short-code
// labels ("Comp.", "Resp.") never run past the edge of the aspect-square wrapper at 390px — the
// full axis name is one tab/hover away in the tooltip below, and spelled out in the table caption.
const LABEL_R = 42;
const RINGS = [0.25, 0.5, 0.75, 1];

function axisAngle(i: number): number {
  return -Math.PI / 2 + i * ((2 * Math.PI) / RISK_AXES.length);
}
function point(i: number, fraction: number, radius: number = MAX_R): { x: number; y: number } {
  const a = axisAngle(i);
  return { x: r2(CENTER + radius * fraction * Math.cos(a)), y: r2(CENTER + radius * fraction * Math.sin(a)) };
}

export default function RadarChart({ vendors, plotted }: { vendors: Vendor[]; plotted: Set<string> }) {
  const [activeAxis, setActiveAxis] = useState<RiskAxis | null>(null);
  const uid = useId();
  const shown = vendors.filter((v) => plotted.has(v.id));

  return (
    <div>
      <div className="relative mx-auto aspect-square w-full max-w-[420px] xl:max-w-[480px] 2xl:max-w-[540px]">
        <svg viewBox="0 0 100 100" width="100%" height="100%" role="img" aria-label={`Radar comparison of ${shown.length} vendor${shown.length === 1 ? "" : "s"} across ${RISK_AXES.length} risk axes, each scored 0 to 10`}>
          {RINGS.map((ring) => {
            const ringPoints = RISK_AXES.map((_, i) => point(i, ring));
            return <polygon key={ring} points={ringPoints.map((p) => `${p.x},${p.y}`).join(" ")} fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth={0.4} />;
          })}
          {RISK_AXES.map((_, i) => {
            const outer = point(i, 1);
            return <line key={i} x1={CENTER} y1={CENTER} x2={outer.x} y2={outer.y} stroke="rgba(255,255,255,0.10)" strokeWidth={0.4} />;
          })}

          {shown.map((v) => {
            const pts = RISK_AXES.map((axis, i) => point(i, v.axes[axis] / 10));
            const dash = SERIES_DASH[v.id];
            return (
              <g key={v.id}>
                <polygon
                  points={pts.map((p) => `${p.x},${p.y}`).join(" ")}
                  fill={SERIES_HEX[v.id]}
                  fillOpacity={0.16}
                  stroke={SERIES_HEX[v.id]}
                  strokeWidth={1.1}
                  strokeDasharray={dash}
                  strokeLinejoin="round"
                />
                {pts.map((p, i) => (
                  <circle key={i} cx={p.x} cy={p.y} r={1.1} fill={SERIES_HEX[v.id]} />
                ))}
              </g>
            );
          })}
        </svg>

        {RISK_AXES.map((axis, i) => {
          const labelPos = point(i, 1, LABEL_R);
          const hotspotPos = point(i, 1, LABEL_R - 6);
          const isActive = activeAxis === axis;
          return (
            <div key={axis}>
              <div
                aria-hidden="true"
                className={cx("absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-center text-[9.5px] font-medium leading-tight sm:text-[10.5px]", isActive ? TEXT_PRIMARY : TEXT_AUX)}
                style={{ left: `${labelPos.x}%`, top: `${labelPos.y}%` }}
              >
                {AXIS_SHORT[axis]}
              </div>
              <button
                type="button"
                id={`${uid}-axis-${i}`}
                onMouseEnter={() => setActiveAxis(axis)}
                onFocus={() => setActiveAxis(axis)}
                onMouseLeave={() => setActiveAxis((a) => (a === axis ? null : a))}
                onBlur={() => setActiveAxis((a) => (a === axis ? null : a))}
                aria-label={`${axis}: ${shown.map((v) => `${v.name} ${v.axes[axis].toFixed(1)}`).join(", ")} — cohort average ${cohortAverage(axis, vendors).toFixed(1)}`}
                aria-describedby={`${uid}-tooltip`}
                className="absolute grid h-8 w-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
                style={{ left: `${hotspotPos.x}%`, top: `${hotspotPos.y}%` }}
              >
                <span aria-hidden="true" className={cx("h-1.5 w-1.5 rounded-full", isActive ? "bg-amber-400" : "bg-transparent")} />
              </button>
            </div>
          );
        })}
      </div>

      <div id={`${uid}-tooltip`} aria-live="polite" className="mt-3 min-h-[3.25rem] rounded-xl border border-white/10 bg-zinc-950 px-3 py-2">
        {activeAxis ? (
          <div>
            <p className="text-[11px] font-medium text-zinc-50">{activeAxis}</p>
            <ul className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
              {shown.map((v) => (
                <li key={v.id} className="flex items-center gap-1.5 text-[11px] tabular-nums text-zinc-300">
                  <span aria-hidden="true" className="h-2 w-2 rounded-full" style={{ backgroundColor: SERIES_HEX[v.id] }} />
                  {v.name}
                  <span className="font-semibold text-zinc-50">{v.axes[activeAxis].toFixed(1)}</span>
                </li>
              ))}
              <li className={cx("text-[11px] tabular-nums", TEXT_AUX)}>{`cohort avg ${cohortAverage(activeAxis, vendors).toFixed(1)}`}</li>
            </ul>
          </div>
        ) : (
          <p className={cx("text-[11px] font-normal leading-relaxed", TEXT_AUX)}>Hover or focus an axis for its exact per-vendor reading — every score is also printed in the table below.</p>
        )}
      </div>
    </div>
  );
}
