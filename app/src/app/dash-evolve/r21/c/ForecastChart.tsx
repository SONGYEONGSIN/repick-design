"use client";

import { useMemo, useState } from "react";
import type { ForecastPoint, Horizon } from "./data";
import { ACCENT_HEX, BORDER, TEXT_MUTED, cx, r2 } from "./tokens";

const W = 760;
const H = 280;
const PAD_L = 46;
const PAD_R = 16;
const PAD_T = 20;
const PAD_B = 28;

export default function ForecastChart({ points, reorder, horizon }: { points: ForecastPoint[]; reorder: number; horizon: Horizon }) {
  const [active, setActive] = useState<ForecastPoint | null>(null);

  const { xScale, yScale, actualPath, forecastPath, bandPath, todayPoint, crossPoint, yMax, yMin, steps } = useMemo(() => {
    const minDay = points[0].day;
    const maxDay = points[points.length - 1].day;
    const values = points.flatMap((p) => [p.value, p.lower ?? p.value, p.upper ?? p.value, reorder]);
    const vMax = Math.max(...values) * 1.06;
    const vMin = Math.min(0, Math.min(...values) * 0.94);

    const xS = (day: number) => r2(PAD_L + ((day - minDay) / (maxDay - minDay)) * (W - PAD_L - PAD_R));
    const yS = (v: number) => r2(H - PAD_B - ((v - vMin) / (vMax - vMin)) * (H - PAD_T - PAD_B));

    const actual = points.filter((p) => p.day <= 0);
    const forecast = points.filter((p) => p.day >= 0);

    const aPath = actual.map((p, i) => `${i === 0 ? "M" : "L"}${xS(p.day)},${yS(p.value)}`).join(" ");
    const fPath = forecast.map((p, i) => `${i === 0 ? "M" : "L"}${xS(p.day)},${yS(p.value)}`).join(" ");

    const upperPath = forecast.map((p, i) => `${i === 0 ? "M" : "L"}${xS(p.day)},${yS(p.upper ?? p.value)}`).join(" ");
    const lowerPath = [...forecast]
      .reverse()
      .map((p) => `L${xS(p.day)},${yS(p.lower ?? p.value)}`)
      .join(" ");
    const bPath = `${upperPath} ${lowerPath} Z`;

    const today = points.find((p) => p.day === 0) ?? points[0];
    const cross = forecast.find((p) => p.value <= reorder) ?? null;

    const stepSize = horizon <= 30 ? 5 : horizon <= 60 ? 10 : 15;
    const stepDays = points.filter((p) => p.day === minDay || p.day === maxDay || (p.day >= 0 && p.day % stepSize === 0));

    return { xScale: xS, yScale: yS, actualPath: aPath, forecastPath: fPath, bandPath: bPath, todayPoint: today, crossPoint: cross, yMax: vMax, yMin: vMin, steps: stepDays };
  }, [points, reorder, horizon]);

  const reorderY = yScale(reorder);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] font-normal">
        <span className={cx("flex items-center gap-1.5", TEXT_MUTED)}>
          <span aria-hidden="true" className="h-0.5 w-4 rounded-full bg-teal-400" />
          Actual
        </span>
        <span className={cx("flex items-center gap-1.5", TEXT_MUTED)}>
          <svg width={16} height={2} aria-hidden="true">
            <line x1={0} y1={1} x2={16} y2={1} stroke="#2dd4bf" strokeWidth={2} strokeDasharray="3 3" />
          </svg>
          Forecast
        </span>
        <span className={cx("flex items-center gap-1.5", TEXT_MUTED)}>
          <span aria-hidden="true" className="h-2.5 w-4 rounded-sm bg-teal-400/20" />
          Confidence band
        </span>
        <span className={cx("flex items-center gap-1.5", TEXT_MUTED)}>
          <span aria-hidden="true" className="h-0.5 w-4 rounded-full bg-rose-500" />
          Reorder point
        </span>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} role="img" aria-label={`Projected network inventory over the next ${horizon} days, against a reorder point of ${reorder} units`} className="mt-2">
        {[0, 0.25, 0.5, 0.75, 1].map((t) => {
          const v = r2(yMin + (yMax - yMin) * t);
          const y = yScale(v);
          return (
            <g key={t}>
              <line x1={PAD_L} y1={y} x2={W - PAD_R} y2={y} stroke="#ffffff0f" strokeWidth={1} />
              <text x={PAD_L - 8} y={y + 3} textAnchor="end" fontSize={10} fill="#a1a1aa">
                {Math.round(v / 100) / 10}k
              </text>
            </g>
          );
        })}

        <path d={bandPath} fill={ACCENT_HEX} fillOpacity={0.14} stroke="none" />
        <line x1={PAD_L} y1={reorderY} x2={W - PAD_R} y2={reorderY} stroke="#fb7185" strokeWidth={1.5} strokeDasharray="4 3" />
        <path d={actualPath} fill="none" stroke={ACCENT_HEX} strokeWidth={2.25} strokeLinecap="round" strokeLinejoin="round" />
        <path d={forecastPath} fill="none" stroke={ACCENT_HEX} strokeWidth={2.25} strokeDasharray="5 4" strokeLinecap="round" strokeLinejoin="round" />

        <circle cx={xScale(todayPoint.day)} cy={yScale(todayPoint.value)} r={3.5} fill={ACCENT_HEX} />
        <text x={xScale(todayPoint.day)} y={yScale(todayPoint.value) - 12} textAnchor="middle" fontSize={11} fontWeight={600} fill="#fafafa">
          {`Today: ${todayPoint.value.toLocaleString("en-US")}`}
        </text>

        {crossPoint ? (
          <>
            <circle cx={xScale(crossPoint.day)} cy={yScale(crossPoint.value)} r={3.5} fill="#fb7185" />
            <text x={xScale(crossPoint.day)} y={yScale(crossPoint.value) + 18} textAnchor="middle" fontSize={11} fontWeight={600} fill="#fda4af">
              {`Day ${crossPoint.day}: crosses reorder point`}
            </text>
          </>
        ) : null}

        {steps.map((p) => (
          <foreignObject key={p.day} x={xScale(p.day) - 11} y={0} width={22} height={H}>
            <button
              type="button"
              onMouseEnter={() => setActive(p)}
              onFocus={() => setActive(p)}
              onMouseLeave={() => setActive(null)}
              onBlur={() => setActive(null)}
              aria-label={`Day ${p.day >= 0 ? `+${p.day}` : p.day}: ${p.value.toLocaleString("en-US")} units projected${p.lower !== undefined ? `, range ${p.lower.toLocaleString("en-US")} to ${p.upper?.toLocaleString("en-US")}` : ""}`}
              className="h-full w-full focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-teal-400"
            />
          </foreignObject>
        ))}
      </svg>

      <div aria-live="polite" className={cx("mt-1 min-h-[1.5rem] rounded-lg border px-2.5 py-1.5 text-[11px] font-normal", BORDER, TEXT_MUTED, "bg-white/[0.03]")}>
        {active
          ? `Day ${active.day >= 0 ? `+${active.day}` : active.day}: ${active.value.toLocaleString("en-US")} units${active.lower !== undefined ? ` (range ${active.lower.toLocaleString("en-US")}–${active.upper?.toLocaleString("en-US")})` : ""}`
          : "Hover or focus a point along the axis for its exact projection and confidence range."}
      </div>
    </div>
  );
}
