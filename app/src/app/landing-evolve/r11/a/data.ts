/**
 * Redline — data, tokens and pure derivations for the r11/a landing.
 *
 * Every figure here is a module constant and every derived value is a pure function of plain
 * arrays and numbers. No `Math.random`, no `Date.now`, no argless `new Date()`: the server render
 * and the client hydration always agree.
 *
 * The page argues one thing — *where the words and the object diverge* — so the data model is a
 * document, not a chart. A listing is an ordered list of parts; a part is either literal text the
 * seller wrote or a `mark`, and a mark carries both the struck phrase and its verified replacement
 * plus the evidence that produced it and the money that evidence is worth. The strikethroughs are
 * not decoration: they sum to the price.
 */

// --- utils ---------------------------------------------------------------------------------------

export const cx = (...parts: Array<string | false | null | undefined>) =>
  parts.filter(Boolean).join(" ");

/** Grouped thousands by hand — `toLocaleString` reads ICU data that can differ between the server
 * render and the browser, which shows up as a hydration mismatch rather than a wrong number. */
export const money = (value: number): string =>
  `$${Math.abs(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;

/** Signed money for the adjustment ledger: the sign is the whole point of the column. */
export const signedMoney = (value: number): string =>
  value === 0 ? "$0" : `${value > 0 ? "+" : "-"}${money(value)}`;

// --- palette -------------------------------------------------------------------------------------
//
// Light theme, near-monochrome, one accent. Measured against the page ground `#FAF9F6`:
//   ink     #141317 -> 17.6:1
//   muted   #5B5862 ->  6.6:1   (AA at every size)
//   accent  #BE123C ->  6.0:1   (AA at every size, so the redline can be body-sized text)
// White on the accent fill is 6.3:1; near-black ink on the same fill is only 2.9:1, so every small
// label sitting on an accent fill in this file is white. (r10/a delta, confirmed by calculation.)

//   paper  #FAF9F6   ink #141317   muted #5B5862   wash #FFF1F2   rule #E4E1DA   folio #85818B
// Those six are written as Tailwind arbitrary values at their use sites, because a class name has
// to be a literal for the compiler to emit it. Only the accent is exported: it is the one colour
// this page also needs at runtime, in the inline `backgroundColor` of the filled chips.
export const ACCENT = "#BE123C";

/** No preceding `outline-none` — that sets `--tw-outline-style: none` and cancels the ring it is
 * paired with. No `ring` + `ring-offset` either: Tailwind v4 paints that combination transparent. */
export const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#BE123C]";
export const FOCUS_TIGHT =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#BE123C]";

/** Tracking scale: eyebrow 0.28em / caption 0.16em / stat 0.12em. */
export const EYEBROW = "text-[0.68rem] font-semibold uppercase tracking-[0.28em]";
export const CAPTION = "text-[0.7rem] font-semibold uppercase tracking-[0.16em]";

// --- evidence sources ------------------------------------------------------------------------------

export type SourceId = "photo" | "archive" | "sales" | "history";

export const SOURCES: Record<SourceId, { label: string; blurb: string }> = {
  photo: {
    label: "Photo scan",
    blurb: "A 1,400 dpi pass over the seller's own frames, not a stock shot.",
  },
  archive: {
    label: "Archive match",
    blurb: "Construction records from the maker, 2004 to today.",
  },
  sales: {
    label: "Completed sales",
    blurb: "Ninety days of closed trades for this exact model and grade.",
  },
  history: {
    label: "Seller history",
    blurb: "Every prior listing, dispute and return from this account.",
  },
};

// --- the document model ----------------------------------------------------------------------------

/**
 * `confirmed` — the claim survived; the phrase stays and carries a check.
 * `corrected` — the phrase was wrong and was rewritten; the price falls.
 * `raised`    — the phrase undersold the item; the rewrite pushes the price *up*.
 * `removed`   — nothing could support the claim, so it is struck with no replacement.
 */
export type MarkKind = "confirmed" | "corrected" | "raised" | "removed";

