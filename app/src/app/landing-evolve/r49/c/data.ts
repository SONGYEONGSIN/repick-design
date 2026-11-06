// Deterministic data + geometry for "Point Select" -- no Math.random / Date.now / argument-less
// new Date() anywhere. The seven drop-off locations below are the page's one spatial dataset:
// fixed percent coordinates on a 0-100 plane (the abstract "zone" PinField draws into), fixed
// processing/queue/category/verification fields. Every derived number on the page -- the
// aggregate "verified points near you" stat, the live detail panel, the product-preview
// coverage lines, the closing CTA's sentence -- is a pure function of (selectedId,
// categoryFilter) over this one fixed array. Nothing here is re-rolled per render.

export type Category =
  | "Electronics"
  | "Bags & accessories"
  | "Outerwear"
  | "Furniture"
  | "Sporting goods"
  | "Home goods";

export type DropPoint = {
  id: string;
  name: string;
  x: number; // percent, 0-100, fixed
  y: number; // percent, 0-100, fixed
  processingHours: number;
  queueAhead: number; // items ahead of a new drop-off right now
  categories: Category[];
  verified: boolean;
};

// queueAhead > QUEUE_BUSY_THRESHOLD => "busy". Derived, not a separate stored flag, so the
// busy/available label can never drift out of sync with the queue number shown next to it.
export const QUEUE_BUSY_THRESHOLD = 6;

export function statusFor(point: DropPoint): "available" | "busy" {
  return point.queueAhead > QUEUE_BUSY_THRESHOLD ? "busy" : "available";
}

export const DROP_POINTS: DropPoint[] = [
  {
    id: "union-yard",
    name: "Union Yard",
    x: 50,
    y: 55,
    processingHours: 2,
    queueAhead: 3,
    categories: ["Electronics", "Bags & accessories"],
    verified: true,
  },
  {
    id: "riverside-commons",
    name: "Riverside Commons",
    x: 38,
    y: 42,
    processingHours: 4,
    queueAhead: 9,
    categories: ["Outerwear", "Home goods"],
    verified: true,
  },
  {
    id: "old-mill-market",
    name: "Old Mill Market",
    x: 64,
    y: 40,
    processingHours: 3,
    queueAhead: 5,
    categories: ["Electronics", "Furniture"],
    verified: true,
  },
  {
    id: "harbor-exchange",
    name: "Harbor Exchange",
    x: 70,
    y: 64,
    processingHours: 6,
    queueAhead: 11,
    categories: ["Sporting goods", "Bags & accessories"],
    verified: false,
  },
  {
    id: "northside-depot",
    name: "Northside Depot",
    x: 50,
    y: 22,
    processingHours: 2,
    queueAhead: 2,
    categories: ["Electronics", "Home goods"],
    verified: true,
  },
  {
    id: "cedar-grove-outpost",
    name: "Cedar Grove Outpost",
    x: 30,
    y: 70,
    processingHours: 5,
    queueAhead: 7,
    categories: ["Furniture", "Home goods"],
    verified: true,
  },
  {
    id: "lowland-collective",
    name: "Lowland Collective",
    x: 66,
    y: 82,
    processingHours: 3,
    queueAhead: 4,
    categories: ["Outerwear", "Sporting goods"],
    verified: true,
  },
];

export const DEFAULT_POINT_ID = "union-yard";

// The subset of categories exposed as filter chips above the pin field -- chosen because every
// catalog item below actually falls into one of these three, so filtering always has a visible
// effect on the product-preview coverage line as well as the pin field.
export const FILTER_CATEGORIES: Category[] = ["Electronics", "Bags & accessories", "Outerwear"];

export const AREA_LABEL = "Ashford Metro";

// Abstract distance model: the PinField plane is a 0-100 percent grid, not a real map, so there
// is no built-in unit. MILES_PER_PCT is a single fixed, documented conversion (arbitrary, picked
// so the on-screen "mi" figure reads as a plausible metro-area radius) -- see candidates/c.md.
export const MILES_PER_PCT = 0.375;
export const AREA_RADIUS_PCT = 24; // "within your area" radius, in plane units
export const AREA_RADIUS_MILES = Math.round(AREA_RADIUS_PCT * MILES_PER_PCT); // 9

function distance(a: DropPoint, b: DropPoint): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export type CoverageResult = {
  point: DropPoint;
  nearby: DropPoint[]; // other points within AREA_RADIUS_PCT, excluding the selected point itself
  totalCount: number; // nearby.length + 1 (the selected point counts as covering its own area)
  avgProcessingHours: number; // mean of processingHours across point + nearby, 1 decimal
};

/** Every point within AREA_RADIUS_PCT of `selectedId`, plus the point itself -- recomputed on every selection. */
export function coverageFor(selectedId: string): CoverageResult {
  const point = DROP_POINTS.find((p) => p.id === selectedId) ?? DROP_POINTS[0];
  const nearby = DROP_POINTS.filter((p) => p.id !== point.id && distance(point, p) <= AREA_RADIUS_PCT);
  const set = [point, ...nearby];
  const avgProcessingHours = Math.round((set.reduce((sum, p) => sum + p.processingHours, 0) / set.length) * 10) / 10;
  return { point, nearby, totalCount: set.length, avgProcessingHours };
}

