// native/src/evolve/r14/c/data.ts — deterministic dummy data for Wallet & Transaction History.
// No Math.random / Date.now / argument-less `new Date()` anywhere below — every value here is a
// fixed literal or a pure computation over fixed literals.

export type TransactionType = "sale" | "payout" | "refund" | "fee";

export type Transaction = {
  id: string;
  type: TransactionType;
  /** Signed KRW amount — positive = money in, negative = money out. */
  amountWon: number;
  /** Fixed display date string (not computed from a live clock). */
  date: string;
  /** Counterparty or short description shown as the row's title. */
  title: string;
  /** Secondary line — item, order id, or reason. */
  detail: string;
};

export const CURRENT_BALANCE_WON = 342000;
export const BALANCE_AS_OF = "Aug 26, 2026";

export const TYPE_META: Record<
  TransactionType,
  { label: string; monogram: string }
> = {
  sale: { label: "Sale", monogram: "S" },
  payout: { label: "Payout", monogram: "P" },
  refund: { label: "Refund", monogram: "R" },
  fee: { label: "Fee", monogram: "F" },
};

export type FilterKey = TransactionType | "all";

export const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "sale", label: "Sales" },
  { key: "payout", label: "Payouts" },
  { key: "refund", label: "Refunds" },
  { key: "fee", label: "Fees" },
];

// Newest first — mirrors how a real ledger page would arrive from the server.
export const TRANSACTIONS: Transaction[] = [
  {
    id: "txn-10432-sale",
    type: "sale",
    amountWon: 128000,
    date: "Aug 24, 2026",
    title: "Sold to minji_92",
    detail: "Nike Air Force 1 '07 — Size 260 · Order #S-10432",
  },
  {
    id: "txn-10432-fee",
    type: "fee",
    amountWon: -6400,
    date: "Aug 24, 2026",
    title: "Marketplace fee",
    detail: "5% seller fee on order #S-10432",
  },
  {
    id: "txn-payout-0822",
    type: "payout",
    amountWon: -300000,
    date: "Aug 22, 2026",
    title: "Withdrawal to KB Kookmin Bank",
    detail: "Account ····1234 · Payout PYT-20260822-4417",
  },
  {
    id: "txn-refund-0820",
    type: "refund",
    amountWon: -45000,
    date: "Aug 20, 2026",
    title: "Refunded to seo_yeon",
    detail: "Item not as described · Order #S-10390",
  },
  {
    id: "txn-10401-sale",
    type: "sale",
    amountWon: 89000,
    date: "Aug 18, 2026",
    title: "Sold to hyunwoo.k",
    detail: "Uniqlo U Crewneck — Size L · Order #S-10401",
  },
  {
    id: "txn-10401-fee",
    type: "fee",
    amountWon: -4450,
    date: "Aug 18, 2026",
    title: "Marketplace fee",
    detail: "5% seller fee on order #S-10401",
  },
  {
    id: "txn-10388-sale",
    type: "sale",
    amountWon: 215000,
    date: "Aug 15, 2026",
    title: "Sold to daniel_park",
    detail: "Patagonia Retro-X Fleece — Size M · Order #S-10388",
  },
  {
    id: "txn-refund-0812",
    type: "refund",
    amountWon: -18000,
    date: "Aug 12, 2026",
    title: "Partial refund to jiwoo_c",
    detail: "Late shipment goodwill credit · Order #S-10350",
  },
  {
    id: "txn-payout-0810",
    type: "payout",
    amountWon: -150000,
    date: "Aug 10, 2026",
    title: "Withdrawal to KB Kookmin Bank",
    detail: "Account ····1234 · Payout PYT-20260810-2209",
  },
  {
    id: "txn-10322-sale",
    type: "sale",
    amountWon: 67000,
    date: "Aug 8, 2026",
    title: "Sold to areum_lee",
    detail: "Carhartt WIP Beanie — Size OS · Order #S-10322",
  },
];

// ─── ₩ formatting — resolved 2026-08-24 (native/GENERATION.md §1) ───
// Choice ①: a visible gap between the ₩ glyph and the digits (space, not a
// separate Text node — GENERATION.md confirmed the stroke/tabular-nums theory
// was never the cause, so a plain space is enough). Matches the convention
// already established in native/src/payout/data.ts — same currency, same repo,
// no reason to relitigate a resolved provision on the one screen where the
// amount column is the entire point of the page.
export function formatWon(amount: number): string {
  const digits = Math.round(amount).toString();
  const withCommas = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `₩ ${withCommas}`;
}

// Sign is prefixed to the ₩ glyph, not to the digits, so it never touches the
// digit run the space above already protects. "+"/"−" is the required verbal
// pairing (never color alone) for money in vs. money out.
export function formatSignedWon(amount: number): string {
  const sign = amount >= 0 ? "+" : "−"; // U+2212 minus sign, distinct from a hyphen
  return `${sign}${formatWon(Math.abs(amount))}`;
}
