// native/src/evolve/r62/c/data.ts
//
// Deterministic dummy data for the Seller Monthly Performance Digest screen.
// Every figure below is a fixed literal — no Math.random, no Date.now, no
// bare `new Date()`. Trend direction is a plain enum field set by hand
// alongside its matching label string, not derived from any clock.

export type TrendDirection = "up" | "down" | "flat";

export interface TopListingEntry {
  id: string;
  rank: number;
  title: string;
  unitsSold: number;
  revenueContribution: string;
  shareNote: string;
  detailNote: string;
}

export interface MonthlyDigestRecord {
  periodLabel: string;
  finalizedNote: string;
  salesTotal: string;
  salesOrderCount: number;
  viewTotal: string;
  viewTrendLabel: string;
  viewTrendDirection: TrendDirection;
  ratingAverage: string;
  ratingSampleSize: number;
  ratingTrendLabel: string;
  ratingTrendDirection: TrendDirection;
  topListings: TopListingEntry[];
}

export const monthlyDigest: MonthlyDigestRecord = {
  periodLabel: "October 2026",
  finalizedNote: "Finalized Nov 1, 2026 — figures below will not change.",
  salesTotal: "$8,240.50",
  salesOrderCount: 47,
  viewTotal: "14,320",
  viewTrendLabel: "+12% vs September",
  viewTrendDirection: "up",
  ratingAverage: "4.86",
  ratingSampleSize: 156,
  ratingTrendLabel: "+0.04 vs September",
  ratingTrendDirection: "up",
  topListings: [
    {
      id: "listing-1",
      rank: 1,
      title: "Vintage Leather Messenger Bag, Chestnut Brown",
      unitsSold: 9,
      revenueContribution: "$1,862.00",
      shareNote: "22.6% of this month's sales",
      detailNote:
        "Biggest contributor three months running. Buyers most often cited the condition photos in their reviews.",
    },
    {
      id: "listing-2",
      rank: 2,
      title: "Mid-Century Teak Side Table",
      unitsSold: 4,
      revenueContribution: "$1,120.00",
      shareNote: "13.6% of this month's sales",
      detailNote:
        "Lower unit count but high price point — average sale price was the highest of any listing this month.",
    },
    {
      id: "listing-3",
      rank: 3,
      title: "Hand-Thrown Ceramic Planter Set (3-piece)",
      unitsSold: 14,
      revenueContribution: "$686.00",
      shareNote: "8.3% of this month's sales",
      detailNote:
        "Highest unit volume of the three. Repeat buyers accounted for 5 of the 14 units sold.",
    },
  ],
};
