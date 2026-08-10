// app/src/app/contact-evolve/r2/c/data.ts
//
// Fixtures for the Overrun "Contact" page — a fixed, deterministic desk directory. No clock is read
// anywhere here: coverage is expressed as a fixed set of weekdays plus a fixed hour range per desk,
// never as a function of the visitor's actual time. Response promises are static text, and the
// interactive part of the page (search + category filter) narrows this fixed array client-side —
// it never depends on `Date.now()`, `new Date()`, or `Math.random()`.

export type Category = "Buying" | "Selling" | "Trust & Safety" | "Payments" | "Company";

export type IconKey = "package" | "credit-card" | "shield-check" | "lock" | "handshake" | "megaphone";

export type Desk = {
  id: string;
  name: string;
  category: Category;
  icon: IconKey;
  summary: string;
  handles: string[];
  notFor: { text: string; targetName: string };
  email: string;
  phone?: string;
  phoneLabel?: string;
  ownerName: string;
  ownerTitle: string;
  /** Subset of DAY_LABELS, in DAY_LABELS order. */
  coverageDays: string[];
  hoursRange: string;
  responseTarget: string;
  afterHours: string;
  /** Lowercase keywords the search box matches against, in addition to name/summary/handles. */
  tags: string[];
};

export const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

export const CATEGORIES: Category[] = ["Buying", "Payments", "Trust & Safety", "Selling", "Company"];

export const COMPANY = {
  name: "Overrun",
  line: "a price-tracking resale marketplace for streetwear and sneakers",
  generalEmail: "help@overrun.market",
  generalPhone: "+18555550100",
  generalPhoneLabel: "+1 (855) 555-0100",
  generalHours: "Mon–Fri, 09:00–18:00 KST",
  statusUrl: "https://status.overrun.market",
  helpCenterUrl: "https://help.overrun.market",
  postal: "Overrun Commerce, Inc. · 118 Canal Row, Suite 4B · Portland, OR 97209, USA",
  registered: "Registered in Oregon, USA — company number OR20263841",
};

