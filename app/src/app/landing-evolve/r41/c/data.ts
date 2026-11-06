// Deterministic catalog + match-quiz content. No Math.random / Date — every
// number is a fixed literal so the page renders identically on every load
// and on the server.

export type Category = "Footwear" | "Outerwear" | "Bags" | "Watches";
export type Budget = "Under $100" | "$100–$300" | "$300+";
export type Tolerance = "Like New only" | "Good or better" | "Any condition";
export type Grade = "Like New" | "Excellent" | "Very Good" | "Good" | "Fair";

const GRADE_RANK: Record<Grade, number> = {
  "Like New": 5,
  Excellent: 4,
  "Very Good": 3,
  Good: 2,
  Fair: 1,
};

const TOLERANCE_FLOOR: Record<Tolerance, number> = {
  "Like New only": 5,
  "Good or better": 2,
  "Any condition": 1,
};

function inBudget(price: number, budget: Budget): boolean {
  if (budget === "Under $100") return price < 100;
  if (budget === "$100–$300") return price >= 100 && price <= 300;
  return price > 300;
}

export type PoolItem = {
  id: string;
  name: string;
  category: Category;
  price: number;
  originalPrice: number;
  grade: Grade;
  matchBase: number;
  verified: boolean;
  discountPct: number;
  photoId: string;
  alt: string;
};

export const POOL: PoolItem[] = [
  { id: "canvas-sneaker", name: "Canvas Sneaker — Low", category: "Footwear", price: 58, originalPrice: 94, grade: "Good", matchBase: 88, verified: true, discountPct: 38, photoId: "1542291026-7eec264c27ff", alt: "A low-top white canvas sneaker against a plain background" },
  { id: "trail-runner", name: "Trail Runner — Mid", category: "Footwear", price: 178, originalPrice: 342, grade: "Excellent", matchBase: 95, verified: true, discountPct: 48, photoId: "1556906781-9a412961c28c", alt: "A grey and orange trail running shoe against a plain background" },
  { id: "dress-oxford", name: "Dress Oxford — Resole", category: "Footwear", price: 340, originalPrice: 560, grade: "Very Good", matchBase: 90, verified: true, discountPct: 39, photoId: "1614252369475-531eba835eb1", alt: "A brown leather dress oxford shoe against a plain background" },
  { id: "shell-jacket", name: "Shell Jacket — Trail", category: "Outerwear", price: 42, originalPrice: 88, grade: "Good", matchBase: 86, verified: true, discountPct: 52, photoId: "1551028719-00167b16eac5", alt: "A grey waterproof shell jacket laid flat against a plain background" },
  { id: "down-parka", name: "Down Parka — Arctic", category: "Outerwear", price: 320, originalPrice: 680, grade: "Like New", matchBase: 97, verified: true, discountPct: 53, photoId: "1544923246-77307dd654cb", alt: "A navy down parka with a fur-trimmed hood against a plain background" },
  { id: "day-pack", name: "Day Pack — Canvas", category: "Bags", price: 112, originalPrice: 190, grade: "Excellent", matchBase: 90, verified: false, discountPct: 41, photoId: "1553062407-98eeb64c6a62", alt: "A tan canvas day backpack against a plain background" },
  { id: "carry-on", name: "Carry-On — Hardshell", category: "Bags", price: 640, originalPrice: 914, grade: "Excellent", matchBase: 92, verified: false, discountPct: 30, photoId: "1565026057447-bc90a3dceb87", alt: "A black hardshell carry-on suitcase against a plain background" },
  { id: "field-watch", name: "Field Watch — Steel", category: "Watches", price: 99, originalPrice: 152, grade: "Very Good", matchBase: 85, verified: true, discountPct: 35, photoId: "1523275335684-37898b6baf30", alt: "A steel field watch with a green dial against a plain background" },
  { id: "dive-watch", name: "Dive Watch — Automatic", category: "Watches", price: 228, originalPrice: 330, grade: "Very Good", matchBase: 88, verified: false, discountPct: 31, photoId: "1524805444758-089113d48a6d", alt: "A stainless steel dive watch with a blue dial against a plain background" },
  { id: "chronograph", name: "Chronograph — Titanium", category: "Watches", price: 540, originalPrice: 818, grade: "Excellent", matchBase: 94, verified: true, discountPct: 34, photoId: "1522312346375-d1a52e2b99b3", alt: "A titanium chronograph watch against a plain background" },
];

export const CATEGORIES: Category[] = ["Footwear", "Outerwear", "Bags", "Watches"];
export const BUDGETS: Budget[] = ["Under $100", "$100–$300", "$300+"];
export const TOLERANCES: Tolerance[] = ["Like New only", "Good or better", "Any condition"];

export const DEFAULT_CATEGORY: Category = "Footwear";
export const DEFAULT_BUDGET: Budget = "$100–$300";
export const DEFAULT_TOLERANCE: Tolerance = "Good or better";

export type MatchResult = {
  best: PoolItem | null;
  alts: PoolItem[];
  poolSize: number;
};

/** The single computation every live output on this page shares. */
export function findMatch(
  category: Category,
  budget: Budget,
  tolerance: Tolerance,
): MatchResult {
  const floor = TOLERANCE_FLOOR[tolerance];
  const candidates = POOL
    .filter((i) => i.category === category)
    .filter((i) => inBudget(i.price, budget))
    .filter((i) => GRADE_RANK[i.grade] >= floor)
    .sort((a, b) => b.matchBase - a.matchBase || a.price - b.price);

  return {
    best: candidates[0] ?? null,
    alts: candidates.slice(1, 3),
    poolSize: candidates.length,
  };
}

export function formatPrice(n: number): string {
  return `$${n.toLocaleString("en-US")}`;
}

// Fixed showcase pair for the hero's always-visible proof row — independent
// of the quiz answers below, so the fold-1 proof never depends on state.
export const HERO_SHOWCASE_IDS = ["trail-runner", "down-parka"];
