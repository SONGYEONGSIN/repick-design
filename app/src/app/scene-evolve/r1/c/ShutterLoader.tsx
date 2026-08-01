"use client";

import { motion } from "framer-motion";
import { EASE } from "./data";
import type { IntroPhase } from "./intro";
import Mark from "./Mark";

/**
 * The opening curtain — a shutter closing and opening once before the page is handed over.
 *
 * Nothing beneath it is faded. Lighthouse audits contrast at scroll 0, so a content layer sitting at
 * partial opacity there reads as a contrast failure; an opaque sheet *over* fully opaque content
 * leaves the audit seeing the settled page either way.
 *
 * It is `null` — not hidden, not at opacity 0 — the moment the phase flips. A finished curtain that
 * lingers is still a hit-test surface and still shows up in the accessibility tree. Under capture and
 * reduced motion it never mounts at all (see ./intro).
 */

/** Beats in seconds. The sum lands just inside INTRO_MS. */
const BEAT = { status: 0.5, roll: 0.68, fade: 0.9 };

export default function ShutterLoader({ phase }: { phase: IntroPhase }) {
  if (phase === "open") return null;

  return (
    <motion.div
      aria-hidden
      className="fixed inset-0 z-50 flex select-none items-center justify-center bg-[#010102]"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.32, ease: EASE, delay: BEAT.fade }}
    >
      <div className="flex flex-col items-center">
        <motion.div
          className="mb-10"
          initial={{ rotate: 0, scale: 0.86 }}
          animate={{ rotate: 60, scale: 1 }}
          transition={{ duration: 1.1, ease: EASE }}
        >
          <Mark className="h-12 w-12 text-white" />
        </motion.div>
        <span className="block overflow-hidden">
          <motion.span
            className="block text-[clamp(1.6rem,3.2vw,3rem)] font-normal tracking-[0.34em] text-white"
            initial={{ y: 0 }}
            animate={{ y: "-120%" }}
            transition={{ duration: 0.45, ease: EASE, delay: BEAT.roll }}
          >
            REFRAME
          </motion.span>
        </span>
      </div>

      <p className="absolute bottom-8 left-6 text-[clamp(0.7rem,0.8vw,1rem)] font-semibold uppercase tracking-[0.14em] text-white md:left-10">
        <span className="relative block overflow-hidden">
          <motion.span
            className="block"
            initial={{ y: 0 }}
            animate={{ y: "-100%" }}
            transition={{ duration: 0.28, ease: EASE, delay: BEAT.status }}
          >
            Metering
          </motion.span>
          <motion.span
            className="absolute inset-x-0 top-full block"
            initial={{ y: 0 }}
            animate={{ y: "-100%" }}
            transition={{ duration: 0.28, ease: EASE, delay: BEAT.status }}
          >
            Exposed
          </motion.span>
        </span>
      </p>
    </motion.div>
  );
}
