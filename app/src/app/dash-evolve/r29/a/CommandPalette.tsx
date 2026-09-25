"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { STATUS_META, currencyFmt, type Lot } from "./data";
import { FOCUS_RING } from "./ui";

export function CommandPalette({
  open,
  lots,
  onClose,
  onSelect,
}: {
  open: boolean;
  lots: Lot[];
  onClose: () => void;
  onSelect: (id: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [wasOpen, setWasOpen] = useState(open);
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset the query synchronously during render when `open` flips true, matching
  // React's documented pattern for adjusting state from a changed prop.
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setQuery("");
  }

  useEffect(() => {
    if (open) {
      const t = window.setTimeout(() => inputRef.current?.focus(), 0);
      return () => window.clearTimeout(t);
    }
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const pool = q
      ? lots.filter((l) => l.code.toLowerCase().includes(q) || l.title.toLowerCase().includes(q) || l.category.toLowerCase().includes(q))
      : lots;
    return pool.slice(0, 8);
  }, [lots, query]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-zinc-950/70 px-4 pt-24"
      onClick={onClose}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search lots by code, title, or category"
        className="w-full max-w-lg overflow-hidden rounded-xl border border-white/10 bg-zinc-900 shadow-2xl shadow-black/50"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 border-b border-white/10 px-4">
          <Search aria-hidden="true" className="h-4 w-4 shrink-0 text-zinc-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by lot code, title, or category&hellip;"
            className={`h-12 flex-1 rounded bg-transparent text-sm font-normal text-zinc-50 placeholder:text-zinc-400 ${FOCUS_RING}`}
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-zinc-400 hover:bg-white/5 hover:text-zinc-50 ${FOCUS_RING}`}
          >
            <X aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>
        <ul className="max-h-80 overflow-y-auto py-2">
          {results.map((lot) => {
            const meta = STATUS_META[lot.status];
            const Icon = meta.icon;
            return (
              <li key={lot.id}>
                <button
                  type="button"
                  onClick={() => {
                    onSelect(lot.id);
                    onClose();
                  }}
                  className={`flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-white/5 ${FOCUS_RING}`}
                >
                  <Icon aria-hidden="true" className={`h-4 w-4 shrink-0 ${meta.text}`} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-normal text-zinc-50">{lot.title}</span>
                    <span className="block truncate text-xs font-normal text-zinc-400">
                      {lot.code} &middot; {lot.category}
                    </span>
                  </span>
                  <span className="shrink-0 whitespace-nowrap text-xs font-normal tabular-nums text-zinc-400">{currencyFmt.format(lot.currentPrice)}</span>
                </button>
              </li>
            );
          })}
          {results.length === 0 && <li className="px-4 py-6 text-center text-sm font-normal text-zinc-400">No matches.</li>}
        </ul>
      </div>
    </div>
  );
}
