// native/src/evolve/r52/c/data.ts — auto-native-r52 candidate c
//
// Deterministic seed data + pure helpers for the Split Delivery Addresses
// screen: a buyer who just placed one order containing several line items
// (bought together, several of them as gifts) must point EACH line item at
// one of a small set of saved delivery addresses before the order can be
// confirmed. No Math.random / Date.now / argument-less `new Date()` — every
// id, price and address below is a fixed literal, and the one thing that
// looks like "assignment state" (INITIAL_ASSIGNMENTS) is itself a fixed
// literal map, not something computed at load time.

export type OrderLineItem = {
  id: string;
  title: string;
  quantity: number;
  /** Line total in KRW for this item (already quantity-multiplied). */
  priceWon: number;
  swatchIndex: 1 | 2 | 3;
};

export type DeliveryAddressOption = {
  id: string;
  label: string;
  recipientName: string;
  line1: string;
  line2?: string;
  cityStateZip: string;
};

export const ORDER_ID = "ORD-20261106-0417";

// Five line items from one checkout — several are gifts headed to different
// people, which is exactly why a single "ship everything to one address"
// assumption breaks down here.
export const ORDER_ITEMS: OrderLineItem[] = [
  {
    id: "item-polaroid",
    title: "Vintage Polaroid SX-70 Camera",
    quantity: 1,
    priceWon: 128000,
    swatchIndex: 1,
  },
  {
    id: "item-mugs",
    title: "Hand-thrown Ceramic Mug Set",
    quantity: 1,
    priceWon: 42000,
    swatchIndex: 2,
  },
  {
    id: "item-scarf",
    title: "Wool Blend Scarf",
    quantity: 2,
    priceWon: 35000,
    swatchIndex: 3,
  },
  {
    id: "item-passport",
    title: "Leather Passport Holder",
    quantity: 1,
    priceWon: 29000,
    swatchIndex: 1,
  },
  {
    id: "item-candles",
    title: "Set of 3 Scented Candles",
    quantity: 1,
    priceWon: 24000,
    swatchIndex: 2,
  },
];

// Three saved addresses on this buyer's account. Field names mirror the
// shape used elsewhere in this app's saved-address screens (label,
// recipientName, line1/line2, cityStateZip) so this screen's data stays
// consistent with that convention, even though this screen never lists or
// manages addresses on its own — it only assigns items to them.
export const DELIVERY_ADDRESSES: DeliveryAddressOption[] = [
  {
    id: "addr-home",
    label: "Home",
    recipientName: "Jiho Kang",
    line1: "12 Maple Grove Road",
    cityStateZip: "Austin, TX 78701",
  },
  {
    id: "addr-parents",
    label: "Parents' House",
    recipientName: "Soo-jin Kang",
    line1: "48 Willowbend Drive",
    cityStateZip: "Austin, TX 78745",
  },
  {
    id: "addr-friend",
    label: "Best Friend's Apartment",
    recipientName: "Elena Cho",
    line1: "900 Riverside Court, Unit 12",
    cityStateZip: "Austin, TX 78702",
  },
];

/**
 * Starting point for the one state field this screen's assignment logic is
 * built on: itemId -> addressId, or null when an item hasn't been pointed
 * at an address yet. Two of five items arrive pre-assigned (the buyer
 * already knows those two are for themselves); the other three — all
 * gifts — start unassigned, so the gate's "items still need an address"
 * language is true from the very first render, not just after interaction.
 */
export const INITIAL_ASSIGNMENTS: Readonly<Record<string, string | null>> = {
  "item-polaroid": "addr-home",
  "item-mugs": null,
  "item-scarf": "addr-friend",
  "item-passport": null,
  "item-candles": null,
};

export function findAddressById(id: string | null): DeliveryAddressOption | null {
  if (!id) return null;
  return DELIVERY_ADDRESSES.find((address) => address.id === id) ?? null;
}

export function formatWon(amountWon: number): string {
  const digits = Math.round(amountWon).toString();
  const withCommas = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  // Space between ₩ and the digits so the glyph never reads as a strike
  // through the first number.
  return `₩ ${withCommas}`;
}

export function quantityLabel(quantity: number): string {
  return quantity === 1 ? "Qty 1" : `Qty ${quantity}`;
}

export function orderTotalWon(items: OrderLineItem[]): number {
  return items.reduce((sum, item) => sum + item.priceWon, 0);
}

/** One sentence naming exactly how many items still lack an address. */
export function unassignedGateSentence(unassignedCount: number, totalCount: number): string {
  if (unassignedCount === 1) {
    return `1 of ${totalCount} items still needs a delivery address before you can confirm this order.`;
  }
  return `${unassignedCount} of ${totalCount} items still need a delivery address before you can confirm this order.`;
}

export function readyToConfirmSentence(totalCount: number): string {
  return `All ${totalCount} items have a delivery address. Ready to confirm this order.`;
}

export function orderConfirmedSentence(totalCount: number): string {
  return `Order confirmed — all ${totalCount} items are set to ship to their assigned addresses.`;
}

/** Visible + spoken description of where one line item will ship. */
export function assignedAddressSummary(address: DeliveryAddressOption): string {
  return `${address.label} — ${address.recipientName}, ${address.line1}, ${address.cityStateZip}`;
}
