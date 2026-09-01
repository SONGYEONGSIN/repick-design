"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search, CornerDownLeft } from "lucide-react";
import { CATEGORY_LABEL, WATCHLIST, dayChangePct } from "./data";
import { fmtCompact, fmtSignedPct } from "./format";
import { FOCUS_RING } from "./ui/focus";

const INPUT_FOCUS = "outline-none focus-visible:[box-shadow:0_0_0_2px_#18181b,0_0_0_4px_#fbbf24] rounded";

/**
 * ⌘K command palette. Selecting an item here calls the exact same `onSelect` handler a watchlist
 * row click uses — it is a second input path into the same "pin" propagation mode (chart + stat
 * strip only), not a third mode of its own.
 */
export function CommandPalette({
  open,
  onClose,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (id: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [highlight, setHighlight] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Adjust state during render (React's documented pattern) instead of syncing it from an effect
  // body — avoids the extra render-then-commit-then-effect-then-render-again cascade that
  // `react-hooks/set-state-in-effect` flags. Each block tracks the previous value of the thing it
  // watches and resets derived state inline when that value changes; React re-renders immediately
  // with the adjusted state before anything paints, so there's no visible flicker.
  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setQuery("");
      setHighlight(0);
    }
  }

  const [prevQuery, setPrevQuery] = useState(query);
  if (query !== prevQuery) {
    setPrevQuery(query);
    setHighlight(0);
  }

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return WATCHLIST;
    return WATCHLIST.filter(
      (item) => item.name.toLowerCase().includes(q) || CATEGORY_LABEL[item.category].toLowerCase().includes(q)
    );
  }, [query]);

  // Focusing the input on open is a genuine DOM side effect (not a state-sync issue), so it stays
  // in an effect.
  useEffect(() => {
    if (open) {
      const t = window.setTimeout(() => inputRef.current?.focus(), 0);
      return () => window.clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlight((h) => Math.min(results.length - 1, h + 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlight((h) => Math.max(0, h - 1));
      } else if (e.key === "Enter") {
        const item = results[highlight];
        if (item) {
          onSelect(item.id);
          onClose();
        }
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, results, highlight, onClose, onSelect]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-24 sm:pt-32">
      <button aria-label="Close search" tabIndex={-1} onClick={onClose} className="absolute inset-0 bg-zinc-950/75" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search tracked comps"
        className="relative w-full max-w-lg overflow-hidden rounded-xl border border-white/10 bg-zinc-900 shadow-[0_24px_64px_-24px_rgba(0,0,0,0.8)]"
      >
        <div className="flex items-center gap-2.5 border-b border-white/10 px-4 py-3">
          <Search className="h-4 w-4 shrink-0 text-zinc-500" aria-hidden="true" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tracked models…"
            aria-label="Search tracked models"
            aria-controls="palette-results"
            aria-activedescendant={results[highlight] ? `palette-option-${results[highlight].id}` : undefined}
            role="combobox"
            aria-expanded="true"
            className={`min-w-0 flex-1 bg-transparent px-1 text-[14px] text-zinc-100 placeholder:text-zinc-500 ${INPUT_FOCUS}`}
          />
          <kbd className="rounded border border-white/10 bg-zinc-800 px-1.5 py-0.5 text-[10.5px] text-zinc-400">Esc</kbd>
        </div>
        <ul id="palette-results" role="listbox" className="max-h-80 overflow-y-auto p-1.5">
          {results.length === 0 && <li className="px-3 py-6 text-center text-[12.5px] text-zinc-400">No tracked models match “{query}”.</li>}
          {results.map((item, i) => {
            const change = dayChangePct(item.series);
            const latest = item.series[item.series.length - 1];
            return (
              <li key={item.id}>
                <button
                  id={`palette-option-${item.id}`}
                  role="option"
                  tabIndex={-1}
                  aria-selected={i === highlight}
                  onMouseEnter={() => setHighlight(i)}
                  onClick={() => {
                    onSelect(item.id);
                    onClose();
                  }}
                  className={`flex w-full min-w-0 items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left ${FOCUS_RING} ${
                    i === highlight ? "bg-amber-400/10" : ""
                  }`}
                >
                  <span className="min-w-0">
                    <span className="block truncate text-[13px] font-medium text-zinc-100">{item.shortName}</span>
                    <span className="block truncate text-[11px] text-zinc-400">{CATEGORY_LABEL[item.category]}</span>
                  </span>
                  <span className="flex shrink-0 items-center gap-2">
                    <span className="tabular-nums text-[12px] text-zinc-300">{fmtCompact(latest.repick)}</span>
                    <span className="tabular-nums text-[11px] text-zinc-400">{fmtSignedPct(change)}</span>
                    {i === highlight && <CornerDownLeft className="h-3.5 w-3.5 text-amber-300" aria-hidden="true" />}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
