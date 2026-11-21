import type { LucideIcon } from "lucide-react";
import {
  BadgeAlert,
  CheckCircle2,
  EyeOff,
  Inbox,
  ListChecks,
  Mailbox,
  MegaphoneOff,
  MessageCircle,
  MessageCircleWarning,
  MessageSquare,
  Package,
  PackageX,
  Scale,
  ShieldAlert,
  ShieldCheck,
  Star,
  UserRound,
  UserX,
  Users,
  Zap,
} from "lucide-react";
import type { Severity, Status } from "./tokens";
import { SEVERITY_RANK } from "./tokens";

/**
 * Siftline — trust & safety moderation console for "Fieldgood", a fictional online marketplace.
 * The review queue is the product: every flagged listing, message, profile, review or comment that
 * a user, a partner or the automated classifier has reported sits here until a reviewer disposes of
 * it inside its policy's SLA window.
 *
 * DATE/TIME CONTRACT: no `Date.now()`, no bare `new Date()`. The 14-day queue-volume trend below
 * is built from `WINDOW_START` plus a fixed day offset through `addDays` (wraps `new Date(iso)`
 * with an explicit argument only). Every report's age is a hand-set, deterministic
 * `receivedMinutesAgo` integer — a relative label ("42m ago"), not an absolute timestamp, which is
 * the normal pattern for an activity feed and needs no clock read at all.
 *
 * ARITHMETIC CONTRACT: nothing here calls `Math.random()`. A report's SLA deadline is never typed
 * directly — `slaMinutesRemaining()` derives it from `receivedMinutesAgo` and the fixed SLA target
 * for that report's severity, so a severity badge and its SLA chip can never disagree. Every count
 * shown anywhere on the page (category chips, queue-scope counts, SLA breaches, reviewer workload,
 * resolved totals) is produced by filtering `REPORTS`/`REVIEWERS` at read time, never hand-typed —
 * so no displayed subtotal can drift from the total it belongs to.
 */

/* ------------------------------------------------------------------------------- brand / shell */

export const BRAND = { name: "Siftline", Icon: ShieldCheck };

export const CURRENT_USER = { name: "Priya Chandran", role: "Senior Trust & Safety Reviewer", email: "priya.chandran@siftline.io" };

export const WORKSPACES = [
  { id: "fieldgood-na", name: "Fieldgood Marketplace — North America Trust & Safety", plan: "Enterprise" },
  { id: "fieldgood-eu", name: "Fieldgood EU", plan: "Enterprise" },
  { id: "fieldgood-core", name: "Fieldgood Marketplace", plan: "Growth" },
];

export type NavItem = { id: string; label: string; Icon: LucideIcon; href: string; active?: boolean; disabled?: boolean };
export const NAV_SECTIONS: { id: string; title: string; items: NavItem[] }[] = [
  {
    id: "queue",
    title: "Queue",
    items: [
      { id: "review-queue", label: "Review queue", Icon: Inbox, href: "#main-content", active: true },
      { id: "escalations", label: "Escalations", Icon: ShieldAlert, href: "#main-content" },
      { id: "resolved", label: "Resolved", Icon: CheckCircle2, href: "#main-content" },
    ],
  },
  {
    id: "insights",
    title: "Insights",
    items: [
      { id: "reviewer-performance", label: "Reviewer performance", Icon: Users, href: "#audit-log" },
      { id: "policy-library", label: "Policy library", Icon: ListChecks, href: "#main-content" },
      { id: "automation-rules", label: "Automation rules", Icon: Zap, href: "#main-content", disabled: true },
    ],
  },
];

export const NOTIFICATIONS = [
  { id: "n1", text: "Escalation assigned to you — Listing report from Idris Malik", time: "6m ago" },
  { id: "n2", text: "SLA breach warning: 3 critical reports over target", time: "22m ago" },
  { id: "n3", text: "Policy update published — Counterfeit & IP Guidelines v2.3", time: "3h ago" },
  { id: "n4", text: "Weekly digest ready — 142 reports reviewed last week", time: "1d ago" },
];

