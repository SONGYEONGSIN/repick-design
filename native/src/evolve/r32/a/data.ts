// Deterministic dummy data for the Archive Conversations screen.
// No Math.random / Date.now / bare new Date() — every timestamp below is a fixed ISO string.

export type ConversationRole = "buyer" | "seller";

export interface ConversationThread {
  id: string;
  counterpartName: string;
  itemTitle: string;
  lastMessagePreview: string;
  isoTimestamp: string;
  dateLabel: string;
  role: ConversationRole;
  hasUnreadMessage: boolean;
  hasOpenOffer: boolean;
  offerAmountWon?: number;
}

// Source-of-truth order. Used to restore original ordering after an Undo.
export const CONVERSATION_THREADS: ConversationThread[] = [
  {
    id: "conv-01",
    counterpartName: "Min-jun Park",
    itemTitle: "Herman Miller Aeron Chair (Size B)",
    lastMessagePreview: "Is this still available? I can pick up this weekend.",
    isoTimestamp: "2026-09-29T14:12:00+09:00",
    dateLabel: "Sep 29",
    role: "buyer",
    hasUnreadMessage: true,
    hasOpenOffer: false,
  },
  {
    id: "conv-02",
    counterpartName: "Sora Kim",
    itemTitle: "Canon EOS M50 w/ 15-45mm kit lens",
    lastMessagePreview: "Sent an offer of ₩420,000 — let me know if that works.",
    isoTimestamp: "2026-09-30T10:05:00+09:00",
    dateLabel: "Sep 30",
    role: "seller",
    hasUnreadMessage: false,
    hasOpenOffer: true,
    offerAmountWon: 420000,
  },
  {
    id: "conv-03",
    counterpartName: "Daniel Osei",
    itemTitle: "IKEA Kallax Shelf (White, 4x4)",
    lastMessagePreview: "Thanks, picked it up safely. Appreciate it!",
    isoTimestamp: "2026-08-02T18:40:00+09:00",
    dateLabel: "Aug 2",
    role: "seller",
    hasUnreadMessage: false,
    hasOpenOffer: false,
  },
  {
    id: "conv-04",
    counterpartName: "Yuna Choi",
    itemTitle: "Nintendo Switch OLED (White)",
    lastMessagePreview: "Deal closed, thank you so much!",
    isoTimestamp: "2026-07-21T09:15:00+09:00",
    dateLabel: "Jul 21",
    role: "buyer",
    hasUnreadMessage: false,
    hasOpenOffer: false,
  },
  {
    id: "conv-05",
    counterpartName: "Thomas Reyes",
    itemTitle: "Patagonia Better Sweater (Men's M)",
    lastMessagePreview: "Still interested, just saw your reply.",
    isoTimestamp: "2026-09-28T20:02:00+09:00",
    dateLabel: "Sep 28",
    role: "seller",
    hasUnreadMessage: true,
    hasOpenOffer: true,
    offerAmountWon: 58000,
  },
  {
    id: "conv-06",
    counterpartName: "Haeun Jung",
    itemTitle: "Dyson V8 Cordless Vacuum",
    lastMessagePreview: "All set, shipped it out this morning.",
    isoTimestamp: "2026-06-11T11:30:00+09:00",
    dateLabel: "Jun 11",
    role: "seller",
    hasUnreadMessage: false,
    hasOpenOffer: false,
  },
  {
    id: "conv-07",
    counterpartName: "Carlos Mendes",
    itemTitle: "Logitech MX Master 3S Mouse",
    lastMessagePreview: "Sounds good, meeting at the station works.",
    isoTimestamp: "2026-05-30T16:45:00+09:00",
    dateLabel: "May 30",
    role: "buyer",
    hasUnreadMessage: false,
    hasOpenOffer: false,
  },
  {
    id: "conv-08",
    counterpartName: "Ji-woo Baek",
    itemTitle: "Polaroid Now+ Camera (Mint)",
    lastMessagePreview: "Would you consider ₩75,000 instead?",
    isoTimestamp: "2026-09-25T13:20:00+09:00",
    dateLabel: "Sep 25",
    role: "seller",
    hasUnreadMessage: false,
    hasOpenOffer: true,
    offerAmountWon: 75000,
  },
  {
    id: "conv-09",
    counterpartName: "Emily Osei-Tutu",
    itemTitle: "Herschel Little America Backpack",
    lastMessagePreview: "Great transaction, thanks again!",
    isoTimestamp: "2026-04-18T08:55:00+09:00",
    dateLabel: "Apr 18",
    role: "buyer",
    hasUnreadMessage: false,
    hasOpenOffer: false,
  },
];

// Stable position lookup so an Undo can reinsert threads at their original index.
export const ORIGINAL_ORDER: Record<string, number> = CONVERSATION_THREADS.reduce(
  (acc, thread, index) => {
    acc[thread.id] = index;
    return acc;
  },
  {} as Record<string, number>
);

/**
 * Business rule: a thread with an unread message or a still-open offer is not
 * safe to bulk-archive yet (the buyer/seller is actively waiting on a reply).
 * Returns a short, specific reason, or null when the thread is archivable.
 */
export function getArchiveLockReason(thread: ConversationThread): string | null {
  if (thread.hasUnreadMessage && thread.hasOpenOffer) {
    return "Unread reply and an open offer";
  }
  if (thread.hasUnreadMessage) {
    return "Unread reply";
  }
  if (thread.hasOpenOffer) {
    return "Offer awaiting response";
  }
  return null;
}

export function formatWon(amount: number): string {
  return `₩${amount.toLocaleString("en-US")}`;
}
