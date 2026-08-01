"use client";

import { motion, useReducedMotion } from "framer-motion";
import { EASE } from "./data";

/**
 * Per-character rise for the headline.
 *
 * The glyph fragments are all `aria-hidden`; the accessible name is supplied by an `aria-label` on
 * the heading element that wraps them, so a screen reader gets the sentence rather than the
 * alphabet. Labelling the heading itself avoids inventing a role for a wrapper span.
 *
 * Reduced motion outranks the curtain gate. Holding these on `start` alone would make them *animate*
 * when the curtain lifts under a setting that asks for no animation, and it would make the frame
 * time-dependent: hydration lands behind WebGL setup, so a capture can arrive mid-fade.
 */
export function CharRise({ text, delay = 0, start = true }: { text: string; delay?: number; start?: boolean }) {
  const reduced = useReducedMotion();
  const settled = reduced || start;
  return (
    <>
      {Array.from(text).map((ch, i) => (
        <motion.span
          key={`${ch}-${i}`}
          aria-hidden
          className="inline-block whitespace-pre will-change-transform"
          initial={reduced ? false : { opacity: 0, y: "0.4em" }}
          animate={settled ? { opacity: 1, y: 0 } : { opacity: 0, y: "0.4em" }}
          // Duration 0 rather than a short one: if `reduced` resolves after the first client render,
          // an in-flight transition has to snap rather than finish on its own schedule.
          transition={reduced ? { duration: 0 } : { duration: 0.5, ease: EASE, delay: delay + i * 0.016 }}
        >
          {ch}
        </motion.span>
      ))}
    </>
  );
}

/**
 * Line-level rise, used where per-glyph would be too busy. The text stays in the accessibility tree
 * as ordinary content — only the transform is decorative — so no labelling workaround is needed.
 */
export function LineRise({ lines, className }: { lines: string[]; className?: string }) {
  const reduced = useReducedMotion();
  return (
    <span className={className}>
      {lines.map((line, i) => (
        <span key={line} className="block overflow-hidden">
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
