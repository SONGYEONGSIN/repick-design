"use client";

import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { SERVICES, STATUS_LABEL } from "./data";

// The parent only mounts this component while the palette should be open (`{paletteOpen &&
// <CommandPalette ... />}`), so a fresh mount is exactly when `query`/`highlighted` should start
// fresh — no reset-on-open effect needed.
export default function CommandPalette({
  onClose,
  onSelect,
}: {
  onClose: () => void;
  onSelect: (id: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [highlighted, setHighlighted] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = SERVICES.filter((s) => s.name.toLowerCase().includes(query.toLowerCase()));
  const safeHighlighted = Math.min(Math.max(highlighted, 0), Math.max(filtered.length - 1, 0));

  useEffect(() => {
    // Focus the input as soon as the dialog mounts so keyboard users land somewhere visible.
    const id = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(id);
  }, []);

  function selectCurrent() {
    const choice = filtered[safeHighlighted];
    if (choice) {
      onSelect(choice.id);
      onClose();
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted(Math.min(filtered.length - 1, safeHighlighted + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted(Math.max(0, safeHighlighted - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      selectCurrent();
    } else if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    }
  }

  const activeId = filtered[safeHighlighted] ? `cmdk-opt-${filtered[safeHighlighted].id}` : undefined;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-zinc-950/70 px-4 pt-[12vh]"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cmdk-title"
        className="relative w-full max-w-lg overflow-hidden rounded-xl border border-white/10 bg-zinc-900 shadow-2xl"
      >
        <h2 id="cmdk-title" className="sr-only">
          Jump to a service
        </h2>
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
          <Search aria-hidden="true" className="size-4 shrink-0 text-zinc-400" />
          <label htmlFor="cmdk-input" className="sr-only">
            Jump to a service
          </label>
          <input
            ref={inputRef}
            id="cmdk-input"
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls="cmdk-listbox"
            aria-activedescendant={activeId}
            aria-autocomplete="list"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Jump to a service..."
            className="h-10 min-w-0 flex-1 bg-transparent text-sm text-zinc-100 placeholder:text-zinc-400 focus-visible:outline-none"
          />
          <button
            type="button"
            aria-label="Close command palette"
            onClick={onClose}
            className="flex size-8 shrink-0 items-center justify-center rounded-md text-zinc-400 hover:bg-white/10 hover:text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
          >
            <X aria-hidden="true" className="size-4" />
          </button>
        </div>

        <ul id="cmdk-listbox" role="listbox" aria-label="Services" className="max-h-72 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <li className="px-3 py-6 text-center text-sm text-zinc-400">No services match &quot;{query}&quot;.</li>
          ) : (
            filtered.map((s, i) => (
              <li
                key={s.id}
                id={`cmdk-opt-${s.id}`}
                role="option"
                aria-selected={i === safeHighlighted}
                onMouseDown={(e) => {
                  e.preventDefault();
                  onSelect(s.id);
                  onClose();
                }}
                onMouseEnter={() => setHighlighted(i)}
                className={`flex cursor-pointer items-center justify-between gap-3 rounded-md px-3 py-2 text-sm ${
                  i === safeHighlighted ? "bg-violet-400/15 text-violet-100" : "text-zinc-200"
                }`}
              >
                <span className="truncate font-medium">{s.name}</span>
                <span className="shrink-0 text-xs text-zinc-400">{STATUS_LABEL[s.status]}</span>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
