"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowRight, ListChecks } from "lucide-react";
import VerificationTimeline from "./VerificationTimeline";
import {
  STATS,
  VALUES,
  PROOF,
  QUOTE,
  EASE,
  VIEWPORT,
  cx,
  EYEBROW,
  FOCUS,
  CTA_PRIMARY,
  NAV_LINK,
} from "./data";

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
    <main className="min-h-screen bg-[#0B0B0F] text-white antialiased">
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
            repick
          </a>
          <div className="hidden items-center gap-7 sm:flex">
            <a href="#verify" className={NAV_LINK}>
              Verification
            </a>
            <a href="#how" className={NAV_LINK}>
              How it works
            </a>
          </div>
          <a href="#cta" className={CTA_PRIMARY}>
            Get matched
          </a>
        </nav>
      </header>

      {/* hero */}
      <section
        id="top"
        className="mx-auto w-full max-w-[1120px] px-5 pb-20 pt-14 sm:px-8 sm:pt-20"
      >
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-2xl"
        >
          <motion.p
            variants={item}
            className={cx(EYEBROW, "inline-flex items-center gap-2 text-[#a894f7]")}
          >
            <ListChecks className="h-3.5 w-3.5" aria-hidden />
            AI Verification Log
          </motion.p>

          <motion.h1
            variants={item}
            className="mt-5 font-extrabold leading-[1.0] tracking-[-0.02em] text-white break-keep text-[clamp(2.2rem,7.4vw,3rem)] lg:text-[clamp(3rem,4.6vw,4.4rem)]"
          >
            Every match is
            <br />
            <span className="text-[#6E56CF]">verified</span> line by line
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-6 max-w-md text-base font-normal leading-[1.6] text-[#A1A1AA] sm:text-lg"
          >
            Before a listing ever reaches you, our AI runs it through four
            checks — condition, price, seller trust, and fit. Scroll down to
            watch one real listing pass all four.
          </motion.p>

          <motion.div
            variants={item}
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <a href="#cta" className={CTA_PRIMARY}>
              Get matched
              <ArrowRight className="h-4 w-4" strokeWidth={2.5} aria-hidden />
            </a>
            <span className="text-xs font-normal text-[#A1A1AA]">
              1-minute style profile · no card required
            </span>
          </motion.div>

          <motion.div
            variants={item}
            className="mt-10 flex gap-8 border-t border-white/10 pt-6"
          >
            {STATS.map((s) => (
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
      </section>

      {/* hero + section right after it: scroll-driven verification timeline */}
      <VerificationTimeline />

      {/* value — 3 split with ghost numbers */}
      <section id="how" className="border-t border-white/10">
        <div className="mx-auto w-full max-w-[1120px] px-5 py-24 sm:px-8">
          <motion.p
            initial={reduced ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.5, ease: EASE }}
            className={cx(EYEBROW, "mb-4 block text-[#a894f7]")}
          >
            Fig. 02 — Behind the checks
          </motion.p>
          <motion.h2
            initial={reduced ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.5, ease: EASE, delay: reduced ? 0 : 0.04 }}
            className="mb-12 max-w-xl font-extrabold leading-[1.1] tracking-[-0.02em] text-white text-[clamp(1.7rem,4.4vw,2.4rem)] break-keep"
          >
            The same four checks, on every listing
          </motion.h2>

          <div className="grid grid-cols-1 gap-x-10 gap-y-12 md:grid-cols-3">
            {VALUES.map((v, i) => {
              const Icon = v.icon;
              return (
                <motion.div
                  key={v.index}
                  initial={reduced ? false : { opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={VIEWPORT}
                  transition={{ duration: 0.6, ease: EASE, delay: reduced ? 0 : i * 0.1 }}
                  className="relative"
                >
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -top-6 right-0 select-none text-7xl font-extrabold leading-none tracking-[-0.02em] text-white/[0.05]"
                  >
                    {v.index}
                  </span>
                  <Icon className="h-6 w-6 text-[#6E56CF]" strokeWidth={2} aria-hidden />
                  <h3 className="mt-5 text-xl font-semibold tracking-[-0.02em] text-white">
                    {v.title}
                  </h3>
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
      <section className="border-t border-white/10" aria-labelledby="proof-heading">
        <div className="mx-auto w-full max-w-[1120px] px-5 py-24 sm:px-8">
          <h2 id="proof-heading" className="sr-only">
            Results from verified matches
          </h2>
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
            <span aria-hidden className="text-6xl font-extrabold leading-none text-[#6E56CF]">
              {"“"}
            </span>
            <blockquote className="mt-2 text-2xl font-semibold leading-[1.4] tracking-[-0.02em] text-white sm:text-[1.75rem]">
              {QUOTE.text}
            </blockquote>
            <figcaption className="mt-6 text-sm font-normal text-[#A1A1AA]">
              <span className="font-semibold text-white">{QUOTE.name}</span> ·{" "}
              {QUOTE.role}
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
              Verified before you
              <br />
              ever see it
            </h2>
            <p className="mt-6 max-w-lg text-base font-normal leading-[1.6] text-[#A1A1AA]">
              Build your style profile in a minute. From then on, every
              listing you see has already passed all four checks.
            </p>
            <div className="mt-9">
              <a href="#top" className={cx(CTA_PRIMARY, "px-7 py-3.5 text-base")}>
                Start matching free
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
            repick
          </span>
          <span className="text-xs font-normal text-[#A1A1AA]">
            AI-verified secondhand · 2026 repick
          </span>
        </div>
      </footer>
    </main>
  );
}
