// native/src/evolve/r56/c/data.ts — auto-native-r56 candidate c
//
// Deterministic dummy data for the seller tier progress & milestones screen.
// No Math.random, no Date.now(), no bare `new Date()` — every number below
// is a fixed literal, and every "when this happened" detail is phrased as a
// sales-count milestone string rather than a calendar date.

export type TierId = "starter" | "trusted" | "veteran" | "elite";

export interface TierDefinition {
  id: TierId;
  label: string;
  /** Lifetime completed sales required to enter this tier. */
  salesThreshold: number;
  /** One-line perk shown under the tier name. */
  perk: string;
}

// Four tiers, ordered low to high. The screen derives "current" / "next" /
// progress-ratio purely from where SELLER_SNAPSHOT.completedSales falls in
// this list, the same derive-don't-store approach as the onboarding
// checklist screen this folder's idiom borrows from.
export const TIER_SEQUENCE: TierDefinition[] = [
  { id: "starter", label: "Starter", salesThreshold: 0, perk: "Standard payout schedule" },
  { id: "trusted", label: "Trusted", salesThreshold: 50, perk: "Priority search placement" },
  { id: "veteran", label: "Veteran", salesThreshold: 250, perk: "Lower marketplace fee (1% off)" },
  { id: "elite", label: "Elite", salesThreshold: 600, perk: "Dedicated support line + lowest fee" },
];

export const SELLER_SNAPSHOT = {
  // Falls between the "trusted" (50) and "veteran" (250) thresholds, so the
  // hero section should render current tier = Trusted, next tier = Veteran.
  completedSales: 184,
};

export type MilestoneStatus = "achieved" | "pending";

export interface MilestoneBadge {
  id: string;
  title: string;
  /** 2–3 character glyph drawn inside the badge icon — no emoji. */
  glyph: string;
  status: MilestoneStatus;
  summary: string;
  /** Shown when expanded and status is "achieved". */
  achievedDetail?: string;
  /** Shown when expanded and status is "pending" — what's left to do. */
  pendingDetail?: string;
  /** 0..1, how close this milestone is to completion (1 when achieved). Used for the progress sort. */
  progressRatio: number;
}

export const MILESTONE_BADGES: MilestoneBadge[] = [
  {
    id: "first-sale",
    title: "First Sale",
    glyph: "1",
    status: "achieved",
    summary: "Completed your very first sale.",
    achievedDetail: "Unlocked at sale #1.",
    progressRatio: 1,
  },
  {
    id: "fifty-club",
    title: "50 Sales Club",
    glyph: "50",
    status: "achieved",
    summary: "Reached 50 lifetime completed sales.",
    achievedDetail: "Unlocked at sale #50 — this also moved you into the Trusted tier.",
    progressRatio: 1,
  },
  {
    id: "five-star-streak",
    title: "Five-Star Streak",
    glyph: "5★",
    status: "achieved",
    summary: "Ten orders in a row rated five stars.",
    achievedDetail: "Unlocked after your 10th consecutive five-star order.",
    progressRatio: 1,
  },
  {
    id: "fast-shipper",
    title: "Fast Shipper",
    glyph: "FS",
    status: "achieved",
    summary: "Shipped 20 orders within one business day.",
    achievedDetail: "Unlocked after your 20th next-day shipment.",
    progressRatio: 1,
  },
  {
    id: "photo-pro",
    title: "Photo Pro",
    glyph: "PH",
    status: "achieved",
    summary: "Used 4+ photos on 25 listings.",
    achievedDetail: "Unlocked after your 25th listing with 4 or more photos.",
    progressRatio: 1,
  },
  {
    id: "quick-reply",
    title: "Quick Reply",
    glyph: "QR",
    status: "achieved",
    summary: "Averaged under 1 hour reply time for 30 days.",
    achievedDetail: "Unlocked by holding a sub-1-hour average reply time for a full 30-day stretch.",
    progressRatio: 1,
  },
  {
    id: "hundred-club",
    title: "100 Sales Club",
    glyph: "100",
    status: "achieved",
    summary: "Reached 100 lifetime completed sales.",
    achievedDetail: "Unlocked at sale #100.",
    progressRatio: 1,
  },
  {
    id: "repeat-favorite",
    title: "Repeat Buyer Favorite",
    glyph: "RB",
    status: "pending",
    summary: "Have 10 different buyers purchase from you twice.",
    pendingDetail: "6 of 10 repeat buyers so far — 4 more buyers need a second purchase from you.",
    progressRatio: 0.6,
  },
  {
    id: "two-fifty-club",
    title: "250 Sales Club",
    glyph: "250",
    status: "pending",
    summary: "Reach 250 lifetime completed sales.",
    pendingDetail: "184 of 250 sales — 66 more sales to unlock, and this also enters the Veteran tier.",
    progressRatio: 0.736,
  },
  {
    id: "fair-pricing",
    title: "Fair Pricing Streak",
    glyph: "FP",
    status: "pending",
    summary: "Go 15 listings without a price-drop complaint.",
    pendingDetail: "9 of 15 clean listings so far — 6 more listings without a complaint to unlock.",
    progressRatio: 0.6,
  },
  {
    id: "weekend-warrior",
    title: "Weekend Warrior",
    glyph: "WW",
    status: "pending",
    summary: "List 30 items on a weekend.",
    pendingDetail: "11 of 30 weekend listings so far — 19 more weekend listings to unlock.",
    progressRatio: 0.367,
  },
  {
    id: "community-helper",
    title: "Community Helper",
    glyph: "CH",
    status: "pending",
    summary: "Answer 25 buyer questions on other sellers' listings.",
    pendingDetail: "2 of 25 answered so far — 23 more answers to unlock.",
    progressRatio: 0.08,
  },
];
