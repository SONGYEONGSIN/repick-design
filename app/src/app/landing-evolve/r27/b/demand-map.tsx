"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Lock } from "lucide-react";
import {
  CATEGORY_POOL,
  LABEL_MIN_SHARE,
  MIN_SELECTED,
  formatDemand,
  pct,
  shareOf,
  summarizeSelection,
  type CategoryId,
} from "./data";
import { layoutTreemap } from "./treemap";

// Accent contrast math (full numbers + method in candidates/b.md):
//   #1E7A56 (fill)  — against #0B0B0F: 3.72:1 (large-text / border / filled-surface floor only).
//   White text directly on #1E7A56: 5.29:1 — clears small-text AA. Every tile fill below is this
//   same hue blended toward the page background at decreasing opacity per rank, which only ever
//   *lowers* its luminance — so white tile-label text is always >= 5.29:1, never less, across
//   every rank and every selection state. That's the self-audit this file's tile labels rely on
//   instead of a per-tile scrim, since no interactive/opened state here can ever drop below AA.
//   #7ED9AA (tint)  — against #0B0B0F: 11.59:1 — used for icons, small accent text, focus rings.
const ACCENT_FILL_RGB = "30, 122, 86";
const ACCENT_TINT = "#7ED9AA";
const RANK_OPACITY = [1, 0.88, 0.76, 0.64, 0.52, 0.42];

const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7ED9AA]";

function fillFor(id: CategoryId): string {
  const rank = CATEGORY_POOL.findIndex((c) => c.id === id);
  const opacity = RANK_OPACITY[rank] ?? 0.42;
  return `rgba(${ACCENT_FILL_RGB}, ${opacity})`;
}

