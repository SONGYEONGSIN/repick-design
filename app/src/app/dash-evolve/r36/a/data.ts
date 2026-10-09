/**
 * Setpoint — OKR console data.
 *
 * Everything below is literal, deterministic data: two fixed quarters (Q3 is
 * "this quarter", Q2 is "last quarter") per goal, a fixed 8-quarter history
 * for the trend sparkline, and a fixed composition breakdown per quarter.
 * No Math.random / Date.now / new Date anywhere — the period toggle just
 * switches which literal object the UI reads, so re-renders are fully
 * reproducible and hydration-safe.
 *
 * Every breakdown's "total" shown in the UI is computed with .reduce() over
 * the rows at render time, never hardcoded separately — so the subtotal sum
 * is true by construction rather than something that can drift out of sync.
 */

export type Period = "q3" | "q2";

export type Unit = "currency" | "percent" | "count" | "score";

export interface PeriodFigures {
  current: number;
  target: number;
}

export interface OkrItem {
  id: string;
  team: string;
  metric: string;
  unit: Unit;
  /** Suffix shown after a formatted count-unit value, e.g. "/wk" for deploys. */
  countSuffix?: string;
  owner: string;
  ownerInitials: string;
  scaleMin: number;
  scaleMax: number;
  /** Upper bound of the "poor" qualitative band. */
  poorMax: number;
  /** Upper bound of the "satisfactory" qualitative band (good runs to scaleMax). */
  satisfactoryMax: number;
  figures: Record<Period, PeriodFigures>;
  /** Last 8 quarters, oldest first, always ending at the Q3 current value with Q2 as the second-to-last point. */
  history: readonly number[];
  breakdownUnit: "currency" | "count";
  breakdownContext: string;
  breakdown: Record<Period, readonly { label: string; value: number }[]>;
}

