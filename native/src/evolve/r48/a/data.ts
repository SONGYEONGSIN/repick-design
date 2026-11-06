// native/src/evolve/r48/a/data.ts
// Deterministic dummy data for the Storefront Profile Editor screen.
// No Math.random / Date.now / new Date anywhere — every value is fixed.

export type CoverSwatchKey = "swatch1" | "swatch2" | "swatch3";

export type AvailabilityState = "online" | "away";

export interface FeaturedListingStub {
  id: string;
  title: string;
  priceLabel: string;
}

export interface StorefrontDraft {
  displayName: string;
  bioText: string;
  coverSwatchKey: CoverSwatchKey;
  /** Order = display order on the public storefront header, up to 3 entries. */
  featuredOrderIds: string[];
  availabilityState: AvailabilityState;
}

export const BIO_CHARACTER_LIMIT = 160;

export const COVER_SWATCH_OPTIONS: ReadonlyArray<{ key: CoverSwatchKey; label: string }> = [
  { key: "swatch1", label: "Light slate" },
  { key: "swatch2", label: "Mid slate" },
  { key: "swatch3", label: "Deep slate" },
];

/** Fixed catalog of the seller's existing listings eligible to be pinned/featured. */
export const FEATURED_LISTING_CATALOG: ReadonlyArray<FeaturedListingStub> = [
  { id: "ls-101", title: "Washed denim jacket", priceLabel: "$38" },
  { id: "ls-204", title: "Canvas tote bag", priceLabel: "$14" },
  { id: "ls-317", title: "Knit crewneck sweater", priceLabel: "$22" },
];

/** The last-published storefront profile — doubles as the initial draft and the initial saved snapshot. */
export const PUBLISHED_STOREFRONT_PROFILE: StorefrontDraft = {
  displayName: "Marlowe & Co. Vintage",
  bioText: "Curated secondhand staples, refreshed every weekend. Based in Portland.",
  coverSwatchKey: "swatch2",
  featuredOrderIds: ["ls-101", "ls-204", "ls-317"],
  availabilityState: "online",
};