export const DESKS: Desk[] = [
  {
    id: "orders",
    name: "Orders & Shipping",
    category: "Buying",
    icon: "package",
    summary: "Where an order actually is, and what to do when it isn't moving.",
    handles: [
      "Tracking a package that hasn't moved in 3+ days",
      "Wrong item, wrong size, or a missing accessory",
      "Cancelling before a seller has shipped",
    ],
    notFor: { text: "Item arrived but doesn't match its authenticity report?", targetName: "Authentication & Disputes" },
    email: "orders@overrun.market",
    phone: "+18555550111",
    phoneLabel: "+1 (855) 555-0111",
    ownerName: "Mina Ford",
    ownerTitle: "Buyer Operations",
    coverageDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    hoursRange: "08:00–20:00 KST",
    responseTarget: "Median first reply under 3 hours during coverage.",
    afterHours: "Written outside 08:00–20:00 KST queues and goes out first thing the next covered hour.",
    tags: ["tracking", "shipping", "delivery", "order status", "cancel", "wrong item", "package", "lost", "late"],
  },
  {
    id: "payments",
    name: "Payments & Payouts",
    category: "Payments",
    icon: "credit-card",
    summary: "Buyer charges, seller payouts, and anything with a dollar figure attached.",
    handles: [
      "A charge that doesn't match the order total",
      "A payout that's stuck or sent to the wrong account",
      "Fee, commission, or invoice questions",
    ],
    notFor: { text: "See a charge you never made?", targetName: "Account & Security" },
    email: "payments@overrun.market",
    ownerName: "Ravi Chandran",
    ownerTitle: "Finance Operations",
    coverageDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    hoursRange: "09:00–18:00 KST",
    responseTarget: "Median first reply under 6 business hours.",
    afterHours: "Weekend and evening messages wait for the next business morning — payouts don't move outside banking hours anyway.",
    tags: ["payout", "refund", "charge", "fee", "commission", "payment", "invoice", "bank transfer", "billing"],
  },
  {
    id: "authentication",
    name: "Authentication & Disputes",
    category: "Trust & Safety",
    icon: "shield-check",
    summary: "An item doesn't look right, or a buyer and seller disagree about why.",
    handles: [
      "Requesting a re-check on a failed authentication",
      "Opening a dispute after delivery",
      "Reporting a suspected counterfeit",
    ],
    notFor: { text: "Package never arrived at all?", targetName: "Orders & Shipping" },
    email: "authentication@overrun.market",
    phone: "+18555550134",
    phoneLabel: "+1 (855) 555-0134",
    ownerName: "Grace Oyelaran",
    ownerTitle: "Trust & Safety",
    coverageDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    hoursRange: "07:00–22:00 KST",
    responseTarget: "First response inside 2 hours — disputes hold the shipment until reviewed.",
    afterHours: "Sunday messages are read first thing Monday; nothing ships out of a hold before then.",
    tags: ["authentication", "fake", "counterfeit", "dispute", "damaged", "not as described", "legit check", "quality"],
  },
  {
    id: "security",
    name: "Account & Security",
    category: "Trust & Safety",
    icon: "lock",
    summary: "Locked out, phished, or something on the account you didn't do yourself.",
    handles: [
      "Account recovery and two-factor resets",
      "Reporting a compromised account",
      "Unrecognized login alerts",
    ],
    notFor: { text: "Login's fine but a charge looks wrong?", targetName: "Payments & Payouts" },
    email: "security@overrun.market",
    phone: "+18555550199",
    phoneLabel: "+1 (855) 555-0199",
    ownerName: "Owen Baptiste",
    ownerTitle: "Account Security",
    coverageDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    hoursRange: "24 hours, every day",
    responseTarget: "Acknowledged within 30 minutes, day or night.",
    afterHours: "There is no after-hours for this desk — it is staffed every hour of the week.",
    tags: ["hacked", "locked out", "2fa", "password", "phishing", "security", "fraud", "compromised", "login"],
  },
  {
    id: "sellers",
    name: "Seller Partnerships",
    category: "Selling",
    icon: "handshake",
    summary: "Opening a store, bulk listings, or moving from casual to verified seller.",
    handles: [
      "Applying for verified seller status",
      "Bulk and boutique listing tools",
      "Seller fee tiers and volume terms",
    ],
    notFor: { text: "A specific payout that hasn't landed yet?", targetName: "Payments & Payouts" },
    email: "sellers@overrun.market",
    ownerName: "Ana Petrov",
    ownerTitle: "Seller Growth",
    coverageDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    hoursRange: "10:00–19:00 KST",
    responseTarget: "Median first reply under 1 business day.",
    afterHours: "Applications submitted on the weekend are reviewed in order starting Monday morning.",
    tags: ["seller", "boutique", "bulk listing", "verified seller", "store", "wholesale", "onboarding", "consignment"],
  },
  {
    id: "press",
    name: "Press & Media",
    category: "Company",
    icon: "megaphone",
    summary: "Press inquiries, brand collaborations, and speaking requests.",
    handles: [
      "Press inquiries and interview requests",
      "Brand or drop collaborations",
      "Speaking and event requests",
    ],
    notFor: { text: "This is about your own order or account?", targetName: "Orders & Shipping" },
    email: "press@overrun.market",
    ownerName: "Jules Okonkwo",
    ownerTitle: "Communications",
    coverageDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    hoursRange: "09:00–17:00 KST",
    responseTarget: "Median first reply within 2 business days.",
    afterHours: "This inbox is read once a day, not continuously — plan for the next business day at the earliest.",
    tags: ["press", "media", "interview", "collaboration", "partnership", "brand deal", "speaking", "journalist"],
  },
];

/** Human-readable coverage label for the fixed, contiguous day sets used above. */
export function formatCoverage(days: string[]): string {
  if (days.length === 7) return "Every day";
  const isPrefix = (n: number) => days.length === n && days.every((d, i) => d === DAY_LABELS[i]);
  if (isPrefix(5)) return "Mon–Fri";
  if (isPrefix(6)) return "Mon–Sat";
  return days.join(", ");
}

export const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 focus-visible:ring-offset-2";
