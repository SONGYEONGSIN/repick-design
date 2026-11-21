// Static, deterministic demo data for the Undertone feedback-intelligence console.
// No Math.random / Date.now / new Date anywhere in this file or any consumer.

export type SentimentLabel = "positive" | "neutral" | "negative";
export type TicketStatus = "open" | "escalated" | "resolved";
export type Priority = "low" | "medium" | "high";
export type Period = "7d" | "30d" | "90d";

export const BRAND_NAME = "Undertone";
export const BRAND_TAGLINE = "Feedback Intelligence";

export const WORKSPACES = ["Web Storefront", "Mobile App", "Loyalty Program"];

export const CURRENT_USER = {
  name: "Renee Tran",
  email: "renee.tran@undertone.io",
  initials: "RT",
};

export const PERIODS: { value: Period; label: string }[] = [
  { value: "7d", label: "7 days" },
  { value: "30d", label: "30 days" },
  { value: "90d", label: "90 days" },
];

// ---------------------------------------------------------------------------
// Themes (word cloud + required ranked-list fallback)
// ---------------------------------------------------------------------------

export type Term = {
  id: string;
  label: string;
  count: number;
  sentiment: SentimentLabel;
};

// Sorted by count, descending — this order drives both the spiral layout and
// the ranked list, so "rank 1" always means "highest frequency" in both views.
export const TERMS: Term[] = [
  { id: "shipping-delay", label: "shipping delay", count: 184, sentiment: "negative" },
  { id: "checkout-flow", label: "checkout flow", count: 156, sentiment: "negative" },
  { id: "return-process", label: "return process", count: 132, sentiment: "negative" },
  { id: "mobile-crash", label: "mobile app crash", count: 118, sentiment: "negative" },
  { id: "customer-support", label: "customer support", count: 96, sentiment: "positive" },
  { id: "product-quality", label: "product quality", count: 84, sentiment: "positive" },
  { id: "order-tracking", label: "order tracking", count: 62, sentiment: "neutral" },
  { id: "loyalty-rewards", label: "loyalty rewards", count: 54, sentiment: "positive" },
  { id: "search-filters", label: "search filters", count: 48, sentiment: "negative" },
  { id: "coupon-code", label: "coupon code", count: 38, sentiment: "neutral" },
  { id: "page-load-speed", label: "page load speed", count: 34, sentiment: "negative" },
  { id: "payment-options", label: "payment options", count: 28, sentiment: "neutral" },
  { id: "wishlist-sync", label: "wishlist sync", count: 26, sentiment: "neutral" },
  { id: "size-guide", label: "size guide", count: 22, sentiment: "negative" },
  { id: "gift-wrapping", label: "gift wrapping", count: 18, sentiment: "positive" },
];

// Always derived from TERMS — never hand-maintained — so the ranked-list
// percentages and the KPI row can never drift out of reconciliation.
export const TOTAL_MENTIONS = TERMS.reduce((sum, t) => sum + t.count, 0);

export const TERM_BY_ID: Record<string, Term> = Object.fromEntries(TERMS.map((t) => [t.id, t]));

export const DEFAULT_TERM_ID = TERMS[0].id;

/** Deterministic weekly trend for a given term, synthesized from its sentiment
 *  label and list index — no randomness, same input always yields same output. */
export function getTermTrend(term: Term, index: number, period: Period): number[] {
  const base = term.sentiment === "positive" ? 54 : term.sentiment === "negative" ? -56 : 2;
  const amplitude = period === "7d" ? 4 : period === "30d" ? 7 : 10;
  const drift = period === "7d" ? 0 : period === "30d" ? -3 : -6;
  return Array.from({ length: 7 }, (_, i) => {
    const wave = Math.sin((i + index) * 0.9) * amplitude;
    return Math.round(base + drift * (i / 6) + wave);
  });
}

// ---------------------------------------------------------------------------
// Feedback feed (central activity stream)
// ---------------------------------------------------------------------------

export type FeedItem = {
  id: string;
  subject: string;
  customer: string;
  initials: string;
  status: TicketStatus;
  priority: Priority;
  sentiment: SentimentLabel;
  sentimentScore: number; // -100..100
  themeIds: string[];
  hoursAgo: number;
  assigneeInitials: string;
  snippet: string;
};

