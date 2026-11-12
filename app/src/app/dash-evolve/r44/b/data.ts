// Loadline — deterministic fulfillment-ops data.
//
// No `Math.random()`, no `Date.now()`, no argument-less `new Date()`. Every
// `new Date(...)` call below passes explicit y/m0/d arguments, used purely
// for calendar arithmetic (weekday-of, days-in-month, normalized overflow),
// never to read the wall clock. "Today" is a fixed narrative anchor
// (Oct 18, 2026) baked into the data, not derived from the runtime clock.

export type WarehouseId = "newark" | "reno" | "columbus" | "ontario";
export type Metric = "shipped" | "onTime";
export type Status = "good" | "watch" | "critical";

export interface Warehouse {
  id: WarehouseId;
  name: string;
  code: string;
  city: string;
  region: string;
  manager: string;
  dailyTargetUnits: number;
}

export const WAREHOUSES: Warehouse[] = [
  { id: "newark", name: "Port Newark DC", code: "PNJ", city: "Newark", region: "Northeast", manager: "Dana Osei", dailyTargetUnits: 520 },
  { id: "reno", name: "Reno Fulfillment Center", code: "RNO", city: "Reno", region: "West", manager: "Marcus Lin", dailyTargetUnits: 340 },
  { id: "columbus", name: "Columbus Hub", code: "CMH", city: "Columbus", region: "Midwest", manager: "Priya Nair", dailyTargetUnits: 410 },
  { id: "ontario", name: "Ontario West", code: "ONT", city: "Ontario", region: "Pacific Canada", manager: "Theo Brandt", dailyTargetUnits: 260 },
];

export const WAREHOUSE_IDS: WarehouseId[] = WAREHOUSES.map((w) => w.id);

export const WAREHOUSE_BY_ID: Record<WarehouseId, Warehouse> = WAREHOUSES.reduce(
  (acc, w) => {
    acc[w.id] = w;
    return acc;
  },
  {} as Record<WarehouseId, Warehouse>,
);

const WAREHOUSE_SEED: Record<WarehouseId, number> = { newark: 0, reno: 1, columbus: 2, ontario: 3 };

export const ON_TIME_TARGET_PCT = 95;

export interface MonthDef {
  key: string;
  y: number;
  m0: number;
  label: string;
  shortLabel: string;
  startIdx: number;
  length: number;
}

export const MONTHS: MonthDef[] = [
  { key: "2026-09", y: 2026, m0: 8, label: "September 2026", shortLabel: "Sep 2026", startIdx: 0, length: 30 },
  { key: "2026-10", y: 2026, m0: 9, label: "October 2026", shortLabel: "Oct 2026", startIdx: 30, length: 31 },
  { key: "2026-11", y: 2026, m0: 10, label: "November 2026", shortLabel: "Nov 2026", startIdx: 61, length: 30 },
];

const TOTAL_DAYS = MONTHS.reduce((s, m) => s + m.length, 0);
export const ANCHOR_DAY_INDEX = 47; // October 18, 2026 — "today"
export const DEFAULT_MONTH_INDEX = 1;

export const METRIC_META: Record<Metric, { label: string; shortLabel: string; unit: string }> = {
  shipped: { label: "Units shipped", shortLabel: "Shipped", unit: "units" },
  onTime: { label: "On-time rate", shortLabel: "On-time %", unit: "%" },
};

