"use client";

import { useCallback, useMemo, useRef, useState, type ReactNode, type RefObject } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Gauge,
  Percent,
  Quote,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Star,
  Tag,
  Truck,
  type LucideIcon,
} from "lucide-react";

/* ------------------------------------------------------------------------ */
/* Design tokens. Theme: dark (#0B0B0F / #FFFFFF). Accent hue: lime.        */
/* Contrast values below are GIVEN by the brief, not recomputed:            */
/*   accent  #A3E635 text on bg #0B0B0F        -> 13.03:1 (safe, any size)  */
/*   ink     #0B0B0F text on accent #A3E635    -> 13.03:1 (fills: dark ink, */
/*            never white — white-on-lime measures only 1.51:1 and fails)  */
/* MUTED is a reused catalog-standard secondary-text grey on this same bg.  */
/* ------------------------------------------------------------------------ */
const ACCENT = "#A3E635";
const ACCENT_TINT = "#D4F77A";
const INK = "#0B0B0F";
const MUTED = "#A6A6B0";

/* Body column width, per the brief's exact method (not `ch`, not estimated):
   chars/line = containerPx / (0.44 * fontSizePx). At a 16px body size,
   70 * 0.44 * 16 = 492.8px would sit right at the 70-char target; 480px
   (≈68 chars) is used instead to keep clear margin under the 75-char
   ceiling rather than "just barely" fitting it. See candidates/a.md. */
const BODY_MAX = "480px";

/* ------------------------------------------------------------------------ */
/* Criteria — the four fixed priorities a buyer can duel between.           */
/* Index order is load-bearing: it is how winCounts / weights are keyed.    */
/* ------------------------------------------------------------------------ */
type CriterionId = "price" | "condition" | "rating" | "shipping";

interface Criterion {
  id: CriterionId;
  label: string;
  shortLabel: string;
  Icon: LucideIcon;
}

const CRITERIA: Criterion[] = [
  { id: "price", label: "Price", shortLabel: "Price", Icon: Tag },
  { id: "condition", label: "Condition grade", shortLabel: "Condition", Icon: Gauge },
  { id: "rating", label: "Seller rating", shortLabel: "Rating", Icon: Star },
  { id: "shipping", label: "Fastest shipping", shortLabel: "Shipping", Icon: Truck },
];

/* Fixed, hardcoded duel order — a round-robin over all 4-choose-2 = 6 pairs.
   Never randomized: the same six duels in the same order, every visit. */
const DUEL_SEQUENCE: readonly [number, number][] = [
  [0, 1], // Price vs Condition grade
  [2, 3], // Seller rating vs Fastest shipping
  [3, 0], // Fastest shipping vs Price
  [1, 2], // Condition grade vs Seller rating
  [0, 2], // Price vs Seller rating
  [1, 3], // Condition grade vs Fastest shipping
];
const DUEL_TOTAL = DUEL_SEQUENCE.length;

/* ------------------------------------------------------------------------ */
/* Fixed dummy listings. Per-criterion sub-scores are derived once, at      */
/* module scope, from this raw data's own min/max — never hand-tuned.      */
/* ------------------------------------------------------------------------ */
interface RawListing {
  id: string;
  title: string;
  photoId: string;
  alt: string;
  price: number;
  originalPrice: number;
  grade: string;
  /** A+=5, A=4.5, A-=4, B+=3.5, B=3 — a fixed half-point letter scale. */
  gradePoints: number;
  rating: number;
  shippingDays: number;
  verified: boolean;
  verificationTier: string;
}

