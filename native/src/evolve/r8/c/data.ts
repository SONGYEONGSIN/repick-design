// native/src/evolve/r8/c/data.ts — deterministic dummy data for the checkout / order review screen.
// No Math.random / Date.now / bare `new Date()` anywhere — every value below is a fixed literal
// or a plain arithmetic expression over fixed literals (so the total always sums correctly).

export interface ReviewItem {
  title: string;
  condition: string;
  /** Short two-letter placeholder mark shown inside the thumbnail box — no image asset used. */
  thumbnailMark: string;
  priceWon: number;
}

export interface ShippingAddress {
  recipientName: string;
  line1: string;
  line2: string;
  phone: string;
}

export interface PaymentMethod {
  label: string;
  brand: string;
  last4: string;
  expiryLabel: string;
}

export const ITEM: ReviewItem = {
  title: "Canon AE-1 Program film camera",
  condition: "Good — light brassing on top plate, meter tested working",
  thumbnailMark: "CA",
  priceWon: 245000,
};

export const ADDRESS: ShippingAddress = {
  recipientName: "Ha-eun Kim",
  line1: "14 Yeonhui-ro, 3rd floor",
  line2: "Seodaemun-gu, Seoul 03682",
  phone: "010-2231-9087",
};

export const PAYMENT: PaymentMethod = {
  label: "Personal card",
  brand: "Shinhan Card",
  last4: "4471",
  expiryLabel: "Exp 09/28",
};

// Fixed literals — the total is a plain sum, never re-derived at runtime from randomness or Date.
export const ITEM_PRICE_WON = ITEM.priceWon;
export const SHIPPING_FEE_WON = 3500;
export const SERVICE_FEE_WON = 12250;
export const TOTAL_WON = ITEM_PRICE_WON + SHIPPING_FEE_WON + SERVICE_FEE_WON;

export function formatWonAmount(won: number): string {
  const sign = won < 0 ? "-" : "";
  const digits = Math.abs(won).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${sign}${digits}`;
}
