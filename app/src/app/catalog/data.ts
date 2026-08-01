/**
 * Loopwire — deterministic integration-catalog fixture data.
 *
 * No `Math.random`, `Date.now`, or `new Date()` anywhere in this file or its consumers: every
 * "recency" signal is a hand-assigned rank (`addedOrder`), not a real timestamp, so sorting is
 * stable across renders and hydration never disagrees with itself.
 */

export type Category =
  | "Accounting"
  | "Analytics"
  | "CRM"
  | "Communication"
  | "Marketing"
  | "Productivity"
  | "Security"
  | "Storage";

export type Pricing = "Free" | "Freemium" | "Paid";

export type Status = "Verified" | "Beta" | "In review";

export interface Integration {
  id: string;
  slug: string;
  name: string;
  category: Category;
  pricing: Pricing;
  priceLabel: string;
  monthlyPrice: number | null;
  installs: number;
  rating: number;
  reviews: number;
  status: Status;
  description: string;
  tags: string[];
  /** Lower = added more recently. Hand-assigned rank, not a date. */
  addedOrder: number;
}

export const CATEGORIES: Category[] = [
  "Accounting",
  "Analytics",
  "CRM",
  "Communication",
  "Marketing",
  "Productivity",
  "Security",
  "Storage",
];

export const PRICING_OPTIONS: Pricing[] = ["Free", "Freemium", "Paid"];

export const RATING_OPTIONS = [0, 3.5, 4, 4.5] as const;

export type SortKey = "installs" | "rating" | "newest" | "name";

export const SORT_LABELS: Record<SortKey, string> = {
  installs: "Most installed",
  rating: "Highest rated",
  newest: "Newest",
  name: "Name A–Z",
};

const CATEGORY_TAG_POOL: Record<Category, string[]> = {
  Accounting: ["Invoice sync", "Tax mapping", "Multi-currency", "Expense import"],
  Analytics: ["Real-time events", "Custom dashboards", "Cohort analysis", "CSV export"],
  CRM: ["Two-way sync", "Lead scoring", "Pipeline stages", "Contact merge"],
  Communication: ["Thread sync", "Shared inbox", "Channel bridge", "Read receipts"],
  Marketing: ["Audience segments", "A/B testing", "Send scheduling", "UTM tracking"],
  Productivity: ["Task automation", "Calendar sync", "Recurring workflows", "Templates"],
  Security: ["SSO", "Audit logs", "Role-based access", "2FA enforcement"],
  Storage: ["Version history", "Encrypted at rest", "Bulk import", "Webhook triggers"],
};

