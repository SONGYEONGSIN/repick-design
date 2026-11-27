"use client";

import { Check } from "lucide-react";
import { deriveLadder, formatUsd, GRADES, type GradeId } from "./grades";
import { ACCENT, ACCENT_SOFT_BG, BORDER, FG, FOCUS_RING, MUTED, ON_ACCENT_TEXT, SURFACE, SURFACE_TINT } from "./tokens";

interface GradeLadderProps {
  gradeId: GradeId;
  includeAccessories: boolean;
  onSelectGrade: (id: GradeId) => void;
  onToggleAccessories: () => void;
  /** Compact mode (Hero only): the four rungs plus the live price readout, nothing else — the
   * resale-horizon chart and defect checklist live in the full device below, never duplicated. */
  compact?: boolean;
  headingId?: string;
}

/**
 * The page's one input-manipulation device. Clicking a rung is a single-select control (a
 * same-size button group standing in for a listbox — `aria-pressed` on each button, and the
 * group itself is labelled via `headingId` rather than a duplicate visible label) that drives
 * three outputs at once: the price band, the resale-horizon bars, and the defect-tolerance
 * checklist. The accessories toggle is a second, independent input axis layered on top — it
 * nudges all three outputs without changing which grade is selected, so "what changes the
 * number" and "which grade you picked" stay visibly separate causes.
 */
export function GradeLadder({
  gradeId,
  includeAccessories,
  onSelectGrade,
  onToggleAccessories,
  compact = false,
  headingId,
}: GradeLadderProps) {
  const result = deriveLadder(gradeId, includeAccessories);

  const rungs = (
    <div role="group" aria-labelledby={headingId} className="flex gap-1.5">
      {GRADES.map((g) => {
        const selected = g.id === gradeId;
        return (
          <button
            key={g.id}
            type="button"
            aria-pressed={selected}
            onClick={() => onSelectGrade(g.id)}
            className={`flex-1 rounded-lg py-2.5 text-[14px] font-bold tabular-nums ${FOCUS_RING}`}
            style={{
              backgroundColor: selected ? ACCENT : SURFACE_TINT,
              color: selected ? ON_ACCENT_TEXT : FG,
            }}
          >
            {g.label}
          </button>
        );
      })}
    </div>
  );

  if (compact) {
    return (
      <div className="rounded-2xl p-3" style={{ border: `1px solid ${BORDER}`, backgroundColor: SURFACE }}>
        {rungs}
        <p className="mt-2.5 text-[12px] font-normal" style={{ color: MUTED }}>
          {result.grade.note}
        </p>
        <p className="mt-1 tabular-nums">
          <span className="text-[17px] font-extrabold" style={{ color: FG }}>
            {formatUsd(result.priceLow)}–{formatUsd(result.priceHigh)}
          </span>
        </p>
      </div>
    );
  }

  const maxResale = 99;

  return (
    <div className="rounded-2xl p-5" style={{ border: `1px solid ${BORDER}`, backgroundColor: SURFACE }}>
      {rungs}
      <p className="mt-3 text-[13px] font-normal" style={{ color: MUTED }}>
        {result.grade.note}
      </p>

      <div className="mt-4 flex items-center justify-between gap-3 rounded-lg px-3 py-2.5" style={{ backgroundColor: SURFACE_TINT }}>
        <span className="text-[13px] font-medium" style={{ color: FG }}>
          Include original accessories
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={includeAccessories}
          aria-label="Include original accessories"
          onClick={onToggleAccessories}
          className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${FOCUS_RING}`}
          style={{ backgroundColor: includeAccessories ? ACCENT : "#D4D4D8" }}
        >
          <span
            className="absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform"
            style={{ transform: includeAccessories ? "translateX(22px)" : "translateX(2px)" }}
          />
        </button>
      </div>

      <p className="mt-4 tabular-nums">
        <span className="text-[13px] font-semibold uppercase tracking-[0.1em]" style={{ color: MUTED }}>
          Price band:{" "}
        </span>
        <span className="text-[22px] font-extrabold" style={{ color: FG }}>
          {formatUsd(result.priceLow)}–{formatUsd(result.priceHigh)}
        </span>
      </p>

      <div className="mt-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: MUTED }}>
          Resale value retained
        </p>
        <div className="mt-2.5 flex items-end gap-4" style={{ height: "88px" }}>
          {[
            { label: "3 mo", value: result.resale3 },
            { label: "6 mo", value: result.resale6 },
            { label: "12 mo", value: result.resale12 },
          ].map((bar) => (
            <div key={bar.label} className="flex min-w-0 flex-1 flex-col items-center gap-1.5">
              <div className="flex w-full flex-1 items-end rounded-sm" style={{ backgroundColor: SURFACE_TINT, height: "64px" }}>
                <div
                  className="w-full rounded-sm"
                  style={{ backgroundColor: ACCENT, height: `${Math.round((bar.value / maxResale) * 64)}px` }}
                />
              </div>
              <span className="text-[12px] font-semibold tabular-nums" style={{ color: FG }}>
                {bar.value}%
              </span>
              <span className="text-[10.5px] font-normal" style={{ color: MUTED }}>
                {bar.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 rounded-lg p-3.5" style={{ backgroundColor: ACCENT_SOFT_BG }}>
        <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.1em]" style={{ color: FG }}>
          What {result.grade.label} allows
        </p>
        <ul className="mt-2 space-y-1.5">
          {result.grade.defectsAllowed.map((item) => (
            <li key={item} className="flex items-start gap-2 text-[13px] font-normal" style={{ color: FG }}>
              <Check className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" style={{ color: ACCENT }} />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