const RAW_LISTINGS: RawListing[] = [
  {
    id: "leica-m6",
    title: "Leica M6 35mm camera",
    photoId: "photo-1516035069371-29a1b244cc32",
    alt: "Film rangefinder camera listed on repick",
    price: 1450,
    originalPrice: 1790,
    grade: "A",
    gradePoints: 4.5,
    rating: 4.8,
    shippingDays: 2,
    verified: true,
    verificationTier: "Verified Pro",
  },
  {
    id: "dunk-low",
    title: "Nike Dunk Low Retro, size 10",
    photoId: "photo-1549298916-b41d501d3772",
    alt: "Pair of low-top sneakers listed on repick",
    price: 145,
    originalPrice: 190,
    grade: "B+",
    gradePoints: 3.5,
    rating: 4.3,
    shippingDays: 1,
    verified: true,
    verificationTier: "Verified",
  },
  {
    id: "rolex-oyster",
    title: "Rolex Oyster, vintage 1968",
    photoId: "photo-1524592094714-0f0654e20314",
    alt: "Vintage wristwatch listed on repick",
    price: 4200,
    originalPrice: 5200,
    grade: "A+",
    gradePoints: 5,
    rating: 4.9,
    shippingDays: 5,
    verified: true,
    verificationTier: "Verified Pro",
  },
  {
    id: "ceramic-vase-set",
    title: "Hand-thrown ceramic vase set",
    photoId: "photo-1555041469-a586c61ea9bc",
    alt: "Set of ceramic vases listed on repick",
    price: 58,
    originalPrice: 96,
    grade: "B",
    gradePoints: 3,
    rating: 4.1,
    shippingDays: 3,
    verified: false,
    verificationTier: "Unverified",
  },
  {
    id: "selvedge-jacket",
    title: "Raw selvedge denim jacket",
    photoId: "photo-1551028719-00167b16eac5",
    alt: "Denim jacket listed on repick",
    price: 108,
    originalPrice: 180,
    grade: "A-",
    gradePoints: 4,
    rating: 4.6,
    shippingDays: 4,
    verified: true,
    verificationTier: "Verified",
  },
  {
    id: "wh1000xm5",
    title: "Sony WH-1000XM5 headphones",
    photoId: "photo-1572635196237-14b3f281503f",
    alt: "Over-ear wireless headphones listed on repick",
    price: 162,
    originalPrice: 280,
    grade: "B+",
    gradePoints: 3.5,
    rating: 3.9,
    shippingDays: 1,
    verified: true,
    verificationTier: "Verified",
  },
];

interface Listing extends RawListing {
  index: number;
  discountPct: number;
  /** One sub-score per CRITERIA index, each 0–1, higher is always better. */
  subscores: number[];
}

function minOf(values: number[]): number {
  return values.reduce((m, v) => (v < m ? v : m), values[0]);
}
function maxOf(values: number[]): number {
  return values.reduce((m, v) => (v > m ? v : m), values[0]);
}

const PRICE_MIN = minOf(RAW_LISTINGS.map((l) => l.price));
const PRICE_MAX = maxOf(RAW_LISTINGS.map((l) => l.price));
const GRADE_MIN = minOf(RAW_LISTINGS.map((l) => l.gradePoints));
const GRADE_MAX = maxOf(RAW_LISTINGS.map((l) => l.gradePoints));
const RATING_MIN = minOf(RAW_LISTINGS.map((l) => l.rating));
const RATING_MAX = maxOf(RAW_LISTINGS.map((l) => l.rating));
const SHIP_MIN = minOf(RAW_LISTINGS.map((l) => l.shippingDays));
const SHIP_MAX = maxOf(RAW_LISTINGS.map((l) => l.shippingDays));

const LISTINGS: Listing[] = RAW_LISTINGS.map((l, index) => ({
  ...l,
  index,
  discountPct: Math.round((1 - l.price / l.originalPrice) * 100),
  subscores: [
    (PRICE_MAX - l.price) / (PRICE_MAX - PRICE_MIN), // cheaper = higher score
    (l.gradePoints - GRADE_MIN) / (GRADE_MAX - GRADE_MIN),
    (l.rating - RATING_MIN) / (RATING_MAX - RATING_MIN),
    (SHIP_MAX - l.shippingDays) / (SHIP_MAX - SHIP_MIN), // fewer days = higher score
  ],
}));

/* ------------------------------------------------------------------------ */
/* Pure, deterministic derivation. Every live number on this page — the    */
/* bars, the hero's recommended match, the closing CTA — reads from these  */
/* same functions and nothing else. Same winCounts in -> same output out.  */
/* ------------------------------------------------------------------------ */
function deriveWeights(winCounts: readonly number[]): number[] {
  const total = winCounts.reduce((sum, w) => sum + w, 0);
  if (total === 0) return winCounts.map(() => 1 / winCounts.length);
  return winCounts.map((w) => w / total);
}

