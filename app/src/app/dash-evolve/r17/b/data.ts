/**
 * Bayline — deterministic dummy data for the fleet maintenance bay planner.
 *
 * No `Math.random(`, no `Date.now(`, no bare `new Date()` — and in fact no `Date` object at all.
 * The 6-week horizon is a fixed literal window (Mon 2026-02-02 .. Sun 2026-03-15 = exactly 42 days,
 * because February 2026 has 28 days and 2026-02-01 falls on a Sunday), so every calendar label is
 * arithmetic on a day index rather than a date library call.
 *
 * RECONCILIATION: the work-order list is the single source of truth. Day totals, week (row) totals,
 * weekday (column) totals, the grand total, the 42-point trend series, the weekday profile table and
 * the per-bay roster totals are ALL reduced from the same `ORDERS` array, so
 *   sum(week totals) === sum(weekday totals) === sum(bay totals) === grand total
 * holds by construction for every one of the three metrics. Nothing is hand-typed twice.
 */

import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  BarChart3,
  Boxes,
  CalendarRange,
  CheckCircle2,
  ClipboardList,
  Clock4,
  FileSpreadsheet,
  Gauge,
  PackageSearch,
  Truck,
  Users,
  Wrench,
} from "lucide-react";

/* ------------------------------------------------------------------ Brand */

export const BRAND = { name: "Bayline", tagline: "Fleet maintenance bay planner" };

export const CURRENT_USER = {
  name: "Dana Ferraro",
  role: "Shop operations manager",
  email: "dana.ferraro@bayline.app",
  avatarId: "1580489944761-15a19d654956",
};

export type Workspace = { id: string; name: string; plan: string };
export const WORKSPACES: Workspace[] = [
  { id: "ws-t4", name: "Midway Freight — Terminal 4", plan: "Shop Pro · 8 bays" },
  { id: "ws-t9", name: "Midway Freight — Terminal 9", plan: "Shop Pro · 5 bays" },
];

/* -------------------------------------------------------------- Global nav */

export type NavItem = { id: string; label: string; Icon: LucideIcon; active?: boolean; disabled?: boolean };
export type NavSection = { id: string; title: string; items: NavItem[] };

export const NAV_SECTIONS: NavSection[] = [
  {
    id: "planning",
    title: "Planning",
    items: [
      { id: "calendar", label: "Bay calendar", Icon: CalendarRange, active: true },
      { id: "orders", label: "Work orders", Icon: ClipboardList, disabled: true },
      { id: "parts", label: "Parts staging", Icon: PackageSearch, disabled: true },
    ],
  },
  {
    id: "fleet",
    title: "Fleet",
    items: [
      { id: "units", label: "Units", Icon: Truck, disabled: true },
      { id: "inspections", label: "Inspections", Icon: Gauge, disabled: true },
    ],
  },
  {
    id: "shop",
    title: "Shop",
    items: [
      { id: "bays", label: "Bays & crews", Icon: Users, disabled: true },
      { id: "reports", label: "Reports", Icon: BarChart3, disabled: true },
      { id: "exports", label: "Exports", Icon: FileSpreadsheet, disabled: true },
    ],
  },
];

export const NOTIFICATIONS = [
  { id: "n1", text: "Bay H2 lost 4 hours to a lift inspection on Feb 24.", time: "Feb 24, 08:12 CT" },
  { id: "n2", text: "Parts hold cleared on Unit 4127 — turbo actuator received.", time: "Feb 23, 16:40 CT" },
  { id: "n3", text: "Overtime on week of Mar 2 is 12% above the shop ceiling.", time: "Feb 23, 09:05 CT" },
];

/* ------------------------------------------------------------------ Period */

export const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
export const WEEKDAYS_LONG = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] as const;
const MONTH_SHORT = ["Feb", "Mar"] as const;

export const DAY_COUNT = 42;
export const WEEK_COUNT = 6;

/** i < 27 -> February (2 + i); i >= 27 -> March (i - 26). Verified: i=26 -> Feb 28, i=27 -> Mar 1. */
function calendarOf(i: number): { monthIndex: 0 | 1; dayOfMonth: number } {
  return i < 27 ? { monthIndex: 0, dayOfMonth: 2 + i } : { monthIndex: 1, dayOfMonth: i - 26 };
}

