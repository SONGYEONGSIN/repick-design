/**
 * Stagebook — deterministic domain data for the booking-calendar console (auto-dash-r62 / candidate a).
 *
 * Everything below is hand-authored and fixed: no `Math.random()`, no `Date.now()`, no `new Date()`
 * anywhere. The calendar grid is for November 2026, hand-laid-out as a plain array of cells (day
 * numbers + weekday position), never built from a `Date` object — November 1, 2026 falls on a
 * Sunday (verified by hand: Jan 1 2026 is a Thursday, carried forward 304 days to Nov 1 = Sunday,
 * cross-checked against Thanksgiving 2026 landing on Nov 26, the 4th Thursday), so the 30 days of
 * November plus 5 trailing padding days from December fill exactly 5 full weeks with no leading
 * padding needed. "Today" is a fixed demo anchor, November 15, 2026 — not a live clock.
 *
 * Every total shown on screen (day revenue, month revenue, room utilization, status counts) is
 * computed from the `BOOKINGS` array below by the functions at the bottom of this file, never
 * hand-typed separately, so a displayed subtotal can never drift out of sync with the bookings it
 * rolls up from.
 */

export type RoomId = "main-hall" | "garden-room" | "rooftop-deck" | "studio-b";
export type BookingStatus = "confirmed" | "pending" | "cancelled";
export type ViewMode = "month" | "week" | "agenda";

export interface Room {
  id: RoomId;
  name: string;
  code: string;
  capacity: number;
}

export interface Booking {
  id: string;
  /** Day-of-month in November 2026, 1–30. */
  day: number;
  /** Minutes since midnight, [0, 1440). */
  start: number;
  end: number;
  eventName: string;
  clientName: string;
  room: RoomId;
  guests: number;
  status: BookingStatus;
  /** Contracted revenue in whole dollars. */
  revenue: number;
}

export const ROOMS: Room[] = [
  { id: "main-hall", name: "Main Hall", code: "MH", capacity: 220 },
  { id: "garden-room", name: "Garden Room", code: "GR", capacity: 90 },
  { id: "rooftop-deck", name: "Rooftop Deck", code: "RD", capacity: 70 },
  { id: "studio-b", name: "Studio B", code: "SB", capacity: 40 },
];

export const STATUS_LABEL: Record<BookingStatus, string> = {
  confirmed: "Confirmed",
  pending: "Deposit pending",
  cancelled: "Cancelled",
};

export const VIEW_LABEL: Record<ViewMode, string> = {
  month: "Month",
  week: "Week",
  agenda: "Agenda",
};

/** Fixed demo "today" — November 15, 2026. Never derived from a `Date` object. */
export const TODAY_DAY = 15;
export const DAYS_IN_MONTH = 30;
export const MONTH_LABEL = "November 2026";
export const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export interface CalendarCellDef {
  /** 0-based index into the 5x7 grid. */
  index: number;
  /** Day-of-month, always 1–35-range value for display; `inMonth` says which month it belongs to. */
  day: number;
  inMonth: boolean;
  weekday: number;
}

/** November 1, 2026 lands on grid index 0 (Sunday), so the 35-cell grid is exactly 30 November days
 *  followed by 5 padding days borrowed from December — no leading padding, nothing from October. */
export function buildMonthGrid(): CalendarCellDef[] {
  const cells: CalendarCellDef[] = [];
  for (let i = 0; i < 35; i++) {
    const inMonth = i < DAYS_IN_MONTH;
    const day = inMonth ? i + 1 : i - DAYS_IN_MONTH + 1;
    cells.push({ index: i, day, inMonth, weekday: i % 7 });
  }
  return cells;
}

function b(
  id: string,
  day: number,
  start: number,
  end: number,
  eventName: string,
  clientName: string,
  room: RoomId,
  guests: number,
  status: BookingStatus,
  revenue: number,
): Booking {
  return { id, day, start, end, eventName, clientName, room, guests, status, revenue };
}