export type Mark = {
  id: string;
  /** Exactly what the seller typed. */
  struck: string;
  /** What the inspection put in its place. `null` for `confirmed` (nothing replaced it) and for
   * `removed` (nothing survived it) — the two cases the renderer tells apart by `kind`. */
  inserted: string | null;
  kind: MarkKind;
  source: SourceId;
  /** One sentence: how this was found. Never a restatement of the finding itself. */
  method: string;
  /** 0-100. */
  confidence: number;
  /** Dollars this mark moves the fair price, signed. */
  delta: number;
};

export type DocPart = string | { mark: string };

export type Listing = {
  id: string;
  title: string;
  brand: string;
  category: string;
  /** What the seller is asking, in dollars. The ledger starts here. */
  asking: number;
  /** Original retail, used only for the discount badge on the preview cards. */
  retail: number;
  matchPct: number;
  grade: "S" | "A" | "B";
  gradeNote: string;
  seller: string;
  sellerMeta: string;
  /** Static label — writing "2 days ago" as a string keeps the page deterministic. */
  posted: string;
  /** Why the matcher surfaced this listing for this reader. */
  matchReason: string;
  body: DocPart[];
  marks: Mark[];
};

export const LISTINGS: Listing[] = [
  {
    id: "trench",
    title: "Oversized Trench Coat",
    brand: "Aureum Vintage",
    category: "Outerwear",
    asking: 232,
    retail: 620,
    matchPct: 94,
    grade: "A",
    gradeNote: "Light wear, no structural damage",
    seller: "Verified seller - Jimin",
    sellerMeta: "154 trades - 4.9 rating",
    posted: "Listed 2 days ago",
    matchReason: "Matched on your oversized outerwear history",
    body: [
      "Barely worn - ",
      { mark: "t1" },
      ". ",
      { mark: "t2" },
      ". Comes with ",
      { mark: "t3" },
      ". Fabric is ",
      { mark: "t4" },
      ". I would call it ",
      { mark: "t5" },
      ".",
    ],
    marks: [
      {
        id: "t1",
        struck: "three outings, tops",
        inserted: null,
        kind: "confirmed",
        source: "photo",
        method: "Fabric nap and lining creases match a garment worn under five times.",
        confidence: 91,
        delta: 0,
      },
      {
        id: "t2",
        struck: "No scratches anywhere",
        inserted: "Light scuffing on the lower back panel, 2 spots",
        kind: "corrected",
        source: "photo",
        method: "Two abrasion patches surfaced on the lower back panel at full scan resolution.",
        confidence: 96,
        delta: -26,
      },
      {
        id: "t3",
        struck: "the belt and dust bag",
        inserted: "the belt only",
        kind: "corrected",
        source: "history",
        method: "The dust bag appears in none of the eight frames this seller uploaded.",
        confidence: 88,
        delta: -18,
      },
      {
        id: "t4",
        struck: "wool-cashmere",
        inserted: "100% wool",
        kind: "corrected",
        source: "archive",
        method: "Care-label weave and stitch pitch match the maker's all-wool run, not the blend.",
        confidence: 93,
        delta: -34,
      },
      {
        id: "t5",
        struck: "Condition B",
        inserted: "Condition A",
        kind: "raised",
        source: "sales",
        method: "A-grade coats from this maker closed 26 dollars higher across 90 days.",
        confidence: 90,
        delta: 26,
      },
    ],
  },
  {
    id: "bag",
    title: "Leather Mini Shoulder Bag",
    brand: "Atelier Noir",
    category: "Bags",
    asking: 178,
    retail: 430,
    matchPct: 91,
    grade: "A",
    gradeNote: "Even wear along the strap edge",
    seller: "Verified seller - Seoyeon",
    sellerMeta: "132 trades - 4.8 rating",
    posted: "Listed 6 hours ago",
    matchReason: "Matched on your neutral-leather saves",
    body: [
      "Authentic - ",
      { mark: "b1" },
      ". Leather is ",
      { mark: "b2" },
      { mark: "b3" },
      ". Hardware is ",
      { mark: "b4" },
      ".",
    ],
    marks: [
      {
        id: "b1",
        struck: "bought at the flagship store",
        inserted: null,
        kind: "confirmed",
        source: "archive",
        method: "Serial stamp falls inside the flagship allocation block for that season.",
        confidence: 97,
        delta: 0,
      },
      {
        id: "b2",
        struck: "unmarked",
        inserted: "creased at the strap join",
        kind: "corrected",
        source: "photo",
        method: "Grain distortion at the strap join reads as sustained load, not a shipping fold.",
        confidence: 94,
        delta: -22,
      },
      {
        id: "b3",
        struck: ", and I still have the original receipt",
        inserted: null,
        kind: "removed",
        source: "history",
        method: "No receipt was attached to this listing or to any prior listing of this item.",
        confidence: 82,
        delta: -14,
      },
      {
        id: "b4",
        struck: "lightly tarnished",
        inserted: "unmarked brass",
        kind: "raised",
        source: "photo",
        method: "What reads as tarnish under the seller's lamp is the factory brushed finish.",
        confidence: 89,
        delta: 19,
      },
    ],
  },
  {
    id: "sneakers",
    title: "High-Top Leather Sneakers",
    brand: "Runway Archive",
    category: "Footwear",
    asking: 148,
    retail: 320,
    matchPct: 96,
    grade: "S",
    gradeNote: "Like new, 6% sole wear",
    seller: "Verified seller - Minjae",
    sellerMeta: "189 trades - 5.0 rating",
    posted: "Listed 1 day ago",
    matchReason: "Matched on your archive-sneaker watchlist",
    body: [
      "Worn ",
      { mark: "s1" },
      ". Soles are ",
      { mark: "s2" },
      ". Size runs ",
      { mark: "s3" },
      ". Colourway is ",
      { mark: "s4" },
      ".",
    ],
    marks: [
      {
        id: "s1",
        struck: "twice",
        inserted: "about eleven times",
        kind: "corrected",
        source: "photo",
        method: "Outsole tread is 6% down, which is eleven wears of this compound, not two.",
        confidence: 95,
        delta: -24,
      },
      {
        id: "s2",
        struck: "original, never resoled",
        inserted: null,
        kind: "confirmed",
        source: "archive",
        method: "Stitch count and midsole seam match the factory spec for this production run.",
        confidence: 98,
        delta: 0,
      },
      {
        id: "s3",
        struck: "true to size",
        inserted: "0.5 cm long",
        kind: "corrected",
        source: "history",
        method: "Four buyers of this model from this seller reported the same half-size overshoot.",
        confidence: 86,
        delta: -9,
      },
      {
        id: "s4",
        struck: "the standard white",
        inserted: "the 2019 off-white run",
        kind: "raised",
        source: "archive",
        method: "Eyelet spacing and heel-tab font place this in the short 2019 off-white run.",
        confidence: 92,
        delta: 52,
      },
    ],
  },
  {
    id: "boots",
    title: "Suede Chelsea Boots",
    brand: "Larkspur House",
    category: "Footwear",
    asking: 126,
    retail: 295,
    matchPct: 89,
    grade: "A",
    gradeNote: "Resoled heel, clean uppers",
    seller: "Verified seller - Elin",
    sellerMeta: "163 trades - 4.9 rating",
    posted: "Listed 4 days ago",
    matchReason: "Matched on your suede and ankle-height picks",
    body: [
      "Suede is ",
      { mark: "c1" },
      ". Heels are ",
      { mark: "c2" },
      ". ",
      { mark: "c3" },
      ". Sold ",
      { mark: "c4" },
      ".",
    ],
    marks: [
      {
        id: "c1",
        struck: "spotless",
        inserted: "watermarked at the right toe",
        kind: "corrected",
        source: "photo",
        method: "A dried ring on the right toe box shows under raking light, not under flash.",
        confidence: 93,
        delta: -19,
      },
      {
        id: "c2",
        struck: "factory original",
        inserted: "professionally resoled once",
        kind: "corrected",
        source: "archive",
        method: "Heel block profile belongs to a cobbler's stock unit, not the maker's tooling.",
        confidence: 90,
        delta: -16,
      },
      {
        id: "c3",
        struck: "Elastic panels still have full snap",
        inserted: null,
        kind: "confirmed",
        source: "photo",
        method: "Panel recoil measured across the seller's flex frames sits inside the new range.",
        confidence: 95,
        delta: 0,
      },
      {
        id: "c4",
        struck: "as-is",
        inserted: "with a 14-day condition guarantee",
        kind: "raised",
        source: "sales",
        method: "Guaranteed listings from A-grade sellers close 21 dollars higher on average.",
        confidence: 87,
        delta: 21,
      },
    ],
  },
];

