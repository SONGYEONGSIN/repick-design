// native/src/watchlist/data.ts — deterministic watchlist dummy data
// (no random/current-time non-deterministic APIs — all fixed values, pure computation)

export type WatchItem = {
  id: string;
  title: string;
  original: number; // price when added to the watchlist (KRW) — fixed value
  current: number; // current price (KRW) — fixed value
  alertOn: boolean; // initial price alert state — deterministic fixed value
  priceSeries: number[]; // last 12 days' price trend (KRW) — deterministic fixed values, last = current
};

// Watchlist domain data, distinct from the AI match results (MATCHES).
// priceSeries: a hand-fixed 12-point trend with no random/current-time values (last = current).
export const WATCHLIST: WatchItem[] = [
  {
    id: "w1", title: "Film camera · Olympus mju II", original: 320000, current: 289000, alertOn: true,
    priceSeries: [320000, 316000, 312000, 305000, 301000, 298000, 296000, 294000, 292000, 291000, 290000, 289000],
  },
  {
    id: "w2", title: "Denim jacket · Levi's Type III", original: 145000, current: 145000, alertOn: false,
    priceSeries: [145000, 146000, 145000, 144000, 145000, 146000, 145000, 145000, 144000, 145000, 145000, 145000],
  },
  {
    id: "w3", title: "Vintage amplifier · Marantz 2270", original: 890000, current: 940000, alertOn: true,
    priceSeries: [890000, 895000, 900000, 908000, 915000, 920000, 925000, 928000, 932000, 936000, 938000, 940000],
  },
  {
    id: "w4", title: "Fountain pen · Pilot Custom 823", original: 260000, current: 228000, alertOn: false,
    priceSeries: [260000, 255000, 250000, 246000, 242000, 239000, 236000, 234000, 231000, 230000, 229000, 228000],
  },
  {
    id: "w5", title: "Lounge chair · Eames Soft Pad", original: 1200000, current: 1150000, alertOn: true,
    priceSeries: [1200000, 1195000, 1188000, 1182000, 1178000, 1172000, 1168000, 1164000, 1160000, 1156000, 1153000, 1150000],
  },
];

// Thousands-separated KRW formatting — avoids toLocaleString (environment-independent, deterministic).
export function formatKRW(won: number): string {
  const sign = won < 0 ? "-" : "";
  const digits = Math.abs(won).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${sign}₩${digits}`;
}

export type PriceChange = { kind: "drop" | "rise" | "flat"; label: string };

// Current vs. original price change → badge text (deterministic computation, no side effects).
export function priceChange(item: WatchItem): PriceChange {
  const delta = item.current - item.original;
  if (delta < 0) return { kind: "drop", label: `Down ${formatKRW(-delta)}` };
  if (delta > 0) return { kind: "rise", label: `Up ${formatKRW(delta)}` };
  return { kind: "flat", label: "No change" };
}

// Time-series change rate (%) — (last-first)/first, 1 decimal place. Deterministic pure computation.
export function seriesChangePct(series: number[]): number {
  if (series.length < 2 || series[0] === 0) return 0;
  const delta = series[series.length - 1] - series[0];
  return Math.round((delta / series[0]) * 1000) / 10;
}

// Change text — direction shown by sign (+/−), not color (single-accent DNA · "never convey by color alone").
export function pctLabel(series: number[]): string {
  const p = seriesChangePct(series);
  const sign = p > 0 ? "+" : ""; // negative numbers already include '-'
  return `${sign}${p.toFixed(1)}%`;
}
