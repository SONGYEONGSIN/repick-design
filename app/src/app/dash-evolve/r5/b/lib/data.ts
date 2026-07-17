// Deterministic dummy data for Quay — a shared support inbox for Fernbank
// Outfitters, an outdoor apparel & gear retailer. No Math.random / Date.now.
// "Today" in this fixture is fixed at Jul 17, 2026.

export type Channel = "email" | "chat" | "sms";
export type Status = "open" | "pending" | "resolved";
export type Priority = "urgent" | "normal";
export type QueueId =
  | "inbox"
  | "mine"
  | "unassigned"
  | "urgent"
  | "pending"
  | "resolved"
  | "archived";

export interface Agent {
  id: string;
  name: string;
  role: string;
  avatarId: string;
  initials: string;
}

export interface Ticket {
  id: string;
  subject: string;
  status: Status;
  date: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  avatarId: string;
  tier: string;
  ltv: number;
  memberSince: string;
  orders: number;
  tags: string[];
  previousTickets: Ticket[];
  responseTrend: { label: string; hours: number }[];
}

export interface Message {
  id: string;
  from: "customer" | "agent";
  authorName: string;
  body: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  customerId: string;
  subject: string;
  channel: Channel;
  status: Status;
  priority: Priority;
  assigneeId: string | null;
  unread: boolean;
  archived: boolean;
  timestamp: string;
  sortRank: number;
  messages: Message[];
}

export const BRAND = { name: "Quay" };

export const WORKSPACES = [
  { id: "ws-fernbank", name: "Fernbank Outfitters", plan: "Growth plan" },
  { id: "ws-solstice", name: "Solstice Bikes", plan: "Starter plan" },
];

export const WORKSPACE = WORKSPACES[0];

export const CURRENT_AGENT_ID = "a-dana";

export const AGENTS: Agent[] = [
  {
    id: "a-dana",
    name: "Dana Whitfield",
    role: "Support Lead",
    avatarId: "1500648767791-00dcc994a43e",
    initials: "DW",
  },
  {
    id: "a-marcus",
    name: "Marcus Webb",
    role: "Support Agent",
    avatarId: "1472099645785-5658abf4ff4e",
    initials: "MW",
  },
  {
    id: "a-priya",
    name: "Priya Anand",
    role: "Support Agent",
    avatarId: "1544005313-94ddf0286df2",
    initials: "PA",
  },
  {
    id: "a-theo",
    name: "Theo Lindqvist",
    role: "Support Agent",
    avatarId: "1519085360753-af0119f7cbe7",
    initials: "TL",
  },
  {
    id: "a-naomi",
    name: "Naomi Cruz",
    role: "Support Agent",
    avatarId: "1438761681033-6461ffad8d80",
    initials: "NC",
  },
];

export function agentById(id: string | null | undefined): Agent | undefined {
  if (!id) return undefined;
  return AGENTS.find((a) => a.id === id);
}

