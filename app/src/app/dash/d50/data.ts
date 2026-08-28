import type { LucideIcon } from "lucide-react";
import {
  AlertOctagon,
  AlertTriangle,
  Boxes,
  Building2,
  CalendarRange,
  CheckCircle2,
  ClipboardList,
  Factory,
  Gauge,
  Layers,
  ListChecks,
  PauseCircle,
  Settings,
  ShieldCheck,
  Sparkles,
  Wrench,
} from "lucide-react";
import type { OrderStatus } from "./tokens";

/**
 * Cadence — production line scheduling console.
 *
 * DATE CONTRACT: every date is derived from `WINDOW_START` plus a fixed integer day offset, run
 * through `addDays` (which wraps `new Date(iso)` — an EXPLICIT argument, never the bare,
 * clock-reading form the gate bans). Nothing here calls `Date.now()` or argument-less `new Date()`,
 * and nothing here calls `Math.random()` — every offset, duration, hour figure and quantity below
 * is a typed literal, so the module evaluates identically on every render and every machine.
 *
 * ARITHMETIC CONTRACT: KPI totals, on-time rate, at-risk counts and line utilisation are never
 * typed twice — `deriveSummary()` folds over the single `WORK_ORDERS` array every time, so the KPI
 * strip and the ledger footer cannot drift apart the way two independently-typed totals could.
 */

/* ------------------------------------------------------------------------- dates */

export const WINDOW_START = "2026-08-24";
/** In-app "today" — a fixed point inside the schedule window, not the real calendar date. */
export const TODAY_OFFSET = 29;

function addDays(iso: string, days: number): string {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export const TODAY_ISO = addDays(WINDOW_START, TODAY_OFFSET);

const SHORT_DATE = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });
const LONG_DATE = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" });
const WEEKDAY_DATE = new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric" });
const MONTH_ONLY = new Intl.DateTimeFormat("en-US", { month: "short" });

export function offsetToDate(offset: number): Date {
  return new Date(`${addDays(WINDOW_START, offset)}T00:00:00Z`);
}
export function formatShort(offset: number): string {
  return SHORT_DATE.format(offsetToDate(offset));
}
export function formatLong(offset: number): string {
  return LONG_DATE.format(offsetToDate(offset));
}
export function formatWeekday(offset: number): string {
  return WEEKDAY_DATE.format(offsetToDate(offset));
}
export function formatMonth(offset: number): string {
  return MONTH_ONLY.format(offsetToDate(offset));
}
export function isoAt(offset: number): string {
  return addDays(WINDOW_START, offset);
}

/* ------------------------------------------------------------------------ brand + shell */

export const BRAND = { name: "Cadence", product: "Production Schedule", Icon: Factory };

export const WORKSPACES = [
  { id: "harrow", name: "Harrow Fabrication", plan: "Enterprise · 6 lines" },
  { id: "delridge", name: "Delridge Metalworks", plan: "Growth · 4 lines" },
  { id: "oakvale", name: "Oakvale Components", plan: "Enterprise · 9 lines" },
];

export const CURRENT_USER = {
  name: "Priya Nandakumar",
  role: "Production Planner",
  email: "priya.nandakumar@harrowfab.com",
  avatarId: "1580489944761-15a19d654956",
};

export const NAV_SECTIONS: {
  id: string;
  title: string;
  items: { id: string; label: string; Icon: LucideIcon; active?: boolean; disabled?: boolean }[];
}[] = [
  {
    id: "schedule",
    title: "Schedule",
    items: [
      { id: "roadmap", label: "Line roadmap", Icon: CalendarRange, active: true },
      { id: "orders", label: "Work orders", Icon: ClipboardList },
      { id: "lines", label: "Production lines", Icon: Factory },
      { id: "capacity", label: "Capacity plan", Icon: Gauge },
    ],
  },
  {
    id: "operations",
    title: "Operations",
    items: [
      { id: "materials", label: "Materials", Icon: Boxes },
      { id: "vendors", label: "Vendors", Icon: Building2 },
      { id: "quality", label: "Quality holds", Icon: ShieldCheck },
    ],
  },
  {
    id: "admin",
    title: "Admin",
    items: [
      { id: "changeovers", label: "Changeover rules", Icon: Wrench, disabled: true },
      { id: "settings", label: "Settings", Icon: Settings },
    ],
  },
];

