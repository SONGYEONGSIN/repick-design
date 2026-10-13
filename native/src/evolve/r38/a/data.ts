// native/src/evolve/r38/a/data.ts
//
// Deterministic Help Center dummy data — fixed FAQ entries, each tagged with
// one category and a handful of keywords so the live search box can match
// against more than the literal question text. No Math.random/Date.now.

export type FaqCategory = "shipping" | "payments" | "returns" | "account";

export type FaqCategoryFilterKey = "all" | FaqCategory;

export interface FaqEntry {
  id: string;
  category: FaqCategory;
  question: string;
  answer: string;
  // Extra match terms beyond the question wording itself — lets "refund"
  // surface a question titled "When do I get my money back?", for example.
  keywords: string[];
}

export const faqCategoryFilters: {
  key: FaqCategoryFilterKey;
  label: string;
}[] = [
  { key: "all", label: "All topics" },
  { key: "shipping", label: "Shipping" },
  { key: "payments", label: "Payments" },
  { key: "returns", label: "Returns" },
  { key: "account", label: "Account" },
];

export const faqCategoryLabels: Record<FaqCategory, string> = {
  shipping: "Shipping",
  payments: "Payments",
  returns: "Returns",
  account: "Account",
};

export const faqEntries: FaqEntry[] = [
  {
    id: "faq-shipping-1",
    category: "shipping",
    question: "How long does shipping usually take?",
    answer:
      "Most sellers ship within 2 business days of a sale. Delivery typically takes 3-7 business days after that, depending on the carrier and your location.",
    keywords: ["shipping time", "delivery", "how long", "carrier", "eta"],
  },
  {
    id: "faq-shipping-2",
    category: "shipping",
    question: "Can I track my package?",
    answer:
      "Yes. Once a seller marks an item as shipped, a tracking number appears on your order details page and updates automatically as the carrier scans it.",
    keywords: ["tracking", "track package", "tracking number"],
  },
  {
    id: "faq-shipping-3",
    category: "shipping",
    question: "What if my package never arrives?",
    answer:
      "If tracking shows no movement for 5 days past the estimated delivery date, open a case from your order details page and we'll step in to help locate it or issue a resolution.",
    keywords: ["lost package", "never arrived", "missing delivery"],
  },
  {
    id: "faq-shipping-4",
    category: "shipping",
    question: "Do you ship internationally?",
    answer:
      "International shipping availability depends on the individual seller. Check the listing page for a shipping destinations list before you buy.",
    keywords: ["international", "overseas", "ship abroad"],
  },
  {
    id: "faq-payments-1",
    category: "payments",
    question: "How do I add a payment method?",
    answer:
      "Go to Account > Payment methods and tap Add payment method. We support major debit and credit cards as well as linked bank accounts.",
    keywords: ["add card", "payment method", "credit card"],
  },
  {
    id: "faq-payments-2",
    category: "payments",
    question: "Why was my payment declined?",
    answer:
      "Declines are usually caused by an expired card, insufficient funds, or your bank flagging the charge as unusual. Try a different payment method or contact your bank.",
    keywords: ["declined", "payment failed", "card error"],
  },
  {
    id: "faq-payments-3",
    category: "payments",
    question: "When am I charged for an order?",
    answer:
      "Your payment method is charged the moment you confirm checkout, not when the seller ships the item.",
    keywords: ["charged", "checkout", "billing"],
  },
  {
    id: "faq-payments-4",
    category: "payments",
    question: "Can I split a payment across two cards?",
    answer:
      "No — each order is paid with a single payment method. You can switch methods any time before you confirm checkout.",
    keywords: ["split payment", "multiple cards", "two cards"],
  },
  {
    id: "faq-returns-1",
    category: "returns",
    question: "What's the return window?",
    answer:
      "Most items can be returned within 14 days of delivery if they don't match the listing description. Final-sale items are marked clearly on the listing and aren't eligible.",
    keywords: ["return window", "14 days", "return policy"],
  },
  {
    id: "faq-returns-2",
    category: "returns",
    question: "How do I start a return?",
    answer:
      "Open the order from your purchase history and tap Request a return. Choose a reason and the seller will respond within 2 business days.",
    keywords: ["start return", "request return", "return item"],
  },
  {
    id: "faq-returns-3",
    category: "returns",
    question: "Who pays for return shipping?",
    answer:
      "If the item doesn't match its description, return shipping is covered. If you simply changed your mind, you're responsible for the return shipping cost.",
    keywords: ["return shipping cost", "who pays", "shipping label"],
  },
  {
    id: "faq-returns-4",
    category: "returns",
    question: "When do I get my money back?",
    answer:
      "Refunds are issued once the seller confirms the returned item's condition, usually within 3 business days of it arriving back with them.",
    keywords: ["refund timing", "when refund", "money back"],
  },
  {
    id: "faq-account-1",
    category: "account",
    question: "How do I change my email address?",
    answer:
      "Go to Account > Preferences > Email and enter a new address. We'll send a confirmation link before the change takes effect.",
    keywords: ["change email", "update email"],
  },
  {
    id: "faq-account-2",
    category: "account",
    question: "How do I reset my password?",
    answer:
      "On the sign-in screen, tap Forgot password and follow the link sent to your email to choose a new one.",
    keywords: ["reset password", "forgot password", "sign in"],
  },
  {
    id: "faq-account-3",
    category: "account",
    question: "Can I have more than one account?",
    answer:
      "Each person may hold one account. Using multiple accounts to get around limits or restrictions can result in suspension.",
    keywords: ["multiple accounts", "second account", "duplicate account"],
  },
  {
    id: "faq-account-4",
    category: "account",
    question: "How do I delete my account?",
    answer:
      "Go to Account > Preferences > Close account. Any pending orders or payouts must be completed first.",
    keywords: ["delete account", "close account", "deactivate"],
  },
];
