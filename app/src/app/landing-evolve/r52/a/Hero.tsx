"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Gauge, TimerReset, Users } from "lucide-react";
import { LISTINGS } from "./data";
import { computeAggregate, computeItemState, formatCount } from "./model";
import { ProductCard } from "./ProductCard";
import { Scrubber } from "./Scrubber";
import { ACCENT_HEX, DISPLAY_FONT, EYEBROW, FOCUS_RING, ON_ACCENT_FILL_TEXT } from "./tokens";

type HeroProps = {
  scrubDay: number;
  onScrubDayChange: (next: number) => void;
  min: number;
  max: number;
  step: number;
};

const HERO_ITEMS = LISTINGS.slice(0, 3);

export function Hero({ scrubDay, onScrubDayChange, min, max, step }: HeroProps) {
  const prefersReducedMotion = useReducedMotion();
  const aggregate = computeAggregate(LISTINGS, scrubDay);

  const statCards = [
    {
      icon: Gauge,
      label: "Avg. match score",
      value: `${aggregate.avgMatchPct}%`,
    },
    {
      icon: TimerReset,
      label: "Est. time to match",
      value: `${aggregate.estDaysToMatch}d`,
    },
    {
      icon: Users,
      label: "Qualified buyers now",
      value: formatCount(aggregate.qualifiedBuyers),
    },
  ];

  return (
    <section
      id="try-the-match"
      className="px-4 pb-16 pt-28 sm:px-6 sm:pt-32 lg:px-10 lg:pb-24 lg:pt-36"
      aria-labelledby="hero-heading"
    >
      <div className="mx-auto grid max-w-[1320px] grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8">
        {/* Headline column -- asymmetric left-aligned, not centered. */}
        <div className="flex min-w-0 flex-col gap-6 lg:col-span-5">
          <p className={`${EYEBROW} text-[#A1A1AA]`}>repick · ai match engine</p>

          <h1
            id="hero-heading"
            className="text-[clamp(2.5rem,5vw+1rem,4.25rem)] font-extrabold leading-[1.04] tracking-[-0.02em] text-white"
            style={{ fontFamily: DISPLAY_FONT }}
          >
            Sell it at the <span style={{ color: ACCENT_HEX }}>moment</span> buyers actually want it.
          </h1>

          <p className="max-w-[520px] text-[17px] font-normal leading-[1.6] text-[#A1A1AA]">
            repick tracks price and buyer demand together, listing by listing. Drag the timeline
            below to see how a real match score and price actually move as a listing ages.
          </p>

          <div>
            <motion.a
              href="#value"
              className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-[14px] font-semibold ${ON_ACCENT_FILL_TEXT} ${FOCUS_RING}`}
              style={{ backgroundColor: ACCENT_HEX }}
              whileHover={prefersReducedMotion ? undefined : { scale: 1.03 }}
              whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
              transition={{ duration: 0.18 }}
            >
              Start matching now
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </motion.a>
          </div>
        </div>

        {/* Live device + its own proof, inside this same Hero component. */}
        <div className="flex min-w-0 flex-col gap-6 lg:col-span-7">
          <div
            className="rounded-2xl p-5 sm:p-6"
            style={{ backgroundColor: "#13131A", border: "1px solid #22222C" }}
          >
            <Scrubber
              value={scrubDay}
              min={min}
              max={max}
              step={step}
              onChange={onScrubDayChange}
              label="Listing age"
              readout={`Day ${scrubDay}`}
              describedBy="hero-stat-strip"
            />

            <div id="hero-stat-strip" className="mt-6 grid grid-cols-3 gap-3">
              {statCards.map((stat) => (
                <div key={stat.label} className="min-w-0 rounded-lg p-3" style={{ backgroundColor: "#0F0F14" }}>
                  <stat.icon aria-hidden="true" className="mb-2 h-4 w-4" style={{ color: ACCENT_HEX }} />
                  <p className="text-[20px] font-extrabold tabular-nums leading-none text-white sm:text-[24px]">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-[11px] font-normal leading-tight text-[#A1A1AA]">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {HERO_ITEMS.map((item) => (
              <ProductCard key={item.id} item={item} state={computeItemState(item, scrubDay)} compact />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
