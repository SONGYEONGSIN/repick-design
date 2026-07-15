// Deterministic dummy data for Waylight — fleet operations map dashboard.
// No Math.random / Date.now / no-arg new Date anywhere in this file.

export type ZoneId = "dtc" | "prt" | "rvd" | "egc" | "nhl";

export interface Zone {
  id: ZoneId;
  name: string;
  code: string;
  /** SVG polygon points in the shared 1000x600 map viewBox. */
  points: string;
  /** Label anchor point for the zone name inside the polygon. */
  labelX: number;
  labelY: number;
}

export const ZONES: Zone[] = [
  {
    id: "nhl",
    name: "North Hills",
    code: "NHL",
    points: "40,20 500,20 500,220 40,220",
    labelX: 60,
    labelY: 44,
  },
  {
    id: "prt",
    name: "Port Terminal",
    code: "PRT",
    points: "500,20 960,20 960,220 500,220",
    labelX: 780,
    labelY: 44,
  },
  {
    id: "dtc",
    name: "Downtown Core",
    code: "DTC",
    points: "40,220 960,220 960,380 40,380",
    labelX: 60,
    labelY: 244,
  },
  {
    id: "rvd",
    name: "Riverside District",
    code: "RVD",
    points: "40,380 500,380 500,560 40,560",
    labelX: 60,
    labelY: 404,
  },
  {
    id: "egc",
    name: "Eastgate Commons",
    code: "EGC",
    points: "500,380 960,380 960,560 500,560",
    labelX: 780,
    labelY: 404,
  },
];

/** Road network drawn as straight SVG line/polyline segments — no trig. */
export const VERTICAL_ROADS = [80, 220, 360, 500, 640, 780, 920];
export const HORIZONTAL_ROADS = [100, 220, 300, 380, 460, 540];
export const RING_ROAD_POINTS = "80,540 360,300 640,160 920,100";
export const ROAD_Y_MIN = 20;
export const ROAD_Y_MAX = 560;
export const ROAD_X_MIN = 40;
export const ROAD_X_MAX = 960;

export type VehicleStatus = "En Route" | "Loading" | "Idle" | "Delayed" | "Offline";

export interface Vehicle {
  id: string;
  driver: string;
  zoneId: ZoneId;
  status: VehicleStatus;
  x: number;
  y: number;
  speedKph: number;
  loadPct: number;
  stopsRemaining: number;
  etaMin: number | null;
  currentDeliveryId: string | null;
  note?: string;
}

export const VEHICLES: Vehicle[] = [
  {
    id: "WL-101",
    driver: "Marcus Webb",
    zoneId: "dtc",
    status: "En Route",
    x: 420,
    y: 300,
    speedKph: 38,
    loadPct: 72,
    stopsRemaining: 4,
    etaMin: 14,
    currentDeliveryId: "DEL-3391",
  },
  {
    id: "WL-102",
    driver: "Priya Nair",
    zoneId: "rvd",
    status: "En Route",
    x: 280,
    y: 460,
    speedKph: 41,
    loadPct: 55,
    stopsRemaining: 2,
    etaMin: 9,
    currentDeliveryId: "DEL-3388",
  },
  {
    id: "WL-103",
    driver: "Ella Sorensen",
    zoneId: "nhl",
    status: "Idle",
    x: 140,
    y: 90,
    speedKph: 0,
    loadPct: 18,
    stopsRemaining: 0,
    etaMin: null,
    currentDeliveryId: null,
    note: "Parked at North Hills depot",
  },
  {
    id: "WL-104",
    driver: "Jamal Ortiz",
    zoneId: "prt",
    status: "Delayed",
    x: 860,
    y: 140,
    speedKph: 12,
    loadPct: 88,
    stopsRemaining: 6,
    etaMin: 31,
    currentDeliveryId: "DEL-3372",
    note: "Held at port security checkpoint",
  },
  {
    id: "WL-105",
    driver: "Grace Lindqvist",
    zoneId: "egc",
    status: "En Route",
    x: 760,
    y: 440,
    speedKph: 44,
    loadPct: 63,
    stopsRemaining: 3,
    etaMin: 17,
    currentDeliveryId: "DEL-3395",
  },
  {
    id: "WL-106",
    driver: "Tomas Reyes",
    zoneId: "dtc",
    status: "Loading",
    x: 140,
    y: 260,
    speedKph: 0,
    loadPct: 40,
    stopsRemaining: 5,
    etaMin: 8,
    currentDeliveryId: null,
    note: "Loading at Downtown depot, dispatch in 8 min",
  },
  {
    id: "WL-107",
    driver: "Naledi Khumalo",
    zoneId: "rvd",
    status: "En Route",
    x: 420,
    y: 500,
    speedKph: 29,
    loadPct: 21,
    stopsRemaining: 1,
    etaMin: 4,
    currentDeliveryId: "DEL-3401",
  },
  {
    id: "WL-108",
    driver: "Owen Brackett",
    zoneId: "nhl",
    status: "Delayed",
    x: 360,
    y: 160,
    speedKph: 8,
    loadPct: 76,
    stopsRemaining: 4,
    etaMin: 22,
    currentDeliveryId: "DEL-3379",
    note: "Road closure on Ridge Ct detour",
  },
  {
    id: "WL-109",
    driver: "Isabel Duarte",
    zoneId: "prt",
    status: "Idle",
    x: 640,
    y: 90,
    speedKph: 0,
    loadPct: 12,
    stopsRemaining: 0,
    etaMin: null,
    currentDeliveryId: null,
    note: "Awaiting next dispatch",
  },
  {
    id: "WL-110",
    driver: "Felix Kowalski",
    zoneId: "egc",
    status: "En Route",
    x: 880,
    y: 480,
    speedKph: 36,
    loadPct: 47,
    stopsRemaining: 2,
    etaMin: 12,
    currentDeliveryId: "DEL-3398",
  },
  {
    id: "WL-111",
    driver: "Hana Kobayashi",
    zoneId: "dtc",
    status: "Loading",
    x: 780,
    y: 340,
    speedKph: 0,
    loadPct: 30,
    stopsRemaining: 6,
    etaMin: 11,
    currentDeliveryId: null,
    note: "Loading at Downtown depot",
  },
  {
    id: "WL-112",
    driver: "Dmitri Volkov",
    zoneId: "rvd",
    status: "Offline",
    x: 140,
    y: 420,
    speedKph: 0,
    loadPct: 0,
    stopsRemaining: 0,
    etaMin: null,
    currentDeliveryId: null,
    note: "Scheduled maintenance until 16:00",
  },
];

