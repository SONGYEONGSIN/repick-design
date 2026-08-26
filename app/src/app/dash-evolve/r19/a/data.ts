import type { LucideIcon } from "lucide-react";
import { BarChart3, Building2, CalendarClock, Inbox, LayoutGrid, Settings, Users } from "lucide-react";
import type { BookingStatus } from "./tokens";

/* --------------------------------------------------------------------- Brand / chrome */

export const BRAND = { name: "Corridor", tagline: "Workplace booking console", Icon: CalendarClock };

export const WORKSPACES = [
  { id: "solandra", name: "Solandra Group", plan: "Workplace · Enterprise" },
  { id: "vantage", name: "Vantage Labs", plan: "Workplace · Growth" },
] as const;

export const CURRENT_USER = {
  name: "Priya Sandoval",
  role: "Workplace Ops Lead",
  email: "priya.sandoval@corridorhq.io",
  avatarId: "1544005313-94ddf0286df2",
};

export const NOTIFICATIONS = [
  { id: "n1", text: "Harbor A has a double-booking on Tue between Design Crit and Budget Walkthrough.", time: "8 min ago" },
  { id: "n2", text: "Signal Room booking for Support Escalation Review is still pending approval.", time: "41 min ago" },
  { id: "n3", text: "Foundry Lab hit 7% weekly occupancy — the highest of any resource this week.", time: "2 hr ago" },
];

export type NavItem = { id: string; label: string; Icon: LucideIcon; active?: boolean; disabled?: boolean };
export const NAV_SECTIONS: { id: string; title: string; items: NavItem[] }[] = [
  {
    id: "schedule",
    title: "Schedule",
    items: [
      { id: "overview", label: "Overview", Icon: LayoutGrid, active: true },
      { id: "resources", label: "Resources", Icon: Building2 },
      { id: "requests", label: "Requests", Icon: Inbox },
    ],
  },
  {
    id: "admin",
    title: "Admin",
    items: [
      { id: "reports", label: "Reports", Icon: BarChart3 },
      { id: "team", label: "Team", Icon: Users },
      { id: "settings", label: "Settings", Icon: Settings, disabled: true },
    ],
  },
];

/* --------------------------------------------------------------------------- Resources */

export type ResourceKind = "Room" | "Studio";
export type ResourceId = "harbor-a" | "harbor-b" | "meridian" | "signal" | "ember" | "foundry" | "anchor" | "beacon";

export type Resource = {
  id: ResourceId;
  name: string;
  kind: ResourceKind;
  floor: number;
  capacity: number;
};

export const RESOURCES: Resource[] = [
  { id: "harbor-a", name: "Harbor A", kind: "Room", floor: 2, capacity: 12 },
  { id: "harbor-b", name: "Harbor B", kind: "Room", floor: 2, capacity: 8 },
  { id: "meridian", name: "Meridian Hall", kind: "Room", floor: 3, capacity: 20 },
  { id: "signal", name: "Signal Room", kind: "Room", floor: 3, capacity: 10 },
  { id: "ember", name: "Ember Studio", kind: "Studio", floor: 1, capacity: 6 },
  { id: "foundry", name: "Foundry Lab", kind: "Studio", floor: 1, capacity: 14 },
  { id: "anchor", name: "Anchor Room", kind: "Room", floor: 4, capacity: 4 },
  { id: "beacon", name: "Beacon Room", kind: "Room", floor: 4, capacity: 6 },
];

export function resourceOf(id: ResourceId): Resource {
  const r = RESOURCES.find((x) => x.id === id);
  if (!r) throw new Error(`Unknown resource ${id}`);
  return r;
}

/* -------------------------------------------------------------------------- Week board */

export type DayId = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

