// Deterministic data generation for the Fathom markets desk console.
// No Math.random, no Date.now, no bare `new Date()` anywhere — every number below comes from a
// fixed seed run through sine/cosine, so the exact same values render on the server and the
// client, every time, with no chance of a hydration mismatch.

export type Period = "1D" | "1W" | "1M" | "1Y";

export const PERIODS: { value: Period; label: string }[] = [
  { value: "1D", label: "1D" },
  { value: "1W", label: "1W" },
  { value: "1M", label: "1M" },
  { value: "1Y", label: "1Y" },
];

export type Instrument = {
  id: string;
  symbol: string;
  name: string;
  decimals: number;
  basePrice: number;
  seed: number;
  trendDir: 1 | -1;
  volBase: number;
};

export const INSTRUMENTS: Instrument[] = [
  { id: "BTC-USD", symbol: "BTC-USD", name: "Bitcoin", decimals: 2, basePrice: 64820.0, seed: 4, trendDir: 1, volBase: 390 },
  { id: "ETH-USD", symbol: "ETH-USD", name: "Ethereum", decimals: 2, basePrice: 3046.5, seed: 9, trendDir: 1, volBase: 1040 },
  { id: "SOL-USD", symbol: "SOL-USD", name: "Solana", decimals: 2, basePrice: 161.4, seed: 13, trendDir: -1, volBase: 2380 },
  { id: "XRP-USD", symbol: "XRP-USD", name: "XRP", decimals: 4, basePrice: 0.5832, seed: 19, trendDir: 1, volBase: 198000 },
  { id: "AVAX-USD", symbol: "AVAX-USD", name: "Avalanche", decimals: 2, basePrice: 28.95, seed: 26, trendDir: -1, volBase: 7100 },
  { id: "LINK-USD", symbol: "LINK-USD", name: "Chainlink", decimals: 2, basePrice: 12.46, seed: 32, trendDir: 1, volBase: 10400 },
  { id: "DOGE-USD", symbol: "DOGE-USD", name: "Dogecoin", decimals: 4, basePrice: 0.1392, seed: 37, trendDir: -1, volBase: 980000 },
];

export function instrumentById(id: string): Instrument {
  return INSTRUMENTS.find((i) => i.id === id) ?? INSTRUMENTS[0];
}

