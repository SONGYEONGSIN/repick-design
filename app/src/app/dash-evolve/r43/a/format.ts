// Formatting helpers. Deliberately avoids `Intl.NumberFormat({ notation: "compact" })` — ICU
// version skew between the Node SSR pass and the browser's own ICU can render the same number
// differently ("12.5K" vs "13K"), which is a hydration mismatch. Every number here stays under
// 25,000, so there is no need for any abbreviation at all — plain grouped digits read fine.

const numberFormatter = new Intl.NumberFormat("en-US");
const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function formatNumber(value: number): string {
  return numberFormatter.format(value);
}

export function formatCurrency(value: number): string {
  return currencyFormatter.format(value);
}

export function formatPercent(value: number, digits = 1): string {
  return `${value.toFixed(digits)}%`;
}
