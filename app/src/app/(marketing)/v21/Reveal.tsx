"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

/** Scroll-triggered entrance. Resting state (opacity 1, no offset) is identical to the animated
 * end-state, so a reduced-motion viewer who never gets the initial offset still sees a fully
 * visible element — never a permanently opacity:0 node. */
export function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={reduceMotion ? { duration: 0 } : { duration: 0.55, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
