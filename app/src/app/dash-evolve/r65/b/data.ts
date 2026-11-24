// Harborwatch — trust & safety review console
// All data below is static and hand-authored. Every aggregate shown in the UI (pending count,
// SLA-breach count, avg time-to-decision, category distribution, severity tab counts) is derived
// from this one array at render time — never a separately authored number — so nothing can drift
// out of sync with what the feed actually renders.

export type ContentType = "listing" | "post" | "message";
export type Severity = "critical" | "high" | "medium" | "low";
export type Category = "counterfeit" | "harassment" | "prohibited" | "fraud" | "hate" | "scam";
export type DecisionStatus = "pending" | "approved" | "removed" | "escalated";

export interface FeedItem {
  id: string;
  type: ContentType;
  title: string;
  snippet: string;
  category: Category;
  flagReasons: string[];
  severity: Severity;
  reporterCount: number;
  /** Minutes the item has sat in queue (pending) or minutes it took to decide (resolved). */
  queueMinutes: number;
  status: DecisionStatus;
}

export const SLA_TARGET_MINUTES: Record<Severity, number> = {
  critical: 30,
  high: 120,
  medium: 480,
  low: 1440,
};

export const SEVERITY_ORDER: Severity[] = ["critical", "high", "medium", "low"];

export const SEVERITY_LABEL: Record<Severity, string> = {
  critical: "Critical",
  high: "High",
  medium: "Medium",
  low: "Low",
};

export const CATEGORY_ORDER: Category[] = ["counterfeit", "harassment", "prohibited", "fraud", "hate", "scam"];

export const CATEGORY_LABEL: Record<Category, string> = {
  counterfeit: "Counterfeit goods",
  harassment: "Harassment & abuse",
  prohibited: "Prohibited item",
  fraud: "Fraud risk",
  hate: "Hate speech",
  scam: "Scam attempt",
};

/** Short axis labels for the category distribution chart, where space is tight. */
export const CATEGORY_SHORT: Record<Category, string> = {
  counterfeit: "Counterfeit",
  harassment: "Harassment",
  prohibited: "Prohibited",
  fraud: "Fraud",
  hate: "Hate",
  scam: "Scam",
};

