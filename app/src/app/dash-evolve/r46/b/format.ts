/**
 * Plain `Intl.NumberFormat` only — no `notation: "compact"`, which can round trailing digits
 * differently between the server render and the browser's hydration pass for the same number on
 * some ICU builds. Every figure here formats the ordinary way, identical on both passes.
 */

const countFormatter = new Intl.NumberFormat("en-US");

export function formatCount(value: number): string {
  return countFormatter.format(Math.round(value));
}

export function formatPercent(value: number, digits = 1): string {
  return `${value.toFixed(digits)}%`;
}

export function formatSignedPercent(value: number, digits = 1): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(digits)}%`;
}

export function formatSigned(value: number, digits = 0): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(digits)}`;
}
