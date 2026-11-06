"use client";

import { useMemo, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowRight, Quote, ShieldCheck } from "lucide-react";
import DemandMap from "./demand-map";
import ListingCard from "./listing-card";
import {
  CATEGORY_POOL,
  DEFAULT_SELECTED,
  HERO_FEATURED_IDS,
  LISTINGS,
  MIN_SELECTED,
  STATS,
  TESTIMONIALS,
  TOTAL_POOL_VALUE,
  formatDemand,
  pct,
  summarizeSelection,
  type CategoryId,
} from "./data";

// Accent hexes are inlined as arbitrary-value Tailwind classes / inline styles rather than a JS
// template literal, since Tailwind's scanner needs the raw class text. Full contrast workings are
// in vault/.../candidates/b.md — the short version, all against the page background #0B0B0F:
//   #1E7A56 (fill)  — 3.72:1. Fine for fills, borders and large/bold text — not small body text.
//   #7ED9AA (tint)  — 11.59:1. Used for every small accent text, icon and focus ring below.
//   white on #1E7A56 — 5.29:1. Clears small-text AA, so buttons/active chips use white, not ink.
//   #6B6B78 (folio) — 3.74:1. Large (>=2rem), bold, aria-hidden section numerals only.
const ACCENT_TINT = "#7ED9AA";
const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7ED9AA]";
const EYEBROW = "text-[11px] font-semibold uppercase tracking-[0.28em]";
const BODY = "max-w-[493px] text-[16px] font-normal leading-[1.6] text-zinc-400";
const DISPLAY = { fontFamily: "var(--font-display-wide)" } as const;
const SKIP_LINK =
  "sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-50 focus-visible:rounded-full focus-visible:bg-white focus-visible:px-4 focus-visible:py-2 focus-visible:text-[13px] focus-visible:font-semibold focus-visible:text-[#0B0B0F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7ED9AA]";

const PREVIEW_FILTERS: { id: CategoryId | "all"; label: string }[] = [
  { id: "all", label: "All" },
  ...CATEGORY_POOL.map((c) => ({ id: c.id, label: c.label })),
];

const revealVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={revealVariants}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function SectionFolio({ n }: { n: string }) {
  return (
    <span
      aria-hidden="true"
      className="select-none text-[clamp(2rem,3.2vw,2.5rem)] font-extrabold leading-[0.9] tracking-[0.1em] text-[#6B6B78]"
      style={DISPLAY}
    >
      {n}
    </span>
  );
}

function PrimaryButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className={`inline-flex items-center gap-2 rounded-full bg-[#1E7A56] px-6 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-[#175E43] ${FOCUS}`}
    >
      {children}
      <ArrowRight className="h-4 w-4" aria-hidden="true" strokeWidth={2.5} />
    </a>
  );
}

