const currencyFull = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const currencyCompact = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", notation: "compact", maximumFractionDigits: 1 });
const count = new Intl.NumberFormat("en-US");
const percent = new Intl.NumberFormat("en-US", { maximumFractionDigits: 1, minimumFractionDigits: 1 });

export function formatCurrency(n: number): string {
  return currencyFull.format(n);
}

export function formatCurrencyCompact(n: number): string {
  return currencyCompact.format(n);
}

export function formatCount(n: number): string {
  return count.format(n);
}

export function formatPercent(n: number): string {
  return `${percent.format(n)}%`;
}

export function formatSignedPercent(n: number): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${percent.format(n)}%`;
}
