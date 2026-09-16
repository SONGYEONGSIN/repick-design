"use client";

import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  ChevronDown,
  CircleAlert,
  CircleCheck,
  Clock3,
  Gem,
  History,
  Layers,
  PackageCheck,
  Percent,
  Quote,
  RotateCcw,
  Scale,
  ShieldCheck,
  Star,
  UserCheck,
  type LucideIcon,
} from "lucide-react";
import Histogram from "./histogram";
import {
  AI_MATCH_TAGS,
  applyFilters,
  binRange,
  CONDITION_RUBRIC,
  discountPct,
  FILTERS,
  histogramOf,
  ITEM,
  ITEM_BIN_INDEX,
  medianOf,
  money,
  ordinal,
  percentileOf,
  TESTIMONIALS,
  TOTAL_COMPARABLES,
  TRUST_STATS,
  type FilterId,
} from "./data";

// Accent hex values are inlined directly into Tailwind arbitrary-value classes throughout this
// file (e.g. `bg-[#15803D]`, `text-[#4ADE80]`) rather than interpolated from a shared constant,
// because Tailwind's class scanner reads raw source text and cannot resolve a template literal —
// see `vault/.../candidates/b.md` for the accent contrast math behind these two hexes:
//   #15803D (fill) — white text/icons on it, ~5.0:1
//   #4ADE80 (tint) — used directly as text/icon/focus-ring color on the dark background, ~11.3:1

const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4ADE80]";
const EYEBROW = "text-[11px] font-semibold tracking-[0.28em] text-[#4ADE80]";
const CAPTION = "text-[11px] font-normal tracking-[0.16em] text-zinc-400";
const STAT_LABEL = "text-[10px] font-semibold tracking-[0.12em] text-zinc-400";
const STAR_POSITIONS = [0, 1, 2, 3, 4];
const SKIP_LINK =
  "sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-50 focus-visible:rounded-full focus-visible:bg-white focus-visible:px-4 focus-visible:py-2 focus-visible:text-[13px] focus-visible:font-semibold focus-visible:text-[#0B0B0F] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4ADE80]";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const FILTER_ICON: Record<FilterId, LucideIcon> = {
  gradeAMinus: ShieldCheck,
  authenticTeak: Gem,
  originalEra: History,
  verifiedSeller: UserCheck,
  soldRecent: Clock3,
  originalCushions: Layers,
};

function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0, margin: "220px 0px 220px 0px" }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function SectionNumber({ n }: { n: string }) {
  return (
    <span
      aria-hidden="true"
      className="select-none text-[clamp(2rem,3.2vw,2.5rem)] font-semibold leading-[0.9] tracking-[0.12em] text-[#6B6B78]"
      style={{ fontFamily: "var(--font-display-mono)" }}
    >
      {n}
    </span>
  );
}

