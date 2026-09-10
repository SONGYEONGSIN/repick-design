"use client";

import { animate as animateValue, motion, useMotionValue, useReducedMotion } from "framer-motion";
import type { KeyboardEvent, PointerEvent as ReactPointerEvent } from "react";
import { useEffect, useRef } from "react";
import { STAGES } from "./data";
import { ACCENT_HEX, clamp, cx, FOCUS, MUTED, r2, TRACK_BG, TRACK_STAT } from "./tokens";

const N = STAGES.length;
const HANDLE = 18;

/**
 * The ordinal, single-select stage control — a real drag scrubber, not five independent toggles.
 *
 * Two input paths write to the SAME `activeIndex` state, so they can never disagree:
 *  1. Five real <button> elements below the track — always tabbable, aria-current="step" on the
 *     active one, arrow keys move both focus and selection. This is the full keyboard/AT path and
 *     needs no measurement at all.
 *  2. A draggable handle on the track above them, built on framer-motion's `drag="x"` + a
 *     `useMotionValue`. It fires `onChange` continuously during the drag (not just on release) — the
 *     product card and history log update live as the pointer moves, which is what makes this read
 *     as scrubbing a real timeline rather than clicking a tab.
 *
 * The handle is `aria-hidden`: it duplicates functionality the buttons already expose, and marking
 * it hidden keeps a screen reader from announcing an unlabeled draggable node.
 *
 * Horizontal alignment between the two paths is done with plain math, not DOM measurement: the
 * button row is a `repeat(N, 1fr)` grid over the FULL track width, so column i's centre sits at
 * `(i + 0.5) / N` of that width. The track's own draggable span is inset by exactly that same
 * half-column amount on each side (`100 / (2N)` %), so its N evenly-spaced stops land on identical
 * fractions. The only real DOM measurement (a `ResizeObserver` on the inset span) is for converting
 * "stage index" into the pixel `x` the drag handle's motion value needs — drag interactions are
 * inherently pixel-based, so that one measurement is unavoidable, but it is the only one.
 */
export default function StageScrubber({
  activeIndex,
  onChange,
}: {
  activeIndex: number;
  onChange: (index: number) => void;
}) {
  const reduceMotion = Boolean(useReducedMotion());
  const innerRef = useRef<HTMLDivElement>(null);
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const x = useMotionValue(0);

  const insetPct = r2(100 / (2 * N));
  const pct = activeIndex / (N - 1);

  // Keep the drag handle snapped to whichever stage is active, in real pixels. Runs on mount, on
  // every stage change, and whenever a ResizeObserver reports the track resized.
  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    function settle(width: number) {
      const target = r2((activeIndex / (N - 1)) * width);
      animateValue(x, target, reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 460, damping: 42 });
    }
    settle(el.getBoundingClientRect().width);
    const ro = new ResizeObserver((entries) => settle(entries[0].contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentionally re-runs only on stage change; width comes from the observer callback
  }, [activeIndex, reduceMotion]);

  function nearestFromClientX(clientX: number): number {
    const rect = innerRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return activeIndex;
    const frac = clamp((clientX - rect.left) / rect.width, 0, 1);
    return Math.round(frac * (N - 1));
  }

  function handleKeyDown(e: KeyboardEvent<HTMLButtonElement>, i: number) {
    let next = i;
    if (e.key === "ArrowRight") next = Math.min(N - 1, i + 1);
    else if (e.key === "ArrowLeft") next = Math.max(0, i - 1);
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = N - 1;
    else return;
    e.preventDefault();
    onChange(next);
    btnRefs.current[next]?.focus();
  }

  // A click anywhere along the track (not just the handle) also scrubs — a second pointer affordance
  // real scrubbers offer, distinct from both dragging the handle and clicking a stage button.
  function handleTrackPointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    onChange(nearestFromClientX(e.clientX));
  }

  // `info.point` is page-relative (like `pageX`/`pageY`), while `getBoundingClientRect` is
  // viewport-relative — they only agree when horizontal scroll is 0, which this page never has
  // (nothing here scrolls sideways), so treating the two as interchangeable is safe here.

  return (
    <div role="group" aria-label="This coat's real history — five recorded stages">
      <div className="w-full">
        <div
          ref={innerRef}
          onPointerDown={handleTrackPointerDown}
          className="relative h-6 cursor-pointer touch-none"
          style={{ marginLeft: `${insetPct}%`, marginRight: `${insetPct}%` }}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 right-0 left-0 h-[3px] -translate-y-1/2 rounded-full"
            style={{ backgroundColor: TRACK_BG }}
          />
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-0 h-[3px] w-full origin-left -translate-y-1/2 rounded-full"
            style={{ backgroundColor: ACCENT_HEX }}
            animate={{ scaleX: pct }}
            transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 460, damping: 42 }}
          />
          <motion.div
            drag="x"
            dragConstraints={innerRef}
            dragElastic={0}
            dragMomentum={false}
            onDrag={(_, info) => onChange(nearestFromClientX(info.point.x))}
            onDragEnd={(_, info) => onChange(nearestFromClientX(info.point.x))}
            whileTap={reduceMotion ? undefined : { scale: 0.9 }}
            aria-hidden="true"
            className="absolute z-10 cursor-grab touch-none rounded-full border-[3px] border-white shadow-[0_1px_4px_rgba(24,24,27,0.35)] active:cursor-grabbing"
            style={{
              x,
              left: 0,
              top: "50%",
              width: HANDLE,
              height: HANDLE,
              marginLeft: -HANDLE / 2,
              marginTop: -HANDLE / 2,
              backgroundColor: ACCENT_HEX,
            }}
          />
        </div>

        <div className="mt-3 grid" style={{ gridTemplateColumns: `repeat(${N}, minmax(0, 1fr))` }}>
          {STAGES.map((stage, i) => {
            const active = i === activeIndex;
            const reached = i <= activeIndex;
            return (
              <button
                key={stage.id}
                ref={(el) => {
                  btnRefs.current[i] = el;
                }}
                type="button"
                aria-current={active ? "step" : undefined}
                onClick={() => onChange(i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                className={cx(
                  "flex min-w-0 flex-col items-center gap-1.5 rounded-lg px-1 py-1.5 text-center transition-colors duration-150 hover:bg-zinc-100",
                  FOCUS,
                )}
              >
                <span
                  aria-hidden="true"
                  className={cx("h-2.5 w-2.5 shrink-0 rounded-full border-2 transition-colors duration-150")}
                  style={{
                    borderColor: reached ? ACCENT_HEX : "#D4D4D8",
                    backgroundColor: reached ? ACCENT_HEX : "#FFFFFF",
                  }}
                />
                <span className="sr-only">{`Stage ${i + 1} of ${N}: `}</span>
                <span
                  className={cx(
                    "truncate text-[10.5px] uppercase sm:text-[11px]",
                    TRACK_STAT,
                    active ? "font-semibold text-zinc-900" : cx("font-normal", MUTED),
                  )}
                >
                  {stage.shortLabel}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
