"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowRight, Quote, ShieldCheck, Star } from "lucide-react";
import BubbleStage from "./bubble-stage";
import WeightPanel from "./weight-panel";
import ListingCard from "./listing-card";
import FaqAccordion from "./faq-accordion";
import {
  DEFAULT_WEIGHTS,
  discountPct,
  GRID_ORDER,
  ITEM_NAME,
  LISTINGS,
  matchPreset,
  packBubbles,
  rankListings,
  TESTIMONIALS,
  TRUST_SIGNALS,
  TRUST_STATS,
  type ListingId,
  type Weights,
} from "./data";
import { cx, FOCUS, MUTED_TEXT, NUM } from "./tokens";

const SKIP_LINK =
  "sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-50 focus-visible:rounded-full focus-visible:bg-[#111114] focus-visible:px-4 focus-visible:py-2 focus-visible:text-[13px] focus-visible:font-semibold focus-visible:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E7490]";

const STAR_POSITIONS = [0, 1, 2, 3, 4];

const NAV_LINK = cx(
  "inline-flex items-center py-2 text-[13px] font-semibold text-[#52525B] transition-colors hover:text-[#111114]",
  FOCUS,
  "rounded-sm",
);

export default function BubbleMatchLanding() {
  const [weights, setWeights] = useState<Weights>(DEFAULT_WEIGHTS);
  const reduceMotion = useReducedMotion();

  const ranked = useMemo(() => rankListings(weights), [weights]);
  const bubbles = useMemo(() => packBubbles(ranked), [ranked]);
  const top = ranked[0];
  const activePreset = matchPreset(weights);

  const byId = useMemo(() => {
    const map = new Map<ListingId, (typeof ranked)[number]>();
    for (const l of ranked) map.set(l.id, l);
    return map;
  }, [ranked]);

  const fadeUp: Variants = reduceMotion
    ? { hidden: { opacity: 1, y: 0 }, show: { opacity: 1, y: 0 } }
    : { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } };

  return (
    <div className="bg-[#FAFAFA] text-[#111114]">
      <a href="#main-content" className={SKIP_LINK}>
        Skip to main content
      </a>

      {/* ------------------------------------------------------------------------------ Header */}
      <header className="sticky top-0 z-30 border-b border-zinc-200 bg-[#FAFAFA]/90 backdrop-blur">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4 sm:px-10 lg:px-16">
          <span className="flex items-center gap-2 text-base font-extrabold tracking-[-0.02em] text-[#111114]">
            <span className="h-2 w-2 rounded-full bg-[#0E7490]" aria-hidden="true" />
            repick
          </span>
          <nav aria-label="Primary" className="hidden items-center gap-7 sm:flex">
            <a href="#listings" className={NAV_LINK}>
              Listings
            </a>
            <a href="#value" className={NAV_LINK}>
              How it works
            </a>
            <a href="#faq" className={NAV_LINK}>
              FAQ
            </a>
          </nav>
          <a
            href="#listings"
            className={cx(
              "rounded-full bg-[#0E7490] px-4 py-2 text-[13px] font-semibold text-white transition-transform hover:-translate-y-0.5",
              FOCUS,
            )}
          >
            Browse listings
          </a>
        </div>
      </header>

      <main id="main-content">
        {/* -------------------------------------------------------------------------- Hero */}
        <section id="hero" className="relative overflow-hidden px-6 pb-20 pt-14 sm:px-10 lg:px-16 lg:pb-28 lg:pt-20">
          <div className="mx-auto max-w-[1400px]">
            <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-10">
              <motion.div
                initial="hidden"
                animate="show"
                variants={fadeUp}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="min-w-0 lg:col-span-7"
              >
                <p className={cx("text-xs font-semibold uppercase text-[#155E75]", "tracking-[0.28em]")}>
                  Live match visualizer
                </p>
                <h1 className="mt-5" style={{ fontFamily: "var(--font-display-grotesk)" }}>
                  <span className="block text-[clamp(1.2rem,1.1vw+0.9rem,1.7rem)] font-normal leading-[1.15] text-[#52525B]">
                    Same bike, six sellers.
                  </span>
                  <span className="block text-[clamp(2.6rem,4.8vw+1rem,5.5rem)] font-extrabold leading-[0.98] tracking-[-0.02em] text-[#111114]">
                    Bigger means
                    <br />
                    better match.
                  </span>
                </h1>
                <p className="mt-6 max-w-[555px] text-[18px] font-normal leading-[1.6] text-[#52525B]">
                  Every bubble below is a real listing for the {ITEM_NAME}. Its area is set by a weighted
                  score across price, condition, trust and shipping speed &mdash; drag any weight and all
                  six resize and reshuffle at once, live.
                </p>

                <div className="mt-8 rounded-2xl border border-zinc-200 bg-white p-5">
                  <WeightPanel weights={weights} onChange={setWeights} activePreset={activePreset} />
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <a
                    href="#listings"
                    className={cx(
                      "inline-flex items-center gap-2 rounded-full bg-[#0E7490] px-6 py-3 text-[15px] font-semibold text-white transition-transform hover:-translate-y-0.5",
                      FOCUS,
                    )}
                  >
                    Compare all six listings
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                  <span className="text-sm font-normal text-[#52525B]">No account needed to explore weights.</span>
                </div>
              </motion.div>

              {/* Bubble-pack + full tag-set spotlight — the required proof, inside the hero itself */}
              <motion.div
                initial="hidden"
                animate="show"
                variants={fadeUp}
                transition={{ duration: 0.55, delay: reduceMotion ? 0 : 0.12, ease: [0.22, 1, 0.36, 1] }}
                className="min-w-0 lg:col-span-5"
              >
                <BubbleStage bubbles={bubbles} weights={weights} />
              </motion.div>
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------------------------- Listings grid */}
        <section id="listings" className="border-t border-zinc-200 px-6 py-24 sm:px-10 lg:px-16">
          <div className="mx-auto max-w-[1400px]">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="max-w-[500px]"
            >
              <h2 className="text-[clamp(1.75rem,1.6vw+1.3rem,2.5rem)] font-extrabold leading-[1.1] tracking-[-0.02em] text-[#111114]">
                Every listing comes with its receipts.
              </h2>
              <p className="mt-4 max-w-[500px] text-[16px] font-normal leading-[1.6] text-[#52525B]">
                Match score, condition grade, seller verification and the before/after price sit in their
                own row &mdash; never stamped over the photo where a failed image could hide them.
              </p>
            </motion.div>

            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {GRID_ORDER.map((id, i) => {
                const listing = LISTINGS.find((l) => l.id === id)!;
                const scored = byId.get(id)!;
                return (
                  <motion.div
                    key={id}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-60px" }}
                    variants={fadeUp}
                    transition={{ duration: 0.45, delay: reduceMotion ? 0 : Math.min(i, 3) * 0.06 }}
                    whileHover={reduceMotion ? undefined : { y: -4 }}
                    className="min-w-0"
                  >
                    <ListingCard listing={listing} score={scored.score} />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------------------------- Value 3-split */}
        <section id="value" className="border-t border-zinc-200 px-6 py-24 sm:px-10 lg:px-16">
          <div className="mx-auto max-w-[1400px]">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="max-w-[500px]"
            >
              <h2 className="text-[clamp(1.75rem,1.6vw+1.3rem,2.5rem)] font-extrabold leading-[1.1] tracking-[-0.02em] text-[#111114]">
                Not a black-box ranking.
              </h2>
              <p className="mt-4 max-w-[500px] text-[16px] font-normal leading-[1.6] text-[#52525B]">
                Three things a re-sorted list can&rsquo;t show you, and a proportional bubble board can.
              </p>
            </motion.div>

            <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3">
              {[
                {
                  title: "Every score shows its work",
                  body: "Tap any bubble and its price, condition, trust and speed numbers sit next to the total — not just the final percentage.",
                },
                {
                  title: "Weights are yours, not fixed",
                  body: "There is no hidden default ranking. The four sliders you see are the entire formula, start to finish.",
                },
                {
                  title: "The whole board moves",
                  body: "Change one weight and all six bubbles resize together — not just a badge on the current winner.",
                },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-60px" }}
                  variants={fadeUp}
                  transition={{ duration: 0.45, delay: reduceMotion ? 0 : i * 0.08 }}
                  className="min-w-0 rounded-2xl border border-zinc-200 bg-white p-6"
                >
                  <span className={cx("text-xs font-semibold text-[#155E75]", "tracking-[0.12em]", NUM)}>
                    0{i + 1}
                  </span>
                  <h3 className="mt-3 text-[17px] font-extrabold leading-[1.25] text-[#111114]">{item.title}</h3>
                  <p className="mt-2 max-w-[300px] text-[14px] leading-[1.6] text-[#52525B]">{item.body}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------------------------- Social proof */}
        <section className="border-t border-zinc-200 px-6 py-24 sm:px-10 lg:px-16">
          <div className="mx-auto max-w-[1400px]">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="max-w-[500px]"
            >
              <h2 className="text-[clamp(1.75rem,1.6vw+1.3rem,2.5rem)] font-extrabold leading-[1.1] tracking-[-0.02em] text-[#111114]">
                Trusted by people who compared before they bought.
              </h2>
            </motion.div>

            <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
              <ul className="grid min-w-0 grid-cols-1 gap-6 sm:grid-cols-3 lg:col-span-8">
                {TESTIMONIALS.map((t, i) => (
                  <motion.li
                    key={t.name}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-60px" }}
                    variants={fadeUp}
                    transition={{ duration: 0.45, delay: reduceMotion ? 0 : i * 0.08 }}
                    className="min-w-0 rounded-2xl border border-zinc-200 bg-white p-5"
                  >
                    <Quote className="h-5 w-5 text-[#0E7490]" aria-hidden="true" />
                    <p className="mt-3 text-sm font-normal leading-[1.6] text-[#111114]">{t.quote}</p>
                    <div role="img" className="mt-4 flex items-center gap-1" aria-label={`Rated ${t.rating} out of 5`}>
                      {STAR_POSITIONS.map((starIndex) => (
                        <Star
                          key={starIndex}
                          aria-hidden="true"
                          className={cx("h-3.5 w-3.5", starIndex < t.rating ? "fill-[#0E7490] text-[#0E7490]" : "text-zinc-300")}
                        />
                      ))}
                    </div>
                    <p className="mt-3 text-xs font-semibold text-[#111114]">{t.name}</p>
                    <p className="mt-0.5 flex items-center gap-1 text-xs font-normal text-[#52525B]">
                      {t.verified && <ShieldCheck className="h-3 w-3 text-[#155E75]" aria-hidden="true" />}
                      {t.context}
                    </p>
                  </motion.li>
                ))}
              </ul>

              <div className="min-w-0 lg:col-span-4">
                <dl className="flex flex-col gap-6">
                  {TRUST_STATS.map((stat) => (
                    <div key={stat.label}>
                      <dt className={cx("text-xs font-semibold uppercase text-[#52525B]", "tracking-[0.12em]")}>
                        {stat.label}
                      </dt>
                      <dd className={cx("mt-1 text-3xl font-extrabold tracking-[-0.02em] text-[#111114]", NUM)}>
                        {stat.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            <div className="relative mt-14 overflow-hidden border-y border-zinc-200 py-4" aria-hidden="true">
              <div className="flex w-max animate-[marquee_32s_linear_infinite] gap-10 motion-reduce:animate-none">
                {[...TRUST_SIGNALS, ...TRUST_SIGNALS].map((signal, i) => (
                  <span key={`${signal}-${i}`} className="flex shrink-0 items-center gap-2 text-sm font-normal text-[#52525B]">
                    <ShieldCheck className="h-3.5 w-3.5 text-[#0E7490]" />
                    {signal}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------------------------- FAQ */}
        <section id="faq" className="border-t border-zinc-200 px-6 py-24 sm:px-10 lg:px-16">
          <div className="mx-auto max-w-[1400px]">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="max-w-[500px]"
            >
              <h2 className="text-[clamp(1.75rem,1.6vw+1.3rem,2.5rem)] font-extrabold leading-[1.1] tracking-[-0.02em] text-[#111114]">
                Questions before you weigh in.
              </h2>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="mt-10 max-w-[680px]"
            >
              <FaqAccordion />
            </motion.div>
          </div>
        </section>

        {/* -------------------------------------------------------------------------- Closing CTA */}
        <section id="cta" className="border-t border-zinc-200 px-6 py-24 sm:px-10 lg:px-16">
          <div className="mx-auto max-w-[1400px]">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-end"
            >
              <div className="min-w-0 lg:col-span-8">
                <h2 className="text-[clamp(1.9rem,2vw+1.3rem,3.25rem)] font-extrabold leading-[1.05] tracking-[-0.02em] text-[#111114]">
                  Ready when your weights are.
                </h2>
                <p className="mt-4 max-w-[500px] text-[16px] font-normal leading-[1.6] text-[#52525B]">
                  Right now, under your current sliders,{" "}
                  <span className="font-semibold text-[#111114]">{top.seller}&rsquo;s</span> listing is the top match
                  at <span className={cx("font-semibold text-[#155E75]", NUM)}>{Math.round(top.score)}%</span>{" "}
                  &mdash; Grade {top.grade}, {top.verified ? "a verified seller" : "an unverified seller"}, and{" "}
                  <span className={cx("font-semibold text-[#111114]", NUM)}>{discountPct(top)}% off</span> list.
                  Move any slider above and this line changes with it.
                </p>
              </div>
              <div className="min-w-0 lg:col-span-4 lg:text-right">
                <a
                  href="#listings"
                  className={cx(
                    "inline-flex items-center gap-2 rounded-full bg-[#0E7490] px-6 py-3 text-[15px] font-semibold text-white transition-transform hover:-translate-y-0.5",
                    FOCUS,
                  )}
                >
                  Claim {top.seller}&rsquo;s listing &middot; <span className={NUM}>${top.price}</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* ------------------------------------------------------------------------------ Footer */}
      <footer className="border-t border-zinc-200 px-6 py-10 sm:px-10 lg:px-16">
        <div className="mx-auto flex max-w-[1400px] flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <span className="flex items-center gap-2 text-sm font-semibold text-[#111114]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#0E7490]" aria-hidden="true" />
            repick
          </span>
          <p className={cx("text-xs font-normal", MUTED_TEXT)}>
            Listing data and match scores on this page are illustrative figures for this preview.
          </p>
        </div>
      </footer>
    </div>
  );
}
