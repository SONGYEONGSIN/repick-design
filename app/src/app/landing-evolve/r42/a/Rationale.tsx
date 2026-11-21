"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useMounted } from "./useMounted";

/**
 * Crossfades the rationale paragraph in from a short upward slide whenever
 * `signature` changes (i.e. whenever any facet changes), so the sentence
 * visibly reassembles rather than silently swapping. The full text is
 * always present in the DOM — the animation never hides content behind a
 * literal opacity:0 once mounted, and reduced-motion / pre-hydration
 * viewers get the plain text with no animation at all.
 */
export default function Rationale({ signature, text }: { signature: string; text: string }) {
  const mounted = useMounted();
  const reduced = useReducedMotion();

  if (!mounted || reduced) {
    return (
      <p aria-live="polite" className="max-w-[520px] text-[17px] font-normal leading-[1.6] text-zinc-800">
        {text}
      </p>
    );
  }

  return (
    <div aria-live="polite" className="relative min-h-[6.5em] sm:min-h-[4.5em]">
      <AnimatePresence mode="wait">
        <motion.p
          key={signature}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          className="max-w-[520px] text-[17px] font-normal leading-[1.6] text-zinc-800"
        >
          {text}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
