// native/src/evolve/r40/c/data.ts
//
// Deterministic Payout Method Order dummy data. No Math.random/Date.now/
// argument-less new Date() anywhere — the three linked payout methods and
// their saved priority sequence are fixed literals.

export type PayoutMethodKind = "bank" | "card" | "wallet";

export interface PayoutMethodProfile {
  id: string;
  kind: PayoutMethodKind;
  // Short type tag shown on the row, e.g. "Bank" / "Card" / "Wallet".
  kindTag: string;
  // Masked account identifier, e.g. "Bank •••• 4821" — no ₩ glyph anywhere
  // in this domain's copy, so the crossbar-bleed issue never applies.
  maskedIdentifier: string;
  // Human-readable name used in on-screen copy and live-region
  // announcements, e.g. "Primary Bank Account".
  displayName: string;
}

// The seller's three linked payout methods. Fixed set — this screen does
// not support adding/removing methods, only reordering them.
export const payoutMethodProfiles: PayoutMethodProfile[] = [
  {
    id: "payout-method-bank-checking",
    kind: "bank",
    kindTag: "Bank",
    maskedIdentifier: "Bank •••• 4821",
    displayName: "Primary Bank Account",
  },
  {
    id: "payout-method-card-debit",
    kind: "card",
    kindTag: "Card",
    maskedIdentifier: "Card •••• 7734",
    displayName: "Debit Card",
  },
  {
    id: "payout-method-wallet-digital",
    kind: "wallet",
    kindTag: "Wallet",
    maskedIdentifier: "Wallet •••• 2290",
    displayName: "Digital Wallet",
  },
];

// The last-saved priority order, by method id, bank first. This is the
// "confirmed" snapshot the working order is compared against; the screen's
// bottom band mounts only once the working order's id sequence diverges
// from this array.
export const persistedDisbursementSequence: string[] = [
  "payout-method-bank-checking",
  "payout-method-card-debit",
  "payout-method-wallet-digital",
];

export function profileForMethodId(id: string): PayoutMethodProfile {
  const found = payoutMethodProfiles.find((profile) => profile.id === id);
  if (!found) {
    throw new Error(`Unknown payout method id: ${id}`);
  }
  return found;
}
