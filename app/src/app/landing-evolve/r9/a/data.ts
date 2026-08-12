/**
 * The whole page is one pure function of five integers.
 *
 * Everything a visitor can see — the sentence at the top, the order of the four cards, each match
 * score, each reason tag, the prose that argues the order, the three value figures — is derived
 * here from `BriefState`. No timers, no randomness, no dates: the same five indices always produce
 * the same page, on the server and after hydration.
 */

export type Category = "film camera" | "road bike" | "wool overcoat";
export type Grade = "mint" | "good" | "fair";

export type Listing = {
  id: string;
  name: string;
  category: Category;
  seller: string;
  verified: boolean;
  grade: Grade;
  price: number;
  listPrice: number;
  spec: string;
};

export const GRADE_META: Record<Grade, { code: string; label: string }> = {
  mint: { code: "A", label: "Mint" },
  good: { code: "B", label: "Good" },
  fair: { code: "C", label: "Well-worn" },
};

const GRADE_ORDER: Grade[] = ["mint", "good", "fair"];

/** Twelve invented listings, four per category. Sellers are invented shop names, not people. */
export const POOL: Listing[] = [
  {
    id: "kestrel-k2",
    name: "Kestrel K2 Rangefinder",
    category: "film camera",
    seller: "Northlight Optics",
    verified: true,
    grade: "mint",
    price: 388,
    listPrice: 640,
    spec: "45mm f/2 · shutter re-timed",
  },
  {
    id: "aperture-7",
    name: "Aperture 7 SLR Body",
    category: "film camera",
    seller: "Grain & Halide",
    verified: true,
    grade: "good",
    price: 265,
    listPrice: 450,
    spec: "Body only · new light seals",
  },
  {
    id: "halcyon-35",
    name: "Halcyon Auto 35",
    category: "film camera",
    seller: "Meridian Film Co.",
    verified: false,
    grade: "mint",
    price: 470,
    listPrice: 720,
    spec: "Boxed · two rolls shot",
  },
  {
    id: "foldwell-400",
    name: "Foldwell Compact 400",
    category: "film camera",
    seller: "Cassette Camera Works",
    verified: true,
    grade: "fair",
    price: 175,
    listPrice: 330,
    spec: "Bellows patched · meter dead",
  },
  {
    id: "corvid-sprint",
    name: "Corvid Alloy Sprint",
    category: "road bike",
    seller: "Ridgeline Cycles",
    verified: true,
    grade: "good",
    price: 620,
    listPrice: 1150,
    spec: "56cm · 105 groupset",
  },
  {
    id: "marlow-tourer",
    name: "Marlow Steel Tourer",
    category: "road bike",
    seller: "Copperworks Bikes",
    verified: true,
    grade: "mint",
    price: 940,
    listPrice: 1580,
    spec: "54cm · Reynolds 725 tubing",
  },
  {
    id: "vantage-cx",
    name: "Vantage CX Frameset",
    category: "road bike",
    seller: "Southbound Velo",
    verified: false,
    grade: "good",
    price: 340,
    listPrice: 720,
    spec: "Frame and fork · one paint chip",
  },
  {
    id: "pacer-12",
    name: "Pacer 12 Commuter",
    category: "road bike",
    seller: "Union Street Cyclery",
    verified: true,
    grade: "fair",
    price: 245,
    listPrice: 480,
    spec: "52cm · drivetrain worn",
  },
  {
    id: "thornfield-melton",
    name: "Thornfield Melton Coat",
    category: "wool overcoat",
    seller: "Archive Room",
    verified: true,
    grade: "mint",
    price: 310,
    listPrice: 690,
    spec: "40R · unworn, tags on",
  },
  {
    id: "lowry-herringbone",
    name: "Lowry Herringbone Overcoat",
    category: "wool overcoat",
    seller: "Second Fold",
    verified: true,
    grade: "good",
    price: 195,
    listPrice: 420,
    spec: "42R · relined once",
  },
  {
    id: "sable-cashmere",
    name: "Sable Cashmere Blend",
    category: "wool overcoat",
    seller: "Fieldnote Vintage",
    verified: false,
    grade: "mint",
    price: 520,
    listPrice: 1100,
    spec: "38R · stored, no moth damage",
  },
  {
    id: "grendon-duffle",
    name: "Grendon Duffle",
    category: "wool overcoat",
    seller: "Harbour Supply",
    verified: true,
    grade: "fair",
    price: 140,
    listPrice: 310,
    spec: "44R · toggles replaced",
  },
];

export const CONDITION_OPTIONS: { phrase: string; grade: Grade }[] = [
  { phrase: "mint-condition", grade: "mint" },
  { phrase: "gently-used", grade: "good" },
  { phrase: "well-loved", grade: "fair" },
];

export const CATEGORY_OPTIONS: { phrase: string; category: Category }[] = [
  { phrase: "film camera", category: "film camera" },
  { phrase: "road bike", category: "road bike" },
  { phrase: "wool overcoat", category: "wool overcoat" },
];