export type DeliveryStatus = "En Route" | "Delivered" | "Delayed" | "Failed";

export interface DeliveryRecord {
  id: string;
  vehicleId: string;
  driver: string;
  zoneId: ZoneId;
  status: DeliveryStatus;
  customer: string;
  address: string;
  scheduled: string;
  completed: string | null;
  durationMin: number | null;
  distanceKm: number;
  note?: string;
}

export const DELIVERY_HISTORY: DeliveryRecord[] = [
  {
    id: "DEL-3391",
    vehicleId: "WL-101",
    driver: "Marcus Webb",
    zoneId: "dtc",
    status: "En Route",
    customer: "Bloom & Co",
    address: "214 Spruce Ave",
    scheduled: "13:40",
    completed: null,
    durationMin: null,
    distanceKm: 6.4,
  },
  {
    id: "DEL-3388",
    vehicleId: "WL-102",
    driver: "Priya Nair",
    zoneId: "rvd",
    status: "En Route",
    customer: "Nairn Hardware",
    address: "88 River Rd",
    scheduled: "13:52",
    completed: null,
    durationMin: null,
    distanceKm: 3.1,
  },
  {
    id: "DEL-3395",
    vehicleId: "WL-105",
    driver: "Grace Lindqvist",
    zoneId: "egc",
    status: "En Route",
    customer: "Northshore Studio",
    address: "4 Wharf Rd",
    scheduled: "13:58",
    completed: null,
    durationMin: null,
    distanceKm: 8.2,
  },
  {
    id: "DEL-3401",
    vehicleId: "WL-107",
    driver: "Naledi Khumalo",
    zoneId: "rvd",
    status: "En Route",
    customer: "Mill Row Bistro",
    address: "12 Canal St",
    scheduled: "14:05",
    completed: null,
    durationMin: null,
    distanceKm: 2.4,
  },
  {
    id: "DEL-3398",
    vehicleId: "WL-110",
    driver: "Felix Kowalski",
    zoneId: "egc",
    status: "En Route",
    customer: "Union Print Shop",
    address: "30 Fifth Ave",
    scheduled: "14:02",
    completed: null,
    durationMin: null,
    distanceKm: 4.9,
  },
  {
    id: "DEL-3372",
    vehicleId: "WL-104",
    driver: "Jamal Ortiz",
    zoneId: "prt",
    status: "Delayed",
    customer: "Port Freight Depot",
    address: "Berth 9",
    scheduled: "12:30",
    completed: null,
    durationMin: null,
    distanceKm: 11.8,
    note: "Held at port security checkpoint",
  },
  {
    id: "DEL-3379",
    vehicleId: "WL-108",
    driver: "Owen Brackett",
    zoneId: "nhl",
    status: "Delayed",
    customer: "Hilltop Grocer",
    address: "45 Ridge Ct",
    scheduled: "12:55",
    completed: null,
    durationMin: null,
    distanceKm: 5.2,
    note: "Road closure detour",
  },
  {
    id: "DEL-3355",
    vehicleId: "WL-101",
    driver: "Marcus Webb",
    zoneId: "dtc",
    status: "Delivered",
    customer: "Verve Cafe",
    address: "12 Main St",
    scheduled: "10:10",
    completed: "10:24",
    durationMin: 14,
    distanceKm: 2.6,
  },
  {
    id: "DEL-3358",
    vehicleId: "WL-107",
    driver: "Naledi Khumalo",
    zoneId: "rvd",
    status: "Delivered",
    customer: "Delta Textiles",
    address: "301 Mill Ln",
    scheduled: "10:20",
    completed: "10:33",
    durationMin: 13,
    distanceKm: 4.0,
  },
  {
    id: "DEL-3361",
    vehicleId: "WL-105",
    driver: "Grace Lindqvist",
    zoneId: "egc",
    status: "Delivered",
    customer: "Eastgate Pharmacy",
    address: "9 Elm St",
    scheduled: "10:45",
    completed: "11:02",
    durationMin: 17,
    distanceKm: 5.9,
  },
  {
    id: "DEL-3364",
    vehicleId: "WL-110",
    driver: "Felix Kowalski",
    zoneId: "egc",
    status: "Delivered",
    customer: "Commons Bakery",
    address: "22 Fifth Ave",
    scheduled: "11:00",
    completed: "11:11",
    durationMin: 11,
    distanceKm: 2.2,
  },
  {
    id: "DEL-3367",
    vehicleId: "WL-103",
    driver: "Ella Sorensen",
    zoneId: "nhl",
    status: "Delivered",
    customer: "Ridge Books",
    address: "71 Summit Rd",
    scheduled: "11:15",
    completed: "11:29",
    durationMin: 14,
    distanceKm: 3.8,
  },
  {
    id: "DEL-3369",
    vehicleId: "WL-109",
    driver: "Isabel Duarte",
    zoneId: "prt",
    status: "Delivered",
    customer: "Harbor Supply Co",
    address: "Dock 4",
    scheduled: "11:30",
    completed: "11:47",
    durationMin: 17,
    distanceKm: 7.5,
  },
  {
    id: "DEL-3375",
    vehicleId: "WL-106",
    driver: "Tomas Reyes",
    zoneId: "dtc",
    status: "Delivered",
    customer: "Union Deli",
    address: "18 Market Sq",
    scheduled: "12:05",
    completed: "12:19",
    durationMin: 14,
    distanceKm: 3.0,
  },
  {
    id: "DEL-3380",
    vehicleId: "WL-111",
    driver: "Hana Kobayashi",
    zoneId: "dtc",
    status: "Delivered",
    customer: "Foundry Coffee",
    address: "60 Iron St",
    scheduled: "12:40",
    completed: "12:56",
    durationMin: 16,
    distanceKm: 2.9,
  },
  {
    id: "DEL-3370",
    vehicleId: "WL-112",
    driver: "Dmitri Volkov",
    zoneId: "rvd",
    status: "Failed",
    customer: "Riverside Flowers",
    address: "5 Bank St",
    scheduled: "11:40",
    completed: null,
    durationMin: null,
    distanceKm: 4.6,
    note: "Recipient unavailable",
  },
  {
    id: "DEL-3383",
    vehicleId: "WL-104",
    driver: "Jamal Ortiz",
    zoneId: "prt",
    status: "Failed",
    customer: "Anchor Marine Parts",
    address: "Pier 2",
    scheduled: "12:15",
    completed: null,
    durationMin: null,
    distanceKm: 9.3,
    note: "Address inaccessible",
  },
];

