"use client";

import { Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { SEARCH_ENTRIES, type RegionId } from "./data";
import { BORDER, FOCUS, HOVER_BG, PANEL_BG, TEXT_AUX, TEXT_PRIMARY, TRANSITION, cx } from "./tokens";
import { Eyebrow } from "./ui";

/**
 * Mounted only while open (see fluxgate-client.tsx: `{paletteOpen ? <CommandPalette .../> : null}`),
 * so `query`/`activeIndex` start fresh via useState's initializer on every open — no effect ever
 * resets state in response to an `open` prop, which is the exact pattern that tripped the
 * `react-hooks/set-state-in-effect` hard-gate in earlier rounds of this catalog.
 */
const REGION_ENTRY_TO_ID: Record<string, RegionId> = {
  "region-global": "global",
  "region-us-east": "us-east",
  "region-eu-west": "eu-west",
  "region-apac": "apac",
};

export default function CommandPalette({ onClose, onRegionChange }: { onClose: () => void; onRegionChange: (id: RegionId) => void }) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const q = query.trim().toLowerCase();
  const results = useMemo(() => SEARCH_ENTRIES.filter((e) => q === "" || e.title.toLowerCase().includes(q)).slice(0, 8), [q]);
  const clampedIndex = Math.min(activeIndex, Math.max(0, results.length - 1));

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-zinc-900/50 px-4 pt-20 sm:pt-24" role="presentation" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-label="Command palette" onClick={(e) => e.stopPropagation()} className={cx("w-full max-w-xl rounded-2xl border shadow-2xl shadow-zinc-900/20", BORDER, PANEL_BG)}>
        <div className={cx("flex items-center gap-2.5 border-b px-3 py-2", BORDER)}>
          <Search size={16} aria-hidden="true" className={cx("shrink-0", TEXT_AUX)} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setActiveIndex((i) => Math.min(i + 1, results.length - 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setActiveIndex((i) => Math.max(i - 1, 0));
              } else if (e.key === "Enter") {
                e.preventDefault();
                const entry = results[clampedIndex];
                if (!entry) return;
                const regionId = REGION_ENTRY_TO_ID[entry.id];
                if (regionId) onRegionChange(regionId);
                onClose();
              }
            }}
            type="text"
            placeholder="Search regions, incidents, nodes…"
            aria-label="Search regions, incidents, nodes"
            role="combobox"
            aria-expanded="true"
            aria-controls="fluxgate-palette-results"
            aria-activedescendant={results[clampedIndex] ? `palette-opt-${results[clampedIndex].id}` : undefined}
            className={cx("h-9 min-w-0 flex-1 rounded-md bg-transparent px-1 text-sm font-normal", TEXT_PRIMARY, "placeholder:text-zinc-500", FOCUS)}
          />
          <button type="button" onClick={onClose} className={cx("grid h-9 w-9 shrink-0 place-items-center rounded-lg text-sm font-medium", HOVER_BG, TRANSITION, FOCUS)}>
            <X size={15} aria-hidden="true" className={TEXT_AUX} />
            <span className="sr-only">Close command palette</span>
          </button>
        </div>

        {results.length > 0 ? (
          <div className="px-2.5 pt-2">
            <Eyebrow>Jump to</Eyebrow>
          </div>
        ) : null}
        <div id="fluxgate-palette-results" role="listbox" aria-label="Search results" className="max-h-[60vh] overflow-y-auto p-2 [scrollbar-width:thin]">
          {results.length === 0 ? <p className={cx("px-2.5 py-6 text-center text-sm font-normal", TEXT_AUX)}>No matches for that search.</p> : null}
          {results.map((e, i) => {
            const active = i === clampedIndex;
            const regionId = REGION_ENTRY_TO_ID[e.id];
            function commit() {
              if (regionId) onRegionChange(regionId);
              onClose();
            }
            return (
              <button
                key={e.id}
                id={`palette-opt-${e.id}`}
                type="button"
                role="option"
                aria-selected={active}
                tabIndex={-1}
                onMouseEnter={() => setActiveIndex(i)}
                onClick={commit}
                className={cx("flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm font-medium", TEXT_PRIMARY, TRANSITION, active ? "bg-lime-50" : HOVER_BG)}
              >
                <e.Icon size={15} aria-hidden="true" className={cx("shrink-0", TEXT_AUX)} />
                <span className="min-w-0 flex-1 truncate">
                  <span className="text-[13px]">{e.title}</span>
                  <span className={cx("ml-2 text-[11px] font-normal", TEXT_AUX)}>{regionId ? "Region — switches the chart" : e.meta}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
