"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Gauge, LineChart, ScanEye } from "lucide-react";
import { DEFAULT_WINDOW, LISTINGS, MIN_WINDOW, PRICE_HISTORY, WINDOW_PRESETS } from "./data";
import { headlineClause, headlineText, headlineMetric, formatUsd, type TimelineWindow } from "./model";
import { ACCENT_FILL, ACCENT_TEXT, BG, EYEBROW, FG_TEXT, FOCUS_RING, MUTED_TEXT, ON_ACCENT_FILL_TEXT, PROSE_WIDTH, PROSE_WIDTH_SM, SURFACE, SURFACE_BORDER } from "./tokens";
import { Reveal } from "./Reveal";
import TimelineBrush from "./TimelineBrush";
import ListingsGrid from "./ListingsGrid";

const VALUE_CARDS = [
  {
    icon: LineChart,
    title: "See the before, not just the now",
    body: "A single current price never tells you whether it's a good moment to buy -- only the months on either side of it do.",
  },
  {
    icon: ScanEye,
    title: "Every point stays on the chart",
    body: "Months outside your window dim, they don't vanish. You can always see the whole 24-month shape, not just the slice you picked.",
  },
  {
    icon: Gauge,
    title: "One drag, three numbers",
    body: "Before, inside, and after recompute together the instant you move the window -- never a separate step, never a stale figure.",
  },
];

const STATS = [
  { stat: "24 mo", label: "of resale price history behind every repick listing" },
  { stat: "3", label: "live comparisons recomputed on every drag step" },
  { stat: "0", label: "months hidden -- dimmed data stays on the chart" },
];

const TESTIMONIALS = [
  {
    quote: "I dragged the window over the month everyone panicked about the recall and watched the average actually bottom out. That's when I bought.",
    name: "Marcus T.",
  },
  {
    quote: "Being able to resize the window instead of just picking a month made it obvious the recovery took nine months, not one.",
    name: "Ines D.",
  },
  {
    quote: "The dimmed points outside my window were the detail that sold me -- nothing on the chart ever disappears, it just steps back.",
    name: "Priya R.",
  },
];