/** Criterion indexes ordered by weight, descending; ties broken by index. */
function rankedCriteriaIndexes(weights: readonly number[]): number[] {
  return weights
    .map((w, i) => ({ w, i }))
    .sort((a, b) => (b.w !== a.w ? b.w - a.w : a.i - b.i))
    .map((e) => e.i);
}

function scoreListing(listing: Listing, weights: readonly number[]): number {
  let total = 0;
  for (let i = 0; i < weights.length; i += 1) total += weights[i] * listing.subscores[i];
  return total * 100;
}

interface RankedEntry {
  listing: Listing;
  score: number;
}

/** The single ranking function the hero card AND the closing CTA both call. */
function rankListings(weights: readonly number[]): RankedEntry[] {
  return LISTINGS.map((listing) => ({ listing, score: scoreListing(listing, weights) })).sort((a, b) =>
    b.score !== a.score ? b.score - a.score : a.listing.index - b.listing.index,
  );
}

function formatCurrency(value: number): string {
  return `$${Math.round(value).toLocaleString("en-US")}`;
}

/* ------------------------------------------------------------------------ */
/* Motion helper for scroll reveals below the hero.                        */
/* ------------------------------------------------------------------------ */
function useScrollReveal() {
  const reduce = useReducedMotion();
  return {
    initial: reduce ? false : ({ opacity: 0, y: 20 } as const),
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.25 },
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  };
}

/* ------------------------------------------------------------------------ */
/* Shared small pieces                                                      */
/* ------------------------------------------------------------------------ */
function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="font-semibold uppercase" style={{ color: ACCENT_TINT, letterSpacing: "0.28em", fontSize: "11px" }}>
      {children}
    </p>
  );
}

function FigureCaption({ children }: { children: ReactNode }) {
  return (
    <p className="font-semibold uppercase" style={{ color: MUTED, letterSpacing: "0.16em", fontSize: "10px" }}>
      {children}
    </p>
  );
}

