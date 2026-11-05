"use client";

import { useReducedMotion, motion } from "framer-motion";
import { Banknote, Check, Gift, TrendingUp, type LucideIcon } from "lucide-react";
import { BRANCHES, type StepOneId, type StepTwoId } from "./trade-data";
import { describePath, type PathSummary } from "./trade-math";
import { ACCENT_TINT_TEXT, FOCUS_RING, INK_CLASS, MUTED_TEXT } from "./tokens";
import { useMounted } from "./useMounted";

type EdgeState = "chosen" | "available" | "dim";

const BRANCH_ICON: Record<StepOneId, LucideIcon> = {
  "sell-now": Banknote,
  "list-offer": TrendingUp,
  "trade-credit": Gift,
};

interface TreePathProps {
  step1: StepOneId;
  step2: StepTwoId | null;
  summary: PathSummary;
  onSelectStep1: (id: StepOneId) => void;
  onSelectStep2: (id: StepTwoId) => void;
  announcement: { text: string; assertive: boolean };
}

/**
 * Vertical tick connecting a node up to the trunk bar above it. Purely decorative (aria-hidden),
 * so it carries no text-contrast obligation — its three states are told apart by height, opacity
 * AND color together, never color alone. `initial={false}` means it never ships a stranded
 * entrance state; framer-motion just tweens whenever `animate`'s target values change, which is
 * exactly the "path segment commits" moment.
 */
function Tick({ state, animate }: { state: EdgeState; animate: boolean }) {
  const target =
    state === "chosen"
      ? { scaleY: 1, opacity: 1, backgroundColor: "#3B82F6" }
      : state === "available"
        ? { scaleY: 0.75, opacity: 1, backgroundColor: "rgba(255,255,255,0.22)" }
        : { scaleY: 0.55, opacity: 1, backgroundColor: "rgba(255,255,255,0.1)" };

  return (
    <motion.div
      aria-hidden="true"
      className="h-3 w-[2.5px] origin-top rounded-full"
      initial={false}
      animate={target}
      transition={animate ? { duration: 0.32, ease: "easeOut" } : { duration: 0 }}
    />
  );
}

function nodeClasses(state: EdgeState) {
  if (state === "chosen") {
    return `border-blue-500 bg-blue-600/20 ${INK_CLASS} font-semibold`;
  }
  if (state === "available") {
    return `border-white/15 bg-white/[0.04] ${MUTED_TEXT} font-normal hover:border-white/25 hover:bg-white/[0.07]`;
  }
  return `border-white/10 bg-white/[0.02] ${MUTED_TEXT} font-normal hover:border-white/20`;
}

export function TreePath({ step1, step2, summary, onSelectStep1, onSelectStep2, announcement }: TreePathProps) {
  const mounted = useMounted();
  const reduceMotion = useReducedMotion();
  const animateTicks = mounted && !reduceMotion;
  const pathText = describePath(summary);

  return (
    <div className="flex flex-col gap-3">
      {/* Root: a fixed start point, not a decision, so not a button. The item it represents is
          shown once, above, in the hero's listing-proof row — this just anchors the fan-out. */}
      <div className="flex flex-col items-center gap-2">
        <div className={`rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] font-semibold ${MUTED_TEXT}`}>
          Start
        </div>
        <Tick state="chosen" animate={false} />
      </div>

      {/* Trunk: root fans out into the 3 step-1 methods. Decorative only — state lives on the ticks. */}
      <div className="relative">
        <div aria-hidden="true" className="absolute left-[16.667%] right-[16.667%] top-0 h-[2px] bg-white/10" />
        <div role="group" aria-label="Step 1 — choose how you want to sell" className="grid grid-cols-3 gap-2 pt-3">
          {BRANCHES.map((branch) => {
            const chosen = branch.id === step1;
            const state: EdgeState = chosen ? "chosen" : "dim";
            const Icon = BRANCH_ICON[branch.id];
            return (
              <div key={branch.id} className="flex flex-col items-center gap-1.5">
                <Tick state={state} animate={animateTicks} />
                <button
                  type="button"
                  onClick={() => onSelectStep1(branch.id)}
                  aria-pressed={chosen}
                  className={`flex min-h-10 w-full flex-col items-center justify-center gap-0.5 rounded-lg border px-1.5 py-1.5 text-center text-[11px] leading-tight transition-colors duration-150 ${nodeClasses(state)} ${FOCUS_RING}`}
                >
                  <span className="flex items-center gap-1">
                    {chosen ? (
                      <Check className={`h-3 w-3 shrink-0 ${ACCENT_TINT_TEXT}`} aria-hidden="true" />
                    ) : (
                      <Icon className="h-3 w-3 shrink-0" aria-hidden="true" />
                    )}
                    <span>{branch.label}</span>
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step 2: each step-1 column fans out into its own 2 outcomes. Columns belonging to a
          branch you did not pick still render, dim but legible — nothing is hidden. */}
      <div className="grid grid-cols-3 gap-2">
        {BRANCHES.map((branch) => {
          const columnActive = branch.id === step1;
          return (
            <div key={branch.id} className="relative flex flex-col items-center">
              <div aria-hidden="true" className="absolute left-[25%] right-[25%] top-0 h-[2px] bg-white/10" />
              <div
                role="group"
                aria-label={`Step 2 — ${branch.fullLabel}`}
                className="flex w-full justify-center gap-1.5 pt-3"
              >
                {branch.children.map((leaf) => {
                  const chosen = columnActive && leaf.id === step2;
                  const state: EdgeState = chosen ? "chosen" : columnActive ? "available" : "dim";
                  return (
                    <div key={leaf.id} className="flex min-w-0 flex-1 flex-col items-center gap-1.5">
                      <Tick state={state} animate={animateTicks} />
                      <button
                        type="button"
                        onClick={() => (columnActive ? onSelectStep2(leaf.id) : onSelectStep1(branch.id))}
                        aria-pressed={chosen}
                        className={`flex min-h-9 w-full flex-col items-center justify-center gap-0.5 whitespace-normal rounded-lg border px-1 py-1 text-center text-[10px] leading-tight transition-colors duration-150 ${nodeClasses(state)} ${FOCUS_RING}`}
                      >
                        <span className="flex items-center gap-1">
                          {chosen && <Check className={`h-2.5 w-2.5 shrink-0 ${ACCENT_TINT_TEXT}`} aria-hidden="true" />}
                          <span>{leaf.label}</span>
                        </span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2">
        <p className="text-xs font-semibold leading-[1.5]">
          <span className={ACCENT_TINT_TEXT}>Your path:</span> <span className={INK_CLASS}>{pathText}</span>
        </p>
      </div>

      {/* Single live region on the page. Its implicit live-region role carries the correct
          politeness on its own — "status" is implicitly polite, "alert" is implicitly assertive
          — so no explicit aria-live is set alongside it, which would otherwise conflict with
          "alert"'s own semantics. The host flips the role to "alert" for a moment right after a
          selection, then reverts to "status" once the moment passes. */}
      <div role={announcement.assertive ? "alert" : "status"} className="sr-only">
        {announcement.text}
      </div>
    </div>
  );
}
