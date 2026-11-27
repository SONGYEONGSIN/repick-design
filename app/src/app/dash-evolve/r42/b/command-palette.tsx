"use client";

import { useEffect, useRef, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { formatInt, formatWeekRange } from "./format";
import { PRESETS, type ScenarioPreset, type SimInputs, computeProjection } from "./sim";
import { FOCUS_RING, SlaBadge } from "./ui";

export default function CommandPalette({
  open,
  onClose,
  inputs,
  onJumpToWeek,
  onApplyPreset,
}: {
  open: boolean;
  onClose: () => void;
  inputs: SimInputs;
  onJumpToWeek: (index: number) => void;
  onApplyPreset: (preset: ScenarioPreset) => void;
}) {
  const [query, setQuery] = useState("");
  const [wasOpen, setWasOpen] = useState(open);
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset the query by comparing against a stored previous `open` value during render, instead
  // of inside a useEffect keyed on `open` — avoids react-hooks/set-state-in-effect.
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setQuery("");
  }

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  if (!open) return null;

  const q = query.toLowerCase();
  const rows = computeProjection(inputs);
  const weekResults = rows.filter((r) => formatWeekRange(r.index).toLowerCase().includes(q) || `week ${r.index + 1}`.includes(q));
  const presetResults = PRESETS.filter((p) => p.label.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-zinc-900/40 px-4 pt-24">
      <div role="dialog" aria-modal="true" aria-label="Search weeks and scenario presets" className="w-full max-w-lg rounded-xl border border-zinc-200 bg-white shadow-xl">
        <div className="flex h-11 items-center gap-2 border-b border-zinc-200 px-4">
          <Search className="h-4 w-4 shrink-0 text-zinc-600" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Escape") onClose();
            }}
            aria-label="Search weeks by date and scenario presets by name"
            placeholder="Jump to a week or apply a preset..."
            className={`w-full rounded-md bg-transparent font-normal text-sm text-zinc-900 placeholder:text-zinc-600 ${FOCUS_RING}`}
          />
          <button type="button" onClick={onClose} aria-label="Close search" className={`shrink-0 rounded-md p-1.5 text-zinc-600 hover:text-zinc-900 ${FOCUS_RING}`}>
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto p-2">
          {weekResults.length === 0 && presetResults.length === 0 ? (
            <p className="px-3 py-6 text-center font-normal text-sm text-zinc-600">No matches for &quot;{query}&quot;.</p>
          ) : (
            <>
              {presetResults.length > 0 ? (
                <div className="mb-1">
                  <p className="px-3 py-1 font-semibold text-[11px] uppercase tracking-[0.04em] text-zinc-600">Scenario presets</p>
                  <ul>
                    {presetResults.map((preset) => (
                      <li key={preset.id}>
                        <button
                          type="button"
                          onClick={() => {
                            onApplyPreset(preset);
                            onClose();
                          }}
                          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left hover:bg-zinc-50 ${FOCUS_RING}`}
                        >
                          <SlidersHorizontal className="h-4 w-4 shrink-0 text-green-700" aria-hidden="true" />
                          <span className="min-w-0">
                            <span className="block font-medium text-sm text-zinc-900">{preset.label}</span>
                            <span className="block truncate font-normal text-xs text-zinc-600">{preset.description}</span>
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {weekResults.length > 0 ? (
                <div>
                  <p className="px-3 py-1 font-semibold text-[11px] uppercase tracking-[0.04em] text-zinc-600">Weeks</p>
                  <ul>
                    {weekResults.map((row) => (
                      <li key={row.index}>
                        <button
                          type="button"
                          onClick={() => {
                            onJumpToWeek(row.index);
                            onClose();
                          }}
                          className={`flex w-full min-w-0 items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left hover:bg-zinc-50 ${FOCUS_RING}`}
                        >
                          <span className="flex min-w-0 items-center gap-2">
                            <span className="font-medium text-sm tabular-nums text-zinc-900">Week of {formatWeekRange(row.index)}</span>
                          </span>
                          <span className="flex shrink-0 items-center gap-2">
                            <span className="font-medium text-xs tabular-nums text-zinc-600">{formatInt(row.requiredHeadcount)} required</span>
                            <SlaBadge breach={row.breach} />
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
