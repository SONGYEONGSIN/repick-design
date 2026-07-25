"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { BadgeCheck, Check, ShieldCheck } from "lucide-react";
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
 * Product preview — tapping/hovering the left selector reveals the right-side detail.
 * The detail card richly surfaces 5 kinds of matching evidence: 3 rationale tags + condition grade + verified seller + before/after discount + match %.
 */
export default function ProductPreview() {
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
        <p className={cx(EYEBROW, "text-[#a894f7]")}>Fig. 02 — Matching rationale</p>
        <h2 className="mt-4 font-extrabold leading-[1.08] tracking-[-0.02em] text-white text-[clamp(1.9rem,5vw,2.75rem)] break-keep">
          Why the AI chose this,
          <br />
          shown in full detail
        </h2>
        <p className="mt-5 text-base font-normal leading-[1.6] text-[#A1A1AA]">
          Tap a listing. Matching rationale, condition grade, seller
          verification, and discount vs. retail all unfold in one card.
        </p>
      </motion.div>

      <motion.div
        initial={reduced ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VIEWPORT}
        transition={{ duration: 0.6, ease: EASE, delay: reduced ? 0 : 0.05 }}
        className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-12"
      >
        {/* selector */}
        <div
          role="tablist"
          aria-label="List of matched listings"
          aria-orientation="horizontal"
          className="flex gap-3 overflow-x-auto pb-1 lg:col-span-5 lg:flex-col lg:overflow-visible lg:pb-0"
        >
          {PRODUCTS.map((item, i) => {
            const selected = i === active;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setActive(i)}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                className={cx(
                  "group flex min-w-[220px] items-center gap-4 rounded-2xl border p-3 text-left transition-colors duration-150 lg:min-w-0",
                  selected
                    ? "border-[#6E56CF]/60 bg-[#6E56CF]/10"
                    : "border-white/10 bg-white/[0.02] hover:border-white/25",
                  FOCUS,
                )}
              >
                <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    sizes="64px"
                    className={cx(
                      "object-cover transition-[filter] duration-150",
                      selected ? "" : "grayscale-[0.4] brightness-90",
                    )}
                  />
                </span>
                <span className="min-w-0 flex-1">
                  <span className={cx(CAPTION, "block text-[#A1A1AA]")}>
                    {item.category}
                  </span>
                  <span className="mt-1 block truncate text-[0.95rem] font-semibold text-white">
                    {item.title}
                  </span>
                  <span className={cx(NUM, "mt-1 block text-[0.8125rem] font-normal text-[#A1A1AA]")}>
                    AI match {item.match}%
                  </span>
                </span>
                <span
                  aria-hidden
                  className={cx(
                    "h-8 w-1 shrink-0 rounded-full transition-colors duration-150",
                    selected ? "bg-[#6E56CF]" : "bg-transparent",
                  )}
                />
              </button>
            );
          })}
        </div>

        {/* detail — remounts on key change, replaying the entrance animation */}
        <motion.figure
          key={p.id}
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="m-0 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] lg:col-span-7"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2">
            <div className="relative aspect-[4/3] w-full sm:aspect-auto sm:min-h-[340px]">
              <Image
                src={p.image}
                alt={p.alt}
                fill
                sizes="(min-width: 1024px) 320px, (min-width: 640px) 45vw, 100vw"
                className="object-cover"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-[#0B0B0F]/60 to-transparent sm:bg-gradient-to-r"
              />
              <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-[#0B0B0F]/80 px-2.5 py-1 text-[0.75rem] font-semibold text-white backdrop-blur">
                <span className={NUM}>AI match {p.match}%</span>
              </span>
              <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full border border-[#6E56CF]/50 bg-[#6E56CF]/20 px-2.5 py-1 text-[0.75rem] font-semibold text-white backdrop-blur">
                Grade {p.grade} · {p.gradeLabel}
              </span>
            </div>

            <figcaption className="flex flex-col gap-4 p-5 sm:p-6">
              <div>
                <p className={cx(CAPTION, "text-[#A1A1AA]")}>{p.brand}</p>
                <h3 className="mt-1 text-xl font-semibold leading-snug tracking-[-0.02em] text-white">
                  {p.title}
                </h3>
              </div>

              {/* verified seller */}
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="inline-flex items-center gap-1.5 text-[0.8125rem] font-semibold text-white">
                  <BadgeCheck className="h-4 w-4 text-[#6E56CF]" aria-hidden />
                  {p.seller}
                </span>
                <span className="text-[0.75rem] font-normal text-[#A1A1AA]">
                  {p.sellerMeta}
                </span>
              </div>

              {/* 3 matching-rationale tags — stagger reveal */}
              <ul className="flex flex-col gap-2">
                {p.reasons.map((r, i) => (
                  <motion.li
                    key={r}
                    initial={reduced ? false : { opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.35,
                      ease: EASE,
                      delay: reduced ? 0 : 0.08 + i * 0.07,
                    }}
                    className="flex items-center gap-2 text-[0.8125rem] font-normal text-[#A1A1AA]"
                  >
                    <Check className="h-4 w-4 shrink-0 text-[#6E56CF]" strokeWidth={2.5} aria-hidden />
                    {r}
                  </motion.li>
                ))}
              </ul>

              {/* before / after discount */}
              <div className="mt-auto flex items-baseline gap-2 border-t border-white/10 pt-4">
                <span className={cx("text-2xl font-extrabold text-white", NUM)}>
                  ₩{comma(p.price)}
                </span>
                <span className={cx("text-sm font-normal text-white/40 line-through", NUM)}>
                  ₩{comma(p.original)}
                </span>
                <span className={cx("ml-auto rounded-md bg-[#6E56CF] px-2 py-0.5 text-sm font-semibold text-white", NUM)}>
                  -{p.discount}%
                </span>
              </div>

              <p className="inline-flex items-center gap-1.5 text-[0.75rem] font-normal text-[#A1A1AA]">
                <ShieldCheck className="h-3.5 w-3.5 text-[#6E56CF]" aria-hidden />
                Measured by our inspection team · Defect report included
              </p>
            </figcaption>
          </div>
        </motion.figure>
      </motion.div>
    </section>
  );
}
