"use client";

import { useCallback, useId, useMemo, useRef, useState, type ReactNode, type RefObject } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  ChevronDown,
  Cpu,
  Gem,
  Home as HomeIcon,
  Percent,
  Quote,
  ShieldCheck,
  Shirt,
  Sparkles,
  Star,
  Wallet,
  type LucideIcon,
} from "lucide-react";

/* ------------------------------------------------------------------------ */
/* Design tokens — computed, not guessed. See candidates/a.md for the math. */
/* Theme: dark (#0B0B0F / #FFFFFF). Accent hue: lime.                        */
/*   accent  #A3E635 vs white   -> 1.51:1  (never use as text on white)      */
/*   accent  #A3E635 vs bg      -> 13.02:1 (safe for fills/borders/ANY text) */
/*   ink     #0B0B0F on accent  -> 13.02:1 (dark ink, not white, on fills — */
/*            lime is a LIGHT hue, so the brief's generic "white on fill"   */
/*            default inverts here; white-on-lime measures only 1.51:1)     */
/*   muted   #A6A6B0 vs bg      -> 8.14:1  (secondary body text)            */
/*   ghost   #63636F vs bg      -> 3.32:1  (ghost numbers, >=24px only)     */
/* ------------------------------------------------------------------------ */
const ACCENT = "#A3E635";
const ACCENT_TINT = "#D4F77A";
const INK = "#0B0B0F";
const MUTED = "#A6A6B0";
const GHOST = "#63636F";


interface Category {
  id: string;
  label: string;
  shortLabel: string;
  Icon: LucideIcon;
  /** Resale recovery rate: cents returned per dollar of original value. */
  payoutMultiplier: number;
  /** 0–1 index of current buyer demand for this category on repick. */
  demandIndex: number;
}

const CATEGORIES: Category[] = [
  {
    id: "electronics",
    label: "Electronics",
    shortLabel: "Electronics",
    Icon: Cpu,
    payoutMultiplier: 0.62,
    demandIndex: 0.81,
  },
  {
    id: "apparel",
    label: "Apparel",
    shortLabel: "Apparel",
    Icon: Shirt,
    payoutMultiplier: 0.46,
    demandIndex: 0.74,
  },
  {
    id: "collectibles",
    label: "Collectibles",
    shortLabel: "Collectibles",
    Icon: Gem,
    payoutMultiplier: 0.78,
    demandIndex: 0.69,
  },
  {
    id: "home",
    label: "Home & Living",
    shortLabel: "Home",
    Icon: HomeIcon,
    payoutMultiplier: 0.53,
    demandIndex: 0.58,
  },
];

const DEFAULT_SHARES: readonly number[] = [40, 25, 20, 15];

interface InventoryTier {
  id: string;
  label: string;
  estimate: number;
}

const TIERS: InventoryTier[] = [
  { id: "starter", label: "Starter seller", estimate: 1200 },
  { id: "active", label: "Active seller", estimate: 3600 },
  { id: "power", label: "Power seller", estimate: 9400 },
];
const DEFAULT_TIER_INDEX = 1;

/* ------------------------------------------------------------------------ */
/* Pure, deterministic constrained-sum redistribution.                      */
/* Dragging one slider rescales the other three proportionally to their     */
/* own prior relative share, so the four always sum to exactly 100.         */
/* ------------------------------------------------------------------------ */
const MIN_SHARE = 5;

function largestRemainderRound(values: number[], total: number): number[] {
  const floors = values.map((v) => Math.floor(v));
  const used = floors.reduce((sum, v) => sum + v, 0);
  const remainder = total - used;
  const order = values
    .map((v, i) => ({ i, frac: v - Math.floor(v) }))
    .sort((a, b) => b.frac - a.frac);
  const result = floors.slice();
  for (let k = 0; k < remainder && k < order.length; k += 1) {
    result[order[k].i] += 1;
  }
  return result;
}

/** Guarantee every entry is >=1 without changing the total, by borrowing from the largest. */
function clampFloors(values: number[]): number[] {
  const result = values.slice();
  for (let i = 0; i < result.length; i += 1) {
    if (result[i] < 1) {
      const deficit = 1 - result[i];
      result[i] = 1;
      let maxIndex = -1;
      for (let j = 0; j < result.length; j += 1) {
        if (j !== i && (maxIndex === -1 || result[j] > result[maxIndex])) {
          maxIndex = j;
        }
      }
      if (maxIndex !== -1) {
        result[maxIndex] -= deficit;
      }
    }
  }
  return result;
}

