export type Grade = "A" | "B" | "C";
export type GradeFilter = "ALL" | Grade;
export type Delivery = "pickup" | "ship";

export type Metro = {
  code: string;
  name: string;
  state: string;
  col: number;
  row: number;
  idx: number;
  inventory: number;
  per10k: number;
  aShare: number;
  shipDays: number;
  shipBase: number;
  note: string;
};

const M_SEA: Metro = {
  code: "SEA",
  name: "Seattle",
  state: "WA",
  col: 0,
  row: 0,
  idx: 1.03,
  inventory: 214,
  per10k: 3.4,
  aShare: 41,
  shipDays: 3,
  shipBase: 34,
  note: "Corporate upgrade cycles keep grade-A stock unusually deep, and sellers price like they know it.",
};
const M_POR: Metro = {
  code: "POR",
  name: "Portland",
  state: "OR",
  col: 0,
  row: 1,
  idx: 0.96,
  inventory: 132,
  per10k: 4.6,
  aShare: 32,
  shipDays: 3,
  shipBase: 32,
  note: "Coastal supply without coastal demand: the quietest discount on the west side of the index.",
};
const M_BAY: Metro = {
  code: "BAY",
  name: "Bay Area",
  state: "CA",
  col: 0,
  row: 2,
  idx: 1.09,
  inventory: 388,
  per10k: 4.9,
  aShare: 47,
  shipDays: 3,
  shipBase: 31,
  note: "Deep supply and the highest prices on the board, which is the proof that volume alone never sets the number.",
};
const M_LAX: Metro = {
  code: "LAX",
  name: "Los Angeles",
  state: "CA",
  col: 0,
  row: 3,
  idx: 0.98,
  inventory: 341,
  per10k: 4.4,
  aShare: 35,
  shipDays: 2,
  shipBase: 29,
  note: "Enormous turnover holds the median almost exactly on the national line, week after week.",
};
const M_PHX: Metro = {
  code: "PHX",
  name: "Phoenix",
  state: "AZ",
  col: 1,
  row: 3,
  idx: 0.91,
  inventory: 168,
  per10k: 6.4,
  aShare: 27,
  shipDays: 2,
  shipBase: 26,
  note: "Fast churn, a younger resale market and heavier B and C stock: the widest discount in the index.",
};
const M_DEN: Metro = {
  code: "DEN",
  name: "Denver",
  state: "CO",
  col: 2,
  row: 2,
  idx: 1.01,
  inventory: 121,
  per10k: 3.9,
  aShare: 36,
  shipDays: 2,
  shipBase: 21,
  note: "Thin inventory keeps sellers patient, and patient sellers keep the median just above the line.",
};
const M_MSP: Metro = {
  code: "MSP",
  name: "Minneapolis",
  state: "MN",
  col: 3,
  row: 0,
  idx: 0.99,
  inventory: 104,
  per10k: 3.6,
  aShare: 38,
  shipDays: 1,
  shipBase: 12,
  note: "A small pool of clean stock with one-day freight: the cheapest metro to buy from once shipping counts.",
};
const M_DAL: Metro = {
  code: "DAL",
  name: "Dallas",
  state: "TX",
  col: 2,
  row: 3,
  idx: 0.94,
  inventory: 236,
  per10k: 5.2,
  aShare: 30,
  shipDays: 1,
  shipBase: 19,
  note: "High supply per resident plus short freight, so the discount survives the delivery math.",
};
const M_CHI: Metro = {
  code: "CHI",
  name: "Chicago",
  state: "IL",
  col: 3,
  row: 1,
  idx: 1.0,
  inventory: 219,
  per10k: 4.1,
  aShare: 34,
  shipDays: 0,
  shipBase: 0,
  note: "Your metro. Every other price on this page is measured against what you would pay at home.",
};
const M_ATL: Metro = {
  code: "ATL",
  name: "Atlanta",
  state: "GA",
  col: 3,
  row: 3,
  idx: 0.93,
  inventory: 205,
  per10k: 5.8,
  aShare: 29,
  shipDays: 2,
  shipBase: 17,
  note: "Deep supply with softer grades: a real discount that carries a condition footnote.",
};
const M_NYC: Metro = {
  code: "NYC",
  name: "New York",
  state: "NY",
  col: 4,
  row: 1,
  idx: 1.08,
  inventory: 402,
  per10k: 3.1,
  aShare: 44,
  shipDays: 1,
  shipBase: 16,
  note: "The most listings and the fewest per resident, which is how density becomes demand instead of supply.",
};
const M_BOS: Metro = {
  code: "BOS",
  name: "Boston",
  state: "MA",
  col: 5,
  row: 0,
  idx: 1.05,
  inventory: 147,
  per10k: 3.3,
  aShare: 42,
  shipDays: 2,
  shipBase: 19,
  note: "Institutional buyers keep clean stock scarce, and scarcity keeps the premium steady.",
};

