"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { BORDER, INK, MUTED, SOCIAL_STATS, TESTIMONIALS } from "./data";
import { Eyebrow, FOCUS_RING, Reveal } from "./ui";

export function SocialProof() {
  const [index, setIndex] = useState(0);
  const prefersReduced = useReducedMotion();
  const testimonial = TESTIMONIALS[index];

  function go(delta: number) {
    setIndex((prev) => (prev + delta + TESTIMONIALS.length) % TESTIMONIALS.length);
  }

  return (
    <section className="border-b" style={{ borderColor: BORDER }}>
      <div className="mx-auto max-w-[1240px] px-6 py-20 sm:px-10">
        <Reveal>
          <Eyebrow>Verified by outcome</Eyebrow>
        </Reveal>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
          <Reveal className="lg:col-span-4" delay={0.05}>
            <dl className="grid grid-cols-3 gap-4 lg:grid-cols-1 lg:gap-6">
              {SOCIAL_STATS.map((stat) => (
                <div key={stat.label}>
                  <dt
                    className="text-[10px] font-semibold uppercase"
                    style={{ color: MUTED, letterSpacing: "0.12em" }}
                  >
                    {stat.label}
                  </dt>
                  <dd className="mt-1 text-[28px] font-extrabold" style={{ color: INK, fontVariantNumeric: "tabular-nums" }}>
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal className="lg:col-span-8" delay={0.1}>
            <div className="rounded-md border p-7 sm:p-9" style={{ borderColor: BORDER }}>
              <span
                aria-hidden="true"
                className="block text-[42px] font-extrabold leading-none"
                style={{ color: MUTED, opacity: 0.35 }}
              >
                &ldquo;
              </span>
              <div className="min-h-[120px]">
                {prefersReduced ? (
                  <blockquote className="max-w-[480px] text-[17px] font-semibold leading-[1.5]" style={{ color: INK }}>
                    {testimonial.quote}
                  </blockquote>
                ) : (
                  <AnimatePresence mode="wait">
                    <motion.blockquote
                      key={index}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.3 }}
                      className="max-w-[480px] text-[17px] font-semibold leading-[1.5]"
                      style={{ color: INK }}
                    >
                      {testimonial.quote}
                    </motion.blockquote>
                  </AnimatePresence>
                )}
              </div>
              <p className="mt-4 text-[13px]" style={{ color: MUTED }}>
                <span className="font-semibold" style={{ color: INK }}>
                  {testimonial.author}
                </span>{" "}
                — {testimonial.role}
              </p>

              <div className="mt-6 flex items-center gap-4 border-t pt-5" style={{ borderColor: BORDER }}>
                <button
                  type="button"
                  aria-label="Previous testimonial"
                  onClick={() => go(-1)}
                  className={`flex h-8 w-8 items-center justify-center rounded-full border transition-colors ${FOCUS_RING}`}
                  style={{ borderColor: BORDER, color: INK }}
                >
                  <ChevronLeft size={15} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  aria-label="Next testimonial"
                  onClick={() => go(1)}
                  className={`flex h-8 w-8 items-center justify-center rounded-full border transition-colors ${FOCUS_RING}`}
                  style={{ borderColor: BORDER, color: INK }}
                >
                  <ChevronRight size={15} aria-hidden="true" />
                </button>
                <div className="ml-2 flex items-center gap-1.5" role="tablist" aria-label="Select testimonial">
                  {TESTIMONIALS.map((t, i) => (
                    <button
                      key={t.author}
                      type="button"
                      role="tab"
                      aria-selected={i === index}
                      aria-label={`Testimonial ${i + 1} of ${TESTIMONIALS.length}`}
                      onClick={() => setIndex(i)}
                      className={`rounded-full border transition-all ${FOCUS_RING}`}
                      style={{
                        borderColor: i === index ? INK : BORDER,
                        backgroundColor: i === index ? INK : "transparent",
                        width: i === index ? 18 : 7,
                        height: 7,
                      }}
                    />
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
