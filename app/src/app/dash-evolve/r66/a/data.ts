// Gridwell — deterministic fixture data for the grid-balancing operations console.
//
// Hard-rule compliance notes:
// - No Math.random / Date.now / new Date anywhere in this module. Every curve below comes from a
//   fixed shape function (`hump`, `wave`) applied to a fixed index — hourly index 0..23 or daily
//   index 0..29 — so the same input always produces the same output on the server and the client.
// - Nothing is stored as an independently-typed "plausible" number. `solarMw`/`windMw`/`gasMw`/
//   `storageMw`/`demandMw` are the only authored fields; `supplyOf()`, `balanceOf()`,
//   `renewableShareOf()` and the grid-wide totals are always *derived* from those four + demand, so
//   a headline figure can never silently disagree with the breakdown it was built from.

export type Bucket = {
  solarMw: number;
  windMw: number;
  gasMw: number;
  storageMw: number;
  demandMw: number;
};

export type ChartBucket = Bucket & { label: string };

export function supplyOf(b: Bucket): number {
  return b.solarMw + b.windMw + b.gasMw + b.storageMw;
}

export function balanceOf(b: Bucket): number {
  return supplyOf(b) - b.demandMw;
}

export function renewableShareOf(b: Bucket): number {
  const supply = supplyOf(b);
  return supply > 0 ? ((b.solarMw + b.windMw) / supply) * 100 : 0;
}

export type RegionStatus = "surplus" | "balanced" | "tight" | "deficit";

export function statusOf(b: Bucket): RegionStatus {
  const ratio = b.demandMw > 0 ? (balanceOf(b) / b.demandMw) * 100 : 0;
  if (ratio >= 10) return "surplus";
  if (ratio >= -5) return "balanced";
  if (ratio >= -15) return "tight";
  return "deficit";
}

export const STATUS_LABEL: Record<RegionStatus, string> = {
  surplus: "Surplus",
  balanced: "Balanced",
  tight: "Tight",
  deficit: "Deficit",
};

// A fixed parabolic bump over a sample index — zero outside [peak - width, peak + width].
// Deterministic: the same (h, peak, width) always returns the same value.
function hump(h: number, peak: number, width: number): number {
  const d = h - peak;
  const v = 1 - (d * d) / (width * width);
  return v > 0 ? v : 0;
}

// A fixed, non-negative oscillation — used for wind, which blows at some baseline rate day and
// night with texture rather than a single midday peak.
function wave(h: number, base: number, amp: number, phase: number): number {
  return Math.max(0, base + amp * Math.sin(h * 0.5 + phase));
}

type RegionConfig = {
  id: string;
  name: string;
  code: string;
  description: string;
  solar: { peak: number; width: number; amp: number };
  wind: { base: number; amp: number; phase: number };
  gas: { base: number; amp: number };
  storage: { peak: number; width: number; amp: number };
  demand: { base: number; amp1: number; peak1: number; amp2: number; peak2: number };
  storageCapacityMwh: number;
  storageSocPct: number;
};

const REGION_CONFIGS: RegionConfig[] = [
  {
    id: "pnw",
    name: "Pacific Northwest",
    code: "PNW",
    description: "Wind-dominant corridor with fast-ramping storage for evening cover.",
    solar: { peak: 13, width: 7, amp: 900 },
    wind: { base: 2200, amp: 1400, phase: 0.3 },
    gas: { base: 600, amp: 500 },
    storage: { peak: 19, width: 4, amp: 450 },
    demand: { base: 3400, amp1: 900, peak1: 8, amp2: 1100, peak2: 19 },
    storageCapacityMwh: 1800,
    storageSocPct: 62,
  },
  {
    id: "dsw",
    name: "Desert Southwest",
    code: "DSW",
    description: "Utility-scale solar fleet with a steep midday-to-evening ramp.",
    solar: { peak: 13, width: 6, amp: 4200 },
    wind: { base: 500, amp: 300, phase: 1.1 },
    gas: { base: 900, amp: 700 },
    storage: { peak: 19, width: 3, amp: 1600 },
    demand: { base: 4200, amp1: 600, peak1: 9, amp2: 1800, peak2: 19 },
    storageCapacityMwh: 3200,
    storageSocPct: 74,
  },
  {
    id: "gc",
    name: "Gulf Coast",
    code: "GC",
    description: "Gas-anchored baseload with growing offshore wind interconnects.",
    solar: { peak: 13, width: 7, amp: 1200 },
    wind: { base: 700, amp: 500, phase: 2.0 },
    gas: { base: 4800, amp: 900 },
    storage: { peak: 18, width: 4, amp: 350 },
    demand: { base: 5200, amp1: 500, peak1: 9, amp2: 1300, peak2: 18 },
    storageCapacityMwh: 900,
    storageSocPct: 38,
  },
  {
    id: "gl",
    name: "Great Lakes",
    code: "GL",
    description: "Balanced wind and gas portfolio serving dense industrial load centers.",
    solar: { peak: 13, width: 7, amp: 1500 },
    wind: { base: 1800, amp: 1000, phase: 0.8 },
    gas: { base: 2600, amp: 700 },
    storage: { peak: 18, width: 4, amp: 400 },
    demand: { base: 4600, amp1: 700, peak1: 8, amp2: 1200, peak2: 19 },
    storageCapacityMwh: 1200,
    storageSocPct: 55,
  },
  {
    id: "mw",
    name: "Mountain West",
    code: "MW",
    description: "Solar-plus-storage buildout outpacing legacy gas retirements.",
    solar: { peak: 13, width: 6, amp: 2600 },
    wind: { base: 1300, amp: 800, phase: 1.6 },
    gas: { base: 900, amp: 400 },
    storage: { peak: 19, width: 3, amp: 1100 },
    demand: { base: 2900, amp1: 500, peak1: 8, amp2: 900, peak2: 19 },
    storageCapacityMwh: 2400,
    storageSocPct: 81,
  },
  {
    id: "atl",
    name: "Atlantic Seaboard",
    code: "ATL",
    description: "Offshore wind ramp lagging gas retirements; frequently tight on summer evenings.",
    solar: { peak: 13, width: 7, amp: 800 },
    wind: { base: 900, amp: 600, phase: 2.4 },
    gas: { base: 3600, amp: 800 },
    storage: { peak: 19, width: 4, amp: 300 },
    demand: { base: 4100, amp1: 600, peak1: 8, amp2: 1500, peak2: 19 },
    storageCapacityMwh: 700,
    storageSocPct: 29,
  },
];

