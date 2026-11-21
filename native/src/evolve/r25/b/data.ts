// native/src/evolve/r25/b/data.ts — deterministic dummy data for DeliveryReceiptScreen.
// No Math.random / Date.now / argument-less `new Date()` anywhere below — every value is a
// fixed literal, matching the determinism rule in native/GENERATION.md §5.

export type TimelineStep = {
  id: string;
  label: string;
  detail: string;
  timeLabel: string;
  /** The last completed step gets a filled/accent dot instead of a plain filled ink dot —
   * a visual "you are here (at the end)" marker, not a pass/fail verdict like the
   * certificate screen's checkpoint markers. */
  isFinal: boolean;
};

export const ORDER_ID = "RP-88213";
export const CONFIRMED_ON_LABEL = "Sep 24, 2026 · 9:05 AM";

export const ITEM = {
  brand: "Arc'teryx",
  title: "Beta LT Jacket, Men's L",
  size: "L",
  conditionLabel: "Like New",
};

export const PRICE = {
  itemKrw: 238000,
  shippingKrw: 0,
  protectionFeeKrw: 4200,
  get totalKrw() {
    return this.itemKrw + this.shippingKrw + this.protectionFeeKrw;
  },
  paymentMethodLabel: "Card ending in 4471",
  releasedNoteLabel: "Payment released to seller on Sep 24, 2026",
};

export const DELIVERY = {
  method: "CJ Logistics",
  trackingNumber: "6123 4589 0021",
  deliveredAddressMasked: "Mapo-gu, Seoul",
  deliveredOnLabel: "Sep 23, 2026 · 11:42 AM",
  confirmedOnLabel: CONFIRMED_ON_LABEL,
};

export const SELLER = {
  name: "Jin Park",
  handle: "@jinpark_vintage",
  initials: "JP",
  ratingLabel: "4.9 rating · 132 sales",
};

export const TIMELINE_STEPS: TimelineStep[] = [
  {
    id: "step-1",
    label: "Order placed",
    detail: "Buyer paid and the order was created.",
    timeLabel: "Sep 21, 2026 · 2:18 PM",
    isFinal: false,
  },
  {
    id: "step-2",
    label: "Shipped by seller",
    detail: "Handed to CJ Logistics with tracking attached.",
    timeLabel: "Sep 22, 2026 · 10:07 AM",
    isFinal: false,
  },
  {
    id: "step-3",
    label: "Delivered",
    detail: "Courier marked the package as delivered.",
    timeLabel: DELIVERY.deliveredOnLabel,
    isFinal: false,
  },
  {
    id: "step-4",
    label: "Receipt confirmed",
    detail: "Buyer confirmed receipt; payment released to seller.",
    timeLabel: CONFIRMED_ON_LABEL,
    isFinal: true,
  },
];

export const DISCLOSURE_TEXT =
  "This receipt reflects the finalized transaction between buyer and seller. Payment has already been released and this record cannot be edited.";

export const DEFAULT_STATUS_LABEL = `Delivery confirmed on ${CONFIRMED_ON_LABEL}.`;
export const SHARE_STATUS_LABEL = "Receipt link copied to your clipboard.";
export const SAVE_STATUS_LABEL = "Receipt saved to your device.";
export const REPORT_PROMPT_LABEL =
  "Report an issue with this order? Our support team will review the transaction record.";
export const REPORT_CANCELED_LABEL = "Report canceled — no changes made.";
export const REPORT_CONFIRMED_LABEL =
  "Issue reported. Our support team will contact you within 24 hours.";

// Thousands-separated digits, no toLocaleString (deterministic across environments).
function formatDigits(amount: number): string {
  return Math.abs(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// KRW is written out as the letters "KRW" rather than the ₩ glyph — per
// native/GENERATION.md ₩ combined with tabular-nums digits in this font stack can render
// with a strikethrough-like artifact, and this screen shows four separate currency lines
// (item / shipping / protection fee / total), so the simplest globally-safe choice is to
// never put the glyph on screen at all rather than manage spacing on every line.
export function formatKrw(amount: number): string {
  if (amount === 0) return "Free";
  return `KRW ${formatDigits(amount)}`;
}