/* --------------------------------------------------------------------------------- categories */

export type Category = "harassment" | "spam" | "counterfeit" | "hate_speech" | "scam_fraud" | "graphic_content" | "impersonation";

export const CATEGORY_META: Record<Category, { label: string; Icon: LucideIcon }> = {
  harassment: { label: "Harassment", Icon: MessageCircleWarning },
  spam: { label: "Spam", Icon: Mailbox },
  counterfeit: { label: "Counterfeit listing", Icon: PackageX },
  hate_speech: { label: "Hate speech", Icon: MegaphoneOff },
  scam_fraud: { label: "Scam / fraud", Icon: BadgeAlert },
  graphic_content: { label: "Graphic content", Icon: EyeOff },
  impersonation: { label: "Impersonation", Icon: UserX },
};

export type ContentType = "listing" | "message" | "profile" | "review" | "comment";
export const CONTENT_TYPE_META: Record<ContentType, { label: string; Icon: LucideIcon }> = {
  listing: { label: "Listing", Icon: Package },
  message: { label: "Message", Icon: MessageSquare },
  profile: { label: "Profile", Icon: UserRound },
  review: { label: "Review", Icon: Star },
  comment: { label: "Comment", Icon: MessageCircle },
};

export type ReporterType = "User report" | "Automated detection" | "Partner flag";

/* ---------------------------------------------------------------------------------- reviewers */

export const REVIEWERS = ["Priya Chandran", "Marcus Webb", "Elena Kovac", "Devon Osei", "Sana Iqbal"] as const;
export type ReviewerName = (typeof REVIEWERS)[number];

export const REVIEWER_STATS: Record<ReviewerName, { avgHandleMin: number; accuracyPct: number; lastActiveLabel: string }> = {
  "Priya Chandran": { avgHandleMin: 18, accuracyPct: 98, lastActiveLabel: "4m ago" },
  "Marcus Webb": { avgHandleMin: 26, accuracyPct: 94, lastActiveLabel: "12m ago" },
  "Elena Kovac": { avgHandleMin: 21, accuracyPct: 97, lastActiveLabel: "31m ago" },
  "Devon Osei": { avgHandleMin: 34, accuracyPct: 91, lastActiveLabel: "2h ago" },
  "Sana Iqbal": { avgHandleMin: 29, accuracyPct: 95, lastActiveLabel: "48m ago" },
};

export const WORKLOAD_CAPACITY = 8;

/* ------------------------------------------------------------------------------------ reports */

export type Report = {
  id: string;
  category: Category;
  severity: Severity;
  status: Status;
  contentType: ContentType;
  reporterType: ReporterType;
  title: string;
  snippet: string;
  policyMatched: string;
  actorName: string;
  assignedReviewer: ReviewerName | null;
  receivedMinutesAgo: number;
  history: { label: string; atLabel: string }[];
};

const SLA_TARGET_MIN: Record<Severity, number> = { Critical: 30, High: 120, Medium: 480, Low: 1440 };

export function slaMinutesRemaining(r: Report): number {
  return SLA_TARGET_MIN[r.severity] - r.receivedMinutesAgo;
}

export function formatRelative(minutesAgo: number): string {
  if (minutesAgo < 60) return `${minutesAgo}m ago`;
  if (minutesAgo < 1440) return `${Math.round(minutesAgo / 60)}h ago`;
  return `${Math.round(minutesAgo / 1440)}d ago`;
}

export function formatSla(r: Report): string {
  if (r.status === "Resolved") return "Closed";
  const remaining = slaMinutesRemaining(r);
  if (remaining < 0) {
    const over = Math.abs(remaining);
    return over < 60 ? `Overdue ${over}m` : `Overdue ${Math.round(over / 60)}h`;
  }
  return remaining < 60 ? `Due in ${remaining}m` : `Due in ${Math.round(remaining / 60)}h`;
}

