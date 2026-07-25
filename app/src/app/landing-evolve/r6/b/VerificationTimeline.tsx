"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { BadgeCheck, Check, CheckCircle2, ArrowRight } from "lucide-react";
import {
  PRODUCT,
  STEPS,
  VERDICT_STATS,
  EASE,
  cx,
  CAPTION,
  NUM,
  CTA_PRIMARY,
} from "./data";

/**
 * Scroll-driven verification narrative for one real listing.
 * Left column: a vertical stepper that reveals a computed finding per
 * scroll increment (condition → price → seller → match), with a fill
 * line (scaleY transform, transform-origin top) tracking progress.
 * Right column: a sticky "resting state" proof card — match %, grade,
 * verified badge, before/after discount — visible from first paint,
 * never gated behind scroll or hover.
 */
export default function VerificationTimeline() {
  const reduced = useReducedMotion();
  const [activeStep, setActiveStep] = useState(reduced ? STEPS.length - 1 : 0);
  const timelineRef = useRef<HTMLOListElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 0.75", "end 0.4"],
  });
  const lineScale = useTransform(
    scrollYProgress,
    [0, 1],
    reduced ? [1, 1] : [0, 1],
  );

  const checking = activeStep < STEPS.length - 1;

  return (
    <section
      id="verify"
      className="border-t border-white/10 bg-white/[0.015]"
      aria-labelledby="verify-heading"
    >
      <div className="mx-auto w-full max-w-[1120px] px-5 py-24 sm:px-8">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: EASE }}
          className="max-w-2xl"
        >
          <p className={cx(CAPTION, "text-[#a894f7]")}>Fig. 01 — Live verification</p>
          <h2
            id="verify-heading"
            className="mt-4 font-extrabold leading-[1.08] tracking-[-0.02em] text-white text-[clamp(1.9rem,5vw,2.75rem)] break-keep"
          >
            Watch one listing get
            <br />
            verified, step by step
          </h2>
          <p className="mt-5 text-base font-normal leading-[1.6] text-[#A1A1AA]">
            This coat is a real listing. Scroll to see the same four checks
            every item on repick runs through before it reaches a match.
          </p>
        </motion.div>

        <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
          {/* sticky proof card — always-visible resting state, not gated by scroll */}
          <div className="order-1 lg:order-2 lg:col-span-5">
            <div className="lg:sticky lg:top-24">
              <figure className="m-0 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
                <div className="relative aspect-[4/5] w-full">
                  <Image
                    src={PRODUCT.image}
                    alt={PRODUCT.alt}
                    fill
                    sizes="(min-width: 1024px) 400px, 100vw"
                    className="object-cover"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-t from-[#0B0B0F]/70 via-transparent to-transparent"
                  />
                  <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-[#0B0B0F]/80 px-2.5 py-1 text-[0.75rem] font-semibold text-white backdrop-blur">
                    <span className={NUM}>Match {PRODUCT.match}%</span>
                  </span>
                  <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full border border-[#6E56CF]/50 bg-[#6E56CF]/20 px-2.5 py-1 text-[0.75rem] font-semibold text-white backdrop-blur">
                    Grade {PRODUCT.grade} · {PRODUCT.gradeLabel}
                  </span>
                </div>

                <figcaption className="flex flex-col gap-4 p-5 sm:p-6">
                  <div>
                    <p className={cx(CAPTION, "text-[#A1A1AA]")}>{PRODUCT.brand}</p>
                    <h3 className="mt-1 text-xl font-semibold leading-snug tracking-[-0.02em] text-white">
                      {PRODUCT.title}
                    </h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="inline-flex items-center gap-1.5 text-[0.8125rem] font-semibold text-white">
                      <BadgeCheck className="h-4 w-4 text-[#6E56CF]" aria-hidden />
                      {PRODUCT.sellerName}
                    </span>
                    <span className="text-[0.75rem] font-normal text-[#A1A1AA]">
                      {PRODUCT.sellerMeta}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-2 border-t border-white/10 pt-4">
                    <span className={cx("text-2xl font-extrabold text-white", NUM)}>
                      ${PRODUCT.price}
                    </span>
                    <span className={cx("text-sm font-normal text-white/40 line-through", NUM)}>
                      ${PRODUCT.original}
                    </span>
                    <span className={cx("ml-auto rounded-md bg-[#6E56CF] px-2 py-0.5 text-sm font-semibold text-white", NUM)}>
                      -{PRODUCT.discount}%
                    </span>
                  </div>

                  <p
                    role="status"
                    aria-live="polite"
                    className="inline-flex items-center gap-1.5 text-[0.75rem] font-normal text-[#A1A1AA]"
                  >
                    {checking ? (
                      <>
                        <span
                          aria-hidden
                          className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#6E56CF]"
                        />
                        Now checking: {STEPS[activeStep].title}
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-[#6E56CF]" aria-hidden />
                        All 4 checks complete
                      </>
                    )}
                  </p>
                </figcaption>
              </figure>
            </div>
          </div>

          {/* the timeline itself */}
          <div className="order-2 lg:order-1 lg:col-span-7">
            <div className="relative">
              <div
                aria-hidden
                className="absolute left-5 top-2 bottom-2 w-px bg-white/10"
              />
              <motion.div
                aria-hidden
                style={{ scaleY: lineScale, transformOrigin: "top" }}
                className="absolute left-5 top-2 bottom-2 w-px bg-[#6E56CF] will-change-transform"
              />

              <ol
                ref={timelineRef}
                role="list"
                aria-label="Verification steps for this listing"
                className="relative flex flex-col gap-12"
              >
                {STEPS.map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <motion.li
                      key={s.id}
                      initial={reduced ? false : { opacity: 0, x: -16 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, amount: 0.5 }}
                      onViewportEnter={() => setActiveStep(i)}
                      transition={{ duration: 0.5, ease: EASE }}
                      className="relative flex gap-5"
                    >
                      <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 bg-[#0B0B0F]">
                        <motion.span
                          aria-hidden
                          initial={reduced ? false : { opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          viewport={{ once: true, amount: 0.5 }}
                          transition={{ duration: 0.4, ease: EASE }}
                          className="absolute inset-0 rounded-full bg-[#6E56CF]/15 ring-1 ring-[#6E56CF]/50"
                        />
                        <Icon
                          className="relative h-4 w-4 text-white"
                          strokeWidth={2}
                          aria-hidden
                        />
                      </div>

                      <div className="flex-1 pb-1">
                        <p className={cx(CAPTION, "text-[#A1A1AA]")}>
                          Step {s.index}
                        </p>
                        <h3 className="mt-1 text-xl font-semibold tracking-[-0.02em] text-white">
                          {s.title}
                        </h3>
                        <p className="mt-2 max-w-md text-sm font-normal leading-[1.6] text-[#A1A1AA]">
                          {s.body}
                        </p>

                        <div className="mt-4 inline-flex items-baseline gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2">
                          <span className={cx("text-lg font-extrabold text-white", NUM)}>
                            {s.metricValue}
                          </span>
                          <span className="text-xs font-normal text-[#A1A1AA]">
                            {s.metricLabel}
                          </span>
                        </div>

                        <ul className="mt-4 flex flex-col gap-1.5">
                          {s.chips.map((c) => (
                            <li
                              key={c}
                              className="flex items-center gap-2 text-xs font-normal text-[#A1A1AA]"
                            >
                              <Check
                                className="h-3.5 w-3.5 shrink-0 text-[#6E56CF]"
                                strokeWidth={2.5}
                                aria-hidden
                              />
                              {c}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.li>
                  );
                })}
              </ol>
            </div>

            {/* final verdict card — culmination of the four checks */}
            <motion.div
              initial={reduced ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.55, ease: EASE }}
              className="mt-12 rounded-2xl border border-[#6E56CF]/40 bg-[#6E56CF]/[0.07] p-6 sm:p-8"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-[#6E56CF]" aria-hidden />
                <p className={cx(CAPTION, "text-[#a894f7]")}>Verdict</p>
              </div>
              <h3 className="mt-3 text-2xl font-extrabold tracking-[-0.02em] text-white">
                Recommended match
              </h3>
              <p className="mt-2 max-w-lg text-sm font-normal leading-[1.6] text-[#A1A1AA]">
                All four checks passed. This listing scores in the top tier
                for condition, price fairness, seller trust, and fit with
                your saved profile.
              </p>

              <dl className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {VERDICT_STATS.map((v) => (
                  <div key={v.label}>
                    <dt className="text-xs font-normal text-[#A1A1AA]">{v.label}</dt>
                    <dd className={cx("mt-1 text-base font-extrabold text-white", NUM)}>
                      {v.value}
                    </dd>
                  </div>
                ))}
              </dl>

              <a href="#cta" className={cx(CTA_PRIMARY, "mt-8")}>
                See why it scored 96%
                <ArrowRight className="h-4 w-4" strokeWidth={2.5} aria-hidden />
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
