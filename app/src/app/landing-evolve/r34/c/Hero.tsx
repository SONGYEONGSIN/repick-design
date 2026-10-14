"use client";

import { BadgeCheck, Headphones } from "lucide-react";
import Reveal from "./Reveal";
import { Eyebrow } from "./ui";
import { SOLD_COMP } from "./data";
import { ACCENT_SOFT_BG, ACCENT_SOFT_BORDER, FOCUS } from "./theme";
import { computeBreakdown, formatUsd, type CategoryCounts } from "./payout-math";

interface HeroProps {
  counts: CategoryCounts;
}

/**
 * Hero carries the mandatory proof card. Match % and discount % — the two
 * canonical proof elements this catalog otherwise shows — are deliberately
 * left out here: a seller doesn't have a "match %" or a "discount" on
 * their own prospective listing. In their place is a real sold comparable
 * (fixed data) with the two proof elements that *do* transfer to a seller
 * audience — condition grade and a verified-sale badge — pulled into this
 * same component next to the live payout panel. See the candidate report
 * for the full note.
 */
export default function Hero({ counts }: HeroProps) {
  const { totalPayout, totalItems } = computeBreakdown(counts);
  const itemWord = totalItems === 1 ? "item" : "items";

  return (
    <section id="hero" className="relative border-b border-white/10 pb-16 pt-14 sm:pt-16 lg:pb-24 lg:pt-20">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-[640px]">
          <Reveal>
            <Eyebrow>SELLER PAYOUT CALCULATOR</Eyebrow>
          </Reveal>

          <Reveal delay={0.05}>
            <h1 className="mt-5 text-[clamp(2.25rem,1.85rem+2.1vw,4.25rem)] font-extrabold leading-[0.98] tracking-[-0.02em] text-white">
              Count what you&rsquo;re selling.
              <br />
              Watch it turn into a number.
            </h1>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="mt-6 text-base leading-[1.6] text-zinc-300 sm:text-lg" style={{ maxWidth: "505px" }}>
              No listing wizard, no waiting on a quote. Move the three counters below and this
              same screen recalculates your itemized payout, live, category by category.
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-8">
              <a
                href="#calculator"
                className={`inline-flex items-center justify-center rounded-full bg-sky-500 px-7 py-3.5 text-base font-bold text-[#0B0B0F] transition-opacity hover:opacity-90 ${FOCUS}`}
              >
                Start counting your items
              </a>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.12}>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:max-w-[780px] lg:gap-6">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-400">
                Recently sold comparable
              </p>
              <div className="mt-3 flex items-center gap-3">
                <div
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-sky-500/10"
                  style={{ aspectRatio: "1 / 1" }}
                  aria-hidden="true"
                >
                  <Headphones className="h-6 w-6 text-sky-300" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-white">{SOLD_COMP.name}</p>
                  <p className="truncate text-xs text-zinc-400">
                    {SOLD_COMP.category} &middot; Grade {SOLD_COMP.grade}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
                <span className="text-lg font-bold tabular-nums text-white">
                  {formatUsd(SOLD_COMP.soldPrice)}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.1em] text-emerald-300">
                  <BadgeCheck className="h-3 w-3" aria-hidden="true" />
                  Verified sale
                </span>
              </div>
              <p className="mt-2 text-xs leading-[1.5] text-zinc-400">
                Sold in {SOLD_COMP.daysToSell} days. Condition grade is what the buyer saw before
                paying — the same grading your own items go through.
              </p>
            </div>

            <div
              className="rounded-2xl border p-5"
              style={{ borderColor: ACCENT_SOFT_BORDER, backgroundColor: ACCENT_SOFT_BG }}
            >
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-sky-300">
                Your live estimate
              </p>
              <p aria-live="polite" className="mt-3 text-[clamp(2rem,1.6rem+1.6vw,3rem)] font-extrabold tabular-nums leading-none text-white">
                {formatUsd(totalPayout)}
              </p>
              <p className="mt-3 text-sm leading-[1.6] text-zinc-300">
                Estimated payout for {totalItems} {itemWord} across the three counters below.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
