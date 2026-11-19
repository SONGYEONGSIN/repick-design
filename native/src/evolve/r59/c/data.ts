// native/src/evolve/r59/c/data.ts
// Deterministic dummy data for "Seller Plan Comparison".
// No Math.random / Date.now / bare new Date() — every value below is a fixed
// literal. See candidates/c.md for what was invented here and why.

export type TierId = "starter" | "plus";

export interface SellerTier {
  id: TierId;
  name: string;
  tagline: string;
}

export const TIERS: SellerTier[] = [
  {
    id: "starter",
    name: "Starter",
    tagline: "Free to sell. Good for the first few listings.",
  },
  {
    id: "plus",
    name: "Plus",
    tagline: "For sellers who list every week and want it to move faster.",
  },
];

export const TIER_INDEX: Record<TierId, SellerTier> = {
  starter: TIERS[0],
  plus: TIERS[1],
};

export function tierById(id: TierId): SellerTier {
  return TIER_INDEX[id];
}

export type PerkId =
  | "listingLimit"
  | "supportResponse"
  | "feeRate"
  | "payoutSpeed"
  | "analytics"
  | "featuredPlacement";

export interface PerkRow {
  id: PerkId;
  /** Row label shown regardless of which tier is being viewed. */
  label: string;
  starterValue: string;
  plusValue: string;
  /**
   * Shown only while the Starter tab is open, under the Starter value.
   * Plus is strictly the upsell tier for every row below, so Plus is never
   * the "weaker" side and never needs this hint.
   */
  unlockHint: string;
}

/** Fixed set of 6 perk rows — the full comparison surface for this screen. */
export const PERK_ROWS: PerkRow[] = [
  {
    id: "listingLimit",
    label: "Active listing limit",
    starterValue: "25 active listings",
    plusValue: "Unlimited active listings",
    unlockHint: "Upgrade to unlock unlimited listings",
  },
  {
    id: "supportResponse",
    label: "Support response time",
    starterValue: "48-hour email response",
    plusValue: "4-hour priority chat",
    unlockHint: "Upgrade to unlock 4-hour priority support",
  },
  {
    id: "feeRate",
    label: "Selling fee per sale",
    starterValue: "7.5% of sale price",
    plusValue: "4.0% of sale price",
    unlockHint: "Upgrade to unlock the lower 4.0% fee",
  },
  {
    id: "payoutSpeed",
    label: "Payout speed",
    starterValue: "5 business days after delivery",
    plusValue: "Next business day after delivery",
    unlockHint: "Upgrade to unlock next-business-day payout",
  },
  {
    id: "analytics",
    label: "Sales analytics",
    starterValue: "7-day sales summary",
    plusValue: "90-day trend and buyer demand data",
    unlockHint: "Upgrade to unlock 90-day analytics",
  },
  {
    id: "featuredPlacement",
    label: "Featured placement",
    starterValue: "Not included",
    plusValue: "2 featured slots every month",
    unlockHint: "Upgrade to unlock featured placement",
  },
];

/** Tier the screen opens on. Fixed, not derived from any runtime signal. */
export const INITIAL_SELECTED_TIER_ID: TierId = "starter";

export function valueForTier(row: PerkRow, tierId: TierId): string {
  return tierId === "starter" ? row.starterValue : row.plusValue;
}