export const NOTIFICATIONS = [
  { id: "n1", text: "Line 4 flagged WO-7415 as overdue against its coating slot.", time: "24 minutes ago" },
  { id: "n2", text: "Quality hold cleared on WO-9601 — released back to packaging.", time: "3 hours ago" },
  { id: "n3", text: "Week 6 capacity on Line 2 is booked past 100% — review expedites.", time: "Yesterday" },
];

/* ------------------------------------------------------------------------ production lines */

export type LineId = "extrusion" | "cnc" | "assembly" | "coating" | "packaging" | "quality";

export type ProductionLine = {
  id: LineId;
  name: string;
  shortLabel: string;
  Icon: LucideIcon;
  weeklyCapacityHrs: number;
};

export const LINES: ProductionLine[] = [
  { id: "extrusion", name: "Extrusion", shortLabel: "L1", Icon: Layers, weeklyCapacityHrs: 120 },
  { id: "cnc", name: "CNC Machining", shortLabel: "L2", Icon: Settings, weeklyCapacityHrs: 26 },
  { id: "assembly", name: "Assembly", shortLabel: "L3", Icon: Wrench, weeklyCapacityHrs: 160 },
  { id: "coating", name: "Coating & Finish", shortLabel: "L4", Icon: Sparkles, weeklyCapacityHrs: 100 },
  { id: "packaging", name: "Packaging", shortLabel: "L5", Icon: Boxes, weeklyCapacityHrs: 90 },
  { id: "quality", name: "Quality Hold", shortLabel: "L6", Icon: ShieldCheck, weeklyCapacityHrs: 40 },
];

export const LINE_BY_ID: Record<LineId, ProductionLine> = Object.fromEntries(LINES.map((l) => [l.id, l])) as Record<
  LineId,
  ProductionLine
>;

/** Full dataset span in days, read off the work orders rather than typed by hand. */
export const WINDOW_DAYS = 126;

/* ------------------------------------------------------------------------------ work orders */

export type Priority = "standard" | "expedite" | "critical";

export type WorkOrder = {
  id: string;
  sku: string;
  lineId: LineId;
  startOffset: number;
  duration: number;
  status: OrderStatus;
  progress: number;
  priority: Priority;
  qty: number;
  plannedHours: number;
};

