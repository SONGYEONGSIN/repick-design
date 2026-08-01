"use client";

import { motion } from "framer-motion";
import { CLOSING, EASE } from "./data";
import type { IntroPhase } from "./intro";
import { MARK, MONO } from "./tokens";

/**
 * The opening curtain: a sweep of one revolution, the closing statement, and gone in 1.5 seconds.
 *
 * It renders nothing at all once the phase flips — not "hidden", absent. A finished sheet left at
 * opacity 0 still sits over the page as a hit-test surface and still shows up in the accessibility
 * tree. Under capture and reduced motion this component is never mounted in the first place (see
 * ./intro), which is what keeps the one-clock contract intact.
 *
 * Nothing beneath it is faded while it is up. Lighthouse audits contrast at scroll 0, so a faded
 * content layer there is a measured a11y failure; the curtain is an opaque sheet over fully opaque
 * content, and the audit sees the settled page either way.
 */

/** Beats in seconds. The last one lands just inside INTRO_MS. */
const BEAT = { status: 0.8, roll: 0.9, fade: 1.1 };

export default function Curtain({ phase }: { phase: IntroPhase }) {
  if (phase === "open") return null;

  return (
    <motion.div
      aria-hidden
      className="fixed inset-0 z-50 flex select-none items-center justify-center bg-[#010102]"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: EASE, delay: BEAT.fade }}
    >
      <div className="flex flex-col items-center">
        {/* One revolution of a second hand, drawn as an arc that closes. */}
        <svg viewBox="0 0 100 100" className="mb-14 h-16 w-16" fill="none">
          <circle cx="50" cy="50" r="38" stroke="#2A2A2E" strokeWidth="2" />
          <motion.circle
            cx="50"
            cy="50"
            r="38"
            stroke="#FF6A93"
            strokeWidth="2"
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
            strokeDasharray="239"
            initial={{ strokeDashoffset: 239 }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
          />
          <circle cx="50" cy="50" r="3" fill="#FFFFFF" />
        </svg>

        <p
          className="px-6 text-center text-[clamp(1.2rem,2.6vw,2.4rem)] font-light leading-[1.5] tracking-[-0.03em] text-white"
          style={MONO}
        >
          {CLOSING.map((line, i) => (
            // Each line gets its own mask so the roll-out clips at the baseline instead of sliding a
            // visible block past the one above it.
            <span key={line} className="block overflow-hidden">
              <motion.span
                className="block will-change-transform"
                initial={{ y: 0 }}
                animate={{ y: "-115%" }}
                transition={{ duration: 0.45, ease: EASE, delay: BEAT.roll + i * 0.07 }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </p>
      </div>

      <p className={`absolute bottom-8 left-6 text-white md:left-10 ${MARK}`} style={MONO}>
        <span className="relative block overflow-hidden">
          <motion.span
            className="block"
            initial={{ y: 0 }}
            animate={{ y: "-100%" }}
            transition={{ duration: 0.28, ease: EASE, delay: BEAT.status }}
          >
            Winding
          </motion.span>
          <motion.span
            className="absolute inset-x-0 top-full block"
            initial={{ y: 0 }}
            animate={{ y: "-100%" }}
            transition={{ duration: 0.28, ease: EASE, delay: BEAT.status }}
          >
            Ready
          </motion.span>
        </span>
      </p>
    </motion.div>
  );
}
