"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search, CornerDownLeft } from "lucide-react";
import { CATEGORIES, type CategoryId } from "./categories";
import { exactPercent } from "./allocation";
import { formatCount } from "./format";

/**
 * The fourth required interaction: a ⌘K command palette. It opens globally
 * (Cmd/Ctrl+K from anywhere on the page) or from the top-bar search trigger,
 * filters the category list as you type, and is fully keyboard-driven
 * (arrow keys to move, Enter to open that category's drawer, Escape to close).
 */
export function CommandPalette({
  open,
  onOpenChange,
  counts,
  total,
  onSelect,
  returnFocusRef,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  counts: Record<CategoryId, number>;
  total: number;
  onSelect: (id: CategoryId) => void;
  returnFocusRef: React.RefObject<HTMLElement | null>;
}) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const wasOpen = useRef(false);

  const results = useMemo(
    () => CATEGORIES.filter((c) => c.label.toLowerCase().includes(query.trim().toLowerCase())),
    [query],
  );

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
      wasOpen.current = true;
    } else if (wasOpen.current) {
      setQuery("");
      setActiveIndex(0);
      returnFocusRef.current?.focus();
      wasOpen.current = false;
    }
    // returnFocusRef identity is stable; intentionally excluded.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const isMeta = event.metaKey || event.ctrlKey;
      if (isMeta && event.key.toLowerCase() === "k") {
        event.preventDefault();
        onOpenChange(!open);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onOpenChange]);

  function handleInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      onOpenChange(false);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      const target = results[activeIndex];
      if (target) {
        onSelect(target.id);
        onOpenChange(false);
      }
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center bg-zinc-900/40 px-4 pt-[14vh]">
      <div
        aria-hidden="true"
        className="fixed inset-0"
        onClick={() => onOpenChange(false)}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Jump to a category"
        className="relative w-full max-w-lg overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-2xl"
      >
        <div className="flex items-center gap-2 border-b border-zinc-100 px-4">
          <Search className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={handleInputKeyDown}
            placeholder="Jump to a category…"
            aria-label="Search categories"
            aria-activedescendant={results[activeIndex] ? `command-row-${results[activeIndex].id}` : undefined}
            role="combobox"
            aria-expanded="true"
            aria-controls="command-results"
            className="h-12 w-full rounded-sm border-0 bg-transparent text-sm text-zinc-900 placeholder:text-zinc-400 focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-amber-700"
          />
        </div>

        <ul id="command-results" role="listbox" aria-label="Categories" className="max-h-80 overflow-y-auto p-2">
          {results.map((category, index) => {
            const count = counts[category.id] ?? 0;
            const percent = exactPercent(count, total);
            const active = index === activeIndex;
            return (
              <li key={category.id} id={`command-row-${category.id}`} role="option" aria-selected={active}>
                <button
                  type="button"
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => {
                    onSelect(category.id);
                    onOpenChange(false);
                  }}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left outline-offset-2 focus-visible:outline-2 focus-visible:outline-amber-700 ${
                    active ? "bg-amber-50" : ""
                  }`}
                >
                  <span
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md"
                    style={{ backgroundColor: category.tint, color: category.hex }}
                  >
                    <category.icon className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm font-medium text-zinc-900">{category.label}</span>
                  <span className="shrink-0 tabular-nums text-xs text-zinc-500">
                    {formatCount(count)} · {Math.round(percent)}%
                  </span>
                </button>
              </li>
            );
          })}
          {results.length === 0 && (
            <li className="px-3 py-6 text-center text-sm text-zinc-500">No categories match “{query}”.</li>
          )}
        </ul>

        <div className="flex items-center gap-3 border-t border-zinc-100 px-4 py-2.5 text-[11px] text-zinc-500">
          <span className="inline-flex items-center gap-1">
            <ChevronHint /> navigate
          </span>
          <span className="inline-flex items-center gap-1">
            <CornerDownLeft className="h-3 w-3" aria-hidden="true" /> open
          </span>
          <span>Esc close</span>
        </div>
      </div>
    </div>
  );
}

function ChevronHint() {
  return (
    <span className="tabular-nums text-zinc-400" aria-hidden="true">
      ↑↓
    </span>
  );
}