export const WEEK_DAYS: { id: DayId; label: string; dateLabel: string; dayNum: number; isToday: boolean }[] = [
  { id: "mon", label: "Mon", dateLabel: "Aug 24", dayNum: 24, isToday: false },
  { id: "tue", label: "Tue", dateLabel: "Aug 25", dayNum: 25, isToday: false },
  { id: "wed", label: "Wed", dateLabel: "Aug 26", dayNum: 26, isToday: true },
  { id: "thu", label: "Thu", dateLabel: "Aug 27", dayNum: 27, isToday: false },
  { id: "fri", label: "Fri", dateLabel: "Aug 28", dayNum: 28, isToday: false },
  { id: "sat", label: "Sat", dateLabel: "Aug 29", dayNum: 29, isToday: false },
  { id: "sun", label: "Sun", dateLabel: "Aug 30", dayNum: 30, isToday: false },
];

export const WEEK_LABEL = "Week of Aug 24–30, 2026";
export const WINDOW_START_HOUR = 8;
export const WINDOW_END_HOUR = 18;
export const WINDOW_HOURS = WINDOW_END_HOUR - WINDOW_START_HOUR;

export type Booking = {
  id: string;
  resourceId: ResourceId;
  day: DayId;
  startHour: number;
  durationHours: number;
  title: string;
  organizer: string;
  attendees: number;
  status: BookingStatus;
};

/**
 * One tracked week of individual bookings (Aug 24–30, 2026 — the week containing "today"). This is
 * the only span with per-booking fidelity; the rest of August is represented at day-total grain in
 * `MONTH_COUNTS` below. `conflict` status is a genuine detected overlap (Harbor A, Tue 11:00–12:30,
 * bookings b08/b09) rather than a fabricated label — see `deriveConflicts` at the bottom of the file.
 */
export const BOOKINGS_RAW: Omit<Booking, "status">[] = [
  { id: "b01", resourceId: "harbor-a", day: "mon", startHour: 9, durationHours: 1, title: "Product Sync", organizer: "Maya Chen", attendees: 8 },
  { id: "b02", resourceId: "meridian", day: "mon", startHour: 10.5, durationHours: 1.5, title: "All-Hands Rehearsal", organizer: "Deion Frost", attendees: 18 },
  { id: "b03", resourceId: "signal", day: "mon", startHour: 13, durationHours: 1, title: "Vendor Review", organizer: "Priya Nathan", attendees: 6 },
  { id: "b04", resourceId: "ember", day: "mon", startHour: 15, durationHours: 1, title: "Podcast Recording", organizer: "Wes Okafor", attendees: 3 },
  { id: "b05", resourceId: "harbor-b", day: "mon", startHour: 16, durationHours: 1, title: "1:1 Coaching", organizer: "Sana Iqbal", attendees: 2 },

  { id: "b06", resourceId: "foundry", day: "tue", startHour: 9, durationHours: 2, title: "Prototype Build", organizer: "Deion Frost", attendees: 10 },
  { id: "b07", resourceId: "anchor", day: "tue", startHour: 9.5, durationHours: 0.5, title: "Interview — Backend Eng", organizer: "Maya Chen", attendees: 2 },
  { id: "b08", resourceId: "harbor-a", day: "tue", startHour: 11, durationHours: 1, title: "Design Crit", organizer: "Priya Nathan", attendees: 7 },
  { id: "b09", resourceId: "harbor-a", day: "tue", startHour: 11.5, durationHours: 1, title: "Budget Walkthrough", organizer: "Wes Okafor", attendees: 5 },
  { id: "b10", resourceId: "beacon", day: "tue", startHour: 14, durationHours: 1, title: "Customer Call — Solandra", organizer: "Sana Iqbal", attendees: 4 },

  { id: "b11", resourceId: "meridian", day: "wed", startHour: 9, durationHours: 1.5, title: "Quarterly Planning", organizer: "Deion Frost", attendees: 20 },
  { id: "b12", resourceId: "signal", day: "wed", startHour: 10, durationHours: 1, title: "Support Escalation Review", organizer: "Priya Nathan", attendees: 5 },
  { id: "b13", resourceId: "harbor-b", day: "wed", startHour: 11, durationHours: 1, title: "Onboarding — New Hires", organizer: "Maya Chen", attendees: 6 },
  { id: "b14", resourceId: "ember", day: "wed", startHour: 13, durationHours: 1.5, title: "Brand Video Shoot", organizer: "Wes Okafor", attendees: 4 },
  { id: "b15", resourceId: "foundry", day: "wed", startHour: 15, durationHours: 1, title: "Hardware Bring-up", organizer: "Sana Iqbal", attendees: 8 },
  { id: "b16", resourceId: "anchor", day: "wed", startHour: 16, durationHours: 0.5, title: "Interview — PM", organizer: "Maya Chen", attendees: 2 },

  { id: "b17", resourceId: "harbor-a", day: "thu", startHour: 9, durationHours: 1, title: "Sprint Planning", organizer: "Deion Frost", attendees: 9 },
  { id: "b18", resourceId: "meridian", day: "thu", startHour: 13, durationHours: 2, title: "Investor Walkthrough", organizer: "Priya Nathan", attendees: 16 },
  { id: "b19", resourceId: "signal", day: "thu", startHour: 15.5, durationHours: 0.5, title: "Legal Review", organizer: "Wes Okafor", attendees: 3 },

  { id: "b20", resourceId: "beacon", day: "fri", startHour: 9, durationHours: 0.5, title: "Standup — Platform", organizer: "Sana Iqbal", attendees: 6 },
  { id: "b21", resourceId: "harbor-b", day: "fri", startHour: 10, durationHours: 1, title: "Retro", organizer: "Maya Chen", attendees: 7 },
  { id: "b22", resourceId: "foundry", day: "fri", startHour: 11, durationHours: 2, title: "Photo Shoot — Catalog", organizer: "Deion Frost", attendees: 5 },

  { id: "b23", resourceId: "ember", day: "sun", startHour: 10, durationHours: 2, title: "Weekend Editing Session", organizer: "Wes Okafor", attendees: 2 },
];

