// native/src/evolve/r23/b/data.ts — deterministic dummy data, no Math.random / Date.now

export type PaymentMethodKind = "card" | "bank";

export type PaymentMethod = {
  id: string;
  kind: PaymentMethodKind;
  label: string;
  detail: string;
  isDefault: boolean;
  usableForPayout: boolean;
  lastUsedNote: string;
};

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "pm-1",
    kind: "card",
    label: "Visa ending 4471",
    detail: "Expires 08/28",
    isDefault: true,
    usableForPayout: false,
    lastUsedNote: "Last used for a KRW 128,000 purchase",
  },
  {
    id: "pm-2",
    kind: "card",
    label: "Mastercard ending 2290",
    detail: "Expires 02/27",
    isDefault: false,
    usableForPayout: false,
    lastUsedNote: "Last used for a KRW 41,500 purchase",
  },
  {
    id: "pm-3",
    kind: "bank",
    label: "Kookmin Bank account ending 8832",
    detail: "Linked for payouts",
    isDefault: false,
    usableForPayout: true,
    lastUsedNote: "Last payout: KRW 305,000",
  },
  {
    id: "pm-4",
    kind: "card",
    label: "Visa ending 0093",
    detail: "Expires 11/26",
    isDefault: false,
    usableForPayout: false,
    lastUsedNote: "Last used for a KRW 76,000 purchase",
  },
];
