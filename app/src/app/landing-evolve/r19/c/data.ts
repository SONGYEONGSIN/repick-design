// Fixed, deterministic data for the Handoff Timeline. No Math.random / Date anywhere in this route —
// every derived number (cumulativeTrustScore, discountPct) is a pure function of the arguments below,
// so server and client renders agree and re-selecting a stage is an exact recompute, never a guess.

export type StageId = "submission" | "grading" | "verification" | "match";

export interface Stage {
  id: StageId;
  order: number; // 0-3, position along the rail
  label: string; // used in headings / sr text
  shortLabel: string; // used on the rail node itself
  actor: string;
  timestamp: string;
  summary: string;
  checks: string[];
  gradeLabel: string;
  verificationLabel: string;
  verified: boolean; // drives icon/weight change, never color alone
  matchLabel: string;
  trustDelta: number; // points this stage adds to the running trust score
}

export const BASELINE_TRUST = 31; // implicit trust of an unlogged, unclaimed item — never shown, only summed from

export const STAGES: Stage[] = [
  {
    id: "submission",
    order: 0,
    label: "Seller submission",
    shortLabel: "Submission",
    actor: "Seller — @maison.resale",
    timestamp: "Day 0 · 09:14",
    summary:
      "The seller logs the item, uploads fourteen raw photos, and submits a self-reported condition claim. Nothing here is confirmed yet — it's a starting claim, not a grade.",
    checks: [
      "Serial / date-code photographed",
      "Self-reported grade: B (seller claim, unverified)",
      "Item logged into the custody chain",
    ],
    gradeLabel: "B (seller-reported, unverified)",
    verificationLabel: "Not yet verified",
    verified: false,
    matchLabel: "Not yet eligible for matching",
    trustDelta: 9,
  },
  {
    id: "grading",
    order: 1,
    label: "AI condition grading",
    shortLabel: "AI grading",
    actor: "Repick grading model v4.2",
    timestamp: "Day 0 · 11:02",
    summary:
      "A computer-vision model checks the fourteen photos against 40,000+ previously graded reference images for this exact SKU, and revises the seller's claim up or down.",
    checks: [
      "Hardware wear scored across 9 surface zones",
      "Stitching + material pattern matched to reference set",
      "Grade revised: B → B+ (AI-assessed)",
    ],
    gradeLabel: "B+ (AI-assessed)",
    verificationLabel: "AI-reviewed, pending human check",
    verified: false,
    matchLabel: "Not yet eligible for matching",
    trustDelta: 24,
  },
  {
    id: "verification",
    order: 2,
    label: "Human verification",
    shortLabel: "Verification",
    actor: "Verification desk — J. Ostrander",
    timestamp: "Day 1 · 15:40",
    summary:
      "A human inspector confirms the AI grade in person — hardware, stitching, and serials are re-checked by hand before anything ships to a buyer as verified.",
    checks: [
      "Authenticity confirmed against maker archive",
      "Hardware + serial cross-checked in person",
      "Grade held at B+, verification stamped",
    ],
    gradeLabel: "B+ (human-verified)",
    verificationLabel: "Verified · stamped",
    verified: true,
    matchLabel: "Eligible for matching",
    trustDelta: 21,
  },
  {
    id: "match",
    order: 3,
    label: "Buyer match",
    shortLabel: "Buyer match",
    actor: "Matching engine",
    timestamp: "Day 3 · 14:02",
    summary:
      "The verified listing is scored against live buyer-intent signals and surfaced to the buyers most likely to complete — this is the record as it stands right now.",
    checks: [
      "Matched to 3 buyers above a 90% intent score",
      "Price benchmarked against 90-day comparables",
      "Live and ready for offer",
    ],
    gradeLabel: "B+ (verified)",
    verificationLabel: "Verified · matched",
    verified: true,
    matchLabel: "94% match confidence · 3 buyers notified",
    trustDelta: 11,
  },
];

/** Sum of BASELINE_TRUST plus every stage's trustDelta up to and including `order`. Pure function of
 * the fixed STAGES array — the only thing that changes between calls is which order is selected. */
export function cumulativeTrustScore(order: number): number {
  return STAGES.slice(0, order + 1).reduce((sum, s) => sum + s.trustDelta, BASELINE_TRUST);
}

export function discountPct(original: number, price: number): number {
  return Math.round(((original - price) / original) * 100);
}

// ---------------------------------------------------------------------------
// Reference listing — the single real item the hero timeline is built from.
// ---------------------------------------------------------------------------

