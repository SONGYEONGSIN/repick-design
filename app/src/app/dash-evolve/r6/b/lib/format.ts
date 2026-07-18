export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

const USD = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});


const PERCENT_1 = new Intl.NumberFormat("en-US", {
  style: "percent",
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const INTEGER = new Intl.NumberFormat("en-US");

export function formatUSD(value: number): string {
  return USD.format(value);
}

// Deliberately hand-rolled instead of Intl.NumberFormat({ notation: "compact" }):
// that option's decision to show a trailing ".0" (e.g. "$835K" vs "$835.0K")
// is ICU-version-dependent and differs between Node's server-render ICU and
// the browser's, which produces a hydration mismatch. toFixed() is defined
// by the ECMAScript spec itself, so it is identical on every platform.
export function formatUSDCompact(value: number): string {
  const sign = value < 0 ? "-" : "";
  const abs = Math.abs(value);
  if (abs >= 1_000_000) {
    const millions = Math.round((abs / 1_000_000) * 10) / 10;
    return `${sign}$${Number.isInteger(millions) ? millions : millions.toFixed(1)}M`;
  }
  if (abs >= 1_000) {
    const thousands = Math.round((abs / 1_000) * 10) / 10;
    return `${sign}$${Number.isInteger(thousands) ? thousands : thousands.toFixed(1)}K`;
  }
  return USD.format(value);
}

/** `value` is already expressed in percent units (e.g. 132.4 means 132.4%). */
export function formatPct(value: number): string {
  return PERCENT_1.format(value / 100);
}

export function formatInt(value: number): string {
  return INTEGER.format(value);
}

export function avatarUrl(id: string, size = 96): string {
  return `https://images.unsplash.com/photo-${id}?w=${size}&h=${size}&fit=crop&crop=faces&q=60`;
}

export function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
