"use client";

import { CONDITION_GRADES, formatPct, type ConditionGradeId } from "./data";

// The focusable element here is the sr-only radio input, not the <label> it is paired with, so
// the visible focus change has to key off `peer-focus-visible:` rather than the page's usual
// `focus-visible:` token (that one only fires on an element that is itself the focus target).
const RADIO_LABEL_FOCUS_RING =
  "peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-sky-300";

export function GradeSelector({
  selectedId,
  onChange,
  name = "condition-grade",
}: {
  selectedId: ConditionGradeId;
  onChange: (next: ConditionGradeId) => void;
  name?: string;
}) {
  return (
    <div role="radiogroup" aria-label="Condition grade" className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {CONDITION_GRADES.map((grade) => {
        const inputId = `${name}-${grade.id}`;
        const checked = grade.id === selectedId;
        return (
          <div key={grade.id} className="min-w-0">
            <input
              type="radio"
              id={inputId}
              name={name}
              value={grade.id}
              checked={checked}
              onChange={() => onChange(grade.id)}
              className="peer sr-only"
            />
            <label
              htmlFor={inputId}
              className={`flex min-w-0 min-h-11 flex-col items-center justify-center gap-0.5 rounded-xl border border-white/10 bg-white/[0.03] px-2 py-2.5 text-center transition-colors duration-200 peer-checked:border-sky-400 peer-checked:bg-sky-400 peer-checked:text-[#0B0B0F] hover:border-white/25 ${RADIO_LABEL_FOCUS_RING} cursor-pointer text-[#F5F5F7]`}
            >
              <span className="block truncate text-xs font-semibold leading-tight">{grade.label}</span>
              <span className="block text-[11px] font-normal tabular-nums leading-tight opacity-80">
                −{formatPct(grade.deductionRate)}
              </span>
            </label>
          </div>
        );
      })}
    </div>
  );
}
