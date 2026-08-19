// native/src/meetup-time/data.ts — auto-native-r9 winner (promoted).
//
// Deterministic dummy data only: no Math.random, no Date.now, no argument-less new Date().
// Every weekday name, date number and time label below is a hand-written literal. The window is
// Wed Aug 19 – Sun Aug 23, 2026 (Aug 16 2026 is a Sunday, so Aug 19 is a Wednesday); nothing here
// is derived from the host clock, so the grid renders identically on every machine and every run.

export interface DayColumn {
  id: string;
  /** Column header line 1, e.g. "WED". */
  short: string;
  /** Column header line 2, e.g. "19". Digits only — safe for tabular-nums. */
  dayNum: string;
  /** Prose abbreviation used in one-line summaries, e.g. "Thu". */
  abbr: string;
  /** Readout kicker, e.g. "THU · AUG 20". */
  header: string;
  /** Screen-reader form, e.g. "Thursday, August 20". */
  spoken: string;
}

export interface TimeBand {
  id: string;
  /** Gutter line 2, e.g. "Evening". */
  name: string;
  /** Gutter line 1, e.g. "6–9". Digits only — safe for tabular-nums. */
  range: string;
  /** Prose form, e.g. "6–9 PM". */
  compact: string;
  /** Screen-reader form, e.g. "6 PM to 9 PM". */
  spoken: string;
}

export const DAYS: DayColumn[] = [
  {
    id: "wed",
    short: "WED",
    dayNum: "19",
    abbr: "Wed",
    header: "WED · AUG 19",
    spoken: "Wednesday, August 19",
  },
  {
    id: "thu",
    short: "THU",
    dayNum: "20",
    abbr: "Thu",
    header: "THU · AUG 20",
    spoken: "Thursday, August 20",
  },
  {
    id: "fri",
    short: "FRI",
    dayNum: "21",
    abbr: "Fri",
    header: "FRI · AUG 21",
    spoken: "Friday, August 21",
  },
  {
    id: "sat",
    short: "SAT",
    dayNum: "22",
    abbr: "Sat",
    header: "SAT · AUG 22",
    spoken: "Saturday, August 22",
  },
  {
    id: "sun",
    short: "SUN",
    dayNum: "23",
    abbr: "Sun",
    header: "SUN · AUG 23",
    spoken: "Sunday, August 23",
  },
];

export const BANDS: TimeBand[] = [
  {
    id: "morning",
    name: "Morning",
    range: "9–12",
    compact: "9 AM–12 PM",
    spoken: "9 AM to 12 PM",
  },
  {
    id: "midday",
    name: "Midday",
    range: "12–3",
    compact: "12–3 PM",
    spoken: "12 PM to 3 PM",
  },
  {
    id: "afternoon",
    name: "Afternoon",
    range: "3–6",
    compact: "3–6 PM",
    spoken: "3 PM to 6 PM",
  },
  {
    id: "evening",
    name: "Evening",
    range: "6–9",
    compact: "6–9 PM",
    spoken: "6 PM to 9 PM",
  },
];

export const TOTAL_SLOTS = DAYS.length * BANDS.length;

export function cellKey(dayId: string, bandId: string): string {
  return `${dayId}-${bandId}`;
}

export function parseCellKey(
  key: string,
): { day: DayColumn; band: TimeBand } | null {
  const parts = key.split("-");
  const day = DAYS.find((d) => d.id === parts[0]);
  const band = BANDS.find((b) => b.id === parts[1]);
  if (!day || !band) return null;
  return { day, band };
}

// The counterparty's availability is given — this side of the grid is read-only for the buyer.
// Ilhwa works weekday daytimes, so she opens weekday evenings and most of Saturday.
export const THEIR_FREE: string[] = [
  "wed-evening",
  "thu-evening",
  "fri-evening",
  "sat-morning",
  "sat-midday",
  "sat-afternoon",
  "sun-midday",
  "sun-afternoon",
];

// The buyer's own availability — editable on this screen. Chosen so that opening the screen
// already shows three mutual slots (thu-evening, sat-midday, sat-afternoon) and leaves five
// them-only cells where saying "I'm free" would create a fourth.
export const YOUR_FREE_INITIAL: string[] = [
  "wed-midday",
  "wed-afternoon",
  "thu-evening",
  "fri-morning",
  "fri-midday",
  "sat-midday",
  "sat-afternoon",
  "sat-evening",
  "sun-morning",
];

export const PARTNER_NAME = "Ilhwa";
export const WEEK_LABEL = "Wed Aug 19 – Sun Aug 23";
export const MEETUP_PLACE = "Hongdae Stn. Exit 3, locker area";
// Kept as one plain string. It carries a ₩ glyph, so it is rendered by a Text that has no
// fontVariant of its own and no tabular-nums Text anywhere above it in the render tree.
export const DEAL_LINE = "Sony WH-1000XM5 · ₩289,000 · cash on handoff";
