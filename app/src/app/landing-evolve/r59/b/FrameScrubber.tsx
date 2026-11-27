"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { deriveReplay, FRAMES, LIST_PRICE } from "./frames";
import { ACCENT, ACCENT_SOFT_BG, BORDER, FG, FOCUS_RING, MUTED, ON_ACCENT_TEXT, SURFACE, SURFACE_TINT } from "./tokens";

interface FrameScrubberProps {
  frameIndex: number;
  humanReview: boolean;
  onScrub: (index: number) => void;
  onToggleHumanReview: () => void;
  /** Compact mode (Hero only): the scrubber plus the live price/confidence readout, nothing else
   * — the expandable deduction row lives in the full device below, never duplicated. */
  compact?: boolean;
  labelId?: string;
}

/**
 * The page's one input-manipulation device. Dragging (or arrow-keying — native `<input
 * type="range">` behavior, no custom keyboard handler needed) the scrubber moves through five
 * inspection frames; each frame position drives the running deduction total, the final price,
 * and the overall confidence score at once. The human-review toggle is a second, independent
 * input axis: it only changes the OUTCOME of frame 3's battery check (a non-monotonic override,
 * not a uniform discount), so the two controls visibly do different kinds of work.
 */
export function FrameScrubber({ frameIndex, humanReview, onScrub, onToggleHumanReview, compact = false, labelId }: FrameScrubberProps) {
  const [expanded, setExpanded] = useState(false);
  const result = deriveReplay(frameIndex, humanReview);
  const activeDeduction = humanReview && result.frame.humanOverrideDeduction !== undefined
    ? result.frame.humanOverrideDeduction
    : result.frame.deduction;
  const hasDeductionDetail = activeDeduction > 0;

  const scrubber = (
    <div>
      <input
        type="range"
        min={0}
        max={FRAMES.length - 1}
        step={1}
        value={frameIndex}
        onChange={(e) => onScrub(Number(e.target.value))}
        aria-labelledby={labelId}
        aria-valuetext={`Frame ${frameIndex + 1} of ${FRAMES.length}: ${result.frame.label}`}
        className={`h-1.5 w-full cursor-pointer appearance-none rounded-full ${FOCUS_RING}`}
        style={{ backgroundColor: SURFACE_TINT, accentColor: ACCENT }}
      />
      <div className="mt-1.5 flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.08em] tabular-nums" style={{ color: MUTED }}>
        <span>Frame {frameIndex + 1} / {FRAMES.length}</span>
        <span style={{ color: ACCENT }}>{result.frame.label}</span>
      </div>
    </div>
  );

  if (compact) {
    return (
      <div className="rounded-2xl p-3" style={{ border: `1px solid ${BORDER}`, backgroundColor: SURFACE }}>
        {scrubber}
        <p className="mt-2.5 flex items-baseline justify-between gap-2 tabular-nums">
          <span className="text-[17px] font-extrabold" style={{ color: FG }}>
            ${result.finalPriceAtFrame.toLocaleString("en-US")}
          </span>
          <span className="text-[12px] font-semibold" style={{ color: ACCENT }}>
            {result.overallConfidence}% confidence
          </span>
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl p-5" style={{ border: `1px solid ${BORDER}`, backgroundColor: SURFACE }}>
      {scrubber}

      <div className="mt-4 flex items-center justify-between gap-3 rounded-lg px-3 py-2.5" style={{ backgroundColor: SURFACE_TINT }}>
        <span className="text-[13px] font-medium" style={{ color: FG }}>
          Route flagged checks to a human reviewer
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={humanReview}
          aria-label="Route flagged checks to a human reviewer"
          onClick={onToggleHumanReview}
          className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${FOCUS_RING}`}
          style={{ backgroundColor: humanReview ? ACCENT : "#52525B" }}
        >
          <span
            className="absolute top-0.5 h-5 w-5 rounded-full"
            style={{ backgroundColor: ON_ACCENT_TEXT, transform: humanReview ? "translateX(22px)" : "translateX(2px)" }}
          />
        </button>
      </div>

      <dl className="mt-4 grid grid-cols-3 gap-3">
        <div className="min-w-0">
          <dt className="text-[10.5px] font-semibold uppercase tracking-[0.1em]" style={{ color: MUTED }}>
            List price
          </dt>
          <dd className="mt-0.5 text-[16px] font-extrabold tabular-nums" style={{ color: FG }}>
            ${LIST_PRICE.toLocaleString("en-US")}
          </dd>
        </div>
        <div className="min-w-0">
          <dt className="text-[10.5px] font-semibold uppercase tracking-[0.1em]" style={{ color: MUTED }}>
            Deducted so far
          </dt>
          <dd className="mt-0.5 text-[16px] font-extrabold tabular-nums" style={{ color: ACCENT }}>
            −${result.cumulativeDeduction.toLocaleString("en-US")}
          </dd>
        </div>
        <div className="min-w-0">
          <dt className="text-[10.5px] font-semibold uppercase tracking-[0.1em]" style={{ color: MUTED }}>
            Price at this frame
          </dt>
          <dd className="mt-0.5 text-[16px] font-extrabold tabular-nums" style={{ color: FG }}>
            ${result.finalPriceAtFrame.toLocaleString("en-US")}
          </dd>
        </div>
      </dl>

      <div className="mt-4 rounded-lg p-3.5" style={{ backgroundColor: ACCENT_SOFT_BG }}>
        <div className="flex items-start justify-between gap-3">
          <p className="text-[13px] font-normal leading-[1.55]" style={{ color: FG }}>
            {result.frame.note}
          </p>
          {hasDeductionDetail && (
            <button
              type="button"
              aria-expanded={expanded}
              onClick={() => setExpanded((v) => !v)}
              className={`flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-[11px] font-semibold tabular-nums ${FOCUS_RING}`}
              style={{ backgroundColor: ACCENT, color: ON_ACCENT_TEXT }}
            >
              −${activeDeduction}
              {expanded ? <ChevronUp className="h-3 w-3" aria-hidden="true" /> : <ChevronDown className="h-3 w-3" aria-hidden="true" />}
            </button>
          )}
        </div>
        {hasDeductionDetail && expanded && (
          <p className="mt-2.5 border-t pt-2.5 text-[12.5px] font-normal leading-[1.55]" style={{ borderColor: BORDER, color: MUTED }}>
            {humanReview && result.frame.humanNote ? result.frame.humanNote : "This deduction reflects the AI's check alone — turn on human review above to see if a reviewer would adjust it."}
          </p>
        )}
      </div>
    </div>
  );
}
