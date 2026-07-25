/**
 * Date/number formatting utilities.
 * All dates are stored as 'YYYY-MM-DD' ISO strings and parsed with a UTC anchor.
 * We pin timeZone: 'UTC' on Intl.DateTimeFormat so the server (UTC) and client
 * (local tz) render the same output, avoiding hydration mismatches.
 */

export function parseISODate(iso: string): Date {
  return new Date(`${iso}T00:00:00.000Z`);
}

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

const dateFormatterWithWeekday = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  weekday: "short",
  timeZone: "UTC",
});

const numberFormatter = new Intl.NumberFormat("en-US");

export function formatDate(iso: string): string {
  return dateFormatter.format(parseISODate(iso));
}

export function formatDateLong(iso: string): string {
  return dateFormatterWithWeekday.format(parseISODate(iso));
}

export function formatNumber(value: number): string {
  return numberFormatter.format(value);
}

const MS_PER_DAY = 1000 * 60 * 60 * 24;

export function dayDiff(fromISO: string, toISO: string): number {
  const from = parseISODate(fromISO).getTime();
  const to = parseISODate(toISO).getTime();
  return Math.round((to - from) / MS_PER_DAY);
}

/** D-day label relative to today (TODAY_ISO). */
export function formatDday(todayISO: string, dueISO: string): string {
  const diff = dayDiff(todayISO, dueISO);
  if (diff === 0) return "D-DAY";
  if (diff > 0) return `D-${diff}`;
  return `D+${Math.abs(diff)}`;
}

export function clampPercent(value: number, max = 100): number {
  return Math.max(0, Math.min(max, value));
}
