// native/src/evolve/r19/a/data.ts — auto-native-r19 candidate a.
// Deterministic dummy data for the Shipping Label & Pickup Scheduling screen.
// No Math.random / Date.now / no-arg `new Date()` anywhere in this file.

export const SALE = {
  orderNumber: "48221",
  itemTitle: "Fujifilm X100V — Silver, lightly used",
  buyerHandle: "buyer_hana92",
  saleDateLabel: "Sep 9, 2026",
  salePriceLabel: "$780.00",
};

// Weight input range (lb), adjusted with stepper buttons.
export const WEIGHT_MIN_LB = 0.5;
export const WEIGHT_MAX_LB = 15;
export const WEIGHT_STEP_LB = 0.5;
export const DEFAULT_WEIGHT_LB = 1.5;

// Dimension input range (in), adjusted with stepper buttons.
export const DIM_MIN_IN = 4;
export const DIM_MAX_IN = 20;
export const DIM_STEP_IN = 1;
export const DEFAULT_LENGTH_IN = 9;
export const DEFAULT_WIDTH_IN = 7;
export const DEFAULT_HEIGHT_IN = 5;

// Industry-standard inches/pounds dimensional-weight divisor.
export const DIM_DIVISOR = 139;

export type WeightBracket = { id: string; maxLb: number; label: string };

// Billable-weight brackets — the rate table below is keyed to this array's order.
export const WEIGHT_BRACKETS: WeightBracket[] = [
  { id: "br0-1", maxLb: 1, label: "Up to 1 lb" },
  { id: "br1-2", maxLb: 2, label: "1–2 lb" },
  { id: "br2-5", maxLb: 5, label: "2–5 lb" },
  { id: "br5-10", maxLb: 10, label: "5–10 lb" },
  { id: "br10-15", maxLb: 15, label: "10–15 lb" },
];

export type ServiceOption = {
  id: string;
  carrierName: string;
  tierLabel: string;
  etaLabel: string;
  // Cents, parallel to WEIGHT_BRACKETS — the rate table.
  ratesCents: number[];
};

export const SERVICE_OPTIONS: ServiceOption[] = [
  {
    id: "greenline-standard",
    carrierName: "GreenLine Post",
    tierLabel: "Standard",
    etaLabel: "4–6 business days",
    ratesCents: [595, 795, 1095, 1495, 1995],
  },
  {
    id: "greenline-expedited",
    carrierName: "GreenLine Post",
    tierLabel: "Expedited",
    etaLabel: "2–3 business days",
    ratesCents: [995, 1295, 1695, 2195, 2895],
  },
  {
    id: "apex-standard",
    carrierName: "Apex Parcel",
    tierLabel: "Standard",
    etaLabel: "3–5 business days",
    ratesCents: [650, 850, 1150, 1550, 2050],
  },
  {
    id: "apex-priority",
    carrierName: "Apex Parcel",
    tierLabel: "Priority",
    etaLabel: "1–2 business days",
    ratesCents: [1150, 1495, 1895, 2495, 3295],
  },
  {
    id: "summit-standard",
    carrierName: "Summit Freight",
    tierLabel: "Standard",
    etaLabel: "5–7 business days",
    ratesCents: [545, 725, 995, 1350, 1795],
  },
];

// Short deterministic codes used to build the label reference — no randomness.
export const SERVICE_CODE: Record<string, string> = {
  "greenline-standard": "GLS",
  "greenline-expedited": "GLX",
  "apex-standard": "APS",
  "apex-priority": "APP",
  "summit-standard": "SMS",
};

export type PickupWindow = {
  id: string;
  carrierName: string; // which carrier's local courier route covers this window
  dateLabel: string;
  timeLabel: string;
};

export const PICKUP_WINDOWS: PickupWindow[] = [
  { id: "w1", carrierName: "GreenLine Post", dateLabel: "Fri, Sep 12", timeLabel: "8:00–11:00 AM" },
  { id: "w2", carrierName: "GreenLine Post", dateLabel: "Fri, Sep 12", timeLabel: "1:00–4:00 PM" },
  { id: "w3", carrierName: "GreenLine Post", dateLabel: "Sat, Sep 13", timeLabel: "8:00–11:00 AM" },
  { id: "w4", carrierName: "Apex Parcel", dateLabel: "Fri, Sep 12", timeLabel: "9:00 AM–12:00 PM" },
  { id: "w5", carrierName: "Apex Parcel", dateLabel: "Mon, Sep 15", timeLabel: "12:00–3:00 PM" },
  { id: "w6", carrierName: "Summit Freight", dateLabel: "Sat, Sep 13", timeLabel: "10:00 AM–2:00 PM" },
];

export function buildLabelRef(serviceId: string, windowId: string): string {
  const code = SERVICE_CODE[serviceId] ?? "GEN";
  return `RPX-${SALE.orderNumber}-${code}-${windowId.toUpperCase()}`;
}
