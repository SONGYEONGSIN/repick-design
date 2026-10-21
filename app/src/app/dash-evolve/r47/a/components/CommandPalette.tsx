"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Search } from "lucide-react";
import { FOCUS_RING } from "./ui";

export interface PaletteCommand {
  id: string;
  label: string;
  hint: string;
  run: () => void;
}

export function CommandPalette({
  open,
  onClose,
  commands,
}: {
  open: boolean;
  onClose: () => void;
  commands: PaletteCommand[];
}) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const filtered = commands.filter((c) => c.label.toLowerCase().includes(query.toLowerCase()));

  // Reset query/index when the palette opens, and re-clamp the index whenever the query
  // changes -- both done as render-time state adjustments (the documented React pattern for
  // "derive state from a prop/state change") rather than inside an effect, which would
  // otherwise trigger a synchronous cascading re-render (react-hooks/set-state-in-effect).
  const [wasOpen, setWasOpen] = useState(false);
  const [prevQuery, setPrevQuery] = useState(query);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setQuery("");
      setActiveIndex(0);
    }
  }
  if (query !== prevQuery) {
    setPrevQuery(query);
    setActiveIndex(0);
  }

  useEffect(() => {
    if (open) {
      // Focus happens on mount of the input below via autoFocus-equivalent effect.
      const id = requestAnimationFrame(() => inputRef.current?.focus());
      return () => cancelAnimationFrame(id);
    }
  }, [open]);

  if (!open) return null;

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      e.preventDefault();
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
      <button
        type="button"
        tabIndex={-1}
        aria-label="Close command palette"
        onClick={onClose}
        className="fixed inset-0 bg-black/60"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 shadow-2xl"
      >
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
          <Search className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls="command-palette-list"
            aria-activedescendant={filtered[activeIndex] ? `cmd-${filtered[activeIndex].id}` : undefined}
            placeholder="Type a command…"
            className={`h-8 w-full bg-transparent text-sm text-zinc-50 placeholder:text-zinc-400 ${FOCUS_RING}`}
          />
          <kbd className="shrink-0 rounded border border-white/10 bg-zinc-950 px-1.5 py-0.5 text-[11px] text-zinc-400">
            Esc
          </kbd>
        </div>
        <ul id="command-palette-list" role="listbox" className="max-h-72 overflow-y-auto p-1.5">
          {filtered.length === 0 ? (
            <li className="px-3 py-6 text-center text-xs text-zinc-400">No commands match &ldquo;{query}&rdquo;.</li>
          ) : (
            filtered.map((cmd, i) => (
              <li key={cmd.id} id={`cmd-${cmd.id}`} role="option" aria-selected={i === activeIndex}>
                <button
                  type="button"
                  onMouseEnter={() => setActiveIndex(i)}
                  onClick={() => {
                    cmd.run();
                    onClose();
                  }}
                  className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm ${FOCUS_RING} ${
                    i === activeIndex ? "bg-emerald-400/15 text-emerald-300" : "text-zinc-300"
                  }`}
                >
                  <span className="truncate">{cmd.label}</span>
                  <span className="shrink-0 text-xs text-zinc-400">{cmd.hint}</span>
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
