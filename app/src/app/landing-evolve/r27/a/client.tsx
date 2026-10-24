"use client";

import { useMemo, useState, type ReactNode } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import SignalChart, { MiniSignalGlyph } from "./signal-chart";
import ListingCard from "./listing-card";
import {
  CATEGORIES,
  DEFAULT_WEIGHTS,
  LISTINGS,
  PERSPECTIVE_COPY,
  RAW_SCORES,
  REFERENCE_LISTING_ID,
  STATS,
  TESTIMONIALS,
  computeSignalState,
  renormalizeWeights,
  type Perspective,
} from "./data";
import { ACCENT, ACCENT_TINT, BODY, BODY_LG, DISPLAY, FOCUS_RING } from "./tokens";

const SKIP_LINK =
  "sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-50 focus-visible:rounded-full focus-visible:bg-white focus-visible:px-4 focus-visible:py-2 focus-visible:text-sm focus-visible:font-semibold focus-visible:text-[#0B0B0F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B6A6F0]";

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
    <p
      className="text-[11px] font-semibold uppercase tracking-[0.28em]"
      style={{ color: ACCENT_TINT }}
    >
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

export default function SignalMapLanding() {
  const [weights, setWeights] = useState<number[]>(DEFAULT_WEIGHTS);
  const [perspective, setPerspective] = useState<Perspective>("buying");
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("All");

  const state = useMemo(() => computeSignalState(weights, RAW_SCORES), [weights]);
  const referenceListing = LISTINGS.find((l) => l.id === REFERENCE_LISTING_ID)!;
  const heroListings = [LISTINGS[0], LISTINGS[1]];
  const filteredListings = LISTINGS.filter(
    (l) => category === "All" || l.category === category
  );
  const copy = PERSPECTIVE_COPY[perspective];

  function handleWeightChange(index: number, value: number) {
    setWeights((prev) => renormalizeWeights(prev, index, value));
  }
  function handleReset() {
    setWeights(DEFAULT_WEIGHTS);
  }

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white">
      <a href="#main" className={SKIP_LINK}>
        Skip to main content
      </a>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0B0B0F]/90 backdrop-blur">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-6 py-4">
          <span className="text-lg font-extrabold tracking-[-0.02em] text-white" style={DISPLAY}>
            repick
          </span>
          <nav aria-label="Primary" className="hidden gap-8 md:flex">
            <a href="#preview" className={`text-sm font-semibold text-[#A1A1AA] hover:text-white ${FOCUS_RING} rounded`}>
              Browse
            </a>
            <a href="#signal" className={`text-sm font-semibold text-[#A1A1AA] hover:text-white ${FOCUS_RING} rounded`}>
              Signal map
            </a>
            <a href="#proof" className={`text-sm font-semibold text-[#A1A1AA] hover:text-white ${FOCUS_RING} rounded`}>
              Reviews
            </a>
          </nav>
          <a
            href="#signal"
            className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold text-white ${FOCUS_RING}`}
            style={{ backgroundColor: ACCENT }}
          >
            Get your signal
          </a>
        </div>
      </header>

      <main id="main">
        {/* 1. Hero — headline, subhead, CTA, and real listing proof, all inside the hero grid */}
        <section className="border-b border-white/10">
          <div className="mx-auto max-w-[1200px] px-6 pb-20 pt-16 sm:pb-24 sm:pt-20">
            <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
              <div className="min-w-0 lg:col-span-7">
                <div
                  role="group"
                  aria-label="View as"
                  className="mb-6 inline-flex rounded-full border border-white/15 p-1"
                >
                  {(["buying", "selling"] as Perspective[]).map((p) => (
                    <button
                      key={p}
                      type="button"
                      aria-pressed={perspective === p}
                      onClick={() => setPerspective(p)}
                      className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${FOCUS_RING} ${
                        perspective === p ? "text-white" : "text-[#A1A1AA] hover:text-white"
                      }`}
                      style={perspective === p ? { backgroundColor: ACCENT } : undefined}
                    >
                      {PERSPECTIVE_COPY[p].eyebrow}
                    </button>
                  ))}
                </div>

                <h1
                  className="text-[clamp(2.5rem,1.7rem+3.6vw,5rem)] font-extrabold leading-[0.98] tracking-[-0.02em] text-white"
                  style={DISPLAY}
                >
                  {copy.heading[0]}
                  <br />
                  {copy.heading[1]}
                </h1>
                <p className={`mt-6 ${BODY_LG}`}>{copy.sub}</p>
                <div className="mt-8">
                  <PrimaryButton href="#signal">{copy.cta}</PrimaryButton>
                </div>
                <p className="mt-6 text-sm text-[#A1A1AA]">
                  <span className="font-semibold tabular-nums text-white">{STATS[0].value}</span>{" "}
                  {STATS[0].label}.
                </p>
              </div>

              <div className="min-w-0 lg:col-span-5">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#A1A1AA]">
                  Live on repick right now
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {heroListings.map((listing, i) => (
                    <ListingCard
                      key={listing.id}
                      listing={listing}
                      heading={false}
                      compact
                      preload={i === 0}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Product preview */}
        <section id="preview" className="border-b border-white/10 bg-[#0E0E13]">
          <div className="mx-auto max-w-[1200px] px-6 py-20">
            <Reveal>
              <Eyebrow>Product preview</Eyebrow>
              <h2 className="mt-3 text-[clamp(1.9rem,1.5rem+1.6vw,2.75rem)] font-extrabold tracking-[-0.02em] text-white">
                Every listing, graded before you see it.
              </h2>
              <p className={`mt-4 ${BODY}`}>
                Each card carries the same AI read a seller gets before it ever goes
                live: a condition grade, a verified-seller badge and the discount
                against the original price.
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
                      : "border-white/15 text-[#A1A1AA] hover:border-white/40 hover:text-white"
                  }`}
                  style={category === c ? { backgroundColor: ACCENT } : undefined}
                >
                  {c}
                </button>
              ))}
            </Reveal>

            <Reveal className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {filteredListings.map((listing) => (
                <div key={listing.id} className="min-w-0">
                  <ListingCard listing={listing} />
                </div>
              ))}
            </Reveal>
          </div>
        </section>

        {/* 3. Value / proof — the signal map itself */}
        <section id="signal" className="border-b border-white/10">
          <div className="mx-auto max-w-[1200px] px-6 py-20 sm:py-24">
            <Reveal>
              <Eyebrow>Verification signal</Eyebrow>
              <h2 className="mt-3 text-[clamp(1.9rem,1.5rem+1.6vw,2.75rem)] font-extrabold tracking-[-0.02em] text-white">
                Reweight the axes. Watch it redraw.
              </h2>
              <p className={`mt-4 ${BODY}`}>
                This shape is drawn from one real listing below. Drag any slider and
                every axis moves together, because the five weights always add up to
                the same 100.
              </p>
            </Reveal>

            <Reveal className="mt-10 flex flex-wrap items-center gap-4 rounded-2xl border border-white/10 bg-[#131319] p-4">
              <div className="relative h-16 w-16 flex-none overflow-hidden rounded-xl bg-[#1c1c24]">
                <Image
                  src={`${referenceListing.image}?auto=format&fit=crop&w=200&q=70`}
                  alt={`${referenceListing.name}, the listing this signal map is drawn from`}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">{referenceListing.name}</p>
                <p className="text-xs text-[#A1A1AA]">
                  Reference listing for the shape below — real per-axis scores, reweighted live.
                </p>
              </div>
            </Reveal>

            <Reveal className="mt-8 rounded-3xl border border-white/10 bg-[#0E0E13] p-6 sm:p-10">
              <SignalChart
                weights={weights}
                state={state}
                onWeightChange={handleWeightChange}
                onReset={handleReset}
                referenceName={referenceListing.name}
              />

              <div className="mt-10 flex flex-wrap items-end justify-between gap-6 border-t border-white/10 pt-8">
                <div>
                  <Eyebrow>Weighted match, live</Eyebrow>
                  <p
                    className="mt-2 text-[clamp(2.5rem,2rem+2vw,4rem)] font-extrabold leading-none tabular-nums text-white"
                    style={DISPLAY}
                  >
                    {state.weightedScore.toFixed(1)}%
                  </p>
                </div>
                <p className={BODY}>
                  Recomputed from {referenceListing.name}&rsquo;s five raw axis scores
                  every time a weight changes — the same number quoted at the bottom
                  of this page.
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* 4. Social proof */}
        <section id="proof" className="border-b border-white/10 bg-[#0E0E13]">
          <div className="mx-auto max-w-[1200px] px-6 py-20">
            <Reveal>
              <Eyebrow>Social proof</Eyebrow>
              <h2 className="mt-3 text-[clamp(1.9rem,1.5rem+1.6vw,2.75rem)] font-extrabold tracking-[-0.02em] text-white">
                Buyers and sellers trust the shape.
              </h2>
            </Reveal>

            <Reveal className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
              {STATS.map((stat) => (
                <div key={stat.label} className="min-w-0 rounded-2xl border border-white/10 p-5">
                  <p className="text-2xl font-extrabold tabular-nums text-white" style={DISPLAY}>
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-[#A1A1AA]">{stat.label}</p>
                </div>
              ))}
            </Reveal>

            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
              {TESTIMONIALS.map((t) => (
                <Reveal key={t.name} className="min-w-0">
                  <figure className="flex h-full flex-col justify-between rounded-2xl border border-white/10 bg-[#131319] p-6">
                    <blockquote className="text-sm leading-[1.6] text-white">
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
                        <span className="block truncate text-sm font-semibold text-white">{t.name}</span>
                        <span className="block truncate text-xs text-[#A1A1AA]">{t.role}</span>
                      </span>
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Closing CTA — quotes the same live weighted score, not a static number */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(60% 60% at 50% 0%, rgba(110,86,207,0.18), transparent 70%)",
            }}
          />
          <div className="relative mx-auto max-w-[1200px] px-6 py-20 sm:py-28">
            <Reveal className="flex flex-col items-start gap-8 rounded-3xl border border-white/10 bg-[#131319] p-8 sm:p-12 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0 lg:max-w-[640px]">
                <Eyebrow>Your weighted match, quoted live</Eyebrow>
                <h2 className="mt-3 text-[clamp(1.9rem,1.5rem+1.6vw,2.75rem)] font-extrabold tracking-[-0.02em] text-white">
                  {referenceListing.name} scores{" "}
                  <span className="tabular-nums" style={{ color: ACCENT_TINT }}>
                    {state.weightedScore.toFixed(1)}%
                  </span>{" "}
                  at your current weighting.
                </h2>
                <p className={`mt-4 ${BODY}`}>
                  Condition {weights[0]}%, authenticity {weights[1]}%, price fit{" "}
                  {weights[2]}%, seller trust {weights[3]}%, demand velocity{" "}
                  {weights[4]}% — the exact split you left the sliders in above,
                  recalculated from the same five raw axis scores.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <PrimaryButton href="#signal">Create your free account</PrimaryButton>
                  <span className="inline-flex items-center gap-2 text-xs text-[#A1A1AA]">
                    <ShieldCheck className="h-4 w-4" aria-hidden="true" style={{ color: ACCENT_TINT }} strokeWidth={2} />
                    No card required to see your signal
                  </span>
                </div>
              </div>

              <div className="flex flex-none flex-col items-center gap-2">
                <MiniSignalGlyph values={state.axes.map((a) => a.value)} className="h-24 w-24" />
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#A1A1AA]">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden="true" style={{ color: ACCENT_TINT }} strokeWidth={2} />
                  Live shape
                </span>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 px-6 py-8">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-4">
          <span className="text-sm font-semibold text-white" style={DISPLAY}>
            repick
          </span>
          <p className="text-xs text-[#A1A1AA]">
            Condition, authenticity, price fit, seller trust and demand — every listing, five axes, no guessing.
          </p>
        </div>
      </footer>
    </div>
  );
}
