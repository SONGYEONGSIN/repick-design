// native/src/evolve/r47/b/data.ts
//
// Deterministic dummy data for the Store Credit Top-Up screen (see
// StoreCreditTopUpScreen.tsx for the screen itself). Every value here is a
// fixed literal or a pure function of fixed literals — no Math.random,
// Date.now, or argument-less new Date.

export type CreditPackageId = "credit-10" | "credit-25" | "credit-50" | "credit-100";

export interface CreditPackage {
  id: CreditPackageId;
  /** What the buyer pays today, in cents. */
  priceCents: number;
  /** Store credit the buyer receives for that payment, in cents. At the two
   * larger tiers this is more than priceCents — a fixed bonus for
   * prepaying, same mechanic as a gift-card top-up bonus. */
  creditCents: number;
}

export const CREDIT_PACKAGES: CreditPackage[] = [
  { id: "credit-10", priceCents: 1_000, creditCents: 1_000 },
  { id: "credit-25", priceCents: 2_500, creditCents: 2_700 },
  { id: "credit-50", priceCents: 5_000, creditCents: 5_600 },
  { id: "credit-100", priceCents: 10_000, creditCents: 11_500 },
];

/** The buyer's existing store credit balance before this top-up, in cents.
 * Shown on the confirm step only as context for the resulting new balance —
 * this screen is not a ledger or transaction history. */
export const CURRENT_BALANCE_CENTS = 450;

export function findCreditPackage(id: CreditPackageId | null): CreditPackage | null {
  if (id === null) return null;
  return CREDIT_PACKAGES.find((pkg) => pkg.id === id) ?? null;
}

export function bonusCents(pkg: CreditPackage): number {
  return pkg.creditCents - pkg.priceCents;
}

export function formatUsd(cents: number): string {
  const sign = cents < 0 ? "-" : "";
  const abs = Math.abs(cents);
  return `${sign}$${(abs / 100).toFixed(2)}`;
}
