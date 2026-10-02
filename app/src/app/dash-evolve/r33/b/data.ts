// Routeline — regional delivery-ops console for Haulwell Logistics.
// All figures below are hand-authored, deterministic fixtures: no Math.random(), no Date.now(),
// no bare new Date(). Per-zone depot volumes are constructed so they sum exactly to the zone's
// weekly volume (see the comment above ZONES), and network totals are always derived with
// `reduce` over ZONES rather than re-typed as separate constants, so a total can never drift out
// of sync with its parts.

export type ZoneStatus = "on-track" | "watch" | "at-risk";
export type MetricKey = "onTime" | "incidents" | "revenue";

export interface Depot {
  name: string;
  volume: number;
  onTimeRate: number;
  status: ZoneStatus;
}

export interface Incident {
  id: string;
  dateLabel: string;
  depotName: string;
  cause: string;
  parcelsAffected: number;
}

export interface Zone {
  id: string;
  code: string;
  name: string;
  manager: string;
  initials: string;
  status: ZoneStatus;
  onTimeRate: number;
  weeklyVolume: number;
  delayIncidents: number;
  revenueAtRisk: number;
  depotCount: number;
  /** 8-week on-time-rate trend, oldest first, ending at `onTimeRate`. */
  trend: number[];
  depots: Depot[];
  incidents: Incident[];
  /** Precomputed flat-top hex geometry — fixed formulas, rounded to 2dp, never recomputed at
   *  render time so SSR and the client always agree on exact coordinates. */
  hex: { cx: number; cy: number; points: string };
}

/** SLA penalty exposure booked per open delay incident, in USD. A fixed constant rather than a
 *  magic per-zone number — this is what makes revenueAtRisk, and therefore every rollup built from
 *  it, reproducible from delayIncidents alone. */
export const PENALTY_PER_INCIDENT_USD = 420;

function statusFor(onTimeRate: number): ZoneStatus {
  if (onTimeRate >= 95) return "on-track";
  if (onTimeRate >= 90) return "watch";
  return "at-risk";
}

function initialsFor(name: string): string {
  const parts = name.split(" ");
  return `${parts[0]?.[0] ?? ""}${parts[parts.length - 1]?.[0] ?? ""}`.toUpperCase();
}

// Hex-grid geometry — a 4-column x 3-row offset grid of flat-top hexagons, standing in for
// Haulwell's 12 regional delivery zones. This is a deliberately abstracted instrument layout
// (hub-and-spoke honeycomb), not a literal map of any real territory: coordinates come from the
// fixed formulas below (center spacing = 1.5x hex radius horizontally, sqrt(3)x radius vertically,
// odd columns offset by half a row), evaluated once and rounded to 2 decimals.
export const HEX_VIEWBOX = { width: 492, height: 468 };

const HEX_CENTERS: { cx: number; cy: number; points: string }[] = [
  { cx: 120, cy: 112.5, points: "176,112.5 148,161 92,161 64,112.5 92,64 148,64" },
  { cx: 120, cy: 209.49, points: "176,209.49 148,257.99 92,257.99 64,209.49 92,160.99 148,160.99" },
  { cx: 120, cy: 306.49, points: "176,306.49 148,354.99 92,354.99 64,306.49 92,257.99 148,257.99" },
  { cx: 204, cy: 160.99, points: "260,160.99 232,209.49 176,209.49 148,160.99 176,112.49 232,112.49" },
  { cx: 204, cy: 257.99, points: "260,257.99 232,306.49 176,306.49 148,257.99 176,209.49 232,209.49" },
  { cx: 204, cy: 354.98, points: "260,354.98 232,403.48 176,403.48 148,354.98 176,306.48 232,306.48" },
  { cx: 288, cy: 112.5, points: "344,112.5 316,161 260,161 232,112.5 260,64 316,64" },
  { cx: 288, cy: 209.49, points: "344,209.49 316,257.99 260,257.99 232,209.49 260,160.99 316,160.99" },
  { cx: 288, cy: 306.49, points: "344,306.49 316,354.99 260,354.99 232,306.49 260,257.99 316,257.99" },
  { cx: 372, cy: 160.99, points: "428,160.99 400,209.49 344,209.49 316,160.99 344,112.49 400,112.49" },
  { cx: 372, cy: 257.99, points: "428,257.99 400,306.49 344,306.49 316,257.99 344,209.49 400,209.49" },
  { cx: 372, cy: 354.98, points: "428,354.98 400,403.48 344,403.48 316,354.98 344,306.48 400,306.48" },
];

