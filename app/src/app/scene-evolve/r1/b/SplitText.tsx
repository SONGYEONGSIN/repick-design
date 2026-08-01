"use client";

import { motion, useReducedMotion } from "framer-motion";
import { EASE } from "./data";

/**
 * Character-level stagger with the accessibility fix this technique usually skips: the visible glyph
 * spans are `aria-hidden` and the accessible name is carried once by the wrapper, so a screen reader
 * reads the sentence rather than the alphabet.
 *
 * Reduced motion outranks the curtain gate. Holding `animate` on `start` alone means the element
 * sits at opacity 0 and then really animates when the curtain lifts — a transition under a setting
 * that asked for none — and it makes the frame time-dependent, because hydration lands behind WebGL
 * setup by a margin that varies. Settling immediately removes both.
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
  start?: boolean;
}) {
  const reduced = useReducedMotion();
  const settled = reduced || start;
  return (
    <span className={className} aria-label={text} role="text">
      {Array.from(text).map((ch, i) => (
        <motion.span
          key={`${ch}-${i}`}
          aria-hidden
          className="inline-block whitespace-pre will-change-transform"
          initial={reduced ? false : { opacity: 0, y: "0.4em" }}
          animate={settled ? { opacity: 1, y: 0 } : { opacity: 0, y: "0.4em" }}
          // duration 0 rather than a short one: if `reduced` resolves after the first client render,
          // an in-flight fade has to snap rather than finish on its own schedule.
          transition={reduced ? { duration: 0 } : { duration: 0.5, ease: EASE, delay: delay + i * 0.02 }}
        >
          {ch}
        </motion.span>
      ))}
    </span>
  );
}

/** Line-level reveal — the same idea one level coarser, for copy where per-glyph is too busy. */
export function SplitLines({ lines, className }: { lines: string[]; className?: string }) {
  const reduced = useReducedMotion();
  return (
    <span className={className} aria-label={lines.join(" ")} role="text">
      {lines.map((line, i) => (
        <span key={line} aria-hidden className="block overflow-hidden">
          <motion.span
            className="block will-change-transform"
            initial={reduced ? false : { y: "1.05em", opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={reduced ? { duration: 0 } : { duration: 0.6, ease: EASE, delay: i * 0.08 }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
