// Deterministic dummy data for the Reeve Calloway / Fieldwork profile candidate.
// No Math.random / Date.now / new Date anywhere — every value below is a fixed literal so
// server and client render identically (hydration-safe).

export type Discipline = "Onboarding" | "Conversion" | "Retention" | "Systems";
export type EngagementType = "Fixed-price" | "Retainer" | "Audit";

export type CaseStudy = {
  id: string;
  title: string;
  client: string;
  clientContext: string;
  discipline: Discipline;
  engagementType: EngagementType;
  durationWeeks: number;
  durationLabel: string;
  year: number;
  impactLabel: string;
  impactValue: string;
  impactScore: number; // internal 0-100 weight used only for the "Highest impact" sort
  summary: string;
  approach: string;
  metrics: { metric: string; before: string; after: string }[];
  testimonial: { quote: string; attribution: string };
};

export const PROFILE = {
  name: "Reeve Calloway",
  handle: "reeve-calloway",
  title: "Senior Product & Growth Designer",
  platform: "Fieldwork",
  location: "Remote · GMT-5",
  availability: "Available for new engagements",
  bio: "I partner with growth-stage product teams on the handful of screens that decide whether a signup activates, a trial converts, or a subscriber churns. Eight years in, most of my work is fixed-scope: a funnel, a flow, or a design system, in under twelve weeks.",
  specialties: ["Activation flows", "Checkout & billing UX", "Design systems", "Retention loops"],
};

export const STATS = {
  rating: 4.9,
  ratingCount: 52,
  completedEngagements: 58,
  responseTime: "Under 2 hrs",
  onTimeRate: 96,
  yearsOnPlatform: "6 yrs",
} as const;

