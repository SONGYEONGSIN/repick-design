"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  BOARD_CATEGORIES,
  FLAP_STEP_MS,
  scrambleSequence,
  cellDelay,
  padName,
  formatMatch,
  formatPrice,
  NAME_OFFSET,
  MATCH_OFFSET,
  GRADE_OFFSET,
  PRICE_OFFSET,
  cx,
  FOCUS,
  CAPTION,
  type BoardRow,
} from "./data";

/**
 * A single mechanical flap cell. Cycles through a deterministic scramble
 * sequence (a pure function of the target character — no Math.random, no
 * Date.now) before settling on its final glyph. `delay` is a fixed offset
 * computed from row/column index, producing the left-to-right "spin-down"
 * sweep real split-flap units make. `prefers-reduced-motion` skips straight
 * to the final glyph with no animation and no invisible state.
 */
function FlapCell({
  char,
  delay,
  reduced,
}: {
  char: string;
  delay: number;
  reduced: boolean;
}) {
  const sequence = useMemo(() => scrambleSequence(char), [char]);
  const finalStep = sequence.length - 1;
  const [step, setStep] = useState(0);

  useEffect(() => {
    // reduced-motion: nothing to animate, the render below reads finalStep
    // directly — no state to sync.
    if (reduced) return;

    let interval: ReturnType<typeof setInterval> | undefined;
    const start = setTimeout(() => {
      let i = 0;
      interval = setInterval(() => {
        i += 1;
        if (i >= finalStep) {
          setStep(finalStep);
          if (interval) clearInterval(interval);
          return;
        }
        setStep(i);
      }, FLAP_STEP_MS);
    }, delay);
    return () => {
      clearTimeout(start);
      if (interval) clearInterval(interval);
    };
  }, [delay, reduced, finalStep]);

  const displayStep = reduced ? finalStep : step;
  const shown = sequence[displayStep] ?? char.toUpperCase();

  return (
    <span
      className="relative inline-flex h-[1.6em] w-[0.8em] min-w-0 shrink items-center justify-center overflow-hidden rounded-[3px] bg-white/[0.07] sm:h-[1.75em] sm:w-[0.95em]"
      style={{ perspective: 220 }}
    >
      <motion.span
        key={displayStep}
        initial={reduced ? false : { rotateX: -85, opacity: 0.4 }}
        animate={{ rotateX: 0, opacity: 1 }}
        transition={{ duration: 0.12, ease: "easeOut" }}
        style={{ transformOrigin: "50% 50%", display: "inline-block" }}
        className={cx("font-extrabold", "text-white")}
      >
        {shown}
      </motion.span>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-black/45"
      />
    </span>
  );
}

function FlapRow({ row, rowIndex }: { row: BoardRow; rowIndex: number }) {
  const reducedRaw = useReducedMotion();
  const reduced = !!reducedRaw;

  const nameChars = padName(row.item).split("");
  const matchChars = formatMatch(row.match).split("");
  const priceChars = formatPrice(row.price).split("");

  return (
    <tr className="border-b border-white/5 last:border-b-0">
      <td className="px-1.5 py-1.5 sm:px-4 sm:py-2">
        <span className="sr-only">{row.item}</span>
        <div aria-hidden className="flex w-full min-w-0 gap-px overflow-hidden sm:gap-[2px]">
          {nameChars.map((c, i) => (
            <FlapCell
              key={i}
              char={c}
              delay={cellDelay(rowIndex, NAME_OFFSET + i)}
              reduced={reduced}
            />
          ))}
        </div>
      </td>
      <td className="px-1 py-1.5 sm:px-2 sm:py-2">
        <span className="sr-only">{row.match} percent match</span>
        <div aria-hidden className="flex w-full min-w-0 gap-px overflow-hidden sm:gap-[2px]">
          {matchChars.map((c, i) => (
            <FlapCell
              key={i}
              char={c}
              delay={cellDelay(rowIndex, MATCH_OFFSET + i)}
              reduced={reduced}
            />
          ))}
        </div>
      </td>
      <td className="px-1 py-1.5 sm:px-2 sm:py-2">
        <span className="sr-only">grade {row.grade}</span>
        <div aria-hidden className="flex w-full min-w-0 gap-px overflow-hidden sm:gap-[2px]">
          <FlapCell
            char={row.grade}
            delay={cellDelay(rowIndex, GRADE_OFFSET)}
            reduced={reduced}
          />
        </div>
      </td>
      <td className="px-1.5 py-1.5 text-right sm:px-4 sm:py-2">
        <span className="sr-only">{formatPrice(row.price)}</span>
        <div aria-hidden className="flex w-full min-w-0 justify-end gap-px overflow-hidden sm:gap-[2px]">
          {priceChars.map((c, i) => (
            <FlapCell
              key={i}
              char={c}
              delay={cellDelay(rowIndex, PRICE_OFFSET + i)}
              reduced={reduced}
            />
          ))}
        </div>
      </td>
    </tr>
  );
}

