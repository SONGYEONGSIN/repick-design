// Postrail — transactional email delivery paywall, contextual "you've hit your send cap" trigger.
// Every value below is a fixed literal: no Math.random, no Date.now, no `new Date()`. Nothing here
// derives from the clock or a PRNG at render time, so server and client markup always match.

export const BRAND = "Postrail";
export const WORKSPACE_LABEL = "northlight-labs";

export const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950";

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/** Whole-dollar currency, thousands-separated by hand (no Intl locale drift between server/client). */
export function usd(n: number): string {
  const s = Math.trunc(n).toString();
  return `$${s.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}

/** Plain integer, thousands-separated — used for send counts, not currency. */
export function fmt(n: number): string {
  return Math.trunc(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export type BillingPeriod = "monthly" | "annual";
export type PlanId = "starter" | "growth" | "scale";

export interface PlanTier {
  id: PlanId;
  name: string;
  monthlyPrice: number;
  /** Effective per-month price when billed annually. */
  annualMonthlyPrice: number;
  sendsIncluded: number;
  domains: string;
  support: string;
  retention: string;
  dedicatedIp: string;
}

export const PLANS: PlanTier[] = [
  {
    id: "starter",
    name: "Starter",
    monthlyPrice: 29,
    annualMonthlyPrice: 24,
    sendsIncluded: 50000,
    domains: "1 sending domain",
    support: "Community forum",
    retention: "3-day log retention",
    dedicatedIp: "Not available",
  },
  {
    id: "growth",
    name: "Growth",
    monthlyPrice: 129,
    annualMonthlyPrice: 103,
    sendsIncluded: 250000,
    domains: "5 sending domains",
    support: "Priority, under 2h",
    retention: "30-day log retention",
    dedicatedIp: "Available as add-on",
  },
  {
    id: "scale",
    name: "Scale",
    monthlyPrice: 349,
    annualMonthlyPrice: 279,
    sendsIncluded: 1000000,
    domains: "Unlimited domains",
    support: "Dedicated CSM",
    retention: "90-day log retention",
    dedicatedIp: "Included",
  },
];

export const RECOMMENDED_PLAN_ID: PlanId = "growth";

export function getPlan(id: PlanId): PlanTier {
  return PLANS.find((p) => p.id === id) ?? PLANS[1];
}

export function planPrice(plan: PlanTier, billing: BillingPeriod): number {
  return billing === "monthly" ? plan.monthlyPrice : plan.annualMonthlyPrice;
}

export const CURRENT_USAGE = {
  planId: "starter" as PlanId,
  sendsUsed: 50000,
  sendsLimit: 50000,
  resetsIn: "9 days",
};

/** Pure arithmetic tier recommendation from a projected monthly send volume — deterministic. */
export function recommendPlanId(sends: number): PlanId {
  if (sends <= PLANS[0].sendsIncluded) return "starter";
  if (sends <= PLANS[1].sendsIncluded) return "growth";
  return "scale";
}

export const VOLUME_SLIDER = {
  min: 10000,
  max: 1200000,
  step: 10000,
  default: 220000,
};

export interface BlockedCategory {
  label: string;
  queued: number;
  avgDelayHours: number;
}

export const BLOCKED_CATEGORIES: BlockedCategory[] = [
  { label: "Password resets", queued: 412, avgDelayHours: 6 },
  { label: "Order receipts", queued: 501, avgDelayHours: 14 },
  { label: "Account alerts", queued: 371, avgDelayHours: 21 },
];

export const TOTAL_QUEUED = BLOCKED_CATEGORIES.reduce((sum, c) => sum + c.queued, 0);
export const AVG_DELAY_HOURS = Math.round(
  BLOCKED_CATEGORIES.reduce((sum, c) => sum + c.avgDelayHours * c.queued, 0) / TOTAL_QUEUED,
);

/** Emails newly queued per day, last 7 days — trend evidence for the "why blocked" module. */
export const DAILY_QUEUED = [
  { day: "Mon", count: 140 },
  { day: "Tue", count: 165 },
  { day: "Wed", count: 158 },
  { day: "Thu", count: 190 },
  { day: "Fri", count: 205 },
  { day: "Sat", count: 96 },
  { day: "Sun", count: 130 },
];

export interface CompareField {
  key: string;
  label: string;
  get: (plan: PlanTier, billing: BillingPeriod) => string;
}

export const COMPARE_FIELDS: CompareField[] = [
  { key: "price", label: "Price", get: (p, billing) => `${usd(planPrice(p, billing))} / mo` },
  { key: "sends", label: "Monthly sends included", get: (p) => fmt(p.sendsIncluded) },
  { key: "domains", label: "Sending domains", get: (p) => p.domains },
  { key: "support", label: "Support", get: (p) => p.support },
  { key: "retention", label: "Log retention", get: (p) => p.retention },
  { key: "ip", label: "Dedicated IP", get: (p) => p.dedicatedIp },
];
