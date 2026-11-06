import { round1, round2, type Severity } from "./tokens";

/* ------------------------------------------------------------------------ *
 * Types
 * ------------------------------------------------------------------------ */

export type Period = "1D" | "1W" | "1M";

export type SignalType = "spike" | "threshold" | "undercut" | "stabilized" | "repriced" | "demand";

export type Category = "E-commerce" | "Airfare" | "Freight" | "Hospitality";

export interface Instrument {
  id: string;
  name: string;
  ticker: string;
  category: Category;
  market: string;
  basePrice: number;
  seed: number;
  volatility: number;
}

export interface Candle {
  index: number;
  label: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface Signal {
  id: string;
  time: string;
  type: SignalType;
  severity: Severity;
  instrumentId: string;
  headline: string;
  detail: string;
  deltaPct: number;
  resolutionMinutes?: number;
}

export interface WatchlistEntry {
  instrument: Instrument;
  price: number;
  changePct: number;
  sparkline: number[];
}

/* ------------------------------------------------------------------------ *
 * Deterministic generators — no Math.random / Date.now / new Date() anywhere.
 * Candle bodies wander via fixed trig functions of a per-instrument seed, so the
 * same instrument + period always renders the same numbers on server and client.
 * ------------------------------------------------------------------------ */

function generateCandleCore(seed: number, count: number, basePrice: number, volatility: number) {
  const out: { index: number; open: number; high: number; low: number; close: number }[] = [];
  let prevClose = basePrice;
  for (let i = 0; i < count; i += 1) {
    const t = seed + i * 0.73;
    const drift = round2(Math.sin(t) * volatility * 0.5 + Math.cos(t * 1.37) * volatility * 0.3);
    const open = round2(prevClose);
    let close = round2(open + drift);
    if (close <= open * 0.4) close = round2(open * 0.6);
    const wickUp = round2(Math.abs(Math.cos(t * 2.09)) * volatility * 0.45 + volatility * 0.05);
    const wickDown = round2(Math.abs(Math.sin(t * 1.53)) * volatility * 0.4 + volatility * 0.05);
    const high = round2(Math.max(open, close) + wickUp);
    const low = round2(Math.max(0.01, Math.min(open, close) - wickDown));
    out.push({ index: i, open, high, low, close });
    prevClose = close;
  }
  return out;
}

function hourLabels(count: number): string[] {
  return Array.from({ length: count }, (_, i) => `${String(i).padStart(2, "0")}:00`);
}

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function weekLabels(count: number): string[] {
  return WEEKDAYS.slice(0, count);
}

function monthLabels(count: number): string[] {
  return Array.from({ length: count }, (_, i) => `10/${String(i + 1).padStart(2, "0")}`);
}

const PERIOD_META: Record<Period, { count: number; offset: number; volMult: number; labels: string[] }> = {
  "1D": { count: 24, offset: 0, volMult: 0.42, labels: hourLabels(24) },
  "1W": { count: 7, offset: 50, volMult: 0.85, labels: weekLabels(7) },
  "1M": { count: 30, offset: 120, volMult: 1.35, labels: monthLabels(30) },
};

export const PERIOD_OPTIONS: { value: Period; label: string }[] = [
  { value: "1D", label: "1D" },
  { value: "1W", label: "1W" },
  { value: "1M", label: "1M" },
];

export function getCandles(instrument: Instrument, period: Period): Candle[] {
  const meta = PERIOD_META[period];
  const core = generateCandleCore(instrument.seed + meta.offset, meta.count, instrument.basePrice, instrument.volatility * meta.volMult);
  return core.map((c, i) => ({ ...c, label: meta.labels[i] }));
}

export function computeVolatilityScore(candles: Candle[]): number {
  if (candles.length === 0) return 0;
  const avgRangePct = candles.reduce((sum, c) => sum + ((c.high - c.low) / c.close) * 100, 0) / candles.length;
  return round1(Math.min(10, Math.max(0, avgRangePct * 1.1)));
}

/* ------------------------------------------------------------------------ *
 * Instruments — the priced things Fluxgate watches for volatility.
 * Deliberately cross-domain: the chart type (OHLC) is the constant, the instrument
 * is whatever a revenue team reprices in near-real time.
 * ------------------------------------------------------------------------ */

export const INSTRUMENTS: Instrument[] = [
  {
    id: "sku-4821",
    name: "Wireless Earbuds Pro",
    ticker: "SKU-4821",
    category: "E-commerce",
    market: "Amazon US",
    basePrice: 79.99,
    seed: 3.1,
    volatility: 2.6,
  },
  {
    id: "jfk-lhr",
    name: "JFK → LHR Economy",
    ticker: "JFK-LHR",
    category: "Airfare",
    market: "NorthWing Air",
    basePrice: 612,
    seed: 7.4,
    volatility: 38,
  },
  {
    id: "rtm-hou",
    name: "Rotterdam → Houston FCL",
    ticker: "RTM-HOU",
    category: "Freight",
    market: "40ft container index",
    basePrice: 3180,
    seed: 1.9,
    volatility: 210,
  },
  {
    id: "grand-meridian",
    name: "Grand Meridian SF — King Room",
    ticker: "GMSF-KG",
    category: "Hospitality",
    market: "Direct + OTA blended",
    basePrice: 289,
    seed: 5.6,
    volatility: 24,
  },
  {
    id: "sku-1190",
    name: "27in 4K Monitor",
    ticker: "SKU-1190",
    category: "E-commerce",
    market: "Walmart Marketplace",
    basePrice: 341,
    seed: 9.2,
    volatility: 16,
  },
  {
    id: "ord-nrt",
    name: "ORD → NRT Premium Economy",
    ticker: "ORD-NRT",
    category: "Airfare",
    market: "Skyline Pacific",
    basePrice: 1450,
    seed: 4.3,
    volatility: 72,
  },
];

export function getInstrument(id: string): Instrument | undefined {
  return INSTRUMENTS.find((i) => i.id === id);
}

export function getLatestClose(instrument: Instrument): number {
  const candles = getCandles(instrument, "1D");
  return candles[candles.length - 1].close;
}

export function getDayChangePct(instrument: Instrument): number {
  const candles = getCandles(instrument, "1D");
  const first = candles[0].open;
  const last = candles[candles.length - 1].close;
  return round2(((last - first) / first) * 100);
}

function getWeekCloses(instrument: Instrument): number[] {
  return getCandles(instrument, "1W").map((c) => c.close);
}

export const WATCHLIST_ENTRIES: WatchlistEntry[] = INSTRUMENTS.map((instrument) => ({
  instrument,
  price: getLatestClose(instrument),
  changePct: getDayChangePct(instrument),
  sparkline: getWeekCloses(instrument),
}));

/* ------------------------------------------------------------------------ *
 * Signal feed — the activity/alert stream that is this page's structural spine.
 * Newest first. Every entry references one instrument by id.
 * ------------------------------------------------------------------------ */

export const SIGNALS: Signal[] = [
  { id: "sig-01", time: "11:58", type: "spike", severity: "high", instrumentId: "sku-4821", headline: "Price spike detected", detail: "Wireless Earbuds Pro jumped 9.4% in the last 15 minutes after a flash promotion ended on a rival listing.", deltaPct: 9.4 },
  { id: "sig-02", time: "11:46", type: "threshold", severity: "high", instrumentId: "jfk-lhr", headline: "Threshold breached", detail: "JFK → LHR economy fare crossed the upper volatility band for the second time this week.", deltaPct: 6.1 },
  { id: "sig-03", time: "11:35", type: "undercut", severity: "medium", instrumentId: "sku-1190", headline: "Competitor undercut", detail: "A marketplace rival dropped the 27in 4K Monitor price 5.2% below our floor.", deltaPct: -5.2 },
  { id: "sig-04", time: "11:24", type: "demand", severity: "medium", instrumentId: "ord-nrt", headline: "Demand surge detected", detail: "Search volume for ORD → NRT premium economy rose 22% ahead of a holiday weekend.", deltaPct: 3.8 },
  { id: "sig-05", time: "11:10", type: "stabilized", severity: "low", instrumentId: "rtm-hou", headline: "Volatility compressed", detail: "Rotterdam → Houston FCL rate range narrowed to its tightest band in 11 days.", deltaPct: -0.6, resolutionMinutes: 5 },
  { id: "sig-06", time: "10:57", type: "repriced", severity: "low", instrumentId: "sku-4821", headline: "Repricer action taken", detail: "Automated repricing engine corrected Wireless Earbuds Pro back inside its target band.", deltaPct: -2.1, resolutionMinutes: 4 },
  { id: "sig-07", time: "10:44", type: "spike", severity: "medium", instrumentId: "grand-meridian", headline: "Price spike detected", detail: "Grand Meridian SF king room ADR spiked 7.8% on a same-day conference block.", deltaPct: 7.8 },
  { id: "sig-08", time: "10:31", type: "threshold", severity: "high", instrumentId: "rtm-hou", headline: "Threshold breached", detail: "Rotterdam → Houston FCL rate broke through the lower volatility band.", deltaPct: -8.9 },
  { id: "sig-09", time: "10:18", type: "undercut", severity: "medium", instrumentId: "jfk-lhr", headline: "Competitor undercut", detail: "NorthWing's fare now sits 4.1% below the matched competitor set.", deltaPct: -4.1 },
  { id: "sig-10", time: "10:05", type: "demand", severity: "low", instrumentId: "sku-1190", headline: "Demand surge detected", detail: "4K Monitor add-to-cart rate rose 14% with no price change yet.", deltaPct: 0.0 },
  { id: "sig-11", time: "09:52", type: "stabilized", severity: "low", instrumentId: "ord-nrt", headline: "Volatility compressed", detail: "ORD → NRT premium economy settled after yesterday's demand spike.", deltaPct: -1.2, resolutionMinutes: 7 },
  { id: "sig-12", time: "09:40", type: "repriced", severity: "low", instrumentId: "jfk-lhr", headline: "Repricer action taken", detail: "Fare engine nudged JFK → LHR back toward the midpoint of its band.", deltaPct: 1.4, resolutionMinutes: 6 },
  { id: "sig-13", time: "09:27", type: "spike", severity: "high", instrumentId: "rtm-hou", headline: "Price spike detected", detail: "Rotterdam → Houston FCL surged 11.2% on a capacity shortfall alert.", deltaPct: 11.2 },
  { id: "sig-14", time: "09:14", type: "threshold", severity: "medium", instrumentId: "grand-meridian", headline: "Threshold breached", detail: "Grand Meridian SF ADR crossed its upper band for the third time this month.", deltaPct: 5.6 },
  { id: "sig-15", time: "09:01", type: "undercut", severity: "high", instrumentId: "sku-4821", headline: "Competitor undercut", detail: "A bundle listing undercut Wireless Earbuds Pro by 12.3%, the largest gap this quarter.", deltaPct: -12.3 },
  { id: "sig-16", time: "08:47", type: "demand", severity: "medium", instrumentId: "sku-1190", headline: "Demand surge detected", detail: "4K Monitor demand index rose alongside a competitor stockout.", deltaPct: 2.9 },
];

export const SIGNAL_TYPE_LABEL: Record<SignalType, string> = {
  spike: "Spike",
  threshold: "Threshold",
  undercut: "Undercut",
  stabilized: "Stabilized",
  repriced: "Repriced",
  demand: "Demand",
};

/* ------------------------------------------------------------------------ *
 * Aggregates — every figure below is reduced from SIGNALS / INSTRUMENTS so
 * partial counts always sum back to the total (no hand-typed duplicate totals).
 * ------------------------------------------------------------------------ */

export const TOTAL_SIGNALS = SIGNALS.length;

export const SEVERITY_COUNTS: Record<Severity, number> = SIGNALS.reduce(
  (acc, s) => {
    acc[s.severity] += 1;
    return acc;
  },
  { high: 0, medium: 0, low: 0 } as Record<Severity, number>,
);

export const THRESHOLD_BREACH_COUNT = SIGNALS.filter((s) => s.type === "threshold").length;

const RESOLVED = SIGNALS.filter((s): s is Signal & { resolutionMinutes: number } => typeof s.resolutionMinutes === "number");
export const AVG_RESOLUTION_MINUTES = round1(RESOLVED.reduce((sum, s) => sum + s.resolutionMinutes, 0) / RESOLVED.length);

export const VOLATILITY_INDEX_NOW = round1(
  INSTRUMENTS.reduce((sum, i) => sum + computeVolatilityScore(getCandles(i, "1D")), 0) / INSTRUMENTS.length,
);
export const VOLATILITY_INDEX_WEEK_AGO = round1(
  INSTRUMENTS.reduce((sum, i) => sum + computeVolatilityScore(getCandles(i, "1W")), 0) / INSTRUMENTS.length,
);
export const VOLATILITY_INDEX_DELTA = round1(VOLATILITY_INDEX_NOW - VOLATILITY_INDEX_WEEK_AGO);

/* ------------------------------------------------------------------------ *
 * Formatters — Intl-based, locale-safe, tabular-nums friendly.
 * ------------------------------------------------------------------------ */

export function formatPrice(value: number): string {
  const digits = value < 10 ? 2 : value < 1000 ? 2 : 0;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

export function formatPercent(value: number, digits = 1): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(digits)}%`;
}

export function formatCount(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

export function formatMinutes(value: number): string {
  return `${value.toFixed(1)}m`;
}
