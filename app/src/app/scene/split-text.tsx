"use client";

import { motion } from "framer-motion";
import { EASE } from "./data";

/**
 * Character-level stagger with the accessibility part that display-type sites usually drop.
 *
 * The visible glyph spans are `aria-hidden` and the real sentence is carried by a single `sr-only`
 * copy, so a screen reader reads the line rather than the alphabet. (An `aria-label` on the wrapper
 * would need `role="text"` to be honoured, and that role is not in the ARIA specification an audit
 * validates against — the hidden text costs nothing and is unambiguous.)
 *
 * `still` is the page-wide settled flag: under `prefers-reduced-motion` or capture, every glyph
 * renders at its final state with no transition at all. It gates *above* the reveal, not behind it —
 * holding the animation on a mount flag alone means a reduced-motion visitor still watches it run,
 * and it makes the frame depend on when hydration happened to land.
 */
export function SplitChars({ text, delay = 0, still }: { text: string; delay?: number; still: boolean }) {
  const chars = Array.from(text);
  return (
    <span className="inline-block">
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {chars.map((ch, i) => (
          <motion.span
            key={`${ch}-${i}`}
            className="inline-block whitespace-pre will-change-transform"
            initial={still ? false : { opacity: 0, y: "0.4em" }}
            animate={{ opacity: 1, y: 0 }}
            // duration 0 rather than a short one: if `still` resolves after the first client render,
            // an in-flight transition has to snap rather than finish on its own schedule.
            transition={still ? { duration: 0 } : { duration: 0.5, ease: EASE, delay: delay + i * 0.02 }}
          >
            {ch}
          </motion.span>
        ))}
      </span>
    </span>
  );
}

/** The same idea one level coarser, for copy where per-glyph would be busy. */
export function SplitLines({ lines, still }: { lines: string[]; still: boolean }) {
  return (
    <span>
      <span className="sr-only">{lines.join(" ")}</span>
      <span aria-hidden="true">
        {lines.map((line, i) => (
          <span key={line} className="block overflow-hidden">
            <motion.span
              className="block will-change-transform"
              initial={still ? false : { y: "1.05em", opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={still ? { duration: 0 } : { duration: 0.6, ease: EASE, delay: i * 0.08 }}
            >
              {line}
            </motion.span>
          </span>
        ))}
      </span>
    </span>
  );
}
