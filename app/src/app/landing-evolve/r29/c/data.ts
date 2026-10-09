// Every figure below is a fixed literal — nothing here is randomized, fetched, or time-based, so
// the constellation graph and every number derived from it render identically on server and client
// and on every reload. Prices in USD. Strength is a 0-100 "how well this listing answers this need"
// score computed by repick's matcher (modeled here as fixed data, not live).

export type NeedId = "budget" | "condition" | "brand" | "ships-fast";

export type Need = {
  id: NeedId;
  label: string;
  /** One line explaining what repick actually measures for this need. */
  method: string;
};

export const NEEDS: Need[] = [
  {
    id: "budget",
    label: "Budget",
    method: "Live price measured against this week's resale average for the same model and grade.",
  },
  {
    id: "condition",
    label: "Condition",
    method: "A 32-point inspection score covering wear, hardware, and included accessories.",
  },
  {
    id: "brand",
    label: "Brand",
    method: "How closely a listing tracks the brands you've saved, searched, or bought before.",
  },
  {
    id: "ships-fast",
    label: "Ships fast",
    method: "Seller distance and carrier transit time to your saved delivery address.",
  },
];

export type Category = "Footwear" | "Outerwear" | "Accessories";

export type ProductId =
  | "jordan-1"
  | "yeezy-350"
  | "nb-550"
  | "dunk-low"
  | "bape-hoodie"
  | "rayban";

export type Product = {
  id: ProductId;
  name: string;
  brand: string;
  category: Category;
  photoId: string;
  priceOriginal: number;
  priceNow: number;
  conditionScore: number;
  conditionLabel: string;
  verified: boolean;
};

export const PRODUCTS: Product[] = [
  {
    id: "jordan-1",
    name: "Air Jordan 1 Retro High ‘Chicago’",
    brand: "Jordan",
    category: "Footwear",
    photoId: "1495121605193-b116b5b09a56",
    priceOriginal: 230,
    priceNow: 189,
    conditionScore: 96,
    conditionLabel: "Grade A — deadstock, tags attached",
    verified: true,
  },
  {
    id: "yeezy-350",
    name: "Yeezy Boost 350 V2",
    brand: "Adidas",
    category: "Footwear",
    photoId: "1441986300917-64674bd600d8",
    priceOriginal: 230,
    priceNow: 171,
    conditionScore: 91,
    conditionLabel: "Grade A− — worn twice",
    verified: true,
  },
  {
    id: "nb-550",
    name: "New Balance 550",
    brand: "New Balance",
    category: "Footwear",
    photoId: "1560243563-062bfc001d68",
    priceOriginal: 150,
    priceNow: 62,
    conditionScore: 78,
    conditionLabel: "Grade B — visible creasing, sole intact",
    verified: true,
  },
  {
    id: "dunk-low",
    name: "Nike Dunk Low ‘Panda’",
    brand: "Nike",
    category: "Footwear",
    photoId: "1543076447-215ad9ba6923",
    priceOriginal: 150,
    priceNow: 132,
    conditionScore: 93,
    conditionLabel: "Grade A — excellent, minimal creasing",
    verified: true,
  },
  {
    id: "bape-hoodie",
    name: "BAPE Shark Full-Zip Hoodie",
    brand: "BAPE",
    category: "Outerwear",
    photoId: "1509631179647-0177331693ae",
    priceOriginal: 320,
    priceNow: 178,
    conditionScore: 84,
    conditionLabel: "Grade B+ — light shelf wear",
    verified: true,
  },
  {
    id: "rayban",
    name: "Ray-Ban Original Wayfarer",
    brand: "Ray-Ban",
    category: "Accessories",
    photoId: "1523381210434-271e8be1f52b",
    priceOriginal: 163,
    priceNow: 74,
    conditionScore: 90,
    conditionLabel: "Grade A− — like new, original case",
    verified: true,
  },
];

export const CATEGORIES: ("All" | Category)[] = ["All", "Footwear", "Outerwear", "Accessories"];

export type Edge = {
  needId: NeedId;
  productId: ProductId;
  /** 0-100: how strongly this listing answers this specific need. Pairs with a numeric label on
      the graph — never shown as color/opacity alone. */
  strength: number;
  /** The specific, non-generic reason this listing earned this score on this need. */
  reason: string;
};

