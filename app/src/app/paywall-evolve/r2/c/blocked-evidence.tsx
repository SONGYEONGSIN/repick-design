import { Clock, Inbox } from "lucide-react";
import { BLOCKED_CATEGORIES, DAILY_QUEUED, fmt } from "./data";

const CHART_W = 280;
const CHART_H = 96;
const BAR_GAP = 6;
const MAX_COUNT = Math.max(...DAILY_QUEUED.map((d) => d.count));

/** Deterministic inline bar chart — plain division on static integers, no trig, no clock, no PRNG. */
function QueueTrendChart() {
  const barWidth = Math.round(((CHART_W - BAR_GAP * (DAILY_QUEUED.length - 1)) / DAILY_QUEUED.length) * 100) / 100;

  return (
    <figure className="m-0">
      <svg
        viewBox={`0 0 ${CHART_W} ${CHART_H + 18}`}
        role="img"
        aria-labelledby="queue-trend-title"
        className="h-auto w-full max-w-xs"
      >
        <title id="queue-trend-title">Emails newly queued per day, last 7 days</title>
        {DAILY_QUEUED.map((d, i) => {
          const h = Math.round((d.count / MAX_COUNT) * CHART_H * 100) / 100;
          const x = Math.round(i * (barWidth + BAR_GAP) * 100) / 100;
          const y = Math.round((CHART_H - h) * 100) / 100;
          return (
            <g key={d.day}>
              <rect x={x} y={y} width={barWidth} height={h} rx={3} className="fill-blue-500" />
              <text x={Math.round((x + barWidth / 2) * 100) / 100} y={CHART_H + 14} textAnchor="middle" className="fill-zinc-400 text-[9px]">
                {d.day}
              </text>
            </g>
          );
        })}
      </svg>
      <figcaption className="mt-2 max-w-prose text-xs font-normal leading-relaxed text-zinc-400">
        Queue volume climbed from 140/day Monday to 205/day Friday as the plan approached its cap.
      </figcaption>
    </figure>
  );
}

export default function BlockedEvidence() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_auto]">
      <div className="min-w-0">
        <p className="max-w-prose text-sm font-normal leading-relaxed text-zinc-400">
          Every email below is fully composed and addressed — it is sitting in the send queue, not lost, waiting
          for either your cycle to reset or more capacity.
        </p>
        <dl className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {BLOCKED_CATEGORIES.map((c) => (
            <div key={c.label} className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
              <dt className="flex items-center gap-1.5 text-xs font-medium text-zinc-400">
                <Inbox className="h-3.5 w-3.5 flex-none text-zinc-500" aria-hidden="true" />
                {c.label}
              </dt>
              <dd className="m-0 mt-1.5 text-2xl font-semibold tracking-tight tabular-nums text-zinc-50">{fmt(c.queued)}</dd>
              <dd className="m-0 mt-1 flex items-center gap-1 text-xs font-normal tabular-nums text-zinc-400">
                <Clock className="h-3 w-3 flex-none text-zinc-500" aria-hidden="true" />
                ~{c.avgDelayHours}h average delay
              </dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="flex-none lg:w-72">
        <QueueTrendChart />
      </div>
    </div>
  );
}
