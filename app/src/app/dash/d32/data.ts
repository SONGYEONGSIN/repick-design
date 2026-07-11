import type {
  AssetId,
  Holding,
  MarketStats,
  Period,
  SeriesPoint,
  Transaction,
  WatchAsset,
} from "./types";

/* ---------------------------------------------------------------------- *
 * Deterministic helpers (no Math.random / Date.now — reproducible SSR)
 * ---------------------------------------------------------------------- */

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/** Deterministic pseudo-random value in [0,1) from a numeric seed. */
function pseudo(seed: number): number {
  const x = Math.sin(seed * 12.9898) * 43758.5453123;
  return x - Math.floor(x);
}

function seedFromSymbol(symbol: string): number {
  let seed = 0;
  for (let i = 0; i < symbol.length; i += 1) {
    seed += symbol.charCodeAt(i) * (i + 7);
  }
  return seed;
}

/** Builds a deterministic, smoothly wandering series that starts and ends at exact values. */
function buildValues(
  len: number,
  start: number,
  end: number,
  seed: number,
  volatility: number,
): number[] {
  const values: number[] = [];
  for (let i = 0; i < len; i += 1) {
    const t = i / (len - 1);
    const base = start + (end - start) * t;
    const envelope = Math.sin(t * Math.PI); // 0 at both edges → exact endpoints
    const noiseA = (pseudo(seed + i * 3.371) - 0.5) * 2 * volatility * envelope;
    const noiseB = (pseudo(seed * 1.618 + i * 1.117) - 0.5) * volatility * 0.6 * envelope;
    values.push(base + noiseA + noiseB);
  }
  values[0] = start;
  values[len - 1] = end;
  return values.map(round2);
}

const KOREAN_WEEKDAYS = ["월", "화", "수", "목", "금", "토", "일"];
const KOREAN_MONTHS = [
  "1월", "2월", "3월", "4월", "5월", "6월",
  "7월", "8월", "9월", "10월", "11월", "12월",
];

const PERIOD_LENGTH: Record<Period, number> = {
  "1D": 25,
  "1W": 29,
  "1M": 31,
  "1Y": 13,
};

function buildLabels(period: Period, len: number): { label: string; full: string }[] {
  const out: { label: string; full: string }[] = [];
  for (let i = 0; i < len; i += 1) {
    if (period === "1D") {
      const hour = i % 24;
      const hh = String(hour).padStart(2, "0");
      out.push({ label: `${hh}:00`, full: `${hh}:00` });
    } else if (period === "1W") {
      const dayIndex = Math.floor(i / 4) % 7;
      const hourOfDay = (i % 4) * 6;
      const weekday = KOREAN_WEEKDAYS[dayIndex];
      out.push({
        label: hourOfDay === 0 ? weekday : "",
        full: `${weekday}요일 ${String(hourOfDay).padStart(2, "0")}:00`,
      });
    } else if (period === "1M") {
      const day = i + 1;
      out.push({ label: `${day}일`, full: `7월 ${day}일` });
    } else {
      const month = KOREAN_MONTHS[i % 12];
      out.push({ label: month, full: `${month} 종가 기준` });
    }
  }
  return out;
}

function periodStart(price: number, changePct: number): number {
  return price / (1 + changePct / 100);
}

/* ---------------------------------------------------------------------- *
 * Portfolio assets (deterministic demo data)
 * ---------------------------------------------------------------------- */

export const HOLDINGS: Holding[] = [
  {
    id: "btc", symbol: "BTC", name: "Bitcoin", color: "#F7931A", decimals: 4,
    price: 67842.15, qty: 1.284, change24h: 2.34, changeWeek: 6.1, changeMonth: 14.2, changeYear: 38.5,
  },
  {
    id: "eth", symbol: "ETH", name: "Ethereum", color: "#8CA6FF", decimals: 3,
    price: 3412.80, qty: 18.5, change24h: -1.12, changeWeek: -3.4, changeMonth: 2.1, changeYear: 21.75,
  },
  {
    id: "sol", symbol: "SOL", name: "Solana", color: "#B084FF", decimals: 2,
    price: 164.27, qty: 320.4, change24h: 5.67, changeWeek: 12.8, changeMonth: 25.3, changeYear: 64.0,
  },
  {
    id: "usdc", symbol: "USDC", name: "USD Coin", color: "#4C9CE8", decimals: 2,
    price: 1.00, qty: 42500, change24h: 0.0, changeWeek: 0.02, changeMonth: -0.01, changeYear: 0.03,
  },
  {
    id: "link", symbol: "LINK", name: "Chainlink", color: "#4DC8E8", decimals: 2,
    price: 14.82, qty: 2100, change24h: -0.45, changeWeek: -2.15, changeMonth: 4.6, changeYear: 9.8,
  },
  {
    id: "avax", symbol: "AVAX", name: "Avalanche", color: "#E8555A", decimals: 2,
    price: 36.94, qty: 850, change24h: 3.21, changeWeek: 8.9, changeMonth: -5.2, changeYear: 12.4,
  },
];

