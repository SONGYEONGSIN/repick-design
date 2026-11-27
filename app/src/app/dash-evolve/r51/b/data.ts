// Clearbid — programmatic ad-exchange yield intelligence. Every derived number (status, current
// CPM, delta, market index, feed events) is computed from the base fields below at module load —
// nothing is hand-duplicated, so two displayed numbers for the same fact can never disagree.
// Deterministic by construction: trig-based synthetic series (no Math.random), no Date object of
// any kind (time labels are plain strings) — so the page renders identically on server and client.

export type ExchangeType = "Display" | "CTV" | "Video" | "PMP" | "Mobile" | "Native" | "Audio" | "DOOH" | "Retail media";
export type Region = "US-East" | "US-West" | "EU" | "APAC";
export type Status = "healthy" | "degraded" | "at-risk";
export type Period = "24H" | "7D" | "30D";
export type FeedType = "win" | "loss" | "timeout";

export const PERIODS: Period[] = ["24H", "7D", "30D"];
export const PERIOD_POINTS: Record<Period, number> = { "24H": 24, "7D": 7, "30D": 30 };

/** One label per data point (not a sparse tick set) — the chart decides which of these it draws
 *  on the axis, but the hover/keyboard inspector can always show the exact label for any index. */
export const PERIOD_AXIS: Record<Period, string[]> = {
  "24H": Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, "0")}:00`),
  "7D": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  "30D": Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`),
};

/** The ops team's contracted CPM floor — a flat reference line, not a second time series, so the
 *  chart's two lines stay honestly distinct in what they represent (observed vs. committed). */
export const TARGET_CPM = 3.25;

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

type ExchangeSeed = {
  id: string;
  name: string;
  type: ExchangeType;
  region: Region;
  following: boolean;
  baseCpm: number;
  volatility: number;
  /** Fractional drift applied across a full 30-day window; shorter periods scale it down. */
  trendPct: number;
  winRate: number;
  fillRate: number;
  latencyMs: number;
  bidsPerMin: number;
};

const SEED: ExchangeSeed[] = [
  { id: "vx", name: "Vertex Open Exchange", type: "Display", region: "US-East", following: false, baseCpm: 2.4, volatility: 0.18, trendPct: 0.05, winRate: 52, fillRate: 91, latencyMs: 85, bidsPerMin: 1840 },
  { id: "sb", name: "StreamBid CTV Pool", type: "CTV", region: "US-West", following: true, baseCpm: 9.8, volatility: 0.9, trendPct: 0.08, winRate: 61, fillRate: 88, latencyMs: 140, bidsPerMin: 420 },
  { id: "lv", name: "Lattice Video Network", type: "Video", region: "EU", following: true, baseCpm: 6.1, volatility: 0.6, trendPct: -0.1, winRate: 38, fillRate: 74, latencyMs: 160, bidsPerMin: 310 },
  { id: "pm", name: "Pinpoint PMP Deals", type: "PMP", region: "US-East", following: false, baseCpm: 7.4, volatility: 0.4, trendPct: 0.03, winRate: 68, fillRate: 95, latencyMs: 60, bidsPerMin: 180 },
  { id: "hz", name: "Horizon Mobile Exchange", type: "Mobile", region: "APAC", following: true, baseCpm: 1.6, volatility: 0.25, trendPct: -0.22, winRate: 24, fillRate: 58, latencyMs: 210, bidsPerMin: 960 },
  { id: "nw", name: "Northwind Native Supply", type: "Native", region: "EU", following: false, baseCpm: 2.1, volatility: 0.15, trendPct: 0.04, winRate: 55, fillRate: 89, latencyMs: 95, bidsPerMin: 540 },
  { id: "ca", name: "Cascade Audio Exchange", type: "Audio", region: "US-West", following: false, baseCpm: 3.3, volatility: 0.3, trendPct: -0.05, winRate: 41, fillRate: 80, latencyMs: 130, bidsPerMin: 260 },
  { id: "md", name: "Meridian DOOH Network", type: "DOOH", region: "APAC", following: true, baseCpm: 5.2, volatility: 0.35, trendPct: 0.06, winRate: 58, fillRate: 93, latencyMs: 70, bidsPerMin: 90 },
  { id: "fs", name: "Fieldstone Header Bidding", type: "Display", region: "US-East", following: true, baseCpm: 2.0, volatility: 0.12, trendPct: 0.02, winRate: 49, fillRate: 90, latencyMs: 100, bidsPerMin: 2100 },
  { id: "tm", name: "Tally Retail Media", type: "Retail media", region: "US-East", following: true, baseCpm: 11.4, volatility: 1.1, trendPct: -0.3, winRate: 19, fillRate: 42, latencyMs: 230, bidsPerMin: 150 },
];

export function computeStatus(winRate: number, latencyMs: number): Status {
  if (winRate < 30 || latencyMs > 180) return "at-risk";
  if (winRate < 45 || latencyMs > 120) return "degraded";
  return "healthy";
}

