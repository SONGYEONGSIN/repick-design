/**
 * Payout statement — deterministic dummy data.
 * No Math.random / Date.now / new Date(). Fixed values only.
 */

export type LedgerKind = "gross" | "deduction" | "credit";

export type LedgerLine = {
  id: string;
  /** Short label shown in the running ledger. */
  label: string;
  /** One sentence explaining why this line exists at all. */
  why: string;
  /** Signed minor-unit-free KRW amount. Negative = taken out of the sale. */
  amount: number;
  kind: LedgerKind;
  /** Which sale(s) produced this line. */
  source: string;
  /** Rate/basis text, e.g. "5.5% of 1,340,000". */
  basis: string;
  /** Set when the seller can still act on the line. */
  disputable: boolean;
};

export type PayoutCycle = {
  cycleId: string;
  periodLabel: string;
  payoutDate: string;
  bankLabel: string;
  bankTail: string;
  /** True when the quarterly form is signed and the transfer is locked in. */
  releaseReady: boolean;
  blockerSentence: string;
};

export const cycle: PayoutCycle = {
  cycleId: "PC-2024-19",
  periodLabel: "Sep 16 – Sep 30",
  payoutDate: "Oct 4",
  bankLabel: "Kookmin Bank",
  bankTail: "4471",
  releaseReady: false,
  blockerSentence:
    "Payout is on hold: the tax residency form for this quarter is unsigned.",
};

export const grossTotal = 1986000;

/**
 * The ledger reads top to bottom as an argument:
 * gross → every hand that took a cut → what lands in the bank.
 */
export const ledger: LedgerLine[] = [
  {
    id: "l0",
    label: "Sale proceeds",
    why: "Three items settled inside this cycle and cleared the buyer hold.",
    amount: 1986000,
    kind: "gross",
    source: "3 sales",
    basis: "1,340,000 + 384,000 + 262,000",
    disputable: false,
  },
  {
    id: "l1",
    label: "Marketplace fee",
    why: "Charged per sale on the final price, not on the listed price.",
    amount: -109230,
    kind: "deduction",
    source: "3 sales",
    basis: "5.5% of 1,986,000",
    disputable: false,
  },
  {
    id: "l2",
    label: "Payment processing",
    why: "Card network cost, passed through at what the processor billed.",
    amount: -34755,
    kind: "deduction",
    source: "3 sales",
    basis: "1.75% of 1,986,000",
    disputable: false,
  },
  {
    id: "l3",
    label: "Shipping labels",
    why: "You printed two prepaid labels; the buyer paid neither.",
    amount: -28400,
    kind: "deduction",
    source: "Leica M6, Aeron Chair",
    basis: "12,900 + 15,500",
    disputable: true,
  },
  {
    id: "l4",
    label: "Promotion share",
    why: "The Autumn 10% coupon was split — the buyer's discount came half from you.",
    amount: -38400,
    kind: "deduction",
    source: "Aeron Chair",
    basis: "50% of the 76,800 coupon",
    disputable: true,
  },
  {
    id: "l5",
    label: "Return shipping",
    why: "A returned turntable was re-shipped at your cost after inspection.",
    amount: -19600,
    kind: "deduction",
    source: "Rega Planar 3",
    basis: "One return leg",
    disputable: true,
  },
  {
    id: "l6",
    label: "Seller protection credit",
    why: "The Sep 12 damage claim resolved in your favour and is repaid here.",
    amount: 42000,
    kind: "credit",
    source: "Claim CL-8823",
    basis: "Approved on Sep 27",
    disputable: false,
  },
];

export const netTotal = 1797615;

/** Sum of every negative line — the number the seller actually wants named. */
export const withheldTotal = 230385;

/** Sum of positive adjustments that are not sale proceeds. */
export const creditTotal = 42000;

export type Attribution = {
  saleId: string;
  saleTitle: string;
  settledOn: string;
  buyer: string;
  soldFor: number;
  taken: number;
  kept: number;
  /** Percent of that sale's price that survived to payout, 0–100 integer. */
  keptPercent: number;
  lines: { label: string; amount: number }[];
};

/**
 * Same ledger, re-cut per sale. Same totals, different question:
 * "which item cost me the most to sell?"
 */
export const attributions: Attribution[] = [
  {
    saleId: "s1",
    saleTitle: "Leica M6 body, 1996",
    settledOn: "Settled Sep 18",
    buyer: "hwan.j",
    soldFor: 1340000,
    taken: 110050,
    kept: 1229950,
    keptPercent: 92,
    lines: [
      { label: "Marketplace fee", amount: -73700 },
      { label: "Payment processing", amount: -23450 },
      { label: "Shipping label", amount: -12900 },
    ],
  },
  {
    saleId: "s2",
    saleTitle: "Aeron Chair, size B",
    settledOn: "Settled Sep 24",
    buyer: "minseo.p",
    soldFor: 384000,
    taken: 81740,
    kept: 302260,
    keptPercent: 79,
    lines: [
      { label: "Marketplace fee", amount: -21120 },
      { label: "Payment processing", amount: -6720 },
      { label: "Shipping label", amount: -15500 },
      { label: "Promotion share", amount: -38400 },
    ],
  },
  {
    saleId: "s3",
    saleTitle: "Rega Planar 3 turntable",
    settledOn: "Settled Sep 29",
    buyer: "dohee.k",
    soldFor: 262000,
    taken: 38595,
    kept: 223405,
    keptPercent: 85,
    lines: [
      { label: "Marketplace fee", amount: -14410 },
      { label: "Payment processing", amount: -4585 },
      { label: "Return shipping", amount: -19600 },
    ],
  },
];

/** Sum of `kept` across items — the credit is not attributable to one sale. */
export const keptAcrossItems = 1755615;

export type CycleBar = {
  id: string;
  label: string;
  net: number;
  /** Withheld share of gross, 0–100 integer. */
  withheldPercent: number;
  isCurrent: boolean;
};

/** Four cycles so "is this one worse than usual?" is answerable in place. */
export const history: CycleBar[] = [
  { id: "h1", label: "Aug 1–15", net: 640200, withheldPercent: 8, isCurrent: false },
  { id: "h2", label: "Aug 16–31", net: 812400, withheldPercent: 9, isCurrent: false },
  { id: "h3", label: "Sep 1–15", net: 1104900, withheldPercent: 10, isCurrent: false },
  { id: "h4", label: "Sep 16–30", net: 1797615, withheldPercent: 12, isCurrent: true },
];

export type LensId = "ledger" | "attribution";

export const lenses: { id: LensId; label: string; question: string }[] = [
  { id: "ledger", label: "By line", question: "What was taken, and by whom?" },
  {
    id: "attribution",
    label: "By item",
    question: "Which sale cost the most to make?",
  },
];

/** Formats a signed KRW amount. Sign is carried by an explicit minus glyph. */
export function formatWon(amount: number): string {
  const negative = amount < 0;
  const digits = Math.abs(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${negative ? "-" : ""}₩${digits}`;
}
