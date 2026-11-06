"use client";

import { useMemo, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowRight, Quote, ShieldCheck } from "lucide-react";
import ListingCard from "./listing-card";
import ParallelPlot from "./parallel-plot";
import {
  AXES,
  BRANDS,
  HERO_FEATURED_IDS,
  LISTINGS,
  STATS,
  TESTIMONIALS,
  bestListingForAxis,
  discountPct,
  savingsOf,
  type AxisId,
} from "./data";

// Accent hexes are inlined as arbitrary-value Tailwind classes / inline styles rather than a JS
// template literal, since Tailwind's scanner needs the raw class text. Full contrast workings are
// in vault/.../candidates/c.md; short version, against this page's white (#FFFFFF) surface:
//   #9F1239 (fill/text)  — 8.19:1 vs white, 2.17:1 vs dark ink (#18181B). Always paired with WHITE
//                          text when used as a fill, at any size, since it never clears 3:1 with
//                          dark ink; safe as small text directly on white (8.19:1).
//   #FDA4AF (dark tint)  — 10.44:1 vs the closing panel's #0B0B0F. Used for small accent text /
//                          icons / focus rings on that one dark surface only.
const ACCENT = "#9F1239";
const ACCENT_TINT_ON_DARK = "#FDA4AF";
const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9F1239]";
const FOCUS_ON_DARK =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FDA4AF]";
const EYEBROW = "text-[11px] font-semibold uppercase tracking-[0.28em]";
// 70 chars at 16px: 493px ÷ (0.44 × 16) ≈ 70 characters per line (see c.md for the math).
const BODY = "max-w-[493px] text-[16px] font-normal leading-[1.6] text-zinc-600";
const BODY_ON_DARK = "max-w-[493px] text-[16px] font-normal leading-[1.6] text-zinc-300";
const DISPLAY = { fontFamily: "var(--font-display-mono)" } as const;
const SKIP_LINK =
  "sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-50 focus-visible:rounded-full focus-visible:bg-white focus-visible:px-4 focus-visible:py-2 focus-visible:text-[13px] focus-visible:font-semibold focus-visible:text-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9F1239]";

const PREVIEW_FILTERS: string[] = ["All", ...BRANDS];

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
      className="select-none text-[clamp(1.8rem,3vw,2.3rem)] font-extrabold leading-[0.9] tracking-[0.08em] text-zinc-500"
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
      className={`inline-flex items-center gap-2 rounded-full bg-[#9F1239] px-6 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-[#7F0E2D] ${FOCUS}`}
    >
      {children}
      <ArrowRight className="h-4 w-4" aria-hidden="true" strokeWidth={2.5} />
    </a>
  );
}