export const BUDGET_OPTIONS: { phrase: string; value: number }[] = [
  { phrase: "$400", value: 400 },
  { phrase: "$700", value: 700 },
  { phrase: "$1,200", value: 1200 },
];

export const SELLER_OPTIONS: { phrase: string; verifiedOnly: boolean }[] = [
  { phrase: "a verified seller", verifiedOnly: true },
  { phrase: "any seller", verifiedOnly: false },
];

export const READING_OPTIONS: { phrase: string; strict: boolean }[] = [
  { phrase: "the strictest reading", strict: true },
  { phrase: "a forgiving reading", strict: false },
];

export type SlotKey = "condition" | "category" | "budget" | "seller";

export const SLOT_ORDER: SlotKey[] = ["condition", "category", "budget", "seller"];

export const SLOT_META: Record<SlotKey, { label: string; hint: string }> = {
  condition: { label: "Condition", hint: "How much wear you will accept" },
  category: { label: "Category", hint: "What you are actually shopping for" },
  budget: { label: "Ceiling", hint: "The most you will pay" },
  seller: { label: "Seller", hint: "Who you will buy from" },
};

export type BriefState = {
  condition: number;
  category: number;
  budget: number;
  seller: number;
  reading: number;
};

export const INITIAL_BRIEF: BriefState = {
  condition: 0,
  category: 0,
  budget: 0,
  seller: 0,
  reading: 0,
};

export function phrasesFor(slot: SlotKey): string[] {
  if (slot === "condition") return CONDITION_OPTIONS.map((o) => o.phrase);
  if (slot === "category") return CATEGORY_OPTIONS.map((o) => o.phrase);
  if (slot === "budget") return BUDGET_OPTIONS.map((o) => o.phrase);
  return SELLER_OPTIONS.map((o) => o.phrase);
}

