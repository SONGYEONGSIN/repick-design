// native/src/evolve/r44/a/data.ts — deterministic dummy data for the
// Authenticity Escalation Case screen (auto-native-r44 candidate a).
// No Math.random / Date.now / bare `new Date()` anywhere — every date and id
// below is a fixed literal.

export type PriorAuthStatus = "certified" | "none" | "flagged";

export type OrderRecord = {
  id: string;
  itemTitle: string;
  brand: string;
  variant: string;
  priceWon: number;
  purchasedDateLabel: string;
  receivedDateLabel: string;
  sellerName: string;
};

export type PriorAuthRecord = {
  status: PriorAuthStatus;
  summary: string;
  certId?: string;
  dateLabel?: string;
};

export type IssueArea = {
  id: string;
  label: string;
};

// The order this case is being opened against. Fixed so render output never
// shifts between runs.
export const ORDER: OrderRecord = {
  id: "ORD-77291",
  itemTitle: "Mono Monogram Zip Tote",
  brand: "Maison Argent",
  variant: "Size M · Chestnut",
  priceWon: 486000,
  purchasedDateLabel: "Sep 14, 2026",
  receivedDateLabel: "Sep 19, 2026",
  sellerName: "atelier.seoul",
};

// What (if anything) repick's own authentication pipeline already said about
// this exact item before it was listed. "certified" is the sharper case for
// this screen: the buyer is now contesting a result repick's own lab signed
// off on, not just an unvetted listing.
export const PRIOR_AUTH: PriorAuthRecord = {
  status: "certified",
  summary: "Authenticated by Repick Labs before this listing went live.",
  certId: "RPK-00482",
  dateLabel: "Sep 10, 2026",
};

// Non-gating classification chips — help the authentication team triage, but
// submission never depends on any of these being picked.
export const ISSUE_AREAS: IssueArea[] = [
  { id: "logo", label: "Logo / branding" },
  { id: "stitching", label: "Stitching & seams" },
  { id: "hardware", label: "Hardware & zippers" },
  { id: "material", label: "Material & texture" },
  { id: "serial", label: "Serial / date code" },
  { id: "packaging", label: "Box, dust bag & papers" },
  { id: "other", label: "Something else" },
];

export const MIN_PHOTOS = 1;
export const MAX_PHOTOS = 6;
export const MIN_DESCRIPTION_LENGTH = 20;
export const MAX_DESCRIPTION_LENGTH = 400;

// Reference shown once the case is filed. A real backend would mint this;
// here it is a fixed literal so the "done" state renders identically every
// time.
export const CASE_REFERENCE = "ESC-48217";
export const FILED_DATE_LABEL = "Oct 28, 2026";
export const REVIEW_WINDOW_LABEL = "Expect a decision within 3 business days.";

export function formatWon(amount: number): string {
  // Space between the ₩ glyph and the digits per native/GENERATION.md §1 —
  // keeps the glyph's stroke from crowding the adjacent number.
  return `₩ ${amount.toLocaleString("en-US")}`;
}
