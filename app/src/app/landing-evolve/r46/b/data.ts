// Deterministic content for the AI listing-copywriter preview.
// Every paragraph below is hand-written, not generated at runtime — the "generation" is a pure
// lookup keyed by (tone, category), so switching controls is instant, reproducible, and contains
// no randomness anywhere in the module.

export type Tone = "concise" | "detailed" | "storytelling";
export type Category = "bags" | "sneakers" | "furniture";

export const TONE_OPTIONS: { id: Tone; label: string; hint: string }[] = [
  { id: "concise", label: "Concise", hint: "Short, scannable, facts first" },
  { id: "detailed", label: "Detailed", hint: "Full specs and condition notes" },
  { id: "storytelling", label: "Storytelling", hint: "A little narrative, still honest" },
];

export const CATEGORY_OPTIONS: { id: Category; label: string; sampleItem: string }[] = [
  { id: "bags", label: "Bags", sampleItem: "Walnut Leather Tote" },
  { id: "sneakers", label: "Sneakers", sampleItem: "Classic Low-Top Sneakers" },
  { id: "furniture", label: "Furniture", sampleItem: "Mid-Century Lounge Chair" },
];

export interface KeywordChip {
  id: string;
  label: string;
  /** Exact substring as it appears in the paragraph for this (tone, category) pair. */
  phrase: string;
}

export interface GeneratedCopy {
  tagline: string;
  paragraph: string;
  keywords: KeywordChip[];
}

type CopyMatrix = Record<Category, Record<Tone, GeneratedCopy>>;

export const COPY_MATRIX: CopyMatrix = {
  bags: {
    concise: {
      tagline: "Walnut tote. Full-grain leather. One honest flaw, noted.",
      paragraph:
        "Full-grain walnut leather tote, structured base, two interior pockets. Grade B+: light corner rub, no tears, hardware intact. Fits a 13-inch laptop with room for a water bottle. Seller verified, ships in two days.",
      keywords: [
        { id: "bags-concise-1", label: "Full-grain leather", phrase: "Full-grain walnut leather" },
        { id: "bags-concise-2", label: "Grade B+", phrase: "Grade B+" },
        { id: "bags-concise-3", label: "Fits a laptop", phrase: "13-inch laptop" },
        { id: "bags-concise-4", label: "Verified seller", phrase: "Seller verified" },
      ],
    },
    detailed: {
      tagline: "A structured walnut tote built for daily carry, not a single season.",
      paragraph:
        "This tote is cut from full-grain walnut leather that only deepens in tone with wear, mounted on a reinforced structured base so it holds its shape when half-empty. Inside: two slip pockets and a zippered compartment sized for a 13-inch laptop, plus a cotton lining with no stains. Grade B+ reflects light corner rub and faint handle creasing — no tears, no odor, every rivet intact. The seller is verified with three completed trades and ships within two business days.",
      keywords: [
        { id: "bags-detailed-1", label: "Full-grain leather", phrase: "full-grain walnut leather" },
        { id: "bags-detailed-2", label: "Reinforced base", phrase: "reinforced structured base" },
        { id: "bags-detailed-3", label: "Grade B+", phrase: "Grade B+" },
        { id: "bags-detailed-4", label: "Verified trades", phrase: "verified with three completed trades" },
      ],
    },
    storytelling: {
      tagline: "Someone carried this tote through four years of commutes. You're next.",
      paragraph:
        "This walnut tote has already seen one good life: four years riding a shoulder through transit commutes and weekend markets, the leather slowly taking on that deep, lived-in patina you can't fake. It still holds its structured shape and still smells like nothing but leather. A light corner rub and one faint handle crease — graded honestly as B+ — are the only signs anyone used it at all. The seller verified every detail before listing, so the next four years are yours to add.",
      keywords: [
        { id: "bags-story-1", label: "Lived-in patina", phrase: "deep, lived-in patina" },
        { id: "bags-story-2", label: "Holds its shape", phrase: "structured shape" },
        { id: "bags-story-3", label: "Graded honestly", phrase: "graded honestly as B+" },
        { id: "bags-story-4", label: "Verified listing", phrase: "verified every detail" },
      ],
    },
  },
  sneakers: {
    concise: {
      tagline: "Low-tops, barely worn. Grade A-, true to size.",
      paragraph:
        "Canvas low-top sneakers, true to size, original rubber sole with even wear. Grade A-: no stains, laces included, box not included. Seller verified, worn fewer than ten times.",
      keywords: [
        { id: "sneakers-concise-1", label: "True to size", phrase: "true to size" },
        { id: "sneakers-concise-2", label: "Grade A-", phrase: "Grade A-" },
        { id: "sneakers-concise-3", label: "Laces included", phrase: "laces included" },
        { id: "sneakers-concise-4", label: "Verified seller", phrase: "Seller verified" },
      ],
    },
    detailed: {
      tagline: "A pair that's been broken in, not broken down — Grade A- and true to size.",
      paragraph:
        "These canvas low-tops run true to size, with the original rubber sole showing even, honest wear across both heels — no lean, no flat spots. Grade A- covers light toe-cap scuffing and a faint crease at the fold, with no stains on the canvas and both original laces included. The seller verified the sizing and sole condition against the retail spec sheet before listing, and the pair has been worn fewer than ten times.",
      keywords: [
        { id: "sneakers-detailed-1", label: "Original sole", phrase: "original rubber sole" },
        { id: "sneakers-detailed-2", label: "Even wear", phrase: "even, honest wear" },
        { id: "sneakers-detailed-3", label: "Grade A-", phrase: "Grade A-" },
        { id: "sneakers-detailed-4", label: "Verified sizing", phrase: "verified the sizing" },
      ],
    },
    storytelling: {
      tagline: "Ten wears in, and these sneakers are just getting started.",
      paragraph:
        "Someone bought these, wore them ten careful times, and then simply stopped reaching for them — which is the best kind of secondhand story, because it means almost nothing happened to them. The canvas is clean, the original rubber sole still grips like new, and the only tell is a faint crease at the fold that Grade A- accounts for honestly. The seller verified every wear count and scuff before it ever reached this page, so what you're buying is ten wears from brand new.",
      keywords: [
        { id: "sneakers-story-1", label: "Sole still grips", phrase: "original rubber sole still grips" },
        { id: "sneakers-story-2", label: "One faint crease", phrase: "faint crease at the fold" },
        { id: "sneakers-story-3", label: "Grade A-", phrase: "Grade A-" },
        { id: "sneakers-story-4", label: "Verified wear count", phrase: "verified every wear count" },
      ],
    },
  },
  furniture: {
    concise: {
      tagline: "Walnut-frame lounge chair. Grade B, structurally solid.",
      paragraph:
        "Walnut-frame lounge chair, original upholstery, no wobble. Grade B: visible armrest fading, frame and joints solid. Seller verified, local pickup available.",
      keywords: [
        { id: "furniture-concise-1", label: "Walnut frame", phrase: "Walnut-frame" },
        { id: "furniture-concise-2", label: "No wobble", phrase: "no wobble" },
        { id: "furniture-concise-3", label: "Grade B", phrase: "Grade B" },
        { id: "furniture-concise-4", label: "Verified seller", phrase: "Seller verified" },
      ],
    },
    detailed: {
      tagline: "A lounge chair whose frame will outlast two more owners after you.",
      paragraph:
        "Built on a solid walnut frame with every joint still tight, this lounge chair shows no wobble and no creak when you sit. The original upholstery has visible fading across both armrests, graded honestly as Grade B, but no tears, no stains, and the foam hasn't collapsed. The seller verified the joinery and frame stability before listing and offers local pickup to avoid shipping damage to the frame.",
      keywords: [
        { id: "furniture-detailed-1", label: "Solid walnut frame", phrase: "solid walnut frame" },
        { id: "furniture-detailed-2", label: "No wobble, no creak", phrase: "no wobble and no creak" },
        { id: "furniture-detailed-3", label: "Grade B", phrase: "graded honestly as Grade B" },
        { id: "furniture-detailed-4", label: "Verified joinery", phrase: "verified the joinery" },
      ],
    },
    storytelling: {
      tagline: "This chair has outlasted three apartments. It can outlast yours too.",
      paragraph:
        "This lounge chair has already moved through three apartments and one very long winter of actual use, and the walnut frame hasn't loosened a single joint through any of it. The original upholstery wears its history openly — faded armrests, graded fairly as Grade B — but the foam still holds and the frame still sits level on every floor. The seller verified the joinery by hand before it left their apartment, and offers local pickup so it survives the move to yours too.",
      keywords: [
        { id: "furniture-story-1", label: "Frame holds steady", phrase: "walnut frame hasn't loosened" },
        { id: "furniture-story-2", label: "Wears its history", phrase: "wears its history openly" },
        { id: "furniture-story-3", label: "Grade B", phrase: "graded fairly as Grade B" },
        { id: "furniture-story-4", label: "Verified by hand", phrase: "verified the joinery by hand" },
      ],
    },
  },
};

