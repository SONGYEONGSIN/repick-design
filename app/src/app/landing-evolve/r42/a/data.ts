/**
 * Deterministic facet + product data for the "Why This One" rationale hero.
 * No Math.random / Date.now / new Date anywhere — every value below is a
 * fixed literal so the page renders identically on server and client.
 */

export type Budget = "under50" | "mid" | "over150";
export type ConditionTolerance = "like-new" | "good" | "any";
export type Category = "electronics" | "clothing" | "home";
export type ActualCondition = "like-new" | "good" | "fair";

export const BUDGETS: Budget[] = ["under50", "mid", "over150"];
export const CONDITIONS: ConditionTolerance[] = ["like-new", "good", "any"];
export const CATEGORIES: Category[] = ["electronics", "clothing", "home"];

export const BUDGET_LABEL: Record<Budget, string> = {
  under50: "Under $50",
  mid: "$50–150",
  over150: "$150+",
};

/** Used inside the rationale sentence — reads as a clause, not a label. */
export const BUDGET_PHRASE: Record<Budget, string> = {
  under50: "want to keep this under $50",
  mid: "want to stay in the $50–150 range",
  over150: "are willing to go above $150 for the right piece",
};

export const CONDITION_TOLERANCE_LABEL: Record<ConditionTolerance, string> = {
  "like-new": "Like New only",
  good: "Good or better",
  any: "Any condition",
};

export const CONDITION_PHRASE: Record<ConditionTolerance, string> = {
  "like-new": "will only accept Like New condition",
  good: "accept Good condition or better",
  any: "stay flexible on condition",
};

export const CATEGORY_LABEL: Record<Category, string> = {
  electronics: "Electronics",
  clothing: "Clothing",
  home: "Home",
};

export const ACTUAL_CONDITION_LABEL: Record<ActualCondition, string> = {
  "like-new": "Like New",
  good: "Good",
  fair: "Fair",
};

export type Product = {
  name: string;
  price: number;
  listPrice: number;
  condition: ActualCondition;
  matchPct: number;
  sales: number;
  discount: number;
};

/**
 * One concrete product per (category × budget × condition-tolerance) cell —
 * 27 cells total. The item's actual condition always lands inside the
 * selected tolerance band (Like New → like-new; Good or better → good;
 * Any condition → fair, to make the savings-for-flexibility trade visible).
 * Every number is hand-set; nothing here is generated at request time.
 */
