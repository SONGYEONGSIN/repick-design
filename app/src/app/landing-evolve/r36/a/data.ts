// Pure, deterministic data + derivation for the grade/category -> slope device.
// No Math.random / Date.now / new Date anywhere. Every number below is a fixed literal, and the
// one figure that moves with the two controls -- an item's AI-adjusted price -- is a plain
// arithmetic function of that item's own fixed attributes plus its category's fixed demand index.
// Same (category, grade) always produces the same rows, same highlight, same headline number.

export type CategoryId = "sneakers" | "handbags" | "watches" | "cameras";
export type GradeId = "likeNew" | "excellent" | "good" | "fair";

export interface GradeDef {
  id: GradeId;
  label: string;
}

// Slider order, best condition first -- index 0..3 is the slider's own value.
export const GRADES: GradeDef[] = [
  { id: "likeNew", label: "Like New" },
  { id: "excellent", label: "Excellent" },
  { id: "good", label: "Good" },
  { id: "fair", label: "Fair" },
];

export interface CategoryDef {
  id: CategoryId;
  label: string;
  plural: string;
  singular: string;
  photoId: string; // fixed images.unsplash.com/photo-<id>, one representative shot per category
  demandIndex: number; // 0-100, fixed -- category-level resale demand signal
}

export const CATEGORIES: CategoryDef[] = [
  {
    id: "sneakers",
    label: "Sneakers",
    plural: "sneakers",
    singular: "sneaker",
    photoId: "1595950653159-6c9ebd614d3a",
    demandIndex: 82,
  },
  {
    id: "handbags",
    label: "Handbags",
    plural: "handbags",
    singular: "handbag",
    photoId: "1584917865437-de89df76afd3",
    demandIndex: 68,
  },
  {
    id: "watches",
    label: "Watches",
    plural: "watches",
    singular: "watch",
    photoId: "1524805444843-089113d48a6d",
    demandIndex: 58,
  },
  {
    id: "cameras",
    label: "Cameras",
    plural: "cameras",
    singular: "camera",
    photoId: "1516035069371-29a1b244cc32",
    demandIndex: 63,
  },
];

export interface Item {
  id: string;
  categoryId: CategoryId;
  gradeId: GradeId;
  name: string;
  short: string;
  retailPrice: number; // original retail price when new, fixed
  listedPrice: number; // what the seller is actually asking right now, fixed
  conditionScore: number; // 0-100, fixed AI condition input behind this grade tier
  matchPct: number; // 0-100, fixed AI buyer-match score shown on the card
  reasonTags: [string, string];
}

