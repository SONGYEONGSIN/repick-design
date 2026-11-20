// native/src/evolve/r60/c/data.ts
// Deterministic dummy data for the Dispute Evidence Checklist screen.
// No Math.random / Date.now / bare `new Date()` — every value is hardcoded.

export type EvidenceItem = {
  id: string;
  title: string;
  description: string;
  attached: boolean;
};

export const disputeCase = {
  orderId: "Order #RP-48213",
  itemTitle: "Sony WH-1000XM4 Wireless Headphones",
  reasonLabel: "Dispute Reason",
  reason: "Item Not as Described",
  reasonDetail:
    "Listing stated \"like new, no scuffs\" — item arrived with visible scratches on both ear cups and a cracked headband hinge.",
  filedOn: "Filed Nov 18, 2026",
};

// Minimum number of checklist items that must be attached before Submit
// becomes available. Chosen as a majority of the 5-item checklist (see
// candidates/c.md "브리프에 없던 것" for the rationale).
export const MIN_REQUIRED = 3;

export const initialEvidence: EvidenceItem[] = [
  {
    id: "photos-item",
    title: "Photos of the item as received",
    description: "At least 2 angles showing the scratches and hinge damage.",
    attached: true,
  },
  {
    id: "order-receipt",
    title: "Original order receipt",
    description: "Order confirmation showing price paid and purchase date.",
    attached: true,
  },
  {
    id: "chat-messages",
    title: "Chat messages with seller",
    description: "Any messages discussing the item's condition before or after delivery.",
    attached: false,
  },
  {
    id: "packaging-photo",
    title: "Photo of packaging and shipping label",
    description: "Helps confirm how the item was packed in transit.",
    attached: false,
  },
  {
    id: "listing-screenshot",
    title: "Screenshot of the original listing",
    description: "The listing text and photos as they appeared at time of purchase.",
    attached: false,
  },
];
