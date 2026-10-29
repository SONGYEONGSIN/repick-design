// native/src/evolve/r44/b/data.ts — auto-native-r44 candidate b.
//
// Deterministic dummy data for Doorstep Return Pickup Scheduling. No
// Math.random, no Date.now, no argumentless `new Date()` — every date/time
// shown is a fixed, pre-written label, not something computed at render
// time. "Today" for this screen's copy is treated as Wed, Oct 28, 2026.

export type PickupWindow = {
  id: string;
  dateLabel: string;
  timeRangeLabel: string;
  courierLabel: string;
  /** Optional short flavor note shown under the time range — e.g. "Soonest
   * available". Not every window has one. */
  noteLabel?: string;
};

export type ReturnOrderSummary = {
  orderRef: string;
  itemName: string;
  reasonLabel: string;
  deadlineLabel: string;
};

export const RETURN_ORDER: ReturnOrderSummary = {
  orderRef: "RTN-48213",
  itemName: "Herschel Little America Backpack — Navy",
  reasonLabel: "Wrong size ordered",
  deadlineLabel: "November 2, 2026",
};

export const PICKUP_WINDOWS: PickupWindow[] = [
  {
    id: "pw-1",
    dateLabel: "Thu, Oct 29",
    timeRangeLabel: "9:00 AM – 12:00 PM",
    courierLabel: "CJ Logistics",
    noteLabel: "Soonest available",
  },
  {
    id: "pw-2",
    dateLabel: "Thu, Oct 29",
    timeRangeLabel: "1:00 PM – 5:00 PM",
    courierLabel: "CJ Logistics",
  },
  {
    id: "pw-3",
    dateLabel: "Fri, Oct 30",
    timeRangeLabel: "9:00 AM – 12:00 PM",
    courierLabel: "CJ Logistics",
  },
  {
    id: "pw-4",
    dateLabel: "Fri, Oct 30",
    timeRangeLabel: "1:00 PM – 5:00 PM",
    courierLabel: "CJ Logistics",
  },
  {
    id: "pw-5",
    dateLabel: "Sat, Oct 31",
    timeRangeLabel: "9:00 AM – 1:00 PM",
    courierLabel: "Hanjin Express",
  },
  {
    id: "pw-6",
    dateLabel: "Mon, Nov 2",
    timeRangeLabel: "9:00 AM – 12:00 PM",
    courierLabel: "CJ Logistics",
    noteLabel: "Last window before the return deadline",
  },
];

/** "Thu, Oct 29, 9:00 AM – 12:00 PM" — used in confirm prompts, confirmed
 * acknowledgements and accessibility labels alike, so the wording the user
 * reads on screen matches exactly what a screen reader announces. */
export function windowSummaryLabel(w: PickupWindow): string {
  return `${w.dateLabel}, ${w.timeRangeLabel}`;
}
