/**
 * Cutline — threshold-line scatter landing (auto-landing-r11/b).
 *
 * Every number below is a module constant and every derived figure is a pure function of those
 * constants. No `Math.random`, no `Date.now`, no argless `new Date()` — server render and client
 * hydration always agree.
 *
 * ── Accent contrast, computed by hand for this round's palette ──────────────────────────────────
 * The house accent (#6E56CF) is barred this round, so the "white on accent fill" rule from the
 * auto-landing-r10 delta was recomputed from scratch for lime rather than assumed:
 *
 *   lime-700 #4D7C0F  relative luminance L = 0.1602
 *     white  on it → (1.00 + 0.05) / (0.1602 + 0.05) = 5.00:1  → clears AA at every text size
 *     ink #0B0B0F on it → (0.1602 + 0.05) / (0.0035 + 0.05) = 3.93:1 → FAILS body AA
 *   ⇒ small text on an accent fill is WHITE here too. Dark ink is reserved for non-text (bars,
 *     borders) — exactly the correction r10 forced onto the canonical doc, re-derived, not copied.
 *
 *   lime-800 #3F6212  L = 0.0985 → on white = 7.07:1  → small accent text, focus outlines
 *   lime-700 #4D7C0F  on white = 5.00:1 → dot fills, the threshold stroke, borders (>3:1)
 *   zinc-500 #71717A  on white = 4.84:1 → the hollow ring of a cut listing (non-text, >3:1)
 */

// ── tokens ────────────────────────────────────────────────────────────────────────────────────────
export const cx = (...parts: Array<string | false | null | undefined>) =>
  parts.filter(Boolean).join(" ");

/**
 * Focus ring. Written as `outline-*` with no `outline-none` in front of it: Tailwind v4 paints a
 * `ring` + `ring-offset` pair fully transparent, and an `outline-none` earlier in the class list
 * sets `--tw-outline-style: none`, which cancels the very outline that follows it. Both idioms look
 * correct in source and draw nothing on screen.
 */
export const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-800";
export const FOCUS_ON_INK =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-300";

/** tracking 3-scale — eyebrow 0.28em / caption 0.16em / stat 0.12em */
export const EYEBROW = "text-[0.6875rem] font-semibold uppercase tracking-[0.28em]";
export const CAPTION = "text-[0.6875rem] font-semibold uppercase tracking-[0.16em]";
export const STAT_LABEL = "text-[0.6875rem] font-semibold uppercase tracking-[0.12em]";
export const NUM = "tabular-nums";

