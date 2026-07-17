// Deterministic dummy data for Bisect — no Math.random / Date.now / bare `new Date()`.
// "Today" in this fixture is fixed at Jul 17, 2026. Day labels are pre-authored
// strings; chart series use a fixed sine formula (not randomness) so results are
// stable across renders and reloads.

import { SegmentRow, sumSegments } from "./format";

export const WORKSPACE = {
  org: "Northlane Retail",
  plan: "Growth plan",
  project: "Experimentation",
};

export const CURRENT_USER = {
  id: "u-devon",
  name: "Devon Okafor",
  role: "Growth Engineer",
  avatar:
    "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=96&h=96&fit=crop&crop=faces&q=60",
};

export interface Owner {
  id: string;
  name: string;
  avatar: string;
}

export const OWNERS: Record<string, Owner> = {
  "o-rina": {
    id: "o-rina",
    name: "Rina Kessler",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=96&h=96&fit=crop&crop=faces&q=60",
  },
  "o-marcus": {
    id: "o-marcus",
    name: "Marcus Aldana",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=96&h=96&fit=crop&crop=faces&q=60",
  },
  "o-priya": {
    id: "o-priya",
    name: "Priya Nandakumar",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&h=96&fit=crop&crop=faces&q=60",
  },
};

// 30 consecutive day labels ending "today", Jul 17 2026. Periods slice from the
// tail of this fixed array, so switching 7D/14D/30D never re-derives dates.
export const DAY_LABELS_30: string[] = [
  "Jun 18", "Jun 19", "Jun 20", "Jun 21", "Jun 22", "Jun 23", "Jun 24",
  "Jun 25", "Jun 26", "Jun 27", "Jun 28", "Jun 29", "Jun 30",
  "Jul 1", "Jul 2", "Jul 3", "Jul 4", "Jul 5", "Jul 6", "Jul 7",
  "Jul 8", "Jul 9", "Jul 10", "Jul 11", "Jul 12", "Jul 13", "Jul 14",
  "Jul 15", "Jul 16", "Jul 17",
];

export type PeriodId = "7d" | "14d" | "30d";

export const PERIOD_OPTIONS: { id: PeriodId; label: string; days: number }[] = [
  { id: "7d", label: "7D", days: 7 },
  { id: "14d", label: "14D", days: 14 },
  { id: "30d", label: "30D", days: 30 },
];

export type SegmentId = "desktop" | "mobile" | "tablet";

export const SEGMENT_LABELS: Record<SegmentId, string> = {
  desktop: "Desktop",
  mobile: "Mobile",
  tablet: "Tablet",
};

export const SEGMENT_ORDER: SegmentId[] = ["desktop", "mobile", "tablet"];

interface VariantSeed {
  label: string;
  description: string;
  segmentsBase30: SegmentRow[]; // authored totals for a 30-day window
  amp: number;
  phase: number;
  trend: number;
}

export interface Experiment {
  id: string;
  name: string;
  hypothesis: string;
  metricLabel: string;
  status: "running" | "completed";
  ownerId: string;
  startedLabel: string;
  trafficSplitA: number;
  trafficSplitB: number;
  variantA: VariantSeed;
  variantB: VariantSeed;
}

