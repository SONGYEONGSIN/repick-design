"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useState, type ReactNode } from "react";

import { AuditConsole } from "./AuditConsole";
import { PreviewDeck } from "./PreviewDeck";
import {
  CLASSES,
  HERO_LISTINGS,
  LIMITS,
  PERIODS,
  TARGETS,
  VOICES,
  fmtInt,
  missRate,
  overBy,
  periodOf,
  type PeriodId,
} from "./data";

export default function Page() {
  const [periodId, setPeriodId] = useState<PeriodId>("p3");
  const prefersReduced = useReducedMotion();
  const reduce = prefersReduced ?? false;

  const period = periodOf(periodId);
  const rate = missRate(period, "all");
  const gap = overBy(period, "all");
  const stillOpenCases = CLASSES.reduce(
    (sum, c) => sum + c.stats[periodId].pending,
    0
  );

  const enter = (i: number) => ({
    initial: reduce ? false : ({ opacity: 0, y: 12 } as const),
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: reduce ? 0 : 0.5,
      delay: reduce ? 0 : i * 0.06,
      ease: "easeOut" as const,
    },
  });

  const swap = { duration: reduce ? 0 : 0.28, ease: "easeOut" as const };

  return (
    <div className="min-h-dvh overflow-x-clip bg-[#0B0B0F] font-normal text-white antialiased">
      {/* ---------- top bar ---------- */}
      <div className="border-b border-white/10">
        <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between gap-4 px-6 py-4 md:px-10">
          <span
            className="text-[15px] font-extrabold tracking-[-0.02em] text-white"
            style={{ fontFamily: "var(--font-display-wide)" }}
          >
            Repick
          </span>
          <span className="hidden text-[10px] font-medium uppercase tracking-[0.28em] text-[#A1A1AA] sm:block">
            Disclosure 03 &middot; quarterly miss report
          </span>
          <a
            href="#taxonomy"
            className="rounded-[3px] border border-white/20 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.16em] text-[#D4D4D8] transition-colors duration-150 hover:border-white/45 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F7C77A] motion-reduce:transition-none"
          >
            Read the misses
          </a>
        </div>
      </div>

      <main>
        {/* ---------- hero ---------- */}
        <section className="relative border-b border-white/10 py-16 md:py-20">
          <div className="mx-auto w-full max-w-[1200px] px-6 md:px-10">
            <div className="grid grid-cols-1 gap-x-6 gap-y-12 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <motion.p
                  {...enter(0)}
                  className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#F7C77A]"
                >
                  Fig. 01 &middot; what our appraisal model got wrong
                </motion.p>

                <motion.h1
                  {...enter(1)}
                  className="mt-6 text-[clamp(2.5rem,6.4vw,4.9rem)] font-extrabold leading-[0.98] tracking-[-0.02em] text-white"
                  style={{ fontFamily: "var(--font-display-wide)" }}
                >
                  We were wrong{" "}
                  <motion.span
                    key={`h1-${periodId}`}
                    initial={reduce ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={swap}
                    className="inline-block tabular-nums"
                  >
                    {fmtInt(period.misses)}
                  </motion.span>{" "}
                  times in {period.label}.
                </motion.h1>

                <motion.p
                  {...enter(2)}
                  className="mt-7 max-w-[554px] text-[18px] font-normal leading-[1.6] text-[#D4D4D8]"
                >
                  This is not an apology page. It is the count, the six kinds of
                  wrong, what each one did to the person on the other end, and
                  what we changed afterwards. Read it and decide for yourself
                  whether the rest of the site is worth your money.
                </motion.p>

                <motion.div
                  {...enter(3)}
                  role="group"
                  aria-label="Choose a reporting quarter"
                  className="mt-8 flex flex-wrap gap-2"
                >
                  {PERIODS.map((p) => {
                    const on = p.id === periodId;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        aria-pressed={on}
                        onClick={() => setPeriodId(p.id)}
                        className={`rounded-[3px] border px-4 py-2 text-[12px] font-medium uppercase tracking-[0.16em] transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F7C77A] motion-reduce:transition-none ${
                          on
                            ? "border-[#F2A93B] bg-[#F2A93B]/10 text-white"
                            : "border-white/15 text-[#A1A1AA] hover:border-white/35 hover:text-[#D4D4D8]"
                        }`}
                      >
                        {p.short}
                        {on ? " · in view" : ""}
                      </button>
                    );
                  })}
                </motion.div>

                <motion.dl
                  {...enter(4)}
                  className="mt-8 grid grid-cols-2 gap-x-6 gap-y-7 border-t border-white/12 pt-8 sm:grid-cols-4"
                >
                  <HeroStat
                    label="Appraisals run"
                    value={fmtInt(period.appraisals)}
                    swapKey={`a-${periodId}`}
                    reduce={reduce}
                  />
                  <HeroStat
                    label="Calls we got wrong"
                    value={fmtInt(period.misses)}
                    swapKey={`b-${periodId}`}
                    reduce={reduce}
                  />
                  <HeroStat
                    label="Miss rate"
                    value={`${rate.toFixed(2)}%`}
                    swapKey={`c-${periodId}`}
                    reduce={reduce}
                  />
                  <HeroStat
                    label={`Over our ${TARGETS.all.toFixed(2)}% ceiling by`}
                    value={`${gap.toFixed(2)} pt`}
                    swapKey={`d-${periodId}`}
                    reduce={reduce}
                    amber
                  />
                </motion.dl>

                <motion.p
                  {...enter(5)}
                  className="mt-6 max-w-[492px] text-[14px] font-normal leading-[1.6] text-[#A1A1AA]"
                >
                  {period.note}
                </motion.p>
              </div>

              {/* hero listings — proof visible without scrolling */}
              <motion.div {...enter(4)} className="lg:col-span-5">
                <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-[#A1A1AA]">
                  Live right now &middot; every listing carries its correction
                </p>
                <ul className="mt-4 flex flex-col gap-3">
                  {HERO_LISTINGS.map((l) => (
                    <li
                      key={l.ref}
                      className="border border-white/12 bg-white/[0.02] p-4"
                    >
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="text-[15px] font-medium text-white">
                          {l.title}
                        </span>
                        <span className="text-[10px] font-medium tracking-[0.16em] text-[#A1A1AA]">
                          {l.ref}
                        </span>
                      </div>
                      <p className="mt-1 text-[12px] font-normal leading-[1.6] text-[#A1A1AA]">
                        {l.meta}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        <HeroTag>{`Match ${l.matchPct}%`}</HeroTag>
                        <HeroTag>{`Grade ${l.grade}`}</HeroTag>
                        <HeroTag>{l.certification}</HeroTag>
                        <HeroTag>{`${l.discountPct}% under retail`}</HeroTag>
                      </div>
                      <p className="mt-3 border-t border-white/10 pt-3 text-[12px] font-normal leading-[1.6] text-[#D4D4D8]">
                        {l.stamp}
                      </p>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ---------- the taxonomy ---------- */}
        <AuditConsole periodId={periodId} />

        {/* ---------- limits ---------- */}
        <section className="relative border-t border-white/10 py-24 md:py-32">
          <div className="mx-auto w-full max-w-[1200px] px-6 md:px-10">
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#A1A1AA]">
                  Fig. 04
                </p>
                <h2
                  className="mt-4 text-[clamp(1.9rem,3.6vw,2.9rem)] font-extrabold leading-[1.05] tracking-[-0.02em] text-white"
                  style={{ fontFamily: "var(--font-display-wide)" }}
                >
                  Four things this model still cannot do
                </h2>
                <p className="mt-5 max-w-[431px] text-[15px] font-normal leading-[1.6] text-[#A1A1AA]">
                  These are limits, not bugs. Nothing shipped this quarter moves
                  any of them, and we would rather write them down than let you
                  discover them on your own item.
                </p>
              </div>
              <ul className="lg:col-span-7">
                {LIMITS.map((lim) => (
                  <li
                    key={lim.index}
                    className="grid grid-cols-1 gap-x-6 gap-y-3 border-t border-white/10 py-7 last:border-b sm:grid-cols-[7rem_1fr]"
                  >
                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#A1A1AA]">
                        Limit {lim.index}
                      </p>
                      <p
                        className="mt-2 text-[26px] font-extrabold leading-none tracking-[-0.02em] text-white tabular-nums"
                        style={{ fontFamily: "var(--font-display-wide)" }}
                      >
                        {lim.bound}
                      </p>
                    </div>
                    <p className="max-w-[492px] text-[16px] font-normal leading-[1.6] text-[#D4D4D8]">
                      {lim.body}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ---------- listings ---------- */}
        <PreviewDeck />

        {/* ---------- voices ---------- */}
        <section className="relative border-t border-white/10 py-24 md:py-32">
          <div className="mx-auto w-full max-w-[1200px] px-6 md:px-10">
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#A1A1AA]">
              Fig. 05 &middot; from people whose cases are counted above
            </p>
            <ul className="mt-10 grid grid-cols-1 gap-x-6 gap-y-10 md:grid-cols-3">
              {VOICES.map((v) => (
                <li key={v.who} className="relative border-t border-white/12 pt-8">
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-3 left-0 select-none text-[64px] font-extrabold leading-none text-white/[0.10]"
                    style={{ fontFamily: "var(--font-display-wide)" }}
                  >
                    &rdquo;
                  </span>
                  <blockquote className="relative max-w-[431px] text-[17px] font-normal leading-[1.6] text-[#D4D4D8]">
                    {v.quote}
                  </blockquote>
                  <p className="mt-4 text-[11px] font-medium uppercase tracking-[0.16em] text-[#A1A1AA]">
                    {v.who}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ---------- closing ---------- */}
        <section className="relative border-t border-white/10 py-24 md:py-32">
          <div className="mx-auto w-full max-w-[1200px] px-6 md:px-10">
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 lg:grid-cols-12">
              <div className="lg:col-span-8">
                <h2
                  className="text-[clamp(2.1rem,4.6vw,3.6rem)] font-extrabold leading-[1.02] tracking-[-0.02em] text-white"
                  style={{ fontFamily: "var(--font-display-wide)" }}
                >
                  Now go and look at the{" "}
                  {fmtInt(period.appraisals - period.misses)} we did not get
                  wrong.
                </h2>
                <p className="mt-6 max-w-[554px] text-[18px] font-normal leading-[1.6] text-[#D4D4D8]">
                  This page is republished every quarter, including the quarters
                  that read worse than the last one. Class 05 read worse this
                  time and it stayed on the page.
                </p>
                <div className="mt-9 flex flex-wrap gap-3">
                  <a
                    href="#listings"
                    className="rounded-[3px] bg-white px-6 py-3 text-[14px] font-medium text-[#0B0B0F] transition-colors duration-150 hover:bg-[#D4D4D8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F7C77A] motion-reduce:transition-none"
                  >
                    Browse the listings
                  </a>
                  <a
                    href="#taxonomy"
                    className="rounded-[3px] border border-[#F2A93B] px-6 py-3 text-[14px] font-medium text-[#F7C77A] transition-colors duration-150 hover:bg-[#F2A93B]/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F7C77A] motion-reduce:transition-none"
                  >
                    Back to the six classes
                  </a>
                </div>
              </div>
              <div className="lg:col-span-4">
                <dl className="flex flex-col gap-6 border-t border-white/12 pt-8">
                  <div>
                    <dt className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#A1A1AA]">
                      Reported quarter
                    </dt>
                    <dd
                      className="mt-2 text-[22px] font-extrabold tracking-[-0.02em] text-white"
                      style={{ fontFamily: "var(--font-display-wide)" }}
                    >
                      {period.label}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#A1A1AA]">
                      Cases still open
                    </dt>
                    <dd className="mt-2 text-[16px] font-medium text-white tabular-nums">
                      {fmtInt(stillOpenCases)} of {fmtInt(period.customer)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#A1A1AA]">
                      Report status
                    </dt>
                    <dd className="mt-2 text-[16px] font-medium text-[#F7C77A]">
                      Published, {period.compiled.replace("compiled ", "")}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 py-10">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-3 px-6 text-[12px] font-normal leading-[1.6] text-[#A1A1AA] md:flex-row md:items-center md:justify-between md:px-10">
          <p>
            Repick &middot; Disclosure 03 &middot; {period.label} &middot;{" "}
            {period.compiled}
          </p>
          <p className="max-w-[431px]">
            Figures cover every appraisal run in the quarter shown. Nothing is
            excluded for being embarrassing.
          </p>
        </div>
      </footer>
    </div>
  );
}

function HeroStat({
  label,
  value,
  swapKey,
  reduce,
  amber,
}: {
  label: string;
  value: string;
  swapKey: string;
  reduce: boolean;
  amber?: boolean;
}) {
  return (
    <div>
      <dt className="text-[10px] font-medium uppercase leading-[1.4] tracking-[0.16em] text-[#A1A1AA]">
        {label}
      </dt>
      <motion.dd
        key={swapKey}
        initial={reduce ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduce ? 0 : 0.28, ease: "easeOut" }}
        className={`mt-3 text-[clamp(1.5rem,2.4vw,1.9rem)] font-extrabold leading-none tracking-[-0.02em] tabular-nums ${
          amber ? "text-[#F7C77A]" : "text-white"
        }`}
        style={{ fontFamily: "var(--font-display-wide)" }}
      >
        {value}
      </motion.dd>
    </div>
  );
}

function HeroTag({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-white/20 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.16em] text-[#D4D4D8]">
      {children}
    </span>
  );
}
