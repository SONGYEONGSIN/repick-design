// native/src/evolve/r39/a/data.ts
//
// Deterministic Price Match Request dummy data. No Math.random/Date.now/
// no-argument new Date() anywhere — every date and id below is a fixed
// literal string.

export type PriceMatchReasonKey =
  | "identical-listing-lower-price"
  | "lower-price-plus-shipping"
  | "price-dropped-after-purchase"
  | "coupon-or-bundle-discount";

export interface PriceMatchReasonOption {
  key: PriceMatchReasonKey;
  label: string;
  helperText: string;
}

// Short, fixed list of reasons a buyer can cite — the brief calls for "a
// short fixed list", so this is intentionally not open text.
export const priceMatchReasonOptions: PriceMatchReasonOption[] = [
  {
    key: "identical-listing-lower-price",
    label: "Identical listing, lower price elsewhere",
    helperText: "Same brand, size, and condition, listed for less.",
  },
  {
    key: "lower-price-plus-shipping",
    label: "Lower price plus free shipping",
    helperText: "The other listing's total cost beats ours after shipping.",
  },
  {
    key: "price-dropped-after-purchase",
    label: "Price dropped after I purchased",
    helperText: "The exact listing you bought later dropped in price.",
  },
  {
    key: "coupon-or-bundle-discount",
    label: "Coupon or bundle makes it cheaper elsewhere",
    helperText: "A stacked discount brings the other total below ours.",
  },
];

export function reasonLabelFor(key: PriceMatchReasonKey): string {
  const match = priceMatchReasonOptions.find((option) => option.key === key);
  return match ? match.label : "";
}

export type PriceMatchRequestStatus = "pending" | "approved" | "denied";

export interface PriceMatchRequestRecord {
  id: string;
  submittedOnLabel: string;
  reasonLabel: string;
  evidenceSummary: string;
  note?: string;
  status: PriceMatchRequestStatus;
  // Only present when status is "denied".
  denialReason?: string;
}

// At least 3 past submissions with varied statuses, per the brief —
// this set has one pending, one approved, and two denied (each with its
// own denial reason) so the status rendering is exercised fully.
export const pastPriceMatchRequests: PriceMatchRequestRecord[] = [
  {
    id: "pm-req-1004",
    submittedOnLabel: "Oct 9, 2026",
    reasonLabel: "Identical listing, lower price elsewhere",
    evidenceSummary: "Link: resale-app.example/listing/48821",
    note: "Same brand and size, slightly different photos but same item.",
    status: "pending",
  },
  {
    id: "pm-req-1003",
    submittedOnLabel: "Oct 2, 2026",
    reasonLabel: "Lower price plus free shipping",
    evidenceSummary: "Screenshot: cheaper-tote-listing.png",
    status: "approved",
  },
  {
    id: "pm-req-1002",
    submittedOnLabel: "Sep 24, 2026",
    reasonLabel: "Price dropped after I purchased",
    evidenceSummary: "Link: resale-app.example/listing/40213",
    status: "denied",
    denialReason:
      "The cited listing's price dropped after your purchase date, which isn't eligible for a price match.",
  },
  {
    id: "pm-req-1001",
    submittedOnLabel: "Sep 15, 2026",
    reasonLabel: "Coupon or bundle makes it cheaper elsewhere",
    evidenceSummary: "Link: thrift-finds.example/post/2291",
    note: "Found through a storewide 20% off code.",
    status: "denied",
    denialReason:
      "The lower price required a storewide coupon that isn't available to all buyers, so it doesn't qualify.",
  },
];

// Fixed "today" literal used only for the id/date of a freshly-submitted
// request in this session — a hardcoded string, never new Date().
export const SUBMISSION_TODAY_LABEL = "Oct 14, 2026";
export const NEXT_SUBMISSION_ID = "pm-req-1005";