export const WATCHLIST: WatchAsset[] = [
  {
    id: "doge", symbol: "DOGE", name: "Dogecoin", color: "#C2A633", decimals: 0,
    price: 0.1842, change24h: 3.85, changeWeek: 9.2, changeMonth: -4.1, changeYear: 22.0,
  },
  {
    id: "pol", symbol: "POL", name: "Polygon", color: "#8247E5", decimals: 0,
    price: 0.5231, change24h: -0.92, changeWeek: -3.4, changeMonth: 6.7, changeYear: -18.2,
  },
  {
    id: "uni", symbol: "UNI", name: "Uniswap", color: "#FF6FB8", decimals: 0,
    price: 11.47, change24h: 1.15, changeWeek: 4.9, changeMonth: -2.3, changeYear: 33.6,
  },
  {
    id: "arb", symbol: "ARB", name: "Arbitrum", color: "#4DB8FF", decimals: 0,
    price: 0.7834, change24h: -2.44, changeWeek: -6.1, changeMonth: 8.9, changeYear: -12.5,
  },
];

const ASSET_SUPPLY: Record<string, number> = {
  btc: 19_700_000,
  eth: 120_300_000,
  sol: 468_000_000,
  usdc: 34_100_000_000,
  link: 587_000_000,
  avax: 410_000_000,
  doge: 148_000_000_000,
  pol: 9_900_000_000,
  uni: 600_000_000,
  arb: 4_200_000_000,
};

const ASSET_VOLUME_24H: Record<string, number> = {
  btc: 28_400_000_000,
  eth: 14_200_000_000,
  sol: 3_800_000_000,
  usdc: 5_600_000_000,
  link: 412_000_000,
  avax: 386_000_000,
  doge: 612_000_000,
  pol: 187_000_000,
  uni: 94_000_000,
  arb: 156_000_000,
};

function getAssetMeta(id: Exclude<AssetId, "portfolio">) {
  return HOLDINGS.find((h) => h.id === id) ?? WATCHLIST.find((w) => w.id === id)!;
}

export function getMarketStats(id: Exclude<AssetId, "portfolio">): MarketStats {
  const asset = getAssetMeta(id);
  const yesterday = periodStart(asset.price, asset.change24h);
  const supply = ASSET_SUPPLY[id];
  return {
    marketCap: round2(asset.price * supply),
    volume24h: ASSET_VOLUME_24H[id],
    high24h: round2(Math.max(asset.price, yesterday) * 1.006),
    low24h: round2(Math.min(asset.price, yesterday) * 0.994),
    supply,
  };
}

/* ---------------------------------------------------------------------- *
 * Chart series
 * ---------------------------------------------------------------------- */

export function getAssetSeries(id: Exclude<AssetId, "portfolio">, period: Period): SeriesPoint[] {
  const asset = getAssetMeta(id);
  const changeByPeriod: Record<Period, number> = {
    "1D": asset.change24h,
    "1W": asset.changeWeek,
    "1M": asset.changeMonth,
    "1Y": asset.changeYear,
  };
  const len = PERIOD_LENGTH[period];
  const start = periodStart(asset.price, changeByPeriod[period]);
  const volatility = Math.max(asset.price * 0.018, 0.0006);
  const values = buildValues(len, start, asset.price, seedFromSymbol(asset.symbol), volatility);
  const labels = buildLabels(period, len);
  return values.map((value, i) => ({ value, label: labels[i].label, full: labels[i].full }));
}

