// native/src/evolve/r28/b/data.ts
// Deterministic dummy data + pure domain helpers for the Tax Export Tagging
// screen. No Math.random / Date.now / bare `new Date()` anywhere here —
// every value below is a fixed literal, and every exported function is a
// pure transform of its arguments.

export type Direction = "sale" | "purchase";

export interface Transaction {
  id: string;
  /** Fixed ISO date string, never computed at runtime. */
  date: string;
  direction: Direction;
  counterparty: string;
  /** Always a positive magnitude in cents; sign is derived, not stored. */
  amountCents: number;
  /** Tax category tag the seller/buyer assigns before export. */
  tag: string | null;
  /** True once this row has been locked into a finalized export batch. */
  locked: boolean;
  exportBatchId: string | null;
}

// Each direction has its own, deliberately non-overlapping tag vocabulary —
// a sale is either taxable income or a non-taxable personal sale; a purchase
// is either a deductible business expense or a personal purchase. There is
// no tag that means the same thing for both directions, which is the real
// business rule the selection bar has to respect when a user selects a mix
// of sales and purchases at once.
export const TAGS_BY_DIRECTION: Record<Direction, readonly string[]> = {
  sale: ["Taxable Income", "Personal Sale"],
  purchase: ["Business Expense", "Personal Purchase"],
};

export const initialTransactions: Transaction[] = [
  {
    id: "t1",
    date: "2025-01-14",
    direction: "sale",
    counterparty: "J. Rivera",
    amountCents: 18500,
    tag: "Taxable Income",
    locked: true,
    exportBatchId: "EXP-001",
  },
  {
    id: "t2",
    date: "2025-01-22",
    direction: "purchase",
    counterparty: "Northside Supply Co.",
    amountCents: 9200,
    tag: "Business Expense",
    locked: true,
    exportBatchId: "EXP-001",
  },
  {
    id: "t3",
    date: "2025-02-03",
    direction: "sale",
    counterparty: "M. Chen",
    amountCents: 42000,
    tag: null,
    locked: false,
    exportBatchId: null,
  },
  {
    id: "t4",
    date: "2025-02-11",
    direction: "purchase",
    counterparty: "A. Patel",
    amountCents: 15000,
    tag: null,
    locked: false,
    exportBatchId: null,
  },
  {
    id: "t5",
    date: "2025-03-01",
    direction: "sale",
    counterparty: "K. Johnson",
    amountCents: 7600,
    tag: "Personal Sale",
    locked: false,
    exportBatchId: null,
  },
  {
    id: "t6",
    date: "2025-03-09",
    direction: "purchase",
    counterparty: "Vintage Parts LLC",
    amountCents: 22400,
    tag: null,
    locked: false,
    exportBatchId: null,
  },
  {
    id: "t7",
    date: "2025-04-02",
    direction: "sale",
    counterparty: "T. Nguyen",
    amountCents: 33000,
    tag: null,
    locked: false,
    exportBatchId: null,
  },
  {
    id: "t8",
    date: "2025-04-18",
    direction: "purchase",
    counterparty: "D. Oyelaran",
    amountCents: 6800,
    tag: "Personal Purchase",
    locked: false,
    exportBatchId: null,
  },
  {
    id: "t9",
    date: "2025-05-05",
    direction: "sale",
    counterparty: "R. Alvarez",
    amountCents: 51200,
    tag: null,
    locked: false,
    exportBatchId: null,
  },
  {
    id: "t10",
    date: "2025-05-20",
    direction: "purchase",
    counterparty: "Studio Craft Supply",
    amountCents: 12900,
    tag: null,
    locked: false,
    exportBatchId: null,
  },
  {
    id: "t11",
    date: "2025-06-02",
    direction: "sale",
    counterparty: "L. Brooks",
    amountCents: 9900,
    tag: null,
    locked: false,
    exportBatchId: null,
  },
  {
    id: "t12",
    date: "2025-06-14",
    direction: "purchase",
    counterparty: "W. Delgado",
    amountCents: 4300,
    tag: null,
    locked: false,
    exportBatchId: null,
  },
];

/** Formats a (possibly negative) cents value as a plain Latin-currency string, e.g. "$1,234.00" / "-$42.10". */
export function formatMoney(cents: number): string {
  const sign = cents < 0 ? "-" : "";
  const abs = Math.abs(cents);
  const dollars = Math.floor(abs / 100);
  const remainder = abs % 100;
  const groupedDollars = dollars.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${sign}$${groupedDollars}.${remainder.toString().padStart(2, "0")}`;
}

/** Sales count as positive income, purchases as negative — a real signed net, not a flat count. */
export function signedAmountCents(t: Pick<Transaction, "direction" | "amountCents">): number {
  return t.direction === "sale" ? t.amountCents : -t.amountCents;
}

export function directionLabel(direction: Direction): string {
  return direction === "sale" ? "Sale" : "Purchase";
}

/**
 * The tag options that are valid across EVERY direction present in a
 * selection. Because sale/purchase tag sets are disjoint by design, this is
 * only non-empty when the selection is direction-homogeneous — which is
 * exactly the business rule we want to surface (you can't bulk-apply one tax
 * category across a sale and a purchase at once).
 */
export function commonTagOptions(directions: Direction[]): string[] {
  if (directions.length === 0) return [];
  const uniqueDirections = Array.from(new Set(directions));
  let common: string[] = [...TAGS_BY_DIRECTION[uniqueDirections[0]]];
  for (const direction of uniqueDirections.slice(1)) {
    const allowed = new Set(TAGS_BY_DIRECTION[direction]);
    common = common.filter((tag) => allowed.has(tag));
  }
  return common;
}

function parseExportSeq(batchId: string | null): number {
  if (!batchId) return 0;
  const match = /^EXP-(\d+)$/.exec(batchId);
  return match ? parseInt(match[1], 10) : 0;
}

/** Deterministic next batch id: one past the highest EXP-### already present in the data. */
export function nextExportBatchId(rows: Transaction[]): string {
  const maxSeq = rows.reduce((max, r) => Math.max(max, parseExportSeq(r.exportBatchId)), 0);
  return `EXP-${(maxSeq + 1).toString().padStart(3, "0")}`;
}
