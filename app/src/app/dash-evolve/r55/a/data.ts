/**
 * Portlane — route-scoped domain data for the dock-scheduling console (auto-dash-r55 / candidate a).
 *
 * Everything below is hand-authored and deterministic: no `Math.random()`, no `Date.now()`, no
 * `new Date()` anywhere, including for "now". Clock values are plain minutes-since-midnight
 * (0–1439) formatted by hand in `formatClock`/`formatClockShort` — a Date object is never
 * constructed, so there is nothing for a render-time clock to disagree with. `CURRENT_MINUTE` is a
 * fixed demo anchor (11:30 AM), not a live clock.
 *
 * Every derived stat (utilization, conflict count, average dwell) is computed from the booking
 * arrays below by the functions at the bottom of this file — never hand-typed separately — so a
 * displayed subtotal can never drift out of sync with the totals it rolls up from.
 */

export type Zone = "inbound" | "outbound";
export type Period = "today" | "tomorrow";
export type LoadType = "FTL" | "LTL";
export type BookingStatus = "scheduled" | "loading" | "completed";

export interface DockDoor {
  id: string;
  code: string;
  zone: Zone;
}

export interface Booking {
  id: string;
  doorId: string;
  carrier: string;
  trailer: string;
  load: LoadType;
  /** Minutes since midnight, [0, 1440). */
  start: number;
  end: number;
}

export const ZONE_LABEL: Record<Zone, string> = {
  inbound: "Inbound receiving",
  outbound: "Outbound shipping",
};

export const DOORS: DockDoor[] = [
  { id: "D1", code: "Door D1", zone: "inbound" },
  { id: "D2", code: "Door D2", zone: "inbound" },
  { id: "D3", code: "Door D3", zone: "inbound" },
  { id: "D4", code: "Door D4", zone: "inbound" },
  { id: "D5", code: "Door D5", zone: "inbound" },
  { id: "D6", code: "Door D6", zone: "inbound" },
  { id: "D7", code: "Door D7", zone: "outbound" },
  { id: "D8", code: "Door D8", zone: "outbound" },
  { id: "D9", code: "Door D9", zone: "outbound" },
  { id: "D10", code: "Door D10", zone: "outbound" },
  { id: "D11", code: "Door D11", zone: "outbound" },
  { id: "D12", code: "Door D12", zone: "outbound" },
];

/** Operating window shown on the timeline: 6:00 AM – 8:00 PM. */
export const WINDOW_START = 360;
export const WINDOW_END = 1200;
export const WINDOW_SPAN = WINDOW_END - WINDOW_START;

export const TICK_STEP = 120;

/** Fixed demo "now" — 11:30 AM. Only ever used to color-code today's bookings; tomorrow's are all
 *  in the future by definition and never consult it. */
export const CURRENT_MINUTE = 690;

function b(id: string, doorId: string, carrier: string, trailer: string, load: LoadType, start: number, end: number): Booking {
  return { id, doorId, carrier, trailer, load, start, end };
}

const TODAY: Booking[] = [
  b("d1-1", "D1", "Meridian Freight Co.", "TRL-10422", "FTL", 360, 570),
  b("d1-2", "D1", "Blue Ridge Transport", "TRL-20481", "LTL", 630, 840),
  b("d1-3", "D1", "Coastal Route Carriers", "TRL-30559", "FTL", 900, 1140),

  b("d2-1", "D2", "Harborline Logistics", "TRL-40672", "LTL", 360, 600),
  b("d2-2", "D2", "Ironclad Freight", "TRL-50734", "FTL", 660, 900),

  b("d3-1", "D3", "Pinnacle Freightways", "TRL-60821", "FTL", 360, 630),
  b("d3-2", "D3", "Summit Line Haulage", "TRL-70915", "LTL", 570, 780),
  b("d3-3", "D3", "Overland Supply Co.", "TRL-81003", "FTL", 840, 1080),

  b("d4-1", "D4", "Granite State Carriers", "TRL-91187", "LTL", 420, 660),
  b("d4-2", "D4", "Northgate Transit", "TRL-02261", "FTL", 720, 960),

  b("d5-1", "D5", "Vanguard Logistics", "TRL-13348", "FTL", 360, 630),
  b("d5-2", "D5", "Redline Carriers", "TRL-24432", "LTL", 690, 900),
  b("d5-3", "D5", "Meridian Freight Co.", "TRL-35519", "FTL", 960, 1140),

  b("d6-1", "D6", "Harborline Logistics", "TRL-46603", "LTL", 480, 750),
  b("d6-2", "D6", "Coastal Route Carriers", "TRL-57681", "FTL", 690, 900),
  b("d6-3", "D6", "Ironclad Freight", "TRL-68755", "LTL", 960, 1140),

  b("d7-1", "D7", "Pinnacle Freightways", "TRL-79832", "FTL", 360, 600),
  b("d7-2", "D7", "Blue Ridge Transport", "TRL-80916", "LTL", 660, 900),

  b("d8-1", "D8", "Granite State Carriers", "TRL-91004", "FTL", 390, 660),
  b("d8-2", "D8", "Summit Line Haulage", "TRL-02198", "LTL", 720, 960),

  b("d9-1", "D9", "Overland Supply Co.", "TRL-13275", "LTL", 360, 570),
  b("d9-2", "D9", "Northgate Transit", "TRL-24349", "FTL", 630, 870),
  b("d9-3", "D9", "Vanguard Logistics", "TRL-35423", "LTL", 930, 1140),

  b("d10-1", "D10", "Redline Carriers", "TRL-46507", "FTL", 420, 690),
  b("d10-2", "D10", "Meridian Freight Co.", "TRL-57591", "LTL", 750, 990),

  b("d11-1", "D11", "Ironclad Freight", "TRL-68675", "FTL", 360, 660),
  b("d11-2", "D11", "Harborline Logistics", "TRL-79769", "LTL", 720, 960),

  b("d12-1", "D12", "Coastal Route Carriers", "TRL-80853", "LTL", 390, 630),
  b("d12-2", "D12", "Blue Ridge Transport", "TRL-91947", "FTL", 690, 930),
  b("d12-3", "D12", "Pinnacle Freightways", "TRL-02031", "LTL", 990, 1170),
];

