"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { BadgeCheck, Award } from "lucide-react";
import { PRODUCTS, EASE, VIEWPORT, cx, comma, EYEBROW, CAPTION, NUM, FOCUS } from "./data";

/**
 * Product preview — four parallel rich cards. Match score, condition grade,
 * verified-seller badge, and the before/after discount are all part of each
 * card's resting state, never gated behind hover or focus. The photo sits in
 * a fixed-aspect box with its own background fill, so if the remote image
 * never loads the badges still land on a clean plate instead of overlapping
 * broken-image alt text. Hover/focus adds a small, purely additive lift on
 * top of that always-visible baseline.
 */
export default function ProductPreview() {
  const reduced = useReducedMotion();

  return (
    <section id="preview" className="mx-auto w-full max-w-[1120px] px-5 py-24 sm:px-8">
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VIEWPORT}
        transition={{ duration: 0.5, ease: EASE }}
        className="max-w-2xl"
      >
        <p className={cx(EYEBROW, "text-[#a894f7]")}>Fig. 02 — Already weighed</p>
        <h2 className="mt-4 text-[clamp(1.9rem,5vw,2.75rem)] font-extrabold leading-[1.08] tracking-[-0.02em] text-white">
          Four picks, already weighed against the alternative.
        </h2>
        <p className="mt-5 text-base font-normal leading-[1.6] text-[#A1A1AA]">
          Match score, condition grade, and seller verification sit on every
          card at rest — the same evidence that tips the scale up top.
        </p>
      </motion.div>

      <motion.div
        initial={reduced ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VIEWPORT}
        transition={{ duration: 0.6, ease: EASE, delay: reduced ? 0 : 0.05 }}
        className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
      >
        {PRODUCTS.map((item) => (
          <a
            key={item.id}
            href="#cta"
            className={cx(
              "group flex flex-col overflow-hidden rounded-lg border border-white/10 bg-white/[0.02] text-left transition-[transform,border-color] duration-200 hover:-translate-y-1 hover:border-white/25",
              FOCUS,
            )}
          >
            <span className="relative aspect-[4/3] w-full overflow-hidden bg-[#16161c]">
              <Image
                src={item.image}
                alt={item.alt}
                fill
                sizes="(min-width: 1024px) 260px, (min-width: 640px) 45vw, 100vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105 group-focus-visible:scale-105"
              />
              <span className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-[#0B0B0F]/85 to-transparent" />
              <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full border border-white/20 bg-[#0B0B0F]/85 px-2 py-0.5 text-[0.68rem] font-semibold text-white backdrop-blur">
                <span className={NUM}>{item.match}% match</span>
              </span>
              <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full border border-[#6E56CF]/50 bg-[#6E56CF]/25 px-2 py-0.5 text-[0.68rem] font-semibold text-white backdrop-blur">
                <Award className="h-3 w-3" aria-hidden />
                {item.grade} grade
              </span>
            </span>

            <span className="flex flex-1 flex-col gap-2 p-3.5">
              <span className={cx(CAPTION, "text-[#A1A1AA]")}>{item.brand}</span>
              <span className="line-clamp-2 text-[0.9rem] font-semibold leading-snug text-white">
                {item.title}
              </span>
              <span className="text-[0.75rem] font-normal text-[#A1A1AA]">
                {item.gradeLabel}
              </span>

              <span className="mt-1 inline-flex items-center gap-1.5 text-[0.75rem] font-normal text-[#A1A1AA]">
                <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-[#6E56CF]" aria-hidden />
                {item.seller}
              </span>

              <span className="mt-auto flex items-baseline gap-1.5 pt-1">
                <span className={cx("text-base font-extrabold text-white", NUM)}>
                  ${comma(item.price)}
                </span>
                <span className={cx("text-[0.7rem] font-normal text-[#A1A1AA] line-through", NUM)}>
                  ${comma(item.original)}
                </span>
                <span className={cx("ml-auto rounded bg-[#6E56CF] px-1.5 py-0.5 text-[0.68rem] font-semibold text-white", NUM)}>
                  -{item.discount}%
                </span>
              </span>
            </span>
          </a>
        ))}
      </motion.div>
    </section>
  );
}
