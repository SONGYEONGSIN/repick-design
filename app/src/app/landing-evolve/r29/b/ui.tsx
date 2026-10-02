"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { ACCENT_DEEP, DISPLAY, FOCUS_RING, INK } from "./tokens";

/** Hydration-aware mount check. useReducedMotion() alone returns a falsy value during
 *  SSR regardless of the visitor's real preference, which would ship literal
 *  opacity:0 markup to no-JS and slow-hydration visitors if wired straight into a
 *  motion.div's `initial`. useSyncExternalStore's getSnapshot is allowed to differ
 *  from getServerSnapshot by design — the sanctioned way to read "have we hydrated
 *  yet" without a setState-in-effect cascade. */
function useMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const mounted = useMounted();
  const reduceMotion = useReducedMotion();

  if (!mounted || reduceMotion) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function Eyebrow({ children, tone = "accent" }: { children: ReactNode; tone?: "accent" | "muted" }) {
  return (
    <p
      className="text-[11px] font-semibold uppercase tracking-[0.28em]"
      style={{ color: tone === "accent" ? ACCENT_DEEP : "#52525B" }}
    >
      {children}
    </p>
  );
}

export function PrimaryButton({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-[15px] font-semibold text-white transition-transform motion-safe:hover:-translate-y-0.5 motion-reduce:transition-none ${FOCUS_RING} ${className}`}
      style={{ backgroundColor: ACCENT_DEEP }}
    >
      {children}
      <ArrowRight className="h-4 w-4" aria-hidden="true" strokeWidth={2.5} />
    </a>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2
        className="mt-3 text-[clamp(1.75rem,1.45rem+1.3vw,2.5rem)] font-extrabold tracking-[-0.02em]"
        style={{ ...DISPLAY, color: INK }}
      >
        {title}
      </h2>
      {children}
    </div>
  );
}

export const SKIP_LINK =
  "sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-50 focus-visible:rounded-full focus-visible:bg-[#15171B] focus-visible:px-4 focus-visible:py-2 focus-visible:text-sm focus-visible:font-semibold focus-visible:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#047857]";
