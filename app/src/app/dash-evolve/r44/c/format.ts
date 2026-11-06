// Formatting helpers. Deliberately avoid Intl.NumberFormat's `notation: "compact"` —
// ICU output for compact notation can differ between the Node SSR pass and the
// browser, a documented hydration-mismatch trap. Everything else uses full
// (non-compact) Intl formatting or a hand-rolled, deterministic function.

const countFormatter = new Intl.NumberFormat("en-US");
const percentFormatter2 = new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const percentFormatter0 = new Intl.NumberFormat("en-US", { style: "percent", maximumFractionDigits: 0 });

export function formatCount(n: number): string {
  return countFormatter.format(n);
}

export function formatMs(n: number): string {
  return `${countFormatter.format(Math.round(n))} ms`;
}

export function formatUptime(n: number): string {
  return `${percentFormatter2.format(n)}%`;
}

export function formatUptimeFraction(n: number): string {
  return percentFormatter0.format(n / 100);
}

export function formatSignedMs(n: number): string {
  const rounded = Math.round(n);
  const sign = rounded > 0 ? "+" : rounded < 0 ? "−" : "±";
  return `${sign}${Math.abs(rounded)} ms`;
}

/** Pure function of a fixed "minutes ago" integer — never Date.now()/new Date(). */
export function formatAgo(ageMinutes: number): string {
  if (ageMinutes < 1) return "just now";
  if (ageMinutes < 60) return `${ageMinutes}m ago`;
  if (ageMinutes < 1440) return `${Math.round(ageMinutes / 60)}h ago`;
  return `${Math.round(ageMinutes / 1440)}d ago`;
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest === 0 ? `${hours}h` : `${hours}h ${rest}m`;
}
