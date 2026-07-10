"use client";

import { buildDailyMix, mwFormatter } from "./data";
import styles from "./console.module.css";

interface DailyMixCurveProps {
  activeHour: number;
  activeLabel: string;
}

const WIDTH = 960;
const HEIGHT = 220;
const MARGIN = { top: 16, right: 16, bottom: 24, left: 44 };
const PLOT_W = WIDTH - MARGIN.left - MARGIN.right;
const PLOT_H = HEIGHT - MARGIN.top - MARGIN.bottom;
const MAX_Y = 2200;
const Y_TICKS = [0, 550, 1100, 1650, 2200];

const round2 = (n: number) => Math.round(n * 100) / 100;

function xScale(hour: number) {
  return round2(MARGIN.left + (hour / 23) * PLOT_W);
}

function yScale(mw: number) {
  return round2(MARGIN.top + PLOT_H - (mw / MAX_Y) * PLOT_H);
}

function areaPath(topValues: number[], baseValues: number[]) {
  const top = topValues.map((v, i) => `${i === 0 ? "M" : "L"}${xScale(i)},${yScale(v)}`).join(" ");
  const bottom = baseValues
    .map((v, i) => `L${xScale(23 - i)},${yScale(baseValues[23 - i])}`)
    .join(" ");
  return `${top} ${bottom} Z`;
}

export default function DailyMixCurve({ activeHour, activeLabel }: DailyMixCurveProps) {
  const points = buildDailyMix();
  const renewableTop = points.map((p) => p.renewableMW);
  const nuclearTop = points.map((p) => p.renewableMW + p.nuclearMW);
  const thermalTop = points.map((p) => p.demandMW);
  const zero = points.map(() => 0);

  const active = points[activeHour];
  const demandLine = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${xScale(i)},${yScale(p.demandMW)}`)
    .join(" ");

  return (
    <div>
      <p className="mb-4 max-w-prose text-sm leading-relaxed text-[var(--ink-1)]">
        24시간 대표 수급 패턴입니다. 재생에너지(태양광+풍력)가 정오 전후로 순부하를 낮추는
        &ldquo;오리곡선&rdquo; 형태를 보이며, 세로선은 현재 조회 중인 시점({activeLabel})입니다.
      </p>
      <div className={`${styles.scrollX} overflow-x-auto`}>
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="h-auto w-full min-w-[560px]"
          role="img"
          aria-labelledby="daily-mix-title"
          aria-describedby="daily-mix-desc"
        >
          <desc id="daily-mix-desc">
            {`24시간 발전원 믹스 및 수요 곡선. 현재 시점 ${activeLabel} 수요는 ${mwFormatter.format(active.demandMW)}메가와트, 재생에너지 ${mwFormatter.format(active.renewableMW)}메가와트, 원자력 ${mwFormatter.format(active.nuclearMW)}메가와트, 화력·ESS 순 ${mwFormatter.format(active.thermalMW)}메가와트입니다.`}
          </desc>

          <g aria-hidden="true">
            {Y_TICKS.map((tick) => (
              <g key={tick}>
                <line
                  x1={MARGIN.left}
                  x2={WIDTH - MARGIN.right}
                  y1={yScale(tick)}
                  y2={yScale(tick)}
                  stroke="var(--hair)"
                  strokeWidth={1}
                />
                <text x={MARGIN.left - 8} y={yScale(tick) + 3} textAnchor="end" fontFamily="var(--font-mono)" fontSize={10} fill="var(--ink-2)">
                  {tick}
                </text>
              </g>
            ))}
            {[0, 3, 6, 9, 12, 15, 18, 21].map((h) => (
              <text
                key={h}
                x={xScale(h)}
                y={HEIGHT - 6}
                textAnchor="middle"
                fontFamily="var(--font-mono)"
                fontSize={10}
                fill="var(--ink-2)"
              >
                {String(h).padStart(2, "0")}
              </text>
            ))}
          </g>

          <path d={areaPath(renewableTop, zero)} fill="var(--cyan)" opacity={0.34} />
          <path d={areaPath(nuclearTop, renewableTop)} fill="var(--ink-1)" opacity={0.28} />
          <path d={areaPath(thermalTop, nuclearTop)} fill="var(--amber)" opacity={0.32} />
          <path d={demandLine} fill="none" stroke="var(--ink-0)" strokeWidth={1.75} />

          <g aria-hidden="true">
            <line
              x1={xScale(activeHour)}
              x2={xScale(activeHour)}
              y1={MARGIN.top}
              y2={HEIGHT - MARGIN.bottom}
              stroke="var(--cyan)"
              strokeDasharray="3 3"
              strokeWidth={1.5}
            />
            <circle cx={xScale(activeHour)} cy={yScale(active.demandMW)} r={4} fill="var(--cyan)" />
          </g>
        </svg>
      </div>

      <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 border-t border-[var(--hair)] pt-3 font-mono text-xs text-[var(--ink-2)]">
        <li className="flex items-center gap-1.5">
          <span aria-hidden className="inline-block h-2.5 w-2.5 rounded-sm bg-[var(--cyan)] opacity-60" /> 재생(태양광+풍력)
        </li>
        <li className="flex items-center gap-1.5">
          <span aria-hidden className="inline-block h-2.5 w-2.5 rounded-sm bg-[var(--ink-1)] opacity-60" /> 원자력
        </li>
        <li className="flex items-center gap-1.5">
          <span aria-hidden className="inline-block h-2.5 w-2.5 rounded-sm bg-[var(--amber)] opacity-60" /> 화력·ESS 순
        </li>
        <li className="flex items-center gap-1.5">
          <span aria-hidden className="inline-block h-[2px] w-4 bg-[var(--ink-0)]" /> 총수요선
        </li>
      </ul>

      <table className="sr-only">
        <caption>24시간 수급 데이터 표</caption>
        <thead>
          <tr>
            <th scope="col">시각</th>
            <th scope="col">총수요(MW)</th>
            <th scope="col">재생에너지(MW)</th>
            <th scope="col">원자력(MW)</th>
            <th scope="col">화력·ESS순(MW)</th>
          </tr>
        </thead>
        <tbody>
          {points.map((p) => (
            <tr key={p.hour}>
              <td>{String(p.hour).padStart(2, "0")}:00</td>
              <td>{p.demandMW}</td>
              <td>{p.renewableMW}</td>
              <td>{p.nuclearMW}</td>
              <td>{p.thermalMW}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
