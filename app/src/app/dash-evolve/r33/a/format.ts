/**
 * Centralized Intl formatting. Every value here is a small, exact integer
 * (never `notation: 'compact'`), so the formatted string is identical between
 * server and client render — no hydration mismatch risk.
 */
const integerFormatter = new Intl.NumberFormat("en-US");

export function formatCount(value: number): string {
  return integerFormatter.format(value);
}
