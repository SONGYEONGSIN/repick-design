import type { Unit } from "./data";

/**
 * Plain (non-compact) number/percent formatting goes through
 * Intl.NumberFormat — that path is consistent across runtimes.
 *
 * Compact currency ("$2.84M") deliberately does NOT use
 * Intl.NumberFormat's `notation: "compact"` at all. That path's trailing-
 * zero trimming differs between Node's ICU (server render) and Chromium's
 * ICU (client hydration) — e.g. the same 3_200_000 value came back as
 * "$3.2M" on the server and "$3.20M" on the client, a hydration mismatch on
 * every bullet card. `formatCurrencyCompact` below hand-rolls the K/M/B
 * suffix with plain arithmetic and `Number.prototype.toFixed`, which is a
 * fixed ECMAScript algorithm (not ICU-backed) and therefore identical on
 * every JS engine, Node or Chromium alike.
 */

const plainInteger = new Intl.NumberFormat("en-US");
const plainCurrency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

/** Strips trailing zeros after a decimal point, and the point itself if nothing follows it. */
function trimTrailingZeros(numeric: string): string {
  if (!numeric.includes(".")) return numeric;
  return numeric.replace(/0+$/, "").replace(/\.$/, "");
}

export function formatCurrencyCompact(value: number): string {
  if (value === 0) return "$0";

  const sign = value < 0 ? "-" : "";
  const abs = Math.abs(value);

  let divisor = 1;
  let suffix = "";
  if (abs >= 1_000_000_000) {
    divisor = 1_000_000_000;
    suffix = "B";
  } else if (abs >= 1_000_000) {
    divisor = 1_000_000;
    suffix = "M";
  } else if (abs >= 1_000) {
    divisor = 1_000;
    suffix = "K";
  } else {
    return `${sign}${plainCurrency.format(abs)}`;
  }

  const digits = trimTrailingZeros((abs / divisor).toFixed(2));
  return `${sign}$${digits}${suffix}`;
}

export function formatCount(value: number): string {
  return plainInteger.format(value);
}

export function formatPercent(value: number): string {
  return `${plainInteger.format(Math.round(value))}%`;
}

export function formatScore(value: number): string {
  return plainInteger.format(value);
}

/** Formats a goal's headline current/target value per its unit, no suffix. */
export function formatByUnit(value: number, unit: Unit, countSuffix?: string): string {
  switch (unit) {
    case "currency":
      return formatCurrencyCompact(value);
    case "percent":
      return formatPercent(value);
    case "count":
      return `${formatCount(value)}${countSuffix ?? ""}`;
    case "score":
      return formatScore(value);
  }
}

/** Formats a breakdown row value, which carries its own unit independent of the parent goal's unit. */
export function formatBreakdownValue(value: number, unit: "currency" | "count"): string {
  return unit === "currency" ? formatCurrencyCompact(value) : formatCount(value);
}

export function formatAchievement(value: number): string {
  return `${plainInteger.format(Math.round(value))}%`;
}
