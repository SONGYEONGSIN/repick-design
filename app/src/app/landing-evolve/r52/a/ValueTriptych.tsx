"use client";

import { Clock3, Sparkles, Wallet } from "lucide-react";
import { LISTINGS, DAY_MAX, DAY_MIN, DAY_STEP } from "./data";
import { computeAggregate, formatCount } from "./model";
import { Reveal } from "./Reveal";
import { Scrubber } from "./Scrubber";
import { ACCENT_HEX, EYEBROW } from "./tokens";

type ValueTriptychProps = {
  scrubDay: number;
  onScrubDayChange: (next: number) => void;
};

/**
 * Section 3 -- the live mechanic's own showcase. Mirrors the Hero's scrubber onto the SAME lifted
 * `scrubDay` state (one continuous value, two places to grab it, never two independent controls),
 * so every number in these three columns recomputes the instant either control moves.
 */
export function ValueTriptych({ scrubDay, onScrubDayChange }: ValueTriptychProps) {
  const aggregate = computeAggregate(LISTINGS, scrubDay);

  const parts = [
    {
      icon: Wallet,
      title: "Price, not guesswork",
      value: `${aggregate.avgDiscountPct}% off retail`,
      copy: "The average listing on repick is already marked down this much by Day " +
        scrubDay +
        " -- priced from real buyer response, not a seller's hope.",
    },
    {
      icon: Sparkles,
      title: "A wider match pool",
      value: `${aggregate.avgMatchPct}% avg. match score`,
      copy: `${formatCount(aggregate.qualifiedBuyers)} buyers currently clear the asking price across repick's active listings at this point in a listing's life.`,
    },
    {
      icon: Clock3,
      title: "Certainty, sooner",
      value: `${aggregate.estDaysToMatch} days to match`,
      copy: "That's how long repick's model expects a listing priced like this to take from here to a confirmed match.",
    },
  ];

  return (
    <section id="value" className="px-4 py-20 sm:px-6 lg:px-10 lg:py-24" aria-labelledby="value-heading">
      <div className="mx-auto max-w-[1320px]">
        <Reveal>
          <p className={`${EYEBROW} text-[#A1A1AA]`}>value, in three parts</p>
          <h2
            id="value-heading"
            className="mt-3 max-w-[680px] text-[clamp(1.75rem,3vw+1rem,2.75rem)] font-extrabold leading-[1.1] tracking-[-0.02em] text-white"
          >
            One timeline. Three numbers that actually move with it.
          </h2>
        </Reveal>

        <Reveal delay={0.05} className="mt-8 max-w-[420px]">
          <div
            className="rounded-2xl p-5 sm:p-6"
            style={{ backgroundColor: "#13131A", border: "1px solid #22222C" }}
          >
            <Scrubber
              value={scrubDay}
              min={DAY_MIN}
              max={DAY_MAX}
              step={DAY_STEP}
              onChange={onScrubDayChange}
              label="Listing age"
              readout={`Day ${scrubDay}`}
              describedBy="value-columns"
            />
          </div>
        </Reveal>

        <div id="value-columns" className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {parts.map((part, index) => (
            <Reveal key={part.title} delay={0.1 + index * 0.06} className="min-w-0">
              <div className="min-w-0 rounded-2xl p-6" style={{ backgroundColor: "#13131A", border: "1px solid #22222C" }}>
                <part.icon aria-hidden="true" className="mb-4 h-5 w-5" style={{ color: ACCENT_HEX }} />
                <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-[#A1A1AA]">
                  {part.title}
                </p>
                <p className="mt-2 text-[28px] font-extrabold tabular-nums leading-tight text-white">
                  {part.value}
                </p>
                <p className="mt-3 text-[15px] font-normal leading-[1.6] text-[#A1A1AA]">
                  {part.copy}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
