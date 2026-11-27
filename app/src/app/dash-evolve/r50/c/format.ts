import type { Direction, Experiment, MetricKey, MetricMeta, MetricResult, MetricSample } from "./types";

/* Formatting + derivation helpers. Pure functions only — no Math.random, no Date.now, no new Date(). */

const pctFormatter = new Intl.NumberFormat("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const intFormatter = new Intl.NumberFormat("en-US");

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function formatConversion(value: number): string {
  return `${pctFormatter.format(value)}%`;
}

export function formatLatency(value: number): string {
  return `${intFormatter.format(Math.round(value))}ms`;
}

export function formatErrorRate(value: number): string {
  return `${pctFormatter.format(value)}%`;
}

export function formatSignedPct(value: number): string {
  const sign = value > 0 ? "+" : value < 0 ? "" : "+";
  return `${sign}${pctFormatter.format(value)}%`;
}

export function formatUpdated(hoursAgo: number): string {
  if (hoursAgo < 1) return "Just now";
  if (hoursAgo < 24) return `${Math.round(hoursAgo)}h ago`;
  return `${Math.round(hoursAgo / 24)}d ago`;
}

export const METRICS: Record<MetricKey, MetricMeta> = {
  conversion: {
    key: "conversion",
    label: "Conversion rate",
    axisLabel: "Conversion",
    unit: "%",
    better: "higher",
    format: formatConversion,
  },
  latency: {
    key: "latency",
    label: "P95 checkout latency",
    axisLabel: "Latency",
    unit: "ms",
    better: "lower",
    format: formatLatency,
  },
  error: {
    key: "error",
    label: "Payment error rate",
    axisLabel: "Error rate",
    unit: "%",
    better: "lower",
    format: formatErrorRate,
  },
};

export const METRIC_ORDER: MetricKey[] = ["conversion", "latency", "error"];

/** The single source of truth for before/after → delta/pct/direction/significance. Never hand-typed twice. */
export function resolveMetric(sample: MetricSample, metric: MetricKey): MetricResult {
  const meta = METRICS[metric];
  const delta = round2(sample.after - sample.before);
  const pctChange = sample.before === 0 ? 0 : round2((delta / sample.before) * 100);
  const isGain = meta.better === "higher" ? delta >= 0 : delta <= 0;
  const direction: Direction = isGain ? "improved" : "regressed";
  const significant = Math.abs(pctChange) >= 5;
  return { before: sample.before, after: sample.after, delta, pctChange, direction, significant };
}

export function sampleFor(experiment: Experiment, metric: MetricKey): MetricSample {
  return experiment[metric];
}

/**
 * The worst (most negative, conversion-metric) regression across all experiments — the default
 * fallback for the pinned-experiment summary card so it never opens on an empty "select something"
 * placeholder. Deliberately pinned to conversion regardless of which metric the slope chart is
 * currently showing: the pin axis is independently scoped from the metric toggle (see page brief
 * guidance on not threading one selection through every widget).
 */
export function defaultPinnedId(experiments: Experiment[]): string {
  let worstId = experiments[0]?.id ?? "";
  let worstPct = Infinity;
  for (const exp of experiments) {
    const result = resolveMetric(exp.conversion, "conversion");
    if (result.direction === "regressed" && result.pctChange < worstPct) {
      worstPct = result.pctChange;
      worstId = exp.id;
    }
  }
  return worstId;
}