export const REFERENCE_LISTING = {
  id: "REP-10482",
  title: "Chanel Classic Flap, Medium, Caviar Leather",
  price: 4380,
  originalPrice: 5900,
  image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=480&auto=format&fit=crop",
  imageAlt: "Quilted black leather flap handbag with a chain strap, resting on a light surface",
};

// ---------------------------------------------------------------------------
// Product preview cards
// ---------------------------------------------------------------------------

export interface ProductCard {
  id: string;
  title: string;
  price: number;
  originalPrice: number;
  conditionGrade: string;
  sellerVerified: boolean;
  matchPct: number;
  image: string;
  imageAlt: string;
  tags: string[];
  rationale: string[];
}

export const PRODUCT_CARDS: ProductCard[] = [
  {
    id: "tudor-bb58",
    title: "Tudor Black Bay 58, Steel",
    price: 2890,
    originalPrice: 3450,
    conditionGrade: "A-",
    sellerVerified: true,
    matchPct: 92,
    image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=640&auto=format&fit=crop",
    imageAlt: "Stainless steel dive watch with a black dial, resting on a dark surface",
    tags: ["Movement timing verified", "9% below 90-day comps"],
    rationale: [
      "Movement timing verified within chronometer spec",
      "Bracelet stretch measured within stated grade",
      "Priced 9% below trailing 90-day comparable sales",
    ],
  },
  {
    id: "santa-cruz-hightower",
    title: "Santa Cruz Hightower, Size M",
    price: 3120,
    originalPrice: 4200,
    conditionGrade: "B+",
    sellerVerified: true,
    matchPct: 88,
    image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=640&auto=format&fit=crop",
    imageAlt: "Mountain bike frame and front wheel, resting against a plain wall",
    tags: ["Frame serial matched to registry", "No structural stress found"],
    rationale: [
      "Frame serial matched to manufacturer registry",
      "No structural stress cracks found on inspection",
      "Drivetrain wear consistent with stated grade B+",
    ],
  },
  {
    id: "jordan-1-retro-high",
    title: "Air Jordan 1 Retro High, US 10",
    price: 168,
    originalPrice: 230,
    conditionGrade: "B",
    sellerVerified: true,
    matchPct: 81,
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=640&auto=format&fit=crop",
    imageAlt: "Pair of red and white high-top sneakers on a plain background",
    tags: ["Outsole matches stated grade", "Priced at floor for grade"],
    rationale: [
      "Outsole yellowing consistent with stated grade B",
      "Stitching intact at all 12 stress points checked",
      "Priced at the floor of the range for grade B",
    ],
  },
];

// ---------------------------------------------------------------------------
// Value columns
// ---------------------------------------------------------------------------

export interface ValueColumn {
  label: string;
  body: string;
}

export const VALUE_COLUMNS: ValueColumn[] = [
  {
    label: "Nothing is claimed twice",
    body: "The seller's self-report is logged, not trusted outright. Every later stage either confirms it or corrects it — and the correction stays visible, not overwritten.",
  },
  {
    label: "AI goes first, a person signs last",
    body: "Computer vision handles the scale — thousands of photos an hour. A verification desk holds the one signature that actually ships an item as verified.",
  },
  {
    label: "Buyers scrub the same trail",
    body: "Nothing revealed to a buyer is hidden from the seller. The timeline you're moving through right now is the exact one every buyer sees before they offer.",
  },
];

// ---------------------------------------------------------------------------
// Social proof
// ---------------------------------------------------------------------------

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "I scrubbed back to the seller's original photos before I looked at the price. Watching the grade tighten from a guess to a stamped verification is what got me to buy.",
    name: "A. Kessler",
    role: "Buyer, 18 purchases",
  },
  {
    quote:
      "Buyers used to ask us to re-explain our own grading in the messages. Now they scrub through the same four steps we did — nobody's asked twice since.",
    name: "R. Feld",
    role: "Seller, vintage watches",
  },
  {
    quote:
      "Every dispute we've closed started with someone pointing at the same timeline the buyer had already seen. That's the whole difference from a plain listing.",
    name: "N. Oyelaran",
    role: "Trust & safety",
  },
];

export const TRUST_STATS: { value: string; label: string }[] = [
  { value: "1.4M", label: "listings carrying a full four-stage record" },
  { value: "97.1%", label: "verification-desk agreement with AI grading" },
  { value: "11h", label: "median time from submission to buyer match" },
];
