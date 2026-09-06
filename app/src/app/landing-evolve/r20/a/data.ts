// Pure, deterministic estimate engine for the qualification wizard.
// No randomness, no Date/time — the same Answers object always produces the same Estimate,
// which is what lets "back" restore prior state for free: state is derived, never accumulated.

export type CategoryId = "bags" | "outerwear" | "sneakers" | "watches";
export type ConditionId = "likenew" | "gentle" | "visible";
export type TierId = "designer" | "midrange" | "everyday";
export type BandId = "under200" | "200to500" | "over500";
export type StepKey = "category" | "condition" | "tier" | "band";

export interface Answers {
  category?: CategoryId;
  condition?: ConditionId;
  tier?: TierId;
  band?: BandId;
}

export const STEP_KEYS: StepKey[] = ["category", "condition", "tier", "band"];

export interface CategoryDef {
  id: CategoryId;
  label: string;
  noun: string;
  range: [number, number];
  comps: number;
  retail: number;
  icon: "bag" | "shirt" | "footprints" | "watch";
}

export interface ConditionDef {
  id: ConditionId;
  label: string;
  centerMult: number;
  grade: "A" | "B" | "C";
}

export interface TierDef {
  id: TierId;
  label: string;
  centerMult: number;
}

export interface BandDef {
  id: BandId;
  label: string;
  centerMult: number;
}

export const CATEGORIES: CategoryDef[] = [
  { id: "bags", label: "Bags & Accessories", noun: "bags", range: [40, 640], comps: 5400, retail: 780, icon: "bag" },
  { id: "outerwear", label: "Outerwear", noun: "outerwear", range: [30, 480], comps: 6800, retail: 540, icon: "shirt" },
  { id: "sneakers", label: "Sneakers", noun: "sneakers", range: [25, 380], comps: 8100, retail: 460, icon: "footprints" },
  { id: "watches", label: "Watches", noun: "watches", range: [60, 1200], comps: 2300, retail: 1450, icon: "watch" },
];

export const CONDITIONS: ConditionDef[] = [
  { id: "likenew", label: "Like new", centerMult: 1.15, grade: "A" },
  { id: "gentle", label: "Gently worn", centerMult: 0.95, grade: "B" },
  { id: "visible", label: "Visible wear", centerMult: 0.65, grade: "C" },
];

export const TIERS: TierDef[] = [
  { id: "designer", label: "Designer / luxury brand", centerMult: 1.35 },
  { id: "midrange", label: "Mid-range brand", centerMult: 1.0 },
  { id: "everyday", label: "Everyday brand", centerMult: 0.7 },
];

export const BANDS: BandDef[] = [
  { id: "under200", label: "Paid under $200", centerMult: 0.85 },
  { id: "200to500", label: "Paid $200–$500", centerMult: 1.0 },
  { id: "over500", label: "Paid $500 or more", centerMult: 1.2 },
];

export const STEP_QUESTIONS: Record<StepKey, { title: string; subtitle: string }> = {
  category: { title: "What are you selling?", subtitle: "Pick the closest category." },
  condition: { title: "What condition is it in?", subtitle: "Be honest — this drives the range." },
  tier: { title: "What's the brand tier?", subtitle: "Luxury, mid-range, or everyday." },
  band: { title: "What did you pay originally?", subtitle: "Helps anchor the ceiling." },
};

const DEFAULT_RANGE: [number, number] = [25, 1200];
const DEFAULT_COMPS = 18200;
const DEFAULT_RETAIL = 1050;

const MATCH_PCT_BY_COUNT = [74, 81, 88, 94, 97] as const;

function round5(n: number): number {
  return Math.round(n / 5) * 5;
}
function round10(n: number): number {
  return Math.round(n / 10) * 10;
}

export interface Estimate {
  low: number;
  high: number;
  comps: number;
  confidence: "Broad range" | "Solid estimate" | "High-confidence estimate";
  reasoning: string;
  matchPct: number;
  grade: "A" | "B" | "C";
  discountPct: number;
  before: number;
  mid: number;
  category?: CategoryDef;
  answeredCount: number;
}

