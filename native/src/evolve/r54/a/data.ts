// native/src/evolve/r54/a/data.ts — deterministic dummy data for
// TradeInPayoutEstimatorScreen (auto-native-r54 candidate a).
//
// Trade-In Payout Estimator: a pure, always-live pricing calculator. There
// is no submit, no lock, no accept/decline, and no "reveal" gate anywhere
// in this architecture (contrast evolve/r47/a/InstantTradeInScreen, which
// withholds its number behind a condition questionnaire + reveal tap + an
// accept/decline band). Here every number is a plain function of the three
// current inputs (category, condition, quantity) and recomputes on every
// change, forever — closer to a mortgage/tip calculator than to an offer
// flow. All lookup tables below are fixed, deterministic data.

export type CategoryId =
  | "sneakers"
  | "handbags"
  | "watches"
  | "electronics"
  | "streetwear";

export type Category = {
  id: CategoryId;
  label: string;
  /** Flat per-item base buyback value before any condition/bulk adjustment. */
  baseValueUsd: number;
};

export const CATEGORIES: Category[] = [
  { id: "sneakers", label: "Sneakers", baseValueUsd: 85 },
  { id: "handbags", label: "Handbags", baseValueUsd: 140 },
  { id: "watches", label: "Watches", baseValueUsd: 220 },
  { id: "electronics", label: "Electronics", baseValueUsd: 95 },
  { id: "streetwear", label: "Streetwear", baseValueUsd: 40 },
];

export type ConditionId = "likeNew" | "good" | "fair" | "worn";

export type Condition = {
  id: ConditionId;
  label: string;
  shortLabel: string;
  multiplier: number;
};

export const CONDITIONS: Condition[] = [
  { id: "likeNew", label: "Like New", shortLabel: "Like New", multiplier: 1.0 },
  { id: "good", label: "Good", shortLabel: "Good", multiplier: 0.8 },
  { id: "fair", label: "Fair", shortLabel: "Fair", multiplier: 0.55 },
  { id: "worn", label: "Heavily Worn", shortLabel: "Worn", multiplier: 0.3 },
];

export type BulkTier = {
  minQty: number;
  maxQty: number | null; // null = no upper bound
  bonusPct: number; // fraction, e.g. 0.05 = +5%
  label: string;
};

// Bulk-quantity bonus: trading in more items at once earns a better overall
// rate. Tiers are inclusive on both ends; the last tier has no upper bound.
export const BULK_TIERS: BulkTier[] = [
  { minQty: 1, maxQty: 2, bonusPct: 0, label: "No bulk bonus" },
  { minQty: 3, maxQty: 5, bonusPct: 0.05, label: "+5% bulk bonus" },
  { minQty: 6, maxQty: 9, bonusPct: 0.1, label: "+10% bulk bonus" },
  { minQty: 10, maxQty: null, bonusPct: 0.15, label: "+15% bulk bonus" },
];

export const MIN_QTY = 1;
export const MAX_QTY = 12;

export function findBulkTier(qty: number): BulkTier {
  return (
    BULK_TIERS.find(
      (tier) => qty >= tier.minQty && (tier.maxQty === null || qty <= tier.maxQty)
    ) ?? BULK_TIERS[0]
  );
}

export type PayoutBreakdown = {
  category: Category;
  condition: Condition;
  quantity: number;
  /** Base value adjusted for condition, per single item. */
  perItemUsd: number;
  /** perItemUsd * quantity, before the bulk bonus. */
  subtotalUsd: number;
  bulkTier: BulkTier;
  bulkBonusUsd: number;
  /** subtotalUsd + bulkBonusUsd. */
  totalUsd: number;
};

export function computePayout(
  categoryId: CategoryId,
  conditionId: ConditionId,
  quantity: number
): PayoutBreakdown {
  const category = CATEGORIES.find((c) => c.id === categoryId) ?? CATEGORIES[0];
  const condition = CONDITIONS.find((c) => c.id === conditionId) ?? CONDITIONS[0];
  const clampedQty = Math.max(MIN_QTY, Math.min(MAX_QTY, quantity));

  const perItemUsd = category.baseValueUsd * condition.multiplier;
  const subtotalUsd = perItemUsd * clampedQty;
  const bulkTier = findBulkTier(clampedQty);
  const bulkBonusUsd = subtotalUsd * bulkTier.bonusPct;
  const totalUsd = subtotalUsd + bulkBonusUsd;

  return {
    category,
    condition,
    quantity: clampedQty,
    perItemUsd,
    subtotalUsd,
    bulkTier,
    bulkBonusUsd,
    totalUsd,
  };
}

export function formatUsd(amount: number): string {
  return `$${amount.toFixed(2)}`;
}
