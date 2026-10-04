"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Command, CornerDownLeft, Search, X } from "lucide-react";
import { INSTRUMENTS } from "./data";
import { cx, FOCUS, TEXT_AUX, TEXT_PRIMARY, TRANSITION } from "./tokens";

/**
 * Mounted/unmounted entirely by its parent's `open` boolean (see fluxgate-client.tsx), never kept
 * alive and reset from inside. That means `query`/`activeIndex` start fresh on every open simply
 * because the component instance is new — no `useEffect` keyed on an "open" flag ever resets state,
 * which is the exact pattern that has hard-failed `react-hooks/set-state-in-effect` in this catalog
 * before. The escape-key listener below is registered once on mount and only ever *calls* onClose
 * from a real keyboard event — it does not set any state as a reaction to a prop/state change.
 */
export function CommandPalette({ onClose, onSelectInstrument }: { onClose: () => void; onSelectInstrument: (id: string) => void }) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const q = query.trim().toLowerCase();
  const results = useMemo(
    () =>
      INSTRUMENTS.filter(
        (i) => q === "" || i.name.toLowerCase().includes(q) || i.ticker.toLowerCase().includes(q) || i.category.toLowerCase().includes(q) || i.market.toLowerCase().includes(q),
      ).slice(0, 8),
    [q],
  );

  function commit(id: string) {
    onSelectInstrument(id);
    onClose();
  }

  function handleInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, Math.max(results.length - 1, 0)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[activeIndex]) {
      e.preventDefault();
      commit(results[activeIndex].id);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-24 sm:pt-32" role="presentation">
      <button type="button" aria-label="Close search" onClick={onClose} className="absolute inset-0 bg-black/60" />
      <div role="dialog" aria-modal="true" aria-label="Search instruments" className="relative w-full max-w-lg rounded-xl border border-white/10 bg-zinc-900 shadow-2xl shadow-black/50">
        <div className="flex h-14 items-center gap-2.5 border-b border-white/10 px-4">
          <Search aria-hidden="true" className={cx("size-4 shrink-0", TEXT_AUX)} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={handleInputKeyDown}
            placeholder="Search instruments by name, ticker, or market…"
            aria-label="Search instruments by name, ticker, or market"
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-listbox"
            aria-activedescendant={results[activeIndex] ? `palette-option-${results[activeIndex].id}` : undefined}
            className={cx("min-w-0 flex-1 bg-transparent text-sm", TEXT_PRIMARY, "placeholder:text-zinc-500")}
          />
          <button type="button" onClick={onClose} aria-label="Close search" className={cx("flex size-8 shrink-0 items-center justify-center rounded-md", TEXT_AUX, TRANSITION, FOCUS, "hover:bg-white/5")}>
            <X aria-hidden="true" className="size-4" />
          </button>
        </div>

        <ul id="palette-listbox" role="listbox" aria-label="Instrument results" className="max-h-80 overflow-y-auto p-2">
          {results.length === 0 ? (
            <li className={cx("px-3 py-8 text-center text-sm", TEXT_AUX)}>No instruments match &ldquo;{query}&rdquo;.</li>
          ) : (
            results.map((inst, i) => (
              <li role="presentation" key={inst.id}>
                <button
                  id={`palette-option-${inst.id}`}
                  role="option"
                  aria-selected={i === activeIndex}
                  tabIndex={-1}
                  onMouseEnter={() => setActiveIndex(i)}
                  onClick={() => commit(inst.id)}
                  className={cx(
                    "flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left",
                    TRANSITION,
                    i === activeIndex ? "bg-violet-500/15" : "hover:bg-white/5",
                  )}
                >
                  <span className="min-w-0 flex-1 truncate text-sm font-medium">
                    <span className={TEXT_PRIMARY}>{inst.name}</span>
                  </span>
                  <span className={cx("shrink-0 whitespace-nowrap text-[11px]", TEXT_AUX)}>
                    {inst.ticker} &middot; {inst.category}
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>

        <div className={cx("flex items-center justify-between border-t border-white/10 px-4 py-2 text-[11px]", TEXT_AUX)}>
          <span className="inline-flex items-center gap-1.5">
            <CornerDownLeft aria-hidden="true" className="size-3" /> Select
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Command aria-hidden="true" className="size-3" />K toggle &middot; Esc close
          </span>
        </div>
      </div>
    </div>
  );
}
