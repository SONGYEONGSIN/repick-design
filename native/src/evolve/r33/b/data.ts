// native/src/evolve/r33/b/data.ts
//
// Deterministic dummy data for the Safety Recall Matches screen — no
// Math.random, no Date.now, no argument-less `new Date()`. Every "matched
// on" value is a fixed display string, not a computed one.

export type RecallConfidence = "confirmed" | "possible";
export type RecallMatchStatus = "pending" | "removed" | "disputed";

export type RecallMatch = {
  id: string;
  listingTitle: string;
  listingRef: string;
  category: string;
  priceCents: number;
  recallId: string;
  recallReason: string;
  confidence: RecallConfidence;
  matchedLabel: string;
  status: RecallMatchStatus;
};

export const initialRecallMatches: RecallMatch[] = [
  {
    id: "rm-01",
    listingTitle: "Toddler Zip-Up Fleece Jacket, Size 3T",
    listingRef: "LST-10482",
    category: "Kids' Outerwear",
    priceCents: 1800,
    recallId: "CPSC-2024-1187",
    recallReason: "Drawstring at the hood poses a strangulation hazard",
    confidence: "confirmed",
    matchedLabel: "Matched Oct 2",
    status: "pending",
  },
  {
    id: "rm-02",
    listingTitle: "Wireless Earbud Charging Case, Black",
    listingRef: "LST-20911",
    category: "Electronics Accessory",
    priceCents: 2200,
    recallId: "CPSC-2024-0973",
    recallReason: "Battery pack can overheat while charging",
    confidence: "confirmed",
    matchedLabel: "Matched Oct 2",
    status: "pending",
  },
  {
    id: "rm-03",
    listingTitle: "Kids' Light-Up Sneakers, Size 11",
    listingRef: "LST-33820",
    category: "Footwear",
    priceCents: 1500,
    recallId: "CPSC-2023-0541",
    recallReason: "Button-cell battery compartment doesn't lock shut",
    confidence: "possible",
    matchedLabel: "Matched Sep 28",
    status: "pending",
  },
  {
    id: "rm-04",
    listingTitle: "Infant Teething Ring, Silicone",
    listingRef: "LST-40177",
    category: "Baby Gear",
    priceCents: 900,
    recallId: "CPSC-2024-1340",
    recallReason: "Ring can split into small pieces, a choking hazard",
    confidence: "confirmed",
    matchedLabel: "Matched Oct 3",
    status: "pending",
  },
  {
    id: "rm-05",
    listingTitle: "Fleece Throw Blanket, Plaid",
    listingRef: "LST-50288",
    category: "Home Textiles",
    priceCents: 1200,
    recallId: "CPSC-2022-0199",
    recallReason: "Fabric fails the 16 CFR 1610 flammability standard",
    confidence: "possible",
    matchedLabel: "Matched Sep 25",
    status: "pending",
  },
  {
    id: "rm-06",
    listingTitle: "Camp Chair with Cup Holder",
    listingRef: "LST-61390",
    category: "Outdoor Gear",
    priceCents: 2800,
    recallId: "CPSC-2023-0802",
    recallReason: "Frame hinge can pinch or trap fingers when folding",
    confidence: "possible",
    matchedLabel: "Matched Sep 20",
    status: "disputed",
  },
  {
    id: "rm-07",
    listingTitle: "Kids' Rain Boots, Size 9",
    listingRef: "LST-70234",
    category: "Footwear",
    priceCents: 1100,
    recallId: "CPSC-2023-0415",
    recallReason: "Coating contains phthalate levels above the limit",
    confidence: "confirmed",
    matchedLabel: "Matched Sep 18",
    status: "removed",
  },
  {
    id: "rm-08",
    listingTitle: "Baby Carrier Wrap, Grey",
    listingRef: "LST-80456",
    category: "Baby Gear",
    priceCents: 3200,
    recallId: "CPSC-2024-0612",
    recallReason: "Buckle clip can release unexpectedly under load",
    confidence: "confirmed",
    matchedLabel: "Matched Oct 1",
    status: "removed",
  },
  {
    id: "rm-09",
    listingTitle: "Travel Humidifier, Mini",
    listingRef: "LST-90671",
    category: "Electronics Accessory",
    priceCents: 1600,
    recallId: "CPSC-2024-0788",
    recallReason: "Water tank seal can leak onto internal wiring",
    confidence: "possible",
    matchedLabel: "Matched Sep 30",
    status: "pending",
  },
];

/** Formats whole cents as a plain Latin-currency string, e.g. "$18.00". */
export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export function confidenceLabel(confidence: RecallConfidence): string {
  return confidence === "confirmed" ? "Confirmed match" : "Possible match";
}

export function statusLabel(status: RecallMatchStatus): string {
  if (status === "removed") return "Removed";
  if (status === "disputed") return "Under review";
  return "Needs action";
}

/** Deterministic photo-placeholder swatch index cycle (0, 1, 2, 0, 1, 2, …). */
export function swatchIndexFor(index: number): 0 | 1 | 2 {
  return (index % 3) as 0 | 1 | 2;
}