interface ZoneSeed {
  code: string;
  name: string;
  manager: string;
  weeklyVolume: number;
  onTimeRate: number;
  delayIncidents: number;
  trend: number[];
  depots: Omit<Depot, "status">[];
  incidents: Incident[];
}

const SEEDS: ZoneSeed[] = [
  {
    code: "NW-01",
    name: "Cascade Gateway",
    manager: "Mara Lindqvist",
    weeklyVolume: 9800,
    onTimeRate: 97.8,
    delayIncidents: 4,
    trend: [96.1, 96.4, 96.9, 97.0, 97.3, 97.5, 97.6, 97.8],
    depots: [
      { name: "Cascade Gateway North Depot", volume: 4116, onTimeRate: 99.2 },
      { name: "Cascade Gateway South Depot", volume: 3234, onTimeRate: 97.2 },
      { name: "Cascade Gateway Central Depot", volume: 2450, onTimeRate: 96.8 },
    ],
    incidents: [
      { id: "NW-01-i1", dateLabel: "Sep 27", depotName: "Cascade Gateway South Depot", cause: "Weather delay", parcelsAffected: 62 },
      { id: "NW-01-i2", dateLabel: "Sep 22", depotName: "Cascade Gateway Central Depot", cause: "Volume surge", parcelsAffected: 38 },
    ],
  },
  {
    code: "NW-02",
    name: "Harborview",
    manager: "Devon Okafor",
    weeklyVolume: 7400,
    onTimeRate: 93.1,
    delayIncidents: 11,
    trend: [95.0, 94.6, 94.3, 93.9, 93.6, 93.4, 93.2, 93.1],
    depots: [
      { name: "Harborview North Depot", volume: 4292, onTimeRate: 94.2 },
      { name: "Harborview South Depot", volume: 3108, onTimeRate: 92.0 },
    ],
    incidents: [
      { id: "NW-02-i1", dateLabel: "Sep 29", depotName: "Harborview South Depot", cause: "Staffing shortage", parcelsAffected: 91 },
      { id: "NW-02-i2", dateLabel: "Sep 24", depotName: "Harborview North Depot", cause: "Routing error", parcelsAffected: 47 },
    ],
  },
  {
    code: "SW-01",
    name: "Mesa Verde Hub",
    manager: "Priya Chandran",
    weeklyVolume: 8600,
    onTimeRate: 96.4,
    delayIncidents: 6,
    trend: [95.8, 96.0, 95.9, 96.1, 96.2, 96.3, 96.3, 96.4],
    depots: [
      { name: "Mesa Verde North Depot", volume: 2752, onTimeRate: 97.6 },
      { name: "Mesa Verde South Depot", volume: 2322, onTimeRate: 96.7 },
      { name: "Mesa Verde Central Depot", volume: 1978, onTimeRate: 95.7 },
      { name: "Mesa Verde East Depot", volume: 1548, onTimeRate: 94.9 },
    ],
    incidents: [
      { id: "SW-01-i1", dateLabel: "Sep 26", depotName: "Mesa Verde East Depot", cause: "Vehicle breakdown", parcelsAffected: 29 },
      { id: "SW-01-i2", dateLabel: "Sep 19", depotName: "Mesa Verde Central Depot", cause: "Access delay", parcelsAffected: 24 },
    ],
  },
  {
    code: "SW-02",
    name: "Sundown Flats",
    manager: "Tobias Kern",
    weeklyVolume: 6200,
    onTimeRate: 88.3,
    delayIncidents: 19,
    trend: [92.0, 91.0, 90.2, 89.5, 89.0, 88.8, 88.5, 88.3],
    depots: [
      { name: "Sundown Flats North Depot", volume: 3596, onTimeRate: 89.4 },
      { name: "Sundown Flats South Depot", volume: 2604, onTimeRate: 87.2 },
    ],
    incidents: [
      { id: "SW-02-i1", dateLabel: "Sep 30", depotName: "Sundown Flats South Depot", cause: "Vehicle breakdown", parcelsAffected: 118 },
      { id: "SW-02-i2", dateLabel: "Sep 28", depotName: "Sundown Flats North Depot", cause: "Staffing shortage", parcelsAffected: 83 },
    ],
  },
  {
    code: "MW-01",
    name: "Union Yards",
    manager: "Renata Voss",
    weeklyVolume: 11200,
    onTimeRate: 95.2,
    delayIncidents: 9,
    trend: [94.6, 94.8, 94.9, 95.0, 95.0, 95.1, 95.1, 95.2],
    depots: [
      { name: "Union Yards North Depot", volume: 2912, onTimeRate: 96.6 },
      { name: "Union Yards South Depot", volume: 2464, onTimeRate: 95.9 },
      { name: "Union Yards Central Depot", volume: 2128, onTimeRate: 95.0 },
      { name: "Union Yards East Depot", volume: 1904, onTimeRate: 94.1 },
      { name: "Union Yards West Depot", volume: 1792, onTimeRate: 93.2 },
    ],
    incidents: [
      { id: "MW-01-i1", dateLabel: "Sep 25", depotName: "Union Yards West Depot", cause: "Volume surge", parcelsAffected: 54 },
      { id: "MW-01-i2", dateLabel: "Sep 18", depotName: "Union Yards East Depot", cause: "Routing error", parcelsAffected: 31 },
    ],
  },
  {
    code: "MW-02",
    name: "Prairie Loop",
    manager: "Callum Ashworth",
    weeklyVolume: 7900,
    onTimeRate: 91.7,
    delayIncidents: 14,
    trend: [93.8, 93.3, 92.9, 92.5, 92.1, 91.9, 91.8, 91.7],
    depots: [
      { name: "Prairie Loop North Depot", volume: 3318, onTimeRate: 93.1 },
      { name: "Prairie Loop South Depot", volume: 2607, onTimeRate: 91.1 },
      { name: "Prairie Loop Central Depot", volume: 1975, onTimeRate: 90.7 },
    ],
    incidents: [
      { id: "MW-02-i1", dateLabel: "Sep 29", depotName: "Prairie Loop Central Depot", cause: "Staffing shortage", parcelsAffected: 76 },
      { id: "MW-02-i2", dateLabel: "Sep 21", depotName: "Prairie Loop South Depot", cause: "Weather delay", parcelsAffected: 59 },
    ],
  },
  {
    code: "MW-03",
    name: "Lakeside Junction",
    manager: "Noor Haddad",
    weeklyVolume: 8300,
    onTimeRate: 94.6,
    delayIncidents: 10,
    trend: [94.0, 94.1, 94.3, 94.4, 94.5, 94.5, 94.6, 94.6],
    depots: [
      { name: "Lakeside Junction North Depot", volume: 3486, onTimeRate: 96.0 },
      { name: "Lakeside Junction South Depot", volume: 2739, onTimeRate: 94.0 },
      { name: "Lakeside Junction Central Depot", volume: 2075, onTimeRate: 93.6 },
    ],
    incidents: [
      { id: "MW-03-i1", dateLabel: "Sep 27", depotName: "Lakeside Junction Central Depot", cause: "Routing error", parcelsAffected: 41 },
      { id: "MW-03-i2", dateLabel: "Sep 20", depotName: "Lakeside Junction South Depot", cause: "Volume surge", parcelsAffected: 33 },
    ],
  },
  {
    code: "NE-01",
    name: "Ridgeway Corridor",
    manager: "Felix Marsh",
    weeklyVolume: 10400,
    onTimeRate: 98.5,
    delayIncidents: 3,
    trend: [97.2, 97.5, 97.8, 98.0, 98.1, 98.3, 98.4, 98.5],
    depots: [
      { name: "Ridgeway North Depot", volume: 3328, onTimeRate: 99.6 },
      { name: "Ridgeway South Depot", volume: 2808, onTimeRate: 98.8 },
      { name: "Ridgeway Central Depot", volume: 2392, onTimeRate: 97.8 },
      { name: "Ridgeway East Depot", volume: 1872, onTimeRate: 97.0 },
    ],
    incidents: [
      { id: "NE-01-i1", dateLabel: "Sep 23", depotName: "Ridgeway East Depot", cause: "Weather delay", parcelsAffected: 18 },
      { id: "NE-01-i2", dateLabel: "Sep 16", depotName: "Ridgeway South Depot", cause: "Access delay", parcelsAffected: 12 },
    ],
  },
  {
    code: "NE-02",
    name: "Harborfront",
    manager: "Simone Delacroix",
    weeklyVolume: 6700,
    onTimeRate: 92.0,
    delayIncidents: 13,
    trend: [94.2, 93.7, 93.2, 92.8, 92.5, 92.3, 92.1, 92.0],
    depots: [
      { name: "Harborfront North Depot", volume: 3886, onTimeRate: 93.1 },
      { name: "Harborfront South Depot", volume: 2814, onTimeRate: 90.9 },
    ],
    incidents: [
      { id: "NE-02-i1", dateLabel: "Sep 28", depotName: "Harborfront South Depot", cause: "Routing error", parcelsAffected: 68 },
      { id: "NE-02-i2", dateLabel: "Sep 20", depotName: "Harborfront North Depot", cause: "Volume surge", parcelsAffected: 45 },
    ],
  },
  {
    code: "SE-01",
    name: "Pine Bluff",
    manager: "Owen Baptiste",
    weeklyVolume: 7100,
    onTimeRate: 85.9,
    delayIncidents: 22,
    trend: [91.5, 90.0, 88.8, 87.9, 87.1, 86.6, 86.2, 85.9],
    depots: [
      { name: "Pine Bluff North Depot", volume: 2982, onTimeRate: 87.3 },
      { name: "Pine Bluff South Depot", volume: 2343, onTimeRate: 85.3 },
      { name: "Pine Bluff Central Depot", volume: 1775, onTimeRate: 84.9 },
    ],
    incidents: [
      { id: "SE-01-i1", dateLabel: "Sep 30", depotName: "Pine Bluff Central Depot", cause: "Staffing shortage", parcelsAffected: 134 },
      { id: "SE-01-i2", dateLabel: "Sep 27", depotName: "Pine Bluff South Depot", cause: "Vehicle breakdown", parcelsAffected: 97 },
    ],
  },
  {
    code: "SE-02",
    name: "Coastal Reach",
    manager: "Ingrid Solberg",
    weeklyVolume: 9600,
    onTimeRate: 96.9,
    delayIncidents: 5,
    trend: [96.3, 96.4, 96.6, 96.7, 96.7, 96.8, 96.9, 96.9],
    depots: [
      { name: "Coastal Reach North Depot", volume: 3072, onTimeRate: 98.1 },
      { name: "Coastal Reach South Depot", volume: 2592, onTimeRate: 97.2 },
      { name: "Coastal Reach Central Depot", volume: 2208, onTimeRate: 96.2 },
      { name: "Coastal Reach East Depot", volume: 1728, onTimeRate: 95.4 },
    ],
    incidents: [
      { id: "SE-02-i1", dateLabel: "Sep 24", depotName: "Coastal Reach East Depot", cause: "Weather delay", parcelsAffected: 22 },
      { id: "SE-02-i2", dateLabel: "Sep 17", depotName: "Coastal Reach North Depot", cause: "Access delay", parcelsAffected: 15 },
    ],
  },
  {
    code: "SE-03",
    name: "Delta Crossing",
    manager: "Marcus Whitfield",
    weeklyVolume: 5800,
    onTimeRate: 89.4,
    delayIncidents: 17,
    trend: [93.0, 92.0, 91.2, 90.5, 90.0, 89.8, 89.6, 89.4],
    depots: [
      { name: "Delta Crossing North Depot", volume: 3364, onTimeRate: 90.5 },
      { name: "Delta Crossing South Depot", volume: 2436, onTimeRate: 88.3 },
    ],
    incidents: [
      { id: "SE-03-i1", dateLabel: "Sep 29", depotName: "Delta Crossing South Depot", cause: "Volume surge", parcelsAffected: 88 },
      { id: "SE-03-i2", dateLabel: "Sep 22", depotName: "Delta Crossing North Depot", cause: "Routing error", parcelsAffected: 51 },
    ],
  },
];

