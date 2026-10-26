// native/src/evolve/r42/a/data.ts
//
// Deterministic dummy data for the Listing Q&A screen. No Math.random,
// no Date.now, no bare new Date() — relative timestamps are hardcoded
// strings, and upvote counts are fixed seed values that local state
// then increments/decrements from.

export type QAEntry = {
  id: string;
  question: string;
  askerName: string;
  askedAgo: string;
  upvotes: number;
  answer: {
    text: string;
    responderName: string;
    responderRole: "seller" | "buyer";
    answeredAgo: string;
  } | null;
};

export const listingContext = {
  thumbnailLabel: "RK",
  itemName: "Canon AE-1 35mm Film Camera",
  price: "$145.00",
};

export const qaEntries: QAEntry[] = [
  {
    id: "qa-1",
    question: "Does this come with the original strap and lens cap?",
    askerName: "mina.k",
    askedAgo: "2d ago",
    upvotes: 14,
    answer: {
      text: "Yes, both are included. The strap has light wear but no tears.",
      responderName: "camerashop_jw",
      responderRole: "seller",
      answeredAgo: "2d ago",
    },
  },
  {
    id: "qa-2",
    question: "Have you tested the shutter at all speeds? Any sticking?",
    askerName: "film.and.coffee",
    askedAgo: "3d ago",
    upvotes: 9,
    answer: {
      text: "Tested 1/1000 down to 1s, all firing cleanly. No sticking.",
      responderName: "camerashop_jw",
      responderRole: "seller",
      answeredAgo: "3d ago",
    },
  },
  {
    id: "qa-3",
    question: "Is local pickup available, or shipping only?",
    askerName: "dohyun92",
    askedAgo: "4d ago",
    upvotes: 3,
    answer: null,
  },
  {
    id: "qa-4",
    question: "What battery does the light meter take, and is one included?",
    askerName: "retro_reels",
    askedAgo: "5d ago",
    upvotes: 6,
    answer: {
      text: "Takes a 4LR44. Not included, but they're cheap and easy to find.",
      responderName: "sana_vintage",
      responderRole: "buyer",
      answeredAgo: "5d ago",
    },
  },
  {
    id: "qa-5",
    question: "Any fungus or haze visible in the lens when held up to light?",
    askerName: "grainy_prints",
    askedAgo: "6d ago",
    upvotes: 11,
    answer: null,
  },
  {
    id: "qa-6",
    question: "Would you consider including a roll of film with purchase?",
    askerName: "newtofilm22",
    askedAgo: "1w ago",
    upvotes: 2,
    answer: {
      text: "Not able to include film, sorry — but the body and lens are in great shape on their own.",
      responderName: "camerashop_jw",
      responderRole: "seller",
      answeredAgo: "6d ago",
    },
  },
];
