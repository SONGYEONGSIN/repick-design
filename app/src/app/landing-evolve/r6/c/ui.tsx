"use client";

import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowRight, BadgeCheck, Check } from "lucide-react";
import Estimator from "./Estimator";
import {
  PRODUCTS,
  VALUES,
  PROOF,
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
  const reduced = useReducedMotion() ?? false;

  const heroContainer: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduced ? 0 : 0.09, delayChildren: 0.04 } },
  };
  const heroItem: Variants = {
    hidden: reduced ? { opacity: 0 } : { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
  };

  return (
    <main className="min-h-screen bg-[#0B0B0F] text-white antialiased">
      {/* nav */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0B0B0F]/80 backdrop-blur-md">
        <nav className="mx-auto flex w-full max-w-[1120px] items-center justify-between px-5 py-4 sm:px-8">
          <a href="#top" className={cx("rounded text-base font-extrabold tracking-[-0.02em] text-white", FOCUS)}>
            re:pick
          </a>
          <div className="hidden items-center gap-7 sm:flex">
            <a href="#estimate" className={NAV_LINK}>
              Estimate generator
            </a>
            <a href="#matches" className={NAV_LINK}>
              Verified matches
            </a>
          </div>
          <a href="#cta" className={CTA_PRIMARY}>
            Start selling
          </a>
        </nav>
      </header>

      {/* hero */}
      <section id="top" className="mx-auto w-full max-w-[1120px] px-5 pb-24 pt-14 sm:px-8 sm:pt-20">
        <motion.div variants={heroContainer} initial="hidden" animate="show" className="max-w-2xl">
          <motion.p variants={heroItem} className={cx(EYEBROW, "text-[#a894f7]")}>
            Fig. 01 — Instant Estimate
          </motion.p>

          <motion.h1
            variants={heroItem}
            className="mt-5 font-extrabold leading-[1.02] tracking-[-0.02em] text-white break-keep text-[clamp(2.2rem,7.6vw,3rem)] lg:text-[clamp(3rem,4.8vw,4.4rem)]"
          >
            Know what it&rsquo;s <span className="text-[#6E56CF]">worth</span>
            <br />
            before you list it.
          </motion.h1>

          <motion.p
            variants={heroItem}
            className="mt-6 max-w-md text-base font-normal leading-[1.6] text-[#A1A1AA] sm:text-lg"
          >
            Pick your item&rsquo;s category, condition, and target price. Our AI
            appraises it in real time and generates a verified estimate you can
            screenshot and share.
          </motion.p>

          <motion.div variants={heroItem} className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a href="#cta" className={CTA_PRIMARY}>
              Get full appraisal
              <ArrowRight className="h-4 w-4" strokeWidth={2.5} aria-hidden />
            </a>
            <span className="text-xs font-normal text-[#A1A1AA]">
              No sign-up needed · updates instantly as you choose
            </span>
          </motion.div>
        </motion.div>

        {/* the generator itself lives directly in the hero */}
        <section id="estimate" aria-label="Personalized estimate generator">
          <Estimator />
        </section>
      </section>

      {/* verified matches (rich product preview) */}
      <section id="matches" className="border-t border-white/10 bg-white/[0.015]">
        <div className="mx-auto w-full max-w-[1120px] px-5 py-24 sm:px-8">
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.5, ease: EASE }}
            className="max-w-2xl"
          >
            <p className={cx(EYEBROW, "text-[#a894f7]")}>Fig. 02 — Why the AI picked it</p>
            <h2 className="mt-4 font-extrabold leading-[1.08] tracking-[-0.02em] text-white text-[clamp(1.9rem,5vw,2.75rem)] break-keep">
              Every match carries its own
              <br />
              receipt of proof.
            </h2>
            <p className="mt-5 text-base font-normal leading-[1.6] text-[#A1A1AA]">
              Real listings that cleared the same appraisal model above — match
              score, condition grade, verified seller, and the discount off
              retail, all in one card.
            </p>
          </motion.div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PRODUCTS.map((p, i) => (
              <motion.figure
                key={p.id}
                initial={reduced ? false : { opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={VIEWPORT}
                transition={{ duration: 0.5, ease: EASE, delay: reduced ? 0 : i * 0.08 }}
                className="m-0 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]"
              >
                <div className="relative aspect-[4/3] w-full">
                  <Image
                    src={p.image}
                    alt={p.alt}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-t from-[#0B0B0F]/70 to-transparent"
                  />
                  <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-[#0B0B0F]/80 px-2.5 py-1 text-[0.75rem] font-semibold text-white backdrop-blur">
                    <span className={NUM}>AI match {p.match}%</span>
                  </span>
                  <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full border border-[#6E56CF]/50 bg-[#6E56CF]/20 px-2.5 py-1 text-[0.75rem] font-semibold text-white backdrop-blur">
                    {p.grade} grade
                  </span>
                </div>

                <figcaption className="flex flex-col gap-3 p-5">
                  <div>
                    <p className={cx(CAPTION, "text-[#A1A1AA]")}>{p.category}</p>
                    <h3 className="mt-1 text-lg font-semibold leading-snug tracking-[-0.02em] text-white">
                      {p.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1.5 text-[0.8125rem] font-semibold text-white">
                    <BadgeCheck className="h-4 w-4 text-[#6E56CF]" aria-hidden />
                    {p.seller}
                  </div>
                  <p className="text-[0.75rem] font-normal text-[#A1A1AA]">{p.sellerMeta}</p>

                  <div className="mt-1 flex items-center gap-1.5 text-[0.8125rem] font-normal text-[#A1A1AA]">
                    <Check className="h-4 w-4 shrink-0 text-[#6E56CF]" strokeWidth={2.5} aria-hidden />
                    Condition-verified: {p.gradeLabel}
                  </div>

                  <div className="mt-auto flex items-baseline gap-2 border-t border-white/10 pt-4">
                    <span className={cx("text-xl font-extrabold text-white", NUM)}>
                      {`₩${comma(p.price)}`}
                    </span>
                    <span className={cx("text-sm font-normal text-[#A1A1AA] line-through", NUM)}>
                      {`₩${comma(p.original)}`}
                    </span>
                    <span className={cx("ml-auto rounded-md bg-[#6E56CF] px-2 py-0.5 text-sm font-semibold text-white", NUM)}>
                      -{p.discount}%
                    </span>
                  </div>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </section>

      {/* value — 3 split with ghost numbers */}
      <section id="how" className="border-t border-white/10">
        <div className="mx-auto w-full max-w-[1120px] px-5 py-24 sm:px-8">
          <motion.p
            initial={reduced ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.5, ease: EASE }}
            className={cx(EYEBROW, "mb-12 block text-[#a894f7]")}
          >
            Fig. 03 — How the estimate works
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
                  <h3 className="mt-5 text-xl font-semibold tracking-[-0.02em] text-white">{v.title}</h3>
                  <p className="mt-3 text-sm font-normal leading-[1.6] text-[#A1A1AA]">{v.desc}</p>
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
                <div className="mt-2 text-sm font-normal text-[#A1A1AA]">{s.label}</div>
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
              I moved the condition slider once and the payout number dropped in
              front of me. That&rsquo;s the moment I trusted the price.
            </blockquote>
            <figcaption className="mt-6 text-sm font-normal text-[#A1A1AA]">
              <span className="font-semibold text-white">Dohyun Kim</span> · Freelance designer
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
              Your estimate is already
              <br />
              waiting above.
            </h2>
            <p className="mt-6 max-w-lg text-base font-normal leading-[1.6] text-[#A1A1AA]">
              Turn it into a real listing in under a minute — the same
              condition-adjusted price carries straight through to checkout.
            </p>
            <div className="mt-9">
              <a href="#top" className={cx(CTA_PRIMARY, "px-7 py-3.5 text-base")}>
                Build my estimate
                <ArrowRight className="h-4 w-4" strokeWidth={2.5} aria-hidden />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* footer */}
      <footer className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-2 px-5 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <span className="text-base font-extrabold tracking-[-0.02em] text-white">re:pick</span>
          <span className="text-xs font-normal text-[#A1A1AA]">
            AI-appraised secondhand marketplace · 2026 repick
          </span>
        </div>
      </footer>
    </main>
  );
}
