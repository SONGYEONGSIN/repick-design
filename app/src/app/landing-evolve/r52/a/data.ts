// Fixed, deterministic listing data. No Math.random / Date.now anywhere in this route -- every
// number the page shows is either a literal here or a pure function of (item, scrubDay) in model.ts.

export type Category = "sneaker" | "watch" | "jacket" | "camera" | "bag" | "lamp";

export type Listing = {
  id: string;
  title: string;
  brand: string;
  category: Category;
  specLabel: string; // size / spec shown as a caption
  retailPrice: number; // original new price -- discount is measured against this
  startPrice: number; // seller's day-0 ask
  floorPrice: number; // the price the model will not drop below
  halfLifeDays: number; // how fast this item's price/match responds to listing age
  baseMatchFloor: number; // match score % at day 0
  grade: "Like New" | "Excellent" | "Good"; // fixed physical condition grade
  verified: boolean; // fixed seller verification badge
  matchTag: string; // one AI-match-reasoning tag shown on the card
};

export const LISTINGS: Listing[] = [
  {
    id: "sneaker-01",
    title: "Nocturne Trail Sneakers",
    brand: "Arlo & Finch",
    category: "sneaker",
    specLabel: "US 9.5 · worn 4 times",
    retailPrice: 185,
    startPrice: 129,
    floorPrice: 79,
    halfLifeDays: 14,
    baseMatchFloor: 58,
    grade: "Excellent",
    verified: true,
    matchTag: "Matches 3 saved searches",
  },
  {
    id: "watch-01",
    title: "Meridian Chrono Watch",
    brand: "Haldin",
    category: "watch",
    specLabel: "38mm · steel bracelet",
    retailPrice: 410,
    startPrice: 289,
    floorPrice: 190,
    halfLifeDays: 20,
    baseMatchFloor: 51,
    grade: "Like New",
    verified: true,
    matchTag: "Box + papers included",
  },
  {
    id: "jacket-01",
    title: "Fieldwork Shell Jacket",
    brand: "Norrland",
    category: "jacket",
    specLabel: "Size M · unisex cut",
    retailPrice: 240,
    startPrice: 176,
    floorPrice: 104,
    halfLifeDays: 11,
    baseMatchFloor: 62,
    grade: "Good",
    verified: false,
    matchTag: "Trending in your size",
  },
  {
    id: "camera-01",
    title: "Compact 35 Film Camera",
    brand: "Loupe Co.",
    category: "camera",
    specLabel: "Recently serviced",
    retailPrice: 150,
    startPrice: 108,
    floorPrice: 68,
    halfLifeDays: 9,
    baseMatchFloor: 66,
    grade: "Excellent",
    verified: true,
    matchTag: "Light meter tests spot-on",
  },
  {
    id: "bag-01",
    title: "Canvas Weekender Bag",
    brand: "Outland",
    category: "bag",
    specLabel: "42L · waxed canvas",
    retailPrice: 165,
    startPrice: 119,
    floorPrice: 74,
    halfLifeDays: 16,
    baseMatchFloor: 55,
    grade: "Like New",
    verified: true,
    matchTag: "Pairs with your wishlist",
  },
  {
    id: "lamp-01",
    title: "Arc Table Lamp",
    brand: "Studio Palisade",
    category: "lamp",
    specLabel: "Walnut base · dimmable",
    retailPrice: 95,
    startPrice: 68,
    floorPrice: 41,
    halfLifeDays: 12,
    baseMatchFloor: 60,
    grade: "Good",
    verified: false,
    matchTag: "Low-shipping-risk pickup",
  },
];

// Scrubber range. Default sits away from both ends on purpose: day 18 is the model's own
// recommended re-price checkpoint, not an empty/zero placeholder -- every reset of the control
// lands here and already shows a useful mid-range value for every listing above.
export const DAY_MIN = 0;
export const DAY_MAX = 60;
export const DAY_DEFAULT = 18;
export const DAY_STEP = 1;
