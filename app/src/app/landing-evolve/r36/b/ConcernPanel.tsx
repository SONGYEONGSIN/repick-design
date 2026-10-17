"use client";

import { CheckCircle2, Circle } from "lucide-react";
import RingCluster from "./RingCluster";
import { CONCERNS, type ConcernId, type Scores } from "./data";
import { aggregateForSelection } from "./score-math";
import { ACCENT_TINT, FOCUS } from "./theme";

interface ConcernPanelProps {
  scores: Scores;
  selected: ReadonlySet<ConcernId>;
  onToggle: (id: ConcernId) => void;
  listingTitle: string;
}

/**
 * The input x output device this route is built around. The chip row is
 * the input (toggle any of the five concerns on or off, 0 to all of
 * them); the ring cluster plus the center readout is the output, and both
 * are driven from the same `selected` state passed in from LandingPage —
 * there is nothing local to this component that the rest of the page
 * can't see.
 */
export default function ConcernPanel({ scores, selected, onToggle, listingTitle }: ConcernPanelProps) {
  const selectedIds = CONCERNS.filter((c) => selected.has(c.id)).map((c) => c.id);
  const aggregate = aggregateForSelection(scores, selectedIds);

  return (
    <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5 sm:p-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-600">
        Right now, inspecting
      </p>
      <p className="mt-1 truncate text-sm font-semibold text-zinc-950">{listingTitle}</p>

      <div className="mt-4 flex flex-col gap-2" role="group" aria-label="Concerns to check for this listing">
        {CONCERNS.map((concern) => {
          const isOn = selected.has(concern.id);
          return (
            <button
              key={concern.id}
              type="button"
              aria-pressed={isOn}
              onClick={() => onToggle(concern.id)}
              className={`flex items-center justify-between gap-3 rounded-lg border px-3 py-2 text-left transition-colors ${FOCUS} ${
                isOn
                  ? "border-solid border-emerald-600 bg-white"
                  : "border-dashed border-zinc-300 bg-white/60 hover:border-zinc-400"
              }`}
            >
              <span className="flex items-center gap-2 text-sm">
                {isOn ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-700" aria-hidden="true" />
                ) : (
                  <Circle className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
                )}
                <span className={isOn ? "font-semibold text-zinc-950" : "font-normal text-zinc-500"}>
                  {concern.label}
                </span>
              </span>
              <span
                className={`tabular-nums text-sm ${isOn ? "font-semibold text-zinc-950" : "font-normal text-zinc-500"}`}
              >
                {scores[concern.id]}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-center">
        <RingCluster
          concerns={CONCERNS}
          scores={scores}
          selected={selected}
          size={180}
          center={
            <>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em]" style={{ color: ACCENT_TINT }}>
                Match confidence
              </p>
              <p
                aria-live="polite"
                className="mt-1 text-[clamp(1.6rem,1.3rem+1.2vw,2.25rem)] font-bold tabular-nums leading-none text-zinc-950"
              >
                {aggregate === null ? "—" : `${aggregate}%`}
              </p>
              <p className="mt-1 text-[11px] font-normal leading-[1.4] text-zinc-600">
                {selectedIds.length === 0
                  ? "select a concern below"
                  : `across ${selectedIds.length} concern${selectedIds.length === 1 ? "" : "s"}`}
              </p>
            </>
          }
        />
      </div>
    </div>
  );
}
