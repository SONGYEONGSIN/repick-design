// native/src/evolve/r19/c/data.ts — deterministic dummy data for Public Listing Q&A.
//
// This is a public board attached to one item — every question and every answer here is
// visible to any prospective buyer, not just the two parties in a private negotiation (compare
// offer-thread/OfferThread.tsx, which is exactly that private buyer↔seller channel). Most
// answers come from the seller, but a board like this is commonly also answered by other buyers
// who own the item — that second voice is modeled explicitly (see q-3 below) so the UI has to
// distinguish "Seller" from "Buyer" answers rather than assuming a single answerer role.

export type AnswerRole = "seller" | "buyer";

export interface QAAnswer {
  authorName: string;
  role: AnswerRole;
  text: string;
  answeredLabel: string; // pre-formatted relative/absolute label, e.g. "Answered Aug 15"
}

export interface QAQuestion {
  id: string;
  askerName: string;
  askedLabel: string;
  text: string;
  helpfulCount: number;
  viewerMarkedHelpful: boolean;
  answer: QAAnswer | null;
  order: number; // higher = asked more recently; drives "Newest" sort
}

export interface ListingSummary {
  title: string;
  brand: string;
  condition: string;
  price: number;
}

export const LISTING: ListingSummary = {
  title: "Nike Dunk Low Retro 'Panda'",
  brand: "Nike",
  condition: "Used · Like new",
  price: 148_000,
};

export const INITIAL_QUESTIONS: QAQuestion[] = [
  {
    id: "q-1",
    askerName: "minji_h",
    askedLabel: "Asked Aug 10",
    text: "Does this run true to size, or should I size down like the retail version?",
    helpfulCount: 14,
    viewerMarkedHelpful: false,
    answer: {
      authorName: "the seller",
      role: "seller",
      text: "True to size on me — I wear 270 in most Nike releases and 270 fit fine here.",
      answeredLabel: "Answered Aug 10",
    },
    order: 1,
  },
  {
    id: "q-2",
    askerName: "resell_dojun",
    askedLabel: "Asked Aug 12",
    text: "Any yellowing on the midsole? Photos look clean but that's hard to tell in this light.",
    helpfulCount: 22,
    viewerMarkedHelpful: true,
    answer: {
      authorName: "the seller",
      role: "seller",
      text: "No yellowing — these were stored in the box away from light. Happy to add a close-up photo of the midsole if that helps.",
      answeredLabel: "Answered Aug 12",
    },
    order: 2,
  },
  {
    id: "q-3",
    askerName: "hana_kicks",
    askedLabel: "Asked Aug 14",
    text: "For anyone who's bought this pair before — does the box included add much to resale later?",
    helpfulCount: 6,
    viewerMarkedHelpful: false,
    answer: {
      authorName: "jwoo_sneaks",
      role: "buyer",
      text: "Bought the same colorway with box last year — it's a small bump, not huge. Condition of the shoes matters a lot more than the box.",
      answeredLabel: "Answered Aug 15",
    },
    order: 3,
  },
  {
    id: "q-4",
    askerName: "coldbrew_yj",
    askedLabel: "Asked Aug 17",
    text: "Would you consider shipping outside Seoul, or is this pickup-only?",
    helpfulCount: 3,
    viewerMarkedHelpful: false,
    answer: null,
    order: 4,
  },
];

export function nextOrder(items: QAQuestion[]): number {
  return items.reduce((max, q) => Math.max(max, q.order), 0) + 1;
}

export function newQuestion(id: string, text: string, order: number): QAQuestion {
  return {
    id,
    askerName: "You",
    askedLabel: "Just now",
    text,
    helpfulCount: 0,
    viewerMarkedHelpful: false,
    answer: null,
    order,
  };
}

// A small space between the ₩ glyph and the digits keeps its crossbar from visually running
// into the numerals at body size (see GENERATION.md §1).
export function formatKrw(n: number): string {
  return `₩ ${n.toLocaleString("en-US")}`;
}

export function helpfulLabel(n: number): string {
  if (n === 0) return "No one has marked this helpful yet";
  if (n === 1) return "1 person found this helpful";
  return `${n} people found this helpful`;
}

export function answerRoleLabel(role: AnswerRole): string {
  return role === "seller" ? "Seller" : "Buyer";
}
