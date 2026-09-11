"use client";

import { ITEMS_TODAY, WEIGHT_TODAY_KG, ZONE_STATS, formatKg } from "./data";
import { NUM, TEXT_AUX, TEXT_PRIMARY, cx } from "./tokens";
import { CardHead, Progress } from "./ui";

/**
 * Citywide zone load, deliberately NOT wired to `pinnedRouteId`.
 *
 * This is the branch-selection surface the brief asks for: pinning a route on the map or in the
 * queue recomputes the map's highlight and the PinnedRoutePanel next to it, but this card always
 * shows the full-day aggregate across all six zones regardless of what's pinned. A dispatch lead
 * uses this panel as a stable baseline while drilling into one route at a time — if it jumped to
 * "just this route's zone" on every click, it would stop being a baseline and just become a second,
 * redundant readout of the thing already pinned. So its only input is the (static, today-scoped)
 * ZONE_STATS data — no selection prop at all.
 */
export default function ZoneLoadPanel() {
  const maxLoad = Math.max(...ZONE_STATS.map((z) => z.loadPct));

  return (
    <div>
      <CardHead title="Zone load, today" hint="Citywide aggregate across all six zones — unaffected by pinning a route." />
      <ul className="mt-3 flex flex-col gap-3">
        {ZONE_STATS.map((z) => (
          <li key={z.id}>
            <div className="flex items-baseline justify-between gap-2">
              <span className={cx("text-sm font-medium", TEXT_PRIMARY)}>{z.name}</span>
              <span className={cx("text-xs font-normal", TEXT_AUX)}>
                <span className={cx(NUM, "font-medium text-zinc-200")}>{z.items}</span> items · {z.routeCount} route{z.routeCount === 1 ? "" : "s"}
              </span>
            </div>
            <div className="mt-1.5">
              <Progress value={z.loadPct} label={`${z.name} capacity used`} colorClass={z.loadPct === maxLoad ? "bg-orange-400" : "bg-blue-400"} />
            </div>
          </li>
        ))}
      </ul>
      <p className={cx("mt-3 border-t border-white/10 pt-3 text-[11px] font-normal", TEXT_AUX)}>
        <span className={cx(NUM, "font-medium text-zinc-300")}>{ITEMS_TODAY}</span> items ·{" "}
        <span className={cx(NUM, "font-medium text-zinc-300")}>{formatKg(WEIGHT_TODAY_KG)}</span> collected citywide so far today.
      </p>
    </div>
  );
}