function buildHourly(cfg: RegionConfig): Bucket[] {
  const out: Bucket[] = [];
  for (let h = 0; h < 24; h++) {
    const solarMw = Math.round(cfg.solar.amp * hump(h, cfg.solar.peak, cfg.solar.width));
    const windMw = Math.round(wave(h, cfg.wind.base, cfg.wind.amp, cfg.wind.phase));
    const gasMw = Math.round(cfg.gas.base + cfg.gas.amp * (1 - hump(h, 13, 9)));
    const storageMw = Math.round(cfg.storage.amp * hump(h, cfg.storage.peak, cfg.storage.width));
    const demandMw = Math.round(
      cfg.demand.base +
        cfg.demand.amp1 * hump(h, cfg.demand.peak1, 4) +
        cfg.demand.amp2 * hump(h, cfg.demand.peak2, 4),
    );
    out.push({ solarMw, windMw, gasMw, storageMw, demandMw });
  }
  return out;
}

function buildDaily(cfg: RegionConfig): Bucket[] {
  const out: Bucket[] = [];
  for (let d = 0; d < 30; d++) {
    const isWeekend = d % 7 === 5 || d % 7 === 6;
    const weekendFactor = isWeekend ? 0.88 : 1;
    const drift = 1 + 0.08 * Math.sin(d * 0.21);
    const solarMw = Math.round(cfg.solar.amp * 0.42 * drift);
    const windMw = Math.round(cfg.wind.base * 0.9 + cfg.wind.amp * 0.3 * Math.sin(d * 0.4 + cfg.wind.phase));
    const gasMw = Math.round(cfg.gas.base + cfg.gas.amp * 0.4);
    const storageMw = Math.round(cfg.storage.amp * 0.35 * drift);
    const demandMw = Math.round(
      cfg.demand.base * weekendFactor + (cfg.demand.amp1 + cfg.demand.amp2) * 0.3 * drift,
    );
    out.push({ solarMw, windMw, gasMw, storageMw, demandMw });
  }
  return out;
}

export type Region = {
  id: string;
  name: string;
  code: string;
  description: string;
  hourly: Bucket[];
  daily: Bucket[];
  storageCapacityMwh: number;
  storageSocPct: number;
};

export const REGIONS: Region[] = REGION_CONFIGS.map((cfg) => ({
  id: cfg.id,
  name: cfg.name,
  code: cfg.code,
  description: cfg.description,
  hourly: buildHourly(cfg),
  daily: buildDaily(cfg),
  storageCapacityMwh: cfg.storageCapacityMwh,
  storageSocPct: cfg.storageSocPct,
}));

function sumBuckets(buckets: Bucket[][]): Bucket[] {
  const len = buckets[0]?.length ?? 0;
  const out: Bucket[] = [];
  for (let i = 0; i < len; i++) {
    out.push({
      solarMw: buckets.reduce((a, arr) => a + arr[i].solarMw, 0),
      windMw: buckets.reduce((a, arr) => a + arr[i].windMw, 0),
      gasMw: buckets.reduce((a, arr) => a + arr[i].gasMw, 0),
      storageMw: buckets.reduce((a, arr) => a + arr[i].storageMw, 0),
      demandMw: buckets.reduce((a, arr) => a + arr[i].demandMw, 0),
    });
  }
  return out;
}

// Grid-wide totals, summed directly from every region's own arrays — never authored separately,
// so the stat strip and the chart can never disagree with the region rail.
export const GRID_HOURLY: Bucket[] = sumBuckets(REGIONS.map((r) => r.hourly));
export const GRID_DAILY: Bucket[] = sumBuckets(REGIONS.map((r) => r.daily));

export type TimeRange = "24h" | "7d" | "30d";