// ---- Derived, computed (not hand-duplicated) KPI figures ----------------

export const FLEET_TOTAL = VEHICLES.length;
export const ACTIVE_VEHICLES = VEHICLES.filter(
  (v) => v.status === "En Route" || v.status === "Loading",
).length;

export const DELIVERED_COUNT = DELIVERY_HISTORY.filter((d) => d.status === "Delivered").length;
export const DELAYED_COUNT = DELIVERY_HISTORY.filter((d) => d.status === "Delayed").length;
export const FAILED_COUNT = DELIVERY_HISTORY.filter((d) => d.status === "Failed").length;
export const EN_ROUTE_COUNT = DELIVERY_HISTORY.filter((d) => d.status === "En Route").length;
export const HISTORY_TOTAL = DELIVERY_HISTORY.length;

const CONCLUDED = DELIVERED_COUNT + DELAYED_COUNT + FAILED_COUNT;
export const ON_TIME_RATE_PCT = Math.round((DELIVERED_COUNT / CONCLUDED) * 100);

export function zoneById(id: ZoneId): Zone {
  const z = ZONES.find((zone) => zone.id === id);
  if (!z) throw new Error(`Unknown zone id: ${id}`);
  return z;
}

export function vehicleById(id: string): Vehicle | undefined {
  return VEHICLES.find((v) => v.id === id);
}
