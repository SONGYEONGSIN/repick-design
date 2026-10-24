// native/src/evolve/r41/a/data.ts
//
// Deterministic dummy data + pure formatting helpers for the "Gift This
// Item" screen. Nothing here reads the clock or a random source — every
// value is a hardcoded literal or a pure function of one.

export interface GiftableItem {
  id: string;
  name: string;
  priceCents: number;
  thumbnailInitial: string;
  conditionLabel: string;
  categoryLabel: string;
}

// The single item this screen is built around. In the real app this would
// come from the listing/order the buyer tapped "Gift This" from.
export const giftableItem: GiftableItem = {
  id: "order-8821-leather-jacket",
  name: "Vintage Leather Jacket",
  priceCents: 14800,
  thumbnailInitial: "V",
  conditionLabel: "Good",
  categoryLabel: "Outerwear",
};

export const GIFT_NOTE_MAX_CHARS = 200;

export type DeliveryMethodKey =
  | "ship_to_recipient"
  | "deliver_in_person"
  | "digital_gift_card";

export interface DeliveryMethodOption {
  key: DeliveryMethodKey;
  label: string;
  helperText: string;
}

// Exactly 3 options, per the brief's 2-3 range, covering the three distinct
// fulfillment shapes a gifted resale item can take.
export const deliveryMethodOptions: DeliveryMethodOption[] = [
  {
    key: "ship_to_recipient",
    label: "Ship directly to recipient",
    helperText:
      "We send this exact item straight to them. You won't see it again before they do.",
  },
  {
    key: "deliver_in_person",
    label: "I'll deliver it myself",
    helperText:
      "We hold the item under your account. You pick it up and hand it over yourself.",
  },
  {
    key: "digital_gift_card",
    label: "Send as a digital gift card instead",
    helperText:
      "They get a gift card for this item's value and choose what to redeem it on.",
  },
];

export function deliveryMethodLabelFor(key: DeliveryMethodKey): string {
  const match = deliveryMethodOptions.find((option) => option.key === key);
  return match ? match.label : "";
}

// Hand-rolled USD formatting (no Intl dependency, fully deterministic).
// 14800 -> "$148", 14850 -> "$148.50".
export function formatUsd(cents: number): string {
  const safeCents = Math.round(Math.abs(cents));
  const sign = cents < 0 ? "-" : "";
  const dollars = Math.floor(safeCents / 100);
  const remainderCents = safeCents % 100;
  const groupedDollars = groupThousands(dollars);
  if (remainderCents === 0) {
    return `${sign}$${groupedDollars}`;
  }
  const centsPart = remainderCents.toString().padStart(2, "0");
  return `${sign}$${groupedDollars}.${centsPart}`;
}

function groupThousands(value: number): string {
  const digits = value.toString();
  let result = "";
  for (let i = 0; i < digits.length; i += 1) {
    const positionFromRight = digits.length - i;
    if (i > 0 && positionFromRight % 3 === 0) {
      result += ",";
    }
    result += digits[i];
  }
  return result;
}

// Joins a list of missing-field names into one readable English clause,
// e.g. ["a name", "an email"] -> "a name and an email".
export function joinWithAnd(parts: string[]): string {
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0];
  if (parts.length === 2) return `${parts[0]} and ${parts[1]}`;
  return `${parts.slice(0, -1).join(", ")}, and ${parts[parts.length - 1]}`;
}