export default function DistributionLanding() {
  const reduce = useReducedMotion();
  const [activeFilters, setActiveFilters] = useState<Set<FilterId>>(new Set());
  const [hoverBin, setHoverBin] = useState<number | null>(null);
  const [rubricOpen, setRubricOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [emailState, setEmailState] = useState<"idle" | "ok" | "error">("idle");

  const filtered = useMemo(() => applyFilters(activeFilters), [activeFilters]);
  const counts = useMemo(() => histogramOf(filtered), [filtered]);
  const percentile = useMemo(() => percentileOf(filtered, ITEM.askPrice), [filtered]);
  const median = useMemo(() => medianOf(filtered), [filtered]);
  const vsMedian = median !== null ? ITEM.askPrice - median : null;
  const discount = discountPct(ITEM.askPrice, ITEM.appraisedValue);
  const activeFilterList = useMemo(
    () => FILTERS.filter((f) => activeFilters.has(f.id)),
    [activeFilters],
  );

  function toggleFilter(id: FilterId) {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function resetFilters() {
    setActiveFilters(new Set());
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setEmailState(EMAIL_RE.test(email) ? "ok" : "error");
  }

  const heroIn = reduce
    ? {}
    : {
        initial: { opacity: 0, y: 18 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
      };

  const displayBinIndex = hoverBin ?? ITEM_BIN_INDEX;
  const displayBinRange = binRange(displayBinIndex);
  const displayBinCount = counts[displayBinIndex] ?? 0;
  const displayIsItemBin = displayBinIndex === ITEM_BIN_INDEX;

  const valueCards = useMemo(
    () => [
      {
        idx: "01",
        icon: PackageCheck,
        title: "Comparable Pool",
        value: `${filtered.length} / ${TOTAL_COMPARABLES}`,
        copy:
          activeFilterList.length === 0
            ? "No filters applied yet — this is every closed sale of this exact chair form."
            : `Narrowed by ${activeFilterList.length} filter${activeFilterList.length === 1 ? "" : "s"}: ${activeFilterList
                .map((f) => f.label)
                .join(", ")}.`,
      },
      {
        idx: "02",
        icon: Percent,
        title: "Price Percentile",
        value: percentile === null ? "—" : ordinal(percentile),
        copy:
          percentile === null
            ? "No comparable sales match every filter above. Remove one to see where this listing lands."
            : `This listing's ${money(ITEM.askPrice)} ask beats ${percentile}% of sales in the current pool.`,
      },
      {
        idx: "03",
        icon: Scale,
        title: "Vs. Median",
        value: vsMedian === null ? "—" : `${vsMedian >= 0 ? "+" : "−"}${money(Math.abs(vsMedian))}`,
        copy:
          median === null
            ? "The pool is empty at this filter combination."
            : `The current pool's median sale is ${money(median)}; this listing is priced ${
                vsMedian !== null && vsMedian >= 0 ? "above" : "below"
              } it.`,
      },
    ],
    [filtered.length, activeFilterList, percentile, median, vsMedian],
  );

  return (
    <div className="min-h-dvh overflow-x-clip bg-[#0B0B0F] font-normal text-white antialiased">
      <a href="#main" className={SKIP_LINK}>
        Skip to main content
      </a>

      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0B0B0F]/95 px-5 py-4 backdrop-blur sm:px-8 lg:px-12">
        <div className="mx-auto flex w-full max-w-[1240px] items-center justify-between gap-6">
          <span className="flex items-center gap-2 text-[15px] font-extrabold tracking-[-0.02em]">
            <span className="h-2 w-2 rounded-full bg-[#15803D]" aria-hidden="true" />
            repick
          </span>
          <nav aria-label="Sections" className="hidden items-center gap-6 sm:flex">
            <a href="#preview" className={`px-1 py-2 text-[13px] font-normal text-zinc-400 transition-colors hover:text-white ${FOCUS}`}>
              The listing
            </a>
            <a href="#distribution" className={`px-1 py-2 text-[13px] font-normal text-zinc-400 transition-colors hover:text-white ${FOCUS}`}>
              The pool
            </a>
            <a href="#proof" className={`px-1 py-2 text-[13px] font-normal text-zinc-400 transition-colors hover:text-white ${FOCUS}`}>
              Sellers
            </a>
          </nav>
          <a
            href="#start"
            className={`rounded-full bg-[#15803D] px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#166534] ${FOCUS}`}
          >
            List an item
          </a>
        </div>
      </header>

      <main id="main">
        {/* ---------------------------------------------------------------- HERO */}
        <section className="border-b border-white/10 px-5 pt-16 pb-16 sm:px-8 lg:px-12 lg:pt-20 lg:pb-24">
          <div className="mx-auto w-full max-w-[1240px]">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
              <motion.div className="min-w-0 lg:col-span-5" {...heroIn}>
                <p className={EYEBROW}>PRICED AGAINST REAL SALES</p>
                <h1
                  className="mt-5 text-[clamp(2.1rem,6.4vw,3.4rem)] font-extrabold leading-[1.05] tracking-[-0.01em]"
                  style={{ fontFamily: "var(--font-display-mono)" }}
                >
                  Every price sits inside a distribution.
                  <span className="block text-[#4ADE80]">We show you where.</span>
                </h1>
                <p className="mt-6 max-w-[493px] text-[16px] font-normal leading-[1.6] text-zinc-400">
                  Repick doesn&rsquo;t price against a formula &mdash; it prices against every
                  comparable trade that&rsquo;s already closed. Filter the comparison pool below
                  and watch the sold-price distribution, and this listing&rsquo;s spot inside it,
                  move in place.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <a
                    href="#distribution"
                    className={`inline-flex items-center gap-2 rounded-full bg-[#15803D] px-7 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-[#166534] ${FOCUS}`}
                  >
                    See the distribution
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                  <span className={STAT_LABEL}>{TOTAL_COMPARABLES} CLOSED SALES IN THIS POOL</span>
                </div>
              </motion.div>

              <motion.div className="min-w-0 lg:col-span-7" {...heroIn}>
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
                  <div className="relative aspect-[16/11] w-full bg-zinc-900">
                    <Image
                      src={`https://images.unsplash.com/photo-${ITEM.photoId}?q=80&w=1400&auto=format&fit=crop`}
                      alt={ITEM.alt}
                      fill
                      priority
                      sizes="(min-width: 1024px) 700px, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-5 sm:p-6">
                    <p className={STAT_LABEL}>{ITEM.category.toUpperCase()}</p>
                    <h2 className="mt-1 text-[19px] font-extrabold tracking-[-0.01em]">{ITEM.name}</h2>
                    <p className="mt-1 text-[13px] font-normal text-zinc-400">{ITEM.detail}</p>

                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-[#4ADE80]/40 bg-white/[0.02] px-3 py-1 text-[12px] font-semibold text-[#4ADE80]">
                        <CircleCheck className="h-3.5 w-3.5" aria-hidden="true" />
                        {ITEM.matchPct}% match
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.02] px-3 py-1 text-[12px] font-semibold text-white">
                        Grade {ITEM.conditionGrade}
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.02] px-3 py-1 text-[12px] font-semibold text-white">
                        <ShieldCheck className="h-3.5 w-3.5 text-[#4ADE80]" aria-hidden="true" />
                        Seller Verified
                      </span>
                    </div>

                    <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1 border-t border-white/10 pt-4 tabular-nums">
                      <span className="text-[13px] font-normal text-zinc-400 line-through">
                        {money(ITEM.appraisedValue)} appraised
                      </span>
                      <span
                        className="text-[clamp(1.4rem,3vw,1.8rem)] font-extrabold tracking-[-0.01em]"
                        style={{ fontFamily: "var(--font-display-mono)" }}
                      >
                        {money(ITEM.askPrice)}
                      </span>
                      <span className="rounded-full bg-[#15803D] px-2 py-0.5 text-[12px] font-semibold text-white">
                        {discount}% off
                      </span>
                    </div>
                    <p className={`mt-3 ${CAPTION}`}>Fig. 01 &mdash; Current listing, live</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------- PRODUCT PREVIEW */}
        <section id="preview" className="border-b border-white/10 px-5 py-24 sm:px-8 lg:px-12 lg:py-28">
          <div className="mx-auto w-full max-w-[1240px]">
            <Reveal>
              <div className="flex items-end gap-5">
                <SectionNumber n="02" />
                <div>
                  <p className={EYEBROW}>THE LISTING</p>
                  <h2
                    className="mt-3 max-w-[720px] text-[clamp(1.6rem,4vw,2.5rem)] font-extrabold leading-[1.08] tracking-[-0.01em]"
                    style={{ fontFamily: "var(--font-display-mono)" }}
                  >
                    Everything a buyer sees, none of it painted over the photo.
                  </h2>
                </div>
              </div>
              <p className="mt-5 max-w-[493px] text-[16px] font-normal leading-[1.6] text-zinc-400">
                The AI match, the condition grade, and the seller history all sit in their own row
                below the photo &mdash; so a slow connection never leaves a badge floating over a
                broken image.
              </p>
            </Reveal>

            <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
              <Reveal className="min-w-0 lg:col-span-7">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
                  <p className={STAT_LABEL}>AI MATCH REASONING</p>
                  <ul className="mt-3 flex flex-col gap-2">
                    {AI_MATCH_TAGS.map((tag) => (
                      <li
                        key={tag}
                        className="flex items-start gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2 text-[13px] font-normal leading-[1.5] text-zinc-400"
                      >
                        <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#4ADE80]" aria-hidden="true" />
                        <span className="text-white">{tag}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-white/10 pt-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.04] px-3 py-1 text-[12px] font-semibold text-white">
                      <UserCheck className="h-3.5 w-3.5 text-[#4ADE80]" aria-hidden="true" />
                      {ITEM.sellerTrades} trades &middot; {ITEM.sellerRating.toFixed(1)} / 5
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.04] px-3 py-1 text-[12px] font-semibold text-white">
                      <BadgeCheck className="h-3.5 w-3.5 text-[#4ADE80]" aria-hidden="true" />
                      ID &amp; address confirmed
                    </span>
                  </div>
                </div>
              </Reveal>

              <Reveal className="min-w-0 lg:col-span-5" delay={0.06}>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
                  <p className={STAT_LABEL}>CONDITION GRADE {ITEM.conditionGrade}</p>
                  <p className="mt-2 text-[14px] font-normal leading-[1.6] text-zinc-400">
                    {CONDITION_RUBRIC.filter((c) => c.pass).length} of {CONDITION_RUBRIC.length}{" "}
                    points passed on the public rubric behind this grade.
                  </p>
                  <button
                    type="button"
                    aria-expanded={rubricOpen}
                    aria-controls="condition-rubric-list"
                    onClick={() => setRubricOpen((v) => !v)}
                    className={`mt-4 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.02] px-3 py-1.5 text-[12px] font-semibold text-white transition-colors hover:border-[#4ADE80]/60 ${FOCUS}`}
                  >
                    {rubricOpen ? "Hide" : "View"} full rubric
                    <ChevronDown
                      className={`h-3.5 w-3.5 transition-transform duration-200 ${rubricOpen ? "rotate-180" : ""}`}
                      aria-hidden="true"
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {rubricOpen && (
                      <motion.ul
                        id="condition-rubric-list"
                        initial={reduce ? false : { opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
                        transition={{ duration: reduce ? 0 : 0.25, ease: [0.22, 1, 0.36, 1] }}
                        className="mt-4 flex flex-col gap-2 border-t border-white/10 pt-4"
                      >
                        {CONDITION_RUBRIC.map((point) => (
                          <li key={point.label} className="flex items-start gap-2">
                            {point.pass ? (
                              <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#4ADE80]" aria-hidden="true" />
                            ) : (
                              <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
                            )}
                            <span className="text-[13px] font-normal leading-[1.5] text-zinc-400">
                              <span className="text-white">{point.label}</span>
                              {point.note && <span className="block text-zinc-400">{point.note}</span>}
                            </span>
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                  <p className={`mt-4 ${CAPTION}`}>Fig. 02 &mdash; Public condition rubric, updated at inspection</p>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------- COMPARISON POOL */}
        <section id="distribution" className="border-b border-white/10 px-5 py-24 sm:px-8 lg:px-12 lg:py-28">
          <div className="mx-auto w-full max-w-[1240px]">
            <Reveal>
              <div className="flex items-end gap-5">
                <SectionNumber n="03" />
                <div>
                  <p className={EYEBROW}>THE COMPARISON POOL</p>
                  <h2
                    className="mt-3 max-w-[720px] text-[clamp(1.6rem,4vw,2.5rem)] font-extrabold leading-[1.08] tracking-[-0.01em]"
                    style={{ fontFamily: "var(--font-display-mono)" }}
                  >
                    Narrow the pool. Watch the shape change.
                  </h2>
                </div>
              </div>
              <p className="mt-5 max-w-[493px] text-[16px] font-normal leading-[1.6] text-zinc-400">
                Switch on any combination of the filters below, in any order. The 72 closed sales
                behind this listing re-bucket into a new distribution every time, and the three
                numbers underneath &mdash; and the closing line at the bottom of this page &mdash;
                move with it.
              </p>
            </Reveal>

            <Reveal delay={0.05}>
              <div className="mt-8 flex flex-wrap items-center gap-2" role="group" aria-label="Comparable-sale filters">
                {FILTERS.map((filter) => {
                  const Icon = FILTER_ICON[filter.id];
                  const on = activeFilters.has(filter.id);
                  return (
                    <button
                      key={filter.id}
                      type="button"
                      aria-pressed={on}
                      onClick={() => toggleFilter(filter.id)}
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-[12px] font-semibold transition-colors ${FOCUS} ${
                        on
                          ? "border-[#15803D] bg-[#15803D] text-white"
                          : "border-white/15 bg-white/[0.02] text-white hover:border-[#4ADE80]/60 hover:bg-white/[0.06]"
                      }`}
                    >
                      <Icon className="h-3 w-3 shrink-0" aria-hidden="true" />
                      {filter.label}
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={resetFilters}
                  disabled={activeFilters.size === 0}
                  className={`inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-2 text-[12px] font-semibold text-zinc-400 transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:text-zinc-400 ${FOCUS}`}
                >
                  <RotateCcw className="h-3 w-3 shrink-0" aria-hidden="true" />
                  Reset
                </button>
              </div>
            </Reveal>

            <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
              <Reveal className="min-w-0 lg:col-span-8" delay={0.08}>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
                  <Histogram
                    counts={counts}
                    itemBinIndex={ITEM_BIN_INDEX}
                    hoverBin={hoverBin}
                    onHover={setHoverBin}
                    activeFilters={Array.from(activeFilters)}
                    reduce={!!reduce}
                  />
                  <p className={`mt-5 ${CAPTION}`} aria-live="polite">
                    {filtered.length === 0
                      ? "No comparable sales match every filter selected — remove one to see the distribution again."
                      : `Fig. 03 — ${filtered.length} of ${TOTAL_COMPARABLES} comparable sales match the current filters.`}
                  </p>
                </div>
              </Reveal>

              <Reveal className="min-w-0 lg:col-span-4" delay={0.12}>
                <div className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
                  <p className={STAT_LABEL}>{hoverBin === null ? "YOUR LISTING'S BAND" : "BAND UNDER YOUR CURSOR"}</p>
                  <dl className="mt-3 flex flex-col gap-4">
                    <div>
                      <dt className={STAT_LABEL}>Price range</dt>
                      <dd
                        className="mt-1 text-[clamp(1.3rem,2.6vw,1.6rem)] font-extrabold tabular-nums tracking-[-0.01em]"
                        style={{ fontFamily: "var(--font-display-mono)" }}
                      >
                        {money(displayBinRange.lo)}&ndash;{money(displayBinRange.hi)}
                      </dd>
                    </div>
                    <div>
                      <dt className={STAT_LABEL}>Sales in this band</dt>
                      <dd className="mt-1 text-[19px] font-extrabold tabular-nums">{displayBinCount}</dd>
                    </div>
                  </dl>
                  <p className="mt-4 text-[13px] font-normal leading-[1.6] text-zinc-400">
                    {displayIsItemBin
                      ? "This is this listing's own band — its asking price falls inside this exact range."
                      : "Hover or focus a different bar to preview its range and count."}
                  </p>
                </div>
              </Reveal>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
              {valueCards.map((card, i) => {
                const Icon = card.icon;
                return (
                  <Reveal key={card.idx} delay={i * 0.06}>
                    <div className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                      <div className="flex items-center justify-between">
                        <span
                          aria-hidden="true"
                          className="select-none text-[1.75rem] font-semibold leading-none tracking-[0.12em] text-[#6B6B78]"
                          style={{ fontFamily: "var(--font-display-mono)" }}
                        >
                          {card.idx}
                        </span>
                        <Icon className="h-4 w-4 text-[#4ADE80]" aria-hidden="true" />
                      </div>
                      <h3 className="mt-5 text-[15px] font-semibold tracking-[-0.01em]">{card.title}</h3>
                      <p
                        className="mt-3 text-[clamp(1.4rem,3vw,1.8rem)] font-extrabold leading-tight tracking-[-0.01em] tabular-nums"
                        style={{ fontFamily: "var(--font-display-mono)" }}
                      >
                        {card.value}
                      </p>
                      <p className="mt-4 max-w-[431px] text-[14px] font-normal leading-[1.6] text-zinc-400">
                        {card.copy}
                      </p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------- SOCIAL PROOF */}
        <section id="proof" className="border-b border-white/10 px-5 py-24 sm:px-8 lg:px-12 lg:py-28">
          <div className="mx-auto w-full max-w-[1240px]">
            <Reveal>
              <p className={EYEBROW}>SELLERS</p>
              <h2
                className="mt-4 max-w-[720px] text-[clamp(1.6rem,3.8vw,2.4rem)] font-extrabold leading-[1.08] tracking-[-0.01em]"
                style={{ fontFamily: "var(--font-display-mono)" }}
              >
                They let buyers filter the pool, not just read the badge.
              </h2>
            </Reveal>

            <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-12">
              <ul className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-3 lg:col-span-8">
                {TESTIMONIALS.map((t, i) => (
                  <motion.li
                    key={t.name}
                    initial={reduce ? false : { opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    whileHover={reduce ? undefined : { y: -4 }}
                    viewport={{ once: true, amount: 0, margin: "220px 0px 220px 0px" }}
                    transition={{ duration: 0.45, delay: reduce ? 0 : i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-5"
                  >
                    <Quote className="h-5 w-5 text-[#4ADE80]" aria-hidden="true" />
                    <p className="mt-3 max-w-[280px] text-[14px] font-normal leading-[1.6] text-zinc-300">
                      {t.quote}
                    </p>
                    <div role="img" aria-label={`Rated ${t.rating} out of 5`} className="mt-4 flex items-center gap-1">
                      {STAR_POSITIONS.map((s) => (
                        <Star
                          key={s}
                          aria-hidden="true"
                          className={`h-3.5 w-3.5 ${s < t.rating ? "fill-[#4ADE80] text-[#4ADE80]" : "text-zinc-400"}`}
                        />
                      ))}
                    </div>
                    <p className="mt-3 text-[13px] font-semibold text-white">{t.name}</p>
                    <p className="mt-0.5 flex items-center gap-1 text-[12px] font-normal text-zinc-400">
                      <BadgeCheck className="h-3 w-3 shrink-0 text-[#4ADE80]" aria-hidden="true" />
                      {t.context}
                    </p>
                  </motion.li>
                ))}
              </ul>

              <Reveal className="min-w-0 lg:col-span-4">
                <dl className="flex flex-col gap-6">
                  {TRUST_STATS.map((stat) => (
                    <div key={stat.label}>
                      <dt className={STAT_LABEL}>{stat.label}</dt>
                      <dd
                        className="mt-1 text-[clamp(1.6rem,3.2vw,2rem)] font-extrabold tabular-nums tracking-[-0.01em]"
                        style={{ fontFamily: "var(--font-display-mono)" }}
                      >
                        {stat.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------- CLOSING CTA */}
        <section id="start" className="px-5 py-24 sm:px-8 lg:px-12 lg:py-28">
          <div className="mx-auto w-full max-w-[1240px]">
            <Reveal>
              <p className={EYEBROW}>WHAT THE POOL SAYS</p>
              <h2
                className="mt-5 max-w-[860px] text-[clamp(1.8rem,5.6vw,3.1rem)] font-extrabold leading-[1.06] tracking-[-0.01em]"
                style={{ fontFamily: "var(--font-display-mono)" }}
              >
                Sell at the price the pool already agrees on.
              </h2>
              <p className="mt-6 max-w-[493px] text-[16px] font-normal leading-[1.6] text-zinc-400" aria-live="polite">
                Right now: {filtered.length} of {TOTAL_COMPARABLES} comparable sales match your
                filters, and this listing&rsquo;s {money(ITEM.askPrice)} ask sits at the{" "}
                <span className="font-semibold tabular-nums text-white">
                  {percentile === null ? "—" : `${ordinal(percentile)} percentile`}
                </span>
                {median !== null && (
                  <>
                    {" "}
                    &mdash; {vsMedian !== null && vsMedian >= 0 ? "above" : "below"} the{" "}
                    <span className="font-semibold tabular-nums text-white">{money(median)}</span>{" "}
                    pool median
                  </>
                )}
                . Add or remove a filter above and this line moves with it.
              </p>

              <form onSubmit={handleSubmit} className="mt-9 max-w-[420px]" noValidate>
                <label htmlFor="notify-email" className="block text-[12px] font-semibold text-zinc-400">
                  Get notified when a buyer opens this listing
                </label>
                <div className="mt-2 flex flex-wrap gap-3 sm:flex-nowrap">
                  <input
                    id="notify-email"
                    type="email"
                    inputMode="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailState !== "idle") setEmailState("idle");
                    }}
                    placeholder="you@example.com"
                    aria-invalid={emailState === "error"}
                    aria-describedby="notify-email-msg"
                    className={`min-w-0 flex-1 rounded-full border border-white/15 bg-white/[0.03] px-4 py-3 text-[14px] font-normal text-white placeholder:text-zinc-400 ${FOCUS}`}
                  />
                  <button
                    type="submit"
                    className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#15803D] px-6 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-[#166534] ${FOCUS}`}
                  >
                    Notify me
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
                <p id="notify-email-msg" className="mt-2 flex items-center gap-1.5 text-[12px] font-normal text-zinc-400" aria-live="polite">
                  {emailState === "ok" && (
                    <>
                      <CircleCheck className="h-3.5 w-3.5 shrink-0 text-[#4ADE80]" aria-hidden="true" />
                      You&rsquo;re on the list &mdash; we&rsquo;ll email you the moment this sells.
                    </>
                  )}
                  {emailState === "error" && (
                    <>
                      <CircleAlert className="h-3.5 w-3.5 shrink-0 text-white" aria-hidden="true" />
                      Enter a full email address, like you@example.com.
                    </>
                  )}
                  {emailState === "idle" && "No account needed. We only email you once."}
                </p>
              </form>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 px-5 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto flex w-full max-w-[1240px] flex-wrap items-center justify-between gap-6">
          <span className="text-[13px] font-semibold tracking-[-0.01em]">repick</span>
          <nav aria-label="Footer" className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <a href="#preview" className={`px-1 py-2 text-[13px] font-normal text-zinc-400 transition-colors hover:text-white ${FOCUS}`}>
              The listing
            </a>
            <a href="#distribution" className={`px-1 py-2 text-[13px] font-normal text-zinc-400 transition-colors hover:text-white ${FOCUS}`}>
              The pool
            </a>
            <a href="#proof" className={`px-1 py-2 text-[13px] font-normal text-zinc-400 transition-colors hover:text-white ${FOCUS}`}>
              Sellers
            </a>
          </nav>
          <span className={CAPTION}>PRICED AGAINST REAL SALES</span>
        </div>
      </footer>
    </div>
  );
}
