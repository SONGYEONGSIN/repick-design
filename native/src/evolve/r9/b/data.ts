// native/src/evolve/r8/b/data.ts — auto-native-r8 candidate b.
//
// Seller trust profile. The screen's thesis is that a star average is a *claim* whose strength
// depends on how many ratings back it, how recent they are, and how they are spread — so this
// file stores rating DISTRIBUTIONS (counts per star), never a pre-baked average. Every displayed
// number is either a fixed constant below or derived from one by pure arithmetic in `trustStats`.
// No Math.random / Date.now / bare `new Date()` anywhere.

export const STARS = [5, 4, 3, 2, 1] as const;
export type Star = (typeof STARS)[number];
export const TOP_STAR: Star = 5;

/** Number of ratings at each star value. Keys are the star values themselves. */
export type StarCounts = Record<Star, number>;

export type LensId =
  | "all"
  | "recent"
  | "high-value"
  | "new-buyers"
  | "electronics";

/**
 * A "lens" is a subset of this seller's rated deals. Selecting one does not reveal hidden
 * information — it *removes* evidence, so the range recomputed from it can only get wider.
 * That widening is the argument the screen makes.
 */
export interface Lens {
  id: LensId;
  /** Chip label; the rated-deal count is appended at render so sample size is visible unpressed. */
  chip: string;
  /** Label above the range inside the claim card. */
  claimLabel: string;
  /** One sentence defining exactly what this subset contains. */
  note: string;
  counts: StarCounts;
  /** Share of THIS subset rated within the last 12 months. */
  within12moPct: number;
  /** Distinct buyers behind this subset's ratings. */
  distinctBuyers: number;
  latestRatedLabel: string;
}

export const ALL_EVIDENCE: Lens = {
  id: "all",
  chip: "All evidence",
  claimLabel: "RATING RANGE — ALL EVIDENCE",
  note: "Every rated deal this account has completed.",
  counts: { 5: 246, 4: 41, 3: 14, 2: 6, 1: 5 },
  within12moPct: 88,
  distinctBuyers: 258,
  latestRatedLabel: "Aug 12, 2026",
};

const RECENT: Lens = {
  id: "recent",
  chip: "Last 90 days",
  claimLabel: "RATING RANGE — LAST 90 DAYS",
  note: "Deals rated between May 14 and Aug 12, 2026.",
  counts: { 5: 49, 4: 9, 3: 3, 2: 2, 1: 1 },
  within12moPct: 100,
  distinctBuyers: 62,
  latestRatedLabel: "Aug 12, 2026",
};

const HIGH_VALUE: Lens = {
  id: "high-value",
  chip: "Over ₩300,000",
  claimLabel: "RATING RANGE — HIGH VALUE DEALS",
  note: "Deals that closed above ₩300,000.",
  counts: { 5: 26, 4: 6, 3: 3, 2: 2, 1: 1 },
  within12moPct: 71,
  distinctBuyers: 37,
  latestRatedLabel: "Jul 29, 2026",
};

const NEW_BUYERS: Lens = {
  id: "new-buyers",
  chip: "First-time buyers",
  claimLabel: "RATING RANGE — FIRST-TIME BUYERS",
  note: "Buyers who had never bought from this seller before.",
  counts: { 5: 74, 4: 14, 3: 5, 2: 2, 1: 2 },
  within12moPct: 84,
  distinctBuyers: 97,
  latestRatedLabel: "Aug 10, 2026",
};

const ELECTRONICS: Lens = {
  id: "electronics",
  chip: "Electronics",
  claimLabel: "RATING RANGE — ELECTRONICS",
  note: "Deals listed under Electronics.",
  counts: { 5: 4, 4: 2, 3: 1, 2: 1, 1: 1 },
  within12moPct: 44,
  distinctBuyers: 9,
  latestRatedLabel: "Feb 3, 2026",
};

export const LENSES: readonly Lens[] = [
  ALL_EVIDENCE,
  RECENT,
  HIGH_VALUE,
  NEW_BUYERS,
  ELECTRONICS,
];

export const SELLER = {
  name: "Jiwon Han",
  initials: "JH",
  joinedLabel: "Selling since Mar 2023",
  completedDeals: 353,
  activeListings: 8,
  categoryLabel: "Bags & accessories",
  categoryMedian: 4.31,
} as const;

/** Below this many ratings no range is worth reading, whatever it says. */
export const MIN_SAMPLE = 25;
/** At or above this share of distinct buyers, the ratings are treated as independent voices. */
export const INDEPENDENT_SHARE_PCT = 85;
/** The star scale is truncated so narrow and wide ranges stay distinguishable. Disclosed on screen. */
export const AXIS_MIN = 2.5;
export const AXIS_MAX = 5;

export interface AccountLimit {
  id: string;
  title: string;
  verdict: string;
  body: string;
}

/** Limits that no filter above can fix — tagged as account-wide on screen so the scope is honest. */
export const ACCOUNT_LIMITS: readonly AccountLimit[] = [
  {
    id: "unrated",
    title: "Unrated endings",
    verdict: "41 blind spots",
    body: "41 of 353 completed deals were never rated by either side. Nothing on this screen speaks for those.",
  },
  {
    id: "coverage",
    title: "Category coverage",
    verdict: "Uneven",
    body: "214 of 312 rated deals are bags and accessories. Electronics is 9. Read the electronics filter as unproven, not as good.",
  },
  {
    id: "ceiling",
    title: "Price ceiling",
    verdict: "Untested above ₩1,200,000",
    body: "No rated deal has closed above ₩1,200,000, so the high-value read stops there. Two disputes exist on record: one refunded in full, one closed with no fault found.",
  },
];

export interface TrustStats {
  n: number;
  /** Mean star value, rounded to 2 decimals. */
  mean: number;
  /** Lower bound of the 95% interval, clamped to the 1–5 star domain. */
  low: number;
  high: number;
  /** high − low. Wide means few ratings, not bad ones. */
  width: number;
}

function round2(x: number): number {
  return Math.round(x * 100) / 100;
}

export function round1(x: number): number {
  return Math.round(x * 10) / 10;
}

/** One decimal percentage share of `part` in `whole`. */
export function sharePct(part: number, whole: number): number {
  return Math.round((part / whole) * 1000) / 10;
}

export function countTotal(counts: StarCounts): number {
  let n = 0;
  for (const star of STARS) n += counts[star];
  return n;
}

/**
 * Mean plus a 95% interval computed from the distribution's own spread.
 * Small n and a wide spread both push the bounds apart — that is the whole point: the same
 * average carries a very different claim at n=9 than at n=312.
 */
export function trustStats(counts: StarCounts): TrustStats {
  const n = countTotal(counts);
  let total = 0;
  for (const star of STARS) total += star * counts[star];
  const mean = total / n;

  let squared = 0;
  for (const star of STARS) squared += counts[star] * (star - mean) ** 2;
  const margin = 1.96 * Math.sqrt(squared / n / n);

  const low = round2(Math.max(1, mean - margin));
  const high = round2(Math.min(5, mean + margin));
  return { n, mean: round2(mean), low, high, width: round2(high - low) };
}

/** Ratings at or below `star`, inside one distribution. */
export function cumulativeAtOrBelow(counts: StarCounts, star: Star): number {
  let total = 0;
  for (const s of STARS) {
    if (s <= star) total += counts[s];
  }
  return total;
}
