/**
 * All content for the Renata Kessler / Solstice Macro track-record profile — literal,
 * deterministic data. No Math.random / Date.now / new Date() ships in this route; the 24
 * monthly rows below were generated once at authoring time by a throwaway node script (seeded
 * mulberry32(2024)) and pasted in as literals, the same discipline `auto-profile-r1/b`'s
 * activity-heatmap data used. Every derived number (cumulative return, win rate, cohort
 * percentile) is computed at render time from these literals with plain arithmetic — nothing
 * is re-randomized.
 */

export type BaselineKey = "index" | "peer";
export type RangeKey = "1M" | "3M" | "YTD" | "1Y" | "ALL";
export type AssetClass = "Rates" | "FX" | "Commodities" | "Equities Overlay" | "Credit";

export interface MonthRow {
  label: string;
  own: number;
  index: number;
  peer: number;
}

// Aug 2024 through Jul 2026 — 24 published months. own = Solstice Macro net monthly return (%).
// index = S&P 500 total return (%). peer = median return (%) across the platform's Systematic
// Macro cohort. All figures are percent, two decimal places.
export const MONTHS: MonthRow[] = [
  { label: "Aug 2024", own: 2.87, index: 1.16, peer: 1.1 },
  { label: "Sep 2024", own: 2.16, index: 0.4, peer: 1.17 },
  { label: "Oct 2024", own: 0.34, index: -1.04, peer: 0.26 },
  { label: "Nov 2024", own: 2.25, index: 0.95, peer: 1.75 },
  { label: "Dec 2024", own: 1.0, index: -1.33, peer: 0.3 },
  { label: "Jan 2025", own: 0.79, index: 2.03, peer: -1.05 },
  { label: "Feb 2025", own: -1.66, index: 0.65, peer: 2.64 },
  { label: "Mar 2025", own: 3.4, index: -0.55, peer: 2.19 },
  { label: "Apr 2025", own: -1.61, index: -0.28, peer: -0.09 },
  { label: "May 2025", own: 1.24, index: -0.18, peer: 1.48 },
  { label: "Jun 2025", own: -1.2, index: 0.91, peer: 1.17 },
  { label: "Jul 2025", own: 2.47, index: -0.38, peer: -1.12 },
  { label: "Aug 2025", own: -0.13, index: -0.17, peer: 1.24 },
  { label: "Sep 2025", own: 1.41, index: 0.04, peer: 1.36 },
  { label: "Oct 2025", own: -0.62, index: 0.16, peer: 0.26 },
  { label: "Nov 2025", own: 2.9, index: -0.21, peer: 0.14 },
  { label: "Dec 2025", own: 3.6, index: -1.22, peer: 1.78 },
  { label: "Jan 2026", own: -1.03, index: -0.93, peer: 0.67 },
  { label: "Feb 2026", own: 3.31, index: 2.17, peer: 2.28 },
  { label: "Mar 2026", own: 0.44, index: 1.02, peer: -1.74 },
  { label: "Apr 2026", own: 1.0, index: 0.55, peer: -0.38 },
  { label: "May 2026", own: 0.38, index: -0.81, peer: 1.23 },
  { label: "Jun 2026", own: 0.15, index: 1.31, peer: -0.18 },
  { label: "Jul 2026", own: 1.73, index: 1.55, peer: -0.88 },
];

export const RANGE_OPTIONS: { key: RangeKey; label: string; months: number }[] = [
  { key: "1M", label: "1M", months: 1 },
  { key: "3M", label: "3M", months: 3 },
  { key: "YTD", label: "YTD", months: 7 },
  { key: "1Y", label: "1Y", months: 12 },
  { key: "ALL", label: "All", months: 24 },
];

