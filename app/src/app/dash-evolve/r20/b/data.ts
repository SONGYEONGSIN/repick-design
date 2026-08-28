import { Anchor, Banknote, Compass, LayoutGrid, LineChart, type LucideIcon, ListChecks, Settings } from "lucide-react";

export const BRAND = { name: "Fathom", Icon: Anchor };

export const CURRENT_USER = {
  name: "Declan Fitzgerald",
  role: "Treasury desk lead",
  email: "declan@fathom-treasury.io",
  avatarId: "1552664730-d307ca884978",
};

export const WORKSPACES = [
  { id: "core", name: "Fathom — Core desk", plan: "8 instruments live" },
  { id: "hedge", name: "Fathom — Hedge book", plan: "3 instruments live" },
];

type NavItem = { id: string; label: string; Icon: LucideIcon; active?: boolean; disabled?: boolean };
export const NAV_SECTIONS: { id: string; title: string; items: NavItem[] }[] = [
  {
    id: "markets",
    title: "Markets",
    items: [
      { id: "desk", label: "Trading desk", Icon: LineChart, active: true },
      { id: "fills", label: "Fill history", Icon: ListChecks },
      { id: "positions", label: "Positions", Icon: LayoutGrid },
    ],
  },
  {
    id: "workspace",
    title: "Workspace",
    items: [
      { id: "limits", label: "Risk limits", Icon: Compass, disabled: true },
      { id: "settings", label: "Settings", Icon: Settings },
    ],
  },
];

export const NOTIFICATIONS = [
  { id: "n1", text: "USD/JPY crossed the 30-day high set on day 14.", time: "6m ago" },
  { id: "n2", text: "3M T-Bill yield fill confirmed at 5.12%.", time: "41m ago" },
  { id: "n3", text: "SOFR overnight print updated for the desk.", time: "2h ago" },
];

/* ---------------------------------------------------------------- Instruments */

export type Candle = { day: number; o: number; h: number; l: number; c: number };
export type Instrument = {
  id: string;
  symbol: string;
  name: string;
  category: "FX" | "Rates";
  base: number;
  amp: number;
  freq: number;
  phase: number;
  drift: number;
  spread: number;
  decimals: number;
};

const INSTRUMENT_SEEDS: Instrument[] = [
  { id: "eurusd", symbol: "EUR/USD", name: "Euro / US Dollar", category: "FX", base: 1.082, amp: 0.014, freq: 0.42, phase: 0.4, drift: 0.0009, spread: 0.003, decimals: 4 },
  { id: "usdjpy", symbol: "USD/JPY", name: "US Dollar / Yen", category: "FX", base: 149.2, amp: 1.8, freq: 0.31, phase: 1.1, drift: 0.14, spread: 0.35, decimals: 2 },
  { id: "gbpusd", symbol: "GBP/USD", name: "Sterling / US Dollar", category: "FX", base: 1.264, amp: 0.018, freq: 0.5, phase: 2.0, drift: -0.0006, spread: 0.0035, decimals: 4 },
  { id: "usdchf", symbol: "USD/CHF", name: "US Dollar / Franc", category: "FX", base: 0.881, amp: 0.009, freq: 0.36, phase: 0.7, drift: 0.0003, spread: 0.002, decimals: 4 },
  { id: "audusd", symbol: "AUD/USD", name: "Aussie / US Dollar", category: "FX", base: 0.657, amp: 0.011, freq: 0.46, phase: 2.6, drift: -0.0011, spread: 0.0025, decimals: 4 },
  { id: "tbill3m", symbol: "T3M", name: "3M T-Bill yield", category: "Rates", base: 5.08, amp: 0.09, freq: 0.22, phase: 0.2, drift: 0.004, spread: 0.015, decimals: 2 },
  { id: "sofr", symbol: "SOFR", name: "SOFR overnight", category: "Rates", base: 5.31, amp: 0.04, freq: 0.18, phase: 1.4, drift: 0.001, spread: 0.008, decimals: 2 },
  { id: "ust10y", symbol: "UST10Y", name: "10Y Treasury yield", category: "Rates", base: 4.24, amp: 0.16, freq: 0.27, phase: 3.0, drift: -0.006, spread: 0.02, decimals: 2 },
];

