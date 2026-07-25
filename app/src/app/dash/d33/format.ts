/**
 * Formatting utilities. Dates are parsed from 'YYYY-MM-DD' ISO strings anchored to UTC
 * so server (UTC) and client (local tz) renders never diverge (hydration-safe).
 * Currency renders in Pretendard (the global font-sans), which has a ₩ glyph, paired with
 * tabular-nums (Geist Mono has no ₩ glyph, so amounts never use mono).
 */

const numberFormatter = new Intl.NumberFormat("en-US");

export function parseISODate(iso: string): Date {
  return new Date(`${iso}T00:00:00.000Z`);
}

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

export function formatDate(iso: string): string {
  return dateFormatter.format(parseISODate(iso));
}

export function formatNumber(value: number): string {
  return numberFormatter.format(value);
}

/** Compact currency notation: ₩1.1B / ₩9.6M / ₩9,600 */
export function formatKRWCompact(value: number): string {
  if (value >= 1_000_000_000) {
    const billions = Math.round((value / 1_000_000_000) * 10) / 10;
    return `₩${billions % 1 === 0 ? billions.toFixed(0) : billions.toFixed(1)}B`;
  }
  if (value >= 1_000_000) {
    const millions = Math.round((value / 1_000_000) * 10) / 10;
    return `₩${millions % 1 === 0 ? millions.toFixed(0) : millions.toFixed(1)}M`;
  }
  return `₩${numberFormatter.format(value)}`;
}

const MS_PER_DAY = 1000 * 60 * 60 * 24;

export function dayDiff(fromISO: string, toISO: string): number {
  const from = parseISODate(fromISO).getTime();
  const to = parseISODate(toISO).getTime();
  return Math.round((to - from) / MS_PER_DAY);
}

/** D-day label relative to today (todayISO). */
export function formatDday(todayISO: string, dueISO: string): string {
  const diff = dayDiff(todayISO, dueISO);
  if (diff === 0) return "D-DAY";
  if (diff > 0) return `D-${diff}`;
  return `D+${Math.abs(diff)}`;
}

export function clampPercent(value: number, max = 100): number {
  return Math.max(0, Math.min(max, value));
}

/** Round to 2 decimal places — keeps SVG coordinates hydration-stable. */
export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
