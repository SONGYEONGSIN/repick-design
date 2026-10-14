"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { BreakdownRow } from "./payout-math";
import { ACCENT, ACCENT_DEEP, ACCENT_TINT } from "./theme";

const SEGMENT_COLOR: Record<string, string> = {
  electronics: ACCENT,
  fashion: ACCENT_TINT,
  home: ACCENT_DEEP,
};

/** Dark ink text reads AA on ACCENT/ACCENT_TINT (7.09:1 / 11.78:1); white reads fine on the deep tint. */
const SEGMENT_TEXT_ON_SWATCH: Record<string, string> = {
  electronics: "#0B0B0F",
  fashion: "#0B0B0F",
  home: "#FFFFFF",
};

interface StackedBarProps {
  rows: BreakdownRow[];
  totalPayout: number;
}

/**
 * Horizontal stacked bar for the category mix — the share of the running
 * payout total each category contributes. Purely derived from `rows`, so
 * it redraws deterministically every time a stepper changes a count; no
 * state of its own. Segment color is paired with a text legend below (not
 * color alone), satisfying the color+text pairing rule.
 */
export default function StackedBar({ rows, totalPayout }: StackedBarProps) {
  const reduced = useReducedMotion();
  const active = rows.filter((row) => row.count > 0 && row.payout > 0);

  if (totalPayout <= 0 || active.length === 0) {
    return (
      <div>
        <div className="h-3 w-full overflow-hidden rounded-full border border-white/10 bg-white/[0.04]" />
        <p className="mt-3 text-sm text-zinc-400">
          Move a counter above to zero to see your category mix here.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div
        role="img"
        aria-label={`Payout mix: ${active
          .map((row) => `${row.label} ${row.sharePct}%`)
          .join(", ")}`}
        className="flex h-3 w-full overflow-hidden rounded-full border border-white/10"
      >
        {active.map((row) => (
          <motion.div
            key={row.id}
            className="h-full"
            style={{ backgroundColor: SEGMENT_COLOR[row.id] }}
            initial={false}
            animate={{ width: `${row.sharePct}%` }}
            transition={{ duration: reduced ? 0 : 0.4, ease: "easeOut" }}
          />
        ))}
      </div>

      <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
        {active.map((row) => (
          <li key={row.id} className="flex items-center gap-2 text-sm text-zinc-300">
            <span
              aria-hidden="true"
              className="flex h-4 w-4 items-center justify-center rounded-sm text-[9px] font-bold"
              style={{ backgroundColor: SEGMENT_COLOR[row.id], color: SEGMENT_TEXT_ON_SWATCH[row.id] }}
            />
            <span className="font-semibold text-white">{row.label}</span>
            <span className="tabular-nums text-zinc-400">{row.sharePct}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
