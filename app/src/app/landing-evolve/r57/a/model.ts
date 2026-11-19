/**
 * Pure, deterministic derivation functions. Every "live" number or cell state on this route comes
 * from running (listing, minPrice, maxPrice) through one of these — nothing is a hardcoded literal
 * typed at generation time, so a caption can never silently drift from the control it describes.
 */

import {
  CONDITION_PASS_RANK,
  LISTINGS,
  type Listing,
} from "./data";

export type CriterionId = "budget" | "condition" | "verified" | "ship";

export interface Criterion {
  id: CriterionId;
  label: string;
  passVerb: string;
  failVerb: string;
}

export const CRITERIA: Criterion[] = [
  { id: "budget", label: "Within budget", passVerb: "In range", failVerb: "Out of range" },
  { id: "condition", label: "Condition ≥ Good", passVerb: "Pass", failVerb: "Fail" },
  { id: "verified", label: "Verified seller", passVerb: "Pass", failVerb: "Fail" },
  { id: "ship", label: "Ships in 3 days", passVerb: "Pass", failVerb: "Fail" },
];

export function checkBudget(listing: Listing, min: number, max: number): boolean {
  return listing.price >= min && listing.price <= max;
}

export function checkCondition(listing: Listing): boolean {
  return listing.conditionRank >= CONDITION_PASS_RANK;
}

export function checkVerified(listing: Listing): boolean {
  return listing.verifiedSeller;
}

export function checkShip(listing: Listing): boolean {
  return listing.shipDays <= 3;
}

export type ChecksRow = Record<CriterionId, boolean>;

/** All four criterion results for one listing against the current range, in CRITERIA order. */
export function checksFor(listing: Listing, min: number, max: number): ChecksRow {
  return {
    budget: checkBudget(listing, min, max),
    condition: checkCondition(listing),
    verified: checkVerified(listing),
    ship: checkShip(listing),
  };
}

export function isEligible(listing: Listing, min: number, max: number): boolean {
  const row = checksFor(listing, min, max);
  return row.budget && row.condition && row.verified && row.ship;
}

export function eligibleCount(listings: Listing[], min: number, max: number): number {
  return listings.filter((l) => isEligible(l, min, max)).length;
}

export function eligibleListings(listings: Listing[], min: number, max: number): Listing[] {
  return listings.filter((l) => isEligible(l, min, max));
}

/** Cheapest currently-eligible price, or null when nothing qualifies at this range. */
export function cheapestEligiblePrice(listings: Listing[], min: number, max: number): number | null {
  const prices = eligibleListings(listings, min, max).map((l) => l.price);
  return prices.length ? Math.min(...prices) : null;
}

/** Average discount % among currently-eligible listings, or null when none qualify. */
export function averageEligibleDiscount(listings: Listing[], min: number, max: number): number | null {
  const eligible = eligibleListings(listings, min, max);
  if (eligible.length === 0) return null;
  const total = eligible.reduce((sum, l) => sum + discountPct(l), 0);
  return Math.round(total / eligible.length);
}

/**
 * Not specified by the brief: the "vs X" delta cited in the value-split and closing CTA compares
 * the live eligible count against the most this fixed catalog could EVER include — i.e. the same
 * eligibleCount() function evaluated at the control's own full bounds, not a separately typed
 * number that could go stale. Two listings (the Shearling jacket's late ship window and the Waxed
 * Canvas jacket's triple failure) are permanently ineligible no matter where the handles sit, so
 * this ceiling is always below the full catalog size — by design, to show budget isn't everything.
 */
export function maxAchievableCount(listings: Listing[], boundMin: number, boundMax: number): number {
  return eligibleCount(listings, boundMin, boundMax);
}

export function discountPct(listing: Listing): number {
  return Math.round(((listing.originalPrice - listing.price) / listing.originalPrice) * 100);
}

export function formatUsd(n: number): string {
  return `$${n.toLocaleString("en-US")}`;
}

export { LISTINGS };