export const CUSTOMERS: Customer[] = [
  {
    id: "c-wren",
    name: "Wren Ashcroft",
    email: "wren.ashcroft@maildrift.com",
    avatarId: "1554151228-14d9def656e4",
    tier: "Trailhead Gold",
    ltv: 2840,
    memberSince: "Mar 2022",
    orders: 19,
    tags: ["Repeat customer", "High LTV"],
    previousTickets: [
      { id: "T-2091", subject: "Wrong tracking number on order #47122", status: "resolved", date: "May 3, 2026" },
      { id: "T-1876", subject: "Discount code question", status: "resolved", date: "Jan 22, 2026" },
    ],
    responseTrend: [
      { label: "Mon", hours: 3.2 },
      { label: "Tue", hours: 2.1 },
      { label: "Wed", hours: 4.6 },
      { label: "Thu", hours: 1.8 },
      { label: "Fri", hours: 2.4 },
      { label: "Sat", hours: 5.1 },
      { label: "Sun", hours: 2.9 },
    ],
  },
  {
    id: "c-callum",
    name: "Callum Doyle",
    email: "callum.doyle@postveil.io",
    avatarId: "1506794778202-cad84cf45f1d",
    tier: "Trailhead Silver",
    ltv: 640,
    memberSince: "Sep 2024",
    orders: 5,
    tags: ["Sizing issue"],
    previousTickets: [{ id: "T-1690", subject: "Exchange for smaller boot size", status: "resolved", date: "Nov 8, 2025" }],
    responseTrend: [
      { label: "Mon", hours: 6.4 },
      { label: "Tue", hours: 5.9 },
      { label: "Wed", hours: 4.2 },
      { label: "Thu", hours: 7.1 },
      { label: "Fri", hours: 3.8 },
      { label: "Sat", hours: 6.6 },
      { label: "Sun", hours: 5.0 },
    ],
  },
  {
    id: "c-ingrid",
    name: "Ingrid Voss",
    email: "ingrid.voss@relaymail.net",
    avatarId: "1531123897727-8f129e1688ce",
    tier: "Trailhead Silver",
    ltv: 410,
    memberSince: "Jun 2025",
    orders: 3,
    tags: ["Return in progress"],
    previousTickets: [{ id: "T-2210", subject: "Thank-you note after resolved return", status: "resolved", date: "Jul 10, 2026" }],
    responseTrend: [
      { label: "Mon", hours: 2.0 },
      { label: "Tue", hours: 3.3 },
      { label: "Wed", hours: 2.6 },
      { label: "Thu", hours: 2.2 },
      { label: "Fri", hours: 1.9 },
      { label: "Sat", hours: 3.0 },
      { label: "Sun", hours: 2.4 },
    ],
  },
  {
    id: "c-malik",
    name: "Malik Osei",
    email: "malik.osei@fieldpost.co",
    avatarId: "1441974231531-c6227db76b6e",
    tier: "Trailhead Gold",
    ltv: 1975,
    memberSince: "Feb 2023",
    orders: 14,
    tags: ["Loyalty program", "Repeat customer"],
    previousTickets: [
      { id: "T-1954", subject: "Points not credited for referral", status: "resolved", date: "Feb 14, 2026" },
      { id: "T-1622", subject: "App crashes on checkout", status: "resolved", date: "Oct 2, 2025" },
    ],
    responseTrend: [
      { label: "Mon", hours: 1.4 },
      { label: "Tue", hours: 1.9 },
      { label: "Wed", hours: 2.3 },
      { label: "Thu", hours: 1.6 },
      { label: "Fri", hours: 2.0 },
      { label: "Sat", hours: 2.8 },
      { label: "Sun", hours: 1.7 },
    ],
  },
  {
    id: "c-fiona",
    name: "Fiona Beaumont",
    email: "fiona.beaumont@northglade.org",
    avatarId: "1502082553048-f009c37129b9",
    tier: "Trailhead Silver",
    ltv: 895,
    memberSince: "Aug 2024",
    orders: 6,
    tags: ["Damaged item", "Escalated"],
    previousTickets: [{ id: "T-2140", subject: "Late delivery compensation request", status: "resolved", date: "Jun 1, 2026" }],
    responseTrend: [
      { label: "Mon", hours: 4.0 },
      { label: "Tue", hours: 3.6 },
      { label: "Wed", hours: 5.2 },
      { label: "Thu", hours: 3.1 },
      { label: "Fri", hours: 4.4 },
      { label: "Sat", hours: 4.9 },
      { label: "Sun", hours: 3.7 },
    ],
  },
  {
    id: "c-ezra",
    name: "Ezra Lindholm",
    email: "ezra.lindholm@quietloop.dev",
    avatarId: "1476820865390-c52aeebb9891",
    tier: "Trailhead Silver",
    ltv: 320,
    memberSince: "Apr 2025",
    orders: 2,
    tags: ["Promo inquiry"],
    previousTickets: [],
    responseTrend: [
      { label: "Mon", hours: 2.6 },
      { label: "Tue", hours: 2.2 },
      { label: "Wed", hours: 1.8 },
      { label: "Thu", hours: 2.9 },
      { label: "Fri", hours: 2.1 },
      { label: "Sat", hours: 1.6 },
      { label: "Sun", hours: 2.3 },
    ],
  },
  {
    id: "c-priyanka",
    name: "Priyanka Desai",
    email: "priyanka.desai@harborline.app",
    avatarId: "1449158743715-0a90ebb6d2d8",
    tier: "Trailhead Gold",
    ltv: 3120,
    memberSince: "Dec 2021",
    orders: 26,
    tags: ["VIP", "Repeat customer", "High LTV"],
    previousTickets: [
      { id: "T-2277", subject: "Store pickup hours question", status: "resolved", date: "Jul 5, 2026" },
      { id: "T-1988", subject: "Membership renewal invoice", status: "resolved", date: "Mar 18, 2026" },
    ],
    responseTrend: [
      { label: "Mon", hours: 0.9 },
      { label: "Tue", hours: 1.2 },
      { label: "Wed", hours: 0.8 },
      { label: "Thu", hours: 1.5 },
      { label: "Fri", hours: 1.1 },
      { label: "Sat", hours: 1.8 },
      { label: "Sun", hours: 1.0 },
    ],
  },
  {
    id: "c-soren",
    name: "Soren Vance",
    email: "soren.vance@brindlepost.com",
    avatarId: "1560250097-0b93528c311a",
    tier: "Trailhead Silver",
    ltv: 505,
    memberSince: "Jan 2025",
    orders: 4,
    tags: ["Billing"],
    previousTickets: [],
    responseTrend: [
      { label: "Mon", hours: 3.4 },
      { label: "Tue", hours: 4.1 },
      { label: "Wed", hours: 2.9 },
      { label: "Thu", hours: 3.7 },
      { label: "Fri", hours: 3.0 },
      { label: "Sat", hours: 4.4 },
      { label: "Sun", hours: 3.2 },
    ],
  },
  {
    id: "c-layla",
    name: "Layla Farouk",
    email: "layla.farouk@thornmail.co",
    avatarId: "1519244703995-f4e0f30006d5",
    tier: "Trailhead Gold",
    ltv: 2210,
    memberSince: "Jul 2022",
    orders: 17,
    tags: ["Warranty", "Repeat customer"],
    previousTickets: [{ id: "T-1799", subject: "Zipper replacement under warranty", status: "resolved", date: "Sep 30, 2025" }],
    responseTrend: [
      { label: "Mon", hours: 2.7 },
      { label: "Tue", hours: 3.1 },
      { label: "Wed", hours: 2.4 },
      { label: "Thu", hours: 2.9 },
      { label: "Fri", hours: 2.0 },
      { label: "Sat", hours: 3.6 },
      { label: "Sun", hours: 2.5 },
    ],
  },
  {
    id: "c-grace",
    name: "Grace Kowalski",
    email: "grace.kowalski@fernway.mail",
    avatarId: "1607746882042-944635dfe10e",
    tier: "Trailhead Silver",
    ltv: 780,
    memberSince: "Oct 2024",
    orders: 7,
    tags: ["Shipping"],
    previousTickets: [],
    responseTrend: [
      { label: "Mon", hours: 4.8 },
      { label: "Tue", hours: 3.9 },
      { label: "Wed", hours: 5.4 },
      { label: "Thu", hours: 4.1 },
      { label: "Fri", hours: 3.5 },
      { label: "Sat", hours: 4.6 },
      { label: "Sun", hours: 4.0 },
    ],
  },
  {
    id: "c-tomas",
    name: "Tomas Reyes",
    email: "tomas.reyes@driftbox.net",
    avatarId: "1534528741775-53994a69daeb",
    tier: "Trailhead Silver",
    ltv: 355,
    memberSince: "May 2025",
    orders: 3,
    tags: ["Billing", "Escalated"],
    previousTickets: [],
    responseTrend: [
      { label: "Mon", hours: 1.7 },
      { label: "Tue", hours: 2.4 },
      { label: "Wed", hours: 1.9 },
      { label: "Thu", hours: 2.6 },
      { label: "Fri", hours: 1.5 },
      { label: "Sat", hours: 2.2 },
      { label: "Sun", hours: 1.8 },
    ],
  },
  {
    id: "c-amara",
    name: "Amara Chukwu",
    email: "amara.chukwu@glenpost.io",
    avatarId: "1487412720507-e7ab37603c6f",
    tier: "Trailhead Gold",
    ltv: 1640,
    memberSince: "Nov 2023",
    orders: 12,
    tags: ["Price match", "Repeat customer"],
    previousTickets: [{ id: "T-2033", subject: "Order confirmation never arrived", status: "resolved", date: "Apr 27, 2026" }],
    responseTrend: [
      { label: "Mon", hours: 2.2 },
      { label: "Tue", hours: 1.8 },
      { label: "Wed", hours: 2.6 },
      { label: "Thu", hours: 2.0 },
      { label: "Fri", hours: 1.6 },
      { label: "Sat", hours: 2.9 },
      { label: "Sun", hours: 2.1 },
    ],
  },
];

