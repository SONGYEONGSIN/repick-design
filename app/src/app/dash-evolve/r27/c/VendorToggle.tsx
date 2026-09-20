"use client";

import { Check } from "lucide-react";
import { overallScore, type Vendor } from "./data";
import { SERIES_HEX, TEXT_AUX, TEXT_PRIMARY, TRANSITION, cx } from "./tokens";

/**
 * Legend-as-toggle for the radar directly above it. This is its own state (`plotted`), scoped only
 * to which polygons render on the radar — it does not touch the comparison table below, which
 * always lists every vendor's exact scores regardless of what's plotted. See ScoreTable's row-click
 * spotlight for the page's other, independently-scoped selection.
 */
export default function VendorToggle({
  vendors,
  plotted,
  onToggle,
}: {
  vendors: Vendor[];
  plotted: Set<string>;
  onToggle: (id: string) => void;
}) {
  return (
    <fieldset className="flex flex-wrap gap-2">
      <legend className="sr-only">Toggle which vendors plot on the radar</legend>
      {vendors.map((v) => {
        const on = plotted.has(v.id);
        const soleRemaining = on && plotted.size === 1;
        return (
          <label
            key={v.id}
            className={cx(
              "flex h-9 cursor-pointer items-center gap-2 rounded-full border px-3 text-xs font-medium",
              TRANSITION,
              on ? "border-white/15 bg-white/5" : "border-white/5 bg-transparent opacity-55",
              soleRemaining && "cursor-not-allowed",
              // The checkbox itself is sr-only, so its focus ring is drawn here instead, on the
              // label that directly wraps it — an ancestor, not a sibling, so it is still
              // reachable by a "walk up from the focused element" focus-visibility check.
              "[&:has(:focus-visible)]:outline [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-amber-400",
            )}
          >
            <input type="checkbox" checked={on} disabled={soleRemaining} onChange={() => onToggle(v.id)} className="sr-only" />
            <span
              aria-hidden="true"
              className="grid h-4 w-4 shrink-0 place-items-center rounded-[4px] border"
              style={{ borderColor: SERIES_HEX[v.id], backgroundColor: on ? SERIES_HEX[v.id] : "transparent" }}
            >
              {on ? <Check size={11} strokeWidth={3} className="text-zinc-950" /> : null}
            </span>
            <span className={cx(on ? TEXT_PRIMARY : TEXT_AUX)}>{v.name}</span>
            <span className={cx("tabular-nums", TEXT_AUX)}>{overallScore(v).toFixed(1)}</span>
          </label>
        );
      })}
    </fieldset>
  );
}
