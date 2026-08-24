// native/src/evolve/r12/a/data.ts — deterministic dummy data for ReturnRequestScreen
// No Math.random / Date.now / argument-less `new Date()` anywhere below.

export type ReturnReason = {
  id: string;
  label: string;
  helper: string;
  requiresEvidence: boolean;
};

export type RefundMethod = {
  id: string;
  label: string;
  subtitle: string;
};

export const ORDER = {
  id: "ORD-8823041",
  itemTitle: "Uniqlo Fleece Jacket, size L",
  seller: "minsoo_thrift",
  priceWon: 42000,
  purchasedOn: "Aug 10, 2026",
  deliveredOn: "Aug 13, 2026",
} as const;

// Fixed set — the buyer picks exactly one.
export const RETURN_REASONS: ReturnReason[] = [
  {
    id: "not-as-described",
    label: "Item not as described",
    helper: "Color, size, or material differs from the listing",
    requiresEvidence: true,
  },
  {
    id: "defective",
    label: "Defective or damaged",
    helper: "Item arrived broken, stained, or malfunctioning",
    requiresEvidence: true,
  },
  {
    id: "wrong-item",
    label: "Wrong item received",
    helper: "This isn't what you ordered",
    requiresEvidence: true,
  },
  {
    id: "missing-parts",
    label: "Missing parts or accessories",
    helper: "Something listed was not in the package",
    requiresEvidence: true,
  },
  {
    id: "changed-mind",
    label: "Changed my mind",
    helper: "No longer needed — item is unused",
    requiresEvidence: false,
  },
];

export const REFUND_METHODS: RefundMethod[] = [
  {
    id: "original-payment",
    label: "Original payment method",
    subtitle: "Card ending 4821 · 3-5 business days",
  },
  {
    id: "store-credit",
    label: "Store credit",
    subtitle: "+5% bonus credit · Available instantly",
  },
];

export const MAX_PHOTOS = 4;

// Fixed literal, not generated at submit time — stands in for a server-assigned id.
export const RETURN_REQUEST_ID = "RET-20260823-4471";

export const REVIEW_WINDOW_TEXT = "within 2 business days";

export function formatWon(amount: number): string {
  const digits = Math.round(amount).toString();
  const withCommas = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  // Visible gap between ₩ and the digits — the glyph's stroke otherwise
  // runs into the adjacent digit at body text size.
  return `₩ ${withCommas}`;
}
