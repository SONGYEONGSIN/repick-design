/**
 * All content for the Sable Voss developer profile — literal, deterministic seed data.
 * No Math.random / Date.now / new Date() ships in this route; the activity grid in
 * heatmap-data.ts was generated once at authoring time by a throwaway node script (seeded
 * mulberry32(1337)) and pasted in as literals, same discipline the catalog route's brand
 * tiles use for their hash-derived color.
 */

export {
  HEATMAP_WEEKS,
  MONTH_MARKERS,
  ACTIVITY_TOTALS,
  type HeatCell,
} from "./heatmap-data";

export type IntegrationStatus = "Verified" | "Beta" | "Community";

export type CategoryKey =
  | "crm"
  | "support"
  | "payments"
  | "ecommerce"
  | "analytics"
  | "devops";

export const CATEGORY_LABELS: Record<CategoryKey, string> = {
  crm: "CRM & Sales",
  support: "Support & Ticketing",
  payments: "Payments",
  ecommerce: "E-commerce",
  analytics: "Data & Analytics",
  devops: "DevOps & Infra",
};

// Fixed hue per category so every tile of the same category reads as the same "family" at a
// glance — not hashed per-integration, deliberately mapped so the color carries meaning.
export const CATEGORY_HUE: Record<CategoryKey, number> = {
  crm: 265,
  support: 199,
  payments: 38,
  ecommerce: 152,
  analytics: 322,
  devops: 15,
};

export interface Integration {
  slug: string;
  name: string;
  category: CategoryKey;
  description: string;
  installs: number;
  rating: number;
  reviews: number;
  status: IntegrationStatus;
  updatedLabel: string;
  updatedDaysAgo: number;
}

// updatedDaysAgo is measured against the fixed "today" the whole route is dated to (Aug 4,
// 2026) — computed by hand once, not with new Date(), and is used only to sort; updatedLabel
// is the literal string actually rendered.
export const INTEGRATIONS: Integration[] = [
  {
    slug: "ticketsync-zendesk",
    name: "TicketSync for Zendesk",
    category: "support",
    description: "Two-way ticket sync between Zendesk and Loopwire workflows, with SLA-aware routing.",
    installs: 42300,
    rating: 4.9,
    reviews: 612,
    status: "Verified",
    updatedLabel: "Jul 28, 2026",
    updatedDaysAgo: 7,
  },
  {
    slug: "pipelinebridge",
    name: "PipelineBridge",
    category: "crm",
    description: "Push qualified leads from any form into HubSpot or Salesforce pipelines automatically.",
    installs: 38100,
    rating: 4.7,
    reviews: 480,
    status: "Verified",
    updatedLabel: "Jul 14, 2026",
    updatedDaysAgo: 21,
  },
  {
    slug: "ledgertap",
    name: "LedgerTap",
    category: "payments",
    description: "Reconcile Stripe payouts against invoices and flag mismatches before close.",
    installs: 25600,
    rating: 4.8,
    reviews: 355,
    status: "Verified",
    updatedLabel: "Jun 30, 2026",
    updatedDaysAgo: 35,
  },
  {
    slug: "cartrecover",
    name: "CartRecover",
    category: "ecommerce",
    description: "Recover abandoned Shopify carts with multi-step, throttled outreach flows.",
    installs: 19800,
    rating: 4.5,
    reviews: 240,
    status: "Community",
    updatedLabel: "May 22, 2026",
    updatedDaysAgo: 74,
  },
  {
    slug: "metricrelay",
    name: "MetricRelay",
    category: "analytics",
    description: "Stream event data from Loopwire runs into Snowflake or BigQuery in near real time.",
    installs: 15200,
    rating: 4.6,
    reviews: 198,
    status: "Verified",
    updatedLabel: "Jul 30, 2026",
    updatedDaysAgo: 5,
  },
  {
    slug: "deployhook",
    name: "DeployHook",
    category: "devops",
    description: "Trigger and monitor CI/CD deploys from workflow steps, with rollback on failure.",
    installs: 11400,
    rating: 4.4,
    reviews: 151,
    status: "Beta",
    updatedLabel: "Jul 22, 2026",
    updatedDaysAgo: 13,
  },
  {
    slug: "invoiceflow",
    name: "InvoiceFlow",
    category: "payments",
    description: "Generate and send invoices the moment a deal closes in your CRM.",
    installs: 9700,
    rating: 4.6,
    reviews: 132,
    status: "Verified",
    updatedLabel: "Apr 18, 2026",
    updatedDaysAgo: 108,
  },
  {
    slug: "supportdigest",
    name: "SupportDigest",
    category: "support",
    description: "Daily digest of unresolved tickets grouped by priority, posted to any channel.",
    installs: 7300,
    rating: 4.3,
    reviews: 89,
    status: "Community",
    updatedLabel: "Mar 2, 2026",
    updatedDaysAgo: 155,
  },
  {
    slug: "segmentsync",
    name: "SegmentSync",
    category: "analytics",
    description: "Keep customer segments consistent across your CRM, email tool, and ad platforms.",
    installs: 4200,
    rating: 4.2,
    reviews: 54,
    status: "Beta",
    updatedLabel: "Jul 5, 2026",
    updatedDaysAgo: 30,
  },
];

export const CATEGORY_COUNTS: Record<CategoryKey, number> = INTEGRATIONS.reduce(
  (acc, i) => {
    acc[i.category] += 1;
    return acc;
  },
  { crm: 0, support: 0, payments: 0, ecommerce: 0, analytics: 0, devops: 0 } as Record<CategoryKey, number>,
);

export const TOTAL_INSTALLS = INTEGRATIONS.reduce((s, i) => s + i.installs, 0);
export const AVG_RATING =
  Math.round((INTEGRATIONS.reduce((s, i) => s + i.rating, 0) / INTEGRATIONS.length) * 10) / 10;

export const PROFILE = {
  name: "Sable Voss",
  handle: "sablevoss",
  title: "Independent Integration Maintainer",
  location: "Berlin, DE",
  memberSince: "Mar 2021",
  bio:
    "I build reliable, well-documented integrations that sit at the boundary between support tools, CRMs, and payment systems. Currently maintaining 9 published apps and helping teams automate handoffs without writing glue code.",
  website: "sablevoss.dev",
  githubHandle: "svoss",
  followers: 4821,
  following: 96,
  verified: true,
};

export const SORT_OPTIONS = [
  { key: "installs", label: "Most installed" },
  { key: "rating", label: "Highest rated" },
  { key: "recent", label: "Recently updated" },
] as const;
export type SortKey = (typeof SORT_OPTIONS)[number]["key"];

export const STATUS_FILTERS: (IntegrationStatus | "all")[] = ["all", "Verified", "Beta", "Community"];

export function sortIntegrations(items: Integration[], key: SortKey): Integration[] {
  const copy = [...items];
  switch (key) {
    case "installs":
      return copy.sort((a, b) => b.installs - a.installs);
    case "rating":
      return copy.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
    case "recent":
      return copy.sort((a, b) => a.updatedDaysAgo - b.updatedDaysAgo);
    default:
      return copy;
  }
}

export function formatCount(n: number): string {
  return n.toLocaleString("en-US");
}

/** Heat-bucket 0–4 from a raw daily count, used only for cell fill intensity. */
export function heatLevel(count: number): 0 | 1 | 2 | 3 | 4 {
  if (count <= 0) return 0;
  if (count <= 2) return 1;
  if (count <= 4) return 2;
  if (count <= 7) return 3;
  return 4;
}
