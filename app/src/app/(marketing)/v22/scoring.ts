import type { Offer } from "./data";

export type Weights = { price: number; speed: number; trust: number };

export const DEFAULT_WEIGHTS: Weights = { price: 45, speed: 20, trust: 35 };

export type ScoredOffer = {
  offer: Offer;
  priceScore: number;
  speedScore: number;
  trustScore: number;
  composite: number;
  rank: number;
};

/** Normalises one metric to a 0–100 sub-score. `lowerIsBetter` for price and ship time. */
function normalize(value: number, min: number, max: number, lowerIsBetter: boolean): number {
  if (max === min) return 100;
  const t = (value - min) / (max - min);
  return lowerIsBetter ? 100 * (1 - t) : 100 * t;
}

/**
 * Re-ranks the offer set for a given weighting. Composite is a weighted mean of the three
 * sub-scores — Σ(wᵢ · scoreᵢ) / Σwᵢ — so weights never need to sum to 100; if every weight is
 * dragged to zero the three axes fall back to an equal blend instead of dividing by zero.
 */
export function rankOffers(offers: Offer[], weights: Weights): ScoredOffer[] {
  const prices = offers.map((o) => o.price);
  const days = offers.map((o) => o.shipDays);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const minDays = Math.min(...days);
  const maxDays = Math.max(...days);

  const totalW = weights.price + weights.speed + weights.trust;
  const w = totalW > 0 ? weights : { price: 1, speed: 1, trust: 1 };
  const denom = totalW > 0 ? totalW : 3;

  const scored: Omit<ScoredOffer, "rank">[] = offers.map((offer) => {
    const priceScore = normalize(offer.price, minPrice, maxPrice, true);
    const speedScore = normalize(offer.shipDays, minDays, maxDays, true);
    const trustScore = offer.trust;
    const composite = (w.price * priceScore + w.speed * speedScore + w.trust * trustScore) / denom;
    return { offer, priceScore, speedScore, trustScore, composite };
  });

  scored.sort((a, b) => b.composite - a.composite);
  return scored.map((s, i) => ({ ...s, rank: i + 1 }));
}

/** Pure single-axis leaders, independent of the live weighting — used by the methodology section. */
export function leaderByAxis(offers: Offer[], axis: "price" | "speed" | "trust"): Offer {
  if (axis === "price") return [...offers].sort((a, b) => a.price - b.price)[0];
  if (axis === "speed") return [...offers].sort((a, b) => a.shipDays - b.shipDays)[0];
  return [...offers].sort((a, b) => b.trust - a.trust)[0];
}
