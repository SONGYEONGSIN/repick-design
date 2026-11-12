"use client";

import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { COMMAND_ITEMS } from "./data";

/**
 * This component is only ever mounted while the palette is open (see
 * `{paletteOpen && <CommandPalette .../>}` in incident-console.tsx). That
 * is the reset mechanism for its query state: a fresh mount gives a fresh
 * `useState("")`, so there is no need for — and this deliberately avoids —
 * a `useEffect` that watches an `open` prop and calls `setQuery("")`,
 * which is the exact pattern that has tripped `react-hooks/set-state-in-
 * effect` repeatedly in this catalog.
 */
export function CommandPalette({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const q = query.trim().toLowerCase();
  const results = q === "" ? COMMAND_ITEMS : COMMAND_ITEMS.filter((item) => item.label.toLowerCase().includes(q));

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[12vh]">
      <div aria-hidden="true" className="fixed inset-0 bg-black/60" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="relative z-10 w-full max-w-lg overflow-hidden rounded-xl border border-white/10 bg-zinc-900 shadow-2xl"
      >
        <div className="flex items-center gap-2 border-b border-white/10 px-4">
          <Search className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search services and pages…"
            aria-label="Search services and pages"
            className="h-12 w-full min-w-0 rounded bg-transparent text-sm font-normal text-zinc-50 placeholder:text-zinc-400 outline-offset-2 focus-visible:outline-2 focus-visible:outline-cyan-400"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close command palette"
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-zinc-400 outline-offset-2 hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-cyan-400"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        <ul role="listbox" aria-label="Results" className="max-h-72 overflow-y-auto py-1">
          {results.length === 0 && <li className="px-4 py-3 text-sm font-normal text-zinc-400">No matches.</li>}
          {results.map((item) => (
            <li key={item.id} role="option" aria-selected={false}>
              <button
                type="button"
                onClick={onClose}
                className="flex w-full items-center justify-between px-4 py-2 text-left text-sm font-normal text-zinc-50 outline-offset-2 hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-cyan-400"
              >
                <span className="truncate">{item.label}</span>
                <span className="shrink-0 text-xs font-normal text-zinc-400">{item.group}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