export function customerById(id: string): Customer {
  const c = CUSTOMERS.find((x) => x.id === id);
  if (!c) throw new Error(`Unknown customer ${id}`);
  return c;
}

export const CONVERSATIONS: Conversation[] = [
  {
    id: "conv-001",
    customerId: "c-wren",
    subject: "Order #48291 hasn't shipped",
    channel: "email",
    status: "open",
    priority: "urgent",
    assigneeId: "a-dana",
    unread: true,
    archived: false,
    timestamp: "9:41 AM",
    sortRank: 16,
    messages: [
      {
        id: "m1",
        from: "customer",
        authorName: "Wren Ashcroft",
        body: "Hi — I placed order #48291 four days ago and it's still showing \"processing\". I need the tent for a trip this weekend. Can someone check on this?",
        timestamp: "Jul 17, 9:12 AM",
      },
      {
        id: "m2",
        from: "agent",
        authorName: "Dana Whitfield",
        body: "Hi Wren, sorry for the delay — looking into your order right now. One moment.",
        timestamp: "Jul 17, 9:20 AM",
      },
      {
        id: "m3",
        from: "customer",
        authorName: "Wren Ashcroft",
        body: "Thank you, I really appreciate it. The trip is Saturday morning so any update helps.",
        timestamp: "Jul 17, 9:41 AM",
      },
    ],
  },
  {
    id: "conv-002",
    customerId: "c-callum",
    subject: "Wrong size sent for the Ridgeline jacket",
    channel: "email",
    status: "pending",
    priority: "normal",
    assigneeId: "a-marcus",
    unread: false,
    archived: false,
    timestamp: "8:05 AM",
    sortRank: 15,
    messages: [
      {
        id: "m1",
        from: "customer",
        authorName: "Callum Doyle",
        body: "The Ridgeline jacket I received is a size M, but I ordered a size L. Could I get the correct size sent out?",
        timestamp: "Jul 17, 7:48 AM",
      },
      {
        id: "m2",
        from: "agent",
        authorName: "Marcus Webb",
        body: "Sorry about that, Callum — I've queued a replacement in size L with a prepaid return label for the M. You'll get a shipping confirmation shortly.",
        timestamp: "Jul 17, 8:05 AM",
      },
    ],
  },
  {
    id: "conv-003",
    customerId: "c-ingrid",
    subject: "Return label link is broken",
    channel: "chat",
    status: "open",
    priority: "urgent",
    assigneeId: null,
    unread: true,
    archived: false,
    timestamp: "Yesterday",
    sortRank: 14,
    messages: [
      {
        id: "m1",
        from: "customer",
        authorName: "Ingrid Voss",
        body: "The return label link in my confirmation email 404s. I need to send back a pair of boots before the 30-day window closes on Sunday.",
        timestamp: "Jul 16, 5:02 PM",
      },
    ],
  },
  {
    id: "conv-004",
    customerId: "c-malik",
    subject: "Loyalty points missing after order",
    channel: "email",
    status: "open",
    priority: "normal",
    assigneeId: "a-priya",
    unread: false,
    archived: false,
    timestamp: "Yesterday",
    sortRank: 13,
    messages: [
      {
        id: "m1",
        from: "customer",
        authorName: "Malik Osei",
        body: "My last order (order #47960) should have earned 240 Trailhead points but my balance hasn't moved. Can you check?",
        timestamp: "Jul 16, 2:11 PM",
      },
      {
        id: "m2",
        from: "agent",
        authorName: "Priya Anand",
        body: "Thanks for flagging, Malik. Points usually post within 3 business days of delivery — your order delivered yesterday, so it should land by Friday. I'll keep an eye on it.",
        timestamp: "Jul 16, 2:40 PM",
      },
    ],
  },
  {
    id: "conv-005",
    customerId: "c-fiona",
    subject: "Damaged item arrived — trail pack torn",
    channel: "email",
    status: "open",
    priority: "urgent",
    assigneeId: "a-dana",
    unread: true,
    archived: false,
    timestamp: "Yesterday",
    sortRank: 12,
    messages: [
      {
        id: "m1",
        from: "customer",
        authorName: "Fiona Beaumont",
        body: "The 42L trail pack arrived with a large tear along the bottom seam. Photos attached. I'd like a replacement rather than a refund if possible.",
        timestamp: "Jul 16, 11:22 AM",
      },
      {
        id: "m2",
        from: "agent",
        authorName: "Dana Whitfield",
        body: "So sorry to see that, Fiona — thanks for the photos. Replacement is no problem; I'm shipping it out with expedited delivery at no cost.",
        timestamp: "Jul 16, 11:50 AM",
      },
      {
        id: "m3",
        from: "customer",
        authorName: "Fiona Beaumont",
        body: "That's great, thank you. One more thing — could you also confirm the return label for the damaged one is prepaid?",
        timestamp: "Jul 16, 12:03 PM",
      },
    ],
  },
  {
    id: "conv-006",
    customerId: "c-ezra",
    subject: "Can I combine two discount codes?",
    channel: "chat",
    status: "resolved",
    priority: "normal",
    assigneeId: "a-theo",
    unread: false,
    archived: false,
    timestamp: "Jul 15",
    sortRank: 11,
    messages: [
      {
        id: "m1",
        from: "customer",
        authorName: "Ezra Lindholm",
        body: "Can I stack the WELCOME10 code with the current summer sale?",
        timestamp: "Jul 15, 3:14 PM",
      },
      {
        id: "m2",
        from: "agent",
        authorName: "Theo Lindqvist",
        body: "Unfortunately only one promo code can apply per order, but the summer sale discount is larger — I'd recommend using that one.",
        timestamp: "Jul 15, 3:20 PM",
      },
      {
        id: "m3",
        from: "customer",
        authorName: "Ezra Lindholm",
        body: "Got it, thanks for clarifying!",
        timestamp: "Jul 15, 3:22 PM",
      },
    ],
  },
  {
    id: "conv-007",
    customerId: "c-priyanka",
    subject: "Store pickup order still shows processing",
    channel: "sms",
    status: "pending",
    priority: "normal",
    assigneeId: "a-naomi",
    unread: true,
    archived: false,
    timestamp: "Jul 15",
    sortRank: 10,
    messages: [
      {
        id: "m1",
        from: "customer",
        authorName: "Priyanka Desai",
        body: "Order #48117 was supposed to be ready for pickup at the Denver store this morning but the app still says processing.",
        timestamp: "Jul 15, 10:05 AM",
      },
      {
        id: "m2",
        from: "agent",
        authorName: "Naomi Cruz",
        body: "Checking with the Denver store now — I'll update you within the hour.",
        timestamp: "Jul 15, 10:18 AM",
      },
    ],
  },
  {
    id: "conv-008",
    customerId: "c-soren",
    subject: "Gift card balance not applying at checkout",
    channel: "email",
    status: "open",
    priority: "normal",
    assigneeId: null,
    unread: true,
    archived: false,
    timestamp: "Jul 14",
    sortRank: 9,
    messages: [
      {
        id: "m1",
        from: "customer",
        authorName: "Soren Vance",
        body: "I have $45 on a gift card but checkout won't apply it — I get a generic error. Could you take a look?",
        timestamp: "Jul 14, 4:37 PM",
      },
    ],
  },
  {
    id: "conv-009",
    customerId: "c-layla",
    subject: "Warranty claim for boot sole separation",
    channel: "email",
    status: "open",
    priority: "urgent",
    assigneeId: "a-dana",
    unread: false,
    archived: false,
    timestamp: "Jul 14",
    sortRank: 8,
    messages: [
      {
        id: "m1",
        from: "customer",
        authorName: "Layla Farouk",
        body: "The sole on my Summit GTX boots is separating after 8 months of light use. These should be covered under the 2-year warranty.",
        timestamp: "Jul 14, 9:02 AM",
      },
      {
        id: "m2",
        from: "agent",
        authorName: "Dana Whitfield",
        body: "That's definitely covered, Layla. Could you send a couple photos of the separation and your order number so I can start the claim?",
        timestamp: "Jul 14, 9:30 AM",
      },
      {
        id: "m3",
        from: "customer",
        authorName: "Layla Farouk",
        body: "Sending photos now — order number is #46850.",
        timestamp: "Jul 14, 9:44 AM",
      },
    ],
  },
  {
    id: "conv-010",
    customerId: "c-grace",
    subject: "Change shipping address before dispatch",
    channel: "chat",
    status: "pending",
    priority: "normal",
    assigneeId: "a-marcus",
    unread: false,
    archived: false,
    timestamp: "Jul 13",
    sortRank: 7,
    messages: [
      {
        id: "m1",
        from: "customer",
        authorName: "Grace Kowalski",
        body: "I need to change the shipping address on order #48055 — I moved and forgot to update it. Is it still possible?",
        timestamp: "Jul 13, 1:19 PM",
      },
      {
        id: "m2",
        from: "agent",
        authorName: "Marcus Webb",
        body: "It hasn't left the warehouse yet, so I can update it. What's the new address?",
        timestamp: "Jul 13, 1:26 PM",
      },
    ],
  },
  {
    id: "conv-011",
    customerId: "c-tomas",
    subject: "Subscription renewal charged twice",
    channel: "email",
    status: "open",
    priority: "urgent",
    assigneeId: null,
    unread: true,
    archived: false,
    timestamp: "Jul 13",
    sortRank: 6,
    messages: [
      {
        id: "m1",
        from: "customer",
        authorName: "Tomas Reyes",
        body: "My Trailhead membership renewal was charged twice this month — $89.00 on the 10th and again on the 12th. Please refund the duplicate.",
        timestamp: "Jul 13, 8:51 AM",
      },
    ],
  },
  {
    id: "conv-012",
    customerId: "c-amara",
    subject: "Price match request for rain shell",
    channel: "email",
    status: "resolved",
    priority: "normal",
    assigneeId: "a-priya",
    unread: false,
    archived: false,
    timestamp: "Jul 11",
    sortRank: 5,
    messages: [
      {
        id: "m1",
        from: "customer",
        authorName: "Amara Chukwu",
        body: "A competitor has the Alpenglow rain shell $20 cheaper this week — could you price match?",
        timestamp: "Jul 11, 6:40 PM",
      },
      {
        id: "m2",
        from: "agent",
        authorName: "Priya Anand",
        body: "Confirmed and applied a $20 credit to your account. It'll show on your next order automatically.",
        timestamp: "Jul 11, 7:02 PM",
      },
    ],
  },
  {
    id: "conv-013",
    customerId: "c-wren",
    subject: "Backorder ETA on trekking poles",
    channel: "email",
    status: "pending",
    priority: "normal",
    assigneeId: "a-dana",
    unread: false,
    archived: false,
    timestamp: "Jul 10",
    sortRank: 4,
    messages: [
      {
        id: "m1",
        from: "customer",
        authorName: "Wren Ashcroft",
        body: "The carbon trekking poles I ordered show a backorder note now — any sense of when they'll ship?",
        timestamp: "Jul 10, 2:15 PM",
      },
      {
        id: "m2",
        from: "agent",
        authorName: "Dana Whitfield",
        body: "Checking with the warehouse — restock is expected the week of the 21st, so it should ship soon after.",
        timestamp: "Jul 10, 2:50 PM",
      },
    ],
  },
  {
    id: "conv-014",
    customerId: "c-ingrid",
    subject: "Thank you for the fast return help",
    channel: "chat",
    status: "resolved",
    priority: "normal",
    assigneeId: "a-theo",
    unread: false,
    archived: true,
    timestamp: "Jul 10",
    sortRank: 3,
    messages: [
      {
        id: "m1",
        from: "customer",
        authorName: "Ingrid Voss",
        body: "Just wanted to say thanks for turning around my earlier return so quickly!",
        timestamp: "Jul 10, 10:00 AM",
      },
      {
        id: "m2",
        from: "agent",
        authorName: "Theo Lindqvist",
        body: "Happy to help, Ingrid — have a great trip!",
        timestamp: "Jul 10, 10:05 AM",
      },
    ],
  },
  {
    id: "conv-015",
    customerId: "c-callum",
    subject: "Exchange for smaller boot size",
    channel: "email",
    status: "resolved",
    priority: "normal",
    assigneeId: "a-marcus",
    unread: false,
    archived: true,
    timestamp: "Jul 9",
    sortRank: 2,
    messages: [
      {
        id: "m1",
        from: "customer",
        authorName: "Callum Doyle",
        body: "Could I exchange my boots for half a size down?",
        timestamp: "Jul 9, 3:30 PM",
      },
      {
        id: "m2",
        from: "agent",
        authorName: "Marcus Webb",
        body: "Exchange is confirmed and on its way — no need to wait for the return to arrive first.",
        timestamp: "Jul 9, 3:55 PM",
      },
    ],
  },
  {
    id: "conv-016",
    customerId: "c-malik",
    subject: "App login issue after password reset",
    channel: "chat",
    status: "open",
    priority: "normal",
    assigneeId: null,
    unread: true,
    archived: false,
    timestamp: "Jul 9",
    sortRank: 1,
    messages: [
      {
        id: "m1",
        from: "customer",
        authorName: "Malik Osei",
        body: "I reset my password but the app still won't let me log in — it just spins on the loading screen.",
        timestamp: "Jul 9, 8:12 AM",
      },
    ],
  },
];

