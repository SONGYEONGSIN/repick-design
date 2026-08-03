// Meridian — booking & scheduling infrastructure for service businesses (salons, clinics, studios).
// Paywall trigger: the account has used its entire monthly booking allowance on the Solo plan.
// Every value below is a fixed literal — no Math.random, no Date.now, no `new Date()` — so server
// and client render byte-identical markup and the page hydrates without drift.

export const BRAND = "Meridian";
export const ACCOUNT_LABEL = "hello@fernandclay.com";

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/** Whole-dollar currency, thousands-separated by hand (no Intl locale drift between server/client). */
export function usd(n: number): string {
  const s = Math.trunc(Math.abs(n)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${n < 0 ? "-" : ""}$${s}`;
}

/** Plain integer, thousands-separated — used for counts, not currency. */
export function fmt(n: number): string {
  return Math.trunc(Math.abs(n)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export type BillingPeriod = "monthly" | "annual";
export type PlanId = "solo" | "studio" | "scale";

export interface PlanTier {
  id: PlanId;
  name: string;
  tagline: string;
  monthlyPrice: number;
  /** Effective per-month price when billed annually — always 10 months for 12. */
  annualMonthlyPrice: number;
  maxCalendars: number;
  bookingsIncluded: number;
  smsReminders: string;
  support: string;
  reporting: string;
  features: string[];
}

export const PLANS: PlanTier[] = [
  {
    id: "solo",
    name: "Solo",
    tagline: "One calendar, kept simple.",
    monthlyPrice: 29,
    annualMonthlyPrice: 24,
    maxCalendars: 1,
    bookingsIncluded: 500,
    smsReminders: "Not included",
    support: "Email, 48h response",
    reporting: "Basic — bookings & no-shows",
    features: [
      "1 staff calendar",
      "500 bookings / month",
      "Online booking page",
      "Email confirmations",
    ],
  },
  {
    id: "studio",
    name: "Studio",
    tagline: "For teams juggling several calendars.",
    monthlyPrice: 79,
    annualMonthlyPrice: 63,
    maxCalendars: 8,
    bookingsIncluded: 2500,
    smsReminders: "Included",
    support: "Priority chat, 4h response",
    reporting: "Advanced — by staff & service",
    features: [
      "Up to 8 staff calendars",
      "2,500 bookings / month",
      "SMS + email reminders",
      "No-show deposit holds",
      "Advanced booking reports",
    ],
  },
  {
    id: "scale",
    name: "Scale",
    tagline: "For multi-location operations.",
    monthlyPrice: 249,
    annualMonthlyPrice: 199,
    maxCalendars: 40,
    bookingsIncluded: 10000,
    smsReminders: "Included, custom sender ID",
    support: "Dedicated account manager",
    reporting: "Advanced + API export",
    features: [
      "Up to 40 staff calendars",
      "10,000 bookings / month",
      "Multi-location routing",
      "SMS with custom sender ID",
      "Dedicated account manager",
      "API export for reporting",
    ],
  },
];

export function getPlan(id: PlanId): PlanTier {
  return PLANS.find((p) => p.id === id) ?? PLANS[0];
}

export function planPrice(plan: PlanTier, billing: BillingPeriod): number {
  return billing === "monthly" ? plan.monthlyPrice : plan.annualMonthlyPrice;
}

export const CURRENT_USAGE = {
  planId: "solo" as PlanId,
  bookingsUsed: 500,
  bookingsLimit: 500,
  calendarsUsed: 1,
  resetsIn: "9 days",
};

export const AVG_BOOKING_VALUE = 63;
export const BLOCKED_BOOKINGS_COUNT = 34;
export const BLOCKED_WINDOW = "the last 9 days";
export const MISSED_VALUE = AVG_BOOKING_VALUE * BLOCKED_BOOKINGS_COUNT; // 2,142

/** Daily booking requests over the last 14 days against a derived daily capacity line
 * (500 / 28-day cycle ≈ 18/day). Hand-authored so the chart renders identically everywhere. */
export const DAILY_CAP = 18;
export const USAGE_SERIES: number[] = [11, 12, 13, 14, 13, 15, 16, 15, 17, 18, 17, 19, 20, 19];

export interface BlockedRequest {
  client: string;
  service: string;
  requested: string;
  staff: string;
}

export const BLOCKED_REQUESTS: BlockedRequest[] = [
  { client: "R. Alvarez", service: "Deep tissue, 60 min", requested: "Tomorrow, 2:00 PM", staff: "Jordan M." },
  { client: "T. Whitfield", service: "Sports recovery, 90 min", requested: "Thu, 10:30 AM", staff: "Priya K." },
  { client: "M. Chen", service: "Prenatal, 60 min", requested: "Fri, 4:15 PM", staff: "Jordan M." },
  { client: "L. Ferreira", service: "Couples session, 90 min", requested: "Sat, 1:00 PM", staff: "Any available" },
];

/** Recommends a tier from a projected calendar count and monthly booking volume. Pure — the same
 * inputs always resolve to the same plan, so the calculator has no hidden state. */
export function recommendPlanId(calendars: number, bookings: number): PlanId {
  const solo = getPlan("solo");
  const studio = getPlan("studio");
  if (calendars <= solo.maxCalendars && bookings <= solo.bookingsIncluded) return "solo";
  if (calendars <= studio.maxCalendars && bookings <= studio.bookingsIncluded) return "studio";
  return "scale";
}

export const CALENDAR_SLIDER = { min: 1, max: 40, step: 1, default: 4 };
export const BOOKING_SLIDER = { min: 100, max: 10000, step: 100, default: 2800 };

export interface CompareField {
  key: string;
  label: string;
  get: (plan: PlanTier, billing: BillingPeriod) => string;
}

export const COMPARE_FIELDS: CompareField[] = [
  { key: "price", label: "Price", get: (p, billing) => `${usd(planPrice(p, billing))} / mo` },
  { key: "calendars", label: "Staff calendars", get: (p) => `Up to ${p.maxCalendars}` },
  { key: "bookings", label: "Bookings / month", get: (p) => fmt(p.bookingsIncluded) },
  { key: "sms", label: "SMS reminders", get: (p) => p.smsReminders },
  { key: "support", label: "Support", get: (p) => p.support },
  { key: "reporting", label: "Reporting", get: (p) => p.reporting },
];

export interface FaqItem {
  q: string;
  a: string;
}

export const FAQS: FaqItem[] = [
  {
    q: "What happens to bookings already on the calendar?",
    a: "Nothing changes for confirmed bookings. Only new booking requests are paused once you hit the monthly limit, until the cycle resets or you upgrade.",
  },
  {
    q: "Do unused bookings roll over to next month?",
    a: "No — the allowance resets to zero at the start of each billing cycle on every plan. Unused capacity never carries forward.",
  },
  {
    q: "Can I change my calendar count or plan later?",
    a: "Yes, anytime from Billing settings. Changes are prorated for the rest of your current cycle, so you're never charged twice for the same day.",
  },
  {
    q: "Is there a discount for annual billing?",
    a: "Annual billing is priced at 10 months for 12 on every plan — a flat two months free, not a rounded-off percentage.",
  },
  {
    q: "What counts as a staff calendar?",
    a: "Any staff member or resource (a room, a chair) that clients can book independently. Calendars used only for internal blocking don't count.",
  },
];
