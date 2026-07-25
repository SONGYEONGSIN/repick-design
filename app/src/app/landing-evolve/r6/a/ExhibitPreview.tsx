"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { BadgeCheck, FileCheck2, Scale as ScaleIcon, Stamp } from "lucide-react";
import {
  PRODUCTS,
  EASE,
  VIEWPORT,
  cx,
  comma,
  EYEBROW,
  CAPTION,
  NUM,
  FOCUS,
} from "./data";

/**
 * Case files on record — four exhibits, each already carrying its core
 * verdict (match %, condition grade, verified seller, before/after price) in
 * the resting state, visible without any hover or click. Selecting an
 * exhibit swaps the "appraisal notes" panel below to that item's real
 * findings and price verdict — the interaction reveals genuine computed
 * content, not a decorative flourish.
 */
export default function ExhibitPreview() {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const p = PRODUCTS[active];

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
          Fig. 02 — Case files on record
        </p>
        <h2 className="mt-4 text-[clamp(1.9rem,5vw,2.75rem)] font-extrabold leading-[1.08] tracking-[-0.02em] text-white">
          Four listings. Four verdicts, already on file.
        </h2>
        <p className="mt-5 text-base font-normal leading-[1.6] text-[#A1A1AA]">
          Every exhibit below ships with its match score, condition grade,
          and seller verification stamped on — before you click anything.
          Select one to read the full appraisal notes.
        </p>
      </motion.div>

      {/* exhibit stubs — core proof always visible at rest */}
      <motion.div
        role="tablist"
        aria-label="Appraised exhibits"
        initial={reduced ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VIEWPORT}
        transition={{ duration: 0.6, ease: EASE, delay: reduced ? 0 : 0.05 }}
        className="mt-12 grid grid-cols-1 gap-4 overflow-x-auto sm:grid-cols-2 lg:grid-cols-4"
      >
        {PRODUCTS.map((item, i) => {
          const selected = i === active;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              id={`exhibit-tab-${item.id}`}
              aria-selected={selected}
              aria-controls={`exhibit-panel-${item.id}`}
              onClick={() => setActive(i)}
              className={cx(
                "group flex flex-col overflow-hidden rounded-lg border text-left transition-colors duration-150",
                selected
                  ? "border-[#6E56CF]/60 bg-[#6E56CF]/[0.08]"
                  : "border-white/10 bg-white/[0.02] hover:border-white/25",
                FOCUS,
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
                  {item.exhibit}
                </span>
              </span>

              <span className="flex flex-1 flex-col gap-2 p-3.5">
                <span className={cx(CAPTION, "text-[#A1A1AA]")}>
                  {item.brand}
                </span>
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
              </span>
            </button>
          );
        })}
      </motion.div>

      {/* appraisal notes panel — remounts on selection to replay the reveal */}
      <motion.div
        key={p.id}
        role="tabpanel"
        id={`exhibit-panel-${p.id}`}
        aria-labelledby={`exhibit-tab-${p.id}`}
        initial={reduced ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE }}
        className="mt-6 overflow-hidden rounded-lg border border-white/10 bg-white/[0.02] p-6 sm:p-7"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
          <h3 className={cx(CAPTION, "flex items-center gap-2 text-[#A1A1AA]")}>
            <Stamp className="h-4 w-4 text-[#6E56CF]" aria-hidden />
            Appraisal notes — {p.exhibit}
          </h3>
          <span className={cx(NUM, "text-[0.7rem] font-normal text-[#A1A1AA]")}>
            No. {p.serial}
          </span>
        </div>

        <ul className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-x-8 sm:gap-y-2">
          {p.findings.map((f) => (
            <li
              key={f}
              className="flex items-start gap-2 text-[0.8125rem] font-normal leading-[1.6] text-[#A1A1AA] sm:basis-[calc(50%-1rem)]"
            >
              <FileCheck2
                className="mt-0.5 h-4 w-4 shrink-0 text-[#6E56CF]"
                strokeWidth={2}
                aria-hidden
              />
              {f}
            </li>
          ))}
        </ul>

        <p className="mt-4 flex items-center gap-2 border-t border-white/10 pt-4 text-[0.8125rem] font-normal text-[#A1A1AA]">
          <ScaleIcon className="h-4 w-4 shrink-0 text-[#6E56CF]" aria-hidden />
          {p.priceVerdict}
          <span className="ml-1 text-white/40">·</span>
          {p.sellerMeta}
        </p>
      </motion.div>
    </section>
  );
}
