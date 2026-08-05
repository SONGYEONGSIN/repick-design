// app/src/app/blog-evolve/r2/b/metric-panel.tsx
//
// The structural device this candidate is built around: every report surfaces its headline number
// and a baseline-vs-result comparison bar directly in the index, so a reader can judge the finding
// without opening the report. Rendered as inline SVG bars (deterministic, no remote asset) rather
// than a photographic "cover" — for a benchmark journal the evidence *is* the visual.
import { TrendingDown, TrendingUp } from "lucide-react";
import { metricDelta, type Metric } from "./data";

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function formatValue(v: number, unit: Metric["unit"]): string {
  if (unit === "x") return `${v}x`;
  if (unit === "%") return `${v}%`;
  return `${v}ms`;
}

export function MetricStat({ metric }: { metric: Metric }) {
  const { value, improved } = metricDelta(metric);
  const Icon = value <= 0 ? TrendingDown : TrendingUp;
  const sign = value > 0 ? "+" : "";
  return (
    <div className="flex items-baseline gap-2">
      <span
        className="text-3xl font-semibold tabular-nums text-emerald-400 sm:text-4xl"
        style={{ fontFamily: "var(--font-display-mono)" }}
      >
        {sign}
        {value}%
      </span>
      <span className="inline-flex items-center gap-1 text-xs font-medium text-zinc-400">
        <Icon aria-hidden="true" className="h-3.5 w-3.5" />
        {improved ? "improvement" : "regression"}
      </span>
    </div>
  );
}

/** Two-bar baseline-vs-result comparison, scaled to the larger of the two values. */
export function MetricBars({ metric }: { metric: Metric }) {
  const domain = Math.max(metric.baseline, metric.result, 1);
  const baselinePct = round2((metric.baseline / domain) * 100);
  const resultPct = round2((metric.result / domain) * 100);

  return (
    <dl className="mt-3 space-y-1.5">
      <div className="flex items-center gap-2 text-xs text-zinc-400">
        <dt className="w-14 shrink-0">Baseline</dt>
        <dd className="min-w-0 flex-1">
          <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800">
            <div className="h-full rounded-full bg-zinc-500" style={{ width: `${baselinePct}%` }} />
          </div>
        </dd>
        <dd className="w-16 shrink-0 text-right tabular-nums text-zinc-300">{formatValue(metric.baseline, metric.unit)}</dd>
      </div>
      <div className="flex items-center gap-2 text-xs text-zinc-400">
        <dt className="w-14 shrink-0">Result</dt>
        <dd className="min-w-0 flex-1">
          <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800">
            <div className="h-full rounded-full bg-emerald-400" style={{ width: `${resultPct}%` }} />
          </div>
        </dd>
        <dd className="w-16 shrink-0 text-right tabular-nums text-zinc-300">{formatValue(metric.result, metric.unit)}</dd>
      </div>
    </dl>
  );
}
