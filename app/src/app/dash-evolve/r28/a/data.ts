/**
 * Openhour — capacity & scheduling intelligence for multi-location service teams.
 *
 * All data below is generated deterministically from fixed calendar dates using a seeded
 * linear-congruential generator (integer arithmetic only — no Math.random, no Date.now(),
 * no argument-less `new Date()`). Every `new Date(...)` call below passes explicit y/m/d
 * arguments, which is not the banned pattern; it never reads real wall-clock time.
 *
 * Reconciliation: each day's appointment list is generated first, and every aggregate
 * (revenue, appointment count, location breakdown, staffing) is *derived* from that list,
 * so subtotals always sum to totals.
 */

export type Metric = "utilization" | "revenue" | "risk";
export type Status = "confirmed" | "completed" | "cancelled" | "no-show";
export type RiskLevel = "low" | "medium" | "high";

export interface Appointment {
  id: string;
  startMin: number; // minutes from midnight
  durationMin: number;
  customer: string;
  service: string;
  provider: string;
  location: string;
  status: Status;
  revenue: number;
}

export interface LocationBreakdown {
  location: string;
  bookings: number;
  revenue: number;
  sharePct: number;
}

export interface DayRecord {
  date: string; // "2026-09-21"
  y: number;
  m0: number; // 0-based month
  d: number;
  weekday: number; // 0=Sun..6=Sat
  isOpen: boolean;
  utilizationPct: number;
  revenue: number;
  riskScore: number;
  riskLevel: RiskLevel;
  appointmentsCount: number;
  cancelledCount: number;
  noShowCount: number;
  staffScheduled: number;
  staffNeeded: number;
  locations: LocationBreakdown[];
  appointments: Appointment[];
}

export interface MonthGridCell {
  date: string;
  inMonth: boolean;
  record: DayRecord;
}

export interface MonthDef {
  key: string; // "2026-09"
  label: string; // "September 2026"
  y: number;
  m0: number;
}

// ---------------------------------------------------------------------------------------
// Fixed reference data
// ---------------------------------------------------------------------------------------

export const ANCHOR_DATE = "2026-09-21";

export const LOCATIONS = ["Downtown", "Parkside", "Lakeside"] as const;

export const PROVIDERS = [
  { id: "cho", name: "Dr. Elena Cho", role: "Dentist" },
  { id: "webb", name: "Dr. Marcus Webb", role: "Dentist" },
  { id: "nair", name: "Dr. Priya Nair", role: "Orthodontist" },
  { id: "okafor", name: "Dr. Sam Okafor", role: "Dentist" },
  { id: "ferreira", name: "Lucia Ferreira, RDH", role: "Hygienist" },
  { id: "kim", name: "Noah Kim, RDH", role: "Hygienist" },
] as const;

export const SERVICES = [
  { name: "Cleaning", duration: 30, rate: 120 },
  { name: "Checkup", duration: 20, rate: 95 },
  { name: "Whitening", duration: 45, rate: 260 },
  { name: "Root Canal", duration: 90, rate: 640 },
  { name: "Crown Fitting", duration: 60, rate: 480 },
  { name: "Extraction", duration: 45, rate: 310 },
  { name: "Consultation", duration: 20, rate: 70 },
  { name: "Ortho Adjustment", duration: 20, rate: 150 },
] as const;

const CUSTOMERS = [
  "Grace Halvorsen", "Marcus Tan", "Sofia Reyes", "Ibrahim Musa", "Delphine Okoye",
  "Leo Bergstrom", "Anika Sharma", "Oliver Prescott", "Mei Lin Zhou", "Diego Salazar",
  "Freya Nilsson", "Tobias Renner", "Camille Voss", "Kwame Asante", "Nadia Petrov",
  "Ronan Fitzgerald", "Yuki Tanaka", "Isabela Costa", "Andre Dubois", "Priya Menon",
  "Callum Wright", "Selin Aydin", "Micah Goldman", "Liora Feldman", "Damian Kowalski",
  "Aiyana Redcloud", "Felix Bauer", "Rosalind Kerr", "Teo Marchetti", "Hana Novak",
] as const;

export const STATUS_LABEL: Record<Status, string> = {
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
  "no-show": "No-show",
};

// ---------------------------------------------------------------------------------------
// Deterministic RNG (integer LCG — stable across server/client, no float-transcendental risk)
// ---------------------------------------------------------------------------------------

