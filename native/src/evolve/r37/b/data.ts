// native/src/evolve/r37/b/data.ts
//
// Deterministic data for the Seller Fee & Commission Statement screen.
// No Math.random, no Date.now, no argument-less `new Date()` — every sale
// record below is a fixed literal, and every derived number (per-sale net
// payout, period totals) is computed from those fixed component values
// rather than hand-typed, so the math can never silently drift out of sync
// with its inputs.

export type PeriodKey = "week" | "month" | "quarter";

export interface PeriodOption {
  key: PeriodKey;
  label: string;
}

export const periodOptions: PeriodOption[] = [
  { key: "week", label: "This Week" },
  { key: "month", label: "This Month" },
  { key: "quarter", label: "This Quarter" },
];

export interface FeeSaleRecord {
  id: string;
  itemTitle: string;
  orderId: string;
  saleDateLabel: string;
  /** Final sale price paid by the buyer, before any deductions. */
  grossSaleAmount: number;
  /** Marketplace commission, as a percent of grossSaleAmount. */
  commissionRatePercent: number;
  /** Payment-processor fee, percent component. */
  processingFeeRatePercent: number;
  /** Payment-processor fee, flat component (added to the percent cut). */
  processingFeeFixedAmount: number;
  /** A seller promo/boost credit applied against this sale's deductions, if any. 0 = none. */
  promoCreditAmount: number;
}

export interface FeeBreakdown {
  grossSaleAmount: number;
  commissionAmount: number;
  processingFeeAmount: number;
  promoCreditAmount: number;
  netPayoutAmount: number;
}

function roundToWon(value: number): number {
  return Math.round(value);
}

/** Derives the full fee breakdown — including net payout — from a sale's fixed inputs. */
export function computeFeeBreakdown(record: FeeSaleRecord): FeeBreakdown {
  const commissionAmount = roundToWon(
    record.grossSaleAmount * (record.commissionRatePercent / 100)
  );
  const processingFeeAmount = roundToWon(
    record.grossSaleAmount * (record.processingFeeRatePercent / 100) +
      record.processingFeeFixedAmount
  );
  const netPayoutAmount =
    record.grossSaleAmount -
    commissionAmount -
    processingFeeAmount +
    record.promoCreditAmount;
  return {
    grossSaleAmount: record.grossSaleAmount,
    commissionAmount,
    processingFeeAmount,
    promoCreditAmount: record.promoCreditAmount,
    netPayoutAmount,
  };
}

export function sumNetPayout(records: FeeSaleRecord[]): number {
  return records.reduce(
    (total, record) => total + computeFeeBreakdown(record).netPayoutAmount,
    0
  );
}

export function sumGross(records: FeeSaleRecord[]): number {
  return records.reduce((total, record) => total + record.grossSaleAmount, 0);
}

// Individual sale records, newest first within each period. Each period is
// its own fixed literal list (not derived by date-filtering a master list),
// per the brief's determinism rule — "This Month" and "This Quarter" simply
// include more of the same fixed records than "This Week" does.

const saleDenimJacket: FeeSaleRecord = {
  id: "sale-rp52108",
  itemTitle: "Nike Air Max 90",
  orderId: "RP-52108",
  saleDateLabel: "Oct 13, 2026",
  grossSaleAmount: 95000,
  commissionRatePercent: 12,
  processingFeeRatePercent: 2.6,
  processingFeeFixedAmount: 300,
  promoCreditAmount: 0,
};

const saleCrossbodyBag: FeeSaleRecord = {
  id: "sale-rp52104",
  itemTitle: "Leather Crossbody Bag",
  orderId: "RP-52104",
  saleDateLabel: "Oct 12, 2026",
  grossSaleAmount: 62000,
  commissionRatePercent: 14,
  processingFeeRatePercent: 2.9,
  processingFeeFixedAmount: 300,
  promoCreditAmount: 4000,
};

