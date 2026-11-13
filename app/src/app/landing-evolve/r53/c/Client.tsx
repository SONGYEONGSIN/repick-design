"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { BadgeCheck, Gauge, ShieldCheck, Sparkles, Tag } from "lucide-react";
import { DEFAULT_SELECTED_ID, LISTINGS } from "./data";
import { Reveal } from "./Reveal";
import {
  ACCENT_FILL,
  ACCENT_TEXT_LARGE,
  ACCENT_TEXT_SMALL,
  EYEBROW,
  FOCUS_RING,
  MUTED_TEXT,
  ON_ACCENT_FILL_TEXT,
  PROSE_WIDTH,
  STAT_LABEL,
  SURFACE,
} from "./tokens";

function formatUsd(value: number): string {
  return `$${value.toLocaleString("en-US")}`;
}

export default function Client() {
  const [selectedId, setSelectedId] = useState(DEFAULT_SELECTED_ID);
  const prefersReducedMotion = useReducedMotion();

  const selected = LISTINGS.find((l) => l.id === selectedId) ?? LISTINGS[0];

  return (
    <main className="bg-white text-[#0B0B0F]">
      {/* ---------------------------------------------------------------- HERO + plot + live detail panel,
          all in one component -- the detail panel is the page's proof and renders without
          navigating away from the hero. */}
      <section className="px-4 pb-14 pt-24 sm:px-6 sm:pt-28 lg:px-10 lg:pb-20 lg:pt-32" aria-labelledby="hero-heading">
        <div className="mx-auto grid max-w-[1320px] grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8">
          {/* Headline + plot -- left column */}
          <div className="flex min-w-0 flex-col gap-6 lg:col-span-7">
            <p className={`${EYEBROW} ${MUTED_TEXT}`}>repick · pick a point, see the proof</p>
            <h1
              id="hero-heading"
              className="text-[clamp(2.25rem,4.4vw+1rem,3.75rem)] font-extrabold leading-[1.05] tracking-[-0.02em]"
              style={{ fontFamily: "var(--font-display-mono)" }}
            >
              Price and condition, <span className={ACCENT_TEXT_LARGE}>plotted together</span>.
            </h1>
            <p className={`${PROSE_WIDTH} text-[17px] font-normal leading-[1.6] ${MUTED_TEXT}`}>
              Every dot is a real match. Pick one to see its full proof -- condition grade,
              verification, and how much it saves against retail.
            </p>

            <div
              className="relative mt-2 aspect-[4/3] w-full rounded-2xl border"
              style={{ borderColor: "#E2E8D5", backgroundColor: SURFACE }}
              role="group"
              aria-label="Price versus condition plot. Activate a point to see its full details below."
            >
              {/* Axis labels */}
              <span className={`absolute left-3 top-3 ${STAT_LABEL} ${MUTED_TEXT}`}>Higher price</span>
              <span className={`absolute bottom-3 left-3 ${STAT_LABEL} ${MUTED_TEXT}`}>Lower price</span>
              <span className={`absolute bottom-3 right-3 ${STAT_LABEL} ${MUTED_TEXT}`}>Better condition &rarr;</span>

              {LISTINGS.map((listing) => {
                const isSelected = listing.id === selectedId;
                return (
                  <button
                    key={listing.id}
                    type="button"
                    onClick={() => setSelectedId(listing.id)}
                    aria-pressed={isSelected}
                    aria-label={`${listing.title}, ${formatUsd(listing.price)}, condition score ${listing.conditionScore} of 100`}
                    className={`${FOCUS_RING} absolute flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 transition-transform ${
                      isSelected
                        ? `${ACCENT_FILL} border-[#0B0B0F] scale-125`
                        : "border-[#65A30D] bg-white hover:scale-110"
                    }`}
                    style={{ left: `${listing.xPct}%`, top: `${listing.yPct}%` }}
                  >
                    <span className="sr-only">{isSelected ? "Selected: " : "Select "}{listing.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Live detail panel -- inside the HERO component itself. */}
          <div className="min-w-0 lg:col-span-5">
            <div className="sticky top-24 rounded-2xl border p-6 shadow-sm" style={{ borderColor: "#E2E8D5" }} aria-live="polite">
              <div
                className="relative aspect-[4/3] w-full overflow-hidden rounded-xl"
                style={{ backgroundColor: SURFACE }}
              >
                <Image
                  key={selected.id}
                  src={`https://images.unsplash.com/photo-${selected.photoId}?auto=format&fit=crop&w=800&q=70`}
                  alt={selected.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] font-semibold">
                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 ${ACCENT_FILL} ${ON_ACCENT_FILL_TEXT}`}>
                  <Sparkles className="h-3 w-3" aria-hidden="true" /> {selected.matchPct}% match
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border px-2 py-1" style={{ borderColor: "#E2E8D5" }}>
                  {selected.grade}
                </span>
                {selected.verified ? (
                  <span className="inline-flex items-center gap-1 rounded-full border px-2 py-1" style={{ borderColor: "#E2E8D5" }}>
                    <ShieldCheck className="h-3 w-3" aria-hidden="true" /> Verified
                  </span>
                ) : null}
                <span className="inline-flex items-center gap-1 rounded-full border px-2 py-1" style={{ borderColor: "#E2E8D5" }}>
                  <BadgeCheck className="h-3 w-3" aria-hidden="true" /> {selected.discountPct}% off retail
                </span>
              </div>

              <h2 className="mt-3 text-[18px] font-semibold leading-snug">{selected.title}</h2>
              <p className={`text-[13px] font-normal ${MUTED_TEXT}`}>{selected.category}</p>

              <p className="mt-2 text-[30px] font-extrabold tabular-nums leading-none" style={{ fontFamily: "var(--font-display-mono)" }}>
                {formatUsd(selected.price)}
                <span className={`${MUTED_TEXT} ml-2 text-[16px] font-normal line-through`}>
                  {formatUsd(selected.retailPrice)}
                </span>
              </p>

              <div className="mt-4 flex items-center gap-2">
                <Gauge className={`h-4 w-4 ${ACCENT_TEXT_SMALL}`} aria-hidden="true" />
                <span className={`${STAT_LABEL} ${MUTED_TEXT}`}>Condition score</span>
                <span className="text-[14px] font-semibold tabular-nums">{selected.conditionScore} / 100</span>
              </div>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full" style={{ backgroundColor: "#E2E8D5" }}>
                <div className={`h-full ${ACCENT_FILL}`} style={{ width: `${selected.conditionScore}%` }} />
              </div>

              <p className="mt-4 flex items-start gap-2 text-[13px] font-normal leading-[1.5]">
                <Tag className={`mt-0.5 h-3.5 w-3.5 flex-none ${ACCENT_TEXT_SMALL}`} aria-hidden="true" />
                <span>{selected.reason}</span>
              </p>

              <a
                href="#start-browsing"
                className={`${FOCUS_RING} ${ACCENT_FILL} ${ON_ACCENT_FILL_TEXT} mt-6 flex w-full items-center justify-center rounded-full px-5 py-3 text-[14px] font-semibold`}
              >
                View this listing
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- VALUE TRIPTYCH */}
      <section className="px-4 py-16 sm:px-6 lg:px-10 lg:py-24" aria-labelledby="why-heading">
        <div className="mx-auto max-w-[1320px]">
          <Reveal>
            <h2 id="why-heading" className="text-[clamp(1.6rem,2.4vw+1rem,2.4rem)] font-extrabold tracking-[-0.02em]" style={{ fontFamily: "var(--font-display-mono)" }}>
              Why we plot it instead of listing it
            </h2>
          </Reveal>
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {[
              { title: "The trade-off is visual", body: "Price and condition move together on real listings -- a plot shows that relationship a feed never can." },
              { title: "Outliers stand out", body: "A great-condition item at a low price is instantly the dot in the corner, not buried on page three." },
              { title: "One tap, full proof", body: "Selecting a dot doesn't filter a list -- it opens the exact same proof panel every listing page uses." },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 0.08} className="min-w-0">
                <div className="flex min-w-0 flex-col gap-2 rounded-2xl border p-5" style={{ borderColor: "#E2E8D5" }}>
                  <h3 className="text-[16px] font-semibold">{item.title}</h3>
                  <p className={`${PROSE_WIDTH} text-[14px] font-normal leading-[1.6] ${MUTED_TEXT}`}>{item.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- SOCIAL PROOF */}
      <section className="px-4 py-16 sm:px-6 lg:px-10 lg:py-20" style={{ backgroundColor: SURFACE }} aria-labelledby="proof-heading">
        <div className="mx-auto max-w-[1320px]">
          <Reveal>
            <h2 id="proof-heading" className="sr-only">
              Buyer results
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {[
                { stat: "6 of 6", label: "plotted matches sold within a week" },
                { stat: "31%", label: "average discount against retail" },
                { stat: "2 sec", label: "average time to open a proof panel" },
              ].map((row) => (
                <div key={row.label} className="rounded-2xl border bg-white p-5 text-center" style={{ borderColor: "#E2E8D5" }}>
                  <p className="text-[28px] font-extrabold tabular-nums" style={{ fontFamily: "var(--font-display-mono)" }}>
                    {row.stat}
                  </p>
                  <p className={`mt-1 text-[13px] font-normal ${MUTED_TEXT}`}>{row.label}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              { quote: "I went straight for the dot furthest into the corner -- best condition, lowest price. Exactly what I wanted.", name: "Imogen S." },
              { quote: "Clicking around the plot told me more in thirty seconds than scrolling a grid for five minutes.", name: "Teo A." },
              { quote: "The condition score next to the price made the trade-off obvious immediately.", name: "Noor B." },
            ].map((t) => (
              <figure key={t.name} className="rounded-2xl border bg-white p-5" style={{ borderColor: "#E2E8D5" }}>
                <blockquote className={`${PROSE_WIDTH} text-[14px] font-normal leading-[1.6]`}>&ldquo;{t.quote}&rdquo;</blockquote>
                <figcaption className={`mt-3 text-[12px] font-semibold ${MUTED_TEXT}`}>{t.name}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- CLOSING CTA -- echoes the SAME live selection */}
      <section id="start-browsing" className="px-4 py-16 sm:px-6 lg:px-10 lg:py-24" aria-labelledby="cta-heading">
        <motion.div
          className="mx-auto flex max-w-[1320px] flex-col items-start gap-5 rounded-2xl border p-8 sm:p-12"
          style={{ borderColor: "#E2E8D5" }}
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 12 }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
        >
          <h2 id="cta-heading" className="text-[clamp(1.6rem,2.6vw+1rem,2.6rem)] font-extrabold tracking-[-0.02em]" style={{ fontFamily: "var(--font-display-mono)" }}>
            Still deciding on the <span className={ACCENT_TEXT_LARGE}>{selected.title}</span>?
          </h2>
          <p className={`${PROSE_WIDTH} text-[15px] font-normal leading-[1.6] ${MUTED_TEXT}`}>
            {formatUsd(selected.price)}, {selected.discountPct}% off retail, condition score {selected.conditionScore} of 100.
            Pick a different dot above any time -- this panel always matches your last selection.
          </p>
          <a
            href="#hero-heading"
            className={`${FOCUS_RING} ${ACCENT_FILL} ${ON_ACCENT_FILL_TEXT} mt-1 inline-flex items-center justify-center rounded-full px-6 py-3 text-[14px] font-semibold`}
          >
            Back to the plot
          </a>
        </motion.div>
      </section>
    </main>
  );
}
