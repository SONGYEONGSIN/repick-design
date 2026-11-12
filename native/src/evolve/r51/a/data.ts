// native/src/evolve/r51/a/data.ts — Item Swap Proposal (deterministic dummy data).
// No Math.random / Date.now / no-arg `new Date()` anywhere below.

export type TradeItem = {
  id: string;
  title: string;
  category: string;
  condition: string;
  estValueWon: number;
};

export type OtherTrader = {
  id: string;
  displayName: string;
  handle: string;
  itemsListed: number;
};

// The counterparty this proposal would be sent to.
export const OTHER_TRADER: OtherTrader = {
  id: "trader-mara",
  displayName: "Mara Jensen",
  handle: "@marajensen",
  itemsListed: 12,
};

// The signed-in seller's own listings — candidates for the "offer" side of the swap.
export const MY_ITEMS: TradeItem[] = [
  {
    id: "mine-camera",
    title: "Canon AE-1 35mm Film Camera",
    category: "Cameras",
    condition: "Good",
    estValueWon: 185000,
  },
  {
    id: "mine-chair",
    title: "Herman Miller Aeron Chair, size B",
    category: "Furniture",
    condition: "Excellent",
    estValueWon: 420000,
  },
  {
    id: "mine-switch",
    title: "Nintendo Switch OLED, white",
    category: "Gaming",
    condition: "Like new",
    estValueWon: 265000,
  },
  {
    id: "mine-backpack",
    title: "Fjällräven Kånken Backpack, ox red",
    category: "Bags",
    condition: "Good",
    estValueWon: 58000,
  },
];

// The other trader's listings — candidates for the "want" side of the swap.
export const THEIR_ITEMS: TradeItem[] = [
  {
    id: "theirs-headphones",
    title: "Sony WH-1000XM4 Headphones",
    category: "Audio",
    condition: "Excellent",
    estValueWon: 210000,
  },
  {
    id: "theirs-dutchoven",
    title: "Le Creuset Dutch Oven, 5.5 qt",
    category: "Kitchen",
    condition: "Good",
    estValueWon: 245000,
  },
  {
    id: "theirs-sweater",
    title: "Patagonia Better Sweater, size M",
    category: "Clothing",
    condition: "Like new",
    estValueWon: 72000,
  },
  {
    id: "theirs-polaroid",
    title: "Polaroid Now+ Instant Camera",
    category: "Cameras",
    condition: "Good",
    estValueWon: 95000,
  },
];

export const NOTE_MAX_LENGTH = 240;

// Thousands-separated KRW, with a trailing space after the ₩ mark so it doesn't
// visually fuse into a strikethrough against tabular-nums digits (per project
// guidance — breathing room, not a new structural fix).
export function formatWon(amount: number): string {
  const digits = Math.abs(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${amount < 0 ? "-" : ""}₩ ${digits}`;
}

export type SwatchKey = "swatch1" | "swatch2" | "swatch3";

// Deterministic placeholder-thumbnail color cycle (index-based, no randomness).
export function swatchForIndex(index: number): SwatchKey {
  const keys: SwatchKey[] = ["swatch1", "swatch2", "swatch3"];
  return keys[index % keys.length];
}
