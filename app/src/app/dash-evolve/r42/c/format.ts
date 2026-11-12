import type { SecondaryMetric } from "./data";

const pctFormatter = new Intl.NumberFormat("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const intFormatter = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
const usdFormatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const oneDecimalFormatter = new Intl.NumberFormat("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

/** Non-compact grouped integer formatting (e.g. "48,210"). Deliberately never uses
 *  `notation: "compact"` — Node's ICU and browser ICU can disagree on compact trailing-zero
 *  behavior even with fully deterministic input, which would cause a hydration mismatch here. */
export function formatCount(value: number): string {
  return intFormatter.format(value);
}

export function formatPct(value: number): string {
  return `${pctFormatter.format(value)}%`;
}

export function formatSignedPct(value: number): string {
  const sign = value > 0 ? "+" : value < 0 ? "−" : "";
  return `${sign}${pctFormatter.format(Math.abs(value))}%`;
}

export function formatUsd(value: number): string {
  return usdFormatter.format(value);
}

export function formatSecondaryValue(metric: SecondaryMetric, value: number): string {
  if (metric.unit === "pct") return formatPct(value);
  if (metric.unit === "usd") return formatUsd(value);
  if (metric.unit === "min") return `${oneDecimalFormatter.format(value)}m`;
  return oneDecimalFormatter.format(value);
}
