// Deterministic dummy data for the Floorline comp terminal. No Math.random / Date.now / new Date
// anywhere — every series is a closed-form function of its day index, built from fixed constants
// declared per item below. Re-importing this module always yields byte-identical output.

import { round } from "./format";

export type Category = "camera" | "watch" | "sneaker" | "bag";
export type CompStatus = "active" | "sold" | "expired";

export interface SeriesPoint {
  t: number;
  repick: number;
  market: number;
  floor: number;
}

export interface Comp {
  id: string;
  source: string;
  price: number;
  conditionGrade: string;
  gradeConfidence: number; // 0..1, AI grading confidence
  ageDays: number;
  status: CompStatus;
}

export interface WatchItem {
  id: string;
  name: string;
  shortName: string;
  category: Category;
  roundingStep: number;
  series: SeriesPoint[];
  comps: Comp[];
}

const DAYS = 365;

interface SeriesSpec {
  base: number;
  slope: number; // fractional drift over the full year
  amp1: number;
  period1: number;
  phase1: number;
  amp2: number;
  period2: number;
  phase2: number;
  marketPremium: number; // external market sits this far above repick avg, on average
  marketAmp: number;
  floorRatio: number; // floor as a fraction of base
  roundingStep: number;
}

function buildSeries(spec: SeriesSpec): SeriesPoint[] {
  const pts: SeriesPoint[] = [];
  for (let i = 0; i < DAYS; i++) {
    const drift = 1 + spec.slope * (i / (DAYS - 1));
    const wave =
      spec.amp1 * Math.sin((i / spec.period1) * 2 * Math.PI + spec.phase1) +
      spec.amp2 * Math.cos((i / spec.period2) * 2 * Math.PI + spec.phase2);
    const repickRaw = spec.base * drift * (1 + wave);
    const marketWave = spec.marketAmp * Math.sin((i / (spec.period1 * 1.6)) * 2 * Math.PI + spec.phase2);
    const marketRaw = repickRaw * (1 + spec.marketPremium + marketWave);
    const floorRaw = spec.base * spec.floorRatio * (1 + spec.slope * 0.6 * (i / (DAYS - 1)));
    pts.push({
      t: i,
      repick: round(repickRaw, spec.roundingStep),
      market: round(marketRaw, spec.roundingStep),
      floor: round(floorRaw, spec.roundingStep),
    });
  }
  return pts;
}

function latest(series: SeriesPoint[]): SeriesPoint {
  return series[series.length - 1];
}

function buildComps(
  id: string,
  repickAvg: number,
  step: number,
  sources: string[],
  ratios: number[],
  grades: [string, number][],
  ages: number[],
  statuses: CompStatus[]
): Comp[] {
  return sources.map((source, i) => ({
    id: `${id}-comp-${i}`,
    source,
    price: round(repickAvg * ratios[i], step),
    conditionGrade: grades[i][0],
    gradeConfidence: grades[i][1],
    ageDays: ages[i],
    status: statuses[i],
  }));
}

const leicaSeries = buildSeries({
  base: 4200000,
  slope: 0.09,
  amp1: 0.03,
  period1: 42,
  phase1: 0.3,
  amp2: 0.012,
  period2: 130,
  phase2: 1.9,
  marketPremium: 0.07,
  marketAmp: 0.02,
  floorRatio: 0.8,
  roundingStep: 10000,
});

const fujiSeries = buildSeries({
  base: 2100000,
  slope: -0.05,
  amp1: 0.045,
  period1: 30,
  phase1: 1.1,
  amp2: 0.02,
  period2: 95,
  phase2: 0.6,
  marketPremium: 0.1,
  marketAmp: 0.03,
  floorRatio: 0.78,
  roundingStep: 5000,
});

const sonySeries = buildSeries({
  base: 1450000,
  slope: -0.11,
  amp1: 0.025,
  period1: 50,
  phase1: 2.4,
  amp2: 0.01,
  period2: 140,
  phase2: 0.2,
  marketPremium: 0.05,
  marketAmp: 0.018,
  floorRatio: 0.76,
  roundingStep: 5000,
});

const submarinerSeries = buildSeries({
  base: 15200000,
  slope: 0.05,
  amp1: 0.02,
  period1: 60,
  phase1: 0.8,
  amp2: 0.008,
  period2: 150,
  phase2: 2.7,
  marketPremium: 0.04,
  marketAmp: 0.012,
  floorRatio: 0.86,
  roundingStep: 50000,
});

const speedmasterSeries = buildSeries({
  base: 6500000,
  slope: 0.03,
  amp1: 0.022,
  period1: 55,
  phase1: 1.6,
  amp2: 0.01,
  period2: 110,
  phase2: 0.4,
  marketPremium: 0.06,
  marketAmp: 0.016,
  floorRatio: 0.82,
  roundingStep: 20000,
});

const nautilusSeries = buildSeries({
  base: 182000000,
  slope: -0.08,
  amp1: 0.035,
  period1: 48,
  phase1: 2.1,
  amp2: 0.015,
  period2: 160,
  phase2: 1.2,
  marketPremium: 0.11,
  marketAmp: 0.03,
  floorRatio: 0.88,
  roundingStep: 500000,
});

