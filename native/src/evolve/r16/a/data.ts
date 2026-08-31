// native/src/evolve/r16/a/data.ts — deterministic dummy data for OfferComparisonScreen
// No Math.random / Date.now / argument-less `new Date()` anywhere below.

export type Offer = {
  id: string;
  buyerName: string;
  buyerInitial: string;
  priceWon: number;
  note: string;
  relativeTime: string;
  // Fixed sortable timestamp stand-in (minutes ago), not derived from a live clock.
  minutesAgo: number;
};

export const LISTING = {
  title: "Nike Air Force 1 '07 — size 260",
  conditionLabel: "Gently used",
  askingPriceWon: 85000,
  photoInitial: "AF1",
} as const;

export const OFFERS: Offer[] = [
  {
    id: "o1",
    buyerName: "Minji Park",
    buyerInitial: "MP",
    priceWon: 85000,
    note: "Can meet this weekend, full asking price.",
    relativeTime: "2 hours ago",
    minutesAgo: 120,
  },
  {
    id: "o2",
    buyerName: "Daniel Cho",
    buyerInitial: "DC",
    priceWon: 78000,
    note: "Love these — a bit under budget, can pick up anytime.",
    relativeTime: "5 hours ago",
    minutesAgo: 300,
  },
  {
    id: "o3",
    buyerName: "Soojin Lee",
    buyerInitial: "SL",
    priceWon: 92000,
    note: "Willing to pay above asking for same-day handoff.",
    relativeTime: "Yesterday",
    minutesAgo: 1400,
  },
  {
    id: "o4",
    buyerName: "Tae-yang Kim",
    buyerInitial: "TK",
    priceWon: 80000,
    note: "First-time buyer, flexible on meetup time and place.",
    relativeTime: "Yesterday",
    minutesAgo: 1600,
  },
  {
    id: "o5",
    buyerName: "Haeun Jung",
    buyerInitial: "HJ",
    priceWon: 85000,
    note: "Matches your asking price, can do a locker drop-off.",
    relativeTime: "2 days ago",
    minutesAgo: 2880,
  },
];

export function formatWon(amount: number): string {
  const digits = Math.round(amount).toString();
  const withCommas = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  // Visible gap between ₩ and the digits — the glyph's stroke otherwise
  // runs into the adjacent digit at body text size. See candidates/a.md.
  return `₩ ${withCommas}`;
}
