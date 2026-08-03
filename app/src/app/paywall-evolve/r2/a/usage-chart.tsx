import { DAILY_CAP, USAGE_SERIES } from "./data";

/** Deterministic inline SVG bar chart — 14 days of booking requests against the daily capacity
 * line implied by the Solo plan's monthly allowance. Bars that cleared capacity (requests turned
 * away) get a second visual signal beyond color — a hollow ring marker — plus a text summary below
 * the chart, so the "over capacity" days are legible without relying on color alone. */
export default function UsageChart() {
  const width = 360;
  const height = 132;
  const padTop = 10;
  const padBottom = 22;
  const plotHeight = height - padTop - padBottom;
  const maxValue = 20; // series ceiling — fixed, not derived from data, so the chart never rescales
  const barGap = 4;
  const barWidth = Math.round(((width - barGap * (USAGE_SERIES.length - 1)) / USAGE_SERIES.length) * 100) / 100;

  const capY = Math.round((padTop + plotHeight * (1 - DAILY_CAP / maxValue)) * 100) / 100;
  const overCapDays = USAGE_SERIES.filter((v) => v > DAILY_CAP).length;

  return (
    <figure className="m-0">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={`Daily booking requests over the last 14 days, rising from ${USAGE_SERIES[0]} to ${USAGE_SERIES[USAGE_SERIES.length - 1]} against a daily capacity of ${DAILY_CAP}. ${overCapDays} of the last 14 days exceeded capacity.`}
        className="w-full"
        preserveAspectRatio="none"
      >
        <line
          x1={0}
          y1={capY}
          x2={width}
          y2={capY}
          stroke="currentColor"
          className="text-amber-700"
          strokeWidth={1}
          strokeDasharray="3 3"
        />
        {USAGE_SERIES.map((value, i) => {
          const x = Math.round(i * (barWidth + barGap) * 100) / 100;
          const barHeight = Math.round((plotHeight * (value / maxValue)) * 100) / 100;
          const y = Math.round((padTop + plotHeight - barHeight) * 100) / 100;
          const overCap = value > DAILY_CAP;
          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                rx={1.5}
                className={overCap ? "fill-amber-700" : "fill-zinc-300"}
              />
              {overCap && (
                <circle
                  cx={Math.round((x + barWidth / 2) * 100) / 100}
                  cy={Math.round((y + 5) * 100) / 100}
                  r={2.5}
                  className="fill-white stroke-amber-700"
                  strokeWidth={1.2}
                />
              )}
            </g>
          );
        })}
        <text x={0} y={height - 6} className="fill-zinc-500 text-[9px]">
          14 days ago
        </text>
        <text x={width} y={height - 6} textAnchor="end" className="fill-zinc-500 text-[9px]">
          Today
        </text>
      </svg>
      <figcaption className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-normal text-zinc-600">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 flex-none rounded-sm bg-zinc-300" aria-hidden="true" />
          Under daily capacity
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 flex-none rounded-sm bg-amber-700" aria-hidden="true" />
          Over capacity — requests declined
        </span>
        <span className="inline-flex items-center gap-1.5 text-amber-700">
          <span className="h-px w-3 flex-none border-t border-dashed border-amber-700" aria-hidden="true" />
          {DAILY_CAP}/day capacity line
        </span>
      </figcaption>
    </figure>
  );
}
