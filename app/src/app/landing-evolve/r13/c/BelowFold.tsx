"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpDown } from "lucide-react";
import {
  CAPTION,
  EYEBROW,
  FOCUS,
  PROOF_STATS,
  TESTIMONIALS,
  VALUE_STEPS,
  cx,
} from "./data";

const AUX = "text-zinc-400";

function Reveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const prefersReduced = useReducedMotion();
  if (prefersReduced) return <>{children}</>;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}

export default function BelowFold() {
  return (
    <>
      {/* VALUE IN 3 — tied to the reorder/reasoning mechanic */}
      <section id="how-it-works" className="border-b border-white/10 bg-white/[0.02] px-5 py-24 sm:px-8 lg:px-10 lg:py-32">
        <div className="mx-auto max-w-[1180px]">
          <Reveal>
            <div className="max-w-[600px]">
              <p className={cx(EYEBROW, "text-[#38bdf8]")}>Why the order does the work</p>
              <h2 className="mt-4 text-[clamp(1.8rem,5vw,2.5rem)] font-extrabold leading-[1.08] tracking-[-0.02em] text-white">
                One reorder moves three things at once.
              </h2>
              {/* 460px ÷ (0.44 × 15px) = 69.7 chars/line ≤ 70 */}
              <p className={cx("mt-4 max-w-[460px] text-[15px] font-normal leading-[1.6]", AUX)}>
                The priority list is not a filter you set and forget — it is a live control. Change the
                top row and the board answers on three surfaces together.
              </p>
            </div>
          </Reveal>

          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
            {VALUE_STEPS.map((step, i) => (
              <Reveal key={step.n} delay={i * 0.08}>
                <div className="relative h-full overflow-hidden rounded-3xl border border-white/10 bg-[#0B0B0F] p-6">
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -top-3 right-5 text-7xl font-extrabold text-white/[0.05]"
                  >
                    {step.n}
                  </span>
                  <div className="relative">
                    <ArrowUpDown className="h-5 w-5 text-[#38bdf8]" aria-hidden />
                    <h3 className="mt-4 text-lg font-semibold text-white">{step.title}</h3>
                    {/* 320px ÷ (0.44 × 14px) = 51.9 chars/line ≤ 70 */}
                    <p className={cx("mt-2.5 max-w-[320px] text-[14px] font-normal leading-[1.6]", AUX)}>
                      {step.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF band */}
      <section id="proof" className="border-b border-white/10 px-5 py-24 sm:px-8 lg:px-10 lg:py-32">
        <div className="mx-auto max-w-[1180px]">
          <Reveal>
            <dl className="grid grid-cols-1 gap-6 border-b border-white/10 pb-12 sm:grid-cols-3">
              {PROOF_STATS.map((stat) => (
                <div key={stat.label}>
                  <dt className={cx("text-xs font-semibold uppercase tracking-[0.12em]", AUX)}>
                    {stat.label}
                  </dt>
                  <dd className="mt-2 text-4xl font-extrabold tabular-nums tracking-[-0.02em] text-white">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.name} delay={i * 0.08}>
                <figure className="flex h-full flex-col rounded-3xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
                  {/* 480px ÷ (0.44 × 16px) = 68.2 chars/line ≤ 70 */}
                  <blockquote className="max-w-[480px] text-[16px] font-normal leading-[1.65] text-zinc-200">
                    “{t.quote}”
                  </blockquote>
                  <figcaption className="mt-6 flex items-baseline gap-2">
                    <span className="text-sm font-semibold text-white">{t.name}</span>
                    <span className={cx("text-xs font-normal", AUX)}>· {t.role}</span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CLOSING CTA — asymmetric two-column, not a generic centered band */}
      <section id="start" className="px-5 py-24 sm:px-8 lg:px-10 lg:py-32">
        <div className="mx-auto max-w-[1180px]">
          <Reveal>
            <div className="grid grid-cols-1 gap-10 rounded-3xl border border-white/10 bg-white/[0.03] p-8 sm:p-12 lg:grid-cols-12 lg:items-center lg:gap-8">
              <div className="lg:col-span-7">
                <p className={cx(CAPTION, "text-[#38bdf8]")}>Start ranking</p>
                <h2 className="mt-4 text-[clamp(1.9rem,5vw,2.6rem)] font-extrabold leading-[1.06] tracking-[-0.02em] text-white">
                  Put your priorities in order. Let the board defend every pick.
                </h2>
                {/* 520px ÷ (0.44 × 16px) = 73.9 → use 15px: 500 ÷ (0.44×15)=75.7, cap 460px */}
                <p className={cx("mt-4 max-w-[460px] text-[15px] font-normal leading-[1.6]", AUX)}>
                  No account needed to reorder the demo board. Rank once, and every match shows its
                  work against your top priority.
                </p>
              </div>
              <div className="lg:col-span-5 lg:flex lg:justify-end">
                <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                  <a
                    href="#board"
                    className={cx(
                      "inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#0369a1] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#075985]",
                      FOCUS,
                    )}
                  >
                    Reorder the board
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </a>
                  <a
                    href="#how-it-works"
                    className={cx(
                      "inline-flex h-12 items-center justify-center rounded-full border border-white/15 px-6 text-sm font-semibold text-white transition-colors hover:border-white/30",
                      FOCUS,
                    )}
                  >
                    See how it re-ranks
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