const saleVintageJacket: FeeSaleRecord = {
  id: "sale-rp52101",
  itemTitle: "Vintage Denim Jacket",
  orderId: "RP-52101",
  saleDateLabel: "Oct 11, 2026",
  grossSaleAmount: 48000,
  commissionRatePercent: 14,
  processingFeeRatePercent: 2.9,
  processingFeeFixedAmount: 300,
  promoCreditAmount: 0,
};

const saleAnkleBoots: FeeSaleRecord = {
  id: "sale-rp52044",
  itemTitle: "Suede Ankle Boots",
  orderId: "RP-52044",
  saleDateLabel: "Oct 8, 2026",
  grossSaleAmount: 57000,
  commissionRatePercent: 14,
  processingFeeRatePercent: 2.9,
  processingFeeFixedAmount: 300,
  promoCreditAmount: 0,
};

const saleMidiDress: FeeSaleRecord = {
  id: "sale-rp52011",
  itemTitle: "Floral Midi Dress",
  orderId: "RP-52011",
  saleDateLabel: "Oct 5, 2026",
  grossSaleAmount: 41000,
  commissionRatePercent: 14,
  processingFeeRatePercent: 2.9,
  processingFeeFixedAmount: 300,
  promoCreditAmount: 2500,
};

const salePeacoat: FeeSaleRecord = {
  id: "sale-rp51987",
  itemTitle: "Wool Peacoat",
  orderId: "RP-51987",
  saleDateLabel: "Oct 3, 2026",
  grossSaleAmount: 138000,
  commissionRatePercent: 12,
  processingFeeRatePercent: 2.6,
  processingFeeFixedAmount: 300,
  promoCreditAmount: 0,
};

const saleTeeBundle: FeeSaleRecord = {
  id: "sale-rp51203",
  itemTitle: "Graphic Tee Bundle",
  orderId: "RP-51203",
  saleDateLabel: "Sep 28, 2026",
  grossSaleAmount: 26000,
  commissionRatePercent: 14,
  processingFeeRatePercent: 2.9,
  processingFeeFixedAmount: 300,
  promoCreditAmount: 0,
};

const saleToteBag: FeeSaleRecord = {
  id: "sale-rp50915",
  itemTitle: "Canvas Tote Bag",
  orderId: "RP-50915",
  saleDateLabel: "Sep 14, 2026",
  grossSaleAmount: 33000,
  commissionRatePercent: 14,
  processingFeeRatePercent: 2.9,
  processingFeeFixedAmount: 300,
  promoCreditAmount: 1500,
};

const saleVaseSet: FeeSaleRecord = {
  id: "sale-rp50872",
  itemTitle: "Ceramic Vase Set",
  orderId: "RP-50872",
  saleDateLabel: "Sep 2, 2026",
  grossSaleAmount: 29000,
  commissionRatePercent: 14,
  processingFeeRatePercent: 2.9,
  processingFeeFixedAmount: 300,
  promoCreditAmount: 0,
};

export const salesByPeriod: Record<PeriodKey, FeeSaleRecord[]> = {
  week: [saleDenimJacket, saleCrossbodyBag, saleVintageJacket],
  month: [
    saleDenimJacket,
    saleCrossbodyBag,
    saleVintageJacket,
    saleAnkleBoots,
    saleMidiDress,
    salePeacoat,
  ],
  quarter: [
    saleDenimJacket,
    saleCrossbodyBag,
    saleVintageJacket,
    saleAnkleBoots,
    saleMidiDress,
    salePeacoat,
    saleTeeBundle,
    saleToteBag,
    saleVaseSet,
  ],
};

/** "KRW 182,400" style formatting — Latin-letter currency notation (see brief gaps). */
export function formatKRW(amount: number): string {
  const sign = amount < 0 ? "-" : "";
  const roundedAbs = Math.abs(Math.round(amount));
  const withCommas = String(roundedAbs).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${sign}KRW ${withCommas}`;
}