export const REPORTS: Report[] = [
  {
    id: "rep-01",
    category: "counterfeit",
    severity: "Critical",
    status: "Escalated",
    contentType: "listing",
    reporterType: "Automated detection",
    title: `Listing "iPhone 15 Pro — Factory Sealed, A+ Grade" flagged for counterfeit claim`,
    snippet: "Classifier matched known counterfeit-ring phrasing and a serial-number pattern already blocklisted on 11 prior listings from related accounts.",
    policyMatched: "Community Guidelines §4.2 — Counterfeit & IP",
    actorName: "Idris Malik",
    assignedReviewer: "Priya Chandran",
    receivedMinutesAgo: 54,
    history: [
      { label: "Flagged by automated detection", atLabel: "54m ago" },
      { label: "Assigned to Priya Chandran", atLabel: "41m ago" },
      { label: "Escalated to senior review", atLabel: "9m ago" },
    ],
  },
  {
    id: "rep-02",
    category: "scam_fraud",
    severity: "Critical",
    status: "New",
    contentType: "message",
    reporterType: "User report",
    title: "Buyer reports off-platform payment request after sale confirmation",
    snippet: `Seller asked buyer to "cancel the order and pay by wire instead for a 10% discount" — matches the off-platform-payment scam template.`,
    policyMatched: "Community Guidelines §6.1 — Payment Fraud",
    actorName: "Grant Whitfield",
    assignedReviewer: null,
    receivedMinutesAgo: 8,
    history: [{ label: "Flagged by buyer", atLabel: "8m ago" }],
  },
  {
    id: "rep-03",
    category: "harassment",
    severity: "High",
    status: "In Review",
    contentType: "comment",
    reporterType: "User report",
    title: "Repeated hostile comments on seller's review thread",
    snippet: "Four comments in two hours directed at the same seller, escalating from criticism to personal insults about the seller's background.",
    policyMatched: "Community Guidelines §2.3 — Harassment",
    actorName: "Harlan Voss",
    assignedReviewer: "Marcus Webb",
    receivedMinutesAgo: 71,
    history: [
      { label: "Flagged by seller", atLabel: "1h 11m ago" },
      { label: "Assigned to Marcus Webb", atLabel: "52m ago" },
    ],
  },
  {
    id: "rep-04",
    category: "hate_speech",
    severity: "Critical",
    status: "In Review",
    contentType: "profile",
    reporterType: "Partner flag",
    title: "Profile bio flagged by regional partner for targeted slurs",
    snippet: "Partner moderation team in the DE market flagged the bio field for language targeting a protected group; translation attached to the report.",
    policyMatched: "Community Guidelines §1.1 — Hate Speech",
    actorName: "Tobias Lindqvist",
    assignedReviewer: "Elena Kovac",
    receivedMinutesAgo: 19,
    history: [
      { label: "Flagged by partner moderation (DE)", atLabel: "19m ago" },
      { label: "Assigned to Elena Kovac", atLabel: "12m ago" },
    ],
  },
  {
    id: "rep-05",
    category: "spam",
    severity: "Low",
    status: "New",
    contentType: "comment",
    reporterType: "Automated detection",
    title: "Bulk-posted comment linking to an external storefront",
    snippet: "Identical comment text posted on 23 unrelated listings within nine minutes, each linking to the same off-platform domain.",
    policyMatched: "Community Guidelines §5.4 — Spam & Platform Circumvention",
    actorName: "Mireille Dupont",
    assignedReviewer: null,
    receivedMinutesAgo: 203,
    history: [{ label: "Flagged by automated detection", atLabel: "3h 23m ago" }],
  },
  {
    id: "rep-06",
    category: "counterfeit",
    severity: "High",
    status: "New",
    contentType: "listing",
    reporterType: "User report",
    title: `Listing "Designer Tote — Mirror Quality" flagged by brand-rights holder`,
    snippet: "Rights holder's monitoring account reports unauthorized use of registered trademark imagery in listing photos.",
    policyMatched: "Community Guidelines §4.2 — Counterfeit & IP",
    actorName: "Celine Moreau",
    assignedReviewer: null,
    receivedMinutesAgo: 34,
    history: [{ label: "Flagged by rights holder", atLabel: "34m ago" }],
  },
  {
    id: "rep-07",
    category: "impersonation",
    severity: "High",
    status: "Escalated",
    contentType: "profile",
    reporterType: "User report",
    title: "Profile impersonating a verified top-rated seller",
    snippet: "Reporter attached a side-by-side of the two profile photos and shop names; the newer account copies the verified seller's banner exactly.",
    policyMatched: "Community Guidelines §3.2 — Impersonation",
    actorName: "Idris Malik",
    assignedReviewer: "Marcus Webb",
    receivedMinutesAgo: 146,
    history: [
      { label: "Flagged by affected seller", atLabel: "2h 26m ago" },
      { label: "Assigned to Marcus Webb", atLabel: "2h ago" },
      { label: "Escalated — second impersonation report on this account", atLabel: "38m ago" },
    ],
  },
  {
    id: "rep-08",
    category: "graphic_content",
    severity: "Critical",
    status: "New",
    contentType: "review",
    reporterType: "Automated detection",
    title: "Review photo flagged by image classifier for graphic content",
    snippet: "Attached review photo scored above the graphic-content threshold by the automated image classifier; pending human confirmation before removal.",
    policyMatched: "Community Guidelines §2.1 — Graphic Content",
    actorName: "Oren Katz",
    assignedReviewer: null,
    receivedMinutesAgo: 3,
    history: [{ label: "Flagged by automated image classifier", atLabel: "3m ago" }],
  },
  {
    id: "rep-09",
    category: "scam_fraud",
    severity: "High",
    status: "In Review",
    contentType: "listing",
    reporterType: "User report",
    title: `Listing "Gaming GPU — Open Box" reported as never-ship scam`,
    snippet: "Three buyers in the past 48 hours report payment taken but no shipping confirmation, no response to messages.",
    policyMatched: "Community Guidelines §6.1 — Payment Fraud",
    actorName: "Simone Okafor",
    assignedReviewer: "Devon Osei",
    receivedMinutesAgo: 98,
    history: [
      { label: "Flagged by buyer", atLabel: "1h 38m ago" },
      { label: "Assigned to Devon Osei", atLabel: "1h 10m ago" },
    ],
  },
  {
    id: "rep-10",
    category: "spam",
    severity: "Medium",
    status: "Resolved",
    contentType: "message",
    reporterType: "User report",
    title: "Unsolicited bulk message promoting an external referral scheme",
    snippet: "Identical referral-scheme message sent to 40+ sellers in one hour; removed and the sending account rate-limited.",
    policyMatched: "Community Guidelines §5.4 — Spam & Platform Circumvention",
    actorName: "Petra Vance",
    assignedReviewer: "Sana Iqbal",
    receivedMinutesAgo: 612,
    history: [
      { label: "Flagged by recipient", atLabel: "10h 12m ago" },
      { label: "Assigned to Sana Iqbal", atLabel: "9h ago" },
      { label: "Resolved — message removed, account rate-limited", atLabel: "6h ago" },
    ],
  },
  {
    id: "rep-11",
    category: "harassment",
    severity: "Medium",
    status: "New",
    contentType: "message",
    reporterType: "User report",
    title: "Buyer reports threatening message after a return dispute",
    snippet: `Message includes "I know where your shop is listed" following a rejected return request; attached in full to the report.`,
    policyMatched: "Community Guidelines §2.3 — Harassment",
    actorName: "Noah Castellan",
    assignedReviewer: null,
    receivedMinutesAgo: 27,
    history: [{ label: "Flagged by seller", atLabel: "27m ago" }],
  },
  {
    id: "rep-12",
    category: "counterfeit",
    severity: "Medium",
    status: "In Review",
    contentType: "listing",
    reporterType: "Automated detection",
    title: `Listing "Running Shoes — Premium Replica" flagged for self-disclosed counterfeit`,
    snippet: `Listing title itself contains "replica" alongside a registered brand name — caught by the brand-term + replica-term co-occurrence rule.`,
    policyMatched: "Community Guidelines §4.2 — Counterfeit & IP",
    actorName: "Felix Ngatia",
    assignedReviewer: "Priya Chandran",
    receivedMinutesAgo: 182,
    history: [
      { label: "Flagged by automated detection", atLabel: "3h 2m ago" },
      { label: "Assigned to Priya Chandran", atLabel: "2h 40m ago" },
    ],
  },
  {
    id: "rep-13",
    category: "graphic_content",
    severity: "Low",
    status: "Resolved",
    contentType: "comment",
    reporterType: "User report",
    title: "Comment containing a graphic external image link",
    snippet: "Comment contained a disguised link resolving to graphic content; removed under the graphic-content link policy.",
    policyMatched: "Community Guidelines §2.1 — Graphic Content",
    actorName: "Rosalind Pryce",
    assignedReviewer: "Elena Kovac",
    receivedMinutesAgo: 1340,
    history: [
      { label: "Flagged by reader", atLabel: "22h 20m ago" },
      { label: "Resolved — comment removed", atLabel: "20h ago" },
    ],
  },
  {
    id: "rep-14",
    category: "impersonation",
    severity: "Medium",
    status: "New",
    contentType: "profile",
    reporterType: "Partner flag",
    title: "Shop name near-duplicate of an established storefront",
    snippet: "Partner brand-protection scan flagged a one-character shop-name variant with matching logo colours opened two days ago.",
    policyMatched: "Community Guidelines §3.2 — Impersonation",
    actorName: "Amos Teller",
    assignedReviewer: null,
    receivedMinutesAgo: 61,
    history: [{ label: "Flagged by partner brand-protection scan", atLabel: "1h 1m ago" }],
  },
  {
    id: "rep-15",
    category: "scam_fraud",
    severity: "Medium",
    status: "In Review",
    contentType: "review",
    reporterType: "Automated detection",
    title: "Review cluster flagged for coordinated fake-positive pattern",
    snippet: "14 five-star reviews posted within six minutes from accounts created the same week, each with near-identical phrasing.",
    policyMatched: "Community Guidelines §7.0 — Review Manipulation",
    actorName: "Bianca Suarez",
    assignedReviewer: "Devon Osei",
    receivedMinutesAgo: 254,
    history: [
      { label: "Flagged by automated detection", atLabel: "4h 14m ago" },
      { label: "Assigned to Devon Osei", atLabel: "3h 40m ago" },
    ],
  },
  {
    id: "rep-16",
    category: "hate_speech",
    severity: "High",
    status: "New",
    contentType: "review",
    reporterType: "User report",
    title: "Review text flagged for slurs directed at the seller's nationality",
    snippet: "Review left on a completed order contains language targeting the seller's nationality; full text attached to the report.",
    policyMatched: "Community Guidelines §1.1 — Hate Speech",
    actorName: "Declan Marsh",
    assignedReviewer: null,
    receivedMinutesAgo: 44,
    history: [{ label: "Flagged by seller", atLabel: "44m ago" }],
  },
  {
    id: "rep-17",
    category: "harassment",
    severity: "Low",
    status: "Resolved",
    contentType: "comment",
    reporterType: "User report",
    title: "Sarcastic but policy-compliant comment, reporter requested re-review",
    snippet: "Original report over-read the tone; reviewed against the harassment rubric and left standing as within policy.",
    policyMatched: "Community Guidelines §2.3 — Harassment",
    actorName: "Freya Lindström",
    assignedReviewer: "Sana Iqbal",
    receivedMinutesAgo: 1890,
    history: [
      { label: "Flagged by reader", atLabel: "1d 7h ago" },
      { label: "Resolved — no action, within policy", atLabel: "1d 2h ago" },
    ],
  },
  {
    id: "rep-18",
    category: "spam",
    severity: "Low",
    status: "In Review",
    contentType: "listing",
    reporterType: "Automated detection",
    title: "Listing description flagged for keyword-stuffing pattern",
    snippet: "Description repeats unrelated trending search terms 30+ times, consistent with search-ranking manipulation rather than product detail.",
    policyMatched: "Community Guidelines §5.4 — Spam & Platform Circumvention",
    actorName: "Omar Chaudhry",
    assignedReviewer: "Marcus Webb",
    receivedMinutesAgo: 410,
    history: [
      { label: "Flagged by automated detection", atLabel: "6h 50m ago" },
      { label: "Assigned to Marcus Webb", atLabel: "6h ago" },
    ],
  },
  {
    id: "rep-19",
    category: "scam_fraud",
    severity: "High",
    status: "New",
    contentType: "message",
    reporterType: "User report",
    title: "Message impersonating Siftline support requesting account credentials",
    snippet: `Message claims to be "Fieldgood Account Security" and asks the recipient to confirm a password via an external link.`,
    policyMatched: "Community Guidelines §6.1 — Payment Fraud",
    actorName: "Lucia Ferreira",
    assignedReviewer: null,
    receivedMinutesAgo: 16,
    history: [{ label: "Flagged by recipient", atLabel: "16m ago" }],
  },
  {
    id: "rep-20",
    category: "counterfeit",
    severity: "Low",
    status: "New",
    contentType: "listing",
    reporterType: "User report",
    title: "Listing photos reused from a known-counterfeit storefront",
    snippet: "Reverse-image match against a previously removed counterfeit listing's photo set; product description differs slightly.",
    policyMatched: "Community Guidelines §4.2 — Counterfeit & IP",
    actorName: "Yusra Haidari",
    assignedReviewer: null,
    receivedMinutesAgo: 95,
    history: [{ label: "Flagged by buyer", atLabel: "1h 35m ago" }],
  },
  {
    id: "rep-21",
    category: "hate_speech",
    severity: "Medium",
    status: "Resolved",
    contentType: "comment",
    reporterType: "Partner flag",
    title: "Comment thread flagged by partner for coded hateful language",
    snippet: "Partner classifier flagged a term used as a coded slur in the relevant regional context; confirmed and removed on review.",
    policyMatched: "Community Guidelines §1.1 — Hate Speech",
    actorName: "Simone Okafor",
    assignedReviewer: "Elena Kovac",
    receivedMinutesAgo: 980,
    history: [
      { label: "Flagged by partner moderation", atLabel: "16h 20m ago" },
      { label: "Assigned to Elena Kovac", atLabel: "15h ago" },
      { label: "Resolved — comment removed, warning issued", atLabel: "13h ago" },
    ],
  },
  {
    id: "rep-22",
    category: "impersonation",
    severity: "Low",
    status: "In Review",
    contentType: "profile",
    reporterType: "User report",
    title: "Profile photo matches a public figure's press photo",
    snippet: "Reporter notes the profile photo appears to be a cropped press photo of an unrelated public figure, not the account holder.",
    policyMatched: "Community Guidelines §3.2 — Impersonation",
    actorName: "Idris Malik",
    assignedReviewer: "Priya Chandran",
    receivedMinutesAgo: 320,
    history: [
      { label: "Flagged by reader", atLabel: "5h 20m ago" },
      { label: "Assigned to Priya Chandran", atLabel: "4h 50m ago" },
    ],
  },
  {
    id: "rep-23",
    category: "graphic_content",
    severity: "High",
    status: "Escalated",
    contentType: "listing",
    reporterType: "Automated detection",
    title: "Listing thumbnail flagged for graphic imagery in a non-graphic category",
    snippet: "Thumbnail classifier score far exceeds threshold for the listed category (home goods); likely a swapped or compromised image slot.",
    policyMatched: "Community Guidelines §2.1 — Graphic Content",
    actorName: "Noah Castellan",
    assignedReviewer: "Devon Osei",
    receivedMinutesAgo: 112,
    history: [
      { label: "Flagged by automated image classifier", atLabel: "1h 52m ago" },
      { label: "Assigned to Devon Osei", atLabel: "1h 30m ago" },
      { label: "Escalated — image may indicate account compromise", atLabel: "14m ago" },
    ],
  },
  {
    id: "rep-24",
    category: "spam",
    severity: "Medium",
    status: "New",
    contentType: "review",
    reporterType: "Automated detection",
    title: "Review flagged for unrelated promotional content",
    snippet: "Review text promotes a competing storefront by name rather than describing the purchased item, matching the off-topic-promo pattern.",
    policyMatched: "Community Guidelines §5.4 — Spam & Platform Circumvention",
    actorName: "Felix Ngatia",
    assignedReviewer: null,
    receivedMinutesAgo: 51,
    history: [{ label: "Flagged by automated detection", atLabel: "51m ago" }],
  },
];