/** Two bookings on the same resource conflict when their [start, start+duration) ranges overlap. */
function deriveConflicts(raw: Omit<Booking, "status">[]): Booking[] {
  return raw.map((b) => {
    const overlaps = raw.some(
      (o) => o.id !== b.id && o.resourceId === b.resourceId && o.day === b.day && o.startHour < b.startHour + b.durationHours && b.startHour < o.startHour + o.durationHours,
    );
    if (overlaps) return { ...b, status: "conflict" };
    // Deterministic review flag: the four historically slower-to-confirm slots stay pending.
    const pendingIds = new Set(["b04", "b12", "b16", "b19"]);
    return { ...b, status: pendingIds.has(b.id) ? "pending" : "confirmed" };
  });
}

export const BOOKINGS: Booking[] = deriveConflicts(BOOKINGS_RAW);

export function bookingsFor(day: DayId, resourceId: ResourceId | null): Booking[] {
  return BOOKINGS.filter((b) => b.day === day && (resourceId === null || b.resourceId === resourceId));
}

export function weekBookings(resourceId: ResourceId | null): Booking[] {
  return BOOKINGS.filter((b) => resourceId === null || b.resourceId === resourceId);
}

/** Hours booked for one resource on one day — feeds the resource rail's sparkline and the week
 *  board's per-day occupancy readout, both derived from the same source instead of hand-authored
 *  twice. */
export function hoursBooked(day: DayId, resourceId: ResourceId | null): number {
  return bookingsFor(day, resourceId).reduce((sum, b) => sum + b.durationHours, 0);
}

/** Highest single-resource single-day occupancy figure across the tracked week (as a %, 20 = 2h of
 *  a 10h window) — the reference used to normalize sparkline bar heights so a modest 10–20%
 *  occupancy is still visible on screen, while the exact percentage stays in the text label. */
export const PEAK_DAILY_PCT = Math.round((Math.max(...WEEK_DAYS.map((d) => Math.max(...RESOURCES.map((r) => hoursBooked(d.id, r.id))))) / WINDOW_HOURS) * 100);

