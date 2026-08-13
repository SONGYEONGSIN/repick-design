// native/src/evolve/r4/b/data.ts — auto-native-r4 candidate b: Notifications / Activity feed.
// Deterministic dummy data only — fixed strings, no Math.random/Date.now/argless new Date().

export type NotificationType = "priceDrop" | "offer" | "message" | "savedSearch" | "handoff";

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  source: string;
  time: string;
  read: boolean;
}

export interface TypeMeta {
  label: string;
  monogram: string;
}

// Monogram tags distinguish notification type by label + shape, not by hue — near-monochrome DNA
// keeps every badge on the same ink/border palette; only the read/unread cue uses the single accent.
export const TYPE_META: Record<NotificationType, TypeMeta> = {
  priceDrop: { label: "Price drop", monogram: "PD" },
  offer: { label: "Offer", monogram: "OF" },
  message: { label: "Message", monogram: "MS" },
  savedSearch: { label: "Saved search", monogram: "SS" },
  handoff: { label: "Handoff", monogram: "HC" },
};

export interface CategoryFilter {
  key: NotificationType | "all";
  label: string;
}

export const CATEGORY_FILTERS: CategoryFilter[] = [
  { key: "all", label: "All" },
  { key: "priceDrop", label: "Price drops" },
  { key: "offer", label: "Offers" },
  { key: "message", label: "Messages" },
  { key: "savedSearch", label: "Saved search" },
  { key: "handoff", label: "Handoff" },
];

// Reverse-chronological, fixed relative-time strings (not computed from a real clock).
export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: "n1",
    type: "priceDrop",
    title: "Price dropped on Sony WH-1000XM4",
    body: "Now ₩185,000 — down from ₩220,000 (15% off).",
    source: "Watchlist",
    time: "2m ago",
    read: false,
  },
  {
    id: "n2",
    type: "offer",
    title: "New offer on your iPad Air listing",
    body: "Buyer offered ₩420,000 for iPad Air (64GB, 2020).",
    source: "Offer thread",
    time: "12m ago",
    read: false,
  },
  {
    id: "n3",
    type: "message",
    title: "New message from minji_kim",
    body: "“Is the leather jacket still available in size M?”",
    source: "Negotiation",
    time: "34m ago",
    read: false,
  },
  {
    id: "n4",
    type: "savedSearch",
    title: "New match for “Nintendo Switch OLED”",
    body: "A listing just matched your saved search — ₩265,000, like new.",
    source: "Saved search",
    time: "1h ago",
    read: false,
  },
  {
    id: "n5",
    type: "handoff",
    title: "Handoff reminder: meet at Gangnam Station",
    body: "Your meetup for the desk lamp is scheduled today at 6:00 PM.",
    source: "Handoff check",
    time: "2h ago",
    read: true,
  },
  {
    id: "n6",
    type: "offer",
    title: "Offer accepted: Herman Miller chair",
    body: "You accepted ₩310,000 from buyer jaeho92.",
    source: "Offer thread",
    time: "5h ago",
    read: true,
  },
  {
    id: "n7",
    type: "priceDrop",
    title: "Price dropped on Canon EOS M50",
    body: "Now ₩410,000 — down from ₩460,000 (11% off).",
    source: "Watchlist",
    time: "Yesterday",
    read: true,
  },
  {
    id: "n8",
    type: "message",
    title: "New message from seller_hana",
    body: "“I can do ₩15,000 off if you pick up today.”",
    source: "Negotiation",
    time: "Yesterday",
    read: true,
  },
  {
    id: "n9",
    type: "handoff",
    title: "Handoff confirmed: bookshelf",
    body: "Both sides confirmed the handoff at Yeoksam Park.",
    source: "Handoff check",
    time: "2d ago",
    read: true,
  },
  {
    id: "n10",
    type: "savedSearch",
    title: "New match for “MacBook Pro 14 M2”",
    body: "A listing just matched your saved search — ₩1,450,000, 92% battery health.",
    source: "Saved search",
    time: "3d ago",
    read: true,
  },
  {
    id: "n11",
    type: "offer",
    title: "New offer on your road bike listing",
    body: "Buyer offered ₩280,000 for the Trek road bike.",
    source: "Offer thread",
    time: "4d ago",
    read: true,
  },
  {
    id: "n12",
    type: "priceDrop",
    title: "Price dropped on Dyson V8 vacuum",
    body: "Now ₩195,000 — down from ₩230,000 (15% off).",
    source: "Watchlist",
    time: "5d ago",
    read: true,
  },
  {
    id: "n13",
    type: "message",
    title: "New message from resell_junho",
    body: "“Sent — thanks for the quick reply.”",
    source: "Negotiation",
    time: "1w ago",
    read: true,
  },
  {
    id: "n14",
    type: "handoff",
    title: "Handoff reminder: coffee grinder",
    body: "Meetup scheduled for tomorrow at Hongdae.",
    source: "Handoff check",
    time: "1w ago",
    read: true,
  },
];

export function unreadCount(items: AppNotification[]): number {
  return items.filter((n) => !n.read).length;
}