export const FEED_ITEMS: FeedItem[] = [
  {
    id: "tk-1042",
    subject: "Shipment stuck in transit for 9 days",
    customer: "Priya Nandakumar",
    initials: "PN",
    status: "escalated",
    priority: "high",
    sentiment: "negative",
    sentimentScore: -72,
    themeIds: ["shipping-delay"],
    hoursAgo: 2,
    assigneeInitials: "RT",
    snippet: 'Order #88213 has shown "in transit" for 9 days with no carrier update — customer is asking for a refund.',
  },
  {
    id: "tk-1041",
    subject: "Checkout fails at the payment step on Safari",
    customer: "Owen Castillo",
    initials: "OC",
    status: "open",
    priority: "high",
    sentiment: "negative",
    sentimentScore: -64,
    themeIds: ["checkout-flow", "payment-options"],
    hoursAgo: 4,
    assigneeInitials: "JL",
    snippet: "Card form clears itself right after clicking Pay — reproduced on Safari 17, not on Chrome.",
  },
  {
    id: "tk-1038",
    subject: "Loved how fast support resolved my return",
    customer: "Ines Dahlberg",
    initials: "ID",
    status: "resolved",
    priority: "low",
    sentiment: "positive",
    sentimentScore: 68,
    themeIds: ["customer-support", "return-process"],
    hoursAgo: 9,
    assigneeInitials: "RT",
    snippet: "Agent issued the return label in under five minutes — much better than our previous vendor.",
  },
  {
    id: "tk-1035",
    subject: "App crashes when opening a saved wishlist",
    customer: "Marcus Webb",
    initials: "MW",
    status: "open",
    priority: "medium",
    sentiment: "negative",
    sentimentScore: -58,
    themeIds: ["mobile-crash", "wishlist-sync"],
    hoursAgo: 14,
    assigneeInitials: "SK",
    snippet: "Android build 4.12 crashes every time the wishlist tab opens with more than 20 saved items.",
  },
  {
    id: "tk-1030",
    subject: "Return window shortened without notice",
    customer: "Grace Oyelaran",
    initials: "GO",
    status: "escalated",
    priority: "high",
    sentiment: "negative",
    sentimentScore: -55,
    themeIds: ["return-process"],
    hoursAgo: 21,
    assigneeInitials: "JL",
    snippet: "Customer says the return window was 30 days at purchase but the portal now shows 14.",
  },
  {
    id: "tk-1027",
    subject: "Great quality on the new ceramic line",
    customer: "Haruto Saito",
    initials: "HS",
    status: "resolved",
    priority: "low",
    sentiment: "positive",
    sentimentScore: 74,
    themeIds: ["product-quality"],
    hoursAgo: 28,
    assigneeInitials: "SK",
    snippet: "Unprompted five-star note — specifically praised the glaze finish and the packaging.",
  },
  {
    id: "tk-1024",
    subject: "Coupon stacking rule is unclear at checkout",
    customer: "Delphine Aurousseau",
    initials: "DA",
    status: "open",
    priority: "medium",
    sentiment: "neutral",
    sentimentScore: -6,
    themeIds: ["coupon-code", "checkout-flow"],
    hoursAgo: 36,
    assigneeInitials: "RT",
    snippet: "Asked whether the welcome code and the loyalty credit can be combined — the help docs don't say.",
  },
  {
    id: "tk-1019",
    subject: "Size guide doesn't match the actual garment",
    customer: "Noah Lindqvist",
    initials: "NL",
    status: "open",
    priority: "medium",
    sentiment: "negative",
    sentimentScore: -48,
    themeIds: ["size-guide", "product-quality"],
    hoursAgo: 52,
    assigneeInitials: "JL",
    snippet: "Ordered a size M per the chart, received a garment closer to S — second report like this this week.",
  },
  {
    id: "tk-1014",
    subject: "Loyalty points never posted after an order",
    customer: "Esteban Rivas",
    initials: "ER",
    status: "escalated",
    priority: "medium",
    sentiment: "negative",
    sentimentScore: -40,
    themeIds: ["loyalty-rewards"],
    hoursAgo: 68,
    assigneeInitials: "SK",
    snippet: "Order #87410 shipped nine days ago, 340 points still show as pending.",
  },
  {
    id: "tk-1008",
    subject: "Order tracking page finally shows live carrier data",
    customer: "Lena Fassbender",
    initials: "LF",
    status: "resolved",
    priority: "low",
    sentiment: "positive",
    sentimentScore: 52,
    themeIds: ["order-tracking"],
    hoursAgo: 96,
    assigneeInitials: "RT",
    snippet: "Called out the new tracking page as a big improvement over the old static status text.",
  },
  {
    id: "tk-1001",
    subject: "Search filters reset after navigating back",
    customer: "Tomasz Wierzbicki",
    initials: "TW",
    status: "open",
    priority: "low",
    sentiment: "negative",
    sentimentScore: -30,
    themeIds: ["search-filters"],
    hoursAgo: 132,
    assigneeInitials: "JL",
    snippet: "Filtering by size and color, then opening a product and hitting back clears every filter.",
  },
  {
    id: "tk-0994",
    subject: "Gift-wrap option disappeared from the cart",
    customer: "Chidinma Okafor",
    initials: "CO",
    status: "resolved",
    priority: "low",
    sentiment: "neutral",
    sentimentScore: -4,
    themeIds: ["gift-wrapping"],
    hoursAgo: 204,
    assigneeInitials: "SK",
    snippet: "Reported the missing gift-wrap checkbox; confirmed fixed in the latest release notes.",
  },
];