// 4 needs x 3 edges each = 12 edges. Every product carries at least one edge; no two edges on the
// same need share a strength value, so "top match" and the sortable table never need a tie-break.
export const EDGES: Edge[] = [
  { needId: "budget", productId: "nb-550", strength: 95, reason: "Priced 59% below this week's resale average for the model." },
  { needId: "budget", productId: "rayban", strength: 78, reason: "Open-box return, priced under every verified comp this week." },
  { needId: "budget", productId: "bape-hoodie", strength: 65, reason: "Last-season colorway, marked down ahead of the new drop." },

  { needId: "condition", productId: "jordan-1", strength: 97, reason: "Zero wear logged across all 32 inspection points; box and tags verified intact." },
  { needId: "condition", productId: "yeezy-350", strength: 88, reason: "Sole creasing measured under 2mm, inspected under raking light." },
  { needId: "condition", productId: "bape-hoodie", strength: 70, reason: "One interior tag fold noted; shell fabric unaffected." },

  { needId: "brand", productId: "yeezy-350", strength: 93, reason: "Adidas is your most-saved brand across the last 30 days." },
  { needId: "brand", productId: "dunk-low", strength: 90, reason: "Nike appears in 4 of your last 5 saved searches." },
  { needId: "brand", productId: "jordan-1", strength: 85, reason: "Jordan Brand matches your size-run alert history." },

  { needId: "ships-fast", productId: "dunk-low", strength: 94, reason: "Same-metro seller — courier delivery in under 24 hours." },
  { needId: "ships-fast", productId: "rayban", strength: 86, reason: "Stocked at repick's regional hub; ships within 2 days." },
  { needId: "ships-fast", productId: "bape-hoodie", strength: 59, reason: "Cross-country seller — standard 5–7 day transit." },
];

export function needById(id: NeedId): Need {
  return NEEDS.find((n) => n.id === id)!;
}

export function productById(id: ProductId): Product {
  return PRODUCTS.find((p) => p.id === id)!;
}

/** All edges for a need, sorted strongest match first. */
export function edgesForNeed(needId: NeedId): Edge[] {
  return EDGES.filter((e) => e.needId === needId).sort((a, b) => b.strength - a.strength);
}

/** All edges for a product, sorted strongest match first. */
export function edgesForProduct(productId: ProductId): Edge[] {
  return EDGES.filter((e) => e.productId === productId).sort((a, b) => b.strength - a.strength);
}

/** The single strongest edge for a need — the node graph's default/auto-selected product. */
export function topEdgeForNeed(needId: NeedId): Edge {
  return edgesForNeed(needId)[0];
}

/** The need a product answers best — used for its "best match" chip in the product grid. */
export function topEdgeForProduct(productId: ProductId): Edge {
  return edgesForProduct(productId)[0];
}

export function edgeFor(needId: NeedId, productId: ProductId): Edge | undefined {
  return EDGES.find((e) => e.needId === needId && e.productId === productId);
}

export function discountPct(product: Product): number {
  return Math.round((1 - product.priceNow / product.priceOriginal) * 100);
}

export function savingsOf(product: Product): number {
  return product.priceOriginal - product.priceNow;
}

export function formatUSD(value: number): string {
  return `$${Math.round(value).toLocaleString("en-US")}`;
}

// Sorted once, by strength descending, as the fallback table's initial (and default) reading order.
export const EDGES_BY_STRENGTH_DESC: Edge[] = [...EDGES].sort((a, b) => b.strength - a.strength);

// ---------------------------------------------------------------------------------------------
// Social proof

export const STATS: { label: string; value: string }[] = [
  { label: "Listings graded this year", value: "41,600+" },
  { label: "Needs tracked per match", value: "4" },
  { label: "Median grading accuracy", value: "97.1%" },
  { label: "Avg. time to a picked listing", value: "88 sec" },
];

export const TESTIMONIALS: { name: string; role: string; quote: string; initials: string }[] = [
  {
    name: "Priya Nathan",
    role: "Bought the Jordan 1 ‘Chicago’ on repick",
    quote:
      "I clicked Condition and watched the line point straight at one pair, with the inspection note right there. No guessing which listing the grade actually belonged to.",
    initials: "PN",
  },
  {
    name: "Marcus Webb",
    role: "Consignment seller, 4 years",
    quote:
      "Buyers used to message me asking which of my listings fit their budget. Now the graph answers that before they ever reach my page.",
    initials: "MW",
  },
  {
    name: "Elena Cho",
    role: "Bought the Ray-Ban Wayfarer on repick",
    quote:
      "Shipping speed mattered more to me than price. Switching the need node showed me that instantly, and the reasoning held up when the case arrived.",
    initials: "EC",
  },
];
