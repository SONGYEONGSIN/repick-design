// Portlane — deterministic domain data. No Math.random / Date.now / new-Date-object usage anywhere:
// every "random-looking" value below is a pure function of a fixed seed, so SSR and client renders
// always agree (see `pseudo`) and every date label is built from fixed calendar arithmetic rather
// than an instantiated date object (see `dateFromOffset`).
import type { Carrier, Mode, Period, Shipment, ShipmentStatus, SeriesPoint, StatusFilter, TrackingEvent } from "./types";

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

/** Deterministic pseudo-random value in [0,1) from a numeric seed — reproducible on server + client. */
function pseudo(seed: number): number {
  const x = Math.sin(seed * 12.9898) * 43758.5453123;
  return x - Math.floor(x);
}

function seedFromString(s: string): number {
  let seed = 0;
  for (let i = 0; i < s.length; i += 1) seed += s.charCodeAt(i) * (i + 7);
  return seed;
}

/* ---------------------------------------------------------------------- *
 * Calendar arithmetic without instantiating a runtime date object — pure
 * offset math from a fixed anchor, so labels are deterministic and stable
 * across renders/timezones.
 * ---------------------------------------------------------------------- */

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTH_LENGTHS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const ANCHOR_MONTH_IDX = 7; // August (0-based)
const ANCHOR_DAY = 13;

function dateFromOffset(offsetDays: number): { month: string; day: number } {
  let day = ANCHOR_DAY;
  let monthIdx = ANCHOR_MONTH_IDX;
  let remaining = Math.abs(offsetDays);
  if (offsetDays >= 0) {
    while (remaining > 0) {
      day += 1;
      if (day > MONTH_LENGTHS[monthIdx]) {
        day = 1;
        monthIdx = (monthIdx + 1) % 12;
      }
      remaining -= 1;
    }
  } else {
    while (remaining > 0) {
      day -= 1;
      if (day < 1) {
        monthIdx = (monthIdx - 1 + 12) % 12;
        day = MONTH_LENGTHS[monthIdx];
      }
      remaining -= 1;
    }
  }
  return { month: MONTH_NAMES[monthIdx], day };
}

export function labelFromOffset(offsetDays: number): string {
  const { month, day } = dateFromOffset(offsetDays);
  return `${month} ${day}`;
}

export function fullLabelFromOffset(offsetDays: number, timeLabel?: string): string {
  const base = labelFromOffset(offsetDays);
  if (offsetDays === 0) return timeLabel ? `Today, ${timeLabel}` : "Today";
  if (offsetDays === -1) return timeLabel ? `Yesterday, ${timeLabel}` : "Yesterday";
  if (offsetDays === 1) return timeLabel ? `Tomorrow, ${timeLabel}` : "Tomorrow";
  return timeLabel ? `${base}, ${timeLabel}` : base;
}

/* ---------------------------------------------------------------------- *
 * Carriers
 * ---------------------------------------------------------------------- */

export const CARRIERS: Carrier[] = [
  { id: "norvane", name: "Norvane Freight", shortName: "Norvane", primaryMode: "Truck" },
  { id: "blueharbor", name: "Blue Harbor Line", shortName: "Blue Harbor", primaryMode: "Ocean" },
  { id: "cresthaul", name: "Cresthaul Logistics", shortName: "Cresthaul", primaryMode: "Truck" },
  { id: "suncrest", name: "Suncrest Rail", shortName: "Suncrest", primaryMode: "Rail" },
  { id: "atlasintermodal", name: "Atlas Intermodal", shortName: "Atlas", primaryMode: "Rail" },
  { id: "kestrelair", name: "Kestrel Air Cargo", shortName: "Kestrel", primaryMode: "Air" },
];

export function getCarrier(id: string): Carrier {
  return CARRIERS.find((c) => c.id === id) ?? CARRIERS[0];
}

/* ---------------------------------------------------------------------- *
 * Fleet-wide on-time trend + per-carrier overlay (deterministic, pure fns
 * of "days ago" so every period toggle reads a consistent "today" value).
 * ---------------------------------------------------------------------- */

