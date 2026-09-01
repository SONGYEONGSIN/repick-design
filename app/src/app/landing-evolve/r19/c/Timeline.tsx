"use client";

import { useRef } from "react";
import type { KeyboardEvent } from "react";
import { PackageSearch, ScanEye, ShieldCheck, Handshake } from "lucide-react";
import { STAGES } from "./data";
import type { StageId } from "./data";
import { ACCENT, BORDER, INK, MUTED_STRONG } from "./tokens";

const STAGE_ICONS: Record<StageId, typeof PackageSearch> = {
  submission: PackageSearch,
  grading: ScanEye,
  verification: ShieldCheck,
  match: Handshake,
};

/**
 * The stage-selector rail — a WAI-ARIA tabs pattern (role="tablist"/"tab", roving tabindex,
 * arrow-key navigation), not a decorative line: the connecting rule is a single 1px hairline,
 * structural rather than illustrative, and every visual difference between the active and
 * inactive stage is carried by shape + weight + icon fill, never color alone.
 */
export function Timeline({
  activeIndex,
  onSelect,
}: {
  activeIndex: number;
  onSelect: (index: number) => void;
}) {
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function handleKeyDown(e: KeyboardEvent<HTMLButtonElement>, i: number) {
    let next = i;
    if (e.key === "ArrowRight") next = Math.min(STAGES.length - 1, i + 1);
    else if (e.key === "ArrowLeft") next = Math.max(0, i - 1);
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = STAGES.length - 1;
    else return;
    e.preventDefault();
    onSelect(next);
    btnRefs.current[next]?.focus();
  }

  return (
    <div
      role="tablist"
      aria-label="Handoff timeline stages"
      aria-orientation="horizontal"
      className="relative grid grid-cols-2 gap-x-3 gap-y-6 sm:flex sm:items-start sm:gap-0"
    >
      {/* Connecting rail: one hairline rule, desktop only — structural, not decorative. Positioned
          through the vertical center of the icon circles below (40px numeral box + 8px gap +
          6px button padding + 20px half-circle = 74px from the top of the row). */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[74px] right-[12.5%] left-[12.5%] hidden h-px sm:block"
        style={{ backgroundColor: BORDER }}
      />

      {STAGES.map((stage, i) => {
        const Icon = STAGE_ICONS[stage.id];
        const active = i === activeIndex;

        return (
          <div key={stage.id} className="relative z-10 flex flex-col items-center sm:flex-1">
            <span
              aria-hidden="true"
              className="tabular-nums flex h-10 items-end justify-center"
              style={{
                fontFamily: "var(--font-display-mono)",
                fontWeight: 400,
                fontSize: "clamp(1.25rem, 1vw + 1rem, 1.75rem)",
                letterSpacing: "0.02em",
                color: MUTED_STRONG,
                lineHeight: 1,
              }}
            >
              {String(i + 1).padStart(2, "0")}
            </span>

            <button
              ref={(el) => {
                btnRefs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`tab-${stage.id}`}
              aria-selected={active}
              aria-controls="stage-panel"
              tabIndex={active ? 0 : -1}
              onClick={() => onSelect(i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              className="mt-2 flex w-full flex-col items-center gap-1.5 rounded-lg p-1.5 text-center transition-colors duration-150 hover:bg-[#F4F4F5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{ outlineColor: ACCENT }}
            >
              <span className="sr-only">{`Step ${i + 1} of ${STAGES.length}: `}</span>
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-150"
                style={
                  active
                    ? { borderColor: ACCENT, backgroundColor: ACCENT }
                    : { borderColor: "#D4D4D8", backgroundColor: "#FFFFFF" }
                }
              >
                <Icon className="h-[17px] w-[17px]" style={{ color: active ? "#FFFFFF" : MUTED_STRONG }} aria-hidden="true" />
              </span>
              <span
                className="block max-w-[92px] truncate text-[12.5px]"
                style={{ fontWeight: active ? 600 : 400, color: active ? INK : MUTED_STRONG }}
              >
                {stage.shortLabel}
              </span>
            </button>
          </div>
        );
      })}
    </div>
  );
}
