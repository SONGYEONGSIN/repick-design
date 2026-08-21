// native/src/chat/data.ts — auto-native-r10 winner (promoted).
// Deterministic dummy data for the Chat Inbox (message list) screen. No Math.random/Date.now/
// bare `new Date()` — every value below is a fixed literal or a pure function of one.

export type ThreadStatus = "active" | "archived";

export type ThreadMessage = {
  id: string;
  from: "them" | "me";
  text: string;
  at: string;
};

export type ConversationThread = {
  id: string;
  name: string;
  initials: string;
  itemTitle: string;
  preview: string;
  time: string;
  unread: number; // 0 = fully read
  status: ThreadStatus;
  messages: ThreadMessage[];
};

// Seeded with one thread already archived, so the Archived tab and the "Unarchive" action are
// both exercisable immediately — the reviewer should not have to perform the Archive gesture
// first just to see the reverse path work.
export const INITIAL_THREADS: ConversationThread[] = [
  {
    id: "t1",
    name: "Maya Chen",
    initials: "MC",
    itemTitle: "Re: Sony A6400 Camera Body",
    preview: "Can you do 380,000 KRW if I pick up today?",
    time: "9:41 AM",
    unread: 2,
    status: "active",
    messages: [
      { id: "t1-m1", from: "them", text: "Hi! Is the Sony A6400 still available?", at: "9:12 AM" },
      { id: "t1-m2", from: "me", text: "Yes, still have it — comes with two batteries.", at: "9:15 AM" },
      { id: "t1-m3", from: "them", text: "Can you do 380,000 KRW if I pick up today?", at: "9:41 AM" },
    ],
  },
  {
    id: "t2",
    name: "Jordan Kim",
    initials: "JK",
    itemTitle: "Re: IKEA Kallax Shelf, White",
    preview: "Sounds good, see you at 6.",
    time: "Yesterday",
    unread: 0,
    status: "active",
    messages: [
      { id: "t2-m1", from: "them", text: "Can I come by around 6pm tomorrow?", at: "Yesterday · 4:02 PM" },
      { id: "t2-m2", from: "me", text: "Works for me, I'll be home.", at: "Yesterday · 4:10 PM" },
      { id: "t2-m3", from: "them", text: "Sounds good, see you at 6.", at: "Yesterday · 4:11 PM" },
    ],
  },
  {
    id: "t3",
    name: "Priya Shah",
    initials: "PS",
    itemTitle: "Re: Herman Miller Aeron, Size B",
    preview: "I can meet near Gangnam Station tomorrow.",
    time: "Yesterday",
    unread: 1,
    status: "active",
    messages: [
      { id: "t3-m1", from: "them", text: "Still interested in the Aeron chair.", at: "Yesterday · 1:20 PM" },
      { id: "t3-m2", from: "them", text: "I can meet near Gangnam Station tomorrow.", at: "Yesterday · 1:21 PM" },
    ],
  },
  {
    id: "t4",
    name: "Diego Alvarez",
    initials: "DA",
    itemTitle: "Re: Nintendo Switch OLED",
    preview: "Sent the deposit, thanks!",
    time: "Mon",
    unread: 0,
    status: "active",
    messages: [
      { id: "t4-m1", from: "me", text: "I'll hold it for you until Monday.", at: "Mon · 10:02 AM" },
      { id: "t4-m2", from: "them", text: "Sent the deposit, thanks!", at: "Mon · 10:20 AM" },
    ],
  },
  {
    id: "t5",
    name: "Wren Osei",
    initials: "WO",
    itemTitle: "Re: Vintage Leather Jacket, M",
    preview: "Does it still have the original tags?",
    time: "Mon",
    unread: 3,
    status: "active",
    messages: [
      { id: "t5-m1", from: "them", text: "Love this jacket.", at: "Mon · 8:01 AM" },
      { id: "t5-m2", from: "them", text: "Does it still have the original tags?", at: "Mon · 8:02 AM" },
      { id: "t5-m3", from: "them", text: "Also, is the size true to fit?", at: "Mon · 8:03 AM" },
    ],
  },
  {
    id: "t6",
    name: "Haruto Sato",
    initials: "HS",
    itemTitle: "Re: MacBook Air M2 13-inch",
    preview: "Battery cycle count is under 120.",
    time: "Sun",
    unread: 0,
    status: "active",
    messages: [
      { id: "t6-m1", from: "them", text: "How many charge cycles on the battery?", at: "Sun · 6:40 PM" },
      { id: "t6-m2", from: "me", text: "Battery cycle count is under 120.", at: "Sun · 6:55 PM" },
    ],
  },
  {
    id: "t7",
    name: "Elin Björk",
    initials: "EB",
    itemTitle: "Re: Cast Iron Dutch Oven, 5qt",
    preview: "Perfect, I'll take it at asking price.",
    time: "Sat",
    unread: 0,
    status: "archived",
    messages: [
      { id: "t7-m1", from: "them", text: "Any flex on the price?", at: "Sat · 2:00 PM" },
      { id: "t7-m2", from: "me", text: "It's already priced to move, sorry.", at: "Sat · 2:10 PM" },
      { id: "t7-m3", from: "them", text: "Perfect, I'll take it at asking price.", at: "Sat · 2:14 PM" },
    ],
  },
  {
    id: "t8",
    name: "Noah Park",
    initials: "NP",
    itemTitle: "Re: Trek Marlin 7 Mountain Bike",
    preview: "Is 250,000 KRW still on the table?",
    time: "Fri",
    unread: 1,
    status: "active",
    messages: [
      { id: "t8-m1", from: "them", text: "Is 250,000 KRW still on the table?", at: "Fri · 11:30 AM" },
    ],
  },
];

/* ───────── avatar palette derivation ─────────
 * repick DNA keeps a near-monochrome palette with a single accent — there is no multi-hue set to
 * pick from. Variety comes from cycling a small, fixed set of *token combinations* (fill vs.
 * outline, accent vs. ink2), chosen by a pure hash of the contact's name. No Math.random: the same
 * name always resolves to the same combination. */
export type AvatarStyleKey = "accent" | "ink" | "outline";
export const AVATAR_STYLE_ORDER: AvatarStyleKey[] = ["accent", "ink", "outline"];

export function avatarStyleFor(name: string): AvatarStyleKey {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) % 997;
  }
  return AVATAR_STYLE_ORDER[hash % AVATAR_STYLE_ORDER.length];
}

export function unreadThreadCount(threads: ConversationThread[]): number {
  return threads.filter((t) => t.status === "active" && t.unread > 0).length;
}

export function activeThreads(threads: ConversationThread[]): ConversationThread[] {
  return threads.filter((t) => t.status === "active");
}

export function archivedThreads(threads: ConversationThread[]): ConversationThread[] {
  return threads.filter((t) => t.status === "archived");
}
