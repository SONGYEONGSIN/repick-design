"use client";

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { Search } from "lucide-react";
import { FOCUS_RING } from "./ui";

export interface PaletteCommand {
  id: string;
  label: string;
  hint: string;
  run: () => void;
}

/** Mounted by the parent only while open (`{paletteOpen && <CommandPalette ... />}`), so every
 * mount already starts from fresh query/activeIndex state — no open-triggered reset effect. */
export function CommandPalette({
  onClose,
  commands,
}: {
  onClose: () => void;
  commands: PaletteCommand[];
}) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) => c.label.toLowerCase().includes(q) || c.hint.toLowerCase().includes(q));
  }, [commands, query]);

  // Reset the active row whenever the query changes, during render rather than in an effect —
  // this is the "adjust state while rendering" pattern React recommends for derived state.
  const [prevQuery, setPrevQuery] = useState(query);
  if (query !== prevQuery) {
    setPrevQuery(query);
    setActiveIndex(0);
  }

  // Focusing the input is a genuine side effect (imperative DOM focus), so it stays in an effect —
  // it just never calls setState itself. The parent only mounts this component while `open` is
  // true, so every mount is already a fresh query/activeIndex state; no reset-on-open needed.
  useEffect(() => {
    const raf = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(raf);
  }, []);

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === "Escape") {
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const cmd = filtered[activeIndex];
      if (cmd) {
        cmd.run();
        onClose();
      }
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[12vh]">
      <button type="button" tabIndex={-1} aria-label="Close command palette" onClick={onClose} className="fixed inset-0 bg-zinc-900/40" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="relative z-10 w-full max-w-lg overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-2xl"
        onKeyDown={handleKeyDown}
      >
        <div className="flex items-center gap-2 border-b border-zinc-200 px-4">
          <Search className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Jump to a view, sort, filter, or facility…"
            aria-label="Search commands"
            className={`h-12 min-w-0 flex-1 rounded bg-transparent text-sm text-zinc-900 placeholder:text-zinc-400 ${FOCUS_RING}`}
          />
          <kbd className="shrink-0 rounded border border-zinc-200 px-1.5 py-0.5 text-[11px] text-zinc-500">Esc</kbd>
        </div>
        <ul role="listbox" aria-label="Commands" className="max-h-80 overflow-y-auto p-1.5">
          {filtered.length === 0 ? (
            <li className="px-3 py-6 text-center text-sm text-zinc-500">No matching commands.</li>
          ) : (
            filtered.map((cmd, i) => (
              <li key={cmd.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={i === activeIndex}
                  onMouseEnter={() => setActiveIndex(i)}
                  onClick={() => {
                    cmd.run();
                    onClose();
                  }}
                  className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm ${FOCUS_RING} ${
                    i === activeIndex ? "bg-lime-50 text-lime-800" : "text-zinc-700"
                  }`}
                >
                  <span className="min-w-0 truncate">{cmd.label}</span>
                  {/* zinc-600, not -500: the active row's background is tinted lime-50. */}
                  <span className="shrink-0 whitespace-nowrap text-[11px] text-zinc-600">{cmd.hint}</span>
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
