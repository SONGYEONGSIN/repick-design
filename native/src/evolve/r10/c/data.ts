// native/src/evolve/r10/c/data.ts — deterministic fixtures for ReportListingScreen.
// No Math.random / Date.now / bare `new Date()` — every value below is a fixed literal.

export type ReportReasonId =
  | "counterfeit"
  | "scam"
  | "photos"
  | "unresponsive"
  | "other";

export type ReportReason = {
  id: ReportReasonId;
  label: string;
  helper: string;
};

// The listing (and, by extension, its seller) this report screen was opened from.
// Repick's report sheet covers both listing-quality issues and seller-conduct issues in one
// reason list, so a single target card carries both identities instead of a listing/user toggle.
export const REPORT_TARGET = {
  listingTitle: "Vintage Leica M6 35mm Film Camera",
  listingPriceLabel: "₩820,000",
  listingCategoryLabel: "Cameras & Photo",
  listingPostedLabel: "Posted Aug 12, 2026",
  sellerName: "Minjun K.",
  sellerHandle: "@minjunk_trades",
  sellerRatingLabel: "4.8 seller rating · 61 completed trades",
};

export const REPORT_REASONS: ReportReason[] = [
  {
    id: "counterfeit",
    label: "Suspected counterfeit",
    helper: "The item doesn't look authentic, or the listing photos don't match a genuine product.",
  },
  {
    id: "scam",
    label: "Attempted scam",
    helper: "Seller asked to pay outside Repick, sent a suspicious link, or made false promises.",
  },
  {
    id: "photos",
    label: "Inappropriate photos",
    helper: "Listing photos show content unrelated to the item or contain inappropriate material.",
  },
  {
    id: "unresponsive",
    label: "Seller went silent",
    helper: "No response after purchase or after agreeing to a meetup time.",
  },
  {
    id: "other",
    label: "Other",
    helper: "Something else that isn't covered by the reasons above.",
  },
];

export const OTHER_DETAILS_MIN_LENGTH = 10;
export const OTHER_DETAILS_MAX_LENGTH = 280;

// Simulated network latency for the submit transition — fixed, not random.
export const SUBMIT_DELAY_MS = 900;

export const REPORT_REFERENCE_ID = "RPT-48213";
export const REVIEW_ETA_LABEL = "within 24 hours";