export const DEFAULT_SELECTED_ID = REPORTS.filter((r) => r.status !== "Resolved").reduce((worst, r) => (slaMinutesRemaining(r) < slaMinutesRemaining(worst) ? r : worst)).id;

export function relatedReports(report: Report): Report[] {
  return REPORTS.filter((r) => r.actorName === report.actorName && r.id !== report.id);
}

/* ---------------------------------------------------------------------------- queue scope / sort */

export type QueueScope = "mine" | "team" | "all";
export const QUEUE_SCOPE_OPTIONS: { id: QueueScope; label: string }[] = [
  { id: "mine", label: "My queue" },
  { id: "team", label: "Team queue" },
  { id: "all", label: "All reports" },
];

export function inScope(r: Report, scope: QueueScope): boolean {
  if (scope === "mine") return r.assignedReviewer === CURRENT_USER.name;
  if (scope === "team") return r.assignedReviewer != null;
  return true;
}

export type SortKey = "newest" | "oldest" | "severity";
export const SORT_OPTIONS: { id: SortKey; label: string }[] = [
  { id: "newest", label: "Newest" },
  { id: "oldest", label: "Oldest" },
  { id: "severity", label: "Severity" },
];

export function sortReports(rows: Report[], sort: SortKey): Report[] {
  const copy = [...rows];
  copy.sort((a, b) => {
    if (sort === "newest") return a.receivedMinutesAgo - b.receivedMinutesAgo;
    if (sort === "oldest") return b.receivedMinutesAgo - a.receivedMinutesAgo;
    const rankDiff = SEVERITY_RANK[b.severity] - SEVERITY_RANK[a.severity];
    return rankDiff !== 0 ? rankDiff : a.receivedMinutesAgo - b.receivedMinutesAgo;
  });
  return copy;
}

