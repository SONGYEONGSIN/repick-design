"use client";

import { useState } from "react";
import { HOURLY_COUNTS } from "./data";

const WIDTH = 320;
const HEIGHT = 56;
const PAD = 6;
const MAX_COUNT = Math.max(...HOURLY_COUNTS.map((d) => d.count));

function pointsFor() {
  const n = HOURLY_COUNTS.length;
  const step = (WIDTH - PAD * 2) / (n - 1);
  return HOURLY_COUNTS.map((d, i) => {
    const x = Number((PAD + step * i).toFixed(2));
    const y = Number((HEIGHT - PAD - ((d.count / MAX_COUNT) * (HEIGHT - PAD * 2))).toFixed(2));
    return { x, y, ...d };
  });
}

export function ActivitySparkline() {
  const points = pointsFor();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const path = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const active = hoveredIndex !== null ? points[hoveredIndex] : null;

  return (
    <div className="min-w-0">
      <div className="flex items-baseline justify-between">
        <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">Incidents opened per hour</p>
        <p aria-live="polite" className="text-xs font-normal tabular-nums text-zinc-600">
          {active ? `${active.label} — ${active.count} opened` : `${HOURLY_COUNTS[HOURLY_COUNTS.length - 1].label} window`}
        </p>
      </div>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="mt-1.5 h-14 w-full"
        role="img"
        aria-label={`Hourly incident count from ${HOURLY_COUNTS[0].label} to ${HOURLY_COUNTS[HOURLY_COUNTS.length - 1].label}: ${HOURLY_COUNTS.map((d) => `${d.label} ${d.count}`).join(", ")}`}
      >
        <path d={path} fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-600" strokeLinejoin="round" />
        {points.map((p, i) => (
          <g key={p.label}>
            <circle cx={p.x} cy={p.y} r={hoveredIndex === i ? 3.5 : 2.5} fill="currentColor" className="text-emerald-600" />
            {/* Invisible, generously-sized hit target — wider than the dot so hover/focus is easy
                without any absolutely-positioned floating element (that class of bug, and the
                fix, is documented in candidate a/ScheduleGrid.tsx of this same round). */}
            <rect
              x={Number((p.x - WIDTH / HOURLY_COUNTS.length / 2).toFixed(2))}
              y="0"
              width={Number((WIDTH / HOURLY_COUNTS.length).toFixed(2))}
              height={HEIGHT}
              fill="transparent"
              tabIndex={0}
              role="button"
              aria-label={`${p.label}: ${p.count} incidents opened`}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              onFocus={() => setHoveredIndex(i)}
              onBlur={() => setHoveredIndex(null)}
              className="cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-600"
            />
          </g>
        ))}
      </svg>
    </div>
  );
}
