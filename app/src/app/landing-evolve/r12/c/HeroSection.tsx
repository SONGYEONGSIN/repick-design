"use client";

import { useId, useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, BadgeCheck, Percent, Tag } from "lucide-react";
import {
  HERO_LISTINGS,
  discountOf,
  money,
  cx,
  EYEBROW,
  CAPTION,
  NUM,
  FOCUS,
} from "./data";

/**
 * Hero: headline + subhead + single primary CTA on the left, a live listing card on the right —
 * both inside the first fold, with match %, grade, certified and the before/after discount all
 * visible without scrolling (design-principles §Landing 구조 기본형 1). The category tabs are the
 * hero's own interaction: switching them swaps the photo *and* every proof figure beside it, so the
 * card is never a static screenshot.
 */
export default function HeroSection() {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const tablistId = useId();

  const listing = HERO_LISTINGS[active];
  const discount = discountOf(listing);

  const move = (next: number) => {
    const i = (next + HERO_LISTINGS.length) % HERO_LISTINGS.length;
    setActive(i);
    tabRefs.current[i]?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") { e.preventDefault(); move(active + 1); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); move(active - 1); }
    else if (e.key === "Home") { e.preventDefault(); move(0); }
    else if (e.key === "End") { e.preventDefault(); move(HERO_LISTINGS.length - 1); }
  };

  return (
    <section id="hero" className="border-b border-white/10 bg-[#0B0C10]">
      <div className="mx-auto grid w-full max-w-[1120px] grid-cols-1 items-start gap-12 px-5 pb-16 pt-10 sm:px-8 sm:pt-14 lg:grid-cols-12 lg:gap-10 lg:pb-24">
        {/* left: headline */}
        <div className="lg:col-span-6">
          <p className={cx(EYEBROW, "text-[#22d3ee]")}>Repick resale engine</p>
          <h1 className="mt-5 text-[clamp(2.1rem,6.4vw,2.9rem)] font-extrabold leading-[1.05] tracking-[-0.02em] text-white lg:text-[clamp(2.6rem,3.6vw,3.4rem)]">
            List it once. Watch the price get built in front of you.
          </h1>
          <p className="mt-6 max-w-[480px] text-base font-normal leading-[1.6] text-[#A1A1AA]">
            Every photo gets inspected, every defect gets priced, and the offer you
            see is the exact evidence a buyer already trusts before they pay.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <motion.a
              href="#estimate"
              whileHover={reduced ? undefined : { y: -2 }}
              whileTap={reduced ? undefined : { y: 0, scale: 0.98 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className={cx(
                "inline-flex items-center justify-center gap-2 rounded-full bg-[#e11d48] px-6 py-3 text-sm font-semibold text-white transition-colors duration-150 hover:bg-[#c81440]",
                FOCUS,
              )}
            >
              Start a listing
              <ArrowRight className="h-4 w-4" strokeWidth={2.5} aria-hidden />
            </motion.a>
            <a
              href="#how-it-works"
              className={cx(
                "inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-3 text-sm font-semibold text-white/80 transition-colors duration-150 hover:text-white",
                FOCUS,
              )}
            >
              See how pricing works
            </a>
          </div>

          <p className="mt-8 max-w-[480px] text-sm font-normal leading-[1.6] text-[#A1A1AA]">
            <span className="font-semibold text-white">Why this match:</span>{" "}
            {listing.aiTag}
          </p>
        </div>

        {/* right: live listing card */}
        <div className="lg:col-span-6">
          <div
            role="tablist"
            aria-label="Preview a category"
            onKeyDown={onKeyDown}
            className="inline-flex w-full gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1"
          >
            {HERO_LISTINGS.map((l, i) => {
              const selected = i === active;
              return (
                <button
                  key={l.id}
                  ref={(el) => { tabRefs.current[i] = el; }}
                  role="tab"
                  id={`${tablistId}-tab-${l.id}`}
                  aria-selected={selected}
                  aria-controls={`${tablistId}-panel`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActive(i)}
                  className={cx(
                    "flex-1 rounded-full px-3 py-2 text-xs font-semibold transition-colors duration-200",
                    selected ? "bg-[#0e7490] text-white" : "text-[#A1A1AA] hover:text-white",
                    FOCUS,
                  )}
                >
                  {l.category}
                </button>
              );
            })}
          </div>

          <div
            id={`${tablistId}-panel`}
            role="tabpanel"
            aria-labelledby={`${tablistId}-tab-${listing.id}`}
            className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]"
          >
            <div className="relative aspect-[16/11] w-full bg-[#1B1C24]">
              <Image
                src={listing.image.src}
                alt={listing.image.alt}
                fill
                priority
                sizes="(min-width: 1024px) 520px, 100vw"
                className="object-cover"
              />
            </div>

            <div className="p-5 sm:p-6">
              <p className={cx(CAPTION, "text-[#A1A1AA]")}>{listing.brand}</p>
              <h2 className="mt-1 text-lg font-extrabold leading-snug tracking-[-0.01em] text-white">
                {listing.title}
              </h2>

              {/* proof row — match / grade / certified, never overlaid on the photo above */}
              <dl className="mt-4 grid grid-cols-3 gap-3 border-t border-white/10 pt-4">
                <div>
                  <dt className="flex items-center gap-1 text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-[#A1A1AA]">
                    <Percent className="h-3 w-3 text-[#22d3ee]" aria-hidden />
                    Match
                  </dt>
                  <dd className={cx(NUM, "mt-1 text-xl font-extrabold text-white")}>
                    {listing.match}%
                  </dd>
                </div>
                <div>
                  <dt className="flex items-center gap-1 text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-[#A1A1AA]">
                    <Tag className="h-3 w-3 text-[#22d3ee]" aria-hidden />
                    Grade
                  </dt>
                  <dd className={cx(NUM, "mt-1 text-xl font-extrabold text-white")}>
                    {listing.grade}
                  </dd>
                </div>
                <div>
                  <dt className="flex items-center gap-1 text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-[#A1A1AA]">
                    <BadgeCheck className="h-3 w-3 text-[#22d3ee]" aria-hidden />
                    Certified
                  </dt>
                  <dd className="mt-1 text-xl font-extrabold text-white">
                    {listing.certified ? "Yes" : "No"}
                  </dd>
                </div>
              </dl>

              {/* price row — before/after discount */}
              <div className="mt-4 flex items-baseline justify-between gap-3 border-t border-white/10 pt-4">
                <div className="flex items-baseline gap-2">
                  <span className={cx(NUM, "text-2xl font-extrabold text-white")}>
                    {money(listing.offer)}
                  </span>
                  <span className={cx(NUM, "text-sm font-normal text-[#A1A1AA] line-through")}>
                    {money(listing.original)}
                  </span>
                </div>
                <span className={cx(NUM, "rounded-full bg-[#e11d48] px-2.5 py-1 text-xs font-semibold text-white")}>
                  {discount}% off
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
