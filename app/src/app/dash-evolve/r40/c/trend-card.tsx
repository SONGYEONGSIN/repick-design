import { TrendingUp } from "lucide-react";
import { ESCALATION_TREND } from "./data";

const WIDTH = 220;
const HEIGHT = 48;
const PAD = 4;

function round(v: number): number {
  return Math.round(v * 100) / 100;
}

function buildPoints(values: number[]): string {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  return values
    .map((v, i) => {
      const x = round(PAD + (i / (values.length - 1)) * (WIDTH - PAD * 2));
      const y = round(HEIGHT - PAD - ((v - min) / span) * (HEIGHT - PAD * 2));
      return `${x},${y}`;
    })
    .join(" ");
}

export default function TrendCard() {
  const points = buildPoints(ESCALATION_TREND);
  const current = ESCALATION_TREND[ESCALATION_TREND.length - 1]!;
  const previous = ESCALATION_TREND[ESCALATION_TREND.length - 2]!;
  const delta = round(current - previous);

  return (
    <div className="flex h-full flex-col rounded-xl border border-white/10 bg-zinc-900 p-4">
      <div className="flex items-center gap-2">
        <TrendingUp className="h-4 w-4 shrink-0 text-cyan-400" aria-hidden="true" />
        <p className="font-medium text-xs text-zinc-400 uppercase tracking-wide">Escalation rate — 7wk trend</p>
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <p className="font-semibold text-lg text-zinc-50 tabular-nums">{current.toFixed(1)}%</p>
        <p className="font-normal text-xs text-zinc-400 tabular-nums">
          {delta >= 0 ? "+" : ""}
          {delta.toFixed(1)}pt vs last week
        </p>
      </div>
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="mt-2 h-10 w-full" aria-hidden="true">
        <polyline points={points} fill="none" stroke="#22d3ee" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
      </svg>
      <p className="font-normal text-xs text-zinc-400">Share of investigated tickets escalated, weekly.</p>
    </div>
  );
}
