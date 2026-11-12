"use client";

import Image from "next/image";
import { BadgeCheck, ShieldCheck, Sparkles, Clock3 } from "lucide-react";
import { PriceSlider } from "./PriceSlider";
import { DepletionChart } from "./DepletionChart";
import {
  MAIN_LOT,
  COMP_LOT,
  discountPct,
  formatUsd,
  INVENTORY_UNITS,
  HORIZON_DAYS,
  type DepletionPoint,
} from "./data";
import { CAPTION, DISPLAY, EYEBROW, FIG_CAPTION, MUTED_TEXT, STAT_LABEL } from "./tokens";

type Headline = {
  clears: boolean;
  day: number;
  pct: number;
  sentence: string;
};

export function Hero({
  price,
  onPriceChange,
  curve,
  sellOutDay,
  headline,
}: {
  price: number;
  onPriceChange: (next: number) => void;
  curve: DepletionPoint[];
  sellOutDay: number | null;
  headline: Headline;
}) {
  const mainDiscount = discountPct(MAIN_LOT.retailPrice, price);
  const compDiscount = discountPct(COMP_LOT.retailPrice, COMP_LOT.clearedPrice);

  return (
    <section id="simulator" className="mx-auto max-w-[1440px] px-4 pb-14 pt-10 sm:px-6 sm:pt-14 lg:px-10 lg:pb-20 lg:pt-16">
      <p className={`${EYEBROW} text-emerald-700`}>Price before you list, not after</p>
      <h1 className={`${DISPLAY} mt-3 max-w-3xl text-[clamp(2.25rem,4.2vw+1rem,4.75rem)] font-extrabold leading-[1.03] tracking-[-0.02em] text-[#121212]`}>
        Watch your price decide how fast it sells.
      </h1>
      <p className="mt-5 max-w-[555px] text-lg font-normal leading-[1.6] text-[#121212]">
        Move the slider to list this lot anywhere between {formatUsd(40)} and {formatUsd(220)}.
        A fixed demand curve — not a guess — projects how many units sell every day and when
        the lot runs out.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-x-10">
        {/* Simulator: slider + live stat + depletion chart */}
        <div className="min-w-0 lg:col-span-7">
          <div className="rounded-2xl border border-[#121212]/10 bg-[#121212]/[0.02] p-5 sm:p-6">
            <PriceSlider price={price} onChange={onPriceChange} />

            <div className="mt-7 flex flex-wrap items-end gap-x-4 gap-y-2 border-t border-[#121212]/10 pt-6">
              <span className={`${DISPLAY} text-[clamp(2.5rem,4.5vw,3.75rem)] font-extrabold leading-none tabular-nums text-[#121212]`}>
                {headline.clears ? headline.day : `${headline.pct}%`}
              </span>
              <span className={`${STAT_LABEL} ${MUTED_TEXT} pb-1.5`}>
                {headline.clears ? `day${headline.day === 1 ? "" : "s"} to sell out` : `sold through by day ${HORIZON_DAYS}`}
              </span>
            </div>
            <p className="mt-1.5 text-sm font-bold text-emerald-700" aria-live="polite">
              {headline.sentence}
            </p>

            <div className="mt-6">
              <DepletionChart price={price} curve={curve} sellOutDay={sellOutDay} />
            </div>
          </div>
        </div>

        {/* Product preview: the lot being priced + one closed comparable, each with proof badges in their own row */}
        <div className="min-w-0 flex flex-col gap-5 lg:col-span-5">
          <div className="rounded-2xl border border-[#121212]/10 bg-white p-4 sm:p-5">
            <p className={`${CAPTION} ${MUTED_TEXT}`}>Fig. 02 — This lot, live</p>
            <div className="mt-2 flex gap-4">
              <div className="relative aspect-[4/3] w-28 shrink-0 overflow-hidden rounded-lg bg-[#EFECE6] sm:w-32">
                <Image
                  src={MAIN_LOT.image}
                  alt={MAIN_LOT.alt}
                  fill
                  sizes="160px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-[#121212]">{MAIN_LOT.title}</p>
                <p className={`text-xs font-normal ${MUTED_TEXT}`}>{MAIN_LOT.lotNote}</p>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className={`text-xs font-normal ${MUTED_TEXT} line-through`}>{formatUsd(MAIN_LOT.retailPrice)}</span>
                  <span className="text-base font-extrabold tabular-nums text-[#121212]">{formatUsd(price)}</span>
                  <span className="text-xs font-bold tabular-nums text-emerald-700">−{mainDiscount}%</span>
                </div>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              <span className={`inline-flex items-center gap-1 rounded-full bg-emerald-700 px-2 py-0.5 ${CAPTION} text-white`}>
                <Sparkles className="h-3 w-3" aria-hidden="true" />
                {MAIN_LOT.matchPercent}% match
              </span>
              <span className={`inline-flex items-center rounded-full border border-[#121212]/20 px-2 py-0.5 ${CAPTION} text-[#121212]`}>
                Grade {MAIN_LOT.conditionGrade}
              </span>
              {MAIN_LOT.verified && (
                <span className={`inline-flex items-center gap-1 rounded-full border border-emerald-700/40 px-2 py-0.5 ${CAPTION} text-emerald-700`}>
                  <ShieldCheck className="h-3 w-3" aria-hidden="true" />
                  Verified seller
                </span>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-[#121212]/10 bg-[#121212]/[0.02] p-4 sm:p-5">
            <p className={`${CAPTION} ${MUTED_TEXT}`}>Fig. 03 — A closed lot, for comparison</p>
            <div className="mt-2 flex gap-4">
              <div className="relative aspect-[4/3] w-24 shrink-0 overflow-hidden rounded-lg bg-[#EFECE6] sm:w-28">
                <Image
                  src={COMP_LOT.image}
                  alt={COMP_LOT.alt}
                  fill
                  sizes="140px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-[#121212]">{COMP_LOT.title}</p>
                <p className={`text-xs font-normal ${MUTED_TEXT}`}>{COMP_LOT.lotNote}</p>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className={`text-xs font-normal ${MUTED_TEXT} line-through`}>{formatUsd(COMP_LOT.retailPrice)}</span>
                  <span className="text-base font-extrabold tabular-nums text-[#121212]">{formatUsd(COMP_LOT.clearedPrice)}</span>
                  <span className="text-xs font-bold tabular-nums text-emerald-700">−{compDiscount}%</span>
                </div>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              <span className={`inline-flex items-center gap-1 rounded-full border border-[#121212]/20 px-2 py-0.5 ${CAPTION} text-[#121212]`}>
                <Clock3 className="h-3 w-3" aria-hidden="true" />
                Sold out in {COMP_LOT.clearedDays}d
              </span>
              <span className={`inline-flex items-center rounded-full border border-[#121212]/20 px-2 py-0.5 ${CAPTION} text-[#121212]`}>
                Grade {COMP_LOT.conditionGrade}
              </span>
              {COMP_LOT.verified && (
                <span className={`inline-flex items-center gap-1 rounded-full border border-emerald-700/40 px-2 py-0.5 ${CAPTION} text-emerald-700`}>
                  <BadgeCheck className="h-3 w-3" aria-hidden="true" />
                  Verified
                </span>
              )}
            </div>
            <p className={`mt-2 ${FIG_CAPTION} ${MUTED_TEXT}`}>
              Historical result from a {COMP_LOT.lotSize}-unit lot — fixed, not driven by the slider above.
            </p>
          </div>
        </div>
      </div>

      <p className="sr-only">
        This simulation starts every lot at {INVENTORY_UNITS} units and projects {HORIZON_DAYS} days forward using a fixed
        price-elasticity formula, recalculated whenever the list price changes.
      </p>
    </section>
  );
}