export const DEFAULT_PINNED_ID = FEED_ITEMS[0].id;

// ---------------------------------------------------------------------------
// KPI row + overall sentiment trend, both period-scoped
// ---------------------------------------------------------------------------

export type MetricDirection = "up" | "down";

export type PeriodKpis = {
  openTickets: number;
  openDelta: number;
  netSentiment: number;
  sentimentDelta: number;
  firstResponseHrs: number;
  responseDelta: number;
  themeCoverage: number;
  coverageDelta: number;
};

export const PERIOD_KPIS: Record<Period, PeriodKpis> = {
  "7d": {
    openTickets: 42,
    openDelta: 6,
    netSentiment: -35,
    sentimentDelta: -3,
    firstResponseHrs: 2.4,
    responseDelta: -0.3,
    themeCoverage: 0.78,
    coverageDelta: 0.02,
  },
  "30d": {
    openTickets: 168,
    openDelta: 14,
    netSentiment: -40,
    sentimentDelta: -5,
    firstResponseHrs: 3.1,
    responseDelta: 0.2,
    themeCoverage: 0.82,
    coverageDelta: 0.04,
  },
  "90d": {
    openTickets: 512,
    openDelta: 58,
    netSentiment: -44,
    sentimentDelta: -9,
    firstResponseHrs: 3.6,
    responseDelta: 0.5,
    themeCoverage: 0.85,
    coverageDelta: 0.06,
  },
};

/** Which numeric direction counts as "good" for each KPI — feeds the shared
 *  DeltaIndicator so an up/down arrow always literally matches its sign,
 *  while color (not direction) carries the good/bad verdict. */
export const KPI_GOOD_DIRECTION: Record<keyof Pick<PeriodKpis, "openTickets" | "netSentiment" | "firstResponseHrs" | "themeCoverage">, MetricDirection> = {
  openTickets: "down",
  netSentiment: "up",
  firstResponseHrs: "down",
  themeCoverage: "up",
};

// Weekly net-sentiment trend, one series per period. Last point always equals
// that period's PERIOD_KPIS.netSentiment so the KPI tile and the chart agree.
export const OVERALL_TREND: Record<Period, number[]> = {
  "7d": [-29, -31, -30, -32, -34, -33, -35],
  "30d": [-30, -33, -35, -37, -38, -39, -40],
  "90d": [-28, -33, -37, -40, -42, -43, -44],
};

export const NAV_SECTIONS = [
  { label: "Overview", icon: "Gauge" as const, active: true },
  { label: "Feedback Feed", icon: "Inbox" as const, active: false },
  { label: "Themes", icon: "Tags" as const, active: false },
  { label: "Customers", icon: "Users" as const, active: false },
  { label: "Reports", icon: "FileBarChart2" as const, active: false },
];
