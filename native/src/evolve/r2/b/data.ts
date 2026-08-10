// native/src/evolve/r2/b/data.ts — auto-native-r2 candidate b (AlertsCenter).
// Deterministic dummy data only: fixed values, no Math.random()/Date.now()/argument-less new Date().

export type Category = "price-drop" | "match" | "offer";
export type Filter = "all" | Category;
export type DateGroup = "Today" | "Yesterday" | "This Week";

export type AlertItem = {
  id: string;
  category: Category;
  dateGroup: DateGroup;
  time: string;
  title: string;
  body: string;
  meta: string;
  initialRead: boolean;
};

// Section order top-to-bottom. Fixed — not derived from any live clock.
export const GROUP_ORDER: DateGroup[] = ["Today", "Yesterday", "This Week"];

export const CATEGORY_LABEL: Record<Category, string> = {
  "price-drop": "Price Drops",
  match: "Matches",
  offer: "Offers",
};

// Plain geometric text glyphs (not emoji) — Unicode Geometric Shapes block only.
export const CATEGORY_GLYPH: Record<Category, string> = {
  "price-drop": "▼",
  match: "◆",
  offer: "●",
};

export const ALERTS: AlertItem[] = [
  {
    id: "a1",
    category: "price-drop",
    dateGroup: "Today",
    time: "9:41 AM",
    title: "Nike Air Force 1 '07 dropped 15%",
    body: "Now ₩89,000, down from ₩105,000. Still in your saved size range.",
    meta: "₩89,000 · was ₩105,000",
    initialRead: false,
  },
  {
    id: "a2",
    category: "match",
    dateGroup: "Today",
    time: "8:15 AM",
    title: "New AI match: 92% fit",
    body: "Carhartt WIP Chore Coat — matches your brand and price preferences.",
    meta: "Match score 92",
    initialRead: false,
  },
  {
    id: "a3",
    category: "offer",
    dateGroup: "Today",
    time: "7:52 AM",
    title: "Buyer countered on Levi's 501",
    body: "New offer: ₩46,000 for your Levi's 501, round 2 of the thread.",
    meta: "Offer #2 · ₩46,000",
    initialRead: false,
  },
  {
    id: "a4",
    category: "price-drop",
    dateGroup: "Today",
    time: "6:30 AM",
    title: "Stussy 8 Ball Hoodie dropped 8%",
    body: "Now ₩121,000, down from ₩132,000.",
    meta: "₩121,000 · was ₩132,000",
    initialRead: true,
  },
  {
    id: "a5",
    category: "match",
    dateGroup: "Yesterday",
    time: "Yesterday · 6:05 PM",
    title: "New AI match: 87% fit",
    body: "Patagonia Retro-X Fleece — close to items you saved this week.",
    meta: "Match score 87",
    initialRead: false,
  },
  {
    id: "a6",
    category: "offer",
    dateGroup: "Yesterday",
    time: "Yesterday · 3:12 PM",
    title: "Offer accepted on New Balance 990",
    body: "Your offer of ₩98,000 was accepted. Payout is scheduled.",
    meta: "Offer #1 · ₩98,000",
    initialRead: true,
  },
  {
    id: "a7",
    category: "price-drop",
    dateGroup: "Yesterday",
    time: "Yesterday · 11:20 AM",
    title: "Champion Reverse Weave dropped 5%",
    body: "Now ₩58,000, down from ₩61,000.",
    meta: "₩58,000 · was ₩61,000",
    initialRead: true,
  },
  {
    id: "a8",
    category: "offer",
    dateGroup: "Yesterday",
    time: "Yesterday · 9:00 AM",
    title: "Offer expired on Jordan 1 Mid",
    body: "Offer #1 (₩132,000) expired without a response from the buyer.",
    meta: "Offer #1 · expired",
    initialRead: false,
  },
  {
    id: "a9",
    category: "match",
    dateGroup: "This Week",
    time: "Mon · 4:40 PM",
    title: "New AI match: 81% fit",
    body: "Arc'teryx Beta Jacket — within your size and condition filters.",
    meta: "Match score 81",
    initialRead: true,
  },
  {
    id: "a10",
    category: "price-drop",
    dateGroup: "This Week",
    time: "Mon · 1:15 PM",
    title: "Kith Classic Logo Tee dropped 20%",
    body: "Now ₩36,000, down from ₩45,000.",
    meta: "₩36,000 · was ₩45,000",
    initialRead: true,
  },
  {
    id: "a11",
    category: "offer",
    dateGroup: "This Week",
    time: "Sun · 10:05 AM",
    title: "Buyer countered on Adidas Samba",
    body: "New offer: ₩52,000 for your Adidas Samba, round 3 of the thread.",
    meta: "Offer #3 · ₩52,000",
    initialRead: true,
  },
  {
    id: "a12",
    category: "match",
    dateGroup: "This Week",
    time: "Sun · 8:30 AM",
    title: "New AI match: 76% fit",
    body: "Supreme Box Logo Tee — within your budget range.",
    meta: "Match score 76",
    initialRead: true,
  },
];

export function unreadCount(filter: Filter, readIds: ReadonlySet<string>, dismissedIds: ReadonlySet<string>): number {
  let n = 0;
  for (const a of ALERTS) {
    if (filter !== "all" && a.category !== filter) continue;
    if (dismissedIds.has(a.id)) continue;
    if (readIds.has(a.id)) continue;
    n += 1;
  }
  return n;
}

export function activeCount(filter: Filter, dismissedIds: ReadonlySet<string>): number {
  let n = 0;
  for (const a of ALERTS) {
    if (filter !== "all" && a.category !== filter) continue;
    if (dismissedIds.has(a.id)) continue;
    n += 1;
  }
  return n;
}
