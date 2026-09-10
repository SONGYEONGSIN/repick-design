// Fixed, deterministic data for the provenance scrubber. No Math.random / Date.now / new Date
// anywhere in this route — every date/time string below is a plain literal, and every derived value
// (discount %, badge visibility) is a pure function of `activeIndex` plus this array, so re-scrubbing
// is an exact recompute, never a guess, and server/client renders always agree.

import type { LucideIcon } from "lucide-react";
import { BadgeCheck, ClipboardCheck, PackageOpen, Scale, Tag } from "lucide-react";

export type StageId = "listed" | "inspected" | "graded" | "authenticated" | "priced";

export interface Stage {
  id: StageId;
  index: number;
  /** Full name — used in headings, aria-labels, the closing CTA. */
  label: string;
  /** Compact caps label for the scrubber's own button — kept short and near-equal in length so the
   * five track columns stay visually even without needing to measure rendered text. */
  shortLabel: string;
  date: string;
  time: string;
  title: string;
  body: string;
  stat: string;
  icon: LucideIcon;
}

export const STAGES: Stage[] = [
  {
    id: "listed",
    index: 0,
    label: "Listed",
    shortLabel: "Listed",
    date: "Aug 14, 2026",
    time: "8:02 AM KST",
    title: "Seller submission received",
    body: "The seller uploaded six photos and self-reported the condition as “Good.” Asking price set at $340. The coat entered repick’s queue for physical inspection — nothing below this line is confirmed yet.",
    stat: "6 photos submitted",
    icon: PackageOpen,
  },
  {
    id: "inspected",
    index: 1,
    label: "Inspected",
    shortLabel: "Inspected",
    date: "Aug 16, 2026",
    time: "11:47 AM KST",
    title: "Physical inspection completed",
    body: "Nova check lining intact, no fading. All horn-effect buttons present; one hairline crack noted on the left cuff button. A faint 2cm watermark sits near the hem, not visible when worn.",
    stat: "4 condition notes logged",
    icon: ClipboardCheck,
  },
  {
    id: "graded",
    index: 2,
    label: "Graded",
    shortLabel: "Graded",
    date: "Aug 16, 2026",
    time: "2:15 PM KST",
    title: "Condition grade assigned",
    body: "The inspection notes above were scored against repick’s outerwear rubric. The cuff-button crack and hem watermark placed this coat just below top condition.",
    stat: "Grade B+ · 8.4 / 10",
    icon: Scale,
  },
  {
    id: "authenticated",
    index: 3,
    label: "Authenticated",
    shortLabel: "Auth’d",
    date: "Aug 18, 2026",
    time: "9:30 AM KST",
    title: "Authentication verified",
    body: "Hardware stamp matches Burberry’s 2009–2015 production run. Stitch density measured 9 per inch against the archive reference, and the woven label typeface passed AI plus specialist cross-check.",
    stat: "98% archive match",
    icon: BadgeCheck,
  },
  {
    id: "priced",
    index: 4,
    label: "Priced",
    shortLabel: "Priced",
    date: "Aug 18, 2026",
    time: "9:41 AM KST",
    title: "Final price set",
    body: "repick’s pricing engine weighted the B+ grade, the authentication confidence above, and 14 comparable sales closed in the last 30 days to land on a final price.",
    stat: "$215 · 67% below retail",
    icon: Tag,
  },
];

export const LAST_STAGE = STAGES.length - 1;

// ---------------------------------------------------------------------------
// The one real item the whole hero is built from.
// ---------------------------------------------------------------------------

export const ITEM = {
  refId: "RP-88213",
  title: "Burberry Wool Trench Coat",
  spec: "UK 10 · Honey camel · c. 2011",
  image:
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=640&auto=format&fit=crop",
  imageAlt:
    "A camel wool coat laid out against a plain neutral background, photographed for its repick listing",
  sellerAsk: 340,
  conditionSelfReport: "Good",
  grade: "B+",
  gradeScore: 8.4,
  matchPct: 98,
  originalPrice: 650,
  finalPrice: 215,
};

export function discountPct(original: number, price: number): number {
  return Math.round(((original - price) / original) * 100);
}

/**
 * Which real facts exist about this coat at a given scrub position — a pure function of
 * `activeIndex`, so the closing section can quote the exact same list the product card's badges are
 * built from, never a second hand-written copy that can drift out of sync with it.
 */
export function factsAtStage(activeIndex: number): string[] {
  const facts: string[] = [`self-reported condition "${ITEM.conditionSelfReport}"`];
  if (activeIndex >= 1) facts.push("a completed physical inspection");
  if (activeIndex >= 2) facts.push(`a Grade ${ITEM.grade} (${ITEM.gradeScore.toFixed(1)}/10)`);
  if (activeIndex >= 3) facts.push(`authentication at ${ITEM.matchPct}% archive match`);
  if (activeIndex >= 4) facts.push(`a final price of $${ITEM.finalPrice} (${discountPct(ITEM.originalPrice, ITEM.finalPrice)}% below retail)`);
  return facts;
}

// ---------------------------------------------------------------------------
// Value section
// ---------------------------------------------------------------------------

export const VALUE_COLUMNS = [
  {
    title: "Nothing is retroactive",
    body: "A fact logged at 11:47 AM on Aug 16 stays exactly as recorded. Scrubbing back never edits it — you’re moving your view along a fixed timeline, not asking a model to guess a past state.",
  },
  {
    title: "Order means something",
    body: "There is no grade before there was an inspection, and no verified badge before there was a grade. The scrubber can’t be dragged out of sequence, because the coat wasn’t processed out of sequence.",
  },
  {
    title: "You scrub the record we used",
    body: "Every stage a buyer can drag through here is the same one repick’s own specialists worked from — same notes, same timestamps, nothing held back for the listing page alone.",
  },
];

// ---------------------------------------------------------------------------
// Social proof
// ---------------------------------------------------------------------------

export const SOCIAL_STATS = [
  { value: "312,480", label: "items with a full five-stage record" },
  { value: "97.1%", label: "specialist agreement with AI grading" },
  { value: "41h", label: "median time from listed to priced" },
  { value: "4.8/5", label: "average buyer rating" },
];

export const TESTIMONIALS = [
  {
    quote:
      "I dragged back to the seller’s own photos before I looked at the price. Watching the badges disappear one by one, back to nothing but an asking price, is what actually sold me.",
    name: "Priya S.",
    role: "Buyer, 11 purchases",
  },
  {
    quote:
      "Buyers used to message asking how we graded a piece. Now they scrub the same five stages we did themselves — nobody’s asked us to re-explain a grade since.",
    name: "Theo B.",
    role: "Seller, vintage outerwear",
  },
];
