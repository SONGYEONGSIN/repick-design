"use client";

import { motion } from "framer-motion";
import { CLOSING, EASE } from "./data";
import type { IntroPhase } from "./intro";

/**
 * The opening curtain — black, centred, and gone in under two seconds.
 *
 * Built from a measurement of the reference's own loader rather than by eye: a four-square spinner
 * above a two-line statement, a status word pinned to the bottom-left that flips LOADING → COMPLETED,
 * and an exit that rolls the statement upward line by line before the sheet itself fades.
 *
 * The statement is deliberately the same copy the footer closes on. The reference does this too, and
 * it is the cheapest structural trick on the page: the sentence you wait on at the door is the one
 * you leave by, so the visit reads as a loop rather than a scroll to the bottom.
 *
 * Nothing under this sheet is faded. §3 of `brief-scene.md` records the measured reason — Lighthouse
 * audits contrast at scroll 0, and a faded content layer there cost a11y 100 → 95. The curtain is an
 * opaque layer *over* fully-opaque content, so the audit sees the settled page either way.
 */

const SQUARES = [
  { x: -13, y: -13 },
  { x: 13, y: -13 },
  { x: -13, y: 13 },
  { x: 13, y: 13 },
];

/** Beats within the curtain, in seconds. The sum lands just under `INTRO_MS`. */
const BEAT = { status: 1.15, roll: 1.3, fade: 1.5 };

export default function SiteLoader({ phase }: { phase: IntroPhase }) {
  // Not "hidden when revealed" — *absent*. A finished curtain that lingers at opacity 0 still sits
  // over the page as a hit-test surface and still shows up in the accessibility tree.
  if (phase === "reveal") return null;

  return (
    <motion.div
      aria-hidden
      className="fixed inset-0 z-50 flex select-none items-center justify-center bg-black"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: EASE, delay: BEAT.fade }}
    >
      <div className="flex flex-col items-center">
        <motion.div
          className="relative mb-16 h-14 w-14"
          animate={{ rotate: 360 }}
          transition={{ duration: 2.4, ease: "linear", repeat: Infinity }}
        >
          {SQUARES.map((s) => (
            <span
              key={`${s.x},${s.y}`}
              className="absolute left-1/2 top-1/2 h-2 w-2 bg-white"
              style={{ transform: `translate(-50%,-50%) translate(${s.x}px, ${s.y}px) rotate(45deg)` }}
            />
          ))}
        </motion.div>

        <p className="px-6 text-center text-[clamp(1.4rem,2.917vw,3.4rem)] font-normal leading-[1.857] tracking-[-0.04em]">
          {CLOSING.map((line, i) => (
            // Each line gets its own overflow-hidden mask so the roll-out clips at the baseline
            // instead of sliding a visible block past the one above it.
            <span key={line} className="block overflow-hidden">
              <motion.span
                className="block will-change-transform"
                initial={{ y: 0 }}
                animate={{ y: "-115%" }}
                transition={{ duration: 0.5, ease: EASE, delay: BEAT.roll + i * 0.08 }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </p>
      </div>

      <p className="absolute bottom-8 left-6 text-[clamp(0.8rem,1.042vw,1.3rem)] font-semibold uppercase tracking-[0.025em] md:left-10">
        <span className="relative block overflow-hidden">
          <motion.span
            className="block"
            initial={{ y: 0 }}
            animate={{ y: "-100%" }}
            transition={{ duration: 0.3, ease: EASE, delay: BEAT.status }}
          >
            Loading…
          </motion.span>
          <motion.span
            className="absolute inset-x-0 top-full block"
            initial={{ y: 0 }}
            animate={{ y: "-100%" }}
            transition={{ duration: 0.3, ease: EASE, delay: BEAT.status }}
          >
            Completed
          </motion.span>
        </span>
      </p>
    </motion.div>
  );
}
