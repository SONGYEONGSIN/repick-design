"use client";

import { useState } from "react";
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, Pin } from "lucide-react";
import { METRICS, formatUsd, type Metric, type MetricId } from "./data";
import { Badge, Sparkline } from "./ui";

function formatAmount(m: Metric, value: number): string {
  return m.unit === "usd" ? formatUsd(value) : String(value);
}

function status(value: number, target: number): { label: string; tone: "lime" | "amber" | "rose"; icon: typeof CheckCircle2 } {
  const ratio = value / target;
  if (ratio <= 0.9) return { label: "On track", tone: "lime", icon: CheckCircle2 };
  if (ratio <= 1) return { label: "Near limit", tone: "amber", icon: AlertTriangle };
  return { label: "Over budget", tone: "rose", icon: AlertTriangle };
}

export function BulletGrid({
  pinnedMetricId,
  onPinMetric,
  period,
}: {
  pinnedMetricId: MetricId | null;
  onPinMetric: (id: MetricId) => void;
  period: "this-quarter" | "last-quarter";
}) {
  const [readoutId, setReadoutId] = useState<MetricId | null>(null);
  const readoutMetric = METRICS.find((m) => m.id === readoutId) ?? null;

  return (
    <div>
      <div className="mb-3 flex min-h-10 items-center rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-zinc-300">
        {readoutMetric ? (
          <span>
            <span className="font-medium text-zinc-50">{readoutMetric.label}</span> ·{" "}
            {formatAmount(readoutMetric, period === "this-quarter" ? readoutMetric.valueThisQuarter : readoutMetric.valueLastQuarter)}{" "}
            {period === "this-quarter" ? "this quarter vs" : "last quarter vs"}{" "}
            {formatAmount(readoutMetric, period === "this-quarter" ? readoutMetric.valueLastQuarter : readoutMetric.valueTwoQuartersAgo)}{" "}
            {period === "this-quarter" ? "last quarter" : "the quarter before"}
          </span>
        ) : (
          <span className="text-zinc-400">Hover or focus a metric for the quarter-over-quarter comparison.</span>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {METRICS.map((m) => {
          const pinned = m.id === pinnedMetricId;
          const displayValue = period === "this-quarter" ? m.valueThisQuarter : m.valueLastQuarter;
          const compareValue = period === "this-quarter" ? m.valueLastQuarter : m.valueTwoQuartersAgo;
          const sparklinePoints = period === "this-quarter" ? m.sparkline : m.sparklinePrior;
          const ratio = Math.min(displayValue / m.target, 1.3);
          const st = status(displayValue, m.target);
          const StatusIcon = st.icon;
          const up = displayValue > compareValue;
          const deltaPct = Math.round((Math.abs(displayValue - compareValue) / compareValue) * 100);
          const higherIsWorse = m.id !== "travel"; // travel increasing = healthy recovery, not overage
          const deltaTone = up === higherIsWorse ? "text-rose-300" : "text-lime-300";
          return (
            <button
              key={m.id}
              type="button"
              onMouseEnter={() => setReadoutId(m.id)}
              onMouseLeave={() => setReadoutId(null)}
              onFocus={() => setReadoutId(m.id)}
              onBlur={() => setReadoutId(null)}
              onClick={() => onPinMetric(m.id)}
              aria-pressed={pinned}
              className={`flex flex-col gap-3 rounded-xl border p-4 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-400 motion-reduce:transition-none ${
                pinned ? "border-lime-400/60 bg-lime-400/5" : "border-white/10 bg-zinc-900 hover:bg-zinc-800"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-medium uppercase tracking-wide text-zinc-400">{m.label}</span>
                {pinned ? <Pin className="h-3.5 w-3.5 shrink-0 text-lime-300" aria-hidden="true" /> : null}
              </div>

              <div className="flex items-baseline justify-between gap-2">
                <span className="text-2xl font-semibold tabular-nums text-zinc-50">{formatAmount(m, displayValue)}</span>
                <span className={`flex items-center gap-1 text-xs font-medium tabular-nums ${deltaTone}`}>
                  {up ? <TrendingUp className="h-3 w-3" aria-hidden="true" /> : <TrendingDown className="h-3 w-3" aria-hidden="true" />}
                  {deltaPct}%
                </span>
              </div>

              <div className="relative h-2 rounded-full bg-white/10">
                <div
                  className={`h-2 rounded-full ${ratio > 1 ? "bg-rose-400" : "bg-lime-400"}`}
                  style={{ width: `${Math.min(ratio, 1) * 100}%` }}
                />
                <span
                  className="absolute -top-1 h-4 w-px bg-zinc-50/70"
                  style={{ left: `${Math.min(1 / 1.3, 1) * 100}%` }}
                  aria-hidden="true"
                />
              </div>

              <div className="flex items-center justify-between gap-2">
                <Badge tone={st.tone}>
                  <StatusIcon className="h-3 w-3" aria-hidden="true" />
                  {st.label}
                </Badge>
                <span className="text-xs text-zinc-400">of {formatAmount(m, m.target)} target</span>
              </div>

              <div className="text-lime-300/80">
                <Sparkline points={sparklinePoints} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
