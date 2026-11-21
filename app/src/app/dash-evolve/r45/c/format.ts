// Formatting helpers. Deliberately avoid Intl.NumberFormat's `notation: "compact"`
// — ICU output for compact notation can differ between the Node SSR pass and the
// browser, a documented hydration-mismatch trap. Everything else uses full
// (non-compact) Intl formatting or a hand-rolled, deterministic function.

const countFormatter = new Intl.NumberFormat("en-US");
const percentFormatter0 = new Intl.NumberFormat("en-US", { style: "percent", maximumFractionDigits: 0 });

export function formatCount(n: number): string {
  return countFormatter.format(n);
}

export function formatShare(numerator: number, denominator: number): string {
  if (denominator === 0) return percentFormatter0.format(0);
  return percentFormatter0.format(numerator / denominator);
}

/** Pure function of a fixed "minutes ago" integer — never Date.now()/new Date(). */
export function formatAgo(ageMinutes: number): string {
  if (ageMinutes < 1) return "just now";
  if (ageMinutes < 60) return `${ageMinutes}m ago`;
  if (ageMinutes < 1440) return `${Math.round(ageMinutes / 60)}h ago`;
  return `${Math.round(ageMinutes / 1440)}d ago`;
}

/** Deterministic 2-decimal rounding for every computed SVG coordinate/angle. */
export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
