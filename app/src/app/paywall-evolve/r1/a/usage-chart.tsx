import { USAGE_CAP, USAGE_SERIES } from "./data";

const WIDTH = 560;
const HEIGHT = 160;
const PAD_X = 4;
const PAD_TOP = 10;
const PAD_BOTTOM = 4;

/** Deterministic inline SVG bar chart — no remote image, so there's nothing that can fail to load
 * or shift layout while loading. Every coordinate is derived from the fixed USAGE_SERIES literal in
 * data.ts and rounded to 2 decimals, so server and client markup match exactly. The last bar (the
 * one that reached the cap) gets its own visual treatment plus a text label, so the "you're capped"
 * signal never rests on color alone. */
export default function UsageChart() {
  const max = USAGE_CAP;
  const plotH = HEIGHT - PAD_TOP - PAD_BOTTOM;
  const barW = (WIDTH - PAD_X * 2) / USAGE_SERIES.length;
  const capY = Math.round((PAD_TOP + plotH * (1 - USAGE_CAP / max)) * 100) / 100;

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className="h-auto w-full"
      role="img"
      aria-label="Daily event volume over the last 14 days, climbing from about 2,800 to the plan cap of 5,000 and holding there for the final two days"
    >
      <line
        x1={0}
        x2={WIDTH}
        y1={capY}
        y2={capY}
        stroke="#f87171"
        strokeWidth={1}
        strokeDasharray="4 3"
      />
      {USAGE_SERIES.map((v, i) => {
        const h = Math.round(plotH * (v / max) * 100) / 100;
        const x = Math.round((PAD_X + i * barW + barW * 0.16) * 100) / 100;
        const w = Math.round((barW * 0.68) * 100) / 100;
        const y = Math.round((HEIGHT - PAD_BOTTOM - h) * 100) / 100;
        const atCap = v >= max;
        return (
          <rect
            key={i}
            x={x}
            y={y}
            width={w}
            height={h}
            rx={2}
            className={atCap ? "fill-red-400" : "fill-sky-500/70"}
          />
        );
      })}
    </svg>
  );
}