// 4 categories x 4 grade tiers = 16 fixed comparables. Within a category, condition score and
// listed price were set independently of each other (as a real seller would set an asking price
// without running the grading math) -- the gap between them is what the AI price correction
// below actually closes, in both directions.
export const ITEMS: Item[] = [
  {
    id: "sneaker-like-new",
    categoryId: "sneakers",
    gradeId: "likeNew",
    name: "Nike Dunk Low Retro, unworn",
    short: "Nike Dunk Low",
    retailPrice: 110,
    listedPrice: 72,
    conditionScore: 95,
    matchPct: 94,
    reasonTags: ["No creasing across either toe box", "Original lace length, insole unmarked"],
  },
  {
    id: "sneaker-excellent",
    categoryId: "sneakers",
    gradeId: "excellent",
    name: "Adidas Samba OG, lightly worn",
    short: "Adidas Samba OG",
    retailPrice: 100,
    listedPrice: 70,
    conditionScore: 78,
    matchPct: 89,
    reasonTags: ["Light sole scuffing, even across both feet", "Suede nap intact at the toe"],
  },
  {
    id: "sneaker-good",
    categoryId: "sneakers",
    gradeId: "good",
    name: "New Balance 550, trail-worn",
    short: "New Balance 550",
    retailPrice: 100,
    listedPrice: 68,
    conditionScore: 56,
    matchPct: 81,
    reasonTags: ["Midsole yellowing consistent with age", "Outsole tread worn past half-life"],
  },
  {
    id: "sneaker-fair",
    categoryId: "sneakers",
    gradeId: "fair",
    name: "Converse Chuck 70, heavily creased",
    short: "Converse Chuck 70",
    retailPrice: 85,
    listedPrice: 55,
    conditionScore: 34,
    matchPct: 74,
    reasonTags: ["Deep vamp creasing at both forefeet", "Rubber sidewall yellowed and cracking"],
  },
  {
    id: "handbag-like-new",
    categoryId: "handbags",
    gradeId: "likeNew",
    name: "Saint Laurent Loulou, store sample",
    short: "Saint Laurent Loulou",
    retailPrice: 2650,
    listedPrice: 1450,
    conditionScore: 96,
    matchPct: 97,
    reasonTags: ["Hardware plating shows no handling marks", "Dust bag and tags still attached"],
  },
  {
    id: "handbag-excellent",
    categoryId: "handbags",
    gradeId: "excellent",
    name: "Coach Tabby shoulder bag",
    short: "Coach Tabby",
    retailPrice: 450,
    listedPrice: 290,
    conditionScore: 80,
    matchPct: 92,
    reasonTags: ["Leather corners show only light rub", "Interior lining clean, no staining"],
  },
  {
    id: "handbag-good",
    categoryId: "handbags",
    gradeId: "good",
    name: "Longchamp Le Pliage, faded corners",
    short: "Longchamp Le Pliage",
    retailPrice: 155,
    listedPrice: 95,
    conditionScore: 54,
    matchPct: 85,
    reasonTags: ["Nylon faded at both base corners", "Zipper pull worn smooth from use"],
  },
  {
    id: "handbag-fair",
    categoryId: "handbags",
    gradeId: "fair",
    name: "Fossil satchel, worn strap",
    short: "Fossil satchel",
    retailPrice: 228,
    listedPrice: 120,
    conditionScore: 32,
    matchPct: 78,
    reasonTags: ["Shoulder strap cracking at the fold line", "Base corners worn through the coating"],
  },
  {
    id: "watch-like-new",
    categoryId: "watches",
    gradeId: "likeNew",
    name: "Seiko 5 Sports, box and papers",
    short: "Seiko 5 Sports",
    retailPrice: 325,
    listedPrice: 210,
    conditionScore: 93,
    matchPct: 90,
    reasonTags: ["Crystal and bezel free of visible marks", "Full link set, warranty card included"],
  },
  {
    id: "watch-excellent",
    categoryId: "watches",
    gradeId: "excellent",
    name: "Tissot PRX, light clasp wear",
    short: "Tissot PRX",
    retailPrice: 525,
    listedPrice: 340,
    conditionScore: 76,
    matchPct: 86,
    reasonTags: ["Clasp shows light brushing from daily wear", "Dial and hands free of fading"],
  },
  {
    id: "watch-good",
    categoryId: "watches",
    gradeId: "good",
    name: "Citizen Eco-Drive, scratched crystal",
    short: "Citizen Eco-Drive",
    retailPrice: 325,
    listedPrice: 220,
    conditionScore: 58,
    matchPct: 79,
    reasonTags: ["Fine hairline scratches across the crystal", "Bracelet links show visible stretch"],
  },
  {
    id: "watch-fair",
    categoryId: "watches",
    gradeId: "fair",
    name: "Timex Weekender, cracked band",
    short: "Timex Weekender",
    retailPrice: 55,
    listedPrice: 38,
    conditionScore: 30,
    matchPct: 71,
    reasonTags: ["Nylon band cracking near the buckle", "Case back shows deep surface scoring"],
  },
  {
    id: "camera-like-new",
    categoryId: "cameras",
    gradeId: "likeNew",
    name: "Fujifilm X100V, under 500 shutter count",
    short: "Fujifilm X100V",
    retailPrice: 1600,
    listedPrice: 980,
    conditionScore: 94,
    matchPct: 93,
    reasonTags: ["Shutter count verified under 500 actuations", "Grip and dials show no handling wear"],
  },
  {
    id: "camera-excellent",
    categoryId: "cameras",
    gradeId: "excellent",
    name: "Sony A6400, light grip wear",
    short: "Sony A6400",
    retailPrice: 900,
    listedPrice: 560,
    conditionScore: 77,
    matchPct: 88,
    reasonTags: ["Light wear on the front grip texture only", "Sensor test clean, no visible dust"],
  },
  {
    id: "camera-good",
    categoryId: "cameras",
    gradeId: "good",
    name: "Canon EOS M50, scuffed body",
    short: "Canon EOS M50",
    retailPrice: 780,
    listedPrice: 480,
    conditionScore: 55,
    matchPct: 82,
    reasonTags: ["Body scuffing along both top edges", "Hot shoe contacts show light tarnish"],
  },
  {
    id: "camera-fair",
    categoryId: "cameras",
    gradeId: "fair",
    name: "Olympus PEN E-PL9, sticky shutter",
    short: "Olympus PEN E-PL9",
    retailPrice: 550,
    listedPrice: 290,
    conditionScore: 32,
    matchPct: 75,
    reasonTags: ["Shutter mechanism hesitates on first fire", "LCD hinge loose, screen still intact"],
  },
];

export function categoryById(id: CategoryId): CategoryDef {
  return CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[0];
}

export function gradeById(id: GradeId): GradeDef {
  return GRADES.find((g) => g.id === id) ?? GRADES[0];
}

export function gradeIndex(id: GradeId): number {
  return GRADES.findIndex((g) => g.id === id);
}

export function itemFor(categoryId: CategoryId, gradeId: GradeId): Item {
  const found = ITEMS.find((it) => it.categoryId === categoryId && it.gradeId === gradeId);
  if (!found) throw new Error(`No item for ${categoryId}/${gradeId}`);
  return found;
}

