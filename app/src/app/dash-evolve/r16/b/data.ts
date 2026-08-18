/**
 * Stockloom — deterministic fixture data for the inventory grid.
 *
 * No Math.random / Date.now / new Date anywhere. Trend sparklines are generated with a fixed
 * trigonometric wobble (rounded to whole units, since these are countable stock units, not
 * fractional coordinates) seeded only by each row's own index + declared slope, so the same
 * output is produced on every render, server and client alike. The final point of every trend
 * array is force-set to the row's `onHand` value so the sparkline never disagrees with the
 * number printed next to it, and every summary figure in the page header is *derived* from this
 * array at render time (reduce/filter) rather than hand-typed, so subtotals cannot drift from
 * the total.
 */

export type Category = "Apparel" | "Footwear" | "Accessories" | "Home Goods" | "Electronics";
export type Warehouse = "Reno, NV" | "Columbus, OH" | "Allentown, PA";
export type Status = "Healthy" | "Low Stock" | "Backorder" | "Discontinued";

export type Sku = {
  id: string;
  code: string;
  name: string;
  category: Category;
  warehouse: Warehouse;
  onHand: number;
  reorderPoint: number;
  unitValue: number;
  supplier: string;
  leadTimeDays: number;
  lastRestock: string;
  discontinued: boolean;
  trend: number[];
  status: Status;
  deltaPct: number;
  totalValue: number;
};

type SkuInput = {
  code: string;
  name: string;
  category: Category;
  warehouse: Warehouse;
  onHand: number;
  reorderPoint: number;
  unitValue: number;
  supplier: string;
  leadTimeDays: number;
  lastRestock: string;
  discontinued?: boolean;
  slope: number;
  wobble: number;
};

const DAYS = 14;

/** Deterministic 14-point trend ending exactly at `end`. Trig wobble, no randomness. */
function buildTrend(end: number, slope: number, wobble: number, seed: number): number[] {
  const pts: number[] = [];
  for (let i = 0; i < DAYS; i++) {
    const daysFromEnd = DAYS - 1 - i;
    const raw = end + slope * daysFromEnd + wobble * Math.sin((seed + i) * 0.85);
    pts.push(Math.max(0, Math.round(raw)));
  }
  pts[DAYS - 1] = end;
  return pts;
}

function statusOf(onHand: number, reorderPoint: number, discontinued: boolean): Status {
  if (discontinued) return "Discontinued";
  if (onHand <= 0) return "Backorder";
  if (onHand <= reorderPoint) return "Low Stock";
  return "Healthy";
}

