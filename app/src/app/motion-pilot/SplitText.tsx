"use client";

import { motion, useReducedMotion } from "framer-motion";
import { EASE } from "./data";

/**
 * Character-level stagger with the accessibility fix dala-style sites usually miss:
 * the visible glyph spans are `aria-hidden`, and the accessible name is carried by a single
 * `aria-label` on the wrapper — so a screen reader reads the sentence, not the alphabet.
 *
 * Under `prefers-reduced-motion` every glyph renders at its final state with no delay.
 */
export function SplitChars({
  text,
  className,
  delay = 0,
  start = true,
}: {
  text: string;
  className?: string;
  delay?: number;
  /**
   * Held false while the loading curtain is up, so the reveal plays *after* it lifts instead of
   * finishing behind it. Defaults true: callers with no curtain to wait on are unaffected.
   */
  start?: boolean;
}) {
  const reduced = useReducedMotion();
  const chars = Array.from(text);
  // Reduced motion outranks the curtain. Gating `animate` on `start` alone made this element hold at
  // opacity 0 and then *animate* to 1 when the curtain lifted — a real transition, under a setting
  // that asks for none. It also made the frame time-dependent: two reduced-motion captures of the
  // same commit diverged in 2 of 4 runs, because hydration lands late enough behind WebGL setup that
  // the 0.5s fade was sometimes still running when the shot was taken. Settling immediately removes
  // both the unwanted motion and the nondeterminism.
  const settled = reduced || start;
  return (
    <span className={className} aria-label={text} role="text">
      {chars.map((ch, i) => (
        <motion.span
          key={`${ch}-${i}`}
          aria-hidden
          className="inline-block whitespace-pre will-change-transform"
          initial={reduced ? false : { opacity: 0, y: "0.45em" }}
          animate={settled ? { opacity: 1, y: 0 } : { opacity: 0, y: "0.45em" }}
          // duration 0 rather than a short one: if `reduced` resolves after the first client render,
          // an in-flight fade has to snap, not finish on its own schedule.
          transition={reduced ? { duration: 0 } : { duration: 0.5, ease: EASE, delay: delay + i * 0.018 }}
        >
          {ch}
        </motion.span>
      ))}
    </span>
  );
}

/** Line-level reveal — same idea one level coarser, used for body copy where per-glyph is too busy. */
export function SplitLines({ lines, className }: { lines: string[]; className?: string }) {
  const reduced = useReducedMotion();
  return (
    <span className={className} aria-label={lines.join(" ")} role="text">
      {lines.map((line, i) => (
        <span key={line} aria-hidden className="block overflow-hidden">
          <motion.span
            className="block will-change-transform"
            initial={reduced ? false : { y: "1.1em", opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: EASE, delay: reduced ? 0 : i * 0.08 }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
