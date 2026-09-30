"use client";

import { useMemo, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ShieldCheck } from "lucide-react";
import FlowDiagram from "./flow-diagram";
import ListingCard from "./listing-card";
import {
  CATEGORIES,
  DEFAULT_MIN_GRADE_INDEX,
  LISTINGS,
  MATCHED_COUNT,
  POOL_COUNT,
  SEARCH_QUERY,
  STATS,
  TESTIMONIALS,
  computeOutcomes,
} from "./data";
import { ACCENT, BODY, BODY_LG, DISPLAY, FOCUS_RING } from "./tokens";

const SKIP_LINK =
  "sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-50 focus-visible:rounded-full focus-visible:bg-[#111113] focus-visible:px-4 focus-visible:py-2 focus-visible:text-sm focus-visible:font-semibold focus-visible:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#BE185D]";

function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-[0.28em]" style={{ color: ACCENT }}>
      {children}
    </p>
  );
}

function PrimaryButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-base font-semibold text-white transition-transform motion-safe:hover:-translate-y-0.5 ${FOCUS_RING}`}
      style={{ backgroundColor: ACCENT }}
    >
      {children}
      <ArrowRight className="h-4 w-4" aria-hidden="true" strokeWidth={2.5} />
    </a>
  );
}

export default function FlowLanding() {
  const [minGradeIndex, setMinGradeIndex] = useState<number>(DEFAULT_MIN_GRADE_INDEX);
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("All");

  const outcomes = useMemo(() => computeOutcomes(minGradeIndex), [minGradeIndex]);

  const heroListings = [LISTINGS[0], LISTINGS[1]];
  const filteredListings = LISTINGS.filter((l) => category === "All" || l.category === category);

  return (
    <div className="min-h-screen bg-white text-[#111113]">
      <a href="#main" className={SKIP_LINK}>
        Skip to main content
      </a>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-6 py-4">
          <span className="text-lg font-extrabold tracking-[-0.02em] text-[#111113]" style={DISPLAY}>
            repick
          </span>
          <nav aria-label="Primary" className="hidden gap-8 md:flex">
            <a href="#preview" className={`text-sm font-semibold text-zinc-600 hover:text-[#111113] ${FOCUS_RING} rounded`}>
              Preview
            </a>
            <a href="#flow" className={`text-sm font-semibold text-zinc-600 hover:text-[#111113] ${FOCUS_RING} rounded`}>
              The route
            </a>
            <a href="#proof" className={`text-sm font-semibold text-zinc-600 hover:text-[#111113] ${FOCUS_RING} rounded`}>
              Reviews
            </a>
          </nav>
          <a
            href="#flow"
            className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold text-white ${FOCUS_RING}`}
            style={{ backgroundColor: ACCENT }}
          >
            Trace a search
          </a>
        </div>
      </header>

      <main id="main">
        {/* 1. Hero — headline, subhead, CTA, and real listing proof, all inside the hero grid */}
        <section className="border-b border-zinc-200">
          <div className="mx-auto max-w-[1200px] px-6 pb-16 pt-14 sm:pb-20 sm:pt-20">
            <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
              <div className="min-w-0 lg:col-span-7">
                <Eyebrow>How repick decides what you see</Eyebrow>
                <h1
                  className="mt-4 text-[clamp(2.5rem,1.7rem+3.6vw,5rem)] font-extrabold leading-[0.98] tracking-[-0.02em] text-[#111113]"
                  style={DISPLAY}
                >
                  {POOL_COUNT.toLocaleString("en-US")} listings walk in.
                  <br />
                  Your shortlist walks out.
                </h1>
                <p className={`mt-6 ${BODY_LG}`}>
                  Every repick search runs through AI intent-matching, condition grading and
                  seller verification before anything reaches you. Trace exactly where each
                  listing goes, live, below.
                </p>
                <div className="mt-8">
                  <PrimaryButton href="#flow">Trace a real search</PrimaryButton>
                </div>
                <p className="mt-6 flex items-center gap-2 text-sm text-zinc-600">
                  <ShieldCheck className="h-4 w-4 flex-none" aria-hidden="true" style={{ color: ACCENT }} strokeWidth={2} />
                  Every listing re-verified within 4 hours of going live.
                </p>
              </div>

              <div className="min-w-0 lg:col-span-5">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-600">
                  Two listings that made it through
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {heroListings.map((listing, i) => (
                    <ListingCard key={listing.id} listing={listing} heading={false} compact preload={i === 0} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Product preview */}
        <section id="preview" className="border-b border-zinc-200 bg-[#FAFAFA]">
          <div className="mx-auto max-w-[1200px] px-6 py-20">
            <Reveal>
              <Eyebrow>Product preview</Eyebrow>
              <h2 className="mt-3 text-[clamp(1.9rem,1.5rem+1.6vw,2.75rem)] font-extrabold tracking-[-0.02em] text-[#111113]">
                Every listing carries its own reasoning.
              </h2>
              <p className={`mt-4 ${BODY}`}>
                AI match confidence, condition grade, seller verification and the discount
                against retail sit right on the card — never hidden behind a click.
              </p>
            </Reveal>

            <Reveal className="mt-8 flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-pressed={category === c}
                  onClick={() => setCategory(c)}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${FOCUS_RING} ${
                    category === c
                      ? "border-transparent text-white"
                      : "border-zinc-300 text-zinc-600 hover:border-zinc-400 hover:text-[#111113]"
                  }`}
                  style={category === c ? { backgroundColor: ACCENT } : undefined}
                >
                  {c}
                </button>
              ))}
            </Reveal>

            <Reveal className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredListings.map((listing) => (
                <div key={listing.id} className="min-w-0">
                  <ListingCard listing={listing} />
                </div>
              ))}
            </Reveal>
          </div>
        </section>

        {/* 3. Value — the flow diagram itself, the manipulation, and the live stat */}
        <section id="flow" className="border-b border-zinc-200">
          <div className="mx-auto max-w-[1200px] px-6 py-20 sm:py-24">
            <Reveal>
              <Eyebrow>The route</Eyebrow>
              <h2 className="mt-3 text-[clamp(1.9rem,1.5rem+1.6vw,2.75rem)] font-extrabold tracking-[-0.02em] text-[#111113]">
                Watch your search get filtered, live.
              </h2>
              <p className={`mt-4 ${BODY}`}>
                This is one real search: &ldquo;{SEARCH_QUERY}&rdquo;, {POOL_COUNT.toLocaleString("en-US")}{" "}
                listings scanned, {MATCHED_COUNT} that clear AI intent-matching. Drag the slider
                and every count below recomputes instantly.
              </p>
            </Reveal>

            <Reveal className="mt-10">
              <FlowDiagram minGradeIndex={minGradeIndex} onChange={setMinGradeIndex} outcomes={outcomes} />
            </Reveal>

            <Reveal className="mt-10 flex flex-wrap items-end justify-between gap-6 border-t border-zinc-200 pt-8">
              <div>
                <Eyebrow>Your shortlist, live</Eyebrow>
                <p
                  className="mt-2 text-[clamp(2.5rem,2rem+2vw,4rem)] font-extrabold leading-none tabular-nums text-[#111113]"
                  style={DISPLAY}
                >
                  {outcomes.recommended.count}
                </p>
                <p className="mt-1 text-sm text-zinc-600">
                  listings recommended at {outcomes.minGrade} or better
                </p>
              </div>
              <p className={BODY}>
                Recomputed from the same {MATCHED_COUNT} AI-matched candidates every time the
                grade filter moves — the same number quoted at the bottom of this page.
              </p>
            </Reveal>
          </div>
        </section>

        {/* 4. Social proof */}
        <section id="proof" className="border-b border-zinc-200 bg-[#FAFAFA]">
          <div className="mx-auto max-w-[1200px] px-6 py-20">
            <Reveal>
              <Eyebrow>Social proof</Eyebrow>
              <h2 className="mt-3 text-[clamp(1.9rem,1.5rem+1.6vw,2.75rem)] font-extrabold tracking-[-0.02em] text-[#111113]">
                Buyers trust the route, not just the result.
              </h2>
            </Reveal>

            <Reveal className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
              {STATS.map((stat) => (
                <div key={stat.label} className="min-w-0 rounded-2xl border border-zinc-200 bg-white p-5">
                  <p className="text-2xl font-extrabold tabular-nums text-[#111113]" style={DISPLAY}>
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-zinc-600">{stat.label}</p>
                </div>
              ))}
            </Reveal>

            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
              {TESTIMONIALS.map((t) => (
                <Reveal key={t.name} className="min-w-0">
                  <figure className="flex h-full flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-6">
                    <blockquote className="text-sm leading-[1.6] text-[#111113]">
                      &ldquo;{t.quote}&rdquo;
                    </blockquote>
                    <figcaption className="mt-6 flex items-center gap-3">
                      <span
                        aria-hidden="true"
                        className="flex h-9 w-9 flex-none items-center justify-center rounded-full text-xs font-semibold text-white"
                        style={{ backgroundColor: ACCENT }}
                      >
                        {t.initials}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold text-[#111113]">{t.name}</span>
                        <span className="block truncate text-xs text-zinc-600">{t.role}</span>
                      </span>
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Closing CTA — quotes the same live recommended-count/avg-match/avg-discount, not static numbers */}
        <section>
          <div className="mx-auto max-w-[1200px] px-6 py-20 sm:py-28">
            <Reveal className="flex flex-col items-start gap-8 rounded-3xl border border-zinc-200 bg-[#FAFAFA] p-8 sm:p-12 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0 lg:max-w-[640px]">
                <Eyebrow>Your shortlist, quoted live</Eyebrow>
                <h2 className="mt-3 text-[clamp(1.9rem,1.5rem+1.6vw,2.75rem)] font-extrabold tracking-[-0.02em] text-[#111113]">
                  <span className="tabular-nums" style={{ color: ACCENT }}>
                    {outcomes.recommended.count}
                  </span>{" "}
                  listings clear your {outcomes.minGrade}-or-better bar right now.
                </h2>
                <p className={`mt-4 ${BODY}`}>
                  Averaging {outcomes.recommended.avgMatch}% match confidence and{" "}
                  {outcomes.recommended.avgDiscount}% off retail — the exact split you left the
                  slider on above, recomputed from the same {MATCHED_COUNT} AI-matched candidates.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <PrimaryButton href="#flow">Create your free account</PrimaryButton>
                  <span className="inline-flex items-center gap-2 text-xs text-zinc-600">
                    <ShieldCheck className="h-4 w-4" aria-hidden="true" style={{ color: ACCENT }} strokeWidth={2} />
                    No card required to see your shortlist
                  </span>
                </div>
              </div>

              <div className="flex flex-none flex-col items-center gap-2 rounded-2xl border border-zinc-200 bg-white px-8 py-6">
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-600">
                  Held back for now
                </span>
                <span className="text-4xl font-extrabold tabular-nums text-[#111113]" style={DISPLAY}>
                  {outcomes.heldBack.count}
                </span>
                <span className="text-xs text-zinc-600">below {outcomes.minGrade} minimum</span>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-200 px-6 py-8">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-4">
          <span className="text-sm font-semibold text-[#111113]" style={DISPLAY}>
            repick
          </span>
          <p className="text-xs text-zinc-600">
            Search intent, AI matching, condition grading and seller verification — traced, not
            just trusted.
          </p>
        </div>
      </footer>
    </div>
  );
}