export const FORECAST_DAYS = 6;

/** Fleet-wide on-time percentage, `daysAgo` days before today (0 = today). */
function fleetOnTime(daysAgo: number): number {
  const seasonal = 5 * Math.sin(daysAgo / 11.3);
  const weekly = 3 * Math.sin(((daysAgo % 7) / 7) * 2 * Math.PI + 1.2);
  const noise = (pseudo(daysAgo * 3.71 + 4.2) - 0.5) * 5;
  return round2(clamp(83 + seasonal + weekly + noise, 60, 98));
}

/** Deterministic per-carrier deviation from the fleet baseline, plus its own light noise. */
function carrierOnTime(carrierId: string, daysAgo: number): number {
  const seed = seedFromString(carrierId);
  const bias = ((seed % 17) - 8) * 1.15; // roughly -9..+9
  const noise = (pseudo(seed * 0.913 + daysAgo * 2.07) - 0.5) * 4;
  return round2(clamp(fleetOnTime(daysAgo) + bias + noise, 52, 99));
}

const PERIOD_DAYS: Record<Period, number> = { "30D": 30, "60D": 60, "90D": 90 };

function forecastMid(daysAhead: number): number {
  const recentSlope = (fleetOnTime(0) - fleetOnTime(6)) / 6;
  const wiggle = (pseudo(1000 + daysAhead * 5.5) - 0.5) * 1.6;
  return clamp(fleetOnTime(0) + recentSlope * daysAhead + wiggle, 55, 99);
}

function forecastBandHalfWidth(daysAhead: number): number {
  return round2(1.4 * Math.sqrt(daysAhead) + 0.9);
}

export function getFleetSeries(period: Period): SeriesPoint[] {
  const days = PERIOD_DAYS[period];
  const points: SeriesPoint[] = [];
  for (let daysAgo = days - 1; daysAgo >= 0; daysAgo -= 1) {
    points.push({
      offset: -daysAgo,
      label: labelFromOffset(-daysAgo),
      fullLabel: fullLabelFromOffset(-daysAgo),
      value: fleetOnTime(daysAgo),
      isForecast: false,
    });
  }
  for (let daysAhead = 1; daysAhead <= FORECAST_DAYS; daysAhead += 1) {
    const mid = round2(forecastMid(daysAhead));
    const half = forecastBandHalfWidth(daysAhead);
    points.push({
      offset: daysAhead,
      label: labelFromOffset(daysAhead),
      fullLabel: fullLabelFromOffset(daysAhead),
      value: mid,
      isForecast: true,
      lower: round2(clamp(mid - half, 45, 99)),
      upper: round2(clamp(mid + half, 45, 100)),
    });
  }
  return points;
}

export function getCarrierOverlaySeries(carrierId: string, period: Period): SeriesPoint[] {
  const days = PERIOD_DAYS[period];
  const points: SeriesPoint[] = [];
  for (let daysAgo = days - 1; daysAgo >= 0; daysAgo -= 1) {
    points.push({
      offset: -daysAgo,
      label: labelFromOffset(-daysAgo),
      fullLabel: fullLabelFromOffset(-daysAgo),
      value: carrierOnTime(carrierId, daysAgo),
      isForecast: false,
    });
  }
  return points;
}

export const FLEET_TODAY_PCT = fleetOnTime(0);
export const FLEET_PERIOD_START = {
  "30D": fleetOnTime(29),
  "60D": fleetOnTime(59),
  "90D": fleetOnTime(89),
} as const;
export const FLEET_FORECAST_LOW = round2(clamp(forecastMid(FORECAST_DAYS) - forecastBandHalfWidth(FORECAST_DAYS), 45, 99));
export const FLEET_FORECAST_HIGH = round2(clamp(forecastMid(FORECAST_DAYS) + forecastBandHalfWidth(FORECAST_DAYS), 45, 100));

