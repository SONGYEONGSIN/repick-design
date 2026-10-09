"use client";

import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import type { Kpi } from "./data";

export function CommandPalette({
  open,
  onClose,
  kpis,
  onSelect,
  returnFocusRef,
}: {
  open: boolean;
  onClose: () => void;
  kpis: Kpi[];
  onSelect: (id: string) => void;
  returnFocusRef: React.RefObject<HTMLButtonElement | null>;
}) {
  const [query, setQuery] = useState("");
  const [highlight, setHighlight] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const wasOpen = useRef(false);

  // Adjusting state during render in response to a prop change, per React's
  // guidance ("you might not need an Effect" / adjusting state when a prop
  // changes): reset the search query and highlight the instant `open` flips
  // from false to true, without round-tripping through an Effect.
  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setQuery("");
      setHighlight(0);
    }
  }

  const matches = kpis.filter((kpi) => kpi.name.toLowerCase().includes(query.trim().toLowerCase()));

  useEffect(() => {
    if (open) {
      wasOpen.current = true;
      const id = window.setTimeout(() => inputRef.current?.focus(), 0);
      return () => window.clearTimeout(id);
    }
    // Only return focus to the trigger if the palette was actually open before —
    // skips stealing focus on first mount, when it has always been closed.
    if (wasOpen.current) {
      returnFocusRef.current?.focus();
    }
  }, [open, returnFocusRef]);

  if (!open) return null;

  const pick = (id: string) => {
    onSelect(id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-zinc-900/40 px-4 pt-24">
      <button
        type="button"
        tabIndex={-1}
        aria-hidden="true"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="relative w-full max-w-lg rounded-xl border border-zinc-200 bg-white shadow-xl"
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            onClose();
          } else if (e.key === "ArrowDown") {
            e.preventDefault();
            setHighlight((h) => Math.min(h + 1, Math.max(matches.length - 1, 0)));
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setHighlight((h) => Math.max(h - 1, 0));
          } else if (e.key === "Enter" && matches[highlight]) {
            e.preventDefault();
            pick(matches[highlight].id);
          }
        }}
      >
        <div className="flex items-center gap-2 border-b border-zinc-200 px-4 py-3">
          <Search aria-hidden="true" className="size-4 shrink-0 text-zinc-500" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setHighlight(0);
            }}
            placeholder="Jump to a variance investigation…"
            aria-label="Search KPIs"
            className="min-w-0 flex-1 rounded bg-transparent text-sm text-zinc-900 placeholder:text-zinc-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex size-7 shrink-0 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
          >
            <X aria-hidden="true" className="size-4" />
          </button>
        </div>
        <ul aria-label="KPIs" className="max-h-72 overflow-y-auto p-1.5">
          {matches.map((kpi, i) => (
            <li key={kpi.id}>
              <button
                type="button"
                onClick={() => pick(kpi.id)}
                onMouseEnter={() => setHighlight(i)}
                className={`flex w-full items-center justify-between gap-2 rounded-md px-3 py-2 text-left text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 ${
                  i === highlight ? "bg-sky-50 text-sky-900" : "text-zinc-700"
                }`}
              >
                <span className="truncate font-medium">{kpi.name}</span>
                <span className="shrink-0 text-xs text-zinc-500">{kpi.badge}</span>
              </button>
            </li>
          ))}
          {matches.length === 0 && (
            <li className="px-3 py-6 text-center text-sm text-zinc-500">No matching KPI.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