function redistribute(shares: readonly number[], index: number, rawValue: number): number[] {
  const n = shares.length;
  const maxAllowed = 100 - MIN_SHARE * (n - 1);
  const newValue = Math.min(maxAllowed, Math.max(MIN_SHARE, Math.round(rawValue)));
  const remaining = 100 - newValue;
  const otherIndexes = shares.map((_, i) => i).filter((i) => i !== index);
  const otherSum = otherIndexes.reduce((sum, i) => sum + shares[i], 0);

  const proportional = otherIndexes.map((i) =>
    otherSum > 0 ? (shares[i] / otherSum) * remaining : remaining / otherIndexes.length,
  );
  const roundedOthers = largestRemainderRound(proportional, remaining);

  const result = new Array<number>(n).fill(0);
  result[index] = newValue;
  otherIndexes.forEach((i, k) => {
    result[i] = roundedOthers[k];
  });

  return clampFloors(result);
}

/* ------------------------------------------------------------------------ */
/* The shared computation. Every number on the page that describes the      */
/* split is derived from this single function — the stacked bar, the       */
/* recommendation badge, the aggregate payout, and the closing CTA.         */
/* ------------------------------------------------------------------------ */
interface SplitModel {
  shares: readonly number[];
  categoryPayouts: number[];
  totalPayout: number;
  scores: number[];
  dominantIndex: number;
  weakestIndex: number;
  isBalanced: boolean;
}

function computeSplitModel(shares: readonly number[], tierEstimate: number): SplitModel {
  const categoryPayouts = CATEGORIES.map(
    (c, i) => tierEstimate * (shares[i] / 100) * c.payoutMultiplier,
  );
  const totalPayout = categoryPayouts.reduce((sum, v) => sum + v, 0);
  const scores = CATEGORIES.map(
    (c, i) => (shares[i] / 100) * c.payoutMultiplier * c.demandIndex,
  );
  const maxScore = Math.max(...scores);
  const minScore = Math.min(...scores);
  const isBalanced = maxScore - minScore < 0.0005;
  const dominantIndex = scores.indexOf(maxScore);
  const weakestIndex = scores.indexOf(minScore);
  return { shares, categoryPayouts, totalPayout, scores, dominantIndex, weakestIndex, isBalanced };
}

/* ------------------------------------------------------------------------ */
/* Formatting helpers                                                       */
/* ------------------------------------------------------------------------ */
function formatCurrency(value: number): string {
  return `$${Math.round(value).toLocaleString("en-US")}`;
}