/* ---------------------------------------------------------------------- *
 * Carrier scorecard (aggregated from the fleet series so the numbers stay
 * internally consistent rather than being separately hand-authored).
 * ---------------------------------------------------------------------- */

export interface CarrierScoreRow {
  carrier: Carrier;
  onTimePct: number;
  avgDelayHours: number;
  activeShipments: number;
}

export function getCarrierScorecard(): CarrierScoreRow[] {
  return CARRIERS.map((carrier) => {
    const onTimePct = carrierOnTime(carrier.id, 0);
    const seed = seedFromString(carrier.id);
    const avgDelayHours = round2(clamp(((100 - onTimePct) / 100) * 9 + (pseudo(seed * 1.31) - 0.5) * 1.2, 0, 12));
    const activeShipments = SHIPMENTS.filter((s) => s.carrierId === carrier.id && s.status !== "delivered").length;
    return { carrier, onTimePct, avgDelayHours, activeShipments };
  }).sort((a, b) => b.onTimePct - a.onTimePct);
}

/* ---------------------------------------------------------------------- *
 * Shipments
 * ---------------------------------------------------------------------- */

const DISPATCHERS = [
  { name: "Priya Navarro", role: "Ops Coordinator", photoId: "1633332755192-727a05c4013d" },
  { name: "Malik Osei", role: "Dispatcher", photoId: "1500648767791-00dcc994a43e" },
  { name: "Elena Furst", role: "Dispatcher", photoId: "1519244703995-f4e0f30006d5" },
  { name: "Theo Bracken", role: "Ops Coordinator", photoId: "1544005313-94ddf0286df2" },
  { name: "Ingrid Solheim", role: "Dispatcher", photoId: "1580489944761-15a19d654956" },
];

type EventTemplate = { label: string; icon: TrackingEvent["icon"] };

const EVENT_TEMPLATES: Record<Mode, EventTemplate[]> = {
  Truck: [
    { label: "Order manifested", icon: "package" },
    { label: "Picked up at origin", icon: "truck" },
    { label: "In transit", icon: "truck" },
    { label: "Arrived at destination hub", icon: "warehouse" },
    { label: "Out for delivery", icon: "truck" },
    { label: "Delivered", icon: "check" },
  ],
  Ocean: [
    { label: "Booking confirmed", icon: "package" },
    { label: "Loaded at origin port", icon: "ship" },
    { label: "Departed port", icon: "ship" },
    { label: "Customs clearance", icon: "customs" },
    { label: "Arrived at destination port", icon: "warehouse" },
    { label: "Delivered", icon: "check" },
  ],
  Rail: [
    { label: "Railcar loaded", icon: "package" },
    { label: "Departed origin yard", icon: "truck" },
    { label: "In transit — rail network", icon: "truck" },
    { label: "Arrived at destination yard", icon: "warehouse" },
    { label: "Delivered", icon: "check" },
  ],
  Air: [
    { label: "Manifested", icon: "package" },
    { label: "Departed origin airport", icon: "plane" },
    { label: "Customs clearance", icon: "customs" },
    { label: "Arrived at destination airport", icon: "warehouse" },
    { label: "Delivered", icon: "check" },
  ],
};

function buildEvents(mode: Mode, status: ShipmentStatus, scheduleOffset: number, seed: number): TrackingEvent[] {
  const template = EVENT_TEMPLATES[mode];
  const progress = status === "delivered" ? 1 : status === "delayed" ? 0.45 : status === "at_risk" ? 0.6 : 0.72;
  const doneCount = status === "delivered" ? template.length : Math.max(1, Math.round(progress * (template.length - 1)));
  const spacingDays = Math.max(1, Math.round(Math.abs(scheduleOffset) / template.length) || 1);
  return template.map((t, i) => {
    const done = i < doneCount;
    const eventOffset = done
      ? scheduleOffset - (template.length - 1 - i) * spacingDays - Math.round(pseudo(seed + i * 2.3) * 1)
      : scheduleOffset - (template.length - 1 - i) * spacingDays + Math.round(pseudo(seed + i * 1.7) * 2);
    const hour = 6 + Math.floor(pseudo(seed + i * 5.1) * 14);
    const minute = Math.floor(pseudo(seed + i * 7.9) * 4) * 15;
    const timeLabel = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
    return {
      id: `${mode}-${i}`,
      label: t.label,
      timeLabel: done ? fullLabelFromOffset(clamp(eventOffset, -89, 6), timeLabel) : "Expected — not yet reported",
      done,
      icon: t.icon,
    };
  });
}

