import type { MetricDef } from "./data";

// Standard (non-compact) Intl.NumberFormat only — `notation: "compact"` can disagree between the
// server's and the browser's ICU data and break hydration, so every formatter here stays on the
// plain numeric notation that both environments render identically.

export function formatNumber(value: number, decimals: number): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatMetricValue(metric: MetricDef, value: number): string {
  return `${formatNumber(value, metric.decimals)}${metric.unit === "%" ? "%" : ` ${metric.unit}`}`;
}

export function formatSignedMetricValue(metric: MetricDef, value: number): string {
  const sign = value >= 0 ? "+" : "−";
  return `${sign}${formatMetricValue(metric, Math.abs(value))}`;
}

export function formatRange(metric: MetricDef, low: number, high: number): string {
  return `${formatNumber(low, metric.decimals)}–${formatMetricValue(metric, high)}`;
}
