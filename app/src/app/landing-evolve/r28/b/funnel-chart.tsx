"use client";

import { useId } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import {
  CATEGORIES,
  DEFAULT_CATEGORY,
  DEFAULT_THRESHOLD,
  MAX_THRESHOLD,
  MIN_THRESHOLD,
  type Category,
  type FunnelResult,
} from "./data";
import { ACCENT, ACCENT_DEEP, BORDER, BORDER_STRONG, DISPLAY, FOCUS_RING, MUTED_STRONG } from "./tokens";

// Decorative per-stage fill opacity — the bars narrow *and* deepen in color as the
// pipeline concentrates, but the real numbers (never color alone) carry the meaning:
// every count and percentage is also printed as text next to its bar.
const STAGE_OPACITY = [0.14, 0.26, 0.4, 0.58, 1] as const;

/** A floor on rendered bar width so the final stage never visually disappears at a
 *  strict threshold — the printed count and percentage next to it always show the
 *  true, unfloored value, so nothing here is misrepresented, only kept visible. */
const MIN_BAR_PCT = 5;

function Connector({ fromPct, toPct, opacity }: { fromPct: number; toPct: number; opacity: number }) {
  const from = Math.max(fromPct, MIN_BAR_PCT);
  const to = Math.max(toPct, MIN_BAR_PCT);
  const points = `${50 - from / 2},0 ${50 + from / 2},0 ${50 + to / 2},100 ${50 - to / 2},100`;
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" className="block h-4 w-full">
      <polygon points={points} fill={ACCENT} fillOpacity={opacity} />
    </svg>
  );
}

