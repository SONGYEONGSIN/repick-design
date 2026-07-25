// native/src/detail/data.ts — price history detail (deterministic). No Math.random/Date.now.
export type PricePoint = { day: string; price: number };
export type ProductDetail = { title: string; grade: string; current: number; history: PricePoint[] };

// 14 days of fixed prices (KRW) → generates history (pure map, no non-deterministic APIs).
const PRICES = [520000, 515000, 510000, 505000, 500000, 498000, 495000, 492000, 490000, 487000, 485000, 483000, 481000, 480000];

export const DETAIL: ProductDetail = {
  title: "Vintage camera · Contax T2",
  grade: "S",
  current: PRICES[PRICES.length - 1],
  history: PRICES.map((price, i) => {
    const ago = PRICES.length - 1 - i;
    return { day: ago === 0 ? "Today" : `${ago}d ago`, price };
  }),
};

// Compact thousands axis label: 480000 → "480K" (rounded to the nearest 10K, matching the original's rounding granularity).
export function formatManwon(won: number): string {
  return `${Math.round(won / 10000) * 10}K`;
}

// Thousands-separated KRW (environment-independent, deterministic).
export function formatWon(won: number): string {
  const digits = Math.abs(won).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${won < 0 ? "-" : ""}₩${digits}`;
}

// History change rate (%) — (last-first)/first, 1 decimal place.
export function historyChangePct(history: PricePoint[]): number {
  if (history.length < 2 || history[0].price === 0) return 0;
  const delta = history[history.length - 1].price - history[0].price;
  return Math.round((delta / history[0].price) * 1000) / 10;
}

// Change text (direction shown by sign, not color — single-accent DNA).
export function pctText(pct: number): string {
  return `${pct > 0 ? "+" : ""}${pct.toFixed(1)}%`;
}
