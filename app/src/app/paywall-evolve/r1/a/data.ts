// Ridgeline — error & performance monitoring for shipping teams.
// Every value below is a fixed literal (no Math.random, no Date.now, no `new Date()`) so the page
// hydrates identically on server and client. Prices are stored as plain dollar numbers; the annual
// tier is always "10 months for 12" (a flat, explainable discount rather than a rounded percentage).

export const BRAND = "Ridgeline";

export const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950";

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/** Formats a dollar amount with a thousands separator, showing cents only when the value isn't a
 * whole dollar (seat math like 190×5/12 doesn't always land on an integer). No Intl — a hand-rolled
 * formatter keeps server and client output byte-identical regardless of runtime locale. */
export function usd(amount: number): string {
  const rounded = Math.round(amount * 100) / 100;
  const whole = Math.trunc(rounded);
  const cents = Math.round((rounded - whole) * 100);
  const withCommas = Math.abs(whole).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const sign = whole < 0 ? "-" : "";
  if (cents === 0) return `$${sign}${withCommas}`;
  return `$${sign}${withCommas}.${cents.toString().padStart(2, "0")}`;
}

/** Formats an event count as a fixed-precision "1.5M" style string. Every pool size in this file is
 * a multiple of 100,000, so one decimal place is always exact — never a rounding artifact. */
export function formatEvents(n: number): string {
  return `${(n / 1_000_000).toFixed(1)}M`;
}

export type BillingPeriod = "monthly" | "annual";
export type PlanId = "pro" | "team";

export const FREE_TIER = {
  projects: 3,
  events: 50_000,
  retentionDays: 7,
  support: "Community forum",
};

export const PLANS: Record<
  PlanId,
  {
    id: PlanId;
    name: string;
    tagline: string;
    seatBased: boolean;
    monthly: number; // per seat, if seatBased
    annual: number; // per seat/yr, if seatBased — always monthly * 10
    minSeats?: number;
    maxSeats?: number;
    defaultSeats?: number;
    baseEvents?: number; // seat-based pool base
    perSeatEvents?: number; // seat-based pool increment
    flatEvents?: number; // flat pool for non-seat plans
    features: string[];
  }
> = {
  pro: {
    id: "pro",
    name: "Pro",
    tagline: "For individual builders shipping solo.",
    seatBased: false,
    monthly: 29,
    annual: 290,
    flatEvents: 1_000_000,
    features: [
      "Unlimited projects",
      "1.0M events / month included",
      "90-day event retention",
      "Email + Slack alerting",
      "Release health & regression tracking",
      "Standard support — 24h response",
    ],
  },
  team: {
    id: "team",
    name: "Team",
    tagline: "For teams who triage together.",
    seatBased: true,
    monthly: 19,
    annual: 190,
    minSeats: 2,
    maxSeats: 40,
    defaultSeats: 6,
    baseEvents: 2_000_000,
    perSeatEvents: 500_000,
    features: [
      "Everything in Pro, plus:",
      "Pooled events scale with seats",
      "Role-based access control",
      "Shared on-call rotations",
      "SSO — SAML & OIDC",
      "Priority support — 4h response",
    ],
  },
};

export type ComparisonCell = boolean | string;

export const COMPARISON_ROWS: Array<{ label: string; free: ComparisonCell; pro: ComparisonCell; team: ComparisonCell }> = [
  { label: "Projects", free: "3", pro: "Unlimited", team: "Unlimited" },
  { label: "Events / month", free: "50,000", pro: "1.0M", team: "From 3.0M, pooled" },
  { label: "Data retention", free: "7 days", pro: "90 days", team: "90 days" },
  { label: "Alerting channels", free: "Email", pro: "Email, Slack, webhooks", team: "Email, Slack, webhooks, PagerDuty" },
  { label: "Role-based access", free: false, pro: false, team: true },
  { label: "SSO — SAML & OIDC", free: false, pro: false, team: true },
  { label: "Support response time", free: "Community forum", pro: "24 hours", team: "4 hours, priority" },
];

export const FAQ_ITEMS: Array<{ q: string; a: string }> = [
  {
    q: "What happens to my data if I don't upgrade?",
    a: "Nothing is deleted. Ingestion pauses until your quota resets at the start of next month, or you upgrade — read access to every event you've already captured continues the whole time.",
  },
  {
    q: "Can I change plans or seat count later?",
    a: "Yes. Move between Pro and Team, or adjust your seat count, at any time. Charges are prorated for the rest of your current billing cycle — you're never charged twice for the same day.",
  },
  {
    q: "Is there a discount for annual billing?",
    a: "Annual billing is priced at 10 months for 12 on every plan — a flat two months free, not a rounded-off percentage.",
  },
  {
    q: "Do unused events roll over?",
    a: "No. Each plan's monthly allowance resets at the start of the cycle and doesn't carry over, so an overage never compounds silently across months.",
  },
  {
    q: "What counts as a Team seat?",
    a: "Any teammate who can trigger alerts, resolve issues, or configure projects. Read-only stakeholders can be invited for free and never consume a seat.",
  },
];

export const TESTIMONIALS: Array<{ quote: string; name: string; role: string; company: string; initials: string }> = [
  {
    quote:
      "We stopped losing an afternoon a week to noisy alerts within the first sprint on Team.",
    name: "Priya Nandakumar",
    role: "Staff Engineer",
    company: "Fieldglass",
    initials: "FG",
  },
  {
    quote: "Ridgeline's release-health view is the first thing we open after every deploy.",
    name: "Tomas Reyes",
    role: "Engineering Manager",
    company: "Northlane",
    initials: "NL",
  },
  {
    quote:
      "Switching from Pro to Team took two minutes, and the seat slider showed the new price before we committed.",
    name: "Elena Kovac",
    role: "Platform Lead",
    company: "Argent Labs",
    initials: "AL",
  },
  {
    quote: "Support answered a production incident in under ten minutes on the priority queue.",
    name: "Sam Whitfield",
    role: "Site Reliability Engineer",
    company: "Beacon Freight",
    initials: "BF",
  },
];

/** Fixed 14-day event-volume mockup for the locked usage panel — hand-authored, not random, so the
 * chart is identical on every render and every environment. Values climb toward the plan cap. */
export const USAGE_SERIES: number[] = [
  2800, 3100, 3400, 3200, 3900, 4300, 4100, 4600, 4800, 4700, 4950, 4980, 5000, 5000,
];
export const USAGE_CAP = 5000; // scaled units — the series and cap share a unit, chart-only