const aj1Series = buildSeries({
  base: 850000,
  slope: 0.14,
  amp1: 0.05,
  period1: 25,
  phase1: 0.5,
  amp2: 0.02,
  period2: 80,
  phase2: 2.9,
  marketPremium: 0.08,
  marketAmp: 0.035,
  floorRatio: 0.72,
  roundingStep: 5000,
});

const nb990Series = buildSeries({
  base: 280000,
  slope: 0.02,
  amp1: 0.03,
  period1: 20,
  phase1: 1.8,
  amp2: 0.012,
  period2: 70,
  phase2: 0.1,
  marketPremium: 0.03,
  marketAmp: 0.02,
  floorRatio: 0.75,
  roundingStep: 2000,
});

const birkinSeries = buildSeries({
  base: 22000000,
  slope: 0.06,
  amp1: 0.018,
  period1: 65,
  phase1: 2.5,
  amp2: 0.008,
  period2: 170,
  phase2: 0.9,
  marketPremium: 0.09,
  marketAmp: 0.02,
  floorRatio: 0.85,
  roundingStep: 100000,
});

const flapSeries = buildSeries({
  base: 13500000,
  slope: 0.04,
  amp1: 0.02,
  period1: 58,
  phase1: 0.2,
  amp2: 0.009,
  period2: 145,
  phase2: 1.4,
  marketPremium: 0.07,
  marketAmp: 0.018,
  floorRatio: 0.84,
  roundingStep: 50000,
});

