// native/src/evolve/r46/c/data.ts
// Deterministic dummy data for the Ended Listings (bulk relist) screen.
// No Math.random / Date.now / no-argument new Date() anywhere — every value
// below is a fixed literal so the screen renders the same way every time.

export type EndReason = "Expired" | "No offers";

export interface EndedListing {
  id: string;
  title: string;
  /** Short mark shown inside the thumbnail placeholder box (stand-in for a photo). */
  previewTag: string;
  /** Price in KRW the listing was posted at before it ended. */
  originalPrice: number;
  /** Why the listing ended without a sale. */
  endReason: EndReason;
  /** How many days the listing ran before it ended, as of a fixed reference point. */
  daysRun: number;
}

// Nine of the seller's own listings that ended without selling — the pool this
// screen draws from. Every one is eligible for relisting; none has sold.
export const ENDED_LISTINGS: EndedListing[] = [
  { id: "e1", title: "Mid-Century Armchair", previewTag: "MA", originalPrice: 145000, endReason: "Expired", daysRun: 45 },
  { id: "e2", title: "Canvas Backpack", previewTag: "CB", originalPrice: 38000, endReason: "No offers", daysRun: 21 },
  { id: "e3", title: "Enamel Dutch Oven", previewTag: "ED", originalPrice: 67000, endReason: "Expired", daysRun: 60 },
  { id: "e4", title: "Bluetooth Speaker", previewTag: "BS", originalPrice: 29000, endReason: "No offers", daysRun: 18 },
  { id: "e5", title: "Denim Jacket, Size L", previewTag: "DJ", originalPrice: 42000, endReason: "Expired", daysRun: 33 },
  { id: "e6", title: "Standing Desk Lamp", previewTag: "SL", originalPrice: 24000, endReason: "No offers", daysRun: 27 },
  { id: "e7", title: "Road Bike Helmet", previewTag: "RH", originalPrice: 19000, endReason: "Expired", daysRun: 50 },
  { id: "e8", title: "Ceramic Vase Set", previewTag: "CV", originalPrice: 31000, endReason: "No offers", daysRun: 15 },
  { id: "e9", title: "Leather Wallet", previewTag: "LW", originalPrice: 16000, endReason: "Expired", daysRun: 39 },
];
