// native/src/evolve/r46/b/data.ts
// Deterministic dummy data for the "Watched Item Price History" screen.
// Every date below is a fixed "YYYY-MM-DD" literal. The only day-math helper
// (daysBetweenIso) takes two such literals as arguments — there is no
// no-argument `new Date()` and no `Date.now()` anywhere in this module.

export interface WatchedItem {
  name: string;
  categoryLabel: string;
  conditionLabel: string;
  /** Short mark shown inside the photo placeholder box (no photo asset exists). */
  placeholderMark: string;
}

export const WATCHED_ITEM: WatchedItem = {
  name: "Sony WH-1000XM4 Wireless Headphones",
  categoryLabel: "Electronics / Headphones",
  conditionLabel: "Like New",
  placeholderMark: "WH",
};

/** A fixed stand-in for "today" — a literal string, never a live clock read. */
export const REFERENCE_TODAY_ISO = "2026-11-01";

export type PriceEventKind = "listed" | "drop" | "raise";

export interface PricePoint {
  id: string;
  dateISO: string;
  kind: PriceEventKind;
  priceKRW: number;
}

// Chronological order, oldest first. This is the source order — the screen's
// sort control only changes how it is *displayed*, never this array.
export const PRICE_POINTS: PricePoint[] = [
  { id: "pp-1", dateISO: "2026-08-02", kind: "listed", priceKRW: 185000 },
  { id: "pp-2", dateISO: "2026-08-15", kind: "drop", priceKRW: 169000 },
  { id: "pp-3", dateISO: "2026-08-29", kind: "drop", priceKRW: 152000 },
  { id: "pp-4", dateISO: "2026-09-10", kind: "raise", priceKRW: 158000 },
  { id: "pp-5", dateISO: "2026-09-24", kind: "drop", priceKRW: 139000 },
  { id: "pp-6", dateISO: "2026-10-08", kind: "drop", priceKRW: 124000 },
  { id: "pp-7", dateISO: "2026-10-22", kind: "drop", priceKRW: 109000 },
];

export interface EnrichedPricePoint extends PricePoint {
  /** null only for the very first (listing) point — there is no prior price to compare to. */
  deltaKRW: number | null;
  deltaPercent: number | null;
  /** Days since the previous recorded point; null for the first point. */
  daysSincePrevious: number | null;
}

/**
 * Pure day-count between two fixed "YYYY-MM-DD" strings, using Date.UTC with
 * explicit, parsed arguments (not an argument-less `new Date()`), so the
 * result is a function of its inputs alone.
 */
export function daysBetweenIso(earlierISO: string, laterISO: string): number {
  const [ey, em, ed] = earlierISO.split("-").map(Number);
  const [ly, lm, ld] = laterISO.split("-").map(Number);
  const earlierMs = Date.UTC(ey, em - 1, ed);
  const laterMs = Date.UTC(ly, lm - 1, ld);
  return Math.round((laterMs - earlierMs) / 86400000);
}

/** Precomputes delta/percent/day-gap once, in fixed chronological order, so a
 * later display-order toggle can never change these numbers — it can only
 * change which row they appear next to. */
export function buildEnrichedHistory(points: PricePoint[]): EnrichedPricePoint[] {
  return points.map((point, index) => {
    if (index === 0) {
      return { ...point, deltaKRW: null, deltaPercent: null, daysSincePrevious: null };
    }
    const previous = points[index - 1];
    const deltaKRW = point.priceKRW - previous.priceKRW;
    const deltaPercent = (deltaKRW / previous.priceKRW) * 100;
    const daysSincePrevious = daysBetweenIso(previous.dateISO, point.dateISO);
    return { ...point, deltaKRW, deltaPercent, daysSincePrevious };
  });
}

export function formatKRW(amount: number): string {
  // A visible space between the ₩ mark and the digits keeps the glyph's
  // crossbar from visually colliding with the following digit.
  return `₩ ${Math.round(amount).toLocaleString("en-US")}`;
}

export function formatSignedPercent(percent: number): string {
  const rounded = Math.round(percent * 10) / 10;
  const sign = rounded > 0 ? "+" : "";
  return `${sign}${rounded.toFixed(1)}%`;
}

const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export function formatHistoryDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${MONTH_LABELS[m - 1]} ${d}, ${y}`;
}

export function kindLabel(kind: PriceEventKind, isFirst: boolean): string {
  if (isFirst) return "Listed at";
  if (kind === "raise") return "Price raised to";
  return "Price dropped to";
}
