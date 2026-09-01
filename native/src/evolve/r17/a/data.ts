// native/src/evolve/r17/a/data.ts — deterministic dummy data for the Seller Performance
// Scorecard (auto-native-r17, candidate a).
//
// No Math.random / Date.now / argument-less `new Date()` anywhere below — every value is a
// fixed literal or computed from fixed literals via pure arithmetic.
//
// Window convention: every "current period" figure below covers the trailing 90 days ending at
// the close of the most recently completed month — Jun 1 – Aug 31, 2026 — rather than "today"
// (Sep 1, 2026), since the current month has not accumulated any data yet. "Prior period" means
// the 90 days before that (roughly Mar 1 – May 31, 2026).

export type TrendDirection = "up" | "down";

export type MetricTrend = {
  /** Which way the arrow glyph points — the raw numeric movement, not a value judgement. */
  direction: TrendDirection;
  /** Whether that movement is good news for the seller. Drives accent vs. neutral styling —
   *  never a second hue, per the single-accent rule. */
  improved: boolean;
  /** Full sentence fragment spoken alongside the arrow — trend is never color-only. */
  label: string;
};

export const WINDOW_LABEL = "Jun 1 – Aug 31, 2026";
export const AS_OF_LABEL = "Data as of Aug 31, 2026";

/* ───────────────────────── response time ───────────────────────── */

export const RESPONSE = {
  avgResponseMinutes: 47,
  avgResponseLabel: "47 min",
  priorPeriodMinutes: 63,
  trend: {
    direction: "down",
    improved: true,
    label: "25.4% faster than the previous 90 days",
  } as MetricTrend,
} as const;

/* ───────────────────────── on-time shipping ───────────────────────── */

export const SHIPPING = {
  totalShipmentsLast90: 71,
  lateShipmentsLast90: 4,
  priorPeriodRatePercent: 91.8,
  trend: {
    direction: "up",
    improved: true,
    label: "+2.6 pts vs. the previous 90 days",
  } as MetricTrend,
} as const;

export function onTimeShipRatePercent(): number {
  const onTime = SHIPPING.totalShipmentsLast90 - SHIPPING.lateShipmentsLast90;
  return Math.round((onTime / SHIPPING.totalShipmentsLast90) * 1000) / 10;
}

/* ───────────────────────── rating trend ───────────────────────── */

export type MonthlyRating = {
  id: string;
  monthLabel: string;
  rating: number;
  reviewCount: number;
};

// 12 consecutive months, Sep 2025 → Aug 2026 (oldest first). The last 3 entries (Jun–Aug 2026)
// are this screen's "last 90 days" review count and current-rating source.
export const RATING_HISTORY_12MO: MonthlyRating[] = [
  { id: "2025-09", monthLabel: "Sep 2025", rating: 4.62, reviewCount: 12 },
  { id: "2025-10", monthLabel: "Oct 2025", rating: 4.68, reviewCount: 14 },
  { id: "2025-11", monthLabel: "Nov 2025", rating: 4.71, reviewCount: 16 },
  { id: "2025-12", monthLabel: "Dec 2025", rating: 4.65, reviewCount: 11 },
  { id: "2026-01", monthLabel: "Jan 2026", rating: 4.74, reviewCount: 15 },
  { id: "2026-02", monthLabel: "Feb 2026", rating: 4.78, reviewCount: 17 },
  { id: "2026-03", monthLabel: "Mar 2026", rating: 4.76, reviewCount: 16 },
  { id: "2026-04", monthLabel: "Apr 2026", rating: 4.81, reviewCount: 19 },
  { id: "2026-05", monthLabel: "May 2026", rating: 4.79, reviewCount: 18 },
  { id: "2026-06", monthLabel: "Jun 2026", rating: 4.83, reviewCount: 18 },
  { id: "2026-07", monthLabel: "Jul 2026", rating: 4.85, reviewCount: 19 },
  { id: "2026-08", monthLabel: "Aug 2026", rating: 4.87, reviewCount: 21 },
];

export const RATING_HISTORY_6MO = RATING_HISTORY_12MO.slice(6);

const LATEST = RATING_HISTORY_12MO[RATING_HISTORY_12MO.length - 1];
// 3 months back from the latest entry — the "prior period" comparison point for the rating.
const PRIOR = RATING_HISTORY_12MO[RATING_HISTORY_12MO.length - 4];

export const RATING = {
  current: LATEST.rating,
  priorPeriod: PRIOR.rating,
  reviewCountLast90:
    RATING_HISTORY_12MO[RATING_HISTORY_12MO.length - 3].reviewCount +
    RATING_HISTORY_12MO[RATING_HISTORY_12MO.length - 2].reviewCount +
    RATING_HISTORY_12MO[RATING_HISTORY_12MO.length - 1].reviewCount,
  trend: {
    direction: "up",
    improved: true,
    label: "+0.08 vs. 3 months ago",
  } as MetricTrend,
} as const;

/* ───────────────────────── tier progress ───────────────────────── */

export const TIER_PROGRESS = {
  currentTierName: "Plus",
  nextTierName: "Elite",
  currentVolumeWon: 3220000,
  thresholdWon: 4000000,
  windowLabel: "Trailing 90-day sales volume",
} as const;

export function tierRemainingWon(): number {
  return TIER_PROGRESS.thresholdWon - TIER_PROGRESS.currentVolumeWon;
}

export function tierProgressPercent(): number {
  return (
    Math.round(
      (TIER_PROGRESS.currentVolumeWon / TIER_PROGRESS.thresholdWon) * 1000,
    ) / 10
  );
}

// KRW formatting — thousands-separated, no toLocaleString (deterministic across environments).
// Won-sign mitigation: option (a) from the brief — a literal space between ₩ and the digits, so
// the glyph's crossbar never touches an adjacent digit. See candidates/a.md for the full note.
export function formatWon(value: number): string {
  const digits = Math.abs(Math.round(value))
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `₩ ${digits}`;
}

/* ───────────────────────── standing action (bottom band) ───────────────────────── */

export const SHARE_CONFIRMATION =
  "Scorecard shared — Jun 1 – Aug 31, 2026 performance summary.";
