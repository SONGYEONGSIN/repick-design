// Hopwire — contextual "you've hit your limit" paywall data.
// Every value below is a fixed literal: no Math.random, no Date.now, no `new Date()`. Nothing here
// derives from the clock or a PRNG at render time, so server and client markup always match.

export const BRAND = "Hopwire";
export const ACCOUNT_LABEL = "ops@northfield.io";

export const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950";

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/** Whole-dollar currency, thousands-separated by hand (no Intl locale drift between server/client). */
export function usd(n: number): string {
  const s = Math.trunc(n).toString();
  return `$${s.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}

/** Plain integer, thousands-separated — used for run counts, not currency. */
export function fmt(n: number): string {
  return Math.trunc(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export type BillingPeriod = "monthly" | "annual";
export type PlanId = "starter" | "team" | "scale";

export interface PlanTier {
  id: PlanId;
  name: string;
  monthlyPrice: number;
  /** Effective per-month price when billed annually. */
  annualMonthlyPrice: number;
  runsIncluded: number;
  workflows: string;
  seats: string;
  support: string;
  sso: string;
  webhooks: string;
  apiRateLimit: string;
}

export const PLANS: PlanTier[] = [
  {
    id: "starter",
    name: "Starter",
    monthlyPrice: 29,
    annualMonthlyPrice: 24,
    runsIncluded: 10000,
    workflows: "Up to 3",
    seats: "1",
    support: "Community",
    sso: "Not included",
    webhooks: "5 endpoints",
    apiRateLimit: "60 req / min",
  },
  {
    id: "team",
    name: "Team",
    monthlyPrice: 79,
    annualMonthlyPrice: 63,
    runsIncluded: 50000,
    workflows: "Unlimited",
    seats: "Up to 10",
    support: "Priority, under 2h",
    sso: "Included",
    webhooks: "50 endpoints",
    apiRateLimit: "600 req / min",
  },
  {
    id: "scale",
    name: "Scale",
    monthlyPrice: 249,
    annualMonthlyPrice: 199,
    runsIncluded: 250000,
    workflows: "Unlimited",
    seats: "Unlimited",
    support: "Dedicated CSM",
    sso: "Included",
    webhooks: "Unlimited",
    apiRateLimit: "3,000 req / min",
  },
];

export const RECOMMENDED_PLAN_ID: PlanId = "team";

export function getPlan(id: PlanId): PlanTier {
  return PLANS.find((p) => p.id === id) ?? PLANS[1];
}

export function planPrice(plan: PlanTier, billing: BillingPeriod): number {
  return billing === "monthly" ? plan.monthlyPrice : plan.annualMonthlyPrice;
}

export const CURRENT_USAGE = {
  planId: "starter" as PlanId,
  runsUsed: 10000,
  runsLimit: 10000,
  resetsIn: "6 days",
};

export const TEAM_FEATURES = [
  "50,000 automation runs every month",
  "Unlimited workflows, no per-flow cap",
  "Up to 10 team seats included",
  "Priority support, under 2 hour response",
  "SSO & audit log",
];

export const WORKFLOW_STEPS = ["Trigger", "Filter", "Action"] as const;

/** Recommends a tier from a projected monthly run count. Pure arithmetic — deterministic. */
export function recommendPlanId(runs: number): PlanId {
  if (runs <= PLANS[0].runsIncluded) return "starter";
  if (runs <= PLANS[1].runsIncluded) return "team";
  return "scale";
}

export const WORKLOAD_SLIDER = {
  min: 5000,
  max: 300000,
  step: 5000,
  default: 42000,
};

export interface CompareField {
  key: string;
  label: string;
  get: (plan: PlanTier, billing: BillingPeriod) => string;
}

export const COMPARE_FIELDS: CompareField[] = [
  { key: "price", label: "Price", get: (p, billing) => `${usd(planPrice(p, billing))} / mo` },
  { key: "runs", label: "Automation runs / month", get: (p) => fmt(p.runsIncluded) },
  { key: "workflows", label: "Workflows", get: (p) => p.workflows },
  { key: "seats", label: "Team seats", get: (p) => p.seats },
  { key: "support", label: "Support", get: (p) => p.support },
  { key: "sso", label: "SSO & audit log", get: (p) => p.sso },
  { key: "webhooks", label: "Webhook endpoints", get: (p) => p.webhooks },
  { key: "api", label: "API rate limit", get: (p) => p.apiRateLimit },
];

export interface FaqItem {
  q: string;
  a: string;
}

export const FAQS: FaqItem[] = [
  {
    q: "What happens to automations that were already running?",
    a: "Anything already in progress finishes normally. Only new automation runs are paused until your next billing cycle or an upgrade.",
  },
  {
    q: "Do unused runs roll over to next month?",
    a: "No — usage resets to zero at the start of each billing cycle, on Starter, Team, and Scale alike. Unused runs never carry forward.",
  },
  {
    q: "Can I downgrade after upgrading to Team?",
    a: "Yes, anytime from Billing settings. You keep full Team access through the end of the cycle you already paid for.",
  },
  {
    q: "Is there a trial for the Team plan?",
    a: "Team includes a 14-day trial. You're only charged if you keep it past day 14, and you can cancel from Billing before then.",
  },
  {
    q: "What counts as one automation run?",
    a: "Each time a workflow completes its trigger-to-action chain counts as one run, whether the outcome succeeds or fails.",
  },
];

export interface Testimonial {
  initials: string;
  name: string;
  role: string;
  quote: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    initials: "MK",
    name: "Priya Nandakumar",
    role: "Ops lead, Fernbrook Logistics",
    quote:
      "We hit the Starter ceiling in our second month. Team's priority support caught a broken webhook before it cost us a shipment.",
  },
  {
    initials: "DV",
    name: "Owen Castellanos",
    role: "RevOps manager, Baltrix",
    quote: "Unlimited workflows meant we stopped rationing which processes got automated. It paid for itself in the first week.",
  },
  {
    initials: "SL",
    name: "Hana Bergström",
    role: "Founder, Lindqvist Studio",
    quote: "SSO and the audit log were the two things blocking procurement sign-off. Both shipped with Team, no add-on needed.",
  },
];
