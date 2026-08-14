// native/src/evolve/r5/b/data.ts — deterministic dummy data for the order tracking timeline
// No Math.random / Date.now / bare `new Date()` anywhere — every date is a fixed literal label.

export type StepStatus = "done" | "current" | "upcoming";

export interface TrackingStep {
  id: string;
  label: string;
  status: StepStatus;
  /** Locale-style absolute label (actual time if done/current, estimate if upcoming). */
  dateLabel: string;
  /** Always-visible one-line summary. */
  summary: string;
  /** Longer explanation revealed when the buyer taps the step. */
  detail: string;
}

export interface OrderSummary {
  orderId: string;
  itemTitle: string;
  itemSpec: string;
  /** Price in Korean won, fixed literal. */
  priceWon: number;
  sellerName: string;
  orderedDateLabel: string;
  estimatedWindowLabel: string;
}

export interface CourierInfo {
  carrierName: string;
  trackingNumber: string;
  carrierPhone: string;
  lastScanLabel: string;
  lastScanLocation: string;
}

export const ORDER: OrderSummary = {
  orderId: "RP-58231",
  itemTitle: "Mechanical keyboard · Leopold FC750R",
  itemSpec: "Cherry MX Brown switches, cream PBT keycaps",
  priceWon: 168000,
  sellerName: "Minji P.",
  orderedDateLabel: "Wed, Aug 12",
  estimatedWindowLabel: "Aug 13–15",
};

export const COURIER: CourierInfo = {
  carrierName: "CJ Logistics",
  trackingNumber: "6123 4589 0021",
  carrierPhone: "1588-1255",
  lastScanLabel: "Last scan",
  lastScanLocation: "Seoul Songpa Hub, Fri Aug 14 · 9:47 AM",
};

// Fixed literal — shown only after the buyer presses "Confirm receipt".
// Not derived from Date.now(); a plain constant like the rest of this file's labels.
export const CONFIRMED_AT_LABEL = "Fri, Aug 14 · 2:10 PM";

export const ORDER_STEPS: TrackingStep[] = [
  {
    id: "payment",
    label: "Payment confirmed",
    status: "done",
    dateLabel: "Wed, Aug 12 · 10:14 AM",
    summary: "Payment held in escrow until you confirm receipt.",
    detail:
      "Repick received your payment and notified Minji P. right away. Funds stay in escrow until you confirm the item matches the listing.",
  },
  {
    id: "shipped",
    label: "Seller shipped",
    status: "done",
    dateLabel: "Wed, Aug 12 · 3:40 PM",
    summary: "Handed to CJ Logistics at the Gangnam branch.",
    detail:
      "Minji P. dropped the package at the CJ Logistics Gangnam branch and uploaded a photo of the shipping label for the order file.",
  },
  {
    id: "transit",
    label: "In transit",
    status: "done",
    dateLabel: "Thu, Aug 13 · 8:05 AM",
    summary: "Scanned at Seoul Songpa Hub.",
    detail:
      "The package cleared the Seoul Songpa sorting hub and was routed to the delivery branch nearest you.",
  },
  {
    id: "delivered",
    label: "Delivered",
    status: "current",
    dateLabel: "Fri, Aug 14 · 11:22 AM",
    summary: "Left at your front door.",
    detail:
      "The courier left the package at your front door per your delivery instructions and logged a photo at drop-off.",
  },
];

// Thousands-separated KRW digit formatting, no symbol — callers place the ₩ sign
// in a separate sibling Text node (see OrderTrackingScreen), and this run never carries
// a tabular-nums style, so the two concerns stay decoupled by construction.
export function formatWonAmount(won: number): string {
  const sign = won < 0 ? "-" : "";
  const digits = Math.abs(won).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${sign}${digits}`;
}
