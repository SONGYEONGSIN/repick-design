// native/src/evolve/r45/c/data.ts
//
// Deterministic dummy data for the Negotiation History screen — a
// chronological ledger of CLOSED (or otherwise resolved) price
// negotiations the current user has sent, as buyer, across different
// items. Every record here carries a final status; this is intentionally
// distinct from a single live back-and-forth (`offer-thread`) and from a
// "current status of one offer" snapshot (`offer-status`) — this is the
// full historical list across many of them.
//
// No Math.random, no Date.now(), no bare `new Date()` — dates are fixed,
// pre-formatted display strings so the screen never computes "now".

export type NegotiationStatus =
  | "accepted"
  | "declined"
  | "expired"
  | "withdrawn"
  | "countered-then-expired";

export interface NegotiationRecord {
  id: string;
  itemName: string;
  // the amount the current user (buyer) offered
  yourOffer: number;
  // the seller's counteroffer, if they made one — null when the seller
  // never countered (e.g. a flat decline, a silent expiry, or a withdrawal
  // before any counter came back)
  sellerCounter: number | null;
  // the amount the negotiation actually settled at — only set when status
  // is "accepted"
  finalAmount: number | null;
  status: NegotiationStatus;
  offerDateLabel: string;
  resolvedDateLabel: string;
}

// Most recent first — this is the ledger's default (and only) order.
export const NEGOTIATIONS: NegotiationRecord[] = [
  {
    id: "n1",
    itemName: "Vintage Leather Jacket",
    yourOffer: 85,
    sellerCounter: 95,
    finalAmount: 95,
    status: "accepted",
    offerDateLabel: "Oct 18, 2026",
    resolvedDateLabel: "Oct 19, 2026",
  },
  {
    id: "n2",
    itemName: "Mechanical Keyboard (Tenkeyless)",
    yourOffer: 120,
    sellerCounter: null,
    finalAmount: null,
    status: "declined",
    offerDateLabel: "Oct 12, 2026",
    resolvedDateLabel: "Oct 13, 2026",
  },
  {
    id: "n3",
    itemName: "Canon AE-1 Film Camera",
    yourOffer: 150,
    sellerCounter: 180,
    finalAmount: null,
    status: "countered-then-expired",
    offerDateLabel: "Sep 30, 2026",
    resolvedDateLabel: "Oct 4, 2026",
  },
  {
    id: "n4",
    itemName: "Mid-Century Side Table",
    yourOffer: 60,
    sellerCounter: null,
    finalAmount: null,
    status: "expired",
    offerDateLabel: "Sep 21, 2026",
    resolvedDateLabel: "Sep 24, 2026",
  },
  {
    id: "n5",
    itemName: "Nintendo Switch Bundle",
    yourOffer: 180,
    sellerCounter: 200,
    finalAmount: 200,
    status: "accepted",
    offerDateLabel: "Sep 10, 2026",
    resolvedDateLabel: "Sep 11, 2026",
  },
  {
    id: "n6",
    itemName: "Wool Peacoat, Size M",
    yourOffer: 40,
    sellerCounter: null,
    finalAmount: null,
    status: "withdrawn",
    offerDateLabel: "Aug 29, 2026",
    resolvedDateLabel: "Aug 29, 2026",
  },
  {
    id: "n7",
    itemName: "Road Bike, 54cm Frame",
    yourOffer: 220,
    sellerCounter: 260,
    finalAmount: null,
    status: "declined",
    offerDateLabel: "Aug 14, 2026",
    resolvedDateLabel: "Aug 16, 2026",
  },
  {
    id: "n8",
    itemName: "Espresso Machine, Semi-Auto",
    yourOffer: 95,
    sellerCounter: 110,
    finalAmount: 105,
    status: "accepted",
    offerDateLabel: "Jul 30, 2026",
    resolvedDateLabel: "Aug 2, 2026",
  },
];
