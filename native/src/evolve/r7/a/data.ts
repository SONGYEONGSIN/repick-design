// native/src/evolve/r7/a/data.ts — auto-native-r7 candidate a (Dispute & Return Center).
// Deterministic dummy data only — no Math.random / Date.now / argument-less new Date() anywhere.
// Every date/time is a fixed literal label; "today" is treated as Sun, Aug 16 2026 to match the
// generation date, but that is a literal string, never derived from the real clock.

export type DisputeStatus = "in_review" | "resolved" | "draft" | "submitted";

export interface TimelineEvent {
  id: string;
  label: string;
  dateLabel: string;
  /** true = already happened, false = still pending/upcoming. */
  done: boolean;
}

export interface DisputeRecord {
  id: string;
  caseLabel: string;
  orderTitle: string;
  orderMeta: string;
  status: DisputeStatus;
  reasonLabel: string;
  openedLabel: string;
  resolvedLabel?: string;
  refundLabel?: string;
  timeline: TimelineEvent[];
}

export const STATUS_TEXT: Record<DisputeStatus, string> = {
  in_review: "Under review",
  resolved: "Resolved",
  draft: "Draft — not submitted",
  submitted: "Submitted",
};

// Two prior cases, newest first. Both fully resolved-or-in-progress — read only, expandable
// to show their timeline. The eligible-for-a-new-request order lives in ELIGIBLE_ORDER below,
// rendered inside the draft card the buyer builds live on this screen.
export const PRIOR_DISPUTES: DisputeRecord[] = [
  {
    id: "d-1042",
    caseLabel: "Case D-1042",
    orderTitle: "Nike Air Max 90 — Size 270",
    orderMeta: "Ordered Aug 3, 2026 · ₩142,000 · Seller: Jordan Lee",
    status: "in_review",
    reasonLabel: "Item arrived damaged",
    openedLabel: "Aug 10, 2026",
    timeline: [
      { id: "e1", label: "Request opened", dateLabel: "Aug 10, 2026", done: true },
      { id: "e2", label: "Evidence photos submitted", dateLabel: "Aug 10, 2026", done: true },
      { id: "e3", label: "Escalated to Repick review", dateLabel: "Aug 12, 2026", done: true },
      { id: "e4", label: "Decision expected", dateLabel: "By Aug 18, 2026", done: false },
    ],
  },
  {
    id: "d-0981",
    caseLabel: "Case D-0981",
    orderTitle: "Uniqlo Fleece Jacket — Size L",
    orderMeta: "Ordered Jul 24, 2026 · ₩38,000 · Seller: Haeun Kwon",
    status: "resolved",
    reasonLabel: "Item not as described",
    openedLabel: "Jul 28, 2026",
    resolvedLabel: "Aug 2, 2026",
    refundLabel: "₩38,000 refunded",
    timeline: [
      { id: "e1", label: "Request opened", dateLabel: "Jul 28, 2026", done: true },
      { id: "e2", label: "Evidence photos submitted", dateLabel: "Jul 28, 2026", done: true },
      { id: "e3", label: "Seller responded", dateLabel: "Jul 30, 2026", done: true },
      { id: "e4", label: "Refund approved", dateLabel: "Aug 1, 2026", done: true },
      { id: "e5", label: "Refund issued", dateLabel: "Aug 2, 2026", done: true },
    ],
  },
];

export const ELIGIBLE_ORDER = {
  title: "Sony WH-1000XM5 headphones",
  meta: "Delivered Aug 13, 2026 · ₩289,000 · Seller: Studio Audio Co.",
  windowLabel: "Return window closes Aug 20, 2026 (4 days left)",
};

export const REASON_OPTIONS = [
  { id: "not-described", label: "Item not as described" },
  { id: "damaged", label: "Item arrived damaged" },
  { id: "wrong-item", label: "Wrong item received" },
  { id: "missing-parts", label: "Missing parts or accessories" },
  { id: "counterfeit", label: "Item is counterfeit" },
  { id: "other", label: "Other" },
] as const;

export type ReasonId = (typeof REASON_OPTIONS)[number]["id"];

export const RESOLUTION_OPTIONS = [
  { id: "full-refund", label: "Full refund" },
  { id: "partial-refund", label: "Partial refund" },
  { id: "replacement", label: "Replacement item" },
  { id: "repair", label: "Repair" },
] as const;

export type ResolutionId = (typeof RESOLUTION_OPTIONS)[number]["id"];

export const MIN_DESCRIPTION_LENGTH = 20;
export const MIN_PHOTOS = 2;
export const MAX_PHOTOS = 5;

export const NEW_CASE_LABEL = "Case D-1129";
export const SUBMITTED_DATE_LABEL = "Aug 16, 2026";
