// Static, deterministic data for the "Signal & Noise" creator profile.
// No Math.random / Date.now / new Date() anywhere per page-brief-core §2 — every number below is a
// fixed seed value so the page renders identically on every request and every gate run.

export const PLATFORM_NAME = "Ridgeline";

export const CREATOR = {
  name: "Priya Anand",
  handle: "@priya.anand",
  initials: "PA",
  newsletter: "Signal & Noise",
  bio: "I turn messy product data into decisions your team can actually ship. Weekly essays on analytics, instrumentation, and building data-literate teams.",
  tags: ["Product Analytics", "Data Careers", "SaaS Metrics"],
  email: "priya@signalandnoise.co",
  website: "signalandnoise.co",
};

// Base reach numbers before any client-side interaction. The "Follow" toggle adds/removes exactly
// one from `subscribers` — the rest stay fixed, since they aren't affected by a single visitor.
export const STATS_BASE = {
  subscribers: 18420,
  paidMembers: 1860,
  posts: 142,
  openRate: 61,
};

export type PostAccess = "free" | "member";

export type Post = {
  id: string;
  title: string;
  dateLabel: string;
  dateISO: string;
  tag: string;
  access: PostAccess;
  minutes: number;
  excerptShort: string;
  excerptFull: string;
};

export const POSTS: Post[] = [
  {
    id: "p1",
    title: "Why your activation funnel lies to you",
    dateLabel: "Aug 1, 2026",
    dateISO: "2026-08-01",
    tag: "Product Analytics",
    access: "free",
    minutes: 7,
    excerptShort: "The step where users “activate” is almost never the step your dashboard says it is.",
    excerptFull:
      "The step where users “activate” is almost never the step your dashboard says it is. Most funnels are built from the events that were easiest to log, not the ones that predict retention — and the gap between the two quietly inflates every conversion number above it. I walk through how we found the real activation moment at three different B2B products, and the one query that would have caught it a year earlier.",
  },
  {
    id: "p2",
    title: "The three metrics that actually predict churn",
    dateLabel: "Jul 24, 2026",
    dateISO: "2026-07-24",
    tag: "Retention",
    access: "member",
    minutes: 9,
    excerptShort: "Not NPS, not login streaks — the leading indicators that showed up 45 days before cancellation.",
    excerptFull:
      "Not NPS, not login streaks — the leading indicators that showed up 45 days before cancellation in a cohort of 40,000 accounts. This is the full breakdown: the SQL, the false leads that didn’t generalize across plans, and the single feature-adoption signal that outperformed everything else we tested.",
  },
  {
    id: "p3",
    title: "Instrumentation debt: the interest keeps compounding",
    dateLabel: "Jul 17, 2026",
    dateISO: "2026-07-17",
    tag: "Data Quality",
    access: "free",
    minutes: 6,
    excerptShort: "Every renamed event you don’t backfill is a small tax on every dashboard built after it.",
    excerptFull:
      "Every renamed event you don’t backfill is a small tax on every dashboard built after it. I look at how instrumentation debt actually accrues — not as one big rewrite, but as dozens of tiny inconsistencies — and a lightweight review habit that keeps it from ever reaching the size where a rewrite feels necessary.",
  },
  {
    id: "p4",
    title: "Inside a $40M ARR company's weekly metrics review",
    dateLabel: "Jul 10, 2026",
    dateISO: "2026-07-10",
    tag: "Case Study",
    access: "member",
    minutes: 11,
    excerptShort: "The exact eight slides a growth team reviews every Monday, and why half of last year’s slides got cut.",
    excerptFull:
      "The exact eight slides a growth team reviews every Monday, and why half of last year’s slides got cut. A full walkthrough of the meeting structure, who owns which number, and the one rule that keeps a 30-minute review from turning into a 90-minute debate about attribution.",
  },
  {
    id: "p5",
    title: "Cohort tables are underrated. Here's how I read them",
    dateLabel: "Jul 3, 2026",
    dateISO: "2026-07-03",
    tag: "Product Analytics",
    access: "free",
    minutes: 8,
    excerptShort: "A plain cohort grid still beats most retention charts — if you know which diagonal to read first.",
    excerptFull:
      "A plain cohort grid still beats most retention charts — if you know which diagonal to read first. This is the reading order I teach every new analyst on my team, plus three shapes in a cohort table that should immediately change what you ship next sprint.",
  },
  {
    id: "p6",
    title: "Building a data-literate team without hiring analysts",
    dateLabel: "Jun 26, 2026",
    dateISO: "2026-06-26",
    tag: "Data Careers",
    access: "member",
    minutes: 10,
    excerptShort: "You don’t need a data team to stop shipping on vibes — you need three habits and one shared vocabulary.",
    excerptFull:
      "You don’t need a data team to stop shipping on vibes — you need three habits and one shared vocabulary. How a nine-person product team built enough shared fluency to argue about numbers productively, including the weekly ritual that made it stick.",
  },
];

export type Tier = {
  id: string;
  name: string;
  monthlyPrice: number;
  annualMonthlyEquivalent: number;
  annualTotal: number;
  tagline: string;
  features: string[];
  highlight: boolean;
  cta: string;
};

export const TIERS: Tier[] = [
  {
    id: "free",
    name: "Free",
    monthlyPrice: 0,
    annualMonthlyEquivalent: 0,
    annualTotal: 0,
    tagline: "Start reading",
    features: ["Weekly essay in your inbox", "Public post archive", "Community discussion access"],
    highlight: false,
    cta: "Join free",
  },
  {
    id: "reader",
    name: "Reader",
    monthlyPrice: 8,
    annualMonthlyEquivalent: 6,
    annualTotal: 72,
    tagline: "For working analysts",
    features: [
      "Everything in Free",
      "Full archive, including member-only posts",
      "Monthly deep-dive report",
      "Downloadable dataset templates",
    ],
    highlight: true,
    cta: "Subscribe",
  },
  {
    id: "insider",
    name: "Insider",
    monthlyPrice: 20,
    annualMonthlyEquivalent: 15,
    annualTotal: 180,
    tagline: "For teams and leads",
    features: [
      "Everything in Reader",
      "Live monthly Q&A call",
      "1:1 async feedback on your dashboards",
      "Early access to the cohort course",
    ],
    highlight: false,
    cta: "Become an Insider",
  },
];

export const ANNUAL_SAVINGS_PCT = 25;
