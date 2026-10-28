"use client";

import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import type { Exchange } from "./data";
import { CURRENCY } from "./data";
import { FOCUS_RING, StatusBadge } from "./ui";

export function CommandPalette({
  open,
  onClose,
  exchanges,
  onJump,
}: {
  open: boolean;
  onClose: () => void;
  exchanges: Exchange[];
  onJump: (id: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  function handleClose() {
    setQuery("");
    onClose();
  }

  useEffect(() => {
    function onKey(ev: KeyboardEvent) {
      if (ev.key === "Escape" && open) handleClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

  const q = query.toLowerCase();
  const filtered = exchanges.filter((e) => `${e.name} ${e.type} ${e.region}`.toLowerCase().includes(q)).slice(0, 8);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 pt-28" onClick={handleClose}>
      <div role="dialog" aria-modal="true" aria-label="Jump to exchange" onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-3 shadow-xl">
        <div className="flex items-center gap-2 border-b border-zinc-100 px-2 pb-2">
          <Search className="h-4 w-4 flex-shrink-0 text-zinc-500" aria-hidden="true" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Jump to an exchange…"
            className={`w-full bg-transparent py-2 text-sm font-normal text-zinc-900 placeholder:text-zinc-500 ${FOCUS_RING}`}
          />
          <button type="button" onClick={handleClose} aria-label="Close command menu" className={`flex-shrink-0 rounded p-1 text-zinc-500 hover:text-zinc-600 ${FOCUS_RING}`}>
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        <ul className="mt-2 max-h-72 space-y-0.5 overflow-y-auto">
          {filtered.map((e) => (
            <li key={e.id}>
              <button
                type="button"
                onClick={() => {
                  onJump(e.id);
                  handleClose();
                }}
                className={`flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left text-sm font-normal text-zinc-700 hover:bg-zinc-50 ${FOCUS_RING}`}
              >
                <span className="min-w-0 flex-1 truncate">
                  {e.name} <span className="text-zinc-500">— {e.type}</span>
                </span>
                <span className="flex flex-shrink-0 items-center gap-2 tabular-nums text-xs font-normal text-zinc-500">
                  {CURRENCY.format(e.currentCpm)}
                  <StatusBadge status={e.status} />
                </span>
              </button>
            </li>
          ))}
          {filtered.length === 0 && <li className="px-2.5 py-2 text-sm font-normal text-zinc-500">No matching exchanges.</li>}
        </ul>
      </div>
    </div>
  );
}
