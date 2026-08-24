// native/src/evolve/r13/c/data.ts
// Deterministic dummy content for the Support Center screen. No Math.random / Date.now /
// bare `new Date()` — every value here is a fixed literal.

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export type FaqCategory = {
  id: string;
  title: string;
  items: FaqItem[];
};

export const FAQ_CATEGORIES: FaqCategory[] = [
  {
    id: "orders",
    title: "Orders & Payments",
    items: [
      {
        id: "orders-1",
        question: "Why was my payment declined?",
        answer:
          "Most declines come from the card issuer, not Repick — an expired card, an incorrect billing address, or a temporary hold from your bank. Try a different payment method, or contact your bank to confirm the charge was authorized.",
      },
      {
        id: "orders-2",
        question: "Can I cancel an order after paying?",
        answer:
          "You can cancel any order the seller hasn't marked as shipped yet, free of charge. Once it ships, cancellation turns into a standard return instead — see the Returns & Refunds section below.",
      },
      {
        id: "orders-3",
        question: "When is my payment method actually charged?",
        answer:
          "We authorize the charge the moment you place the order, but only capture it once the seller confirms and ships. If a seller never ships within 5 days, the authorization is released automatically.",
      },
    ],
  },
  {
    id: "shipping",
    title: "Shipping & Delivery",
    items: [
      {
        id: "shipping-1",
        question: "How long does shipping usually take?",
        answer:
          "Most sellers ship within 2 business days of an order, and standard delivery takes 3-5 business days after that. You'll see a carrier estimate on the order tracking screen once a label is created.",
      },
      {
        id: "shipping-2",
        question: "Can I change my delivery address after buying?",
        answer:
          "Yes, as long as the seller hasn't printed a shipping label yet. Open the order and choose Edit address — once a label exists, the address is locked and you'll need to redirect the package with the carrier instead.",
      },
      {
        id: "shipping-3",
        question: "The tracking says delivered, but I haven't received it — what now?",
        answer:
          "Give it 48 hours, since carriers sometimes mark packages delivered slightly early. If it still hasn't turned up, check with neighbors and your building's front desk, then open a case from the order page so we can trace it with the carrier.",
      },
    ],
  },
  {
    id: "returns",
    title: "Returns & Refunds",
    items: [
      {
        id: "returns-1",
        question: "What is Repick's return window?",
        answer:
          "You have 14 days from the delivery date to start a return on eligible items. The item needs to be in the condition it was described in — the return request form will ask you to confirm and photograph that.",
      },
      {
        id: "returns-2",
        question: "How long do refunds take to process?",
        answer:
          "Once the seller confirms the returned item, refunds are issued to your original payment method within 3 business days. Your bank or card issuer may take a few additional days to show it in your statement.",
      },
      {
        id: "returns-3",
        question: "Do I have to pay for return shipping?",
        answer:
          "If the item doesn't match its listing, return shipping is free and a prepaid label is generated for you. If you're returning it for another reason, such as a change of mind, return shipping is the buyer's responsibility.",
      },
    ],
  },
  {
    id: "account",
    title: "Account & Security",
    items: [
      {
        id: "account-1",
        question: "How do I reset my password?",
        answer:
          "From the sign-in screen, choose Forgot password and enter the email on your account. You'll get a reset link that's valid for 60 minutes — after that you'll need to request a new one.",
      },
      {
        id: "account-2",
        question: "How do I turn on two-factor authentication?",
        answer:
          "Go to Account settings, then Security, and enable two-factor authentication. You can verify with either a text message code or an authenticator app; we recommend the app since it also works without cell signal.",
      },
      {
        id: "account-3",
        question: "Someone is impersonating me or my listing — what do I do?",
        answer:
          "Report the listing or profile directly from its page using Report, and also reach an agent through the button below so we can act on it right away — impersonation reports are prioritized ahead of the normal review queue.",
      },
    ],
  },
  {
    id: "selling",
    title: "Selling on Repick",
    items: [
      {
        id: "selling-1",
        question: "How do seller payouts work?",
        answer:
          "Payouts release 2 days after the buyer's delivery confirmation, once the return window has safely passed for that item's category. Funds land in your linked bank account within 1-3 business days after release.",
      },
      {
        id: "selling-2",
        question: "What happens if a buyer disputes my item's condition?",
        answer:
          "You'll be notified and given a chance to respond with your own photos and listing history before anything is decided. Most condition disputes are resolved within 4 business days by our review team.",
      },
      {
        id: "selling-3",
        question: "Can I edit a listing after it's published?",
        answer:
          "You can edit price, description, and photos any time before it sells. Once an item has a pending offer or accepted order, only the description stays editable so buyers can trust what they agreed to.",
      },
    ],
  },
];
