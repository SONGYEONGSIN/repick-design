"use client";

import {
  CHART_H,
  CHART_W,
  DAY_MAX,
  DAY_MIN,
  PEAK_DAY,
  PHASE_LABEL,
  curveAreaPolygonAttr,
  curvePolylineAttr,
  markerPosition,
  payoutAtDay,
  phaseAtDay,
  phaseBands,
  recommendationFor,
} from "./curve";
import { ACCENT, ACCENT_SOFT_BG, BORDER, FG, FOCUS_RING, MUTED, ON_ACCENT_TEXT, SURFACE, SURFACE_TINT } from "./tokens";

interface TimingDialProps {
  day: number;
  certified: boolean;
  onDayChange: (day: number) => void;
  onToggleCertified: () => void;
  /** Compact mode (Hero only): dial + mini chart + payout, no phase legend or detail text — the
   * full legend and explanation live in the full device below, never duplicated. */
  compact?: boolean;
  dialLabelId?: string;
}

/**
 * The page's one input-manipulation device. A single continuous dial (day 0-180) moves a live
 * marker along a deterministic price-decay curve; a second, independent toggle (the verified
 * condition certificate) rescales the ENTIRE curve by a fixed premium rather than nudging one
 * number — toggling it redraws the polyline and polygon `points` attributes, not just the payout
 * readout beside them.
 */
export function TimingDial({ day, certified, onDayChange, onToggleCertified, compact = false, dialLabelId }: TimingDialProps) {
  const payout = payoutAtDay(day, certified);
  const phase = phaseAtDay(day);
  const marker = markerPosition(day, certified);
  const bands = phaseBands();
  const bandFill: Record<string, string> = {
    rising: "#052E16",
    peak: SURFACE_TINT,
    declining: "#18181B",
  };

  const chart = (
    <svg
      viewBox={`0 0 ${CHART_W} ${CHART_H}`}
      className="h-auto w-full"
      role="img"
      aria-label={`Projected resale value curve. Day ${day} of 180, currently ${PHASE_LABEL[phase]}, projected payout $${payout}${certified ? " with the verified condition certificate applied" : ""}.`}
    >
      {bands.map((band) => (
        <rect
          key={band.phase}
          x={band.x0}
          y={0}
          width={Math.max(0, band.x1 - band.x0)}
          height={CHART_H}
          fill={bandFill[band.phase]}
          opacity={band.phase === "peak" ? 0.9 : 0.5}
        />
      ))}
      <polygon points={curveAreaPolygonAttr(certified)} fill={ACCENT} opacity={0.16} />
      <polyline points={curvePolylineAttr(certified)} fill="none" stroke={ACCENT} strokeWidth={3} strokeLinejoin="round" />
      <line
        x1={(PEAK_DAY / DAY_MAX) * CHART_W}
        x2={(PEAK_DAY / DAY_MAX) * CHART_W}
        y1={0}
        y2={CHART_H}
        stroke={MUTED}
        strokeWidth={1}
        strokeDasharray="3,4"
        opacity={0.5}
      />
      <circle cx={marker.x} cy={marker.y} r={7} fill={ACCENT} stroke={ON_ACCENT_TEXT} strokeWidth={2} />
      <circle cx={marker.x} cy={marker.y} r={13} fill="none" stroke={ACCENT} strokeWidth={1.5} opacity={0.55} />
    </svg>
  );

  return (
    <div className="rounded-2xl p-4" style={{ border: `1px solid ${BORDER}`, backgroundColor: SURFACE }}>
      {chart}

      <div className="mt-3">
        <label htmlFor={dialLabelId ?? "timing-dial"} className="text-[11px] font-semibold uppercase tracking-[0.1em]" style={{ color: MUTED }}>
          Days until you sell
        </label>
        <input
          id={dialLabelId ?? "timing-dial"}
          type="range"
          min={DAY_MIN}
          max={DAY_MAX}
          step={1}
          value={day}
          onChange={(e) => onDayChange(Number(e.target.value))}
          aria-valuetext={`Day ${day} of 180. ${PHASE_LABEL[phase]}. Projected payout $${payout}.`}
          className={`mt-1.5 h-6 w-full cursor-pointer appearance-none rounded-full bg-[#27272A] outline-offset-4 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[#18181B] [&::-moz-range-thumb]:bg-[#22C55E] [&::-moz-range-thumb]:shadow-[0_1px_3px_rgba(0,0,0,0.5)] [&::-webkit-slider-runnable-track]:h-1.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-[#27272A] [&::-webkit-slider-thumb]:mt-[-7px] [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#18181B] [&::-webkit-slider-thumb]:bg-[#22C55E] [&::-webkit-slider-thumb]:shadow-[0_1px_3px_rgba(0,0,0,0.5)] ${FOCUS_RING}`}
        />
        <div className="mt-1 flex items-center justify-between text-[11px] font-normal" style={{ color: MUTED }}>
          <span>Day 0</span>
          <span>Day 180</span>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="tabular-nums">
          <span className="text-[22px] font-extrabold" style={{ color: FG }}>
            ${payout}
          </span>
          <span className="ml-1.5 text-[12.5px] font-semibold uppercase tracking-[0.08em]" style={{ color: ACCENT }}>
            {PHASE_LABEL[phase]}
          </span>
        </p>
        <button
          type="button"
          role="switch"
          aria-checked={certified}
          onClick={onToggleCertified}
          className={`shrink-0 rounded-full px-3 py-1.5 text-[12px] font-semibold ${FOCUS_RING}`}
          style={{
            backgroundColor: certified ? ACCENT : SURFACE_TINT,
            color: certified ? ON_ACCENT_TEXT : MUTED,
          }}
        >
          {certified ? "Certificate: on" : "Certificate: off"}
        </button>
      </div>

      {!compact && (
        <p className="mt-3 rounded-lg p-2.5 text-[13px] font-normal leading-[1.5]" style={{ backgroundColor: ACCENT_SOFT_BG, color: FG }}>
          {recommendationFor(day, certified)}
        </p>
      )}
    </div>
  );
}