export const BOOKINGS: Booking[] = [
  // Sun 1
  b("b1", 1, 1020, 1380, "Alvarez–Chen Wedding Reception", "Maria Alvarez", "main-hall", 180, "confirmed", 8400),
  b("b2", 1, 780, 960, "Whitfield Baby Shower", "Dana Whitfield", "garden-room", 42, "confirmed", 1650),
  // Tue 3
  b("b3", 3, 600, 780, "Portrait Session — Marlowe Studio", "Elise Marlowe", "studio-b", 6, "confirmed", 480),
  // Thu 5
  b("b4", 5, 540, 1020, "Quarterly All-Hands — Vantage Analytics", "Neil Osei", "garden-room", 65, "confirmed", 2100),
  // Fri 6
  b("b5", 6, 1110, 1290, "Kapoor–Reyes Rehearsal Dinner", "Anika Kapoor", "garden-room", 28, "confirmed", 1800),
  b("b6", 6, 660, 840, "Product Launch — Solace Audio", "Jon Pruitt", "main-hall", 140, "confirmed", 5200),
  // Sat 7
  b("b7", 7, 1020, 1380, "Castellano Wedding Reception", "Teresa Castellano", "main-hall", 200, "confirmed", 9100),
  b("b8", 7, 840, 1080, "Birthday Celebration — Priya K.", "Priya Kapoor", "rooftop-deck", 36, "confirmed", 2200),
  b("b9", 7, 600, 720, "Styled Shoot — Modern Bride Mag", "Rosa Lindgren", "studio-b", 8, "pending", 650),
  // Sun 8
  b("b10", 8, 1140, 1320, "Castellano Anniversary Dinner", "The Castellanos", "rooftop-deck", 22, "confirmed", 1900),
  b("b11", 8, 900, 1140, "Ortiz & Lee Engagement Party", "Marco Ortiz", "garden-room", 54, "confirmed", 2700),
  // Tue 10
  b("b12", 10, 660, 780, "Press Preview — Aurelia Skincare", "Grace Tran", "studio-b", 10, "confirmed", 590),
  // Wed 11
  b("b13", 11, 540, 960, "Team Offsite — Founders Collective", "Iris Mbeki", "garden-room", 48, "confirmed", 1950),
  // Fri 13
  b("b14", 13, 1080, 1230, "Networking Mixer — Harlow & Ames", "Simone Harlow", "main-hall", 110, "confirmed", 3800),
  b("b15", 13, 540, 780, "Styled Shoot — North Loom Textiles", "Dev Patel", "studio-b", 9, "confirmed", 720),
  // Sat 14
  b("b16", 14, 1020, 1380, "Nakamura Wedding Reception", "Kenji Nakamura", "main-hall", 165, "confirmed", 7600),
  b("b17", 14, 600, 780, "Fundraiser Brunch — Bright Path Literacy", "Oli Fenwick", "garden-room", 70, "pending", 2850),
  b("b18", 14, 1080, 1320, "Milestone Birthday — Dana O.", "Dana Okafor", "rooftop-deck", 44, "confirmed", 2600),
  // Sun 15 — today
  b("b19", 15, 1080, 1350, "Nonprofit Gala — Riverstone Foundation", "Lena Riverstone", "main-hall", 190, "confirmed", 8900),
  b("b20", 15, 780, 960, "Whitcombe Baby Shower", "Nora Whitcombe", "garden-room", 38, "pending", 1480),
  b("b21", 15, 600, 720, "Portrait Session — Marlowe Studio", "Elise Marlowe", "studio-b", 5, "cancelled", 420),
  // Tue 17
  b("b22", 17, 600, 720, "Client Walkthrough — Juniper & Co.", "Tess Juniper", "studio-b", 4, "confirmed", 380),
  // Thu 19
  b("b23", 19, 540, 720, "Holiday Pop-up Setup — Juniper & Co.", "Tess Juniper", "garden-room", 20, "confirmed", 950),
  // Fri 20
  b("b24", 20, 1110, 1290, "Osei–Grant Rehearsal Dinner", "Femi Osei", "main-hall", 95, "confirmed", 4100),
  b("b25", 20, 1020, 1200, "Winter Showcase — North Loom Textiles", "Dev Patel", "rooftop-deck", 50, "confirmed", 2750),
  // Sat 21
  b("b26", 21, 1020, 1380, "Delgado Wedding Reception", "Ana Delgado", "main-hall", 175, "confirmed", 8200),
  b("b27", 21, 900, 1140, "Engagement Party — Yusuf & Mina", "Yusuf Rahman", "garden-room", 58, "confirmed", 2900),
  b("b28", 21, 840, 1080, "Birthday Celebration — Theo R.", "Theo Reyes", "studio-b", 14, "pending", 640),
  // Sun 22
  b("b29", 22, 660, 780, "Memorial Gathering — Whitcombe Family", "Nora Whitcombe", "garden-room", 60, "confirmed", 1750),
  b("b30", 22, 1140, 1320, "Anniversary Dinner — The Brandts", "Lior Brandt", "rooftop-deck", 26, "confirmed", 2050),
  // Tue 24
  b("b31", 24, 540, 780, "Styled Shoot — Modern Bride Mag", "Rosa Lindgren", "studio-b", 7, "confirmed", 560),
  // Wed 25
  b("b32", 25, 1020, 1200, "Pre-Holiday Office Party — Vantage Analytics", "Neil Osei", "garden-room", 55, "confirmed", 2300),
  // Fri 27
  b("b33", 27, 720, 840, "Small Gathering — The Castellanos", "Teresa Castellano", "studio-b", 12, "confirmed", 510),
  // Sat 28
  b("b34", 28, 1020, 1380, "Hassan Wedding Reception", "Amal Hassan", "main-hall", 150, "confirmed", 7100),
  b("b35", 28, 1080, 1320, "Holiday Party — Harlow & Ames", "Simone Harlow", "garden-room", 72, "confirmed", 3100),
  b("b36", 28, 840, 1080, "Birthday Celebration — Maya F.", "Maya Flores", "rooftop-deck", 40, "pending", 2150),
  // Sun 29
  b("b37", 29, 900, 1140, "Engagement Party — Sato & Lindqvist", "Haruto Sato", "main-hall", 120, "confirmed", 4600),
  b("b38", 29, 780, 960, "Fenwick Baby Shower", "Oli Fenwick", "garden-room", 34, "confirmed", 1400),
];

