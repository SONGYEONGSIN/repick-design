import type { Instrument } from "./data";

const RATE_FORMATTERS = new Map<number, Intl.NumberFormat>();
function rateFormatter(decimals: number): Intl.NumberFormat {
  let f = RATE_FORMATTERS.get(decimals);
  if (!f) {
    f = new Intl.NumberFormat("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
    RATE_FORMATTERS.set(decimals, f);
  }
  return f;
}

/** 환율(페어 소수 자릿수 기준) 포맷. */
export function formatRate(value: number, instrument: Instrument | { decimals: number }): string {
  return rateFormatter(instrument.decimals).format(value);
}

const USD_COMPACT = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1,
});

export function formatUsdCompact(value: number): string {
  return USD_COMPACT.format(value);
}

const USD_FULL = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function formatUsd(value: number): string {
  return USD_FULL.format(value);
}

const PERCENT = new Intl.NumberFormat("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

export function formatPct(value: number, withSign = false): string {
  const s = PERCENT.format(Math.abs(value));
  if (!withSign) return `${s}%`;
  return `${value >= 0 ? "+" : "-"}${s}%`;
}

export function formatPnl(value: number): string {
  const abs = formatUsd(Math.abs(value));
  return value >= 0 ? `+${abs}` : `-${abs}`;
}

export function formatSizeUsd(value: number): string {
  return formatUsdCompact(value);
}
