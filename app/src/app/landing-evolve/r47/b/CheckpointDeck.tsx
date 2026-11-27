"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import { CheckpointCard } from "./CheckpointCard";
import type { CheckpointDef, CheckpointId, CheckpointStatus } from "./checkpoint-data";
import { formatRange, type Verdict } from "./checkpoint-math";
import { ACCENT_FILL, FOCUS_RING, ON_ACCENT_TEXT } from "./tokens";

interface CheckpointDeckProps {
  checkpoints: CheckpointDef[];
  statuses: Record<CheckpointId, CheckpointStatus>;
  verdict: Verdict;
  onConfirm: (id: CheckpointId) => void;
  onFlag: (id: CheckpointId) => void;
  onUndo: (id: CheckpointId) => void;
}

/**
 * The swipeable stack itself: four fixed checkpoint cards, always all present in the DOM (so
 * Tab visits every card's controls in a stable order) with drag-to-swipe layered on top of
 * always-visible Confirm/Flag/Undo buttons as the primary, fully keyboard-operable path. Once
 * every card is resolved, a derived verdict card appears beneath the grid — it never replaces
 * the grid, so a visitor can still see exactly which checks landed where.
 */
export function CheckpointDeck({ checkpoints, statuses, verdict, onConfirm, onFlag, onUndo }: CheckpointDeckProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="flex flex-col gap-2.5">
      <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
        {checkpoints.map((checkpoint) => (
          <CheckpointCard
            key={checkpoint.id}
            checkpoint={checkpoint}
            status={statuses[checkpoint.id]}
            onConfirm={() => onConfirm(checkpoint.id)}
            onFlag={() => onFlag(checkpoint.id)}
            onUndo={() => onUndo(checkpoint.id)}
          />
        ))}
      </div>

      <AnimatePresence>
        {verdict.allResolved && (
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: 10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            role="status"
            className={`flex items-center justify-between gap-3 rounded-xl ${ACCENT_FILL} px-4 py-3`}
          >
            <span className={`inline-flex items-center gap-2 text-sm font-semibold ${ON_ACCENT_TEXT}`}>
              {verdict.finalStatus === "Verified" ? (
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              ) : (
                <ShieldAlert className="h-4 w-4" aria-hidden="true" />
              )}
              {verdict.finalStatus} — Grade {verdict.gradeLetter}
            </span>
            <span className={`text-sm font-semibold tabular-nums ${ON_ACCENT_TEXT}`}>
              {formatRange(verdict.priceLow, verdict.priceHigh)}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ResetDeckButton({ onReset }: { onReset: () => void }) {
  return (
    <button
      type="button"
      onClick={onReset}
      className={`self-end text-[11px] font-semibold text-zinc-500 underline-offset-2 transition-colors duration-150 hover:text-zinc-900 hover:underline ${FOCUS_RING}`}
    >
      Reset to default run
    </button>
  );
}
