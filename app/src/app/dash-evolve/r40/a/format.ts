/**
 * Manual, hand-rolled formatters only — deliberately not `Intl.NumberFormat({ notation: "compact" })`.
 * Node's SSR pass and the browser's hydration pass can disagree on trailing-zero trimming for the
 * exact same compact-notation number, which breaks hydration even though nothing here is random.
 * Every value this route renders is small enough that plain arithmetic + `toFixed` is both correct
 * and guaranteed identical on both passes.
 */

export function formatPercent(value: number): string {
  return `${value.toFixed(2)}%`;
}

export function formatMs(value: number): string {
  return `${value} ms`;
}

export function formatCount(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}
