// repick — r16/b "Comparables Radius" data
// Deterministic seed data only. No Math.random / Date.now / new Date anywhere.

export type Grade = "A" | "A-" | "B+" | "B" | "B-";

export type ListingSeed = {
  id: string;
  title: string;
  category: string;
  imageId: string; // images.unsplash.com/<imageId>
  distanceKm: number;
  angleDeg: number;
  matchPct: number;
  grade: Grade;
  verified: boolean;
  price: number;
  originalPrice: number;
};

export type Listing = ListingSeed & {
  x: number;
  y: number;
  discountPct: number;
};

export const NEIGHBORHOOD = "Elm Hollow";

export const RADIUS_MIN = 1;
export const RADIUS_MAX = 6;
export const RADIUS_STEP = 0.5;
export const DEFAULT_RADIUS = 3.5;

export const RADIUS_PRESETS: { label: string; km: number }[] = [
  { label: "Nearby", km: 1.5 },
  { label: "Neighborhood", km: 3.5 },
  { label: "Metro-wide", km: 6 },
];

export const MAP_VIEWBOX = 400;
export const MAP_CENTER = 200;
export const MAP_SCALE = 25; // px per km
export const MAP_RINGS = [1, 2, 3, 4, 5, 6];

const SEEDS: ListingSeed[] = [
  {
    id: "selvedge-jacket",
    title: "Selvedge Denim Jacket",
    category: "Outerwear",
    imageId: "photo-1551028719-00167b16eac5",
    distanceKm: 0.6,
    angleDeg: 0,
    matchPct: 88,
    grade: "A-",
    verified: true,
    price: 96,
    originalPrice: 168,
  },
  {
    id: "court-sneakers",
    title: "Low-Top Court Sneakers",
    category: "Footwear",
    imageId: "photo-1549298916-b41d501d3772",
    distanceKm: 0.9,
    angleDeg: 137.51,
    matchPct: 94,
    grade: "A",
    verified: true,
    price: 58,
    originalPrice: 120,
  },
  {
    id: "midcentury-armchair",
    title: "Mid-Century Armchair",
    category: "Furniture",
    imageId: "photo-1567538096630-e0c55bd6374c",
    distanceKm: 1.3,
    angleDeg: 275.02,
    matchPct: 79,
    grade: "B+",
    verified: true,
    price: 210,
    originalPrice: 340,
  },
  {
    id: "automatic-watch",
    title: "Automatic Field Watch",
    category: "Watches",
    imageId: "photo-1524805444758-089113d48a6d",
    distanceKm: 1.7,
    angleDeg: 52.53,
    matchPct: 91,
    grade: "A-",
    verified: true,
    price: 340,
    originalPrice: 620,
  },
  {
    id: "canvas-backpack",
    title: "Canvas Field Backpack",
    category: "Bags",
    imageId: "photo-1533090161767-e6ffed986c88",
    distanceKm: 1.9,
    angleDeg: 190.04,
    matchPct: 71,
    grade: "B",
    verified: false,
    price: 38,
    originalPrice: 70,
  },
  {
    id: "walnut-bookshelf",
    title: "Walnut Ladder Bookshelf",
    category: "Furniture",
    imageId: "photo-1481349518771-20055b2a7b24",
    distanceKm: 2.3,
    angleDeg: 327.55,
    matchPct: 83,
    grade: "A-",
    verified: true,
    price: 145,
    originalPrice: 240,
  },
  {
    id: "vinyl-turntable",
    title: "Belt-Drive Turntable",
    category: "Audio",
    imageId: "photo-1519677100203-a0e668c92439",
    distanceKm: 2.6,
    angleDeg: 105.06,
    matchPct: 96,
    grade: "A",
    verified: true,
    price: 180,
    originalPrice: 320,
  },
  {
    id: "steel-road-bike",
    title: "Steel Frame Road Bike",
    category: "Cycling",
    imageId: "photo-1517705008128-361805f42e86",
    distanceKm: 2.9,
    angleDeg: 242.57,
    matchPct: 68,
    grade: "B-",
    verified: false,
    price: 260,
    originalPrice: 480,
  },
  {
    id: "film-camera",
    title: "35mm Rangefinder Camera",
    category: "Cameras",
    imageId: "photo-1526170375885-4d8ecf77b99f",
    distanceKm: 3.3,
    angleDeg: 20.08,
    matchPct: 86,
    grade: "A-",
    verified: true,
    price: 145,
    originalPrice: 260,
  },
  {
    id: "acoustic-guitar",
    title: "Solid-Top Acoustic Guitar",
    category: "Music",
    imageId: "photo-1586023492125-27b2c045efd7",
    distanceKm: 3.6,
    angleDeg: 157.59,
    matchPct: 74,
    grade: "B",
    verified: true,
    price: 210,
    originalPrice: 360,
  },
  {
    id: "wool-rug",
    title: "Hand-Knotted Wool Rug",
    category: "Home",
    imageId: "photo-1567016432779-094069958ea5",
    distanceKm: 3.9,
    angleDeg: 295.1,
    matchPct: 90,
    grade: "A",
    verified: true,
    price: 165,
    originalPrice: 300,
  },
  {
    id: "leather-messenger",
    title: "Leather Messenger Bag",
    category: "Bags",
    imageId: "photo-1524758631624-e2822e304c36",
    distanceKm: 4.3,
    angleDeg: 72.61,
    matchPct: 65,
    grade: "B",
    verified: false,
    price: 72,
    originalPrice: 130,
  },
  {
    id: "oak-dining-chairs",
    title: "Oak Dining Chairs, Set of 2",
    category: "Furniture",
    imageId: "photo-1503602642458-232111445657",
    distanceKm: 4.6,
    angleDeg: 210.12,
    matchPct: 95,
    grade: "A",
    verified: true,
    price: 190,
    originalPrice: 340,
  },
  {
    id: "instant-camera",
    title: "Instant Film Camera",
    category: "Cameras",
    imageId: "photo-1495121605193-b116b5b9c5fe",
    distanceKm: 4.9,
    angleDeg: 347.63,
    matchPct: 77,
    grade: "B+",
    verified: true,
    price: 55,
    originalPrice: 95,
  },
  {
    id: "wool-overcoat",
    title: "Wool Overcoat",
    category: "Outerwear",
    imageId: "photo-1520975954732-35dd22299614",
    distanceKm: 5.3,
    angleDeg: 125.14,
    matchPct: 69,
    grade: "B-",
    verified: false,
    price: 88,
    originalPrice: 160,
  },
  {
    id: "cruiser-skateboard",
    title: "Cruiser Skateboard",
    category: "Sport",
    imageId: "photo-1520967824495-b529aeba26df",
    distanceKm: 5.7,
    angleDeg: 262.65,
    matchPct: 82,
    grade: "A-",
    verified: true,
    price: 64,
    originalPrice: 110,
  },
];

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export const LISTINGS: Listing[] = SEEDS.map((seed) => {
  const angleRad = (seed.angleDeg * Math.PI) / 180;
  const x = round2(MAP_CENTER + Math.cos(angleRad) * seed.distanceKm * MAP_SCALE);
  const y = round2(MAP_CENTER + Math.sin(angleRad) * seed.distanceKm * MAP_SCALE);
  const discountPct = Math.round((1 - seed.price / seed.originalPrice) * 100);
  return { ...seed, x, y, discountPct };
});

export function formatPrice(n: number): string {
  return `$${n.toLocaleString("en-US")}`;
}

export function withinRadius(listings: Listing[], radiusKm: number): Listing[] {
  return listings.filter((l) => l.distanceKm <= radiusKm);
}

export function topMatches(listings: Listing[], count = 4): Listing[] {
  return [...listings].sort((a, b) => b.matchPct - a.matchPct).slice(0, count);
}

export type PriceBand = { low: number; high: number };

export function priceBand(listings: Listing[]): PriceBand | null {
  if (listings.length === 0) return null;
  const prices = listings.map((l) => l.price);
  return { low: Math.min(...prices), high: Math.max(...prices) };
}

export function formatRadius(km: number): string {
  return km % 1 === 0 ? `${km}` : km.toFixed(1);
}
