"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Reveal } from "./Reveal";
import { TESTIMONIALS, TRUST_STATS } from "./data";
import { ACCENT_BRIGHT, cx, DISPLAY_FONT, FOCUS, NUM } from "./tokens";

export function SocialProof() {
  const [index, setIndex] = useState(0);
  const reduceMotion = useReducedMotion();
  const total = TESTIMONIALS.length;
  const current = TESTIMONIALS[index];

  function go(delta: number) {
    setIndex((prev) => (prev + delta + total) % total);
  }

  return (
    <section id="stories" className="scroll-mt-24 border-b border-[#1C1C22] bg-[#0B0B0F] px-6 py-16 sm:px-10 sm:py-20 lg:px-16">
      <div className="mx-auto max-w-[1320px]">
        <p className="text-[11px] font-semibold uppercase text-zinc-400" style={{ letterSpacing: "0.28em" }}>
          Fig. 05 &mdash; From sellers who typed a price
        </p>
        <h2
          className="mt-4 max-w-[720px] text-white"
          style={{ ...DISPLAY_FONT, letterSpacing: "-0.015em", fontSize: "clamp(1.75rem, 1.6vw + 1.3rem, 2.5rem)", lineHeight: 1.08 }}
        >
          Sellers, not just algorithms, trust the number.
        </h2>

        <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8">
          <Reveal className="lg:col-span-4">
            <dl className="flex flex-col gap-6">
              {TRUST_STATS.map((stat) => (
                <div key={stat.label}>
                  <dt className="max-w-[280px] text-[13px] font-normal leading-snug text-zinc-400">{stat.label}</dt>
                  <dd
                    className={cx("mt-1.5 text-white", NUM)}
                    style={{ ...DISPLAY_FONT, fontSize: "clamp(1.75rem, 1.4vw + 1.3rem, 2.25rem)", lineHeight: 1.05 }}
                  >
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal delay={0.1} className="min-w-0 lg:col-span-8">
            <div className="relative overflow-hidden rounded-2xl border border-[#1C1C22] bg-[#111116] p-7 sm:p-9">
              <Quote className="h-7 w-7" style={{ color: ACCENT_BRIGHT }} aria-hidden="true" />

              <div aria-live="polite" className="mt-4 min-h-[132px] sm:min-h-[104px]">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.figure
                    key={index}
                    initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
                    transition={reduceMotion ? { duration: 0 } : { duration: 0.25, ease: "easeOut" }}
                  >
                    <blockquote className="max-w-[493px] text-[16px] font-normal leading-[1.6] text-zinc-200">
                      &ldquo;{current.quote}&rdquo;
                    </blockquote>
                    <figcaption className="mt-4 text-[13px] font-normal text-zinc-400">
                      <span className="font-semibold text-white">{current.name}</span> &mdash; {current.role}
                    </figcaption>
                  </motion.figure>
                </AnimatePresence>
              </div>

              <div className="mt-6 flex items-center justify-between gap-4 border-t border-[#1C1C22] pt-5">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => go(-1)}
                    aria-label="Previous story"
                    className={cx("rounded-full border border-[#27272E] p-2 text-zinc-300 transition-colors duration-150 hover:text-white", FOCUS)}
                  >
                    <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => go(1)}
                    aria-label="Next story"
                    className={cx("rounded-full border border-[#27272E] p-2 text-zinc-300 transition-colors duration-150 hover:text-white", FOCUS)}
                  >
                    <ChevronRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>

                <div className="flex items-center gap-2" role="group" aria-label="Choose a story">
                  {TESTIMONIALS.map((testimonial, i) => (
                    <button
                      key={testimonial.name}
                      type="button"
                      onClick={() => setIndex(i)}
                      aria-label={`Story ${i + 1} of ${total}, from ${testimonial.name}`}
                      aria-current={i === index}
                      className={cx("h-6 w-6 rounded-full p-2", FOCUS)}
                    >
                      <span
                        className="block h-2 w-2 rounded-full"
                        style={{ backgroundColor: i === index ? ACCENT_BRIGHT : "#27272E" }}
                        aria-hidden="true"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