export const OKR_ITEMS: readonly OkrItem[] = [
  {
    id: "sales-arr",
    team: "Sales",
    metric: "New ARR booked",
    unit: "currency",
    owner: "Dana Reyes",
    ownerInitials: "DR",
    scaleMin: 0,
    scaleMax: 3_600_000,
    poorMax: 2_000_000,
    satisfactoryMax: 2_800_000,
    figures: {
      q3: { current: 2_840_000, target: 3_200_000 },
      q2: { current: 2_510_000, target: 2_900_000 },
    },
    history: [1_620_000, 1_780_000, 1_950_000, 2_080_000, 2_190_000, 2_330_000, 2_510_000, 2_840_000],
    breakdownUnit: "currency",
    breakdownContext: "ARR by segment",
    breakdown: {
      q3: [
        { label: "Enterprise", value: 1_680_000 },
        { label: "Mid-market", value: 760_000 },
        { label: "SMB", value: 400_000 },
      ],
      q2: [
        { label: "Enterprise", value: 1_480_000 },
        { label: "Mid-market", value: 690_000 },
        { label: "SMB", value: 340_000 },
      ],
    },
  },
  {
    id: "marketing-pipeline",
    team: "Marketing",
    metric: "Qualified pipeline",
    unit: "currency",
    owner: "Marco Lin",
    ownerInitials: "ML",
    scaleMin: 0,
    scaleMax: 2_000_000,
    poorMax: 1_000_000,
    satisfactoryMax: 1_500_000,
    figures: {
      q3: { current: 1_460_000, target: 1_800_000 },
      q2: { current: 1_210_000, target: 1_600_000 },
    },
    history: [720_000, 810_000, 890_000, 970_000, 1_040_000, 1_120_000, 1_210_000, 1_460_000],
    breakdownUnit: "currency",
    breakdownContext: "Pipeline by source",
    breakdown: {
      q3: [
        { label: "Outbound", value: 540_000 },
        { label: "Inbound", value: 620_000 },
        { label: "Partner", value: 300_000 },
      ],
      q2: [
        { label: "Outbound", value: 430_000 },
        { label: "Inbound", value: 530_000 },
        { label: "Partner", value: 250_000 },
      ],
    },
  },
  {
    id: "product-adoption",
    team: "Product",
    metric: "Feature adoption rate",
    unit: "percent",
    owner: "Priya Natarajan",
    ownerInitials: "PN",
    scaleMin: 0,
    scaleMax: 100,
    poorMax: 50,
    satisfactoryMax: 70,
    figures: {
      q3: { current: 62, target: 75 },
      q2: { current: 54, target: 72 },
    },
    history: [34, 39, 43, 47, 50, 52, 54, 62],
    breakdownUnit: "count",
    breakdownContext: "Adopted users by plan (of 18,400 total users)",
    breakdown: {
      q3: [
        { label: "Pro", value: 6_200 },
        { label: "Team", value: 3_408 },
        { label: "Enterprise", value: 1_800 },
      ],
      q2: [
        { label: "Pro", value: 5_100 },
        { label: "Team", value: 3_012 },
        { label: "Enterprise", value: 1_500 },
      ],
    },
  },
  {
    id: "engineering-deploys",
    team: "Engineering",
    metric: "Deploy frequency",
    unit: "count",
    countSuffix: "/wk",
    owner: "Chen Wu",
    ownerInitials: "CW",
    scaleMin: 0,
    scaleMax: 50,
    poorMax: 25,
    satisfactoryMax: 40,
    figures: {
      q3: { current: 38, target: 45 },
      q2: { current: 31, target: 42 },
    },
    history: [18, 21, 24, 27, 29, 29, 31, 38],
    breakdownUnit: "count",
    breakdownContext: "Deploys by pod",
    breakdown: {
      q3: [
        { label: "Platform", value: 14 },
        { label: "Growth", value: 12 },
        { label: "Data", value: 12 },
      ],
      q2: [
        { label: "Platform", value: 12 },
        { label: "Growth", value: 10 },
        { label: "Data", value: 9 },
      ],
    },
  },
  {
    id: "cs-nrr",
    team: "Customer Success",
    metric: "Net revenue retention",
    unit: "percent",
    owner: "Elena Garcia",
    ownerInitials: "EG",
    scaleMin: 90,
    scaleMax: 120,
    poorMax: 100,
    satisfactoryMax: 107,
    figures: {
      q3: { current: 108, target: 112 },
      q2: { current: 104, target: 110 },
    },
    history: [96, 98, 100, 101, 103, 103, 104, 108],
    breakdownUnit: "count",
    breakdownContext: "Accounts by retention tier",
    breakdown: {
      q3: [
        { label: "Expanded", value: 162 },
        { label: "Flat", value: 68 },
        { label: "Churned", value: 15 },
      ],
      q2: [
        { label: "Expanded", value: 150 },
        { label: "Flat", value: 72 },
        { label: "Churned", value: 16 },
      ],
    },
  },
  {
    id: "support-sla",
    team: "Support",
    metric: "First response SLA",
    unit: "percent",
    owner: "Jordan Ahn",
    ownerInitials: "JA",
    scaleMin: 80,
    scaleMax: 100,
    poorMax: 90,
    satisfactoryMax: 95,
    figures: {
      q3: { current: 94, target: 97 },
      q2: { current: 90, target: 96 },
    },
    history: [78, 82, 85, 87, 88, 89, 90, 94],
    breakdownUnit: "count",
    breakdownContext: "Tickets resolved within SLA, by channel",
    breakdown: {
      q3: [
        { label: "Chat", value: 620 },
        { label: "Email", value: 540 },
        { label: "Phone", value: 250 },
      ],
      q2: [
        { label: "Chat", value: 560 },
        { label: "Email", value: 480 },
        { label: "Phone", value: 220 },
      ],
    },
  },
  {
    id: "finance-margin",
    team: "Finance",
    metric: "Gross margin",
    unit: "percent",
    owner: "Sam Okafor",
    ownerInitials: "SO",
    scaleMin: 55,
    scaleMax: 80,
    poorMax: 65,
    satisfactoryMax: 72,
    figures: {
      q3: { current: 71, target: 74 },
      q2: { current: 69, target: 73 },
    },
    history: [61, 63, 64, 65, 66, 67, 69, 71],
    breakdownUnit: "currency",
    breakdownContext: "COGS by category",
    breakdown: {
      q3: [
        { label: "Hosting", value: 612_000 },
        { label: "Support staff", value: 480_000 },
        { label: "Payments", value: 300_000 },
      ],
      q2: [
        { label: "Hosting", value: 620_000 },
        { label: "Support staff", value: 476_000 },
        { label: "Payments", value: 330_000 },
      ],
    },
  },
  {
    id: "people-enps",
    team: "People",
    metric: "Employee eNPS",
    unit: "score",
    owner: "Renee Castillo",
    ownerInitials: "RC",
    scaleMin: 0,
    scaleMax: 70,
    poorMax: 25,
    satisfactoryMax: 45,
    figures: {
      q3: { current: 42, target: 55 },
      q2: { current: 36, target: 52 },
    },
    history: [18, 22, 25, 28, 31, 33, 36, 42],
    breakdownUnit: "count",
    breakdownContext: "Survey respondents by segment",
    breakdown: {
      q3: [
        { label: "Promoters", value: 260 },
        { label: "Passives", value: 190 },
        { label: "Detractors", value: 50 },
      ],
      q2: [
        { label: "Promoters", value: 240 },
        { label: "Passives", value: 200 },
        { label: "Detractors", value: 60 },
      ],
    },
  },
] as const;

export type GoalStatus = "on-track" | "at-risk" | "behind";

export const STATUS_LABEL: Record<GoalStatus, string> = {
  "on-track": "On track",
  "at-risk": "At risk",
  behind: "Behind",
};

/** current / target, as a 0–100+ percentage. Not clamped — a bullet can exceed 100. */
export function achievementPercent(figures: PeriodFigures): number {
  return (figures.current / figures.target) * 100;
}

export function statusForAchievement(achievement: number): GoalStatus {
  if (achievement >= 95) return "on-track";
  if (achievement >= 80) return "at-risk";
  return "behind";
}

export function statusForItem(item: OkrItem, period: Period): GoalStatus {
  return statusForAchievement(achievementPercent(item.figures[period]));
}

/** Average achievement across every goal for the given period, 0–100-ish. */
export function overallCompletion(period: Period): number {
  const total = OKR_ITEMS.reduce((sum, item) => sum + achievementPercent(item.figures[period]), 0);
  return total / OKR_ITEMS.length;
}

export const PERIOD_LABEL: Record<Period, string> = {
  q3: "This quarter",
  q2: "Last quarter",
};

export const PERIOD_SUBLABEL: Record<Period, string> = {
  q3: "Q3 2026",
  q2: "Q2 2026",
};
