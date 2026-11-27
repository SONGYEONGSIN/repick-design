"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MapPin, Search, X } from "lucide-react";
import { REGIONS, balanceOf, statusOf, STATUS_LABEL, formatSignedMw } from "./data";
import { FOCUS_RING } from "./components/focus";

export default function CommandPalette({
  onClose,
  onPinRegion,
}: {
  onClose: () => void;
  onPinRegion: (id: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [highlight, setHighlight] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return REGIONS;
    return REGIONS.filter((r) => r.name.toLowerCase().includes(q) || r.code.toLowerCase().includes(q));
  }, [query]);

  const safeHighlight = Math.min(highlight, Math.max(0, results.length - 1));

  function choose(id: string) {
    onPinRegion(id);
    onClose();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Escape") {
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((i) => Math.min(results.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const target = results[safeHighlight];
      if (target) choose(target.id);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-zinc-950/70 px-4 pt-24"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Jump to region"
        onKeyDown={handleKeyDown}
        className="w-full max-w-md overflow-hidden rounded-xl border border-white/10 bg-zinc-900 shadow-2xl"
      >
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
          <Search aria-hidden="true" className="size-4 shrink-0 text-zinc-400" />
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-autocomplete="list"
            aria-controls="palette-results"
            aria-activedescendant={results[safeHighlight] ? `palette-opt-${results[safeHighlight].id}` : undefined}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setHighlight(0);
            }}
            placeholder="Jump to a region to pin it..."
            className={`min-w-0 flex-1 rounded bg-transparent text-sm text-zinc-100 placeholder:text-zinc-400 ${FOCUS_RING}`}
          />
          <button
            type="button"
            aria-label="Close command palette"
            onClick={onClose}
            className={`flex size-8 shrink-0 items-center justify-center rounded text-zinc-400 hover:bg-white/10 ${FOCUS_RING}`}
          >
            <X aria-hidden="true" className="size-4" />
          </button>
        </div>

        <ul id="palette-results" role="listbox" aria-label="Regions" className="max-h-80 overflow-y-auto p-2">
          {results.length === 0 && <li className="px-3 py-6 text-center text-sm text-zinc-400">No regions match &quot;{query}&quot;.</li>}
          {results.map((region, i) => {
            const latest = region.hourly[region.hourly.length - 1];
            const balance = balanceOf(latest);
            const status = statusOf(latest);
            return (
              <li key={region.id}>
                <button
                  id={`palette-opt-${region.id}`}
                  type="button"
                  role="option"
                  aria-selected={i === safeHighlight}
                  onMouseEnter={() => setHighlight(i)}
                  onClick={() => choose(region.id)}
                  className={`flex w-full items-center gap-2.5 rounded-md px-3 py-2.5 text-left text-sm ${FOCUS_RING} ${
                    i === safeHighlight ? "bg-indigo-400/15 text-indigo-100" : "text-zinc-200 hover:bg-white/10"
                  }`}
                >
                  <MapPin aria-hidden="true" className="size-4 shrink-0 text-zinc-400" />
                  <span className="min-w-0 flex-1 truncate">
                    {region.name} <span className="text-zinc-400">&middot; {region.code}</span>
                  </span>
                  <span className={`shrink-0 tabular-nums ${balance >= 0 ? "text-emerald-300" : "text-rose-300"}`}>
                    {formatSignedMw(balance)}
                  </span>
                  <span className="shrink-0 text-xs text-zinc-400">{STATUS_LABEL[status]}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
