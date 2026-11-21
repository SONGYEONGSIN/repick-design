// Fixed, deterministic listing data. No Math.random / Date.now / new Date() anywhere in this
// route -- every number shown is a literal here.

export type Listing = {
  id: string;
  title: string;
  category: string;
  photoId: string; // images.unsplash.com/photo-<id>, fixed real photo already used elsewhere in this catalog
  alt: string;
  matchPct: number;
  grade: "Like New" | "Excellent" | "Good";
  verified: boolean;
  price: number;
  retailPrice: number;
  sellerRating: number; // out of 5, one decimal
  shipsIn: string;
};

export const LISTINGS: Listing[] = [
  {
    id: "l-camera",
    title: "Compact 35 Film Camera",
    category: "Cameras",
    photoId: "1502920917128-1aa500764cbd",
    alt: "A compact 35mm film camera with its lens cap removed, photographed on a plain background",
    matchPct: 92,
    grade: "Excellent",
    verified: true,
    price: 108,
    retailPrice: 150,
    sellerRating: 4.9,
    shipsIn: "1-2 days",
  },
  {
    id: "l-bag",
    title: "Canvas Weekender Bag",
    category: "Bags",
    photoId: "1505843513577-22bb7d21e455",
    alt: "A waxed canvas weekender travel bag with leather straps standing upright",
    matchPct: 88,
    grade: "Like New",
    verified: true,
    price: 119,
    retailPrice: 165,
    sellerRating: 4.7,
    shipsIn: "2-3 days",
  },
  {
    id: "l-lamp",
    title: "Arc Table Lamp",
    category: "Home",
    photoId: "1507003211169-0a1dd7228f2d",
    alt: "A walnut-base dimmable table lamp with its shade on, switched off, on a plain surface",
    matchPct: 81,
    grade: "Good",
    verified: false,
    price: 68,
    retailPrice: 95,
    sellerRating: 4.4,
    shipsIn: "3-4 days",
  },
  {
    id: "l-watch",
    title: "Meridian Chrono Watch",
    category: "Watches",
    photoId: "1441986300917-64674bd600d8",
    alt: "A steel chronograph wristwatch with its bracelet laid flat",
    matchPct: 95,
    grade: "Like New",
    verified: true,
    price: 289,
    retailPrice: 410,
    sellerRating: 4.9,
    shipsIn: "1-2 days",
  },
  {
    id: "l-sneaker",
    title: "Nocturne Trail Sneakers",
    category: "Sneakers",
    photoId: "1489987707025-afc232f7ea0f",
    alt: "A pair of trail running sneakers with visible wear on the soles",
    matchPct: 86,
    grade: "Good",
    verified: false,
    price: 79,
    retailPrice: 185,
    sellerRating: 4.2,
    shipsIn: "2-3 days",
  },
  {
    id: "l-jacket",
    title: "Fieldwork Shell Jacket",
    category: "Outerwear",
    photoId: "1445205170230-053b83016050",
    alt: "A technical outdoor shell jacket folded on a flat neutral surface",
    matchPct: 90,
    grade: "Excellent",
    verified: true,
    price: 176,
    retailPrice: 240,
    sellerRating: 4.6,
    shipsIn: "2-3 days",
  },
];

export const MAX_TRAY = 3;
export const DEFAULT_SELECTED: string[] = ["l-camera", "l-watch"];
