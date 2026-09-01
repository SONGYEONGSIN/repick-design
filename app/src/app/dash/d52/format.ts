// Formatting helpers. No `new Date()` anywhere: `Intl.DateTimeFormat.format()` accepts a raw
// millisecond timestamp directly, so date labels are derived from literal numeric offsets off a
// fixed epoch constant instead of ever constructing a Date object.

/** 2025-01-01T00:00:00.000Z, as a literal constant (not computed via `new Date()`). */
export const BASE_MS = 1735689600000;
export const DAY_MS = 86400000;

export function dayLabel(dayIndex: number): string {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(
    BASE_MS + dayIndex * DAY_MS
  );
}

export function dayLabelLong(dayIndex: number): string {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(
    BASE_MS + dayIndex * DAY_MS
  );
}

const krwCompact = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "KRW",
  notation: "compact",
  maximumFractionDigits: 1,
});

const krwFull = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "KRW",
  maximumFractionDigits: 0,
});

const pctFmt = new Intl.NumberFormat("en-US", {
  style: "percent",
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
  signDisplay: "always",
});

const pctPlain = new Intl.NumberFormat("en-US", {
  style: "percent",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/** Compact currency for tight spaces: watchlist rows, stat strip, comp table — e.g. "₩184.5M". */
export function fmtCompact(krw: number): string {
  return krwCompact.format(krw);
}

/** Full precision, used only where width is not constrained (crosshair tooltip). */
export function fmtFull(krw: number): string {
  return krwFull.format(krw);
}

/** Signed percent, e.g. "+2.4%" / "-1.8%". */
export function fmtSignedPct(fraction: number): string {
  return pctFmt.format(fraction);
}

/** Unsigned percent for confidence scores, e.g. "94%". */
export function fmtPct(fraction: number): string {
  return pctPlain.format(fraction);
}

export function round(n: number, step: number): number {
  return Math.round(n / step) * step;
}