export type Candle = {
  label: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

function roundTo(n: number, decimals: number): number {
  const f = 10 ** decimals;
  return Math.round(n * f) / f;
}

const HOUR_LABELS = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, "0")}:00`);
const WEEK_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTH_DAY_LABELS = Array.from({ length: 30 }, (_, i) => `Oct ${i + 1}`);
const YEAR_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const PERIOD_LABELS: Record<Period, string[]> = {
  "1D": HOUR_LABELS,
  "1W": WEEK_LABELS,
  "1M": MONTH_DAY_LABELS,
  "1Y": YEAR_LABELS,
};

const PERIOD_TREND_FACTOR: Record<Period, number> = {
  "1D": 0.0005,
  "1W": 0.0017,
  "1M": 0.0009,
  "1Y": 0.0041,
};

const PERIOD_SEED_OFFSET: Record<Period, number> = { "1D": 0, "1W": 60, "1M": 120, "1Y": 180 };

function generateCandleSeries(
  basePrice: number,
  seed: number,
  labels: string[],
  decimals: number,
  trendPerStep: number,
  volBase: number,
): Candle[] {
  const scale = basePrice * 0.012;
  let prevClose = basePrice;
  return labels.map((label, i) => {
    const t = i + seed;
    const wave = Math.sin(t * 0.7) * scale + Math.sin(t * 0.33 + 1.1) * scale * 0.5;
    const trend = trendPerStep * i;
    const open = prevClose;
    const drift = Math.cos(t * 0.9 + 0.4) * scale * 0.6;
    const close = basePrice + trend + wave + drift;
    const bodyHigh = Math.max(open, close);
    const bodyLow = Math.min(open, close);
    const high = bodyHigh + Math.abs(Math.sin(t * 1.6 + 0.2)) * scale * 0.5;
    const low = bodyLow - Math.abs(Math.cos(t * 1.3 + 0.7)) * scale * 0.5;
    const volume = volBase + Math.abs(Math.sin(t * 0.5 + 1.0)) * volBase * 0.8;
    prevClose = close;
    return {
      label,
      open: roundTo(open, decimals),
      high: roundTo(high, decimals),
      low: roundTo(Math.max(low, 0.0001), decimals),
      close: roundTo(close, decimals),
      volume: Math.round(volume),
    };
  });
}

export function getCandles(instrument: Instrument, period: Period): Candle[] {
  const labels = PERIOD_LABELS[period];
  const trendPerStep = instrument.basePrice * PERIOD_TREND_FACTOR[period] * instrument.trendDir;
  return generateCandleSeries(
    instrument.basePrice,
    instrument.seed + PERIOD_SEED_OFFSET[period],
    labels,
    instrument.decimals,
    trendPerStep,
    instrument.volBase,
  );
}

/** Simple moving average over closes. Returns null for indices before the window fills, so the
 *  chart draws a shorter dashed line that only starts once a full 5-candle window exists. */
export function movingAverage(candles: Candle[], window: number): (number | null)[] {
  return candles.map((_, i) => {
    if (i < window - 1) return null;
    let sum = 0;
    for (let k = i - window + 1; k <= i; k++) sum += candles[k].close;
    return roundTo(sum / window, 6);
  });
}

export type TickerStats = {
  lastPrice: number;
  changePct: number;
  openPrice: number;
  highPrice: number;
  lowPrice: number;
  closes: number[];
};

/** The watchlist always reads off the 1D series so every row shows a comparable "24h" stat
 *  regardless of which period the main chart currently displays. */
export function getTickerStats(instrument: Instrument): TickerStats {
  const series = getCandles(instrument, "1D");
  const first = series[0];
  const last = series[series.length - 1];
  const highPrice = Math.max(...series.map((c) => c.high));
  const lowPrice = Math.min(...series.map((c) => c.low));
  const changePct = roundTo(((last.close - first.open) / first.open) * 100, 2);
  return {
    lastPrice: last.close,
    changePct,
    openPrice: first.open,
    highPrice,
    lowPrice,
    closes: series.map((c) => c.close),
  };
}

export type Trade = {
  id: string;
  timeLabel: string;
  side: "buy" | "sell";
  trader: string;
  price: number;
  size: number;
  value: number;
};

const TRADERS = ["Alex Mercer", "Priya Nair", "Jonas Kessler", "Mia Thornton", "Devon Ruiz", "Sana Okafor", "Lukas Berg", "Ines Calder"];

export function generateTrades(instrument: Instrument): Trade[] {
  const n = 12;
  return Array.from({ length: n }, (_, i) => {
    const t = i + instrument.seed;
    const side: "buy" | "sell" = Math.sin(t * 0.9) >= 0 ? "buy" : "sell";
    const priceJitter = Math.sin(t * 1.3 + 0.5) * instrument.basePrice * 0.004;
    const price = roundTo(instrument.basePrice + priceJitter, instrument.decimals);
    const size = roundTo(0.08 + Math.abs(Math.cos(t * 0.7 + 1)) * 2.4, 3);
    const value = roundTo(price * size, 2);
    const minutesAgo = i * 2;
    const trader = TRADERS[(instrument.seed + i * 3) % TRADERS.length];
    return {
      id: `${instrument.id}-trade-${i}`,
      timeLabel: minutesAgo === 0 ? "Just now" : `${minutesAgo}m ago`,
      side,
      trader,
      price,
      size,
      value,
    };
  });
}

/** Deterministic share of buy-side fills in a trade list, used for the order-flow bar. */
export function buyFlowShare(trades: Trade[]): number {
  if (trades.length === 0) return 0;
  const buys = trades.filter((t) => t.side === "buy").length;
  return Math.round((buys / trades.length) * 100);
}

export function formatPrice(value: number, decimals: number): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatSize(value: number): string {
  return new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 3 }).format(value);
}

export function formatSignedPercent(value: number): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

/** Manual K/M compact formatter — Intl's `notation: "compact"` disagrees between the Node SSR
 *  pass and the browser's ICU data for the same number, which breaks hydration. This is plain
 *  arithmetic so server and client always agree exactly. */
export function formatCompact(value: number): string {
  const strip = (v: number) => (v % 1 === 0 ? String(v) : v.toFixed(1));
  if (value >= 1_000_000) return `${strip(Math.round((value / 1_000_000) * 10) / 10)}M`;
  if (value >= 1_000) return `${strip(Math.round((value / 1_000) * 10) / 10)}K`;
  return String(Math.round(value));
}
