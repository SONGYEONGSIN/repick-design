"use client";

import { Circle, CircleDot } from "lucide-react";
import { DISPLAY, FOCUS_PAGE, PILLARS, cx, formatValue, member, type PillarId } from "./data";

/**
 * The first screen's answer to "how proven is this place", and the page's only global control.
 *
 * Each tile carries a figure *and* the name of the person answerable for it, because that pairing is
 * the whole claim this page makes — a number with nobody's name on it is a brochure statistic, and a
 * team with no numbers is a brochure. Selecting a tile then propagates that pairing through the rest
 * of the page: the trajectory redraws, every milestone reprints this measure, the rule that produces
 * it is marked, and its owner's card is marked.
 *
 * Selection is never carried by colour alone — the selected tile also swaps its label from "Track
 * this" to "Tracking" and its outline icon for a filled one.
 */
export default function PillarStrip({
  selected,
  onSelect,
}: {
  selected: PillarId;
  onSelect: (id: PillarId) => void;
}) {
  return (
    <div role="group" aria-label="Verification measures" className="grid grid-cols-2 gap-2 sm:gap-3 xl:grid-cols-4">
      {PILLARS.map((p) => {
        const active = p.id === selected;
        const owner = member(p.owner);

        return (
          <button
            key={p.id}
            type="button"
            aria-pressed={active}
            onClick={() => onSelect(p.id)}
            className={cx(
              "flex min-w-0 flex-col rounded-2xl border p-3 text-left transition-colors sm:p-4",
              FOCUS_PAGE,
              active
                ? "border-lime-700 bg-lime-50"
                : "border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-100",
            )}
          >
            <span
              className="text-xl leading-none font-semibold tracking-tight text-stone-900 tabular-nums sm:text-2xl xl:text-3xl"
              style={DISPLAY}
            >
              {formatValue(p, p.value)}
            </span>
            <span className="mt-2 text-sm font-medium text-stone-900">{p.label}</span>
            <span className="mt-1 text-xs leading-relaxed font-normal text-stone-600">Held by {owner.name}</span>
            <span
              className={cx(
                "mt-3 inline-flex items-center gap-1.5 text-xs font-medium",
                active ? "text-lime-800" : "text-stone-600",
              )}
            >
              {active ? (
                <CircleDot aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
              ) : (
                <Circle aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
              )}
              {active ? "Tracking" : "Track this"}
            </span>
          </button>
        );
      })}
    </div>
  );
}
