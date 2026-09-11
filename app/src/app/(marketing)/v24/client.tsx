"use client";

import { useState } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowRight, BadgeCheck, Quote, ShieldCheck, Star } from "lucide-react";
import QuadrantPlot from "./quadrant-plot";
import SliderRow from "./slider-row";
import TierCard from "./tier-card";
import {
  explainRecommendation,
  nearestTier,
  TESTIMONIALS,
  TIERS,
  TRUST_SIGNALS,
  TRUST_STATS,
} from "./data";

const STAR_POSITIONS = [0, 1, 2, 3, 4];
const SKIP_LINK =
  "sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-sky-700 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white";

/** Splits explanation prose on its live "NN%" values and gives each one tabular-nums emphasis. */
function highlightPercents(text: string) {
  return text.split(/(\d+%)/g).map((chunk, i) =>
    /^\d+%$/.test(chunk) ? (
      <span key={i} className="font-semibold tabular-nums text-sky-700">
        {chunk}
      </span>
    ) : (
      <span key={i}>{chunk}</span>
    ),
  );
}

export default function QuadrantLanding() {
  const [priceSensitivity, setPriceSensitivity] = useState(50);
  const [urgency, setUrgency] = useState(50);
  const reduceMotion = useReducedMotion();

  const recommended = nearestTier(priceSensitivity, urgency);
  const explanation = explainRecommendation(recommended, priceSensitivity, urgency);

  const fadeUp: Variants = reduceMotion
    ? { hidden: { opacity: 1, y: 0 }, show: { opacity: 1, y: 0 } }
    : { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } };

  return (
    <div className="bg-white text-zinc-900">
      <a href="#main" className={SKIP_LINK}>
        Skip to main content
      </a>

      {/* ---------------------------------------------------------------- Nav */}
      <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4 sm:px-10 lg:px-16">
          <span className="flex items-center gap-2 text-base font-extrabold tracking-[-0.02em] text-zinc-900">
            <span className="h-2 w-2 rounded-full bg-sky-600" aria-hidden="true" />
            repick
          </span>
          <a
            href="#tiers"
            className="rounded-full border border-zinc-200 px-4 py-1.5 text-sm font-semibold text-zinc-700 transition-colors hover:border-sky-700/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
          >
            Compare all tiers
          </a>
        </div>
      </header>

      <main id="main">
        {/* ---------------------------------------------------------------- Hero */}
        <section className="relative overflow-hidden px-6 pb-16 pt-14 sm:px-10 lg:px-16 lg:pb-20 lg:pt-16">
          <div className="mx-auto max-w-[1400px]">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
              {/* Left: headline */}
              <motion.div
                initial="hidden"
                animate="show"
                variants={fadeUp}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="min-w-0 lg:col-span-5"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-700">
                  AI seller-tier matching
                </p>
                <h1 className="mt-5">
                  <span className="block text-[clamp(1.3rem,1.2vw+1rem,1.9rem)] font-normal leading-[1.15] text-zinc-500">
                    Move two sliders,
                  </span>
                  <span className="block text-[clamp(2.25rem,4.5vw+1rem,4rem)] font-extrabold leading-[1.02] tracking-[-0.02em] text-zinc-900">
                    land on
                  </span>
                  <span className="block text-[clamp(2.25rem,4.5vw+1rem,4rem)] font-extrabold leading-[1.02] tracking-[-0.02em] text-sky-700">
                    your tier.
                  </span>
                </h1>
                <p className="mt-6 max-w-[500px] text-[16px] font-normal leading-[1.6] text-zinc-500">
                  Price priority and sale urgency plot a single point across four repick service
                  tiers. Drag either one and the AI&rsquo;s reasoning, the match and the example
                  listing update with it &mdash; nothing below is static.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <a
                    href="#tiers"
                    className="inline-flex items-center gap-2 rounded-full bg-sky-700 px-6 py-3 text-[15px] font-semibold text-white transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
                  >
                    Start with {recommended.name}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                  <span className="text-sm font-normal text-zinc-500">No listing fee to try it.</span>
                </div>
              </motion.div>

              {/* Right: the device — sliders, plot, live explanation, recommended-tier preview.
                  All inside the hero component itself, per the structural rule. */}
              <motion.div
                initial="hidden"
                animate="show"
                variants={fadeUp}
                transition={{ duration: 0.55, delay: reduceMotion ? 0 : 0.12, ease: [0.22, 1, 0.36, 1] }}
                className="min-w-0 lg:col-span-7"
              >
                <div className="rounded-3xl border border-zinc-200 bg-zinc-50/60 p-5 sm:p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                    Your live match
                  </p>

                  <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <SliderRow
                      id="price-priority"
                      label="Price priority"
                      lowHint="Fair offer now"
                      highHint="Top dollar"
                      value={priceSensitivity}
                      onChange={setPriceSensitivity}
                    />
                    <SliderRow
                      id="sale-urgency"
                      label="Sale urgency"
                      lowHint="No rush"
                      highHint="Need it gone"
                      value={urgency}
                      onChange={setUrgency}
                    />
                  </div>

                  <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-[auto_1fr] sm:items-start">
                    <QuadrantPlot x={priceSensitivity} y={urgency} recommendedId={recommended.id} />

                    <div className="min-w-0">
                      <p aria-live="polite" className="text-[14px] font-normal leading-[1.6] text-zinc-600">
                        {highlightPercents(explanation)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 border-t border-zinc-200 pt-5">
                    <TierCard tier={recommended} recommended variant="compact" />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------------- Tier catalog */}
        <section id="tiers" className="border-t border-zinc-200 bg-zinc-50 px-6 py-24 sm:px-10 lg:px-16">
          <div className="mx-auto max-w-[1400px]">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="max-w-[500px]"
            >
              <h2 className="text-[clamp(1.75rem,1.6vw+1.3rem,2.5rem)] font-extrabold leading-[1.1] tracking-[-0.02em] text-zinc-900">
                Four tiers, one reasoning engine.
              </h2>
              <p className="mt-4 max-w-[460px] text-[16px] font-normal leading-[1.6] text-zinc-500">
                Every tier runs the same AI grading and matching &mdash; only the pricing strategy
                and turnaround window change. The one matching your current sliders is marked.
              </p>
            </motion.div>

            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {TIERS.map((tier, i) => (
                <motion.div
                  key={tier.id}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-60px" }}
                  variants={fadeUp}
                  transition={{ duration: 0.45, delay: reduceMotion ? 0 : Math.min(i, 3) * 0.06 }}
                  whileHover={reduceMotion ? undefined : { y: -4 }}
                  className="min-w-0"
                >
                  <TierCard tier={tier} recommended={tier.id === recommended.id} variant="full" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------------- Social proof */}
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
              <h2 className="text-[clamp(1.75rem,1.6vw+1.3rem,2.5rem)] font-extrabold leading-[1.1] tracking-[-0.02em] text-zinc-900">
                Sellers who dragged, then trusted the dot.
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
                    className="min-w-0 rounded-2xl border border-zinc-200 bg-zinc-50 p-5"
                  >
                    <Quote className="h-5 w-5 text-sky-700" aria-hidden="true" />
                    <p className="mt-3 text-sm font-normal leading-[1.6] text-zinc-600">{t.quote}</p>
                    {/* `role="img"` 필수 — 역할 없는 `<div>` 에 `aria-label` 은 허용되지 않아 axe 의
                      `aria-prohibited-attr` 가 실패한다(2026-09-12 승격 시 §3-1 해소). 별점은 그래픽이라 img 가 맞다. */}
                  <div role="img" className="mt-4 flex items-center gap-1" aria-label={`Rated ${t.rating} out of 5`}>
                      {STAR_POSITIONS.map((starIndex) => (
                        <Star
                          key={starIndex}
                          aria-hidden="true"
                          className={[
                            "h-3.5 w-3.5",
                            starIndex < t.rating ? "fill-sky-700 text-sky-700" : "text-zinc-300",
                          ].join(" ")}
                        />
                      ))}
                    </div>
                    <p className="mt-3 text-xs font-semibold text-zinc-900">{t.name}</p>
                    <p className="mt-0.5 flex items-center gap-1 text-xs font-normal text-zinc-500">
                      {t.verified && <BadgeCheck className="h-3 w-3 text-sky-700" aria-hidden="true" />}
                      {t.context}
                    </p>
                  </motion.li>
                ))}
              </ul>

              <div className="min-w-0 lg:col-span-4">
                <dl className="flex flex-col gap-6">
                  {TRUST_STATS.map((stat) => (
                    <div key={stat.label}>
                      <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">
                        {stat.label}
                      </dt>
                      <dd className="mt-1 text-3xl font-extrabold tabular-nums tracking-[-0.02em] text-zinc-900">
                        {stat.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            {/* Decorative marquee — every phrase already appears above as prose or stat copy. */}
            <div className="relative mt-14 overflow-hidden border-y border-zinc-200 py-4" aria-hidden="true">
              <div className="flex w-max animate-[marquee_32s_linear_infinite] gap-10 motion-reduce:animate-none">
                {[...TRUST_SIGNALS, ...TRUST_SIGNALS].map((signal, i) => (
                  <span
                    key={`${signal}-${i}`}
                    className="flex shrink-0 items-center gap-2 text-sm font-normal text-zinc-500"
                  >
                    <ShieldCheck className="h-3.5 w-3.5 text-sky-700" />
                    {signal}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------------- Closing CTA */}
        <section className="border-t border-zinc-200 bg-zinc-50 px-6 py-24 sm:px-10 lg:px-16">
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
                <h2 className="text-[clamp(1.9rem,2vw+1.3rem,3.25rem)] font-extrabold leading-[1.05] tracking-[-0.02em] text-zinc-900">
                  Ready when your dot is.
                </h2>
                <p className="mt-4 max-w-[500px] text-[16px] font-normal leading-[1.6] text-zinc-500">
                  Based on your priorities &mdash;{" "}
                  <span className="font-semibold tabular-nums text-sky-700">{priceSensitivity}%</span>{" "}
                  price, <span className="font-semibold tabular-nums text-sky-700">{urgency}%</span>{" "}
                  urgency &mdash;{" "}
                  <span className="font-semibold text-zinc-900">{recommended.name}</span> fits best:
                  a{" "}
                  <span className="font-semibold tabular-nums text-zinc-900">{recommended.turnaround}</span>{" "}
                  turnaround at{" "}
                  <span className="font-semibold tabular-nums text-zinc-900">{recommended.fee}</span>.
                  Move the sliders above and this line changes with it.
                </p>
              </div>
              <div className="min-w-0 lg:col-span-4 lg:text-right">
                <a
                  href="#tiers"
                  className="inline-flex items-center gap-2 rounded-full bg-sky-700 px-6 py-3 text-[15px] font-semibold text-white transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
                >
                  Get started with {recommended.name}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* ---------------------------------------------------------------- Footer */}
      <footer className="border-t border-zinc-200 px-6 py-10 sm:px-10 lg:px-16">
        <div className="mx-auto flex max-w-[1400px] flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <span className="flex items-center gap-2 text-sm font-semibold text-zinc-700">
            <span className="h-1.5 w-1.5 rounded-full bg-sky-600" aria-hidden="true" />
            repick
          </span>
          <p className="text-xs font-normal text-zinc-500">
            Tier turnaround, fees and match figures are illustrative for this preview.
          </p>
        </div>
      </footer>
    </div>
  );
}
