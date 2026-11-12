/**
 * All formatting goes through Intl, fed with plain numbers derived from fixed offsets —
 * never Date.now()/new Date(). REFERENCE_NOW_MS is the dashboard's fixed "now" anchor;
 * Intl.DateTimeFormat#format and Intl.RelativeTimeFormat#format both accept a plain epoch
 * number, so no Date object is ever constructed.
 */

import { REFERENCE_NOW_MS } from "./data";

const hoursFormatter = new Intl.NumberFormat("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const percentFormatter = new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 });
const integerFormatter = new Intl.NumberFormat("en-US");
const relativeFormatter = new Intl.RelativeTimeFormat("en-US", { numeric: "auto" });
const absoluteFormatter = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });

export function formatHours(hours: number): string {
  return `${hoursFormatter.format(hours)}h`;
}

export function formatPercent(value: number): string {
  return `${percentFormatter.format(value)}%`;
}

export function formatCount(value: number): string {
  return integerFormatter.format(value);
}

export function formatRelative(offsetMinutes: number): string {
  if (offsetMinutes < 60) {
    return relativeFormatter.format(-Math.round(offsetMinutes), "minute");
  }
  if (offsetMinutes < 1440) {
    return relativeFormatter.format(-Math.round(offsetMinutes / 60), "hour");
  }
  return relativeFormatter.format(-Math.round(offsetMinutes / 1440), "day");
}

export function formatAbsolute(offsetMinutes: number): string {
  const epochMs = REFERENCE_NOW_MS - offsetMinutes * 60000;
  return absoluteFormatter.format(epochMs);
}
