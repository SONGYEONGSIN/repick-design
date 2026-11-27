// Formatting helpers. Deliberately avoid Intl.NumberFormat's `notation: "compact"` —
// ICU compact output can differ between the Node SSR pass and the browser, a
// documented hydration-mismatch trap. Everything else is full (non-compact) Intl
// formatting or a hand-rolled, deterministic function.

const usdFormatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const usdSignedFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
  signDisplay: "exceptZero",
});
const countFormatter = new Intl.NumberFormat("en-US");

export function formatUsd(n: number): string {
  return usdFormatter.format(n);
}

export function formatUsdSigned(n: number): string {
  return usdSignedFormatter.format(n);
}

export function formatCount(n: number): string {
  return countFormatter.format(n);
}

/** Signed percentage with a fixed one decimal place. Uses "±" only for an exact
 *  zero, matching the convention used across this catalog's delta indicators. */
export function formatPctSigned(n: number): string {
  const rounded = Math.round(n * 10) / 10;
  const sign = rounded > 0 ? "+" : rounded < 0 ? "−" : "±";
  return `${sign}${Math.abs(rounded).toFixed(1)}%`;
}

export function formatPctPlain(n: number): string {
  return `${Math.abs(Math.round(n * 10) / 10).toFixed(1)}%`;
}