export const EXPERIMENTS: Experiment[] = [
  {
    id: "exp-checkout",
    name: "Checkout — one-step flow",
    hypothesis: "Collapsing shipping, payment and review into a single step lifts checkout conversion.",
    metricLabel: "Checkout conversion rate",
    status: "running",
    ownerId: "o-rina",
    startedLabel: "Jun 18, 2026",
    trafficSplitA: 50,
    trafficSplitB: 50,
    variantA: {
      label: "Control",
      description: "Existing 3-step checkout",
      segmentsBase30: [
        { id: "desktop", label: "Desktop", visitors: 11800, conversions: 2336 },
        { id: "mobile", label: "Mobile", visitors: 7520, conversions: 1241 },
        { id: "tablet", label: "Tablet", visitors: 2160, conversions: 324 },
      ],
      amp: 0.9,
      phase: 0.3,
      trend: 0.03,
    },
    variantB: {
      label: "Treatment",
      description: "New one-step checkout",
      segmentsBase30: [
        { id: "desktop", label: "Desktop", visitors: 11836, conversions: 2722 },
        { id: "mobile", label: "Mobile", visitors: 7532, conversions: 1431 },
        { id: "tablet", label: "Tablet", visitors: 2152, conversions: 377 },
      ],
      amp: 1.1,
      phase: 1.1,
      trend: 0.05,
    },
  },
  {
    id: "exp-pricing",
    name: "Pricing page — annual toggle default",
    hypothesis: "Defaulting the billing toggle to annual increases trial signups by anchoring on the lower monthly-equivalent price.",
    metricLabel: "Trial signup rate",
    status: "running",
    ownerId: "o-marcus",
    startedLabel: "Jun 24, 2026",
    trafficSplitA: 55,
    trafficSplitB: 45,
    variantA: {
      label: "Control",
      description: "Monthly billing default",
      segmentsBase30: [
        { id: "desktop", label: "Desktop", visitors: 13000, conversions: 1274 },
        { id: "mobile", label: "Mobile", visitors: 8300, conversions: 623 },
        { id: "tablet", label: "Tablet", visitors: 2350, conversions: 162 },
      ],
      amp: 0.5,
      phase: 0.6,
      trend: -0.02,
    },
    variantB: {
      label: "Treatment",
      description: "Annual billing default",
      segmentsBase30: [
        { id: "desktop", label: "Desktop", visitors: 10640, conversions: 915 },
        { id: "mobile", label: "Mobile", visitors: 6770, conversions: 474 },
        { id: "tablet", label: "Tablet", visitors: 1940, conversions: 126 },
      ],
      amp: 0.6,
      phase: 1.4,
      trend: -0.03,
    },
  },
  {
    id: "exp-onboarding",
    name: "Onboarding — guided tour v2",
    hypothesis: "A guided 4-step product tour on first login raises 7-day activation vs. no tour.",
    metricLabel: "7-day activation rate",
    status: "running",
    ownerId: "o-priya",
    startedLabel: "Jul 1, 2026",
    trafficSplitA: 40,
    trafficSplitB: 60,
    variantA: {
      label: "Control",
      description: "No guided tour",
      segmentsBase30: [
        { id: "desktop", label: "Desktop", visitors: 7800, conversions: 2652 },
        { id: "mobile", label: "Mobile", visitors: 6240, conversions: 1841 },
        { id: "tablet", label: "Tablet", visitors: 1560, conversions: 421 },
      ],
      amp: 1.3,
      phase: 0.2,
      trend: 0.02,
    },
    variantB: {
      label: "Treatment",
      description: "4-step guided tour",
      segmentsBase30: [
        { id: "desktop", label: "Desktop", visitors: 11700, conversions: 4856 },
        { id: "mobile", label: "Mobile", visitors: 9360, conversions: 3463 },
        { id: "tablet", label: "Tablet", visitors: 2340, conversions: 784 },
      ],
      amp: 1.6,
      phase: 0.9,
      trend: 0.04,
    },
  },
];

export function experimentById(id: string): Experiment {
  return EXPERIMENTS.find((e) => e.id === id) ?? EXPERIMENTS[0];
}

export function periodDays(period: PeriodId): number {
  return PERIOD_OPTIONS.find((p) => p.id === period)?.days ?? 30;
}

// Scales the authored 30-day segment totals down to the selected window.
// Every derived total is the *sum* of these rows — never stored separately —
// so subtotal === total by construction.
export function segmentsForPeriod(seed: VariantSeed, period: PeriodId): SegmentRow[] {
  const ratio = periodDays(period) / 30;
  return seed.segmentsBase30.map((row) => ({
    ...row,
    visitors: Math.max(1, Math.round(row.visitors * ratio)),
    conversions: Math.max(0, Math.round(row.conversions * ratio)),
  }));
}

export interface SeriesPoint {
  label: string;
  value: number;
}

// Fixed-formula daily series (not random): oscillates around the period's
// aggregate rate using a per-variant sine + linear trend. Coordinates are
// rounded to 2 decimals to stay hydration-safe.
export function seriesForPeriod(seed: VariantSeed, period: PeriodId): SeriesPoint[] {
  const days = periodDays(period);
  const labels = DAY_LABELS_30.slice(30 - days);
  const totals = sumSegments(segmentsForPeriod(seed, period));
  const baseRate = totals.rate;
  return labels.map((label, i) => {
    const absoluteIndex = 30 - days + i;
    const raw =
      baseRate +
      seed.amp * Math.sin((absoluteIndex + seed.phase) * 0.7) +
      seed.trend * (absoluteIndex - 14.5);
    return { label, value: Math.round(Math.max(0, raw) * 100) / 100 };
  });
}
