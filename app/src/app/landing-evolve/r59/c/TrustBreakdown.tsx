"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { CATEGORIES, deriveBreakdown, pointsFor, type StrictnessMode } from "./categories";
import { ACCENT, ACCENT_SOFT_BG, BORDER, FG, FOCUS_RING, MUTED, ON_ACCENT_TEXT, SURFACE, SURFACE_TINT } from "./tokens";

interface TrustBreakdownProps {
  activeIds: Set<string>;
  mode: StrictnessMode;
  onToggleCategory: (id: string) => void;
  onSetMode: (mode: StrictnessMode) => void;
  /** Compact mode (Hero only): the category chips plus the live score, nothing else — the
   * per-category bars and expandable detail rows live in the full device below, never
   * duplicated. */
  compact?: boolean;
  groupLabelId?: string;
}

const MAX_BAR_WIDTH = 36; // points scale 1:1 to px on a 0-36 range (functional's strict weight)

/**
 * The page's one input-manipulation device. Toggling a category chip is a multi-select input
 * (five independent `aria-pressed` buttons, not a single-select group) that adds or removes that
 * category's points from the running Trust Score; the strictness radio group is a second,
 * independent input axis that RE-WEIGHTS every category rather than scaling the whole score down
 * — under "Strict", functional testing alone is worth more than photos and cosmetic grading
 * combined, which is not true under "Standard".
 */
export function TrustBreakdown({ activeIds, mode, onToggleCategory, onSetMode, compact = false, groupLabelId }: TrustBreakdownProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const result = deriveBreakdown(activeIds, mode);

  const chips = (
    <div role="group" aria-labelledby={groupLabelId} className="flex flex-wrap gap-1.5">
      {CATEGORIES.map((category) => {
        const active = activeIds.has(category.id);
        return (
          <button
            key={category.id}
            type="button"
            aria-pressed={active}
            onClick={() => onToggleCategory(category.id)}
            className={`rounded-full px-3 py-1.5 text-[12.5px] font-semibold ${FOCUS_RING}`}
            style={{
              backgroundColor: active ? ACCENT : SURFACE_TINT,
              color: active ? ON_ACCENT_TEXT : MUTED,
            }}
          >
            {category.label}
          </button>
        );
      })}
    </div>
  );

  if (compact) {
    return (
      <div className="rounded-2xl p-3" style={{ border: `1px solid ${BORDER}`, backgroundColor: SURFACE }}>
        {chips}
        <p className="mt-2.5 tabular-nums">
          <span className="text-[20px] font-extrabold" style={{ color: FG }}>
            {result.score}
          </span>
          <span className="text-[13px] font-normal" style={{ color: MUTED }}>
            {" "}
            / {result.max} trust score
          </span>
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl p-5" style={{ border: `1px solid ${BORDER}`, backgroundColor: SURFACE }}>
      {chips}

      <div className="mt-4 flex items-center gap-1 rounded-lg p-1" role="group" aria-label="Strictness mode" style={{ backgroundColor: SURFACE_TINT }}>
        {(["standard", "strict"] as const).map((option) => {
          const active = mode === option;
          return (
            <button
              key={option}
              type="button"
              aria-pressed={active}
              onClick={() => onSetMode(option)}
              className={`flex-1 rounded-md py-1.5 text-[12.5px] font-semibold capitalize ${FOCUS_RING}`}
              style={{ backgroundColor: active ? ACCENT : "transparent", color: active ? ON_ACCENT_TEXT : MUTED }}
            >
              {option}
            </button>
          );
        })}
      </div>

      <p className="mt-4 tabular-nums">
        <span className="text-[13px] font-semibold uppercase tracking-[0.1em]" style={{ color: MUTED }}>
          Trust score:{" "}
        </span>
        <span className="text-[26px] font-extrabold" style={{ color: FG }}>
          {result.score}
        </span>
        <span className="text-[14px] font-normal" style={{ color: MUTED }}>
          {" "}
          / {result.max}
        </span>
      </p>

      <div className="mt-4 space-y-2.5">
        {CATEGORIES.map((category) => {
          const active = activeIds.has(category.id);
          const points = pointsFor(category, mode);
          const barWidthPx = Math.round((points / MAX_BAR_WIDTH) * 100);
          const expanded = expandedId === category.id;
          return (
            <div key={category.id}>
              <div className="flex items-center gap-3">
                <span className="w-[108px] shrink-0 truncate text-[12.5px] font-medium" style={{ color: active ? FG : MUTED }}>
                  {category.label}
                </span>
                <div className="h-2 min-w-0 flex-1 rounded-full" style={{ backgroundColor: SURFACE_TINT }}>
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${barWidthPx}%`, backgroundColor: active ? ACCENT : "#D4D4D8" }}
                  />
                </div>
                <span className="w-8 shrink-0 text-right text-[12.5px] font-semibold tabular-nums" style={{ color: active ? FG : MUTED }}>
                  {points}
                </span>
                <button
                  type="button"
                  aria-expanded={expanded}
                  aria-label={`${expanded ? "Hide" : "Show"} detail for ${category.label}`}
                  onClick={() => setExpandedId(expanded ? null : category.id)}
                  className={`shrink-0 rounded-md p-1 ${FOCUS_RING}`}
                  style={{ color: MUTED }}
                >
                  {expanded ? <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" /> : <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />}
                </button>
              </div>
              {expanded && (
                <p className="mt-1.5 rounded-lg p-2.5 text-[12.5px] font-normal leading-[1.5]" style={{ backgroundColor: ACCENT_SOFT_BG, color: FG }}>
                  {category.detail}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
