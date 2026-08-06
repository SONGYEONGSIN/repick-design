// Deterministic content for the Portside careers page. No randomness, no dates computed at
// render time — every string here is fixed so the route hydrates identically on server and client.

export interface Role {
  id: string;
  title: string;
  team: string;
  location: string;
  employment: "Full-time" | "Contract";
  level: string;
  blurb: string;
  duties: string[];
}

export const ROLES: Role[] = [
  {
    id: "staff-platform-eng",
    title: "Staff Engineer, Platform",
    team: "Engineering",
    location: "Remote (Global)",
    employment: "Full-time",
    level: "Staff",
    blurb:
      "Own the matching engine that pairs open trailers with shippers in under four minutes.",
    duties: [
      "Design the ranking service that scores carrier-shipper matches in real time",
      "Set technical direction for the platform team's next two planning cycles",
      "Pair with mid-level engineers on the hardest reliability problems",
    ],
  },
  {
    id: "senior-backend-eng",
    title: "Senior Backend Engineer",
    team: "Engineering",
    location: "Remote (Global)",
    employment: "Full-time",
    level: "Senior",
    blurb: "Build the load-tracking APIs that carriers hit from the road, on spotty signal.",
    duties: [
      "Ship and own services in the load-lifecycle API",
      "Improve mobile-network resilience for carrier check-ins",
      "Review design docs and pull requests from two junior engineers",
    ],
  },
  {
    id: "frontend-eng",
    title: "Frontend Engineer",
    team: "Engineering",
    location: "Remote (Global)",
    employment: "Full-time",
    level: "Mid",
    blurb: "Build the dispatcher console that shipping coordinators use every morning.",
    duties: [
      "Build dispatcher-facing views on top of our internal component library",
      "Work directly with three dispatch teams to shape the roadmap",
      "Instrument and improve page load times on low-bandwidth connections",
    ],
  },
  {
    id: "product-designer",
    title: "Product Designer",
    team: "Design",
    location: "New York, NY",
    employment: "Full-time",
    level: "Senior",
    blurb: "Design the booking flow that shippers use to move freight in under a minute.",
    duties: [
      "Own end-to-end design for the shipper booking flow",
      "Run usability sessions with carriers and shippers each sprint",
      "Maintain the shared design system alongside two other designers",
    ],
  },
  {
    id: "data-analyst",
    title: "Data Analyst, Marketplace",
    team: "Data",
    location: "Singapore",
    employment: "Full-time",
    level: "Mid",
    blurb: "Track lane-level supply and demand to help pricing stay honest.",
    duties: [
      "Build dashboards that track match rate and time-to-cover by lane",
      "Partner with pricing on weekly rate recommendations",
      "Audit matching-model outputs for regional bias",
    ],
  },
  {
    id: "account-executive",
    title: "Account Executive",
    team: "Sales",
    location: "Berlin, DE",
    employment: "Full-time",
    level: "Mid",
    blurb: "Bring mid-size shippers onto Portside across the DACH region.",
    duties: [
      "Own a book of mid-market shipper accounts across DACH",
      "Run the full sales cycle from first call to signed contract",
      "Feed field feedback back to product weekly",
    ],
  },
  {
    id: "sales-development-rep",
    title: "Sales Development Representative",
    team: "Sales",
    location: "New York, NY",
    employment: "Full-time",
    level: "Entry",
    blurb: "Open the first conversation with shippers who are still booking freight by phone.",
    duties: [
      "Qualify inbound interest from shippers and carriers",
      "Book discovery calls for the account executive team",
      "Keep the CRM clean enough that forecasting actually works",
    ],
  },
  {
    id: "support-specialist",
    title: "Customer Support Specialist",
    team: "Support",
    location: "Remote (Global)",
    employment: "Full-time",
    level: "Entry",
    blurb: "Answer the carrier on the side of the highway whose app just froze.",
    duties: [
      "Resolve carrier and shipper tickets across chat and phone",
      "Escalate recurring issues to engineering with clear repro steps",
      "Keep the help center accurate as features ship",
    ],
  },
  {
    id: "support-team-lead",
    title: "Support Team Lead",
    team: "Support",
    location: "Singapore",
    employment: "Full-time",
    level: "Lead",
    blurb: "Build the APAC support shift from three people to a full team.",
    duties: [
      "Hire and coach the first APAC support cohort",
      "Set staffing and escalation coverage for APAC hours",
      "Report weekly on ticket volume and resolution time to leadership",
    ],
  },
  {
    id: "ops-coordinator",
    title: "Operations Coordinator",
    team: "Operations",
    location: "Berlin, DE",
    employment: "Contract",
    level: "Entry",
    blurb: "Keep carrier onboarding paperwork moving so trucks aren't sitting idle.",
    duties: [
      "Process carrier compliance documents within same-day SLA",
      "Chase down missing insurance and safety paperwork",
      "Flag onboarding bottlenecks to the operations lead",
    ],
  },
];