export const INITIAL_FEED_ITEMS: FeedItem[] = [
  {
    id: "QI-241",
    type: "listing",
    title: "Air Jordan 1 Retro — bulk lot, 40 pairs",
    snippet:
      "Seller lists 40 pairs of a limited sneaker well below retail; the box labels shown in photos use a mismatched font.",
    category: "counterfeit",
    flagReasons: ["Counterfeit goods", "Trademark complaint"],
    severity: "critical",
    reporterCount: 14,
    queueMinutes: 41,
    status: "pending",
  },
  {
    id: "QI-240",
    type: "post",
    title: "Roommate-wanted post, Riverside board",
    snippet:
      "Reporters say the post singles out a named user with repeated derogatory comments in the reply thread.",
    category: "harassment",
    flagReasons: ["Harassment & abuse"],
    severity: "high",
    reporterCount: 6,
    queueMinutes: 95,
    status: "pending",
  },
  {
    id: "QI-239",
    type: "message",
    title: "Buyer-seller thread, order #88213",
    snippet: "Recipient reports a message asking to move the sale to a third-party payment app.",
    category: "fraud",
    flagReasons: ["Fraud risk", "Payment redirect"],
    severity: "critical",
    reporterCount: 3,
    queueMinutes: 52,
    status: "pending",
  },
  {
    id: "QI-238",
    type: "listing",
    title: "Bulk allergy medication, unmarked bottles",
    snippet: "Listing offers prescription-strength antihistamine in bulk with no pharmacy license on file.",
    category: "prohibited",
    flagReasons: ["Prohibited item", "Restricted substance"],
    severity: "high",
    reporterCount: 9,
    queueMinutes: 140,
    status: "pending",
  },
  {
    id: "QI-237",
    type: "post",
    title: "Building dispute thread, unit 4B",
    snippet: "Thread includes a comment targeting a resident's ethnicity, flagged by two separate users.",
    category: "hate",
    flagReasons: ["Hate speech"],
    severity: "medium",
    reporterCount: 4,
    queueMinutes: 300,
    status: "pending",
  },
  {
    id: "QI-236",
    type: "listing",
    title: "Designer tote bundle, “mirror quality”",
    snippet: "Listing description pairs the phrase mirror quality with a brand name it is not authorized to sell.",
    category: "counterfeit",
    flagReasons: ["Counterfeit goods"],
    severity: "medium",
    reporterCount: 11,
    queueMinutes: 510,
    status: "pending",
  },
  {
    id: "QI-235",
    type: "message",
    title: "Seller DM to first-time buyer",
    snippet: "Message asks the buyer to cancel the order and pay again by gift card instead.",
    category: "scam",
    flagReasons: ["Scam attempt"],
    severity: "high",
    reporterCount: 2,
    queueMinutes: 60,
    status: "pending",
  },
  {
    id: "QI-234",
    type: "post",
    title: "Comment thread on swap-meet post",
    snippet: "A reply chain repeatedly targets one commenter after a pricing disagreement.",
    category: "harassment",
    flagReasons: ["Harassment & abuse"],
    severity: "low",
    reporterCount: 5,
    queueMinutes: 1500,
    status: "pending",
  },
  {
    id: "QI-233",
    type: "listing",
    title: "Replica running shoes, size run",
    snippet: "Reviewer confirmed unauthorized use of brand marks; listing was removed before it could relist.",
    category: "counterfeit",
    flagReasons: ["Counterfeit goods"],
    severity: "critical",
    reporterCount: 20,
    queueMinutes: 18,
    status: "removed",
  },
  {
    id: "QI-232",
    type: "post",
    title: "Marketplace meetup group post",
    snippet: "Reviewer confirmed targeted slurs in the body text; content was removed.",
    category: "hate",
    flagReasons: ["Hate speech"],
    severity: "high",
    reporterCount: 7,
    queueMinutes: 24,
    status: "removed",
  },
  {
    id: "QI-231",
    type: "message",
    title: "Shipping question thread",
    snippet: "Reviewer found the flagged phrase was a quoted scam warning, not a scam attempt; approved.",
    category: "fraud",
    flagReasons: ["Fraud risk"],
    severity: "medium",
    reporterCount: 1,
    queueMinutes: 9,
    status: "approved",
  },
  {
    id: "QI-230",
    type: "listing",
    title: "Event tickets, face value plus fee",
    snippet: "Pricing pattern matched a known resale-scam signature; sent to a senior reviewer.",
    category: "scam",
    flagReasons: ["Scam attempt"],
    severity: "low",
    reporterCount: 2,
    queueMinutes: 33,
    status: "escalated",
  },
];

export interface Reviewer {
  id: string;
  name: string;
  decisions: number;
  accuracyPct: number;
  avgHandleMinutes: number;
}

export const REVIEWERS: Reviewer[] = [
  { id: "r1", name: "Priya Nair", decisions: 34, accuracyPct: 97.1, avgHandleMinutes: 2.4 },
  { id: "r2", name: "Marcus Webb", decisions: 29, accuracyPct: 95.4, avgHandleMinutes: 3.1 },
  { id: "r3", name: "Elena Torres", decisions: 41, accuracyPct: 93.8, avgHandleMinutes: 1.9 },
  { id: "r4", name: "Sam Reyes", decisions: 22, accuracyPct: 98.6, avgHandleMinutes: 4.0 },
  { id: "r5", name: "Dana Kessler", decisions: 37, accuracyPct: 91.2, avgHandleMinutes: 2.7 },
  { id: "r6", name: "Jon Ibe", decisions: 18, accuracyPct: 99.0, avgHandleMinutes: 5.2 },
];

export function formatMinutes(total: number): string {
  if (total < 60) return `${total}m`;
  const hours = Math.floor(total / 60);
  const minutes = total % 60;
  return minutes === 0 ? `${hours}h` : `${hours}h ${String(minutes).padStart(2, "0")}m`;
}

export const numberFormatter = new Intl.NumberFormat("en-US");