export default function DemandMap({
  selected,
  onToggle,
  reduce,
}: {
  selected: Set<CategoryId>;
  onToggle: (id: CategoryId) => void;
  reduce: boolean;
}) {
  const { items: selectedCategories, total } = summarizeSelection(selected);
  const rects = layoutTreemap(selectedCategories.map((c) => ({ id: c.id, value: c.value })));
  const rectById = new Map(rects.map((r) => [r.id, r]));

  const tileTransition = reduce ? { duration: 0 } : { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <div>
      {/* The multi-select: freely add or remove any of the 6 categories from the fixed pool. */}
      <div
        role="group"
        aria-label="Choose which categories are included in your demand map"
        className="flex flex-wrap gap-2"
      >
        {CATEGORY_POOL.map((cat) => {
          const on = selected.has(cat.id);
          const isLastOne = on && selected.size <= MIN_SELECTED;
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              type="button"
              aria-pressed={on}
              aria-label={
                isLastOne
                  ? `${cat.label}, selected. At least one category must stay selected, so this one can't be removed right now.`
                  : `${cat.label}, ${on ? "included in" : "not in"} your demand map. ${formatDemand(cat.value)} in active demand available.`
              }
              onClick={() => onToggle(cat.id)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-[12px] font-semibold transition-colors ${FOCUS} ${
                on
                  ? "border-[#1E7A56] bg-[#1E7A56] text-white"
                  : "border-white/15 bg-white/[0.02] text-white hover:border-white/30 hover:bg-white/[0.06]"
              } ${isLastOne ? "opacity-90" : ""}`}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" style={{ color: on ? "#FFFFFF" : ACCENT_TINT }} />
              {cat.label}
              {isLastOne && <Lock className="h-3 w-3 shrink-0 text-white/70" aria-hidden="true" />}
            </button>
          );
        })}
      </div>

      {/* Live-updating summary, quoted verbatim (not restated) in the closing CTA below. */}
      {/* 14px text: 70 chars at this size is 70 x 0.44 x 14 = 431px (not the 493px used for 16px
          body copy elsewhere) — sizing this container from the 16px number would land near 80
          chars/line, over the 75-char ceiling. */}
      <p className="mt-5 max-w-[431px] text-[14px] leading-[1.6] text-zinc-400" aria-live="polite">
        <span className="font-semibold tabular-nums text-white">{selectedCategories.length}</span>{" "}
        of {CATEGORY_POOL.length} categories selected —{" "}
        <span className="font-semibold tabular-nums text-white">{formatDemand(total)}</span> in
        active demand mapped across them.
      </p>

      {/* Desktop / tablet: a real 2D treemap, area-subdivided by the recursive layout above. */}
      <div
        role="group"
        aria-label={`Demand map. ${selectedCategories.length} categories shown, sized by their share of ${formatDemand(total)} in active demand. Activate a tile to remove that category.`}
        className="relative mt-6 hidden w-full overflow-visible rounded-2xl border border-white/10 bg-white/[0.02] sm:block"
        style={{ aspectRatio: "16 / 9" }}
      >
        <AnimatePresence initial={false}>
          {selectedCategories.map((cat) => {
            const r = rectById.get(cat.id);
            if (!r) return null;
            const share = shareOf(cat.value, total);
            const showLabel = share >= LABEL_MIN_SHARE;
            const isLastOne = selected.size <= MIN_SELECTED;
            const Icon = cat.icon;
            return (
              <motion.button
                key={cat.id}
                type="button"
                layout={!reduce}
                layoutId={`tile-${cat.id}`}
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={tileTransition}
                onClick={() => onToggle(cat.id)}
                aria-label={
                  isLastOne
                    ? `${cat.label}. At least one category must stay selected, so this tile can't be removed right now.`
                    : `${cat.label}, ${formatDemand(cat.value)} in active demand, ${pct(share)} of your selected map. Activate to remove ${cat.label} from your demand map.`
                }
                className={`absolute box-border p-[3px] ${FOCUS}`}
                style={{ left: `${r.xPct}%`, top: `${r.yPct}%`, width: `${r.wPct}%`, height: `${r.hPct}%` }}
              >
                <span
                  className="flex h-full w-full flex-col items-start justify-between overflow-hidden rounded-xl border border-white/10 p-3 text-left"
                  style={{ backgroundColor: fillFor(cat.id) }}
                >
                  <Icon className="h-4 w-4 shrink-0 text-white" aria-hidden="true" />
                  {showLabel && (
                    <span className="min-w-0 max-w-full">
                      <span className="block truncate text-[12px] font-semibold text-white">
                        {cat.label}
                      </span>
                      <span className="block truncate text-[11px] tabular-nums text-white/85">
                        {formatDemand(cat.value)} · {pct(share)}
                      </span>
                    </span>
                  )}
                </span>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Mobile: the same values, re-subdivided as stacked full-width rows (height, not a 2D
          grid, carries the area) — avoids forcing unreadable slivers at narrow widths. */}
      <div
        role="group"
        aria-label={`Demand map. ${selectedCategories.length} categories shown, sized by their share of ${formatDemand(total)} in active demand. Activate a row to remove that category.`}
        className="mt-6 flex w-full flex-col gap-[3px] rounded-2xl border border-white/10 bg-white/[0.02] p-[3px] sm:hidden"
        style={{ height: "420px" }}
      >
        <AnimatePresence initial={false}>
          {selectedCategories.map((cat) => {
            const share = shareOf(cat.value, total);
            const isLastOne = selected.size <= MIN_SELECTED;
            const Icon = cat.icon;
            return (
              <motion.button
                key={cat.id}
                type="button"
                layout={!reduce}
                layoutId={`row-${cat.id}`}
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={tileTransition}
                onClick={() => onToggle(cat.id)}
                aria-label={
                  isLastOne
                    ? `${cat.label}. At least one category must stay selected, so this row can't be removed right now.`
                    : `${cat.label}, ${formatDemand(cat.value)} in active demand, ${pct(share)} of your selected map. Activate to remove ${cat.label} from your demand map.`
                }
                className={`flex min-w-0 items-center justify-between gap-3 rounded-xl border border-white/10 px-3.5 text-left ${FOCUS}`}
                style={{ flexGrow: cat.value, flexBasis: 0, backgroundColor: fillFor(cat.id) }}
              >
                <span className="flex min-w-0 items-center gap-2">
                  <Icon className="h-4 w-4 shrink-0 text-white" aria-hidden="true" />
                  <span className="truncate text-[13px] font-semibold text-white">{cat.label}</span>
                </span>
                <span className="shrink-0 text-[12px] tabular-nums text-white/85">
                  {formatDemand(cat.value)} · {pct(share)}
                </span>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Always-visible legend, structured as a flat dl>div>(dt,dd) so the icon stays inside the
          dt rather than a sibling before a wrapping element — keeps axe's dlitem check passing.
          This also serves as the treemap's text alternative: every value the tiles show, restated. */}
      <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
        {selectedCategories.map((cat) => {
          const share = shareOf(cat.value, total);
          const Icon = cat.icon;
          return (
            <div key={cat.id} className="min-w-0">
              <dt className="flex items-center gap-1.5 text-[12px] font-semibold text-white">
                <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" style={{ color: ACCENT_TINT }} />
                <span className="truncate">{cat.label}</span>
              </dt>
              <dd className="mt-1 truncate text-[12px] tabular-nums text-zinc-400">
                {formatDemand(cat.value)} · {pct(share)} of selected demand
              </dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
}
