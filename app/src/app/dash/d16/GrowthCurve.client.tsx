"use client";

import { useId, useState } from "react";
import { growthDatasets, growthSummary, featuredCultivar, type GrowthPeriod } from "./data";

const PERIODS: { id: GrowthPeriod; ko: string; en: string }[] = [
  { id: "week", ko: "주간", en: "Week" },
  { id: "month", ko: "월간", en: "Month" },
  { id: "season", ko: "계절", en: "Season" },
];

const VIEW_W = 600;
const VIEW_H = 260;
const PAD_L = 42;
const PAD_R = 16;
const PAD_T = 20;
const PAD_B = 34;

export default function GrowthCurve() {
  const [period, setPeriod] = useState<GrowthPeriod>("week");
  const groupId = useId();
  const dataset = growthDatasets[period];

  const min = Math.min(...dataset.values);
  const max = Math.max(...dataset.values);
  const domainPad = (max - min || 1) * 0.2;
  const yMin = Math.max(0, min - domainPad);
  const yMax = max + domainPad;

  const plotW = VIEW_W - PAD_L - PAD_R;
  const plotH = VIEW_H - PAD_T - PAD_B;
  const baseline = PAD_T + plotH;

  const points = dataset.values.map((v, i) => {
    const x = PAD_L + (dataset.values.length === 1 ? plotW / 2 : (i / (dataset.values.length - 1)) * plotW);
    const y = PAD_T + plotH - ((v - yMin) / (yMax - yMin || 1)) * plotH;
    return { x, y, v, label: dataset.labels[i] };
  });

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const areaPath = `${linePath} L${points[points.length - 1].x.toFixed(1)},${baseline} L${points[0].x.toFixed(1)},${baseline} Z`;

  const ticks = 4;
  const gridLines = Array.from({ length: ticks + 1 }, (_, i) => {
    const y = PAD_T + (plotH / ticks) * i;
    const value = yMax - ((yMax - yMin) / ticks) * i;
    return { y, value };
  });

  return (
    <div>
      <div
        role="group"
        aria-label="생장 곡선 기간 선택"
        className="mb-5 inline-flex gap-1 border border-[var(--lin-border-strong)] bg-[var(--lin-bg-rail)] p-1"
      >
        {PERIODS.map((p) => {
          const active = p.id === period;
          return (
            <button
              key={p.id}
              type="button"
              aria-pressed={active}
              onClick={() => setPeriod(p.id)}
              className={`lin-focus min-h-[44px] min-w-[44px] px-3 py-1.5 text-sm transition-colors ${
                active
                  ? "bg-[var(--lin-sage-deep)] text-[var(--lin-card)]"
                  : "text-[var(--lin-ink-muted)] hover:bg-[var(--lin-card)]"
              }`}
            >
              <span className="block leading-tight">{p.ko}</span>
              <span className="plate-serif block text-[10px] italic leading-tight tracking-wide opacity-80">
                {p.en}
              </span>
            </button>
          );
        })}
      </div>

      <figure className="m-0">
        <figcaption className="mb-1 text-xs uppercase tracking-[0.15em] text-[var(--lin-ink-muted)]">
          {featuredCultivar.name} · {featuredCultivar.accession}
        </figcaption>
        <svg
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          className="h-auto w-full"
          role="img"
          aria-labelledby={`${groupId}-title`}
          aria-describedby={`${groupId}-summary`}
        >
          <title id={`${groupId}-title`}>
            {featuredCultivar.name} 포충낭 길이 생장 곡선, {PERIODS.find((p) => p.id === period)?.ko} 단위
          </title>
          <defs>
            <pattern id={`${groupId}-hatch`} width="6" height="6" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="6" stroke="var(--lin-sepia)" strokeWidth="1" opacity="0.18" />
            </pattern>
          </defs>

          {gridLines.map((g, i) => (
            <g key={i}>
              <line
                x1={PAD_L}
                x2={VIEW_W - PAD_R}
                y1={g.y}
                y2={g.y}
                stroke="var(--lin-border-strong)"
                strokeWidth="1"
                strokeDasharray="2 3"
              />
              <text x={PAD_L - 8} y={g.y + 3} textAnchor="end" fontSize="9" fill="var(--lin-ink-muted)">
                {g.value.toFixed(1)}
              </text>
            </g>
          ))}

          <path d={areaPath} fill={`url(#${groupId}-hatch)`} stroke="none" />
          <path d={linePath} fill="none" stroke="var(--lin-sage-deep)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />

          {points.map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r="3.2" fill="var(--lin-card)" stroke="var(--lin-sage-deep)" strokeWidth="1.6">
                <title>
                  {p.label}: {p.v.toFixed(1)}
                  {dataset.unit}
                </title>
              </circle>
              <text x={p.x} y={p.y - 8} textAnchor="middle" fontSize="9" fill="var(--lin-ink)">
                {p.v.toFixed(1)}
              </text>
              <text x={p.x} y={baseline + 16} textAnchor="middle" fontSize="9" fill="var(--lin-ink-muted)">
                {p.label}
              </text>
            </g>
          ))}
        </svg>
        <p id={`${groupId}-summary`} className="mt-3 max-w-prose text-sm leading-relaxed text-[var(--lin-ink-muted)]">
          {growthSummary[period]}
        </p>
      </figure>
    </div>
  );
}
