// native/src/evolve/r8/a/data.ts — auto-native-r8 candidate a: Seller Storefront.
// Fully deterministic dummy data: fixed strings/numbers only, no Math.random, no argless new Date().

export type Condition = "Excellent" | "Like New" | "Good" | "Fair";

export type Listing = {
  id: string;
  title: string;
  priceLabel: string;
  condition: Condition;
  statusLabel: "Active";
};

export type Review = {
  id: string;
  reviewerInitials: string;
  reviewerName: string;
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  dateLabel: string;
};

export const SELLER = {
  displayName: "Mina Cho",
  initials: "MC",
  handle: "@minacho.finds",
  ratingValue: "4.8",
  ratingCount: 132,
  completedSales: 214,
  memberSinceLabel: "Member since 2021",
  avgResponseLabel: "Replies within 2 hours",
} as const;

export const LISTINGS: Listing[] = [
  {
    id: "l1",
    title: "Canon AE-1 Film Camera",
    priceLabel: "₩185,000",
    condition: "Good",
    statusLabel: "Active",
  },
  {
    id: "l2",
    title: "Herman Miller Aeron Chair, Size B",
    priceLabel: "₩620,000",
    condition: "Excellent",
    statusLabel: "Active",
  },
  {
    id: "l3",
    title: "Nintendo Switch OLED",
    priceLabel: "₩210,000",
    condition: "Like New",
    statusLabel: "Active",
  },
  {
    id: "l4",
    title: "Patagonia Better Sweater, M",
    priceLabel: "₩58,000",
    condition: "Good",
    statusLabel: "Active",
  },
  {
    id: "l5",
    title: "IKEA Kallax Shelf 4x2",
    priceLabel: "₩45,000",
    condition: "Fair",
    statusLabel: "Active",
  },
  {
    id: "l6",
    title: "Sony WH-1000XM4 Headphones",
    priceLabel: "₩165,000",
    condition: "Excellent",
    statusLabel: "Active",
  },
];

export const REVIEWS: Review[] = [
  {
    id: "r1",
    reviewerInitials: "JL",
    reviewerName: "Jiho L.",
    rating: 5,
    text: "Fast shipping and the camera was exactly as described. Would buy from again.",
    dateLabel: "Jul 2026",
  },
  {
    id: "r2",
    reviewerInitials: "SK",
    reviewerName: "Soo-ah K.",
    rating: 5,
    text: "Great communication and a smooth handoff at the meetup spot.",
    dateLabel: "Jun 2026",
  },
  {
    id: "r3",
    reviewerInitials: "DP",
    reviewerName: "David P.",
    rating: 4,
    text: "Chair had light wear not mentioned in the listing, but seller was responsive and fair about it.",
    dateLabel: "May 2026",
  },
];
