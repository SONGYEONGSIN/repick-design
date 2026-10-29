// Pure, deterministic data + math for the "Rank Shuffle" device.
// No Math.random / Date.now / new Date anywhere — every number a visitor
// sees is either a literal below or a pure function of the current order.

export type FactorId = "price" | "condition" | "speed" | "trust";

export const FACTORS: { id: FactorId; label: string }[] = [
  { id: "price", label: "Price" },
  { id: "condition", label: "Condition" },
  { id: "speed", label: "Speed" },
  { id: "trust", label: "Trust" },
];

// Sensible non-empty default so the radar shape and the sorted list are
// both meaningfully non-trivial before anyone touches the control.
export const DEFAULT_ORDER: FactorId[] = ["price", "condition", "speed", "trust"];

// --- the ONE weight-derivation function, shared by the radar axes and the
// product composite score. Rank 1 (most important) keeps full weight; each
// step down the ranking decays by a fixed curve. Picked by hand, not fit to
// anything: 1 / 0.7 / 0.45 / 0.25 — a steep-enough drop that reordering two
// adjacent items visibly reshapes the polygon and reshuffles the list.
const RANK_WEIGHTS = [1, 0.7, 0.45, 0.25] as const;

export function weightForRank(rank: number): number {
  return RANK_WEIGHTS[rank - 1] ?? RANK_WEIGHTS[RANK_WEIGHTS.length - 1];
}

export function weightsFromOrder(order: FactorId[]): Record<FactorId, number> {
  const weights = {} as Record<FactorId, number>;
  order.forEach((id, i) => {
    weights[id] = weightForRank(i + 1);
  });
  return weights;
}

export function weightShare(weights: Record<FactorId, number>, id: FactorId): number {
  const total = FACTORS.reduce((sum, f) => sum + weights[f.id], 0);
  return Math.round((weights[id] / total) * 100);
}

export type RankItem = {
  id: string;
  name: string;
  category: string;
  priceLabel: string;
  scores: Record<FactorId, number>; // 0-100 per factor, hand-set
};

export const RANK_ITEMS: RankItem[] = [
  {
    id: "camera",
    name: "Mirrorless Camera Kit",
    category: "Electronics",
    priceLabel: "$612",
    scores: { price: 72, condition: 90, speed: 65, trust: 88 },
  },
  {
    id: "speakers",
    name: "Studio Monitor Speakers",
    category: "Audio",
    priceLabel: "$284",
    scores: { price: 85, condition: 78, speed: 90, trust: 70 },
  },
  {
    id: "bike",
    name: "Carbon Road Bike",
    category: "Outdoor",
    priceLabel: "$1,340",
    scores: { price: 60, condition: 95, speed: 55, trust: 92 },
  },
  {
    id: "keyboard",
    name: "Mechanical Keyboard",
    category: "Electronics",
    priceLabel: "$118",
    scores: { price: 93, condition: 70, speed: 97, trust: 65 },
  },
];

export function compositeScore(item: RankItem, weights: Record<FactorId, number>): number {
  const totalWeight = FACTORS.reduce((sum, f) => sum + weights[f.id], 0);
  const weighted = FACTORS.reduce((sum, f) => sum + item.scores[f.id] * weights[f.id], 0);
  return Math.round((weighted / totalWeight) * 10) / 10;
}

export type ScoredItem = RankItem & { score: number };

export function sortedItems(order: FactorId[]): ScoredItem[] {
  const weights = weightsFromOrder(order);
  return RANK_ITEMS.map((item) => ({ ...item, score: compositeScore(item, weights) })).sort(
    (a, b) => b.score - a.score
  );
}

export function moveInOrder(order: FactorId[], id: FactorId, direction: -1 | 1): FactorId[] {
  const index = order.indexOf(id);
  const target = index + direction;
  if (index === -1 || target < 0 || target >= order.length) return order;
  const next = [...order];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

export function reorderTo(order: FactorId[], draggedId: FactorId, targetId: FactorId): FactorId[] {
  if (draggedId === targetId) return order;
  const from = order.indexOf(draggedId);
  const to = order.indexOf(targetId);
  if (from === -1 || to === -1) return order;
  const next = [...order];
  next.splice(from, 1);
  next.splice(to, 0, draggedId);
  return next;
}
