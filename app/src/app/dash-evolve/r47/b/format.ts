/** Plain `Intl` formatters only — no `notation: "compact"` (rounds differently between the
 *  server render and the hydration pass on some ICU builds), no `Math.random`, no clock reads. */

const countFormatter = new Intl.NumberFormat("en-US");
const msFormatter = new Intl.NumberFormat("en-US");

export function formatCount(value: number): string {
  return countFormatter.format(Math.round(value));
}

export function formatMs(value: number): string {
  return `${msFormatter.format(Math.round(value))} ms`;
}

export function formatPercent(value: number, digits = 2): string {
  return `${value.toFixed(digits)}%`;
}

export function formatSignedPercent(value: number, digits = 1): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(digits)}%`;
}

export function formatMinutes(value: number): string {
  return `${Math.round(value)}m`;
}
