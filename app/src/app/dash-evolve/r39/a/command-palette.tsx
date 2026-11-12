"use client";

import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import type { KpiDefinition } from "./data";
import { formatMoneyK } from "./utils";

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  kpis: KpiDefinition[];
  onSelect: (id: string) => void;
}

/**
 * ⌘K metric search. The `query` field resets whenever the palette opens, but
 * that reset happens by *comparing the current `open` prop to a stored copy
 * of its previous value during render* and calling setState directly in the
 * render body when they differ — the React-recommended "adjusting state when
 * a prop changes" pattern. It deliberately does NOT reset `query` inside a
 * `useEffect` keyed on `open`, which is the derived-state-in-effect
 * anti-pattern that `react-hooks/set-state-in-effect` flags.
 */
export default function CommandPalette({ open, onClose, kpis, onSelect }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [wasOpen, setWasOpen] = useState(open);
  const inputRef = useRef<HTMLInputElement>(null);

  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setQuery("");
    }
  }

  // Imperative focus management (not a state update) is a legitimate effect,
  // distinct from the setState-in-effect anti-pattern above.
  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  if (!open) return null;

  const normalizedQuery = query.toLowerCase();
  const results = kpis.filter(
    (kpi) =>
      kpi.label.toLowerCase().includes(normalizedQuery) ||
      kpi.category.toLowerCase().includes(normalizedQuery)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-zinc-950/70 px-4 pt-24">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search metrics"
        className="w-full max-w-lg rounded-xl border border-white/10 bg-zinc-900 shadow-xl"
      >
        <div className="flex h-11 items-center gap-2 border-b border-white/10 px-4">
          <Search className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Escape") onClose();
            }}
            aria-label="Search metrics by name or category"
            placeholder="Search metrics by name or category..."
            className="w-full rounded-md bg-transparent font-normal text-sm text-zinc-50 placeholder:text-zinc-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="shrink-0 rounded-md p-1.5 text-zinc-400 hover:text-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        <ul className="max-h-72 overflow-y-auto p-2">
          {results.length === 0 ? (
            <li className="px-3 py-6 text-center font-normal text-sm text-zinc-400">
              No metrics match &quot;{query}&quot;.
            </li>
          ) : (
            results.map((kpi) => (
              <li key={kpi.id}>
                <button
                  type="button"
                  onClick={() => {
                    onSelect(kpi.id);
                    onClose();
                  }}
                  className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400"
                >
                  <span className="min-w-0 truncate font-medium text-sm text-zinc-50">{kpi.label}</span>
                  <span className="shrink-0 font-normal text-xs tabular-nums text-zinc-400">
                    {formatMoneyK(kpi.root.value)}
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
