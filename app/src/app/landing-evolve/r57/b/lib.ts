// Pure data + derivation logic for the FOCAL rank-priority device. No React,
// no hooks — safe to import from every client component on this route. Every
// number or label shown anywhere on the page (hero proof card, narrative
// sentence, proof-wall featured card, value-prop tiles, closing CTA) must
// flow through getRankResult() so none of them can drift into a second,
// separately-hardcoded literal that silently contradicts the live one.

export type CriterionId = "price" | "condition" | "speed" | "trust";

export interface Criterion {
  id: CriterionId;
  /** Exact wording used both on the draggable chip and inside the narrative sentence. */
  label: string;
  /** Short noun used in the "trading X for Y" clause of the narrative sentence. */
  tradeNoun: string;
}

export const CRITERIA: Criterion[] = [
  { id: "price", label: "Price", tradeNoun: "savings" },
  { id: "condition", label: "Condition", tradeNoun: "cosmetic polish" },
  { id: "speed", label: "Speed of delivery", tradeNoun: "delivery speed" },
  { id: "trust", label: "Seller trust score", tradeNoun: "verification depth" },
];

const CRITERIA_BY_ID: Record<CriterionId, Criterion> = {
  price: CRITERIA[0],
  condition: CRITERIA[1],
  speed: CRITERIA[2],
  trust: CRITERIA[3],
};

export function criterion(id: CriterionId): Criterion {
  return CRITERIA_BY_ID[id];
}

/** Rank 1 → 0.4, rank 2 → 0.3, rank 3 → 0.2, rank 4 → 0.1. The chip in slot
 *  index i of the current order is weighted RANK_WEIGHTS[i]. This is the
 *  one and only weighting scheme on the route. */
export const RANK_WEIGHTS = [0.4, 0.3, 0.2, 0.1] as const;

export const DEFAULT_RANK_ORDER: CriterionId[] = ["price", "condition", "speed", "trust"];

export type Grade = "Like New" | "Excellent" | "Good";
export type TrustTier = "Veteran" | "Established" | "Newer";

export interface Listing {
  id: string;
  title: string;
  price: number;
  originalPrice: number;
  /** 0–100. Condition grade, delivery badge and trust tier are all derived
   *  from these three scores (plus price/originalPrice) — never stored a
   *  second time as an independent literal, so a badge can never silently
   *  disagree with the number that produced it. */
  conditionScore: number;
  speedScore: number;
  trustScore: number;
  matchPercent: number;
  verified: boolean;
  matchReason: string;
  photoId: string;
}

export const LISTINGS: Listing[] = [
  {
    id: "canon-r6",
    title: "Canon EOS R6 Body",
    price: 1350,
    originalPrice: 2499,
    conditionScore: 78,
    speedScore: 65,
    trustScore: 58,
    matchPercent: 89,
    verified: true,
    matchReason: "Matches your full-frame + hybrid-shooter filter",
    photoId: "photo-1495121605193-b116b5b09a56",
  },
  {
    id: "sony-a7iv",
    title: "Sony A7 IV + 28–70mm Kit",
    price: 2100,
    originalPrice: 2799,
    conditionScore: 93,
    speedScore: 48,
    trustScore: 92,
    matchPercent: 94,
    verified: true,
    matchReason: "Matches your kit-lens + video-hybrid search",
    photoId: "photo-1441986300917-64674bd600d8",
  },
  {
    id: "fuji-xt5",
    title: "Fujifilm X-T5 Body",
    price: 1180,
    originalPrice: 1699,
    conditionScore: 82,
    speedScore: 95,
    trustScore: 70,
    matchPercent: 86,
    verified: true,
    matchReason: "Matches your APS-C + local-pickup filter",
    photoId: "photo-1560243563-062bfc001d68",
  },
  {
    id: "nikon-z6ii",
    title: "Nikon Z6 II + 24–70mm Lens",
    price: 1420,
    originalPrice: 2199,
    conditionScore: 62,
    speedScore: 80,
    trustScore: 55,
    matchPercent: 78,
    verified: false,
    matchReason: "Matches your full-frame zoom-kit search",
    photoId: "photo-1509631179647-0177331693ae",
  },
  {
    id: "leica-q2",
    title: "Leica Q2 Compact",
    price: 3600,
    originalPrice: 4250,
    conditionScore: 97,
    speedScore: 48,
    trustScore: 96,
    matchPercent: 91,
    verified: true,
    matchReason: "Matches your premium fixed-lens search",
    photoId: "photo-1523381210434-271e8be1f52b",
  },
  {
    id: "panasonic-s5ii",
    title: "Panasonic S5 II Body",
    price: 980,
    originalPrice: 1999,
    conditionScore: 62,
    speedScore: 65,
    trustScore: 44,
    matchPercent: 82,
    verified: false,
    matchReason: "Matches your budget full-frame filter",
    photoId: "photo-1543076447-215ad9ba6923",
  },
];

