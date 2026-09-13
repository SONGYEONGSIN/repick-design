"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowRight, ArrowUpDown } from "lucide-react";
import CompareMatrix from "./CompareMatrix";
import ListingChip from "./ListingChip";
import { MAX_COMPARE, type Listing } from "./data";
import { ACCENT_BRIGHT_HEX, ACCENT_HEX, cx, DISPLAY_STYLE, FOCUS, MUTED, NUM, PARA_WIDTH_16, TRACK_EYEBROW } from "./tokens";

interface HeroProps {
  allListings: Listing[];
  selectedListings: Listing[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  sortByGap: boolean;
  onToggleSort: () => void;
  topMatch: number;
}

export default function Hero({
  allListings,
  selectedListings,
  selectedIds,
  onToggle,
  sortByGap,
  onToggleSort,
  topMatch,
}: HeroProps) {
  const reduceMotion = useReducedMotion();
  const count = selectedIds.length;

  const fadeUp: Variants = reduceMotion
    ? { hidden: { opacity: 1, y: 0 }, show: { opacity: 1, y: 0 } }
    : { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } };

  return (
    <section className="relative overflow-hidden border-b border-[#1C1C22] bg-[#0B0B0F] px-6 pb-16 pt-28 sm:px-10 lg:px-16">
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-8">
        {/* Left: headline, subhead, single CTA — asymmetric, oversized clamp() scale */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="min-w-0 lg:col-span-5"
        >
          <p className={cx("text-[11px] font-semibold uppercase", TRACK_EYEBROW)} style={{ color: ACCENT_BRIGHT_HEX }}>
            AI matching · live compare console
          </p>
          <h1
            className="mt-5 text-white"
            style={{
              ...DISPLAY_STYLE,
              fontWeight: 800,
              letterSpacing: "-0.02em",
              fontSize: "clamp(2.5rem, 3vw + 1.8rem, 4.75rem)",
              lineHeight: 1.03,
            }}
          >
            Compare listings,
            <br />
            side by side.
          </h1>
          <p className={cx("mt-6 text-[16px] font-normal leading-[1.6]", MUTED, PARA_WIDTH_16)}>
            Pick up to three AI-matched listings and repick builds one live table &mdash; price,
            condition, verification and match score &mdash; with the strongest cell in every row
            marked for you. Change your picks and the whole table recomputes in place.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href="#preview"
              className={cx(
                "inline-flex items-center gap-2 rounded-full px-6 py-3 text-[14px] font-semibold text-white transition-transform duration-150 hover:-translate-y-0.5",
                FOCUS,
              )}
              style={{ backgroundColor: ACCENT_HEX }}
            >
              See matched listings
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <span className="text-[13px] font-normal text-zinc-400">No account needed to compare.</span>
          </div>
        </motion.div>

        {/* Right: the console itself — selectable listings + the live comparison matrix, all inside
            the hero component, per the structural rule that proof never waits for a scroll. */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          transition={{ duration: 0.55, delay: reduceMotion ? 0 : 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="min-w-0 lg:col-span-7"
        >
          <div className="rounded-2xl border border-[#1C1C22] bg-[#111116] p-5 sm:p-7">
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
                Choose up to {MAX_COMPARE} to compare
              </p>
              <p className={cx(NUM, "text-[11px] font-normal text-zinc-400")}>
                {count} / {MAX_COMPARE} selected
              </p>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {allListings.map((listing) => {
                const selected = selectedIds.includes(listing.id);
                const atMax = count >= MAX_COMPARE;
                const isOnly = selected && count === 1;
                const disabled = isOnly || (!selected && atMax);
                const disabledReason = isOnly
                  ? "This is your only selected listing — add another before removing it."
                  : !selected && atMax
                    ? `Comparing ${MAX_COMPARE} listings already — remove one to add this.`
                    : undefined;
                return (
                  <ListingChip
                    key={listing.id}
                    listing={listing}
                    selected={selected}
                    disabled={disabled}
                    disabledReason={disabledReason}
                    onToggle={() => onToggle(listing.id)}
                  />
                );
              })}
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[#1C1C22] pt-5">
              <p aria-live="polite" className="text-[13px] font-normal leading-[1.5] text-zinc-300">
                Comparing <span className="font-semibold text-white">{count}</span>{" "}
                listing{count === 1 ? "" : "s"}. Best AI match right now:{" "}
                <span className={cx(NUM, "font-semibold")} style={{ color: ACCENT_BRIGHT_HEX }}>
                  {topMatch}%
                </span>
                .
              </p>
              <button
                type="button"
                onClick={onToggleSort}
                disabled={count < 2}
                aria-pressed={sortByGap}
                className={cx(
                  "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2.5 text-[11px] font-semibold transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-40",
                  FOCUS,
                )}
                style={
                  sortByGap
                    ? { backgroundColor: ACCENT_HEX, borderColor: ACCENT_HEX, color: "#fff" }
                    : { borderColor: "#27272E", color: "#A1A1AA" }
                }
              >
                <ArrowUpDown className="h-3.5 w-3.5" aria-hidden="true" />
                Sort by biggest gap
              </button>
            </div>

            <div className="mt-4">
              <CompareMatrix listings={selectedListings} sortByGap={sortByGap} />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