// --- derivations ------------------------------------------------------------------------------------

export function markById(listing: Listing, id: string): Mark {
  const found = listing.marks.find((m) => m.id === id);
  // Every id in `body` comes from the same literal as `marks`, so this is unreachable; the fallback
  // exists so the return type is `Mark` rather than `Mark | undefined`.
  return found ?? listing.marks[0];
}

/** Fair price = what the seller asked, plus every adjustment the marks produced. */
export function fairPrice(listing: Listing): number {
  return listing.marks.reduce((total, mark) => total + mark.delta, listing.asking);
}

/** Positive when the ask is above verified value, negative when the listing is under-priced. */
export function gap(listing: Listing): number {
  return listing.asking - fairPrice(listing);
}

export function discountVsRetail(listing: Listing): number {
  return Math.round(((listing.retail - fairPrice(listing)) / listing.retail) * 100);
}

export type Tally = { checked: number; confirmed: number; rewritten: number; removed: number };

export function tally(listing: Listing): Tally {
  return {
    checked: listing.marks.length,
    confirmed: listing.marks.filter((m) => m.kind === "confirmed").length,
    rewritten: listing.marks.filter((m) => m.kind === "corrected" || m.kind === "raised").length,
    removed: listing.marks.filter((m) => m.kind === "removed").length,
  };
}

