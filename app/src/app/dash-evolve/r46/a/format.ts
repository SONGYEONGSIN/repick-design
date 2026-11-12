/**
 * Plain `Intl.NumberFormat` only — no `notation: "compact"` anywhere on this route. Compact
 * notation can trim trailing zeros differently between the server render and the browser's
 * hydration pass for the same number (ICU version skew), which breaks hydration even when every
 * input number is fully deterministic. Every figure here is formatted the ordinary way instead,
 * which renders identically on both passes.
 */

const countFormatter = new Intl.NumberFormat("en-US");

export function formatCount(value: number): string {
  return countFormatter.format(value);
}

export function formatRank(rank: number): string {
  return `#${rank}`;
}

export function formatSignedSpots(delta: number): string {
  if (delta === 0) return "No change";
  const sign = delta > 0 ? "+" : "";
  const noun = Math.abs(delta) === 1 ? "spot" : "spots";
  return `${sign}${delta} ${noun}`;
}