export default function FlapBoard() {
  const [active, setActive] = useState(0);
  const category = BOARD_CATEGORIES[active];

  return (
    <div className="w-full min-w-0">
      <div
        role="tablist"
        aria-label="Board category"
        className="flex flex-wrap gap-2"
      >
        {BOARD_CATEGORIES.map((cat, i) => {
          const selected = i === active;
          return (
            <button
              key={cat.id}
              type="button"
              role="tab"
              id={`board-tab-${cat.id}`}
              aria-selected={selected}
              aria-controls="board-panel"
              onClick={() => setActive(i)}
              className={cx(
                "rounded-full border px-3.5 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.1em] transition-colors duration-150",
                selected
                  ? "border-[#6E56CF]/70 bg-[#6E56CF]/15 text-white"
                  : "border-white/12 text-[#A1A1AA] hover:border-white/25 hover:text-white",
                FOCUS,
              )}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      <div
        id="board-panel"
        role="tabpanel"
        aria-labelledby={`board-tab-${category.id}`}
        className="mt-4 min-w-0 overflow-x-auto rounded-lg border border-white/10 bg-[#050507]"
      >
        <table className="w-full table-fixed border-collapse text-[0.68rem] sm:text-[0.85rem]">
          <caption className="sr-only">
            Live AI-matched listings in {category.label}, updating as you
            switch categories
          </caption>
          <colgroup>
            <col style={{ width: "50%" }} />
            <col style={{ width: "17%" }} />
            <col style={{ width: "13%" }} />
            <col style={{ width: "20%" }} />
          </colgroup>
          <thead>
            <tr className="border-b border-white/10 text-left">
              <th
                scope="col"
                className={cx(
                  CAPTION,
                  "px-1.5 py-2 font-semibold text-[#A1A1AA] sm:px-4 sm:py-3",
                )}
              >
                Listing
              </th>
              <th
                scope="col"
                className={cx(CAPTION, "px-1 py-2 font-semibold text-[#A1A1AA] sm:px-2 sm:py-3")}
              >
                Match
              </th>
              <th
                scope="col"
                className={cx(CAPTION, "px-1 py-2 font-semibold text-[#A1A1AA] sm:px-2 sm:py-3")}
              >
                Grade
              </th>
              <th
                scope="col"
                className={cx(
                  CAPTION,
                  "px-1.5 py-2 text-right font-semibold text-[#A1A1AA] sm:px-4 sm:py-3",
                )}
              >
                Price
              </th>
            </tr>
          </thead>
          <tbody key={category.id}>
            {category.rows.map((row, i) => (
              <FlapRow key={row.item} row={row} rowIndex={i} />
            ))}
          </tbody>
        </table>
      </div>

      <p aria-live="polite" className="sr-only">
        Showing {category.rows.length} matches in {category.label}
      </p>

      <p className="mt-3 text-[0.72rem] font-normal leading-[1.5] text-[#A1A1AA]">
        Select a category — the board re-scans and posts fresh matches with
        their score, grade, and price already on the row.
      </p>
    </div>
  );
}