interface ShipmentSeed {
  id: string;
  originCode: string;
  originCity: string;
  destCode: string;
  destCity: string;
  carrierId: string;
  mode: Mode;
  status: ShipmentStatus;
  etaDeltaHours: number;
  scheduleOffset: number;
  distanceKm: number;
  weightKg: number;
  dispatcherIdx: number;
}

const SHIPMENT_SEEDS: ShipmentSeed[] = [
  { id: "PL-4102", originCode: "LGB", originCity: "Long Beach, US", destCode: "MEM", destCity: "Memphis, US", carrierId: "blueharbor", mode: "Ocean", status: "at_risk", etaDeltaHours: 6.5, scheduleOffset: 2, distanceKm: 3186, weightKg: 18420, dispatcherIdx: 1 },
  { id: "PL-4118", originCode: "ORD", originCity: "Chicago, US", destCode: "DFW", destCity: "Dallas, US", carrierId: "norvane", mode: "Truck", status: "on_time", etaDeltaHours: -1.2, scheduleOffset: 1, distanceKm: 1295, weightKg: 9840, dispatcherIdx: 0 },
  { id: "PL-4127", originCode: "SAV", originCity: "Savannah, US", destCode: "ATL", destCity: "Atlanta, US", carrierId: "cresthaul", mode: "Truck", status: "delayed", etaDeltaHours: 14.8, scheduleOffset: -1, distanceKm: 402, weightKg: 6210, dispatcherIdx: 2 },
  { id: "PL-4133", originCode: "OAK", originCity: "Oakland, US", destCode: "PHX", destCity: "Phoenix, US", carrierId: "atlasintermodal", mode: "Rail", status: "on_time", etaDeltaHours: 0.4, scheduleOffset: 3, distanceKm: 1191, weightKg: 24100, dispatcherIdx: 3 },
  { id: "PL-4141", originCode: "DFW", originCity: "Dallas, US", destCode: "JFK", destCity: "New York, US", carrierId: "kestrelair", mode: "Air", status: "on_time", etaDeltaHours: -0.6, scheduleOffset: 0, distanceKm: 2223, weightKg: 3120, dispatcherIdx: 4 },
  { id: "PL-4156", originCode: "HOU", originCity: "Houston, US", destCode: "MSP", destCity: "Minneapolis, US", carrierId: "suncrest", mode: "Rail", status: "at_risk", etaDeltaHours: 5.2, scheduleOffset: 4, distanceKm: 1732, weightKg: 27650, dispatcherIdx: 1 },
  { id: "PL-4162", originCode: "SEA", originCity: "Seattle, US", destCode: "DEN", destCity: "Denver, US", carrierId: "norvane", mode: "Truck", status: "on_time", etaDeltaHours: 1.1, scheduleOffset: 2, distanceKm: 1642, weightKg: 11280, dispatcherIdx: 0 },
  { id: "PL-4170", originCode: "MIA", originCity: "Miami, US", destCode: "EWR", destCity: "Newark, US", carrierId: "kestrelair", mode: "Air", status: "delayed", etaDeltaHours: 9.3, scheduleOffset: -2, distanceKm: 1757, weightKg: 2860, dispatcherIdx: 4 },
  { id: "PL-4183", originCode: "LGB", originCity: "Long Beach, US", destCode: "OAK", destCity: "Oakland, US", carrierId: "blueharbor", mode: "Ocean", status: "on_time", etaDeltaHours: -2.4, scheduleOffset: 5, distanceKm: 611, weightKg: 15900, dispatcherIdx: 2 },
  { id: "PL-4191", originCode: "ATL", originCity: "Atlanta, US", destCode: "ORD", destCity: "Chicago, US", carrierId: "cresthaul", mode: "Truck", status: "at_risk", etaDeltaHours: 4.6, scheduleOffset: 1, distanceKm: 1046, weightKg: 8410, dispatcherIdx: 3 },
  { id: "PL-4204", originCode: "MEM", originCity: "Memphis, US", destCode: "SEA", destCity: "Seattle, US", carrierId: "atlasintermodal", mode: "Rail", status: "delivered", etaDeltaHours: -3.1, scheduleOffset: -4, distanceKm: 3418, weightKg: 22040, dispatcherIdx: 1 },
  { id: "PL-4212", originCode: "DEN", originCity: "Denver, US", destCode: "PHX", destCity: "Phoenix, US", carrierId: "norvane", mode: "Truck", status: "on_time", etaDeltaHours: 0.2, scheduleOffset: 6, distanceKm: 943, weightKg: 7320, dispatcherIdx: 0 },
  { id: "PL-4229", originCode: "JFK", originCity: "New York, US", destCode: "MIA", destCity: "Miami, US", carrierId: "kestrelair", mode: "Air", status: "on_time", etaDeltaHours: -1.8, scheduleOffset: 3, distanceKm: 1757, weightKg: 2410, dispatcherIdx: 4 },
];