export const METROS: Metro[] = [
  M_SEA,
  M_POR,
  M_BAY,
  M_LAX,
  M_PHX,
  M_DEN,
  M_MSP,
  M_DAL,
  M_CHI,
  M_ATL,
  M_NYC,
  M_BOS,
];

export const HOME_CODE = "CHI";

export function getMetro(code: string): Metro {
  const found = METROS.find((m) => m.code === code);
  return found === undefined ? M_CHI : found;
}

export type Model = {
  id: string;
  name: string;
  spec: string;
  category: string;
  base: number;
  retail: number;
  weight: number;
  deltas: Record<string, number>;
};

const MD_PHONE: Model = {
  id: "lumen14",
  name: "Lumen 14 Pro",
  spec: "256 GB · unlocked",
  category: "Phone",
  base: 742,
  retail: 1049,
  weight: 0.9,
  deltas: {
    SEA: 0.01,
    POR: -0.02,
    BAY: 0.03,
    LAX: -0.04,
    PHX: -0.03,
    DEN: 0,
    MSP: 0.02,
    DAL: -0.02,
    CHI: 0.01,
    ATL: -0.01,
    NYC: 0.02,
    BOS: 0.03,
  },
};

const MD_TABLET: Model = {
  id: "slate11",
  name: "Slate Air 11",
  spec: "128 GB · Wi-Fi",
  category: "Tablet",
  base: 388,
  retail: 549,
  weight: 1.1,
  deltas: {
    SEA: -0.02,
    POR: 0.03,
    BAY: -0.01,
    LAX: 0.02,
    PHX: 0.04,
    DEN: -0.03,
    MSP: -0.02,
    DAL: 0.03,
    CHI: -0.01,
    ATL: 0.02,
    NYC: -0.03,
    BOS: -0.02,
  },
};

const MD_LAPTOP: Model = {
  id: "vessel14",
  name: "Vessel Book 14",
  spec: "512 GB · M-class",
  category: "Laptop",
  base: 1164,
  retail: 1699,
  weight: 1.7,
  deltas: {
    SEA: 0.04,
    POR: -0.01,
    BAY: -0.05,
    LAX: 0.01,
    PHX: 0.02,
    DEN: 0.03,
    MSP: -0.03,
    DAL: -0.01,
    CHI: 0.02,
    ATL: -0.02,
    NYC: 0.01,
    BOS: -0.01,
  },
};

const MD_BUDS: Model = {
  id: "orbitbuds",
  name: "Orbit Buds Pro",
  spec: "ANC · 2nd generation",
  category: "Audio",
  base: 132,
  retail: 199,
  weight: 0.5,
  deltas: {
    SEA: -0.03,
    POR: 0.01,
    BAY: 0.02,
    LAX: 0.03,
    PHX: -0.01,
    DEN: -0.02,
    MSP: 0.03,
    DAL: 0.01,
    CHI: -0.03,
    ATL: 0.04,
    NYC: -0.01,
    BOS: 0.02,
  },
};

export const MODELS: Model[] = [MD_PHONE, MD_TABLET, MD_LAPTOP, MD_BUDS];

export function getModel(id: string): Model {
  const found = MODELS.find((m) => m.id === id);
  return found === undefined ? MD_PHONE : found;
}

export type Listing = {
  id: string;
  metro: string;
  grade: Grade;
  price: number;
  match: number;
  verified: boolean;
  ageMonths: number;
};

/** Lehmer generator. Fully deterministic: identical output on every render, server and client. */
function lehmer(seed: number): () => number {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 48271) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function forcedGrade(k: number): Grade | null {
  if (k === 0) return "A";
  if (k === 1) return "B";
  if (k === 2) return "C";
  return null;
}

