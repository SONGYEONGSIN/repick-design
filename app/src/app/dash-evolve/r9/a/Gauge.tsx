"use client";

import { useId, useState } from "react";
import { round2 } from "./data";
import { TEXT_CAPTION, TEXT_PRIMARY, TONE, TRANSITION, cx, type Tone } from "./tokens";
import { EyebrowLabel } from "./ui";

/* ---------------------------------------------------------------------- */
/* 극좌표 → 직교좌표. 0deg = 12시, 시계방향 양수. 소수 2자리 반올림(하이드레이션). */
/* ---------------------------------------------------------------------- */

function polarPoint(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: round2(cx + r * Math.sin(rad)), y: round2(cy - r * Math.cos(rad)) };
}

function describeArc(cx: number, cy: number, r: number, startDeg: number, endDeg: number): string {
  const start = polarPoint(cx, cy, r, startDeg);
  const end = polarPoint(cx, cy, r, endDeg);
  const largeArc = Math.abs(endDeg - startDeg) > 180 ? 1 : 0;
  const sweep = endDeg >= startDeg ? 1 : 0;
  return `M ${start.x} ${start.y} A ${round2(r)} ${round2(r)} 0 ${largeArc} ${sweep} ${end.x} ${end.y}`;
}

/** 게이지 스윕 범위 — 12시를 기준으로 좌우 125deg씩, 바닥에 110deg 갭(자동차 클러스터 문법). */
const SWEEP_START = -125;
const SWEEP_END = 125;

function valueToAngle(value: number, min: number, max: number): number {
  const frac = Math.min(1, Math.max(0, (value - min) / (max - min)));
  return SWEEP_START + frac * (SWEEP_END - SWEEP_START);
}

export type GaugeZone = { from: number; to: number; tone: Tone };

function zoneForValue(value: number, zones: GaugeZone[]): GaugeZone {
  for (const z of zones) {
    const lo = Math.min(z.from, z.to);
    const hi = Math.max(z.from, z.to);
    if (value >= lo && value <= hi) return z;
  }
  return zones[zones.length - 1];
}

type Geom = { vb: string; cx: number; cy: number; r: number; trackW: number; rimR: number; rimW: number; needleLen: number; hubR: number };

const GEOM: Record<"hero" | "md", Geom> = {
  hero: { vb: "0 0 240 210", cx: 120, cy: 112, r: 92, trackW: 17, rimR: 108, rimW: 6, needleLen: 78, hubR: 10 },
  md: { vb: "0 0 200 180", cx: 100, cy: 96, r: 76, trackW: 13, rimR: 90, rimW: 5, needleLen: 64, hubR: 7 },
};

export type GaugeProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  target?: number;
  zones: GaugeZone[];
  formatValue: (v: number) => string;
  formatPrecise?: (v: number) => string;
  caption: string;
  size?: "hero" | "md";
  className?: string;
};

