/**
 * Manual, hand-rolled formatters only — deliberately not
 * `Intl.NumberFormat({ notation: "compact" })`. SSR and the browser's hydration
 * pass can disagree on compact-notation trailing-zero trimming for the exact
 * same number, which breaks hydration. Every value this route renders fits
 * comfortably in plain grouped digits, so there is no need to compact anything.
 */

const GROUP_FORMAT = new Intl.NumberFormat("en-US");

export function formatCurrency(value: number): string {
  return `$${GROUP_FORMAT.format(Math.round(value))}`;
}

export function formatSignedCurrency(value: number): string {
  const rounded = Math.round(value);
  const sign = rounded >= 0 ? "+" : "−";
  return `${sign}$${GROUP_FORMAT.format(Math.abs(rounded))}`;
}

export function formatPercent1(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function formatSignedPercent1(value: number): string {
  const sign = value >= 0 ? "+" : "−";
  return `${sign}${Math.abs(value).toFixed(1)}%`;
}

export function round2(value: number): number {
  return Math.round(value * 100) / 100;
}
