/**
 * Siteframe — deterministic domain data for a clinical-trial site-visit scheduling console
 * (auto-dash-r66 / candidate b).
 *
 * Nothing below calls `Math.random()`, `Date.now()`, or bare `new Date()`. "Today" is a fixed
 * demo anchor — Wednesday, November 25, 2026 — represented as a plain day-of-month integer
 * (`TODAY_DAY`), never a `Date` object, so every weekday/label computation below is hand-rolled
 * arithmetic against that integer and is immune to runtime timezone or clock differences.
 *
 * `ALL_VISITS` is generated once from two small per-day count seeds (one per trial) by
 * `buildVisits`, which is pure index arithmetic — no randomness, same output every time. Every
 * number this route renders (calendar cell counts, KPI totals, on-time rate, site summaries, the
 * sparkline, the notifications list) is derived from that one array by the aggregate functions at
 * the bottom of this file, so a displayed total can never drift from the records behind it.
 */

export type SiteId = "S014" | "S021" | "S032" | "S045";
export type TrialId = "arx312" | "btn119";
export type VisitStatus = "scheduled" | "confirmed" | "completed" | "missed" | "cancelled";
export type VisitType =
  | "Screening"
  | "Baseline"
  | "Follow-up Wk4"
  | "Follow-up Wk12"
  | "Follow-up Wk24"
  | "End of Study"
  | "Unscheduled";

export interface Site {
  id: SiteId;
  code: string;
  name: string;
  coordinator: string;
}

export interface Trial {
  id: TrialId;
  code: string;
  name: string;
  sponsor: string;
  /** Fixed monthly visit target used for the "on pace" progress bar — a plan figure, not derived. */
  monthlyTarget: number;
}

export interface Visit {
  id: string;
  trialId: TrialId;
  /** Day of month, November 2026, 1–30. */
  day: number;
  /** Minutes since midnight. */
  start: number;
  duration: number;
  siteId: SiteId;
  visitType: VisitType;
  status: VisitStatus;
  patientId: string;
}

// ---------------------------------------------------------------------------
// Fixed reference calendar — November 2026. Nov 1, 2026 is a Sunday (hand-verified against the
// Jan 1, 2026 = Thursday anchor), so the month needs no leading filler days.
// ---------------------------------------------------------------------------

export const TODAY_DAY = 25;
export const NOW_MINUTES = 810; // 1:30 PM demo clock, fixed — not read from any real clock.
export const MONTH_LABEL = "November 2026";
export const WEEKDAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
export const WEEKDAY_LONG = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export interface CalendarCell {
  /** Day-of-month in whichever month this cell belongs to. */
  day: number;
  /** 0 = November, 1 = December (trailing filler only). */
  monthOffset: 0 | 1;
  inMonth: boolean;
  weekday: number;
}

function makeCalendarCell(serial: number): CalendarCell {
  const inMonth = serial <= 30;
  return {
    day: inMonth ? serial : serial - 30,
    monthOffset: inMonth ? 0 : 1,
    inMonth,
    weekday: (serial - 1) % 7,
  };
}

export const CALENDAR_CELLS: CalendarCell[] = Array.from({ length: 35 }, (_, idx) => makeCalendarCell(idx + 1));

export const CALENDAR_WEEKS: CalendarCell[][] = Array.from({ length: 5 }, (_, w) =>
  CALENDAR_CELLS.slice(w * 7, w * 7 + 7)
);

/** Index of the week row that contains `TODAY_DAY` — used as the default week-view selection. */
export const CURRENT_WEEK_INDEX = Math.floor((TODAY_DAY - 1) / 7);

export function formatDayHeading(day: number): string {
  const weekday = WEEKDAY_LONG[(day - 1) % 7];
  return `${weekday}, November ${day}`;
}

export function formatDayShort(day: number): string {
  const weekday = WEEKDAY_SHORT[(day - 1) % 7];
  return `${weekday}, Nov ${day}`;
}

