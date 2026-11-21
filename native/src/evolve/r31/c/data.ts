// Deterministic dummy data + pure derivation logic for Price Drop Alert Settings.
// No Math.random / Date.now / bare new Date anywhere in this file.

export type ThresholdMode = "price" | "percent";

export interface WatchedListing {
  id: string;
  title: string;
  conditionLabel: string;
  currentPrice: number; // USD
  swatchIndex: 0 | 1 | 2;
  alertEnabled: boolean;
  thresholdMode: ThresholdMode;
  /** raw text the shopper has typed for a fixed-price trigger, kept even when not the active mode */
  priceTriggerInput: string;
  /** raw text the shopper has typed for a percent-drop trigger, kept even when not the active mode */
  percentTriggerInput: string;
}

export const INITIAL_LISTINGS: WatchedListing[] = [
  {
    id: "lst-01",
    title: "Patagonia Better Sweater Fleece Jacket",
    conditionLabel: "Gently used, size M",
    currentPrice: 68.0,
    swatchIndex: 0,
    alertEnabled: true,
    thresholdMode: "price",
    priceTriggerInput: "55",
    percentTriggerInput: "15",
  },
  {
    id: "lst-02",
    title: "Herman Miller Aeron Chair, Size B",
    conditionLabel: "Good, minor armrest wear",
    currentPrice: 410.0,
    swatchIndex: 1,
    alertEnabled: true,
    thresholdMode: "percent",
    priceTriggerInput: "350",
    percentTriggerInput: "10",
  },
  {
    id: "lst-03",
    title: "Canon AE-1 35mm Film Camera",
    conditionLabel: "Working, cosmetic wear on body",
    currentPrice: 145.0,
    swatchIndex: 2,
    alertEnabled: false,
    thresholdMode: "price",
    priceTriggerInput: "120",
    percentTriggerInput: "20",
  },
  {
    id: "lst-04",
    title: "West Elm Mid-Century Record Console",
    conditionLabel: "Excellent, one owner",
    currentPrice: 620.0,
    swatchIndex: 0,
    alertEnabled: true,
    thresholdMode: "price",
    // deliberately not below current price yet, to exercise the inline validation state
    priceTriggerInput: "650",
    percentTriggerInput: "12",
  },
  {
    id: "lst-05",
    title: "Supreme Box Logo Hoodie (FW21)",
    conditionLabel: "New with tags",
    currentPrice: 310.0,
    swatchIndex: 1,
    alertEnabled: false,
    thresholdMode: "percent",
    priceTriggerInput: "260",
    percentTriggerInput: "8",
  },
  {
    id: "lst-06",
    title: "Le Creuset Dutch Oven, 5.5 qt",
    conditionLabel: "Like new, box included",
    currentPrice: 95.0,
    swatchIndex: 2,
    alertEnabled: true,
    thresholdMode: "percent",
    // deliberately blank, to exercise the inline validation state
    percentTriggerInput: "",
    priceTriggerInput: "80",
  },
];

/**
 * The single source of truth both the toggle and the inline inputs write into.
 * Returns the resolved "notify when price drops below" value in dollars, or
 * null when the current input for the active mode is missing/out of range.
 */
export function resolveNotifyBelow(listing: WatchedListing): number | null {
  if (listing.thresholdMode === "price") {
    const entered = Number(listing.priceTriggerInput);
    if (!listing.priceTriggerInput.trim()) return null;
    if (!Number.isFinite(entered)) return null;
    if (entered <= 0 || entered >= listing.currentPrice) return null;
    return Math.round(entered * 100) / 100;
  }

  const enteredPercent = Number(listing.percentTriggerInput);
  if (!listing.percentTriggerInput.trim()) return null;
  if (!Number.isFinite(enteredPercent)) return null;
  if (enteredPercent <= 0 || enteredPercent >= 100) return null;
  return Math.round(listing.currentPrice * (1 - enteredPercent / 100) * 100) / 100;
}

/** A listing only counts as an active alert when it's on AND its trigger resolves. */
export function isAlertActive(listing: WatchedListing): boolean {
  return listing.alertEnabled && resolveNotifyBelow(listing) !== null;
}

export function formatUsd(value: number): string {
  return `$${value.toFixed(2)}`;
}
