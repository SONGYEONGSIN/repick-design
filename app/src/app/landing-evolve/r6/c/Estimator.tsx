"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import {
  CATEGORIES,
  CONDITIONS,
  BUDGET_MIN,
  BUDGET_MAX,
  BUDGET_STEP,
  defaultBudgetFor,
  computeEstimate,
  comma,
  cx,
  CAPTION,
  FOCUS,
  EASE,
} from "./data";
import EstimateDocument from "./EstimateDocument";

const CHIP_BASE =
  "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors duration-150";
const CHIP_ON = "border-[#6E56CF] bg-[#6E56CF]/15 text-white";
const CHIP_OFF =
  "border-white/15 bg-white/[0.02] text-[#A1A1AA] hover:border-white/30 hover:text-white";

export default function Estimator() {
  const reduced = useReducedMotion() ?? false;

  const [categoryIdx, setCategoryIdx] = useState(0);
  const [conditionIdx, setConditionIdx] = useState(1); // "Good" — sensible, populated default
  const category = CATEGORIES[categoryIdx];
  const condition = CONDITIONS[conditionIdx];

  const [budget, setBudget] = useState(() =>
    defaultBudgetFor(CATEGORIES[0], CONDITIONS[1]),
  );

  const estimate = useMemo(
    () => computeEstimate(category, condition, budget),
    [category, condition, budget],
  );

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduced ? 0 : 0.08, delayChildren: 0.02 } },
  };
  const item: Variants = {
    hidden: reduced ? { opacity: 0 } : { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10"
    >
      {/* controls */}
      <motion.div variants={item} className="flex flex-col gap-7 lg:col-span-5">
        <div>
          <span id="category-label" className={cx(CAPTION, "text-[#A1A1AA]")}>
            01 — Item category
          </span>
          <div
            role="group"
            aria-labelledby="category-label"
            className="mt-3 flex flex-wrap gap-2"
          >
            {CATEGORIES.map((c, i) => {
              const Icon = c.icon;
              const selected = i === categoryIdx;
              return (
                <button
                  key={c.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setCategoryIdx(i)}
                  className={cx(CHIP_BASE, selected ? CHIP_ON : CHIP_OFF, FOCUS)}
                >
                  <Icon className="h-4 w-4" aria-hidden />
                  {c.label}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <span id="condition-label" className={cx(CAPTION, "text-[#A1A1AA]")}>
            02 — Condition
          </span>
          <div
            role="group"
            aria-labelledby="condition-label"
            className="mt-3 flex flex-wrap gap-2"
          >
            {CONDITIONS.map((c, i) => {
              const selected = i === conditionIdx;
              return (
                <button
                  key={c.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setConditionIdx(i)}
                  title={c.gradeDesc}
                  className={cx(CHIP_BASE, selected ? CHIP_ON : CHIP_OFF, FOCUS)}
                >
                  <span
                    className={cx(
                      "flex h-4 w-4 items-center justify-center rounded-full text-[0.6rem] font-extrabold",
                      selected ? "bg-white text-[#6E56CF]" : "bg-white/10 text-[#A1A1AA]",
                    )}
                    aria-hidden
                  >
                    {c.grade}
                  </span>
                  {c.label}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <div className="flex items-baseline justify-between gap-3">
            <label htmlFor="budget-range" className={cx(CAPTION, "text-[#A1A1AA]")}>
              03 — Your target price
            </label>
            <output
              htmlFor="budget-range"
              className="text-base font-semibold tabular-nums tracking-[0.12em] text-white"
            >
              {`₩${comma(budget)}`}
            </output>
          </div>
          <input
            id="budget-range"
            type="range"
            min={BUDGET_MIN}
            max={BUDGET_MAX}
            step={BUDGET_STEP}
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            aria-describedby="budget-range-bounds"
            className={cx(
              "mt-4 h-2 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-[#6E56CF]",
              FOCUS,
            )}
          />
          <div
            id="budget-range-bounds"
            className="mt-2 flex justify-between text-xs font-normal text-[#A1A1AA]"
          >
            <span>{`₩${comma(BUDGET_MIN)}`}</span>
            <span>{`₩${comma(BUDGET_MAX)}`}</span>
          </div>
        </div>
      </motion.div>

      {/* generated document */}
      <motion.div variants={item} className="lg:col-span-7">
        <EstimateDocument
          category={category}
          condition={condition}
          budget={budget}
          estimate={estimate}
        />
      </motion.div>
    </motion.div>
  );
}
