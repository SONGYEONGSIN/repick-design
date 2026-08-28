"use client";

import { useState } from "react";
import { RISK_AXES, type RiskAxis, type RiskCase } from "./data";
import { ACCENT_HEX, BORDER, TEXT_AUX, TEXT_MUTED, TEXT_PRIMARY, cx, r2 } from "./tokens";

const SIZE = 220;
const CENTER = SIZE / 2;
const MAX_R = 82;
const RINGS = [0.25, 0.5, 0.75, 1];

function point(axisIndex: number, valueFraction: number): { x: number; y: number } {
  const angle = -Math.PI / 2 + axisIndex * ((2 * Math.PI) / RISK_AXES.length);
  const r = MAX_R * valueFraction;
  return { x: r2(CENTER + r * Math.cos(angle)), y: r2(CENTER + r * Math.sin(angle)) };
}

export default function RiskRadar({ riskCase }: { riskCase: RiskCase }) {
  const [active, setActive] = useState<{ axis: RiskAxis; value: number } | null>(null);

  const dataPoints = RISK_AXES.map((axis, i) => point(i, riskCase.axes[axis] / 10));
  const polygon = dataPoints.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-[220px_1fr] sm:items-center">
      <div className="relative mx-auto" style={{ width: SIZE, height: SIZE }}>
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} width={SIZE} height={SIZE} role="img" aria-label={`Risk profile radar for ${riskCase.vendor}, five axes scored 0 to 10`}>
          {RINGS.map((ring) => {
            const ringPoints = RISK_AXES.map((_, i) => point(i, ring));
            return <polygon key={ring} points={ringPoints.map((p) => `${p.x},${p.y}`).join(" ")} fill="none" stroke="#e4e4e7" strokeWidth={1} />;
          })}
          {RISK_AXES.map((_, i) => {
            const outer = point(i, 1);
            return <line key={i} x1={CENTER} y1={CENTER} x2={outer.x} y2={outer.y} stroke="#e4e4e7" strokeWidth={1} />;
          })}
          <polygon points={polygon} fill={ACCENT_HEX} fillOpacity={0.16} stroke={ACCENT_HEX} strokeWidth={2} strokeLinejoin="round" />
          {dataPoints.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r={3} fill={ACCENT_HEX} />
          ))}
          {RISK_AXES.map((axis, i) => {
            const p = point(i, 1.14);
            const value = riskCase.axes[axis];
            return (
              <foreignObject key={axis} x={p.x - 14} y={p.y - 14} width={28} height={28}>
                <button
                  type="button"
                  onMouseEnter={() => setActive({ axis, value })}
                  onFocus={() => setActive({ axis, value })}
                  onMouseLeave={() => setActive(null)}
                  onBlur={() => setActive(null)}
                  aria-label={`${axis}: ${value.toFixed(1)} out of 10`}
                  className="grid h-7 w-7 place-items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-700"
                >
                  <span aria-hidden="true" className="h-2 w-2 rounded-full bg-transparent" />
                </button>
              </foreignObject>
            );
          })}
        </svg>
      </div>

      <div>
        <div aria-live="polite" className={cx("mb-2 min-h-[1.5rem] rounded-lg border px-2.5 py-1.5 text-[11px] font-normal", BORDER, TEXT_MUTED, "bg-zinc-50")}>
          {active ? `${active.axis}: ${active.value.toFixed(1)} / 10` : "Hover or focus an axis point for its exact score."}
        </div>
        <dl className="grid grid-cols-1 gap-1.5">
          {RISK_AXES.map((axis) => (
            <div key={axis} className="flex items-center justify-between gap-3">
              <dt className={cx("truncate text-xs font-normal", TEXT_AUX)}>{axis}</dt>
              <dd className={cx("shrink-0 text-xs font-semibold tabular-nums", TEXT_PRIMARY)}>{riskCase.axes[axis].toFixed(1)}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
