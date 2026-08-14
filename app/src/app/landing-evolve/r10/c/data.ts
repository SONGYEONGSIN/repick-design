import type { LucideIcon } from "lucide-react";
import { Handshake, MessageSquareText, Scale, ShieldCheck } from "lucide-react";

/**
 * Data + pure derivations for r10/c "Negotiation Console".
 *
 * Every number below is either a module constant or the output of a pure integer function of the
 * slider value — nothing random, nothing clock-dependent, so server render and client hydration can
 * never disagree.
 */

// --- utils ---------------------------------------------------------------
export const cx = (...parts: Array<string | false | null | undefined>) =>
  parts.filter(Boolean).join(" ");

export const money = (n: number) => `$${n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;

// --- motion ----------------------------------------------------------------
export const EASE = [0.16, 1, 0.3, 1] as const;
export const VIEWPORT = { once: true, margin: "-80px" } as const;

// --- shared class tokens (design DNA: dark near-monochrome + single accent) --
// Focus rings and small icons/text use the derived tint (#B6A6F0, 9.1:1 on #0B0B0F) rather than the
// base accent (#6E56CF, 3.73:1 — large-text-only) per design-principles §Color Tokens.
export const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0F] focus-visible:ring-[#B6A6F0]";
export const EYEBROW = "text-[0.7rem] font-semibold uppercase tracking-[0.28em]";
export const CAPTION = "text-[0.72rem] font-semibold uppercase tracking-[0.16em]";
export const STAT = "tabular-nums tracking-[0.12em]";

// --- domain: negotiation console -------------------------------------------

export const ASKING_PRICE = 185;

export type ToneTier = {
  id: string;
  min: number;
  label: string;
  message: (offer: number) => string;
};

export const TONE_TIERS: ToneTier[] = [
  {
    id: "polite",
    min: 0,
    label: "Polite",
    message: (offer) =>
      `Hi! I really love this piece — would you consider $${offer} if I can pick it up this week? Totally understand if not.`,
  },
  {
    id: "friendly",
    min: 25,
    label: "Friendly-firm",
    message: (offer) =>
      `Hi there — I'd like to offer $${offer} for this. It's a fair price for the condition, and I can pay today.`,
  },
  {
    id: "direct",
    min: 50,
    label: "Direct",
    message: (offer) =>
      `I'll offer $${offer}, final. Similar listings sold for less this month, and I can close today.`,
  },
  {
    id: "assertive",
    min: 75,
    label: "Assertive",
    message: (offer) =>
      `$${offer} is my offer, and I won't go higher — the going rate for this condition is lower. Let me know today.`,
  },
];

/** Snaps a 0–100 slider value down to its tone tier. */
export function toneForValue(v: number): ToneTier {
  let picked = TONE_TIERS[0];
  for (const tier of TONE_TIERS) {
    if (v >= tier.min) picked = tier;
  }
  return picked;
}

/** More assertive = a bigger requested discount off the asking price. */
export function savingsFor(v: number): number {
  const clamped = Math.min(100, Math.max(0, v));
  return Math.round(18 + clamped * 0.6);
}

export function offerFor(v: number): number {
  return ASKING_PRICE - savingsFor(v);
}

export function savingsPctFor(v: number): number {
  return Math.round((savingsFor(v) / ASKING_PRICE) * 100);
}

/** More assertive = a lower chance the seller accepts — the real trade-off being previewed. */
export function likelihoodFor(v: number): number {
  const clamped = Math.min(100, Math.max(0, v));
  return Math.round(82 - clamped * 0.34);
}

// --- domain: product comparison strip ---------------------------------------

export type Product = {
  id: string;
  title: string;
  reasonTag: string;
  match: number;
  grade: string;
  verified: boolean;
  discountPct: number;
  image: string;
  alt: string;
};

export const PRODUCTS: Product[] = [
  {
    id: "jacket",
    title: "Denim Trucker Jacket",
    reasonTag: "Matched: fit + brand history",
    match: 92,
    grade: "A-",
    verified: true,
    discountPct: 38,
    image:
      "https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=600&q=80",
    alt: "Denim trucker jacket laid flat against a plain backdrop",
  },
  {
    id: "boots",
    title: "Suede Chelsea Boots",
    reasonTag: "Matched: size + condition grade",
    match: 88,
    grade: "B+",
    verified: true,
    discountPct: 42,
    image:
      "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=600&q=80",
    alt: "Pair of suede Chelsea boots side by side",
  },
  {
    id: "bag",
    title: "Leather Mini Shoulder Bag",
    reasonTag: "Matched: color + price ceiling",
    match: 95,
    grade: "A",
    verified: true,
    discountPct: 41,
    image:
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80",
    alt: "Close-up photo of a leather mini shoulder bag",
  },
  {
    id: "sneakers",
    title: "High-Top Leather Sneakers",
    reasonTag: "Matched: style, ID check pending",
    match: 81,
    grade: "B",
    verified: false,
    discountPct: 37,
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80",
    alt: "Photo of a pair of high-top sneakers placed side by side",
  },
];

// --- domain: value-prop tabs -------------------------------------------------

export type ValueTab = {
  id: string;
  label: string;
  icon: LucideIcon;
  heading: string;
  body: string;
  proof: string;
};

export const VALUE_TABS: ValueTab[] = [
  {
    id: "condition",
    label: "Verified condition",
    icon: ShieldCheck,
    heading: "Every grade is inspected, not guessed.",
    body: "A human inspector checks wear, function and completeness against a six-point scale before a listing goes live — sellers cannot self-report a grade.",
    proof: "1,900+ items graded this month",
  },
  {
    id: "pricing",
    label: "Fair pricing",
    icon: Scale,
    heading: "Priced against real recent sales, not asking price.",
    body: "Every listing is checked against 90 days of comparable sales, so the number you see already accounts for condition and demand.",
    proof: "Average 34% below original retail",
  },
  {
    id: "negotiation",
    label: "Live negotiation",
    icon: MessageSquareText,
    heading: "Your message is drafted with you, not for you.",
    body: "The tone slider you tried above ships on every listing page — adjust it and repick redrafts the offer and its odds in real time.",
    proof: "Median seller response: 6 hours",
  },
  {
    id: "protection",
    label: "Buyer protection",
    icon: Handshake,
    heading: "Covered if the listing doesn't match.",
    body: "If a graded item arrives in worse condition than described, the purchase is refunded in full within a 30-day window.",
    proof: "30-day return window on every order",
  },
];

// --- domain: trust marquee ----------------------------------------------------

export const TRUST_ITEMS: string[] = [
  "12,400+ verified sellers",
  "94% buyer satisfaction",
  "48-hr average response",
  "$1.8M saved through negotiation this year",
  "30-day return protection on every order",
  "4.8 / 5 average seller rating",
];

// --- domain: comparison table --------------------------------------------------

export type CompareRow = { feature: string; generic: string; repick: string };

export const COMPARE_ROWS: CompareRow[] = [
  {
    feature: "Condition grading",
    generic: "Seller's own description",
    repick: "Independently inspected, graded A to D",
  },
  {
    feature: "Price fairness check",
    generic: "No comparison to market",
    repick: "Checked against 90 days of comparable sales",
  },
  {
    feature: "Seller verification",
    generic: "Email address only",
    repick: "ID-verified, dispute history shown",
  },
  {
    feature: "Negotiation support",
    generic: "You're on your own",
    repick: "AI-drafted offers with live accept odds",
  },
  {
    feature: "Buyer protection",
    generic: "Rarely refundable",
    repick: "30-day return window",
  },
];