// ---------------------------------------------------------------------------
// Clock formatting — hand-rolled against minute-of-day integers, never `Date`.
// ---------------------------------------------------------------------------

export function formatClock(totalMinutes: number): string {
  const m = ((totalMinutes % 1440) + 1440) % 1440;
  const hour24 = Math.floor(m / 60);
  const minute = m % 60;
  const period = hour24 >= 12 ? "PM" : "AM";
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return `${hour12}:${minute.toString().padStart(2, "0")} ${period}`;
}

export function formatRange(start: number, duration: number): string {
  const from = formatClock(start);
  const to = formatClock(start + duration);
  const fromPeriod = from.slice(-2);
  const toPeriod = to.slice(-2);
  // Drop the repeated meridiem when both endpoints share it ("8:30–9:00 AM" not "8:30 AM–9:00 AM")
  // -- the duplicated " AM"/" PM" was the single largest contributor to the Time column overflowing
  // its colgroup width and overlapping the Patient column (sweep cell-overlap, up to 62px at 1264px).
  if (fromPeriod === toPeriod) {
    return `${from.slice(0, -3)}–${to}`;
  }
  return `${from}–${to}`;
}

export const countFmt = new Intl.NumberFormat("en-US");
export const pctFmt = new Intl.NumberFormat("en-US", { style: "percent", maximumFractionDigits: 0 });

export function formatPercent(ratio: number | null): string {
  if (ratio === null) return "—";
  return pctFmt.format(ratio);
}

// ---------------------------------------------------------------------------
// Sites, trials
// ---------------------------------------------------------------------------

export const SITES: Site[] = [
  { id: "S014", code: "014", name: "Ashgrove Clinical Research", coordinator: "Priya Shah, CRC" },
  { id: "S021", code: "021", name: "Crescent Bay Medical Group", coordinator: "Daniel Ochoa, CRC" },
  { id: "S032", code: "032", name: "Oakmere Health Partners", coordinator: "Harriet Voss, CRC" },
  { id: "S045", code: "045", name: "Union Square Trials Center", coordinator: "Noor Siddiqui, CRC" },
];

export function getSite(id: SiteId): Site {
  return SITES.find((s) => s.id === id) ?? SITES[0];
}

export const TRIALS: Trial[] = [
  { id: "arx312", code: "ARX-312", name: "ARX-312 — Hypertension, Phase II", sponsor: "Meridian Biotherapeutics", monthlyTarget: 140 },
  { id: "btn119", code: "BTN-119", name: "BTN-119 — NSCLC, Phase I", sponsor: "Solace Oncology", monthlyTarget: 80 },
];

export function getTrial(id: TrialId): Trial {
  return TRIALS.find((t) => t.id === id) ?? TRIALS[0];
}

export const STATUS_LABEL: Record<VisitStatus, string> = {
  scheduled: "Scheduled",
  confirmed: "Confirmed",
  completed: "Completed",
  missed: "Missed",
  cancelled: "Cancelled",
};

export type StatusFilter = "all" | VisitStatus;

export const STATUS_FILTERS: StatusFilter[] = ["all", "scheduled", "confirmed", "completed", "missed", "cancelled"];

// ---------------------------------------------------------------------------
// Deterministic visit generation
// ---------------------------------------------------------------------------

const CLINIC_SLOTS = [480, 510, 540, 570, 600, 630, 660, 690, 720, 750, 780, 810, 840, 870, 900, 930, 960];

const VISIT_TYPE_POOL: VisitType[] = [
  "Screening",
  "Follow-up Wk4",
  "Baseline",
  "Follow-up Wk12",
  "Follow-up Wk4",
  "Follow-up Wk24",
  "Follow-up Wk12",
  "End of Study",
  "Follow-up Wk4",
  "Unscheduled",
];

