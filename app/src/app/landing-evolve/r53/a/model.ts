import {
  ACCESSORIES,
  CATEGORIES,
  CONDITIONS,
  PHOTOS,
  TRADE_CREDIT_RATE,
  type AccessoriesId,
  type CategoryId,
  type ConditionId,
  type PayoutId,
  type PhotosId,
} from "./data";

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export type Appraisal = {
  categoryLabel: string;
  low: number;
  high: number;
  cashCenter: number;
  creditCenter: number;
  confidence: number;
  comparableCount: number;
  tagA: string;
  tagB: string;
};

/**
 * Pure function of the four selections (+ payout display mode). No randomness, no clock reads --
 * the same five ids always produce the same numbers, on the server and the client.
 */
export function appraise(
  categoryId: CategoryId,
  conditionId: ConditionId,
  accessoriesId: AccessoriesId,
  photosId: PhotosId,
  payout: PayoutId
): Appraisal {
  const category = CATEGORIES.find((c) => c.id === categoryId) ?? CATEGORIES[0];
  const condition = CONDITIONS.find((c) => c.id === conditionId) ?? CONDITIONS[0];
  const accessories = ACCESSORIES.find((a) => a.id === accessoriesId) ?? ACCESSORIES[0];
  const photos = PHOTOS.find((p) => p.id === photosId) ?? PHOTOS[0];

  const cashCenter = Math.round(category.basePrice * condition.priceMult * accessories.priceMult);
  const creditCenter = Math.round(cashCenter * TRADE_CREDIT_RATE);
  const center = payout === "cash" ? cashCenter : creditCenter;

  const low = Math.round(center * 0.88);
  const high = Math.round(center * 1.12);

  const confidence = clamp(70 + condition.confidenceDelta + photos.confidenceDelta, 40, 97);
  const comparableCount = Math.round(category.comparableBase * photos.comparableFactor);

  return {
    categoryLabel: category.label,
    low,
    high,
    cashCenter,
    creditCenter,
    confidence,
    comparableCount,
    tagA: category.tagA,
    tagB: category.tagB,
  };
}

export function formatUsd(value: number): string {
  return `$${value.toLocaleString("en-US")}`;
}
