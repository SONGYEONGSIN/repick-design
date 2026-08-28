// native/src/storefront/data.ts — deterministic dummy data for SellerStorefrontScreen.
// No Math.random / Date.now / argument-less `new Date()` anywhere below — every value is a
// fixed literal or computed from fixed literals.

export type SortKey = "price" | "newest" | "condition";

export type Listing = {
  id: string;
  title: string;
  brand: string;
  category: string;
  priceKrw: number;
  originalPriceKrw: number;
  discountPercent: number;
  matchPercent: number;
  conditionLabel: string;
  /** Lower = better condition. Used for the "Best condition" sort. */
  conditionRank: number;
  listedDaysAgoLabel: string;
  /** Fixed sort key for "Newest" — smaller = more recently listed. */
  recencyRank: number;
  imageLabel: string;
};

export const SELLER = {
  name: "Mira Novak",
  handle: "@miranovak",
  location: "Seoul, South Korea",
  memberSinceLabel: "Member since Mar 2022",
  bio: "Curating pre-loved outerwear, knitwear, and accessories. Ships within 1 business day.",
  initials: "MN",
} as const;

export const REPUTATION = {
  avgRating: 4.9,
  reviewCount: 312,
  responseTimeLabel: "Replies within 2 hours",
  completedOrders: 428,
  onTimeShipRatePercent: 98,
} as const;

export const VERIFICATION = {
  verifiedSinceLabel: "Verified since Jan 2023",
  detail: "Government ID and bank account confirmed",
} as const;

export const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "price", label: "Price: low to high" },
  { key: "newest", label: "Newest" },
  { key: "condition", label: "Best condition" },
];

export const LISTINGS: Listing[] = [
  {
    id: "L-01",
    title: "Merino Wool Crewneck Sweater",
    brand: "COS",
    category: "Knitwear",
    priceKrw: 52000,
    originalPriceKrw: 89000,
    discountPercent: 42,
    matchPercent: 96,
    conditionLabel: "Grade A",
    conditionRank: 1,
    listedDaysAgoLabel: "Listed 2 days ago",
    recencyRank: 2,
    imageLabel: "Sweater",
  },
  {
    id: "L-02",
    title: "Leather Ankle Boots",
    brand: "Everlane",
    category: "Footwear",
    priceKrw: 138000,
    originalPriceKrw: 210000,
    discountPercent: 34,
    matchPercent: 91,
    conditionLabel: "Grade A-",
    conditionRank: 2,
    listedDaysAgoLabel: "Listed 5 days ago",
    recencyRank: 5,
    imageLabel: "Boots",
  },
  {
    id: "L-03",
    title: "Denim Trucker Jacket",
    brand: "Levi's",
    category: "Outerwear",
    priceKrw: 79000,
    originalPriceKrw: 128000,
    discountPercent: 38,
    matchPercent: 88,
    conditionLabel: "Grade B+",
    conditionRank: 3,
    listedDaysAgoLabel: "Listed 1 day ago",
    recencyRank: 1,
    imageLabel: "Jacket",
  },
  {
    id: "L-04",
    title: "Cashmere Scarf",
    brand: "Uniqlo",
    category: "Accessories",
    priceKrw: 27000,
    originalPriceKrw: 45000,
    discountPercent: 40,
    matchPercent: 99,
    conditionLabel: "Grade A",
    conditionRank: 1,
    listedDaysAgoLabel: "Listed 9 days ago",
    recencyRank: 9,
    imageLabel: "Scarf",
  },
  {
    id: "L-05",
    title: "Canvas Tote Bag",
    brand: "Baggu",
    category: "Bags",
    priceKrw: 21000,
    originalPriceKrw: 32000,
    discountPercent: 34,
    matchPercent: 84,
    conditionLabel: "Grade B",
    conditionRank: 4,
    listedDaysAgoLabel: "Listed 14 days ago",
    recencyRank: 14,
    imageLabel: "Tote",
  },
  {
    id: "L-06",
    title: "Wool Blend Overcoat",
    brand: "COS",
    category: "Outerwear",
    priceKrw: 198000,
    originalPriceKrw: 320000,
    discountPercent: 38,
    matchPercent: 93,
    conditionLabel: "Grade A-",
    conditionRank: 2,
    listedDaysAgoLabel: "Listed 3 days ago",
    recencyRank: 3,
    imageLabel: "Overcoat",
  },
  {
    id: "L-07",
    title: "Running Sneakers",
    brand: "New Balance",
    category: "Footwear",
    priceKrw: 96000,
    originalPriceKrw: 148000,
    discountPercent: 35,
    matchPercent: 90,
    conditionLabel: "Grade B+",
    conditionRank: 3,
    listedDaysAgoLabel: "Listed 7 days ago",
    recencyRank: 7,
    imageLabel: "Sneakers",
  },
  {
    id: "L-08",
    title: "Silk Slip Dress",
    brand: "Reformation",
    category: "Dresses",
    priceKrw: 112000,
    originalPriceKrw: 175000,
    discountPercent: 36,
    matchPercent: 95,
    conditionLabel: "Grade A",
    conditionRank: 1,
    listedDaysAgoLabel: "Listed today",
    recencyRank: 0,
    imageLabel: "Dress",
  },
  {
    id: "L-09",
    title: "Corduroy Wide-Leg Pants",
    brand: "Uniqlo",
    category: "Bottoms",
    priceKrw: 41000,
    originalPriceKrw: 68000,
    discountPercent: 40,
    matchPercent: 87,
    conditionLabel: "Grade B",
    conditionRank: 4,
    listedDaysAgoLabel: "Listed 11 days ago",
    recencyRank: 11,
    imageLabel: "Pants",
  },
];

export const FOLLOW_FEEDBACK =
  "You're now following Mira Novak. New listings will appear in your feed.";
export const UNFOLLOW_FEEDBACK = "You unfollowed Mira Novak.";
export const MESSAGE_FEEDBACK =
  "Message request sent to Mira Novak. She usually replies within 2 hours.";
