// native/src/evolve/r23/a/data.ts
// Deterministic dummy data for the Buyer Protection Coverage screen.
// No Math.random / Date.now / argument-less `new Date()` anywhere — every date
// below is a fixed ISO literal, and "today" is a fixed literal too (matches the
// generation date of this round, but is NOT read from the system clock).

export const TODAY_ISO = "2026-09-21";

export type ClaimStatus = "Approved" | "Submitted" | "Denied";

export type ClaimRecord = {
  id: string;
  dateFiled: string; // ISO
  issue: string;
  status: ClaimStatus;
  payoutKrw: number | null; // null while a claim is still pending review
};

export type CoveredItemRef = {
  name: string;
  brand: string;
  orderId: string;
  purchaseDateIso: string;
  purchasePriceKrw: number;
};

export type CoveragePlan = {
  planName: string;
  tierLabel: string;
  coverageStartIso: string;
  coverageEndIso: string;
  maxClaimValueKrw: number;
  deductibleKrw: number;
  maxClaims: number;
};

export const item: CoveredItemRef = {
  name: "Sony WH-1000XM5 Wireless Headphones",
  brand: "Sony",
  orderId: "ORD-88213",
  purchaseDateIso: "2025-10-15",
  purchasePriceKrw: 389000,
};

export const plan: CoveragePlan = {
  planName: "Extended Protection Plan",
  tierLabel: "12-Month Coverage",
  coverageStartIso: "2025-10-15",
  coverageEndIso: "2026-10-15",
  maxClaimValueKrw: 194500,
  deductibleKrw: 15000,
  maxClaims: 2,
};

export const coveredItems: string[] = [
  "Mechanical or electrical failure after the manufacturer warranty ends",
  "Battery no longer holding a usable charge",
  "Failure of buttons, hinges, or charging port under normal use",
  "One accidental drop or liquid-exposure incident",
];

export const notCoveredItems: string[] = [
  "Cosmetic wear (scuffs, scratches) that doesn't affect function",
  "Loss or theft of the item",
  "Damage from unauthorized repair or modification",
];

// One claim already on record for this plan — approved and paid out.
export const initialClaims: ClaimRecord[] = [
  {
    id: "CLM-1042",
    dateFiled: "2026-03-02",
    issue: "Right ear cup speaker driver rattle",
    status: "Approved",
    payoutKrw: 45000,
  },
];

// Pure helper — no clock reads, both inputs are fixed ISO literals passed in.
export function daysBetweenIso(fromIso: string, toIso: string): number {
  const MS_PER_DAY = 1000 * 60 * 60 * 24;
  const from = new Date(fromIso).getTime();
  const to = new Date(toIso).getTime();
  return Math.round((to - from) / MS_PER_DAY);
}

export function formatKrw(amount: number): string {
  return `KRW ${amount.toLocaleString("en-US")}`;
}

export function formatDateIso(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}
