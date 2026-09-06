// Fixed, deterministic demo data for the r20/b candidate.
// No Math.random / Date.now / new Date anywhere — every "point in time" below is a
// hand-authored stage in a fixed array, and the scrubber only ever indexes into it.

export type MilestoneKey = "listed" | "graded" | "accepted" | "shipped";

export interface Stage {
  id: MilestoneKey;
  label: string;
  day: string;
  price: number;
  grade: string | null; // null until the AI grade milestone is reached
  caption: string;
  verified: MilestoneKey[]; // cumulative milestones unlocked as of this stage
}

// Anchor positions (0-100) that the four fixed stages sit at along the scrubber track.
export const STAGE_ANCHORS = [0, 33, 67, 100] as const;

export const BASE_PRICE = 620;

export const STAGES: Stage[] = [
  {
    id: "listed",
    label: "Listed",
    day: "Day 0",
    price: 620,
    grade: null,
    caption:
      'Seller lists the a7 III kit at $620, condition self-reported as "well loved."',
    verified: ["listed"],
  },
  {
    id: "graded",
    label: "AI-Graded",
    day: "Day 1",
    price: 620,
    grade: "B+",
    caption:
      "repick's vision model reviews 14 seller photos and grades the body B+, setting a fair-value band of $540 to $580.",
    verified: ["listed", "graded"],
  },
  {
    id: "accepted",
    label: "Offer Accepted",
    day: "Day 4",
    price: 555,
    grade: "B+",
    caption:
      "A matched buyer's offer of $555 is accepted, 10% under asking, based on 41 comparable recent sales.",
    verified: ["listed", "graded", "accepted"],
  },
  {
    id: "shipped",
    label: "Verified & Shipped",
    day: "Day 6",
    price: 555,
    grade: "B+",
    caption:
      "An independent inspector confirms the grade on arrival and escrow releases funds. The sale closes as Verified.",
    verified: ["listed", "graded", "accepted", "shipped"],
  },
];

export const MILESTONE_DEFS: { key: MilestoneKey; label: string }[] = [
  { key: "listed", label: "Listing published" },
  { key: "graded", label: "AI condition grade" },
  { key: "accepted", label: "Offer accepted" },
  { key: "shipped", label: "Verified & shipped" },
];

export interface Product {
  slug: string;
  title: string;
  matchTag: string;
  matchPercent: number;
  grade: string;
  before: number;
  after: number;
  photoId: string;
  alt: string;
}

export const PRODUCTS: Product[] = [
  {
    slug: "wh1000xm4",
    title: "Sony WH-1000XM4 — Black",
    matchTag: "Matches: noise-cancelling preference",
    matchPercent: 91,
    grade: "A-",
    before: 280,
    after: 209,
    photoId: "1519669417670-68775a50919e",
    alt: "Black over-ear wireless headphones resting on a flat surface",
  },
  {
    slug: "airmax90",
    title: "Nike Air Max 90 — Size 10",
    matchTag: "Matches: US size 10, low-top",
    matchPercent: 88,
    grade: "B+",
    before: 140,
    after: 98,
    photoId: "1542291026-7eec264c27ff",
    alt: "Pair of white and grey Nike Air Max sneakers on a light background",
  },
  {
    slug: "seamaster",
    title: "Omega Seamaster — Automatic",
    matchTag: "Matches: automatic movement, under $2k",
    matchPercent: 94,
    grade: "A",
    before: 2150,
    after: 1890,
    photoId: "1523275335684-37898b6baf30",
    alt: "Close-up of a stainless steel automatic wristwatch on a wrist",
  },
];

export const TICKER_ITEMS: string[] = [
  "VERIFIED — Leica Q2 — $1,240",
  "VERIFIED — Herman Miller Aeron — $310",
  "VERIFIED — Sony a7 III kit — $555",
  "VERIFIED — Canon EOS R6 — $1,180",
  "VERIFIED — Eames Lounge Replica — $890",
  "VERIFIED — Omega Seamaster — $1,890",
  "VERIFIED — Nike Air Max 90 — $98",
  "VERIFIED — Sony WH-1000XM4 — $209",
];

export const STATS: { value: string; label: string }[] = [
  { value: "14,208", label: "VERIFIED SALES CLOSED" },
  { value: "$2.4M", label: "PAID OUT TO SELLERS" },
  { value: "96%", label: "AVG. MATCH CONFIDENCE" },
];

export const TESTIMONIALS: { quote: string; name: string; role: string }[] = [
  {
    quote:
      "The AI grade matched what my buyer found on inspection almost exactly. No back-and-forth.",
    name: "Priya N.",
    role: "Seller, camera gear",
  },
  {
    quote:
      "I dragged the history slider before buying. Seeing the grading step made the final price make sense.",
    name: "Marcus L.",
    role: "Buyer, home office",
  },
];
