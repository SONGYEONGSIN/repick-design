// native/src/evolve/r46/a/data.ts — auto-native-r46 candidate a.
// Deterministic dummy data for the Shipping Label Purchase screen. No Math.random/Date.now/
// no-arg new Date() anywhere — every value below is a fixed literal.

export type CarrierOption = {
  id: string;
  carrierName: string;
  tierLabel: string;
  etaLabel: string;
  priceWon: number;
};

export const SOLD_ITEM = {
  id: "ord-8821",
  title: "Canon AE-1 35mm Film Camera",
  soldOnLabel: "Sold Oct 29, 2026",
  buyerLabel: "Buyer: J. Han · Busan",
  soldPriceWon: 142000,
};

// Flat per-tier rates. This candidate's shipping partner prices Saver/Standard/Next Day as
// fixed boxed-rate tiers up to a shared weight ceiling well above what SOLD_ITEM could weigh,
// so price does not depend on the weight/dimensions entered in step 2 — see candidate note
// "브리프에 없던 것" for why this was chosen over a dimensional-weight rate table.
export const CARRIER_OPTIONS: CarrierOption[] = [
  {
    id: "ground-saver",
    carrierName: "Hanjin Ground",
    tierLabel: "Saver",
    etaLabel: "4–6 business days",
    priceWon: 3800,
  },
  {
    id: "ground-plus",
    carrierName: "CJ Logistics",
    tierLabel: "Standard",
    etaLabel: "2–3 business days",
    priceWon: 6200,
  },
  {
    id: "express-air",
    carrierName: "Lotte Express",
    tierLabel: "Next Day",
    etaLabel: "1 business day",
    priceWon: 14500,
  },
];

export const INSURANCE_FEE_WON = 1200;

// Sensible defaults pre-filled from the item's known category (a camera body in a padded case) —
// all four fields stay editable.
export const DEFAULT_WEIGHT_LB = "1.4";
export const DEFAULT_LENGTH_IN = "10";
export const DEFAULT_WIDTH_IN = "8";
export const DEFAULT_HEIGHT_IN = "6";

export const WEIGHT_BOUNDS_LB = { min: 0.1, max: 30 };
export const DIM_BOUNDS_IN = { min: 1, max: 36 };

export const PAID_AT_LABEL = "Oct 30, 2026, 9:42 AM";
export const TRACKING_NUMBER = "KR48812093765";
export const LABEL_FORMAT_LABEL = "PDF · 4×6 label";

export function formatWon(amount: number): string {
  const withCommas = Math.round(amount).toLocaleString("en-US");
  // Visible gap between ₩ and the digits — matches this app's existing convention
  // (native/src/payout/data.ts formatWon) so the glyph's stroke never crowds the digits.
  return `₩ ${withCommas}`;
}