export default function Gauge({ label, value, min, max, target, zones, formatValue, formatPrecise, caption, size = "md", className }: GaugeProps) {
  const [open, setOpen] = useState(false);
  const reactId = useId();
  const tooltipId = `gauge-tip-${reactId}`;
  const g = GEOM[size];
  const zone = zoneForValue(value, zones);
  const tone = TONE[zone.tone];
  const valueAngle = valueToAngle(value, min, max);

  const trackPath = describeArc(g.cx, g.cy, g.r, SWEEP_START, SWEEP_END);
  const fillPath = describeArc(g.cx, g.cy, g.r, SWEEP_START, valueAngle);
  const needleTip = polarPoint(g.cx, g.cy, g.needleLen, valueAngle);
  const needleBack = polarPoint(g.cx, g.cy, g.hubR * 1.4, valueAngle + 180);
  const targetAngle = target !== undefined ? valueToAngle(target, min, max) : null;
  const targetInner = targetAngle !== null ? polarPoint(g.cx, g.cy, g.r - g.trackW / 2 - 2, targetAngle) : null;
  const targetOuter = targetAngle !== null ? polarPoint(g.cx, g.cy, g.r + g.trackW / 2 + 2, targetAngle) : null;

  const precise = formatPrecise ? formatPrecise(value) : formatValue(value);
  const statusText = `${zone.tone === "good" ? "Within target" : zone.tone === "warn" ? "Approaching threshold" : "Over threshold"}`;

  function show() {
    setOpen(true);
  }
  function hide() {
    setOpen(false);
  }

  return (
    <div
      role="group"
      tabIndex={0}
      aria-label={`${label}: ${formatValue(value)}. ${statusText}.`}
      aria-describedby={open ? tooltipId : undefined}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
      onKeyDown={(e) => {
        if (e.key === "Escape") hide();
      }}
      className={cx("relative flex flex-col items-center rounded-xl outline-none", "focus-visible:ring-2 focus-visible:ring-sky-600 dark:focus-visible:ring-sky-400", className)}
    >
      <div className="flex items-center gap-1.5 self-start">
        <EyebrowLabel>{label}</EyebrowLabel>
      </div>

      <div className="relative w-full">
        <svg viewBox={g.vb} className="w-full" aria-hidden="true" focusable="false">
          {/* zone rim — 위험 구간을 바깥쪽 얇은 링으로 상시 표시(레드라인 모티프) */}
          {zones.map((z, i) => {
            const a1 = valueToAngle(Math.min(z.from, z.to), min, max);
            const a2 = valueToAngle(Math.max(z.from, z.to), min, max);
            return (
              <path
                key={i}
                d={describeArc(g.cx, g.cy, g.rimR, a1, a2)}
                fill="none"
                stroke={TONE[z.tone].hex}
                strokeWidth={g.rimW}
                strokeLinecap="butt"
                opacity={0.55}
              />
            );
          })}

          {/* track */}
          <path d={trackPath} fill="none" strokeWidth={g.trackW} strokeLinecap="round" className="stroke-zinc-100 dark:stroke-zinc-800" />

          {/* fill arc — 현재 값까지 진행 표시, 존 톤으로 채색 */}
          {value > min ? (
            <path d={fillPath} fill="none" stroke={tone.hex} strokeWidth={g.trackW} strokeLinecap="round" className={cx(TRANSITION)} />
          ) : null}

          {/* target tick */}
          {targetInner && targetOuter ? (
            <line
              x1={targetInner.x}
              y1={targetInner.y}
              x2={targetOuter.x}
              y2={targetOuter.y}
              strokeWidth={2.5}
              strokeLinecap="round"
              className="stroke-zinc-500 dark:stroke-zinc-300"
            />
          ) : null}

          {/* needle */}
          <line
            x1={needleBack.x}
            y1={needleBack.y}
            x2={needleTip.x}
            y2={needleTip.y}
            strokeWidth={size === "hero" ? 3.5 : 3}
            strokeLinecap="round"
            className="stroke-zinc-700 dark:stroke-zinc-200"
          />
          <circle cx={g.cx} cy={g.cy} r={g.hubR} className="fill-white stroke-zinc-400 dark:fill-zinc-900 dark:stroke-zinc-600" strokeWidth={2} />
        </svg>

        <div className="pointer-events-none absolute inset-x-0 bottom-1 flex flex-col items-center sm:bottom-2">
          <span className={cx(size === "hero" ? "text-4xl sm:text-5xl" : "text-2xl", "font-semibold tabular-nums tracking-tight", TEXT_PRIMARY)}>
            {formatValue(value)}
          </span>
          <span className={cx("mt-0.5 text-center text-xs", TEXT_CAPTION)}>{caption}</span>
        </div>
      </div>

      {open ? (
        <div
          id={tooltipId}
          role="tooltip"
          className={cx(
            "absolute -top-2 left-1/2 z-30 w-56 -translate-x-1/2 -translate-y-full rounded-lg border px-3 py-2.5 text-left shadow-lg",
            "border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-800",
          )}
        >
          <p className={cx("text-xs font-semibold", TEXT_PRIMARY)}>{label}</p>
          <p className={cx("mt-0.5 text-lg font-semibold tabular-nums", TEXT_PRIMARY)}>{precise}</p>
          <p className={cx("mt-1 inline-flex items-center gap-1.5 text-xs font-medium", tone.text)}>
            <span aria-hidden="true" className={cx("h-1.5 w-1.5 rounded-full", tone.dot)} />
            {statusText}
          </p>
          {target !== undefined ? <p className={cx("mt-1 text-[11px]", TEXT_CAPTION)}>Target: {formatValue(target)}</p> : null}
        </div>
      ) : null}
    </div>
  );
}