export type TierKey = "us" | "intl" | "contract";

export interface TierMeta {
  key: TierKey;
  label: string;
  shortLabel: string;
}

export const TIERS: TierMeta[] = [
  { key: "us", label: "Full-time — US", shortLabel: "US FT" },
  { key: "intl", label: "Full-time — Remote / Intl.", shortLabel: "Intl. FT" },
  { key: "contract", label: "Contract", shortLabel: "Contract" },
];

export interface BenefitCell {
  rank: 0 | 1 | 2 | 3;
  label: string;
  detail: string;
}

export interface BenefitRow {
  id: string;
  category: string;
  cells: Record<TierKey, BenefitCell>;
}

// rank: 0 not offered, 1 partial, 2 standard, 3 premium — drives both the sort order and the
// icon shown, so ranking is never conveyed by color alone.
export const BENEFIT_ROWS: BenefitRow[] = [
  {
    id: "health",
    category: "Health coverage",
    cells: {
      us: { rank: 3, label: "Full", detail: "100% of premiums covered, day one" },
      intl: { rank: 3, label: "Full", detail: "Local plan, 100% covered" },
      contract: { rank: 1, label: "Partial", detail: "$200/month toward a private plan" },
    },
  },
  {
    id: "equity",
    category: "Equity grant",
    cells: {
      us: { rank: 3, label: "Standard", detail: "Grant at hire, refresh at year two" },
      intl: { rank: 3, label: "Standard", detail: "Grant at hire, refresh at year two" },
      contract: { rank: 0, label: "None", detail: "Not offered on contract terms" },
    },
  },
  {
    id: "pto",
    category: "Paid time off",
    cells: {
      us: { rank: 2, label: "Standard", detail: "Unlimited, 15-day minimum encouraged" },
      intl: { rank: 3, label: "Full", detail: "Statutory plus 10 company days" },
      contract: { rank: 1, label: "Partial", detail: "Prorated by contract length" },
    },
  },
  {
    id: "remote-stipend",
    category: "Remote work stipend",
    cells: {
      us: { rank: 2, label: "Standard", detail: "$75 per month, home office" },
      intl: { rank: 2, label: "Standard", detail: "$75 per month, home office" },
      contract: { rank: 0, label: "None", detail: "Not offered on contract terms" },
    },
  },
  {
    id: "parental-leave",
    category: "Parental leave",
    cells: {
      us: { rank: 3, label: "Full", detail: "20 weeks paid, all parents" },
      intl: { rank: 3, label: "Full", detail: "Statutory plus top-up to 20 weeks" },
      contract: { rank: 0, label: "None", detail: "Not offered on contract terms" },
    },
  },
  {
    id: "retirement",
    category: "Retirement match",
    cells: {
      us: { rank: 2, label: "Standard", detail: "4% 401(k) match" },
      intl: { rank: 2, label: "Standard", detail: "Local pension contribution match" },
      contract: { rank: 0, label: "None", detail: "Not offered on contract terms" },
    },
  },
];