export const ZONES: Zone[] = SEEDS.map((seed, index) => {
  const status = statusFor(seed.onTimeRate);
  const hex = HEX_CENTERS[index];
  if (!hex) throw new Error(`Missing hex geometry for zone index ${index}`);
  return {
    id: seed.code,
    code: seed.code,
    name: seed.name,
    manager: seed.manager,
    initials: initialsFor(seed.manager),
    status,
    onTimeRate: seed.onTimeRate,
    weeklyVolume: seed.weeklyVolume,
    delayIncidents: seed.delayIncidents,
    revenueAtRisk: seed.delayIncidents * PENALTY_PER_INCIDENT_USD,
    depotCount: seed.depots.length,
    trend: seed.trend,
    depots: seed.depots.map((d) => ({ ...d, status: statusFor(d.onTimeRate) })),
    incidents: seed.incidents,
    hex,
  };
});

export const ZONE_BY_ID: Record<string, Zone> = Object.fromEntries(ZONES.map((z) => [z.id, z]));

// --- Network rollups — always derived from ZONES via reduce, never retyped as independent
// constants, so a total can never go out of sync with the rows it is built from. ---
export const NETWORK = ZONES.reduce(
  (acc, z) => {
    acc.totalVolume += z.weeklyVolume;
    acc.totalIncidents += z.delayIncidents;
    acc.totalRevenueAtRisk += z.revenueAtRisk;
    acc.onTimeWeightedSum += z.onTimeRate * z.weeklyVolume;
    acc.depotCount += z.depotCount;
    return acc;
  },
  { totalVolume: 0, totalIncidents: 0, totalRevenueAtRisk: 0, onTimeWeightedSum: 0, depotCount: 0 }
);
export const NETWORK_ON_TIME_RATE = Math.round((NETWORK.onTimeWeightedSum / NETWORK.totalVolume) * 10) / 10;

