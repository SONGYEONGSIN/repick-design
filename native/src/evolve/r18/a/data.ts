// native/src/evolve/r18/a/data.ts — deterministic dummy data for "My Impact"
// (auto-native-r18, candidate a).
//
// No Math.random / Date.now / argument-less `new Date()` anywhere below — every value is a
// fixed literal, or computed from fixed literals via pure arithmetic, so re-rendering (or
// re-running the render check) always produces the same numbers.

/* ───────────────────────── membership + headline totals ───────────────────────── */

export const JOINED_LABEL = "Mar 2025";
export const ITEMS_BOUGHT = 14;

// Fixed dummy conversion factor: average CO2 avoided per secondhand item vs. buying the
// equivalent item new. Not derived from any live source — a stand-in constant for this
// candidate's dummy data, kept small enough that every milestone total below stays a clean
// one-decimal number (see MILESTONES).
export const CO2_KG_PER_ITEM = 3.3;

export function co2AvoidedKg(): number {
  return Math.round(ITEMS_BOUGHT * CO2_KG_PER_ITEM * 10) / 10; // 46.2
}

// Fixed dummy conversion factor: km of average car driving with equivalent tailpipe CO2.
// Used only for a relatable comparison caption under the headline number.
export const KM_PER_KG_CO2 = 8.3;

export function carKmEquivalent(): number {
  return Math.round((co2AvoidedKg() * KM_PER_KG_CO2) / 10) * 10; // rounded to nearest 10 → 380
}

export const MONEY_SAVED_WON = 1284000;
export const RETAIL_VALUE_WON = 2150000; // what these 14 items would have cost new

export function actualSpentWon(): number {
  return RETAIL_VALUE_WON - MONEY_SAVED_WON; // 866,000
}

/* ───────────────────────── milestones ───────────────────────── */

export type MilestoneStatus = "achieved" | "upcoming";

export type Milestone = {
  id: string;
  status: MilestoneStatus;
  threshold: number;
  title: string;
  /** Only set for achieved milestones — when the threshold was crossed. */
  dateLabel?: string;
  /** Only set for achieved milestones — cumulative CO2 avoided at that point. */
  co2AtThresholdKg?: number;
};

// Newest first: the upcoming milestone leads (it's the forward-looking one), then achieved
// thresholds in reverse-chronological order — same top-to-bottom convention as the wallet
// ledger's transaction history.
export const MILESTONES: Milestone[] = [
  {
    id: "t25",
    status: "upcoming",
    threshold: 25,
    title: "25th item bought secondhand",
  },
  {
    id: "t10",
    status: "achieved",
    threshold: 10,
    title: "10th item bought secondhand",
    dateLabel: "Aug 2026",
    co2AtThresholdKg: 33.0,
  },
  {
    id: "t5",
    status: "achieved",
    threshold: 5,
    title: "5th item bought secondhand",
    dateLabel: "Feb 2026",
    co2AtThresholdKg: 16.5,
  },
  {
    id: "t1",
    status: "achieved",
    threshold: 1,
    title: "1st item bought secondhand",
    dateLabel: "Mar 2025",
    co2AtThresholdKg: 3.3,
  },
];

const NEXT_MILESTONE = MILESTONES.find((m) => m.status === "upcoming");

export function itemsToNextMilestone(): number {
  return NEXT_MILESTONE ? Math.max(NEXT_MILESTONE.threshold - ITEMS_BOUGHT, 0) : 0; // 11
}

export function progressToNextMilestonePercent(): number {
  if (!NEXT_MILESTONE) return 100;
  return Math.round((ITEMS_BOUGHT / NEXT_MILESTONE.threshold) * 100); // 56
}

/* ───────────────────────── methodology + standing action ───────────────────────── */

export const METHODOLOGY_TEXT =
  "We estimate CO2 avoided by comparing each secondhand purchase to the typical footprint of " +
  "manufacturing and shipping a new equivalent item, using category-average factors. Money " +
  "saved compares what you paid on repick to the item's original retail price where known. " +
  "Figures update once a purchase is marked received and are meant as a reasonable estimate, " +
  "not an audited measurement.";

export const SHARE_CONFIRMATION =
  "Impact card ready — take a screenshot of this screen to share it.";

/* ───────────────────────── formatting helpers ───────────────────────── */

// Thousands-separated, no toLocaleString (keeps formatting identical across JS environments).
function withThousands(value: number): string {
  return Math.abs(Math.round(value))
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Won-sign mitigation: a literal space between ₩ and the digits, so the glyph's crossbar never
// sits flush against an adjacent digit — option (a) from GENERATION.md §1. See candidates/a.md.
export function formatWon(value: number): string {
  return `₩ ${withThousands(value)}`;
}

export function formatCount(value: number): string {
  return withThousands(value);
}