export const PRODUCTS: Record<Category, Record<Budget, Record<ConditionTolerance, Product>>> = {
  electronics: {
    under50: {
      "like-new": { name: "Wired Earbuds", price: 22, listPrice: 45, condition: "like-new", matchPct: 92, sales: 184, discount: 51 },
      good: { name: "Phone Case Bundle", price: 16, listPrice: 34, condition: "good", matchPct: 88, sales: 96, discount: 53 },
      any: { name: "USB-C Hub, 6-Port", price: 19, listPrice: 42, condition: "fair", matchPct: 90, sales: 61, discount: 55 },
    },
    mid: {
      "like-new": { name: "Noise-Cancel Headphones", price: 129, listPrice: 299, condition: "like-new", matchPct: 94, sales: 212, discount: 57 },
      good: { name: "Mechanical Keyboard", price: 88, listPrice: 180, condition: "good", matchPct: 91, sales: 143, discount: 51 },
      any: { name: "Bluetooth Speaker, Mid-Size", price: 64, listPrice: 160, condition: "fair", matchPct: 89, sales: 77, discount: 60 },
    },
    over150: {
      "like-new": { name: "10-Inch Tablet", price: 219, listPrice: 449, condition: "like-new", matchPct: 95, sales: 168, discount: 51 },
      good: { name: "Mirrorless Camera Body", price: 310, listPrice: 620, condition: "good", matchPct: 90, sales: 132, discount: 50 },
      any: { name: "Gaming Laptop, 15-Inch", price: 420, listPrice: 999, condition: "fair", matchPct: 87, sales: 54, discount: 58 },
    },
  },
  clothing: {
    under50: {
      "like-new": { name: "Cotton Crewneck Tee", price: 14, listPrice: 32, condition: "like-new", matchPct: 91, sales: 302, discount: 56 },
      good: { name: "Denim Button-Up", price: 26, listPrice: 58, condition: "good", matchPct: 89, sales: 177, discount: 55 },
      any: { name: "Graphic Tote Bag", price: 11, listPrice: 28, condition: "fair", matchPct: 86, sales: 84, discount: 61 },
    },
    mid: {
      "like-new": { name: "Wool Peacoat", price: 118, listPrice: 260, condition: "like-new", matchPct: 93, sales: 221, discount: 55 },
      good: { name: "Leather Chelsea Boots", price: 92, listPrice: 195, condition: "good", matchPct: 90, sales: 154, discount: 53 },
      any: { name: "Canvas Field Jacket", price: 68, listPrice: 150, condition: "fair", matchPct: 88, sales: 99, discount: 55 },
    },
    over150: {
      "like-new": { name: "Shearling Bomber Jacket", price: 235, listPrice: 480, condition: "like-new", matchPct: 94, sales: 140, discount: 51 },
      good: { name: "Leather Weekend Duffel", price: 188, listPrice: 390, condition: "good", matchPct: 90, sales: 112, discount: 52 },
      any: { name: "Down Parka, Long", price: 162, listPrice: 420, condition: "fair", matchPct: 86, sales: 47, discount: 61 },
    },
  },
  home: {
    under50: {
      "like-new": { name: "Ceramic Mug Set", price: 19, listPrice: 40, condition: "like-new", matchPct: 90, sales: 265, discount: 53 },
      good: { name: "Cotton Throw Blanket", price: 24, listPrice: 52, condition: "good", matchPct: 88, sales: 138, discount: 54 },
      any: { name: "Enamel Dutch Pot, Small", price: 21, listPrice: 46, condition: "fair", matchPct: 85, sales: 72, discount: 54 },
    },
    mid: {
      "like-new": { name: "Ceramic Dutch Oven", price: 124, listPrice: 280, condition: "like-new", matchPct: 93, sales: 196, discount: 56 },
      good: { name: "Oak Side Table", price: 79, listPrice: 165, condition: "good", matchPct: 90, sales: 121, discount: 52 },
      any: { name: "Cast-Iron Skillet Set", price: 58, listPrice: 135, condition: "fair", matchPct: 87, sales: 63, discount: 57 },
    },
    over150: {
      "like-new": { name: "Mid-Century Armchair", price: 260, listPrice: 540, condition: "like-new", matchPct: 92, sales: 108, discount: 52 },
      good: { name: "Walnut Bookshelf", price: 205, listPrice: 420, condition: "good", matchPct: 89, sales: 85, discount: 51 },
      any: { name: "Wool Area Rug, 8×10", price: 171, listPrice: 450, condition: "fair", matchPct: 86, sales: 39, discount: 62 },
    },
  },
};

export function getProduct(category: Category, budget: Budget, tolerance: ConditionTolerance): Product {
  return PRODUCTS[category][budget][tolerance];
}

/** The deterministic, templated rationale paragraph — string interpolation only, no LLM call. */
export function buildRationale(category: Category, budget: Budget, tolerance: ConditionTolerance, product: Product): string {
  const categoryLower = CATEGORY_LABEL[category].toLowerCase();
  return `Because you ${BUDGET_PHRASE[budget]} and ${CONDITION_PHRASE[tolerance]} while looking at ${categoryLower}, we lead with listings whose price history and condition report already clear that bar. Today's top match is the ${product.name} at $${product.price} (${ACTUAL_CONDITION_LABEL[product.condition]} condition) — ${product.discount}% under its original $${product.listPrice} — from a seller with ${product.sales} verified sales and a ${product.matchPct}% fit to your three filters.`;
}

export type ScoreLine = { label: string; detail: string };

/** The three scoring factors shown in the expandable "how we scored this" detail. */
export function buildScoreLines(category: Category, budget: Budget, tolerance: ConditionTolerance, product: Product): ScoreLine[] {
  return [
    {
      label: "Budget",
      detail: `Priced at $${product.price}, inside your ${BUDGET_LABEL[budget]} ceiling.`,
    },
    {
      label: "Condition",
      detail: `Graded ${ACTUAL_CONDITION_LABEL[product.condition]}, which clears "${CONDITION_TOLERANCE_LABEL[tolerance]}."`,
    },
    {
      label: "Category",
      detail: `Tagged ${CATEGORY_LABEL[category]}, matching your filter exactly.`,
    },
  ];
}

/** Per-category gradient stops + glyph hint for the generated product-photo placeholder. */
export const CATEGORY_SWATCH: Record<Category, { from: string; to: string }> = {
  electronics: { from: "#FFEDD5", to: "#FDBA74" },
  clothing: { from: "#FFE4D5", to: "#FB923C" },
  home: { from: "#FFF1E6", to: "#FCA35D" },
};
