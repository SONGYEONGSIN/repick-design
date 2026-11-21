// Pure, deterministic query -> match-percent -> ranked-results pipeline. Nothing
// here reads Math.random, Date.now or new Date() — the same query always produces
// the same ranked list and the same percentages, every render, every visitor.
//
// Matching rule (AND, substring, per field weight): a listing qualifies only if
// EVERY whitespace-separated token in the query is found as a substring in at least
// one of that listing's fields. That's what makes the result set visibly NARROW as
// the query gets more specific ("camera" matches 3 listings; "sony camera" matches
// only 1) instead of just re-sorting the same fixed set.
//
// Match-percent rule: each matched token also carries a FIELD WEIGHT (which field it
// hit — brand/model are the most specific signal, category is medium, free-text
// descriptor/title is weakest). The percent blends the average field weight across
// the query's tokens with how many tokens the query had (a longer, more specific
// query reads as a more confident match), then clamps to a believable 60–97 band —
// never claiming a 100% AI match for a resale comp.

import type { Listing } from "./data";

export function tokenize(input: string): string[] {
  return input
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);
}

const FIELD_WEIGHTS = {
  brand: 3,
  model: 3,
  category: 2,
  descriptor: 1,
  title: 1,
} as const;

/** Highest field weight any field of `listing` matches `token` on, or 0 if none do. */
function tokenFieldWeight(token: string, listing: Listing): number {
  let best = 0;
  if (listing.brand.toLowerCase().includes(token)) best = Math.max(best, FIELD_WEIGHTS.brand);
  if (listing.model.toLowerCase().includes(token)) best = Math.max(best, FIELD_WEIGHTS.model);
  if (listing.category.toLowerCase().includes(token)) best = Math.max(best, FIELD_WEIGHTS.category);
  if (listing.descriptor.toLowerCase().includes(token)) best = Math.max(best, FIELD_WEIGHTS.descriptor);
  if (listing.title.toLowerCase().includes(token)) best = Math.max(best, FIELD_WEIGHTS.title);
  return best;
}

export interface RankedListing {
  listing: Listing;
  matchPercent: number;
  discountPercent: number;
}

const BROWSE_ALL_PERCENT = 75; // shown only when the query is empty (browse-all state)
const PERCENT_FLOOR = 60;
const PERCENT_CEILING = 97;

export function discountPercent(listing: Listing): number {
  return Math.round(((listing.originalPrice - listing.price) / listing.originalPrice) * 100);
}

/**
 * Ranks the fixed listing pool against `query`. Listings that don't match every
 * query token are left out entirely (not just sorted to the bottom) — that's the
 * "narrowing" behavior. Sorted by match percent, descending; ties keep the pool's
 * original (fixed) order, since Array.sort is stable and nothing here is random.
 */
export function filterAndRank(query: string, listings: Listing[]): RankedListing[] {
  const tokens = tokenize(query);

  if (tokens.length === 0) {
    return listings.map((listing) => ({
      listing,
      matchPercent: BROWSE_ALL_PERCENT,
      discountPercent: discountPercent(listing),
    }));
  }

  const ranked: RankedListing[] = [];
  for (const listing of listings) {
    const weights = tokens.map((t) => tokenFieldWeight(t, listing));
    const included = weights.every((w) => w > 0);
    if (!included) continue;

    const avgWeight = weights.reduce((sum, w) => sum + w, 0) / weights.length; // 1..3
    const specificity = Math.min(tokens.length, 3); // 1..3, caps so a 10-word query doesn't blow past 97
    const raw = 58 + avgWeight * 10 + specificity * 3;
    const matchPercent = Math.min(PERCENT_CEILING, Math.max(PERCENT_FLOOR, Math.round(raw)));

    ranked.push({ listing, matchPercent, discountPercent: discountPercent(listing) });
  }

  return ranked.sort((a, b) => b.matchPercent - a.matchPercent);
}

export interface SearchStats {
  count: number;
  topMatchPercent: number;
  avgDiscountPercent: number;
  verifiedSharePercent: number;
}

/** Live summary stats over the CURRENT ranked result set — null when there are none. */
export function computeSearchStats(results: RankedListing[]): SearchStats | null {
  if (results.length === 0) return null;

  const topMatchPercent = results.reduce((max, r) => Math.max(max, r.matchPercent), 0);
  const avgDiscountPercent = Math.round(
    results.reduce((sum, r) => sum + r.discountPercent, 0) / results.length,
  );
  const verifiedCount = results.filter((r) => r.listing.verifiedSeller).length;
  const verifiedSharePercent = Math.round((verifiedCount / results.length) * 100);

  return { count: results.length, topMatchPercent, avgDiscountPercent, verifiedSharePercent };
}
