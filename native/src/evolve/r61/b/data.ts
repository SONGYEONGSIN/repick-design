// native/src/evolve/r61/b/data.ts
//
// Deterministic dummy data for "Manage Saved Payment Methods". No
// Math.random, no Date.now, no argumentless `new Date()` anywhere — every
// value below is a fixed literal.

export type PaymentMethodKind = "card" | "bank" | "wallet";

export type PaymentMethod = {
  id: string;
  kind: PaymentMethodKind;
  // Short type chip text, e.g. "Card", "Bank account", "Wallet".
  kindLabel: string;
  // The row's full spoken/visible title — brand or institution plus a
  // masked last-4 for cards/banks, or just the wallet's name (a wallet has
  // no card number to mask). Used both in the row heading and composed into
  // the inline removal-confirmation sentence, so it reads naturally in both
  // places without re-deriving a sentence fragment at render time.
  title: string;
  // Secondary static line: expiry for a card, account type for a bank, or
  // a plain label for the wallet ("Available balance") that pairs with
  // `balance` below.
  meta: string;
  // Only set for the wallet row — a card/bank shows a masked last-4 instead
  // of a balance, never both on the same row.
  balance?: string;
  isDefault: boolean;
};

// Seed order matters: it is also the deterministic "next in line" order used
// when the current default row is removed (see promoteNextDefault in the
// screen) — the first remaining row after the removed one becomes the new
// default.
export const INITIAL_PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "pm-visa-4471",
    kind: "card",
    kindLabel: "Card",
    title: "Visa ending 4471",
    meta: "Expires 08/28",
    isDefault: true,
  },
  {
    id: "pm-mc-2290",
    kind: "card",
    kindLabel: "Card",
    title: "Mastercard ending 2290",
    meta: "Expires 02/27",
    isDefault: false,
  },
  {
    id: "pm-kb-7730",
    kind: "bank",
    kindLabel: "Bank account",
    title: "Kookmin Bank account ending 7730",
    meta: "Checking account",
    isDefault: false,
  },
  {
    id: "pm-wallet",
    kind: "wallet",
    kindLabel: "Wallet",
    title: "repick Wallet",
    meta: "Available balance",
    balance: "KRW 48,000",
    isDefault: false,
  },
];
