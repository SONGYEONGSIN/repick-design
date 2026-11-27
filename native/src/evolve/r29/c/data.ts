// native/src/evolve/r29/c/data.ts — auto-native-r29 candidate c
// Deterministic seed data for the Saved Addresses screen: a buyer's shipping
// destinations on file, independent of any one order. No Math.random/Date.now —
// every id, order reference and copy string below is fixed.

export type SavedAddress = {
  id: string;
  label: string;
  recipientName: string;
  line1: string;
  line2?: string;
  cityStateZip: string;
  isDefault: boolean;
  // When non-null, this address is currently the ship-to on an order that has
  // already left the warehouse, so it can't be removed — references a real,
  // specific fixed order id rather than a vague "in use" flag.
  lockedByOrderId: string | null;
};

export const SEED_ADDRESSES: SavedAddress[] = [
  {
    id: "addr-rowan",
    label: "Home",
    recipientName: "Yoon Song",
    line1: "214 Rowan Street, Apt 3B",
    cityStateZip: "Portland, OR 97209",
    isDefault: true,
    lockedByOrderId: null,
  },
  {
    id: "addr-harcourt",
    label: "Office",
    recipientName: "Yoon Song",
    line1: "88 Harcourt Avenue, Suite 500",
    line2: "c/o Front Desk",
    cityStateZip: "Portland, OR 97204",
    isDefault: false,
    lockedByOrderId: null,
  },
  {
    id: "addr-fennel",
    label: "Parents' House",
    recipientName: "Mi-ra Song",
    line1: "17 Fennel Court",
    cityStateZip: "Beaverton, OR 97006",
    isDefault: false,
    lockedByOrderId: "RP-4821",
  },
  {
    id: "addr-cobalt",
    label: "Beach House",
    recipientName: "Yoon Song",
    line1: "502 Cobalt Lane",
    cityStateZip: "Lincoln City, OR 97367",
    isDefault: false,
    lockedByOrderId: null,
  },
];

// Inline reason shown on a locked row, and reused as the disabled button's
// accessibility label — specific and deterministic, never a vague refusal.
export function lockedReasonText(orderId: string): string {
  return `Used by order #${orderId} — in transit`;
}

export function addressCountLabel(n: number): string {
  return `${n} saved ${n === 1 ? "address" : "addresses"}`;
}

// Single sentence used for BOTH the visible confirmation copy and the
// accessibilityRole="alert" announcement on that same text node — one string,
// never two differently-worded versions of the same prompt.
export function removalPromptText(address: SavedAddress): string {
  return `Remove ${address.label} (${address.line1})? This can't be undone.`;
}

export function removedNoticeText(address: SavedAddress): string {
  return `${address.label} removed from your saved addresses.`;
}

export function defaultNoticeText(address: SavedAddress): string {
  return `${address.label} is now your default address.`;
}