const RAW_INTEGRATIONS: Array<Omit<Integration, "slug" | "addedOrder" | "tags"> & { tagPick: [number, number, number] }> = [
  { id: "ledgerly", name: "Ledgerly", category: "Accounting", pricing: "Paid", priceLabel: "$24/mo", monthlyPrice: 24, installs: 128400, rating: 4.7, reviews: 3120, status: "Verified", description: "Automated bookkeeping sync that reconciles invoices the moment they're paid.", tagPick: [0, 1, 3] },
  { id: "cashwell", name: "Cashwell", category: "Accounting", pricing: "Freemium", priceLabel: "Free · paid tiers", monthlyPrice: null, installs: 64200, rating: 4.3, reviews: 1180, status: "Verified", description: "Cash-flow forecasting pulled straight from your connected bank feeds.", tagPick: [2, 0, 3] },
  { id: "taxmark", name: "Taxmark", category: "Accounting", pricing: "Paid", priceLabel: "$39/mo", monthlyPrice: 39, installs: 21300, rating: 4.1, reviews: 540, status: "Beta", description: "Multi-region tax mapping with audit-ready export in one click.", tagPick: [1, 2, 0] },
  { id: "bookwise", name: "Bookwise", category: "Accounting", pricing: "Free", priceLabel: "Free", monthlyPrice: 0, installs: 96700, rating: 4.5, reviews: 2210, status: "Verified", description: "Double-entry ledger sync for teams who outgrew spreadsheets.", tagPick: [3, 1, 0] },

  { id: "pulsecheck", name: "Pulsecheck", category: "Analytics", pricing: "Freemium", priceLabel: "Free · paid tiers", monthlyPrice: null, installs: 154000, rating: 4.8, reviews: 5210, status: "Verified", description: "Real-time product analytics with cohort retention built in.", tagPick: [0, 2, 1] },
  { id: "metricloop", name: "Metricloop", category: "Analytics", pricing: "Paid", priceLabel: "$29/mo", monthlyPrice: 29, installs: 88300, rating: 4.4, reviews: 1890, status: "Verified", description: "Custom dashboards that update the moment new events land.", tagPick: [1, 0, 3] },
  { id: "trendform", name: "Trendform", category: "Analytics", pricing: "Free", priceLabel: "Free", monthlyPrice: 0, installs: 41200, rating: 4.0, reviews: 760, status: "In review", description: "Lightweight event tracking for teams who just need the trend line.", tagPick: [0, 3, 2] },
  { id: "datapane", name: "Datapane", category: "Analytics", pricing: "Paid", priceLabel: "$19/mo", monthlyPrice: 19, installs: 33100, rating: 3.9, reviews: 610, status: "Beta", description: "Drag-and-drop reporting on top of your existing warehouse.", tagPick: [3, 1, 2] },

  { id: "clientary", name: "Clientary", category: "CRM", pricing: "Freemium", priceLabel: "Free · paid tiers", monthlyPrice: null, installs: 112500, rating: 4.6, reviews: 3980, status: "Verified", description: "Two-way CRM sync that keeps every deal stage in lockstep.", tagPick: [0, 2, 1] },
  { id: "pipeflow", name: "Pipeflow", category: "CRM", pricing: "Paid", priceLabel: "$35/mo", monthlyPrice: 35, installs: 76400, rating: 4.5, reviews: 2040, status: "Verified", description: "Pipeline automation that reassigns leads the moment they go cold.", tagPick: [2, 1, 3] },
  { id: "contactix", name: "Contactix", category: "CRM", pricing: "Free", priceLabel: "Free", monthlyPrice: 0, installs: 28900, rating: 4.2, reviews: 690, status: "Verified", description: "Lightweight contact sync for small sales teams.", tagPick: [3, 0, 1] },
  { id: "dealtrack", name: "Dealtrack", category: "CRM", pricing: "Paid", priceLabel: "$27/mo", monthlyPrice: 27, installs: 19700, rating: 3.8, reviews: 410, status: "Beta", description: "Forecasting overlay for pipelines that outgrew a spreadsheet.", tagPick: [1, 2, 0] },

  { id: "inboxa", name: "Inboxa", category: "Communication", pricing: "Freemium", priceLabel: "Free · paid tiers", monthlyPrice: null, installs: 203000, rating: 4.7, reviews: 6640, status: "Verified", description: "Shared inbox routing with read receipts across every channel.", tagPick: [1, 3, 0] },
  { id: "chatbridge", name: "Chatbridge", category: "Communication", pricing: "Free", priceLabel: "Free", monthlyPrice: 0, installs: 87600, rating: 4.3, reviews: 1720, status: "Verified", description: "Bridges support threads between chat, email, and tickets.", tagPick: [0, 2, 1] },
  { id: "signalboard", name: "Signalboard", category: "Communication", pricing: "Paid", priceLabel: "$15/mo", monthlyPrice: 15, installs: 45300, rating: 4.1, reviews: 980, status: "In review", description: "Status-page style broadcasts for internal incident updates.", tagPick: [2, 0, 3] },

  { id: "broadcastly", name: "Broadcastly", category: "Marketing", pricing: "Paid", priceLabel: "$49/mo", monthlyPrice: 49, installs: 62100, rating: 4.4, reviews: 1510, status: "Verified", description: "Multi-channel campaign sends with built-in send-time optimization.", tagPick: [2, 1, 3] },
  { id: "campaignhub", name: "Campaignhub", category: "Marketing", pricing: "Freemium", priceLabel: "Free · paid tiers", monthlyPrice: null, installs: 98200, rating: 4.6, reviews: 2870, status: "Verified", description: "Audience segmentation synced from your CRM in real time.", tagPick: [0, 3, 1] },
  { id: "audiencelab", name: "Audiencelab", category: "Marketing", pricing: "Free", priceLabel: "Free", monthlyPrice: 0, installs: 31400, rating: 3.9, reviews: 520, status: "Beta", description: "Lightweight A/B testing for landing pages and email subject lines.", tagPick: [1, 0, 2] },

  { id: "fieldnote", name: "Fieldnote", category: "Productivity", pricing: "Free", priceLabel: "Free", monthlyPrice: 0, installs: 145000, rating: 4.8, reviews: 4310, status: "Verified", description: "Task automation that turns recurring busywork into one click.", tagPick: [0, 1, 3] },
  { id: "taskwell", name: "Taskwell", category: "Productivity", pricing: "Freemium", priceLabel: "Free · paid tiers", monthlyPrice: null, installs: 71800, rating: 4.5, reviews: 1990, status: "Verified", description: "Calendar-aware task sync across every connected workspace.", tagPick: [1, 0, 2] },
  { id: "focusframe", name: "Focusframe", category: "Productivity", pricing: "Paid", priceLabel: "$12/mo", monthlyPrice: 12, installs: 26500, rating: 4.2, reviews: 640, status: "Verified", description: "Distraction-blocking workflows tied to your calendar status.", tagPick: [2, 3, 1] },

  { id: "vaultkeep", name: "Vaultkeep", category: "Security", pricing: "Paid", priceLabel: "$59/mo", monthlyPrice: 59, installs: 54900, rating: 4.7, reviews: 1330, status: "Verified", description: "Enterprise SSO and audit logging across every connected app.", tagPick: [0, 1, 2] },
  { id: "accesslane", name: "Accesslane", category: "Security", pricing: "Freemium", priceLabel: "Free · paid tiers", monthlyPrice: null, installs: 38200, rating: 4.3, reviews: 870, status: "Verified", description: "Role-based access control synced from your identity provider.", tagPick: [2, 0, 3] },
  { id: "shieldform", name: "Shieldform", category: "Security", pricing: "Paid", priceLabel: "$45/mo", monthlyPrice: 45, installs: 17600, rating: 4.0, reviews: 390, status: "In review", description: "Automated 2FA enforcement for every workspace member.", tagPick: [3, 0, 1] },

  { id: "cachemap", name: "Cachemap", category: "Storage", pricing: "Freemium", priceLabel: "Free · paid tiers", monthlyPrice: null, installs: 82300, rating: 4.4, reviews: 2110, status: "Verified", description: "Version-controlled file sync with encrypted-at-rest storage.", tagPick: [0, 1, 3] },
  { id: "filebay", name: "Filebay", category: "Storage", pricing: "Free", priceLabel: "Free", monthlyPrice: 0, installs: 59700, rating: 4.1, reviews: 1240, status: "Beta", description: "Bulk file import with automatic duplicate detection.", tagPick: [2, 3, 0] },
  { id: "archivo", name: "Archivo", category: "Storage", pricing: "Paid", priceLabel: "$22/mo", monthlyPrice: 22, installs: 24100, rating: 3.8, reviews: 480, status: "Verified", description: "Long-term archive storage with instant retrieval search.", tagPick: [0, 2, 1] },
];

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

