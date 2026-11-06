"use client";

import { useMemo, useState, type CSSProperties, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ShieldCheck, Filter } from "lucide-react";
import FunnelChart from "./funnel-chart";
import ListingCard from "./listing-card";
import {
  computeFunnel,
  DEFAULT_CATEGORY,
  DEFAULT_THRESHOLD,
  LISTINGS,
  PREVIEW_FILTERS,
  STATS,
  TESTIMONIALS,
  type Category,
  type PreviewFilter,
} from "./data";
import {
  ACCENT,
  ACCENT_DEEP,
  BODY_LG,
  BODY_PANEL,
  BORDER,
  BORDER_STRONG,
  DISPLAY,
  FOCUS_RING,
  MUTED_STRONG,
} from "./tokens";

const SKIP_LINK =
  "sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-50 focus-visible:rounded-full focus-visible:bg-[#15161B] focus-visible:px-4 focus-visible:py-2 focus-visible:text-sm focus-visible:font-semibold focus-visible:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#28409F]";

function Reveal({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  const reduceMotion = useReducedMotion();
  if (reduceMotion)
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  return (
    <motion.div
      className={className}
      style={style}
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
    <p className="text-[11px] font-semibold uppercase tracking-[0.28em]" style={{ color: ACCENT_DEEP }}>
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

// The default funnel state, quoted as a static illustrative figure in the hero —
// the same numbers the interactive chart below shows before anyone touches it.
const HERO_DEFAULT_FUNNEL = computeFunnel(DEFAULT_CATEGORY, DEFAULT_THRESHOLD);

export default function FunnelLanding() {
  const [category, setCategory] = useState<Category>(DEFAULT_CATEGORY);
  const [threshold, setThreshold] = useState<number>(DEFAULT_THRESHOLD);
  const [previewFilter, setPreviewFilter] = useState<PreviewFilter>("All");

  const result = useMemo(() => computeFunnel(category, threshold), [category, threshold]);

  const heroListings = [LISTINGS[0], LISTINGS[2]]; // Sony a7 IV (Cameras), Omega (Watches)
  const filteredListings = LISTINGS.filter(
    (l) => previewFilter === "All" || l.category === previewFilter
  );

  // Closing-CTA glyph: three bars echoing submitted → authenticated → matched, drawn
  // from the exact same live `result` the funnel chart above computed.
  const glyphAuthenticated = Math.max(result.stages[3].pctOfTotal, 6);
  const glyphMatched = Math.max(result.stages[4].pctOfTotal, 6);

  return (
    <div className="min-h-screen bg-[#FDFDFC] text-[#15161B]">
      <a href="#main" className={SKIP_LINK}>
        Skip to main content
      </a>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-[#FDFDFC]/90 backdrop-blur" style={{ borderColor: BORDER }}>
        <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-6 py-4">
          <span className="text-lg font-extrabold tracking-[-0.02em] text-[#15161B]" style={DISPLAY}>
            repick
          </span>
          <nav aria-label="Primary" className="hidden gap-8 md:flex">
            <a href="#preview" className={`text-sm font-semibold text-[#52525B] hover:text-[#15161B] ${FOCUS_RING} rounded`}>
              Browse
            </a>
            <a href="#funnel" className={`text-sm font-semibold text-[#52525B] hover:text-[#15161B] ${FOCUS_RING} rounded`}>
              The funnel
            </a>
            <a href="#proof" className={`text-sm font-semibold text-[#52525B] hover:text-[#15161B] ${FOCUS_RING} rounded`}>
              Reviews
            </a>
          </nav>
          <a
            href="#funnel"
            className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold text-white ${FOCUS_RING}`}
            style={{ backgroundColor: ACCENT }}
          >
            Get your matches
          </a>
        </div>
      </header>

      <main id="main">
        {/* 1. Hero — headline, subhead, single CTA, and real listing proof, all
               inside this one hero section. No perspective toggle: one narrative,
               the pipeline itself, told from the buyer's side of the feed. */}
        <section className="border-b" style={{ borderColor: BORDER }}>
          <div className="mx-auto max-w-[1200px] px-6 pb-20 pt-16 sm:pb-24 sm:pt-20">
            <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
              <div className="min-w-0 lg:col-span-7">
                <Eyebrow>Four screens, before it reaches you</Eyebrow>
                <h1
                  className="mt-4 text-[clamp(2.5rem,1.7rem+3.6vw,5rem)] font-extrabold leading-[0.98] tracking-[-0.02em] text-[#15161B]"
                  style={DISPLAY}
                >
                  Most listings
                  <br />
                  never reach you.
                </h1>
                <p className={`mt-6 ${BODY_LG}`}>
                  Every camera, watch, sneaker and bag submitted to repick runs through an
                  AI pre-screen, condition grading, seller authentication, and a confidence
                  bar you set yourself — before it ever shows up in a feed.
                </p>
                <div className="mt-8">
                  <PrimaryButton href="#funnel">See the funnel, live</PrimaryButton>
                </div>
                <p className="mt-6 text-sm text-[#52525B]">
                  <span className="font-semibold tabular-nums text-[#15161B]">
                    {HERO_DEFAULT_FUNNEL.matched.toLocaleString("en-US")} of{" "}
                    {HERO_DEFAULT_FUNNEL.submitted.toLocaleString("en-US")}
                  </span>{" "}
                  camera listings submitted this month clear an 80% bar today.
                </p>
              </div>

              <div className="min-w-0 lg:col-span-5">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#52525B]">
                  Two of today&rsquo;s matches
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
        <section id="preview" className="border-b bg-[#F4F4F2]" style={{ borderColor: BORDER }}>
          <div className="mx-auto max-w-[1200px] px-6 py-20">
            <Reveal>
              <Eyebrow>Product preview</Eyebrow>
              <h2 className="mt-3 text-[clamp(1.9rem,1.5rem+1.6vw,2.75rem)] font-extrabold tracking-[-0.02em] text-[#15161B]">
                Every card shows its work.
              </h2>
              <p className={`mt-4 ${BODY_PANEL}`}>
                Not just a match score — the actual reason the AI surfaced it, a
                condition grade, a verified-seller badge, and the discount against the
                original price.
              </p>
            </Reveal>

            <Reveal className="mt-8 flex flex-wrap items-center gap-2">
              <span className="mr-1 inline-flex items-center gap-1.5 text-xs font-semibold text-[#52525B]">
                <Filter className="h-3.5 w-3.5" aria-hidden="true" strokeWidth={2} />
                Filter
              </span>
              {PREVIEW_FILTERS.map((f) => (
                <button
                  key={f}
                  type="button"
                  aria-pressed={previewFilter === f}
                  onClick={() => setPreviewFilter(f)}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${FOCUS_RING} ${
                    previewFilter === f ? "border-transparent text-white" : "text-[#52525B] hover:border-[#28409F]"
                  }`}
                  style={{
                    backgroundColor: previewFilter === f ? ACCENT : "transparent",
                    borderColor: previewFilter === f ? "transparent" : BORDER_STRONG,
                  }}
                >
                  {f}
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

        {/* 3. Value — the funnel itself. Manipulating the category or the confidence
               slider recomputes every stage's count and width, in real time. */}
        <section id="funnel" className="border-b bg-[#F4F4F2]" style={{ borderColor: BORDER }}>
          <div className="mx-auto max-w-[1200px] px-6 py-20 sm:py-24">
            <Reveal>
              <Eyebrow>How the pipeline narrows</Eyebrow>
              <h2 className="mt-3 text-[clamp(1.9rem,1.5rem+1.6vw,2.75rem)] font-extrabold tracking-[-0.02em] text-[#15161B]">
                Pick a category. Set the bar. Watch it narrow.
              </h2>
              <p className={`mt-4 ${BODY_PANEL}`}>
                These are the real four checks every listing runs through, with real
                submission counts for each category. Only the last bar moves with your
                slider — the first three stages are already fixed by the time a listing
                gets there.
              </p>
            </Reveal>

            <Reveal className="mt-10">
              <FunnelChart
                category={category}
                threshold={threshold}
                result={result}
                onCategoryChange={setCategory}
                onThresholdChange={setThreshold}
              />
            </Reveal>
          </div>
        </section>

        {/* 4. Social proof */}
        <section id="proof" className="border-b" style={{ borderColor: BORDER }}>
          <div className="mx-auto max-w-[1200px] px-6 py-20">
            <Reveal>
              <Eyebrow>Social proof</Eyebrow>
              <h2 className="mt-3 text-[clamp(1.9rem,1.5rem+1.6vw,2.75rem)] font-extrabold tracking-[-0.02em] text-[#15161B]">
                Buyers trust what actually clears.
              </h2>
            </Reveal>

            <Reveal className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
              {STATS.map((stat) => (
                <div key={stat.label} className="min-w-0 rounded-2xl border p-5" style={{ borderColor: BORDER }}>
                  <p className="text-2xl font-extrabold tabular-nums text-[#15161B]" style={DISPLAY}>
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-[#52525B]">{stat.label}</p>
                </div>
              ))}
            </Reveal>

            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
              {TESTIMONIALS.map((t) => (
                <Reveal key={t.name} className="min-w-0">
                  <figure className="flex h-full flex-col justify-between rounded-2xl border bg-[#F4F4F2] p-6" style={{ borderColor: BORDER }}>
                    <blockquote className="text-sm leading-[1.6] text-[#15161B]">
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
                        <span className="block truncate text-sm font-semibold text-[#15161B]">{t.name}</span>
                        <span className="block truncate text-xs" style={{ color: MUTED_STRONG }}>
                          {t.role}
                        </span>
                      </span>
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Closing CTA — quotes the same live funnel result computed above, not
               a static number: category, threshold, matched count and rate all come
               straight from `result`. */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background: "radial-gradient(60% 60% at 50% 0%, rgba(52,84,209,0.10), transparent 70%)",
            }}
          />
          <div className="relative mx-auto max-w-[1200px] px-6 py-20 sm:py-28">
            <Reveal className="flex flex-col items-start gap-8 rounded-3xl border bg-[#F4F4F2] p-8 sm:p-12 lg:flex-row lg:items-center lg:justify-between" style={{ borderColor: BORDER }}>
              <div className="min-w-0 lg:max-w-[640px]">
                <Eyebrow>Your funnel, quoted live</Eyebrow>
                <h2 className="mt-3 text-[clamp(1.9rem,1.5rem+1.6vw,2.75rem)] font-extrabold tracking-[-0.02em] text-[#15161B]">
                  <span className="tabular-nums" style={{ color: ACCENT_DEEP }}>
                    {result.matched.toLocaleString("en-US")}
                  </span>{" "}
                  of {result.submitted.toLocaleString("en-US")} {category.toLowerCase()} listings clear
                  your {threshold}% bar.
                </h2>
                <p className={`mt-4 ${BODY_PANEL}`}>
                  That&rsquo;s {result.matchedPct}% of everything submitted — the exact
                  category and confidence bar you left the controls in above, recomputed
                  from the same four real stages.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <PrimaryButton href="#funnel">Create your free account</PrimaryButton>
                  <span className="inline-flex items-center gap-2 text-xs text-[#52525B]">
                    <ShieldCheck className="h-4 w-4" aria-hidden="true" style={{ color: ACCENT_DEEP }} strokeWidth={2} />
                    No card required to see your matches
                  </span>
                </div>
              </div>

              <div className="flex flex-none flex-col items-center gap-3">
                <div aria-hidden="true" className="flex w-40 flex-col items-center gap-1.5">
                  <span className="h-3 rounded-sm" style={{ width: "100%", backgroundColor: ACCENT, opacity: 0.2 }} />
                  <span className="h-3 rounded-sm" style={{ width: `${glyphAuthenticated}%`, backgroundColor: ACCENT, opacity: 0.55 }} />
                  <span className="h-3 rounded-sm" style={{ width: `${glyphMatched}%`, backgroundColor: ACCENT_DEEP }} />
                </div>
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#52525B]">
                  Submitted → verified → matched
                </span>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="border-t px-6 py-8" style={{ borderColor: BORDER }}>
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-4">
          <span className="text-sm font-semibold text-[#15161B]" style={DISPLAY}>
            repick
          </span>
          <p className="text-xs text-[#52525B]">
            Pre-screen, condition, authentication, confidence bar — four real stages, no guessing.
          </p>
        </div>
      </footer>
    </div>
  );
}
