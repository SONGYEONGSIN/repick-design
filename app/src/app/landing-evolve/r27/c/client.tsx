"use client";

import { useMemo, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, CheckCircle2, ShieldCheck, Star } from "lucide-react";
import SlopeChart from "./slope-chart";
import ListingCard from "./listing-card";
import {
  DEFAULT_SCENARIO_ID,
  HERO_ITEM_IDS,
  ITEMS,
  PREVIEW_FILTERS,
  SCENARIOS,
  TESTIMONIALS,
  TRUST_SIGNALS,
  TRUST_STATS,
  computeSlopeRows,
  computeSummary,
  scenarioById,
  type CategoryId,
} from "./data";
import { ACCENT_FILL, ACCENT_INK, ACCENT_TINT, FOCUS, MUTED, NUM, money } from "./tokens";

const SKIP_LINK = `sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-50 focus-visible:rounded-full focus-visible:bg-white focus-visible:px-4 focus-visible:py-2 focus-visible:text-sm focus-visible:font-semibold focus-visible:text-[#0B0B0F] ${FOCUS}`;

type Perspective = "buying" | "selling";

const PERSPECTIVE_COPY: Record<
  Perspective,
  { eyebrow: string; heading: [string, string]; sub: string; cta: string }
> = {
  buying: {
    eyebrow: "Buying",
    heading: ["Know the real price", "before you buy secondhand."],
    sub: "AI checks condition, authenticity and fair price on every listing, so the number you see is close to what the item is actually worth.",
    cta: "Browse verified listings",
  },
  selling: {
    eyebrow: "Selling",
    heading: ["List once.", "Let AI verify a fair price."],
    sub: "repick grades condition and authenticity automatically, then shows buyers a verified fair price, so you spend less time haggling over guesses.",
    cta: "Get your fair price",
  },
};

function Reveal({
  children,
  className,
  ...rest
}: {
  children: ReactNode;
  className?: string;
  role?: string;
  "aria-label"?: string;
}) {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) {
    return (
      <div className={className} {...rest}>
        {children}
      </div>
    );
  }
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

function Eyebrow({ children, tone = "tint" }: { children: ReactNode; tone?: "tint" | "muted" }) {
  return (
    <p
      className="text-[11px] font-semibold uppercase tracking-[0.28em]"
      style={{ color: tone === "tint" ? ACCENT_TINT : MUTED }}
    >
      {children}
    </p>
  );
}

function PrimaryButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-base font-semibold transition-transform motion-safe:hover:-translate-y-0.5 ${FOCUS}`}
      style={{ backgroundColor: ACCENT_FILL, color: ACCENT_INK }}
    >
      {children}
      <ArrowRight className="h-4 w-4" aria-hidden="true" strokeWidth={2.5} />
    </a>
  );
}

export default function SlopeLanding() {
  const [perspective, setPerspective] = useState<Perspective>("buying");
  const [scenarioId, setScenarioId] = useState<string>(DEFAULT_SCENARIO_ID);
  const [category, setCategory] = useState<"all" | CategoryId>("all");

  // Everything below is a pure derivation of `scenarioId` through the same
  // shared functions data.ts exports — no per-state dataset is swapped in.
  const scenario = useMemo(() => scenarioById(scenarioId), [scenarioId]);
  const rows = useMemo(() => computeSlopeRows(scenario), [scenario]);
  const summary = useMemo(() => computeSummary(rows), [rows]);

  const heroItems = HERO_ITEM_IDS.map((id) => ITEMS.find((it) => it.id === id)).filter(
    (it): it is (typeof ITEMS)[number] => Boolean(it)
  );
  const filteredItems = ITEMS.filter((it) => category === "all" || it.category === category);
  const copy = PERSPECTIVE_COPY[perspective];

  const avgSigned = summary.avgSignedDeltaPct;
  const avgVerb = avgSigned > 0.5 ? "go up" : avgSigned < -0.5 ? "come down" : "stay flat";
  const avgLabel = `${avgSigned > 0.5 ? "+" : avgSigned < -0.5 ? "−" : ""}${Math.abs(avgSigned).toFixed(1)}%`;

  const mover = summary.biggestMover;
  const moverVerb = mover.direction;
  const moverLabel = `${mover.delta > 0.5 ? "+" : mover.delta < -0.5 ? "−" : ""}${Math.abs(mover.delta).toFixed(1)}%`;

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white">
      <a href="#main" className={SKIP_LINK}>
        Skip to main content
      </a>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0B0B0F]/90 backdrop-blur">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-6 py-4">
          <span className="text-lg font-extrabold tracking-[-0.02em] text-white">repick</span>
          <nav aria-label="Primary" className="hidden gap-8 md:flex">
            <a href="#preview" className={`rounded text-sm font-semibold text-[#A1A1AA] hover:text-white ${FOCUS}`}>
              Browse
            </a>
            <a href="#slope" className={`rounded text-sm font-semibold text-[#A1A1AA] hover:text-white ${FOCUS}`}>
              Fair-price slope
            </a>
            <a href="#proof" className={`rounded text-sm font-semibold text-[#A1A1AA] hover:text-white ${FOCUS}`}>
              Reviews
            </a>
          </nav>
          <a
            href="#slope"
            className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold ${FOCUS}`}
            style={{ backgroundColor: ACCENT_FILL, color: ACCENT_INK }}
          >
            See the slope
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
                      className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${FOCUS} ${
                        perspective === p ? "" : "text-[#A1A1AA] hover:text-white"
                      }`}
                      style={perspective === p ? { backgroundColor: ACCENT_FILL, color: ACCENT_INK } : undefined}
                    >
                      {PERSPECTIVE_COPY[p].eyebrow}
                    </button>
                  ))}
                </div>

                <h1 className="text-[clamp(2.5rem,1.7rem+3.6vw,5rem)] font-extrabold leading-[0.98] tracking-[-0.02em] text-white">
                  {copy.heading[0]}
                  <br />
                  {copy.heading[1]}
                </h1>
                <p className="mt-6 max-w-[540px] text-lg leading-relaxed text-[#A1A1AA]">{copy.sub}</p>
                <div className="mt-8">
                  <PrimaryButton href="#slope">{copy.cta}</PrimaryButton>
                </div>
                <p className={`mt-6 text-sm text-[#A1A1AA] ${NUM}`}>
                  <span className="font-semibold text-white">{TRUST_STATS[0].value}</span> {TRUST_STATS[0].label}.
                </p>
              </div>

              <div className="min-w-0 lg:col-span-5">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#A1A1AA]">
                  Live on repick right now
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {heroItems.map((item, i) => (
                    <ListingCard key={item.id} item={item} heading={false} compact preload={i === 0} />
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
              <p className="mt-4 max-w-[500px] text-base leading-relaxed text-[#A1A1AA]">
                Each card carries the same AI read a seller gets before it ever goes live: a condition
                grade, a match score and the discount against the original retail price.
              </p>
            </Reveal>

            <Reveal className="mt-8 flex flex-wrap gap-2">
              {PREVIEW_FILTERS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  aria-pressed={category === f.id}
                  onClick={() => setCategory(f.id)}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${FOCUS} ${
                    category === f.id
                      ? "border-transparent"
                      : "border-white/15 text-[#A1A1AA] hover:border-white/40 hover:text-white"
                  }`}
                  style={category === f.id ? { backgroundColor: ACCENT_FILL, color: ACCENT_INK } : undefined}
                >
                  {f.label}
                </button>
              ))}
            </Reveal>

            <Reveal className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {filteredItems.map((item) => (
                <div key={item.id} className="min-w-0">
                  <ListingCard item={item} />
                </div>
              ))}
            </Reveal>
          </div>
        </section>

        {/* 3. Value / proof — the fair-price slope chart itself */}
        <section id="slope" className="border-b border-white/10">
          <div className="mx-auto max-w-[1200px] px-6 py-20 sm:py-24">
            <Reveal>
              <Eyebrow>Fair-price slope</Eyebrow>
              <h2 className="mt-3 text-[clamp(1.9rem,1.5rem+1.6vw,2.75rem)] font-extrabold tracking-[-0.02em] text-white">
                Pick a pricing scenario. Watch the lines tilt.
              </h2>
              <p className="mt-4 max-w-[500px] text-base leading-relaxed text-[#A1A1AA]">
                Every line connects one real listing&rsquo;s asking price to repick&rsquo;s verified fair
                price. The angle is the proof — a small tilt for a small correction, a steep one for a
                big one — recalculated live from the same seven listings, never swapped for a canned set.
              </p>
            </Reveal>

            <Reveal
              role="group"
              aria-label="Pricing scenario"
              className="mt-10 flex flex-wrap gap-2"
            >
              {SCENARIOS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  aria-pressed={scenario.id === s.id}
                  onClick={() => setScenarioId(s.id)}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${FOCUS} ${
                    scenario.id === s.id
                      ? "border-transparent"
                      : "border-white/15 text-[#A1A1AA] hover:border-white/40 hover:text-white"
                  }`}
                  style={scenario.id === s.id ? { backgroundColor: ACCENT_FILL, color: ACCENT_INK } : undefined}
                >
                  {s.short}
                </button>
              ))}
            </Reveal>
            <p className="mt-3 max-w-[500px] text-sm leading-relaxed text-[#A1A1AA]">{scenario.blurb}</p>

            <Reveal className="mt-8 rounded-3xl border border-white/10 bg-[#0E0E13] p-6 sm:p-10">
              <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,320px)] lg:items-start">
                <SlopeChart rows={rows} />

                <div className="flex flex-col gap-6 border-t border-white/10 pt-8 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
                  <div>
                    <Eyebrow tone="muted">This scenario, at a glance</Eyebrow>
                    <p className={`mt-2 text-[clamp(2.25rem,1.9rem+1.4vw,3.25rem)] font-extrabold leading-none text-white ${NUM}`}>
                      {avgLabel}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-[#A1A1AA]">
                      Average verified price versus asking, across all seven listings — recomputed the
                      instant you change the scenario above.
                    </p>
                  </div>
                  <dl className={`grid grid-cols-3 gap-3 text-center ${NUM}`}>
                    <div className="rounded-xl border border-white/10 p-3">
                      <dt className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#A1A1AA]">Up</dt>
                      <dd className="mt-1 text-xl font-extrabold text-white">{summary.upCount}</dd>
                    </div>
                    <div className="rounded-xl border border-white/10 p-3">
                      <dt className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#A1A1AA]">Down</dt>
                      <dd className="mt-1 text-xl font-extrabold text-white">{summary.downCount}</dd>
                    </div>
                    <div className="rounded-xl border border-white/10 p-3">
                      <dt className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#A1A1AA]">Flat</dt>
                      <dd className="mt-1 text-xl font-extrabold text-white">{summary.flatCount}</dd>
                    </div>
                  </dl>
                  <p className="text-xs leading-relaxed text-[#A1A1AA]">
                    Biggest mover: <span className="font-semibold text-white">{mover.item.short}</span>,{" "}
                    <span className={NUM}>{moverLabel}</span> ({moverVerb} versus asking).
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* 4. Trust */}
        <section className="border-b border-white/10 bg-[#0E0E13]">
          <div className="mx-auto max-w-[1200px] px-6 py-20">
            <Reveal>
              <Eyebrow>Why the slope holds up</Eyebrow>
              <h2 className="mt-3 text-[clamp(1.9rem,1.5rem+1.6vw,2.75rem)] font-extrabold tracking-[-0.02em] text-white">
                Verification, not guesswork.
              </h2>
            </Reveal>

            <Reveal className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3">
              {TRUST_STATS.map((stat) => (
                <div key={stat.label} className="min-w-0 rounded-2xl border border-white/10 p-5">
                  <p className={`text-2xl font-extrabold text-white ${NUM}`}>{stat.value}</p>
                  <p className="mt-1 text-xs leading-relaxed text-[#A1A1AA]">{stat.label}</p>
                </div>
              ))}
            </Reveal>

            <Reveal className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {TRUST_SIGNALS.map((signal) => (
                <div key={signal} className="flex items-start gap-3 rounded-xl border border-white/10 p-4">
                  <CheckCircle2
                    className="h-5 w-5 flex-none"
                    aria-hidden="true"
                    style={{ color: ACCENT_TINT }}
                    strokeWidth={2}
                  />
                  <p className="text-sm leading-relaxed text-white">{signal}</p>
                </div>
              ))}
            </Reveal>
          </div>
        </section>

        {/* 5. Social proof */}
        <section id="proof" className="border-b border-white/10">
          <div className="mx-auto max-w-[1200px] px-6 py-20">
            <Reveal>
              <Eyebrow>Social proof</Eyebrow>
              <h2 className="mt-3 text-[clamp(1.9rem,1.5rem+1.6vw,2.75rem)] font-extrabold tracking-[-0.02em] text-white">
                Buyers and sellers trust the line.
              </h2>
            </Reveal>

            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
              {TESTIMONIALS.map((t) => (
                <Reveal key={t.name} className="min-w-0">
                  <figure className="flex h-full flex-col justify-between rounded-2xl border border-white/10 bg-[#131319] p-6">
                    <div>
                      <div
                        role="img"
                        className="flex items-center gap-0.5"
                        aria-label={`Rated ${t.rating} out of 5`}
                      >
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className="h-3.5 w-3.5"
                            aria-hidden="true"
                            strokeWidth={2}
                            style={{ color: i < t.rating ? ACCENT_TINT : "rgba(255,255,255,0.15)" }}
                            fill={i < t.rating ? ACCENT_TINT : "none"}
                          />
                        ))}
                      </div>
                      <blockquote className="mt-3 text-sm leading-[1.6] text-white">
                        &ldquo;{t.quote}&rdquo;
                      </blockquote>
                    </div>
                    <figcaption className="mt-6 flex items-center justify-between gap-3">
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold text-white">{t.name}</span>
                        <span className="block truncate text-xs text-[#A1A1AA]">{t.context}</span>
                      </span>
                      {t.verified && (
                        <span
                          className="inline-flex flex-none items-center gap-1 rounded-full border border-white/15 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.08em]"
                          style={{ color: ACCENT_TINT }}
                        >
                          <ShieldCheck className="h-3 w-3" aria-hidden="true" strokeWidth={2} />
                          Verified
                        </span>
                      )}
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* 6. Closing CTA — quotes the live scenario-derived average, not a static number */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background: "radial-gradient(60% 60% at 50% 0%, rgba(139,168,58,0.16), transparent 70%)",
            }}
          />
          <div className="relative mx-auto max-w-[1200px] px-6 py-20 sm:py-28">
            <Reveal className="rounded-3xl border border-white/10 bg-[#131319] p-8 sm:p-12">
              <Eyebrow>{scenario.label}, quoted live</Eyebrow>
              <h2 className="mt-3 max-w-[760px] text-[clamp(1.9rem,1.5rem+1.6vw,2.75rem)] font-extrabold leading-[1.1] tracking-[-0.02em] text-white">
                At this weighting, average verified price{" "}
                <span className={NUM} style={{ color: ACCENT_TINT }}>
                  {avgVerb} {avgLabel}
                </span>{" "}
                versus what sellers first asked.
              </h2>
              <p className="mt-4 max-w-[560px] text-base leading-relaxed text-[#A1A1AA]">
                Recalculated from the same seven listings above, live, every time you change the
                scenario — not a static claim. The single biggest correction:{" "}
                <span className="font-semibold text-white">{mover.item.short}</span> moves from{" "}
                <span className={NUM}>{money(mover.asking)}</span> asking to{" "}
                <span className={NUM}>{money(mover.fair)}</span> verified,{" "}
                <span className={NUM}>{moverLabel}</span> at {scenario.short.toLowerCase()} weighting.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <PrimaryButton href="#slope">Create your free account</PrimaryButton>
                <span className="inline-flex items-center gap-2 text-xs text-[#A1A1AA]">
                  <ShieldCheck className="h-4 w-4" aria-hidden="true" style={{ color: ACCENT_TINT }} strokeWidth={2} />
                  No card required to see your fair price
                </span>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 px-6 py-8">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-4">
          <span className="text-sm font-semibold text-white">repick</span>
          <p className="text-xs text-[#A1A1AA]">
            Asking price on the left, repick&rsquo;s verified fair price on the right — the slope is
            the proof.
          </p>
        </div>
      </footer>
    </div>
  );
}
