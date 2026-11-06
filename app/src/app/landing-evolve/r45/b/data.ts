// Deterministic match-reasoning model for the "Match Reasoning Tree" candidate.
//
// Three sequential single-choice questions (budget -> category -> condition tolerance)
// each pick one option from a fixed set of three. The terminal leaf is NOT a lookup table
// of 27 pre-written results — it is a pure three-factor formula over the three chosen
// option ids, mirroring the "fixed closed-form function of the inputs" pattern used
// elsewhere in this catalog (see r44/c `dailyRate`). Same three answers always produce the
// exact same leaf, on server and client, on every render. No Math.random / Date.now / new Date.

export type BudgetId = "under50" | "mid" | "high";
export type CategoryId = "furniture" | "apparel" | "electronics";
export type ConditionId = "likeNew" | "light" | "wellLoved";
export type QuestionId = "budget" | "category" | "condition";

export type OptionDef = { id: string; label: string };

export type QuestionDef = {
  id: QuestionId;
  prompt: string;
  helper: string;
  options: OptionDef[];
};

export const BUDGET_QUESTION: QuestionDef = {
  id: "budget",
  prompt: "What's your budget range?",
  helper: "This sets how wide the seller pool is before anything else narrows it.",
  options: [
    { id: "under50", label: "Under $50" },
    { id: "mid", label: "$50 – $200" },
    { id: "high", label: "$200+" },
  ],
};

export const CATEGORY_QUESTION: QuestionDef = {
  id: "category",
  prompt: "What are you shopping for?",
  helper: "Category changes how much active resale demand there is to match against.",
  options: [
    { id: "furniture", label: "Furniture" },
    { id: "apparel", label: "Apparel" },
    { id: "electronics", label: "Electronics" },
  ],
};

export const CONDITION_QUESTION: QuestionDef = {
  id: "condition",
  prompt: "How much wear can you live with?",
  helper: "Widening condition tolerance widens the pool again — this is the last branch.",
  options: [
    { id: "likeNew", label: "Like-new only" },
    { id: "light", label: "Light wear OK" },
    { id: "wellLoved", label: "Well-loved OK" },
  ],
};

export const QUESTIONS: QuestionDef[] = [BUDGET_QUESTION, CATEGORY_QUESTION, CONDITION_QUESTION];

// Total distinct paths through the tree — a fixed structural count (3 x 3 x 3), computed
// from the question set itself rather than typed as a literal, so it can never drift from
// the actual number of branches rendered below.
export const TOTAL_PATHS = QUESTIONS.reduce((acc, q) => acc * q.options.length, 1);

export type Answers = {
  budget: BudgetId | null;
  category: CategoryId | null;
  condition: ConditionId | null;
};

export const EMPTY_ANSWERS: Answers = { budget: null, category: null, condition: null };

// ---- The one formula every one of the 27 paths runs through ----
// Seller-pool and sale-speed factors per option. These are the only per-option numbers in
// the model; everything a visitor sees is derived from them, not written per combination.
const BUDGET_FACTOR: Record<BudgetId, number> = { under50: 0.85, mid: 1.15, high: 0.65 };
const CATEGORY_FACTOR: Record<CategoryId, number> = { furniture: 1.0, apparel: 1.5, electronics: 0.7 };
const CONDITION_FACTOR: Record<ConditionId, number> = { likeNew: 0.6, light: 1.0, wellLoved: 1.35 };

const BASE_SELLERS = 48;
const BASE_DAYS = 14;
const MIN_SELLERS = 6;
const MIN_DAYS = 3;
const MAX_DAYS = 21;

const BUDGET_LEAF_LABEL: Record<BudgetId, string> = { under50: "under $50", mid: "$50–$200", high: "$200+" };
const CATEGORY_LEAF_LABEL: Record<CategoryId, string> = { furniture: "furniture", apparel: "apparel", electronics: "electronics" };
const CONDITION_LEAF_LABEL: Record<ConditionId, string> = { likeNew: "like-new only", light: "light wear", wellLoved: "well-loved" };

export type Match = {
  archetype: string;
  sellers: number;
  days: number;
  sentence: string;
  factors: { budget: number; category: number; condition: number };
};

/** Pure function of the three chosen option ids. Returns null until all three are picked. */
export function computeMatch(answers: Answers): Match | null {
  const { budget, category, condition } = answers;
  if (!budget || !category || !condition) return null;

  const bF = BUDGET_FACTOR[budget];
  const cF = CATEGORY_FACTOR[category];
  const wF = CONDITION_FACTOR[condition];

  const sellers = Math.max(MIN_SELLERS, Math.round(BASE_SELLERS * bF * cF * wF));
  const days = Math.min(MAX_DAYS, Math.max(MIN_DAYS, Math.round(BASE_DAYS / (cF * wF))));
  const archetype = `${CATEGORY_LEAF_LABEL[category]}, ${BUDGET_LEAF_LABEL[budget]}, ${CONDITION_LEAF_LABEL[condition]}`;
  const sentence = `${archetype} — ${sellers} active sellers, avg ${days}-day sale.`;

  return { archetype, sellers, days, sentence, factors: { budget: bF, category: cF, condition: wF } };
}

export const TESTIMONIALS = [
  {
    id: "t1",
    name: "Priya K.",
    role: "Buyer, moved apartments twice this year",
    quote:
      "I always assumed resale search just filtered a list. Watching my three answers light an actual path made it obvious why the result changes when I change one thing.",
  },
  {
    id: "t2",
    name: "Owen D.",
    role: "Seller, furniture and home goods",
    quote:
      "The seller-count math is the same formula no matter what you click. I ran my own listing through all three questions before pricing it, and the sale landed inside the range it predicted.",
  },
] as const;
