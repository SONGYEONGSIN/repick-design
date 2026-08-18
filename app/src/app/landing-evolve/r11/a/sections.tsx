"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Quote } from "lucide-react";

import {
  ACCENT,
  BAND_STATS,
  CAPTION,
  EYEBROW,
  FAQ_LINES,
  FOCUS,
  METHOD_COLUMNS,
  SOURCES,
  TESTIMONIAL,
  cx,
} from "./data";

/**
 * Everything below the fold.
 *
 * The hero already made the argument; these sections say where the marks come from, how often they
 * fire, and what it feels like to read a listing this way. Motion is scroll-triggered and always
 * gated on `useReducedMotion` — with the preference set, `initial={false}` means the content simply
 * renders in its finished state rather than waiting for an animation that will not run.
 */
export default function Sections() {
  const reduced = Boolean(useReducedMotion());
  const methodRef = useRef<HTMLDivElement>(null);

  // A proofreader's margin rule: a hairline that fills as the method section passes the viewport.
  const { scrollYProgress } = useScroll({
    target: methodRef,
    offset: ["start 85%", "end 60%"],
  });
  const ruleScale = useTransform(scrollYProgress, [0, 1], [0.04, 1]);

  const rise = reduced ? false : { opacity: 0, y: 18 };

  return (
    <>
      {/* ------------------------------------------------------------------ where marks come from */}
      <section aria-labelledby="method-title" className="border-b border-[#E4E1DA]">
        <div
          ref={methodRef}
          className="mx-auto w-full max-w-[1180px] px-5 py-16 sm:px-6 md:px-8 md:py-24"
        >
          <div className="flex gap-5 md:gap-8">
            <span aria-hidden="true" className="relative hidden w-px shrink-0 bg-[#E4E1DA] md:block">
              <motion.span
                className="absolute inset-x-0 top-0 block h-full origin-top"
                style={{ backgroundColor: ACCENT, scaleY: reduced ? 1 : ruleScale }}
              />
            </span>

            <div className="min-w-0 flex-1">
              <motion.p
                className={cx(EYEBROW, "text-[#5B5862]")}
                initial={rise}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
              >
                Method
              </motion.p>

              <motion.h2
                id="method-title"
                style={{ fontFamily: "var(--font-display-wide)" }}
                className="mt-3 max-w-[16ch] text-[clamp(1.6rem,3.3vw,2.4rem)] font-bold leading-[1.1] tracking-[-0.02em] text-[#141317]"
                initial={rise}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.45, delay: 0.05, ease: "easeOut" }}
              >
                Every mark cites a source.
              </motion.h2>

              <motion.p
                className="mt-3 max-w-[560px] text-[0.95rem] leading-[1.7] text-[#5B5862] sm:text-base"
                initial={rise}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.45, delay: 0.1, ease: "easeOut" }}
              >
                A strikethrough with nothing behind it is an opinion. Each one in the document above
                is the visible end of one of three checks, and the ledger beside it is the same check
                converted into money.
              </motion.p>

              <motion.ul
                role="list"
                className="mt-10 grid grid-cols-1 gap-x-8 gap-y-9 sm:grid-cols-2 lg:grid-cols-3"
                initial="rest"
                whileInView="shown"
                viewport={{ once: true, amount: 0.25 }}
                variants={{ shown: { transition: { staggerChildren: reduced ? 0 : 0.09 } } }}
              >
                {METHOD_COLUMNS.map((column, index) => (
                  <motion.li
                    key={column.id}
                    className="min-w-0"
                    variants={{
                      rest: reduced ? {} : { opacity: 0, y: 22 },
                      shown: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
                    }}
                  >
                    {/* Folio numeral. #85818B on #FAF9F6 is 3.62:1 — light enough to read as an
                        editorial mark, dark enough to clear the 3:1 floor for display-size text.
                        A true ghost grey fails `color-contrast`, and `aria-hidden` is not a
                        dependable exemption from that audit. */}
                    <p
                      aria-hidden="true"
                      style={{ fontFamily: "var(--font-display-wide)" }}
                      className="text-[2.6rem] font-bold leading-none tabular-nums text-[#85818B]"
                    >
                      {`0${index + 1}`}
                    </p>
                    <h3 className="mt-3 text-[1.02rem] font-semibold tracking-[-0.01em] text-[#141317]">
                      {SOURCES[column.id].label}
                    </h3>
                    <p className="mt-2 flex items-baseline gap-2">
                      <span
                        style={{ fontFamily: "var(--font-display-wide)" }}
                        className="text-[1.5rem] font-bold tabular-nums leading-none text-[#BE123C]"
                      >
                        {column.figure}
                      </span>
                      <span className={cx(CAPTION, "text-[#5B5862]")}>{column.caption}</span>
                    </p>
                    <p className="mt-3 max-w-[46ch] text-[0.9rem] leading-[1.7] text-[#5B5862]">
                      {column.body}
                    </p>
                  </motion.li>
                ))}
              </motion.ul>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------------------- stat band */}
      <section aria-labelledby="band-title" className="border-b border-[#E4E1DA] bg-white">
        <div className="mx-auto w-full max-w-[1180px] px-5 py-14 sm:px-6 md:px-8 md:py-20">
          <h2 id="band-title" className={cx(CAPTION, "text-[#5B5862]")}>
            What the marks add up to
          </h2>
          <ul role="list" className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {BAND_STATS.map((stat) => (
              <motion.li
                key={stat.label}
                className="min-w-0"
                initial={rise}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
              >
                <p
                  style={{ fontFamily: "var(--font-display-wide)" }}
                  className="text-[clamp(2.2rem,4.4vw,3.1rem)] font-bold tabular-nums leading-none tracking-[-0.02em] text-[#141317]"
                >
                  {stat.figure}
                </p>
                <p className="mt-2 text-[0.95rem] text-[#141317]">{stat.label}</p>
                <p className="mt-1 text-[0.8125rem] text-[#5B5862]">{stat.note}</p>
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      {/* ------------------------------------------------------------------------------ testimonial */}
      <section aria-labelledby="voice-title" className="border-b border-[#E4E1DA]">
        <div className="mx-auto w-full max-w-[1180px] px-5 py-16 sm:px-6 md:px-8 md:py-24">
          <h2 id="voice-title" className="sr-only">
            What buyers say
          </h2>
          <motion.figure
            className="max-w-[760px]"
            initial={rise}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <Quote aria-hidden="true" className="size-7 text-[#BE123C]" />
            <blockquote className="mt-4 text-[clamp(1.15rem,2.3vw,1.6rem)] leading-[1.55] tracking-[-0.01em] text-[#141317]">
              {TESTIMONIAL.quote}
            </blockquote>
            <figcaption className="mt-5 text-[0.875rem] text-[#5B5862]">
              <span className="font-semibold text-[#141317]">{TESTIMONIAL.name}</span>
              {" - "}
              {TESTIMONIAL.role}
            </figcaption>
          </motion.figure>
        </div>
      </section>

      {/* --------------------------------------------------------------------------------- questions */}
      <section aria-labelledby="faq-title" className="border-b border-[#E4E1DA] bg-white">
        <div className="mx-auto w-full max-w-[1180px] px-5 py-16 sm:px-6 md:px-8 md:py-20">
          <h2
            id="faq-title"
            style={{ fontFamily: "var(--font-display-wide)" }}
            className="text-[clamp(1.5rem,3vw,2.1rem)] font-bold leading-[1.15] tracking-[-0.02em] text-[#141317]"
          >
            Three things people ask first.
          </h2>
          <ul role="list" className="mt-8 grid grid-cols-1 gap-x-10 gap-y-8 lg:grid-cols-3">
            {FAQ_LINES.map((line) => (
              <li key={line.q} className="min-w-0 border-t border-[#E4E1DA] pt-4">
                <h3 className="text-[0.95rem] font-semibold tracking-[-0.01em] text-[#141317]">
                  {line.q}
                </h3>
                <p className="mt-2 max-w-[46ch] text-[0.9rem] leading-[1.7] text-[#5B5862]">
                  {line.a}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ------------------------------------------------------------------------------- closing CTA */}
      <section aria-labelledby="cta-title">
        <div className="mx-auto w-full max-w-[1180px] px-5 py-20 sm:px-6 md:px-8 md:py-28">
          <motion.div
            className="max-w-[780px]"
            initial={rise}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <h2
              id="cta-title"
              style={{ fontFamily: "var(--font-display-wide)" }}
              className="text-[clamp(1.9rem,4.6vw,3.2rem)] font-bold leading-[1.08] tracking-[-0.02em] text-[#141317]"
            >
              Stop reading{" "}
              <del className="text-[#BE123C] line-through decoration-[#BE123C] decoration-[3px]">
                listings
              </del>{" "}
              <ins className="underline decoration-[#BE123C] decoration-[3px] underline-offset-[6px]">
                redlines
              </ins>
              .
            </h2>
            <p className="mt-4 max-w-[560px] text-[0.95rem] leading-[1.7] text-[#5B5862] sm:text-base">
              Paste any listing link and repick returns it marked up, sourced and priced. No account
              needed for the first ten.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <a
                href="#hero-title"
                className={cx(
                  "inline-flex items-center gap-2 rounded-md px-6 py-3 text-sm font-semibold text-white transition-transform duration-200 ease-out hover:-translate-y-px motion-reduce:transition-none",
                  FOCUS,
                )}
                style={{ backgroundColor: ACCENT }}
              >
                Mark up a listing
                <ArrowRight aria-hidden="true" className="size-4" />
              </a>
              <a
                href="#picks"
                className={cx(
                  "inline-flex items-center gap-2 rounded-md border border-[#E4E1DA] bg-white px-6 py-3 text-sm font-semibold text-[#141317] transition-colors duration-150 hover:border-[#141317] motion-reduce:transition-none",
                  FOCUS,
                )}
              >
                Browse redlined picks
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
