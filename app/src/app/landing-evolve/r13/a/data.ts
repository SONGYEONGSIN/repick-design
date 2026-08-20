// app/src/app/landing-evolve/r13/a/data.ts — data, radar geometry, match arithmetic and shared
// style tokens for auto-landing-r13/a ("Radar Match Profiles").
//
// Every export below is a module constant or a PURE function of plain numbers and the
// chip/weight state. No `Math.random`, no `Date.now`, no argless `new Date()`, so the server
// render and the client hydration always agree, and every match% / polygon on the page is real
// arithmetic the visitor can re-derive rather than a writer's guess. All SVG trig coordinates are
// rounded to 2 decimals (see `axisPoint`).

import type { LucideIcon } from "lucide-react";
import { Tag, ShieldCheck, Ruler, Gem, CircleGauge, Sparkles, ListFilter, ArrowLeftRight } from "lucide-react";

// --- utils -----------------------------------------------------------------------------------------
export const cx = (...parts: Array<string | false | null | undefined>) =>
  parts.filter(Boolean).join(" ");

/** Grouped thousands by hand — `toLocaleString` reads ICU data that can differ between the server
 * render and the browser, a hydration mismatch on exactly this kind of figure (precedent:
 * auto-landing-r12/c). */
export const money = (value: number): string =>
  `$${Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;

// --- palette (DARK, near-monochrome, AMBER accent only) --------------------------------------------
// BG #0B0B0F. Accent is amber and kept minimal — it carries one meaning: "what the buyer is asking
// for" (the ideal polygon, the selected chips, the match number). Every value is a WCAG relative-
// luminance ratio computed directly against this page's actual colors:
//   BG #0B0B0F / white #FFFFFF
//   amber-400 #fbbf24 on BG .......... 11.77:1  (small accent text + icons on dark — AA safe)
//   amber-600 #d97706 on BG ..........  4.75:1  (large text / borders / polygon stroke+fill)
//   amber-600 #d97706 fill, white text   3.18:1  (FAILS AA small text — never carries small text)
//   amber-700 #b45309 fill, white text   5.02:1  (AA small text — every amber button/badge fill)
//   zinc-400  #A1A1AA on BG ..........  7.63:1  (muted body copy — dark auxiliary floor)
// Net rule: amber-400 is small text/icons; amber-600 is large text, borders and the radar polygon
// paint (a non-text surface); a fill that carries white text is amber-700 specifically, because
// amber-600 is the one step that falls short of 4.5:1 with white ink (same reasoning r12/c used to
// pick cyan-700 over cyan-600 for its text-bearing fills).
export const BG = "#0B0B0F";
export const SURFACE = "#141419";
export const SURFACE_2 = "#1B1B22";
export const MUTED = "#A1A1AA";
export const AMBER = "#fbbf24"; // amber-400 — small accent text + icons on dark
export const AMBER_INK = "#d97706"; // amber-600 — large text, borders, radar polygon stroke/fill
export const AMBER_FILL = "#b45309"; // amber-700 — fills that carry white text (buttons/badges)

/** Focus indicator — plain `outline` + a soft `box-shadow` halo, not `ring`/`ring-offset` (Tailwind
 * v4 paints that transparent), and no `outline-none` in front to cancel itself. Amber carries every
 * focus ring — the one interface-response meaning the accent already owns. */
export const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#fbbf24] focus-visible:shadow-[0_0_0_3px_rgba(251,191,36,0.3)]";

// Exactly 3 rendered weights across the route: 400 (normal) / 600 (semibold) / 800 (extrabold).
// Every text element sets one explicitly; these tokens keep the small-caps labels on 600.
export const EYEBROW = "text-[0.68rem] font-semibold uppercase tracking-[0.26em]";
export const CAPTION = "text-[0.7rem] font-semibold uppercase tracking-[0.14em]";
export const STAT = "text-[0.66rem] font-semibold uppercase tracking-[0.1em]";
export const NUM = "tabular-nums";

// --- radar geometry ---------------------------------------------------------------------------------
// One 5-axis polar chart per listing. Axis k sits at angle (-90° + 72°k) so axis 0 points straight
// up. Both the buyer's ideal polygon and the listing's own polygon are drawn on the same grid; where
// they coincide is the visual match, and `matchPercent` below is the exact area of that overlap.
// Unit vectors are hard constants (cos/sin of the five angles, 4 dp) so nothing trigonometric runs
// at render time; `axisPoint` rounds every emitted coordinate to 2 decimals.
export const RADAR = { cx: 66, cy: 66, r: 48, size: 132 } as const;

export const AXES = [
  { id: "price", label: "Price", short: "Value for money", icon: Tag },
  { id: "condition", label: "Condition", short: "Wear & grade", icon: CircleGauge },
  { id: "authenticity", label: "Authenticity", short: "Verified real", icon: ShieldCheck },
  { id: "fit", label: "Fit", short: "True to size", icon: Ruler },
  { id: "rarity", label: "Rarity", short: "Hard to find", icon: Gem },
] as const;

export type AxisId = (typeof AXES)[number]["id"];

const UNIT: ReadonlyArray<readonly [number, number]> = [
  [0, -1],
  [0.9511, -0.309],
  [0.5878, 0.809],
  [-0.5878, 0.809],
  [-0.9511, -0.309],
];

const round2 = (n: number) => Math.round(n * 100) / 100;

/** Point on axis k at value v (0–100), as [x, y] rounded to 2 decimals. */
export function axisPoint(k: number, v: number): [number, number] {
  const t = v / 100;
  return [
    round2(RADAR.cx + RADAR.r * t * UNIT[k][0]),
    round2(RADAR.cy + RADAR.r * t * UNIT[k][1]),
  ];
}

/** `points=""` string for a 5-value polygon. */
export function polygonPoints(values: readonly number[]): string {
  return values.map((v, k) => axisPoint(k, v).join(",")).join(" ");
}

/** Spoke endpoints (value 100) for the faint axis grid. */
export const SPOKES = UNIT.map((_, k) => axisPoint(k, 100));

// --- match arithmetic (pure function of the chip/weight state) --------------------------------------
// The buyer's ideal polygon is built from which axes are selected (chips) and how demanding the
// weight level is. On a selected axis the buyer asks for `demand` (60/80/100); on an axis they left
// off, the bar drops to a low baseline they'll accept from anyone. Match% is the area of the
// intersection of the ideal and listing polygons over the area of the ideal — i.e. how much of what
// the buyer asked for this listing actually covers. Because both polygons are star-shaped from the
// centre, the intersection area is the sum, over the five 72° sectors, of the triangle spanned by the
// smaller radius on each bounding axis.
export const BASELINE = 30; // an unselected axis: satisfied by almost anything
const SIN72 = 0.9510565;

export type WeightLevel = { id: string; label: string; demand: number };
export const WEIGHT_LEVELS: WeightLevel[] = [
  { id: "lenient", label: "Lenient", demand: 60 },
  { id: "balanced", label: "Balanced", demand: 80 },
  { id: "strict", label: "Strict", demand: 100 },
];

/** The buyer's ideal value per axis given the selected chips and the demand level. */
export function idealProfile(selected: readonly AxisId[], demand: number): number[] {
  return AXES.map((a) => (selected.includes(a.id) ? demand : BASELINE));
}

/** Area of a 5-radius star polygon (5 sectors of 72°). */
function polyArea(values: readonly number[]): number {
  let a = 0;
  for (let k = 0; k < 5; k++) {
    const n = (k + 1) % 5;
    a += 0.5 * (values[k] / 100) * (values[n] / 100) * SIN72;
  }
  return a;
}

/** Integer match%: overlap(ideal, listing) / area(ideal). */
export function matchPercent(listing: readonly number[], ideal: readonly number[]): number {
  let overlap = 0;
  for (let k = 0; k < 5; k++) {
    const n = (k + 1) % 5;
    overlap +=
      0.5 * (Math.min(listing[k], ideal[k]) / 100) * (Math.min(listing[n], ideal[n]) / 100) * SIN72;
  }
  const idealArea = polyArea(ideal);
  return Math.round((100 * overlap) / idealArea);
}

// --- listings --------------------------------------------------------------------------------------
// Axis values are 0–100, higher = better for the buyer (Price = value-for-money). These fixed
// profiles are what make the stack re-sort: with the default chips (Price/Condition/Authenticity,
// Balanced) the order is boots → tote → jacket; enabling Rarity lifts the jacket to the top,
// enabling Fit lifts the tote, and Strict spreads them apart — all from `matchPercent` alone.
export type Listing = {
  id: string;
  title: string;
  brand: string;
  category: string;
  values: Record<AxisId, number>;
  grade: string;
  certified: boolean;
  original: number;
  price: number;
  image: { src: string; alt: string };
};

export const LISTINGS: Listing[] = [
  {
    id: "boots",
    title: "Suede desert boots",
    brand: "Larkspur House",
    category: "Footwear",
    values: { price: 73, condition: 95, authenticity: 88, fit: 66, rarity: 41 },
    grade: "A-",
    certified: true,
    original: 210,
    price: 118,
    image: {
      src: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=640&q=80",
      alt: "A pair of suede desert boots photographed for a resale listing",
    },
  },
  {
    id: "tote",
    title: "Pebbled leather tote",
    brand: "Atelier Noir",
    category: "Bags",
    values: { price: 84, condition: 76, authenticity: 73, fit: 90, rarity: 52 },
    grade: "B+",
    certified: true,
    original: 260,
    price: 149,
    image: {
      src: "https://images.unsplash.com/photo-1560243563-062bfc001d68?auto=format&fit=crop&w=640&q=80",
      alt: "A pebbled leather tote bag laid flat on a plain surface",
    },
  },
  {
    id: "jacket",
    title: "Archive nylon jacket",
    brand: "Fieldstone Co.",
    category: "Outerwear",
    values: { price: 60, condition: 70, authenticity: 92, fit: 80, rarity: 95 },
    grade: "B",
    certified: true,
    original: 320,
    price: 176,
    image: {
      src: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=640&q=80",
      alt: "An archive nylon jacket hung against a neutral studio backdrop",
    },
  },
];

/** Listing axis values in AXES order (for the polygon + match math). */
export const listingVector = (l: Listing): number[] => AXES.map((a) => l.values[a.id]);

export const discountOf = (l: Listing): number =>
  Math.round((1 - l.price / l.original) * 100);

/** The selected axes this listing fully meets, strongest first — the hover/focus micro-detail.
 * Never gates the always-shown proof; it only names why a card sits where it does. */
export function strongestAxes(l: Listing, selected: readonly AxisId[], demand: number): string[] {
  const pool = selected.length ? selected : AXES.map((a) => a.id);
  return pool
    .filter((id) => l.values[id] >= (selected.includes(id) ? demand : BASELINE))
    .sort((a, b) => l.values[b] - l.values[a])
    .slice(0, 2)
    .map((id) => AXES.find((a) => a.id === id)!.label);
}

export const DEFAULT_SELECTED: AxisId[] = ["price", "condition", "authenticity"];
export const DEFAULT_LEVEL = "balanced";

// --- value-in-3 (each part tied to the radar mechanic) ---------------------------------------------
export type ValuePart = { icon: LucideIcon; kicker: string; title: string; body: string };
export const VALUE_PARTS: ValuePart[] = [
  {
    icon: ListFilter,
    kicker: "Your polygon",
    title: "You set the shape",
    body: "Pick the axes that matter and how hard to weigh them. That draws one ideal profile — the amber polygon every listing is measured against.",
  },
  {
    icon: Sparkles,
    kicker: "The overlap",
    title: "Match is area, not a vibe",
    body: "Each listing carries its own five-axis polygon. The match number is the exact overlap of the two shapes, so a high score means real coverage, not a slogan.",
  },
  {
    icon: ArrowLeftRight,
    kicker: "The re-sort",
    title: "Change one chip, the stack answers",
    body: "Toggle an axis and every radar redraws, every match recomputes, and the cards re-order — the ranking is the answer to the question you just asked.",
  },
];

// --- social proof ----------------------------------------------------------------------------------
export const PROOF_STATS: { value: string; label: string }[] = [
  { value: "148,000+", label: "Listings profiled on five axes" },
  { value: "91%", label: "Buyers who keep their top match" },
  { value: "5", label: "Axes behind every match score" },
];

export const TESTIMONIALS: { quote: string; name: string; role: string }[] = [
  {
    quote:
      "I turned off Rarity and turned up Condition, and the whole stack rearranged in front of me. For once a match score actually showed its work.",
    name: "Priya Kapoor",
    role: "Bought 4 pieces on repick",
  },
  {
    quote:
      "The two shapes overlapping told me more than any star rating. I could see exactly where a listing met what I asked for and where it fell short.",
    name: "Daniel Osei",
    role: "Resells footwear and bags",
  },
];