export const STATUS_META: Record<ZoneStatus, { label: string }> = {
  "on-track": { label: "On track" },
  watch: { label: "Watch" },
  "at-risk": { label: "At risk" },
};

export interface MetricMeta {
  key: MetricKey;
  label: string;
  shortLabel: string;
  unit: string;
  higherIsBetter: boolean;
  value: (z: Zone) => number;
  format: (z: Zone) => string;
}

const numberFormatter = new Intl.NumberFormat("en-US");
const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export const METRICS: Record<MetricKey, MetricMeta> = {
  onTime: {
    key: "onTime",
    label: "On-time delivery rate",
    shortLabel: "On-time",
    unit: "%",
    higherIsBetter: true,
    value: (z) => z.onTimeRate,
    format: (z) => `${z.onTimeRate.toFixed(1)}%`,
  },
  incidents: {
    key: "incidents",
    label: "Delay incidents / week",
    shortLabel: "Incidents",
    unit: "",
    higherIsBetter: false,
    value: (z) => z.delayIncidents,
    format: (z) => numberFormatter.format(z.delayIncidents),
  },
  revenue: {
    key: "revenue",
    label: "Revenue at risk",
    shortLabel: "Rev. at risk",
    unit: "",
    higherIsBetter: false,
    value: (z) => z.revenueAtRisk,
    format: (z) => currencyFormatter.format(z.revenueAtRisk),
  },
};