/** How many of the covered points (selected + nearby) accept a given category -- feeds the product-preview coverage line. */
export function coverageAcceptingCategory(coverage: CoverageResult, category: Category): number {
  return [coverage.point, ...coverage.nearby].filter((p) => p.categories.includes(category)).length;
}

export function pluralPoints(n: number): string {
  return n === 1 ? "point" : "points";
}

/** The sentence the aggregate stat and the closing CTA both cite -- one function, two call sites. */
export function coverageSentence(coverage: CoverageResult, filter: Category | null): string {
  const { point, totalCount, avgProcessingHours } = coverage;
  if (filter) {
    const accepting = coverageAcceptingCategory(coverage, filter);
    if (accepting === 0) {
      return `No verified point within ${AREA_RADIUS_MILES} mi of ${point.name} currently takes ${filter.toLowerCase()}.`;
    }
    return `${accepting} of ${totalCount} verified ${pluralPoints(totalCount)} near ${point.name} take${totalCount === 1 ? "s" : ""} ${filter.toLowerCase()}.`;
  }
  if (totalCount === 1) {
    return `${point.name} is the only verified point within ${AREA_RADIUS_MILES} mi right now -- a standalone outpost for this part of ${AREA_LABEL}.`;
  }
  return `${totalCount} verified ${pluralPoints(totalCount)} within ${AREA_RADIUS_MILES} mi of ${point.name}, averaging ${avgProcessingHours}h to process.`;
}

// ---- PinField abstract "zone" geometry (fixed viewBox, coordinates rounded to 2dp) ----

export const FIELD_VIEW_W = 100;
export const FIELD_VIEW_H = 68; // flattened, non-square plane -- an abstract zone, not a map tile

// Hand-fixed organic blob path, drawn once, never regenerated -- the "zone" field pins sit inside.
// Deliberately irregular and un-gridded so it reads as an abstract territory shape, never a
// technical diagram (no roads, coastlines, or grid lines anywhere in this component).
export const ZONE_PATH_D =
  "M18,14 C34,2 62,1 78,10 C93,18 97,32 92,45 C87,58 70,66 52,66 C34,66 14,61 7,47 C1,35 4,22 18,14 Z";

// ---- Catalog content (items sold through the network, not the drop-off points themselves) ----

export type ProductItem = {
  id: string;
  title: string;
  brand: string;
  image: string;
  alt: string;
  matchPercent: number;
  matchReason: string;
  conditionGrade: string;
  verified: boolean;
  priceBefore: number;
  priceAfter: number;
  category: Category;
};

export const PRODUCT_ITEMS: ProductItem[] = [
  {
    id: "ae-1-camera",
    title: "Canon AE-1 Program",
    brand: "Canon",
    image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?q=80&w=800&auto=format&fit=crop",
    alt: "Canon AE-1 Program film camera body photographed against a white background",
    matchPercent: 92,
    matchReason: "Matches 3 of your last saved searches for manual-focus film bodies",
    conditionGrade: "A-",
    verified: true,
    priceBefore: 220,
    priceAfter: 148,
    category: "Electronics",
  },
  {
    id: "seamaster-watch",
    title: "Seamaster Dive Watch",
    brand: "Omega",
    image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=800&auto=format&fit=crop",
    alt: "Stainless steel dive watch with a blue dial, photographed against a plain background",
    matchPercent: 88,
    matchReason: "Same reference family you watched twice this week",
    conditionGrade: "B+",
    verified: true,
    priceBefore: 2400,
    priceAfter: 1680,
    category: "Electronics",
  },
  {
    id: "everyday-backpack",
    title: "Everyday Backpack",
    brand: "Peak Design",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop",
    alt: "Dark canvas backpack standing upright against a plain background",
    matchPercent: 95,
    matchReason: "Priced under this week's average sell-through for the model",
    conditionGrade: "A",
    verified: true,
    priceBefore: 260,
    priceAfter: 171,
    category: "Bags & accessories",
  },
];

export function formatUsd(n: number): string {
  return `$${n.toLocaleString("en-US")}`;
}

export function discountPercent(before: number, after: number): number {
  return Math.round((1 - after / before) * 100);
}

// A single already-closed, already-processed sale for social proof -- its own fixed numbers,
// explicitly NOT driven by whichever point is currently selected above. Copy must say so.
export const CLOSED_SALE = {
  id: "weekender-bag",
  title: "Leather Weekender Bag",
  brand: "Filson",
  image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop",
  alt: "Brown leather weekender duffel bag on a plain surface",
  priceBefore: 340,
  soldPrice: 212,
  processedHours: 3,
  droppedAt: "Northside Depot",
  verified: true,
};

export type Testimonial = { id: string; name: string; role: string; quote: string };

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    name: "Dana P.",
    role: "Seller, Riverside Commons",
    quote:
      "I picked the point closest to my gym and could see the queue before I left the house. Three people ahead, twenty minutes, done.",
  },
  {
    id: "t2",
    name: "Owen M.",
    role: "Buyer, Union Yard",
    quote:
      "The verification badge on the point mattered more than the one on the listing. I knew exactly who'd inspected the camera before I drove over.",
  },
];

export const STATS = [
  { value: "7", label: "verified partner points live" },
  { value: `${AREA_RADIUS_MILES}mi`, label: "coverage radius per point" },
  { value: "2-6h", label: "observed range, processing time" },
];