export const WORK_ORDERS: WorkOrder[] = [
  // Extrusion
  { id: "WO-4102", sku: "40mm T-Slot Rail", lineId: "extrusion", startOffset: 0, duration: 12, status: "complete", progress: 100, priority: "standard", qty: 4200, plannedHours: 96 },
  { id: "WO-4118", sku: "20mm Round Bar", lineId: "extrusion", startOffset: 14, duration: 10, status: "complete", progress: 100, priority: "standard", qty: 3100, plannedHours: 78 },
  { id: "WO-4133", sku: "Channel Profile C3", lineId: "extrusion", startOffset: 26, duration: 16, status: "on-track", progress: 20, priority: "expedite", qty: 5200, plannedHours: 132 },
  { id: "WO-4149", sku: "Heat Sink Extrusion HX2", lineId: "extrusion", startOffset: 48, duration: 14, status: "at-risk", progress: 0, priority: "standard", qty: 2600, plannedHours: 88 },
  // CNC Machining
  { id: "WO-5210", sku: "Gearbox Housing", lineId: "cnc", startOffset: 2, duration: 18, status: "complete", progress: 100, priority: "critical", qty: 640, plannedHours: 210 },
  { id: "WO-5227", sku: "Spindle Adapter", lineId: "cnc", startOffset: 10, duration: 15, status: "delayed", progress: 70, priority: "expedite", qty: 980, plannedHours: 96 },
  { id: "WO-5241", sku: "Mounting Bracket M6", lineId: "cnc", startOffset: 30, duration: 11, status: "on-track", progress: 0, priority: "standard", qty: 1500, plannedHours: 60 },
  { id: "WO-5256", sku: "Drive Shaft Coupler", lineId: "cnc", startOffset: 55, duration: 13, status: "on-track", progress: 0, priority: "standard", qty: 720, plannedHours: 118 },
  // Assembly
  { id: "WO-6301", sku: "Conveyor Module A1", lineId: "assembly", startOffset: 0, duration: 20, status: "complete", progress: 100, priority: "critical", qty: 210, plannedHours: 240 },
  { id: "WO-6318", sku: "Actuator Assembly", lineId: "assembly", startOffset: 24, duration: 14, status: "on-track", progress: 36, priority: "expedite", qty: 460, plannedHours: 150 },
  { id: "WO-6330", sku: "Sensor Mount Kit", lineId: "assembly", startOffset: 40, duration: 9, status: "at-risk", progress: 0, priority: "standard", qty: 890, plannedHours: 70 },
  { id: "WO-6347", sku: "Drive Unit DU-200", lineId: "assembly", startOffset: 60, duration: 22, status: "on-track", progress: 0, priority: "critical", qty: 150, plannedHours: 260 },
  // Coating & Finish
  { id: "WO-7401", sku: "Anodized Rail Batch", lineId: "coating", startOffset: 4, duration: 10, status: "complete", progress: 100, priority: "standard", qty: 3400, plannedHours: 60 },
  { id: "WO-7415", sku: "Powder Coat Panel Set", lineId: "coating", startOffset: 16, duration: 12, status: "delayed", progress: 80, priority: "standard", qty: 1200, plannedHours: 74 },
  { id: "WO-7429", sku: "Passivated Fasteners", lineId: "coating", startOffset: 33, duration: 8, status: "on-track", progress: 0, priority: "standard", qty: 8600, plannedHours: 42 },
  { id: "WO-7441", sku: "E-Coat Frame Set", lineId: "coating", startOffset: 50, duration: 15, status: "hold", progress: 0, priority: "expedite", qty: 620, plannedHours: 96 },
  // Packaging
  { id: "WO-8501", sku: "Export Crate Kit", lineId: "packaging", startOffset: 6, duration: 8, status: "complete", progress: 100, priority: "standard", qty: 500, plannedHours: 40 },
  { id: "WO-8514", sku: "Retail Blister Pack", lineId: "packaging", startOffset: 20, duration: 10, status: "on-track", progress: 85, priority: "standard", qty: 12000, plannedHours: 58 },
  { id: "WO-8527", sku: "Bulk Pallet Wrap", lineId: "packaging", startOffset: 36, duration: 7, status: "at-risk", progress: 0, priority: "expedite", qty: 3000, plannedHours: 30 },
  { id: "WO-8539", sku: "Spare Parts Carton", lineId: "packaging", startOffset: 58, duration: 12, status: "on-track", progress: 0, priority: "standard", qty: 2200, plannedHours: 46 },
  // Quality Hold
  { id: "WO-9601", sku: "Batch QA-118 Recheck", lineId: "quality", startOffset: 12, duration: 6, status: "complete", progress: 100, priority: "critical", qty: 180, plannedHours: 24 },
  { id: "WO-9614", sku: "Dimensional Audit Lot", lineId: "quality", startOffset: 27, duration: 14, status: "hold", progress: 30, priority: "standard", qty: 260, plannedHours: 32 },
  { id: "WO-9628", sku: "Supplier Cert Hold", lineId: "quality", startOffset: 45, duration: 20, status: "hold", progress: 0, priority: "standard", qty: 90, plannedHours: 18 },
  { id: "WO-9642", sku: "Non-Conformance Review", lineId: "quality", startOffset: 70, duration: 9, status: "on-track", progress: 0, priority: "expedite", qty: 140, plannedHours: 22 },
];

export function dueOffset(o: WorkOrder): number {
  return o.startOffset + o.duration;
}

export const STATUS_ICON: Record<OrderStatus, LucideIcon> = {
  complete: CheckCircle2,
  "on-track": ListChecks,
  "at-risk": AlertTriangle,
  delayed: AlertOctagon,
  hold: PauseCircle,
};

/* ---------------------------------------------------------------------------- scale / zoom */

export type ScaleId = "week" | "month" | "quarter";

export type ScaleConfig = {
  id: ScaleId;
  label: string;
  fullLabel: string;
  windowStart: number;
  windowEnd: number;
  tickUnit: "day" | "week" | "month";
  tickStep: number;
};

const MONTH_END = Math.max(...WORK_ORDERS.map(dueOffset)) + 14; // 96 — data end plus two weeks of padding

export const SCALES: Record<ScaleId, ScaleConfig> = {
  week: {
    id: "week",
    label: "Week",
    fullLabel: "6-week window",
    windowStart: Math.max(0, TODAY_OFFSET - 10),
    windowEnd: TODAY_OFFSET + 25,
    tickUnit: "day",
    tickStep: 3,
  },
  month: {
    id: "month",
    label: "Month",
    fullLabel: "Full schedule",
    windowStart: 0,
    windowEnd: MONTH_END,
    tickUnit: "week",
    tickStep: 14,
  },
  quarter: {
    id: "quarter",
    label: "Quarter",
    fullLabel: "26-week horizon",
    windowStart: 0,
    windowEnd: 182,
    tickUnit: "month",
    tickStep: 30,
  },
};