/* ------------------------------------------------------------------------ */
/* Motion helper — never leaves content stuck at opacity:0. When reduced    */
/* motion is requested, `initial={false}` makes the element start already   */
/* at its animate/whileInView target values.                                */
/* ------------------------------------------------------------------------ */
function useReveal() {
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
function GhostNumber({ value, className = "" }: { value: string; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none select-none shrink-0 font-medium ${className}`}
      style={{
        color: GHOST,
        fontFamily: "var(--font-display-grotesk)",
        letterSpacing: "0.12em",
        fontSize: "clamp(2.25rem, 6vw, 4.5rem)",
        lineHeight: 1,
      }}
    >
      {value}
    </span>
  );
}

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p
      className="font-medium uppercase"
      style={{ color: ACCENT_TINT, letterSpacing: "0.28em", fontSize: "11px" }}
    >
      {children}
    </p>
  );
}

function FigureCaption({ children }: { children: ReactNode }) {
  return (
    <p
      className="font-medium uppercase"
      style={{ color: MUTED, letterSpacing: "0.16em", fontSize: "10px" }}
    >
      {children}
    </p>
  );
}

interface BadgeSetProps {
  matchPct: number;
  grade: string;
  verified: boolean;
  discountPct: number;
}

function BadgeRow({ matchPct, grade, verified, discountPct }: BadgeSetProps) {
  return (
    <div className="flex min-w-0 flex-wrap items-center gap-1.5">
      <span
        className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-extrabold"
        style={{ backgroundColor: ACCENT, color: INK }}
      >
        <Sparkles className="h-3 w-3" aria-hidden="true" />
        {matchPct}% match
      </span>
      <span
        className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium"
        style={{ color: "#FFFFFF", backgroundColor: "rgba(255,255,255,0.1)" }}
      >
        Grade {grade}
      </span>
      {verified ? (
        <span
          className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium"
          style={{ color: "#FFFFFF", backgroundColor: "rgba(255,255,255,0.1)" }}
        >
          <ShieldCheck className="h-3 w-3" style={{ color: ACCENT_TINT }} aria-hidden="true" />
          Verified
        </span>
      ) : null}
      <span
        className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium"
        style={{ color: "#FFFFFF", backgroundColor: "rgba(255,255,255,0.1)" }}
      >
        <Percent className="h-3 w-3" aria-hidden="true" />
        {discountPct}% off
      </span>
    </div>
  );
}

interface HeroProductCardProps {
  title: string;
  photoId: string;
  alt: string;
  originalPrice: number;
  currentPrice: number;
  badges: BadgeSetProps;
}

function HeroProductCard({ title, photoId, alt, originalPrice, currentPrice, badges }: HeroProductCardProps) {
  return (
    <div className="min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
      <div className="relative aspect-square w-full bg-white/5">
        <Image
          src={`https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=640&q=80`}
          alt={alt}
          fill
          loading="eager"
          sizes="(max-width: 768px) 45vw, 220px"
          className="object-cover"
        />
      </div>
      <div className="min-w-0 space-y-2 p-3">
        <p className="truncate text-sm font-extrabold" style={{ fontFamily: "var(--font-display-grotesk)" }}>
          {title}
        </p>
        <p className="text-sm">
          <span className="font-extrabold">{formatCurrency(currentPrice)}</span>{" "}
          <span className="font-normal line-through" style={{ color: MUTED }}>
            {formatCurrency(originalPrice)}
          </span>
        </p>
        <BadgeRow {...badges} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Section: Hero                                                            */
/* ------------------------------------------------------------------------ */
function HeroSection({ onCtaClick }: { onCtaClick: () => void }) {
  return (
    <section className="relative px-4 pt-8 pb-14 sm:px-6 sm:pt-12 lg:px-8 lg:pb-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-0 h-[260px] w-[260px] rounded-full opacity-[0.10] blur-3xl sm:h-[420px] sm:w-[420px]"
        style={{ background: ACCENT }}
      />
      <div className="relative mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-12 md:items-center md:gap-6">
        <div className="min-w-0 md:col-span-7">
          <Eyebrow>AI-verified resale marketplace</Eyebrow>
          <h1
            className="mt-3 font-extrabold text-white"
            style={{
              fontFamily: "var(--font-display-grotesk)",
              letterSpacing: "-0.02em",
              lineHeight: 1.02,
              fontSize: "clamp(2.1rem, 6.4vw, 4.25rem)",
            }}
          >
            Sell what you own.
            <br />
            Trust what it&apos;s worth.
          </h1>
          <p
            className="mt-4 font-normal leading-[1.6] text-white/80"
            style={{ maxWidth: "500px", fontSize: "16px" }}
          >
            repick grades condition, verifies sellers, and scores match — before any listing
            goes live.
          </p>
          <button
            type="button"
            onClick={onCtaClick}
            className="mt-6 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-extrabold transition-transform focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-[0.98]"
            style={{ backgroundColor: ACCENT, color: INK, outlineColor: ACCENT }}
          >
            Estimate your payout
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="min-w-0 md:col-span-5">
          <div className="grid grid-cols-2 gap-3">
            <HeroProductCard
              title="Sony WH-1000XM5"
              photoId="photo-1572635196237-14b3f281503f"
              alt="Over-ear wireless headphones listed on repick"
              originalPrice={280}
              currentPrice={162}
              badges={{ matchPct: 96, grade: "A", verified: true, discountPct: 42 }}
            />
            <HeroProductCard
              title="Air Max 90 — size 10"
              photoId="photo-1549298916-b41d501d3772"
              alt="Pair of sneakers listed on repick"
              originalPrice={210}
              currentPrice={137}
              badges={{ matchPct: 91, grade: "B+", verified: true, discountPct: 35 }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------------ */
/* Section: Product preview — core conversion proof                        */
/* ------------------------------------------------------------------------ */
interface PreviewProduct {
  categoryIndex: number;
  title: string;
  photoId: string;
  alt: string;
  originalPrice: number;
  currentPrice: number;
  matchPct: number;
  grade: string;
  tags: string[];
}

const PREVIEW_PRODUCTS: PreviewProduct[] = [
  {
    categoryIndex: 0,
    title: "Fujifilm X-T4 body",
    photoId: "photo-1516035069371-29a1b244cc32",
    alt: "Mirrorless camera listed on repick",
    originalPrice: 640,
    currentPrice: 372,
    matchPct: 94,
    grade: "A-",
    tags: ["Matches your gear list", "Low shutter count"],
  },
  {
    categoryIndex: 1,
    title: "Raw selvedge denim jacket",
    photoId: "photo-1551028719-00167b16eac5",
    alt: "Denim jacket listed on repick",
    originalPrice: 180,
    currentPrice: 108,
    matchPct: 89,
    grade: "B+",
    tags: ["Fits your saved size", "Trending silhouette"],
  },
  {
    categoryIndex: 2,
    title: "Seiko 5 automatic, 1978",
    photoId: "photo-1524592094714-0f0654e20314",
    alt: "Vintage wristwatch listed on repick",
    originalPrice: 980,
    currentPrice: 645,
    matchPct: 97,
    grade: "A",
    tags: ["Rare reference number", "Box & papers included"],
  },
  {
    categoryIndex: 3,
    title: "Hand-thrown ceramic vase",
    photoId: "photo-1555041469-a586c61ea9bc",
    alt: "Ceramic home decor piece listed on repick",
    originalPrice: 96,
    currentPrice: 58,
    matchPct: 85,
    grade: "B",
    tags: ["Matches your palette", "New condition"],
  },
];

function ProductPreviewCard({
  product,
  isTrending,
}: {
  product: PreviewProduct;
  isTrending: boolean;
}) {
  const category = CATEGORIES[product.categoryIndex];
  const discountPct = Math.round((1 - product.currentPrice / product.originalPrice) * 100);
  const reveal = useReveal();

  return (
    <motion.article
      {...reveal}
      className="min-w-0 overflow-hidden rounded-2xl border bg-white/[0.03]"
      style={{ borderColor: isTrending ? ACCENT : "rgba(255,255,255,0.1)" }}
    >
      {isTrending ? (
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-extrabold"
          style={{ backgroundColor: ACCENT, color: INK }}
        >
          <Star className="h-3 w-3" aria-hidden="true" />
          Trending in your split model below
        </div>
      ) : null}
      <div className="relative aspect-[4/3] w-full bg-white/5">
        <Image
          src={`https://images.unsplash.com/${product.photoId}?auto=format&fit=crop&w=720&q=80`}
          alt={product.alt}
          fill
          sizes="(max-width: 768px) 90vw, (max-width: 1200px) 45vw, 320px"
          className="object-cover"
        />
      </div>
      <div className="min-w-0 space-y-3 p-4">
        <div className="flex min-w-0 items-center gap-1.5 text-[11px] font-medium" style={{ color: MUTED }}>
          <category.Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span className="truncate">{category.label}</span>
        </div>
        <p className="truncate font-extrabold" style={{ fontFamily: "var(--font-display-grotesk)", fontSize: "18px" }}>
          {product.title}
        </p>
        <p className="text-base">
          <span className="font-extrabold">{formatCurrency(product.currentPrice)}</span>{" "}
          <span className="font-normal line-through" style={{ color: MUTED }}>
            {formatCurrency(product.originalPrice)}
          </span>
        </p>
        <BadgeRow matchPct={product.matchPct} grade={product.grade} verified discountPct={discountPct} />
        <ul className="flex min-w-0 flex-wrap gap-1.5 pt-1">
          {product.tags.map((tag) => (
            <li
              key={tag}
              className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-normal"
              style={{ borderColor: "rgba(255,255,255,0.14)", color: "rgba(255,255,255,0.75)" }}
            >
              <Check className="h-2.5 w-2.5" style={{ color: ACCENT_TINT }} aria-hidden="true" />
              {tag}
            </li>
          ))}
        </ul>
      </div>
    </motion.article>
  );
}

function ProductPreviewSection({ dominantIndex }: { dominantIndex: number | null }) {
  const reveal = useReveal();
  return (
    <section className="relative px-4 py-16 sm:px-6 lg:px-8" id="listings">
      <div className="mx-auto max-w-6xl">
        <div className="relative flex items-end gap-4">
          <GhostNumber value="02" />
          <motion.div {...reveal} className="min-w-0">
            <Eyebrow>Core conversion proof</Eyebrow>
            <h2
              className="mt-2 font-extrabold"
              style={{ fontFamily: "var(--font-display-grotesk)", letterSpacing: "-0.02em", fontSize: "clamp(1.75rem, 3.6vw, 2.75rem)" }}
            >
              Every listing arrives pre-graded
            </h2>
          </motion.div>
        </div>
        <p className="mt-3 font-normal leading-[1.6] text-white/80" style={{ maxWidth: "500px", fontSize: "16px" }}>
          AI match reasoning, a condition grade, seller verification, and the before/after
          discount — shown up front, on every item, before a buyer ever asks.
        </p>
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PREVIEW_PRODUCTS.map((product) => (
            <ProductPreviewCard
              key={product.title}
              product={product}
              isTrending={product.categoryIndex === dominantIndex}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------------ */
/* Section: Value — the allocator, in three parts                          */
/* ------------------------------------------------------------------------ */
function TierSelector({
  tierIndex,
  onChange,
}: {
  tierIndex: number;
  onChange: (index: number) => void;
}) {
  return (
    <div
      role="group"
      aria-label="Inventory size"
      className="inline-flex min-w-0 flex-wrap gap-1.5 rounded-full border border-white/10 bg-white/[0.03] p-1.5"
    >
      {TIERS.map((tier, i) => {
        const active = i === tierIndex;
        return (
          <button
            key={tier.id}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(i)}
            className="min-w-0 rounded-full px-3 py-1.5 text-[12px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{
              backgroundColor: active ? ACCENT : "transparent",
              color: active ? INK : "rgba(255,255,255,0.75)",
              outlineColor: ACCENT,
            }}
          >
            {tier.label} · {formatCurrency(tier.estimate)}
          </button>
        );
      })}
    </div>
  );
}

function CategorySlider({
  category,
  index,
  share,
  payout,
  onChange,
}: {
  category: Category;
  index: number;
  share: number;
  payout: number;
  onChange: (index: number, value: number) => void;
}) {
  const inputId = useId();
  const trackStyle = {
    background: `linear-gradient(to right, ${ACCENT} 0%, ${ACCENT} ${share}%, rgba(255,255,255,0.12) ${share}%, rgba(255,255,255,0.12) 100%)`,
  };
  return (
    <div className="min-w-0">
      <div className="mb-2 flex min-w-0 items-baseline justify-between gap-2">
        <label htmlFor={inputId} className="flex min-w-0 items-center gap-2 text-sm font-medium">
          <category.Icon className="h-4 w-4 shrink-0" aria-hidden="true" style={{ color: ACCENT_TINT }} />
          <span className="truncate">{category.label}</span>
        </label>
        <span className="shrink-0 text-right text-sm">
          <span className="font-extrabold">{share}%</span>{" "}
          <span className="font-normal" style={{ color: MUTED }}>
            · {formatCurrency(payout)}
          </span>
        </span>
      </div>
      <input
        id={inputId}
        type="range"
        min={MIN_SHARE}
        max={100 - MIN_SHARE * (CATEGORIES.length - 1)}
        step={1}
        value={share}
        onChange={(e) => onChange(index, Number(e.target.value))}
        aria-label={`${category.label} share of inventory, ${share} percent`}
        aria-valuetext={`${share} percent, projected payout ${formatCurrency(payout)}`}
        className="h-2 w-full min-w-0 cursor-pointer appearance-none rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[#0B0B0F] [&::-moz-range-thumb]:bg-white [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#0B0B0F] [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-md"
        style={{ ...trackStyle, outlineColor: ACCENT }}
      />
    </div>
  );
}

function StackedBar({
  shares,
  dominantIndex,
}: {
  shares: readonly number[];
  dominantIndex: number | null;
}) {
  return (
    <div className="flex h-3 w-full min-w-0 gap-[2px] overflow-hidden rounded-full" role="presentation">
      {CATEGORIES.map((category, i) => (
        <div
          key={category.id}
          className="h-full min-w-[2px] rounded-full transition-[width] duration-300 motion-reduce:transition-none"
          style={{
            width: `${shares[i]}%`,
            backgroundColor: i === dominantIndex ? ACCENT : "rgba(255,255,255,0.22)",
          }}
        />
      ))}
    </div>
  );
}

function ValueSection({
  shares,
  tierIndex,
  model,
  selectedIndex,
  methodologyOpen,
  onSliderChange,
  onTierChange,
  onSelectCategory,
  onToggleMethodology,
  allocatorRef,
}: {
  shares: readonly number[];
  tierIndex: number;
  model: SplitModel;
  selectedIndex: number;
  methodologyOpen: boolean;
  onSliderChange: (index: number, value: number) => void;
  onTierChange: (index: number) => void;
  onSelectCategory: (index: number) => void;
  onToggleMethodology: () => void;
  allocatorRef: RefObject<HTMLDivElement | null>;
}) {
  const reveal = useReveal();
  const selected = CATEGORIES[selectedIndex];
  const dominant = CATEGORIES[model.dominantIndex];
  // Null when the split is a true tie, so nothing downstream highlights a
  // "winner" that contradicts the balanced message below.
  const highlightIndex = model.isBalanced ? null : model.dominantIndex;
  const weakest = CATEGORIES[model.weakestIndex];

  return (
    <section ref={allocatorRef} id="allocator" className="relative px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Part 1 — intro + secondary control */}
        <div className="relative flex items-end gap-4">
          <GhostNumber value="03" />
          <motion.div {...reveal} className="min-w-0">
            <Eyebrow>Model your split</Eyebrow>
            <h2
              className="mt-2 font-extrabold"
              style={{ fontFamily: "var(--font-display-grotesk)", letterSpacing: "-0.02em", fontSize: "clamp(1.75rem, 3.6vw, 2.75rem)" }}
            >
              One inventory. Four ways to list it.
            </h2>
          </motion.div>
        </div>
        <p className="mt-3 font-normal leading-[1.6] text-white/80" style={{ maxWidth: "525px", fontSize: "17px" }}>
          Drag any category up and the rest compress to fit — the same way a real inventory
          has to add up to 100%. Every payout figure below recalculates from the mix you build.
        </p>
        <div className="mt-6">
          <FigureCaption>Fig. 01 — Inventory size</FigureCaption>
          <div className="mt-2">
            <TierSelector tierIndex={tierIndex} onChange={onTierChange} />
          </div>
        </div>

        {/* Part 2 — the constrained-sum sliders + live stacked bar */}
        <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-8">
          <div className="min-w-0 md:col-span-7">
            <div className="space-y-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
              {CATEGORIES.map((category, i) => (
                <CategorySlider
                  key={category.id}
                  category={category}
                  index={i}
                  share={shares[i]}
                  payout={model.categoryPayouts[i]}
                  onChange={onSliderChange}
                />
              ))}
            </div>
          </div>

          {/* Part 3 — outputs: stacked bar, recommendation, aggregate payout */}
          <div className="min-w-0 space-y-6 md:col-span-5">
            <div className="min-w-0 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
              <FigureCaption>Fig. 02 — Projected payout by category</FigureCaption>
              <div className="mt-3">
                <StackedBar shares={shares} dominantIndex={highlightIndex} />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {CATEGORIES.map((category, i) => {
                  const active = i === selectedIndex;
                  return (
                    <button
                      key={category.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => onSelectCategory(i)}
                      className="min-w-0 rounded-xl border px-2.5 py-2 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
                      style={{
                        borderColor: active ? ACCENT : "rgba(255,255,255,0.12)",
                        backgroundColor: active ? "rgba(163,230,53,0.12)" : "transparent",
                        outlineColor: ACCENT,
                      }}
                    >
                      <span className="flex min-w-0 items-center gap-1.5 text-[11px] font-medium" style={{ color: MUTED }}>
                        <category.Icon className="h-3 w-3 shrink-0" aria-hidden="true" />
                        <span className="truncate">{category.shortLabel}</span>
                        {i === highlightIndex ? (
                          <BadgeCheck className="h-3 w-3 shrink-0" style={{ color: ACCENT_TINT }} aria-hidden="true" />
                        ) : null}
                      </span>
                      <span className="mt-0.5 block truncate text-sm font-extrabold">{formatCurrency(model.categoryPayouts[i])}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="min-w-0 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
              <div className="flex min-w-0 items-center gap-2 text-[11px] font-medium" style={{ color: MUTED }}>
                <selected.Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span className="truncate">{selected.label} detail</span>
              </div>
              <p className="mt-2 font-normal leading-[1.6]" style={{ fontSize: "14px" }}>
                At {shares[selectedIndex]}% of a {formatCurrency(TIERS[tierIndex].estimate)} inventory,{" "}
                {selected.label.toLowerCase()} returns {Math.round(selected.payoutMultiplier * 100)}¢ per
                dollar of value and carries a {Math.round(selected.demandIndex * 100)}% demand index —
                projected at {formatCurrency(model.categoryPayouts[selectedIndex])}.
              </p>
            </div>

            <div
              className="min-w-0 rounded-2xl border p-5 sm:p-6"
              style={{ borderColor: ACCENT, backgroundColor: "rgba(163,230,53,0.08)" }}
            >
              {model.isBalanced ? (
                <p className="font-medium leading-[1.6]" style={{ fontSize: "14px" }}>
                  <span className="font-extrabold">Evenly balanced.</span> No single category leads
                  yet — nudge a slider to surface a clear recommendation.
                </p>
              ) : (
                <>
                  <p className="flex items-center gap-1.5 text-[11px] font-medium uppercase" style={{ letterSpacing: "0.16em", color: ACCENT_TINT }}>
                    <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                    Best to list in right now
                  </p>
                  <p className="mt-1.5 font-extrabold" style={{ fontFamily: "var(--font-display-grotesk)", fontSize: "20px" }}>
                    {dominant.label}
                  </p>
                  <p className="mt-1 font-normal leading-[1.6] text-white/80" style={{ fontSize: "13px" }}>
                    Projected {formatCurrency(model.categoryPayouts[model.dominantIndex])} from{" "}
                    {shares[model.dominantIndex]}% of your mix — the strongest return of the four
                    right now. {weakest.label} trails at {formatCurrency(model.categoryPayouts[model.weakestIndex])}.
                  </p>
                </>
              )}
            </div>

            <div className="min-w-0 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
              <div className="flex items-center gap-2">
                <Wallet className="h-4 w-4" style={{ color: ACCENT_TINT }} aria-hidden="true" />
                <p className="text-[11px] font-medium uppercase" style={{ letterSpacing: "0.16em", color: MUTED }}>
                  Projected total payout
                </p>
              </div>
              <p className="mt-1 font-extrabold" style={{ fontFamily: "var(--font-display-grotesk)", fontSize: "clamp(2rem, 4vw, 2.75rem)" }}>
                {formatCurrency(model.totalPayout)}
              </p>
              <p className="mt-1 text-sm font-normal" style={{ color: MUTED }}>
                from a {formatCurrency(TIERS[tierIndex].estimate)} inventory at your current split
              </p>
            </div>

            <div>
              <button
                type="button"
                onClick={onToggleMethodology}
                aria-expanded={methodologyOpen}
                aria-controls="methodology-panel"
                className="flex w-full min-w-0 items-center justify-between gap-2 rounded-xl border border-white/10 px-4 py-3 text-left text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
                style={{ outlineColor: ACCENT }}
              >
                <span className="truncate">How we project this payout</span>
                <ChevronDown
                  className="h-4 w-4 shrink-0 transition-transform motion-reduce:transition-none"
                  style={{ transform: methodologyOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                  aria-hidden="true"
                />
              </button>
              <div
                id="methodology-panel"
                hidden={!methodologyOpen}
                className="mt-2 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm font-normal leading-[1.6] text-white/75"
              >
                Projected payout = inventory size × category share × repick&apos;s resale
                recovery rate for that category. The listing-priority score additionally
                weights each category&apos;s current buyer demand index, so the recommendation
                reflects both how much you&apos;d list and how fast it would likely sell.
              </div>
            </div>
          </div>
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
      "I split my electronics and collectibles 50/50 without thinking about it. Seeing the projected payout flip when I nudged the slider told me to list the watches first.",
    name: "Priya N.",
    role: "Power seller, 340 items sold",
    photoId: "photo-1494790108377-be9c29b29330",
  },
  {
    quote:
      "The condition grade matched what the buyer said on arrival, word for word. That's the first time a resale app got it right for me.",
    name: "Marcus O.",
    role: "Seller since 2023",
    photoId: "photo-1507003211169-0a1dd7228f2d",
  },
  {
    quote:
      "Verification badge cut my message volume in half. Buyers stopped asking if the camera actually worked.",
    name: "Elena R.",
    role: "Electronics specialist",
    photoId: "photo-1500648767791-00dcc994a43e",
  },
  {
    quote:
      "Match scoring put my jacket in front of people who actually wanted it. Sold in four hours.",
    name: "Devon K.",
    role: "Apparel seller",
    photoId: "photo-1544005313-94ddf0286df2",
  },
];

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const reveal = useReveal();
  return (
    <motion.figure {...reveal} className="min-w-0 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
      <Quote className="h-6 w-6" style={{ color: GHOST }} aria-hidden="true" />
      <blockquote className="mt-3 font-normal leading-[1.6]" style={{ fontSize: "15px", maxWidth: "460px" }}>
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
  const reveal = useReveal();
  return (
    <section className="relative px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="relative flex items-end gap-4">
          <GhostNumber value="04" />
          <motion.div {...reveal} className="min-w-0">
            <Eyebrow>Social proof</Eyebrow>
            <h2
              className="mt-2 font-extrabold"
              style={{ fontFamily: "var(--font-display-grotesk)", letterSpacing: "-0.02em", fontSize: "clamp(1.75rem, 3.6vw, 2.75rem)" }}
            >
              Sellers model their mix, then list with confidence
            </h2>
          </motion.div>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TESTIMONIALS.map((t) => (
            <TestimonialCard key={t.name} testimonial={t} />
          ))}
        </div>
        <div className="mt-10 grid grid-cols-2 gap-6 border-t border-white/10 pt-8 sm:grid-cols-4">
          {[
            { stat: "212K", label: "items graded" },
            { stat: "98.4%", label: "grade accuracy vs. buyer report" },
            { stat: "41%", label: "median discount to original retail" },
            { stat: "3.2×", label: "faster sell-through when verified" },
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
/* Section: Closing CTA — cites the same live total as the allocator        */
/* ------------------------------------------------------------------------ */
function ClosingCtaSection({
  model,
  tierIndex,
  onBackToAllocator,
}: {
  model: SplitModel;
  tierIndex: number;
  onBackToAllocator: () => void;
}) {
  const reveal = useReveal();
  const dominant = CATEGORIES[model.dominantIndex];
  const splitSummary = model.isBalanced
    ? "evenly spread across all four categories"
    : `with ${dominant.label.toLowerCase()} leading the return`;
  const closingCopy = `That's from a ${formatCurrency(TIERS[tierIndex].estimate)} inventory split the way you built it above, ${splitSummary}. List it on repick and let AI match scoring, condition grading, and seller verification do the rest.`;
  return (
    <section className="relative px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="relative mx-auto max-w-6xl">
        <GhostNumber value="05" className="absolute -top-6 right-0" />
        <motion.div {...reveal} className="relative max-w-2xl">
          <Eyebrow>Closing</Eyebrow>
          <h2
            className="mt-2 font-extrabold"
            style={{ fontFamily: "var(--font-display-grotesk)", letterSpacing: "-0.02em", fontSize: "clamp(2rem, 5vw, 3.25rem)", lineHeight: 1.05 }}
          >
            Your current mix projects to{" "}
            <span style={{ color: ACCENT }}>{formatCurrency(model.totalPayout)}</span>.
          </h2>
          <p className="mt-4 font-normal leading-[1.6] text-white/80" style={{ maxWidth: "500px", fontSize: "16px" }}>
            {closingCopy}
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
              onClick={onBackToAllocator}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-medium text-white/85 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{ outlineColor: ACCENT }}
            >
              Adjust the split
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
export default function LandingExperience() {
  const [shares, setShares] = useState<number[]>(() => DEFAULT_SHARES.slice());
  const [tierIndex, setTierIndex] = useState<number>(DEFAULT_TIER_INDEX);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [methodologyOpen, setMethodologyOpen] = useState<boolean>(false);
  const allocatorRef = useRef<HTMLDivElement>(null);

  const model = useMemo(() => computeSplitModel(shares, TIERS[tierIndex].estimate), [shares, tierIndex]);
  // Null at a true tie, so the product-preview ribbon never names a "winner"
  // that the allocator itself is reporting as balanced.
  const highlightIndex = model.isBalanced ? null : model.dominantIndex;

  const handleSliderChange = useCallback((index: number, value: number) => {
    setShares((prev) => redistribute(prev, index, value));
  }, []);

  const scrollToAllocator = useCallback(() => {
    allocatorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [allocatorRef]);

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#0B0B0F] text-white">
      <HeroSection onCtaClick={scrollToAllocator} />
      <ProductPreviewSection dominantIndex={highlightIndex} />
      <ValueSection
        shares={shares}
        tierIndex={tierIndex}
        model={model}
        selectedIndex={selectedIndex}
        methodologyOpen={methodologyOpen}
        onSliderChange={handleSliderChange}
        onTierChange={setTierIndex}
        onSelectCategory={setSelectedIndex}
        onToggleMethodology={() => setMethodologyOpen((v) => !v)}
        allocatorRef={allocatorRef}
      />
      <SocialProofSection />
      <ClosingCtaSection model={model} tierIndex={tierIndex} onBackToAllocator={scrollToAllocator} />
    </main>
  );
}

