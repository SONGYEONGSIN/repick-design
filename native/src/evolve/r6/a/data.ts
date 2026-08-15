// native/src/evolve/r6/a/data.ts — auto-native-r6 candidate a (Payouts)
// Deterministic dummy data only — no Math.random / Date.now / argument-less new Date() anywhere.
// Every date is a fixed literal label; `daysAgo` is a fixed literal used to bucket transactions
// into period filters (never derived from the real clock).

export type TxnType = "sale" | "payout" | "fee";
export type TxnStatus = "completed" | "pending" | "processing";

export interface PayoutTxn {
  id: string;
  type: TxnType;
  title: string;
  /** Longer explanation revealed when the seller taps the row. */
  detail: string;
  /** Won amount — positive = credited to balance, negative = debited (payout sent out, fee). */
  amountWon: number;
  status: TxnStatus;
  dateLabel: string;
  /** Fixed literal "days before today" used only to bucket into period filters. */
  daysAgo: number;
}

export const PAYOUT_METHOD = {
  bankName: "KB Kookmin Bank",
  accountMasked: "•••• 1234",
  accountHolder: "Minji Park",
  arrival: "Payouts arrive in 1–2 business days.",
};

// Ledger, newest first. Sales credit the balance (available once the buyer confirms receipt —
// "pending" = still in escrow); payouts and fees debit it. 10 rows, well over the ≥8 minimum.
export const TRANSACTIONS: PayoutTxn[] = [
  {
    id: "t1",
    type: "sale",
    title: "Leopold FC750R keyboard",
    detail:
      "Sold to Jordan Lee. Funds are held in escrow until the buyer confirms the item arrived as described.",
    amountWon: 168000,
    status: "pending",
    dateLabel: "Fri, Aug 14",
    daysAgo: 1,
  },
  {
    id: "t2",
    type: "payout",
    title: `Payout to ${PAYOUT_METHOD.bankName} ${PAYOUT_METHOD.accountMasked}`,
    detail: "Sent to your linked bank account.",
    amountWon: -450000,
    status: "completed",
    dateLabel: "Wed, Aug 12",
    daysAgo: 3,
  },
  {
    id: "t3",
    type: "sale",
    title: "iPad Air 5th gen, 64GB",
    detail: "Sold to Haeun K. Buyer confirmed receipt — funds released to your balance.",
    amountWon: 520000,
    status: "completed",
    dateLabel: "Mon, Aug 10",
    daysAgo: 5,
  },
  {
    id: "t4",
    type: "sale",
    title: "Nike Air Force 1 '07",
    detail: "Sold to Daniel O. Buyer confirmed receipt — funds released to your balance.",
    amountWon: 89000,
    status: "completed",
    dateLabel: "Thu, Aug 6",
    daysAgo: 9,
  },
  {
    id: "t5",
    type: "payout",
    title: `Payout to ${PAYOUT_METHOD.bankName} ${PAYOUT_METHOD.accountMasked}`,
    detail: "Sent to your linked bank account.",
    amountWon: -300000,
    status: "completed",
    dateLabel: "Mon, Aug 3",
    daysAgo: 12,
  },
  {
    id: "t6",
    type: "sale",
    title: "Canon EOS M50 + kit lens",
    detail: "Sold to Grace W. Buyer confirmed receipt — funds released to your balance.",
    amountWon: 410000,
    status: "completed",
    dateLabel: "Wed, Jul 29",
    daysAgo: 17,
  },
  {
    id: "t7",
    type: "fee",
    title: "Service fee adjustment",
    detail: "Correction for order RP-55190 shipping refund.",
    amountWon: -12000,
    status: "completed",
    dateLabel: "Wed, Jul 22",
    daysAgo: 24,
  },
  {
    id: "t8",
    type: "sale",
    title: "Uniqlo fleece jacket",
    detail: "Sold to Seojun B. Buyer confirmed receipt — funds released to your balance.",
    amountWon: 38000,
    status: "completed",
    dateLabel: "Wed, Jul 15",
    daysAgo: 31,
  },
  {
    id: "t9",
    type: "payout",
    title: `Payout to ${PAYOUT_METHOD.bankName} ${PAYOUT_METHOD.accountMasked}`,
    detail: "Sent to your linked bank account.",
    amountWon: -250000,
    status: "completed",
    dateLabel: "Wed, Jul 8",
    daysAgo: 38,
  },
  {
    id: "t10",
    type: "sale",
    title: "MacBook Pro 96W charger",
    detail: "Sold to Yuna C. Buyer confirmed receipt — funds released to your balance.",
    amountWon: 45000,
    status: "completed",
    dateLabel: "Tue, Jun 30",
    daysAgo: 46,
  },
];

/** Pure sum over the fixed ledger — the balances below are derived, never hand-duplicated. */
export function sumByStatus(txns: PayoutTxn[], status: TxnStatus): number {
  return txns.filter((t) => t.status === status).reduce((sum, t) => sum + t.amountWon, 0);
}

// Available balance = every *completed* row netted together (520000+89000+410000+38000+45000
// sales, minus 450000+300000+250000 payouts, minus 12000 fee) = ₩90,000, withdrawable now.
export const AVAILABLE_BALANCE_WON = sumByStatus(TRANSACTIONS, "completed");
// Pending balance = the one sale still in escrow (₩168,000) — not yet withdrawable.
export const PENDING_BALANCE_WON = sumByStatus(TRANSACTIONS, "pending");

export type Period = "week" | "month" | "all";

export const PERIODS: Period[] = ["week", "month", "all"];
export const PERIOD_LABELS: Record<Period, string> = {
  week: "This week",
  month: "This month",
  all: "All time",
};
const PERIOD_MAX_DAYS: Record<Period, number> = {
  week: 7,
  month: 30,
  all: Infinity,
};

export function filterByPeriod(txns: PayoutTxn[], period: Period): PayoutTxn[] {
  const maxDays = PERIOD_MAX_DAYS[period];
  return txns.filter((t) => t.daysAgo <= maxDays);
}

export const STATUS_TEXT: Record<TxnStatus, string> = {
  completed: "Completed",
  pending: "In escrow",
  processing: "Processing",
};

// Thousands-separated KRW digit formatting, no symbol — callers place the ₩ sign in its own
// sibling <Text> (never the same node as a tabular-nums numeral string; see PayoutsScreen).
export function formatWon(won: number): string {
  const sign = won < 0 ? "-" : "";
  const digits = Math.abs(won).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${sign}${digits}`;
}

export const LAST_UPDATED_INITIAL = "Last updated 9:02 AM";
export const LAST_UPDATED_REFRESHED = "Last updated 9:14 AM";

export const REQUESTED_PAYOUT_TXN_ID = "t0-requested";

/** Builds the in-flight payout row inserted after "Request payout" is pressed — pure function of
 * a fixed amount, not the clock; the "Today" label is a fixed literal like every other date here. */
export function buildRequestedPayoutTxn(amountWon: number): PayoutTxn {
  return {
    id: REQUESTED_PAYOUT_TXN_ID,
    type: "payout",
    title: `Payout to ${PAYOUT_METHOD.bankName} ${PAYOUT_METHOD.accountMasked}`,
    detail: "Requested just now. Sent to your linked bank account.",
    amountWon: -amountWon,
    status: "processing",
    dateLabel: "Today",
    daysAgo: 0,
  };
}