function gradeMult(g: Grade): number {
  if (g === "A") return 1;
  if (g === "B") return 0.88;
  return 0.74;
}

function buildListings(model: Model, metro: Metro, mi: number, ri: number): Listing[] {
  const rand = lehmer(7919 + mi * 131 + ri * 17);
  const count = 7 + ((ri * 3 + mi * 5) % 5);
  const idx = metro.idx + (model.deltas[metro.code] ?? 0);
  const out: Listing[] = [];
  for (let k = 0; k < count; k++) {
    const forced = forcedGrade(k);
    let grade: Grade;
    if (forced !== null) {
      grade = forced;
    } else if (rand() < metro.aShare / 100) {
      grade = "A";
    } else {
      grade = rand() < 0.62 ? "B" : "C";
    }
    const jitter = 0.962 + rand() * 0.076;
    const price = Math.round(model.base * idx * gradeMult(grade) * jitter);
    const match = 86 + Math.round(rand() * 13);
    const verified = rand() < 0.74;
    const ageMonths = 5 + Math.round(rand() * 23);
    out.push({
      id: `${model.id}-${metro.code}-${k}`,
      metro: metro.code,
      grade,
      price,
      match,
      verified,
      ageMonths,
    });
  }
  return out;
}

const LISTINGS: Record<string, Listing[]> = {};
MODELS.forEach((model, mi) => {
  const rows: Listing[] = [];
  METROS.forEach((metro, ri) => {
    buildListings(model, metro, mi, ri).forEach((l) => rows.push(l));
  });
  LISTINGS[model.id] = rows;
});

export function listingsOf(modelId: string): Listing[] {
  const rows = LISTINGS[modelId];
  return rows === undefined ? [] : rows;
}

export function median(xs: number[]): number {
  if (xs.length === 0) return 0;
  const s = [...xs].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  const hi = s.at(mid) ?? 0;
  if (s.length % 2 === 1) return hi;
  const lo = s.at(mid - 1) ?? hi;
  return Math.round((lo + hi) / 2);
}

export function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

export function shipCostFor(model: Model, metro: Metro): number {
  return Math.round(metro.shipBase * model.weight);
}

export const NATIONAL = {
  per10k: round1(METROS.reduce((a, m) => a + m.per10k, 0) / METROS.length),
  aShare: Math.round(METROS.reduce((a, m) => a + m.aShare, 0) / METROS.length),
  ship: Math.round(METROS.reduce((a, m) => a + m.shipBase, 0) / METROS.length),
  inventory: METROS.reduce((a, m) => a + m.inventory, 0),
};

function stepOf(delta: number): number {
  if (delta <= -6) return 0;
  if (delta <= -2) return 1;
  if (delta < 2) return 2;
  if (delta < 6) return 3;
  return 4;
}

/** Single-hue density ramp: dim = below the national line, bright = above it. */
export function rampColor(step: number): string {
  if (step <= 0) return "#101B2E";
  if (step === 1) return "#16304F";
  if (step === 2) return "#1C4278";
  if (step === 3) return "#1E52A6";
  return "#2563EB";
}

/** Same ordering, lifted for 2px marks so every tick clears 3:1 against the page. */
export function tickColor(step: number): string {
  if (step <= 0) return "#4A6289";
  if (step === 1) return "#3E7BD1";
  if (step === 2) return "#4E8CE8";
  if (step === 3) return "#6BA5F5";
  return "#93C5FD";
}

export const RAMP_LEGEND: { color: string; label: string }[] = [
  { color: "#101B2E", label: "6% or more under" },
  { color: "#16304F", label: "2 to 6 under" },
  { color: "#1C4278", label: "on the line" },
  { color: "#1E52A6", label: "2 to 6 over" },
  { color: "#2563EB", label: "6% or more over" },
];

export type MetroStat = {
  metro: Metro;
  count: number;
  base: number;
  ship: number;
  eff: number;
  delta: number;
  step: number;
  rank: number;
};

export type Tick = { listing: Listing; eff: number; step: number };