/** Hand-rolled thousands separator: `toLocaleString` depends on the runtime ICU build, this does not. */
export function money(n: number): string {
  return "$" + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

type Weights = {
  category: number;
  condExact: number;
  condAbove: number;
  condNear: number;
  condFar: number;
  overBudget: number;
  unverified: number;
  verifiedBonus: number;
};

/**
 * Two readings of the same sentence. Strict treats every term as a wall; forgiving treats it as a
 * preference. The gap between them is what re-orders the field when the reading is swapped.
 */
const WEIGHTS: Record<"strict" | "loose", Weights> = {
  strict: {
    category: 40,
    condExact: 18,
    condAbove: 14,
    condNear: 3,
    condFar: -12,
    overBudget: -16,
    unverified: -13,
    verifiedBonus: 8,
  },
  loose: {
    category: 34,
    condExact: 12,
    condAbove: 10,
    condNear: 9,
    condFar: 3,
    overBudget: -5,
    unverified: -4,
    verifiedBonus: 5,
  },
};

export type Tag = { text: string; tone: "match" | "caution" };

export type Scored = {
  listing: Listing;
  score: number;
  headroom: number;
  discount: number;
  gradeDiff: number;
  tags: Tag[];
};

export type Report = {
  conditionPhrase: string;
  categoryPhrase: string;
  budgetPhrase: string;
  sellerPhrase: string;
  readingPhrase: string;
  shortlist: Scored[];
  nextUp: Scored | null;
  nextUpReason: string;
  prose: string;
  fullMatches: number;
  poolSize: number;
  medianAsk: number;
  avgDiscount: number;
  binding: { label: string; count: number };
  gradeSpread: { grade: Grade; count: number }[];
  inCategory: number;
  underCeiling: number;
};

export function buildReport(brief: BriefState): Report {
  const condition = CONDITION_OPTIONS[brief.condition];
  const category = CATEGORY_OPTIONS[brief.category];
  const budget = BUDGET_OPTIONS[brief.budget];
  const seller = SELLER_OPTIONS[brief.seller];
  const reading = READING_OPTIONS[brief.reading];
  const w = WEIGHTS[reading.strict ? "strict" : "loose"];
  const askIndex = GRADE_ORDER.indexOf(condition.grade);

  const scored: Scored[] = POOL.map((listing) => {
    const gradeDiff = GRADE_ORDER.indexOf(listing.grade) - askIndex;
    const headroom = budget.value - listing.price;
    const discount = Math.round((1 - listing.price / listing.listPrice) * 100);
    const tags: Tag[] = [];
    let score = 18;

    if (listing.category === category.category) {
      score += w.category;
    } else {
      tags.push({ text: `Adjacent category — ${listing.category}`, tone: "caution" });
    }

    if (gradeDiff === 0) {
      score += w.condExact;
      tags.push({
        text: `Graded ${GRADE_META[listing.grade].label} — exactly the ${condition.phrase} ask`,
        tone: "match",
      });
    } else if (gradeDiff < 0) {
      score += w.condAbove;
      tags.push({
        text: `Graded ${GRADE_META[listing.grade].label}, a step above the ${condition.phrase} ask`,
        tone: "match",
      });
    } else if (gradeDiff === 1) {
      score += w.condNear;
      tags.push({ text: `One grade under the ${condition.phrase} ask`, tone: "caution" });
    } else {
      score += w.condFar;
      tags.push({ text: `Two grades under the ${condition.phrase} ask`, tone: "caution" });
    }

    if (headroom >= 0) {
      score += headroom >= budget.value * 0.3 ? 12 : headroom >= budget.value * 0.12 ? 9 : 6;
      tags.push({ text: `${money(headroom)} under the ${budget.phrase} ceiling`, tone: "match" });
    } else {
      score += w.overBudget;
      tags.push({ text: `${money(-headroom)} over the ${budget.phrase} ceiling`, tone: "caution" });
    }

    if (listing.verified) {
      score += w.verifiedBonus;
      tags.push({ text: "Seller ID-verified by repick", tone: "match" });
    } else if (seller.verifiedOnly) {
      score += w.unverified;
      tags.push({ text: "Seller not ID-verified", tone: "caution" });
    } else {
      score += 3;
      tags.push({ text: "Unverified seller, allowed by this brief", tone: "caution" });
    }

    return {
      listing,
      score: Math.max(12, Math.min(97, Math.round(score))),
      headroom,
      discount,
      gradeDiff,
      tags: tags.slice(0, 3),
    };
  });

  const ranked = [...scored].sort(
    (a, z) =>
      z.score - a.score ||
      a.listing.price - z.listing.price ||
      (a.listing.id < z.listing.id ? -1 : 1),
  );
  const shortlist = ranked.slice(0, 4);
  const nextUp = ranked.length > 4 ? ranked[4] : null;

  const clears = (l: Listing) =>
    l.category === category.category &&
    GRADE_ORDER.indexOf(l.grade) <= askIndex &&
    l.price <= budget.value &&
    (!seller.verifiedOnly || l.verified);
  const fullMatches = POOL.filter(clears).length;

  const constraints = [
    {
      label: `the ${condition.phrase} grade`,
      count: POOL.filter((l) => GRADE_ORDER.indexOf(l.grade) > askIndex).length,
    },
    { label: `the ${budget.phrase} ceiling`, count: POOL.filter((l) => l.price > budget.value).length },
    {
      label: "the verified-seller rule",
      count: seller.verifiedOnly ? POOL.filter((l) => !l.verified).length : 0,
    },
  ];
  const binding = constraints.reduce((best, c) => (c.count > best.count ? c : best), constraints[0]);

  const inCategoryListings = POOL.filter((l) => l.category === category.category);
  const gradeSpread = GRADE_ORDER.map((grade) => ({
    grade,
    count: inCategoryListings.filter((l) => l.grade === grade).length,
  }));
  const underCeiling = inCategoryListings.filter((l) => l.price <= budget.value).length;

  const prices = shortlist.map((s) => s.listing.price).sort((a, z) => a - z);
  const medianAsk = Math.round((prices[1] + prices[2]) / 2);
  const avgDiscount = Math.round(
    shortlist.reduce((sum, s) => sum + s.discount, 0) / shortlist.length,
  );

  const lead = shortlist[0];
  const gradeClause =
    lead.gradeDiff === 0
      ? `grades ${GRADE_META[lead.listing.grade].label}, exactly the ${condition.phrase} ask,`
      : lead.gradeDiff < 0
        ? `grades ${GRADE_META[lead.listing.grade].label}, a step above the ${condition.phrase} ask,`
        : `carries the wear you allowed at ${condition.phrase}`;
  const priceClause =
    lead.headroom >= 0
      ? `and leaves ${money(lead.headroom)} under the ${budget.phrase} ceiling`
      : `and trades ${money(-lead.headroom)} over the ${budget.phrase} ceiling for that grade`;
  const bindingClause =
    binding.count === 0
      ? "nothing in the brief is binding, so the order comes down to headroom and grade"
      : `${binding.label} drops the most — ${binding.count} of ${POOL.length} listings fail on that term alone`;
  const prose = `Ranked under ${reading.phrase}. ${lead.listing.name} leads because it ${gradeClause} ${priceClause}. ${fullMatches} of ${POOL.length} listings clear every term, and ${bindingClause}.`;

  let nextUpReason = "";
  if (nextUp) {
    const l = nextUp.listing;
    nextUpReason =
      l.category !== category.category
        ? `different category — ${l.category}`
        : nextUp.gradeDiff > 0
          ? `graded ${GRADE_META[l.grade].label} against a ${condition.phrase} ask`
          : nextUp.headroom < 0
            ? `${money(-nextUp.headroom)} over the ${budget.phrase} ceiling`
            : seller.verifiedOnly && !l.verified
              ? "seller not ID-verified"
              : "edged out on price headroom";
  }

  return {
    conditionPhrase: condition.phrase,
    categoryPhrase: category.phrase,
    budgetPhrase: budget.phrase,
    sellerPhrase: seller.phrase,
    readingPhrase: reading.phrase,
    shortlist,
    nextUp,
    nextUpReason,
    prose,
    fullMatches,
    poolSize: POOL.length,
    medianAsk,
    avgDiscount,
    binding,
    gradeSpread,
    inCategory: inCategoryListings.length,
    underCeiling,
  };
}