export const SHIPMENTS: Shipment[] = SHIPMENT_SEEDS.map((s) => {
  const seed = seedFromString(s.id);
  const dispatcher = DISPATCHERS[s.dispatcherIdx];
  return {
    id: s.id,
    originCode: s.originCode,
    originCity: s.originCity,
    destCode: s.destCode,
    destCity: s.destCity,
    carrierId: s.carrierId,
    mode: s.mode,
    status: s.status,
    scheduledEtaLabel: fullLabelFromOffset(s.scheduleOffset, `${String(8 + (seed % 9)).padStart(2, "0")}:00`),
    predictedEtaLabel: fullLabelFromOffset(
      s.scheduleOffset,
      `${String(clamp(8 + (seed % 9) + Math.round(s.etaDeltaHours), 0, 23)).padStart(2, "0")}:${s.etaDeltaHours % 1 !== 0 ? "30" : "00"}`,
    ),
    etaDeltaHours: s.etaDeltaHours,
    distanceKm: s.distanceKm,
    weightKg: s.weightKg,
    dispatcher,
    events: buildEvents(s.mode, s.status, s.scheduleOffset, seed),
  };
});

export function getShipment(id: string): Shipment | undefined {
  return SHIPMENTS.find((s) => s.id === id);
}

/** Default selection on first render: the least-delivered, highest-risk shipment. */
export const DEFAULT_SHIPMENT_ID = SHIPMENTS.filter((s) => s.status !== "delivered").reduce((worst, s) =>
  s.etaDeltaHours > worst.etaDeltaHours ? s : worst,
).id;

export const STATUS_META: Record<ShipmentStatus, { label: string; abbr: string }> = {
  on_time: { label: "On time", abbr: "On time" },
  at_risk: { label: "At risk", abbr: "At risk" },
  delayed: { label: "Delayed", abbr: "Delayed" },
  delivered: { label: "Delivered", abbr: "Delivered" },
};

export const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "on_time", label: "On time" },
  { value: "at_risk", label: "At risk" },
  { value: "delayed", label: "Delayed" },
];

/* ---------------------------------------------------------------------- *
 * Formatters (Intl-based)
 * ---------------------------------------------------------------------- */

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function formatSignedHours(value: number): string {
  const sign = value > 0 ? "+" : value < 0 ? "−" : "";
  return `${sign}${Math.abs(value).toFixed(1)}h`;
}

export function formatKm(value: number): string {
  return `${new Intl.NumberFormat("en-US").format(value)} km`;
}

export function formatKg(value: number): string {
  return `${new Intl.NumberFormat("en-US").format(value)} kg`;
}

export function formatCount(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}