export const DAYS = 20;

/** Deterministic OHLC generator — pure trig + drift, no Math.random/Date.now. Rounded to the
 *  instrument's own decimal precision so both server and client render identical figures. */
function candles(seed: Instrument): Candle[] {
  const out: Candle[] = [];
  const round = (n: number) => Math.round(n * 10 ** seed.decimals) / 10 ** seed.decimals;
  for (let day = 0; day < DAYS; day++) {
    const mid = seed.base + seed.amp * Math.sin(day * seed.freq + seed.phase) + seed.drift * day;
    const wobble = seed.spread * (0.6 + 0.4 * Math.sin(day * 1.7 + seed.phase * 2));
    const o = day === 0 ? mid : out[day - 1].c;
    const c = mid + wobble * Math.sin(day * 2.3 + seed.phase);
    const h = Math.max(o, c) + Math.abs(wobble) * 0.8;
    const l = Math.min(o, c) - Math.abs(wobble) * 0.8;
    out.push({ day, o: round(o), h: round(h), l: round(l), c: round(c) });
  }
  return out;
}

export type InstrumentRow = Instrument & { candles: Candle[] };
export const INSTRUMENTS: InstrumentRow[] = INSTRUMENT_SEEDS.map((seed) => ({ ...seed, candles: candles(seed) }));
export const INSTRUMENT_BY_ID: Record<string, InstrumentRow> = Object.fromEntries(INSTRUMENTS.map((i) => [i.id, i]));

export function changePct(row: InstrumentRow): number {
  const first = row.candles[0].o;
  const last = row.candles[row.candles.length - 1].c;
  return Math.round(((last - first) / first) * 1000) / 10;
}

/* --------------------------------------------------------------------- Fills */

export type Fill = { id: string; instrumentId: string; side: "buy" | "sell"; qty: number; price: number; timeAgo: string };
export const FILLS: Fill[] = [
  { id: "f1", instrumentId: "eurusd", side: "buy", qty: 2_000_000, price: 1.0821, timeAgo: "2m ago" },
  { id: "f2", instrumentId: "usdjpy", side: "sell", qty: 850_000, price: 149.62, timeAgo: "6m ago" },
  { id: "f3", instrumentId: "tbill3m", side: "buy", qty: 5_000_000, price: 5.12, timeAgo: "9m ago" },
  { id: "f4", instrumentId: "gbpusd", side: "buy", qty: 1_200_000, price: 1.2637, timeAgo: "14m ago" },
  { id: "f5", instrumentId: "sofr", side: "sell", qty: 3_000_000, price: 5.3, timeAgo: "22m ago" },
  { id: "f6", instrumentId: "audusd", side: "sell", qty: 900_000, price: 0.6552, timeAgo: "31m ago" },
  { id: "f7", instrumentId: "usdchf", side: "buy", qty: 1_500_000, price: 0.8802, timeAgo: "38m ago" },
  { id: "f8", instrumentId: "ust10y", side: "buy", qty: 4_000_000, price: 4.22, timeAgo: "47m ago" },
  { id: "f9", instrumentId: "eurusd", side: "sell", qty: 1_800_000, price: 1.0809, timeAgo: "55m ago" },
  { id: "f10", instrumentId: "usdjpy", side: "buy", qty: 600_000, price: 149.31, timeAgo: "1h ago" },
];

/* ---------------------------------------------------------------- Formatting */

export function formatPrice(n: number, decimals: number): string {
  return new Intl.NumberFormat("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(n);
}
export function formatQty(n: number): string {
  return new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(n);
}
export function formatPct(n: number): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(2)}%`;
}

/* ------------------------------------------------------------------- Search */

export type SearchEntry = { id: string; title: string; meta: string; Icon: LucideIcon; instrumentId: string };
export const SEARCH_ENTRIES: SearchEntry[] = INSTRUMENTS.map((row) => ({
  id: row.id,
  title: `${row.symbol} — ${row.name}`,
  meta: `${formatPrice(row.candles[row.candles.length - 1].c, row.decimals)} · ${formatPct(changePct(row))}`,
  Icon: Banknote,
  instrumentId: row.id,
}));
