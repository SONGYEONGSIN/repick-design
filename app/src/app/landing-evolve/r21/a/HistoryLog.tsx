"use client";

import { motion, useReducedMotion } from "framer-motion";
import { STAGES } from "./data";
import { ACCENT_HEX, ACCENT_TEXT, cx, FOCUS, MUTED, NUM } from "./tokens";

/**
 * The receding history log — the device that makes this an ordinal SCRUB rather than a tab swap.
 * All five real stages stay mounted and visible at once:
 *   - stages before the active one RECEDE (smaller, quieter, but still their real date + headline
 *     fact — never removed from the DOM, never truly hidden);
 *   - the active stage is the one row that's fully expanded, with its full note and its timestamp;
 *   - stages after the active one are honestly empty — "not yet reached," never a fabricated
 *     hypothetical, because this coat's real history hadn't gotten there yet.
 * Clicking any row also scrubs to it — a third input path onto the same `activeIndex` state the
 * track and the button row already share.
 */
export default function HistoryLog({
  activeIndex,
  onChange,
}: {
  activeIndex: number;
  onChange: (index: number) => void;
}) {
  const reduceMotion = Boolean(useReducedMotion());

  return (
    <ol className="flex flex-col gap-2">
      {STAGES.map((stage, i) => {
        const state = i < activeIndex ? "past" : i === activeIndex ? "current" : "future";
        const Icon = stage.icon;

        return (
          <motion.li key={stage.id} layout="position" transition={{ duration: reduceMotion ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}>
            <button
              type="button"
              onClick={() => onChange(i)}
              aria-current={state === "current" ? "step" : undefined}
              className={cx(
                "w-full rounded-xl border px-3 py-2.5 text-left transition-colors duration-150",
                state === "current" ? "border-[#DCE9C7] bg-[#F1F7E6]" : "border-transparent hover:bg-zinc-50",
                FOCUS,
              )}
            >
              <div className="flex items-start gap-3">
                <span
                  aria-hidden="true"
                  className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
                  style={{
                    backgroundColor: state === "future" ? "#FFFFFF" : ACCENT_HEX,
                    border: state === "future" ? "2px solid #D4D4D8" : "none",
                  }}
                >
                  <Icon size={13} style={{ color: state === "future" ? "#A1A1AA" : "#FFFFFF" }} aria-hidden="true" />
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                    <p
                      className={cx(
                        state === "current" ? "text-sm font-semibold text-zinc-900" : "text-[13px] font-normal",
                        state === "future" && MUTED,
                        state === "past" && "text-zinc-800",
                      )}
                    >
                      {stage.label}
                    </p>
                    <p className={cx(NUM, "text-[11px] font-normal whitespace-nowrap", MUTED)}>
                      {state === "future" ? "Not yet" : `${stage.date} · ${stage.time}`}
                    </p>
                  </div>

                  {state === "future" && <p className={cx("mt-1 text-[12.5px] italic", MUTED)}>No record exists for this stage yet.</p>}
                  {state === "current" && (
                    <>
                      <p className="mt-1 text-[13px] leading-relaxed text-zinc-700">{stage.body}</p>
                      <p className={cx(NUM, "mt-1.5 text-[12px] font-semibold", ACCENT_TEXT)}>{stage.stat}</p>
                    </>
                  )}
                  {state === "past" && <p className={cx(NUM, "mt-1 text-[12px] font-normal", MUTED)}>{stage.stat}</p>}
                </div>
              </div>
            </button>
          </motion.li>
        );
      })}
    </ol>
  );
}