function buildSeries(seed: ExchangeSeed, exchangeIndex: number): Record<Period, number[]> {
  const phase = exchangeIndex * 0.73;
  function one(pts: number, trendScale: number): number[] {
    const out: number[] = [];
    for (let i = 0; i < pts; i++) {
      const progress = pts > 1 ? i / (pts - 1) : 0;
      const cyclical = Math.sin(progress * Math.PI * 2 + phase) * seed.volatility;
      const trend = seed.baseCpm * seed.trendPct * trendScale * progress;
      out.push(round2(Math.max(0.15, seed.baseCpm + cyclical + trend)));
    }
    return out;
  }
  return {
    "24H": one(PERIOD_POINTS["24H"], PERIOD_POINTS["24H"] / 30),
    "7D": one(PERIOD_POINTS["7D"], PERIOD_POINTS["7D"] / 30),
    "30D": one(PERIOD_POINTS["30D"], 1),
  };
}

const LINE_ITEM_POOL = [
  "NovaAuto SUV Launch",
  "FreshBrew Coffee — Spring",
  "Lumen Mobile Carrier Q4",
  "Peak Fitness App Install",
  "Solstice Travel Getaway",
  "BrightPath Insurance",
  "Orbit Streaming Bundle",
  "GreenLeaf Grocery Delivery",
];
const FEED_TIME_POOL = ["2m ago", "7m ago", "13m ago", "21m ago", "29m ago", "41m ago"];
const FEED_TYPE_CYCLE: FeedType[] = ["win", "win", "loss", "win", "timeout", "win"];

export type FeedEvent = { id: string; time: string; type: FeedType; cpm: number; lineItem: string };

function buildFeed(seed: ExchangeSeed, exchangeIndex: number, currentCpm: number): FeedEvent[] {
  const events: FeedEvent[] = [];
  for (let k = 0; k < 6; k++) {
    const type = FEED_TYPE_CYCLE[(exchangeIndex + k) % FEED_TYPE_CYCLE.length];
    const swing = ((k % 3) - 1) * 0.04;
    const cpm = type === "loss" || type === "timeout" ? 0 : round2(currentCpm * (1 + swing));
    events.push({
      id: `${seed.id}-f${k}`,
      time: FEED_TIME_POOL[k],
      type,
      cpm,
      lineItem: LINE_ITEM_POOL[(exchangeIndex * 3 + k) % LINE_ITEM_POOL.length],
    });
  }
  return events;
}

export type Exchange = {
  id: string;
  name: string;
  type: ExchangeType;
  region: Region;
  following: boolean;
  status: Status;
  winRate: number;
  fillRate: number;
  latencyMs: number;
  bidsPerMin: number;
  seriesByPeriod: Record<Period, number[]>;
  currentCpm: number;
  deltaPct: number;
  feed: FeedEvent[];
};

export const EXCHANGES: Exchange[] = SEED.map((seed, i) => {
  const seriesByPeriod = buildSeries(seed, i);
  const day = seriesByPeriod["24H"];
  const currentCpm = day[day.length - 1];
  const deltaPct = round2(((currentCpm - day[0]) / day[0]) * 100);
  return {
    id: seed.id,
    name: seed.name,
    type: seed.type,
    region: seed.region,
    following: seed.following,
    status: computeStatus(seed.winRate, seed.latencyMs),
    winRate: seed.winRate,
    fillRate: seed.fillRate,
    latencyMs: seed.latencyMs,
    bidsPerMin: seed.bidsPerMin,
    seriesByPeriod,
    currentCpm,
    deltaPct,
    feed: buildFeed(seed, i, currentCpm),
  };
});

export const FOLLOWING = EXCHANGES.filter((e) => e.following);
export const EXCHANGE_TYPES: ExchangeType[] = Array.from(new Set(EXCHANGES.map((e) => e.type)));

/** Market CPM index — the mean of every exchange's series at each tick. Derived, never a separate
 *  hand-typed array, so the chart's headline number always agrees with the table beneath it. */
export const MARKET_SERIES: Record<Period, number[]> = (() => {
  const out: Record<Period, number[]> = { "24H": [], "7D": [], "30D": [] };
  for (const period of PERIODS) {
    const pts = PERIOD_POINTS[period];
    for (let i = 0; i < pts; i++) {
      const sum = EXCHANGES.reduce((acc, e) => acc + e.seriesByPeriod[period][i], 0);
      out[period].push(round2(sum / EXCHANGES.length));
    }
  }
  return out;
})();

const SEVERITY: Record<Status, number> = { "at-risk": 3, degraded: 2, healthy: 1 };

/** Default selection on first paint: the followed exchange in the worst state, not an empty
 *  "select something" placeholder. Tie-broken by the lower win rate (the more exposed one). */
export const DEFAULT_SELECTED_ID = FOLLOWING.reduce((worst, e) =>
  SEVERITY[e.status] > SEVERITY[worst.status] || (SEVERITY[e.status] === SEVERITY[worst.status] && e.winRate < worst.winRate)
    ? e
    : worst
).id;

export const STATUS_LABEL: Record<Status, string> = {
  healthy: "Healthy",
  degraded: "Degraded",
  "at-risk": "At risk",
};

export const CURRENCY = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const PERCENT = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
export const INTEGER = new Intl.NumberFormat("en-US");
