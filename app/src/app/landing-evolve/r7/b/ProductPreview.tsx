"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { BadgeCheck, SlidersHorizontal } from "lucide-react";
import { PRODUCTS, EASE, VIEWPORT, cx, comma, EYEBROW, CAPTION, NUM } from "./data";

/**
 * Four parallel matches, each already carrying its full verdict — match %,
 * condition grade, verified-seller badge, before/after price — in the
 * resting state (no hover/focus required, touch-safe). Hover or keyboard
 * focus adds one extra, genuinely additive layer: the single strongest
 * equalizer channel behind that match, fading in beneath the core proof
 * rather than replacing it.
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
        <p className={cx(EYEBROW, "text-[#a894f7]")}>Fig. 02 — On the rack right now</p>
        <h2 className="mt-4 text-[clamp(1.9rem,5vw,2.75rem)] font-extrabold leading-[1.08] tracking-[-0.02em] text-white">
          Four matches. Every channel already scored.
        </h2>
        <p className="mt-5 text-base font-normal leading-[1.6] text-[#A1A1AA]">
          Match score, condition grade, and seller verification are stamped
          on before you touch anything. Hover or focus a card to see which
          channel carried it.
        </p>
      </motion.div>

      <motion.div
        initial={reduced ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VIEWPORT}
        transition={{ duration: 0.6, ease: EASE, delay: reduced ? 0 : 0.05 }}
        className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {PRODUCTS.map((item) => (
          <div
            key={item.id}
            tabIndex={0}
            className={cx(
              "group flex flex-col overflow-hidden rounded-lg border border-white/10 bg-white/[0.02] text-left outline-none transition-all duration-150",
              "hover:-translate-y-1 hover:border-white/25 focus-visible:-translate-y-1 focus-visible:border-white/25",
              "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0F] focus-visible:ring-[#6E56CF]",
            )}
          >
            <span className="relative aspect-[4/3] w-full overflow-hidden">
              <Image
                src={item.image}
                alt={item.alt}
                fill
                sizes="(min-width: 1024px) 260px, (min-width: 640px) 45vw, 100vw"
                className="object-cover"
              />
              <span className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-[#0B0B0F]/85 to-transparent" />
              <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full border border-white/20 bg-[#0B0B0F]/85 px-2 py-0.5 text-[0.68rem] font-semibold text-white backdrop-blur">
                <span className={NUM}>{item.match}% match</span>
              </span>
              <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full border border-[#6E56CF]/50 bg-[#6E56CF]/25 px-2 py-0.5 text-[0.68rem] font-semibold text-white backdrop-blur">
                {item.grade} grade
              </span>
              <span className={cx(CAPTION, "absolute bottom-2 left-3 text-white/80")}>
                {item.category}
              </span>
            </span>

            <span className="flex flex-1 flex-col gap-2 p-3.5">
              <span className={cx(CAPTION, "text-[#A1A1AA]")}>{item.brand}</span>
              <span className="line-clamp-2 text-[0.9rem] font-semibold leading-snug text-white">
                {item.title}
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

              {/* always visible on its own — hover/focus only intensifies it below */}
              <span className="flex items-center gap-1.5 border-t border-white/10 pt-2 text-[0.7rem] font-normal text-[#A1A1AA] transition-colors duration-150 group-hover:text-white group-focus-visible:text-white">
                <SlidersHorizontal
                  className="h-3 w-3 shrink-0 text-[#6E56CF] transition-transform duration-150 group-hover:scale-110 group-focus-visible:scale-110"
                  aria-hidden
                />
                Strongest channel: {item.topSignal} ({item.topSignalValue}%)
              </span>
            </span>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
