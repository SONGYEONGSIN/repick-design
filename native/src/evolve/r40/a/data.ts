// native/src/evolve/r40/a/data.ts
//
// Deterministic dummy data for the buyer-side "Offer Status" screen: the
// single pending offer the buyer is tracking, the listing it was made on,
// and a short history of the buyer's past offers on OTHER listings.
//
// All dates are fixed Date constants (no Date.now()/new Date() with no
// args) so the derived "time remaining" readout is reproducible run to run.
// STATUS_SNAPSHOT_AT stands in for "the moment this screen is being viewed"
// — it is a fixed reference point, not a live clock, so subtracting it from
// the (possibly-extended) expiry date is a real computation that never
// ticks on its own.

export interface CurrentListingFacts {
  id: string;
  title: string;
  categoryLabel: string;
  conditionTag: string;
}

export const currentListing: CurrentListingFacts = {
  id: "ls-8821",
  title: "Merino Wool Overcoat",
  categoryLabel: "Outerwear",
  conditionTag: "Excellent",
};

export interface CurrentOfferFacts {
  offeredAmount: number;
  askingAmount: number;
  statusLabel: string;
}

export const currentOffer: CurrentOfferFacts = {
  offeredAmount: 185,
  askingAmount: 240,
  statusLabel: "Awaiting seller response",
};

// Fixed offer-window anchors.
export const OFFER_SUBMITTED_AT = new Date(2026, 9, 17, 9, 0, 0);
export const INITIAL_OFFER_EXPIRES_AT = new Date(2026, 9, 20, 9, 0, 0);

// Fixed "viewing moment" snapshot — stands in for the live clock without
// ever reading it, so the derived countdown is deterministic.
export const STATUS_SNAPSHOT_AT = new Date(2026, 9, 18, 3, 0, 0);

export const EXTENSION_DURATION_MS = 24 * 60 * 60 * 1000;

export type OfferHistoryStatus = "accepted" | "declined" | "expired";

export interface OfferHistoryRecord {
  id: string;
  listingTitle: string;
  conditionTag: string;
  amountOffered: number;
  askingPrice: number;
  status: OfferHistoryStatus;
  resolvedOnLabel: string;
}

export const offerHistory: OfferHistoryRecord[] = [
  {
    id: "hist-1",
    listingTitle: "Vintage Leather Satchel",
    conditionTag: "Good",
    amountOffered: 60,
    askingPrice: 85,
    status: "accepted",
    resolvedOnLabel: "Oct 2",
  },
  {
    id: "hist-2",
    listingTitle: "Ceramic Table Lamp",
    conditionTag: "Fair",
    amountOffered: 18,
    askingPrice: 32,
    status: "declined",
    resolvedOnLabel: "Sep 24",
  },
  {
    id: "hist-3",
    listingTitle: "Canvas Backpack",
    conditionTag: "Excellent",
    amountOffered: 40,
    askingPrice: 55,
    status: "expired",
    resolvedOnLabel: "Sep 11",
  },
  {
    id: "hist-4",
    listingTitle: "Mechanical Keyboard",
    conditionTag: "Like New",
    amountOffered: 70,
    askingPrice: 95,
    status: "accepted",
    resolvedOnLabel: "Aug 30",
  },
];

const MONTH_ABBREVIATIONS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function formatShortDate(date: Date): string {
  return `${MONTH_ABBREVIATIONS[date.getMonth()]} ${date.getDate()}`;
}

export function formatCurrency(amount: number): string {
  return `$${Math.round(amount).toLocaleString("en-US")}`;
}

export interface RemainingWindow {
  label: string;
  isPastDue: boolean;
}

// Pure subtraction of two fixed Date constants — a real derived
// computation, but never reads the actual wall clock.
export function computeRemainingWindow(
  fromDate: Date,
  toDate: Date
): RemainingWindow {
  const diffMs = toDate.getTime() - fromDate.getTime();
  if (diffMs <= 0) {
    return { label: "Offer window has closed", isPastDue: true };
  }
  const totalMinutes = Math.floor(diffMs / (60 * 1000));
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const dayWord = days === 1 ? "day" : "days";
  const hourWord = hours === 1 ? "hour" : "hours";
  const label =
    days > 0
      ? `Expires in ${days} ${dayWord} ${hours} ${hourWord}`
      : `Expires in ${hours} ${hourWord}`;
  return { label, isPastDue: false };
}