/**
 * Pure price-correction model: how much of an item's original retail price its condition still
 * "earns back" (0.20 floor so even a Fair item retains some value), scaled by how much the whole
 * category is currently in demand. Both factors are fixed per item/category -- nothing here is
 * randomized or re-pulled; the same item under the same category always resolves to the same
 * AI-adjusted price.
 */
export function conditionFactor(conditionScore: number): number {
  return 0.2 + 0.0075 * conditionScore;
}

export function demandFactor(demandIndex: number): number {
  return 0.85 + 0.0025 * demandIndex;
}

export function computeAiPrice(item: Item): number {
  const category = categoryById(item.categoryId);
  const raw = item.retailPrice * conditionFactor(item.conditionScore) * demandFactor(category.demandIndex);
  return Math.round(raw / 5) * 5;
}

export function deltaPct(listedPrice: number, aiPrice: number): number {
  return ((aiPrice - listedPrice) / listedPrice) * 100;
}

export type Direction = "up" | "down" | "flat";

export function directionOf(delta: number): Direction {
  if (delta > 0.5) return "up";
  if (delta < -0.5) return "down";
  return "flat";
}

// A Fair-grade item is still pending a second authentication pass -- every other grade is fully
// verified. Pure function of the grade id, not a stored flag, so it can never drift from the data.
export function isVerified(gradeId: GradeId): boolean {
  return gradeId !== "fair";
}

export interface SlopeRow {
  item: Item;
  grade: GradeDef;
  rowIndex: number; // fixed 0..3, same order as GRADES -- never reshuffled
  listedPrice: number;
  aiPrice: number;
  delta: number;
  direction: Direction;
}

/**
 * The 4 rows the slope chart draws for one category -- one per grade tier, in fixed slider order.
 * Row position never changes; only each row's own AI price (and therefore its line's angle) is
 * recomputed here, from the real per-item data above.
 */
export function computeCategoryRows(categoryId: CategoryId): SlopeRow[] {
  return GRADES.map((grade, rowIndex) => {
    const item = itemFor(categoryId, grade.id);
    const aiPrice = computeAiPrice(item);
    const delta = deltaPct(item.listedPrice, aiPrice);
    return {
      item,
      grade,
      rowIndex,
      listedPrice: item.listedPrice,
      aiPrice,
      delta,
      direction: directionOf(delta),
    };
  });
}

export interface CategorySummary {
  avgAbsDeltaPct: number;
  upCount: number;
  downCount: number;
  flatCount: number;
}

export function summarizeCategory(rows: SlopeRow[]): CategorySummary {
  const avgAbsDeltaPct = rows.reduce((s, r) => s + Math.abs(r.delta), 0) / rows.length;
  const upCount = rows.filter((r) => r.direction === "up").length;
  const downCount = rows.filter((r) => r.direction === "down").length;
  const flatCount = rows.length - upCount - downCount;
  return { avgAbsDeltaPct, upCount, downCount, flatCount };
}

// Shared by the hero CTA and the closing CTA -- one function, so the button label on both never
// drifts into two separately-typed restatements of the same selection.
export function buildCtaLabel(category: CategoryDef, grade: GradeDef): string {
  return `See ${category.label} at ${grade.label} grade`;
}

export function money(n: number): string {
  return `$${Math.round(n).toLocaleString("en-US")}`;
}

export function formatDelta(delta: number): string {
  const sign = delta > 0.5 ? "+" : delta < -0.5 ? "−" : "";
  return `${sign}${Math.abs(delta).toFixed(1)}%`;
}

export const DELTA_CLAMP_PCT = 80;

// --------------------------------------------------------------------------------------------------
// Social proof + trust strip -- fixed, deterministic.

export const TESTIMONIALS = [
  {
    name: "Priya Natarajan",
    context: "Bought a Fujifilm X100V through repick",
    quote:
      "The listing said Excellent and the AI price backed that up before I ever messaged the seller. No back-and-forth over what 'excellent' was supposed to mean.",
    rating: 5,
  },
  {
    name: "Marcus Webb",
    context: "Sells watches most months",
    quote:
      "I listed a Tissot at what felt fair. The grade said it was actually worth more than I asked -- I adjusted the price up before the first offer came in.",
    rating: 5,
  },
  {
    name: "Elena Cho",
    context: "First-time handbag seller",
    quote:
      "I would have priced the worn strap bag far too high. Seeing the Fair-grade line drop on the chart changed my asking price before anyone saw the listing.",
    rating: 4,
  },
] as const;

export const TRUST_STRIP = [
  { label: "Comparable listings graded to date", value: "184,000+" },
  { label: "Categories with a live price model", value: "12" },
  { label: "Buyers who check the AI price first", value: "91%" },
] as const;