function buildReasoning(
  answers: Answers,
  category: CategoryDef | undefined,
  comps: number,
  condition: ConditionDef | undefined,
): string {
  const compsText = comps.toLocaleString("en-US");
  if (!answers.category) {
    return "Estimate spans repick's full resale catalog — choose a category to start narrowing it down.";
  }
  const noun = category ? category.noun : "items";
  if (!answers.condition) {
    return `${compsText} comparable ${noun} sales, before condition is factored in.`;
  }
  if (!answers.tier) {
    return `${compsText} comps in ${condition ? condition.label.toLowerCase() : "similar"} condition — add a brand tier to sharpen it.`;
  }
  if (!answers.band) {
    return `${compsText} comps matched on category, condition and brand tier.`;
  }
  return `${compsText} comps matched on all four answers — this is close to your final offer.`;
}

export function computeEstimate(answers: Answers): Estimate {
  const category = answers.category ? CATEGORIES.find((c) => c.id === answers.category) : undefined;
  const condition = answers.condition ? CONDITIONS.find((c) => c.id === answers.condition) : undefined;
  const tier = answers.tier ? TIERS.find((t) => t.id === answers.tier) : undefined;
  const band = answers.band ? BANDS.find((b) => b.id === answers.band) : undefined;

  let low: number;
  let high: number;
  let comps: number;
  const before = category ? category.retail : DEFAULT_RETAIL;

  if (category) {
    [low, high] = category.range;
    comps = category.comps;
  } else {
    [low, high] = DEFAULT_RANGE;
    comps = DEFAULT_COMPS;
  }

  const apply = (centerMult: number, widthShrink: number, compsShrink: number) => {
    const mid = ((low + high) / 2) * centerMult;
    const width = (high - low) * widthShrink;
    low = mid - width / 2;
    high = mid + width / 2;
    comps = comps * compsShrink;
  };

  if (condition) apply(condition.centerMult, 0.62, 0.55);
  if (tier) apply(tier.centerMult, 0.6, 0.55);
  if (band) apply(band.centerMult, 0.55, 0.5);

  low = Math.max(5, round5(low));
  high = Math.max(low + 5, round5(high));
  comps = Math.max(40, round10(comps));

  const answeredCount = [answers.category, answers.condition, answers.tier, answers.band].filter(Boolean).length;
  const matchPct = MATCH_PCT_BY_COUNT[answeredCount];
  const grade = condition ? condition.grade : "B";
  const mid = Math.round((low + high) / 2);
  const discountPct = Math.min(95, Math.max(0, Math.round((1 - mid / before) * 100)));
  const confidence: Estimate["confidence"] = comps >= 2500 ? "Broad range" : comps >= 900 ? "Solid estimate" : "High-confidence estimate";
  const reasoning = buildReasoning(answers, category, comps, condition);

  return { low, high, comps, confidence, reasoning, matchPct, grade, discountPct, before, mid, category, answeredCount };
}

export interface Listing {
  id: string;
  title: string;
  category: CategoryId;
  original: number;
  current: number;
  grade: "A" | "A-" | "B+" | "B";
  tags: string[];
  icon: CategoryDef["icon"];
}

export const LISTINGS: Listing[] = [
  {
    id: "tote",
    title: "Structured Leather Tote",
    category: "bags",
    original: 780,
    current: 214,
    grade: "A-",
    tags: ["Similar to 3 saved items", "High demand this week"],
    icon: "bag",
  },
  {
    id: "coat",
    title: "Recycled Wool Overcoat",
    category: "outerwear",
    original: 540,
    current: 168,
    grade: "B+",
    tags: ["Matches your outerwear searches", "Rare size in stock"],
    icon: "shirt",
  },
  {
    id: "sneaker",
    title: "Retro Court Sneakers",
    category: "sneakers",
    original: 185,
    current: 61,
    grade: "A",
    tags: ["Trending in your area", "Below average resale price"],
    icon: "footprints",
  },
  {
    id: "watch",
    title: "Automatic Field Watch",
    category: "watches",
    original: 1290,
    current: 402,
    grade: "B",
    tags: ["Verified serial number", "Similar spec to saved items"],
    icon: "watch",
  },
];

export function discountPct(original: number, current: number): number {
  return Math.round((1 - current / original) * 100);
}