function makeRng(seed: number) {
  let s = (seed % 233280 + 233280) % 233280 || 1;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function ordinal(y: number, m0: number, d: number): number {
  const epoch = new Date(2026, 0, 1).getTime();
  return Math.floor((new Date(y, m0, d).getTime() - epoch) / 86400000);
}

const ANCHOR_ORD = ordinal(2026, 8, 21);

function pad2(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

function toISO(y: number, m0: number, d: number): string {
  return `${y}-${pad2(m0 + 1)}-${pad2(d)}`;
}

function daysInMonth(y: number, m0: number): number {
  return new Date(y, m0 + 1, 0).getDate();
}

function minutesToClock(min: number): string {
  const h24 = Math.floor(min / 60);
  const mm = min % 60;
  const period = h24 >= 12 ? "PM" : "AM";
  let h12 = h24 % 12;
  if (h12 === 0) h12 = 12;
  return `${h12}:${pad2(mm)} ${period}`;
}

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

// ---------------------------------------------------------------------------------------
// Day generation
// ---------------------------------------------------------------------------------------

function generateDay(y: number, m0: number, d: number): DayRecord {
  const weekday = new Date(y, m0, d).getDay(); // 0=Sun..6=Sat
  const date = toISO(y, m0, d);
  const seed = ordinal(y, m0, d);
  const rng = makeRng(seed * 7919 + 13);

  const isOpen = weekday !== 0; // closed Sundays
  const isSaturday = weekday === 6;

  if (!isOpen) {
    return {
      date, y, m0, d, weekday, isOpen: false,
      utilizationPct: 0, revenue: 0, riskScore: 0, riskLevel: "low",
      appointmentsCount: 0, cancelledCount: 0, noShowCount: 0,
      staffScheduled: 0, staffNeeded: 0, locations: [], appointments: [],
    };
  }

  // Target appointment count
  const base = isSaturday ? 14 : 28;
  const spread = isSaturday ? 8 : 12;
  const count = clamp(Math.round(base + (rng() - 0.5) * spread), isSaturday ? 8 : 18, isSaturday ? 20 : 38);

  // Staffing: needed vs. actually scheduled (derived provider roster for the day)
  const staffNeeded = clamp(Math.ceil(count / 6), 1, PROVIDERS.length);
  const gapRoll = rng();
  const staffGap = !isSaturday && gapRoll > 0.82 ? 1 : 0;
  const staffScheduled = clamp(staffNeeded - staffGap, 1, PROVIDERS.length);

  // Deterministic shuffle of provider indices for this day
  const providerOrder = PROVIDERS.map((_, i) => i)
    .map((i) => ({ i, k: rng() }))
    .sort((a, b) => a.k - b.k)
    .map((x) => x.i);
  const activeProviders = providerOrder.slice(0, staffScheduled);

  const isPast = seed < ANCHOR_ORD;
  const isToday = seed === ANCHOR_ORD;

  const openMin = 8 * 60;
  const closeMin = isSaturday ? 13 * 60 : 17 * 60 + 30;

  const appointments: Appointment[] = [];
  for (let i = 0; i < count; i++) {
    const svc = SERVICES[Math.floor(rng() * SERVICES.length)];
    const cust = CUSTOMERS[Math.floor(rng() * CUSTOMERS.length)];
    const provider = PROVIDERS[activeProviders[Math.floor(rng() * activeProviders.length)]];
    const location = LOCATIONS[Math.floor(rng() * LOCATIONS.length)];
    const slot = Math.floor(rng() * ((closeMin - openMin) / 15)) * 15;
    const startMin = openMin + slot;

    const statusRoll = rng();
    let status: Status;
    if (isPast) {
      status = statusRoll < 0.80 ? "completed" : statusRoll < 0.88 ? "cancelled" : statusRoll < 0.96 ? "no-show" : "completed";
    } else if (isToday) {
      status = statusRoll < 0.42 ? "completed" : statusRoll < 0.90 ? "confirmed" : statusRoll < 0.96 ? "cancelled" : "no-show";
    } else {
      status = statusRoll < 0.92 ? "confirmed" : "cancelled";
    }

    const revenueVariance = 1 + (rng() - 0.5) * 0.2;
    const revenue = status === "cancelled" || status === "no-show" ? 0 : Math.round((svc.rate * revenueVariance) / 5) * 5;

    appointments.push({
      id: `${date}-${i}`,
      startMin,
      durationMin: svc.duration,
      customer: cust,
      service: svc.name,
      provider: provider.name,
      location,
      status,
      revenue,
    });
  }
  appointments.sort((a, b) => a.startMin - b.startMin);

  const revenue = appointments.reduce((sum, a) => sum + a.revenue, 0);
  const cancelledCount = appointments.filter((a) => a.status === "cancelled").length;
  const noShowCount = appointments.filter((a) => a.status === "no-show").length;
  const capacity = staffScheduled * (isSaturday ? 7 : 10);
  const utilizationPct = clamp(Math.round((appointments.length / capacity) * 100), 0, 100);

  const excessUtil = Math.max(0, utilizationPct - 65);
  const instability = cancelledCount * 5 + noShowCount * 8;
  const staffGapPenalty = staffGap * 14;
  const riskVariance = (rng() - 0.5) * 16;
  const riskScore = clamp(Math.round(excessUtil * 1.3 + instability + staffGapPenalty + riskVariance), 0, 100);
  const riskLevel: RiskLevel = riskScore >= 58 ? "high" : riskScore >= 32 ? "medium" : "low";

  const locations: LocationBreakdown[] = LOCATIONS.map((loc) => {
    const locAppts = appointments.filter((a) => a.location === loc);
    const locRevenue = locAppts.reduce((s, a) => s + a.revenue, 0);
    return {
      location: loc,
      bookings: locAppts.length,
      revenue: locRevenue,
      sharePct: appointments.length ? Math.round((locAppts.length / appointments.length) * 100) : 0,
    };
  });

  return {
    date, y, m0, d, weekday, isOpen: true,
    utilizationPct, revenue, riskScore, riskLevel,
    appointmentsCount: appointments.length, cancelledCount, noShowCount,
    staffScheduled, staffNeeded, locations, appointments,
  };
}

// ---------------------------------------------------------------------------------------
// Build the full working range (covers grid padding for every navigable month)
// ---------------------------------------------------------------------------------------

const RANGE_START = { y: 2026, m0: 6 }; // July 2026
const RANGE_END = { y: 2026, m0: 10 }; // November 2026

const DAY_MAP = new Map<string, DayRecord>();
for (let m0 = RANGE_START.m0; m0 <= RANGE_END.m0; m0++) {
  const dim = daysInMonth(2026, m0);
  for (let d = 1; d <= dim; d++) {
    const rec = generateDay(2026, m0, d);
    DAY_MAP.set(rec.date, rec);
  }
}

export const VIEW_MONTHS: MonthDef[] = [7, 8, 9].map((m0) => ({
  key: `2026-${pad2(m0 + 1)}`,
  label: new Date(2026, m0, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" }),
  y: 2026,
  m0,
}));

export function getDay(date: string): DayRecord {
  const rec = DAY_MAP.get(date);
  if (!rec) throw new Error(`No generated data for ${date}`);
  return rec;
}

export function buildMonthGrid(def: MonthDef): MonthGridCell[] {
  const first = new Date(def.y, def.m0, 1);
  const firstWeekdayMon0 = (first.getDay() + 6) % 7; // 0=Mon..6=Sun
  const gridStart = new Date(def.y, def.m0, 1 - firstWeekdayMon0);

  const cells: MonthGridCell[] = [];
  for (let i = 0; i < 42; i++) {
    const cur = new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + i);
    const date = toISO(cur.getFullYear(), cur.getMonth(), cur.getDate());
    cells.push({ date, inMonth: cur.getMonth() === def.m0, record: getDay(date) });
  }
  return cells;
}

// ---------------------------------------------------------------------------------------
// Metric helpers
// ---------------------------------------------------------------------------------------

export const METRIC_META: Record<Metric, { label: string; shortLabel: string; unit: string }> = {
  utilization: { label: "Booked capacity", shortLabel: "Booked", unit: "%" },
  revenue: { label: "Revenue booked", shortLabel: "Revenue", unit: "$" },
  risk: { label: "SLA risk", shortLabel: "Risk", unit: "pts" },
};

const REVENUE_DOMAIN_MAX = (() => {
  let max = 0;
  for (const rec of DAY_MAP.values()) if (rec.isOpen) max = Math.max(max, rec.revenue);
  return Math.ceil(max / 500) * 500;
})();

export function metricValue(rec: DayRecord, metric: Metric): number {
  if (metric === "utilization") return rec.utilizationPct;
  if (metric === "revenue") return rec.revenue;
  return rec.riskScore;
}

export function metricDomainMax(metric: Metric): number {
  if (metric === "utilization") return 100;
  if (metric === "risk") return 100;
  return REVENUE_DOMAIN_MAX;
}

/** 0..5 intensity bucket for heatmap cell coloring. */
export function metricBucket(rec: DayRecord, metric: Metric): number {
  if (!rec.isOpen) return -1;
  const v = metricValue(rec, metric);
  const max = metricDomainMax(metric);
  if (v <= 0) return 0;
  return clamp(Math.floor((v / max) * 6), 0, 5);
}

// ---------------------------------------------------------------------------------------
// Rollups for the KPI strip and trend chart
// ---------------------------------------------------------------------------------------

export function monthOpenDays(def: MonthDef): DayRecord[] {
  const dim = daysInMonth(def.y, def.m0);
  const out: DayRecord[] = [];
  for (let d = 1; d <= dim; d++) {
    const rec = getDay(toISO(def.y, def.m0, d));
    if (rec.isOpen) out.push(rec);
  }
  return out;
}

export interface MonthSummary {
  avgUtilization: number;
  avgUtilizationPrev: number;
  totalRevenue: number;
  totalRevenuePrev: number;
  atRiskDays: number;
  atRiskDaysPrev: number;
  noShowRate: number;
  noShowRatePrev: number;
}

function summarize(days: DayRecord[]) {
  const n = days.length || 1;
  const avgUtilization = Math.round(days.reduce((s, r) => s + r.utilizationPct, 0) / n);
  const totalRevenue = days.reduce((s, r) => s + r.revenue, 0);
  const atRiskDays = days.filter((r) => r.riskLevel === "high").length;
  const totalAppts = days.reduce((s, r) => s + r.appointmentsCount, 0) || 1;
  const totalNoShow = days.reduce((s, r) => s + r.noShowCount, 0);
  const noShowRate = Math.round((totalNoShow / totalAppts) * 1000) / 10;
  return { avgUtilization, totalRevenue, atRiskDays, noShowRate };
}

export function monthSummary(def: MonthDef): MonthSummary {
  const cur = summarize(monthOpenDays(def));
  const prevM0 = def.m0 - 1;
  const prevDef = VIEW_MONTHS.find((m) => m.m0 === prevM0) ?? { key: "", label: "", y: def.y, m0: prevM0 };
  const prevDays = prevM0 >= RANGE_START.m0 ? monthOpenDays({ ...prevDef, y: def.y, m0: prevM0 }) : [];
  const prev = prevDays.length ? summarize(prevDays) : cur;
  return {
    avgUtilization: cur.avgUtilization,
    avgUtilizationPrev: prev.avgUtilization,
    totalRevenue: cur.totalRevenue,
    totalRevenuePrev: prev.totalRevenue,
    atRiskDays: cur.atRiskDays,
    atRiskDaysPrev: prev.atRiskDays,
    noShowRate: cur.noShowRate,
    noShowRatePrev: prev.noShowRate,
  };
}

/** Trailing 30-day utilization series ending at the anchor date, oldest first. */
export function trendSeries(): { date: string; value: number }[] {
  const out: { date: string; value: number }[] = [];
  const anchor = new Date(2026, 8, 21);
  for (let i = 29; i >= 0; i--) {
    const cur = new Date(anchor.getFullYear(), anchor.getMonth(), anchor.getDate() - i);
    const date = toISO(cur.getFullYear(), cur.getMonth(), cur.getDate());
    const rec = DAY_MAP.get(date);
    out.push({ date, value: rec ? rec.utilizationPct : 0 });
  }
  return out;
}

// ---------------------------------------------------------------------------------------
// Formatters
// ---------------------------------------------------------------------------------------

const currencyFmt = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const compactCurrencyFmt = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", notation: "compact", maximumFractionDigits: 1 });

export function fmtCurrency(v: number): string {
  return currencyFmt.format(v);
}
export function fmtCompactCurrency(v: number): string {
  return compactCurrencyFmt.format(v);
}
export function fmtPercent(v: number): string {
  return `${v}%`;
}
export function fmtTime(min: number): string {
  return minutesToClock(min);
}
export function fmtDuration(min: number): string {
  return min >= 60 ? `${Math.floor(min / 60)}h ${min % 60 ? `${min % 60}m` : ""}`.trim() : `${min} min`;
}
export function fmtDateLong(date: string): string {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
}
export function fmtDateShort(date: string): string {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}
export function fmtMetricValue(rec: DayRecord, metric: Metric): string {
  if (!rec.isOpen) return "Closed";
  if (metric === "utilization") return `${rec.utilizationPct}%`;
  if (metric === "revenue") return fmtCompactCurrency(rec.revenue);
  return `${rec.riskScore}`;
}

export function appointmentsToCsv(dateLabel: string, appts: Appointment[]): string {
  const header = ["Time", "Customer", "Service", "Provider", "Location", "Duration (min)", "Status", "Revenue"];
  const rows = appts.map((a) => [
    fmtTime(a.startMin), a.customer, a.service, a.provider, a.location,
    String(a.durationMin), STATUS_LABEL[a.status], String(a.revenue),
  ]);
  const escape = (s: string) => (/[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s);
  return [`Appointments — ${dateLabel}`, header.join(","), ...rows.map((r) => r.map(escape).join(","))].join("\n");
}
