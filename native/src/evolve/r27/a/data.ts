// native/src/evolve/r27/a/data.ts — auto-native-r27 candidate a.
//
// Deterministic dummy data for the Purchase Archive screen (a read-only record of the buyer's
// already-completed purchases — nothing here is in progress or blocked). No Math.random,
// Date.now, or bare `new Date()` — every date is a fixed literal label, and every derived total
// is a pure computation over the fixed array below, run once at module load.

export type ConditionLabel = "Like New" | "Light Wear" | "Visible Wear";

export type SwatchToken = "swatch1" | "swatch2" | "swatch3";

export interface PurchaseRecord {
  id: string;
  itemTitle: string;
  itemSpec: string;
  sellerName: string;
  condition: ConditionLabel;
  priceWon: number;
  completedDateLabel: string;
  swatch: SwatchToken;
}

// Newest first. Every item, seller and date below is a fixed literal — this list never grows
// or reorders itself at runtime, so the derived summary stats further down stay stable.
export const PURCHASES: PurchaseRecord[] = [
  {
    id: "po-2609",
    itemTitle: "Jordan 1 Retro High OG “Chicago”",
    itemSpec: "Size 270 · leather",
    sellerName: "Doyoon K.",
    condition: "Like New",
    priceWon: 610000,
    completedDateLabel: "Sep 18, 2026",
    swatch: "swatch1",
  },
  {
    id: "po-2598",
    itemTitle: "Patagonia Retro-X Fleece Jacket",
    itemSpec: "Size M · charcoal",
    sellerName: "Haeun L.",
    condition: "Light Wear",
    priceWon: 128000,
    completedDateLabel: "Sep 2, 2026",
    swatch: "swatch2",
  },
  {
    id: "po-2571",
    itemTitle: "Uniqlo U Crew Neck Sweater",
    itemSpec: "Size L · oatmeal",
    sellerName: "Minseo J.",
    condition: "Like New",
    priceWon: 32000,
    completedDateLabel: "Aug 21, 2026",
    swatch: "swatch3",
  },
  {
    id: "po-2549",
    itemTitle: "Coach Willow Leather Tote",
    itemSpec: "Tan · mid-size",
    sellerName: "Yuna P.",
    condition: "Light Wear",
    priceWon: 214000,
    completedDateLabel: "Aug 9, 2026",
    swatch: "swatch1",
  },
  {
    id: "po-2517",
    itemTitle: "New Balance 990v5 “Grey”",
    itemSpec: "Size 260 · suede/mesh",
    sellerName: "Taehyun O.",
    condition: "Visible Wear",
    priceWon: 96000,
    completedDateLabel: "Jul 27, 2026",
    swatch: "swatch2",
  },
  {
    id: "po-2488",
    itemTitle: "Supreme Box Logo Hoodie",
    itemSpec: "Size L · navy",
    sellerName: "Jiho S.",
    condition: "Light Wear",
    priceWon: 385000,
    completedDateLabel: "Jul 5, 2026",
    swatch: "swatch3",
  },
  {
    id: "po-2440",
    itemTitle: "Levi's 501 Original Jeans",
    itemSpec: "W32 L32 · indigo",
    sellerName: "Areum C.",
    condition: "Like New",
    priceWon: 58000,
    completedDateLabel: "Jun 14, 2026",
    swatch: "swatch1",
  },
  {
    id: "po-2391",
    itemTitle: "Burberry Vintage Check Scarf",
    itemSpec: "Wool · classic check",
    sellerName: "Soojin H.",
    condition: "Like New",
    priceWon: 145000,
    completedDateLabel: "May 30, 2026",
    swatch: "swatch2",
  },
  {
    id: "po-2333",
    itemTitle: "The North Face Nuptse 1996 Jacket",
    itemSpec: "Size M · black",
    sellerName: "Jungwoo K.",
    condition: "Visible Wear",
    priceWon: 227000,
    completedDateLabel: "May 2, 2026",
    swatch: "swatch3",
  },
  {
    id: "po-2260",
    itemTitle: "Ralph Lauren Custom Fit Polo",
    itemSpec: "Size L · navy",
    sellerName: "Eunji B.",
    condition: "Light Wear",
    priceWon: 44000,
    completedDateLabel: "Mar 21, 2026",
    swatch: "swatch1",
  },
  {
    id: "po-2198",
    itemTitle: "Common Projects Achilles Low",
    itemSpec: "Size 265 · white",
    sellerName: "Sena Y.",
    condition: "Like New",
    priceWon: 298000,
    completedDateLabel: "Feb 8, 2026",
    swatch: "swatch2",
  },
  {
    id: "po-2140",
    itemTitle: "Champion Reverse Weave Hoodie",
    itemSpec: "Size XL · grey",
    sellerName: "Hyunwoo R.",
    condition: "Visible Wear",
    priceWon: 39000,
    completedDateLabel: "Jan 15, 2026",
    swatch: "swatch3",
  },
];

export const TOTAL_SPENT_WON = PURCHASES.reduce((sum, p) => sum + p.priceWon, 0);
export const ITEM_COUNT = PURCHASES.length;
// PURCHASES is fixed and newest-first by construction, so the first/last entries' date
// labels are the latest/earliest of the set — read directly rather than re-derived.
export const LATEST_DATE_LABEL = PURCHASES[0].completedDateLabel;
export const EARLIEST_DATE_LABEL = PURCHASES[PURCHASES.length - 1].completedDateLabel;

// Thousands-separated KRW digit formatting, no symbol — callers place the currency mark
// in a sibling Text node so it never sits glued to a tabular-nums digit run.
export function formatKrwDigits(won: number): string {
  const sign = won < 0 ? "-" : "";
  const digits = Math.abs(won).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${sign}${digits}`;
}

// Builds the plain-text digest that the bottom band hands to the native Share sheet. Pure
// function of the fixed PURCHASES array — same input, same string, every time.
export function buildExportDigest(purchases: PurchaseRecord[]): string {
  const lines = purchases.map(
    (p) => `${p.completedDateLabel} — ${p.itemTitle} — KRW ${formatKrwDigits(p.priceWon)} — ${p.sellerName}`,
  );
  const header = `Repick purchase history — ${purchases.length} orders — KRW ${formatKrwDigits(
    purchases.reduce((sum, p) => sum + p.priceWon, 0),
  )} total`;
  return [header, "", ...lines].join("\n");
}
