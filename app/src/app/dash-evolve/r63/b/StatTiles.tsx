"use client";

import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import { Flag, CheckCircle2, PauseCircle, RotateCcw, Clock, UserCheck } from "lucide-react";
import {
  ACTIVE_FLAGS,
  PAUSED_FLAGS,
  FLAGS_AT_FULL,
  ROLLBACK_EVENTS_THIS_MONTH,
  AVG_DAYS_TO_FULL,
  ENROLLED_ACTIVE_TOTAL,
  FLAG_BY_ID,
  SPOTLIGHT_FLAG_ID,
  fmtCompact,
} from "./data";
import { Card, FOCUS_RING, NUM } from "./ui";

type Tile = { id: string; icon: LucideIcon; label: string; value: string; sub: string };

const TILES: Tile[] = [
  { id: "active", icon: Flag, label: "Active flags", value: String(ACTIVE_FLAGS.length), sub: "currently rolling out" },
  { id: "full", icon: CheckCircle2, label: "Flags at 100%", value: String(FLAGS_AT_FULL), sub: "fully rolled out" },
  { id: "paused", icon: PauseCircle, label: "Flags paused", value: String(PAUSED_FLAGS.length), sub: "awaiting resume" },
  { id: "rollback", icon: RotateCcw, label: "Rollback events", value: String(ROLLBACK_EVENTS_THIS_MONTH), sub: "this month" },
  { id: "ttf", icon: Clock, label: "Avg. time to 100%", value: `${AVG_DAYS_TO_FULL}d`, sub: "across completed flags" },
  { id: "enrolled", icon: UserCheck, label: "Users enrolled", value: fmtCompact(ENROLLED_ACTIVE_TOTAL), sub: "across active flags" },
];

function StatCard({ tile }: { tile: Tile }) {
  const Icon = tile.icon;
  return (
    <Card className="flex min-w-0 flex-col">
      <div className="flex min-w-0 items-center gap-1.5">
        <Icon className="h-3.5 w-3.5 shrink-0 text-zinc-500" aria-hidden="true" />
        <span className="min-w-0 truncate text-[11px] font-medium uppercase tracking-wide text-zinc-500">{tile.label}</span>
      </div>
      <span className={`mt-1.5 text-2xl font-semibold text-zinc-900 ${NUM}`}>{tile.value}</span>
      <span className="mt-1 truncate text-xs text-zinc-500">{tile.sub}</span>
    </Card>
  );
}

const WAFFLE_SIZE = 10;
const WAFFLE_CELLS = WAFFLE_SIZE * WAFFLE_SIZE;

/**
 * The one supporting visualization allowed inside a tile: a 10x10 waffle grid for a single
 * spotlighted flag's rollout percentage. It carries its own fully independent hover/focus
 * "inspector" state — a tier-3 scope that touches nothing else on the page (not the hero, not the
 * stat tiles beside it, not the flag table's row-click selection below). The inspector caption is
 * ONE shared `aria-live` element for the whole grid, not a per-cell floating tooltip. A collapsible
 * table fallback is included because a waffle grid is a C-grade chart type.
 */
export function WaffleTile({ className = "" }: { className?: string }) {
  const flag = FLAG_BY_ID.get(SPOTLIGHT_FLAG_ID)!;
  const filled = Math.max(0, Math.min(100, Math.round(flag.rolloutPct)));

  const [hovering, setHovering] = useState(false);
  const [pinned, setPinned] = useState(false);
  const inspecting = hovering || pinned;

  return (
    <Card className={`flex min-w-0 flex-col ${className}`}>
      <div className="flex min-w-0 items-start justify-between gap-2">
        <div className="min-w-0">
          <span className="block truncate text-[11px] font-medium uppercase tracking-wide text-zinc-500">Rollout spotlight</span>
          <span className="block truncate text-sm font-medium text-zinc-900">{flag.name}</span>
        </div>
        <span className={`shrink-0 text-xl font-semibold text-zinc-900 ${NUM}`}>{filled}%</span>
      </div>

      <div className="mt-3 flex min-w-0 items-start gap-4">
        <button
          type="button"
          aria-pressed={pinned}
          aria-label={`Inspect the ${flag.name} rollout grid: ${filled} of ${WAFFLE_CELLS} cells filled`}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          onFocus={() => setHovering(true)}
          onBlur={() => setHovering(false)}
          onClick={() => setPinned((p) => !p)}
          className={`grid shrink-0 grid-cols-10 gap-[2px] rounded-md p-1 ${FOCUS_RING}`}
        >
          {Array.from({ length: WAFFLE_CELLS }, (_, i) => (
            <span
              key={i}
              aria-hidden="true"
              className={`h-[7px] w-[7px] rounded-[1px] ${
                i < filled ? (inspecting ? "bg-lime-700" : "bg-lime-600") : "bg-zinc-100"
              }`}
            />
          ))}
        </button>

        <div className="min-w-0 flex-1">
          <p aria-live="polite" className="text-xs text-zinc-600">
            {inspecting
              ? `${filled} of ${WAFFLE_CELLS} cells filled — ${flag.name} is enrolled for ${filled}% of its eligible users.`
              : "Hover or focus the grid to inspect this flag's fill."}
          </p>
          <details className="mt-2">
            <summary className="cursor-pointer text-xs font-medium text-lime-700 hover:text-lime-800">View as table</summary>
            <table className="mt-2 w-full table-fixed border-collapse text-xs">
              <caption className="sr-only">{flag.name} rollout, as filled and total cells.</caption>
              <colgroup>
                <col style={{ width: "60%" }} />
                <col style={{ width: "40%" }} />
              </colgroup>
              <tbody>
                <tr className="border-t border-zinc-100">
                  <th scope="row" className="py-1 text-left font-normal text-zinc-500">
                    Filled cells
                  </th>
                  <td className={`py-1 text-right text-zinc-900 ${NUM}`}>{filled}</td>
                </tr>
                <tr className="border-t border-zinc-100">
                  <th scope="row" className="py-1 text-left font-normal text-zinc-500">
                    Total cells
                  </th>
                  <td className={`py-1 text-right text-zinc-900 ${NUM}`}>{WAFFLE_CELLS}</td>
                </tr>
                <tr className="border-t border-zinc-100">
                  <th scope="row" className="py-1 text-left font-normal text-zinc-500">
                    Rollout
                  </th>
                  <td className={`py-1 text-right text-zinc-900 ${NUM}`}>{filled}%</td>
                </tr>
              </tbody>
            </table>
          </details>
        </div>
      </div>
    </Card>
  );
}

export function StatTiles() {
  return (
    <div className="grid min-w-0 grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
      {TILES.map((tile) => (
        <StatCard key={tile.id} tile={tile} />
      ))}
      <WaffleTile className="col-span-2" />
    </div>
  );
}
