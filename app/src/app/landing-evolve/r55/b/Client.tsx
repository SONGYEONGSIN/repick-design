"use client";

import { useState } from "react";
import { ArrowRight, Quote, Sparkles, Star, Users } from "lucide-react";
import { AuthenticityMeter } from "./AuthenticityMeter";
import { ListingCard } from "./ListingCard";
import { Reveal } from "./Reveal";
import {
  CHECKS,
  LISTINGS,
  SCENARIOS,
  STAT_CHIPS,
  TESTIMONIALS,
  summarize,
  type CheckState,
} from "./model";
import {
  ACCENT,
  BG,
  BORDER,
  CAPTION,
  EYEBROW,
  FG,
  FOCUS_RING,
  INK,
  MUTED,
  PROSE_WIDTH_BODY,
  PROSE_WIDTH_CARD,
  PROSE_WIDTH_HERO,
  STAT_TRACKING,
  SURFACE,
  SURFACE_RAISED,
} from "./tokens";

const DEFAULT_CHECKS: CheckState = [true, false, true, false]; // serial + review = 55, "Partially verified"

export default function Client() {
  const [checks, setChecks] = useState<CheckState>(DEFAULT_CHECKS);
  const { score, band } = summarize(checks);
  const sampleListing = { ...LISTINGS[0], checks };

  function toggleCheck(index: number) {
    setChecks((prev) => prev.map((value, i) => (i === index ? !value : value)));
  }

  return (
    <>
      <a
        href="#main-content"
        className={`fixed left-4 top-4 z-50 -translate-y-20 rounded-lg px-4 py-2 text-sm font-semibold transition-transform focus:translate-y-0 ${FOCUS_RING}`}
        style={{ backgroundColor: ACCENT, color: INK }}
      >
        Skip to content
      </a>

      <main id="main-content" tabIndex={-1} style={{ backgroundColor: BG, color: FG }}>
        {/* ------------------------------------------------------------ HERO (device + proof live inside) */}
        <section className="px-4 pb-14 pt-14 sm:px-6 sm:pt-20 lg:px-10 lg:pb-20 lg:pt-24" aria-labelledby="hero-heading">
          <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-10">
            <div className="flex min-w-0 flex-col gap-6 lg:col-span-7">
              <p className={EYEBROW} style={{ color: ACCENT }}>
                Provenance &middot; authenticity infrastructure for resale
              </p>
              <h1
                id="hero-heading"
                className="font-extrabold"
                style={{
                  fontFamily: "var(--font-display-mono)",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.02,
                  fontSize: "clamp(2.2rem, 5vw + 0.6rem, 4.1rem)",
                  color: FG,
                }}
              >
                A trust score you can watch being built.
              </h1>
              <p className={`${PROSE_WIDTH_HERO} text-[18px] font-normal leading-[1.6]`} style={{ color: MUTED }}>
                Every listing on Provenance carries four independent authenticity checks. Toggle
                any of them below, in any order — the score, the qualitative label, and the
                listing badge all recompute instantly, with nothing hidden behind a click.
              </p>
              <div>
                <a
                  href="#closing-cta"
                  className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-extrabold transition-transform active:scale-[0.98] ${FOCUS_RING}`}
                  style={{ backgroundColor: ACCENT, color: INK }}
                >
                  Browse verified listings
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </div>

            <div className="min-w-0 lg:col-span-5" id="hero-meter">
              <div className="rounded-3xl p-5 sm:p-6" style={{ border: `1px solid ${BORDER}`, backgroundColor: SURFACE }}>
                <p className={CAPTION} style={{ color: MUTED }}>
                  Fig. 01 &mdash; live, recomputes as you toggle
                </p>
                <div className="mt-3">
                  <AuthenticityMeter state={checks} onToggle={toggleCheck} idPrefix="hero" />
                </div>

                <div className="mt-5 border-t pt-5" style={{ borderColor: BORDER }}>
                  <p className={CAPTION} style={{ color: MUTED }}>
                    This listing, scored by your checks above
                  </p>
                  <div className="mt-3">
                    <ListingCard listing={sampleListing} compact />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------ PRODUCT PREVIEW */}
        <Reveal>
          <section className="px-4 py-14 sm:px-6 lg:px-10 lg:py-20" aria-labelledby="preview-heading">
            <div className="mx-auto max-w-[1280px]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className={EYEBROW} style={{ color: ACCENT }}>
                    Every listing, scored the same way
                  </p>
                  <h2
                    id="preview-heading"
                    className="mt-3 font-extrabold"
                    style={{ fontSize: "clamp(1.7rem, 2.6vw + 0.8rem, 2.6rem)", lineHeight: 1.08, color: FG }}
                  >
                    Four checks, run on every item before a buyer ever asks.
                  </h2>
                </div>
                <p className={`${CAPTION} hidden shrink-0 sm:block`} style={{ color: MUTED }}>
                  02
                </p>
              </div>
              <p className={`${PROSE_WIDTH_BODY} mt-4 text-[16px] leading-[1.6]`} style={{ color: MUTED }}>
                Each listing below carries its own fixed combination of checks, run through the
                same scoring function as the meter above. Open &ldquo;Which checks passed&rdquo; on
                any card to see exactly what earned its score.
              </p>

              <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {LISTINGS.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            </div>
          </section>
        </Reveal>

        {/* ------------------------------------------------------------ VALUE, THREE WAYS */}
        <Reveal>
          <section className="px-4 py-14 sm:px-6 lg:px-10 lg:py-20" style={{ backgroundColor: SURFACE }} aria-labelledby="value-heading">
            <div className="mx-auto max-w-[1280px]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className={EYEBROW} style={{ color: ACCENT }}>
                    Same four checks, three outcomes
                  </p>
                  <h2
                    id="value-heading"
                    className="mt-3 font-extrabold"
                    style={{ fontSize: "clamp(1.7rem, 2.6vw + 0.8rem, 2.6rem)", lineHeight: 1.08, color: FG }}
                  >
                    A weighted score, not a checklist count.
                  </h2>
                </div>
                <p className={`${CAPTION} hidden shrink-0 sm:block`} style={{ color: MUTED }}>
                  03
                </p>
              </div>
              <p className={`${PROSE_WIDTH_BODY} mt-4 text-[16px] leading-[1.6]`} style={{ color: MUTED }}>
                Two listings can pass two checks each and land on different scores &mdash; or the
                same score for two entirely different reasons &mdash; because every check carries
                its own weight. Try a combination and watch the meter in the hero update.
              </p>

              <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-3">
                {SCENARIOS.map((scenario) => {
                  const { score: scenarioScore, band: scenarioBand } = summarize(scenario.state);
                  const isLive = scenario.state.every((v, i) => v === checks[i]);
                  return (
                    <div
                      key={scenario.id}
                      className="flex min-w-0 flex-col gap-3 rounded-2xl p-5"
                      style={{
                        border: `1px solid ${isLive ? ACCENT : BORDER}`,
                        backgroundColor: isLive ? SURFACE_RAISED : BG,
                      }}
                    >
                      <h3 className="text-[14px] font-extrabold" style={{ color: FG }}>
                        {scenario.label}
                      </h3>
                      <p className="text-[12px]" style={{ color: MUTED }}>
                        {scenario.blurb}
                      </p>

                      <div className="flex items-baseline gap-1.5">
                        <span className="font-extrabold tabular-nums" style={{ fontSize: "2.1rem", color: FG }}>
                          {scenarioScore}
                        </span>
                        <span className="text-sm font-semibold" style={{ color: MUTED }}>
                          /100
                        </span>
                        <span
                          className={`ml-1 shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase ${STAT_TRACKING}`}
                          style={{
                            color: scenarioBand.badgeworthy ? ACCENT : MUTED,
                            border: `1px solid ${scenarioBand.badgeworthy ? ACCENT : BORDER}`,
                          }}
                        >
                          {scenarioBand.label}
                        </span>
                      </div>

                      <ul className="flex flex-wrap gap-1.5" style={{ fontVariantNumeric: "tabular-nums" }}>
                        {CHECKS.map((check, i) => (
                          <li
                            key={check.id}
                            className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                            style={{
                              color: scenario.state[i] ? ACCENT : MUTED,
                              border: `1px solid ${scenario.state[i] ? ACCENT : BORDER}`,
                            }}
                          >
                            {check.label.split(" ")[0]} {scenario.state[i] ? `+${check.weight}` : "off"}
                          </li>
                        ))}
                      </ul>

                      {isLive ? (
                        <span className="mt-1 inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-2 text-[12px] font-semibold" style={{ color: ACCENT }}>
                          <Sparkles className="h-3 w-3" aria-hidden="true" />
                          This is the hero&apos;s current combination
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setChecks(scenario.state)}
                          className={`mt-1 inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-2 text-[12px] font-semibold ${FOCUS_RING}`}
                          style={{ color: ACCENT, border: `1px solid ${BORDER}` }}
                        >
                          Try this combination
                          <ArrowRight className="h-3 w-3" aria-hidden="true" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </Reveal>

        {/* ------------------------------------------------------------ SOCIAL PROOF */}
        <Reveal>
          <section className="px-4 py-14 sm:px-6 lg:px-10 lg:py-20" aria-labelledby="proof-heading">
            <div className="mx-auto max-w-[1280px]">
              <p className={EYEBROW} style={{ color: ACCENT }}>
                Buyers and sellers who stopped guessing
              </p>
              <h2
                id="proof-heading"
                className="mt-3 font-extrabold"
                style={{ fontSize: "clamp(1.7rem, 2.6vw + 0.8rem, 2.6rem)", lineHeight: 1.08, color: FG }}
              >
                A score you can take apart, not just trust.
              </h2>

              <div className="mt-6 flex flex-wrap gap-3">
                {STAT_CHIPS.map((stat, i) => {
                  const Icon = i === 0 ? Sparkles : i === 1 ? Star : Users;
                  return (
                    <div
                      key={stat.id}
                      className="inline-flex items-center gap-2 rounded-full px-4 py-2"
                      style={{ border: `1px solid ${BORDER}`, backgroundColor: SURFACE }}
                    >
                      <Icon className="h-4 w-4" style={{ color: ACCENT }} aria-hidden="true" />
                      <span className="text-[13px] font-extrabold tabular-nums" style={{ color: FG }}>
                        {stat.value}
                      </span>
                      <span className="text-[13px]" style={{ color: MUTED }}>
                        {stat.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-3">
                {TESTIMONIALS.map((testimonial) => (
                  <figure
                    key={testimonial.id}
                    className="flex min-w-0 flex-col gap-4 rounded-2xl p-5"
                    style={{ border: `1px solid ${BORDER}`, backgroundColor: SURFACE }}
                  >
                    <Quote className="h-5 w-5" style={{ color: ACCENT }} aria-hidden="true" />
                    <blockquote className={`${PROSE_WIDTH_CARD} text-[14px] leading-[1.6]`} style={{ color: MUTED }}>
                      {testimonial.quote}
                    </blockquote>
                    <figcaption className="flex items-center gap-3">
                      <span
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-extrabold"
                        style={{ backgroundColor: SURFACE_RAISED, color: ACCENT, border: `1px solid ${BORDER}` }}
                        aria-hidden="true"
                      >
                        {testimonial.initials}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-[13px] font-extrabold" style={{ color: FG }}>
                          {testimonial.name}
                        </span>
                        <span className="block truncate text-[12px]" style={{ color: MUTED }}>
                          {testimonial.role}
                        </span>
                      </span>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </section>
        </Reveal>

        {/* ------------------------------------------------------------ CLOSING CTA (quotes the live score) */}
        <Reveal>
          <section
            id="closing-cta"
            className="px-4 py-16 sm:px-6 lg:px-10 lg:py-24"
            style={{ backgroundColor: BG, borderTop: `1px solid ${BORDER}` }}
            aria-labelledby="cta-heading"
          >
            <div className="mx-auto flex max-w-[860px] flex-col items-start gap-6">
              <p className={EYEBROW} style={{ color: ACCENT }}>
                Ready when your score is
              </p>
              <h2
                id="cta-heading"
                className="font-extrabold tabular-nums"
                style={{
                  fontFamily: "var(--font-display-mono)",
                  lineHeight: 1.05,
                  fontSize: "clamp(1.9rem, 3.5vw + 0.8rem, 3.2rem)",
                  color: FG,
                }}
              >
                Your current combination scores {score}/100 &mdash; {band.label}.
              </h2>
              <p className={`${PROSE_WIDTH_BODY} text-[16px] leading-[1.6]`} style={{ color: MUTED }}>
                That number comes from the same four toggles in the hero above — move one and this
                line changes with it. List your first item and start building your own score.
              </p>
              <a
                href="#hero-heading"
                className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-extrabold transition-transform active:scale-[0.98] ${FOCUS_RING}`}
                style={{ backgroundColor: ACCENT, color: INK }}
              >
                List your first item
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <p className="text-[12px]" style={{ color: MUTED }}>
                No listing fee until it sells.
              </p>
            </div>
          </section>
        </Reveal>
      </main>
    </>
  );
}
