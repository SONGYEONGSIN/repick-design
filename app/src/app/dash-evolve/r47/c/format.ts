// Formatting helpers. Dates are parsed by hand from "YYYY-MM-DD" strings — never `new Date(...)` —
// so there is no dependency on the host clock and nothing here can disagree with the dummy data.

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
] as const;

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const compactCurrencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1,
});

const percentFormatter = new Intl.NumberFormat("en-US", {
  style: "percent",
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat("en-US");

export function formatCurrency(value: number): string {
  return currencyFormatter.format(value);
}

export function formatCompactCurrency(value: number): string {
  return compactCurrencyFormatter.format(value);
}

export function formatPercent(value: number): string {
  return percentFormatter.format(value);
}

export function formatNumber(value: number): string {
  return numberFormatter.format(value);
}

/** Parses a plain "YYYY-MM-DD" string into parts without ever constructing a Date object. */
export function parseIsoDate(iso: string): { year: number; month: number; day: number } {
  const [year, month, day] = iso.split("-").map((part) => Number.parseInt(part, 10));
  return { year, month, day };
}

export function formatDate(iso: string): string {
  const { year, month, day } = parseIsoDate(iso);
  return `${MONTH_NAMES[month - 1]} ${day}, ${year}`;
}

export function formatDateShort(iso: string): string {
  const { month, day } = parseIsoDate(iso);
  return `${MONTH_NAMES[month - 1]} ${day}`;
}

/** Deterministic quarter label from an account's own renewal month — never from "today". */
export function quarterLabel(iso: string): string {
  const { year, month } = parseIsoDate(iso);
  const quarter = Math.floor((month - 1) / 3) + 1;
  return `Q${quarter} ${year}`;
}
