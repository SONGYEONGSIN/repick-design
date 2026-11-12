/**
 * Plain `Intl.NumberFormat` only — no `notation: "compact"`. Compact notation can round trailing
 * digits differently between the server render and the browser's hydration pass for the same
 * number on some ICU builds, which breaks hydration even on fully deterministic data. Every
 * figure here is formatted the ordinary way, which is guaranteed identical on both passes.
 */

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const countFormatter = new Intl.NumberFormat("en-US");

export function formatCurrency(value: number): string {
  return currencyFormatter.format(value);
}

export function formatCount(value: number): string {
  return countFormatter.format(value);
}

export function formatPercent(value: number, digits = 1): string {
  return `${value.toFixed(digits)}%`;
}

export function formatSignedPercent(value: number, digits = 1): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(digits)}%`;
}

export function formatSigned(value: number, digits = 1): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(digits)}`;
}
