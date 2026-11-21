/**
 * Pure, framework-free ranking math for the Priority Ladder.
 *
 * The visitor's ONLY input is a ranking (a permutation) of five fixed
 * matching criteria. That ranking is stored as a RANK MAP — an object from
 * criterion id to its 1..5 rank position — not as an ordered array. Moving a
 * row up/down or dropping it in a new slot always goes through one of the
 * functions below, so the ladder UI, the hero's mini scoreboard, the full
 * listing grid, the "Ranked by:" caption and the closing CTA can never
 * disagree about what the current order is or what it's worth.
 *
 * No Math.random, Date.now, or no-arg `new Date` anywhere in this module.
 */

export type CriterionId = "condition" | "sellerRating" | "price" | "rarity" | "shippingSpeed";

export interface Criterion {
  id: CriterionId;
  label: string;
  description: string;
}

/**
 * Five fixed matching criteria. This array's order is just a stable catalog
 * order for iteration — it is NOT the ranking. The ranking lives in RankMap.
 */
export const CRITERIA: Criterion[] = [
  { id: "price", label: "Price", description: "How close this listing sits to the lowest price for the match" },
  { id: "condition", label: "Condition", description: "Verified condition grade at intake" },
  { id: "sellerRating", label: "Seller rating", description: "Seller's verified rating and return history" },
  { id: "shippingSpeed", label: "Shipping speed", description: "How soon the item can ship or be picked up" },
  { id: "rarity", label: "Rarity", description: "How uncommon this piece is in current circulation" },
];

export const CRITERION_MAP: Record<CriterionId, Criterion> = CRITERIA.reduce(
  (acc, c) => ({ ...acc, [c.id]: c }),
  {} as Record<CriterionId, Criterion>,
);

/** Rank position -> criterion id, at rest. Deliberately not alphabetical and
 *  not the catalog order above, so the default state is a real decision,
 *  not an accident of array order. */
export const DEFAULT_RANK: Record<CriterionId, number> = {
  condition: 1,
  sellerRating: 2,
  price: 3,
  rarity: 4,
  shippingSpeed: 5,
};

export type RankMap = Record<CriterionId, number>;

/**
 * The weight curve: a fixed LINEAR (triangular) decay, computed once from
 * the criterion count, not hand-typed. Rank r (1-indexed, 1 = top) is given
 * a budget share proportional to (n - r + 1): the top rank gets n parts,
 * the bottom rank gets 1 part, and each step down the ladder loses exactly
 * one part. That raw share is converted to whole percentage points with the
 * largest-remainder method, so the n weights always sum to exactly 100 with
 * no rounding drift — the same safeguard used elsewhere in this catalog for
 * sum-preserving splits.
 *
 * For n = 5 this resolves to [33, 27, 20, 13, 7] (rank 1 .. rank 5).
 */
function computeLinearRankWeights(n: number): number[] {
  const totalParts = (n * (n + 1)) / 2;
  const raw = Array.from({ length: n }, (_, i) => ((n - i) / totalParts) * 100);
  const floors = raw.map((v) => Math.floor(v));
  const used = floors.reduce((sum, v) => sum + v, 0);
  const remainder = 100 - used;
  const byFracDesc = raw
    .map((v, i) => ({ i, frac: v - Math.floor(v) }))
    .sort((a, b) => b.frac - a.frac);
  const result = floors.slice();
  for (let k = 0; k < remainder; k += 1) {
    result[byFracDesc[k].i] += 1;
  }
  return result;
}

export const RANK_WEIGHTS: readonly number[] = computeLinearRankWeights(CRITERIA.length);

/** The weight (percentage points, sums to 100 across all five) currently
 *  assigned to a criterion, read from its rank in `rankMap`. */
export function weightFor(rankMap: RankMap, id: CriterionId): number {
  return RANK_WEIGHTS[rankMap[id] - 1] ?? 0;
}

/** The criterion ids in rank order, rank 1 first. Derived from the map on
 *  demand — nothing stores this as its own piece of state. */
export function orderedIds(rankMap: RankMap): CriterionId[] {
  return CRITERIA.map((c) => c.id).sort((a, b) => rankMap[a] - rankMap[b]);
}

function rankMapFromOrder(ids: CriterionId[]): RankMap {
  const map = {} as RankMap;
  ids.forEach((id, i) => {
    map[id] = i + 1;
  });
  return map;
}

/** Move one criterion up (-1) or down (+1) one slot, swapping ranks with
 *  whichever criterion currently holds the target slot. No-op at an edge. */
export function moveRank(rankMap: RankMap, id: CriterionId, direction: -1 | 1): RankMap {
  const currentRank = rankMap[id];
  const targetRank = currentRank + direction;
  if (targetRank < 1 || targetRank > CRITERIA.length) return rankMap;
  const neighborId = CRITERIA.map((c) => c.id).find((other) => rankMap[other] === targetRank);
  if (!neighborId) return rankMap;
  return { ...rankMap, [id]: targetRank, [neighborId]: currentRank };
}

/** Drop `draggedId` into the slot currently held by `targetId`, shifting the
 *  rows between them — the ordinary drag-and-drop list semantic, not a
 *  simple two-item swap. Converts to an ordered array only internally. */
export function reorderByDrag(rankMap: RankMap, draggedId: CriterionId, targetId: CriterionId): RankMap {
  if (draggedId === targetId) return rankMap;
  const ids = orderedIds(rankMap);
  const fromIndex = ids.indexOf(draggedId);
  const toIndex = ids.indexOf(targetId);
  if (fromIndex === -1 || toIndex === -1) return rankMap;
  const next = ids.slice();
  next.splice(fromIndex, 1);
  next.splice(toIndex, 0, draggedId);
  return rankMapFromOrder(next);
}

export function leadCriterionId(rankMap: RankMap): CriterionId {
  return orderedIds(rankMap)[0];
}

/** "Condition → Seller rating → Price → Rarity → Shipping speed" */
export function describeOrder(rankMap: RankMap): string {
  return orderedIds(rankMap)
    .map((id) => CRITERION_MAP[id].label)
    .join(" → ");
}

export interface Scored {
  id: string;
  /** Fixed, per-criterion score 0-100 — independent of the visitor's ranking. */
  scores: Record<CriterionId, number>;
}

/** Weighted composite match score, 0-100, from one listing's fixed
 *  per-criterion scores and the current weight-from-rank mapping. The SAME
 *  function backs the hero scoreboard, the listing grid, and the CTA. */
export function computeMatchScore<T extends Scored>(item: T, rankMap: RankMap): number {
  const total = CRITERIA.reduce((sum, c) => sum + weightFor(rankMap, c.id) * item.scores[c.id], 0);
  return Math.round(total / 100);
}

export interface RankedItem<T> {
  item: T;
  score: number;
  place: number;
}

/** Score every item against the current rank map and sort descending by
 *  score. Ties break on id so the order is fully deterministic — never a
 *  silent re-shuffle when two scores land exactly equal. */
export function rankItems<T extends Scored & { id: string }>(items: T[], rankMap: RankMap): RankedItem<T>[] {
  return items
    .map((item) => ({ item, score: computeMatchScore(item, rankMap), place: 0 }))
    .sort((a, b) => b.score - a.score || a.item.id.localeCompare(b.item.id))
    .map((entry, index) => ({ ...entry, place: index + 1 }));
}
