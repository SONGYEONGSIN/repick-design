// native/src/evolve/r22/c/data.ts
// Deterministic dummy data + pure derivation logic for Consignment Drop-off Scheduling.
// No Math.random / Date.now / argument-less `new Date()` anywhere in this file.

export type Weekday =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

// Fixed reference day for this dummy data set. Treated as "today" for the whole
// screen so every "open today" / "closed today" computation is deterministic —
// this is a fixture, not a read of the real calendar.
export const TODAY: Weekday = "Thursday";

// Length of a single bookable drop-off window, in minutes. Slots are DERIVED
// from each location's open-hours window divided by this length — see
// `deriveSlots` below — never hand-authored per location.
export const SLOT_LENGTH_MINUTES = 30;

export interface OpenWindow {
  openMinute: number; // minutes since 00:00
  closeMinute: number; // minutes since 00:00
}

export interface DropoffLocation {
  id: string;
  name: string;
  neighborhood: string;
  distanceMiles: number;
  // Only the days that matter for this fixture are populated; an absent day
  // means the store does not take consignment drop-offs that day.
  hoursByDay: Partial<Record<Weekday, OpenWindow>>;
}

export interface TimeSlot {
  id: string;
  startMinute: number;
  endMinute: number;
  label: string;
  available: boolean;
}

// Sorted nearest-first, as the brief requires the row order to reflect.
export const LOCATIONS: DropoffLocation[] = [
  {
    id: "fulton-street",
    name: "Fulton Street Resale Hub",
    neighborhood: "Fulton District",
    distanceMiles: 0.6,
    hoursByDay: {
      Monday: { openMinute: 540, closeMinute: 1080 },
      Tuesday: { openMinute: 540, closeMinute: 1080 },
      Wednesday: { openMinute: 540, closeMinute: 1080 },
      Thursday: { openMinute: 540, closeMinute: 1080 }, // 9:00 AM – 6:00 PM
      Friday: { openMinute: 540, closeMinute: 1080 },
      Saturday: { openMinute: 540, closeMinute: 1080 },
    },
  },
  {
    id: "harborline",
    name: "Harborline Consignment Partners",
    neighborhood: "Harborline",
    distanceMiles: 1.2,
    hoursByDay: {
      Monday: { openMinute: 600, closeMinute: 1140 },
      Tuesday: { openMinute: 600, closeMinute: 1140 },
      Wednesday: { openMinute: 600, closeMinute: 1140 },
      // Closed Thursdays for restocking — closed today.
      Friday: { openMinute: 600, closeMinute: 1140 },
      Saturday: { openMinute: 600, closeMinute: 1140 },
    },
  },
  {
    id: "maple-and-co",
    name: "Maple & Co. Trade-In Counter",
    neighborhood: "Maple Heights",
    distanceMiles: 1.9,
    hoursByDay: {
      Monday: { openMinute: 480, closeMinute: 1020 },
      Tuesday: { openMinute: 480, closeMinute: 1020 },
      Wednesday: { openMinute: 480, closeMinute: 1020 },
      Thursday: { openMinute: 480, closeMinute: 780 }, // shortened Thursday: 8:00 AM – 1:00 PM
      Friday: { openMinute: 480, closeMinute: 1020 },
      Saturday: { openMinute: 480, closeMinute: 1020 },
      Sunday: { openMinute: 480, closeMinute: 1020 },
    },
  },
  {
    id: "birchwood",
    name: "Birchwood Drop Point",
    neighborhood: "Birchwood",
    distanceMiles: 2.4,
    hoursByDay: {
      Tuesday: { openMinute: 660, closeMinute: 1200 },
      Wednesday: { openMinute: 660, closeMinute: 1200 },
      Thursday: { openMinute: 660, closeMinute: 1200 }, // 11:00 AM – 8:00 PM
      Friday: { openMinute: 660, closeMinute: 1200 },
      Saturday: { openMinute: 660, closeMinute: 1200 },
      Sunday: { openMinute: 660, closeMinute: 1200 },
    },
  },
  {
    id: "cedar-row",
    name: "Cedar Row General Store",
    neighborhood: "Cedar Row",
    distanceMiles: 3.1,
    hoursByDay: {
      Monday: { openMinute: 570, closeMinute: 1050 },
      Tuesday: { openMinute: 570, closeMinute: 1050 },
      Wednesday: { openMinute: 570, closeMinute: 1050 },
      Thursday: { openMinute: 570, closeMinute: 1050 }, // 9:30 AM – 5:30 PM
      Friday: { openMinute: 570, closeMinute: 1050 },
    },
  },
  {
    id: "union-depot",
    name: "Union Depot Consignment",
    neighborhood: "Union Depot",
    distanceMiles: 3.8,
    hoursByDay: {
      Wednesday: { openMinute: 720, closeMinute: 1260 },
      Thursday: { openMinute: 720, closeMinute: 1260 }, // 12:00 PM – 9:00 PM
      Friday: { openMinute: 720, closeMinute: 1260 },
      Saturday: { openMinute: 720, closeMinute: 1260 },
      Sunday: { openMinute: 720, closeMinute: 1260 },
    },
  },
  {
    id: "northside",
    name: "Northside Community Exchange",
    neighborhood: "Northside",
    distanceMiles: 4.5,
    hoursByDay: {
      Monday: { openMinute: 540, closeMinute: 840 },
      Wednesday: { openMinute: 540, closeMinute: 840 },
      Friday: { openMinute: 540, closeMinute: 840 },
      // Closed Thursdays — closed today, and it's the farthest option too.
    },
  },
];

