// native/src/evolve/r42/b/data.ts
//
// Deterministic dummy data for the Report a Buyer screen. No Math.random,
// no Date.now, no argument-less `new Date()` — every value is a fixed
// literal or derived from fixed literals.

export type ReportReason = {
  id: string;
  label: string;
  helperText: string;
};

// Step 1 taxonomy. Seller-about-buyer complaint categories — distinct from
// the buyer-about-listing content taxonomy used elsewhere in this codebase
// (bad description, counterfeit, prohibited item, etc). These four cover
// the failure modes of a peer-to-peer meetup/payment transaction instead.
export const reportReasons: ReportReason[] = [
  {
    id: "no-show",
    label: "No-show at meetup",
    helperText:
      "Buyer agreed on a time and place but never arrived, or canceled repeatedly.",
  },
  {
    id: "never-paid",
    label: "Never paid",
    helperText:
      "Buyer committed to the purchase but never sent payment after agreeing.",
  },
  {
    id: "abusive-messages",
    label: "Abusive messages",
    helperText:
      "Buyer sent threatening, harassing, or abusive messages during the deal.",
  },
  {
    id: "other",
    label: "Other",
    helperText: "Something else happened that isn't covered above.",
  },
];

// The past transaction this report is filed against. Fixed values standing
// in for whatever order/listing the seller would have arrived from.
export const reportedTransaction = {
  buyerName: "Marcus Webb",
  buyerHandle: "@marcuswebb_",
  orderId: "ORD-48213",
  listingTitle: "Canon AE-1 35mm Film Camera",
  transactionDateLabel: "Oct 18, 2026",
  meetupLocationLabel: "Riverside Park, North Lot",
};

export const DETAILS_MIN_LENGTH = 10;
export const DETAILS_MAX_LENGTH = 500;

// Shown on the confirmation panel once submitted. Fixed string, not a
// generated id, so the screen stays deterministic.
export const submissionReferenceId = "RB-20261026-7731";
