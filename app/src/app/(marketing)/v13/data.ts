import type { LucideIcon } from "lucide-react";
import { ScanLine, Wrench, ShieldCheck, Truck } from "lucide-react";

/**
 * Running Ledger — data, arithmetic and shared style tokens for auto-landing-r11/c.
 *
 * Everything below is a module constant or a pure function of plain numbers. No `Math.random`,
 * no `Date.now`, no argless `new Date()`: the server render and the client hydration always agree,
 * and the same order value always produces the same ledger down to the dollar.
 */

// --- utils ----------------------------------------------------------------------------------------
export const cx = (...parts: Array<string | false | null | undefined>) =>
  parts.filter(Boolean).join(" ");

/** Grouped thousands by hand — `toLocaleString` reads ICU data that can differ between the server
 * render and the browser, which shows up as a hydration mismatch on exactly this kind of figure. */
export const money = (value: number): string =>
  `$${Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;

// --- palette ---------------------------------------------------------------------------------------
// Light, near-monochrome paper. One accent, teal #0F766E, measured rather than assumed:
//   #0F766E on #FFFFFF ....... 5.47:1  (AA at every size — usable as small text)
//   #0F766E on #F5F5F2 ....... 5.01:1  (AA at every size)
//   #FFFFFF on #0F766E ....... 5.47:1  (AA at every size — so accent fills carry WHITE ink)
//   #12120F on #0F766E ....... 2.63:1  (fails even the large-text floor — dark ink is banned on fill)
//   #5B5B55 on #FFFFFF ....... 6.83:1  ·  #5B5B55 on #F5F5F2 ..... 6.25:1
// The r10/a delta generalises: on this accent too, small text on an accent fill must be white.
export const INK = "#12120F";
export const MUTED = "#5B5B55";
export const LINE = "#E2E2DC";
export const PAPER = "#F5F5F2";
export const ACCENT = "#0F766E";
export const ACCENT_DEEP = "#0B4F4A";
export const ACCENT_SOFT = "#E3F1EF";

/**
 * Focus indicator. Deliberately *not* `ring` + `ring-offset` (Tailwind v4 paints that combination
 * fully transparent) and deliberately with no `outline-none` in front of it (that sets
 * `--tw-outline-style: none`, so the focus outline cancels itself). A plain outline plus a
 * box-shadow halo, so something is painted no matter which of the two the engine honours.
 */
export const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F766E] focus-visible:shadow-[0_0_0_3px_#C7E7E2]";

// tracking 3-scale: eyebrow 0.28em / caption 0.16em / stat 0.12em
export const EYEBROW = "text-[0.68rem] font-semibold uppercase tracking-[0.28em]";
export const CAPTION = "text-[0.7rem] font-semibold uppercase tracking-[0.16em]";
export const STAT = "text-[0.68rem] font-semibold uppercase tracking-[0.12em]";
export const NUM = "tabular-nums";

// --- ledger model -----------------------------------------------------------------------------------
export type CheckId = "condition" | "repair" | "authenticity" | "transit";
export type TradeId = "sneakers" | "handbag" | "outerwear";

export type LedgerLine = {
  id: CheckId;
  /** Ledger row label — the thing that would have cost money. */
  entry: string;
  icon: LucideIcon;
  /** Avoided loss at the trade's reference order value, in whole dollars. */
  base: number;
  /** True for the line that is genuinely zero because escrow already settled it. */
  settled?: true;
  /** True when a sceptical buyer could plausibly claim they would have spotted it unaided. */
  waivable: boolean;
  claim: string;
  found: string;
  fig: string;
  facts: { k: string; v: string }[];
  note: string;
  image?: { src: string; alt: string };
};

export type Trade = {
  id: TradeId;
  label: string;
  item: string;
  /** Reference asking price the line items were priced against. */
  base: number;
  min: number;
  max: number;
  step: number;
  lines: LedgerLine[];
};

export const TRADES: Trade[] = [
  {
    id: "sneakers",
    label: "Sneakers",
    item: "Air-cushion high-tops, 2019",
    base: 420,
    min: 150,
    max: 900,
    step: 10,
    lines: [
      {
        id: "condition",
        entry: "Condition grade overstated",
        icon: ScanLine,
        base: 40,
        waivable: true,
        claim: "Listed Grade A, described as worn twice",
        found: "Scan returns B minus: midsole creasing plus a collapsed heel counter",
        fig: "Fig. 01",
        facts: [
          { k: "Seller grade", v: "A" },
          { k: "Scan grade", v: "B minus" },
          { k: "Verified pairs behind the model", v: "96,400" },
        ],
        note: "A grade is not an adjective a seller picks. It is the output of a wear model read off 14 photographed zones and scored against completed resales of the same silhouette. Two grades apart is a real price gap, and the ledger carries that gap and nothing else.",
        image: {
          src: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=80",
          alt: "Pair of high-top leather sneakers placed side by side",
        },
      },
      {
        id: "repair",
        entry: "Repair history not declared",
        icon: Wrench,
        base: 85,
        waivable: true,
        claim: "Repair history field left empty",
        found: "Resoled once and re-glued: adhesive bloom along the toe seam",
        fig: "Fig. 02",
        facts: [
          { k: "Repairs declared", v: "0" },
          { k: "Repairs detected", v: "2" },
          { k: "Resale penalty applied", v: "Per repair" },
        ],
        note: "Repairs are not disqualifying and repick does not hide them. They are priced. An undeclared resole moves the resale band down one step on its own, and a re-glue on top of it moves the band again, which is why this line is larger than the grade line above it.",
      },
      {
        id: "authenticity",
        entry: "Not authentic",
        icon: ShieldCheck,
        base: 310,
        waivable: true,
        claim: "Sold as a retail pair from the 2019 run",
        found: "Replica: midsole stitch pitch matches no verified pair in the archive",
        fig: "Fig. 03",
        facts: [
          { k: "Archive pairs compared", v: "1,842" },
          { k: "Matches found", v: "0" },
          { k: "Residual value as a replica", v: "About a quarter" },
        ],
        note: "This is the line that pays for everything else. A replica is not worth zero, so the ledger does not pretend it is: the entry is the asking price minus what the item is genuinely worth once it is described correctly.",
      },
      {
        id: "transit",
        entry: "Crushed in transit",
        icon: Truck,
        base: 0,
        settled: true,
        waivable: false,
        claim: "Carrier marked the parcel delivered intact",
        found: "Box crushed, heel tab torn. Escrow returned the money before a dispute was opened",
        fig: "Fig. 04",
        facts: [
          { k: "Buyer out of pocket", v: "Nothing" },
          { k: "Hours to settle", v: "19" },
          { k: "Claim forms filed by the buyer", v: "0" },
        ],
        note: "A ledger you can trust has to be able to write a zero. Nothing here was saved by inspection, because nothing here could be seen before payment. It was settled by escrow instead, and it is listed at zero rather than folded into the total to make the total look bigger.",
      },
    ],
  },
  {
    id: "handbag",
    label: "Handbag",
    item: "Quilted leather shoulder bag, 2016",
    base: 1240,
    min: 400,
    max: 2400,
    step: 20,
    lines: [
      {
        id: "condition",
        entry: "Condition grade overstated",
        icon: ScanLine,
        base: 145,
        waivable: true,
        claim: "Listed Grade S, described as unused",
        found: "Scan returns A minus: corner abrasion and edge paint loss on three panels",
        fig: "Fig. 01",
        facts: [
          { k: "Seller grade", v: "S" },
          { k: "Scan grade", v: "A minus" },
          { k: "Panels showing wear", v: "3 of 8" },
        ],
        note: "Corner abrasion is the single most mispriced defect in resale leather, because it photographs as shadow. The scan reads it off edge geometry rather than tone, which is why the grade moved and the price with it.",
        image: {
          src: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80",
          alt: "Close-up photo of a leather mini shoulder bag",
        },
      },
      {
        id: "repair",
        entry: "Repair history not declared",
        icon: Wrench,
        base: 220,
        waivable: true,
        claim: "Repair history field left empty",
        found: "Strap hardware swapped for a non-original clasp",
        fig: "Fig. 02",
        facts: [
          { k: "Repairs declared", v: "0" },
          { k: "Repairs detected", v: "1" },
          { k: "Hardware match", v: "Non-original" },
        ],
        note: "Replaced hardware is the repair buyers forgive most easily and pay for most heavily, because it caps what the piece can ever resell for. It is priced against completed sales of the same model with and without original clasps.",
      },
      {
        id: "authenticity",
        entry: "Not authentic",
        icon: ShieldCheck,
        base: 1090,
        waivable: true,
        claim: "Sold with a boutique receipt from 2016",
        found: "Aftermarket lining, and the date code appears in no verified example",
        fig: "Fig. 03",
        facts: [
          { k: "Archive examples compared", v: "3,110" },
          { k: "Matches found", v: "0" },
          { k: "Receipt provided", v: "Yes, unverifiable" },
        ],
        note: "A receipt is a photograph of a piece of paper. The archive comparison is not, and where the two disagree the ledger follows the archive. The entry is the asking price minus what an unbranded bag of this build is worth.",
      },
      {
        id: "transit",
        entry: "Crushed in transit",
        icon: Truck,
        base: 0,
        settled: true,
        waivable: false,
        claim: "Carrier marked the parcel delivered intact",
        found: "Water ingress through a split seam in the outer carton. Escrow returned the money",
        fig: "Fig. 04",
        facts: [
          { k: "Buyer out of pocket", v: "Nothing" },
          { k: "Hours to settle", v: "19" },
          { k: "Claim forms filed by the buyer", v: "0" },
        ],
        note: "A ledger you can trust has to be able to write a zero. Nothing here was saved by inspection, because nothing here could be seen before payment. It was settled by escrow instead, and it is listed at zero rather than folded into the total to make the total look bigger.",
      },
    ],
  },
  {
    id: "outerwear",
    label: "Outerwear",
    item: "Belted gabardine trench, 2014",
    base: 680,
    min: 250,
    max: 1500,
    step: 10,
    lines: [
      {
        id: "condition",
        entry: "Condition grade overstated",
        icon: ScanLine,
        base: 95,
        waivable: true,
        claim: "Listed Grade A, described as stored flat",
        found: "Scan returns B: moth damage under the collar and a lifted hem facing",
        fig: "Fig. 01",
        facts: [
          { k: "Seller grade", v: "A" },
          { k: "Scan grade", v: "B" },
          { k: "Defects outside photographed area", v: "2" },
        ],
        note: "Both defects sit where a listing photo never points. The scan works from the garment map rather than from the shots the seller chose, so an unphotographed collar is not an unscored collar.",
      },
      {
        id: "repair",
        entry: "Repair history not declared",
        icon: Wrench,
        base: 130,
        waivable: true,
        claim: "Repair history field left empty",
        found: "Body panel relined with a substituted twill",
        fig: "Fig. 02",
        facts: [
          { k: "Repairs declared", v: "0" },
          { k: "Repairs detected", v: "1" },
          { k: "Lining match", v: "Substituted" },
        ],
        note: "A relined body is competent work and worth saying out loud. Undeclared, it is the difference between the price this coat was asking and the price coats with substituted linings actually complete at.",
      },
      {
        id: "authenticity",
        entry: "Not authentic",
        icon: ShieldCheck,
        base: 585,
        waivable: true,
        claim: "Sold as a house archive piece",
        found: "Counterfeit label weave: thread count is half the verified specification",
        fig: "Fig. 03",
        facts: [
          { k: "Archive labels compared", v: "1,204" },
          { k: "Matches found", v: "0" },
          { k: "Residual value unbranded", v: "About a seventh" },
        ],
        note: "The coat is still a coat. It is simply not the coat it was sold as, and the gap between those two prices is the entry. The ledger never writes a loss larger than the thing is actually worth.",
      },
      {
        id: "transit",
        entry: "Crushed in transit",
        icon: Truck,
        base: 0,
        settled: true,
        waivable: false,
        claim: "Carrier marked the parcel delivered intact",
        found: "Belt hardware punched through the garment bag. Escrow returned the money",
        fig: "Fig. 04",
        facts: [
          { k: "Buyer out of pocket", v: "Nothing" },
          { k: "Hours to settle", v: "19" },
          { k: "Claim forms filed by the buyer", v: "0" },
        ],
        note: "A ledger you can trust has to be able to write a zero. Nothing here was saved by inspection, because nothing here could be seen before payment. It was settled by escrow instead, and it is listed at zero rather than folded into the total to make the total look bigger.",
      },
    ],
  },
];

// --- arithmetic ---------------------------------------------------------------------------------------
const round5 = (n: number) => Math.round(n / 5) * 5;

/** Line amount at the current order value. Scales linearly off the reference price, then snaps to
 * $5 so the ledger never shows a figure a real invoice would not. */
export function amountFor(line: LedgerLine, trade: Trade, value: number): number {
  if (line.settled) return 0;
  return round5((line.base * value) / trade.base);
}

/** Inspection fee: 2% of the order, floored at $9. The denominator of every claim on this page. */
export const feeFor = (value: number): number => Math.max(9, Math.round(value / 50));

export type Row = {
  line: LedgerLine;
  amount: number;
  waived: boolean;
  /** Share of the standing total, 0–1. Re-normalises whenever a line is waived. */
  share: number;
};

export function buildRows(trade: Trade, value: number, waived: CheckId[]): Row[] {
  const amounts = trade.lines.map((line) => amountFor(line, trade, value));
  const standing = trade.lines.reduce(
    (sum, line, i) => (waived.includes(line.id) ? sum : sum + amounts[i]),
    0,
  );
  return trade.lines.map((line, i) => {
    const isWaived = waived.includes(line.id);
    return {
      line,
      amount: amounts[i],
      waived: isWaived,
      share: standing > 0 && !isWaived ? amounts[i] / standing : 0,
    };
  });
}

export const sumRows = (rows: Row[]): number =>
  rows.reduce((sum, row) => (row.waived ? sum : sum + row.amount), 0);

/** Amount the visitor has personally written off with the "I would have caught this" switches. */
export const waivedTotal = (rows: Row[]): number =>
  rows.reduce((sum, row) => (row.waived ? sum + row.amount : sum), 0);

// --- product preview (four parallel listings, every proof always on) --------------------------------
export type Listing = {
  id: string;
  title: string;
  brand: string;
  match: number;
  matchReason: string;
  grade: string;
  gradeNote: string;
  seller: string;
  sellerMeta: string;
  price: number;
  original: number;
  discount: number;
  image: string;
  alt: string;
};

export const LISTINGS: Listing[] = [
  {
    id: "sneakers",
    title: "Classic Low-Top Sneakers",
    brand: "Fieldstone Co.",
    match: 96,
    matchReason: "Grade and price band both matched",
    grade: "A",
    gradeNote: "Minor scuffing",
    seller: "Mika",
    sellerMeta: "76 trades, 4.7 rating",
    price: 88,
    original: 160,
    discount: 45,
    image:
      "https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=700&q=80",
    alt: "Pair of classic white low-top sneakers",
  },
  {
    id: "bag",
    title: "Leather Crossbody Bag",
    brand: "Atelier Bran",
    match: 94,
    matchReason: "Authenticity archive matched",
    grade: "S",
    gradeNote: "Museum condition",
    seller: "Noah",
    sellerMeta: "118 trades, 4.8 rating",
    price: 112,
    original: 230,
    discount: 51,
    image:
      "https://images.unsplash.com/photo-1560243563-062bfc001d68?auto=format&fit=crop&w=700&q=80",
    alt: "Leather crossbody bag resting on a plain floor",
  },
  {
    id: "coat",
    title: "Wool Double-Breasted Coat",
    brand: "Rowan and Fife",
    match: 92,
    matchReason: "Repair history clean",
    grade: "A",
    gradeNote: "Light wear only",
    seller: "Priya",
    sellerMeta: "241 trades, 4.9 rating",
    price: 198,
    original: 390,
    discount: 49,
    image:
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=700&q=80",
    alt: "Wool double-breasted coat hung against a plain backdrop",
  },
  {
    id: "boots",
    title: "Suede Chelsea Boots",
    brand: "Larkspur House",
    match: 91,
    matchReason: "Repairs declared and priced in",
    grade: "A",
    gradeNote: "Resoled heel, declared",
    seller: "Elin",
    sellerMeta: "163 trades, 4.9 rating",
    price: 96,
    original: 175,
    discount: 45,
    image:
      "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=700&q=80",
    alt: "Pair of suede Chelsea boots side by side",
  },
];

// --- closing proof -------------------------------------------------------------------------------------
export const TESTIMONIAL = {
  quote:
    "I switched off the two lines I was sure I would have spotted myself, out of stubbornness. The number that stayed on the screen was still bigger than everything I have ever paid repick.",
  name: "Reiko Tanaka",
  role: "Buys roughly two pieces a month",
} as const;

export const PROOF_STATS: { value: string; label: string }[] = [
  { value: "182,400", label: "Orders inspected to date" },
  { value: "$41.6M", label: "Written into buyer ledgers" },
  { value: "0.4%", label: "Inspected orders later disputed" },
];
