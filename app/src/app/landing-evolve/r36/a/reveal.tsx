"use client";

import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { useMounted } from "./use-mounted";
import { EASE } from "./tokens";

/**
 * Scroll-triggered entrance wrapper, used only BELOW the hero. Before hydration finishes this
 * renders a plain static element in the page's finished state -- no `initial` prop, no
 * `opacity:0` ships in server HTML. Only once `useMounted()` flips true does it swap to a real
 * `motion.div` with `initial`/`whileInView`, so the entrance plays once as it scrolls into view.
 * The hero itself never imports this component.
 */
interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "li";
  role?: string;
  "aria-label"?: string;
  "aria-live"?: "polite" | "off" | "assertive";
}

export function Reveal({ children, className, delay = 0, as = "div", ...rest }: RevealProps) {
  const mounted = useMounted();

  if (!mounted) {
    return as === "li" ? (
      <li className={className} {...rest}>
        {children}
      </li>
    ) : (
      <div className={className} {...rest}>
        {children}
      </div>
    );
  }

  if (as === "li") {
    return (
      <motion.li
        className={className}
        {...rest}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-72px" }}
        transition={{ duration: 0.5, ease: EASE, delay }}
      >
        {children}
      </motion.li>
    );
  }

  return (
    <motion.div
      className={className}
      {...rest}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-72px" }}
      transition={{ duration: 0.5, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}
