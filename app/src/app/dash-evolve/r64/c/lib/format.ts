// Deterministic formatting helpers. Every input is a plain number already stored in lib/data —
// nothing here reads the clock (no Date.now(), no new Date()), so server and client render the
// identical string on every pass.

/** Shared integer formatter — plain grouping, no compact notation, so there is no
 * trailingZeroDisplay hydration hazard to manage. */
export const INT_FMT = new Intl.NumberFormat("en-US");

export const PERCENT_FMT = new Intl.NumberFormat("en-US", { style: "percent", maximumFractionDigits: 0 });

/** `burn` is already a 0-100 integer percent (see `slaBurnPercent`); this just routes it through
 * the shared formatter instead of a hand-rolled `${n}%` string. */
export function formatPercent(wholePercent: number): string {
  return PERCENT_FMT.format(wholePercent / 100);
}

/** "4m" / "2h" / "3d" — coarsest unit that keeps the label short, always derived from a fixed
 * `ageMinutes` field on the record, never from wall-clock time. */
export function formatAge(ageMinutes: number): string {
  if (ageMinutes < 60) return `${INT_FMT.format(ageMinutes)}m`;
  const hours = ageMinutes / 60;
  if (hours < 24) return `${INT_FMT.format(Math.round(hours))}h`;
  const days = hours / 24;
  return `${INT_FMT.format(Math.round(days))}d`;
}

/** "1h 20m" style duration, used for SLA targets and queue-time averages. */
export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  if (h === 0) return `${INT_FMT.format(m)}m`;
  if (m === 0) return `${INT_FMT.format(h)}h`;
  return `${INT_FMT.format(h)}h ${INT_FMT.format(m)}m`;
}
