import { weekEndDate, weekStartDate } from "./sim";

// Plain (non-compact) Intl formatters only. `notation: "compact"` can disagree between the
// server's and the browser's ICU data for the exact same input, which breaks hydration even
// with zero randomness involved — so every number on this route is formatted with a formatter
// that has no such ambiguity.
const INT_FORMAT = new Intl.NumberFormat("en-US");
const MONTH_DAY_FORMAT = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });

export function formatInt(value: number): string {
  return INT_FORMAT.format(value);
}

export function formatSignedInt(value: number): string {
  if (value === 0) return "+0";
  const sign = value > 0 ? "+" : "−";
  return `${sign}${INT_FORMAT.format(Math.abs(value))}`;
}

export function formatPercent(value: number): string {
  return `${INT_FORMAT.format(value)}%`;
}

export function formatWeekShort(index: number): string {
  return MONTH_DAY_FORMAT.format(weekStartDate(index));
}

export function formatWeekRange(index: number): string {
  return `${MONTH_DAY_FORMAT.format(weekStartDate(index))}–${MONTH_DAY_FORMAT.format(weekEndDate(index))}`;
}