export const BASELINE_OPTIONS: { key: BaselineKey; label: string; short: string }[] = [
  { key: "index", label: "S&P 500", short: "S&P 500" },
  { key: "peer", label: "Peer Median (Systematic Macro)", short: "Peer median" },
];

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function rangeSlice(range: RangeKey): MonthRow[] {
  const opt = RANGE_OPTIONS.find((r) => r.key === range) ?? RANGE_OPTIONS[RANGE_OPTIONS.length - 1];
  return MONTHS.slice(MONTHS.length - opt.months);
}

export function cumulativeReturn(rows: MonthRow[], key: "own" | BaselineKey): number {
  let c = 1;
  for (const r of rows) c *= 1 + r[key] / 100;
  return round2((c - 1) * 100);
}

export function winRate(rows: MonthRow[]): number {
  if (rows.length === 0) return 0;
  const wins = rows.filter((r) => r.own > 0).length;
  return round2((wins / rows.length) * 100);
}

export interface Position {
  id: string;
  instrument: string;
  assetClass: AssetClass;
  allocation: number;
  ownReturn: number;
  deltaIndex: number;
  deltaPeer: number;
}

// Open positions as of the latest published month. allocation sums to 100.00.
export const POSITIONS: Position[] = [
  { id: "us10y-swap", instrument: "US 10Y Rate Swap", assetClass: "Rates", allocation: 18.5, ownReturn: 6.4, deltaIndex: 4.9, deltaPeer: 3.1 },
  { id: "eurusd-carry", instrument: "EUR/USD Carry", assetClass: "FX", allocation: 14.0, ownReturn: 3.8, deltaIndex: 2.6, deltaPeer: 1.4 },
  { id: "brent-crude", instrument: "Brent Crude Futures", assetClass: "Commodities", allocation: 12.25, ownReturn: -2.1, deltaIndex: -3.0, deltaPeer: -1.8 },
  { id: "gold-spot", instrument: "Gold Spot", assetClass: "Commodities", allocation: 10.75, ownReturn: 8.9, deltaIndex: 6.7, deltaPeer: 5.2 },
  { id: "spx-overlay", instrument: "S&P 500 E-mini Overlay", assetClass: "Equities Overlay", allocation: 16.0, ownReturn: 5.1, deltaIndex: 0.2, deltaPeer: 1.9 },
  { id: "jpy-momentum", instrument: "JPY/USD Momentum", assetClass: "FX", allocation: 9.5, ownReturn: -0.6, deltaIndex: -1.4, deltaPeer: -0.2 },
  { id: "ig-credit", instrument: "Investment Grade Credit Spread", assetClass: "Credit", allocation: 11.0, ownReturn: 4.2, deltaIndex: 2.9, deltaPeer: 1.6 },
  { id: "audcad-cross", instrument: "AUD/CAD Cross", assetClass: "FX", allocation: 8.0, ownReturn: 1.9, deltaIndex: 0.7, deltaPeer: -0.3 },
];

export const ASSET_CLASSES: AssetClass[] = ["Rates", "FX", "Commodities", "Equities Overlay", "Credit"];

export const COHORT = { size: 341, rank: 27 };

export function cohortPercentile(): number {
  return Math.round(((COHORT.size - COHORT.rank) / COHORT.size) * 100);
}

export const PROFILE = {
  name: "Renata Kessler",
  handle: "renatakessler",
  strategyName: "Solstice Macro",
  title: "Systematic Macro, Multi-Asset",
  location: "Toronto, CA",
  audited: true,
  liveSince: "Feb 2022",
  trackRecordLabel: "4.4 yr live",
  copiers: 4128,
  bio: "Solstice Macro trades interest rate, FX, and commodity futures with a systematic, rules-based process rebalanced daily. Live capital since February 2022 — the 24 months shown are the full published return history on Meridian.",
};

export function formatPercent(n: number, opts: { signed?: boolean } = {}): string {
  const sign = opts.signed && n > 0 ? "+" : "";
  return `${sign}${n.toFixed(2)}%`;
}

export function formatPoints(n: number): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(2)}pp`;
}

export function formatCount(n: number): string {
  return n.toLocaleString("en-US");
}
