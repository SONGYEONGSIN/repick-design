"use client";

/**
 * The dashboard's single dominant visualization: a five-stage, vertically
 * shrinking conversion funnel (visitor -> signup -> activated -> paid ->
 * retained). This is deliberately NOT a Sankey or node-link diagram — each
 * stage is one discrete horizontal band and every edge between adjacent
 * bands is a real, printed drop-off percentage.
 *
 * Interaction model (kept intentionally narrow, see the pin comment below):
 * - Hover OR keyboard focus on a stage reveals a small supplementary tooltip
 *   (cumulative conversion from the very first stage + the absolute number
 *   of users lost at that step). This is genuinely supplementary: the count
 *   and the stage-over-stage drop-off percentage are ALREADY printed as
 *   always-visible text in the stats column, at rest, with no interaction
 *   required — the tooltip only adds precision, it is never the only place
 *   a number appears.
 * - Clicking (or pressing Enter/Space on) a stage pins it. The pinned stage
 *   id is the ONLY thing this component reports to its parent via `onPin`.
 *
 * Geometry: every band is an SVG polygon whose two top corners and two
 * bottom corners are computed from a fixed width-ratio formula applied to
 * this stage's count and the next stage's count (see `widthRatio` /
 * `bandPoints`). All coordinates are rounded to 2 decimal places before
 * being written into the `points` attribute, so server and client render
 * byte-identical markup.
 */

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Globe, UserPlus, Zap, CreditCard, Repeat, Pin } from "lucide-react";
import {
  deriveFunnel,
  formatCount,
  formatPct,
  formatSignedCount,
  type FunnelStage,
  type StageId,
} from "./data";

const BAR_WIDTH = 500;
const BAR_HEIGHT = 64;
const MIN_RATIO = 0.24;

const STAGE_ICON: Record<StageId, typeof Globe> = {
  visitor: Globe,
  signup: UserPlus,
  activated: Zap,
  paid: CreditCard,
  retained: Repeat,
};

function widthRatio(count: number, maxCount: number): number {
  if (maxCount <= 0) return MIN_RATIO;
  return MIN_RATIO + (1 - MIN_RATIO) * (count / maxCount);
}

/** Returns a rounded-to-2-decimals SVG `points` string for one trapezoid
 *  band. `nextCount` is null for the terminal stage, which renders as a
 *  plain rectangle rather than inventing a fake taper. */
function bandPoints(count: number, nextCount: number | null, maxCount: number): string {
  const topW = widthRatio(count, maxCount) * BAR_WIDTH;
  const bottomW = nextCount === null ? topW : widthRatio(nextCount, maxCount) * BAR_WIDTH;
  const cx = BAR_WIDTH / 2;
  const topY = 2;
  const bottomY = BAR_HEIGHT - 2;
  const pts: [number, number][] = [
    [cx - topW / 2, topY],
    [cx + topW / 2, topY],
    [cx + bottomW / 2, bottomY],
    [cx - bottomW / 2, bottomY],
  ];
  return pts.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(" ");
}

