"use client";

import { useState } from "react";
import { Check, ChevronDown, Lock, RotateCcw } from "lucide-react";
import { LitLine } from "./LitLine";
import { QUESTIONS, type Answers, type Match, type QuestionId } from "./data";
import { ACCENT_TEXT, CAPTION, FOCUS_RING, MUTED_TEXT, NODE_AVAILABLE, NODE_LOCKED, NODE_SELECTED } from "./tokens";

/**
 * The reasoning tree itself: a vertical spine running Start -> budget -> category ->
 * condition -> leaf. Every level is always rendered in full (the whole tree shape is
 * visible from the first paint); what changes per click is which lines and nodes carry the
 * accent "lit" state versus the dim "not reached yet" state. A level is locked (disabled,
 * dashed, no incoming lines) until the question above it has an answer, so the dimness reads
 * as three distinct tiers: locked -> reached-but-unselected -> selected.
 */
export function ReasoningTree({
  answers,
  onSelect,
  onRestart,
  match,
}: {
  answers: Answers;
  onSelect: (question: QuestionId, optionId: string) => void;
  onRestart: () => void;
  match: Match | null;
}) {
  const [showMath, setShowMath] = useState(false);

  const answeredCount = [answers.budget, answers.category, answers.condition].filter(Boolean).length;
  const leafLit = answeredCount === 3;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <p className={`${CAPTION} ${MUTED_TEXT}`}>Fig. 01 — The match reasoning tree, live</p>
        <button
          type="button"
          onClick={onRestart}
          className={`inline-flex min-h-9 items-center gap-1.5 rounded-full border border-zinc-600 px-3 text-xs font-semibold text-zinc-300 transition-colors duration-200 hover:border-[#FB7185]/60 hover:text-white ${FOCUS_RING}`}
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          Restart
        </button>
      </div>

      <div className="mt-5 flex flex-col items-stretch">
        <div className="flex flex-col items-center">
          <span className="inline-flex h-9 items-center rounded-full border border-zinc-600 bg-white/[0.04] px-4 text-xs font-semibold text-zinc-300">
            Start
          </span>
        </div>

        {QUESTIONS.map((question, levelIndex) => {
          const value = answers[question.id as keyof Answers];
          const parentAnswered = levelIndex === 0 ? true : Boolean(answers[QUESTIONS[levelIndex - 1].id as keyof Answers]);
          const trunkLit = parentAnswered;

          return (
            <div key={question.id} className="flex flex-col items-center">
              <LitLine axis="down" lit={trunkLit} className="relative h-6 w-px mx-auto" />

              <p className="max-w-[280px] text-center text-sm font-semibold leading-snug text-zinc-200">
                <span className={ACCENT_TEXT}>Q{levelIndex + 1}.</span> {question.prompt}
              </p>

              <div role="group" aria-label={question.prompt} className="relative mt-3 w-full">
                {/* Horizontal branches span exact column-center-to-row-center percentages of
                    this row's own width (the grid below has no gap, only inner padding per
                    column, so each column's box is an exact third and these numbers line up
                    with every column's true center at any viewport width). */}
                <LitLine
                  axis="left"
                  lit={trunkLit && value === question.options[0]?.id}
                  className="absolute left-[16.6667%] top-0 h-px w-[33.3333%]"
                />
                <LitLine
                  axis="right"
                  lit={trunkLit && value === question.options[2]?.id}
                  className="absolute left-[50%] top-0 h-px w-[33.3333%]"
                />

                <div className="grid grid-cols-3 items-start">
                  {question.options.map((opt) => {
                    const selected = value === opt.id;
                    const locked = !parentAnswered;
                    const nodeClass = locked ? NODE_LOCKED : selected ? NODE_SELECTED : NODE_AVAILABLE;

                    return (
                      <div key={opt.id} className="flex min-w-0 flex-col items-center px-1.5 sm:px-2">
                        <LitLine axis="down" lit={trunkLit && selected} className="relative h-4 w-px" />

                        <button
                          type="button"
                          role="radio"
                          aria-checked={selected}
                          disabled={locked}
                          onClick={() => onSelect(question.id, opt.id)}
                          className={[
                            "flex min-h-11 w-full items-center justify-center gap-1 rounded-lg px-1.5 py-2 text-center text-[11px] font-semibold leading-tight transition-colors duration-200 sm:text-xs",
                            nodeClass,
                            locked ? "cursor-not-allowed" : "cursor-pointer",
                            FOCUS_RING,
                          ].join(" ")}
                        >
                          {selected && <Check className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />}
                          {locked && <Lock className="h-3 w-3 shrink-0 text-zinc-500" aria-hidden="true" />}
                          <span className="min-w-0">{opt.label}</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}

        <LitLine axis="down" lit={leafLit} className="relative h-6 w-px mx-auto" />

        <div aria-live="polite" className="w-full rounded-xl border border-white/10 bg-white/[0.03] p-4 text-center sm:p-5">
          {match ? (
            <>
              <p className={`${CAPTION} ${ACCENT_TEXT}`}>Your matched listing archetype</p>
              <p className="mt-1.5 text-sm font-semibold leading-snug text-white sm:text-base">{match.sentence}</p>
              <button
                type="button"
                aria-expanded={showMath}
                onClick={() => setShowMath((s) => !s)}
                className={`mt-3 inline-flex min-h-8 items-center gap-1 px-1 text-xs font-semibold ${ACCENT_TEXT} ${FOCUS_RING} rounded-sm`}
              >
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${showMath ? "rotate-180" : ""}`}
                  aria-hidden="true"
                />
                {showMath ? "Hide the math" : "Show the math"}
              </button>
              {showMath && (
                <dl className="mt-3 grid grid-cols-3 gap-3 border-t border-white/10 pt-3 text-left">
                  <div className="min-w-0">
                    <dt className="text-[10px] font-semibold uppercase tracking-[0.1em] text-zinc-400">Budget factor</dt>
                    <dd className="text-sm font-semibold tabular-nums text-zinc-200">{match.factors.budget.toFixed(2)}x</dd>
                  </div>
                  <div className="min-w-0">
                    <dt className="text-[10px] font-semibold uppercase tracking-[0.1em] text-zinc-400">Category factor</dt>
                    <dd className="text-sm font-semibold tabular-nums text-zinc-200">{match.factors.category.toFixed(2)}x</dd>
                  </div>
                  <div className="min-w-0">
                    <dt className="text-[10px] font-semibold uppercase tracking-[0.1em] text-zinc-400">Condition factor</dt>
                    <dd className="text-sm font-semibold tabular-nums text-zinc-200">{match.factors.condition.toFixed(2)}x</dd>
                  </div>
                </dl>
              )}
            </>
          ) : (
            <>
              <p className={`${CAPTION} ${MUTED_TEXT}`}>Leaf node — locked</p>
              <p className={`mt-1.5 text-sm font-semibold leading-snug ${MUTED_TEXT}`}>
                Answer all three questions above to light the full path and reveal your matched archetype.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
