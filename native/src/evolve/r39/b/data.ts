// native/src/evolve/r39/b/data.ts
//
// Deterministic data for the Vacation Mode screen: a fixed list of selectable
// away-date presets (cycled through by index, no date-picker library) and the
// default auto-reply message shown to buyers while the storefront is paused.

/** Fixed, deterministic preset dates. Both the start and end date rows cycle
 * through this same list independently by index — no real calendar math. */
export const AWAY_DATE_PRESETS: readonly string[] = [
  "Oct 20, 2026",
  "Oct 27, 2026",
  "Nov 3, 2026",
  "Nov 10, 2026",
  "Nov 17, 2026",
  "Dec 1, 2026",
];

export const DEFAULT_AUTO_REPLY_MESSAGE =
  "Thanks for stopping by! My storefront is paused for a short break. " +
  "I'll reply to messages and resume shipping as soon as I'm back — thank you for your patience.";

/** The full shape of the form this screen edits. Comparing a current
 * snapshot against the last-saved one is what derives `isDirty` — the save
 * band is never toggled by hand. */
export type VacationSettingsSnapshot = {
  paused: boolean;
  startDateIndex: number;
  endDateIndex: number;
  autoReplyMessage: string;
};

/** Seed state: storefront active, a two-week-out start/end preset pair, and
 * the default buyer-facing message. */
export const INITIAL_VACATION_SETTINGS: VacationSettingsSnapshot = {
  paused: false,
  startDateIndex: 0,
  endDateIndex: 2,
  autoReplyMessage: DEFAULT_AUTO_REPLY_MESSAGE,
};

export function vacationSnapshotsEqual(
  a: VacationSettingsSnapshot,
  b: VacationSettingsSnapshot
): boolean {
  return (
    a.paused === b.paused &&
    a.startDateIndex === b.startDateIndex &&
    a.endDateIndex === b.endDateIndex &&
    a.autoReplyMessage === b.autoReplyMessage
  );
}