export const DISCIPLINES: Discipline[] = ["Onboarding", "Conversion", "Retention", "Systems"];
export const ENGAGEMENT_TYPES: EngagementType[] = ["Fixed-price", "Retainer", "Audit"];

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: "northline",
    title: "Rebuilding the first-run flow",
    client: "Northline Analytics",
    clientContext: "B2B SaaS · Series B",
    discipline: "Onboarding",
    engagementType: "Fixed-price",
    durationWeeks: 6,
    durationLabel: "6 weeks",
    year: 2025,
    impactLabel: "Activation rate",
    impactValue: "+31%",
    impactScore: 91,
    summary:
      "New workspaces were abandoning setup before connecting a data source. The signup form and the first dashboard were designed by different teams a year apart and never reconciled.",
    approach:
      "Mapped every drop-off between account creation and first chart render, cut the setup wizard from 7 steps to 3, and moved data-source connection ahead of workspace naming.",
    metrics: [
      { metric: "7-day activation", before: "42%", after: "73%" },
      { metric: "Setup steps", before: "7", after: "3" },
      { metric: "Time to first chart", before: "14 min", after: "4 min" },
    ],
    testimonial: {
      quote: "Reeve found the drop-off we'd been guessing at for two quarters inside the first week.",
      attribution: "VP Product, Northline Analytics",
    },
  },
  {
    id: "ferro",
    title: "Rewriting the signup funnel copy and layout",
    client: "Ferro Health",
    clientContext: "Digital health · Seed",
    discipline: "Conversion",
    engagementType: "Retainer",
    durationWeeks: 12,
    durationLabel: "12 weeks",
    year: 2025,
    impactLabel: "Signup conversion",
    impactValue: "+18%",
    impactScore: 76,
    summary:
      "Paid traffic was converting well on the landing page but stalling at a three-field intake form that read like an insurance claim.",
    approach:
      "Split the intake form across a short pre-qualification step and a deferred detail step, and ran four rounds of layout tests against the existing funnel as a control.",
    metrics: [
      { metric: "Form completion", before: "38%", after: "56%" },
      { metric: "Fields before signup", before: "11", after: "4" },
    ],
    testimonial: {
      quote: "We stopped losing people to the form itself, which is exactly the problem we hired for.",
      attribution: "Head of Growth, Ferro Health",
    },
  },
  {
    id: "basalt",
    title: "Diagnosing a slow post-trial churn leak",
    client: "Basalt Freight",
    clientContext: "Logistics · Growth-stage",
    discipline: "Retention",
    engagementType: "Audit",
    durationWeeks: 3,
    durationLabel: "3 weeks",
    year: 2024,
    impactLabel: "90-day churn",
    impactValue: "-9 pts",
    impactScore: 64,
    summary:
      "Churn looked flat month over month but was concentrated entirely in a single dispatcher persona who never re-opened the mobile app after week two.",
    approach:
      "Audited notification timing and in-app prompts against usage cohorts, then handed over a scoped fix list ranked by estimated recovery.",
    metrics: [
      { metric: "Dispatcher 90-day churn", before: "34%", after: "25%" },
      { metric: "Week-2 app reopen rate", before: "29%", after: "51%" },
    ],
    testimonial: {
      quote: "The audit paid for itself before we'd shipped a single line of the fix list.",
      attribution: "Founder, Basalt Freight",
    },
  },
  {
    id: "ridge",
    title: "Consolidating three component libraries",
    client: "Ridge & Co",
    clientContext: "Fintech · Series A",
    discipline: "Systems",
    engagementType: "Fixed-price",
    durationWeeks: 8,
    durationLabel: "8 weeks",
    year: 2024,
    impactLabel: "Design debt",
    impactValue: "-40%",
    impactScore: 58,
    summary:
      "Three product squads had each grown their own button, input, and table components after a rushed merger, and nothing matched at the seams.",
    approach:
      "Audited all three libraries for near-duplicate components, defined a single token set, and migrated the highest-traffic 30 screens first as proof before handing off a migration guide.",
    metrics: [
      { metric: "Duplicate components", before: "146", after: "58" },
      { metric: "Screens on shared tokens", before: "0", after: "30" },
    ],
    testimonial: {
      quote: "Our engineers finally stopped asking which button was the real one.",
      attribution: "Design Lead, Ridge & Co",
    },
  },
  {
    id: "loam",
    title: "Cutting time-to-first-value for fleet operators",
    client: "Loam Robotics",
    clientContext: "Hardware/software · Series B",
    discipline: "Onboarding",
    engagementType: "Retainer",
    durationWeeks: 10,
    durationLabel: "10 weeks",
    year: 2024,
    impactLabel: "Time-to-first-value",
    impactValue: "-52%",
    impactScore: 88,
    summary:
      "New fleet operators needed a technician on-site to get past the pairing screen, which throttled every sales-qualified lead into a scheduling queue.",
    approach:
      "Redesigned device pairing around a guided in-app flow with fallback diagnostics, tested against the existing technician-led process with the same cohort of new accounts.",
    metrics: [
      { metric: "Time to first fleet report", before: "9.5 days", after: "4.6 days" },
      { metric: "Pairings needing a technician", before: "81%", after: "22%" },
    ],
    testimonial: {
      quote: "Sales stopped apologizing for the onboarding wait time in every close call.",
      attribution: "COO, Loam Robotics",
    },
  },
  {
    id: "verity",
    title: "Shortening the quote-to-bind path",
    client: "Verity Insurance",
    clientContext: "InsurTech · Growth-stage",
    discipline: "Conversion",
    engagementType: "Fixed-price",
    durationWeeks: 5,
    durationLabel: "5 weeks",
    year: 2023,
    impactLabel: "Quote completion",
    impactValue: "+24%",
    impactScore: 70,
    summary:
      "Quotes were accurate but the multi-page flow re-asked for information the user had already given on the marketing site.",
    approach:
      "Pre-filled the quote flow from marketing-site inputs, replaced a 9-page wizard with a 3-page one, and kept a running price estimate visible throughout.",
    metrics: [
      { metric: "Quote-to-bind completion", before: "22%", after: "46%" },
      { metric: "Quote pages", before: "9", after: "3" },
    ],
    testimonial: {
      quote: "The running price estimate alone cut our abandonment calls in half.",
      attribution: "Product Manager, Verity Insurance",
    },
  },
  {
    id: "cascade",
    title: "Rebuilding the post-course re-engagement loop",
    client: "Cascade Learning",
    clientContext: "EdTech · Series A",
    discipline: "Retention",
    engagementType: "Retainer",
    durationWeeks: 14,
    durationLabel: "14 weeks",
    year: 2023,
    impactLabel: "90-day retention",
    impactValue: "+15 pts",
    impactScore: 81,
    summary:
      "Learners finished their first course and simply didn't come back — there was no next step designed for them, only a generic catalog page.",
    approach:
      "Built a completion-to-next-course recommendation surface and a re-engagement email sequence, then A/B tested both against the existing catalog redirect.",
    metrics: [
      { metric: "90-day retention", before: "31%", after: "46%" },
      { metric: "Second course starts", before: "18%", after: "39%" },
    ],
    testimonial: {
      quote: "We finally had a second course to point people to, not just a bigger catalog.",
      attribution: "Head of Product, Cascade Learning",
    },
  },
  {
    id: "anchorline",
    title: "Scoping a shared token system before a rebrand",
    client: "Anchorline Payments",
    clientContext: "Fintech · Seed",
    discipline: "Systems",
    engagementType: "Audit",
    durationWeeks: 4,
    durationLabel: "4 weeks",
    year: 2023,
    impactLabel: "Component reuse",
    impactValue: "+65%",
    impactScore: 55,
    summary:
      "A rebrand was scheduled in two months and the existing UI had no shared spacing or color tokens to retarget, only one-off values baked into each screen.",
    approach:
      "Inventoried every color, spacing, and type value in the live product, mapped them to a proposed token set, and delivered a component-by-component migration order.",
    metrics: [
      { metric: "Components on shared tokens", before: "12%", after: "77%" },
      { metric: "One-off color values", before: "94", after: "16" },
    ],
    testimonial: {
      quote: "The audit turned our rebrand from a redesign into a token swap.",
      attribution: "Design Manager, Anchorline Payments",
    },
  },
];

export function formatOrdinalCount(n: number): string {
  return n.toLocaleString("en-US");
}
