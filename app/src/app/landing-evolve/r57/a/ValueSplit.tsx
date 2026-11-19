"use client";

import { Banknote, Gem, ShieldCheck, Truck } from "lucide-react";
import { DualRangeSlider } from "./DualRangeSlider";
import { EligibilityTable } from "./EligibilityTable";
import { HANDLE_GAP, LISTINGS, PRICE_MAX_BOUND, PRICE_MIN_BOUND, PRICE_STEP } from "./data";
import {
  averageEligibleDiscount,
  cheapestEligiblePrice,
  eligibleCount,
  formatUsd,
  maxAchievableCount,
} from "./model";
import { ACCENT, BORDER, CAPTION, FG, MUTED, PROSE_WIDTH_COLUMN, STAT_TRACKING, SURFACE } from "./tokens";

interface ValueSplitProps {
  min: number;
  max: number;
  onChangeMin: (n: number) => void;
  onChangeMax: (n: number) => void;
}

const displayFace = { fontFamily: "var(--font-display-grotesk)" };

const LEGEND = [
  { icon: Banknote, label: "Within budget", note: "The only check your range above controls." },
  { icon: Gem, label: "Condition ≥ Good", note: "Fixed per listing — never moves with price." },
  { icon: ShieldCheck, label: "Verified seller", note: "Fixed per listing — never moves with price." },
  { icon: Truck, label: "Ships in 3 days", note: "Fixed per listing — never moves with price." },
];

/**
 * Chapter 03 — the value-prop 3-way split AND the home of the live recompute. Column A mirrors
 * the hero's exact slider state (same lifted min/max props, same component), column C restates
 * that same state as derived stats, and the checklist table below restates it a third time, per
 * listing. All three numbers below — the eligible count, the cheapest eligible price, and the
 * "short of the most your window can ever include" delta — come from the model.ts functions, so
 * none of them can drift from what the table itself shows.
 */
export function ValueSplit({ min, max, onChangeMin, onChangeMax }: ValueSplitProps) {
  const count = eligibleCount(LISTINGS, min, max);
  const cheapest = cheapestEligiblePrice(LISTINGS, min, max);
  const avgDiscount = averageEligibleDiscount(LISTINGS, min, max);
  const ceiling = maxAchievableCount(LISTINGS, PRICE_MIN_BOUND, PRICE_MAX_BOUND);
  const shortBy = ceiling - count;

  return (
    <section id="checklist" className="px-4 py-14 sm:px-8 lg:px-12 lg:py-20">
      <p className={CAPTION} style={{ color: MUTED }}>
        Chapter 03 — The checklist
      </p>
      <h2
        className="mt-2 text-[clamp(1.6rem,2.8vw+0.8rem,2.3rem)] font-extrabold tracking-[-0.02em]"
        style={{ ...displayFace, color: FG }}
      >
        Four checks, recomputed the moment you move a handle
      </h2>

      <div className="mt-8 grid min-w-0 gap-8 lg:grid-cols-3 lg:gap-10">
        {/* Column A: the same device, mirrored */}
        <div className="min-w-0 rounded-2xl p-5" style={{ border: `1px solid ${BORDER}`, backgroundColor: SURFACE }}>
          <DualRangeSlider
            bound={[PRICE_MIN_BOUND, PRICE_MAX_BOUND]}
            step={PRICE_STEP}
            gap={HANDLE_GAP}
            valueMin={min}
            valueMax={max}
            onChangeMin={onChangeMin}
            onChangeMax={onChangeMax}
          />
        </div>

        {/* Column B: what each check means — static legend, explicitly not range-driven */}
        <div className="min-w-0">
          <p className="text-[12.5px] font-semibold uppercase tracking-[0.08em]" style={{ color: MUTED }}>
            What counts
          </p>
          <ul className="mt-3 space-y-3">
            {LEGEND.map(({ icon: Icon, label, note }) => (
              <li key={label} className="flex gap-3">
                <Icon className="mt-0.5 h-4 w-4 shrink-0" style={{ color: ACCENT }} aria-hidden="true" />
                <div className={`min-w-0 ${PROSE_WIDTH_COLUMN}`}>
                  <p className="text-[14px] font-semibold" style={{ color: FG }}>
                    {label}
                  </p>
                  <p className="text-[13px] font-normal leading-[1.6]" style={{ color: MUTED }}>
                    {note}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Column C: live derived stats — every number here comes from model.ts */}
        <div className="min-w-0">
          <p className="text-[12.5px] font-semibold uppercase tracking-[0.08em]" style={{ color: MUTED }}>
            Right now
          </p>
          <p className={`mt-3 text-[2.6rem] font-extrabold leading-none tabular-nums ${STAT_TRACKING}`} style={{ color: ACCENT }}>
            {count}
            <span className="text-[1.1rem] font-normal tracking-normal" style={{ color: MUTED }}>
              {" "}
              / {LISTINGS.length}
            </span>
          </p>
          <p className="mt-1 text-[13px] font-normal leading-[1.6]" style={{ color: MUTED }}>
            eligible between {formatUsd(min)} and {formatUsd(max)}
            {shortBy > 0 ? (
              <>
                {" "}
                — {shortBy} short of the most this window can ever include ({ceiling} of{" "}
                {LISTINGS.length}, since two listings fail a fixed check no matter where you drag).
              </>
            ) : (
              " — the most this window can ever include, given two listings fail a fixed check."
            )}
          </p>
          <p className="mt-4 text-[14px] font-normal leading-[1.6]" style={{ color: FG }}>
            Cheapest eligible pick:{" "}
            <span className="font-semibold tabular-nums">{cheapest !== null ? formatUsd(cheapest) : "none right now"}</span>
          </p>
          <p className="mt-1 text-[14px] font-normal leading-[1.6]" style={{ color: FG }}>
            Avg. discount among eligible:{" "}
            <span className="font-semibold tabular-nums">{avgDiscount !== null ? `${avgDiscount}% off` : "—"}</span>
          </p>
        </div>
      </div>

      <div className="mt-10">
        <EligibilityTable listings={LISTINGS} min={min} max={max} />
      </div>
    </section>
  );
}
