// Fathomline — product analytics + session replay SaaS. Hard paywall triggered by exceeding the
// Starter plan's monthly tracked-event allowance mid-cycle.
// Every value below is a fixed literal: no Math.random, no Date.now, no `new Date()` — server and
// client always compute the same markup, and moving a slider only ever re-runs pure arithmetic.

export const BRAND = "Fathomline";
export const ACCOUNT_LABEL = "workspace · northfield-analytics";

export const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white";

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/** Whole-dollar currency, thousands-separated by hand (no Intl locale drift between server/client). */
export function usd(n: number): string {
  const s = Math.round(n).toString();
  return `$${s.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}

/** Plain integer, thousands-separated — used for event/seat counts, not currency. */
export function fmt(n: number): string {
  return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export type BillingPeriod = "monthly" | "annual";
export type PlanId = "growth" | "scale";

export interface PlanTier {
  id: PlanId;
  name: string;
  basePrice: number;
  includedEvents: number;
  eventBlockSize: number;
  eventBlockPrice: number;
  includedSeats: number;
  extraSeatPrice: number;
  maxRetentionDays: number;
}

export const PLANS: Record<PlanId, PlanTier> = {
  growth: {
    id: "growth",
    name: "Growth",
    basePrice: 149,
    includedEvents: 2_000_000,
    eventBlockSize: 250_000,
    eventBlockPrice: 18,
    includedSeats: 8,
    extraSeatPrice: 9,
    maxRetentionDays: 30,
  },
  scale: {
    id: "scale",
    name: "Scale",
    basePrice: 449,
    includedEvents: 5_000_000,
    eventBlockSize: 500_000,
    eventBlockPrice: 15,
    includedSeats: 20,
    extraSeatPrice: 7,
    maxRetentionDays: 90,
  },
};

/** Above this monthly volume, Growth stops being recommended even if retention would allow it. */
const GROWTH_EVENTS_CEILING = 5_000_000;

/** Pure arithmetic — deterministic. Retention need dominates: Scale is the only tier past 30 days. */
export function recommendPlan(events: number, retentionDays: number): PlanTier {
  if (retentionDays > PLANS.growth.maxRetentionDays || events > GROWTH_EVENTS_CEILING) {
    return PLANS.scale;
  }
  return PLANS.growth;
}

export function planPrice(plan: PlanTier, events: number, seats: number, billing: BillingPeriod): number {
  const extraEvents = Math.max(0, events - plan.includedEvents);
  const blocks = Math.ceil(extraEvents / plan.eventBlockSize);
  const overage = blocks * plan.eventBlockPrice;
  const extraSeats = Math.max(0, seats - plan.includedSeats);
  const seatCost = extraSeats * plan.extraSeatPrice;
  const monthly = plan.basePrice + overage + seatCost;
  return billing === "annual" ? Math.round(monthly * 0.8) : monthly;
}

export const EVENTS_SLIDER = { min: 100_000, max: 8_000_000, step: 10_000, default: 512_340 };
export const SEATS_RANGE = { min: 1, max: 40, default: 6 };

export const RETENTION_OPTIONS = [
  { days: 3, label: "3 days", note: "Starter" },
  { days: 30, label: "30 days", note: "Growth" },
  { days: 90, label: "90 days", note: "Scale" },
] as const;
export const RETENTION_DEFAULT = 30;

export const CURRENT_USAGE = {
  eventsUsed: 512_340,
  eventsLimit: 500_000,
  overBy: 12_340,
  pausedSince: "Jul 29",
  seatsUsed: 3,
};

export interface UsagePoint {
  label: string;
  value: number;
  paused?: boolean;
}

export const USAGE_WINDOWS: Record<"7d" | "30d" | "90d", UsagePoint[]> = {
  "7d": [
    { label: "Mon", value: 61_400 },
    { label: "Tue", value: 68_900 },
    { label: "Wed", value: 74_200 },
    { label: "Thu", value: 79_600 },
    { label: "Fri", value: 83_100 },
    { label: "Sat", value: 4_200, paused: true },
    { label: "Sun", value: 3_890, paused: true },
  ],
  // Weekly buckets sum to exactly 512,340 — the same figure quoted in the headline above.
  "30d": [
    { label: "Wk 1", value: 71_000 },
    { label: "Wk 2", value: 84_500 },
    { label: "Wk 3", value: 93_200 },
    { label: "Wk 4", value: 108_900 },
    { label: "Wk 5", value: 119_400 },
    { label: "Wk 6", value: 35_340, paused: true },
  ],
  "90d": [
    { label: "P1", value: 198_000 },
    { label: "P2", value: 226_500 },
    { label: "P3", value: 264_800 },
    { label: "P4", value: 301_200 },
    { label: "P5", value: 356_900 },
    { label: "P6", value: 214_640, paused: true },
  ],
};

export const USAGE_WINDOW_TABS: { id: "7d" | "30d" | "90d"; label: string }[] = [
  { id: "7d", label: "7 days" },
  { id: "30d", label: "30 days" },
  { id: "90d", label: "90 days" },
];

export interface ComparisonRow {
  label: string;
  current: string;
  upgraded: string;
}

export const COMPARISON_ROWS: ComparisonRow[] = [
  { label: "Session replay retention", current: "3 days", upgraded: "30 days on Growth" },
  { label: "Team seats included", current: "3 seats", upgraded: "8 seats on Growth" },
  { label: "Data export (CSV & API)", current: "Locked", upgraded: "Unlocked on Growth" },
  { label: "Cohort retention analysis", current: "Locked", upgraded: "Unlocked on Growth" },
];

export const GROWTH_FEATURES = [
  "2,000,000 tracked events included every month",
  "30-day session replay retention",
  "Cohort & retention analysis unlocked",
  "CSV and API data export",
];

export const SCALE_FEATURES = [
  "5,000,000 tracked events included every month",
  "90-day session replay retention",
  "Cohort & retention analysis unlocked",
  "Priority support, dedicated Slack channel",
];

export function planFeatures(id: PlanId): string[] {
  return id === "scale" ? SCALE_FEATURES : GROWTH_FEATURES;
}

export interface FaqItem {
  q: string;
  a: string;
}

export const FAQS: FaqItem[] = [
  {
    q: "What happens to events already tracked?",
    a: "Nothing is lost. Everything captured before the cap is hit stays in your workspace — only new incoming events are paused until reset or upgrade.",
  },
  {
    q: "Does unused event volume roll over?",
    a: "No — the allowance resets to zero at the start of each billing cycle on every plan. Unused volume never carries forward.",
  },
  {
    q: "Can I change seats or retention later?",
    a: "Yes, anytime from Billing settings. Changes apply immediately and are prorated for the rest of the current cycle.",
  },
];

export const TRUST_STAT = "437 teams upgraded from Starter to Growth last quarter.";
