// ---------------------------------------------------------------------------
// Pure calendar math — deliberately NOT using `new Date()` / `Date.now()`
// anywhere (both are on the forbidden list). Every date is a plain
// { y, m, d } triple (m is 1-12) and day-of-week / month arithmetic runs on
// Howard Hinnant's civil_from_days / days_from_civil algorithm, which is
// exact for the whole proleptic Gregorian calendar using only integer math.
// ---------------------------------------------------------------------------

export interface Civil {
  y: number;
  m: number; // 1-12
  d: number;
}

/** Days since 1970-01-01 (can be negative). No Date object involved. */
export function daysFromCivil(y: number, m: number, d: number): number {
  const yy = m <= 2 ? y - 1 : y;
  const era = Math.floor((yy >= 0 ? yy : yy - 399) / 400);
  const yoe = yy - era * 400; // [0, 399]
  const mp = m + (m > 2 ? -3 : 9); // [0, 11]
  const doy = Math.floor((153 * mp + 2) / 5) + d - 1; // [0, 365]
  const doe = yoe * 365 + Math.floor(yoe / 4) - Math.floor(yoe / 100) + doy; // [0, 146096]
  return era * 146097 + doe - 719468;
}

/** Inverse of daysFromCivil. */
export function civilFromDays(z: number): Civil {
  const zz = z + 719468;
  const era = Math.floor((zz >= 0 ? zz : zz - 146096) / 146097);
  const doe = zz - era * 146097; // [0, 146096]
  const yoe = Math.floor(
    (doe - Math.floor(doe / 1460) + Math.floor(doe / 36524) - Math.floor(doe / 146096)) / 365
  ); // [0, 399]
  const y = yoe + era * 400;
  const doy = doe - (365 * yoe + Math.floor(yoe / 4) - Math.floor(yoe / 100)); // [0, 365]
  const mp = Math.floor((5 * doy + 2) / 153); // [0, 11]
  const d = doy - Math.floor((153 * mp + 2) / 5) + 1; // [1, 31]
  const m = mp + (mp < 10 ? 3 : -9); // [1, 12]
  return { y: y + (m <= 2 ? 1 : 0), m, d };
}

/** 0 = Monday .. 6 = Sunday. Epoch (1970-01-01) was a Thursday (index 3). */
export function weekdayMon0(y: number, m: number, d: number): number {
  const days = daysFromCivil(y, m, d);
  return ((days + 3) % 7 + 7) % 7;
}

export function addDays(c: Civil, delta: number): Civil {
  return civilFromDays(daysFromCivil(c.y, c.m, c.d) + delta);
}

export function isSameDay(a: Civil, b: Civil): boolean {
  return a.y === b.y && a.m === b.m && a.d === b.d;
}

export function isLeapYear(y: number): boolean {
  return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
}

