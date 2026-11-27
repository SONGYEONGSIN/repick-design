"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { GRADES, isFirstGrade, isLastGrade } from "./model";
import { ACCENT_SMALL_HEX, CAPTION, FG, FOCUS_RING, MUTED, SURFACE_BORDER } from "./tokens";

interface GradeStepperProps {
  step: number;
  onPrev: () => void;
  onNext: () => void;
}

/**
 * The round's assigned device: a DISCRETE ordered stepper, not a continuous drag handle and not an
 * unordered radiogroup. Prev/Next move exactly one position through GRADES in sequence; there is
 * no way to land between two grades or jump out of order.
 *
 * Accessibility: the current grade is exposed three ways at once — a visible "Step n of 4" caption
 * (sighted users, always on, computed from `step`), an `aria-live="polite"` region that announces
 * the grade name on every change (screen-reader users, without needing focus), and a 4-dot segment
 * tracker (decorative, `aria-hidden`, since the caption already carries the same information to
 * assistive tech). Prev/Next disable at the ends with both a disabled button state *and* a visible,
 * non-aria-hidden sentence explaining why — never silently inert.
 */
export function GradeStepper({ step, onPrev, onNext }: GradeStepperProps) {
  const grade = GRADES[step];
  const atStart = isFirstGrade(step);
  const atEnd = isLastGrade(step);

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onPrev}
          disabled={atStart}
          aria-label={atStart ? "Previous condition grade — unavailable, already at the lowest grade" : "Previous condition grade"}
          aria-describedby={atStart ? "grade-boundary-note" : undefined}
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-opacity ${FOCUS_RING} ${
            atStart ? "cursor-not-allowed opacity-30" : "opacity-100 hover:bg-white/5"
          }`}
          style={{ border: `1px solid ${SURFACE_BORDER}` }}
        >
          <ChevronLeft className="h-5 w-5" style={{ color: FG }} aria-hidden="true" />
        </button>

        <div className="flex min-w-0 flex-1 flex-col items-center gap-2">
          <ol className="flex items-center gap-2" aria-hidden="true">
            {GRADES.map((g, i) => (
              <li key={g.id}>
                <span
                  className="block h-2 w-2 rounded-full transition-colors duration-150"
                  style={{ backgroundColor: i === step ? ACCENT_SMALL_HEX : SURFACE_BORDER }}
                />
              </li>
            ))}
          </ol>
          <p className={CAPTION} style={{ color: ACCENT_SMALL_HEX, fontVariantNumeric: "tabular-nums" }}>
            Step {step + 1} of {GRADES.length} — {grade.name}
          </p>
        </div>

        <button
          type="button"
          onClick={onNext}
          disabled={atEnd}
          aria-label={atEnd ? "Next condition grade — unavailable, already at the highest grade" : "Next condition grade"}
          aria-describedby={atEnd ? "grade-boundary-note" : undefined}
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-opacity ${FOCUS_RING} ${
            atEnd ? "cursor-not-allowed opacity-30" : "opacity-100 hover:bg-white/5"
          }`}
          style={{ border: `1px solid ${SURFACE_BORDER}` }}
        >
          <ChevronRight className="h-5 w-5" style={{ color: FG }} aria-hidden="true" />
        </button>
      </div>

      {/* Visible AND accessible boundary reason — only one button is ever disabled at a time. */}
      {(atStart || atEnd) && (
        <p id="grade-boundary-note" className={`mt-3 text-center text-[12px] ${MUTED}`}>
          {atStart
            ? "Good is the lowest grade we list — there's no condition below this."
            : "Like New is the highest grade we list — as close to original condition as resale gets."}
        </p>
      )}

      {/* Announced on every change without requiring focus to move. */}
      <p aria-live="polite" className="sr-only">
        Condition grade: {grade.name}, step {step + 1} of {GRADES.length}
      </p>
    </div>
  );
}
