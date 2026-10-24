// native/src/evolve/r40/b/data.ts
//
// Deterministic data + pure helpers for the Return Drop-off Points screen.
// Six fixed, hand-authored drop-off locations back BOTH the list rows and the
// schematic map pins — there is exactly one array here, never a second copy
// for the map. "Open now" / "Closed now" is a real derived comparison against
// a fixed reference time-of-day constant (minutes since midnight), not a
// live wall-clock read and not a hand-typed status string per location.

export type DropoffKind = "Partner Store" | "Locker" | "Post Office";

export type DropoffSite = {
  id: string;
  name: string;
  kind: DropoffKind;
  streetLine: string;
  cityLine: string;
  distanceMiles: number;
  /** Minutes after midnight. `0` + `1440` together mean "open 24 hours". */
  opensAtMinute: number;
  closesAtMinute: number;
  /** 2-letter marker drawn inside the schematic-map pin. */
  markerGlyph: string;
  /** Fixed, hand-picked percentage placement on the abstract map canvas. */
  pinTopPct: number;
  pinLeftPct: number;
};

/**
 * Fixed "now" reference, expressed as minutes after midnight: 17:15 (5:15 PM).
 * Every open/closed computation in this screen reads from this one constant —
 * change it here and every status label and badge recomputes consistently.
 */
export const DROPOFF_REFERENCE_MINUTE = 17 * 60 + 15;

export const DROPOFF_SITES: readonly DropoffSite[] = [
  {
    id: "harborview-mall-counter",
    name: "Harborview Mall Returns Counter",
    kind: "Partner Store",
    streetLine: "420 Harborview Mall, Suite 118",
    cityLine: "Fairmont Heights, CA 94520",
    distanceMiles: 0.6,
    opensAtMinute: 9 * 60,
    closesAtMinute: 21 * 60,
    markerGlyph: "HM",
    pinTopPct: 20,
    pinLeftPct: 30,
  },
  {
    id: "cedar-street-locker",
    name: "Cedar Street Parcel Locker",
    kind: "Locker",
    streetLine: "118 Cedar Street",
    cityLine: "Fairmont Heights, CA 94521",
    distanceMiles: 1.1,
    opensAtMinute: 0,
    closesAtMinute: 24 * 60,
    markerGlyph: "CS",
    pinTopPct: 38,
    pinLeftPct: 68,
  },
  {
    id: "downtown-post-annex",
    name: "Downtown Post Office Annex",
    kind: "Post Office",
    streetLine: "275 Main Street",
    cityLine: "Fairmont Heights, CA 94519",
    distanceMiles: 1.4,
    opensAtMinute: 8 * 60,
    closesAtMinute: 17 * 60,
    markerGlyph: "DP",
    pinTopPct: 58,
    pinLeftPct: 18,
  },
  {
    id: "maple-commons-kiosk",
    name: "Maple Commons Return Kiosk",
    kind: "Partner Store",
    streetLine: "900 Maple Commons Drive",
    cityLine: "Fairmont Heights, CA 94522",
    distanceMiles: 2.0,
    opensAtMinute: 10 * 60,
    closesAtMinute: 20 * 60,
    markerGlyph: "MC",
    pinTopPct: 14,
    pinLeftPct: 78,
  },
  {
    id: "riverside-locker",
    name: "Riverside Parcel Locker",
    kind: "Locker",
    streetLine: "60 Riverside Walk",
    cityLine: "Fairmont Heights, CA 94523",
    distanceMiles: 2.7,
    opensAtMinute: 0,
    closesAtMinute: 24 * 60,
    markerGlyph: "RP",
    pinTopPct: 72,
    pinLeftPct: 58,
  },
  {
    id: "north-gate-post-office",
    name: "North Gate Post Office",
    kind: "Post Office",
    streetLine: "1500 North Gate Boulevard",
    cityLine: "Fairmont Heights, CA 94524",
    distanceMiles: 3.5,
    opensAtMinute: 8 * 60 + 30,
    closesAtMinute: 16 * 60 + 30,
    markerGlyph: "NG",
    pinTopPct: 84,
    pinLeftPct: 36,
  },
];

export function findDropoffSite(id: string | null): DropoffSite | null {
  if (!id) return null;
  return DROPOFF_SITES.find((site) => site.id === id) ?? null;
}

/** True when `opensAtMinute`/`closesAtMinute` span the full day. */
export function isOpenAroundTheClock(site: DropoffSite): boolean {
  return site.opensAtMinute === 0 && site.closesAtMinute >= 24 * 60;
}

/** Real derived comparison against the fixed reference minute — never a
 * hand-typed "Open now"/"Closed now" string stored on the site itself. */
export function isSiteOpenAt(site: DropoffSite, referenceMinute: number): boolean {
  if (isOpenAroundTheClock(site)) return true;
  return referenceMinute >= site.opensAtMinute && referenceMinute < site.closesAtMinute;
}

export function formatClockMinute(totalMinutes: number): string {
  const normalized = ((totalMinutes % (24 * 60)) + 24 * 60) % (24 * 60);
  const hour24 = Math.floor(normalized / 60);
  const minute = normalized % 60;
  const period = hour24 < 12 ? "AM" : "PM";
  const hour12raw = hour24 % 12;
  const hour12 = hour12raw === 0 ? 12 : hour12raw;
  const minuteLabel = minute < 10 ? `0${minute}` : `${minute}`;
  return `${hour12}:${minuteLabel} ${period}`;
}

export function formatHoursRange(site: DropoffSite): string {
  if (isOpenAroundTheClock(site)) return "Open 24 hours";
  return `${formatClockMinute(site.opensAtMinute)} – ${formatClockMinute(site.closesAtMinute)}`;
}

/** Richer derived status line for the expanded detail panel: tells the buyer
 * what changes next, not just the current boolean. */
export function formatNextChangeLabel(site: DropoffSite, referenceMinute: number): string {
  if (isOpenAroundTheClock(site)) return "Open 24 hours";
  return isSiteOpenAt(site, referenceMinute)
    ? `Open until ${formatClockMinute(site.closesAtMinute)}`
    : `Opens at ${formatClockMinute(site.opensAtMinute)}`;
}

export function formatDistanceLabel(miles: number): string {
  return `${miles.toFixed(1)} mi`;
}
