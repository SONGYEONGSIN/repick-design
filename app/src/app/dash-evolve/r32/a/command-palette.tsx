"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import type { Signal } from "./data";
import { formatWithUnit, isCurrentlyElevated, latestValue } from "./data";
import { FOCUS_RING, SignalStatusBadge, cx } from "./ui";

interface Props {
  open: boolean;
  signals: Signal[];
  onClose: () => void;
  onSelect: (id: string) => void;
}

export default function CommandPalette({ open, signals, onClose, onSelect }: Props) {
  const [query, setQuery] = useState("");
  const [wasOpen, setWasOpen] = useState(open);
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset the query synchronously during render when `open` flips true, following React's
  // documented pattern for adjusting state from a prop change during render.
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setQuery("");
  }

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => inputRef.current?.focus(), 0);
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const pool = q ? signals.filter((s) => s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q)) : signals;
    return pool.slice(0, 10);
  }, [query, signals]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-zinc-900/50 px-4 pt-24"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search signals and cases"
        className="w-full max-w-lg overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 border-b border-zinc-200 px-4">
          <Search aria-hidden className="h-4 w-4 shrink-0 text-zinc-500" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by signal or category…"
            aria-label="Search signals and cases"
            className={cx("h-12 flex-1 rounded bg-transparent text-[13px] text-zinc-900 placeholder:text-zinc-500", FOCUS_RING)}
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className={cx("flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700", FOCUS_RING)}
          >
            <X aria-hidden className="h-4 w-4" />
          </button>
        </div>
        <ul className="max-h-80 overflow-y-auto py-2">
          {results.map((signal) => {
            const elevated = isCurrentlyElevated(signal);
            return (
              <li key={signal.id}>
                <button
                  type="button"
                  onClick={() => {
                    onSelect(signal.id);
                    onClose();
                  }}
                  className={cx("flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-zinc-50", FOCUS_RING)}
                >
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-medium text-zinc-900">{signal.name}</span>
                    <span className="block truncate text-[11px] text-zinc-500">{signal.category}</span>
                  </span>
                  <span className="shrink-0 whitespace-nowrap text-[12px] font-medium tabular-nums text-zinc-600">
                    {formatWithUnit(signal, latestValue(signal))}
                  </span>
                  <SignalStatusBadge elevated={elevated} />
                </button>
              </li>
            );
          })}
          {results.length === 0 && <li className="px-4 py-6 text-center text-[12px] text-zinc-500">No matches.</li>}
        </ul>
      </div>
    </div>
  );
}
