/** Formatting utilities — Intl only, no wall-clock reads. */

const INT_FMT = new Intl.NumberFormat("en-US");
const PCT1_FMT = new Intl.NumberFormat("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

export function formatInt(n: number): string {
  return INT_FMT.format(n);
}

export function formatMs(n: number): string {
  return `${INT_FMT.format(Math.round(n))}ms`;
}

export function formatPct(n: number, digits: 0 | 1 = 1): string {
  return digits === 1 ? `${PCT1_FMT.format(n)}%` : `${Math.round(n)}%`;
}

export function formatRps(n: number): string {
  return `${INT_FMT.format(n)} req/s`;
}
