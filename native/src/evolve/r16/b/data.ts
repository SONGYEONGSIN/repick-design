// native/src/evolve/r16/b/data.ts
// Deterministic dummy data for the Bulk Relist screen.
// No Math.random / Date.now / new Date() — every value is a fixed literal.

export interface Listing {
  id: string;
  title: string;
  /** 2-letter placeholder shown inside the thumbnail box (stand-in for a photo). */
  thumbLabel: string;
  /** Price in KRW at initial load, before any batch action. */
  originalPrice: number;
  /** Days the listing has been live, unsold, as of a fixed reference point. */
  daysListed: number;
  /** Fixed view count as of the same reference point. */
  views: number;
}

// All ten listings are deliberately "stale" (14+ days unsold) — this screen only
// ever shows aging inventory, so there is no separate fresh/stale split to model.
export const INITIAL_LISTINGS: Listing[] = [
  { id: "l1", title: "Oak Writing Desk", thumbLabel: "OD", originalPrice: 128000, daysListed: 62, views: 340 },
  { id: "l2", title: "Wool Peacoat, Size M", thumbLabel: "WP", originalPrice: 54000, daysListed: 41, views: 210 },
  { id: "l3", title: 'Cast Iron Skillet 12"', thumbLabel: "CI", originalPrice: 32000, daysListed: 88, views: 501 },
  { id: "l4", title: "Vintage Record Player", thumbLabel: "RP", originalPrice: 96000, daysListed: 29, views: 175 },
  { id: "l5", title: "Leather Messenger Bag", thumbLabel: "MB", originalPrice: 47000, daysListed: 55, views: 260 },
  { id: "l6", title: "Ceramic Table Lamp", thumbLabel: "TL", originalPrice: 21000, daysListed: 33, views: 98 },
  { id: "l7", title: 'Mountain Bike, 26"', thumbLabel: "MT", originalPrice: 215000, daysListed: 71, views: 620 },
  { id: "l8", title: "Set of 4 Dining Chairs", thumbLabel: "DC", originalPrice: 138000, daysListed: 19, views: 145 },
  { id: "l9", title: "Acoustic Guitar", thumbLabel: "AG", originalPrice: 165000, daysListed: 47, views: 388 },
  { id: "l10", title: "Wool Area Rug 5x7", thumbLabel: "AR", originalPrice: 72000, daysListed: 24, views: 132 },
];
