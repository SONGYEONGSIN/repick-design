import type { ComponentType } from "react";
import { Fuel, Utensils, Sparkles, Luggage } from "lucide-react";
import type { TurnaroundFlight } from "./data";

const STAGE_ICON: Record<string, ComponentType<{ className?: string; "aria-hidden"?: boolean }>> = {
  급유: Fuel,
  기내식: Utensils,
  청소: Sparkles,
  수하물: Luggage,
};

const RADIUS = 40;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function TurnaroundGauge({ flt, gate, stages }: TurnaroundFlight) {
  const overall = Math.round(
    stages.reduce((sum, s) => sum + s.pct, 0) / stages.length
  );
  const offset = CIRCUMFERENCE * (1 - overall / 100);
  const gaugeId = `turnaround-${flt}`;

  return (
    <div className="rounded-lg border border-neutral-800 bg-neutral-900/50 p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="font-mono text-sm font-semibold text-neutral-200">
          {flt}
        </span>
        <span className="font-mono text-xs text-neutral-500">
          GATE {gate}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <svg
          viewBox="0 0 100 100"
          className="h-20 w-20 shrink-0 -rotate-90"
          role="img"
          aria-labelledby={gaugeId}
        >
          <title id={gaugeId}>{`회전 준비율 ${overall}%`}</title>
          <circle
            cx="50"
            cy="50"
            r={RADIUS}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="10"
          />
          <circle
            cx="50"
            cy="50"
            r={RADIUS}
            fill="none"
            stroke={overall >= 90 ? "#4ade9b" : "#ffb300"}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
          />
          <text
            x="50"
            y="55"
            textAnchor="middle"
            transform="rotate(90 50 50)"
            className="fill-neutral-100"
            style={{ font: "700 22px var(--font-mono, monospace)" }}
          >
            {overall}
          </text>
        </svg>

        <ul className="flex-1 space-y-2">
          {stages.map((stage) => {
            const Icon = STAGE_ICON[stage.label];
            return (
              <li key={stage.label} className="flex items-center gap-2">
                <Icon aria-hidden className="h-3.5 w-3.5 shrink-0 text-neutral-500" />
                <span className="w-12 shrink-0 text-[11px] text-neutral-400">
                  {stage.label}
                </span>
                <span
                  className="h-1.5 flex-1 overflow-hidden rounded-full bg-neutral-800"
                  role="progressbar"
                  aria-valuenow={stage.pct}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${stage.label} 진행률`}
                >
                  <span
                    className={`block h-full rounded-full ${
                      stage.pct >= 100 ? "bg-emerald-400" : "bg-amber-400"
                    }`}
                    style={{ width: `${stage.pct}%` }}
                  />
                </span>
                <span className="w-8 shrink-0 text-right text-[11px] tabular-nums text-neutral-500">
                  {stage.pct}%
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export function TurnaroundPanel({
  turnarounds,
}: {
  turnarounds: TurnaroundFlight[];
}) {
  return (
    <section
      id="turnaround"
      aria-labelledby="turnaround-heading"
      className="scroll-mt-24 rounded-lg border border-amber-500/10 bg-neutral-950 p-4"
    >
      <h2
        id="turnaround-heading"
        className="mb-4 font-mono text-sm font-bold tracking-[0.15em] text-neutral-200"
      >
        회전 준비율
      </h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {turnarounds.map((t) => (
          <TurnaroundGauge key={t.flt} {...t} />
        ))}
      </div>
    </section>
  );
}