export function chartBuckets(range: TimeRange, source: { hourly: Bucket[]; daily: Bucket[] }): ChartBucket[] {
  if (range === "24h") {
    return source.hourly.map((b, i) => ({
      ...b,
      label: i === 23 ? "now" : i % 4 === 3 ? `-${23 - i}h` : "",
    }));
  }
  if (range === "7d") {
    const labels = ["-6d", "-5d", "-4d", "-3d", "-2d", "-1d", "today"];
    return source.daily.slice(-7).map((b, i) => ({ ...b, label: labels[i] }));
  }
  return source.daily.map((b, i) => ({
    ...b,
    label: i === 29 ? "today" : (29 - i) % 5 === 0 ? `-${29 - i}d` : "",
  }));
}

export const RANGE_LABEL: Record<TimeRange, string> = { "24h": "24h", "7d": "7d", "30d": "30d" };

const integerFormatter = new Intl.NumberFormat("en-US");
export function formatMw(n: number): string {
  return `${integerFormatter.format(Math.round(n))} MW`;
}
export function formatSignedMw(n: number): string {
  const rounded = Math.round(n);
  const sign = rounded > 0 ? "+" : rounded < 0 ? "−" : "";
  return `${sign}${integerFormatter.format(Math.abs(rounded))} MW`;
}
export function formatPct(n: number, digits = 1): string {
  return `${n.toFixed(digits)}%`;
}

export type Severity = "critical" | "warning" | "info";
export type EventStatus = "active" | "resolved";

export type GridEvent = {
  id: string;
  regionId: string;
  type: string;
  severity: Severity;
  message: string;
  time: string;
  status: EventStatus;
};

export const SEVERITY_LABEL: Record<Severity, string> = {
  critical: "Critical",
  warning: "Warning",
  info: "Info",
};

export const EVENTS: GridEvent[] = [
  {
    id: "gw-7a21c",
    regionId: "atl",
    type: "Reserve margin breach",
    severity: "critical",
    message: "Reserve margin fell to 3.1%, below the 5% operating floor.",
    time: "4m ago",
    status: "active",
  },
  {
    id: "gw-9f103",
    regionId: "gc",
    type: "Ramp rate exceeded",
    severity: "warning",
    message: "Gas fleet ramp rate exceeded 180 MW/min during the evening pickup.",
    time: "11m ago",
    status: "active",
  },
  {
    id: "gw-3b887",
    regionId: "atl",
    type: "Import dependency",
    severity: "warning",
    message: "Net imports exceeded 900 MW for the third consecutive hour.",
    time: "18m ago",
    status: "active",
  },
  {
    id: "gw-5e440",
    regionId: "dsw",
    type: "Curtailment event",
    severity: "info",
    message: "612 MW of solar curtailed on a local transmission constraint.",
    time: "26m ago",
    status: "active",
  },
  {
    id: "gw-1c902",
    regionId: "gc",
    type: "Storage SOC low",
    severity: "warning",
    message: "Battery state of charge dropped to 38%, below the 40% evening target.",
    time: "34m ago",
    status: "active",
  },
  {
    id: "gw-6d215",
    regionId: "mw",
    type: "Frequency deviation",
    severity: "info",
    message: "Frequency briefly touched 59.97 Hz before automatic generation control corrected it.",
    time: "41m ago",
    status: "active",
  },
  {
    id: "gw-8f331",
    regionId: "gl",
    type: "Forecast variance",
    severity: "info",
    message: "Wind output ran 9% below the morning forecast; gas fleet absorbed the gap.",
    time: "52m ago",
    status: "active",
  },
  {
    id: "gw-2a774",
    regionId: "atl",
    type: "Curtailment event",
    severity: "critical",
    message: "Offshore wind feeder tripped; 340 MW curtailed pending field inspection.",
    time: "1h ago",
    status: "active",
  },
  {
    id: "gw-4b690",
    regionId: "pnw",
    type: "Reserve margin breach",
    severity: "warning",
    message: "Reserve margin dipped to 7.4% during a short wind lull, now recovering.",
    time: "2h ago",
    status: "resolved",
  },
  {
    id: "gw-0c128",
    regionId: "dsw",
    type: "Ramp rate exceeded",
    severity: "warning",
    message: "Solar ramp-down rate exceeded 220 MW/min approaching sunset.",
    time: "3h ago",
    status: "resolved",
  },
  {
    id: "gw-7d556",
    regionId: "gc",
    type: "Storage SOC low",
    severity: "info",
    message: "Battery state of charge recovered to 61% after the overnight charge window.",
    time: "5h ago",
    status: "resolved",
  },
  {
    id: "gw-9e203",
    regionId: "gl",
    type: "Frequency deviation",
    severity: "critical",
    message: "A generator trip caused a 0.08 Hz dip; automatic generation control restored it in 90s.",
    time: "6h ago",
    status: "resolved",
  },
  {
    id: "gw-3f871",
    regionId: "mw",
    type: "Curtailment event",
    severity: "info",
    message: "184 MW of solar curtailed during a brief overgeneration window.",
    time: "9h ago",
    status: "resolved",
  },
];