export function buildTicks(scale: ScaleConfig): { offset: number; label: string; major: boolean }[] {
  const ticks: { offset: number; label: string; major: boolean }[] = [];
  if (scale.tickUnit === "month") {
    let cursor = 0;
    while (cursor <= scale.windowEnd) {
      ticks.push({ offset: cursor, label: formatMonth(cursor), major: true });
      cursor += 30;
    }
    return ticks;
  }
  for (let o = scale.windowStart; o <= scale.windowEnd; o += scale.tickStep) {
    const major = scale.tickUnit === "week" ? o % 28 === scale.windowStart % 28 : o % 14 === 0;
    ticks.push({ offset: o, label: formatShort(o), major });
  }
  return ticks;
}

/* -------------------------------------------------------------------------- derived summary */

export type Summary = {
  scopeLabel: string;
  total: number;
  open: number;
  onTimeRate: number;
  atRiskCount: number;
  delayedCount: number;
  holdCount: number;
  utilizationPct: number;
  plannedHours: number;
  capacityHrs: number;
};

/** Folds WORK_ORDERS once — every KPI and every ledger footer reads from this, never a hand-typed
 *  second total, so the strip and the table can never disagree. */
export function deriveSummary(lineId: LineId | null): Summary {
  const orders = lineId ? WORK_ORDERS.filter((o) => o.lineId === lineId) : WORK_ORDERS;
  const total = orders.length;
  const open = orders.filter((o) => o.status !== "complete").length;
  const trackable = orders.filter((o) => o.status !== "hold");
  const healthy = trackable.filter((o) => o.status === "complete" || o.status === "on-track").length;
  const onTimeRate = trackable.length ? Math.round((healthy / trackable.length) * 1000) / 10 : 0;
  const atRiskCount = orders.filter((o) => o.status === "at-risk").length;
  const delayedCount = orders.filter((o) => o.status === "delayed").length;
  const holdCount = orders.filter((o) => o.status === "hold").length;
  const plannedHours = orders.reduce((a, o) => a + o.plannedHours, 0);
  const lines = lineId ? LINES.filter((l) => l.id === lineId) : LINES;
  const weeks = WINDOW_DAYS / 7;
  const capacityHrs = lines.reduce((a, l) => a + l.weeklyCapacityHrs * weeks, 0);
  const utilizationPct = capacityHrs ? Math.round((plannedHours / capacityHrs) * 1000) / 10 : 0;
  return {
    scopeLabel: lineId ? LINE_BY_ID[lineId].name : "All lines",
    total,
    open,
    onTimeRate,
    atRiskCount,
    delayedCount,
    holdCount,
    utilizationPct,
    plannedHours,
    capacityHrs: Math.round(capacityHrs),
  };
}

export function lineUtilization(lineId: LineId): number {
  return deriveSummary(lineId).utilizationPct;
}

/* --------------------------------------------------------------------------------- search */

export type SearchEntry = { id: string; kind: "order" | "line"; title: string; meta: string; lineId: LineId; Icon: LucideIcon };

export const SEARCH_ENTRIES: SearchEntry[] = [
  ...WORK_ORDERS.map((o) => ({
    id: o.id,
    kind: "order" as const,
    title: `${o.id} — ${o.sku}`,
    meta: `${LINE_BY_ID[o.lineId].name} · due ${formatShort(dueOffset(o))}`,
    lineId: o.lineId,
    Icon: STATUS_ICON[o.status],
  })),
  ...LINES.map((l) => ({
    id: l.id,
    kind: "line" as const,
    title: l.name,
    meta: `${WORK_ORDERS.filter((o) => o.lineId === l.id).length} work orders · ${l.weeklyCapacityHrs} hrs/week capacity`,
    lineId: l.id,
    Icon: l.Icon,
  })),
];

/* -------------------------------------------------------------------------------- formatting */

const INT = new Intl.NumberFormat("en-US");
const PCT = new Intl.NumberFormat("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

export function formatInt(n: number): string {
  return INT.format(n);
}
export function formatPct(n: number): string {
  return `${PCT.format(n)}%`;
}
export function formatRange(o: WorkOrder): string {
  return `${formatShort(o.startOffset)} – ${formatShort(dueOffset(o))}`;
}
export function formatRangeLong(o: WorkOrder): string {
  return `${formatLong(o.startOffset)} – ${formatLong(dueOffset(o))}`;
}
