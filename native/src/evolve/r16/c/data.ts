// native/src/evolve/r16/c/data.ts — deterministic dummy data for Report Listing screen
// No Math.random / Date.now / bare `new Date()` anywhere below.

export type ReasonId =
  | "counterfeit"
  | "misleading"
  | "prohibited"
  | "scam"
  | "other";

export interface ReportReason {
  id: ReasonId;
  label: string;
  description: string;
}

// Fixed 5-item reason list (within the 4-6 spec range).
export const REPORT_REASONS: ReportReason[] = [
  {
    id: "counterfeit",
    label: "Counterfeit item",
    description: "Looks like a fake or replica of a branded product",
  },
  {
    id: "misleading",
    label: "Misleading photos",
    description: "Photos don't match the condition or item described",
  },
  {
    id: "prohibited",
    label: "Prohibited item",
    description: "Not allowed on repick (e.g. recalled, hazardous)",
  },
  {
    id: "scam",
    label: "Scam or spam",
    description: "Fake listing, off-platform payment request, or spam",
  },
  {
    id: "other",
    label: "Other",
    description: "Something else that isn't covered above",
  },
];

// The listing being reported — fixed values, no live data source.
export const REPORTED_LISTING = {
  id: "lst-20831",
  title: "Vintage Leather Camera Bag",
  seller: "seller_marina92",
  priceKrw: 68000,
} as const;
