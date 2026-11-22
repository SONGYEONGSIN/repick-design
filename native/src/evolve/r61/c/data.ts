// native/src/evolve/r61/c/data.ts
//
// Deterministic dummy data for the Dispute Resolution Outcome screen.
// No Math.random / Date.now / bare `new Date()` anywhere — every date below
// is a fixed display string, not a computed value.

export type OutcomeStatus = "resolved_buyer" | "resolved_seller" | "split";

export interface TimelineStep {
  id: string;
  label: string;
  date: string;
  detail: string;
}

export interface DisputeOutcomeRecord {
  caseId: string;
  itemTitle: string;
  orderId: string;
  disputeAmount: string;
  refundAmount: string;
  filedDate: string;
  resolvedDate: string;
  status: OutcomeStatus;
  statusLabel: string;
  decisionSummary: string;
  rationale: string;
  timeline: TimelineStep[];
}

export const disputeOutcome: DisputeOutcomeRecord = {
  caseId: "DSP-20261014-0192",
  itemTitle: "Leica M6 Camera Body, Black Chrome",
  orderId: "Order #RP-88214",
  disputeAmount: "$420.00",
  refundAmount: "$180.00",
  filedDate: "Oct 14, 2026",
  resolvedDate: "Nov 2, 2026",
  status: "resolved_buyer",
  statusLabel: "Resolved — Buyer",
  decisionSummary:
    "Resolved in buyer's favor — partial refund issued",
  rationale:
    "Listing photos showed no visible shutter curtain wear, but buyer-submitted photos confirmed curtain abrasion consistent with heavy use. Seller's condition grade (“Excellent”) did not match the item received. Support split the difference between full refund and no refund: a partial refund reflecting the item's actual condition, since the camera was otherwise functional and buyer chose to keep it.",
  timeline: [
    {
      id: "step-1",
      label: "Dispute Filed",
      date: "Oct 14, 2026",
      detail: "Buyer reported item condition did not match the listing.",
    },
    {
      id: "step-2",
      label: "Evidence Reviewed",
      date: "Oct 19, 2026",
      detail: "Support compared buyer photos against the original listing.",
    },
    {
      id: "step-3",
      label: "Seller Response Received",
      date: "Oct 24, 2026",
      detail: "Seller offered store credit; buyer declined and requested refund.",
    },
    {
      id: "step-4",
      label: "Resolution Issued",
      date: "Nov 2, 2026",
      detail: "Support issued a partial refund decision, closing the case.",
    },
  ],
};