export function discountPercent(listing: Listing): number {
  return Math.round(((listing.originalPrice - listing.price) / listing.originalPrice) * 100);
}

export function gradeLabel(conditionScore: number): Grade {
  if (conditionScore >= 90) return "Like New";
  if (conditionScore >= 70) return "Excellent";
  return "Good";
}

export function speedBadgeLabel(speedScore: number): string {
  if (speedScore >= 90) return "Same-day pickup";
  if (speedScore >= 75) return "Next-day delivery";
  if (speedScore >= 55) return "2-day shipping";
  return "3–5 day shipping";
}

function speedNarrativePhrase(speedScore: number): string {
  if (speedScore >= 90) return "ready for same-day pickup";
  if (speedScore >= 75) return "arriving next-day";
  if (speedScore >= 55) return "shipping in 2 days";
  return "shipping in 3–5 days";
}

export function trustTierLabel(trustScore: number): TrustTier {
  if (trustScore >= 85) return "Veteran";
  if (trustScore >= 60) return "Established";
  return "Newer";
}

function trustNarrativePhrase(trustScore: number): string {
  if (trustScore >= 85) return "a veteran seller";
  if (trustScore >= 60) return "an established seller";
  return "a newer seller";
}

function criterionScore(listing: Listing, id: CriterionId): number {
  switch (id) {
    case "price":
      return discountPercent(listing);
    case "condition":
      return listing.conditionScore;
    case "speed":
      return listing.speedScore;
    case "trust":
      return listing.trustScore;
  }
}

/** The factual clause describing a listing's actual value on one criterion,
 *  used mid-sentence in the narrative. Reads naturally after "it's ...". */
function factClause(listing: Listing, id: CriterionId): string {
  switch (id) {
    case "price":
      return `${discountPercent(listing)}% under market`;
    case "condition":
      return `graded ${gradeLabel(listing.conditionScore)}`;
    case "speed":
      return speedNarrativePhrase(listing.speedScore);
    case "trust":
      return `backed by ${trustNarrativePhrase(listing.trustScore)}`;
  }
}

/** Short "{value} — {detail}" pair for a listing's actual value on one
 *  criterion, used by the value-prop tiles. Same scores as factClause and
 *  the weighting itself — never a separate literal. */
export function criterionDisplay(listing: Listing, id: CriterionId): { value: string; detail: string } {
  switch (id) {
    case "price":
      return { value: `${discountPercent(listing)}% off`, detail: `$${listing.price} vs $${listing.originalPrice}` };
    case "condition":
      return { value: gradeLabel(listing.conditionScore), detail: `${listing.conditionScore}/100 condition score` };
    case "speed":
      return { value: speedBadgeLabel(listing.speedScore), detail: `${listing.speedScore}/100 speed score` };
    case "trust":
      return { value: `${trustTierLabel(listing.trustScore)} seller`, detail: `${listing.trustScore}/100 trust score` };
  }
}

function weightedTotal(listing: Listing, order: CriterionId[]): number {
  return order.reduce(
    (sum, critId, index) => sum + criterionScore(listing, critId) * RANK_WEIGHTS[index],
    0,
  );
}

export interface ScoredListing {
  listing: Listing;
  score: number;
}

export interface RankResult {
  order: CriterionId[];
  /** Every listing with its weighted score for this order, sorted best first. */
  scored: ScoredListing[];
  top: Listing;
  topScore: number;
  /** order[0] — the criterion driving the pick. */
  primary: Criterion;
  /** order[3] — the criterion knowingly sacrificed. */
  deprioritized: Criterion;
  /** The single deterministic explanatory sentence, a pure function of `order`. */
  narrative: string;
}

/**
 * The single source of truth for every derived number, badge and sentence on
 * this route. The hero device, the proof-wall featured card, the value-prop
 * tiles and the closing CTA all call this same function with the current
 * rank order — never a second hardcoded copy of the result.
 */
export function getRankResult(order: CriterionId[]): RankResult {
  const scored: ScoredListing[] = LISTINGS.map((listing) => ({
    listing,
    score: weightedTotal(listing, order),
  })).sort((a, b) => b.score - a.score || a.listing.id.localeCompare(b.listing.id));

  const top = scored[0].listing;
  const primary = criterion(order[0]);
  const deprioritized = criterion(order[3]);

  const narrative =
    `Because you ranked ${primary.label} first and ${deprioritized.label} last, we're surfacing ` +
    `the ${top.title} — it's ${factClause(top, primary.id)} and ${factClause(top, deprioritized.id)}, ` +
    `trading ${deprioritized.tradeNoun} for ${primary.tradeNoun}.`;

  return { order, scored, top, topScore: scored[0].score, primary, deprioritized, narrative };
}
