"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Scroll-triggered entrance wrapper (renders a <div>). `initial` is set to
 * `false` (not an opacity:0 object) when reduced motion is requested, so the
 * element starts already at its resting, fully-visible state — never a
 * hydration race that could leave content stuck invisible. Transform/opacity
 * only, and every exit on this page is well under 250ms.
 */
export default function Reveal({
  children,
  delay = 0,
  className,
  ...rest
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
} & Omit<HTMLMotionProps<"div">, "children" | "initial" | "animate" | "transition">) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: reduce ? 0 : 0.5, delay: reduce ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
