"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion, animate } from "framer-motion";
import { Check, ScanLine } from "lucide-react";
import { PINS, HERO_IMAGE, STEP_MS, EASE, CAPTION, NUM, FOCUS, cx } from "./data";

/**
 * Hero device: a single real product photo overlaid with sequential
 * diagnostic annotation pins — the AI's actual reasoning made visible on the
 * garment itself, not a console or dial. Pins reveal/highlight in a fixed,
 * deterministic order on a plain step counter (setInterval, no Math.random /
 * Date.now anywhere). Clicking or focusing any pin jumps straight to it and
 * hands control to the visitor. The running "overall match" figure below the
 * image counts up through precomputed cumulative scores as pins are stepped
 * through, and loops back to pin 1 once the sequence completes.
 *
 * prefers-reduced-motion: autoplay never starts, the sequence opens already
 * on its final, fully-legible pin/score — never a stuck mid-scan or opacity:0
 * state — while every pin stays a real, focusable button either way.
 */
export default function AnnotationScan() {
  const reduced = useReducedMotion();
  const initialIndex = reduced ? PINS.length - 1 : 0;
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [autoplay, setAutoplay] = useState(!reduced);
  const [display, setDisplay] = useState(PINS[initialIndex].cumulative);
  const prevValue = useRef(PINS[initialIndex].cumulative);
  const firstRun = useRef(true);

  const pin = PINS[activeIndex];

  // deterministic sequence: advance one fixed step at a time, loop on a
  // fixed cycle. Stops permanently once the visitor takes manual control.
  useEffect(() => {
    if (!autoplay) return;
    const id = setInterval(() => {
      setActiveIndex((i) => (i + 1) % PINS.length);
    }, STEP_MS);
    return () => clearInterval(id);
  }, [autoplay]);

  // running match score counts up from the previous cumulative value to the
  // new one every time the active pin changes; reduced-motion sets it
  // directly so nothing is ever left mid-count or invisible.
  useEffect(() => {
    const target = PINS[activeIndex].cumulative;
    if (reduced) {
      setDisplay(target);
      prevValue.current = target;
      return;
    }
    if (firstRun.current) {
      firstRun.current = false;
    }
    const controls = animate(prevValue.current, target, {
      duration: 0.9,
      ease: EASE,
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    prevValue.current = target;
    return () => controls.stop();
  }, [activeIndex, reduced]);

  const selectPin = (i: number) => {
    setAutoplay(false);
    setActiveIndex(i);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* annotated photo — pins are real buttons at fixed % coordinates */}
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl border border-white/10 bg-[#111116] sm:aspect-[4/5]">
        <Image
          src={HERO_IMAGE.src}
          alt={HERO_IMAGE.alt}
          fill
          priority
          sizes="(min-width: 1024px) 560px, 100vw"
          className="object-cover"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0B0B0F]/70 via-transparent to-[#0B0B0F]/30"
        />

        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-[#0B0B0F]/80 px-2.5 py-1 text-[0.68rem] font-semibold text-white backdrop-blur">
          <ScanLine className="h-3.5 w-3.5 text-[#a894f7]" aria-hidden />
          Live diagnostic scan
        </span>

        {PINS.map((p, i) => {
          const isActive = i === activeIndex;
          const visited = i <= activeIndex || reduced;
          return (
            <button
              key={p.id}
              type="button"
              aria-label={`Annotation ${p.step} of ${PINS.length}: ${p.title} — ${p.confidence}% confidence`}
              aria-pressed={isActive}
              onClick={() => selectPin(i)}
              onFocus={() => selectPin(i)}
              style={{ top: p.top, left: p.left }}
              className={cx(
                "absolute z-10 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border text-xs font-semibold transition-colors duration-200",
                isActive
                  ? "border-[#6E56CF] bg-[#6E56CF] text-white"
                  : visited
                    ? "border-white/70 bg-[#0B0B0F]/85 text-white"
                    : "border-white/40 bg-[#0B0B0F]/70 text-white/80",
                FOCUS,
              )}
            >
              {visited && !isActive ? (
                <Check className="h-3.5 w-3.5" aria-hidden />
              ) : (
                <span className={NUM} aria-hidden>
                  {p.step}
                </span>
              )}
              <span className="sr-only">{isActive ? "currently selected" : ""}</span>

              {isActive && !reduced && (
                <motion.span
                  aria-hidden
                  className="absolute inset-0 rounded-full border-2 border-[#6E56CF]"
                  initial={{ opacity: 0.6, scale: 1 }}
                  animate={{ opacity: 0, scale: 1.9 }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* step indicator — decorative segments, real state in sr-only text */}
      <div className="flex items-center gap-1.5" aria-hidden>
        {PINS.map((p, i) => (
          <span
            key={p.id}
            className={cx(
              "h-1 flex-1 rounded-full transition-colors duration-300",
              i <= activeIndex || reduced ? "bg-[#6E56CF]" : "bg-white/10",
            )}
          />
        ))}
      </div>
      <p className="sr-only" aria-live="polite">
        Check {pin.step} of {PINS.length}: {pin.title}
      </p>

      {/* evidence panel — swaps to the selected pin's finding + sub-score,
          and the running overall match, side by side; stacks under the
          image (already, via normal flow) on narrow viewports instead of
          overlaying it. */}
      <div className="flex flex-col gap-6 rounded-xl border border-white/10 bg-white/[0.02] p-6 sm:flex-row sm:items-start sm:justify-between sm:p-7">
        <div className="min-w-0 flex-1" aria-live="polite">
          <p className={cx(CAPTION, "text-[#A1A1AA]")}>
            Finding {pin.step} of {PINS.length} — {pin.title}
          </p>
          <p className="mt-3 text-base font-normal leading-[1.6] text-white sm:text-lg">
            {pin.finding}
          </p>
          <p className="mt-3 text-sm font-normal text-[#A1A1AA]">
            Confidence{" "}
            <span className={cx("font-semibold text-white", NUM)}>
              {pin.confidence}%
            </span>
          </p>
        </div>
        <div className="shrink-0 border-t border-white/10 pt-5 sm:border-l sm:border-t-0 sm:pl-7 sm:pt-0">
          <p className={cx(CAPTION, "whitespace-nowrap text-[#A1A1AA]")}>
            Running match
          </p>
          <p className={cx("mt-2 text-4xl font-extrabold text-white", NUM)} aria-hidden>
            {display}
            <span className="text-xl text-[#A1A1AA]">%</span>
          </p>
          <span className="sr-only">{display} percent overall match, so far</span>
          <p className="mt-1 whitespace-nowrap text-xs font-normal text-[#A1A1AA]">
            through check {pin.step} of {PINS.length}
          </p>
        </div>
      </div>
    </div>
  );
}