const RAW: SkuInput[] = [
  { code: "SKU-10412", name: "Merino Crew Sweater — Charcoal", category: "Apparel", warehouse: "Reno, NV", onHand: 240, reorderPoint: 80, unitValue: 58, supplier: "Highline Textiles", leadTimeDays: 14, lastRestock: "Aug 12", slope: -3, wobble: 5 },
  { code: "SKU-10413", name: "Organic Cotton Tee — Bone", category: "Apparel", warehouse: "Columbus, OH", onHand: 610, reorderPoint: 150, unitValue: 22, supplier: "Riverton Mills", leadTimeDays: 10, lastRestock: "Aug 15", slope: -6, wobble: 9 },
  { code: "SKU-10414", name: "Fleece-Lined Utility Jacket — Olive", category: "Apparel", warehouse: "Reno, NV", onHand: 34, reorderPoint: 40, unitValue: 118, supplier: "Highline Textiles", leadTimeDays: 21, lastRestock: "Jul 22", slope: 3, wobble: 3 },
  { code: "SKU-10415", name: "Relaxed Denim Trucker — Indigo", category: "Apparel", warehouse: "Allentown, PA", onHand: 185, reorderPoint: 60, unitValue: 89, supplier: "Northfield Goods", leadTimeDays: 18, lastRestock: "Aug 9", slope: -2, wobble: 6 },
  { code: "SKU-10416", name: "Waffle-Knit Henley — Rust", category: "Apparel", warehouse: "Columbus, OH", onHand: 0, reorderPoint: 50, unitValue: 42, supplier: "Riverton Mills", leadTimeDays: 14, lastRestock: "Jul 18", slope: 5, wobble: 4 },
  { code: "SKU-10417", name: "Packable Rain Shell — Slate", category: "Apparel", warehouse: "Reno, NV", onHand: 96, reorderPoint: 35, unitValue: 132, supplier: "Highline Textiles", leadTimeDays: 21, lastRestock: "Aug 6", slope: -1, wobble: 4 },

  { code: "SKU-20301", name: "Trail Runner Sneaker — Sand", category: "Footwear", warehouse: "Allentown, PA", onHand: 302, reorderPoint: 90, unitValue: 96, supplier: "Basecamp Mfg. Co.", leadTimeDays: 25, lastRestock: "Aug 14", slope: -4, wobble: 8 },
  { code: "SKU-20302", name: "Canvas Slip-On — Natural", category: "Footwear", warehouse: "Columbus, OH", onHand: 28, reorderPoint: 30, unitValue: 54, supplier: "Anchor Supply Co.", leadTimeDays: 16, lastRestock: "Jul 27", slope: 2, wobble: 3 },
  { code: "SKU-20303", name: "Insulated Winter Boot — Black", category: "Footwear", warehouse: "Reno, NV", onHand: 140, reorderPoint: 45, unitValue: 145, supplier: "Basecamp Mfg. Co.", leadTimeDays: 30, lastRestock: "Aug 4", slope: -2, wobble: 5 },
  { code: "SKU-20304", name: "Recycled Foam Sandal — Clay", category: "Footwear", warehouse: "Allentown, PA", onHand: 12, reorderPoint: 25, unitValue: 38, supplier: "Anchor Supply Co.", leadTimeDays: 20, lastRestock: "Jun 30", discontinued: true, slope: 1, wobble: 2 },
  { code: "SKU-20305", name: "All-Terrain Hiking Shoe — Moss", category: "Footwear", warehouse: "Columbus, OH", onHand: 0, reorderPoint: 40, unitValue: 128, supplier: "Basecamp Mfg. Co.", leadTimeDays: 28, lastRestock: "Jul 10", slope: 4, wobble: 5 },

  { code: "SKU-30201", name: "Canvas Tote — Natural", category: "Accessories", warehouse: "Reno, NV", onHand: 415, reorderPoint: 100, unitValue: 28, supplier: "Northfield Goods", leadTimeDays: 12, lastRestock: "Aug 16", slope: -5, wobble: 9 },
  { code: "SKU-30202", name: "Leather Card Wallet — Cognac", category: "Accessories", warehouse: "Columbus, OH", onHand: 268, reorderPoint: 70, unitValue: 34, supplier: "Anchor Supply Co.", leadTimeDays: 15, lastRestock: "Aug 10", slope: -2, wobble: 5 },
  { code: "SKU-30203", name: "Wool Beanie — Heather Grey", category: "Accessories", warehouse: "Allentown, PA", onHand: 41, reorderPoint: 45, unitValue: 19, supplier: "Highline Textiles", leadTimeDays: 14, lastRestock: "Jul 25", slope: 2, wobble: 3 },
  { code: "SKU-30204", name: "Woven Belt — Walnut", category: "Accessories", warehouse: "Reno, NV", onHand: 176, reorderPoint: 55, unitValue: 24, supplier: "Northfield Goods", leadTimeDays: 12, lastRestock: "Aug 8", slope: -1, wobble: 4 },
  { code: "SKU-30205", name: "Crossbody Sling Bag — Black", category: "Accessories", warehouse: "Columbus, OH", onHand: 0, reorderPoint: 35, unitValue: 46, supplier: "Anchor Supply Co.", leadTimeDays: 18, lastRestock: "Jul 15", slope: 4, wobble: 4 },

  { code: "SKU-40101", name: "Ceramic Pour-Over Kettle", category: "Home Goods", warehouse: "Allentown, PA", onHand: 88, reorderPoint: 30, unitValue: 62, supplier: "Vertex Components", leadTimeDays: 22, lastRestock: "Aug 3", slope: -1, wobble: 4 },
  { code: "SKU-40102", name: "Linen Throw Blanket — Fog", category: "Home Goods", warehouse: "Reno, NV", onHand: 22, reorderPoint: 25, unitValue: 48, supplier: "Highline Textiles", leadTimeDays: 20, lastRestock: "Jul 20", slope: 2, wobble: 3 },
  { code: "SKU-40103", name: "Cast Iron Skillet 10in", category: "Home Goods", warehouse: "Columbus, OH", onHand: 130, reorderPoint: 40, unitValue: 39, supplier: "Vertex Components", leadTimeDays: 24, lastRestock: "Aug 11", slope: -2, wobble: 4 },
  { code: "SKU-40104", name: "Stoneware Mug Set (4)", category: "Home Goods", warehouse: "Allentown, PA", onHand: 9, reorderPoint: 20, unitValue: 32, supplier: "Vertex Components", leadTimeDays: 24, lastRestock: "Jun 24", discontinued: true, slope: 1, wobble: 2 },
  { code: "SKU-40105", name: "Bamboo Cutting Board", category: "Home Goods", warehouse: "Reno, NV", onHand: 205, reorderPoint: 60, unitValue: 18, supplier: "Northfield Goods", leadTimeDays: 16, lastRestock: "Aug 13", slope: -3, wobble: 5 },

  { code: "SKU-50011", name: "USB-C Fast Charger 65W", category: "Electronics", warehouse: "Columbus, OH", onHand: 322, reorderPoint: 100, unitValue: 24, supplier: "Vertex Components", leadTimeDays: 30, lastRestock: "Aug 15", slope: -4, wobble: 7 },
  { code: "SKU-50012", name: "Wireless Charging Pad", category: "Electronics", warehouse: "Allentown, PA", onHand: 36, reorderPoint: 40, unitValue: 29, supplier: "Vertex Components", leadTimeDays: 28, lastRestock: "Jul 28", slope: 2, wobble: 3 },
  { code: "SKU-50013", name: "Noise-Isolating Earbuds", category: "Electronics", warehouse: "Reno, NV", onHand: 158, reorderPoint: 50, unitValue: 68, supplier: "Anchor Supply Co.", leadTimeDays: 32, lastRestock: "Aug 7", slope: -2, wobble: 5 },
  { code: "SKU-50014", name: "Portable Bluetooth Speaker", category: "Electronics", warehouse: "Columbus, OH", onHand: 0, reorderPoint: 30, unitValue: 54, supplier: "Anchor Supply Co.", leadTimeDays: 26, lastRestock: "Jul 12", slope: 4, wobble: 4 },
  { code: "SKU-50015", name: "Smart Plug 2-Pack", category: "Electronics", warehouse: "Allentown, PA", onHand: 44, reorderPoint: 45, unitValue: 26, supplier: "Vertex Components", leadTimeDays: 22, lastRestock: "Jul 30", slope: 2, wobble: 3 },
];

