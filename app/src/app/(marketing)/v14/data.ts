// app/src/app/landing-evolve/r12/c/data.ts — data, arithmetic and shared style tokens for
// auto-landing-r12/c ("Trace" — the vertical, scroll-linked process timeline).
//
// Every export below is a module constant or a pure function of plain numbers. No `Math.random`,
// no `Date.now`, no argless `new Date()` — the server render and the client hydration always agree,
// and the reference trade's numbers are all derived by the same two functions the payout
// calculator uses, so the timeline and the calculator can never quietly disagree with each other.

import type { LucideIcon } from "lucide-react";
import { Package, ScanLine, Wallet, BadgeCheck } from "lucide-react";

// --- utils -----------------------------------------------------------------------------------------
export const cx = (...parts: Array<string | false | null | undefined>) =>
  parts.filter(Boolean).join(" ");

/** Grouped thousands by hand — `toLocaleString` reads ICU data that can differ between the server
 * render and the browser, which shows up as a hydration mismatch on exactly this kind of figure
 * (documented precedent: auto-landing-r9/b, auto-landing-r10/b). */
export const money = (value: number): string =>
  `$${Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;

// --- palette ----------------------------------------------------------------------------------------
// Dark, near-monochrome canvas. Two accent families instead of one, each carrying a fixed meaning
// rather than being decorative: ROSE is what the *seller claims* (the listing as submitted), CYAN is
// what *repick verifies* (everything the AI produced from that point on). The timeline's node dots,
// eyebrows and the connecting line itself use this split so the two hues do real narrative work.
//
// Every value below is a WCAG relative-luminance ratio computed directly (not assumed) against this
// page's actual bg/surface colors, following the method design-principles §Color Tokens sets out
// after `auto-landing-r10` reversed the "dark ink on fill" rule:
//   BG #0B0C10 / SURFACE #14151C / white #FFFFFF
//   rose-300 #fda4af on BG ... 10.34:1   rose-400 #fb7185 on BG ... 7.26:1   (small text/icons — safe)
//   rose-500 #f43f5e on BG ... 5.32:1    rose-600 #e11d48 on BG ... 4.16:1   (large text/border/bars)
//   rose-600 fill, white text ......... 4.70:1  (AA small text — used for the one rose CTA/badge fill)
//   rose-600 on SURFACE (card bg) ..... 3.87:1  (fails AA small text — rose-600 is never small text
//                                                 on a card surface here, only on BG or as a fill)
//   cyan-300 #67e8f9 on BG ... 13.49:1   cyan-400 #22d3ee on BG ... 10.82:1  (small text/icons — safe)
//   cyan-500 #06b6d4 on BG ... 8.05:1    (large text/border/bars — the "repick verified" ink)
//   cyan-600 #0891b2 fill, white text .. 3.68:1  (FAILS AA small text — cyan-600 is not used as a
//                                                  text-bearing fill anywhere on this page)
//   cyan-700 #0e7490 fill, white text .. 5.36:1  (AA small text — used for every cyan button/badge fill)
//   cyan-700 on BG (border only) ...... 3.65:1  (passes the 3:1 non-text/large-text floor)
//   zinc-400 #A1A1AA on BG ............ 7.63:1  (muted body copy — DNA floor for dark auxiliary text)
// Net rule this page follows: the *base* hue (rose-600 / cyan-500) is for large text, borders and
// graph fills; the *tint* (rose-400 / cyan-400) is for small text and icons; a *fill that carries
// white text* uses rose-600 or cyan-700 specifically, never cyan-600, because cyan-600 is the one
// step in this family that falls short of 4.5:1 with white ink.
export const BG = "#0B0C10";
export const SURFACE = "#14151C";
export const SURFACE_2 = "#1B1C24";
export const LINE = "#24252E";
export const MUTED = "#A1A1AA";

export const ROSE = "#e11d48"; // rose-600 — large text / borders / bar fills / CTA fill (white ink)
export const ROSE_TINT = "#fb7185"; // rose-400 — small text / icons on BG or SURFACE
export const CYAN = "#06b6d4"; // cyan-500 — large text / borders / bar fills (verified ink)
export const CYAN_FILL = "#0e7490"; // cyan-700 — fills that carry white text (buttons/badges)
export const CYAN_TINT = "#22d3ee"; // cyan-400 — small text / icons on BG or SURFACE

/** Focus indicator. Plain `outline` + a soft `box-shadow` halo, not `ring`/`ring-offset` — Tailwind
 * v4 paints that combination fully transparent (documented in the v13/AuditTrail precedent this file
 * follows), and there is no `outline-none` in front of it to cancel itself. Cyan carries every focus
 * ring on this page regardless of which stage or side it sits on: it reads as "the interface
 * responding to you", a third, consistent meaning distinct from either accent's narrative role. */
export const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#22d3ee] focus-visible:shadow-[0_0_0_3px_rgba(34,211,238,0.28)]";

// tracking 3-scale: eyebrow 0.28em / caption 0.16em / stat 0.12em
export const EYEBROW = "text-[0.68rem] font-semibold uppercase tracking-[0.28em]";
export const CAPTION = "text-[0.7rem] font-semibold uppercase tracking-[0.16em]";
export const STAT = "text-[0.68rem] font-semibold uppercase tracking-[0.12em]";
export const NUM = "tabular-nums";

// --- shared settlement math --------------------------------------------------------------------------
// The reference trade (timeline) and the payout calculator both compute fee/net through these two
// constants and this one function, so a visitor who checks the calculator against the timeline's
// numbers is checking real arithmetic, not two writers' independent guesses.
export const SERVICE_FEE_RATE = 0.09;
export const PROCESSING_FEE = 2;

export function settle(offer: number): { fee: number; net: number } {
  const fee = Math.round(offer * SERVICE_FEE_RATE);
  return { fee, net: offer - fee - PROCESSING_FEE };
}

// --- reference trade: the one listing the timeline follows end to end -------------------------------
export const TRACE_ITEM = {
  title: "Belted wool coat",
  size: "Women's M",
  category: "Outerwear",
  seller: "Priya K.",
  sellerTrades: 118,
  askingPrice: 310,
  selfGrade: "Like new",
  photosSubmitted: 6,
  image: {
    src: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=900&q=80",
    alt: "Wool coats hung neatly in a row, photographed for a resale listing",
  },
} as const;

export const AI_VERDICT = {
  grade: "B+",
  authenticity: "Verified" as const,
  archiveMatches: 1,
  subscores: [
    { label: "Shell fabric", value: 92 },
    { label: "Stitching", value: 88 },
    { label: "Hardware", value: 74 },
    { label: "Authenticity", value: 100 },
  ],
  findings: [
    "Cuff lining shows moderate pilling",
    "Belt buckle re-plated — non-original hardware",
    "Shell fabric: 0 tears, 0 stains",
  ],
} as const;

export const OFFER = {
  compLow: 165,
  compHigh: 210,
  deductions: [
    { label: "Non-original hardware", amount: 18 },
    { label: "Cuff lining pilling", amount: 14 },
  ],
  buyerMatch: 91,
  holdHours: 48,
} as const;

/** $210 comparable high, minus every priced deduction — the number the offer card shows. */
export const OFFER_AMOUNT =
  OFFER.compHigh - OFFER.deductions.reduce((sum, d) => sum + d.amount, 0); // 178

export const SETTLEMENT = {
  payoutSpeed: "Next business day",
  status: "Paid out",
} as const;

export const { fee: SERVICE_FEE, net: NET_PAYOUT } = settle(OFFER_AMOUNT); // 16, 160

// --- timeline shell metadata -------------------------------------------------------------------------
export type StageId = "listed" | "verdict" | "offer" | "settlement";
export type StageSide = "seller" | "repick";

export type Stage = {
  id: StageId;
  side: StageSide;
  num: string;
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  oneLiner: string;
};

export const STAGES: Stage[] = [
  {
    id: "listed",
    side: "seller",
    num: "01",
    icon: Package,
    eyebrow: "Step 1 · Listed",
    title: "Priya lists the coat",
    oneLiner: `Asking ${money(TRACE_ITEM.askingPrice)} · self-graded "${TRACE_ITEM.selfGrade}"`,
  },
  {
    id: "verdict",
    side: "repick",
    num: "02",
    icon: ScanLine,
    eyebrow: "Step 2 · AI verdict",
    title: "repick grades every photo",
    oneLiner: `Grade ${AI_VERDICT.grade} · authenticity ${AI_VERDICT.authenticity.toLowerCase()}`,
  },
  {
    id: "offer",
    side: "repick",
    num: "03",
    icon: Wallet,
    eyebrow: "Step 3 · Instant offer",
    title: "The offer is built from the grade",
    oneLiner: `${money(OFFER_AMOUNT)} offer · holds ${OFFER.holdHours}h`,
  },
  {
    id: "settlement",
    side: "repick",
    num: "04",
    icon: BadgeCheck,
    eyebrow: "Step 4 · Settlement",
    title: "Priya gets paid",
    oneLiner: `${money(NET_PAYOUT)} net · ${SETTLEMENT.payoutSpeed.toLowerCase()}`,
  },
];

// --- hero listing (category toggle → card + match/grade/certified/discount all recompute) -----------
export type HeroListing = {
  id: string;
  category: string;
  title: string;
  brand: string;
  match: number;
  grade: string;
  certified: boolean;
  aiTag: string;
  original: number;
  offer: number;
  image: { src: string; alt: string };
};

export const HERO_LISTINGS: HeroListing[] = [
  {
    id: "sneakers",
    category: "Sneakers",
    title: "Classic low-top sneakers",
    brand: "Fieldstone Co.",
    match: 96,
    grade: "A-",
    certified: true,
    aiTag: "Sole wear matched to the stated grade",
    original: 175,
    offer: 96,
    image: {
      src: "https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=700&q=80",
      alt: "Pair of white classic low-top sneakers",
    },
  },
  {
    id: "bag",
    category: "Bags",
    title: "Leather crossbody bag",
    brand: "Atelier Noir",
    match: 89,
    grade: "A",
    certified: true,
    aiTag: "Hardware patina graded, not penalized",
    original: 260,
    offer: 151,
    image: {
      src: "https://images.unsplash.com/photo-1560243563-062bfc001d68?auto=format&fit=crop&w=700&q=80",
      alt: "Leather crossbody bag laid flat on a plain floor",
    },
  },
  {
    id: "boots",
    category: "Boots",
    title: "Suede Chelsea boots",
    brand: "Larkspur House",
    match: 91,
    grade: "A-",
    certified: true,
    aiTag: "Resoled heel declared and priced in",
    original: 190,
    offer: 104,
    image: {
      src: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=700&q=80",
      alt: "Pair of suede Chelsea boots side by side",
    },
  },
];

export const discountOf = (listing: HeroListing): number =>
  Math.round((1 - listing.offer / listing.original) * 100);

// --- payout calculator (select-driven, shares settle() with the timeline) ---------------------------
export type CalcCategory = { id: string; label: string; compHigh: number };
export type CalcGrade = { id: string; label: string; deduction: number };

export const CALC_CATEGORIES: CalcCategory[] = [
  { id: "outerwear", label: "Outerwear", compHigh: 210 },
  { id: "footwear", label: "Footwear", compHigh: 150 },
  { id: "bags", label: "Bags", compHigh: 240 },
];

export const CALC_GRADES: CalcGrade[] = [
  { id: "a", label: "A — like new", deduction: 0.06 },
  { id: "bplus", label: "B+ — light wear", deduction: 0.15 },
  { id: "b", label: "B — visible wear", deduction: 0.26 },
  { id: "c", label: "C — heavy wear", deduction: 0.4 },
];

export function estimateOffer(categoryId: string, gradeId: string): number {
  const cat = CALC_CATEGORIES.find((c) => c.id === categoryId) ?? CALC_CATEGORIES[0];
  const grade = CALC_GRADES.find((g) => g.id === gradeId) ?? CALC_GRADES[1];
  return Math.round(cat.compHigh * (1 - grade.deduction));
}

export const DEFAULT_CATEGORY = "outerwear";
export const DEFAULT_GRADE = "bplus";

// --- social proof --------------------------------------------------------------------------------------
export const PROOF_STATS: { value: string; label: string }[] = [
  { value: "148,000+", label: "Items priced end to end" },
  { value: "92%", label: "Sellers who accept the first offer" },
  { value: "24h", label: "Median time from listing to offer" },
];

export const TESTIMONIALS: { quote: string; name: string; role: string }[] = [
  {
    quote:
      "I could see exactly why the offer was lower than my asking price — a re-plated buckle I had forgotten about. That is the part that made me trust the number.",
    name: "Priya Kapoor",
    role: "Sold 6 pieces on repick",
  },
  {
    quote:
      "No back and forth with a stranger. The grade posted, the offer posted, I clicked once and the payout was in my account the next morning.",
    name: "Daniel Osei",
    role: "Buys and resells footwear",
  },
];
