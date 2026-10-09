// native/src/evolve/r33/c/data.ts
// Deterministic dummy data for the Shipping Rate Cards screen.
// A "rate card" is a seller-defined shipping-fee rule a listing can be
// attached to (carrier, service speed, flat/weight-based fee, coverage
// area). This is distinct from a single shipment's carrier pickup, from
// a buyer-side shipping protection claim, and from the historical price
// chart of a sold item — it is the seller's own reusable fee configuration.

export type RateCardStatus = "active" | "inactive";

export interface RateCard {
  id: string;
  name: string;
  carrierLabel: string;
  serviceLabel: string;
  feeLabel: string;
  coverageLabel: string;
  status: RateCardStatus;
  /** Platform-level cards the seller cannot remove (always true "active"). */
  locked: boolean;
  /** Shown as a static explanatory badge when locked is true. */
  lockedNote?: string;
}

export const INITIAL_RATE_CARDS: RateCard[] = [
  {
    id: "rc-1",
    name: "Standard Flat Rate",
    carrierLabel: "Platform Default",
    serviceLabel: "Ground service, 3-5 business days",
    feeLabel: "KRW 3,000 flat",
    coverageLabel: "Domestic, all zones",
    status: "active",
    locked: true,
    lockedNote:
      "Built-in fallback. Repick applies this automatically whenever a listing has no other matching rate card, so it can't be removed.",
  },
  {
    id: "rc-2",
    name: "Express Domestic",
    carrierLabel: "CJ Logistics",
    serviceLabel: "Express, next-day delivery",
    feeLabel: "KRW 6,500 flat",
    coverageLabel: "Domestic, Zone A-B only",
    status: "active",
    locked: false,
  },
  {
    id: "rc-3",
    name: "Oversized Item Surcharge",
    carrierLabel: "Hanjin",
    serviceLabel: "Freight, 5-7 business days",
    feeLabel: "KRW 12,000, plus KRW 1,200/kg over 20kg",
    coverageLabel: "Domestic, all zones",
    status: "active",
    locked: false,
  },
  {
    id: "rc-4",
    name: "International Economy",
    carrierLabel: "EMS",
    serviceLabel: "Economy, 10-18 business days",
    feeLabel: "KRW 18,000 flat",
    coverageLabel: "International, East Asia zone",
    status: "inactive",
    locked: false,
  },
  {
    id: "rc-5",
    name: "Local Pickup Only",
    carrierLabel: "Self-arranged",
    serviceLabel: "Buyer pickup, no carrier involved",
    feeLabel: "KRW 0, no shipping fee",
    coverageLabel: "Same city only",
    status: "active",
    locked: false,
  },
  {
    id: "rc-6",
    name: "Fragile Item Handling",
    carrierLabel: "CJ Logistics",
    serviceLabel: "Ground, padded crate, 3-5 business days",
    feeLabel: "KRW 4,800 flat",
    coverageLabel: "Domestic, all zones",
    status: "inactive",
    locked: false,
  },
];

export function isCardLive(card: RateCard): boolean {
  return card.status === "active";
}
