// native/src/evolve/r29/a/data.ts — auto-native-r29 candidate a.
//
// Fixture + pure math for the Loyalty Points Statement screen. Every date is
// a fixed ISO literal (no `new Date()`, no `Date.now()`), and every number
// here is hand-entered once and then only ever *derived from* by the
// functions below — the screen never hand-types a second copy of a total.
//
// The core integrity rule for this screen: the hero balance and the
// itemized rows must come from one fold over one array. `computeStatementLedger`
// is that fold — it walks STATEMENT_TRANSACTIONS once and stamps a running
// balance onto each entry. `computeCurrentBalance` does not keep its own
// tally; it simply reads the running balance off the last ledger entry (or
// the opening balance if the statement is empty), so the hero figure and the
// per-row balances are provably the same computation, not two numbers a
// designer typed separately and hoped would agree.

export type LoyaltyTransactionType =
  | "earned-from-sale"
  | "redeemed-for-store-credit"
  | "expired"
  | "referral-bonus";

export interface LoyaltyTransaction {
  id: string;
  dateIso: string;
  dateLabel: string;
  type: LoyaltyTransactionType;
  description: string;
  /** Signed points change this entry applies (positive = earned, negative = spent/lost). */
  pointsDelta: number;
}

export interface LoyaltyLedgerEntry {
  transaction: LoyaltyTransaction;
  /** Balance immediately after this entry is applied, in the statement's running order. */
  runningBalance: number;
}

export interface LoyaltyStatementPeriod {
  startLabel: string;
  endLabel: string;
  generatedLabel: string;
  memberTierLabel: string;
  openingBalance: number;
  /** Integer points → KRW conversion rate used for the "store credit value" caption. */
  krwPerPoint: number;
}

export const STATEMENT_PERIOD: LoyaltyStatementPeriod = {
  startLabel: "Sep 1, 2026",
  endLabel: "Sep 30, 2026",
  generatedLabel: "Oct 1, 2026",
  memberTierLabel: "Gold Reseller",
  openingBalance: 1200,
  krwPerPoint: 10,
};

export const STATEMENT_TRANSACTIONS: LoyaltyTransaction[] = [
  {
    id: "txn-1",
    dateIso: "2026-09-03",
    dateLabel: "Sep 3",
    type: "earned-from-sale",
    description: 'Sold "Vintage Denim Jacket"',
    pointsDelta: 85,
  },
  {
    id: "txn-2",
    dateIso: "2026-09-07",
    dateLabel: "Sep 7",
    type: "redeemed-for-store-credit",
    description: "Redeemed for store credit",
    pointsDelta: -500,
  },
  {
    id: "txn-3",
    dateIso: "2026-09-12",
    dateLabel: "Sep 12",
    type: "referral-bonus",
    description: "Referral bonus: friend's first sale shipped",
    pointsDelta: 300,
  },
  {
    id: "txn-4",
    dateIso: "2026-09-18",
    dateLabel: "Sep 18",
    type: "earned-from-sale",
    description: 'Sold "Leather Crossbody Bag"',
    pointsDelta: 64,
  },
  {
    id: "txn-5",
    dateIso: "2026-09-21",
    dateLabel: "Sep 21",
    type: "expired",
    description: "Points expired from Mar 2025 earn batch",
    pointsDelta: -120,
  },
  {
    id: "txn-6",
    dateIso: "2026-09-25",
    dateLabel: "Sep 25",
    type: "earned-from-sale",
    description: 'Sold "Wool Overcoat"',
    pointsDelta: 42,
  },
  {
    id: "txn-7",
    dateIso: "2026-09-29",
    dateLabel: "Sep 29",
    type: "redeemed-for-store-credit",
    description: "Redeemed for store credit",
    pointsDelta: -250,
  },
];

export const REDEMPTION_RULES: string[] = [
  "Points earned from a completed sale post 3 business days after delivery is confirmed.",
  "1 point is worth 10 KRW in store credit, redeemable in increments of 100 points.",
  "Points expire 18 months after the end of the month they were earned in.",
  "A referral bonus posts once your referral's first sale ships, not when they sign up.",
  "Expired or already-redeemed points cannot be reinstated or reversed.",
];

/**
 * One fold, walked once: applies every transaction in order to the opening
 * balance and stamps the running balance onto each entry as it goes. This is
 * the single source of truth both the itemized rows and the hero figure read
 * from — nothing downstream re-derives the total independently.
 */
export function computeStatementLedger(
  transactions: LoyaltyTransaction[],
  openingBalance: number,
): LoyaltyLedgerEntry[] {
  const ledger: LoyaltyLedgerEntry[] = [];
  let runningBalance = openingBalance;
  for (const transaction of transactions) {
    runningBalance += transaction.pointsDelta;
    ledger.push({ transaction, runningBalance });
  }
  return ledger;
}

/**
 * The current balance is never a second hand-typed number — it is read off
 * the last row of the same ledger fold that renders the itemized list.
 */
export function computeCurrentBalance(
  transactions: LoyaltyTransaction[],
  openingBalance: number,
): number {
  const ledger = computeStatementLedger(transactions, openingBalance);
  if (ledger.length === 0) return openingBalance;
  return ledger[ledger.length - 1].runningBalance;
}

/** Manual thousands-separator formatter — avoids relying on Hermes Intl/locale support. */
export function formatWithCommas(value: number): string {
  const negative = value < 0;
  const digits = Math.abs(Math.round(value)).toString();
  let grouped = "";
  for (let i = 0; i < digits.length; i += 1) {
    const posFromEnd = digits.length - i;
    grouped += digits[i];
    if (posFromEnd > 1 && posFromEnd % 3 === 1) grouped += ",";
  }
  return negative ? `-${grouped}` : grouped;
}

export function formatPoints(value: number): string {
  return `${formatWithCommas(value)} pts`;
}

export function formatSignedPoints(value: number): string {
  const sign = value > 0 ? "+" : value < 0 ? "-" : "";
  return `${sign}${formatWithCommas(Math.abs(value))} pts`;
}

export function pointsToKrw(points: number, krwPerPoint: number): number {
  return points * krwPerPoint;
}