const TOMORROW: Booking[] = [
  b("t1-1", "D1", "Blue Ridge Transport", "TRL-11420", "FTL", 360, 600),
  b("t1-2", "D1", "Northgate Transit", "TRL-22504", "LTL", 660, 870),

  b("t2-1", "D2", "Meridian Freight Co.", "TRL-33588", "LTL", 390, 630),
  b("t2-2", "D2", "Pinnacle Freightways", "TRL-44672", "FTL", 690, 960),

  b("t3-1", "D3", "Ironclad Freight", "TRL-55756", "FTL", 360, 600),
  b("t3-2", "D3", "Vanguard Logistics", "TRL-66840", "LTL", 660, 900),

  b("t4-1", "D4", "Harborline Logistics", "TRL-77924", "FTL", 420, 690),
  b("t4-2", "D4", "Coastal Route Carriers", "TRL-88008", "LTL", 630, 840),

  b("t5-1", "D5", "Summit Line Haulage", "TRL-99192", "FTL", 360, 630),
  b("t5-2", "D5", "Overland Supply Co.", "TRL-10376", "LTL", 690, 930),

  b("t6-1", "D6", "Redline Carriers", "TRL-20460", "FTL", 420, 660),
  b("t6-2", "D6", "Granite State Carriers", "TRL-30544", "LTL", 720, 960),

  b("t7-1", "D7", "Vanguard Logistics", "TRL-40628", "FTL", 360, 600),
  b("t7-2", "D7", "Meridian Freight Co.", "TRL-50712", "LTL", 660, 900),

  b("t8-1", "D8", "Blue Ridge Transport", "TRL-60796", "FTL", 390, 630),
  b("t8-2", "D8", "Ironclad Freight", "TRL-70880", "LTL", 690, 930),

  b("t9-1", "D9", "Pinnacle Freightways", "TRL-80964", "FTL", 360, 600),
  b("t9-2", "D9", "Northgate Transit", "TRL-91048", "LTL", 660, 900),

  b("t10-1", "D10", "Harborline Logistics", "TRL-12132", "FTL", 420, 660),
  b("t10-2", "D10", "Summit Line Haulage", "TRL-22216", "LTL", 720, 960),

  b("t11-1", "D11", "Coastal Route Carriers", "TRL-32300", "FTL", 360, 630),
  b("t11-2", "D11", "Redline Carriers", "TRL-42384", "LTL", 690, 930),

  b("t12-1", "D12", "Overland Supply Co.", "TRL-52468", "FTL", 390, 660),
  b("t12-2", "D12", "Granite State Carriers", "TRL-62552", "LTL", 720, 960),
];

export const BOOKINGS: Record<Period, Booking[]> = { today: TODAY, tomorrow: TOMORROW };

export const PERIOD_LABEL: Record<Period, string> = { today: "today", tomorrow: "tomorrow" };

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

export function formatClockShort(totalMinutes: number): string {
  const m = ((totalMinutes % 1440) + 1440) % 1440;
  const hour24 = Math.floor(m / 60);
  const period = hour24 >= 12 ? "PM" : "AM";
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return `${hour12} ${period}`;
}

export function formatRange(start: number, end: number): string {
  return `${formatClock(start)}–${formatClock(end)}`;
}

/** Compact clock format for tight table cells — "6:00a" instead of "6:00 AM". Used only in the
 *  detail panel's bookings table; the timeline's bars and legend keep the full "AM/PM" form,
 *  which has far more room to breathe. */
export function formatClockCompact(totalMinutes: number): string {
  const m = ((totalMinutes % 1440) + 1440) % 1440;
  const hour24 = Math.floor(m / 60);
  const minute = m % 60;
  const period = hour24 >= 12 ? "p" : "a";
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return `${hour12}:${minute.toString().padStart(2, "0")}${period}`;
}

export function formatRangeCompact(start: number, end: number): string {
  return `${formatClockCompact(start)}–${formatClockCompact(end)}`;
}

