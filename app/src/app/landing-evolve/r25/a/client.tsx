"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion, type Variants } from "framer-motion";
import { ArrowRight, ShieldCheck } from "lucide-react";
import PriceMatrix from "./price-matrix";
import ListingCard from "./listing-card";
import {
  GRADES,
  AGE_BRACKETS,
  PRICE_MATRIX,
  PERCENTILE_MATRIX,
  REFERENCE_ITEM,
  LISTINGS,
  CATEGORIES,
  TESTIMONIALS,
  STATS,
  DEFAULT_GRADE_INDEX,
  DEFAULT_AGE_INDEX,
} from "./data";

const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c2410c]";
const BODY_LG = "max-w-[540px] text-[18px] leading-[1.6] text-[#57534e]";
const BODY = "max-w-[460px] text-base leading-[1.6] text-[#57534e]";

const revealVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

function Reveal({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={revealVariants}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

function PrimaryButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className={`inline-flex items-center gap-2 rounded-full bg-[#ea580c] px-6 py-3 text-base font-semibold text-[#1c1917] transition-transform hover:-translate-y-0.5 ${FOCUS_RING}`}
    >
      {children}
      <ArrowRight className="h-4 w-4" aria-hidden="true" strokeWidth={2.5} />
    </a>
  );
}

