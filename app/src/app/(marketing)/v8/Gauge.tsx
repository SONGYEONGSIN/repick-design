"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { CRITERIA, TOTAL_MATCH, cx, FOCUS, CAPTION, NUM } from "./data";

// --- deterministic dial geometry (no Math.random / Date.now allowed) ----------
const SIZE = 300;
const CENTER = SIZE / 2;
const RADIUS = 120;
const STROKE = 16;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const GAP_DEG = 8;
const ARC_DEG = (360 - CRITERIA.length * GAP_DEG) / CRITERIA.length;
const SEG_LEN = CIRCUMFERENCE * (ARC_DEG / 360);
const STEP_DEG = ARC_DEG + GAP_DEG;

// animation runs on a fixed step counter — only setInterval's increments are used, no time functions
const TOTAL_STEPS = 60;
const STEP_MS = 30;

function segmentStart(i: number) {
  return -90 + i * STEP_DEG;
}

export default function Gauge() {
  const reduced = useReducedMotion();
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState(0);
  const btnRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    // prefers-reduced-motion: skip the animation and render the completed state immediately (progress calc below)
    if (reduced) return;
    const id = setInterval(() => {
      setStep((s) => {
        if (s >= TOTAL_STEPS) {
          clearInterval(id);
          return s;
        }
        return s + 1;
      });
    }, STEP_MS);
    return () => clearInterval(id);
  }, [reduced]);

  // while reduced === null (right after mount, before the media query resolves), the animation
  // starts normally, then locks to the completed state the instant reduced === true is confirmed (never stops mid-way).
  const progress = reduced ? 1 : Math.min(step / TOTAL_STEPS, 1);
  const centerValue = Math.round(progress * TOTAL_MATCH);
  const activeIdx = CRITERIA.findIndex(
    (_, i) => progress < (i + 1) / CRITERIA.length,
  );
  const computing = activeIdx === -1 ? null : CRITERIA[activeIdx];

  const onKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, idx: number) => {
    let next = idx;
    if (e.key === "ArrowRight" || e.key === "ArrowDown")
      next = (idx + 1) % CRITERIA.length;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp")
      next = (idx - 1 + CRITERIA.length) % CRITERIA.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = CRITERIA.length - 1;
    else return;
    e.preventDefault();
    setSelected(next);
    btnRefs.current[next]?.focus();
  };

  const active = CRITERIA[selected];

  return (
    <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-center sm:gap-10">
      {/* sr-only data summary — the SVG is purely decorative (aria-hidden); the real info lives here + in the button list */}
      <p className="sr-only">
        AI match accuracy overall {TOTAL_MATCH} percent.{" "}
        {CRITERIA.map((c) => `${c.label} ${c.score} percent`).join(", ")}.
      </p>

      <div className="relative mx-auto aspect-square w-full max-w-[240px] shrink-0 sm:max-w-[280px]">
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          width="100%"
          height="100%"
          aria-hidden="true"
          className="block"
        >
          {CRITERIA.map((c, i) => {
            const lit = progress >= (i + 1) / CRITERIA.length - 0.001;
            const localProgress = Math.min(
              Math.max((progress - i / CRITERIA.length) / (1 / CRITERIA.length), 0),
              1,
            );
            const isSelected = selected === i;
            return (
              <g key={c.id}>
                {/* track */}
                <circle
                  cx={CENTER}
                  cy={CENTER}
                  r={RADIUS}
                  fill="none"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth={STROKE}
                  strokeLinecap="round"
                  strokeDasharray={`${SEG_LEN} ${CIRCUMFERENCE - SEG_LEN}`}
                  transform={`rotate(${segmentStart(i)} ${CENTER} ${CENTER})`}
                />
                {/* fill */}
                <circle
                  cx={CENTER}
                  cy={CENTER}
                  r={RADIUS}
                  fill="none"
                  stroke={isSelected ? "#a894f7" : "#6E56CF"}
                  strokeWidth={isSelected ? STROKE + 4 : STROKE}
                  strokeLinecap="round"
                  strokeDasharray={`${SEG_LEN * localProgress} ${
                    CIRCUMFERENCE - SEG_LEN * localProgress
                  }`}
                  transform={`rotate(${segmentStart(i)} ${CENTER} ${CENTER})`}
                  opacity={lit ? 1 : 0.85}
                  style={{
                    transition: reduced
                      ? undefined
                      : "stroke-width 200ms ease, opacity 200ms ease",
                  }}
                />
              </g>
            );
          })}
        </svg>

        {/* center readout */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span
            className={cx(
              NUM,
              "text-[3rem] font-extrabold leading-none text-white sm:text-[3.75rem]",
            )}
          >
            {centerValue}%
          </span>
          <span className="mt-2 max-w-[9rem] text-center text-[0.72rem] font-normal leading-snug text-[#A1A1AA]">
            {computing
              ? `Calculating ${computing.label}…`
              : "AI match accuracy calculated"}
          </span>
        </div>
      </div>

      {/* criterion select buttons — the real interactive control (accessibility, instead of an SVG hit area) */}
      <div className="w-full min-w-0 flex-1">
        <p className={cx(CAPTION, "text-[#A1A1AA]")}>Selecting a criterion updates the evidence</p>
        <div
          role="tablist"
          aria-label="AI match accuracy scoring criteria"
          aria-orientation="vertical"
          className="mt-3 flex flex-col gap-1.5"
        >
          {CRITERIA.map((c, i) => {
            const Icon = c.icon;
            const isSelected = selected === i;
            const lit = progress >= (i + 1) / CRITERIA.length - 0.001;
            return (
              <button
                key={c.id}
                ref={(el) => {
                  btnRefs.current[i] = el;
                }}
                role="tab"
                id={`crit-tab-${c.id}`}
                aria-selected={isSelected}
                aria-controls="crit-panel"
                tabIndex={isSelected ? 0 : -1}
                onClick={() => setSelected(i)}
                onKeyDown={(e) => onKeyDown(e, i)}
                className={cx(
                  "flex items-center gap-2.5 rounded-xl border px-3 py-2 text-left transition-colors duration-150",
                  FOCUS,
                  isSelected
                    ? "border-[#6E56CF]/60 bg-[#6E56CF]/10"
                    : "border-white/10 bg-transparent hover:border-white/25",
                )}
              >
                <Icon
                  className={cx(
                    "h-4 w-4 shrink-0",
                    lit ? "text-[#a894f7]" : "text-[#A1A1AA]",
                  )}
                  aria-hidden
                />
                <span className="min-w-0 flex-1 truncate text-[0.82rem] font-semibold text-white">
                  {c.label}
                </span>
                <span
                  className={cx(
                    NUM,
                    "shrink-0 text-[0.82rem] font-extrabold",
                    lit ? "text-white" : "text-[#A1A1AA]",
                  )}
                >
                  {lit ? `${c.score}%` : "—"}
                </span>
              </button>
            );
          })}
        </div>

        <motion.div
          id="crit-panel"
          role="tabpanel"
          aria-labelledby={`crit-tab-${active.id}`}
          key={active.id}
          initial={reduced ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="mt-4 rounded-xl border border-white/10 bg-white/[0.02] p-4"
        >
          <p className="flex items-center justify-between gap-2 text-[0.78rem] font-semibold text-white">
            <span>{active.label}</span>
            <span className={cx(NUM, "text-[#a894f7]")}>{active.weight}</span>
          </p>
          <p className="mt-2 text-[0.8rem] font-normal leading-[1.6] text-[#A1A1AA]">
            {active.evidence}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