export type Snapshot = {
  model: Model;
  line: number;
  min: number;
  max: number;
  total: number;
  stats: MetroStat[];
  ranked: MetroStat[];
  ticks: Tick[];
  low: MetroStat;
  high: MetroStat;
  home: MetroStat;
  spread: number;
  spreadPct: number;
  medianA: number;
  medianC: number;
  aShare: number;
};

export function buildSnapshot(modelId: string, grade: GradeFilter, delivery: Delivery): Snapshot {
  const model = getModel(modelId);
  const all = listingsOf(model.id);
  const shipOf = (code: string): number =>
    delivery === "ship" ? shipCostFor(model, getMetro(code)) : 0;

  const rows = all.filter((l) => grade === "ALL" || l.grade === grade);
  const priced = rows.map((l) => ({ listing: l, eff: l.price + shipOf(l.metro) }));
  const line = median(priced.map((p) => p.eff));

  const stats: MetroStat[] = METROS.map((metro) => {
    const mine = priced.filter((p) => p.listing.metro === metro.code);
    const eff = median(mine.map((p) => p.eff));
    const ship = shipOf(metro.code);
    const delta = line === 0 ? 0 : ((eff - line) / line) * 100;
    return {
      metro,
      count: mine.length,
      base: eff - ship,
      ship,
      eff,
      delta: round1(delta),
      step: stepOf(delta),
      rank: 0,
    };
  });

  const ranked = [...stats].sort((a, b) => a.eff - b.eff);
  ranked.forEach((s, i) => {
    s.rank = i + 1;
  });

  const stepByCode: Record<string, number> = {};
  stats.forEach((s) => {
    stepByCode[s.metro.code] = s.step;
  });

  const ticks: Tick[] = priced.map((p) => ({
    listing: p.listing,
    eff: p.eff,
    step: stepByCode[p.listing.metro] ?? 2,
  }));

  const effs = ticks.map((t) => t.eff);
  const min = effs.length === 0 ? 0 : effs.reduce((a, b) => (b < a ? b : a));
  const max = effs.length === 0 ? 0 : effs.reduce((a, b) => (b > a ? b : a));

  const low = stats.reduce((a, b) => (b.eff < a.eff ? b : a));
  const high = stats.reduce((a, b) => (b.eff > a.eff ? b : a));
  const homeFound = stats.find((s) => s.metro.code === HOME_CODE);
  const home = homeFound === undefined ? low : homeFound;

  const aRows = all.filter((l) => l.grade === "A");
  const cRows = all.filter((l) => l.grade === "C");
  const spread = high.eff - low.eff;

  return {
    model,
    line,
    min,
    max,
    total: ticks.length,
    stats,
    ranked,
    ticks,
    low,
    high,
    home,
    spread,
    spreadPct: line === 0 ? 0 : round1((spread / line) * 100),
    medianA: median(aRows.map((l) => l.price + shipOf(l.metro))),
    medianC: median(cRows.map((l) => l.price + shipOf(l.metro))),
    aShare: all.length === 0 ? 0 : Math.round((aRows.length / all.length) * 100),
  };
}

export function usd(n: number): string {
  const v = Math.round(n);
  const body = Math.abs(v)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return (v < 0 ? "−$" : "$") + body;
}

export function pct(d: number): string {
  const r = round1(d);
  const sign = r > 0 ? "+" : r < 0 ? "−" : "±";
  return sign + Math.abs(r).toFixed(1) + "%";
}

export function gradeLabel(g: GradeFilter): string {
  if (g === "ALL") return "All grades";
  return "Grade " + g;
}

/* ---- hex cartogram geometry: pointy-top, odd rows offset by half a cell ---- */
export const MAP_W = 500;
export const MAP_H = 320;
export const HEX_W = 79.674;
export const HEX_R = 46;
export const V_STEP = 69;
export const HEX_PATH =
  "M 0 -46 L 39.837 -23 L 39.837 23 L 0 46 L -39.837 23 L -39.837 -23 Z";

export function hexCenter(col: number, row: number): { x: number; y: number } {
  return {
    x: 8 + (col + (row % 2) * 0.5 + 0.5) * HEX_W,
    y: 8 + row * V_STEP + HEX_R,
  };
}

export function clampPct(n: number, lo: number, hi: number): number {
  if (n < lo) return lo;
  if (n > hi) return hi;
  return n;
}
