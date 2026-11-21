"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Trophy } from "lucide-react";
import type { RankedItem } from "./rank-model";
import type { Listing } from "./data";
import { ACCENT_FILL, ACCENT_TEXT, ACCENT_TINT_BG, BORDER, INK, MUTED } from "./tokens";

/**
 * The hero's live "top matches" mini scoreboard. `ranked` is recomputed
 * upstream from the SAME `rankItems`/`computeMatchScore` pair that the
 * Priority Ladder's weights feed — this component only renders the result,
 * it never re-derives a score of its own. Rows carry `layout`, so a reorder
 * animates rows sliding to their new position (transform-only) instead of
 * the list silently jumping — this is the "live re-sorting" interaction the
 * brief calls out as its own distinct piece of motion.
 */
export default function MatchBoard({ ranked }: { ranked: RankedItem<Listing>[] }) {
  const reduce = useReducedMotion();
  const top = ranked[0];
  return (
    <div>
      <p className="flex items-center gap-1.5 text-[12px] font-semibold uppercase" style={{ color: ACCENT_TEXT, letterSpacing: "0.22em" }}>
        <Trophy className="h-3.5 w-3.5" aria-hidden="true" />
        Top matches right now
      </p>
      {/* Concise live region — announces only the result of a re-sort
          (the new top match), derived from the same `ranked` the rows
          below render, rather than re-reading all four rows on every move. */}
      <p className="sr-only" role="status" aria-live="polite">
        Top match: {top.item.title} at {top.score}%.
      </p>
      <ol className="mt-3 flex flex-col gap-2">
        {ranked.map(({ item, score, place }) => (
          <motion.li
            key={item.id}
            layout
            transition={{ duration: reduce ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-3 rounded-xl p-2.5"
            style={{
              backgroundColor: place === 1 ? ACCENT_TINT_BG : "#FFFFFF",
              border: `1px solid ${BORDER}`,
            }}
          >
            <span
              aria-hidden="true"
              className="tabular-nums flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold"
              style={{ backgroundColor: place === 1 ? ACCENT_FILL : "#F4F4F5", color: place === 1 ? "#FFFFFF" : INK }}
            >
              {place}
            </span>
            <span className="min-w-0 flex-1 truncate text-[13.5px] font-semibold" style={{ color: INK }}>
              {item.title}
            </span>
            <span className="tabular-nums shrink-0 text-[13.5px] font-semibold" style={{ color: place === 1 ? ACCENT_TEXT : MUTED }}>
              {score}%
            </span>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}