export const DURATION_BY_TYPE: Record<VisitType, number> = {
  Screening: 90,
  Baseline: 60,
  "Follow-up Wk4": 45,
  "Follow-up Wk12": 45,
  "Follow-up Wk24": 45,
  "End of Study": 75,
  Unscheduled: 30,
};

function statusFor(day: number, i: number, start: number): VisitStatus {
  if (day < TODAY_DAY) {
    if ((day + i) % 13 === 0) return "missed";
    if ((day + i) % 19 === 0) return "cancelled";
    return "completed";
  }
  if (day === TODAY_DAY) {
    if (start < NOW_MINUTES) {
      if ((day + i) % 13 === 0) return "missed";
      return "completed";
    }
    if ((day + i) % 19 === 0) return "cancelled";
    return i % 2 === 0 ? "confirmed" : "scheduled";
  }
  if ((day + i) % 19 === 0) return "cancelled";
  return i % 2 === 0 ? "confirmed" : "scheduled";
}

function buildVisits(trialId: TrialId, dayCounts: number[]): Visit[] {
  const visits: Visit[] = [];
  dayCounts.forEach((count, dayIdx) => {
    const day = dayIdx + 1;
    for (let i = 0; i < count; i++) {
      const slotIndex = (day * 5 + i * 3) % CLINIC_SLOTS.length;
      const start = CLINIC_SLOTS[slotIndex];
      const site = SITES[(day + i) % SITES.length];
      const visitType = VISIT_TYPE_POOL[(day * 3 + i) % VISIT_TYPE_POOL.length];
      const subjectNum = 100 + ((day * 7 + i * 11) % 150);
      visits.push({
        id: `${trialId}-d${day}-${i}`,
        trialId,
        day,
        start,
        duration: DURATION_BY_TYPE[visitType],
        siteId: site.id,
        visitType,
        status: statusFor(day, i, start),
        patientId: `${site.code}-${subjectNum}`,
      });
    }
  });
  return visits;
}

// Visits per day of November, index 0 = Nov 1. Weekdays carry load; weekends are closed.
const ARX_DAY_COUNTS = [
  0, 6, 7, 5, 8, 4, 0,
  0, 7, 9, 6, 8, 5, 1,
  0, 8, 6, 7, 9, 4, 0,
  0, 7, 6, 8, 5, 3, 0,
  0, 4,
];

const BTN_DAY_COUNTS = [
  0, 3, 4, 2, 5, 2, 0,
  0, 4, 3, 5, 3, 2, 0,
  0, 5, 3, 4, 2, 3, 0,
  0, 4, 5, 3, 4, 2, 0,
  0, 3,
];

export const ALL_VISITS: Visit[] = [...buildVisits("arx312", ARX_DAY_COUNTS), ...buildVisits("btn119", BTN_DAY_COUNTS)];

// ---------------------------------------------------------------------------
// Pure aggregate helpers — every one reads from a `visits` array passed in by the caller
// (already trial-filtered), never from a module-level trial assumption.
// ---------------------------------------------------------------------------

export function filterByTrial(visits: Visit[], trialId: TrialId): Visit[] {
  return visits.filter((v) => v.trialId === trialId);
}

export function dayCount(visits: Visit[], day: number): number {
  return visits.filter((v) => v.day === day).length;
}

export function visitsForDay(visits: Visit[], day: number): Visit[] {
  return visits.filter((v) => v.day === day).sort((a, b) => a.start - b.start);
}

export function visitTypeBreakdownForDay(visits: Visit[], day: number): { type: VisitType; count: number }[] {
  const byType = new Map<VisitType, number>();
  for (const v of visitsForDay(visits, day)) byType.set(v.visitType, (byType.get(v.visitType) ?? 0) + 1);
  return Array.from(byType.entries()).map(([type, count]) => ({ type, count }));
}

export interface StatusCounts {
  scheduled: number;
  confirmed: number;
  completed: number;
  missed: number;
  cancelled: number;
}