/* ------------------------------------------------------------------------------- queue volume */

export const WINDOW_START = "2026-10-15";
export const QUEUE_VOLUME = [21, 24, 19, 27, 31, 23, 20, 29, 35, 33, 28, 31, 38, 34];

function addDays(iso: string, days: number): string {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export function offsetToDate(offset: number): Date {
  return new Date(`${addDays(WINDOW_START, offset)}T00:00:00Z`);
}

const SHORT_DATE = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });
export function formatShortDate(offset: number): string {
  return SHORT_DATE.format(offsetToDate(offset));
}

export const COUNT_FMT = new Intl.NumberFormat("en-US");

/* -------------------------------------------------------------------------------------- search */

export type SearchEntry = { id: string; kind: "report" | "scope" | "category"; title: string; meta: string; Icon: LucideIcon; reportId?: string; scope?: QueueScope; category?: Category | "all" };

export const SEARCH_ENTRIES: SearchEntry[] = [
  ...QUEUE_SCOPE_OPTIONS.map((s) => ({ id: `scope-${s.id}`, kind: "scope" as const, title: `View: ${s.label}`, meta: "Switch queue view", Icon: Inbox, scope: s.id })),
  { id: "cat-all", kind: "category" as const, title: "Filter: All categories", meta: "Clear category filter", Icon: ListChecks, category: "all" as const },
  ...Object.entries(CATEGORY_META).map(([id, meta]) => ({ id: `cat-${id}`, kind: "category" as const, title: `Filter: ${meta.label}`, meta: "Narrow the queue to this category", Icon: meta.Icon, category: id as Category })),
  ...REPORTS.map((r) => ({ id: `report-${r.id}`, kind: "report" as const, title: r.title, meta: `${CATEGORY_META[r.category].label} · ${r.actorName}`, Icon: Scale, reportId: r.id })),
];
