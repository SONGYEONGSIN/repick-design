"use client";

import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowRight, BadgeCheck, Check, Table2 } from "lucide-react";
import CompareTable from "./CompareTable";
import {
  VALUES,
  PROOF,
  PREVIEW_CARDS,
  EASE,
  VIEWPORT,
  cx,
  comma,
  EYEBROW,
  CAPTION,
  NUM,
  FOCUS,
} from "./data";

const CTA_PRIMARY =
  "inline-flex items-center justify-center gap-2 rounded-full bg-[#6E56CF] px-6 py-3 text-sm font-semibold text-white transition-colors duration-150 hover:bg-[#7d67d6] " +
  FOCUS;

const NAV_LINK =
  "rounded text-sm font-normal text-[#A1A1AA] transition-colors duration-150 hover:text-white " +
  FOCUS;

export default function LandingClient() {
  const reduced = useReducedMotion();

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
            Tally
          </a>
          <div className="hidden items-center gap-7 sm:flex">
            <a href="#compare" className={NAV_LINK}>
              Compare table
            </a>
            <a href="#preview" className={NAV_LINK}>
              Match evidence
            </a>
          </div>
          <a href="#cta" className={CTA_PRIMARY}>
            Start matching
          </a>
        </nav>
      </header>

      {/* hero */}
      <section
        id="top"
        className="mx-auto w-full max-w-[1120px] px-5 pb-24 pt-14 sm:px-8 sm:pt-20"
      >
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-10">
          {/* left: editorial headline */}
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
              <Table2 className="h-3.5 w-3.5" aria-hidden />
              Ordinary resale vs. Tally
            </motion.p>

            <motion.h1
              variants={item}
              className="mt-5 font-extrabold leading-[1.02] tracking-[-0.02em] text-white break-keep text-[clamp(2.2rem,7.4vw,3rem)] lg:text-[clamp(2.6rem,4vw,3.6rem)]"
            >
              Same listing,
              <br />
              proven by{" "}
              <span className="text-[#6E56CF]">different evidence</span>
            </motion.h1>

            <motion.p
              variants={item}
              className="mt-6 max-w-md text-base font-normal leading-[1.6] text-[#A1A1AA] sm:text-lg"
            >
              Price, condition, seller trust, search time, and fit — five
              criteria compared side by side. Switch the category tab and the
              entire table recalculates using that category&apos;s real data.
            </motion.p>

            <motion.div
              variants={item}
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <a href="#compare" className={CTA_PRIMARY}>
                Try the comparison table
                <ArrowRight className="h-4 w-4" strokeWidth={2.5} aria-hidden />
              </a>
              <span className="text-xs font-normal text-[#A1A1AA]">
                No sign-up needed · Tap a row to expand the evidence
              </span>
            </motion.div>

            <motion.div
              variants={item}
              className="mt-10 flex gap-8 border-t border-white/10 pt-6"
            >
              {PROOF.map((s) => (
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

          {/* right: interactive compare table */}
          <div id="compare" className="scroll-mt-24 lg:col-span-7">
            <CompareTable />
          </div>
        </div>
      </section>

      {/* product preview — always-visible proof cards (no hover-gated reveal) */}
      <section
        id="preview"
        className="border-t border-white/10 bg-white/[0.015] scroll-mt-24"
      >
        <div className="mx-auto w-full max-w-[1120px] px-5 py-24 sm:px-8">
          <motion.p
            initial={reduced ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.5, ease: EASE }}
            className={cx(EYEBROW, "text-[#a894f7]")}
          >
            Fig. 02 — How the AI picked these
          </motion.p>
          <motion.h2
            initial={reduced ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.5, ease: EASE, delay: reduced ? 0 : 0.05 }}
            className="mt-4 max-w-xl font-extrabold leading-[1.1] tracking-[-0.02em] text-white break-keep text-[clamp(1.7rem,4.4vw,2.4rem)]"
          >
            Behind the table are real listings
          </motion.h2>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {PREVIEW_CARDS.map((card, i) => (
              <motion.figure
                key={card.id}
                initial={reduced ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={VIEWPORT}
                transition={{
                  duration: 0.6,
                  ease: EASE,
                  delay: reduced ? 0 : i * 0.1,
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
                  <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full border border-white/20 bg-black/50 px-2.5 py-1 text-[0.7rem] font-semibold text-white backdrop-blur">
                    <span className={NUM}>Match {card.match}%</span>
                  </span>
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
                        "text-sm font-semibold text-zinc-400 line-through",
                      )}
                    >
                      {comma(card.retail)} won
                    </span>
                    <span className={cx(NUM, "text-lg font-extrabold text-white")}>
                      {comma(card.repick)} won
                    </span>
                    <span
                      className={cx(
                        NUM,
                        "rounded-md bg-[#6E56CF] px-2 py-0.5 text-xs font-semibold text-white",
                      )}
                    >
                      -{Math.round((1 - card.repick / card.retail) * 100)}%
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-[0.78rem] font-semibold text-white">
                    <BadgeCheck className="h-3.5 w-3.5 text-[#6E56CF]" aria-hidden />
                    {card.seller}
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
            Fig. 03 — What the table does
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

      {/* social proof — stat band + pull quote */}
      <section className="border-t border-white/10">
        <div className="mx-auto w-full max-w-[1120px] px-5 py-24 sm:px-8">
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.6, ease: EASE }}
            className="grid grid-cols-1 gap-8 border-b border-white/10 pb-16 sm:grid-cols-3"
          >
            {PROOF.map((s) => (
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
              I switched categories with a single tab, and all five rows of
              numbers recalculated instantly. That&apos;s when I started
              trusting the table.
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
              The comparison is done,
              <br />
              all that&apos;s left is your match
            </h2>
            <p className="mt-6 max-w-lg text-base font-normal leading-[1.6] text-[#A1A1AA]">
              The five criteria in the table above are calculated from real
              inspection and transaction data. Building your taste profile
              takes just one minute.
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
            Tally
          </span>
          <span className="text-xs font-normal text-[#A1A1AA]">
            Secondhand, re-picked by AI · 2026 Tally
          </span>
        </div>
      </footer>
    </main>
  );
}