/** Grouped thousands by hand — `toLocaleString` can differ between server and browser ICU data. */
export const money = (value: number): string =>
  `$${Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;

// ── the field ─────────────────────────────────────────────────────────────────────────────────────
export type Listing = {
  id: string;
  name: string;
  brand: string;
  /** asking price, USD */
  price: number;
  /** original retail, USD */
  retail: number;
  /** AI condition score, 62–99 */
  condition: number;
  verified: boolean;
  /** AI match score against the buyer profile, 0–100 */
  match: number;
  seller: string;
  trades: number;
  reason: string;
};

export const LISTINGS: Listing[] = [
  { id: "coat", name: "Wool Chesterfield Coat", brand: "Rowan & Fife", price: 168, retail: 390, condition: 95, verified: true, match: 96, seller: "Priya", trades: 241, reason: "Condition + saved silhouette" },
  { id: "jacket", name: "Denim Trucker Jacket", brand: "Cinder Row", price: 232, retail: 420, condition: 97, verified: true, match: 94, seller: "Noah", trades: 118, reason: "Condition + repeat category" },
  { id: "crossbody", name: "Leather Crossbody Bag", brand: "Atelier Bran", price: 112, retail: 230, condition: 91, verified: true, match: 93, seller: "Mika", trades: 76, reason: "Price band + hardware grade" },
  { id: "blazer", name: "Tailored Wool Blazer", brand: "Sablon", price: 218, retail: 380, condition: 93, verified: true, match: 92, seller: "Elin", trades: 163, reason: "Saved sizing + fabric weight" },
  { id: "satchel", name: "Bridle Leather Satchel", brand: "Havard Goods", price: 262, retail: 520, condition: 96, verified: true, match: 91, seller: "Tomas", trades: 94, reason: "Maker archive + condition" },
  { id: "chelsea", name: "Suede Chelsea Boots", brand: "Larkspur House", price: 96, retail: 175, condition: 89, verified: true, match: 90, seller: "Ada", trades: 132, reason: "Resole history + price band" },
  { id: "parka", name: "Down Mountain Parka", brand: "Alder Peak", price: 288, retail: 560, condition: 92, verified: true, match: 89, seller: "Jonas", trades: 87, reason: "Fill rating + seasonal fit" },
  { id: "sneakers", name: "Low-Top Court Sneakers", brand: "Fieldstone", price: 88, retail: 160, condition: 86, verified: true, match: 88, seller: "Rae", trades: 205, reason: "Sole wear + price band" },
  { id: "loafers", name: "Horsebit Leather Loafers", brand: "Calder", price: 156, retail: 300, condition: 88, verified: false, match: 87, seller: "Ines", trades: 12, reason: "Last shape + saved sizing" },
  { id: "cardigan", name: "Merino Cable Cardigan", brand: "Norlund", price: 74, retail: 145, condition: 84, verified: true, match: 85, seller: "Ola", trades: 58, reason: "Fibre grade + price band" },
  { id: "heels", name: "Slingback Leather Heels", brand: "Perrine", price: 186, retail: 350, condition: 87, verified: true, match: 81, seller: "Kaya", trades: 41, reason: "Heel condition + saved sizing" },
  { id: "scarf", name: "Cashmere Blend Scarf", brand: "Vesper Mill", price: 58, retail: 120, condition: 92, verified: true, match: 82, seller: "Bo", trades: 149, reason: "Pilling scan + price band" },
  { id: "shirt", name: "Oxford Cotton Shirt", brand: "Marlowe & Co", price: 46, retail: 95, condition: 81, verified: true, match: 79, seller: "Tess", trades: 77, reason: "Collar wear + saved sizing" },
  { id: "duffle", name: "Waxed Canvas Duffle", brand: "Grantham", price: 268, retail: 500, condition: 83, verified: true, match: 78, seller: "Vik", trades: 63, reason: "Hardware audit + capacity" },
  { id: "tote", name: "Canvas Weekend Tote", brand: "Ferry & Sons", price: 134, retail: 250, condition: 78, verified: true, match: 76, seller: "Mo", trades: 51, reason: "Base wear + price band" },
  { id: "jeans", name: "Selvedge Straight Jeans", brand: "Kiln", price: 78, retail: 165, condition: 76, verified: true, match: 74, seller: "Sana", trades: 96, reason: "Hem history + saved sizing" },
  { id: "sunglasses", name: "Acetate Sunglasses", brand: "Vue Nord", price: 92, retail: 190, condition: 80, verified: false, match: 72, seller: "Cy", trades: 8, reason: "Lens scan + price band" },
  { id: "knit", name: "Alpaca Crew Knit", brand: "Bramble", price: 128, retail: 240, condition: 74, verified: true, match: 70, seller: "Lior", trades: 34, reason: "Fibre grade + colour history" },
  { id: "belt", name: "Woven Leather Belt", brand: "Osmund", price: 42, retail: 88, condition: 79, verified: true, match: 68, seller: "Pia", trades: 112, reason: "Strap wear + price band" },
  { id: "boots2", name: "Shearling Winter Boots", brand: "Tamsin", price: 244, retail: 460, condition: 85, verified: false, match: 83, seller: "Dara", trades: 9, reason: "Lining scan + seasonal fit" },
  { id: "trench", name: "Cotton Gabardine Trench", brand: "Halden", price: 312, retail: 590, condition: 90, verified: true, match: 86, seller: "Ruth", trades: 188, reason: "Seam audit + saved silhouette" },
  { id: "watch", name: "Field Watch, 38mm", brand: "Kestrel", price: 340, retail: 690, condition: 94, verified: true, match: 90, seller: "Emil", trades: 71, reason: "Movement service + case grade" },
  { id: "bag2", name: "Structured Top-Handle Bag", brand: "Odile", price: 396, retail: 780, condition: 97, verified: true, match: 95, seller: "Hana", trades: 154, reason: "Maker archive + hardware grade" },
  { id: "wrapcoat", name: "Cashmere Wrap Coat", brand: "Ivory Lane", price: 428, retail: 860, condition: 98, verified: true, match: 97, seller: "Line", trades: 203, reason: "Fibre grade + saved silhouette" },
];

// ── axes ──────────────────────────────────────────────────────────────────────────────────────────
export const C_MIN = 62;
export const C_MAX = 99;
export const P_MIN = 20;
export const P_MAX = 500;

/** Inner padding of the plot, in percent of the box. Left/right are symmetric so the two handles
 *  never hang past the panel edge at 390px, where the plot is only ~326px wide. */
export const PAD = { left: 12, right: 12, top: 7, bottom: 12 } as const;

const round2 = (n: number) => Math.round(n * 100) / 100;

export const xPct = (condition: number) =>
  round2(PAD.left + ((condition - C_MIN) / (C_MAX - C_MIN)) * (100 - PAD.left - PAD.right));

export const yPct = (price: number) =>
  round2(100 - PAD.bottom - ((price - P_MIN) / (P_MAX - P_MIN)) * (100 - PAD.top - PAD.bottom));

export const priceFromYPct = (y: number) =>
  P_MIN + ((100 - PAD.bottom - y) / (100 - PAD.top - PAD.bottom)) * (P_MAX - P_MIN);

export const GRID_PRICES = [100, 200, 300, 400];
export const GRID_CONDITIONS = [70, 80, 90];

// ── the line ──────────────────────────────────────────────────────────────────────────────────────
export const BASE_MIN = 140;
export const BASE_MAX = 340;
export const TOP_MIN = 220;
export const TOP_MAX = 480;
/** The line must keep a positive slope: paying *less* for a better item is not a rule anyone holds. */
export const MIN_GAP = 40;
export const STEP = 5;
export const PAGE_STEP = 25;

export const DEFAULT_BASE = 170;
export const DEFAULT_TOP = 280;

export const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
export const snap = (v: number) => Math.round(v / STEP) * STEP;

/** Your ceiling at a given condition score — linear between the two handles. */
export const ceilingAt = (base: number, top: number, condition: number) =>
  base + ((top - base) * (condition - C_MIN)) / (C_MAX - C_MIN);

export type CutReason = "over" | "unverified";

export type Judged = Listing & {
  ceiling: number;
  /** positive when the listing clears the line */
  headroom: number;
  over: number;
  clears: boolean;
  cutReason: CutReason | null;
  grade: string;
  gradeNote: string;
  discount: number;
};

export function gradeFor(condition: number): { grade: string; note: string } {
  if (condition >= 95) return { grade: "S", note: "Museum condition" };
  if (condition >= 88) return { grade: "A", note: "Light wear only" };
  if (condition >= 80) return { grade: "B", note: "Visible, honest wear" };
  return { grade: "C", note: "Well used, fully working" };
}

export function judge(base: number, top: number, verifiedOnly: boolean): Judged[] {
  return LISTINGS.map((l) => {
    const ceiling = ceilingAt(base, top, l.condition);
    const over = l.price - ceiling;
    const failsPrice = over > 0;
    const failsSeller = verifiedOnly && !l.verified;
    const { grade, note } = gradeFor(l.condition);
    return {
      ...l,
      ceiling,
      headroom: ceiling - l.price,
      over,
      clears: !failsPrice && !failsSeller,
      cutReason: failsPrice ? "over" : failsSeller ? "unverified" : null,
      grade,
      gradeNote: note,
      discount: Math.round((1 - l.price / l.retail) * 100),
    };
  });
}

export const median = (values: number[]): number => {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 1 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
};

export const mean = (values: number[]): number =>
  values.length === 0 ? 0 : values.reduce((sum, v) => sum + v, 0) / values.length;

/** Ledger order: the misses that hurt least come first, so the top of the list is always the
 *  cheapest thing a visitor could buy back by moving the line a little. */
export const byCost = (a: Judged, b: Judged) =>
  Math.max(a.over, 0) - Math.max(b.over, 0) || b.match - a.match;

export const byMatch = (a: Judged, b: Judged) => b.match - a.match || a.price - b.price;

export function tradeoffSentence(kept: Judged[], cut: Judged[]): string {
  if (cut.length === 0) {
    return "Nothing sits above your line. Every listing the match found clears it, which usually means the line is wider than your budget.";
  }
  const closest = [...cut].sort(byCost)[0];
  const bestCut = [...cut].sort(byMatch)[0];
  const detail =
    closest.cutReason === "unverified"
      ? `${closest.name} is cut for an unverified seller`
      : `${closest.name} misses by ${money(closest.over)}`;
  const sting =
    bestCut.match > (kept[0]?.match ?? 0)
      ? ` The strongest match in the whole field, ${bestCut.name} at ${bestCut.match}%, is above the line.`
      : "";
  return `${cut.length} of ${LISTINGS.length} listings stay above your line. ${detail}.${sting}`;
}

// ── presets ───────────────────────────────────────────────────────────────────────────────────────
export type Preset = { id: string; label: string; base: number; top: number; blurb: string };

export const PRESETS: Preset[] = [
  { id: "tight", label: "Tight", base: 140, top: 220, blurb: "Bargain hunting" },
  { id: "balanced", label: "Balanced", base: DEFAULT_BASE, top: DEFAULT_TOP, blurb: "Where most buyers start" },
  { id: "open", label: "Open", base: 260, top: 430, blurb: "Condition over cost" },
];

// ── static copy ───────────────────────────────────────────────────────────────────────────────────
export const BRAND = "Cutline";

export const NAV = ["How it works", "Grading", "Sellers", "Pricing"];

export const HERO = {
  eyebrow: "AI-matched resale",
  headline: ["Draw the line.", "See what it costs."],
  sub: "Every listing the match found is on the field below: how much it costs, and how good it is. Move your line and the field splits — what clears it sharpens, what does not stays exactly where it is, faded, so the price of your own rule is never hidden from you.",
  primary: "Start with my line",
  secondary: "See how a grade is scored",
};

export const HOW = [
  {
    n: "01",
    title: "The field is the whole match, not a page of it",
    body: "All 24 listings the model surfaced are plotted at once. Left to right is condition score, bottom to top is asking price. Nothing is paginated away before you have seen it.",
    fig: "Fig. 01 — 24 listings, two axes",
  },
  {
    n: "02",
    title: "The line is a rule, not a filter",
    body: "Two ends: what you would pay for the roughest thing you would accept, and what you would pay for the best. Every condition score between them gets its own ceiling, interpolated.",
    fig: "Fig. 02 — Two handles, one rule",
  },
  {
    n: "03",
    title: "What you cut keeps its seat",
    body: "A filter deletes the evidence of its own cost. A line does not: rejected listings hold their coordinates, dimmed and hollow, labelled with the exact amount they missed by.",
    fig: "Fig. 03 — The cost of a rule, visible",
  },
];

export const PROOF_STATS = [
  { value: "1.4M", label: "Photos graded" },
  { value: "38s", label: "Median time to first line" },
  { value: "52%", label: "Median saving vs retail" },
];

export const TESTIMONIAL = {
  quote:
    "I raised my line by twenty dollars and two coats I had already written off came back into it. No filter I have ever used showed me the thing it was taking away.",
  name: "Reiko Tanaka",
  role: "Product designer, four trades this year",
};

export const CLOSING = {
  headline: "The only filter that shows its own cost.",
  body: "Set one line, keep it, and let every new listing land against it. You will always know what you passed on, and by how much.",
  cta: "Draw my line",
  note: "No account needed to try the field.",
};

export const FOOTER_LINKS = ["Grading standard", "Seller verification", "Buyer protection", "Careers"];
