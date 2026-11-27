// Formatting helpers. Deliberately avoid Intl.NumberFormat's `notation: "compact"` —
// ICU compact output can differ between the Node SSR pass and the browser, a
// documented hydration-mismatch trap in this codebase. Instead, Intl formats the
// plain numeric mantissa and a hand-rolled, deterministic unit suffix is appended.

const oneDecimalFormatter = new Intl.NumberFormat("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const integerFormatter = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
const exactUsdFormatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

/** Formats an ARR figure given in thousands of USD, e.g. 4820 -> "$4.8M", 700 -> "$700K". */
export function formatArr(thousands: number): string {
  if (Math.abs(thousands) >= 1000) {
    return `$${oneDecimalFormatter.format(thousands / 1000)}M`;
  }
  return `$${integerFormatter.format(Math.round(thousands))}K`;
}

/** Exact, non-abbreviated dollar figure, e.g. 4820 -> "$4,820,000". Used in tooltips/table. */
export function formatArrExact(thousands: number): string {
  return exactUsdFormatter.format(Math.round(thousands) * 1000);
}

export function formatPercent(value: number, fractionDigits: 1 | 0 = 1): string {
  const formatter = fractionDigits === 0 ? integerFormatter : oneDecimalFormatter;
  return `${formatter.format(value)}%`;
}

export function formatCount(n: number): string {
  return integerFormatter.format(n);
}

export function formatSignedArr(thousands: number): string {
  const sign = thousands > 0 ? "+" : thousands < 0 ? "−" : "±";
  return `${sign}${formatArr(Math.abs(thousands))}`;
}