export function statusCounts(visits: Visit[]): StatusCounts {
  const base: StatusCounts = { scheduled: 0, confirmed: 0, completed: 0, missed: 0, cancelled: 0 };
  for (const v of visits) base[v.status] += 1;
  return base;
}

/** On-time rate = completed / (completed + missed), counted only among visits whose day has
 *  already happened (day <= TODAY_DAY) — a scheduled future visit cannot yet be "on time" or
 *  "missed". Cancelled visits are excluded (sponsor/site-initiated, not a patient no-show). */
export function onTimeRate(visits: Visit[], siteId?: SiteId): number | null {
  const pool = visits.filter((v) => v.day <= TODAY_DAY && (siteId === undefined || v.siteId === siteId));
  const completed = pool.filter((v) => v.status === "completed").length;
  const missed = pool.filter((v) => v.status === "missed").length;
  const denom = completed + missed;
  return denom === 0 ? null : completed / denom;
}

export interface SiteSummary {
  site: Site;
  total: number;
  completed: number;
  missed: number;
  upcoming: number;
  onTime: number | null;
}

export function siteSummaries(visits: Visit[]): SiteSummary[] {
  return SITES.map((site) => {
    const pool = visits.filter((v) => v.siteId === site.id);
    return {
      site,
      total: pool.length,
      completed: pool.filter((v) => v.status === "completed").length,
      missed: pool.filter((v) => v.status === "missed").length,
      upcoming: pool.filter((v) => v.day >= TODAY_DAY && (v.status === "scheduled" || v.status === "confirmed")).length,
      onTime: onTimeRate(visits, site.id),
    };
  });
}

/** Trailing 7-day volume ending today, read from the same `dayCount` every calendar cell uses. */
export function sparklineSeries(visits: Visit[]): number[] {
  const series: number[] = [];
  for (let d = TODAY_DAY - 6; d <= TODAY_DAY; d++) series.push(dayCount(visits, d));
  return series;
}

/** Visits that need dispatcher attention: already missed, or an unscheduled add-on that is not
 *  yet resolved. The single source the notifications popover reads, so its list and its badge
 *  count can never drift apart. */
export function atRiskVisits(visits: Visit[]): Visit[] {
  return visits
    .filter((v) => v.status === "missed" || (v.visitType === "Unscheduled" && v.status !== "cancelled"))
    .sort((a, b) => (b.day !== a.day ? b.day - a.day : a.start - b.start));
}

/** The day (1–30) carrying the most visits for this trial — ties resolve to the earliest day. */
export function busiestDay(visits: Visit[]): number {
  let best = 1;
  let bestCount = -1;
  for (let day = 1; day <= 30; day++) {
    const c = dayCount(visits, day);
    if (c > bestCount) {
      bestCount = c;
      best = day;
    }
  }
  return best;
}

/** 0–5 heat bucket from a raw visit count, shared by the month grid and the week strip so both
 *  views color identically for the same underlying number. */
export function heatBucket(count: number): 0 | 1 | 2 | 3 | 4 | 5 {
  if (count === 0) return 0;
  if (count <= 2) return 1;
  if (count <= 4) return 2;
  if (count <= 6) return 3;
  if (count <= 8) return 4;
  return 5;
}

export const HEAT_CELL_CLASS: Record<0 | 1 | 2 | 3 | 4 | 5, string> = {
  0: "bg-white",
  1: "bg-lime-50",
  2: "bg-lime-100",
  3: "bg-lime-200",
  4: "bg-lime-300",
  5: "bg-lime-400",
};

export const HEAT_TEXT_CLASS: Record<0 | 1 | 2 | 3 | 4 | 5, string> = {
  0: "text-zinc-400",
  1: "text-lime-800",
  2: "text-lime-800",
  3: "text-lime-900",
  4: "text-lime-900",
  5: "text-lime-950",
};