/** Pure, deterministic lookup — same (tone, category) always returns the identical object. */
export function getGeneratedCopy(tone: Tone, category: Category): GeneratedCopy {
  return COPY_MATRIX[category][tone];
}

export interface Product {
  id: string;
  category: Category;
  name: string;
  grade: string;
  matchPercent: number;
  verified: boolean;
  originalPrice: number;
  resalePrice: number;
}

export const PRODUCTS: Product[] = [
  { id: "p-bag-1", category: "bags", name: "Walnut Leather Tote", grade: "B+", matchPercent: 94, verified: true, originalPrice: 180, resalePrice: 96 },
  { id: "p-bag-2", category: "bags", name: "Woven Straw Crossbody", grade: "A-", matchPercent: 88, verified: true, originalPrice: 64, resalePrice: 38 },
  { id: "p-sneaker-1", category: "sneakers", name: "Classic Low-Top Sneakers", grade: "A-", matchPercent: 91, verified: true, originalPrice: 110, resalePrice: 58 },
  { id: "p-sneaker-2", category: "sneakers", name: "Trail Running Shoes", grade: "B", matchPercent: 85, verified: false, originalPrice: 140, resalePrice: 79 },
  { id: "p-furniture-1", category: "furniture", name: "Mid-Century Lounge Chair", grade: "B", matchPercent: 90, verified: true, originalPrice: 420, resalePrice: 210 },
  { id: "p-furniture-2", category: "furniture", name: "Oak Side Table", grade: "A", matchPercent: 82, verified: true, originalPrice: 150, resalePrice: 92 },
];

export function productsFor(category: Category): Product[] {
  return PRODUCTS.filter((p) => p.category === category);
}

export function discountPercent(product: Product): number {
  return Math.round(((product.originalPrice - product.resalePrice) / product.originalPrice) * 100);
}

/** A short, clearly-labeled "typical before" draft — a generic illustration, not a measurable claim,
 *  shown next to the live-generated paragraph in the value section. It never changes with controls,
 *  which is intentional: it stands for "what sellers usually type," not a competing live example. */
export const GENERIC_BEFORE_DRAFT =
  "used item, good condition, some wear, message me for details, price is flexible";
