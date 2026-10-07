import type { MetricId } from "./data";

/**
 * Hand-rolled number formatting — deliberately NOT `Intl.NumberFormat`'s
 * compact notation. That path's trailing-zero trimming differs between
 * Node's ICU (server render) and Chromium's ICU (client hydration), which
 * is a hydration-mismatch risk this catalog has already hit twice. These
 * values never need K/M/B suffixes anyway (all under ~1,100), so plain
 * arithmetic + manual thousands separators is both simpler and safe.
 */
export function formatInt(n: number): string {
  const negative = n < 0;
  const digits = Math.abs(Math.round(n)).toString();
  const withCommas = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return negative ? `-${withCommas}` : withCommas;
}

export function formatValue(metric: MetricId, value: number): string {
  if (metric === "error-rate") return `${value.toFixed(2)}%`;
  if (metric === "latency") return `${formatInt(value)} ms`;
  return `${formatInt(value)} req/s`;
}

export function formatCompactValue(metric: MetricId, value: number): string {
  if (metric === "error-rate") return `${value.toFixed(2)}%`;
  if (metric === "latency") return `${formatInt(value)}ms`;
  return `${formatInt(value)}/s`;
}

export function formatDelta(pct: number): string {
  const sign = pct > 0 ? "+" : pct < 0 ? "−" : "";
  return `${sign}${Math.abs(pct)}%`;
}
