"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, type PanInfo } from "framer-motion";
import { Check, Flag, Info, ShieldAlert, Undo2, X } from "lucide-react";
import type { CheckpointDef, CheckpointStatus } from "./checkpoint-data";
import { effectiveScore } from "./checkpoint-math";
import { ACCENT_FILL, ACCENT_TINT_BG, ACCENT_TINT_TEXT, FOCUS_RING, MUTED_TEXT_ON_TINT, ON_ACCENT_TEXT } from "./tokens";

interface CheckpointCardProps {
  checkpoint: CheckpointDef;
  status: CheckpointStatus;
  onConfirm: () => void;
  onFlag: () => void;
  onUndo: () => void;
}

const DRAG_THRESHOLD = 70;

export function CheckpointCard({ checkpoint, status, onConfirm, onFlag, onUndo }: CheckpointCardProps) {
  const [flipped, setFlipped] = useState(false);
  const reduceMotion = useReducedMotion();
  const detailId = useId();
  const Icon = checkpoint.Icon;
  const score = effectiveScore(checkpoint.baseScore, status);

  function handleDragEnd(_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) {
    if (status !== "pending") return;
    if (info.offset.x > DRAG_THRESHOLD) onConfirm();
    else if (info.offset.x < -DRAG_THRESHOLD) onFlag();
  }

  return (
    <motion.div
      role="group"
      aria-label={`${checkpoint.label}, ${status}`}
      drag={status === "pending" ? "x" : false}
      dragSnapToOrigin
      dragElastic={0.14}
      dragConstraints={{ left: -120, right: 120 }}
      onDragEnd={handleDragEnd}
      whileDrag={reduceMotion ? undefined : { scale: 1.02, rotate: 0 }}
      transition={reduceMotion ? { duration: 0 } : undefined}
      className={`flex min-w-0 flex-col gap-1.5 rounded-xl border bg-white p-2.5 ${
        status === "flagged" ? "border-zinc-300" : "border-zinc-200"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <Icon className="h-4 w-4 shrink-0 text-zinc-900" aria-hidden="true" strokeWidth={2} />
          <p className="truncate text-sm font-semibold text-zinc-900">{checkpoint.label}</p>
        </div>
        <span className={`inline-flex shrink-0 items-center rounded-full ${ACCENT_TINT_BG} px-1.5 py-0.5 text-[10px] font-semibold tabular-nums ${ACCENT_TINT_TEXT}`}>
          AI {checkpoint.baseScore}
        </span>
      </div>

      <div className="relative min-h-[2.1rem]">
        <AnimatePresence mode="wait" initial={false}>
          {flipped ? (
            <motion.p
              key="back"
              id={detailId}
              initial={reduceMotion ? false : { rotateY: -90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={reduceMotion ? undefined : { rotateY: 90, opacity: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className={`text-xs font-normal leading-[1.6] ${MUTED_TEXT_ON_TINT}`}
            >
              {checkpoint.detail}
            </motion.p>
          ) : (
            <motion.p
              key="front"
              id={detailId}
              initial={reduceMotion ? false : { rotateY: 90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={reduceMotion ? undefined : { rotateY: -90, opacity: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="text-xs font-normal leading-[1.6] text-zinc-600"
            >
              {checkpoint.summary}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <button
        type="button"
        onClick={() => setFlipped((v) => !v)}
        aria-expanded={flipped}
        aria-controls={detailId}
        className={`inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold text-zinc-600 transition-colors duration-150 hover:bg-zinc-100 hover:text-zinc-900 ${FOCUS_RING}`}
      >
        {flipped ? (
          <>
            <X className="h-3 w-3" aria-hidden="true" />
            Back
          </>
        ) : (
          <>
            <Info className="h-3 w-3" aria-hidden="true" />
            Details
          </>
        )}
      </button>

      <p className={`${MUTED_TEXT_ON_TINT} text-[11px] font-normal tabular-nums`}>
        Counted toward your score: <span className="font-semibold text-zinc-900">{score}/100</span>
      </p>

      {status === "pending" ? (
        <div className="mt-1 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onConfirm}
            className={`inline-flex items-center justify-center gap-1 rounded-lg ${ACCENT_FILL} px-2 py-1 text-xs font-semibold ${ON_ACCENT_TEXT} transition-colors duration-150 hover:bg-amber-400 ${FOCUS_RING}`}
          >
            <Check className="h-3.5 w-3.5" aria-hidden="true" />
            Confirm
          </button>
          <button
            type="button"
            onClick={onFlag}
            className={`inline-flex items-center justify-center gap-1 rounded-lg border border-zinc-300 px-2 py-1 text-xs font-semibold text-zinc-700 transition-colors duration-150 hover:border-zinc-400 hover:bg-zinc-50 ${FOCUS_RING}`}
          >
            <Flag className="h-3.5 w-3.5" aria-hidden="true" />
            Flag
          </button>
        </div>
      ) : (
        <div className="mt-1 flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-900">
            {status === "confirmed" ? (
              <Check className="h-3.5 w-3.5 text-zinc-900" aria-hidden="true" />
            ) : (
              <ShieldAlert className="h-3.5 w-3.5 text-zinc-900" aria-hidden="true" />
            )}
            {status === "confirmed" ? "Confirmed" : "Flagged"}
          </span>
          <button
            type="button"
            onClick={onUndo}
            className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold text-zinc-600 transition-colors duration-150 hover:bg-zinc-100 hover:text-zinc-900 ${FOCUS_RING}`}
          >
            <Undo2 className="h-3 w-3" aria-hidden="true" />
            Undo
          </button>
        </div>
      )}
    </motion.div>
  );
}