function pad2(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

function isoKey(y: number, m0: number, d: number): string {
  return `${y}-${pad2(m0 + 1)}-${pad2(d)}`;
}

function weekdayOf(y: number, m0: number, d: number): number {
  return new Date(y, m0, d).getDay(); // 0=Sun..6=Sat
}

function indexToDate(idx: number): { y: number; m0: number; d: number } {
  const month = MONTHS.find((m) => idx >= m.startIdx && idx < m.startIdx + m.length) ?? MONTHS[0];
  return { y: month.y, m0: month.m0, d: idx - month.startIdx + 1 };
}

export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

export interface DayRecord {
  warehouseId: WarehouseId;
  dayIndex: number;
  y: number;
  m0: number;
  d: number;
  iso: string;
  weekday: number;
  isWeekend: boolean;
  isFuture: boolean;
  isDisrupted: boolean;
  shippedUnits: number | null;
  shippedTarget: number;
  onTimePct: number | null;
  onTimeTarget: number;
}

function buildRecord(warehouseId: WarehouseId, dayIndex: number): DayRecord {
  const seed = WAREHOUSE_SEED[warehouseId];
  const { y, m0, d } = indexToDate(dayIndex);
  const weekday = weekdayOf(y, m0, d);
  const isWeekend = weekday === 0 || weekday === 6;
  const isDisrupted = (dayIndex + seed * 3) % 11 === 0;
  const isFuture = dayIndex > ANCHOR_DAY_INDEX;
  const target = WAREHOUSE_BY_ID[warehouseId].dailyTargetUnits;

  let shippedUnits: number | null = null;
  let onTimePct: number | null = null;

  if (!isFuture) {
    const wave = Math.sin((dayIndex + seed * 7) * 0.37) * 0.07;
    const micro = Math.cos(dayIndex * 0.21 + seed * 2.1) * 0.04;
    const weekendAdj = isWeekend ? -0.3 : 0;
    const dipAdj = isDisrupted ? -0.22 : 0;
    const factor = clamp(1 + wave + micro + weekendAdj + dipAdj, 0.05, 1.35);
    shippedUnits = Math.round(target * factor);

    const onWave = Math.sin(dayIndex * 0.29 + seed * 1.7) * 2.2;
    const onWeekendAdj = isWeekend ? -1.5 : 0;
    const onDipAdj = isDisrupted ? -11 : 0;
    onTimePct = round1(clamp(97 + onWave + onWeekendAdj + onDipAdj, 55, 99.8));
  }

  return {
    warehouseId, dayIndex, y, m0, d,
    iso: isoKey(y, m0, d),
    weekday, isWeekend, isFuture, isDisrupted,
    shippedUnits, shippedTarget: target,
    onTimePct, onTimeTarget: ON_TIME_TARGET_PCT,
  };
}

const ALL_INDEXES = Array.from({ length: TOTAL_DAYS }, (_, i) => i);

export const RECORDS: Record<WarehouseId, DayRecord[]> = WAREHOUSE_IDS.reduce(
  (acc, id) => {
    acc[id] = ALL_INDEXES.map((idx) => buildRecord(id, idx));
    return acc;
  },
  {} as Record<WarehouseId, DayRecord[]>,
);

export const TODAY_ISO = RECORDS[WAREHOUSE_IDS[0]][ANCHOR_DAY_INDEX].iso;

export function getRecordByIso(warehouseId: WarehouseId, iso: string): DayRecord | undefined {
  return RECORDS[warehouseId].find((r) => r.iso === iso);
}

export function metricValue(r: DayRecord, metric: Metric): number | null {
  return metric === "shipped" ? r.shippedUnits : r.onTimePct;
}

export function metricTarget(r: DayRecord, metric: Metric): number {
  return metric === "shipped" ? r.shippedTarget : r.onTimeTarget;
}

export function metricStatus(r: DayRecord, metric: Metric): Status | null {
  const v = metricValue(r, metric);
  if (v === null) return null;
  if (metric === "shipped") {
    const ratio = v / r.shippedTarget;
    if (ratio >= 0.95) return "good";
    if (ratio >= 0.75) return "watch";
    return "critical";
  }
  if (v >= 95) return "good";
  if (v >= 85) return "watch";
  return "critical";
}

/** Signed percent reading of actual against target — the always-visible
 * "KPI vs. target" text printed on every calendar cell, not a hover-only
 * reveal. */
export function metricDeltaPct(r: DayRecord, metric: Metric): number | null {
  const v = metricValue(r, metric);
  if (v === null) return null;
  const t = metricTarget(r, metric);
  return Math.round(((v - t) / t) * 100);
}

export function metricDomain(metric: Metric, target: number): { max: number; tickPct: number } {
  if (metric === "onTime") return { max: 100, tickPct: round2((target / 100) * 100) };
  const max = target * 1.3;
  return { max, tickPct: round2((target / max) * 100) };
}

export function metricBarPct(r: DayRecord, metric: Metric): number {
  const v = metricValue(r, metric);
  if (v === null) return 0;
  const { max } = metricDomain(metric, metricTarget(r, metric));
  return round2(clamp((v / max) * 100, 0, 100));
}

/** The two band cut-points (as a % of the gauge's own domain) separating
 * critical / watch / good — mirrors the thresholds in `metricStatus` so the
 * always-visible background bands and the status read the same way. */
export function metricBandStops(metric: Metric, target: number): { criticalToPct: number; watchToPct: number } {
  if (metric === "onTime") return { criticalToPct: 85, watchToPct: 95 };
  const { max } = metricDomain(metric, target);
  return { criticalToPct: round2(((target * 0.75) / max) * 100), watchToPct: round2(((target * 0.95) / max) * 100) };
}

export interface GridCell {
  key: string;
  inMonth: boolean;
  record: DayRecord | null;
  displayDay: number;
}

export function buildMonthGrid(monthIndex: number, warehouseId: WarehouseId): GridCell[] {
  const month = MONTHS[monthIndex];
  const firstWeekdaySun0 = weekdayOf(month.y, month.m0, 1);
  const firstWeekdayMon0 = (firstWeekdaySun0 + 6) % 7;
  const totalCells = Math.ceil((firstWeekdayMon0 + month.length) / 7) * 7;
  const cells: GridCell[] = [];
  for (let i = 0; i < totalCells; i++) {
    const date = new Date(month.y, month.m0, 1 + i - firstWeekdayMon0);
    const inMonth = date.getMonth() === month.m0;
    if (!inMonth) {
      cells.push({ key: `pad-${month.key}-${i}`, inMonth: false, record: null, displayDay: date.getDate() });
      continue;
    }
    const dayIndex = month.startIdx + (date.getDate() - 1);
    cells.push({ key: `${warehouseId}-${dayIndex}`, inMonth: true, record: RECORDS[warehouseId][dayIndex], displayDay: date.getDate() });
  }
  return cells;
}

export interface ExceptionRecord {
  id: string;
  warehouseId: WarehouseId;
  dayIndex: number;
  y: number;
  m0: number;
  d: number;
  iso: string;
  carrier: string;
  issue: string;
  unitsAffected: number;
  status: "open" | "resolved";
  owner: string;
}

const CARRIERS = ["FedEx Ground", "UPS Freight", "XPO Logistics", "Old Dominion", "Estes Express"];
const ISSUES = [
  "Carrier pickup delay",
  "Dock congestion at receiving",
  "Inventory count mismatch",
  "Short-staffed night shift",
  "Regional weather disruption",
];
const OWNERS = ["Dana Osei", "Marcus Lin", "Priya Nair", "Theo Brandt", "Ayesha Rahman", "Jon Kowalski"];

export const EXCEPTIONS: ExceptionRecord[] = WAREHOUSE_IDS.flatMap((id) => {
  const seed = WAREHOUSE_SEED[id];
  return RECORDS[id]
    .filter((r) => r.isDisrupted && !r.isFuture)
    .map((r) => {
      const shortfall = Math.max(0, Math.round(r.shippedTarget - (r.shippedUnits ?? r.shippedTarget)));
      const recentWindow = ANCHOR_DAY_INDEX - r.dayIndex <= 5;
      const rec: ExceptionRecord = {
        id: `${id}-exc-${r.dayIndex}`,
        warehouseId: id,
        dayIndex: r.dayIndex,
        y: r.y,
        m0: r.m0,
        d: r.d,
        iso: r.iso,
        carrier: CARRIERS[(r.dayIndex + seed) % CARRIERS.length],
        issue: ISSUES[(r.dayIndex + seed * 2) % ISSUES.length],
        unitsAffected: Math.max(shortfall, 12),
        status: recentWindow ? "open" : "resolved",
        owner: OWNERS[(r.dayIndex + seed * 5) % OWNERS.length],
      };
      return rec;
    });
});

export interface WarehouseSummary {
  shippedTrailing30: number;
  shippedTarget30: number;
  onTimeAvgTrailing30: number;
  onTimeStatus: Status;
  openExceptions: number;
  dailySeries30: number[];
  dailySeries7: number[];
  latestDayPct: number;
}

export function getWarehouseSummary(warehouseId: WarehouseId): WarehouseSummary {
  const elapsed = RECORDS[warehouseId].filter((r) => !r.isFuture);
  const last30 = elapsed.slice(-30);
  const last7 = elapsed.slice(-7);
  const shippedTrailing30 = last30.reduce((s, r) => s + (r.shippedUnits ?? 0), 0);
  const shippedTarget30 = last30.length * WAREHOUSE_BY_ID[warehouseId].dailyTargetUnits;
  const onTimeAvgTrailing30 = round1(last30.reduce((s, r) => s + (r.onTimePct ?? 0), 0) / last30.length);
  const openExceptions = EXCEPTIONS.filter((e) => e.warehouseId === warehouseId && e.status === "open").length;
  const latest = elapsed[elapsed.length - 1];
  const latestDayPct = Math.round(((latest.shippedUnits ?? 0) / latest.shippedTarget) * 100);
  return {
    shippedTrailing30,
    shippedTarget30,
    onTimeAvgTrailing30,
    onTimeStatus: onTimeAvgTrailing30 >= 95 ? "good" : onTimeAvgTrailing30 >= 85 ? "watch" : "critical",
    openExceptions,
    dailySeries30: last30.map((r) => r.shippedUnits ?? 0),
    dailySeries7: last7.map((r) => r.shippedUnits ?? 0),
    latestDayPct,
  };
}

const intFormatter = new Intl.NumberFormat("en-US");

export function formatInt(n: number): string {
  return intFormatter.format(Math.round(n));
}

function trimZero(s: string): string {
  return s.endsWith(".0") ? s.slice(0, -2) : s;
}

/** Hand-rolled abbreviation — deliberately not `Intl.NumberFormat` with
 * `notation: 'compact'`, which risks an SSR/client ICU hydration mismatch. */
export function formatCompactUnits(n: number): string {
  const sign = n < 0 ? "-" : "";
  const abs = Math.abs(n);
  if (abs >= 1_000_000) return `${sign}${trimZero((abs / 1_000_000).toFixed(1))}M`;
  if (abs >= 1_000) return `${sign}${trimZero((abs / 1_000).toFixed(1))}k`;
  return `${sign}${formatInt(abs)}`;
}

export function formatPercent(n: number, decimals = 1): string {
  return `${n.toFixed(decimals)}%`;
}

export function formatSignedPercent(n: number): string {
  return `${n > 0 ? "+" : ""}${n}%`;
}

export function formatDateLong(r: { y: number; m0: number; d: number }): string {
  return new Date(r.y, r.m0, r.d).toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  });
}

export function formatDateShort(r: { y: number; m0: number; d: number }): string {
  return new Date(r.y, r.m0, r.d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
