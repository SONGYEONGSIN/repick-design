"use client";

import { useEffect, useRef, useState } from "react";
import { Pin, Search, X } from "lucide-react";
import { BENCH_CAPACITY, EXPERIMENTS, classifyLift } from "./data";
import { LiftBadge, FOCUS_RING } from "./ui";

export default function CommandPalette({
  open,
  onClose,
  pinnedIds,
  onTogglePin,
}: {
  open: boolean;
  onClose: () => void;
  pinnedIds: string[];
  onTogglePin: (id: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [wasOpen, setWasOpen] = useState(open);
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset the query against a stored previous `open` value during render, not inside a
  // useEffect keyed on `open` — avoids react-hooks/set-state-in-effect.
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setQuery("");
  }

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  if (!open) return null;

  const q = query.toLowerCase();
  const results = EXPERIMENTS.filter(
    (e) => e.name.toLowerCase().includes(q) || e.metricLabel.toLowerCase().includes(q) || e.owner.name.toLowerCase().includes(q)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-zinc-950/70 px-4 pt-24">
      <div role="dialog" aria-modal="true" aria-label="Search and pin experiments" className="w-full max-w-lg rounded-xl border border-white/10 bg-zinc-900 shadow-xl">
        <div className="flex h-11 items-center gap-2 border-b border-white/10 px-4">
          <Search className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") onClose();
            }}
            aria-label="Search experiments by name, metric, or owner"
            placeholder="Search experiments..."
            className={`w-full rounded-md bg-transparent font-normal text-sm text-zinc-50 placeholder:text-zinc-400 ${FOCUS_RING}`}
          />
          <button type="button" onClick={onClose} aria-label="Close search" className={`shrink-0 rounded-md p-1.5 text-zinc-400 hover:text-zinc-50 ${FOCUS_RING}`}>
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto p-2">
          {results.length === 0 ? (
            <p className="px-3 py-6 text-center font-normal text-sm text-zinc-400">No experiments match &quot;{query}&quot;.</p>
          ) : (
            <ul>
              {results.map((e) => {
                const pinned = pinnedIds.includes(e.id);
                const liftClass = classifyLift(e.ciFull);
                return (
                  <li key={e.id}>
                    <button
                      type="button"
                      onClick={() => {
                        onTogglePin(e.id);
                        onClose();
                      }}
                      className={`flex w-full min-w-0 items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left hover:bg-white/5 ${FOCUS_RING}`}
                    >
                      <span className="flex min-w-0 items-center gap-2">
                        <Pin className={`h-3.5 w-3.5 shrink-0 ${pinned ? "text-lime-400" : "text-zinc-400"}`} aria-hidden="true" />
                        <span className="min-w-0">
                          <span className="block truncate font-medium text-sm text-zinc-50">{e.name}</span>
                          <span className="block truncate font-normal text-xs text-zinc-400">{e.metricLabel}</span>
                        </span>
                      </span>
                      <LiftBadge liftPct={e.liftPct} liftClass={liftClass} size="sm" className="shrink-0" />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="border-t border-white/10 px-3 py-2">
          <p className="font-normal text-xs text-zinc-400">Select an experiment to pin or unpin it on the comparison bench (up to {BENCH_CAPACITY} at a time).</p>
        </div>
      </div>
    </div>
  );
}
