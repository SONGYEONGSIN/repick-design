"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowRight, Gauge as GaugeIcon } from "lucide-react";
import Gauge from "./Gauge";
import {
  VALUES,
  PRODUCTS,
  SORTS,
  PROOF_WEEK,
  PROOF_TOTAL,
  CRITERIA,
  TOTAL_MATCH,
  sortProducts,
  discountRate,
  EASE,
  VIEWPORT,
  cx,
  comma,
  EYEBROW,
  CAPTION,
  NUM,
  FOCUS,
  BadgeCheck,
  Check,
  type SortMode,
} from "./data";

const CTA_PRIMARY =
  "inline-flex items-center justify-center gap-2 rounded-full bg-[#6E56CF] px-6 py-3 text-sm font-semibold text-white transition-colors duration-150 hover:bg-[#7d67d6] " +
  FOCUS;

const NAV_LINK =
  "rounded text-sm font-normal text-[#A1A1AA] transition-colors duration-150 hover:text-white " +
  FOCUS;

const SEG_BTN =
  "flex items-center justify-center gap-1.5 rounded-full border px-4 py-2 text-center transition-colors duration-150 " +
  FOCUS;

export default function LandingClient() {
  const reduced = useReducedMotion();
  const [sortMode, setSortMode] = useState<SortMode>("match");
  const [proofRange, setProofRange] = useState<"week" | "total">("total");
  const sortRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const rangeRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const container: Variants = {
    hidden: {},
    show: {
      transition: { staggerChildren: reduced ? 0 : 0.09, delayChildren: 0.04 },
    },
  };
  const item: Variants = {
    hidden: reduced ? { opacity: 0 } : { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
  };

  const products = sortProducts(PRODUCTS, sortMode);
  const proof = proofRange === "week" ? PROOF_WEEK : PROOF_TOTAL;

  const onSortKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    idx: number,
  ) => {
    let next = idx;
    if (e.key === "ArrowRight") next = (idx + 1) % SORTS.length;
    else if (e.key === "ArrowLeft")
      next = (idx - 1 + SORTS.length) % SORTS.length;
    else return;
    e.preventDefault();
    setSortMode(SORTS[next].id);
    sortRefs.current[next]?.focus();
  };

  const RANGES: { id: "week" | "total"; label: string }[] = [
    { id: "week", label: "This week" },
    { id: "total", label: "All time" },
  ];
  const onRangeKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    idx: number,
  ) => {
    let next = idx;
    if (e.key === "ArrowRight") next = (idx + 1) % RANGES.length;
    else if (e.key === "ArrowLeft")
      next = (idx - 1 + RANGES.length) % RANGES.length;
    else return;
    e.preventDefault();
    setProofRange(RANGES[next].id);
    rangeRefs.current[next]?.focus();
  };

  return (
    <main className="min-h-screen overflow-x-clip bg-[#0B0B0F] text-white antialiased">
      {/* nav */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0B0B0F]/80 backdrop-blur-md">
        <nav className="mx-auto flex w-full max-w-[1120px] items-center justify-between px-5 py-4 sm:px-8">
          <a
            href="#top"
            className={cx(
              "rounded text-base font-extrabold tracking-[-0.02em] text-white",
              FOCUS,
            )}
          >
            Sundial
          </a>
          <div className="hidden items-center gap-7 sm:flex">
            <a href="#dial" className={NAV_LINK}>
              Match Dial
            </a>
            <a href="#preview" className={NAV_LINK}>
              Product Preview
            </a>
          </div>
          <a href="#cta" className={CTA_PRIMARY}>
            Start Matching
          </a>
        </nav>
      </header>

      {/* hero */}
      <section
        id="top"
        className="mx-auto w-full max-w-[1120px] px-5 pb-20 pt-14 sm:px-8 sm:pt-20"
      >
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-10">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="lg:col-span-5"
          >
            <motion.p
              variants={item}
              className={cx(
                EYEBROW,
                "inline-flex items-center gap-2 text-[#a894f7]",
              )}
            >
              <GaugeIcon className="h-3.5 w-3.5" aria-hidden />
              Match Accuracy Dial
            </motion.p>

            <motion.h1
              variants={item}
              className="mt-5 font-extrabold leading-[1.02] tracking-[-0.02em] text-white break-keep text-[clamp(2.2rem,7.4vw,3rem)] lg:text-[clamp(2.6rem,4vw,3.6rem)]"
            >
              Five criteria combine into{" "}
              <span className="text-[#6E56CF]">{TOTAL_MATCH}%</span>{" "}
              confidence
            </motion.h1>

            <motion.p
              variants={item}
              className="mt-6 max-w-md text-base font-normal leading-[1.6] text-[#A1A1AA] sm:text-lg"
            >
              Taste profile, size, budget, condition grade, market price —
              AI scores all five at once and combines them into a single
              match score. The dial on the right is showing that process
              right now.
            </motion.p>

            <motion.div
              variants={item}
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <a href="#cta" className={CTA_PRIMARY}>
                Get matched for free
                <ArrowRight className="h-4 w-4" strokeWidth={2.5} aria-hidden />
              </a>
              <span className="text-xs font-normal text-[#A1A1AA]">
                No sign-up required · Tap a criterion to see the evidence
              </span>
            </motion.div>

            <motion.div
              variants={item}
              className="mt-10 flex gap-8 border-t border-white/10 pt-6"
            >
              {PROOF_TOTAL.map((s) => (
                <div key={s.label}>
                  <div className="text-xl font-extrabold tabular-nums tracking-[0.12em] text-white">
                    {s.value}
                  </div>
                  <div className="mt-1 text-xs font-normal text-[#A1A1AA]">
                    {s.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* right: match accuracy dial — hero interaction */}
          <div
            id="dial"
            className="scroll-mt-24 rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 lg:col-span-7"
          >
            <div className="flex items-center justify-between gap-3">
              <p className={cx(EYEBROW, "flex items-center gap-2 text-[#a894f7]")}>
                <GaugeIcon className="h-3.5 w-3.5" aria-hidden />
                Fig. 01 — AI Match Accuracy Dial
              </p>
              <span className={cx(CAPTION, "hidden text-[#A1A1AA] sm:inline")}>
                Live calculation
              </span>
            </div>
            <div className="mt-6">
              <Gauge />
            </div>
          </div>
        </div>
      </section>

      {/* product preview — always-visible proof cards (no hover-gated reveal) */}
      <section
        id="preview"
        className="border-t border-white/10 bg-white/[0.015] scroll-mt-24"
      >
        <div className="mx-auto w-full max-w-[1120px] px-5 py-24 sm:px-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <motion.p
                initial={reduced ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={VIEWPORT}
                transition={{ duration: 0.5, ease: EASE }}
                className={cx(EYEBROW, "text-[#a894f7]")}
              >
                Fig. 02 — Here's how AI picked these
              </motion.p>
              <motion.h2
                initial={reduced ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={VIEWPORT}
                transition={{ duration: 0.5, ease: EASE, delay: reduced ? 0 : 0.05 }}
                className="mt-4 max-w-xl font-extrabold leading-[1.1] tracking-[-0.02em] text-white break-keep text-[clamp(1.7rem,4.4vw,2.4rem)]"
              >
                Behind the dial are real listings
              </motion.h2>
            </div>

            {/* sort control — result card order recalculates live */}
            <div
              role="radiogroup"
              aria-label="Product sort criteria"
              className="flex flex-wrap gap-2"
            >
              {SORTS.map((s, i) => {
                const Icon = s.icon;
                const selected = sortMode === s.id;
                return (
                  <button
                    key={s.id}
                    ref={(el) => {
                      sortRefs.current[i] = el;
                    }}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    aria-controls="product-grid"
                    tabIndex={selected ? 0 : -1}
                    onClick={() => setSortMode(s.id)}
                    onKeyDown={(e) => onSortKeyDown(e, i)}
                    className={cx(
                      SEG_BTN,
                      selected
                        ? "border-[#6E56CF]/60 bg-[#6E56CF]/10 text-white"
                        : "border-white/10 bg-transparent text-[#A1A1AA] hover:border-white/25 hover:text-white",
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" aria-hidden />
                    <span className="text-[0.76rem] font-semibold">{s.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div
            id="product-grid"
            aria-live="polite"
            className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3"
          >
            {products.map((card, i) => (
              <motion.figure
                key={card.id}
                layout={!reduced}
                initial={reduced ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={VIEWPORT}
                transition={{
                  duration: 0.5,
                  ease: EASE,
                  delay: reduced ? 0 : i * 0.06,
                }}
                className="m-0 overflow-hidden rounded-2xl border border-white/10 bg-[#0B0B0F]"
              >
                <div className="relative h-56 w-full overflow-hidden">
                  <Image
                    src={card.image.src}
                    alt={card.image.alt}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover"
                  />
                  <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full border border-[#6E56CF]/50 bg-[#6E56CF]/25 px-2.5 py-1 text-[0.7rem] font-semibold text-white backdrop-blur">
                    Grade {card.grade} · {card.gradeLabel}
                  </span>
                  <div
                    aria-hidden
                    className="absolute right-3 top-3 h-11 w-11 rounded-full"
                    style={{
                      background: `conic-gradient(#6E56CF ${card.match * 3.6}deg, rgba(255,255,255,0.18) 0deg)`,
                    }}
                  >
                    <div className="absolute inset-[3px] flex items-center justify-center rounded-full bg-[#0B0B0F]">
                      <span className={cx(NUM, "text-[0.62rem] font-extrabold text-white")}>
                        {card.match}%
                      </span>
                    </div>
                  </div>
                  <span className="sr-only">AI match {card.match}%</span>
                </div>
                <figcaption className="flex flex-col gap-2.5 p-5">
                  <div>
                    <p className={cx(CAPTION, "text-[#A1A1AA]")}>{card.brand}</p>
                    <h3 className="mt-0.5 text-base font-semibold leading-snug text-white">
                      {card.title}
                    </h3>
                  </div>
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                    <span
                      className={cx(
                        NUM,
                        "text-sm font-semibold text-[#A1A1AA] line-through",
                      )}
                    >
                      ₩{comma(card.retail)}
                    </span>
                    <span className={cx(NUM, "text-lg font-extrabold text-white")}>
                      ₩{comma(card.repick)}
                    </span>
                    <span
                      className={cx(
                        NUM,
                        "rounded-md bg-[#6E56CF] px-2 py-0.5 text-xs font-semibold text-white",
                      )}
                    >
                      -{discountRate(card)}%
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-[0.78rem] font-semibold text-white">
                    <BadgeCheck className="h-3.5 w-3.5 text-[#6E56CF]" aria-hidden />
                    {card.seller}
                    <span className="font-normal text-[#A1A1AA]">
                      · {card.sellerMeta}
                    </span>
                  </span>
                  <ul className="flex flex-col gap-1">
                    {card.tags.map((t) => (
                      <li
                        key={t}
                        className="flex items-center gap-1.5 text-[0.75rem] font-normal text-[#A1A1AA]"
                      >
                        <Check
                          className="h-3.5 w-3.5 shrink-0 text-[#6E56CF]"
                          strokeWidth={2.5}
                          aria-hidden
                        />
                        {t}
                      </li>
                    ))}
                  </ul>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </section>

      {/* value — 3 split with ghost numbers */}
      <section className="border-t border-white/10">
        <div className="mx-auto w-full max-w-[1120px] px-5 py-24 sm:px-8">
          <motion.p
            initial={reduced ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.5, ease: EASE }}
            className={cx(EYEBROW, "mb-12 block text-[#a894f7]")}
          >
            Fig. 03 — What the dial does
          </motion.p>

          <div className="grid grid-cols-1 gap-x-10 gap-y-12 md:grid-cols-3">
            {VALUES.map((v, i) => {
              const Icon = v.icon;
              return (
                <motion.div
                  key={v.index}
                  initial={reduced ? false : { opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={VIEWPORT}
                  transition={{
                    duration: 0.6,
                    ease: EASE,
                    delay: reduced ? 0 : i * 0.1,
                  }}
                  className="relative"
                >
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -top-6 right-0 select-none text-7xl font-extrabold leading-none tracking-[-0.02em] text-white/[0.05]"
                  >
                    {v.index}
                  </span>
                  <Icon
                    className="h-6 w-6 text-[#6E56CF]"
                    strokeWidth={2}
                    aria-hidden
                  />
                  <h2 className="mt-5 text-xl font-semibold tracking-[-0.02em] text-white">
                    {v.title}
                  </h2>
                  <p className="mt-3 text-sm font-normal leading-[1.6] text-[#A1A1AA]">
                    {v.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* social proof — toggle switches stat numbers in real time + pull quote */}
      <section className="border-t border-white/10">
        <div className="mx-auto w-full max-w-[1120px] px-5 py-24 sm:px-8">
          <div className="flex flex-col gap-6 border-b border-white/10 pb-16 sm:flex-row sm:items-end sm:justify-between">
            <motion.div
              initial={reduced ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT}
              transition={{ duration: 0.6, ease: EASE }}
              aria-live="polite"
              className="grid flex-1 grid-cols-1 gap-8 sm:grid-cols-3"
            >
              {proof.map((s) => (
                <div key={s.label}>
                  <div className="text-4xl font-extrabold tabular-nums tracking-[-0.02em] text-white sm:text-5xl">
                    {s.value}
                  </div>
                  <div className="mt-2 text-sm font-normal text-[#A1A1AA]">
                    {s.label}
                  </div>
                </div>
              ))}
            </motion.div>

            {/* interaction = perceived value: toggling instantly refreshes the three stats above with different data */}
            <div
              role="radiogroup"
              aria-label="Stats range"
              className="flex shrink-0 gap-2"
            >
              {RANGES.map((r, i) => {
                const selected = proofRange === r.id;
                return (
                  <button
                    key={r.id}
                    ref={(el) => {
                      rangeRefs.current[i] = el;
                    }}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    tabIndex={selected ? 0 : -1}
                    onClick={() => setProofRange(r.id)}
                    onKeyDown={(e) => onRangeKeyDown(e, i)}
                    className={cx(
                      SEG_BTN,
                      selected
                        ? "border-[#6E56CF]/60 bg-[#6E56CF]/10 text-white"
                        : "border-white/10 bg-transparent text-[#A1A1AA] hover:border-white/25 hover:text-white",
                    )}
                  >
                    <span className="text-[0.76rem] font-semibold">{r.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <motion.figure
            initial={reduced ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.6, ease: EASE, delay: reduced ? 0 : 0.05 }}
            className="mt-16 max-w-3xl"
          >
            <span
              aria-hidden
              className="text-6xl font-extrabold leading-none text-[#6E56CF]"
            >
              {"“"}
            </span>
            <blockquote className="mt-2 text-2xl font-semibold leading-[1.4] tracking-[-0.02em] text-white sm:text-[1.75rem]">
              Watching the dial fill in made me understand exactly why the
              price was what it was. Tap a criterion and the evidence shows
              up right away.
            </blockquote>
            <figcaption className="mt-6 text-sm font-normal text-[#A1A1AA]">
              <span className="font-semibold text-white">Jiho Han</span> ·
              Product Designer
            </figcaption>
          </motion.figure>
        </div>
      </section>

      {/* final CTA */}
      <section id="cta" className="border-t border-white/10">
        <div className="mx-auto w-full max-w-[1120px] px-5 py-28 sm:px-8">
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.6, ease: EASE }}
            className="max-w-2xl"
          >
            <h2 className="font-extrabold leading-[1.02] tracking-[-0.02em] text-white break-keep text-[clamp(2.1rem,6.4vw,3.6rem)]">
              The dial has finished calculating —
              <br />
              now all that's left is your match
            </h2>
            <p className="mt-6 max-w-lg text-base font-normal leading-[1.6] text-[#A1A1AA]">
              {CRITERIA.map((c) => c.label).join(" · ")} — the five criteria
              you saw above are calculated from real inspection and
              transaction data. Building your taste profile takes just one
              minute.
            </p>
            <div className="mt-9">
              <a
                href="#top"
                className={cx(CTA_PRIMARY, "px-7 py-3.5 text-base")}
              >
                Get matched for free
                <ArrowRight className="h-4 w-4" strokeWidth={2.5} aria-hidden />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* footer */}
      <footer className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-2 px-5 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <span className="text-base font-extrabold tracking-[-0.02em] text-white">
            Sundial
          </span>
          <span className="text-xs font-normal text-[#A1A1AA]">
            Secondhand, re-picked by AI · 2026 Sundial
          </span>
        </div>
      </footer>
    </main>
  );
}
