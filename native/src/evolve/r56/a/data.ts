// native/src/evolve/r56/a/data.ts
//
// Deterministic dummy data for the Local Meetup Schedule screen. Everything
// below is a fixed literal — no Math.random, no Date.now(), no bare `new
// Date()` — so the same grid and location list render on every run.

export interface DayOption {
  id: string;
  /** Short column header, e.g. "Sat". */
  label: string;
  /** Secondary line under the short label, e.g. "Nov 14". */
  dateLabel: string;
}

export interface TimeSlotOption {
  id: string;
  /** Row label, e.g. "Midday". */
  label: string;
  /** Clock range shown under the row label, e.g. "11 AM - 1 PM". */
  rangeLabel: string;
}

export interface MeetupSpot {
  id: string;
  name: string;
  descriptor: string;
}

export const DAYS: DayOption[] = [
  { id: "d1", label: "Fri", dateLabel: "Nov 13" },
  { id: "d2", label: "Sat", dateLabel: "Nov 14" },
  { id: "d3", label: "Sun", dateLabel: "Nov 15" },
  { id: "d4", label: "Mon", dateLabel: "Nov 16" },
];

export const TIME_SLOTS: TimeSlotOption[] = [
  { id: "t1", label: "Morning", rangeLabel: "9 - 11 AM" },
  { id: "t2", label: "Midday", rangeLabel: "11 AM - 1 PM" },
  { id: "t3", label: "Afternoon", rangeLabel: "1 - 4 PM" },
  { id: "t4", label: "Evening", rangeLabel: "4 - 7 PM" },
];

/** Combines a day id and a time-slot id into one grid-cell key. */
export function buildCellId(dayId: string, timeId: string): string {
  return `${dayId}__${timeId}`;
}

/** Splits a grid-cell key back into its day and time-slot records. */
export function parseCellId(
  cellId: string
): { day: DayOption; time: TimeSlotOption } | null {
  const [dayId, timeId] = cellId.split("__");
  const day = DAYS.find((d) => d.id === dayId);
  const time = TIME_SLOTS.find((t) => t.id === timeId);
  if (!day || !time) return null;
  return { day, time };
}

// Fixed set of cells the other side has already marked as busy on their end
// (e.g. the seller has a shift or a prior appointment). These render as
// unavailable and can't be chosen, independent of anything the viewer does.
export const BUSY_CELL_IDS: string[] = [
  buildCellId("d1", "t1"),
  buildCellId("d1", "t4"),
  buildCellId("d3", "t2"),
  buildCellId("d4", "t1"),
  buildCellId("d4", "t3"),
];

// Short, fixed list of safe public hand-off spots. Deliberately not a map —
// just a few vetted, well-lit, publicly trafficked locations.
export const MEETUP_SPOTS: MeetupSpot[] = [
  {
    id: "l1",
    name: "Central Station - North Entrance",
    descriptor: "Staffed entrance with cameras overhead, open 24 hours.",
  },
  {
    id: "l2",
    name: "Brew & Co. Cafe",
    descriptor: "Public seating near the front window, open until 9 PM.",
  },
  {
    id: "l3",
    name: "Riverside Mall - Main Lobby",
    descriptor: "Indoor, security on site, open until 8 PM.",
  },
  {
    id: "l4",
    name: "Main Library - Front Steps",
    descriptor: "Quiet and well-trafficked, open until 7 PM.",
  },
];

export function findSpot(spotId: string): MeetupSpot | undefined {
  return MEETUP_SPOTS.find((s) => s.id === spotId);
}
