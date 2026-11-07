"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search, X, CornerDownLeft } from "lucide-react";
import { SERVICES } from "./data";
import { NODE_ICONS, STATUS_META } from "./icons";
import { FOCUS_RING } from "./ui";

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
  const [highlighted, setHighlighted] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length === 0) return SERVICES;
    return SERVICES.filter(
      (node) =>
        node.name.toLowerCase().includes(q) ||
        node.team.toLowerCase().includes(q) ||
        node.summary.toLowerCase().includes(q),
    );
  }, [query]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setHighlighted(0);
      const id = requestAnimationFrame(() => inputRef.current?.focus());
      return () => cancelAnimationFrame(id);
    }
    return undefined;
  }, [open]);

  useEffect(() => {
    setHighlighted(0);
  }, [query]);

  if (!open) return null;

  function commit(id: string) {
    onSelect(id);
    onClose();
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((h) => Math.min(h + 1, Math.max(results.length - 1, 0)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const target = results[highlighted];
      if (target) commit(target.id);
    } else if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-20 sm:pt-28">
      <button
        type="button"
        aria-label="Close command palette"
        onClick={onClose}
        className="absolute inset-0 bg-zinc-900/40"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search services"
        className="relative z-10 w-full max-w-lg overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xl"
      >
        <div className="flex items-center gap-2 border-b border-zinc-200 px-4">
          <Search size={16} className="flex-shrink-0 text-zinc-400" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Jump to a service…"
            aria-label="Search services"
            aria-controls="palette-results"
            aria-activedescendant={results[highlighted] ? `palette-opt-${results[highlighted].id}` : undefined}
            role="combobox"
            aria-expanded
            autoComplete="off"
            className="h-12 flex-1 bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-400"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className={`inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md text-zinc-400 hover:text-zinc-700 ${FOCUS_RING}`}
          >
            <X size={15} aria-hidden="true" />
          </button>
        </div>
        <ul id="palette-results" role="listbox" aria-label="Services" className="max-h-80 overflow-y-auto p-1.5">
          {results.length === 0 ? (
            <li className="px-3 py-6 text-center text-sm text-zinc-500">No services match &ldquo;{query}&rdquo;.</li>
          ) : (
            results.map((node, i) => {
              const Icon = NODE_ICONS[node.icon];
              const meta = STATUS_META[node.status];
              const StatusIcon = meta.icon;
              const isHighlighted = i === highlighted;
              return (
                <li key={node.id} role="option" id={`palette-opt-${node.id}`} aria-selected={isHighlighted}>
                  <button
                    type="button"
                    onMouseEnter={() => setHighlighted(i)}
                    onClick={() => commit(node.id)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left ${FOCUS_RING} ${
                      isHighlighted ? "bg-indigo-50" : "hover:bg-zinc-50"
                    }`}
                  >
                    <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600">
                      <Icon size={15} aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-zinc-900">{node.name}</span>
                      <span className="block truncate text-xs text-zinc-500">{node.team}</span>
                    </span>
                    <span className={`inline-flex flex-shrink-0 items-center gap-1 text-[11px] font-medium ${meta.text}`}>
                      <StatusIcon size={12} aria-hidden="true" />
                      {meta.label}
                    </span>
                  </button>
                </li>
              );
            })
          )}
        </ul>
        <div className="flex items-center gap-3 border-t border-zinc-200 bg-zinc-50 px-4 py-2 text-[11px] text-zinc-500">
          <span className="inline-flex items-center gap-1">
            <CornerDownLeft size={12} aria-hidden="true" /> select
          </span>
          <span>↑↓ navigate</span>
          <span>esc close</span>
        </div>
      </div>
    </div>
  );
}
