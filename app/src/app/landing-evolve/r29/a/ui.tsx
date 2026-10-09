"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { ScoredListing } from "./data";
import { ACCENT_FILL, FOCUS_RING } from "./tokens";

/** True only once this component has actually mounted on the client.
 *  useReducedMotion() alone returns a falsy value during SSR regardless of
 *  the visitor's real preference, so gating on it alone would still ship a
 *  literal opacity:0 in server-rendered / pre-hydration markup — a real bug
 *  from an earlier round. This hook is the fix: server snapshot is false,
 *  so SSR and the very first client render both paint the plain, fully
 *  visible element; only once mounted do reveal wrappers switch on. */
export function useMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export const SKIP_LINK =
  "sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-50 focus-visible:rounded-full focus-visible:bg-[#F4F4F5] focus-visible:px-4 focus-visible:py-2 focus-visible:text-sm focus-visible:font-semibold focus-visible:text-[#0B0B0F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14B8A6]";

/** Scroll reveal for below-fold content only — the hero's headline, sub,
 *  CTA and live widget are never wrapped in this, so first-fold proof is
 *  never at risk of an SSR opacity:0. */
export function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  const reduceMotion = useReducedMotion();
  const mounted = useMounted();

  if (!mounted || reduceMotion) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`text-[11px] font-semibold uppercase tracking-[0.28em] text-[#14B8A6] ${className}`}>
      {children}
    </p>
  );
}

export function PrimaryButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-base font-semibold text-white transition-transform motion-safe:hover:-translate-y-0.5 motion-reduce:transition-none ${FOCUS_RING}`}
      style={{ backgroundColor: ACCENT_FILL }}
    >
      {children}
      <ArrowRight className="h-4 w-4" aria-hidden="true" strokeWidth={2.5} />
    </a>
  );
}

// ---------------------------------------------------------------------------
// Ranking hook — the single source of "what moved since last time"

export type RankedListing = ScoredListing & { rank: number; delta: number };

/**
 * Attaches rank + rank-delta to a freshly sorted list. `sorted` only ever
 * changes identity when the dial weights change (it's produced by a
 * useMemo keyed on weights). The delta-annotated array lives in STATE,
 * recomputed inside a useEffect whenever `sorted` changes — refs must
 * never be read during render (that includes inside a useMemo callback,
 * which still executes synchronously during the render pass), so the
 * previous-order ref is only ever read here, inside the effect, which
 * runs after render/commit. The initial state (set once, at mount) gives
 * every listing a delta of 0 — there is no previous order to diff against
 * yet — so both the server render and the first client paint agree: no
 * hydration mismatch, and this is also the documented "no change on first
 * paint" behavior, not a bug.
 */
export function useRankDelta(sorted: ScoredListing[]): RankedListing[] {
  const prevOrderRef = useRef<Map<string, number> | null>(null);
  const [withDelta, setWithDelta] = useState<RankedListing[]>(() =>
    sorted.map((item, index) => ({ ...item, rank: index + 1, delta: 0 })),
  );

  useEffect(() => {
    const prevOrder = prevOrderRef.current;
    setWithDelta(
      sorted.map((item, index) => {
        const prevIndex = prevOrder?.get(item.id);
        const delta = prevIndex === undefined ? 0 : prevIndex - index;
        return { ...item, rank: index + 1, delta };
      }),
    );
    prevOrderRef.current = new Map(sorted.map((item, index) => [item.id, index]));
  }, [sorted]);

  return withDelta;
}
