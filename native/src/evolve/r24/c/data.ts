// native/src/evolve/r24/c/data.ts — deterministic dummy data for FollowingFeedScreen.
// No Math.random / Date.now / argument-less `new Date()` anywhere below — every value is a
// fixed literal.

export type FilterKey = "all" | "new" | "ending";

export type Seller = {
  id: string;
  name: string;
  handle: string;
  initials: string;
  listingsCountLabel: string;
  /** Whether this seller is followed in the screen's initial (default) state. */
  followedDefault: boolean;
};

export type FeedTag = "new" | "ending" | "none";

export type FeedItem = {
  id: string;
  sellerId: string;
  title: string;
  brand: string;
  priceKrw: number;
  postedLabel: string;
  tag: FeedTag;
};

export const FILTER_TABS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "new", label: "New Arrivals" },
  { key: "ending", label: "Ending Soon" },
];

export const SELLERS: Seller[] = [
  {
    id: "sel-1",
    name: "Elena Cho",
    handle: "@elenac",
    initials: "EC",
    listingsCountLabel: "24 listings",
    followedDefault: true,
  },
  {
    id: "sel-2",
    name: "Marcus Reed",
    handle: "@marcusreed",
    initials: "MR",
    listingsCountLabel: "9 listings",
    followedDefault: true,
  },
  {
    id: "sel-3",
    name: "Priya Nandan",
    handle: "@priyan",
    initials: "PN",
    listingsCountLabel: "41 listings",
    followedDefault: true,
  },
  {
    id: "sel-4",
    name: "Theo Bennett",
    handle: "@theobennett",
    initials: "TB",
    listingsCountLabel: "15 listings",
    followedDefault: false,
  },
  {
    id: "sel-5",
    name: "Sana Okafor",
    handle: "@sanaokafor",
    initials: "SO",
    listingsCountLabel: "7 listings",
    followedDefault: false,
  },
];

export const FEED_ITEMS: FeedItem[] = [
  {
    id: "F-01",
    sellerId: "sel-1",
    title: "Wool Peacoat, Size M",
    brand: "COS",
    priceKrw: 145000,
    postedLabel: "Posted 3 hours ago",
    tag: "new",
  },
  {
    id: "F-02",
    sellerId: "sel-1",
    title: "Leather Crossbody Bag",
    brand: "Mansur Gavriel",
    priceKrw: 210000,
    postedLabel: "Posted 1 day ago",
    tag: "none",
  },
  {
    id: "F-03",
    sellerId: "sel-2",
    title: "Vintage 501 Jeans",
    brand: "Levi's",
    priceKrw: 68000,
    postedLabel: "Posted 5 hours ago",
    tag: "new",
  },
  {
    id: "F-04",
    sellerId: "sel-2",
    title: "Suede Chelsea Boots",
    brand: "Clarks",
    priceKrw: 92000,
    postedLabel: "Auction ends in 4 hours",
    tag: "ending",
  },
  {
    id: "F-05",
    sellerId: "sel-3",
    title: "Cashmere Turtleneck",
    brand: "Everlane",
    priceKrw: 78000,
    postedLabel: "Posted 2 days ago",
    tag: "none",
  },
  {
    id: "F-06",
    sellerId: "sel-3",
    title: "Silk Midi Skirt",
    brand: "Reformation",
    priceKrw: 89000,
    postedLabel: "Listing ends in 12 hours",
    tag: "ending",
  },
  {
    id: "F-07",
    sellerId: "sel-3",
    title: "Canvas High-Top Sneakers",
    brand: "Converse",
    priceKrw: 54000,
    postedLabel: "Posted 6 hours ago",
    tag: "new",
  },
  {
    id: "F-08",
    sellerId: "sel-4",
    title: "Denim Trucker Jacket",
    brand: "Levi's",
    priceKrw: 71000,
    postedLabel: "Posted 1 day ago",
    tag: "none",
  },
  {
    id: "F-09",
    sellerId: "sel-5",
    title: "Linen Wide-Leg Trousers",
    brand: "COS",
    priceKrw: 59000,
    postedLabel: "Listing ends in 1 day",
    tag: "ending",
  },
  {
    id: "F-10",
    sellerId: "sel-2",
    title: "Merino Wool Beanie",
    brand: "Uniqlo",
    priceKrw: 18000,
    postedLabel: "Posted 4 hours ago",
    tag: "none",
  },
];

// Thousands-separated KRW digits, no toLocaleString (deterministic across environments).
export function formatDigits(won: number): string {
  return Math.abs(won).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
