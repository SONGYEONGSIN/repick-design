"use client";

import type { Period, Vendor } from "./data";

interface Props {
  vendors: Vendor[];
  period: Period;
  pinnedId: string;
  hoveredId: string | null;
  onPin: (id: string) => void;
  onHoverChange: (id: string | null) => void;
}

const WIDTH = 760;
const HEIGHT = 300;
const PAD_LEFT = 40;
const PAD_RIGHT = 16;
const PAD_TOP = 30;
const PAD_BOTTOM = 34;

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

export default function BoxPlotChart({ vendors, period, pinnedId, hoveredId, onPin, onHoverChange }: Props) {
  const threshold = vendors[0]?.threshold ?? 3.5;
  const values = vendors.flatMap((v) => {
    const s = v.periods[period];
    return [s.min, s.max];
  });
  const domainMax = round2(Math.max(...values, threshold) * 1.18);
  const plotW = WIDTH - PAD_LEFT - PAD_RIGHT;
  const plotH = HEIGHT - PAD_TOP - PAD_BOTTOM;
  const yScale = (v: number) => round2(PAD_TOP + plotH - (v / domainMax) * plotH);
  const boxSlot = plotW / vendors.length;
  const boxWidth = Math.min(44, boxSlot * 0.5);
  const thresholdY = yScale(threshold);
  const tickCount = 4;
  const ticks = Array.from({ length: tickCount + 1 }, (_, i) => round2((domainMax / tickCount) * i));

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className="h-auto w-full"
      role="img"
      aria-label={`Defect rate distribution by vendor over the trailing ${period} days, five-number summary per vendor`}
    >
      {ticks.map((t) => {
        const y = yScale(t);
        return (
          <g key={t}>
            <line x1={PAD_LEFT} x2={WIDTH - PAD_RIGHT} y1={y} y2={y} stroke="#e4e4e7" strokeWidth={1} />
            <text x={PAD_LEFT - 8} y={y + 3} textAnchor="end" fontSize={10} fill="#71717a" className="tabular-nums">
              {t}%
            </text>
          </g>
        );
      })}

      <line x1={PAD_LEFT} x2={WIDTH - PAD_RIGHT} y1={thresholdY} y2={thresholdY} stroke="#e11d48" strokeWidth={1.5} strokeDasharray="4 3" />
      <text x={WIDTH - PAD_RIGHT} y={thresholdY - 6} textAnchor="end" fontSize={10} fill="#e11d48" fontWeight={600}>
        Threshold {threshold}%
      </text>

      {vendors.map((v, i) => {
        const s = v.periods[period];
        const cx0 = round2(PAD_LEFT + boxSlot * i + boxSlot / 2);
        const isPinned = v.id === pinnedId;
        const isHovered = v.id === hoveredId;
        const color = isPinned ? "#e11d48" : "#71717a";
        return (
          <g
            key={v.id}
            tabIndex={0}
            role="button"
            aria-pressed={isPinned}
            className="cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500"
            onClick={() => onPin(v.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onPin(v.id);
              }
            }}
            onMouseEnter={() => onHoverChange(v.id)}
            onMouseLeave={() => onHoverChange(null)}
            onFocus={() => onHoverChange(v.id)}
            onBlur={() => onHoverChange(null)}
          >
            <line x1={cx0} x2={cx0} y1={yScale(s.min)} y2={yScale(s.max)} stroke={color} strokeWidth={1.25} />
            <line x1={round2(cx0 - boxWidth / 4)} x2={round2(cx0 + boxWidth / 4)} y1={yScale(s.min)} y2={yScale(s.min)} stroke={color} strokeWidth={1.25} />
            <line x1={round2(cx0 - boxWidth / 4)} x2={round2(cx0 + boxWidth / 4)} y1={yScale(s.max)} y2={yScale(s.max)} stroke={color} strokeWidth={1.25} />
            <rect
              x={round2(cx0 - boxWidth / 2)}
              y={yScale(s.q3)}
              width={round2(boxWidth)}
              height={round2(Math.max(2, yScale(s.q1) - yScale(s.q3)))}
              fill={color}
              fillOpacity={isPinned ? 0.22 : 0.14}
              stroke={color}
              strokeWidth={isPinned || isHovered ? 2 : 1.25}
              rx={2}
            />
            <line x1={round2(cx0 - boxWidth / 2)} x2={round2(cx0 + boxWidth / 2)} y1={yScale(s.median)} y2={yScale(s.median)} stroke={color} strokeWidth={2} />
            <text x={cx0} y={HEIGHT - PAD_BOTTOM + 18} textAnchor="middle" fontSize={11} fill="#52525b">
              {v.name.split(" ")[0]}
            </text>
            <text x={cx0} y={yScale(s.max) - 8} textAnchor="middle" fontSize={11} fontWeight={600} fill={isPinned ? "#be123c" : "#3f3f46"} className="tabular-nums">
              {s.median}%
            </text>
          </g>
        );
      })}
    </svg>
  );
}