export function formatVolume(n: number): string {
  return numberFormatter.format(n);
}

export function formatCurrency(n: number): string {
  return currencyFormatter.format(n);
}

/** Normalized 0..1 "degree of concern" for a zone on the given metric, relative to the rest of the
 *  network. Direction is flipped so that, for every metric, a higher result always means "needs
 *  more attention" — this is the value the map uses to set fill intensity, kept separate from hue
 *  (hue always encodes `status`, derived from onTimeRate alone, so the color key never changes
 *  meaning when the toggle changes). */
export function concernIntensity(zone: Zone, metric: MetricKey): number {
  const meta = METRICS[metric];
  const values = ZONES.map(meta.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  if (max === min) return 0.6;
  const normalized = (meta.value(zone) - min) / (max - min);
  const concern = meta.higherIsBetter ? 1 - normalized : normalized;
  return 0.32 + concern * 0.68;
}

export const NAV_SECTIONS = [
  {
    label: "Monitor",
    items: [
      { label: "Network overview", icon: "layout-grid" as const, active: true },
      { label: "Live shipments", icon: "truck" as const, active: false },
      { label: "Alerts", icon: "bell-ring" as const, active: false },
    ],
  },
  {
    label: "Manage",
    items: [
      { label: "Zones & depots", icon: "map-pinned" as const, active: false },
      { label: "Carriers", icon: "contact" as const, active: false },
      { label: "SLA policies", icon: "file-check-2" as const, active: false },
    ],
  },
  {
    label: "Workspace",
    items: [
      { label: "Reports", icon: "bar-chart-3" as const, active: false },
      { label: "Settings", icon: "settings" as const, active: false },
    ],
  },
];

export const WORKSPACES = ["Haulwell Logistics — US Network", "Haulwell Logistics — Sandbox"];
