"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { BadgeCheck, TrendingDown } from "lucide-react";
import {
  PRODUCTS,
  EASE,
  VIEWPORT,
  cx,
  comma,
  EYEBROW,
  CAPTION,
  NUM,
} from "./data";

/**
 * Product preview — three parallel rich cards. Match score, condition
 * grade, verified-seller badge, and the before/after discount are printed
 * directly on every card at rest (never hover/focus-only), matching the
 * brief's "prove it before they ask" rule. Hover/focus adds a small lift +
 * border brighten on top of that baseline — additive feedback, not the
 * reveal mechanism itself.
 */
export default function ProductPreview() {
  const reduced = useReducedMotion();

  return (
    <section
      id="preview"
      className="mx-auto w-full max-w-[1120px] px-5 py-24 sm:px-8"
    >
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VIEWPORT}
        transition={{ duration: 0.5, ease: EASE }}
        className="max-w-2xl"
      >
        <p className={cx(EYEBROW, "text-[#a894f7]")}>
          Fig. 02 — Now boarding
        </p>
        <h2 className="mt-4 text-[clamp(1.9rem,5vw,2.75rem)] font-extrabold leading-[1.08] tracking-[-0.02em] text-white">
          Three rows, pulled off the board.
        </h2>
        <p className="mt-5 text-base font-normal leading-[1.6] text-[#A1A1AA]">
          Every listing that reaches the board already carries its match
          score, condition grade, and seller verification — printed on the
          card, not buried behind a click.
        </p>
      </motion.div>

      <motion.div
        initial={reduced ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VIEWPORT}
        transition={{ duration: 0.6, ease: EASE, delay: reduced ? 0 : 0.05 }}
        className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {PRODUCTS.map((p) => (
          <article
            key={p.id}
            tabIndex={0}
            className={cx(
              "group flex flex-col overflow-hidden rounded-lg border border-white/10 bg-white/[0.02] transition-[transform,border-color] duration-150",
              "hover:-translate-y-1 hover:border-white/25 focus-within:-translate-y-1 focus-within:border-[#6E56CF]/60",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0F] focus-visible:ring-[#6E56CF]",
            )}
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              <Image
                src={p.image}
                alt={p.alt}
                fill
                sizes="(min-width: 1024px) 350px, (min-width: 640px) 45vw, 100vw"
                className="object-cover"
              />
              <span className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0B0B0F]/85 to-transparent" />

              {/* always-visible badges — never hover/focus-gated */}
              <span className="absolute left-2.5 top-2.5 inline-flex items-center gap-1 rounded-full border border-white/20 bg-[#0B0B0F]/85 px-2 py-0.5 text-[0.68rem] font-semibold text-white backdrop-blur">
                <span className={NUM}>{p.match}% match</span>
              </span>
              <span className="absolute right-2.5 top-2.5 inline-flex items-center gap-1 rounded-full border border-[#6E56CF]/50 bg-[#6E56CF]/25 px-2 py-0.5 text-[0.68rem] font-semibold text-white backdrop-blur">
                Grade {p.grade}
              </span>
              <span className={cx(CAPTION, "absolute bottom-2 left-3 font-semibold text-white/80")}>
                {p.category}
              </span>
            </div>

            <div className="flex flex-1 flex-col gap-2.5 p-4 sm:p-5">
              <span className={cx(CAPTION, "font-semibold text-[#A1A1AA]")}>
                {p.brand}
              </span>
              <h3 className="text-[0.95rem] font-semibold leading-snug text-white">
                {p.title}
              </h3>
              <p className="text-[0.78rem] font-normal leading-[1.5] text-[#A1A1AA]">
                {p.gradeLabel}
              </p>

              <span className="mt-1 inline-flex items-center gap-1.5 text-[0.75rem] font-normal text-[#A1A1AA]">
                <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-[#6E56CF]" aria-hidden />
                {p.seller}
                <span className="text-white/30">·</span>
                {p.sellerTrades}
              </span>

              <span className="mt-auto flex flex-wrap items-baseline gap-2 border-t border-white/10 pt-3">
                <span className={cx("text-lg font-extrabold text-white", NUM)}>
                  ${comma(p.price)}
                </span>
                <span className={cx("text-[0.75rem] font-normal text-[#A1A1AA] line-through", NUM)}>
                  ${comma(p.original)}
                </span>
                <span
                  className={cx(
                    "ml-auto inline-flex items-center gap-1 rounded bg-[#6E56CF] px-1.5 py-0.5 text-[0.7rem] font-semibold text-white",
                    NUM,
                  )}
                >
                  <TrendingDown className="h-3 w-3" aria-hidden />-{p.discount}%
                </span>
              </span>
            </div>
          </article>
        ))}
      </motion.div>
    </section>
  );
}