export default function DemandMapLanding() {
  const reduceMotion = useReducedMotion();
  const reduce = !!reduceMotion;

  const [selected, setSelected] = useState<Set<CategoryId>>(() => new Set(DEFAULT_SELECTED));
  const [heroIndex, setHeroIndex] = useState(0);
  const [previewFilter, setPreviewFilter] = useState<CategoryId | "all">("all");

  const summary = useMemo(() => summarizeSelection(selected), [selected]);

  function toggleCategory(id: CategoryId) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        if (next.size <= MIN_SELECTED) return prev;
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  const heroListings = HERO_FEATURED_IDS.map((id) => LISTINGS.find((l) => l.id === id)!);
  const filteredListings =
    previewFilter === "all" ? LISTINGS : LISTINGS.filter((l) => l.category === previewFilter);

  const heroIn = reduce
    ? {}
    : {
        initial: { opacity: 0, y: 18 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
      };

  return (
    <div className="min-h-dvh overflow-x-clip bg-[#0B0B0F] font-normal text-white antialiased">
      <a href="#main" className={SKIP_LINK}>
        Skip to main content
      </a>

      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0B0B0F]/95 px-5 py-4 backdrop-blur sm:px-8 lg:px-12">
        <div className="mx-auto flex w-full max-w-[1240px] items-center justify-between gap-6">
          <span className="flex items-center gap-2 text-[15px] font-extrabold tracking-[-0.02em]">
            <span className="h-2 w-2 rounded-full bg-[#1E7A56]" aria-hidden="true" />
            repick
          </span>
          <nav aria-label="Sections" className="hidden items-center gap-6 sm:flex">
            <a href="#listings" className={`px-1 py-2 text-[13px] font-normal text-zinc-400 transition-colors hover:text-white ${FOCUS}`}>
              Browse
            </a>
            <a href="#demand-map" className={`px-1 py-2 text-[13px] font-normal text-zinc-400 transition-colors hover:text-white ${FOCUS}`}>
              Demand map
            </a>
            <a href="#proof" className={`px-1 py-2 text-[13px] font-normal text-zinc-400 transition-colors hover:text-white ${FOCUS}`}>
              Reviews
            </a>
          </nav>
          <a
            href="#demand-map"
            className={`rounded-full bg-[#1E7A56] px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#175E43] ${FOCUS}`}
          >
            List an item
          </a>
        </div>
      </header>

      <main id="main">
        {/* ---------------------------------------------------------------- 1. HERO */}
        <section className="border-b border-white/10 px-5 pt-14 pb-14 sm:px-8 lg:px-12 lg:pt-20 lg:pb-20">
          <div className="mx-auto w-full max-w-[1240px]">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-start">
              <motion.div className="min-w-0 lg:col-span-7" {...heroIn}>
                <p className={EYEBROW} style={{ color: ACCENT_TINT }}>
                  LIVE DEMAND MAP
                </p>
                <h1
                  className="mt-5 text-[clamp(2.6rem,6vw,4.6rem)] font-extrabold leading-[0.98] tracking-[-0.02em]"
                  style={DISPLAY}
                >
                  Buyer demand
                  <br />
                  isn&rsquo;t spread evenly.
                </h1>
                <p className={`mt-6 ${BODY}`}>
                  repick&rsquo;s AI verifies every listing&rsquo;s condition, authenticity and fair
                  price, then shows you exactly which categories buyers are chasing this week,
                  before you decide what to list next.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-5">
                  <PrimaryButton href="#demand-map">Build your demand map</PrimaryButton>
                  <p className="text-[13px] font-normal text-zinc-400">
                    <span className="font-semibold tabular-nums text-white">
                      {formatDemand(TOTAL_POOL_VALUE)}
                    </span>{" "}
                    in active demand tracked this week across {CATEGORY_POOL.length} categories.
                  </p>
                </div>
              </motion.div>

              {/* Proof lives inside the hero itself: real listing cards with match %, grade,
                  verified badge and discount — not a separate section below the fold. */}
              <motion.div className="min-w-0 lg:col-span-5" {...heroIn}>
                <div role="group" aria-label="Featured listing" className="mb-3 inline-flex gap-2">
                  {heroListings.map((listing, i) => (
                    <button
                      key={listing.id}
                      type="button"
                      aria-pressed={heroIndex === i}
                      onClick={() => setHeroIndex(i)}
                      className={`rounded-full border px-3 py-1.5 text-[12px] font-semibold transition-colors ${FOCUS} ${
                        heroIndex === i
                          ? "border-[#1E7A56] bg-[#1E7A56] text-white"
                          : "border-white/15 bg-white/[0.02] text-zinc-300 hover:border-white/30"
                      }`}
                    >
                      {listing.categoryLabel}
                    </button>
                  ))}
                </div>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={heroListings[heroIndex].id}
                    initial={reduce ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <ListingCard listing={heroListings[heroIndex]} heading={false} />
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------- 2. PRODUCT PREVIEW */}
        <section id="listings" className="border-b border-white/10 px-5 py-20 sm:px-8 lg:px-12 lg:py-24">
          <div className="mx-auto w-full max-w-[1240px]">
            <Reveal>
              <div className="flex items-end gap-5">
                <SectionFolio n="02" />
                <div>
                  <p className={EYEBROW} style={{ color: ACCENT_TINT }}>
                    PRODUCT PREVIEW
                  </p>
                  <h2 className="mt-3 max-w-[720px] text-[clamp(1.6rem,4vw,2.5rem)] font-extrabold leading-[1.08] tracking-[-0.02em]" style={DISPLAY}>
                    Every listing, fully verified
                  </h2>
                </div>
              </div>
              <p className={`mt-5 ${BODY}`}>
                Each grade is set by inspection, not guesswork, and every card shows exactly how
                repick&rsquo;s AI got there — reasoning included.
              </p>
            </Reveal>

            <div role="group" aria-label="Filter listings by category" className="mt-8 flex flex-wrap gap-2">
              {PREVIEW_FILTERS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  aria-pressed={previewFilter === f.id}
                  onClick={() => setPreviewFilter(f.id)}
                  className={`rounded-full border px-4 py-2 text-[13px] font-semibold transition-colors ${FOCUS} ${
                    previewFilter === f.id
                      ? "border-[#1E7A56] bg-[#1E7A56] text-white"
                      : "border-white/15 bg-white/[0.02] text-white hover:border-white/30"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------- 3. DEMAND MAP */}
        <section id="demand-map" className="border-b border-white/10 px-5 py-20 sm:px-8 lg:px-12 lg:py-24">
          <div className="mx-auto w-full max-w-[1240px]">
            <Reveal>
              <div className="flex items-end gap-5">
                <SectionFolio n="03" />
                <div>
                  <p className={EYEBROW} style={{ color: ACCENT_TINT }}>
                    THE DEMAND MAP
                  </p>
                  <h2 className="mt-3 max-w-[720px] text-[clamp(1.6rem,4vw,2.5rem)] font-extrabold leading-[1.08] tracking-[-0.02em]" style={DISPLAY}>
                    Choose your categories. Watch the map redraw itself.
                  </h2>
                </div>
              </div>
              <p className={`mt-5 ${BODY}`}>
                Every tile&rsquo;s area is a share of active buyer demand — add or remove a
                category below and the whole map re-subdivides around only what you&rsquo;ve
                selected, always filling 100% of the space.
              </p>
            </Reveal>

            <Reveal delay={0.08} className="mt-10">
              <DemandMap selected={selected} onToggle={toggleCategory} reduce={reduce} />
            </Reveal>
          </div>
        </section>

        {/* -------------------------------------------------------------- 4. SOCIAL PROOF */}
        <section id="proof" className="border-b border-white/10 px-5 py-20 sm:px-8 lg:px-12 lg:py-24">
          <div className="mx-auto w-full max-w-[1240px]">
            <Reveal>
              <div className="flex items-end gap-5">
                <SectionFolio n="04" />
                <div>
                  <p className={EYEBROW} style={{ color: ACCENT_TINT }}>
                    SOCIAL PROOF
                  </p>
                  <h2 className="mt-3 max-w-[720px] text-[clamp(1.6rem,4vw,2.5rem)] font-extrabold leading-[1.08] tracking-[-0.02em]" style={DISPLAY}>
                    Sellers who list where the demand actually is
                  </h2>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.06}>
              <dl className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
                {STATS.map((stat) => (
                  <div key={stat.label} className="min-w-0">
                    <dt className="text-[13px] font-normal text-zinc-400">{stat.label}</dt>
                    <dd className="mt-1 text-[clamp(1.5rem,3vw,2rem)] font-extrabold tabular-nums tracking-[-0.01em]">
                      {stat.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
              {TESTIMONIALS.map((t, i) => (
                <motion.figure
                  key={t.name}
                  initial={reduce ? false : { opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.45, delay: reduce ? 0 : i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                  className="h-full min-w-0 rounded-2xl border border-white/10 bg-white/[0.03] p-6"
                >
                  <Quote className="h-5 w-5" aria-hidden="true" style={{ color: ACCENT_TINT }} />
                  <blockquote className="mt-3 text-[14px] leading-[1.6] text-zinc-300">
                    {t.quote}
                  </blockquote>
                  <figcaption className="mt-5 flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-[#1E7A56] text-[12px] font-semibold text-white"
                    >
                      {t.initials}
                    </span>
                    <span className="min-w-0 text-[12px] text-zinc-400">
                      <span className="block truncate text-[13px] font-semibold text-white">
                        {t.name}
                      </span>
                      <span className="block truncate">{t.role}</span>
                    </span>
                  </figcaption>
                </motion.figure>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------------- 5. CLOSING CTA */}
        <section id="start" className="px-5 py-20 sm:px-8 lg:px-12 lg:py-24">
          <div className="mx-auto w-full max-w-[1240px]">
            <Reveal className="rounded-3xl border border-white/10 bg-white/[0.03] px-6 py-12 sm:px-12 sm:py-16">
              <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
                <div className="min-w-0">
                  <p className={EYEBROW} style={{ color: ACCENT_TINT }}>
                    READY WHEN YOU ARE
                  </p>
                  <h2 className="mt-3 max-w-[720px] text-[clamp(1.8rem,4.6vw,3rem)] font-extrabold leading-[1.05] tracking-[-0.02em]" style={DISPLAY}>
                    List into demand you can already see
                  </h2>
                  <p className={`mt-5 ${BODY}`} aria-live="polite">
                    Right now your demand map covers{" "}
                    <span className="font-semibold tabular-nums text-white">
                      {summary.items.length}
                    </span>{" "}
                    of {CATEGORY_POOL.length} categories, worth{" "}
                    <span className="font-semibold tabular-nums text-white">
                      {formatDemand(summary.total)}
                    </span>{" "}
                    in active buyer demand
                    {summary.top && (
                      <>
                        {" "}
                        — led by{" "}
                        <span className="font-semibold text-white">{summary.top.label}</span> at{" "}
                        <span className="font-semibold tabular-nums text-white">
                          {pct(summary.topShare)}
                        </span>{" "}
                        of what you&rsquo;ve selected
                      </>
                    )}
                    . This isn&rsquo;t fixed copy — build the map above and these numbers move
                    with you.
                  </p>
                  <p className="mt-5 flex items-center gap-2 text-[12px] font-normal text-zinc-400">
                    <ShieldCheck className="h-3.5 w-3.5 flex-none" aria-hidden="true" style={{ color: ACCENT_TINT }} />
                    Every dollar figure above is backed by verified, in-hand listings.
                  </p>
                </div>
                <div>
                  <PrimaryButton href="#demand-map">Adjust your demand map</PrimaryButton>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 px-5 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto flex w-full max-w-[1240px] flex-wrap items-center justify-between gap-6">
          <span className="text-[13px] font-semibold tracking-[-0.01em]">repick</span>
          <nav aria-label="Footer" className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <a href="#listings" className={`px-1 py-2 text-[13px] font-normal text-zinc-400 transition-colors hover:text-white ${FOCUS}`}>
              Browse
            </a>
            <a href="#demand-map" className={`px-1 py-2 text-[13px] font-normal text-zinc-400 transition-colors hover:text-white ${FOCUS}`}>
              Demand map
            </a>
            <a href="#proof" className={`px-1 py-2 text-[13px] font-normal text-zinc-400 transition-colors hover:text-white ${FOCUS}`}>
              Reviews
            </a>
          </nav>
          <span className="text-[11px] font-normal tracking-[0.16em] text-zinc-400">
            VERIFIED BEFORE IT SHIPS
          </span>
        </div>
      </footer>
    </div>
  );
}