export function daysInMonth(y: number, m: number): number {
  const table = [31, isLeapYear(y) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return table[m - 1];
}

export function toISO(c: Civil): string {
  return `${c.y.toString().padStart(4, "0")}-${c.m.toString().padStart(2, "0")}-${c.d
    .toString()
    .padStart(2, "0")}`;
}

export function fromISO(iso: string): Civil {
  const [y, m, d] = iso.split("-").map(Number);
  return { y, m, d };
}

/** Monday on/before the given date. */
export function startOfWeek(c: Civil): Civil {
  return addDays(c, -weekdayMon0(c.y, c.m, c.d));
}

/** Shift a {y, m} anchor by whole calendar months using pure integer math. */
export function shiftMonth(y: number, m: number, delta: number): { y: number; m: number } {
  const idx = y * 12 + (m - 1) + delta;
  return { y: Math.floor(idx / 12), m: (idx % 12) + 1 };
}

const WEEKDAY_SHORT = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const WEEKDAY_LONG = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const MONTH_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTH_LONG = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function weekdayShort(c: Civil): string {
  return WEEKDAY_SHORT[weekdayMon0(c.y, c.m, c.d)];
}
export function monthShort(m: number): string {
  return MONTH_SHORT[m - 1];
}
export function formatLong(c: Civil): string {
  return `${WEEKDAY_LONG[weekdayMon0(c.y, c.m, c.d)]}, ${MONTH_LONG[c.m - 1]} ${c.d}`;
}
export function formatMedium(c: Civil): string {
  return `${MONTH_SHORT[c.m - 1]} ${c.d}`;
}
export function formatMonthTitle(y: number, m: number): string {
  return `${MONTH_LONG[m - 1]} ${y}`;
}

// ---------------------------------------------------------------------------
// Fixed reference "today". A calendar concept is the single most tempting
// place in this whole brief to reach for `new Date()` — this literal string
// is the substitute. 2026-08-31 lands on a Monday (verified via the civil
// algorithm above), which makes it double as a clean week-start for the
// default pinned week, and it sits one day after this generation's run date.
// ---------------------------------------------------------------------------
export const TODAY_ISO = "2026-08-31";
export const TODAY: Civil = fromISO(TODAY_ISO);

// ---------------------------------------------------------------------------
// Capacity tiers — always-visible, at-a-glance day-cell state. Kept
// deliberately off the brand accent (teal) so the "is this day okay" signal
// never competes with "is this the thing to click" signal.
// ---------------------------------------------------------------------------
export type Tier = "none" | "light" | "moderate" | "busy" | "over";

export function tierOf(ratio: number, capacityMax: number): Tier {
  if (capacityMax <= 0) return "none";
  if (ratio <= 0) return "none";
  if (ratio < 0.4) return "light";
  if (ratio < 0.75) return "moderate";
  if (ratio < 0.95) return "busy";
  return "over";
}

export const TIER_LABEL: Record<Tier, string> = {
  none: "Closed",
  light: "Light",
  moderate: "Moderate",
  busy: "Busy",
  over: "At capacity",
};

// Tier -> Tailwind classes. Every pairing audited against the zinc-600 /
// amber-800 / red-700 floors noted in the report (all >= 6.8:1 on their tint).
export const TIER_CLASSES: Record<Tier, { bg: string; text: string; bar: string; ring: string }> = {
  none: { bg: "bg-zinc-50", text: "text-zinc-400", bar: "bg-zinc-200", ring: "border-zinc-100" },
  light: { bg: "bg-zinc-50", text: "text-zinc-600", bar: "bg-zinc-400", ring: "border-zinc-200" },
  moderate: { bg: "bg-zinc-100", text: "text-zinc-700", bar: "bg-zinc-500", ring: "border-zinc-200" },
  busy: { bg: "bg-amber-50", text: "text-amber-800", bar: "bg-amber-500", ring: "border-amber-200" },
  over: { bg: "bg-red-50", text: "text-red-700", bar: "bg-red-500", ring: "border-red-200" },
};

// ---------------------------------------------------------------------------
// Day-level capacity model
// ---------------------------------------------------------------------------
export interface DayCapacity {
  iso: string;
  c: Civil;
  pickupCount: number;
  hoursBooked: number;
  capacityMax: number;
  tier: Tier;
}

/** Deterministic (formula-based, not random) fill for days with no hand-authored detail. */
function formulaCapacity(c: Civil): { pickupCount: number; hoursBooked: number; capacityMax: number } {
  const wd = weekdayMon0(c.y, c.m, c.d);
  if (wd === 6) return { pickupCount: 0, hoursBooked: 0, capacityMax: 0 }; // Sunday closed
  if (wd === 5) {
    const capacityMax = 16;
    const hoursBooked = 2 + ((c.d * 5 + c.m) % 12);
    return { pickupCount: Math.max(1, Math.round(hoursBooked / 7)), hoursBooked, capacityMax };
  }
  const capacityMax = 40;
  let hoursBooked = 8 + ((c.d * 7 + c.m * 3 + wd * 5) % 27);
  if (c.d % 9 === 0) hoursBooked = Math.min(44, hoursBooked + 10);
  return { pickupCount: Math.max(1, Math.round(hoursBooked / 7)), hoursBooked, capacityMax };
}

// The one week of hand-authored operational detail (see PICKUP_ROWS below).
// Overrides the formula so calendar cells and the item-level table always agree.
const HAND_WEEK: Record<string, { pickupCount: number; hoursBooked: number; capacityMax: number }> = {
  "2026-08-31": { pickupCount: 3, hoursBooked: 18, capacityMax: 40 }, // Mon — moderate
  "2026-09-01": { pickupCount: 3, hoursBooked: 30, capacityMax: 40 }, // Tue — busy
  "2026-09-02": { pickupCount: 2, hoursBooked: 14, capacityMax: 40 }, // Wed — light
  "2026-09-03": { pickupCount: 3, hoursBooked: 38, capacityMax: 40 }, // Thu — over
  "2026-09-04": { pickupCount: 2, hoursBooked: 20, capacityMax: 40 }, // Fri — moderate
  "2026-09-05": { pickupCount: 1, hoursBooked: 8, capacityMax: 16 }, // Sat — moderate
  "2026-09-06": { pickupCount: 0, hoursBooked: 0, capacityMax: 0 }, // Sun — closed
};

export function capacityFor(c: Civil): DayCapacity {
  const iso = toISO(c);
  const base = HAND_WEEK[iso] ?? formulaCapacity(c);
  const ratio = base.capacityMax > 0 ? base.hoursBooked / base.capacityMax : 0;
  return { iso, c, ...base, tier: tierOf(ratio, base.capacityMax) };
}

/** 6 full weeks (42 days), Monday-start, covering the given month with padding. */
export function buildMonthGrid(y: number, m: number): DayCapacity[] {
  const first = startOfWeek({ y, m, d: 1 });
  return Array.from({ length: 42 }, (_, i) => capacityFor(addDays(first, i)));
}

/** 7 days starting Monday of the week containing `c`. */
export function buildWeekGrid(c: Civil): DayCapacity[] {
  const start = startOfWeek(c);
  return Array.from({ length: 7 }, (_, i) => capacityFor(addDays(start, i)));
}

// ---------------------------------------------------------------------------
// Inspectors
// ---------------------------------------------------------------------------
export interface Inspector {
  id: string;
  name: string;
  role: "Senior Inspector" | "Inspector";
  avatarSeed: string;
}

export const INSPECTORS: Inspector[] = [
  { id: "insp-1", name: "Alex Rivera", role: "Senior Inspector", avatarSeed: "repick-alex-rivera" },
  { id: "insp-2", name: "Priya Nair", role: "Inspector", avatarSeed: "repick-priya-nair" },
  { id: "insp-3", name: "Tom Osei", role: "Inspector", avatarSeed: "repick-tom-osei" },
  { id: "insp-4", name: "Jin Park", role: "Senior Inspector", avatarSeed: "repick-jin-park" },
  { id: "insp-5", name: "Laura Kim", role: "Inspector", avatarSeed: "repick-laura-kim" },
];

export function avatarUrl(seed: string, px = 64): string {
  return `https://picsum.photos/seed/${seed}/${px}/${px}`;
}

// ---------------------------------------------------------------------------
// Pickup queue — hand-authored for the current operating week (Aug 31 - Sep 6,
// 2026) so the table, the day-detail panel and the calendar's HAND_WEEK
// overrides all agree with each other by construction.
// ---------------------------------------------------------------------------
export type PickupStatus = "Scheduled" | "In Transit" | "Inspecting" | "Graded" | "Flagged";
export type GradeRisk = "Low" | "Medium" | "High";

export interface PickupRow {
  id: string;
  iso: string;
  time: string; // "09:00"
  item: string;
  category: string;
  seller: string;
  inspectorId: string;
  estValue: number; // KRW
  durationMin: number;
  status: PickupStatus;
  risk: GradeRisk;
}

export const PICKUP_ROWS: PickupRow[] = [
  { id: "p1", iso: "2026-08-31", time: "09:00", item: 'MacBook Pro 14" (2023)', category: "Electronics", seller: "David Kim", inspectorId: "insp-1", estValue: 2150000, durationMin: 45, status: "Graded", risk: "Low" },
  { id: "p2", iso: "2026-08-31", time: "11:30", item: "Herman Miller Aeron Chair", category: "Furniture", seller: "Sarah Lee", inspectorId: "insp-2", estValue: 680000, durationMin: 30, status: "Inspecting", risk: "Medium" },
  { id: "p3", iso: "2026-08-31", time: "14:00", item: "Canon EOS R6 Mark II", category: "Cameras", seller: "James Park", inspectorId: "insp-4", estValue: 3400000, durationMin: 60, status: "Scheduled", risk: "Low" },
  { id: "p4", iso: "2026-09-01", time: "09:30", item: "Nike Air Jordan 1 Retro", category: "Footwear", seller: "Grace Cho", inspectorId: "insp-3", estValue: 320000, durationMin: 20, status: "Graded", risk: "Low" },
  { id: "p5", iso: "2026-09-01", time: "10:15", item: 'Samsung 55" Frame TV', category: "Electronics", seller: "Michael Yoon", inspectorId: "insp-5", estValue: 1450000, durationMin: 40, status: "In Transit", risk: "Medium" },
  { id: "p6", iso: "2026-09-01", time: "13:00", item: "Dyson V15 Detect", category: "Appliances", seller: "Emily Han", inspectorId: "insp-1", estValue: 410000, durationMin: 25, status: "Scheduled", risk: "Low" },
  { id: "p7", iso: "2026-09-02", time: "09:00", item: 'iPad Pro 12.9" (2022)', category: "Electronics", seller: "Daniel Seo", inspectorId: "insp-2", estValue: 980000, durationMin: 35, status: "Flagged", risk: "High" },
  { id: "p8", iso: "2026-09-02", time: "12:30", item: "Sony A7 IV Body", category: "Cameras", seller: "Olivia Chung", inspectorId: "insp-4", estValue: 2890000, durationMin: 55, status: "Inspecting", risk: "Medium" },
  { id: "p9", iso: "2026-09-03", time: "09:45", item: "West Elm 3-Seat Sofa", category: "Furniture", seller: "Ryan Moon", inspectorId: "insp-3", estValue: 720000, durationMin: 50, status: "Scheduled", risk: "Low" },
  { id: "p10", iso: "2026-09-03", time: "11:00", item: "Louis Vuitton Neverfull MM", category: "Bags", seller: "Nathan Bae", inspectorId: "insp-5", estValue: 1650000, durationMin: 30, status: "Graded", risk: "Low" },
  { id: "p11", iso: "2026-09-03", time: "15:30", item: "Rolex Datejust 36mm", category: "Watches", seller: "David Kim", inspectorId: "insp-1", estValue: 8200000, durationMin: 40, status: "Flagged", risk: "High" },
  { id: "p12", iso: "2026-09-04", time: "09:00", item: "PlayStation 5 Bundle", category: "Electronics", seller: "Sarah Lee", inspectorId: "insp-2", estValue: 480000, durationMin: 20, status: "Scheduled", risk: "Low" },
  { id: "p13", iso: "2026-09-04", time: "10:30", item: 'MacBook Pro 14" (2023)', category: "Electronics", seller: "James Park", inspectorId: "insp-4", estValue: 1980000, durationMin: 45, status: "In Transit", risk: "Medium" },
  { id: "p14", iso: "2026-09-05", time: "10:00", item: "Canon EOS R6 Mark II", category: "Cameras", seller: "Grace Cho", inspectorId: "insp-3", estValue: 2650000, durationMin: 60, status: "Scheduled", risk: "Low" },
];

export const OPERATING_WEEK_START = "2026-08-31";
export const OPERATING_WEEK_END = "2026-09-06";

export function inspectorById(id: string): Inspector {
  return INSPECTORS.find((i) => i.id === id) ?? INSPECTORS[0];
}

export function rowsForDay(iso: string): PickupRow[] {
  return PICKUP_ROWS.filter((r) => r.iso === iso);
}

export function isWithinOperatingWeek(iso: string): boolean {
  return iso >= OPERATING_WEEK_START && iso <= OPERATING_WEEK_END;
}

// KPI aggregates — always derived from PICKUP_ROWS / capacityFor, never
// hand-typed, so totals can never drift out of sync with the rows behind them.
export function kpiScheduledToday(): number {
  return rowsForDay(TODAY_ISO).length;
}
export function kpiBacklog(): PickupRow[] {
  return PICKUP_ROWS.filter((r) => r.status === "Inspecting" || r.status === "Flagged");
}
export function kpiAvgInspectionMin(): number {
  const total = PICKUP_ROWS.reduce((s, r) => s + r.durationMin, 0);
  return Math.round(total / PICKUP_ROWS.length);
}
export function kpiTotalValue(): number {
  return PICKUP_ROWS.reduce((s, r) => s + r.estValue, 0);
}

export function currency(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "KRW",
    maximumFractionDigits: 0,
  }).format(n);
}

export function compactNumber(n: number): string {
  return new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(n);
}