export default function Client() {
  const [win, setWin] = useState<TimelineWindow>(DEFAULT_WINDOW);
  const prefersReducedMotion = useReducedMotion();
  const metric = headlineMetric(PRICE_HISTORY, win);

  return (
    <main className={`${BG} ${FG_TEXT}`}>
      {/* ---------------------------------------------------------------- HERO + device + proof,
          all inside this single section -- the timeline brush and its comparison panel are the
          page's proof, and they render without leaving the hero. */}
      <section className="px-4 pb-14 pt-24 sm:px-6 sm:pt-28 lg:px-10 lg:pb-20 lg:pt-32" aria-labelledby="hero-heading">
        <div className="mx-auto max-w-[1320px]">
          <div className="flex flex-col gap-5 lg:max-w-[720px]">
            <p className={`${EYEBROW} ${ACCENT_TEXT}`}>repick &middot; price history, live</p>
            <h1 id="hero-heading" className="text-[clamp(2.25rem,4.4vw+1rem,3.75rem)] font-extrabold leading-[1.05] tracking-[-0.02em]">
              Drag the window. <span className={ACCENT_TEXT}>Watch the price answer.</span>
            </h1>
            <p className={`${PROSE_WIDTH} text-[17px] font-normal leading-[1.6] ${MUTED_TEXT}`}>
              Below is 24 real months of resale prices for one listing on repick. Drag the
              highlighted window anywhere on the line and the panel beneath it recomputes before,
              inside, and after -- instantly, with every month still visible either way.
            </p>
            <div>
              <a
                href="#listings"
                className={`${FOCUS_RING} ${ACCENT_FILL} ${ON_ACCENT_FILL_TEXT} mt-1 inline-flex items-center justify-center rounded-full px-6 py-3 text-[14px] font-semibold`}
              >
                See today&rsquo;s a7 III listings
              </a>
            </div>
          </div>

          <TimelineBrush data={PRICE_HISTORY} window={win} onChange={setWin} minWindow={MIN_WINDOW} presets={WINDOW_PRESETS} />
        </div>
      </section>

      {/* ---------------------------------------------------------------- PRODUCT PREVIEW */}
      <section id="listings" className="px-4 py-16 sm:px-6 lg:px-10 lg:py-20" aria-labelledby="listings-heading">
        <div className="mx-auto max-w-[1320px]">
          <Reveal>
            <h2 id="listings-heading" className="text-[clamp(1.6rem,2.4vw+1rem,2.4rem)] font-extrabold tracking-[-0.02em]">
              Live listings for this exact model
            </h2>
            <p className={`mt-2 ${PROSE_WIDTH} text-[16px] font-normal leading-[1.6] ${MUTED_TEXT}`}>
              The same a7 III the chart above tracks, plus two close substitutes, each with its
              own match reasoning, condition grade, and discount off its original price.
            </p>
          </Reveal>
          <div className="mt-8">
            <ListingsGrid listings={LISTINGS} />
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- VALUE TRIPTYCH */}
      <section className="px-4 py-16 sm:px-6 lg:px-10 lg:py-24" aria-labelledby="why-heading">
        <div className="mx-auto max-w-[1320px]">
          <Reveal>
            <h2 id="why-heading" className="text-[clamp(1.6rem,2.4vw+1rem,2.4rem)] font-extrabold tracking-[-0.02em]">
              Why a window beats a single number
            </h2>
          </Reveal>
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {VALUE_CARDS.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.08} className="min-w-0">
                <div className={`flex min-w-0 flex-col gap-2 rounded-2xl border ${SURFACE_BORDER} p-5`}>
                  <item.icon className={`h-5 w-5 ${ACCENT_TEXT}`} aria-hidden="true" />
                  <h3 className="text-[16px] font-semibold">{item.title}</h3>
                  <p className={`${PROSE_WIDTH_SM} text-[14px] font-normal leading-[1.6] ${MUTED_TEXT}`}>{item.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- SOCIAL PROOF */}
      <section className={`px-4 py-16 sm:px-6 lg:px-10 lg:py-20 ${SURFACE}`} aria-labelledby="proof-heading">
        <div className="mx-auto max-w-[1320px]">
          <Reveal>
            <h2 id="proof-heading" className="sr-only font-semibold">
              Buyer results
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {STATS.map((row) => (
                <div key={row.label} className={`rounded-2xl border ${BG} ${SURFACE_BORDER} p-5 text-center`}>
                  <p className="text-[28px] font-extrabold tabular-nums">{row.stat}</p>
                  <p className={`mt-1 text-[13px] font-normal ${MUTED_TEXT}`}>{row.label}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <figure key={t.name} className={`rounded-2xl border ${BG} ${SURFACE_BORDER} p-5`}>
                <blockquote className={`${PROSE_WIDTH_SM} text-[14px] font-normal leading-[1.6]`}>&ldquo;{t.quote}&rdquo;</blockquote>
                <figcaption className={`mt-3 text-[12px] font-semibold ${MUTED_TEXT}`}>{t.name}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- CLOSING CTA -- quotes
          the SAME live `metric`, derived from the same `win` state the device above holds. */}
      <section className="px-4 py-16 sm:px-6 lg:px-10 lg:py-24" aria-labelledby="cta-heading">
        <motion.div
          className={`mx-auto flex max-w-[1320px] flex-col items-start gap-5 rounded-2xl border ${SURFACE_BORDER} p-8 sm:p-12`}
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 12 }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
        >
          <h2 id="cta-heading" className="text-[clamp(1.6rem,2.6vw+1rem,2.6rem)] font-extrabold tracking-[-0.02em]">
            Right now, your window is <span className={ACCENT_TEXT}>{headlineClause(metric)}</span>
          </h2>
          <p className={`${PROSE_WIDTH} text-[16px] font-normal leading-[1.6] ${MUTED_TEXT}`}>
            {headlineText(metric)} That average, {formatUsd(metric.insideAvg)}, comes from the
            exact {metric.months} {metric.months === 1 ? "month" : "months"} you last selected in
            the chart above.
          </p>
          <a
            href="#hero-heading"
            className={`${FOCUS_RING} ${ACCENT_FILL} ${ON_ACCENT_FILL_TEXT} mt-1 inline-flex items-center justify-center rounded-full px-6 py-3 text-[14px] font-semibold`}
          >
            Adjust the window
          </a>
        </motion.div>
      </section>
    </main>
  );
}