// Fixed set of already-booked slot start-minutes per location. This is the
// only "unavailability" input — everything else in a slot list is computed.
export const BOOKED_SLOTS: Record<string, number[]> = {
  "fulton-street": [540, 570, 690, 900],
  harborline: [],
  "maple-and-co": [480, 600],
  birchwood: [660, 690, 720, 1140],
  "cedar-row": [570, 990],
  "union-depot": [720, 750, 1230],
  northside: [],
};

export function formatMinutes(totalMinutes: number): string {
  const hours24 = Math.floor(totalMinutes / 60) % 24;
  const minutes = totalMinutes % 60;
  const period = hours24 >= 12 ? "PM" : "AM";
  const hours12raw = hours24 % 12;
  const hours12 = hours12raw === 0 ? 12 : hours12raw;
  const minuteLabel = minutes < 10 ? `0${minutes}` : `${minutes}`;
  return `${hours12}:${minuteLabel} ${period}`;
}

export function formatWindow(window: OpenWindow): string {
  return `${formatMinutes(window.openMinute)} – ${formatMinutes(window.closeMinute)}`;
}

export function isClosedToday(location: DropoffLocation): boolean {
  return !location.hoursByDay[TODAY];
}

/**
 * Splits a location's today-window into fixed-length slots and marks each one
 * available/unavailable against the fixed booked list. Pure function of its
 * inputs — same location + same booked map always yields the same slots.
 */
export function deriveSlots(
  location: DropoffLocation,
  bookedByLocation: Record<string, number[]>
): TimeSlot[] {
  const window = location.hoursByDay[TODAY];
  if (!window) return [];

  const bookedStarts = new Set(bookedByLocation[location.id] ?? []);
  const slots: TimeSlot[] = [];

  for (
    let start = window.openMinute;
    start + SLOT_LENGTH_MINUTES <= window.closeMinute;
    start += SLOT_LENGTH_MINUTES
  ) {
    const end = start + SLOT_LENGTH_MINUTES;
    slots.push({
      id: `${location.id}-${start}`,
      startMinute: start,
      endMinute: end,
      label: `${formatMinutes(start)} – ${formatMinutes(end)}`,
      available: !bookedStarts.has(start),
    });
  }

  return slots;
}

function weightedCharSum(value: string): number {
  let sum = 0;
  for (let index = 0; index < value.length; index += 1) {
    sum += value.charCodeAt(index) * (index + 1);
  }
  return sum;
}

/**
 * Deterministically derives a confirmation code from the chosen location and
 * slot — no randomness, same pick always yields the same code.
 */
export function buildConfirmationCode(location: DropoffLocation, slot: TimeSlot): string {
  const initials = location.name
    .split(" ")
    .filter((word) => /^[A-Za-z]/.test(word))
    .map((word) => word[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();
  const checksum = (weightedCharSum(`${location.id}:${slot.id}`) % 9000) + 1000;
  return `RPK-${initials}-${checksum}`;
}