export const WATCHLIST: WatchItem[] = [
  {
    id: "leica-m6",
    name: "Leica M6 Classic (0.72 finder)",
    shortName: "Leica M6",
    category: "camera",
    roundingStep: 10000,
    series: leicaSeries,
    comps: buildComps(
      "leica-m6",
      latest(leicaSeries).repick,
      10000,
      ["eBay", "KEH", "MPB", "eBay", "KEH", "MPB"],
      [1.08, 0.94, 1.02, 0.89, 1.12, 0.97],
      [["A-", 0.96], ["B+", 0.91], ["A", 0.98], ["B", 0.87], ["A-", 0.94], ["B+", 0.9]],
      [1, 3, 5, 8, 2, 11],
      ["active", "active", "active", "sold", "active", "expired"]
    ),
  },
  {
    id: "fuji-x100v",
    name: "Fujifilm X100V",
    shortName: "Fuji X100V",
    category: "camera",
    roundingStep: 5000,
    series: fujiSeries,
    comps: buildComps(
      "fuji-x100v",
      latest(fujiSeries).repick,
      5000,
      ["eBay", "MPB", "eBay", "KEH", "MPB", "eBay"],
      [0.95, 1.05, 0.9, 1.15, 0.98, 1.03],
      [["A", 0.97], ["B+", 0.89], ["B", 0.85], ["A-", 0.95], ["A", 0.99], ["B+", 0.92]],
      [0, 2, 6, 4, 9, 1],
      ["active", "active", "sold", "active", "expired", "active"]
    ),
  },
  {
    id: "sony-a7iii",
    name: "Sony α7 III (Body Only)",
    shortName: "Sony A7 III",
    category: "camera",
    roundingStep: 5000,
    series: sonySeries,
    comps: buildComps(
      "sony-a7iii",
      latest(sonySeries).repick,
      5000,
      ["eBay", "MPB", "KEH", "eBay", "MPB", "KEH"],
      [1.04, 0.92, 1.0, 0.87, 1.09, 0.96],
      [["A-", 0.93], ["B+", 0.88], ["A", 0.97], ["B", 0.84], ["A-", 0.91], ["B+", 0.89]],
      [3, 7, 2, 10, 1, 5],
      ["active", "active", "active", "expired", "active", "sold"]
    ),
  },
  {
    id: "rolex-submariner",
    name: "Rolex Submariner 116610LN",
    shortName: "Sub 116610LN",
    category: "watch",
    roundingStep: 50000,
    series: submarinerSeries,
    comps: buildComps(
      "rolex-submariner",
      latest(submarinerSeries).repick,
      50000,
      ["Chrono24", "eBay", "WatchBox", "Chrono24", "eBay", "WatchBox"],
      [1.03, 0.97, 1.06, 0.94, 1.01, 0.99],
      [["A", 0.98], ["B+", 0.9], ["A-", 0.95], ["B", 0.86], ["A", 0.97], ["A-", 0.93]],
      [2, 5, 1, 9, 3, 6],
      ["active", "active", "active", "sold", "active", "active"]
    ),
  },
  {
    id: "omega-speedmaster",
    name: "Omega Speedmaster Professional",
    shortName: "Speedmaster Pro",
    category: "watch",
    roundingStep: 20000,
    series: speedmasterSeries,
    comps: buildComps(
      "omega-speedmaster",
      latest(speedmasterSeries).repick,
      20000,
      ["Chrono24", "WatchBox", "eBay", "Chrono24", "eBay", "WatchBox"],
      [0.96, 1.08, 0.91, 1.02, 0.88, 1.05],
      [["A-", 0.94], ["A", 0.96], ["B", 0.85], ["B+", 0.9], ["B", 0.83], ["A-", 0.92]],
      [4, 1, 8, 2, 12, 3],
      ["active", "active", "expired", "active", "sold", "active"]
    ),
  },
  {
    id: "patek-nautilus",
    name: "Patek Philippe Nautilus 5711/1A",
    shortName: "Nautilus 5711",
    category: "watch",
    roundingStep: 500000,
    series: nautilusSeries,
    comps: buildComps(
      "patek-nautilus",
      latest(nautilusSeries).repick,
      500000,
      ["Chrono24", "WatchBox", "Chrono24", "eBay", "WatchBox"],
      [1.14, 0.96, 1.05, 0.9, 1.02],
      [["A", 0.99], ["A-", 0.95], ["A", 0.97], ["B+", 0.88], ["A-", 0.93]],
      [1, 4, 2, 7, 3],
      ["active", "active", "active", "expired", "active"]
    ),
  },
  {
    id: "aj1-chicago",
    name: 'Air Jordan 1 Retro High OG "Chicago"',
    shortName: "AJ1 Chicago",
    category: "sneaker",
    roundingStep: 5000,
    series: aj1Series,
    comps: buildComps(
      "aj1-chicago",
      latest(aj1Series).repick,
      5000,
      ["StockX", "GOAT", "eBay", "StockX", "GOAT", "eBay"],
      [1.06, 0.93, 1.11, 0.89, 0.98, 1.03],
      [["A", 0.97], ["B+", 0.9], ["A-", 0.94], ["B", 0.85], ["A", 0.96], ["B+", 0.88]],
      [0, 2, 5, 1, 3, 8],
      ["active", "active", "active", "sold", "active", "expired"]
    ),
  },
  {
    id: "nb-990v6",
    name: "New Balance 990v6 Made in USA",
    shortName: "NB 990v6",
    category: "sneaker",
    roundingStep: 2000,
    series: nb990Series,
    comps: buildComps(
      "nb-990v6",
      latest(nb990Series).repick,
      2000,
      ["StockX", "eBay", "GOAT", "StockX", "eBay", "GOAT"],
      [0.97, 1.05, 0.92, 1.01, 0.88, 1.08],
      [["A-", 0.92], ["B+", 0.87], ["A", 0.95], ["B", 0.83], ["B+", 0.89], ["A-", 0.91]],
      [3, 1, 6, 4, 9, 2],
      ["active", "active", "sold", "active", "expired", "active"]
    ),
  },
  {
    id: "hermes-birkin30",
    name: "Hermès Birkin 30 (Togo Leather)",
    shortName: "Birkin 30",
    category: "bag",
    roundingStep: 100000,
    series: birkinSeries,
    comps: buildComps(
      "hermes-birkin30",
      latest(birkinSeries).repick,
      100000,
      ["Fashionphile", "The RealReal", "eBay", "Fashionphile", "The RealReal"],
      [1.09, 0.95, 1.02, 0.91, 1.15],
      [["A", 0.98], ["A-", 0.94], ["B+", 0.89], ["B", 0.86], ["A", 0.97]],
      [2, 5, 8, 3, 1],
      ["active", "active", "expired", "active", "active"]
    ),
  },
  {
    id: "chanel-flap",
    name: "Chanel Classic Flap Medium",
    shortName: "Classic Flap Med.",
    category: "bag",
    roundingStep: 50000,
    series: flapSeries,
    comps: buildComps(
      "chanel-flap",
      latest(flapSeries).repick,
      50000,
      ["Fashionphile", "eBay", "The RealReal", "Fashionphile", "eBay"],
      [0.94, 1.07, 0.9, 1.01, 0.96],
      [["A-", 0.95], ["B+", 0.88], ["B", 0.85], ["A", 0.96], ["B+", 0.9]],
      [4, 1, 7, 2, 6],
      ["active", "active", "sold", "active", "active"]
    ),
  },
];

export function dayChangePct(series: SeriesPoint[]): number {
  const a = series[series.length - 2].repick;
  const b = series[series.length - 1].repick;
  return (b - a) / a;
}

export const CATEGORY_LABEL: Record<Category, string> = {
  camera: "Camera",
  watch: "Watch",
  sneaker: "Sneaker",
  bag: "Bag",
};

export const PERIODS = [
  { id: "7d", label: "7D", days: 7 },
  { id: "30d", label: "30D", days: 30 },
  { id: "90d", label: "90D", days: 90 },
  { id: "1y", label: "1Y", days: 365 },
] as const;

export type PeriodId = (typeof PERIODS)[number]["id"];

export function sliceForPeriod(series: SeriesPoint[], periodId: PeriodId): SeriesPoint[] {
  const period = PERIODS.find((p) => p.id === periodId) ?? PERIODS[3];
  return series.slice(Math.max(0, series.length - period.days));
}
