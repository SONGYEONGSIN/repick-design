// Fixed, deterministic listing data, including plot position. No Math.random / Date.now /
// new Date() anywhere in this route, and no runtime trigonometry either -- every coordinate below
// is a literal, pre-computed by hand and rounded to 2 decimals, so the server and the client
// render the exact same percentages on every pass.

export type Listing = {
  id: string;
  title: string;
  category: string;
  photoId: string; // images.unsplash.com/photo-<id>, fixed real photo already used elsewhere in this catalog
  alt: string;
  price: number;
  conditionScore: number; // 0-100, x-axis
  matchPct: number; // y-axis (plotted as price, see xPct/yPct below -- matchPct is proof-panel only)
  grade: string;
  verified: boolean;
  discountPct: number;
  retailPrice: number;
  reason: string;
  // Plot position as a percentage of the plot area, literal, rounded to 2 decimals.
  // x = conditionScore mapped to [6, 94], y = price mapped (inverted) to [8, 88] within this set's
  // own $60-$300 range -- computed once by hand, never at runtime.
  xPct: number;
  yPct: number;
};

export const LISTINGS: Listing[] = [
  {
    id: "p-sneaker",
    title: "Nocturne Trail Sneakers",
    category: "Sneakers",
    photoId: "1509631179647-0177331693ae",
    alt: "A pair of trail running sneakers photographed from the side on a plain background",
    price: 126,
    conditionScore: 78,
    matchPct: 94,
    grade: "Excellent",
    verified: true,
    discountPct: 32,
    retailPrice: 185,
    reason: "Matched on size, brand, and a saved search for trail soles.",
    xPct: 70.48,
    yPct: 65.17,
  },
  {
    id: "p-watch",
    title: "Meridian Chrono Watch",
    category: "Watches",
    photoId: "1515372039744-b8f02a3ae446",
    alt: "A steel chronograph wristwatch with a metal bracelet on a flat surface",
    price: 291,
    conditionScore: 92,
    matchPct: 89,
    grade: "Like New",
    verified: true,
    discountPct: 29,
    retailPrice: 410,
    reason: "Box and papers confirmed against the serial on file.",
    xPct: 87.44,
    yPct: 8.0,
  },
  {
    id: "p-jacket",
    title: "Fieldwork Shell Jacket",
    category: "Outerwear",
    photoId: "1516826957135-700dedea698c",
    alt: "A technical outdoor shell jacket laid flat against a neutral backdrop",
    price: 175,
    conditionScore: 61,
    matchPct: 91,
    grade: "Good",
    verified: false,
    discountPct: 27,
    retailPrice: 240,
    reason: "Shell seams and zippers checked across 14 close-up photos.",
    xPct: 50.0,
    yPct: 47.92,
  },
  {
    id: "p-camera",
    title: "Compact 35 Film Camera",
    category: "Cameras",
    photoId: "1519244703995-f4e0f30006d5",
    alt: "A compact 35mm film camera with its lens cap removed on a plain background",
    price: 94,
    conditionScore: 84,
    matchPct: 86,
    grade: "Excellent",
    verified: true,
    discountPct: 37,
    retailPrice: 150,
    reason: "Light meter and shutter speeds tested across all ranges.",
    xPct: 78.63,
    yPct: 76.0,
  },
  {
    id: "p-bag",
    title: "Canvas Weekender Bag",
    category: "Bags",
    photoId: "1523275335684-37898b6baf30",
    alt: "A waxed canvas weekender travel bag with leather straps standing upright",
    price: 141,
    conditionScore: 70,
    matchPct: 83,
    grade: "Like New",
    verified: true,
    discountPct: 15,
    retailPrice: 165,
    reason: "Hardware and canvas waxing checked against factory spec photos.",
    xPct: 61.91,
    yPct: 57.08,
  },
  {
    id: "p-lamp",
    title: "Arc Table Lamp",
    category: "Home",
    photoId: "1523381210434-271e8be1f52b",
    alt: "A walnut-base dimmable table lamp with its shade on, switched off",
    price: 52,
    conditionScore: 45,
    matchPct: 77,
    grade: "Good",
    verified: false,
    discountPct: 18,
    retailPrice: 95,
    reason: "Dimmer function confirmed working across its full range.",
    xPct: 34.37,
    yPct: 88.0,
  },
];

export const DEFAULT_SELECTED_ID = "p-sneaker";

// Axis bounds, literal, used only for the axis labels (not for any runtime position math).
export const PRICE_AXIS_LOW = 300;
export const PRICE_AXIS_HIGH = 60;
export const CONDITION_AXIS_LOW = 0;
export const CONDITION_AXIS_HIGH = 100;