/** Deterministic permutation of 0..n-1 (7 and 27 are coprime, so this is a bijection). */
function addedOrderFor(index: number, total: number): number {
  return (index * 7 + 4) % total;
}

export const INTEGRATIONS: Integration[] = RAW_INTEGRATIONS.map((raw, index) => {
  const pool = CATEGORY_TAG_POOL[raw.category];
  const tags = raw.tagPick.map((i) => pool[i % pool.length]);
  return {
    ...raw,
    slug: slugify(raw.name),
    tags,
    addedOrder: addedOrderFor(index, RAW_INTEGRATIONS.length),
  };
});

export function formatCount(n: number): string {
  if (n >= 1_000_000) {
    const v = n / 1_000_000;
    return `${v % 1 === 0 ? v.toFixed(0) : v.toFixed(1)}M`;
  }
  if (n >= 1_000) {
    const v = n / 1_000;
    return `${v % 1 === 0 ? v.toFixed(0) : v.toFixed(1)}K`;
  }
  return String(n);
}

export function buildLongDescription(item: Integration): string {
  const tagList = item.tags.join(", ").toLowerCase();
  return `${item.name} plugs into Loopwire's automation canvas so ${tagList} stay in sync without a manual export. It's built for teams already running ${item.category.toLowerCase()} workflows who need one fewer tab open, with changes reflected on both sides within seconds of a save.`;
}
