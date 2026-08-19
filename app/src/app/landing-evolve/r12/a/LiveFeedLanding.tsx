"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import {
  CATEGORY_FILTERS,
  LISTINGS,
  discountPercent,
  filterListings,
  gradeDistribution,
  photoUrl,
  streamStats,
  type FilterId,
  type GradeBucket,
  type MatchListing,
} from "./data";

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A5B4FC]";

const STREAM_WINDOW = 3;
const ADVANCE_MS = 3400;

function visibleWindow<T>(items: T[], start: number, count: number): T[] {
  if (items.length === 0) return [];
  const n = Math.min(count, items.length);
  return Array.from({ length: n }, (_, i) => items[(start + i) % items.length]);
}

export default function LiveFeedLanding() {
  const [activeCategory, setActiveCategory] = useState<FilterId>("all");
  const [prevCategory, setPrevCategory] = useState<FilterId>(activeCategory);
  const [startIndex, setStartIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  // Reset the visible window when the filter changes. Adjusted during render (React's documented
  // pattern for "state that resets when a prop/derived value changes") rather than in an effect,
  // so it does not cause the extra render-then-fix-up pass a useEffect setState would.
  if (activeCategory !== prevCategory) {
    setPrevCategory(activeCategory);
    setStartIndex(0);
    setExpandedId(null);
  }

  const filtered = useMemo(() => filterListings(activeCategory), [activeCategory]);
  const stats = useMemo(() => streamStats(filtered), [filtered]);
  const distribution = useMemo(() => gradeDistribution(filtered), [filtered]);
  const allStats = useMemo(() => streamStats(LISTINGS), []);
  const categoryLabel = useMemo(
    () => CATEGORY_FILTERS.find((f) => f.id === activeCategory)?.label ?? "All",
    [activeCategory],
  );

  const isAutoAdvancing = isPlaying && !prefersReducedMotion;

  useEffect(() => {
    if (!isAutoAdvancing || isHovering || expandedId !== null) return;
    if (filtered.length <= STREAM_WINDOW) return;
    const id = window.setInterval(() => {
      setStartIndex((i) => (i + 1) % filtered.length);
    }, ADVANCE_MS);
    return () => window.clearInterval(id);
  }, [isAutoAdvancing, isHovering, expandedId, filtered.length]);

  const step = useCallback(
    (direction: 1 | -1) => {
      if (filtered.length === 0) return;
      setStartIndex((i) => (i + direction + filtered.length) % filtered.length);
    },
    [filtered.length],
  );

  const visible = visibleWindow(filtered, startIndex, STREAM_WINDOW);

  return (
    <div className="bg-[#0B0B0F]">
      <a
        href="#main-content"
        className={`sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-50 focus-visible:rounded-full focus-visible:bg-white focus-visible:px-4 focus-visible:py-2 focus-visible:text-sm focus-visible:font-semibold focus-visible:text-[#0B0B0F] ${focusRing}`}
      >
        Skip to main content
      </a>

      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0B0B0F]/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-6 lg:px-10">
          <a href="#top" className={`text-lg font-extrabold tracking-[-0.02em] text-white ${focusRing}`}>
            Cascade
          </a>
          <nav aria-label="Primary" className="hidden items-center gap-8 text-sm font-normal text-zinc-400 md:flex">
            <a href="#stream" className={`transition hover:text-white ${focusRing}`}>
              Live feed
            </a>
            <a href="#how-it-works" className={`transition hover:text-white ${focusRing}`}>
              How it works
            </a>
            <a href="#proof" className={`transition hover:text-white ${focusRing}`}>
              Trust
            </a>
          </nav>
          <a
            href="#cta"
            className={`inline-flex h-10 items-center justify-center rounded-full bg-[#4F46E5] px-5 text-sm font-semibold text-white transition hover:bg-[#4338CA] ${focusRing}`}
          >
            Get started
          </a>
        </div>
      </header>

      <main id="main-content">
        <section id="top" className="border-b border-white/10 px-6 pb-16 pt-14 lg:px-10 lg:pb-24 lg:pt-20">
          <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-12 lg:grid-cols-12 lg:items-start lg:gap-8">
            <div className="lg:col-span-5">
              <p className="text-xs font-semibold tracking-[0.28em] text-[#A5B4FC]">LIVE MATCH FEED</p>
              <h1 className="mt-5 text-[clamp(2.25rem,8vw,2.9rem)] font-extrabold leading-[1.05] tracking-[-0.02em] text-white lg:text-[clamp(2.9rem,4.4vw,4.1rem)]">
                The resale market,
                <br />
                <span className="text-[#6366F1]">live.</span>
              </h1>
              <p className="mt-6 max-w-[520px] text-[17px] leading-[1.6] text-zinc-400">
                Cascade streams every verified match to your saved searches the instant it lists — condition
                graded, seller verified, priced against comparables. No refreshing. No guessing.
              </p>
              <div className="mt-8">
                <a
                  href="#stream"
                  className={`inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#4F46E5] px-6 text-sm font-semibold text-white transition hover:bg-[#4338CA] ${focusRing}`}
                >
                  Browse live matches
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </a>
              </div>
              <dl className="mt-10 flex flex-wrap gap-x-8 gap-y-5 border-t border-white/10 pt-6">
                <div>
                  <dt className="text-xs font-normal tracking-[0.12em] text-zinc-400">LIVE MATCHES</dt>
                  <dd className="mt-1 text-2xl font-extrabold tabular-nums text-white">{allStats.count}</dd>
                </div>
                <div>
                  <dt className="text-xs font-normal tracking-[0.12em] text-zinc-400">AVG MATCH SCORE</dt>
                  <dd className="mt-1 text-2xl font-extrabold tabular-nums text-white">{allStats.avgMatch}%</dd>
                </div>
                <div>
                  <dt className="text-xs font-normal tracking-[0.12em] text-zinc-400">AVG SAVINGS</dt>
                  <dd className="mt-1 text-2xl font-extrabold tabular-nums text-white">{allStats.avgSavings}%</dd>
                </div>
              </dl>
            </div>

            <div className="lg:col-span-7">
              <div
                className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:p-6"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                onFocus={() => setIsHovering(true)}
                onBlur={() => setIsHovering(false)}
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span
                      aria-hidden
                      className={`h-2 w-2 rounded-full bg-[#A5B4FC] ${
                        isAutoAdvancing ? "motion-safe:animate-pulse" : ""
                      }`}
                    />
                    <span className="text-sm font-semibold text-white">Live matches</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => step(-1)}
                      aria-label="Show previous match"
                      className={`flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-zinc-400 transition hover:text-white ${focusRing}`}
                    >
                      <ChevronLeft className="h-4 w-4" aria-hidden />
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsPlaying((p) => !p)}
                      aria-pressed={isPlaying}
                      aria-label={isPlaying ? "Pause live feed" : "Resume live feed"}
                      className={`flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-zinc-400 transition hover:text-white ${focusRing}`}
                    >
                      {isPlaying ? (
                        <Pause className="h-4 w-4" aria-hidden />
                      ) : (
                        <Play className="h-4 w-4" aria-hidden />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => step(1)}
                      aria-label="Show next match"
                      className={`flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-zinc-400 transition hover:text-white ${focusRing}`}
                    >
                      <ChevronRight className="h-4 w-4" aria-hidden />
                    </button>
                  </div>
                </div>

                <div role="group" aria-label="Filter live matches by category" className="mt-5 flex flex-wrap gap-2">
                  {CATEGORY_FILTERS.map((f) => {
                    const active = f.id === activeCategory;
                    return (
                      <button
                        key={f.id}
                        type="button"
                        aria-pressed={active}
                        onClick={() => setActiveCategory(f.id)}
                        className={`inline-flex h-9 items-center rounded-full border px-4 text-xs font-semibold tracking-[0.08em] transition ${focusRing} ${
                          active
                            ? "border-[#4F46E5] bg-[#4F46E5] text-white"
                            : "border-white/15 text-zinc-400 hover:text-white"
                        }`}
                      >
                        {f.label}
                      </button>
                    );
                  })}
                </div>

                <p className="mt-4 text-xs tabular-nums text-zinc-400" aria-live="polite">
                  Showing {Math.min(STREAM_WINDOW, filtered.length)} of {filtered.length} live matches ·{" "}
                  <span className="font-semibold text-[#A5B4FC]">{stats.avgMatch}%</span> avg match ·{" "}
                  <span className="font-semibold text-[#A5B4FC]">{stats.avgSavings}%</span> avg savings
                </p>

                <ul className="mt-5 flex flex-col gap-3">
                  <AnimatePresence initial={false} mode="popLayout">
                    {visible.map((listing) => (
                      <motion.li
                        key={listing.id}
                        layout
                        initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={prefersReducedMotion ? undefined : { opacity: 0, y: -14 }}
                        transition={{ duration: prefersReducedMotion ? 0 : 0.35, ease: "easeOut" }}
                      >
                        <MatchCard
                          listing={listing}
                          expanded={expandedId === listing.id}
                          onToggle={() =>
                            setExpandedId((cur) => (cur === listing.id ? null : listing.id))
                          }
                        />
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="border-b border-white/10 bg-white/[0.02] px-6 py-24 lg:px-10 lg:py-32">
          <div className="mx-auto max-w-[1400px]">
            <div className="max-w-[640px]">
              <p className="text-xs font-semibold tracking-[0.28em] text-[#A5B4FC]">HOW CASCADE VERIFIES A MATCH</p>
              <h2 className="mt-4 text-[clamp(1.9rem,5vw,2.6rem)] font-extrabold tracking-[-0.02em] text-white">
                Three checks run before a listing ever reaches your feed.
              </h2>
              <p className="mt-4 max-w-[560px] text-[15px] leading-[1.6] text-zinc-400">
                Switch categories above and these numbers recompute — they describe the {categoryLabel.toLowerCase()}{" "}
                listings currently in your feed, not a fixed example.
              </p>
            </div>

            <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-3">
              <ValueCard
                number="01"
                title="AI match score"
                body="Cascade compares every new listing against your saved searches and purchase history, scoring fit from 0 to 100 before it ever appears."
              >
                <p className="mt-6 text-3xl font-extrabold tabular-nums text-white">
                  {stats.avgMatch}%
                  <span className="ml-2 align-middle text-[11px] font-normal tracking-[0.12em] text-zinc-400">
                    AVG MATCH · {categoryLabel.toUpperCase()}
                  </span>
                </p>
              </ValueCard>

              <ValueCard
                number="02"
                title="Condition grading"
                body="Each photo set is graded against thousands of reference images — wear, damage and repairs are called out, not glossed over."
              >
                <GradeBars distribution={distribution} />
              </ValueCard>

              <ValueCard
                number="03"
                title="Seller verification"
                body="Verified sellers complete ID and payout checks. Unverified listings stay visible but clearly marked until they clear review."
              >
                <p className="mt-6 text-3xl font-extrabold tabular-nums text-white">
                  {stats.verifiedCount}
                  <span className="text-lg font-normal text-zinc-400">/{stats.count}</span>
                  <span className="ml-2 align-middle text-[11px] font-normal tracking-[0.12em] text-zinc-400">
                    VERIFIED · {categoryLabel.toUpperCase()}
                  </span>
                </p>
              </ValueCard>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function MatchCard({
  listing,
  expanded,
  onToggle,
}: {
  listing: MatchListing;
  expanded: boolean;
  onToggle: () => void;
}) {
  const discount = discountPercent(listing);
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={expanded}
      className={`w-full rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-left transition hover:border-white/20 hover:bg-white/[0.05] ${focusRing}`}
    >
      <div className="flex gap-4">
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-zinc-900">
          <Image
            src={photoUrl(listing.photoId, 200)}
            alt={listing.scan}
            width={96}
            height={96}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-[15px] font-semibold text-white">{listing.title}</p>
              <p className="truncate text-xs font-normal text-zinc-400">{listing.brand}</p>
            </div>
            <span className="shrink-0 rounded-full bg-[#4F46E5] px-2.5 py-1 text-[11px] font-semibold tabular-nums text-white">
              −{discount}%
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2 tabular-nums">
            <span className="text-lg font-extrabold text-white">${listing.price}</span>
            <span className="text-sm font-normal text-zinc-400 line-through">${listing.originalPrice}</span>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs">
            <span className="inline-flex items-center gap-1 rounded-full border border-[#6366F1]/50 px-2 py-1 font-semibold tabular-nums text-[#A5B4FC]">
              {listing.matchPercent}% match
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-white/15 px-2 py-1 font-semibold text-zinc-300">
              Grade {listing.grade}
            </span>
            {listing.verified ? (
              <span className="inline-flex items-center gap-1 font-normal text-zinc-300">
                <ShieldCheck className="h-3.5 w-3.5 text-[#A5B4FC]" aria-hidden />
                Verified seller
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 font-normal text-zinc-400">
                <ShieldAlert className="h-3.5 w-3.5" aria-hidden />
                Seller verifying
              </span>
            )}
            <span className="font-normal text-zinc-400">{listing.listedAgo}</span>
          </div>
        </div>
      </div>
      {expanded ? (
        <ul className="mt-4 flex flex-col gap-1.5 border-t border-white/10 pt-3 text-xs font-normal text-zinc-300">
          {listing.tags.map((tag) => (
            <li key={tag} className="flex gap-2">
              <ChevronRight className="mt-0.5 h-3 w-3 shrink-0 text-[#A5B4FC]" aria-hidden />
              <span>{tag}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </button>
  );
}

function ValueCard({
  number,
  title,
  body,
  children,
}: {
  number: string;
  title: string;
  body: string;
  children: ReactNode;
}) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0B0B0F] p-6">
      <span aria-hidden className="pointer-events-none absolute -top-3 right-5 text-7xl font-extrabold text-white/[0.05]">
        {number}
      </span>
      <div className="relative">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="mt-3 max-w-[300px] text-sm leading-[1.6] text-zinc-400">{body}</p>
        {children}
      </div>
    </div>
  );
}

function GradeBars({ distribution }: { distribution: GradeBucket[] }) {
  return (
    <ul className="mt-6 flex flex-col gap-2.5">
      {distribution.map((bucket) => (
        <li key={bucket.grade} className="flex items-center gap-3">
          <span className="w-7 shrink-0 text-xs font-semibold tabular-nums text-zinc-300">{bucket.grade}</span>
          <span className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
            <span
              className="block h-full origin-left rounded-full bg-[#6366F1] transition-transform duration-300 ease-out motion-reduce:transition-none"
              style={{ transform: `scaleX(${bucket.ratio})` }}
            />
          </span>
          <span className="w-4 shrink-0 text-right text-xs font-normal tabular-nums text-zinc-400">
            {bucket.count}
          </span>
        </li>
      ))}
    </ul>
  );
}
