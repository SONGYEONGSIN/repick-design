"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Command, Search, X, Network } from "lucide-react";
import { NODES, canonicalStatus } from "./data";
import { STATUS_META } from "./tokens";

/** Mounted only while open (see NodelineClient) — so `query`/`activeIndex` start fresh on every
 *  open for free, with no `useEffect` reset-on-open (that pattern is a `set-state-in-effect`
 *  hard-fail). No state to reset means nothing to get wrong. */
export function CommandPalette({ onClose, onSelect }: { onClose: () => void; onSelect: (id: string) => void }) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const pool = q ? NODES.filter((n) => n.label.toLowerCase().includes(q)) : NODES;
    return pool.slice(0, 8);
  }, [query]);

  const clampedIndex = Math.min(activeIndex, Math.max(results.length - 1, 0));

  function commit(id: string) {
    onSelect(id);
    onClose();
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const target = results[clampedIndex];
      if (target) commit(target.id);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[14vh]">
      <button type="button" aria-label="Close command palette" onClick={onClose} className="absolute inset-0 bg-zinc-900/40" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="relative w-full max-w-lg overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-2xl"
      >
        <div className="flex items-center gap-2.5 border-b border-zinc-200 px-4">
          <Search size={16} className="shrink-0 text-zinc-500" aria-hidden="true" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={onKeyDown}
            placeholder="Jump to a service…"
            aria-label="Search services"
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-results"
            aria-activedescendant={results[clampedIndex] ? `palette-opt-${results[clampedIndex].id}` : undefined}
            className="h-14 flex-1 bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-500"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-zinc-500 outline-none hover:bg-zinc-100 focus-visible:ring-2 focus-visible:ring-teal-700"
          >
            <X size={15} aria-hidden="true" />
          </button>
        </div>

        <ul id="palette-results" role="listbox" aria-label="Services" className="max-h-80 overflow-y-auto py-1.5">
          {results.length === 0 && <li className="px-4 py-6 text-center text-sm text-zinc-500">No services match &ldquo;{query}&rdquo;.</li>}
          {results.map((node, i) => {
            const status = canonicalStatus(node);
            const meta = STATUS_META[status];
            const Icon = meta.icon;
            return (
              <li key={node.id}>
                <button
                  id={`palette-opt-${node.id}`}
                  type="button"
                  role="option"
                  tabIndex={-1}
                  aria-selected={i === clampedIndex}
                  onMouseEnter={() => setActiveIndex(i)}
                  onClick={() => commit(node.id)}
                  className={[
                    "flex h-11 w-full items-center gap-3 px-4 text-left text-sm outline-none",
                    i === clampedIndex ? "bg-teal-50 text-teal-800" : "text-zinc-700",
                  ].join(" ")}
                >
                  <Network size={14} className="shrink-0 text-zinc-500" aria-hidden="true" />
                  <span className="min-w-0 flex-1 truncate font-mono">{node.label}</span>
                  <Icon size={13} className={`shrink-0 ${status === "healthy" ? "text-emerald-600" : status === "degraded" ? "text-amber-700" : "text-rose-700"}`} aria-hidden="true" />
                  <span className="shrink-0 text-xs text-zinc-500">{meta.label}</span>
                </button>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-3 border-t border-zinc-200 px-4 py-2 text-[11px] text-zinc-500">
          <span className="flex items-center gap-1">
            <Command size={11} aria-hidden="true" /> K to toggle
          </span>
          <span>↑↓ to navigate</span>
          <span>Enter to select</span>
          <span>Esc to close</span>
        </div>
      </div>
    </div>
  );
}