export default function ParallelCoordinatesLanding() {
  const reduceMotion = useReducedMotion();
  const reduce = !!reduceMotion;

  // Non-zero default on purpose: "AI match" is already selected, so the plot already highlights a
  // single differentiated winner (Sony A7 III, 96%) before anyone touches anything.
  const [priorityAxis, setPriorityAxis] = useState<AxisId>("match");
  const [heroIndex, setHeroIndex] = useState(0);
  const [previewBrand, setPreviewBrand] = useState<string>("All");

  const heroListings = HERO_FEATURED_IDS.map((id) => LISTINGS.find((l) => l.id === id)!);
  const filteredListings =
    previewBrand === "All" ? LISTINGS : LISTINGS.filter((l) => l.brand === previewBrand);

  // Shared source of truth: the "value" section's chart and the closing CTA both derive from the
  // same priorityAxis state, so the closing sentence is never a stale copy of the chart's result.
  const bestListing = useMemo(() => bestListingForAxis(priorityAxis, LISTINGS), [priorityAxis]);
  const priorityAxisMeta = AXES.find((a) => a.id === priorityAxis)!;
  const bestSavings = savingsOf(bestListing);
  const bestDiscount = discountPct(bestListing);

  const heroIn = reduce
    ? {}
    : {
        initial: { opacity: 0, y: 18 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
      };

  return (
    <div className="min-h-dvh overflow-x-clip bg-white font-normal text-zinc-900 antialiased">
      <a href="#main" className={SKIP_LINK}>
        Skip to main content
      </a>

      <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/95 px-5 py-4 backdrop-blur sm:px-8 lg:px-12">
        <div className="mx-auto flex w-full max-w-[1240px] items-center justify-between gap-6">
          <span className="flex items-center gap-2 text-[15px] font-extrabold tracking-[-0.02em]">
            <span className="h-2 w-2 rounded-full bg-[#9F1239]" aria-hidden="true" />
            repick
          </span>
          <nav aria-label="Sections" className="hidden items-center gap-6 sm:flex">
            <a href="#preview" className={`px-1 py-2 text-[13px] font-normal text-zinc-600 transition-colors hover:text-zinc-900 ${FOCUS}`}>
              Listings
            </a>
            <a href="#compare" className={`px-1 py-2 text-[13px] font-normal text-zinc-600 transition-colors hover:text-zinc-900 ${FOCUS}`}>
              Compare
            </a>
            <a href="#proof" className={`px-1 py-2 text-[13px] font-normal text-zinc-600 transition-colors hover:text-zinc-900 ${FOCUS}`}>
              Reviews
            </a>
          </nav>
          <a
            href="#compare"
            className={`rounded-full bg-[#9F1239] px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#7F0E2D] ${FOCUS}`}
          >
            Compare listings
          </a>
        </div>
      </header>

      <main id="main">
        {/* ---------------------------------------------------------------- 1. HERO */}
        <section className="border-b border-zinc-200 px-5 pt-14 pb-14 sm:px-8 lg:px-12 lg:pt-20 lg:pb-20">
          <div className="mx-auto w-full max-w-[1240px]">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-start">
              <motion.div className="min-w-0 lg:col-span-7" {...heroIn}>
                <p className={EYEBROW} style={{ color: ACCENT }}>
                  FIVE AXES, ONE LISTING
                </p>
                <h1
                  className="mt-5 text-[clamp(2.1rem,6.2vw,4.4rem)] font-extrabold leading-[1.08] tracking-[-0.02em]"
                  style={DISPLAY}
                >
                  5 axes.
                  <br />
                  6 listings.
                  <br />
                  1 clear winner.
                </h1>
                <p className={`mt-6 ${BODY}`}>
                  repick plots every active listing against price, condition, AI match, seller
                  rating and distance at once, then shows you the exact figures behind whichever
                  one you decide matters most.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-5">
                  <PrimaryButton href="#compare">Compare listings live</PrimaryButton>
                  <p className="text-[13px] font-normal text-zinc-600">
                    <span className="font-semibold tabular-nums text-zinc-900">
                      {LISTINGS.length}
                    </span>{" "}
                    verified listings tracked across {AXES.length} axes this week.
                  </p>
                </div>
              </motion.div>

              {/* Proof lives inside the hero itself: real listing cards with match %, condition
                  grade, verified badge and before/after discount — not a separate section. */}
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
                          ? "border-[#9F1239] bg-[#9F1239] text-white"
                          : "border-zinc-200 bg-zinc-50 text-zinc-700 hover:border-zinc-300"
                      }`}
                    >
                      {listing.brand}
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
                    <ListingCard listing={heroListings[heroIndex]} />
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------- 2. PRODUCT PREVIEW */}
        <section id="preview" className="border-b border-zinc-200 px-5 py-20 sm:px-8 lg:px-12 lg:py-24">
          <div className="mx-auto w-full max-w-[1240px]">
            <Reveal>
              <div className="flex items-end gap-5">
                <SectionFolio n="02" />
                <div>
                  <p className={EYEBROW} style={{ color: ACCENT }}>
                    PRODUCT PREVIEW
                  </p>
                  <h2 className="mt-3 max-w-[720px] text-[clamp(1.5rem,3.6vw,2.3rem)] font-extrabold leading-[1.1] tracking-[-0.02em]" style={DISPLAY}>
                    Every listing, graded and reasoned
                  </h2>
                </div>
              </div>
              <p className={`mt-5 ${BODY}`}>
                Each grade is set by inspection, not guesswork, and every card shows exactly how
                repick&rsquo;s AI got there, reasoning included.
              </p>
            </Reveal>

            <div role="group" aria-label="Filter listings by brand" className="mt-8 flex flex-wrap gap-2">
              {PREVIEW_FILTERS.map((brand) => (
                <button
                  key={brand}
                  type="button"
                  aria-pressed={previewBrand === brand}
                  onClick={() => setPreviewBrand(brand)}
                  className={`rounded-full border px-4 py-2 text-[13px] font-semibold transition-colors ${FOCUS} ${
                    previewBrand === brand
                      ? "border-[#9F1239] bg-[#9F1239] text-white"
                      : "border-zinc-200 bg-zinc-50 text-zinc-700 hover:border-zinc-300"
                  }`}
                >
                  {brand}
                </button>
              ))}
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredListings.map((listing) => (
                <div key={listing.id} className="min-w-0">
                  <ListingCard listing={listing} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------------- 3. COMPARE */}
        <section id="compare" className="border-b border-zinc-200 px-5 py-20 sm:px-8 lg:px-12 lg:py-24">
          <div className="mx-auto w-full max-w-[1240px]">
            <Reveal>
              <div className="flex items-end gap-5">
                <SectionFolio n="03" />
                <div>
                  <p className={EYEBROW} style={{ color: ACCENT }}>
                    THE COMPARISON
                  </p>
                  <h2 className="mt-3 max-w-[720px] text-[clamp(1.5rem,3.6vw,2.3rem)] font-extrabold leading-[1.1] tracking-[-0.02em]" style={DISPLAY}>
                    Pick what matters. Watch the winner change.
                  </h2>
                </div>
              </div>
              <p className={`mt-5 ${BODY}`}>
                Every line below is a real listing running through price, condition, AI match,
                seller rating and distance at once. Choose a priority axis and repick
                re-highlights the listing that actually wins it, with the real numbers to prove
                it &mdash; not just a colored line.
              </p>
            </Reveal>

            <Reveal delay={0.08} className="mt-10">
              <ParallelPlot
                listings={LISTINGS}
                priorityAxis={priorityAxis}
                onSelectAxis={setPriorityAxis}
                reduce={reduce}
              />
            </Reveal>
          </div>
        </section>

        {/* -------------------------------------------------------------- 4. SOCIAL PROOF */}
        <section id="proof" className="border-b border-zinc-200 px-5 py-20 sm:px-8 lg:px-12 lg:py-24">
          <div className="mx-auto w-full max-w-[1240px]">
            <Reveal>
              <div className="flex items-end gap-5">
                <SectionFolio n="04" />
                <div>
                  <p className={EYEBROW} style={{ color: ACCENT }}>
                    SOCIAL PROOF
                  </p>
                  <h2 className="mt-3 max-w-[720px] text-[clamp(1.5rem,3.6vw,2.3rem)] font-extrabold leading-[1.1] tracking-[-0.02em]" style={DISPLAY}>
                    Buyers who compared before they committed
                  </h2>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.06}>
              <dl className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
                {STATS.map((stat) => (
                  <div key={stat.label} className="min-w-0">
                    <dt className="text-[13px] font-normal text-zinc-600">{stat.label}</dt>
                    <dd
                      className="mt-1 text-[clamp(1.4rem,2.8vw,1.9rem)] font-extrabold tabular-nums tracking-[-0.01em]"
                      style={DISPLAY}
                    >
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
                  className="h-full min-w-0 rounded-2xl border border-zinc-200 bg-zinc-50 p-6"
                >
                  <Quote className="h-5 w-5" aria-hidden="true" style={{ color: ACCENT }} />
                  <blockquote className="mt-3 text-[14px] leading-[1.6] text-zinc-700">
                    {t.quote}
                  </blockquote>
                  <figcaption className="mt-5 flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-[#9F1239] text-[12px] font-semibold text-white"
                    >
                      {t.initials}
                    </span>
                    <span className="min-w-0 text-[12px] text-zinc-600">
                      <span className="block truncate text-[13px] font-semibold text-zinc-900">
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
            <Reveal className="rounded-3xl border border-zinc-900 bg-[#0B0B0F] px-6 py-12 text-white sm:px-12 sm:py-16">
              <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
                <div className="min-w-0">
                  <p className={EYEBROW} style={{ color: ACCENT_TINT_ON_DARK }}>
                    READY WHEN YOU ARE
                  </p>
                  <h2
                    className="mt-3 max-w-[720px] text-[clamp(1.7rem,4.2vw,2.7rem)] font-extrabold leading-[1.08] tracking-[-0.02em]"
                    style={DISPLAY}
                  >
                    List into a market that compares fairly
                  </h2>
                  <p className={`mt-5 ${BODY_ON_DARK}`} aria-live="polite">
                    Right now, prioritizing{" "}
                    <span className="font-semibold tabular-nums text-white">
                      {priorityAxisMeta.label.toLowerCase()}
                    </span>{" "}
                    points to the{" "}
                    <span className="font-semibold text-white">{bestListing.name}</span>: $
                    {bestListing.priceNow.toLocaleString("en-US")} now, a $
                    {bestSavings.toLocaleString("en-US")} saving ({bestDiscount}%) off its $
                    {bestListing.priceOriginal.toLocaleString("en-US")} original price, at{" "}
                    <span className="font-semibold tabular-nums text-white">
                      {bestListing.match}%
                    </span>{" "}
                    AI match. Change the priority axis above and this sentence changes with it.
                  </p>
                  <p className="mt-5 flex items-center gap-2 text-[12px] font-normal text-zinc-300">
                    <ShieldCheck className="h-3.5 w-3.5 flex-none" aria-hidden="true" style={{ color: ACCENT_TINT_ON_DARK }} />
                    Every dollar figure above is backed by a verified, in-hand listing.
                  </p>
                </div>
                <div>
                  <a
                    href="#compare"
                    className={`inline-flex items-center gap-2 rounded-full bg-[#9F1239] px-6 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-[#7F0E2D] ${FOCUS_ON_DARK}`}
                  >
                    Adjust the comparison
                    <ArrowRight className="h-4 w-4" aria-hidden="true" strokeWidth={2.5} />
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-200 px-5 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto flex w-full max-w-[1240px] flex-wrap items-center justify-between gap-6">
          <span className="text-[13px] font-semibold tracking-[-0.01em]">repick</span>
          <nav aria-label="Footer" className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <a href="#preview" className={`px-1 py-2 text-[13px] font-normal text-zinc-600 transition-colors hover:text-zinc-900 ${FOCUS}`}>
              Listings
            </a>
            <a href="#compare" className={`px-1 py-2 text-[13px] font-normal text-zinc-600 transition-colors hover:text-zinc-900 ${FOCUS}`}>
              Compare
            </a>
            <a href="#proof" className={`px-1 py-2 text-[13px] font-normal text-zinc-600 transition-colors hover:text-zinc-900 ${FOCUS}`}>
              Reviews
            </a>
          </nav>
          <span className="text-[11px] font-normal tracking-[0.16em] text-zinc-500">
            VERIFIED BEFORE IT SHIPS
          </span>
        </div>
      </footer>
    </div>
  );
}