export default function FunnelChart({
  category,
  threshold,
  result,
  onCategoryChange,
  onThresholdChange,
}: {
  category: Category;
  threshold: number;
  result: FunnelResult;
  onCategoryChange: (c: Category) => void;
  onThresholdChange: (t: number) => void;
}) {
  const reduceMotion = useReducedMotion();
  const baseId = useId();
  const sliderId = `${baseId}-threshold`;
  const isDefault = category === DEFAULT_CATEGORY && threshold === DEFAULT_THRESHOLD;
  const lastIndex = result.stages.length - 1;

  return (
    <div>
      {/* Category selector — which real dataset the funnel below is drawn from. */}
      <div role="group" aria-label="Category" className="flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={category === c}
            onClick={() => onCategoryChange(c)}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${FOCUS_RING} ${
              category === c
                ? "border-transparent text-white"
                : "text-[#52525B] hover:border-[#28409F]"
            }`}
            style={{
              backgroundColor: category === c ? ACCENT : "transparent",
              borderColor: category === c ? "transparent" : BORDER_STRONG,
            }}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] lg:items-start">
        {/* The funnel graphic + its text labels, stage by stage, top to bottom. */}
        <ol className="min-w-0 flex flex-col">
          {result.stages.map((stage, i) => {
            const widthPct = Math.max(stage.pctOfTotal, MIN_BAR_PCT);
            const isFinal = i === lastIndex;
            return (
              <li key={stage.id} className="min-w-0">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="flex items-baseline gap-2 min-w-0">
                    <span className="text-[11px] font-semibold tabular-nums text-[#52525B]">
                      0{i + 1}
                    </span>
                    <span className="truncate text-sm font-semibold text-[#15161B]">{stage.label}</span>
                  </span>
                  <span
                    className="flex-none whitespace-nowrap text-sm tabular-nums text-[#52525B]"
                    aria-live={isFinal ? "polite" : undefined}
                  >
                    <span className="font-semibold text-[#15161B]">
                      {stage.count.toLocaleString("en-US")}
                    </span>{" "}
                    · {stage.pctOfTotal}%
                  </span>
                </div>
                <div className="mt-2 h-11 w-full">
                  <motion.div
                    className="mx-auto h-11 rounded-[6px]"
                    style={{ backgroundColor: isFinal ? ACCENT_DEEP : ACCENT }}
                    initial={false}
                    animate={{ width: `${widthPct}%`, opacity: STAGE_OPACITY[i] }}
                    transition={
                      reduceMotion ? { duration: 0 } : { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
                    }
                    aria-hidden="true"
                  />
                </div>
                {!isFinal && (
                  <Connector
                    fromPct={widthPct}
                    toPct={Math.max(result.stages[i + 1].pctOfTotal, MIN_BAR_PCT)}
                    opacity={STAGE_OPACITY[i]}
                  />
                )}
              </li>
            );
          })}
        </ol>

        {/* The one manipulation: raise or lower the confidence bar for the final
            stage. Every number above recomputes from (category, threshold) — the
            bar chart is never hidden behind this control, it's live by default. */}
        <div className="min-w-0 rounded-2xl border p-6" style={{ borderColor: BORDER }}>
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-[#15161B]">
              Set the confidence bar
            </h3>
            <button
              type="button"
              onClick={() => {
                onCategoryChange(DEFAULT_CATEGORY);
                onThresholdChange(DEFAULT_THRESHOLD);
              }}
              disabled={isDefault}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold text-[#15161B] transition-colors hover:border-[#28409F] disabled:cursor-not-allowed disabled:opacity-40 ${FOCUS_RING}`}
              style={{ borderColor: BORDER_STRONG }}
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" strokeWidth={2} />
              Reset
            </button>
          </div>
          <p className="mt-2 text-sm leading-[1.6] text-[#52525B]">
            Every listing below the final stage already passed pre-screening, condition
            and authentication. This slider only decides how strict the last, highest
            bar is — raise it and the funnel narrows further, live.
          </p>

          <div className="mt-6">
            <div className="flex items-center justify-between gap-3">
              <label htmlFor={sliderId} className="text-sm font-semibold text-[#15161B]">
                Match confidence required
              </label>
              <span className="whitespace-nowrap text-sm tabular-nums text-[#52525B]">
                <span className="font-semibold text-[#15161B]">{threshold}%</span> or higher
              </span>
            </div>
            <input
              id={sliderId}
              type="range"
              min={MIN_THRESHOLD}
              max={MAX_THRESHOLD}
              step={1}
              value={threshold}
              onChange={(e) => onThresholdChange(Number(e.target.value))}
              aria-describedby={`${sliderId}-hint`}
              style={{
                background: `linear-gradient(to right, ${ACCENT} ${
                  ((threshold - MIN_THRESHOLD) / (MAX_THRESHOLD - MIN_THRESHOLD)) * 100
                }%, ${BORDER_STRONG} ${((threshold - MIN_THRESHOLD) / (MAX_THRESHOLD - MIN_THRESHOLD)) * 100}%)`,
              }}
              className={`mt-3 h-2 w-full cursor-pointer appearance-none rounded-full [&::-webkit-slider-thumb]:mt-[-6px] [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#3454D1] [&::-webkit-slider-thumb]:bg-white [&::-moz-range-track]:h-2 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-[#D4D4D1] [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[#3454D1] [&::-moz-range-thumb]:bg-white ${FOCUS_RING}`}
            />
            <p id={`${sliderId}-hint`} className="mt-2 text-xs leading-relaxed text-[#52525B]">
              {MIN_THRESHOLD}% lets through everything that was already authenticated.
              {" "}
              {MAX_THRESHOLD}% keeps only the very highest-confidence matches.
            </p>
          </div>

          <div className="mt-6 flex items-baseline justify-between gap-4 border-t pt-6" style={{ borderColor: BORDER }}>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ color: MUTED_STRONG }}>
                Final match rate
              </p>
              <p
                className="mt-1 text-[clamp(2rem,1.6rem+1.6vw,2.75rem)] font-extrabold leading-none tabular-nums text-[#15161B]"
                style={DISPLAY}
              >
                {result.matchedPct}%
              </p>
            </div>
            <p className="max-w-[220px] text-xs leading-relaxed text-[#52525B]">
              of every {category.toLowerCase()} listing submitted — {result.matched.toLocaleString("en-US")}{" "}
              of {result.submitted.toLocaleString("en-US")}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