export default function FairPriceLanding() {
  const [gradeIndex, setGradeIndex] = useState(DEFAULT_GRADE_INDEX);
  const [ageIndex, setAgeIndex] = useState(DEFAULT_AGE_INDEX);
  const [heroIndex, setHeroIndex] = useState(0);
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("All");
  const reduceMotion = useReducedMotion();

  const retention = PRICE_MATRIX[gradeIndex][ageIndex];
  const percentile = PERCENTILE_MATRIX[gradeIndex][ageIndex];
  const price = Math.round((REFERENCE_ITEM.msrp * retention) / 100);

  const filteredListings = LISTINGS.filter(
    (l) => category === "All" || l.category === category
  );

  const heroListings = [LISTINGS[0], LISTINGS[1]];

  return (
    <div className="min-h-screen bg-white text-[#1c1917]">
      <a
        href="#main"
        className={`sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-[#1c1917] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white ${FOCUS_RING}`}
      >
        Skip to main content
      </a>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-[#e7e5e4] bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-6 py-4">
          <span className="text-lg font-extrabold tracking-[-0.02em] text-[#1c1917]">
            repick
          </span>
          <nav aria-label="Primary" className="hidden gap-8 md:flex">
            <a
              href="#listings"
              className={`text-sm font-semibold text-[#57534e] hover:text-[#1c1917] ${FOCUS_RING} rounded`}
            >
              Browse
            </a>
            <a
              href="#fair-price-matrix"
              className={`text-sm font-semibold text-[#57534e] hover:text-[#1c1917] ${FOCUS_RING} rounded`}
            >
              Fair price matrix
            </a>
            <a
              href="#proof"
              className={`text-sm font-semibold text-[#57534e] hover:text-[#1c1917] ${FOCUS_RING} rounded`}
            >
              Reviews
            </a>
          </nav>
          <a
            href="#fair-price-matrix"
            className={`inline-flex items-center rounded-full bg-[#ea580c] px-4 py-2 text-sm font-semibold text-[#1c1917] ${FOCUS_RING}`}
          >
            Get your price
          </a>
        </div>
      </header>

      <main id="main">
        {/* 1. Hero */}
        <section className="border-b border-[#e7e5e4] bg-white">
          <div className="mx-auto max-w-[1200px] px-6 pb-20 pt-16 sm:pb-24 sm:pt-20">
            <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-7">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#c2410c]">
                  Fair price matrix
                </p>
                <h1 className="mt-4 text-[clamp(2.75rem,2.1rem+3.2vw,5.25rem)] font-extrabold leading-[0.98] tracking-[-0.02em] text-[#1c1917]">
                  One matrix.
                  <br />
                  Twenty honest prices.
                </h1>
                <p className={`mt-6 ${BODY_LG}`}>
                  repick prices used camera gear against a fixed grid of
                  condition grade and years since release, then verifies
                  every listing against it. The number you see is the number
                  you get.
                </p>
                <div className="mt-8">
                  <PrimaryButton href="#fair-price-matrix">
                    Get your fair price
                  </PrimaryButton>
                </div>
                <p className="mt-6 text-sm text-[#57534e]">
                  <span className="font-semibold tabular-nums text-[#1c1917]">
                    38,200+
                  </span>{" "}
                  items priced against the matrix this year.
                </p>
              </div>

              <div className="lg:col-span-5">
                <div
                  role="group"
                  aria-label="Preview listing"
                  className="mb-3 inline-flex gap-2"
                >
                  {heroListings.map((listing, i) => (
                    <button
                      key={listing.id}
                      type="button"
                      aria-pressed={heroIndex === i}
                      onClick={() => setHeroIndex(i)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${FOCUS_RING} ${
                        heroIndex === i
                          ? "border-[#1c1917] bg-[#1c1917] text-white"
                          : "border-[#d6d3d1] bg-white text-[#57534e] hover:border-[#78716c]"
                      }`}
                    >
                      {listing.name}
                    </button>
                  ))}
                </div>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={heroListings[heroIndex].id}
                    initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <ListingCard listing={heroListings[heroIndex]} heading={false} />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Product preview */}
        <section id="listings" className="border-b border-[#e7e5e4] bg-[#fafaf9]">
          <div className="mx-auto max-w-[1200px] px-6 py-20">
            <Reveal>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#c2410c]">
                Product preview
              </p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.02em] text-[#1c1917] sm:text-4xl">
                Every listing, fully verified
              </h2>
              <p className={`mt-4 ${BODY}`}>
                Each grade is set by inspection, not guesswork, and every
                card shows exactly how repick got there.
              </p>
            </Reveal>

            <div
              role="group"
              aria-label="Filter listings by category"
              className="mt-8 flex flex-wrap gap-2"
            >
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  aria-pressed={category === cat}
                  onClick={() => setCategory(cat)}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${FOCUS_RING} ${
                    category === cat
                      ? "border-[#1c1917] bg-[#1c1917] text-white"
                      : "border-[#d6d3d1] bg-white text-[#1c1917] hover:border-[#78716c]"
                  }`}
                >
                  {cat}
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

        {/* 3. Value section — the Fair Price Matrix */}
        <section
          id="fair-price-matrix"
          className="overflow-x-clip border-b border-[#e7e5e4] bg-white [contain:layout]"
        >
          <div className="mx-auto max-w-[1200px] px-6 py-20">
            <Reveal>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#c2410c]">
                The fair price matrix
              </p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.02em] text-[#1c1917] sm:text-4xl">
                See the price before you list
              </h2>
              <p className={`mt-4 ${BODY}`}>
                Set a condition grade and an age bracket below. The matching
                cell updates instantly with a price estimate and how it
                compares to the market.
              </p>
            </Reveal>

            <div className="mt-10">
              <PriceMatrix
                gradeIndex={gradeIndex}
                ageIndex={ageIndex}
                onGradeChange={setGradeIndex}
                onAgeChange={setAgeIndex}
              />
            </div>
          </div>
        </section>

        {/* 4. Social proof */}
        <section id="proof" className="border-b border-[#e7e5e4] bg-[#fafaf9]">
          <div className="mx-auto max-w-[1200px] px-6 py-20">
            <Reveal>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#c2410c]">
                Social proof
              </p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.02em] text-[#1c1917] sm:text-4xl">
                Trusted by sellers who know their gear
              </h2>
            </Reveal>

            <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
              {STATS.map((stat) => (
                <div key={stat.label}>
                  <p className="text-3xl font-extrabold tabular-nums tracking-[0.12em] text-[#1c1917]">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-sm text-[#57534e]">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
              {TESTIMONIALS.map((t) => (
                <figure
                  key={t.name}
                  className="rounded-2xl border border-[#e7e5e4] bg-white p-6"
                >
                  <blockquote className="text-sm leading-[1.6] text-[#1c1917]">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-4 flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-[#1c1917] text-xs font-semibold text-white"
                    >
                      {t.initials}
                    </span>
                    <span className="text-xs text-[#57534e]">
                      <span className="block font-semibold text-[#1c1917]">
                        {t.name}
                      </span>
                      {t.role}
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Closing CTA */}
        <section className="bg-white">
          <div className="mx-auto max-w-[1200px] px-6 py-20">
            <Reveal
              className="rounded-3xl border border-[#e7e5e4] bg-[#fafaf9] px-8 py-14 sm:px-14"
            >
              <div className="grid gap-10 sm:grid-cols-[1fr_auto] sm:items-center">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#c2410c]">
                    Ready when you are
                  </p>
                  <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.02em] text-[#1c1917] sm:text-4xl">
                    Get paid what your gear is actually worth
                  </h2>
                  <p className={`mt-4 ${BODY}`} aria-live="polite">
                    A{" "}
                    <span className="font-semibold text-[#1c1917]">
                      {GRADES[gradeIndex].label}
                    </span>
                    ,{" "}
                    <span className="font-semibold text-[#1c1917]">
                      {AGE_BRACKETS[ageIndex].short}
                    </span>{" "}
                    item like this estimates at{" "}
                    <span className="font-semibold tabular-nums text-[#1c1917]">
                      ${price.toLocaleString("en-US")}
                    </span>{" "}
                    &mdash; ahead of{" "}
                    <span className="font-semibold tabular-nums text-[#1c1917]">
                      {percentile}%
                    </span>{" "}
                    of comparable listings.
                  </p>
                  <p className="mt-4 flex items-center gap-2 text-xs text-[#57534e]">
                    <ShieldCheck
                      className="h-3.5 w-3.5 flex-none text-[#c2410c]"
                      aria-hidden="true"
                      strokeWidth={2}
                    />
                    Every estimate is backed by an in-hand condition check.
                  </p>
                </div>
                <div>
                  <PrimaryButton href="#fair-price-matrix">
                    Start your fair price listing
                  </PrimaryButton>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="bg-white">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-2 px-6 py-8 text-xs text-[#57534e] sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; 2026 repick. Estimates are informational, not a binding offer.</p>
          <p>Fair Price Matrix data updated quarterly.</p>
        </div>
      </footer>
    </div>
  );
}
