// native/src/evolve/r13/b/data.ts — deterministic dummy data for Seller Onboarding Setup
// No Math.random / Date.now / bare `new Date()` — every value below is fixed.

export type StepKey = "profile" | "categories" | "shipping" | "payout" | "review";

export type StepDef = {
  key: StepKey;
  title: string;
  /** Short label used in the collapsed summary card header. */
  shortLabel: string;
};

export const STEPS: StepDef[] = [
  { key: "profile", title: "Store Profile", shortLabel: "Profile" },
  { key: "categories", title: "Category Focus", shortLabel: "Categories" },
  { key: "shipping", title: "Shipping Setup", shortLabel: "Shipping" },
  { key: "payout", title: "Payout Account", shortLabel: "Payout" },
  { key: "review", title: "Review & Activate", shortLabel: "Review" },
];

export const STORE_NAME_MIN_LENGTH = 2;
export const BIO_MIN_LENGTH = 20;
export const MAX_CATEGORY_SELECTION = 3;

export type CategoryOption = { id: string; label: string };

export const CATEGORY_OPTIONS: CategoryOption[] = [
  { id: "clothing", label: "Clothing & Accessories" },
  { id: "electronics", label: "Electronics" },
  { id: "home", label: "Home & Living" },
  { id: "beauty", label: "Beauty & Personal Care" },
  { id: "sports", label: "Sports & Outdoor" },
  { id: "books", label: "Books & Media" },
];

export type ShippingMethodOption = { id: string; label: string; helper: string };

export const SHIPPING_METHOD_OPTIONS: ShippingMethodOption[] = [
  { id: "meetup", label: "In-person meetup only", helper: "Buyers pick up locally" },
  { id: "courier", label: "Courier shipping only", helper: "Every order ships by courier" },
  { id: "both", label: "Meetup and courier", helper: "Offer both to buyers" },
];

export type HandlingTimeOption = { id: string; label: string };

export const HANDLING_TIME_OPTIONS: HandlingTimeOption[] = [
  { id: "1-2", label: "1-2 business days" },
  { id: "3-5", label: "3-5 business days" },
  { id: "5-7", label: "5-7 business days" },
];

export const PAYOUT_MOCK = {
  bankName: "Kookmin Bank",
  accountLast4: "4821",
  holderName: "Store Owner",
};