export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export const pctFmt = new Intl.NumberFormat("en-US", { style: "percent", maximumFractionDigits: 0 });
export const countFmt = new Intl.NumberFormat("en-US");

// ---------------------------------------------------------------------------
// Derived aggregates — every number on screen traces back to one of these.
// ---------------------------------------------------------------------------

export function getTicks(): number[] {
  const ticks: number[] = [];
  for (let t = WINDOW_START; t <= WINDOW_END; t += TICK_STEP) ticks.push(t);
  return ticks;
}

export function getDoorBookings(period: Period, doorId: string): Booking[] {
  return BOOKINGS[period].filter((bk) => bk.doorId === doorId).sort((a, bb) => a.start - bb.start);
}

export function getStatus(booking: Booking, period: Period): BookingStatus {
  if (period === "tomorrow") return "scheduled";
  if (booking.end <= CURRENT_MINUTE) return "completed";
  if (booking.start <= CURRENT_MINUTE && booking.end > CURRENT_MINUTE) return "loading";
  return "scheduled";
}

export const STATUS_LABEL: Record<BookingStatus, string> = {
  scheduled: "Scheduled",
  loading: "Loading",
  completed: "Completed",
};

/** Bookings that overlap another booking on the same door — a double-booked dock door. Returns
 *  the set of booking ids involved, computed fresh from the schedule rather than hand-flagged, so
 *  editing a time above can never leave a stale conflict marker behind. */
export function computeConflictIds(period: Period): Set<string> {
  const byDoor = new Map<string, Booking[]>();
  for (const bk of BOOKINGS[period]) {
    const list = byDoor.get(bk.doorId) ?? [];
    list.push(bk);
    byDoor.set(bk.doorId, list);
  }
  const conflicts = new Set<string>();
  for (const list of byDoor.values()) {
    const sorted = [...list].sort((a, bb) => a.start - bb.start);
    for (let i = 0; i < sorted.length; i++) {
      for (let j = i + 1; j < sorted.length; j++) {
        if (sorted[j].start < sorted[i].end) {
          conflicts.add(sorted[i].id);
          conflicts.add(sorted[j].id);
        }
      }
    }
  }
  return conflicts;
}

/** Greedy lane assignment so overlapping bookings on one door stack into separate lanes instead of
 *  painting over each other. Lanes are assigned in start-time order; a booking joins the lowest
 *  lane whose previous occupant has already ended. */
export function assignLanes(bookings: Booking[]): { laneOf: Map<string, number>; laneCount: number } {
  const sorted = [...bookings].sort((a, bb) => a.start - bb.start);
  const laneEnds: number[] = [];
  const laneOf = new Map<string, number>();
  for (const bk of sorted) {
    let placed = -1;
    for (let i = 0; i < laneEnds.length; i++) {
      if (laneEnds[i] <= bk.start) {
        placed = i;
        break;
      }
    }
    if (placed === -1) {
      placed = laneEnds.length;
      laneEnds.push(bk.end);
    } else {
      laneEnds[placed] = bk.end;
    }
    laneOf.set(bk.id, placed);
  }
  return { laneOf, laneCount: Math.max(laneEnds.length, 1) };
}

export interface DoorStats {
  bookingCount: number;
  bookedMinutes: number;
  utilization: number;
  nextOpeningLabel: string | null;
}

export function getDoorStats(period: Period, doorId: string): DoorStats {
  const bookings = getDoorBookings(period, doorId);
  const bookedMinutes = bookings.reduce((sum, bk) => sum + (bk.end - bk.start), 0);
  const utilization = bookedMinutes / WINDOW_SPAN;
  const lastEnd = bookings.length ? Math.max(...bookings.map((bk) => bk.end)) : WINDOW_START;
  const nextOpeningLabel = lastEnd < WINDOW_END ? formatClock(lastEnd) : null;
  return { bookingCount: bookings.length, bookedMinutes, utilization, nextOpeningLabel };
}

export interface OverallStats {
  doorCount: number;
  bookingCount: number;
  bookedMinutes: number;
  utilization: number;
  conflictDoorCount: number;
  avgDwellMinutes: number;
}

export function getOverallStats(period: Period): OverallStats {
  const bookings = BOOKINGS[period];
  const bookedMinutes = bookings.reduce((sum, bk) => sum + (bk.end - bk.start), 0);
  const capacity = DOORS.length * WINDOW_SPAN;
  const conflictIds = computeConflictIds(period);
  const conflictDoors = new Set(bookings.filter((bk) => conflictIds.has(bk.id)).map((bk) => bk.doorId));
  return {
    doorCount: DOORS.length,
    bookingCount: bookings.length,
    bookedMinutes,
    utilization: bookedMinutes / capacity,
    conflictDoorCount: conflictDoors.size,
    avgDwellMinutes: Math.round(bookedMinutes / bookings.length),
  };
}

export function getCarriers(period: Period): string[] {
  const set = new Set(BOOKINGS[period].map((bk) => bk.carrier));
  return [...set].sort((a, c) => a.localeCompare(c));
}

export function getDoorById(doorId: string): DockDoor | undefined {
  return DOORS.find((d) => d.id === doorId);
}
