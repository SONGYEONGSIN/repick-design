// native/src/evolve/r26/c/data.ts — auto-native-r26 candidate c
// Deterministic dummy data for the Linked Bank Accounts screen: a seller's payout
// destinations (where marketplace proceeds get wired out), not a buyer's card-on-file.

export type PayoutAccountKind = "checking" | "savings";

export type PayoutAccount = {
  id: string;
  bankName: string;
  holderName: string;
  last4: string;
  kind: PayoutAccountKind;
  isDefault: boolean;
  isVerified: boolean;
  linkedOnLabel: string;
};

// Fixed seed list — three payout destinations, one already marked default, one still
// mid-verification. No Date.now()/Math.random(); labels are hand-written fixed strings.
export const SEED_PAYOUT_ACCOUNTS: PayoutAccount[] = [
  {
    id: "acct-meridian",
    bankName: "Meridian Trust",
    holderName: "Yoon Song",
    last4: "4821",
    kind: "checking",
    isDefault: true,
    isVerified: true,
    linkedOnLabel: "Linked Feb 3, 2026",
  },
  {
    id: "acct-harbor",
    bankName: "Harbor Community Bank",
    holderName: "Yoon Song",
    last4: "0093",
    kind: "savings",
    isDefault: false,
    isVerified: true,
    linkedOnLabel: "Linked Nov 18, 2025",
  },
  {
    id: "acct-unionwest",
    bankName: "Union West Federal",
    holderName: "Yoon Song",
    last4: "7710",
    kind: "checking",
    isDefault: false,
    isVerified: false,
    linkedOnLabel: "Linked Sep 30, 2025",
  },
];

export function maskedAccountNumber(last4: string): string {
  return `•••• •••• ${last4}`;
}

export function accountKindLabel(kind: PayoutAccountKind): string {
  return kind === "checking" ? "Checking account" : "Savings account";
}

export function countNoun(n: number, noun: string): string {
  return `${n} ${noun}${n === 1 ? "" : "s"}`;
}

export function bankInitial(bankName: string): string {
  return bankName.charAt(0).toUpperCase();
}

// A seller must always keep at least one payout destination, and can't unlink the one
// currently marked default without reassigning default first. Returns null when unlinking
// is allowed, or the reason text to surface when it isn't.
export function unlinkBlockReason(
  account: PayoutAccount,
  totalAccounts: number,
): string | null {
  if (totalAccounts <= 1) {
    return "This is your only linked account — link another before unlinking it.";
  }
  if (account.isDefault) {
    return "Set a different account as default before unlinking this one.";
  }
  return null;
}
