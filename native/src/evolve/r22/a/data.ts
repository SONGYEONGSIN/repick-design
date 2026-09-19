// native/src/evolve/r22/a/data.ts — Return & Refund Request: deterministic dummy data
// No Math.random / Date.now / argumentless `new Date()` anywhere in this file.

export type ReturnLineItem = {
  id: string;
  title: string;
  variant: string; // e.g. size/color
  price: string; // formatted, KRW label to avoid ₩+digit crowding
  qty: number;
  thumbnailLabel: string; // 2-3 char monogram used in place of a real image
};

export type ReturnReasonId =
  | "not-as-described"
  | "wrong-item"
  | "damaged-defective"
  | "changed-mind"
  | "counterfeit-concern";

export type ReturnReason = {
  id: ReturnReasonId;
  label: string;
  hint: string; // one line shown under the label
};

// Order context (read-only, for the header proof block).
export const ORDER = {
  orderId: "RPK-20260904-7731",
  placedOn: "Sep 4, 2026",
  deliveredOn: "Sep 9, 2026",
  // Fixed "today" reference for the return-window computation below — never Date.now().
  todayLabel: "Sep 18, 2026",
  returnWindowDays: 14,
  daysElapsedSinceDelivery: 9, // Sep 9 -> Sep 18, fixed
};

export const RETURN_WINDOW_DAYS_LEFT = ORDER.returnWindowDays - ORDER.daysElapsedSinceDelivery; // 5

export const LINE_ITEMS: ReturnLineItem[] = [
  {
    id: "li1",
    title: "Vintage camera · Contax T2",
    variant: "Titan finish",
    price: "KRW 480,000",
    qty: 1,
    thumbnailLabel: "CT",
  },
  {
    id: "li2",
    title: "Leather jacket · Schott 618",
    variant: "Size 40 · Black",
    price: "KRW 210,000",
    qty: 1,
    thumbnailLabel: "SJ",
  },
  {
    id: "li3",
    title: "Mechanical watch · Seiko SARB",
    variant: "35mm · Steel",
    price: "KRW 175,000",
    qty: 1,
    thumbnailLabel: "SW",
  },
];

export const REASONS: ReturnReason[] = [
  {
    id: "not-as-described",
    label: "Not as described",
    hint: "Item differs from the listing photos or details",
  },
  {
    id: "wrong-item",
    label: "Wrong item sent",
    hint: "You received something other than what you ordered",
  },
  {
    id: "damaged-defective",
    label: "Damaged or defective",
    hint: "Item arrived broken, stained, or not working",
  },
  {
    id: "changed-mind",
    label: "Changed my mind",
    hint: "No issue with the item — you no longer want it",
  },
  {
    id: "counterfeit-concern",
    label: "Counterfeit concern",
    hint: "You suspect the item may not be authentic",
  },
];

// Simulated photo-attach affordance: tapping "Add photo" appends one placeholder up to this cap.
// No real camera/file picker — deterministic, local-only state.
export const MAX_PHOTOS_PER_ITEM = 3;

// Per-selected-item refund estimate is just price × qty; totals are derived, not stored.
export function estimateRefundFor(items: ReturnLineItem[], ids: string[]): number {
  return items
    .filter((it) => ids.includes(it.id))
    .reduce((sum, it) => sum + parsePriceToNumber(it.price) * it.qty, 0);
}

export function parsePriceToNumber(price: string): number {
  const digits = price.replace(/[^0-9]/g, "");
  return digits ? parseInt(digits, 10) : 0;
}

export function formatKRW(n: number): string {
  return `KRW ${n.toLocaleString("en-US")}`;
}