/* ------------------------------------------------------------------------ */
/* Duel arena — the sequential forced-choice interaction.                  */
/* ------------------------------------------------------------------------ */
function DuelArena({
  duelStep,
  onPick,
  onRestart,
}: {
  duelStep: number;
  onPick: (criterionIndex: number) => void;
  onRestart: () => void;
}) {
  const reduce = useReducedMotion();
  const isActive = duelStep < DUEL_TOTAL;
  const pair = isActive ? DUEL_SEQUENCE[duelStep] : null;

  return (
    <div className="min-w-0 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
      <div className="flex min-w-0 items-baseline justify-between gap-2">
        <FigureCaption>Priority duel</FigureCaption>
        <p className="shrink-0 text-[11px] font-semibold" style={{ color: MUTED }} aria-hidden={!isActive}>
          {isActive ? `Pick ${duelStep + 1} of ${DUEL_TOTAL}` : `All ${DUEL_TOTAL} picks locked in`}
        </p>
      </div>

      <div className="mt-2 flex min-w-0 gap-1" role="presentation" aria-hidden="true">
        {DUEL_SEQUENCE.map((_, i) => (
          <span
            key={i}
            className="h-1 flex-1 rounded-full"
            style={{ backgroundColor: i < duelStep ? ACCENT : "rgba(255,255,255,0.14)" }}
          />
        ))}
      </div>

      {isActive && pair ? (
        <div className="mt-4" role="group" aria-label={`Which matters more: ${CRITERIA[pair[0]].label} or ${CRITERIA[pair[1]].label}?`}>
          <p className="font-normal leading-[1.6]" style={{ fontSize: "14px", color: "rgba(255,255,255,0.8)" }}>
            Which matters more to you?
          </p>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {pair.map((criterionIndex) => {
              const criterion = CRITERIA[criterionIndex];
              return (
                <motion.button
                  key={criterion.id}
                  type="button"
                  onClick={() => onPick(criterionIndex)}
                  whileHover={reduce ? undefined : { scale: 1.02 }}
                  whileTap={reduce ? undefined : { scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="flex min-w-0 flex-col items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-5 text-center transition-colors hover:border-white/25 focus-visible:outline-2 focus-visible:outline-offset-2"
                  style={{ outlineColor: ACCENT }}
                >
                  <criterion.Icon className="h-5 w-5" style={{ color: ACCENT_TINT }} aria-hidden="true" />
                  <span className="text-sm font-extrabold leading-tight">{criterion.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="mt-4 flex min-w-0 items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-4">
          <p className="flex min-w-0 items-center gap-2 text-sm font-semibold">
            <Check className="h-4 w-4 shrink-0" style={{ color: ACCENT_TINT }} aria-hidden="true" />
            Your weights are set from all {DUEL_TOTAL} picks.
          </p>
          <button
            type="button"
            onClick={onRestart}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-xs font-semibold transition-colors hover:border-white/30 focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ outlineColor: ACCENT }}
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            Redo
          </button>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Live weight bars — re-derives and re-sorts after every duel.            */
/* ------------------------------------------------------------------------ */
function PriorityBars({ weights }: { weights: readonly number[] }) {
  const reduce = useReducedMotion();
  const order = rankedCriteriaIndexes(weights);

  return (
    <div className="min-w-0 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
      <FigureCaption>Your live priority weights</FigureCaption>
      <div className="mt-4 flex flex-col gap-3">
        {order.map((criterionIndex) => {
          const criterion = CRITERIA[criterionIndex];
          const weight = weights[criterionIndex];
          const percent = Math.round(weight * 100);
          return (
            <motion.div key={criterion.id} layout={!reduce} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} className="min-w-0">
              <div className="mb-1 flex min-w-0 items-center justify-between gap-2 text-[12px]">
                <span className="flex min-w-0 items-center gap-1.5 font-semibold">
                  <criterion.Icon className="h-3.5 w-3.5 shrink-0" style={{ color: ACCENT_TINT }} aria-hidden="true" />
                  <span className="truncate">{criterion.label}</span>
                </span>
                <span className="shrink-0 font-extrabold">{percent}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: ACCENT, transformOrigin: "left" }}
                  animate={{ scaleX: weight }}
                  initial={false}
                  transition={{ duration: reduce ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Match badges — never absolutely positioned over the photo.              */
/* ------------------------------------------------------------------------ */
function MatchBadges({
  score,
  grade,
  verified,
  verificationTier,
  discountPct,
}: {
  score: number;
  grade: string;
  verified: boolean;
  verificationTier: string;
  discountPct: number;
}) {
  return (
    <div className="flex min-w-0 flex-wrap items-center gap-1.5">
      <span
        className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-extrabold"
        style={{ backgroundColor: ACCENT, color: INK }}
      >
        <Sparkles className="h-3 w-3" aria-hidden="true" />
        {score.toFixed(1)} pts
      </span>
      <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ color: "#FFFFFF", backgroundColor: "rgba(255,255,255,0.1)" }}>
        Grade {grade}
      </span>
      <span
        className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold"
        style={{ color: verified ? "#FFFFFF" : MUTED, backgroundColor: "rgba(255,255,255,0.1)" }}
      >
        {verified ? <ShieldCheck className="h-3 w-3" style={{ color: ACCENT_TINT }} aria-hidden="true" /> : null}
        {verificationTier}
      </span>
      <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ color: "#FFFFFF", backgroundColor: "rgba(255,255,255,0.1)" }}>
        <Percent className="h-3 w-3" aria-hidden="true" />
        {discountPct}% off
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* The recommended-match card — derived purely from weights × listing data.*/
/* ------------------------------------------------------------------------ */
function RecommendationCard({
  ranked,
  weights,
}: {
  ranked: RankedEntry[];
  weights: readonly number[];
}) {
  const reduce = useReducedMotion();
  const top = ranked[0];
  const runnerUp = ranked[1];
  const topTwoCriteria = rankedCriteriaIndexes(weights).slice(0, 2);
  const reasoningTags = topTwoCriteria.map(
    (ci) => `${CRITERIA[ci].shortLabel} ${Math.round(top.listing.subscores[ci] * 100)}%`,
  );

  return (
    <div className="min-w-0 overflow-hidden rounded-2xl border" style={{ borderColor: ACCENT }}>
      <div
        className="flex items-center gap-1.5 px-4 py-2 text-[10px] font-extrabold"
        style={{ backgroundColor: ACCENT, color: INK }}
      >
        <Sparkles className="h-3 w-3" aria-hidden="true" />
        Your top match right now
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={top.listing.id}
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: reduce ? 1 : 0 }}
          transition={{ duration: reduce ? 0 : 0.18 }}
          className="min-w-0 bg-white/[0.03]"
        >
          <div className="relative aspect-[4/3] w-full bg-white/5">
            <Image
              src={`https://images.unsplash.com/${top.listing.photoId}?auto=format&fit=crop&w=720&q=80`}
              alt={top.listing.alt}
              fill
              loading="eager"
              sizes="(max-width: 768px) 90vw, (max-width: 1200px) 45vw, 400px"
              className="object-cover"
            />
          </div>
          <div className="min-w-0 space-y-3 p-4 sm:p-5" aria-live="polite">
            <MatchBadges
              score={top.score}
              grade={top.listing.grade}
              verified={top.listing.verified}
              verificationTier={top.listing.verificationTier}
              discountPct={top.listing.discountPct}
            />
            <p className="truncate font-extrabold" style={{ fontFamily: "var(--font-display-grotesk)", fontSize: "19px" }}>
              {top.listing.title}
            </p>
            <p className="text-base">
              <span className="font-extrabold">{formatCurrency(top.listing.price)}</span>{" "}
              <span className="font-normal line-through" style={{ color: MUTED }}>
                {formatCurrency(top.listing.originalPrice)}
              </span>
            </p>
            <ul className="flex min-w-0 flex-wrap gap-1.5">
              {reasoningTags.map((tag) => (
                <li
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-normal"
                  style={{ borderColor: "rgba(255,255,255,0.14)", color: "rgba(255,255,255,0.75)" }}
                >
                  <Check className="h-2.5 w-2.5" style={{ color: ACCENT_TINT }} aria-hidden="true" />
                  Leads on {tag}
                </li>
              ))}
            </ul>
            {runnerUp ? (
              <p className="pt-1 text-[12px] font-normal" style={{ color: MUTED }}>
                Runner-up: {runnerUp.listing.title} at {runnerUp.score.toFixed(1)} pts.
              </p>
            ) : null}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Methodology disclosure — the 4th distinct interaction.                  */
/* ------------------------------------------------------------------------ */
function MethodologyDisclosure({
  open,
  onToggle,
  topCriterionLabel,
  topWeightPct,
}: {
  open: boolean;
  onToggle: () => void;
  topCriterionLabel: string;
  topWeightPct: number;
}) {
  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls="duel-methodology-panel"
        className="flex w-full min-w-0 items-center justify-between gap-2 rounded-xl border border-white/10 px-4 py-3 text-left text-sm font-semibold transition-colors hover:border-white/25 focus-visible:outline-2 focus-visible:outline-offset-2"
        style={{ outlineColor: ACCENT }}
      >
        <span className="truncate">How we score this match</span>
        <ChevronDown
          className="h-4 w-4 shrink-0 transition-transform motion-reduce:transition-none"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
          aria-hidden="true"
        />
      </button>
      <div
        id="duel-methodology-panel"
        hidden={!open}
        className="mt-2 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm font-normal leading-[1.6] text-white/75"
        aria-live="polite"
      >
        Match points = the weighted sum of each listing&apos;s price, condition, seller-rating, and
        shipping-speed sub-scores, scaled to 100. Right now{" "}
        <span style={{ color: ACCENT_TINT, fontWeight: 800 }}>{topCriterionLabel}</span> carries the
        most weight at {topWeightPct}% of the decision — that&apos;s why it drives the card above.
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Section: Hero — duel + live bars + recommended-match card ALL live here,*/
/* in the hero's own JSX tree, not in a section rendered after it.         */
/* ------------------------------------------------------------------------ */
function HeroSection({
  duelStep,
  weights,
  ranked,
  methodologyOpen,
  onPick,
  onRestart,
  onToggleMethodology,
  onCtaClick,
  heroRef,
}: {
  duelStep: number;
  weights: readonly number[];
  ranked: RankedEntry[];
  methodologyOpen: boolean;
  onPick: (criterionIndex: number) => void;
  onRestart: () => void;
  onToggleMethodology: () => void;
  onCtaClick: () => void;
  heroRef: RefObject<HTMLDivElement | null>;
}) {
  const topCriterionIndex = rankedCriteriaIndexes(weights)[0];
  const topCriterion = CRITERIA[topCriterionIndex];
  const topWeightPct = Math.round(weights[topCriterionIndex] * 100);

  return (
    <section className="relative px-4 pt-8 pb-14 sm:px-6 sm:pt-12 lg:px-8 lg:pb-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-0 h-[260px] w-[260px] rounded-full opacity-[0.10] blur-3xl sm:h-[420px] sm:w-[420px]"
        style={{ background: ACCENT }}
      />
      <div ref={heroRef} className="relative mx-auto grid max-w-6xl grid-cols-1 gap-10 md:grid-cols-12 md:gap-8">
        <div className="min-w-0 md:col-span-6">
          <Eyebrow>AI-matched resale, tuned by you</Eyebrow>
          <h1
            className="mt-3 text-[clamp(2rem,8vw,2.6rem)] font-extrabold leading-[1.04] text-white lg:text-[clamp(3rem,4.2vw,4.25rem)]"
            style={{ fontFamily: "var(--font-display-grotesk)", letterSpacing: "-0.02em" }}
          >
            Two priorities walk in.
            <br />
            One wins every time.
          </h1>
          <p className="mt-4 font-normal leading-[1.6] text-white/80" style={{ maxWidth: BODY_MAX, fontSize: "16px" }}>
            Six quick either/or calls train repick&apos;s match score to what actually matters to
            you — then every recommendation re-ranks, live.
          </p>
          <button
            type="button"
            onClick={onCtaClick}
            className="mt-6 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-extrabold transition-transform focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-[0.98]"
            style={{ backgroundColor: ACCENT, color: INK, outlineColor: ACCENT }}
          >
            See how matching works
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>

          <div className="mt-8 space-y-4">
            <DuelArena duelStep={duelStep} onPick={onPick} onRestart={onRestart} />
            <PriorityBars weights={weights} />
            <MethodologyDisclosure
              open={methodologyOpen}
              onToggle={onToggleMethodology}
              topCriterionLabel={topCriterion.label}
              topWeightPct={topWeightPct}
            />
          </div>
        </div>

        <div className="min-w-0 md:col-span-6">
          <RecommendationCard ranked={ranked} weights={weights} />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------------ */
/* Section: Value 3-split — plain explainer, no interaction required.      */
/* ------------------------------------------------------------------------ */
interface ValueColumn {
  Icon: LucideIcon;
  title: string;
  body: string;
}

const VALUE_COLUMNS: ValueColumn[] = [
  {
    Icon: Sparkles,
    title: "Duel, don't drag",
    body: "Two quick taps surface a real priority faster than a slider you have to second-guess.",
  },
  {
    Icon: ShieldCheck,
    title: "Every listing pre-scored",
    body: "Condition grade, seller verification, and a match score — attached before a buyer ever asks.",
  },
  {
    Icon: Percent,
    title: "Weights you can see",
    body: "The same formula that ranks your match above powers every recommendation on repick. No black box.",
  },
];

function ValueSplitSection() {
  const reveal = useScrollReveal();
  return (
    <section id="value-section" className="relative px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <motion.div {...reveal}>
          <Eyebrow>How it works</Eyebrow>
          <h2
            className="mt-2 font-extrabold"
            style={{ fontFamily: "var(--font-display-grotesk)", letterSpacing: "-0.02em", fontSize: "clamp(1.75rem, 3.6vw, 2.75rem)" }}
          >
            One duel. A score for everything.
          </h2>
        </motion.div>
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {VALUE_COLUMNS.map((col, i) => (
            <motion.div
              key={col.title}
              {...reveal}
              transition={{ ...reveal.transition, delay: i * 0.08 }}
              className="min-w-0 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6"
            >
              <col.Icon className="h-5 w-5" style={{ color: ACCENT_TINT }} aria-hidden="true" />
              <h3 className="mt-3 font-extrabold" style={{ fontSize: "17px" }}>
                {col.title}
              </h3>
              <p className="mt-2 font-normal leading-[1.6] text-white/75" style={{ maxWidth: BODY_MAX, fontSize: "14px" }}>
                {col.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------------ */
/* Section: Social proof                                                    */
/* ------------------------------------------------------------------------ */
interface Testimonial {
  quote: string;
  name: string;
  role: string;
  photoId: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "I answered six quick either/or questions and the top match flipped straight to the camera I actually wanted. Never touched a slider.",
    name: "Jordan P.",
    role: "Verified buyer, 3 purchases",
    photoId: "photo-1507003211169-0a1dd7228f2d",
  },
  {
    quote:
      "The grade on the jacket matched exactly what showed up at my door. First resale app where the description and the item lined up.",
    name: "Mika T.",
    role: "Buyer since 2024",
    photoId: "photo-1500648767791-00dcc994a43e",
  },
  {
    quote: "Seller verification cut my back-and-forth messages in half before I'd even clicked in.",
    name: "Alex R.",
    role: "Frequent buyer",
    photoId: "photo-1544005313-94ddf0286df2",
  },
  {
    quote:
      "Watching the match score re-rank after every pick is the first time a priority quiz actually felt accurate.",
    name: "Priya N.",
    role: "Power seller, 340 items sold",
    photoId: "photo-1494790108377-be9c29b29330",
  },
];

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const reveal = useScrollReveal();
  return (
    <motion.figure {...reveal} className="min-w-0 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
      <Quote className="h-6 w-6" style={{ color: MUTED }} aria-hidden="true" />
      <blockquote className="mt-3 font-normal leading-[1.6]" style={{ fontSize: "15px", maxWidth: BODY_MAX }}>
        {testimonial.quote}
      </blockquote>
      <figcaption className="mt-4 flex min-w-0 items-center gap-3">
        <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-white/10" style={{ aspectRatio: "1 / 1" }}>
          <Image
            src={`https://images.unsplash.com/${testimonial.photoId}?auto=format&fit=crop&w=96&h=96&q=80`}
            alt={`Portrait of ${testimonial.name}`}
            fill
            sizes="36px"
            className="object-cover"
          />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-extrabold">{testimonial.name}</p>
          <p className="truncate text-xs font-normal" style={{ color: MUTED }}>
            {testimonial.role}
          </p>
        </div>
      </figcaption>
    </motion.figure>
  );
}

function SocialProofSection() {
  const reveal = useScrollReveal();
  return (
    <section className="relative px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <motion.div {...reveal}>
          <Eyebrow>Social proof</Eyebrow>
          <h2
            className="mt-2 font-extrabold"
            style={{ fontFamily: "var(--font-display-grotesk)", letterSpacing: "-0.02em", fontSize: "clamp(1.75rem, 3.6vw, 2.75rem)" }}
          >
            Buyers trust the score because they can see it move
          </h2>
        </motion.div>
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TESTIMONIALS.map((t) => (
            <TestimonialCard key={t.name} testimonial={t} />
          ))}
        </div>
        <div className="mt-10 grid grid-cols-2 gap-6 border-t border-white/10 pt-8 sm:grid-cols-4">
          {[
            { stat: "248K", label: "listings pre-scored" },
            { stat: "97%", label: "grade match rate vs buyer report" },
            { stat: "44%", label: "median discount to retail" },
            { stat: "2.9×", label: "faster sell-through when verified" },
          ].map((item) => (
            <div key={item.label} className="min-w-0">
              <p className="font-extrabold" style={{ fontFamily: "var(--font-display-grotesk)", fontSize: "28px" }}>
                {item.stat}
              </p>
              <p className="mt-1 font-normal leading-[1.6]" style={{ fontSize: "13px", color: MUTED }}>
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------------ */
/* Section: Closing CTA — cites the SAME live derivation as the hero.      */
/* ------------------------------------------------------------------------ */
function ClosingCtaSection({
  duelStep,
  weights,
  ranked,
  onRevisit,
}: {
  duelStep: number;
  weights: readonly number[];
  ranked: RankedEntry[];
  onRevisit: () => void;
}) {
  const reveal = useScrollReveal();
  const topCriterionIndex = rankedCriteriaIndexes(weights)[0];
  const topCriterion = CRITERIA[topCriterionIndex];
  const top = ranked[0];

  return (
    <section className="relative px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="relative mx-auto max-w-6xl">
        <motion.div {...reveal} className="relative max-w-2xl" aria-live="polite">
          <Eyebrow>Closing</Eyebrow>
          <h2
            className="mt-2 font-extrabold"
            style={{ fontFamily: "var(--font-display-grotesk)", letterSpacing: "-0.02em", fontSize: "clamp(2rem, 5vw, 3.25rem)", lineHeight: 1.05 }}
          >
            Your top priority: <span style={{ color: ACCENT }}>{topCriterion.label}</span>.
          </h2>
          <p className="mt-4 font-normal leading-[1.6] text-white/80" style={{ maxWidth: BODY_MAX, fontSize: "16px" }}>
            Based on the {duelStep} of {DUEL_TOTAL} calls you&apos;ve made so far, {top.listing.title}{" "}
            leads the board at {top.score.toFixed(1)} match points — recalculated the moment you
            change your mind in the duel above. List on repick and let the same score rank your
            items for the next buyer.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-4">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-extrabold transition-transform focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-[0.98]"
              style={{ backgroundColor: ACCENT, color: INK, outlineColor: ACCENT }}
            >
              Start listing on repick
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={onRevisit}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white/85 transition-colors hover:border-white/30 focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{ outlineColor: ACCENT }}
            >
              Revisit your picks
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------------ */
/* Root                                                                      */
/* ------------------------------------------------------------------------ */
export default function DuelLanding() {
  const [winCounts, setWinCounts] = useState<number[]>(() => CRITERIA.map(() => 0));
  const [duelStep, setDuelStep] = useState<number>(0);
  const [methodologyOpen, setMethodologyOpen] = useState<boolean>(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const valueRef = useRef<HTMLDivElement | null>(null);

  const weights = useMemo(() => deriveWeights(winCounts), [winCounts]);
  const ranked = useMemo(() => rankListings(weights), [weights]);

  const handlePick = useCallback(
    (criterionIndex: number) => {
      setWinCounts((prev) => {
        if (duelStep >= DUEL_TOTAL) return prev;
        const next = prev.slice();
        next[criterionIndex] += 1;
        return next;
      });
      setDuelStep((s) => Math.min(s + 1, DUEL_TOTAL));
    },
    [duelStep],
  );

  const handleRestart = useCallback(() => {
    setWinCounts(CRITERIA.map(() => 0));
    setDuelStep(0);
  }, []);

  const scrollToValue = useCallback(() => {
    document.getElementById("value-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const scrollToHero = useCallback(() => {
    heroRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#0B0B0F] text-white">
      <HeroSection
        duelStep={duelStep}
        weights={weights}
        ranked={ranked}
        methodologyOpen={methodologyOpen}
        onPick={handlePick}
        onRestart={handleRestart}
        onToggleMethodology={() => setMethodologyOpen((v) => !v)}
        onCtaClick={scrollToValue}
        heroRef={heroRef}
      />
      <div ref={valueRef}>
        <ValueSplitSection />
      </div>
      <SocialProofSection />
      <ClosingCtaSection duelStep={duelStep} weights={weights} ranked={ranked} onRevisit={scrollToHero} />
    </main>
  );
}
