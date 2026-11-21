// Formatting helpers. Deliberately avoid Intl.NumberFormat's `notation: "compact"` —
// ICU output for compact notation can differ between the Node SSR pass and the
// browser, which is a documented hydration-mismatch trap. Everything here either
// uses full (non-compact) Intl formatting or a hand-rolled, deterministic function.

const countFormatter = new Intl.NumberFormat("en-US");
const percentFormatter0 = new Intl.NumberFormat("en-US", { style: "percent", maximumFractionDigits: 0 });
const percentFormatter1 = new Intl.NumberFormat("en-US", { style: "percent", maximumFractionDigits: 1 });

export function formatCount(n: number): string {
  return countFormatter.format(n);
}

export function formatSharePct(count: number, total: number): string {
  return percentFormatter1.format(count / total);
}

export function formatCoveragePct(decimal: number): string {
  return percentFormatter0.format(decimal);
}

export function formatSignedScore(n: number): string {
  const rounded = Math.round(n);
  return rounded > 0 ? `+${rounded}` : `${rounded}`;
}

export function formatSignedDelta(n: number, digits = 0): string {
  const sign = n > 0 ? "+" : n < 0 ? "−" : "±";
  return `${sign}${Math.abs(n).toFixed(digits)}`;
}

export function formatHours(h: number): string {
  return `${h.toFixed(1)}h`;
}

/** Pure function of a fixed "hours ago" integer — never Date.now(). */
export function formatHoursAgo(hoursAgo: number): string {
  if (hoursAgo < 1) return "just now";
  if (hoursAgo < 24) return `${hoursAgo}h ago`;
  const days = Math.round(hoursAgo / 24);
  return `${days}d ago`;
}
