/**
 * Pure, deterministic math for the "Priority Order" device.
 *
 * There is exactly one piece of interaction state for the whole page: the
 * order of four priority chip ids. Every other number — the weight each
 * chip carries, every product's match percent, and the sort order of the
 * card grid — is a pure function of that one array. Nothing here reads
 * Math.random, Date.now or an argument-less new Date.
 */

export interface Chip {
  id: ChipId;
  /** Shown on the chip itself. */
  label: string;
  /** One line explaining what the chip weighs, shown under the chip. */
  description: string;
}

export type ChipId = 'price' | 'condition' | 'trust' | 'pickup';

/**
 * Four chips, in their *default* (unranked) order — this array never
 * changes; only the visitor's ordering of these same four ids does.
 */
export const CHIPS: Chip[] = [
  { id: 'price', label: 'Price', description: 'Deeper discount against original retail' },
  { id: 'condition', label: 'Condition Grade', description: 'Verified physical condition at listing' },
  { id: 'trust', label: 'Seller Trust', description: 'Verification status and return history' },
  { id: 'pickup', label: 'Pickup Speed', description: 'How soon the item can ship or be collected' },
];

export const CHIP_MAP: Record<ChipId, Chip> = CHIPS.reduce(
  (acc, c) => ({ ...acc, [c.id]: c }),
  {} as Record<ChipId, Chip>,
);

/** Starting order: Price, Condition Grade, Seller Trust, Pickup Speed. */
export const DEFAULT_ORDER: ChipId[] = ['price', 'condition', 'trust', 'pickup'];

/**
 * Rank 1 (top of the list) carries 40% of the weight budget, rank 2 carries
 * 30%, rank 3 carries 20%, rank 4 carries 10%. A simple, visibly-unequal
 * 40/30/20/10 split (sums to exactly 100) so moving a chip one slot always
 * produces a visibly different weight, not a rounding-noise difference.
 */
export const RANK_WEIGHTS: readonly number[] = [40, 30, 20, 10];

export type WeightMap = Record<ChipId, number>;

/** Convert the current chip order into a weight map, rank 1 => 40 ... rank 4 => 10. */
export function computeWeights(order: ChipId[]): WeightMap {
  const weights = {} as WeightMap;
  order.forEach((id, index) => {
    weights[id] = RANK_WEIGHTS[index] ?? 0;
  });
  return weights;
}

export interface ScoredProduct {
  id: string;
  scores: Record<ChipId, number>;
}

/**
 * Weighted composite match percent for one product, 0-100. Each of the
 * four per-criterion scores (0-100) is multiplied by its current weight
 * (which sums to 100 across the four chips) and divided by 100, so the
 * result is itself a 0-100 percent.
 */
export function computeMatch(product: ScoredProduct, weights: WeightMap): number {
  const total = CHIPS.reduce((sum, chip) => sum + (weights[chip.id] ?? 0) * product.scores[chip.id], 0);
  return Math.round(total / 100);
}

export interface Ranked<T> {
  product: T;
  match: number;
  rank: number;
}

/**
 * Score every product against the current order and sort descending by
 * match percent. Ties break on product id so the order is fully
 * deterministic (never a silent re-shuffle on equal scores).
 */
export function rankProducts<T extends ScoredProduct>(products: T[], order: ChipId[]): Ranked<T>[] {
  const weights = computeWeights(order);
  return products
    .map((product) => ({ product, match: computeMatch(product, weights), rank: 0 }))
    .sort((a, b) => b.match - a.match || a.product.id.localeCompare(b.product.id))
    .map((entry, index) => ({ ...entry, rank: index + 1 }));
}

/** Swap the chip at `index` with its neighbor in `direction` (-1 up, +1 down). Clamped, immutable. */
export function moveChip(order: ChipId[], index: number, direction: -1 | 1): ChipId[] {
  const target = index + direction;
  if (target < 0 || target >= order.length) return order;
  const next = order.slice();
  const tmp = next[index];
  next[index] = next[target];
  next[target] = tmp;
  return next;
}

/** Move the chip at `fromIndex` to `toIndex`, shifting the rest. Used by drag-and-drop. */
export function reorderByDrag(order: ChipId[], fromIndex: number, toIndex: number): ChipId[] {
  if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0 || fromIndex >= order.length || toIndex >= order.length) {
    return order;
  }
  const next = order.slice();
  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);
  return next;
}

/** Human-readable summary of the current order, used for the live-region announcement. */
export function describeOrder(order: ChipId[]): string {
  return order.map((id, i) => `${i + 1}. ${CHIP_MAP[id].label}`).join(', ');
}