export const SKUS: Sku[] = RAW.map((r, i) => {
  const trend = buildTrend(r.onHand, r.slope, r.wobble, i * 3 + 1);
  const first = trend[0] || 1;
  const deltaPct = Math.round(((trend[DAYS - 1] - first) / first) * 100);
  const status = statusOf(r.onHand, r.reorderPoint, Boolean(r.discontinued));
  return {
    id: r.code,
    code: r.code,
    name: r.name,
    category: r.category,
    warehouse: r.warehouse,
    onHand: r.onHand,
    reorderPoint: r.reorderPoint,
    unitValue: r.unitValue,
    supplier: r.supplier,
    leadTimeDays: r.leadTimeDays,
    lastRestock: r.lastRestock,
    discontinued: Boolean(r.discontinued),
    trend,
    status,
    deltaPct,
    totalValue: Math.round(r.onHand * r.unitValue),
  };
});

export const CATEGORIES: Category[] = ["Apparel", "Footwear", "Accessories", "Home Goods", "Electronics"];
export const WAREHOUSES: Warehouse[] = ["Reno, NV", "Columbus, OH", "Allentown, PA"];
export const STATUSES: Status[] = ["Healthy", "Low Stock", "Backorder", "Discontinued"];

export const USD = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
export const USD2 = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
export const INT = new Intl.NumberFormat("en-US");

/** Average daily unit movement over the trend window — used for a "days of cover" estimate. */
export function dailyBurn(sku: Sku): number {
  const change = sku.trend[0] - sku.trend[DAYS - 1];
  return Math.max(1, Math.round(change / (DAYS - 1)));
}
