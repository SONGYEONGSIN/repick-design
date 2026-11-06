// Deterministic catalog data for the Range Sweep device. No Math.random / Date — every
// number here is a fixed literal so the page renders identically on every load and on the server.

export type Grade = "Like New" | "Excellent" | "Very Good" | "Good";

export type Item = {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice: number;
  matchPct: number;
  grade: Grade;
  verified: boolean;
  discountPct: number;
  photoId: string;
};

export const MIN_PRICE = 42;
export const MAX_PRICE = 1180;
export const DEFAULT_MIN = 180;
export const DEFAULT_MAX = 420;
export const MIN_GAP = 20;

// One fixed, human-picked Unsplash photo per category — reused across that category's
// listings. Deterministic, never a randomized photo service.
const CATEGORY_PHOTO: Record<string, string> = {
  Outerwear: "1551028719-00167b16eac5",
  Footwear: "1542291026-7eec264c27ff",
  Audio: "1491553895911-0055eca6402d",
  Cameras: "1495707902641-75cac588d2e9",
  Watches: "1523275335684-37898b6baf30",
  Bags: "1553062407-98eeb64c6a62",
  Bikes: "1485965120184-e220f721d03e",
  Furniture: "1567538096630-e0c55bd6374c",
};

function withOriginal(price: number, discountPct: number): number {
  return Math.round(price / (1 - discountPct / 100));
}

type RawItem = Omit<Item, "originalPrice" | "photoId">;

const RAW_ITEMS: RawItem[] = [
  { id: "shell-jacket", name: "Shell Jacket — Trail", category: "Outerwear", price: 42, matchPct: 86, grade: "Good", verified: true, discountPct: 52 },
  { id: "canvas-sneaker", name: "Canvas Sneaker — Low", category: "Footwear", price: 58, matchPct: 83, grade: "Good", verified: false, discountPct: 38 },
  { id: "wired-earbuds", name: "Wired Earbuds — Studio", category: "Audio", price: 72, matchPct: 88, grade: "Very Good", verified: true, discountPct: 44 },
  { id: "point-shoot", name: "Point & Shoot — Classic", category: "Cameras", price: 85, matchPct: 91, grade: "Excellent", verified: true, discountPct: 57 },
  { id: "field-watch", name: "Field Watch — Steel", category: "Watches", price: 99, matchPct: 85, grade: "Very Good", verified: true, discountPct: 35 },
  { id: "day-pack", name: "Day Pack — Canvas", category: "Bags", price: 112, matchPct: 90, grade: "Excellent", verified: false, discountPct: 41 },
  { id: "kids-bmx", name: "Kids BMX — 20in", category: "Bikes", price: 128, matchPct: 87, grade: "Good", verified: true, discountPct: 33 },
  { id: "task-lamp", name: "Task Lamp — Desk", category: "Furniture", price: 145, matchPct: 92, grade: "Excellent", verified: true, discountPct: 46 },
  { id: "fleece-pullover", name: "Fleece Pullover — Half-Zip", category: "Outerwear", price: 162, matchPct: 89, grade: "Very Good", verified: true, discountPct: 29 },
  { id: "trail-runner", name: "Trail Runner — Mid", category: "Footwear", price: 178, matchPct: 94, grade: "Excellent", verified: true, discountPct: 48 },
  { id: "bt-speaker", name: "Bluetooth Speaker — Compact", category: "Audio", price: 195, matchPct: 90, grade: "Very Good", verified: true, discountPct: 36 },
  { id: "mirrorless-entry", name: "Mirrorless Body — Entry", category: "Cameras", price: 210, matchPct: 93, grade: "Excellent", verified: true, discountPct: 40 },
  { id: "dive-watch", name: "Dive Watch — Automatic", category: "Watches", price: 228, matchPct: 88, grade: "Very Good", verified: false, discountPct: 31 },
  { id: "weekender-bag", name: "Weekender — Leather", category: "Bags", price: 245, matchPct: 95, grade: "Excellent", verified: true, discountPct: 44 },
  { id: "commuter-bike", name: "Commuter — Single Speed", category: "Bikes", price: 265, matchPct: 91, grade: "Very Good", verified: true, discountPct: 37 },
  { id: "accent-chair", name: "Accent Chair — Boucle", category: "Furniture", price: 290, matchPct: 86, grade: "Good", verified: true, discountPct: 27 },
  { id: "down-parka", name: "Down Parka — Arctic", category: "Outerwear", price: 320, matchPct: 97, grade: "Like New", verified: true, discountPct: 53 },
  { id: "hiking-boot", name: "Hiking Boot — Resole", category: "Footwear", price: 360, matchPct: 90, grade: "Very Good", verified: true, discountPct: 42 },
  { id: "studio-headphones", name: "Studio Headphones — Open-Back", category: "Audio", price: 410, matchPct: 96, grade: "Excellent", verified: true, discountPct: 39 },
  { id: "prime-lens", name: "Prime Lens — 50mm", category: "Cameras", price: 470, matchPct: 98, grade: "Like New", verified: true, discountPct: 45 },
  { id: "chronograph", name: "Chronograph — Titanium", category: "Watches", price: 540, matchPct: 94, grade: "Excellent", verified: true, discountPct: 34 },
  { id: "carry-on", name: "Carry-On — Hardshell", category: "Bags", price: 640, matchPct: 92, grade: "Excellent", verified: false, discountPct: 30 },
  { id: "gravel-frame", name: "Gravel Frame — Carbon", category: "Bikes", price: 820, matchPct: 97, grade: "Like New", verified: true, discountPct: 28 },
  { id: "lounge-set", name: "Lounge Set — Mid-Century", category: "Furniture", price: 1180, matchPct: 99, grade: "Like New", verified: true, discountPct: 25 },
];

export const ITEMS: Item[] = RAW_ITEMS.map((raw) => ({
  ...raw,
  originalPrice: withOriginal(raw.price, raw.discountPct),
  photoId: CATEGORY_PHOTO[raw.category],
}));

export function clampNum(v: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, v));
}

/** The single filtering computation every live output on this page shares. */
export function filterByRange(min: number, max: number): Item[] {
  return ITEMS.filter((i) => i.price >= min && i.price <= max).sort((a, b) => a.price - b.price);
}

export function medianPrice(items: Item[]): number {
  if (items.length === 0) return 0;
  const sorted = [...items].map((i) => i.price).sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) return Math.round((sorted[mid - 1] + sorted[mid]) / 2);
  return sorted[mid];
}

export function formatPrice(n: number): string {
  return `$${n.toLocaleString("en-US")}`;
}

export type Bin = { binMin: number; binMax: number; count: number };

export function buildHistogram(binCount: number): Bin[] {
  const span = MAX_PRICE - MIN_PRICE;
  const width = span / binCount;
  const bins: Bin[] = Array.from({ length: binCount }, (_, i) => ({
    binMin: MIN_PRICE + i * width,
    binMax: MIN_PRICE + (i + 1) * width,
    count: 0,
  }));
  for (const item of ITEMS) {
    let idx = Math.floor((item.price - MIN_PRICE) / width);
    if (idx >= binCount) idx = binCount - 1;
    if (idx < 0) idx = 0;
    bins[idx].count += 1;
  }
  return bins;
}
