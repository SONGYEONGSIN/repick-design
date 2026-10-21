/** Plain `Intl` formatters only — no `notation: "compact"` (rounds differently between the
 *  server render and the hydration pass on some ICU builds), no `Math.random`, no clock reads. */

const numberFormatter = new Intl.NumberFormat("en-US");

export function formatMs(value: number): string {
  return `${numberFormatter.format(Math.round(value))} ms`;
}

export function formatPercent(value: number, digits = 2): string {
  return `${value.toFixed(digits)}%`;
}

export function formatMinutes(value: number): string {
  return `${Math.round(value)}m`;
}
