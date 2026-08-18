"use client";

import { useRef, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Quote } from "lucide-react";

import ThresholdHero from "./threshold-hero";
import {
  BRAND,
  CAPTION,
  CLOSING,
  EYEBROW,
  FOCUS,
  FOCUS_ON_INK,
  FOOTER_LINKS,
  HOW,
  NUM,
  PROOF_STATS,
  TESTIMONIAL,
  cx,
} from "./data";

const NAV_LINKS = [
  { label: "How it works", href: "#how" },
  { label: "Shortlist", href: "#shortlist" },
  { label: "Proof", href: "#proof" },
];

/** Scroll reveal. With reduced motion the initial state is skipped entirely rather than animated at
 *  zero duration, so nothing is ever left sitting at opacity 0. */
function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: reduced ? 0 : 0.5, delay: reduced ? 0 : delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

/** The one scrubbed, scroll-linked element on the page: a decorative quote mark drifting against
 *  the testimonial. Decorative only — no text rides on it. */
function DriftingQuoteMark() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [28, -28]);
  return (
    <div ref={ref} aria-hidden="true" className="relative h-12 sm:h-16">
      <motion.div style={reduced ? undefined : { y }}>
        <Quote className="size-12 text-lime-700 opacity-30 sm:size-16" />
      </motion.div>
    </div>
  );
}

