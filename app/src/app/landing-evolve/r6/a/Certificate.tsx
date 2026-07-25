"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useInView,
  useReducedMotion,
  animate,
  type Variants,
} from "framer-motion";
import {
  Stamp,
  FileCheck2,
  Award,
  BadgeCheck,
  Scale as ScaleIcon,
} from "lucide-react";
import { HERO_CERT, ISSUED, LAB, EASE, CAPTION, NUM, cx } from "./data";

/**
 * Hero appraisal certificate — output-visualization artifact, not a live console.
 * On scroll-into-view: the wax seal stamps down (spring, gated by reduced motion)
 * while the findings list staggers in underneath it. The stamp motion and the
 * content reveal are yoked together on purpose — the seal isn't decoration, it
 * marks the moment the (already-computed) verdict becomes legible.
 * The match score counts up from 0 to its real, fixed target (no randomness);
 * reduced-motion users get the final value immediately, never a stuck 0.
 */
export default function Certificate() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView || reduced) return;
    const controls = animate(0, HERO_CERT.match, {
      duration: 1.1,
      ease: EASE,
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, reduced]);

  // reduced-motion (or pre-animation) render: show the real final value
  // directly instead of setting state inside the effect.
  const shown = reduced ? HERO_CERT.match : display;

  const container: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: reduced ? 0 : 0.08,
        delayChildren: reduced ? 0 : 0.2,
      },
    },
  };
  const row: Variants = {
    hidden: reduced ? { opacity: 0 } : { opacity: 0, x: -10 },
    show: { opacity: 1, x: 0, transition: { duration: 0.4, ease: EASE } },
  };

  return (
    <div ref={ref} className="relative pb-6 pr-4">
      <div className="relative overflow-hidden rounded-lg border border-white/15 bg-[#111116] p-[1px]">
        <div className="rounded-[7px] p-6 ring-1 ring-inset ring-white/[0.06] sm:p-8">
          {/* document header */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className={cx(CAPTION, "text-[#a894f7]")}>
                Certificate of Appraisal
              </p>
              <p
                className={cx(
                  NUM,
                  "mt-1.5 text-[0.7rem] font-normal text-[#A1A1AA]",
                )}
              >
                No. {HERO_CERT.serial}
              </p>
            </div>
            <FileCheck2
              className="h-5 w-5 shrink-0 text-white/25"
              aria-hidden
            />
          </div>

          {/* item under appraisal */}
          <div className="mt-6 flex items-center gap-4">
            <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md border border-white/10">
              <Image
                src={HERO_CERT.image}
                alt={HERO_CERT.alt}
                fill
                sizes="64px"
                className="object-cover"
              />
            </span>
            <div className="min-w-0">
              <p className={cx(CAPTION, "text-[#A1A1AA]")}>
                {HERO_CERT.brand}
              </p>
              <h2 className="mt-1 truncate text-lg font-semibold tracking-[-0.02em] text-white">
                {HERO_CERT.title}
              </h2>
            </div>
          </div>

          {/* verdict + grade */}
          <div className="mt-6 flex items-end justify-between gap-4 border-t border-white/10 pt-6">
            <div>
              <p className={cx(CAPTION, "text-[#A1A1AA]")}>Match verdict</p>
              <p
                aria-hidden
                className={cx(
                  NUM,
                  "mt-1 text-5xl font-extrabold leading-none text-white",
                )}
              >
                {shown}
                <span className="text-2xl text-[#A1A1AA]">%</span>
              </p>
              <span className="sr-only">
                {HERO_CERT.match}% match verdict
              </span>
            </div>
            <div className="text-right">
              <p className={cx(CAPTION, "text-[#A1A1AA]")}>
                Condition grade
              </p>
              <p className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-white">
                <Award className="h-4 w-4 text-[#6E56CF]" aria-hidden />
                {HERO_CERT.grade} — {HERO_CERT.gradeLabel}
              </p>
            </div>
          </div>

          {/* findings on file — staggers in with the seal */}
          <motion.ul
            variants={container}
            initial="hidden"
            animate={inView ? "show" : "hidden"}
            className="mt-6 flex flex-col gap-2 border-t border-white/10 pt-6"
          >
            {HERO_CERT.findings.map((f) => (
              <motion.li
                key={f}
                variants={row}
                className="flex items-start gap-2 text-[0.8125rem] font-normal leading-[1.6] text-[#A1A1AA]"
              >
                <FileCheck2
                  className="mt-0.5 h-4 w-4 shrink-0 text-[#6E56CF]"
                  strokeWidth={2}
                  aria-hidden
                />
                {f}
              </motion.li>
            ))}
          </motion.ul>

          {/* seller verification — always visible, never hover-gated */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-t border-white/10 pt-6">
            <span className="inline-flex items-center gap-1.5 text-[0.8125rem] font-semibold text-white">
              <BadgeCheck className="h-4 w-4 text-[#6E56CF]" aria-hidden />
              {HERO_CERT.seller}
            </span>
            <span className="text-[0.75rem] font-normal text-[#A1A1AA]">
              {HERO_CERT.sellerMeta}
            </span>
          </div>

          {/* price fairness verdict */}
          <div className="mt-4 flex items-center gap-2 text-[0.8125rem] font-normal text-[#A1A1AA]">
            <ScaleIcon
              className="h-4 w-4 shrink-0 text-[#6E56CF]"
              aria-hidden
            />
            {HERO_CERT.priceVerdict}
          </div>

          <div className="mt-4 flex items-baseline gap-2">
            <span className={cx("text-2xl font-extrabold text-white", NUM)}>
              ${HERO_CERT.price}
            </span>
            <span
              className={cx(
                "font-normal text-[#A1A1AA] line-through",
                NUM,
                "text-sm",
              )}
            >
              ${HERO_CERT.original}
            </span>
            <span
              className={cx(
                "ml-auto rounded-md bg-[#6E56CF] px-2 py-0.5 text-sm font-semibold text-white",
                NUM,
              )}
            >
              -{HERO_CERT.discount}%
            </span>
          </div>

          {/* signature line */}
          <div className="mt-7 border-t border-dashed border-white/15 pt-4">
            <p className="text-[0.8125rem] font-semibold italic text-white">
              {LAB}
            </p>
            <p className="mt-0.5 text-[0.7rem] font-normal text-[#A1A1AA]">
              {ISSUED}
            </p>
          </div>
        </div>
      </div>

      {/* wax seal — stamps down on reveal; purely reinforces the on-record
          verdict above (aria-hidden, all findings already have real text) */}
      <motion.div
        initial={
          reduced ? false : { opacity: 0, scale: 0.4, rotate: -28 }
        }
        animate={inView ? { opacity: 1, scale: 1, rotate: -8 } : {}}
        transition={
          reduced
            ? { duration: 0 }
            : { type: "spring", stiffness: 260, damping: 16, delay: 0.5 }
        }
        className="absolute bottom-0 right-0 flex h-20 w-20 items-center justify-center rounded-full border-2 border-[#6E56CF] bg-[#0B0B0F] shadow-[0_0_0_4px_#0B0B0F]"
        aria-hidden
      >
        <Stamp className="h-8 w-8 text-[#6E56CF]" strokeWidth={2} />
      </motion.div>
    </div>
  );
}
