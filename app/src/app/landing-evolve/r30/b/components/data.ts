// Fixed literal audit data. No Math.random, no Date.now — every number below is a plain
// arithmetic derivation (volume × tier share ÷ 100) so switching categories always redraws
// the mosaic from the same ledger, never a random or time-based value.

export type TierId = "pro" | "id" | "new";

export interface Tier {
  id: TierId;
  label: string;
  short: string;
  /** One-sentence description of what the tier requires, used in the legend + table. */
  requirement: string;
}

export const TIERS: Tier[] = [
  {
    id: "pro",
    label: "Verified Pro",
    short: "Pro",
    requirement: "Business seller, in-person authentication on every listing",
  },
  {
    id: "id",
    label: "ID-Verified",
    short: "ID",
    requirement: "Government ID on file, photo-matched condition report",
  },
  {
    id: "new",
    label: "New Seller",
    short: "New",
    requirement: "Email-verified only, under 90 days on the platform",
  },
];

export interface Category {
  id: string;
  label: string;
  /** Total live listings in this category. */
  volume: number;
  /** Share of total marketplace inventory volume, in percent. */
  share: number;
  /** Percent of this category's volume in each tier (sums to 100). */
  tierShare: Record<TierId, number>;
  /** Listing counts per tier — volume × tierShare ÷ 100, pre-computed and exact. */
  tierVolume: Record<TierId, number>;
}

// Total marketplace inventory: 100,000 live listings.
export const TOTAL_VOLUME = 100000;

export const CATEGORIES: Category[] = [
  {
    id: "sneakers",
    label: "Sneakers",
    volume: 32400,
    share: 32.4,
    tierShare: { pro: 38, id: 41, new: 21 },
    tierVolume: { pro: 12312, id: 13284, new: 6804 },
  },
  {
    id: "bags",
    label: "Bags",
    volume: 24800,
    share: 24.8,
    tierShare: { pro: 52, id: 33, new: 15 },
    tierVolume: { pro: 12896, id: 8184, new: 3720 },
  },
  {
    id: "outerwear",
    label: "Outerwear",
    volume: 18200,
    share: 18.2,
    tierShare: { pro: 29, id: 47, new: 24 },
    tierVolume: { pro: 5278, id: 8554, new: 4368 },
  },
  {
    id: "electronics",
    label: "Electronics",
    volume: 15000,
    share: 15.0,
    tierShare: { pro: 44, id: 38, new: 18 },
    tierVolume: { pro: 6600, id: 5700, new: 2700 },
  },
  {
    id: "watches",
    label: "Watches",
    volume: 9600,
    share: 9.6,
    tierShare: { pro: 71, id: 24, new: 5 },
    tierVolume: { pro: 6816, id: 2304, new: 480 },
  },
];

export const MAX_SHARE = Math.max(...CATEGORIES.map((c) => c.share)); // 32.4 — Sneakers

export function getCategory(id: string): Category {
  return CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[0];
}

export function formatUnits(n: number): string {
  return n.toLocaleString("en-US");
}
