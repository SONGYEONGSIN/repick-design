"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import type { CategoryId, Period, ResourceStatus, TeamId } from "./data";
import { CATEGORY_META, CATEGORY_ORDER, categoryTotal, resourceCost, resourcesForTeamAndCategory, teamTotal } from "./data";
import { formatCurrency, formatPercent } from "./format";
import { layoutTreemap, toneForRank } from "./treemap";
import { FOCUS_RING, StatusBadge } from "./ui";

type Tile = {
  id: string;
  label: string;
  value: number;
  meta?: { utilizationPct: number; status: ResourceStatus };
};

/**
 * The dominant visualization. At the top level each tile is a cost category; clicking one drills
 * into its resources (the tiles are replaced, not nested — a flat "navigate" drill, so there is
 * always exactly one squarified/slice-and-dice layout on screen). Clicking a drilled-in resource
 * tile pins it — that pin is read by a completely separate card elsewhere on the page and is never
 * reset by drilling back out, which is the point of keeping the two selections independent.
 *
 * Name + value are printed as real text on every tile, never only on hover — hovering or
 * focusing a tile additionally fills the inspector line below the grid with a couple of extra
 * stats, which is the one genuinely hover/keyboard-only layer here.
 */
export function CostTreemap({
  teamId,
  teamName,
  period,
  drillCategoryId,
  onDrill,
  onPinResource,
}: {
  teamId: TeamId;
  teamName: string;
  period: Period;
  drillCategoryId: CategoryId | null;
  onDrill: (categoryId: CategoryId | null) => void;
  onPinResource: (resourceId: string) => void;
}) {
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [focusId, setFocusId] = useState<string | null>(null);

  const drilled = drillCategoryId !== null;

  const tiles: Tile[] = drilled
    ? resourcesForTeamAndCategory(teamId, drillCategoryId)
        .map((r) => ({ id: r.id, label: r.name, value: resourceCost(r, period), meta: { utilizationPct: r.utilizationPct, status: r.status } }))
        .sort((a, b) => b.value - a.value)
    : CATEGORY_ORDER.map((id) => ({ id, label: CATEGORY_META[id].label, value: categoryTotal(teamId, id, period) })).sort((a, b) => b.value - a.value);

  const total = tiles.reduce((sum, t) => sum + t.value, 0);
  const rects = layoutTreemap(tiles.map((t) => ({ id: t.id, value: t.value })));
  const rectById = new Map(rects.map((r) => [r.id, r]));

  const activeId = focusId ?? hoverId ?? tiles[0]?.id ?? null;
  const activeTile = tiles.find((t) => t.id === activeId) ?? null;
  const activeShare = activeTile && total > 0 ? (activeTile.value / total) * 100 : 0;

  return (
    <div>
      <div className="flex min-w-0 flex-wrap items-center justify-between gap-2">
        {drilled ? (
          <button
            type="button"
            onClick={() => onDrill(null)}
            className={`flex h-8 items-center gap-1.5 rounded-md px-2 font-medium text-xs text-zinc-400 hover:bg-white/5 hover:text-zinc-50 ${FOCUS_RING}`}
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            All categories
          </button>
        ) : (
          <p className="font-normal text-xs text-zinc-400">Click a category to see its resources.</p>
        )}
        <p className="font-medium text-xs tabular-nums text-zinc-400">{formatCurrency(total)} shown</p>
      </div>

      <div className="relative mt-3 w-full aspect-[4/3] sm:aspect-[12/5]">
        {tiles.map((tile, index) => {
          const rect = rectById.get(tile.id);
          if (!rect) return null;
          const tone = toneForRank(index);
          return (
            <div
              key={tile.id}
              className="absolute"
              style={{ left: `${rect.xPct}%`, top: `${rect.yPct}%`, width: `${rect.wPct}%`, height: `${rect.hPct}%`, padding: "2px", boxSizing: "border-box" }}
            >
              <button
                type="button"
                onMouseEnter={() => setHoverId(tile.id)}
                onMouseLeave={() => setHoverId((cur) => (cur === tile.id ? null : cur))}
                onFocus={() => setFocusId(tile.id)}
                onBlur={() => setFocusId((cur) => (cur === tile.id ? null : cur))}
                onClick={() => (drilled ? onPinResource(tile.id) : onDrill(tile.id as CategoryId))}
                className={`flex h-full w-full flex-col items-start justify-between overflow-hidden rounded-md p-2 text-left ${tone.bg} ${FOCUS_RING}`}
              >
                <span className={`block w-full truncate font-medium text-[11px] sm:text-xs ${tone.text}`}>{tile.label}</span>
                <span className={`block w-full truncate font-semibold text-xs sm:text-sm tabular-nums ${tone.text}`}>{formatCurrency(tile.value)}</span>
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex min-w-0 flex-wrap items-center gap-2 rounded-lg border border-white/10 bg-zinc-950 px-3 py-2">
        {activeTile ? (
          <>
            <span className="min-w-0 flex-1 truncate font-medium text-sm text-zinc-50">{activeTile.label}</span>
            <span className="shrink-0 font-semibold text-sm tabular-nums text-amber-400">{formatCurrency(activeTile.value)}</span>
            <span className="shrink-0 font-normal text-xs tabular-nums text-zinc-400">
              {formatPercent(activeShare)} of {drillCategoryId !== null ? CATEGORY_META[drillCategoryId].label : teamName}
            </span>
            {activeTile.meta ? (
              <>
                <span className="shrink-0 font-normal text-xs tabular-nums text-zinc-400">{activeTile.meta.utilizationPct}% utilized</span>
                <StatusBadge status={activeTile.meta.status} className="shrink-0" />
              </>
            ) : null}
          </>
        ) : (
          <span className="font-normal text-sm text-zinc-400">No spend in this category.</span>
        )}
      </div>
    </div>
  );
}

/** Re-exported for the sibling breadcrumb/subtotal card, so it never re-derives this itself. */
export function drillSubtotal(teamId: TeamId, period: Period, drillCategoryId: CategoryId | null): number {
  return drillCategoryId === null ? teamTotal(teamId, period) : categoryTotal(teamId, drillCategoryId, period);
}
