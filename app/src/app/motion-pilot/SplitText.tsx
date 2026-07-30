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
export function SplitChars({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  const reduced = useReducedMotion();
  const chars = Array.from(text);
  return (
    <span className={className} aria-label={text} role="text">
      {chars.map((ch, i) => (
        <motion.span
          key={`${ch}-${i}`}
          aria-hidden
          className="inline-block whitespace-pre will-change-transform"
          initial={reduced ? false : { opacity: 0, y: "0.45em" }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE, delay: reduced ? 0 : delay + i * 0.018 }}
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