// --- view modes ---------------------------------------------------------------------------------------

export type ViewMode = "listed" | "redline" | "verified";

export const MODES: { id: ViewMode; label: string; hint: string }[] = [
  { id: "listed", label: "As listed", hint: "The description exactly as the seller wrote it." },
  { id: "redline", label: "Redline", hint: "Both readings at once. Select any mark for its evidence." },
  { id: "verified", label: "As verified", hint: "What survives the check, rewritten." },
];

/** Redline is the resting state: the divergence is on screen before anyone touches anything. */
export const DEFAULT_MODE: ViewMode = "redline";
export const DEFAULT_LISTING = "trench";
export const DEFAULT_MARK = "t2";

// --- lower-page copy ------------------------------------------------------------------------------------

export const METHOD_COLUMNS: { id: SourceId; figure: string; caption: string; body: string }[] = [
  {
    id: "photo",
    figure: "1,400",
    caption: "dpi per uploaded frame",
    body: "Condition claims are settled against the seller's own photographs at a resolution no phone screen shows. Scuffs, creases and watermarks are found where the seller looked and did not see.",
  },
  {
    id: "archive",
    figure: "22",
    caption: "years of maker records",
    body: "Material, hardware and construction claims are matched to production records. A blend that was never woven cannot survive the sentence that claims it.",
  },
  {
    id: "sales",
    figure: "90",
    caption: "days of closed trades",
    body: "Every correction is priced against what the same model and grade actually sold for, not against what other sellers are still asking for it.",
  },
];

export const BAND_STATS: { figure: string; label: string; note: string }[] = [
  { figure: "31%", label: "of listing claims are rewritten", note: "across every category, last quarter" },
  { figure: "4.2", label: "marks on the average listing", note: "one of them raises the price" },
  { figure: "$61", label: "median gap to verified value", note: "in the buyer's favour, usually" },
];

export const TESTIMONIAL = {
  quote:
    "I stopped reading listings. I read the redline. The first time a mark went the other way and told me the boots were worth more than the seller was asking, I understood this was not a haggling tool.",
  name: "Reiko Tanaka",
  role: "Product designer, 14 trades on repick",
};

export const FAQ_LINES: { q: string; a: string }[] = [
  {
    q: "Does the seller see the redline?",
    a: "Yes, before it publishes. They can accept a mark, attach evidence against it, or pull the listing. What they cannot do is hide it from you.",
  },
  {
    q: "Why would a mark ever raise the price?",
    a: "Because sellers undersell as often as they oversell. A mis-labelled colourway or an unrecognised production run is a correction like any other, and it is the buyer who was about to lose that money.",
  },
  {
    q: "What happens when nothing supports a claim?",
    a: "It is struck with no replacement and it stays struck. An unsupported sentence is removed from the description rather than quietly softened into something vaguer.",
  },
];