export default function Page() {
  return (
    <main className="min-h-dvh w-full bg-white text-zinc-950">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-lime-800 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to main content
      </a>

      <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-[1180px] items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-10">
          <span
            style={{ fontFamily: "var(--font-display-wide)" }}
            className="text-lg font-extrabold tracking-[-0.02em] text-zinc-950"
          >
            {BRAND}
          </span>
          <nav aria-label="Primary" className="hidden items-center gap-6 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={cx(
                  "rounded px-1 py-1 text-sm font-semibold text-zinc-700 transition-colors duration-150 hover:text-zinc-950",
                  FOCUS,
                )}
              >
                {link.label}
              </a>
            ))}
          </nav>
          <a
            href="#start"
            className={cx(
              "rounded-full border border-zinc-900 px-4 py-1.5 text-sm font-semibold text-zinc-900 transition-colors duration-150 hover:bg-zinc-900 hover:text-white",
              FOCUS,
            )}
          >
            Sign in
          </a>
        </div>
      </header>

      <div id="main-content">
        <ThresholdHero />

        {/* --------------------------------------------------------------- how the line works */}
        <section id="how" className="scroll-mt-24 border-b border-zinc-200 bg-zinc-50">
          <div className="mx-auto w-full max-w-[1180px] px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
            <Reveal className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              <p className={cx(EYEBROW, "text-lime-800 lg:col-span-3")}>A rule, not a filter</p>
              <h2
                style={{ fontFamily: "var(--font-display-wide)" }}
                className="text-[clamp(1.75rem,3.4vw,2.75rem)] font-extrabold leading-[1.05] tracking-[-0.02em] text-zinc-950 lg:col-span-9"
              >
                Three things a filter cannot tell you.
              </h2>
            </Reveal>

            <ul className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3 lg:gap-10">
              {HOW.map((item, index) => (
                <li key={item.n}>
                  <Reveal delay={index * 0.08}>
                    <div className="border-t-2 border-zinc-950 pt-4">
                      <span
                        aria-hidden="true"
                        style={{ fontFamily: "var(--font-display-wide)" }}
                        className={cx(
                          "block text-3xl font-extrabold leading-none tracking-[0.12em] text-zinc-500",
                          NUM,
                        )}
                      >
                        {item.n}
                      </span>
                      <h3 className="mt-4 max-w-[24rem] text-xl font-semibold leading-snug tracking-[-0.02em] text-zinc-950">
                        {item.title}
                      </h3>
                      <p className="mt-3 max-w-[30rem] text-[0.9375rem] leading-[1.6] text-zinc-600">
                        {item.body}
                      </p>
                      <p className={cx("mt-4 text-zinc-600", CAPTION)}>{item.fig}</p>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* --------------------------------------------------------------- proof */}
        <section id="proof" className="scroll-mt-24 border-b border-zinc-200 bg-white">
          <div className="mx-auto w-full max-w-[1180px] px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
              <Reveal className="lg:col-span-7">
                <h2 className={cx(EYEBROW, "text-lime-800")}>What buyers do with a line</h2>
                <DriftingQuoteMark />
                <blockquote className="mt-2 max-w-[34rem] text-[clamp(1.25rem,2.2vw,1.75rem)] font-semibold leading-[1.35] tracking-[-0.02em] text-zinc-950">
                  {TESTIMONIAL.quote}
                </blockquote>
                <p className="mt-5 text-sm text-zinc-600">
                  <span className="font-semibold text-zinc-950">{TESTIMONIAL.name}</span>
                  <span className="block">{TESTIMONIAL.role}</span>
                </p>
              </Reveal>

              <Reveal delay={0.1} className="lg:col-span-5">
                <dl className="flex flex-col divide-y divide-zinc-200 border-y border-zinc-200">
                  {PROOF_STATS.map((stat) => (
                    <div
                      key={stat.label}
                      className="flex items-baseline justify-between gap-4 py-5"
                    >
                      <dt className={cx(CAPTION, "text-zinc-600")}>{stat.label}</dt>
                      <dd
                        style={{ fontFamily: "var(--font-display-wide)" }}
                        className={cx(
                          "text-3xl font-extrabold tracking-[-0.02em] text-zinc-950",
                          NUM,
                        )}
                      >
                        {stat.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
            </div>
          </div>
        </section>

        {/* --------------------------------------------------------------- closing */}
        <section id="start" className="scroll-mt-24 bg-white">
          <div className="mx-auto w-full max-w-[1180px] px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
            <Reveal>
              <div className="rounded-3xl bg-[#0B0B0F] px-6 py-12 sm:px-10 lg:px-14 lg:py-16">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end">
                  <div className="lg:col-span-7">
                    <p className={cx(EYEBROW, "text-lime-300")}>Free to try</p>
                    <h2
                      style={{ fontFamily: "var(--font-display-wide)" }}
                      className="mt-4 text-[clamp(1.875rem,4vw,3.25rem)] font-extrabold leading-[1.02] tracking-[-0.02em] text-white"
                    >
                      {CLOSING.headline}
                    </h2>
                    <p className="mt-4 max-w-[32rem] text-[0.9375rem] leading-[1.6] text-zinc-300">
                      {CLOSING.body}
                    </p>
                  </div>
                  <div className="flex flex-col items-start gap-3 lg:col-span-5 lg:items-end">
                    <a
                      href="#shortlist"
                      className={cx(
                        "inline-flex items-center gap-1.5 rounded-full bg-lime-700 px-6 py-3 text-sm font-semibold text-white transition-colors duration-150 hover:bg-lime-800",
                        FOCUS_ON_INK,
                      )}
                    >
                      {CLOSING.cta}
                      <ArrowUpRight aria-hidden="true" className="size-4" />
                    </a>
                    <p className="text-xs text-zinc-400">{CLOSING.note}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <footer className="border-t border-zinc-200 bg-white">
          <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-4 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-10">
            <div>
              <span
                style={{ fontFamily: "var(--font-display-wide)" }}
                className="text-base font-extrabold tracking-[-0.02em] text-zinc-950"
              >
                {BRAND}
              </span>
              <p className="mt-1 text-xs text-zinc-600">
                Cutline 2026 — resale matching that shows the cost of your own rule.
              </p>
            </div>
            <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-2">
              {FOOTER_LINKS.map((label) => (
                <a
                  key={label}
                  href="#main-content"
                  className={cx(
                    "rounded px-1 py-1 text-xs font-semibold text-zinc-700 transition-colors duration-150 hover:text-zinc-950",
                    FOCUS,
                  )}
                >
                  {label}
                </a>
              ))}
            </nav>
          </div>
        </footer>
      </div>
    </main>
  );
}
