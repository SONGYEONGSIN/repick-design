"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Folio, QuoteGlyph } from "./ui";
import { COLOR, DISPLAY_FONT, FOCUS_RING, TRACK, W } from "./tokens";
import { AGGREGATE_STATS, TESTIMONIALS } from "./data";
import Reveal from "./Reveal";

export default function SocialProof() {
  const [index, setIndex] = useState(0);
  const reduceMotion = useReducedMotion();
  const total = TESTIMONIALS.length;
  const current = TESTIMONIALS[index];

  function go(delta: number) {
    setIndex((i) => (i + delta + total) % total);
  }

  return (
    <section id="proof" className="mx-auto max-w-[1600px] px-5 sm:px-8 py-14 sm:py-20">
      <Reveal>
        <div className="flex items-start justify-between gap-4">
          <h2
            className={`${W.heavy} text-[clamp(1.9rem,1.3rem+2vw,3rem)] leading-[1.02]`}
            style={{ color: COLOR.ink, letterSpacing: "-0.02em", fontFamily: DISPLAY_FONT }}
          >
            What the case file changes.
          </h2>
          <Folio n={5} of={6} />
        </div>
      </Reveal>

      <Reveal delay={0.05}>
        <dl className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-[820px]">
          {AGGREGATE_STATS.map((s) => (
            <div key={s.label} className="rounded-lg p-4" style={{ background: COLOR.surface, border: `1px solid ${COLOR.ink}1F` }}>
              <dt className={`${W.body} text-[11px] uppercase`} style={{ color: COLOR.mutedOnSurf, letterSpacing: TRACK.caption }}>
                {s.label}
              </dt>
              <dd className={`${W.heavy} mt-1 tabular-nums text-[24px]`} style={{ color: COLOR.ink }}>
                {s.value}
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="mt-10 max-w-[620px]">
          <QuoteGlyph />
          <div className="relative min-h-[160px]">
            <AnimatePresence mode="wait" initial={false}>
              {reduceMotion ? (
                <div key={index}>
                  <TestimonialBody quote={current.quote} name={current.name} role={current.role} />
                </div>
              ) : (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.3 }}
                >
                  <TestimonialBody quote={current.quote} name={current.name} role={current.role} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-5 flex items-center gap-3">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous testimonial"
              className={`${FOCUS_RING} inline-flex items-center justify-center size-9 rounded-full`}
              style={{ border: `1px solid ${COLOR.ink}33`, color: COLOR.ink }}
            >
              <ChevronLeft className="size-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next testimonial"
              className={`${FOCUS_RING} inline-flex items-center justify-center size-9 rounded-full`}
              style={{ border: `1px solid ${COLOR.ink}33`, color: COLOR.ink }}
            >
              <ChevronRight className="size-4" aria-hidden="true" />
            </button>
            <div className="flex items-center gap-1.5 ml-1" role="group" aria-label="Choose testimonial">
              {TESTIMONIALS.map((t, i) => (
                <button
                  key={t.name}
                  type="button"
                  aria-pressed={i === index}
                  aria-label={`Testimonial from ${t.name}`}
                  onClick={() => setIndex(i)}
                  className={`${FOCUS_RING} rounded-full transition-all`}
                  style={{
                    width: i === index ? "20px" : "7px",
                    height: "7px",
                    background: i === index ? COLOR.accent : COLOR.mutedOnBg,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function TestimonialBody({ quote, name, role }: { quote: string; name: string; role: string }) {
  return (
    <>
      <p className={`${W.body} text-[18px] leading-[1.6] max-w-[540px]`} style={{ color: COLOR.ink }}>
        {quote}
      </p>
      <p className={`${W.label} mt-4 text-[13px]`} style={{ color: COLOR.ink }}>
        {name}
        <span className={`${W.body}`} style={{ color: COLOR.mutedOnBg }}>
          {" "}
          — {role}
        </span>
      </p>
    </>
  );
}