function pad2(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

/* ----------------------------------------------------------------- Bays */

export type BayId = "b1" | "b2" | "b3" | "b4" | "b5" | "b6" | "b7" | "b8";
export type BayGroup = "heavy" | "driveline" | "brake" | "quick" | "emissions" | "inspection";

export const BAY_GROUP_LABEL: Record<BayGroup, string> = {
  heavy: "Heavy line",
  driveline: "Driveline",
  brake: "Brake & air",
  quick: "Quick lane",
  emissions: "Aftertreatment",
  inspection: "Inspection lane",
};

export type Bay = { id: BayId; code: string; name: string; group: BayGroup; lead: string; shift: string };

export const BAYS: Bay[] = [
  { id: "b1", code: "H1", name: "Heavy line 1", group: "heavy", lead: "Marisol Vance", shift: "06:00–14:30" },
  { id: "b2", code: "H2", name: "Heavy line 2", group: "heavy", lead: "Dwayne Petro", shift: "13:30–22:00" },
  { id: "b3", code: "D1", name: "Driveline", group: "driveline", lead: "Anaya Whitfield", shift: "06:00–14:30" },
  { id: "b4", code: "A1", name: "Brake & air", group: "brake", lead: "Curtis Nakamura", shift: "06:00–14:30" },
  { id: "b5", code: "Q1", name: "Quick lane 1", group: "quick", lead: "Priya Raghavan", shift: "06:00–14:30" },
  { id: "b6", code: "Q2", name: "Quick lane 2", group: "quick", lead: "Tomas Iglesias", shift: "13:30–22:00" },
  { id: "b7", code: "E1", name: "Aftertreatment", group: "emissions", lead: "Renee Boulanger", shift: "07:00–15:30" },
  { id: "b8", code: "I1", name: "Inspection lane", group: "inspection", lead: "Gus Aldridge", shift: "06:00–14:30" },
];

export const BAY_BY_ID: Record<BayId, Bay> = BAYS.reduce(
  (acc, b) => {
    acc[b.id] = b;
    return acc;
  },
  {} as Record<BayId, Bay>,
);

export function initialsOf(name: string): string {
  const parts = name.split(" ");
  return `${parts[0].slice(0, 1)}${parts[parts.length - 1].slice(0, 1)}`;
}

/* ------------------------------------------------------------- Job types */

type Template = { code: string; name: string; bayHours: number; otHours: number; bays: BayId[] };

/** Twelve shop job types. `bays` is the set of bays qualified for that job. */
const TEMPLATES: Template[] = [
  { code: "PM-A", name: "PM-A inspection", bayHours: 3, otHours: 0, bays: ["b8", "b5"] },
  { code: "PM-B", name: "PM-B full service", bayHours: 5, otHours: 1, bays: ["b1", "b2"] },
  { code: "BRK", name: "Brake reline, drive axle", bayHours: 6, otHours: 2, bays: ["b4", "b1"] },
  { code: "DPF", name: "DPF clean & regen", bayHours: 4, otHours: 0, bays: ["b7"] },
  { code: "DOT", name: "DOT annual inspection", bayHours: 4, otHours: 1, bays: ["b8"] },
  { code: "TWE", name: "Tire & wheel-end service", bayHours: 3, otHours: 0, bays: ["b5", "b6"] },
  { code: "AIR", name: "Air-system leak repair", bayHours: 5, otHours: 2, bays: ["b4", "b2"] },
  { code: "TRN", name: "Transmission service", bayHours: 7, otHours: 3, bays: ["b3", "b1"] },
  { code: "CLT", name: "Coolant hose replacement", bayHours: 4, otHours: 1, bays: ["b6", "b5"] },
  { code: "TRB", name: "Turbo actuator replacement", bayHours: 6, otHours: 2, bays: ["b2", "b1"] },
  { code: "ALN", name: "Alignment, 3-axle", bayHours: 4, otHours: 0, bays: ["b3"] },
  { code: "NOX", name: "NOx sensor replacement", bayHours: 3, otHours: 1, bays: ["b7", "b6"] },
];

const UNITS: { unit: string; model: string }[] = [
  { unit: "4102", model: "Freightliner Cascadia" },
  { unit: "4118", model: "Kenworth T680" },
  { unit: "4127", model: "Freightliner Cascadia" },
  { unit: "4133", model: "Volvo VNL 760" },
  { unit: "4149", model: "Peterbilt 579" },
  { unit: "4156", model: "International LT" },
  { unit: "4164", model: "Kenworth T680" },
  { unit: "4171", model: "Mack Anthem" },
  { unit: "4188", model: "Volvo VNL 860" },
  { unit: "4195", model: "Freightliner M2 106" },
  { unit: "5203", model: "Peterbilt 389" },
  { unit: "5217", model: "International LT" },
  { unit: "5224", model: "Kenworth W990" },
  { unit: "5238", model: "Volvo VNR 640" },
  { unit: "5246", model: "Mack Pinnacle" },
  { unit: "5259", model: "Freightliner Cascadia" },
  { unit: "5263", model: "Peterbilt 579" },
  { unit: "5277", model: "Kenworth T880" },
  { unit: "5284", model: "Volvo VNL 760" },
  { unit: "5291", model: "International HX" },
  { unit: "6304", model: "Freightliner M2 112" },
  { unit: "6312", model: "Mack Granite" },
  { unit: "6325", model: "Peterbilt 567" },
  { unit: "6338", model: "Kenworth T680" },
  { unit: "6341", model: "Volvo VNL 300" },
  { unit: "6357", model: "International MV" },
  { unit: "6362", model: "Freightliner Cascadia" },
  { unit: "6379", model: "Peterbilt 579" },
  { unit: "6383", model: "Mack Anthem" },
  { unit: "6396", model: "Kenworth T680" },
];

export type OrderStatus = "confirmed" | "urgent" | "parts-hold";
export const STATUS_LABEL: Record<OrderStatus, string> = {
  confirmed: "Confirmed",
  urgent: "Urgent",
  "parts-hold": "Parts hold",
};
export const STATUS_ICON: Record<OrderStatus, LucideIcon> = {
  confirmed: CheckCircle2,
  urgent: AlertTriangle,
  "parts-hold": Clock4,
};
export const STATUS_TONE: Record<OrderStatus, "good" | "bad" | "warn"> = {
  confirmed: "good",
  urgent: "bad",
  "parts-hold": "warn",
};

/* ------------------------------------------------------------- Work orders */

/**
 * Hand-authored day shape: five busy weekdays, a half Saturday, and the occasional Sunday call-in.
 * 42 entries summing to 202 work orders across the horizon.
 */
const ORDERS_PER_DAY: number[] = [
  6, 7, 5, 6, 7, 3, 0,
  6, 5, 7, 6, 5, 2, 1,
  7, 6, 6, 7, 6, 3, 0,
  5, 6, 7, 5, 6, 2, 1,
  7, 7, 6, 6, 7, 3, 0,
  6, 6, 5, 7, 6, 2, 1,
];

/** Bay opens at 06:30; each successive slot in a day starts 85 minutes later (two shifts to 22:00). */
const FIRST_SLOT_MIN = 390;
const SLOT_STEP_MIN = 85;

export type WorkOrder = {
  id: string;
  dayIndex: number;
  slot: number;
  startMin: number;
  endMin: number;
  code: string;
  name: string;
  unit: string;
  model: string;
  bayId: BayId;
  tech: string;
  bayHours: number;
  otHours: number;
  status: OrderStatus;
};

function buildOrders(): WorkOrder[] {
  const out: WorkOrder[] = [];
  for (let i = 0; i < DAY_COUNT; i++) {
    const count = ORDERS_PER_DAY[i];
    for (let k = 0; k < count; k++) {
      const t = TEMPLATES[(i * 7 + k * 5) % TEMPLATES.length];
      const u = UNITS[(i * 11 + k * 4) % UNITS.length];
      // `(i + k)` would look fine and is not: the template index is `7i + 5k mod 12`, so inside any
      // one template the parity of `i + k` is fixed — a two-bay job type would always land in the
      // same bay and its partner would show a permanent 0 in the roster. Halving `i` breaks the tie.
      const bayId = t.bays[(Math.floor(i / 2) + k) % t.bays.length];
      const startMin = FIRST_SLOT_MIN + k * SLOT_STEP_MIN;
      const status: OrderStatus = (i + k) % 11 === 0 ? "urgent" : (i + k) % 7 === 0 ? "parts-hold" : "confirmed";
      out.push({
        id: `wo-${pad2(i)}-${k}`,
        dayIndex: i,
        slot: k,
        startMin,
        endMin: startMin + t.bayHours * 60,
        code: t.code,
        name: t.name,
        unit: u.unit,
        model: u.model,
        bayId,
        tech: BAY_BY_ID[bayId].lead,
        bayHours: t.bayHours,
        otHours: t.otHours,
        status,
      });
    }
  }
  return out;
}

export const ORDERS: WorkOrder[] = buildOrders();

/* ------------------------------------------------------------------ Days */

export type Day = {
  index: number;
  weekIndex: number;
  weekdayIndex: number;
  iso: string;
  short: string;
  long: string;
  dayOfMonth: number;
  monthShort: string;
  capacityHours: number;
  orders: WorkOrder[];
  values: Record<MetricId, number>;
};

export type MetricId = "orders" | "hours" | "overtime";

export const METRICS: { id: MetricId; label: string; short: string; spoken: string; unit: string; hint: string }[] = [
  { id: "orders", label: "Work orders", short: "orders", spoken: "work orders", unit: "", hint: "Jobs booked into a bay that day" },
  { id: "hours", label: "Bay hours", short: "bay h", spoken: "bay hours", unit: "h", hint: "Labour hours the bays are occupied" },
  // `label` is the control's caption, `spoken` is what a screen reader should hear after a number —
  // "10 overtime" is not a sentence, "10 overtime hours" is.
  { id: "overtime", label: "Overtime", short: "OT h", spoken: "overtime hours", unit: "h", hint: "Technician hours past the standard shift" },
];

export const METRIC_BY_ID: Record<MetricId, (typeof METRICS)[number]> = METRICS.reduce(
  (acc, m) => {
    acc[m.id] = m;
    return acc;
  },
  {} as Record<MetricId, (typeof METRICS)[number]>,
);

function capacityFor(weekdayIndex: number): number {
  if (weekdayIndex <= 4) return 36;
  if (weekdayIndex === 5) return 18;
  return 0;
}

function buildDays(): Day[] {
  const days: Day[] = [];
  for (let i = 0; i < DAY_COUNT; i++) {
    const { monthIndex, dayOfMonth } = calendarOf(i);
    const weekdayIndex = i % 7;
    const orders = ORDERS.filter((o) => o.dayIndex === i);
    const monthShort = MONTH_SHORT[monthIndex];
    days.push({
      index: i,
      weekIndex: Math.floor(i / 7),
      weekdayIndex,
      iso: `2026-${monthIndex === 0 ? "02" : "03"}-${pad2(dayOfMonth)}`,
      short: `${monthShort} ${dayOfMonth}`,
      long: `${WEEKDAYS_LONG[weekdayIndex]}, ${monthShort === "Feb" ? "February" : "March"} ${dayOfMonth}, 2026`,
      dayOfMonth,
      monthShort,
      capacityHours: capacityFor(weekdayIndex),
      orders,
      values: {
        orders: orders.length,
        hours: orders.reduce((s, o) => s + o.bayHours, 0),
        overtime: orders.reduce((s, o) => s + o.otHours, 0),
      },
    });
  }
  return days;
}

export const DAYS: Day[] = buildDays();

export type Week = { index: number; label: string; range: string; days: Day[]; totals: Record<MetricId, number> };

function sumDays(days: Day[]): Record<MetricId, number> {
  return {
    orders: days.reduce((s, d) => s + d.values.orders, 0),
    hours: days.reduce((s, d) => s + d.values.hours, 0),
    overtime: days.reduce((s, d) => s + d.values.overtime, 0),
  };
}

export const WEEKS: Week[] = Array.from({ length: WEEK_COUNT }, (_, w) => {
  const days = DAYS.filter((d) => d.weekIndex === w);
  // "Feb 16–22" inside one month, "Feb 23 – Mar 1" across a boundary. The long form ("Feb 16 – Feb
  // 22") overflowed the fixed-width week column at 1024px and bled into the Monday cell.
  const sameMonth = days[0].monthShort === days[6].monthShort;
  return {
    index: w,
    label: `Week ${w + 1}`,
    range: sameMonth ? `${days[0].short}–${days[6].dayOfMonth}` : `${days[0].short} – ${days[6].short}`,
    days,
    totals: sumDays(days),
  };
});

export const WEEKDAY_TOTALS = WEEKDAYS.map((_, wd) => ({
  weekdayIndex: wd,
  label: WEEKDAYS[wd],
  longLabel: WEEKDAYS_LONG[wd],
  totals: sumDays(DAYS.filter((d) => d.weekdayIndex === wd)),
}));

export const GRAND_TOTALS = sumDays(DAYS);

export const MAX_DAILY: Record<MetricId, number> = {
  orders: DAYS.reduce((m, d) => Math.max(m, d.values.orders), 0),
  hours: DAYS.reduce((m, d) => Math.max(m, d.values.hours), 0),
  overtime: DAYS.reduce((m, d) => Math.max(m, d.values.overtime), 0),
};

export const PEAK_DAY: Record<MetricId, Day> = {
  orders: DAYS.reduce((best, d) => (d.values.orders > best.values.orders ? d : best), DAYS[0]),
  hours: DAYS.reduce((best, d) => (d.values.hours > best.values.hours ? d : best), DAYS[0]),
  overtime: DAYS.reduce((best, d) => (d.values.overtime > best.values.overtime ? d : best), DAYS[0]),
};

export const TOTAL_CAPACITY_HOURS = DAYS.reduce((s, d) => s + d.capacityHours, 0);

/* --------------------------------------------------------------- Bay load */

export type BayLoad = { bay: Bay; totals: Record<MetricId, number>; days: number };

export const BAY_LOAD: BayLoad[] = BAYS.map((bay) => {
  const mine = ORDERS.filter((o) => o.bayId === bay.id);
  return {
    bay,
    days: new Set(mine.map((o) => o.dayIndex)).size,
    totals: {
      orders: mine.length,
      hours: mine.reduce((s, o) => s + o.bayHours, 0),
      overtime: mine.reduce((s, o) => s + o.otHours, 0),
    },
  };
});

/* -------------------------------------------------------------- Formatting */

const INT = new Intl.NumberFormat("en-US");

export function fmt(n: number): string {
  return INT.format(n);
}

export function fmtMetric(n: number, metric: MetricId): string {
  const m = METRIC_BY_ID[metric];
  return m.unit ? `${INT.format(n)}${m.unit}` : INT.format(n);
}

/** Minutes past midnight -> 24-hour shop clock. All shop times are America/Chicago. */
export function fmtTime(min: number): string {
  return `${pad2(Math.floor(min / 60) % 24)}:${pad2(min % 60)}`;
}

export function fmtPct(n: number): string {
  return `${Math.round(n)}%`;
}

/** Intensity bucket 0–5 for the calendar ramp. Level 0 is reserved for a genuinely empty day. */
export function levelOf(value: number, max: number): number {
  if (value <= 0) return 0;
  return Math.min(5, Math.max(1, Math.ceil((value / max) * 5)));
}

/** Inclusive numeric range each ramp step stands for — printed in the legend, never hover-only. */
export function rampBands(max: number): { level: number; lo: number; hi: number }[] {
  const bands: { level: number; lo: number; hi: number }[] = [];
  let prevHi = 0;
  for (let level = 1; level <= 5; level++) {
    const hi = Math.ceil((level * max) / 5);
    bands.push({ level, lo: prevHi + 1, hi });
    prevHi = hi;
  }
  return bands;
}

/* --------------------------------------------------------- Palette sources */

export const QUICK_VIEWS: { id: string; label: string; targetId: string; Icon: LucideIcon }[] = [
  { id: "v-cal", label: "Jump to bay load calendar", targetId: "calendar-card", Icon: CalendarRange },
  { id: "v-agenda", label: "Jump to day agenda", targetId: "agenda-card", Icon: ClipboardList },
  { id: "v-trend", label: "Jump to daily trend", targetId: "trend-card", Icon: BarChart3 },
  { id: "v-bays", label: "Jump to bay roster", targetId: "bays-card", Icon: Boxes },
  { id: "v-profile", label: "Jump to weekday profile", targetId: "profile-card", Icon: Wrench },
];
