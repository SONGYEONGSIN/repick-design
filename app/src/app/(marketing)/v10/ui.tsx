"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowRight, Waypoints } from "lucide-react";
import PreferenceGraph from "./PreferenceGraph";
import ProductPreview from "./ProductPreview";
import {
  STATS,
  VALUES,
  PROOF,
  TESTIMONIAL,
  EASE,
  VIEWPORT,
  cx,
  EYEBROW,
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
            Lattice
          </a>
          <div className="hidden items-center gap-7 sm:flex">
            <a href="#preview" className={NAV_LINK}>
              Matches
            </a>
            <a href="#how" className={NAV_LINK}>
              Method
            </a>
          </div>
          <a href="#cta" className={CTA_PRIMARY}>
            See my graph
          </a>
        </nav>
      </header>

      {/* hero */}
      <section
        id="top"
        className="mx-auto w-full max-w-[1120px] px-5 pb-24 pt-14 sm:px-8 sm:pt-20"
      >
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-12">
          {/* left: editorial headline */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="relative lg:col-span-5"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute -top-10 -left-2 select-none text-[7rem] font-extrabold leading-none tracking-[-0.02em] text-white/[0.04]"
            >
              01
            </span>

            <motion.p
              variants={item}
              className={cx(
                EYEBROW,
                "relative inline-flex items-center gap-2 text-[#a894f7]",
              )}
            >
              <Waypoints className="h-3.5 w-3.5" aria-hidden />
              Preference → Product Graph
            </motion.p>

            <motion.h1
              variants={item}
              className="relative mt-5 text-[clamp(2.2rem,7.4vw,3rem)] font-extrabold leading-[1.0] tracking-[-0.02em] text-white lg:text-[clamp(3rem,4.6vw,4.4rem)]"
            >
              Trace every match
              <br />
              back to a <span className="text-[#6E56CF]">reason.</span>
            </motion.h1>

            <motion.p
              variants={item}
              className="relative mt-6 max-w-md text-base font-normal leading-[1.6] text-[#A1A1AA] sm:text-lg"
            >
              Five signals you set — style, size, budget, condition, trend —
              wired live to four real listings. Select any signal and watch
              the reasoning behind each match update in front of you.
            </motion.p>

            <motion.div
              variants={item}
              className="relative mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <a href="#cta" className={CTA_PRIMARY}>
                See my graph
                <ArrowRight className="h-4 w-4" strokeWidth={2.5} aria-hidden />
              </a>
              <span className="text-xs font-normal text-[#A1A1AA]">
                5 signals · 4 live matches
              </span>
            </motion.div>

            <motion.div
              variants={item}
              className="relative mt-10 flex gap-8 border-t border-white/10 pt-6"
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

          {/* right: preference → product graph */}
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: reduced ? 0 : 0.22 }}
            className="lg:col-span-7"
          >
            <PreferenceGraph />
          </motion.div>
        </div>
      </section>

      {/* product preview — 4 parallel rich cards */}
      <ProductPreview />

      {/* method — 3 split with ghost numbers */}
      <section id="how" className="border-t border-white/10 bg-white/[0.015]">
        <div className="mx-auto w-full max-w-[1120px] px-5 py-24 sm:px-8">
          <motion.p
            initial={reduced ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.5, ease: EASE }}
            className={cx(EYEBROW, "mb-12 block text-[#a894f7]")}
          >
            Fig. 03 — How the graph builds
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

      {/* social proof — stat band + testimonial */}
      <section className="border-t border-white/10">
        <div className="mx-auto w-full max-w-[1120px] px-5 py-24 sm:px-8">
          <motion.p
            initial={reduced ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.5, ease: EASE }}
            className={cx(EYEBROW, "mb-10 block text-[#a894f7]")}
          >
            Fig. 04 — Read the receipts
          </motion.p>

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
              &ldquo;
            </span>
            <blockquote className="mt-2 text-2xl font-semibold leading-[1.4] tracking-[-0.02em] text-white sm:text-[1.75rem]">
              {TESTIMONIAL.quote}
            </blockquote>
            <figcaption className="mt-6 text-sm font-normal text-[#A1A1AA]">
              <span className="font-semibold text-white">{TESTIMONIAL.name}</span> ·{" "}
              {TESTIMONIAL.role}
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
            <h2 className="text-[clamp(2.1rem,6.4vw,3.6rem)] font-extrabold leading-[1.02] tracking-[-0.02em] text-white">
              Follow the wires.
              <br />
              Then decide.
            </h2>
            <p className="mt-6 max-w-lg text-base font-normal leading-[1.6] text-[#A1A1AA]">
              Build your preference graph in a minute. From then on, every
              listing we surface arrives already connected — five signals on
              file, and a reason for every match.
            </p>
            <div className="mt-9">
              <a href="#top" className={cx(CTA_PRIMARY, "px-7 py-3.5 text-base")}>
                See my graph
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
            Lattice
          </span>
          <span className="text-xs font-normal text-[#A1A1AA]">
            AI-matched secondhand · 2026 REPICK
          </span>
        </div>
      </footer>
    </main>
  );
}
