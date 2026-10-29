// native/src/evolve/r43/b/data.ts
// Deterministic dummy data + pure date-math helpers for the Return Window
// Extension Request screen. There is no live clock anywhere in this screen:
// "now" and the order's purchase/deadline timestamps are fixed literal
// millisecond values (via Date.UTC with explicit arguments), never a bare
// `new Date()` or `Date.now()`. Every remaining-time / extended-deadline
// figure the component shows is re-derived from these fixed numbers on each
// render, so nothing needs manual "clearing" the way a one-off transient
// announcement does.

const DAY_MS = 24 * 60 * 60 * 1000;
const HOUR_MS = 60 * 60 * 1000;

const WEEKDAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

// Manual, locale-independent formatting — toLocaleDateString's output can
// vary by runtime/ICU data, which would make the rendered copy
// non-deterministic across environments even though the underlying
// timestamp is fixed.
export function formatDateLabel(ts: number): string {
  const d = new Date(ts);
  const weekday = WEEKDAY_NAMES[d.getUTCDay()];
  const month = MONTH_NAMES[d.getUTCMonth()];
  const day = d.getUTCDate();
  const year = d.getUTCFullYear();
  return `${weekday}, ${month} ${day}, ${year}`;
}

export function formatTimeLabel(ts: number): string {
  const d = new Date(ts);
  let hours = d.getUTCHours();
  const minutes = d.getUTCMinutes();
  const suffix = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  if (hours === 0) hours = 12;
  const minuteLabel = minutes < 10 ? `0${minutes}` : `${minutes}`;
  return `${hours}:${minuteLabel} ${suffix}`;
}

export type RemainingTime = {
  /** true once the deadline has already passed relative to the reference "now" */
  passed: boolean;
  days: number;
  hours: number;
};

export function computeRemaining(nowTs: number, deadlineTs: number): RemainingTime {
  const diff = deadlineTs - nowTs;
  const passed = diff <= 0;
  const abs = Math.abs(diff);
  return {
    passed,
    days: Math.floor(abs / DAY_MS),
    hours: Math.floor((abs % DAY_MS) / HOUR_MS),
  };
}

// Fixed "now" this screen renders against — Tuesday, Oct 27 2026, 9:00am UTC.
export const NOW_TS = Date.UTC(2026, 9, 27, 9, 0);

export const ORDER = {
  id: "R-48217",
  itemTitle: "Wool Overcoat, Size M",
  price: "$128.00",
  purchasedTs: Date.UTC(2026, 9, 13, 0, 0), // Oct 13, 2026
};

export const RETURN_WINDOW_DAYS = 17;

// Deadline = purchase + policy window, ending at 23:59 on that calendar day.
export const ORIGINAL_DEADLINE_TS =
  ORDER.purchasedTs + RETURN_WINDOW_DAYS * DAY_MS + (23 * 60 + 59) * 60 * 1000;

export const MIN_REASON_LENGTH = 20;

export type ExtensionDays = 3 | 5 | 7 | 10;
export const EXTENSION_OPTIONS: ExtensionDays[] = [3, 5, 7, 10];
export const DEFAULT_EXTENSION_DAYS: ExtensionDays = 5;

export function addDays(ts: number, days: number): number {
  return ts + days * DAY_MS;
}