export function getPortfolioSeries(period: Period): SeriesPoint[] {
  const len = PERIOD_LENGTH[period];
  const labels = buildLabels(period, len);
  const totals = new Array(len).fill(0);
  for (const holding of HOLDINGS) {
    const series = getAssetSeries(holding.id, period);
    series.forEach((point, i) => {
      totals[i] += point.value * holding.qty;
    });
  }
  return totals.map((value, i) => ({ value: round2(value), label: labels[i].label, full: labels[i].full }));
}

/* ---------------------------------------------------------------------- *
 * Portfolio aggregates
 * ---------------------------------------------------------------------- */

export const TOTAL_BALANCE = round2(HOLDINGS.reduce((sum, h) => sum + h.price * h.qty, 0));

const portfolio1D = getPortfolioSeries("1D");
export const PORTFOLIO_CHANGE_24H_USD = round2(
  portfolio1D[portfolio1D.length - 1].value - portfolio1D[0].value,
);
export const PORTFOLIO_CHANGE_24H_PCT = round2(
  (PORTFOLIO_CHANGE_24H_USD / portfolio1D[0].value) * 100,
);

export const BEST_PERFORMER = HOLDINGS.reduce((best, h) => (h.change24h > best.change24h ? h : best), HOLDINGS[0]);
export const WORST_PERFORMER = HOLDINGS.reduce((worst, h) => (h.change24h < worst.change24h ? h : worst), HOLDINGS[0]);

export function getHoldingValue(h: Holding): number {
  return round2(h.price * h.qty);
}

export function getAllocation(): { holding: Holding; pct: number }[] {
  const raw = HOLDINGS.map((h) => ({ holding: h, exact: (getHoldingValue(h) / TOTAL_BALANCE) * 100 }));
  const rounded = raw.map((r) => ({ holding: r.holding, pct: Math.floor(r.exact * 10) / 10 }));
  const remainder = round2(100 - rounded.reduce((s, r) => s + r.pct, 0));
  // assign leftover rounding remainder to the largest holding so segments sum to exactly 100%
  const largestIndex = rounded.reduce(
    (idx, r, i, arr) => (r.pct > arr[idx].pct ? i : idx),
    0,
  );
  rounded[largestIndex] = { ...rounded[largestIndex], pct: round2(rounded[largestIndex].pct + remainder) };
  return rounded;
}

/* ---------------------------------------------------------------------- *
 * Transactions
 * ---------------------------------------------------------------------- */

export const TRANSACTIONS: Transaction[] = [
  { id: "tx-01", type: "buy", assetId: "sol", symbol: "SOL", qty: 60, value: 9504.00, date: "7월 11일", time: "07:03", status: "pending" },
  { id: "tx-02", type: "transfer_out", assetId: "usdc", symbol: "USDC", qty: 5000, value: 5000.00, date: "7월 5일", time: "08:20", status: "completed" },
  { id: "tx-03", type: "sell", assetId: "link", symbol: "LINK", qty: 300, value: 4506.00, date: "7월 6일", time: "13:55", status: "completed" },
  { id: "tx-04", type: "buy", assetId: "avax", symbol: "AVAX", qty: 120, value: 4296.00, date: "7월 7일", time: "20:31", status: "completed" },
  { id: "tx-05", type: "transfer_in", assetId: "sol", symbol: "SOL", qty: 45, value: 7335.00, date: "7월 8일", time: "11:02", status: "completed" },
  { id: "tx-06", type: "sell", assetId: "eth", symbol: "ETH", qty: 2.5, value: 8700.25, date: "7월 8일", time: "16:47", status: "completed" },
  { id: "tx-07", type: "buy", assetId: "btc", symbol: "BTC", qty: 0.042, value: 2776.63, date: "7월 9일", time: "09:14", status: "completed" },
];

/* ---------------------------------------------------------------------- *
 * Formatters (Intl-based, locale-safe)
 * ---------------------------------------------------------------------- */

export function formatUSD(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatPrice(value: number): string {
  const digits = value < 1 ? 4 : 2;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

export function formatUSDCompact(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatPercent(value: number): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

export function formatQty(value: number, decimals: number): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatCompact(value: number): string {
  return new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(value);
}

export function getAssetById(id: AssetId) {
  if (id === "portfolio") return null;
  return getAssetMeta(id);
}

export { round2, periodStart };
