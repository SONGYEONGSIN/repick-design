// native/src/evolve/r58/b/data.ts
// Deterministic dummy data for the Mis-description Review Queue screen.
// No Math.random / Date.now / bare `new Date()` — every value is a fixed literal.

export interface FlaggedListing {
  id: string;
  title: string;
  /** Won amount in latin "KRW" notation (deliberate choice — see candidate brief gaps). */
  priceLabel: string;
  /** Short snippet of the buyer's flag reason, shown verbatim-style. */
  reasonSnippet: string;
  /** Fixed, pre-formatted date string — never computed from a live clock. */
  flaggedOnLabel: string;
}

export const flaggedListings: FlaggedListing[] = [
  {
    id: "fl-1",
    title: "Vintage Denim Jacket — Size M",
    priceLabel: "KRW 45,000",
    reasonSnippet:
      "Photos showed no stains, but the jacket arrived with a visible mark on the left sleeve.",
    flaggedOnLabel: "Nov 10, 2026",
  },
  {
    id: "fl-2",
    title: "Nike Air Max 90 — US 9",
    priceLabel: "KRW 72,000",
    reasonSnippet:
      "Listing said \"barely worn,\" but the soles show heavy, uneven wear.",
    flaggedOnLabel: "Nov 11, 2026",
  },
  {
    id: "fl-3",
    title: "North Face Fleece Pullover",
    priceLabel: "KRW 38,500",
    reasonSnippet:
      "Described as windproof outer shell; buyer says wind passes through easily.",
    flaggedOnLabel: "Nov 12, 2026",
  },
  {
    id: "fl-4",
    title: "Canon AE-1 Film Camera",
    priceLabel: "KRW 165,000",
    reasonSnippet:
      "Shutter was described as smooth, but it sticks on advance after every third frame.",
    flaggedOnLabel: "Nov 13, 2026",
  },
  {
    id: "fl-5",
    title: "Leather Crossbody Bag",
    priceLabel: "KRW 29,000",
    reasonSnippet:
      "Strap was listed as full leather; buyer says it feels like coated canvas.",
    flaggedOnLabel: "Nov 14, 2026",
  },
];
