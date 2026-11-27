// native/src/evolve/r62/b/data.ts
//
// Deterministic dummy data for the "Cross-List to Meridian Marketplace"
// screen. No Math.random, no Date.now, no argument-less `new Date()` —
// every listing's state is a literal, and the only runtime transition
// (resolveCrossPostOutcome) is a pure, fixed lookup.

export type SyncStatus = "notPosted" | "posted" | "syncError";

// Eligibility is modeled as its own union rather than a boolean so an
// ineligible row can carry *why* it's ineligible without borrowing the
// syncError messaging that's reserved for a failed cross-post attempt on an
// otherwise-eligible listing.
export type PartnerEligibility =
  | { kind: "eligible" }
  | { kind: "unsupportedCategory"; reason: string };

export interface PartnerListing {
  id: string;
  title: string;
  category: string;
  conditionLabel: string;
  ageLabel: string;
  eligibility: PartnerEligibility;
  syncStatus: SyncStatus;
  // Only ever surfaced once a listing has actually reached "syncError" —
  // never read while syncStatus is notPosted/posted, so it can't leak an
  // error explanation for a row that never failed.
  retryHint?: string;
}

export const PARTNER_NAME = "Meridian Marketplace";

export const INITIAL_LISTINGS: PartnerListing[] = [
  {
    id: "pl-1",
    title: "Vintage Denim Trucker Jacket",
    category: "Apparel",
    conditionLabel: "Good",
    ageLabel: "Listed 6 days ago",
    eligibility: { kind: "eligible" },
    syncStatus: "notPosted",
  },
  {
    id: "pl-2",
    title: "Mid-Century Rattan Lamp",
    category: "Home Decor",
    conditionLabel: "Very Good",
    ageLabel: "Listed 11 days ago",
    eligibility: { kind: "eligible" },
    syncStatus: "notPosted",
  },
  {
    id: "pl-3",
    title: "Electric Pressure Washer",
    category: "Tools & Outdoor",
    conditionLabel: "Good",
    ageLabel: "Listed 3 days ago",
    eligibility: { kind: "eligible" },
    syncStatus: "notPosted",
    retryHint:
      "Meridian routes this subcategory through manual review before it will sync.",
  },
  {
    id: "pl-4",
    title: "Leather Messenger Bag",
    category: "Apparel",
    conditionLabel: "Like New",
    ageLabel: "Listed 21 days ago",
    eligibility: { kind: "eligible" },
    syncStatus: "posted",
  },
  {
    id: "pl-5",
    title: "Antique Pocket Watch",
    category: "Fine Jewelry",
    conditionLabel: "Fair",
    ageLabel: "Listed 30 days ago",
    eligibility: {
      kind: "unsupportedCategory",
      reason: "Meridian does not accept Fine Jewelry from third-party sellers.",
    },
    syncStatus: "notPosted",
  },
  {
    id: "pl-6",
    title: "Framed Botanical Print Set",
    category: "Home Decor",
    conditionLabel: "Good",
    ageLabel: "Listed 9 days ago",
    eligibility: { kind: "eligible" },
    syncStatus: "notPosted",
  },
  {
    id: "pl-7",
    title: "Car Stereo Head Unit",
    category: "Used Electronics",
    conditionLabel: "Fair",
    ageLabel: "Listed 17 days ago",
    eligibility: {
      kind: "unsupportedCategory",
      reason: "Used Electronics need a Meridian-certified refurbisher account.",
    },
    syncStatus: "notPosted",
  },
  {
    id: "pl-8",
    title: "Ceramic Vase Trio",
    category: "Home Decor",
    conditionLabel: "Good",
    ageLabel: "Listed 4 days ago",
    eligibility: { kind: "eligible" },
    syncStatus: "notPosted",
  },
];

// Fixed, literal outcome table for what happens when a given listing id is
// included in a cross-post batch. "pl-3" always fails (its retryHint above
// explains why); every other id always succeeds. This is what makes the
// "syncError" branch reachable through a real user action (select pl-3,
// press the bar's action) instead of being a type-only dead state, while
// staying fully deterministic.
const BATCH_OUTCOME_BY_ID: Readonly<Record<string, SyncStatus>> = {
  "pl-3": "syncError",
};

export function resolveCrossPostOutcome(listingId: string): SyncStatus {
  return BATCH_OUTCOME_BY_ID[listingId] ?? "posted";
}