export function conversationById(id: string): Conversation | undefined {
  return CONVERSATIONS.find((c) => c.id === id);
}

export interface QueueDef {
  id: QueueId;
  label: string;
}

export const QUEUE_DEFS: QueueDef[] = [
  { id: "inbox", label: "Inbox" },
  { id: "mine", label: "Assigned to me" },
  { id: "unassigned", label: "Unassigned" },
  { id: "urgent", label: "Urgent" },
  { id: "pending", label: "Pending" },
  { id: "resolved", label: "Resolved" },
  { id: "archived", label: "Archived" },
];

export function matchesQueue(conv: Conversation, queueId: QueueId): boolean {
  switch (queueId) {
    case "inbox":
      return !conv.archived && conv.status !== "resolved";
    case "mine":
      return !conv.archived && conv.assigneeId === CURRENT_AGENT_ID;
    case "unassigned":
      return !conv.archived && conv.assigneeId === null;
    case "urgent":
      return !conv.archived && conv.priority === "urgent";
    case "pending":
      return !conv.archived && conv.status === "pending";
    case "resolved":
      return !conv.archived && conv.status === "resolved";
    case "archived":
      return conv.archived;
    default:
      return false;
  }
}

export function queueCounts(conversations: Conversation[]): Record<QueueId, { total: number; unread: number }> {
  const result = {} as Record<QueueId, { total: number; unread: number }>;
  for (const q of QUEUE_DEFS) {
    const matches = conversations.filter((c) => matchesQueue(c, q.id));
    result[q.id] = { total: matches.length, unread: matches.filter((c) => c.unread).length };
  }
  return result;
}