export type ResourceStat = {
  resource: Resource;
  weekHours: number;
  avgOccupancyPct: number;
  dailyPct: number[];
};

export const RESOURCE_STATS: ResourceStat[] = RESOURCES.map((resource) => {
  const dailyHours = WEEK_DAYS.map((d) => hoursBooked(d.id, resource.id));
  const dailyPct = dailyHours.map((h) => Math.round((h / WINDOW_HOURS) * 100));
  const weekHours = dailyHours.reduce((a, b) => a + b, 0);
  const avgOccupancyPct = Math.round(dailyPct.reduce((a, b) => a + b, 0) / dailyPct.length);
  return { resource, weekHours, avgOccupancyPct, dailyPct };
});

/* ---------------------------------------------------------------------------- Month grid */

/**
 * August 2026 starts on a Saturday (Aug 1 falls 212 days after a Thursday Jan 1 — 212 mod 7 = 2
 * days past Thursday = Saturday). With a Monday-first grid that puts 5 blank leading cells before
 * Aug 1, matching `WEEK_DAYS` above starting the tracked week on a Monday (Aug 24).
 */
export const MONTH_LEADING_BLANKS = 5;
export const MONTH_LABEL = "August 2026";

/** Day totals outside the tracked week (hand-set, no per-booking record exists for them). Days
 *  24–30 are overwritten below with counts derived from `BOOKINGS`, so the two data sources can
 *  never disagree about the tracked week. */
const MONTH_COUNTS_BASE: number[] = [
  0, 0, 3, 4, 4, 3, 2, 1, 0, 3, 5, 4, 3, 2, 0, 0, 4, 4, 5, 3, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 4,
];

export type MonthDay = { day: number; count: number; utilizationPct: number; hasConflict: boolean; isToday: boolean };

export const MONTH_DAYS: MonthDay[] = MONTH_COUNTS_BASE.map((baseCount, i) => {
  const dayNum = i + 1;
  const trackedIndex = WEEK_DAYS.findIndex((d) => d.dayNum === dayNum);
  const count = trackedIndex >= 0 ? bookingsFor(WEEK_DAYS[trackedIndex].id, null).length : baseCount;
  const hasConflict = trackedIndex >= 0 && bookingsFor(WEEK_DAYS[trackedIndex].id, null).some((b) => b.status === "conflict");
  return {
    day: dayNum,
    count,
    utilizationPct: Math.min(100, Math.round((count / 6) * 100)),
    hasConflict,
    isToday: trackedIndex >= 0 && WEEK_DAYS[trackedIndex].isToday,
  };
});

export const MONTH_TOTAL_BOOKINGS = MONTH_DAYS.reduce((sum, d) => sum + d.count, 0);

/* ------------------------------------------------------------------------- Command palette */

export type PaletteCommand = { id: string; label: string; hint: string; kind: "view" | "resource" | "filter" | "jump" };

export const PALETTE_COMMANDS: PaletteCommand[] = [
  { id: "view-week", label: "Switch to Week view", hint: "Time-grid, Aug 24–30", kind: "view" },
  { id: "view-month", label: "Switch to Month view", hint: "Full-month overview", kind: "view" },
  { id: "clear-resource", label: "Show all resources", hint: "Clear resource filter", kind: "resource" },
  ...RESOURCES.map((r) => ({ id: `resource-${r.id}`, label: `Filter to ${r.name}`, hint: `${r.kind} · Floor ${r.floor}`, kind: "resource" as const })),
  { id: "filter-all", label: "Show all statuses", hint: "Clear status filter", kind: "filter" },
  { id: "filter-confirmed", label: "Filter to confirmed bookings", hint: "Status filter", kind: "filter" },
  { id: "filter-pending", label: "Filter to pending bookings", hint: "Status filter", kind: "filter" },
  { id: "filter-conflict", label: "Filter to conflicts", hint: "Status filter", kind: "filter" },
  { id: "jump-today", label: "Jump to today — Wed, Aug 26", hint: "Scroll the week board into view", kind: "jump" },
];
