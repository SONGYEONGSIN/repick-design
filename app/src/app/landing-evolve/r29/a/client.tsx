"use client";

import { useMemo, useState } from "react";
import { Gauge, ShieldCheck } from "lucide-react";
import SliderPanel from "./slider-panel";
import { LeaderboardRow, ListingCard } from "./leaderboard";
import { DEFAULT_WEIGHTS, LISTINGS, STATS, TESTIMONIALS, rankListings, type AxisId, type Weights } from "./data";
import { Eyebrow, PrimaryButton, Reveal, SKIP_LINK, useRankDelta } from "./ui";
import { ACCENT, ACCENT_FILL, BODY, BODY_LG, CAPTION, DISPLAY, FOCUS_RING } from "./tokens";

export default function CaliperLanding() {
  const [weights, setWeights] = useState<Weights>(DEFAULT_WEIGHTS);

  function updateWeight(id: AxisId, value: number) {
    setWeights((current) => ({ ...current, [id]: value }));
  }

  const ranked = useMemo(() => rankListings(LISTINGS, weights), [weights]);
  const board = useRankDelta(ranked);
  const top = board[0];
  const runnerUp = board[1];
  const heroRows = board.slice(0, 4);

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-zinc-50">
      <a href="#main" className={SKIP_LINK}>
        Skip to main content
      </a>

      {/* Persistent header */}
      <header className="sticky top-0 z-40 border-b border-[#1C1C22] bg-[#0B0B0F]/90 backdrop-blur">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-6 py-4">
          <span
            className="text-lg font-extrabold tracking-[-0.02em] text-zinc-50"
            style={DISPLAY}
          >
            Caliper
          </span>
          <nav aria-label="Primary" className="hidden gap-8 md:flex">
            <a href="#mechanism" className={`rounded text-sm font-semibold text-zinc-300 hover:text-zinc-50 ${FOCUS_RING}`}>
              How it works
            </a>
            <a href="#preview" className={`rounded text-sm font-semibold text-zinc-300 hover:text-zinc-50 ${FOCUS_RING}`}>
              Matches
            </a>
            <a href="#proof" className={`rounded text-sm font-semibold text-zinc-300 hover:text-zinc-50 ${FOCUS_RING}`}>
              Reviews
            </a>
          </nav>
          <a
            href="#mechanism"
            className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold text-white ${FOCUS_RING}`}
            style={{ backgroundColor: ACCENT_FILL }}
          >
            Start weighting
          </a>
        </div>
      </header>

      <main id="main">
        {/* 1. Hero — headline, sub, CTA AND the live widget, all inside the hero's own section */}
        <section className="border-b border-[#1C1C22]">
          <div className="mx-auto max-w-[1200px] px-6 pb-14 pt-14 sm:pb-16 sm:pt-20">
            <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
              <div className="min-w-0 lg:col-span-7">
                <Eyebrow>Live weighted matching</Eyebrow>
                <h1
                  className="mt-4 text-[clamp(2.25rem,1.5rem+3.4vw,4.75rem)] font-extrabold leading-[0.98] tracking-[-0.02em] text-zinc-50"
                  style={DISPLAY}
                >
                  Set your priorities.
                  <br />
                  Watch the ranking move.
                </h1>
                <p className={`mt-6 ${BODY_LG}`}>
                  Caliper scores every matched listing on price, shipping speed and seller
                  trust, then lets you weight the three yourself. Move a dial below and the
                  shortlist re-sorts instantly, with the exact factor that earned each spot.
                </p>
                <div className="mt-8">
                  <PrimaryButton href="#mechanism">See how scoring works</PrimaryButton>
                </div>
                <p className="mt-6 flex items-center gap-2 text-sm text-zinc-400">
                  <ShieldCheck
                    className="h-4 w-4 flex-none"
                    aria-hidden="true"
                    style={{ color: ACCENT }}
                    strokeWidth={2}
                  />
                  Every seller tier re-checked before a listing can rank.
                </p>
              </div>

              <div className="min-w-0 lg:col-span-5">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400">
                  Your top match, right now
                </p>
                <div className="rounded-2xl border border-[#1C1C22] bg-[#121217] p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400">
                    {top.category}
                  </p>
                  <p className="mt-1 text-2xl font-extrabold tracking-[-0.01em] text-zinc-50">
                    {top.name}
                  </p>
                  <p className="mt-3 flex items-baseline gap-2 tabular-nums">
                    <span className="text-sm text-zinc-400 line-through">
                      ${top.priceOriginal.toLocaleString("en-US")}
                    </span>
                    <span className="text-2xl font-extrabold text-zinc-50">
                      ${top.priceNow.toLocaleString("en-US")}
                    </span>
                  </p>
                  <p className="mt-3 text-sm tabular-nums" style={{ color: ACCENT }}>
                    {Math.round(top.score)}% weighted match
                  </p>
                  <p className="mt-3 text-xs leading-relaxed text-zinc-400">
                    Leads on {top.primaryFactor === "price" ? "price fit" : top.primaryFactor === "speed" ? "shipping speed" : "seller trust"}{" "}
                    at your current dial weights — drag any dial below to see it move.
                  </p>
                </div>
              </div>
            </div>

            {/* Live widget — sliders + leaderboard, physically inside the hero */}
            <div className="mt-12 rounded-3xl border border-[#1C1C22] bg-[#0E0E13] p-6 sm:p-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
                Fig. 01 — Your three dials
              </p>
              <div className="mt-4">
                <SliderPanel weights={weights} onChange={updateWeight} idPrefix="hero" />
              </div>

              <p aria-live="polite" className="sr-only">
                {top.name} is currently ranked first with a {Math.round(top.score)}% weighted
                match.
              </p>

              <ol role="list" className="mt-6 grid grid-cols-1 gap-3">
                {heroRows.map((item) => (
                  <LeaderboardRow key={item.id} item={item} />
                ))}
              </ol>
              <p className="mt-4 text-xs text-zinc-400">
                Showing the top 4 of {LISTINGS.length} matched listings — the full set re-sorts
                the same way in the product preview below.
              </p>
            </div>
          </div>
        </section>

        {/* 2. Product preview — every listing, always-visible badges, never overlaid on the photo */}
        <section id="preview" className="border-b border-[#1C1C22] bg-[#0E0E13]">
          <div className="mx-auto max-w-[1200px] px-6 py-20">
            <Reveal>
              <Eyebrow>Product preview</Eyebrow>
              <h2 className="mt-3 text-[clamp(1.75rem,1.4rem+1.5vw,2.5rem)] font-extrabold tracking-[-0.02em] text-zinc-50">
                Every match, graded and verified.
              </h2>
              <p className={`mt-4 ${BODY}`}>
                Weighted match, condition grade, seller tier and the cut off retail sit on
                every card below, not behind a hover or a click — this is the same list the
                widget above is sorting, in the same live order.
              </p>
            </Reveal>

            <Reveal>
              <ol role="list" className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {board.map((item, index) => (
                  <ListingCard key={item.id} item={item} preload={index === 0} />
                ))}
              </ol>
            </Reveal>
          </div>
        </section>

        {/* 3. Value override — the dial mechanic itself IS the value proof */}
        <section id="mechanism" className="border-b border-[#1C1C22]">
          <div className="mx-auto max-w-[1200px] px-6 py-20 sm:py-24">
            <Reveal>
              <Eyebrow>How the ranking works</Eyebrow>
              <h2 className="mt-3 text-[clamp(1.75rem,1.4rem+1.5vw,2.5rem)] font-extrabold tracking-[-0.02em] text-zinc-50">
                Three dials, fully explained.
              </h2>
              <p className={`mt-4 ${BODY}`}>
                Every score starts with a fixed 35% floor from Caliper&apos;s own AI match
                engine, the part no dial can touch. The remaining 65% splits across price fit,
                shipping speed and seller trust in exactly the proportion your three dials are
                set to below. Drag one and every row recomputes and re-sorts, live.
              </p>
            </Reveal>

            <Reveal className="mt-10 rounded-3xl border border-[#1C1C22] bg-[#121217] p-6 sm:p-8">
              <SliderPanel weights={weights} onChange={updateWeight} variant="full" idPrefix="mechanism" />
            </Reveal>

            <Reveal className="mt-10">
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
                Fig. 02 — Full breakdown, all {LISTINGS.length} listings
              </p>
              <ol role="list" className="grid grid-cols-1 gap-4">
                {board.map((item) => (
                  <LeaderboardRow key={item.id} item={item} detailed />
                ))}
              </ol>
            </Reveal>
          </div>
        </section>

        {/* 4. Social proof */}
        <section id="proof" className="border-b border-[#1C1C22] bg-[#0E0E13]">
          <div className="mx-auto max-w-[1200px] px-6 py-20">
            <Reveal>
              <Eyebrow>Social proof</Eyebrow>
              <h2 className="mt-3 text-[clamp(1.75rem,1.4rem+1.5vw,2.5rem)] font-extrabold tracking-[-0.02em] text-zinc-50">
                Buyers trust the weighting, not just the result.
              </h2>
            </Reveal>

            <Reveal className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
              {STATS.map((stat) => (
                <div key={stat.label} className="min-w-0 rounded-2xl border border-[#1C1C22] bg-[#121217] p-5">
                  <p className="text-2xl font-extrabold tabular-nums text-zinc-50" style={DISPLAY}>
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-zinc-400">{stat.label}</p>
                </div>
              ))}
            </Reveal>

            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
              {TESTIMONIALS.map((testimonial) => (
                <Reveal key={testimonial.name} className="min-w-0">
                  <figure className="flex h-full flex-col justify-between rounded-2xl border border-[#1C1C22] bg-[#121217] p-6">
                    <blockquote className="text-sm leading-[1.6] text-zinc-200">
                      &ldquo;{testimonial.quote}&rdquo;
                    </blockquote>
                    <figcaption className="mt-6 flex items-center gap-3">
                      <span
                        aria-hidden="true"
                        className="flex h-9 w-9 flex-none items-center justify-center rounded-full text-xs font-semibold text-white"
                        style={{ backgroundColor: ACCENT_FILL }}
                      >
                        {testimonial.initials}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold text-zinc-50">
                          {testimonial.name}
                        </span>
                        <span className="block truncate text-xs text-zinc-400">{testimonial.role}</span>
                      </span>
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Closing CTA — quotes the live top listing, not a static example */}
        <section>
          <div className="mx-auto max-w-[1200px] px-6 py-20 sm:py-28">
            <Reveal className="flex flex-col items-start gap-8 rounded-3xl border border-[#1C1C22] bg-[#121217] p-8 sm:p-12 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0 lg:max-w-[640px]">
                <Eyebrow>Your shortlist, quoted live</Eyebrow>
                <h2 className="mt-3 text-[clamp(1.75rem,1.4rem+1.5vw,2.5rem)] font-extrabold tracking-[-0.02em] text-zinc-50">
                  Your top match right now:{" "}
                  <span style={{ color: ACCENT }}>{top.name}</span> at{" "}
                  <span className="tabular-nums" style={{ color: ACCENT }}>
                    ${top.priceNow.toLocaleString("en-US")}
                  </span>
                  .
                </h2>
                <p className={`mt-4 ${BODY}`}>
                  Scored at {Math.round(top.score)}% with your dials exactly where you left
                  them: price {weights.price}%, shipping {weights.speed}%, trust{" "}
                  {weights.trust}%. Create a free watchlist and Caliper keeps re-weighting
                  every new listing the same way, automatically.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <PrimaryButton href="#mechanism">Create a free watchlist</PrimaryButton>
                  <span className="inline-flex items-center gap-2 text-xs text-zinc-400">
                    <ShieldCheck className="h-4 w-4" aria-hidden="true" style={{ color: ACCENT }} strokeWidth={2} />
                    No card required to see your shortlist
                  </span>
                </div>
              </div>

              <div className="flex flex-none flex-col items-center gap-2 rounded-2xl border border-[#1C1C22] bg-[#0E0E13] px-8 py-6">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                  <Gauge className="h-3.5 w-3.5" aria-hidden="true" strokeWidth={2} />
                  Runner-up
                </span>
                <span className="max-w-[200px] text-center text-lg font-extrabold leading-tight text-zinc-50">
                  {runnerUp.name}
                </span>
                <span className="text-xs tabular-nums text-zinc-400">
                  {Math.round(runnerUp.score)}% weighted match
                </span>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#1C1C22] px-6 py-8">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-4">
          <span className="text-sm font-semibold text-zinc-50" style={DISPLAY}>
            Caliper
          </span>
          <p className={CAPTION}>
            Price, shipping speed and seller trust — weighted by you, re-ranked live, never
            hidden behind a fixed formula.
          </p>
        </div>
      </footer>
    </div>
  );
}
