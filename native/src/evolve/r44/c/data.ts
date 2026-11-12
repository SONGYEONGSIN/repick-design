// native/src/evolve/r44/c/data.ts
//
// Deterministic dummy data for the Seller Reputation Tier screen.
// No Math.random / Date.now / bare `new Date()` anywhere — fixed literals
// and derived arithmetic only.

export type Tier = {
  level: 1 | 2 | 3 | 4;
  name: string;
  /** reputation points required to HOLD this tier */
  minPoints: number;
  /** perks a seller holding this tier (or higher) has access to */
  perks: string[];
};

export type Badge = {
  id: string;
  name: string;
  /** short text glyph rendered inside the badge cell's icon circle */
  icon: string;
  earned: boolean;
  /** full status line — copy already distinguishes "Earned —" / "Locked —" */
  note: string;
};

// ---------------------------------------------------------------------------
// Tier ladder
// ---------------------------------------------------------------------------
export const TIERS: Tier[] = [
  {
    level: 1,
    name: "Starter",
    minPoints: 0,
    perks: ["Standard search placement", "Basic seller profile page"],
  },
  {
    level: 2,
    name: "Rising Seller",
    minPoints: 500,
    perks: [
      "Small search ranking boost on new listings",
      "Seller badge shown on your profile",
    ],
  },
  {
    level: 3,
    name: "Trusted Seller",
    minPoints: 2000,
    perks: [
      "Priority placement in the buyer support queue",
      "10% lower listing fee",
      "Early access to promotional slots",
    ],
  },
  {
    level: 4,
    name: "Elite Seller",
    minPoints: 5000,
    perks: [
      "Dedicated account manager",
      "Featured placement on category pages",
      "Lowest commission tier",
      "Custom storefront banner",
    ],
  },
];

// Fixed current standing — a seller sitting between Rising Seller and
// Trusted Seller, with 6 of 10 achievement badges earned.
export const CURRENT_POINTS = 1240;

// ---------------------------------------------------------------------------
// Achievement badges — 6 earned, 4 locked, deterministic
// ---------------------------------------------------------------------------
export const BADGES: Badge[] = [
  {
    id: "fast-shipper",
    name: "Fast Shipper",
    icon: "F",
    earned: true,
    note: "Earned — shipped within 24 hours on 20+ orders",
  },
  {
    id: "five-star-streak",
    name: "5-Star Streak",
    icon: "S",
    earned: true,
    note: "Earned — 15 consecutive 5-star ratings",
  },
  {
    id: "quick-responder",
    name: "Quick Responder",
    icon: "Q",
    earned: true,
    note: "Earned — average reply time under 1 hour",
  },
  {
    id: "verified-photos",
    name: "Verified Photos",
    icon: "V",
    earned: true,
    note: "Earned — every active listing uses verified photos",
  },
  {
    id: "return-free-run",
    name: "Return-Free Run",
    icon: "R",
    earned: true,
    note: "Earned — 30 sales in a row with zero returns",
  },
  {
    id: "century-club",
    name: "Century Club",
    icon: "C",
    earned: true,
    note: "Earned — reached 100 completed sales",
  },
  {
    id: "power-seller",
    name: "Power Seller",
    icon: "P",
    earned: false,
    note: "Locked — reach 500 completed sales (118 so far)",
  },
  {
    id: "community-favorite",
    name: "Community Favorite",
    icon: "H",
    earned: false,
    note: "Locked — receive 50 buyer compliments (22 so far)",
  },
  {
    id: "bundle-pro",
    name: "Bundle Pro",
    icon: "B",
    earned: false,
    note: "Locked — sell 10 bundle deals (3 so far)",
  },
  {
    id: "early-adopter",
    name: "Early Adopter",
    icon: "E",
    earned: false,
    note: "Locked — reserved for sellers who joined before Jan 2025",
  },
];
