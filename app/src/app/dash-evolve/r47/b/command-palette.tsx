"use client";

import { useEffect, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { Command, Search } from "lucide-react";
import { FOCUS_RING } from "./ui";

export interface PaletteAction {
  id: string;
  label: string;
  hint: string;
  icon: LucideIcon;
  onRun: () => void;
}

/**
 * ⌘K command palette. Its actions are navigation (scroll-to-section) and the shared, page-level
 * `feedFilter` view toggle — the same state the Incident Feed's own filter chips write to. It
 * never reads or writes `pinnedKey` (the heatmap's pin) or any feed-item hover state: those stay
 * scoped to their own widgets. See the comment above `pinnedKey` in page.tsx for the full account.
 */
export function CommandPalette({
  open,
  onClose,
  actions,
}: {
  open: boolean;
  onClose: () => void;
  actions: PaletteAction[];
}) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = actions.filter((a) => a.label.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
      // Autofocus is the expected behavior for a command palette's own search field, opened by an
      // explicit user action (⌘K or the search button) — not an unsolicited focus steal on load.
      const id = window.setTimeout(() => inputRef.current?.focus(), 0);
      return () => window.clearTimeout(id);
    }
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, Math.max(filtered.length - 1, 0)));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const action = filtered[activeIndex];
        if (action) {
          action.onRun();
          onClose();
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, filtered, activeIndex, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-24">
      <div aria-hidden="true" onClick={onClose} className="absolute inset-0 bg-black/70" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="relative w-full max-w-lg overflow-hidden rounded-xl border border-white/10 bg-zinc-900 shadow-2xl motion-safe:animate-[rise_200ms_ease-out]"
      >
        <div className="flex items-center gap-2 border-b border-white/10 px-3">
          <Search className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command…"
            aria-label="Command palette search"
            className={`h-12 w-full min-w-0 rounded-md bg-transparent font-normal text-sm text-zinc-50 placeholder:text-zinc-400 ${FOCUS_RING}`}
          />
          <kbd className="hidden shrink-0 items-center gap-0.5 rounded border border-white/10 px-1.5 py-0.5 font-normal text-[11px] text-zinc-400 sm:flex">
            <Command className="h-3 w-3" aria-hidden="true" />K
          </kbd>
        </div>
        <ul role="listbox" aria-label="Commands" className="max-h-80 overflow-y-auto p-1.5">
          {filtered.length === 0 ? (
            <li className="px-2.5 py-6 text-center font-normal text-sm text-zinc-400">No matching commands.</li>
          ) : (
            filtered.map((action, i) => {
              const Icon = action.icon;
              const active = i === activeIndex;
              return (
                <li key={action.id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={active}
                    onMouseEnter={() => setActiveIndex(i)}
                    onClick={() => {
                      action.onRun();
                      onClose();
                    }}
                    className={`flex w-full min-w-0 items-center gap-2.5 rounded-lg px-2.5 py-2 text-left motion-safe:transition-colors ${FOCUS_RING} ${
                      active ? "bg-white/10 text-zinc-50" : "text-zinc-300 hover:bg-white/5"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0 text-rose-400" aria-hidden="true" />
                    <span className="min-w-0 flex-1 truncate font-normal text-sm">{action.label}</span>
                    <span className="shrink-0 font-normal text-xs text-zinc-400">{action.hint}</span>
                  </button>
                </li>
              );
            })
          )}
        </ul>
      </div>
    </div>
  );
}