// ---------------------------------------------------------------------------
// Formatting — hand-rolled against minute-of-day integers, never `Date`.
// ---------------------------------------------------------------------------

export function formatClock(totalMinutes: number): string {
  const m = ((totalMinutes % 1440) + 1440) % 1440;
  const hour24 = Math.floor(m / 60);
  const minute = m % 60;
  const period = hour24 >= 12 ? "PM" : "AM";
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return `${hour12}:${minute.toString().padStart(2, "0")} ${period}`;
}

export function formatRange(start: number, end: number): string {
  return `${formatClock(start)}–${formatClock(end)}`;
}

export const usdFmt = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
export const usdCompactFmt = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", notation: "compact", maximumFractionDigits: 1 });
export const countFmt = new Intl.NumberFormat("en-US");
export const pctFmt = new Intl.NumberFormat("en-US", { style: "percent", maximumFractionDigits: 0 });

// ---------------------------------------------------------------------------
// Derived aggregates — every number on screen traces back to one of these.
// ---------------------------------------------------------------------------

export function getBookingsForDay(day: number): Booking[] {
  return BOOKINGS.filter((bk) => bk.day === day).sort((a, c) => a.start - c.start);
}

export interface DayStats {
  day: number;
  bookingCount: number;
  activeCount: number;
  revenue: number;
  hasPending: boolean;
}

export function getDayStats(day: number): DayStats {
  const bookings = getBookingsForDay(day).filter((bk) => bk.status !== "cancelled");
  const revenue = bookings.reduce((sum, bk) => sum + bk.revenue, 0);
  return {
    day,
    bookingCount: getBookingsForDay(day).length,
    activeCount: bookings.length,
    revenue,
    hasPending: bookings.some((bk) => bk.status === "pending"),
  };
}

export function getRoomById(id: RoomId): Room {
  return ROOMS.find((r) => r.id === id) ?? ROOMS[0];
}

export interface MonthStats {
  bookingCount: number;
  activeCount: number;
  revenue: number;
  pendingCount: number;
  cancelledCount: number;
  avgPartySize: number;
}

export function getMonthStats(): MonthStats {
  const active = BOOKINGS.filter((bk) => bk.status !== "cancelled");
  const revenue = active.reduce((sum, bk) => sum + bk.revenue, 0);
  const guestTotal = active.reduce((sum, bk) => sum + bk.guests, 0);
  return {
    bookingCount: BOOKINGS.length,
    activeCount: active.length,
    revenue,
    pendingCount: BOOKINGS.filter((bk) => bk.status === "pending").length,
    cancelledCount: BOOKINGS.filter((bk) => bk.status === "cancelled").length,
    avgPartySize: Math.round(guestTotal / active.length),
  };
}

export interface RoomUtilization {
  room: Room;
  bookedDays: number;
  utilization: number;
}

/** Days booked per room, out of the 30 days in November — a straightforward occupancy measure,
 *  counted fresh from `BOOKINGS` so it can never drift from the underlying schedule. */
export function getRoomUtilization(): RoomUtilization[] {
  return ROOMS.map((room) => {
    const days = new Set(
      BOOKINGS.filter((bk) => bk.room === room.id && bk.status !== "cancelled").map((bk) => bk.day),
    );
    return { room, bookedDays: days.size, utilization: days.size / DAYS_IN_MONTH };
  });
}

/** Fixed 8-week revenue trend ending with the current week (Nov 9–15). Independent demo content,
 *  not derived from `BOOKINGS` or from any `Date` — a hand-authored trendline, same as the rest of
 *  this file. */
export interface WeekRevenue {
  label: string;
  revenue: number;
}

export const WEEK_REVENUE: WeekRevenue[] = [
  { label: "Sep 21–27", revenue: 18200 },
  { label: "Sep 28–Oct 4", revenue: 19500 },
  { label: "Oct 5–11", revenue: 17800 },
  { label: "Oct 12–18", revenue: 21000 },
  { label: "Oct 19–25", revenue: 22400 },
  { label: "Oct 26–Nov 1", revenue: 20600 },
  { label: "Nov 2–8", revenue: 24100 },
  { label: "Nov 9–15", revenue: 23650 },
];