export function Funnel({
  stages,
  pinnedStage,
  onPin,
}: {
  stages: FunnelStage[];
  pinnedStage: StageId;
  onPin: (id: StageId) => void;
}) {
  const derived = deriveFunnel(stages);
  const maxCount = stages[0]?.count ?? 0;
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const reduceMotion = useReducedMotion();

  return (
    <div role="group" aria-label="Conversion funnel stages" className="flex flex-col gap-3">
      {derived.map((stage, i) => {
        const Icon = STAGE_ICON[stage.id];
        const pinned = stage.id === pinnedStage;
        const isFirst = i === 0;

        return (
          <div key={stage.id} className="relative">
            {/*
              No `aria-label` override here on purpose: the button already carries
              visible text (stage name, count, drop-off/"top of funnel"), and
              `aria-pressed` already announces pin state. Pairing visible text with
              a *different* custom aria-label risks WCAG 2.5.3 "Label in Name"
              mismatches; instead the extra context a sighted user gets for free
              (relative position in the list, the previous stage's name) is added
              as genuine `sr-only` text INSIDE the natural reading order below, so
              the accessible name is simply the real content, nothing invented.
            */}
            <button
              type="button"
              aria-pressed={pinned}
              onClick={() => onPin(stage.id)}
              onMouseEnter={() => setActiveIndex(i)}
              onMouseLeave={() => setActiveIndex((cur) => (cur === i ? null : cur))}
              onFocus={() => setActiveIndex(i)}
              onBlur={() => setActiveIndex((cur) => (cur === i ? null : cur))}
              className={`grid w-full grid-cols-1 items-center gap-2 rounded-lg border px-3 py-3 text-left transition-colors motion-reduce:transition-none sm:grid-cols-[152px_1fr_184px] sm:gap-4 sm:py-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400 ${
                pinned
                  ? "border-violet-400/40 bg-violet-500/[0.08]"
                  : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
              }`}
            >
              {/* label column */}
              <span className="flex min-w-0 items-center gap-2">
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${
                    pinned ? "bg-violet-500/20 text-violet-200" : "bg-white/5 text-zinc-400"
                  }`}
                >
                  <Icon className="h-4 w-4" aria-hidden />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium text-zinc-50">{stage.label}</span>
                  {pinned ? (
                    <span className="flex items-center gap-1 text-[11px] font-medium text-violet-300">
                      <Pin className="h-3 w-3" aria-hidden />
                      Pinned
                    </span>
                  ) : null}
                </span>
              </span>

              {/* bar column — decorative SVG, all real values are the siblings */}
              <span className="block min-w-0">
                <svg
                  viewBox={`0 0 ${BAR_WIDTH} ${BAR_HEIGHT}`}
                  className="h-10 w-full sm:h-12"
                  aria-hidden="true"
                  preserveAspectRatio="none"
                >
                  <polygon
                    points={bandPoints(stage.count, derived[i + 1]?.count ?? null, maxCount)}
                    className={pinned ? "fill-violet-500/25 stroke-violet-400" : "fill-white/5 stroke-white/15"}
                    strokeWidth={1.5}
                  />
                </svg>
              </span>

              {/* stats column — ALWAYS-VISIBLE text, never hover-gated */}
              <span className="flex items-center justify-between gap-3 sm:flex-col sm:items-end sm:justify-center sm:gap-0.5">
                <span className="text-lg font-bold tabular-nums text-zinc-50 sm:text-xl">
                  {formatCount(stage.count)}
                </span>
                {isFirst ? (
                  <span className="text-[11px] font-medium uppercase tracking-[0.06em] text-zinc-400">
                    Top of funnel
                  </span>
                ) : (
                  <span className="text-xs font-medium tabular-nums text-rose-300">
                    {formatPct(stage.dropPct ?? 0)} drop
                    <span className="sr-only"> from {derived[i - 1].label}</span>
                  </span>
                )}
              </span>
            </button>

            <AnimatePresence>
              {activeIndex === i ? (
                <motion.div
                  role="status"
                  initial={reduceMotion ? false : { opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -4 }}
                  transition={{ duration: reduceMotion ? 0 : 0.14, ease: "easeOut" }}
                  className="absolute left-3 top-full z-20 mt-1.5 w-72 max-w-[calc(100vw-2.5rem)] rounded-lg border border-white/10 bg-zinc-800 px-3 py-2.5 text-xs shadow-xl shadow-black/40 sm:left-[172px]"
                >
                  <p className="font-medium text-zinc-100">{stage.label}</p>
                  <dl className="mt-1.5 grid grid-cols-2 gap-x-3 gap-y-1">
                    <dt className="text-zinc-400">Cumulative from Visitors</dt>
                    <dd className="text-right tabular-nums text-zinc-200">{formatPct(stage.cumulativePct)}</dd>
                    {!isFirst ? (
                      <>
                        <dt className="text-zinc-400">Lost vs. {derived[i - 1].label}</dt>
                        <dd className="text-right tabular-nums text-rose-300">
                          {formatSignedCount(-(stage.dropCount ?? 0))}
                        </dd>
                      </>
                    ) : (
                      <>
                        <dt className="text-zinc-400">Role</dt>
                        <dd className="text-right text-zinc-200">Starting cohort</dd>
                      </>
                    )}
                  </dl>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
